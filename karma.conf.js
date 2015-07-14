
// Karma Unit Test Runner Configuration

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["jasmine"],


        // list of files / patterns to load in the browser
        files: [

            // Application Source Files
            // This list should match the order defined in index.html
            "www/js/BuildVars.js",
            "www/js/RippleMockApi.js",
            "www/lib/ionic/js/ionic.bundle.min.js",
            "www/lib/angular-mocks/angular-mocks.js",
            "www/lib/lodash/lodash.js",
            "www/lib/moment/moment.js",
            "www/lib/nprogress/nprogress.js",
            "www/js/bundle.js",
            "www/js/Main.js",

            // Tests
            "tests/bundle.tests.js",

            // Allow the source maps and source for the TypeScript test files to be served
            // so they can be used for debugging tests, but do not include them as script
            // references in the browser instance.
            {
                pattern: "tests/**/*.js.map",
                included: false,
                watched: false,
                served: true
            },
            {
                pattern: "tests/**/*.ts",
                included: false,
                watched: false,
                served: true
            }
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },


        // test results reporter to use
        // possible values: "dots", "progress"
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["progress"],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ["PhantomJS"],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    })
}
