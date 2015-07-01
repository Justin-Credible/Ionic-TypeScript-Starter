module JustinCredible.SampleApp.Controllers {

    export class OnboardingSplashController extends BaseController<ViewModels.EmptyViewModel> {

        public static ID = "OnboardingSplashController";

        public static get $inject(): string[] {
            return ["$scope", "$location", "$ionicViewService", Services.Utilities.ID, Services.Preferences.ID];
        }

        private $location: ng.ILocationService;
        private $ionicViewService: any;
        private Utilities: Services.Utilities;
        private Preferences: Services.Preferences;

        constructor($scope: ng.IScope, $location: ng.ILocationService, $ionicViewService: any, Utilities: Services.Utilities, Preferences: Services.Preferences) {
            super($scope, ViewModels.EmptyViewModel);

            this.$location = $location;
            this.$ionicViewService = $ionicViewService;
            this.Utilities = Utilities;
            this.Preferences = Preferences;
        }

        //#region UI Events

        protected skip_click(): void {

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
