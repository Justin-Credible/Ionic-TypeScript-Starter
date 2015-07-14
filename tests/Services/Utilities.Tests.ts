
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

    it("formats a string with a single parameter.", function() {
        expect(Utilities.format("Hello World, {0}!", "Bob")).toEqual("Hello World, Bob!");
    });
});
