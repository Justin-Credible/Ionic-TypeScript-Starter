
// Native Node Modules
var path = require("path");

// Other Node Modules
var sh = require("shelljs");

/**
 * Used to concatenate all of the HTML templates into a single JavaScript module.
 */
module.exports = function(gulp, plugins) {

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
