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

# Filters

# Services

# Logging

# Mock HTTP APIs

# HTTP Interceptor

`//TODO; API keys, spinner, full block spinner, logger; ~ leading URL`

# Mock Platform APIs

# Dialogs

# Popover