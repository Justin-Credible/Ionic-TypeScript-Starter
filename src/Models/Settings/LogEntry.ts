module JustinCredible.SampleApp.Models {

    export class LogEntry {

        public id: string;

        public timestamp: Date;
        public message: string;

        public uri: string;
        public lineNumber: number;
        public colNumber: number;

        public error: Error;

        public httpMethod: string;
        public httpUrl: string;
        public httpStatus: number;
        public httpStatusText: string;
        public httpHeaders: string;
        public httpBody: string;
    }

}
