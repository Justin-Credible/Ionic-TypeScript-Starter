
import * as gulp from "gulp";
import { GulpPlugins } from "./resources/build/tasks/gulp-types";
import { TaskFunc } from "orchestrator";

import * as runSequence from "run-sequence";
import * as gulpLoadPlugins from "gulp-load-plugins";

type TaskFactory = (gulp: gulp.Gulp, plugins: GulpPlugins) => TaskFunc;

let gulpPlugins = gulpLoadPlugins<GulpPlugins>();

/**
 * Used to load the gulp task with the given name from resources/build/tasks
 * http://macr.ae/article/splitting-gulpfile-multiple-files.html
 */
function getTask(fileName: string): TaskFunc {
    let factory: TaskFactory = require("./resources/build/tasks/" + fileName);
    return factory(gulp, gulpPlugins);
}

gulp.task("help", gulpPlugins.taskListing.withFilters(/:/));

gulp.task("default",  function (cb) {
    runSequence("plugins", "libs", "templates", "sass", "ts", "config", cb);
});

gulp.task("init", ["clean:config", "clean:bower", "clean:platforms", "clean:plugins", "clean:build", "clean:libs", "clean:ts", "clean:templates", "clean:sass"], getTask("gulp-init"));
gulp.task("config", getTask("gulp-config"));
gulp.task("watch", getTask("gulp-watch"));

gulp.task("package-chrome", getTask("gulp-package-chrome"));
gulp.task("package-web", getTask("gulp-package-web"));
gulp.task("package-remote-build", getTask("gulp-package-remote-build"));

gulp.task("emulate-ios", getTask("gulp-emulate-ios"));
gulp.task("emulate-ios-remote", ["package-remote-build"], getTask("gulp-emulate-ios-remote"));
gulp.task("emulate-android", getTask("gulp-emulate-android"));

gulp.task("lint", getTask("gulp-lint"));
gulp.task("test", ["ts:tests"], getTask("gulp-test"));

gulp.task("ts", getTask("gulp-ts"));
gulp.task("ts:tests", ["ts"], getTask("gulp-ts-tests"));

gulp.task("plugins", ["git-check"], getTask("gulp-plugins"));
gulp.task("libs", getTask("gulp-libs"));
gulp.task("minify", getTask("gulp-minify"));
gulp.task("templates", getTask("gulp-templates"));
gulp.task("sass", getTask("gulp-sass"));

gulp.task("clean", ["clean:node", "clean:config", "clean:bower", "clean:platforms", "clean:plugins", "clean:build", "clean:libs", "clean:ts", "clean:templates", "clean:sass"]);
gulp.task("clean:node", getTask("clean/gulp-clean-node"));
gulp.task("clean:config", getTask("clean/gulp-clean-config"));
gulp.task("clean:bower", getTask("clean/gulp-clean-bower"));
gulp.task("clean:platforms", getTask("clean/gulp-clean-platforms"));
gulp.task("clean:plugins", getTask("clean/gulp-clean-plugins"));
gulp.task("clean:libs", getTask("clean/gulp-clean-libs"));
gulp.task("clean:ts", getTask("clean/gulp-clean-ts"));
gulp.task("clean:templates", getTask("clean/gulp-clean-templates"));
gulp.task("clean:sass", getTask("clean/gulp-clean-sass"));
gulp.task("clean:chrome", getTask("clean/gulp-clean-chrome"));
gulp.task("clean:web", getTask("clean/gulp-clean-web"));
gulp.task("clean:build", getTask("clean/gulp-clean-build"));

gulp.task("git-check", getTask("gulp-git-check"));
