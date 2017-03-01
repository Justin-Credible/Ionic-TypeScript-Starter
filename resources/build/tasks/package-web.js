
// Native Node Modules
var fs = require("fs");
var path = require("path");

// Other Node Modules
var helper = require("./helper");
var runSequence = require("run-sequence");
var sh = require("shelljs");

/**
 * Packages the application for deployment for the web.
 * This does not compile SASS, TypeScript, templates, etc.
 * 
 * This performs: gulp config --prep web
 * and copies www content into build/web and creates build/web.zip
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        // Warn the user if they try to use a different prep flag value.
        if (plugins.util.env.prep != null && plugins.util.env.prep != "web") {
            helper.warn(helper.format("The '--prep {0}' flag is invalid for the 'package-web' task; overriding it to: '--prep web'.", plugins.util.env.prep));
        }

        // Ensure that the prep flag is set to "web" (used by the config task).
        plugins.util.env.prep = "web";

        // Ensure the previous files are cleared out.
        sh.rm("-rf", "build/web");
        sh.rm("-rf", "build/web.tar.gz");

        // Ensure the target directory exists.
        sh.mkdir("-p", "build/web");

        // Delegate to the config task to generate the index, manifest, and build vars.
        runSequence("config", function (err) {

            if (err) {
                cb(err);
                return;
            }

            helper.info("Copying www to build/web");
            sh.cp("-R", "www/", "build/web");

            helper.info("Bundling css, lib, and js directories to build/web/resources-temp");
            sh.mkdir("-p", "build/web/resources-temp");
            helper.bundleStaticResources("build/web", "build/web/resources-temp", "resources/web/index.references.yml")

            helper.info("Removing css and js directories from build/web");
            sh.rm("-rf", "build/web/css");
            sh.rm("-rf", "build/web/js");

            // We can't just remove the entire lib directory (even though we've bundled up all
            // of its JavaScript resources) because it can also contain other assets like fonts
            // that will need to remain in place so they can be loaded at runtime. Here we remove
            // all files EXCEPT for those with extensions as defined in this array.

            var libFileExtensionsToKeep = [
                ".woff",
            ];

            helper.info("Removing redundant files from build/web/lib");

            sh.ls("-RA", "build/web/lib").forEach(function (file) {

                file = path.join("build/web/lib", file);

                if (!fs.lstatSync(file).isDirectory()) {
                    var extension = path.extname(file);

                    if (libFileExtensionsToKeep.indexOf(extension) === -1) {
                        sh.rm("-rf", file);
                    }
                }
            });

            helper.info("Removing empty directories from build/web/lib");
            helper.deleteEmptyDirectories("build/web/lib");

            helper.info("Moving bundled css to build/web/css/app.bundle.css");
            sh.mkdir("-p", "build/web/css");
            sh.mv(["build/web/resources-temp/app.bundle.css"], "build/web/css/app.bundle.css");

            helper.info("Moving bundled lib to build/web/lib/app.bundle.lib.js");
            sh.mv(["build/web/resources-temp/app.bundle.lib.js"], "build/web/lib/app.bundle.lib.js");

            helper.info("Moving bundled js to build/web/js/app.bundle.js");
            sh.mkdir("-p", "build/web/js");
            sh.mv(["build/web/resources-temp/app.bundle.js"], "build/web/js/app.bundle.js");

            sh.rm("-rf", "build/web/resources-temp");

            var schemeName = helper.getCurrentSchemeName();

            helper.info(helper.format("Generating: build/web/index.html from: resources/web/index.master.html"));
            helper.performVariableReplacement(schemeName, "resources/web/index.master.html", "build/web/index.html");

            helper.info(helper.format("Adding app bundle resource references to: build/web/index.html"));
            helper.performReferenceReplacement("build/web/index.html", "build/web/index.html", true, helper.getCommitShortSha(), "resources/web/index.references.yml");

            // Archive the directory.
            gulp.src("build/web/**/*", { base: "build/web" })
                .pipe(plugins.tar("web.tar"))
                .pipe(plugins.gzip())
                .pipe(gulp.dest("build"))
                .on("end", cb);
        });
    };
};
