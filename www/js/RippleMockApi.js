

/**
 * This script is loaded very early, before all other frameworks. It allows us to perform
 * special customization for the Apache Ripple in-browser emulator.
 */
(function() {

    var apisToIgnore,
        originalBridgeExecFn,
        isRunningInRipple;

    isRunningInRipple = window.top && window.top.ripple;

    /**
     * These are the APIs for the services that we want to ignore (eg suppress the "cheeseburger"
     * dialog) when they are invoked. These APIs don't exist when running in a real browser.
     */
    apisToIgnore = {
        "File": ["requestAllPaths"],
        "StatusBar": ["_ready"]
    };


    if (isRunningInRipple) {

        // Save off a reference to the Ripple's original bridge function.
        originalBridgeExecFn = window.top.ripple("platform/cordova/2.0.0/bridge").exec;

        // Override the bridge module (which is for emulating the script-to-native API bridge).
        // The default implementation shows an annoying "cheeseburger" dialog which is supposed
        // to allow a developer to specify the JSON to return to bridge calls that do not have
        // a native API available when running in the browser. We just want to suppress the dialog.
        window.top.ripple("platform/cordova/2.0.0/bridge").exec = function (success, fail, service, action, args) {

            if (apisToIgnore[service] && apisToIgnore[service].indexOf(action) > -1) {
                // If this service/action combination was in our ignore list, then
                // we'll do nothing for now.
            }
            else {
                // Otherwise, we'll delegate to the original bridge function.
                originalBridgeExecFn(success, fail, service, action, args);
            }
        };
    }

})();