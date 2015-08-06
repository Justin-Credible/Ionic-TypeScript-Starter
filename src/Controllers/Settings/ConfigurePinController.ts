module JustinCredible.SampleApp.Controllers {

    export class ConfigurePinController extends BaseController<ViewModels.ConfigurePinViewModel> {

        //#region Injection

        public static ID = "ConfigurePinController";

        public static get $inject(): string[] {
            return [
                "$scope",
                Services.UiHelper.ID,
                Services.Preferences.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private UiHelper: Services.UiHelper,
            private Preferences: Services.Preferences) {
            super($scope, ViewModels.ConfigurePinViewModel);
        }

        //#endregion

        //#region BaseController Overrides

        protected view_beforeEnter(): void {
            super.view_beforeEnter();

            this.viewModel.isPinSet = this.Preferences.pin !== null;
        }

        //#endregion

        //#region Controller Methods

        protected setPin_click() {
            var options: Models.DialogOptions,
                model: Models.PinEntryDialogModel;

            model = new Models.PinEntryDialogModel("Enter a value for your new PIN", null, true);
            options = new Models.DialogOptions(model);

            // Show the PIN entry dialog.
            this.UiHelper.showDialog(PinEntryController.ID, options).then((result1: Models.PinEntryDialogResultModel) => {

                // If there was a PIN returned, they didn't cancel.
                if (result1.pin) {

                    // Show a second prompt to make sure they enter the same PIN twice.
                    // We pass in the first PIN value because we want them to be able to match it.

                    model.promptText = "Confirm your new PIN";
                    model.pinToMatch = result1.pin;
                    options.dialogData = model;

                    this.UiHelper.showDialog(PinEntryController.ID, options).then((result2: Models.PinEntryDialogResultModel) => {

                        // If the second PIN entered matched the first one, then use it.
                        if (result2.matches) {
                            this.Preferences.pin = result2.pin;
                            this.viewModel.isPinSet = true;

                            this.UiHelper.toast.showShortBottom("Your PIN has been configured.");
                        }
                    });
                }
            });
        }

        protected changePin_click() {
            var options: Models.DialogOptions,
                model: Models.PinEntryDialogModel;

            model = new Models.PinEntryDialogModel("Enter your current PIN", this.Preferences.pin, true);
            options = new Models.DialogOptions(model);

            // Show the PIN entry dialog; pass the existing PIN which they need to match.
            this.UiHelper.showDialog(PinEntryController.ID, options).then((result1: Models.PinEntryDialogResultModel) => {

                // If the PIN matched, then we can continue.
                if (result1.matches) {

                    // Prompt for a new PIN.

                    model.promptText = "Enter your new PIN";
                    model.pinToMatch = null;
                    options.dialogData = model;

                    this.UiHelper.showDialog(PinEntryController.ID, options).then((result2: Models.PinEntryDialogResultModel) => {

                        // Show a second prompt to make sure they enter the same PIN twice.
                        // We pass in the first PIN value because we want them to be able to match it.

                        model.promptText = "Confirm your new PIN";
                        model.pinToMatch = result2.pin;
                        options.dialogData = model;

                        this.UiHelper.showDialog(PinEntryController.ID, options).then((result3: Models.PinEntryDialogResultModel) => {

                            // If the second new PIN entered matched the new first one, then use it.
                            if (result3.matches) {
                                this.Preferences.pin = result3.pin;
                                this.viewModel.isPinSet = true;

                                this.UiHelper.toast.showShortBottom("Your PIN has been configured.");
                            }
                        });
                    });
                }
            });
        }

        protected removePin_click() {
            var options: Models.DialogOptions,
                model: Models.PinEntryDialogModel;

            model = new Models.PinEntryDialogModel("Enter your current PIN", this.Preferences.pin, true);
            options = new Models.DialogOptions(model);

            // Show the PIN entry dialog; pass the existing PIN which they need to match.
            this.UiHelper.showDialog(PinEntryController.ID, options).then((result: Models.PinEntryDialogResultModel) => {

                // If the PIN entered matched, then we can remove it.
                if (result.matches) {
                    this.Preferences.pin = null;
                    this.viewModel.isPinSet = false;

                    this.UiHelper.toast.showShortBottom("The PIN has been removed.");
                }

            });
        }

        //#endregion
    }
}
