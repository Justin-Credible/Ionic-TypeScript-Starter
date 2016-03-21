
// Native Node Modules
var fs = require("fs");
var path = require("path");

/**
 * Used to minify the JavaScript bundle.js built from the "ts" TypeScript compilation
 * target. This will use the bundle that is already on disk whose location is determined
 * from the out property of the compiler options in tsconfig.json.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        // Read tsconfig.json to determine the bundle output location.
        var config = JSON.parse(fs.readFileSync("src/tsconfig.json", "utf8"));
        var bundleLocation = config.compilerOptions.out;

        // Minify to a temporary location and the move to the bundle location.
        return gulp.src(bundleLocation)
            .pipe(plugins.uglify())
            .pipe(gulp.dest(path.dirname(bundleLocation)));
    };
};
