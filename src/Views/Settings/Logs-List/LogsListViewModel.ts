namespace JustinCredible.SampleApp.ViewModels {

    export class LogsListViewModel {

        public logs: { [day: string]: ViewModels.LogEntryViewModel[] };

        public showTrace: boolean;
        public showDebug: boolean;
        public showInfo: boolean;
        public showWarn: boolean;
        public showError: boolean;
        public showFatal: boolean;

        constructor() {
            this.logs = {};
        }
    }
}
