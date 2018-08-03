

import * as gulp from "gulp";
import { GulpPlugins } from "./gulp-types";
import { TaskFunc } from "orchestrator";

import * as fs from "fs";
import * as request from "request";

import * as helper from "./gulp-helper";
import * as yaml from "js-yaml";

// This will keep track of the number of times we've checked the build status.
let statusCheckCount = 0;

// Define a helper function that we'll use to poll the build status.
let waitOnRemoteBuild = function (config, baseUrl, buildNumber, waitOnRemoteBuildCallback) {

    let tasksUrl = `${baseUrl}cordova/build/tasks/${buildNumber}`;

    // Make a request to get the status.
    request.get(tasksUrl, function (err, tasksResponse) {

        if (err) {
            waitOnRemoteBuildCallback(err);
            return;
        }

        // Increment the counter so we know when to stop checking.
        statusCheckCount += 1;

        // If we've gotten to the max number of checks, the bail out.
        if (statusCheckCount > config.maxStatusChecks) {
            waitOnRemoteBuildCallback(new Error(`The build was not marked as completed after ${config.maxStatusChecks} status checks.`));
            return;
        }

        let tasksResponseData = JSON.parse(tasksResponse.body);

        // If the task is still building or in the upload phase, wait to poll again.
        // Otherwise we can bail out.
        if (tasksResponseData.status === "Building"
            || tasksResponseData.status === "Uploaded"
            || tasksResponseData.status === "Uploading") {

            helper.info(helper.format("{0}: Checking status ({1}/{2}): {3} - {4}",
                            tasksResponseData.statusTime,
                            statusCheckCount,
                            config.maxStatusChecks,
                            tasksResponseData.status,
                            tasksResponseData.message));

            setTimeout(function () {
                waitOnRemoteBuild(config, baseUrl, buildNumber, waitOnRemoteBuildCallback);
            }, config.statusCheckDelayMs);
        }
        else {

            helper.info(helper.format("{0}: {1} - {2}",
                            tasksResponseData.statusTime,
                            tasksResponseData.status,
                            tasksResponseData.message));

            waitOnRemoteBuildCallback(null, tasksResponseData);
        }
    });
};

/**
 * Used to launch the iOS simulator on a remote OS X machine.
 * 
 * The remote machine must be running the remotebuild server:
 * https://www.npmjs.com/package/remotebuild
 * 
 * Server configuration is located in resources/build/remote.yml
 * 
 * Useful to quickly execute from Visual Studio Code's task launcher:
 * Bind CMD+Shift+R to "workbench.action.tasks.runTask task launcher"
 * 
 * This does not compile SASS, TypeScript, templates, etc.
 */
module.exports = function(gulp: gulp.Gulp, plugins: GulpPlugins): TaskFunc {

    return function(cb) {

        // Load the remote build configuration.
        let configYmlRaw = fs.readFileSync("resources/build/remote.yml", "utf8");
        let config = yaml.safeLoad(configYmlRaw);

        if (!config) {
            throw new Error("Unable to read remote build config from resources/build/remote.yml");
        }

        // Ignore invalid/self-signed certificates based on configuration.
        if (config.allowInvalidSslCerts) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        }

        // Build the base URL for all subsequent requests. This is the machine
        // that is running the remotebuild server.
        let baseUrl = helper.format("{0}://{1}:{2}{3}",
                        config.ssl ? "https" : "http",
                        config.host,
                        config.port,
                        config.path);

        let payloadUploadUrl = helper.format("{0}cordova/build/tasks?command={1}&vcordova={2}&cfg={3}&loglevel={4}",
                                baseUrl,
                                "build",
                                config.cordovaVersion,
                                helper.isDebugBuild() ? "debug" : "release",
                                config.logLevel);

        let payloadStream = fs.createReadStream("build/remote/taco-payload.tar.gz");

        helper.info("Using remote build package at: build/remote/taco-payload.tar.gz");
        helper.info(`Uploading build to: ${payloadUploadUrl}`);

        // Make the HTTP POST request with the payload in the body.
        payloadStream.pipe(request.post(payloadUploadUrl, function (err, uploadResponse) {

            if (err) {
                cb(err);
                return;
            }

            // A successful upload is a 202 Accepted, but we'll treat any 200 status as OK.
            if (uploadResponse.statusCode < 200 || uploadResponse.statusCode >= 300) {
                cb(new Error(`Error when uploading payload: HTTP ${uploadResponse.statusCode} - ${payloadStream}"`));
                return;
            }

            let uploadResponseData = JSON.parse(uploadResponse.body);

            // If it wasn't uploaded, then we can't continue.
            if (uploadResponseData.status !== "Uploaded") {
                helper.info(uploadResponseData);
                cb(new Error(`A non-'Uploaded' status was received after uploading the payload: ${uploadResponseData.status} - ${uploadResponseData.message}`));
                return;
            }

            // Grab the build number for this payload; we'll need it for subsequent calls.
            let buildNumber = uploadResponseData.buildNumber;

            if (!buildNumber) {
                cb(new Error("A build number was not received after uploading the payload."));
                return;
            }

            helper.info(`Payload uploaded; waiting for build ${buildNumber} to complete...`);

            statusCheckCount = 0;

            // Here we'll wait until the build process has completed before continuing.
            waitOnRemoteBuild(config, baseUrl, buildNumber, function (err, taskStatus) {

                if (err) {
                    cb(err);
                    return;
                }

                let logsUrl = `${baseUrl}cordova/build/tasks/${buildNumber}/log`;

                helper.info(`Build ended with status: ${taskStatus.status} - ${taskStatus.message}`);

                helper.info(`Now retreiving logs for build ${buildNumber}...`);

                // The build has finished, so lets go get the logs.
                request.get(logsUrl, function (err, logsResponse) {

                    if (err) {
                        cb(err);
                        return;
                    }

                    // Write the logs to disk.
                    helper.info(`Writing server build logs to: ${config.logFile}`);
                    fs.writeFileSync(config.logFile, logsResponse.body, "utf8");

                    // If the build wasn't successful, then bail out here.
                    if (taskStatus.status !== "Complete") {
                        helper.info(taskStatus);
                        cb(new Error(`A non-'Complete' status was received after waiting for a build to complete: ${taskStatus.status} - ${taskStatus.message}`));
                        return;
                    }

                    let emulateUrl = helper.format("{0}cordova/build/{1}/emulate?target={2}",
                                        baseUrl,
                                        buildNumber,
                                        encodeURIComponent(config.emulationTarget));

                    helper.info(`Starting emulator for build ${buildNumber}...`);

                    // Now make a call to start the emulator.
                    request.get(emulateUrl, function (err, emulateResponse) {

                        if (err) {
                            cb(err);
                            return;
                        }

                        let emulateResponseData = JSON.parse(emulateResponse.body);

                        if (emulateResponseData.status === "Emulated") {
                            helper.info(`${emulateResponseData.status} - ${emulateResponseData.message}`);
                            cb();
                        }
                        else {
                            helper.info(emulateResponse);
                            cb(new Error(`A non-'Emulated' response was received when requesting emulation: ${emulateResponseData.status} - ${emulateResponseData.message}`));
                        }
                    });
                });
            });
        }));
    };
};
