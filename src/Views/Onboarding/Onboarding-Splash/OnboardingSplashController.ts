namespace JustinCredible.SampleApp.Controllers {

    export class OnboardingSplashController extends BaseController<ViewModels.EmptyViewModel> {

        //#region Injection

        public static ID = "OnboardingSplashController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$location",
                "$ionicHistory",
                Services.Utilities.ID,
                Services.UIHelper.ID,
                Services.Configuration.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private $location: ng.ILocationService,
            private $ionicHistory: ionic.navigation.IonicHistoryService,
            private Utilities: Services.Utilities,
            private UIHelper: Services.UIHelper,
            private Configuration: Services.Configuration) {
            super($scope, ViewModels.EmptyViewModel);
        }

        //#endregion

        //#region BaseController Overrides

        protected view_beforeEnter(event?: ng.IAngularEvent, eventArgs?: Interfaces.ViewEventArguments): void {
            super.view_beforeEnter(event, eventArgs);

            // During onboarding the menu shouldn't be visible.
            _.defer(() => {
                this.UIHelper.setAllowSideMenu(false);
            });
        }

        //#endregion

        //#region UI Events

        protected skip_click(): void {

            // Allow the side menu to be shown again.
            this.UIHelper.setAllowSideMenu(true);

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
