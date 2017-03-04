
// Native Node Modules
var path = require("path");

// Other Node Modules
var helper = require("./helper");

/**
 * Performs linting of the TypeScript source code.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        var filesToLint = [
            "./src/**/*.ts",
            "./tests/**/*.ts",
            "./typings/custom/**/*.d.ts",
            "./typings-tests/custom/**/*.d.ts",

            // Ignore: This was written by a third party and does not match our lint rules.
            "!./typings/custom/ionic.d.ts",
        ];

        return gulp.src(filesToLint)
            .pipe(plugins.tslint())
            .pipe(plugins.tslint.report(helper.tsLintReporter));
    };
};
