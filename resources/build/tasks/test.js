
// Native Node Modules
var path = require("path");

// Gulp Plugins
var plugins = require("gulp-load-plugins")();

// Other Node Modules
var helper = require("./helper");
var KarmaServer = require("karma").Server;

/**
 * Used to run the unit tests in Karma.
 * 
 * Can use --serve to keep the Karma session live after the run which will watch files.
 * Can use --single to specify the class name of a single test to run (eg UtilitiesTests).
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        var configFile = path.resolve(process.cwd(), "tests", "karma.conf.js");
        var clientArgs = [];

        var serve = plugins.util.env.serve ? true : false;

        if (serve) {
            helper.info("Starting Karma server, use CTRL+C to stop...");
        }
        else {
            helper.info("Starting single Karma run...");
        }

        var singleTestCaseName = plugins.util.env.single ? plugins.util.env.single : "";
        clientArgs.push("SingleTestCaseName:" + singleTestCaseName);

        var server = new KarmaServer({
            configFile: configFile,
            singleRun: !serve,
            client: {
                args: clientArgs
            }
        }, function (err, result) {
            // When a non-zero code is returned by Karma something went wrong.
            cb(err === 0 ? null : new Error("There are failing unit tests"));
        });

        server.start();
    };
};
