namespace JustinCredible.SampleApp.Controllers {

    export class DeveloperController extends BaseController<ViewModels.DeveloperViewModel> {

        //#region Injection

        public static ID = "DeveloperController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$rootScope",
                "$injector",
                "$window",
                Services.UIHelper.ID,
                Services.Plugins.ID,
                Services.Logger.ID,
                Services.Platform.ID,
                Services.Preferences.ID,
                Services.Configuration.ID,
                Services.Snackbar.ID,
            ];
        }

        constructor(
            $scope: ng.IScope,
            private $rootScope: ng.IRootScopeService,
            private $injector: ng.auto.IInjectorService,
            private $window: ng.IWindowService,
            private UIHelper: Services.UIHelper,
            private Plugins: Services.Plugins,
            private Logger: Services.Logger,
            private Platform: Services.Platform,
            private Preferences: Services.Preferences,
            private Configuration: Services.Configuration,
            private Snackbar: Services.Snackbar,
            ) {
            super($scope, ViewModels.DeveloperViewModel);
        }

        //#endregion

        //#region BaseController Overrides

        protected view_beforeEnter(event?: ng.IAngularEvent, eventArgs?: Interfaces.ViewEventArguments): void {
            super.view_beforeEnter(event, eventArgs);

            this.viewModel.userId = this.Preferences.userId;
            this.viewModel.token = this.Preferences.token;

            this.viewModel.isWebPlatform = this.Platform.web;
            this.viewModel.isWebStandalone = this.Platform.webStandalone;
            this.viewModel.devicePlatform = this.Platform.device.platform;
            this.viewModel.deviceModel = this.Platform.device.model;
            this.viewModel.deviceOsVersion = this.Platform.device.version;
            this.viewModel.deviceUuid = this.Platform.device.uuid;
            this.viewModel.deviceCordovaVersion = this.Platform.device.cordova;

            this.viewModel.navigatorPlatform = this.$window.navigator.platform;
            this.viewModel.navigatorProduct = this.$window.navigator.product;
            this.viewModel.navigatorVendor = this.$window.navigator.vendor;
            this.viewModel.viewport = this.Platform.viewport;
            this.viewModel.userAgent = this.$window.navigator.userAgent;

            this.viewModel.apiUrl = this.Configuration.apiUrl;
        }

        //#endregion

        //#region Controller Methods - Common

        protected help_click(helpMessage: string): void {
            this.UIHelper.alert(helpMessage, "Help");
        }

        protected copyValue_click(value: any, name: string): void {
            this.UIHelper.confirm("Copy " + name + " to clipboard?").then((result: string) => {
                if (result === Constants.Buttons.Yes) {
                    this.Plugins.clipboard.copy(value);
                    this.UIHelper.showInfoSnackbar(name + " copied to clipboard.");
                }
            });
        }

        //#endregion

        //#region Controller Methods - Test Tools

        protected apiUrl_click(): void {
            var message = "Here you can edit the API URL for this session.";

            this.UIHelper.prompt(message, "API URL", null, this.Configuration.apiUrl).then((result: Models.KeyValuePair<string, string>) => {

                if (result.key === Constants.Buttons.Cancel) {
                    return;
                }

                this.Configuration.apiUrl = result.value;
                this.viewModel.apiUrl = result.value;
                this.UIHelper.showSuccessSnackbar("API URL changed for this session only.");
            });
        }

        protected addServicesToGlobalScope_click(): void {

            /* tslint:disable:no-string-literal */

            this.$window["__services"] = {
                $rootScope: this.$rootScope
            };

            for (var key in Services) {

                if (!Services.hasOwnProperty(key)) {
                    continue;
                }

                let serviceId = Services[key].ID;

                try {
                    let service = this.$injector.get(serviceId);
                    this.$window["__services"][key] = service;
                }
                catch (err) {
                    /* tslint:disable:no-empty */
                    /* tslint:enable:no-empty */
                }
            }

            /* tslint:enable:no-string-literal */

            this.UIHelper.alert("Added services to the global variable __services.");
        }

        protected setRequirePinThreshold_click(): void {

            var message = `Enter the value (in minutes) for PIN prompt threshold? Current setting is ${this.Configuration.requirePinThreshold} minutes.`;

            this.UIHelper.prompt(message, "Require PIN Threshold", null, this.Configuration.requirePinThreshold.toString()).then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== Constants.Buttons.OK) {
                    return;
                }

                if (isNaN(parseInt(result.value, 10))) {
                    this.UIHelper.alert("Invalid value; a number is required.");
                    return;
                }

                this.Configuration.requirePinThreshold = parseInt(result.value, 10);

                this.UIHelper.alert(`PIN prompt threshold is now set to ${result.value} minutes.`);
            });
        }

        protected resetPinTimeout_click(): void {

            this.Configuration.lastPausedAt = moment("01-01-2000", "MM-DD-yyyy");

            var message = "The PIN timeout has been set to more than 10 minutes ago. To see the PIN screen, terminate the application via the OS task manager (don't just background it), and then re-launch.";

            this.UIHelper.alert(message, "Reset PIN Timeout");
        }

        protected reEnableOnboarding_click(): void {
            this.Configuration.hasCompletedOnboarding = false;
            this.UIHelper.alert("Onboarding has been enabled and will occur upon next app boot.");
        }

        //#endregion

        //#region Controller Methods - Test Exception Handling

        protected testJsException_click(): void {

            // Cause an exception by referencing an undefined variable.
            // We use defer so we can execute outside of the context of Angular.
            _.defer(function () {
                // tslint:disable-next-line:no-string-literal
                window["____asdf"].blah();
            });
        }

        protected testAngularException_click(): void {
            // Cause an exception by referencing an undefined variable.
            // tslint:disable-next-line:no-string-literal
            window["____asdf"].blah();
        }

        //#endregion

        //#region Controller Methods - HTTP Progress Bar

        protected showFullScreenBlock_click(): void {
            this.UIHelper.activityStart("Blocking...");

            setTimeout(() => {
                this.UIHelper.activityStop();
            }, 4000);
        }

        //#endregion

        //#region Controller Methods - Toast Notifications

        private _snackbarCounter: number = 0;

        protected snackBar_top(): void {
            let message = "Hello World #" + this._snackbarCounter++;

            let options = new Services.SnackbarOptions(message,
                "Title!",
                Services.SnackbarLevel.Success,
                Services.SnackbarLocation.Top);

            this.Snackbar.show(options).then((result: boolean) => {
                this.Logger.debug(DeveloperController.ID, "snackBar_top", "Snackbar dismissed with: " + result);
            });
        }

        protected snackBar_action(): void {
            let message = "Hello World #" + this._snackbarCounter++;

            let options = new Services.SnackbarOptions(message,
                "Title!",
                Services.SnackbarLevel.Error,
                Services.SnackbarLocation.Bottom,
                "View");

            this.Snackbar.show(options).then((result: boolean) => {
                this.Logger.debug(DeveloperController.ID, "snackBar_action", "Snackbar dismissed with: " + result);
            });
        }

        protected snackBar_bottom(): void {
            let message = "Hello World #" + this._snackbarCounter++;

            this.Snackbar.info(message).then((result: boolean) => {
                this.Logger.debug(DeveloperController.ID, "snackBar_bottom", "Snackbar dismissed with: " + result);
            });
        }

        //#endregion

        //#region Controller Methods - Clipboard

        protected clipboard_copy(): void {

            this.UIHelper.prompt("Enter a value to copy to the clipboard.").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== Constants.Buttons.OK) {
                    return;
                }

                this.Plugins.clipboard.copy(result.value, () => {
                    this.UIHelper.alert("Copy OK!");
                }, (err: Error) => {
                    this.UIHelper.alert("Copy Failed!\n\n" + (err ? err.message : "Unknown Error"));
                });
            });
        }

        protected clipboard_paste(): void {
            this.Plugins.clipboard.paste((result: string) => {
                this.UIHelper.alert("Paste OK! Value retrieved is:\n\n" + result);
            }, (err: Error) => {
                this.UIHelper.alert("Paste Failed!\n\n" + (err ? err.message : "Unknown Error"));
            });
        }

        //#endregion
    }
}
