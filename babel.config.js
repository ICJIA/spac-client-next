/**
 * @fileoverview Babel configuration for the SPAC Vue.js application.
 * Configures JavaScript transpilation presets for browser compatibility.
 *
 * @author ICJIA
 * @since 1.0.0
 */

/**
 * Babel configuration object.
 * Defines presets for transpiling modern JavaScript to browser-compatible code.
 *
 * @type {Object}
 * @property {string[]} presets - Array of Babel presets to apply
 */
module.exports = {
  presets: ["@vue/cli-plugin-babel/preset", "@babel/preset-env"]
};
