module JustinCredible.SampleApp.Services {

    /**
     * Provides mock implementation APIs that may not be available on all platforms.
     */
    export class MockPlatformApis {

        //#region Injection

        public static ID = "MockPlatformApis";

        public static get $inject(): string[] {
            return [
                "$q",
                "$ionicPopup",
                "$ionicLoading",
                Utilities.ID
            ];
        }

        constructor(
            private $q: ng.IQService,
            private $ionicPopup: any,
            private $ionicLoading: any,
            private Utilities: Utilities) {
        }

        //#endregion

        private _isProgressIndicatorShown: boolean = false;

        //#region Public API

        public getToastPlugin(): ICordovaToastPlugin {
            return {
                show: _.bind(this.toast, this),
                showLongBottom: _.bind(this.toast, this),
                showLongCenter: _.bind(this.toast, this),
                showLongTop: _.bind(this.toast, this),
                showShortBottom: _.bind(this.toast, this),
                showShortCenter: _.bind(this.toast, this),
                showShortTop: _.bind(this.toast, this)
            };
        }

        public getPushNotificationPlugin(): PushNotification {
            return {
                register: _.bind(this.pushNotification_register, this),
                unregister: _.bind(this.pushNotification_unregister, this),
                setApplicationIconBadgeNumber: _.bind(this.pushNotification_setApplicationIconBadgeNumber, this)
            };
        }

        public getClipboardPlugin(): ICordovaClipboardPlugin {
            return {
                copy: _.bind(this.clipboard_copy, this),
                paste: _.bind(this.clipboard_paste, this)
            };
        }

        public getClipboardPluginForChromeExtension(): ICordovaClipboardPlugin {
            return {
                copy: _.bind(this.clipboard_chromeExtension_copy, this),
                paste: _.bind(this.clipboard_chromeExtension_paste, this)
            };
        }

        public getNotificationPlugin(): Notification {
            return {
                alert: _.bind(this.notification_alert, this),
                confirm: _.bind(this.notification_confirm, this),
                prompt: _.bind(this.notification_prompt, this),
                beep: _.bind(this.notification_beep, this),
                vibrate: _.bind(this.notification_vibrate, this),
                vibrateWithPattern: _.bind(this.notification_vibrateWithPattern, this),
                cancelVibration: _.bind(this.notification_cancelVibration, this)
            };
        }

        public getProgressIndicatorPlugin(): ICordovaProgressIndicator {
            return {
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

        public getStatusBarPlugin(): StatusBar {
            return {
                overlaysWebView: _.bind(this.noOp, this),
                styleDefault: _.bind(this.noOp, this),
                styleLightContent: _.bind(this.noOp, this),
                styleBlackTranslucent: _.bind(this.noOp, this),
                styleBlackOpaque: _.bind(this.noOp, this),
                backgroundColorByName: _.bind(this.noOp, this),
                backgroundColorByHexString: _.bind(this.noOp, this),
                hide: _.bind(this.noOp, this),
                show: _.bind(this.noOp, this),
                isVisible: false
            };
        }

        public getKeyboardPlugin(): Ionic.Keyboard {
            return {
                hideKeyboardAccessoryBar: _.bind(this.noOp, this),
                close: _.bind(this.noOp, this),
                disableScroll: _.bind(this.noOp, this),
                isVisible: false
            };
        }

        public getCrashlyticsPlugin(): ICordovaCrashlyticsPlugin {
            return {
                logException: _.bind(this.crashlytics_logException, this),
                log: _.bind(this.crashlytics_log, this),
                setBool: _.bind(this.noOp, this),
                setDouble: _.bind(this.noOp, this),
                setFloat: _.bind(this.noOp, this),
                setInt: _.bind(this.noOp, this),
                setLong: _.bind(this.noOp, this),
                setString: _.bind(this.noOp, this),
                setUserEmail: _.bind(this.noOp, this),
                setUserIdentifier: _.bind(this.noOp, this),
                setUserName: _.bind(this.noOp, this),
                simulateCrash: _.bind(this.noOp, this)
            };
        }

        //#endregion

        //#region Misc

        private noOp(): void {
            // No Op!
        }

        //#endregion

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
            console.warn("window.pushNotification.register()", registrationOptions);

            setTimeout(() => {
                errorCallback(new Error("Not implemented in MockPlatformApis.ts"));
            }, 0);
        }

        private pushNotification_unregister(successCallback: (result: any) => void, errorCallback: (error: any) => void): void {
            console.warn("window.pushNotification.unregister()");

            setTimeout(() => {
                errorCallback(new Error("Not implemented in MockPlatformApis.ts"));
            }, 0);
        }

        private pushNotification_setApplicationIconBadgeNumber(successCallback: (result: any) => void, errorCallback: (error: any) => void, badgeCount: number): void {
            console.warn("window.pushNotification.setApplicationIconBadgeNumber()", badgeCount);

            setTimeout(() => {
                errorCallback(new Error("Not implemented in MockPlatformApis.ts"));
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

        private clipboard_chromeExtension_copy(text: string, onSuccess: () => void, onFail: (err: Error) => void): void {
            // The following is based on http://stackoverflow.com/a/12693636

            try {

                /* tslint:disable:no-string-literal */

                // First, subscribe to the oncopy event. Normally executing the copy command for
                // the current document will copy the currently selected text block. In this case
                // we use our handler to override this and use the text that was passed into this
                // method instead.
                document["oncopy"] = function(event) {
                    event.clipboardData.setData("Text", text);
                    event.preventDefault();
                };

                // Execute the copy command for the document, which will fire our oncopy handler.
                document.execCommand("Copy");

                // Finally, remove our copy handler.
                document["oncopy"] = undefined;

                /* tslint:enable:no-string-literal */

                _.defer(() => {
                    onSuccess();
                });
            }
            catch (error) {
                _.defer(() => {
                    onFail(error);
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

        private clipboard_chromeExtension_paste(onSuccess: (result: string) => void, onFail: (err: Error) => void): void {
            _.defer(() => {
                onFail(new Error("The paste operation is not currently implemented for Chrome extensions."));
            });
        }

        //#endregion

        //#region Notifications

        private notification_alert(message: string, alertCallback: () => void, title?: string, buttonName?: string): void {
            var buttons = [];

            // Default the title.
            title = title || "Alert";

            // Default the button label text.
            buttonName = buttonName || Constants.Buttons.OK;

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
            buttonLabels = buttonLabels || [Constants.Buttons.Yes, Constants.Buttons.No];

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
            buttonLabels = buttonLabels || [Constants.Buttons.OK, Constants.Buttons.Cancel];

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
                this._isProgressIndicatorShown = false;
            }, 1000);
        }

        private progressIndicator_show(dimBackground: boolean, labelOrTimeout: any, labelOrPosition: string) {
            var label: string,
                timeout: number;

            if (this._isProgressIndicatorShown) {
                return;
            }

            this._isProgressIndicatorShown = true;

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
                    this._isProgressIndicatorShown = false;
                    this.$ionicLoading.hide();
                }, timeout);
            }
        }

        //#endregion

        //#region Crashlytics

        private crashlytics_logException(exception: string): void {
            console.error(exception);
        }

        private crashlytics_log(message: string): void {
            console.warn(message);
        }

        //#endregion
    }
}
