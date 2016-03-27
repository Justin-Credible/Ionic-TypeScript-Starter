
// Native Node Modules
var path = require("path");

// Other Node Modules
var sh = require("shelljs");

/**
 * Used to perform compilation of the unit TypeScript tests in the tests directory
 * and output the JavaScript to tests/tests-bundle.js. Compilation parameters are
 * located in tests/tsconfig.json.
 * 
 * It will also delegate to the ts task to ensure that the application source is
 * compiled as well.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        var tscBin = path.join("node_modules", ".bin", "tsc");

        var result = sh.exec(tscBin + " -p tests");

        if (result.code !== 0) {
            cb(new Error(result.output));
            return;
        }

        cb();
    };
};
