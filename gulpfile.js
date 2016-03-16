
/*globals Buffer, __dirname, process*/


// Native Node Modules
var exec = require("child_process").exec;
var fs = require("fs");
var path = require("path");

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
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var templateCache = require("gulp-angular-templatecache");

// Other Modules
var del = require("del");
var runSequence = require("run-sequence");
var bower = require("bower");
var request = require("request");
var sh = require("shelljs");
var async = require("async");
var xpath = require("xpath");
var XmlDom = require("xmldom").DOMParser;
var xmlSerializer = new (require("xmldom")).XMLSerializer;
var KarmaServer = require("karma").Server;
var _ = require("lodash");
var yaml = require("js-yaml");


var paths = {
    ts: ["./src/**/*.ts"],
    customTypeDefinitions: [
        "./typings/custom/**/*.d.ts",
        "./typings-tests/custom/**/*.d.ts"
    ],
    templates: ["./src/**/*.html"],
    sassIndex: "./src/Styles/Index.scss",
    sass: ["./src/Styles/**/*.scss"],
    www: ["./www/**/*.*"],
    tests: ["./tests/**/*.ts"],
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
 * Used to get the name of the scheme specified via the --scheme flag, or if one is not present
 * the default scheme as defined in schemes.yml.
 */
function getCurrentSchemeName() {

    // Grab the scheme name as defined via an argument (eg gulp config --scheme scheme_name).
    var schemeName = gutil.env.scheme;

    // If a scheme name was supplied via the command line, then use the default from config.
    if (!schemeName) {
        var schemeConfigYmlRaw = fs.readFileSync("resources/config/schemes.yml", "utf8").toString();
        var schemesConfig = yaml.safeLoad(schemeConfigYmlRaw);

        if (!schemesConfig) {
            throw new Error("Unable to read build schemes from resources/config/config.yml");
        }

        schemeName = schemesConfig.default;
    }

    return schemeName;
}

/**
 * Used to get the scheme from resources/config/schemes.yml with the given name.
 */
function getSchemeByName(schemeName) {

    // Read and parse the schemes.yml file.
    var schemeConfigYmlRaw = fs.readFileSync("resources/config/schemes.yml", "utf8").toString();
    var schemesConfig = yaml.safeLoad(schemeConfigYmlRaw);

    if (!schemesConfig || !schemesConfig.schemes) {
        throw new Error("Unable to load build schemes from resources/config/schemes.yml");
    }

    var scheme = schemesConfig.schemes[schemeName];

    // If we couldn't find a scheme with this name, fail fast.
    if (!scheme) {
        throw new Error(format("Could not locate a build scheme with name '{0}' in resources/config/schemes.yml", schemeName));
    }

    // Ensure the replacements dictionary exists.
    if (!scheme.replacements) {
        scheme.replacements = {};
    }

    // See if this scheme has a base defined.
    var baseSchemeName = scheme.base;

    // Here we gather up all of the replacement nodes for each of the parent schemes.
    while (baseSchemeName) {

        var baseScheme = schemesConfig.schemes[baseSchemeName];

        if (!baseScheme) {
            throw new Error(format("Could not locate a build scheme with name '{0}' in resources/config/schemes.yml", schemeName));
        }

        // Merge the replacement entries from the base to the parent.
        if (baseScheme.replacements) {

            for (var key in baseScheme.replacements) {

                if (!baseScheme.replacements.hasOwnProperty(key)) {
                    continue;
                }

                if (scheme.replacements[key] == null) {
                    scheme.replacements[key] = baseScheme.replacements[key];
                }
            }
        }

        // If this scheme has another base scheme, then we'll need to examine it as well.
        // Set the parent name here so the while loop executes again.
        baseSchemeName = baseScheme.base;
    }

    return scheme;
}

/**
 * Used to perform variable replacement on a master file and write out the resulting file.
 * Variables are determined by the given scheme as defined in schemes.xml.
 */
function performVariableReplacement(schemeName, sourceFilePath, destinationFilePath) {

    // Grab the scheme by name.
    var scheme = getSchemeByName(schemeName);

    // If we didn't find a scheme by name, then fail fast.
    if (!scheme) {
        throw new Error(format("Could not locate a build scheme with name '{0}' in resources/config/schemes.yml", schemeName));
    }

    // Open the master file that we'll perform replacements on.
    var content = fs.readFileSync(sourceFilePath, "utf8").toString();

    // Loop through each replacement variable we have defined.
    for (var key in scheme.replacements) {

        if (!scheme.replacements.hasOwnProperty(key)) {
            continue;
        }

        var replacementTarget = "\\${" + key + "}";
        var replacementValue = scheme.replacements[key];

        // Search and replace the ${TARGET} with the value in the files.
        content = content.replace(new RegExp(replacementTarget, "g"), replacementValue);
    }

    // Write out the files that have replacements.
    fs.writeFileSync(destinationFilePath, content, "utf8");
}

/**
 * Used to insert link/script tags for CSS and JavaScript references using a master file and
 * write out the resulting file.
 * 
 * The following tags will be used for replacement:
 * • CSS: <!-- references: css -->
 * • JS Libs: <!-- references: lib -->
 * • JS: <!-- references: js -->
 * 
 * If bundled is true, the following static references will be used:
 * • CSS: app.bundle.css
 * • JS Libs: app.bundle.lib.js
 * • JS: app.bundle.js
 * 
 * If bundled is false, the map of files provided in the given referencesFilePath will be used
 * to grab each file and emit a link/script tag for each resource type.
 */
function performReferenceReplacement(sourceFilePath, targetFilePath, bundled, referencesFilePath) {

    var cssRegExp = new RegExp("<!-- references: css -->", "gm");
    var libRegExp = new RegExp("<!-- references: lib -->", "gm");
    var jsRegExp = new RegExp("<!-- references: js -->", "gm");

    // Open the master file that we'll perform replacements on.
    var content = fs.readFileSync(sourceFilePath, "utf8").toString();

    // Lets handle the easy case first. If bundled is true, then we subsitute some static paths.
    if (bundled) {

        content.replace(cssRegExp, '<link rel="stylesheet" href="app.bundle.css">');
        content.replace(libRegExp, '<script type="text/javascript" src="app.bundle.lib.js"></script>');
        content.replace(jsRegExp, '<script type="text/javascript" src="app.bundle.js"></script>');

        fs.writeFileSync(targetFilePath, content, "utf8");

        return;
    }

    if (!referencesFilePath) {
        throw new Error("The bundled flag was false, but no referencesFilePath was provided.");
    }

    // Read in the file that contains the list of resource references.
    var resourceYmlRaw = fs.readFileSync(referencesFilePath, "utf8").toString();
    var resources = yaml.safeLoad(resourceYmlRaw);

    if (!resources) {
        throw new Error("Unable to read resource references from " + referencesFilePath);
    }

    // Inject link tags for the CSS files.
    if (resources.css && resources.css.length > 0) {

        cssReferences = [];

        resources.css.forEach(function (cssReference) {
            cssReferences.push(format('<link rel="stylesheet" href="{0}">', cssReference));
        });

        content.replace(cssRegExp, cssReferences.join("\n"));
    }
    else {
        content.replace(cssRegExp, "");
    }

    // Inject script tags for the JS libraries.
    if (resources.lib && resources.lib.length > 0) {

        libReferences = [];

        resources.lib.forEach(function (libReference) {
            libReference.push(format('<script type="text/javascript" src="{0}"></script>', libReference));
        });

        content.replace(libRegExp, libReferences.join("\n"));
    }
    else {
        content.replace(libRegExp, "");
    }

    // Inject script tags for the JS files.
    if (resources.js && resources.js.length > 0) {

        jsReferences = [];

        resources.js.forEach(function (jsReference) {
            jsReference.push(format('<script type="text/javascript" src="{0}"></script>', jsReference));
        });

        content.replace(jsRegExp, jsReferences.join("\n"));
    }
    else {
        content.replace(jsRegExp, "");
    }

    fs.writeFileSync(targetFilePath, content, { encoding: "utf8" });
}

/**
 * Used to create a JavaScript file containing build variables git sha, build timestamp, and all
 * of the values of config.yml file.
 */
function createBuildVars(schemeName, configYmlPath, targetBuildVarsPath) {

    // Grab the scheme by name.
    var scheme = getSchemeByName(schemeName);

    // If we didn't find a scheme by name, then fail fast.
    if (!scheme) {
        throw new Error(format("Could not locate a build scheme with name '{0}' in resources/config/schemes.yml", schemeName));
    }

    // Read in the shared configuration file.
    var configYmlRaw = fs.readFileSync(configYmlPath).toString();

    // Perform variable replacements based on the active scheme.

    // Loop through each replacement variable we have defined.
    for (var key in scheme.replacements) {

        if (!scheme.replacements.hasOwnProperty(key)) {
            continue;
        }

        var replacementTarget = "\\${" + key + "}";
        var replacementValue = scheme.replacements[key];

        // Search and replace the ${TARGET} with the value in the files.
        configYmlRaw = configYmlRaw.replace(new RegExp(replacementTarget, "g"), replacementValue);
    }

    // Grab the debug flag.
    var isDebug = !!scheme.debug;

    // If the debug flag was never set, then default to true.
    if (isDebug == null) {
        console.warn("The debug attribute was not set for scheme '" + schemeName + "'; defaulting to true.");
        isDebug = true;
    }

    // Parse the in-memory, modified version of the config.yml.
    var config = yaml.safeLoad(configYmlRaw);

    // Create the structure of the buildVars variable.
    var buildVars = {
        debug: isDebug,
        buildTimestamp: (new Date()).toUTCString(),
        commitShortSha: "Unknown",
        config: config
    };

    // Grab the git commit hash.
    var shResult = sh.exec("git rev-parse --short HEAD", { silent: true });

    if (shResult.code !== 0) {
        console.warn("Unable to get the git revision number; using 'Unknown' instead. Failure reason:\n" + shResult.output);
    }
    else {
        buildVars.commitShortSha = shResult.output.replace("\n", "");
    }

    // Write the buildVars variable with code that will define it as a global object.
    var buildVarsJs = "window.buildVars = " + JSON.stringify(buildVars)  + ";";

    // Write the file out to disk.
    fs.writeFileSync(targetBuildVarsPath, buildVarsJs, { encoding: "utf8" });
}

/**
 * Used to determine if the gulp operation was launched for a debug or release build.
 * This is controlled by the scheme's debug flag.
 */
function isDebugBuild() {

    // Grab the scheme by name.
    var scheme = getSchemeByName(getCurrentSchemeName());

    // If we didn't find a scheme by name, then fail fast.
    if (!scheme) {
        throw new Error(format("Could not locate a build scheme with name '{0}' in resources/config/schemes.yml", schemeName));
    }

    // Grab the debug flag.
    var isDebug = scheme.getAttribute("debug") === "true";

    return isDebug;
}

/**
 * Used to determine if a prepare flag was set to "chrome".
 * 
 * gulp init --prep chrome
 */
function isPrepChrome() {
    return gutil.env.prep === "chrome" ? true : false;
}

/**
 * Used to determine if a prepare flag was set to "web".
 * 
 * gulp init --prep web
 */
function isPrepWeb() {
    return gutil.env.prep === "web" ? true : false;
}

/**
 * Used to determine if a prep flag was set to Android.
 * 
 * gulp init --prep android
 */
function isPrepAndroid() {
    return gutil.env.prep === "android" ? true : false;
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
 * "error" to be recognized by Visual Studio Code's pattern matcher as warnings
 * instead of errors. This was copied and modified from gulp-tslint.
 */
var tsLintReporter = function(failures, file) {
    failures.forEach(function(failure) {
        // line + 1 because TSLint's first line and character is 0
        logTsError("(" + failure.ruleName + ") " + file.path +
            "[" + (failure.startPosition.line + 1) + ", " +
            (failure.startPosition.character + 1) + "]: " +
            failure.failure, "warn");
    });
};

/**
 * A custom reporter for the sass compilation task so we can control the formatting
 * of the message for our custom problem matcher in Visual Studio Code.
 */
var sassReporter = function (failure) {
    var file = failure.message.split("\n")[0];
    var message = failure.message.split("\n")[1];

    console.log("[sass] [" + failure.name.toLowerCase() + "] " + file + ":" + message);
}

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
    runSequence("plugins", "libs", "tsd", "templates", "sass", "ts", "config", cb);
});

/**
 * Used to initialize or re-initialize the development environment.
 * 
 * This involves delegating to all of the clean tasks EXCEPT clean:node. It then adds
 * the platforms using cordova and finally executes the default gulp task.
 */
gulp.task("init", ["clean:config", "clean:bower", "clean:platforms", "clean:plugins", "clean:build", "clean:libs", "clean:ts", "clean:tsd", "clean:templates", "clean:sass"], function (cb) {

    // First, build out config.xml so that Cordova can read it. We do this here instead
    // of as a child task above because it must start after all of the clean tasks have
    // completed, otherwise it will just get blown away.
    runSequence("config", function () {

        // If we are preparing for the "web" platform we can bail out earlier.
        if (isPrepWeb()) {
            console.info("Skipping Cordova platforms because the '--prep web' flag was specified.");
            runSequence("default", cb);
            return;
        }

        var platforms = JSON.parse(fs.readFileSync("package.json", "utf8")).cordovaPlatforms;

        var platformCommand = "";

        for (var i = 0; i < platforms.length; i++) {

            if (typeof(platforms[i]) === "string") {
                platformCommand += "ionic platform add " + platforms[i];
            }
            else if (platforms[i].locator) {
                platformCommand += "ionic platform add " + platforms[i].locator;
            }
            else {
                console.warn("Unsupported platform declaration in package.json; expected string or object with locator string property.");
                continue;
            }

            if (i !== platforms.length - 1) {
                platformCommand += " && ";
            }
        }

        // Next, run the "ionic platform add ..." commands.
        exec(platformCommand, function (err, stdout, stderr) {

            console.log(stdout);
            console.log(stderr);

            if (err) {
                cb(err);
                return;
            }

            // Delegate to the default gulp task.
            runSequence("default", function () {

                // Finally, if the special "--prep android" flag was provided, run a few extra commands.
                if (isPrepAndroid()) {
                    exec("ionic browser add crosswalk", function (err, stdout, stderr) {
                        console.log(stdout);
                        console.log(stderr);
                        cb(err);
                    });
                }
                else {
                    cb();
                }
            });
        });
    });
});

/**
 * The watch task will watch for any changes in the TypeScript files and re-execute the
 * ts gulp task if they change. The "ionic serve" command will also invoke this task to
 * refresh the browser window during development.
 */
gulp.task("watch", function() {
    gulp.watch(paths.sass, ["sass"]);
    gulp.watch(paths.ts, ["ts"]);
});

/**
 * Simply delegates to the "ionic emulate ios" command.
 * 
 * Useful to quickly execute from Visual Studio Code's task launcher:
 * Bind CMD+Shift+R to "workbench.action.tasks.runTask task launcher"
 */
gulp.task("emulate-ios", ["sass", "ts"], function(cb) {
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
 * Useful to quickly execute from Visual Studio Code's task launcher:
 * Bind CMD+Shift+R to "workbench.action.tasks.runTask task launcher"
 */
gulp.task("remote-emulate-ios", function(cb) {

    // First we'll compile the TypeScript and build the application payload.
    runSequence("sass", "ts", "package-remote-build", function (err) {

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
                                isDebugBuild() ? "debug" : "release",
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
 * Useful to quickly execute from Visual Studio Code's task launcher:
 * Bind CMD+Shift+R to "workbench.action.tasks.runTask task launcher"
 */
gulp.task("emulate-android", ["sass", "ts"], function(cb) {
    exec("ionic emulate android");
    cb();
});

/**
 * Performs linting of the TypeScript source code.
 */
gulp.task("lint", function (cb) {
    var filesToLint = paths.ts.concat(paths.tests, paths.customTypeDefinitions);

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

    var server = new KarmaServer({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    }, function (err, result) {
        // When a non-zero code is returned by Karma something went wrong.
        done(err === 0 ? null : "There are failing unit tests");
    });

    server.start();
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
 * Used to perform configuration based on different build schemes listed in config.xml
 * under the schemes element.
 * 
 * It responsible for generating config.xml from config.master.xml, generating
 * www/index.html from www/index.master.html, performing variable replacements based
 * on scheme name in these two files, and building the www/js/build-vars.js file.
 * 
 * gulp config --scheme scheme_name
 */
gulp.task("config", function (cb) {

    var schemeName = getCurrentSchemeName();

    if (isPrepWeb()) {
        // Web Package: --prep web

        console.log(format("Generating: www/index.html from resources/web/index.master.html"));
        performVariableReplacement(schemeName, "resources/web/index.master.html", "www/index.html");

        console.log(format("Adding app bundle resource references to: www/index.html"));
        performReferenceReplacement("www/index.html", "www/index.html", true);
    }
    else if (isPrepChrome()) {
        // Chrome Extension: --prep chrome

        console.log(format("Generating: build/chrome/manifest.json from resources/chrome/manifest.master.json"));
        performVariableReplacement(schemeName, "resources/chrome/manifest.master.json", "build/chrome/manifest.master.json");

        console.log(format("Generating: www/index.html from resources/chrome/index.master.html"));
        performVariableReplacement(schemeName, "resources/chrome/index.master.html", "www/index.html");

        console.log(format("Adding resource references to: www/index.html using resources/chrome/index.references.yml"));
        performReferenceReplacement("www/index.html", "www/index.html", false, "resources/chrome/index.references.yml");
    }
    else {
        // Cordova: default or no --prep flag

        console.log(format("Generating: config.xml from resources/cordova/config.master.xml"));
        performVariableReplacement(schemeName, "resources/cordova/config.master.xml", "config.xml");

        console.log(format("Generating: www/index.html from resources/cordova/index.master.html"));
        performVariableReplacement(schemeName, "resources/cordova/index.master.html", "www/index.html");

        console.log(format("Adding resource references to: www/index.html using resources/cordova/index.references.yml"));
        performReferenceReplacement("www/index.html", "www/index.html", false, "resources/cordova/index.references.yml");
    }

    createBuildVars(schemeName, "resources/config/config.yml", "www/js/build-vars.js");

    cb();
});

/**
 * Packages the application for deployment as a Chrome browser extension.
 * This does not compile SASS, TypeScript, templates, etc.
 * 
 * This performs: gulp config --prep chrome
 * and copies www content into build/chrome and creates build/chrome.zip
 */
gulp.task("package-chrome", function (cb) {

    // Warn the user if they try to use a different prep flag value.
    if (gutil.env.prep != null && gutil.env.prep != "chrome") {
        console.warn("Overriding '--prep " + gutil.env.prep + "' flag to '--prep chrome'.");
    }

    // Ensure that the prep flag is set to "chrome" (used by the config task).
    gutil.env.prep = "chrome";

    // Delegate to the config task to generate the index, manifest, and build vars.
    runSequence("config", function () {

        // Copy the www payload.
        gulp.src(paths.www)
            .pipe(gulp.dest("build/chrome"))
            .on("end", function() {

            // Copy in the icon to use for the toolbar.
            gulp.src("./resources/icon.png")
                .pipe(gulp.dest("build/chrome"))
                .on("end", function() {

                // TODO: ZIP
                cb();
            });
        });
    });
});

/**
 * Packages the application for deployment for the web.
 * This does not compile SASS, TypeScript, templates, etc.
 * 
 * This performs: gulp config --prep web
 * and copies www content into build/web and creates build/web.zip
 */
gulp.task("package-web", function (cb) {

    // Warn the user if they try to use a different prep flag value.
    if (gutil.env.prep != null && gutil.env.prep != "web") {
        console.warn("Overriding '--prep " + gutil.env.prep + "' flag to '--prep web'.");
    }

    // Ensure that the prep flag is set to "web" (used by the config task).
    gutil.env.prep = "web";

    // Delegate to the config task to generate the index, manifest, and build vars.
    runSequence("config", function () {

        // Copy the www payload.
        gulp.src(paths.www)
            .pipe(gulp.dest("build/web"))
            .on("end", function() {

            // TODO: Remove un-needed files (css, js, lib)
            // TODO: Bundle css to app.bundle.css
            // TODO: Bundle lib to app.bundle.lib.js
            // TODO: Bundle js to app.bundle.js
            // bundleStaticLibs("www", "build/web", "config/web/index.references.yml")

            // TODO: ZIP
            cb();
        });
    });
});

/**
 * Used to create a payload that can be sent to an OS X machine for build.
 * The payload will be placed in tmp/taco-payload.tgz.gz
 * 
 * This does not compile SASS, TypeScript, templates, etc.
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
 * Used to copy the entire TypeScript source into the www/js/src directory so that
 * it can be used for debugging purposes.
 * 
 * This will only copy the files if the build scheme is not set to release. A release
 * build will ensure that the files are deleted if they are present.
 */
gulp.task("ts:src", ["ts:src-read-me"], function (cb) {

    if (isDebugBuild()) {
        return gulp.src(paths.ts)
            .pipe(gulp.dest("www/js/src"));
    }
    else {
        del([
            "www/js/src",
            "www/js/bundle.js.map",
        ]).then(function () {
            cb();
        });
    }
});

/**
 * Used to add a readme file to www/js/src to explain what the directory is for.
 * 
 * This will only copy the files if the build scheme is not set to release.
 */
gulp.task("ts:src-read-me", function (cb) {

    if (!isDebugBuild()) {
        cb();
        return;
    }

    var infoMessage = "This directory contains a copy of the TypeScript source files for debug builds; it can be safely deleted and will be regenerated via the gulp ts task.\n\nTo omit this directory create a release build by specifying the scheme:\ngulp ts --scheme release";

    return string_src("readme.txt", infoMessage)
        .pipe(gulp.dest("www/js/src/"));
});

/**
 * Used to perform compliation of the TypeScript source in the src directory and
 * output the JavaScript to the out location as specified in tsconfig.json (usually
 * www/js/bundle.js).
 * 
 * It will also delegate to the vars and src tasks to copy in the original source
 * which can be used for debugging purposes. This will only occur if the build scheme
 * is not set to release.
 */
gulp.task("ts", ["ts:src"], function (cb) {
    exec("tsc -p src", function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);

        // For debug builds, we are done, but for release builds, minify the bundle.
        if (isDebugBuild()) {
            cb(err);
        }
        else {
            runSequence("minify", function () {
                cb(err);
            });
        }
    });
});

/**
 * Used to minify the JavaScript bundle.js built from the "ts" TypeScript compilation
 * target. This will use the bundle that is already on disk whose location is determined
 * from the out property of the compiler options in tsconfig.json.
 */
gulp.task("minify", function () {

    // Read tsconfig.json to determine the bundle output location.
    var config = JSON.parse(fs.readFileSync("src/tsconfig.json", "utf8"));
    var bundleLocation = config.compilerOptions.out;

    // Minify to a temporary location and the move to the bundle location.
    return gulp.src(bundleLocation)
        .pipe(uglify())
        .pipe(gulp.dest(path.dirname(bundleLocation)));
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
 * Used to concatenate all of the HTML templates into a single JavaScript module.
 */
gulp.task("templates", function() {
    return gulp.src(paths.templates)
        .pipe(templateCache({
            "filename": "templates.js",
            "root": "",
            "module": "templates",
            standalone: true
        }))
        .pipe(gulp.dest("./www/js"));
});

/**
 * Used to perform compilation of the SASS styles in the styles directory (using
 * Index.scss as the root file) and output the CSS to www/css/bundle.css.
 */
gulp.task("sass", function (cb) {

    var sassConfig = {
        outputStyle: isDebugBuild() ? "nested" : "compressed",
        errLogToConsole: false
    };

    return gulp.src(paths.sassIndex)
        .pipe(sourcemaps.init())
        .pipe(sass(sassConfig).on("error", sassReporter))
        .pipe(rename("bundle.css"))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./www/css"));
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

    // We don't need Cordova plugins for the web bundle.
    if (isPrepWeb()) {
        console.info("Skipping Cordova plugins because the '--prep web' flag was specified.");
        cb();
        return;
    }

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
 * Used to perform a file clean-up of the project. This removes all files and directories
 * that don't need to be committed to source control by delegating to several of the clean
 * sub-tasks.
 */
gulp.task("clean", ["clean:tmp", "clean:node", "clean:config", "clean:bower", "clean:platforms", "clean:plugins", "clean:build", "clean:libs", "clean:ts", "clean:tsd", "clean:templates", "clean:sass"]);

/**
 * Removes the tmp directory.
 */
gulp.task("clean:tmp", function (cb) {
    del([
        "tmp",
    ]).then(function () {
        cb();
    });
});

/**
 * Removes the node_modules directory.
 */
gulp.task("clean:node", function (cb) {
    del([
        "node_modules"
    ]).then(function () {
        cb();
    });
});

/**
 * Removes the node_modules directory.
 */
gulp.task("clean:config", function (cb) {
    del([
        "config.xml",
        "www/index.master.xml",
        "www/js/build-vars.js"
    ]).then(function () {
        cb();
    });
});

/**
 * Removes the bower_components directory.
 */
gulp.task("clean:bower", function (cb) {
    del([
        "bower_components"
    ]).then(function () {
        cb();
    });
});

/**
 * Removes the platforms directory.
 */
gulp.task("clean:platforms", function (cb) {
    del([
        "platforms"
    ]).then(function () {
        cb();
    });
});

/**
 * Removes the plugins directory.
 */
gulp.task("clean:plugins", function (cb) {
    del([
        "plugins"
    ]).then(function () {
        cb();
    });
});

/**
 * Removes the www/lib directory.
 */
gulp.task("clean:libs", function (cb) {
    del([
        "www/lib"
    ]).then(function () {
        cb();
    });
});

/**
 * Removes files related to TypeScript compilation.
 */
gulp.task("clean:ts", function (cb) {
    del([
        "www/js/bundle.js",
        "www/js/bundle.d.ts",
        "www/js/bundle.js.map",
        "www/js/src"
    ]).then(function () {
        cb();
    });
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
    ]).then(function () {
        cb();
    });
});

/**
 * Removes the generated templates JavaScript from the templates target.
 */
gulp.task("clean:templates", function (cb) {
    del([
        "www/js/templates.js"
    ]).then(function () {
        cb();
    });
});

/**
 * Removes the generated css from the SASS target.
 */
gulp.task("clean:sass", function (cb) {
    del([
        "www/css/bundle.css",
        "www/css/bundle.css.map"
    ]).then(function () {
        cb();
    });
});

/**
 * Removes the build/chrome directory.
 */
gulp.task("clean:chrome", function (cb) {
    del([
        "build/chrome"
    ]).then(function () {
        cb();
    });
});

/**
 * Removes the build/web directory.
 */
gulp.task("clean:web", function (cb) {
    del([
        "build/web"
    ]).then(function () {
        cb();
    });
});

/**
 * Removes the build directory.
 */
gulp.task("clean:build", function (cb) {
    del([
        "build"
    ]).then(function () {
        cb();
    });
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
            out: "ts-docs/",
            name: "Ionic TypeScript Starter"
        }));
});

/**
 * Removes the docs directory.
 */
gulp.task("clean:typedoc", function (cb) {
    del([
        "ts-docs"
    ]).then(function () {
        cb();
    });
});
