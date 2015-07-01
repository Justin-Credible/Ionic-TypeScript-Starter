module JustinCredible.SampleApp.Controllers {

    export class SettingsListController extends BaseController<ViewModels.SettingsListViewModel> {

        public static ID = "SettingsListController";

        public static get $inject(): string[] {
            return ["$scope", Services.Utilities.ID, Services.Preferences.ID];
        }

        private Utilities: Services.Utilities;
        private Preferences: Services.Preferences;

        constructor($scope: ng.IScope, Utilities: Services.Utilities, Preferences: Services.Preferences) {
            super($scope, ViewModels.SettingsListViewModel);

            this.Utilities = Utilities;
            this.Preferences = Preferences;
        }

        //#region BaseController Overrides

        protected view_beforeEnter(): void {
            super.view_beforeEnter();

            this.viewModel.isDebugMode = this.Utilities.isDebugMode;
            this.viewModel.isDeveloperMode = this.Preferences.enableDeveloperTools;
        }

        //#endregion
    }
}
