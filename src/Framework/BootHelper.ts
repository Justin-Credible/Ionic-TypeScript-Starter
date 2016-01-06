/**
 * This is a helper for the second level boot loader.
 */
namespace JustinCredible.SampleApp.BootHelper {

    //#region Registration Helpers

    /**
     * Used construct an instance of an object using the new operator with the given constructor
     * function and arguments.
     * 
     * http://stackoverflow.com/a/1608546/4005811
     * 
     * @param constructor The constructor function to invoke with the new keyword.
     * @param args The arguments to be passed into the constructor function.
     */
    export function construct(constructor, args) {
        function F(): void {
            return constructor.apply(this, args);
        };
        F.prototype = constructor.prototype;
        return new F();
    }

    /**
     * Used to register each of the services that exist in the Service namespace
     * with the given Angular module.
     * 
     * @params ngModule The root Angular module to use for registration.
     */
    export function registerServices(ngModule: ng.IModule): void {
        // Register each of the services that exist in the Service namespace.
        _.each(Services, (Service: any) => {
            // A static ID property is required to register a service.
            if (Service.ID) {
                if (typeof(Service.getFactory) === "function") {
                    // If a static method named getFactory() is available we'll invoke it
                    // to get a factory function to register as a factory.
                    console.log("Registering factory " + Service.ID + "...");
                    ngModule.factory(Service.ID, Service.getFactory());
                }
                else {
                    console.log("Registering service " + Service.ID + "...");
                    ngModule.service(Service.ID, Service);
                }
            }
        });
    }

    /**
     * Used to register each of the directives that exist in the Directives namespace
     * with the given Angular module.
     * 
     * @params ngModule The root Angular module to use for registration.
     */
    export function registerDirectives(ngModule: ng.IModule): void {

        _.each(Directives, (Directive: any) => {
            if (Directive.ID) {
                if (Directive.__BaseElementDirective) {
                    console.log("Registering element directive " + Directive.ID + "...");
                    ngModule.directive(Directive.ID, getElementDirectiveFactoryFunction(Directive));
                }
                else {
                    ngModule.directive(Directive.ID, getDirectiveFactoryParameters(Directive));
                }
            }
        });
    }

    /**
     * Used to register each of the filters that exist in the Filters namespace
     * with the given Angular module.
     * 
     * @params ngModule The root Angular module to use for registration.
     */
    export function registerFilters(ngModule: ng.IModule): void {

        _.each(Filters, (Filter: any) => {
            if (Filter.ID && typeof(Filter.filter) === "function") {
                console.log("Registering filter " + Filter.ID + "...");
                ngModule.filter(Filter.ID, getFilterFactoryFunction(Filter.filter));
            }
        });
    }

    /**
     * Used to register each of the controllers that exist in the Controller namespace
     * with the given Angular module.
     * 
     * @params ngModule The root Angular module to use for registration.
     */
    export function registerControllers(ngModule: ng.IModule): void {

        // Register each of the controllers that exist in the Controllers namespace.
        _.each(Controllers, (Controller: any) => {
            if (Controller.ID) {
                console.log("Registering controller " + Controller.ID + "...");
                ngModule.controller(Controller.ID, Controller);
            }
        });
    }

    /**
     * Used to create a function that returns a data structure describing an Angular directive
     * for an element from one of our own classes implementing IElementDirective. It handles
     * creating an instance and invoked the render method when linking is invoked.
     * 
     * @param Directive A class reference (not instance) to a element directive class that implements Directives.IElementDirective.
     * @returns A factory function that can be used by Angular to create an instance of the element directive.
     */
    export function getElementDirectiveFactoryFunction(Directive: Directives.IElementDirectiveClass): any[] {
        var params = [],
            injectedArguments: IArguments = null,
            descriptor: ng.IDirective = {};

        /* tslint:disable:no-string-literal */

        // If the directive is annotated with an injection array, we'll add the injection
        // array's values to the list first.
        if (Directive["$inject"]) {
            params = params.concat(Directive["$inject"]);
        }

        // Here we set the options for the Angular directive descriptor object.
        // We get these values from the static fields on the class reference.
        descriptor.restrict = Directive["restrict"];
        descriptor.template = Directive["template"];
        descriptor.replace = Directive["replace"];
        descriptor.transclude = Directive["transclude"];
        descriptor.scope = Directive["scope"];

        /* tslint:enable:no-string-literal */

        if (descriptor.restrict !== "E") {
            console.warn("BaseElementDirectives are meant to restrict only to element types.");
        }

        // Here we define the link function that Angular invokes when it is linking the
        // directive to the element.
        descriptor.link = (scope: ng.IScope, instanceElement: ng.IAugmentedJQuery, instanceAttributes: ng.IAttributes, controller: any, transclude: ng.ITranscludeFunction): void => {

            // New up an instance of the directive for to link to this element.
            // Pass along the arguments that were injected so the instance can receive them.
            var instance = <Directives.BaseElementDirective<any>>construct(Directive, injectedArguments);

            /* tslint:disable:no-string-literal */

            // Set the protected properties.
            instance["scope"] = scope;
            instance["element"] = instanceElement;
            instance["attributes"] = instanceAttributes;
            instance["controller"] = controller;
            instance["transclude"] = transclude;

            /* tslint:enable:no-string-literal */

            // Delegate to the initialize and render methods.
            instance.initialize();
            instance.render();
        };

        // The last parameter in the array is the function that will be executed by Angular
        // when the directive is being used.
        params.push(function () {

            // Save off a reference to the array of injected objects so we can use them when
            // constructing an instance of the directive (see above). These arguments are the
            // objects that were injected via the $inject property.
            injectedArguments = arguments;

            // Return the descriptor object which describes the directive to Angular.
            return descriptor;
        });

        return params;
    }

    /**
     * Used to create an array of injection property names followed by a function that will be
     * used by Angular to create an instance of the given directive.
     * 
     * @param Directive A class reference (not instance) to a directive class.
     * @returns An array of injection property names followed by a factory function for use by Angular.
     */
    export function getDirectiveFactoryParameters(Directive: ng.IDirective): any[] {

        var params = [];

        /* tslint:disable:no-string-literal */

        // If the directive is annotated with an injection array, we'll add the injection
        // array's values to the list first.
        if (Directive["$inject"]) {
            params = params.concat(Directive["$inject"]);
        }

        /* tslint:enable:no-string-literal */

        // The last parameter in the array is the function that will be executed by Angular
        // when the directive is being used.
        params.push(function () {
            // Create a new instance of the directive, passing along the arguments (which
            // will be the values injected via the $inject annotation).
            return construct(Directive, arguments);
        });

        return params;
    }

    /**
     * Used to create a function that returns a function for use by a filter.
     * 
     * @param fn The function that will provide the filter's logic.
     */
    export function getFilterFactoryFunction(fn: Function): () => Function {
        return function () { return fn; };
    }
}
