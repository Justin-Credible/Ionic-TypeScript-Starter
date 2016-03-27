
// Native Node Modules
var path = require("path");

// Other Node Modules
var sh = require("shelljs");

/**
 * Used to download all of the bower dependencies as defined in bower.json and place
 * the consumable pieces in the www/lib directory.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        var command = path.join("node_modules", ".bin", "bower-installer");
        var result = sh.exec(command);

        if (result.code !== 0) {
            cb(new Error(result.output));
            return;
        }

        cb();
    };
};
