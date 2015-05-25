module JustinCredible.SampleApp.Directives {

    /**
     * Describes what our directive objects look like.
     */
    export interface IDirective {
        initialize();
        render();
    }

    /**
     * Describes the constructor for the an class implementing IDirective.
     */
    export interface IDirectiveClass {
        new (scope: ng.IScope, instanceElement: ng.IAugmentedJQuery, instanceAttributes: ng.IAttributes, controller: any, transclude: ng.ITranscludeFunction);
    }

    /**
     * This is the base directive that all other directives should utilize.
     * 
     * It handles saving references to the various objects in its constructor.
     * 
     * T - The parameter type for the scope.
     */
    export class BaseDirective<T extends ng.IScope> implements IDirective {

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
            throw new Error("Directives that extend BaseDirective should implement their own initialize method.");
        }

        public render() {
            throw new Error("Directives that extend BaseDirective should implement their own render method.");
        }
    }
}
