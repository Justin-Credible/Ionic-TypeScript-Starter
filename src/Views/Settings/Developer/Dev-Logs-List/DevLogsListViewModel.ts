
namespace JustinCredible.SampleApp.ViewModels {

    export class DevLogsListViewModel {

        public logs: { [day: string]: ViewModels.DevLogDetailViewModel[] };

        public showDebug: boolean;
        public showDebugOnlyHTTP: boolean;
        public showInfo: boolean;
        public showWarn: boolean;
        public showError: boolean;

        constructor() {
            this.logs = {};
        }
    }
}
