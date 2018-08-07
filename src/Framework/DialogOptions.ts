namespace JustinCredible.SampleApp.Models {

    /**
     * Used to specify options for a dialog.
     * For use with UIHelper.showDialog().
     * 
     * D - The type of data object that will be passed in when the dialog is opened.
     * R - The type of the data object that will be returned when this dialog is closed.
     * (see BaseDialogController and UIHelper.showDialog() for the matching templated types)
     */
    export class DialogOptions<D, R> {

        /**
         * The data object for the dialog.
         * 
         * This will be available from BaseDialogController.getData().
         */
        dialogData: D;

        /**
         * Specifies if the dialog should be able to be closed by clicking/touching
         * the backdrop area. Default is true.
         */
        backdropClickToClose: boolean;

        /**
         * Specifies if the dialog should be able to be closed by pressing the device's
         * hardware back button. Default is false.
         */
        hardwareBackButtonClose: boolean;

        /**
         * Specifies if the contents behind the background should be visible (eg displayed
         * underneath an overlay element). Default is true, if set to false the background
         * will be completely black.
         */
        showBackground: boolean;

        constructor(dialogData?: D) {
            this.dialogData = dialogData;

            this.backdropClickToClose = false;
            this.hardwareBackButtonClose = true;
            this.showBackground = true;
        }
    }
}
