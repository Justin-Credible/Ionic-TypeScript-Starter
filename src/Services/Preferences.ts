module JustinCredible.SampleApp.Services {

    /**
     * Provides a way to easily get/set user preferences.
     * 
     * The current backing store is local storage and/or session storage:
     * https://cordova.apache.org/docs/en/3.0.0/cordova_storage_storage.md.html#localStorage
     */
    export class Preferences {

        //#region Injection

        public static ID = "Preferences";

        //#endregion

        //#region Local Storage Keys

        private static USER_ID = "USER_ID";
        private static TOKEN = "TOKEN";
        private static PIN = "PIN";
        private static CATEGORY_ORDER = "CATEGORY_ORDER";

        //#endregion

        //#region User ID/Token

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

        //#endregion

        //#region Mobile Application Specific

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

        //#endregion
    }
}
