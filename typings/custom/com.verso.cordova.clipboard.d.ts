
/**
 * Describes the clipboard plugin.
 * 
 * npm ID: com.verso.cordova.clipboard version 0.1.0
 * https://github.com/VersoSolutions/CordovaClipboard
 */
declare module ClipboardPlugin {

    interface ClipboardPluginStatic {

        /**
         * Places the given text onto the user's clipboard.
         * 
         * @param text The text to copy to the clipboard.
         */
        copy(text: string): void;

        /**
         * Places the given text onto the user's clipboard.
         * 
         * @param text The text to copy to the clipboard.
         * @param successCallback Executed if the toast was displayed successfully.
         * @param errorCallback Executed if the toast had problems being displayed.
         */
        copy(text: string, successCallback: () => void, errorCallback: (error: Error) => void): void;

        /**
         * Retrieves the current text from the user's clipboard.
         * 
         * @param successCallback Executed if the toast was displayed successfully.
         * @param errorCallback Executed if the toast had problems being displayed.
         * @returns The text that is currently on the clipboard.
         */
        paste(successCallback: (text: string) => void, errorCallback: (error: Error) => void): void;
    }
}

// Extends the CordovaPlugins interface as defined in cordova.d.ts.
interface CordovaPlugins {
    clipboard: ClipboardPlugin.ClipboardPluginStatic;
}
