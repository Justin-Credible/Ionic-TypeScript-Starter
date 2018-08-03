
import * as gulp from "gulp";
import { GulpPlugins } from "./gulp-types";
import { TaskFunc } from "orchestrator";

import * as fs from "fs";
import * as path from "path";

import * as sh from "shelljs";
import * as helper from "./gulp-helper";

/**
 * Used to download and configure each platform with the Cordova plugins as defined
 * in the cordovaPlugins section of the package.json file.
 * 
 * This is equivalent to using the "cordova plugins add pluginName" command for each
 * of the plugins.
 */
module.exports = function(gulp: gulp.Gulp, plugins: GulpPlugins): TaskFunc {

    return function(cb) {

        // We don't need Cordova plugins for the web bundle.
        if (helper.isPrepWeb() || helper.isPrepChrome()) {
            helper.info(helper.format("Skipping Cordova plugins because the '--prep {0}' flag was specified.", plugins.util.env.prep));
            cb();
            return;
        }

        let pluginList: Array<string|any> = JSON.parse(fs.readFileSync("package.json", "utf8")).cordovaPlugins;

        for (let plugin of pluginList) {

            let pluginName = null;
            let additionalArguments = "";

            if (typeof(plugin) === "object" && typeof(plugin.locator) === "string") {
                pluginName = plugin.locator;

                if (plugin.variables) {
                    Object.keys(plugin.variables).forEach(function (variable) {
                        additionalArguments += ` --variable ${variable}="${plugin.variables[variable]}"`;
                    });
                }
            }
            else if (typeof(plugin) === "string") {
                pluginName = plugin;
            }
            else {
                cb(new Error("Unsupported plugin object type (must be string or object with a locator property). "));
                return;
            }

            let cordovaBin = path.join("node_modules", ".bin", "cordova");
            let command = cordovaBin + " plugin add " + pluginName + additionalArguments;

            let result = sh.exec(command);

            if (result.code !== 0) {
                cb(new Error(`Error running "${command}"`));
                return;
            }
        }

        cb();
    };
};
