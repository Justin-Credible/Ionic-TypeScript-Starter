
namespace JustinCredible.SampleApp.Controllers {

    export class DevLogsFilterController extends BasePopoverController<ViewModels.DevLogsFilterViewModel> {

        //#region Injection

        public static ID = "DevLogsFilterController";
        public static TemplatePath = "Views/Settings/Developer/Dev-Logs-List/Dev-Logs-Filter/Dev-Logs-Filter.html";

        public static get $inject(): string[] {
            return [
                "$scope",
            ];
        }

        constructor(
            $scope: ng.IScope) {
            super($scope, ViewModels.DevLogsFilterViewModel);

            this.scope.$on("setFilters", _.bind(this.parent_setFilters, this));

            this.viewModel.httpColor = Models.LogLevel.getColor(Models.LogLevel.Debug);
            this.viewModel.httpIcon = "ion-ios-world-outline";

            this.viewModel.debugColor = Models.LogLevel.getColor(Models.LogLevel.Debug);
            this.viewModel.debugIcon = Models.LogLevel.getIcon(Models.LogLevel.Debug);

            this.viewModel.infoColor = Models.LogLevel.getColor(Models.LogLevel.Info);
            this.viewModel.infoIcon = Models.LogLevel.getIcon(Models.LogLevel.Info);

            this.viewModel.warnColor = Models.LogLevel.getColor(Models.LogLevel.Warn);
            this.viewModel.warnIcon = Models.LogLevel.getIcon(Models.LogLevel.Warn);

            this.viewModel.errorColor = Models.LogLevel.getColor(Models.LogLevel.Error);
            this.viewModel.errorIcon = Models.LogLevel.getIcon(Models.LogLevel.Error);
        }

        //#endregion

        //#region Events

        private parent_setFilters($event: ng.IAngularEvent, filters: ViewModels.DevLogsFilterViewModel): void {
            this.viewModel.showDebugOnlyHTTP = filters.showDebugOnlyHTTP;
            this.viewModel.showDebug = filters.showDebug;
            this.viewModel.showInfo = filters.showInfo;
            this.viewModel.showWarn = filters.showWarn;
            this.viewModel.showError = filters.showError;
        }

        //#endregion

        //#region Controller Methods

        protected debug_click(): void {

            this.viewModel.showDebug = !this.viewModel.showDebug;

            if (this.viewModel.showDebug) {
                this.viewModel.showDebugOnlyHTTP = false;
            }

            this.scope.$emit("filtersChanged", this.viewModel);
        }

        protected debugOnlyHTTP_click(): void {

            this.viewModel.showDebugOnlyHTTP = !this.viewModel.showDebugOnlyHTTP;

            if (this.viewModel.showDebugOnlyHTTP) {
                this.viewModel.showDebug = false;
            }

            this.scope.$emit("filtersChanged", this.viewModel);
        }

        protected info_click(): void {
            this.viewModel.showInfo = !this.viewModel.showInfo;
            this.scope.$emit("filtersChanged", this.viewModel);
        }

        protected warn_click(): void {
            this.viewModel.showWarn = !this.viewModel.showWarn;
            this.scope.$emit("filtersChanged", this.viewModel);
        }

        protected error_click(): void {
            this.viewModel.showError = !this.viewModel.showError;
            this.scope.$emit("filtersChanged", this.viewModel);
        }

        //#endregion
    }
}
