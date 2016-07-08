
// Native Node Modules
var path = require("path");

// Other Node Modules
var helper = require("./helper");

/**
 * Performs linting of the TypeScript source code.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {
        // Slight restructure and add separate custom typings folder
        var filesToLint = [
            "./src/**/*.ts",
            "./tests/**/*.ts",
            "./typings-tests/custom/**/*.d.ts"
        ];

        try {
            return gulp.src(filesToLint)
            .pipe(plugins.tslint())
            .pipe(plugins.tslint.report(helper.tsLintReporter));
        } catch(err) {
            console.log(err);
        }
        
    };
};
