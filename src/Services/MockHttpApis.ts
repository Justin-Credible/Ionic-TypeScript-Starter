module JustinCredible.SampleApp.Services {

    /**
     * Provides mock responses for HTTP requests.
     * 
     * This can be useful for unit testing or demoing or developing applications
     * without a live internet connection or access to the HTTP APIs.
     */
    export class MockHttpApis {

        //#region Injection

        public static ID = "MockHttpApis";

        public static get $inject(): string[] {
            return [
                "$httpBackend"
            ];
        }

        constructor(
            private $httpBackend: ng.IHttpBackendService) {
        }

        //#endregion

        //#region Public API

        /**
         * Used to setup a random delay time for mock HTTP requests.
         * 
         * @param $provide The provider service which will be used to obtain and decorate the httpBackend service.
         */
        public static setupMockHttpDelay($provide: ng.auto.IProvideService) {
            var maxDelay = 3000,
                minDelay = 1000;

            // Example taken from the following blog post:
            // http://endlessindirection.wordpress.com/2013/05/18/angularjs-delay-response-from-httpbackend/
            $provide.decorator("$httpBackend", function ($delegate) {
                var proxy = function (method, url, data, callback, headers) {
                    var interceptor = function () {
                        var _this = this,
                            _arguments = arguments,
                            delay: number;

                        if (url.indexOf(".html") > -1) {
                            // Don't apply a delay for templates.
                            callback.apply(_this, _arguments);
                        }
                        else {
                            // http://jsfiddle.net/alanwsmith/GfAhy/
                            delay = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);

                            setTimeout(function () {
                                callback.apply(_this, _arguments);
                            }, delay);
                        }
                    };
                    return $delegate.call(this, method, url, data, interceptor, headers);
                };

                /* tslint:disable:forin */
                for (var key in $delegate) {
                    proxy[key] = $delegate[key];
                }
                /* tslint:enable:forin */

                return proxy;
            });
        }

        /**
         * Used to mock the responses for the $http service. Useful when debugging
         * or demo scenarios when a backend is not available.
         * 
         * This can only be called once per page (ie on page load). Subsequent calls
         * will not remove existing mock rules.
         * 
         * @param mock True to mock API calls, false to let them pass through normally.
         */
        public mockHttpCalls(mock: boolean) {

            // Always allow all requests for templates to go through.
            this.$httpBackend.whenGET(/.*\.html/).passThrough();

            if (mock) {
                // Mock up all the API requests.
                //this.$httpBackend.whenGET(/someUrl/).respond(200, this.getMockTokenGetResponse());
            }
            else {
                // Allow ALL HTTP requests to go through.
                this.$httpBackend.whenDELETE(/.*/).passThrough();
                this.$httpBackend.whenGET(/.*/).passThrough();
                //this.$httpBackend.whenHEAD(/.*/).passThrough(); //TODO The ts.d includes whenHEAD but this version of Angular doesn't?
                this.$httpBackend.whenJSONP(/.*/).passThrough();
                this.$httpBackend.whenPATCH(/.*/).passThrough();
                this.$httpBackend.whenPOST(/.*/).passThrough();
                this.$httpBackend.whenPUT(/.*/).passThrough();
            }
        }

        //#endregion

        //#region

        /*
        private getMockTokenGetResponse(): any {
            // Return the response object for your mocked up API request.
            return {
                "Data": "blah";
            };
        }
        */

        //#endregion
    }
}
