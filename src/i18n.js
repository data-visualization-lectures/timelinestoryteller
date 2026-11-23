/**
 * UI text in the viewer's language.
 *
 * The language follows the dataviz.jp shared resolver (window.DatavizLocale) when it is loaded:
 * ?lang=, an /en path, the "locale" cookie, the html lang attribute, then the browser language.
 * English is the source language; other languages are looked up by the English text.
 */
var d3 = require("d3");

var dictionaries = {
  ja: require("./locales/ja")
};

var currentLocale;

function normalize(value) {
  var lang = String(value || "").trim().toLowerCase();
  if (lang === "ja" || lang.indexOf("ja-") === 0) {
    return "ja";
  }
  if (lang === "en" || lang.indexOf("en-") === 0) {
    return "en";
  }
  return null;
}

/**
 * Resolves the language in the same order as the shared resolver, for pages that do not load it
 * @returns {string} "ja" or "en"
 */
function fallbackResolve() {
  var found = null;
  try {
    var query = window.location.search.match(/[?&]lang=([^&#]*)/);
    found = normalize(query && decodeURIComponent(query[1]));
    if (!found && /^\/en(\/|$)/.test(window.location.pathname)) {
      found = "en";
    }
    if (!found) {
      var cookie = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/);
      found = normalize(cookie && decodeURIComponent(cookie[1]));
    }
    if (!found) {
      found = normalize(document.documentElement.lang);
    }
    if (!found) {
      found = normalize(window.navigator.language || window.navigator.userLanguage);
    }
  } catch (e) {
    found = null;
  }
  return found || "ja";
}

/**
 * The language of the UI
 * @returns {string} "ja" or "en"
 */
function locale() {
  if (!currentLocale) {
    var resolved = null;
    if (typeof window !== "undefined") {
      if (window.DatavizLocale && typeof window.DatavizLocale.resolve === "function") {
        resolved = window.DatavizLocale.resolve();
      } else if (typeof window.dvzResolveLocale === "function") {
        resolved = window.dvzResolveLocale();
      } else {
        resolved = fallbackResolve();
      }
    }
    currentLocale = resolved === "en" ? "en" : "ja";
  }
  return currentLocale;
}

/**
 * Translates UI text
 * @param {string} text The English text
 * @param {Object} [values] Values for {placeholders} in the text
 * @returns {string} The text in the UI language
 */
function t(text, values) {
  var dictionary = dictionaries[locale()];
  var result = dictionary && Object.prototype.hasOwnProperty.call(dictionary, text) ? dictionary[text] : text;
  if (values) {
    Object.keys(values).forEach(function (key) {
      result = result.split("{" + key + "}").join(values[key]);
    });
  }
  return result;
}

t.locale = locale;

// moment format strings used for axis labels, and their Japanese counterparts
var JA_DATE_FORMATS = {
  "hA": "H時",
  "MMM D hA": "M月D日 H時",
  "MMM D": "M月D日",
  "MMM Do": "M月D日",
  "MMM 'YY": "YYYY年M月",
  "MMM": "M月",
  "Do": "D日"
};
var JA_DAYS = ["日", "月", "火", "水", "木", "金", "土"];
var EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Formats a date for a label
 * @param {object} m A moment
 * @param {string} format The moment format string for English
 * @returns {string} The formatted date in the UI language
 */
t.date = function (m, format) {
  if (locale() !== "ja") {
    return m.format(format);
  }
  if (format === "ddd") {
    return JA_DAYS[m.day()];
  }
  if (format === "dddd, MMMM Do, YYYY") {
    return m.format("YYYY年M月D日") + "(" + JA_DAYS[m.day()] + ")";
  }
  return m.format(JA_DATE_FORMATS[format] || format);
};

/**
 * Labels a year before the common era
 * @param {number} year The number of years BC, as a positive number
 * @returns {string} The label
 */
t.bc = function (year) {
  return locale() === "ja" ? "紀元前" + year + "年" : year + " BC";
};

/**
 * Labels a year of the common era on an axis that also shows years BC
 * @param {number} year The year
 * @returns {string} The label
 */
t.ad = function (year) {
  return locale() === "ja" ? "西暦" + year + "年" : year + " AD";
};

/**
 * The name of a segment for display. Segments are keyed by their English names, which saved stories store.
 * @param {string} key The segment key, e.g. "1900s", "41 / 26", "10-26 (Oct)" or "Oct 5th"
 * @returns {string} The name in the UI language
 */
t.segment = function (key) {
  if (locale() !== "ja" || typeof key !== "string") {
    return key;
  }
  var match;
  if ((match = key.match(/^(-?\d+)s$/))) { // eslint-disable-line no-cond-assign
    return match[1] + "年代";
  }
  if ((match = key.match(/^(\d{2}) \/ (\d{2})$/))) { // eslint-disable-line no-cond-assign
    return (+match[1]) + "週/" + match[2];
  }
  if ((match = key.match(/^(\d{2})-(\d{2}) \(\w+\)$/))) { // eslint-disable-line no-cond-assign
    return match[2] + "年" + (+match[1]) + "月";
  }
  if ((match = key.match(/^(\w{3}) (\d+)(st|nd|rd|th)$/)) && EN_MONTHS.indexOf(match[1]) !== -1) { // eslint-disable-line no-cond-assign
    return (EN_MONTHS.indexOf(match[1]) + 1) + "月" + match[2] + "日";
  }
  return key;
};

var timeFormats = {};

/**
 * A tick format for time axes in the UI language, or undefined to keep d3's default (English)
 * @returns {function} A function that formats a date according to the interval it falls on
 */
t.timeTickFormat = function () {
  if (locale() !== "ja") {
    return undefined;
  }
  function format(specifier, date) {
    timeFormats[specifier] = timeFormats[specifier] || d3.timeFormat(specifier);
    return timeFormats[specifier](date);
  }
  return function (date) {
    if (d3.timeSecond(date) < date) {
      return format(".%L", date);
    } else if (d3.timeMinute(date) < date) {
      return format(":%S", date);
    } else if (d3.timeHour(date) < date) {
      return format("%H:%M", date);
    } else if (d3.timeDay(date) < date) {
      return format("%-H時", date);
    } else if (d3.timeMonth(date) < date) {
      return d3.timeWeek(date) < date ? format("%-d日", date) : format("%-m月%-d日", date);
    } else if (d3.timeYear(date) < date) {
      return format("%-m月", date);
    }
    return format("%Y", date);
  };
};

module.exports = t;
