# Overview

This section will cover the functionality of each file in the root directory.

# .gitignore

This file is used to specify which source files should be excluded from source control.

# .travis.yml

> Travis CI is a FOSS, hosted, distributed continuous integration service used to build and test software projects hosted at GitHub. - [Wikipedia](https://en.wikipedia.org/wiki/Travis_CI)

If you do not use Travis CI, you can remove this file.

# bower.json

This file is used by the [Bower](http://bower.io/) package manager to declare the third-party JavaScript libraries used by your application. Its install section can be used to customize the files that will be copied into `www/lib` when running the `gulp libs` task.

See `gulp libs` in [Gulp Tasks](gulp-tasks.md#gulp-libs) for more details.

# config.master.xml

This is the master config file used to generate `config.xml` when running the `gulp config` task.

The config task will perform variable substitution based on the current build scheme.

See `gulp config` in [Gulp Tasks](gulp-tasks.md#gulp-config) for more details.

# config.xml _(generated)_

This file is generated from `config.master.xml` when running the `gulp config` task. This is the main configuration file that Cordova uses to build and run your application.

!!! warn
	This file will be removed when executing the `gulp clean` or `gulp clean:config` tasks and should not be committed to source control.

# ionic.project

This file is used by the `ionic` command line tool. It is used to configure [Ionic.io](http://ionic.io/) services, among other things.

# karma.conf.js

This is the configuration file for the [Karma Unit Test Runner](https://karma-runner.github.io), which is used to run the unit tests via the `gulp test` task.

See `gulp test` in [Gulp Tasks](gulp-tasks.md#gulp-test) for more details.

# LICENSE

This is the license file for the starter project.

# mkdocs.yml

This is the configuration file for the [MkDocs document generator](http://www.mkdocs.org/), used to generate these docs from the Markdown files in the `docs` directory.

If you are not using MkDocs, you can remove this file and the `docs` directory.

# package.json

This file is used by Node to describe the starter project and to declare the dependencies that must be downloaded when executing the `npm install` command.

These dependencies include the third-party software needed to build and run your application (e.g., Cordova, Ionic, gulp, etc.).

# README.md

The default readme file for the starter project.

This can be removed or replaced with information specific to your application.

# remote-build.json

This file contains configuration used by the `gulp remote-emulate-ios` task, which allows developers on Windows or Linux to package, build, or run their app on a remote Mac OS X machine.

See [Running iOS Simulator Remotely](development-tips.md#running-ios-simulator-remotely) for more details.


See `gulp remote-emulate-ios` in [Gulp Tasks](gulp-tasks.md#gulp-remote-emulate-ios) for more details.

# tsd.json

This file declares the [TypeScript definition files](http://www.typescriptlang.org/Handbook#writing-dts-files) that should be downloaded when executing the `gulp tsd` task. The definition files are hosted by the [DefinitelyTyped](http://definitelytyped.org/) project.

These definition files describe the third-party JavaScript libraries your application uses so they can be referenced from TypeScript in a strongly-typed manner.

This file can be updated using the `tsd` command line tool to add or remove definitions.

See `gulp tsd` in [Gulp Tasks](gulp-tasks.md#gulp-tsd) for more details.

# tsd.tests.json

This file declares the [TypeScript definition files](http://www.typescriptlang.org/Handbook#writing-dts-files) that should be downloaded when executing the `gulp tsd` task. The definition files are hosted by the [DefinitelyTyped](http://definitelytyped.org/) project.

These definition files describe third-party JavaScript libraries that your unit tests use so they can be referenced from TypeScript in a strongly-typed manner.

This file can be updated using the `tsd` command line tool to add or remove definitions.

See `gulp tsd` in [Gulp Tasks](gulp-tasks.md#gulp-tsd) for more details.

# tslint.json

This file contains configuration for the TypeScript [linter](https://en.wikipedia.org/wiki/Lint_(software)).

See `gulp lint` in [Gulp Tasks](gulp-tasks.md#gulp-lint) for more details.