# Overview

The starter project is platform agnostic; you should be able to do development on Mac OS, Linux, or Windows using any IDE or text editor.

# Prerequisites

Aside from mobile platform specific SDKs, [Node.js](https://nodejs.org/dist) 4.4.x is the only prerequisite.

While any version of 4.4.x or higher should work, I've specifically tested and verified with version [4.4.2](https://nodejs.org/dist/v4.2.2/).

Windows users can download the installer from the link above while Mac OS users can install Node using `homebrew`/`nvm`.

> Mac OS Note: If you have to use `sudo` when installing node packages globally, you should consider using `homebrew` to install node via `nvm` as per [this post](http://stackoverflow.com/a/28025834) so `sudo` isn't required:

```
$ brew update
$ brew install nvm

# Install and use Node version 4.2.2
$ nvm install 4.2.2
$ nvm use 4.2.2

# Configure nvm to use 4.2.2 whenever you launch the terminal
$ echo "source $(brew --prefix nvm)/nvm.sh" >> ~/.profile
$ echo "nvm use 4.2.2" >> ~/.profile
```

## iOS Specific

If you are developing for iOS you'll need XCode 7.x.

* [Current Version](https://developer.apple.com/xcode/download/)
* [Previous Versions](https://developer.apple.com/downloads/)

Additionally, you'll probably want two additional Node packages with allow you to run the your application on the iOS simulator as well as a physical device:

    $ npm install -g ios-sim
    $ npm install -g ios-deploy

> Windows Note: If you are developing on Windows but want to compile and run your application on OS X remotely via the iOS simulator, you can use the built-in `gulp remote-emulate-ios` task. See [Gulp Tasks](gulp-tasks.md) for more details.

## Android Specific

If you are developing for Android you'll need the the Android SDK and the Java Development SDK. I've listed the versions of the Android SDK I've tested with.

* Android SDK ([installer](http://developer.android.com/sdk/index.html#Other))
  * Android SDK Tools - 24.4.0
  * Android SDK Platform-tools - 23.0.1
  * Android SDK Build-tools - 23.0.1
  * Android 5.1.1 - API 22
* [JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) 1.7
* [Android Studio](http://developer.android.com/sdk/index.html) - 1.4 (optional)

> Windows Note: You can be sure you've installed these pre-requisites by typing the following commands into a command prompt:

* `android`
* `java --version`
* `javac --version`
* `ant --version`

## Other Dependencies

All other dependencies are installed in the project directory via `npm`. To use them **you'll need to add `./node_modules/.bin` to your path**. Using the dependencies directly from the project directory reduces dependency hell with globally installed modules and ensures all development is done using the exact same versions of the modules.

> Note: Windows users should note that the path should be appended via the System > Environment Variables GUI and should restart their command prompt instance for the changes to take effect.

## IDEs and Text Editors

This project is platform and IDE agnostic. You can use any IDE or text editor.

I recommend using the free and lightweight [Visual Studio Code](https://code.visualstudio.com) editor as it has superb support for TypeScript.

Development and debugging can be done in Chrome using its built in Developer Tools window.

> Windows Note: If you want to use the full version of Visual Studio on Windows, you should check out an alternate repository that is setup specifically for VS2015 which is available [here](https://github.com/Justin-Credible/Ionic-TypeScript-MDHA-Starter). However, I still recommend using the platform agnostic version of the starter project with the free Visual Studio Code IDE.

# Environment Setup

To begin, edit your path, clone the repository, install the node packages, and initialize the development environment.

    $ PATH=$PATH:./node_modules/.bin
    $ git clone https://github.com/Justin-Credible/Ionic-TypeScript-Starter.git
    $ cd Ionic-TypeScript-Starter
    $ npm install
    $ gulp init

> Note: If you receive any errors while running gulp init please double check to ensure you've added `./node_modules/bin` to your path and that this path takes presedence over the globally installed node modules path.

The `gulp init` handles setting up the Cordova platform and plugins as well as obtaining libraries and code compilation. See [Gulp Tasks](gulp-tasks.md) for details.

At this point your envrionment should be ready for development!
