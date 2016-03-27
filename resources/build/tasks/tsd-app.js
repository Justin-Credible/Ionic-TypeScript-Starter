
// Native Node Modules
var path = require("path");

// Other Node Modules
var sh = require("shelljs");

/**
 * Uses the tsd command to restore TypeScript definitions to the typings
 * directory and rebuild the tsd.d.ts typings bundle (for the app).
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        var tsdBin = path.join("node_modules", ".bin", "tsd");

        // First reinstall any missing definitions to the typings directory.
        var result = sh.exec(tsdBin + " reinstall");

        if (result.code !== 0) {
            cb(new Error(result.output));
            return;
        }

        // Rebuild the src/tsd.d.ts bundle reference file.
        result = sh.exec(tsdBin + " rebundle");

        if (result.code !== 0) {
            cb(new Error(result.output));
            return;
        }

        cb();
    };
};
