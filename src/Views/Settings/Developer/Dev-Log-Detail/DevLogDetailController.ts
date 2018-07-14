
namespace JustinCredible.SampleApp.Controllers {

    export class DevLogDetailController extends BaseController<ViewModels.DevLogDetailViewModel> {

        //#region Injection

        public static ID = "DevLogDetailController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$stateParams",
                Services.Logger.ID,
                Services.Plugins.ID,
                Services.Utilities.ID,
            ];
        }

        constructor(
            $scope: ng.IScope,
            private $stateParams: Models.DevLogDetailParams,
            private Logger: Services.Logger,
            private Plugins: Services.Plugins,
            private Utilities: Services.Utilities,
            ) {
            super($scope, ViewModels.DevLogDetailViewModel);
        }

        //#endregion

        //#region BaseController Overrides

        protected view_beforeEnter(event?: ng.IAngularEvent, eventArgs?: Interfaces.ViewEventArguments): void {
            super.view_beforeEnter(event, eventArgs);

            this.viewModel.logEntry = this.Logger.getLog(this.$stateParams.id);

            this.viewModel.date = moment(this.viewModel.logEntry.timestamp).format("MMMM Do YYYY");
            this.viewModel.time = moment(this.viewModel.logEntry.timestamp).format("h:mm:ss a");

            try {
                this.viewModel.formattedMetadata = JSON.stringify(this.viewModel.logEntry.metadata, null, 1);
            }
            catch (exception) {
                this.viewModel.formattedMetadata = "Unable to stringify metadata: " + exception;
            }

            this.viewModel.icon = Models.LogLevel.getIcon(this.viewModel.logEntry.level);
            this.viewModel.color = Models.LogLevel.getColor(this.viewModel.logEntry.level);
            this.viewModel.levelDisplay = Models.LogLevel.getDisplayText(this.viewModel.logEntry.level);

            // If this was a log from the HTTP interceptor, use the network icon.
            if (this.viewModel.logEntry.tag.indexOf(Services.HttpInterceptor.ID) > -1) {
                this.viewModel.icon = "ion-ios-world-outline";
            }
        }

        //#endregion

        //#region Controller Methods

        protected copy_click(): void {

            let json = JSON.stringify(this.viewModel.logEntry, null, 4);

            // TODO: STARTER
            this.Plugins.clipboard.copy(json, () => {
                // this.UIHelper.showInfoSnackbar("Log copied to clipboard!");
            }, null);
        }

        protected email_click(): void {

            // TODO: STARTER
            var uri = this.Utilities.format("mailto:{0}?subject={1} Log&body={2}",
                "", //this.Configuration.values.AUTHOR_EMAIL,
                "", //this.Configuration.values.APP_NAME,
                JSON.stringify(this.viewModel.logEntry));

            uri = encodeURI(uri);
            window.open(uri, "_system");
        }

        //#endregion
    }
}
