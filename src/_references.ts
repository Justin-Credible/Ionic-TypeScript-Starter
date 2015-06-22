
/**
 * This file exists to control the order in which compiled TypeScript files are concatenated
 * into the resulting appBundle.js file. While all *.ts files could be listed here, we don't
 * need to list them all since the tsc compiler will automatically traverse the directory tree.
 * Here we can list base components that are needed by other components (eg base classes) that
 * must be parsed before the dependent class.
 */

/// <reference path="Controllers/BaseController.ts" />
/// <reference path="Controllers/Dialogs/BaseDialogController.ts" />
/// <reference path="Directives/BaseElementDirective.ts" />
