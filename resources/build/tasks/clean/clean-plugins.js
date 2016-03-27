
// Other Node Modules
var del = require("del");

/**
 * Removes the plugins directory.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        del([
            "plugins"
        ]).then(function () {
            cb();
        });
    };
};
