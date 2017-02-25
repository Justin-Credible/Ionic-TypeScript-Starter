
// Native Node Modules
var path = require("path");

// Other Node Modules
var helper = require("./helper");
var runSequence = require("run-sequence");
var sh = require("shelljs");

/**
 * Uses the typings command to restore TypeScript definitions to the typings
 * directories and rebuild the typings.d.ts typings bundle for both the app
 * as well as the unit tests.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {
        runSequence("typings:app", "typings:tests", cb);
    };
};
