/* eslint-disable prettier/prettier */
/**
 * @fileoverview Main entry point for the SPAC (Statistical Analysis Center) Vue.js application.
 * This file configures the Vue instance with all necessary plugins, polyfills, and global settings.
 *
 * @author ICJIA
 * @since 1.0.0
 */

import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "@/plugins/vuetify";
import "@/filters";
import "@/css/app.css";

// import AOS from "aos";
// import "aos/dist/aos.css";

/**
 * Polyfill for NodeList.forEach() method to ensure compatibility with older browsers.
 * Adds Array.prototype.forEach functionality to NodeList objects if not natively supported.
 *
 * @function
 * @returns {boolean} Returns false if forEach is already supported, undefined otherwise
 */
(function() {
  if (typeof NodeList.prototype.forEach === "function") return false;
  NodeList.prototype.forEach = Array.prototype.forEach;
})();

/**
 * Polyfill for Element.matches() method to ensure compatibility with Internet Explorer.
 * Falls back to msMatchesSelector for IE support.
 *
 * @function
 */
(function() {
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector;
  }
})();

// Vue plugin imports and configurations
import browserDetect from "vue-browser-detect-plugin";
import VueMeta from "vue-meta";
import VueAnalytics from "vue-analytics";
import VueRouterBackButton from "vue-router-back-button";

/**
 * Configure browser detection plugin for Vue.
 * Provides browser information in Vue components via this.$browserDetect.
 */
Vue.use(browserDetect);

/**
 * Configure Vue Meta plugin for managing document head metadata.
 * Enables dynamic management of page titles, meta tags, and other head elements.
 *
 * @param {Object} options - Plugin configuration options
 * @param {boolean} options.refreshOnceOnNavigation - Refresh meta tags once per navigation
 */
Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true,
});

/**
 * Configure Google Analytics tracking for the application.
 * Only sends tracking data in production environment.
 *
 * @param {Object} config - Analytics configuration
 * @param {string} config.id - Google Analytics tracking ID
 * @param {Object} config.debug - Debug configuration
 * @param {boolean} config.debug.sendHitTask - Whether to send hits in current environment
 */
Vue.use(VueAnalytics, {
  id: "UA-150580082-1",
  debug: {
    sendHitTask: process.env.NODE_ENV === "production",
  },
});

/**
 * Configure router back button functionality.
 * Provides browser-like back button behavior for Vue Router.
 *
 * @param {Object} config - Back button configuration
 * @param {VueRouter} config.router - Vue Router instance
 */
Vue.use(VueRouterBackButton, { router });

// Disable Vue production tip in console
Vue.config.productionTip = false;

/**
 * Configure NProgress loading bar settings.
 * Disables the spinner component for a cleaner loading experience.
 */
// eslint-disable-next-line no-undef
NProgress.configure({ showSpinner: false });

/**
 * Create and mount the main Vue application instance.
 * Integrates router, store, Vuetify, and renders the root App component.
 * The main Vue application instance.
 *
 * @type {Vue}
 */
new Vue({
  router,
  store,
  // created() {
  //   AOS.init();
  // },
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
