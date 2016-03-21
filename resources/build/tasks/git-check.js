
// Native Node Modules
var fs = require("fs");

// Other Node Modules
var sh = require("shelljs");

/**
 * An default task provided by Ionic used to check if Git is installed.
 * 
 * If git is not available an error message will be emitted and halt gulp.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        if (!sh.which("git")) {

            plugins.util.log(
            "  " + plugins.util.colors.red("Git is not installed."),
            "\n  Git, the version control system, is required to download plugins etc.",
            "\n  Download git here:", plugins.util.colors.cyan("http://git-scm.com/downloads") + ".",
            "\n  Once git is installed, run \"" + plugins.util.colors.cyan("gulp install") + "\" again."
            );

            cb(new Error("Git is not installed."));
            return;
        }

        cb();
    };
};
