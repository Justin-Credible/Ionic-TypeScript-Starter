module JustinCredible.SampleApp.Controllers {

    export class LogsListController extends BaseController<ViewModels.LogsListViewModel> {

        //#region Injection

        public static ID = "LogsListController";

        public static get $inject(): string[] {
            return [
                "$scope",
                Services.Logger.ID,
                Services.UiHelper.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private Logger: Services.Logger,
            private UiHelper: Services.UiHelper) {
            super($scope, ViewModels.LogsListViewModel);
        }

        //#endregion

        //#region BaseController Overrides

        protected view_beforeEnter(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
            super.view_beforeEnter(event, eventArgs);

            this.setupViewModel(this.Logger.logs);
        }

        //#endregion

        //#region Private Helper Methods

        private setupViewModel(logEntries: Models.LogEntry[]): void {

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

                // Put the actual log entry into the view model.
                viewModel.logEntry = logEntry;

                // Determine the icon based on the log level.
                switch (logEntry.level) {
                    case Models.LogLevel.TRACE:
                        viewModel.icon = "ion-code-working";
                        break;
                    case Models.LogLevel.DEBUG:
                        viewModel.icon = "ion-bug";
                        break;
                    case Models.LogLevel.INFO:
                        viewModel.icon = "ion-information-circled";
                        break;
                    case Models.LogLevel.WARN:
                        viewModel.icon = "ion-alert-circled";
                        break;
                    case Models.LogLevel.ERROR:
                        viewModel.icon = "ion-alert";
                        break;
                    case Models.LogLevel.FATAL:
                        viewModel.icon = "ion-nuclear";
                        break;
                    default:
                        viewModel.icon = "ion-alert";
                        break;
                }

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

        //#endregion

        //#region Controller Methods

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
