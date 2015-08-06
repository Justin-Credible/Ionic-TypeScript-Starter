module JustinCredible.SampleApp.Controllers {

    export class CloudSyncController extends BaseController<ViewModels.CloudSyncViewModel> {

        //#region Injection

        public static ID = "CloudSyncController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$ionicHistory"
            ];
        }

        constructor(
            $scope: ng.IScope,
            private $ionicHistory: any) {
            super($scope, ViewModels.CloudSyncViewModel);

            this.scope.$on("icon-panel.cloud-icon-panel.created", _.bind(this.iconPanel_created, this));
        }

        //#endregion

        private _cloudIconPanel: Directives.IIconPanelDirectiveInstance;
        private _updateInterval: number;

        //#region BaseController Overrides

        protected view_beforeEnter(): void {
            super.view_beforeEnter();

            // Setup the view model.
            this.viewModel.showButton = true;
            this.viewModel.showUserCount = true;
            this.viewModel.icon = "ion-ios-cloud-upload-outline";
            this.viewModel.userCount = 2344;
        }

        protected view_leave(): void {
            super.view_leave();

            // Stop the toggleIcon function from firing.
            clearInterval(this._updateInterval);
        }

        private iconPanel_created(event: ng.IAngularEvent, instance: Directives.IIconPanelDirectiveInstance) {
            // Store a reference to the instance of this icon-panel so we can use it later.
            this._cloudIconPanel = instance;

            // Register the toggleIcon function to fire every second to swap the cloud icon.
            this._updateInterval = setInterval(_.bind(this.toggleIcon, this), 1000);
        }

        //#endregion

        //#region Private Methods

        private toggleIcon() {

            // Simply switch the icon depending on which icon is currently set.
            if (this._cloudIconPanel.getIcon() === "ion-ios-cloud-upload-outline") {
                this._cloudIconPanel.setIcon("ion-ios-cloud-download-outline");
            }
            else {
                this._cloudIconPanel.setIcon("ion-ios-cloud-upload-outline");
            }

            // We have to notify Angular that we want an update manually since the
            // setInterval causes this function to be executed outside of an Angular
            // digest cycle.
            this.scope.$apply();
        }

        //#endregion

        //#region Controller Methods

        protected setup_click() {
            // Stop the auto icon swapping.
            clearInterval(this._updateInterval);

            // Change the text on the icon panel using the instance directly.
            this._cloudIconPanel.setText("Unable to contact the cloud!");

            // Can change the icon via a setIcon call on the directive instance
            // or by changing the view model property that it is bound to.
            //this.iconPanel.setIcon("ion-ios-rainy"); // Change via directly the instance.
            this.viewModel.icon = "ion-ios-rainy"; // Change via view model binding.

            // Hide the button and user count text.
            this.viewModel.showButton = false;
            this.viewModel.showUserCount = false;
        }

        //#endregion
    }
}
