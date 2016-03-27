
// Native Node Modules
var path = require("path");

// Other Node Modules
var helper = require("./helper");
var runSequence = require("run-sequence");
var sh = require("shelljs");

/**
 * Uses the tsd command to restore TypeScript definitions to the typings
 * directories and rebuild the tsd.d.ts typings bundle for both the app
 * as well as the unit tests.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {
        runSequence("tsd:app", "tsd:tests", cb);
    };
};
