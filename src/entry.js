/**
 * @fileoverview Application entry point for the SPAC Vue.js application.
 * This file serves as the main entry point and handles browser compatibility.
 * Currently loads the main application directly, with legacy IE detection code commented out.
 *
 * @author ICJIA
 * @since 1.0.0
 */

// Legacy Internet Explorer detection and fallback code (currently disabled)
// if (isIE()) {
//   var banner = "";
//   banner = banner + "<div style='text-align: center; margin-top: 50px'>";
//   banner = banner + "<img src='/icjia-logo.png' alt='ICJIA Logo'>";
//   banner = banner + "</div>";
//   banner =
//     banner +
//     "<div style='font-family: Lato, sans-serif; margin-top: 50px; padding-top: 20px; padding-bottom:20px; background: #eee; text-align: center'>";

//   banner =
//     banner +
//     "<h1>The <a href='/'>Adult Redeploy Illinois website</a> does not support Internet Explorer.";
//   banner =
//     banner +
//     "<br><br>Please upgrade to a modern, secure browser such as <a href='https://www.google.com/chrome/'>Chrome</a>, <a href='https://www.mozilla.org/en-US/firefox/new/'>Firefox</a>, or <a href='https://www.microsoft.com/en-us/windows/microsoft-edge'>MS Edge</a>.</h1>";
//   banner = banner + "</div>";

//   document.querySelector("#app").innerHTML = banner;
// } else require("./main");

/**
 * Legacy Internet Explorer detection function (currently disabled).
 * Detects IE 10 and below via MSIE user agent string.
 * Detects IE 11 via Trident user agent string.
 *
 * @function
 * @returns {boolean} True if Internet Explorer is detected
 */
// function isIE() {
//   const isIE10orLess = window.navigator.userAgent.indexOf("MSIE") > -1;
//   const isIE11 = window.navigator.userAgent.indexOf("Trident/") > -1;
//   return isIE10orLess || isIE11;
// }

/**
 * Load the main application module.
 * This bypasses the IE detection and loads the Vue.js application directly.
 */
require("./main");
