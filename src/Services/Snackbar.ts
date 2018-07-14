namespace JustinCredible.SampleApp.Services {

    /**
     * The severity level of the snackbar which controls the color and icon.
     */
    export enum SnackbarLevel {
        Info,
        Success,
        Error,
    }

    /**
     * The location the snackbar should be shown.
     */
    export enum SnackbarLocation {
        Bottom,
        Top,
    }

    /**
     * The options used to configure the snackbar.
     */
    export class SnackbarOptions {

        constructor(message?: string, title?: string, level?: SnackbarLevel, location?: SnackbarLocation, actionText?: string, autoClose?: boolean) {
            this.message = message;
            this.title = title;
            this.level = level == null ? SnackbarLevel.Info : level;
            this.location = location == null ? SnackbarLocation.Bottom : location;
            this.actionText = actionText;
            this.autoClose = location == null ? true : autoClose;
        }

        /**
         * The message text to be displayed on the snackbar.
         * 
         * If one is not present, a snackbar will not be shown.
         */
        public message: string;

        /**
         * An optional title that will appear above the message.
         */
        public title: string;

        /**
         * The severity level which controls the color and icon the snackbar element.
         * 
         * Defaults to Info.
         */
        public level: SnackbarLevel;

        /**
         * The location the snackbar should be shown.
         * 
         * Defaults to Top.
         */
        public location: SnackbarLocation;

        /**
         * The text for the action button displayed on the right of the snackbar.
         * 
         * If this is set, it indicates the user can tap the snackbar to take a
         * specific action.
         * 
         * If not set, an X icon will be displayed instead, which indicates that
         * tapping the message will dismiss it with no further action.
         */
        public actionText: string;

        /**
         * If true, the notification will be automatically dismissed after five seconds.
         * 
         * Defaults to true.
         */
        public autoClose: boolean;
    }

    /**
     * Internal container class to hold the options object as well as the actual
     * HTML element of the snackbar.
     */
    class SnackbarInstance {

        constructor(private $q: ng.IQService,
                    private $timeout: ng.ITimeoutService,
                    public options: SnackbarOptions,
                    private element: HTMLDivElement) {

            // This is the promise that will be resolved during dismissal.
            this._deferral = this.$q.defer<boolean>();
            this.promise = this._deferral.promise;

            // Wire up a click event listener so we can dismiss the snackbar.
            element.addEventListener("click", (event: MouseEvent) => {
                this.snackbar_click(event);
            });
        }

        private _deferral: ng.IDeferred<boolean>;
        public promise: ng.IPromise<boolean>;

        private _autoDismissalTimer: ng.IPromise<any>;

        public show(): void {

            // Setup a timer that will automatically dismiss the snackbar after 5 seconds.
            if (this.options.autoClose) {
                this._autoDismissalTimer = this.$timeout(() => {
                    this.dismiss(false);
                }, 5000);
            }

            document.body.appendChild(this.element);

            // Force a reflow so that the element we just appended will animate.
            // http://stackoverflow.com/a/24195559

            // tslint:disable-next-line:no-unused-expression
            getComputedStyle(this.element).top;

            // tslint:disable-next-line:no-unused-expression
            getComputedStyle(this.element).bottom;

            // The CSS transition will take care of the animation.
            this.element.classList.remove("animation-state-start");
            this.element.classList.add("animation-state-display");
        }

        private dismiss(dismissedByUser: boolean): void {

            // Ensure the timer is cancelled.
            this.$timeout.cancel(this._autoDismissalTimer);

            // Set a class to animate the snackbar to the hidden state.
            // The CSS transition will take care of the animation.
            this.element.classList.remove("animation-state-display");
            this.element.classList.add("animation-state-hide");

            // Resolve the promise so the caller knows the snackbar has been dismissed.
            // The flag indicates if the dismissal was triggered by the user or not.
            this._deferral.resolve(dismissedByUser);
        }

        private snackbar_click(event: MouseEvent): void {
            this.dismiss(true);
        }
    }

    /**
     * Service for showing "snackbar"-like user notifications.
     * 
     * Similar to: https://material.io/guidelines/components/snackbars-toasts.html#snackbars-toasts-usage
     * Inspired by: http://codepen.io/wibblymat/pen/avAjq
     */
    export class Snackbar {

        //#region Injection

        public static ID = "Snackbar";

        public static get $inject(): string[] {
            return [
                "$timeout",
                "$q",
            ];
        }

        constructor(
            private $timeout: ng.ITimeoutService,
            private $q: ng.IQService,
            ) {
        }

        //#endregion

        private _queue: SnackbarInstance[] = [];

        //#region Public Methods

        /**
         * Shows an informational snackbar message.
         */
        public info(message: string, title?: string): ng.IPromise<boolean> {
            let options = new SnackbarOptions(message, title, SnackbarLevel.Info);
            return this.show(options);
        }

        /**
         * Shows a success snackbar message.
         */
        public success(message: string, title?: string): ng.IPromise<boolean> {
            let options = new SnackbarOptions(message, title, SnackbarLevel.Success);
            return this.show(options);
        }

        /**
         * Shows an error snackbar message.
         */
        public error(message: string, title?: string): ng.IPromise<boolean> {
            let options = new SnackbarOptions(message, title, SnackbarLevel.Error);
            return this.show(options);
        }

        /**
         * Used to show a snackbar message with the given options.
         */
        public show(options: SnackbarOptions): ng.IPromise<boolean> {

            if (!options || !options.message) {
                return;
            }

            // Acts as a "debounce" for showing messages; prevents multiple messages with
            // the same title and message from being added to the queue.
            for (let instance of this._queue) {

                if (instance.options.title === options.title
                        && instance.options.message === options.message) {

                    let deferral = this.$q.defer<boolean>();

                    deferral.reject(new Error("Another snackbar with the same title and message was already in the queue."));

                    return deferral.promise;
                }
            }

            let instance = this.buildSnackbar(options);
            this.showNext(instance);

            return instance.promise;
        }

        //#endregion

        //#region Private Methods

        private buildSnackbar(options: SnackbarOptions): SnackbarInstance {

            // Build the snackbar container element.
            let element = document.createElement("div");
            element.classList.add("snackbar");
            element.classList.add("animation-state-start");

            let iconElement = document.createElement("i");
            iconElement.classList.add("icon");
            element.appendChild(iconElement);

            // Set an additional CSS class based on the level.
            // This controls the color and icon.
            switch (options.level) {
                case SnackbarLevel.Error:
                    element.classList.add("error");
                    iconElement.classList.add("ion-android-warning");
                    break;
                case SnackbarLevel.Success:
                    element.classList.add("success");
                    iconElement.classList.add("ion-android-checkmark-circle");
                    break;
                case SnackbarLevel.Info:
                    element.classList.add("info");
                    iconElement.classList.add("ion-information-circled");
                    break;
                default:
                    element.classList.add("info");
                    iconElement.classList.add("ion-information-circled");
                    break;
            }

            switch (options.location) {
                case SnackbarLocation.Top:
                    element.classList.add("top");
                    break;
                case SnackbarLocation.Bottom:
                    element.classList.add("bottom");
                    break;
                default:
                    element.classList.add("bottom");
                    break;
            }

            // Create an instance wrapper for the element and queue it up to be shown.
            let instance = new SnackbarInstance(this.$q, this.$timeout, options, element);

            // Listen for the CSS transition end event. Once the opacity hits zero (snackbar has faded out
            // via the animation-state-hide class) then we'll remove the element from the DOM and then delegate
            // to show the next one (if any).
            element.addEventListener("transitionend", (event: TransitionEvent) => {

                if (event.propertyName !== "opacity") {
                    return;
                }

                let currentOpacity = getComputedStyle(element).opacity;

                if (currentOpacity === "0") {

                    element.parentElement.removeChild(element);

                    _.remove(this._queue, instance);
                    this.showNext();
                }
            });

            // Build the text node that will hold the message.
            let contentElement = document.createElement("div");
            contentElement.classList.add("content");
            element.appendChild(contentElement);

            if (options.title) {
                let titleElement = document.createElement("div");
                titleElement.classList.add("title");
                titleElement.textContent = options.title;
                contentElement.appendChild(titleElement);
            }

            let messageElement = document.createElement("div");
            messageElement.classList.add("message");
            messageElement.textContent = options.message;
            contentElement.appendChild(messageElement);

            // Build the button that will hold the text or close icon.
            let actionButton = document.createElement("button");
            element.appendChild(actionButton);

            if (options.actionText) {
                actionButton.innerText = options.actionText;
            }
            else {
                actionButton.innerHTML = "<i class='icon ion-close'></i>";
            }

            return instance;
        }

        /**
         * Used to show the next snackbar instance in the queue as well as simultaneously
         * add the given instance to the queue.
         */
        private showNext(instance?: SnackbarInstance): void {

            // If an instance wasn't provided and there aren't any more on the queue
            // then there is nothing more to do.
            if (!instance && this._queue.length === 0) {
                return;
            }

            // If an instance was provided, but there are already instances on the queue
            // to be shown first, queue this one up so it can be shown later.
            if (instance && this._queue.length > 0) {
                this._queue.push(instance);
                return;
            }

            // If an instance was provided, and there isn't one being shown currently, then
            // queue it up and let it be shown below.
            if (instance && this._queue.length === 0) {
                this._queue.push(instance);
            }

            // If an instance wasn't provided, but there are still some left on the queue
            // then grab the next one so we can show it below.
            if (!instance && this._queue.length > 0) {
                instance = _.first(this._queue);
            }

            instance.show();
        }

        //#endregion
    }
}
