
// Native Node Modules
var path = require("path");

// Other Node Modules
var helper = require("./helper");
var sh = require("shelljs");

/**
 * Used to perform compilation of the SASS styles in the styles directory (using
 * Index.scss as the root file) and output the CSS to www/css/bundle.css.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        var sassConfig = {
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
