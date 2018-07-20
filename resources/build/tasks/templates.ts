
import * as gulp from "gulp";
import { GulpPlugins } from "./types";
import { TaskFunc } from "orchestrator";

/**
 * Used to concatenate all of the HTML templates into a single JavaScript module.
 */
module.exports = function(gulp: gulp.Gulp, plugins: GulpPlugins): TaskFunc {

    return function(cb) {

        return gulp.src(["./src/**/*.html"])
            .pipe(plugins.angularTemplatecache({
                "filename": "templates.js",
                "root": "",
                "module": "templates",
                standalone: true
            }))
            .pipe(gulp.dest("./www/js"));
    };
};
