
namespace JustinCredible.SampleApp.UnitTests.TestFramework {

    /**
     * Helper methods for writing unit tests.
     */
    export class TestHelper {

        /**
         * Used to get the value of the --single switch passed to the gulp test task
         * that was used to launch Karma. If present, indicates the name of a single
         * test case that should be executed.
         */
        public static getSingleTestCaseName(): string {

            // tslint:disable-next-line:no-string-literal
            let karma: any = window["__karma__"];

            if (!karma || !karma.config || !karma.config.args || !karma.config.args.length) {
                return null;
            }

            if (karma.config.args.length < 1) {
                return null;
            }

            let arg0 = karma.config.args[0];
            let parts = arg0.split(":");

            return parts[0] === "SingleTestCaseName" && parts[1] != null
                    ? parts[1] : null;
        }

        /**
         * Used to check if the given class reference dervies from the given base class reference.
         * 
         * @param TargetClass A reference to a class to check.
         * @param BaseClass A reference to the base class to check.
         * @returns True if TargetClass or any of its parent classes dervice from BaseClass.
         */
        public static derivesFrom(TargetClass: Function, BaseClass: Function): boolean {

            // First we'll handle the edge case where the same class reference is passed.
            if (TargetClass.prototype === BaseClass.prototype) {
                return true;
            }

            // This will hold all of the prototypes for the object hiearchy.
            var prototypes = [];

            // Initialize the current class we will be examining in the loop below.
            // We'll start out with the TargetClass.
            var CurrentClass = TargetClass;

            // Save off the prototype of the target class.
            prototypes.push(TargetClass.prototype);

            // Walk upwards in the class hiearchy saving off each of the prototypes.
            while (true) {

                // Update the current class that we will be examining to be it's parent.
                CurrentClass = CurrentClass.prototype.__proto__.constructor;

                // Once we've reached a class whose prototype is the Object's prototype
                // we know we've reached the top and can stop traversing.
                if (CurrentClass.prototype === Object.prototype) {
                    break;
                }

                // Save off the prototype for this class.
                prototypes.push(CurrentClass.prototype);

                // Once we've reached a class whose parent's prototype is the Object's prototype
                // we know we've reached the top and can stop traversing.
                if (CurrentClass.prototype.__proto__ === Object.prototype) {
                    break;
                }
            }

            // Now that we've finished walking up the class hierarchy, we need to see if
            // any of the prototypes match the prototype of the Base class in question.

            var foundMatch = false;

            prototypes.forEach((prototype: any) => {
                if (prototype === BaseClass.prototype) {
                    foundMatch = true;
                }
            });

            return foundMatch;
        }
    }
}
