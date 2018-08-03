
import * as gulp from "gulp";
import { GulpPlugins } from "./gulp-types";
import { TaskFunc } from "orchestrator";

import * as sh from "shelljs";
import * as runSequence from "run-sequence";
import * as helper from "./gulp-helper";

/**
 * Packages the application for deployment as a Chrome browser extension.
 * This does not compile SASS, TypeScript, templates, etc.
 * 
 * This performs: gulp config --prep chrome
 * and copies www content into build/chrome and creates build/chrome.zip
 */
module.exports = function(gulp: gulp.Gulp, plugins: GulpPlugins): TaskFunc {

    return function(cb) {

        // Warn the user if they try to use a different prep flag value.
        if (plugins.util.env.prep != null && plugins.util.env.prep !== "chrome") {
            helper.warn(`The '--prep ${plugins.util.env.prep}' flag is invalid for the 'package-chrome' task; overriding it to: '--prep chrome'.`);
        }

        // Ensure that the prep flag is set to "chrome" (used by the config task).
        plugins.util.env.prep = "chrome";

        // Ensure the previous files are cleared out.
        sh.rm("-rf", "build/chrome");
        sh.rm("-rf", "build/chrome.tar.gz");

        // Ensure the target directory exists.
        sh.mkdir("-p", "build/chrome");

        // Delegate to the config task to generate the index, manifest, and build vars.
        runSequence("config", function (err) {

            if (err) {
                cb(err);
                return;
            }

            // Copy the www payload.
            helper.info("Copying www to build/chrome");
            sh.cp("-R", "www/", "build/chrome");

            // Copy the icon.
            helper.info("Copying resources/icon.png to build/chrome/icon.png");
            sh.cp("resources/icon.png", "build/chrome");

            // Archive the directory.
            gulp.src("build/chrome/**/*", { base: "build/chrome" })
                .pipe(plugins.tar("chrome.tar"))
                .pipe(plugins.gzip())
                .pipe(gulp.dest("build"))
                .on("end", cb);
        });
    };
};
