module JustinCredible.SampleApp.Directives {

    /**
     * A directive for handling an element's onload event (eg an image tag).
     * 
     * http://stackoverflow.com/questions/11868393/angularjs-inputtext-ngchange-fires-while-the-value-is-changing
     */
    export class OnLoadDirective implements ng.IDirective {

        //#region Injection

        public static ID = "onLoad";

        public static get $inject(): string[] {
            return ["$parse"];
        }

        constructor(
            private $parse: ng.IParseService) {

            // Ensure that the link function is bound to this instance so we can
            // access instance variables like $parse. AngularJs normally executes
            // the link function in the context of the global scope.
            this.link = _.bind(this.link, this);
        }

        //#endregion

        public restrict = "A";

        public link(scope: ng.IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: any, transclude: ng.ITranscludeFunction): void {

            // Parse the value of the on-load property; this will be a function
            // that the user has set on the element for example: <img on-load="load()"/>
            /* tslint:disable:no-string-literal */
            var fn = this.$parse(attributes["onLoad"]);
            /* tslint:enable:no-string-literal */

            // Subscribe to the load event of the image element.
            element.on("load", (event) => {
                // When the load event occurs, execute the user defined load function.
                scope.$apply(() => {
                    fn(scope, { $event: event });
                });
            });
        }
    }
}
