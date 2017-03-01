
// Native Node Modules
var fs = require("fs");
var path = require("path");

// Gulp Plugins
var plugins = require("gulp-load-plugins")();

// Other Node Modules
var helper = require("./helper");
var runSequence = require("run-sequence");
var sh = require("shelljs");

/**
 * Used to initialize or re-initialize the development environment.
 * 
 * This involves delegating to all of the clean tasks EXCEPT clean:node. It then adds
 * the platforms using cordova and finally executes the default gulp task.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        // First, generate config.xml so that Cordova can read it. We do this here instead
        // of as a dependency task because it must start after all of the clean tasks have
        // completed, otherwise it will just get blown away.
        runSequence("config", function (err) {

            if (err) {
                cb(err);
                return;
            }

            // If we are preparing for the "web" or "chrome" platforms we can bail out here
            // because there is no need to add Cordova platforms in these cases.
            if (helper.isPrepWeb() || helper.isPrepChrome()) {
                helper.info(helper.format("Skipping Cordova platforms because the '--prep {0}' flag was specified.", plugins.util.env.prep));
                runSequence("default", cb);
                return;
            }

            var platforms = JSON.parse(fs.readFileSync("package.json", "utf8")).cordovaPlatforms;

            var cordovaBin = path.join("node_modules", ".bin", "cordova");
            var platformCommand = "";

            for (var i = 0; i < platforms.length; i++) {

                if (typeof(platforms[i]) === "string") {
                    platformCommand += cordovaBin + " platform add " + platforms[i];
                }
                else if (platforms[i].locator) {
                    platformCommand += cordovaBin + " platform add " + platforms[i].locator;
                }
                else {
                    helper.warn("Unsupported platform declaration in package.json; expected string or object with locator string property.");
                    continue;
                }

                if (i !== platforms.length - 1) {
                    platformCommand += " && ";
                }
            }

            // Next, run the "ionic platform add ..." commands.
            var result = sh.exec(platformCommand);

            if (result.code !== 0) {
                cb(new Error(result.output));
                return;
            }

            // Delegate to the default gulp task.
            runSequence("default", cb);
        });
    };
};
