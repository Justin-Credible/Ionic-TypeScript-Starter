
var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var del = require("del");
var runSequence = require("run-sequence");

/**
 * Used to load the gulp task with the given name from resources/build/tasks
 * http://macr.ae/article/splitting-gulpfile-multiple-files.html
 */
function getTask(taskName) {
    var fileName = taskName.replace(":", "-");
    return require("./resources/build/tasks/" + fileName)(gulp, plugins);
}

gulp.task("help", plugins.taskListing.withFilters(/:/));

gulp.task("default",  function (cb) {
    runSequence("plugins", "libs", "tsd", "templates", "sass", "ts", "config", cb);
});

gulp.task("init", ["clean:config", "clean:bower", "clean:platforms", "clean:plugins", "clean:build", "clean:libs", "clean:ts", "clean:tsd", "clean:templates", "clean:sass"], getTask("init"));
gulp.task("config", getTask("config"));
gulp.task("watch", getTask("watch"));

gulp.task("package-chrome", getTask("package-chrome"));
gulp.task("package-web", getTask("package-web"));
gulp.task("package-remote-build", getTask("package-remote-build"));

gulp.task("emulate-ios", getTask("emulate-ios"));
gulp.task("emulate-ios-remote", ["package-remote-build"], getTask("emulate-ios-remote"));
gulp.task("emulate-android", getTask("emulate-android"));

gulp.task("lint", getTask("lint"));
gulp.task("test", ["ts:tests"], getTask("test"));
gulp.task("typedoc", getTask("typedoc"));

gulp.task("tsd", getTask("tsd"));
gulp.task("tsd:app", getTask("tsd:app"));
gulp.task("tsd:tests", getTask("tsd:tests"));

gulp.task("ts", ["ts:src"], getTask("ts"));
gulp.task("ts:src", ["ts:src-readme"], getTask("ts:src"));
gulp.task("ts:src-readme", getTask("ts:src-readme"));
gulp.task("ts:tests", ["ts"], getTask("ts:tests"));

gulp.task("plugins", ["git-check"], getTask("plugins"));
gulp.task("libs", getTask("libs"));
gulp.task("minify", getTask("minify"));
gulp.task("templates", getTask("templates"));
gulp.task("sass", getTask("sass"));

gulp.task("clean", ["clean:node", "clean:config", "clean:bower", "clean:platforms", "clean:plugins", "clean:build", "clean:libs", "clean:ts", "clean:tsd", "clean:templates", "clean:sass"]);
gulp.task("clean:node", getTask("clean/clean:node"));
gulp.task("clean:config", getTask("clean/clean:config"));
gulp.task("clean:bower", getTask("clean/clean:bower"));
gulp.task("clean:platforms", getTask("clean/clean:platforms"));
gulp.task("clean:plugins", getTask("clean/clean:plugins"));
gulp.task("clean:libs", getTask("clean/clean:libs"));
gulp.task("clean:ts", getTask("clean/clean:ts"));
gulp.task("clean:tsd", getTask("clean/clean:tsd"));
gulp.task("clean:templates", getTask("clean/clean:templates"));
gulp.task("clean:sass", getTask("clean/clean:sass"));
gulp.task("clean:chrome", getTask("clean/clean:chrome"));
gulp.task("clean:web", getTask("clean/clean:web"));
gulp.task("clean:build", getTask("clean/clean:build"));
gulp.task("clean:typedoc", getTask("clean/clean:typedoc"));

gulp.task("git-check", getTask("git-check"));
