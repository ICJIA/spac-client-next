const { MD5 } = require("crypto-js");
const config = require("@/config.json");

const getHash = salt => {
  let hash = MD5(salt).toString();
  return hash;
};

const checkIfValidPage = arr => {
  if (arr) {
    return !!arr.length;
  } else {
    return 0;
  }
};

const stripHTML = str => {
  if (!str) return;
  let regex = /(<([^>]+)>)/gi;
  return str.replace(regex, "");
};

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

const getOffset = function(el) {
  var _x = 0;
  var _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
};

const truncate = function(string, maxWords = 10) {
  if (!string) return;
  let strippedString = string.trim();
  let array = strippedString.split(" ");
  let wordCount = array.length;
  string = array.splice(0, maxWords).join(" ");

  if (wordCount > maxWords) {
    string += "...";
  }

  return string;
};

const strapiEnumToObject = function(contentType, strapiEnum) {
  let content = config.strapiEnums[contentType] || [
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
  let content = config.strapiEnums[contentType] || [
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
    let elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
      elements[i].setAttribute(attribute, text);
    }
  };
};

const formatDate = function(date) {
  var monthNames = [
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

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + " " + monthNames[monthIndex] + " " + year;
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
  formatDate
};
