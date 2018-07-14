namespace JustinCredible.SampleApp.Services {

    /**
     * Methods for identifying and working with the current platform.
     */
    export class Platform {

        //#region Injection

        public static ID = "Platform";

        public static get $inject(): string[] {
            return [
                "$window",
                "isCordova",
                "buildVars",
                "isChromeExtension",
            ];
        }

        constructor(
            private $window: ng.IWindowService,
            private isCordova: boolean,
            private buildVars: Interfaces.BuildVars,
            private isChromeExtension: boolean,
            ) {
        }

        //#endregion

        /**
         * Regular expression for matching "iPhone", "iPod", or "iPad".
         */
        private _iOSDeviceRegEx = /iP(hone|od|ad)/;

        /**
         * Regular expression for matching "iPhone".
         */
        private _iPhoneRegEx = /iPhone/;

        /**
         * Regular expression for matching "iPad".
         */
        private _iPadRegEx = /iPad/;

        /**
         * Regular expression for matching "iPod".
         */
        private _iPodRegEx = /iPod/;

        /**
         * Regular expression for matching the iOS version number from the user agent.
         * Taken from: http://stackoverflow.com/a/14223920
         */
        private _iOSVersionRegEx = /OS (\d+)_(\d+)_?(\d+)?/;

        /**
         * Regular expression for matching the Android version number from the user agent.
         * Taken from: http://stackoverflow.com/a/5960300
         */
        private _androidVersionRegEx = /Android (\d+)\.?(\d+)?\.?(\d+)?/;

        /**
         * Will hold the cached device object, if one was created. Used by the device property.
         */
        private _device: Device;

        //#region Public Members

        /**
         * Can be used to determine if this application is being run in the Cordova runtime.
         */
        public get cordova(): boolean {
            return this.isCordova;
        }

        /**
         * Can be used to determine if this application was built to be served as a website.
         */
        public get web(): boolean {
            return this.buildVars.config.isWebPlatform;
        }

        /**
         * Can be used to determine if this application was built to be served as a website
         * AND it is operating in standalone mode (e.g. the user added the site to their
         * home screen from the browser, and have launch from the home screen).
         */
        public get webStandalone(): boolean {

            if (!this.web) {
                return false;
            }

            // http://stackoverflow.com/questions/21125337/how-to-detect-if-web-app-running-standalone-on-chrome-mobile
            return this.$window.navigator.standalone // iOS Safari
                || this.$window.matchMedia("(display-mode: standalone)").matches; // Android Chrome
        }

        /**
         * Can be used to determine if the application is running as a Chrome browser Extension.
         * 
         * @returns True if the application is running as a Chrome Extension, false otherwise.
         */
        public get chromeExtension(): boolean {
            return this.isChromeExtension;
        }

        /**
         * Used to check if the current platform is Android (native cordova OR web app).
         */
        public get android(): boolean {
            return this.cordova
                    ? this.androidCordova
                    : this.androidWeb;
        }

        /**
         * Used to check if the current platform is native Cordova on Android.
         */
        public get androidCordova(): boolean {
            return typeof(device) !== "undefined" && device.platform === "Android";
        }

        /**
         * Used to check if the current platform is the web app on Android.
         */
        public get androidWeb(): boolean {
            return !this.cordova && this.userAgent.indexOf("Android") > -1;
        }

        /**
         * Used to check if the current platform is iOS (native cordova OR web app).
         */
        public get iOS(): boolean {
            return this.cordova
                    ? this.iOSCordova
                    : this.iOSWeb;
        }

        /**
         * Used to check if the current platform is native Cordova on iOS.
         */
        public get iOSCordova(): boolean {
            return typeof (device) !== "undefined" && device.platform === "iOS";
        }

        /**
         * Used to check if the current platform is the web app on iOS.
         */
        public get iOSWeb(): boolean {
            return !this.cordova && this._iOSDeviceRegEx.test(this.userAgent);
        }

        /**
         * Used to check if the current device is an iPhone.
         * 
         * This does not distinguish between running in Cordova or as a web app.
         */
        public get iPhone(): boolean {
            return this._iPhoneRegEx.test(this.userAgent);
        }

        /**
         * Used to check if the current device is an iPad.
         * 
         * This does not distinguish between running in Cordova or as a web app.
         */
        public get iPad(): boolean {
            return this._iPadRegEx.test(this.userAgent);
        }

        /**
         * Used to check if the current device is an iPad.
         * 
         * This does not distinguish between running in Cordova or as a web app.
         */
        public get iPod(): boolean {
            return this._iPodRegEx.test(this.userAgent);
        }

        /**
         * Used to check if the current platform is native Cordova on Windows Phone 8.x.
         */
        public get windowsPhone8Cordova(): boolean {
            return typeof(device) !== "undefined" && device.platform === "WP8";
        }

        /**
         * Used to check if the current platform is native Cordova on Windows 8 (desktop OS).
         */
        public get windows8Cordova(): boolean {
            return typeof(device) !== "undefined" && device.platform === "Windows8";
        }

        /**
         * Used to check if the current platform is native Cordova on Windows 10 / UWP.
         */
        public get windowsCordova(): boolean {
            return typeof(device) !== "undefined" && device.platform === "windows";
        }

        /**
         * Used to return information about the device.
         */
        public get device(): Device {

            // If we're running in Cordova, the device plugin exposes a global object.
            if (this.cordova && typeof(device) !== "undefined") {
                return device;
            }

            // If we've already built the object, re-use it again.
            if (this._device) {
                return this._device;
            }

            // Otherwise, we need to determine this information ourselves.

            let platform = "unknown";
            let osVersion = "unknown";

            if (this.iOSWeb) {
                platform = "iOS";
                osVersion = this.iOSVersionString;
            }
            else if (this.androidWeb) {
                platform = "Android";
                osVersion = this.androidVersionString;
            }

            this._device = {
                cordova: "N/A", // Cordova Version
                platform: platform,
                model: "unknown", // Device Model
                uuid: "N/A", // Device UUID
                version: osVersion,
                capture: null,
            };

            return this._device;
        }

        /**
         * Used to get the current dimensions of the viewport.
         * 
         * https://andylangton.co.uk/blog/development/get-viewportwindow-size-width-and-height-javascript
         * 
         * @returns An object with the current width and height of the viewport.
         */
        public get viewport(): { width: number; height: number } {

            let e: any = window;
            let a = "inner";

            if (!("innerWidth" in window )) {
                a = "client";
                e = document.documentElement || document.body;
            }

            return { width : e[ a + "Width" ] , height : e[ a + "Height" ] };
        }

        //#endregion

        //#region Private Members

        /**
         * A convenience getter for the user agent.
         */
        private get userAgent(): string {
            return this.$window.navigator.userAgent;
        }

        /**
         * Gets the version number of the iOS operating system.
         * Returns a string in the form of "major.minor.revision".
         */
        private get iOSVersionString(): string {

            let version = this.iOSVersion;

            if (!version || version.length === 0) {
                return "unknown";
            }
            else {
                return version.join(".");
            }
        }

        /**
         * Gets the version number of the iOS operating system.
         * Returns an array of numbers in this order: major, minor, revision.
         */
        private get iOSVersion(): number[] {

            // Adapted from: http://stackoverflow.com/a/14223920

            if (!this._iOSDeviceRegEx.test(this.userAgent)) {
                return [];
            }

            let matches = this.userAgent.match(this._iOSVersionRegEx);

            try {
                return [
                    parseInt(matches[1], 10),
                    parseInt(matches[2], 10),
                    parseInt(matches[3] || "0", 10),
                ];
            }
            catch (error) {
                return [];
            }
        }

        /**
         * Gets the version number of the Android operating system.
         * Returns a string in the form of "major.minor.revision".
         */
        private get androidVersionString(): string {

            let version = this.androidVersion;

            if (!version || version.length === 0) {
                return "unknown";
            }
            else {
                return version.join(".");
            }
        }

        /**
         * Gets the version number of the Android operating system.
         * Returns an array of numbers in this order: major, minor, revision.
         */
        private get androidVersion(): number[] {

            if (this.userAgent.indexOf("Android ") === -1) {
                return [];
            }

            let matches = this.userAgent.match(this._androidVersionRegEx);

            try {
                return [
                    parseInt(matches[1], 10),
                    parseInt(matches[2], 10),
                    parseInt(matches[3] || "0", 10),
                ];
            }
            catch (error) {
                return [];
            }
        }

        //#endregion
    }
}
