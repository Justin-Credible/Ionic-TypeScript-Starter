namespace JustinCredible.SampleApp.Controllers {

    /**
     * This is the base controller that all other controllers should utilize.
     * 
     * It handles saving a reference to the Angular scope, newing up the given
     * model object type, and injecting the view model and controller onto the
     * scope object for use in views.
     * 
     * V - The type of the view model that this controller will utilize.
     * D - The type of data object that will be passed in when this dialog is opened.
     * R - The type of the data object that will be returned when this dialog is closed.
     */
    export abstract class BaseDialogController<V, D, R> extends BaseController<V> {

        private dialogId: string;
        private modalInstance: ionic.modal.IonicModalController;
        private data: D;

        constructor(scope: ng.IScope, ViewModelType: { new (): V; }, dialogId: string) {
            super(scope, ViewModelType);

            this.dialogId = dialogId;

            this.scope.$on("modal.shown", _.bind(this.modal_shown, this));
            this.scope.$on("modal.hidden", _.bind(this.modal_hidden, this));
            this.scope.$on(Constants.Events.APP_CLOSE_DIALOG, _.bind(this.app_closeDialog, this));
        }

        //#region Events

        private modal_shown(ngEvent: ng.IAngularEvent, instance: any) {

            // Only respond to modal.shown events for this dialog.
            if (this.dialogId !== instance.dialogId ||
                (this.modalInstance && this.modalInstance !== instance)) {
                return;
            }

            // Save off a reference to the Ionic modal instance.
            this.modalInstance = instance;

            // Hold a reference to the data object that was passed in when opening the dialog.
            this.data = instance.dialogData;

            // Call the dialog shown event which descendants can override.
            this.dialog_shown();
        }

        private modal_hidden(eventArgs: ng.IAngularEvent, instance: any) {

            // Only respond to modal.hidden events for this dialog.
            if (this.dialogId !== instance.dialogId ||
                (this.modalInstance && this.modalInstance !== instance)) {
                return;
            }

            // Call the dialog hidden event which descendants can override.
            this.dialog_hidden();

            // When the user clicks off of modal to close it or uses the back button on Android
            // the dialog is never disposed. We will do it manually here and remove it from the
            // DOM. This event we are in was triggered from the modal, so we need a setTimeout
            // to run this code after the modal is finished calling us. We can't just call
            // remove() since that calls hidden() (which we are in).

            /* tslint:disable:no-string-literal */
            setTimeout(() => {
                this.scope.$destroy();
                if (this.modalInstance && this.modalInstance["$el"]) {
                    this.modalInstance["$el"].remove();
                }
            }, 2000);
            /* tslint:enable:no-string-literal */
        }

        /**
         * Fired by the UIHelper.closeAllDialogs() or UIHelper.closeDialog(...) methods.
         */
        private app_closeDialog(eventArgs: ng.IAngularEvent, dialogId: string): void {

            // If the close event does not specify the dialog ID then it applies to all dialgos.
            // If it does specify the ID it is only applicable to the dialog with the given ID.
            if (!dialogId || dialogId === this.dialogId) {
                this.close();
            }
        }

        //#endregion

        //#region Protected Methods

        /**
         * Used to get the data object that this was opened with.
         */
        public getData(): D {
            return this.data;
        }

        /**
         * Used to close the dialog.
         */
        public close(): void;

        /**
         * Used to close the dialog.
         * 
         * @param result The return result value for this dialog.
         */
        public close(result: R): void;

        /**
         * Used to close the dialog.
         * 
         * @param result The return result value for this dialog.
         */
        public close(result?: R): void {

            // tslint:disable-next-line:no-string-literal
            this.modalInstance["result"] = result;

            this.modalInstance.hide();
            this.modalInstance.remove();
        }

        //#endregion

        //#region Override-able Methods

        /**
         * Fired when this dialog is shown.
         * 
         * Can be overridden by implementing controllers.
         */
        protected dialog_shown(): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */
        }

        /**
         * Fired when this dialog is hidden.
         * 
         * Can be overridden by implementing controllers.
         */
        protected dialog_hidden(): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */
        }

        //#endregion
    }
}
