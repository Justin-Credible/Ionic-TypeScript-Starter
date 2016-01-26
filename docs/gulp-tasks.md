# Compilation Gulp Taks

The following tasks can be used to perform code configuration, library and plugin setup, and TypeScript compilation.

> Note: If you are using VSCode, you can use <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>R</kbd> and being typing the name of the task your want to run. See `.vscode/tasks.config` for more task shortcuts.

## `gulp init`

The init task is used to initialize the Cordova project by adding platforms, plugins, obtain third party libraries, and perform code compilation.

First, it cleans the environment by running several gulp clean tasks. This will result in several generated directories and files being removed.

Next, it adds Cordova platforms by running the `cordova platform add platform_name` command for each of the platforms as defined in `package.json`.

Then it delegates to the config and default gulp tasks which handle configuration, adding Cordova plugins, obtaining Bower libraries and compiling templates, SASS, and TypeScript.

Finally, this task can perform custom initialization based on a `prep` flag. For example, when using `gulp init --prep android` all of the above is performed as well as adding the [CrossWalk](https://crosswalk-project.org/) plugin for Android. You can customize this task to perform special behavior per platform if needed.

This task is useful for cleaning up your environment if you run into issues during development.

## `gulp config`

The config task is used to perform customization of configuration files based on the given scheme. Schemes are defined in `config.master.xml` in the `schemes` node. If a scheme name is not defined, the default will be used.

This task takes care of creating the following files:

* Cordova's `config.xml` (from `config.master.xml`)
* Starting page `www/index.html` (from `www/index.master.html`)
* Runtime variables at `src/js/build-vars.js`

These files will be generated from their master files and variable substitution will be performed based on the scheme definitions. This allows for easy configuration of builds for different environments (eg development, staging, production, etc).

Example Usage: `gulp config --scheme production`

## `gulp templates`

The templates task compiles Angular HTML templates from `src/Views/**/*.html` into a single JavaScript file at `www/js/templates.js`.

You'll need to re-run this task to see any HTML template changes during development.

## `gulp sass`

The sass task compiles the SASS files using `src/Styles/Index.scss`. The resulting CSS bundle will be output to `www/css/bundle.css`.

You'll need to re-run this task to see any SASS styling changes during development.

The SASS output will be minified if the debug flag is set to true via the current build scheme.

> Note: If you run this task from VSCode sass problems will be shown in VSCode's error console.

## `gulp libs`

The libs task uses [Bower](http://bower.io/) and [bower-installer](https://www.npmjs.com/package/bower-installer) to download JavaScript libraries for use within the application.

Initially Bower will download the file to `bower_components` and `bower-installer` will take care of copying the appropriate files to the `www/lib` directory.

See `bower.json` for more details.

## `gulp plugins`

The plugins task is used to install all of the Cordova plugins as defined in `package.json`'s `plugins` property.

This task is simply a shortcut for running `cordova plugin add plugin_name` for each of the plugins.

## `gulp tsd`

The tsd task is used to download and setup TypeScript definition files for JavaScript libraries so we can reference them from TypeScript. The `tsd` tool uses the [DefinitelyTyped](http://definitelytyped.org/) repository.

The `tsd.json` and `tsd.tests.json` files are used to specify the typing files to download for the application and unit tests respectively.

After downloading the definitions, the `tsd` tool will generate a reference file at `src/tsd.d.ts` (or `tests/tsd.d.ts` for unit tests) that the TypeScript compiler will read during compilation.

## `gulp ts`

The ts task is used to perform compilation of the TypeScript using configuration from `src/tsconfig.json`.

The resulting JavaScript bundle will be written to `www/js/bundle.js`.

The JavaScript output will be minifed if the debug flag is set to true via the current build scheme. Minification is done by delegating to the minify task.

> Note: If you are using VSCode, you can use <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>B</kbd> to run the `ts` task with the default scheme. Any compilation problems will be shown in VSCode's error console.

## `gulp minify`

The minify task will minify the JavaScript bundle at `src/js/bundle.js`.

This task can be run directly, but can be delegated to via the ts task as well.

## `gulp lint`

The lint task performs [linting](https://en.wikipedia.org/wiki/Lint_(software)) of the TypeScript source files.

Lint parameters are defined in `tslint.json`.

> Note: If you run this task from VSCode lint problems will be shown in VSCode's warning console.

## `gulp chrome`

The chrome task is used to generate a `chrome` directory with the application that can be loaded as a Chrome extension.

# Utility Gulp Tasks

The following tasks can be used to perform various tasks that aren't necessarily related to compilation.

> Note: If you are using VSCode, you can use <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>R</kbd> and being typing the name of the task your want to run. See `.vscode/tasks.config` for more task shortcuts.

## `gulp watch`

This task is used internally via Ionic's serve command (`ionic serve`). This allows Ionic to reload the web browser when the specified files change during development.

## `gulp emulate-ios`

This task is a shortcut for `cordova emulate ios` which is a useful shortcut to use from VSCode's task runner.

## `gulp emulate-android`

This task is a shortcut for `cordova emulate android` which is a useful shortcut to use from VSCode's task runner.

## `gulp remote-emulate-ios`

This task allows Windows developers to run the iOS simulator on a remote Mac OS X computer.

See [TODO] for more details.

## `gulp test`

The test task is used to compile the TypeScript unit tests and run them via the Karma test runner. See `karma.conf.js` for Karma configuration.

See [TODO] for more details on unit tests.

## `gulp typedoc`

The typedoc task uses [TypeDoc](http://typedoc.io/) to generate documentation for the TypeScript source code.

The documentation file are output to `typedoc-output`.

## `gulp clean`

The clean task is used to remove all of the generated files, included the `node_modules` directory.

If you don't want to remove everything, there are subtasks for each of the gulp tasks to clean specific artifacts. For example: `gulp clean:ts` or `gulp clean:plugins`.

See also `gulp init`.