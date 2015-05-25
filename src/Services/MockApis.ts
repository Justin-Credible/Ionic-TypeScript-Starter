module JustinCredible.SampleApp.Services {

    /**
     * Provides a set of mocked up APIs for functions that aren't available in the Apache
     * Ripple Emulator. Also allows us to mock up responses to API requests when the application
     * is in "Mock API" mode (via the development tools).
     */
    export class MockApis {

        public static $inject = ["$q", "$httpBackend", "$ionicPopup", "$ionicLoading", "Utilities"];

        private $q: ng.IQService;
        private $httpBackend: ng.IHttpBackendService;
        private Utilities: Utilities;
        private $ionicPopup: any;
        private $ionicLoading: any;

        private isProgressIndicatorShown: boolean;

        constructor($q: ng.IQService, $httpBackend: ng.IHttpBackendService, $ionicPopup: any, $ionicLoading: any, Utilities: Utilities) {
            this.$q = $q;
            this.$httpBackend = $httpBackend;
            this.Utilities = Utilities;
            this.$ionicPopup = $ionicPopup;
            this.$ionicLoading = $ionicLoading;

            this.isProgressIndicatorShown = false;
        }

        //#region Public API

        /**
         * Used to setup a random delay time for mock HTTP requests.
         * 
         * @param $provide The provider service which will be used to obtain and decorate the httpBackend service.
         */
        public static setupMockHttpDelay($provide: ng.auto.IProvideService) {
            var maxDelay = 3000,
                minDelay = 1000;

            // Example taken from the following blog post:
            // http://endlessindirection.wordpress.com/2013/05/18/angularjs-delay-response-from-httpbackend/
            $provide.decorator("$httpBackend", function ($delegate) {
                var proxy = function (method, url, data, callback, headers) {
                    var interceptor = function () {
                        var _this = this,
                            _arguments = arguments,
                            delay: number;

                        if (url.indexOf(".html") > -1) {
                            // Don't apply a delay for templates.
                            callback.apply(_this, _arguments);
                        }
                        else {
                            // http://jsfiddle.net/alanwsmith/GfAhy/
                            delay = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);

                            setTimeout(function () {
                                callback.apply(_this, _arguments);
                            }, delay);
                        }
                    };
                    return $delegate.call(this, method, url, data, interceptor, headers);
                };

                /* tslint:disable:forin */
                for (var key in $delegate) {
                    proxy[key] = $delegate[key];
                }
                /* tslint:enable:forin */

                return proxy;
            });
        }

        /**
         * Used to mock the responses for the $http service. Useful when debugging
         * or demo scenarios when a backend is not available.
         * 
         * This can only be called once per page (ie on page load). Subsequent calls
         * will not remove existing mock rules.
         * 
         * @param mock True to mock API calls, false to let them pass through normally.
         */
        public mockHttpCalls(mock: boolean) {

            // Always allow all requests for templates to go through.
            this.$httpBackend.whenGET(/.*\.html/).passThrough();

            if (mock) {
                // Mock up all the API requests.
                //this.$httpBackend.whenGET(/someUrl/).respond(200, this.getMockTokenGetResponse());
            }
            else {
                // Allow ALL HTTP requests to go through.
                this.$httpBackend.whenDELETE(/.*/).passThrough();
                this.$httpBackend.whenGET(/.*/).passThrough();
                //this.$httpBackend.whenHEAD(/.*/).passThrough(); //TODO The ts.d includes whenHEAD but this version of Angular doesn't?
                this.$httpBackend.whenJSONP(/.*/).passThrough();
                this.$httpBackend.whenPATCH(/.*/).passThrough();
                this.$httpBackend.whenPOST(/.*/).passThrough();
                this.$httpBackend.whenPUT(/.*/).passThrough();
            }
        }

        /**
         * Used to mock up the plugin APIs that are not present when running in the Apache
         * Cordova runtime so that we can polyfill functionality for testing etc.
         */
        public mockCordovaPlugins() {
            var mockToastPlugin: ICordovaToastPlugin,
                mockPushNotificationPlugin: PushNotification,
                mockClipboardPlugin: ICordovaClipboardPlugin;

            mockToastPlugin = {
                show: _.bind(this.toast, this),
                showLongBottom: _.bind(this.toast, this),
                showLongCenter: _.bind(this.toast, this),
                showLongTop: _.bind(this.toast, this),
                showShortBottom: _.bind(this.toast, this),
                showShortCenter: _.bind(this.toast, this),
                showShortTop: _.bind(this.toast, this)
            };

            mockPushNotificationPlugin = {
                register: _.bind(this.pushNotification_register, this),
                unregister: _.bind(this.pushNotification_unregister, this),
                setApplicationIconBadgeNumber: _.bind(this.pushNotification_setApplicationIconBadgeNumber, this)
            };

            mockClipboardPlugin = {
                copy: _.bind(this.clipboard_copy, this),
                paste: _.bind(this.clipboard_paste, this)
            };

            navigator.notification = {
                alert: _.bind(this.notification_alert, this),
                confirm: _.bind(this.notification_confirm, this),
                prompt: _.bind(this.notification_prompt, this),
                beep: _.bind(this.notification_beep, this),
                vibrate: _.bind(this.notification_vibrate, this),
                vibrateWithPattern: _.bind(this.notification_vibrateWithPattern, this),
                cancelVibration: _.bind(this.notification_cancelVibration, this)
            };

            window.ProgressIndicator = {
                hide: _.bind(this.progressIndicator_hide, this),
                showSimple: _.bind(this.progressIndicator_show, this),
                showSimpleWithLabel: _.bind(this.progressIndicator_show, this),
                showSimpleWithLabelDetail: _.bind(this.progressIndicator_show, this),
                showDeterminate: _.bind(this.progressIndicator_show, this),
                showDeterminateWithLabel: _.bind(this.progressIndicator_show, this),
                showAnnular: _.bind(this.progressIndicator_show, this),
                showAnnularWithLabel: _.bind(this.progressIndicator_show, this),
                showBar: _.bind(this.progressIndicator_show, this),
                showBarWithLabel: _.bind(this.progressIndicator_show, this),
                showSuccess: _.bind(this.progressIndicator_show, this),
                showText: _.bind(this.progressIndicator_show, this)
            };

            // Cast to any so we can avoid TypeScript's interface enforcement.
            var windowObj = <any>window;

            if (typeof(windowObj.cordova) === "undefined") {
                windowObj.cordova = {};
            }

            if (typeof(windowObj.cordova.plugins) === "undefined") {
                windowObj.cordova.plugins = {};
            }

            if (typeof(windowObj.plugins) === "undefined") {
                windowObj.plugins = {};
            }

            windowObj.cordova.plugins.clipboard = mockClipboardPlugin;
            windowObj.plugins.toast = mockToastPlugin;
            windowObj.plugins.pushNotification = mockPushNotificationPlugin;
        }

        /**
         * Used to mock up the APIs that are not present when running in Android.
         */
        public mockForAndroid() {

            window.ProgressIndicator = {
                hide: _.bind(this.progressIndicator_hide, this),
                showSimple: _.bind(this.progressIndicator_show, this),
                showSimpleWithLabel: _.bind(this.progressIndicator_show, this),
                showSimpleWithLabelDetail: _.bind(this.progressIndicator_show, this),
                showDeterminate: _.bind(this.progressIndicator_show, this),
                showDeterminateWithLabel: _.bind(this.progressIndicator_show, this),
                showAnnular: _.bind(this.progressIndicator_show, this),
                showAnnularWithLabel: _.bind(this.progressIndicator_show, this),
                showBar: _.bind(this.progressIndicator_show, this),
                showBarWithLabel: _.bind(this.progressIndicator_show, this),
                showSuccess: _.bind(this.progressIndicator_show, this),
                showText: _.bind(this.progressIndicator_show, this)
            };
        }

        //#endregion

        //#region Mock functions for JS APIs

        //#region Toast

        private toast(message: string) {
            var div: HTMLDivElement,
                existingToasts: number;

            existingToasts = document.querySelectorAll(".mockToast").length;

            div = document.createElement("div");
            div.className = "mockToast";
            div.style.position = "absolute";
            div.style.bottom = (existingToasts === 0 ? 0 : (35 * existingToasts)) + "px";
            div.style.width = "100%";
            div.style.backgroundColor = "#444444";
            div.style.opacity = "0.8";
            div.style.textAlign = "center";
            div.style.color = "#fff";
            div.style.padding = "10px";
            div.style.zIndex = "9000";
            div.innerText = message;

            document.body.appendChild(div);

            setTimeout(() => {
                document.body.removeChild(div);
            }, 3000);
        }

        //#endregion

        //#region Push Notifications

        private pushNotification_register(successCallback: (registrationId: string) => void, errorCallback: (error: any) => void, registrationOptions: RegistrationOptions): void {
            console.log("window.pushNotification.register()", registrationOptions);

            setTimeout(() => {
                errorCallback(new Error("Not implemented in MockApis.ts"));
            }, 0);
        }

        private pushNotification_unregister(successCallback: (result: any) => void, errorCallback: (error: any) => void): void {
            console.log("window.pushNotification.unregister()");

            setTimeout(() => {
                errorCallback(new Error("Not implemented in MockApis.ts"));
            }, 0);
        }

        private pushNotification_setApplicationIconBadgeNumber(successCallback: (result: any) => void, errorCallback: (error: any) => void, badgeCount: number): void {
            console.log("window.pushNotification.setApplicationIconBadgeNumber()", badgeCount);

            setTimeout(() => {
                errorCallback(new Error("Not implemented in MockApis.ts"));
            }, 0);
        }

        //#endregion

        //#region Clipboard

        private clipboard_copy(text: string, onSuccess: () => void, onFail: (err: Error) => void): void {
            var confirmed = confirm("The following text was requested for copy to the clipboard:\n\n" +  text);

            // Simulate the asynchronous operation with defer.
            if (confirmed) {
                _.defer(() => {
                    if (onSuccess) {
                        onSuccess();
                    }
                });
            }
            else {
                _.defer(() => {
                    if (onFail) {
                        onFail(new Error("The operation was cancelled."));
                    }
                });
            }
        }

        private clipboard_paste(onSuccess: (result: string) => void, onFail: (err: Error) => void): void {
            var result = prompt("A paste from clipboard was requested; enter text for the paste operation:");

            // Simulate the asynchronous operation with defer.
            if (result === null) {
                _.defer(() => {
                    if (onFail) {
                        onFail(new Error("The operation was cancelled."));
                    }
                });
            }
            else {
                _.defer(() => {
                    if (onSuccess) {
                        onSuccess(result);
                    }
                });
            }
        }

        //#endregion

        //#region Notifications

        private notification_alert(message: string, alertCallback: () => void, title?: string, buttonName?: string): void {
            var buttons = [];

            // Default the title.
            title = title || "Alert";

            // Default the button label text.
            buttonName = buttonName || "OK";

            // Build each of the buttons.
            buttons.push({ text: buttonName });

            // The Ionic pop-up uses HTML to display content, so for line breaks (\n) to render
            // we need to replace them with actual line break takes.
            message = message.replace(/\n/g, "<br/>");

            // Delegate to Ionic's pop-up framework.
            this.$ionicPopup.show({ title: title, template: message, buttons: buttons }).then(() => {
                if (alertCallback) {
                    alertCallback();
                }
            });
        }

        private notification_confirm(message: string, confirmCallback: (choice: number) => void, title?: string, buttonLabels?: string[]): void {
            var buttons = [];

            // Default the title.
            title = title || "Confirm";

            // Default the buttons array.
            buttonLabels = buttonLabels || ["Yes", "No"];

            // Build each of the buttons.
            buttonLabels.forEach((value: string, index: number) => {
                buttons.push({
                    text: value,
                    onTap: function (e: MouseEvent) {
                        // The native confirm API uses a 1 based button index (not zero based!).
                        return index + 1;
                    }
                });
            });

            // The Ionic pop-up uses HTML to display content, so for line breaks (\n) to render
            // we need to replace them with actual line break takes.
            message = message.replace(/\n/g, "<br/>");

            // Delegate to Ionic's pop-up framework.
            this.$ionicPopup.show({ title: title, template: message, buttons: buttons }).then((result: number) => {
                if (confirmCallback) {
                    confirmCallback(result);
                }
            });
        }

        private notification_prompt(message: string, promptCallback: (result: NotificationPromptResult) => void, title?: string, buttonLabels?: string[], defaultText?: string): void {
            var buttons = [],
                template: string;

            // The Ionic pop-up uses HTML to display content, so for line breaks (\n) to render
            // we need to replace them with actual line break takes.
            message = message.replace(/\n/g, "<br/>");

            // Here we manually build the HTML template for the prompt dialog.
            template = this.Utilities.format("<p>{0}</p><input type='text' id='notification_prompt_input' style='border: solid 1px #3e3e3e;'/>", message);

            // Default the title.
            title = title || "Prompt";

            // Default the buttons array.
            buttonLabels = buttonLabels || ["OK", "Cancel"];

            // Build each of the buttons.
            buttonLabels.forEach((value: string, index: number) => {
                buttons.push({
                    text: value,
                    onTap: function (e: MouseEvent) {
                        var result: NotificationPromptResult,
                            input: HTMLInputElement;

                        input = <HTMLInputElement>document.getElementById("notification_prompt_input");

                        result = {
                            // The native confirm API uses a 1 based button index (not zero based!).
                            buttonIndex: index + 1,
                            input1: input.value
                        };

                        return result;
                    }
                });
            });

            // Handle defaulting the value.
            if (defaultText) {
                _.defer(function () {
                    var input: HTMLInputElement;

                    input = <HTMLInputElement>document.getElementById("notification_prompt_input");

                    input.value = defaultText;
                });
            }

            // Delegate to Ionic's pop-up framework.
            this.$ionicPopup.show({ title: title, template: template, buttons: buttons }).then((result: NotificationPromptResult) => {
                if (promptCallback) {
                    promptCallback(result);
                }
            });
        }

        private notification_beep(times: number): void {
            this.$ionicPopup.alert({ title: "Beep", template: "Beep count: " + times });
        }

        private notification_vibrate(time: number): void {
            this.$ionicPopup.alert({ title: "Vibrate", template: "Vibrate time: " + time });
        }

        private notification_vibrateWithPattern(pattern, repeat): void {
            this.$ionicPopup.alert({ title: "Vibrate with Pattern", template: "Pattern: " + pattern + "\nRepeat: " + repeat });
        }

        private notification_cancelVibration(): void {
            this.$ionicPopup.alert({ title: "Cancel Vibration", template: "cancel" });
        }

        //#endregion

        //#region ProgressIndicator

        private progressIndicator_hide() {
            // There seems to be a bug in the Ionic framework when you close the loading panel
            // very quickly (before it has fully been shown) that the backdrop will remain visible
            // and the user won't be able to click anything. Here we ensure that all calls to hide
            // happen after at least waiting one second.
            setTimeout(() => {
                this.$ionicLoading.hide();
                this.isProgressIndicatorShown = false;
            }, 1000);
        }

        private progressIndicator_show(dimBackground: boolean, labelOrTimeout: any, labelOrPosition: string) {
            var label: string,
                timeout: number;

            if (this.isProgressIndicatorShown) {
                return;
            }

            this.isProgressIndicatorShown = true;

            if (typeof (labelOrTimeout) === "string") {
                label = labelOrTimeout;
            }

            if (typeof (labelOrTimeout) === "number") {
                timeout = labelOrTimeout;
            }

            if (!label) {
                label = "Please Wait...";
            }

            this.$ionicLoading.show({
                template: label
            });

            if (timeout) {
                setTimeout(() => {
                    this.isProgressIndicatorShown = false;
                    this.$ionicLoading.hide();
                }, timeout);
            }
        }

        //#endregion

        //#endregion
    }
}
