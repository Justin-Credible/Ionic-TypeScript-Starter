
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
        expect(result).toEqual("Hello World, null!");
    });

    it("formats a string with a single parameter.", () => {
        var result = Utilities.format("Hello World, {0}!", "Bob");
        expect(result).toEqual("Hello World, Bob!");
    });

    it("handles extra parameters without an exception.", () => {
        var result = Utilities.format("Hello World, {0}!", "Bob", "Terra");
        expect(result).toEqual("Hello World, Bob!");
    });
});
