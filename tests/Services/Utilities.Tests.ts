
/**
 * Tests for the Utilities.format() method.
 */
describe("Utilities.format()", function() {

    // This will hold a reference to an instance of the utilities class.
    var Utilities: JustinCredible.SampleApp.Services.Utilities;

    // Before each test, ensure that the main application module is available.
    beforeEach(module("JustinCredible.SampleApp.Application"));

    // Before each test, grab a reference to the Utilities class.
    beforeEach(inject(function (_Utilities_) {
        Utilities = _Utilities_;
    }));

    it("handles null format strings without an exception.", () => {
        var result = Utilities.format(null);
        expect(result).toEqual(null);
    });

    it("handles omitted format parameters without an exception.", () => {
        var result = Utilities.format("Hello World, {0}!");
        expect(result).toEqual("Hello World, {0}!");
    });

    it("handles null format arguments without an exception.", () => {
        var result = Utilities.format("Hello World, {0}!", null);
        expect(result).toEqual("Hello World, !");
    });

    it("formats a string with a single parameter.", () => {
        var result = Utilities.format("Hello World, {0}!", "Bob");
        expect(result).toEqual("Hello World, Bob!");
    });

    it("handles extra parameters without an exception.", () => {
        var result = Utilities.format("Hello World, {0}!", "Bob", "Terra");
        expect(result).toEqual("Hello World, Bob!");
    });

    it("handles numbers without an exception.", () => {
        var result = Utilities.format("Hello World, {0}! Your favorite number is {1}.", "Bob", 42);
        expect(result).toEqual("Hello World, Bob! Your favorite number is 42.");
    });

    it("handles objects without an exception.", () => {
        var result = Utilities.format("Hello World, {0}! The magic value is: {1}.", "Bob", {});
        expect(result).toEqual("Hello World, Bob! The magic value is: [object Object].");
    });

    it("handles uses the replacement value's toString method, if one exists.", () => {

        var obj = {
            toString: function () {
                return "FOO";
            }
        };

        var result = Utilities.format("Hello World, {0}! The magic value is: {1}.", "Bob", obj);
        expect(result).toEqual("Hello World, Bob! The magic value is: FOO.");
    });

    it("handles multiple parameters with out of order replacements.", () => {
        var result = Utilities.format("{1} World, {0}! Welcome to {2}.", "Bob", "Hello", "Sparta");
        expect(result).toEqual("Hello World, Bob! Welcome to Sparta.");
    });

    it("handles strings with '$$'.", () => {
        var result = Utilities.format("Testing {0} Testing", "P@$$");
        expect(result).toEqual("Testing P@$$ Testing");
    });

    it("handles strings with '$&'.", () => {
        var result = Utilities.format("Testing {0} Testing", "P@$&");
        expect(result).toEqual("Testing P@$& Testing");
    });

    it("handles strings with '$`'.", () => {
        var result = Utilities.format("Testing {0} Testing", "P@$`");
        expect(result).toEqual("Testing P@$` Testing");
    });

    it("handles strings with \"$'\".", () => {
        var result = Utilities.format("Testing {0} Testing", "P@$'");
        expect(result).toEqual("Testing P@$' Testing");
    });
});
