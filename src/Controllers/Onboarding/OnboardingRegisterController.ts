module JustinCredible.SampleApp.Controllers {

    export class OnboardingRegisterController extends BaseController<ViewModels.OnboardingRegisterViewModel> {

        //#region Injection

        public static ID = "OnboardingRegisterController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$location",
                "$ionicHistory",
                Services.Utilities.ID,
                Services.UiHelper.ID,
                Services.Configuration.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private $location: ng.ILocationService,
            private $ionicHistory: any,
            private Utilities: Services.Utilities,
            private UiHelper: Services.UiHelper,
            private Configuration: Services.Configuration) {
            super($scope, ViewModels.OnboardingRegisterViewModel);
        }

        //#endregion

        //#region BaseController Events

        protected view_beforeEnter(): void {
            super.view_beforeEnter();

            this.viewModel.showSignIn = false;
        }

        //#endregion

        //#region UI Events

        protected createAccount_click(): void {

            if (!this.viewModel.email) {
                this.UiHelper.alert("Please enter a valid e-mail address.");
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

                // Tell Ionic to to hide the back button for the next view.
                this.$ionicHistory.nextViewOptions({
                    disableBack: true
                });

                // Navigate the user to the next onboarding view.
                this.$location.path("/app/onboarding/share");
                this.$location.replace();
                this.scope.$apply();
            }, 3000);
        }

        protected signIn_click(): void {

            if (!this.viewModel.email) {
                this.UiHelper.alert("Please enter a valid e-mail address.");
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

                // Tell Ionic to to hide the back button for the next view.
                this.$ionicHistory.nextViewOptions({
                    disableBack: true
                });

                // Navigate the user to the next onboarding view.
                this.$location.path("/app/onboarding/share");
                this.$location.replace();
                this.scope.$apply();
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
