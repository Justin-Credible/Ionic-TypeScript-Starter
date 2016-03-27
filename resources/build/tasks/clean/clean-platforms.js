
// Other Node Modules
var del = require("del");

/**
 * Removes the platforms directory.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        del([
            "platforms"
        ]).then(function () {
            cb();
        });
    };
};
