
// Other Node Modules
var del = require("del");

/**
 * Removes the build/chrome directory.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        del([
            "build/chrome"
        ]).then(function () {
            cb();
        });
    };
};
