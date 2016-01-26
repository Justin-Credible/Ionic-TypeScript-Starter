Ionic/Typescript Starter
=============================
[![Build Status](https://travis-ci.org/Justin-Credible/Ionic-TypeScript-Starter.svg?branch=master)](https://travis-ci.org/Justin-Credible/Ionic-TypeScript-Starter)
[![Dependencies](https://david-dm.org/Justin-Credible/Ionic-TypeScript-Starter
.svg)](https://david-dm.org/Justin-Credible/Ionic-TypeScript-Starter)

This is a sample project that I use as a starting point for developing new mobile applications.

It utilizes the [Ionic](http://ionicframework.com/) framework to achieve a user interface that feels like a native application. The Ionic framework in turn utilizes [AngularJS](https://angularjs.org/).

The application is written primarily in [TypeScript](http://www.typescriptlang.org/) which brings object oriented paradigms, type-safety, compile-time checking, and IDE tooling such as refactoring and code completion.

This project is IDE and platform agnostic. I recommend using the free and lightweight [Visual Studio Code](https://code.visualstudio.com) editor as it has superb support for TypeScript, but any editor will do.

In-browser development and debugging is possible via the Chrome developer tools. When deployed to a physical device, the application runs in the [Cordova](http://cordova.apache.org/) application container.

This starter project targets iOS, Android, and Chrome (as an extension).

If you are developing on Windows but want to compile and run your application on OS X via the iOS simulator, you can use the built-in `gulp remote-emulate-ios` task. See below for more details.

# Documentation

Documentation is available in the `docs` director, or online at the [project website](http://Justin-Credible.github.io/Ionic-TypeScript-Starter).

* [Overview](http://Justin-Credible.github.io/Ionic-TypeScript-Starter)
* [Features](http://Justin-Credible.github.io/Ionic-TypeScript-Starter/features)
* [Getting Started](http://Justin-Credible.github.io/Ionic-TypeScript-Starter/getting-started)
* Project Layout
 * [Root Files](http://Justin-Credible.github.io/Ionic-TypeScript-Starter/project-layout-root-files)
 * [src Directory](http://Justin-Credible.github.io/Ionic-TypeScript-Starter/project-layout-src-directory)
 * [www Directory](http://Justin-Credible.github.io/Ionic-TypeScript-Starter/project-layout-www-directory)
 * [Other Directories](http://Justin-Credible.github.io/Ionic-TypeScript-Starter/project-layout-other-directories)
* Documentation
 * [Gulp Tasks](http://Justin-Credible.github.io/Ionic-TypeScript-Starter/gulp-tasks)
 * [Base Framework](http://Justin-Credible.github.io/Ionic-TypeScript-Starter/base-framework)
 * [Unit Testing](http://Justin-Credible.github.io/Ionic-TypeScript-Starter/unit-testing)
 * [Development Tips](http://Justin-Credible.github.io/Ionic-TypeScript-Starter/development-tips)

# Quick Start

Install [Node.js](https://nodejs.org/dist/v4.2.2/) 4.2.2

All other dependencies are installed in the project directory via `npm`. To use them **you'll need to add `./node_modules/.bin` to your path**.

To begin, edit your path, clone the repository, install the node packages, and initialize the development environment.

    $ PATH=$PATH:./node_modules/.bin
    $ git clone https://github.com/Justin-Credible/Ionic-TypeScript-Starter.git
    $ cd Ionic-TypeScript-Starter
    $ npm install
    $ gulp init

At this point your environment should be ready for development! If you've enountered errors check out the full guide to [getting started](http://Justin-Credible.github.io/Ionic-TypeScript-Starter/getting-started).

