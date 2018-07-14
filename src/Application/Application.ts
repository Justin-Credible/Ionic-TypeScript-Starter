
namespace JustinCredible.SampleApp {

    export class Application {

        //#region Injection

        public static ID = "Application";

        public static get $inject(): string[] {
            return [
                "$rootScope",
                "$window",
                "$location",
                "$ionicHistory",
                Services.Utilities.ID,
                Services.Plugins.ID,
                Services.Platform.ID,
                Services.Compatibility.ID,
                Services.UIHelper.ID,
                Services.Configuration.ID,
                Services.Logger.ID,
                Services.MenuDataSource.ID,
                Services.Preferences.ID,
            ];
        }

        constructor(
            private $rootScope: ng.IRootScopeService,
            private $window: ng.IWindowService,
            private $location: ng.ILocationService,
            private $ionicHistory: ionic.navigation.IonicHistoryService,
            private Utilities: Services.Utilities,
            private Plugins: Services.Plugins,
            private Platform: Services.Platform,
            private Compatibility: Services.Compatibility,
            private UIHelper: Services.UIHelper,
            private Configuration: Services.Configuration,
            private Logger: Services.Logger,
            private MenuDataSource: Services.MenuDataSource,
            private Preferences: Services.Preferences,
            ) {
        }

        //#endregion

        //#region Private Instance Variables

        /**
         * Keeps track of whether or not the PIN prompt or not.
         * This flag is updated via the device_pause and device_resume events.
         */
        private _isShowingPinPrompt: boolean = false;

        //#endregion

        //#region Public Methods

        public start(): void {

            // Set the default error handler for all uncaught exceptions.
            this.$window.onerror = _.bind(this.window_onerror, this);

            // Listen for all non-200 level HTTP responses.
            this.$rootScope.$on(Constants.Events.HTTP_ERROR, _.bind(this.http_error, this));

            // Subscribe to device events.
            if (this.Platform.web) {
                document.addEventListener(this.Compatibility.visibilityChangeEventName, _.bind(this.document_visibilitychange, this));
            }
            else {
                document.addEventListener("pause", _.bind(this.device_pause, this));
                document.addEventListener("resume", _.bind(this.device_resume, this));
                document.addEventListener("menubutton", _.bind(this.device_menuButton, this));
            }

            // Subscribe to Angular events.
            this.$rootScope.$on("$locationChangeStart", _.bind(this.angular_locationChangeStart, this));

            // We use this combination of settings so prevent the visual jank that
            // would otherwise occur when tapping an input that shows the keyboard.
            this.Plugins.keyboard.disableScroll(true);
            this.Plugins.keyboard.hideKeyboardAccessoryBar(false);

            // Add a helper function that should be used with all controller event handlers that are async.
            // This ensures that any rejections at the top level are logged (otherwise they'd be eaten).
            this.Utilities.setValue(this.$rootScope, "awaitOn", (promise: ng.IPromise<any>) => {

                promise.catch((error: any) => {
                    this.angular_exceptionHandler(error, "Unhandled promise rejection.");
                });
            });

            // Now that the platform is ready, we'll delegate to the resume handler.
            // We do this so the same code that fires on resume also fires when the
            // application is started for the first time.
            this.resume(true);
        }

        //#endregion

        //#region Application Pause and Resume Handlers

        /**
         * To be used when the app is being pushed into the background.
         */
        private pause(): void {

            if (!this._isShowingPinPrompt) {
                // Store the current date/time. This will be used to determine if we need to
                // show the PIN lock screen the next time the application is resumed.
                this.Configuration.lastPausedAt = moment();
            }
        }

        /**
         * To be used when the application is resuming from the background or starting up
         * from a cold boot.
         * 
         * @param coldBoot True if the application is starting up, false if resuming from background.
         */
        private resume(coldBoot: boolean): void {

            this._isShowingPinPrompt = true;

            // Potentially display the PIN screen.
            this.UIHelper.showPinEntryAfterResume().then(() => {
                this._isShowingPinPrompt = false;

                // We should show onboarding if the user hasn't completed it yet and they are not
                // already in the process of working through it. Note that we do this purposefully
                // after the PIN screen for the case where the user may be upgrading from a version
                // of the application that doesn't have onboarding (we wouldn't want them to be able
                // to bypass the PIN entry in that case).
                let shouldShowOnboarding = !this.Configuration.hasCompletedOnboarding
                                                && this.$location.path().indexOf("/app/onboarding") === -1;

                if (shouldShowOnboarding) {

                    // Tell Ionic to not animate and clear the history (hide the back button)
                    // for the next view that we'll be navigating to below.
                    this.$ionicHistory.nextViewOptions({
                        disableAnimate: true,
                        disableBack: true
                    });

                    // Navigate the user to the onboarding splash view.
                    this.$location.path("/app/onboarding/splash");
                    this.$location.replace();

                    return;
                }

                // If the user is still at the blank sreen, then push them to their default view.
                if (this.$location.url() === "" || this.$location.url() === "/app/blank") {

                    // Tell Ionic to not animate and clear the history (hide the back button)
                    // for the next view that we'll be navigating to below.
                    this.$ionicHistory.nextViewOptions({
                        disableAnimate: true,
                        disableBack: true
                    });

                    // Navigate the user to their default view.
                    this.$location.path(this.MenuDataSource.defaultCategory.href.substring(1));
                    this.$location.replace();
                }
            });
        }

        //#endregion

        //#region Event Handlers

        /**
         * Fired when the document or window's visibility changes (for example, when the user
         * switches tabs in the browser or minimizes the window).
         * 
         * This is only applicable when the app is running in a standard web browser.
         */
        private document_visibilitychange(): void {

            if (this.Compatibility.isDocumentHidden) {
                this.pause();
            }
            else {
                this.resume(false);
            }
        }

        /**
         * Fired when the menu hard (or soft) key is pressed on the device (eg Android menu key).
         * This isn't used for iOS devices because they do not have a menu button key.
         */
        private device_menuButton(): void {
            // Broadcast this event to all child scopes. This allows controllers for individual
            // views to handle this event and show a contextual menu etc.
            this.$rootScope.$broadcast(Constants.Events.APP_MENU_BUTTON);
        }

        /**
         * Fired when the OS decides to minimize or pause the application. This usually
         * occurs when the user presses the device's home button or switches applications.
         * 
         * This is only applicable when the app is running in a Cordova container.
         */
        private device_pause(): void {
            this.pause();
        }

        /**
         * Fired when the OS restores an application to the foreground. This usually occurs
         * when the user launches an app that is already open or uses the OS task manager
         * to switch back to the application.
         * 
         * This is only applicable when the app is running in a Cordova container.
         */
        private device_resume(): void {
            this.resume(false);
        }

        /**
         * Fired when Angular's route/location (eg URL hash) is changing.
         */
        private angular_locationChangeStart(event: ng.IAngularEvent, newRoute: string, oldRoute: string): void {

            // Chop off the long "file://..." prefix (we only care about the hash tag).
            newRoute = newRoute.substring(newRoute.indexOf("#"));
            oldRoute = oldRoute.substring(oldRoute.indexOf("#"));

            this.Logger.debug(Application.ID, "angular_locationChangeStart", "Angular location changed.", {
                oldRoute: oldRoute,
                newRoute: newRoute
            });
        }

        //#endregion

        //#region Error Handlers

        /**
         * Fired when an unhandled JavaScript exception occurs outside of Angular.
         */
        private window_onerror(message: any, uri: string, lineNumber: number, columnNumber?: number, error?: Error): void {

            // Log the exception using the built-in logger.
            try {
                this.Logger.error(Application.ID, "window_onerror", message, {
                    uri: uri,
                    lineNumber: lineNumber,
                    columnNumber: columnNumber,
                    error: error,
                });
            }
            catch (ex) {
                // If logging failed there is no use trying to log the failure.
            }

            // Alert the user to the error.
            try {

                // Only show the message in debug mode.
                if (this.Configuration.debug) {
                    this.UIHelper.showErrorSnackbar("Error: " + message);
                }

                // If this exception occurred in the HttpInterceptor, there may still be a progress indicator on the scrren.
                this.UIHelper.activityStop();
            }
            catch (ex) {
                this.Logger.warn(Application.ID, "window_onerror", "An exception occurred, and was caught, in the window error handler.", ex);
            }
        }

        /**
         * Fired when an exception occurs within Angular.
         * 
         * This includes uncaught exceptions in ng-click methods for example.
         * 
         * This is public so it can be registered via Boot.ts.
         */
        public angular_exceptionHandler(exception: Error, cause: string): void {

            var message = exception.message;

            if (!message) {
                message = "An unknown error ocurred in an Angular event.";
            }

            if (!cause) {
                cause = "[Unknown]";
            }

            // Log the exception using the built-in logger.
            try {
                this.Logger.error(Application.ID, "angular_exceptionHandler", message, {
                    cause: cause,
                    exception: exception
                });
            }
            catch (ex) {
                // If logging failed there is no use trying to log the failure.
            }

            // Alert the user to the error.
            try {

                // Only show the message in debug mode.
                if (this.Configuration.debug) {
                    this.UIHelper.showErrorSnackbar("Angular Exception: " + message);
                }

                // If this exception occurred in the HttpInterceptor, there may still be a progress indicator on the scrren.
                this.UIHelper.activityStop();
            }
            catch (ex) {
                this.Logger.warn(Application.ID, "angular_exceptionHandler", "An exception occurred, and was caught, in the Angular exception handler.", ex);
            }
        }

        /**
         * Fired whenever there is a non-200 level HTTP response.
         */
        private http_error(event: ng.IAngularEvent, response: ng.IHttpPromiseCallbackArg<any>): void {

            if (response.status === 401) {

                // Unauthorized should mean that a token wasn't sent, but we'll null these out anyways.
                this.Preferences.userId = null;
                this.Preferences.token = null;

                this.UIHelper.showErrorSnackbar("You do not have a token (401); please login.");
            }
            else if (response.status === 403) {

                // A token was sent, but was no longer valid. Null out the invalid token.
                this.Preferences.userId = null;
                this.Preferences.token = null;

                this.UIHelper.showErrorSnackbar("Your token has expired (403); please login again.");
            }
            else if (response.status === 404) {
                this.UIHelper.showErrorSnackbar("Resource unavailable (404); please contact your administrator.");
            }
            else if (response.status === 0) {
                // No network connection, invalid certificate, or other system level error.
                this.UIHelper.showErrorSnackbar("Network error; please try again later.");
            }
            else {
                this.UIHelper.showErrorSnackbar("An error has occurred; please try again.");
            }
        }

        //#endregion
    }
}
