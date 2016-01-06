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

            this.viewModel.applicationName = this.Configuration.buildVars.applicationName;
            this.viewModel.versionString = this.Utilities.format("{0}.{1}.{2}", this.Configuration.buildVars.majorVersion, this.Configuration.buildVars.minorVersion, this.Configuration.buildVars.buildVersion);
            this.viewModel.timestamp = this.Configuration.buildVars.buildTimestamp;
            this.viewModel.commitShortSha = this.Configuration.buildVars.commitShortSha;
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
            window.open(this.Configuration.buildVars.properties.copyrightUrl, "_system");
        }

        protected website_click(): void {
            window.open(this.Configuration.buildVars.websiteUrl, "_system");
        }

        protected gitHubRepo_click(): void {
            window.open(this.Configuration.buildVars.properties.githubUrl, "_system");
        }

        //#endregion
    }
}
