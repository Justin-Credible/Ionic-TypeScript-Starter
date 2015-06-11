module JustinCredible.SampleApp.Controllers {

    export interface ISettingsController {
        viewModel: ViewModels.SettingsListViewModel;
    }

    export class SettingsListController extends BaseController<ViewModels.SettingsListViewModel> implements ISettingsController {

        public static $inject = ["$scope", "Utilities", "Preferences"];

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
