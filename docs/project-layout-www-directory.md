# Overview

The `www` directory should contain all of the assets that will be used at runtime.

## index.master.html

This is the master index file that is used to generate `www/index.html` when running the `gulp config` task.

The config task will perform variable substitution based on the current scheme.

See `gulp config` in [Gulp Tasks](gulp-tasks.md#gulp-config) and [Base Framework: Build Schemes](base-framework.md#build-scemes) for more details.

## index.html _(generated)_

This file is generated from `www/index.master.html` when running the `gulp config` task. This is the initial page that will be loaded by Cordova when the application starts.

See `gulp config` in [Gulp Tasks](gulp-tasks.md#gulp-config) and [Base Framework: Build Schemes](base-framework.md#build-scemes) for more details.

!!!warning
	This file will be removed when executing the `gulp clean` or `gulp clean:config` tasks and should not be commited to source control.

# js

This contains plain JavaScript source files loaded by `www/index.html`.

## js/src _(generated)_

This directory is generated when running the `gulp ts` task in a scheme where the debug flag is set to true. It will contain all of the TypeScript source so that the application can be debugged in Chrome.

This directory will not be present in non-debug builds.

See [Base Framework: Build Schemes](base-framework.md#build-scemes) for more details.

!!! warning
	This directory will be removed well as when executing the `gulp clean` or `gulp clean:ts` tasks and should not be committed to source control.

## js/boot1.js

This is the first level boot loader loaded by `www/index.html`. It handles any low level boot tasks before delegating to the second level boot loader (`src/Framework/Boot2.ts`).

## js/build-vars.js _(generated)_

This file is generated when running the `gulp config` task. It contains build information such as version number, build timestamp, debug flag etc. It also contains all of the preference element values from `config.xml`.

It's contents are accessible via the Configuration service (or as an Angular constant).

See `gulp config` in [Gulp Tasks](gulp-tasks.md#gulp-config) and [Base Framework: Build Schemes](base-framework.md#build-scemes) for more details.

!!! warning
	This file will be removed when executing the `gulp clean` or `gulp clean:ts` tasks and should not be committed to source control.

## js/bundle.js _(generated)_

This file is generated when running the `gulp ts` task. It will contain all of the output from the compilation of the TypeScript files from the `src` directory.

Its contents will be minified in non-debug builds.

!!!warning
	This file will be removed when executing the `gulp clean` or `gulp clean:ts` tasks and should not be committed to source control.

## js/bundle.d.ts _(generated)_

This file is generated when running the `gulp ts` task. It will contain the TypeScript type descriptions for the `www/js/bundle.js` file.

It is primarily used by unit tests and will only be present during a debug build.

!!! warning
	This file will be removed when executing the `gulp clean` or `gulp clean:ts` tasks and should not be committed to source control.

## js/bundle.js.map _(generated)_

This file is generated when running the `gulp ts` task. It will contain mapping information to map the generated source from `www/js/bundle.js` to the TypeScript source that is copied to `www/js/src` in debug builds.

It is used when debugging the source in a browser and will only be present during a debug build.

!!! warning
	This file will be removed when executing the `gulp clean` or `gulp clean:ts` tasks and should not be committed to source control.

## js/templates.js

This file is generated when running the `gulp templates` task. It contains all of the Angular HTML templates from the `src/Views` directory.

This file will be removed when executing the `gulp clean` or `gulp clean:templates` tasks and should not be committed to source control.

See `gulp templates` in [Gulp Tasks](gulp-tasks.md#gulp-templates) and [Base Framework: Views](base-framework.md#views) for more details.

# lib _(generated)_

This directory is generated when running the `gulp libs` task. It will contain all of the third party libraries for use at runtime. It is populated via the Bower package manager using the `bower.json` file.

See `gulp libs` in [Gulp Tasks](gulp-tasks.md#gulp-libs) for more details.

!!!warning
	This directory will be removed in when executing the `gulp clean` or `gulp clean:libs` tasks and should not be committed to source control.

# images

This directory can be used to store images that will be used at runtime.

# css

This directory can be used to store plain CSS files.

## css/bundle.css _(generated)_

This file is generated when running the `gulp sass` task. It will contain the output from the compilation of the SASS files using the `src/Styles/Index.scss` file.

Its contents will be minified in non-debug builds.

See `gulp sass` in [Gulp Tasks](gulp-tasks.md#gulp-sass) for more details.

!!!warning
	This file will be removed when executing the `gulp clean` or `gulp clean:sass` tasks and should not be committed to source control.

## css/bundle.css.map _(generated)_

This file is generated when running the `gulp sass` task. It will contain mapping information to map the generated CSS to the original SASS source.

See `gulp sass` in [Gulp Tasks](gulp-tasks.md#gulp-sass) for more details.

!!!warning
	This file will be removed when executing the `gulp clean` or `gulp clean:sass` tasks and should not be committed to source control.
