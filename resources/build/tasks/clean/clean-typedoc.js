
// Other Node Modules
var del = require("del");

/**
 * Removes the build/typedocs directory.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        del([
            "build/typedocs"
        ]).then(function () {
            cb();
        });
    };
};
