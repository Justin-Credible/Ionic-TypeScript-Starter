# Overview

This section will cover the prerequisites you need to start developing with the starter project.

The guide assumes a Unix-like environment; deviations for Windows users will be called out with inline note blocks.

# Prerequisites

Aside from mobile platform-specific SDKs, [Node.js](https://nodejs.org/dist) 4.4.x is the only external prerequisite.

While any version of 4.4.x or higher should work, I've specifically tested and verified with version [4.4.2](https://nodejs.org/dist/v4.2.2/).

Windows users can download the installer from the link above.

For Mac OS, I recommend installing Node using [Node Version Manager](https://www.npmjs.com/package/nvm), which can be installed using [Homebrew](http://brew.sh/). I recommend following the instructions in [this post](http://stackoverflow.com/a/28025834), which will get you set up so that `npm install` does not require `sudo`.

## iOS Specific

If you are developing for iOS, you need XCode 7. I've specifically tested with version 7.1.

* [Current Version](https://developer.apple.com/xcode/download/)
* [Previous Versions](https://developer.apple.com/downloads/)

You'll probably also want two additional Node packages globally, which will allow you to run your application on the iOS simulator as well as on a physical device directly from the command line:

    $ npm install -g ios-sim
    $ npm install -g ios-deploy

## Android Specific

If you are developing for Android, you need the the Android SDK and the Java Development SDK. I've tested with the following versions of the Android SDK:

* Android SDK ([installer](http://developer.android.com/sdk/index.html#Other))
    * Android SDK Tools - 24.4.0
    * Android SDK Platform-tools - 23.0.1
    * Android SDK Build-tools - 23.0.1
    * Android 5.1.1 - API 22
* [JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) 1.7
* [Android Studio](http://developer.android.com/sdk/index.html) - 1.4 (optional)

!!! note "Note for Windows users"
	You can check whether you've installed these prerequisites properly by typing each the following commands into a command prompt and ensuring they can execute: `android`, `java --version`, `javac --version`, `ant --version`.

## Other Dependencies

All other dependencies are installed in the project directory via `npm`. To use them **you must add `./node_modules/.bin` to your path**. Using the dependencies directly from the project directory reduces dependency hell with globally installed modules and ensures all development is done using the exact same versions of the modules.

!!! warning "Attention"
	Do not skip this step; you need to add `./node_modules/.bin` to your path. If you try to install all the required depdencies globally, you are much more likely to run into issues.

!!! note "Note for Windows users"
	Windows users should note that the path `.\node_modules\.bin` should be appended via the System > Environment Variables GUI, and should restart the command prompt instance for the changes to take effect.

## IDEs and Text Editors

This project is platform and IDE agnostic. You can use any IDE or text editor.

I recommend using the free and lightweight [Visual Studio Code](https://code.visualstudio.com) editor, as it has superb support for TypeScript.

Development and debugging can be done in Chrome using its built-in Developer Tools window.

!!! note "Note for Windows users"
	This version of the starter project is made to work with any IDE. Although I have put together an [alternate version](https://github.com/Justin-Credible/Ionic-TypeScript-MDHA-Starter) that supports Visual Studio 2015, I still highly recommend using this version. The VS2015 Cordova wrapper ("Tools for Apache Cordova" project template) can sometimes be a bit of a black box, in my opinion, which makes it harder to work with.

# Environment Setup

To begin, edit your path, clone the repository, install the node packages, and initialize the development environment.

    $ PATH=$PATH:./node_modules/.bin
    $ git clone https://github.com/Justin-Credible/Ionic-TypeScript-Starter.git
    $ cd Ionic-TypeScript-Starter
    $ npm install
    $ gulp init

!!! warning "Attention"
	If you receive any errors while running `gulp init`, please double-check to ensure you've added `./node_modules/bin` to your path and that this path takes precedence over the globally installed node modules path.

`gulp init` sets up the Cordova platform and plugins, obtains libraries, and compiles code. See [Gulp Tasks](gulp-tasks.md) for details.

Your envrionment should now be ready for development!
