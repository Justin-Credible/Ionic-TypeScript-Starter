
import * as gulp from "gulp";
import { GulpPlugins } from "./types";
import { TaskFunc } from "orchestrator";

import * as path from "path";
import * as sh from "shelljs";
import * as runSequence from "run-sequence";
import * as helper from "./helper";

/**
 * Used to perform compliation of the TypeScript source in the src directory and
 * output the JavaScript to the out location as specified in tsconfig.json (usually
 * www/js/bundle.js).
 * 
 * It will also delegate to the vars and src tasks to copy in the original source
 * which can be used for debugging purposes. This will only occur if the build scheme
 * is not set to release.
 */
module.exports = function(gulp: gulp.Gulp, plugins: GulpPlugins): TaskFunc {

    return function(cb) {

        let tscBin = path.join("node_modules", ".bin", "tsc");

        let result = sh.exec(tscBin + " -p src");

        if (result.code !== 0) {
            cb(new Error("Error running TypeScript compiler (tsc)."));
            return;
        }

        // For debug builds, we are done, but for release builds, minify the bundle.
        if (helper.isDebugBuild()) {
            cb();
        }
        else {
            runSequence("minify", cb);
        }
    };
};
