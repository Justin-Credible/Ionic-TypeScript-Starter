
namespace JustinCredible.SampleApp.UnitTests.TestCases {

    export class InjectionTests extends TestFramework.BaseTestCase {

        protected $injector: ng.auto.IInjectorService;

        protected $rootScope: ng.IRootScopeService;

        protected $controller: ng.IControllerService;

        protected $compile: ng.ICompileService;

        protected Utilities: Services.Utilities;

        protected inject(): void {

            beforeEach(() => {
                inject((_$injector_, _$rootScope_, _$controller_, _$compile_, _Utilities_) => {
                    this.$injector = _$injector_;
                    this.$rootScope = _$rootScope_;
                    this.$controller = _$controller_;
                    this.$compile = _$compile_;
                    this.Utilities = _Utilities_;
                });
            });
        }

        public execute(): void {

            describe("injection", () => { this._test_injection(); });
        }

        private _test_injection(): void {

            // Create a lookup dictionary of all services from the services and controller namespaces.
            let Services: Interfaces.Dictionary<any> = {};

            // tslint:disable-next-line:no-string-literal
            Services["Application"] = Application;

            for (let serviceID of _.keys(JustinCredible.SampleApp.Services)) {
                Services[serviceID] = JustinCredible.SampleApp.Services[serviceID];
            }

            for (let serviceID of _.keys(JustinCredible.SampleApp.Controllers)) {
                Services[serviceID] = JustinCredible.SampleApp.Controllers[serviceID];
            }

            for (let serviceID of _.keys(JustinCredible.SampleApp.Directives)) {
                Services[serviceID] = JustinCredible.SampleApp.Directives[serviceID];
            }

            for (let Service of <any>_.values(Services)) {

                // A static ID property is required to register a service; see BootHelper.registerServices().
                if (!Service.ID) {
                    continue;
                }

                // Uncomment this and change the ID if you only want to test a single service.
                // if (Service.ID !== Controllers.DevLogsListController.ID) {
                //     continue;
                // }

                // Grab the static array of service ID annotations.
                let $inject: string[] = Service.$inject;

                // If there are no annotations, then nothing will be injected, so there is nothing to test.
                if (!$inject || $inject.length === 0) {
                    continue;
                }

                it(`for '${Service.ID}' should not fail.`, () => {

                    // The static ID property is used for injection and is normally exactly the same
                    // as the service class name. However, for directives they are different. See below.
                    let injectID: string = Service.ID;
                    let classID: string = Service.ID;

                    let isController = !!JustinCredible.SampleApp.Controllers[classID];

                    // Attempt to detect if this is a directive.
                    // Assume it is a directive if it has camel-case naming (ie starts with a lowercase character).
                    // By convention, all other injectables start with uppercase in our codebase, EXCEPT directives.
                    let isDirective = injectID.substr(0, 1).toUpperCase() !== injectID.substr(0, 1);

                    let serviceInstance = null;

                    // Delegate to the injector to get an instance of this service.
                    if (isController) {
                        let $scope = this.$rootScope.$new();

                        serviceInstance = this.$controller(injectID, {
                            $scope: $scope,
                        });
                    }
                    else if (isDirective) {

                        // TODO: Remove this return and uncomment below to enable testing directives.
                        // This still needs some work.
                        return;

                        /*
                        classID = injectID.substr(0, 1).toUpperCase() + injectID.substr(1);

                        // Morph to kebab case, which is what Angular expects in the markup.
                        // https://gist.github.com/youssman/745578062609e8acac9f#gistcomment-2004810
                        let directiveName = injectID.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);

                        // Build a single element with the name of the directive.
                        let html = `<${directiveName}></${directiveName}>`;

                        // Compile the HTML so the directive will be linked and instantiated.
                        // https://docs.angularjs.org/guide/unit-testing#testing-directives
                        let $scope = this.$rootScope.$new();
                        let factory = this.$compile(html);
                        let element = factory($scope);
                        $scope.$digest();

                        // Grab the directive instance from the scope.
                        serviceInstance = $scope.$$childTail.directive;
                        */
                    }
                    else {
                        serviceInstance = this.$injector.get(injectID);
                    }

                    // Sanity check.
                    let gotServiceInstance = serviceInstance != null;
                    expect(gotServiceInstance).toBeTruthy();

                    let ServiceClassReference = Services[classID];
                    let ServiceMockClassReference = Mocks[classID];

                    // If this service is mocked for the unit tests, then there is no reason to test it because it
                    // may or may not have anything injected into it (it could be just a sparse interface).
                    if (ServiceMockClassReference != null && serviceInstance instanceof ServiceMockClassReference) {
                        return;
                    }

                    // Ensure the number of constructor parameters exactly matches the number of injected parameter IDs.
                    expect(ServiceClassReference.length).toEqual($inject.length);

                    // Loop over each of the service IDs that should be injected into this service.
                    for (let serviceID of $inject) {

                        // Angular blows up if you try to request the $scope service. Probably rightly so.
                        // So just skip verifying this one.
                        if ((isController || isDirective) && serviceID === "$scope") {
                            continue;
                        }

                        // Delegate to the injector to get an instance.
                        let instance = this.$injector.get(serviceID);

                        let gotInjectedInstance = instance != null;
                        expect(gotInjectedInstance).toBeTruthy();

                        // For all non-Angular services...
                        if (!this.Utilities.startsWith(serviceID, "$")) {

                            // Attempt to get the class reference.
                            let ClassReference = Services[serviceID];
                            let MockClassReference = Mocks[serviceID];

                            // Check to see if this is a class that can be instantiated.
                            // (Some params are just simple boolean or string values).
                            let isConstructorFunction = typeof(ClassReference) === "function" || typeof(MockClassReference) === "function";

                            if (isConstructorFunction) {

                                let isInstanceOfClass = false;

                                // Determine if the injected instance is actually an instance of the class reference.
                                if (ClassReference != null && instance instanceof ClassReference) {
                                    isInstanceOfClass = true;
                                }
                                else if (MockClassReference != null && instance instanceof MockClassReference) {
                                    isInstanceOfClass = true;
                                }

                                // Sanity check.
                                expect(isInstanceOfClass).toBeTruthy();
                            }
                        }

                        // Grab the instance that was injected into the service.
                        let injectedInstance = serviceInstance[serviceID];

                        // They should be the same instance!
                        let instancesAreEqual = injectedInstance === instance;
                        expect(instancesAreEqual).toBeTruthy();
                    }
                });
            }
        }
    }
}
