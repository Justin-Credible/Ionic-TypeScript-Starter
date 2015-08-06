module JustinCredible.SampleApp.Services {

    /**
     * Provides a common set of helper/utility methods for performing file I/O.
     * 
     * Note that all I/O operations are asynchronous.
     */
    export class FileUtilities {

        //#region Injection

        public static ID = "FileUtilities";

        public static get $inject(): string[] {
            return [
                "$q",
                Utilities.ID
            ];
        }

        constructor(
            private $q: ng.IQService,
            private Utilities: Utilities) {
        }

        //#endregion

        /**
         * This helper provides a common location to manipulate the path before it is used. This is
         * useful for scenarios in which different platforms handle paths differently.
         * 
         * @param path The requested file path to use.
         * @returns A potentially manipulated path to use instead.
         */
        private preparePath(path: string): string {
            if (!path) {
                return null;
            }

            // On Android platforms the default root path can contain a trailing forward slash
            // and it can't handle two consecutive forward slashes in a path. Here we remove the
            // leading backslash from the given path, if it is present (iOS on the other had requires
            // a leading slash).
            if (this.Utilities.isAndroid && this.Utilities.startsWith(path, "/")) {
                path = path.substr(1);
            }

            return path;
        }

        /**
         * Used to get the default root directory for file I/O on local storage.
         * 
         * This makes it easy for all API calls to use a common location that could be configurable
         * by the user and/or development vs production environments.
         * 
         * The current implementation is hard coded.
         * 
         * If an externalDataDirectory is available it will be used. This makes it easier to
         * access files on Android devices as the external data directory is normally accessible
         * on non-rooted devices (while the dataDirectory is only available if you have root).
         */
        public getDefaultRootPath(): string {
            if (typeof(cordova) === "undefined" || typeof(cordova.file) === "undefined") {
                return "";
            }
            else {
                return cordova.file.externalDataDirectory ? cordova.file.externalDataDirectory : cordova.file.dataDirectory;
            }
        }

        /**
         * Used to get the ID of the default root directory for file I/O on local storage.
         */
        public getDefaultRootPathId(): string {
            if (typeof(cordova) === "undefined" || typeof(cordova.file) === "undefined") {
                return "";
            }
            else {
                return cordova.file.externalDataDirectory ? "cordova.file.externalDataDirectory" : "cordova.file.dataDirectory";
            }
        }

        /**
         * Used to read a text file from local storage.
         * 
         * The path is relative to the current default root directory which
         * is determined by the getDefaultRootPath() method.
         * 
         * @param path The path to the file to read.
         * @returns A promise of type string which will be the contents of the text file.
         */
        public readTextFile(path: string): ng.IPromise<string>;

        /**
         * Used to read a text file from local storage.
         * 
         * The path is relative to the current default root directory.
         * 
         * @param path The path to the file to read.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type string which will be the contents of the text file.
         */
        public readTextFile(path: string, rootPath: string): ng.IPromise<string>;

        /**
         * Used to read a text file from local storage.
         * 
         * The path is relative to the current default root directory.
         * 
         * @param path The path to the file to read.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type string which will be the contents of the text file.
         */
        public readTextFile(path: string, rootPath?: string): ng.IPromise<string> {
            var q = this.$q.defer<string>();

            if (!rootPath) {
                rootPath = this.getDefaultRootPath();
            }

            path = this.preparePath(path);

            if (typeof(window.resolveLocalFileSystemURL) === "undefined") {
                q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                return q.promise;
            }

            window.resolveLocalFileSystemURL(rootPath, function (rootEntry: DirectoryEntry) {

                var flags: Flags = {
                    create: false,
                    exclusive: false
                };

                rootEntry.getFile(path, flags, function (fileEntry: FileEntry) {

                    fileEntry.file(function (file: File) {

                        var reader = new FileReader();

                        reader.onload = function (evt: any) {
                            q.resolve(reader.result);
                        };

                        reader.onerror = q.reject;

                        reader.readAsText(file);

                    }, q.reject);

                }, q.reject);

            }, q.reject);

            return q.promise;
        }

        /**
         * Used to write a string of text to a file in local storage.
         * 
         * The path is relative to the current default root directory.
         * 
         * @param path The path to the file to write.
         * @param text The string of text to write to the file.
         * @returns A promise of type string which will be the contents of the text file.
         */
        public writeTextFile(path: string, text: string);

        /**
         * Used to write a string of text to a file in local storage.
         * 
         * The path is relative to the current default root directory.
         * 
         * @param path The path to the file to write.
         * @param text The string of text to write to the file.
         * @param append True to append, false to overwrite (defaults to false).
         * @returns A promise of type string which will be the contents of the text file.
         */
        public writeTextFile(path: string, text: string, append?: boolean);

        /**
         * Used to write a string of text to a file in local storage.
         * 
         * @param path The path to the file to write.
         * @param text The string of text to write to the file.
         * @param append True to append, false to overwrite (defaults to false).
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type string which will be the contents of the text file.
         */
        public writeTextFile(path: string, text: string, append: boolean, rootPath: string);

        /**
         * Used to write a string of text to a file in local storage.
         * 
         * @param path The path to the file to write.
         * @param text The string of text to write to the file.
         * @param append True to append, false to overwrite (defaults to false).
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type string which will be the contents of the text file.
         */
        public writeTextFile(path: string, text: string, append?: boolean, rootPath?: string) {
            var q = this.$q.defer<void>();

            if (!rootPath) {
                rootPath = this.getDefaultRootPath();
            }

            path = this.preparePath(path);

            // Default to overwriting if not specified.
            if (append == null) {
                append = false;
            }

            if (typeof(window.resolveLocalFileSystemURL) === "undefined") {
                q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                return q.promise;
            }

            window.resolveLocalFileSystemURL(rootPath, function (rootEntry: DirectoryEntry) {

                var flags: Flags = {
                    create: true,
                    exclusive: false
                };

                rootEntry.getFile(path, flags, function (fileEntry: FileEntry) {

                    fileEntry.createWriter(function (writer: FileWriter) {

                        var blobOptions: BlobPropertyBag;

                        if (append) {
                            writer.seek(writer.length);
                        }
                        else {
                            writer.truncate(0);
                        }

                        blobOptions = {
                            type: "text/plain"
                        };

                        writer.onwrite = function () {
                            q.resolve();
                        };

                        writer.onerror = q.reject;

                        writer.write(new Blob([text], blobOptions));

                    }, q.reject);

                }, q.reject);

            }, q.reject);

            return q.promise;
        }

        /**
         * Used to get a list of directories in the given path.
         * 
         * The path is relative to the current default root directory.
         * 
         * @param path The path to the directory to examine.
         * @returns A promise of type DirectoryEntry[] which will be a list of directories.
         */
        public getDirectories(path: string): ng.IPromise<DirectoryEntry[]>;

        /**
         * Used to get a list of directories in the given path.
         * 
         * @param path The path to the directory to examine.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type DirectoryEntry[] which will be a list of directories.
         */
        public getDirectories(path: string, rootPath: string): ng.IPromise<DirectoryEntry[]>;

        /**
         * Used to get a list of directories in the given path.
         * 
         * @param path The path to the directory to examine.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type DirectoryEntry[] which will be a list of directories.
         */
        public getDirectories(path: string, rootPath?: string): ng.IPromise<DirectoryEntry[]> {
            var q = this.$q.defer<DirectoryEntry[]>();

            path = this.preparePath(path);

            if (typeof(window.resolveLocalFileSystemURL) === "undefined") {
                q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                return q.promise;
            }

            window.resolveLocalFileSystemURL(rootPath, function (rootEntry: DirectoryEntry) {

                var flags: Flags = {
                    create: false,
                    exclusive: false
                };

                rootEntry.getDirectory(path, flags, function (directoryEntry: DirectoryEntry) {

                    var reader: DirectoryReader;

                    reader = directoryEntry.createReader();

                    reader.readEntries(function (entries: Entry[]) {

                        var directories: DirectoryEntry[] = [];

                        entries.forEach(function (entry: Entry) {
                            if (entry.isDirectory) {
                                directories.push(<DirectoryEntry>entry);
                            }
                        });

                        q.resolve(directories);

                    }, q.reject);

                }, q.reject);

            }, q.reject);

            return q.promise;
        }

        /**
         * Used to get a list of directories in the given directory.
         * 
         * @param directory The directory to examine.
         * @returns A promise of type DirectoryEntry[] which will be a list of directories.
         */
        public getDirectoriesUsingEntry(directory: DirectoryEntry): ng.IPromise<DirectoryEntry[]> {
            var q = this.$q.defer<DirectoryEntry[]>();

            var reader: DirectoryReader;

            reader = directory.createReader();

            reader.readEntries(function (entries: Entry[]) {

                var directories: DirectoryEntry[] = [];

                entries.forEach(function (entry: Entry) {
                    if (entry.isDirectory) {
                        directories.push(<DirectoryEntry>entry);
                    }
                });

                q.resolve(directories);

            }, q.reject);

            return q.promise;
        }

        /**
         * Used to get a list of directory names in the given path.
         * 
         * The path is relative to the current default root directory.
         * 
         * @param path The path to the directory to examine.
         * @returns A promise of type string[] which will be a list of directory names.
         */
        public getDirectoryNames(path: string): ng.IPromise<string[]>;

        /**
         * Used to get a list of directory names in the given path.
         * 
         * @param path The path to the directory to examine.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type string[] which will be a list of directory names.
         */
        public getDirectoryNames(path: string, rootPath: string): ng.IPromise<string[]>;

        /**
         * Used to get a list of directory names in the given path.
         * 
         * @param path The path to the directory to examine.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type string[] which will be a list of directory names.
         */
        public getDirectoryNames(path: string, rootPath?: string): ng.IPromise<string[]> {
            var q = this.$q.defer<string[]>();

            if (!rootPath) {
                rootPath = this.getDefaultRootPath();
            }

            path = this.preparePath(path);

            if (typeof(window.resolveLocalFileSystemURL) === "undefined") {
                q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                return q.promise;
            }

            window.resolveLocalFileSystemURL(rootPath, function (rootEntry: DirectoryEntry) {

                var flags: Flags = {
                    create: false,
                    exclusive: false
                };

                rootEntry.getDirectory(path, flags, function (directoryEntry: DirectoryEntry) {

                    var reader: DirectoryReader;

                    reader = directoryEntry.createReader();

                    reader.readEntries(function (entries: Entry[]) {

                        var directoryNames: string[] = [];

                        entries.forEach(function (entry: Entry) {
                            if (entry.isDirectory) {
                                directoryNames.push(entry.name);
                            }
                        });

                        q.resolve(directoryNames);

                    }, q.reject);

                }, q.reject);

            }, q.reject);

            return q.promise;
        }

        /**
         * Used to get a list of full paths to directories in the given path.
         * 
         * The path is relative to the current default root directory.
         * 
         * @param path The path to the directory to examine.
         * @returns A promise of type string[] which will be a list of full directory paths.
         */
        public getDirectoryPaths(path: string): ng.IPromise<string[]>;

        /**
         * Used to get a list of full paths to directories in the given path.
         * 
         * @param path The path to the directory to examine.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type string[] which will be a list of full directory paths.
         */
        public getDirectoryPaths(path: string, rootPath: string): ng.IPromise<string[]>;

        /**
         * Used to get a list of full paths to directories in the given path.
         * 
         * @param path The path to the directory to examine.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type string[] which will be a list of full directory paths.
         */
        public getDirectoryPaths(path: string, rootPath?: string): ng.IPromise<string[]> {
            var q = this.$q.defer<string[]>();

            if (!rootPath) {
                rootPath = this.getDefaultRootPath();
            }

            path = this.preparePath(path);

            if (typeof(window.resolveLocalFileSystemURL) === "undefined") {
                q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                return q.promise;
            }

            window.resolveLocalFileSystemURL(rootPath, function (rootEntry: DirectoryEntry) {

                var flags: Flags = {
                    create: false,
                    exclusive: false
                };

                rootEntry.getDirectory(path, flags, function (directoryEntry: DirectoryEntry) {

                    var reader: DirectoryReader;

                    reader = directoryEntry.createReader();

                    reader.readEntries(function (entries: Entry[]) {

                        var directoryPaths: string[] = [];

                        entries.forEach(function (entry: Entry) {
                            if (entry.isDirectory) {
                                directoryPaths.push(entry.fullPath);
                            }
                        });

                        q.resolve(directoryPaths);

                    }, q.reject);

                }, q.reject);

            }, q.reject);

            return q.promise;
        }

        /**
         * Used to get a list of files in the given path.
         * 
         * The path is relative to the current default root directory.
         * 
         * @param path The path to the directory to examine.
         * @returns A promise of type FileEntry[] which will be a list of files.
         */
        public getFiles(path: string): ng.IPromise<FileEntry[]>;

        /**
         * Used to get a list of files in the given path.
         * 
         * @param path The path to the directory to examine.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type FileEntry[] which will be a list of files.
         */
        public getFiles(path: string, rootPath: string): ng.IPromise<FileEntry[]>;

        /**
         * Used to get a list of files in the given path.
         * 
         * @param path The path to the directory to examine.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type FileEntry[] which will be a list of files.
         */
        public getFiles(path: string, rootPath?: string): ng.IPromise<FileEntry[]> {
            var q = this.$q.defer<Entry[]>();

            if (!rootPath) {
                rootPath = this.getDefaultRootPath();
            }

            path = this.preparePath(path);

            if (typeof(window.resolveLocalFileSystemURL) === "undefined") {
                q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                return q.promise;
            }

            window.resolveLocalFileSystemURL(rootPath, function (rootEntry: DirectoryEntry) {

                var flags: Flags = {
                    create: false,
                    exclusive: false
                };

                rootEntry.getDirectory(path, flags, function (directoryEntry: DirectoryEntry) {

                    var reader: DirectoryReader;

                    reader = directoryEntry.createReader();

                    reader.readEntries(function (entries: Entry[]) {

                        var files: FileEntry[] = [];

                        entries.forEach(function (entry: Entry) {
                            if (entry.isFile) {
                                files.push(<FileEntry>entry);
                            }
                        });

                        q.resolve(files);

                    }, q.reject);

                }, q.reject);

            }, q.reject);

            return q.promise;
        }

        /**
         * Used to get a list of files in the given directory.
         * 
         * @param directory The directory to examine.
         * @returns A promise of type FileEntry[] which will be a list of files.
         */
        public getFilesUsingEntry(directory: DirectoryEntry): ng.IPromise<FileEntry[]> {
            var q = this.$q.defer<FileEntry[]>();

            var reader: DirectoryReader;

            reader = directory.createReader();

            reader.readEntries(function (entries: Entry[]) {

                var files: FileEntry[] = [];

                entries.forEach(function (entry: Entry) {
                    if (entry.isFile) {
                        files.push(<FileEntry>entry);
                    }
                });

                q.resolve(files);

            }, q.reject);

            return q.promise;
        }

        /**
         * Used to get a list of file names in the given path.
         * 
         * The path is relative to the current default root directory.
         * 
         * @param path The path to the directory to examine.
         * @returns A promise of type string[] which will be a list of file names.
         */
        public getFileNames(path: string): ng.IPromise<string[]>;

        /**
         * Used to get a list of file names in the given path.
         * 
         * @param path The path to the directory to examine.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type string[] which will be a list of file names.
         */
        public getFileNames(path: string, rootPath: string): ng.IPromise<string[]>;

        /**
         * Used to get a list of file names in the given path.
         * 
         * @param path The path to the directory to examine.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type string[] which will be a list of file names.
         */
        public getFileNames(path: string, rootPath?: string): ng.IPromise<string[]> {
            var q = this.$q.defer<string[]>();

            if (!rootPath) {
                rootPath = this.getDefaultRootPath();
            }

            path = this.preparePath(path);

            if (typeof(window.resolveLocalFileSystemURL) === "undefined") {
                q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                return q.promise;
            }

            window.resolveLocalFileSystemURL(rootPath, function (rootEntry: DirectoryEntry) {

                var flags: Flags = {
                    create: false,
                    exclusive: false
                };

                rootEntry.getDirectory(path, flags, function (directoryEntry: DirectoryEntry) {

                    var reader: DirectoryReader;

                    reader = directoryEntry.createReader();

                    reader.readEntries(function (entries: Entry[]) {

                        var fileNames: string[] = [];

                        entries.forEach(function (entry: Entry) {
                            if (entry.isFile) {
                                fileNames.push(entry.name);
                            }
                        });

                        q.resolve(fileNames);

                    }, q.reject);

                }, q.reject);

            }, q.reject);

            return q.promise;
        }

        /**
         * Used to get a list of full paths to files in the given path.
         * 
         * @param path The path to the directory to examine.
         * @returns A promise of type string[] which will be a list of file names.
         */
        public getFilePaths(path: string): ng.IPromise<string[]>;

        /**
         * Used to get a list of full paths to files in the given path.
         * 
         * @param path The path to the directory to examine.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type string[] which will be a list of file names.
         */
        public getFilePaths(path: string, rootPath: string): ng.IPromise<string[]>;

        /**
         * Used to get a list of full paths to files in the given path.
         * 
         * @param path The path to the directory to examine.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type string[] which will be a list of file names.
         */
        public getFilePaths(path: string, rootPath?: string): ng.IPromise<string[]> {
            var q = this.$q.defer<string[]>();

            if (!rootPath) {
                rootPath = this.getDefaultRootPath();
            }

            path = this.preparePath(path);

            if (typeof(window.resolveLocalFileSystemURL) === "undefined") {
                q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                return q.promise;
            }

            window.resolveLocalFileSystemURL(rootPath, function (rootEntry: DirectoryEntry) {

                var flags: Flags = {
                    create: false,
                    exclusive: false
                };

                rootEntry.getDirectory(path, flags, function (directoryEntry: DirectoryEntry) {

                    var reader: DirectoryReader;

                    reader = directoryEntry.createReader();

                    reader.readEntries(function (entries: Entry[]) {

                        var filePaths: string[] = [];

                        entries.forEach(function (entry: Entry) {
                            if (entry.isFile) {
                                filePaths.push(entry.fullPath);
                            }
                        });

                        q.resolve(filePaths);

                    }, q.reject);

                }, q.reject);

            }, q.reject);

            return q.promise;
        }

        /**
         * Used to get all of the files in the given path.
         * This method searches child directories recursively.
         * 
         * @param path The path to the directory to examine.
         * @returns A promise of type FileEntry[] which will be a list of files.
         */
        public getAllFiles(path: string): ng.IPromise<FileEntry[]>;

        /**
         * Used to get all of the files in the given path.
         * This method searches child directories recursively.
         * 
         * @param path The path to the directory to examine.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type FileEntry[] which will be a list of files.
         */
        public getAllFiles(path: string, rootPath: string): ng.IPromise<FileEntry[]>;

        /**
         * Used to get all of the files in the given path.
         * This method searches child directories recursively.
         * 
         * @param path The path to the directory to examine.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type FileEntry[] which will be a list of files.
         */
        public getAllFiles(path: string, rootPath?: string): ng.IPromise<FileEntry[]> {
            var q = this.$q.defer<FileEntry[]>(),
                allFiles: FileEntry[] = [],
                promises: ng.IPromise<FileEntry[]>[] = [];

            if (!rootPath) {
                rootPath = this.getDefaultRootPath();
            }

            path = this.preparePath(path);

            // First lets make sure the directory exists.
            this.directoryExists(path, rootPath).then((exists: boolean) => {

                // If this directory doesn't exist, then there are no files to get.
                if (!exists) {
                    q.resolve([]);
                }

                // Get all of the child subdirectories.
                this.getAllDirectories(path, rootPath).then((directories: DirectoryEntry[]) => {
                    var promise: ng.IPromise<FileEntry[]>;

                    // Now we are going loop over each of the directories...
                    directories.forEach((directory: DirectoryEntry) => {

                        // ... and get the files in each directory.
                        promise = this.getFilesUsingEntry(directory);
                        promise.then((files: FileEntry[]) => {

                            // Add the files for this directory to the full list.
                            allFiles = allFiles.concat(files);

                        }, q.reject);

                        // Store the promise for the getFiles operation.
                        promises.push(promise);
                    });

                    // We also need to include the files in passed in directory path.
                    promise = this.getFiles(path, rootPath);
                    promise.then((files: FileEntry[]) => {
                        allFiles = allFiles.concat(files);
                    }, q.reject);

                    // Store the promise for the getFile operation.
                    promises.push(promise);

                    // Once all of the getFile I/O operations complete, we can finish.
                    this.$q.all(promises).then(() => { q.resolve(allFiles); }, () => { q.reject(); });

                }, q.reject);

            }, q.reject);

            return q.promise;
        }

        /**
         * Used to get all of the files in the given path.
         * This method searches child directories recursively.
         * 
         * @param path The path to the directory to examine.
         * @returns A promise of type DirectoryEntry[] which will be a list of directories.
         */
        public getAllDirectories(path: string): ng.IPromise<DirectoryEntry[]>;

        /**
         * Used to get all of the files in the given path.
         * This method searches child directories recursively.
         * 
         * @param path The path to the directory to examine.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type DirectoryEntry[] which will be a list of directories.
         */
        public getAllDirectories(path: string, rootPath: string): ng.IPromise<DirectoryEntry[]>;

        /**
         * Used to get all of the files in the given path.
         * This method searches child directories recursively.
         * 
         * @param path The path to the directory to examine.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type DirectoryEntry[] which will be a list of directories.
         */
        public getAllDirectories(path: string, rootPath?: string): ng.IPromise<DirectoryEntry[]> {
            var q = this.$q.defer<DirectoryEntry[]>(),
                allDirectories: DirectoryEntry[] = [];

            if (!rootPath) {
                rootPath = this.getDefaultRootPath();
            }

            path = this.preparePath(path);

            // First lets make sure the directory exists.
            this.directoryExists(path, rootPath).then((exists: boolean) => {

                // If this directory doesn't exist, then there are no directories to get.
                if (!exists) {
                    q.resolve([]);
                }

                // To kick off recursion, we need to get the directories at this first level.
                this.getDirectories(path, rootPath).then((directories: DirectoryEntry[]) => {

                    // Save off these first directories.
                    allDirectories = allDirectories.concat(directories);

                    // Kick off recursion.
                    this.getAllDirectories_recursive(directories, allDirectories, q);

                }, q.reject);

            }, q.resolve);

            return q.promise;
        }

        private getAllDirectories_recursive(dirsToCheck: DirectoryEntry[], allDirs: DirectoryEntry[], q: ng.IDeferred<DirectoryEntry[]>) {
            var newDirs: DirectoryEntry[] = [],
                promises: ng.IPromise<DirectoryEntry[]>[] = [];

            dirsToCheck.forEach((directoryToCheck: DirectoryEntry) => {
                var promise: ng.IPromise<DirectoryEntry[]>;

                // Get the child directories for the passed in directories.
                promise = this.getDirectoriesUsingEntry(directoryToCheck);
                promise.then((directories: DirectoryEntry[]) => {

                    // Save off the list of directories for this directory.
                    newDirs = newDirs.concat(directories);

                    // Add the directories to the full list
                    allDirs = allDirs.concat(directories);

                }, q.reject);

                // Save off the promise for this getDirectories I/O operation.
                promises.push(promise);

            });

            // Once all of the I/O operations for the getDirectories call completes we need
            // to check to see if we need to continue to recurse or not.
            this.$q.all(promises).then(() => {

                if (newDirs.length === 0) {
                    // If there are no more child directories, then we're finally done!
                    q.resolve(allDirs);
                }
                else {
                    // If there are more child directories, then we need to recurse.
                    this.getAllDirectories_recursive(newDirs, allDirs, q);
                }
            });
        }

        /**
         * Used to create a directory at the given path.
         * 
         * If the directory already exists, it will still return successfully.
         * 
         * The path is relative to the current default root directory.
         * 
         * @param path The path to the directory to examine.
         * @returns A promise of type void.
         */
        public createDirectory(path: string): ng.IPromise<void>;

        /**
         * Used to create a directory at the given path.
         * 
         * If the directory already exists, it will still return successfully.
         * 
         * The path is relative to the current default root directory.
         * 
         * @param path The path to the directory to examine.
         * @param createParents True to create parent directories if they do not exist.
         * @returns A promise of type void.
         */
        public createDirectory(path: string, createParents: boolean): ng.IPromise<void>;

        /**
         * Used to create a directory at the given path.
         * 
         * If the directory already exists, it will still return successfully.
         * 
         * @param path The path to the directory to examine.
         * @param createParents True to create parent directories if they do not exist.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type void.
         */
        public createDirectory(path: string, createParents: boolean, rootPath: string): ng.IPromise<void>;

        /**
         * Used to create a directory at the given path.
         * 
         * If the directory already exists, it will still return successfully.
         * 
         * @param path The path to the directory to examine.
         * @param createParents True to create parent directories if they do not exist.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type void.
         */
        public createDirectory(path: string, createParents?: boolean, rootPath?: string): ng.IPromise<void> {
            var q = this.$q.defer<void>();

            if (!rootPath) {
                rootPath = this.getDefaultRootPath();
            }

            // Default createParents to false so that the caller has to explicitly opt in to this behavior.
            if (createParents == null) {
                createParents = false;
            }

            path = this.preparePath(path);

            if (createParents) {
                //TODO Make this create parent directories recursively if they don't exist.
                throw new Error("FileUtilities.createDirectory() createParents=true not implemented.");
            }

            if (typeof(window.resolveLocalFileSystemURL) === "undefined") {
                q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                return q.promise;
            }

            window.resolveLocalFileSystemURL(rootPath, function (rootEntry: DirectoryEntry) {
                var flags: Flags;

                flags = {
                    create: true, // Specify true here to create the directory.
                    exclusive: false
                };

                rootEntry.getDirectory(path, flags, function (entry: DirectoryEntry) {

                    // If the call succeeded, then we know the directory was created.
                    q.resolve();

                }, q.reject);

            }, q.reject);

            return q.promise;
        }

        /**
         * Used to remove all of the files and directories underneath the given directory.
         * The given directory will not be removed.
         * 
         * The path is relative to the current default root directory.
         * 
         * @param path The path to the directory to empty.
         * @returns A promise of type void.
         */
        public emptyDirectory(path: string): ng.IPromise<void>;

        /**
         * Used to remove all of the files and directories underneath the given directory.
         * The given directory will not be removed.
         * 
         * @param path The path to the directory to empty.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type void.
         */
        public emptyDirectory(path: string, rootPath: string): ng.IPromise<void>;

        /**
         * Used to remove all of the files and directories underneath the given directory.
         * The given directory will not be removed.
         * 
         * @param path The path to the directory to empty.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type void.
         */
        public emptyDirectory(path: string, rootPath?: string): ng.IPromise<void> {
            var q = this.$q.defer<void>();

            if (!rootPath) {
                rootPath = this.getDefaultRootPath();
            }

            path = this.preparePath(path);

            this.directoryExists(path, rootPath).then((exists: boolean) => {

                // If the directory we are attempting to delete doesn't exist, then
                // return without failing.
                if (!exists) {
                    q.resolve();
                }

                // First, get a list of ALL child files.
                this.getAllFiles(path, rootPath).then((fileEntries: FileEntry[]) => {

                    // Then delete all of those files.
                    this.deleteFilesUsingEntries(fileEntries).then(() => {

                        // Next, get a list of ALL of the child directories.
                        this.getAllDirectories(path, rootPath).then((directoryEntries: DirectoryEntry[]) => {

                            // Then delete all of those directories.
                            this.deleteDirectoriesUsingEntries(directoryEntries).then(q.resolve, q.reject);

                        }, q.reject);

                    }, q.reject);

                }, q.reject);

            }, q.reject);

            return q.promise;
        }

        /**
         * Used to create a directory at the given path.
         * 
         * If the directory does not exist, it will still return successfully.
         * The directory must be completely empty, or the call will fail.
         * 
         * The path is relative to the current default root directory.
         * 
         * @param path The path to the directory to examine.
         * @returns A promise of type void.
         */
        public deleteDirectory(path: string): ng.IPromise<void>;

        /**
         * Used to create a directory at the given path.
         * 
         * If the directory does not exist, it will still return successfully.
         * The directory must be completely empty, or the call will fail unless the
         * recursive flag is set to true.
         * 
         * The path is relative to the current default root directory.
         * 
         * @param path The path to the directory to examine.
         * @param recursive If true, will delete all descendant directories and files.
         * @returns A promise of type void.
         */
        public deleteDirectory(path: string, recursive?: boolean): ng.IPromise<void>;

        /**
         * Used to create a directory at the given path.
         * 
         * If the directory does not exist, it will still return successfully.
         * The directory must be completely empty, or the call will fail unless the
         * recursive flag is set to true.
         * 
         * @param path The path to the directory to examine.
         * @param recursive If true, will delete all descendant directories and files.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type void.
         */
        public deleteDirectory(path: string, recursive: boolean, rootPath: string): ng.IPromise<void>;

        /**
         * Used to create a directory at the given path.
         * 
         * If the directory does not exist, it will still return successfully.
         * The directory must be completely empty, or the call will fail unless the
         * recursive flag is set to true.
         * 
         * @param path The path to the directory to examine.
         * @param recursive If true, will delete all descendant directories and files.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type void.
         */
        public deleteDirectory(path: string, recursive?: boolean, rootPath?: string): ng.IPromise<void> {
            var q = this.$q.defer<void>();

            if (!rootPath) {
                rootPath = this.getDefaultRootPath();
            }

            // Default recursive to false so that the caller has to explicitly opt in to this behavior.
            if (recursive == null) {
                recursive = false;
            }

            path = this.preparePath(path);

            this.directoryExists(path, rootPath).then(function (exists: boolean) {

                // If the directory we are attempting to delete doesn't exist, then
                // return without failing.
                if (!exists) {
                    q.resolve();
                }

                if (typeof(window.resolveLocalFileSystemURL) === "undefined") {
                    q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                    return q.promise;
                }

                window.resolveLocalFileSystemURL(rootPath, function (rootEntry: DirectoryEntry) {

                    var flags: Flags = {
                        create: false,
                        exclusive: false
                    };

                    rootEntry.getDirectory(path, flags, function (entry: DirectoryEntry) {

                        if (recursive) {
                            entry.removeRecursively(q.resolve, q.reject);
                        }
                        else {
                            entry.remove(q.resolve, q.reject);
                        }

                    }, q.reject);

                }, q.reject);

            }, q.reject);

            return q.promise;
        }

        /**
         * Used to delete the given directory.
         * 
         * @param directory The directory to delete.
         * @returns A promise of type void.
         */
        public deleteDirectoryUsingEntry(directory: DirectoryEntry): ng.IPromise<void> {
            var q = this.$q.defer<void>();

            directory.remove(q.resolve, q.reject);

            return q.promise;
        }

        /**
         * Used to delete the given directories.
         * 
         * @param directories The directories to delete.
         * @returns A promise of type void.
         */
        public deleteDirectoriesUsingEntries(directories: DirectoryEntry[]): ng.IPromise<void> {
            var q = this.$q.defer<void>(),
                promises: ng.IPromise<void>[] = [];

            // Kick off a delete of each of the directories.
            directories.forEach((directory: DirectoryEntry) => {
                var promise: ng.IPromise<void>;

                promise = this.deleteDirectoryUsingEntry(directory);

                // Save off the promise, so we know when to complete.
                promises.push(promise);
            });

            // Once all of the I/O operations have completed, then we can finish.
            this.$q.all(promises).then(() => { q.resolve(); }, () => { q.reject(); });

            return q.promise;
        }

        /**
         * Used to delete a file at the given path.
         * 
         * If the file does not exist, it will still return successfully.
         * 
         * The path is relative to the current default root directory.
         * 
         * @param path The path to the file to delete.
         * @returns A promise of type void.
         */
        public deleteFile(path: string): ng.IPromise<void>;

        /**
         * Used to delete a file at the given path.
         * 
         * If the file does not exist, it will still return successfully.
         * 
         * @param path The path to the file to delete.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type void.
         */
        public deleteFile(path: string, rootPath: string): ng.IPromise<void>;

        /**
         * Used to delete a file at the given path.
         * 
         * If the file does not exist, it will still return successfully.
         * 
         * @param path The path to the file to delete.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type void.
         */
        public deleteFile(path: string, rootPath?: string): ng.IPromise<void> {
            var q = this.$q.defer<void>();

            if (!rootPath) {
                rootPath = this.getDefaultRootPath();
            }

            path = this.preparePath(path);

            this.fileExists(path, rootPath).then(function (exists: boolean) {

                // If the file we are attempting to delete doesn't exist, then
                // return without failing.
                if (!exists) {
                    q.resolve();
                }

                if (typeof(window.resolveLocalFileSystemURL) === "undefined") {
                    q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                    return q.promise;
                }

                window.resolveLocalFileSystemURL(rootPath, function (rootEntry: DirectoryEntry) {

                    var flags: Flags = {
                        create: false,
                        exclusive: false
                    };

                    rootEntry.getFile(path, flags, function (entry: FileEntry) {

                        entry.remove(q.resolve, q.reject);

                    }, q.reject);

                }, q.reject);

            }, q.reject);

            return q.promise;
        }

        /**
         * Used to delete the given file.
         * 
         * @param file The file to delete.
         * @returns A promise of type void.
         */
        public deleteFileUsingEntry(file: FileEntry): ng.IPromise<void> {
            var q = this.$q.defer<void>();

            file.remove(q.resolve, q.reject);

            return q.promise;
        }

        /**
         * Used to delete the given files.
         * 
         * @param files The files to delete.
         * @returns A promise of type void.
         */
        public deleteFilesUsingEntries(files: FileEntry[]): ng.IPromise<void> {
            var q = this.$q.defer<void>(),
                promises: ng.IPromise<void>[] = [];

            var promise: ng.IPromise<void>;

            // Kick off a delete of each of the files.
            files.forEach((file: FileEntry) => {

                promise = this.deleteFileUsingEntry(file);

                // Save off the promise, so we know when to complete.
                promises.push(promise);
            });

            // Once all of the I/O operations have completed, then we can finish.
            this.$q.all(promises).then(() => { q.resolve(); }, () => { q.reject(); });

            return q.promise;
        }

        /**
         * Used to check if a file exists at the given path.
         * 
         * The path is relative to the current default root directory.
         * 
         * @param path The path to the file check.
         * @returns A promise of type boolean; true if the file exists, false otherwise.
         */
        public fileExists(path: string): ng.IPromise<boolean>;

        /**
         * Used to check if a file exists at the given path.
         * 
         * @param path The path to the file check.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type boolean; true if the file exists, false otherwise.
         */
        public fileExists(path: string, rootPath: string): ng.IPromise<boolean>;

        /**
         * Used to check if a file exists at the given path.
         * 
         * @param path The path to the file check.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type boolean; true if the file exists, false otherwise.
         */
        public fileExists(path: string, rootPath?: string): ng.IPromise<boolean> {
            var q = this.$q.defer<boolean>();

            if (!rootPath) {
                rootPath = this.getDefaultRootPath();
            }

            path = this.preparePath(path);

            if (typeof(window.resolveLocalFileSystemURL) === "undefined") {
                q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                return q.promise;
            }

            window.resolveLocalFileSystemURL(rootPath, function (rootEntry: DirectoryEntry) {
                var flags: Flags;

                flags = {
                    create: false,
                    exclusive: false
                };

                rootEntry.getFile(path, flags, function (entry: FileEntry) {
                    // If we were able to get a file, then it exists.
                    q.resolve(true);
                }, function () {
                    // If we weren't able to get a file, then it doesn't exist.
                    q.resolve(false);
                });

            }, q.reject);

            return q.promise;
        }

        /**
         * Used to check if a directory exists at the given path.
         * 
         * The path is relative to the current default root directory.
         * 
         * @param path The path to the directory check.
         * @returns A promise of type boolean; true if the directory exists, false otherwise.
         */
        public directoryExists(path: string): ng.IPromise<boolean>;

        /**
         * Used to check if a directory exists at the given path.
         * 
         * @param path The path to the directory check.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type boolean; true if the directory exists, false otherwise.
         */
        public directoryExists(path: string, rootPath: string): ng.IPromise<boolean>;

        /**
         * Used to check if a directory exists at the given path.
         * 
         * @param path The path to the directory check.
         * @param rootPath The root path to which the given path will be relative to.
         * @returns A promise of type boolean; true if the directory exists, false otherwise.
         */
        public directoryExists(path: string, rootPath?: string): ng.IPromise<boolean> {
            var q = this.$q.defer<boolean>();

            if (!rootPath) {
                rootPath = this.getDefaultRootPath();
            }

            path = this.preparePath(path);

            if (typeof(window.resolveLocalFileSystemURL) === "undefined") {
                q.reject(new Error("window.resolveLocalFileSystemURL was not available; ensure that the Cordova file plugin (cordova-plugin-file) is installed properly."));
                return q.promise;
            }

            window.resolveLocalFileSystemURL(rootPath, function (rootEntry: DirectoryEntry) {
                var flags: Flags;

                flags = {
                    create: false,
                    exclusive: false
                };

                rootEntry.getDirectory(path, flags, function (entry: DirectoryEntry) {
                    // If we were able to get a directory, then it exists.
                    q.resolve(true);
                }, function () {
                    // If we weren't able to get a directory, then it doesn't exist.
                    q.resolve(false);
                });

            }, q.reject);

            return q.promise;
        }
    }
}
