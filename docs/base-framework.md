# Overview

The starter project comes with a suggested starting point for a framework. This section will cover its features.

It is important to note that this starter project is not actually a framework. See [Framework vs Starter Project](index.md#framework-vs-starter-project) for the distinction.

The base namespace used is `JustinCredible.SampleApp`. To switch this to your own namespace you can perform a project find and replace.

# Build Schemes

The project is setup so that builds can be made for different environments. This is useful for easily switching between development, staging, or production environments for example.

A build scheme consists of a boolean debug flag as well as a collection of variables that are used to replace values in configuration files. These builds schemes are located in the `schemes` node at the top of the `config.master.xml` file:

```
<schemes default="localdev">

	<!-- Used during development. -->
	<scheme name="development" debug="true">
	  <replacement target="API_URL" value="http://development.your-company.com/api"/>
	  <replacement target="API_VERSION" value="v1"/>
	</scheme>
	
	<!-- Used during QA. -->
	<scheme name="staging" debug="true">
	  <replacement target="API_URL" value="http://development.your-company.com/api"/>
	  <replacement target="API_VERSION" value="v1"/>
	</scheme>
	
	<!-- Used for release builds. -->
	<scheme name="production" debug="false">
	  <replacement target="API_URL" value="http://www.your-company.com/api"/>
	  <replacement target="API_VERSION" value="v1"/>
	</scheme>

</schemes>
```

The `gulp config` task (see [here](gulp-tasks.md#gulp-config)) takes this scheme information and generates configuration files based on their master files by performing variable replacement. The scheme to use is specified using the `--scheme` flag (for example, `gulp config --scheme staging`).

The config task will use `config.master.xml` and `www/index.master.html` to create `config.xml` and `www/index.html` respectively.

So for example, if running `gulp config --scheme staging` the following configuration chunk from `config.master.xml`:

```
<preference name="apiUrl" value="${API_URL}"/>
<preference name="apiVersion" value="${API_VERSION}"/>
```

would result in the following variable replacement to `config.xml`:

```
<preference name="apiUrl" value="http://development.your-company.com/api"/>
<preference name="apiVersion" value="v1"/>
```

In addition to generating configuraiton files from master files, this task will also take care of creating the `www/js/build-vars.js` file. This file will contain the debug flag as well as all of the preference nodes from `config.xml`.

# Boot Sequence

Cordova uses the the `src` attribute of the content element from `config.xml` to determine the initial page to load, which is set to `index.html` by default.

The `index.html` file has static references to all of the CSS and JavaScript files to load. In addition to the main application bundle (`www/js/bundle.js`) the page also references the first level boot loader: `www/js/boot1.js`. This file is responsible for executing any code before Cordova's JS API, Ionic, or Angular have been initialized. It then kicks off the second level boot loader by invoking `JustinCredible.SampleApp.Boot2.main()`.

The second level boot loader is located at `src/Framework/Boot2.ts` (which is compiled into `www/js/bundle.js`). The second level boot loader is responsible for initializing Ionic after the Cordova JavaScript ready event occurs. This is where you would configure Angular services and modules.

The second level boot loader takes care of registering filters, directives, controllers, and services automatically using a helper (`src/Framework/BootHelper.ts`). It does so by examining the applicable namespaces (eg `JustinCredible.SampleApp.Filters`, `JustinCredible.SampleApp.Services`, etc). More details are provided in the applicable sections. The second level boot loader also takes care of setting up the Angular routes using the `src/Application/RouteConfig.ts` file.

After initializing and configuring Angular, the second level boot loader then delegates to the `start()` method of the application service located in `src/Application/Application.ts`.

The application service is where the bulk of your low-level application specific code should be located (ie device events, global event handlers, push notification handlers etc). It takes care of pushing the user to the initial view.

# Views

A view or screen in your application will consist of an HTML Angular template, an Angular controller, a view model, and optionally, CSS styling.

A view is registered in the `src/Application/RouteConfig.ts` file by specifying the path to its template, the ID of its controller, and its URL and state name:

```
// A shared view used between categories, assigned a number via the route URL (categoryNumber).
$stateProvider.state("app.category", {
    url: "/category/:categoryNumber",
    views: {
        "root-view": {
            templateUrl: "Views/Category/Category.html",
            controller: Controllers.CategoryController.ID
        }
    }
});
```

In most simple Angular examples you'll find that templates, controllers, and view models are often located in seperate directories. While this is nice for a simple application, in larger applications it is burden to track down each of the files. This starter project instead groups the files by feature rather than function.

For example, you'll find all of the files applicable to the category view located at `src/Views/Category`:

![](img/base-framework-view-layout.png)

## Controllers

Every controller in your application should extend the provided `BaseController` class and specify the type of view model for the view:

```
namespace JustinCredible.SampleApp.Controllers {

    export class CategoryController extends BaseController<ViewModels.CategoryViewModel> {

        //#region Injection

        public static ID = "CategoryController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$stateParams"
                Services.Utilities.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private $stateParams: ICategoryStateParams,
            private Utilities: Services.Utilities) {
            super($scope, ViewModels.CategoryViewModel);
        }

        //#endregion

        //#region BaseController Events

        protected view_beforeEnter(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
            super.view_beforeEnter(event, eventArgs);

            // Set the category number into the view model using the value as provided
            // in the view route (via the $stateParameters).
            let label = this.Utilities.format("Category: {0}", this.$stateParams.categoryNumber);
            this.viewModel.categoryLabel = label;
        }

        //#endregion
    }
}

```    

!!! note
	If your view does not have a view model you can use the provided `EmptyViewModel` class.

The services to be injected into the controller are controlled via the static `$inject` property. These IDs are used to located the services to be injected into the contructor.

The constructor receives these parameters and can save off the services to the local instance. TypeScript allows the `private` keyword in the constructor to indicate that the parameters should be accessible as private instance variables.

And finally, the base events avaiable from the `BaseController` can be overridden. These include several events exposed by Ionic:

* `view_loaded`
* `view_enter`
* `view_leave`
* `view_beforeEnter`
* `view_beforeLeave`
* `view_afterEnter`
* `view_afterLeave`
* `view_unloaded`
* `destroy`

## View Model

The view model specified is accessible in the template via the `viewModel` property:

```
<ion-view view-title="Category {{viewModel.categoryNumber}}">
```

## View Events

To access an event on your controller, you should make your event `protected`:

```
protected button1_click(event: ng.IAngularEvent): void {
   ...
}
```

and access them using the `controller` property:

```
<button ng-click="controller.button1_click($event)">Click Me!</button>
```

# Directives

Angular directives are located in the `src/Directives` directory. There are two types of directives in this starter project; standard and element instance directives.

## Standard Directive

A standard directive is simply a class that has a link function.

An example of a standard directive can be found in `src/Directives/OnLoadDirective.ts`. This directive can be used by placing an `on-load` attribute on an image element and will cause a function to be fired when the image has loaded. For example:

```
<img src="..." on-load="controller.image1_load()">
```

## Element Instance Directive

The optional `BaseElementDirective` class provides a recommendation on how to build element directives. This base class provides an `initialize` and `render` methods which should be overridden in your implementation.

Build element directives with this base class is useful for elements that need to maintain state, fire events, or otherwise act as accessible instances from your controller.

An example directive that can be used to show an icon with text is located at `/src/Directives/Icon-Panel/IconPanelDirective.ts` and is used from the category controller.

# Filters

Angular filters are located in the `src/Filters` directory. To be registered as a filter, its class should exist the `JustinCredible.SampleApp.Filters` namespace. It should contain a unique static ID property and a single static filter named `filter` in order to be registered automatically.

```
namespace JustinCredible.SampleApp.Filters {

    export class ThousandsFilter {

        public static ID = "Thousands";

        public static filter(input: number): string {
           ...
        }
    }
}    
```

# Services

Angular services are located in the `src/Services` directory. To be registered as a service, its class should exist in the `JustinCredible.SampleApps.Service` namespace. It should contain a unique static ID property in order to be registered automatically.

```
namespace JustinCredible.SampleApp.Services {

    /**
     * Provides a common set of helper/utility methods.
     */
    export class Utilities {

        //#region Injection

        public static ID = "Utilities";

        public static get $inject(): string[] {
            return [
                MyService.ID,
                Preferences.ID
            ];
        }

        constructor(
            private MyService: MyService,
            private Preferences: Preferences) {
        }

        //#endregion

        public someMethod(): void {
		     this.MyService.doSomething();
        }
    }
}    
```

!!! note
	If the class contains a static `getFactory` method it will be registered as a factory instead of a service.

## Provided Services

The following services are provided with this sample project.

### Configuration

Contains configuration values, including a reference to the build variables from the `www/js/build-vars.js` file.

### FileUtilities

A set of helper methods for working with Cordova's file plugin.

### HttpInterceptor

A special factory for intercepting all HTTP requests. It is responsible for showing a progress indicator (via the [NProgress](http://ricostacruz.com/nprogress/) library) for asynchronous requests or a full screen spinner for blocking requests.

It also takes care of expanding URLs starting with a tilde to have the URL defined by `config.xml`'s `ApiUrl` property prepended to it (eg `~/Products/123` would be expanded to `http://your-server.com/path/Products/123` for example).

It is also responsible for adding headers (such as API keys) or otherwise modifying the requests before they go out.

### Logger

Used to handle logging requests of various levels (eg `info`, `warn`, `error`, etc).

The provided implementation delegates to the applicable `console` methods and stores log in memory (which can be viewed via the [Developer Tools view](#Developer-Tools), but a production implementation could send logs to your servers.

### MockHttpApis

Used to provide mock implementations for HTTP request data. This is useful for demos, development, or testing.

Mock API mode is enabled via the developer tools view.

### MockPlatformApis

Used to provide mock implementations of APIs that are native to certain platforms. This allows the developer to mock up APIs which may not be available in the browser for example.

This is mainly used by the plugins service.

### Plugins

Used as a facad to access native Cordova plugins. If a plugin is not available on the given platform it will delegate to `MockPlatFormApis` to obtain a mock implementation.

### Preferences

Used to store user preferences which should be persisted when the application has closed. The default backing store is the web view's local storage (which is sandboxed and specific to your application instance).

### UiHelper

Contains several helper methods for user interface related tasks. This includes alert, confirm, and prompt dialogs as well as a PIN dialog.

It also includes a generic API to show your own custom dialogs. See [Dialogs](#dialogs) for more information.

### Utilities

Contains several helper methods for working with strings, determining device information, type introspection, and any other utility method.

# PIN Entry

The sample project includes a PIN entry dialog that the user can enable via the Settings view.

After the application is in the background for more than 10 minutes, the user specified PIN must be entered to use the application.

# Developer Tools

In a debug build, the Developer Tools view will be accessible from the Settings view. The Developer Tools can also be enabled by tapping the application icon in the About view 10 times.

This view is a good location for items that are used during development. By default it allows the user to toggle mock HTTP mode, test various plugins, view logs logged by the Logger service, and view device information.

# Dialogs

Ionic provides the `$ionicModal` service which can be used to show modal dialogs. This sample project includes the `BaseDialogController` base class and a `UiHelper` method `showDialog()` which are used to simplify usage and normalize dialog behavior.

Two example dialogs are included with this sample project and are located at `src/Views/Dialogs`.

The `showDialog` method wraps Ionic's modal implementation. It should be invoked with the ID of the controller for the dialog and optional dialog options. It returns a promise that is resolved once the dialog has been closed.

```
this.UiHelper.showDialog(PinEntryController.ID, options)
	.then((result: Models.PinEntryDialogResultModel) => {

	// Dialog closed with result object.
});
```

To create a dialog you first need to create a template with the modal class and beans and the `ng-controller` attribute to specify the ID of your dialog's controller:

```
<div class="modal" ng-controller="PinEntryController">
```

Then you'll need to create a controller that extends `BaseDialogController`. If you examine the base class you'll see that it requires three templated types:

```
export class BaseDialogController<V, D, R> extends BaseController<V> { ... }
```

* `V` - view model that will be used in the dialog's template and controller.
* `D` - object that is passed into the dialog via the options parameters when opening the dialog.
* `R` - object that is used to resolve the promise when the dialog is closed.

For example, the PIN entry dialog itself works with `PinEntryViewModel` (`V`). It receives `PinEntryDialogModel` as its input (`D`) and when it closes it returns `PinEntryDialogResultModel` (`R`):

```
export class PinEntryController
	extends BaseDialogController<ViewModels.PinEntryViewModel, Models.PinEntryDialogModel, Models.PinEntryDialogResultModel> {
	...
}	
```

!!! note
	Each of these types are optional, and not all dialogs will require all three types. For any types you do not wish to specify you can pass `any` or `ViewModels.EmptyViewModel`.

If you examine the sample dialogs you'll see that the base class provides two events that are fired when the dialog opens and closes (`dialog_shown` and `dialog_hidden` respectively).

Also there are two helper methods provided. The first `getData()` is used to grab the model object that was used to open the dialog (templated type `D`). The second `close()` used to close the dialog. You can optionally pass an object of type `R` to the close method which will be returned to the opener via the promise result.

# Popover

While this starter project does not contain a specific structure for Ionic's popover view, you can see an example of one being used on Develper Tools > Logs view.

A popover is generally initialized via the `view_beforeEnter` event by specifying the path to the HTML template an the scope (which can be the same scope as the current controller). The popover can later be shown by invoking its `show()` method:

```
    protected view_beforeEnter(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
        super.view_beforeEnter(event, eventArgs);

        this.$ionicPopover.fromTemplateUrl("Views/Settings/Logs-List/Log-Filter-Menu.html", {
            scope: this.scope
        }).then((popover: any) => {
            this._popover = popover;
        });
    }

    protected filter_click(event: ng.IAngularEvent) {
        this._popover.show(event);
    }
}  
```

If the popover is sharing the same scope, the view model and controller can be accessed in the same way as a [standard controller](#controllers) by using the `viewModel` and `controller` keywords.