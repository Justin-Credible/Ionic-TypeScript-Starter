namespace JustinCredible.SampleApp.Controllers {

    export class DeveloperController extends BaseController<ViewModels.DeveloperViewModel> {

        //#region Injection

        public static ID = "DeveloperController";

        public static get $inject(): string[] {
            return [
                "$scope",
                Services.Plugins.ID,
                Services.Utilities.ID,
                Services.UiHelper.ID,
                Services.FileUtilities.ID,
                Services.Logger.ID,
                Services.Preferences.ID,
                Services.Configuration.ID,
                Services.MockPlatformApis.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private Plugins: Services.Plugins,
            private Utilities: Services.Utilities,
            private UiHelper: Services.UiHelper,
            private FileUtilities: Services.FileUtilities,
            private Logger: Services.Logger,
            private Preferences: Services.Preferences,
            private Configuration: Services.Configuration,
            private MockPlatformApis: Services.MockPlatformApis) {
            super($scope, ViewModels.DeveloperViewModel);
        }

        //#endregion

        //#region BaseController Overrides

        protected view_beforeEnter(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
            super.view_beforeEnter(event, eventArgs);

            this.viewModel.mockApiRequests = this.Configuration.enableMockHttpCalls;

            this.viewModel.userId = this.Preferences.userId;
            this.viewModel.token = this.Preferences.token;

            this.viewModel.devicePlatform = this.Utilities.platform;
            this.viewModel.deviceModel = this.Utilities.device.model;
            this.viewModel.deviceOsVersion = this.Utilities.device.version;
            this.viewModel.deviceUuid = this.Utilities.device.uuid;
            this.viewModel.deviceCordovaVersion = this.Utilities.device.cordova;

            this.viewModel.defaultStoragePathId = this.FileUtilities.getDefaultRootPathId();
            this.viewModel.defaultStoragePath = this.FileUtilities.getDefaultRootPath();

            this.viewModel.apiUrl = this.Configuration.apiUrl;
        }

        //#endregion

        //#region Private Helper Methods

        private alertFileIoError(error: any) {
            if (error) {
                if (error.code) {
                    this.UiHelper.alert(error.code);
                }
                else if (error.message) {
                    this.UiHelper.alert(error.message);
                }
                else {
                    this.UiHelper.alert(error);
                }
            }
        }

        //#endregion

        //#region Controller Methods

        protected help_click(helpMessage: string): void {
            this.UiHelper.alert(helpMessage, "Help");
        }

        protected mockApiRequests_change(): void {

            this.Configuration.enableMockHttpCalls = this.viewModel.mockApiRequests;

            var message = "The application needs to be reloaded for changes to take effect.\n\nReload now?";

            this.UiHelper.confirm(message, "Confirm Reload").then((result: string) => {
                if (result === Constants.Buttons.Yes) {
                    document.location.href = "index.html";
                }
            });
        }

        protected apiUrl_click(): void {
            var message = "Here you can edit the API URL for this session.";

            this.UiHelper.prompt(message, "API URL", null, this.Configuration.apiUrl).then((result: Models.KeyValuePair<string, string>) => {

                if (result.key === Constants.Buttons.Cancel) {
                    return;
                }

                this.Configuration.apiUrl = result.value;
                this.viewModel.apiUrl = result.value;
                this.Plugins.toast.showShortBottom("API URL changed for this session only.");
            });
        }

        protected userToken_click(token: string): void {
            this.UiHelper.confirm("Copy token to clipboard?").then((result: string) => {
                if (result === Constants.Buttons.Yes) {
                    this.Plugins.clipboard.copy(token);
                    this.Plugins.toast.showShortBottom("Token copied to clipboard.");
                }
            });
        }

        protected addServicesToGlobalScope_click(): void {

            /* tslint:disable:no-string-literal */
            window["__ngServices"] = {
                "FileUtilities": this.FileUtilities,
                "Logger": this.Logger,
                "Utilities": this.Utilities,
                "UiHelper": this.UiHelper,
                "Plugins": this.Plugins,
                "Preferences": this.Preferences,
                "MockPlatformApis": this.MockPlatformApis
            };
            /* tslint:enable:no-string-literal */

            this.UiHelper.alert("Added services to the global variable __ngServices.");
        }

        protected setRequirePinThreshold_click(): void {

            var message = this.Utilities.format("Enter the value (in minutes) for PIN prompt threshold? Current setting is {0} minutes.", this.Configuration.requirePinThreshold);

            this.UiHelper.prompt(message, "Require PIN Threshold", null, this.Configuration.requirePinThreshold.toString()).then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== Constants.Buttons.OK) {
                    return;
                }

                if (isNaN(parseInt(result.value, 10))) {
                    this.UiHelper.alert("Invalid value; a number is required.");
                    return;
                }

                this.Configuration.requirePinThreshold = parseInt(result.value, 10);

                this.UiHelper.alert(this.Utilities.format("PIN prompt threshold is now set to {0} minutes.", result.value));
            });
        }

        protected resetPinTimeout_click(): void {

            this.Configuration.lastPausedAt = moment("01-01-2000", "MM-DD-yyyy");

            var message = "The PIN timeout has been set to more than 10 minutes ago. To see the PIN screen, terminate the application via the OS task manager (don't just background it), and then re-launch.";

            this.UiHelper.alert(message, "Reset PIN Timeout");
        }

        protected reEnableOnboarding_click(): void {
            this.Configuration.hasCompletedOnboarding = false;
            this.UiHelper.alert("Onboarding has been enabled and will occur upon next app boot.");
        }

        protected testNativeException_click(): void {
            this.UiHelper.confirm("Are you sure you want to cause a native crash? This requires the Crashlytics plug-in to be installed.").then((result: string) => {
                if (result === Constants.Buttons.Yes) {
                    this.Plugins.crashlytics.simulateCrash();
                }
            });
        }

        protected testJsException_click(): void {
            /* tslint:disable:no-string-literal */

            // Cause an exception by referencing an undefined variable.
            // We use defer so we can execute outside of the context of Angular.
            _.defer(function () {
                var x = window["____asdf"].blah();
            });

            /* tslint:enable:no-string-literal */
        }

        protected testAngularException_click(): void {
            /* tslint:disable:no-string-literal */

            // Cause an exception by referencing an undefined variable.
            var x = window["____asdf"].blah();

            /* tslint:enable:no-string-literal */
        }

        protected showFullScreenBlock_click(): void {
            this.Plugins.spinner.activityStart("Blocking...");

            setTimeout(() => {
                this.Plugins.spinner.activityStop();
            }, 4000);
        }

        protected showToast_top(): void {
            this.Plugins.toast.showShortTop("This is a test toast notification.");
        }

        protected showToast_center(): void {
            this.Plugins.toast.showShortCenter("This is a test toast notification.");
        }

        protected showToast_bottom(): void {
            this.Plugins.toast.showShortBottom("This is a test toast notification.");
        }

        protected clipboard_copy(): void {

            this.UiHelper.prompt("Enter a value to copy to the clipboard.").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== Constants.Buttons.OK) {
                    return;
                }

                this.Plugins.clipboard.copy(result.value, () => {
                    this.UiHelper.alert("Copy OK!");
                }, (err: Error) => {
                    this.UiHelper.alert("Copy Failed!\n\n" + (err ? err.message : "Unknown Error"));
                });
            });
        }

        protected clipboard_paste(): void {
            this.Plugins.clipboard.paste((result: string) => {
                this.UiHelper.alert("Paste OK! Value retrieved is:\n\n" + result);
            }, (err: Error) => {
                this.UiHelper.alert("Paste Failed!\n\n" + (err ? err.message : "Unknown Error"));
            });
        }

        protected startProgress_click(): void {
            NProgress.start();
        }

        protected incrementProgress_click(): void {
            NProgress.inc();
        }

        protected doneProgress_click(): void {
            NProgress.done();
        }

        protected readFile_click(): void {
            this.UiHelper.prompt("Enter file name to read from", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== Constants.Buttons.OK) {
                    return;
                }

                this.FileUtilities.readTextFile(result.value)
                    .then((text: string) => { this.Logger.debug(DeveloperController.ID, "readFile_click", "Read OK.", text); this.UiHelper.alert(text); },
                    (err: Error) => { this.Logger.error(DeveloperController.ID, "readFile_click", "An error occurred.", err); this.alertFileIoError(err); });
            });
        }

        protected writeFile_click(): void {
            var path: string,
                contents: string;

            this.UiHelper.prompt("Enter file name to write to", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== Constants.Buttons.OK) {
                    return;
                }

                path = result.value;

                this.UiHelper.prompt("Enter file contents").then((result: Models.KeyValuePair<string, string>) => {

                    if (result.key !== Constants.Buttons.OK) {
                        return;
                    }

                    contents = result.value;

                    this.FileUtilities.writeTextFile(path, contents, false)
                        .then(() => { this.Logger.debug(DeveloperController.ID, "writeFile_click", "Write OK.", { path: path, contents: contents }); this.UiHelper.alert("Write OK."); },
                        (err: Error) => { this.Logger.error(DeveloperController.ID, "writeFile_click", "An error occurred.", err); this.alertFileIoError(err); });
                });
            });
        }

        protected appendFile_click(): void {
            var path: string,
                contents: string;

            this.UiHelper.prompt("Enter file name to write to", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== Constants.Buttons.OK) {
                    return;
                }

                this.UiHelper.prompt("Enter file contents", "File I/O Test", null, " / ").then((result: Models.KeyValuePair<string, string>) => {

                    if (result.key !== Constants.Buttons.OK) {
                        return;
                    }

                    contents = result.value;

                    this.FileUtilities.writeTextFile(path, contents, true)
                        .then(() => { this.Logger.debug(DeveloperController.ID, "appendFile_click", "Append OK.", { path: path, contents: contents }); this.UiHelper.alert("Append OK."); },
                        (err: Error) => { this.Logger.error(DeveloperController.ID, "appendFile_click", "An error occurred.", err); this.alertFileIoError(err); });
                });
            });
        }

        protected createDir_click(): void {
            var path: string;

            this.UiHelper.prompt("Enter dir name to create", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== Constants.Buttons.OK) {
                    return;
                }

                path = result.value;

                this.FileUtilities.createDirectory(path)
                    .then(() => { this.Logger.debug(DeveloperController.ID, "createDir_click", "Create directory OK.", path); this.UiHelper.alert("Create directory OK."); },
                    (err: Error) => { this.Logger.error(DeveloperController.ID, "createDir_click", "An error occurred.", err); this.alertFileIoError(err); });
            });
        }

        protected listFiles_click(): void {
            var path: string,
                list = "";

            this.UiHelper.prompt("Enter path to list files", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== Constants.Buttons.OK) {
                    return;
                }

                path = result.value;

                this.FileUtilities.getFilePaths(path)
                    .then((files: any) => {
                        this.Logger.debug(DeveloperController.ID, "listFiles_click", "Get file paths OK.", files);

                        files.forEach((value: string) => {
                            list += "\n" + value;
                        });

                        this.UiHelper.alert(list);
                    },
                    (err: Error) => {
                        this.Logger.error(DeveloperController.ID, "listFiles_click", "An error occurred.", err);
                        this.alertFileIoError(err);
                    });
            });
        }

        protected listDirs_click(): void {
            var path: string,
                list = "";

            this.UiHelper.prompt("Enter path to list dirs", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== Constants.Buttons.OK) {
                    return;
                }

                path = result.value;

                this.FileUtilities.getDirectoryPaths(path)
                    .then((dirs: any) => {
                        this.Logger.debug(DeveloperController.ID, "listDirs_click", "Get directory paths OK.", dirs);

                        dirs.forEach((value: string) => {
                            list += "\n" + value;
                        });

                        this.UiHelper.alert(list);
                    },
                    (err: Error) => {
                        this.Logger.error(DeveloperController.ID, "listDirs_click", "An error occurred.", err);
                        this.alertFileIoError(err);
                    });
            });
        }

        protected deleteFile_click(): void {
            var path: string;

            this.UiHelper.prompt("Enter path to delete file", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== Constants.Buttons.OK) {
                    return;
                }

                path = result.value;

                this.FileUtilities.deleteFile(path)
                    .then(() => { this.Logger.debug(DeveloperController.ID, "deleteFile_click", "Delete file OK.", path); this.UiHelper.alert("Delete file OK."); },
                    (err: Error) => { this.Logger.error(DeveloperController.ID, "deleteFile_click", "An error occurred.", err); this.alertFileIoError(err); });
            });
        }

        protected deleteDir_click(): void {
            var path: string;

            this.UiHelper.prompt("Enter path to delete dir", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== Constants.Buttons.OK) {
                    return;
                }

                path = result.value;

                this.FileUtilities.deleteDirectory(path)
                    .then(() => { this.Logger.debug(DeveloperController.ID, "deleteDir_click", "Delete directory OK.", path); this.UiHelper.alert("Delete directory OK"); },
                    (err: Error) => { this.Logger.error(DeveloperController.ID, "deleteDir_click", "An error occurred.", err); this.alertFileIoError(err); });
            });
        }

        //#endregion
    }
}
