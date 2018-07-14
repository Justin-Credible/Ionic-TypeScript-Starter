
namespace JustinCredible.SampleApp.UnitTests.TestFramework {

    /**
     * This is the main test runner. It looks for classes that extend the
     * BaseTestCase and invokes their initialize() and execute() methods.
     * 
     * Its start() method is invoked via TestRunnerBoot.js
     */
    export class TestRunner {

        public static start(): void {

            // Pull in the value of the --single switch used with gulp test.
            let singleTestCaseName = TestHelper.getSingleTestCaseName();

            // Provide some messaging based on the state of the flags.
            if (singleTestCaseName) {
                console.log("Running single test case with name: " + singleTestCaseName);
            }
            else {
                console.log("Running all test cases...");
            }

            var testCases: typeof BaseTestCase[] = [];

            // Gather up all of the tests that we want to execute from the
            // JustinCredible.SampleApp.Tests.TestCases namespace.
            _.each(TestCases, (TestCase: any) => {

                let isTestCase = TestHelper.derivesFrom(TestCase, BaseTestCase);

                // If this isn't a class that extends from BaseTestCase, then skip it.
                if (!isTestCase) {
                    return; // Continue
                }

                // If the user only wants to run a single test, we can compare the name
                // of the class here and add it to the list if it matches.
                if (singleTestCaseName) {
                    let classReference = <any>TestCase;

                    if (classReference.name === singleTestCaseName) {
                        testCases.push(TestCase);
                    }

                    return; // Continue
                }

                testCases.push(TestCase);
            });

            // If the user only wants to run a single test, ensure we found a match.
            if (singleTestCaseName && testCases.length !== 1) {
                console.error("Unable to locate a single test class with the name: " + singleTestCaseName);
                return;
            }

            // Ensure we've booted the app so Angular can register services etc.
            // Note do not pass a root element; we don't actually want to render stuff during unit tests.
            JustinCredible.SampleApp.Boot.main(null);

            // Loop over each of the test cases and execute them.
            testCases.forEach((TestCase: any) => {

                describe(singleTestCaseName, () => {
                    var testCase: BaseTestCase = new TestCase();
                    testCase.initialize();
                    testCase.execute();
                });
            });
        }
    }
}
