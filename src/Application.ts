
module JustinCredible.SampleApp.Application {

    //#region Variables

    /**
     * The root Angular application module.
     */
    var ngModule: ng.IModule;

    /**
     * Used to hold references to several of the Angular-injected services for use within
     * this local scope. These references are populated in angular_initialize().
     */
    var services: {
        $rootScope: ng.IRootScopeService,
        $location: ng.ILocationService,
        $ionicHistory: any,
        Utilities: Services.Utilities,
        UiHelper: Services.UiHelper,
        Preferences: Services.Preferences,
        Configuration: Services.Configuration,
        MockHttpApis: Services.MockHttpApis,
        Logger: Services.Logger
    };

    /**
     * Indicates if the PIN entry dialog is currently being shown. This is used to determine
     * if the device_pause event should update the lastPausedAt timestamp (we don't want to
     * update the timestamp if the dialog is open because it will allow the user to pause
     * and then kill the app and bypass the PIN entry screen on next resume).
     */
    var isShowingPinPrompt: boolean;

    //#endregion

    /**
     * This is the main entry point for the application. It is used to setup Angular and
     * configure its controllers, services, etc.
     * 
     * It is invoked via the Main.js script included from the index.html page.
     */
    export function main(): void {
        var versionInfo: Interfaces.VersionInfo;

        // Set the default error handler for all uncaught exceptions.
        window.onerror = window_onerror;

        versionInfo = {
            applicationName: "Sample App",
            copyrightInfoUrl: "https://github.com/Justin-Credible/Ionic-TypeScript-Starter/blob/master/LICENSE",
            websiteUrl: "http://www.justin-credible.net",
            githubUrl: "https://github.com/Justin-Credible",
            email: "justin.unterreiner@gmail.com",
            majorVersion: window.buildVars.majorVersion,
            minorVersion: window.buildVars.minorVersion,
            buildVersion: window.buildVars.buildVersion,
            versionString: window.buildVars.majorVersion + "." + window.buildVars.minorVersion + "." + window.buildVars.buildVersion,
            buildTimestamp: window.buildVars.buildTimestamp
        };

        // Define the top level Angular module for the application.
        // Here we also specify the Angular modules this module depends upon.
        ngModule = angular.module("JustinCredible.SampleApp.Application", ["ui.router", "ionic", "ngMockE2E"]);

        // Define our constants.
        ngModule.constant("isRipple", !!(window.parent && window.parent.ripple));
        ngModule.constant("isCordova", typeof(cordova) !== "undefined");
        ngModule.constant("buildVars", window.buildVars);
        ngModule.constant("isChromeExtension", typeof (chrome) !== "undefined" && typeof (chrome.runtime) !== "undefined" && typeof (chrome.runtime.id) !== "undefined");
        ngModule.constant("versionInfo", versionInfo);
        ngModule.constant("apiVersion", "1.0");

        // Register the services, directives, filters, and controllers with Angular.
        registerServices();
        registerDirectives();
        registerFilters();
        registerControllers();

        // Specify the initialize/run and configuration functions.
        ngModule.run(angular_initialize);
        ngModule.config(angular_configure);
    }

    //#region Helpers

    /**
     * Used construct an instance of an object using the new operator with the given constructor
     * function and arguments.
     * 
     * http://stackoverflow.com/a/1608546/4005811
     * 
     * @param constructor The constructor function to invoke with the new keyword.
     * @param args The arguments to be passed into the constructor function.
     */
    function construct(constructor, args) {
        function F(): void {
            return constructor.apply(this, args);
        };
        F.prototype = constructor.prototype;
        return new F();
    }

    /**
     * Used to register each of the services that exist in the Service namespace
     * with the given Angular module.
     */
    function registerServices(): void {
        // Register each of the services that exist in the Service namespace.
        _.each(Services, (Service: any) => {
            // A static ID property is required to register a service.
            if (Service.ID) {
                if (typeof(Service.getFactory) === "function") {
                    // If a static method named getFactory() is available we'll invoke it
                    // to get a factory function to register as a factory.
                    console.log("Registering factory " + Service.ID + "...");
                    ngModule.factory(Service.ID, Service.getFactory());
                }
                else {
                    console.log("Registering service " + Service.ID + "...");
                    ngModule.service(Service.ID, Service);
                }
            }
        });
    }

    /**
     * Used to register each of the directives that exist in the Directives namespace
     * with the given Angular module.
     */
    function registerDirectives(): void {

        _.each(Directives, (Directive: any) => {
            if (Directive.ID) {
                if (Directive.__BaseElementDirective) {
                    console.log("Registering element directive " + Directive.ID + "...");
                    ngModule.directive(Directive.ID, getElementDirectiveFactoryFunction(Directive));
                }
                else {
                    ngModule.directive(Directive.ID, getDirectiveFactoryParameters(Directive));
                }
            }
        });
    }

    /**
     * Used to register each of the filters that exist in the Filters namespace
     * with the given Angular module.
     */
    function registerFilters(): void {

        _.each(Filters, (Filter: any) => {
            if (Filter.ID && typeof(Filter.filter) === "function") {
                console.log("Registering filter " + Filter.ID + "...");
                ngModule.filter(Filter.ID, getFilterFactoryFunction(Filter.filter));
            }
        });
    }

    /**
     * Used to register each of the controllers that exist in the Controller namespace
     * with the given Angular module.
     */
    function registerControllers(): void {

        // Register each of the controllers that exist in the Controllers namespace.
        _.each(Controllers, (Controller: any) => {
            if (Controller.ID) {
                console.log("Registering controller " + Controller.ID + "...");
                ngModule.controller(Controller.ID, Controller);
            }
        });
    }

    /**
     * Used to register each of the Controller classes that extend BaseDialog as dialogs
     * with the UiHelper.
     */
    function registerDialogs(): void {

        // Loop over each of the controllers, and for any controller that dervies from BaseController
        // register it as a dialog using its ID with the UiHelper.
        _.each(Controllers, (Controller: any) => {

            // Don't try to register the BaseDialogController since it is abstract.
            if (Controller === Controllers.BaseDialogController) {
                return; // Continue
            }

            if (services.Utilities.derivesFrom(Controller, Controllers.BaseDialogController)) {
                services.UiHelper.registerDialog(Controller.ID, Controller.TemplatePath);
            }
        });
    }

    /**
     * Used to create a function that returns a data structure describing an Angular directive
     * for an element from one of our own classes implementing IElementDirective. It handles
     * creating an instance and invoked the render method when linking is invoked.
     * 
     * @param Directive A class reference (not instance) to a element directive class that implements Directives.IElementDirective.
     * @returns A factory function that can be used by Angular to create an instance of the element directive.
     */
    function getElementDirectiveFactoryFunction(Directive: Directives.IElementDirectiveClass): any[] {
        var params = [],
            injectedArguments: IArguments = null,
            descriptor: ng.IDirective = {};

        /* tslint:disable:no-string-literal */

        // If the directive is annotated with an injection array, we'll add the injection
        // array's values to the list first.
        if (Directive["$inject"]) {
            params = params.concat(Directive["$inject"]);
        }

        // Here we set the options for the Angular directive descriptor object.
        // We get these values from the static fields on the class reference.
        descriptor.restrict = Directive["restrict"];
        descriptor.template = Directive["template"];
        descriptor.replace = Directive["replace"];
        descriptor.transclude = Directive["transclude"];
        descriptor.scope = Directive["scope"];

        /* tslint:enable:no-string-literal */

        if (descriptor.restrict !== "E") {
            console.warn("BaseElementDirectives are meant to restrict only to element types.");
        }

        // Here we define the link function that Angular invokes when it is linking the
        // directive to the element.
        descriptor.link = (scope: ng.IScope, instanceElement: ng.IAugmentedJQuery, instanceAttributes: ng.IAttributes, controller: any, transclude: ng.ITranscludeFunction): void => {

            // New up an instance of the directive for to link to this element.
            // Pass along the arguments that were injected so the instance can receive them.
            var instance = <Directives.BaseElementDirective<any>>construct(Directive, injectedArguments);

            /* tslint:disable:no-string-literal */

            // Set the protected properties.
            instance["scope"] = scope;
            instance["element"] = instanceElement;
            instance["attributes"] = instanceAttributes;
            instance["controller"] = controller;
            instance["transclude"] = transclude;

            /* tslint:enable:no-string-literal */

            // Delegate to the initialize and render methods.
            instance.initialize();
            instance.render();
        };

        // The last parameter in the array is the function that will be executed by Angular
        // when the directive is being used.
        params.push(function () {

            // Save off a reference to the array of injected objects so we can use them when
            // constructing an instance of the directive (see above). These arguments are the
            // objects that were injected via the $inject property.
            injectedArguments = arguments;

            // Return the descriptor object which describes the directive to Angular.
            return descriptor;
        });

        return params;
    }

    /**
     * Used to create an array of injection property names followed by a function that will be
     * used by Angular to create an instance of the given directive.
     * 
     * @param Directive A class reference (not instance) to a directive class.
     * @returns An array of injection property names followed by a factory function for use by Angular.
     */
    function getDirectiveFactoryParameters(Directive: ng.IDirective): any[] {

        var params = [];

        /* tslint:disable:no-string-literal */

        // If the directive is annotated with an injection array, we'll add the injection
        // array's values to the list first.
        if (Directive["$inject"]) {
            params = params.concat(Directive["$inject"]);
        }

        /* tslint:enable:no-string-literal */

        // The last parameter in the array is the function that will be executed by Angular
        // when the directive is being used.
        params.push(function () {
            // Create a new instance of the directive, passing along the arguments (which
            // will be the values injected via the $inject annotation).
            return construct(Directive, arguments);
        });

        return params;
    }


    /**
     * Used to create a function that returns a function for use by a filter.
     * 
     * @param fn The function that will provide the filter's logic.
     */
    function getFilterFactoryFunction(fn: Function): () => Function {
        return function () { return fn; };
    }

    //#endregion

    //#region Platform Configuration

    /**
     * The main initialize/run function for Angular; fired once the AngularJs framework is done loading.
     * 
     * The parameters to this method are automatically determined by Angular's dependency injection based
     * on the name of each parameter.
     */
    function angular_initialize(
        $rootScope: ng.IScope,
        $location: ng.ILocationService,
        $ionicHistory: any,
        $ionicPlatform: Ionic.IPlatform,
        Utilities: Services.Utilities,
        UiHelper: Services.UiHelper,
        Preferences: Services.Preferences,
        Configuration: Services.Configuration,
        MockHttpApis: Services.MockHttpApis,
        Logger: Services.Logger
        ): void {

        // Save off references to the modules for use within this application module.
        services = {
            $rootScope: $rootScope,
            $location: $location,
            $ionicHistory: $ionicHistory,
            Utilities: Utilities,
            UiHelper: UiHelper,
            Preferences: Preferences,
            Configuration: Configuration,
            MockHttpApis: MockHttpApis,
            Logger: Logger
        };

        // Once AngularJs has loaded we'll wait for the Ionic platform's ready event.
        // This event will be fired once the device ready event fires via Cordova.
        $ionicPlatform.ready(function () {
            ionicPlatform_ready();
        });

        // Mock up or allow HTTP responses.
        MockHttpApis.mockHttpCalls(Configuration.enableMockHttpCalls);
    };

    /**
     * Fired once the Ionic framework determines that the device is ready.
     */
    function ionicPlatform_ready(): void {

        // Subscribe to device events.
        document.addEventListener("pause", device_pause);
        document.addEventListener("resume", device_resume);
        document.addEventListener("menubutton", device_menuButton);

        // Subscribe to Angular events.
        services.$rootScope.$on("$locationChangeStart", angular_locationChangeStart);

        // Register all of the dialogs with the UiHelper.
        registerDialogs();

        // We use this combination of settings so prevent the visual jank that
        // would otherwise occur when tapping an input that shows the keyboard.
        services.UiHelper.keyboard.disableScroll(true);
        services.UiHelper.keyboard.hideKeyboardAccessoryBar(false);

        // Now that the platform is ready, we'll delegate to the resume event.
        // We do this so the same code that fires on resume also fires when the
        // application is started for the first time.
        device_resume();
    }

    /**
     * Function that is used to configure AngularJs.
     * 
     * The parameters to this method are automatically determined by Angular's
     * dependency injection based on the name of each parameter.
     */
    function angular_configure(
        $stateProvider: ng.ui.IStateProvider,
        $urlRouterProvider: ng.ui.IUrlRouterProvider,
        $provide: ng.auto.IProvideService,
        $httpProvider: ng.IHttpProvider,
        $compileProvider: ng.ICompileProvider
        ): void {

        // Intercept the default Angular exception handler.
        $provide.decorator("$exceptionHandler", function ($delegate: ng.IExceptionHandlerService) {
            return function (exception, cause) {
                // Delegate to our custom handler.
                angular_exceptionHandler(exception, cause);

                // Delegate to the default/base Angular behavior.
                $delegate(exception, cause);
            };
        });

        // Whitelist several URI schemes to prevent Angular from marking them as un-safe.
        // http://stackoverflow.com/questions/19590818/angularjs-and-windows-8-route-error
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0|chrome-extension):/);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|ms-appx|x-wmapp0):|data:image\//);

        // Register our custom interceptor with the HTTP provider so we can hook into AJAX request events.
        $httpProvider.interceptors.push(Services.HttpInterceptor.ID);

        // Setup all of the client side routes and their controllers and views.
        RouteConfig.setupRoutes($stateProvider, $urlRouterProvider);

        // If mock API calls are enabled, then we'll add a random delay for all HTTP requests to simulate
        // network latency so we can see the spinners and loading bars. Useful for demo purposes.
        if (localStorage.getItem("ENABLE_MOCK_HTTP_CALLS") === "true") {
            Services.MockHttpApis.setupMockHttpDelay($provide);
        }
    };

    //#endregion

    //#region Event Handlers

    /**
     * Fired when the OS decides to minimize or pause the application. This usually
     * occurs when the user presses the device's home button or switches applications.
     */
    function device_pause(): void {

        if (!isShowingPinPrompt) {
            // Store the current date/time. This will be used to determine if we need to
            // show the PIN lock screen the next time the application is resumed.
            services.Configuration.lastPausedAt = moment();
        }
    }

    /**
     * Fired when the OS restores an application to the foreground. This usually occurs
     * when the user launches an app that is already open or uses the OS task manager
     * to switch back to the application.
     */
    function device_resume(): void {

        isShowingPinPrompt = true;

        // Potentially display the PIN screen.
        services.UiHelper.showPinEntryAfterResume().then(() => {
            isShowingPinPrompt = false;

            // If the user hasn't completed onboarding (eg new, first-time use of the app)
            // then we'll push them straight into the onboarding flow. Note that we do this
            // purposefully after the PIN screen for the case where the user may be upgrading
            // from a version of the application that doesn't have onboarding (we wouldn't
            // want them to be able to bypass the PIN entry in that case).
            if (!services.Configuration.hasCompletedOnboarding) {

                // Tell Ionic to not animate and clear the history (hide the back button)
                // for the next view that we'll be navigating to below.
                services.$ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });

                // Navigate the user to the onboarding splash view.
                services.$location.path("/app/onboarding/splash");
                services.$location.replace();

                return;
            }

            // If the user is still at the blank sreen, then push them to their default view.
            if (services.$location.url() === "/app/blank") {

                // Tell Ionic to not animate and clear the history (hide the back button)
                // for the next view that we'll be navigating to below.
                services.$ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });

                // Navigate the user to their default view.
                services.$location.path(services.Utilities.defaultCategory.href.substring(1));
                services.$location.replace();
            }
        });
    }

    /**
     * Fired when the menu hard (or soft) key is pressed on the device (eg Android menu key).
     * This isn't used for iOS devices because they do not have a menu button key.
     */
    function device_menuButton(): void {
        // Broadcast this event to all child scopes. This allows controllers for individual
        // views to handle this event and show a contextual menu etc.
        services.$rootScope.$broadcast(Constants.Events.APP_MENU_BUTTON);
    }

    /**
     * Fired when Angular's route/location (eg URL hash) is changing.
     */
    function angular_locationChangeStart(event: ng.IAngularEvent, newRoute: string, oldRoute: string): void {
        console.log("Location change, old Route: " + oldRoute);
        console.log("Location change, new Route: " + newRoute);
    };

    /**
     * Fired when an unhandled JavaScript exception occurs outside of Angular.
     */
    function window_onerror(message: any, uri: string, lineNumber: number, columnNumber?: number): void {

        console.error("Unhandled JS Exception", message, uri, lineNumber, columnNumber);

        try {
            // Show a generic message to the user.
            services.UiHelper.toast.showLongBottom("An error has occurred; please try again.");

            // If this exception occurred in the HttpInterceptor, there may still be a progress indicator on the scrren.
            services.UiHelper.progressIndicator.hide();
        }
        catch (ex) {
            console.warn("There was a problem alerting the user to an Angular error; falling back to a standard alert().", ex);
            alert("An error has occurred; please try again.");
        }

        try {
            services.Logger.logWindowError(message, uri, lineNumber, columnNumber);
        }
        catch (ex) {
            console.error("An error occurred while attempting to log an exception.", ex);
        }
    }

    /**
     * Fired when an exception occurs within Angular.
     * 
     * This includes uncaught exceptions in ng-click methods for example.
     */
    function angular_exceptionHandler(exception: Error, cause: string): void {
        var message = exception.message;

        if (!cause) {
            cause = "[Unknown]";
        }

        console.error("AngularJS Exception", exception, cause);

        try {
            // Show a generic message to the user.
            services.UiHelper.toast.showLongBottom("An error has occurred; please try again.");

            // If this exception occurred in the HttpInterceptor, there may still be a progress indicator on the scrren.
            services.UiHelper.progressIndicator.hide();
        }
        catch (ex) {
            console.warn("There was a problem alerting the user to an Angular error; falling back to a standard alert().", ex);
            alert("An error has occurred; please try again.");
        }

        try {
            services.Logger.logError("Angular exception caused by " + cause, exception);
        }
        catch (ex) {
            console.error("An error occurred while attempting to log an Angular exception.", ex);
        }
    }

    //#endregion
}
