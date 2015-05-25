module JustinCredible.SampleApp.Controllers {

    export interface IReorderCategoriesController {
        viewModel: ViewModels.ReorderCategoriesViewModel;
    }

    export class ReorderCategoriesController extends BaseDialogController<ViewModels.ReorderCategoriesViewModel, void, void> implements IReorderCategoriesController {

        public static $inject = ["$scope", "Utilities", "Preferences", "UiHelper"];

        private Utilities: Services.Utilities;
        private Preferences: Services.Preferences;

        constructor($scope: ng.IScope, Utilities: Services.Utilities, Preferences: Services.Preferences, UiHelper: Services.UiHelper) {
            super($scope, ViewModels.ReorderCategoriesViewModel, UiHelper.DialogIds.ReorderCategories);

            this.Utilities = Utilities;
            this.Preferences = Preferences;
        }

        //#region BaseDialogController Overrides

        public dialog_shown(): void {
            // Grab the available categories.
            this.viewModel.categories = this.Utilities.categories;
        }

        //#endregion

        //#region Controller Methods

        public item_reorder(item: ViewModels.CategoryItemViewModel, fromIndex: number, toIndex: number) {
            this.viewModel.categories.splice(fromIndex, 1);
            this.viewModel.categories.splice(toIndex, 0, item);
        }

        public done_click() {
            var categoryOrder: string[] = [];

            this.viewModel.categories.forEach((categoryItem: ViewModels.CategoryItemViewModel) => {
                categoryOrder.push(categoryItem.name);
            });

            this.Preferences.categoryOrder = categoryOrder;

            this.close();
        }

        //#endregion
    }
}
