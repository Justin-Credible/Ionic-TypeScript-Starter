
import * as gulp from "gulp";
import { GulpPlugins } from "./gulp-types";
import { TaskFunc } from "orchestrator";

import * as path from "path";
import * as helper from "./gulp-helper";
import * as Karma from "karma";

/**
 * Used to run the unit tests in Karma.
 * 
 * Can use --serve to keep the Karma session live after the run which will watch files.
 * Can use --single to specify the class name of a single test to run (eg UtilitiesTests).
 */
module.exports = function(gulp: gulp.Gulp, plugins: GulpPlugins): TaskFunc {

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

        var server = new Karma.Server({
            configFile: configFile,
            singleRun: !serve,
            client: {
                args: clientArgs
            }
        }, function (err) {
            // When a non-zero code is returned by Karma something went wrong.
            cb(err === 0 ? null : new Error("There are failing unit tests"));
        });

        server.start();
    };
};
