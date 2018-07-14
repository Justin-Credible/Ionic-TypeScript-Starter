
namespace JustinCredible.SampleApp.ViewModels {

    export class DevLogDetailViewModel {
        public logEntry: Models.LogEntry;
        public icon: string;
        public date: string;
        public time: string;
        public levelDisplay: string;
        public color: string;
        public formattedMetadata: string;

        public httpVerb: string;
        public httpUrl: string;
        public httpCode: string;
    }
}
