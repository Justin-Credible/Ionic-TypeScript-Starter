
// Native Node Modules
var path = require("path");

// Other Node Modules
var sh = require("shelljs");

/**
 * Uses the tsd command to restore TypeScript definitions to the typings
 * directory and rebuild the tsd.d.ts typings bundle (for the unit tests).
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        var tsdBin = path.join("node_modules", ".bin", "typings");

        // First reinstall any missing definitions to the typings-tests directory.
        var result = sh.exec(tsdBin + " reinstall --config typings.tests.json");

        if (result.code !== 0) {
            cb(new Error(result.output));
            return;
        }

        // Rebuild the tests/tsd.d.ts bundle reference file.
        result = sh.exec(tsdBin + " rebundle --config typings.tests.json");

        if (result.code !== 0) {
            cb(new Error(result.output));
            return;
        }

        cb();
    };
};
