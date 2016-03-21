
// Native Node Modules
var path = require("path");

// Other Node Modules
var KarmaServer = require("karma").Server;

/**
 * Run all of the unit tests once and then exit.
 * 
 * A Karma test server instance must be running first (eg karma start).
 */
module.exports = function(gulp, plugins) {

    return function(cb) {

        var configFile = path.resolve(process.cwd(), "karma.conf.js");

        var server = new KarmaServer({
            configFile: configFile,
            singleRun: true
        }, function (err, result) {
            // When a non-zero code is returned by Karma something went wrong.
            cb(err === 0 ? null : new Error("There are failing unit tests"));
        });

        server.start();
    };
};
