# Overview

This starter project ships with several tasks for the [Gulp](http://gulpjs.com/) task runner. The tasks are located in the `build/tasks` directory with a single task per file. These tasks are referenced from `gulpfile.js` and are executed from the project directory using the `gulp task_name` command.

# Compilation Tasks

The following tasks can be used to perform code configuration, library and plugin setup, and TypeScript compilation.

!!! note
	If you are using VSCode, you can use <kbd>⌘ Command</kbd><kbd>⇧ Shift</kbd><kbd>R</kbd> and being typing the name of the task you want to run. See `.vscode/tasks.config` for more task shortcuts.

## gulp init

The init task is used to initialize the Cordova project by adding platforms and plugins, obtaining third-party libraries, and compiling TypeScript.

First, it cleans the environment by running several gulp clean tasks. This will result in removal of several generated directories and files.

Next, it adds Cordova platforms by running the `cordova platform add platform_name` command for each of the platforms as defined in `package.json`.

Finally, it delegates to the config and default gulp tasks, which handle configuration, addition of Cordova plugins, Bower library retrieval, and compilation of templates, SASS, and TypeScript.

In addition to initializing your environment for first use, this task is also useful for cleaning up your environment if you run into issues during development.

## gulp config

The config task is used to generate and customize configuration files based on a given platform and build scheme (specified via the `--prep` and `--scheme` flags respectively).

This task creates the following files:

* `config.xml`
* `build/chrome/manifest.json`
* `www/index.html`
* `www/js/build-vars.js`

These files are generated from their master files in the resources directory for the specified platform, the shared configuration file at `resources/config/config.yml` and modified based on the active build scheme as defined in `resources/config/schemes.yml`.

If the `--prep chrome` or `--prep web` flag is not specified, Cordova will be assumed.

If the `--scheme scheme_name` flag is not specified the default scheme will be used (as defined in `resources/config/schemes.yml`).

See [Development Tips: Build Schemes](development-tips.md#build-schemes) for more details.

## gulp templates

The templates task compiles Angular HTML templates from `src/Views/**/*.html` into a single JavaScript file at `www/js/templates.js`.

You'll need to re-run this task to see any HTML template changes during development.

## gulp sass

The sass task compiles the SASS source files, starting with `src/Styles/Index.scss`. The resulting CSS bundle will be output to `www/css/bundle.css`.

You'll need to re-run this task to see any SASS styling changes during development.

The SASS output will be minified if the debug flag is set to true via the current build scheme.

!!! note
	If you run this task from VS Code, SASS problems will be shown in VS Code's error console.

## gulp libs

The libs task uses the [Bower](http://bower.io/) package manager and [bower-installer](https://www.npmjs.com/package/bower-installer) plugin to download JavaScript libraries for use within your application.

Initially, Bower will download the files to the `bower_components` directory, and the `bower-installer` plugin will copy the appropriate files to the `www/lib` directory.

See `bower.json` for more details (or if you need to change which files get copied to the libs directory).

## gulp plugins

The plugins task is used to install all of the Cordova plugins as defined in `package.json`'s `cordovaPlugins` property.

This task is simply a shortcut for individually running `cordova plugin add plugin_name` for each plugin.

## gulp tsd

The tsd task is used to download and set up TypeScript definition files for JavaScript libraries so they can be referenced from TypeScript source files. The `tsd` tool uses the [DefinitelyTyped](http://definitelytyped.org/) repository.

The `tsd.json` and `tsd.tests.json` files are used to specify the typing files to download for the application and unit tests, respectively.

After downloading the definitions, the `tsd` tool will generate a reference file at `src/tsd.d.ts` (or `tests/tsd.d.ts` for unit tests), which the TypeScript compiler will read during compilation.

## gulp ts

The ts task is used to compile TypeScript using configuration from `src/tsconfig.json`.

The resulting JavaScript bundle will be written to `www/js/bundle.js`.

The JavaScript output will be minified if the debug flag is set to true via the current build scheme. Minification is done by delegating to the minify task.

!!! note
	If you are using VS Code, you can use <kbd>⌘ Command</kbd><kbd>⇧ Shift</kbd><kbd>B</kbd> to run the `ts` task with the default scheme. Any compilation problems will be shown in VS Code's error console.

## gulp minify

The minify task is used to minify the JavaScript bundle at `src/js/bundle.js`.

This task can be run directly or delegated to via the ts task.

## gulp lint

The lint task performs [linting](https://en.wikipedia.org/wiki/Lint_(software)) of the TypeScript source files.

Lint parameters are defined in `tslint.json`.

!!! note
	If you run this task from VS Code, lint problems will be shown in VS Code's warning console.

## gulp package-chrome

The package chrome task is used to prepare the application for deployment as a Chrome extension. This first delegates to the config task via `gulp config --prep chrome` and then handles generating a build directory at `build/chrome`.

The directory can be loaded directly via Chrome's [chrome://extensions/](chrome://extensions/) URI. The directory is also bundled into a GZIP file at `build/chrome/chrome.tar.gz`.

## gulp package-web

The package web task is used to prepare the application for deployment as a stand-alone mobile website. This first delegates to the config task via `gulp config --prep web` and then handles generating a build directory at `build/web`.

This task also takes care of bundling the following assets into single files:

* `lib/*.js` → `lib/app.bundle.lib.js`
* `css/*.css` → `css/app.bundle.css`
* `js/*.js` → `js/app.bundle.js`

These files will be referenced from the `build/web/index.html` file with query string parameters using the short SHA of the current git commit. This allows for busting the cache when a new version of the website is deployed.

The directory is also bundled into a GZIP file at `build/web/web.tar.gz`.

# Utility Tasks

The following can be used to perform various tasks that aren't necessarily related to compilation.

!!! note
	If you are using VS Code, you can use <kbd>⌘ Command</kbd><kbd>⇧ Shift</kbd> <kbd>R</kbd> and being typing the name of the task you want to run. See `.vscode/tasks.config` for more task shortcuts.

## gulp watch

The watch task is used internally via Ionic's serve command (`ionic serve`). This allows Ionic to reload the web browser when the specified files change during development.

## gulp emulate-ios

The emulate-ios task is a shortcut for `cordova emulate ios`, a useful shortcut to use from VS Code's task runner.

## gulp emulate-android

The emulate-android task is a shortcut for `cordova emulate android`,  a useful shortcut to use from VS Code's task runner.

## gulp emulate-ios-remote

The emulate-ios-remote task allows Windows or Linux developers to run the iOS simulator on a remote Mac OS X computer.

See [Development Tips: Running iOS Simulator from Windows](development-tips.md#running-ios-simulator-from-windows) for more details.

## gulp test

The test task is used to compile the TypeScript unit tests and run them via the Karma test runner. See `karma.conf.js` for Karma configuration.

See [Unit Testing](unit-testing.md) for more details on unit tests.

## gulp typedoc

The typedoc task uses [TypeDoc](http://typedoc.io/) to generate documentation for the TypeScript source code.

The documentation files are output to `typedoc-output`.

## gulp clean

The clean task is used to remove all generated files, including the `node_modules` directory.

If you don't want to remove everything, there are subtasks for each of the gulp tasks to clean specific artifacts (e.g., `gulp clean:ts` or `gulp clean:plugins`).

After cleaning, you may need to re-run `gulp init` to ensure your environment is reinitialized.
