# Overview

This section will cover the `src` directories and its children.

The `src` directory contains the bulk of the source code for your application. This includes TypeScript source, SASS styling, and Angular HTML templates.

TypeScript files are compiled using the internal module system using the `namespace` keyword for internal namespacing. The result is that all TypeScript file output will be bundled into a single file. This allows us to avoid having to use a module loader at runtime.

In most example Angular applications you'll commonly see separate directories for each component (eg controllers, views, models, services etc). While this is nice for tutorials and small applications, it is not ideal for applications that contain a large number of files.

Instead, this project groups files by feature rather than type. So instead of having to look in multiple directories for all of the files applicable for a given view, you'll be able to find all applicable files in the same location.

!!! note "Note about namepsaces"
	As you explore the directory structure you'll notice that the namespaces and directory paths do not match as they would in other languages (Java for example).

	Instead we use directories for grouping files by feature and namespaces for determining the behavior of a given file.

	For example, a class in the `Controllers` namespace will be treated as an Angular controller. Instead of placing it in a controllers directory it can be placed in the same directory as the view model and template to which it belongs.

## tsconfig.json

This file controls parameters passed to the TypeScript compiler and is used when running the `gulp ts` task or building from within VS Code.

## tsd.d.ts _(generated)_

This file contains references to all of the [TypeScript definition](http://www.typescriptlang.org/Handbook#writing-dts-files) files from the [DefinitelyTyped](http://definitelytyped.org/) repository.

These are installed by the `tsd` tool via the `gulp tsd` task. The definition files that are downloaded are specified in `tsd.json`.

!!! warning
	This file will be removed when executing the `gulp clean` or `gulp clean:tsd` tasks and should not be committed to source control.

## _references.ts

This file is used to reference TypeScript files so the compiler knows where to look during compilation. However, if you open the file you'll notice that it does not reference all of the files.

The `gulp ts` task uses the TypeScript compiler's `-p` option to point at the `src` directory for compilation. When using this flag we don't need to maintain a `_references.ts` file with paths to all of the files.

However the file is still useful when we are using internal modules as it allows us to control the order that the JavaScript output is emitted into the bundle file.

We need to do this for specific classes that are base classes (so that at runtime these are loaded before any descendant classes).

It is unlikely that you'll need to edit this file unless you add more base classes.

# Framework

The framework directory contains components that make up the "framework" for your application. This includes base classes as well as the second level boot loader.

## src/Framework/Boot2.ts

This is the second level boot loader whose purpose is to initialize Angular and Ionic. This involves declaring the root Angular module as well as registering Angular components (such as controllers, services, directives, and filters). This is where the Angular run and config functions live.

The second level boot loader's `boot()` method is invoked from the first level boot loader (`www/js/boot1.js`). After it finishes, it then delegates to the `start()` method in the `src/Application/Application.ts` file.

## Framework/BootHelper.ts

This contains helper methods for use by the second level boot loader such as controller or service registration etc.

## Framework/BaseController.ts

This is a base class that should be used by all of the Angular controllers.

See [Base Framework: Controllers](base-framework.md#controllers) for more information.

## Framework/BaseDialogController.ts

This is a base class that should be used by all of the Angular controllers used for Ionic modal dialogs.

See [Base Framework: Dialogs](base-framework.md#dialogs) for more information.

## Framework/BaseElementDirective.ts

This is a base class that should be used by all of the Angular directives that are for elements.

See [Base Framework: Directives](base-framework.md#directives) for more information.

## Framework/DialogOptions.ts

This is an model object used to pass data and set options for Ionic modal dialogs.

See [Base Framework: Dialogs](base-framework.md#dialogs) for more information.

## Framework/EmptyViewModel.ts

This is an empty view model class used for controllers that do not need a view model.

# Application

The application directory contains code specific to your application that is not tied to specific views.

## Application/Application.ts

This contains the main class for your application. Its `start()` method is invoked by the second level boot loader.

Here you can subscribe to device events (eg pause, resume) or configure Cordova plugins when your application starts.

This is a good place to put logic that doesn't correspond to any of your view specifically. For example, exception handlers or push notification handlers.

This project uses the `device_resume` method to determine the initial view the user should be placed on.

## Application/Constants.ts

This file contains a static namespace housing constants for use throughout your application.

## Application/RouteConfig.ts

This file contains a single, static method named `setupRoutes(...)` which is delegated to from the second level boot loader.

It is responsible for defining up all of the Angular routes by specifying the controller and view to use for each route.

# Filters

This is where all of your [Angular filters](https://docs.angularjs.org/guide/filter) should live.

An example filter is provided with the sample project. A filter should be a class with a static `filter` method.

See [Base Framework: Filters](base-framework.md#filters) for more details.

# Directives

This is where all of your [Angular directives](https://docs.angularjs.org/guide/directive) should live.

Two example directives are provided with the sample project; one is a simple directive (extending `ng.IDirective`) and one is an element directive (extending `BaseElementDirective`).

See [Base Framework: Directives](base-framework.md#directives) for more details.

# Models

This is where you can store model objects that are shared across multiple areas or services in your application (not view models, for example).

# Services

This is where all of your [Angular services](https://docs.angularjs.org/guide/services) sholud live.

There are several services provided with the sample project; see [Base Framework: Services](base-framework.md#services) for more details.

# Styles

This is where you should store your common or shared SASS styles. The `Index.scss` file is used to reference all of the SASS files to be compiled.

Styles that are specific to a view should be co-located in the appropriate view directory.

See `gulp sass` in [Gulp Tasks](gulp-tasks.md#gulp-sass) for more details.

# Views

This directory should contain all of your controllers, view models, templates, and styles for each view.

The default layout uses a directory for each view which contains its controller, view model, template and styling.

Each controller should extend `BaseController` or `BaseDialogController`.

See `gulp templates` and `gulp sass` in [Gulp Tasks](gulp-tasks.md#gulp-templates) and [Base Framework: Views](base-framework.md#views) for more details.