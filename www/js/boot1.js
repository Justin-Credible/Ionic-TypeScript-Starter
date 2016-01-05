
/*globals JustinCredible, chrome*/

// Here any special logic can be executed before boostrapping the application.

// If we are running as a Chrome extension, then we'll inject some CSS to set the pop-up width.
if (typeof (chrome) !== "undefined" && typeof (chrome.runtime) !== "undefined" && typeof (chrome.runtime.id) !== "undefined") {
    var style, css;
    style = document.createElement("style");
    style.type = "text/css";
    css = "body { width: 320px; height: 568px; }";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
}

// Invoke the second level boot loader.
JustinCredible.SampleApp.Boot2.boot();
