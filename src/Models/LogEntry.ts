namespace JustinCredible.SampleApp.Models {

    export class LogEntry {
        public id: string;
        public timestamp: moment.Moment;
        public level: LogLevel;
        public tag: string;
        public message: string;
        public metadata: any;
    }

}
