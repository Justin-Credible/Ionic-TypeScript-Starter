module JustinCredible.SampleApp.Directives {

    /**
     * Describes what our element directive objects look like.
     */
    export interface IElementDirective {
        initialize();
        render();
    }

    /**
     * Describes the constructor for the an class implementing IElementDirective.
     */
    export interface IElementDirectiveClass {
        new (scope: ng.IScope, instanceElement: ng.IAugmentedJQuery, instanceAttributes: ng.IAttributes, controller: any, transclude: ng.ITranscludeFunction);
    }

    /**
     * This is the base directive that all other directives for elements should utilize.
     * 
     * It handles saving references to the various objects in its constructor.
     * 
     * T - The parameter type for the scope.
     */
    export class BaseElementDirective<T extends ng.IScope> implements IElementDirective {

        public scope: T;
        public element: ng.IAugmentedJQuery;
        public attributes: ng.IAttributes;
        public controller: any;
        public transclude: ng.ITranscludeFunction;

        constructor(scope: T, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: any, transclude: ng.ITranscludeFunction) {

            this.scope = scope;
            this.element = element;
            this.attributes = attributes;
            this.controller = controller;
            this.transclude = transclude;

            this.initialize();
        }

        public initialize() {
            throw new Error("Directives that extend BaseElementDirective should implement their own initialize method.");
        }

        public render() {
            throw new Error("Directives that extend BaseElementDirective should implement their own render method.");
        }
    }
}
