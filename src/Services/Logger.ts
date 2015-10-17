module JustinCredible.SampleApp.Services {

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

        public trace(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.log(Models.LogLevel.TRACE, tagPrefix, tag, message, metadata);
        }

        public debug(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.log(Models.LogLevel.DEBUG, tagPrefix, tag, message, metadata);
        }

        public info(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.log(Models.LogLevel.INFO, tagPrefix, tag, message, metadata);
        }

        public warn(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.log(Models.LogLevel.WARN, tagPrefix, tag, message, metadata);
        }

        public error(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.log(Models.LogLevel.ERROR, tagPrefix, tag, message, metadata);
        }

        public fatal(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.log(Models.LogLevel.FATAL, tagPrefix, tag, message, metadata);
        }

        public clear(): void {
            this._logs = [];
        }

        public get logs(): Models.LogEntry[] {
            return this._logs;
        }

        public getLog(id: string): Models.LogEntry {
            return _.find(this._logs, (logEntry: Models.LogEntry) => {
                return logEntry.id === id;
            });
        }

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
            logEntry.level = Models.LogLevel.TRACE;
            logEntry.tag = tagPrefix ? tagPrefix + "." + tag : tag;
            logEntry.message = message;
            logEntry.metadata = metadata;

            if (this._logs.length >= this._maxLogEntries) {
                this._logs = this._logs.slice(1);
            }

            this._logs.push(logEntry);

            var consoleMessage = this.Utilities.format("[{0}] {1}", tagPrefix ? tagPrefix + "." + tag : tag, message);

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
        }
    }
}
