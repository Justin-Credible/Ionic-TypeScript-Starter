
// Other Node Modules
var del = require("del");

/**
 * Removes the node_modules directory.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        del([
            "node_modules"
        ]).then(function () {
            cb();
        });
    };
};
