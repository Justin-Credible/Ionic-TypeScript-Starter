namespace JustinCredible.SampleApp.Services {

    /**
     * Provides a common set of helper methods for working with the UI.
     */
    export class UiHelper {

        //#region Injection

        public static ID = "UiHelper";

        public static get $inject(): string[] {
            return [
                "$window",
                "$q",
                "$ionicModal",
                "$ionicSideMenuDelegate",
                Plugins.ID,
                Logger.ID,
                Preferences.ID,
                Configuration.ID
            ];
        }

        constructor(
            private $window: Window,
            private $q: ng.IQService,
            private $ionicModal: any,
            private $ionicSideMenuDelegate: any,
            private Plugins: Plugins,
            private Logger: Logger,
            private Preferences: Preferences,
            private Configuration: Services.Configuration) {
        }

        //#endregion

        //#region Dialog Stuff

        /**
         * Keeps track of the currently open dialogs. Used by the showDialog helper method.
         */
        private static _openDialogIds: string[];

        /**
         * A map of dialog IDs to the templates that they use. Used by the showDialog helper method.
         * Entries are added to this map via the registerDialog method.
         * 
         * The template's root element should have a controller that extends BaseDialogController.
         */
         private static dialogTemplateMap: { [dialogId: string]: string } = {};

        //#endregion

        private isPinEntryOpen = false;

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
         * @param buttonName The label for the button, defaults to Buttons.OK.
         * 
         * @returns A promise of void which will be resolved when the alert is closed.
         */
        public alert(message: string, title: string, buttonName: string): ng.IPromise<void>;

        /**
         * Shows a native alert dialog.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Alert".
         * @param buttonName The label for the button, defaults to Buttons.OK.
         * 
         * @returns A promise of void which will be resolved when the alert is closed.
         */
        public alert(message: string, title?: string, buttonName?: string): ng.IPromise<void> {
            var q = this.$q.defer<void>(),
                callback: () => void;

            // Default the title.
            title = title || "Alert";

            // Default the button name.
            buttonName = buttonName || Constants.Buttons.OK;

            // Define the callback that is executed when the dialog is closed.
            callback = (): void => {
                q.resolve();
            };

            // Show the alert dialog.
            this.Plugins.notification.alert(message, callback, title, buttonName);

            return q.promise;
        }

        /**
         * Displays a native confirm dialog with Buttons.Yes and Buttons.No buttons and "Confirm" as the title.
         * 
         * @param message The message text to display.
         * 
         * @returns A promise of type string which will be resolved when the confirm is closed with the button that was clicked.
         */
        public confirm(message: string): ng.IPromise<string>;

        /**
         * Displays a native confirm dialog with Buttons.Yes and Buttons.No buttons.
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
         * @param buttonLabels An array of strings for specifying button labels, defaults to Buttons.Yes and Buttons.No.
         * 
         * @returns A promise of type string which will be resolved when the confirm is closed with the button that was clicked.
         */
        public confirm(message: string, title: string, buttonLabels: string[]): ng.IPromise<string>;

        /**
         * Displays a native confirm dialog.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Confirm".
         * @param buttonLabels An array of strings for specifying button labels, defaults to Buttons.Yes and Buttons.No.
         * 
         * @returns A promise of type string which will be resolved when the confirm is closed with the button that was clicked.
         */
        public confirm(message: string, title?: string, buttonLabels?: string[]): ng.IPromise<string> {
            var q = this.$q.defer<string>(),
                callback: (choice: number) => void;

            // Default the title.
            title = title || "Confirm";

            // Default the buttons array.
            buttonLabels = buttonLabels || [Constants.Buttons.Yes, Constants.Buttons.No];

            // Define the callback that is executed when the dialog is closed.
            callback = (choice: number): void => {
                var buttonText: string;

                // Get the button text for the button that was clicked; the callback
                // gives us a button index that is 1 based (not zero based!).
                buttonText = buttonLabels[choice - 1];

                q.resolve(buttonText);
            };

            // Show the confirm dialog.
            this.Plugins.notification.confirm(message, callback, title, buttonLabels);

            return q.promise;
        }

        /**
         * Shows a native prompt dialog with Buttons.OK and Buttons.Cancel buttons with "Prompt" as the title.
         * 
         * @param message The message text to display.
         * 
         * @returns A promise of key/value pair of strings; the key is the button that was clicked and the value is the value of the text box.
         */
        public prompt(message: string): ng.IPromise<Models.KeyValuePair<string, string>>;

        /**
         * Shows a native prompt dialog with Buttons.OK and Buttons.Cancel buttons.
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
         * @param buttonLabels An array of strings for specifying button labels, defaults to Buttons.OK and Buttons.Cancel.
         * 
         * @returns A promise of key/value pair of strings; the key is the button that was clicked and the value is the value of the text box.
         */
        public prompt(message: string, title: string, buttonLabels: string[]): ng.IPromise<Models.KeyValuePair<string, string>>;

        /**
         * Shows a native prompt dialog.
         * 
         * @param message The message text to display.
         * @param title The title of the dialog, defaults to "Prompt".
         * @param buttonLabels An array of strings for specifying button labels, defaults to Buttons.OK and Buttons.Cancel.
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
         * @param buttonLabels An array of strings for specifying button labels, defaults to Buttons.OK and Buttons.Cancel.
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
            buttonLabels = buttonLabels || [Constants.Buttons.OK, Constants.Buttons.Cancel];

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

            // Show the prompt dialog.
            this.Plugins.notification.prompt(message, callback, title, buttonLabels, defaultText);

            return q.promise;
        }

        //#endregion

        //#region Modal Dialogs

        /**
         * Used to register a dialog for use with showDialog().
         * 
         * @param dialogId The unique identifier for the dialog.
         * @param templatePath The path to the Angular HTML template for the dialog.
         */
        public registerDialog(dialogId: string, templatePath: string): void {

            if (!dialogId) {
                throw new Error("A dialogId is required when registering a dialog.");
            }

            if (!templatePath) {
                throw new Error("A templatePath is required when registering a dialog.");
            }

            if (UiHelper.dialogTemplateMap[dialogId]) {
                this.Logger.warn(UiHelper.ID, "registerDialog", "A dialog with the same ID has already been registered; it will be overwritten.", dialogId);
            }

            UiHelper.dialogTemplateMap[dialogId] = templatePath;
        }

        /**
         * Used to open the modal dialog with the given dialog ID.
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
         * 
         * If a dialog with the given ID is already open, another will not be opened
         * and the promise will be rejected with Constants.DIALOG_ALREADY_OPEN.
         * 
         * @param dialogId The ID of the dialog to show/open.
         * @param options The options to use when opening the dialog.
         * @returns A promise that will be resolved when the dialog is closed with the dialog's return type.
         */
        public showDialog(dialogId: string, options: Models.DialogOptions): ng.IPromise<any>;

        /**
         * Used to open the modal dialog with the given dialog ID.
         * 
         * If a dialog with the given ID is already open, another will not be opened
         * and the promise will be rejected with Constants.DIALOG_ALREADY_OPEN.
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
            if (UiHelper._openDialogIds == null) {
                UiHelper._openDialogIds = [];
            }

            // If a dialog with this ID is already open, we can reject immediately.
            // This ensures that only a single dialog with a given ID can be open
            // at one time.
            if (_.contains(UiHelper._openDialogIds, dialogId)) {
                this.$q.reject(Constants.DIALOG_ALREADY_OPEN);
                return q.promise;
            }

            // Lookup the template to use for this dialog based on the dialog ID.
            template = UiHelper.dialogTemplateMap[dialogId];

            // If we were unable to find a dialog ID in the template map then we
            // can bail out here as there is nothing to do.
            if (!template) {
                this.Logger.warn(UiHelper.ID, "showDialog", "A call was made to openDialog, but a template is not registered with the given ID in the dialogTemplateMap.", dialogId);
                this.$q.reject(Constants.DIALOG_ID_NOT_REGISTERED);
                return q.promise;
            }

            // Add the ID of this dialog to the list of dialogs that are open.
            UiHelper._openDialogIds.push(dialogId);

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
                    UiHelper._openDialogIds = _.without(UiHelper._openDialogIds, dialogId);

                    // Once the dialog is closed, resolve the original promise
                    // using the result data object from the dialog (if any).
                    q.resolve(modal.result);

                });
            });

            return q.promise;
        }

        //#endregion

        //#region Side Menu

        /**
         * The media query used to show the side menu on a tablet in landscape.
         */
        private _sideMenuMediaQueryVisibleOnLandscapeTablet: string = "(min-width: 768px) and (orientation: landscape)";

        /**
         * Media query used to ensure the side menu is always hidden.
         */
        private _sideMenuMediaQueryNeverVisible: string = "(min-width: 99999999px) and (orientation: landscape)";

        /**
         * The actual media query that is exposed via the sideMenuMediaQuery property.
         * 
         * This value is manipulated via the setAllowSideMenu() method.
         */
        private _sideMenuMediaQuery: string = this._sideMenuMediaQueryVisibleOnLandscapeTablet;

        /**
         * Property used to expose the media query for the side menu.
         */
        public get sideMenuMediaQuery(): string {
            return this._sideMenuMediaQuery;
        }

        /**
         * Sets a flag that indicates if the side menu should be available.
         * 
         * By default a media query is used to show the side menu when the device is in landscape
         * and has a minimum width of 768px (eg a tablet).
         * 
         * @param allow Set to true to use the media query to determine if the menu is available, false to ensure the menu isn't available.
         */
        public setAllowSideMenu(allow: boolean): void {

            if (allow) {
                this._sideMenuMediaQuery = this._sideMenuMediaQueryVisibleOnLandscapeTablet;
            }
            else {
                this._sideMenuMediaQuery = this._sideMenuMediaQueryNeverVisible;
            }

            this.$ionicSideMenuDelegate._instances[0].exposeAside(this.$window.matchMedia(this._sideMenuMediaQuery).matches);
            this.$ionicSideMenuDelegate.canDragContent(allow);
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
                q.reject(Constants.DIALOG_ALREADY_OPEN);
                return q.promise;
            }

            // If there is a PIN set and a last paused time then we need to determine if we
            // need to show the lock screen.
            if (this.Preferences.pin && this.Configuration.lastPausedAt != null && this.Configuration.lastPausedAt.isValid()) {
                // Get the current time.
                resumedAt = moment();

                // If the time elapsed since the last pause event is greater than the threshold,
                // then we need to show the lock screen.
                if (resumedAt.diff(this.Configuration.lastPausedAt, "minutes") > this.Configuration.requirePinThreshold) {

                    model = new Models.PinEntryDialogModel("PIN Required", this.Preferences.pin, false);
                    options = new Models.DialogOptions(model);
                    options.backdropClickToClose = false;
                    options.hardwareBackButtonClose = false;
                    options.showBackground = false;

                    this.showDialog(Controllers.PinEntryController.ID, options).then((result: Models.PinEntryDialogResultModel) => {
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
