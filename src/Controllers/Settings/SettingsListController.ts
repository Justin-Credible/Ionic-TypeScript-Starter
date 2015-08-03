module JustinCredible.SampleApp.Controllers {

    export class SettingsListController extends BaseController<ViewModels.SettingsListViewModel> {

        public static ID = "SettingsListController";

        public static get $inject(): string[] {
            return ["$scope", Services.Utilities.ID, Services.Configuration.ID];
        }

        private Utilities: Services.Utilities;
        private Configuration: Services.Configuration;

        constructor($scope: ng.IScope, Utilities: Services.Utilities, Configuration: Services.Configuration) {
            super($scope, ViewModels.SettingsListViewModel);

            this.Utilities = Utilities;
            this.Configuration = Configuration;
        }

        //#region BaseController Overrides

        protected view_beforeEnter(): void {
            super.view_beforeEnter();

            this.viewModel.isDebugMode = this.Utilities.isDebugMode;
            this.viewModel.isDeveloperMode = this.Configuration.enableDeveloperTools;
        }

        //#endregion
    }
}
