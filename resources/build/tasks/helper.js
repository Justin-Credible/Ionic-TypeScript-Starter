
// Native Node Modules
var fs = require("fs");
var path = require("path");

// Gulp Plugins
var plugins = require("gulp-load-plugins")();

// Other Node Modules
var _ = require("lodash");
var sh = require("shelljs");
var yaml = require("js-yaml");


/**
 * Exposes utility methods for use by the gulp tasks.
 */
module.exports = helper = {

    /**
     * Used to format a string by replacing values with the given arguments.
     * Arguments should be provided in the format of {x} where x is the index
     * of the argument to be replaced corresponding to the arguments given.
     * 
     * For example, the string t = "Hello there {0}, it is {1} to meet you!"
     * used like this: format(t, "dude", "nice") would result in:
     * "Hello there dude, it is nice to meet you!".
     * 
     * @param str The string value to use for formatting.
     * @param args The values to inject into the format string.
     */
    format: function(formatString) {
        var i, reg;
        i = 0;

        for (i = 0; i < arguments.length - 1; i += 1) {
            reg = new RegExp("\\{" + i + "\\}", "gm");
            formatString = formatString.replace(reg, arguments[i + 1]);
        }

        return formatString;
    },

    /**
     * Used to log an informational message using plugins.util.log(...) with an
     * "Info: " prefix.
     */
    info: function(message) {
        plugins.util.log("Info: " + message);
    },

    /**
     * Used to log a warning message using plugins.util.log(...) with a yellow colors
     * and "Warning: " prefix.
     */
    warn: function(message) {
        plugins.util.log(plugins.util.colors.yellow("Warning: " + message));
    },

    /**
     * Helper used to pipe an arbitrary string value into a file.
     * 
     * http://stackoverflow.com/a/23398200/4005811
     */
    streamStringToFile: function(str, fileName) {
        var src = require("stream").Readable({ objectMode: true });

        src._read = function () {
            this.push(new plugins.util.File({ cwd: "", base: "", path: fileName, contents: new Buffer(str) }));
            this.push(null);
        };

        return src;
    },

    /**
     * Used to get the short SHA of the current git commit.
     * Returns unknown if the git command fails.
     */
    getCommitShortSha: function() {
        // Grab the git commit hash.
        var shResult = sh.exec("git rev-parse --short HEAD", { silent: true });

        if (shResult.code !== 0) {
            helper.warn("Unable to get the git revision number; using 'Unknown' instead. Failure reason:\n" + shResult.output);
            return "Unknown";
        }
        else {
            return shResult.output.replace("\n", "");
        }
    },

    /**
     * A custom reporter for the TypeScript linter reporter function. This was copied
     * and modified from gulp-tslint.
     */
    logTsLintError: function(message, level) {
        var prefix = helper.format("[{0}]", plugins.util.colors.cyan("gulp-tslint"));

        if (level === "error") {
            plugins.util.log(prefix, plugins.util.colors.red("error"), message);
        } else if (level === "warn") {
            plugins.util.log(prefix, plugins.util.colors.yellow("warn"), message);
        } else {
            plugins.util.log(prefix, message);
        }
    },

    /**
     * A custom reporter for the TypeScript linter so we can pass "warn" instead of
     * "error" to be recognized by Visual Studio Code's pattern matcher as warnings
     * instead of errors. This was copied and modified from gulp-tslint.
     */
    tsLintReporter: function(failures, file) {
        failures.forEach(function(failure) {
            var message = helper.format("({0}) {1}[{2}, {3}]: {4}",
                                    failure.ruleName,
                                    file.path,
                                    (failure.startPosition.line + 1),
                                    (failure.startPosition.character + 1),
                                    failure.failure);

            helper.logTsLintError(message, "warn")
        });
    },

    /**
     * A custom reporter for the sass compilation task so we can control the formatting
     * of the message for our custom problem matcher in Visual Studio Code.
     */
    sassReporter: function(failure) {
        var file = failure.message.split("\n")[0];
        var message = failure.message.split("\n")[1];

        var formattedMessage = helper.format("[sass] [{0}] {1}:{2}",
                                    failure.name.toLowerCase(),
                                    file,
                                    message);

        plugins.util.log(formattedMessage);
    },

    /**
     * Used to determine if the gulp operation was launched for a debug or release build.
     * This is controlled by the scheme's debug flag.
     */
    isDebugBuild: function() {

        // Grab the scheme by name.
        var schemeName = helper.getCurrentSchemeName();
        var scheme = helper.getSchemeByName(schemeName);

        // If we didn't find a scheme by name, then fail fast.
        if (!scheme) {
            throw new Error(helper.format("Could not locate a build scheme with name '{0}' in resources/config/schemes.yml", schemeName));
        }

        // Grab the debug flag.
        var isDebug = !!scheme.debug;

        return isDebug;
    },

    /**
     * Used to determine if a prepare flag was set to "chrome".
     * 
     * gulp init --prep chrome
     */
    isPrepChrome: function() {
        return plugins.util.env.prep === "chrome" ? true : false;
    },

    /**
     * Used to determine if a prepare flag was set to "web".
     * 
     * gulp init --prep web
     */
    isPrepWeb: function() {
        return plugins.util.env.prep === "web" ? true : false;
    },

    /**
     * Used to recursively delete all empty directories under the given path.
     */
    deleteEmptyDirectories: function(basePath) {

        var paths = sh.ls("-RA", basePath);

        if (!paths) {
            return;
        }

        paths.forEach(function(file) {

            file = path.join(basePath, file);

            if (fs.lstatSync(file).isDirectory()) {

                var childPaths = sh.ls("-A", file);

                if (childPaths != null && childPaths.length === 0) {
                    sh.rm("-rf", file);
                }
                else {
                }
            }
        });
    },

    /**
     * Used to get the name of the scheme specified via the --scheme flag, or if one is not present
     * the default scheme as defined in schemes.yml.
     */
    getCurrentSchemeName: function() {

        // Grab the scheme name as defined via an argument (eg gulp config --scheme scheme_name).
        var schemeName = plugins.util.env.scheme;

        // If a scheme name was supplied via the command line, then use the default from config.
        if (!schemeName) {
            var schemeConfigYmlRaw = fs.readFileSync("resources/config/schemes.yml", "utf8").toString();
            var schemesConfig = yaml.safeLoad(schemeConfigYmlRaw);

            if (!schemesConfig) {
                throw new Error("Unable to read build schemes from resources/config/config.yml");
            }

            schemeName = schemesConfig.default;
        }

        return schemeName;
    },

    /**
     * Used to get the scheme from resources/config/schemes.yml with the given name.
     */
    getSchemeByName: function(schemeName) {

        // Read and parse the schemes.yml file.
        var schemeConfigYmlRaw = fs.readFileSync("resources/config/schemes.yml", "utf8").toString();
        var schemesConfig = yaml.safeLoad(schemeConfigYmlRaw);

        if (!schemesConfig || !schemesConfig.schemes) {
            throw new Error("Unable to load build schemes from resources/config/schemes.yml");
        }

        var scheme = schemesConfig.schemes[schemeName];

        // If we couldn't find a scheme with this name, fail fast.
        if (!scheme) {
            throw new Error(helper.format("Could not locate a build scheme with name '{0}' in resources/config/schemes.yml", schemeName));
        }

        // Ensure the replacements dictionary exists.
        if (!scheme.replacements) {
            scheme.replacements = {};
        }

        // See if this scheme has a base defined.
        var baseSchemeName = scheme.base;

        // Here we gather up all of the replacement nodes for each of the parent schemes.
        while (baseSchemeName) {

            var baseScheme = schemesConfig.schemes[baseSchemeName];

            if (!baseScheme) {
                throw new Error(helper.format("Could not locate a build scheme with name '{0}' in resources/config/schemes.yml", schemeName));
            }

            // Merge the replacement entries from the base to the parent.
            if (baseScheme.replacements) {

                for (var key in baseScheme.replacements) {

                    if (!baseScheme.replacements.hasOwnProperty(key)) {
                        continue;
                    }

                    if (scheme.replacements[key] == null) {
                        scheme.replacements[key] = baseScheme.replacements[key];
                    }
                }
            }

            // If this scheme has another base scheme, then we'll need to examine it as well.
            // Set the parent name here so the while loop executes again.
            baseSchemeName = baseScheme.base;
        }

        return scheme;
    },

    /**
     * Used to perform variable replacement on a master file and write out the resulting file.
     * Variables are determined by the given scheme as defined in schemes.xml.
     */
    performVariableReplacement: function(schemeName, sourceFilePath, destinationFilePath) {

        // Grab the scheme by name.
        var scheme = helper.getSchemeByName(schemeName);

        // If we didn't find a scheme by name, then fail fast.
        if (!scheme) {
            throw new Error(helper.format("Could not locate a build scheme with name '{0}' in resources/config/schemes.yml", schemeName));
        }

        // Open the master file that we'll perform replacements on.
        var content = fs.readFileSync(sourceFilePath, "utf8").toString();

        // Loop through each replacement variable we have defined.
        for (var key in scheme.replacements) {

            if (!scheme.replacements.hasOwnProperty(key)) {
                continue;
            }

            var replacementTarget = "\\${" + key + "}";
            var replacementValue = scheme.replacements[key];

            // Search and replace the ${TARGET} with the value in the files.
            content = content.replace(new RegExp(replacementTarget, "g"), replacementValue);
        }

        // Write out the files that have replacements.
        fs.writeFileSync(destinationFilePath, content, "utf8");
    },

    /**
     * Used to insert link/script tags for CSS and JavaScript references using a master file and
     * write out the resulting file.
     * 
     * The following tags will be used for replacement:
     * • CSS: <!-- references:css -->
     * • JS Libs: <!-- references:lib -->
     * • JS: <!-- references:js -->
     * 
     * If bundled is true, the following static references will be used:
     * • CSS: app.bundle.css
     * • JS Libs: app.bundle.lib.js
     * • JS: app.bundle.js
     * 
     * If bundled is false, the map of files provided in the given referencesFilePath will be used
     * to grab each file and emit a link/script tag for each resource type.
     */
    performReferenceReplacement: function(sourceFilePath, targetFilePath, bundled, cacheBusterValue, referencesFilePath) {

        var cssRegExp = /^([\t ]+)<!-- references:css -->/gm;
        var libRegExp = /^([\t ]+)<!-- references:lib -->/gm;
        var jsRegExp = /^([\t ]+)<!-- references:js -->/gm;

        // Open the master file that we'll perform replacements on.
        var content = fs.readFileSync(sourceFilePath, "utf8").toString();

        // Lets handle the easy case first. If bundled is true, then we subsitute some static paths.
        if (bundled) {

            content = content.replace(cssRegExp, function (match, whitespaceMatch, offset, string) {
                return helper.format('{0}<link rel="stylesheet" href="css/app.bundle.css{1}">',
                            whitespaceMatch,
                            cacheBusterValue ? "?v=" + cacheBusterValue : "");
            });

            content = content.replace(libRegExp, function (match, whitespaceMatch, offset, string) {
                return helper.format('{0}<script type="text/javascript" src="lib/app.bundle.lib.js{1}"></script>',
                            whitespaceMatch,
                            cacheBusterValue ? "?v=" + cacheBusterValue : "");
            });

            content = content.replace(jsRegExp, function (match, whitespaceMatch, offset, string) {
                return helper.format('{0}<script type="text/javascript" src="js/app.bundle.js{1}"></script>',
                            whitespaceMatch,
                            cacheBusterValue ? "?v=" + cacheBusterValue : "");
            });

            fs.writeFileSync(targetFilePath, content, "utf8");

            return;
        }

        if (!referencesFilePath) {
            throw new Error("The bundled flag was false, but no referencesFilePath was provided.");
        }

        // Read in the file that contains the list of resource references.
        var resourceYmlRaw = fs.readFileSync(referencesFilePath, "utf8").toString();
        var resources = yaml.safeLoad(resourceYmlRaw);

        if (!resources) {
            throw new Error("Unable to read resource references from " + referencesFilePath);
        }

        // Inject link tags for the CSS files.
        if (resources.css && resources.css.length > 0) {

            var cssReferences = [];

            resources.css.forEach(function (cssReference) {
                cssReferences.push(helper.format('<link rel="stylesheet" href="{0}">', cssReference));
            });

            content = content.replace(cssRegExp, function (match, whitespaceMatch, offset, string) {
                return whitespaceMatch + cssReferences.join("\n" + whitespaceMatch);
            });
        }
        else {
            content = content.replace(cssRegExp, "");
        }

        // Inject script tags for the JS libraries.
        if (resources.lib && resources.lib.length > 0) {

            var libReferences = [];

            resources.lib.forEach(function (libReference) {
                libReferences.push(helper.format('<script type="text/javascript" src="{0}"></script>', libReference));
            });

            content = content.replace(libRegExp, function (match, whitespaceMatch, offset, string) {
                return whitespaceMatch + libReferences.join("\n" + whitespaceMatch);
            });
        }
        else {
            content = content.replace(libRegExp, "");
        }

        // Inject script tags for the JS files.
        if (resources.js && resources.js.length > 0) {

            var jsReferences = [];

            resources.js.forEach(function (jsReference) {
                jsReferences.push(helper.format('<script type="text/javascript" src="{0}"></script>', jsReference));
            });

            content = content.replace(jsRegExp, function (match, whitespaceMatch, offset, string) {
                return whitespaceMatch + jsReferences.join("\n" + whitespaceMatch);
            });
        }
        else {
            content = content.replace(jsRegExp, "");
        }

        fs.writeFileSync(targetFilePath, content, "utf8");
    },

    /**
     * Used to create a JavaScript file containing build variables git sha, build timestamp, and all
     * of the values of config.yml file.
     */
    createBuildVars: function(schemeName, configYmlPath, targetBuildVarsPath) {

        // Grab the scheme by name.
        var scheme = helper.getSchemeByName(schemeName);

        // If we didn't find a scheme by name, then fail fast.
        if (!scheme) {
            throw new Error(helper.format("Could not locate a build scheme with name '{0}' in resources/config/schemes.yml", schemeName));
        }

        // Read in the shared configuration file.
        var configYmlRaw = fs.readFileSync(configYmlPath).toString();

        // Perform variable replacements based on the active scheme.

        // Loop through each replacement variable we have defined.
        for (var key in scheme.replacements) {

            if (!scheme.replacements.hasOwnProperty(key)) {
                continue;
            }

            var replacementTarget = "\\${" + key + "}";
            var replacementValue = scheme.replacements[key];

            // Search and replace the ${TARGET} with the value in the files.
            configYmlRaw = configYmlRaw.replace(new RegExp(replacementTarget, "g"), replacementValue);
        }

        // Grab the debug flag.
        var isDebug = !!scheme.debug;

        // If the debug flag was never set, then default to true.
        if (isDebug == null) {
            helper.warn(helper.format("The debug attribute was not set for scheme '{0}'; defaulting to true.", schemeName));
            isDebug = true;
        }

        // Parse the in-memory, modified version of the config.yml.
        var config = yaml.safeLoad(configYmlRaw);

        // Create the structure of the buildVars variable.
        var buildVars = {
            debug: isDebug,
            buildTimestamp: (new Date()).toUTCString(),
            commitShortSha: helper.getCommitShortSha(),
            config: config
        };

        // Write the buildVars variable with code that will define it as a global object.
        var buildVarsJs = helper.format("window.buildVars = {0};", JSON.stringify(buildVars));

        // Write the file out to disk.
        fs.writeFileSync(targetBuildVarsPath, buildVarsJs, "utf8");
    },

    /**
     * Used to bundle CSS and JS into single files for the files given in the manifest
     * at the given source directory path.
     * 
     * This will result in the following bundles being created:
     * • <targetDir>/app.bundle.css
     * • <targetDir>/app.bundle.lib.js
     * • <targetDir>/app.bundle.js
     */
    bundleStaticResources: function(sourceDir, targetDir, resourceManifestPath) {

        var resourceManifestRaw = fs.readFileSync(resourceManifestPath, "utf8").toString();
        var resourceManifest = yaml.safeLoad(resourceManifestRaw);

        if (!resourceManifest) {
            throw new Error(helper.format("Unable to load resource manifest list from {0}", resourceManifestPath));
        }

        if (resourceManifest.css && resourceManifest.css.length > 0) {

            // Append the source directory path to each resource in the manifest.
            var cssReferences = _.map(resourceManifest.css, function (resource) {
                return path.join(sourceDir, resource);
            });

            // Concatenate all of the resources.
            var cssBundle = sh.cat(cssReferences);

            // Write the bundle
            fs.writeFileSync(path.join(targetDir, "app.bundle.css"), cssBundle, "utf8");
        }

        if (resourceManifest.lib && resourceManifest.lib.length > 0) {

            // Append the source directory path to each resource in the manifest.
            var libReferences = _.map(resourceManifest.lib, function (resource) {
                return path.join(sourceDir, resource);
            });

            // Concatenate all of the resources.
            var libBundle = sh.cat(libReferences);

            // Write the bundle
            fs.writeFileSync(path.join(targetDir, "app.bundle.lib.js"), libBundle, "utf8");
        }

        if (resourceManifest.js && resourceManifest.js.length > 0) {

            // Append the source directory path to each resource in the manifest.
            var jsReferences = _.map(resourceManifest.js, function (resource) {
                return path.join(sourceDir, resource);
            });

            // Concatenate all of the resources.
            var jsBundle = sh.cat(jsReferences);

            // Write the bundle
            fs.writeFileSync(path.join(targetDir, "app.bundle.js"), jsBundle, "utf8");
        }
    }
}
