namespace JustinCredible.SampleApp.Directives {

    /**
     * Describes what our element directive objects look like.
     */
    export interface IElementDirective {
        initialize();
        render();
    }

    /**
     * This is the base directive that all other directives for elements should utilize.
     * 
     * It handles saving references to the various objects in its constructor.
     * 
     * T - The parameter type for the scope.
     */
    export abstract class BaseElementDirective<T extends ng.IScope> implements IElementDirective {

        /**
         * A flag that can be used to identify element directives that use this
         * class as their base class.
         */
        public static __BaseElementDirective = true;

        // These properties can be set as public static properties on the extending class.
        public static restrict = "E";
        public static template: string;
        public static templateUrl: string;
        public static replace = true;
        public static transclude: ng.ITranscludeFunction;
        public static scope: any;

        protected scope: T;
        protected element: ng.IAugmentedJQuery;
        protected attributes: ng.IAttributes;
        protected controller: any;
        protected transclude: ng.ITranscludeFunction;

        public abstract initialize();

        public abstract render();
    }
}
