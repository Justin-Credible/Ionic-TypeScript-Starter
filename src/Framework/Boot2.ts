
/**
 * This is the second level boot loader invoked via boot1.js from index.html.
 * 
 * This handles the configuration of AngularJS and it's controllers, services etc.
 * 
 * After Angular is initialized it will delegate to the Application.ts->start().
 */
namespace JustinCredible.SampleApp.Boot2 {

    //#region Variables

    /**
     * The root Angular application module.
     */
    var ngModule: ng.IModule;

    /**
     * Holds the instance of the Application class.
     */
    var applicationInstance: Application;

    //#endregion

    /**
     * This is the main entry point for the application. It is used to setup Angular and
     * configure its controllers, services, etc.
     * 
     * It is invoked via the boot1.js script included from the index.html page.
     */
    export function boot(): void {

        // Define the top level Angular module for the application.
        // Here we also specify the Angular modules this module depends upon.
        ngModule = angular.module("JustinCredible.SampleApp.Application", ["ui.router", "ionic", "templates", "ngMockE2E"]);

        // Define our constants.
        ngModule.constant("isCordova", typeof(cordova) !== "undefined");
        ngModule.constant("buildVars", window.buildVars);
        ngModule.constant("isChromeExtension", typeof (chrome) !== "undefined" && typeof (chrome.runtime) !== "undefined" && typeof (chrome.runtime.id) !== "undefined");

        // Register the services, directives, filters, and controllers with Angular.
        BootHelper.registerServices(ngModule);
        BootHelper.registerDirectives(ngModule);
        BootHelper.registerFilters(ngModule);
        BootHelper.registerControllers(ngModule);

        // Register the application service manually since it lives outside of the services namespace.
        ngModule.service(Application.ID, Application);

        // Define the injection parameters for the initialize method.
        var $inject_angular_initialize: any[] = [
            "$ionicPlatform",
            Application.ID,
            Services.Configuration.ID,
            Services.MockHttpApis.ID,

            // The method we are annotating.
            angular_initialize
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
            angular_configure
        ];

        // Specify the initialize/run and configuration functions.
        ngModule.run($inject_angular_initialize);
        ngModule.config($inject_angular_configure);
    }

    //#region Platform Configuration

    /**
     * The main initialize/run function for Angular; fired once the AngularJs framework
     * is done loading.
     * 
     * The parameters to this method are automatically determined by Angular's
     * dependency injection based on the name of each parameter.
     */
    function angular_initialize(
        $ionicPlatform: Ionic.IPlatform,
        Application: Application,
        Configuration: Services.Configuration,
        MockHttpApis: Services.MockHttpApis
        ): void {

        // Once AngularJs has loaded we'll wait for the Ionic platform's ready event.
        // This event will be fired once the device ready event fires via Cordova.
        $ionicPlatform.ready(() => {
            applicationInstance = Application;
            Application.setAngularModule(ngModule);
            Application.start();
        });

        // Mock up or allow HTTP responses.
        MockHttpApis.mockHttpCalls(Configuration.enableMockHttpCalls);
    };

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
        $ionicConfigProvider: any
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
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0|chrome-extension):/);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|ms-appx|x-wmapp0):|data:image\//);

        // Register our custom interceptor with the HTTP provider so we can hook into AJAX request events.
        $httpProvider.interceptors.push(Services.HttpInterceptor.ID);

        // Enable swipe navigation for all platforms (usually only is enabled for iOS).
        $ionicConfigProvider.views.swipeBackEnabled(true);

        // Setup all of the client side routes and their controllers and views.
        RouteConfig.setupRoutes($stateProvider, $urlRouterProvider);

        // If mock API calls are enabled, then we'll add a random delay for all HTTP requests to simulate
        // network latency so we can see the spinners and loading bars. Useful for demo purposes.
        if (localStorage.getItem("ENABLE_MOCK_HTTP_CALLS") === "true") {
            Services.MockHttpApis.setupMockHttpDelay($provide);
        }
    };

    //#endregion
}
