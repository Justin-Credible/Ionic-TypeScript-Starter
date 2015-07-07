var gulp = require('gulp');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var bower = require('bower');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sh = require('shelljs');
var exec = require('child_process').exec;
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var del = require('del');
var fs = require("fs");
var async = require("async");
var xpath = require("xpath");
var XmlDom = require("xmldom").DOMParser;

var paths = {
  ts: ['./src/**/*.ts'],
  www: ['./www/**/*.*'],
  chromeIcon: ['./resources/icon.png'],
  chromeManifest: ['./chrome-manifest.json']
};

/**
 * Used to determine if the gulp operation was launched for a debug or release build.
 * This is controlled by the scheme parameter, if no scheme is provided, it will default
 * to debug. For example, to specify release build for the ts task you'd use:
 * 
 * gulp ts --scheme release
 */
function isDebugScheme() {
  return gutil.env.scheme === "release" ? false : true;
}

/**
 * A custom reporter for the TypeScript linter reporter function. This was copied
 * and modified from gulp-tslint.
 */
function log(message, level) {
    var prefix = "[" + gutil.colors.cyan("gulp-tslint") + "]";

    if (level === "error") {
        gutil.log(prefix, gutil.colors.red("error"), message);
    } else if (level === "warn") {
        gutil.log(prefix, gutil.colors.yellow("warn"), message);
    } else {
        gutil.log(prefix, message);
    }
}

/**
 * A custom reporter for the TypeScript linter so we can pass 'warn' instead of
 * 'error' to be recognized by Visual Studio Code's pattern matcher as warnings
 * instead of errors. This was copied and modified from gulp-tslint.
 */
var tsLintReporter = function(failures, file) {
    failures.forEach(function(failure) {
        // line + 1 because TSLint's first line and character is 0
        log('(' + failure.ruleName + ') ' + file.path +
            '[' + (failure.startPosition.line + 1) + ', ' +
            (failure.startPosition.character + 1) + ']: ' +
            failure.failure, 'warn');
    });
};

/**
 * Helper used to pipe an arbitrary string value into a file.
 * 
 * http://stackoverflow.com/a/23398200/4005811
 */
function string_src(filename, str) {
  var src = require('stream').Readable({ objectMode: true });
  
  src._read = function () {
    this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(str) }));
    this.push(null);
  };
  
  return src;
}

/**
 * The default task downloads Cordova plugins, Bower libraries, TypeScript definitions,
 * and then lints and builds the TypeScript source code.
 */
gulp.task('default', function (cb) {
    runSequence('plugins', 'libs', 'tsd', 'ts', cb);
});

/**
 * The watch task will watch for any changes in the TypeScript files and re-execute the
 * ts gulp task if they change. The "ionic serve" command will also invoke this task to
 * refresh the browser window during development.
 */
gulp.task('watch', function() {
  gulp.watch(paths.ts, ['ts']);
});

/**
 * Simply delegates to the "ionic emulate ios" command.
 * 
 * Useful to quickly execute from Visual Studio Code's task launcher:
 * Bind CMD+Shift+R to "workbench.action.tasks.runTask task launcher"
 */
gulp.task('emulate-ios', function(cb) {
  exec("ionic emulate ios");
  cb();
});

/**
 * Simply delegates to the "ionic emulate android" command.
 * 
 * Useful to quickly execute from Visual Studio Code's task launcher:
 * Bind CMD+Shift+R to "workbench.action.tasks.runTask task launcher"
 */
gulp.task('emulate-android', function(cb) {
  exec("ionic emulate android");
  cb();
});

/**
 * Performs linting of the TypeScript source code.
 */
gulp.task('lint', function (cb) {
  gulp.src(paths.ts)
  .pipe(tslint())
  .pipe(tslint.report(tsLintReporter));
});

/**
 * Uses the tsd command to restore TypeScript definitions to the typings
 * directory and rebuild the tsd.d.ts typings bundle.
 */
gulp.task('tsd', function (cb) {

  // First reinstall any missing definitions to the typings directory.
  exec("tsd reinstall", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    
    if (err) {
      cb(err);
      return;
    }
    
    // Rebuild the src/tsd.d.ts bundle reference file.
    exec("tsd rebundle", function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  });
});

/**
 * Used to generate the www/js/BuildVars.js file which contains information about
 * the build (such as version number, timestamp, and build scheme).
 * 
 * The version number is taken from the config.xml file.
 */
gulp.task('ts:vars', function (cb) {
  var majorVersion = 0,
      minorVersion = 0,
      buildVersion = 0;

  // Attempt to query and parse the version information from config.xml.
  // Default to 0.0.0 if there are any problems.
  try {
    var configXml = fs.readFileSync('config.xml', 'utf8');
    var configXmlDoc = new XmlDom().parseFromString(configXml);
    var versionString = xpath.select1("/*[local-name() = 'widget']/@version", configXmlDoc).value;
    var versionParts = versionString.split(".");
    majorVersion = parseInt(versionParts[0], 10);
    minorVersion = parseInt(versionParts[1], 10);
    buildVersion = parseInt(versionParts[2], 10);
  }
  catch (err) {
    console.log("Error parsing version from config.xml; using 0.0.0 instead.", err);
  }

  // Create the structure of the buildVars variable.
  var buildVarsJson = JSON.stringify({
    majorVersion: majorVersion,
    minorVersion: minorVersion,
    buildVersion: buildVersion,
    debug: isDebugScheme(),
    buildTimestamp: (new Date()).toUTCString()
  });

  // Write the buildVars variable with code that will define it as a global object.
  var buildVarsJs = "window.buildVars = " + buildVarsJson  + ";";

  // Write the file out to disk.
  fs.writeFileSync('www/js/BuildVars.js', buildVarsJs, { encoding: 'utf8' });

  cb();
});

/**
 * Used to copy the entire TypeScript source into the www/js/src directory so that
 * it can be used for debugging purposes.
 * 
 * This will only copy the files if the build scheme is not set to release.
 */
gulp.task('ts:src', ['ts:src-read-me'], function (cb) {
  
  if (!isDebugScheme()) {
    cb();
    return;
  }

  return gulp.src(paths.ts)
    .pipe(gulp.dest('www/js/src'));
});

/**
 * Used to add a readme file to www/js/src to explain what the directory is for.
 * 
 * This will only copy the files if the build scheme is not set to release.
 */
gulp.task('ts:src-read-me', function (cb) {
  
  if (!isDebugScheme()) {
    cb();
    return;
  }
  
  var infoMessage = "This directory contains a copy of the TypeScript source files for debug builds; it can be safely deleted and will be regenerated via the gulp ts task.\n\nTo omit this directory create a release build by specifying the scheme:\ngulp ts --scheme release";
  
  return string_src('readme.txt', infoMessage)
    .pipe(gulp.dest('www/js/src/'));
});

/**
 * Used to compile TypeScript and create a Chrome extension located in the
 * chrome directory.
 */
gulp.task('chrome', ['ts'], function (cb) {
  
  // Copy the www payload.
  gulp.src(paths.www)
    .pipe(gulp.dest('chrome'))
    .on('end', function() {
      
      // Copy in the icon to use for the toolbar.
      gulp.src(paths.chromeIcon)
        .pipe(gulp.dest('chrome'))
        .on('end', function() {
          
          // Copy in the manifest file for the extension.
          gulp.src(paths.chromeManifest)
            .pipe(rename('manifest.json'))
            .pipe(gulp.dest("./chrome"))
            .on('end', cb);
        });
    });
});

/**
 * Used to perform compliation of the TypeScript source in the src directory and
 * output the JavaScript to www/js/bundle.js. Compilation parameters is located
 * in src/tsconfig.json.
 * 
 * It will also delegate to the vars and src tasks to copy in the original source
 * which can be used for debugging purposes. This will only occur if the build scheme
 * is not set to release.
 */
gulp.task('ts', ['ts:vars', 'ts:src'], function (cb) {
  exec("tsc -p src", function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

/**
 * Used to download all of the bower dependencies as defined in bower.json and place
 * the consumable pieces in the www/lib directory.
 */
gulp.task('libs', function(cb) {
  exec('bower-installer', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

/**
 * Used to download and configure each platform with the Cordova plugins as defined
 * in the cordovaPlugins section of the package.json file.
 * 
 * This is equivalent to using the "cordova plugins add pluginName" command for each
 * of the plugins.
 */
gulp.task('plugins', ['git-check'], function(cb) {
  var pluginList = JSON.parse(fs.readFileSync('package.json', 'utf8')).cordovaPlugins;
  
  async.eachSeries(pluginList, function(plugin, eachCb) {
    var pluginName;
    
    if (typeof(plugin) === "object" && typeof(plugin.locator) === "string") {
      pluginName = plugin.locator;
    }
    else if (typeof(plugin) === "string") {
      pluginName = plugin;
    }
    else {
      cb(new Error("Unsupported plugin object type (must be string or object with a locator property)."));
      return;
    }
    
    exec("cordova plugin add " + pluginName, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      eachCb(err);
    });
    
  }, cb);
});

/**
 * Used to perform a file clean-up of the project. This removes all files and directories
 * that don't need to be committed to source control by delegating to several of the clean
 * sub-tasks.
 */
gulp.task('clean', ['clean:node', 'clean:bower', 'clean:platforms', 'clean:plugins', 'clean:chrome', 'clean:libs', 'clean:ts']);

/**
 * Removes the node_modules directory.
 */
gulp.task('clean:node', function (cb) {
  del([
    'node_modules'
  ], cb);
});

/**
 * Removes the bower_components directory.
 */
gulp.task('clean:bower', function (cb) {
  del([
    'bower_components'
  ], cb);
});

/**
 * Removes the platforms directory.
 */
gulp.task('clean:platforms', function (cb) {
  del([
    'platforms'
  ], cb);
});

/**
 * Removes the plugins directory.
 */
gulp.task('clean:plugins', function (cb) {
  del([
    'plugins'
  ], cb);
});

/**
 * Removes the www/lib directory.
 */
gulp.task('clean:libs', function (cb) {
  del([
    'www/lib'
  ], cb);
});

/**
 * Removes files related to TypeScript compilation.
 */
gulp.task('clean:ts', function (cb) {
  del([
    'www/js/bundle.js',
    'www/js/bundle.js.map',
    'www/js/BuildVars.js',
    'www/js/src'
  ], cb);
});

/**
 * Removes the chrome directory.
 */
gulp.task('clean:chrome', function (cb) {
  del([
    'chrome'
  ], cb);
});

/**
 * An default task provided by Ionic used to check if Git is installed.
 */
gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    done(new Error('Git is not installed.'));
    return;
  }
  done();
});
