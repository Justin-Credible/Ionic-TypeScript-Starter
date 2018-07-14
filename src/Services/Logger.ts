namespace JustinCredible.SampleApp.Services {

    /**
     * Provides a common set of helper/utility methods for logging errors.
     */
    export class Logger implements Interfaces.Services.Logger {

        //#region Injection

        public static ID = "Logger";

        public static get $inject(): string[] {
            return [
                "$rootScope",
                Configuration.ID,
                Platform.ID,
                Utilities.ID,
            ];
        }

        constructor(
            private $rootScope: ng.IRootScopeService,
            private Configuration: Configuration,
            private Platform: Platform,
            private Utilities: Utilities,
            ) {
        }

        //#endregion

        private _logs: Models.LogEntry[];
        private _maxLogEntries = 75;

        private _currentRoute: string;

        //#region Properties

        /**
         * Used to obtain a list of log entries that are stored in memory
         * when running a debug build.
         */
        public get logs(): Models.LogEntry[] {
            return this._logs;
        }

        //#endregion

        //#region Public Methods

        public initialize(): void {

            // Subscribe to Angular events.
            this.$rootScope.$on("$locationChangeStart", _.bind(this.angular_locationChangeStart, this));
        }

        public debug(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.log(Models.LogLevel.Debug, `${tagPrefix}.${tag}`, message, metadata);
        }

        public info(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.log(Models.LogLevel.Info, `${tagPrefix}.${tag}`, message, metadata);
        }

        public warn(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.log(Models.LogLevel.Warn, `${tagPrefix}.${tag}`, message, metadata);
        }

        public error(tagPrefix: string, tag: string, message: string, metadata?: any): void {
            this.log(Models.LogLevel.Error, `${tagPrefix}.${tag}`, message, metadata);
        }

        /**
         * Used to clear the in memory list of log entries.
         */
        public clear(): void {
            this._logs = [];
        }

        /**
         * Used to get a single in memory log entry by its ID.
         * 
         * @param id The log ID of the log to retrieve.
         * @returns A single log entry with the given ID.
         */
        public getLog(id: string): Models.LogEntry {
            return _.find(this._logs, (logEntry: Models.LogEntry) => {
                return logEntry.id === id;
            });
        }

        //#endregion

        //#region Events

        /**
         * Fired when Angular's route/location (eg URL hash) is changing.
         */
        private angular_locationChangeStart(event: ng.IAngularEvent, newRoute: string, oldRoute: string): void {

            // Chop off the long "file://..." prefix (we only care about the hash tag).
            this._currentRoute = newRoute.substring(newRoute.indexOf("#"));
        }

        //#endregion

        //#region Private Methods

        private log(level: Models.LogLevel, tag: string, message: string, metadata?: any): void {

            try {
                let console_logFn,
                    levelDisplay: string;

                //# region Determine variables based on log level

                switch (level) {
                    case Models.LogLevel.Debug:
                        levelDisplay = "[DEBUG]";
                        console_logFn = console.debug;
                        break;
                    case Models.LogLevel.Info:
                        levelDisplay = "[INFO]";
                        console_logFn = console.info;
                        break;
                    case Models.LogLevel.Warn:
                        levelDisplay = "[WARN]";
                        console_logFn = console.warn;
                        break;
                    case Models.LogLevel.Error:
                        levelDisplay = "[ERROR]";
                        console_logFn = console.error;
                        break;
                    default:
                        levelDisplay = "[LOG]";
                        console_logFn = console.log;
                        break;
                }

                //#endregion

                // Allows us to morph the data to be logged.
                let preppedMetadata = this.prepareMetadata(metadata);

                // Include the current route with the log entry.
                preppedMetadata.currentRoute = this._currentRoute;

                // In debug builds, we keep the log entries in memory so we can see them from the
                // device developer tools view.
                if (this.Configuration.debug) {

                    if (!this._logs) {
                        this._logs = [];
                    }

                    if (this._logs.length >= this._maxLogEntries) {
                        this._logs = this._logs.slice(1);
                    }

                    let entry = new Models.LogEntry();
                    entry.id = this.Utilities.generateGuid();
                    entry.timestamp = moment();
                    entry.level = level;
                    entry.tag = tag;
                    entry.message = message;
                    entry.metadata = preppedMetadata;

                    this._logs.push(entry);
                }

                // Log to both the browser console and native device console.
                // Logging is slighting different based on if a metadata object is present or not.
                if (preppedMetadata == null) {

                    // Handle the simple case first-- no metadata is being logged.

                    // Show the log entry in the browser's developer tools and Android's logcat.
                    console_logFn.call(console, `${levelDisplay} ${tag}: ${message}`);

                    // TODO: STARTER
                    // On iOS we need to use a plugin to invoke the native NSLog macro.
                    // if (this.Platform.iOSCordova) {
                    //     ExternalLoggerPlugin.logUsingNsLog(`${levelDisplay} ${tag}: ${message}`);
                    // }
                }
                else {

                    // Handle the more complicated case-- a metadata object is being logged.
                    // In this case we want to make sure the metadata is logged for display by the
                    // browser's debugging tools and included as a JSON string in the native logs.

                    let metadataJson: string;

                    if (this.Platform.androidCordova || this.Platform.iOSCordova) {

                        try {
                            metadataJson = JSON.stringify(preppedMetadata);
                        }
                        catch (error) {
                            /* tslint:disable:no-empty */
                            /* tslint:enable:no-empty */
                        }
                    }

                    if (this.Platform.androidCordova) {

                        // Show the log entry in the browser's developer tools and Android's logcat.
                        console_logFn.call(console, `${levelDisplay} ${tag}: ${message} [Metadata]: ${metadataJson}`, metadata);
                    }
                    else if (this.Platform.iOSCordova) {

                        // Show the log entry in the browser's developer tools.
                        console_logFn.call(console, `${levelDisplay} ${tag}: ${message}`, metadata);

                        // TODO: STARTER
                        // On iOS we need to use a plugin to invoke the native NSLog macro.
                        // ExternalLoggerPlugin.logUsingNsLog(`${levelDisplay} ${tag}: ${message} [Metadata]: ${metadataJson}`);
                    }
                    else {
                        console_logFn.call(console, `${levelDisplay} ${tag}: ${message}`, metadata);
                    }
                }
            }
            catch (exception) {
                console.error("Error logging via Logger.logToConsole().", exception);
            }
        }

        /**
         * Prepare the metadata object for logging by ensuring any properties that do not normally
         * serialize to JSON are converted into plain objects.
         * 
         * @param metadata The metadata to prepare.
         * @returns The prepared metadata object.
         */
        private prepareMetadata(metadata: any): any {

            if (!metadata) {
                return null;
            }

            // The easiest way to do this is to leverage the filter functionality of the JSON.stringify()
            // method. The filter function is invoked for each key/value pair recursively. In the function
            // we can massage the data for types that we choose. Finally, we'll deserialize back into a
            // plain object. If this becomes a bottleneck at some point we'll have to revisit.
            try {
                // Handler for objects that do not serialize natively via JSON.stringify().
                let filter = (key: string, value: any) => {

                    if (value instanceof Exception) {

                        let exception = <Exception>value;

                        return {
                            type: "Exception",
                            message: exception.message,
                            innerError: {
                                message: exception.innerError ? exception.innerError.message : null,
                                stack: exception.innerError ? exception.innerError.stack : null,
                            },
                            context: exception.context,
                            stack: value.stack,
                        };
                    }
                    else if (value instanceof Error) {

                        let error = <Error>value;

                        return {
                            type: "Error",
                            message: error.message,
                            stack: error.stack,
                        };
                    }
                    else {
                        return value;
                    }
                };

                // Serialize into JSON with our custom filter function to massage the data.
                let metadataJson = JSON.stringify(metadata, filter);

                // Convert back into an object.
                return JSON.parse(metadataJson);
            }
            catch (error) {
                return metadata;
            }
        }

        //#endregion
    }
}
