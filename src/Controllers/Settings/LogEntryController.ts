namespace JustinCredible.SampleApp.Controllers {

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
                Services.Configuration.ID];
        }

        constructor(
            $scope: ng.IScope,
            private $stateParams: ILogEntryStateParams,
            private Logger: Services.Logger,
            private Plugins: Services.Plugins,
            private Utilities: Services.Utilities,
            private Configuration: Services.Configuration) {
            super($scope, ViewModels.LogEntryViewModel);
        }

        //#endregion

        //#region BaseController Overrides

        protected view_beforeEnter(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
            super.view_beforeEnter(event, eventArgs);

            this.viewModel.logEntry = this.Logger.getLog(this.$stateParams.id);

            this.viewModel.date = moment(this.viewModel.logEntry.timestamp).format("MMMM Do YYYY");
            this.viewModel.time = moment(this.viewModel.logEntry.timestamp).format("h:mm:ss a");

            try {
                this.viewModel.formattedMetadata = JSON.stringify(this.viewModel.logEntry.metadata, null, 4);
            }
            catch (exception) {
                this.viewModel.formattedMetadata = "Unable to stringify metadata: " + exception;
            }

            this.viewModel.icon = this.Logger.getIconForLevel(this.viewModel.logEntry.level);
            this.viewModel.color = this.Logger.getColorForLevel(this.viewModel.logEntry.level);
            this.viewModel.levelDisplay = this.Logger.getDisplayLevelForLevel(this.viewModel.logEntry.level);
        }

        //#endregion

        //#region Controller Methods

        protected copy_click(): void {
            this.Plugins.clipboard.copy(JSON.stringify(this.viewModel.logEntry), () => {
                this.Plugins.toast.showShortBottom("Log copied to clipboard!");
            }, null);
        }

        protected email_click(): void {
            var uri = this.Utilities.format("mailto:{0}?subject={1} Error Log&body={2}", this.Configuration.buildVars.email, this.Configuration.buildVars.applicationName, JSON.stringify(this.viewModel.logEntry));
            uri = encodeURI(uri);
            window.open(uri, "_system");
        }

        //#endregion
    }
}
