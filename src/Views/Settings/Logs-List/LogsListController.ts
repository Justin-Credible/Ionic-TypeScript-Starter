namespace JustinCredible.SampleApp.Controllers {

    export class LogsListController extends BaseController<ViewModels.LogsListViewModel> {

        //#region Injection

        public static ID = "LogsListController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$ionicPopover",
                Services.Logger.ID,
                Services.UiHelper.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private $ionicPopover: any,
            private Logger: Services.Logger,
            private UiHelper: Services.UiHelper) {
            super($scope, ViewModels.LogsListViewModel);
        }

        //#endregion

        private _popover: any;

        //#region BaseController Overrides

        protected view_beforeEnter(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
            super.view_beforeEnter(event, eventArgs);

            this.$ionicPopover.fromTemplateUrl("Views/Settings/Logs-List/Log-Filter-Menu.html", {
                scope: this.scope
            }).then((popover: any) => {
                this._popover = popover;
            });

            this.viewModel.showError = true;
            this.viewModel.showWarn = true;
            this.viewModel.showFatal = true;

            this.populateViewModel(this.Logger.logs);
        }

        //#endregion

        //#region Private Helper Methods

        private populateViewModel(logEntries: Models.LogEntry[]): void {

            if (logEntries == null) {
                logEntries = [];
            }

            this.viewModel.logs = {};

            // First, lets sort by the time stamp ascending, then reverse
            // it so we have the most recent log entries at the top.
            logEntries = _.sortBy(logEntries, "timestamp").reverse();

            // Now use the actual log entry to create the view model.
            logEntries.forEach((logEntry: Models.LogEntry) => {
                var formattedDate: string,
                    viewModel: ViewModels.LogEntryViewModel;

                if (!this.isApplicableForCurrentFilter(logEntry)) {
                    return;
                }

                viewModel = new ViewModels.LogEntryViewModel();

                // Put the actual log entry into the view model.
                viewModel.logEntry = logEntry;

                viewModel.time = moment(logEntry.timestamp).format("h:mm:ss a");
                viewModel.icon = this.Logger.getIconForLevel(logEntry.level);
                viewModel.color = this.Logger.getColorForLevel(logEntry.level);
                viewModel.levelDisplay = this.Logger.getDisplayLevelForLevel(logEntry.level);

                // Format the date and time for display.
                formattedDate = moment(logEntry.timestamp).format("l");

                // The view model is a dictionary of formatted dates to an
                // array of log entries that happened on that date. So first,
                // we'll make sure the array exists for this date...
                if (!this.viewModel.logs[formattedDate]) {
                    this.viewModel.logs[formattedDate] = [];
                }

                // ... then we'll push this entry into that days collection.
                this.viewModel.logs[formattedDate].push(viewModel);
            });
        }

        private isApplicableForCurrentFilter(logEntry: Models.LogEntry): boolean {

            if (!logEntry || logEntry.level == null) {
                return true;
            }

            switch (logEntry.level) {
                case Models.LogLevel.TRACE:
                    return this.viewModel.showTrace;
                case Models.LogLevel.DEBUG:
                    return this.viewModel.showDebug;
                case Models.LogLevel.WARN:
                    return this.viewModel.showWarn;
                case Models.LogLevel.INFO:
                    return this.viewModel.showInfo;
                case Models.LogLevel.ERROR:
                    return this.viewModel.showError;
                case Models.LogLevel.FATAL:
                    return this.viewModel.showFatal;
                default:
                    return true;
            }
        }

        //#endregion

        //#region Controller Methods

        protected filter_click(event: ng.IAngularEvent) {
            this._popover.show(event);
        }

        protected trace_click(): void {
            this.viewModel.showTrace = !this.viewModel.showTrace;
            this.populateViewModel(this.Logger.logs);
        }

        protected debug_click(): void {
            this.viewModel.showDebug = !this.viewModel.showDebug;
            this.populateViewModel(this.Logger.logs);
        }

        protected info_click(): void {
            this.viewModel.showInfo = !this.viewModel.showInfo;
            this.populateViewModel(this.Logger.logs);
        }

        protected warn_click(): void {
            this.viewModel.showWarn = !this.viewModel.showWarn;
            this.populateViewModel(this.Logger.logs);
        }

        protected error_click(): void {
            this.viewModel.showError = !this.viewModel.showError;
            this.populateViewModel(this.Logger.logs);
        }

        protected fatal_click(): void {
            this.viewModel.showFatal = !this.viewModel.showFatal;
            this.populateViewModel(this.Logger.logs);
        }

        protected clear_click() {
            this.UiHelper.confirm("Are you sure you want to clear the logs?", "Clear Logs").then((result: string) => {
                if (result === Constants.Buttons.Yes) {
                    this.Logger.clear();
                    this.viewModel.logs = {};
                }
            });
        }

        //#endregion
    }
}
