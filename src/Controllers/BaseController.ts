module JustinCredible.SampleApp.Controllers {

    /**
     * This is the base controller that all other controllers should utilize.
     * 
     * It handles saving a reference to the Angular scope, newing up the given
     * model object type, and injecting the view model and controller onto the
     * scope object for use in views.
     * 
     * T - The parameter type for the model.
     */
    export class BaseController<T> {
        public scope: ng.IScope;
        public viewModel: T;

        constructor(scope: ng.IScope, ModelType: { new (): T; }) {
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

            /* tslint:enable:no-string-literal */

            // Subscribe to various events.
            this.scope.$on("$ionicView.loaded", _.bind(this.view_loaded, this));
            this.scope.$on("$ionicView.enter", _.bind(this.view_enter, this));
            this.scope.$on("$ionicView.leave", _.bind(this.view_leave, this));
            this.scope.$on("$ionicView.beforeEnter", _.bind(this.view_beforeEnter, this));
            this.scope.$on("$ionicView.beforeLeave", _.bind(this.view_beforeLeave, this));
            this.scope.$on("$ionicView.afterEnter", _.bind(this.view_afterEnter, this));
            this.scope.$on("$ionicView.afterLeave", _.bind(this.view_afterLeave, this));
            this.scope.$on("$ionicView.unloaded", _.bind(this.view_unloaded, this));
            this.scope.$on("$destroy", _.bind(this.destroy, this));

            // Now that everything else is done, we can initialize.
            // We defer here so that the initialize event occurs after the constructor
            // of the child class has had a chance to execute.
            _.defer(() => {
                this.initialize();
                this.scope.$apply();
            });
        }

        /**
         * Fired after the constructor has completed. Used to setup the controller.
         * 
         * Can be overridden by implementing controllers.
         */
        protected initialize(): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */
        }

        /**
         * Ionic's view event: $ionicView.loaded
         * 
         * Can be overridden by implementing controllers.
         */
        protected view_loaded(): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */
        }

        /**
         * Ionic's view event: $ionicView.enter
         * 
         * Can be overridden by implementing controllers.
         */
        protected view_enter(): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */
        }

        /**
         * Ionic's view event: $ionicView.leave
         * 
         * Can be overridden by implementing controllers.
         */
        protected view_leave(): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */
        }

        /**
         * Ionic's view event: $ionicView.beforeEnter
         * 
         * Can be overridden by implementing controllers.
         */
        protected view_beforeEnter(): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */
        }

        /**
         * Ionic's view event: $ionicView.beforeLeave
         * 
         * Can be overridden by implementing controllers.
         */
        protected view_beforeLeave(): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */
        }

        /**
         * Ionic's view event: $ionicView.afterEnter
         * 
         * Can be overridden by implementing controllers.
         */
        protected view_afterEnter(): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */
        }

        /**
         * Ionic's view event: $ionicView.afterLeave
         * 
         * Can be overridden by implementing controllers.
         */
        protected view_afterLeave(): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */
        }

        /**
         * Ionic's view event: $ionicView.unloaded
         * 
         * Can be overridden by implementing controllers.
         */
        protected view_unloaded(): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */
        }

        /**
         * Fired when this controller is destroyed. Can be used for clean-up etc.
         * 
         * Can be overridden by implementing controllers.
         */
        protected destroy(): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */
        }
    }
}
