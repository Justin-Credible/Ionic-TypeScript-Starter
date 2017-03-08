
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
     * 
     * If an override scheme was specified in the name, the returned scheme will have
     * values overrided by the specified override scheme. An override is specified by
     * adding the name with a comma. For example: "dev1,web" for dev1 with the web override.
     */
    getSchemeByName: function(schemeName) {

        if (!schemeName) {
            throw new Error("A scheme name was not specified.");
        }

        // Read and parse the schemes.yml file.
        var schemeConfigYmlRaw = fs.readFileSync("resources/config/schemes.yml", "utf8").toString();
        var schemesConfig = yaml.safeLoad(schemeConfigYmlRaw);

        if (!schemesConfig || !schemesConfig.schemes) {
            throw new Error("Unable to load build schemes from resources/config/schemes.yml");
        }

        var overrideSchemeName = null;

        // If the scheme name includes an override (designated by a comma) then we'll pull it out
        // and re-set the base scheme name so it can be used below.
        if (schemeName.indexOf(",") > -1) {
            overrideSchemeName = schemeName.split(",")[1];
            schemeName = schemeName.split(",")[0];
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

        // If there was an override scheme name, grab it and attempt to merge the values into the scheme.
        if (overrideSchemeName) {

            if (!schemesConfig.overrides) {
                throw new Error("Could not locate a build override section in resources/config/schemes.yml");
            }

            var overrideScheme = schemesConfig.overrides[overrideSchemeName];

            if (!overrideScheme) {
                throw new Error(helper.format("Could not locate a build override scheme with name '{0}' in resources/config/schemes.yml in the _overrides section.", overrideSchemeName));
            }

            for (var key in overrideScheme) {

                if (!overrideScheme.hasOwnProperty(key)) {
                    continue;
                }

                scheme.replacements[key] = overrideScheme[key];
            }
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

        // Morph the content security policy object into a flag string that can be used in the meta tag.
        if (typeof(scheme.replacements["CONTENT_SECURITY_POLICY"]) === "object") {
            scheme.replacements["CONTENT_SECURITY_POLICY"] = this.buildCspStringFromObject(scheme.replacements["CONTENT_SECURITY_POLICY"]);
        }

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
     * The referencesFilePath is a path to a file containing a map of resource files that will be used
     * to emit a link/script tag for each resource type. When bundled=true, a static path will be
     * inserted for each bundle, as well as references for any http/https file references.
     */
    performReferenceReplacement: function(sourceFilePath, targetFilePath, bundled, cacheBusterValue, referencesFilePath) {

        var cssRegExp = /^([\t ]+)<!-- references:css -->/gm;
        var libRegExp = /^([\t ]+)<!-- references:lib -->/gm;
        var jsRegExp = /^([\t ]+)<!-- references:js -->/gm;

        // Read in the file that contains the list of resource references.
        var resourceYmlRaw = fs.readFileSync(referencesFilePath, "utf8").toString();
        var resources = yaml.safeLoad(resourceYmlRaw);

        if (!resources) {
            throw new Error("Unable to read resource references from " + referencesFilePath);
        }

        // Lets handle a special case first. If bundled is true, we need to filter the references
        // down to just resources that are loaded via HTTP/HTTPS. The bundled references will be added
        // below, but the HTTP/HTTPS resources are not bundled, so they still need to be included.
        if (bundled) {

            resources.css = _.filter(resources.css, function (resource) {
                return resource.indexOf("https:") == 0 || resource.indexOf("http:") == 0
                    ? true : false;
            });

            resources.lib = _.filter(resources.lib, function (resource) {
                return resource.indexOf("https:") == 0 || resource.indexOf("http:") == 0
                    ? true : false;
            });

            resources.js = _.filter(resources.js, function (resource) {
                return resource.indexOf("https:") == 0 || resource.indexOf("http:") == 0
                    ? true : false;
            });
        }

        // Open the master file that we'll perform replacements on.
        var content = fs.readFileSync(sourceFilePath, "utf8").toString();

        // Inject link tags for the CSS files.

        var cssReferences = [];

        if (resources.css && resources.css.length > 0) {

            resources.css.forEach(function (cssReference) {

                var suffix = "";

                // Ensure live resources are loaded asynchronously.
                if (cssReference.indexOf("http:")  == 0 || cssReference.indexOf("https:") == 0) {
                    suffix = " async";
                }

                cssReferences.push(helper.format('<link rel="stylesheet" href="{0}"{1}>', cssReference, suffix));
            });
        }

        // If bundling, add the non-blocking CSS loader for the CSS bundle.
        if (bundled) {
            var cssBundleReference = helper.format("css/app.bundle.css{0}",
                                        cacheBusterValue ? "?v=" + cacheBusterValue : "");

            var cssLoaderScript = helper.getCssLoaderScript(cssBundleReference);
            cssReferences.push(cssLoaderScript);
        }

        if (cssReferences.length > 0) {
            content = content.replace(cssRegExp, function (match, whitespaceMatch, offset, string) {
                return whitespaceMatch + cssReferences.join("\n" + whitespaceMatch);
            });
        }
        else {
            content = content.replace(cssRegExp, "");
        }

        // Inject script tags for the JS libraries.

        var libReferences = [];

        if (resources.lib && resources.lib.length > 0) {

            resources.lib.forEach(function (libReference) {

                var suffix = "";

                // Ensure live resources are loaded asynchronously.
                if (libReference.indexOf("http:")  == 0 || libReference.indexOf("https:") == 0) {
                    suffix = " async";
                }

                libReferences.push(helper.format('<script type="text/javascript" src="{0}"{1}></script>', libReference, suffix));
            });
        }

        if (libReferences.length > 0) {
            content = content.replace(libRegExp, function (match, whitespaceMatch, offset, string) {
                return whitespaceMatch + libReferences.join("\n" + whitespaceMatch);
            });
        }
        else {
            content = content.replace(libRegExp, "");
        }

        // Inject script tags for the JS files.

        var jsReferences = [];

        if (resources.js && resources.js.length > 0) {

            resources.js.forEach(function (jsReference) {

                var suffix = "";

                // Ensure live resources are loaded asynchronously.
                if (jsReference.indexOf("http:")  == 0 || jsReference.indexOf("https:") == 0) {
                    suffix = " async";
                }

                jsReferences.push(helper.format('<script type="text/javascript" src="{0}"{1}></script>', jsReference, suffix));
            });
        }

        // If bundling, add the non-blocking loader for the JS and lib bundles.
        if (bundled) {

            // Add the path to the bundled JS libraries.
            var libBundleReference = helper.format("lib/app.bundle.lib.js{0}",
                                        cacheBusterValue ? "?v=" + cacheBusterValue : "");

            // Add the path to the bundled JS files.
            var jsBundleReference = helper.format("js/app.bundle.js{0}",
                                        cacheBusterValue ? "?v=" + cacheBusterValue : "");


            var jsLoaderScript = helper.getLibAndJsBundleLoaderScript(libBundleReference, jsBundleReference);
            jsReferences.push(jsLoaderScript);
        }

        if (jsReferences.length > 0) {
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
     * Used to build a <script> tag that will load the given CSS file in a non-blocking manner.
     * This allows the HTML page to render immediately without waiting on the CSS reference.
     */
    getCssLoaderScript: function(cssBundlePath) {

        var parts = [];

        parts.push("<script>");

        // https://github.com/filamentgroup/loadCSS/releases

        // loadCSS.js 1.3.1
        parts.push("/*! loadCSS. [c]2017 Filament Group, Inc. MIT License */");
        parts.push('!function(a){"use strict";var b=function(b,c,d){function e(a){return h.body?a():void setTimeout(function(){e(a)})}function f(){i.addEventListener&&i.removeEventListener("load",f),i.media=d||"all"}var g,h=a.document,i=h.createElement("link");if(c)g=c;else{var j=(h.body||h.getElementsByTagName("head")[0]).childNodes;g=j[j.length-1]}var k=h.styleSheets;i.rel="stylesheet",i.href=b,i.media="only x",e(function(){g.parentNode.insertBefore(i,c?g:g.nextSibling)});var l=function(a){for(var b=i.href,c=k.length;c--;)if(k[c].href===b)return a();setTimeout(function(){l(a)})};return i.addEventListener&&i.addEventListener("load",f),i.onloadcssdefined=l,l(f),i};"undefined"!=typeof exports?exports.loadCSS=b:a.loadCSS=b}("undefined"!=typeof global?global:this);');

        // onLoadCSS.js 1.3.1
        parts.push("/*! onloadCSS. (onload callback for loadCSS) [c]2017 Filament Group, Inc. MIT License */");
        parts.push('function onloadCSS(a,b){function c(){!d&&b&&(d=!0,b.call(a))}var d;a.addEventListener&&a.addEventListener("load",c),a.attachEvent&&a.attachEvent("onload",c),"isApplicationInstalled"in navigator&&"onloadcssdefined"in a&&a.onloadcssdefined(c)}');

        parts.push('var __css = loadCSS("' + cssBundlePath + '");');
        parts.push("onloadCSS(__css, function () { window.__css_loaded = true; });");

        parts.push("</script>");

        return parts.join("\n");
    },

    /**
     * Used to build a <script> tag that will load the given lib and JS bundle files in a non-blocking
     * manner. This allows the HTML page to render immediately without waiting on the lib/JS references.
     */
    getLibAndJsBundleLoaderScript: function(libBundlePath, jsBundlePath) {

        var parts = [];

        parts.push('<script type="text/javascript">');

        parts.push('window.onload = function() {');
        parts.push('    var lib = document.createElement("script");');
        parts.push('    lib.type = "text/javascript";');
        parts.push('    lib.async = false;');
        parts.push('    lib.src = "' + libBundlePath + '";');
        parts.push('    lib.onload = function () { window.__lib_loaded = true; };');
        parts.push('    document.body.appendChild(lib);');

        parts.push('    var js = document.createElement("script");');
        parts.push('    js.type = "text/javascript";');
        parts.push('    js.async = false;');
        parts.push('    js.src = "' + jsBundlePath + '";');
        parts.push('    js.onload = function () { window.__js_loaded = true; };');
        parts.push('    document.body.appendChild(js);');

        parts.push('}');

        parts.push('</script>');

        return parts.join("\n");
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
            // Files to be loaded via HTTP/HTTPS at runtime should be omitted.
            var cssReferences = _.map(resourceManifest.css, function (resource) {
                return resource.indexOf("https:") == 0 || resource.indexOf("http:") == 0
                    ? null // Don't include the live resource.
                    : path.join(sourceDir, resource)
            });

            // Ensure the null entries are removed from the list.
            cssReferences = _.filter(cssReferences);

            // Concatenate all of the resources.
            var cssBundle = sh.cat(cssReferences);

            // Write the bundle
            fs.writeFileSync(path.join(targetDir, "app.bundle.css"), cssBundle, "utf8");
        }

        if (resourceManifest.lib && resourceManifest.lib.length > 0) {

            // Append the source directory path to each resource in the manifest.
            // Files to be loaded via HTTP/HTTPS at runtime should be omitted.
            var libReferences = _.map(resourceManifest.lib, function (resource) {
                return resource.indexOf("https:") == 0 || resource.indexOf("http:") == 0
                    ? null // Don't include the live resource.
                    : path.join(sourceDir, resource)
            });

            // Ensure the null entries are removed from the list.
            libReferences = _.filter(libReferences);

            // Concatenate all of the resources.
            var libBundle = sh.cat(libReferences);


            // Write the bundle
            fs.writeFileSync(path.join(targetDir, "app.bundle.lib.js"), libBundle, "utf8");
        }

        if (resourceManifest.js && resourceManifest.js.length > 0) {

            // Append the source directory path to each resource in the manifest.
            // Files to be loaded via HTTP/HTTPS at runtime should be omitted.
            var jsReferences = _.map(resourceManifest.js, function (resource) {
                return resource.indexOf("https:") == 0 || resource.indexOf("http:") == 0
                    ? null // Don't include the live resource.
                    : path.join(sourceDir, resource)
            });

            // Ensure the null entries are removed from the list.
            jsReferences = _.filter(jsReferences);

            // Concatenate all of the resources.
            var jsBundle = sh.cat(jsReferences);

            // Write the bundle
            fs.writeFileSync(path.join(targetDir, "app.bundle.js"), jsBundle, "utf8");
        }
    },

    /**
     * Used to build a string for the content of the Content-Security-Policy meta tag
     * from the given object. See: http://content-security-policy.com/
     * 
     * @param csp The object representing the content security policy. Top level keys are directives whose values are arrays of strings.
     * @returns A content security policy string.
     */
    buildCspStringFromObject: function(csp) {

        console.log("!!!!!!!!!!!!!!!! " + JSON.stringify(csp, null, 4));

        if (!csp || typeof(csp) !== "object") {
            return null;
        }

        var directiveNames = [
            "default-src",
            "script-src",
            "style-src",
            "img-src",
            "connect-src",
            "font-src",
            "object-src",
            "media-src",
            "frame-src",
            "sandbox",
            "report-uri",
            "child-src",
            "form-action",
            "frame-ancestors",
            "plugin-types",
        ];

        var cspParts = [];

        directiveNames.forEach(function (directiveName) {

            var yamlDirectiveName = directiveName.replace(/-/g, "_");
            var values = csp[yamlDirectiveName];

            if (values) {
                cspParts.push(directiveName + " " + values.join(" "));
            }
        });

        console.log("!!!!result " + cspParts.join("; "));

        return cspParts.join("; ");
    },
}
