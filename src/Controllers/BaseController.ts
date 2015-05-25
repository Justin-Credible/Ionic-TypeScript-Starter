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

            /*tslint:disable no-string-literal*/

            // Push the view model onto the scope so it can be
            // referenced from the template/views.
            this.scope["viewModel"] = this.viewModel;

            // Push the controller onto the scope so it can be
            // used to reference events for controls etc.
            this.scope["controller"] = this;

            /*tslint:enable no-string-literal*/

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
        public initialize(): void {
            // No logic should be placed here, since TypeScript 1.0 does not currently support
            // protected members, so descendants may not be delegating to this method.
        }

        /**
         * Ionic's view event: $ionicView.loaded
         * 
         * Can be overridden by implementing controllers.
         */
        public view_loaded(): void {
            // No logic should be placed here, since TypeScript 1.0 does not currently support
            // protected members, so descendants may not be delegating to this method.
        }

        /**
         * Ionic's view event: $ionicView.enter
         * 
         * Can be overridden by implementing controllers.
         */
        public view_enter(): void {
            // No logic should be placed here, since TypeScript 1.0 does not currently support
            // protected members, so descendants may not be delegating to this method.
        }

        /**
         * Ionic's view event: $ionicView.leave
         * 
         * Can be overridden by implementing controllers.
         */
        public view_leave(): void {
            // No logic should be placed here, since TypeScript 1.0 does not currently support
            // protected members, so descendants may not be delegating to this method.
        }

        /**
         * Ionic's view event: $ionicView.beforeEnter
         * 
         * Can be overridden by implementing controllers.
         */
        public view_beforeEnter(): void {
            // No logic should be placed here, since TypeScript 1.0 does not currently support
            // protected members, so descendants may not be delegating to this method.
        }

        /**
         * Ionic's view event: $ionicView.beforeLeave
         * 
         * Can be overridden by implementing controllers.
         */
        public view_beforeLeave(): void {
            // No logic should be placed here, since TypeScript 1.0 does not currently support
            // protected members, so descendants may not be delegating to this method.
        }

        /**
         * Ionic's view event: $ionicView.afterEnter
         * 
         * Can be overridden by implementing controllers.
         */
        public view_afterEnter(): void {
            // No logic should be placed here, since TypeScript 1.0 does not currently support
            // protected members, so descendants may not be delegating to this method.
        }

        /**
         * Ionic's view event: $ionicView.afterLeave
         * 
         * Can be overridden by implementing controllers.
         */
        public view_afterLeave(): void {
            // No logic should be placed here, since TypeScript 1.0 does not currently support
            // protected members, so descendants may not be delegating to this method.
        }

        /**
         * Ionic's view event: $ionicView.unloaded
         * 
         * Can be overridden by implementing controllers.
         */
        public view_unloaded(): void {
            // No logic should be placed here, since TypeScript 1.0 does not currently support
            // protected members, so descendants may not be delegating to this method.
        }

        /**
         * Fired when this controller is destroyed. Can be used for clean-up etc.
         * 
         * Can be overridden by implementing controllers.
         */
        public destroy(): void {
            // No logic should be placed here, since TypeScript 1.0 does not currently support
            // protected members, so descendants may not be delegating to this method.
        }
    }
}
