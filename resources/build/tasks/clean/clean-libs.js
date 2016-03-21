
// Other Node Modules
var del = require("del");

/**
 * Removes the www/lib directory.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        del([
            "www/lib"
        ]).then(function () {
            cb();
        });
    };
};
