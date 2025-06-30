/**
 * @fileoverview Vue CLI configuration file for the SPAC application.
 * Configures build settings, transpilation options, and plugin configurations.
 *
 * @author ICJIA
 * @since 1.0.0
 */

/**
 * Vue CLI configuration object.
 *
 * @type {Object}
 * @property {string[]} transpileDependencies - Dependencies to transpile through Babel
 * @property {Object} pluginOptions - Configuration for Vue CLI plugins
 * @property {Object} pluginOptions.moment - Moment.js plugin configuration
 * @property {string[]} pluginOptions.moment.locales - Locales to include in Moment.js bundle
 */
module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    moment: {
      locales: ["en"]
    }
  }
};
