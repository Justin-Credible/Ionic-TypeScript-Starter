module JustinCredible.SampleApp.Controllers {

    export class SettingsListController extends BaseController<ViewModels.SettingsListViewModel> {

        //#region Injection

        public static ID = "SettingsListController";

        public static get $inject(): string[] {
            return [
                "$scope",
                Services.Utilities.ID,
                Services.Configuration.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private Utilities: Services.Utilities,
            private Configuration: Services.Configuration) {
            super($scope, ViewModels.SettingsListViewModel);
        }

        //#endregion

        //#region BaseController Overrides

        protected view_beforeEnter(): void {
            super.view_beforeEnter();

            this.viewModel.isDebugMode = this.Utilities.isDebugMode;
            this.viewModel.isDeveloperMode = this.Configuration.enableDeveloperTools;
        }

        //#endregion
    }
}
