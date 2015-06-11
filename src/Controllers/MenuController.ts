module JustinCredible.SampleApp.Controllers {

    export interface IMenuController {
        viewModel: ViewModels.MenuViewModel;
    }

    export class MenuController extends BaseController<ViewModels.MenuViewModel> implements IMenuController {

        public static $inject = ["$scope", "$location", "$http", "Utilities", "UiHelper", "Preferences"];

        private $location: ng.ILocationService;
        private $http: ng.IHttpService;
        private Utilities: Services.Utilities;
        private UiHelper: Services.UiHelper;
        private Preferences: Services.Preferences;

        constructor($scope: ng.IScope, $location: ng.ILocationService, $http: ng.IHttpService, Utilities: Services.Utilities, UiHelper: Services.UiHelper, Preferences: Services.Preferences) {
            super($scope, ViewModels.MenuViewModel);

            this.$location = $location;
            this.$http = $http;
            this.Utilities = Utilities;
            this.UiHelper = UiHelper;
            this.Preferences = Preferences;

            this.viewModel.categories = this.Utilities.categories;

            $scope.$on("http.unauthorized", _.bind(this.http_unauthorized, this));
            $scope.$on("http.forbidden", _.bind(this.http_forbidden, this));
            $scope.$on("http.notFound", _.bind(this.http_notFound, this));
        }

        //#region Event Handlers

        private http_unauthorized() {

            // Unauthorized should mean that a token wasn't sent, but we'll null these out anyways.
            this.Preferences.userId = null;
            this.Preferences.token = null;

            this.UiHelper.toast.showLongBottom("You do not have a token (401); please login.");
        }

        private http_forbidden() {

            // A token was sent, but was no longer valid. Null out the invalid token.
            this.Preferences.userId = null;
            this.Preferences.token = null;

            this.UiHelper.toast.showLongBottom("Your token has expired (403); please login again.");
        }

        private http_notFound() {
            // The restful API services are down maybe?
            this.UiHelper.toast.showLongBottom("Server not available (404); please contact your administrator.");
        }

        //#endregion

        //#region Controller Methods

        protected reorder_click() {
            this.UiHelper.showDialog(this.UiHelper.DialogIds.ReorderCategories).then(() => {
                // After the re-order dialog is closed, re-populate the category
                // items since they may have been re-ordered.
                this.viewModel.categories = this.Utilities.categories;
            });
        }

        //#endregion
    }
}
