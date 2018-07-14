
namespace JustinCredible.SampleApp.Interfaces {

    /**
     * An extension of the Angular RequestConfig interface which allows us to pass along a
     * few extra flags to control some featuers as defined in our HttpInterceptor.
     */
    export interface RequestConfig extends ng.IRequestConfig {

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

        /**
         * Indicates if this HTTP request is a retry from one that previously failed with an HTTP status
         * 0 failure. This will be set internally by the HttpInterceptor service.
         */
        isRetry?: boolean;

        /**
         * Indicates the number of times this request should be re-issued after an HTTP status 0 failure.
         * This will be set internally by the HttpInterceptor service.
         */
        retryCount?: number;
    }
}
