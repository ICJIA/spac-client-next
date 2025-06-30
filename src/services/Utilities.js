/**
 * @fileoverview Utility functions for the SPAC application.
 * Provides common helper functions for string manipulation, validation,
 * DOM operations, date formatting, and Strapi enum handling.
 *
 * @author ICJIA
 * @since 1.0.0
 */

const { MD5 } = require("crypto-js");
const config = require("@/config.json");

/**
 * Generates an MD5 hash from a string.
 *
 * @function
 * @param {string} str - String to hash
 * @returns {string} MD5 hash of the input string
 * @example
 * const hash = getHash('hello world');
 * // Returns: '5d41402abc4b2a76b9719d911017c592'
 */
const getHash = str => {
  const hash = MD5(str).toString();
  return hash;
};

/**
 * Checks if an array represents a valid page (has content).
 *
 * @function
 * @param {Array} arr - Array to validate
 * @returns {boolean|number} True if array has length, 0 if null/undefined
 * @example
 * checkIfValidPage([1, 2, 3]); // Returns: true
 * checkIfValidPage([]); // Returns: false
 * checkIfValidPage(null); // Returns: 0
 */
const checkIfValidPage = arr => {
  if (arr) {
    return !!arr.length;
  } else {
    return 0;
  }
};

/**
 * Removes HTML tags from a string.
 *
 * @function
 * @param {string} str - String containing HTML tags
 * @returns {string|undefined} String with HTML tags removed, undefined if no input
 * @example
 * stripHTML('<p>Hello <strong>world</strong></p>');
 * // Returns: 'Hello world'
 */
const stripHTML = str => {
  if (!str) return;
  const regex = /(<([^>]+)>)/gi;
  return str.replace(regex, "");
};

/**
 * Converts a string to title case (first letter of each word capitalized).
 *
 * @function
 * @param {string} str - String to convert
 * @returns {string|undefined} Title case string, undefined if no input
 * @example
 * titleCase('hello world example');
 * // Returns: 'Hello World Example'
 */
const titleCase = str => {
  if (!str) return;
  return str
    .toLowerCase()
    .split(" ")
    .map(function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

/**
 * Gets the absolute position of a DOM element.
 * Calculates the cumulative offset from the top-left corner of the document.
 *
 * @function
 * @param {HTMLElement} el - DOM element to get position for
 * @returns {Object} Object with top and left position values
 * @returns {number} returns.top - Distance from top of document
 * @returns {number} returns.left - Distance from left of document
 * @example
 * const position = getOffset(document.getElementById('myElement'));
 * // Returns: { top: 150, left: 200 }
 */
const getOffset = function(el) {
  let _x = 0;
  let _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
};

/**
 * Truncates a string to a specified number of words.
 * Adds ellipsis (...) if the string was truncated.
 *
 * @function
 * @param {string} string - String to truncate
 * @param {number} [maxWords=10] - Maximum number of words to keep
 * @returns {string|undefined} Truncated string with ellipsis if needed, undefined if no input
 * @example
 * truncate('This is a very long sentence with many words', 5);
 * // Returns: 'This is a very long...'
 */
const truncate = function(string, maxWords = 10) {
  if (!string) return;
  const strippedString = string.trim();
  const array = strippedString.split(" ");
  const wordCount = array.length;
  string = array.splice(0, maxWords).join(" ");

  if (wordCount > maxWords) {
    string += "...";
  }

  return string;
};

const strapiEnumToObject = function(contentType, strapiEnum) {
  const content = config.strapiEnums[contentType] || [
    {
      slug: null,
      title: null,
      enum: null
    }
  ];

  return content.filter(e => {
    return e.enum === strapiEnum;
  });
};

const strapiSlugToObject = function(contentType, strapiSlug) {
  const content = config.strapiEnums[contentType] || [
    {
      slug: null,
      title: null,
      enum: null
    }
  ];

  return content.filter(e => {
    return e.slug === strapiSlug;
  });
};

const addAttributeToElement = function(className, attribute, text) {
  return function() {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
      elements[i].setAttribute(attribute, text);
    }
  };
};

const dateFormat = function(d) {
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
};

export {
  getHash,
  titleCase,
  checkIfValidPage,
  stripHTML,
  truncate,
  getOffset,
  strapiEnumToObject,
  strapiSlugToObject,
  addAttributeToElement,
  dateFormat
};
