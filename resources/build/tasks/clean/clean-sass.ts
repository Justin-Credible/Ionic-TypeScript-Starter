
import * as gulp from "gulp";
import { GulpPlugins } from "../types";
import { TaskFunc } from "orchestrator";

import * as del from "del";

/**
 * Removes the generated css from the SASS target.
 */
module.exports = function(gulp: gulp.Gulp, plugins: GulpPlugins): TaskFunc {

    return function(cb) {

        del([
            "www/css/bundle.css",
            "www/css/bundle.css.map"
        ]).then(function () {
            cb();
        });
    };
};
