/**
 * @fileoverview Download service for the SPAC application.
 * Provides functions to handle file downloads from both internal file server
 * and external URLs. Opens files in new tabs with security attributes.
 *
 * @author ICJIA
 * @since 1.0.0
 */

/* eslint-disable no-unused-vars */
const config = require("@/config.json");
import { EventBus } from "@/event-bus.js";

/**
 * Downloads a file from the internal file server.
 * Constructs a file server URL with path and name parameters and opens it in a new tab.
 *
 * @function
 * @param {Object} urlObj - File object containing URL and name
 * @param {string} urlObj.url - File path on the server
 * @param {string} urlObj.name - Display name for the file
 * @example
 * getFile({
 *   url: '/uploads/document.pdf',
 *   name: 'Annual Report 2023'
 * });
 */
const getFile = urlObj => {
  const fileserverUrl = `${config.baseURL}/file?path=${
    urlObj.url
  }&name=${encodeURIComponent(urlObj.name)}`;
  // console.log(fileserverUrl);
  // location.href = fileserverUrl;
  window.open(fileserverUrl, "_blank,noreferrer,noopener");
};

/**
 * Opens an external file URL in a new tab.
 * Used for files hosted outside the application's file server.
 *
 * @function
 * @param {string} url - External URL to open
 * @example
 * getExternalFile('https://example.com/document.pdf');
 */
const getExternalFile = url => {
  // location.href = url;
  window.open(url, "_blank,noreferrer,noopener");
};

export { getFile, getExternalFile };
