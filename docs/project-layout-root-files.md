# Overview

This section will cover the functionality of each of the files in the root directory.

# .gitignore

Used to specify which source files should be excluded from source control.

# .travis.yml

> Travis CI is a FOSS, hosted, distributed continuous integration service used to build and test software projects hosted at GitHub. - [Wikipedia](https://en.wikipedia.org/wiki/Travis_CI)

If you do not use Travis CI you can remove this file.

# bower.json

This file is used by [Bower](http://bower.io/) to specify the third party JavaScript libraries used by your application. It's install section can be used which files to copy into `www/lib` when running the `gulp libs` task.

# config.master.xml

This is the master config file that is used to generate `config.xml` when running the `gulp config` task.

The config task will perform variable substitution based on the current scheme.

# config.xml _(generated)_

This file is generated from `config.master.xml` when running the `gulp config` task. This is the main configuration file that Cordova uses to build and run the application.

This file will be removed when executing the `gulp clean` or `gulp clean:config` tasks and should not be comitted to source control.

# ionic.project

This file is used by the Ionic CLI. It is used to configure Ionic.io services for example.

# karma.conf.js

This is the configuration file for the [Karma Unit Test Runner](https://karma-runner.github.io) which is used to run the unit tests via the `gulp test` task.

# LICENSE

This is the license file for the starter project.

# mkdocs.yml

The configuration file for the [MkDocs document generator](http://www.mkdocs.org/) which is used to generate these docs.

If you are not using MkDocs you can remove this file.

# package.json

This is file is used by Node to describe the this package to node as well as specify the dependencies that need to be downloaded when executing the `npm install` command.

The dependencies are the third party software needed to build and run your application (eg Cordova, Ionic, gulp, etc).

# README.md

The default readme file for the starter project.

This can be removed or replaced with information specific to your application.

# remote-build.json

This file contains configuration used by the `gulp remote-emulate-ios` task which allows Windows developers to build and emulate their app on a remote iOS simulator running on Mac OS X.

See TODO for more information.

# tsd.json

This file contains configuration for the `tsd` tool for the [TypeScript definition](http://www.typescriptlang.org/Handbook#writing-dts-files) files from the [DefinitelyTyped](http://definitelytyped.org/) repository.

This file is used via the `gulp tsd` task. It contains type definition references specific to the application.

Normally you'll add and remove definition references to this file by using the `tsd` command line tool.

# tsd.tests.json

This file contains configuration for the `tsd` tool for the [TypeScript definition](http://www.typescriptlang.org/Handbook#writing-dts-files) files from the [DefinitelyTyped](http://definitelytyped.org/) repository.

This file is used via the `gulp tsd` task. It contains type definition references specific to the unit tests.

Normally you'll add and remove definition references to this file by using the `tsd` command line tool.

# tslint.json

This file contains configuration for the TypeScript [linter](https://en.wikipedia.org/wiki/Lint_(software)).

It is used via the `gulp lint` task.