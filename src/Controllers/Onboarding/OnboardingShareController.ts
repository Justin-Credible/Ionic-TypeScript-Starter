module JustinCredible.SampleApp.Controllers {

    export class OnboardingShareController extends BaseController<ViewModels.EmptyViewModel> {

        public static ID = "OnboardingShareController";

        public static $inject = ["$scope", "$location", "$ionicViewService", "Utilities", "UiHelper", "Preferences"];

        private $location: ng.ILocationService;
        private $ionicViewService: any;
        private Utilities: Services.Utilities;
        private UiHelper: Services.UiHelper;
        private Preferences: Services.Preferences;

        constructor($scope: ng.IScope, $location: ng.ILocationService, $ionicViewService: any, Utilities: Services.Utilities, UiHelper: Services.UiHelper, Preferences: Services.Preferences) {
            super($scope, ViewModels.EmptyViewModel);

            this.$location = $location;
            this.$ionicViewService = $ionicViewService;
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

            // Tell Ionic to not animate and clear the history (hide the back button)
            // for the next view that we'll be navigating to below.
            this.$ionicViewService.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });

            // Navigate the user to their default view.
            this.$location.path(this.Utilities.defaultCategory.href.substring(1));
            this.$location.replace();
        }

        //#endregion
    }
}
