namespace JustinCredible.SampleApp.Services {

    /**
     * Provides a common set of helper methods for working with the UI.
     */
    export class UIHelper {

        //#region Injection

        public static ID = "UIHelper";

        public static get $inject(): string[] {
            return [
                "$rootScope",
                "$window",
                "$q",
                "$ionicModal",
                "$ionicPopover",
                "$ionicSideMenuDelegate",
                Utilities.ID,
                Plugins.ID,
                Preferences.ID,
                Configuration.ID,
                Snackbar.ID,
            ];
        }

        constructor(
            private $rootScope: ng.IRootScopeService,
            private $window: Window,
            private $q: ng.IQService,
            private $ionicModal: ionic.modal.IonicModalService,
            private $ionicPopover: ionic.popover.IonicPopoverService,
            private $ionicSideMenuDelegate: ionic.sideMenu.IonicSideMenuDelegate,
            private Utilities: Utilities,
            private Plugins: Plugins,
            private Preferences: Preferences,
            private Configuration: Configuration,
            private Snackbar: Snackbar,
            ) {
        }

        //#endregion

        //#region Dialog Stuff

        /**
         * Keeps track of the currently open dialogs. Used by the showDialog helper method.
         */
        private static _openDialogIds: string[];

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
                callback: (result: NotificationPromptResult) => void;

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

        //#region Toast

        public showInfoSnackbar(message: string, title?: string): void {
            this.Snackbar.info(message, title);
        }

        public showSuccessSnackbar(message: string, title?: string): void {
            this.Snackbar.success(message, title);
        }

        public showErrorSnackbar(message: string, title?: string): void {
            this.Snackbar.error(message, title);
        }

        //#endregion

        //#region Activity Indicator

        /**
         * Blocks user input using an indeterminate spinner.
         * 
         * An optional label can be shown below the spinner.
         * 
         * @param message The optional value to show in a label under the spinner.
         */
        public activityStart(message?: string): void {
            this.Plugins.spinner.activityStart(message);
        }

        /**
         * Allows user input by hiding the indeterminate spinner.
         */
        public activityStop(): void {
            this.Plugins.spinner.activityStop();
        }

        //#endregion

        //#region Modal Dialogs

        /**
         * Used to open the modal dialog with the given dialog ID.
         * 
         * The controller should extend BaseDialogController and should have a public
         * static string property named TemplatePath, which is the path to the Angular
         * template to use.
         * 
         * The Angular template should have have an ng-controller reference to the same
         * controller ID.
         * 
         * this.UIHelper.showDialog(MyDialog.ID);
         * 
         * <ion-popover-view ng-controller="MyDialog">
         * 
         * If a dialog with the given ID is already open, another will not be opened
         * and the promise will be rejected with UIHelper.DIALOG_ALREADY_OPEN.
         * 
         * R - The type of the data object that will be returned when this dialog is closed.
         * 
         * @param dialogID The ID of the dialog to show/open.
         * @returns A promise that will be resolved when the dialog is closed with the dialog's return type.
         */
        public showDialog<R>(dialogID: string): ng.IPromise<R>;

        /**
         * Used to open the modal dialog with the given dialog ID.
         * 
         * The controller should extend BaseDialogController and should have a public
         * static string property named TemplatePath, which is the path to the Angular
         * template to use.
         * 
         * The Angular template should have have an ng-controller reference to the same
         * controller ID.
         * 
         * this.UIHelper.showDialog(MyDialog.ID);
         * 
         * <ion-popover-view ng-controller="MyDialog">
         * 
         * If a dialog with the given ID is already open, another will not be opened
         * and the promise will be rejected with Constants.DIALOG_ALREADY_OPEN.
         * 
         * D - The type of data object that will be passed in when the dialog is opened.
         * R - The type of the data object that will be returned when this dialog is closed.
         * 
         * @param dialogID The ID of the dialog to show/open.
         * @param options The options to use when opening the dialog.
         * @returns A promise that will be resolved when the dialog is closed with the dialog's return type.
         */
        public showDialog<D, R>(dialogID: string, options: Models.DialogOptions<D, R>): ng.IPromise<R>;

        /**
         * Used to open the modal dialog with the given dialog ID.
         * 
         * The controller should extend BaseDialogController and should have a public
         * static string property named TemplatePath, which is the path to the Angular
         * template to use.
         * 
         * The Angular template should have have an ng-controller reference to the same
         * controller ID.
         * 
         * this.UIHelper.showDialog(MyDialog.ID);
         * 
         * <ion-popover-view ng-controller="MyDialog">
         * 
         * If a dialog with the given ID is already open, another will not be opened
         * and the promise will be rejected with Constants.DIALOG_ALREADY_OPEN.
         * 
         * D - The type of data object that will be passed in when the dialog is opened.
         * R - The type of the data object that will be returned when this dialog is closed.
         * 
         * @param dialogID The ID of the dialog to show/open.
         * @param options The options to use when opening the dialog.
         * @returns A promise that will be resolved when the dialog is closed with the dialog's return type.
         */
        public showDialog<D, R>(dialogID: string, options?: Models.DialogOptions<D, R>): ng.IPromise<R> {
            var q = this.$q.defer<R>();

            if (!dialogID) {
                q.reject(new Error("A dialogID is required."));
                return q.promise;
            }

            // Lookup the controller in the Controllers namespace.
            let controllerReference = this.Utilities.getValue(Controllers, dialogID);

            if (!controllerReference) {
                q.reject(new Error("Could not locate a controller with ID in the Controllers namespace."));
                return q.promise;
            }

            // Ensure the controller given actually extends the BaseDialogController class.

            let hasProperBase = this.Utilities.derivesFrom(controllerReference, Controllers.BaseDialogController);

            if (!hasProperBase) {
                q.reject(Error(`The controller with ID ${dialogID} must extend BaseDialogController.`));
                return q.promise;
            }

            // Grab the template path from the controller static property.
            let templatePath = this.Utilities.getValue(controllerReference, "TemplatePath");

            if (typeof(templatePath) !== "string" ) {
                q.reject(new Error(`A static TemplatePath string property was not found on controller with ID ${dialogID}.`));
                return q.promise;
            }

            // Ensure the options object is present.
            if (!options) {
                options = new Models.DialogOptions();
            }

            // Ensure the array is initialized.
            if (UIHelper._openDialogIds == null) {
                UIHelper._openDialogIds = [];
            }

            // If a dialog with this ID is already open, we can reject immediately.
            // This ensures that only a single dialog with a given ID can be open
            // at one time.
            if (_.contains(UIHelper._openDialogIds, dialogID)) {
                this.$q.reject(Constants.DIALOG_ALREADY_OPEN);
                return q.promise;
            }

            // Add the ID of this dialog to the list of dialogs that are open.
            UIHelper._openDialogIds.push(dialogID);

            // Define the arguments that will be used to create the modal instance.
            let modalOptions: ionic.modal.IonicModalOptions = {
                backdropClickToClose: options.backdropClickToClose,
                hardwareBackButtonClose: options.hardwareBackButtonClose
            };

            // Piggyback the ID and data on the options; these are used by BaseDialogController.
            this.Utilities.setValue(modalOptions, "dialogId", dialogID);
            this.Utilities.setValue(modalOptions, "dialogData", options.dialogData);

            // Schedule the modal instance to be created.
            let creationPromise = this.$ionicModal.fromTemplateUrl(templatePath, modalOptions);

            // Once the modal instance has been created...
            creationPromise.then((modal: ionic.modal.IonicModalController) => {
                var backdrop: HTMLDivElement;

                // Show it.
                modal.show();

                // The dialog's header is dark, therefore we want the light text.
                this.Plugins.statusBar.styleBlackTranslucent();

                if (!options.showBackground) {
                    // HACK: Here we adjust the background color's alpha value so the user can't
                    // see through the overlay. At some point we should update this to use a blur
                    // effect similar to this: http://ionicframework.com/demos/frosted-glass/
                    backdrop = <HTMLDivElement> document.querySelector("div.modal-backdrop");
                    backdrop.style.backgroundColor = "rgba(0, 0, 0, 1)";
                }

                // Ensure awaitOn helper function is available in the dialog's views.
                let awaitOn = this.Utilities.getValue(this.$rootScope, "awaitOn");
                this.Utilities.setValue(modal.scope, "awaitOn", awaitOn);

                // Subscribe to the close event.
                modal.scope.$on("modal.hidden", (eventArgs: ng.IAngularEvent, instance: any) => {

                    // Only handle events for the relevant dialog.
                    if (dialogID !== instance.dialogId) {
                        return;
                    }

                    // If we were blocking out the background, we need to revert that now that
                    // we are closing this instance.
                    if (!options.showBackground) {
                        // HACK: Restore the backdrop's background color value.
                        backdrop.style.backgroundColor = "";
                    }

                    // Remove this dialog's ID from the list of ones that are open.
                    UIHelper._openDialogIds = _.without(UIHelper._openDialogIds, dialogID);

                    // If this was the last dialog, revert the styling back to dark text.
                    if (UIHelper._openDialogIds.length === 0) {
                        this.Plugins.statusBar.styleDefault();
                    }

                    // Once the dialog is closed, resolve the original promise
                    // using the result data object from the dialog (if any).
                    let result = this.Utilities.getValue(modal, "result");
                    q.resolve(result);

                });
            });

            return q.promise;
        }

        /**
         * Used to check if the dialog with the given ID is open.
         * 
         * If no ID is provided, used to check if any dialogs are open.
         * 
         * @param dialogId The ID to check.
         * @returns True if the dialog with the given ID is open.
         */
        public isDialogOpen(dialogId?: string): boolean {

            if (!dialogId) {
                return UIHelper._openDialogIds.length > 0;
            }

            return UIHelper._openDialogIds.indexOf(dialogId) > -1;
        }

        /**
         * Used to close all of the open dialogs.
         */
        public closeAllDialogs(): void {
            this.$rootScope.$broadcast(Constants.Events.APP_CLOSE_DIALOG, null);
        }

        /**
         * Used to close the dialog with the given ID.
         * 
         * @param dialogId the ID of the dialog to close.
         */
        public closeDialog(dialogId: string): void {
            this.$rootScope.$broadcast(Constants.Events.APP_CLOSE_DIALOG, dialogId);
        }

        //#endregion

        //#region Popovers

        /**
         * Used to create an Ionic popover instance using the controller with the given
         * ID from the Controllers namespace.
         * 
         * The controller should extend BasePopoverController and should have a public
         * static string property named TemplatePath, which is the path to the Angular
         * template to use.
         * 
         * The Angular template should have have an ng-controller reference to the same
         * controller ID.
         * 
         * this.UIHelper.createPopover(MyPopover.ID, this.scope);
         * 
         * <ion-popover-view ng-controller="MyPopover">
         * 
         * Once the popover is created, the promise will resolve with the popover instance
         * which can then be used to show or hide the popover.
         * 
         * @param controllerID The ID of the controller to use in the popover.
         * @param scope The parent scope for the popover.
         * @param options The options to use when creating the popover.
         * @returns A promise that will be resolved when the popover is created, which will contain the popover instance.
         */
        public createPopover(controllerID: string, options?: ionic.popover.IonicPopoverOptions): angular.IPromise<ionic.popover.IonicPopoverController> {
            let q = this.$q.defer<ionic.popover.IonicPopoverController>();

            if (!controllerID) {
                q.reject(new Error("A controllerID is required."));
                return q.promise;
            }

            // Lookup the controller in the Controllers namespace.
            let controllerReference = this.Utilities.getValue(Controllers, controllerID);

            if (!controllerReference) {
                q.reject(new Error("Could not locate a controller with ID in the Controllers namespace."));
                return q.promise;
            }

            // Ensure the controller given actually extends the BasePopoverController class.

            let hasProperBase = this.Utilities.derivesFrom(controllerReference, Controllers.BasePopoverController);

            if (!hasProperBase) {
                q.reject(new Error(`The controller with ID ${controllerID} must extend BasePopoverController.`));
                return q.promise;
            }

            // Grab the template path from the controller static property.
            let templatePath = this.Utilities.getValue(controllerReference, "TemplatePath");

            if (typeof(templatePath) !== "string" ) {
                q.reject(new Error(`A static TemplatePath string property was not found on controller with ID ${controllerID}.`));
                return q.promise;
            }

            // Ensure the options object is present.
            if (!options) {
                options = {};
            }

            // Set the controllerID onto the options; this is used by BasePopoverController.
            this.Utilities.setValue(options, "controllerID", controllerID);

            // Delegate to the Ionic service to do the actual creation work.
            this.$ionicPopover.fromTemplateUrl(templatePath, options)
                .then((popover: ionic.popover.IonicPopoverController) => {

                q.resolve(popover);

            }).catch((error: any) => {
                q.reject(error);
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

            // tslint:disable-next-line:no-string-literal
            this.$ionicSideMenuDelegate["_instances"][0].exposeAside(this.$window.matchMedia(this._sideMenuMediaQuery).matches);

            this.$ionicSideMenuDelegate.canDragContent(allow);
        }

        //#endregion

        //#region Helpers for the device_resume event

        public showPinEntryAfterResume(): ng.IPromise<void> {
            var q = this.$q.defer<void>(),
                resumedAt: moment.Moment,
                options: Models.DialogOptions<Models.PinEntryDialogModel, Models.PinEntryDialogResultModel>,
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
