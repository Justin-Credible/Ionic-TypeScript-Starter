
// Other Node Modules
var helper = require("./helper");
var sh = require("shelljs");

/**
 * Used to perform configuration based on different build schemes listed resources/config/schemes.yml
 * by specifying the scheme when executing the task: gulp config --scheme scheme_name
 * 
 * It generates the following files from their template ("master") files by performing variable
 * replacement based on the given scheme name.
 * 
 * • resources/config/config.yml -> www/js/build-vars.js
 * 
 * In addition, if no --prep flag is specified:
 * • resources/cordova/config.master.xml -> config.xml
 * • resources/cordova/index.master.xml -> www/index.html
 * 
 * In addition, if the --prep web flag is specified:
 * • resources/web/index.master.html -> www/index.html
 * • resources/web/manifest.master.json -> build/web/manifest.json
 * • resources/web/browserconfig.master.xml -> build/web/browserconfig.xml
 * 
 * In addition, if the --prep chrome flag is specified:
 * • resources/chrome/index.master.html -> www/index.html
 * • resources/chrome/manifest.master.json -> build/chrome/manifest.json
 */
module.exports = function(gulp, plugins) {

    return function (cb) {

        var schemeName = helper.getCurrentSchemeName();

        helper.info(helper.format("Configuring application with scheme: {0}", schemeName));

        if (helper.isPrepWeb()) {
            // Web Package: --prep web

            sh.mkdir("-p", "build/web");

            helper.info(helper.format("Generating: build/web/manifest.json from: resources/web/manifest.master.json"));
            helper.performVariableReplacement(schemeName, "resources/web/manifest.master.json", "build/web/manifest.json");

            helper.info(helper.format("Generating: build/web/browserconfig.xml from: resources/web/browserconfig.master.xml"));
            helper.performVariableReplacement(schemeName, "resources/web/browserconfig.master.xml", "build/web/browserconfig.xml");

            helper.info(helper.format("Generating: www/index.html from: resources/web/index.master.html"));
            helper.performVariableReplacement(schemeName, "resources/web/index.master.html", "www/index.html");

            helper.info(helper.format("Adding app bundle resource references to: www/index.html"));
            helper.performReferenceReplacement("www/index.html", "www/index.html", false, null, "resources/web/index.references.yml");
        }
        else if (helper.isPrepChrome()) {
            // Chrome Extension: --prep chrome

            sh.mkdir("-p", "build/chrome");

            helper.info(helper.format("Generating: build/chrome/manifest.json from: resources/chrome/manifest.master.json"));
            helper.performVariableReplacement(schemeName, "resources/chrome/manifest.master.json", "build/chrome/manifest.json");

            helper.info(helper.format("Generating: www/index.html from resources/chrome/index.master.html"));
            helper.performVariableReplacement(schemeName, "resources/chrome/index.master.html", "www/index.html");

            helper.info(helper.format("Adding resource references to: www/index.html using: resources/chrome/index.references.yml"));
            helper.performReferenceReplacement("www/index.html", "www/index.html", false, null, "resources/chrome/index.references.yml");
        }
        else {
            // Cordova: default or no --prep flag

            helper.info(helper.format("Generating: config.xml from: resources/cordova/config.master.xml"));
            helper.performVariableReplacement(schemeName, "resources/cordova/config.master.xml", "config.xml");

            helper.info(helper.format("Generating: www/index.html from: resources/cordova/index.master.html"));
            helper.performVariableReplacement(schemeName, "resources/cordova/index.master.html", "www/index.html");

            helper.info(helper.format("Adding resource references to: www/index.html using: resources/cordova/index.references.yml"));
            helper.performReferenceReplacement("www/index.html", "www/index.html", false, null, "resources/cordova/index.references.yml");
        }

        helper.info(helper.format("Generating runtime configuration at: www/js/build-vars.js using: resources/config/config.yml"));
        helper.createBuildVars(schemeName, "resources/config/config.yml", "www/js/build-vars.js");

        cb();
    };
};