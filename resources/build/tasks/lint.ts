
import * as gulp from "gulp";
import { GulpPlugins } from "./types";
import { TaskFunc } from "orchestrator";

/**
 * Performs linting of the TypeScript source code.
 */
module.exports = function(gulp: gulp.Gulp, plugins: GulpPlugins): TaskFunc {

    return function(cb) {

        let filesToLint = [

            // The app source code.
            "./src/**/*.ts",

            // The API and unit test source code.
            "./tests/**/*.ts",

            // Third party type definitions not written by us (from DefinitelyTyped etc).
            "!./src/Types/ThirdParty/**/*.d.ts",
            "!./tests/Types/ThirdParty/**/*.d.ts",
        ];

        return gulp.src(filesToLint)
            .pipe(plugins.tslint())
            .pipe(plugins.tslint.report({
                emitError: false,
            }));
    };
};
