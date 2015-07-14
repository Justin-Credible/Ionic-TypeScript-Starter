
/**
 * This file contains definitions for additional Cordova plug-ins.
 */

/**
 * Describes the PhoneGap Toast Plugin.
 * 
 * https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin
 */
interface ICordovaToastPlugin {

    /**
     * Shows a toast message with the specified duration and position.
     * 
     * @param message The text for the toast message.
     * @param duration How long the toast should be visible ('short' or 'long').
     * @param position Where the toast should show ('top', 'center', or 'bottom').
     */
    show(message: string, duration: string, position: string): void;

    /**
     * Shows a toast message with the specified duration and position.
     * 
     * @param message The text for the toast message.
     * @param duration How long the toast should be visible ('short' or 'long').
     * @param position Where the toast should show ('top', 'center', or 'bottom').
     * @param successCallback Executed if the toast was displayed successfully.
     * @param errorCallback Executed if the toast had problems being displayed.
     */
    show(message: string, duration: string, position: string, successCallback: () => void, errorCallback: (error: Error) => void): void;

    /**
     * Shows a toast message with a long duration at the bottom of the screen.
     * 
     * @param message The text for the toast message.
     */
    showLongBottom(message: string);

    /**
     * Shows a toast message with a long duration at the bottom of the screen.
     * 
     * @param message The text for the toast message.
     * @param successCallback Executed if the toast was displayed successfully.
     * @param errorCallback Executed if the toast had problems being displayed.
     */
    showLongBottom(message: string, successCallback: () => void, errorCallback: (error: Error) => void): void;

    /**
     * Shows a toast message with a long duration at the center of the screen.
     * 
     * @param message The text for the toast message.
     */
    showLongCenter(message: string);

    /**
     * Shows a toast message with a long duration at the center of the screen.
     * 
     * @param message The text for the toast message.
     * @param successCallback Executed if the toast was displayed successfully.
     * @param errorCallback Executed if the toast had problems being displayed.
     */
    showLongCenter(message: string, successCallback: () => void, errorCallback: (error: Error) => void): void;

    /**
     * Shows a toast message with a long duration at the top of the screen.
     * 
     * @param message The text for the toast message.
     */
    showLongTop(message: string);

    /**
     * Shows a toast message with a long duration at the top of the screen.
     * 
     * @param message The text for the toast message.
     * @param successCallback Executed if the toast was displayed successfully.
     * @param errorCallback Executed if the toast had problems being displayed.
     */
    showLongTop(message: string, successCallback: () => void, errorCallback: (error: Error) => void): void;

    /**
     * Shows a toast message with a short duration at the bottom of the screen.
     * 
     * @param message The text for the toast message.
     */
    showShortBottom(message: string);

    /**
     * Shows a toast message with a short duration at the bottom of the screen.
     * 
     * @param message The text for the toast message.
     * @param successCallback Executed if the toast was displayed successfully.
     * @param errorCallback Executed if the toast had problems being displayed.
     */
    showShortBottom(message: string, successCallback: () => void, errorCallback: (error: Error) => void): void;


    /**
     * Shows a toast message with a sort duration at the center of the screen.
     * 
     * @param message The text for the toast message.
     */
    showShortCenter(message: string);

    /**
     * Shows a toast message with a short duration at the center of the screen.
     * 
     * @param message The text for the toast message.
     * @param successCallback Executed if the toast was displayed successfully.
     * @param errorCallback Executed if the toast had problems being displayed.
     */
    showShortCenter(message: string, successCallback: () => void, errorCallback: (error: Error) => void): void;

    /**
     * Shows a toast message with a short duration at the top of the screen.
     * 
     * @param message The text for the toast message.
     */
    showShortTop(message: string);

    /**
     * Shows a toast message with a short duration at the top of the screen.
     * 
     * @param message The text for the toast message.
     * @param successCallback Executed if the toast was displayed successfully.
     * @param errorCallback Executed if the toast had problems being displayed.
     */
    showShortTop(message: string, successCallback: () => void, errorCallback: (error: Error) => void): void;
}

/**
 * Describes the clipboard plugin.
 * 
 * https://github.com/VersoSolutions/CordovaClipboard
 */
interface ICordovaClipboardPlugin {

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

/**
 * Describes the progress indicator plugin.
 * 
 * https://github.com/pbernasconi/cordova-progressIndicator/
 */
interface ICordovaProgressIndicator {

    /**
     * Used to hide an indicator.
     */
    hide(): void;

    /**
     * Simple spinner with no text. Requires .hide().
     * 
     * @param dimBackground True if the full screen should have an overlay.
     */
    showSimple(dimBackground: boolean): void;

    /**
     * Simple spinner dialog with a label. Requires .hide().
     * 
     * @param dimBackground True if the full screen should have an overlay.
     * @param label The text to use as a label inside of the indicator.
     */
    showSimpleWithLabel(dimBackground: boolean, label: string): void;

    /**
     * Simple spinner dialog with a label and detail text. Requires .hide().
     * 
     * @param dimBackground True if the full screen should have an overlay.
     * @param label The text to use as a label inside of the indicator.
     * @param detail The text to use below the main label text.
     */
    showSimpleWithLabelDetail(dimBackground: boolean, label: string, detail: string): void;

    /**
     * A blank Determinate spinner. The timeout parameter uses microseconds for
     * each increment. Hides automatically, upon timeout completion.
     * 
     * @param dimBackground True if the full screen should have an overlay.
     * @param timeout Timeout in microseconds.
     */
    showDeterminate(dimBackground: boolean, timeout: number): void;

    /**
     * A Determinate spinner with a label. Hides automatically, upon timeout completion.
     * 
     * @param dimBackground True if the full screen should have an overlay.
     * @param timeout Timeout in microseconds.
     * @param label The text to use as a label inside of the indicator.
     */
    showDeterminateWithLabel(dimBackground: boolean, timeout: number, label: string): void;

    /**
     * A blank Annular spinner. Hides automatically, upon timeout completion.
     * 
     * @param dimBackground True if the full screen should have an overlay.
     * @param timeout Timeout in microseconds.
     */
    showAnnular(dimBackground: boolean, timeout: number): void;

    /**
     * An Annular spinner with a label. Hides automatically, upon timeout completion.
     * 
     * @param dimBackground True if the full screen should have an overlay.
     * @param timeout Timeout in microseconds.
     * @param label The text to use as a label inside of the indicator.
     */
    showAnnularWithLabel(dimBackground: boolean, timeout: number, label: string): void;

    /**
     * A blank Bar indicator. Hides automatically, upon timeout completion.
     * 
     * @param dimBackground True if the full screen should have an overlay.
     * @param timeout Timeout in microseconds.
     */
    showBar(dimBackground: boolean, timeout: number): void;

    /**
     * A Bar indicator with a label. Hides automatically, upon timeout completion.
     * 
     * @param dimBackground True if the full screen should have an overlay.
     * @param timeout Timeout in microseconds.
     * @param label The text to use as a label inside of the indicator.
     */
    showBarWithLabel(dimBackground: boolean, timeout: number, label: string): void;

    /**
     * A Success message with a small checkmark image. Requires manual hide().
     * 
     * @param dimBackground True if the full screen should have an overlay.
     * @param label The text to use as a label inside of the indicator.
     */
    showSuccess(dimBackground: boolean, label: string): void;

    /**
     * Simple usage with a label or with label and detail. Requires manual hide().
     * 
     * @param dimBackground True if the full screen should have an overlay.
     * @param label The text to use as a label inside of the indicator.
     * @position The position of the element; top, center, or bottom.
     */
    showText(dimBackground: boolean, label: string, position: string): void;
}
