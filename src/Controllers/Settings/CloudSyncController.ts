module JustinCredible.SampleApp.Controllers {

    export class CloudSyncController extends BaseController<ViewModels.CloudSyncViewModel> {

        public static ID = "CloudSyncController";

        public static $inject = ["$scope", "$ionicViewService"];

        private $ionicViewService: any;

        private cloudIconPanel: Directives.IIconPanelDirectiveInstance;
        private updateInterval: number;

        constructor($scope: ng.IScope, $ionicViewService: any) {
            super($scope, ViewModels.CloudSyncViewModel);

            this.$ionicViewService = $ionicViewService;

            // Subscribe to the icon-panel's created event by name ("cloud-icon-panel").
            this.scope.$on("icon-panel.cloud-icon-panel.created", _.bind(this.iconPanel_created, this));
        }

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
            clearInterval(this.updateInterval);
        }

        private iconPanel_created(event: ng.IAngularEvent, instance: Directives.IIconPanelDirectiveInstance) {
            // Store a reference to the instance of this icon-panel so we can use it later.
            this.cloudIconPanel = instance;

            // Register the toggleIcon function to fire every second to swap the cloud icon.
            this.updateInterval = setInterval(_.bind(this.toggleIcon, this), 1000);
        }

        //#endregion

        //#region Private Methods

        private toggleIcon() {

            // Simply switch the icon depending on which icon is currently set.
            if (this.cloudIconPanel.getIcon() === "ion-ios-cloud-upload-outline") {
                this.cloudIconPanel.setIcon("ion-ios-cloud-download-outline");
            }
            else {
                this.cloudIconPanel.setIcon("ion-ios-cloud-upload-outline");
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
            clearInterval(this.updateInterval);

            // Change the text on the icon panel using the instance directly.
            this.cloudIconPanel.setText("Unable to contact the cloud!");

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
