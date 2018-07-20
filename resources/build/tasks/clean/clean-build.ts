
import * as gulp from "gulp";
import { GulpPlugins } from "../types";
import { TaskFunc } from "orchestrator";

import * as del from "del";

/**
 * Removes the build directory.
 */
module.exports = function(gulp: gulp.Gulp, plugins: GulpPlugins): TaskFunc {

    return function(cb) {

        del([
            "build"
        ]).then(function () {
            cb();
        });
    };
};
