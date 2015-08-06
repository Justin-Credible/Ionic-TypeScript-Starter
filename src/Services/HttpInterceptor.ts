module JustinCredible.SampleApp.Services {

    /**
     * This is a custom interceptor for Angular's $httpProvider.
     * 
     * It allows us to inject the token into the header, log request and responses,
     * and handle the showing and hiding of the user blocking UI elements, progress
     * bar and spinner.
     * 
     * Note: The $injector service is used to obtain most of the other services that
     * this service depends on so we can avoid circular dependency references on startup.
     */
    export class HttpInterceptor {

        //#region Injection

        public static ID = "HttpInterceptor";

        constructor(
            private $rootScope: ng.IRootScopeService,
            private $injector: ng.auto.IInjectorService,
            private $q: ng.IQService,
            private apiVersion: string) {
        }

        private get Utilities(): Utilities {
            return this.$injector.get(Utilities.ID);
        }

        private get UiHelper(): UiHelper {
            return this.$injector.get(UiHelper.ID);
        }

        private get Preferences(): Preferences {
            return this.$injector.get(Preferences.ID);
        }

        private get Configuration(): Configuration {
            return this.$injector.get(Configuration.ID);
        }

        private get Logger(): Logger {
            return this.$injector.get(Logger.ID);
        }

        /**
         * This function can be used to return a factory function that Angular can consume
         * when defining an Angular factory. It is basically a wrapper for the HttpInterceptor
         * service so we can do dependency injection and have everything called in the correct
         * context at runtime.
         * 
         * @returns A factory that can be used like this: ngModule.factory(HttpInterceptor.getFactory());
         */
        public static getFactory(): Function {
            var factory: Function;

            // Angular expects the factory function to return the object that is used
            // for the factory when it is injected into other objects.
            factory = function ($rootScope: ng.IRootScopeService, $injector: ng.auto.IInjectorService, $q: ng.IQService, apiVersion: string) {

                // Create an instance our strongly-typed service.
                var instance = new HttpInterceptor($rootScope, $injector, $q, apiVersion);

                // Return an object that exposes the functions that we want to be exposed.
                // We use bind here so that the correct context is used (Angular normally
                // would just use the context of the window when invoking the functions).
                return {
                    request: _.bind(instance.request, instance),
                    response: _.bind(instance.response, instance),
                    requestError: _.bind(instance.requestError, instance),
                    responseError: _.bind(instance.responseError, instance)
                };
            };

            // Annotate the factory function with the things that should be injected.
            factory.$inject = [
                "$rootScope",
                "$injector",
                "$q",
                "apiVersion"
            ];

            return factory;
        }

        //#endregion

        private requestsInProgress: number = 0;
        private blockingRequestsInProgress: number = 0;
        private spinnerRequestsInProgress: number = 0;

        //#region HttpInterceptor specific methods

        /**
         * Fired when an HTTP request is being made. This is where the configuration
         * object (eg URL, HTTP headers, etc) can be modified before the request goes
         * out.
         */
        public request(config: Interfaces.RequestConfig): Interfaces.RequestConfig {
            var baseUrl: string;

            // Do nothing for Angular's template requests.
            if (this.Utilities.endsWith(config.url, ".html")) {
                return config;
            }

            console.log("HttpInterceptor.request: " + config.url, [config]);

            // Log the request data to disk.
            if (this.Configuration.enableFullHttpLogging) {
                this.Logger.logHttpRequestConfig(config);
            }

            // Keep track of how many requests are in progress and show spinners etc.
            this.handleRequestStart(config);

            // If the URL starts with a tilde, we know this is a URL for one of our own restful API
            // endpoints. In this case, we'll add our required headers, authorization token, and the
            // base URL for the current data source.
            if (this.Utilities.startsWith(config.url, "~")) {
                /* tslint:disable:no-string-literal */

                // Specify the version of the API we can consume.
                config.headers["X-API-Version"] = this.apiVersion;

                // Specify the content type we are sending and the payload type that we want to receive.
                config.headers["Content-Type"] = "application/json";
                config.headers["Accept"] = "application/json";

                // If we currently have a user ID and token, then include it in the authorization header.
                if (this.Preferences.userId && this.Preferences.token) {
                    config.headers["Authorization"] = this.getAuthorizationHeader(this.Preferences.userId, this.Preferences.token);
                }

                /* tslint:enable:no-string-literal */

                if (this.Configuration.apiUrl && this.Configuration.apiUrl) {

                    // Grab the base data source URL.
                    baseUrl = this.Configuration.apiUrl;

                    // Remove the leading tilde character.
                    config.url = config.url.substring(1);

                    // If the root path ends with a forward slash and the path
                    // starts with a forward slash, we don't need two slashes in
                    // a row, so remove the leading slash from the path.
                    if (this.Utilities.endsWith(baseUrl, "/") && this.Utilities.startsWith(config.url, "/")) {
                        config.url = config.url.substr(1, config.url.length - 1);
                    }

                    // If the root path doesn't end with a forward slash AND the path
                    // doesn't end with a forward slash, we need to make sure there is
                    // a forward slash in-between the two before we concatenate them.
                    if (!this.Utilities.endsWith(baseUrl, "/") && !this.Utilities.startsWith(config.url, "/")) {
                        config.url = "/" + config.url;
                    }

                    // Prepend the base data source URL.
                    config.url = baseUrl + config.url;
                }
                else {
                    throw new Error("An HTTP call cannot be made because a data source was not selected.");
                }
            }

            return config;
        }

        /**
         * Fired when an HTTP request completes with a status code in the 200 range.
         */
        public response(httpResponse: ng.IHttpPromiseCallbackArg<any>): ng.IHttpPromiseCallbackArg<any> {
            var config: Interfaces.RequestConfig;

            // Cast to our custom type which includes some extra flags.
            config = <Interfaces.RequestConfig>httpResponse.config;

            // Do nothing for Angular's template requests.
            if (this.Utilities.endsWith(config.url, ".html")) {
                return httpResponse;
            }

            console.log("HttpInterceptor.response: " + httpResponse.config.url, [httpResponse]);

            // Log the response data to disk.
            if (this.Configuration.enableFullHttpLogging) {
                this.Logger.logHttpResponse(httpResponse);
            }

            // Keep track of how many requests are still in progress and hide spinners etc.
            this.handleResponseEnd(config);

            return httpResponse;
        }

        /**
         * Fired when there is an unhandled exception (eg JavaScript error) in the HttpInterceptor.request
         * OR when there are problems with the request going out.
         */
        public requestError(rejection: ng.IHttpPromiseCallbackArg<any>) {
            var httpResponse: ng.IHttpPromiseCallbackArg<any>,
                exception: Error,
                config: Interfaces.RequestConfig;

            console.error("HttpInterceptor.requestError", [rejection]);

            if (rejection instanceof Error) {
                // Occurs for any uncaught exceptions that occur in other interceptors.
                exception = <Error>rejection;
                this.Logger.logError("An request exception was encountered in the HttpInterceptor.requestError().", exception);
                this.handleFatalError();
            }
            else {
                // Occurs if any other interceptors reject the request.
                this.Logger.logError("An request rejection was encountered in the HttpInterceptor.requestError().", null);

                httpResponse = <ng.IHttpPromiseCallbackArg<any>>rejection;

                // Cast to our custom type which includes some extra flags.
                config = <Interfaces.RequestConfig>httpResponse.config;

                // Keep track of how many requests are still in progress and hide spinners etc.
                if (config) {
                    this.handleResponseEnd(config);
                }
            }

            return this.$q.reject(rejection);
        }

        /**
         * Fired when a response completes with a non-200 level status code.
         * 
         * Additionally, this can fire when there are uncaught exceptions (eg JavaScript errors)
         * in the HttpInterceptor response method.
         */
        public responseError(responseOrError: any) {
            var httpResponse: ng.IHttpPromiseCallbackArg<any>,
                exception: Error,
                config: Interfaces.RequestConfig;

            console.log("HttpInterceptor.responseError", [responseOrError]);

            if (responseOrError instanceof Error) {
                exception = <Error>responseOrError;
                this.Logger.logError("An response error was encountered in the HttpInterceptor.responseError().", exception);
                this.handleFatalError();
            }
            else {
                httpResponse = <ng.IHttpPromiseCallbackArg<any>>responseOrError;

                // Cast to our custom type which includes some extra flags.
                config = <Interfaces.RequestConfig>httpResponse.config;

                // Do nothing for Angular's template requests.
                if (this.Utilities.endsWith(config.url, ".html")) {
                    return this.$q.reject(responseOrError);
                }

                // Always log error responses.
                this.Logger.logHttpResponse(httpResponse);

                // Keep track of how many requests are still in progress and hide spinners etc.
                this.handleResponseEnd(config);

                // For certain response codes, we'll broadcast an event to the rest of the app
                // so that it can handle the event in whatever way is appropriate.
                if (httpResponse.status === 401) {
                    this.$rootScope.$broadcast(Constants.Events.HTTP_UNAUTHORIZED, httpResponse);
                }
                else if (httpResponse.status === 403) {
                    this.$rootScope.$broadcast(Constants.Events.HTTP_FORBIDDEN, httpResponse);
                }
                else if (httpResponse.status === 404) {
                    this.$rootScope.$broadcast(Constants.Events.HTTP_NOT_FOUND, httpResponse);
                }
                else if (httpResponse.status === 0) {
                    this.$rootScope.$broadcast(Constants.Events.HTTP_UNKNOWN_ERROR, httpResponse);
                }
                else {
                    this.$rootScope.$broadcast(Constants.Events.HTTP_ERROR, httpResponse);
                }
            }

            return this.$q.reject(responseOrError);
        }

        //#endregion

        //#region Private Helpers

        /**
         * Handles keeping track of the number of requests that are currently in progress as well
         * as shows any UI blocking or animated spinners.
         */
        private handleRequestStart(config: Interfaces.RequestConfig) {

            // Default the blocking flag if it isn't present.
            if (typeof (config.blocking) === "undefined") {
                config.blocking = true;
            }

            // Default the show spinner flag if it isn't present.
            if (typeof (config.showSpinner) === "undefined") {
                config.showSpinner = true;
            }

            // Increment the total number of HTTP requests that are in progress.
            this.requestsInProgress += 1;

            // If this request should block the UI, then we have extra work to do.
            if (config.blocking) {

                // Increment the total number of HTTP requests that are in progress that
                // are also currently blocking the UI.
                this.blockingRequestsInProgress += 1;

                // If this wasn't the first blocking HTTP request, we need to hide the previous
                // blocking progress indicator before we show the new one.
                if (this.blockingRequestsInProgress > 1) {
                    this.UiHelper.progressIndicator.hide();
                }

                // Show the blocking progress indicator with or without text.
                if (config.blockingText) {
                    this.UiHelper.progressIndicator.showSimpleWithLabel(true, config.blockingText);
                }
                else {
                    this.UiHelper.progressIndicator.showSimple(true);
                }
            }

            // If this request should show the spinner, then we have extra work to do.
            if (config.showSpinner) {

                // Increment the total number of HTTP requests that are in progress that
                // are also currently showing the spinner.
                this.spinnerRequestsInProgress += 1;

                // If the spinner isn't already visible, then show it.
                if (!NProgress.isStarted()) {
                    NProgress.start();
                }
            }
        }

        /**
         * This method should be called when there is a fatal error during one of our interceptor
         * methods. It ensures that all of the progress bars and overlays are removed from the
         * screen so we don't block the user.
         */
        private handleFatalError() {
            this.requestsInProgress = 0;
            this.blockingRequestsInProgress = 0;
            this.spinnerRequestsInProgress = 0;
            NProgress.done();
            this.UiHelper.progressIndicator.hide();
        }

        /**
         * Handles keeping track of the number of requests that are currently in progress as well
         * as hides any UI blocking or animated spinners.
         */
        private handleResponseEnd(config: Interfaces.RequestConfig) {

            // Decrement the total number of HTTP requests that are in progress.
            this.requestsInProgress -= 1;

            // If this was a blocking request, also decrement the blocking counter.
            if (config.blocking) {
                this.blockingRequestsInProgress -= 1;
            }
            // If this was a spinner request, also decrement the spinner counter.
            if (config.showSpinner) {
                this.spinnerRequestsInProgress -= 1;
            }

            // If there are no more blocking requests in progress, then hide the blocker.
            if (config.blocking && this.blockingRequestsInProgress === 0) {
                this.UiHelper.progressIndicator.hide();
            }

            if (config.showSpinner && this.spinnerRequestsInProgress === 0) {
                // If there are no more spinner requests in progress, then hide the spinner.
                NProgress.done();
            }
            else {
                // If there are still spinner requests in progress, then kick up the progress
                // bar a little bit to show some of the work has completed.
                NProgress.inc();
            }
        }

        /**
         * Used to create a header value for use with the basic Authorization HTTP header using
         * the given user name and password value.
         * 
         * http://en.wikipedia.org/wiki/Basic_access_authentication
         * 
         * @param The user name to use.
         * @param The password to use.
         * @returns A value to use for the HTTP Authorization header.
         */
        private getAuthorizationHeader(userName: string, password: string): string {
            var headerValue: string;

            // Concatenate the user name and password with a colon.
            headerValue = this.Utilities.format("{0}:{1}", userName, password);

            // Base64 encode the user name and password and prepend "Basic".
            return "Basic " + btoa(headerValue);
        }

        //#endregion
    }
}
