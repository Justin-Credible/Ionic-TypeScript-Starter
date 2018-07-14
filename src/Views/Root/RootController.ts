namespace JustinCredible.SampleApp.Controllers {

    export class RootController extends BaseController<ViewModels.RootViewModel> {

        //#region Injection

        public static ID = "RootController";

        public static get $inject(): string[] {
            return [
                "$scope",
                Services.MenuDataSource.ID,
                Services.UIHelper.ID,
            ];
        }

        constructor(
            $scope: ng.IScope,
            private MenuDataSource: Services.MenuDataSource,
            private UIHelper: Services.UIHelper,
            ) {
            super($scope, ViewModels.RootViewModel);
        }

        //#endregion

        private _hasLoaded = false;

        //#region BaseController Overrides

        protected view_loaded(event?: ng.IAngularEvent, eventArgs?: Interfaces.ViewEventArguments): void {
            super.view_loaded(event, eventArgs);

            // In most cases Ionic's load event only fires once, the first time the controller is
            // initialize and attached to the DOM. However, abstract controllers (eg this one) will
            // have their Ionic view events fired for child views as well. Here we ensure that we
            // don't run the code below if we've already loaded before and a child is loading.
            if (this._hasLoaded) {
                return;
            }

            this._hasLoaded = true;

            this.viewModel.categories = this.MenuDataSource.categories;
        }

        //#endregion

        //#region Controller Methods

        protected reorder_click() {
            this.UIHelper.showDialog(ReorderCategoriesController.ID).then(() => {
                // After the re-order dialog is closed, re-populate the category
                // items since they may have been re-ordered.
                this.viewModel.categories = this.MenuDataSource.categories;
            });
        }

        //#endregion
    }
}
