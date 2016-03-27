
// Other Node Modules
var del = require("del");

/**
 * Removes the generated templates JavaScript from the templates target.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        del([
            "www/js/templates.js"
        ]).then(function () {
            cb();
        });
    };
};
