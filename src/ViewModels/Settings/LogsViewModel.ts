module JustinCredible.SampleApp.ViewModels {

    export class LogsViewModel {
        public logs: { [day: string]: LogEntryViewModel[] };

        constructor() {
            this.logs = {};
        }
    }

    export class LogEntryViewModel extends Models.LogEntry {
        public iconType: string;
        public time: string;
        public date: string;
        public formattedStackTrace: string;
    }
}
