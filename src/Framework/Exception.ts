
namespace JustinCredible.SampleApp {

    /**
     * A wrapper for JavaScript's built-in Error type.
     * 
     * This allows us to wrap and rethrow an error while keeping the original error
     * object as well as an optional context object. This is useful for throwing from
     * async methods where the caller might want access to the original error object.
     * 
     * Normally, we couldn't need this constructor magic, but since we target ES5 we
     * need this little hack. If we target ES6 in the future, the constructor can be
     * removed. See: https://stackoverflow.com/a/48342359
     */
    export class Exception extends Error {

        /**
         * Holds the original value of message passed to the constructor.
         */
        public readonly originalMessage: string;

        constructor(message?: string,
            public innerError?: any,
            public context?: any,
        ) {
            // 'Error' breaks prototype chain here.
            // Concatenate the inner error message string, so that when logged in the browser console it is shown.
            super(message + (innerError && innerError.message ? " Inner Error: " + innerError.message : ""));

            // Restore prototype chain.
            const actualProto = new.target.prototype;

            /* tslint:disable:no-string-literal */

            if (Object["setPrototypeOf"]) {
                Object["setPrototypeOf"](this, actualProto);
            }
            else {
                this["__proto__"] = new.target.prototype;
            }

            /* tslint:enable:no-string-literal */

            // Save off the original message passed to the excpetion; could be useful from the catch() sites.
            this.originalMessage = message;
        }
    }
}
