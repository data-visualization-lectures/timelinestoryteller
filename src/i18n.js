/**
 * UI text in the viewer's language.
 *
 * The language follows the dataviz.jp shared resolver (window.DatavizLocale) when it is loaded:
 * ?lang=, an /en path, the "locale" cookie, the html lang attribute, then the browser language.
 * English is the source language; other languages are looked up by the English text.
 */
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

module.exports = t;
