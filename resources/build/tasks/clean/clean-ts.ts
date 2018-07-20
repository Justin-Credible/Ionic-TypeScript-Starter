
import * as gulp from "gulp";
import { GulpPlugins } from "../../types";
import { TaskFunc } from "orchestrator";

import * as del from "del";

/**
 * Removes files related to TypeScript compilation.
 */
module.exports = function(gulp: gulp.Gulp, plugins: GulpPlugins): TaskFunc {

    return function(cb) {

        del([
            "www/js/bundle.js",
            "www/js/bundle.d.ts",
            "www/js/bundle.js.map",
            "www/js/src"
        ]).then(function () {
            cb();
        });
    };
};
