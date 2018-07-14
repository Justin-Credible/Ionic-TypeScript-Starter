
namespace JustinCredible.SampleApp.UnitTests.TestFramework {

    /**
     * All base class for all test cases.
     */
    export abstract class BaseTestCase {

        /**
         * Controls if this base test case should automatically mock the Logger
         * service and make all of its methods perform no-ops.
         */
        protected get LoggerNoOp(): boolean {
            return true;
        }

        public initialize(): void {
            this.mock();
            this.inject();
        }

        protected mock(): void {
            beforeEach(module("JustinCredible.SampleApp.Application", "ngMock"));

            if (this.LoggerNoOp) {
                beforeEach(module({
                    "Logger": new Mocks.Logger(),
                }));
            }
        }

        protected abstract inject(): void;

        public abstract execute(): void;
    }
}
