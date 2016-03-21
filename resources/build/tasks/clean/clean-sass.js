
// Other Node Modules
var del = require("del");

/**
 * Removes the generated css from the SASS target.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        del([
            "www/css/bundle.css",
            "www/css/bundle.css.map"
        ]).then(function () {
            cb();
        });
    };
};
