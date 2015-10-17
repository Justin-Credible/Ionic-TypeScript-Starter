module JustinCredible.SampleApp.ViewModels {

    export class LogsListViewModel {
        public logs: { [day: string]: ViewModels.LogEntryViewModel[] };

        constructor() {
            this.logs = {};
        }
    }
}