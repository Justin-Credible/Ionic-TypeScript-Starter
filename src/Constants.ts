
/**
 * A common location for application-wide constant values.
 */
module JustinCredible.SampleApp.Constants {

    /**
     * Value for rejection of a promise when opening a dialog using the showDialog
     * helper method. This value will be used when showDialog was called with a dialog
     * ID of a dialog that is already open.
     */
    export const DIALOG_ALREADY_OPEN = "DIALOG_ALREADY_OPEN";

    /**
     * Value for rejection of a promise when opening a dialog using the showDialog
     * helper method. This value will be used when showDialog was called with a dialog
     * ID who is not registered in the dialogTemplateMap map.
     */
    export const DIALOG_ID_NOT_REGISTERED = "DIALOG_ID_NOT_REGISTERED";
}

/**
 * A collection of titles for buttons commonly used with dialogs.
 */
module JustinCredible.SampleApp.Constants.Buttons {
    export const Yes = "Yes";
    export const No = "No";
    export const OK = "OK";
    export const Cancel = "Cancel";
}
