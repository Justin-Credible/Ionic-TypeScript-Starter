
// Other Node Modules
var del = require("del");

/**
 * Removes the build directory.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        del([
            "build"
        ]).then(function () {
            cb();
        });
    };
};
