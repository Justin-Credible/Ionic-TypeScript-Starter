module JustinCredible.SampleApp.Controllers {

    export interface ICategoryController {
        viewModel: ViewModels.CategoryViewModel;
    }

    export interface ICategoryStateParams {
        categoryNumber: number;
    }

    export class CategoryController extends BaseController<ViewModels.CategoryViewModel> implements ICategoryController {

        public static $inject = ["$scope", "$stateParams"];

        private $stateParams: ICategoryStateParams;

        constructor($scope: ng.IScope, $stateParams: ICategoryStateParams) {
            super($scope, ViewModels.CategoryViewModel);

            this.$stateParams = $stateParams;
        }

        //#region Controller Events

        public view_beforeEnter(): void {
            // Set the category number into the view model using the value as provided
            // in the view route (via the $stateParameters).
            this.viewModel.categoryNumber = this.$stateParams.categoryNumber;
        }

        //#endregion
    }
}
