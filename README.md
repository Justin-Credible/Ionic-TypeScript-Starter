Ionic Typescript Starter
=============================
[![Build Status](https://travis-ci.org/Justin-Credible/Ionic-TypeScript-Starter.svg?branch=master)](https://travis-ci.org/Justin-Credible/Ionic-TypeScript-Starter)
[![Dependencies](https://david-dm.org/Justin-Credible/Ionic-TypeScript-Starter
.svg)](https://david-dm.org/Justin-Credible/Ionic-TypeScript-Starter)

This is a sample application that I use as a starting point for developing new mobile applications.

It utilizes the [Ionic](http://ionicframework.com/) framework to achieve a user interface that feels like a native application. The Ionic framework in turn utilizes [AngularJS](https://angularjs.org/).

The application is written primarily in [TypeScript](http://www.typescriptlang.org/) which brings object oriented paradigms, type-safety, compile-time checking, and IDE tooling (refactoring! code completion! huzzah!).

This project is IDE and platform agnostic. I recommend using the free and lightweight [Visual Studio Code](https://code.visualstudio.com) editor as it has superb support for TypeScript, but any editor will do.

In-browser development and debugging is possible via the Chrome developer tools. When deployed to a physical device, the application runs in the [Cordova](http://cordova.apache.org/) application container.

This starter project targets iOS, Android, and Chrome (as an extension).

If you are developing on Windows but want to compile and run your application on OS X via the iOS simulator, you can use the built-in `gulp remote-emulate-ios` task. See below for more details.

This readme contains information that will allow you to get started with the starter project, such as environment setup and code compilation. For more information on the project layout and project features, please see the [wiki](https://github.com/Justin-Credible/Ionic-TypeScript-Starter/wiki).

Screenshots can be found on the project page [here](http://www.justin-credible.net/Projects/Ionic-TypeScript-MDHA-Starter).

> Note: If you are looking for a version of this project that uses the full Visual Studio IDE and the Apache Cordova project template, you can check out its sister project: [Ionic-TypeScript-MDHA-Starter](https://github.com/Justin-Credible/Ionic-TypeScript-MDHA-Starter).

## Environment Setup ##

The following external prerequisites are required:

* [Node.js](https://nodejs.org/dist/v4.2.2/) 4.2.2

> Note: If you want to run on a emulator or physical device, you'll need your environment setup for iOS or Android development.

Recommended IDEs:

* [Visual Studio Code](https://code.visualstudio.com/)
* Chrome (developer debugging tools)

All other dependencies are installed in the project directory via `npm`. To use them **you'll need to add `./node_modules/.bin` to your path**. Using the dependencies directly from the project directory reduces dependency hell with globally installed modules and ensures all development is done using the exact same versions of the modules.

To begin, edit your path, clone the repository, install the node packages, and initialize the development environment.

    $ PATH=$PATH:./node_modules/.bin
    $ git clone https://github.com/Justin-Credible/Ionic-TypeScript-Starter.git
    $ cd Ionic-TypeScript-Starter
    $ npm install
    $ gulp init

> Note: Windows users should note that the path should be appended via the System > Environment Variables GUI and should restart their command prompt instance for the changes to take effect.

The `gulp init` task adds the platforms from `package.json` using the `ionic platform add` command and then runs the default gulp task (as shown in the compilation section below).

If you are going to be developing on iOS, you'll probably want two additional packages with allow you to run the your application on the iOS simulator as well as a physical device:

    $ npm install -g ios-sim
    $ npm install -g ios-deploy

At this point your environment should be ready for development!

## Compilation ##

The following tasks can be used to perform code configuration, library and plugin setup, and TypeScript compilation.

    $ gulp config     # Creates config.xml, www/index.html (from their *.master files) and www/js/build-vars.js
    $ gulp templates  # Compiles Angluar HTML templates from Views/**/*.html to www/js/templates.js
    $ gulp sass       # Compiles SASS from src/Styles/Index.scss to www/css/bundle.css
    $ gulp libs       # Install third Party JS libraries as defined in bower.json
    $ gulp plugins    # Install Cordova plugins as defined in package.json
    $ gulp tsd        # Install TypeScript definitions as defined in tsd.json
    $ gulp ts         # Compiles TypeScript code as configured by src/tsconfig.json

> Note: You can also just run `gulp` without any arguments which will run all of the above targets.

> Note: If you have issues running `gulp init` or any of the gulp tasks above, ensure that you've added `./node_modules/bin` to your path and that it is taking precedence over npm's global location. You can verify this by using the `which gulp` (or `where gulp.cmd` on Windows) from the project directory. The local `node_modules` path should be listed first. Windows users should also check `where tsc.exe` to ensure they are using the TypeScript compiler from the project directory instead of Visual Studio's global version.

You can specify a configuration scheme using the scheme flag when running the configuration task, where the scheme name is one of the schemes listed in `config.master.xml`:

    $ gulp config --scheme development

> Note: If you are using VSCode, you can use <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>B</kbd> to run the `ts` task with the default scheme.

## Testing ##

The `npm test` command can be executed to run the TypeScript linter followed by the unit tests using the Karma test runner.

These operations can be performed independently using the `gulp lint` and `gulp test` tasks.

> Note: If you are using VSCode, you can use <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>R</kbd> and type `lint` or `test` to run the lint or test tasks respectively.

## Running in Browser ##

Development can be done quickly using your desktop web browser with live reloading of code. Chrome is recommended for best results.

    $ ionic serve

To avoid [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) issues, you'll need to to mock up your API responses via `MockHttpApis.ts` or disable CORS by launching Chrome with the `--disable-web-security` argument.

You may also find it useful to ignore all SSL certificate errors so you don't have to trust certificates on your machine by using `--ignore-certificate-errors`.

    $ open -a "Google Chrome.app" --args --ignore-certificate-errors --disable-web-security

> Note: You shouldn't use these flags on a browser you use to browse the internet as they disable important security measures. It is recommended to setup a separate Chrome instance when using these flags. I use the following AppleScript to point to a different data directory.

```
do shell script "/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --user-data-dir=/Users/$USER/Library/Application\\ Support/Google/ChromePersonal > /dev/null 2>&1 &"
```

## Running on Emulators ##

You can run your application on the software emulator using the `emulate` command.

    $ ionic emulate ios

> Note: You can optionally specify a specific emulator using the target parameter: `--target="iPhone-6-Plus"`. A list of installed emulators can be obtained using `ionic emulate ios --list`.

> Note: If you are using VSCode you can use <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>R</kbd> and type `emulate` to run either the iOS or Android emulate targets.

## Running on the iOS Simulator remotely from Windows ##

If you are developing your application on a Windows machine, but want to test and run your application on iOS, you can do so using the `gulp remote-emulate-ios` task and target a remote OS X machine.

First, you'll need to install the `remotebuild` package via npm on the OS X machine on which you want to run the simulator. Note that since the Cordova project will be built on the OS X machine, you'll need to make sure you have all the build prerequisites installed (Xcode etc).

    $ npm install -g remotebuild

Next, you'll want to edit `remote-build.json` located in the root of the starter project. This file will let you set the host name, port, and URL to point at your OS machine, as well as configure other settings.

Finally, you can execute `gulp remote-emulate-ios` from the root of the starter project which will take care of TypeScript compilation, building a payload, and uploading it to the OS X machine so it can be built and emulated.

> Note: If you are using VSCode you can use <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>R</kbd> and type `remote` to run the iOS remote emulate target.

## Running on Hardware ##

Before running on a device you'll want to make sure it is visible via XCode (for iOS) or via `adb devices -l` (for Android) otherwise the simulator may launch instead.

    $ ionic run ios --device

## Creating a Build ##

To create build for release on the app stores, it is first a good idea to start with a clean environment to ensure that unintended changes are not picked up, the plugins and libraries are up to date, and the TypeScript code has been compiled.

    $ gulp clean
    $ npm install
    $ gulp init --scheme production
    $ ionic build ios --release

> Note: Usage of the `--scheme production` flag here will set the `debug` flag to false in the `build-vars.js` file as well as use the production scheme for `config.xml` replacements.

To create a native build for Android, it is recommended to bundle the [Crosswalk webview](https://crosswalk-project.org/documentation/cordova.html) for better performance.

Luckily this extra task is handled by the `--prep android` flag when running the `init` task.

````
$ gulp clean
$ npm install
$ gulp init --scheme production --prep android
$ ionic build android --release
````

Native build artifacts will be located in the `platforms/<platform name>` directory and an unpacked Chrome extension will be located in the `chrome` directory.
