
import * as gulp from "gulp";
import { GulpPlugins } from "../gulp-types";
import { TaskFunc } from "orchestrator";

import * as del from "del";

/**
 * Removes the build/chrome directory.
 */
module.exports = function(gulp: gulp.Gulp, plugins: GulpPlugins): TaskFunc {

    return function(cb) {

        del([
            "build/chrome"
        ]).then(function () {
            cb();
        });
    };
};
