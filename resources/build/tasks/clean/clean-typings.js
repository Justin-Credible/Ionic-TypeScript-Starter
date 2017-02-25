
// Other Node Modules
var del = require("del");

/**
 * Removes files related to TypeScript definitions.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        // TODO: These patterns don't actually remove the sub-directories
        // located in the typings directories, they leave the directories
        // but remove the *.d.ts files. The following glob should work for
        // remove directories and preserving the custom directory, but they
        // don't for some reason and the custom directory is always removed:
        // "typings/**"
        // "!typings/custom/**"

        del([
            "src/tsd.d.ts",
            "typings/**/*.d.ts",
            "!typings/custom/*.d.ts",
            // "typings/**",
            // "!typings/custom/**",

            "tests/tsd.d.ts",
            "typings-tests/**/*.d.ts",
            "!typings-tests/custom/*.d.ts",
            // "typings-tests/**",
            // "!typings/custom/**"
        ]).then(function () {
            cb();
        });
    };
};
