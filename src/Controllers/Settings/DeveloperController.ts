module JustinCredible.SampleApp.Controllers {

    export class DeveloperController extends BaseController<ViewModels.DeveloperViewModel> {

        public static ID = "DeveloperController";

        public static $inject = ["$scope", "$http", "Utilities", "UiHelper", "FileUtilities", "Logger", "Preferences"];

        private $http: ng.IHttpService;
        private Utilities: Services.Utilities;
        private UiHelper: Services.UiHelper;
        private FileUtilities: Services.FileUtilities;
        private Logger: Services.Logger;
        private Preferences: Services.Preferences;

        constructor($scope: ng.IScope, $http: ng.IHttpService, Utilities: Services.Utilities, UiHelper: Services.UiHelper, FileUtilities: Services.FileUtilities, Logger: Services.Logger, Preferences: Services.Preferences) {
            super($scope, ViewModels.DeveloperViewModel);

            this.$http = $http;
            this.Utilities = Utilities;
            this.UiHelper = UiHelper;
            this.FileUtilities = FileUtilities;
            this.Logger = Logger;
            this.Preferences = Preferences;
        }

        //#region BaseController Overrides

        protected view_beforeEnter(): void {
            super.view_beforeEnter();

            this.viewModel.mockApiRequests = this.Preferences.enableMockHttpCalls;

            this.viewModel.devicePlatform = this.Utilities.platform();
            this.viewModel.loggingToLocalStorage = this.Logger.getLogToLocalStorage() + "";
            this.viewModel.defaultStoragePathId = this.FileUtilities.getDefaultRootPathId();
            this.viewModel.defaultStoragePath = this.FileUtilities.getDefaultRootPath();
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

        protected mockApiRequests_change() {
            var message: string;

            this.Preferences.enableMockHttpCalls = this.viewModel.mockApiRequests;

            message = "The application needs to be reloaded for changes to take effect.\n\nReload now?";

            this.UiHelper.confirm(message, "Confirm Reload").then((result: string) => {
                if (result === "Yes") {
                    document.location.href = "index.html";
                }
            });
        }

        protected setLoggingMode_click() {
            var message: string;

            message = "Enable exception logging to local storage? Current setting is " + this.Logger.getLogToLocalStorage();

            this.UiHelper.confirm(message).then((result: string) => {
                var enable = result === "Yes";

                this.viewModel.loggingToLocalStorage = enable + "";
                this.Logger.setLogToLocalStorage(enable);

                if (enable) {
                    this.UiHelper.alert("Logs will be written to local storage.");
                }
                else {
                    this.UiHelper.alert("Logs will not be written to local storage; they will be stored in-memory only.");
                }
            });
        }

        protected setHttpLoggingMode_click() {
            var message: string;

            message = "Enable logging of all HTTP requests (even non-errors)? Current setting is " + this.Preferences.enableFullHttpLogging;

            this.UiHelper.confirm(message).then((result: string) => {
                var enable = result === "Yes";

                this.Preferences.enableFullHttpLogging = enable;

                if (enable) {
                    this.UiHelper.alert("ALL HTTP requests and responses will be logged.");
                }
                else {
                    this.UiHelper.alert("Only HTTP errors will be logged.");
                }
            });
        }

        protected addModulesToGlobalScope_click() {
            /* tslint:disable:no-string-literal */
            window["__FileUtilities"] = this.FileUtilities;
            window["__Logger"] = this.Logger;
            window["__Utilities"] = this.Utilities;
            window["__UiHelper"] = this.UiHelper;
            window["__Preferences"] = this.Preferences;
            /* tslint:enable:no-string-literal */

            this.UiHelper.alert("Added the following services to the global window scope: __FileUtilities, __Logger, __Utilities, __UiHelper, __Preferences");
        }

        protected setRequirePinThreshold_click() {
            var message: string;

            message = this.Utilities.format("Enter the value (in minutes) for PIN prompt threshold? Current setting is {0} minutes.", this.Preferences.requirePinThreshold);

            this.UiHelper.prompt(message, "Require PIN Threshold", null, this.Preferences.requirePinThreshold.toString()).then((result: Models.KeyValuePair<string, string>) => {

            if (result.key !== "OK") {
                    return;
                }

                if (isNaN(parseInt(result.value, 10))) {
                    this.UiHelper.alert("Invalid value; a number is required.");
                    return;
                }

                this.Preferences.requirePinThreshold = parseInt(result.value, 10);

                this.UiHelper.alert(this.Utilities.format("PIN prompt threshold is now set to {0} minutes.", result.value));
            });
        }

        protected resetPinTimeout_click() {
            var message: string;

            this.Preferences.lastPausedAt = moment("01-01-2000", "MM-DD-yyyy");

            message = "The PIN timeout has been set to more than 10 minutes ago. To see the PIN screen, terminate the application via the OS task manager (don't just background it), and then re-launch.";

            this.UiHelper.alert(message, "Reset PIN Timeout");
        }

        protected reEnableOnboarding_click(): void {
            this.Preferences.hasCompletedOnboarding = false;
            this.UiHelper.alert("Onboarding has been enabled and will occur upon next app boot.");
        }

        protected testJsException_click() {
            /* tslint:disable:no-string-literal */

            // Cause an exception by referencing an undefined variable.
            // We use defer so we can execute outside of the context of Angular.
            _.defer(function () {
                var x = window["____asdf"].blah();
            });

            /* tslint:enable:no-string-literal */
        }

        protected testAngularException_click() {
            /* tslint:disable:no-string-literal */

            // Cause an exception by referencing an undefined variable.
            var x = window["____asdf"].blah();

            /* tslint:enable:no-string-literal */
        }

        protected apiGetToken_click() {
            var httpConfig: Interfaces.RequestConfig;

            httpConfig = {
                method: "GET",
                url: "~/tokens/" + this.Preferences.token,
                data: null,
                blocking: true,
                blockingText: "Retrieving Token Info..."
            };

            this.$http(httpConfig).then((response: ng.IHttpPromiseCallbackArg<DataTypes.TokenResponse>) => {
                var message = this.Utilities.format("Token: {0}\nExpires: {1}", response.data.token, response.data.expires);
                this.UiHelper.alert(message);
            });
        }

        protected showFullScreenBlock_click() {
            this.UiHelper.progressIndicator.showSimpleWithLabel(true, "Authenticating...");

            setTimeout(() => {
                this.UiHelper.progressIndicator.hide();
            }, 4000);
        }

        protected showToast_top(): void {
            this.UiHelper.toast.showShortTop("This is a test toast notification.");
        }

        protected showToast_center(): void {
            this.UiHelper.toast.showShortCenter("This is a test toast notification.");
        }

        protected showToast_bottom(): void {
            this.UiHelper.toast.showShortBottom("This is a test toast notification.");
        }

        protected clipboard_copy(): void {

            this.UiHelper.prompt("Enter a value to copy to the clipboard.").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== "OK") {
                    return;
                }

                this.UiHelper.clipboard.copy(result.value, () => {
                    this.UiHelper.alert("Copy OK!");
                }, (err: Error) => {
                    this.UiHelper.alert("Copy Failed!\n\n" + (err ? err.message : "Unknown Error"));
                });
            });
        }

        protected clipboard_paste(): void {
            this.UiHelper.clipboard.paste((result: string) => {
                this.UiHelper.alert("Paste OK! Value retrieved is:\n\n" + result);
            }, (err: Error) => {
                this.UiHelper.alert("Paste Failed!\n\n" + (err ? err.message : "Unknown Error"));
            });
        }

        protected startProgress_click() {
            NProgress.start();
        }

        protected incrementProgress_click() {
            NProgress.inc();
        }

        protected doneProgress_click() {
            NProgress.done();
        }

        protected showPinEntry_click() {
            var options: Models.DialogOptions,
                model: Models.PinEntryDialogModel;

            model = new Models.PinEntryDialogModel("Testing new PIN entry", null, true);
            options = new Models.DialogOptions(model);

            this.UiHelper.showDialog(this.UiHelper.DialogIds.PinEntry, options).then((result: Models.PinEntryDialogResultModel) => {
                this.UiHelper.alert("Cancelled: " + result.cancelled + " PIN matches: " + result.matches + " PIN entered: " + result.pin);
            });
        }

        protected showPinEntry1234_click() {
            var options: Models.DialogOptions,
                model: Models.PinEntryDialogModel;

            model = new Models.PinEntryDialogModel("Testing PIN matching (1234)", "1234", true);
            options = new Models.DialogOptions(model);

            this.UiHelper.showDialog(this.UiHelper.DialogIds.PinEntry, options).then((result: Models.PinEntryDialogResultModel) => {
                this.UiHelper.alert("Cancelled: " + result.cancelled + " PIN matches: " + result.matches + " PIN entered: " + result.pin);
            });
        }

        protected readFile_click() {
            this.UiHelper.prompt("Enter file name to read from", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== "OK") {
                    return;
                }

                this.FileUtilities.readTextFile(result.value)
                    .then((text: string) => { console.log(text); this.UiHelper.alert(text); },
                    (err: Error) => { console.error(err); this.alertFileIoError(err); });
            });
        }

        protected writeFile_click() {
            var path: string,
                contents: string;

            this.UiHelper.prompt("Enter file name to write to", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== "OK") {
                    return;
                }

                path = result.value;

                this.UiHelper.prompt("Enter file contents").then((result: Models.KeyValuePair<string, string>) => {

                    if (result.key !== "OK") {
                        return;
                    }

                    contents = result.value;

                    this.FileUtilities.writeTextFile(path, contents, false)
                        .then(() => { console.log("WRITE OK"); this.UiHelper.alert("WRITE OK"); },
                        (err: Error) => { console.error(err); this.alertFileIoError(err); });
                });
            });
        }

        protected appendFile_click() {
            var path: string,
                contents: string;

            this.UiHelper.prompt("Enter file name to write to", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== "OK") {
                    return;
                }

                this.UiHelper.prompt("Enter file contents", "File I/O Test", null, " / ").then((result: Models.KeyValuePair<string, string>) => {

                    if (result.key !== "OK") {
                        return;
                    }

                    contents = result.value;

                    this.FileUtilities.writeTextFile(path, contents, true)
                        .then(() => { console.log("APPEND OK"); this.UiHelper.alert("APPEND OK"); },
                        (err: Error) => { console.error(err); this.alertFileIoError(err); });
                });
            });
        }

        protected createDir_click() {
            var path: string;

            this.UiHelper.prompt("Enter dir name to create", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== "OK") {
                    return;
                }

                path = result.value;

                this.FileUtilities.createDirectory(path)
                    .then(() => { console.log("CREATE DIR OK"); this.UiHelper.alert("CREATE DIR OK"); },
                    (err: Error) => { console.error(err); this.alertFileIoError(err); });
            });
        }

        protected listFiles_click() {
            var path: string,
                list = "";

            this.UiHelper.prompt("Enter path to list files", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== "OK") {
                    return;
                }

                path = result.value;

                this.FileUtilities.getFilePaths(path)
                    .then((files: any) => {
                        console.log(files);

                        files.forEach((value: string) => {
                            list += "\n" + value;
                        });

                        this.UiHelper.alert(list);
                    },
                    (err: Error) => {
                        console.error(err);
                        this.alertFileIoError(err);
                    });
            });
        }

        protected listDirs_click() {
            var path: string,
                list = "";

            this.UiHelper.prompt("Enter path to list dirs", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== "OK") {
                    return;
                }

                path = result.value;

                this.FileUtilities.getDirectoryPaths(path)
                    .then((dirs: any) => {
                        console.log(dirs);

                        dirs.forEach((value: string) => {
                            list += "\n" + value;
                        });

                        this.UiHelper.alert(list);
                    },
                    (err: Error) => {
                        console.error(err);
                        this.alertFileIoError(err);
                    });
            });
        }

        protected deleteFile_click() {
            var path: string;

            this.UiHelper.prompt("Enter path to delete file", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== "OK") {
                    return;
                }

                path = result.value;

                this.FileUtilities.deleteFile(path)
                    .then(() => { console.log("DELETE FILE OK"); this.UiHelper.alert("DELETE FILE OK"); },
                    (err: Error) => { console.error(err); this.alertFileIoError(err); });
            });
        }

        protected deleteDir_click() {
            var path: string;

            this.UiHelper.prompt("Enter path to delete dir", "File I/O Test", null, "/").then((result: Models.KeyValuePair<string, string>) => {

                if (result.key !== "OK") {
                    return;
                }

                path = result.value;

                this.FileUtilities.deleteDirectory(path)
                    .then(() => { console.log("DELETE DIR OK"); this.UiHelper.alert("DELETE FILE OK"); },
                    (err: Error) => { console.error(err); this.alertFileIoError(err); });
            });
        }

        //#endregion
    }
}
