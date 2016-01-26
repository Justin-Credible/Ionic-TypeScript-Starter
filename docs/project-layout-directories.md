# Overview

This section will go over the directory and file hierarchy of the sample project with a section for each directory.

In most example Angular applications you'll commonly see seperate directories for each component (eg controllers, views, models, services etc). While this is nice for tutorials and small applications, it is not ideal for real world applications.

This project groups files by feature rather than type. So instead of having to look in multiple directories for a given view, you'll be able to find all applicable files in the same location.

# .vscode

This is where the project specific settings and tasks for the [Visual Studio Code](https://code.visualstudio.com/) IDE are located.

This directory is optional and can be removed if you are not using VSCode.

# bower_components (generated)

This is a generated directory that is created by running the `gulp libs` task. These files are downloaded by Bower and can be configured via `bower.json`.

The libs task also takes care of copying the needed files to `www/js/libs` so they can be used at runtime.

This directory will be removed when executing the `gulp clean` or `gulp clean:libs` tasks and should not be commited to source control.

# docs

This directory contains the documentation in markdown format which are used to generate this documentation site using [MkDocs](http://www.mkdocs.org/).

This directory is optional and can be removed.

# hooks

This directory contains build hook scripts for Cordova's build system.

> Cordova Hooks represent special scripts which could be added by application and plugin developers or even by your own build system to customize cordova commands. - [Apache Cordova Hooks Guide](https://cordova.apache.org/docs/en/dev/guide/appdev/hooks/)

This starter project does not currently ship with any custom build hooks.

# node_modules (generated)

This is a generated directory that is created when you run `npm install` from the project directory. It contains all of the third party software needed to build and run your application (eg Cordova, Ionic, gulp, etc).

This directory will be removed when executing the `gulp clean` task and should not be committed to source control.

# plugins (generated)

This is a generated directory that is created when you run the `gulp plugins` or `cordova plugin add` commands.

It contains any [Cordova plugins](https://cordova.apache.org/docs/en/latest/cordova/plugins/pluginapis.html) used to extend the functionality of the application through native code.

Plugins are installed via the `cordovaPlugins` property in `package.json.

This directory will be removed when executing the `gulp clean` or `gulp clean:plugins` tasks and should not be committed to source control.

# resources

This is a general purpose directory which can contain any type of resource for your application.

Currently, the `ionic resources` command will utilize the `icon.png` and `splash.png` from this directory to generate the various icon and splash screens for the various platforms' screen sizes.

# src

This directory contains the bulk of the source code for the application. This includes TypeScript source, SASS styling, and Angular HTML templates.

TypeScript files are compiled using the internal module system using the `namespace` keyword for internal namespacing. The result is that all TypeScript file output will be bundled into a single file. This allows us to avoid having to use a module loader at runtime.

As you explore the directory structure you'll notice that the namespaces and directory paths do not match as they would in other languages (Java for example).

Instead we use directories for group of files by feature and namespaces for determining the behavior of a given file.

For example, a class in the `Controllers` namespace will be treated as an Angular controller, but it can be placed in the directory structure next to its related view models and templates.

* src/tsconfig.json

This file controls parameters passed to the TypeScript compiler and is used when running the `gulp ts` task or building from within VSCode.

* src/tsd.d.ts (generated)

This file contains references to all of the [TypeScript definition](http://www.typescriptlang.org/Handbook#writing-dts-files) files from the [DefinitelyTyped](http://definitelytyped.org/) repository.

These are installed by the `tsd` tool via the `gulp tsd` task. The definition files that are downloaded are specified in `tsd.json`.

This file will be removed when executing the `gulp clean` or `gulp clean:tsd` tasks and should not be committed to source control.

* src/_references.ts

This file is used to reference TypeScript files so the compiler knows where to look during compilation. However, if you open the file you'll notice that it does not reference all of the files.

The `gulp ts` task uses the TypeScript compiler's `-p` option to point at the `src` directory for compilation. When using this flag we don't need to maintain a `_references.ts` file with paths to all of the files.

However the file is still useful when we are using internal modules as it allows us to control the order that the JavaScript output is emitted into the bundle file.

We need to do this for specific classes that are base classes (so that at runtime these are loaded before any descendant classes).

It is unlikely that you'll need to edit this file unless you add more base classes.

## src/Application

TODO

## src/Framework

TODO

## src/Filters

TODO

## src/Directives

TODO

## src/Models

TODO

## src/Styles

TODO

## src/Views

TODO

# tests

This directory contains the unit tests for the application.

Unit tests can be run using the Karma test runner by executing the `gulp test` task.

Each sub-directory here should mirror the layout of `src` with the addition of a `.Tests.ts` suffix. That is, a test for `src/Services/Utilities.ts` should be placed at `tests/Services/Utilities.Tests.ts`.

* tests/_references.ts

This file is used to point the TypeScript compiler at the generated type definitions for the compiled application bundle being tested.

* tests/tsconfig.json

This file controls parameters passed to the TypeScript compiler and is used when running the `gulp ts:tests` task or running the unit tests via `gulp test`.

* tests/tsd.d.ts (generated)

This file contains references to all of the [TypeScript definition](http://www.typescriptlang.org/Handbook#writing-dts-files) files from the [DefinitelyTyped](http://definitelytyped.org/) repository.

These are installed by the `tsd` tool via the `gulp tsd` task. The definition files that are downloaded are specified in `tsd.tests.json`.

This file will be removed when executing the `gulp clean` or `gulp clean:tsd` tasks and should not be committed to source control.

* tests/bundle.tests.js (generated)

This file contains the result of the TypeScript compilation of the unit tests.

This is created via the `gulp test` or `gulp ts:tests` tasks.

This file will be removed when executing the `gulp clean` or `gulp clean:tests` tasks and should not be committed to source control.

* tests/bundle.tests.js.map (generated)

This file contains the source mapping information of the TypeScript compilation of the unit tests. These can be used when debugging to step through TypeScript source instead of JavaScript.

This is created via the `gulp test` or `gulp ts:tests` tasks.

This file will be removed when executing the `gulp clean` or `gulp clean:tests` tasks and should not be committed to source control.

# typings

This directory contains all of the [TypeScript definition](http://www.typescriptlang.org/Handbook#writing-dts-files) files from the [DefinitelyTyped](http://definitelytyped.org/) repository used by your application.

These are installed by the `tsd` tool via the `gulp tsd` task. The definition files that are downloaded are specified in `tsd.json`.

All subdirectories will be removed when executing the `gulp clean` or `gulp clean:tsd` tasks (except for the custom directory) and should not be committed to source control.

* typings/custom

This directory contains any custom [TypeScript definition](http://www.typescriptlang.org/Handbook#writing-dts-files) files for your application that are not available on the [DefinitelyTyped](http://definitelytyped.org/) repository.

This is the only subdirectory of the `typings` directory that should be committed to source control.

# typings-tests

This directory contains all of the [TypeScript definition](http://www.typescriptlang.org/Handbook#writing-dts-files) files from the [DefinitelyTyped](http://definitelytyped.org/) repository used by the unit tests.

These are installed by the `tsd` tool via the `gulp tsd:tests` task. The definition files that are downloaded are specified in `tsd.tests.json`.

All subdirectories will be removed when executing the `gulp clean` or `gulp clean:tsd` tasks (except for the custom directory) and should not be committed to source control.

* typings-tests/custom

This directory contains any custom [TypeScript definition](http://www.typescriptlang.org/Handbook#writing-dts-files) files for your application that are not available on the [DefinitelyTyped](http://definitelytyped.org/) repository.

This is the only subdirectory of the `typings-tests` directory that should be committed to source control.

# www

* www/index.master.html

TODO

* www/index.html (generated)

TODO

* www/js

TODO

* www/lib (generated)

TODO

* www/images

TODO

* www/css (generated)

TODO

