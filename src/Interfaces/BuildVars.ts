
namespace JustinCredible.SampleApp.Interfaces {

    /**
     * Variables emitted at build time which contain useful application information.
     */
    export interface BuildVars {
        /**
         * True if the application was build in debug configuration, false if it was
         * build a release or distribution configuration.
         */
        debug: boolean;

        /**
         * The time at which the application was built.
         */
        buildTimestamp: string;

        /**
         * The short SHA for the git commit that this build was created from.
         * 
         * Will be 'unknown' if the commit couldn't be determined or the machine
         * that made the build did not have git installed.
         */
        commitShortSha: string;

        /**
         * Holds all of the name/value pairs from config.yml.
         */
        config: BuildConfig;
    }
}
