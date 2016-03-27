
// Native Node Modules
var path = require("path");

// Other Node Modules
var sh = require("shelljs");

/**
 * Simply delegates to the "cordova emulate ios" command.
 * 
 * Useful to quickly execute from Visual Studio Code's task launcher:
 * Bind CMD+Shift+R to "workbench.action.tasks.runTask task launcher"
 * 
 * This does not compile SASS, TypeScript, templates, etc.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        var cordovaBin = path.join("node_modules", ".bin", "cordova");
        var command = cordovaBin + " emulate ios";

        sh.exec(command);
        cb();
    };
};
