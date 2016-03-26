Ionic/TypeScript Starter
=============================
[![Build Status](https://travis-ci.org/Justin-Credible/Ionic-TypeScript-Starter.svg?branch=master)](https://travis-ci.org/Justin-Credible/Ionic-TypeScript-Starter)
[![Dependencies](https://david-dm.org/Justin-Credible/Ionic-TypeScript-Starter
.svg)](https://david-dm.org/Justin-Credible/Ionic-TypeScript-Starter)

This is a sample project that I use as a starting point for developing new mobile applications. This starter project targets iOS, Android, Chrome (as an extension), and the web.

It uses the [Ionic](http://ionicframework.com/) framework (version 1.x, built on [AngularJS](https://angularjs.org/) 1.x) which makes it possible to rapidly build apps that feel native.

The project is written primarily in [TypeScript](http://www.typescriptlang.org/), which decreases development time and increases maintainability (with object oriented and type-safe code, compile-time checking, and IDE tooling such as refactoring and code completion).

This project is IDE and platform agnostic. I recommend using the free and lightweight [Visual Studio Code](https://code.visualstudio.com) editor, as it has superb support for TypeScript.

In-browser development and debugging is possible via the Chrome developer tools. When deployed to a physical device, the application runs in the [Cordova](http://cordova.apache.org/) application container.

If you are developing on Windows or Linux but want to compile and run your application on a remote OS X machine, you can use the built-in `gulp emulate-ios-remote` task.

# Documentation

Documentation is available in the `docs` directory, or online at the [project website](http://Justin-Credible.github.io/Ionic-TypeScript-Starter).

# Quick Start

Install [Node.js](https://nodejs.org/dist/v4.4.0/) 4.4.0

All other dependencies are installed in the project directory via `npm`. To use them, **you must add `./node_modules/.bin` to your path**.

To begin, edit your path, clone the repository, install the node packages, and initialize the development environment.

    $ PATH=$PATH:./node_modules/.bin
    $ git clone https://github.com/Justin-Credible/Ionic-TypeScript-Starter.git
    $ cd Ionic-TypeScript-Starter
    $ npm install
    $ gulp init

Your environment should now be ready for development! If you encounter errors, check out the full guide to [getting started](http://Justin-Credible.github.io/Ionic-TypeScript-Starter/getting-started).

