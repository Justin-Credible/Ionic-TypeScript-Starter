
import * as gulp from "gulp";
import { GulpPlugins } from "./gulp-types";
import { TaskFunc } from "orchestrator";

import * as helper from "./gulp-helper";

/**
 * Used to perform compilation of the SASS styles in the styles directory (using
 * Index.scss as the root file) and output the CSS to www/css/bundle.css.
 */
module.exports = function(gulp: gulp.Gulp, plugins: GulpPlugins): TaskFunc {

    return function(cb) {

        let sassConfig = {
            outputStyle: helper.isDebugBuild() ? "nested" : "compressed",
            errLogToConsole: false
        };

        return gulp.src("./src/Styles/Index.scss")
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.sass(sassConfig).on("error", helper.sassReporter))
            .pipe(plugins.rename("bundle.css"))
            .pipe(plugins.sourcemaps.write("./"))
            .pipe(gulp.dest("./www/css"));
    };
};
