
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

/**
 * A collection of names of events used within the application.
 */
module JustinCredible.SampleApp.Constants.Events {
    export const HTTP_UNAUTHORIZED = "http.unauthorized";
    export const HTTP_FORBIDDEN = "http.forbidden";
    export const HTTP_NOT_FOUND = "http.notFound";
    export const HTTP_UNKNOWN_ERROR = "http.unknownError";
    export const HTTP_ERROR = "http.error";

    export const APP_MENU_BUTTON = "app.menuButton";
}
