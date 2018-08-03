
import * as gulp from "gulp";
import { GulpPlugins } from "./gulp-types";
import { TaskFunc } from "orchestrator";

import * as path from "path";
import * as sh from "shelljs";

/**
 * Used to perform compilation of the unit TypeScript tests in the tests directory
 * and output the JavaScript to tests/tests-bundle.js. Compilation parameters are
 * located in tests/tsconfig.json.
 * 
 * It will also delegate to the ts task to ensure that the application source is
 * compiled as well.
 */
module.exports = function(gulp: gulp.Gulp, plugins: GulpPlugins): TaskFunc {

    return function(cb) {

        let tscBin = path.join("node_modules", ".bin", "tsc");

        let result = sh.exec(tscBin + " -p tests");

        if (result.code !== 0) {
            cb(new Error("Error running TypeScript compiler (tsc)."));
            return;
        }

        cb();
    };
};
