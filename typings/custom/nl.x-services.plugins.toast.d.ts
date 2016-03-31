
/**
 * Describes the Google Tag Manager plugin.
 * 
 * npm ID: nl.x-services.plugins.toast version 2.0.4
 * https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin
 */
declare module ToastPlugin {

    interface ToastPluginStatic {

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
}

// HACK: Extends the Plugins interface as defined in Push.d.ts.
interface Plugins {
    toast: ToastPlugin.ToastPluginStatic;
}
