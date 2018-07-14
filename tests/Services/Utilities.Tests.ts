
namespace JustinCredible.SampleApp.UnitTests.TestCases {

    export class UtilitiesTests extends TestFramework.BaseTestCase {

        protected Utilities: Services.Utilities;

        protected inject(): void {

            beforeEach(() => {
                inject((_Utilities_) => {
                    this.Utilities = _Utilities_;
                });
            });
        }

        public execute(): void {

            describe("format", () => { this._test_format(); });
            describe("getValue", () => { this._test_getValue(); });
        }

        private _test_format(): void {

            it("handles null format strings without an exception.", () => {
                var result = this.Utilities.format(null);
                expect(result).toEqual(null);
            });

            it("handles omitted format parameters without an exception.", () => {
                var result = this.Utilities.format("Hello World, {0}!");
                expect(result).toEqual("Hello World, {0}!");
            });

            it("handles null format arguments without an exception.", () => {
                var result = this.Utilities.format("Hello World, {0}!", null);
                expect(result).toEqual("Hello World, !");
            });

            it("formats a string with a single parameter.", () => {
                var result = this.Utilities.format("Hello World, {0}!", "Bob");
                expect(result).toEqual("Hello World, Bob!");
            });

            it("handles extra parameters without an exception.", () => {
                var result = this.Utilities.format("Hello World, {0}!", "Bob", "Terra");
                expect(result).toEqual("Hello World, Bob!");
            });

            it("handles numbers without an exception.", () => {
                var result = this.Utilities.format("Hello World, {0}! Your favorite number is {1}.", "Bob", 42);
                expect(result).toEqual("Hello World, Bob! Your favorite number is 42.");
            });

            it("handles objects without an exception.", () => {
                var result = this.Utilities.format("Hello World, {0}! The magic value is: {1}.", "Bob", {});
                expect(result).toEqual("Hello World, Bob! The magic value is: [object Object].");
            });

            it("handles uses the replacement value's toString method, if one exists.", () => {

                var obj = {
                    toString: function () {
                        return "FOO";
                    }
                };

                var result = this.Utilities.format("Hello World, {0}! The magic value is: {1}.", "Bob", obj);
                expect(result).toEqual("Hello World, Bob! The magic value is: FOO.");
            });

            it("handles multiple parameters with out of order replacements.", () => {
                var result = this.Utilities.format("{1} World, {0}! Welcome to {2}.", "Bob", "Hello", "Sparta");
                expect(result).toEqual("Hello World, Bob! Welcome to Sparta.");
            });

            it("handles strings with '$$'.", () => {
                var result = this.Utilities.format("Testing {0} Testing", "P@$$");
                expect(result).toEqual("Testing P@$$ Testing");
            });

            it("handles strings with '$&'.", () => {
                var result = this.Utilities.format("Testing {0} Testing", "P@$&");
                expect(result).toEqual("Testing P@$& Testing");
            });

            it("handles strings with '$`'.", () => {
                var result = this.Utilities.format("Testing {0} Testing", "P@$`");
                expect(result).toEqual("Testing P@$` Testing");
            });

            it("handles strings with \"$'\".", () => {
                var result = this.Utilities.format("Testing {0} Testing", "P@$'");
                expect(result).toEqual("Testing P@$' Testing");
            });
        }

        private _test_getValue(): void {

            it("handles null without an exception.", () => {
                var result = this.Utilities.getValue(null, null);
                expect(result).toEqual(null);
            });

            it("handles finding an object with a period in the key name.", () => {
                var obj = {
                    "key.edge.case": "value!"
                };

                var result = this.Utilities.getValue(obj, "key.edge.case");

                expect(result).toEqual("value!");
            });

            it("handles finding an object at the top level.", () => {
                var obj = {
                    "key1": "value1"
                };

                var result = this.Utilities.getValue(obj, "key1");

                expect(result).toEqual("value1");
            });

            it("handles finding a false boolean value.", () => {
                var obj = {
                    "key1": false
                };

                var result = this.Utilities.getValue(obj, "key1");

                expect(result).toEqual(false);
            });

            it("handles finding a nested value.", () => {
                var obj = {
                    "key1": {
                        "key2": "value2"
                    }
                };

                var result = this.Utilities.getValue(obj, "key1.key2");

                expect(result).toEqual("value2");
            });
        }
    }
}
