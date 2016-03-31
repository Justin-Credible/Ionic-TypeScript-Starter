namespace JustinCredible.SampleApp.Controllers {

    export class AboutController extends BaseController<ViewModels.AboutViewModel> {

        //#region Injection

        public static ID = "AboutController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$ionicHistory",
                Services.Utilities.ID,
                Services.Configuration.ID,
                Services.Plugins.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private $ionicHistory: any,
            private Utilities: Services.Utilities,
            private Configuration: Services.Configuration,
            private Plugins: Services.Plugins) {
            super($scope, ViewModels.AboutViewModel);
        }

        //#endregion

        //#region BaseController Overrides

        protected view_beforeEnter(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
            super.view_beforeEnter(event, eventArgs);

            this.viewModel.logoClickCount = 0;

            this.viewModel.applicationName = this.Configuration.values.appName;
            this.viewModel.versionString = this.Configuration.values.appVersion;
            this.viewModel.timestamp = this.Configuration.buildTimestamp;
            this.viewModel.commitShortSha = this.Configuration.commitShortSha;
            this.viewModel.authorName = this.Configuration.values.authorName;
        }

        //#endregion

        //#region Controller Methods

        protected logo_click() {

            if (this.Configuration.enableDeveloperTools) {
                return;
            }

            this.viewModel.logoClickCount += 1;

            // If they've clicked the logo 10 times, then enable development tools
            // and push them back to the settings page.
            if (this.viewModel.logoClickCount > 9) {
                this.Configuration.enableDeveloperTools = true;
                this.Plugins.toast.showShortBottom("Development Tools Enabled!");
                this.$ionicHistory.goBack();
            }
        }

        protected copyrightInfo_click(): void {
            window.open(this.Configuration.values.licenseUrl, "_system");
        }

        protected website_click(): void {
            window.open(this.Configuration.values.authorWebsite, "_system");
        }

        protected gitHubRepo_click(): void {
            window.open(this.Configuration.values.githubUrl, "_system");
        }

        //#endregion
    }
}
