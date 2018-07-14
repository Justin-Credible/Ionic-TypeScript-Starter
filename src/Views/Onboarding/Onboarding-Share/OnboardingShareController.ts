namespace JustinCredible.SampleApp.Controllers {

    export class OnboardingShareController extends BaseController<ViewModels.EmptyViewModel> {

        //#region Injection

        public static ID = "OnboardingShareController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$location",
                "$ionicHistory",
                Services.MenuDataSource.ID,
                Services.UIHelper.ID,
                Services.Configuration.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private $location: ng.ILocationService,
            private $ionicHistory: ionic.navigation.IonicHistoryService,
            private MenuDataSource: Services.MenuDataSource,
            private UIHelper: Services.UIHelper,
            private Configuration: Services.Configuration) {
            super($scope, ViewModels.EmptyViewModel);
        }

        //#endregion

        //#region UI Events

        protected share_click(platformName: string): void {
            this.UIHelper.showSuccessSnackbar("Share for " + platformName);
        }

        protected done_click(): void {

            // Allow the side menu to be shown again.
            this.UIHelper.setAllowSideMenu(true);

            // Set the preference value so onboarding doesn't occur again.
            this.Configuration.hasCompletedOnboarding = true;

            // Tell Ionic to to hide the back button for the next view.
            this.$ionicHistory.nextViewOptions({
                disableBack: true
            });

            // Navigate the user to their default view.
            this.$location.path(this.MenuDataSource.defaultCategory.href.substring(1));
            this.$location.replace();
        }

        //#endregion
    }
}
