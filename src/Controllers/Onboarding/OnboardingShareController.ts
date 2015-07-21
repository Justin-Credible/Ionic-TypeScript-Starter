module JustinCredible.SampleApp.Controllers {

    export class OnboardingShareController extends BaseController<ViewModels.EmptyViewModel> {

        public static ID = "OnboardingShareController";

        public static get $inject(): string[] {
            return ["$scope", "$location", "$ionicHistory", Services.Utilities.ID, Services.UiHelper.ID, Services.Preferences.ID];
        }

        private $location: ng.ILocationService;
        private $ionicHistory: any;
        private Utilities: Services.Utilities;
        private UiHelper: Services.UiHelper;
        private Preferences: Services.Preferences;

        constructor($scope: ng.IScope, $location: ng.ILocationService, $ionicHistory: any, Utilities: Services.Utilities, UiHelper: Services.UiHelper, Preferences: Services.Preferences) {
            super($scope, ViewModels.EmptyViewModel);

            this.$location = $location;
            this.$ionicHistory = $ionicHistory;
            this.Utilities = Utilities;
            this.UiHelper = UiHelper;
            this.Preferences = Preferences;
        }

        //#region UI Events

        protected share_click(platformName: string): void {
            this.UiHelper.toast.showShortCenter("Share for " + platformName);
        }

        protected done_click(): void {

            // Set the preference value so onboarding doesn't occur again.
            this.Preferences.hasCompletedOnboarding = true;

            // Tell Ionic to to hide the back button for the next view.
            this.$ionicHistory.nextViewOptions({
                disableBack: true
            });

            // Navigate the user to their default view.
            this.$location.path(this.Utilities.defaultCategory.href.substring(1));
            this.$location.replace();
        }

        //#endregion
    }
}
