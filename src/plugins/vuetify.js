/**
 * @fileoverview Vuetify plugin configuration for the SPAC application.
 * Sets up Vuetify UI framework with custom theme colors and Material Design Icons.
 * Defines the primary color scheme and component styling for the application.
 */

/* eslint-disable no-undef */
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

/**
 * Vuetify configuration options.
 * Defines theme colors, icon font, and other UI framework settings.
 *
 * @type {Object}
 * @property {Object} icons - Icon configuration
 * @property {string} icons.iconfont - Icon font to use (Material Design Icons)
 * @property {Object} theme - Theme configuration
 * @property {Object} theme.themes - Theme definitions
 * @property {Object} theme.themes.light - Light theme color palette
 */
const opts = {
  icons: {
    iconfont: "mdi" // default - only for display purposes
  },
  theme: {
    themes: {
      light: {
        primary: "#6A1B9A", // SPAC purple
        secondary: "#7B20A2", // Darker purple
        accent: "#3f51b5", // Blue accent
        error: "#e91e63", // Pink error
        warning: "#ffc107", // Amber warning
        info: "#03a9f4", // Light blue info
        success: "#4caf50" // Green success
      }
    }
  }
};

/**
 * Configured Vuetify instance with SPAC theme and settings.
 *
 * @type {Vuetify}
 */
export default new Vuetify(opts);
