
/*globals JustinCredible*/

/**
 * This is the first level boot loader. Here we can handle any special case logic that needs
 * to be executed before we bootstrap the rest of the application.
 */
(function () {

    // Record the original hashtag used to launch the app.
    JustinCredible.SampleApp.Boot2.setInitialRoute(window.location.hash);

    // Ensure the hashtag is empty when launch the app. If a hashtag route is present Angular
    // will pick it up and attempt to load the first route. This causes the document ready event
    // to be delayed until the first route has finished (which could be a long amount of time
    // if the first route is loading images etc). This delay would then delay $ionicPlatform's
    // ready event and therefore our own Application.start() event to execute after the first
    // view has been loaded.
    if (window.location.hash) {
        window.location.hash = "";
    }

    // Now bootstrap the application differently depending on if the app is built as a website or not.
    if (window.buildVars.config.isWebPlatform) {

        // If we're on the web, we need to wait until all of our resources have finished loading
        // asynchronously and handle hiding the loader screen before we continue booting. We'll
        // check twice every second until all three bundles have been loaded before continuing.

        var loaderInterval = setInterval(function () {

            // Once all three bundles have loaded, stop checking, hide the splash, and boot.
            if (window.__css_loaded && window.__lib_loaded && window.__js_loaded) {

                clearInterval(loaderInterval);

                // Hide the splash screen element if one is present.

                var splashElement = document.getElementById("web_splash")

                if (splashElement) {
                    splashElement.style.display = "none";
                }

                // Invoke the second level boot loader.
                JustinCredible.SampleApp.Boot2.boot();

                // Now manually bootstrap Angular with the body element.
                angular.bootstrap(document.body, ["JustinCredible.SampleApp.Application"]);
            }

        }, 500);
    }
    else {
        // If this is NOT a website then we can immediately continue booting because in a Cordova etc
        // we have loaded resources synchronously from disk (via file:// protocol) everything will be
        // available and loaded at this point.

        // Invoke the second level boot loader.
        JustinCredible.SampleApp.Boot2.boot();
    }

})();
