# Overview

Previous sections covered the `www` and `src` directories; this section will go over the remaining directories.

# .vscode

This is where the project-specific settings and tasks for the [Visual Studio Code](https://code.visualstudio.com/) IDE are located.

This directory is optional and can be removed if you are not using VS Code.

# bower_components _(generated)_

This is a generated directory created by running the `gulp libs` task. These files are downloaded by the Bower package manager and can be configured via `bower.json`.

The libs task also copies the needed files to `www/js/libs` so they can be used at runtime.

See `gulp libs` in [Gulp Tasks](gulp-tasks.md#gulp-libs) for more details.

!!! warning
	This directory will be removed when executing the `gulp clean` or `gulp clean:libs` tasks and should not be committed to source control.

# docs

This directory contains the documentation in markdown format, which are used to generate this documentation site using [MkDocs](http://www.mkdocs.org/).

This directory is optional and can be removed.

# hooks

This directory contains build hook scripts for Cordova's build system.

> Cordova Hooks represent special scripts which could be added by application and plugin developers or even by your own build system to customize cordova commands. - [Apache Cordova Hooks Guide](https://cordova.apache.org/docs/en/dev/guide/appdev/hooks/)

This starter project does not currently ship with any custom build hooks, aside from the "Add Platform Class" script included with Cordova.

See `hooks/README.md` for more details.

# node_modules _(generated)_

This is a generated directory created when you run `npm install` from the project directory. It contains all of the third-party software needed to build and run your application (e.g., Cordova, Ionic, gulp, etc.).

!!! warning
	This directory will be removed when executing the `gulp clean` task and should not be committed to source control.

# plugins _(generated)_

This is a generated directory created when you run the `gulp plugins` or `cordova plugin add` commands.

It contains any [Cordova plugins](https://cordova.apache.org/docs/en/latest/cordova/plugins/pluginapis.html) used to extend the functionality of the application through native code.

Plugins are installed via the `cordovaPlugins` property in `package.json`.

See `gulp plugins` in [Gulp Tasks](gulp-tasks.md#gulp-plugins) for more details.

!!! warning
	This directory will be removed when executing the `gulp clean` or `gulp clean:plugins` tasks and should not be committed to source control.

# resources

This is a general purpose directory that can contain any type of resource for your application.

Currently, the `ionic resources` command utilizes `icon.png` and `splash.png` from this directory to generate the icon and splash screens for the various platforms' screen sizes.

# tests

This directory contains the unit tests for the application.

Unit tests can be run using the Karma test runner by executing the `gulp test` task.

Each sub-directory here should mirror the layout of `src`, with the addition of a `.Tests.ts` suffix (i.e., a test for `src/Services/Utilities.ts` should be placed at `tests/Services/Utilities.Tests.ts`).

See `gulp test` in [Gulp Tasks](gulp-tasks.md#gulp-test) and [Unit Testing](unit-testing.md) for more details.

## tests/_references.ts

This file is used to point the TypeScript compiler at the generated type definitions for the compiled application bundle being tested.

## tests/tsconfig.json

This file controls parameters passed to the TypeScript compiler and is used when running the `gulp ts:tests` task or the unit tests via `gulp test`.

## tests/tsd.d.ts _(generated)_

This file contains references to all of the [TypeScript definition](http://www.typescriptlang.org/Handbook#writing-dts-files) files from the [DefinitelyTyped](http://definitelytyped.org/) repository.

These are installed by the `tsd` tool via the `gulp tsd` task. The definition files to be downloaded are specified in `tsd.tests.json`.

!!! warning
	This file will be removed when executing the `gulp clean` or `gulp clean:tsd` tasks and should not be committed to source control.

## tests/bundle.tests.js _(generated)_

This file contains the result of the unit tests' TypeScript compilation.

This is created via the `gulp test` or `gulp ts:tests` tasks.

!!! warning
	This file will be removed when executing the `gulp clean` or `gulp clean:tests` tasks and should not be committed to source control.

## tests/bundle.tests.js.map _(generated)_

This file contains the source mapping information of the unit tests' TypeScript compilation. This can be used when debugging to step through TypeScript source code instead of JavaScript.

This is created via the `gulp test` or `gulp ts:tests` tasks.

!!! warning
	This file will be removed when executing the `gulp clean` or `gulp clean:tests` tasks and should not be committed to source control.

# typings

This directory contains all of the [TypeScript definition](http://www.typescriptlang.org/Handbook#writing-dts-files) files from the [DefinitelyTyped](http://definitelytyped.org/) repository used by your application.

These are installed by the `tsd` tool via the `gulp tsd` task. The definition files to be downloaded are specified in `tsd.json`.

!!! warning
	All subdirectories will be removed when executing the `gulp clean` or `gulp clean:tsd` tasks (**except for the custom directory**) and should not be committed to source control.

The custom directory contains any custom [TypeScript definition](http://www.typescriptlang.org/Handbook#writing-dts-files) files for your application that are not available on the [DefinitelyTyped](http://definitelytyped.org/) repository.

This is the only subdirectory of the `typings` directory that should be committed to source control.

# typings-tests

This directory contains all of the [TypeScript definition](http://www.typescriptlang.org/Handbook#writing-dts-files) files from the [DefinitelyTyped](http://definitelytyped.org/) repository used by the unit tests.

These are installed by the `tsd` tool via the `gulp tsd:tests` task. The definition files to be downloaded are specified in `tsd.tests.json`.

!!! warning
	All subdirectories will be removed when executing the `gulp clean` or `gulp clean:tsd` tasks (**except for the custom directory**) and should not be committed to source control.

This custom directory contains any custom [TypeScript definition](http://www.typescriptlang.org/Handbook#writing-dts-files) files for your application that are not available on the [DefinitelyTyped](http://definitelytyped.org/) repository.

This is the only subdirectory of the `typings-tests` directory that should be committed to source control.


