
/*globals Buffer, __dirname, process*/


// Native Node Modules
var exec = require("child_process").exec;
var del = require("del");
var fs = require("fs");

// Gulp & Gulp Plugins
var gulp = require("gulp");
var gutil = require("gulp-util");
var gulpif = require("gulp-if");
var rename = require("gulp-rename");
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");
var typedoc = require("gulp-typedoc");
var tar = require("gulp-tar");
var gzip = require("gulp-gzip");
var eol = require("gulp-eol");

// Other Modules
var runSequence = require("run-sequence");
var bower = require("bower");
var request = require("request");
var sh = require("shelljs");
var async = require("async");
var xpath = require("xpath");
var XmlDom = require("xmldom").DOMParser;
var karma = require("karma").server;


var paths = {
    ts: ["./src/**/*.ts"],
    www: ["./www/**/*.*"],
    tests: ["./tests/**/*.ts"],
    chromeIcon: ["./resources/icon.png"],
    chromeManifest: ["./chrome-manifest.json"],
    remoteBuildFiles: [
        "./merges/**",
        "./resources/**",
        "./hooks/**",
        "./plugins/**",
        "./www/**",
        "./config.xml",
        "package.json"
    ]
};

/**
 * Used to determine if the gulp operation was launched for a debug or release build.
 * This is controlled by the scheme parameter, if no scheme is provided, it will default
 * to debug. For example, to specify release build for the ts task you"d use:
 * 
 * gulp ts --scheme release
 */
function isDebugScheme() {
    return gutil.env.scheme === "release" ? false : true;
}

/**
 * A custom reporter for the TypeScript linter reporter function. This was copied
 * and modified from gulp-tslint.
 */
function logTsError(message, level) {
    var prefix = "[" + gutil.colors.cyan("gulp-tslint") + "]";

    if (level === "error") {
        gutil.log(prefix, gutil.colors.red("error"), message);
    } else if (level === "warn") {
        gutil.log(prefix, gutil.colors.yellow("warn"), message);
    } else {
        gutil.log(prefix, message);
    }
}

/**
 * A custom reporter for the TypeScript linter so we can pass "warn" instead of
 * "error" to be recognized by Visual Studio Code"s pattern matcher as warnings
 * instead of errors. This was copied and modified from gulp-tslint.
 */
var tsLintReporter = function(failures, file) {
    failures.forEach(function(failure) {
        // line + 1 because TSLint"s first line and character is 0
        logTsError("(" + failure.ruleName + ") " + file.path +
            "[" + (failure.startPosition.line + 1) + ", " +
            (failure.startPosition.character + 1) + "]: " +
            failure.failure, "warn");
    });
};

/**
 * Helper used to pipe an arbitrary string value into a file.
 * 
 * http://stackoverflow.com/a/23398200/4005811
 */
function string_src(filename, str) {
    var src = require("stream").Readable({ objectMode: true });

    src._read = function () {
        this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(str) }));
        this.push(null);
    };

    return src;
}

/**
 * Used to format a string by replacing values with the given arguments.
 * Arguments should be provided in the format of {x} where x is the index
 * of the argument to be replaced corresponding to the arguments given.
 * 
 * For example, the string t = "Hello there {0}, it is {1} to meet you!"
 * used like this: Utilities.format(t, "dude", "nice") would result in:
 * "Hello there dude, it is nice to meet you!".
 * 
 * @param str The string value to use for formatting.
 * @param args The values to inject into the format string.
 */
function format(formatString) {
    var i, reg;
    i = 0;

    for (i = 0; i < arguments.length - 1; i += 1) {
        reg = new RegExp("\\{" + i + "\\}", "gm");
        formatString = formatString.replace(reg, arguments[i + 1]);
    }

    return formatString;
}

/**
 * The default task downloads Cordova plugins, Bower libraries, TypeScript definitions,
 * and then lints and builds the TypeScript source code.
 */
gulp.task("default", function (cb) {
    runSequence("plugins", "libs", "tsd", "ts", cb);
});

/**
 * The watch task will watch for any changes in the TypeScript files and re-execute the
 * ts gulp task if they change. The "ionic serve" command will also invoke this task to
 * refresh the browser window during development.
 */
gulp.task("watch", function() {
    gulp.watch(paths.ts, ["ts"]);
});

/**
 * Simply delegates to the "ionic emulate ios" command.
 * 
 * Useful to quickly execute from Visual Studio Code"s task launcher:
 * Bind CMD+Shift+R to "workbench.action.tasks.runTask task launcher"
 */
gulp.task("emulate-ios", ["ts"], function(cb) {
    exec("ionic emulate ios");
    cb();
});

/**
 * Used to launch the iOS simulator on a remote OS X machine.
 * 
 * The remote machine must be running the remotebuild server:
 * https://www.npmjs.com/package/remotebuild
 * 
 * Server configuration is located in remote-build.json
 * 
 * Useful to quickly execute from Visual Studio Code"s task launcher:
 * Bind CMD+Shift+R to "workbench.action.tasks.runTask task launcher"
 */
gulp.task("remote-emulate-ios", function(cb) {

    // First we'll compile the TypeScript and build the application payload.
    runSequence("ts", "package-remote-build", function (err) {

        if (err) {
            cb(err);
            return;
        }

        // Load the remote build configuration.
        var config = JSON.parse(fs.readFileSync("remote-build.json", "utf8"));

        // Ignore invalid/self-signed certificates based on configuration.
        if (config.allowInvalidSslCerts) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        }

        // Build the base URL for all subsequent requests. This is the machine
        // that is running the remotebuild server.
        var baseUrl = format("{0}://{1}:{2}{3}",
                        config.ssl ? "https" : "http",
                        config.host,
                        config.port,
                        config.path);

        // This will keep track of the number of times we've checked the build status.
        var statusCheckCount = 0;

        // Define a helper function that we'll use to poll the build status.
        var waitOnRemoteBuild = function (buildNumber, waitOnRemoteBuildCallback) {

            var tasksUrl = format("{0}cordova/build/tasks/{1}",
                                baseUrl,
                                buildNumber);

            // Make a request to get the status.
            request.get(tasksUrl, function (err, tasksResponse) {

                if (err) {
                    cb(err);
                    return;
                }

                // Increment the counter so we know when to stop checking.
                statusCheckCount += 1;

                // If we've gotten to the max number of checks, the bail out.
                if (statusCheckCount > config.maxStatusChecks) {
                    cb(new Error(format("The build was not marked as completed after {0} status checks.", config.maxStatusChecks)));
                    return;
                }

                var tasksResponseData = JSON.parse(tasksResponse.body);

                // If the task is still building or in the upload phase, wait to poll again.
                // Otherwise we can bail out.
                if (tasksResponseData.status === "Building"
                    || tasksResponseData.status === "Uploaded"
                    || tasksResponseData.status === "Uploading") {

                    console.log(format("{0}: Checking status ({1}/{2}): {3} - {4}",
                                    tasksResponseData.statusTime,
                                    statusCheckCount,
                                    config.maxStatusChecks,
                                    tasksResponseData.status,
                                    tasksResponseData.message));

                    setTimeout(function () {
                        waitOnRemoteBuild(buildNumber, waitOnRemoteBuildCallback);
                    }, config.statusCheckDelayMs);
                }
                else {

                    console.log(format("{0}: {1} - {2}",
                                    tasksResponseData.statusTime,
                                    tasksResponseData.status,
                                    tasksResponseData.message));
                    
                    waitOnRemoteBuildCallback(null, tasksResponseData);
                }
            });
        };

        var payloadUploadUrl = format("{0}cordova/build/tasks?command={1}&vcordova={2}&cfg={3}&loglevel={4}",
                                baseUrl,
                                "build",
                                config.cordovaVersion,
                                isDebugScheme() ? "debug" : "release",
                                config.logLevel);

        var payloadStream = fs.createReadStream("tmp/taco-payload.tgz.gz");

        console.log(format("Uploading build to: {0}", payloadUploadUrl));

        // Make the HTTP POST request with the payload in the body.
        payloadStream.pipe(request.post(payloadUploadUrl, function (err, uploadResponse) {

            if (err) {
                cb(err);
                return;
            }

            // A successful upload is a 202 Accepted, but we'll treat any 200 status as OK.
            if (uploadResponse.statusCode < 200 || uploadResponse.statusCode >= 300) {
                cb(new Error(format("Error when uploading payload: HTTP {0} - {1}", uploadResponse.statusCode, payloadStream)));
                return;
            }

            var uploadResponseData = JSON.parse(uploadResponse.body);

            // If it wasn't uploaded, then we can't continue.
            if (uploadResponseData.status !== "Uploaded") {
                console.log(uploadResponseData);
                cb(new Error(format("A non-'Uploaded' status was received after uploading the payload: {0} - {1}", uploadResponseData.status, uploadResponseData.message)));
                return;
            }

            // Grab the build number for this payload; we'll need it for subsequent calls.
            var buildNumber = uploadResponseData.buildNumber;

            if (!buildNumber) {
                cb(new Error("A build number was not received after uploading the payload."));
                return;
            }

            console.log(format("Payload uploaded; waiting for build {0} to complete...", buildNumber));

            // Here we'll wait until the build process has completed before continuing.
            waitOnRemoteBuild(buildNumber, function (err, taskStatus) {

                if (err) {
                    cb(err);
                    return;
                }

                var logsUrl = format("{0}cordova/build/tasks/{1}/log", baseUrl, buildNumber);

                console.log(format("Build ended with status: {0} - {1}", taskStatus.status, taskStatus.message));

                console.log(format("Now retreiving logs for build {0}...", buildNumber));

                // The build has finished, so lets go get the logs.
                request.get(logsUrl, function (err, logsResponse) {

                    if (err) {
                        cb(err);
                        return;
                    }

                    // Write the logs to disk.
                    console.log(format("Writing server build logs to: {0}", config.logFile));
                    fs.writeFile(config.logFile, logsResponse.body);

                    // If the build wasn't successful, then bail out here.
                    if (taskStatus.status !== "Complete") {
                        console.log(taskStatus);
                        cb(new Error(format("A non-'Complete' status was received after waiting for a build to complete: {0} - {1}", taskStatus.status, taskStatus.message)));
                        return;
                    }

                    var emulateUrl = format("{0}cordova/build/{1}/emulate?target={2}",
                                        baseUrl,
                                        buildNumber,
                                        encodeURIComponent(config.emulationTarget));

                    console.log(format("Starting emulator for build {0}...", buildNumber));

                    // Now make a call to start the emulator.
                    request.get(emulateUrl, function (err, emulateResponse) {

                        if (err) {
                            cb(err);
                            return;
                        }

                        var emulateResponseData = JSON.parse(emulateResponse.body);

                        if (emulateResponseData.status === "Emulated") {
                            console.log(format("{0} - {1}", emulateResponseData.status, emulateResponseData.message));
                            cb();
                        }
                        else {
                            console.log(emulateResponse);
                            cb(new Error(format("A non-'Emulated' response was received when requesting emulation: {0} - {1}", emulateResponseData.status, emulateResponseData.message)));
                        }
                    });
                });
            });
        }));
    });
});

/**
 * Simply delegates to the "ionic emulate android" command.
 * 
 * Useful to quickly execute from Visual Studio Code"s task launcher:
 * Bind CMD+Shift+R to "workbench.action.tasks.runTask task launcher"
 */
gulp.task("emulate-android", ["ts"], function(cb) {
    exec("ionic emulate android");
    cb();
});

/**
 * Performs linting of the TypeScript source code.
 */
gulp.task("lint", function (cb) {
    var filesToLint = paths.ts.concat(paths.tests);

    return gulp.src(filesToLint)
    .pipe(tslint())
    .pipe(tslint.report(tsLintReporter));
});

/**
 * Run all of the unit tests once and then exit.
 * 
 * A Karma test server instance must be running first (eg karma start).
 */
gulp.task("test", ["ts:tests"], function (done) {
    karma.start({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    }, function (err, result) {
        // When a non-zero code is returned by Karma something went wrong.
        done(err === 0 ? null : "There are failing unit tests");
    });
});

/**
 * Uses the tsd command to restore TypeScript definitions to the typings
 * directories and rebuild the tsd.d.ts typings bundle for both the app
 * as well as the unit tests.
 */
gulp.task("tsd", function (cb) {
    runSequence("tsd:app", "tsd:tests", cb);
});

/**
 * Uses the tsd command to restore TypeScript definitions to the typings
 * directory and rebuild the tsd.d.ts typings bundle (for the app).
 */
gulp.task("tsd:app", function (cb) {
    // First reinstall any missing definitions to the typings directory.
    exec("tsd reinstall", function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);

        if (err) {
            cb(err);
            return;
        }

        // Rebuild the src/tsd.d.ts bundle reference file.
        exec("tsd rebundle", function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    });
});

/**
 * Uses the tsd command to restore TypeScript definitions to the typings
 * directory and rebuild the tsd.d.ts typings bundle (for the unit tests).
 */
gulp.task("tsd:tests", function (cb) {
    // First reinstall any missing definitions to the typings-tests directory.
    exec("tsd reinstall --config tsd.tests.json", function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);

        if (err) {
            cb(err);
            return;
        }

        // Rebuild the tests/tsd.d.ts bundle reference file.
        exec("tsd rebundle --config tsd.tests.json", function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    });
});

/**
 * Used to generate the www/js/BuildVars.js file which contains information about
 * the build (such as version number, timestamp, and build scheme) as well as any
 * other variables that should be defined at build time (API URLs etc).
 * 
 * The version number is taken from the config.xml file.
 */
gulp.task("ts:vars", function (cb) {
    var configXml,
        configXmlDoc,
        majorVersion = 0,
        minorVersion = 0,
        buildVersion = 0,
        apiUrl;

    // Attempt to query and parse the version information from config.xml.
    // Default to 0.0.0 if there are any problems.
    try {
        configXml = fs.readFileSync("config.xml", "utf8");
        configXmlDoc = new XmlDom().parseFromString(configXml);
        var versionString = xpath.select1("/*[local-name() = 'widget']/@version", configXmlDoc).value;
        var versionParts = versionString.split(".");
        majorVersion = parseInt(versionParts[0], 10);
        minorVersion = parseInt(versionParts[1], 10);
        buildVersion = parseInt(versionParts[2], 10);
    }
    catch (err) {
        console.log("Error parsing version from config.xml; using 0.0.0 instead.", err);
    }

    try {
        configXml = fs.readFileSync('config.xml', 'utf8');
        configXmlDoc = new XmlDom().parseFromString(configXml);

        if (isDebugScheme()) {
            apiUrl = xpath.select1("/*[local-name() = 'widget']/*[local-name() = 'preference'][@name='ApiUrlDebug']/@value", configXmlDoc).value;
        }
        else {
            apiUrl = xpath.select1("/*[local-name() = 'widget']/*[local-name() = 'preference'][@name='ApiUrl']/@value", configXmlDoc).value;
        }
    }
    catch (err) {
        console.error("Unable to parse ApiUrl/ApiUrlDebug from the config.xml file.");
        cb(err);
    }

    // Create the structure of the buildVars variable.
    var buildVarsJson = JSON.stringify({
        majorVersion: majorVersion,
        minorVersion: minorVersion,
        buildVersion: buildVersion,
        debug: isDebugScheme(),
        buildTimestamp: (new Date()).toUTCString(),
        apiUrl: apiUrl
    });

    // Write the buildVars variable with code that will define it as a global object.
    var buildVarsJs = "window.buildVars = " + buildVarsJson  + ";";

    // Write the file out to disk.
    fs.writeFileSync("www/js/BuildVars.js", buildVarsJs, { encoding: "utf8" });

    cb();
});

/**
 * Used to copy the entire TypeScript source into the www/js/src directory so that
 * it can be used for debugging purposes.
 * 
 * This will only copy the files if the build scheme is not set to release.
 */
gulp.task("ts:src", ["ts:src-read-me"], function (cb) {

    if (!isDebugScheme()) {
        cb();
        return;
    }

    return gulp.src(paths.ts)
        .pipe(gulp.dest("www/js/src"));
});

/**
 * Used to add a readme file to www/js/src to explain what the directory is for.
 * 
 * This will only copy the files if the build scheme is not set to release.
 */
gulp.task("ts:src-read-me", function (cb) {

    if (!isDebugScheme()) {
        cb();
        return;
    }

    var infoMessage = "This directory contains a copy of the TypeScript source files for debug builds; it can be safely deleted and will be regenerated via the gulp ts task.\n\nTo omit this directory create a release build by specifying the scheme:\ngulp ts --scheme release";

    return string_src("readme.txt", infoMessage)
        .pipe(gulp.dest("www/js/src/"));
});

/**
 * Used to compile TypeScript and create a Chrome extension located in the
 * chrome directory.
 */
gulp.task("chrome", ["ts"], function (cb) {

    // Copy the www payload.
    gulp.src(paths.www)
      .pipe(gulp.dest("chrome"))
      .on("end", function() {

      // Copy in the icon to use for the toolbar.
      gulp.src(paths.chromeIcon)
        .pipe(gulp.dest("chrome"))
        .on("end", function() {

          // Copy in the manifest file for the extension.
          gulp.src(paths.chromeManifest)
            .pipe(rename("manifest.json"))
            .pipe(gulp.dest("./chrome"))
            .on("end", cb);
        });
    });
});

/**
 * Used to perform compliation of the TypeScript source in the src directory and
 * output the JavaScript to www/js/bundle.js. Compilation parameters are located
 * in src/tsconfig.json.
 * 
 * It will also delegate to the vars and src tasks to copy in the original source
 * which can be used for debugging purposes. This will only occur if the build scheme
 * is not set to release.
 */
gulp.task("ts", ["ts:vars", "ts:src"], function (cb) {
    exec("tsc -p src", function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

/**
 * Used to perform compilation of the unit TypeScript tests in the tests directory
 * and output the JavaScript to tests/tests-bundle.js. Compilation parameters are
 * located in tests/tsconfig.json.
 * 
 * It will also delegate to the ts task to ensure that the application source is
 * compiled as well.
 */
gulp.task("ts:tests", ["ts"], function (cb) {
    exec("tsc -p tests", function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

/**
 * Used to download all of the bower dependencies as defined in bower.json and place
 * the consumable pieces in the www/lib directory.
 */
gulp.task("libs", function(cb) {
    exec("bower-installer", function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

/**
 * Used to download and configure each platform with the Cordova plugins as defined
 * in the cordovaPlugins section of the package.json file.
 * 
 * This is equivalent to using the "cordova plugins add pluginName" command for each
 * of the plugins.
 */
gulp.task("plugins", ["git-check"], function(cb) {
    var pluginList = JSON.parse(fs.readFileSync("package.json", "utf8")).cordovaPlugins;

    async.eachSeries(pluginList, function(plugin, eachCb) {
        var pluginName,
            additionalArguments = "";

        if (typeof(plugin) === "object" && typeof(plugin.locator) === "string") {
            pluginName = plugin.locator;

            if (plugin.variables) {
                Object.keys(plugin.variables).forEach(function (variable) {
                    additionalArguments += " --variable " + variable + "=\"" + plugin.variables[variable] + "\"";
                });
            }
        }
        else if (typeof(plugin) === "string") {
            pluginName = plugin;
        }
        else {
            cb(new Error("Unsupported plugin object type (must be string or object with a locator property)."));
            return;
        }

        exec("cordova plugin add " + pluginName + additionalArguments, function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            eachCb(err);
        });

    }, cb);
});

/**
 * Used to create a payload that can be sent to an OS X machine for build.
 * The payload will be placed in tmp/taco-payload.tgz.gz
 */
gulp.task("package-remote-build", function () {
    // Note that we use the eol plugin here to transform line endings for js files to
    // the OS X style of \r instead of \r\n. We need to do this mainly for the scripts
    // in the hooks directory so they can be executed as scripts on OS X.
    return gulp.src(paths.remoteBuildFiles, { base: "../" })
            .pipe(gulpif("*.js", eol("\r")))
            .pipe(tar("taco-payload.tgz"))
            .pipe(gzip())
            .pipe(gulp.dest("tmp"));
});

/**
 * Used to perform a file clean-up of the project. This removes all files and directories
 * that don't need to be committed to source control by delegating to several of the clean
 * sub-tasks.
 */
gulp.task("clean", ["clean:tmp", "clean:node", "clean:bower", "clean:platforms", "clean:plugins", "clean:chrome", "clean:libs", "clean:ts", "clean:tsd"]);

/**
 * Removes the tmp directory.
 */
gulp.task("clean:tmp", function (cb) {
    del([
        "tmp"
    ], cb);
});

/**
 * Removes the node_modules directory.
 */
gulp.task("clean:node", function (cb) {
    del([
        "node_modules"
    ], cb);
});

/**
 * Removes the bower_components directory.
 */
gulp.task("clean:bower", function (cb) {
    del([
        "bower_components"
    ], cb);
});

/**
 * Removes the platforms directory.
 */
gulp.task("clean:platforms", function (cb) {
    del([
        "platforms"
    ], cb);
});

/**
 * Removes the plugins directory.
 */
gulp.task("clean:plugins", function (cb) {
    del([
        "plugins"
    ], cb);
});

/**
 * Removes the www/lib directory.
 */
gulp.task("clean:libs", function (cb) {
    del([
        "www/lib"
    ], cb);
});

/**
 * Removes files related to TypeScript compilation.
 */
gulp.task("clean:ts", function (cb) {
    del([
        "www/js/bundle.js",
        "www/js/bundle.js.map",
        "www/js/BuildVars.js",
        "www/js/src"
    ], cb);
});

/**
 * Removes files related to TypeScript definitions.
 */
gulp.task("clean:tsd", function (cb) {

    // TODO: These patterns don't actually remove the sub-directories
    // located in the typings directories, they leave the directories
    // but remove the *.d.ts files. The following glob should work for
    // remove directories and preserving the custom directory, but they
    // don't for some reason and the custom directory is always removed:
    // "typings/**"
    // "!typings/custom/**"

    del([
        "src/tsd.d.ts",
        "typings/**/*.d.ts",
        "!typings/custom/*.d.ts",
        // "typings/**",
        // "!typings/custom/**",

        "tests/tsd.d.ts",
        "typings-tests/**/*.d.ts",
        "!typings-tests/custom/*.d.ts",
        // "typings-tests/**",
        // "!typings/custom/**"
    ], cb);
});

/**
 * Removes the chrome directory.
 */
gulp.task("clean:chrome", function (cb) {
    del([
        "chrome"
    ], cb);
});

/**
 * An default task provided by Ionic used to check if Git is installed.
 */
gulp.task("git-check", function(done) {
    if (!sh.which("git")) {
        console.log(
          "  " + gutil.colors.red("Git is not installed."),
          "\n  Git, the version control system, is required to download Ionic.",
          "\n  Download git here:", gutil.colors.cyan("http://git-scm.com/downloads") + ".",
          "\n  Once git is installed, run \"" + gutil.colors.cyan("gulp install") + "\" again."
        );
        done(new Error("Git is not installed."));
        return;
    }

    done();
});

/**
 * An gulp task to create documentation for typescript.
 */
gulp.task("typedoc", function() {
    return gulp
        .src(paths.ts)
        .pipe(typedoc({
            module: "commonjs",
            target: "es5",
            out: "docs/",
            name: "Ionic TypeScript Starter"
        }));
});

/**
 * Removes the docs directory.
 */
gulp.task("clean:typedoc", function (cb) {
    del([
        "docs"
    ], cb);
});
