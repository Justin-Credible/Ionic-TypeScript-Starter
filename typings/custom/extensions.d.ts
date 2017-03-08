
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
     * Variables emitted at build time which contain useful application information.
     */
    buildVars: JustinCredible.SampleApp.Interfaces.BuildVars;
}

interface Navigator {

    /**
     * Indicates if the webpage has been pinned to the user's home screen on iOS and if
     * it was launched from the homescreen instead of the Safari browser.
     * 
     * https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html#//apple_ref/doc/uid/TP40002051-CH3-SW2
     */
    standalone: boolean;
}
