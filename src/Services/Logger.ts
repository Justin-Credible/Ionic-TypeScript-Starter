module JustinCredible.SampleApp.Services {

    /**
     * Provides a common set of helper/utility methods for logging errors.
     */
    export class Logger {

        //#region Injection

        public static ID = "Logger";

        public static get $inject(): string[] {
            return [
                "$q",
                Utilities.ID,
                FileUtilities.ID
            ];
        }

        constructor(
            private $q: ng.IQService,
            private Utilities: Utilities,
            private FileUtilities: FileUtilities) {
        }

        //#endregion

        private _logToLocalStorage: boolean = false;
        private _logs: Models.LogEntry[] = [];

        private addLogEntry(logEntry: Models.LogEntry): ng.IPromise<void> {
            var q = this.$q.defer<void>(),
                errorCallback;

            // Lets handle the simple case first. If we are not logging
            // to disk, then all we need to do is add to the in-memory array.
            if (!this._logToLocalStorage) {
                this._logs.push(logEntry);
                q.resolve();
                return q.promise;
            }

            // If we are utilizing local storage, then we have more work to do.

            // Define our common error callback; if something goes wrong then we can just
            // use the in-memory array and fall back to in-memory logging.
            errorCallback = (error: any) => {
                this._logToLocalStorage = false;
                console.warn("Reverting to in-memory logging because an error occurred during file I/O in addLogEntry().", error);
                this._logs.push(logEntry);
                q.resolve();
            };

            // First, we need to ensure the log directory is available.
            this.FileUtilities.createDirectory("/logs").then(() => {
                var logFileName: string,
                    json: string;

                logFileName = this.Utilities.format("/logs/{0}.log", moment(logEntry.timestamp).format("YYYY-MM-DD_hh-mm-ss-SSS-a"));

                try {
                    json = JSON.stringify(logEntry);
                } catch (exception) {
                    // If for some reason we couldn't stringify the log entry (circular reference perhaps?)
                    // then we'll just emit the log entry and error to the console.
                    console.error("Unable to stringify the log entry.", logEntry, exception);
                    q.resolve();
                    return;
                }

                this.FileUtilities.writeTextFile(logFileName, json).then(() => {

                    q.resolve();

                }, errorCallback);

            }, errorCallback);
        }

        public getLog(id: string): ng.IPromise<Models.LogEntry> {
            var q = this.$q.defer<Models.LogEntry>(),
                logEntry: Models.LogEntry,
                errorCallback;

            // Lets handle the simple case first. If the log entry is already
            // available in-memory, then we can just return it.
            logEntry = _.find(this._logs, (logEntry: Models.LogEntry) => {
                return logEntry.id === id;
            });

            if (logEntry != null) {
                q.resolve(logEntry);
                return q.promise;
            }

            // If we didn't find the log entry in-memory AND we aren't using local
            // storage for logs, then there is no log entry available.
            if (!this._logToLocalStorage) {
                q.resolve(null);
                return q.promise;
            }

            // If we didn't find the log entry in-memory and we are using local storage
            // then we'll read in the logs to see if it is available in storage.

            // Define our common error callback; if something goes wrong then we can just
            // use the in-memory array and fall back to in-memory logging.
            errorCallback = (error: any) => {
                this._logToLocalStorage = false;
                console.warn("Reverting to in-memory logging because an error occurred during file I/O in getLog().", error);
                q.resolve(null);
            };

            // Delegate to getLogs() and then try to find the specific log entry.
            this.getLogs().then((logEntries: Models.LogEntry[]) => {

                logEntry = _.find(logEntries, (logEntry: Models.LogEntry) => {
                    return logEntry.id === id;
                });

                q.resolve(logEntry);

            }, errorCallback);

            return q.promise;
        }

        public getLogs(): ng.IPromise<Models.LogEntry[]> {
            var q = this.$q.defer<Models.LogEntry[]>(),
                promises: ng.IPromise<string>[] = [],
                errorCallback;

            // Lets handle the simple case first. If we are not logging
            // to disk, then all we need to do is return the in-memory array.
            if (!this._logToLocalStorage) {
                q.resolve(this._logs);
                return q.promise;
            }

            // If we are utilizing local storage, then we have more work to do.

            // Define our common error callback; if something goes wrong then we can just
            // use the in-memory array and fall back to in-memory logging.
            errorCallback = (error: any) => {
                this._logToLocalStorage = false;
                console.warn("Reverting to in-memory logging because an error occurred during file I/O in getLogs().", error);
                q.resolve(this._logs);
            };

            this._logs = [];

            // First, we need to ensure the log directory is available.
            this.FileUtilities.createDirectory("/logs").then(() => {

                // If the log directory was available, then get all of its files.
                this.FileUtilities.getFiles("/logs").then((entries: Entry[]) => {

                    // Filter it down to just .log files.
                    entries = _.filter(entries, (entry: Entry) => {
                        return this.Utilities.endsWith(entry.name, ".log");
                    });

                    // Read in the contents of each file (which will be JSON).
                    entries.forEach((entry: Entry) => {
                        var promise: ng.IPromise<string>;

                        // Read in the file and deserialize its JSON contents back to
                        // a log model object.
                        promise = this.FileUtilities.readTextFile(entry.fullPath);
                        promise.then((text: string) => {
                            var logEntry: Models.LogEntry;

                            logEntry = <Models.LogEntry>JSON.parse(text);

                            this._logs.push(logEntry);

                        }, errorCallback);

                        // Store a reference to this file I/O promise because we have
                        // to wait until all the I/O operations have completed before
                        // we can resolve this method's promise.
                        promises.push(promise);
                    });

                    // We need to wait until all of the I/O operations have completed before
                    // resolving this promise.
                    this.$q.all(promises).then(() => {

                        q.resolve(this._logs);

                    }, q.reject);

                }, errorCallback);

            }, errorCallback);

            return q.promise;
        }

        public clearLogs(): ng.IPromise<void> {
            var q = this.$q.defer<void>(),
                errorCallback;

            // Lets handle the simple case first. If we are not logging
            // to disk, then all we need to do is clear the in-memory array.
            if (!this._logToLocalStorage) {
                this._logs = [];
                q.resolve();
                return q.promise;
            }

            // If we are utilizing local storage, then we have more work to do.

            // Define our common error callback; if something goes wrong then we can just
            // clear the in-memory array and fall back to in-memory logging.
            errorCallback = (error: any) => {
                this._logToLocalStorage = false;
                console.warn("Reverting to in-memory logging because an error occurred during file I/O in clearLogs().", error);
                this._logs = [];
                q.resolve();
            };

            // First, we need to ensure the log directory is available.
            this.FileUtilities.createDirectory("/logs").then(() => {

                // If the local storage logs directory is available then lets remove all of its files.
                this.FileUtilities.emptyDirectory("/logs").then(() => {

                    this._logs = [];

                    q.resolve();

                }, errorCallback);

            }, errorCallback);

            return q.promise;
        }

        public logWindowError(message: string, uri: string, lineNumber: number, colNumber: number): void {
            var logEntry: Models.LogEntry;

            logEntry = new Models.LogEntry();
            logEntry.id = this.Utilities.generateGuid();
            logEntry.timestamp = new Date();
            logEntry.message = "Unhandled JS Exception: " + message;
            logEntry.uri = uri;
            logEntry.lineNumber = lineNumber;
            logEntry.colNumber = colNumber;

            this.addLogEntry(logEntry);
        }

        public logError(message: string, error: Error): void {
            var logEntry: Models.LogEntry;

            logEntry = new Models.LogEntry();
            logEntry.id = this.Utilities.generateGuid();
            logEntry.timestamp = new Date();
            logEntry.message = message;
            logEntry.error = error;

            // This won't tell us what script file the error came from, but it
            // will at least let us know which URL and hash tag they're on.
            logEntry.uri = window.location.toString();

            this.addLogEntry(logEntry);
        }

        public logHttpRequestConfig(config: Interfaces.RequestConfig): void {
            var logEntry: Models.LogEntry;

            logEntry = new Models.LogEntry();
            logEntry.id = this.Utilities.generateGuid();
            logEntry.timestamp = new Date();
            logEntry.uri = window.location.href;
            logEntry.message = "HTTP Request";

            logEntry.httpMethod = config.method;
            logEntry.httpUrl = config.url;
            logEntry.httpBody = typeof (config.data) === "string" ? config.data : JSON.stringify(config.data);
            logEntry.httpHeaders = JSON.stringify(config.headers);

            this.addLogEntry(logEntry);
        }

        public logHttpResponse(httpResponse: ng.IHttpPromiseCallbackArg<any>): void {
            var logEntry: Models.LogEntry;

            logEntry = new Models.LogEntry();
            logEntry.id = this.Utilities.generateGuid();
            logEntry.timestamp = new Date();
            logEntry.uri = window.location.href;
            logEntry.message = "HTTP Response";

            logEntry.httpUrl = httpResponse.config.url;
            logEntry.httpStatus = httpResponse.status;
            logEntry.httpStatusText = httpResponse.statusText;
            logEntry.httpBody = typeof (httpResponse.data) === "string" ? httpResponse.data : JSON.stringify(httpResponse.data);
            logEntry.httpHeaders = JSON.stringify(httpResponse.headers);

            this.addLogEntry(logEntry);
        }

        public setLogToLocalStorage(logToLocalStorage: boolean): void {
            this._logToLocalStorage = logToLocalStorage;
        }

        public getLogToLocalStorage(): boolean {
            return this._logToLocalStorage;
        }
    }
}
