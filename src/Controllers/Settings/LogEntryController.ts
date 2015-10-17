module JustinCredible.SampleApp.Controllers {

    export interface ILogEntryStateParams {
        id: string;
    }

    export class LogEntryController extends BaseController<ViewModels.LogEntryViewModel> {

        //#region Injection

        public static ID = "LogEntryController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$stateParams",
                Services.Logger.ID,
                Services.Plugins.ID,
                Services.Utilities.ID,
                "versionInfo"];
        }

        constructor(
            $scope: ng.IScope,
            private $stateParams: ILogEntryStateParams,
            private Logger: Services.Logger,
            private Plugins: Services.Plugins,
            private Utilities: Services.Utilities,
            private versionInfo: Interfaces.VersionInfo) {
            super($scope, ViewModels.LogEntryViewModel);
        }

        //#endregion

        //#region BaseController Overrides

        protected view_beforeEnter(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
            super.view_beforeEnter(event, eventArgs);

            this.viewModel.logEntry = this.Logger.getLog(this.$stateParams.id);
            //TODO populate the rest of the properties here. date, time, leveldisplay via logger.getLevelDisplayText()
            //TODO Format the metadata (pretty json?)

            //TODO: MOve this to logger.getIcon
            switch (this.viewModel.logEntry.logLevel) {
                case Models.LogLevel.TRACE:
                    this.viewModel.icon = "ion-code-working";
                    break;
                case Models.LogLevel.DEBUG:
                    this.viewModel.icon = "ion-bug";
                    break;
                case Models.LogLevel.INFO:
                    this.viewModel.icon = "ion-information-circled";
                    break;
                case Models.LogLevel.WARN:
                    this.viewModel.icon = "ion-alert-circled";
                    break;
                case Models.LogLevel.ERROR:
                    this.viewModel.icon = "ion-alert";
                    break;
                case Models.LogLevel.FATAL:
                    this.viewModel.icon = "ion-nuclear";
                    break;
                default:
                    this.viewModel.icon = "ion-alert";
                    break;
            }
        }

        //#endregion

        //#region Controller Methods

        protected copy_click(): void {
            this.Plugins.clipboard.copy(JSON.stringify(this.viewModel.logEntry), () => {
                this.Plugins.toast.showShortBottom("Log copied to clipboard!");
            }, null);
        }

        protected email_click(): void {
            var uri = this.Utilities.format("mailto:{0}?subject={1} Error Log&body={2}", this.versionInfo.email, this.versionInfo.applicationName, JSON.stringify(this.viewModel.logEntry));
            uri = encodeURI(uri);
            window.open(uri, "_system");
        }

        //#endregion
    }
}
