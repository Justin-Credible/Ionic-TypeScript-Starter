
/**
 * Tests for the FileUtilities.
 */
describe("FileUtilities.getDefaultRootPath()", function() {

    // This will hold a reference to an instance of the FileUtilities class.
    var FileUtilities: JustinCredible.SampleApp.Services.FileUtilities;

    // Before each test, ensure that the main application module is available.
    beforeEach(module("JustinCredible.SampleApp.Application"));

    // Before each test, grab a reference to the FileUtilities class.
    beforeEach(inject(function (_FileUtilities_) {
        FileUtilities = _FileUtilities_;
    }));

    it("returns an empty root path if there is no cordova", () => {
        var result = FileUtilities.getDefaultRootPath();
        expect(result).toEqual("");
    });

    it("returns an empty root path id if there is no cordova", () => {
        var result = FileUtilities.getDefaultRootPathId();
        expect(result).toEqual("");
    });
});
