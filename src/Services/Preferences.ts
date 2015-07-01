module JustinCredible.SampleApp.Services {

    /**
     * Provides a way to easily get/set user preferences.
     * 
     * The current backing store is local storage and/or session storage:
     * https://cordova.apache.org/docs/en/3.0.0/cordova_storage_storage.md.html#localStorage
     */
    export class Preferences {

        public static ID = "Preferences";

        public static get $inject(): string[] {
            return [];
        }

        private static USER_ID = "USER_ID";
        private static TOKEN = "TOKEN";
        private static ENABLE_DEVELOPER_TOOLS = "ENABLE_DEVELOPER_TOOLS";
        private static ENABLE_FULL_HTTP_LOGGING = "ENABLE_FULL_HTTP_LOGGING";
        private static ENABLE_MOCK_HTTP_CALLS = "ENABLE_MOCK_HTTP_CALLS";
        private static REQUIRE_PIN_THRESHOLD = "REQUIRE_PIN_THRESHOLD";
        private static LAST_PAUSED_AT = "LAST_PAUSED_AT";
        private static PIN = "PIN";
        private static CATEGORY_ORDER = "CATEGORY_ORDER";
        private static HAS_COMPLETED_ONBOARDING = "HAS_COMPLETED_ONBOARDING";

        // Default setting is 10 minutes.
        private static REQUIRE_PIN_THRESHOLD_DEFAULT = 10;

        get apiUrl(): string {
            //return localStorage.getItem(Preferences.API_URL);
            return "sample-app.justin-credible.net/api";
        }

        get userId(): string {
            return localStorage.getItem(Preferences.USER_ID);
        }

        set userId(value: string) {
            if (value == null) {
                localStorage.removeItem(Preferences.USER_ID);
            }
            else {
                localStorage.setItem(Preferences.USER_ID, value);
            }
        }

        get token(): string {
            return localStorage.getItem(Preferences.TOKEN);
        }

        set token(value: string) {
            if (value == null) {
                localStorage.removeItem(Preferences.TOKEN);
            }
            else {
                localStorage.setItem(Preferences.TOKEN, value);
            }
        }

        get enableDeveloperTools(): boolean {
            return sessionStorage.getItem(Preferences.ENABLE_DEVELOPER_TOOLS) === "true";
        }

        set enableDeveloperTools(value: boolean) {
            if (value == null) {
                sessionStorage.removeItem(Preferences.ENABLE_DEVELOPER_TOOLS);
            }
            else {
                sessionStorage.setItem(Preferences.ENABLE_DEVELOPER_TOOLS, value.toString());
            }
        }

        get enableFullHttpLogging(): boolean {
            return localStorage.getItem(Preferences.ENABLE_FULL_HTTP_LOGGING) === "true";
        }

        set enableFullHttpLogging(value: boolean) {
            if (value == null) {
                localStorage.removeItem(Preferences.ENABLE_FULL_HTTP_LOGGING);
            }
            else {
                localStorage.setItem(Preferences.ENABLE_FULL_HTTP_LOGGING, value.toString());
            }
        }

        get enableMockHttpCalls(): boolean {
            return localStorage.getItem(Preferences.ENABLE_MOCK_HTTP_CALLS) === "true";
        }

        set enableMockHttpCalls(value: boolean) {
            if (value == null) {
                localStorage.removeItem(Preferences.ENABLE_MOCK_HTTP_CALLS);
            }
            else {
                localStorage.setItem(Preferences.ENABLE_MOCK_HTTP_CALLS, value.toString());
            }
        }

        get requirePinThreshold(): number {
            var value = localStorage.getItem(Preferences.REQUIRE_PIN_THRESHOLD);
            return value == null ? Preferences.REQUIRE_PIN_THRESHOLD_DEFAULT : parseInt(value, 10);
        }

        set requirePinThreshold(value: number) {
            if (value == null) {
                localStorage.removeItem(Preferences.REQUIRE_PIN_THRESHOLD);
            }
            else {
                localStorage.setItem(Preferences.REQUIRE_PIN_THRESHOLD, value.toString());
            }
        }

        set lastPausedAt(value: moment.Moment) {
            if (value == null) {
                localStorage.removeItem(Preferences.LAST_PAUSED_AT);
            }
            else {
                localStorage.setItem(Preferences.LAST_PAUSED_AT, moment(value).format());
            }
        }

        get lastPausedAt(): moment.Moment {
            var lastPausedAt: string;

            lastPausedAt = localStorage.getItem(Preferences.LAST_PAUSED_AT);

            return moment(lastPausedAt).isValid() ? moment(lastPausedAt) : null;
        }

        get pin(): string {
            return localStorage.getItem(Preferences.PIN);
        }

        set pin(value: string) {
            if (value == null) {
                localStorage.removeItem(Preferences.PIN);
            }
            else {
                localStorage.setItem(Preferences.PIN, value);
            }
        }

        get categoryOrder(): string[] {
            var categoryOrder = localStorage.getItem(Preferences.CATEGORY_ORDER);

            if (categoryOrder == null) {
                return null;
            }
            else {
                return JSON.parse(categoryOrder);
            }
        }

        set categoryOrder(value: string[]) {
            if (value == null) {
                localStorage.removeItem(Preferences.CATEGORY_ORDER);
            }
            else {
                localStorage.setItem(Preferences.CATEGORY_ORDER, JSON.stringify(value));
            }
        }

        get hasCompletedOnboarding(): boolean {
            return localStorage.getItem(Preferences.HAS_COMPLETED_ONBOARDING) === "true";
        }

        set hasCompletedOnboarding(value: boolean) {
            if (value == null) {
                localStorage.removeItem(Preferences.HAS_COMPLETED_ONBOARDING);
            }
            else {
                localStorage.setItem(Preferences.HAS_COMPLETED_ONBOARDING, value.toString());
            }
        }
    }
}
