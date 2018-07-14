
namespace JustinCredible.SampleApp.Controllers {

    export class DevLogsListController extends BaseController<ViewModels.DevLogsListViewModel> {

        //#region Injection

        public static ID = "DevLogsListController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$ionicScrollDelegate",
                Services.Logger.ID,
                Services.UIHelper.ID,
            ];
        }

        constructor(
            $scope: ng.IScope,
            private $ionicScrollDelegate: ionic.scroll.IonicScrollDelegate,
            private Logger: Services.Logger,
            private UIHelper: Services.UIHelper,
            ) {
            super($scope, ViewModels.DevLogsListViewModel);
        }

        //#endregion

        private _filterMenu: ionic.popover.IonicPopoverController;

        //#region BaseController Overrides

        protected view_loaded(event?: ng.IAngularEvent, eventArgs?: Interfaces.ViewEventArguments): void {
            super.view_loaded(event, eventArgs);

            this.UIHelper.createPopover(DevLogsFilterController.ID)
                .then((popover: ionic.popover.IonicPopoverController) => {

                this._filterMenu = popover;
                this._filterMenu.scope.$on("filtersChanged", _.bind(this.filterMenu_filtersChanged, this));
            });

            this.viewModel.showDebug = false;
            this.viewModel.showDebugOnlyHTTP = true;
            this.viewModel.showInfo = true;
            this.viewModel.showError = true;
            this.viewModel.showWarn = true;
        }

        protected view_beforeEnter(event?: ng.IAngularEvent, eventArgs?: Interfaces.ViewEventArguments): void {
            super.view_beforeEnter(event, eventArgs);

            this.populateViewModel(this.Logger.logs);
        }

        //#endregion

        //#region Events

        private filterMenu_filtersChanged($event: ng.IAngularEvent, filters: ViewModels.DevLogsFilterViewModel): void {

            this.viewModel.showDebug = filters.showDebug;
            this.viewModel.showDebugOnlyHTTP = filters.showDebugOnlyHTTP;
            this.viewModel.showInfo = filters.showInfo;
            this.viewModel.showWarn = filters.showWarn;
            this.viewModel.showError = filters.showError;

            this.populateViewModel(this.Logger.logs);

            this.$ionicScrollDelegate.scrollTop();
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

                if (!this.isApplicableForCurrentFilter(logEntry)) {
                    return;
                }

                let viewModel = new ViewModels.DevLogDetailViewModel();

                // Put the actual log entry into the view model.
                viewModel.logEntry = logEntry;

                viewModel.time = moment(logEntry.timestamp).format("h:mm:ss a");
                viewModel.color = Models.LogLevel.getColor(logEntry.level);
                viewModel.levelDisplay = Models.LogLevel.getDisplayText(logEntry.level);

                // If this was a log from the HTTP interceptor, use the network icon.
                // Otherwise we'll delegate to the enum to show the pre-chosen icon.
                if (logEntry.tag.indexOf(Services.HttpInterceptor.ID) > -1) {
                    viewModel.icon = "ion-ios-world-outline";

                    if (logEntry.metadata) {
                        if (logEntry.metadata.method) {
                            viewModel.httpVerb = logEntry.metadata.method;
                        }

                        if (logEntry.metadata.url) {
                            viewModel.httpUrl = logEntry.metadata.url;
                        }

                        if (logEntry.metadata.status) {
                            viewModel.httpCode = logEntry.metadata.status;
                        }

                        if (logEntry.metadata.config && logEntry.metadata.config.method) {
                            viewModel.httpVerb = logEntry.metadata.config.method;
                        }

                        if (logEntry.metadata.config && logEntry.metadata.config.url) {
                            viewModel.httpUrl = logEntry.metadata.config.url;
                        }
                    }
                }
                else {
                    viewModel.icon = Models.LogLevel.getIcon(logEntry.level);
                }

                // Format the date and time for display.
                let formattedDate = moment(logEntry.timestamp).format("l");

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

            // Special case for when we're showing only debug HTTP logs and this happens to be one.
            if (this.viewModel.showDebugOnlyHTTP
                && logEntry.tag.indexOf(Services.HttpInterceptor.ID) > -1) {
                return true;
            }

            switch (logEntry.level) {
                case Models.LogLevel.Debug:
                    return this.viewModel.showDebug;
                case Models.LogLevel.Warn:
                    return this.viewModel.showWarn;
                case Models.LogLevel.Info:
                    return this.viewModel.showInfo;
                case Models.LogLevel.Error:
                    return this.viewModel.showError;
                default:
                    return true;
            }
        }

        //#endregion

        //#region Controller Methods

        protected filter_click(event: ng.IAngularEvent) {

            let filters = new ViewModels.DevLogsFilterViewModel();
            filters.showDebug = this.viewModel.showDebug;
            filters.showDebugOnlyHTTP = this.viewModel.showDebugOnlyHTTP;
            filters.showInfo = this.viewModel.showInfo;
            filters.showWarn = this.viewModel.showWarn;
            filters.showError = this.viewModel.showError;

            this._filterMenu.scope.$broadcast("setFilters", filters);

            this._filterMenu.show(event);
        }

        protected clear_click() {

            this.UIHelper.confirm("Are you sure you want to clear the logs?", "Clear Logs")
                .then((result: string) => {

                if (result === Constants.Buttons.Yes) {
                    this.Logger.clear();
                    this.viewModel.logs = {};
                }
            });
        }

        //#endregion
    }
}
