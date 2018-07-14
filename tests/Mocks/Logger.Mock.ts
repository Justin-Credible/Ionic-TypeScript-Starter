
namespace JustinCredible.SampleApp.UnitTests.Mocks {

    export class Logger implements Interfaces.Services.Logger {

        /**
         * Can be set to true to enable application logs to be written to the console
         * when running the unit tests. Set to false by default to make the test console
         * output easier to read.
         */
        private _enableLogging = false;

        public initialize() {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */
        }

        public debug(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.logToConsole("DEBUG", tagPrefix + "." + tag, message, metadata);
        }

        public info(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.logToConsole("INFO", tagPrefix + "." + tag, message, metadata);
        }

        public warn(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.logToConsole("WARN", tagPrefix + "." + tag, message, metadata);
        }

        public error(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.logToConsole("ERROR", tagPrefix + "." + tag, message, metadata);
        }

        private logToConsole(logLevel: string, tag: string, message: string, metadata?: any) {

            if (!this._enableLogging) {
                return;
            }

            try {
                let console_logFn,
                    levelDisplay: string;

                //# region Determine variables based on log level

                switch (logLevel) {
                    case "DEBUG":
                        levelDisplay = "[DEBUG]";
                        console_logFn = console.debug;
                        break;
                    case "INFO":
                        levelDisplay = "[INFO]";
                        console_logFn = console.info;
                        break;
                    case "WARN":
                        levelDisplay = "[WARN]";
                        console_logFn = console.warn;
                        break;
                    case "ERROR":
                        levelDisplay = "[ERROR]";
                        console_logFn = console.error;
                        break;
                    default:
                        levelDisplay = "[LOG]";
                        console_logFn = console.log;
                        break;
                }

                //#endregion

                // Log to both the browser console and native device console.
                // Logging is slighting different based on if a metadata object is present or not.
                if (metadata == null) {

                    // Handle the simple case first-- no metadata is being logged.

                    console_logFn.call(console, levelDisplay + " " + tag + ": " + message);
                }
                else {

                    // Handle the more complicated case-- a metadata object is being logged.
                    // In this case we want to make sure the metadata is logged for display by the
                    // browser's debugging tools and included as a JSON string in the native logs.

                    let metadataJson: string;

                    try {
                        metadataJson = JSON.stringify(metadata);
                    }
                    catch (error) {
                        /* tslint:disable:no-empty */
                        /* tslint:enable:no-empty */
                    }

                    console_logFn.call(console, levelDisplay + " " + tag + ": " + message, metadata);
                }
            }
            catch (exception) {
                console.error("Error logging via Logger.logToConsole().", exception);
            }
        }
    }
}