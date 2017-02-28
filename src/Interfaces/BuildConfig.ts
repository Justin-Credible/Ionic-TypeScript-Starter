
declare namespace JustinCredible.SampleApp.Interfaces {

    /**
     * Holds all of the name/value pairs from config.yml.
     */
    export interface BuildConfig {

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

        /**
         * Indicates if this application was built to be served as a website.
         */
        isWebPlatform: boolean;
    }
}
