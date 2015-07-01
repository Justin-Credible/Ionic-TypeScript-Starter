module JustinCredible.SampleApp.Controllers {

    export interface ICategoryStateParams {
        categoryNumber: number;
    }

    export class CategoryController extends BaseController<ViewModels.CategoryViewModel> {

        public static ID = "CategoryController";

        public static get $inject(): string[] {
            return ["$scope", "$stateParams"];
        }

        private $stateParams: ICategoryStateParams;

        constructor($scope: ng.IScope, $stateParams: ICategoryStateParams) {
            super($scope, ViewModels.CategoryViewModel);

            this.$stateParams = $stateParams;
        }

        //#region BaseController Events

        protected view_beforeEnter(): void {
            super.view_beforeEnter();

            // Set the category number into the view model using the value as provided
            // in the view route (via the $stateParameters).
            this.viewModel.categoryNumber = this.$stateParams.categoryNumber;
        }

        //#endregion
    }
}
