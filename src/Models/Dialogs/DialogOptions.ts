module JustinCredible.SampleApp.Models {

    /**
     * Used to specify options for a dialog.
     * For use with UiHelper.openDialog().
     */
    export class DialogOptions {

        /**
         * The data object for the dialog.
         * 
         * This will be available from BaseDialogController.getData().
         */
        dialogData: any;

        /**
         * Specifies if the dialog should be able to be closed by clicking/touching
         * the backdrop area. Default is true.
         */
        backdropClickToClose: boolean;

        /**
         * Specifies if the dialog should be able to be closed by pressing the device's
         * hardware back button. Default is true.
         */
        hardwareBackButtonClose: boolean;

        /**
         * Specifies if the contents behind the background should be visible (eg displayed
         * underneath an overlay element). Default is true, if set to false the background
         * will be completely black.
         */
        showBackground: boolean;

        constructor(dialogData?: any) {
            this.dialogData = dialogData;

            this.backdropClickToClose = true;
            this.hardwareBackButtonClose = true;
            this.showBackground = true;
        }
    }
}
