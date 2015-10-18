
/**
 * This module is used to house custom interfaces that aren't data types.
 */
declare module JustinCredible.SampleApp.Interfaces {

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

        majorVersion: number;
        minorVersion: number;
        buildVersion: number;

        /**
        * The URL to the APIs to use.
        */
        apiUrl: string;
    }

    interface VersionInfo {
        majorVersion: number;
        minorVersion: number;
        buildVersion: number;
        versionString: string;
        buildTimestamp: string;
        applicationName: string;
        copyrightInfoUrl: string;
        websiteUrl: string;
        githubUrl: string;
        email: string;
    }
}
