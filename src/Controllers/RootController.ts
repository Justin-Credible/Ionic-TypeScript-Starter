module JustinCredible.SampleApp.Controllers {

    export class RootController extends BaseController<ViewModels.RootViewModel> {

        //#region Injection

        public static ID = "RootController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$location",
                "$http",
                Services.Utilities.ID,
                Services.UiHelper.ID,
                Services.Preferences.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private $location: ng.ILocationService,
            private $http: ng.IHttpService,
            private Utilities: Services.Utilities,
            private UiHelper: Services.UiHelper,
            private Preferences: Services.Preferences) {
            super($scope, ViewModels.RootViewModel);
        }

        //#endregion

        //#region BaseController Overrides

        protected initialize(): void {

            this.scope.$on(Constants.Events.HTTP_UNAUTHORIZED, _.bind(this.http_unauthorized, this));
            this.scope.$on(Constants.Events.HTTP_FORBIDDEN, _.bind(this.http_forbidden, this));
            this.scope.$on(Constants.Events.HTTP_NOT_FOUND, _.bind(this.http_notFound, this));
            this.scope.$on(Constants.Events.HTTP_UNKNOWN_ERROR, _.bind(this.http_unknownError, this));
            this.scope.$on(Constants.Events.HTTP_ERROR, _.bind(this.http_error, this));

            this.viewModel.categories = this.Utilities.categories;
        }

        //#endregion

        //#region Event Handlers

        private http_unauthorized(event: ng.IAngularEvent, response: ng.IHttpPromiseCallbackArg<any>) {

            // Unauthorized should mean that a token wasn't sent, but we'll null these out anyways.
            this.Preferences.userId = null;
            this.Preferences.token = null;

            this.UiHelper.toast.showLongBottom("You do not have a token (401); please login.");
        }

        private http_forbidden(event: ng.IAngularEvent, response: ng.IHttpPromiseCallbackArg<any>) {

            // A token was sent, but was no longer valid. Null out the invalid token.
            this.Preferences.userId = null;
            this.Preferences.token = null;

            this.UiHelper.toast.showLongBottom("Your token has expired (403); please login again.");
        }

        private http_notFound(event: ng.IAngularEvent, response: ng.IHttpPromiseCallbackArg<any>) {
            // The restful API services are down maybe?
            this.UiHelper.toast.showLongBottom("Server not available (404); please contact your administrator.");
        }

        private http_unknownError(event: ng.IAngularEvent, response: ng.IHttpPromiseCallbackArg<any>) {
            // No network connection, invalid certificate, or other system level error.
            this.UiHelper.toast.showLongBottom("Network error; please try again later.");
        }

        /**
         * A generic catch all for HTTP errors that are not handled above in the other
         * error handlers.
         */
        private http_error(event: ng.IAngularEvent, response: ng.IHttpPromiseCallbackArg<any>): void {
            this.UiHelper.toast.showLongBottom("An error has occurred; please try again.");
        }

        //#endregion

        //#region Controller Methods

        protected reorder_click() {
            this.UiHelper.showDialog(ReorderCategoriesController.ID).then(() => {
                // After the re-order dialog is closed, re-populate the category
                // items since they may have been re-ordered.
                this.viewModel.categories = this.Utilities.categories;
            });
        }

        //#endregion
    }
}
