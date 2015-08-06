module JustinCredible.SampleApp.Controllers {

    export class OnboardingSplashController extends BaseController<ViewModels.EmptyViewModel> {

        //#region Injection

        public static ID = "OnboardingSplashController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$location",
                "$ionicHistory",
                Services.Utilities.ID,
                Services.Configuration.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private $location: ng.ILocationService,
            private $ionicHistory: any,
            private Utilities: Services.Utilities,
            private Configuration: Services.Configuration) {
            super($scope, ViewModels.EmptyViewModel);
        }

        //#endregion

        //#region UI Events

        protected skip_click(): void {

            // Set the preference value so onboarding doesn't occur again.
            this.Configuration.hasCompletedOnboarding = true;

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
