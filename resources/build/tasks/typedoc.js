
/**
 * An gulp task to create documentation for the TypeScript code.
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        return gulp
            .src("./src/**/*.ts")
            .pipe(plugins.typedoc({
                module: "commonjs",
                target: "es5",
                out: "build/typedocs",
                name: "Ionic TypeScript Starter"
            }));
    };
};
