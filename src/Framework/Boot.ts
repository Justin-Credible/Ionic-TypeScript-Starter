
/**
 * This is the main startup class delegated to by index.html.
 * 
 * It handles the building the app configuration based on the current environment,
 * configuration of AngularJS and it's controllers, services etc, and starting the
 * app by invoking Application.start().
 */
namespace JustinCredible.SampleApp.Boot {

    //#region Static Variables

    /**
     * The root Angular application module.
     */
    var ngModule: ng.IModule;

    /**
     * Holds the instance of the Application class.
     */
    var applicationInstance: Application;

    //#endregion

    //#region Main Entrypoint

    /**
     * This is the main entry point for the application. It is used to setup Angular and
     * configure its controllers, services, etc.
     * 
     * It is invoked via an inline script included on the index.html page.
     * 
     * @param element The target element for the root of the Angular application.
     */
    export function main(element: HTMLElement): void {

        // Save off the value of the initial client-side route (hashtag).
        let initialHashRoute = window.location.hash;

        // Ensure the hash or server routes are empty when launch the app. If a route is present Angular
        // will pick it up and attempt to load the first route. This causes the document ready event
        // to be delayed until the first route has finished (which could be a long amount of time
        // if the first route is loading images etc). This delay would then delay $ionicPlatform's
        // ready event and therefore our own Application.start() event to execute after the first
        // view has been loaded. We'll handle navigation later via Navigator.handleNavigationOnResume().

        if (window.location.hash) {
            window.location.hash = "";
        }

        // Define the top level Angular module for the application.
        // Here we also specify the Angular modules this module depends upon.
        ngModule = angular.module("JustinCredible.SampleApp.Application", ["ui.router", "ionic", "templates"]);

        // tslint:disable-next-line:no-string-literal
        let chrome = window["chrome"];

        // Define our constants.
        ngModule.constant("isCordova", typeof(cordova) !== "undefined");
        ngModule.constant("buildVars", window.buildVars);
        ngModule.constant("isChromeExtension", typeof (chrome) !== "undefined" && typeof (chrome.runtime) !== "undefined" && typeof (chrome.runtime.id) !== "undefined");
        ngModule.constant("initialRoute", initialHashRoute);

        // Register the services, directives, filters, and controllers with Angular.
        BootHelper.registerServices(ngModule);
        BootHelper.registerDirectives(ngModule);
        BootHelper.registerFilters(ngModule);
        BootHelper.registerControllers(ngModule);

        // Register the application service manually since it lives outside of the services namespace.
        ngModule.service(Application.ID, Application);

        // Define the injection parameters for the initialize method.
        var $inject_angular_initialize: any[] = [
            "$q",
            "$ionicPlatform",
            Application.ID,

            // The method we are annotating.
            angular_initialize,
        ];

        // Define the injection parameters for the configure method.
        var $inject_angular_configure: any[] = [
            "$stateProvider",
            "$urlRouterProvider",
            "$provide",
            "$httpProvider",
            "$compileProvider",
            "$ionicConfigProvider",

            // The method we are annotating.
            angular_configure,
        ];

        // Specify the initialize/run and configuration functions.
        ngModule.run($inject_angular_initialize);
        ngModule.config($inject_angular_configure);

        // Now manually bootstrap Angular with the provided element.
        if (element) {

            console.log("[INFO] Boot.main: Now bootstrapping the application.", {
                buildTimestamp: window.buildVars.buildTimestamp,
                commitShortSha: window.buildVars.commitShortSha,
                buidVars: window.buildVars,
            });

            angular.bootstrap(element, ["JustinCredible.SampleApp.Application"]);
        }
    }

    //#endregion

    //#region Angular Configuration Handlers

    /**
     * The main initialize/run function for Angular; fired once the AngularJs framework
     * is done loading.
     * 
     * The parameters to this method are automatically determined by Angular's
     * dependency injection based on the name of each parameter.
     */
    function angular_initialize(
        $q: ng.IQService,
        $ionicPlatform: ionic.platform.IonicPlatformService,
        Application: Application,
        ): void {

        // Polyfill and/or override the brower's Promise implementation with Angular's.
        // This allows TypeScript's await keyword generator to use Angular's promise
        // implementation, which is required so that the digest cycle will execute.
        // https://arnhem.luminis.eu/using-typescrip-2-1-async-and-wait-in-an-angular-1-application-yes-yes-yes/
        (<any>window).Promise = $q;

        // Once AngularJs has loaded we'll wait for the Ionic platform's ready event.
        // This event will be fired once the device ready event fires via Cordova.
        $ionicPlatform.ready(() => {
            applicationInstance = Application;
            Application.start();
        });
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
        $compileProvider: ng.ICompileProvider,
        $ionicConfigProvider: ionic.utility.IonicConfigProvider,
        ): void {

        // Intercept the default Angular exception handler.
        $provide.decorator("$exceptionHandler", ["$delegate", function ($delegate: ng.IExceptionHandlerService) {
            return function (exception, cause) {

                // Delegate to our custom handler.
                if (applicationInstance) {
                    applicationInstance.angular_exceptionHandler(exception, cause);
                }

                // Delegate to the default/base Angular behavior.
                $delegate(exception, cause);
            };
        }]);

        // Whitelist several URI schemes to prevent Angular from marking them as un-safe.
        // http://stackoverflow.com/questions/19590818/angularjs-and-windows-8-route-error
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|ghttps?|ms-appx|x-wmapp0|chrome-extension):/);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|ms-appx|x-wmapp0):|data:image\//);

        // Register our custom interceptor with the HTTP provider so we can hook into AJAX request events.
        $httpProvider.interceptors.push(Services.HttpInterceptor.ID);

        // Enable swipe navigation for all platforms (usually only is enabled for iOS).
        $ionicConfigProvider.views.swipeBackEnabled(true);

        // Setup all of the client side routes and their controllers and views.
        RouteConfig.setupRoutes($stateProvider, $urlRouterProvider);
    }

    //#endregion
}
