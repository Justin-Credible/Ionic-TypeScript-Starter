namespace JustinCredible.SampleApp.Services {

    /**
     * Provides a common set of helper/utility methods for logging errors.
     */
    export class Logger {

        //#region Injection

        public static ID = "Logger";

        public static get $inject(): string[] {
            return [
                Utilities.ID
            ];
        }

        constructor(
            private Utilities: Utilities) {

            this._logs = [];
        }

        //#endregion

        private _logs: Models.LogEntry[];
        private _maxLogEntries = 20;

        //#region Logging Convenience Methods

        /**
         * Used to log debbuging information (like method timings etc).
         * 
         * @param tagPrefix The prefix for the log entries tag (normally the ID of the service or controller).
         * @param tag The tag for the log (normally the name of the method).
         * @param message The descriptive text for the log entry.
         * @param metadata An optional object to be logged with the log entry.
         */
        public trace(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.log(Models.LogLevel.TRACE, tagPrefix, tag, message, metadata);
        }

        /**
         * Used to log debugging information.
         * 
         * @param tagPrefix The prefix for the log entries tag (normally the ID of the service or controller).
         * @param tag The tag for the log (normally the name of the method).
         * @param message The descriptive text for the log entry.
         * @param metadata An optional object to be logged with the log entry.
         */
        public debug(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.log(Models.LogLevel.DEBUG, tagPrefix, tag, message, metadata);
        }

        /**
         * Used to log an informational message.
         * 
         * @param tagPrefix The prefix for the log entries tag (normally the ID of the service or controller).
         * @param tag The tag for the log (normally the name of the method).
         * @param message The descriptive text for the log entry.
         * @param metadata An optional object to be logged with the log entry.
         */
        public info(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.log(Models.LogLevel.INFO, tagPrefix, tag, message, metadata);
        }

        /**
         * Used to log a warning.
         * 
         * @param tagPrefix The prefix for the log entries tag (normally the ID of the service or controller).
         * @param tag The tag for the log (normally the name of the method).
         * @param message The descriptive text for the log entry.
         * @param metadata An optional object to be logged with the log entry.
         */
        public warn(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.log(Models.LogLevel.WARN, tagPrefix, tag, message, metadata);
        }

        /**
         * Used to log an error.
         * 
         * @param tagPrefix The prefix for the log entries tag (normally the ID of the service or controller).
         * @param tag The tag for the log (normally the name of the method).
         * @param message The descriptive text for the log entry.
         * @param metadata An optional object to be logged with the log entry.
         */
        public error(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.log(Models.LogLevel.ERROR, tagPrefix, tag, message, metadata);
        }

        /**
         * Used to log a fatal error.
         * 
         * @param tagPrefix The prefix for the log entries tag (normally the ID of the service or controller).
         * @param tag The tag for the log (normally the name of the method).
         * @param message The descriptive text for the log entry.
         * @param metadata An optional object to be logged with the log entry.
         */
        public fatal(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.log(Models.LogLevel.FATAL, tagPrefix, tag, message, metadata);
        }

        //#endregion

        //#region Public Methods

        /**
         * Used to clear the logs that are current in memory.
         */
        public clear(): void {
            this._logs = [];
        }

        /**
         * Used to return all of the logs that are currently in memory.
         * 
         * @returns An array of log entries.
         */
        public get logs(): Models.LogEntry[] {
            return this._logs;
        }

        /**
         * Used to get a single log entry by log ID.
         * 
         * @param id The log ID of the log to retrieve.
         * @returns A single log entry with the given ID.
         */
        public getLog(id: string): Models.LogEntry {
            return _.find(this._logs, (logEntry: Models.LogEntry) => {
                return logEntry.id === id;
            });
        }

        /**
         * A helper used to get an icon name for the given log level.
         * 
         * @param level The level of the log to get an icon name for.
         * @returns A string of an icon name for the given log level.
         */
        public getIconForLevel(level: number): string {

            if (level == null) {
                return "";
            }

            switch (level) {
                case Models.LogLevel.TRACE:
                    return "ion-code-working";
                case Models.LogLevel.DEBUG:
                    return "ion-bug";
                case Models.LogLevel.INFO:
                    return "ion-information-circled";
                case Models.LogLevel.WARN:
                    return "ion-alert-circled";
                case Models.LogLevel.ERROR:
                    return "ion-alert";
                case Models.LogLevel.FATAL:
                    return "ion-nuclear";
                default:
                    return "ion-alert";
            }
        }

        /**
         * A helper used to get a color in hex value for the given log level.
         * 
         * @param level The level of the log to get a color for.
         * @returns A hex value of a color for the given log level.
         */
        public getColorForLevel(level: number): string {

            if (level == null) {
                return "";
            }

            switch (level) {
                case Models.LogLevel.TRACE:
                    return "#551A8B"; // Purple
                case Models.LogLevel.DEBUG:
                    return "#000080"; // Navy
                case Models.LogLevel.INFO:
                    return "#000000"; // Black
                case Models.LogLevel.WARN:
                    return "#ff8000"; // Orange
                case Models.LogLevel.ERROR:
                    return "#ff0000"; // Red
                case Models.LogLevel.FATAL:
                    return "#ff0000"; // Red
                default:
                    return "#000000"; // Black
            }
        }

        /**
         * A helper used to get friendly name for display for the given log level.
         * 
         * @param level The level of the log to get a display name for.
         * @returns A display name of for the given log level.
         */
        public getDisplayLevelForLevel(level: number): string {

            if (level == null) {
                return "";
            }

            switch (level) {
                case Models.LogLevel.TRACE:
                    return "Trace";
                case Models.LogLevel.DEBUG:
                    return "Debug";
                case Models.LogLevel.INFO:
                    return "Info";
                case Models.LogLevel.WARN:
                    return "Warning";
                case Models.LogLevel.ERROR:
                    return "Error";
                case Models.LogLevel.FATAL:
                    return "Fatal";
                default:
                    return "Unknown";
            }
        }

        //#endregion

        //#region Base logging method

        /**
         * Logs a log entry.
         * 
         * Currently logs to an in-memory array whose max size is _maxLogEntries.
         * 
         * This can easily be modified to use a third party logging service (eg Ouralabs).
         * 
         * @param logLevel The severity of the log (see Models.LogLevel for possible values).
         * @param tagPrefix The prefix for the log entries tag (normally the ID of the service or controller).
         * @param tag The tag for the log (normally the name of the method).
         * @param message The descriptive text for the log entry.
         * @param metadata An optional object to be logged with the log entry.
         */
        private log(logLevel: Models.LogLevel, tagPrefix: string, tag: string, message: string, metadata?: any): void {

            if (logLevel == null) {
                logLevel = Models.LogLevel.DEBUG;
            }

            if (!tag) {
                tag = "[No Tag]";
            }

            if (!tagPrefix) {
                tagPrefix = "";
            }

            if (!message) {
                message = "[No Message]";
            }

            var logEntry = new Models.LogEntry();

            logEntry.id = this.Utilities.generateGuid();
            logEntry.level = logLevel;
            logEntry.tag = tagPrefix ? tagPrefix + "." + tag : tag;
            logEntry.message = message;
            logEntry.metadata = metadata;

            if (this._logs.length >= this._maxLogEntries) {
                this._logs = this._logs.slice(1);
            }

            this._logs.push(logEntry);

            var consoleMessage = this.Utilities.format("[{0}] {1}", tagPrefix ? tagPrefix + "." + tag : tag, message);

            /* tslint:disable:no-console */

            switch (logLevel) {
                case Models.LogLevel.TRACE:
                    console.trace.call(console, consoleMessage, metadata);
                    break;
                case Models.LogLevel.DEBUG:
                    console.debug(consoleMessage, metadata);
                    break;
                case Models.LogLevel.INFO:
                    console.info(consoleMessage, metadata);
                    break;
                case Models.LogLevel.WARN:
                    console.warn(consoleMessage, metadata);
                    break;
                case Models.LogLevel.ERROR:
                    console.error(consoleMessage, metadata);
                    break;
                case Models.LogLevel.FATAL:
                    console.error(consoleMessage + " (FATAL)", metadata);
                    break;
                default:
                    console.debug(consoleMessage, metadata);
                    break;
            }

            /* tslint:enable:no-console */
        }

        //#endregion
    }
}
