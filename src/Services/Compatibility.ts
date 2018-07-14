
namespace JustinCredible.SampleApp.Services {

    /**
     * Provides utility methods for normalizing behavior between different browsers/environments.
     */
    export class Compatibility {

        //#region Injection

        public static ID = "Compatibility";

        public static get $inject(): string[] {
            return [
            ];
        }

        //#endregion

        //#region Page Visibility API

        /**
         * Used to determine if the tab for this document is currently visible.
         * 
         * https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
         * 
         * NOTE: This is only applicable when the app is running in a standard web browser.
         */
        public get isDocumentHidden(): boolean {

            var propertyName: string = null;

            /* tslint:disable:no-string-literal */

            if (typeof document.hidden !== "undefined") {
                // Opera 12.10 and Firefox 18 and later support.
                propertyName = "hidden";
            }
            else if (typeof document["msHidden"] !== "undefined") {
                propertyName = "msHidden";
            }
            else if (typeof document["webkitHidden"] !== "undefined") {
                propertyName = "webkitHidden";
            }
            else {
                // If the API isn't available, we must assume the page is visible.
                return true;
            }

            /* tslint:enable:no-string-literal */

            return !!document[propertyName];
        }

        /**
         * Returns the name of the visibilitychange event.
         * 
         * https://developer.mozilla.org/en-US/docs/Web/Events/visibilitychange
         */
        public get visibilityChangeEventName(): string {

            var propertyName: string = null;

            /* tslint:disable:no-string-literal */

            if (typeof document.hidden !== "undefined") {
                // Opera 12.10 and Firefox 18 and later support.
                propertyName = "visibilitychange";
            }
            else if (typeof document["msHidden"] !== "undefined") {
                propertyName = "msvisibilitychange";
            }
            else if (typeof document["webkitHidden"] !== "undefined") {
                propertyName = "webkitvisibilitychange";
            }
            else {
                // Assume the current draft standard.
                propertyName = "visibilitychange";
            }

            /* tslint:enable:no-string-literal */

            return propertyName;
        }

        //#endregion
    }
}
