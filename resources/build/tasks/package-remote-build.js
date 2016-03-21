
// Other Node Modules
var helper = require("./helper");
var sh = require("shelljs");

/**
 * Used to create a payload that can be sent to an OS X machine for build.
 * The payload will be placed in build/remote/taco-payload.tar.gz
 * 
 * This does not compile SASS, TypeScript, templates, etc.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        var files = [
            "./merges/**",
            "./resources/**",
            "./hooks/**",
            "./plugins/**",
            "./www/**",
            "./config.xml",
            "package.json"
        ];

        helper.info("Creating remote build package at: build/remote/taco-payload.tar.gz");

        // Note that we use the eol plugin here to transform line endings for js files to
        // the OS X style of \r instead of \r\n. We need to do this mainly for the scripts
        // in the hooks directory so they can be executed as scripts on OS X.
        return gulp.src(files, { base: "../" })
                .pipe(plugins.if("*.js", plugins.eol("\r")))
                .pipe(plugins.tar("taco-payload.tar"))
                .pipe(plugins.gzip())
                .pipe(gulp.dest("build/remote"));
    };
};
