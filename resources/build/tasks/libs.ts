
import * as gulp from "gulp";
import { GulpPlugins } from "./types";
import { TaskFunc } from "orchestrator";

import * as path from "path";
import * as sh from "shelljs";

/**
 * Used to download all of the bower dependencies as defined in bower.json and place
 * the consumable pieces in the www/lib directory.
 */
module.exports = function(gulp: gulp.Gulp, plugins: GulpPlugins): TaskFunc {

    return function(cb) {

        let command = path.join("node_modules", ".bin", "bower-installer");
        let result = sh.exec(command);

        // Strip out any of the "(node:PID)" identifiers from standard error output to make comparing strings easier.
        let stdErrorNoProcessIDs = result.stderr && result.stderr.replace(/\(node:[0-9]+\) /g, "");

        // Ignore this particular deprecation warning.
        let isDep0022 = stdErrorNoProcessIDs && stdErrorNoProcessIDs === "[DEP0022] DeprecationWarning: os.tmpDir() is deprecated. Use os.tmpdir() instead.\n";

        // We have to check stderr buffer for output here and treat as an error because bower-installer will not always
        // return a non-zero exit code if there are errors downloading libraries from Bower.
        if (result.code !== 0 || (result.stderr && !isDep0022)) {
            cb(new Error("gulp libs, bower-installer exit code was non-zero or output was written to stderr: " + result.stderr));
            return;
        }

        cb();
    };
};
