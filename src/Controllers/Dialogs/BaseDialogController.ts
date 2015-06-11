module JustinCredible.SampleApp.Controllers {

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
    export class BaseDialogController<V, D, R> extends BaseController<V> {

        private dialogId: string;
        private modalInstance: any;
        private data: D;

        constructor(scope: ng.IScope, ViewModelType: { new (): V; }, dialogId: string) {
            super(scope, ViewModelType);

            this.dialogId = dialogId;

            this.scope.$on("modal.shown", _.bind(this.modal_shown, this));
            this.scope.$on("modal.hidden", _.bind(this.modal_hidden, this));
        }

        //#region Events

        private modal_shown(ngEvent: ng.IAngularEvent, instance: any) {

            // Only respond to modal.shown events for this dialog.
            if (this.dialogId !== instance.dialogId) {
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
            if (this.dialogId !== instance.dialogId) {
                return;
            }

            // Call the dialog hidden event which descendants can override.
            this.dialog_hidden();
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
            this.modalInstance.result = result;
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
