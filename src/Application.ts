
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
                Services.Plugins.ID,
                Services.Utilities.ID,
                Services.UiHelper.ID,
                Services.Configuration.ID,
                Services.Logger.ID
            ];
        }

        constructor(
            private $rootScope: ng.IRootScopeService,
            private $window: ng.IWindowService,
            private $location: ng.ILocationService,
            private $ionicHistory: any,
            private Plugins: Services.Plugins,
            private Utilities: Services.Utilities,
            private UiHelper: Services.UiHelper,
            private Configuration: Services.Configuration,
            private Logger: Services.Logger) {
        }

        //#endregion

        //#region Private Instance Variables

        /**
         * The root Angular application module.
         */
        private _ngModule: ng.IModule;

        /**
         * Keeps track of the application being in the background or not.
         * This flag is updated via the device_pause and device_resume events.
         */
        private _appIsInBackground: boolean = false;

        /**
         * Keeps track of whether or not the PIN prompt or not.
         * This flag is updated via the device_pause and device_resume events.
         */
        private _isShowingPinPrompt: boolean = false;

        //#endregion

        //#region Public Methods

        /**
         * Used to set the Angular module for the application.
         */
        public setAngularModule(ngModule: ng.IModule): void {
            this._ngModule = ngModule;
        }

        public start(): void {

            // Set the default error handler for all uncaught exceptions.
            this.$window.onerror = _.bind(this.window_onerror, this);

            // Subscribe to device events.
            document.addEventListener("menubutton", _.bind(this.device_menuButton, this));
            document.addEventListener("pause", _.bind(this.device_pause, this));
            document.addEventListener("resume", _.bind(this.device_resume, this, false));

            // Subscribe to Angular events.
            this.$rootScope.$on("$locationChangeStart", _.bind(this.angular_locationChangeStart, this));

            // Register all of the dialogs with the UiHelper.
            this.registerDialogs(this._ngModule);

            // We use this combination of settings so prevent the visual jank that
            // would otherwise occur when tapping an input that shows the keyboard.
            this.Plugins.keyboard.disableScroll(true);
            this.Plugins.keyboard.hideKeyboardAccessoryBar(false);

            // Now that the platform is ready, we'll delegate to the resume event.
            // We do this so the same code that fires on resume also fires when the
            // application is started for the first time.
            this.device_resume(true);
        }

        //#endregoin

        //#region Event Handlers

        /**
         * Fired when the menu hard (or soft) key is pressed on the device (eg Android menu key).
         * This isn't used for iOS devices because they do not have a menu button key.
         */
        public device_menuButton(): void {
            // Broadcast this event to all child scopes. This allows controllers for individual
            // views to handle this event and show a contextual menu etc.
            this.$rootScope.$broadcast(Constants.Events.APP_MENU_BUTTON);
        }

        /**
         * Fired when the OS decides to minimize or pause the application. This usually
         * occurs when the user presses the device's home button or switches applications.
         */
        public device_pause(): void {
            this._appIsInBackground = true;

            if (!this._isShowingPinPrompt) {
                // Store the current date/time. This will be used to determine if we need to
                // show the PIN lock screen the next time the application is resumed.
                this.Configuration.lastPausedAt = moment();
            }
        }

        /**
         * Fired when the OS restores an application to the foreground. This usually occurs
         * when the user launches an app that is already open or uses the OS task manager
         * to switch back to the application.
         * 
         * @param coldBoot True if the application is starting up, false if resuming from background.
         */
        public device_resume(coldBoot: boolean): void {

            this._appIsInBackground = false;

            this._isShowingPinPrompt = true;

            // Potentially display the PIN screen.
            this.UiHelper.showPinEntryAfterResume().then(() => {
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
                if (this.$location.url() === "/app/blank") {

                    // Tell Ionic to not animate and clear the history (hide the back button)
                    // for the next view that we'll be navigating to below.
                    this.$ionicHistory.nextViewOptions({
                        disableAnimate: true,
                        disableBack: true
                    });

                    // Navigate the user to their default view.
                    this.$location.path(this.Utilities.defaultCategory.href.substring(1));
                    this.$location.replace();
                }
            });
        }

        /**
         * Fired when Angular's route/location (eg URL hash) is changing.
         */
        public angular_locationChangeStart(event: ng.IAngularEvent, newRoute: string, oldRoute: string): void {

            // Chop off the long "file://..." prefix (we only care about the hash tag).
            newRoute = newRoute.substring(newRoute.indexOf("#"));
            oldRoute = oldRoute.substring(oldRoute.indexOf("#"));

            this.Logger.debug("Application", "angular_locationChangeStart", "Angular location changed.", {
                oldRoute: oldRoute,
                newRoute: newRoute
            });
        };

        //#endregion

        //#region Error Handlers

        /**
         * Fired when an unhandled JavaScript exception occurs outside of Angular.
         */
        private window_onerror(message: any, uri: string, lineNumber: number, columnNumber?: number): void {

            // Log the exception using the built-in logger.
            try {
                this.Logger.error("Application", "window_onerror", message, {
                    uri: uri,
                    lineNumber: lineNumber,
                    columnNumber: columnNumber
                });
            }
            catch (ex) {
                // If logging failed there is no use trying to log the failure.
            }

            // Alert the user to the error.
            try {
                // Show a generic message to the user.
                this.Plugins.toast.showLongBottom("An error has occurred; please try again.");

                // If this exception occurred in the HttpInterceptor, there may still be a progress indicator on the scrren.
                this.Plugins.spinner.activityStop();
            }
            catch (ex) {
                this.Logger.warn("Application", "window_onerror", "There was a problem alerting the user to an Angular error; falling back to a standard alert().", ex);
                alert("An error has occurred; please try again.");
            }
        }

        /**
         * Fired when an exception occurs within Angular.
         * 
         * This includes uncaught exceptions in ng-click methods for example.
         * 
         * This is public so it can be registered via Boot2.ts.
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
                this.Logger.error("Application", "angular_exceptionHandler", message, {
                    cause: cause,
                    exception: exception
                });
            }
            catch (ex) {
                // If logging failed there is no use trying to log the failure.
            }

            // Alert the user to the error.
            try {
                // Show a generic message to the user.
                this.Plugins.toast.showLongBottom("An error has occurred; please try again.");

                // If this exception occurred in the HttpInterceptor, there may still be a progress indicator on the scrren.
                this.Plugins.spinner.activityStop();
            }
            catch (ex) {
                this.Logger.warn("Application", "angular_exceptionHandler", "There was a problem alerting the user to an Angular error; falling back to a standard alert().", ex);
                alert("An error has occurred; please try again.");
            }
        }

        //#endregion

        //#region Private Helpers

        /**
         * Used to register each of the Controller classes that extend BaseDialog as dialogs
         * with the UiHelper.
         * 
         * @params ngModule The root Angular module to use for registration.
         */
        private registerDialogs(ngModule: ng.IModule): void {

            // Loop over each of the controllers, and for any controller that dervies from BaseController
            // register it as a dialog using its ID with the UiHelper.
            _.each(Controllers, (Controller: any) => {

                // Don't try to register the BaseDialogController since it is abstract.
                if (Controller === Controllers.BaseDialogController) {
                    return; // Continue
                }

                if (this.Utilities.derivesFrom(Controller, Controllers.BaseDialogController)) {
                    this.UiHelper.registerDialog(Controller.ID, Controller.TemplatePath);
                }
            });
        }

        //#endregion
    }
}
