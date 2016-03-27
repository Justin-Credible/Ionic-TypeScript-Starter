
// Other Node Modules
var del = require("del");

/**
 * Removes files related to TypeScript compilation.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        del([
            "www/js/bundle.js",
            "www/js/bundle.d.ts",
            "www/js/bundle.js.map",
            "www/js/src"
        ]).then(function () {
            cb();
        });
    };
};
