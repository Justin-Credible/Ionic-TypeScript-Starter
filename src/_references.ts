
/**
 * This file exists to control the order in which compiled TypeScript files are concatenated
 * into the resulting www/js/bundle.js file. While all *.ts files could be listed here, we don't
 * need to list them all since the tsc compiler will automatically traverse the directory tree.
 * Here we can list base components that are needed by other components (eg base classes) that
 * must be parsed before the dependent class.
 */

/// <reference path="Framework/BaseController.ts" />
/// <reference path="Framework/BaseDialogController.ts" />
/// <reference path="Framework/BaseElementDirective.ts" />
