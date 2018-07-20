
import * as gulp from "gulp";
import { GulpPlugins } from "../types";
import { TaskFunc } from "orchestrator";

import * as del from "del";

/**
 * Removes the build/web directory.
 */
module.exports = function(gulp: gulp.Gulp, plugins: GulpPlugins): TaskFunc {

    return function(cb) {

        del([
            "build/web"
        ]).then(function () {
            cb();
        });
    };
};
