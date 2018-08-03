
import * as gulp from "gulp";
import { GulpPlugins } from "./gulp-types";
import { TaskFunc } from "orchestrator";

import * as fs from "fs";
import * as path from "path";

/**
 * Used to minify the JavaScript bundle.js built from the "ts" TypeScript compilation
 * target. This will use the bundle that is already on disk whose location is determined
 * from the out property of the compiler options in tsconfig.json.
 */
module.exports = function(gulp: gulp.Gulp, plugins: GulpPlugins): TaskFunc {

    return function(cb) {

        // Read tsconfig.json to determine the bundle output location.
        let config = JSON.parse(fs.readFileSync("src/tsconfig.json", "utf8"));
        let bundleLocation = config.compilerOptions.out;

        // Minify to a temporary location and the move to the bundle location.
        return gulp.src(bundleLocation)
            .pipe(plugins.uglify())
            .pipe(gulp.dest(path.dirname(bundleLocation)));
    };
};
