
/**
 * This file exists to control the order in which compiled TypeScript files are concatenated
 * into the resulting unit-tests.bundle.js file. While all *.ts files could be listed here, we don't
 * need to list them all since the the file paths are defined as globs patterns in tsconfig.json.
 * Here we can list base components that are needed by other components (e.g. base classes) that
 * must be parsed before the dependent class.
 */

/// <reference path="TestFramework/BaseTestCase.ts" />
