
import * as gulp from "gulp";
import { GulpPlugins } from "../types";
import { TaskFunc } from "orchestrator";

import * as path from "path";
import * as sh from "shelljs";

/**
 * Simply delegates to the "cordova emulate ios" command.
 * 
 * Useful to quickly execute from Visual Studio Code's task launcher:
 * Bind CMD+Shift+R to "workbench.action.tasks.runTask task launcher"
 * 
 * This does not compile SASS, TypeScript, templates, etc.
 */
module.exports = function(gulp: gulp.Gulp, plugins: GulpPlugins): TaskFunc {

    return function(cb) {

        var cordovaBin = path.join("node_modules", ".bin", "cordova");
        var command = cordovaBin + " emulate ios";

        sh.exec(command);
        cb();
    };
};
