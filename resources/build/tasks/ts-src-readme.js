
// Native Node Modules
var path = require("path");

// Other Node Modules
var helper = require("./helper");

/**
 * Used to add a readme file to www/js/src to explain what the directory is for.
 * 
 * This will only copy the files if the build scheme is not set to release.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        if (!helper.isDebugBuild()) {
            cb();
            return;
        }

        var infoMessage = "This directory contains a copy of the TypeScript source files for debug builds; it can be safely deleted and will be regenerated via the gulp ts task.\n\nTo omit this directory create a release build by specifying the scheme:\ngulp ts --scheme release";

        return helper.streamStringToFile(infoMessage, "readme.txt")
            .pipe(gulp.dest("www/js/src/"));
    };
};
