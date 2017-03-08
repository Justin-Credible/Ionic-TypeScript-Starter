namespace JustinCredible.SampleApp.Controllers {

    export class LogsListController extends BaseController<ViewModels.LogsListViewModel> {

        //#region Injection

        public static ID = "LogsListController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$ionicPopover",
                Services.Logger.ID,
                Services.UIHelper.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private $ionicPopover: ionic.popover.IonicPopoverService,
            private Logger: Services.Logger,
            private UIHelper: Services.UIHelper) {
            super($scope, ViewModels.LogsListViewModel);
        }

        //#endregion

        private _filterMenu: ionic.popover.IonicPopoverController;

        //#region BaseController Overrides

        protected view_beforeEnter(event?: ng.IAngularEvent, eventArgs?: Interfaces.ViewEventArguments): void {
            super.view_beforeEnter(event, eventArgs);

            this.UIHelper.createPopover(LogFilterMenuController.ID)
                .then((popover: ionic.popover.IonicPopoverController) => {

                this._filterMenu = popover;
                this._filterMenu.scope.$on("filtersChanged", _.bind(this.filterMenu_filtersChanged, this));
            });

            this.viewModel.showError = true;
            this.viewModel.showWarn = true;
            this.viewModel.showFatal = true;

            this.populateViewModel(this.Logger.logs);
        }

        //#endregion

        //#region Events

        private filterMenu_filtersChanged($event: ng.IAngularEvent, filters: ViewModels.LogFilterMenuViewModel): void {

            this.viewModel.showTrace = filters.showTrace;
            this.viewModel.showDebug = filters.showDebug;
            this.viewModel.showInfo = filters.showInfo;
            this.viewModel.showWarn = filters.showWarn;
            this.viewModel.showError = filters.showError;
            this.viewModel.showFatal = filters.showFatal;

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

            let filters = new ViewModels.LogFilterMenuViewModel();
            filters.showTrace = this.viewModel.showTrace;
            filters.showDebug = this.viewModel.showDebug;
            filters.showInfo = this.viewModel.showInfo;
            filters.showWarn = this.viewModel.showWarn;
            filters.showError = this.viewModel.showError;
            filters.showFatal = this.viewModel.showFatal;

            this._filterMenu.scope.$broadcast("setFilters", filters);

            this._filterMenu.show(event);
        }

        protected clear_click() {
            this.UIHelper.confirm("Are you sure you want to clear the logs?", "Clear Logs").then((result: string) => {
                if (result === Constants.Buttons.Yes) {
                    this.Logger.clear();
                    this.viewModel.logs = {};
                }
            });
        }

        //#endregion
    }
}
