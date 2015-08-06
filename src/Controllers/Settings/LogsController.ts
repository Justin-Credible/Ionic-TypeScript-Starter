module JustinCredible.SampleApp.Controllers {

    export class LogsController extends BaseController<ViewModels.LogsViewModel> {

        //#region Injection

        public static ID = "LogsController";

        public static get $inject(): string[] {
            return [
                "$scope",
                Services.Logger.ID,
                Services.Utilities.ID,
                Services.UiHelper.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private Logger: Services.Logger,
            private Utilities: Services.Utilities,
            private UiHelper: Services.UiHelper) {
            super($scope, ViewModels.LogsViewModel);
        }

        //#endregion

        //#region BaseController Overrides

        protected view_beforeEnter(): void {
            super.view_beforeEnter();

            this.Logger.getLogs().then(_.bind(this.getLogs_success, this), _.bind(this.getLogs_failure, this));
        }

        //#endregion

        //#region Private Helper Methods

        private getLogs_success(logEntries: Models.LogEntry[]): void {

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

                viewModel = new ViewModels.LogEntryViewModel();
                viewModel.id = logEntry.id;
                viewModel.message = logEntry.message;
                viewModel.lineNumber = logEntry.lineNumber;
                viewModel.colNumber = logEntry.colNumber;
                viewModel.uri = logEntry.uri;
                viewModel.error = logEntry.error;

                // Format the date and time for display.
                viewModel.time = moment(logEntry.timestamp).format("h:mm:ss a");
                formattedDate = moment(logEntry.timestamp).format("l");
                viewModel.date = formattedDate;

                if (logEntry.error == null) {
                    // If an error object isn't present, then this is likely one of the
                    // unhandled JS exceptions (eg window.onerror).
                    viewModel.iconType = "alert";
                }
                else {
                    // If an error object is present then this error either came from Angular
                    // or it was a manually logged error object.
                    viewModel.iconType = "alert-circled";
                }

                // If this error has HTTP response data, then it came from a RESTful API request.
                if (logEntry.httpUrl) {
                    viewModel.iconType = "android-wifi";
                }

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

        private getLogs_failure(error: Error): void {
            this.UiHelper.toast.showShortBottom("An error occurred while retrieving the logs.");
        }

        //#endregion

        //#region Controller Methods

        protected clearLogs() {
            this.UiHelper.confirm("Are you sure you want to delete the logs?", "Delete Logs").then((result: string) => {
                if (result === Constants.Buttons.Yes) {
                    this.Logger.clearLogs();
                    this.viewModel.logs = {};
                }
            });
        }

        //#endregion
    }
}
