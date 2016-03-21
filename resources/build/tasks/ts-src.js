
// Native Node Modules
var path = require("path");

// Other Node Modules
var del = require("del");
var helper = require("./helper");

/**
 * Used to copy the entire TypeScript source into the www/js/src directory so that
 * it can be used for debugging purposes.
 * 
 * This will only copy the files if the build scheme is not set to release. A release
 * build will ensure that the files are deleted if they are present.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        if (helper.isDebugBuild()) {
            return gulp.src("./src/**/*.ts")
                .pipe(gulp.dest("www/js/src"));
        }
        else {
            del([
                "www/js/src",
                "www/js/bundle.js.map",
            ]).then(function () {
                cb();
            });
        }
    };
};
