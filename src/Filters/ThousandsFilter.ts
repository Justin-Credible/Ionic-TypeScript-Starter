module JustinCredible.SampleApp.Filters {

    /**
     * Formats numbers greater than one thousand to include the K suffix.
     * 
     * Numbers greater than 10,000 will not show decimal places, while numbers
     * between 1,000 and 9,999 will show decimal places unless the number is
     * a multiple of one thousand.
     * 
     * For example:
     *      200   -> 200
     *      2000  -> 2K
     *      1321  -> 1.3K
     *      10700 -> 10K
     */
    export class ThousandsFilter {

        public static ID = "Thousands";

        public static filter(input: number): string {

            if (input == null) {
                return "";
            }

            if (input > 9999) {
                if (input % 10 === 0) {
                    return (input / 1000) + "K";
                }
                else {
                    return (input / 1000).toFixed(0) + "K";
                }
            }
            else if (input > 999) {
                if (input % 10 === 0) {
                    return (input / 1000) + "K";
                }
                else {
                    return (input / 1000).toFixed(1) + "K";
                }
            }
            else {
                return input + "";
            }
        }
    }
}
