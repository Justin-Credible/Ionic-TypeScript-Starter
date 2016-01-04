
/**
 * This file contains definition extensions to base browser interfaces which are
 * available via third party plug-ins as well as extensions for existing interfaces.
 * 
 */

interface Window {

    /**
     * Used to obtain a directory entry on the local file system given a URI.
     *
     * Describes the resolveLocalFileSystemURL function that is exposed via the
     * org.apache.cordova.file@1.2.0 plugin in resolveLocalFileSystemURI.js file.
     * 
     * https://github.com/apache/cordova-plugin-file/blob/master/doc/index.md
     * 
     * @param uri The URI of a path on the local file system to use to obtain a directory entry.
     * @param successCallback Executed when the API call succeeds.
     * @param errorCallback Executed when the API call fails.
     */
    resolveLocalFileSystemURL(uri: string, successCallback: (directoryEntry: DirectoryEntry) => void, errorCallback: (error: FileError) => void): void;

    /**
     * The available Cordova plug-ins.
     * 
     * If your plug-in isn't available here, check Cordova.plugins.
     */
    //plugins: ICordovaWindowPlugins;

    /**
     * Variables emitted at build time which contain useful application information.
     */
    buildVars: JustinCredible.SampleApp.Interfaces.BuildVars;

    /**
     * Prints a stack trace at the given location.
     * 
     * Uses the stacktrace.js library:
     * https://github.com/stacktracejs/stacktrace.js
     */
    printStackTrace(): string[];

    /**
     * Prints a stack trace for the given error object.
     * 
     * Uses the stacktrace.js library:
     * https://github.com/stacktracejs/stacktrace.js
     * 
     * @param data An object containing the error on a property named "e".
     */
    printStackTrace(data: { e: Error }): string[];
}

/**
 * These are the Cordova plug-ins that are available via the global Cordova.plugins object.
 */
interface CordovaPlugins {

    /**
     * This plugin allows access to the user's clipboard.
     */
    clipboard: ICordovaClipboardPlugin;
}

/**
 * These are the Cordova plug-ins that are available via the global window.plugins object.
 */
interface Plugins {
    /**
     * This plugin allows showing toast messages cross platform for Android, iOS, and WP8.
     */
    toast: ICordovaToastPlugin;
}

/**
 * These are the Cordova plug-ins that are available via the global navigator object.
 */
interface Navigator {
    /**
     * This plugin allows logging exception information to the Crashlytics backend service.
     */
    crashlytics: ICordovaCrashlyticsPlugin;
}
