
// Other Node Modules
var del = require("del");

/**
 * Removes the node_modules directory.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        del([
            "bower_components"
        ]).then(function () {
            cb();
        });
    };
};
