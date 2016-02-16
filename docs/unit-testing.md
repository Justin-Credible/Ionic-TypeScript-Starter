# Overview

The sample project is set up to use the [Karma](https://karma-runner.github.io) test runner and [Jasmine](http://jasmine.github.io/) test framework.

Two example unit tests are provided, written in TypeScript.

# Test Directory Layout

The `tests` directory contains the unit test configuration and the tests themselves.

## tests/_references.ts

This file is used to reference TypeScript files so the compiler knows where to look during compilation. However, if you open the file, you'll notice that it does not reference all the files.

The `gulp ts:tests` task uses the TypeScript compiler's `-p` option to point at the `tests` directory for compilation. When using this flag, it is not necessary to maintain a `_references.ts` file with paths to all files.

The only file that must be externally referenced is the bundle containing the output from the result of compiling the `src` directory (the code you want to test).

## tests/tsconfig.json

This file controls parameters passed to the TypeScript compiler and is used when running the `gulp ts:tests` task.

By default, the tests are written to `tests/bundle.tests.js` and the source maps to `tests/bundle.tests.js.map`.

## tests/tsd.d.ts _(generated)_

This file contains references to all [TypeScript definition](http://www.typescriptlang.org/Handbook#writing-dts-files) files from the [DefinitelyTyped](http://definitelytyped.org/) repository that are specific to the unit test files.

These are installed by the `tsd` tool via the `gulp tsd:tests` task. The definition files to be downloaded are specified in `tsd.tests.json`.

!!! warning
	This file will be removed when executing the `gulp clean` or `gulp clean:tsd` tasks and should not be committed to source control.

## Test Files

Test files can be located anywhere in the `tests` directory.

I recommend using subdirectories that mirror the directory stucture of the files from the `src` directory that they are meant to test, with the addition of a `.Tests.ts` suffix.

For example, the tests for the following files:

* `src/Services/Utilities.ts`
* `src/Directives/OnLoadDirective.ts`
* `src/Views/Category/CategoryController.ts`

would be located at the following locations:

* `tests/Services/Utilities.Tests.ts`
* `tests/Directives/OnLoadDirective.Tests.ts`
* `tests/Views/Category/CategoryController.Tests.ts`

# Karma Configuration

Configuration for the Karma test runner is located in `karma.conf.js`.

This file points at the compiled TypeScript test bundle (default is `tests/bundle.tests.js`) and specifies the JavaScript dependecies to load during the tests (the main application bundle, third-party libraries, etc.).

!!! note
	It is important to pay attention to the `files` configuration property and ensure that the JavaScript files here match the ones listed in `index.master.html`. That way, the same files that load when running the application are also available when running unit tests.

# Running

Execute `gulp test` to perform a single run of the unit tests.

!!! note
	For automated builds, you may also find it useful to execute `npm test`, which delegates to `gulp lint` as well as `gulp test`.
