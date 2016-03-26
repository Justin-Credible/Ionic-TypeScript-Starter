# Overview

This section will cover the `resources` directories and its children.

The `resources` directory contains configuration, scripts, and assets used by your application.

## icon.png

This is an icon for your application which will be used on the iOS and Android platforms. The Ionic command `ionic resources` will use this file to generate the correct icon image sizes for each device variation for these two platforms. The icons will be output to the `android` and `ios` directories.

## splash.png

This is a splash screen for your application which will be used on the iOS and Android platforms. The Ionic command `ionic resources` will use this file to generate the correct splash screen image sizes for each device variation for these two platforms. The splash screens will be output to the `android` and `ios` directories.

# android

The `android` directory contains resources specific to the Android platform.

The `icon` and `splash` directories contain the application's icon and splash screens for the various DPIs. They are generated from the `resources/icon.png` and `resources/splash.png` files respectively when running the `ionic resources` command.

# build

The `build` directory contains files related to building the application.

## build/remote.yml

This file contains configuration used by the `gulp emulate-ios-remote` task, which allows developers on Windows or Linux to package, build, or run their app on a remote machine running Mac OS X.

See [Running iOS Simulator Remotely](development-tips.md#running-ios-simulator-remotely) for more details.

## build/tasks

This directory contains all of the tasks referenced from `gulpfile.js` which are used when running `gulp`. Each file contains a single task. The `helper.js` contains helper functions shared by all tasks.

See [Gulp Tasks](gulp-tasks.md) for more information.

# chrome

This directory contains resources specific to the application when built as a Chrome extension.

## index.master.html

This is the master index file used to generate `www/index.html` and `build/chrome/index.html` when running the `gulp config --prep chrome` and `gulp package-chrome` tasks respectively.

The config task will perform variable substitution based on the current scheme.

See `gulp config` and `gulp package-chrome` in [Gulp Tasks](gulp-tasks.md#gulp-config) and [Base Framework: Build Schemes](base-framework.md#build-scemes) for more details.

## index.references.yml

This file contains the CSS and JavaScript files to be referenced in the `index.html` file when running the `gulp config --prep chrome` and `gulp package-chrome` tasks. In addition to specifying which files to include it also dictates the order of the includes and/or bundled output. 

See `gulp config` and `gulp package-chrome` in [Gulp Tasks](gulp-tasks.md#gulp-config) for more details.

## manifest.master.json

This is the master manifest file used to generate `build/chrome/manifest.json` when running the `gulp config --prep chrome`  and `gulp package-chrome` tasks.

The config task will perform variable substitution based on the current build scheme.

See `gulp config` in [Gulp Tasks](gulp-tasks.md#gulp-config) for more details.

# config

The `config` directory configuration for your application

## config/config.yml

This file holds key/value pairs of configuration items which your application can access at runtime. This file is used to generate `www/js/build-vars.js`.

These key/value pairs are accessible via the [configuration service's](http://127.0.0.1:8000/base-framework/#provided-services) `buildVars` property.

The config task will perform variable substitution based on the current build scheme.

See `gulp config` in [Gulp Tasks](gulp-tasks.md#gulp-config) and [Base Framework: Build Schemes](base-framework.md#build-scemes) for more details.

## config/schemes.yml

This file holds configuration for each of the build schemes. A scheme contains key/value pairs which can be used to perform variable replacement on the `index.master.html` and `config.yml` files to generate the `index.html` and `build-vars.js` files.

See `gulp config` in [Gulp Tasks](gulp-tasks.md#gulp-config) and [Base Framework: Build Schemes](base-framework.md#build-scemes) for more details.

# cordova

This directory contains resources specific to the iOS and Android platforms via the Cordova runtime.

## config.master.xml

This is the master config file used to generate `config.xml` when running the `gulp config` task.

The config task will perform variable substitution based on the current build scheme.

See `gulp config` in [Gulp Tasks](gulp-tasks.md#gulp-config) for more details.

## index.master.html

This is the master index file used to generate `www/index.html` when running the `gulp config` task.

The config task will perform variable substitution based on the current scheme.

See `gulp config` in [Gulp Tasks](gulp-tasks.md#gulp-config) and [Base Framework: Build Schemes](base-framework.md#build-scemes) for more details.

## index.references.yml

This file contains the CSS and JavaScript files to be referenced in the `index.html` file when running the `gulp config` task. In addition to specifying which files to include it also dictates the order of the includes and/or bundled output. 

See `gulp config` in [Gulp Tasks](gulp-tasks.md#gulp-config) for more details.

# ios

The `ios` directory contains resources specific to the iOS platform.

The `icon` and `splash` directories contain the application's icon and splash screens for the various DPIs. They are generated from the `resources/icon.png` and `resources/splash.png` files respectively when running the `ionic resources command.

# web

This directory contains resources specific to the application when built for serving as a mobile website.

## index.master.html

This is the master index file used to generate `www/index.html` and `build/web/index.html` when running the `gulp config --prep web` and `gulp package-web` tasks respectively.

The config task will perform variable substitution based on the current scheme.

See `gulp config --prep web` and `gulp package-web` in [Gulp Tasks](gulp-tasks.md#gulp-config) and [Base Framework: Build Schemes](base-framework.md#build-scemes) for more details.

## index.references.yml

This file contains the CSS and JavaScript files to be referenced in the `index.html` file when running the `gulp config --prep web` and `gulp package-web` tasks. In addition to specifying which files to include it also dictates the order of the includes and/or bundled output. 

See `gulp config --prep web` and `gulp package-web` in [Gulp Tasks](gulp-tasks.md#gulp-config) for more details.
