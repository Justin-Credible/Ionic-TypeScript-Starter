namespace JustinCredible.SampleApp.Controllers {

    export class LogFilterMenuController extends BasePopoverController<ViewModels.LogFilterMenuViewModel> {

        //#region Injection

        public static ID = "LogFilterMenuController";
        public static TemplatePath = "Views/Settings/Logs-List/Log-Filter-Menu/Log-Filter-Menu.html";

        public static get $inject(): string[] {
            return [
                "$scope",
            ];
        }

        constructor(
            $scope: ng.IScope) {
            super($scope, ViewModels.LogsListViewModel);

            this.scope.$on("setFilters", _.bind(this.parent_setFilters, this));
        }

        //#endregion

        //#region Events

        private parent_setFilters($event: ng.IAngularEvent, filters: ViewModels.LogFilterMenuViewModel): void {
            this.viewModel.showTrace = filters.showTrace;
            this.viewModel.showDebug = filters.showDebug;
            this.viewModel.showInfo = filters.showInfo;
            this.viewModel.showWarn = filters.showWarn;
            this.viewModel.showError = filters.showError;
            this.viewModel.showFatal = filters.showFatal;
        }

        //#endregion

        //#region Controller Methods

        protected trace_click(): void {
            this.viewModel.showTrace = !this.viewModel.showTrace;
            this.scope.$emit("filtersChanged", this.viewModel);
        }

        protected debug_click(): void {
            this.viewModel.showDebug = !this.viewModel.showDebug;
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

        protected fatal_click(): void {
            this.viewModel.showFatal = !this.viewModel.showFatal;
            this.scope.$emit("filtersChanged", this.viewModel);
        }

        //#endregion
    }
}
