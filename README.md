Ionic-TypeScript-Starter
=============================

This is a sample application that I use as a skeleton when bootstrapping new mobile applications.

It utilizes the [Ionic](http://ionicframework.com/) framework to achieve a user interface that feels like a native application. The Ionic framework in turn utilizes [AngularJS](https://angularjs.org/).

The application is written primarily in [TypeScript](http://www.typescriptlang.org/) which brings object oriented paradigms, type-safety, compile-time checking, and IDE tooling (refactoring! code completion! huzzah!).

This project is IDE and platform agnostic. I recommend using the free and lightweight [Visual Studio Code](https://www.visualstudio.com/products/code-vs) editor as it has superb support for TypeScript.

In-browser development and debugging is possible via the [Apache Ripple](http://ripple.incubator.apache.org/) emulator. When deployed to a physical device, the application runs in the [Cordova](http://cordova.apache.org/) application container.

Applications created with this starter project can target iOS, Android, Windows, and Chrome (as an extension).

Screenshots can be found on the project page [here](http://www.justin-credible.net/Projects/Ionic-TypeScript-MDHA-Starter).

*If you are looking for a version of this project that uses the full Visual Studio IDE and the Apache Cordova project template, you can check out it's sister project: [Ionic-TypeScript-MDHA-Starter](https://github.com/Justin-Credible/Ionic-TypeScript-MDHA-Starter).*

## Libraries Used ##

The following is a list of JavaScript libraries that are included.

* [Ionic](http://ionicframework.com/)
* [AngularJS](https://angularjs.org/)
* [lodash](http://lodash.com/)
* [Moment.js](http://momentjs.com/)
* [NProgress.js](http://ricostacruz.com/nprogress/)
* [URI.js](http://medialize.github.io/URI.js/)

The following is a list of Cordova plug-ins that are used:

* cordova-plugin-device
* cordova-plugin-console
* cordova-plugin-whitelist
* cordova-plugin-splashscreen
* cordova-plugin-file
* cordova-plugin-dialogs
* com.ionic.keyboard
* [nl.x-services.plugins.toast](https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin)
* [com.verso.cordova.clipboard](https://github.com/VersoSolutions/CordovaClipboard)
* [org.pbernasconi.progressindicator](https://github.com/pbernasconi/cordova-progressIndicator)

## Getting Started ##

The following prerequisites are required (I've listed the versions of the packages I've tested with):

* [Node.js](https://nodejs.org/) (0.10.28)
* Cordova (5.0.0)
* Ionic (1.4.5)
* TypeScript (1.5.0-beta)
* Bower (1.4.1)
* bower-installer 1.2.0
* tsd (0.6.0-beta.5)

These prerequisites can be installed using the following npm commands once Node.js is installed:

	$ npm install -g cordova
	$ npm install -g ionic
	$ npm install -g typescript
	$ npm install -g bower
	$ npm install -g bower-installer
	$ npm install -g tsd

If you want to run on a emulator or physical device, you'll need your environment setup for iOS or Android development.

After the dependencies are installed, clone the respository and initialize the node packages:

	git clone https://github.com/Justin-Credible/Ionic-TypeScript-Starter.git
	cd Ionic-TypeScript-Starter
	npm install

Now you can use the various gulp tasks to obtain Cordova plugins, install third party libraries via Bower, download TypeScript definition files and compile the TypeScript code.

	$ gulp libs
	$ gulp plugins
	$ gulp tsd
	$ gulp ts

If you want to create a build to run on an emulator, you'll need to add a platform before you start the emulator:

	$ ionic platform add ios
	$ ionic emulate

## Development ##

Development is typically done in your web browser using the Apache Ripple emulator. I recommend installing the [Chrome plugin](https://chrome.google.com/webstore/detail/ripple-emulator-beta/geelfhphabnejjhdalkjhgipohgpdnoc) before continuing.

From the project directory, if you execute `ionic serve` Ionic will start a lightweight web server to host the contents of the `www` directory and then open your default browser.

If Ionic detects any changes to files in the `www` directory the browser will be refreshed with the latest changes. Therefore you can make a change to a TypeScript file and once saved, the compilation will occur and update the `www` directory, thereby refreshing the browser.

The project has been written to work well with the Ripple emulator; while in the browser several device only features (toast notifications, clipboard access, dialogs) will be mocked up and replaced with versions that will work on the browser. For example, the Ionic dialogs will be used in the emulator, but the native OS dialogs will be used when running on the device.

This is taken care of via the `RippleMockApi.js` and `MockApis.ts` files.

## Debugging ##

Debugging is done via the browser's F12 / developer tools. The source maps are copied into the `www/js/src` directory at TypeScript build time, so they are available for setting breakpoints etc.

If running in an iOS simulator, you can use Safari's development tools (Develop > iOS Simulator > index.html). If you are running in an Android environment you can use Chrome's development tools (chrome://inspect).

If you are using Visual Studio Code, the default build task will run `gulp ts`. TypeScript compilation errors will show up in the error pain, and TypeScript lint errors (from `gulp lint`) will show up in the warnings pane.

I've found it useful to bind `command+shift+r` to `workbench.action.tasks.runTask` which allows for quick access to run any of the gulp tasks.

## Building as a Chrome Extension ##

The `gulp chrome` task can be used to build the application as a Chrome extension.

After the task has completed, the extension can be loaded into Chrome using the `chrome://extensions` URL and enabling development mode. The extension payload will be located in the `chrome` directory.

## Basic Functionality ##

The application uses a left slide out menu for navigation (which is visible all the time when in tablet mode and only visible on demand on phones).

Four sample views are provided called "categories". These would be the main views for your application. The views can be re-ordered via the "Reorder Categories" menu item. The order is stored as a user preference. Finally, the settings view provides access to user configuration.

The "Cloud Sync" view is used to demonstrate an example directive.

The "Configure PIN" view allows the user to setup a PIN. This PIN will be prompted for when resuming the application after it has been in the background for 10 minutes.

The "Logs" view provides a list of log entries. Logs can be written to device storage or store only in memory. The log entry view allows the user to view the date/time, message, and stack trace (if applicable). They can also optionally copy the data to the device's clipboard or e-mail it.

Log entries are written when there are global JavaScript exceptions or exceptions within an Angular digest cycle. HTTP requests can also be logged, which can optionally include the full request/response body, which is useful for debugging.

The "Development Tools" view houses several options that are useful during development. It is described below.

The "About" view shows the application name, build timestamp, and version number, among other things.

## Development Tools ##

The "Development Tools" view is available via the settings menu and houses several options that are useful during development. It is only available when the build mode is "debug" or if the application is placed into the developer mode. This mode can be activated by tapping the icon on the about screen 10 times.

It can be used to enable the Mock API mode (described below), change the logging mode, test dialogs and/or toast notifications, and get information about the platform.

## HTTP API Requests ##

A custom HTTP Interceptor is provided via `HttpInterceptor.ts`. It is responsible for several things:

1. Keeps track of outgoing requests
2. Handles showing of the NProgress activity bar at the top of the screen (optional)
3. Handles blocking the UI with a message/spinner (optional)
4. Handles setting HTTP headers (such as authorization token, API, version, content type etc)
5. Handles pre-pending the base API URL to the URL
6. Handles logging HTTP requests
7. Broadcasts events for certain status codes (eg 401, 403, 404) so the application can handle them

The interceptor will respect the flags specified via the `IRequestConfig` interface.

    var httpConfig: Interfaces.IRequestConfig;

    httpConfig = {
        method: "GET",
        url: "~/some-resource/123",
        data: null,
        blocking: true,
        blockingText: "Please Wait..."
    };

    this.$http(httpConfig).then((response: ng.IHttpPromiseCallbackArg<DataTypes.ISomeResource>) => {
        // Got my strongly typed response object!
    });

### Mock APIs / Demo Mode ###

The development tools can be used to enable the "Mock API" mode. In this mode all HTTP API requests will never leave the device and can be configured to return specific values.

This is useful for quick debugging without a backend or testing on devices without setting up a wi-fi connection etc.

The responses for the HTTP requests are defined in the `mockHttpCalls` method in `MockApis.ts`. 

## Project Structure ##

The file layout is mostly self describing via the directory names. All of the application code is located in the `src` directory, with sub-directories for controllers, directives, view models, services, etc.

The `www` directory contains the files that will be packaged into the application. This is where the root `index.html` page is located, as well as all of the Angular templates. The `www/js` directory contains a `Main.js` bootstrap and will contain the compiled TypeScript in `bundle.js`.

`Application.ts` is the main file that sets up and describes the application. It is responsible for setting up Ionic/Angular and registering the controllers, directives, routes, etc. It also takes care of device level events and handling exceptions.

The `gulp ts` task will compile the TypeScript and bundle it all into a single file located at `www/scripts/appBundle.js`. A source map will be generated and all of the TypeScript source will be copied to `www/js/src` so it can be referenced when debugging.

Third party JavaScript libraries are managed using Bower (see `bower.json`). The `gulp libs` task will take care of downloading the libraries to `bower_components` and then delegate to `bower-installer` to copy the needed files to the `www/lib` directory.

#### TypeScript ####

One thing that is slightly different from normal Ionic/Angular development is the obvious addition of TypeScript. There are base classes for controllers and directives, and all of the view models, models, services etc are strongly typed.

If you are used to declaring controllers and directives inline and using closures to share data, this will require a bit of adjustment. I've included a sample directive and there are several controllers extending BaseController which can be used as examples.

Injection for controllers is done by setting a public static variable named `$inject`:


    export class MenuController extends BaseController<ViewModels.MenuViewModel> implements IMenuController {
    
		// Specify the things to inject.
    	public static $inject = ["$scope", "$location", "$http", "Utilities"];
    
		// This is where we'll store the injected things.
	    private $location: ng.ILocationService;
	    private $http: ng.IHttpService;
	    private Utilities: Services.Utilities;
    
		// The constructor receives the injected arguments in the same order as the $inject variable.
	    constructor($scope: ng.IScope, $location: ng.ILocationService, $http: ng.IHttpService, Utilities: Services.Utilities) {
		    super($scope, ViewModels.MenuViewModel);
		    
			// Save off a reference to the injected things.
		    this.$location = $location;
		    this.$http = $http;
		    this.Utilities = Utilities;
	    }
	}


### Utilities ###

The `Utilities.ts` file defines a `Utilities` service which provides several convenience methods for checking the device version, build mode (debug vs release), application version numbers.

It also includes helpers for manipulating strings (`startsWith`, `endsWith`, `format`), creating GUIDs, and working with the clipboard.

### UI Helper ###

The `UiHelper.ts` file defines a `UiHelper` service which provides several methods for working with the UI.

Any accessors for native plug-ins will be exposed here (eg toast and progress indicator). Exposing plug-ins via this service makes it easier to write unit tests, as all code will use these accessors instead of global variables like `window.plugins.toast`.

It also provides helpers to show native dialogs via alert/prompt/confirm when running on a device, or via `$ionicPopup` when running in Ripple.

Finally, it provides a `showDialog` helper for working with dialogs.

### File Utilities ###

Cordova's file system API required a few too many callbacks to do simple file I/O, so I created a bunch of helper methods in `FileUtilities.ts`. There are helps to list files and directories, as well as create, delete, and append to files, among others.

### Responsive Design ###

The `devices.css` stylesheet includes several classes that make it easy to hide or show elements based on the device orientation or screen size. For example, `landscape` and `portrait` as well as more specific classes such as `phone-landscape` or `tablet-portrait`.

### Dialogs ###

The `UiHelper`'s `showDialog` method makes it easy to work with dialogs. Internally, it delegates to Ionic's `$ionicModal` service.

All dialogs controllers should extend the BaseDialogController and be opened using the `showDialog` method. Doing so makes the dialog eventing consistent and makes it easier to pass data in and out of dialogs without adding lots of closures in surrounding code.

	/**
	 * ...
	 * V - The type of the view model that this controller will utilize.
	 * D - The type of data object that will be passed in when this dialog is opened.
	 * R - The type of the data object that will be returned when this dialog is closed.
	 */
	export class BaseDialogController<V, D, R> extends BaseController<V>

There are two sample dialogs provided; one for PIN entry and one for re-ordering categories.

## License ##

Copyright © 2015 Justin Unterreiner.

Released under an MIT license; see [LICENSE](https://github.com/Justin-Credible/Ionic-TypeScript-Starter/blob/master/LICENSE) for more information.
