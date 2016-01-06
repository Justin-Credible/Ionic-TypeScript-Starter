namespace JustinCredible.SampleApp.Controllers {

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
        }

        /**
         * Ionic's view event: $ionicView.loaded
         * 
         * Can be overridden by implementing controllers.
         */
        protected view_loaded(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */

            // Uncomment for debugging view events.
            // console.log("view_loaded " + this.constructor["ID"]);
        }

        /**
         * Ionic's view event: $ionicView.enter
         * 
         * Can be overridden by implementing controllers.
         */
        protected view_enter(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */

            // Uncomment for debugging view events.
            // console.log("view_enter " + this.constructor["ID"]);
        }

        /**
         * Ionic's view event: $ionicView.leave
         * 
         * Can be overridden by implementing controllers.
         */
        protected view_leave(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */

            // Uncomment for debugging view events.
            // console.log("view_leave " + this.constructor["ID"]);
        }

        /**
         * Ionic's view event: $ionicView.beforeEnter
         * 
         * Can be overridden by implementing controllers.
         */
        protected view_beforeEnter(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */

            // Uncomment for debugging view events.
            // console.log("view_beforeEnter " + this.constructor["ID"]);
        }

        /**
         * Ionic's view event: $ionicView.beforeLeave
         * 
         * Can be overridden by implementing controllers.
         */
        protected view_beforeLeave(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */

            // Uncomment for debugging view events.
            // console.log("view_beforeLeave " + this.constructor["ID"]);
        }

        /**
         * Ionic's view event: $ionicView.afterEnter
         * 
         * Can be overridden by implementing controllers.
         */
        protected view_afterEnter(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */

            // Uncomment for debugging view events.
            // console.log("view_afterEnter " + this.constructor["ID"]);
        }

        /**
         * Ionic's view event: $ionicView.afterLeave
         * 
         * Can be overridden by implementing controllers.
         */
        protected view_afterLeave(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */

            // Uncomment for debugging view events.
            // console.log("view_afterLeave " + this.constructor["ID"]);
        }

        /**
         * Ionic's view event: $ionicView.unloaded
         * 
         * Can be overridden by implementing controllers.
         */
        protected view_unloaded(event?: ng.IAngularEvent, eventArgs?: Ionic.IViewEventArguments): void {
            /* tslint:disable:no-empty */
            /* tslint:enable:no-empty */

            // Uncomment for debugging view events.
            // console.log("view_unloaded " + this.constructor["ID"]);
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
    }
}
