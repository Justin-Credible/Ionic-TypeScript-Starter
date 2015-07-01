module JustinCredible.SampleApp.Controllers {

    export class OnboardingRegisterController extends BaseController<ViewModels.OnboardingRegisterViewModel> {

        public static ID = "OnboardingRegisterController";

        public static get $inject(): string[] {
            return ["$scope", "$location", "$ionicViewService", Services.Utilities.ID, Services.UiHelper.ID, Services.Preferences.ID];
        }

        private $location: ng.ILocationService;
        private $ionicViewService: any;
        private Utilities: Services.Utilities;
        private UiHelper: Services.UiHelper;
        private Preferences: Services.Preferences;

        constructor($scope: ng.IScope, $location: ng.ILocationService, $ionicViewService: any, Utilities: Services.Utilities, UiHelper: Services.UiHelper, Preferences: Services.Preferences) {
            super($scope, ViewModels.OnboardingRegisterViewModel);

            this.$location = $location;
            this.$ionicViewService = $ionicViewService;
            this.Utilities = Utilities;
            this.UiHelper = UiHelper;
            this.Preferences = Preferences;
        }

        //#region BaseController Events

        protected view_beforeEnter(): void {
            super.view_beforeEnter();

            this.viewModel.showSignIn = false;
        }

        //#endregion

        //#region UI Events

        protected createAccount_click(): void {

            if (!this.viewModel.email) {
                this.UiHelper.alert("Please enter an e-mail address.");
                return;
            }

            if (!this.viewModel.password || !this.viewModel.confirmPassword) {
                this.UiHelper.alert("Please fill in both password fields.");
                return;
            }

            if (this.viewModel.password !== this.viewModel.confirmPassword) {
                this.UiHelper.alert("The passwords do not match; please try again.");
                this.viewModel.password = "";
                this.viewModel.confirmPassword = "";
                return;
            }

            this.UiHelper.progressIndicator.showSimpleWithLabel(true, "Creating Account...");

            // Simulate a wait period for an HTTP request.
            // This is where you'd use a service to interact with your API.
            setTimeout(() => {
                this.UiHelper.progressIndicator.hide();

                // Tell Ionic to not animate and clear the history (hide the back button)
                // for the next view that we'll be navigating to below.
                this.$ionicViewService.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });

                // Navigate the user to the next onboarding view.
                this.$location.path("/app/onboarding/share");
                this.$location.replace();
            }, 3000);
        }

        protected signIn_click(): void {

            if (!this.viewModel.email) {
                this.UiHelper.alert("Please enter an e-mail address.");
                return;
            }

            if (!this.viewModel.password) {
                this.UiHelper.alert("Please enter a password.");
                return;
            }

            this.UiHelper.progressIndicator.showSimpleWithLabel(true, "Signing in...");

            // Simulate a wait period for an HTTP request.
            // This is where you'd use a service to interact with your API.
            setTimeout(() => {
                this.UiHelper.progressIndicator.hide();

                // Tell Ionic to not animate and clear the history (hide the back button)
                // for the next view that we'll be navigating to below.
                this.$ionicViewService.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });

                // Navigate the user to the next onboarding view.
                this.$location.path("/app/onboarding/share");
                this.$location.replace();
            }, 3000);
        }

        protected needToCreateAccount_click(): void {
            this.viewModel.password = "";
            this.viewModel.confirmPassword = "";
            this.viewModel.showSignIn = false;
        }

        protected alreadyHaveAccount_click(): void {
            this.viewModel.confirmPassword = "";
            this.viewModel.showSignIn = true;
        }

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
