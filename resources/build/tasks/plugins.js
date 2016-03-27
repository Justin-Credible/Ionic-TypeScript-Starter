
// Native Node Modules
var fs = require("fs");
var path = require("path");

// Other Node Modules
var helper = require("./helper");
var sh = require("shelljs");

/**
 * Used to download and configure each platform with the Cordova plugins as defined
 * in the cordovaPlugins section of the package.json file.
 * 
 * This is equivalent to using the "cordova plugins add pluginName" command for each
 * of the plugins.
 */
module.exports = function (gulp, plugins) {

    return function(cb) {

        // We don't need Cordova plugins for the web bundle.
        if (helper.isPrepWeb() || helper.isPrepChrome()) {
            helper.info(helper.format("Skipping Cordova plugins because the '--prep {0}' flag was specified.", plugins.util.env.prep));
            cb();
            return;
        }

        var pluginList = JSON.parse(fs.readFileSync("package.json", "utf8")).cordovaPlugins;

        for (var key in pluginList) {
            var plugin = pluginList[key],
                pluginName,
                additionalArguments = "";

            if (typeof(plugin) === "object" && typeof(plugin.locator) === "string") {
                pluginName = plugin.locator;

                if (plugin.variables) {
                    Object.keys(plugin.variables).forEach(function (variable) {
                        additionalArguments += helper.format(' --variable {0}="{1}"', variable, plugin.variables[variable]);
                    });
                }
            }
            else if (typeof(plugin) === "string") {
                pluginName = plugin;
            }
            else {
                cb(new Error("Unsupported plugin object type (must be string or object with a locator property)."));
                return;
            }

            var cordovaBin = path.join("node_modules", ".bin", "cordova");
            var command = cordovaBin + " plugin add " + pluginName + additionalArguments;

            var result = sh.exec(command);

            if (result.code !== 0) {
                cb(new Error(result.output));
                return;
            }
        }

        cb();
    };
};
