module JustinCredible.SampleApp.Services {

    /**
     * Provides a common set of helper methods for working with the UI.
     */
    export class UiHelper {

        //#region Dialog Stuff

        /**
         * Value for rejection of a promise when opening a dialog using the showDialog
         * helper method. This value will be used when showDialog was called with a dialog
         * ID of a dialog that is already open.
         */
        public static DIALOG_ALREADY_OPEN = "DIALOG_ALREADY_OPEN";

        /**
         * Value for rejection of a promise when opening a dialog using the showDialog
         * helper method. This value will be used when showDialog was called with a dialog
         * ID who is not registered in the dialogTemplateMap map.
         */
        public static DIALOG_ID_NOT_REGISTERED = "DIALOG_ID_NOT_REGISTERED";

        /**
         * Keeps track of the currently open dialogs. Used by the showDialog helper method.
         */
        private static openDialogIds: string[];

        /**
         * Constant IDs for the dialogs. For use with the showDialog helper method.
         */
        public DialogIds = {
            ReorderCategories: "REORDER_CATEGORIES_DIALOG",
            PinEntry: "PIN_ENTRY_DIALOG"
        };

        /**
         * A map of dialog IDs to the templates that they use. Used by the showDialog helper method.
         * 
         * The template's root element should have a controller that extends BaseDialogController.
         */
        private static dialogTemplateMap = {
            "REORDER_CATEGORIES_DIALOG": "templates/Dialogs/Reorder-Categories.html",
            "PIN_ENTRY_DIALOG": "templates/Dialogs/Pin-Entry.html"
        };

        //#endregion

        public static $inject = ["$rootScope", "$q", "$http", "$ionicModal", "MockPlatformApis", "Utilities", "Preferences"];

        private $rootScope: ng.IRootScopeService;
        private $q: ng.IQService;
        private $http: ng.IHttpService;
        private $ionicModal: any;
        private MockPlatformApis: Services.MockPlatformApis;
        private Utilities: Services.Utilities;
        private Preferences: Services.Preferences;

        private isPinEntryOpen = false;

        constructor($rootScope: ng.IRootScopeService, $q: ng.IQService, $http: ng.IHttpService, $ionicModal: any, MockPlatformApis: Services.MockPlatformApis, Utilities: Services.Utilities, Preferences: Services.Preferences) {
            this.$rootScope = $rootScope;
            this.$q = $q;
            this.$http = $http;
            this.$ionicModal = $ionicModal;
            this.MockPlatformApis = MockPlatformApis;
            this.Utilities = Utilities;
            this.Preferences = Preferences;
        }

        //#region Plug-in Accessors

        /**
         * Exposes an API for showing toast messages.
         */
        get toast(): ICordovaToastPlugin {
            if (window.plugins && window.plugins.toast) {
                return window.plugins.toast;
            }
            else {
                return this.MockPlatformApis.getToastPlugin();
            }
        }

        /**
         * Exposes an API for working with progress indicators.
         */
        get progressIndicator(): ICordovaProgressIndicator {
            if (window.ProgressIndicator && !this.Utilities.isAndroid) {
                return window.ProgressIndicator;
            }
            else {
                return this.MockPlatformApis.getProgressIndicatorPlugin();
            }
        }

        /**
         * Exposes an API for working with the operating system's clipboard.
         */
        get clipboard(): ICordovaClipboardPlugin {
            if (typeof(cordova) !== "undefined" && cordova.plugins && cordova.plugins.clipboard) {
                return cordova.plugins.clipboard;
            }
            else if (this.Utilities.isChromeExtension) {
                return this.MockPlatformApis.getClipboardPluginForChromeExtension();
            }
            else {
                return this.MockPlatformApis.getClipboardPlugin();
            }
        }

        //#endregion

        //#region Native Dialogs

        /**
         * Shows a native alert dialog with an OK button and "Alert" as the title.
         * 
         * @param message The message text to display.
         * 
         * @returns A promise of void which will be resolved when the alert is closed.
         */
        public alert(message: string): ng.IPromise<void>;

        /**
         * Shows a native alert dialog with an OK button.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Alert".
         * 
         * @returns A promise of void which will be resolved when the alert is closed.
         */
        public alert(message: string, title: string): ng.IPromise<void>;

        /**
         * Shows a native alert dialog.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Alert".
         * @param buttonName The label for the button, defaults to "OK".
         * 
         * @returns A promise of void which will be resolved when the alert is closed.
         */
        public alert(message: string, title: string, buttonName: string): ng.IPromise<void>;

        /**
         * Shows a native alert dialog.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Alert".
         * @param buttonName The label for the button, defaults to "OK".
         * 
         * @returns A promise of void which will be resolved when the alert is closed.
         */
        public alert(message: string, title?: string, buttonName?: string): ng.IPromise<void> {
            var q = this.$q.defer<void>(),
                callback: () => void,
                notificationPlugin: Notification;

            // Default the title.
            title = title || "Alert";

            // Default the button name.
            buttonName = buttonName || "OK";

            // Define the callback that is executed when the dialog is closed.
            callback = (): void => {
                q.resolve();
            };

            // Obtain the notification plugin implementation.
            if (navigator.notification) {
                notificationPlugin = navigator.notification;
            }
            else {
                notificationPlugin = this.MockPlatformApis.getNotificationPlugin();
            }

            // Show the alert dialog.
            notificationPlugin.alert(message, callback, title, buttonName);

            return q.promise;
        }

        /**
         * Displays a native confirm dialog with "Yes" and "No" buttons and "Confirm" as the title.
         * 
         * @param message The message text to display.
         * 
         * @returns A promise of type string which will be resolved when the confirm is closed with the button that was clicked.
         */
        public confirm(message: string): ng.IPromise<string>;

        /**
         * Displays a native confirm dialog with "Yes" and "No" buttons.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Confirm".
         * 
         * @returns A promise of type string which will be resolved when the confirm is closed with the button that was clicked.
         */
        public confirm(message: string, title: string): ng.IPromise<string>;

        /**
         * Displays a native confirm dialog.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Confirm".
         * @param buttonLabels An array of strings for specifying button labels, defaults to "Yes" and "No".
         * 
         * @returns A promise of type string which will be resolved when the confirm is closed with the button that was clicked.
         */
        public confirm(message: string, title: string, buttonLabels: string[]): ng.IPromise<string>;

        /**
         * Displays a native confirm dialog.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Confirm".
         * @param buttonLabels An array of strings for specifying button labels, defaults to "Yes" and "No".
         * 
         * @returns A promise of type string which will be resolved when the confirm is closed with the button that was clicked.
         */
        public confirm(message: string, title?: string, buttonLabels?: string[]): ng.IPromise<string> {
            var q = this.$q.defer<string>(),
                callback: (choice: number) => void,
                notificationPlugin: Notification;

            // Default the title.
            title = title || "Confirm";

            // Default the buttons array.
            buttonLabels = buttonLabels || ["Yes", "No"];

            // Define the callback that is executed when the dialog is closed.
            callback = (choice: number): void => {
                var buttonText: string;

                // Get the button text for the button that was clicked; the callback
                // gives us a button index that is 1 based (not zero based!).
                buttonText = buttonLabels[choice - 1];

                q.resolve(buttonText);
            };

            // Obtain the notification plugin implementation.
            if (navigator.notification) {
                notificationPlugin = navigator.notification;
            }
            else {
                notificationPlugin = this.MockPlatformApis.getNotificationPlugin();
            }

            // Show the confirm dialog.
            notificationPlugin.confirm(message, callback, title, buttonLabels);

            return q.promise;
        }

        /**
         * Shows a native prompt dialog with "OK" and "Cancel" buttons with "Prompt" as the title.
         * 
         * @param message The message text to display.
         * 
         * @returns A promise of key/value pair of strings; the key is the button that was clicked and the value is the value of the text box.
         */
        public prompt(message: string): ng.IPromise<Models.KeyValuePair<string, string>>;

        /**
         * Shows a native prompt dialog with "OK" and "Cancel" buttons.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Prompt".
         * 
         * @returns A promise of key/value pair of strings; the key is the button that was clicked and the value is the value of the text box.
         */
        public prompt(message: string, title: string): ng.IPromise<Models.KeyValuePair<string, string>>;

        /**
         * Shows a native prompt dialog.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Prompt".
         * @param buttonLabels An array of strings for specifying button labels, defaults to "OK" and "Cancel".
         * 
         * @returns A promise of key/value pair of strings; the key is the button that was clicked and the value is the value of the text box.
         */
        public prompt(message: string, title: string, buttonLabels: string[]): ng.IPromise<Models.KeyValuePair<string, string>>;

        /**
         * Shows a native prompt dialog.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Prompt".
         * @param buttonLabels An array of strings for specifying button labels, defaults to "OK" and "Cancel".
         * @param defaultText Default text box input value, default is an empty string.
         * 
         * @returns A promise of key/value pair of strings; the key is the button that was clicked and the value is the value of the text box.
         */
        public prompt(message: string, title: string, buttonLabels: string[], defaultText: string): ng.IPromise<Models.KeyValuePair<string, string>>;

        /**
         * Shows a native prompt dialog.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Prompt".
         * @param buttonLabels An array of strings for specifying button labels, defaults to "OK" and "Cancel".
         * @param defaultText Default text box input value, default is an empty string.
         * 
         * @returns A promise of key/value pair of strings; the key is the button that was clicked and the value is the value of the text box.
         */
        public prompt(message: string, title?: string, buttonLabels?: string[], defaultText?: string): ng.IPromise<Models.KeyValuePair<string, string>> {
            var q = this.$q.defer<Models.KeyValuePair<string, string>>(),
                callback: (result: NotificationPromptResult) => void,
                notificationPlugin: Notification;

            // Default the title
            title = title || "Prompt";

            // Default the buttons array.
            buttonLabels = buttonLabels || ["OK", "Cancel"];

            // Define the callback that is executed when the dialog is closed.
            callback = (promptResult: NotificationPromptResult): void => {
                var promiseResult: Models.KeyValuePair<string, string>,
                    buttonText: string;

                // Get the button text for the button that was clicked; the callback
                // gives us a button index that is 1 based (not zero based!).
                buttonText = buttonLabels[promptResult.buttonIndex - 1];

                // Define the result object that we'll use the resolve the promise.
                // This contains the button that was selected as well as the contents
                // of the text box.
                promiseResult = new Models.KeyValuePair<string, string>(buttonText, promptResult.input1);

                q.resolve(promiseResult);
            };

            // Obtain the notification plugin implementation.
            if (navigator.notification) {
                notificationPlugin = navigator.notification;
            }
            else {
                notificationPlugin = this.MockPlatformApis.getNotificationPlugin();
            }

            // Show the prompt dialog.
            notificationPlugin.prompt(message, callback, title, buttonLabels, defaultText);

            return q.promise;
        }

        //#endregion

        //#region Modal Dialogs

        /**
         * Used to open the modal dialog with the given dialog ID.
         * Dialog IDs and templates can be set via UiHelper.DialogIds.
         * 
         * If a dialog with the given ID is already open, another will not be opened
         * and the promise will be rejected with UiHelper.DIALOG_ALREADY_OPEN.
         * 
         * @param dialogId The ID of the dialog to show/open.
         * @returns A promise that will be resolved when the dialog is closed with the dialog's return type.
         */
        public showDialog(dialogId: string): ng.IPromise<any>;

        /**
         * Used to open the modal dialog with the given dialog ID.
         * Dialog IDs and templates can be set via UiHelper.DialogIds.
         * 
         * If a dialog with the given ID is already open, another will not be opened
         * and the promise will be rejected with UiHelper.DIALOG_ALREADY_OPEN.
         * 
         * @param dialogId The ID of the dialog to show/open.
         * @param options The options to use when opening the dialog.
         * @returns A promise that will be resolved when the dialog is closed with the dialog's return type.
         */
        public showDialog(dialogId: string, options: Models.DialogOptions): ng.IPromise<any>;

        /**
         * Used to open the modal dialog with the given dialog ID.
         * Dialog IDs and templates can be set via UiHelper.DialogIds.
         * 
         * If a dialog with the given ID is already open, another will not be opened
         * and the promise will be rejected with UiHelper.DIALOG_ALREADY_OPEN.
         * 
         * @param dialogId The ID of the dialog to show/open.
         * @param options The options to use when opening the dialog.
         * @returns A promise that will be resolved when the dialog is closed with the dialog's return type.
         */
        public showDialog(dialogId: string, options?: Models.DialogOptions): ng.IPromise<any> {
            var q = this.$q.defer<any>(),
                template: string,
                creationArgs: any,
                creationPromise: ng.IPromise<any>;

            // Ensure the options object is present.
            if (!options) {
                options = new Models.DialogOptions();
            }

            // Ensure the array is initialized.
            if (UiHelper.openDialogIds == null) {
                UiHelper.openDialogIds = [];
            }

            // If a dialog with this ID is already open, we can reject immediately.
            // This ensures that only a single dialog with a given ID can be open
            // at one time.
            if (_.contains(UiHelper.openDialogIds, dialogId)) {
                this.$q.reject(UiHelper.DIALOG_ALREADY_OPEN);
                return q.promise;
            }

            // Lookup the template to use for this dialog based on the dialog ID.
            template = UiHelper.dialogTemplateMap[dialogId];

            // If we were unable to find a dialog ID in the template map then we
            // can bail out here as there is nothing to do.
            if (!template) {
                this.$q.reject(UiHelper.DIALOG_ID_NOT_REGISTERED);
                console.warn(this.Utilities.format("A call was made to openDialog with dialogId '{0}', but a template is not registered with that ID in the dialogTemplateMap.", dialogId));
                return q.promise;
            }

            // Add the ID of this dialog to the list of dialogs that are open.
            UiHelper.openDialogIds.push(dialogId);

            // Define the arguments that will be used to create the modal instance.
            creationArgs = {
                // Include the dialog ID so we can identify the dialog later on.
                dialogId: dialogId,

                // Include the dialog data object so the BaseDialogController can
                // get the dialog for the dialog.
                dialogData: options.dialogData,

                // Include Ionic modal options.
                backdropClickToClose: options.backdropClickToClose,
                hardwareBackButtonClose: options.hardwareBackButtonClose
            };

            // Schedule the modal instance to be created.
            creationPromise = this.$ionicModal.fromTemplateUrl(template, creationArgs);

            // Once the modal instance has been created...
            creationPromise.then((modal: any) => {
                var backdrop: HTMLDivElement;

                // Show it.
                modal.show();

                if (!options.showBackground) {
                    // HACK: Here we adjust the background color's alpha value so the user can't
                    // see through the overlay. At some point we should update this to use a blur
                    // effect similar to this: http://ionicframework.com/demos/frosted-glass/
                    backdrop = <HTMLDivElement> document.querySelector("div.modal-backdrop");
                    backdrop.style.backgroundColor = "rgba(0, 0, 0, 1)";
                }

                // Subscribe to the close event.
                modal.scope.$on("modal.hidden", (eventArgs: ng.IAngularEvent, instance: any) => {

                    // Only handle events for the relevant dialog.
                    if (dialogId !== instance.dialogId) {
                        return;
                    }

                    // If we were blocking out the background, we need to revert that now that
                    // we are closing this instance.
                    if (!options.showBackground) {
                        // HACK: Restore the backdrop's background color value.
                        backdrop.style.backgroundColor = "";
                    }

                    // Remove this dialog's ID from the list of ones that are open.
                    UiHelper.openDialogIds = _.without(UiHelper.openDialogIds, dialogId);

                    // Once the dialog is closed, resolve the original promise
                    // using the result data object from the dialog (if any).
                    q.resolve(modal.result);

                });
            });

            return q.promise;
        }

        //#endregion

        //#region Helpers for the device_resume event

        public showPinEntryAfterResume(): ng.IPromise<void> {
            var q = this.$q.defer<void>(),
                resumedAt: moment.Moment,
                options: Models.DialogOptions,
                model: Models.PinEntryDialogModel;

            // If the PIN entry dialog then there is nothing to do.
            if (this.isPinEntryOpen) {
                q.reject(UiHelper.DIALOG_ALREADY_OPEN);
                return q.promise;
            }

            // If there is a PIN set and a last paused time then we need to determine if we
            // need to show the lock screen.
            if (this.Preferences.pin && this.Preferences.lastPausedAt != null && this.Preferences.lastPausedAt.isValid()) {
                // Get the current time.
                resumedAt = moment();

                // If the time elapsed since the last pause event is greater than the threshold,
                // then we need to show the lock screen.
                if (resumedAt.diff(this.Preferences.lastPausedAt, "minutes") > this.Preferences.requirePinThreshold) {

                    model = new Models.PinEntryDialogModel("PIN Required", this.Preferences.pin, false);
                    options = new Models.DialogOptions(model);
                    options.backdropClickToClose = false;
                    options.hardwareBackButtonClose = false;
                    options.showBackground = false;

                    this.showDialog(this.DialogIds.PinEntry, options).then((result: Models.PinEntryDialogResultModel) => {
                        // Once a matching PIN is entered, then we can resolve.
                        q.resolve();
                    });
                }
                else {
                    // If we don't need to show the PIN screen, then immediately resolve.
                    q.resolve();
                }
            }
            else {
                // If we don't need to show the PIN screen, then immediately resolve.
                q.resolve();
            }

            return q.promise;
        }

        //#endregion
    }
}
