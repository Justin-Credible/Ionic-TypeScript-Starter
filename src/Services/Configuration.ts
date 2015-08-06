module JustinCredible.SampleApp.Services {

    /**
     * Provides a way to easily get/set application configuration.
     * 
     * The current backing store is local storage and/or session storage:
     * https://cordova.apache.org/docs/en/3.0.0/cordova_storage_storage.md.html#localStorage
     */
    export class Configuration {

        //#region Injection

        public static ID = "Configuration";

        public static get $inject(): string[] {
            return [
                "buildVars"
            ];
        }

        constructor(
            private buildVars: BuildVars) {
        }

        //#endregion

        //#region Local Storage Keys

        private static ENABLE_DEVELOPER_TOOLS = "ENABLE_DEVELOPER_TOOLS";
        private static ENABLE_FULL_HTTP_LOGGING = "ENABLE_FULL_HTTP_LOGGING";
        private static ENABLE_MOCK_HTTP_CALLS = "ENABLE_MOCK_HTTP_CALLS";
        private static REQUIRE_PIN_THRESHOLD = "REQUIRE_PIN_THRESHOLD";
        private static LAST_PAUSED_AT = "LAST_PAUSED_AT";
        private static HAS_COMPLETED_ONBOARDING = "HAS_COMPLETED_ONBOARDING";

        //#endregion

        //#region Defaults

        private static REQUIRE_PIN_THRESHOLD_DEFAULT = 10; // Default setting is 10 minutes.

        //#endregion

        //#region apiUrl - Path to the application's services

        private _apiUrl: string = null;

        /**
         * Path to the application's services.
         */
        get apiUrl(): string {

            // If an API URL has been set via the developer tools for this session,
            // then use it, otherwise use the URL defined by the build configuration.
            if (this._apiUrl) {
                return this._apiUrl;
            }
            else {
                return this.buildVars.apiUrl;
            }
        }

        /**
         * Allows for setting the API URL temporarily for the current session only.
         */
        set apiUrl(value: string) {
            this._apiUrl = value;
        }

        //#endregion

        //#region Framework Settings

        get enableDeveloperTools(): boolean {
            return sessionStorage.getItem(Configuration.ENABLE_DEVELOPER_TOOLS) === "true";
        }

        set enableDeveloperTools(value: boolean) {
            if (value == null) {
                sessionStorage.removeItem(Configuration.ENABLE_DEVELOPER_TOOLS);
            }
            else {
                sessionStorage.setItem(Configuration.ENABLE_DEVELOPER_TOOLS, value.toString());
            }
        }

        get enableFullHttpLogging(): boolean {
            return localStorage.getItem(Configuration.ENABLE_FULL_HTTP_LOGGING) === "true";
        }

        set enableFullHttpLogging(value: boolean) {
            if (value == null) {
                localStorage.removeItem(Configuration.ENABLE_FULL_HTTP_LOGGING);
            }
            else {
                localStorage.setItem(Configuration.ENABLE_FULL_HTTP_LOGGING, value.toString());
            }
        }

        get enableMockHttpCalls(): boolean {
            return localStorage.getItem(Configuration.ENABLE_MOCK_HTTP_CALLS) === "true";
        }

        set enableMockHttpCalls(value: boolean) {
            if (value == null) {
                localStorage.removeItem(Configuration.ENABLE_MOCK_HTTP_CALLS);
            }
            else {
                localStorage.setItem(Configuration.ENABLE_MOCK_HTTP_CALLS, value.toString());
            }
        }

        get requirePinThreshold(): number {
            var value = localStorage.getItem(Configuration.REQUIRE_PIN_THRESHOLD);
            return value == null ? Configuration.REQUIRE_PIN_THRESHOLD_DEFAULT : parseInt(value, 10);
        }

        set requirePinThreshold(value: number) {
            if (value == null) {
                localStorage.removeItem(Configuration.REQUIRE_PIN_THRESHOLD);
            }
            else {
                localStorage.setItem(Configuration.REQUIRE_PIN_THRESHOLD, value.toString());
            }
        }

        set lastPausedAt(value: moment.Moment) {
            if (value == null) {
                localStorage.removeItem(Configuration.LAST_PAUSED_AT);
            }
            else {
                localStorage.setItem(Configuration.LAST_PAUSED_AT, moment(value).format());
            }
        }

        get lastPausedAt(): moment.Moment {
            var lastPausedAt: string;

            lastPausedAt = localStorage.getItem(Configuration.LAST_PAUSED_AT);

            return moment(lastPausedAt).isValid() ? moment(lastPausedAt) : null;
        }

        get hasCompletedOnboarding(): boolean {
            return localStorage.getItem(Configuration.HAS_COMPLETED_ONBOARDING) === "true";
        }

        set hasCompletedOnboarding(value: boolean) {
            if (value == null) {
                localStorage.removeItem(Configuration.HAS_COMPLETED_ONBOARDING);
            }
            else {
                localStorage.setItem(Configuration.HAS_COMPLETED_ONBOARDING, value.toString());
            }
        }

        //#endregion
    }
}
