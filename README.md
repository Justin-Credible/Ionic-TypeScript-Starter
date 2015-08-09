Ionic Typescript Starter
=============================
[![Build Status](https://travis-ci.org/Justin-Credible/Ionic-TypeScript-Starter.svg?branch=master)](https://travis-ci.org/Justin-Credible/Ionic-TypeScript-Starter)
[![Dependencies](https://david-dm.org/Justin-Credible/Ionic-TypeScript-Starter
.svg)](https://david-dm.org/Justin-Credible/Ionic-TypeScript-Starter)

This is a sample application that I use as a starting point for developing new mobile applications.

It utilizes the [Ionic](http://ionicframework.com/) framework to achieve a user interface that feels like a native application. The Ionic framework in turn utilizes [AngularJS](https://angularjs.org/).

The application is written primarily in [TypeScript](http://www.typescriptlang.org/) which brings object oriented paradigms, type-safety, compile-time checking, and IDE tooling (refactoring! code completion! huzzah!).

This project is IDE and platform agnostic. I recommend using the free and lightweight [Visual Studio Code](https://www.visualstudio.com/products/code-vs) editor as it has superb support for TypeScript, but any editor will do.

In-browser development and debugging is possible via the [Apache Ripple](http://ripple.incubator.apache.org/) emulator. When deployed to a physical device, the application runs in the [Cordova](http://cordova.apache.org/) application container.

This starter project targets iOS, Android, and Chrome (as an extension).

If you are developing on Windows but want to compile and run your application on OS X via the iOS simulator, you can use the built-in `gulp remote-emulate-ios` task. See below for more details.

This readme contains information that will allow you to get started with the starter project, such as environment setup and code compilation. For more information on the project layout and project features, please see the [wiki](https://github.com/Justin-Credible/Ionic-TypeScript-Starter/wiki).

Screenshots can be found on the project page [here](http://www.justin-credible.net/Projects/Ionic-TypeScript-MDHA-Starter).

*If you are looking for a version of this project that uses the full Visual Studio IDE and the Apache Cordova project template, you can check out its sister project: [Ionic-TypeScript-MDHA-Starter](https://github.com/Justin-Credible/Ionic-TypeScript-MDHA-Starter).*

## Environment Setup ##

The following prerequisites are required (I've listed the versions of the packages I've tested with).

*While the following node modules can be installed globally, I recommend using them directly from the project directory. You can do so by adding `./node_modules/.bin` to your path.*

* Node.js (0.10.28)
* Cordova (5.0.0)
* Ionic (1.4.5)
* TypeScript (1.5.0-beta)
* Bower (1.4.1)
* bower-installer (1.2.0)
* tsd (0.6.0-beta.5)

*In addition, if you want to run on a emulator or physical device, you'll need your environment setup for iOS or Android development.*

To begin, clone the repository and install the node packages:

	$ git clone https://github.com/Justin-Credible/Ionic-TypeScript-Starter.git
    $ cd Ionic-TypeScript-Starter
	$ npm install

## Compilation ##

Now you can use the various gulp tasks to obtain Cordova plugins, install third party libraries via Bower, download TypeScript definition files and compile the TypeScript code.

*You can also just run `gulp` without any arguments which will run the below targets.*

	$ gulp libs       # Install 3rd Party JS libraries as defined in bower.json
	$ gulp plugins    # Install Cordova plugins as defined in package.json
	$ gulp tsd        # Install TypeScript definitions as defined in tsd.json
	$ gulp ts         # Compiles TypeScript code as configured by src/tsconfig.json

*If you are using VSCode, you can use <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>B</kbd> to run the `ts` task.*

*By default, the debug variable will be set to true in `BuildVars.js`; for release builds use `gulp ts --scheme release`.*

## Testing ##

The `npm test` command can be executed to run the TypeScript linter followed by the unit tests using the Karma test runner.

These operations can be performed independently using the `gulp lint` and `gulp test` tasks.

*If you are using VSCode, you can use <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>R</kbd> and type `lint` or `test` to run the lint or test tasks respectively.*

## Platform Setup ##

Next you'll need to add the platforms you'll be running/building for.

	$ ionic platform add ios

If you are going to be developing on iOS, you'll probably want  two additional packages with allow you to run the your application on the iOS simulator as well as a physical device:

	$ npm install ios-sim
	$ npm install ios-deploy

For best performance on Android, you'll may wish to add the [Crosswalk](https://crosswalk-project.org/) plugin which will use an up to date version of Chromium instead Android's built-in WebView:

	$ ionic browser add crosswalk

## Running in Browser ##

Development can be done quickly using your desktop web browser with live reloading of code. Chrome is recommended for best results.

	$ ionic serve

You can also use the Apache Ripple emulator which adds features when debugging in your browser (screen resolutions, hardware simulation, etc). It is available via `npm` or as a [Chrome Plugin](https://chrome.google.com/webstore/detail/geelfhphabnejjhdalkjhgipohgpdnoc).

To avoid [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) issues, you'll need to to mock up your API responses via `MockHttpApis.ts` or disable CORS by launching Chrome with the `--disable-web-security` argument.

You may also find it useful to ignore all SSL certificate errors so you don't have to trust certificates on your machine by using `--ignore-certificate-errors`.

	$ open -a "Google Chrome.app" --args --ignore-certificate-errors --disable-web-security

*NOTE: You shouldn't use these flags on a browser you use to browse the internet as they disable important security measures. It is recommended to download an setup a separate Chrome instance when using these flags (I use the [Canary](https://www.google.com/chrome/browser/canary.html) builds).*

## Running on Emulators ##

You can run your application on the software emulator using the `emulate` command.

	$ ionic emulate ios

*You can optionally specify a specific emulator using the target parameter: `--target="iPhone-6-Plus"`*

*If you are using VSCode you can use <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>R</kbd> and type `emulate` to run either the iOS or Android emulate targets.*

## Running on the iOS Simulator remotely from Windows ##

If you are developing your application on a Windows machine, but want to test and run your application on iOS, you can do so using the `gulp remote-emulate-ios` task and target a remote OS X machine.

First, you'll need to install the `remotebuild` package via npm on the OS X machine on which you want to run the simulator. Note that since the Cordova project will be built on the OS X machine, you'll need to make sure you have all the build prerequisites installed (Xcode etc).

	$ npm install -g remotebuild

Next, you'll want to edit `remote-build.json` located in the root of the starter project. This file will let you set the host name, port, and URL to point at your OS machine, as well as configure other settings.

Finally, you can execute `gulp remote-emulate-ios` from the root of the starter project which will take care of TypeScript compilation, building a payload, and uploading it to the OS X machine so it can be built and emulated.

*If you are using VSCode you can use <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>R</kbd> and type `remote` to run the iOS remote emulate target*

## Running on Hardware ##

Before running on a device you'll want to make sure it is visible via XCode (for iOS) or via `adb devices -l` (for Android) otherwise the simulator may launch instead.

	$ ionic run ios --device

## Creating a Build ##

To create production build, it is first a good idea to re-run all of the gulp tasks to ensure that all of the plugins and libraries are up to date at the TypeScript code has been compiled.

	$ gulp --scheme release

*Usage of the `--scheme release` flag here will set the `debug` flag to false in the `BuildVars.js` file.*

Then, to create a native build, use Ionic's build command:

	$ ionic build ios --release
	
Or to create a Chrome extension, use the `chrome` gulp task:

	$ gulp chrome --scheme release
	
Native build artifacts will be located in the `platforms/<platform name>` directory and an unpacked Chrome extension will be located in the `chrome` directory.