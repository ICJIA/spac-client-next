/**
 * @fileoverview Vue filters for the SPAC application.
 * Provides global filters for date formatting, text manipulation, and data transformation.
 * All filters are registered globally and available in all Vue templates.
 */

import Vue from "vue";

// const slug = require("slug");
// slug.defaults.mode = "rfc3986";
import moment from "moment";

/**
 * Formats a date string into a human-readable format.
 * Converts dates to "Month Day, Year" format with timezone correction.
 *
 * @param {string|Date} d - Date string or Date object to format
 * @returns {string} Formatted date string (e.g., "January 15, 2023")
 */
Vue.filter("format", function(d) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }
  const t = new Date(d);
  /**
   *
   * Timezone offset correction:
   * https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off/31732581#31732581
   *
   */
  const target = new Date(
    t.getTime() + Math.abs(t.getTimezoneOffset() * 60000)
  );
  const date = target.getDate();
  const month = target.getMonth();
  const year = target.getFullYear();
  // const monthDateYear = pad(month + 1) + '/' + pad(date) + '/' + year
  const dateWithFullMonthName =
    monthNames[month] + " " + pad(date) + ", " + year;
  return dateWithFullMonthName;
});

/**
 * Converts a string to title case (first letter of each word capitalized).
 *
 * @param {string} str - String to convert to title case
 * @returns {string} Title case string
 */
Vue.filter("titleCase", function(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
});

/**
 * Converts a string to uppercase.
 *
 * @param {string} str - String to convert to uppercase
 * @returns {string} Uppercase string
 */
Vue.filter("upperCase", function(str) {
  return str.toUpperCase();
});

/**
 * Converts a string to lowercase.
 *
 * @param {string} str - String to convert to lowercase
 * @returns {string} Lowercase string
 */
Vue.filter("lowerCase", function(str) {
  return str.toLowerCase();
});

// Vue.filter("deSlugify", function(str) {
//   return str.replace(/-/g, " ");
// });

// Vue.filter("slugify", function(str) {
//   return slug(str);
// });

/**
 * Truncates a string to a specified number of words.
 * Adds ellipsis (...) if the string was truncated.
 *
 * @param {string} string - String to truncate
 * @param {number} maxWords - Maximum number of words to keep
 * @returns {string} Truncated string with ellipsis if needed
 */
Vue.filter("truncate", function(string, maxWords) {
  const strippedString = string.trim();
  const array = strippedString.split(" ");
  const wordCount = array.length;
  string = array.splice(0, maxWords).join(" ");

  if (wordCount > maxWords) {
    string += "...";
  }

  return string;
});

/**
 * Formats a timestamp to time and date format.
 *
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} Formatted string (e.g., "2:30:45 pm, January 1st 2023")
 */
Vue.filter("timeDateFormat", function(timestamp) {
  return moment(timestamp).format("h:mm:ss a, MMMM Do YYYY ");
});

/**
 * Formats a timestamp to date and time format.
 *
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} Formatted string (e.g., "01/15/23, 2:30:45 pm")
 */
Vue.filter("dateTimeFormat", function(timestamp) {
  return moment(timestamp).format("MM/DD/YY, h:mm:ss a ");
});

/**
 * Formats a timestamp to date format.
 *
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} Formatted date string (e.g., "January 1st, 2023")
 */
Vue.filter("dateFormat", function(timestamp) {
  return moment(timestamp).format("MMMM Do, YYYY");
});

/**
 * Formats a timestamp to relative time format.
 *
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} Relative time string (e.g., "2 hours ago", "in 3 days")
 */
Vue.filter("timeAgoFormat", function(timestamp) {
  return moment(timestamp).fromNow();
});

/**
 * Formats a timestamp to year format.
 *
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} Year string (e.g., "2023")
 */
Vue.filter("yearFormat", function(timestamp) {
  return moment(timestamp).format("YYYY");
});
