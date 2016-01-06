namespace JustinCredible.SampleApp.Controllers {

    export class ReorderCategoriesController extends BaseDialogController<ViewModels.ReorderCategoriesViewModel, void, void> {

        //#region Injection

        public static ID = "ReorderCategoriesController";
        public static TemplatePath = "Views/Dialogs/Reorder-Categories/Reorder-Categories.html";

        public static get $inject(): string[] {
            return [
                "$scope",
                Services.Utilities.ID,
                Services.Preferences.ID,
                Services.UiHelper.ID
            ];
        }

        constructor(
            $scope: ng.IScope,
            private Utilities: Services.Utilities,
            private Preferences: Services.Preferences,
            private UiHelper: Services.UiHelper) {
            super($scope, ViewModels.ReorderCategoriesViewModel, ReorderCategoriesController.ID);
        }

        //#endregion

        //#region BaseDialogController Overrides

        protected dialog_shown(): void {
            super.dialog_shown();

            // Grab the available categories.
            this.viewModel.categories = this.Utilities.categories;
        }

        //#endregion

        //#region Controller Methods

        protected item_reorder(item: Models.Category, fromIndex: number, toIndex: number) {
            this.viewModel.categories.splice(fromIndex, 1);
            this.viewModel.categories.splice(toIndex, 0, item);
        }

        protected done_click() {
            var categoryOrder: string[] = [];

            this.viewModel.categories.forEach((categoryItem: Models.Category) => {
                categoryOrder.push(categoryItem.name);
            });

            this.Preferences.categoryOrder = categoryOrder;

            this.close();
        }

        //#endregion
    }
}
