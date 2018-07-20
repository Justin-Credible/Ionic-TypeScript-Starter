
import * as gulp from "gulp";
import { GulpPlugins } from "./types";
import { TaskFunc } from "orchestrator";

import * as helper from "./helper";

/**
 * The watch task will watch for any changes in the TypeScript, HTML, or SASS files and re-execute
 * the appropriate gulp task if they change. The "ionic serve" command will also invoke this task to
 * refresh the browser window during development.
 */
module.exports = function(gulp: gulp.Gulp, plugins: GulpPlugins): TaskFunc {

    return function(cb) {

        helper.info("Now watching src/ for changes to *.sass, *.html, and *.ts...");

        gulp.watch("./src/**/*.scss", ["sass"]);
        gulp.watch("./src/**/*.html", ["templates"]);
        gulp.watch("./src/**/*.ts", ["ts"]);
    };
};
