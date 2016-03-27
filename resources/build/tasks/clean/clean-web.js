
// Other Node Modules
var del = require("del");

/**
 * Removes the build/web directory.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        del([
            "build/web"
        ]).then(function () {
            cb();
        });
    };
};
