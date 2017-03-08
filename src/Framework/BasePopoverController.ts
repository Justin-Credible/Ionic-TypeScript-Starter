namespace JustinCredible.SampleApp.Controllers {

    /**
     * This is the base controller that all popover-based controllers should utilize.
     * 
     * It handles saving a reference to the Angular scope, newing up the given
     * model object type, and injecting the view model and controller onto the
     * scope object for use in views.
     * 
     * T - The parameter type for the model.
     */
    export class BasePopoverController<T> {

        /**
         * The Ionic popover instance.
         */
        private _popoverInstance: any;

        /**
         * The Angular scope for this controller.
         * Set via the constuctor.
         */
        protected scope: ng.IScope;

        /**
         * The view model for this controller.
         * Initialized via the constructor.
         */
        protected viewModel: T;

        /**
         * A dictionary of element references populated by elements with the
         * bind-element directive. Used to get a reference to elements from
         * your controller instance.
         */
        public elements: Interfaces.Dictionary<ng.IAugmentedJQuery>;

        constructor(scope: ng.IScope, ModelType: { new (): T; }) {

            // Uncomment for debugging view events.
            //console.log("ctor()  " + this.constructor["ID"]);

            // Save a reference to Angular's scope object.
            this.scope = scope;

            // Create the view model.
            this.viewModel = new ModelType();

            /* tslint:disable:no-string-literal */

            // Push the view model onto the scope so it can be
            // referenced from the template/views.
            this.scope["viewModel"] = this.viewModel;

            // Push the controller onto the scope so it can be
            // used to reference events for controls etc.
            this.scope["controller"] = this;

            // Initialize to an empty dictionary.
            this.elements = {};

            /* tslint:enable:no-string-literal */

            // Subscribe to various events.
            this.scope.$on("popover.shown", _.bind(this.base_popover_shown, this));
            this.scope.$on("popover.hidden", _.bind(this.base_popover_hidden, this));
            this.scope.$on("popover.removed", _.bind(this.popover_removed, this));
            this.scope.$on("$destroy", _.bind(this.destroy, this));
        }

        /**
         * Ionic's view event: popover.shown
         * 
         * Can be overridden by implementing controllers.
         */
        protected base_popover_shown(event: ng.IAngularEvent, instance: any): void {

            // Uncomment for debugging view events.
            // console.log("popover.shown " + this.constructor["ID"]);

            /**
             * Only respond to popover.shown events for this popover.
             * If you are using more than one class of popover from the same
             * controller, then you'll need to set the controllerID on the 
             * popover options so we know which controller goes with which 
             * popover. This is done by using UiHelper.createPopover().
             */

            /* tslint:disable:no-string-literal */
            if (instance && instance.controllerID &&
                instance.controllerID !== this.constructor["ID"]) {
                return;
            }
            /* tslint:enable:no-string-literal */

            this._popoverInstance = instance;

            // Call our popover shown event which descendants can override.
            this.popover_shown(event, instance);

        }

        /**
         * Ionic's view event: popover.hidden
         * 
         * Can be overridden by implementing controllers.
         */
        protected base_popover_hidden(event: ng.IAngularEvent, instance: any): void {

            // Uncomment for debugging view events.
            // console.log("popover.hidden " + this.constructor["ID"]);

            // Only respond to popover.hidden events for this dialog.
            /* tslint:disable:no-string-literal */
            if (instance && instance.controllerID &&
                instance.controllerID !== this.constructor["ID"]) {
                return;
            }
            /* tslint:enable:no-string-literal */

            // Call our popover hidden event which descendants can override.
            this.popover_hidden(event, instance);
        }

        /**
         * Ionic's view event: popover.removed
         * 
         * Can be overridden by implementing controllers.
         */
        protected popover_removed(event: ng.IAngularEvent, instance: any): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */

            // Uncomment for debugging view events.
            // console.log("popover.removed " + this.constructor["ID"]);
        }

        /**
         * Fired when this controller is destroyed. Can be used for clean-up etc.
         * 
         * Can be overridden by implementing controllers.
         */
        protected destroy(): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */

            // Uncomment for debugging view events.
            // console.log("destroy " + this.constructor["ID"]);
        }

        /**
         * Used to hide the popover.
         */
        protected hide(): void {
            this._popoverInstance.hide();
        }

        /**
         * Called when the popover is hidden.
         * 
         * Can be overridden by implementing controllers.
         */
        protected popover_shown(event: ng.IAngularEvent, instance: any): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */
        }

        /**
         * Called when the popover is hidden.
         * 
         * Can be overridden by implementing controllers.
         */
        protected popover_hidden(event: ng.IAngularEvent, instance: any): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */
        }
    }
}
