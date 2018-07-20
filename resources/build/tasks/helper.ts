
import * as gulp from "gulp";
import { GulpPlugins, Scheme, SchemesConfig, ContentSecurityPolicyDictionary, ReferencesConfig } from "../types";
import { TaskFunc } from "orchestrator";

import * as fs from "fs";
import * as path from "path";

import * as sh from "shelljs";
import * as _ from "lodash";
import * as yaml from "js-yaml";
import * as gulpLoadPlugins from "gulp-load-plugins";

let plugins = gulpLoadPlugins<GulpPlugins>();

/**
 * Used to format a string by replacing values with the given arguments.
 * Arguments should be provided in the format of {x} where x is the index
 * of the argument to be replaced corresponding to the arguments given.
 * 
 * For example, the string t = "Hello there {0}, it is {1} to meet you!"
 * used like this: Utilities.format(t, "dude", "nice") would result in:
 * "Hello there dude, it is nice to meet you!".
 * 
 * @param formatString The string value to use for formatting.
 * @param args The values to inject into the format string.
 */
export function format(formatString: string, ...args: any[]): string {

    if (formatString == null) {
        return null;
    }

    let dollarRegExp = /\$/g;

    for (let i = 0; i < args.length; i++) {

        // Grab the replacement value that should go in at this location.
        let replacement = args[i];

        // Treat null or undefined values as an empty string.
        if (replacement == null) {
            replacement = "";
        }

        // Ensure we're working with a string.
        if (typeof(replacement) !== "string") {

            if (typeof(replacement.toString) === "function") {
                replacement = replacement.toString();
            }
            else {
                replacement = replacement + "";
            }
        }

        // Ensure $ are escaped in the replacement parameters because
        // the string patterns $$, $&, $`, $' have special behavior.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter

        if (replacement.indexOf("$") > -1) {
            replacement = replacement.replace(dollarRegExp, "$$$$");
        }

        // Now build a regular expression that matches the argument placeholder
        // (e.g. {0}, {1}) and use it to replace the placeholder with the value.
        let regExp = new RegExp(`\\{${i}\\}`, "gm");
        formatString = formatString.replace(regExp, replacement);
    }

    return formatString;
}

/**
 * Used to log an informational message using plugins.util.log(...) with an
 * "Info: " prefix.
 */
export function info(message: string): void {
    plugins.util.log("Info: " + message);
}

/**
 * Used to log a warning message using plugins.util.log(...) with a yellow colors
 * and "Warning: " prefix.
 */
export function warn(message: string): void {
    plugins.util.log(plugins.util.colors.yellow("Warning: " + message));
}

/**
 * Used to get the short SHA of the current git commit.
 * Returns unknown if the git command fails.
 */
export function getCommitShortSha(): string {
    // Grab the git commit hash.
    let shResult = <sh.ExecOutputReturnValue>sh.exec("git rev-parse --short HEAD", { silent: true });

    if (shResult.code !== 0 || shResult.stderr) {
        warn("Unable to get the git revision number; using 'Unknown' instead. Failure reason:\n" + shResult.stderr);
        return "Unknown";
    }
    else {
        return shResult.stdout.replace("\n", "");
    }
}

/**
 * A custom reporter for the sass compilation task so we can control the formatting
 * of the message for our custom problem matcher in Visual Studio Code.
 */
export function sassReporter(failure): void {
    let file = failure.message.split("\n")[0];
    let message = failure.message.split("\n")[1];

    let formattedMessage = format("[sass] [{0}] {1}:{2}",
                                failure.name.toLowerCase(),
                                file,
                                message);

    plugins.util.log(formattedMessage);
}

/**
 * Used to determine if the gulp operation was launched for a debug or release build.
 * This is controlled by the scheme's debug flag.
 */
export function isDebugBuild(): boolean {

    // Grab the scheme by name.
    let schemeName = getCurrentSchemeName();
    let scheme = getSchemeByName(schemeName);

    // If we didn't find a scheme by name, then fail fast.
    if (!scheme) {
        throw new Error(`Could not locate a build scheme with name '${schemeName}' in resources/config/schemes.yml`);
    }

    // Grab the debug flag.
    let isDebug = !!scheme.debug;

    return isDebug;
}

/**
 * Used to determine if a prepare flag was set to "chrome".
 * 
 * gulp init --prep chrome
 */
export function isPrepChrome(): boolean {
    return plugins.util.env.prep === "chrome" ? true : false;
}

/**
 * Used to determine if a prepare flag was set to "web".
 * 
 * gulp init --prep web
 */
export function isPrepWeb(): boolean {
    return plugins.util.env.prep === "web" ? true : false;
}

/**
 * Used to recursively delete all empty directories under the given path.
 */
export function deleteEmptyDirectories(basePath: string): void {

    let paths = sh.ls("-RA", basePath);

    if (!paths) {
        return;
    }

    for (let file of paths) {
        file = path.join(basePath, file);

        if (fs.lstatSync(file).isDirectory()) {

            let childPaths = sh.ls("-A", file);

            if (childPaths != null && childPaths.length === 0) {
                sh.rm("-rf", file);
            }
        }
    }
}

/**
 * Used to get the name of the scheme specified via the --scheme flag, or if one is not present
 * the default scheme as defined in schemes.yml.
 */
export function getCurrentSchemeName(): string {

    // Grab the scheme name as defined via an argument (eg gulp config --scheme scheme_name).
    let schemeName: string = plugins.util.env.scheme;

    // If a scheme name was supplied via the command line, then use the default from config.
    if (!schemeName) {
        let schemeConfigYmlRaw = fs.readFileSync("resources/config/schemes.yml", "utf8").toString();
        let schemesConfig = <SchemesConfig>yaml.safeLoad(schemeConfigYmlRaw);

        if (!schemesConfig) {
            throw new Error("Unable to read build schemes from resources/config/config.yml");
        }

        schemeName = schemesConfig.default;
    }

    return schemeName;
}

/**
 * Used to get the scheme from resources/config/schemes.yml with the given name.
 * 
 * If an override scheme was specified in the name, the returned scheme will have
 * values overrided by the specified override scheme. An override is specified by
 * adding the name with a comma. For example: "dev1,web" for dev1 with the web override.
 */
export function getSchemeByName(schemeName: string): Scheme {

    if (!schemeName) {
        throw new Error("A scheme name was not specified.");
    }

    // Read and parse the schemes.yml file.
    let schemeConfigYmlRaw = fs.readFileSync("resources/config/schemes.yml", "utf8").toString();
    let schemesConfig = <SchemesConfig>yaml.safeLoad(schemeConfigYmlRaw);

    if (!schemesConfig || !schemesConfig.schemes) {
        throw new Error("Unable to load build schemes from resources/config/schemes.yml");
    }

    let overrideSchemeName: string = null;

    // If the scheme name includes an override (designated by a comma) then we'll pull it out
    // and re-set the base scheme name so it can be used below.
    if (schemeName.indexOf(",") > -1) {
        overrideSchemeName = schemeName.split(",")[1];
        schemeName = schemeName.split(",")[0];
    }

    let scheme = schemesConfig.schemes[schemeName];

    // If we couldn't find a scheme with this name, fail fast.
    if (!scheme) {
        throw new Error(`Could not locate a build scheme with name '${schemeName}' in resources/config/schemes.yml`);
    }

    // Ensure the replacements dictionary exists.
    if (!scheme.replacements) {
        scheme.replacements = {};
    }

    // See if this scheme has a base defined.
    let baseSchemeName = scheme.base;

    // Here we gather up all of the replacement nodes for each of the parent schemes.
    while (baseSchemeName) {

        let baseScheme = schemesConfig.schemes[baseSchemeName];

        if (!baseScheme) {
            throw new Error(`Could not locate a build scheme with name '${schemeName}' in resources/config/schemes.yml`);
        }

        // Merge the replacement entries from the base to the parent.
        if (baseScheme.replacements) {

            for (let key of _.keys(baseScheme.replacements)) {

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

        let overrideScheme = schemesConfig.overrides[overrideSchemeName];

        if (!overrideScheme) {
            throw new Error(`Could not locate a build override scheme with name '${overrideSchemeName}' in resources/config/schemes.yml in the _overrides section.`);
        }

        for (let key of _.keys(overrideScheme)) {
            scheme.replacements[key] = overrideScheme[key];
        }
    }

    return scheme;
}

/**
 * Used to perform variable replacement on a master file and write out the resulting file.
 * Variables are determined by the given scheme as defined in schemes.xml.
 */
export function performVariableReplacement(schemeName: string, sourceFilePath: string, destinationFilePath: string): void {

    // Grab the scheme by name.
    let scheme = getSchemeByName(schemeName);

    // If we didn't find a scheme by name, then fail fast.
    if (!scheme) {
        throw new Error(`Could not locate a build scheme with name '${schemeName}' in resources/config/schemes.yml`);
    }

    // Open the master file that we'll perform replacements on.
    let content = fs.readFileSync(sourceFilePath, "utf8").toString();

    // Morph the content security policy object into a flag string that can be used in the meta tag.

    // tslint:disable-next-line:no-string-literal
    if (typeof(scheme.replacements["CONTENT_SECURITY_POLICY"]) === "object") {

        // tslint:disable-next-line:no-string-literal
        let cspDictionary = <ContentSecurityPolicyDictionary>scheme.replacements["CONTENT_SECURITY_POLICY"];

        let cspString = buildCspStringFromObject(cspDictionary);

        // tslint:disable-next-line:no-string-literal
        scheme.replacements["CONTENT_SECURITY_POLICY"] = cspString;
    }

    // Loop through each replacement variable we have defined.
    for (let key of _.keys(scheme.replacements)) {

        let replacementTarget = "\\${" + key + "}";
        let replacementValue = scheme.replacements[key];

        // Search and replace the ${TARGET} with the value in the files.
        content = content.replace(new RegExp(replacementTarget, "g"), replacementValue);
    }

    // Write out the files that have replacements.
    fs.writeFileSync(destinationFilePath, content, "utf8");
}

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
export function performReferenceReplacement(sourceFilePath: string, targetFilePath: string, bundled: boolean, cacheBusterValue: string, referencesFilePath: string): void {

    let cssRegExp = /^([\t ]+)<!-- references:css -->/gm;
    let libRegExp = /^([\t ]+)<!-- references:lib -->/gm;
    let jsRegExp = /^([\t ]+)<!-- references:js -->/gm;

    // Read in the file that contains the list of resource references.
    let resourceYmlRaw = fs.readFileSync(referencesFilePath, "utf8").toString();
    let resources = <ReferencesConfig>yaml.safeLoad(resourceYmlRaw);

    if (!resources) {
        throw new Error("Unable to read resource references from " + referencesFilePath);
    }

    // Lets handle a special case first. If bundled is true, we need to filter the references
    // down to just resources that are loaded via HTTP/HTTPS. The bundled references will be added
    // below, but the HTTP/HTTPS resources are not bundled, so they still need to be included.
    if (bundled) {

        resources.css = _.filter(resources.css, function (resource: string) {
            return resource.indexOf("https:") === 0 || resource.indexOf("http:") === 0
                ? true : false;
        });

        resources.lib = _.filter(resources.lib, function (resource: string) {
            return resource.indexOf("https:") === 0 || resource.indexOf("http:") === 0
                ? true : false;
        });

        resources.js = _.filter(resources.js, function (resource: string) {
            return resource.indexOf("https:") === 0 || resource.indexOf("http:") === 0
                ? true : false;
        });
    }

    // Open the master file that we'll perform replacements on.
    let content = fs.readFileSync(sourceFilePath, "utf8").toString();

    // Inject link tags for the CSS files.

    let cssReferences = [];

    if (resources.css && resources.css.length > 0) {

        for (let cssReference of resources.css) {

            let suffix = "";

            // Ensure live resources are loaded asynchronously.
            if (cssReference.indexOf("http:")  === 0 || cssReference.indexOf("https:") === 0) {
                suffix = " async";
            }

            cssReferences.push(`<link rel="stylesheet" href="${cssReference}"${suffix}>`);
        }
    }

    // If bundling, add the non-blocking CSS loader for the CSS bundle.
    if (bundled) {
        let cssBundleReference = format("css/app.bundle.css{0}",
                                    cacheBusterValue ? "?v=" + cacheBusterValue : "");

        let cssLoaderScript = getCssLoaderScript(cssBundleReference);
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

    let libReferences = [];

    if (resources.lib && resources.lib.length > 0) {

        for (let libReference of resources.lib) {
            let suffix = "";

            // Ensure live resources are loaded asynchronously.
            if (libReference.indexOf("http:")  === 0 || libReference.indexOf("https:") === 0) {
                suffix = " async";
            }

            libReferences.push(`<script type="text/javascript" src="${libReference}"${suffix}></script>`);
        }
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

    let jsReferences = [];

    if (resources.js && resources.js.length > 0) {

        for (let jsReference of resources.js) {

            let suffix = "";

            // Ensure live resources are loaded asynchronously.
            if (jsReference.indexOf("http:")  === 0 || jsReference.indexOf("https:") === 0) {
                suffix = " async";
            }

            jsReferences.push(`<script type="text/javascript" src="${jsReference}"${suffix}></script>`);
        }
    }

    // If bundling, add the non-blocking loader for the JS and lib bundles.
    if (bundled) {

        // Add the path to the bundled JS libraries.
        let libBundleReference = format("lib/app.bundle.lib.js{0}",
                                    cacheBusterValue ? "?v=" + cacheBusterValue : "");

        // Add the path to the bundled JS files.
        let jsBundleReference = format("js/app.bundle.js{0}",
                                    cacheBusterValue ? "?v=" + cacheBusterValue : "");


        let jsLoaderScript = getLibAndJsBundleLoaderScript(libBundleReference, jsBundleReference);
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
}

/**
 * Used to build a <script> tag that will load the given CSS file in a non-blocking manner.
 * This allows the HTML page to render immediately without waiting on the CSS reference.
 */
export function getCssLoaderScript(cssBundlePath: string): string {

    // https://github.com/filamentgroup/loadCSS/releases

    // loadCSS.js 1.3.1
    // onLoadCSS.js 1.3.1

    return `
<script>
/*! loadCSS. [c]2017 Filament Group, Inc. MIT License */
!function(a){"use strict";var b=function(b,c,d){function e(a){return h.body?a():void setTimeout(function(){e(a)})}function f(){i.addEventListener&&i.removeEventListener("load",f),i.media=d||"all"}var g,h=a.document,i=h.createElement("link");if(c)g=c;else{var j=(h.body||h.getElementsByTagName("head")[0]).childNodes;g=j[j.length-1]}var k=h.styleSheets;i.rel="stylesheet",i.href=b,i.media="only x",e(function(){g.parentNode.insertBefore(i,c?g:g.nextSibling)});var l=function(a){for(var b=i.href,c=k.length;c--;)if(k[c].href===b)return a();setTimeout(function(){l(a)})};return i.addEventListener&&i.addEventListener("load",f),i.onloadcssdefined=l,l(f),i};"undefined"!=typeof exports?exports.loadCSS=b:a.loadCSS=b}("undefined"!=typeof global?global:this);
/*! onloadCSS. (onload callback for loadCSS) [c]2017 Filament Group, Inc. MIT License */
function onloadCSS(a,b){function c(){!d&&b&&(d=!0,b.call(a))}var d;a.addEventListener&&a.addEventListener("load",c),a.attachEvent&&a.attachEvent("onload",c),"isApplicationInstalled"in navigator&&"onloadcssdefined"in a&&a.onloadcssdefined(c)}
var __css = loadCSS("' + cssBundlePath + '");
onloadCSS(__css, function () { window.__css_loaded = true; });
</script>`;
}

/**
 * Used to build a <script> tag that will load the given lib and JS bundle files in a non-blocking
 * manner. This allows the HTML page to render immediately without waiting on the lib/JS references.
 */
export function getLibAndJsBundleLoaderScript(libBundlePath: string, jsBundlePath: string): string {

    return `
<script type="text/javascript">
window.onload = function() {
    let lib = document.createElement("script");
    lib.type = "text/javascript";
    lib.async = false;
    lib.src = "${libBundlePath}";
    lib.onload = function () { window.__lib_loaded = true; };
    document.body.appendChild(lib);
    let js = document.createElement("script");
    js.type = "text/javascript";
    js.async = false;
    js.src = "${jsBundlePath}";
    js.onload = function () { window.__js_loaded = true; };
    document.body.appendChild(js);
}
</script>`;
}

/**
 * Used to create a JavaScript file containing build variables git sha, build timestamp, and all
 * of the values of config.yml file.
 */
export function createBuildVars(schemeName: string, configYmlPath: string, targetBuildVarsPath: string): void {

    // Grab the scheme by name.
    let scheme = getSchemeByName(schemeName);

    // If we didn't find a scheme by name, then fail fast.
    if (!scheme) {
        throw new Error(`Could not locate a build scheme with name '${schemeName}' in resources/config/schemes.yml`);
    }

    // Read in the shared configuration file.
    let configYmlRaw = fs.readFileSync(configYmlPath).toString();

    // Perform variable replacements based on the active scheme.

    // Loop through each replacement variable we have defined.
    for (let key of _.keys(scheme.replacements)) {

        let replacementTarget = "\\${" + key + "}";
        let replacementValue = scheme.replacements[key];

        // Search and replace the ${TARGET} with the value in the files.
        configYmlRaw = configYmlRaw.replace(new RegExp(replacementTarget, "g"), replacementValue);
    }

    // Grab the debug flag.
    let isDebug = !!scheme.debug;

    // If the debug flag was never set, then default to true.
    if (isDebug == null) {
        warn(`The debug attribute was not set for scheme '${schemeName}'; defaulting to true.`);
        isDebug = true;
    }

    // Parse the in-memory, modified version of the config.yml.
    let config = yaml.safeLoad(configYmlRaw); // TODO: STARTER

    // Create the structure of the buildVars variable.
    let buildVars = {
        debug: isDebug,
        buildTimestamp: (new Date()).toUTCString(),
        commitShortSha: getCommitShortSha(),
        config: config,
    };

    // Write the buildVars variable with code that will define it as a global object.
    let buildVarsJs = format("window.buildVars = {0};", JSON.stringify(buildVars));

    // Write the file out to disk.
    fs.writeFileSync(targetBuildVarsPath, buildVarsJs, "utf8");
}

/**
 * Used to bundle CSS and JS into single files for the files given in the manifest
 * at the given source directory path.
 * 
 * This will result in the following bundles being created:
 * • <targetDir>/app.bundle.css
 * • <targetDir>/app.bundle.lib.js
 * • <targetDir>/app.bundle.js
 */
export function bundleStaticResources(sourceDir: string, targetDir: string, resourceManifestPath: string): void {

    let resourceManifestRaw = fs.readFileSync(resourceManifestPath, "utf8").toString();
    let resourceManifest = <ReferencesConfig>yaml.safeLoad(resourceManifestRaw);

    if (!resourceManifest) {
        throw new Error(`Unable to load resource manifest list from ${resourceManifestPath}`);
    }

    if (resourceManifest.css && resourceManifest.css.length > 0) {

        // Append the source directory path to each resource in the manifest.
        // Files to be loaded via HTTP/HTTPS at runtime should be omitted.
        let cssReferences = _.map(resourceManifest.css, function (resource: string) {
            return resource.indexOf("https:") === 0 || resource.indexOf("http:") === 0
                ? null // Don't include the live resource.
                : path.join(sourceDir, resource);
        });

        // Ensure the null entries are removed from the list.
        cssReferences = _.filter(cssReferences);

        // Concatenate all of the resources.
        let cssBundle = sh.cat(cssReferences);

        // Write the bundle
        fs.writeFileSync(path.join(targetDir, "app.bundle.css"), cssBundle, "utf8");
    }

    if (resourceManifest.lib && resourceManifest.lib.length > 0) {

        // Append the source directory path to each resource in the manifest.
        // Files to be loaded via HTTP/HTTPS at runtime should be omitted.
        let libReferences = _.map(resourceManifest.lib, function (resource: string) {
            return resource.indexOf("https:") === 0 || resource.indexOf("http:") === 0
                ? null // Don't include the live resource.
                : path.join(sourceDir, resource);
        });

        // Ensure the null entries are removed from the list.
        libReferences = _.filter(libReferences);

        // Concatenate all of the resources.
        let libBundle = sh.cat(libReferences);


        // Write the bundle
        fs.writeFileSync(path.join(targetDir, "app.bundle.lib.js"), libBundle, "utf8");
    }

    if (resourceManifest.js && resourceManifest.js.length > 0) {

        // Append the source directory path to each resource in the manifest.
        // Files to be loaded via HTTP/HTTPS at runtime should be omitted.
        let jsReferences = _.map(resourceManifest.js, function (resource: string) {
            return resource.indexOf("https:") === 0 || resource.indexOf("http:") === 0
                ? null // Don't include the live resource.
                : path.join(sourceDir, resource);
        });

        // Ensure the null entries are removed from the list.
        jsReferences = _.filter(jsReferences);

        // Concatenate all of the resources.
        let jsBundle = sh.cat(jsReferences);

        // Write the bundle
        fs.writeFileSync(path.join(targetDir, "app.bundle.js"), jsBundle, "utf8");
    }
}

/**
 * Used to build a string for the content of the Content-Security-Policy meta tag
 * from the given object. See: http://content-security-policy.com/
 * 
 * @param csp The object representing the content security policy. Top level keys are directives whose values are arrays of strings.
 * @returns A content security policy string.
 */
export function buildCspStringFromObject(csp: ContentSecurityPolicyDictionary): string {

    if (!csp || typeof(csp) !== "object") {
        return null;
    }

    let directiveNames = [
        "default-src",
        "manifest-src",
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

    let cspParts = [];

    for (let directiveName of directiveNames) {

        let yamlDirectiveName = directiveName.replace(/-/g, "_");
        let values = csp[yamlDirectiveName];

        if (values) {
            cspParts.push(directiveName + " " + values.join(" "));
        }
    }

    return cspParts.join("; ");
}
