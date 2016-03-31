
/// <reference path="../angularjs/angular.d.ts" />

/**
 * This module is used to house custom interfaces that aren't data types.
 */
declare namespace JustinCredible.SampleApp.Interfaces {

    /**
     * An extension of the Angular RequestConfig interface which allows us to pass along a
     * few extra flags to control some featuers as defined in our HttpInterceptor.
     */
    interface RequestConfig extends ng.IRequestConfig {

        /**
         * Indicates that the user should be blocked during this request.
         * HttpInterceptor defaults this to true.
         */
        blocking?: boolean;

        /**
         * If blocking is true, specifies the text to use in the blocking dialog.
         * HttpIntercetpor defaults this to empty string.
         */
        blockingText?: string;

        /**
         * Indicates that the non-blocking activity spinner should be shown during this request.
         * HttpInterceptor defaults this to true.
         */
        showSpinner?: boolean;

        /**
         * Used to control if the HttpInterceptor will log the body of the request before it goes
         * out. Useful for skipping logs that contain sensitive data (eg passwords). If not provided,
         * the default value is false.
         */
        logRequestBody?: boolean;
    }

    /**
     * Variables emitted at build time which contain useful application information.
     */
    interface BuildVars {
        /**
         * True if the application was build in debug configuration, false if it was
         * build a release or distribution configuration.
         */
        debug: boolean;

        /**
         * The time at which the application was built.
         */
        buildTimestamp: string;

        /**
         * The short SHA for the git commit that this build was created from.
         * 
         * Will be 'unknown' if the commit couldn't be determined or the machine
         * that made the build did not have git installed.
         */
        commitShortSha: string;

        /**
         * Holds all of the name/value pairs from config.yml.
         */
        config: BuildConfig;
    }

    /**
     * Holds all of the name/value pairs from config.yml.
     */
    interface BuildConfig {

        /**
         * The display name of the application.
         */
        appName: string;

        /**
         * The description of the application.
         */
        appDescription: string;

        /**
         * The version string for the application.
         */
        appVersion: string;

        /**
         * The name of the author.
         */
        authorName: string;

        /**
         * The author's e-mail address.
         */
        authorEmail: string;

        /**
         * The URL for the author's website.
         */
        authorWebsite: string;

        /**
         * URL to the license file for the this starter project.
         */
        licenseUrl: string;

        /**
         * URL to the GitHub page for this starter project.
         */
        githubUrl: string;

        /**
         * The base URL for the REST APIs for the application.
         */
        apiUrl: string;

        /**
         * The version of the API to use; this will be sent in the X-API-Version header.
         */
        apiVersion: string;
    }
}
