module JustinCredible.SampleApp.Controllers {

    export class PinEntryController extends BaseDialogController<ViewModels.PinEntryViewModel, Models.PinEntryDialogModel, Models.PinEntryDialogResultModel> {

        //#region Injection

        public static ID = "PinEntryController";
        public static TemplatePath = "templates/Dialogs/Pin-Entry.html";

        public static get $inject(): string[] {
            return [
                "$scope",
                Services.Utilities.ID,
                Services.Preferences.ID,
                Services.UiHelper.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private Utilities: Services.Utilities,
            private Preferences: Services.Preferences,
            private UiHelper: Services.UiHelper) {
            super($scope, ViewModels.PinEntryViewModel, PinEntryController.ID);
        }

        //#endregion

        //#region BaseDialogController Overrides

        protected dialog_shown() {
            super.dialog_shown();

            this.viewModel.pin = "";
            this.viewModel.showBackButton = !!this.getData().showBackButton;
            this.viewModel.promptText = this.getData().promptText;
            this.viewModel.pinToMatch = this.getData().pinToMatch;
        }

        //#endregion

        //#region Private Methods

        private validatePin() {

            if (this.viewModel.pinToMatch) {

                // If there is a PIN to match, then we'll see if it matches. This is
                // for the case when we are validating a user entered PIN against one
                // that is already configured.

                if (this.viewModel.pin === this.viewModel.pinToMatch) {
                    // If the PIN values match, then close this dialog instance.
                    this.close(new Models.PinEntryDialogResultModel(true, false, this.viewModel.pin));
                }
                else {
                    // If the PIN values do not match, then clear the fields and remain
                    // open so the user can try again.
                    this.viewModel.pin = "";
                    this.UiHelper.toast.showShortTop("Invalid pin; please try again.");
                    this.scope.$apply();
                }
            }
            else {
                // If we aren't attempting to match a PIN, then this must be a prompt
                // for a new PIN value. In this case we can just set the result and
                // close this modal instance.
                this.close(new Models.PinEntryDialogResultModel(null, false, this.viewModel.pin));
            }
        }

        //#endregion

        //#region Controller Methods

        protected number_click(value: number) {

            if (this.viewModel.pin.length < 4) {
                this.viewModel.pin += value;

                // If all four digits have been entered then we need to take action.
                // We wait a fraction of a second so that the user can see the last
                // digit in the PIN appear in the UI.
                if (this.viewModel.pin.length === 4) {
                    _.delay(_.bind(this.validatePin, this), 700);
                }
            }
        }

        protected clear_click() {
            this.viewModel.pin = "";
        }

        protected back_click() {
            this.close(new Models.PinEntryDialogResultModel(null, true, null));
        }

        //#endregion
    }
}
