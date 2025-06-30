/**
 * @fileoverview Markdown service for the SPAC application.
 * Provides markdown-to-HTML rendering functionality with support for
 * named headers and custom attributes. Uses markdown-it with configured plugins.
 *
 * @author ICJIA
 * @since 1.0.0
 */

/* eslint-disable no-unused-vars */
const config = require("@/config.json");
import { EventBus } from "@/event-bus.js";

const namedHeaders = require("markdown-it-named-headers");
const attrs = require("markdown-it-attrs/markdown-it-attrs.browser.js");

/**
 * Markdown-it instance configured with application settings and plugins.
 * Includes named headers plugin for automatic header ID generation
 * and attrs plugin for custom HTML attributes in markdown.
 *
 * @type {MarkdownIt}
 */
const md = require("markdown-it")(config.markdownIt);
md.use(namedHeaders);
md.use(attrs);

/**
 * Renders markdown content to HTML.
 * Processes markdown text through the configured markdown-it instance
 * with all enabled plugins and returns sanitized HTML.
 *
 * @function
 * @param {string} markdown - Markdown content to render
 * @returns {string} Rendered HTML content
 * @example
 * const html = renderToHtml('# Header\n\nSome **bold** text.');
 * // Returns: '<h1 id="header">Header</h1>\n<p>Some <strong>bold</strong> text.</p>\n'
 */
const renderToHtml = function(markdown) {
  return md.render(markdown);
};

export { renderToHtml };
