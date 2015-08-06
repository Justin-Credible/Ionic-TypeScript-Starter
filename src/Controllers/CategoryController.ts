module JustinCredible.SampleApp.Controllers {

    export interface ICategoryStateParams {
        categoryNumber: number;
    }

    export class CategoryController extends BaseController<ViewModels.CategoryViewModel> {

        //#region Injection

        public static ID = "CategoryController";

        public static get $inject(): string[] {
            return [
                "$scope",
                "$stateParams"
            ];
        }

        constructor(
            $scope: ng.IScope,
            private $stateParams: ICategoryStateParams) {
            super($scope, ViewModels.CategoryViewModel);
        }

        //#endregion

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
