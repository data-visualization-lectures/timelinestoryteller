(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3"), require("moment"));
	else if(typeof define === 'function' && define.amd)
		define(["d3", "moment"], factory);
	else if(typeof exports === 'object')
		exports["TimelineStoryteller"] = factory(require("d3"), require("moment"));
	else
		root["TimelineStoryteller"] = factory(root["d3"], root["moment"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 23);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var d3 = __webpack_require__(0);
var globals = __webpack_require__(2);
var log = __webpack_require__(5)("TimelineStoryteller:utils");
var _nextId = 0;

/**
 * Provides a set of utility functions
 */
var utils = {

  /**
   * Creates a d3 selection with the correct parent selector
   * @param {d3.Selection} selector The selector to select
   * @returns {d3.Selection} d3 selection bound to the parent
   */
  selectWithParent: function selectWithParent(selector) {
    return d3.select(".timeline_storyteller" + (selector ? " " + selector : ""));
  },

  /**
   * Creates a d3 selection with the correct parent selector
   * @param {d3.Selection} selector The selector to select
   * @returns {d3.Selection} d3 selection bound to the parent
   */
  selectAllWithParent: function selectAllWithParent(selector) {
    return d3.selectAll(".timeline_storyteller" + (selector ? " " + selector : ""));
  },

  /**
   * A function which will return the next unique id within a session.
   * @returns {number} The next unique id
   */
  nextId: function nextId() {
    return _nextId++;
  },

  /**
   * Gets the highest id being used in the list of items
   * @param {{ id: number }[]} list The list of items to look through
   * @returns {number} The highest id
   */
  getHighestId: function getHighestId(list) {
    var highestId = 0;
    (list || []).forEach(function (n) {
      if (n.id > highestId) {
        highestId = n.id;
      }
    });
    return highestId;
  },

  /**
   * Logs an event that occurred
   * @param {string} detail The detailed information for the event
   * @param {string} [category=annotation] The category of the event
   * @returns {void}
   */
  logEvent: function logEvent(detail, category) {
    log(detail);
    var log_event = {
      event_time: new Date().valueOf(),
      event_category: category || "annotation",
      event_detail: detail
    };
    globals.usage_log.push(log_event);
  },

  /**
   * Creates a tweening function for an arc
   * @param {d3.svg.arc} arc The arc to create the tweening function for
   * @returns {function} A tweening function.
   */
  arcTween: function arcTween(arc) {
    var cmdRegEx = /[mlhvcsqtaz][^mlhvcsqtaz]*/ig;

    // The gist is, basically if we are just transitioning between two states, then we
    // update the arc flags to match between the start and end states so the interpolate function doesn't try to interpolate the flags
    // problem being, if it interpolates the flags, sometimes it can generate values that aren't 0 or 1, but like .2398
    return function (d, idx, a) {
      var finalValue = arc.call(this, d, idx, a);
      var finalMatches = finalValue.match(cmdRegEx) || [];
      var initialMatches = (d3.select(this).attr("d") || "").match(cmdRegEx) || [];
      if (finalMatches.length === initialMatches.length) {
        for (var i = 0; i < finalMatches.length; i++) {
          var finalMatch = finalMatches[i];
          var startMatch = initialMatches[i];
          var command = finalMatch[0];
          // We've got an arc command
          if ((command === "A" || command === "a") && finalMatch[i] === startMatch[i]) {
            var finalParts = finalMatch.substring(1).split(/[\s\,]/);
            var startParts = startMatch.substring(1).split(/[\s\,]/);

            // Large arc flag
            startParts[3] = finalParts[3];

            // sweep flag
            startParts[4] = finalParts[4];

            initialMatches[i] = command + startParts.join(" ");
            finalMatches[i] = command + finalParts.join(" ");
          }
        }
      } else {
        return function () {
          return finalValue;
        };
      }
      return d3.interpolate(initialMatches.join(""), finalMatches.join(""));
    };
  },

  /**
   * Creates a debounced function
   * @param {function} fn The function to debounce
   * @param {number} [delay=100] The debounce delay
   * @returns {function} The debounced function
   */
  debounce: function debounce(fn, delay) {
    var timeout;
    return function () {
      var args = Array.prototype.slice.call(arguments, 0);
      var that = this;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        fn.apply(that, args);
      }, delay || 500);
    };
  },

  /**
   * Provides a very basic deep clone of an object, functions get directly copied over
   * @param {Object} obj The object to clone
   * @returns {Object} The clone
   */
  clone: function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (obj === null || (typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object") return obj;

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = utils.clone(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = utils.clone(obj[attr]);
        }
      }
      return copy;
    }
  },

  /**
   * Sets the scale value for the given category
   * @param {d3.Scale} scale The scale to change
   * @param {string} category The category to change
   * @param {object} value The value to set the category to
   * @returns {void}
   */
  setScaleValue: function setScaleValue(scale, category, value) {
    var temp_palette = scale.range();
    var target = temp_palette.indexOf(scale(category));
    temp_palette[target] = value;
    scale.range(temp_palette);
  },

  /**
   * Adds a listener on a transition for when the transition is complete
   * @param {d3.Transition} transition The transition to listen for completion
   * @param {Function} callback The callback for when the transition is complete
   * @returns {void}
   */
  onTransitionComplete: function onTransitionComplete(transition) {
    // if (typeof callback !== "function") throw new Error("Wrong callback in onTransitionComplete");
    return new Promise(function (resolve) {
      if (transition.size() === 0) {
        resolve();
      }
      var n = 0;
      transition.each(function () {
        return ++n;
      }).on("end.onTransitionComplete", function () {
        if (! --n) {
          resolve();
        }
      });
    });
  },

  /**
   * Converts a data url into a object url
   * @param {string} dataURL The data url to convert
   * @returns {string} The object url
   */
  dataURLtoObjectURL: function dataURLtoObjectURL(dataURL) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var dataURLParts = dataURL.split(",");
    var byteString = dataURLParts[0].indexOf("base64") >= 0 ? atob(dataURLParts[1]) : decodeURIComponent(dataURLParts[1]);

    // separate out the mime component
    var type = dataURLParts[0].split(":")[1].split(";")[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    var blob = new Blob([ia], { type: type });
    return URL.createObjectURL(blob);
  },

  /**
   * Converts an image url to a data URL
   * @param {string} url The url of the image
   * @returns {Promise<string>} A dataurl containing the image
   */
  imageUrlToDataURL: function imageUrlToDataURL(url) {
    var img = new Image();
    img.crossOrigin = "anonymous";
    return new Promise(function (resolve, reject) {
      img.onload = function () {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        canvas.width = this.width;
        canvas.height = this.height;

        // step 3, resize to final size
        ctx.drawImage(img, 0, 0);

        try {
          resolve(canvas.toDataURL());
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = function () {
        reject();
      };
      img.src = url;
    });
  },

  /**
   * Resizes the given image to the given size
   * @param {string} url The url of the image
   * @param {number} width The final width of the image
   * @param {number} height The final height of the image
   * @param {boolean} [preserve=true] True if the aspect ratio should be preserved
   * @returns {Promise<string>} A dataurl containing the image
   */
  resizeImage: function resizeImage(url, width, height, preserve) {
    var img = new Image();
    img.crossOrigin = "anonymous";
    preserve = preserve === undefined ? true : preserve;

    return new Promise(function (resolve, reject) {
      img.onload = function () {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        // https://stackoverflow.com/questions/19262141/resize-image-with-javascript-canvas-smoothly
        // Perform the resize in two steps to produce a higher quality resized image

        // set size proportional to image if there is no height passed to it, otherwise just use the height
        if (preserve) {
          if (width >= height) {
            height = width * (img.height / img.width);
          } else {
            width = height * (img.width / img.height);
          }
        }

        canvas.width = width;
        canvas.height = height;

        // step 1 - resize to 50%
        var oc = document.createElement("canvas");
        var octx = oc.getContext("2d");

        oc.width = img.width * 0.5;
        oc.height = img.height * 0.5;
        octx.drawImage(img, 0, 0, oc.width, oc.height);

        // step 2 - resize 50% of step 1
        octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

        // step 3, resize to final size
        ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5, 0, 0, width, height);

        try {
          resolve(canvas.toDataURL());
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = function () {
        reject();
      };
      img.src = url;
    });
  },

  /**
   * Removes the elements of a transition when it ends; use as transition.call(utils.removeOnEnd).
   * transition.remove() now keeps an element while a transition of any other name is running on it;
   * this removes it when this transition ends, as d3 v3 did.
   * @param {d3.Transition} transition The transition whose elements to remove
   * @returns {void}
   */
  removeOnEnd: function removeOnEnd(transition) {
    transition.on("end.removeOnEnd", function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    });
  },

  /**
   * Sets several attributes at once; use as selection.call(utils.attrs({ name: value }))
   * @param {Object} map Attribute values (or functions) by attribute name
   * @returns {function} A function that applies the attributes to a selection or transition
   */
  attrs: function attrs(map) {
    return function (selection) {
      Object.keys(map).forEach(function (name) {
        selection.attr(name, map[name]);
      });
    };
  },

  /**
   * Sets several styles at once; use as selection.call(utils.styles({ name: value }))
   * @param {Object} map Style values (or functions) by style name
   * @returns {function} A function that applies the styles to a selection or transition
   */
  styles: function styles(map) {
    return function (selection) {
      Object.keys(map).forEach(function (name) {
        selection.style(name, map[name]);
      });
    };
  },

  /**
   * The Sunday-based week of the year (0-53) of a date, as d3 v3's d3.time.weekOfYear
   * @param {Date} date The date
   * @returns {number} The week number
   */
  weekOfYear: function weekOfYear(date) {
    var year = d3.timeYear(date);
    var dayOfYear = Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);
    return Math.floor((dayOfYear + year.getDay()) / 7);
  },

  /**
   * Tick values for a linear or time scale, spaced as d3 v3 spaced them.
   * Later versions of d3 round the tick step slightly differently, which changes which labels appear.
   * @param {d3.Scale} scale A linear or time scale
   * @param {number} count The approximate number of ticks
   * @returns {Array} The tick values, or null to leave the choice to the scale (log scales)
   */
  ticks: function ticks(scale, count) {
    if (typeof scale.base === "function") {
      return null;
    }
    var domain = scale.domain();
    var isTime = domain[0] instanceof Date;
    var start = Math.min(+domain[0], +domain[domain.length - 1]);
    var stop = Math.max(+domain[0], +domain[domain.length - 1]);
    var year = 31536e6;

    // the tick step d3 v3 chose for a linear extent
    function linearStep(span) {
      var step = Math.pow(10, Math.floor(Math.log(span / count) / Math.LN10));
      var err = count / span * step;
      if (err <= 0.15) {
        step *= 10;
      } else if (err <= 0.35) {
        step *= 5;
      } else if (err <= 0.75) {
        step *= 2;
      }
      return step;
    }

    if (!(stop > start)) {
      return scale.ticks(count);
    }

    if (isTime) {
      // spans shorter than about ten years use calendar intervals, which did not change
      if ((stop - start) / count <= year) {
        return scale.ticks(count);
      }
      return scale.ticks(d3.timeYear.every(Math.max(1, Math.round(linearStep((stop - start) / year)))));
    }

    var step = linearStep(stop - start);
    var first = Math.ceil(start / step) * step;
    var last = Math.floor(stop / step) * step + step * 0.5;
    // scale to integers while stepping, as d3 v3 did, to avoid accumulating rounding error
    var k = 1;
    while (step * k % 1) {
      k *= 10;
    }
    var values = [];
    for (var i = 0; first * k + step * k * i < last * k; i++) {
      values.push((first * k + step * k * i) / k);
    }
    return values;
  },

  /**
   * Whether a character is drawn about as wide as it is tall (CJK ideographs, kana, hangul, full-width forms)
   * @param {string} ch A single character
   * @returns {boolean} true if the character is a wide character
   */
  isWideChar: function isWideChar(ch) {
    return (/[\u1100-\u115F\u2E80-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFF60\uFFE0-\uFFE6]/.test(ch)
    );
  },

  /**
   * Estimates the rendered width of a piece of text
   * @param {string} text The text to measure
   * @param {number} narrowWidth The width of a narrow (e.g. Latin) character
   * @param {number} wideWidth The width of a wide (e.g. CJK) character
   * @returns {number} The estimated width in pixels
   */
  estimateTextWidth: function estimateTextWidth(text, narrowWidth, wideWidth) {
    var width = 0;
    String(text).split("").forEach(function (ch) {
      width += utils.isWideChar(ch) ? wideWidth : narrowWidth;
    });
    return width;
  },

  /**
   * The initial width of a text box, wide enough for short text and capped for long text
   * @param {string} text The text shown in the box
   * @param {number} narrowWidth The width of a narrow character
   * @param {number} wideWidth The width of a wide character
   * @param {number} minWidth The smallest width of the box
   * @param {number} maxWidth The largest initial width of the box
   * @returns {number} The width in pixels
   */
  textBoxWidth: function textBoxWidth(text, narrowWidth, wideWidth, minWidth, maxWidth) {
    return Math.min(maxWidth, Math.max(minWidth, utils.estimateTextWidth(text, narrowWidth, wideWidth)));
  },

  /**
   * The initial width of an event label
   * @param {string} text The label text
   * @returns {number} The width in pixels
   */
  labelWidth: function labelWidth(text) {
    return utils.textBoxWidth(text, 10, 14, 40, 100);
  },

  /**
   * The initial width of a caption
   * @param {string} text The caption text
   * @returns {number} The width in pixels
   */
  captionWidth: function captionWidth(text) {
    return utils.textBoxWidth(text, 10, 20, 60, 200);
  },

  /**
   * Splits text into pieces that a line may be broken between.
   * Text breaks at whitespace, and also between wide characters, which are written without spaces.
   * @param {string} text The text to split
   * @returns {{text: string, space: boolean}[]} The pieces; space is true if a space precedes the piece
   */
  splitForWrapping: function splitForWrapping(text) {
    var pieces = [];
    var closing = "、。，．・：；！？）］｝」』】〉》ー々ぁぃぅぇぉっゃゅょァィゥェォッャュョ";
    String(text).split(/\s+/).forEach(function (word) {
      var current = "";
      var first = true;
      var push = function push() {
        if (current !== "") {
          pieces.push({ text: current, space: first && pieces.length > 0 });
          first = false;
          current = "";
        }
      };
      word.split("").forEach(function (ch) {
        if (!utils.isWideChar(ch)) {
          if (current !== "" && utils.isWideChar(current.charAt(current.length - 1))) {
            push();
          }
          current += ch;
        } else if (closing.indexOf(ch) !== -1 && current !== "") {
          current += ch;
        } else {
          push();
          current = ch;
        }
      });
      push();
    });
    return pieces;
  },

  /**
   * Shortens text so that its estimated width fits the available length
   * @param {string} text The text to shorten
   * @param {number} available The available length in pixels
   * @param {number} narrowWidth The width of a narrow character
   * @param {number} wideWidth The width of a wide character
   * @returns {string} The text, cut where it would no longer fit
   */
  fitText: function fitText(text, available, narrowWidth, wideWidth) {
    var width = 0;
    var result = "";
    String(text).split("").some(function (ch) {
      width += utils.isWideChar(ch) ? wideWidth : narrowWidth;
      if (width > available) {
        return true;
      }
      result += ch;
      return false;
    });
    return result;
  }
};

module.exports = utils;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var imageUrls = __webpack_require__(3);
var d3 = __webpack_require__(0);
var tr = __webpack_require__(4);
var u;
var globals = {};

// global dimensions
function reset() {
  _extends(globals, {
    margin: { top: 100, right: 50, bottom: 105, left: 50 },
    padding: { top: 100, right: 50, bottom: 105, left: 50 },
    effective_filter_width: u,
    effective_filter_height: u,
    width: u,
    height: u,

    // initialize global variables
    date_granularity: u,
    segment_granularity: u,
    usage_log: [],
    max_num_tracks: u,
    max_num_seq_tracks: u,
    legend_panel: u,
    legend: u,
    legend_rect_size: u,
    legend_spacing: u,
    legend_expanded: true,
    legend_x: 100,
    legend_y: 100,
    source: u,
    source_format: u,
    earliest_date: u,
    latest_start_date: u,
    latest_end_date: u,
    categories: u, // scale for event types
    selected_categories: [],
    num_categories: u,
    max_legend_item_width: 0,
    facets: u, // scale for facets (timelines)
    num_facets: u,
    selected_facets: [],
    total_num_facets: u,
    num_facet_rows: u,
    num_facet_cols: u,
    segments: u, // scale for segments
    present_segments: u,

    /**
     * The selected date granularities used for filtering
     */
    selected_segments: [],
    num_segments: u,
    num_segment_cols: u,
    num_segment_rows: u,
    buffer: 25,
    time_scale: u, // scale for time (years)
    timeline_facets: u,
    num_tracks: u,
    num_seq_tracks: u,
    global_min_start_date: u,
    global_max_end_date: u,
    max_end_age: u,
    max_seq_index: u,
    dispatch: d3.dispatch("Emphasize", "remove"),
    filter_result: u,
    scales: [{ "name": "Chronological", "icon": imageUrls("s-chron.png"), "hint": tr("A <span class='rb_hint_scale_highlight'>CHRONOLOGICAL</span> scale is useful for showing absolute dates and times, like 2017, or 1999-12-31, or 6:37 PM.") }, { "name": "Relative", "icon": imageUrls("s-rel.png"), "hint": tr("A <span class='rb_hint_scale_highlight'>RELATIVE</span> scale is useful when comparing <span class='rb_hint_layout_highlight'>Faceted</span> timelines with a common baseline at time 'zero'.For example, consider a timeline of person 'A' who lived between 1940 to 2010 and person 'B' who lived between 1720 and 1790. A <span class='rb_hint_scale_highlight'>Relative</span> scale in this case would span from 0 to 70 years.") }, { "name": "Log", "icon": imageUrls("s-log.png"), "hint": tr("A base-10 <span class='rb_hint_scale_highlight'>LOGARITHMIC</span> scale is useful for long-spanning timelines and a skewed distributions of events.  This scale is compatible with a <span class='rb_hint_rep_highlight'>Linear</span> representation.") }, { "name": "Sequential", "icon": imageUrls("s-seq.png"), "hint": tr("A <span class='rb_hint_scale_highlight'>SEQUENTIAL</span> scale is useful for showing simply the order and number of events.") }, { "name": "Collapsed", "icon": imageUrls("s-intdur.png"), "hint": tr("A <span class='rb_hint_scale_highlight'>COLLAPSED</span> scale is a hybrid between <span class='rb_hint_scale_highlight'>Sequential</span> and <span class='rb_hint_scale_highlight'>Chronological</span>, and is useful for showing uneven distributions of events. It is compatible with a <span class='rb_hint_rep_highlight'>Linear</span> representation and <span class='rb_hint_layout_highlight'>Unified</span> layout. The duration between events is encoded as the length of bars.") }],
    layouts: [{ "name": "Unified", "icon": imageUrls("l-uni.png"), "hint": tr("A <span class='rb_hint_layout_highlight'>UNIFIED</span> layout is a single uninterrupted timeline and is useful when your data contains no facets.") }, { "name": "Faceted", "icon": imageUrls("l-fac.png"), "hint": tr("A <span class='rb_hint_layout_highlight'>FACETED</span> layout is useful when you have multiple timelines to compare.") }, { "name": "Segmented", "icon": imageUrls("l-seg.png"), "hint": tr("A <span class='rb_hint_layout_highlight'>SEGMENTED</span> layout splits a timeline into meaningful segments like centuries or days, depending on the extent of your timeline.It is compatible with a <span class='rb_hint_scale_highlight'>Chronological</span> scale and is useful for showing patterns or differences across segments, such as periodicity.") }],
    representations: [{ "name": "Linear", "icon": imageUrls("r-lin.png"), "hint": tr("A <span class='rb_hint_rep_highlight'>LINEAR</span> representation is read left-to-right and is the most familiar timeline representation.") }, { "name": "Radial", "icon": imageUrls("r-rad.png"), "hint": tr("A <span class='rb_hint_rep_highlight'>RADIAL</span> representation is useful for showing cyclical patterns. It has the added benefit of a square aspect ratio.") }, { "name": "Spiral", "icon": imageUrls("r-spi.png"), "hint": tr("A <span class='rb_hint_rep_highlight'>SPIRAL</span> is a compact and playful way to show a sequence of events. It has a square aspect ratio and is only compatible with a <span class='rb_hint_scale_highlight'>Sequential</span> scale.") }, { "name": "Curve", "icon": imageUrls("r-arb.png"), "hint": tr("A <span class='rb_hint_rep_highlight'>CURVE</span> is a playful way to show a sequence of events. It is only compatible with a <span class='rb_hint_scale_highlight'>Sequential</span> scale and a <span class='rb_hint_layout_highlight'>Unified</span> layout.Drag to draw a curve on the canvas; double click the canvas to reset the curve.") }, { "name": "Calendar", "icon": imageUrls("r-cal.png"), "hint": tr("A month-week-day <span class='rb_hint_rep_highlight'>CALENDAR</span> is a familiar representation that is compatible with a <span class='rb_hint_scale_highlight'>Chronological</span> scale and a <span class='rb_hint_layout_highlight'>Segmented</span> layout. This representation does not currently support timelines spanning decades or longer.") }, { "name": "Grid", "icon": imageUrls("r-grid.png"), "hint": tr("A 10x10 <span class='rb_hint_rep_highlight'>GRID</span> representation is compatible with a <span class='rb_hint_scale_highlight'>Chronological</span> scale and a <span class='rb_hint_layout_highlight'>Segmented</span> layout. This representation is ideal for timelines spanning decades or centuries.") }],
    unit_width: 15,
    track_height: 15 * 1.5,
    spiral_padding: 15 * 1.25,
    spiral_dim: 0,
    centre_radius: 50,
    max_item_index: 0,
    filter_type: "Emphasize",
    active_data: [],
    all_data: [],
    active_event_list: [],
    prev_active_event_list: [],
    all_event_ids: [],
    scenes: [],
    caption_list: [],
    image_list: [],
    annotation_list: [],
    gif_index: 0,
    filter_set_length: 0,
    leader_line_styles: ["Rectangular", "Octoline", "Curved"],
    leader_line_style: 1, // 0=OCTO, 1=RECT, 2=CURVE
    curve: false,
    dirty_curve: false,
    record_width: u,
    record_height: u,
    reader: new FileReader(),
    timeline_json_data: [],
    timeline_story: {},
    // a plain hyphen for negative numbers, as before (d3 now defaults to the minus sign U+2212)
    formatNumber: d3.formatLocale({ decimal: ".", thousands: ",", grouping: [3], currency: ["$", ""], minus: "-" }).format(".0f"),
    range_text: "",
    color_palette: [],
    color_swap_target: 0,
    use_custom_palette: false,
    serverless: false,
    playback_mode: u
  }); // Defined in main.js
}

globals.reset = reset;

reset(); // Set the initial values

globals.formatAbbreviation = function (x) {
  "use strict";

  var v = Math.abs(x);
  if (v >= 0.9995e9) {
    return globals.formatNumber(x / 1e9) + "B";
  } else if (v >= 0.9995e6) {
    return globals.formatNumber(x / 1e6) + "M";
  } else if (v >= 0.9995e3) {
    return globals.formatNumber(x / 1e3) + "k";
  }
  return globals.formatNumber(x);
};

// function for checking if string is a number
globals.isNumber = function (n) {
  "use strict";

  return !isNaN(parseFloat(n)) && isFinite(n);
};

module.exports = globals;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Forms the url for the given image name
 * @param {string} name The name of the image to get the url for
 * @returns {string} The final url for the given image
 */
function formUrl(name) {
  if (name.indexOf("demo") >= 0) {
    return "img/" + name;
  }

  var raw = __webpack_require__(14)("./" + name);
  var imageContents = toArrayBuffer(raw);
  var blob = new Blob([imageContents], {
    type: name.indexOf(".png") >= 0 ? "image/png" : "image/svg+xml"
  });
  return URL.createObjectURL(blob);
}

function toArrayBuffer(str) {
  var buffer = new ArrayBuffer(str.length);
  var array = new Uint8Array(buffer);
  for (var i = 0; i < str.length; i++) {
    array[i] = str.charCodeAt(i);
  }
  return buffer;
}

var imageUrlMapping = {
  "caption.png": formUrl("caption.png"),
  "categories.png": formUrl("categories.png"),
  "check.png": formUrl("check.png"),
  "clear.png": formUrl("clear.png"),
  "close.png": formUrl("close.png"),
  "csv.png": formUrl("csv.png"),
  "delete.png": formUrl("delete.png"),

  /**
   * Demo images
   */
  "demo.png": formUrl("demo.png"),
  "demo_story.png": formUrl("demo_story.png"),

  "draw.png": formUrl("draw.png"),
  "expand.png": formUrl("expand.png"),
  "export.png": formUrl("export.png"),
  "facets.png": formUrl("facets.png"),
  "filter.png": formUrl("filter.png"),
  "gif.png": formUrl("gif.png"),
  "hide.png": formUrl("hide.png"),
  "highlight.png": formUrl("highlight.png"),
  "image.png": formUrl("image.png"),
  "json.png": formUrl("json.png"),
  "l-fac.png": formUrl("l-fac.png"),
  "l-seg.png": formUrl("l-seg.png"),
  "l-uni.png": formUrl("l-uni.png"),
  "min.png": formUrl("min.png"),
  "next.png": formUrl("next.png"),
  "open.png": formUrl("open.png"),
  "pin.png": formUrl("pin.png"),
  "play.png": formUrl("play.png"),
  "png.png": formUrl("png.png"),
  "prev.png": formUrl("prev.png"),
  "q.png": formUrl("q.png"),
  "r-arb.png": formUrl("r-arb.png"),
  "r-cal.png": formUrl("r-cal.png"),
  "r-grid.png": formUrl("r-grid.png"),
  "r-lin.png": formUrl("r-lin.png"),
  "r-rad.png": formUrl("r-rad.png"),
  "r-spi.png": formUrl("r-spi.png"),
  "record.png": formUrl("record.png"),
  "reset.png": formUrl("reset.png"),
  "resetBasic.png": formUrl("resetBasic.png"),
  "s-chron.png": formUrl("s-chron.png"),
  "s-intdur.png": formUrl("s-intdur.png"),
  "s-log.png": formUrl("s-log.png"),
  "s-rel.png": formUrl("s-rel.png"),
  "s-seq.png": formUrl("s-seq.png"),
  "segments.png": formUrl("segments.png"),
  "story.png": formUrl("story.png"),
  "svg.png": formUrl("svg.png"),
  "timeline.png": formUrl("timeline.png"),
  "vl.png": formUrl("vl.png")
};
module.exports = function (imageName) {
  return imageUrlMapping[imageName];
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * UI text in the viewer's language.
 *
 * The language follows the dataviz.jp shared resolver (window.DatavizLocale) when it is loaded:
 * ?lang=, an /en path, the "locale" cookie, the html lang attribute, then the browser language.
 * English is the source language; other languages are looked up by the English text.
 */
var dictionaries = {
  ja: __webpack_require__(27)
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

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(84);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(86)))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? t(exports) :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : t(e.time = {});
}(this, function (e) {
  "use strict";
  function t(e, n, u) {
    function r(t) {
      return e(t = new Date(+t)), t;
    }return r.floor = r, r.round = function (t) {
      var u = new Date(+t),
          r = new Date(t - 1);return e(u), e(r), n(r, 1), r - t > t - u ? u : r;
    }, r.ceil = function (t) {
      return e(t = new Date(t - 1)), n(t, 1), t;
    }, r.offset = function (e, t) {
      return n(e = new Date(+e), null == t ? 1 : Math.floor(t)), e;
    }, r.range = function (t, u, r) {
      var a = [];if (t = new Date(t - 1), u = new Date(+u), r = null == r ? 1 : Math.floor(r), !(u > t)) return a;for (e(t), n(t, 1), u > t && a.push(new Date(+t)); n(t, r), u > t;) {
        a.push(new Date(+t));
      }return a;
    }, r.filter = function (u) {
      return t(function (t) {
        for (; e(t), !u(t);) {
          t.setTime(t - 1);
        }
      }, function (e, t) {
        for (; --t >= 0;) {
          for (; n(e, 1), !u(e);) {}
        }
      });
    }, u && (r.count = function (t, n) {
      return t = new Date(+t), n = new Date(+n), e(t), e(n), Math.floor(u(t, n));
    }), r;
  }function n(e) {
    return t(function (t) {
      t.setHours(0, 0, 0, 0), t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7);
    }, function (e, t) {
      e.setDate(e.getDate() + 7 * t);
    }, function (e, t) {
      return (t - e - 6e4 * (t.getTimezoneOffset() - e.getTimezoneOffset())) / 6048e5;
    });
  }function u(e) {
    return t(function (t) {
      t.setUTCHours(0, 0, 0, 0), t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7);
    }, function (e, t) {
      e.setUTCDate(e.getUTCDate() + 7 * t);
    }, function (e, t) {
      return (t - e) / 6048e5;
    });
  }var r = t(function (e) {
    e.setMilliseconds(0);
  }, function (e, t) {
    e.setTime(+e + 1e3 * t);
  }, function (e, t) {
    return (t - e) / 1e3;
  });e.seconds = r.range;var a = t(function (e) {
    e.setSeconds(0, 0);
  }, function (e, t) {
    e.setTime(+e + 6e4 * t);
  }, function (e, t) {
    return (t - e) / 6e4;
  });e.minutes = a.range;var o = t(function (e) {
    e.setMinutes(0, 0, 0);
  }, function (e, t) {
    e.setTime(+e + 36e5 * t);
  }, function (e, t) {
    return (t - e) / 36e5;
  });e.hours = o.range;var s = t(function (e) {
    e.setHours(0, 0, 0, 0);
  }, function (e, t) {
    e.setDate(e.getDate() + t);
  }, function (e, t) {
    return (t - e - 6e4 * (t.getTimezoneOffset() - e.getTimezoneOffset())) / 864e5;
  });e.days = s.range, e.sunday = n(0), e.sundays = e.sunday.range, e.monday = n(1), e.mondays = e.monday.range, e.tuesday = n(2), e.tuesdays = e.tuesday.range, e.wednesday = n(3), e.wednesdays = e.wednesday.range, e.thursday = n(4), e.thursdays = e.thursday.range, e.friday = n(5), e.fridays = e.friday.range, e.saturday = n(6), e.saturdays = e.saturday.range;var c = e.sunday;e.weeks = c.range;var i = t(function (e) {
    e.setHours(0, 0, 0, 0), e.setDate(1);
  }, function (e, t) {
    e.setMonth(e.getMonth() + t);
  }, function (e, t) {
    return t.getMonth() - e.getMonth() + 12 * (t.getFullYear() - e.getFullYear());
  });e.months = i.range;var f = t(function (e) {
    e.setHours(0, 0, 0, 0), e.setMonth(0, 1);
  }, function (e, t) {
    e.setFullYear(e.getFullYear() + t);
  }, function (e, t) {
    return t.getFullYear() - e.getFullYear();
  });e.years = f.range;var d = t(function (e) {
    e.setUTCMilliseconds(0);
  }, function (e, t) {
    e.setTime(+e + 1e3 * t);
  }, function (e, t) {
    return (t - e) / 1e3;
  });e.utcSeconds = d.range;var g = t(function (e) {
    e.setUTCSeconds(0, 0);
  }, function (e, t) {
    e.setTime(+e + 6e4 * t);
  }, function (e, t) {
    return (t - e) / 6e4;
  });e.utcMinutes = g.range;var y = t(function (e) {
    e.setUTCMinutes(0, 0, 0);
  }, function (e, t) {
    e.setTime(+e + 36e5 * t);
  }, function (e, t) {
    return (t - e) / 36e5;
  });e.utcHours = y.range;var T = t(function (e) {
    e.setUTCHours(0, 0, 0, 0);
  }, function (e, t) {
    e.setUTCDate(e.getUTCDate() + t);
  }, function (e, t) {
    return (t - e) / 864e5;
  });e.utcDays = T.range, e.utcSunday = u(0), e.utcSundays = e.utcSunday.range, e.utcMonday = u(1), e.utcMondays = e.utcMonday.range, e.utcTuesday = u(2), e.utcTuesdays = e.utcTuesday.range, e.utcWednesday = u(3), e.utcWednesdays = e.utcWednesday.range, e.utcThursday = u(4), e.utcThursdays = e.utcThursday.range, e.utcFriday = u(5), e.utcFridays = e.utcFriday.range, e.utcSaturday = u(6), e.utcSaturdays = e.utcSaturday.range;var l = e.utcSunday;e.utcWeeks = l.range;var D = t(function (e) {
    e.setUTCHours(0, 0, 0, 0), e.setUTCDate(1);
  }, function (e, t) {
    e.setUTCMonth(e.getUTCMonth() + t);
  }, function (e, t) {
    return t.getUTCMonth() - e.getUTCMonth() + 12 * (t.getUTCFullYear() - e.getUTCFullYear());
  });e.utcMonths = D.range;var h = t(function (e) {
    e.setUTCHours(0, 0, 0, 0), e.setUTCMonth(0, 1);
  }, function (e, t) {
    e.setUTCFullYear(e.getUTCFullYear() + t);
  }, function (e, t) {
    return t.getUTCFullYear() - e.getUTCFullYear();
  });e.utcYears = h.range, e.second = r, e.minute = a, e.hour = o, e.day = s, e.week = c, e.month = i, e.year = f, e.utcSecond = d, e.utcMinute = g, e.utcHour = y, e.utcDay = T, e.utcWeek = l, e.utcMonth = D, e.utcYear = h;
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**

anotateEvent: //on-demand persistent annotationText label for an event

**/

var imageUrls = __webpack_require__(3);
var d3 = __webpack_require__(0);
var globals = __webpack_require__(2);
var tr = __webpack_require__(4);

var utils = __webpack_require__(1);
var selectWithParent = utils.selectWithParent;
var logEvent = utils.logEvent;
var ellipsize = __webpack_require__(11);

module.exports = function (timeline_vis, annotationText, x_pos, y_pos, x_offset, y_offset, x_anno_offset, y_anno_offset, label_width, item_index, annotationObj) {
  var target;
  // var LINE_OCTO = 0;
  // var LINE_RECT = 1;
  var LINE_CURVE = 2;
  var annotation_buffer = 12.5;

  // Internet Explorer 6-11
  var isIE = /* @cc_on!@*/false || !!document.documentMode;

  // Edge 20+
  var isEdge = !isIE && !!window.StyleMedia;

  if (!isIE && !isEdge) {
    if (timeline_vis.tl_layout() === "Segmented") {
      if (timeline_vis.tl_representation() !== "Radial") {
        target = selectWithParent("#event_g" + item_index + " rect.event_span_component").node();

        // TODO consolidate the duplicate code (7 lines x 4 places below)
        if (target.transform.baseVal.length > 0) {
          x_offset = target.transform.baseVal[0].matrix.e;
          y_offset = target.transform.baseVal[0].matrix.f;
        } else {
          x_offset = 0;
          y_offset = 0;
        }

        x_pos = Math.round(target.x.baseVal.value + x_offset + globals.padding.left + globals.unit_width / 2);
        y_pos = Math.round(target.y.baseVal.value + y_offset + globals.padding.top + globals.unit_width / 2);
      } else {
        target = selectWithParent("#event_g" + item_index + " path.event_span_component").node();

        if (target.transform.baseVal.length > 0) {
          x_offset = target.transform.baseVal[0].matrix.e;
          y_offset = target.transform.baseVal[0].matrix.f;
        } else {
          x_offset = 0;
          y_offset = 0;
        }

        x_pos = Math.round(target.getPointAtLength(-globals.unit_width).x + x_offset + globals.padding.left);
        y_pos = Math.round(target.getPointAtLength(-globals.unit_width).y + y_offset + globals.padding.top);
      }
    } else if (timeline_vis.tl_representation() !== "Radial") {
      target = selectWithParent("#event_g" + item_index + " rect.event_span").node();

      if (target.transform.baseVal.length > 0) {
        x_offset = target.transform.baseVal[0].matrix.e;
        y_offset = target.transform.baseVal[0].matrix.f;
      } else {
        x_offset = 0;
        y_offset = 0;
      }

      x_pos = Math.round(target.x.baseVal.value + x_offset + globals.padding.left + globals.unit_width / 2);
      y_pos = Math.round(target.y.baseVal.value + y_offset + globals.padding.top + globals.unit_width / 2);
    } else {
      target = selectWithParent("#event_g" + item_index + " path.event_span").node();

      if (target.transform.baseVal.length > 0) {
        x_offset = target.transform.baseVal[0].matrix.e;
        y_offset = target.transform.baseVal[0].matrix.f;
      } else {
        x_offset = 0;
        y_offset = 0;
      }

      x_pos = Math.round((target.getPointAtLength(-globals.unit_width).x + target.getPointAtLength(globals.unit_width).x) / 2 + x_offset + globals.padding.left);
      y_pos = Math.round((target.getPointAtLength(-globals.unit_width).y + target.getPointAtLength(globals.unit_width).y) / 2 + y_offset + globals.padding.top);
    }
  }

  var min_label_width = utils.labelWidth(annotationText);

  var leader_line_path = [];
  var drawLeaderLine = d3.line().x(function (d) {
    return d.x;
  }).y(function (d) {
    return d.y;
  });

  if (globals.leader_line_style === LINE_CURVE) {
    drawLeaderLine.curve(d3.curveBasis);
  } else {
    drawLeaderLine.curve(d3.curveLinear);
  }

  // TODO: ID HERE
  var event_annotation = selectWithParent("#main_svg").append("g").attr("class", "event_annotation event_" + item_index + "_annotation").attr("data-id", annotationObj.id).attr("data-type", "annotation").style("opacity", 0);

  event_annotation.on("mouseover", function () {
    d3.select(this).selectAll(".annotation_control").transition().duration(250).style("opacity", 1);
    d3.select(this).select(".annotation_frame").transition().duration(250).style("stroke", "#f00").attr("filter", "url(#drop-shadow)");
  }).on("mouseout", function () {
    d3.select(this).selectAll(".annotation_control").transition().duration(250).style("opacity", 0);
    d3.select(this).select(".annotation_frame").transition().duration(250).style("stroke", "transparent").attr("filter", "none");
  });

  var drag = d3.drag().subject(function () {
    var t = d3.select(this);

    return {
      x: t.attr("x"),
      y: t.attr("y")
    };
  }).on("drag", function (event) {
    x_anno_offset = event.x - x_pos;
    y_anno_offset = event.y - y_pos;

    d3.select(this).attr("x", x_pos + x_anno_offset).attr("y", y_pos + y_anno_offset);

    d3.select(this.parentNode).select(".annotation_frame").attr("x", x_pos + x_anno_offset).attr("y", y_pos + y_anno_offset);

    d3.select(this.parentNode).select(".event_label").selectAll("tspan").attr("x", x_pos + x_anno_offset + 7.5).attr("y", y_pos + y_anno_offset + annotation_buffer);

    d3.select(this.parentNode).selectAll(".frame_resizer").attr("x", x_pos + x_anno_offset + label_width + 7.5).attr("y", y_pos + y_anno_offset);

    d3.select(this.parentNode).selectAll(".annotation_delete").attr("x", x_pos + x_anno_offset + label_width + 7.5 + 20).attr("y", y_pos + y_anno_offset);

    leader_line_path[2] = {
      x: x_pos + x_anno_offset,
      y: y_pos + y_anno_offset + 18
    };
    leader_line_path[1].y = leader_line_path[2].y;
    leader_line_path[1].x = leader_line_path[0].x;

    if (x_pos + x_anno_offset > leader_line_path[0].x) {
      leader_line_path[2].x = x_pos + x_anno_offset;
    } else {
      leader_line_path[2].x = x_pos + x_anno_offset + label_width;
    }

    d3.select(this.parentNode).select(".annotation_line").data([leader_line_path]).attr("d", function (d) {
      return drawLeaderLine(d);
    });

    annotationObj.x_anno_offset = x_anno_offset;
    annotationObj.y_anno_offset = y_anno_offset;
  }).on("end", function () {
    logEvent("event " + item_index + " annotation moved to [" + (x_pos + x_anno_offset) + "," + (y_pos + y_anno_offset) + "]");
  });

  var resize = d3.drag().subject(function () {
    var t = d3.select(this);

    return {
      x: t.attr("x"),
      y: t.attr("y")
    };
  }).on("drag", function (event) {
    d3.select(this).attr("x", d3.max([x_pos + x_anno_offset + label_width + 7.5, x_pos + x_anno_offset + 7.5 + (event.x - (x_pos + x_anno_offset))]));

    label_width = d3.max([min_label_width, event.x - (x_pos + x_anno_offset)]);

    annotationObj.label_width = label_width;

    d3.select(this.parentNode).select(".annotation_frame").attr("width", label_width + 7.5);

    d3.select(this.parentNode).select(".annotation_drag_area").attr("width", label_width + 7.5);

    d3.select(this.parentNode).select(".event_label").attr("x", x_pos + x_anno_offset + 7.5).attr("y", y_pos + y_anno_offset + annotation_buffer).text(annotationText).call(wrap, label_width - 7.5);

    d3.select(this.parentNode).selectAll(".frame_resizer").attr("x", x_pos + x_anno_offset + label_width + 7.5).attr("y", y_pos + y_anno_offset);

    d3.select(this.parentNode).selectAll(".annotation_delete").attr("x", x_pos + x_anno_offset + label_width + 7.5 + 20).attr("y", y_pos + y_anno_offset);

    leader_line_path[2] = {
      x: x_pos + x_anno_offset,
      y: y_pos + y_anno_offset + 18
    };
    leader_line_path[1].y = leader_line_path[2].y;
    leader_line_path[1].x = leader_line_path[0].x;

    if (x_pos + x_anno_offset > leader_line_path[0].x) {
      leader_line_path[2].x = x_pos + x_anno_offset;
    } else {
      leader_line_path[2].x = x_pos + x_anno_offset + label_width;
    }

    d3.select(this.parentNode).select(".annotation_line").data([leader_line_path]).attr("d", function (d) {
      return drawLeaderLine(d);
    });
  }).on("end", function () {
    logEvent("event " + item_index + " annotation resized to " + label_width + "px");
  });

  leader_line_path = [{ x: x_pos, y: y_pos }, { x: x_pos, y: y_pos + y_anno_offset + 18 }, { x: x_pos + x_anno_offset + label_width, y: y_pos + y_anno_offset + 18 }];

  event_annotation.append("path").attr("d", drawLeaderLine(leader_line_path)).attr("class", "annotation_line");

  var annotation_frame = event_annotation.append("rect").attr("class", "annotation_frame").attr("x", x_pos + x_anno_offset).attr("y", y_pos + y_anno_offset).attr("width", label_width + 7.5);

  event_annotation.append("svg:image").attr("class", "annotation_control frame_resizer").attr("title", "resize label").attr("x", x_pos + x_anno_offset + label_width + 7.5).attr("y", y_pos + y_anno_offset).attr("width", 20).attr("height", 20).attr("xlink:href", imageUrls("expand.png")).attr("filter", "url(#drop-shadow)").style("opacity", 0);

  var annotation_resizer = event_annotation.append("rect").attr("class", "annotation_control frame_resizer").attr("x", x_pos + x_anno_offset + label_width + 7.5).attr("y", y_pos + y_anno_offset).attr("width", 20).attr("height", 20).style("opacity", 0).on("mouseover", function () {
    d3.select(this).style("stroke", "#f00");
  }).on("mouseout", function () {
    d3.select(this).style("stroke", "#ccc");
  }).call(resize);

  annotation_resizer.append("title").text(tr("Resize label"));

  event_annotation.append("svg:image").attr("class", "annotation_control annotation_delete").attr("id", "annotation_delete").attr("title", "remove label").attr("x", x_pos + x_anno_offset + label_width + 7.5 + 20).attr("y", y_pos + y_anno_offset).attr("width", 20).attr("height", 20).attr("xlink:href", imageUrls("delete.png")).attr("filter", "url(#drop-shadow)").style("opacity", 0);

  event_annotation.append("rect").attr("class", "annotation_control annotation_delete").attr("x", x_pos + x_anno_offset + label_width + 7.5 + 20).attr("y", y_pos + y_anno_offset).attr("width", 20).attr("height", 20).style("opacity", 0).on("mouseover", function () {
    d3.select(this).style("stroke", "#f00");
  }).on("mouseout", function () {
    d3.select(this).style("stroke", "#ccc");
  }).on("click", function () {
    var corresponding_event = selectWithParent("#event_g" + item_index);

    logEvent("event " + item_index + " annotation removed");

    corresponding_event.datum().selected = false;

    corresponding_event.selectAll(".event_span").attr("filter", "none").style("stroke", "#333").style("stroke-width", "0.25px");

    corresponding_event.selectAll(".event_span_component").style("stroke", "#333").style("stroke-width", "0.25px");

    d3.select(this.parentNode).remove();
  }).append("title").text(tr("Remove label"));

  event_annotation.append("circle").attr("class", "annotation_circle").attr("cx", x_pos).attr("cy", y_pos).attr("r", 2.5);

  var event_label_text = event_annotation.append("text").attr("class", "event_label").attr("x", x_pos + x_anno_offset + 7.5).attr("y", y_pos + y_anno_offset + annotation_buffer).attr("dy", 0).text(annotationText).call(wrap, label_width - 7.5);

  var annotation_drag_area = event_annotation.append("rect").attr("class", "annotation_drag_area").attr("x", x_pos + x_anno_offset).attr("y", y_pos + y_anno_offset).attr("width", label_width + 7.5).on("click", function () {}).call(drag);

  event_label_text.attr("dy", 1 + "em").text(annotationText).call(wrap, label_width - 7.5);

  function wrap(text, width) {
    var pieces = utils.splitForWrapping(text.text()),
        line = "",
        line_number = 0,
        letter_width = 4.5,
        max_letters = Math.max(3, Math.floor(width / letter_width) - 2),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("dy", dy + "em").attr("x", x_pos + x_anno_offset + 7.5).attr("y", y_pos + y_anno_offset + annotation_buffer);
    pieces.forEach(function (piece) {
      var word = utils.isWideChar(piece.text.charAt(0)) ? piece.text : ellipsize(piece.text, max_letters);
      var candidate = line === "" ? word : line + (piece.space ? " " : "") + word;
      tspan.text(candidate);
      if (line !== "" && tspan.node().getComputedTextLength() > width) {
        tspan.text(line);
        line = word;
        tspan = text.append("tspan").attr("x", x_pos + x_anno_offset + 7.5).attr("y", y_pos + y_anno_offset + annotation_buffer).attr("dy", ++line_number + dy + "em").text(word);
      } else {
        line = candidate;
      }
    });
    annotation_frame.attr("height", (line_number + 3) * 12 + "px");
    if (annotation_drag_area !== undefined) {
      annotation_drag_area.attr("height", (line_number + 3) * 12 + "px");
    }
  }

  return {
    element: event_annotation
  };
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var globals = __webpack_require__(2);

module.exports = {

  /**
   * Returns the next available z-index for an annotation
   * @returns {number} The next z-index
   */
  getNextZIndex: function getNextZIndex() {
    var nextIndex = 0;
    (globals.annotation_list || []).concat(globals.caption_list || []).concat(globals.image_list || []).forEach(function (item) {
      if (item.z_index >= nextIndex) {
        nextIndex = item.z_index + 1;
      }
    });
    return nextIndex;
  }
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap) {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
  var base64 = new Buffer(JSON.stringify(sourceMap)).toString('base64');
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

  return '/*# ' + data + ' */';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(79).Buffer))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = {
    ellipse: '…',
    chars: [' ', '-'],
    max: 140,
    truncate: true
};

function ellipsize(str, max, ellipse, chars, truncate) {
    var last = 0,
        c = '';

    if (str.length < max) return str;

    for (var i = 0, len = str.length; i < len; i++) {
        c = str.charAt(i);

        if (chars.indexOf(c) !== -1) {
            last = i;
        }

        if (i < max) continue;
        if (last === 0) {
            return !truncate ? '' : str.substring(0, max - 1) + ellipse;
        }

        return str.substring(0, last) + ellipse;
    }

    return str;
}

module.exports = function(str, max, opts) {
    if (typeof str !== 'string' || str.length === 0) return '';
    if (max === 0) return '';

    opts = opts || {};

    for (var key in defaults) {
        if (opts[key] === null || typeof opts[key] === 'undefined') {
            opts[key] = defaults[key];
        }
    }

    opts.max = max || opts.max;

    return ellipsize(str, opts.max, opts.ellipse, opts.chars, opts.truncate);
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(88);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Styles
 */
__webpack_require__(90);

/**
 * Libraries
 */
var d3 = __webpack_require__(0);
var moment = __webpack_require__(6);

var configurableTL = __webpack_require__(20);
var addCaption = __webpack_require__(15);
var addImage = __webpack_require__(16);
var annotateEvent = __webpack_require__(8);
var colorSchemes = __webpack_require__(19);
var time = __webpack_require__(7);
var GIF = __webpack_require__(25).GIF;
var svgImageUtils = __webpack_require__(26);
var imageUrls = __webpack_require__(3);
var utils = __webpack_require__(1);
var removeOnEnd = utils.removeOnEnd;
var selectWithParent = utils.selectWithParent;
var selectAllWithParent = utils.selectAllWithParent;
var setScaleValue = utils.setScaleValue;
var getHighestId = utils.getHighestId;
var clone = utils.clone;
var debounce = utils.debounce;
var logEvent = utils.logEvent;
var globals = __webpack_require__(2);
var tr = __webpack_require__(4);
var addImagePopup = __webpack_require__(21);
var gif = new GIF({
  workers: 2,
  quality: 10,
  background: "#fff",
  workerScript: URL.createObjectURL(new Blob([__webpack_require__(87)], { type: "text/javascript" })) // Creates a script url with the contents of "gif.worker.js"
});
var getNextZIndex = __webpack_require__(9).getNextZIndex;
var helpUrl = "help.html?lang=" + tr.locale();

/**
 * The selected filter options as [[option, ...]]: the shape the filter events read and that saved stories store
 * @param {d3.Selection} selection A selection of option elements
 * @returns {Array} The option elements in one group
 */
function optionGroups(selection) {
  return [selection.nodes()];
}

/**
 * Describes the time between two dates in words, e.g. "158 years"
 * @param {Date} start The earlier date
 * @param {Date} end The later date
 * @returns {string} The duration in the UI language
 */
function describeDuration(start, end) {
  if (tr.locale() !== "ja") {
    return moment(start).from(moment(end), true);
  }
  var duration = moment.duration(moment(end).diff(moment(start)));
  if (duration.asYears() >= 1) {
    return Math.round(duration.asYears()) + " 年";
  } else if (duration.asMonths() >= 1) {
    return Math.round(duration.asMonths()) + " か月";
  } else if (duration.asDays() >= 1) {
    return Math.round(duration.asDays()) + " 日";
  } else if (duration.asHours() >= 1) {
    return Math.round(duration.asHours()) + " 時間";
  }
  return Math.max(1, Math.round(duration.asMinutes())) + " 分";
}
var log = __webpack_require__(5)("TimelineStoryteller:main");
var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

/**
 * Creates a new TimelineStoryteller component
 * @param {boolean} [isServerless=false] True if the component is being run in a serverless environment (default false)
 * @param {boolean} [showDemo=false] True if the demo code should be shown (default true)
 * @param {HTMLElement} parentElement The element in which the Timeline Storyteller is contained (default: body)
 * @returns {TimelineStoryteller} An instance of the TimelineStoryteller
 */
function TimelineStoryteller(isServerless, showDemo, parentElement) {
  var instance = this;
  var timeline_vis = configurableTL(globals.unit_width, globals.padding);
  parentElement = parentElement || document.body;
  this.parentElement = parentElement;
  this._timeline_vis = timeline_vis;
  this._loaded = false;
  this.scale = 1;
  this._dispatch = d3.dispatch("stateChanged");
  this.on = this._dispatch.on.bind(this._dispatch);
  this.playback_mode = false;
  this._currentSceneIndex = -1;

  var timelineElement = document.createElement("div");
  timelineElement.className = "timeline_storyteller";
  parentElement.appendChild(timelineElement);

  this._colorPicker = __webpack_require__(18)(timelineElement);
  this._container = selectWithParent().append("div").attr("class", "timeline_storyteller-container");
  this._errorArea = this._container.append("div").attr("class", "timeline_storyteller-error");

  this._component_width = parentElement.clientWidth;
  this._component_height = parentElement.clientHeight;
  this._render_width = this._component_width;
  this._render_height = this._component_height;

  this.options = clone(TimelineStoryteller.DEFAULT_OPTIONS);

  globals.serverless = isServerless;

  /**
   * Creates the import panel
   * @returns {void}
   */
  function createImportPanel() {
    var element = selectWithParent().append("div").attr("id", "import_div").attr("class", "control_div").style("top", "25%");

    var panel = {
      visible: true,
      element: element,
      show: function show() {
        panel.visible = true;
        element.style("top", "25%").style("display", "block");
      },
      hide: function hide() {
        panel.visible = false;
        element.style("top", "-210px");
      }
    };
    return panel;
  }

  function showDemoData() {
    return (typeof showDemo === "undefined" || showDemo) && window.timeline_story_demo_data !== undefined;
  }

  function showDemoStory() {
    return (typeof showDemo === "undefined" || showDemo) && window.timeline_story_demo_story !== undefined;
  }

  instance._showDemoStory = showDemoStory;
  instance._showDemoData = showDemoData;

  function adjustSvgSize() {
    main_svg.transition().duration(instance._getAnimationStepDuration()).attr("width", d3.max([globals.width, instance._render_width - globals.margin.left - globals.margin.right - getScrollbarWidth()])).attr("height", d3.max([globals.height, instance._component_height - globals.margin.top - globals.margin.bottom - getScrollbarWidth()]));
  }

  instance._adjustSvgSize = adjustSvgSize;

  Date.prototype.stdTimezoneOffset = function () {
    // eslint-disable-line no-extend-native
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  };

  Date.prototype.dst = function () {
    // eslint-disable-line no-extend-native
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
  };

  window.addEventListener("load", function () {
    logEvent("Initializing Timeline Storyteller");

    instance._onResized(false);
  });

  instance._container.on("scroll", function () {
    var axis = instance._container.select(".timeline_axis");
    axis.select(".domain").attr("transform", function () {
      return "translate(0," + instance._container.node().scrollTop + ")";
    });

    axis.selectAll(".tick text").attr("y", instance._container.node().scrollTop - 6);
  });

  var legendDrag = d3.drag().subject(function () {
    var t = d3.select(this);

    return {
      x: t.attr("x"),
      y: t.attr("y")
    };
  }).on("drag", function (event) {
    var x_pos = event.x;
    var y_pos = event.y;

    if (x_pos < 0) {
      x_pos = 0;
    } else if (x_pos > globals.width - globals.margin.right) {
      x_pos = globals.width - globals.margin.right;
    }

    if (y_pos < 0) {
      y_pos = 0;
    }

    d3.select(this).attr("x", x_pos).attr("y", y_pos);
  }).on("end", function () {
    globals.legend_x = d3.select(this).attr("x");
    globals.legend_y = d3.select(this).attr("y");

    logEvent("legend moved to: " + globals.legend_x + ", " + globals.legend_y, "legend");
  });

  var filterDrag = d3.drag().subject(function () {
    var t = selectWithParent("#filter_div");

    return {
      x: parseInt(t.style("left"), 10),
      y: parseInt(t.style("top"), 10)
    };
  }).on("drag", function (event) {
    var x_pos = event.x;
    var y_pos = event.y;

    if (x_pos < 10 + parseInt(selectWithParent("#menu_div").style("width"), 10) + 10) {
      x_pos = 10 + parseInt(selectWithParent("#menu_div").style("width"), 10) + 10;
    } else if (x_pos >= globals.effective_filter_width) {
      x_pos = globals.effective_filter_width - 10;
    }

    if (y_pos < 180 + parseInt(selectWithParent("#option_div").style("height"), 10) + 20) {
      y_pos = 180 + parseInt(selectWithParent("#option_div").style("height"), 10) + 20;
    } else if (y_pos >= globals.effective_filter_height + 155) {
      y_pos = globals.effective_filter_height + 155;
    }

    selectWithParent("#filter_div").style("left", x_pos + "px").style("top", y_pos + "px");
  }).on("end", function () {
    var filter_x = selectWithParent("#filter_div").style("left");
    var filter_y = selectWithParent("#filter_div").style("top");

    logEvent("filter options moved to: " + filter_x + ", " + filter_y, "filter");
  });

  /**
  --------------------------------------------------------------------------------------
  KEY PRESS EVENTS
  --------------------------------------------------------------------------------------
  **/

  selectWithParent().on("keydown", function (event) {
    if (event.keyCode === 76 && event.altKey) {
      // recover legend
      selectWithParent(".legend").transition().duration(instance._getAnimationStepDuration()).attr("x", 0).attr("y", 0);

      globals.legend_x = 0;
      globals.legend_y = 0;
    }
    if (event.keyCode === 82 && event.altKey) {
      // recover legend
      if (!instance.playback_mode) {
        instance._recordScene();
      }
    } else if (instance.playback_mode && event.keyCode === 39) {
      goNextScene();
    } else if (instance.playback_mode && event.keyCode === 37) {
      goPreviousScene();
    } else if (event.keyCode === 80 && event.altKey) {
      instance.setPlaybackMode(!instance.playback_mode);
    } else if (event.keyCode === 46 && selectWithParent("#caption_div").style("display") === "none" && instance._addImagePopup.hidden() && !instance.importPanel.visible) {
      globals.deleteScene();
    }
  });

  function goNextScene() {
    if (globals.scenes.length < 2) {
      return;
    } else if (instance._currentSceneIndex < globals.scenes.length - 1) {
      instance._currentSceneIndex++;
    } else {
      instance._currentSceneIndex = 0;
    }
    logEvent("scene: " + (instance._currentSceneIndex + 1) + " of " + globals.scenes.length, "playback");

    changeScene(instance._currentSceneIndex);
  }

  function goPreviousScene() {
    if (globals.scenes.length < 2) {
      return;
    }
    if (instance._currentSceneIndex > 0) {
      instance._currentSceneIndex--;
    } else {
      instance._currentSceneIndex = globals.scenes.length - 1;
    }
    logEvent("scene: " + instance._currentSceneIndex + " of " + globals.scenes.length, "playback");

    changeScene(instance._currentSceneIndex);
  }

  // initialize main visualization containers
  var main_svg, export_div, menu_div, filter_div, navigation_div;

  gif.on("finished", function (blob) {
    var saveLink = document.createElement("a");
    var downloadSupported = "download" in saveLink;
    if (downloadSupported) {
      saveLink.download = "timeline_story.gif";
      saveLink.href = URL.createObjectURL(blob);
      saveLink.style.display = "none";
      document.querySelector(".timeline_storyteller").appendChild(saveLink);
      saveLink.click();
      document.querySelector(".timeline_storyteller").removeChild(saveLink);
    } else {
      window.open(URL.createObjectURL(blob), "_temp", "menubar=no,toolbar=no,status=no");
    }

    gif.running = false;
  });

  this.onIntro = true;

  instance.importPanel = createImportPanel();

  export_div = selectWithParent().append("div").attr("id", "export_div").attr("class", "control_div").style("top", -185 + "px");

  menu_div = selectWithParent().append("div").attr("id", "menu_div").attr("class", "control_div");

  var control_panel = instance._control_panel = menu_div.append("g");

  var menuItems = instance.options.menu;
  instance._initializeMenu(menuItems);

  /**
  ---------------------------------------------------------------------------------------
  EXPORT OPTIONS
  ---------------------------------------------------------------------------------------
  **/

  selectWithParent("#export_div").append("input").call(utils.attrs({
    type: "image",
    name: tr("Hide export panel"),
    id: "export_close_btn",
    class: "img_btn_enabled",
    src: imageUrls("close.png"),
    height: 15,
    width: 15,
    title: tr("Hide export panel")
  })).style("margin-top", "5px").on("click", function () {
    selectWithParent("#export_div").style("top", -185 + "px");

    logEvent("hide export panel", "export");
  });

  export_div.append("div").attr("id", "export_boilerplate").html("<span class='boilerplate_title'>" + tr("Export options") + "</span><hr>");

  var export_formats = export_div.append("div").attr("id", "export_formats");

  export_formats.append("input").call(utils.attrs({
    type: "image",
    name: tr("Export PNG"),
    class: "img_btn_enabled export--image",
    src: imageUrls("png.png"),
    height: 30,
    width: 30,
    title: tr("Export PNG")
  })).on("click", function () {
    selectAllWithParent("foreignObject").remove();

    logEvent("exporting main_svg as PNG", "export");

    svgImageUtils.saveSvgAsPng(document.querySelector(".timeline_storyteller #main_svg"), "timeline_image.png", { backgroundColor: "white" });
  });

  export_formats.append("input").call(utils.attrs({
    type: "image",
    name: tr("Export SVG"),
    class: "img_btn_enabled export--image",
    src: imageUrls("svg.png"),
    height: 30,
    width: 30,
    title: tr("Export SVG")
  })).on("click", function () {
    selectAllWithParent("foreignObject").remove();

    logEvent("exporting main_svg as SVG", "export");

    svgImageUtils.saveSvg(document.querySelector(".timeline_storyteller #main_svg"), "timeline_image.svg", { backgroundColor: "white" });
  });

  export_formats.append("input").call(utils.attrs({
    type: "image",
    name: tr("Export animated GIF"),
    class: "img_btn_enabled export--image",
    src: imageUrls("gif.png"),
    height: 30,
    width: 30,
    title: tr("Export animated GIF")
  })).on("click", function () {
    selectAllWithParent("foreignObject").remove();

    gif.frames = [];
    var gif_scenes = globals.scenes;
    if (gif_scenes.length > 0) {
      logEvent("exporting story as animated GIF", "export");

      gif_scenes.sort(function (a, b) {
        return parseFloat(a.s_order) - parseFloat(b.s_order);
      });
      gif_scenes.forEach(function (d, i) {
        var img = document.createElement("img");
        img.style.display = "none";
        img.id = "gif_frame" + i;
        img.src = d.s_src;
        document.querySelector(".timeline_storyteller").appendChild(img);
        selectWithParent("#gif_frame" + i).attr("class", "gif_frame");
        setTimeout(function () {
          gif.addFrame(document.getElementById("gif_frame" + i), { delay: 1500 });
        }, 150);
      });
    } else {
      logEvent("exporting main_svg as GIF", "export");

      svgImageUtils.svgAsPNG(document.querySelector(".timeline_storyteller #main_svg"), -1, { backgroundColor: "white" });

      setTimeout(function () {
        gif.addFrame(document.getElementById("gif_frame-1"));
      }, 150);
    }
    setTimeout(function () {
      gif.render();
      selectAllWithParent(".gif_frame").remove();
    }, 150 + 150 * gif.frames.length);
    gif_scenes = [];
  });

  export_formats.append("input").call(utils.attrs({
    type: "image",
    name: tr("Export story"),
    class: "img_btn_enabled",
    src: imageUrls("story.png"),
    height: 30,
    width: 30,
    title: tr("Export story")
  })).on("click", function () {
    selectAllWithParent("foreignObject").remove();

    logEvent("exporting story as .cdc", "export");

    globals.timeline_story = instance.saveState();

    var story_json = JSON.stringify(globals.timeline_story);
    var blob = new Blob([story_json], { type: "application/json" });
    var url = URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.download = "timeline_story.cdc";
    a.href = url;
    a.textContent = "Download timeline_story.cdc";
    document.querySelector(".timeline_storyteller").appendChild(a);
    a.click();
    document.querySelector(".timeline_storyteller").removeChild(a);
  });

  /**
  ---------------------------------------------------------------------------------------
  OPTIONS DIV
  ---------------------------------------------------------------------------------------
  **/

  selectWithParent().append("div").attr("id", "option_div").attr("class", "control_div");

  /**
  ---------------------------------------------------------------------------------------
  CAPTION OPTIONS
  ---------------------------------------------------------------------------------------
  **/

  selectWithParent().append("div").attr("id", "caption_div").attr("class", "annotation_div control_div").style("display", "none");

  /**
  ---------------------------------------------------------------------------------------
  IMAGE OPTIONS
  ---------------------------------------------------------------------------------------
  **/

  instance._addImagePopup = addImagePopup();
  selectWithParent().node().appendChild(instance._addImagePopup.element.node());
  instance._addImagePopup.on("imageSelected", instance._onAddImageSelected.bind(this));

  /**
  --------------------------------------------------------------------------------------
  DATASETS
  --------------------------------------------------------------------------------------
  **/

  var footer = selectWithParent().append("div").attr("id", "footer");

  footer.append("div").attr("id", "footer_left").html("<span class='footer_text_left'><a title='" + tr("About & getting started") + "' href='" + helpUrl + "' target='_blank'>" + tr("About & getting started") + "</a></span>");

  footer.append("div").attr("id", "footer_right").html("<span class='footer_text'>" + tr("Based on {link}, © Microsoft Corporation, MIT License", {
    link: "<a title='" + tr("Timeline Storyteller on GitHub") + "' href='https://github.com/microsoft/timelinestoryteller' target='_blank'>Timeline Storyteller</a>"
  }) + "</span>");

  var boilerplate = instance.importPanel.element.append("div").attr("id", "boilerplate").html("<span class='boilerplate_title'>Timeline Storyteller</span>");

  boilerplate.append("input").call(utils.attrs({
    type: "image",
    name: tr("Hide import panel"),
    id: "import_close_btn",
    class: "img_btn_enabled",
    src: imageUrls("close.png"),
    height: 15,
    width: 15,
    title: tr("Hide import panel")
  })).style("margin-top", "5px").on("click", function () {
    logEvent("hiding import panel", "load");

    instance.importPanel.hide();
  });

  instance._initializeImportPanel();

  instance.importPanel.element.append("div").attr("class", "loading_data_indicator").style("display", "none").html("<span>" + tr("Loading data...") + "</span>");

  instance.importPanel.element.append("div").attr("id", "disclaimer").html("<span class='disclaimer_title' style='clear:both'>" + tr("An expressive visual storytelling environment for presenting timelines.") + "</span><span class='disclaimer_text'><br><strong>" + tr("A note about privacy") + "</strong>: </span>" + "<span class='disclaimer_text'>" + tr("Your data is processed in your browser and is not uploaded to a server.") + "</span>");

  var timeline_metadata = instance.importPanel.element.append("div").attr("id", "timeline_metadata").style("display", "none");

  timeline_metadata.append("div").attr("id", "timeline_metadata_contents");

  timeline_metadata.append("div").call(utils.attrs({
    id: "draw_timeline",
    class: "img_btn_enabled import_label draw_timeline",
    title: tr("Draw Timeline")
  })).on("click", function () {
    drawTimeline(globals.active_data);

    instance.setPlaybackMode(false, false);

    updateRadioBttns(timeline_vis.tl_scale(), timeline_vis.tl_layout(), timeline_vis.tl_representation());
  }).append("text").attr("class", "boilerplate_title").style("color", "white").style("cursor", "pointer").style("position", "relative").text(tr("Draw this timeline"));

  /**
  --------------------------------------------------------------------------------------
  TIMELINE CONFIG OPTIONS UI
  --------------------------------------------------------------------------------------
  **/

  var option_picker = selectWithParent("#option_div");

  // representation options
  var representation_picker = option_picker.append("div").attr("class", "option_picker").attr("id", "representation_picker");

  representation_picker.append("text").attr("class", "ui_label").text(tr("Timeline representation"));

  var representation_rb = representation_picker.selectAll("div").data(globals.representations).enter();

  var representation_rb_label = representation_rb.append("label").attr("class", "option_rb").on("mouseover", function (event, d) {
    var pos_x = this.getBoundingClientRect().left;
    var offset_x = 0;
    if (pos_x > globals.width / 2) {
      offset_x = pos_x - 235;
    } else {
      offset_x = pos_x + 53;
    }
    var offset_y = this.getBoundingClientRect().top;
    selectWithParent().append("div").attr("id", "rb_hint").style("left", offset_x + "px").style("top", offset_y + "px").attr("class", function () {
      if (pos_x > globals.width / 2) {
        return "rb_hint_right";
      }
      return "rb_hint_left";
    }).style("text-align", function () {
      if (pos_x > globals.width / 2) {
        return "right";
      }
      return "left";
    }).html(d.hint);
  }).on("mouseout", function () {
    selectWithParent("#rb_hint").remove();
  });

  representation_rb_label.append("input").call(utils.attrs({
    type: "radio",
    name: "representation_rb",
    value: function value(d) {
      return d.name;
    }
  })).property("checked", function (d) {
    return d.name === timeline_vis.tl_representation();
  }).property("disabled", true);

  representation_rb_label.append("img").call(utils.attrs({
    height: 40,
    width: 40,
    class: "img_btn_disabled",
    src: function src(d) {
      return d.icon;
    }
  }));

  representation_rb_label.append("span").attr("class", "option_rb_label").text(function (d) {
    return tr(d.name);
  });

  // scale options
  var scale_picker = option_picker.append("div").attr("class", "option_picker").attr("id", "scale_picker");

  scale_picker.append("text").attr("class", "ui_label").text(tr("Scale"));

  var scale_rb = scale_picker.selectAll("div").data(globals.scales).enter();

  var scale_rb_label = scale_rb.append("label").attr("class", "option_rb").on("mouseover", function (event, d) {
    var pos_x = this.getBoundingClientRect().left;
    var offset_x = 0;
    if (pos_x > globals.width / 2) {
      offset_x = pos_x - 235;
    } else {
      offset_x = pos_x + 53;
    }
    var offset_y = this.getBoundingClientRect().top;
    selectWithParent().append("div").attr("id", "rb_hint").style("left", offset_x + "px").style("top", offset_y + "px").attr("class", function () {
      if (pos_x > globals.width / 2) {
        return "rb_hint_right";
      }
      return "rb_hint_left";
    }).style("text-align", function () {
      if (pos_x > globals.width / 2) {
        return "right";
      }
      return "left";
    }).html(d.hint);
  }).on("mouseout", function () {
    selectWithParent("#rb_hint").remove();
  });

  scale_rb_label.append("input").call(utils.attrs({
    type: "radio",
    name: "scale_rb",
    value: function value(d) {
      return d.name;
    }
  })).property("checked", function (d) {
    return d.name === timeline_vis.tl_scale();
  }).property("disabled", true);

  scale_rb_label.append("img").call(utils.attrs({
    height: 40,
    width: 40,
    class: "img_btn_disabled",
    src: function src(d) {
      return d.icon;
    }
  }));

  scale_rb_label.append("span").attr("class", "option_rb_label").text(function (d) {
    return tr(d.name);
  });

  // layout options
  var layout_picker = option_picker.append("div").attr("class", "option_picker").style("border-right", "none").attr("id", "layout_picker");

  layout_picker.append("text").attr("class", "ui_label").text(tr("Layout"));

  var layout_rb = layout_picker.selectAll("div").data(globals.layouts).enter();

  var layout_rb_label = layout_rb.append("label").attr("class", "option_rb").on("mouseover", function (event, d) {
    var pos_x = this.getBoundingClientRect().left;
    var offset_x = 0;
    if (pos_x > globals.width / 2) {
      offset_x = pos_x - 235;
    } else {
      offset_x = pos_x + 53;
    }
    var offset_y = this.getBoundingClientRect().top;
    selectWithParent().append("div").attr("id", "rb_hint").attr("class", function () {
      if (pos_x > globals.width / 2) {
        return "rb_hint_right";
      }
      return "rb_hint_left";
    }).style("left", offset_x + "px").style("top", offset_y + "px").style("text-align", function () {
      if (pos_x > globals.width / 2) {
        return "right";
      }
      return "left";
    }).html(d.hint);
  }).on("mouseout", function () {
    selectWithParent("#rb_hint").remove();
  });

  layout_rb_label.append("input").call(utils.attrs({
    type: "radio",
    name: "layout_rb",
    value: function value(d) {
      return d.name;
    }
  })).property("checked", function (d) {
    return d.name === timeline_vis.tl_layout();
  }).property("disabled", true);

  layout_rb_label.append("img").call(utils.attrs({
    height: 40,
    width: 40,
    class: "img_btn_disabled",
    src: function src(d) {
      return d.icon;
    }
  }));

  layout_rb_label.append("span").attr("class", "option_rb_label").text(function (d) {
    return tr(d.name);
  });

  selectWithParent("#caption_div").append("textarea").call(utils.attrs({
    cols: 37,
    rows: 5,
    placeholder: tr("Caption text"),
    class: "text_input",
    maxlength: 140,
    id: "add_caption_text_input"
  }));

  selectWithParent("#caption_div").append("input").call(utils.attrs({
    type: "image",
    name: tr("Add Caption"),
    id: "add_caption_btn",
    class: "img_btn_enabled",
    src: imageUrls("check.png"),
    height: 20,
    width: 20,
    title: tr("Add Caption")
  })).on("click", function () {
    selectWithParent("#caption_div").style("display", "none");
    var caption = selectWithParent("#add_caption_text_input").property("value");
    logEvent("caption added: \"" + caption + "\"", "annotation");

    var highestCaptionId = getHighestId(globals.caption_list);

    var caption_list_item = {
      id: highestCaptionId + 1,
      caption_text: caption,
      x_rel_pos: 0.5,
      y_rel_pos: 0.25,
      caption_width: utils.captionWidth(caption),
      z_index: getNextZIndex()
    };

    globals.caption_list.push(caption_list_item);

    addCaption(caption, utils.captionWidth(caption), 0.5, 0.25, caption_list_item);
    selectWithParent("#add_caption_text_input").property("value", "");
  });

  /**
  --------------------------------------------------------------------------------------
  MAIN PREPROCESSING
  --------------------------------------------------------------------------------------
  **/

  function loadTimeline(state, skipConfig) {
    instance._loaded = false;

    instance._hideError();

    var loadDataIndicator = selectWithParent(".loading_data_indicator");
    loadDataIndicator.style("display", "block");

    // Allow the user to configure the timeline first
    if (!skipConfig) {
      instance.importPanel.show();
    } else {
      instance.importPanel.hide();
    }

    instance._component_width = parentElement.clientWidth;
    instance._component_height = parentElement.clientHeight;

    instance.onIntro = false;

    // Give it some time to render the "load data" indicator
    return new Promise(function (resolve) {
      setTimeout(function () {
        try {
          selectWithParent("#disclaimer").style("display", "none");
          selectWithParent("#timeline_metadata_contents").html("");
          control_panel.selectAll("input").attr("class", "img_btn_disabled");
          selectWithParent("#filter_type_picker").selectAll("input").property("disabled", true);
          selectWithParent("#filter_type_picker").selectAll("img").attr("class", "img_btn_disabled");
          selectWithParent("#playback_bar").selectAll("img").attr("class", "img_btn_disabled");
          selectAllWithParent(".option_rb").select("input").property("disabled", "true");
          selectAllWithParent(".option_rb").select("img").attr("class", "img_btn_disabled");
          selectAllWithParent(".option_rb img").style("border", "2px solid transparent");
          selectWithParent("#menu_div").style("left", -50 + "px");
          selectWithParent("#navigation_div").style("bottom", -100 + "px");
          globals.use_custom_palette = false;

          if (main_svg !== undefined) {
            // console.clear();
            main_svg.remove();
            filter_div.remove();
            navigation_div.remove();
            timeline_vis.prev_tl_representation("None");

            // If we have no scenes, reset everything to default
            if (!(state.scenes && state.scenes.length)) {
              instance._currentSceneIndex = -1;
              globals.gif_index = 0;
              globals.scenes = [];
              globals.caption_list = [];
              globals.image_list = [];
              globals.annotation_list = [];
              timeline_vis.tl_scale("Chronological").tl_layout("Unified").tl_representation("Linear");
              selectAllWithParent(".gif_frame").remove();
              timeline_vis.resetCurve();
            }
          }

          if (globals.legend_panel !== undefined) {
            globals.legend_panel.remove();
          }

          filter_div = selectWithParent().append("div").attr("id", "filter_div").attr("class", "control_div").style("display", "none").style("transition", "all 0.05s ease").style("-webkit-transition", "all 0.05s ease");

          // initialize global variables accessed by multiple visualziations
          globals.date_granularity = "years";
          globals.max_num_tracks = 0;
          globals.max_end_age = 0;
          globals.max_num_seq_tracks = 0;
          globals.legend_rect_size = globals.unit_width;
          globals.legend_spacing = 5;
          globals.categories = undefined;
          globals.categories = d3.scaleOrdinal(); // scale for event types
          if (globals.color_palette !== undefined) {
            globals.categories.range(globals.color_palette);
          }
          globals.facets = d3.scaleOrdinal(); // scale for facets (timelines)
          globals.segments = d3.scaleOrdinal(); // scale for segments
          globals.present_segments = d3.scaleOrdinal();
          globals.num_categories = 0;
          globals.num_facets = 0;
          globals.timeline_facets = [];

          instance._main_svg = main_svg = instance._container.append("svg").attr("id", "main_svg");

          navigation_div = selectWithParent().append("div").attr("id", "navigation_div").attr("class", "control_div");

          var playback_bar = navigation_div.append("div").attr("id", "playback_bar");

          playback_bar.append("div").attr("id", "record_scene_div").attr("class", "nav_bttn").append("img").call(utils.attrs({
            id: "record_scene_btn",
            class: "img_btn_disabled",
            src: imageUrls("record.png"),
            height: 20,
            width: 20,
            title: tr("Record Scene")
          })).on("click", function () {
            if (!instance.playback_mode) {
              instance._recordScene();
            }
          });

          playback_bar.append("div").attr("id", "prev_scene_div").attr("class", "nav_bttn").append("img").attr("id", "prev_scene_btn").attr("height", 20).attr("width", 20).attr("src", imageUrls("prev.png")).attr("class", "img_btn_disabled").attr("title", tr("Previous Scene")).on("click", function () {
            goPreviousScene();
          });

          playback_bar.append("div").attr("id", "next_scene_div").attr("class", "nav_bttn").append("img").attr("height", 20).attr("width", 20).attr("class", "img_btn_disabled").attr("id", "next_scene_btn").attr("src", imageUrls("next.png")).attr("title", tr("Next Scene")).on("click", function () {
            goNextScene();
          });

          var playback_cb = playback_bar.append("div").attr("id", "playback_div").attr("class", "nav_bttn");

          var playback_cb_label = playback_cb.append("label").attr("class", "nav_cb");

          playback_cb_label.append("input").call(utils.attrs({
            type: "checkbox",
            name: "playback_cb",
            value: instance.playback_mode
          })).property("checked", false).on("change", function () {
            instance.setPlaybackMode(!instance.playback_mode);
          });

          playback_cb_label.append("img").call(utils.attrs({
            id: "play_scene_btn",
            class: "img_btn_disabled",
            src: imageUrls("play.png"),
            height: 20,
            width: 20,
            title: tr("Toggle Playback Mode")
          }));

          playback_bar.append("div").attr("id", "stepper_container")
          // .style('width', function () {
          //   return (globals.window_width * 0.9 - 120 - 12) + 'px';
          // })
          .append("svg").attr("id", "stepper_svg").append("text").attr("id", "stepper_svg_placeholder").attr("y", 25).attr("dy", "0.25em").text(tr("Recorded timeline scenes will appear here."));

          window.addEventListener("resize", function () {
            selectWithParent("#stepper_container").style("width", function () {
              return instance._render_width * 0.9 - 120 - 12 - 5 + "px";
            });
            instance._onResized();
          });

          var defs = main_svg.append("defs");

          var filter = defs.append("filter").attr("id", "drop-shadow").attr("x", 0).attr("y", 0).attr("width", "200%").attr("height", "200%");

          // translate output of Gaussian blur to the right and downwards with 2px
          // store result in offsetBlur
          filter.append("feOffset").attr("in", "SourceAlpha").attr("dx", 2.5).attr("dy", 2.5).attr("result", "offOut");

          filter.append("feGaussianBlur").attr("in", "offOut").attr("stdDeviation", 2.5).attr("result", "blurOut");

          filter.append("feBlend").attr("in", "SourceGraphic").attr("in2", "blurOut").attr("mode", "normal");

          defs.append("filter").attr("id", "greyscale").append("feColorMatrix").attr("type", "matrix").attr("dur", "0.5s").attr("values", "0.4444 0.4444 0.4444 0 0 0.4444 0.4444 0.4444 0 0 0.4444 0.4444 0.4444 0 0 0 0 0 1 0");

          /**
          ---------------------------------------------------------------------------------------
          LOAD DATA
          ---------------------------------------------------------------------------------------
          **/
          if (state) {
            instance._loadTimelineFromState(state, instance._render_height);

            // if we have scenes to show, we don't need the tooltip
            if (state.scenes && state.scenes.length) {
              selectWithParent("#stepper_svg_placeholder").remove();
            }
          }
        } finally {
          // Reapply the UI scale to new elements
          instance.setUIScale(instance.scale);

          loadDataIndicator.style("display", "none");
          instance.applyOptions();

          if (skipConfig) {
            drawTimeline(globals.active_data).then(resolve);
          }

          // call this again afterward, cause some elements are created in loadTimeline function
          // and we need to ensure they are hidden/visible
          instance.setPlaybackMode(instance.playback_mode, false);

          instance._loaded = true;

          if (!skipConfig) {
            resolve();
          }
        }
      }, 10);
    });
  }

  instance._loadTimeline = loadTimeline;

  /**
   * Preprocess data after loading
   * @param {object} data The data to preprocess
   * @param {boolean} shouldDrawTimeline If the timeline should be drawn after it is initialized
   * @returns {void}
   */
  function initTimelineData(data, shouldDrawTimeline) {
    var unique_values = new Map();
    var unique_data = [];

    globals.timeline_json_data = data;

    data.forEach(function (d, i) {
      if (d && !d.hasOwnProperty("id")) {
        d.id = i;
      }
      unique_values.set(d.content_text + d.start_date + d.end_date + d.category + d.facet, d);
    });

    // find unique values
    unique_values.forEach(function (d) {
      unique_data.push(d);
    });
    logEvent(unique_data.length + " unique events", "preprocessing");

    processTimeline(unique_data, shouldDrawTimeline);
  }

  function processTimeline(data, shouldDrawTimeline) {
    // check for earliest and latest numerical dates before parsing
    globals.earliest_date = d3.min(data, function (d) {
      if (d.start_date instanceof Date) {
        return d.start_date;
      }
      return +d.start_date;
    });

    globals.latest_start_date = d3.max(data, function (d) {
      if (d.start_date instanceof Date) {
        return d.start_date;
      }
      return +d.start_date;
    });

    globals.latest_end_date = d3.max(data, function (d) {
      if (d.end_date instanceof Date) {
        return d.end_date;
      }
      return +d.end_date;
    });

    // set flag for really epic time scales
    if (globals.isNumber(globals.earliest_date)) {
      if (globals.earliest_date < -9999 || d3.max([globals.latest_start_date, globals.latest_end_date]) > 10000) {
        globals.date_granularity = "epochs";
      }
    }

    log("date_granularity after: " + globals.date_granularity);

    parseDates(data); // parse all the date values, replace blank end_date values

    // set annotation counter for each item
    data.forEach(function (item) {
      item.annotation_count = 0;
    });

    /**
    ---------------------------------------------------------------------------------------
    PROCESS CATEGORIES OF EVENTS
    ---------------------------------------------------------------------------------------
    **/

    // determine event categories from data
    globals.categories.domain(data.map(function (d) {
      return d.category;
    }));

    globals.num_categories = globals.categories.domain().length;

    globals.max_legend_item_width = 0;

    globals.categories.domain().sort().forEach(function (item) {
      var legend_dummy = document.createElement("span");
      legend_dummy.id = "legend_dummy";
      legend_dummy.style.fontSize = "12px";
      legend_dummy.style.fill = "#fff";
      legend_dummy.style.fontFamily = "Century Gothic";
      legend_dummy.innerHTML = item;
      document.querySelector(".timeline_storyteller").appendChild(legend_dummy);
      var legend_dummy_width = legend_dummy.offsetWidth;
      document.querySelector(".timeline_storyteller").removeChild(legend_dummy);

      if (legend_dummy_width > globals.max_legend_item_width) {
        globals.max_legend_item_width = legend_dummy_width;
      }
    });

    logEvent("# categories: " + globals.num_categories, "preprocessing");

    var temp_palette;
    // assign colour labels to categories if # categories < 12
    if (globals.num_categories <= 20 && globals.num_categories >= 11) {
      temp_palette = colorSchemes.schema5();
      globals.categories.range(temp_palette);
      temp_palette = undefined;
    } else if (globals.num_categories <= 10 && globals.num_categories >= 3) {
      temp_palette = colorSchemes.schema2();
      globals.categories.range(temp_palette);
      temp_palette = undefined;
    } else if (globals.num_categories === 2) {
      temp_palette = ["#E45641", "#44B3C2"];
      globals.categories.range(temp_palette);
      temp_palette = undefined;
    } else {
      temp_palette = ["#E45641"];
      globals.categories.range(temp_palette);
      temp_palette = undefined;
    }
    if (globals.use_custom_palette) {
      globals.categories.range(globals.color_palette);
      logEvent("custom palette: " + globals.categories.range(), "color palette");
    }

    filter_div.append("input").call(utils.attrs({
      type: "image",
      name: tr("Hide filter panel"),
      id: "export_close_btn",
      class: "img_btn_enabled",
      src: imageUrls("close.png"),
      height: 15,
      width: 15,
      title: tr("Hide filter panel")
    })).style("position", "absolute").style("top", "0px").style("left", "5px").style("margin-top", "5px").on("click", function () {
      selectWithParent("#filter_div").style("display", "none");

      logEvent("hide filter panel", "export");
    });

    filter_div.append("text").attr("class", "menu_label filter_label").style("margin-right", "auto").text(tr("Filter Options")).style("cursor", "move").call(filterDrag);

    filter_div.append("hr").attr("class", "menu_hr");

    // filter type options
    var filter_type_picker = filter_div.append("div").attr("id", "filter_type_picker").attr("class", "filter_div_section");

    filter_type_picker.append("div").attr("class", "filter_div_header").append("text").attr("class", "menu_label filter_label").text(tr("Filter Mode:"));

    var filter_type_rb = filter_type_picker.selectAll("g").data(["Emphasize", "Hide"]).enter();

    var filter_type_rb_label = filter_type_rb.append("label").attr("class", "menu_rb");

    filter_type_rb_label.append("input").call(utils.attrs({
      type: "radio",
      name: "filter_type_rb",
      value: function value(d) {
        return d;
      }
    })).property("disabled", false).property("checked", function (d) {
      return d === "Emphasize";
    });

    filter_type_rb_label.append("img").call(utils.attrs({
      class: "img_btn_enabled",
      height: 30,
      width: 30,
      title: function title(d) {
        return d;
      },
      src: function src(d) {
        return imageUrls(d === "Emphasize" ? "highlight.png" : "hide.png");
      }
    })).style("margin-bottom", "0px");

    filter_type_rb_label.append("span").attr("class", "option_rb_label").html(function (d) {
      return tr(d);
    });

    selectAllWithParent("#filter_type_picker input[name=filter_type_rb]").on("change", function () {
      var newCategories = optionGroups(selectWithParent("#category_picker").select("option"));
      var newFacets = optionGroups(selectWithParent("#facet_picker").select("option"));
      var newSegments = optionGroups(selectWithParent("#segment_picker").select("option"));

      globals.filter_type = this.value;

      selectWithParent("#filter_div").style("display", "inline");

      logEvent("filter type changed: " + this.value, "filter");

      var isHide = globals.filter_type === "Hide";
      if (!isHide) {
        globals.active_data = globals.all_data;
      }

      var trigger_remove_filter = globals.selected_categories[0].length !== 1 || globals.selected_categories[0][0].value !== "( All )" || globals.selected_facets[0].length !== 1 || globals.selected_facets[0][0].value !== "( All )" || globals.selected_segments[0].length !== 1 || globals.selected_segments[0][0].value !== "( All )";

      if (trigger_remove_filter) {
        globals.dispatch.call(isHide ? "Emphasize" : "remove", globals.dispatch, newCategories, newFacets, newSegments);
        globals.dispatch.call(isHide ? "remove" : "Emphasize", globals.dispatch, globals.selected_categories, globals.selected_facets, globals.selected_segments);
      }
    });

    var category_filter = filter_div.append("div").attr("class", "filter_div_section");

    var category_filter_header = category_filter.append("div").attr("class", "filter_div_header");

    category_filter_header.append("text").attr("class", "menu_label filter_label").text(tr("Category"));

    category_filter_header.append("label").attr("for", "category_picker").style("display", "block").style("margin-right", "100%").attr("id", "category_picker_label").append("img").call(utils.attrs({
      name: tr("Filter by event category"),
      class: "filter_header_icon",
      height: 30,
      width: 30,
      title: tr("Filter by event category"),
      src: imageUrls("categories.png")
    }));

    var all_categories = ["( All )"];

    category_filter.append("select").attr("class", "filter_select").attr("size", 8).attr("id", "category_picker").call(utils.attrs({
      multiple: true
    })).on("change", function () {
      instance._updateSelectedFilters(d3.select(this), "selected_categories");
    }).selectAll("option").data(all_categories.concat(globals.categories.domain().sort())).enter().append("option").attr("value", function (d) {
      return d;
    }).text(function (d) {
      return d === "( All )" ? tr(d) : d;
    }).property("selected", function (d) {
      return d === "( All )";
    });

    globals.selected_categories = optionGroups(selectWithParent("#category_picker").selectAll("option").filter(function () {
      return this.selected;
    }));

    /**
    ---------------------------------------------------------------------------------------
    PROCESS FACETS
    ---------------------------------------------------------------------------------------
    **/

    // determine facets (separate timelines) from data
    globals.facets.domain(data.map(function (d) {
      return d.facet;
    }));

    globals.facets.domain(globals.facets.domain().sort());

    globals.num_facets = globals.facets.domain().length;
    globals.total_num_facets = globals.num_facets;
    globals.num_facet_cols = Math.ceil(Math.sqrt(globals.num_facets));
    globals.num_facet_rows = Math.ceil(globals.num_facets / globals.num_facet_cols);

    logEvent("# facets: " + globals.num_facets, "preprocessing");

    var facet_filter = filter_div.append("div").attr("class", "filter_div_section");

    var facet_filter_header = facet_filter.append("div").attr("class", "filter_div_header");

    facet_filter_header.append("text").attr("class", "menu_label filter_label").text(tr("Facet"));

    facet_filter_header.append("label").attr("for", "facet_picker").style("display", "block").style("margin-right", "100%").attr("id", "facet_picker_label").append("img").call(utils.attrs({
      name: tr("Filter by event facet"),
      class: "filter_header_icon",
      height: 30,
      width: 30,
      title: tr("Filter by event facet"),
      src: imageUrls("facets.png")
    }));

    var all_facets = ["( All )"];

    facet_filter.append("select").attr("class", "filter_select").attr("size", 8).attr("id", "facet_picker").call(utils.attrs({
      multiple: true
    })).on("change", function () {
      instance._updateSelectedFilters(d3.select(this), "selected_facets");
    }).selectAll("option").data(all_facets.concat(globals.facets.domain().sort())).enter().append("option").attr("value", function (d) {
      return d;
    }).text(function (d) {
      return d === "( All )" ? tr(d) : d;
    }).property("selected", function (d) {
      return d === "( All )";
    });

    globals.selected_facets = optionGroups(selectWithParent("#facet_picker").selectAll("option").filter(function () {
      return this.selected;
    }));

    /**
    ---------------------------------------------------------------------------------------
    PROCESS SEGMENTS
    ---------------------------------------------------------------------------------------
    **/

    // event sorting function
    data.sort(compareAscending);

    if (globals.date_granularity === "epochs") {
      data.min_start_date = globals.earliest_date;
      data.max_start_date = d3.max([globals.latest_start_date, globals.latest_end_date]);
      data.max_end_date = d3.max([globals.latest_start_date, globals.latest_end_date]);
    } else {
      // determine the time domain of the data along a linear quantitative scale
      data.min_start_date = d3.min(data, function (d) {
        return d.start_date;
      });
      data.max_start_date = d3.max(data, function (d) {
        return d.start_date;
      });
      data.max_end_date = d3.max(data, function (d) {
        return time.minute.floor(d.end_date);
      });
    }

    // determine the granularity of segments
    globals.segment_granularity = getSegmentGranularity(data.min_start_date, data.max_end_date);

    data.forEach(function (item) {
      item.segment = getSegment(item.start_date);
    });

    var segment_list = getSegmentList(data.min_start_date, data.max_end_date);

    globals.present_segments.domain(segment_list.map(function (d) {
      return d;
    }));

    var segment_filter = filter_div.append("div").attr("class", "filter_div_section");

    var segment_filter_header = segment_filter.append("div").attr("class", "filter_div_header");

    segment_filter_header.append("text").attr("class", "menu_label filter_label").text(tr("Segment"));

    segment_filter_header.append("label").attr("for", "segment_picker").style("display", "block").style("margin-right", "100%").attr("id", "segment_picker_label").append("img").call(utils.attrs({
      name: tr("Filter by chronological segment"),
      class: "filter_header_icon",
      height: 30,
      width: 30,
      title: tr("Filter by chronological segment"),
      src: imageUrls("segments.png")
    }));

    var all_segments = ["( All )"];

    segment_filter.append("select").attr("id", "segment_picker").attr("class", "filter_select").attr("size", 8).call(utils.attrs({
      multiple: true
    })).on("change", function () {
      instance._updateSelectedFilters(d3.select(this), "selected_segments");
    }).selectAll("option").data(all_segments.concat(globals.present_segments.domain().sort())).enter().append("option").attr("value", function (d) {
      return d;
    }).text(function (d) {
      return d === "( All )" ? tr(d) : d;
    }).property("selected", function (d) {
      return d === "( All )";
    });

    globals.selected_segments = optionGroups(selectWithParent("#segment_picker").selectAll("option").filter(function () {
      return this.selected;
    }));

    globals.all_data = data;
    globals.active_data = globals.all_data;

    measureTimeline(globals.active_data);
    selectWithParent("#timeline_metadata").style("display", "inline");
    selectWithParent("#timeline_metadata_contents").append("span").attr("class", "metadata_title").style("text-decoration", "underline").text(tr("About this data:"));

    selectWithParent("#timeline_metadata_contents").append("div").attr("class", "timeline_metadata_contents_div").html("<p class='metadata_content'><img src='" + imageUrls("timeline.png") + "' width='36px' style='float: left; padding-right: 5px;'/><strong>" + tr("Cardinality & extent") + "</strong>: " + tr("{count} unique events spanning {range}", { count: globals.active_data.length, range: globals.range_text }) + " <br><strong>" + tr("Granularity") + "</strong>: " + tr(globals.segment_granularity) + "</p>");

    var category_metadata = selectWithParent("#timeline_metadata_contents").append("div").attr("class", "timeline_metadata_contents_div").style("border-top", "1px dashed #999");

    var category_metadata_p = category_metadata.append("p").attr("class", "metadata_content").html("<img src='" + imageUrls("categories.png") + "' width='36px' style='float: left; padding-right: 5px;'/><strong>" + tr("Event categories") + "</strong>: ( " + globals.num_categories + " ) <em><strong>" + tr("Note") + "</strong>: " + tr("click on the swatches to assign custom colors to categories.") + "</em><br>");

    var category_metadata_element = category_metadata_p.selectAll(".category_element").data(globals.categories.domain().sort()).enter().append("g").attr("class", "category_element");

    category_metadata_element.append("div").attr("class", "colorpicker_wrapper").attr("filter", "url(#drop-shadow)").style("background-color", globals.categories).on("click", function (event, d) {
      var colorEle = this;
      var i = globals.categories.domain().sort().indexOf(d);
      instance._colorPicker.show(this, globals.categories(d), function (value) {
        // Update the display
        d3.select(colorEle).style("background-color", value);

        instance.setCategoryColor(d, i, value);
      });
    });
    //   .append("input")
    //   .attr("type", "color")
    //   .attr("class", "colorpicker")
    //   .attr("value", globals.categories)
    //   .on("change", function (d, i) {

    //   });

    category_metadata_element.append("span").attr("class", "metadata_content").style("float", "left").text(function (d) {
      return " " + d + " ..";
    });

    category_metadata.append("p").html("<br>");

    selectWithParent("#timeline_metadata_contents").append("div").attr("class", "timeline_metadata_contents_div").style("border-top", "1px dashed #999").html("<p class='metadata_content'><img src='" + imageUrls("facets.png") + "' width='36px' style='float: left; padding-right: 5px;'/><strong>" + tr("Timeline facets") + "</strong>: " + (globals.facets.domain().length > 1 ? "( " + globals.num_facets + " ) " + globals.facets.domain().slice(0, 30).join(" .. ") : tr("(none)")) + "</p>");

    if (shouldDrawTimeline) {
      drawTimeline(globals.active_data);
    }
  }

  /**
  ---------------------------------------------------------------------------------------
  SELECT SCALE
  ---------------------------------------------------------------------------------------
  **/

  selectAllWithParent("#scale_picker input[name=scale_rb]").on("change", function () {
    instance.clearCanvas();

    logEvent("scale change: " + this.value, "scale_change");

    determineSize(globals.active_data, this.value, timeline_vis.tl_layout(), timeline_vis.tl_representation());

    adjustSvgSize();

    main_svg.call(timeline_vis.duration(instance._getAnimationStepDuration()).tl_scale(this.value).height(globals.height).width(globals.width));

    updateRadioBttns(timeline_vis.tl_scale(), timeline_vis.tl_layout(), timeline_vis.tl_representation());
  });

  /**
  ---------------------------------------------------------------------------------------
  SELECT LAYOUT
  ---------------------------------------------------------------------------------------
  **/

  selectAllWithParent("#layout_picker input[name=layout_rb]").on("change", function () {
    instance.clearCanvas();

    logEvent("layout change: " + this.value, "layout_change");

    determineSize(globals.active_data, timeline_vis.tl_scale(), this.value, timeline_vis.tl_representation());

    adjustSvgSize();

    main_svg.call(timeline_vis.duration(instance._getAnimationStepDuration()).tl_layout(this.value).height(globals.height).width(globals.width));

    updateRadioBttns(timeline_vis.tl_scale(), timeline_vis.tl_layout(), timeline_vis.tl_representation());
  });

  /**
  ---------------------------------------------------------------------------------------
  SELECT REPRESENTATION
  ---------------------------------------------------------------------------------------
  **/

  selectAllWithParent("#representation_picker input[name=representation_rb]").on("change", function () {
    instance.clearCanvas();

    logEvent("representation change: " + this.value, "representation_change");

    if (timeline_vis.tl_layout() === "Segmented") {
      if (this.value === "Grid") {
        globals.segment_granularity = "centuries";
      } else if (this.value === "Calendar") {
        globals.segment_granularity = "weeks";
      } else {
        globals.segment_granularity = getSegmentGranularity(globals.global_min_start_date, globals.global_max_end_date);
      }
    }

    determineSize(globals.active_data, timeline_vis.tl_scale(), timeline_vis.tl_layout(), this.value);

    adjustSvgSize();

    main_svg.call(timeline_vis.duration(instance._getAnimationStepDuration()).tl_representation(this.value).height(globals.height).width(globals.width));

    if (timeline_vis.tl_representation() === "Curve" && !globals.dirty_curve) {
      selectWithParent(".timeline_frame").style("cursor", "crosshair");
    } else {
      selectWithParent(".timeline_frame").style("cursor", "auto");
    }

    updateRadioBttns(timeline_vis.tl_scale(), timeline_vis.tl_layout(), timeline_vis.tl_representation());
  });

  /**
  ---------------------------------------------------------------------------------------
  SCENE transitions
  ---------------------------------------------------------------------------------------
  **/

  function updateNavigationStepper() {
    var STEPPER_STEP_WIDTH = 50;

    var navigation_step_svg = selectWithParent("#stepper_svg");

    var navigation_step = navigation_step_svg.selectAll(".framePoint").data(globals.scenes);

    navigation_step.exit().transition().delay(1000).call(removeOnEnd);

    var navigation_step_update = navigation_step.transition().duration(instance.options.animations ? 1000 : 0);

    var navigation_step_enter = navigation_step.enter().append("g").attr("class", "framePoint").attr("id", function (d) {
      return "frame" + d.s_order;
    }).attr("transform", function (d) {
      return "translate(" + (d.s_order * STEPPER_STEP_WIDTH + d.s_order * 5) + ",0)";
    }).style("cursor", "pointer");

    navigation_step_update.attr("transform", function (d) {
      return "translate(" + (d.s_order * STEPPER_STEP_WIDTH + d.s_order * 5) + ",0)";
    }).attr("id", function (d) {
      return "frame" + d.s_order;
    });

    navigation_step_enter.append("title").text(function (d) {
      return tr("Scene {number}", { number: d.s_order + 1 });
    });

    navigation_step_update.select("title").text(function (d) {
      return tr("Scene {number}", { number: d.s_order + 1 });
    });

    function changeSceneClickHandler(event, d) {
      instance._currentSceneIndex = d.s_order;
      changeScene(instance._currentSceneIndex);
    }

    navigation_step_enter.append("rect").attr("fill", "white").attr("width", STEPPER_STEP_WIDTH).attr("height", STEPPER_STEP_WIDTH).style("stroke", function (d) {
      return d.s_order === instance._currentSceneIndex ? "#f00" : "#ccc";
    }).style("stroke-width", "3px").on("click", changeSceneClickHandler);

    navigation_step_update.select("rect").style("stroke", function (d) {
      return d.s_order === instance._currentSceneIndex ? "#f00" : "#ccc";
    });

    if (isIE11) {
      navigation_step_enter.append("svg:text").attr("x", 25).attr("y", 25).attr("font-size", "20px").attr("text-anchor", "middle").attr("alignment-baseline", "central").attr("style", "cursor:pointer").text(function (d) {
        return d.s_order + 1;
      }).on("click", changeSceneClickHandler);

      navigation_step_update.select("text").text(function (d) {
        return d.s_order + 1;
      });
    } else {
      navigation_step_enter.append("svg:image").attr("xlink:href", function (d) {
        return d.s_src;
      }).attr("x", 2).attr("y", 2).attr("width", STEPPER_STEP_WIDTH - 4).attr("height", STEPPER_STEP_WIDTH - 4).on("click", changeSceneClickHandler);
    }

    var navigation_step_delete = navigation_step_enter.append("g").attr("class", "scene_delete").style("opacity", 0);

    navigation_step_delete.append("svg:image").attr("class", "annotation_control annotation_delete").attr("title", tr("Delete Scene")).attr("x", STEPPER_STEP_WIDTH - 17).attr("y", 2).attr("width", 15).attr("height", 15).attr("xlink:href", imageUrls("delete.png", true));

    navigation_step_delete.append("rect").attr("title", tr("Delete Scene")).attr("x", STEPPER_STEP_WIDTH - 17).attr("y", 2).attr("width", 15).attr("height", 15).on("mouseover", function () {
      d3.select(this).style("stroke", "#f00");
    }).on("mouseout", function () {
      d3.select(this).style("stroke", "#ccc");
    }).on("click", function (event, d) {
      selectWithParent("#frame" + d.s_order).remove();
      selectAllWithParent(".frame_hover").remove();
      // delete current scene unless image or caption div is open
      logEvent("scene " + (d.s_order + 1) + " deleted.", "deletion");

      var j;
      for (j = 0; j < globals.scenes.length; j++) {
        if (globals.scenes[j].s_order === d.s_order) {
          globals.scenes.splice(j, 1);
        }
      }

      for (j = 0; j < globals.scenes.length; j++) {
        if (globals.scenes[j].s_order > d.s_order) {
          globals.scenes[j].s_order--;
        }
      }

      if (instance._currentSceneIndex > d.s_order) {
        instance._currentSceneIndex--;
      }

      updateNavigationStepper();

      instance._dispatch.call("stateChanged");

      if (instance._currentSceneIndex === d.s_order) {
        // is current scene to be deleted?
        if (instance._currentSceneIndex === globals.scenes.length - 1) {
          // is it the final scene?
          instance._currentSceneIndex = 0; // set current scene to first scene
        } else {
          // current scene is not the last scene
          instance._currentSceneIndex--; // set current scene to previous scene
          if (instance._currentSceneIndex < 0) {
            // did you delete the first scene?
            instance._currentSceneIndex = globals.scenes.length - 1; // set current to last scene
          }
        }

        if (globals.scenes.length === 0) {
          // are there no more scenes left?
          instance._currentSceneIndex = -1; // set current scene to -1
        } else {
          changeScene(instance._currentSceneIndex);
        }
      }
    }).append("title").text(tr("Delete Scene"));

    if (!isIE11) {
      navigation_step_svg.selectAll(".framePoint").on("mouseover", function () {
        var popupSize = 300;
        var frameRect = this.getBoundingClientRect();
        var relativeParentRect = selectWithParent(".timeline_storyteller-container").node().getBoundingClientRect();
        var offscreenAmount = frameRect.right + popupSize - relativeParentRect.right;

        // If we're offscreen, then adjust the position to take the offsceen amount into account
        var x_pos = frameRect.left - relativeParentRect.left - (offscreenAmount > 0 ? offscreenAmount : 0);
        var y_pos = frameRect.top - relativeParentRect.top;

        var img_src = d3.select(this).select("image").attr("href");

        d3.select(this).select("rect").style("stroke", "#666");

        d3.select(this).select(".scene_delete").style("opacity", 1);

        selectWithParent().append("div").attr("class", "frame_hover").style("left", x_pos + "px").style("top", y_pos - popupSize - 20 + "px").append("svg").style("padding", "0px").style("width", popupSize + "px").style("height", popupSize + "px").append("svg:image").attr("xlink:href", img_src).attr("x", 2).attr("y", 2).attr("width", 296).attr("height", 296);
      }).on("mouseout", function (event, d) {
        d3.select(this).select(".scene_delete").style("opacity", 0);

        if (d.s_order === instance._currentSceneIndex) {
          d3.select(this).select("rect").style("stroke", function () {
            return "#f00";
          });
        } else {
          d3.select(this).select("rect").style("stroke", function () {
            return "#ccc";
          });
        }

        selectAllWithParent(".frame_hover").remove();
      });
    }

    navigation_step_svg.attr("width", (globals.scenes.length + 1) * (STEPPER_STEP_WIDTH + 5));

    var total = (globals.scenes || []).length;
    var sceneIdx = instance._currentSceneIndex;
    selectWithParent("#prev_scene_btn")
    // Always show 1 if at the beginning
    .attr("title", total > 1 ? tr("Scene {number} of {total}", { number: sceneIdx === 0 ? total : sceneIdx, total: total }) : "Previous Scene").classed("img_btn_disabled", total < 2).classed("img_btn_enabled", total > 1);

    selectWithParent("#next_scene_btn").attr("title", total > 1 ? tr("Scene {number} of {total}", { number: sceneIdx === total - 1 ? 1 : sceneIdx + 2, total: total }) : "Next Scene").classed("img_btn_disabled", total < 2).classed("img_btn_enabled", total > 1);
  }

  instance._updateNavigationStepper = updateNavigationStepper;

  instance._prevTransitioning = false;
  function changeScene(scene_index) {
    // Assume we are waiting for transitions if there is already one going.
    var waitForTransitions = instance._prevTransitioning;

    updateNavigationStepper();

    var scene_found = false,
        i = 0,
        scene = globals.scenes[0];

    while (!scene_found && i < globals.scenes.length) {
      if (globals.scenes[i].s_order === scene_index) {
        scene_found = true;
        scene = globals.scenes[i];
      }
      i++;
    }

    selectWithParent("#timecurve").style("visibility", "hidden");

    if (scene.s_representation === "Curve") {
      selectWithParent("#timecurve").attr("d", globals.scenes[scene_index].s_timecurve);
      timeline_vis.render_path(globals.scenes[scene_index].s_timecurve);
      timeline_vis.reproduceCurve();
    }

    // is the new scene a segmented grid or calendar? if so, re-segment the events
    if (scene.s_layout === "Segmented") {
      if (scene.s_representation === "Grid") {
        globals.segment_granularity = "centuries";
      } else if (scene.s_representation === "Calendar") {
        globals.segment_granularity = "weeks";
      } else {
        globals.segment_granularity = getSegmentGranularity(globals.global_min_start_date, globals.global_max_end_date);
      }
    }

    // set a delay for annotations and captions based on whether the scale, layout, or representation changes
    if (timeline_vis.tl_scale() !== scene.s_scale || timeline_vis.tl_layout() !== scene.s_layout || timeline_vis.tl_representation() !== scene.s_representation) {
      waitForTransitions = true;
      instance._prevTransitioning = true;

      // how big is the new scene?
      determineSize(globals.active_data, scene.s_scale, scene.s_layout, scene.s_representation);

      // resize the main svg to accommodate the scene
      adjustSvgSize();

      // set the scene's scale, layout, representation
      timeline_vis.tl_scale(scene.s_scale).tl_layout(scene.s_layout).tl_representation(scene.s_representation)

      // Uses EFFECTIVE_HEIGHT
      .height(d3.max([globals.height, scene.s_height, instance._render_height - globals.margin.top - globals.margin.bottom - getScrollbarWidth()])).width(d3.max([globals.width, scene.s_width]));
    }

    updateRadioBttns(timeline_vis.tl_scale(), timeline_vis.tl_layout(), timeline_vis.tl_representation());

    // initilaize scene filter settings
    var scene_category_values = [],
        scene_facet_values = [],
        scene_segment_values = [];

    // which categories are shown in the scene?
    scene.s_categories[0].forEach(function (item) {
      scene_category_values.push(item.__data__);
    });

    // update the category picker
    selectWithParent("#category_picker").selectAll("option").property("selected", function (d) {
      return scene_category_values.indexOf(d) !== -1;
    });

    // which facets are shown in the scene?
    scene.s_facets[0].forEach(function (item) {
      scene_facet_values.push(item.__data__);
    });

    // update the facet picker
    selectWithParent("#facet_picker").selectAll("option").property("selected", function (d) {
      return scene_facet_values.indexOf(d) !== -1;
    });

    // which segments are shown in the scene?
    scene.s_segments[0].forEach(function (item) {
      scene_segment_values.push(item.__data__);
    });

    // update the segment picker
    selectWithParent("#segment_picker").selectAll("option").property("selected", function (d) {
      return scene_segment_values.indexOf(d) !== -1;
    });

    // if filters change in "remove" mode, delay annoations and captions until after transition
    var scene_filter_set_length = scene_category_values.length + scene_facet_values.length + scene_segment_values.length;

    if (scene.s_filter_type === "Hide") {
      scene_filter_set_length += 1;
    }

    if (scene_filter_set_length !== globals.filter_set_length) {
      globals.filter_set_length = scene_filter_set_length;
      waitForTransitions = true;
      instance._prevTransitioning = true;
    }

    globals.selected_categories = scene.s_categories;
    globals.selected_facets = scene.s_facets;
    globals.selected_segments = scene.s_segments;

    // what type of filtering is used in the scene?
    if (scene.s_filter_type === "Hide") {
      selectAllWithParent("#filter_type_picker input[name=filter_type_rb]").property("checked", function (d) {
        return d === "Hide";
      });
      if (globals.filter_type === "Emphasize") {
        globals.dispatch.call("Emphasize", globals.dispatch, optionGroups(selectWithParent("#category_picker").select("option")), optionGroups(selectWithParent("#facet_picker").select("option")), optionGroups(selectWithParent("#segment_picker").select("option")));
      }
      globals.filter_type = "Hide";
      globals.dispatch.call("remove", globals.dispatch, globals.selected_categories, globals.selected_facets, globals.selected_segments);
    } else if (scene.s_filter_type === "Emphasize") {
      selectAllWithParent("#filter_type_picker input[name=filter_type_rb]").property("checked", function (d) {
        return d === "Emphasize";
      });
      if (globals.filter_type === "Hide") {
        globals.active_data = globals.all_data;
        globals.dispatch.call("remove", globals.dispatch, optionGroups(selectWithParent("#category_picker").select("option")), optionGroups(selectWithParent("#facet_picker").select("option")), optionGroups(selectWithParent("#segment_picker").select("option")));
      }
      globals.filter_type = "Emphasize";
      globals.dispatch.call("Emphasize", globals.dispatch, globals.selected_categories, globals.selected_facets, globals.selected_segments);
    }

    // where is the legend in the scene?
    selectWithParent(".legend").transition().duration(instance._getAnimationStepDuration()).style("z-index", 1).attr("x", scene.s_legend_x).attr("y", scene.s_legend_y);

    globals.legend_x = scene.s_legend_x;
    globals.legend_y = scene.s_legend_y;

    main_svg.selectAll(".timeline_caption").remove();

    main_svg.selectAll(".timeline_image").remove();

    main_svg.selectAll(".event_annotation").remove();

    selectAllWithParent(".timeline_event_g").each(function () {
      this.__data__.selected = false;
    });

    selectAllWithParent(".event_span").attr("filter", "none").style("stroke", "#fff").style("stroke-width", "0.25px");

    selectAllWithParent(".event_span_component").style("stroke", "#fff").style("stroke-width", "0.25px");

    // delay the appearance of captions and annotations if the scale, layout, or representation changes relative to the previous scene
    if (waitForTransitions && timeline_vis.renderComplete) {
      log("Waiting for transitions");
      timeline_vis.renderComplete.then(function () {
        return instance._loadAnnotations(scene, scene_index);
      });
    } else {
      instance._loadAnnotations(scene, scene_index);
    }
  }

  instance._changeScene = changeScene;

  function measureTimeline(data) {
    /**
    ---------------------------------------------------------------------------------------
    SORT AND NEST THE EVENTS
    ---------------------------------------------------------------------------------------
    **/

    // event sorting function
    data.sort(compareAscending);

    if (globals.date_granularity === "epochs") {
      data.min_start_date = globals.earliest_date;
      data.max_start_date = d3.max([globals.latest_start_date, globals.latest_end_date]);
      data.max_end_date = d3.max([globals.latest_start_date, globals.latest_end_date]);
    } else {
      // determine the time domain of the data along a linear quantitative scale
      data.min_start_date = d3.min(data, function (d) {
        return d.start_date;
      });
      data.max_start_date = d3.max(data, function (d) {
        return d.start_date;
      });
      data.max_end_date = d3.max(data, function (d) {
        return time.minute.floor(d.end_date);
      });
    }

    if (globals.date_granularity === "epochs") {
      var format = function format(d) {
        return globals.formatAbbreviation(d);
      };
      globals.range_text = format(data.max_end_date.valueOf() - data.min_start_date.valueOf()) + tr(" years") + ": " + data.min_start_date.valueOf() + " - " + data.max_end_date.valueOf();
    } else {
      globals.range_text = describeDuration(data.min_start_date, data.max_end_date) + ": " + moment(data.min_start_date).format("YYYY-MM-DD") + " - " + moment(data.max_end_date).format("YYYY-MM-DD");
    }

    logEvent("range: " + globals.range_text, "preprocessing");

    // create a nested data structure to contain faceted data
    globals.timeline_facets = d3.groups(data, function (d) {
      return String(d.facet);
    }).sort(function (a, b) {
      return d3.ascending(a[0], b[0]);
    }).map(function (group) {
      return { key: group[0], values: group[1] };
    });

    // get event durations
    data.forEach(function (item) {
      if (globals.date_granularity === "days") {
        item.duration = d3.timeDays(item.start_date, item.end_date).length;
      } else if (globals.date_granularity === "years") {
        item.duration = item.end_date.getUTCFullYear() - item.start_date.getUTCFullYear();
      } else if (globals.date_granularity === "epochs") {
        item.duration = item.end_date.valueOf() - item.start_date.valueOf();
      }
    });

    data.max_duration = d3.max(data, function (d) {
      return d.duration;
    });

    data.min_duration = d3.min(data, function (d) {
      return d.duration;
    });

    logEvent("max event duration: " + data.max_duration + " " + globals.date_granularity, "preprocessing");

    logEvent("min event duration: " + data.min_duration + " " + globals.date_granularity, "preprocessing");

    // determine the granularity of segments
    globals.segment_granularity = getSegmentGranularity(data.min_start_date, data.max_end_date);

    logEvent("segment granularity: " + globals.segment_granularity, "preprocessing");

    var segment_list = getSegmentList(data.min_start_date, data.max_end_date);

    globals.segments.domain(segment_list.map(function (d) {
      return d;
    }));

    logEvent("segments (" + globals.segments.domain().length + "): " + globals.segments.domain(), "preprocessing");

    globals.num_segments = globals.segments.domain().length;
    globals.num_segment_cols = Math.ceil(Math.sqrt(globals.num_segments));
    globals.num_segment_rows = Math.ceil(globals.num_segments / globals.num_segment_cols);
  }
  /**
   * Renders the timeline
   * @param {object[]} data The data to render
   * @returns {void}
   */
  function drawTimeline(data) {
    selectWithParent("#timeline_metadata").style("display", "none");
    selectWithParent("#timeline_metadata_contents").html("");
    instance.importPanel.hide();

    /**
    ---------------------------------------------------------------------------------------
    CALL STANDALONE TIMELINE VISUALIZATIONS
    ---------------------------------------------------------------------------------------
    **/

    control_panel.selectAll("input").attr("class", "img_btn_enabled");
    selectWithParent("#navigation_div").style("bottom", instance.options.showAbout === false || instance.playback_mode ? "20px" : "50px");
    selectWithParent("#filter_type_picker").selectAll("input").property("disabled", false);
    selectWithParent("#filter_type_picker").selectAll("img").attr("class", "img_btn_enabled");

    selectAllWithParent("#record_scene_btn, #play_scene_btn").selectAll("img").attr("class", "img_btn_enabled");

    var hasScenes = globals.scenes && globals.scenes.length;
    if (hasScenes) {
      selectWithParent("#record_scene_btn").attr("class", "img_btn_disabled");
      timeline_vis.tl_scale(globals.scenes[0].s_scale).tl_layout(globals.scenes[0].s_layout).tl_representation(globals.scenes[0].s_representation);
    }

    updateRadioBttns(timeline_vis.tl_scale(), timeline_vis.tl_layout(), timeline_vis.tl_representation());

    determineSize(data, timeline_vis.tl_scale(), timeline_vis.tl_layout(), timeline_vis.tl_representation());

    adjustSvgSize();

    globals.global_min_start_date = data.min_start_date;
    globals.global_max_end_date = data.max_end_date;

    main_svg.datum(data).call(timeline_vis.duration(instance._getAnimationStepDuration()).height(globals.height).width(globals.width));

    // TODO: This should move into each of the chart renderers when we have some time
    instance._hideError();
    instance._main_svg.style("opacity", 1);

    if (hasScenes) {
      instance._currentSceneIndex = 0;
      changeScene(0);
    }

    if (globals.legend_panel) {
      globals.legend_panel.remove();
      globals.legend_panel = undefined;
    }

    if (globals.num_categories <= 12 && globals.num_categories > 1) {
      // setup legend
      globals.legend_panel = main_svg.append("svg").attr("height", 35 + globals.track_height * (globals.num_categories + 1) + 5).attr("width", globals.max_legend_item_width + 10 + globals.unit_width + 10 + 20).attr("y", 100).attr("id", "legend_panel").attr("class", "legend").on("mouseover", function () {
        // if (selectAllWithParent("foreignObject")[0].length === 0) {
        //   addLegendColorPicker();
        // }
        d3.select(this).select(".legend_rect").attr("filter", "url(#drop-shadow)");
        d3.select(this).select("#legend_expand_btn").style("opacity", 1);
      }).on("mouseout", function () {
        d3.select(this).select(".legend_rect").attr("filter", "none");
        d3.select(this).select("#legend_expand_btn").style("opacity", 0.1);
      }).call(legendDrag);

      globals.legend_panel.append("rect").attr("class", "legend_rect").attr("height", globals.track_height * (globals.num_categories + 1)).attr("width", globals.max_legend_item_width + 5 + globals.unit_width + 10).append("title").text(tr("Click on a color swatch to select a custom color for that category."));

      globals.legend_panel.append("svg:image").attr("id", "legend_expand_btn").attr("x", globals.max_legend_item_width + 5 + globals.unit_width - 10).attr("y", 0).attr("width", 20).attr("height", 20).attr("xlink:href", imageUrls("min.png", true)).style("cursor", "pointer").style("opacity", 0.1).on("click", function () {
        if (globals.legend_expanded) {
          instance.collapseLegend();
        } else {
          instance.expandLegend();
        }
      }).append("title").text(tr("Expand / collapse legend."));

      var legendElementContainer = globals.legend_panel.selectAll(".legend_element_g").data(globals.categories.domain().sort());
      globals.legend = legendElementContainer.enter().append("g").attr("class", "legend_element_g");

      // Remove the element when not data bound.
      legendElementContainer.exit().remove();

      globals.legend.append("title").text(function (d) {
        return d;
      });

      globals.legend.attr("transform", function (d, i) {
        return "translate(0," + (35 + (i + 1) * globals.track_height) + ")";
      });

      globals.legend.on("mouseover", function (event, d) {
        var hovered_legend_element = d;

        logEvent("legend hover: " + hovered_legend_element, "legend");

        d3.select(this).select("rect").style("stroke", "#f00");
        d3.select(this).select("text").style("font-weight", "bolder").style("fill", "#f00");
        selectAllWithParent(".timeline_event_g").each(function (d) {
          // eslint-disable-line no-shadow
          if (d.category === hovered_legend_element || d.selected) {
            d3.select(this).selectAll(".event_span").style("stroke", "#f00").style("stroke-width", "1.25px").attr("filter", "url(#drop-shadow)");
            d3.select(this).selectAll(".event_span_component").style("stroke", "#f00").style("stroke-width", "1px");
          } else {
            d3.select(this).selectAll(".event_span").attr("filter", "url(#greyscale)");
            d3.select(this).selectAll(".event_span_component").attr("filter", "url(#greyscale)");
          }
        });
      });

      globals.legend.on("mouseout", function (event, d) {
        d3.select(this).select("rect").style("stroke", "#fff");
        d3.select(this).select("text").style("font-weight", "normal").style("fill", "#666");
        selectAllWithParent(".timeline_event_g").each(function () {
          d3.select(this).selectAll(".event_span").style("stroke", "#fff").style("stroke-width", "0.25px").attr("filter", "none");
          d3.select(this).selectAll(".event_span_component").style("stroke", "#fff").style("stroke-width", "0.25px").attr("filter", "none");
          if (d.selected) {
            d3.select(this).selectAll(".event_span").attr("filter", "url(#drop-shadow)").style("stroke", "#f00").style("stroke-width", "1.25px");
            d3.select(this).selectAll(".event_span_component").style("stroke", "#f00").style("stroke-width", "1px");
          }
        });
      });

      globals.legend.append("rect").attr("class", "legend_element").attr("x", globals.legend_spacing).attr("y", 2).attr("width", globals.legend_rect_size).attr("height", globals.legend_rect_size).attr("transform", "translate(0,-35)").style("fill", globals.categories).on("click", function (event, d) {
        var colorEle = this;
        var i = globals.categories.domain().sort().indexOf(d);
        instance._colorPicker.show(this, globals.categories(d), function (value) {
          // Update the display
          selectWithParent(".legend").selectAll(".legend_element_g rect").each(function () {
            if (this.__data__ === d) {
              d3.select(colorEle).style("fill", value);
            }
          });

          instance.setCategoryColor(d, i, value);

          if (main_svg && timeline_vis) {
            main_svg.call(timeline_vis.duration(instance._getAnimationStepDuration()));
          }
        });
      }).append("title");

      globals.legend.append("text").attr("class", "legend_element").attr("x", globals.legend_rect_size + 2 * globals.legend_spacing).attr("y", globals.legend_rect_size - globals.legend_spacing).attr("dy", 3).style("fill-opacity", "1").style("display", "inline").attr("transform", "translate(0,-35)").text(function (d) {
        return d;
      });

      globals.legend_panel.append("text").text(tr("LEGEND")).attr("class", "legend_title").attr("dy", "1.4em").attr("dx", "0em").attr("transform", "translate(5,0)rotate(0)");
    }

    return new Promise(function (resolve) {
      if (timeline_vis.renderComplete) {
        timeline_vis.renderComplete.then(resolve);
      } else {
        resolve();
      }
    });
  }

  instance._drawTimeline = drawTimeline;

  /**
   --------------------------------------------------------------------------------------
  TIMELINE DATA PROCESSING UTILITY FUNCTIONS
  --------------------------------------------------------------------------------------
  **/

  function parseDates(data) {
    var i = 0;

    // parse the event dates
    // assign an end date if none is provided
    data.forEach(function (item) {
      item.event_id = i;
      globals.active_event_list.push(i);
      i++;

      // if there are numerical dates before -9999 or after 10000, don't attempt to parse them
      if (globals.date_granularity === "epochs") {
        return;
      }

      instance._parseStartAndEndDates(item);

      globals.active_event_list.push(item.event_id);
      globals.prev_active_event_list.push(item.event_id);
      globals.all_event_ids.push(item.event_id);
    });
  }

  // sort events according to start / end dates
  function compareAscending(item1, item2) {
    // Every item must have two fields: 'start_date' and 'end_date'.
    var result = item1.start_date - item2.start_date;

    // later first
    if (result < 0) {
      return -1;
    }
    if (result > 0) {
      return 1;
    }

    // shorter first
    result = item2.end_date - item1.end_date;
    if (result < 0) {
      return -1;
    }
    if (result > 0) {
      return 1;
    }

    // categorical tie-breaker
    if (item1.category < item2.category) {
      return -1;
    }
    if (item1.category > item2.category) {
      return 1;
    }

    // facet tie-breaker
    if (item1.facet < item2.facet) {
      return -1;
    }
    if (item1.facet > item2.facet) {
      return 1;
    }
    return 0;
  }

  // assign a track to each event item to prevent event overlap
  function assignTracks(data, tracks, layout) {
    // reset tracks first
    if (data && data.length) {
      data.forEach(function (item) {
        item.track = 0;
      });

      var i, track, min_width, effective_width;

      if (globals.date_granularity !== "epochs") {
        data.min_start_date = d3.min(data, function (d) {
          return d.start_date;
        });
        data.max_start_date = d3.max(data, function (d) {
          return d.start_date;
        });
        data.max_end_date = d3.max(data, function (d) {
          return d.end_date;
        });

        if (globals.width > instance._render_width - globals.margin.right - globals.margin.left - getScrollbarWidth()) {
          effective_width = instance._render_width - globals.margin.right - globals.margin.left - getScrollbarWidth();
        } else {
          effective_width = globals.width;
        }

        var w = effective_width - globals.padding.left - globals.padding.right - globals.unit_width,
            d = data.max_end_date.getTime() - data.min_start_date.getTime();

        if (globals.segment_granularity === "days") {
          min_width = 0;
        } else if (layout === "Segmented") {
          min_width = 0;
        } else {
          min_width = d / w * globals.unit_width;
        }
      }

      // older items end deeper
      data.forEach(function (item) {
        if (globals.date_granularity === "epochs") {
          item.track = 0;
        } else {
          for (i = 0, track = 0; i < tracks.length; i++, track++) {
            if (globals.segment_granularity === "days") {
              if (item.start_date.getTime() > tracks[i].getTime()) {
                break;
              }
            } else if (globals.segment_granularity === "weeks") {
              if (item.start_date.getTime() > tracks[i].getTime()) {
                break;
              }
            } else if (globals.segment_granularity === "months") {
              if (item.start_date.getTime() > tracks[i].getTime()) {
                break;
              }
            } else if (globals.segment_granularity === "years") {
              if (item.start_date.getTime() > tracks[i].getTime()) {
                break;
              }
            } else if (globals.segment_granularity === "decades" && globals.date_granularity === "days" && data.max_duration < 31) {
              if (item.start_date.getTime() > tracks[i].getTime()) {
                break;
              }
            } else if (globals.segment_granularity === "centuries" && globals.date_granularity === "days" && data.max_duration < 31) {
              if (item.start_date.getTime() > tracks[i].getTime()) {
                break;
              }
            } else if (globals.segment_granularity === "millenia") {
              if (item.start_date.getTime() > tracks[i].getTime()) {
                break;
              }
            } else if (item.start_date.getTime() > tracks[i].getTime()) {
              break;
            }
          }
          item.track = track;

          if (min_width > item.end_date.getTime() - item.start_date.getTime()) {
            tracks[track] = moment(item.end_date.getTime() + min_width).toDate();
          } else {
            tracks[track] = item.end_date;
          }
        }
      });

      globals.num_tracks = d3.max(data, function (d) {
        // eslint-disable-line no-shadow
        return d.track;
      });
    } else {
      globals.num_tracks = 0;
    }
  }

  // assign a track to each event item to prevent event overlap
  function assignSequenceTracks(data) {
    var angle = 0,
        j = 0;

    // reset tracks and indices first, assign spiral coordinates
    data.forEach(function (item) {
      item.item_index = j;
      if (!globals.dirty_curve) {
        item.curve_x = j * globals.spiral_padding % (globals.width - globals.margin.left - globals.margin.right - globals.spiral_padding - globals.unit_width);
        item.curve_y = Math.floor(j * globals.spiral_padding / (globals.width - globals.margin.left - globals.margin.right - globals.spiral_padding - globals.unit_width)) * globals.spiral_padding;
      }
      item.seq_track = 0;
      item.seq_index = 0;
      var radius = Math.sqrt(j + 1);
      angle += Math.asin(1 / radius);
      j++;
      item.spiral_index = j;
      item.spiral_x = Math.cos(angle) * (radius * globals.spiral_padding);
      item.spiral_y = Math.sin(angle) * (radius * globals.spiral_padding);
    });

    globals.max_item_index = d3.max(data, function (d) {
      return d.item_index;
    });

    var index = 0;
    if (globals.date_granularity !== "epochs") {
      globals.latest_start_date = data[0].start_date.getTime();
    }

    // older items end deeper
    data.forEach(function (item) {
      item.seq_index = index;
      item.seq_track = 0;
      index++;
    });

    globals.num_seq_tracks = d3.max(data, function (d) {
      return d.seq_track;
    });
  }

  // analyze each facet individually and assign within-facet tracks and relative start and end dates
  function processFacets() {
    globals.max_end_age = 0;
    globals.max_num_tracks = 0;
    globals.max_num_seq_tracks = 0;

    // calculate derived age measure for each event in each timeline
    globals.timeline_facets.forEach(function (timeline) {
      // determine maximum number of tracks for chronological and sequential scales
      assignTracks(timeline.values, [], "Faceted");
      assignSequenceTracks(timeline.values, []);
      timeline.values.num_tracks = d3.max(timeline.values, function (d) {
        return d.track;
      });
      timeline.values.num_seq_tracks = d3.max(timeline.values, function (d) {
        return d.seq_track;
      });

      if (timeline.values.num_tracks > globals.max_num_tracks) {
        globals.max_num_tracks = timeline.values.num_tracks + 1;
      }

      if (timeline.values.num_seq_tracks > globals.max_num_seq_tracks) {
        globals.max_num_seq_tracks = timeline.values.num_seq_tracks + 1;
      }

      timeline.values.min_start_date = d3.min(timeline.values, function (d) {
        return d.start_date;
      });

      var angle = 0;
      var i = 0;

      timeline.values.forEach(function (item) {
        // assign spiral coordinates
        var radius = Math.sqrt(i + 1);
        angle += Math.asin(1 / radius);
        i++;
        item.spiral_index = i;
        item.spiral_x = Math.cos(angle) * (radius * globals.spiral_padding);
        item.spiral_x = Math.sin(angle) * (radius * globals.spiral_padding);

        if (globals.date_granularity === "epochs") {
          item.start_age = item.start_date - timeline.values.min_start_date;
          item.start_age_label = "";
          item.end_age = item.end_date - timeline.values.min_start_date;
          item.end_age_label = "";
        } else {
          item.start_age = item.start_date - timeline.values.min_start_date;
          item.start_age_label = moment(timeline.values.min_start_date).from(moment(item.start_date), true);
          item.end_age = item.end_date - timeline.values.min_start_date;
          item.end_age_label = moment(timeline.values.min_start_date).from(moment(item.end_date), true);
        }
      });
      timeline.values.max_end_age = d3.max(timeline.values, function (d) {
        return d.end_age;
      });

      if (timeline.values.max_end_age > globals.max_end_age) {
        globals.max_end_age = timeline.values.max_end_age;
      }
    });
  }

  function getSegmentGranularity(min_date, max_date) {
    if (min_date === undefined || max_date === undefined) {
      return "";
    }

    var timeline_range, // limit the number of facets to less than 20, rounding up / down to nearest natural temporal boundary
    days_to_years; // flag for transitioning to granularities of years or longer

    if (globals.date_granularity === "days") {
      timeline_range = time.day.count(time.day.floor(min_date), time.day.floor(max_date));

      if (timeline_range <= 7) {
        return "days";
      } else if (timeline_range > 7 && timeline_range <= 42) {
        return "weeks";
      } else if (timeline_range > 42 && timeline_range <= 732) {
        return "months";
      }
      days_to_years = true;
    }
    if (globals.date_granularity === "years" || days_to_years) {
      timeline_range = max_date.getUTCFullYear() - min_date.getUTCFullYear();

      if (timeline_range <= 10) {
        return "years";
      } else if (timeline_range > 10 && timeline_range <= 100) {
        return "decades";
      } else if (timeline_range > 100 && timeline_range <= 1000) {
        return "centuries";
      }
      return "millenia";
    } else if (globals.date_granularity === "epochs") {
      return "epochs";
    }
  }

  function getSegment(item) {
    var segment = "";

    switch (globals.segment_granularity) {
      case "days":
        segment = moment(item.end_date).format("MMM Do");
        break;
      case "weeks":
        segment = moment(item).format("WW / YY");
        break;
      case "months":
        segment = moment(item).format("MM-YY (MMM)");
        break;
      case "years":
        segment = moment(item).format("YYYY");
        break;
      case "decades":
        segment = (Math.floor(item.getUTCFullYear() / 10) * 10).toString() + "s";
        break;
      case "centuries":
        segment = (Math.floor(item.getUTCFullYear() / 100) * 100).toString() + "s";
        break;
      case "millenia":
        segment = (Math.floor(item.getUTCFullYear() / 1000) * 1000).toString() + " - " + (Math.ceil((item.getUTCFullYear() + 1) / 1000) * 1000).toString();
        break;
      case "epochs":
      default:
        segment = "";
        break;
    }
    return segment;
  }

  function getSegmentList(start_date, end_date) {
    var segments_domain = [];
    switch (globals.segment_granularity) {

      case "days":
        var day_array = d3.timeDays(start_date, end_date);
        day_array.forEach(function (d) {
          segments_domain.push(getSegment(d));
        });
        break;

      case "weeks":
        var week_array = d3.timeWeeks(d3.timeWeek.floor(start_date), d3.timeWeek.ceil(end_date));
        week_array.forEach(function (d) {
          segments_domain.push(getSegment(d));
        });
        break;

      case "months":
        var month_array = d3.timeMonths(d3.timeMonth.floor(start_date), d3.timeMonth.ceil(end_date));
        month_array.forEach(function (d) {
          segments_domain.push(getSegment(d));
        });
        break;

      case "years":
        var year_array = d3.timeYears(d3.timeYear.floor(start_date), d3.timeYear.ceil(end_date));
        year_array.forEach(function (d) {
          segments_domain.push(getSegment(d));
        });
        break;

      case "decades":
        var min_decade_start_date = d3.timeYear.floor(start_date);
        var min_decade_offset = start_date.getUTCFullYear() % 10;
        if (min_decade_offset < 0) {
          min_decade_offset += 10;
        }
        min_decade_start_date.setUTCFullYear(start_date.getUTCFullYear() - min_decade_offset);
        var decade_array = d3.timeYears(d3.timeYear.floor(min_decade_start_date), d3.timeYear.ceil(end_date), 10);
        decade_array.forEach(function (d) {
          segments_domain.push(getSegment(d));
        });
        break;

      case "centuries":
        var min_century_start_date = d3.timeYear.floor(start_date);
        var min_century_offset = start_date.getUTCFullYear() % 100;
        if (min_century_offset < 0) {
          min_century_offset += 100;
        }
        min_century_start_date.setUTCFullYear(start_date.getUTCFullYear() - min_century_offset);
        var century_array = d3.timeYears(d3.timeYear.floor(min_century_start_date), d3.timeYear.ceil(end_date), 100);
        century_array.forEach(function (d) {
          segments_domain.push(getSegment(d));
        });
        break;

      case "millenia":
        var min_millenia_start_date = d3.timeYear.floor(start_date);
        var min_millenia_offset = start_date.getUTCFullYear() % 1000;
        if (min_millenia_offset < 0) {
          min_millenia_offset += 1000;
        }
        min_millenia_start_date.setUTCFullYear(start_date.getUTCFullYear() - min_millenia_offset);
        var millenia_array = d3.timeYears(d3.timeYear.floor(min_millenia_start_date), d3.timeYear.ceil(end_date), 1000);
        millenia_array.forEach(function (d) {
          segments_domain.push(getSegment(d));
        });
        break;

      case "epochs":
        segments_domain = [""];
        break;
      default:
        break;
    }
    return segments_domain;
  }

  // resizes the timeline container based on combination of scale, layout, representation
  function determineSize(data, scale, layout, representation) {
    logEvent("timeline: " + scale + " - " + layout + " - " + representation, "sizing");

    switch (representation) {

      case "Linear":
        switch (scale) {

          case "Chronological":
            switch (layout) {

              case "Unified":
                // justifiable
                assignTracks(data, [], layout);
                logEvent("# tracks: " + globals.num_tracks, "sizing");

                globals.width = instance._render_width - globals.margin.right - globals.margin.left - getScrollbarWidth();
                globals.height = globals.num_tracks * globals.track_height + 1.5 * globals.track_height + globals.margin.top + globals.margin.bottom;
                break;

              case "Faceted":
                // justifiable
                processFacets(data);
                logEvent("# within-facet tracks: " + (globals.max_num_tracks + 1), "sizing");

                globals.width = instance._render_width - globals.margin.right - globals.margin.left - getScrollbarWidth();
                globals.height = (globals.max_num_tracks * globals.track_height + 1.5 * globals.track_height) * globals.num_facets + globals.margin.top + globals.margin.bottom;
                break;

              case "Segmented":
                // justifiable
                assignTracks(data, [], layout);
                logEvent("# tracks: " + globals.num_tracks, "sizing");

                globals.width = instance._render_width - globals.margin.right - globals.margin.left - getScrollbarWidth();
                globals.height = (globals.num_tracks * globals.track_height + 1.5 * globals.track_height) * globals.num_segments + globals.margin.top + globals.margin.bottom;
                break;
              default:
                break;
            }
            break;

          case "Relative":
            if (layout === "Faceted") {
              // justifiable
              processFacets(data);
              logEvent("# within-facet tracks: " + (globals.max_num_tracks + 1), "sizing");

              globals.width = instance._render_width - globals.margin.right - globals.margin.left - getScrollbarWidth();
              globals.height = (globals.max_num_tracks * globals.track_height + 1.5 * globals.track_height) * globals.num_facets + globals.margin.top + globals.margin.bottom;
            } else {
              // not justifiable
              logEvent("scale-layout-representation combination not possible/justifiable", "error");

              globals.width = 0;
              globals.height = 0;
            }
            break;

          case "Log":
            if (layout === "Unified") {
              // justifiable
              assignTracks(data, [], layout);
              logEvent("# tracks: " + globals.num_tracks, "sizing");

              globals.width = instance._render_width - globals.margin.right - globals.margin.left - getScrollbarWidth();
              globals.height = globals.num_tracks * globals.track_height + 1.5 * globals.track_height + globals.margin.top + globals.margin.bottom;
            } else if (layout === "Faceted") {
              // justifiable
              processFacets(data);
              logEvent("# within-facet tracks: " + (globals.max_num_tracks + 1), "sizing");

              globals.width = instance._render_width - globals.margin.right - globals.margin.left - getScrollbarWidth();
              globals.height = (globals.max_num_tracks * globals.track_height + 1.5 * globals.track_height) * globals.num_facets + globals.margin.top + globals.margin.bottom;
            } else {
              // not justifiable
              logEvent("scale-layout-representation combination not possible/justifiable", "error");

              globals.width = 0;
              globals.height = 0;
            }
            break;

          case "Collapsed":
            if (layout === "Unified") {
              // justifiable
              assignSequenceTracks(data, []);
              globals.max_seq_index = d3.max(data, function (d) {
                return d.seq_index;
              }) + 1;
              var bar_chart_height = 4 * globals.unit_width;
              globals.width = globals.max_seq_index * 1.5 * globals.unit_width + globals.margin.left + 3 * globals.margin.right;
              globals.height = globals.num_seq_tracks * globals.track_height + 1.5 * globals.track_height + bar_chart_height + globals.margin.top + globals.margin.bottom;
            } else {
              // not justifiable
              logEvent("scale-layout-representation combination not possible/justifiable", "error");

              globals.width = 0;
              globals.height = 0;
            }
            break;

          case "Sequential":
            if (layout === "Unified") {
              // justifiable
              assignSequenceTracks(data, []);
              globals.max_seq_index = d3.max(data, function (d) {
                return d.seq_index;
              }) + 1;
              globals.width = d3.max([globals.max_seq_index * 1.5 * globals.unit_width + globals.margin.left + globals.margin.right, instance._render_width - globals.margin.right - globals.margin.left - getScrollbarWidth()]);
              globals.height = globals.num_seq_tracks * globals.track_height + 1.5 * globals.track_height + globals.margin.top + globals.margin.bottom;
            } else if (layout === "Faceted") {
              // justifiable
              processFacets(data);
              globals.max_seq_index = d3.max(data, function (d) {
                return d.seq_index;
              }) + 1;
              globals.width = d3.max([globals.max_seq_index * 1.5 * globals.unit_width + globals.margin.left + globals.margin.right, instance._render_width - globals.margin.right - globals.margin.left - getScrollbarWidth()]);
              globals.height = (globals.max_num_seq_tracks * globals.track_height + 1.5 * globals.track_height) * globals.num_facets + globals.margin.top + globals.margin.bottom;
            } else {
              // not justifiable
              logEvent("scale-layout-representation combination not possible/justifiable", "error");

              globals.width = 0;
              globals.height = 0;
            }
            break;
          default:
            break;
        }
        break;

      case "Radial":

        globals.centre_radius = 50;

        var effective_size = instance._render_width - globals.margin.right - globals.padding.right - globals.margin.left - globals.padding.left - getScrollbarWidth();

        switch (scale) {

          case "Chronological":

            switch (layout) {

              case "Unified":
                // justifiable
                assignTracks(data, [], layout);
                logEvent("# tracks: " + globals.num_tracks, "sizing");

                globals.centre_radius = d3.max([50, (effective_size - (globals.num_tracks + 2) * 2 * globals.track_height) / 2]);
                globals.width = 2 * globals.centre_radius + (globals.num_tracks + 2) * 2 * globals.track_height + globals.margin.left + globals.margin.right;
                if (globals.centre_radius > 200) {
                  globals.centre_radius = 200;
                }
                globals.height = 2 * globals.centre_radius + (globals.num_tracks + 2) * 2 * globals.track_height + globals.margin.top + globals.margin.bottom;
                break;

              case "Faceted":
                // justifiable
                processFacets(data);

                globals.centre_radius = 50;
                var estimated_facet_width = 2 * globals.centre_radius + (globals.max_num_tracks + 2) * 2 * globals.track_height;

                globals.num_facet_cols = d3.max([1, d3.min([globals.num_facet_cols, Math.floor(effective_size / estimated_facet_width)])]);
                globals.num_facet_rows = Math.ceil(globals.num_facets / globals.num_facet_cols);

                globals.centre_radius = d3.max([50, (effective_size / globals.num_facet_cols - (globals.max_num_tracks + 2) * 2 * globals.track_height) / 2]);
                globals.width = (2 * globals.centre_radius + (globals.max_num_tracks + 2) * 2 * globals.track_height) * globals.num_facet_cols + globals.margin.left + globals.margin.right;
                if (globals.centre_radius > 200) {
                  globals.centre_radius = 200;
                }
                globals.height = (2 * globals.centre_radius + (globals.max_num_tracks + 2) * 2 * globals.track_height) * globals.num_facet_rows + globals.margin.top + globals.margin.bottom + globals.num_facet_rows * globals.buffer;
                break;

              case "Segmented":
                // justifiable
                assignTracks(data, [], layout);
                logEvent("# tracks: " + globals.num_tracks, "sizing");

                globals.centre_radius = 50;
                var estimated_segment_width = 2 * globals.centre_radius + (globals.num_tracks + 2) * 2 * globals.track_height;

                globals.num_segment_cols = d3.max([1, d3.min([globals.num_segment_cols, Math.floor(effective_size / estimated_segment_width)])]);
                globals.num_segment_rows = Math.ceil(globals.num_segments / globals.num_segment_cols);

                globals.centre_radius = d3.max([50, (effective_size / globals.num_segment_cols - (globals.num_tracks + 2) * 2 * globals.track_height) / 2]);
                globals.width = (2 * globals.centre_radius + (globals.num_tracks + 2) * 2 * globals.track_height) * globals.num_segment_cols + globals.margin.left + globals.margin.right;
                if (globals.centre_radius > 200) {
                  globals.centre_radius = 200;
                }
                globals.height = (2 * globals.centre_radius + (globals.num_tracks + 2) * 2 * globals.track_height) * globals.num_segment_rows + globals.margin.top + globals.margin.bottom + globals.num_segment_rows * globals.buffer;
                break;
              default:
                break;
            }
            break;

          case "Relative":
            if (layout === "Faceted") {
              // justifiable
              processFacets(data);
              logEvent("# within-facet tracks: " + (globals.max_num_tracks + 1), "sizing");

              globals.centre_radius = 50;
              estimated_facet_width = 2 * globals.centre_radius + (globals.max_num_tracks + 2) * 2 * globals.track_height;

              globals.num_facet_cols = d3.min([globals.num_facet_cols, Math.floor(effective_size / estimated_facet_width)]);
              globals.num_facet_rows = Math.ceil(globals.num_facets / globals.num_facet_cols);

              globals.centre_radius = d3.max([50, (effective_size / globals.num_facet_cols - (globals.max_num_tracks + 2) * 2 * globals.track_height) / 2]);
              globals.width = (2 * globals.centre_radius + (globals.max_num_tracks + 2) * 2 * globals.track_height) * globals.num_facet_cols + globals.margin.left + globals.margin.right;
              if (globals.centre_radius > 200) {
                globals.centre_radius = 200;
              }
              globals.height = (2 * globals.centre_radius + (globals.max_num_tracks + 2) * 2 * globals.track_height) * globals.num_facet_rows + globals.margin.top + globals.margin.bottom + globals.num_facet_rows * globals.buffer;
            } else {
              // not justifiable
              logEvent("scale-layout-representation combination not possible/justifiable", "error");

              globals.width = 0;
              globals.height = 0;
            }
            break;

          case "Sequential":
            if (layout === "Unified") {
              // justifiable
              assignSequenceTracks(data, []);
              globals.max_seq_index = d3.max(data, function (d) {
                return d.seq_index;
              }) + 1;
              globals.centre_radius = (effective_size - 4 * globals.track_height) / 2;
              globals.width = 2 * globals.centre_radius + 4 * globals.track_height + globals.margin.left + globals.margin.right;
              if (globals.centre_radius > 200) {
                globals.centre_radius = 200;
              }
              globals.height = 2 * globals.centre_radius + 4 * globals.track_height + globals.margin.top + globals.margin.bottom;
            } else if (layout === "Faceted") {
              // justifiable

              processFacets(data);
              globals.max_seq_index = d3.max(data, function (d) {
                return d.seq_index;
              }) + 1;

              globals.centre_radius = 50;
              estimated_facet_width = 2 * globals.centre_radius + 4 * globals.track_height;

              globals.num_facet_cols = d3.min([globals.num_facet_cols, Math.floor(effective_size / estimated_facet_width)]);
              globals.num_facet_rows = Math.ceil(globals.num_facets / globals.num_facet_cols);

              globals.centre_radius = d3.max([50, (effective_size / globals.num_facet_cols - 4 * globals.track_height) / 2]);
              globals.width = (2 * globals.centre_radius + 4 * globals.track_height) * globals.num_facet_cols + globals.margin.left + globals.margin.right;
              if (globals.centre_radius > 200) {
                globals.centre_radius = 200;
              }
              globals.height = (2 * globals.centre_radius + 4 * globals.track_height) * globals.num_facet_rows + globals.margin.top + globals.margin.bottom + globals.num_facet_rows * globals.buffer;
            } else {
              // not justifiable
              logEvent("scale-layout-representation combination not possible/justifiable", "error");

              globals.width = 0;
              globals.height = 0;
            }
            break;
          default:
            break;
        }
        break;

      case "Grid":

        if (scale === "Chronological" && layout === "Segmented") {
          // justifiable

          assignTracks(data, [], layout);

          var cell_size = 50,
              century_height = cell_size * globals.unit_width,
              century_width = cell_size * 10;

          // determine the range, round to whole centuries
          var range_floor = Math.floor(data.min_start_date.getUTCFullYear() / 100) * 100,
              range_ceil = Math.ceil((data.max_end_date.getUTCFullYear() + 1) / 100) * 100;

          // determine the time domain of the data along a linear quantitative scale
          var year_range = d3.range(range_floor, range_ceil);

          // determine maximum number of centuries given year_range
          var num_centuries = Math.ceil(year_range.length / 100);

          globals.width = century_width + globals.margin.left + globals.margin.right;
          globals.height = num_centuries * century_height + num_centuries * cell_size + globals.margin.top + globals.margin.bottom - cell_size;
        } else {
          // not justifiable
          logEvent("scale-layout-representation combination not possible/justifiable", "error");

          globals.width = 0;
          globals.height = 0;
        }
        break;

      case "Calendar":

        if (scale === "Chronological" && layout === "Segmented") {
          // justifiable

          assignTracks(data, [], layout);

          cell_size = 20;
          var year_height = cell_size * 8,
              // 7 days of week + buffer
          year_width = cell_size * 53; // 53 weeks of the year + buffer

          // determine the range, round to whole centuries
          range_floor = data.min_start_date.getUTCFullYear();
          range_ceil = data.max_end_date.getUTCFullYear();

          // determine the time domain of the data along a linear quantitative scale
          year_range = d3.range(range_floor, range_ceil + 1);

          globals.width = year_width + globals.margin.left + globals.margin.right;
          globals.height = year_range.length * year_height + globals.margin.top + globals.margin.bottom - cell_size;
        } else {
          // not justifiable
          logEvent("scale-layout-representation combination not possible/justifiable", "error");

          globals.width = 0;
          globals.height = 0;
        }
        break;

      case "Spiral":

        if (scale === "Sequential") {
          if (layout === "Unified") {
            // justifiable

            assignSequenceTracks(data, []);
            globals.max_seq_index = d3.max(data, function (d) {
              return d.seq_index;
            }) + 1;
            var angle = 0,
                i = 0;

            data.forEach(function (item) {
              var radius = Math.sqrt(i + 1);
              angle += Math.asin(1 / radius);
              i++;
              item.spiral_index = i;
              item.spiral_x = Math.cos(angle) * (radius * globals.spiral_padding);
              item.spiral_y = Math.sin(angle) * (radius * globals.spiral_padding);
            });

            var max_x = d3.max(data, function (d) {
              return d.spiral_x;
            });
            var max_y = d3.max(data, function (d) {
              return d.spiral_y;
            });
            var min_x = d3.min(data, function (d) {
              return d.spiral_x;
            });
            var min_y = d3.min(data, function (d) {
              return d.spiral_y;
            });

            globals.spiral_dim = d3.max([max_x + 2 * globals.spiral_padding - (min_x - 2 * globals.spiral_padding), max_y + 2 * globals.spiral_padding - (min_y - 2 * globals.spiral_padding)]);

            globals.width = d3.max([globals.spiral_dim + globals.spiral_padding + globals.margin.right + globals.margin.left, instance._render_width - globals.margin.right - globals.margin.left - getScrollbarWidth()]);

            // USES EFFECTIVE_HEIGHT
            globals.height = d3.max([globals.spiral_dim + globals.spiral_padding + globals.margin.top + globals.margin.bottom, instance._render_height - globals.margin.top - globals.margin.bottom - getScrollbarWidth()]);
          } else if (layout === "Faceted") {
            // justifiable
            processFacets(data);
            globals.max_seq_index = d3.max(data, function (d) {
              return d.seq_index;
            }) + 1;

            globals.timeline_facets.forEach(function (timeline) {
              angle = 0;
              i = 0;

              timeline.values.forEach(function (item) {
                var radius = Math.sqrt(i + 1);
                angle += Math.asin(1 / radius);
                i++;
                item.spiral_index = i;
                item.spiral_x = Math.cos(angle) * (radius * globals.spiral_padding);
                item.spiral_y = Math.sin(angle) * (radius * globals.spiral_padding);
              });
            });

            max_x = d3.max(data, function (d) {
              return d.spiral_x;
            });
            max_y = d3.max(data, function (d) {
              return d.spiral_y;
            });
            min_x = d3.min(data, function (d) {
              return d.spiral_x;
            });
            min_y = d3.min(data, function (d) {
              return d.spiral_y;
            });

            globals.spiral_dim = d3.max([max_x + 2 * globals.spiral_padding - (min_x - 2 * globals.spiral_padding), max_y + 2 * globals.spiral_padding - (min_y - 2 * globals.spiral_padding)]);

            effective_size = instance._render_width - globals.margin.right - globals.margin.left - getScrollbarWidth();

            globals.num_facet_cols = d3.min([globals.num_facet_cols, Math.floor(effective_size / globals.spiral_dim)]);
            globals.num_facet_rows = Math.ceil(globals.num_facets / globals.num_facet_cols);

            globals.width = d3.max([globals.num_facet_cols * globals.spiral_dim + globals.margin.right + globals.margin.left, instance._render_width - globals.margin.right - globals.margin.left - getScrollbarWidth()]);
            globals.height = globals.num_facet_rows * globals.spiral_dim + globals.margin.top + globals.margin.bottom;
          } else {
            // not justifiable
            globals.width = 0;
            globals.height = 0;
          }
        } else {
          // not justifiable
          logEvent("scale-layout-representation combination not possible/justifiable", "error");

          globals.width = 0;
          globals.height = 0;
        }
        break;

      case "Curve":
        if (scale === "Sequential" && layout === "Unified") {
          // justifiable
          assignSequenceTracks(data, []);
          globals.max_seq_index = d3.max(data, function (d) {
            return d.seq_index;
          }) + 1;
          globals.width = instance._render_width - globals.margin.right - globals.margin.left - getScrollbarWidth();
          globals.height = instance._render_height - globals.margin.top - globals.margin.bottom - getScrollbarWidth();
        } else {
          // not justifiable
          logEvent("scale-layout-representation combination not possible/justifiable", "error");

          globals.width = 0;
          globals.height = 0;
        }
        break;
      default:
        break;
    }
    logEvent("dimensions: " + globals.width + " (W) x " + globals.height + " (H)", "sizing");
  }

  instance._determineSize = determineSize;

  function updateRadioBttns(scale, layout, representation) {
    // update the control radio buttons
    selectAllWithParent("#scale_picker input[name=scale_rb]").property("checked", function (d) {
      return d === scale;
    });
    selectAllWithParent("#layout_picker input[name=layout_rb]").property("checked", function (d) {
      return d === layout;
    });
    selectAllWithParent("#representation_picker input[name=representation_rb]").property("checked", function (d) {
      return d === representation;
    });

    selectAllWithParent("#scale_picker img").style("border-bottom", function (d) {
      if (d.name === scale) {
        return "2px solid #f00";
      }
    }).style("border-right", function (d) {
      if (d.name === scale) {
        return "2px solid #f00";
      }
    });
    selectAllWithParent("#layout_picker img").style("border-bottom", function (d) {
      if (d.name === layout) {
        return "2px solid #f00";
      }
    }).style("border-right", function (d) {
      if (d.name === layout) {
        return "2px solid #f00";
      }
    });
    selectAllWithParent("#representation_picker img").style("border-bottom", function (d) {
      if (d.name === representation) {
        return "2px solid #f00";
      }
    }).style("border-right", function (d) {
      if (d.name === representation) {
        return "2px solid #f00";
      }
    });

    selectAllWithParent(".option_rb").select("input").property("disabled", function (d) {
      switch (d.name) {

        case "Chronological":
          return !(representation !== "Spiral" && representation !== "Curve");

        case "Relative":
          return !(layout === "Faceted" && (representation === "Linear" || representation === "Radial"));

        case "Log":
          return !(representation === "Linear" && layout !== "Segmented");

        case "Collapsed":
          return !(representation === "Linear" && layout === "Unified");

        case "Sequential":
          return !(representation !== "Grid" && representation !== "Calendar" && layout !== "Segmented");

        case "Unified":
          return !(scale !== "Relative" && representation !== "Grid" && representation !== "Calendar");

        case "Faceted":
          return !(scale !== "Collapsed" && representation !== "Grid" && representation !== "Calendar" && representation !== "Curve" && globals.total_num_facets > 1);

        case "Segmented":
          return !(scale === "Chronological" && representation !== "Spiral" && representation !== "Curve");

        case "Linear":
          return false;

        case "Calendar":
          return !(scale === "Chronological" && layout === "Segmented" && ["weeks", "months", "years", "decades"].indexOf(globals.segment_granularity) !== -1);

        case "Grid":
          return !(scale === "Chronological" && layout === "Segmented" && ["decades", "centuries", "millenia"].indexOf(globals.segment_granularity) !== -1);

        case "Radial":
          return !(scale !== "Log" && scale !== "Collapsed");

        case "Spiral":
          return !(scale === "Sequential" && (layout === "Unified" || layout === "Faceted"));

        case "Curve":
          return !(scale === "Sequential" && layout === "Unified");
        default:
          return;
      }
    });

    selectAllWithParent(".option_rb").select("img").attr("class", function (d) {
      switch (d.name) {
        case "Chronological":
          return representation !== "Spiral" && representation !== "Curve" ? "img_btn_enabled" : "img_btn_disabled";
        case "Relative":
          return layout === "Faceted" && (representation === "Linear" || representation === "Radial") ? "img_btn_enabled" : "img_btn_disabled";
        case "Log":
          return representation === "Linear" && layout !== "Segmented" ? "img_btn_enabled" : "img_btn_disabled";
        case "Collapsed":
          return representation === "Linear" && layout === "Unified" ? "img_btn_enabled" : "img_btn_disabled";
        case "Sequential":
          return representation !== "Grid" && representation !== "Calendar" && layout !== "Segmented" ? "img_btn_enabled" : "img_btn_disabled";
        case "Unified":
          return scale !== "Relative" && representation !== "Grid" && representation !== "Calendar" ? "img_btn_enabled" : "img_btn_disabled";
        case "Faceted":
          return scale !== "Collapsed" && representation !== "Grid" && representation !== "Calendar" && representation !== "Curve" && globals.total_num_facets > 1 ? "img_btn_enabled" : "img_btn_disabled";
        case "Segmented":
          return scale === "Chronological" && representation !== "Spiral" && representation !== "Curve" ? "img_btn_enabled" : "img_btn_disabled";
        case "Linear":
          return "img_btn_enabled";
        case "Calendar":
          return scale === "Chronological" && layout === "Segmented" && ["weeks", "months", "years", "decades"].indexOf(globals.segment_granularity) !== -1 ? "img_btn_enabled" : "img_btn_disabled";
        case "Grid":
          return scale === "Chronological" && layout === "Segmented" && ["decades", "centuries", "millenia"].indexOf(globals.segment_granularity) !== -1 ? "img_btn_enabled" : "img_btn_disabled";
        case "Radial":
          return scale !== "Log" && scale !== "Collapsed" ? "img_btn_enabled" : "img_btn_disabled";
        case "Spiral":
          return scale === "Sequential" && (layout === "Unified" || layout === "Faceted") ? "img_btn_enabled" : "img_btn_disabled";
        case "Curve":
          return scale === "Sequential" && layout === "Unified" ? "img_btn_enabled" : "img_btn_disabled";
        default:
          return;
      }
    });
  }

  // highlight matches and de-emphasize (grey-out) mismatches
  globals.dispatch.on("Emphasize", function (selected_categories, selected_facets, selected_segments) {
    var timeline_events = selectAllWithParent(".timeline_event_g");
    var matches,
        mismatches,
        selected_category_values = [],
        selected_facet_values = [],
        selected_segment_values = [];

    globals.prev_active_event_list = globals.active_event_list;

    globals.active_event_list = [];

    selected_categories[0].forEach(function (item) {
      selected_category_values.push(item.__data__);
    });

    selected_facets[0].forEach(function (item) {
      selected_facet_values.push(item.__data__);
    });

    selected_segments[0].forEach(function (item) {
      selected_segment_values.push(item.__data__);
    });

    mismatches = timeline_events.filter(function (d) {
      return selected_category_values.indexOf("( All )") === -1 && selected_category_values.indexOf(d.category) === -1 || selected_facet_values.indexOf("( All )") === -1 && selected_facet_values.indexOf(d.facet) === -1 || selected_segment_values.indexOf("( All )") === -1 && selected_segment_values.indexOf(d.segment) === -1;
    });

    matches = timeline_events.filter(function (d) {
      return (selected_category_values.indexOf("( All )") !== -1 || selected_category_values.indexOf(d.category) !== -1) && (selected_facet_values.indexOf("( All )") !== -1 || selected_facet_values.indexOf(d.facet) !== -1) && (selected_segment_values.indexOf("( All )") !== -1 || selected_segment_values.indexOf(d.segment) !== -1);
    });

    if (mismatches.size() !== 0) {
      logEvent(matches.size() + " out of " + (matches.size() + mismatches.size()) + " events", "Emphasize");
    } else {
      logEvent(matches.size() + " events", "Emphasize");
    }

    globals.all_data.forEach(function (item) {
      if ((selected_category_values.indexOf("( All )") !== -1 || selected_category_values.indexOf(item.category) !== -1) && (selected_facet_values.indexOf("( All )") !== -1 || selected_facet_values.indexOf(item.facet) !== -1) && (selected_segment_values.indexOf("( All )") !== -1 || selected_segment_values.indexOf(item.segment) !== -1)) {
        globals.active_event_list.push(item.event_id);
      }
    });

    main_svg.call(timeline_vis.duration(instance._getAnimationStepDuration()));

    globals.prev_active_event_list = globals.active_event_list;
  });

  // remove mismatches
  globals.dispatch.on("remove", function (selected_categories, selected_facets, selected_segments) {
    instance.clearCanvas();

    var active_event_list = [];

    var matches,
        mismatches,
        selected_category_values = [],
        selected_facet_values = [],
        selected_segment_values = [],
        reset_segmented_layout = false;

    selected_categories[0].forEach(function (item) {
      selected_category_values.push(item.__data__);
    });

    selected_facets[0].forEach(function (item) {
      selected_facet_values.push(item.__data__);
    });

    selected_segments[0].forEach(function (item) {
      selected_segment_values.push(item.__data__);
    });

    globals.all_data.forEach(function (item) {
      if ((selected_category_values.indexOf("( All )") !== -1 || selected_category_values.indexOf(item.category) !== -1) && (selected_facet_values.indexOf("( All )") !== -1 || selected_facet_values.indexOf(item.facet) !== -1) && (selected_segment_values.indexOf("( All )") !== -1 || selected_segment_values.indexOf(item.segment) !== -1)) {
        active_event_list.push(item.event_id);
      }
    });

    mismatches = selectAllWithParent(".timeline_event_g").filter(function (d) {
      return active_event_list.indexOf(d.event_id) === -1;
    });

    matches = selectAllWithParent(".timeline_event_g").filter(function (d) {
      return active_event_list.indexOf(d.event_id) !== -1;
    });

    var active_data = globals.all_data.filter(function (d) {
      return active_event_list.indexOf(d.event_id) !== -1;
    });

    // We only support having at least on item.
    if (active_data.length > 0) {
      globals.prev_active_event_list = globals.active_event_list;
      globals.active_event_list = active_event_list;
      globals.active_data = active_data;

      if (mismatches.size() !== 0) {
        logEvent(matches.size() + " out of " + (matches.size() + mismatches.size()) + " events", "remove");
      } else {
        logEvent(matches.size() + " events", "remove");
      }

      measureTimeline(globals.active_data);

      globals.active_data.min_start_date = d3.min(globals.active_data, function (d) {
        return d.start_date;
      });
      globals.active_data.max_start_date = d3.max(globals.active_data, function (d) {
        return d.start_date;
      });
      globals.active_data.max_end_date = d3.max(globals.active_data, function (d) {
        return time.minute.floor(d.end_date);
      });

      globals.all_data.min_start_date = globals.active_data.min_start_date;
      globals.all_data.max_end_date = globals.active_data.max_end_date;

      globals.max_end_age = 0;

      // determine facets (separate timelines) from data
      globals.facets.domain(globals.active_data.map(function (d) {
        return d.facet;
      }));

      globals.facets.domain(globals.facets.domain().sort());

      globals.num_facets = globals.facets.domain().length;
      globals.num_facet_cols = Math.ceil(Math.sqrt(globals.num_facets));
      globals.num_facet_rows = Math.ceil(globals.num_facets / globals.num_facet_cols);

      logEvent("num facets: " + globals.num_facet_cols, "remove");

      if (timeline_vis.tl_layout() === "Segmented") {
        if (timeline_vis.tl_representation() === "Grid") {
          globals.segment_granularity = "centuries";
        } else if (timeline_vis.tl_representation() === "Calendar") {
          globals.segment_granularity = "weeks";
        } else {
          globals.segment_granularity = getSegmentGranularity(globals.global_min_start_date, globals.global_max_end_date);
        }
      }

      var segment_list = getSegmentList(globals.active_data.min_start_date, globals.active_data.max_end_date);

      globals.segments.domain(segment_list.map(function (d) {
        return d;
      }));

      logEvent("segments (" + globals.segments.domain().length + "): " + globals.segments.domain(), "preprocessing");

      globals.num_segments = globals.segments.domain().length;
      globals.num_segment_cols = Math.ceil(Math.sqrt(globals.num_segments));
      globals.num_segment_rows = Math.ceil(globals.num_segments / globals.num_segment_cols);

      determineSize(globals.active_data, timeline_vis.tl_scale(), timeline_vis.tl_layout(), timeline_vis.tl_representation());

      logEvent("num facets after sizing: " + globals.num_facet_cols, "remove");

      adjustSvgSize();

      main_svg.datum(globals.active_data).call(timeline_vis.duration(instance._getAnimationStepDuration()).height(globals.height).width(globals.width));

      instance._hideError();
      instance._main_svg.style("opacity", 1);

      if (reset_segmented_layout) {
        mismatches = selectAllWithParent(".timeline_event_g").filter(function (d) {
          return globals.active_event_list.indexOf(d.event_id) === -1;
        });

        matches = selectAllWithParent(".timeline_event_g").filter(function (d) {
          return globals.active_event_list.indexOf(d.event_id) !== -1;
        });
      }

      globals.prev_active_event_list = globals.active_event_list;
    } else {
      instance._main_svg.style("opacity", 0);
      instance._showError(tr("No data available for the selected set of filters."));
    }
  });

  selectWithParent().append("div").attr("id", "hint_div").attr("class", "control_div");

  var intro_div = selectWithParent("#hint_div").append("div").attr("id", "intro_div");

  intro_div.append("div").attr("class", "intro_btn").html("<a title='" + tr("About & getting started") + "' href='" + helpUrl + "' target='_blank'><img src='" + imageUrls("q.png") + "' width=30 height=30 class='img_btn_enabled'></img></a>");

  /**
   * Sets the color for the given category
   * @param {string} category The category to change
   * @param {number} categoryIndex The index of the category
   * @param {string} value The category color
   * @returns {void}
   */
  this._setCategoryColor = function (category, categoryIndex, value) {
    globals.color_swap_target = globals.categories.range().indexOf(globals.categories(category));
    log("category " + categoryIndex + ": " + category + " / " + value + " (index # " + globals.color_swap_target + ")");

    setScaleValue(globals.categories, category, value);

    globals.use_custom_palette = true;
  };

  /**
   * Loads the data from the given state
   * @param {object} state The state to load data from
   * @param {number} min_story_height The minimum height to show the story
   * @returns {void}
   */
  this._loadTimelineFromState = function (state, min_story_height) {
    var timelineData = state.timeline_json_data;
    var hasScenes = !!(state.scenes && state.scenes.length);

    /**
     * {
     *    timeline_json_data: ...,
     *    scenes: ...,
     *    caption_list: ...,
     *    image_list: ...,
     *    annotation_list: ...,
     *    width: ...,
     *    height: ...
     * }
     */

    globals.timeline_json_data = timelineData;
    if (hasScenes) {
      if (state.color_palette !== undefined) {
        globals.color_palette = state.color_palette;
        globals.use_custom_palette = true;
      }
      globals.scenes = state.scenes;
      globals.caption_list = state.caption_list;
      globals.image_list = state.image_list;
      globals.annotation_list = state.annotation_list;

      var min_story_width = instance._render_width,
          max_story_width = instance._render_width;

      globals.scenes.forEach(function (d, i) {
        if (d.s_order === undefined) {
          d.s_order = i;
        }
        if (d.s_width + globals.margin.left + globals.margin.right + getScrollbarWidth() < min_story_width) {
          min_story_width = d.s_width + globals.margin.left + globals.margin.right + getScrollbarWidth();
        }
        if (d.s_width + globals.margin.left + globals.margin.right + getScrollbarWidth() > max_story_width) {
          max_story_width = d.s_width + globals.margin.left + globals.margin.right + getScrollbarWidth();
        }
        if (d.s_height + globals.margin.top + globals.margin.bottom + getScrollbarWidth() < min_story_height) {
          min_story_height = d.s_height + globals.margin.top + globals.margin.bottom + getScrollbarWidth();
        }
      });

      if (state.width === undefined) {
        if (max_story_width > instance._render_width) {
          state.width = max_story_width;
        } else {
          state.width = min_story_width;
        }
      }
      if (state.height === undefined) {
        state.height = min_story_height;
      }

      log("s_width: " + state.width + "; window_width: " + instance._render_width);
      instance._render_width = state.width;
      instance._render_height = state.height;
    }

    initTimelineData(timelineData, hasScenes);

    if (hasScenes) {
      updateNavigationStepper();
    }
  };
}

/**
 * The default set of options
 */
TimelineStoryteller.DEFAULT_OPTIONS = Object.freeze({

  /**
   * If true, the about bar is shown
   */
  showAbout: true,

  /**
   * If true, the chart view options are shown
   */
  showViewOptions: true,

  /**
   * If true, when TimelineStoryteller is initially loaded, it will show the intro import dialog
   */
  showIntro: true,

  /**
   * If true, import options/open will be enabled
   */
  showImportOptions: true,

  /**
   * Shows the hints popup
   */
  showHints: true,

  /**
   * If true, load data options will be shown on the import popup
   */
  showImportLoadDataOptions: true,

  /**
   * If true, animations will be enabled
   */
  animations: true,

  /**
   * The duration between animations
   */
  animationStepDuration: 1200,

  menu: {
    open: {
      label: tr("Open"),
      items: [{
        name: tr("Load timeline data"),
        image: imageUrls("open.png"),
        id: "import_visible_btn",
        click: function click(instance) {
          selectWithParent("#filter_div").style("display", "none");
          selectWithParent("#caption_div").style("display", "none");
          instance._addImagePopup.reset();
          selectWithParent("#export_div").style("top", -185 + "px");

          logEvent("open import panel", "load");

          if (instance.importPanel.visible) {
            instance.importPanel.hide();
          } else {
            instance.importPanel.show();
          }
        }
      }]
    },
    annotate: {
      label: tr("Annotate"),
      items: [{
        name: tr("Add caption"),
        image: imageUrls("caption.png"),
        click: function click(instance) {
          logEvent("open caption dialog", "annotation");

          selectWithParent("#filter_div").style("display", "none");
          instance._addImagePopup.reset();
          if (selectWithParent("#caption_div").style("display") !== "none") {
            selectWithParent("#caption_div").style("display", "none");
          } else {
            selectWithParent("#caption_div").style("display", "inline");
          }
        }
      }, {
        name: tr("Add image"),
        image: imageUrls("image.png"),
        click: function click(instance) {
          logEvent("open image dialog", "annotation");

          selectWithParent("#filter_div").style("display", "none");
          selectWithParent("#caption_div").style("display", "none");
          if (!instance._addImagePopup.hidden()) {
            instance._addImagePopup.reset();
          } else {
            instance._addImagePopup.show();
          }
        }
      }, {
        name: tr("Clear annotations, captions, & images"),
        image: imageUrls("clear.png"),
        click: function click(instance) {
          instance.clearCanvas();
        }
      }]
    },
    filter: {
      label: tr("Filter"),
      items: [{
        text: tr("Export"),
        image: imageUrls("filter.png"),
        click: function click(instance) {
          logEvent("open filter dialog", "filter");

          if (d3.select(this).attr("class") === "img_btn_enabled") {
            selectWithParent("#caption_div").style("display", "none");
            instance._addImagePopup.reset();
            if (selectWithParent("#filter_div").style("display") === "none") {
              selectWithParent("#filter_div").style("display", "inline");
              globals.effective_filter_width = instance._component_width - parseInt(selectWithParent("#filter_div").style("width"), 10) - getScrollbarWidth() - 10;
              globals.effective_filter_height = instance._component_height - parseInt(selectWithParent("#filter_div").style("height"), 10) - 25 - getScrollbarWidth() - parseInt(selectWithParent("#navigation_div").style("height"), 10) - 10;
            } else {
              selectWithParent("#filter_div").style("display", "none");
            }
          }
        } // The click handler
      }]
    },
    export: {
      label: tr("Export"),
      items: [{
        text: tr("Export"),
        image: imageUrls("export.png"),
        click: function click(instance) {
          selectWithParent("#filter_div").style("display", "none");
          selectWithParent("#caption_div").style("display", "none");
          instance._addImagePopup.reset();

          instance.importPanel.hide();

          logEvent("show export panel", "export");

          if (selectWithParent("#export_div").style("top") !== -185 + "px") {
            selectWithParent("#export_div").style("top", -185 + "px");
          } else {
            selectWithParent("#export_div").style("top", "25%");
          }
        } // The click handler
      }]
    }
  },
  export: {
    /**
     * If true, the image export options will be available
     */
    images: true
  },
  import: {
    storyMenu: {
      items: {
        demo: {
          visible: function visible(instance) {
            return instance._showDemoStory();
          },
          text: tr("Load Demo Story"),
          image: imageUrls("demo_story.png"),
          click: function click(instance) {
            logEvent("demo story source", "load");

            selectWithParent("#timeline_metadata").style("display", "none");
            instance.importPanel.hide();

            setTimeout(function () {
              instance.load(window.timeline_story_demo_story, true);
            }, 500);
          }
        },
        file: {
          text: tr("Load Saved Story"),
          image: imageUrls("story.png"),
          width: 40,
          height: 40,
          init: function init(inst, element) {
            element.append("input").call(utils.attrs({
              type: "file",
              id: "story_uploader",
              style: "opacity:0;width:100%;height:100%;cursor:pointer;cursor:pointer",
              accept: ".cdc"
            })).on("change", function () {
              var file = this.files[0];
              globals.reader.readAsText(file);

              globals.reader.onload = function (e) {
                var contents = e.target.result;
                inst.load(JSON.parse(contents), true);
              };
            });
          }
        }
      }
    },
    dataMenu: {
      items: {
        demo: {
          visible: function visible(instance) {
            return instance._showDemoData();
          },
          name: tr("Load Demo Data"),
          image: imageUrls("demo.png"),
          init: function init(that, element) {
            var demoData = window.timeline_story_demo_data;
            var demoOptions = Object.keys(demoData).map(function (path) {
              return {
                path: path,
                tl_name: demoData[path].name
              };
            });
            element.append("select").attr("id", "demo_dataset_picker").attr("title", tr("Load demo dataset")).attr("style", "top:0;left:0").on("change", function () {
              var source = d3.select(this).property("value");
              if (source !== "") {
                setTimeout(function () {
                  logEvent("loading (demo_story)", "load");
                  that.load({ timeline_json_data: demoData[source].data }, false);
                }, 500);
              } else {
                globals.source = source;
              }
            }).selectAll("option").data([{ "path": "", "tl_name": "" }].concat(demoOptions)) // Blank + demo options
            .enter().append("option").attr("value", function (d) {
              return d.path;
            }).text(function (d) {
              return d.tl_name;
            });
          }
        },
        json: {
          name: tr("Load from JSON"),
          image: imageUrls("json.png"),
          init: function init(inst, element) {
            element.append("input").call(utils.attrs({
              type: "file",
              id: "json_uploader",
              style: "display:none;",
              accept: ".json"
            })).on("change", function () {
              var file = this.files[0];
              globals.reader.readAsText(file);
              globals.reader.onload = function (e) {
                var contents = e.target.result;
                var blob = new Blob([contents], { type: "application/json" });
                setTimeout(function () {
                  logEvent("loading (json)", "load");
                  d3.json(URL.createObjectURL(blob)).then(function (data) {
                    inst.load(data.timeline_json_data ? data : { timeline_json_data: data }, false);
                  });
                }, 500);
              };
            });
          },
          click: function click(inst, element) {
            element.select("#json_uploader").node().click();
          }
        },
        csv: {
          name: tr("Load from CSV"),
          image: imageUrls("csv.png"),
          init: function init(inst, element) {
            element.append("input").call(utils.attrs({
              type: "file",
              id: "csv_uploader",
              style: "opacity:0;width:100%;height:100%;cursor:pointer",
              accept: ".csv"
            })).on("change", function () {
              var file = this.files[0];
              globals.reader.readAsText(file);
              globals.reader.onload = function (e) {
                var contents = e.target.result;
                var blob = new Blob([contents], { type: "application/csv" });
                setTimeout(function () {
                  logEvent("loading (csv)", "load");
                  d3.csv(URL.createObjectURL(blob)).then(function (data) {
                    inst.load({ timeline_json_data: data }, false);
                  });
                }, 500);
              };
            });
          }
        }
      }
    }
  }
});

/**
 * Initializes the popup menu
 * @param {object} menu The JSON object representing the menu
 * @returns {void}
 * {
 *    export: {
 *      label: tr("Export"),
 *      items: [{
 *         text: tr("Export"),
 *         image: "http://image.com/img.jpg",
 *         height: 30,// optional,
 *         width: 30, // optional
 *         class: "custom" // The custom class to bind to this item,
 *         click: function() { } // The click handler
 *      }]
 *    },
 *    annotate: {
 *      label: tr("Annotate")
 *    }
 * }
 */
TimelineStoryteller.prototype._initializeMenu = function (menu) {
  var that = this;
  var sectionNames = Object.keys(menu);

  // Clear it out first
  this._control_panel.selectAll("*").remove();

  sectionNames.forEach(function (name, i) {
    var section = menu[name];
    // No need for an HR if it is the first item
    if (i > 0) {
      that._control_panel.append("hr").style("margin-bottom", "0px").attr("class", "menu_hr");
    }

    that._control_panel.append("text").attr("class", "menu_label").text(section.label);

    // support both arrays and object based items definitions.
    var sectionItems = {};
    if (section.items) {
      if (section.items.forEach) {
        section.items.forEach(function (item, itemIdx) {
          sectionItems["item" + itemIdx] = item;
        });
      } else {
        sectionItems = section.items;
      }
    }
    Object.keys(sectionItems).forEach(function (itemKey) {
      var item = sectionItems[itemKey];
      var itemEle = that._control_panel.append("input").call(utils.attrs({
        type: "image",
        name: item.text || item.name,
        class: "img_btn_disabled" + (" " + (item.class || "")),
        src: item.image,
        title: item.text || item.name
      }));
      itemEle.call(utils.styles({
        height: (item.height || 30) + "px",
        width: (item.width || 30) + "px"
      }));
      if (item.id) {
        itemEle.attr("id", item.id);
      }
      if (item.click) {
        itemEle.on("click", function () {
          item.click.call(this, that);
        });
      }
    });
  });

  selectAllWithParent("#menu_div").style("display", sectionNames.length > 0 ? "block" : "none");
};

/**
 * Loads annotations for the current scene
 * @param {Scene} scene The scene to load annotations for
 * @param {number} scene_index The index of the scene
 * @returns {void}
 */
TimelineStoryteller.prototype._loadAnnotations = function (scene, scene_index) {
  this.clearCanvas();

  this._prevTransitioning = false;
  var that = this;

  log("Loading Annotations");
  if (this._currentSceneIndex !== scene_index) {
    return;
  }

  // is the legend expanded in this scene?
  globals.legend_expanded = scene.s_legend_expanded;
  if (scene.s_legend_expanded) {
    this.expandLegend();
  } else {
    this.collapseLegend();
  }

  /**
   * Creates a mapper, that adds a type property
   * @param {string} type The type of the item
   * @returns {object} An object with the type and item properties
   */
  function mapWithType(type) {
    return function (item) {
      return {
        id: item.id,
        type: type,
        item: item
      };
    };
  }

  this._pruneAnnotations();

  var captionAnnos = globals.caption_list.map(mapWithType("caption"));
  var imageAnnos = globals.image_list.map(mapWithType("image"));
  var textAnnos = globals.annotation_list.map(mapWithType("annotation"));

  // TODO: this would be better if the scenes had a more generic property called "annotations", that have a list of all the
  // annotations that had a "type" property

  // These are are technically annotations, just different types, so concat them all together
  var allAnnos = captionAnnos.concat(imageAnnos).concat(textAnnos);

  var nextId = getHighestId(allAnnos);
  allAnnos.filter(function (anno) {
    // Filter out annotations not on this scene
    // Basically maps the type to scene.s_images or scene.s_annotations or scene.s_captions
    var sceneList = scene["s_" + anno.type + "s"];

    for (var i = 0; i < sceneList.length; i++) {
      // eslint-disable-line no-shadow
      // Basically the id property in the scene, so image_id or caption_id or annotation_id
      if (sceneList[i][anno.type + "_id"] === anno.item.id) {
        return true;
      }
    }
  })

  // We sort the annotations by z-order, and add the annotations in that order
  // this is important cause with svgs, the order in which elements are added dictates their z-index
  .sort(function (a, b) {
    return (a.item.z_index || 0) - (b.item.z_index || 0);
  })

  // Iterate through all of our annotations
  .forEach(function (anno) {
    // Make a copy so existing scenes do not get modified
    var item = _extends({}, anno.item);
    item.id = ++nextId;

    if (anno.type === "caption") {
      addCaption(item.caption_text, item.caption_width * 1.1, item.x_rel_pos, item.y_rel_pos, item);
    } else if (anno.type === "image") {
      addImage(that._timeline_vis, item.i_url, item.x_rel_pos, item.y_rel_pos, item.i_width, item.i_height, item);
    } else {
      var itemSel = selectWithParent("#event_g" + item.item_index).select("rect.event_span");
      var itemEle = itemSel.datum(),
          item_x_pos = 0,
          item_y_pos = 0;

      if (scene.s_representation !== "Radial") {
        item_x_pos = itemEle.rect_x_pos + itemEle.rect_offset_x + globals.padding.left + globals.unit_width * 0.5;
        item_y_pos = itemEle.rect_y_pos + itemEle.rect_offset_y + globals.padding.top + globals.unit_width * 0.5;
      } else {
        item_x_pos = itemEle.path_x_pos + itemEle.path_offset_x + globals.padding.left;
        item_y_pos = itemEle.path_y_pos + itemEle.path_offset_y + globals.padding.top;
      }

      var _annotateEvent = annotateEvent(that._timeline_vis, item.content_text, item_x_pos, item_y_pos, item.x_offset, item.y_offset, item.x_anno_offset, item.y_anno_offset, item.label_width, item.item_index, item),
          element = _annotateEvent.element;

      element.transition().duration(that.options.animations ? 50 : 0).style("opacity", 1).each(function () {
        // If after running the transition, the scene has changed, then hide this annotation.
        if (that._currentSceneIndex !== scene_index) {
          this.style.opacity = 0;
        }
      });
    }
    if (anno.type === "caption") {
      globals.caption_list.push(item);
    } else if (anno.type === "image") {
      globals.image_list.push(item);
    } else {
      globals.annotation_list.push(item);
    }
  });

  // Set read-only state for annotations in playback mode
  d3.selectAll(".annotation_control, .annotation_drag_area, .image_drag_area, .caption_drag_area").style("display", globals.playback_mode ? "none" : "");

  // toggle selected events in the scene
  this._main_svg.selectAll(".timeline_event_g").nodes().forEach(function (event) {
    if (scene.s_selections.indexOf(event.__data__.event_id) !== -1) {
      event.__data__.selected = true;
      selectWithParent("#event_g" + event.__data__.event_id).selectAll(".event_span").attr("filter", "url(#drop-shadow)").style("z-index", 1).style("stroke", "#f00").style("stroke-width", "1.25px");
      selectWithParent("#event_g" + event.__data__.event_id).selectAll(".event_span_component").style("z-index", 1).style("stroke", "#f00").style("stroke-width", "1px");
    } else {
      event.__data__.selected = false;
      selectWithParent("#event_g" + event.__data__.event_id).selectAll(".event_span").attr("filter", "none").style("stroke", "#fff").style("stroke-width", "0.25px");
      selectWithParent("#event_g" + event.__data__.event_id).selectAll(".event_span_component").style("stroke", "#fff").style("stroke-width", "0.25px");
    }
  });
  if (this._timeline_vis.tl_representation() !== "Curve") {
    selectWithParent("#timecurve").style("visibility", "hidden");
  } else {
    selectWithParent("#timecurve").style("visibility", "visible");
  }
  this._main_svg.style("visibility", "visible");
};

/**
 * Prunes annotations which were left in the global scene list, but never referenced anymore
 * @returns {void}
 */
TimelineStoryteller.prototype._pruneAnnotations = function () {
  function prune(type) {
    if (globals[type + "_list"]) {
      var usedAnnotations = {};
      (globals.scenes || []).forEach(function (s) {
        (s["s_" + type + "s"] || []).forEach(function (annoRef) {
          usedAnnotations[annoRef[type + "_id"]] = true;
        });
      });

      // Filter the annotation list to used annotations
      globals[type + "_list"] = globals[type + "_list"].filter(function (n) {
        return usedAnnotations[n.id];
      });
    }
  }
  prune("annotation");
  prune("image");
  prune("caption");
};

/**
 * Gets the animation duration for each of the steps in the animations
 * @return {number} The duration of a step in the animation
 */
TimelineStoryteller.prototype._getAnimationStepDuration = function () {
  if (this.options.animations) {
    return this.options.animationStepDuration;
  }
  return 0;
};

/**
 * Shows an error on the display area
 * @param {string} text The text to display
 * @returns {void}
 */
TimelineStoryteller.prototype._showError = function (text) {
  this._errorArea.html(text);
  this._errorArea.style("display", "");
};

/**
 * Hides the errors on the display area
 * @returns {void}
 */
TimelineStoryteller.prototype._hideError = function () {
  this._errorArea.html("");
  this._errorArea.style("display", "none");
};

/**
 * Event listener for when the TimelineStoryteller is resized
 */
TimelineStoryteller.prototype._onResized = debounce(function (updateVis) {
  // Only tweak the size if we are not playing back
  if (!this.playback_mode) {
    this._component_width = this.parentElement.clientWidth;
    this._component_height = this.parentElement.clientHeight;

    // EFFECTIVE_HEIGHT
    globals.width = this._component_width - globals.margin.right - globals.margin.left - getScrollbarWidth();
    globals.height = this._component_height - globals.margin.top - globals.margin.bottom - getScrollbarWidth();

    this._render_width = this._component_width;
    this._render_height = this._component_height;

    var vis = this._timeline_vis;
    if (typeof updateVis === "undefined" && updateVis !== false && vis && this._main_svg) {
      var scale = vis.tl_scale();
      this._determineSize(globals.active_data, scale, vis.tl_layout(), vis.tl_representation());

      this._adjustSvgSize();

      this._main_svg.call(vis.duration(this.options.animations ? 1200 : 0).tl_scale(scale).height(globals.height).width(globals.width));
    }
  }
}, 500);

/**
 * Records the current scene
 * @returns {void}
 */
TimelineStoryteller.prototype._recordScene = function () {
  selectAllWithParent("foreignObject").remove();

  selectWithParent("#stepper_svg_placeholder").remove();

  globals.record_width = globals.width;
  globals.record_height = globals.height;

  var timeline_vis = this._timeline_vis;

  logEvent("scene " + (this._currentSceneIndex + 2) + " recorded: " + timeline_vis.tl_representation() + " / " + timeline_vis.tl_scale() + " / " + timeline_vis.tl_layout(), "record");

  var scene_captions = [];
  var scene_images = [];
  var scene_annotations = [];
  var scene_selections = [];

  this._main_svg.selectAll(".timeline_caption").each(function () {
    var scene_caption = {
      caption_id: Math.abs(parseInt(this.getAttribute("data-id"), 10))
    };
    scene_captions.push(scene_caption);
  });

  this._main_svg.selectAll(".timeline_image").each(function () {
    var scene_image = {
      image_id: Math.abs(parseInt(this.getAttribute("data-id"), 10))
    };
    scene_images.push(scene_image);
  });

  this._main_svg.selectAll(".event_annotation:not(.temporary_annotation)").each(function () {
    var scene_annotation = {
      annotation_id: Math.abs(parseInt(this.getAttribute("data-id"), 10))
    };
    scene_annotations.push(scene_annotation);
  });

  this._main_svg.selectAll(".timeline_event_g").nodes().forEach(function (event) {
    if (event.__data__.selected === true) {
      scene_selections.push(event.__data__.event_id);
    }
  });

  for (var i = 0; i < globals.scenes.length; i++) {
    if (globals.scenes[i].s_order > this._currentSceneIndex) {
      globals.scenes[i].s_order++;
    }
  }

  var scene = {
    s_width: globals.width,
    s_height: globals.height,
    s_scale: timeline_vis.tl_scale(),
    s_layout: timeline_vis.tl_layout(),
    s_representation: timeline_vis.tl_representation(),
    s_categories: globals.selected_categories,
    s_facets: globals.selected_facets,
    s_segments: globals.selected_segments,
    s_filter_type: globals.filter_type,
    s_legend_x: globals.legend_x,
    s_legend_y: globals.legend_y,
    s_legend_expanded: globals.legend_expanded,
    s_captions: scene_captions,
    s_images: scene_images,
    s_annotations: scene_annotations,
    s_selections: scene_selections,
    s_timecurve: selectWithParent("#timecurve").attr("d"),
    s_order: this._currentSceneIndex + 1
  };
  globals.scenes.push(scene);

  function copyAnnotations(list, refList, type) {
    var highestAnnoId = getHighestId(list);
    var idProp = type + "_id";
    return list.concat(refList.map(function (sceneAnno) {
      var existingAnnotation = list.filter(function (anno) {
        return anno.id === sceneAnno[idProp];
      })[0];
      var newAnnotation = _extends({}, existingAnnotation);
      var newId = ++highestAnnoId;

      // TODO: Dirty, update the element id to be the right one
      selectAllWithParent("[data-type=\"" + type + "\"][data-id=\"" + existingAnnotation.id + "\"]").attr("data-id", newId);

      // Update the existing annotation to be a "new" annotation, so any future changes will only affect this one.
      existingAnnotation.id = newId;
      return newAnnotation;
    }));
  }

  // Create copies of the annotations so modifications do not change the source scene
  globals.image_list = copyAnnotations(globals.image_list, scene_images, "image");

  // Create copies of the annotations so modifications do not change the source scene
  globals.annotation_list = copyAnnotations(globals.annotation_list, scene_annotations, "annotation");

  // Create copies of the captions so modifications do not change the source scene
  globals.caption_list = copyAnnotations(globals.caption_list, scene_captions, "caption");

  this._currentSceneIndex++;

  if (isIE11) {
    this._updateNavigationStepper();

    // Dispatch after state has changed
    this._dispatch.call("stateChanged");
  } else {
    var compressed = !(this.options.export && this.options.export.images);
    var renderOptions = {
      backgroundColor: "white"
    };

    if (compressed) {
      renderOptions.encoderType = "image/jpeg";
      renderOptions.scale = 300 / Math.max(this._render_width, this._render_height);
    }

    svgImageUtils.svgAsPNG(document.querySelector(".timeline_storyteller #main_svg"), globals.gif_index, renderOptions);

    var that = this;
    var checkExist = setInterval(function () {
      if (document.getElementById("gif_frame" + globals.gif_index) !== null) {
        log("gif_frame" + globals.gif_index + " Exists!");
        globals.scenes[globals.scenes.length - 1].s_src = document.getElementById("gif_frame" + globals.gif_index).src;
        document.getElementById("gif_frame" + globals.gif_index).remove();
        globals.gif_index++;
        that._updateNavigationStepper();
        clearInterval(checkExist);

        // Dispatch after state has changed
        that._dispatch.call("stateChanged");
      }
    }, 100); // check every 100ms
  }
  return true;
};

/**
 * Parses the start_date and end_date properties of the given item
 * @param {object} item The item to parse start & end dates for
 * @returns {void}
 */
TimelineStoryteller.prototype._parseStartAndEndDates = function (item) {
  var startMoment = void 0;
  var endMoment = void 0;
  var dateFormat = "Y-MM-DD HH:mm Z";

  // Try to parse the start date from the original
  // If that fails, try to estimate from the end date
  // Otherwise fall back to todays day
  // NOTE: isValid returns true EVEN IF start_date is empty/null/undefined
  if (item.start_date && moment(item.start_date).isValid()) {
    startMoment = moment(item.start_date, dateFormat); // account for UTC offset

    // Use the end date if the start date is not valid
  } else if (item.end_date && moment(item.end_date).isValid()) {
    startMoment = moment(item.end_date, dateFormat);
  } else {
    startMoment = moment(new Date());
  }

  // Try to parse the end date from the original
  // If that fails, try to estimate from the start date
  if (item.end_date && moment(item.end_date).isValid()) {
    endMoment = moment(item.end_date, dateFormat); // account for UTC offset
  } else {
    // Use the start_date to approximate end date
    endMoment = moment(startMoment);
  }

  // We use year based when the data is numeric
  // TODO: Think about what happens if there is a mix between year only dates and full dates in the same dataset.
  var isYearBased = item.start_date !== undefined && globals.isNumber(item.start_date) || item.end_date !== undefined && globals.isNumber(item.end_date);

  // is start date a numeric year?
  if (isYearBased) {
    // set end_date to end of that year as date object
    item.start_date = startMoment.toDate();
    item.end_date = endMoment.endOf("year").toDate();
  } else {
    // start date is not a numeric year
    globals.date_granularity = "days";
    item.start_date = startMoment.startOf("hour").toDate();
    item.end_date = endMoment.endOf("hour").toDate();
  }
};

/**
 * Initializes the import panel
 * @returns {void}
 */
TimelineStoryteller.prototype._initializeImportPanel = function () {
  this.importPanel.element.append("div").attr("id", "data_picker");

  this._initializeImportDataMenus();
};

/**
 * Initializes the sections in the import panel
 * @return {void}
 */
TimelineStoryteller.prototype._initializeImportDataMenus = function () {
  selectAllWithParent("#data_picker .data_story_picker").remove();

  this._initializeImportDataSection();
  this._initializeImportStorySection();
};

/**
 * Initializes the data section within the import dialog
 * @returns {void}
 */
TimelineStoryteller.prototype._initializeImportDataSection = function () {
  var _this = this;

  if (this.options.showImportLoadDataOptions) {
    var importOptions = this.options.import || {};
    var importDataMenu = (importOptions.dataMenu || {}).items || {};
    var importDataItems = Object.keys(importDataMenu);

    // We really only need to add the section if there is any items to show
    if (importDataItems.length) {
      var dataset_picker = selectWithParent("#data_picker").append("div").attr("class", "data_story_picker import-load-data-option");

      dataset_picker.append("text").attr("class", "ui_label").text(tr("Load timeline data"));

      importDataItems.forEach(function (key) {
        var buttonEle = _this._createImportPanelButton(importDataMenu[key]);
        if (buttonEle) {
          dataset_picker.node().appendChild(buttonEle.node());
        }
      });
    }
  }
};

/**
 * Initializes the story section within the import dialog
 * @returns {void}
 */
TimelineStoryteller.prototype._initializeImportStorySection = function () {
  var _this2 = this;

  var importOptions = this.options.import || {};
  var storyMenu = (importOptions.storyMenu || {}).items || {};
  var importItems = Object.keys(storyMenu);

  // We really only need to add the section if there is any items to show
  if (importItems.length) {
    var story_picker = selectWithParent("#data_picker").append("div").attr("class", "data_story_picker").style("border-right", "1px solid transparent");

    story_picker.append("text").attr("class", "ui_label").text(tr("Load timeline story"));

    importItems.forEach(function (key) {
      var buttonEle = _this2._createImportPanelButton(storyMenu[key]);
      if (buttonEle) {
        story_picker.node().appendChild(buttonEle.node());
      }
    });
  }
};

/**
 * Creates an import panel button from the given button config
 * @param {object} button The button configuration
 * @return {d3.Selection} The d3 button
 */
TimelineStoryteller.prototype._createImportPanelButton = function (button) {
  var _this3 = this;

  if (typeof button.visible === "function" && button.visible(this) || button.visible === undefined || typeof button.visible === "boolean" && button.visible) {
    var sizeCss = "height:" + (button.height || 40) + "px;width:" + (button.width || 40) + "px";
    var item = d3.select(document.createElement("div")).attr("class", "import-button").attr("style", sizeCss);
    item.append("img").call(utils.attrs({
      name: button.text,
      class: "img_btn_enabled " + (button.class || ""),
      title: button.text,
      src: button.image,
      style: "width:100%;height:100%;position:absolute;left:0;top:0"
    }));
    item.on("click", function () {
      if (button.click) {
        button.click(_this3, element);
      }
    });
    var element = item.append("div").attr("class", "import-button-container");
    if (button.init) {
      button.init(this, element);
    }
    return item;
  }
};

/**
 * Listener for when an image is selected through the addImageDialog
 * @param {string} image_url The image url that was selected
 * @returns {void}
 */
TimelineStoryteller.prototype._onAddImageSelected = function (image_url) {
  var highestImageId = getHighestId(globals.image_list);
  var imageId = highestImageId + 1;

  logEvent("image " + imageId + " added: <<" + image_url + ">>", "annotation");

  var new_image = new Image();
  new_image.name = image_url;
  new_image.onload = getWidthAndHeight;
  new_image.onerror = loadFailure;
  new_image.src = image_url;

  function loadFailure() {
    logEvent("'" + this.name + "' failed to load.", "annotation");

    return true;
  }

  var that = this;
  function getWidthAndHeight() {
    logEvent("image " + imageId + " is " + this.width + " by " + this.height + " pixels in size.", "annotation");

    var image_width = this.width,
        image_height = this.height,
        scaling_ratio = 1;

    // reduce size of large images
    if (image_width >= globals.width * 0.5) {
      image_width = globals.width * 0.5;
      scaling_ratio = image_width / this.width;
      image_height = this.height * scaling_ratio;
    }
    if (image_height >= globals.height * 0.5) {
      image_height = globals.height * 0.5;
      scaling_ratio = image_height / this.height;
      image_width = this.width * scaling_ratio;
    }

    var image_list_item = {
      id: imageId,
      i_url: image_url,
      i_width: image_width,
      i_height: image_height,
      x_rel_pos: 0.5,
      y_rel_pos: 0.25,
      z_index: getNextZIndex()
    };

    globals.image_list.push(image_list_item);
    addImage(that._timeline_vis, image_url, 0.5, 0.25, image_width, image_height, image_list_item);
  }
};

/**
 * Updates the selected filters from the given filter container
 * @param {d3.Selection} filterContainer The filter container to grab the new filters from
 * @param {string} type The type of filter "selected_categories", "selected_facets", "selected_segments"
 * @returns {void}
 */
TimelineStoryteller.prototype._updateSelectedFilters = function (filterContainer, type) {
  var newOptions = filterContainer.selectAll("option").filter(function () {
    return this.selected;
  });
  if (newOptions.size() === 0) {
    filterContainer.selectAll("option").attr("selected", false);
    if (globals[type] && globals[type][0]) {
      globals[type][0].forEach(function (option) {
        option.selected = true;
      });
    }
  } else {
    globals[type] = optionGroups(newOptions);
    if (globals.filter_type === "Hide") {
      globals.dispatch.call("remove", globals.dispatch, globals.selected_categories, globals.selected_facets, globals.selected_segments);
    } else if (globals.filter_type === "Emphasize") {
      globals.dispatch.call("Emphasize", globals.dispatch, globals.selected_categories, globals.selected_facets, globals.selected_segments);
    }
  }
};

/**
 * Expands the legend
 * @returns {void}
 */
TimelineStoryteller.prototype.expandLegend = function () {
  logEvent("legend expanded", "legend");

  globals.legend_expanded = true;
  var animationLength = this._getAnimationStepDuration();
  selectWithParent(".legend").transition().duration(animationLength);
  selectWithParent(".legend").select(".legend_rect").transition().duration(animationLength).attr("height", globals.track_height * (globals.num_categories + 1)).attr("width", globals.max_legend_item_width + 5 + globals.unit_width + 10);
  selectWithParent(".legend").select("#legend_expand_btn").transition().duration(animationLength).attr("x", globals.max_legend_item_width + 5 + globals.unit_width - 10);
  selectWithParent(".legend").select(".legend_title").transition().duration(animationLength).attr("dx", "0em").attr("transform", "translate(5,0)rotate(0)");
  selectWithParent(".legend").selectAll(".legend_element_g text").transition().duration(animationLength).style("fill-opacity", "1").style("display", "inline").attr("transform", "translate(0,-35)");
  selectWithParent(".legend").selectAll(".legend_element_g rect").transition().duration(animationLength).attr("transform", "translate(0,-35)");
  selectWithParent(".legend").selectAll(".legend_element_g foreignObject").transition().duration(animationLength).attr("transform", "translate(" + globals.legend_spacing + ",-35)");
};

/**
 * Collapses the legend
 * @returns {void}
 */
TimelineStoryteller.prototype.collapseLegend = function () {
  logEvent("legend minified", "legend");

  globals.legend_expanded = false;

  var animationLength = this._getAnimationStepDuration();
  selectWithParent(".legend").transition().duration(animationLength).style("z-index", 1);
  selectWithParent(".legend").select(".legend_rect").transition().duration(animationLength).attr("height", 35 + globals.track_height * (globals.num_categories + 1)).attr("width", 25);
  selectWithParent(".legend").select("#legend_expand_btn").transition().duration(animationLength).attr("x", 25);
  selectWithParent(".legend").select(".legend_title").transition().duration(animationLength).attr("dx", "-4.3em").attr("transform", "translate(0,0)rotate(270)");
  selectWithParent(".legend").selectAll(".legend_element_g text").transition().duration(animationLength).style("fill-opacity", "0").style("display", "none").attr("transform", "translate(0,0)");
  selectWithParent(".legend").selectAll(".legend_element_g rect").transition().duration(animationLength).attr("transform", "translate(0,0)");
  selectWithParent(".legend").selectAll(".legend_element_g foreignObject").transition().duration(animationLength).attr("transform", "translate(" + globals.legend_spacing + ",0)");
};

/**
 * Scales the UI
 * @param {number} [scale=1] The scale of the UI
 * @returns {void}
 */
TimelineStoryteller.prototype.setUIScale = function (scale) {
  scale = typeof scale === "undefined" ? 1 : scale;
  this.scale = scale;
  selectWithParent("#footer").style("transform", "scale(" + scale + ")");
  selectWithParent("#option_div").style("transform", "scale(" + scale + ")");
  this.importPanel.element.style("transform", "scale(" + scale + ")");
  selectWithParent("#navigation_div").style("transform", "scale(" + scale + ")");
  selectWithParent("#menu_div").style("transform", "scale(" + scale + ")");
  selectWithParent("#hint_div").style("transform", "scale(" + scale + ")");
};

/**
 * Applies the current options to the elements on the page
 * @param {boolean} [updateMenu=false] Whether or not to update the menu
 * @returns {void}
 */
TimelineStoryteller.prototype.applyOptions = function (updateMenu) {
  var options = this.options;
  selectWithParent("#footer").style("display", options.showAbout === false ? "none" : null);
  selectWithParent("#option_div").style("display", options.showViewOptions === false ? "none" : null);
  selectWithParent().classed("show-about-bar", options.showAbout);
  this.importPanel.element.style("display", this.onIntro && options.showIntro === false ? "none" : null);

  // showImportOptions
  var showImportVisible = options.showImportOptions === false ? "none" : null;
  selectWithParent("#data_picker").style("display", showImportVisible);
  selectWithParent("#menu_div .menu_label").style("display", showImportVisible);
  selectWithParent("#menu_div #import_visible_btn").style("display", showImportVisible);

  // showAbout
  selectWithParent("#navigation_div").style("bottom", options.showAbout === false || this.playback_mode ? "20px" : "50px");

  // showImportLoadDataOptions
  selectAllWithParent(".import-load-data-option").style("display", options.showImportLoadDataOptions === false ? "none" : null);

  // allowImageExport
  selectAllWithParent(".export--image").style("display", !options.export || options.export.images === false ? "none" : null);

  selectAllWithParent("#hint_div").style("display", options.showHints === false ? "none" : null);

  if (updateMenu) {
    this._initializeMenu(options.menu);
    this._initializeImportDataMenus();
  }
};

/**
 * Sets the rendering options on the timeline storyteller
 * @param {object} options The options to set
 * @returns {void}
 */
TimelineStoryteller.prototype.setOptions = function (options) {
  options = options || {};
  var updateMenu = false;
  for (var key in options) {
    // If it is a supported option
    if (TimelineStoryteller.DEFAULT_OPTIONS.hasOwnProperty(key)) {
      var value = typeof options[key] !== "undefined" ? options[key] : TimelineStoryteller.DEFAULT_OPTIONS[key];
      this.options[key] = value;
      if (key === "menu") {
        updateMenu = true;
      }
      if (key === "import") {
        updateMenu = true;
      }
    }
  }
  this.applyOptions(updateMenu);
};

/**
 * Clears the canvas of annotations
 * @returns {void}
 */
TimelineStoryteller.prototype.clearCanvas = function () {
  logEvent("clear annotations", "annotation");

  this._main_svg.selectAll(".timeline_event_g").nodes().forEach(function (event) {
    event.__data__.selected = false;
    selectWithParent("#event_g" + event.__data__.event_id).selectAll(".event_span, .event_span_component").attr("filter", "none").style("stroke", "#fff").style("stroke-width", "0.25px");
  });

  this._main_svg.selectAll(".timeline_caption, .timeline_image, .event_annotation").remove();
};

/**
 * Updates the set of currently loaded data
 * @param {object[]} data The data to load into TimelineStoryteller
 * @returns {void}
 */
TimelineStoryteller.prototype.update = function (data) {
  var unique_values = new Map();
  var unique_data = [];

  globals.timeline_json_data = data;

  data.forEach(function (d) {
    unique_values.set(d.content_text + d.start_date + d.end_date + d.category + d.facet, d);
  });

  unique_values.forEach(function (d) {
    unique_data.push(d);
  });

  logEvent("Updating data", "update");

  // TODO: Check if DrawTimeline hasn't been called yet

  globals.active_data = unique_data;
  globals.all_data = unique_data;

  // updateCategories

  // This list has always been empty (d3.map() was given a function, which has no keys),
  // so categories are never added here; kept as it was.
  var categories = [];
  var existingCategories = globals.categories.domain();

  // Don't worry about removed/changed categories, hopefully if you called updateData
  // the underlying dataset has not removed categories, so handle adding only
  if (categories.length > existingCategories.length) {
    var existingColors = existingCategories.map(globals.categories);

    // determine event categories from data
    globals.categories.domain(categories);

    existingColors.forEach(function (color, i) {
      // Restore existing colors
      setScaleValue(globals.categories, existingCategories[i], color);
    });

    globals.num_categories = globals.categories.domain().length;
  }

  this._drawTimeline(globals.active_data);
};

/**
 * Loads the given set of data into timeline storyteller
 * @param {object} state The state to load into the story teller
 * @param {boolean} storyMode If true, the timeline storyteller will load the data and load into story mode
 * @param {boolean} skipIntro If true, the intro import dialog will be skipped
 * @param {number} delay The load delay for the story
 * @returns {void}
 */
TimelineStoryteller.prototype.load = function (state, storyMode, skipIntro, delay) {
  logEvent("loading " + (storyMode ? "(story)" : "(json_parsed)"), "load");

  var that = this;
  var hasScenes = !!(state.scenes && state.scenes.length);
  function delayLoad(resolve) {
    "use strict";

    that._loadTimeline(state, skipIntro).then(resolve);
  }

  return new Promise(function (resolve) {
    delay = typeof delay === "undefined" ? 500 : delay;
    setTimeout(function () {
      // Give it time for the UI to load
      that.setPlaybackMode(!!storyMode, false);

      if (storyMode) {
        logEvent("story load", "load");

        selectWithParent("#timeline_metadata").style("display", "none");
        that.importPanel.hide();
      }

      if (delay > 0 || hasScenes) {
        setTimeout(function () {
          return delayLoad(resolve);
        }, delay);
      } else {
        delayLoad(resolve);
      }
    }, delay ? 100 : 0);
  });
};

/**
 * Saves the current state as JSON
 * @returns {object} The story in JSON format
 */
TimelineStoryteller.prototype.saveState = function () {
  return {
    "version": 2,
    "timeline_json_data": globals.timeline_json_data,
    "name": "timeline_story.cdc",
    "scenes": globals.scenes,
    "width": this._component_width,
    "height": this._component_height,
    "color_palette": globals.categories.range(),
    "usage_log": globals.usage_log,
    "caption_list": globals.caption_list,
    "annotation_list": globals.annotation_list,
    "image_list": globals.image_list,
    "author": "",
    "timestamp": new Date().valueOf()
  };
};

/**
 * Sets the color for the given category
 * @param {string} category The category to change
 * @param {number} categoryIndex The index of the category
 * @param {string} value The category color
 * @returns {void}
 */
TimelineStoryteller.prototype.setCategoryColor = function (category, categoryIndex, value) {
  return this._setCategoryColor(category, categoryIndex, value);
};

/**
 * Sets the playback mode
 * @param {boolean} isPlayback True if playback mode
 * @param {boolean} [addLog=true] True if the change should be logged
 * @returns {void}
 */
TimelineStoryteller.prototype.setPlaybackMode = function (isPlayback, addLog) {
  log("Setting playback mode", isPlayback);

  var importDiv = this.importPanel.element;
  var menuDiv = selectWithParent("#menu_div");
  var optionDiv = selectWithParent("#option_div");

  // This adjusts elements offscreen by calculating their widths and moving them appropriately
  function toggleElement(element, prop, padding) {
    var offscreen = element.node()[prop === "bottom" || prop === "top" ? "clientHeight" : "clientWidth"];
    element.style(prop, (isPlayback ? "-" + offscreen + 5 : padding) + "px");
  }

  if (isPlayback) {
    selectWithParent("#record_scene_btn").attr("class", "img_btn_disabled");
    selectWithParent("#caption_div").style("display", "none");
    this._addImagePopup.hide();
    selectWithParent("#filter_div").style("display", "none");

    menuDiv.attr("class", "control_div onhover");
    importDiv.style("top", "-" + importDiv.node().clientHeight + "px").attr("class", "control_div onhover");
    optionDiv.attr("class", "control_div onhover");
  } else {
    selectWithParent("#record_scene_btn").attr("class", "img_btn_enabled");
    optionDiv.attr("class", "control_div");
    importDiv.attr("class", "control_div");
    menuDiv.attr("class", "control_div");
  }
  // Set read-only mode for annotation elements in playback mode
  d3.selectAll(".annotation_control, .annotation_drag_area, .image_drag_area, .caption_drag_area").style("display", isPlayback ? "none" : "");

  toggleElement(optionDiv, "top", 10);
  toggleElement(menuDiv, "left", 10);
  toggleElement(selectWithParent("#hint_div"), "top", 20);
  toggleElement(selectWithParent("#intro_div"), "top", 10);
  toggleElement(selectWithParent("#footer"), "bottom", 0);

  // Toggle a playback-mode class
  selectWithParent().classed("playback_mode", isPlayback);

  this.playback_mode = isPlayback;
  globals.playback_mode = this.playback_mode;

  if (typeof addLog === "undefined" || addLog) {
    logEvent("playback mode " + (isPlayback ? "on" : "off"), "playback");
  }

  this.applyOptions();
};

/**
 * A utility function to get the scrollbar width
 * @returns {number} The scrollbar width
 */
function getScrollbarWidth() {
  var outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.width = "100px";
  document.querySelector(".timeline_storyteller").appendChild(outer);

  var widthNoScroll = outer.offsetWidth;
  // force scrollbars
  outer.style.overflow = "scroll";

  // add innerdiv
  var inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);

  var widthWithScroll = inner.offsetWidth;

  // remove divs
  outer.parentNode.removeChild(outer);

  return widthNoScroll - widthWithScroll;
}

module.exports = TimelineStoryteller;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./caption.png": 32,
	"./categories.png": 33,
	"./check.png": 34,
	"./clear.png": 35,
	"./close.png": 36,
	"./csv.png": 37,
	"./delete.png": 38,
	"./draw.png": 39,
	"./expand.png": 40,
	"./export.png": 41,
	"./facets.png": 42,
	"./filter.png": 43,
	"./gif.png": 44,
	"./hide.png": 45,
	"./highlight.png": 46,
	"./image.png": 47,
	"./json.png": 48,
	"./l-fac.png": 49,
	"./l-seg.png": 50,
	"./l-uni.png": 51,
	"./min.png": 52,
	"./next.png": 53,
	"./open.png": 54,
	"./pin.png": 55,
	"./play.png": 56,
	"./png.png": 57,
	"./prev.png": 58,
	"./q.png": 59,
	"./r-arb.png": 60,
	"./r-cal.png": 61,
	"./r-grid.png": 62,
	"./r-lin.png": 63,
	"./r-rad.png": 64,
	"./r-spi.png": 65,
	"./record.png": 66,
	"./reset.png": 67,
	"./resetBasic.png": 68,
	"./s-chron.png": 69,
	"./s-intdur.png": 70,
	"./s-log.png": 71,
	"./s-rel.png": 72,
	"./s-seq.png": 73,
	"./segments.png": 74,
	"./story.png": 75,
	"./svg.png": 76,
	"./timeline.png": 77,
	"./vl.png": 78
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 14;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/**

addCaption: //on-demand captions for a timeline

**/

var imageUrls = __webpack_require__(3);
var d3 = __webpack_require__(0);
var globals = __webpack_require__(2);
var tr = __webpack_require__(4);

var utils = __webpack_require__(1);
var logEvent = utils.logEvent;
var selectWithParent = utils.selectWithParent;
var ellipsize = __webpack_require__(11);

module.exports = function (caption, caption_width, x_rel_pos, y_rel_pos, captionObj) {
  "use strict";

  var x_pos = x_rel_pos * globals.width,
      y_pos = y_rel_pos * globals.height;

  var min_caption_width = utils.captionWidth(caption);

  var timeline_caption = selectWithParent("#main_svg").append("g").attr("id", "caption" + captionObj.id).attr("data-id", captionObj.id).attr("data-type", "caption").attr("class", "timeline_caption");

  timeline_caption.on("mouseover", function () {
    d3.select(this).selectAll(".annotation_control").transition().duration(250).style("opacity", 1);
    d3.select(this).select(".caption_frame").transition().duration(250).style("stroke", "#999").attr("filter", "url(#drop-shadow)");
  }).on("mouseout", function () {
    d3.select(this).selectAll(".annotation_control").transition().duration(250).style("opacity", 0);
    d3.select(this).select(".caption_frame").transition().duration(250).style("stroke", "white").attr("filter", "none");
  });

  var drag = d3.drag().subject(function () {
    var t = d3.select(this);

    return {
      x: t.attr("x"),
      y: t.attr("y")
    };
  }).on("drag", function (event) {
    x_pos = event.x;
    y_pos = event.y;

    captionObj.x_rel_pos = x_pos / globals.width;
    captionObj.y_rel_pos = y_pos / globals.height;

    d3.select(this).attr("x", x_pos).attr("y", y_pos);

    d3.select(this.parentNode).select(".caption_frame").attr("x", x_pos).attr("y", y_pos);

    d3.select(this.parentNode).select(".caption_label").selectAll("tspan").attr("x", x_pos + 7.5).attr("y", y_pos + globals.unit_width);

    d3.select(this.parentNode).selectAll(".frame_resizer").attr("x", x_pos + caption_width + 7.5).attr("y", y_pos);

    d3.select(this.parentNode).selectAll(".annotation_delete").attr("x", x_pos + caption_width + 7.5 + 20).attr("y", y_pos);
  }).on("end", function () {
    logEvent("caption " + captionObj.id + " moved to [" + x_pos + "," + y_pos + "]");
  });

  var resize = d3.drag().subject(function () {
    var t = d3.select(this);
    y_pos = +t.attr("y");

    return {
      x: t.attr("x"),
      y: t.attr("y")
    };
  }).on("drag", function (event) {
    d3.select(this).attr("x", d3.max([x_pos + caption_width + 7.5, x_pos + 7.5 + (event.x - x_pos)]));

    caption_width = d3.max([min_caption_width, event.x - x_pos]);

    captionObj.caption_width = caption_width;

    d3.select(this.parentNode).selectAll(".frame_resizer").attr("x", x_pos + caption_width + 7.5).attr("y", y_pos);

    d3.select(this.parentNode).select(".caption_frame").attr("width", caption_width + 7.5);

    d3.select(this.parentNode).selectAll(".annotation_delete").attr("x", x_pos + caption_width + 7.5 + 20).attr("y", y_pos);

    d3.select(this.parentNode).select(".caption_drag_area").attr("width", caption_width + 7.5);

    d3.select(this.parentNode).select(".caption_label").attr("x", x_pos + 7.5).attr("y", y_pos + globals.unit_width).text(caption).call(wrap, caption_width - 7.5);
  }).on("end", function () {
    logEvent("caption " + captionObj.id + " resized to " + caption_width + "px");
  });

  var caption_frame = timeline_caption.append("rect").attr("class", "caption_frame").attr("x", x_pos).attr("y", y_pos).attr("width", caption_width + 7.5);

  timeline_caption.append("svg:image").attr("class", "annotation_control frame_resizer").attr("title", "resize caption").attr("x", x_pos + caption_width + 7.5).attr("y", y_pos).attr("width", 20).attr("height", 20).attr("xlink:href", imageUrls("expand.png", true)).attr("filter", "url(#drop-shadow)").style("opacity", 0);

  var caption_resizer = timeline_caption.append("rect").attr("class", "annotation_control frame_resizer").attr("x", x_pos + caption_width + 7.5).attr("y", y_pos).attr("width", 20).attr("height", 20).style("opacity", 0).on("mouseover", function () {
    d3.select(this).style("stroke", "#f00");
  }).on("mouseout", function () {
    d3.select(this).style("stroke", "#ccc");
  }).call(resize);

  caption_resizer.append("title").text(tr("Resize caption"));

  timeline_caption.append("svg:image").attr("class", "annotation_control annotation_delete").attr("title", "remove caption").attr("x", x_pos + caption_width + 7.5 + 20).attr("y", y_pos).attr("width", 20).attr("height", 20).attr("xlink:href", imageUrls("delete.png", true)).attr("filter", "url(#drop-shadow)").style("opacity", 0);

  timeline_caption.append("rect").attr("class", "annotation_control annotation_delete").attr("x", x_pos + caption_width + 7.5 + 20).attr("y", y_pos).attr("width", 20).attr("height", 20).style("opacity", 0).on("mouseover", function () {
    d3.select(this).style("stroke", "#f00");
  }).on("mouseout", function () {
    d3.select(this).style("stroke", "#ccc");
  }).on("click", function () {
    logEvent("caption " + captionObj.id + " removed");

    d3.select(this.parentNode).remove();
  }).append("title").text(tr("Remove caption"));

  var caption_label = timeline_caption.append("text").attr("class", "caption_label").attr("x", x_pos + 7.5).attr("y", y_pos + globals.unit_width).attr("dy", 1).text(caption).call(wrap, caption_width - 7.5);

  var caption_drag_area = timeline_caption.append("rect").attr("class", "caption_drag_area").attr("x", x_pos).attr("y", y_pos).attr("width", caption_width + 7.5).call(drag);

  caption_label.attr("dy", 1 + "em").text(caption).call(wrap, caption_width - 7.5);

  function wrap(text, width) {
    var pieces = utils.splitForWrapping(text.text()),
        line = "",
        line_number = 0,
        letter_width = 8,
        max_letters = Math.max(3, Math.floor(width / letter_width) - 2),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("dy", dy + "em").attr("x", x_pos + 7.5).attr("y", y_pos + globals.unit_width);
    pieces.forEach(function (piece) {
      var word = utils.isWideChar(piece.text.charAt(0)) ? piece.text : ellipsize(piece.text, max_letters);
      var candidate = line === "" ? word : line + (piece.space ? " " : "") + word;
      tspan.text(candidate);
      if (line !== "" && tspan.node().getComputedTextLength() > width) {
        tspan.text(line);
        line = word;
        tspan = text.append("tspan").attr("x", x_pos + 7.5).attr("y", y_pos + globals.unit_width).attr("dy", ++line_number + dy + "em").text(word);
      } else {
        line = candidate;
      }
    });
    caption_frame.attr("height", (line_number + 2.5) * 18 + "px");
    if (caption_drag_area !== undefined) {
      caption_drag_area.attr("height", (line_number + 2.5) * 18 + "px");
    }
  }

  return true;
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

/**

addImage: //on-demand image for a timeline

**/

var imageUrls = __webpack_require__(3);
var d3 = __webpack_require__(0);
var globals = __webpack_require__(2);
var tr = __webpack_require__(4);
var utils = __webpack_require__(1);
var logEvent = utils.logEvent;
var selectWithParent = utils.selectWithParent;
var nextId = utils.nextId;

module.exports = function (timeline_vis, image_url, x_rel_pos, y_rel_pos, image_width, image_height, imageObj) {
  "use strict";

  var x_pos = x_rel_pos * globals.width,
      y_pos = y_rel_pos * globals.height;

  var orig_image_weight = image_width,
      min_image_width = 10;

  var scaling_ratio = 1;

  var timeline_image = selectWithParent("#main_svg").append("g").attr("id", "image" + imageObj.id).attr("data-id", imageObj.id).attr("data-type", "image").attr("class", "timeline_image");

  d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
      var firstChild = this.parentNode.firstChild;
      if (firstChild) {
        this.parentNode.insertBefore(this, firstChild);
      }
    });
  };

  d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
      this.parentNode.appendChild(this);
    });
  };

  timeline_image.on("click", function (event) {
    if (event.shiftKey) {
      d3.select(this).style("opacity", 0.3).moveToBack();
    }
    if (event.ctrlKey) {
      d3.select(this).style("opacity", 1).moveToFront();
    }
  }).on("mouseover", function () {
    d3.select(this).selectAll(".annotation_control").transition().duration(250).style("opacity", 1);
    d3.select(this).select(".image_frame").transition().duration(250).style("stroke", "#999").attr("filter", "url(#drop-shadow)");
  }).on("mouseout", function () {
    d3.select(this).selectAll(".annotation_control").transition().duration(250).style("opacity", 0);
    d3.select(this).select(".image_frame").transition().duration(250).style("stroke", "none").attr("filter", "none");
  });

  var drag = d3.drag().subject(function () {
    var t = d3.select(this);

    return {
      x: t.attr("x"),
      y: t.attr("y")
    };
  }).on("drag", function (event) {
    x_pos = event.x;
    y_pos = event.y;

    imageObj.x_rel_pos = x_pos / globals.width;
    imageObj.y_rel_pos = y_pos / globals.height;

    d3.select(this).attr("x", x_pos).attr("y", y_pos);

    d3.select(this.parentNode).select("clipPath").select("circle").attr("cx", x_pos + image_width / 2).attr("cy", y_pos + image_height * scaling_ratio / 2).attr("r", image_width / 2);

    d3.select(this.parentNode).select(".image_frame").attr("x", x_pos).attr("y", y_pos);

    d3.select(this.parentNode).selectAll(".frame_resizer").attr("x", x_pos + image_width).attr("y", y_pos);

    d3.select(this.parentNode).selectAll(".annotation_delete").attr("x", x_pos + image_width + 20).attr("y", y_pos);
  }).on("end", function () {
    logEvent("image " + imageObj.id + " moved to [" + x_pos + "," + y_pos + "]");
  });

  var resize = d3.drag().subject(function () {
    var t = d3.select(this);
    y_pos = +t.attr("y");

    return {
      x: t.attr("x"),
      y: t.attr("y")
    };
  }).on("drag", function (event) {
    d3.select(this).attr("x", d3.max([x_pos + image_width, x_pos + (event.x - x_pos)]));

    image_width = d3.max([min_image_width, event.x - x_pos]);

    scaling_ratio = image_width / orig_image_weight;

    imageObj.i_width = image_width;
    imageObj.i_height = image_height * scaling_ratio;

    d3.select(this.parentNode).select("clipPath").select("circle").attr("cx", x_pos + image_width / 2).attr("cy", y_pos + image_height * scaling_ratio / 2).attr("r", image_width / 2);

    d3.select(this.parentNode).select(".image_frame").attr("width", image_width).attr("height", image_height * scaling_ratio);

    d3.select(this.parentNode).selectAll(".frame_resizer").attr("x", x_pos + image_width).attr("y", y_pos);

    d3.select(this.parentNode).selectAll(".annotation_delete").attr("x", x_pos + image_width + 20).attr("y", y_pos);

    d3.select(this.parentNode).select(".image_drag_area").attr("width", image_width).attr("height", image_height * scaling_ratio);
  }).on("end", function () {
    logEvent("image " + imageObj.id + " resized to " + image_width + "px");
  });

  var image_defs = timeline_image.append("defs");

  var clipPathId = nextId();
  image_defs.append("clipPath").attr("id", "circlepath" + clipPathId).attr("class", "image-clip-path").append("circle").attr("cx", x_pos + image_width / 2).attr("cy", y_pos + image_height / 2).attr("r", image_width / 2);

  timeline_image.append("svg:image").attr("xlink:href", image_url).attr("class", "image_frame").attr("clip-path", function () {
    if (timeline_vis.tl_representation() === "Radial") {
      return "url(#circlepath" + clipPathId + ")";
    }

    return "none";
  }).style("clip-path", function () {
    if (timeline_vis.tl_representation() === "Radial") {
      return "circle()";
    }

    return "none";
  }).style("-webkit-clip-path", function () {
    if (timeline_vis.tl_representation() === "Radial") {
      return "circle()";
    }

    return "none";
  }).attr("x", x_pos).attr("y", y_pos).attr("width", image_width).attr("height", image_height);

  timeline_image.append("svg:image").attr("class", "annotation_control frame_resizer").attr("title", "resize image").attr("x", x_pos + image_width).attr("y", y_pos).attr("width", 20).attr("height", 20).attr("xlink:href", imageUrls("expand.png")).attr("filter", "url(#drop-shadow)").style("opacity", 0);

  var image_resizer = timeline_image.append("rect").attr("class", "annotation_control frame_resizer").attr("x", x_pos + image_width).attr("y", y_pos).attr("width", 20).attr("height", 20).style("opacity", 0).on("mouseover", function () {
    d3.select(this).style("stroke", "#f00");
  }).on("mouseout", function () {
    d3.select(this).style("stroke", "#ccc");
  }).call(resize);

  image_resizer.append("title").text(tr("Resize image"));

  timeline_image.append("svg:image").attr("class", "annotation_control annotation_delete").attr("title", "remove image").attr("x", x_pos + image_width + 20).attr("y", y_pos).attr("width", 20).attr("height", 20).attr("xlink:href", imageUrls("delete.png")).attr("filter", "url(#drop-shadow)").style("opacity", 0);

  timeline_image.append("rect").attr("class", "annotation_control annotation_delete").attr("x", x_pos + image_width + 20).attr("y", y_pos).attr("width", 20).attr("height", 20).style("opacity", 0).on("mouseover", function () {
    d3.select(this).style("stroke", "#f00");
  }).on("mouseout", function () {
    d3.select(this).style("stroke", "#ccc");
  }).on("click", function () {
    logEvent("image " + imageObj.id + " removed");

    d3.select(this.parentNode).remove();
  }).append("title").text(tr("Remove image"));

  timeline_image.append("rect").attr("class", "image_drag_area").attr("x", x_pos).attr("y", y_pos).attr("width", image_width).attr("height", image_width).call(drag);

  return true;
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var d3 = __webpack_require__(0);
var utils = __webpack_require__(1);
var removeOnEnd = utils.removeOnEnd;
var moment = __webpack_require__(6);

/**

calendarAxis: //a reusable calendar axis

**/

d3.calendarAxis = function () {
  var cell_size = 20,
      year_height = cell_size * 8,
      // 7 days of week + buffer
  year_width = cell_size * 54,
      // 53 weeks of the year + buffer
  duration = 1000;

  function calendarAxis(selection) {
    selection.each(function (data) {
      var g = d3.select(this);

      // grid container items for each year
      var year_grid_join = g.selectAll(".year_grid").data(data);

      var min_year = data[0];

      // var year_number = -1;

      var year_grid_enter = year_grid_join.enter().append("g").attr("class", "year_grid");

      var year_grid_exit = year_grid_join.exit().transition().duration(duration).call(removeOnEnd);

      var year_grid = year_grid_enter.merge(year_grid_join);

      var year_grid_update = year_grid.transition().duration(duration);

      year_grid_enter.append("text").attr("class", "segment_title").style("text-anchor", "middle").text(function (d) {
        return d;
      }).attr("transform", function (d) {
        var year_offset = d - min_year;
        return "translate(-5," + (cell_size * 3.5 + year_offset * year_height) + ")rotate(-90)";
      });

      var day_cell = year_grid.selectAll(".day_cell").data(function (d) {
        return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
      });

      day_cell.enter().append("rect").attr("class", "day_cell").attr("width", cell_size).attr("height", cell_size).attr("x", function (d) {
        return utils.weekOfYear(d) * cell_size;
      }).attr("y", function (d) {
        var year_offset = d.getUTCFullYear() - min_year;
        return d.getDay() * cell_size + year_offset * year_height;
      }).append("title").text(function (d) {
        return moment(d).format("dddd, MMMM Do, YYYY");
      });

      var day_cell_label = year_grid.selectAll(".day_cell_label").data(function (d) {
        return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
      });

      day_cell_label.enter().append("text").attr("class", "day_cell_label").attr("x", function (d) {
        return utils.weekOfYear(d) * cell_size + 0.5 * cell_size;
      }).attr("y", function (d) {
        var year_offset = d.getUTCFullYear() - min_year;
        return d.getDay() * cell_size + cell_size + year_offset * year_height;
      }).attr("dy", "-0.5em").text(function (d) {
        return moment(d).format("DD");
      });

      // draw the month paths
      var month_path = year_grid.selectAll(".month").data(function (d) {
        return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1));
      });

      month_path.enter().append("path").attr("class", "month").attr("d", monthPath).attr("transform", function (d) {
        var year_offset = d.getUTCFullYear() - min_year;
        return "translate(0," + year_offset * year_height + ")";
      });

      // draw the month paths
      var weekday_label = year_grid.selectAll(".weekday_label").data(d3.range(0, 7));

      weekday_label.enter().append("text").attr("class", "weekday_label").attr("x", year_width).attr("dy", "-0.5em").attr("dx", "-1.3em").attr("y", function (d) {
        var year_offset = d3.select(this.parentNode).datum() - min_year;
        return (d + 1) * cell_size + year_offset * year_height;
      }).text(function (d) {
        return moment().day(d).format("ddd");
      });

      year_grid_update.select(".segment_title").text(function (d) {
        return d;
      }).attr("transform", function (d) {
        var year_offset = d - min_year;
        return "translate(-5," + (cell_size * 3.5 + year_offset * year_height) + ")rotate(-90)";
      });

      year_grid_exit.select(".segment_title").text("");

      year_grid_update.selectAll(".day_cell").attr("width", cell_size).attr("height", cell_size).attr("x", function (d) {
        return utils.weekOfYear(d) * cell_size;
      }).attr("y", function (d) {
        var year_offset = d.getUTCFullYear() - min_year;
        return d.getDay() * cell_size + year_offset * year_height;
      });

      year_grid_exit.selectAll(".day_cell").attr("width", 0).attr("height", 0).attr("x", 0).attr("y", 0);

      year_grid_update.selectAll(".day_cell_label").attr("x", function (d) {
        return utils.weekOfYear(d) * cell_size + 0.5 * cell_size;
      }).attr("y", function (d) {
        var year_offset = d.getUTCFullYear() - min_year;
        return d.getDay() * cell_size + cell_size + year_offset * year_height;
      }).attr("dy", "-0.5em").text(function (d) {
        return moment(d).format("DD");
      });

      year_grid_exit.selectAll(".day_cell_label").attr("x", 0).attr("y", 0).text("");

      year_grid_update.selectAll(".month").attr("d", monthPath).attr("transform", function (d) {
        var year_offset = d.getUTCFullYear() - min_year;
        return "translate(0," + year_offset * year_height + ")";
      });

      year_grid_exit.selectAll(".month").attr("y", 0).attr("d", monthPath);

      year_grid_update.selectAll(".weekday_label").attr("x", year_width).attr("y", function (d) {
        var year_offset = d3.select(this.parentNode).datum() - min_year;
        return (d + 1) * cell_size + year_offset * year_height;
      }).attr("dy", "-0.5em").attr("dx", "-1.3em").text(function (d) {
        return moment().day(d).format("ddd");
      });

      year_grid_exit.selectAll(".weekday_label").attr("x", 0).attr("y", 0).text("");
    });
    d3.timerFlush();
  }

  function monthPath(t0) {
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = t0.getDay(),
        w0 = utils.weekOfYear(t0),
        d1 = t1.getDay(),
        w1 = utils.weekOfYear(t1);
    return "M" + (w0 + 1) * cell_size + "," + d0 * cell_size + "H" + w0 * cell_size + "V" + 7 * cell_size + "H" + w1 * cell_size + "V" + (d1 + 1) * cell_size + "H" + (w1 + 1) * cell_size + "V" + 0 + "H" + (w0 + 1) * cell_size + "Z";
  }

  calendarAxis.duration = function (x) {
    if (!arguments.length) {
      return duration;
    }
    duration = x;
    return calendarAxis;
  };

  return calendarAxis;
};

module.exports = d3.calendarAxis;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// Include the flexi-color-picker css
__webpack_require__(89);

// Include the color picker js
__webpack_require__(24);
var colorPicker = window.ColorPicker;

/**
 * Creates a color picker popup
 * @param {HTMLElement} parentElement The parent element.
 * @returns {Object} The color picker popup instance
 */
module.exports = function (parentElement) {
  /* eslint-disable */
  var element = document.createElement("div");
  element.className = "color-picker-popup";
  element.innerHTML = '<div class="cp-small"></div>' + '<div style="clear:both">' + '<button class="color-picker-cancel">Cancel</button>' + '<button class="color-picker-ok" style="margin:5px 5px 2px 0px;">OK</button>';
  '</div>';
  /* eslint-enable */

  element.style.cssText = "text-align:right;border:1px solid #ccc;display:none;position:absolute;outline:none;z-index:10000000;background-color:white";
  parentElement.appendChild(element);

  // The currently selected color
  var selectedColor;
  var listener;

  // Our color picker
  var cp = colorPicker(element.querySelector(".cp-small"), function (hex) {
    selectedColor = hex;
  });

  element.querySelector(".color-picker-ok").addEventListener("click", function () {
    me.hide();
    if (listener) {
      listener(selectedColor);
    }
  });

  element.querySelector(".color-picker-cancel").addEventListener("click", function () {
    me.hide();
  });

  var me = {

    /**
     * Shows the color picker
     * @param {HTMLElement} relativeTo The element to show the color picker relative to
     * @param {string} color The starting color for the color picker
     * @param {Function} onChanged The function which will be called when a color is picked.
     * @returns {void}
     */
    show: function show(relativeTo, color, onChanged) {
      selectedColor = color;

      cp.setHex(color);
      listener = onChanged;

      element.style.display = "block";

      var rect = relativeTo.getBoundingClientRect();
      element.style.left = rect.right + "px";
      element.style.top = rect.bottom + "px";
    },

    /**
     * Hides the color picker
     * @returns {void}
     */
    hide: function hide() {
      element.style.display = "none";
    }
  };
  return me;
};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = {
  schema1: function schema1() {
    return ["#775566", "#6688bb", "#556677", "#88aa88", "#88bb33", "#cc7744", "#003366", "#994422", "#331111"];
  },
  schema2: function schema2() {
    return ["#44b3c2", "#f1a94e", "#e45641", "#5d4c46", "#7b8d8e", "#2ca02c", "#003366", "#9467bd", "#bcbd22", "#e377c2"];
  },
  schema3: function schema3() {
    return ["#001166", "#0055aa", "#1199cc", "#99ccdd", "#002222", "#ddffff", "#446655", "#779988", "#115522"];
  },
  schema4: function schema4() {
    return ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
  },
  schema5: function schema5() {
    return ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];
  },
  // colorbrewer categorical 12
  schema6: function schema6() {
    return ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"];
  }
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**

configurableTL: //a configurable timeline

**/

var gridAxis = __webpack_require__(22);
var calendarAxis = __webpack_require__(17);
var radialAxis = __webpack_require__(28);
var imageUrls = __webpack_require__(3);
var annotateEvent = __webpack_require__(8);
var time = __webpack_require__(7);
var d3 = __webpack_require__(0);
var moment = __webpack_require__(6);
var globals = __webpack_require__(2);
var log = __webpack_require__(5)("TimelineStoryteller:configurableTL");

var utils = __webpack_require__(1);
var tr = __webpack_require__(4);
var selectWithParent = utils.selectWithParent;
var selectAllWithParent = utils.selectAllWithParent;
var logEvent = utils.logEvent;
var arcTween = utils.arcTween;
var onTransitionComplete = utils.onTransitionComplete;
var removeOnEnd = utils.removeOnEnd;

var getNextZIndex = __webpack_require__(9).getNextZIndex;

d3.configurableTL = function (unit_width) {
  var tl_scale = "Chronological",
      // timeline scale (chronological | relative | log | interim_duration | sequential)
  tl_layout = "Unified",
      // timeline layout  (unified | faceted | segmented)
  tl_representation = "Linear",
      // timeline representation (linear | grid | radial | spiral | curve)
  prev_tl_scale = "None",
      // timeline scale (chronological | relative | log | interim_duration | sequential)
  prev_tl_layout = "None",
      // timeline layout  (unified | faceted | segmented)
  prev_tl_representation = "None",
      // timeline representation (linear | grid | radial | spiral | curve)
  duration = 0,
      height = 760,
      width = 120,
      timeline_scale = d3.scaleLinear(),
      timeline_scale_segments = [],
      interim_duration_scale = d3.scaleLinear().nice().range([0.25 * unit_width, 4 * unit_width]),
      interim_duration_axis = d3.axisRight().offset(0).tickSizeOuter(0),
      tick_format,
      radial_axis = radialAxis(unit_width),
      radial_axis_quantiles = [],
      calendar_axis = calendarAxis(),
      grid_axis = gridAxis(unit_width),
      render_path,
      active_line,
      fresh_canvas = true,
      timeline_facet,
      timeline_segment;

  function configurableTL(selection) {
    var promises = [];
    selection.each(function (data) {
      if (data.min_start_date === undefined || data.max_end_date === undefined) {
        data.min_start_date = globals.global_min_start_date;
        data.max_end_date = globals.global_max_end_date;
      }

      // update timeline dimensions
      var g = d3.select(this),
          log_bounds = -1,
          curve_margin = 20;

      render_path = d3.line().x(function (d) {
        if (d[0] < curve_margin) {
          return curve_margin;
        }
        if (d[0] > width - curve_margin) {
          return d3.max([0, width - curve_margin]);
        }
        return d[0];
      }).y(function (d) {
        if (d[1] < curve_margin) {
          return curve_margin;
        }
        if (d[1] > height - curve_margin) {
          return d3.max([0, height - curve_margin]);
        }
        return d[1];
      }).curve(d3.curveBasis);

      // remove event annotations during a transition
      selectAllWithParent(".event_annotation").remove();

      logEvent("timeline initialized", "drawing");

      /**
      ---------------------------------------------------------------------------------------
      GLOBAL DIMENSIONS
      ---------------------------------------------------------------------------------------
      **/

      // add parent container for entire timeline
      var timeline_container_join = g.selectAll(".timeline").data([null]);

      // define the parent container
      var timeline_container_enter = timeline_container_join.enter().append("g").attr("class", "timeline").attr("transform", function () {
        return "translate(" + globals.padding.left + "," + globals.padding.top + ")";
      });

      timeline_container_enter.append("rect").attr("class", "timeline_frame").attr("width", width).attr("height", height).on("mouseover", function () {
        d3.select(this).style("opacity", 0.8).style("stroke", "#ccc").style("stroke-width", "0.5px");
      }).on("mouseout", function () {
        d3.select(this).style("opacity", 0.1).style("stroke", "none");
      }).on("dblclick", function () {
        logEvent("curve reset", "curve_reset");

        configurableTL.resetCurve();
      }).call(d3.drag().on("start", dragStarted).on("drag", dragged).on("end", dragEnd));

      var timeline_container = timeline_container_enter.merge(timeline_container_join);

      /**
      CURVE-specific timeline
      --*/

      timeline_container_enter.append("path").attr("id", "timecurve").style("visibility", "hidden");

      var timeline_container_update = g.selectAll(".timeline").transition("timeline_container_update").duration(duration);

      timeline_container_update.select("#timecurve").transition().delay(0).duration(duration).style("visibility", function () {
        return tl_representation !== "Curve" ? "hidden" : "visible";
      });

      // update parent container
      timeline_container_update.selectAll(".timeline_frame").attr("width", width).attr("height", height);

      logEvent("timeline container updated", "drawing");

      /**
      ---------------------------------------------------------------------------------------
      FACETS
      ---------------------------------------------------------------------------------------
      **/

      // add facet containers
      if (tl_layout === "Faceted" || prev_tl_layout === "Faceted") {
        timeline_facet = configureFacets(timeline_container, duration, width, height, tl_layout, tl_representation, tl_scale, unit_width).timeline_facet;
      }

      /**
      ---------------------------------------------------------------------------------------
      SEGMENTS
      ---------------------------------------------------------------------------------------
      **/

      // add segment containers
      if (tl_layout === "Segmented" || prev_tl_layout === "Segmented") {
        timeline_segment = configureSegments(timeline_container, duration, width, height, tl_layout, tl_representation, tl_scale, unit_width).timeline_segment;
      }

      /**
      ---------------------------------------------------------------------------------------
      SCALES
      ---------------------------------------------------------------------------------------
      **/

      var tssResults = configureTimelineScaleSegments(tl_layout, tl_representation, tl_scale, timeline_scale, tick_format, data, width, height, unit_width, log_bounds, interim_duration_scale);
      interim_duration_scale = tssResults.interim_duration_scale;
      log_bounds = tssResults.log_bounds;
      tick_format = tssResults.tick_format;
      timeline_scale = tssResults.timeline_scale;
      timeline_scale_segments = tssResults.timeline_scale_segments;

      // stash the new scales
      this.__chart__ = timeline_scale;

      /**
      ---------------------------------------------------------------------------------------
      AXES
      Linear Axes
      ---------------------------------------------------------------------------------------
      **/

      configureLinearAxis(timeline_scale, tl_layout, tl_representation, prev_tl_representation, tl_scale, data, tick_format, unit_width, timeline_container, duration, width, height);

      /**
      ---------------------------------------------------------------------------------------
      AXES
      Collapsed Axis
      ---------------------------------------------------------------------------------------
      **/
      configureCollapsedAxis(tl_representation, prev_tl_scale, tl_scale, tl_layout, interim_duration_axis, interim_duration_scale, duration, data, timeline_container, width, height, unit_width);

      /**
       * AXES
       * Radial Axes
       */
      radial_axis_quantiles = configureRadialAxes(tl_representation, tl_layout, tl_scale, timeline_container, timeline_scale, prev_tl_layout, prev_tl_representation, width, height, radial_axis_quantiles, timeline_scale_segments, radial_axis, duration, timeline_facet, timeline_segment, prev_tl_scale);

      /**
      ---------------------------------------------------------------------------------------
      AXES
      Calendar Axis
      ---------------------------------------------------------------------------------------
      **/
      configureCalendarAxis(tl_representation, duration, data, calendar_axis, timeline_container, prev_tl_representation);

      /**
      ---------------------------------------------------------------------------------------
      AXES
      Grid Axis
      ---------------------------------------------------------------------------------------
      **/
      configureGridAxis(tl_representation, duration, data, grid_axis, timeline_container, prev_tl_representation);

      // It is important that these guys get set here, in case the transitions get interrupted
      var old_scale = prev_tl_scale;
      var old_rep = prev_tl_representation;
      var old_layout = prev_tl_layout;
      prev_tl_scale = tl_scale;
      prev_tl_layout = tl_layout;
      prev_tl_representation = tl_representation;

      // Creates all the elements to be used
      var timeline_event_g = initializeElements(timeline_container, data, duration, width, height, unit_width, tl_representation, configurableTL);

      // Updates those elements to position/size/color them correctly
      var renderComplete = updateElements(interim_duration_scale, timeline_event_g, duration, configurableTL, tl_layout, tl_scale, tl_representation, width, height, data, unit_width, old_layout, old_rep, old_scale, timeline_scale);
      promises.push(renderComplete);
    });
    d3.timerFlush();

    promises.push(new Promise(function (resolve) {
      // HACK: A way to ensure that we always at least delay the full animation length
      setTimeout(resolve, duration * 3);
    }));

    configurableTL.renderComplete = Promise.all(promises);
    configurableTL.renderComplete.then(function () {
      configurableTL.renderComplete = undefined;
    });
  }

  function dragStarted() {
    if (tl_representation === "Curve" && active_line === undefined) {
      active_line = selectWithParent(".timeline").append("path").datum([]).attr("id", "active_line").attr("class", "line");
    }
  }

  function dragged(event) {
    if (tl_representation === "Curve" && active_line !== undefined && !globals.dirty_curve) {
      active_line.datum().push(d3.pointer(event, this));

      active_line.attr("d", render_path);
    }
  }

  function dragEnd() {
    globals.dirty_curve = true;
    selectWithParent(".timeline_frame").style("cursor", "auto");

    if (tl_representation === "Curve" && fresh_canvas) {
      selectWithParent("#active_line").transition("active_line_remove").duration(duration).call(removeOnEnd);

      selectAllWithParent("rect.event_span").transition("event_span_update").duration(duration).attr("transform", function (d) {
        return translateAlong(d, d.item_index, active_line.node());
      });
      fresh_canvas = false;

      // create actual visible time curve:
      selectWithParent("#timecurve").attr("d", createTimeCurveFunction(unit_width)(selectAllWithParent(".event_span").nodes().filter(function (d, i) {
        return i % 2 === 1;
      }))).style("visibility", "visible");
    }
  }

  function translateAlong(d, index, path) {
    var l = path.getTotalLength();
    var p = path.getPointAtLength(index * l / globals.max_item_index);
    d.curve_x = p.x;
    d.curve_y = p.y;
    d.translated_x = p.x;
    d.translated_y = p.y;
    return "translate(" + p.x + "," + p.y + ")";
  }

  configurableTL.reproduceCurve = function () {
    globals.dirty_curve = true;
    fresh_canvas = false;

    selectWithParent("#timecurve").style("visibility", "hidden");

    active_line = selectWithParent(".timeline").append("path").attr("id", "active_line").attr("class", "line").style("visibility", "hidden").attr("d", render_path);

    selectWithParent("#active_line").transition("active_line_reproduce").duration(duration).call(removeOnEnd);

    selectAllWithParent("rect.event_span").transition("event_span_reproduce").duration(duration).attr("transform", function (d) {
      return translateAlong(d, d.item_index, active_line.node());
    });

    // create actual visible time curve:
    selectWithParent("#timecurve").attr("d", createTimeCurveFunction(unit_width)(selectAllWithParent(".event_span").nodes().filter(function (d, i) {
      return i % 2 === 1;
    }))).style("visibility", "hidden");
  };

  configurableTL.resetCurve = function () {
    globals.dirty_curve = false;

    if (tl_representation === "Curve") {
      // remove event annotations during a reset
      selectAllWithParent(".event_annotation").remove();

      selectAllWithParent("rect.event_span").transition("event_span_reset").duration(duration).attr("transform", function (d) {
        d.curve_y = 0;
        return "translate(" + d.curve_x + "," + d.curve_y + ")";
      });
      active_line = undefined;
      fresh_canvas = true;

      selectWithParent(".timeline_frame").style("cursor", "crosshair");

      selectWithParent("#timecurve").style("visibility", "hidden");
    }
  };

  // getter / setter for path
  configurableTL.render_path = function (x) {
    if (!arguments.length) {
      return render_path;
    }
    render_path = x;
    return configurableTL;
  };

  // getter / setter for timeline scale
  configurableTL.tl_scale = function (x) {
    if (!arguments.length) {
      return tl_scale;
    }
    tl_scale = x;
    return configurableTL;
  };

  // getter / setter for timeline layout
  configurableTL.tl_layout = function (x) {
    if (!arguments.length) {
      return tl_layout;
    }
    tl_layout = x;
    return configurableTL;
  };

  // getter / setter for timeline representation
  configurableTL.tl_representation = function (x) {
    if (!arguments.length) {
      return tl_representation;
    }
    tl_representation = x;
    return configurableTL;
  };

  // getter / setter for previous timeline scale
  configurableTL.prev_tl_scale = function (x) {
    if (!arguments.length) {
      return prev_tl_scale;
    }
    prev_tl_scale = x;
    return configurableTL;
  };

  // getter / setter for previous timeline layout
  configurableTL.prev_tl_layout = function (x) {
    if (!arguments.length) {
      return prev_tl_layout;
    }
    prev_tl_layout = x;
    return configurableTL;
  };

  // getter / setter for previous timeline representation
  configurableTL.prev_tl_representation = function (x) {
    if (!arguments.length) {
      return prev_tl_representation;
    }
    prev_tl_representation = x;
    return configurableTL;
  };

  // getter / setter for previous timeline scale
  configurableTL.prev_tl_scale = function (x) {
    if (!arguments.length) {
      return prev_tl_scale;
    }
    prev_tl_scale = x;
    return configurableTL;
  };

  // getter / setter for transition duration
  configurableTL.duration = function (x) {
    if (!arguments.length) {
      return duration;
    }
    duration = x;
    return configurableTL;
  };

  // getter / setter for timeline height
  configurableTL.height = function (x) {
    if (!arguments.length) {
      return height;
    }
    height = x - globals.padding.top - globals.padding.bottom;
    return configurableTL;
  };

  // getter / setter for timeline width
  configurableTL.width = function (x) {
    if (!arguments.length) {
      return width;
    }
    width = x - globals.padding.left - globals.padding.right;
    return configurableTL;
  };

  // getter / setter for timeline scale
  configurableTL.timeline_scale = function (x) {
    if (!arguments.length) {
      return timeline_scale;
    }
    timeline_scale = x;
    return configurableTL;
  };

  // getter / setter for interim_duration_scale scale
  configurableTL.interim_duration_scale = function (x) {
    if (!arguments.length) {
      return interim_duration_scale;
    }
    interim_duration_scale = x;
    return configurableTL;
  };

  // getter / setter for timeline scale
  configurableTL.timeline_scale_segments = function (x) {
    if (!arguments.length) {
      return timeline_scale_segments;
    }
    timeline_scale_segments = x;
    return configurableTL;
  };

  // getter / setter for radial axis quantiles
  configurableTL.radial_axis_quantiles = function (x) {
    if (!arguments.length) {
      return radial_axis_quantiles;
    }
    radial_axis_quantiles = x;
    return configurableTL;
  };

  return configurableTL;
};

function createTimeCurveFunction(unit_width) {
  return d3.line().x(function (d) {
    return d.__data__.translated_x + unit_width / 2;
  }).y(function (d) {
    return d.__data__.translated_y + unit_width / 2;
  }).curve(d3.curveCardinal.tension(0.7));
}

/**
 * Returns a number if not-nan, 0 otherwise
 * @param {number} num The number to unnan
 * @returns {number} The number or 0 if the number is NaN
 */
function unNaN(num) {
  return (isNaN(num) ? 0 : num) || 0;
}

module.exports = d3.configurableTL;

function initializeElements(timeline_container, data, duration, width, height, unit_width, tl_representation, configurableTL) {
  var timeline_event_g_join = timeline_container.selectAll(".timeline_event_g").data(data, function (d, idx) {
    return d && d.hasOwnProperty("id") ? d.id : idx;
  });

  /**
  ---------------------------------------------------------------------------------------
  EVENTS
  ---------------------------------------------------------------------------------------
  **/

  // add event containers
  timeline_event_g_join.exit().transition("timeline_event_remove").style("opacity", 0).duration(duration).call(removeOnEnd);

  /**
  ---------------------------------------------------------------------------------------
  EVENT ENTER
  ---------------------------------------------------------------------------------------
  **/

  // define each event and its behaviour
  // new events go after the existing ones, as they always have (and so are drawn on top)
  var timeline_event_g_enter = timeline_event_g_join.enter().append("g").attr("class", "timeline_event_g").attr("id", function (d) {
    return "event_g" + d.event_id;
  }).raise();

  // define event behaviour
  timeline_event_g_enter.on("click", function (event, d) {
    if (!globals.playback_mode) {
      return eventClickListener(event, tl_representation, unit_width, configurableTL, d);
    }
  }).on("mouseover", function (event, d) {
    return eventMouseOverListener(event, d, tl_representation, unit_width, configurableTL);
  }).on("mouseout", eventMouseOutListener);

  // add rect events for linear timelines
  timeline_event_g_enter.append("rect").attr("class", "event_span").attr("height", unit_width).attr("width", unit_width).attr("y", height / 2).attr("x", width / 2).style("stroke", "#fff").style("opacity", 0).style("fill", eventColorMapping);

  // draw elapsed time as bar below the sequence, offset between events
  timeline_event_g_enter.append("rect").attr("class", "time_elapsed").attr("height", 0).attr("width", unit_width * 1.5).attr("y", height / 2).attr("x", width / 2).append("title").style("opacity", 0).text("");

  // add arc path events for radial timelines
  timeline_event_g_enter.append("path").attr("class", "event_span").style("stroke", "#fff").style("opacity", 1).style("fill", eventColorMapping);

  /**
  ---------------------------------------------------------------------------------------
  EVENT SPANS for SEGMENTED layouts
  ---------------------------------------------------------------------------------------
  span enter
  ---------------------------------------------------------------------------------------
  **/
  var event_span = timeline_event_g_enter.selectAll(".event_span_component").data(function (d) {
    var dateTimes = void 0;
    switch (globals.segment_granularity) {
      case "days":
        dateTimes = time.utcHour.range(time.utcHour.floor(d.start_date), time.utcHour.ceil(d.end_date));
        break;
      case "weeks":
        dateTimes = time.day.range(time.day.floor(d.start_date), time.day.ceil(d.end_date));
        break;
      case "months":
        dateTimes = time.day.range(time.day.floor(d.start_date), time.day.ceil(d.end_date));
        break;
      case "years":
        dateTimes = time.utcWeek.range(time.utcWeek.floor(d.start_date), time.utcWeek.ceil(d.end_date));
        break;
      case "decades":
        dateTimes = time.month.range(time.month.floor(d.start_date), time.month.ceil(d.end_date));
        break;
      case "centuries":
        dateTimes = d3.range(d.start_date.getUTCFullYear(), d.end_date.getUTCFullYear());
        break;
      case "millenia":
        dateTimes = d3.range(d.start_date.getUTCFullYear(), d.end_date.getUTCFullYear() + 1, 10);
        break;
      case "epochs":
        dateTimes = [d.start_date];
        break;
      default:
        break;
    }
    return dateTimes ? dateTimes.map(function (dateTime) {
      return {
        dateTime: dateTime,
        event_id: d.event_id
      };
    }) : [];
  }, function (d) {
    return d && d.event_id + d.dateTime;
  }).enter();

  event_span.append("rect").attr("class", "event_span_component").style("opacity", 0).style("fill", eventSpanColorMapping).attr("height", unit_width).attr("width", unit_width).attr("y", height / 2).attr("x", width / 2);

  event_span.append("path").attr("class", "event_span_component").style("opacity", 0).style("fill", eventSpanColorMapping);

  /**
  ---------------------------------------------------------------------------------------
  terminal span indicators for segmented layouts
  ---------------------------------------------------------------------------------------
  **/

  // add right-facing triangle path to indicate beginning of span
  timeline_event_g_enter.append("path").attr("class", "path_end_indicator").style("opacity", 0).attr("d", d3.symbol().type(d3.symbolTriangle).size(unit_width * 1.5)).style("display", "none");

  return timeline_event_g_enter.merge(timeline_event_g_join);
}

function updateElements(interim_duration_scale, timeline_event_g, duration, configurableTL, tl_layout, tl_scale, tl_representation, width, height, data, unit_width, prev_tl_layout, prev_tl_representation, prev_tl_scale, timeline_scale) {
  /**
  ---------------------------------------------------------------------------------------
  EVENT UPDATE (TRANSITIONS)
  ---------------------------------------------------------------------------------------
  **/

  var start = new Date();
  var initialTransition = timeline_event_g.transition("timeline_event_g_early_update").delay(0).duration(duration);

  earlyUpdate(initialTransition, tl_layout, prev_tl_layout, tl_representation, prev_tl_representation, tl_scale, prev_tl_scale);

  // configurableTL.currentTransition = timeline_event_g_final_update;
  transitionLog(start, initialTransition);

  /**
   * Trickles in attribute tweening based on data items
   * @param {*} d The data item
   * @param {*} i The index of the data item
   * @return {number} The delay that should be applied to the given item
   */
  function trickleDelayFn(d, i) {
    return (data.length - i) / data.length * duration;
  }

  // Render loop
  return onTransitionComplete(initialTransition).then(function () {
    // First update
    var transition = timeline_event_g.transition("timeline_event_g_update").delay(trickleDelayFn).duration(duration);
    update(tl_layout, tl_scale, tl_representation, width, height, data, unit_width, prev_tl_layout, prev_tl_representation, prev_tl_scale, timeline_scale, transition);
    transitionLog(start, transition);
    return onTransitionComplete(transition);
  }).then(function () {
    // Second update
    var transition = timeline_event_g.transition("timeline_event_g_delayed_update").delay(trickleDelayFn).duration(duration);
    delayedUpdate(tl_layout, tl_representation, tl_scale, interim_duration_scale, unit_width, timeline_scale, transition);
    transitionLog(start, transition);
    return onTransitionComplete(transition);
  }).then(function () {
    // Final update
    var transition = timeline_event_g.transition("timeline_event_g_final_update").delay(trickleDelayFn).duration(duration);
    finalUpdate(tl_layout, transition);
    transitionLog(start, transition);
    return onTransitionComplete(transition);
  });
}

function configureTimelineScaleSegments(tl_layout, tl_representation, tl_scale, timeline_scale, tick_format, data, width, height, unit_width, log_bounds, interim_duration_scale) {
  var timeline_scale_segments = [];
  var format = function format(d) {
    return globals.formatAbbreviation(d);
  };

  function updateScale(scale, representation) {
    if (scale === "Chronological") {
      if (representation === "Radial") {
        var yearBasedScale = function yearBasedScale(years_per_segment) {
          var start = Math.floor(startYear / years_per_segment) * years_per_segment;
          var end = (Math.ceil((endYear + 1) / years_per_segment) + 1) * years_per_segment;
          timeline_scale_segments = time.year.range(moment([start, 0, 1]).toDate(), moment([end, 0, 1]).toDate(), years_per_segment);
          timeline_scale.domain([moment([start, 0, 1]).toDate(), moment([end + years_per_segment, 0, 1]).toDate()]);
        };

        // valid scale
        // initialize the time scale
        timeline_scale = d3.scaleTime().range([0, 2 * Math.PI]);

        var endYear = data.max_end_date.getUTCFullYear();
        var startYear = data.min_start_date.getUTCFullYear();

        switch (globals.segment_granularity) {
          case "days":
            if (time.hour.count(time.day.floor(data.min_start_date), time.day.ceil(data.max_end_date)) > 24) {
              timeline_scale_segments = time.hour.range(time.day.floor(data.min_start_date), time.hour.offset(time.day.ceil(data.max_end_date), 3), 12);
            } else {
              timeline_scale_segments = time.hour.range(time.day.floor(data.min_start_date), time.hour.offset(time.day.ceil(data.max_end_date), 3), 3);
            }
            timeline_scale.domain([time.day.floor(data.min_start_date), time.day.ceil(data.max_end_date)]);
            break;
          case "weeks":
            timeline_scale_segments = time.week.range(time.week.floor(data.min_start_date), time.week.offset(data.max_end_date, 1), 2);
            timeline_scale.domain([time.week.floor(data.min_start_date), time.week.offset(data.max_end_date, 1)]);
            break;
          case "months":
            timeline_scale_segments = time.month.range(time.month.floor(data.min_start_date), time.month.offset(data.max_end_date, 1));
            timeline_scale.domain([time.month.floor(data.min_start_date), time.month.offset(data.max_end_date, 1)]);
            break;
          case "years":
            timeline_scale_segments = time.year.range(time.year.floor(data.min_start_date), time.year.offset(data.max_end_date, 1));
            timeline_scale.domain([time.year.floor(data.min_start_date), time.year.offset(data.max_end_date, 1)]);
            break;
          case "decades":
            yearBasedScale(endYear - startYear >= 50 ? 10 : 5);
            break;
          case "centuries":
            yearBasedScale(endYear - startYear >= 500 ? 100 : 20);
            break;
          case "millenia":
            yearBasedScale(endYear - startYear >= 5000 ? 1000 : 200);
            break;
          case "epochs":
            timeline_scale_segments = [data.min_start_date.valueOf(), data.min_start_date.valueOf() * 0.25, data.min_start_date.valueOf() * 0.5, data.min_start_date.valueOf() * 0.75];
            timeline_scale.domain([data.min_start_date, data.max_end_date]);
            break;
          default:
            break;
        }
        logEvent(scale + " scale updated with " + globals.date_granularity + " date granularity and range: " + data.min_start_date + " - " + data.max_end_date, "scale_update");
      } else {
        // valid scale
        if (globals.date_granularity === "epochs") {
          // eslint-disable-line no-lonely-if
          timeline_scale = d3.scaleLinear().range([0, width - unit_width]).domain([data.min_start_date.valueOf(), data.max_end_date.valueOf()]);
          tick_format = format;
        } else {
          timeline_scale = d3.scaleTime().range([0, width - unit_width]).domain([data.min_start_date, data.max_end_date]);
          if (globals.date_granularity === "years" && data.min_start_date.getUTCFullYear() <= 100) {
            tick_format = function tick_format(d) {
              if (d.getUTCFullYear() > 0) {
                return +d.getUTCFullYear() + " AD";
              } else if (d.getUTCFullYear() < 0) {
                return -1 * d.getUTCFullYear() + " BC";
              } else if (d.getUTCFullYear() === 0) {
                return 0;
              }
            };
          }
        }
      }
      logEvent(scale + " scale updated with " + globals.date_granularity + " date granularity and range: " + data.min_start_date + " - " + data.max_end_date, "scale_update");
    } else if (scale === "Log") {
      timeline_scale = d3.scaleLog().range([0, width - unit_width]);

      log_bounds = -1 * Math.abs(data.max_end_date.valueOf() - data.min_start_date.valueOf()) - 1;
      timeline_scale.domain([log_bounds, -1]);

      switch (globals.segment_granularity) {
        case "days":
          log_bounds = -1 * time.hour.count(data.min_start_date, data.max_end_date) - 1;
          tick_format = function tick_format(d) {
            return d + tr(" hours");
          };
          break;
        case "weeks":
          log_bounds = -1 * time.day.count(data.min_start_date, data.max_end_date) - 1;
          tick_format = function tick_format(d) {
            return d + tr(" days");
          };
          break;
        case "months":
          log_bounds = -1 * time.week.count(data.min_start_date, data.max_end_date) - 1;
          tick_format = function tick_format(d) {
            return d + " weeks";
          };
          break;
        case "years":
          log_bounds = -1 * time.month.count(data.min_start_date, data.max_end_date) - 1;
          tick_format = function tick_format(d) {
            return d + tr(" months");
          };
          break;
        case "decades":
        case "centuries":
        case "millenia":
          log_bounds = -1 * Math.abs(data.max_end_date.getUTCFullYear() - data.min_start_date.getUTCFullYear()) - 1;
          tick_format = function tick_format(d) {
            return d + tr(" years");
          };
          break;
        default:
          log_bounds = -1 * Math.abs(data.max_end_date.valueOf() - data.min_start_date.valueOf()) - 1;
          tick_format = format;
          break;
      }
      timeline_scale.domain([log_bounds, -1]);
      logEvent(scale + " scale updated with " + globals.segment_granularity + " granularity and range: " + data.min_start_date + " - " + data.max_end_date, "scale_update");
    } else if (scale === "Collapsed" || scale === "Sequential") {
      if (scale === "Sequential" && representation === "Radial") {
        // valid scale
        var index_offset = 5;
        if (globals.max_seq_index > 500) {
          index_offset = 100;
        } else if (globals.max_seq_index > 100) {
          index_offset = 50;
        } else if (globals.max_seq_index > 50) {
          index_offset = 10;
        } else if (globals.max_seq_index > 10) {
          index_offset = 5;
        } else {
          index_offset = 1;
        }
        timeline_scale = d3.scaleLinear().range([0, 2 * Math.PI]).domain([0, (Math.ceil(globals.max_seq_index / index_offset) + 1) * index_offset]);
        timeline_scale_segments = d3.range(0, (Math.ceil(globals.max_seq_index / index_offset) + 1) * index_offset, index_offset);
        logEvent(tl_scale + " scale updated with range: 0 - " + globals.max_seq_index, "scale_update");
      } else {
        timeline_scale = d3.scaleLinear().range([0, globals.max_seq_index * 1.5 * unit_width - unit_width]).domain([0, globals.max_seq_index * unit_width]);

        if (scale === "Collapsed") {
          var i = -1,
              last_start_date = void 0;

          // valid Collapsed scale
          data.forEach(function (item) {
            i++;
            if (i === 0) {
              item.time_elapsed = 0;
              last_start_date = item.start_date;
            } else if (item.start_date.valueOf() - last_start_date.valueOf() > 0) {
              item.time_elapsed = item.start_date.valueOf() - last_start_date.valueOf();
              if (globals.date_granularity === "epochs") {
                item.time_elapsed_label = format(item.start_date.valueOf() - last_start_date.valueOf()) + tr(" years");
              } else {
                item.time_elapsed_label = moment(item.start_date).from(moment(last_start_date), true);
              }
              last_start_date = item.start_date;
            } else {
              item.time_elapsed = 0;
              if (globals.date_granularity === "epochs") {
                item.time_elapsed_label = format(item.start_date.valueOf() - last_start_date.valueOf()) + tr(" years");
              } else {
                item.time_elapsed_label = moment(item.start_date).from(moment(last_start_date), true);
              }
            }
          });

          var max_time_elapsed = d3.max(data, function (d) {
            return d.time_elapsed;
          });

          // initialize the time scale
          if (globals.date_granularity === "epochs") {
            interim_duration_scale = d3.scaleLog().range([0.25 * unit_width, 4 * unit_width]).domain([1, max_time_elapsed]);
          } else {
            interim_duration_scale = d3.scaleLinear().range([0.25 * unit_width, 4 * unit_width]).domain([0, max_time_elapsed]);
          }
        }

        logEvent(scale + " scale updated with range: 0 - " + globals.max_seq_index, "scale_update");
      }
    }
  }

  // update scales
  switch (tl_layout) {
    case "Unified":
      if (tl_representation === "Linear" && (tl_scale === "Chronological" || tl_scale === "Log" || tl_scale === "Collapsed")) {
        updateScale(tl_scale, tl_representation);
      } else if (tl_representation === "Radial" && (tl_scale === "Chronological" || tl_scale === "Sequential")) {
        updateScale(tl_scale, tl_representation);
      }
      break;
    default:
      break;
    case "Faceted":
      switch (tl_representation) {

        case "Linear":
          switch (tl_scale) {

            case "Chronological":
            case "Log":
            case "Sequential":
              // valid scale
              updateScale(tl_scale, tl_representation);
              break;

            case "Relative":
              // valid scale
              if (globals.date_granularity === "epochs") {
                timeline_scale = d3.scaleLinear().range([0, width - unit_width]).domain([0, globals.max_end_age]);
                tick_format = format;
              } else {
                timeline_scale = d3.scaleLinear().range([0, width - unit_width]).domain([0, globals.max_end_age]);
                tick_format = function tick_format(d) {
                  var converted_tick = d;
                  if (globals.max_end_age / 86400000 > 1000) {
                    converted_tick = Math.round(d / 31536000730) + tr(" years");
                  } else if (globals.max_end_age / 86400000 > 120) {
                    converted_tick = Math.round(d / 2628000000) + tr(" months");
                  } else if (globals.max_end_age / 86400000 > 2) {
                    converted_tick = Math.round(d / 86400000) + tr(" days");
                  } else {
                    converted_tick = Math.round(d / 3600000) + tr(" hours");
                  }
                  return converted_tick;
                };
              }
              logEvent(tl_scale + " scale updated with " + globals.date_granularity + " date granularity and range: 0 - " + globals.max_end_age, "scale_update");
              break;
            default:
              break;
          }
          break;
        default:
          break;

        case "Radial":
          switch (tl_scale) {

            case "Chronological":
            case "Sequential":
              updateScale(tl_scale, tl_representation);
              break;

            case "Relative":
              // valid scale
              timeline_scale = d3.scaleLinear().range([0, 2 * Math.PI]);

              if (globals.segment_granularity === "days") {
                timeline_scale.domain([0, globals.max_end_age]);
                timeline_scale_segments = d3.range(0, globals.max_end_age / 3600000 + 1);
              } else {
                timeline_scale.domain([0, globals.max_end_age * 1.05]);
                timeline_scale_segments = d3.range(0, Math.round((globals.max_end_age + 86400000) / 86400000));
              }
              logEvent(tl_scale + " scale updated with " + globals.date_granularity + " date granularity and range: 0 - " + data.max_end_age, "scale_update");
              break;
            default:
              break;
          }
          break;
      }
      break;

    case "Segmented":
      if (tl_representation === "Linear" && tl_scale === "Chronological") {
        // valid scale
        timeline_scale = d3.scaleLinear().range([0, width - unit_width]);

        switch (globals.segment_granularity) {
          case "days":
            timeline_scale.domain([0, 24]);
            break;
          case "weeks":
            timeline_scale.domain([0, 7]);
            break;
          case "months":
            timeline_scale.domain([1, 32]);
            break;
          case "years":
            timeline_scale.domain([1, 53]);
            break;
          case "decades":
            timeline_scale.domain([0, 120]);
            break;
          case "centuries":
            timeline_scale.domain([0, 100]);
            break;
          case "millenia":
            timeline_scale.domain([0, 1000]);
            break;
          case "epochs":
            timeline_scale.domain([data.min_start_date.valueOf(), data.max_end_date.valueOf()]);
            break;
          default:
            break;
        }
        logEvent(tl_scale + " scale updated with domain: " + timeline_scale.domain(), "scale_update");
      } else if (tl_representation === "Radial" && tl_scale === "Chronological") {
        // valid scale
        timeline_scale = d3.scaleLinear().range([0, 2 * Math.PI]);

        switch (globals.segment_granularity) {
          case "days":
            timeline_scale_segments = d3.range(0, 25, 2);
            timeline_scale.domain([0, 24]);
            break;
          case "weeks":
            timeline_scale_segments = d3.range(0, 8);
            timeline_scale.domain([0, 7]);
            break;
          case "months":
            timeline_scale_segments = d3.range(1, 33);
            timeline_scale.domain([1, 33]);
            break;
          case "years":
            timeline_scale_segments = d3.range(1, 54, 2);
            timeline_scale.domain([1, 53]);
            break;
          case "decades":
            timeline_scale_segments = d3.range(0, 121, 12);
            timeline_scale.domain([0, 125]);
            break;
          case "centuries":
            timeline_scale_segments = d3.range(0, 101, 10);
            timeline_scale.domain([0, 105]);
            break;
          case "millenia":
            timeline_scale_segments = d3.range(0, 1001, 100);
            timeline_scale.domain([0, 1050]);
            break;
          case "epochs":
            timeline_scale_segments = [data.min_start_date.valueOf()];
            timeline_scale.domain([data.min_start_date.valueOf(), data.max_end_date.valueOf()]);
            break;
          default:
            break;
        }
        logEvent(tl_scale + " scale updated with domain: " + timeline_scale.domain(), "scale_update");
      }
      break;
  }

  return { timeline_scale_segments: timeline_scale_segments, timeline_scale: timeline_scale, tick_format: tick_format, log_bounds: log_bounds, interim_duration_scale: interim_duration_scale };
}

function configureSegments(timeline_container, duration, width, height, tl_layout, tl_representation, tl_scale, unit_width) {
  var timeline_segment_join = timeline_container.selectAll(".timeline_segment").data(globals.segments.domain());

  var segment_number = 0;

  var timeline_segment_exit = timeline_segment_join.exit().transition("timeline_segment_exit").duration(duration).call(removeOnEnd);

  // define each segment and its rect container
  var timeline_segment_enter = timeline_segment_join.enter().append("g").attr("class", "timeline_segment").each(insertFacetAtAxis);

  var timeline_segment = timeline_segment_enter.merge(timeline_segment_join);

  var timeline_segment_update = timeline_segment.transition("timeline_segment_update").duration(duration);

  timeline_segment_enter.append("rect").attr("class", "timeline_segment_frame").attr("width", d3.max([0, width])).attr("height", 0);

  // print the name of each segment
  timeline_segment_enter.append("text").attr("class", "segment_title").attr("dy", "-0.5em").style("text-anchor", "middle").text("").attr("transform", "translate(0,0)rotate(0)");

  // update segment container dimensions
  timeline_segment_update.select(".timeline_segment_frame").attr("width", d3.max([0, width])).attr("height", function () {
    if (tl_layout !== "Segmented" || tl_representation === "Calendar" || tl_representation === "Grid") {
      return 0;
    } else if (tl_representation === "Linear") {
      return d3.max([0, height / globals.num_segments]);
    } else if (tl_representation === "Radial") {
      return 0;
    } else if (tl_representation === "Calendar" || tl_representation === "Grid") {
      return 0;
    }

    return 0;
  }).attr("transform", function () {
    var offset_x, offset_y;

    if (tl_layout !== "Segmented" || tl_representation === "Calendar" || tl_representation === "Grid") {
      offset_x = 0;
      offset_y = 0;
    } else if (tl_representation === "Linear") {
      offset_x = 0;
      offset_y = segment_number * (height / globals.num_segments);
      segment_number++;
    } else if (tl_representation === "Radial") {
      offset_x = width / 2;
      offset_y = 0;
    } else {
      offset_x = width / 2;
      offset_y = height / 2;
    }
    return "translate(" + unNaN(offset_x) + "," + unNaN(offset_y) + ")";
  });

  segment_number = 0;

  timeline_segment_update.select("text.segment_title").text(function (d) {
    if (tl_layout !== "Segmented" || tl_representation === "Calendar" || tl_representation === "Grid" || globals.segment_granularity === "epochs") {
      return "";
    }
    return d;
  }).attr("transform", function () {
    var offset_x = 0,
        offset_y = 0,
        rotation = 0;
    if (tl_layout !== "Segmented" || tl_representation === "Calendar" || tl_representation === "Grid") {
      offset_x = width / 2;
      offset_y = height / 2;
      rotation = 0;
    } else if (tl_representation === "Linear") {
      offset_x = 0;
      offset_y = segment_number * (height / globals.num_segments) + height / globals.num_segments / 2;
      rotation = 270;
      segment_number++;
    } else if (tl_representation === "Radial") {
      offset_x = segment_number % globals.num_segment_cols * (width / globals.num_segment_cols) + width / globals.num_segment_cols / 2;
      offset_y = Math.floor(segment_number / globals.num_segment_cols) * (height / globals.num_segment_rows) + globals.buffer + unit_width;
      rotation = 0;
      segment_number++;
    }
    return "translate(" + offset_x + " ," + offset_y + ")rotate(" + rotation + ")";
  });

  timeline_segment_exit.select(".timeline_segment_frame").attr("height", 0);

  timeline_segment_exit.select("text.segment_title").attr("transform", "translate(" + (0 - width) + " ,0)");

  logEvent("segment containers updated", "drawing");

  return { timeline_segment: timeline_segment };
}

function configureFacets(timeline_container, duration, width, height, tl_layout, tl_representation, tl_scale, unit_width) {
  var timeline_facet_join = timeline_container.selectAll(".timeline_facet").data(globals.facets.domain());

  var timeline_facet_exit = timeline_facet_join.exit().transition("timeline_facet_exit").duration(duration).call(removeOnEnd);

  var facet_number = 0;

  // define each facet and its rect container
  var timeline_facet_enter = timeline_facet_join.enter().append("g").attr("class", "timeline_facet").each(insertFacetAtAxis);

  var timeline_facet = timeline_facet_enter.merge(timeline_facet_join);

  // update facet container dimensions
  var timeline_facet_update = timeline_facet.transition("timeline_facet_update").duration(duration);

  timeline_facet_enter.append("rect").attr("class", "timeline_facet_frame").attr("width", d3.max([0, width])).attr("height", 0);

  timeline_facet_enter.append("title").text("");

  // print the name of each facet
  timeline_facet_enter.append("text").attr("class", "facet_title").attr("dy", "-0.5em").style("text-anchor", "middle").text(function (d) {
    return getFacetTitleText(tl_layout, tl_representation, height, d);
  }).attr("transform", "translate(0,0)rotate(0)");

  timeline_facet_update.select("title").text(function (d) {
    return d;
  });

  timeline_facet_update.select(".timeline_facet_frame").attr("width", d3.max([0, width])).attr("height", function () {
    if (tl_layout === "Faceted" && tl_representation === "Linear") {
      return d3.max([0, height / globals.num_facets]);
    }
    return 0;
  }).attr("transform", function () {
    var offset_x, offset_y;

    if (tl_layout !== "Faceted") {
      offset_x = width / 2;
      offset_y = height / 2;
    } else if (tl_representation === "Linear") {
      offset_x = 0;
      offset_y = facet_number * (height / globals.num_facets);
      facet_number++;
    } else if (tl_representation === "Radial" || tl_representation === "Spiral" && tl_scale === "Sequential") {
      offset_x = width / 2;
      offset_y = height / 2;
    } else {
      offset_x = width / 2;
      offset_y = height / 2;
    }
    return "translate(" + unNaN(offset_x) + "," + unNaN(offset_y) + ")";
  });

  timeline_facet_exit.select(".timeline_facet_frame").attr("height", 0);

  facet_number = 0;

  timeline_facet_update.select("text.facet_title").text(function (d) {
    return getFacetTitleText(tl_layout, tl_representation, height, d);
  }).attr("transform", function () {
    var offset_x = 0,
        offset_y = 0,
        rotation = 0;
    if (tl_layout !== "Faceted") {
      offset_x = width / 2;
      offset_y = height / 2;
      rotation = 0;
    } else if (tl_representation === "Linear") {
      offset_x = 0;
      offset_y = facet_number * (height / globals.num_facets) + height / globals.num_facets / 2;
      rotation = 270;
      facet_number++;
    } else if (tl_representation === "Radial") {
      offset_x = facet_number % globals.num_facet_cols * (width / globals.num_facet_cols) + width / globals.num_facet_cols / 2;
      offset_y = Math.floor(facet_number / globals.num_facet_cols) * (height / globals.num_facet_rows) + globals.buffer + unit_width;
      rotation = 0;
      facet_number++;
    } else if (tl_representation === "Spiral" && tl_scale === "Sequential") {
      offset_x = facet_number % globals.num_facet_cols * (width / globals.num_facet_cols) + width / globals.num_facet_cols / 2;
      offset_y = Math.floor(facet_number / globals.num_facet_cols) * globals.spiral_dim + globals.buffer + unit_width;
      rotation = 0;
      facet_number++;
    } else {
      offset_x = width / 2;
      offset_y = height / 2;
      rotation = 0;
    }
    return "translate(" + unNaN(offset_x) + " ," + unNaN(offset_y) + ")rotate(" + unNaN(rotation) + ")";
  });

  timeline_facet_exit.select("text.facet_title").attr("transform", "translate(" + (0 - width) + " ,0)");

  logEvent("facet containers updated", "drawing");

  return { timeline_facet: timeline_facet };
}

function initialOpacity(d, tl_layout, prev_tl_layout, tl_representation, prev_tl_representation, tl_scale, prev_tl_scale, checkRadial) {
  // If we were segmented at all, or if we were radial at all, then hide it.
  var noRadial = tl_representation !== "Radial" && prev_tl_representation !== "Radial";
  var hasRadial = tl_representation === "Radial" && prev_tl_representation === "Radial";
  var passesRepresentationCheck = checkRadial ? hasRadial : noRadial;
  if (tl_layout === "Segmented" && prev_tl_layout === "Segmented" || passesRepresentationCheck) {
    return 0;

    // If it isn't "active" or wasn't "active"
  } else if (globals.prev_active_event_list.indexOf(d.event_id) === -1 || globals.active_event_list.indexOf(d.event_id) === -1) {
    // If we are just hiding it, then set opaticy to 0
    if (globals.filter_type === "Hide") {
      return 0;
    } else if (globals.filter_type === "Emphasize") {
      // Otherwise if we are not currently active, then return .1, cause we are not in the active list
      if (globals.active_event_list.indexOf(d.event_id) === -1) {
        return 0.1;
      }

      // We are in the active list, return 1 to show it at full opacity
      return 1;
    }
    // We are in the active list and we are selected, then show fully.
  } else if (globals.active_event_list.indexOf(d.event_id) !== -1 && d.selected) {
    return 1;
  } else if (globals.active_event_list.indexOf(d.event_id) !== -1) {
    if (tl_scale !== prev_tl_scale || tl_layout !== prev_tl_layout || tl_representation !== prev_tl_representation) {
      return 0.5;
    }

    return 1;
  } else {
    return 0.1;
  }
}

function eventSpanColorMapping() {
  if (globals.categories.domain()[0] === undefined) {
    return "#E45641";
  }

  return globals.categories(d3.select(this.parentNode).datum().category);
}

function eventColorMapping(d) {
  return d.category === undefined ? "#E45641" : globals.categories(d.category);
}

function eventMouseOutListener(event, d) {
  selectAllWithParent(".temporary_annotation").transition("event_hover_hide").duration(100).style("opacity", 0);
  selectAllWithParent(".temporary_annotation").transition("event_hover_remove").delay(100).call(removeOnEnd);

  d3.select(this).selectAll(".event_span").attr("filter", "none").style("stroke", "#fff").style("stroke-width", "0.25px");
  d3.select(this).selectAll(".event_span_component").style("stroke", "#fff").style("stroke-width", "0.25px");
  if (d.selected) {
    d3.select(this).selectAll(".event_span").attr("filter", "url(#drop-shadow)").style("stroke", "#f00").style("stroke-width", "1.25px");
    d3.select(this).selectAll(".event_span_component").style("stroke", "#f00").style("stroke-width", "1px");
  }
}

function eventMouseOverListener(event, d, tl_representation, unit_width, configurableTL) {
  d3.select(this).selectAll(".event_span").attr("filter", "url(#drop-shadow)").style("stroke", "#f00").style("stroke-width", "1.25px").style("cursor", "url(\"" + imageUrls("pin.png") + "\"),auto");
  d3.select(this).selectAll(".event_span_component").style("stroke", "#f00").style("stroke-width", "0.5px").style("cursor", "url(\"" + imageUrls("pin.png") + "\"),auto");

  var eventHasAnnotations = selectAllWithParent(".event_" + d.event_id + "_annotation").size() > 0;
  if (!eventHasAnnotations) {
    var x_pos = event.x,
        y_pos = event.y;

    var item_x_pos = 0;
    var item_y_pos = 0;

    if (tl_representation !== "Radial") {
      item_x_pos = d.rect_x_pos + d.rect_offset_x + globals.padding.left + unit_width * 0.5;
      item_y_pos = d.rect_y_pos + d.rect_offset_y + globals.padding.top + unit_width * 0.5;
    } else {
      item_x_pos = d.path_x_pos + d.path_offset_x + globals.padding.left;
      item_y_pos = d.path_y_pos + d.path_offset_y + globals.padding.top;
    }

    var annoText = d.content_text || d.facet || d.category || d.start_date || d.end_date || "";

    var _annotateEvent = annotateEvent(configurableTL, annoText, item_x_pos, item_y_pos, x_pos - item_x_pos, y_pos - item_y_pos, 50, 50, utils.labelWidth(annoText), d.event_id, { id: -1 }),
        element = _annotateEvent.element;

    element.classed("temporary_annotation", true);

    element.select("rect.annotation_frame").style("stroke", "#f00");

    element.transition("event_hover_show").duration(250).style("opacity", 1);
  }
}

function eventClickListener(event, tl_representation, unit_width, configurableTL, d) {
  logEvent("event " + d.event_id + " clicked", "event_click");

  if (!d.selected || d.selected === undefined) {
    var x_pos = event.x,
        y_pos = event.y;
    d.selected = true;

    d3.select(this).selectAll(".event_span").attr("filter", "url(#drop-shadow)").style("stroke", "#f00").style("stroke-width", "1.25px");
    d3.select(this).selectAll(".event_span_component").style("stroke", "#f00").style("stroke-width", "1px");

    // annotate the event with its label if shift is not clicked
    if (!event.shiftKey) {
      x_pos = event.x;
      y_pos = event.y;

      var item_x_pos = 0;
      var item_y_pos = 0;

      if (tl_representation !== "Radial") {
        item_x_pos = d.rect_x_pos + d.rect_offset_x + globals.padding.left + unit_width * 0.5;
        item_y_pos = d.rect_y_pos + d.rect_offset_y + globals.padding.top + unit_width * 0.5;
      } else {
        item_x_pos = d.path_x_pos + d.path_offset_x + globals.padding.left;
        item_y_pos = d.path_y_pos + d.path_offset_y + globals.padding.top;
      }

      var highestId = 0;
      globals.annotation_list.forEach(function (n) {
        if (n.id > highestId) {
          highestId = n.id;
        }
      });
      var annoText = d.content_text || d.facet || d.category || d.start_date || d.end_date || "";
      var annotation = {
        id: highestId + 1,
        item_index: d.event_id,
        count: d.annotation_count,
        content_text: annoText,
        x_pos: item_x_pos,
        y_pos: item_y_pos,
        x_offset: x_pos - item_x_pos,
        y_offset: y_pos - item_y_pos,
        x_anno_offset: 50,
        y_anno_offset: 50,
        label_width: utils.labelWidth(annoText),
        z_index: getNextZIndex()
      };

      globals.annotation_list.push(annotation);

      logEvent("event " + d.event_id + " annotation: <<" + annoText + ">>");

      selectAllWithParent(".temporary_annotation").remove();

      var _annotateEvent2 = annotateEvent(configurableTL, annoText, item_x_pos, item_y_pos, x_pos - item_x_pos, y_pos - item_y_pos, 50, 50, utils.labelWidth(annoText), d.event_id, annotation),
          element = _annotateEvent2.element;

      element.transition("event_annotation_show").duration(50).style("opacity", 1);

      d.annotation_count++;
    } else {
      logEvent("event " + d.event_id + " annotation supressed (shift key)");
    }
  } else if (!event.shiftKey) {
    d.selected = false;
    d3.select(this).selectAll(".event_span").attr("filter", "none").style("stroke", "#fff").style("stroke-width", "0.25px");
    d3.select(this).selectAll(".event_span_component").style("stroke", "#fff").style("stroke-width", "0.25px");

    logEvent("event " + d.event_id + " annotation removed");

    // Remove all annotations for this event
    selectAllWithParent(".event_" + d.event_id + "_annotation").remove();
  }
}

function configureGridAxis(tl_representation, duration, data, grid_axis, timeline_container, prev_tl_representation) {
  if (tl_representation === "Grid") {
    // determine the range, round to whole centuries
    var grid_min = Math.floor(data.min_start_date.getUTCFullYear() / 100) * 100,
        grid_max = Math.ceil((data.max_end_date.getUTCFullYear() + 1) / 100) * 100;

    grid_axis.min_year(grid_min).max_year(grid_max);

    var grid_axis_container = timeline_container.selectAll(".grid_axis").data([d3.range(grid_min, grid_max)]);

    logEvent("Grid axis domain: " + grid_min + " - " + grid_max, "axis_update");

    grid_axis_container.enter().append("g").attr("class", "grid_axis").style("opacity", 0);

    timeline_container.selectAll(".grid_axis").transition("grid_axis_update").delay(0).duration(duration).style("opacity", 1).call(grid_axis.min_year(grid_min).max_year(grid_max));

    logEvent("Grid axis updated", "axis_update");
  } else if (prev_tl_representation === "Grid" && tl_representation !== "Grid") {
    hideAxis(timeline_container, duration, "grid_axis");
  }
}

function hideAxis(timeline_container, duration, selector) {
  timeline_container.selectAll("." + selector).transition(selector + "_hide").duration(duration * 3).style("opacity", 0);

  timeline_container.selectAll(".grid_axis").transition(selector + "_remove").delay(duration * 3).call(removeOnEnd);
}

function configureCalendarAxis(tl_representation, duration, data, calendar_axis, timeline_container, prev_tl_representation) {
  if (tl_representation === "Calendar") {
    // determine the range, round to whole years
    var range_floor = data.min_start_date.getUTCFullYear(),
        range_ceil = data.max_end_date.getUTCFullYear();

    var calendar_axis_container = timeline_container.selectAll(".calendar_axis").data([d3.range(range_floor, range_ceil + 1)]);

    calendar_axis_container.enter().append("g").attr("class", "calendar_axis").style("opacity", 0);

    timeline_container.selectAll(".calendar_axis").transition("calendar_axis_update").delay(0).duration(duration).style("opacity", 1).call(calendar_axis);

    logEvent("Calendar axis updated", "axis_update");
  } else if (prev_tl_representation === "Calendar" && tl_representation !== "Calendar") {
    hideAxis(timeline_container, duration, "calendar_axis");
  }
}

function configureSegmentedRadialAxis(tl_representation, tl_layout, tl_scale, duration, radial_axis_quantiles, timeline_scale_segments, radial_axis, timeline_segment, width, height, timeline_scale, timeline_container, prev_tl_representation, prev_tl_layout) {
  if (tl_representation === "Radial" && tl_layout === "Segmented") {
    radial_axis.duration(duration);

    radial_axis.radial_axis_units("Segments");
    if (radial_axis_quantiles !== timeline_scale_segments) {
      radial_axis_quantiles = timeline_scale_segments;
    }
    radial_axis.final_quantile(timeline_scale_segments[timeline_scale_segments.length - 1]);

    // get radial_axis_quantiles of timeline_scale_segments for radial axis ticks
    if (globals.segment_granularity === "epochs") {
      radial_axis.track_bounds(1);
    } else {
      radial_axis.track_bounds(globals.num_tracks + 1);
    }

    // update the radial axis for segmented radial timelines
    var segmented_radial_axis = timeline_segment.selectAll(".segmented_radial_axis").data([radial_axis_quantiles]);

    var segment_number = 0;

    segmented_radial_axis.enter().append("g").attr("class", "segmented_radial_axis").style("opacity", 0);

    timeline_segment.selectAll(".segmented_radial_axis").transition("segmented_radial_axis_update").duration(0).style("opacity", 1).attr("transform", function () {
      var offset_x, offset_y;

      if (tl_layout !== "Segmented" || tl_representation === "Calendar" || tl_representation === "Grid") {
        offset_x = width / 2;
        offset_y = height / 2;
      } else if (tl_representation === "Linear") {
        offset_x = width / 2;
        offset_y = segment_number * (height / globals.num_segments);
        segment_number++;
      } else if (tl_representation === "Radial") {
        var segment_dim_x = width / globals.num_segment_cols;
        var segment_dim_y = height / globals.num_segment_rows;

        offset_x = segment_number % globals.num_segment_cols * segment_dim_x;
        offset_y = Math.floor(segment_number / globals.num_segment_cols) * segment_dim_y + globals.buffer;

        segment_number++;
      } else {
        offset_x = width / 2;
        offset_y = height / 2;
      }
      return "translate(" + unNaN(offset_x) + "," + unNaN(offset_y) + ")";
    }).call(radial_axis.radial_axis_scale(timeline_scale).x_pos(width / globals.num_segment_cols / 2).y_pos(height / globals.num_segment_rows / 2));

    logEvent("Segmented Radial axis updated", "axis_update");
  } else if (prev_tl_representation === "Radial" && prev_tl_layout === "Segmented" && (tl_representation !== "Radial" || tl_layout !== "Segmented")) {
    hideAxis(timeline_container, duration, "segmented_radial_axis");
  }

  return { radial_axis_quantiles: radial_axis_quantiles };
}

function configureFacetedRadialAxes(tl_layout, tl_representation, tl_scale, radial_axis, radial_axis_quantiles, duration, timeline_scale_segments, timeline_facet, width, height, timeline_scale, prev_tl_scale, prev_tl_layout, prev_tl_representation, timeline_container) {
  if (tl_representation === "Radial" && tl_layout === "Faceted") {
    radial_axis.duration(duration);

    if (tl_scale === "Relative") {
      radial_axis_quantiles = [];
      radial_axis.radial_axis_units("Relative");
      if (globals.segment_granularity === "days") {
        radial_axis_quantiles.push(Math.round(d3.quantile(timeline_scale_segments, 0)) * 3600000);
        radial_axis_quantiles.push(Math.round(d3.quantile(timeline_scale_segments, 0.125)) * 3600000);
        radial_axis_quantiles.push(Math.round(d3.quantile(timeline_scale_segments, 0.25)) * 3600000);
        radial_axis_quantiles.push(Math.round(d3.quantile(timeline_scale_segments, 0.375)) * 3600000);
        radial_axis_quantiles.push(Math.round(d3.quantile(timeline_scale_segments, 0.5)) * 3600000);
        radial_axis_quantiles.push(Math.round(d3.quantile(timeline_scale_segments, 0.625)) * 3600000);
        radial_axis_quantiles.push(Math.round(d3.quantile(timeline_scale_segments, 0.75)) * 3600000);
        radial_axis_quantiles.push(Math.round(d3.quantile(timeline_scale_segments, 0.875)) * 3600000);
        radial_axis.final_quantile(Math.round(d3.quantile(timeline_scale_segments, 1)) * 3600000);
      } else {
        radial_axis_quantiles.push(Math.round(d3.quantile(timeline_scale_segments, 0)) * 86400000);
        radial_axis_quantiles.push(Math.round(d3.quantile(timeline_scale_segments, 0.2)) * 86400000);
        radial_axis_quantiles.push(Math.round(d3.quantile(timeline_scale_segments, 0.4)) * 86400000);
        radial_axis_quantiles.push(Math.round(d3.quantile(timeline_scale_segments, 0.6)) * 86400000);
        radial_axis_quantiles.push(Math.round(d3.quantile(timeline_scale_segments, 0.8)) * 86400000);
        radial_axis_quantiles.push(Math.round(d3.quantile(timeline_scale_segments, 1)) * 86400000);
        radial_axis.final_quantile(Math.round(d3.quantile(timeline_scale_segments, 1)) * 86400000);
      }
      radial_axis.track_bounds(globals.max_num_tracks + 1);
    } else {
      if (radial_axis_quantiles !== timeline_scale_segments) {
        radial_axis_quantiles = timeline_scale_segments;
      }
      radial_axis.final_quantile(timeline_scale_segments[timeline_scale_segments.length - 1]);

      if (tl_scale === "Chronological") {
        radial_axis.radial_axis_units("Chronological");
        if (globals.segment_granularity === "epochs") {
          radial_axis.track_bounds(1);
        } else {
          radial_axis.track_bounds(globals.max_num_tracks + 1);
        }
      } else if (tl_scale === "Sequential") {
        radial_axis.radial_axis_units("Sequential");
        radial_axis.track_bounds(1);
      }
    }

    // update the radial axis for faceted radial timelines
    var faceted_radial_axis = timeline_facet.selectAll(".faceted_radial_axis").data([radial_axis_quantiles]);

    faceted_radial_axis.enter().append("g").attr("class", "faceted_radial_axis").style("opacity", 0);

    var facet_number = 0;

    timeline_facet.selectAll(".faceted_radial_axis").transition("faceted_radial_axis_update").duration(duration).style("opacity", 1).attr("transform", function () {
      var offset_x, offset_y;

      if (tl_layout !== "Faceted") {
        offset_x = width / 2;
        offset_y = height / 2;
      } else if (tl_representation === "Linear") {
        offset_x = width / 2;
        offset_y = facet_number * (height / globals.num_facets);
        facet_number++;
      } else if (tl_representation === "Radial" || tl_representation === "Spiral" && tl_scale === "Sequential") {
        var facet_dim_x = width / globals.num_facet_cols;
        var facet_dim_y = height / globals.num_facet_rows;

        offset_x = facet_number % globals.num_facet_cols * facet_dim_x;
        offset_y = Math.floor(facet_number / globals.num_facet_cols - 1) * facet_dim_y + facet_dim_y + globals.buffer;

        facet_number++;
      } else {
        offset_x = width / 2;
        offset_y = height / 2;
      }
      return "translate(" + unNaN(offset_x) + "," + unNaN(offset_y) + ")";
    }).call(radial_axis.radial_axis_scale(timeline_scale).x_pos(width / globals.num_facet_cols / 2).y_pos(height / globals.num_facet_rows / 2));

    logEvent("Faceted Radial axis updated", "axis_update");
  } else if (prev_tl_representation === "Radial" && prev_tl_layout === "Faceted" && (tl_representation !== "Radial" || tl_layout !== "Faceted")) {
    hideAxis(timeline_container, duration, "faceted_radial_axis");
  }
  return { radial_axis_quantiles: radial_axis_quantiles };
}

function configureRadialAxes(tl_representation, tl_layout, tl_scale, timeline_container, timeline_scale, prev_tl_layout, prev_tl_representation, width, height, radial_axis_quantiles, timeline_scale_segments, radial_axis, duration, timeline_facet, timeline_segment, prev_tl_scale) {
  /**
  ---------------------------------------------------------------------------------------
  AXES
  Radial Axes
  ---------------------------------------------------------------------------------------
  Unified Radial Axis
  ---------------------------------------------------------------------------------------
  **/
  radial_axis_quantiles = configureUnifiedRadialAxis(tl_representation, tl_layout, tl_scale, timeline_container, timeline_scale, prev_tl_layout, prev_tl_representation, width, height, radial_axis_quantiles, timeline_scale_segments, radial_axis, duration).radial_axis_quantiles;

  /**
  ---------------------------------------------------------------------------------------
  Faceted Radial Axes
  ---------------------------------------------------------------------------------------
  **/
  radial_axis_quantiles = configureFacetedRadialAxes(tl_layout, tl_representation, tl_scale, radial_axis, radial_axis_quantiles, duration, timeline_scale_segments, timeline_facet, width, height, timeline_scale, prev_tl_scale, prev_tl_layout, prev_tl_representation, timeline_container).radial_axis_quantiles;

  /**
  ---------------------------------------------------------------------------------------
  Segmented Radial Axis
  ---------------------------------------------------------------------------------------
  **/
  return configureSegmentedRadialAxis(tl_representation, tl_layout, tl_scale, duration, radial_axis_quantiles, timeline_scale_segments, radial_axis, timeline_segment, width, height, timeline_scale, timeline_container, prev_tl_representation, prev_tl_layout).radial_axis_quantiles;
}

function configureUnifiedRadialAxis(tl_representation, tl_layout, tl_scale, timeline_container, timeline_scale, prev_tl_layout, prev_tl_representation, width, height, radial_axis_quantiles, timeline_scale_segments, radial_axis, duration) {
  if (tl_representation === "Radial" && tl_layout === "Unified") {
    if (radial_axis_quantiles !== timeline_scale_segments) {
      radial_axis_quantiles = timeline_scale_segments;
    }

    radial_axis.duration(duration);

    radial_axis.final_quantile(timeline_scale_segments[timeline_scale_segments.length - 1]);

    if (tl_scale === "Chronological") {
      radial_axis.radial_axis_units("Chronological");
      if (globals.segment_granularity === "epochs") {
        radial_axis.track_bounds(1);
      } else {
        radial_axis.track_bounds(globals.num_tracks + 1);
      }
    } else if (tl_scale === "Sequential") {
      radial_axis.radial_axis_units("Sequential");
      radial_axis.track_bounds(1);
    }

    // update the radial axis for radial timelines
    var radial_axis_container = timeline_container.selectAll(".radial_axis_container").data([radial_axis_quantiles]);

    radial_axis_container.enter().append("g").attr("class", "radial_axis_container").each(insertFacetAtAxis).style("opacity", 0);

    timeline_container.selectAll(".radial_axis_container").transition("radial_axis_container_enter").duration(duration).style("opacity", 1).call(radial_axis.radial_axis_scale(timeline_scale).x_pos(width / 2).y_pos(height / 2));

    logEvent("Unified Radial axis updated", "axis_update");
  } else if (prev_tl_representation === "Radial" && prev_tl_layout === "Unified" && (tl_representation !== "Radial" || tl_layout !== "Unified")) {
    hideAxis(timeline_container, duration, "radial_axis_container");
  }

  return { radial_axis_quantiles: radial_axis_quantiles };
}

function configureCollapsedAxis(tl_representation, prev_tl_scale, tl_scale, tl_layout, interim_duration_axis, interim_duration_scale, duration, data, timeline_container, width, height, unit_width) {
  var format = function format(d) {
    return globals.formatAbbreviation(d);
  };

  if (tl_representation === "Linear" && tl_scale === "Collapsed" && tl_layout === "Unified") {
    interim_duration_axis.ticks(2);
    interim_duration_axis.scale(interim_duration_scale);
    interim_duration_axis.tickValues(utils.ticks(interim_duration_scale, 2));

    interim_duration_axis.tickFormat(function (d) {
      var converted_tick = d;
      if (globals.date_granularity === "epochs") {
        return format(d.valueOf());
      } else if (time.year.count(data.min_start_date, data.max_end_date) > 5) {
        converted_tick = Math.round(d / 31536000730) + tr(" years");
      } else if (time.day.count(data.min_start_date, data.max_end_date) > 31) {
        converted_tick = Math.round(d / 2628000000) + tr(" months");
      } else {
        converted_tick = Math.round(d / 86400000) + tr(" days");
      }
      return converted_tick;
    });

    // update the Collapsed axis for linear-interim_duration timeline
    var interim_duration_axis_container = timeline_container.selectAll(".interim_duration_axis").data([null]);

    interim_duration_axis_container.enter().append("g").attr("class", "interim_duration_axis").attr("transform", "translate(" + globals.max_seq_index * 1.5 * unit_width + "," + (height - unit_width * 4) + ")").style("opacity", 0);

    timeline_container.selectAll(".interim_duration_axis").transition("interim_duration_axis_linear_unified").delay(0).duration(duration).attr("transform", "translate(" + globals.max_seq_index * 1.5 * unit_width + "," + (height - unit_width * 4) + ")").style("opacity", 1).call(interim_duration_axis);

    logEvent("Collapsed axis updated", "axis_update");
  } else if (prev_tl_scale === "Collapsed" && tl_scale !== "Collapsed") {
    // remove Collapsed axis for non-interim_duration-scale timelines
    timeline_container.selectAll(".interim_duration_axis").transition("interim_duration_axis_collapsed").duration(duration).style("opacity", 0);
  }
}

function configureLinearAxis(timeline_scale, tl_layout, tl_representation, prev_tl_representation, tl_scale, data, tick_format, unit_width, timeline_container, duration, width, height) {
  var timeline_axis = d3.axisTop().offset(0);
  if (tl_representation === "Linear") {
    timeline_axis.scale(timeline_scale);
    timeline_axis.ticks(10);
    timeline_axis.tickSizeInner(6).tickSizeOuter(0);
    timeline_axis.tickFormat(undefined);
    timeline_axis.tickValues(undefined);

    if (tl_layout !== "Segmented" && tl_scale === "Chronological" && globals.date_granularity === "years" && data.min_start_date.getUTCFullYear() < 0) {
      timeline_axis.tickFormat(tick_format);
      timeline_axis.tickValues(undefined);
    } else if (tl_scale === "Sequential" || tl_scale === "Collapsed") {
      timeline_axis.ticks(10);
      timeline_axis.tickSizeInner(6).tickSizeOuter(0);
      timeline_axis.tickValues(d3.range(0, globals.max_seq_index * 1.5 * unit_width - unit_width, unit_width * 10));
      timeline_axis.tickFormat(function (d) {
        return d / unit_width;
      });
    } else if (tl_scale === "Log") {
      timeline_axis.ticks(10, tick_format);
      timeline_axis.tickSizeInner(6).tickSizeOuter(0);
      timeline_axis.tickValues(undefined);
    } else if (tl_scale === "Relative" || globals.date_granularity === "epochs") {
      timeline_axis.tickFormat(tick_format);
      timeline_axis.tickValues(undefined);
    } else if (tl_layout === "Segmented") {
      if (globals.segment_granularity === "decades") {
        timeline_axis.tickValues(d3.range(0, 120, 12));
      } else {
        timeline_axis.tickValues(undefined);
      }
      timeline_axis.tickFormat(function (d) {
        var converted_tick = d;
        switch (globals.segment_granularity) {
          case "days":
            converted_tick = moment().hour(d).format("hA");
            break;
          case "weeks":
            converted_tick = moment().weekday(d).format("ddd");
            break;
          case "months":
            converted_tick = moment().date(d).format("Do");
            break;
          case "years":
            converted_tick = moment().week(d + 1).format("MMM");
            break;
          case "decades":
            converted_tick = d / 12 + tr(" years");
            break;
          case "centuries":
          case "millenia":
            converted_tick = d + tr(" years");
            break;
          case "epochs":
            converted_tick = globals.formatAbbreviation(d) + tr(" years");
            break;
          default:
            break;
        }
        return converted_tick;
      });
    } else {
      timeline_axis.tickValues(undefined);
      timeline_axis.tickFormat(function (d) {
        var converted_tick = d;
        switch (globals.segment_granularity) {
          case "days":
            converted_tick = moment(d).format("MMM D hA");
            break;
          case "weeks":
            converted_tick = moment(d).format("MMM D");
            break;
          case "months":
            converted_tick = moment(d).format("MMM D");
            break;
          case "years":
          case "decades":
          case "centuries":
          case "millenia":
            converted_tick = moment(d).format("YYYY");
            break;
          case "epochs":
            converted_tick = globals.formatAbbreviation(d);
            break;
          default:
            break;
        }
        return converted_tick;
      });
    }

    if (timeline_axis.tickValues() === null && tl_scale !== "Log") {
      timeline_axis.tickValues(utils.ticks(timeline_scale, 10));
    }

    // update the timeline axis for linear timelines
    var timeline_axis_container = timeline_container.selectAll(".timeline_axis").data([null]);

    timeline_axis_container.enter().append("g").attr("class", "timeline_axis").style("opacity", 0);

    timeline_axis_container.enter().append("g").attr("class", "timeline_axis").attr("id", "bottom_timeline_axis").style("opacity", 0);

    var timeline_axis_update = timeline_container.select(".timeline_axis").transition("timeline_axis_update").delay(0).duration(duration).style("opacity", 1).call(timeline_axis);

    timeline_axis_update.selectAll("text").attr("y", -12).style("fill", "#666").style("font-weight", "normal");

    timeline_axis_update.selectAll(".tick line").delay(function (d, i) {
      // eslint-disable-line no-shadow
      return i * duration / timeline_axis_update.selectAll(".tick line").size();
    }).attr("y1", -6).attr("y2", 0);

    var bottom_timeline_axis_update = timeline_container.select("#bottom_timeline_axis").transition("bottom_timeline_axis_update").delay(0).duration(duration).style("opacity", 1).call(timeline_axis);

    bottom_timeline_axis_update.selectAll("text").delay(function (d, i) {
      // eslint-disable-line no-shadow
      return i * duration / bottom_timeline_axis_update.selectAll(".tick line").size();
    }).attr("y", height + 18);

    bottom_timeline_axis_update.select(".domain").attr("transform", function () {
      return "translate(0," + height + ")";
    });

    bottom_timeline_axis_update.selectAll(".tick line").delay(function (d, i) {
      // eslint-disable-line no-shadow
      return i * duration / bottom_timeline_axis_update.selectAll(".tick line").size();
    }).attr("y1", 0).attr("y2", height + 6);

    logEvent("Linear axis updated", "axis_update");
  } else if (prev_tl_representation === "Linear" && tl_representation !== "Linear") {
    // remove axes for non-linear timelines
    var timeline_axis_hide = timeline_container.select(".timeline_axis").transition("timeline_axis_hide").duration(duration);

    var bottom_timeline_axis_hide = timeline_container.select("#bottom_timeline_axis").transition("bottom_timeline_axis_hide").duration(duration);

    timeline_axis_hide.selectAll(".tick line").attr("y1", -6).attr("y2", -6);

    bottom_timeline_axis_hide.select(".domain").attr("transform", function () {
      return "translate(0,0)";
    });

    bottom_timeline_axis_hide.selectAll("text").attr("y", -12);

    bottom_timeline_axis_hide.selectAll(".tick line").attr("y1", -6).attr("y2", -6);

    timeline_container.selectAll(".timeline_axis").transition("timeline_container_axis").duration(duration).style("opacity", 0);
  }
}

function insertFacetAtAxis() {
  var firstChild = selectWithParent(".timeline_axis").node();
  if (firstChild) {
    this.parentNode.insertBefore(this, firstChild);
  }
}

function getFacetTitleText(tl_layout, tl_representation, height, d) {
  if (d === undefined || tl_layout !== "Faceted") {
    return "";
  }

  if (tl_representation === "Linear") {
    return utils.fitText(d, height / globals.num_facets, 10, 14);
  }

  return d;
}

function earlyUpdate(transition, tl_layout, prev_tl_layout, tl_representation, prev_tl_representation, tl_scale, prev_tl_scale) {
  /**
  ---------------------------------------------------------------------------------------
  update rect elements for non-radial representations
  ---------------------------------------------------------------------------------------
  **/

  transition.select("rect.event_span").style("opacity", function (d) {
    return initialOpacity(d, tl_layout, prev_tl_layout, tl_representation, prev_tl_representation, tl_scale, prev_tl_scale, true);
  }).style("pointer-events", function () {
    return "none";
  }).style("fill", eventColorMapping);

  /**
  ---------------------------------------------------------------------------------------
  update bar (rect) elements for interim_duration scale
  ---------------------------------------------------------------------------------------
  **/

  // draw elapsed time as bar below the sequence, offset between events
  transition.select(".time_elapsed").attr("height", 0).style("opacity", 0);

  /**
  ---------------------------------------------------------------------------------------
  update path elements for radial representations
  ---------------------------------------------------------------------------------------
  **/

  transition.select("path.event_span").style("opacity", function (d) {
    return initialOpacity(d, tl_layout, prev_tl_layout, tl_representation, prev_tl_representation, tl_scale, prev_tl_scale, false);
  }).style("pointer-events", function () {
    return "none";
  }).style("fill", eventColorMapping);

  /**
  ---------------------------------------------------------------------------------------
  span updates: rect elements for non-radial timelines
  ---------------------------------------------------------------------------------------
  **/

  transition.selectAll("rect.event_span_component").style("opacity", function () {
    if (tl_layout !== "Segmented" || prev_tl_layout !== "Segmented" || tl_representation === "Radial" && prev_tl_representation === "Radial") {
      return 0;
    } else if (globals.prev_active_event_list.indexOf(d3.select(this.parentNode).datum().event_id) === -1 || globals.active_event_list.indexOf(d3.select(this.parentNode).datum().event_id) === -1) {
      if (globals.filter_type === "Hide") {
        return 0;
      } else if (globals.filter_type === "Emphasize") {
        if (globals.active_event_list.indexOf(d3.select(this.parentNode).datum().event_id) === -1) {
          return 0.1;
        }

        return 1;
      }
    } else if (globals.active_event_list.indexOf(d3.select(this.parentNode).datum().event_id) !== -1 && d3.select(this.parentNode).datum().selected) {
      return 1;
    } else if (globals.active_event_list.indexOf(d3.select(this.parentNode).datum().event_id) !== -1) {
      if (tl_scale !== prev_tl_scale || tl_layout !== prev_tl_layout || tl_representation !== prev_tl_representation) {
        return 0.5;
      }

      return 1;
    } else {
      return 0.1;
    }
  }).style("pointer-events", function () {
    return "none";
  }).style("fill", eventSpanColorMapping);

  /**
  ---------------------------------------------------------------------------------------
  span updates: path/arc elements for non-radial timelines
  ---------------------------------------------------------------------------------------
  **/

  transition.selectAll("path.event_span_component").style("opacity", function () {
    if (tl_layout !== "Segmented" || prev_tl_layout !== "Segmented" || tl_representation !== "Radial" && prev_tl_representation !== "Radial") {
      return 0;
    } else if (globals.prev_active_event_list.indexOf(d3.select(this.parentNode).datum().event_id) === -1 || globals.active_event_list.indexOf(d3.select(this.parentNode).datum().event_id) === -1) {
      if (globals.filter_type === "Hide") {
        return 0;
      } else if (globals.filter_type === "Emphasize") {
        if (globals.active_event_list.indexOf(d3.select(this.parentNode).datum().event_id) === -1) {
          return 0.1;
        }

        return 1;
      }
    } else if (globals.active_event_list.indexOf(d3.select(this.parentNode).datum().event_id) !== -1 && d3.select(this.parentNode).datum().selected) {
      return 1;
    } else if (globals.active_event_list.indexOf(d3.select(this.parentNode).datum().event_id) !== -1) {
      if (tl_scale !== prev_tl_scale || tl_layout !== prev_tl_layout || tl_representation !== prev_tl_representation) {
        return 0.5;
      }

      return 1;
    } else {
      return 0.1;
    }
  }).style("pointer-events", function () {
    if (prev_tl_layout !== "Segmented" || tl_representation !== "Radial" && prev_tl_representation !== "Radial") {
      return "none";
    } else if (globals.prev_active_event_list.indexOf(d3.select(this.parentNode).datum().event_id) !== -1 && globals.active_event_list.indexOf(d3.select(this.parentNode).datum().event_id) !== -1) {
      return "inherit";
    }

    return "none";
  }).style("fill", eventSpanColorMapping);

  transition.select(".path_end_indicator").style("opacity", 0).style("pointer-events", "none");
}

/* eslint-disable */
/**
 * Positions all the elements
 */
/* eslint-enable */
function update(tl_layout, tl_scale, tl_representation, width, height, data, unit_width, prev_tl_layout, prev_tl_representation, prev_tl_scale, timeline_scale, selection) {
  selection.attr("id", function (d) {
    return "event_g" + d.event_id;
  });

  selection.select("rect.event_span").attr("transform", function (d) {
    var offset_y = 0,
        offset_x = 0;
    if (tl_representation === "Linear") {
      switch (tl_layout) {

        case "Unified":
          offset_y = 0;
          break;

        case "Faceted":
          offset_y = height / globals.num_facets * globals.facets.domain().indexOf(d.facet);
          break;

        case "Segmented":
          var span_segment = calculateSpanSegment(data.min_start_date, d.start_date);
          offset_y = height / globals.num_segments * span_segment;
          break;

        default:
          offset_y = 0;
          break;
      }
    } else if (tl_representation === "Spiral" || tl_representation === "Radial") {
      var facet_dim_x = width / globals.num_facet_cols;
      var facet_dim_y = height / globals.num_facet_rows;
      if (tl_layout === "Unified") {
        offset_x = width / 2;
        offset_y = height / 2;
      } else if (tl_layout === "Faceted") {
        offset_x = globals.facets.domain().indexOf(d.facet) % globals.num_facet_cols * facet_dim_x + facet_dim_x / 2;
        if (tl_representation === "Radial") {
          offset_y = Math.floor(globals.facets.domain().indexOf(d.facet) / globals.num_facet_cols - 1) * facet_dim_y + facet_dim_y + facet_dim_y / 2 + globals.buffer;
        } else if (tl_representation === "Spiral") {
          offset_y = Math.floor(globals.facets.domain().indexOf(d.facet) / globals.num_facet_cols) * globals.spiral_dim + globals.spiral_dim / 2;
        }
      }
    } else if (tl_representation === "Curve") {
      offset_x = d.curve_x;
      offset_y = d.curve_y;
    } else {
      offset_x = 0;
      offset_y = 0;
    }
    d.rect_offset_x = offset_x;
    d.rect_offset_y = offset_y;
    return "translate(" + unNaN(offset_x) + "," + unNaN(offset_y) + ")";
  });

  // update rects for linear timelines
  selection.select("rect.event_span").attr("height", function () {
    return unit_width;
  }).attr("width", function (d) {
    if (tl_layout !== "Segmented" && tl_representation === "Linear") {
      if (tl_scale === "Chronological" && d.start_date !== d.end_date) {
        return d3.max([timeline_scale(d.end_date) - timeline_scale(d.start_date), unit_width]);
      } else if (tl_scale === "Relative" && d.start_age !== d.end_age) {
        return d3.max([timeline_scale(d.end_age) - timeline_scale(d.start_age), unit_width]);
      }
    }
    return unit_width;
  }).attr("x", function (d) {
    var rect_x = 0;
    if (tl_representation === "Linear") {
      if (tl_layout === "Segmented") {
        switch (globals.segment_granularity) {
          case "days":
            rect_x = timeline_scale(moment(time.utcHour.floor(d.start_date)).hour());
            break;
          case "weeks":
            rect_x = timeline_scale(moment(time.day.floor(d.start_date)).day());
            break;
          case "months":
            rect_x = timeline_scale(moment(time.day.floor(d.start_date)).date());
            break;
          case "years":
            if (moment(time.utcWeek.floor(d.start_date)).week() === 53) {
              rect_x = timeline_scale(1);
            } else {
              rect_x = timeline_scale(moment(time.utcWeek.floor(d.start_date)).week());
            }
            break;
          case "decades":
            rect_x = timeline_scale(moment(time.month.floor(d.start_date)).month() + (time.month.floor(d.start_date).getUTCFullYear() - Math.floor(time.month.floor(d.start_date).getUTCFullYear() / 10) * 10) * 12);
            break;
          case "centuries":
            if (d.start_date.getUTCFullYear() < 0) {
              rect_x = timeline_scale(d.start_date.getUTCFullYear() % 100 + 100);
            } else {
              rect_x = timeline_scale(d.start_date.getUTCFullYear() % 100);
            }
            break;
          case "millenia":
            if (d.start_date.getUTCFullYear() < 0) {
              rect_x = timeline_scale(d.start_date.getUTCFullYear() % 1000 + 1000);
            } else {
              rect_x = timeline_scale(d.start_date.getUTCFullYear() % 1000);
            }
            break;
          case "epochs":
            rect_x = timeline_scale(d.start_date);
            break;
          default:
            break;
        }
      } else {
        switch (tl_scale) {

          case "Chronological":
            rect_x = timeline_scale(d.start_date);
            break;

          case "Relative":
            rect_x = d3.max([0, timeline_scale(d.start_age)]);
            break;

          case "Log":
            switch (globals.segment_granularity) {
              case "days":
                rect_x = timeline_scale(time.hour.count(d.start_date, data.max_end_date) * -1 - 1);
                break;
              case "weeks":
                rect_x = timeline_scale(time.day.count(d.start_date, data.max_end_date) * -1 - 1);
                break;
              case "months":
                rect_x = timeline_scale(time.week.count(d.start_date, data.max_end_date) * -1 - 1);
                break;
              case "years":
                rect_x = timeline_scale(time.month.count(d.start_date, data.max_end_date) * -1 - 1);
                break;
              case "decades":
                rect_x = timeline_scale(Math.abs(data.max_end_date.getUTCFullYear() - d.start_date.getUTCFullYear()) * -1 - 1);
                break;
              case "centuries":
                rect_x = timeline_scale(Math.abs(data.max_end_date.getUTCFullYear() - d.start_date.getUTCFullYear()) * -1 - 1);
                break;
              case "millenia":
                rect_x = timeline_scale(Math.abs(data.max_end_date.getUTCFullYear() - d.start_date.getUTCFullYear()) * -1 - 1);
                break;
              default:
                rect_x = timeline_scale(Math.abs(data.max_end_date.valueOf() - d.start_date.valueOf()) * -1 - 1);
                break;
            }
            break;

          case "Collapsed":
            rect_x = timeline_scale(d.seq_index) * unit_width + 0.5 * unit_width;
            break;

          case "Sequential":
            rect_x = timeline_scale(d.seq_index) * unit_width + 0.5 * unit_width;
            break;
          default:
            break;
        }
      }
    } else if (tl_representation === "Radial") {
      switch (tl_scale) {

        case "Chronological":
          rect_x = (globals.centre_radius + d.track * globals.track_height + 0.5 * unit_width) * Math.sin(timeline_scale(d.start_date));
          break;

        case "Relative":
          rect_x = (globals.centre_radius + d.track * globals.track_height + 0.5 * unit_width) * Math.sin(timeline_scale(d.start_age));
          break;

        case "Sequential":
          rect_x = (globals.centre_radius + d.seq_track * globals.track_height + 0.5 * unit_width) * Math.sin(timeline_scale(d.seq_index));
          break;

        default:
          rect_x = 0;
          break;
      }
    } else if (tl_representation === "Spiral" && tl_scale === "Sequential") {
      rect_x = d.spiral_x;
    } else {
      rect_x = 0;
    }
    d.rect_x_pos = rect_x;
    return rect_x;
  }).attr("y", function (d) {
    var rect_y = 0;
    if (tl_representation === "Linear") {
      switch (tl_layout) {

        case "Unified":
          switch (tl_scale) {

            case "Chronological":
              rect_y = height - (globals.track_height * d.track + globals.track_height);
              break;

            case "Log":
              rect_y = height - (globals.track_height * d.track + globals.track_height);
              break;

            case "Collapsed":
              rect_y = height - (d.seq_track * globals.track_height + globals.track_height + 4 * unit_width);
              break;

            case "Sequential":
              rect_y = height - (d.seq_track * globals.track_height + globals.track_height);
              break;

            default:
              rect_y = 0;
              break;
          }
          break;

        case "Faceted":
          switch (tl_scale) {

            case "Chronological":
              rect_y = height / globals.num_facets - (globals.track_height * d.track + globals.track_height);
              break;

            case "Relative":
              rect_y = height / globals.num_facets - (globals.track_height * d.track + globals.track_height);
              break;

            case "Log":
              rect_y = height / globals.num_facets - (globals.track_height * d.track + globals.track_height);
              break;

            case "Sequential":
              rect_y = height / globals.num_facets - (globals.track_height * d.seq_track + globals.track_height);
              break;

            default:
              rect_y = 0;
              break;
          }
          break;

        case "Segmented":
          rect_y = height / globals.num_segments - (globals.track_height * d.track + globals.track_height);
          break;
        default:
          break;
      }
    } else if (tl_representation === "Radial") {
      switch (tl_scale) {

        case "Chronological":
          rect_y = -1 * (globals.centre_radius + d.track * globals.track_height + 0.5 * unit_width) * Math.cos(timeline_scale(d.start_date));
          break;

        case "Relative":
          rect_y = -1 * (globals.centre_radius + d.track * globals.track_height + 0.5 * unit_width) * Math.cos(timeline_scale(d.start_age));
          break;

        case "Sequential":
          rect_y = -1 * (globals.centre_radius + d.seq_track * globals.track_height + 0.5 * unit_width) * Math.cos(timeline_scale(d.seq_index));
          break;

        default:
          rect_y = 0;
          break;
      }
    } else if (tl_representation === "Spiral" && tl_scale === "Sequential") {
      rect_y = d.spiral_y + globals.buffer;
    } else {
      rect_y = 0;
    }
    d.rect_y_pos = rect_y;
    return rect_y;
  });

  selection.select(".time_elapsed").attr("x", function (d) {
    if (tl_scale === "Chronological") {
      return d3.max([0, timeline_scale(d.start_date) * unit_width - unit_width]);
    }
    if (tl_scale === "Log") {
      return 0;
    } else if (tl_scale === "Relative") {
      return 0;
    }

    return timeline_scale(d.seq_index) * unit_width - 0.5 * unit_width;
  }).attr("y", function (d) {
    if (globals.date_granularity === "epochs" && d.time_elapsed === 0) {
      return height;
    }

    return height - unit_width * 4;
  }).text(function (d) {
    return d.time_elapsed_label;
  });
  selection.select("path.event_span").attr("transform", function (d) {
    var offset_y = 0;
    var offset_x = 0;
    switch (tl_layout) {

      case "Unified":
        offset_x = width / 2;
        offset_y = height / 2;
        break;

      case "Faceted":
        var facet_dim_x = width / globals.num_facet_cols;
        var facet_dim_y = height / globals.num_facet_rows;
        offset_x = globals.facets.domain().indexOf(d.facet) % globals.num_facet_cols * facet_dim_x + facet_dim_x / 2;
        offset_y = Math.floor(globals.facets.domain().indexOf(d.facet) / globals.num_facet_cols - 1) * facet_dim_y + facet_dim_y + facet_dim_y / 2 + globals.buffer;
        break;

      case "Segmented":
        var span_segment = calculateSpanSegment(data.min_start_date, d.start_date);
        var segment_dim_x = width / globals.num_segment_cols;
        var segment_dim_y = height / globals.num_segment_rows;
        offset_x = span_segment % globals.num_segment_cols * segment_dim_x + segment_dim_x / 2;
        offset_y = Math.floor(span_segment / globals.num_segment_cols) * segment_dim_y + segment_dim_y / 2 + globals.buffer;
        break;
      default:
        break;
    }
    d.path_offset_x = offset_x;
    d.path_offset_y = offset_y;

    if (tl_representation === "Radial") {
      switch (tl_scale) {

        case "Chronological":
          d.path_x_pos = (globals.centre_radius + d.track * globals.track_height + 0.25 * globals.track_height) * Math.sin(timeline_scale(d.start_date));
          d.path_y_pos = -1 * (globals.centre_radius + d.track * globals.track_height + 0.25 * globals.track_height) * Math.cos(timeline_scale(d.start_date));
          break;

        case "Relative":
          d.path_x_pos = (globals.centre_radius + d.track * globals.track_height + 0.25 * globals.track_height) * Math.sin(timeline_scale(d.start_age));
          d.path_y_pos = -1 * (globals.centre_radius + d.track * globals.track_height + 0.25 * globals.track_height) * Math.cos(timeline_scale(d.start_age));
          break;

        case "Sequential":
          d.path_x_pos = (globals.centre_radius + d.seq_track * globals.track_height + 0.25 * globals.track_height) * Math.sin(timeline_scale(d.seq_index));
          d.path_y_pos = -1 * (globals.centre_radius + d.seq_track * globals.track_height + 0.25 * globals.track_height) * Math.cos(timeline_scale(d.seq_index));
          break;
        default:
          break;
      }
    }

    return "translate(" + unNaN(offset_x) + "," + unNaN(offset_y) + ")";
  });

  if (tl_representation !== "Radial") {
    selection.selectAll("path.event_span").style("display", "none");
  }

  selection.selectAll("rect.event_span_component").attr("transform", function (dataItem) {
    var dateTime = dataItem.dateTime;
    var offset_y = 0,
        offset_x = 0;

    if (tl_layout === "Faceted") {
      offset_y = height / globals.num_facets * globals.facets.domain().indexOf(d3.select(this.parentNode).datum().facet);
    } else if (tl_layout === "Segmented") {
      if (tl_representation === "Linear" && tl_scale === "Chronological") {
        switch (globals.segment_granularity) {
          case "days":
            offset_y = d3.max([0, (time.day.count(time.utcDay.floor(data.min_start_date), dateTime) - 1) * (height / globals.num_segments)]);
            break;
          case "weeks":
            offset_y = d3.max([0, (time.week.count(time.utcWeek.floor(data.min_start_date), dateTime) - 1) * (height / globals.num_segments)]);
            break;
          case "months":
            offset_y = d3.max([0, (time.month.count(time.utcMonth.floor(data.min_start_date), dateTime) - 1) * (height / globals.num_segments)]);
            break;
          case "years":
            offset_y = d3.max([0, (dateTime.getUTCFullYear() - data.min_start_date.getUTCFullYear()) * (height / globals.num_segments)]);
            break;
          case "decades":
            offset_y = d3.max([0, (Math.floor(dateTime.getUTCFullYear() / 10) - Math.floor(data.min_start_date.getUTCFullYear() / 10)) * (height / globals.num_segments)]);
            break;
          case "centuries":
            offset_y = d3.max([0, (Math.floor(dateTime / 100) - Math.floor(data.min_start_date.getUTCFullYear() / 100)) * (height / globals.num_segments)]);
            break;
          case "millenia":
            offset_y = d3.max([0, (Math.floor(dateTime / 1000) - Math.floor(data.min_start_date.getUTCFullYear() / 1000)) * (height / globals.num_segments)]);
            break;
          case "epochs":
            offset_y = 0;
            break;
          default:
            break;
        }
      } else if (tl_representation === "Radial" && tl_scale === "Chronological") {
        var span_segment = calculateSpanSegment(data.min_start_date, dateTime);
        var segment_dim_x = width / globals.num_segment_cols;
        var segment_dim_y = height / globals.num_segment_rows;
        offset_x = span_segment % globals.num_segment_cols * segment_dim_x + segment_dim_x / 2;
        offset_y = Math.floor(span_segment / globals.num_segment_cols) * segment_dim_y + segment_dim_y / 2 + globals.track_height;
      }
    }
    return "translate(" + unNaN(offset_x) + "," + unNaN(offset_y) + ")";
  });

  function getTimelineScaleValue(dateTime, checkNegative) {
    var value = 0;
    switch (globals.segment_granularity) {
      case "days":
        value = d3.max([0, timeline_scale(moment(dateTime).hour())]);
        break;
      case "weeks":
        value = d3.max([0, timeline_scale(moment(dateTime).day())]);
        break;
      case "months":
        value = d3.max([0, timeline_scale(moment(dateTime).date())]);
        break;
      case "years":
        if (moment(dateTime).week() === 53) {
          value = d3.max([0, timeline_scale(1)]);
        } else {
          value = d3.max([0, timeline_scale(moment(dateTime).week())]);
        }
        break;
      case "decades":
        value = d3.max([0, timeline_scale(moment(dateTime).month() + (dateTime.getUTCFullYear() - Math.floor(dateTime.getUTCFullYear() / 10) * 10) * 12)]);
        break;
      case "centuries":
        if (checkNegative && dateTime < 0) {
          value = d3.max([0, timeline_scale(dateTime % 100 + 100)]);
        } else {
          value = d3.max([0, timeline_scale(dateTime % 100)]);
        }
        break;
      case "millenia":
        if (checkNegative && dateTime < 0) {
          value = d3.max([0, timeline_scale(dateTime % 1000 + 1000)]);
        } else {
          value = d3.max([0, timeline_scale(dateTime % 1000)]);
        }
        break;
      case "epochs":
        value = d3.max([0, timeline_scale(dateTime)]);
        break;
      default:
        break;
    }
    return value;
  }

  selection.selectAll("rect.event_span_component").attr("height", function () {
    var span_height = unit_width;
    if (tl_layout === "Segmented" && tl_representation === "Calendar" && tl_scale === "Chronological") {
      span_height = 20;
    } else if (tl_layout === "Segmented" && tl_representation === "Grid" && tl_scale === "Chronological") {
      span_height = 37.5;
    }
    return span_height;
  }).attr("width", function () {
    var span_width = unit_width;
    if (tl_layout === "Segmented" && tl_representation === "Linear" && tl_scale === "Chronological") {
      span_width = globals.segment_granularity !== "epochs" ? d3.max([0, width / getNumberOfSegmentsForGranularity(globals.segment_granularity)]) : d3.max([0, unit_width]);
    } else if (tl_layout === "Segmented" && tl_representation === "Radial" && tl_scale === "Chronological" && prev_tl_representation !== "Radial") {
      span_width = unit_width;
    } else if (tl_layout === "Segmented" && tl_representation === "Grid" && tl_scale === "Chronological") {
      span_width = 50;
    } else if (tl_layout === "Segmented" && tl_representation === "Calendar" && tl_scale === "Chronological") {
      span_width = 10;
    }
    return span_width;
  }).attr("y", function (dataItem) {
    var dateTime = dataItem.dateTime;
    var y_pos = 0;
    if (tl_layout === "Unified") {
      if (tl_representation === "Linear" && tl_scale === "Chronological") {
        y_pos = d3.max([0, height - (globals.track_height * d3.select(this.parentNode).datum().track + globals.track_height)]);
      }
    } else if (tl_layout === "Faceted") {
      if (tl_representation === "Linear" && tl_scale === "Chronological") {
        y_pos = d3.max([0, height / globals.num_facets - (globals.track_height * d3.select(this.parentNode).datum().track + globals.track_height)]);
      }
    } else if (tl_layout === "Segmented") {
      if (tl_representation === "Linear" && tl_scale === "Chronological") {
        y_pos = d3.max([0, height / globals.num_segments - (globals.track_height * d3.select(this.parentNode).datum().track + globals.track_height)]);
      } else if (tl_representation === "Radial" && tl_scale === "Chronological") {
        var y_cos = getTimelineScaleValue(dateTime, false);
        y_pos = -1 * (globals.centre_radius + d3.select(this.parentNode).datum().track * globals.track_height + globals.track_height) * Math.cos(y_cos);
      } else if (tl_layout === "Segmented" && tl_representation === "Grid" && tl_scale === "Chronological") {
        if (["decades", "centuries", "millenia"].indexOf(globals.segment_granularity) !== -1) {
          var grid_year;

          if (globals.isNumber(dateTime)) {
            grid_year = dateTime;
          } else {
            grid_year = dateTime.getUTCFullYear();
          }

          y_pos = getYGridPosition(grid_year, Math.floor(data.min_start_date.getUTCFullYear() / 100) * 100, unit_width);
        } else if (globals.segment_granularity === "epochs") {
          y_pos = 0;
        } else {
          y_pos = 0;
        }
      } else if (tl_layout === "Segmented" && tl_representation === "Calendar" && tl_scale === "Chronological") {
        var cell_size = 20,
            year_height = cell_size * 8;
        var range_floor = data.min_start_date.getUTCFullYear();
        if (globals.segment_granularity === "centuries" || globals.segment_granularity === "millenia" || globals.segment_granularity === "epochs") {
          y_pos = 0;
        } else {
          var year_offset = year_height * (dateTime.getUTCFullYear() - range_floor);
          y_pos = d3.max([0, dateTime.getDay() * cell_size + year_offset]);
        }
      }
    }
    return y_pos;
  }).attr("x", function (dataItem) {
    var dateTime = dataItem.dateTime;
    var x_pos = 0;
    if (tl_layout === "Unified" || tl_layout === "Faceted") {
      if (tl_representation === "Linear" && tl_scale === "Chronological") {
        x_pos = d3.max([0, timeline_scale(d3.select(this.parentNode).datum().start_date)]);
      }
    } else if (tl_layout === "Segmented") {
      if (tl_representation === "Linear" && tl_scale === "Chronological") {
        x_pos = getTimelineScaleValue(dateTime, true);
      } else if (tl_representation === "Radial" && tl_scale === "Chronological") {
        var x_sin = getTimelineScaleValue(dateTime, false);
        x_pos = (globals.centre_radius + d3.select(this.parentNode).datum().track * globals.track_height + globals.track_height) * Math.sin(x_sin);
      } else if (tl_layout === "Segmented" && tl_representation === "Grid" && tl_scale === "Chronological") {
        var grid_year;

        if (globals.isNumber(dateTime)) {
          grid_year = dateTime;
        } else {
          grid_year = dateTime.getUTCFullYear();
        }

        if (["decades", "centuries", "millenia"].indexOf(globals.segment_granularity) !== -1) {
          x_pos = d3.max([0, getXGridPosition(grid_year)]);
        } else if (globals.segment_granularity === "epochs") {
          x_pos = 0;
        } else {
          x_pos = d3.max([0, getXGridPosition(grid_year)]);
        }
      } else if (tl_layout === "Segmented" && tl_representation === "Calendar" && tl_scale === "Chronological") {
        if (globals.segment_granularity === "centuries" || globals.segment_granularity === "millenia" || globals.segment_granularity === "epochs") {
          x_pos = 0;
        } else {
          x_pos = d3.max([0, utils.weekOfYear(dateTime) * 20]);
        }
      }
    }
    return x_pos;
  });

  selection.selectAll("path.event_span_component").attr("transform", function (dataItem) {
    var dateTime = dataItem.dateTime;
    var offset_x = 0,
        offset_y = 0,
        span_segment = 0;
    if (tl_layout === "Segmented" && tl_scale === "Chronological") {
      span_segment = calculateSpanSegment(data.min_start_date, dateTime);
      var segment_dim_x = width / globals.num_segment_cols;
      var segment_dim_y = height / globals.num_segment_rows;
      offset_x = span_segment % globals.num_segment_cols * segment_dim_x + segment_dim_x / 2;
      offset_y = Math.floor(span_segment / globals.num_segment_cols - 1) * segment_dim_y + segment_dim_y + segment_dim_y / 2 + globals.buffer;
    } else if (tl_layout === "Unified") {
      offset_x = width / 2;
      offset_y = height / 2;
    } else if (tl_layout === "Faceted") {
      var facet_dim_x = width / globals.num_facet_cols;
      var facet_dim_y = height / globals.num_facet_rows;
      offset_x = globals.facets.domain().indexOf(d3.select(this.parentNode).datum().facet) % globals.num_facet_cols * facet_dim_x + facet_dim_x / 2;
      offset_y = Math.floor(globals.facets.domain().indexOf(d3.select(this.parentNode).datum().facet) / globals.num_facet_cols - 1) * facet_dim_y + facet_dim_y + facet_dim_y / 2 + globals.buffer;
    }
    return "translate(" + unNaN(offset_x) + "," + unNaN(offset_y) + ")";
  });

  if (tl_representation !== "Radial") {
    selection.selectAll("path.event_span_component").style("display", "none");
  }

  // update terminal span indicators
  selection.select(".path_end_indicator").attr("transform", function (d) {
    var x_pos = 0,
        y_pos = 0,
        span_segment = 0,
        rotation = 0,
        rect_x = 0; // eslint-disable-line no-unused-vars

    if (tl_layout === "Segmented") {
      if (tl_representation === "Linear") {
        rotation = 90;
        switch (globals.segment_granularity) {
          case "days":
            x_pos = d3.max([0, timeline_scale(moment(d.start_date).hour())]);
            y_pos = d3.max([0, time.day.count(time.utcDay.floor(data.min_start_date), d.start_date) - 1]);
            break;
          case "weeks":
            x_pos = d3.max([0, timeline_scale(moment(d.start_date).day())]);
            y_pos = d3.max([0, time.week.count(time.utcWeek.floor(data.min_start_date), d.start_date) - 1]);
            break;
          case "months":
            x_pos = d3.max([0, timeline_scale(moment(d.start_date).date())]);
            y_pos = d3.max([0, time.month.count(time.utcMonth.floor(data.min_start_date), d.start_date) - 1]);
            break;
          case "years":
            if (moment(d.start_date).week() === 53) {
              x_pos = d3.max([0, timeline_scale(1)]);
            } else {
              d3.max([0, x_pos = timeline_scale(moment(d.start_date).week() - 1)]);
            }
            y_pos = d3.max([0, d.start_date.getUTCFullYear() - data.min_start_date.getUTCFullYear()]);
            break;
          case "decades":
            if (moment(d.start_date).month() === 11 && moment(d.start_date).date() === 31) {
              x_pos = d3.max([0, timeline_scale(-1 + (d.start_date.getUTCFullYear() - Math.floor(d.start_date.getUTCFullYear() / 10) * 10) * 12)]);
            } else {
              x_pos = d3.max([0, timeline_scale(moment(d.start_date).month() + (d.start_date.getUTCFullYear() - Math.floor(d.start_date.getUTCFullYear() / 10) * 10) * 12)]);
            }
            y_pos = d3.max([0, Math.floor(d.start_date.getUTCFullYear() / 10) - Math.floor(data.min_start_date.getUTCFullYear() / 10)]);
            break;
          case "centuries":
            if (d.start_date.getUTCFullYear() < 0) {
              x_pos = d3.max([0, timeline_scale(d.start_date.getUTCFullYear() % 100 + 100)]);
            } else {
              x_pos = d3.max([0, timeline_scale(d.start_date.getUTCFullYear() % 100)]);
            }
            y_pos = d3.max([0, Math.floor(d.start_date.getUTCFullYear() / 100) - Math.floor(data.min_start_date.getUTCFullYear() / 100)]);
            break;
          case "millenia":
            if (d.start_date.getUTCFullYear() < 0) {
              x_pos = d3.max([0, timeline_scale(d.start_date.getUTCFullYear() % 1000 + 1000)]);
            } else {
              x_pos = d3.max([0, timeline_scale(d.start_date.getUTCFullYear() % 1000)]);
            }
            y_pos = d3.max([0, Math.floor(d.start_date.getUTCFullYear() / 1000) - Math.floor(data.min_start_date.getUTCFullYear() / 1000)]);
            break;
          case "epochs":
            x_pos = d3.max([0, timeline_scale(d.start_date)]);
            y_pos = 0;
            break;
          default:
            break;
        }
        x_pos = x_pos + unit_width * 0.33;
        y_pos = (y_pos + 1) * (height / globals.num_segments) - (globals.track_height * d.track + globals.track_height) + unit_width * 0.5;
      } else if (tl_representation === "Radial") {
        var pos;
        span_segment = calculateSpanSegment(data.min_start_date, d.start_date);
        switch (globals.segment_granularity) {
          case "days":
            pos = timeline_scale(moment(d.start_date).hour() + 0.5);
            break;
          case "weeks":
            pos = timeline_scale(moment(d.start_date).day() + 0.5);
            break;
          case "months":
            pos = timeline_scale(moment(d.start_date).date() + 0.5);
            break;
          case "years":
            if (moment(d.start_date).isoWeek() === 53) {
              pos = timeline_scale(1);
            } else {
              pos = timeline_scale(moment(d.start_date).isoWeek() - 1);
            }
            break;
          case "decades":
            if (moment(d.start_date).month() === 11 && moment(d.start_date).date() === 31) {
              pos = timeline_scale(-1 + (d.start_date.getUTCFullYear() - Math.floor(d.start_date.getUTCFullYear() / 10) * 10) * 12 + 0.5);
            } else {
              pos = timeline_scale(moment(d.start_date).month() + (d.start_date.getUTCFullYear() - Math.floor(d.start_date.getUTCFullYear() / 10) * 10) * 12 + 0.5);
            }
            break;
          case "centuries":
            if (d.start_date.getUTCFullYear() < 0) {
              pos = timeline_scale(d.start_date.getUTCFullYear() % 100 + 100 + 0.5);
            } else {
              pos = timeline_scale(d.start_date.getUTCFullYear() % 100 + 0.5);
            }
            break;
          case "millenia":
            if (d.start_date.getUTCFullYear() < 0) {
              pos = timeline_scale(d.start_date.getUTCFullYear() % 1000 + 1000 + 0.5);
            } else {
              pos = timeline_scale(d.start_date.getUTCFullYear() % 1000 + 0.5);
            }
            break;
          case "epochs":
            pos = timeline_scale(d.start_date.valueOf() + 0.5);
            break;
          default:
            break;
        }
        var segment_dim_x = width / globals.num_segment_cols;
        var segment_dim_y = height / globals.num_segment_rows;
        var segment_x = span_segment % globals.num_segment_cols * segment_dim_x + segment_dim_x / 2;
        var segment_y = Math.floor(span_segment / globals.num_segment_cols - 1) * segment_dim_y + segment_dim_y + segment_dim_y / 2 + globals.buffer;
        var x_offset = (globals.centre_radius + d.track * globals.track_height + 0.25 * globals.track_height) * Math.sin(pos);
        var y_offset = -1 * ((globals.centre_radius + d.track * globals.track_height + 0.25 * globals.track_height) * Math.cos(pos));
        x_pos = segment_x + x_offset;
        y_pos = segment_y + y_offset;
        rotation = pos * 360 / (Math.PI * 2) + 90;
      } else if (tl_representation === "Grid" && tl_scale === "Chronological" && globals.date_granularity !== "epochs") {
        rotation = 90;
        x_pos = d3.max([0, getXGridPosition(d.start_date.getUTCFullYear()) + unit_width * 0.33]);
        y_pos = getYGridPosition(d.start_date.getUTCFullYear(), data.min_start_date.getUTCFullYear(), unit_width) + unit_width * 0.5;
      } else if (tl_representation === "Calendar" && tl_scale === "Chronological") {
        var cell_size = 20,
            year_height = cell_size * 8;
        var range_floor = data.min_start_date.getUTCFullYear();
        var year_offset = year_height * (d.start_date.getUTCFullYear() - range_floor);
        rotation = 180;
        x_pos = d3.max([0, utils.weekOfYear(d.start_date) * 20 + 0.33 * unit_width]);
        y_pos = d3.max([0, d.start_date.getDay() * cell_size + year_offset + unit_width * 0.33]);
      }
    } else if (tl_layout === "Unified" && tl_scale === "Chronological") {
      if (tl_representation === "Linear") {
        rotation = 90;
        x_pos = d3.max([0, rect_x = timeline_scale(d.start_date) + unit_width * 0.33]);
        y_pos = d3.max([0, height - (globals.track_height * d.track + unit_width)]);
      } else if (tl_representation === "Radial") {
        rotation = timeline_scale(d.start_date) * 360 / (Math.PI * 2) + 90;
        x_pos = (globals.centre_radius + d.track * globals.track_height) * Math.sin(timeline_scale(d.start_date));
        y_pos = -1 * (globals.centre_radius + d.track * globals.track_height) * Math.cos(timeline_scale(d.start_date));
      }
    } else if (tl_layout === "Faceted" && tl_scale === "Chronological") {
      if (tl_representation === "Linear") {
        var facet_offset = height / globals.num_facets * globals.facets.domain().indexOf(d.facet);
        rotation = 90;
        x_pos = d3.max([0, rect_x = timeline_scale(d.start_date) + unit_width * 0.33]);
        y_pos = d3.max([0, height / globals.num_facets - (globals.track_height * d.track + unit_width) + facet_offset]);
      } else if (tl_representation === "Radial") {
        var facet_dim_x = width / globals.num_facet_cols;
        var facet_dim_y = height / globals.num_facet_rows;
        var x_facet_offset = globals.facets.domain().indexOf(d.facet) % globals.num_facet_cols * facet_dim_x + facet_dim_x / 2;
        var y_facet_offset = Math.floor(globals.facets.domain().indexOf(d.facet) / globals.num_facet_cols - 1) * facet_dim_y + facet_dim_y + facet_dim_y / 2;
        rotation = timeline_scale(d.start_date) * 360 / (Math.PI * 2) + 90;
        x_pos = (globals.centre_radius + d.track * globals.track_height) * Math.sin(timeline_scale(d.start_date)) + x_facet_offset;
        y_pos = -1 * (globals.centre_radius + d.track * globals.track_height) * Math.cos(timeline_scale(d.start_date)) + y_facet_offset;
      }
    }
    return "translate(" + unNaN(x_pos) + "," + unNaN(y_pos) + ")rotate(" + unNaN(rotation) + ")";
  });
}

function delayedUpdate(tl_layout, tl_representation, tl_scale, interim_duration_scale, unit_width, timeline_scale, transition) {
  transition.select("rect.event_span").style("opacity", function (d) {
    if (tl_layout !== "Segmented" && tl_representation !== "Radial" && globals.active_event_list.indexOf(d.event_id) !== -1) {
      return 1;
    }

    if (tl_layout === "Segmented" || tl_representation === "Radial" || globals.filter_type === "Hide") {
      return 0;
    }

    return 0.1;
  }).style("pointer-events", function (d) {
    if (tl_layout !== "Segmented" && tl_representation !== "Radial" && globals.active_event_list.indexOf(d.event_id) !== -1) {
      return "inherit";
    }

    return "none";
  });
  transition.select("rect.time_elapsed").attr("height", function (d) {
    if (tl_scale !== "Collapsed" || d.time_elapsed === 0) {
      return 0;
    }

    return interim_duration_scale(d.time_elapsed);
  }).style("opacity", function (d) {
    if (globals.active_event_list.indexOf(d.event_id) !== -1) {
      return 1;
    }

    if (globals.filter_type === "Hide") {
      return 0;
    }

    return 0.1;
  }).style("pointer-events", function (d) {
    if (globals.active_event_list.indexOf(d.event_id) !== -1) {
      return "inherit";
    }

    return "none";
  });

  if (tl_representation === "Radial") {
    transition.select("path.event_span").attrTween("d", arcTween(d3.arc().innerRadius(function (d) {
      var inner_radius = globals.centre_radius;
      switch (tl_scale) {

        case "Chronological":
          inner_radius = d3.max([globals.centre_radius, globals.centre_radius + d.track * globals.track_height]);
          break;

        case "Relative":
          inner_radius = d3.max([globals.centre_radius, globals.centre_radius + d.track * globals.track_height]);
          break;

        case "Sequential":
          inner_radius = d3.max([globals.centre_radius, globals.centre_radius + d.seq_track * globals.track_height]);
          break;
        default:
          break;
      }
      return inner_radius;
    }).outerRadius(function (d) {
      var outer_radius = globals.centre_radius + unit_width;
      switch (tl_scale) {

        case "Chronological":
          outer_radius = d3.max([globals.centre_radius + unit_width, globals.centre_radius + d.track * globals.track_height + unit_width]);
          break;

        case "Relative":
          outer_radius = d3.max([globals.centre_radius + unit_width, globals.centre_radius + d.track * globals.track_height + unit_width]);
          break;

        case "Sequential":
          outer_radius = d3.max([globals.centre_radius + unit_width, globals.centre_radius + d.seq_track * globals.track_height + unit_width]);
          break;
        default:
          break;
      }
      return outer_radius;
    }).startAngle(function (d) {
      var start_angle = 0;
      if (tl_layout !== "Segmented") {
        switch (tl_scale) {

          case "Chronological":
            start_angle = timeline_scale(d.start_date);
            break;

          case "Relative":
            if (tl_layout === "Faceted") {
              start_angle = timeline_scale(d.start_age);
            }
            break;

          case "Sequential":
            start_angle = timeline_scale(d.seq_index);
            break;
          default:
            break;
        }
      } else if (tl_layout === "Segmented") {
        switch (globals.segment_granularity) {
          case "days":
            start_angle = timeline_scale(moment(time.utcHour.floor(d.start_date)).hour());
            break;
          case "weeks":
            start_angle = timeline_scale(moment(time.day.floor(d.start_date)).day());
            break;
          case "months":
            start_angle = timeline_scale(moment(time.day.floor(d.start_date)).date());
            break;
          case "years":
            if (moment(time.utcWeek.floor(d.start_date)).isoWeek() === 53) {
              start_angle = timeline_scale(1);
            } else {
              start_angle = timeline_scale(moment(time.utcWeek.floor(d.start_date)).isoWeek());
            }
            break;
          case "decades":
            start_angle = timeline_scale(moment(time.month.floor(d.start_date)).month() + (time.month.floor(d.start_date).getUTCFullYear() - Math.floor(time.month.floor(d.start_date).getUTCFullYear() / 10) * 10) * 12);
            break;
          case "centuries":
            if (d.start_date.getUTCFullYear() < 0) {
              start_angle = timeline_scale(d.start_date.getUTCFullYear() % 100 + 100);
            } else {
              start_angle = timeline_scale(d.start_date.getUTCFullYear() % 100);
            }
            break;
          case "millenia":
            if (d.start_date.getUTCFullYear() < 0) {
              start_angle = timeline_scale(d.start_date.getUTCFullYear() % 1000 + 1000);
            } else {
              start_angle = timeline_scale(d.start_date.getUTCFullYear() % 1000);
            }
            break;
          case "epochs":
            start_angle = timeline_scale(d.start_date);
            break;
          default:
            break;
        }
      }
      return start_angle;
    }).endAngle(function (d) {
      var end_angle = 0;
      var unit_arc = Math.PI * 2 / 100;
      if (tl_layout !== "Segmented") {
        switch (tl_scale) {

          case "Chronological":
            end_angle = d3.max([timeline_scale(d.end_date), timeline_scale(d.start_date) + unit_arc]);
            break;

          case "Relative":
            if (tl_layout === "Faceted") {
              end_angle = d3.max([timeline_scale(d.end_age), timeline_scale(d.start_age) + unit_arc]);
            }
            break;

          case "Sequential":
            end_angle = timeline_scale(d.seq_index + 1);
            break;
          default:
            break;
        }
      } else if (tl_layout === "Segmented") {
        switch (globals.segment_granularity) {
          case "days":
            end_angle = timeline_scale(moment(time.utcHour.floor(d.start_date)).hour()) + unit_arc;
            break;
          case "weeks":
            end_angle = timeline_scale(moment(time.day.floor(d.start_date)).day()) + unit_arc;
            break;
          case "months":
            end_angle = timeline_scale(moment(time.day.floor(d.start_date)).date()) + unit_arc;
            break;
          case "years":
            if (moment(time.utcWeek.floor(d.start_date)).isoWeek() === 53) {
              end_angle = timeline_scale(1) + unit_arc;
            } else {
              end_angle = timeline_scale(moment(time.utcWeek.floor(d.start_date)).isoWeek()) + unit_arc;
            }
            break;
          case "decades":
            end_angle = timeline_scale(moment(time.month.floor(d.start_date)).month() + (time.month.floor(d.start_date).getUTCFullYear() - Math.floor(time.month.floor(d.start_date).getUTCFullYear() / 10) * 10) * 12) + unit_arc;
            break;
          case "centuries":
            if (d.start_date.getUTCFullYear() < 0) {
              end_angle = timeline_scale(d.start_date.getUTCFullYear() % 100 + 100) + unit_arc;
            } else {
              end_angle = timeline_scale(d.start_date.getUTCFullYear() % 100) + unit_arc;
            }
            break;
          case "millenia":
            if (d.start_date.getUTCFullYear() < 0) {
              end_angle = timeline_scale(d.start_date.getUTCFullYear() % 1000 + 1000) + unit_arc;
            } else {
              end_angle = timeline_scale(d.start_date.getUTCFullYear() % 1000) + unit_arc;
            }
            break;
          case "epochs":
            end_angle = timeline_scale(d.start_date) + unit_arc;
            break;
          default:
            break;
        }
      }
      return end_angle;
    }))).style("opacity", function (d) {
      if (tl_layout !== "Segmented") {
        if (globals.active_event_list.indexOf(d.event_id) !== -1) {
          return 1;
        }

        if (globals.filter_type === "Hide") {
          return 0;
        }

        return 0.1;
      }

      return 0;
    }).style("pointer-events", function (d) {
      if (tl_layout !== "Segmented") {
        if (globals.active_event_list.indexOf(d.event_id) !== -1) {
          return "inherit";
        }

        return "none";
      }

      return "none";
    }).style("display", "inline");
  }
  transition.selectAll("rect.event_span_component").style("opacity", function () {
    if (tl_layout === "Segmented" && tl_representation !== "Radial" && globals.active_event_list.indexOf(d3.select(this.parentNode).datum().event_id) !== -1) {
      return 1;
    }

    if (tl_layout !== "Segmented" || globals.filter_type === "Hide" || tl_representation === "Radial") {
      return 0;
    }

    return 0.1;
  }).style("pointer-events", function () {
    if (tl_layout === "Segmented" && tl_representation !== "Radial" && globals.active_event_list.indexOf(d3.select(this.parentNode).datum().event_id) !== -1) {
      return "inherit";
    }

    return "none";
  });
  if (tl_representation === "Radial") {
    transition.selectAll("path.event_span_component").attrTween("d", arcTween(d3.arc().innerRadius(function () {
      var inner_radius = globals.centre_radius;
      if (tl_scale === "Relative" || tl_scale === "Chronological") {
        inner_radius = d3.max([globals.centre_radius, globals.centre_radius + d3.select(this.parentNode).datum().track * globals.track_height]);
      }
      return inner_radius;
    }).outerRadius(function () {
      var outer_radius = globals.centre_radius + unit_width;
      if (tl_scale === "Relative" || tl_scale === "Chronological") {
        outer_radius = d3.max([globals.centre_radius + unit_width, globals.centre_radius + d3.select(this.parentNode).datum().track * globals.track_height + unit_width]);
      }
      return outer_radius;
    }).startAngle(function (dataItem) {
      // TODO: Come back and consolidate startAngle & endAngle
      var d = dataItem.dateTime;
      var start_angle = 0;
      if (tl_layout === "Segmented" && tl_scale === "Chronological") {
        switch (globals.segment_granularity) {
          case "days":
            start_angle = d3.max([0, timeline_scale(moment(d).hour())]);
            break;
          case "weeks":
            start_angle = d3.max([0, timeline_scale(moment(d).day())]);
            break;
          case "months":
            start_angle = d3.max([0, timeline_scale(moment(d).date())]);
            break;
          case "years":
            if (moment(d).isoWeek() === 53) {
              start_angle = d3.max([0, timeline_scale(1)]);
            } else {
              start_angle = d3.max([0, timeline_scale(moment(d).isoWeek())]);
            }
            break;
          case "decades":
            start_angle = d3.max([0, timeline_scale(moment(d).month() + (d.getUTCFullYear() - Math.floor(d.getUTCFullYear() / 10) * 10) * 12)]);
            break;
          case "centuries":
            if (d < 0) {
              start_angle = d3.max([0, timeline_scale(d % 100 + 100)]);
            } else {
              start_angle = d3.max([0, timeline_scale(d % 100)]);
            }
            break;
          case "millenia":
            if (d < 0) {
              start_angle = d3.max([0, timeline_scale(d % 1000 + 1000)]);
            } else {
              start_angle = d3.max([0, timeline_scale(d % 1000)]);
            }
            break;
          case "epochs":
            start_angle = d3.max([0, timeline_scale(d.valueOf())]);
            break;
          default:
            break;
        }
      } else if (tl_layout === "Unified" || tl_layout === "Faceted") {
        switch (tl_scale) {

          case "Chronological":
            start_angle = timeline_scale(d3.select(this.parentNode).datum().start_date);
            break;

          case "Relative":
            if (tl_layout === "Faceted") {
              start_angle = timeline_scale(d3.select(this.parentNode).datum().start_age);
            }
            break;

          case "Sequential":
            start_angle = timeline_scale(d3.select(this.parentNode).datum().seq_index);
            break;
          default:
            break;
        }
      }
      return start_angle;
    }).endAngle(function (dataItem) {
      var d = dataItem.dateTime;
      var end_angle = 0,
          unit_arc = 0;
      if (tl_layout === "Segmented" && tl_scale === "Chronological") {
        switch (globals.segment_granularity) {
          case "days":
            unit_arc = Math.PI * 2 / 24;
            end_angle = d3.max([0, timeline_scale(moment(d).hour()) + unit_arc]);
            break;
          case "weeks":
            unit_arc = Math.PI * 2 / 7;
            end_angle = d3.max([0, timeline_scale(moment(d).day()) + unit_arc]);
            break;
          case "months":
            unit_arc = Math.PI * 2 / 31;
            end_angle = d3.max([0, timeline_scale(moment(d).date()) + unit_arc]);
            break;
          case "years":
            unit_arc = Math.PI * 2 / 52;
            if (moment(d).isoWeek() === 53) {
              end_angle = d3.max([0, timeline_scale(1) + unit_arc]);
            } else {
              end_angle = d3.max([0, timeline_scale(moment(d).isoWeek()) + unit_arc]);
            }
            break;
          case "decades":
            unit_arc = Math.PI * 2 / 120;
            end_angle = d3.max([0, timeline_scale(moment(d).month() + (d.getUTCFullYear() - Math.floor(d.getUTCFullYear() / 10) * 10) * 12) + unit_arc]);
            break;
          case "centuries":
            unit_arc = Math.PI * 2 / 100;
            if (d < 0) {
              end_angle = d3.max([0, timeline_scale(d % 100 + 100) + unit_arc]);
            } else {
              end_angle = d3.max([0, timeline_scale(d % 100) + unit_arc]);
            }
            break;
          case "millenia":
            unit_arc = Math.PI * 2 / 100;
            if (d < 0) {
              end_angle = d3.max([0, timeline_scale(d % 1000 + 1000) + unit_arc]);
            } else {
              end_angle = d3.max([0, timeline_scale(d % 1000) + unit_arc]);
            }
            break;
          case "epochs":
            unit_arc = Math.PI * 2 / 100;
            end_angle = d3.max([0, timeline_scale(d.valueOf()) + unit_arc]);
            break;
          default:
            break;
        }
      } else if (tl_layout === "Unified" || tl_layout === "Faceted") {
        unit_arc = Math.PI * 2 / 100;
        switch (tl_scale) {

          case "Chronological":
            end_angle = d3.max([timeline_scale(d.end_date), timeline_scale(d3.select(this.parentNode).datum().start_date) + unit_arc]);
            break;

          case "Relative":
            if (tl_layout === "Faceted") {
              end_angle = d3.max([timeline_scale(d.end_age), timeline_scale(d3.select(this.parentNode).datum().start_age) + unit_arc]);
            }
            break;

          case "Sequential":
            end_angle = timeline_scale(d3.select(this.parentNode).datum().seq_index + 1);
            break;
          default:
            break;
        }
      }
      return end_angle;
    }))).style("opacity", function () {
      if (tl_layout === "Segmented" && tl_scale === "Chronological") {
        if (globals.active_event_list.indexOf(d3.select(this.parentNode).datum().event_id) !== -1) {
          return 1;
        }

        if (globals.filter_type === "Hide") {
          return 0;
        }

        return 0.1;
      }

      return 0;
    }).style("pointer-events", function () {
      if (tl_layout === "Segmented" && tl_scale === "Chronological") {
        if (globals.active_event_list.indexOf(d3.select(this.parentNode).datum().event_id) !== -1) {
          return "inherit";
        }

        return "none";
      }

      return "none";
    }).style("display", "inline");
  }
}

function finalUpdate(tl_layout, transition) {
  transition.select(".path_end_indicator").style("opacity", function () {
    if (globals.active_event_list.indexOf(d3.select(this.parentNode).datum().event_id) !== -1) {
      return 1;
    }

    return 0;
  }).style("pointer-events", function () {
    if (globals.active_event_list.indexOf(d3.select(this.parentNode).datum().event_id) !== -1) {
      return "inherit";
    }

    return "none";
  }).style("display", function () {
    if (tl_layout === "Segmented") {
      return "inline";
    }

    return "none";
  });

  transition.selectAll("path.event_span").each(function () {
    this.parentNode.appendChild(this);
  });
}

function transitionLog(start, transition) {
  if (transition.size() > 0) {
    log(new Date().getTime() - start.getTime() + "ms: transition with " + transition.size() + " elements lasting " + transition.duration() + "ms.");
  }
}

// place an element in correct x position on grid axis
function getXGridPosition(year) {
  var cell_size = 50;

  if (year < 0 && year % 10 !== 0) {
    return (year % 10 + 10) * cell_size; // negative decade year correction adds 10
  }

  return year % 10 * cell_size;
}

// place an element in correct y position on grid axis
function getYGridPosition(year, min, unit_width) {
  var cell_size = 50,
      century_height = cell_size * unit_width,
      y_offset = 0;

  var decade_of_century = 0,
      century_offset = Math.floor(year / 100) - Math.floor(min / 100);

  if (year < 0) {
    century_offset++; // handle BC dates
    if (year % 100 === 0) {
      decade_of_century = 0;
      century_offset--;
      y_offset = -unit_width;
    } else {
      decade_of_century = Math.floor(year % 100 / 10) - 1;
    }
  } else {
    decade_of_century = Math.floor(year % 100 / 10);
  }

  return decade_of_century * 1.25 * cell_size + century_offset * (century_height + cell_size) + y_offset;
}

function calculateSpanSegment(min_start_date, start_date) {
  var span_segment = 0;
  var year = start_date && start_date.getUTCFullYear ? start_date.getUTCFullYear() : start_date;
  switch (globals.segment_granularity) {
    case "days":
      span_segment = d3.max([0, time.day.count(time.day.floor(min_start_date), start_date)]);
      break;
    case "weeks":
      span_segment = d3.max([0, time.week.count(time.week.floor(min_start_date), start_date)]);
      break;
    case "months":
      span_segment = d3.max([0, time.month.count(time.month.floor(min_start_date), start_date)]);
      break;
    case "years":
      span_segment = d3.max([0, year - min_start_date.getUTCFullYear()]);
      break;
    case "decades":
      span_segment = d3.max([0, Math.floor(year / 10) - Math.floor(min_start_date.getUTCFullYear() / 10)]);
      break;
    case "centuries":
      span_segment = d3.max([0, Math.floor(year / 100) - Math.floor(min_start_date.getUTCFullYear() / 100)]);
      break;
    case "millenia":
      span_segment = d3.max([0, Math.floor(year / 1000) - Math.floor(min_start_date.getUTCFullYear() / 1000)]);
      break;
    default:
      break;
  }
  return span_segment;
}

/**
 * Returns the number of segments necessary to appropriately render the given granularity
 * @param {string} granularity The granularity to get the number of segments for
 * @return {number} The number of segments for a given granularity
 */
function getNumberOfSegmentsForGranularity(granularity) {
  if (granularity === "days") {
    return 24;
  }
  if (granularity === "weeks") {
    return 7;
  }
  if (granularity === "months") {
    return 31;
  }
  if (granularity === "years") {
    return 52;
  }
  if (granularity === "decades") {
    return 120;
  }
  return 100;
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var template = __webpack_require__(29);
var tr = __webpack_require__(4);
var d3 = __webpack_require__(0);
var imageUrls = __webpack_require__(3);
var utils = __webpack_require__(1);

/**
 * An add image dialog
 * @constructor
 */
function AddImageDialog() {
  this.element = d3.select(template());
  this._dispatcher = d3.dispatch("imageSelected");
  this.on = this._dispatcher.on.bind(this._dispatcher);
  this._addImageUrl = this.element.select(".add_image_link");
  this._addImageButton = this.element.select(".add_image_btn");
  this._addImageDropZone = this.element.select(".image_local_add_drop_zone");
  this._addImageFileChooser = this.element.select(".add_image_file_chooser");
  this._addFilesContainer = this.element.select(".file_selection_container");
  this._selectedFilesContainer = this.element.select(".selected_files_container");
  this._resizeEnabled = this.element.select(".resize_enabled_cb");
  this._resizeWidth = this.element.select(".resize_width");
  this._resizeHeight = this.element.select(".resize_height");
  this._errorElement = this.element.select(".image_div_error");
  this._offlineEnabled = this.element.select(".offline_enabled_cb");
  this._selectedFiles = [];

  this._addImageButton.on("click", this._addImageButtonClicked.bind(this));
  this._addImageDropZone.on("dragover", this._addImageDropZoneDragOver.bind(this)).on("drop", this._addImageDropZoneDrop.bind(this)).on("dragleave", this._addImageDropZoneDragLeave.bind(this));
  this._addImageFileChooser.on("change", this._addImageFileChooserChange.bind(this));
}

/**
 * Shows the add image dialog
 * @returns {void}
 */
AddImageDialog.prototype.show = function () {
  this.element.style("display", "");
};

/**
 * Hides the add image dialog
 * @returns {void}
 */
AddImageDialog.prototype.hide = function () {
  this.element.style("display", "none");
};

/**
 * Returns true if the image dialog is hidden
 * @returns {boolean} true if hidden
 */
AddImageDialog.prototype.hidden = function () {
  return this.element.style("display") === "none";
};

/**
 * Resets the dialog to the default state
 * @param {boolean} [hide=true] If the dialog should be hidden
 * @returns {void}
 */
AddImageDialog.prototype.reset = function (hide) {
  this._selectedFiles.length = 0;
  this._addImageUrl.property("value", "");
  this._addImageFileChooser.property("value", "");
  this._addFilesContainer.style("display", "");
  this._errorElement.style("display", "none");
  this._selectedFilesContainer.style("display", "none").html(tr("No files selected"));
  if (hide !== false) {
    this.hide();
  }
};

/**
 * Adds a selected file to the list of selected files
 * @param {File} file The file that was selected
 * @returns {void}
 */
AddImageDialog.prototype._addSelectedFile = function (file) {
  var _this = this;

  this._selectedFiles.push(file);
  var fileContainer = this._selectedFilesContainer.html("").append("div").attr("role", "button").attr("tabIndex", 0).attr("class", "add_image_selected_file");
  fileContainer.append("span").text(file.name);
  fileContainer.append("img").attr("class", "selected_file_remove_btn").attr("src", imageUrls("close.png"));
  fileContainer.on("click", function () {
    _this.reset(false);
  });
  this._addFilesContainer.style("display", "none");
  this._selectedFilesContainer.style("display", "");
};

/**
 * Listener for the Add image button being clicked
 * @returns {void}
 */
AddImageDialog.prototype._addImageButtonClicked = function () {
  var _this2 = this;

  var imageUrl = this._addImageUrl.property("value");
  var finalizeImage = function finalizeImage(url) {
    var waitForImagePromise = function waitForImagePromise(p) {
      p.then(function (dataURL) {
        _this2._dispatcher.call("imageSelected", _this2, dataURL);
        _this2.reset();
      }, function (e) {
        var error = tr("Could not save image. ");
        var message = (e && e.message ? e.message : e) || "";

        // This occurs if the server does not have CORS set up properly, or does not allow canvas saving
        if (message.indexOf("tainted") >= 0) {
          error += "<br/>" + tr("The image server is not set up correctly.") + "<br/>" + tr("Try disabling \"Keep Offline\" and \"Resize To\" options.");
        } else if (message.indexOf("CORS") >= 0 || message.indexOf("Cross")) {
          error += "<br/>" + tr("The image server does not allow for the saving of images.") + "<br/>" + tr("Try disabling \"Keep Offline\" and \"Resize To\" options.");
        } else {
          error += "<br/>" + message;
        }
        _this2._errorElement.node().innerHTML = error;
        _this2._errorElement.style("display", "");
      });
    };

    // If we are resizing it
    if (_this2._resizeEnabled.property("checked")) {
      var width = _this2._resizeWidth.property("value");
      var height = _this2._resizeHeight.property("value");
      waitForImagePromise(utils.resizeImage(url, width, height, true));
    } else if (_this2._offlineEnabled.property("checked")) {
      waitForImagePromise(utils.imageUrlToDataURL(url));
    } else {
      _this2._dispatcher.call("imageSelected", _this2, url);
      _this2.reset();
    }
  };

  if (this._selectedFiles.length) {
    var fileReader = new FileReader();
    fileReader.onloadend = function (fileEvent) {
      finalizeImage(fileEvent.target.result);
    };
    fileReader.readAsDataURL(this._selectedFiles[0]);
  } else if (imageUrl) {
    finalizeImage(imageUrl);
  }
};

/**
 * Drag over listener for the drag/drop zone for files
 * @param {Event} e The drag event
 * @returns {void}
 */
AddImageDialog.prototype._addImageDropZoneDragOver = function (e) {
  stopEvent(e);

  e.dataTransfer.dropEffect = "copy";
  this._addImageDropZone.classed("dragging", true);
};

/**
 * Drag over listener for the drag/drop zone for files
 * @param {Event} e The drag event
 * @returns {void}
 */
AddImageDialog.prototype._addImageDropZoneDragLeave = function (e) {
  stopEvent(e);

  this._addImageDropZone.classed("dragging", false);
};

/**
 * Drop listener for the drag/drop zone for files
 * @param {Event} e The drag event
 * @returns {void}
 */
AddImageDialog.prototype._addImageDropZoneDrop = function (e) {
  stopEvent(e);

  var files = e.dataTransfer.files;
  this._addSelectedFile(files[0]);
};

/**
 * Listener for when the file chooser changes
 * @returns {void}
 */
AddImageDialog.prototype._addImageFileChooserChange = function () {
  this._addSelectedFile(this._addImageFileChooser.node().files[0]);
};

module.exports = function () {
  return new AddImageDialog();
};

/**
 * Quick helper to completely stop an event
 * @param {Event} e The event to stop
 * @returns {void}
 */
function stopEvent(e) {
  e.stopPropagation();
  e.preventDefault();
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var d3 = __webpack_require__(0);
var removeOnEnd = __webpack_require__(1).removeOnEnd;

/**

gridAxis: //a reusable grid axis

**/

d3.gridAxis = function (unit_width) {
  var cell_size = 50,
      century_height = cell_size * unit_width,
      duration = 1000,
      min_year = 1900,
      max_year = 2000;

  function gridAxis(selection) {
    selection.each(function (data) {
      var g = d3.select(this);

      // grid container items for each year
      var grid_join = g.selectAll(".grid").data(data);

      var grid_enter = grid_join.enter().append("g").attr("class", "grid");

      grid_enter.append("rect").attr("class", "year_cell").attr("width", cell_size).attr("height", cell_size).attr("x", function (d) {
        return getXGridPosition(d);
      }).attr("y", 0);

      grid_enter.append("text").attr("class", "year_label").attr("x", function (d) {
        return getXGridPosition(d);
      }).attr("y", 0).attr("dy", "-0.3em").attr("dx", "0.3em").text("");

      var grid_exit = grid_join.exit().transition().duration(duration).call(removeOnEnd);

      var grid = grid_enter.merge(grid_join);

      grid_exit.select(".year_cell").attr("height", 0).attr("y", 0);

      grid_exit.select(".year_label").attr("y", 0).text("");

      var grid_update = grid.transition().duration(duration);

      grid_update.select(".year_cell").attr("x", function (d) {
        return getXGridPosition(d);
      }).attr("y", function (d) {
        return getYGridPosition(d, min_year);
      });

      grid_update.select(".year_label").attr("x", function (d) {
        return getXGridPosition(d);
      }).attr("y", function (d) {
        return getYGridPosition(d, min_year) + cell_size;
      }).text(function (d) {
        return d;
      });
    });
    d3.timerFlush();
  }

  // place an element in correct x position on grid axis
  function getXGridPosition(year) {
    if (year < 0 && year % 10 !== 0) {
      return (year % 10 + 10) * cell_size; // negative decade year correction adds 10
    }
    return year % 10 * cell_size;
  }

  // place an element in correct y position on grid axis
  function getYGridPosition(year, min) {
    var decade_of_century = 0,
        century_offset = Math.floor(year / 100) - Math.floor(min / 100),
        y_offset = 0;

    century_height = cell_size * unit_width;

    if (year < 0) {
      century_offset++; // handle BC dates
      if (year % 100 === 0) {
        decade_of_century = 0;
        century_offset--;
        y_offset = -unit_width;
      } else {
        decade_of_century = Math.floor(year % 100 / 10) - 1;
      }
    } else {
      decade_of_century = Math.floor(year % 100 / 10);
    }

    return decade_of_century * 1.25 * cell_size + century_offset * (century_height + cell_size) + y_offset;
  }

  gridAxis.min_year = function (x) {
    if (!arguments.length) {
      return min_year;
    }
    min_year = x;
    return gridAxis;
  };

  gridAxis.max_year = function (x) {
    if (!arguments.length) {
      return max_year;
    }
    max_year = x;
    return gridAxis;
  };

  gridAxis.duration = function (x) {
    if (!arguments.length) {
      return duration;
    }
    duration = x;
    return gridAxis;
  };

  return gridAxis;
};

module.exports = d3.gridAxis;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var TimelineStoryteller = __webpack_require__(13);
var utils = __webpack_require__(1);
var imageUrls = __webpack_require__(3);

// Expose the utils as well
TimelineStoryteller.utils = utils;
TimelineStoryteller.images = imageUrls;

module.exports = TimelineStoryteller;

/***/ }),
/* 24 */
/***/ (function(module, exports) {

(function (s, t, u) {
  var v = s.SVGAngle || t.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML",
      picker,
      slide,
      hueOffset = 15,
      svgNS = 'http://www.w3.org/2000/svg';var w = ['<div class="picker-wrapper">', '<div class="picker"></div>', '<div class="picker-indicator"></div>', '</div>', '<div class="slide-wrapper">', '<div class="slide"></div>', '<div class="slide-indicator"></div>', '</div>'].join('');function mousePosition(a) {
    if (s.event && s.event.contentOverflow !== u) {
      return { x: s.event.offsetX, y: s.event.offsetY };
    }if (a.offsetX !== u && a.offsetY !== u) {
      return { x: a.offsetX, y: a.offsetY };
    }var b = a.target.parentNode.parentNode;return { x: a.layerX - b.offsetLeft, y: a.layerY - b.offsetTop };
  }function $(a, b, c) {
    a = t.createElementNS(svgNS, a);for (var d in b) {
      a.setAttribute(d, b[d]);
    }if (Object.prototype.toString.call(c) != '[object Array]') c = [c];var i = 0,
        len = c[0] && c.length || 0;for (; i < len; i++) {
      a.appendChild(c[i]);
    }return a;
  }if (v == 'SVG') {
    slide = $('svg', { xmlns: 'http://www.w3.org/2000/svg', version: '1.1', width: '100%', height: '100%' }, [$('defs', {}, $('linearGradient', { id: 'gradient-hsv', x1: '0%', y1: '100%', x2: '0%', y2: '0%' }, [$('stop', { offset: '0%', 'stop-color': '#FF0000', 'stop-opacity': '1' }), $('stop', { offset: '13%', 'stop-color': '#FF00FF', 'stop-opacity': '1' }), $('stop', { offset: '25%', 'stop-color': '#8000FF', 'stop-opacity': '1' }), $('stop', { offset: '38%', 'stop-color': '#0040FF', 'stop-opacity': '1' }), $('stop', { offset: '50%', 'stop-color': '#00FFFF', 'stop-opacity': '1' }), $('stop', { offset: '63%', 'stop-color': '#00FF40', 'stop-opacity': '1' }), $('stop', { offset: '75%', 'stop-color': '#0BED00', 'stop-opacity': '1' }), $('stop', { offset: '88%', 'stop-color': '#FFFF00', 'stop-opacity': '1' }), $('stop', { offset: '100%', 'stop-color': '#FF0000', 'stop-opacity': '1' })])), $('rect', { x: '0', y: '0', width: '100%', height: '100%', fill: 'url(#gradient-hsv)' })]);picker = $('svg', { xmlns: 'http://www.w3.org/2000/svg', version: '1.1', width: '100%', height: '100%' }, [$('defs', {}, [$('linearGradient', { id: 'gradient-black', x1: '0%', y1: '100%', x2: '0%', y2: '0%' }, [$('stop', { offset: '0%', 'stop-color': '#000000', 'stop-opacity': '1' }), $('stop', { offset: '100%', 'stop-color': '#CC9A81', 'stop-opacity': '0' })]), $('linearGradient', { id: 'gradient-white', x1: '0%', y1: '100%', x2: '100%', y2: '100%' }, [$('stop', { offset: '0%', 'stop-color': '#FFFFFF', 'stop-opacity': '1' }), $('stop', { offset: '100%', 'stop-color': '#CC9A81', 'stop-opacity': '0' })])]), $('rect', { x: '0', y: '0', width: '100%', height: '100%', fill: 'url(#gradient-white)' }), $('rect', { x: '0', y: '0', width: '100%', height: '100%', fill: 'url(#gradient-black)' })]);
  } else if (v == 'VML') {
    slide = ['<DIV style="position: relative; width: 100%; height: 100%">', '<v:rect style="position: absolute; top: 0; left: 0; width: 100%; height: 100%" stroked="f" filled="t">', '<v:fill type="gradient" method="none" angle="0" color="red" color2="red" colors="8519f fuchsia;.25 #8000ff;24903f #0040ff;.5 aqua;41287f #00ff40;.75 #0bed00;57671f yellow"></v:fill>', '</v:rect>', '</DIV>'].join('');picker = ['<DIV style="position: relative; width: 100%; height: 100%">', '<v:rect style="position: absolute; left: -1px; top: -1px; width: 101%; height: 101%" stroked="f" filled="t">', '<v:fill type="gradient" method="none" angle="270" color="#FFFFFF" opacity="100%" color2="#CC9A81" o:opacity2="0%"></v:fill>', '</v:rect>', '<v:rect style="position: absolute; left: 0px; top: 0px; width: 100%; height: 101%" stroked="f" filled="t">', '<v:fill type="gradient" method="none" angle="0" color="#000000" opacity="100%" color2="#CC9A81" o:opacity2="0%"></v:fill>', '</v:rect>', '</DIV>'].join('');if (!t.namespaces['v']) t.namespaces.add('v', 'urn:schemas-microsoft-com:vml', '#default#VML');
  }function hsv2rgb(a) {
    var R, G, B, X, C;var h = a.h % 360 / 60;C = a.v * a.s;X = C * (1 - Math.abs(h % 2 - 1));R = G = B = a.v - C;h = ~~h;R += [C, X, 0, 0, X, C][h];G += [X, C, C, X, 0, 0][h];B += [0, 0, X, C, C, X][h];var r = Math.floor(R * 255);var g = Math.floor(G * 255);var b = Math.floor(B * 255);return { r: r, g: g, b: b, hex: "#" + (16777216 | b | g << 8 | r << 16).toString(16).slice(1) };
  }function rgb2hsv(a) {
    var r = a.r;var g = a.g;var b = a.b;if (a.r > 1 || a.g > 1 || a.b > 1) {
      r /= 255;g /= 255;b /= 255;
    }var H, S, V, C;V = Math.max(r, g, b);C = V - Math.min(r, g, b);H = C == 0 ? null : V == r ? (g - b) / C + (g < b ? 6 : 0) : V == g ? (b - r) / C + 2 : (r - g) / C + 4;H = H % 6 * 60;S = C == 0 ? 0 : C / V;return { h: H, s: S, v: V };
  }function slideListener(d, e, f) {
    return function (a) {
      a = a || s.event;var b = mousePosition(a);d.h = b.y / e.offsetHeight * 360 + hueOffset;d.s = d.v = 1;var c = hsv2rgb({ h: d.h, s: 1, v: 1 });f.style.backgroundColor = c.hex;d.callback && d.callback(c.hex, { h: d.h - hueOffset, s: d.s, v: d.v }, { r: c.r, g: c.g, b: c.b }, u, b);
    };
  };function pickerListener(d, e) {
    return function (a) {
      a = a || s.event;var b = mousePosition(a),
          width = e.offsetWidth,
          height = e.offsetHeight;d.s = b.x / width;d.v = (height - b.y) / height;var c = hsv2rgb(d);d.callback && d.callback(c.hex, { h: d.h - hueOffset, s: d.s, v: d.v }, { r: c.r, g: c.g, b: c.b }, b);
    };
  };var x = 0;function ColorPicker(f, g, h) {
    if (!(this instanceof ColorPicker)) return new ColorPicker(f, g, h);this.h = 0;this.s = 1;this.v = 1;if (!h) {
      var i = f;i.innerHTML = w;this.slideElement = i.getElementsByClassName('slide')[0];this.pickerElement = i.getElementsByClassName('picker')[0];var j = i.getElementsByClassName('slide-indicator')[0];var k = i.getElementsByClassName('picker-indicator')[0];ColorPicker.fixIndicators(j, k);this.callback = function (a, b, c, d, e) {
        ColorPicker.positionIndicators(j, k, e, d);g(a, b, c);
      };
    } else {
      this.callback = h;this.pickerElement = g;this.slideElement = f;
    }if (v == 'SVG') {
      var l = slide.cloneNode(true);var m = picker.cloneNode(true);var n = l.getElementsByTagName('linearGradient')[0];var o = l.getElementsByTagName('rect')[0];n.id = 'gradient-hsv-' + x;o.setAttribute('fill', 'url(#' + n.id + ')');var p = [m.getElementsByTagName('linearGradient')[0], m.getElementsByTagName('linearGradient')[1]];var q = m.getElementsByTagName('rect');p[0].id = 'gradient-black-' + x;p[1].id = 'gradient-white-' + x;q[0].setAttribute('fill', 'url(#' + p[1].id + ')');q[1].setAttribute('fill', 'url(#' + p[0].id + ')');this.slideElement.appendChild(l);this.pickerElement.appendChild(m);x++;
    } else {
      this.slideElement.innerHTML = slide;this.pickerElement.innerHTML = picker;
    }addEventListener(this.slideElement, 'click', slideListener(this, this.slideElement, this.pickerElement));addEventListener(this.pickerElement, 'click', pickerListener(this, this.pickerElement));enableDragging(this, this.slideElement, slideListener(this, this.slideElement, this.pickerElement));enableDragging(this, this.pickerElement, pickerListener(this, this.pickerElement));
  };function addEventListener(a, b, c) {
    if (a.attachEvent) {
      a.attachEvent('on' + b, c);
    } else if (a.addEventListener) {
      a.addEventListener(b, c, false);
    }
  }function enableDragging(b, c, d) {
    var e = false;addEventListener(c, 'mousedown', function (a) {
      e = true;
    });addEventListener(c, 'mouseup', function (a) {
      e = false;
    });addEventListener(c, 'mouseout', function (a) {
      e = false;
    });addEventListener(c, 'mousemove', function (a) {
      if (e) {
        d(a);
      }
    });
  }ColorPicker.hsv2rgb = function (a) {
    var b = hsv2rgb(a);delete b.hex;return b;
  };ColorPicker.hsv2hex = function (a) {
    return hsv2rgb(a).hex;
  };ColorPicker.rgb2hsv = rgb2hsv;ColorPicker.rgb2hex = function (a) {
    return hsv2rgb(rgb2hsv(a)).hex;
  };ColorPicker.hex2hsv = function (a) {
    return rgb2hsv(ColorPicker.hex2rgb(a));
  };ColorPicker.hex2rgb = function (a) {
    return { r: parseInt(a.substr(1, 2), 16), g: parseInt(a.substr(3, 2), 16), b: parseInt(a.substr(5, 2), 16) };
  };function setColor(a, b, d, e) {
    a.h = b.h % 360;a.s = b.s;a.v = b.v;var c = hsv2rgb(a);var f = { y: a.h * a.slideElement.offsetHeight / 360, x: 0 };var g = a.pickerElement.offsetHeight;var h = { x: a.s * a.pickerElement.offsetWidth, y: g - a.v * g };a.pickerElement.style.backgroundColor = hsv2rgb({ h: a.h, s: 1, v: 1 }).hex;a.callback && a.callback(e || c.hex, { h: a.h, s: a.s, v: a.v }, d || { r: c.r, g: c.g, b: c.b }, h, f);return a;
  };ColorPicker.prototype.setHsv = function (a) {
    return setColor(this, a);
  };ColorPicker.prototype.setRgb = function (a) {
    return setColor(this, rgb2hsv(a), a);
  };ColorPicker.prototype.setHex = function (a) {
    return setColor(this, ColorPicker.hex2hsv(a), u, a);
  };ColorPicker.positionIndicators = function (a, b, c, d) {
    if (c) {
      b.style.left = 'auto';b.style.right = '0px';b.style.top = '0px';a.style.top = c.y - a.offsetHeight / 2 + 'px';
    }if (d) {
      b.style.top = d.y - b.offsetHeight / 2 + 'px';b.style.left = d.x - b.offsetWidth / 2 + 'px';
    }
  };ColorPicker.fixIndicators = function (a, b) {
    b.style.pointerEvents = 'none';a.style.pointerEvents = 'none';
  };s.ColorPicker = ColorPicker;
})(window, window.document);

/***/ }),
/* 25 */
/***/ (function(module, exports) {

(function (c) {
  function a(b, d) {
    if ({}.hasOwnProperty.call(a.cache, b)) return a.cache[b];var e = a.resolve(b);if (!e) throw new Error('Failed to resolve module ' + b);var c = { id: b, require: a, filename: b, exports: {}, loaded: !1, parent: d, children: [] };d && d.children.push(c);var f = b.slice(0, b.lastIndexOf('/') + 1);return a.cache[b] = c.exports, e.call(c.exports, c, c.exports, f, b), c.loaded = !0, a.cache[b] = c.exports;
  }a.modules = {}, a.cache = {}, a.resolve = function (b) {
    return {}.hasOwnProperty.call(a.modules, b) ? a.modules[b] : void 0;
  }, a.define = function (b, c) {
    a.modules[b] = c;
  };var b = function (a) {
    return a = '/', { title: 'browser', version: 'v0.10.26', browser: !0, env: {}, argv: [], nextTick: c.setImmediate || function (a) {
        setTimeout(a, 0);
      }, cwd: function cwd() {
        return a;
      }, chdir: function chdir(b) {
        a = b;
      } };
  }();a.define('/gif.coffee', function (d, m, l, k) {
    function g(a, b) {
      return {}.hasOwnProperty.call(a, b);
    }function j(d, b) {
      for (var a = 0, c = b.length; a < c; ++a) {
        if (a in b && b[a] === d) return !0;
      }return !1;
    }function i(a, b) {
      function d() {
        this.constructor = a;
      }for (var c in b) {
        g(b, c) && (a[c] = b[c]);
      }return d.prototype = b.prototype, a.prototype = new d(), a.__super__ = b.prototype, a;
    }var h, c, f, b, e;f = a('events', d).EventEmitter, h = a('/browser.coffee', d), e = function (d) {
      function a(d) {
        var a, b;this.running = !1, this.options = {}, this.frames = [], this.freeWorkers = [], this.activeWorkers = [], this.setOptions(d);for (a in c) {
          b = c[a], null != this.options[a] ? this.options[a] : this.options[a] = b;
        }
      }return i(a, d), c = { workerScript: 'gif.worker.js', workers: 2, repeat: 0, background: '#fff', quality: 10, width: null, height: null, transparent: null }, b = { delay: 500, copy: !1 }, a.prototype.setOption = function (a, b) {
        return this.options[a] = b, null != this._canvas && (a === 'width' || a === 'height') ? this._canvas[a] = b : void 0;
      }, a.prototype.setOptions = function (b) {
        var a, c;return function (d) {
          for (a in b) {
            if (!g(b, a)) continue;c = b[a], d.push(this.setOption(a, c));
          }return d;
        }.call(this, []);
      }, a.prototype.addFrame = function (a, d) {
        var c, e;null == d && (d = {}), c = {}, c.transparent = this.options.transparent;for (e in b) {
          c[e] = d[e] || b[e];
        }if (null != this.options.width || this.setOption('width', a.width), null != this.options.height || this.setOption('height', a.height), 'undefined' !== typeof ImageData && null != ImageData && a instanceof ImageData) c.data = a.data;else if ('undefined' !== typeof CanvasRenderingContext2D && null != CanvasRenderingContext2D && a instanceof CanvasRenderingContext2D || 'undefined' !== typeof WebGLRenderingContext && null != WebGLRenderingContext && a instanceof WebGLRenderingContext) d.copy ? c.data = this.getContextData(a) : c.context = a;else if (null != a.childNodes) d.copy ? c.data = this.getImageData(a) : c.image = a;else throw new Error('Invalid image');return this.frames.push(c);
      }, a.prototype.render = function () {
        var d, a;if (this.running) throw new Error('Already running');if (!(null != this.options.width && null != this.options.height)) throw new Error('Width and height must be set prior to rendering');this.running = !0, this.nextFrame = 0, this.finishedFrames = 0, this.imageParts = function (c) {
          for (var b = function () {
            var b;b = [];for (var a = 0; 0 <= this.frames.length ? a < this.frames.length : a > this.frames.length; 0 <= this.frames.length ? ++a : --a) {
              b.push(a);
            }return b;
          }.apply(this, arguments), a = 0, e = b.length; a < e; ++a) {
            d = b[a], c.push(null);
          }return c;
        }.call(this, []), a = this.spawnWorkers();for (var c = function () {
          var c;c = [];for (var b = 0; 0 <= a ? b < a : b > a; 0 <= a ? ++b : --b) {
            c.push(b);
          }return c;
        }.apply(this, arguments), b = 0, e = c.length; b < e; ++b) {
          d = c[b], this.renderNextFrame();
        }return this.emit('start'), this.emit('progress', 0);
      }, a.prototype.abort = function () {
        var a;while (!0) {
          if (a = this.activeWorkers.shift(), !(null != a)) break;console.log('killing active worker'), a.terminate();
        }return this.running = !1, this.emit('abort');
      }, a.prototype.spawnWorkers = function () {
        var a;return a = Math.min(this.options.workers, this.frames.length), function () {
          var c;c = [];for (var b = this.freeWorkers.length; this.freeWorkers.length <= a ? b < a : b > a; this.freeWorkers.length <= a ? ++b : --b) {
            c.push(b);
          }return c;
        }.apply(this, arguments).forEach(function (a) {
          return function (c) {
            var b;return console.log('spawning worker ' + c), b = new Worker(a.options.workerScript), b.onmessage = function (a) {
              return function (c) {
                return a.activeWorkers.splice(a.activeWorkers.indexOf(b), 1), a.freeWorkers.push(b), a.frameFinished(c.data);
              };
            }(a), a.freeWorkers.push(b);
          };
        }(this)), a;
      }, a.prototype.frameFinished = function (a) {
        return console.log('frame ' + a.index + ' finished - ' + this.activeWorkers.length + ' active'), this.finishedFrames++, this.emit('progress', this.finishedFrames / this.frames.length), this.imageParts[a.index] = a, j(null, this.imageParts) ? this.renderNextFrame() : this.finishRendering();
      }, a.prototype.finishRendering = function () {
        var e, a, k, m, b, d, h;b = 0;for (var f = 0, j = this.imageParts.length; f < j; ++f) {
          a = this.imageParts[f], b += (a.data.length - 1) * a.pageSize + a.cursor;
        }b += a.pageSize - a.cursor, console.log('rendering finished - filesize ' + Math.round(b / 1e3) + 'kb'), e = new Uint8Array(b), d = 0;for (var g = 0, l = this.imageParts.length; g < l; ++g) {
          a = this.imageParts[g];for (var c = 0, i = a.data.length; c < i; ++c) {
            h = a.data[c], k = c, e.set(h, d), k === a.data.length - 1 ? d += a.cursor : d += a.pageSize;
          }
        }return m = new Blob([e], { type: 'image/gif' }), this.emit('finished', m, e);
      }, a.prototype.renderNextFrame = function () {
        var c, a, b;if (this.freeWorkers.length === 0) throw new Error('No free workers');return this.nextFrame >= this.frames.length ? void 0 : (c = this.frames[this.nextFrame++], b = this.freeWorkers.shift(), a = this.getTask(c), console.log('starting frame ' + (a.index + 1) + ' of ' + this.frames.length), this.activeWorkers.push(b), b.postMessage(a));
      }, a.prototype.getContextData = function (a) {
        return a.getImageData(0, 0, this.options.width, this.options.height).data;
      }, a.prototype.getImageData = function (b) {
        var a;return null != this._canvas || (this._canvas = document.createElement('canvas'), this._canvas.width = this.options.width, this._canvas.height = this.options.height), a = this._canvas.getContext('2d'), a.setFill = this.options.background, a.fillRect(0, 0, this.options.width, this.options.height), a.drawImage(b, 0, 0), this.getContextData(a);
      }, a.prototype.getTask = function (a) {
        var c, b;if (c = this.frames.indexOf(a), b = { index: c, last: c === this.frames.length - 1, delay: a.delay, transparent: a.transparent, width: this.options.width, height: this.options.height, quality: this.options.quality, repeat: this.options.repeat, canTransfer: h.name === 'chrome' }, null != a.data) b.data = a.data;else if (null != a.context) b.data = this.getContextData(a.context);else if (null != a.image) b.data = this.getImageData(a.image);else throw new Error('Invalid frame');return b;
      }, a;
    }(f), d.exports = e;
  }), a.define('/browser.coffee', function (f, g, h, i) {
    var a, d, e, c, b;c = navigator.userAgent.toLowerCase(), e = navigator.platform.toLowerCase(), b = c.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0], d = b[1] === 'ie' && document.documentMode, a = { name: b[1] === 'version' ? b[3] : b[1], version: d || parseFloat(b[1] === 'opera' && b[4] ? b[4] : b[2]), platform: { name: c.match(/ip(?:ad|od|hone)/) ? 'ios' : (c.match(/(?:webos|android)/) || e.match(/mac|win|linux/) || ['other'])[0] } }, a[a.name] = !0, a[a.name + parseInt(a.version, 10)] = !0, a.platform[a.platform.name] = !0, f.exports = a;
  }), a.define('events', function (f, e, g, h) {
    b.EventEmitter || (b.EventEmitter = function () {});var a = e.EventEmitter = b.EventEmitter,
        c = typeof Array.isArray === 'function' ? Array.isArray : function (a) {
      return Object.prototype.toString.call(a) === '[object Array]';
    },
        d = 10;a.prototype.setMaxListeners = function (a) {
      this._events || (this._events = {}), this._events.maxListeners = a;
    }, a.prototype.emit = function (f) {
      if (f === 'error' && (!(this._events && this._events.error) || c(this._events.error) && !this._events.error.length)) throw arguments[1] instanceof Error ? arguments[1] : new Error("Uncaught, unspecified 'error' event.");if (!this._events) return !1;var a = this._events[f];if (!a) return !1;if (!(typeof a == 'function')) if (c(a)) {
        var b = Array.prototype.slice.call(arguments, 1),
            e = a.slice();for (var d = 0, g = e.length; d < g; d++) {
          e[d].apply(this, b);
        }return !0;
      } else return !1;switch (arguments.length) {case 1:
          a.call(this);break;case 2:
          a.call(this, arguments[1]);break;case 3:
          a.call(this, arguments[1], arguments[2]);break;default:
          var b = Array.prototype.slice.call(arguments, 1);a.apply(this, b);}return !0;
    }, a.prototype.addListener = function (a, b) {
      if ('function' !== typeof b) throw new Error('addListener only takes instances of Function');if (this._events || (this._events = {}), this.emit('newListener', a, b), !this._events[a]) this._events[a] = b;else if (c(this._events[a])) {
        if (!this._events[a].warned) {
          var e;this._events.maxListeners !== undefined ? e = this._events.maxListeners : e = d, e && e > 0 && this._events[a].length > e && (this._events[a].warned = !0, console.error('(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.', this._events[a].length), console.trace());
        }this._events[a].push(b);
      } else this._events[a] = [this._events[a], b];return this;
    }, a.prototype.on = a.prototype.addListener, a.prototype.once = function (b, c) {
      var a = this;return a.on(b, function d() {
        a.removeListener(b, d), c.apply(this, arguments);
      }), this;
    }, a.prototype.removeListener = function (a, d) {
      if ('function' !== typeof d) throw new Error('removeListener only takes instances of Function');if (!(this._events && this._events[a])) return this;var b = this._events[a];if (c(b)) {
        var e = b.indexOf(d);if (e < 0) return this;b.splice(e, 1), b.length == 0 && delete this._events[a];
      } else this._events[a] === d && delete this._events[a];return this;
    }, a.prototype.removeAllListeners = function (a) {
      return a && this._events && this._events[a] && (this._events[a] = null), this;
    }, a.prototype.listeners = function (a) {
      return this._events || (this._events = {}), this._events[a] || (this._events[a] = []), c(this._events[a]) || (this._events[a] = [this._events[a]]), this._events[a];
    };
  }), c.GIF = a('/gif.coffee');
}).call(this, this);
//# sourceMappingURL=gif.js.map
// gif.js 0.1.6 - https://github.com/jnordberg/gif.js

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*

The MIT License (MIT)

Copyright (c) 2014 Eric Shull

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

/*

BEGIN Timeline Storyteller Modification - March 2017

*/
var d3 = __webpack_require__(0);
var globals = __webpack_require__(2);
var log = __webpack_require__(5)("TimelineStoryteller:saveSvgAsPng");
/*

END Timeline Storyteller Modification

*/

(function () {
  var out$ = typeof exports != 'undefined' && exports || "function" != 'undefined' && {} || this;

  var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [<!ENTITY nbsp "&#160;">]>';

  function isElement(obj) {
    return obj instanceof HTMLElement || obj instanceof SVGElement;
  }

  function requireDomNode(el) {
    if (!isElement(el)) {
      throw new Error('an HTMLElement or SVGElement is required; got ' + el);
    }
  }

  function isExternal(url) {
    return url && url.lastIndexOf('http', 0) == 0 && url.lastIndexOf(window.location.host) == -1;
  }

  function inlineImages(el, callback) {
    requireDomNode(el);

    var images = el.querySelectorAll('image'),
        left = images.length,
        checkDone = function checkDone() {
      if (left === 0) {
        callback();
      }
    };

    checkDone();
    for (var i = 0; i < images.length; i++) {
      (function (image) {
        var href = image.getAttributeNS("http://www.w3.org/1999/xlink", "href");
        if (href) {
          if (isExternal(href.value)) {
            console.warn("Cannot render embedded images linking to external hosts: " + href.value);
            return;
          }
        }
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = new Image();
        img.crossOrigin = "anonymous";
        href = href || image.getAttribute('href');
        if (href) {
          img.src = href;
          img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            image.setAttributeNS("http://www.w3.org/1999/xlink", "href", canvas.toDataURL('image/png'));
            left--;
            checkDone();
          };
          img.onerror = function () {
            log("Could not load " + href);
            left--;
            checkDone();
          };
        } else {
          left--;
          checkDone();
        }
      })(images[i]);
    }
  }

  function styles(el, selectorRemap, modifyStyle) {
    var css = "";
    var sheets = document.styleSheets;
    for (var i = 0; i < sheets.length; i++) {
      try {
        var rules = sheets[i].cssRules;
      } catch (e) {
        console.warn("Stylesheet could not be loaded: " + sheets[i].href);
        continue;
      }

      if (rules != null) {
        for (var j = 0, match; j < rules.length; j++, match = null) {
          var rule = rules[j];
          if (typeof rule.style != "undefined") {
            var selectorText;

            try {
              selectorText = rule.selectorText;
            } catch (err) {
              console.warn('The following CSS rule has an invalid selector: "' + rule + '"', err);
            }

            try {
              if (selectorText) {
                match = el.querySelector(selectorText);
              }
            } catch (err) {
              console.warn('Invalid CSS selector "' + selectorText + '"', err);
            }

            if (match) {
              var selector = selectorRemap ? selectorRemap(rule.selectorText) : rule.selectorText;
              var cssText = modifyStyle ? modifyStyle(rule.style.cssText) : rule.style.cssText;
              css += selector + " { " + cssText + " }\n";
            } else if (rule.cssText.match(/^@font-face/)) {
              css += rule.cssText + '\n';
            }
          }
        }
      }
    }
    return css;
  }

  function getDimension(el, clone, dim) {
    var v = el.viewBox && el.viewBox.baseVal && el.viewBox.baseVal[dim] || clone.getAttribute(dim) !== null && !clone.getAttribute(dim).match(/%$/) && parseInt(clone.getAttribute(dim)) || el.getBoundingClientRect()[dim] || parseInt(clone.style[dim]) || parseInt(window.getComputedStyle(el).getPropertyValue(dim));
    return typeof v === 'undefined' || v === null || isNaN(parseFloat(v)) ? 0 : v;
  }

  function reEncode(data) {
    data = encodeURIComponent(data);
    data = data.replace(/%([0-9A-F]{2})/g, function (match, p1) {
      var c = String.fromCharCode('0x' + p1);
      return c === '%' ? '%25' : c;
    });
    return decodeURIComponent(data);
  }

  out$.prepareSvg = function (el, options, cb) {
    requireDomNode(el);

    options = options || {};
    options.scale = options.scale || 1;
    options.responsive = options.responsive || false;
    var xmlns = "http://www.w3.org/2000/xmlns/";

    inlineImages(el, function () {
      var outer = document.createElement("div");
      var clone = el.cloneNode(true);
      var width, height;
      if (el.tagName == 'svg') {
        width = options.width || getDimension(el, clone, 'width');
        height = options.height || getDimension(el, clone, 'height');
      } else if (el.getBBox) {
        var box = el.getBBox();
        width = box.x + box.width;
        height = box.y + box.height;
        clone.setAttribute('transform', clone.getAttribute('transform').replace(/translate\(.*?\)/, ''));

        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.appendChild(clone);
        clone = svg;
      } else {
        console.error('Attempted to render non-SVG element', el);
        return;
      }

      clone.setAttribute("version", "1.1");
      if (!clone.getAttribute('xmlns')) {
        clone.setAttributeNS(xmlns, "xmlns", "http://www.w3.org/2000/svg");
      }
      if (!clone.getAttribute('xmlns:xlink')) {
        clone.setAttributeNS(xmlns, "xmlns:xlink", "http://www.w3.org/1999/xlink");
      }

      if (options.responsive) {
        clone.removeAttribute('width');
        clone.removeAttribute('height');
        clone.setAttribute('preserveAspectRatio', 'xMinYMin meet');
      } else {
        clone.setAttribute("width", width * options.scale);
        clone.setAttribute("height", height * options.scale);
      }

      clone.setAttribute("viewBox", [options.left || 0, options.top || 0, width, height].join(" "));

      var fos = clone.querySelectorAll('foreignObject > *');
      for (var i = 0; i < fos.length; i++) {
        if (!fos[i].getAttribute('xmlns')) {
          fos[i].setAttributeNS(xmlns, "xmlns", "http://www.w3.org/1999/xhtml");
        }
      }

      outer.appendChild(clone);

      var css = styles(el, options.selectorRemap, options.modifyStyle);
      var s = document.createElement('style');
      s.setAttribute('type', 'text/css');
      s.innerHTML = "<![CDATA[\n" + css + "\n]]>";
      var defs = document.createElement('defs');
      defs.appendChild(s);
      clone.insertBefore(defs, clone.firstChild);

      if (cb) {
        cb(outer.innerHTML, width, height);
      }
    });
  };

  out$.svgAsDataUri = function (el, options, cb) {
    out$.prepareSvg(el, options, function (svg) {
      // svg.replace - https://stackoverflow.com/questions/30273775/namespace-prefix-ns1-for-href-on-tagelement-is-not-defined-setattributens
      var uri = 'data:image/svg+xml;base64,' + window.btoa(reEncode(doctype + svg.replace(/NS\d+:href/g, 'xlink:href')));
      if (cb) {
        cb(uri);
      }
    });
  };

  out$.svgAsPngUri = function (el, options, cb) {
    requireDomNode(el);

    options = options || {};
    options.encoderType = options.encoderType || 'image/png';
    options.encoderOptions = options.encoderOptions || 0.8;

    var convertToPng = function convertToPng(src, w, h) {
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.width = w;
      canvas.height = h;

      if (options.canvg) {
        options.canvg(canvas, src);
      } else {
        context.drawImage(src, -1 * parseInt(d3.select(el).style('margin-left')), -1 * parseInt(d3.select(el).style('margin-top')));
      }

      if (options.backgroundColor) {
        context.globalCompositeOperation = 'destination-over';
        context.fillStyle = options.backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      var png;
      try {
        png = canvas.toDataURL(options.encoderType, options.encoderOptions);
      } catch (e) {
        if (typeof SecurityError !== 'undefined' && e instanceof SecurityError || e.name == "SecurityError") {
          console.error("Rendered SVG images cannot be downloaded in this browser.");
          return;
        } else {
          throw e;
        }
      }
      cb(png);
    };

    if (options.canvg) {
      out$.prepareSvg(el, options, convertToPng);
    } else {
      out$.svgAsDataUri(el, options, function (uri) {
        var image = new Image();

        image.onload = function () {
          convertToPng(image, image.width, image.height);
        };

        image.onerror = function () {
          console.error('There was an error loading the data URI as an image on the following SVG\n', window.atob(uri.slice(26)), '\n', "Open the following link to see browser's diagnosis\n", uri);
        };

        image.src = uri;
      });
    }
  };

  out$.download = function (name, uri) {
    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(uriToBlob(uri), name);
    } else {
      var saveLink = document.createElement('a');
      var downloadSupported = 'download' in saveLink;
      if (downloadSupported) {
        saveLink.download = name;
        saveLink.href = uri;
        saveLink.style.display = 'none';
        document.querySelector(".timeline_storyteller").appendChild(saveLink);
        saveLink.click();
        document.querySelector(".timeline_storyteller").removeChild(saveLink);
      } else {
        window.open(uri, '_temp', 'menubar=no,toolbar=no,status=no');
      }
    }

    /*
     BEGIN Timeline Storyteller Modification - Dec 2016
     */
    var research_copy = {};
    if (!globals.opt_out) {
      research_copy = {
        'timeline_json_data': globals.timeline_json_data,
        'usage_log': globals.usage_log,
        'name': name,
        'image': uri,
        'email_address': globals.email_address,
        'timestamp': new Date().valueOf()
      };
    } else {
      research_copy = {
        'usage_log': globals.usage_log,
        'email_address': globals.email_address,
        'timestamp': new Date().valueOf()
      };
    }
    var research_copy_json = JSON.stringify(research_copy);
    var research_blob = new Blob([research_copy_json], { type: "application/json" });

    log(research_copy_json);

    if (globals.socket) {
      globals.socket.emit('export_event', research_copy_json); // raise an event on the server
    }

    /*
     END Timeline Storyteller Modification
     */
  };

  function uriToBlob(uri) {
    var byteString = window.atob(uri.split(',')[1]);
    var mimeString = uri.split(',')[0].split(':')[1].split(';')[0];
    var buffer = new ArrayBuffer(byteString.length);
    var intArray = new Uint8Array(buffer);
    for (var i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([buffer], { type: mimeString });
  }

  out$.saveSvg = function (el, name, options) {
    requireDomNode(el);

    options = options || {};
    out$.svgAsDataUri(el, options, function (uri) {
      out$.download(name, uri);
    });
  };

  out$.saveSvgAsPng = function (el, name, options) {
    requireDomNode(el);

    options = options || {};
    out$.svgAsPngUri(el, options, function (uri) {
      out$.download(name, uri);
    });
  };

  /*
   BEGIN Timeline Storyteller Modification - Nov 2016
   */

  out$.svgAsPNG = function (el, id, options) {
    requireDomNode(el);

    options = options || {};
    out$.svgAsPngUri(el, options, function (uri) {
      var img = document.createElement('img');
      img.style.display = "none";
      img.id = "gif_frame" + id;
      img.src = uri;
      document.querySelector(".timeline_storyteller").appendChild(img);
      d3.select("#gif_frame" + id).attr('class', 'gif_frame');
    });
  };

  /*
   END Timeline Storyteller Modification
   */

  // if define is defined create as an AMD module
  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
      return out$;
    }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
})();

/***/ }),
/* 27 */
/***/ (function(module, exports) {

/**
 * Japanese UI text, keyed by the English text
 */
module.exports = {
  // view options
  "Timeline representation": "表現",
  "Scale": "スケール",
  "Layout": "レイアウト",
  "Linear": "線形",
  "Radial": "放射状",
  "Spiral": "らせん",
  "Curve": "曲線",
  "Calendar": "カレンダー",
  "Grid": "グリッド",
  "Chronological": "年代順",
  "Relative": "相対",
  "Log": "対数",
  "Sequential": "順序",
  "Collapsed": "圧縮",
  "Unified": "統合",
  "Faceted": "ファセット",
  "Segmented": "区切り",

  // hints for the view options
  "A <span class='rb_hint_rep_highlight'>LINEAR</span> representation is read left-to-right and is the most familiar timeline representation.": "<span class='rb_hint_rep_highlight'>線形</span>は左から右へ読む、最もなじみのある年表の形です。",
  "A <span class='rb_hint_rep_highlight'>RADIAL</span> representation is useful for showing cyclical patterns. It has the added benefit of a square aspect ratio.": "<span class='rb_hint_rep_highlight'>放射状</span>は円形に並べます。周期的なパターンを見せるのに向いています。全体が正方形に収まる利点もあります。",
  "A <span class='rb_hint_rep_highlight'>SPIRAL</span> is a compact and playful way to show a sequence of events. It has a square aspect ratio and is only compatible with a <span class='rb_hint_scale_highlight'>Sequential</span> scale.": "<span class='rb_hint_rep_highlight'>らせん</span>は、出来事の並びをコンパクトに、遊び心をもって見せます。全体が正方形に収まります。<span class='rb_hint_scale_highlight'>順序</span>スケールでだけ使えます。",
  "A <span class='rb_hint_rep_highlight'>CURVE</span> is a playful way to show a sequence of events. It is only compatible with a <span class='rb_hint_scale_highlight'>Sequential</span> scale and a <span class='rb_hint_layout_highlight'>Unified</span> layout.Drag to draw a curve on the canvas; double click the canvas to reset the curve.": "<span class='rb_hint_rep_highlight'>曲線</span>は、自分で描いた線に沿って出来事を並べます。<span class='rb_hint_scale_highlight'>順序</span>スケールと<span class='rb_hint_layout_highlight'>統合</span>レイアウトでだけ使えます。キャンバス上をドラッグして曲線を描き、ダブルクリックで描き直します。",
  "A month-week-day <span class='rb_hint_rep_highlight'>CALENDAR</span> is a familiar representation that is compatible with a <span class='rb_hint_scale_highlight'>Chronological</span> scale and a <span class='rb_hint_layout_highlight'>Segmented</span> layout. This representation does not currently support timelines spanning decades or longer.": "月・週・日の<span class='rb_hint_rep_highlight'>カレンダー</span>です。<span class='rb_hint_scale_highlight'>年代順</span>スケールと<span class='rb_hint_layout_highlight'>区切り</span>レイアウトで使えます。数十年以上にわたる年表には対応していません。",
  "A 10x10 <span class='rb_hint_rep_highlight'>GRID</span> representation is compatible with a <span class='rb_hint_scale_highlight'>Chronological</span> scale and a <span class='rb_hint_layout_highlight'>Segmented</span> layout. This representation is ideal for timelines spanning decades or centuries.": "10×10 のマス目の<span class='rb_hint_rep_highlight'>グリッド</span>です。<span class='rb_hint_scale_highlight'>年代順</span>スケールと<span class='rb_hint_layout_highlight'>区切り</span>レイアウトで使えます。数十年から数世紀にわたる年表に向いています。",
  "A <span class='rb_hint_scale_highlight'>CHRONOLOGICAL</span> scale is useful for showing absolute dates and times, like 2017, or 1999-12-31, or 6:37 PM.": "<span class='rb_hint_scale_highlight'>年代順</span>は、2017年、1999-12-31、午後6時37分のような、実際の日付や時刻を示すのに向いています。",
  "A <span class='rb_hint_scale_highlight'>RELATIVE</span> scale is useful when comparing <span class='rb_hint_layout_highlight'>Faceted</span> timelines with a common baseline at time 'zero'.For example, consider a timeline of person 'A' who lived between 1940 to 2010 and person 'B' who lived between 1720 and 1790. A <span class='rb_hint_scale_highlight'>Relative</span> scale in this case would span from 0 to 70 years.": "<span class='rb_hint_scale_highlight'>相対</span>は、<span class='rb_hint_layout_highlight'>ファセット</span>レイアウトの複数の年表を、共通の起点「ゼロ」にそろえて比べるのに向いています。たとえば1940年から2010年まで生きた人物と、1720年から1790年まで生きた人物を並べると、どちらも0年から70年の目盛りで比べられます。",
  "A base-10 <span class='rb_hint_scale_highlight'>LOGARITHMIC</span> scale is useful for long-spanning timelines and a skewed distributions of events.  This scale is compatible with a <span class='rb_hint_rep_highlight'>Linear</span> representation.": "10を底とする<span class='rb_hint_scale_highlight'>対数</span>の目盛りです。長い期間にわたり、出来事の分布が偏っている年表に向いています。<span class='rb_hint_rep_highlight'>線形</span>の表現で使えます。",
  "A <span class='rb_hint_scale_highlight'>SEQUENTIAL</span> scale is useful for showing simply the order and number of events.": "<span class='rb_hint_scale_highlight'>順序</span>は、出来事の順序と数だけを示します。",
  "A <span class='rb_hint_scale_highlight'>COLLAPSED</span> scale is a hybrid between <span class='rb_hint_scale_highlight'>Sequential</span> and <span class='rb_hint_scale_highlight'>Chronological</span>, and is useful for showing uneven distributions of events. It is compatible with a <span class='rb_hint_rep_highlight'>Linear</span> representation and <span class='rb_hint_layout_highlight'>Unified</span> layout. The duration between events is encoded as the length of bars.": "<span class='rb_hint_scale_highlight'>圧縮</span>は、<span class='rb_hint_scale_highlight'>順序</span>と<span class='rb_hint_scale_highlight'>年代順</span>の中間です。出来事の分布が不均等な年表に向いています。出来事と出来事の間隔を棒の長さで表します。<span class='rb_hint_rep_highlight'>線形</span>の表現と<span class='rb_hint_layout_highlight'>統合</span>レイアウトで使えます。",
  "A <span class='rb_hint_layout_highlight'>UNIFIED</span> layout is a single uninterrupted timeline and is useful when your data contains no facets.": "<span class='rb_hint_layout_highlight'>統合</span>は、途切れのない1本の年表です。データにファセットがないときに向いています。",
  "A <span class='rb_hint_layout_highlight'>FACETED</span> layout is useful when you have multiple timelines to compare.": "<span class='rb_hint_layout_highlight'>ファセット</span>は、ファセットごとに年表を分けて並べます。複数の年表を比べたいときに向いています。",
  "A <span class='rb_hint_layout_highlight'>SEGMENTED</span> layout splits a timeline into meaningful segments like centuries or days, depending on the extent of your timeline.It is compatible with a <span class='rb_hint_scale_highlight'>Chronological</span> scale and is useful for showing patterns or differences across segments, such as periodicity.": "<span class='rb_hint_layout_highlight'>区切り</span>は、年表を世紀や日のような意味のある単位に分けます。単位は年表の期間に応じて決まります。<span class='rb_hint_scale_highlight'>年代順</span>スケールで使え、周期性のような、区切りごとのパターンや違いを見せるのに向いています。",

  // import panel
  "Load timeline data": "年表データを読み込む",
  "Load timeline story": "ストーリーを読み込む",
  "Load Demo Data": "デモデータを読み込む",
  "Load demo dataset": "デモデータを読み込む",
  "Load from JSON": "JSON から読み込む",
  "Load from CSV": "CSV から読み込む",
  "Load Demo Story": "デモのストーリーを読み込む",
  "Load Saved Story": "保存したストーリーを読み込む",
  "Hide import panel": "読み込みパネルを閉じる",
  "Loading data...": "データを読み込んでいます...",
  "An expressive visual storytelling environment for presenting timelines.": "年表をさまざまな形で見せ、ストーリーとして語るためのツールです。",
  "A note about privacy": "プライバシーについて",
  "Your data is processed in your browser and is not uploaded to a server.": "データはブラウザの中で処理され、サーバーには送信されません。",
  "About this data:": "このデータについて:",
  "Cardinality & extent": "件数と期間",
  "{count} unique events spanning {range}": "{count} 件のイベント、期間は {range}",
  "Granularity": "区切りの単位",
  "Event categories": "カテゴリ",
  "Note": "メモ",
  "click on the swatches to assign custom colors to categories.": "色見本をクリックすると、カテゴリの色を変えられます。",
  "Timeline facets": "ファセット",
  "(none)": "(なし)",
  "Draw Timeline": "この年表を描く",
  "Draw this timeline": "この年表を描く",
  "hours": "時間",
  "days": "日",
  "weeks": "週",
  "months": "月",
  "years": "年",
  "decades": "10年",
  "centuries": "世紀",
  "millenia": "千年",
  "epochs": "時代",

  // side menu
  "Open": "開く",
  "Annotate": "注釈",
  "Add caption": "キャプションを追加",
  "Add Caption": "キャプションを追加",
  "Caption text": "キャプションの文章",
  "Add image": "画像を追加",
  "Clear annotations, captions, & images": "ラベル・キャプション・画像を消す",
  "Filter": "絞り込み",
  "Export": "書き出し",

  // filter panel
  "Filter Options": "絞り込み",
  "Filter Mode:": "方法:",
  "Emphasize": "強調",
  "Hide": "隠す",
  "Category": "カテゴリ",
  "Facet": "ファセット",
  "Segment": "区切り",
  "( All )": "(すべて)",
  "Hide filter panel": "絞り込みパネルを閉じる",
  "Filter by event category": "カテゴリで絞り込む",
  "Filter by event facet": "ファセットで絞り込む",
  "Filter by chronological segment": "区切りで絞り込む",
  "No data available for the selected set of filters.": "選択した条件に合うデータがありません。",

  // export panel
  "Export options": "書き出し",
  "Hide export panel": "書き出しパネルを閉じる",
  "Export PNG": "PNG で書き出す",
  "Export SVG": "SVG で書き出す",
  "Export animated GIF": "アニメーション GIF で書き出す",
  "Export story": "ストーリーを書き出す",

  // scenes
  "Record Scene": "シーンを記録",
  "Previous Scene": "前のシーン",
  "Next Scene": "次のシーン",
  "Toggle Playback Mode": "再生モードの切り替え",
  "Recorded timeline scenes will appear here.": "記録したシーンがここに並びます。",
  "Delete Scene": "シーンを削除",
  "Scene {number}": "シーン {number}",
  "Scene {number} of {total}": "シーン {number} / {total}",

  // legend
  "LEGEND": "凡例",
  "Click on a color swatch to select a custom color for that category.": "色見本をクリックすると、そのカテゴリの色を選べます。",
  "Expand / collapse legend.": "凡例を開く / たたむ",

  // labels, captions, images
  "Resize label": "ラベルの大きさを変える",
  "Remove label": "ラベルを消す",
  "Resize caption": "キャプションの大きさを変える",
  "Remove caption": "キャプションを消す",
  "Resize image": "画像の大きさを変える",
  "Remove image": "画像を消す",
  "Add from image URL": "画像の URL から追加",
  "Image URL": "画像の URL",
  "If true, this will allow for offline playback.": "チェックすると、オフラインでも再生できます。",
  "Keep Offline?": "オフライン用に保存する",
  "Add from your computer": "パソコンから追加",
  "Drop files here": "ここにファイルをドロップ",
  "OR": "または",
  "No files selected": "ファイルが選択されていません",
  "Options": "オプション",
  "Smaller images should be preferred as larger images increase the final size of the story, this will automatically resize your images to the given size": "大きな画像はストーリーのファイルを大きくします。チェックすると、指定した大きさに自動で縮小します。",
  "Resize To:": "縮小する大きさ:",
  "Width": "幅",
  "Height": "高さ",
  "Add Image": "画像を追加",
  "Could not save image. ": "画像を保存できませんでした。",
  "The image server is not set up correctly.": "画像のサーバーが正しく設定されていません。",
  "The image server does not allow for the saving of images.": "画像のサーバーが画像の保存を許可していません。",
  "Try disabling \"Keep Offline\" and \"Resize To\" options.": "「オフライン用に保存する」と「縮小する大きさ」のチェックを外して試してください。",

  // footer and help
  "About & getting started": "使い方",
  "Based on {link}, © Microsoft Corporation, MIT License": "{link}(© Microsoft Corporation、MIT License)をもとにしています",
  "Timeline Storyteller on GitHub": "GitHub の Timeline Storyteller",

  // units on the time axis
  " hours": " 時間",
  " days": " 日",
  " months": " か月",
  " years": " 年"
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var time = __webpack_require__(7);
var d3 = __webpack_require__(0);
var moment = __webpack_require__(6);
var globals = __webpack_require__(2);
var arcTween = __webpack_require__(1).arcTween;
var removeOnEnd = __webpack_require__(1).removeOnEnd;

/**

radialAxis: //a reusable radial axis

**/

d3.radialAxis = function (unit_width) {
  var radial_axis_scale = d3.scaleLinear().range([0, 2 * Math.PI]),
      radial_axis_units = "Chronological",
      x_pos = 0,
      y_pos = 0,
      duration = 1000,
      final_quantile = 0,
      track_bounds = 0,
      bc_origin = false,
      longer_than_a_day = true,
      num_ticks = 0;

  function radialAxis(selection) {
    selection.each(function (data) {
      var g = d3.select(this);

      if (moment(data[0]).year() <= 0) {
        bc_origin = true;
      } else {
        bc_origin = false;
      }

      num_ticks = data.length;

      if (globals.segment_granularity === "days" && time.hour.count(time.day.floor(data[0]), time.day.ceil(data[num_ticks - 1])) > 24) {
        longer_than_a_day = true;
      } else {
        longer_than_a_day = false;
      }

      // stash the new scale and quantiles
      this.__chart__ = radial_axis_scale;

      // concentric track circles
      var radial_axis_tracks_join = g.selectAll(".radial_tracks").data(d3.range(-1, track_bounds));

      var radial_axis_tracks_enter = radial_axis_tracks_join.enter().append("g").attr("class", "radial_tracks");

      radial_axis_tracks_enter.append("path").attr("class", "rad_track").attr("id", function (d, i) {
        return "rad_track" + i;
      }).attr("transform", function () {
        return "translate(" + x_pos + " ," + y_pos + ")";
      }).style("opacity", 0).attr("d", d3.arc().innerRadius(function () {
        return globals.centre_radius;
      }).outerRadius(function () {
        return globals.centre_radius;
      }).startAngle(0).endAngle(radial_axis_scale(final_quantile)));

      var radial_axis_tracks = radial_axis_tracks_enter.merge(radial_axis_tracks_join);

      var radial_axis_tracks_update = radial_axis_tracks.transition().duration(duration);

      var radial_axis_tracks_delayed_update = radial_axis_tracks.transition().delay(function (d, i) {
        return duration + i / track_bounds * duration;
      }).duration(duration);

      var radial_axis_tracks_exit = radial_axis_tracks_join.exit().transition().delay(duration).duration(duration).call(removeOnEnd);

      radial_axis_tracks_update.selectAll(".rad_track").attr("transform", function () {
        return "translate(" + x_pos + " ," + y_pos + ")";
      });

      radial_axis_tracks_delayed_update.selectAll(".rad_track").style("opacity", 1).attrTween("d", arcTween(d3.arc().innerRadius(function (d) {
        return globals.centre_radius + d * globals.track_height;
      }).outerRadius(function (d) {
        return globals.centre_radius + d * globals.track_height;
      }).startAngle(0).endAngle(radial_axis_scale(final_quantile))));

      radial_axis_tracks_exit.selectAll(".rad_track").attr("transform", function () {
        return "translate(" + x_pos + " ," + y_pos + ")";
      }).attrTween("d", arcTween(d3.arc().innerRadius(function () {
        return globals.centre_radius;
      }).outerRadius(function () {
        return globals.centre_radius;
      }).startAngle(0).endAngle(radial_axis_scale(final_quantile))));

      // radial ticks
      var radial_axis_tick_join = g.selectAll(".radial_axis_tick").data(data);

      var radial_axis_tick_enter = radial_axis_tick_join.enter().append("g").attr("class", "radial_axis_tick");

      var radial_axis_tick_exit = radial_axis_tick_join.exit().transition().duration(duration).call(removeOnEnd);

      var radial_axis_tick = radial_axis_tick_enter.merge(radial_axis_tick_join);

      radial_axis_tick_enter.append("path").attr("class", "radial_axis_tick_path").style("opacity", 0).attr("transform", function () {
        return "translate(" + x_pos + " ," + y_pos + ")";
      });

      radial_axis_tick_enter.append("text").attr("class", "radial_axis_tick_label").attr("text-anchor", "middle").attr("dominant-baseline", "central").style("opacity", 0).text(function () {
        return "";
      }).attr("transform", function () {
        return "translate(" + x_pos + " ," + y_pos + ")";
      });

      var radial_axis_tick_update = radial_axis_tick.transition().duration(duration);

      var radial_axis_tick_delayed_update = radial_axis_tick.transition().delay(function (d, i) {
        return duration + i / data.length * duration;
      }).duration(duration);

      radial_axis_tick_update.select("path").attr("transform", function () {
        return "translate(" + x_pos + " ," + y_pos + ")";
      });

      radial_axis_tick_delayed_update.select("path").style("opacity", 1).attrTween("d", arcTween(d3.arc().innerRadius(globals.centre_radius - globals.track_height).outerRadius(globals.centre_radius + track_bounds * globals.track_height - 0.25 * unit_width).startAngle(function (d) {
        return radial_axis_scale(d);
      }).endAngle(function (d) {
        return radial_axis_scale(d);
      })));

      radial_axis_tick_update.select("text").style("opacity", 0).text("").attr("transform", function () {
        return "translate(" + x_pos + " ," + y_pos + ")";
      });

      radial_axis_tick_delayed_update.select("text").style("opacity", 1).attr("x", function (d) {
        return (globals.centre_radius + track_bounds * globals.track_height + 0.5 * unit_width) * Math.sin(radial_axis_scale(d));
      }).attr("y", function (d) {
        return -1 * (globals.centre_radius + track_bounds * globals.track_height + 0.5 * unit_width) * Math.cos(radial_axis_scale(d));
      }).text(function (d, i) {
        return formatTick(d, i);
      }).attr("transform", function (d) {
        var angle = radial_axis_scale(d) * (180 / Math.PI);
        if (angle > 90 && angle <= 180) {
          angle = angle + 180;
        } else if (angle < 270 && angle > 180) {
          angle = angle - 180;
        }
        return "translate(" + x_pos + " ," + y_pos + ")rotate(" + angle + "," + (globals.centre_radius + track_bounds * globals.track_height + 0.5 * unit_width) * Math.sin(radial_axis_scale(d)) + " ," + -1 * (globals.centre_radius + track_bounds * globals.track_height + 0.5 * unit_width) * Math.cos(radial_axis_scale(d)) + ")";
      });

      radial_axis_tick_exit.select("path").attrTween("d", arcTween(d3.arc().innerRadius(globals.centre_radius).outerRadius(globals.centre_radius).startAngle(function (d) {
        return radial_axis_scale(d);
      }).endAngle(function (d) {
        return radial_axis_scale(d);
      })));

      radial_axis_tick_exit.select("text").text(function () {
        return "";
      });
    });
    d3.timerFlush();
  }

  function formatTick(d, i) {
    var radial_axis_tick_label = d;

    if (radial_axis_units === "Sequential") {
      radial_axis_tick_label = d;
    } else if (radial_axis_units === "Chronological") {
      switch (globals.segment_granularity) {
        case "days":
          if (i === num_ticks - 1) {
            radial_axis_tick_label = "";
          } else if (longer_than_a_day) {
            radial_axis_tick_label = moment(d).format("MMM D hA");
          } else {
            radial_axis_tick_label = moment(d).format("hA");
          }
          break;
        case "weeks":
          radial_axis_tick_label = moment(d).format("MMM D");
          break;
        case "months":
          radial_axis_tick_label = moment(d).format("MMM 'YY");
          break;
        case "years":
          if (moment(d).year() < 0) {
            radial_axis_tick_label = -1 * moment(d).year() + " BC";
          } else {
            radial_axis_tick_label = +moment(d).year();
            if (bc_origin) {
              radial_axis_tick_label += " AD";
            }
          }
          break;
        case "decades":
          if (moment(d).year() < 0) {
            radial_axis_tick_label = -1 * moment(d).year() + " BC";
          } else {
            radial_axis_tick_label = +moment(d).year();
            if (bc_origin) {
              radial_axis_tick_label += " AD";
            }
          }
          break;
        case "centuries":
          if (moment(d).year() < 0) {
            radial_axis_tick_label = -1 * moment(d).year() + " BC";
          } else {
            radial_axis_tick_label = +moment(d).year();
            if (bc_origin) {
              radial_axis_tick_label += " AD";
            }
          }
          break;
        case "millenia":
          if (moment(d).year() < 0) {
            radial_axis_tick_label = -1 * moment(d).year() + " BC";
          } else {
            radial_axis_tick_label = +moment(d).year();
            if (bc_origin) {
              radial_axis_tick_label += " AD";
            }
          }
          break;
        case "epochs":
          radial_axis_tick_label = globals.formatAbbreviation(d);
          break;
        default:
          break;
      }
    } else if (radial_axis_units === "Segments") {
      switch (globals.segment_granularity) {
        case "days":
          radial_axis_tick_label = moment().hour(d).format("hA");
          break;
        case "weeks":
          radial_axis_tick_label = moment().weekday(d).format("ddd");
          break;
        case "months":
          if ((d - 1) % 7 !== 0) {
            radial_axis_tick_label = "";
          } else {
            radial_axis_tick_label = moment().date(d).format("Do");
          }
          break;
        case "years":
          if ((d - 1) % 4 === 0) {
            radial_axis_tick_label = "";
          } else {
            radial_axis_tick_label = moment().week(d + 1).format("MMM");
          }
          break;
        case "decades":
          radial_axis_tick_label = d / 12 + " years";
          break;
        case "centuries":
          radial_axis_tick_label = d + " years";
          break;
        case "millenia":
          radial_axis_tick_label = d + " years";
          break;
        case "epochs":
          radial_axis_tick_label = "";
          break;
        default:
          break;
      }
      if (i === num_ticks - 1) {
        radial_axis_tick_label = "";
      }
    } else if (radial_axis_units === "Relative") {
      if (globals.date_granularity === "epochs") {
        radial_axis_tick_label = globals.formatAbbreviation(d);
      } else if (globals.max_end_age / 86400000 > 1000) {
        radial_axis_tick_label = Math.round(d / 31536000730) + " years";
      } else if (globals.max_end_age / 86400000 > 120) {
        radial_axis_tick_label = Math.round(d / 2628000000) + " months";
      } else if (globals.max_end_age / 86400000 > 2) {
        radial_axis_tick_label = Math.round(d / 86400000) + " days";
      } else {
        radial_axis_tick_label = Math.round(d / 3600000) + " hours";
      }
    }
    return radial_axis_tick_label;
  }

  radialAxis.x_pos = function (x) {
    if (!arguments.length) {
      return x_pos;
    }
    x_pos = x;
    return radialAxis;
  };

  radialAxis.y_pos = function (x) {
    if (!arguments.length) {
      return y_pos;
    }
    y_pos = x;
    return radialAxis;
  };

  radialAxis.duration = function (x) {
    if (!arguments.length) {
      return duration;
    }
    duration = x;
    return radialAxis;
  };

  radialAxis.radial_axis_scale = function (x) {
    if (!arguments.length) {
      return radial_axis_scale;
    }
    radial_axis_scale = x;
    return radialAxis;
  };

  radialAxis.radial_axis_units = function (x) {
    if (!arguments.length) {
      return radial_axis_units;
    }
    radial_axis_units = x;
    return radialAxis;
  };

  radialAxis.final_quantile = function (x) {
    if (!arguments.length) {
      return final_quantile;
    }
    final_quantile = x;
    return radialAxis;
  };

  radialAxis.track_bounds = function (x) {
    if (!arguments.length) {
      return track_bounds;
    }
    track_bounds = x;
    return radialAxis;
  };

  radialAxis.bc_origin = function (x) {
    if (!arguments.length) {
      return bc_origin;
    }
    bc_origin = x;
    return radialAxis;
  };

  return radialAxis;
};

module.exports = d3.radialAxis;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var toElement = __webpack_require__(30);
var tr = __webpack_require__(4);

/**
 * Template for the add image popup
 * @returns {HTMLElement} The add image popup element
 */
module.exports = function () {
  return toElement("\n  <div id=\"image_div\" class=\"add_image_popup annotation_div control_div\" style=\"display:none\">\n    <div class=\"image_div_container\">\n      <div class=\"image_div_error\" style=\"display:none\"></div>\n      <div class=\"image_url_add_container\">\n        <h4>" + tr("Add from image URL") + "</h4>\n        <input type=\"text\" placeholder=\"" + tr("Image URL") + "\" class=\"text_input add_image_link\">\n        <div class=\"offline_option_container\">\n          <label title=\"" + tr("If true, this will allow for offline playback.") + "\">\n            " + tr("Keep Offline?") + "\n            <input type=\"checkbox\" class=\"offline_enabled_cb\" checked>\n          </label>\n        </div>\n      </div>\n      <div class=\"image_local_add_container\">\n        <hr/>\n        <h4>" + tr("Add from your computer") + "</h4>\n        <div class=\"file_selection_container\">\n          <div class=\"image_local_add_drop_zone\">" + tr("Drop files here") + "</div>\n          <h5>" + tr("OR") + "</h5>\n          <input type=\"file\" class=\"add_image_file_chooser\" accept=\".jpg,.jpeg,.png,.gif\">\n        </div>\n        <div class=\"selected_files_container\" style=\"display:none\">\n          " + tr("No files selected") + "\n        </div>\n      </div>\n      <div class=\"options_container\">\n        <hr/>\n        <h4>" + tr("Options") + "</h4>\n        <div class=\"resize_options\">\n          <label title=\"" + tr("Smaller images should be preferred as larger images increase the final size of the story, this will automatically resize your images to the given size") + "\">\n            <input class=\"resize_enabled_cb\" type=\"checkbox\" checked>\n            <span>" + tr("Resize To:") + "&nbsp;</span>\n          </label>\n          <input type=\"number\" class=\"resize_width\" placeholder=\"" + tr("Width") + "\" value=400>\n          x\n          <input type=\"number\" class=\"resize_height\" placeholder=\"" + tr("Height") + "\" value=400>\n        </div>\n      </div>\n      <div>\n        <button class=\"add_image_btn\" title=\"" + tr("Add Image") + "\">OK</button>\n      </div>\n    </div>\n  </div>\n");
};

/***/ }),
/* 30 */
/***/ (function(module, exports) {

/**
 * Creates an html element from the given html
 * @param {string} html The html for the element
 * @returns {HTMLElement} The element that was created from the html
 */
module.exports = function (html) {
  var tmpEle = document.createElement("div");
  tmpEle.innerHTML = html.trim().replace(/\n/g, "");
  return tmpEle.firstChild;
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÂ\u0000\u0000\u000eÂ\u0001\u0015(J\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0001ÑIDATXGÍÖ!rA\u0018\u0005`\r&  \n\u0006ý\u000f\u001a,\nZ,\u001aL*6I\u0010Ä¤É¤bU\u0004ÿëì;\u0017ÞåÎ3{åÙð9÷ïcÙ1æ_¡aL41Ñ0&\u001aÆDÃh\u0018\u0013\rc¢!Úï÷f:Õje>D¼Ç\u001c\u000ed»\\.Íûý÷\u0014\rÕn·FÂ.:Ntga7Öóùô\u000e!Ü¤a\u0017a_ÑÐÂ\u0003!¸³°\u0013;Ë\u000b\u0014C^¯Ôóm¯×«¿Å@á8d4\u001aI=ß¶×ëù[\f\u0014CÍ¦ÔómËå²¿Å@J%ï\u0000S©T¤înkµ\u001aí¢b±èm\u0007Â\u0003L»Ýj¾mµZ*ì0@õzÝ;féáFµZ-ºQÃáPjîÆy|ãx<:G¿ùí«.³½ßï\u0012»\u001dçñ­ôQü%kë\u0005ßÐóù\\¼\u0013¢Ûñx,Oòi4\u001aÉA\u000b¿eét:[\u001aØÿ/y\u0018K·ýÅ@Ã\u0010=¸ÝnåÉ;!º],\u0016òä\u001d\u001e\\¯×òä\u0010ÝÎf3yò¢aÚãñHY·ÛM\"ÞcÒÿÄçóY\"ÞK£¡êv»¿\u0007ñ[Á`kKC«ßï'Ç6<y'd2$[ûg+~ËBÃh\u0018\u0013\rc¢aL41Ñ0\u001eSø\u0001)`êÛÛã¡\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÃ\u0000\u0000\u000eÃ\u0001Ço¨d\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0002\u0002IDATXGíÍKTQ\u0018Æg!äf\\\u001b·n\u0002!ÚBé¢ Aú\u001fZ´qQ8AË¶!:3~yg\u0012ÉE¦B\tÍ¦rFJ*G-6êxÇ\u000ft(æ¶Py<ïò½çx®n<.î\u001fç¹ïû\u0004\u0000\\*¥I¥I¥I¤â äàÓÆ\u001ef7÷Ñ@7ùâ?¡p?K¢ã§ÎÄ©Ð÷ÞÜ\u0018¹ô0\u0005\"¹ºÎåmôüÒÓMïu¡p?0z\u0013ãw=¡»ÙüwÙw\u0017ãk6ú~ï EOD\u0010]Ü\u0010\n÷+Rõ¨hñî2ù\u001fÏ\u0002q²þ \rþ /üA^yPê\u001cÂ9yP0uG9ÀMP\fú¼9/ù,\u0010ïÿØx³Ñ±TÐÒ¾X@|I\u001e\u0014\u0018©Ád-Êu§BßéÎþ»+ûîÂ4ÊÒ$ÊÒ$ÊÒ$RnO£·¦\u000fÑ[ýZÂ7\"H=z#\u0014î\u001f>\u0016¯§AA ÄÝÿýä³@¼{2{\u0016\u0012M¯µÄ\u001b\u0013xÕl\tû\b]\u0005^\\÷&t\rÎÊ\u0017Ég\nMyõ0.\u0014îÓ\u0003Ü<«³|\u0016\bËgð\u0007¹|\u0016\bËgj;Ç \u0007\u00170èmë\u0004\u0006j\u0007\u0011k\u0018Ö2t;Øýa¡p\u001f­eÀó*oÄ³|\u0016b¡ìà\u001c¾Zß´dæ`/ÛBá~)\u001dó¡\u000bÎL·.>FpL¶Ëgá2 ,M¢,M¢,ÍÀ\tfK\u0019\\t\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000b\u0011\u0000\u0000\u000b\u0011\u0001d_\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0001IDATXGíÖ=,ÅP\u0018áú\r\u0011\u0004\t\u0012\u0006&\u0016\u0013\u001b\u001b\u001bFFfVffff\u0012A$\u0006\u0003E\u0018ü\f\u001800X\f\u0012\u0012ñïýn4iN¾Û[Ú\u001aÎ<Ã½ÑÓ£êk=ËåJ¶nl¢>÷)ãzñ/\u001c£\tÕGÈf|çhEê\râ\u0019ÁÍø®ÐÔ\u001aÁ\u000b´ÍønÑÄ\u001bÃ;´MvaU1&Qûdß\u0004> ÜtfDV\u0015ÈA[¨MSøybÍ!\u001a\u0010Y9Ö\u0010<X.k\rÂAð0{¨Edá¥-r\u0000m¨\u0015a\u000eÚ1mX]ñjì@[ÄwàPûl\u0001ÚÏj6`uO@.£¶é\u00022Ôä¥ïl¬¢\fÖâ\u0015Úb¦k¬\u001bßYü\u0002\u00057|5®EÈ6v\u0003x¶x¡æ!7ý¯ëÿtk\u0016Z\u000fî¡,\fÆi$R\u0017î X#\fyt$Z\u0007n m è\rãH¥6\\BÛ×\fyÝHµ\u0016ÁÜ!dR#àoFÆL«Ã>d,ÈËû¿H\u001eÄò\u001fèr¹òçyßQØ\u0012z\u0006BPw\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000b\u0010\u0000\u0000\u000b\u0010\u0001­#½u\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.134\u0003[z\u0000\u0000\u0003\u0013IDATXGÍ=hSQ\u0018OþJ1Á\u000e©IZ\t¨\u0018\u0012]8((T¡\"\u000e\u0015jR-]\u001c\u0004SbpJ\nèâ¢8\u0019×\"H\u0017AqÐEt\u0010ü\u0019*\bºÕ¿Á¥x|¿sËwoÎmOiÃõ§9ßû{ÎÛ{ÛTH)ÿ+f\u0018Í 1Ab4Äh\u0006Ù\u0014b\u000f8\u0007îóÚ;\u000eÊyÇÀMÆQÖKëùIp\u0015\\\u0004§Á6ÞWs:\f!Î\u0000\u001a\u0010ûA\u0015ÄÁ%pÍ3·\u000eæÁ¦ÀzgÁW°üK@;Á'0\th=2w9}5ÇU\b±\u0003ü\u0005aîë_ \u001bÜc½\u000fà\u0014xÆ<\u0015Õ÷À¤S+ÏU\bq\u0002Üâ\u001eëù\u0005z\b\u000e\u0010Ì/÷zü\u000blÑãå@Ðvð\u0016\f9×)ßU\bq\u0005Ô¸Çz~\u0016À#MQûwACo\u0003u\u0017!\nô\u0007Pñ\u001a\u001ctÖrp\u0017í³½Ï=Ö³>2~p~kß¡\u0007`_§|W!D\u0004|\u0001G¸¯{V :öy÷\u0006\u001c\u0002Þ÷Ð\u001c¨»æòB\u0019Bì\u0003¯\u0000\u0015\u000e\u0000\u0005úÆ¸\f(\u0010÷èØ>gMúÓ§Ñ\u001b(\u000f0dsyÁè1õºÑ\f\u0012+.ì\u0016V2]Ø-6D]Yt=Ú0ß%ýcrjµ*§§§iõ2µ\u001aF¬V«-Ëeêõ´]s B¡ Óéôªär¹ç4ß7P<\u001e§U9)àè%à½,0\u0006äØØXqpppÀ¾¾¾¡|>¯.ò\r\u0004ñ\re±Xä»¸zô\u001b*Ó'\u0010îè\u001eû)³æ@½½½Ë»B!WO×Ö\"\b=Ýù$«@\u0017Úèïïç\u000bLñPNXÛ@$¼\u0007ÓzH²\n¤T¯×7ãEf³Ù\u0017m§C\u0012ï·Ïj°B V«+JôÉ$û@Lf+^äøøøî¶Ó!922²W\rV\b0?hÜ¶:d\u001f(LÊJ¥òT^½\u001b\u001d\u001d¥ü\u00025ÍôJD£Ñd&\u0012Ãº¦/ûÖfgg=3ÚJ¥RK8N÷Î>Âá°\nã0<<ü×àÉªb±Ø¢\u001a\u0018»¶811Aÿ\b¸ä\u0017È\u0006ë#[Lp4®ýÀ³Ìü¤^LÖª®\u0005ZO(%ïbAc4Äh\u0006\u0014ÿ\u0000\tã°dv4c\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÁ\u0000\u0000\u000eÁ\u0001¸kí\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0001IDATXGÍ±®@\u0010E!¡§Ä/°£C-!`bí? Ñ\u0012\u0013þ\u001f·ã\u000bdwr\u0017WÌ+NBÎÜuo\u0000þ\u0015Pj\u0002¥&Pj\u0002¥&Pj\u0002¥&Pj\u0002¥&P\"Ú¶¥×ëe\u000eñÜ\u0007¯¹ßïæ\u0010Ï%PJú¾7ÉàÃR\u001d×É\u000f(%Ëeúá¥¥ì2û\u0012q>\ræJ=O'{:ÆY\t>¦q6z<\u001eF»®ë\f¯9 C²gòÌ¬-Ã@ù\r»TYFQp»Ý&·µ\f\u0003å\u0012¢øl¼Ûí(MS§L]×&×}\u0003Ê¥\u001c\u000e\u0007JÄ)s<\u001eÍ\bç\u0000åRò<§ý~Oa\u0018ê\u0017ªªø²eYFq\u001cS\u0014ES©­÷\u000f\u0003å7Æp!>S×ëu*ôRPÎaÿÃa\u0018þÉ§óRPúeÞï·ÑnY[\nJ\u0004?þíÖ¼:øµ#3> ly¹ÊRrî\u0003JÉÖÏ\u000f»ù\u0012Á\u001fYkÊp)þ¸Þ\u0007@©\t@©\t@©\t@©\tzPð\u0003ËKéú\t\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÁ\u0000\u0000\u000eÁ\u0001¸kí\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0002~IDATXGí=k*A\u0014h\n\u0011R\t& \u0004!F`4ø\u0001ZØh\u0017¢±\u0010L¥\u0012°³\t¢ ¢FP\u000b?\"éò\u0003´PÏ\u0019e\u001cqÃ\u001dðrðÀÎ³;ïyÕeU\u0007\u0000ÿ\u0014¨<%¨<%¨TÏçÁd2Ñhü+\f\u0006\u0003\\\\\\@¿ß'±ø,\n*9H\\¡Î`0 ñøLTrÄ YX­V\u0012`&&9b,Ìf3?0\u0013\u001c1H\u0016\u0016Ä\u001fI\u0018$ÿ·ÐÓÓ\u0013ìv;Øl6P,\u0016³Ûíðþþ\u000eëõ\u001aÍ&s`³Ù}µZ\r²Ù¬²R(\u0014\nÁl6³³3¶Ïç@\u001f\u000bN\u0007É$s¥R\tÊå2T*\u0015xyyQö~||(Ç\u0014)ªÕ*+¥v\\.\u0007Óé\u0014\u001e\u001f\u001fáòò9ú\u0010\\.ìøáá\u0001Z­ÖÞ\u001e)^__Áçó)k5ô¹R(\u0014È\u0016`\u0012uÅ\u0002Ün7\fCp¹\\{×K)J¥ ^¯+ëÑh\u0004ét\u001a¾¾¾Ø\u0000ê\u001c\u000e\u0007L&\u0013v\u001cÇ¡ÑhÀv»Uöp¤\u0014¢ÐûÞÔ\u0014úD],\u0016cCékµZA4\u001aU®§/úò5GZ!^¯g÷è¯®®¾¹óóóo\"µ\f~\u000b\u001dã·Ð1~\u000biAÅA%G\fÑÊÍÍ\rÙg\u001e\u0003\u001cqVz½\u001eÙ\u000eºD\"\u0001Lfûû{\u0018Çì<\u0006*9â ­t»]V\n;\u0017\b\u0004H4>J\u0018¦\u0015Z~\n¢\u000fÃ$\u0016ÅA%G\fÔ\nV(\u0018\fH|\u001aTrÔ?A,twwGâð\u0019\"¨äðÀ¢.ä÷ûI\u0014JÎóóóÞ ­´Ûmx{{\u0003§ÓIbðìC R\r}····àñxÀëõ\u001eåúúýk\u0014s´ÊSÊSÊÓ\u0001º?û¸oê+µ\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0002\u0000\u0000\u0000nb\u000fÏ\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÁ\u0000\u0000\u000eÁ\u0001¸kí\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.134\u0003[z\u0000\u0000\u0001=IDATXGí=0\u0014F#Ø[\n.`Jk7á.Ük0½`aë\u0006\u0014F\u001b;\u0015t\u0007®dæÃ\u001bc\u0012'Sx÷rý¸\u0007ÿnqÎ¿\u001f\u0001\"GèÙóÊðÏdÓ4-Ë\"\u0016· °X\\¡mÛöu ô!Xçb}B6\f\u0003Z0Æî}dBÌJ\u0006º®»÷Íó,\u0003mÛê\u0015j\u0019èû^¶CkQ=X×U\u001eBLTÿ@K\u0006¤ï|¡Îç¤4\u0001]\u0019 \u001f ü8ø¯o\u0002\u00062[ÖI\u0014Eaj\u0002f2Pe\u0018Ð\u0010u]\u0003\u001a\u0018Ëªª¢Èó¼ËÌ²,ã \b|ßìS\u001e\u0010hÒ4Åù5MczÛted¢Öû¾SQ\u000e\u000eMìlÂ[,ª\u0007_jzÜ©r\\a¶ê\u0015\næ >«A¬¿ÅÏvêëoðYmnyeNxeNx\\öÜg.ç¿ô©³\u0007zj\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÀ\u0000\u0000\u000eÀ\u0001jÖ\t\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.134\u0003[z\u0000\u0000\u0003åIDATXGÍÖKH\\W\u0018\u0007ðÑÐúBã\u000b\u0015ñ\u0011ÍF¯(¢PñµI\nÔYø\"(¢(Q)A­Ò\u0011»DÅúD­¦45\u0010í.%\u0010BZ\n-¥nKW]\u0014²\f$~ùs'ç\u001e¿Ì8«Û\u001fs¾ÿ9çÞÃsï\u001d\u001f\u0011ý¯¡ÄÐKg\u0003o\u000eîÀ ´Z}Cº}böéþ*3ê\u0005¸bÔ-pÛ¨/ÁS«ÌUø|\u001fÂkðC\u001flÀ¯pI÷ïÁ:|¡ÛûÖ|îû\u0005u}\n#Fÿ!üfÔ·á[§V«Ð\u000b²²\u0001x Û¼\b¿n_ÖØ7ÀWö¾®oÁ÷FÿÀº~\u00047~¹\nyAý­Ûæ¾Æ¸Oá;à\"\næªÏ5ø\u001a\u0002ð±Îþ\u000f±*s\u0015Ât/õÍ\u000bâ\u0006{aù\u0019Útû)¨=\u000fÿ50\u000b½ð\u0011|\u0005Wàwó\u0018j¼«¯\u0010oÔtÛ¼B?ÀMÝÎ\u0001n9ð\u0019ü\b\u0019p\u0001þ\u0002þiïò\u0018»°\u0016ÏUx\u0006\rº6\u0017T\u000ehª6ÿ|\u0001n;ðy\u0005Ép\u0019ø*ýaô=ÇPiÎQ}®B/\b¸ø\u0017Àu£?¸ ]óÝö\rpQâäºï\u001e|®ÛÂ¢ÑÇW\fÍwã\u001dg\u0002¯¡ÄÐKbè%1ÄÉÉ\t\r\u000e\u000eRee%ÕÖÖR]]]PMM\r577ÓÀÀ\u0000Êómb\u0018ÝÝ]joo§¤¤$JII¡ÔÔÔ äädÊËË£¦¦&\fçÛÄ0\u0012kkkT__#¹\u001eAT^^¡ò|\u0018Fbuu\u001a\u001a\u001a(::ZÄ\u000b*--ÅPy¾M\f#µ¾¾N£££4>>®¾¨¯¯zzzÔþã¿Hò\\\u0018s||LtttD\u001b\u001b\u001b´°° \u0016Ãæççikk\u000bÃä¹áa(###TUUETTTDÅÅÅjTTT¨¶ßï§ý}þß&Ï\u000fG\fCéììTwNLL\fÅÆÆR\\\\\u001cÅÇÇSBBjó­¾¸È¯-y~8b\u0018JGG\u0007edd`¦|WÑÌÌ\fÊóÃ\u0011ÃPx³òC°  @ýl&ÎZ[[iyy\u0019Cåùáa8¼¡777igg'h{{[mðÓÓS\fç\u0018hrr¦¦¦hbb©¿¿_ÝÒ½½½.ÝÝÝê5166FÓÓÓjÞìì,ñcÁ>îû¡ceeEÝ=éééJVV\u0016åää¨M/ÊÍÍ¥ììlµÏÒÒÒÔOÙÒÒÃÉç°¡#\u0010\b¨\u0013ð\u0013WÚÀçÁï8Þsö±ßG\f\u001düËÌÌ¤¨¨¨3':/~\u001cð¿[ù\u001c61tð¼­­M=[ª««Õw$xNcc#uuuápò9lbhâ×ÄÞÞzú\u001e\u001c\u001cDçñëÅ>f(bè%1ô\u0018zI\f½C¾·p\u001c©\u001e\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0002\u0000\u0000\u0000nb\u000fÏ\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000e¿\u0000\u0000\u000e¿\u00018\u0005S$\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.134\u0003[z\u0000\u0000\u0001\u000bIDATXGíá\r \u0010F¦s8S±@\u0007p\u0003Mª\u0003¨.Ô~é]¯W\"X[ IÃûárÇË\tÁh¬µ,@dð¸f\u0001¢\"û\"Â¾l¦q\u001cy\u0012\u0004ió<ód\u001d\u0019L§;ëºrÈ\u0003\u0012(3à\u000bÉÈdÁ8\f\u0003G= A}>¯LÚ¶åh®ëÂ¾mÙ²,RÖ÷=Gß\u0000ÉRE8ú`C¦{:d\"´ÏéÏ\t4MÃÑ Vp|/2mªªª®ëóG \u0010å´ö=e²OÑÁ²´?\u0001ô+¾´¯Ð¾´\u0007\u0010\u001fÆ´Gý;êÓ&Ú'Í¶\fèþÞ¼®&%NOW\u0006´/íEL\u000f$ÿÄ\u0010(ÎôñKE¡È¢ðß²|¿¹ÖÞ\u0000£Ço¨±\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÁ\u0000\u0000\u000eÁ\u0001¸kí\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0001øIDATXGÍÓMNëP\f\u0005à´i\u0003BMw\ns,%°\b\u0016ú7¯:`wl\u0019àSÅÕ­súH`é{\t§®¯\u001fWô¢øWhøhè%ÎØX4ô²ËíEC/»\fØX4ô²ËíEC/»\fØX4ô²ËíEC/»LéõzÑÐË,¢ÞY¯\u0017\r½Ì\"êõzÑÐË,¢^Y¯\u0017\r½Ì\"êõzÑÐË,¢Y¯\u0017\r½Ì\"êõzÑ0Ïs{Hç&\u001cU=»\u0012(; kö<ECØív!]Ùl6r\u0004?j>Wµ5Íd4?\u000fh\u0018²\u0003Û²ó-\u001a¶Ûmeèo5]¢¡ÕÅÕ]º*ECÆ\u001e\u0010ËÎ«CC\u0006¿nvÇz½\u0011x=¯p¾¢a\u001düÚ1'Æt:¯âµZálEÃ&\u0013#ø^¥ô³\u0010\rÄ\\]ÝUis\u0015\r/ñ\\^\u0015Ô~\u001e¢¡\u0007æ5\tújK{B4ôÀu`&S~ÖXl&ÐÐ\u000b×Ù¡¦¿*Wéð°4c:-\u0003þæj;@®ç[\u001eÇeV«UËm¤Zÿ¤Ëåø,lWl¡ý~?G6\u001aÒñx|%®E.\u0012Ñ/3\u0018eYv¿X,Ä£¼ßI¡ÐÞAÝ\u001by3\u000eC\u001fO-ìqÜåô\u0012T$\u0003<\u0004\u0018\u0000ÃR¿ìÇÀ:ú}¼£ðÄ\fý¹¦éq1îP\u0014Eï\u0007WÇ-Út>\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÃ\u0000\u0000\u000eÃ\u0001Ço¨d\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0001¾IDATXGÍKK\u0002Q\u0018Oà\"(©Eõ\u0007Z\u0005-(ºº\u0012\u0004\u0013/yAÔ.P»\u0016\u001b#PÓ\n%Ã!+Em,%[\u0004QAvý²¯3G\u001c=YÇÅÃ¼ßû\rÌ³83C\u0000`¨0,ebXÊÄ°aA2u\b?¿m\u001aù\u001b0¹¯]Ò§kïÉÇ×\u001b4ê\rPU\u0015Nç\u0015Â17\u0013ú/E\u001c®u}!\u0013]È\u001fv\bKY0!×&,dàöov²88½\u001bà\tÚÐ\bDì`YÕe\\>\u001baB½MýéZÑànÂ$ÃuF¾çaÀ°Äà,|1M#ßs\u0003&õ¦ÂÎPM-Ñ±ß÷Ï\u000eÜUn RSÐh¶ª\u0010ö¿ÔRdÛ½¥/dÒx¾eR$\u0014ñ\bKY0!ÏÎpü:\u001e\u001es]¡bé\u0002!\u001fD¢!4ö\u000fb°´lÑeÊµ\faB½M³]\u0016d4¸0Ie+ÐÈ÷ÜÉË÷)½½P`¾:\u0006bÒ\"ßs\u0003&ÕÖ9;C3ÚØïoo\u0001Lã\u0004Æ¦ð0SQsÿ\u001f\"Nßª¾ÉÄô\b\"®À°\u0005\u0013²Úç\f4\u0019&Ô\u000bØ$3G\u001e°É+\tAF\u001b0É*»ô\"öB!\u001bÃR&¥<ü\u0001#f\u0006ÝAa'\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÃ\u0000\u0000\u000eÃ\u0001Ço¨d\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0001`IDATXGíÕ±0\u0014\u0005Ð©m\u0004ñ\u001b,mm´\u0012ìE°µôK\u0004kÑbÐÂJð+³I!ÈËyº»àÀâÜ÷q>B?\u0005Oá`¸\tÃPÄq,$¹M\u0014E¢ª*YgÂp#?êëviÊzÃL\u0014n¦ÑÊî@çìÁpýÖ÷ûµx\u0002Ã½eY´Ò«\\×xÎ\u0006ã8Zù\u0015´\u0017!BËÏ*BÖàî=\u0018\"A\u0010hCÎ }&04¡C¸¦i×q'\u0005C,Ë´a6çÉ«¸\u000fá\u0011:ÐÞ·áº®µ¡&eYÊ+¸Ç\u00046t°\t½Ç\u0001C¶mµáÔ<Ïò(¾\u0004\u001ct=ß÷å\u0011|Ï\u0006\u001cëºjlèÙ3`È¥~Òt\u0019õj çÎ!×8ÚBÜ¿\b\u0013\u0018r\rÃ -ç¹|ÏsÀë]Èæ]Èæ]Èæ_,ôè\u001a-DÏ\u0005C.º\u0010}~\u0005\f¹ú¾¿u\u0019\u0005\\]×Ýº\u0002Ã'Áð9âó\u0003;yÚ\u001aþÓ(Ë\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÁ\u0000\u0000\u000eÁ\u0001¸kí\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0002<IDATXGíO«9Q\u0018Ç­ÄF¤ÄBvXØX!I¤lXú½²\u0017`ag£$\nÙø²!))â5x\u0017vÞÀsÏ9¿Î4÷ü\u001ewæ6¹\u000bSùs>Ï\u0017©1\u0001À\u0002\r\u0004\r\u0004\råÔj5°Z­`±X4a6ÁétÂt:%Z|\u0016\u0005\r9Ùlì0éÎl6#z|&\u001arD^x<\u001e¢1\u0013\u000b9¢H/l6\u001bÑ¿\u001cQ¤\u0017v»è_ÌÄB(*\u0014\n0Ïár¹@¯×`0(­ív;(\u0016ìþ|>ÿG.öêR¨ÝnÃõzT*\u0005^¯\u0017*\nÙ\u0002\u0010\b\u0004Øúý~\nÑ«Ùl²g\u000eý§ræB.\u000bÏ'¸ÝnIJév»Ðh4Ø½XHþíh.T*àv»IB\f±P§Óz½.!ß«¹PµZÃá \t·Û-Yþwí÷{V«Õ7øYæBñx\u001c\u001e$ä´Z-X¯×ìþ­?\u0019åx<Â`0)§Ó\tË%»{!ÃÁË¯ÑhÄätýíäø|>4Wî´ò)¤Ä§\u0012Bj\u0010gqÐ#JÔ\u0012\u000eÉqÜ©\u0004\u001arÄAjL&ä8òù<Ëåo¤ÓiX,\u0016l\u001d\u0003\r9â µÇcV\n[K$\u0012DÏ£ !G©\u0016¢ßg2\u0019¢ÅgqÐ#\nÕ\u0015¢¯¾¢\u001f\u0003\r9ráo\u0010\u000b%I¢Ãg !\u000b¼\u0010}¹\u0013½?\u001cñ]X-Ãá\u0010úý>øý~¢ÁÝ¯@C9ôÓÆb1D\"\u0010F\u0015\tB°ÙlÈQÜ§\u0004\u001a\u001a\t\u001a\u001a\t\u001a\u001a\u0007¾\u0000¼\u0007ääÎE©c\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000b\u0011\u0000\u0000\u000b\u0011\u0001d_\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.134\u0003[z\u0000\u0000\u0002°IDATXGíÝo\fQ\u0018Æ÷óo¹\u0010$\u0012¤n(\u0012\r.¤(Á]}$¨ø¬THKµ¾Ò¢ZRm­ßsòÌÉ=³3\u0013åbäó>ï93ûìÙÙétÿ3\r\u00035i\u0018¨IÃ@R§Ó¹\u0002Ïl\u0013\r<\u0010A.Ã¼m¦\u0006\"ÈÅº0Ò\u001f\u0005â¤Wá3¨®b\u001d¦¼<\b?\u0001µa¤Ö8Ù\u0005Ø7pÇµúkð\u0014\u001eÁ²{¿à\t<v½\u0000a¤Æ@è\u001clÃ%Ø\u0001;a\u0013&¼$\u0013s£ð\u0013NÁmh\u0015Fª\rÄV`ÚVþ\u0000¬Ù6µ\n\u0015ÃP\u001fVÏ¶R}\u0003q ¶dm\u0010~Ãe£X«-®¼2ôWám¢,\u0010\u000b÷ÂwÛ(zï\\&¢\u000b4\u0016¼kP¾2s.£è½IÛ¨ª@?\\&¢¿â2\u0011ý\u0013 ±LreðS°Ï6Þ\"Û\u0006%Ütþy8n¾~â\u001a\u000búmÓËDô×]\u0006Å@LÌÁm\"ú³.ð\u000fAc/åmê½J[.31\u0017ïÍr Ê­ûà2\bÿ\t4)YR¯¬^_\u0016s/ád¨C\u0007ÑXv¹W.ðÏ!|ÉÂ@rEðÛ.3×&±¨üYÓ×Cñ¨­ü~Ð(ªÂ\u001bn\u0007á/U¾u{l³@\u0007á£m\"ú.ðzZ÷\u000bl?^¯\u001bGl£èé\u0011\u0006÷\u0018Å³°d\u001bEïKÕÉCOëA£È¾\u0010½ì¦§mÿ\u0002*ï4\u0016Áªm\u0014½¯<ô$¼þR\u000eÙ&¢?\u000b£¶Aø÷pÓ6Qe B\u001c¤ÿ¢Ó¶òz%aêÄÚ\u0007p×V~\u0004ôtÌ­Lµ$\u000e¾\u0007ßà>·i·ËJ1¯÷¥ë¶òz5iü2$N4S>\u0019õkÐ¨w\u001dÍéåK÷Õ4èfW_\u000fÏIØ\u0005\u001fÚ¨6W({ÓÃë¾Ðªî¶wÌ´VÓ=¤çOë{æo¨o èr\u000f4T\u0019 ãÿ\"Ôê¦\u001e¤4\fT¯n÷7G\"Éü\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÀ\u0000\u0000\u000eÀ\u0001jÖ\t\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.134\u0003[z\u0000\u0000\u0000IDATXGíÔA\nÀ \fDÑÜÿ@\u001e¬\u0014JWVK\u0017C\b¶\u0011æÁ È_)9\u0018\u0006µt\u000b\u0012ÏC\f²\u0018d\rÍ\u000e:ÊÎç[· ^Ö\u000fJ)ýAu\u001e\u0006ÕyÖ\u000f\u001am õ½\u000f\u001fb5Ä khfÐ^¶Õ32f\u001dd}óo¬{=Az\u001aô´ØA\u00110Èó\u0005LÛ\u001a¾`È\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÃ\u0000\u0000\u000eÃ\u0001Ço¨d\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0001}IDATXGí½®@\u0010Fm\b\u0005Ð\u0010\u001ach$á\u001d\bPAgiogI!-­-%\u000fº\u000eÑ\u0005\u0006¼ü¹æÆâdÙ3ÌÌWP°a}\u0015¤\u0014\t)EBJR$¤Lí÷{æ8Îâ\u001c\u000e\u0007fÛ6¬éî-¡%èµ\t\u0000V\u0011»IY7©ªÊLÓda,eYÏ@Q\u0014Á*b7)ë¦Ûí\u0006×n}\u000e8;c¸\u0012uRÖM×ë\u0015®Ýú\u001cpö/P\u001f8{õ@Ûí¶ê)i×xðÕ\u0003aOçy ßûh <ÏA\r¿÷oèr¹ÀA×\u0010ý?jMÓ:n\f8{@EQTþx<6ü\u0018pö\"Ðð~\fØ?;P\u0018Cv»Ý³6\u0006ì\u001d\b\u001d\u000fÖ($Ibº®ÃcÓcï¤@iÂõu§À\u001eò·\u0005ë¢zÕÐO\nt¿ßYeÕs\u001fí_\u0014>\f\u000fÖñ>)Ðù|®Îw`__\u0018=)Ð_9N¿Á!dY®ÎU\u0003Má\u0017è\u001d_\u0017È÷}XEì¦¤ëº\u0001KÓÞR$¤\u0014\t)EBJR\u001cló\u0000ã0F½]WÅ\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÁ\u0000\u0000\u000eÁ\u0001¸kí\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0002IDATXGí¿j*A\u0014Æ-Bâ\u001f¤PHac!\u0011\tB¢Äh\u0015m\u0005Ab*\u0003*\biRX\t>&*¨XE,l\u0002iíll|\u0001;ABÌÉáNXç\u001eqC\u0016¼\\\\ø±g>g¾ó¹»ì¬\u000e\u0000þ)Hqâ.!E%Ùl\u0016\f\u0006\u0003èõú_qxx\bV«\u0015:\u000e³¥{!¤(ÅblNsºÝ.³§{¢@6Ò\nÍÆì7ô¤Dl¤\u0015\u0016ÙoèI\u0002ÙH+ý(´âÿ\ftww\u0007¥R×OOO°\\.¡×ëÉdâÝnçãÏÏO¨T*ßëf³\u0019¸Ýn^ÂÛÛvÅ\"ÜÞÞÂÃÃ\u0003×\u0012\u0004F#^¯V+ðûý¼F£l97àÁ§Ó)¯1Ðx<Ö.P.\u0003¯×\u000bïïïP(\u0014Àãñðß\\.\u0017á)ç\u000fC0\u001a<ÐËË\u000bÔëum\u0003¥R)\u001e\bë\u0003Èd2ðüü\fÍf\u0013... Z­~ÏE^__ùmÄ@8^,\u0016\u0010Ç\u001fh2ÀÑÑ\u0011¤ÓiN¿ßP(ôÝ\u0018¯\u0016ñÀí\u0001k³Ù\fóù×\"Ðõõ5óë@¬\u0004øøø\u0000Ã\u0001N§À\u0003Ï÷÷÷¼!n3Êãüü|-\u0010R.µ¹eøf\u0015µàäää/\rÁÐÊ1>GòXgHKö¶±\u000f´} 5È½\u0004¤(MÔ/EÙK-¤(\u001b©¥Ýn³å »¹¹d2¹F8\u001cæ­è!C\u0002¹ZZ­\u0016\u000fEý\u0016\f\u00065Ý\u000f!El¦\u0016\fWAÖ#\b³¥{\tHQ \u001bª\nôg·'û(!EÒð'È®®®\u001dÝC\u0014\u0005Âð§(\u0003\u0005\u0002\u0001fEûS¢ Ï¯5RK£ÑZ­Æ¿dÏm¢\u0012ü·øñ~yy\t>o+ggg0\u0018\fØRÚo\u001b¤¸KHqâî\u0000Ý\u0017¶kåPë0²;\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000´\u0000\u0000\u0000´\b\u0006\u0000\u0000\u0000=Í\u00062\u0000\u0000\u0000\u0001sRGB\u0000®Î\u001cé\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000.\"\u0000\u0000.\"\u0001ªâÝ\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0006JIDATx^íÝ¯®]U\u0014ñz\f\u0012\u0007A y\u0004\u001e\u0001D\"+`P\u0004KBBSÙð\u0004À\u0013T\u0011\u0000Kßà2gÒ¬¹2öÙÎØç®E>ñ\u0013sÜ®]óÙÛ¾xzz\u0002þ7ä\bÌJÀ¬ä\bÌJÀ¬ä\bÌJÀ¬ä\bÌJÀ¬ä\bÌJÀ¬ä\bÌJÀ¬ä\bÌJÀ¬ä\bÌJÀ¬ä\b¸üôÇÇ\u001f¨ý*r\u0004\\\"èoÃ§êgW#à\u00121\u001f^?*j9\u0002.ïþíQQË\u0011pi~HÔr\u0004\\º /ZKÄÛ\u0007}iÔr\u0004\\\"\\\u0015ôeQË\u0011ph×Nö¨å\b¸D°·NÖ¨å\b¸D¬[A'[Ôr\u0004\\\"Ô=A'KÔr\u0004\\\"Ò½A§»£#à\u0012\u001e\t:Ý\u0015µ\u001c\u0001óhÐétÔr\u0004\\\"Ì3A§SQ£û ðÜ\u000eG]îcÀ\b\u000eE]îCÀ(vG]î#ÀHvE]î\u0003Àh6£.G÷\u0018\u0018ÑÍ¨ËÑ=\u0004Fµ\u001au9ºGÀÈ^·í.Ê!\u001e\u0001ÃjÛ]C=\u0002FÕ¶»(z\u0004ªmwQ\u000eõ\b\u0018UÛî¢\u001cê\u00110ª¶ÝE9Ô#`P/Ûv\u0017å\u0010\u0011ÉS9ÄC`4«1§rÇÀHnÆÊ!>\u0000b3æT\u000eñ\u0011`\u0004»bNå\u0010\u001f\u0002ÛîS9âqþB#àôkP¡îq(æ$GÀ%¢Ì¨U¬[\u000eÇä\b¸Dg>\u0015s#à\u0012q\u001e\rútÌIK\u0004z$è»bNr\u0004\\\"Ò½Aß\u001ds#à\u0012¡î\tÚ\u0012s#à\u0012±n\u0005m9É\u0011p`o\u0005m9É\u0011ph×þ1Øÿc{9\u0002.\u0011­\nú\u001c\u0001\b·\u000fú²\u001c\u0001·\rúÒ\u001c\u0001&èËcNr\u0004\\\"â_\u001e\u0015s#à\u0012!ÿ\u001c¾R?»\u001c\u0001ùëð]øRýÜMK\u0013ôC¢#àÒ\u0005}yÔr\u0004\\DÐF-GÀ%âUA_\u0016µ\u001c\u0001\bw-èdZKD{+èdZK\u0004»\u0015t²E-GÀ%bÝ\u0013t²D-GÀ%BÝ\u001btº;j9\u0002.\u0011é Ó]QË\u0011p@\u0006NG-GÀ%â<\u0013t:\u0015u9â#_\u0000f/\nvÃQC|\u0010xn¢.ø\u00180ÝQC|\b\u0018Å®¨Ë!>\u0002d3êr\u000f\u0000£¹\u0019u9Äc`D«QC<\u0004F%£.x\u0004\f«mwQ\u000eõ\b\u0018UÛî¢\u001cê\u00110ª¶ÝE9Ô#`Tm»r¨GÀ¨Úv\u0017åPA½jÛ]C<\u0002Fô*|Ô¶»(G÷\b\u0018ÑjÌ©\u001cÝC`47cNåè\u001e\u0003#Ù9£û\u00000]1§rt\u001f\u0001F°;æTîCÀs;\u0014s*G<þ\u00040û&¨X·\u001c9É\u0011p(Ïü3\u0006§bNr\u0004\\\"Ì£A9É\u0011p8\u0004}WÌIK\u0004º7è»cNr\u0004\\\"Ò=A[bNr\u0004\\\"Ô­ m1'9\u0002.\u0011ë­ ­1'9\u0002.\u0011ìZÐö\u001c\u0001V\u0005}IÌIKÛ\u0007}YÌIKÄÛ\u0006}iÌIK\u0004ü&üð\u001c\u0001øïðOøLýÜMKüWx\noÃêÏ8É\u0011pÿ|\u001fôC¢#à\u0012\u0001ÿÞ\u0004}yÔr\u0004\\\"Þ>èK£#à\u0012áª /ZKD»\u0016t²G-GÀ%½\u0015t²F-GÀ%bÝ\n:Ù¢#à\u0012¡î\t:Y¢#à\u0012î\r:Ý\u001dµ\u001c\u0001\bôHÐé®¨å\b¸DGN§£#à\u0012a\t:º\u001cñüË\u0001§\nvÃQ£û\u00180CQ£û\u00100ÝQ£û\b0]Q£û\u00000Í¨ËÑ=\u0006Ft3êrt\u000fQ­F]î\u00110²·m»rGÀ°Úv\u0017åPQµí.Ê¡\u001e\u0001£jÛ]C=\u0002FÕ¶»(z\u0004ªmwQ\u000eõ\b\u0018Ô»¶ÝE9Ä#`DïÂçm»rt\u0011­ÆÊÑ=\u0004Fs3æTî10ÍS9º\u000f\u0000£Ø\u0015s*G÷\u0011`\u0004»cNåè>\u0004<·C1'9\u0002.\u0011dþ¢¬uËá\u001c\u0001òLÐ§bNr\u0004\\\"Ì£A9É\u0011p8\u0004}WÌIK\u0004º7è»cNr\u0004\\\"Ò=A[bNr\u0004\\\"Ô­ m1'9\u0002.\u0011ë­ ­1'9\u0002.\u0011ìZÐö\u001c\u0001V\u0005}IÌIKÛ\u0007}YÌIKÄÛ\u0006}iÌIK\u0013ôå1'9\u0002.ï~HÌIKüæQ1'9\u0002³#0+9\u0002³#0+9\u0002³#0+9\u0002³#0+9\u0002³#0+9\u0002³#0+9\u0002³#0§§\u0017ÿ\u0001ö«\u0012[h_\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000µ\u0000\u0000\u0000´\b\u0006\u0000\u0000\u0000Ò\u000fm\f\u0000\u0000\u0000\u0001sRGB\u0000®Î\u001cé\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000.\"\u0000\u0000.\"\u0001ªâÝ\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0007µIDATx^íÝ]#G\u0012ÅqC0\u0003\u001b!\u0018!\u0018ÂBX\bû`\u0000`\b^\u0006°\u0010A;îÊS'ãvwIY\u001fÿßË=\u001aUF¨\u0015'õõÝÛÛ\u001bp+6\u0004FfC`d6\u0004FfC`d6\u0004FfC`d6\u0004FfC`d6\u0004FfC`d6\u0004FfC`d6\u0004FfC`d6\u0004FfC`d6\u0004FfC`d6\u0004FfC`d6\u0004FfC`d6\u0004FfC`d6\u0004FfC`d6\u0004FfC`d6\u0004FfC`d)øí¿?ü\t¢í_IAüÃ7`\u0014mÿJ\nÜB ª¶%\u0005n!PUÛ¿\u0002·\u0010¨ªí_I[\bTÕö¯¤À-\u0004ªjûWRà\u0016\u0002Uµý+)p\u000bªÚþ\u0014¸@UmÿJ\nÜB ª¶%\u0005n!PUÛ¿\u0002·\u0010¨ªí_I[\bTÕö¯¤À-\u0004ªjûWRà\u0016\u0002Uµý+)p\u000bªÚþ\u0014`,QØ_ÂÂ_K¡gÒî¤\u0000µE!\nÿ\u000eúä-ôÍý?ü\u0011~\r?º=J\u0001jQá\u001e\u0005T!UPWè»Ó\u0003ø_á'·G-\u001bâ:Q¸ïFßÃÿ+òÝiÒHõÛ£ÏØ\u0010çâý\u001c4RL9\u0017\u0007=xõ Ö3Ò÷naC\u001c+\n§¹XO§³\u0014Ë\\¼y¤x\r±¯(F\ný\u0015}¤Ð³ÑÏnödCôâM}Ô\u0016BûÐ=R<Ãx^\u0014n\u0019)8j{ç¨í,6ÄçT¸G\u0001õ×hæ£6\u0014»ÏÅ=l,\n·\u001cµi¤à¨ÍìQ\u00156ÄWQ¼å¨mæb9j»t¤x\rg¥ÂÚä°£¶³Øp\u0016Q8^½û6R\u001c~Ôv\u0016\u001bÞ÷(\"Gm'\u001fµÅw\u0012[¿zç|wëWï{Øpd*\\à¨í¤Wï*²áH¢pë£¶G/Gmá#Å3lX]\u00147Ê\u000fxÔv\u0016\u001bV£Â=\n8óQ\u001eÀC\u001fµÅWÂqÔ6È«w\u0015Ùð\nQ<Þ(ÿm¤~.îaÃ3Dá8j»Á«w\u0015Ùð\bQ8Þ(ÿõYhÚ£¶³Øp/Q<Ú¾>9j;\r_\u0015ãò_G\nÚ.dÃ­T¸G\u0001g?jÓHÁ\\\\\rß\u0013ãò\u001cµgÃµ(Þìo_\u001fµ1R\f \u0005*\\XÚf\u001d)8j\u001bX\nVÉ2RpÔv\u0003)X\u0015z\u0016jhV\u0018PÛ¿ø®ð@ImÿJ\nÜB ª¶%\u0005n!PUÛ¿\u0002·\u0010¨ªí_I[\bTÕö¯¤À-\u0004ªjûWRà\u0016\u0002Uµý+)p\u000bªÚþ\u0014¸@UmÿJ\nÜB ª¶%\u0005n!PUÛ¿\u0002·\u0010¨ªí_I[\bTÕö¯¤À-\u0004ªjûWRà\u0016\u0002Uµý+)p\u000bªÚþ\u0014à\u001e¢àëï#¼íÇòÚë\u0014`\\QäõçKm\u0013Ü\u001e¤_>\fíö!\u0005\u0018K\u0014V_ 4Ã·`éSý>GjCÔ\u0015Eb¬xÐ\u0003õéOõÛ\u0010µDQg\u001a+t]_glC\\/:ÛX±Û7^Ù\u0010×Pa\u0003cE'\u001bâ\u001cQÔõ\u0017lºâßÅ.cÅV6Äq¢¨Ë/1V\u001cÄØ\n\u001b4VÜýbõ@½ükm>QÔYÆ\nYÆ2ß\bkC</:ÓX¡g²ßÏmCl£Â>\nÌXQ\ráEQ_\u0018ÓSîÝÝÊ\u0015[Ù\u0010ßDQ\u001fgb¬\u0018\rg§Â\u0006\u001dGÍ0Vè:w\u001d+âö.ýy=\u001bÎFE\b3\u0015zæ9l¬ÛÖå²Æ¶á\fbÓg\u0019+ô ý2VS\u001aíñÿ^ÖØ6¼«Ga\u0019+\u000eÖÜÓ\u001bÛw¡\r\r\u001a+ô±â$«û$§7¶\rG\u0016\u001b¸¼÷X?t³ÞÜ»9}¬ØêqÿÖNml\u001b&6L?`:ÃX¡ë»l¬Øju×Nkl\u001bV§Í\t³\u0015zÆ)1Vlµºï­S\u001aÛ\u0015ÅfÌ6VèA[j¬Øêq\u001dï9¼±mXE\\ülcÅ-~qwu]ï9´±mx\u0015]hXÞ$ÄX1¨Õ5~ä°Æ¶áâÂfú¤ôÐcÅVëÝâÆ¶áÑâBfû¤ôT?ä¿ºþ-vol\u001bîMw:Ì2V¨H·\u001c+¶ZíÅV»6¶\r÷\u0010wr¦±B×xû±b«Ç¾<k·Æ¶á«âNÍ6V\fÿÞã#¬öéY»4¶\r·Ò\u001d\b³\u0015C|¤éJ«={EwcÛð#ñ\u001fÎòIiÆ\u0017=ö¯GWcÛ°\u0015ÿÁLf¬è´ÚÏ\u001e/7¶\r%np\u0019+îþj\u001ecÅÎV{Ûë¥ÆNAÜÈÝÇ\nYÆiÝ´Úç=<ÝØ)hnðNþy!\u0004sûßã©ÆNAsc@\u0015\u001b;\u0005Í\r\u0001ljì\u001447\u0002Tóic§ ¹\u0001 ¢\u000f\u001b;\u0005Íb ªw\u001b;\u0005ÍB ²¿Úþ\u0014@YmÿJ\nÜB ª¶%\u0005n!PUÛ¿\u0002·\u0010¨ªí_I[\bTÕö¯¤À-\u0004úµí_IY\bTd\u001bZR`\u0016\u0003Õ¼ÛÐ\u0002s\u0003@%\u001f6´¤ÀÜ\bPÅ§\r-)ú,\"ÐÃ5d¯M\r-6\u0004zìµ¹¡Å@\u000fÓ=jh±!ÐÃ4æ«nh±!ÐÃ4ç+^jh±!ÐÃ4è³^nh±!ÐÃ4é3º\u001aZl\bô0ºUwC\r\u001e¦Y·Ø¥¡Å@\u000fÓ°Ù­¡Å@\u000fÓ´\u001fÙµ¡Å@\u000fÓ¸ïÙ½¡Å@\u000fÓ¼Î!\r-6\u0004z\u0006n\u001dÖÐbC iâµC\u001bZl\bô0¼8¼¡Å@\u000fÓÌ§5´Ø\u0010èqeC\r\u001eW6´Ø\u0010èqeC\r\u001eW6´Ø\u0010\u0018\rÙ\u0010\u0018\rÙ\u0010\u0018\rÙ\u0010\u0018\rÙ\u0010\u0018\rq½}÷7sRºg/\u0004Å\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000´\u0000\u0000\u0000´\b\u0006\u0000\u0000\u0000=Í\u00062\u0000\u0000\u0000\u0001sRGB\u0000®Î\u001cé\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000.\"\u0000\u0000.\"\u0001ªâÝ\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0003IDATx^íÛÁk5\u0018Ñ\u0017\u0002\u00194\u0001\u0010\ndð2!\u0004#U±°.=3¶G¦ÔÔYÅÿ¹tW½õÛí\u0006ÿ\u001b1B«\u0018¡UÐ*Fh\u0015#´\u0011ZÅ\b­bV1B«\u0018¡UÐ*Fh\u0015#´\u0011ZÅ\b­bV1B«\u0018¡UÐ*Fh\u0015#´\u0011ZÅ\b­bV1B«\u0018¡UÐ*Fh\u0015#´\u0011ZÅ\b­bV1B«\u0018¡UÐ*Fh\u0015#´\u0011ZÅ\b­bV1B«\u0018¡UÐ*Fh\u0015#´\u0011ZÅ\b­bV1B«\u0018¡UÐ*Fh\u0015#´\u0011ZÅ\b­bV1B«\u0018¡UÐ*Fh\u0015#´\u0011ZÅ\b­bV1B«\u0018¡U°ÓoþúÇðsø%ý¾S°Ó?¾ý\u0017£\u0011vº\u001bôÛG\u001d#ìt\u0019ô[G\u001d#ì4Æ{\u001dôÛF\u001d#ì4\u0006ýQÇ\b;Ñ~4èië¨cÆ`?\u001bô´mÔ1ÂNc¬_\rzÚ2ê\u0018a§1ÔG\u0006=}{Ô1ÂNc¤\u000ezúÖ¨cÆ@\u0019ôôò¨cÆ8\u001dôôÒ¨cÆ0_\u0019ôôô¨ãò18ÁS£^Ëà\u0014\u000fz9.\u001f<4êå¸|\u0000Nóå¨ãò\u0018Nôé¨ãò\u0010Nõá¨ãò\bN\u0016G½\u001c\u0007pº÷û#<£ÝïwZô\u0000Nv¿ßi9Ò\u00038Ùý~§åH\u000fàd÷û#=ÝïwZô\u0000\u000eöûý~§å\b\u000fàTÿ\u001aó´\u001cá\u0011(yZð\u0010Nóá§å\bá$yZð\u00018Åc#|\u0004NðÐ§å\u0018\u000fç\u0019a·¿4ÔG<<æ)FØir:õ+Oy\u0011v\u001aÃ|eÐOy\u0011v\u001aã|vÐ/y\u0011v\u001a\u0003}fÐ/y\u0011v\u001a#}tÐß\u001aó\u0014#ì4úÈ ¿=æ)FØiõ«Ao\u0019ó\u0014#ì4\u0006ûÙ ·y\u0011v\u001a£ýhÐ[Ç<Å\b;á¦Ao\u001fó\u0014#ì4Æ{\u001dô[Æ<Å\b;]\u0006ý¶1O1ÂNw~ë§\u0018¡UÐ*Fh\u0015#´\u0011ZÅ\b­bV1B«\u0018¡UÐ*Fh\u0015#´\u0011ZÅ\b­bV1B«\u0018¡UÐ*Fh\u0015#´\u0011ZÅ\b­bV1B«\u0018¡UÐ*Fh\u0015#´\u0011ZÅ\b­bV1B«\u0018¡UÐ*Fh\u0015#´\u0011ZÅ\b­bV1B«\u0018¡UÐ*Fh\u0015#´\u0011ZÅ\b­bV1B«\u0018¡UÐ*Fh\u0015#´\u0011ZÅ\b­bV1B«\u0018¡UÐ*Fh\u0015#´\u0011ZÅ\b­bV1B«\u0018¡ÓíÇß<ì\u001d\u001bÕý\u0018\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000e»\u0000\u0000\u000e»\u0001ÇøÔ6\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.134\u0003[z\u0000\u0000\u0000×IDATXGí1\nÂ@\u0010Es\n=mÐB\u001bADDÈ)Ryüõÿ\"àN&¬Å|xýdg_³EÒ¤^`\u0007.à\u0001à\b\u000e\ngp\u0003÷\u0019®à\u0004¶`SÈ\n¬\töÏ¿@-k¢ô}º®ssåYdTH¸¹m[w8WEFd\u0010òL\bY\t!+ÅBÚ\u0015çæ¥È°+\u0012ò\u0012È°ûJÈ+!d%¬\u0010²\u0012BVBÈÊ ¤QUs%E_\u001d|Ñ[3ì9²E\b)d\u0010RÈ\u0016'~ñcaêzO¡5QË¨e=Ró\u0006¼ ê®£ÝÏW\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÂ\u0000\u0000\u000eÂ\u0001\u0015(J\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0001ÕIDATXGÍKNÃ0\u0010[ÒG\nBM\u001fBì»=KÀ\u00118\u0004\u0007@}í«.¸\u001d`Ç&|ä0q'M[_úÄ\u001eg~\r®ìNç­àª\u001cI1qUË¤h*ÆÝÄXÔJKA­´d_Æã1A3ÔIÛï÷ÝÁ`puð\u0010ù¯×k^Õùpi\u001fòÅ,·L§S\u000eæ½5\u001c\u000e¯\u0007÷#!å.²[!JÓôÐ=(\u0012\u0002ª±Ènù\nC·óì¡:V«\u0015ieîQahD¸L$ÉÔÊ\u001aU\u0018ê\u0015\u000f29\u0014³Ü¦na¨K¸|$¶[0\u0010\u0012µ/¨RÐ\u0017Û-)\fõ\t=µ\u0004}À;¼Á+¼À3<@¥P\bn·\u000e65ª,År¹4±3\u001aî\bí\u001b2,\u0016Ïù|þÈó¿1ô¡'Û7Ä\u0006ÿ&Ù=¡=CfS\u0013K±©_C\u0001UøRó³7§}\\Cî\u0015EÊ\u0018*ÆdB(¨,ÖvÂP£C»¸Y¤0d¾è\u000bª\u0014w©»ÚZ¤0\u0011.ch61­¯Haèpþ\u000bÚf³aJÏ×°2p>C¾]q±â? 4öÇ@ívË«Ó9íO»\u000feYFÐç|±Úívi$§uèTTi±P¥%ÆB\u0018\u0013©âÝMh¼ó\u0003Z\u001b-Úû\u000b\t;\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÃ\u0000\u0000\u000eÃ\u0001Ço¨d\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0001¹IDATXGÍ»*A\u0010@\u0007\u0005\u0003C3E\u0014|%b¤øDÌ\u0014?ÀÀØX\f\u0014\r\f\u0014Á?ðWk«Ûs§«je·ÞàÀôî>Å&\u0000ð§PeLT\u0019\u0013UÆD1QeLT\u0019\u0013UÆD¯×\u000b&\tÌçsb69ôû}Ü&Ïù@£Ñ\bß$_ÂÏøBµZM\fÀ1_j³ÙÀjµú\u0011Ëå\u0012\u001e\u0007æÜ¶³H%¢×ëaµ¹ É\u000eb·Ûaµ¹ É\u000eâù|bµ¹ É\u000ew\rBd\u0007CÁ»\u0006!Þï·8h(\u0016P­V¡R©ür¹\fB\u0001snÛ Äù|\u0016Ã\u0018ø¾P\b±Ýn?\u001d¦Ûíùj4\u001aD³Ù$Z­VJ»Ý&:Î·0{óù|ÚH\u0007±L§Sgñx\u001a\u0012óÈz\fCj\u0018Ä@õzÝÙl}ÖùÆ6¨]Èl¼Ýn¨äWóÉ~¿§Å\u0019Ä¿¹\\\u000e®\u000bm¤-!ØF»\u000emd\u0002Õb±ÀGH®×«sOJ¥\u001258Rúÿ\u001c\nÛà8ûý\u000e§Ó\t\u001f!\u0019\f\u0006â\u0012_¬×kjh¨ÒÀ/ñ\toeQ¥áx<ÂårñÊápÀ«õE1QeLT\u0019\u0013UÆD1QeLT\u0019\u000fH>\u0000æ\u001d¨\u000eZ{l©\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000\u0010\u0000\u0000\u0000\u0010\b\u0006\u0000\u0000\u0000\u001fóÿa\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000b\u0011\u0000\u0000\u000b\u0011\u0001d_\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.134\u0003[z\u0000\u0000\u0001eIDAT8O=KÃP\u0014ó¡ù¨ÅZÅ\u0010\f\u0019ÜtÈPü\u0001Ý\u0005ÿ¿ Ð± Y\u0004\u0007ÁÅ1\u0012\"\u0019+\u0016:I\u0010ÄÁAèV\\DPtq\u0013Mr}Ob°ÕØ¦>ð{sÏ{Ï½$\u001cØ»P¡ÉØ\u001fÐ2½yx\u0000CèÁ¼M \u000eó\u0011á\u0011a\u0007Ò¦\u0019&¼Él\u0002\u0002<t\u0013(A³Z­\u000eá\u001bÆkp*´É>¼[Jå¾ßï³z½þù:,\u0004]§®\u000fA\u00100Âu]&Ëò\rÞ¯&\u0015S0©s\u0016&â8fã0A\u0010n±¾åcËåa·ÛMB?i·Û¬T*]¡N¿¾Ê\u0002<GÁeY¯­V+¢è+úçyLÓ´;çÏP¿$G `\u0005ê¢(ºF\u0003\u0007\u0019?\tÍ{½\u001eSUõ\u0011u\u0014ú\u000b\t]NÍæØu\u0006\u0001Óuý\u0019ë\u0013Ã\u0019s cÛv\u0014a\u00126\f:×Òåb¨¢\\û¾u)q,IÒ\u0013\u0007uÝH£pÜ'\u001ez³-ÜC×\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÂ\u0000\u0000\u000eÂ\u0001\u0015(J\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0002|IDATXGíÍ«qQ\u0014Æï@>&(Å\f\u00180!ÅÄ\u0011\u0003\u0006R2¡$R\"å£D¾\r\t\u0013EÊ¸îY«wïws÷«¼ù\u001aÜÁ/ëÙ³×c³ý\u0005\u0000\u001ftðH\u0007ßZ(ò\u001d¨2¨Æø*T\u0019TBbx&²~¼ ¡1ôû}¸\u0005óiév»P¯×¡ÙlB§Ó!ïh4õz­|ý×§íGc*¡10ý/OK(\u0014\u0002³Ù\f&\tt:\u001dyñ\u0013µÓéñx¬Øpøç<¼ !\u0018ðWa\u001dÇ¬\f]§e¿ßÃr¹Éd\u0002Ãá¼¸R±XáÊ¡OìÇà\u0005\tÁ`}«ñ½ôz=\náPý\u0018¼ !\u0018\u0011H;§ØÁ\u000b\u0012á\u0019pep>&\u0010>;ø`L |\u0015àîN§T÷cð`xF J¥\u00026¿Ä~\f^\u0018¬\u001f/Hü\u0006ú\rt\u001bY?^øä@ét\u001a\u0002\u0000\\.\u0017Ò P(ÛíÓé¤È;\u0003e³Yðù|p<\u001eI?r¹\fv»\u001dv»\"ï\fÏçÁãñÀáp ý\bðMm±X`>+òÎ@Åb\u0011\\.\u0017ÿ5 ÝnÁ`ø¿ÿ²R©\u0004\u000e\u0003¶Û-éG ý;\u0012û1xAB0T«U°Z­0\u0018\fH?\u0002< á\nµZ-EÞ\u0019¨ÑhÐÙ%\u0012@.L&\u0003©T\nÉ$$\u0012\tÀ]§å|>ÓÊ®V+:?ãàíÂ#¬^¯Ùl¦Øî\f´X,\u0000\u000fë¸M½^/øý~\b\u0006\u0010\u000e!\u001aÒäì:-\u0018\u001co7>ÀF£æÄA»ùÄ~|L%$\u0006|g0®×+!~/c³Ù\u0000>µZn\u000f®\u0010»KÜ$²~¼ !1<\u0013Y?^øcx5ª\f*¡1¾\nU\u0006Q|\u0002ÒÁw\"\u001d|\u001fðõ\r\u0016½4®ZõY\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÁ\u0000\u0000\u000eÁ\u0001¸kí\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0002²IDATXGí±K2q\u0018ÇÅ!u(\u0002ApilJ¡!TBÄ\bjpQÿÄE\u0004ÁA\u0010LPt\f\u001a*¢\u0004­¥Át\u0017ÁÉ­ÀÁE\u001c\u0005çç½çÇû\u001cw?ðz÷\u001aúÁ»ûÞÝ÷ûõîÔßY\u0000àGÁfÂfÂZÉ$8\u001c\u000e°Ûí\u000b±²²\u0002N§\u0013nnn\u0014[>\u000baEâàà@9Â²tnoo\u0015{>\u0015\tÙhY¸ÝnÅþLN$d£e±¶¶¦ØÉl´,Ö××\u0015û/29Å?\u0017ÚÙÙ··7x||ûû{¸¸¸X,&L].\u0017<??×ëUl6\u001bt:\u001du\u001b999f³\t­V\u000b*¸]\u000b\u0015Íf\u0010Fáøø\u0018\"\b\f\u0006\u0003H§Ó¢\u0010^¯§c!\u001c´]¯×áéé\t\u0002\u0000lnnB6Ñh´x!\n@\u001a\u0006<<<¨p}ÚBáp\u0018ºÝ®î\\äõõ\u0015\u000e\u000f\u000fÅa\u001c¬HP!«Õ*ØØØ÷÷w8==U\u000bíîîe0\u0018Ô\u0015*Ëp~~®+C,t´£ßïC±X\u0014¦T\b×ïîî`:ê\nÕj5¨V«b\u001d\u0019Çb\u001fR©\u000b6\u0015\tî\u0011ÚBÈÇÇ\u0007¼¼¼¨Z\"v»­î'ð¹Êçóâ0\u000eV$¾Sn\u001d\u000eÜ^]]áp\bLFwÎçççÿ)är9æñxÄ×Æd2B¡`þ\u000f#>[øÿEÛ¦\u0017ù-4ßBóøq\u00109`EB61Êöö¶r:ï9\u000fV$ä £\\__+§åèè\bâñ¸½½=1¿¢\f\u0019V$ä £\\]]RÜ>\u0015È9ZXÍð*Èúþþ¾bËg\u0011¬HÈFá\náMöç`EBkø\u001däB¡PH±ã3dX Ãï¢-ôwZÂús°\"J¥tAF¹¼¼\u00143FØËó`E-øiñ­ÁçóßïËÖÖx=}ÂfÂfÂæ\u0001?eC\u0019\u0013\u0004Ï^Â\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÂ\u0000\u0000\u000eÂ\u0001\u0015(J\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0001îIDATXGÅMNÃ0\u0010Û&Í\u000f\b5ý\u0011bß-ìYr\u0004À!8\u0000êß¾êÛq\tvlÂ<'.öxRì¨rô%£Ì³óäºrFu]+¸ôóØü\u0015L¦)&ÍE\u00107Æ¢S9\u0006Ì1\u0018eY69Nã6ÇYªÙ!>Él6£Üó¡¤v»\u001dfSð^\bJyOÊO|Åbq\u000eÓ´í~\bÐ¸([UyJ\u000f6WÅD÷û\u0000M(Ðª<¤\u0007òU1Ñ>@X¡RU\u0017¤\u0007l·['\u0000G{û DÒ¦reçó¹ór\tsL(\u0010VÈùÛCÚä³*&z\\\u001f \u0002%ªbÁwULÌ\u0017\u0002¥\u0014hªªVh®ùP kSãaUa<\u0012/Ä+ñF¼\u0013\u001fÄ'\u000fÀÆeYÞ£Øl6|âhXV«ÕÓz½þÒÍ!à)Ð·n\u000e\u0015~²\u0007\u0014´èæc`\u0005¢M«ªÕ\u00156u0<uÚ£1Øß\u001e\u0017)æÒ!Ú9>\u0014È9:¸©ë3£\u000b>>\u0004hJ¬£C2\u0002ßÕâãB\u0010¨RU+É¨ñY->&\u0004\b\u001fh7ªj%\u00199ËåÒ\t¢áÞ\u0010 \u0004:ojÉÔÅ~¿wÂ4SÈ~\u001f >ò3U$ÓðÕâý\u0010 lhë´ïÃáp¸N $IÒãñX¨4$É\u0014BUUt{>±\u0010%\u0019c!J2Æ¢¹\u0018âØ\u000f£\u001eý\u0002\u0019-Ú>üÙã\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000e¿\u0000\u0000\u000e¿\u00018\u0005S$\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.134\u0003[z\u0000\u0000\u0001\u0012IDATXGÍÓ½@\u0010@aj £\u000fú@\n $* Hnv¥µ}Ü\u00130ËIãàµoÇhädß÷¯Ñ\u0012FK\u0018-a´Ñ\u0012FK\u0018-a´ñ®iä\tÉ/UUÉ\u0015ÏßñJY\u0016ù´,ñ{¯`¼\u0012\u0016*BïÞuÝk©Ï®ñmÛüBÃ0ÈgÎ`|b\u001cG¿Ð<Ïrä3\u0018\b_Y]×rä3\u0018c5Mãqwwaõt\u0019\u0007c°û\u0007\u001eï40jý×2\u000eFu]ý2}ßËg40jOçØcaÔøÚÚ¶#Ïh`´Ñ\u0012F­<Ïåï´0jßs¼Q#Ë2¿L¦rä\u0019\r0ZÂh\t£%0ZÂh\t£=ù\u0001-\nÆÎh+d\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000´\u0000\u0000\u0000´\b\u0006\u0000\u0000\u0000=Í\u00062\u0000\u0000\u0000\u0001sRGB\u0000®Î\u001cé\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000.\"\u0000\u0000.\"\u0001ªâÝ\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\fíIDATx^íÝå4\u0010\t\u0010Hs\b\u0010\b\u0010\b\u0010\bg6\u0004B \u0004È\fªÝ1\u0018mÝUË¶~Ú®ï¥f®-Ke¹Õå¯ÞÞÞ¹\rR4&+R4&+R4&+R4&+R4&+R4&+R4&+R4&+R4&+R4&+R4&+R4&+R4&+R4&+R4&+R4&+R4&+R4&+R4&+R4kñío}ÿÎÏ\u0005\u001fuõ§\"E3\u0017ô\u001bð\u0013ø\u001d¼\u0005ù\u0003ü\u0002~PÇ|\nR4s\u0019Ùã~\u0000Ê°-ü\rhîoÔyî\u0014ÍXh<p\u0015¿Ç\u0018[f\u001c0\u001bC\u000bö¨ÊWÂ\u001eûkU;!EÓ\u001f\u000b°÷TæëÅàÖH)¾ÀT43\u0007qÊt#øYë\u000eHÑô\u0003fmæ\rfPn\u0017HÑô\u0006\u0002gÌÌXF$\f\u001fÔÿ´À²ÜÊÔR4}yZòÊ\u001b³\u0000ÒxÐ·\t£\u0006¿©¥h®\u0007¦aA\u0019ê\u0015Íé6ü?Í}d ùA\u001d/#R4×\u0002Ã°UFRÎDà÷ßÖ§ÁêXÙ¢¹\u000e\u0018qs4Ï|éã\u001fÇjÉqÿ©\r)ëQ¢3]bY\u001c½u-¾æßiþô±´\u0014Í5À iJº\u000eÌxì÷sìÏI\u00133®ÿNý&+R4×ðn½\u0014\f\tº\nç ©oiâ=R4çi~\u0004ÊÀ%?©ßcHÑ\u0007FôÎ¿«ßãHÑ\u0003FöÎ[¯Ü\u001b)sÀ¨Þù¶\u000bf\"Es\u001c\u001852Âàm¦WBæ80j$ïìÞ¹\u0013R4ÇQù*2ð\u001e÷Î\u001d¢9\u0006ÊÙ6eâ=¿¨ßk¢9\u0006Ì\u001a\u0019\f:³Ñ\u0011)v`T®P\u0006Þã¼sg¤hÚY#ëo±Dse¤hÚYËÅ?%«ßk¢i\u0003fd7~U¿5×\"EÓ\u0006Ì\u001aÉn<zÏ¹QHÑ´\u0001³Ö&S\u001cn\fB¦\r\u001a¶0pÃAHÑÄY#ñ³³\u001b¢C³\u0016æUx2e\u0010R4q`Vnò¢L¼áøy R4q`ØÚÐ³\u0003¢CÃ\u0016\u0006.ñRÑHq%`\u001fÆ)Qÿ;\u0003¥á°¡\u0007\"ÅY ñùª=\u0007YÜ-²rÓÍa§\rºvey¿R5\u0010)\u000eÎîfß¼¹á\u0015\u0014ePØÐ\u0003â(ÐØ=>3ô\u0011/Î_â)ïHq\u0004hè\u001fËéºµÖâ¼\nÇÐ\u0003bOÐÀ¯î\u0015CLsÔ²\u001cö\u001e\u0014{ÆU\u0006ö¤»©qüÚÍymj³ Å\u001e aGyã\u000fU«Àñk3Äqô ¤Ø\u00034ê0ã\u0015ÝÞ´Æ±#ï\u00122\u0005é­\u000b\u0006 Å«AcFz±\u0012Þ\u0000\u001c8~öÆÝZÓ|ÝzI\u001c;3·©;#Å+A#2Ç¬\u001aø\u0015á|2þ½c4éÖKâ¸7V\b³:\u000e?:\"Å«@ãml«Æ-ac7OBà7-±y\u0014\u001aË2´¤ \u0019ñK\u0007¤x\u0015h´è§ÌhÈÃ³|øm©»Ì&â¸Ñ-t÷ðfg\u001dÙÜ\u0017!Å+@#EÞä \u00028\u0006ÃH/Ù-/c\u001dø²ç¦ÁysØä\u0007â\u0015 A\"6\u001að²ï}àXÑX¶W/Ý#5É:¢Ñy³ppM¶U\u001ed\u0016Hñ,¨èhï|ù÷EpÌÚÌ\u001déÙK÷0uÍôd3=3A4ýð\u0005[3âYPÞ¹Ë\u001c8n$«B\u0003tëÝxl\u0010¹±FÂl3<C[~\tKg@E±1Utë9pìº}\nç y\"qýL6¿ü@~&¤x\u0006TJ$íº`\u0007ÇôÒCÖXà<\f¿Z'fB³\rS*R<\u0003*\"wî^Y8G¤\u001eöØÅ¹øäbO\u0018ÍË¯\u0000Ã\u0014'izn)\u001e\u0005\u0017\u001eY×ðAýöjpH^xÊÒNõDs\u001e<\u001ea\u0013ÓË÷ÚR<ÊûE«\nÙ3lê\u0017çªÅ¯Ó÷Ì@\u0019Øs3D¢Á[½\u0007gø´l-Å£àBk=ÎP\u0003á|KÝ`- \\ìÅ7£\u0013Pd\u0005Ã³£XòÎR<\u0002.0{\u001eúÁ\u001c/\u0012\u0002¥}£\u0004e§á\tÃ+70M?*áyJÿIñ\b¸°HÌ:¼7Ä9zj\u0004×¶3áiö«Ó<Þ2QJñ\b¸¨ZjjqpÞH\u001añ\f¯ÀõÒèÌ;³G¿ª7_âI'Å#àj±ÝìF\tÎ»\\(´\u001a¸~\u001a½øÙ|ùtSK±\u0015\\\b+D]ài\b»v³u}ï0\u0013¨ÍÜG{î©SJ±\u0015\\\u0004ã4uq{¦-Ä¹#ÙG-â:a»F&¨J¦õÔRl\u0005\u0017À\u0001º°)3\u0012?rÃyý\u0017 nX­éÂ)\u001bìH±\u0015\u0014¾¶°}ú\u001eÉ(Cmt6}7\nÔQµã*\u0018þTb+(xí±4Ý,(Cí¦óNû\u0001POì­£©¿áìH±\u0015q!%Ó÷wC\u0019\"yòG¥ïÂz\u0002QS\u000fm{)¶\u0002G2\u001cÓßC\u0019\"é»%§sW\u0004u\u001555ÿgØÚ\u000f)¶ÂF\u0006\\Kô|(Ç¹ò¬ ¾\"K\u000bÈ°B- °UC¿\u0005Ê²älffPgâ°XZ- °µ\u000bZÆ$(ãè\u000e Î\")½!õ*Å\u0016PÐ¡ù¬\u0019Êâ8º\u0003¨³HG1dy\u0014[`A,õ>Çqt\u0007PoK,/b\u000b(h-\u0007½Ô'\u0019P\u001eÇÑ\u001d@½U\u0017¿é\u0014[@A³\u0019Úqt\u0007PglW÷ô­\u0014[@!³\u0019:\u0012G{]Ç\u0001D=t¯W)¶BÖ\u0019.g\u000e©\u0016ïy]Ç\u0001Po5/tïÜ¤Ø(tÉr»h¢Lµu\u001dþÐÏ\u0001PoÓÖRlA\u0014ºdECG^ËòúèFPgÓ\u0017©I±\u0005Qè\u0015\r\u001d²u\u001cÝ\bêlú\u0014[\u0010.YÎÐ\u0004åª-¬yô{G@ÕR¢î¡{rÕâh¿gØ\bêÌ1ô,P®È¢ôÛË\u0004õeCÏå*Ê©ð'Ø\u001a@}ÕÂ8\u001bº'¢¬%£ ®xÑC-B¬lèÚ#Òqt\u0010ÔÕ\u0012/zH±\u0005Qè\rí8ú\"POÕº,Ó\u0003)¶ \n^°²¡\u001dG_\u0004ê©ö´\u001b²X-,kh\"Ê[â8º\u0002ê(\u0012?§Yà¯\n¿guC;>\tê(²$wÈN-  µkÝS5g`ùò*\u001cG\u0001ÔOm\f©C)¶NO¦\u0001ås\u001c}\u0002ÔM$Ü\u0018ö\u001a\u0014[`aÂ,mh\"Ê\\â8ú\u0005¨ÈÊÅTûr0~âclß^:n.Ayk7¥×G¿uSÔbØR\\)>\rTx$öúè\u0002Ô\t;0UW{¾E/Å§J¬ö~\u001d\u0005¨Ú\f]W.Å'¯-¬ñ~\u001d;P\u001fÁôð-!¤øDPùÕ\u000fæ¿y2¨Hï<<! Å'Ê_fr`uP\u000fÞ\fÏßKñ°òÆPx{\u0003zd6¦Ô\u0014\n\u001aá±_:dÈ¬\u0014\n\u001aÁ_ý\u0002¸vî:\u0015ÙµÚD\u0014\n\u001a\"¾{ì¬!®=²fcè'(J¤ødÐ\u0018µøða\u0007®;2B¦.uâAD¾:û¨l\u0007®7\u001ajL_\" Å'F\u001dÊvàz#9g2}\r\u0014\u000e\u001a&zÄ\u001ai\\g4«±ÄLª\u0014\u000e\u001a'í¸ýÞw¸ÆhÜ<u ¸GO\u0007\u0013Ù\u0014ýÖKJq}\f½\"q3YfL!Eó±A#)ªTë¾£àº8kZdÚXj<!Eó±Q#k;úÂ×Uàº¢fæXc©±\u0014Í'ÐXGî­\u0016þãzª«\u000eßaÝ,7k*Eó\t4Xd\u0014\u001e¯¥¸¶/±ä Xæ\u0013h´Èà¤ï¥q\r-f^ö&¢ù\u000f6^ÑÔ±4Êßbæ¥¯Uæ?ÐÑ^:eÆ\u0003ån13\u0007KO(IÑü\u001f4b¤ÑSå¥Q^¦æ\"©É%\u0007%R4ÿ\u0007\r\u0019í¥ßT -yfÂÌDæsÐ ÑGóÒ\rÏòè\f Icf\"Eó9hÔè\u0012ÊeãL+2Y´'\u0014\u0006jåÙ\u0006ÊÓ\u001a/tf&R4¯A#§ZãrpËÈrØ=)ÍL¤h^ÃÞ5|i³i87{åÜFZ3\u0013)/\u0006\u001edøKµ8'×sGâýåóÌ5¤hê¼7¾2ñkw£à\u001c\u001côµ\u0017\u001bCÊØ\u001b):l|ÐÒ\u000bÒh]f\u0013qÜ3F&)òç\u0011¤hbÀ\b­9]Â\u0017NOÇ¨8\u0006Ó|CýHh±ÁßÞê\rv)80Dknw!\u000bcÝðJ=ü/3\u00164qK¸ó\nÞXéC\u0012)6`£¦Þ`¸@q°YÂØö\n\u0003o°W¾íæíR4íÀ$4õÇÿ\bxÓÜúÓ\u001aR4ÇYÄÔ#à\u0013à\u0011»=IÑ\u001c\u0007Æaö#ºÓPoxs1l¹]¬ü\n)óÀDG'7®àqFÞ¢¹\u0006\u0018©µ#ÓÏGahÁ\u001béqFÞ¢¹\u0016\u0018l3v\u001eÇä±o¹éM+R4}é\u0018_3\u001bÂTÜ\u0019s3Ç|´M\\ E3\u0006\u0018Y\u0011\u001a|Ë7s0YÂÞçÿÙÀ\u0015¤hLV¤hLV¤hLV¤hLV¤hLV¤hLV¤hLV¤hLV¤hLV¤hLV¤hLV¤hLV¤hLV¤hLV¤hLV¤hLV¤hLV¤hLV¤hLV¤hLNÞ¾ú\u0007(`L_zgE\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000µ\u0000\u0000\u0000´\b\u0006\u0000\u0000\u0000Ò\u000fm\f\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000b\u000f\u0000\u0000\u000b\u000f\u0001ù\u0003¥\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0007FIDATx^íÝO]g\u0019Çñ¡R\u001bÐ*Öj« hÈ¹çÌTîÂ(H\u0010\u0015ñßÎnt)þC¨R*ÔM²éFAPp\u0013(\u0014\fÓÌ{Æ\u0012P\u0010ÄP\u0015¡.¬EeÌÌ=ç6C\u0017\u0005\u0017º\u0012ÄëÂKü9yÎ¼÷9Ìsø.>\u001fyçÍÜûM\u000e7³2ÍA#\u0010\u001cÈä\bD&G 29\u0002É\u0011L@dr\u0004\"#\u0010\u001cÈä\bD&ÇEãk\u0007§Ëª¹R¤z\u000781¶&V½\u001eã¢r³y[\u001bõ?Z3à¤(Òä\tÕë!9.\"jDDÁ!j\f\u000eQcp\u001aCÔ\u0018\u001c¢Æà\u00105\u0006¨18DÁ!j\f\u000eQcp\u001aCÔ\u0018\u001c¢Æà\u00105\u0006'+êqµ÷@ê¿©y\r81ªæ+ª×Cr¼ÝøÆìÞµêSÀI±rivjõ\u001cÈä\bD&G 29\u0002É\u0011L@dr\u0004\"#ºûÀóÍ#£W7réfÙ~Áÿûo°.\\º~Ïhk_ïêÜNý°ºcÑZ5y:ÛU±½·þX5»[Ý±LrDwE<sû£ÜcIÍ?ÏýôÖÛÕ\u001dsåÎ«ï)Rýoy¾£¢j~¤îXT¦úûêlg©þ×F¾[Ý±LrDwDm@Ô±\u0010µ\u0001QÇBÔ\u0006D\u001d\u000bQ\u001b\u0010u,Dm@Ô±\u0010µ\u0001QÇBÔ\u0006D\u001d\u000bQ\u001b\u0010u,Dm@Ô±\u0010µ\u0001QÇBÔ\u0006D\u001d\u000bQ\u001b\u0010u,Dm@Ô±\u0010µ\u0001QÇBÔ\u0006D\u001d\u000bQ\u001b\u0010u,Dm@Ô±W\u0014©ùZ®Qª¿tæ»÷©;æÆ\u000fN·1~Uïj´]XÝ±h}{ÿêlWmÔ_>¦÷«;I@dr\u0004\"#\u0010\u001cÈä\bD&G 29\u0002É\u0011L^T_lý&WYÕ?»Ó?â\u0017Ïí½³¨ê_«ó]GüÒ¹QªTg»j¿·_¬>ÿúÕ\u001dsg7ÿú`ûg_¸ýìqRóMuÇ¢Q|]í¬ªu§§¥Ë G/í\u001bþçÑé1´/ÎßWùËo|¹Ù¼¯½ï?ê|WEj¾§îXÄcr!>&'j\u0003¢Î&G/Dm@ÔÙäè¨\r:\u001c½\u0010µ\u0001Qg£\u0017¢6 êlrôBÔ\u0006DM^Ú¨³ÉÑ\u000bQ\u001b\u0010u69z!j\u0003¢Î&G/Dm@ÔÙäè¨\r:\u001c½\u0010µ\u0001Qg£\u0017¢6 êlrôBÔ\u0006DM^Ú¨³ÉÑ\u000bQ\u001b\u0010u69ziß\u001f´¡ÝÌÕ¾\u0011/¯\u001dVwÌ\u001d¾xêì±¤úÛêEE>-ÏvÔ¾F/o<;y«ºcîOõ¤zWïªý:\u0017Õ\u001dÚ×û)u¶»æÏë;¯=¤îX&9\u0002É\u0011L@dr\u0004\"#\u0010\u001cÈä\bD&G 29zÙØnFEj>oza¥ªîVwÌùùî}úlw£«ÍûÕ\u001dÊtkUíjôÉG/\\Ý£î[«^9Un5\u001fWç»Z¿ºwVÝ±h-MÏ¨³]ÛõÇ\u000eÿîêe£ÇäwÆcòlrôBÔ\u0006DM^Ú¨³ÉÑ\u000bQ\u001b\u0010u69z!j\u0003¢Î&G/Dm@ÔÙäè¨\r:\u001c½\u0010µ\u0001Qg£\u0017¢6 êlrôBÔ\u0006DM^Ú¨³ÉÑ\u000bQ\u001b\u0010u69z!j\u0003¢Î&G/Dm@ÔÙäè¨\r:\u001c½\u0010µ\u0001Qg£\u0017¢6 êlrôBÔ\u0006DM^ÖªÉ££­æsùö?ùX5;òã\\ï}vò&}¶»2í¯ª;\u0016­oM\u000bu¶«r{ò©;kvj´]Vïj-ÕkêEÅæä:ÛUûøÁ}\u000bè\u001cÈä\bD&G 29\u0002É\u0011L@dr\u0004\"£\"5ß-ªúOùß/ß8ò\u0017\u0019­>×<ÒÞ÷²>ßM¹5ùºcQêêlg©~q\\í= î[ÿñÍÊTÿQï¬yJÝ±¨}\u001dÐg»j^z4í¾CÝ±LrôÂcr\u0003\u001eg£\u0017¢6 êlrôBÔ\u0006DM^Ú¨³ÉÑ\u000bQ\u001b\u0010u69z!j\u0003¢Î&G/Dm@ÔÙäè¨\r:\u001c½\u0010µ\u0001Qg£\u0017¢6 êlrôBÔ\u0006DM^Ú¨³ÉÑ\u000bQ\u001b\u0010u69z!j\u0003¢Î&G/Dm@ÔÙäè¨\r:\u001c½\u0010µ\u0001Qg£öxºýÆþ«}#~y>MïWwÌ»R?Ü¾¿Wç;Û~CÝ±¨ý;}Gí¨ý}áÌÝ·¨;æ\u000e?=Ò¾/ªó]Rý¤ºcQ{×ãêì1üîìæÁêe#\u0010\u001cÈä\bD&G 29\u0002É\u0011L@dr\u0004\"£\"ÝúPQÕ_ÌU¦úó\u0017.]?ò÷¢¯\u001d.Óô\u000bê|W£­ý\ru\u0007N&9z\u0019òcr\u001crôBÔè\u001c½\u00105ú G/D>ÈÑ\u000bQ£\u000frôBÔè\u001c½\u00105ú G/D>ÈÑ\u000bQ£\u000frôBÔè\u001c½\u00105ú G/D>ÈÑ\u000bQ£\u000frôBÔè\u001c½\u00105ú G/D>ÈÑ\u000bQ£\u000frôBÔè\u001c½¼\u0011ÚÖä|¶ª\u0019¯\\Ý¥î\u001b_¾q¯<{\f}ü§X\u001e9\u0002É\u0011L@dr\u0004\"#\u0010\u001cÈä\bD&G 29\u0002É\u0011L@\\³ÿ\u0002±\u0011\u0001r¼A¡Z\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000´\u0000\u0000\u0000´\b\u0006\u0000\u0000\u0000=Í\u00062\u0000\u0000\u0000\u0001sRGB\u0000®Î\u001cé\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000.\"\u0000\u0000.\"\u0001ªâÝ\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0006IDATx^íÝÁd\u0015DÑ1A&È\u0001ù0È2¢µ@>\t2AB\u0006ÈRôî\u0011\\è¢¡:úîâl\u0017\t±ÈÊü¿}||H¯¡ôT\u0018JO¡ôT\u0018JO¡ôT\u0018JO¡ôT\u0018JO¡ôT\u0018JO¡ôT\u0018JO¡ôT\u0018JO!ùË?þó7é'ú3íð{0$9ð!ýD¿Ó\u000e¿\u0007C\u0002\u0007¥¯ä õ*\u000eZ¯â õ*\u000eZ¯â õ*óAÿ+þx'woÿû^þ\u0017ôº_ÍíLæþ¡\u0002\u000bOîÞÒýÛ?!î{ù^÷«©ÎÄAÖ»·twÐ\u0007\u0004\u000e6\u0007=î\u000eúÀÀÁæ \u0007ÒÝA\u001f\u0018\u00128Ø\u001cô@º;è\u0003C\u0002\u0007\u001eHw\u0007}`Hà`sÐ\u0003éî \u000f\f\t\u001cl\u000ez Ý\u001dô!ÍA\u000f¤»>0$p°9ètwÐ\u0007\u0004\u000e6\u0007=î\u000eúÀÀÁæ \u0007ÒÝA\u001f\u0018\u00128Ø\u001cô@º;è\u0003C\u0002\u0007\u001eHw\u0007}`Hà`sÐ\u0003éî \u000f\f\t\u001cl\u000ez Ý\u001dô!ÍA\u000f¤»>0$p°9ètwÐ\u0007\u0004\u000e6\u0007=î\u000eúÀÀÁæ \u0007ÒÝA\u001f\u0018\u00128Ø\u001cô@º;è\u0003C\u0002\u0007\u001eHw\u0007}`Hà`sÐ\u0003éî \u000f\f\t\u001cl\u000ez Ý\u001dô!ÍA\u000f¤»>0$p°9ètwÐ\u0007\u0004\u000e6\nlÃ\u0002;0$pPúJ\u000eZ¯â õ*óAÿ=¾ýò\u0004OîÞúóè·ÏÔôº_ÍíLæþ¡\u0002\u000bOîÞÒ½Çá·\u001c\u0001\u0007\u001eHw\u0007}`Hà`sÐ\u0003éî \u000f\f\t\u001cl\u000ez Ý\u001dô!ÍA\u000f¤»>0$p°9ètwÐ\u0007\u0004\u000e6\u0007=î\u000eúÀÀÁæ \u0007ÒÝA\u001f\u0018\u00128Ø\u001cô@º;è\u0003C\u0002\u0007\u001eHw\u0007}`Hà`sÐ\u0003éî \u000f\f\t\u001cl\u000ez Ý\u001dô!ÍA\u000f¤»>0$p°9ètwÐ\u0007\u0004\u000e6\u0007=î\u000eúÀÀÁæ \u0007ÒÝA\u001f\u0018\u00128Ø\u001cô@º;è\u0003C\u0002\u0007\u001eHw\u0007}`Hà`sÐ\u0003éî \u000f\f\t\u001cl\u000ez Ý\u001dô!ÍA\u000f¤»>0$p°9ètwÐ\u0007\u0004\u000e6\u0007=î\u000eúÀÀÁæ \u0007ÒÝA\u001f\u0018\u00128Ø\u001cô@º;è\u0003C\u0002\u0007\u001eHw\u0007}`Hà`sÐ\u0003éî \u000f\f\t\u001cl\u000ez Ý\u001dô!ÍA\u000f¤»>0$p°9ètwÐ\u0007\u0004\u000e6\u0007=î\u000eúÀÀÁæ \u0007ÒÝA\u001f\u0018\u00128Ø|hÐ\u000f\r:0$pPúJ\u000eZÏô×þr\u0007­W\u000fÚ\u0006môçQ\u001f\u001aô\u0019p°ýP'woéÞãð[ÏÍA\u000f¤»>0$p°9ètwÐ\u0007\u0004\u000e6\u0007=î\u000eúÀÀÁæ \u0007ÒÝA\u001f\u0018\u00128Ø\u001cô@º;è\u0003C\u0002\u0007\u001eHw\u0007}`Hà`sÐ\u0003éî \u000f\f\t\u001cl\u000ez Ý\u001dô!ÍA\u000f¤»>0$p°9ètwÐ\u0007\u0004\u000e6\u0007=î\u000eúÀÀÁæ \u0007ÒÝA\u001f\u0018\u00128Ø\u001cô@º;è\u0003C\u0002\u0007\u001eHw\u0007}`Hà`sÐ\u0003éî \u000f\f\t\u001cl\u000ez Ý\u001dô!ÍA\u000f¤»>0$p°9ètwÐ\u0007\u0004\u000e6\u0007=î\u000eúÀÀÁæ \u0007ÒÝA\u001f\u0018\u00128Ø\u001cô@º;è\u0003C\u0002\u0007\u001eHw\u0007}`Hà`sÐ\u0003éî \u000f\f\t\u001cl\u000ez Ý\u001dô!ÍA\u000f¤»>0$p°9ètwÐ\u0007\u0004\u000e6\u0007=î\u000eúÀÀÁæ \u0007ÒÝA\u001f\u0018\u00128Ø\u001cô@º;è\u0003C\u0002\u0007\u001eHw\u0007}`Hà`sÐ\u0003éî \u000f\f\t\u001cl\u000ez Ý\u001dô!Í§`mø\u0014¬\u0003C\u0002\u0007¥¯ä õ*\u000eZ¯2\u001f´OÁÚèÏ£>\u0005ë3à`û¡\u0002\u000bOîÞÒ½Çá·\u001c\u0001\u0007\u001eHw\u0007}`Hà`sÐ\u0003éî \u000f\f\t\u001cl\u000ez Ý\u001dô!ÍA\u000f¤»>0$p°9ètwÐ\u0007\u0004\u000e6\u0007=î\u000eúÀÀÁæ \u0007ÒÝA\u001f\u0018\u00128Ø\u001cô@º;è\u0003C\u0002\u0007\u001eHw\u0007}`Hà`sÐ\u0003éî \u000f\f\t\u001cl\u000ez Ý\u001dô!ÍA\u000f¤»>0$p°9ètwÐ\u0007\u0004\u000e6\u0007=î\u000eúÀÀÁæ \u0007ÒÝA\u001f\u0018\u00128Ø\u001cô@º;è\u0003C\u0002\u0007\u001eHw\u0007}`Hà`sÐ\u0003éî \u000f\f\t\u001cl\u000ez Ý\u001dô!ÍA\u000f¤»>0$p°9ètwÐ\u0007\u0004\u000e6\u0007=î\u000eúÀÀÁæ \u0007ÒÝA\u001f\u0018\u00128Ø\u001cô@º;è\u0003C\u0002\u0007\u001eHw\u0007}`Hà`sÐ\u0003éî \u000f\f\t\u001c¾Ö«8h½Ö«8h½Ö«8h½Ö«|ù ~¢?Ñ\u000e¿\u0007Cé©0\nCé©0\nCé©0\nCé©0\nCé©0\nCé©0\nCé©0éã·ÿ\u0003¼ÖºÆýwq\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000´\u0000\u0000\u0000´\b\u0006\u0000\u0000\u0000=Í\u00062\u0000\u0000\u0000\u0001sRGB\u0000®Î\u001cé\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000.\"\u0000\u0000.\"\u0001ªâÝ\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0002XIDATx^íÒ±qÝP\u0000\u0003A5ä\u001eT¯»r%~Ê¹ð1¹Á&a\u0006_×uÁ##¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª§üùûï\u001b>ê\u001fOÈxÊï\u000b>îßxJÆSj\u0018ïtÿÆS2RÃx§û7ñ\u001aÆ;Ý¿ñ§Ô0Þéþ§d<¥ñN÷o<%ã)5wºã)\u0019O©a¼Óý\u001bOÉ\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°*#¬Ê\b«2Âª°éúú\u0001kI¦:o\u000fj\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000´\u0000\u0000\u0000´\b\u0006\u0000\u0000\u0000=Í\u00062\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000.!\u0000\u0000.!\u0001\u0007[üÿ\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\fJIDATx^íÍ­%·\u0011\u0015Bp\u0002\u0006\u001cBP\b\na2°Ö^)\u0001\u0003Zk¥\f,ÀKo\u0014¼5\fC\u0019Ï\u0019O\u001bw8g^W³ùWì³ø6ç½Û·YUM\u0016dß¯Þ¿oÌ6HÑ¬HÑ¬HÑ¬HÑ¬HÑ¬HÑ¬HÑ¬HÑ¬HÑ¬HÑ¬HÑ\fá\u001b¡HÑ\fÁ\u0001Ý\u0001)!8 ; E3\u0004\u0007t\u0007¤hàî\u0014Í\u0010\u001cÐ\u001d¢\u0019\u0003º\u0003R4Cp@w@f\b\u000eè\u000eHÑ\fÁ\u0001Ý\u0001)!8 ; E3\u0004\u0007t\u0007¤hàî\u0014ÍùãOÿüÒ¯ò×üçG\\ë\u001dø\u0006üAý¹\u0014Íÿ`ð~\f:\u0006ß¯à=)ÿ¯?ÿí_\u001f®Uð\u000bø\u0001|\u0007\u001cä\u0015Hñ©0\u0000\u0003øg \u0002î\u0003åçjøB@ü\u000eø01À¿V×1\"Å'@a/Ì^ñ7 ê3ÊkÔ\u0010\fè\u0012\u0012|àÜ{\u0001)î\u000e\u0002âë\u0011\u000eâWÊëÕP\u0019Ð¯0=ùN]ûÉHqW\u0010\u0000q\bW\u0001\u0012¦¼n\r\r\u0002úi\tG\u0018÷Ú@»\u0001g3Ù£©¸Lyý\u001a\u001a\u0006ô+|X\u001f\u001dØRÜ\u00058·i \u001fßSC§>xl`K1;pf@>(¿¯¿üýßÿ/\u0003väq-Å¬ÀyìÝÎ\u0005<òº\u001f\u0016BÔwWðá:¸\u001eK|\u0000¿\u0007,\u00172'V÷P\u000b¯÷}ñÝÛ\"ÅÀi\f¶VÁðZÿíÕÃ}ñÁÀw\u001e\u000b:oÖÃ/Ârûåv)f\u0002Nb\u000f×\"½8ø[õ=\u001d\b\u0005\u0017î£\u000e\u001f¬VÁÍÈ¶4RÌ\u0002\u001cCGßígÕs/÷¸Ï[õó\u0017øù&{RVC«\u0003g´Èùù\u0013¦[Ã?î½ÅÄ÷ºvf¤¸2p\u0002óËÚ\nÁ\t\u0012XaÈmÏ¢-L¹î<ÜLe¶IA¤¸*0ü· 6Å ÓWr\\Ó\t\u001aÚv§Çf\u0007±E\n\"Å\u0015Á/+gA'¯Xm\u001aÐ\u0007h+\u0003»&ÇfG>¨¥¸\u001a0tÍJ\u0007ªXÔÐ% \u000fÐv¦VÊ.g¤Þð$Åk9C^Ø5 \tlP;ßH\u001bÔR\\\u0005\u0018öj0¯Þ+¿Ò= \u000f`\u0013Ö½Þ\"ePKq\u0005`Ð«ÁÌ(Ó¾a\u0001M`\u001bæÖW'ÔéZ³!¯\u00063ÿ?[éih@\u0013Ø%¾«)Hª âL`À«ÃcÖÅá\u0001M`¯E©,iÜZ\u0001\rÃ]-ÍeO\tè\u0003ØîJP§)éIq\u00060\u0018s<eL\u0005\r<3 Z<HÓ\u0003\u00046ä¾\u0010e_\u0005m¾|Z'ÅÑÀPÌí¢\u00134½E\u0006`Ë+£â¯ê\u001a+!ÅÀHÌé¢\u0013\u0015\u0007s\u0007`Ó+Aý£ºÆ*Hq$4Pa°·wî\fl{e2¾ìÜE£a¸ÙH\u0019Ly\u0002\u0002Ø8Ú¹p¤\\²æ/Å\u0011À L5¢yócÎÄÍ\u0006¶îØûE}~6R\u001c\u0001\f\u0012=R´tÎ¶\u001b°÷9Írk\u0000Rì\r\f\u0011M5hØm6g\u00016ç¦¦Èè¹\\ê!ÅÀ\u0000ÑTÿãÆ$`ûhåc©ÔC=\u0001¢³éíÎ»e\u0003>¦Ë,K±\u0017h8\u0017PAJ~V7c\u001f8FN¿ü¦>?\u0003)ö\u0002\r<ñL57/\u0002|\u0011ï,1¢J±\u0007hpt¯SÅOÒtDRì\u0001\u001a\u001b©o.YÛ|:ðKt¯Íôõ\u0002)¶\u0006\röÎ^Ú^\u0014ø&rèvz/-ÅÖ !Ë\u000b(\u0003\u001fE&SSF)¶\u0004\rV62\u0007|$ðQ¤6=µâ!Å º³{ç$ÀW^zZ]Z-Aã\"\t÷ÎI¯\"½ô´u\u0004)¶\u0002\r4Þ½s2à³H/=¥b+Ð¨ÈdÐdÀgÇÉ¡\u0014[\u0006E&ËQ3\u0003¿E|;er(Å\u0016 A\u0013Å^\u0015L\n|\u0017\u0019}ïb\u000bÐÈÊ ÷l$\u0005¾ìñ\u0018¾r(Å» !Ü¥¥\u001aøwÔ%\u0007><«`\rO)¥x\u00174$òôúÐkràÃÈ¡Ú¡£°\u0014ïF,×PÓ\u001eøp¹KwA#ÎêÞU·\tÂ·%C×\u0019¤x\u00074 RÒñk\t6\u0001¾<ü\u000fÍ£¥x\u00074 2\fy1e\u0013àËÈ\"Ë°ôRwÀÍ6°üÉ\u000bü\u0019Ùë>¬\u0003â\u001dpógCóçÍ\u0010>.\u0019bJñ\u000e¸ù³\tá\u000fês&/ðéÙM\f¥x\u0007Ñ\u0012×7\u0003>=+Ó\u000e\u001b¥X\u000bn|©|Ê\u0001>]fÞ$ÅZpã§\u0001]~Æä\u0007~]ÆïR¬\u00057~ö¤þ®>gr\u0003¿.32K±\u0016ÜôY@»Â±)Â×%)\u0003úì@¬\u0003zS¯K\u001cb-¸é³\u001a´Ï\u000fn\n|{V®\u001dRb-¸é³ö\u001eMoð½\u0014kÁM; \u001f\n|ë6û\u0000ß: Í>À·\u000eh³\u000fð­\u0003Úì\u0003|ë6û\u0000ß: Í>À·[\u0006ôÙÛt¼R¸)Â×%C¶\rK±\u0016Ü´÷r<\u0014áë-7'-ó{v¦\u001dðkä¤Ê>}\u001ftù\u0019\u001fø5²}tÈû¢¥X\u000bnzqÀ§ËtdR¬\u00057¾ÌÐcÆ\u0001¥Ã^6#Å;Æ¸t·\u0019ðéYÉ.ç!YÂ/\u001aSâ×èn\u0006|zöZÝa\u0014ï?;ÒîJÇFÀ4sØ«+¤x\u0007Ü|ä§(<1Ü\u0004ø2òKgÃ~BwàÍ\u0017Qøe3\u0000_ÈCOúKñ.¢Q%>[¸\tðåRï\u0002â]Ø¢Q%Î£7\u0000~ÆC«ZR¼\u000b\u001a\u0011É£ÿäi\u000b|¸¥x\u00176¢hÂo!M\u000e|xöÖÑáoÊb\u000bÐ³ÜÊiGbà¿H¹nø\\I-@cÎÞ¢D¼\f\u0014øîl¹\fy[Ò+Rl\u0001\u001a\u0013I;\\íH\n|w6\u0002Oy1§\u0014[F5ø÷\n\u0001E~\u0018jJg%ÅV Q´Ã\u0001eÉðtH±\u0015hTdâàÉa\"à¯¥}*Å q§ÙKáI¯\"?{=mÔbKÐ¸Èæ\u0015÷Ò\t\"½3¶ùL­A\u0003#C÷Ò\u0003\u001fEzç©+)¶\u0006,r¸+\u001e\u0002ßDÎ©[¥Ø\u001a4òkpvª¸â±(ðMd.4ý½+Rì\u0001\u001a\u001bYY\"Þü¿\u0018ðId\u001eD¦¯üJ±\u0007h,{éH.í·+-\u0004ü\u0011\u001d]8+*Å^ ÑÑ'ýú¼\u0019\u000f|qö¾Â%FV)ö\u0004\r?ÛrHØ#8õ\f|\u0010Yâ&Ël\u0005bOÐøèlyØËIÌçÀþ¬9GR¥ªSRì\r\f\u0010©g\u0012\u001f\u0002\u0004l\u001f\u0019IÉRë\u0007Rì\r\u0010h)\\\fl\u001eÙTFÀKq\u00040F4?càûüá `ëèÄ}Éy\u0014G\u0001DgÐ,÷y\u0015±3°qäPÆÁ()\u0002FÖ¦\ts:\u0007u'`[\u0006s4\r\\öýR\u001c\ts¥WpPw\u00006½\u0012ÌKR\u001c\r\f\u0014Ù¼tàs\r=9JF+\u001adéù\u0014g\u0000CEKy¹·{êÀì£)\u001fY~¯\u0014g\u0001]é)~Ü\u0000¶»f\u0014k\u0002R\u0005vuøsPW\u0000qµöJ0§Ió¤8\u0013\u0018/ºäzÀÿu:\bl\u0015­3\u001f¤Ú ÅÙÀWCâ#\\'ÀFWæ)$Ý\b(Å\u0015!k\u000es\nR\u0000pÔ»Êé\u0014W\u0001\u0006­\tjÎÚ|\u0004¶`qÕiç&R\\\t\u0018¶&¨\t|=¶·FÛÙ+G·\u0016¼z¢-ÅÕ ?\u001aZ9à-Ø[?î\r§h3\u0017ªj:ôVR\\\u0011\u0018A\u001d9y¬àç¶?\u00016²\u001cwe¡ä-NÜKqe`øè^]\u0005'Û\u00056ÚÄ@®}ØÙoS!âêÐ\u0001\u001f\u001d¡\u001c\u0014aÀF\u001bî\u00042a\u001a·Õ\u0004Z\u0019#jJQ%4¥:\u0011ûeêÅ\u0007únÛ·,qJ1\u0013pJô\u00056oÁ¼×Y¶×Æ½±ÚÃ ¼32\u0011~~ÛcmRÌ\u0006\u001cDgßí±\u000ex\u001d\u0006÷ô¡\u0018÷Àcj3ÔNôJ¶ß¥(Å¬ÀY\fÄ»=Ø+¼\u0016{EÁº\u00078¾91ÛPS?~\u000b>\u00108l,ÅÌÀqÌ­\u0019Ê±-à$×gà±\u0007e\u0010S\u0015ü/G\u0013~yð\u0011¼­F\u0012>üÇ,0Iq\u0007àÄ»\u0015;°Gäw#Æ\u0015øÐm_{/âNÀ©3\u0003{\u0006\fä\u0003)î\bÌÀîÌ£\u0000'\rä\u0003)î\f\u000eW¶ª\u001cÌ¹7sñÇnÂ*âS@ pRÇ^{V[\u0003\u001fDöÆÞ\"+â\u0013A\u001cÁ½bÏÍØA\u001c@O\u0003X{fImF3ùp1x|^|\u0005)OAPqÿ\u0004'Ì½\u0019h­ÊqGy½/\u001f ÇíÝn\u0014M\u001c\u0004á\u0011ì¯08\u0019ü½ì'W×1m¢1Y¢1Y¢1Y¢1Y¢1Y¢1Y¢1Y¢1Y¢1Y¢1Y¢1Y¢1Y¢1Y¢1Y¢1Y¢1Y¢1Y¢1Y¢1Y¢19yÿÕ\u0001\t\"\u001f\u0007=­U5\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000´\u0000\u0000\u0000´\b\u0006\u0000\u0000\u0000=Í\u00062\u0000\u0000\u0000\u0001sRGB\u0000®Î\u001cé\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000.\"\u0000\u0000.\"\u0001ªâÝ\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u000fIDATx^íÝ±ì´\u0012\t\u0010HàV\u0011Â\r\u0010\b\u0010\b\u0010xæ\u0010\b\u0010¸\u0019Áa­SÛû\u001aÕQë_-÷ÃWµkÍXÛív«%ÏþæË/Ap\fR\f\u0002¯H1\b¼\"Å ð\u0014À+R\f\u0002¯H1\b¼\"Å ð\u0014À+R\f\u0002¯H1\b¼\"Å ð\u0014À+R\f\u0002¯H1\b¼\"Å ð\u0014À+R\f\u0002¯H1\b¼\"Å ð\u0014qüç·ÿ}\u0007þ{ã'ðó\u001b~\u0000ßWm\u0006ÿGA\u001b\u001fÎ÷# Cþ\u000eþ\u0000/\u001dù\u0013°Ý_\u0000ûaß©ñ<\t)\u0006vàDß\u0003FÙ_\u0001L9ßLxãÐÑ/'ÿVûT¤\u0018¼\u0006\u000eÂ\u000eÌÈÛ;ê7\u001a#ùñ)\u0014\u0003G`\u0014¦Cì\u0010[áMÈ)ÑqÑ[Ág$¦\u0013ÿ\u0005c\u0002û\u0007e\u0003Hñ©àÂ~\u000b\u0018¹NÄ¥0ró\u0006v=±âÓàEü¸^râÑpRé2jKñ)à¢±\nÀêº¨³¸ª\u0012ÕO\n¦[?*Ûí\u0014O\u0007\u0017LQ\u0017±'t\bös-°ßêR\u001aãäÇ_5nÞ³ÎÃcKñTpQZr\u0000^t:\u0018KzÓËcèçÆUE¦N#ÏqkÇâià\"p²×;µ`ªÀ6\u0019-·Ha\\æ#Êtì-kÚR<\t\u0018\u0011³×d\u0017\u000eân\u0002c¾/\b©s«mmu3Kñ\u0004`hF§\u001eéÄÇ¬²á\\.çîeU?+¢g`\\¦\u0017¢Êø%ðb\u001f¹v\u0007çÇ&oØÖ§\u0018íõ½êc&Rô\n\r\n\u0016([9*\u001a[Á93\u0010°rÒj¿¥ÑZ\u001e¡!\u0013ÃBG~üöK\u0002;ðÉÔâØÖKl)EOÀp,-eªpä\u0017À.-Í\u0014fúj£\u0014½\u0000qâWûñ&\bGÎ\u0000\u001b]©H­QíB\u001e¡8KW\u0006ÌÁó¸\u001c¹\u0015Ø¬¥Ïà1er-ÅÝqj\r»MyÉ+°!5i\b\u0019^\u0005â®À µùò\u0016%¥=k&áL[>\u001d¥¸#0\u0004¹f! ¢ò `ÛÚ2é°ý RÜ\r\u0018+uæ)¸§\u0003\u001b×æÖCZ;\u0013§3Î°¹ÇàQo;¯\u0006öf¯ô:uwj)î\u0002N¸ÆRm\u0005ãík¤]sj)î\u0000N´ÔO8<¸\u0006%\u0013÷_U\u001b-Hq58Q\u001a¥d²\u0011ùòfàzäòêîÎL¤¸\u0012hi5ß|yCp]^ö83âJp²%uæpæÍÁõádñ~Í93â*x²ÉÉ¿#Ù\t¸NS\u000fuf\"Å\u0015ÜNÚÂ´½\u0001A\u001fp½¦Ìq¤8\u001bì£ZÈ\u001c¼D3¡s\u0002kE#9x\u0014g\u0002\u0007µæÍtúpæà-R\u0005\u001c?¢7&Qg\u000e²Hq\u0006pP¦\u001aÖÀc~î5\u0018\u0014g\u0000'µ¦\u001a±ý30#ÅÑÀIùÖrÞ?ÔñAð\n)\u0006Êjrà;LGâ%Ö \b)\u0004Nj]@¼9(F£Z'j\u0004UHq\u0014pTËj\u0004ÕHq\u0004pRktªFP\u0014G@GM\u001cWñ:6\b¬Hq\u0004pVKtvñ<}boè¨ã*\":\u0007ÍH±7pVKÝù¸èsâ/ås\u0011{Vr¥|ý\u0007CD\u001d\u001f#Å|\\0åÀwÜGg\u0003'½­ÿi\u0019SÎ\u001eN^\u0014{\u000bcÙ³á2:cÜ=ÿW\u000eNûÅ\"\u0011)ö\u0002\u0017ÂRªû[\u001d»3\u00183:=ÿ\u0005î\u0007gä=áob/`|Ëdpê\u000fb·±ÒkÓ0jÇâ@½Ñ-Qlû\u000b1òÇ\u001d\u001cù\u000e|\u0011±\u0013¤Øñ_ñ§:n\u00170>¦L=þEÜHÄ\u0004ò\u0003)ö\u0000F¶¼^µíd\u0010c«ùáÁ¸IÝF\"Å\u001eÀÀêÆK¹¿ee³\u0004FR¦-wz÷Á\u001bðÑ¹µ\u0014{\u0000Ãæ~`Ët\u0003ãêb|ÖAö¦Åwø4àMÄ¾[\n¼I\u001eûB±\u0014[AYUÆ¾³Ýï8cLÖ÷\u001c\u0015tâ.õb´sÕ·sAá\u0015têGÖ®¥Ø\ni)×m\u0015E0\u001ag¾*\rÃ\u001eóh»¥Tø¸Í^Rl\u0005Ì=¶·ZLÁxjç8m\u000e¾èØ5éÈ£* Rl\u0005FÌEßÕq+ÀXJsf:Õ²§\u000búf*R2|TN-ÅV\u0012*¶x+\u0005ã°þrÓÅ\u0016¥1£´¤H§~Ä\u0002\u0014[á,¿$ºü11pâetüÞV,>%©ÒÖX½b\u000b0%ê-\u0016\u0018u¢µõ#\u001bc+qêã\u0017_¤Ø\u0002ÆY¿2æÅò\t!Æ`M5\\ä\u0018cS\u001f]Îb\u000b0Xnµü770\u0006K}×3_`¬V§æy\u001dOK±\u0005\u0018+÷(\u001fþ6Þþ-5rÒ\\ÃE\u001b×+X¨ïõ\u0002í[zé5\u0018\u0014[±r\u000e½´Âþ-Ñ¹ª¬ã®\u0015¾\r8\u0006:_×Ç?ÚãDÑZý8²>-Å\u0016áR-y£oKî\\üHÆ÷[VóØ_·}ÍhU&¶©úºsdÕC-\bÃ¥,\fèÛòÂ9ÕÀw\u0019{½E'ì²TÍvní¾ã¸¥q)¶ ²Ä¡Ñ/\u001fÇj<wÌoã»öHX\noæh6,Oã~\u000bE-\b£¥¬rhKÔ2¥Cø5\u0002ÖÂ<¸É©q¼uáè¨(-Å\u0016ÁRV9´¥\u0002u\"|g´3_ôpêÜ\u00009ê§¥X\u000bÃÉ2Ú.RÐo®º­là;eý49\u001b·ü\u00049fó\u0014ka²\u000e\u001e3\u0003ôkÉ³é\u0006¾S»á¾¦2'OÚS\u001cSb-0\fó6e°;Ó£\u0001ú´<9Þ\u000b[\u001cãÎ×:3ø|\"áoFø7Qªmc-QÚÝý¼B-\bc¥LÏ¡Ñg¶þ\u001eïX+\u001a¦*\u0005¾SR%iM=,{¾Øã!Å\u0016¡RV8t.º¾]dÀç\u0005\u0019RT1À÷§¬ìáXKîDÚ!Å\u0016¡Rvtè·\u0011\u0010[*$U¹.£S[RÖ(»q¨IK±\u0005a¨é6ôÙêÐ9kr\u0006\u001co­T¿c»«6ï¸ÿM\u000f)¶\u0000£ä\"ÁôÍIì3\u0019CJÎ¡Õ1w÷§ \rË¤³Úv8ÖrÓ¸_db\u000b0Êv»íØg2\u000eÏ,ÐF¡\rK5¢iC\u0011Ïµïþ\u0016)¶\u0000£ä6ë4å5 ÏC¿t\u0014|6­¶¶²¹zzL\t8~»kÓ\u001b)¶\u0000£T;Ï(Ðgv¹:=æ\u0002Y\"tÚ:Ú±TSZª\u001dÙ´&=Æ\u001bRl\u0001F©vQ OËÂÊË\tønJ·ÜS´ÒâÐÛnMè\u0014[A,FZºC\u0015ÌNÏV9î°­¤í¡Å\u000eÓËª=b+ÂH)ÓgÓè37!z¹°Ï,ø»¼vNªE{)áÐ)0J.ÊL_B9§|¹\u0001Y¶vÙ\u000fvF;tîÆ^ö\\\u000f¤Ø\nsé«RèÓ²° \u001cÐs%5~Ökb8ÔápüveÕH±\u0015\u0018e»U)öô¯xW~U!èéÌ¼qT\u001fwR\u0002\u001c\u001f\u000e]\n²åª\u0014ú´l\u0004\u000e\u0003]í¹èæÌ\u0004mYR¦þp|8t\r0LîÑ9ý'uÑ§Åa^¦Cøì^ÁéêÌ\u0004íe'é1¥ pè\u001a`êIØ(Ð§ey¼¼¨ø7Å\bg¶¤DÍA\u0000mC×\u0000ÃXòè\u001dwÞ]¼tX|Ö}ñ\u0001mN)\r¢auî\u001db\u000f`\u0018KÄYQ¾³Fi~gÊª\u0019ú±¤B¤y<¢Í\u0014×o®H±\u00170Nn\u00126Íiî Okæø\u000fís\u0002m¹Áo~´1¼²\u001a)ö\u0002Æ©®ý\u0006ýæ\u001e½\u0017Ã\u001aíriqfÒ\\æD\u001bm\t]ç\u0006³b/`\u001cKÚ±äG\u0003Ñ¯åâ^ÐézO\u0002-7ûEÔ\fídûLñ\u0014{\u0002#åfÕdÉc\u000eýZSæåãy[lrÑ--C;¹ýÖKKO¤Ø\u0013\u0018É2áYöoÞØw2\u001ct0Þ\bE)\u0000¾Ï\\Ùò²mJ·I\u001aÚÊÍi]^H±70%O\\ò&úåDÉ²¨àqtn¦/ÿJI>4ÞÌêÖ|=¥Û+QhËþ¹ÞD¤Ø\u001b\u0018ÊòC'ÓKx\u0017è»Å©GÑÕ\u001ehÏò¤t]á Rì\r\fe\u000edI&è{'§î~s£ÍíVnG Å\u0011À`üqéKèN]S÷¦ûc\u001fmZêÏîóg\"Å\u0011À`Ö(½ü±1V?zÀ<{È¹£Ým×\u0003z#ÅQÀh(½ÅORa\u001c¬J×Zh.\u0007¾\u0003m[&¥CWDg!ÅQÀhÖ(½Í\u0006\u0019©Ú*E\u000eÞàCç\rhßòÓ\bG¤\u001bD#ñ¬µØ­`1\u001eájêÈ)¼9\u0018§LÑå)sÄOé\u0012)\u0004Æã\u0004ÅRÞvÕ\nccÔ£SZ\u000eÌï1/z¢?K©n\u0014¯\u0017R\u001c\rht¹Ù±2ßYV¼À\u0018,©ëýÏ)R\u0001\fi­ùº/ö¯\u0000v³\u0004nûDvA3!\u0019ÅS3úh`/ËKÊä¨èL¤8\u000b\u0018Ô²$N\u0018ÍÃ©\rÐN\u001föRv¼sd â,hP`M=íõð\u0004íØí\u0015î7\")¤8\u0013\u0018Öúx$î{$°¥ªAÜï{~\u0014g\u0003\u0003¼½qÄ\u0012mo`\u0017ëê\"®_³z\u0014W\u0000#l\n\n§¾\u0001{X_´%ÇM\u0004ïHq\u00050tI>MÂ©\u0001ìPâÌÇ¦\u001a\u0017R\\\u0005\fÎ½\u001eÖCØXÁù3g¶Úß[¾Ø3\u001a)®\u0004F/8äÕ\u000f·u\u0002xqÌ~wHq50~éÅâ^ÇÔ©q®¥¤\u001eIq\u0007x\u0011û\u0016½\u0013\u001fS²y\u0006yÔ\u0013L»QêÔäÈY<Îe¹T<.\u001dâNà¢Ô85£Ø\u0011Ñ\u001açÁêOÍ{[Hq7pqj\f}µi4\u0018;\u0017J£2yì6\u0001)î\b.RÍ#ð\u0018Wå=7pík_®ÏKqWp±XÒ«½Ð<\u0011oÛ±µ82oÜGæÞ!ÅÁEcNÙò66/ü´wúrp\u001cñk\u001d\u001c3ghE\u001eÀ\u0005ìñÛ\u0019t\u0004Fí©ÎþxS2\u001a÷øQ\u001bÖ¤c¯ø\u0007Rô\u0002.$ßzilwèÜÜÌÕ»;\bÚäXy\u0013Ö_\u0011)@ÀEe´³¾ùR\u0002o\u0014FP:!£é×_Õ\u0018.ð9s|~7\u0005ãñ½\u001cø\u000eÛ¨,¢GpéL-¹µ\u0007xÅKÃo¢gpÁ[*\u0005»Âôâè}Ì½â\tÀ\u0001Npì¯\f\"½0\"Å3Ð±½¥\"¼\u00119îpäB¤x\"p\u000eæØ,q1ê)'Ú\u0001/rä\u0006¤x:p\u001aV!vqnV,\"\u001awBO\u0002tÕg¥%õn5 \r)>\u00198\u001aS\u0013FÌËÉkëÈÌy<«JL@\u0006Ny-¼\"öS,FAà\u0015)\u0006W¤\u0018\u0004^b\u0010xEAà\u0015)\u0006W¤\u0018\u0004^b\u0010xEAà\u0015)\u0006W¤\u0018\u0004^b\u0010xEAà\u0015)\u0006W¤\u0018\u0004^b\u0010xEAà\u0015)\u0006W¤\u0018\u0004^b\u0010øäË7ÿ\u0000u ±Üþ4\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÃ\u0000\u0000\u000eÃ\u0001Ço¨d\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0000þIDATXGÍÍ1\u000e\u0003!\u0010CÑ\u001c$eî³È\u0005Ò`>bÙeDW`1ö«òW0<\tÃ0<\tÃ+¾ïO\u0019ñ¿+0\u001c¡ñ\u0019ïÁÐØ\nï\u001bÁ0¢ò»¼`XQéS¾á0\u0014*ÛÅ·\"\fvò½\nC*ØÍ7«. ã,¾-]@Y|[º\u000e³ø¶4\u000f:Ê\u0016÷¥yÐA¶¸/Í\u000e²Å}i\u001et-îKó lq_\u0007\u001ddûÒ<è [Üæ!tÅ·¥\u000bè0oK\u0017Ða\u0016ß.\u0010:ÞÍ7+\f©`7ß¬0\u0014*ÙÅ·\"\f+*{Ê7\u001c\u0011ÞåÝ\u0004CGå«¼s\u0004Ã\u0011\u001añ\u0019\f¯ ñÊÿ®Àð$\fOÂðòú\u0001á²\u0004M×LÄ\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÃ\u0000\u0000\u000eÃ\u0001Ço¨d\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0003SIDATXGÍÏKTQ\u0014ÇÅE?¬\u0006\u0017\u0011\u0003µ0ªiQ\u0011ARÓ&*ÜÙÊB°r£3»\\M$\u0016AÐvv26\u0019Ñh\u0014\u0004AQ\u0010\u0006ER?2K³Ò¿áv¾#g<÷ÞóÞ\u001buñZ|{¿ç;çÝwï}÷Ô\u0019cþ+T1NT1NT1NTq#\\~»hRgMóè¹ñi$Ý/\bU¢½½ÝÔ××StG:6ÃÃÃ¶Þ4;\u001eLQÈjl[[ÕwQÅ É¤@\u0018ÅbÑì\u001bùF­$\u0005­«««Ò\u000eB\u0015]òù¼õG ¥¥Å\u0014\n\u00052¯øËeÓÝÝíùaÆ\u0016\u0016\u0016ª}øp*JúúúªÎÎNm-ôjr\u001fÿVõR©dÅHzzzª~\u001aª(¹6p{b¹²V\\\u001d455Uc\r%$\u0007rmÌ©gsæÐYjú6\u0019Ïd2\u00192ù¾*ÞÞÞê \u0003\u0003\u0003$é~ÛïOÌûßÔ´uuÉf³¯D\u0015\u0001\u000fH$L\u0003í Yh\u001c2Þü¢æªÆ±\u001a\u001d\u001d\u001d¯*\u0002\u001e`hhº+3qîÅÏJ[råÝ¢wÖl\u0004O¸öáÉård\u0000ë·&\u0002\u0017ï\u0011½\u0006J¸ì'Ææ\fNëõÒÀ\u00130\u0013­­­^B`\u001bÙ.¾¶_$Kké$%´óá´ÁQ\u0007ÀëÆo²8c®£!\bOÀ¦R)5¡«ôz0\u000bR«ÓÏT\u0012KD¼^O@B®&Á,¹ÚZÀ§\u0004³çêÕÁöúÃÍIÓÿy}ëi\u001c6ç_ÎSÓ·Y\u000b¯æÍ\u0011}{3i\u0001§i¸úZÁ¹\u001a°:gh[7}§¦í$Á.\fò0x]bò\rÀÅê¥'\u0004Ö»8!ìâMµÌ\u0010^ÅÒ\f5m'\u0017ÌÐ/ËÔÔíApB8ç>Õ\u001fÜ\u0013ja?í\u0014W\u0002'>'4>>nî~Õ\u001fÈ\u0013\u0018|sx\u0000\r×?\n|\u00139\u0016¥kgT\u0011à«,\u0013À\u001eu^Ip[àXÜ\"n\u001c\u001bª\bpoI0lßMkíX9z\u0003\u0000\u0019*\u0012×.QE\u001c\bà\u0006(}¶®DÆ»6\rU\u0004ZB\fîÌðÙE\u001fÑ½ô\u0005»·ÁÝÜõÑPE +\bôQ=È?\u0000ðAµÁ1¨BP¸~¨ZØ'\nU\u0004¨0ÔPg¹\u0016\u0006ê8\u0019_\u000bª\bÂ*LT¦Ú\u0001T´¨lÝZQÅ8QÅ8QÅ8QÅø0uÿ\u0000îÕ§ÊbÑL¤\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0006bKGD\u0000ÿ\u0000ÿ\u0000ÿ ½§\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÃ\u0000\u0000\u000eÃ\u0001Ço¨d\u0000\u0000\u0000\u0007tIME\u0007á\u0006\u0001\u0014\n\u000bP\"Êì\u0000\u0000\u0003IDATXÃíX]HSa\u0018~¾³4ÝòÌ¨hÐrå\n* XÐ\u000fT.\u0002½Ò0tè(ÑÍ,\b\u001a\u0005\u0011Q7Ýéæ\u001aËa\u0010ë¢\f\n¼Hª\u000bK¨»ÜrbIVË´\u0012ûÑ·ê0wþ·.|á\u001dÎ÷>ßó½ï÷¼çýÆ\bÿqøÏl-úÛ¾q<\u001aµ»Â\u000bÛýû\b544Éd\"Æd¼8SGggû\t\u0000\u0002Ï&À_IÍó­««SW\u0011\u0011é\u001e6\u0000è\u001e±X\u001c=Ã(\r'ñ[ÍäõzIm\r]DÁ d1·ÛM¡PH\u0004O$\u0012$\bdËå¢±±1ñY\u0010Â\bùýþy\u000b455I\u0000KÂC8ýøøÜÝÝ­\u0018µÖÖÖÂ\beÉ½??AixHÖ×n·\u001b&¤z¨\u0019cuÖÜ»£_PÉ\u0017Éú§Ói9ÌüTÖÞÞ.éèèP\u0004xùÝ«JU7óW\b\u0005\u0002\u0001\u0000\u0000Ïóðö³M×Gä\u000b\u0019\u0007|ü6§\f\u0000LNN\"/ÙÿÉy4\u001a%\"Â®$öÝz%çé{²HÒPùP\u001bJí{ø\u000eo\u0007Ä\u001dz<\u001e\u0006\u0000'kÊqypB²¡èÞxòv\u0006H\n Âæe±¡¼\u0018\u0015E«4\u0000°Üö£,Â®\u001b'¨··WrDR8´Ækûm²`Ç\u001f¼ÅÓ÷_úÏßçÀ\u000000\u0010\bÖb\u0013Ze¸¸c¹±»¨ªªzKß\u001b\u0015$®5öÜ\u001cEix\b¼Fze\t©9Xº\n;/a¨ljÊÝ\u001fÁôÑuª\u0011ý1G87É»\u001bH\u001e¶£ÄÄáà1mÙ¿ÎLi\u0002®·\u0016áÞètA-ÊDK%ú^Ok\u0013ºÓ°E\u0013ì@\u0019¯y\u0011ùÓ¢8Nâ\u0014\n$[Ak®>W\u0005\rì\\\u0001FµÕ2ÃYËÅ¼\bm\f`üÓ&à,\u0011.\u000e~ÈPuu56.-V½¦m]Ï°auE£Q±ô÷÷Ó¥ÁºìsÉ466ªvF\tñ</úÃImÙç\u0012³Z­jÅY\")Ý)êìì¤©©_\nöù|8USnüãÚÖÖ¦\u001aÕÝ/±51¢+:ÙþÎkic\u001f×l¢¹f·ÛÅß¯¬¹+¥KêZM^Þ× t:\rÆ\u0018Åãq\u0002²\"Ê´ìÜææfÊ&ã÷ûõ-¢\u0014ºì\u001b\u0004\u0011ÁårIÒ'\b\u0002%\u0012\t1¡PÜn·d^0\u0018Ô-\u0002Å\u0017^¯W¢¦X,fè^f³Ù\f«QñEmm­\"X<\u001e'¹\u0001 ã¨¾¾òí\u0006ØÂÿC\u000b\n´P<%¢9\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 69 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000¶\u0000\u0000\u0000´\b\u0006\u0000\u0000\u000098Ö\u000f\u0000\u0000\u0000\u0001sRGB\u0000®Î\u001cé\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000.\"\u0000\u0000.\"\u0001ªâÝ\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0010?IDATx^í±®,5\u0012÷\u0011\u0004ñ\u0004Hû\u0002\u0004Ä\u0004iÃ7#%$$%#F\u001bð\u0000\u0004¼\u0000\u0012)\tÚ`ó»ÿ?jêÔüí¶Ýî®¹\u0015|ºçü¶«ìê²Ûíé9÷oïÞ½KCI\u0012\u001d)&It¤$ÑbDGI\u0012\u001d)&It¤$ÑbDGI\u0012\u001d)&It¤$ÑbDGI\u0012\u001d)&It¤$ÑbDGI\u0012\u001d)&It¤$ÑbDGI\u0012\u001d)&It¤$ÑbDGI\u0012\u001d)&It¤$ÑbDGI\u0012\u001d)&It¤¸??ÿðSÇßU½÷\u0015ÆÃÅçSUo\u0006°ýóõªw\u0006ð}Ú¸¥8\u0002:ù\tø\u0001¼[á7ð/Õö}ã_â âC\u0018¿)\u0017\u001bvj¾þ\u000bèë#Õv6ðÃ¾ü\u0002T_ÈO`jK±\u0017tê;ÓÉ-\u0018ìS\u0002z\u00158^P»°ï\u0016Ð\u000bÌ\u001fÆÖ\u0016ß(;3m®Ð]ã\u0006SîîRì\u0001\u001dééx+ÆÓngÂq.ãUq¨Á\u0005 ë\"£þ¨¯\u001f½=ÀæiãVH±\u0015t ¶õØ«ÊKï½9¾ejü-4'\u001cêò®0Hi+7lqÜµ-×\u0016?)»=H±\u00058çæ_uªé+ÅÀøz¶hk4í=QoäÎé²E\u0019ãþBÙnE-Àñ@Üos\\n£ü¦ì[PgÆ\"Cv/4°ÁÕZÙîå\u000fe¿\u0015)n\u0001§³.\u001aù·ò\u0011\u001dËs\u000fÕÉò=[Â7xÛ½ÀÆÌq\u000f?Iq\u000b8äñêÈ\b¿(\u001fÑÁ¸x¥Æ;Buò£|Ï~Ö³ëØ\ríO\u001bw\r)n\u0001ß¸\u000e$É\u0011\f?ÐJq\u000b:t\u001dH#ÈÄN^Ó\u0013û\u000b×$9áW0¤¸\u0005\u001cÎ:Ò!ß7/Æ¼\b\u001c\u001aï\bÿ\u0004ÊGá?@µëå@Ùïaæ¸¥Ø\u0002Î8bâ'e/ùé#ÇµO»ÍOáPgÖñëO\u001fagÆ¸wI±\u00058\u0011Ìi\u001fã^\u0011oÆnÓY.êíý´oÚ\"\u0003;§{\r)¶\u0002ç{Î³_òüÚÃqºq÷Ð|º{ßÏØõ\u0011¶\u0007öögï^ð¤Ø\u0003;á:ÕÂ7¸\"Àq.ãUq¨Ñýê*Úúþ<l²/#zÊûCRì\u0005á)Ië¾jø]ãÈ`Ü­\u000b\u0000ã8¼z¢-\u0013ªõùo\u001e\u001eö-\u0016\u0002û§Û#Å\u0011Ð)\u0006tí\u0012\\E¸\u0007|¯¾`àáø8¨Uqcüfís/ÿÚ,\u0013ÛÓ¾Í\u0004_ì\u000b\u0013|mÜÜO½K1I¢#Å$\u0014$:RLèH1I¢#Å$\u0014$:RL£øóó\u000f?\u00009þ¡êîA# s_¯ÁÏàWà\u000fâÿ\u0002,û\u0011°ÞôÁ\\\u0005\u0017ïñ\u001fX\u001f¨:3á¸\u0000_eåX}\f<%&ÇÇÊ^+Rl\u0005Î\u0019¤ï\u0001;¤:ºÅïàke;\"\u0018ËÇ`w<@5áPÎO¾Uå\nÔý\nÐ¾÷ÉI÷j³\u0007ØäÄVþzà\u0018&¼\u0014[Cv|ô\u0002z\u0018Ð+8úÏÄ9%\u001e¦ÞÏªÜ:\\|Ô\u001dÃÃ:SVpØáäV>FéxRÜ\u0002Ôª\u0003å6Bì\u001eª@}í¶Ä¤\bÜè7Z§l3jñ \u0014üý³\u0015¥NKb·$uawr£½ú\u0006M\u0003Ç,¯1õ¥õT»[5à+½\b\\]xa»\u0002Âú°·«ßUÝ+>sûQúO¤_ªº[ ß.0Î\u000fq5åÕÄF¹poúÙw^\u0003{=·7\u001e´ebZLò¡½2Û\u0001Nb}l¶%Å\u001a0Î@\u0014g3f¸¿UNßï\u001d\túkW¨ïU^hÇØ|x\u00061e[mãºÚ7qµ´É=¶ßS®#ìØ|ktR¬\u0001ãe\u001b!W\u0011hg±G»?ª:W\u0005ý-É3õnC{Ýä]tYV@½ÐVõZ¡Ü®îC\u000fôhWúü«*\u001fö\u0016»[¯\u0014k,\u000eÈÕ©@{Ý¿TùUYúLoá\nÚ+¶EYñYKlû\u001cÔÔ7Ô[L-,mÉÔ.Ú+¶}Ù\u001aR¬Q\u001cÐ*\u001föm_veJÙU>\ní\u0015Û¢¬ø¬%¶½ËP\u000fêíZ\\¶$dbY}Ô_u+þ­ÙQ·ß-Î¢¦Äöek´± ]ÅìmY÷vO5`¼<©v=¥Ö\u001d»Ç\u001eº\r>\u000bô×®³\u001e\u001e«6M\u0019\u0017\u0019Öå¶ãÍª¼è·zV¯1ÒÆbÛY±\u0018z8b\r\u0018·{7Î¤]ÉöþTdêmìhþÛ\u0013\u0005®Z³¸È-Wîa_Ø{L}û5P·Ü5V\\´S±hÚ\u0006yÐ®)\u0016kHq\u000b8(·\u001cÂp¦v]LÔg\u0010ØÎ\u0006bóéý Ïê\u0003+&\u0016ÇÇ²Ñ\u000f%ä$®ê®âÛ¯º»\u001e\u001e\tÚnÅbíC§¡X¬!Å-àÄ¯²\u0005j¼u°sì¤úZÇàa?VGßyÑì$ÝËæD\u001d®j+ê\u0018W®¸\\tJ\u00166ãÊ:¦þ®»&ÚÏÅ9\u001f©\u00138crÛ{\u000f¼\u0010aº10Ñî\u000fÁ0¦SbA;¿y\u0017D\u001dÛïÝþaã©±b\u000fpÌÕB­À-Ü\u001e~ÝÈ`LeÅ=âÖÊÅr^@Ößõ¼²\u0007ø.}}ÚõXHq\u0004vdé\u0010\u0007ÀÎùAN³õÂ¯Ð=p¼ÀnËÞ«ñ[Î\u0014$:R<\u0012ÌN®Ödè\u0018(i\u0003ñå\u0016À®¬WEGà­ÉËí­\u000b\u0018\u001b'\u0003ÀÜ~­\u0002MÛ¡=\u0013'R´é}y¦íeg¾Ü'£*ïAGNà¾âCc9\tðÏ\u0017­Ü\u001e¦AóY>êr\u0002ùã½^äÓWsØ,ÇUÛK\u001d5!9é\\Gb:ýRñðth4¡=MÇ¨³÷8Í3ë\u001dj¨\rï(o&-~÷_P\u001c-NÇû¼:è³º8¼eAn·XG)c\u0012øIÁßWW+©¤.þh[N\fêK9ë±¾·1ãÃ\u0019oÓÂmÙ-¹ñ/û¡ê(º¾$Å\u001aÂát¼Ï+þòvkûÏ$=ú«a>!¤ÍÛ\u0017\u000bÚ©\u000fRöÝhÇ=² Ûø×ì>\u0019ñ3'}6ézE5£Ãð>¯\fú;ôöY\rÚ16\u001fVPW>kû`ï:C_@;N°b\tNeuæÂnOlÜVý¡Ì&wóX¥X\u0003Æmç8ãº\u0002kÚ¾Ä\u001e\u001bã(ý\u000erYÍ\u001e^H2eG½\u0003>d\u0017íln¬½ìdëjÜPnïÇ½¶Jà3ÓÞr\u0018¦§WÓæU\u0012»ç\u0019_\r\u001aCÚ+¶}Y\u000bhWrbub ÌoÝ6Ç:e24¿u(Å\u0016à\u001dô³û¤ê^ÏÔ}µÄ>-É \u0004:m2µPÚj,Pn·\u0017-§?Ý\u0013N=,NíêÍW\u001fL½WIì2¹ÏüjXñÉ-ÉÐC£v\u0016{ÃcYÚ­ÄîJÔÞúD½ÀaóêmÊ_%±ïA\u0007³\u001e\u001e«6¡Ù\u0007=N]ÉÍö úÀÚ\u0002ÚÉX\u0003í/õð«®cé­O¤8\n\u001c3àÕÕÛ½Jbû#.NðÑã2.\u0010þlYÚnoçô?hõve¥.¶&\nÚÉ±õ@ØØeÑ<~½\u00063XþâpÀ·`\u0019í%\u0012`,êC\t&\u001e/ ËZ>,±ZX\u0011ÊØÖN¨\u0002{eÚ¤m\u000fuâï°¡3x¶öNRûp\u0013øÖ\u001fUîYìcOEZ@'xAmà¹*p0å÷Ilñøñîe3>¨Ã\u0004Q\u0013bÛõQ~ZA{{÷ò×\u0006`Ç.\u001aÇc÷¨Õ»ðRM0&&Ý«Àtó¤Àú\\)G\u0013\tÍ\u0015|×>½°Øâ5ïÞ\u001a)`ÃÞYíIq6èZÍ^.±\u000b\u0018\u001b't¹À[«8ËyñX×+¤hÏíIñKÞwñÅrÖë@Ï\u0000}äbÁ¾vå\u0014\u0000\u001dó«÷Ë&¶\u0002ã-ûéÂå*2R<\u0012s/ó{òzH1I¢#Å=p%\u0006Ü\u00135\u001f\u001b6SÞT»\u0012fl§Ä\u0003m¸å+\u000f°| lùÈÚ¶áÃäômóqx¿¤8\n\u001cÛ£\u0019²ù.ÃH(m¤\u0005õý©Ìæ[¨c_!mjÓ\u000blÚ/)\u0002Çöhæ¯ãA\u001dû@ÙÔ&\n\u0018Ëéñ\u0018i?Ò¦\u0011\u001f#m\nR\u001c\u0005»gØH(m¤\u0005õ/y×\u001cñ1Ò¦ ÅQàøû»gáÆvZ<ÐæÏ9ÆÇáýbDGI\u0012\u001d)&It¤<\u001fî)½eÓ«\u0007¨Ç½yù¸~ô}p>¸ò$gÊy³@ºbA¤ÀóAÉaß´ã\u0003 \u001f\u0006»\u001e~Pÿ~TèË,´\u000b¬?ï·9ÉQ·Ég\u000bô\u000bNEI?¼X%ø\u0015xa[WàÍ²rz²\u0005Ï7\u0013\u001cu¦$6Ú\u001e\u000b\u0014>\u0010ð\u000biá*VM4W/&tÞ½\u0005_Y­\u001e³¡|wb£íé±PH1i\u0017\u0005Ø÷ù3WR~¸Àý.ÿe\u0012r*uJ½ÕDCÙêÅF»Ö\u0016\tU¾~Çý6ýª\u0015}õC\u000eíJl´;=\u0016kH1i\u0007ÁæC½@««\u000fÊ|öÂ\u0013¹ß^Kl»ZWÿT\u0002Êlw[\u000bò»¶/k\u0001íNÅ\u001aR¬Q\u001c\u001c÷yeÐ_4ß\u0019D\u001d®¦>Ñ\u001eö¶(³\u000fd{gz6é\bí¿ùªÕ¢ÝÊ­Þm\u000fNÅ\u001aR¬Q\u001c\u001c÷yeL¿»þc}Ô÷{ä7«(~_½E\u0007#ïØU\u0013äÜøyob\u0017»§Åb\r)Ö(\u000eÄû¼2¦ßÝg¿hã\u001f´î\u0017\u0014?·$öOÿg\u001bîÉg%öi±XC5è°8\u0001ìLùP`\u001aÊïUAK,>Ô@;yAño-±Kbú|HîEZb\u0013´ëÅ\u001aR¬\u0001ã|\u0018)TuÞ'\u0010\u0012ôá×mÑÖ_Pþ^KìRÖuË· ­On.X{\u0013ûôX¬!Å-àÀ®Ú¡VØÙ`üv8üÊ-Úú\u000bzO:Q×>\b6¿\u0002êA[Üw|Ý\u0016ÐîôX¬!Å-àÀWNý+£ÑXbQ.À^ÐÞ_Ð\u001b¢\u001eO\u0013JùÐm¿ö2¹}½\u0016ÐîôX¬!Å\u0016à¤¬\u001a¼M¼Ì\u0003FXbP¿÷Ï=\\P_@·«cóËA\n´Hn_§\u0015´==\u0016\n)¶\u0000'ÍnêÕA,Ê\u001d¨\ro\r\n°ñæúr\u0002«6O4¸-l:Ë®\u0001\u001boÛ·Â¾,vNBI?\búîä²Ø\u000bêË\u0002¾Ü\\q÷no\u001e\u000b)&It¤$ÑbDGI\u0012\u001d)&It¤$ÑbDGI\u0012\u001d)&íü¹¼j{$Âçý¸£ð>[@;Ùÿ(¿\n)Öq\u0019xWFõ6WðÙ²3\u001bïs\r)ÖPÎfã}^\u0019ÕÿÙ\\Ág\u000bÊÎl¼Ï5¤XC9÷yeÐßW>g#|^ò[Lhwz,Öb\r\u0018Ï¯\u0019Ð_ûÒÿ)}\u001fûÞóe¾Å¾\u001e5¤X\u0003\u001d¾dP\u0005bÀ×GËJuÚ.àërßbB?\u0012\u000b\u0014·@§ó«a\u0006ÄÀ®T]pq\u0014ø)ï=?=,èËé±PH1I¢#Å$\u0014$:RLèH1I¢#Å$\u0014$:RLèH1I¢#Å$\u0014$:RLèH1I¢#Å$\u0014$:RLèH1I¢#Å$\u0014$:RLèH1I¢#Å$\u0014$:RLèH1I¢#Å$\u0014$:RLèH1I¢#Å$\u0014$:RLèH1I¢#Å$\u0014$:RLèH1I¢#Å$\u0014$:RLèH1I¢#Å$\u0014$:RLØ¼ûÛÿ\u0001bf?Ù\u0011Z%\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 70 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000´\u0000\u0000\u0000´\b\u0006\u0000\u0000\u0000=Í\u00062\u0000\u0000\u0000\u0001sRGB\u0000®Î\u001cé\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000.\"\u0000\u0000.\"\u0001ªâÝ\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0007®IDATx^íÚ½]U\u0014ÆáTÖ\u0001;ctüÈ\u0018l\f\u0004¨\u0018DüÀD\u0002þ\u0003\u0001Á:`e\u0017°µ°²Ne\u001d°±°He'¤M\u0017°IFÛq­Á÷{>÷:kû+æMîÙ{özï¹÷ÎÜs'''@3d\bd%C +\u0019\u0002YÉ\u0010ÈJ@V2\u0004²!\f¬d\bd%C +\u0019\u0002YÉ\u0010ÈJ@V2\u0004²!\f¬d\bd%C +\u0019\u0002YÉ\u0010ÈJ@V2\u0004²!\f¬d\bd%C +\u0019\u0002YÉ\u0010ÈJ@V2\u0004²!\f¬d¸´'_^80·ÍÝ\u001dwÌ\u0015õÿ£Ù¾®ïìóÌ-s^ýÿH¶'Îv\fbôÍ?0'=\u001e[êñ5Ù\u001eÎ\u001b?Ü§FíóÌ=\u0013^lÛÃ\u0015³ïl\u001fð³u¶¡g{ \u001e?\f`\u001bó\u001f@mºKXQl]/?±Ô¾\u0014\u001fÌuu­\u001alí±g{ßD­¿=ÛÉOB\u0019Îe\u001bòrªÍîóP]oM¶¦yß£Kõ»­9ùlMÕRÛz^æ©g{[]s\u001f\u0019Îá\u001b)66Öêºk°µümÆ»GÉ5ë%r\f[Ëßkª}\fUíl­7÷lG\u000eáT¶\u0001/ÈÔgä®*%±uÆ¾t+\u000fÔµfë,u¶UÞ*Ù:!g+Ã©l\u0003þéZml¬{êúK³u([ý\thk,u¶÷Õõfëø\u0007RµþX£îÒ2Ê\u0016ó\u0012³ë©ºþl\rÿ\rZ{»j%Ù\u001aû~£1Xyí¥Ù\u001aag+Ã©ÄfæXõ÷¨vý%^\u0012Ï¬þ¶C¬9Çªo;ìúag+Ã©ÄfæhöÐ§\u0010kÎA¡\u0010ìèÃ78zçíoÖrüéÁ/jÝI¾xåZcIrÝR-\u001eBëuÐR¡úd{¢\u000ejIÇ\u001f½ñZwãÏ\u000e~Sk,éÉªµ§8z÷ò\u001dµÆR<[3êwç2Ê\u0017/63ÍÍU\u0007µ(\u001bª\\{£÷/}/×XÐbw½\n¯&Îfø·\\¼QáT¶¸ÿ©Smj\u0014»ã}¥\u000eiiÇ¿ú»Z\u0014»sªk/îÚáwrý?~ý¼þÂüUK­?ÒcÕ³>2Ã61÷.ýÀ\u000eä¥òVáwéwµßî}¾qñ\u000fuÝU,p¶fôocd8mdê\u001fXü=øy;:6sÞïÙ]èguÍ5YI¦¾ª<=ºöÖuuÍÕØ]ìc¨Iß;á\\¶\u0019ÿÞÁØ¿lùàôOÈv\u0018Õ\níüeøÉÍ\u000b\u0015ûÙç®=öfy­Õ}pé²­í_\u0007U{êâg{Å\u001eõ¹ë­ìø×¾µµÇ~Å`ò¨d¸\u0014ÛðÚ÷Ãø¿û/âÿûj£\u001dDÕBzïðkÛÃ'¡ãô¥Ð\u001eW¿Ðv6#ÎÖù[ÀÓ³µÇV/´¹jëûg«!OBõG\u001f\u0019.É6èwkÿJ©×\u000bsÆ@Ïû®\u001dBýB[9ÿÝ¯\u001f¾?Áv÷ê¼\u0018Ï\u001c¶?¦¸F\r§>c{ê:[/ü3gk\r)ôÎ^\u0007íT2f\u0010Vè1ü1Å5jx¦ÐcØcC\u000b]\f£Ù!Pèn\u0014º\f£Ù!Pèn\u0014º\f£Ù!Pèn\u0014º\f£Ù!Pèn\u0014º\f£Ù!Pèn\u0014º\f£Ù!Pèn\u0014º\f£Ù!Pèn\u0014º\f£Ù!Pèn\u0014º\f£Ù!Pèn\u0014º\f£Ù!Pèn\u0014º\f£Ù!Pèn\u0014º\f£Ù!Pèn\u0014º\f£Ù!Pèns\n}h|Ï5\u001dª½¬EÑì\u0010(t·Éþ?a4\u001fZ1Ä\u001a(t\u0003d\u0018ÍV\f±\u0006\nÝ\u0000\u0019Fó¡\u0015C¬B7@Ñ|hÅ\u0010k Ð\ra4\u001fZ1Ä\u001a(t\u0003d\u0018ÍV\f±\u0006\nÝ\u0000\u0019Fó¡\u0015C¬B7@Ñ|hÅ\u0010k Ð\ra4\u001fZ1Ä\u001a(t\u0003d\u0018ÍV\f±\u0006\nÝ\u0000\u0019Fó¡\u0015C¬B7@Ñ|hÅ\u0010k Ð\ra4\u001fZ1Ä\u001a(t\u0003d\u0018ÍV\f±\u0006\nÝ\u0000\u0019Fó¡\u0015C¬B7@Ñ|hÅ\u0010k Ð\ra4\u001fZ1Ä\u001a(t\u0003d\u0018ÍV\f±\u0006\nÝ\u0000\u0019Fó¡\u0015C¬B7@Ñ|hÅ\u0010k Ð\ra4\u001fZ1Ä\u001a(t\u0003d\u0018ÍV\f±\u0006\nÝ\u0000\u0019Fó¡\u0015C¬B7@Ñ|hÅ\u0010k Ð\ra4\u001fZ1Ä\u001a(t\u0003d\u0018ÍV\f±\u0006\nÝ\u0000\u0019Fó¡\u0015C¬B7@Ñ|hÅ\u0010k Ð\ra4\u001fZ1Ä\u001a(t\u0003d\u0018ÍV\f±\u0006\nÝ\u0000\u0019Fó¡\u0015C¬B7@Ñ|hÅ\u0010k Ð\ra4\u001bÚ\u000b>¸Ê^T{éc¡Ð\u001b#C\fcå¢Ð\u001b#C\fcå¢Ð\u001b#C\fcå¢Ð\u001b#C\fcå¢Ð\u001b#C\fcå¢Ð\u001b#C\fcå¢Ð\u001b#C\fcå¢Ð\u001b#C\fcå¢Ð\u001b#C\fcå¢Ð\u001b#C\fcå¢Ð\u001b#C\fcå¢Ð\u001b#C\fcå¢Ð\u001b#C\fcå¢Ð\u001b#C\fcå¢Ð\u001b#C\fcå¢Ð\u001b#C +\u0019\u0002YÉ\u0010ÈJ@V2\u0004²!\f¬d\bd%C +\u0019\u0002YÉ\u0010ÈJ@V2\u0004²!\f¬d\bd%C +\u0019\u0002YÉ\u0010ÈJ@V2\u0004²!\f¬d\bd%C +\u0019\u0002YÉ\u0010ÈJ@V2\u0004²!\f¬d\bd%C +\u0019\u0002YÉ\u0010ÈJ@V2\u0004²!\f¬d\bd%C +\u0019\u0002YÉ\u0010ÈJ@V2\u0004²!\f¬d\bd%C +\u0019\u0002YÉ\u0010ÈJ@V2\u0004²!\f¬d\bd%C +\u0019\u0002YÉ\u0010ÈJ@V2\u0004²!\f¬d\bätrî\u001f­\tmk[5u\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000´\u0000\u0000\u0000´\b\u0006\u0000\u0000\u0000=Í\u00062\u0000\u0000\u0000\u0001sRGB\u0000®Î\u001cé\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000.\"\u0000\u0000.\"\u0001ªâÝ\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\f²IDATx^íÝ½®$E\u0012\u0005`\u001e\u0001l\u001c´O´/±6ÂÁÇÂ^\u000f\u0017\u0013\u0013\u0017\u000f\u001b\u000b\u001f\u0007ÀØ\u0007X$Ü\u0011\u0012Z»ç\\UÎÆMêÎªÊÌªè>Æ'èîì¨¨®\u000f^^^Ì\u001e\fe%fYÉ YV2h\fe%fYÉ YV2h\fe%fYÉ YV2h\fe%fYÉ YV2h\fe%fYÉ YV2h\fe%fYÉ YV2h\fe%fYÉ YV2h\fe%fYÉà^ï>ÿøCø'ü\n/ÁàgøJ}î,Ïgð#ü\u0001q¾ÿïá\u0013õ¹3`.®m\u0003\u0019Ü\u0003\u0013ü\u0016XÜ8y_ð35Æ,Èÿ)Ô±\u000båC5Î,ÈÏFn­í\u0017jYÿ\u00138­¶2¸\u0005'\u0004ÜB¨\tßrÊ\u0016\u0005y¹åhi[S\u001ay¹ÐÕnùV5\u001aòrC±µ¶\\\t?Uãí![`2{¹ÚÔÈ·§àÅô¦F¾=Í\\dª-ºKme°\u0015&Á]¡`+\u0016`Úq*rÕÇs[ý¨Æ\u001d\u0001¹¾ªrïÑmËw\u000frqWshõ³\u001aw+\u0019l\tðPcï\u001a\u0019Mi\u0012ä9ºò\u0015SV@ä9ºòQ&¹\u0007yz¬|tø·\f¶@ò^_ïÊ£GÐ÷jüã*ç\u0011ÃW@ä8ºu.\u000eoÜd°\u0005W9bè/sÏ_Þ*ï\u001e¨\u001c=!GÏÚ\u000e=ÆøÜS«¼{\u001c®­\f¶@òÖS3-8\u0016OûÒ³AHåè©×ÞRÕ¶î³­d°\u0005÷lh³Wum%-Ü\rmÝÕ}¶\f¶@r7´uW÷ÙV2Ø\u0002É{\u0006£ß+ÈHÿ\u0005{«?AßÓ¿AåÞ#Sm\u000ffÁ\u0016HÞëÌÁð³\u0006<½~¼\f¿\u0002\u001cÙjËTþ­\u000e×V\u0006[a\u0002=dÊÍ4ÈÓ£I¦4\b!W&rù\u001byXÛ£\u0017ÙºÔV\u0006[a\u0012G¯\u0016N¹U ßÑÃ¤YÛ#§ï~Uã|GkÛå\u000eL\u0019Ü\u0002\u0013Ù{SÊ)w°!çÞ½ÊÔ}\b9]Ûdp+Lßrù_|zÁ\u000bäæ\u0005\u00015/\ruÚ=ÆÈÍÝùÚòîÇ3k»eKÝ½¶2¸\u0017&Çû;ní&YìSoî/0\u000f6\nW¬µ- ¿\u0007\u001bÿ´æ0\u000fÖöVcólCÚ2>¤¶2x\u0014&Ê/Ä\u001bé¹¶rAðÏh\fe\u001fo\bbùçiÇÊ[ankËÿ\u000e­­\fe%fYÉ YV2h\fe%fYÉ YV2h\fe%fYÉ YV2¸Õ»Ï?þ\u0007|³ø\u0001~©×¾¿©1¬\u001dj¸¥ÞWc<*\u0019lB}\r?ºêß\u000bâ\u0012ÅÆ<Jðû°!8¿zÎ¥Y¾\u0003~÷©+æó!ê=\fÞ¢pá«\u0005¾\u0017dúV9\u000bù/PójÁ:pEøHåè\u0001c?D½gÁ5(\u0004·\u0012ªHG±©¾T9G@.6¡Ç^Cæ1{Ï³à|¿V9³A\u0005\b\u0005¸\u001bdá¹%YÝ¥-¯];·\u0012j¬á»DäàVYå.¸°ËáEM½?úNåÜ\u0003c=D½gÁ\u001a¾øG\u0010wÍü3\u000bµ{WÏrÏ1bWïí\u0005ãóø7æ#þ½\u0015¯\r¢>£ð½ËgÔ¡Àá-\u001fÆ`mz×ËcÄqÖû\f2X[\n\u0011ÛmÍæXËeü!»BË&)9ÜÜÄk8\u0006ÄÆæw9tLÏ§¯÷Yd°/\u001dwY Æ¢ñRï9\nãÆ­3¹Û\u000f9µYÆÿF½¯\u0015>?ºÞ\\\tËøê÷se\u001bJåm%5$)kô°]Ôè\u001c\u001876I÷_ù\u001836É/ê=­Â8#ë]ö*r,\u0019ªÎ¹\fÖB²C\u000bê\u0016]òÔ¯õPÆßÔë=`ìÒ$©×[-cÐåê]>3Rs\u000b\u0019¬!É®µy\u0003ÿ«ßsD\u0019\u001b.¿Râó]V[B\u000eü¯~Â9ÏRçÜB\u0006kH\u0012¯P>¦\u001bÒp\u0018·\u001cãl²°n¡ã©ÅCÇ\nÆä%ñ2þ¦zs>á³?¨÷I\u0006kxüÑÆÖóWwýªÛ¹Ü\bãnX£C+%>\u001f\u001bõî¶\u0011ÁXõYMµÀûëS¸Ý7pGÈ ¿ßE\u0001¿Ðá¦À\u0018lX\u001cþyÈeY\u001b÷\u0002ÔítÕ2öî&Q0Fü\u0011K\\!w×¸u%ÎyóÙ\u001e|¦ÛÊÛ\f*xÝ\u0010Äðt\u0018·(MÁû8\u000e?\u0013W¢û3ÂøuðPj÷Þ\u0006-÷Ä1ù½\u000e\u0012Ä\u0018õÅ{36&k¾ºuÄkÜ\u0012³Ö|oý½ÝëñÙ¸ü.s.[\u0006×pâáK¬añ\u0014µp¢!\u001a\u0011rÜj²b¶6I<Lz\u001f\u001e¨\u0015ÿ(ÖàP\u0013òóa¼ag¶Á[0y\u0016ymaîÁâÎ¼1id¸AÇ¬êý^Ü¸t9¬Ã8lêKÝ\u000f\"-/Ãâ¨¢µ`SqK×í]+æK6É\u001a\u000fkj÷ð3<4ºTó [ H,4Å.\u0017uAKïá{.üV\u0007p¥JÕ$ÈÉyóðs/ÇÈQó=¨õ,2ø¸à\u0006p$&fYÉàVØb_þÄÝ°·nv\n\u0019lÆä±ðC<´y\u0015ß+ :¦.+ç¥~\u0007d²Ôïµõk½Èà-\f\u0017þ\u001fQkø%§7\u0007s\u0002Wª{çÇoa\u001d¸\"L?S\u0011êt­ÆD¸eª\u0017j\u000f³ÏE³\tÕ<ö:ÿ¬P£ë44&±ÖÌ©\u001eÚD\u000enUîÍÉù)êýÑð«¡>ïkX¿Ö\fÖ0ú\u000e+þùÐ®\u0016-çË4ì~kÂøêbJ¹7¢ù5ß»|F\u001dz=Ô3z=¡6ièØxlæn[Rµ9´!0.W ØÈï»à\u0018\u0010\u001bßÅÇÔ\u0002êr»Ûn7ß\u0014\u00183\u001eÎø!Ùÿ3E\u0014äºLC-èÈG°æÀ¸q¥ì~V\u0005crK]Æ?z\u0019g:ÿ(Èu._~ØÍÜ\u001c»ä©_ë¡\r\u001e¢Î?\nr]¦¡ËòC²7pì§~m8Îògþ\u0019FÍa\u0004äºLCû!Ù\u0006\u001c»G\u000e|>Ö+úCüÈÄ÷(\u000fHtï¡B\u0006k@üÑÆÖó,Gýêé\u001f%\u00117\"Ó¶¢ÙÉ ¢Ö§¦\u000e\u0017\u0019c°\tÊV­;ä28Æ[=ºúC²ñ4ã°º<\u001a\u0019TPÐº!J¡y:wÑ5í\u0016ñ>ÃÏÄ\u0015¤\u0018º%ÂøñØ¸\u0015Ü½·ÁgËý qÌn\b\u0018'}¹¿\u0003ãdp\rºvù;bÓ(q\u000b¦ø!Ù\nÆâ|¹¼Þ^ ÞcoÉà-(¬\u001fÕ¦~\u000fÓd°\u0005\u0016\u001e·ÖÜòªÛMÅ-Ýô_ðÌ\tê¾½X\u0007\u001fã^\fnÁ\u0005\tln6H9¼P\u000bø\u001e¾÷\u0012\u000bó\u0000®T{¶Øü\fqß!hídð\u0019¡1ÙÜ~H69\u00194ËJ\u0006-/ì=_»2\u0019Üj)`Ù%ó¸Ò»ë,õ~=Î¯_{\u00062Ø\u0002\u0005ã»xyv\u000bÿ \u001a\u00045uCoBqkÜó<.\u0017·Ú,õ|­mýÚ3Á5(RËÂ=|Q¢\u0013ÔÑ\rÝ\u0002\u0005Zkæ×Ë²À-÷ê!Äòz9Ö~_ô\u000fA\u000eB\rÝÐ÷ 8\u000fñÔ÷3@\rÝÐ÷ 8±ñØÌÝ¶¤\u001ck\u0019³ï¿\u0006à\u0000ÔÏ\r}O,\u0012xb%\u001eÎzê+å4j\u000e3 ·\u001bú\u001e\u0014§lA3?õ]V)êü³ ·\u001búR \u0016K½Þ\u0003Ç.yê×z(cÏRç\u0005¹ÝÐ÷ 8å¼sæ§¾ãqúpu~C\u0006kX@ñàchÎ+ãzêÇ¶%\u001fgzP2XC\u0003Ä\u001fm½ÏrÌzê»>õø7ï<:\u0019TÐ\u0000ñr7\u001b#ÕSß±ã9ì÷G\u0006\u00154@<,(ØåáÒË?õMÈ\u0011óú÷Á5lÐ\fkø+[[beÊ_\u0016<ñ;\\æôµ>dð\u00164Aê§¾\tùØÔ¾oä\u0001É`¥)¸åUMÚ»~yþÔ·=.\u0019Ü\u0002\rö©o{<2h\fe%fYÉ ½cþ§þ«\u00012A{\u000büþný]\fÚ[nè<dÐÞrCç!ö\u001b:\u000f\u0019´·ÜÐyÈ`­,ÌYêügÃÜÐIÈ`­,ÌYêügÃÜÐIÈ`­,ÌYêügÃÜÐIÈ`-.ÐåÏoþ\u000eÞÔ\u001cÎ9¹¡Á\u001a\u0016d|Z·}>Õ-ø¾nè$dPÁÂO~ûßÌ³KA\u0005MÌûKC\u000f}Õl/\u0019\\&ö?Õk&k¸U\u0006\u001eCûêµKA³¬dÐ,+\u00194ËJ\u0006Í²A³¬dÐ,+\u0019ìé/\u001bÛD2Ø\u001bÚfÁÜÐ6\föä¶d°'7´Í$=¹¡m&\u0019ìÉ\rm3É`OnhI\u0006{rCÛL2Ø\u001bÚfÁÐÈþ«hm\u001a\u00194ËJ\u0006Í²A³¬dÐ,+\u00194ËJ\u0006Í²A³¬dÐ,+\u00194ËJ\u0006Í²A³¬dÐ,+\u00194ËJ\u0006Í²A³¬dÐ,+\u00194ËJ\u0006Í²A³¬dÐ,+\u00194Ëéåÿ\u0001t´#qAÊ\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000´\u0000\u0000\u0000´\b\u0006\u0000\u0000\u0000=Í\u00062\u0000\u0000\u0000\u0001sRGB\u0000®Î\u001cé\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000.\"\u0000\u0000.\"\u0001ªâÝ\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\tfIDATx^íÝ=$Å\u0016Åqð°q\u0010+@b\u0003c`#\u001cü1°ñp001ÇÀÁÃÆzæpf\u0001\u0018l\u0000\t÷9£ÙA¿s[\u0015£èäTu~ÄÊÛú\u001b?1}*;ãFÖÍÏª\u0016\u001f=<<\u0000/\rªl\bTeC *\u001b\u0002UÙ\u0010¨Ê@U6\u0004ª²!P\rªl\bTeC *\u001b\u0002UÙ\u0010¨Ê\u0019þ÷Õ'oämçµ[\u000e8Â\u0019.MüÐùÑ-\u0007\u001caÃ\fjà×ÑÄWn9à\b\u001b\u0002UÙ\u0010¨Ê@U6\u0004ª²a\u0006Ý\u0004öO8\u0014ùå#lÆ\f6Ì@Cc\u0006\u001bf ¡1\rªl\bTeC *\u001b\u0002UÙ0\u00037Á\u0019hhÌ`Ã\f44f°aeCË+ù[ö¥ùIû\u001eøä×Ë¿¿\u0017=÷{±áHñÆI¼©ñ.ú¿òâ¾è¯9}*Ñ¼ËùöÞK4÷ÐÆÖúbg±ÿ6Vü;¶ÿ]ÿìMãÇvi\u0017óoÛ!~þN>u¿·\rGQÑÈ­ð[bîÖQæ\u0011\rµfÎÍßrxîZGñb]n^,óµ[G\u0016\u0017\u0007µçvð&\u001a~÷NnÃ\u0011TÔÚ\tôJÿálÔ¿ÏZ±\u0003ìnjýîquë\u001aMã|.[vð\u0010\u0007¸]MmÃ£TÌfnJ6µêÓéÖ7®\u0017GÎÍo¢~gïN\u0014Þ¸u¢õ\u001fÙ&»ÚG¨8åº\u0002×\rpøZj6Õ¼ü«ö=6ý%¼qëÙ\"í\u001eFë>ºM6ElxXs\u001d÷)§ÃQTïÆ\nïÝú¯ÑòîF{«¿ÝºÒz9z.Ål¸\u0006?ztî\r½ûÏ¤ZãiÃ\u001e«nØ´Ü¨(\f¿!×:G±Â¦\r×Ð@#ßDàMg\u0010\u001b®¡hhL±ì½[l¸\u0006¢¡1ËêK\"\u001b®¡AhhÌ²ú~Êkh¸)O§zýÇ­Gý,ËõÕçîK?\u001bciä_A\u0018èßâÆÙeÙ{·Øp/\r\u001eÇÛ¢v\u0018~ç%j]Ô~Äª£\u001bùDé;7Æ\u0011Zç\u000fzoÝú¯±á^\u001a|Ô£¤g£TóÇT\u001eQiùQM3ü,­sÔ\u0019dÓÎfÃ#TÀûø[5\u001f=JGsnzö®åGÜÇ¤|¥õ8¸mÞ&6<\"\n¸\u0014â\n\\cÓ)æLTûOÇv}\u0004­ß;rß²¹a¶Ðºîp¿\u0015hÃ£TÈoXÝß²:\u000bÕ¿µ©c;íþ:§~7\u000e {¾n\u0010ã¦ß§h½gì]gi\u001b ¢©·lè¸\u0006-ÝÌæ\u0011s_sM\u001doöáëW­#zË5|\u001c8¦Ýtk¬-GêØÑv_rÚp\u0014\u0015\u0016\u001b:&s«±cãþ\u001eô5W4vÌ?­/\u0014\rùë%­3Î\u000e·¶u¼vÿ·ÆmñÜ©\u000eïà6Ì BcBñFÆ\u001b\u001cbãûh\u0005Ú®±­cûöÛú\u0014AUG\u001cäâYu«-\fû\n«\rªlA{áÓËòu`\u0004\u001bf ¡1\r3ÐÐÁ\u0019hhÌ`Ã\f44f°!P\rªl\bTeC *\u001bfà¦\u00103Ø0ÃÖë\u001fË÷òî²üïn¹³R½_ÈOòÇ¥þ\u0010sùM¾u¿3ÖÿÄ¶û]Úö\u000bQKÔôû½{S]Qs«U_î96ÌÐ\u0017{­`åËFnJ4´êú£úÚh®Ý:Ð:£aÝxK©;ÕVª'\u000e\u0000Oj\\.³\r3<W°²TßÈý¿«4ô/]ÍI4Xì !Îíµ9i­¡c1¿¼øV;Ún\u001d÷ Zú3Ù£å2kÙð\u001e48UÆd¢ãÍ£]`æúí\u0011Pùr§\u001dz¤¼¬ÿj£êµ~ûÍ-3êh;a\u001c\u0000>ìtËåÖ²á½h\"O®ñÚä¤Ì5´j½y)¡×cgmóÚT\u001a¯\u001d4\u001e-_M5Ä\u0001 Õó¼¬^jº×+Ò\\ú3Ï;·L¦nlýèAãÇv£ò÷7þ{ùY?úß{\rÏ¢M.&ê^¯ª~ôËdÐxýÍ×]/9büK\u001dq\töÅ%«ÓÐ­Ð-\u0005wË¿ÔþÃ½AcÅ\u0011±¿ùºÛM¡ÆËVÇ÷]NCW£¹ôoæ/n4F\\7ÇSvz\u000f\u001fh6\u001dõ´\u001bã'g\týLCW£¹ôO\u001aRZoãÙ¦þÆýÎ,\u001a¿5m4õ\u001bèî5ýøô÷Ö²aVè»å_DCk\u001eý]}ÚåÖ}«¡\u001f\u001fºßËv\u0019»ÕòY\u0019\r]æÐßÕ´kX­;NëíC¸ÄÇ¡ýØ\u001fnÄfñºñº²LÞ£M.&ê^¯Dsè?)¼Ë5lÛÕðS~&ÕnH¯ô\u001a\r]êï¯ï:\u0017ß>\u000böH9ÚbÌØ©ÚÙcéÉSÆ­ó\u001a\u001bE7¹²\r­Úû£b¼aw¹~m4~ÿiá_nÑºñvY®ï\u0016\u001bE7©\r­ºãqYÃÝ¹éjÒ~úñöX®ï\u0016\u001bfØSd·|¹VÍýiöLÍÜô>å\b½êá)Ç\u0019©Þþù4Í\u001cTK\tþÁÎ\u0016ª>\u001bÕz·fÖXñîêxzmùõÕ»}üí¨\u001e\u001aúLTgßÌ!.;âxË¦ÒzÚ¥D4lÔ\u0011×ïíIAü{YÛ©ÎA5ñØî,Tc4N«w!Ï¤µþ;\"Ï¹Ûw9nQ]4ôY¨Æ»6tÐºâ\\\u001cõãCå'Ñ,ñÚ)ÿH6\\j|¬yùÚZ6\u0004ª²!P\r3´SÉÑS\np\r3ÐÐÁ\u0019hhÌ`Ã\f44f°!P\rªl\bTeC *\u001b\u0002UÙ0\u0003O90\r3ÐÐÁ\u0019hhÌ`Ã\f44f°!P\rªl\bTeC *\u001bfà¦\u00103Ø0\u0003\r\u0019lÆ\f6Ì@Cc\u0006\u001b\u0002UÙ\u0010¨Ê@U6\u0004ª²!P\r3ð\u00033Ø0\u0003\r\u0019lÆ\f6Ì@Cc\u0006\u001b\u0002UÙ\u0010¨Ê@U6\u0004ª²a\u0006n\n1\r3ÐÐÁ\u0019hhÌ`Ã\f44f°!P\rªl\bTeC *\u001bfà¦\u00103Ø0\u0003\r\u0019lÆ\f6Ì@Cc\u0006\u001bf ¡1\rªl\bTeC *\u001b\u0002UÙ0\u00037Á\u0019hhÌ`Ã\f44f°a\u0006\u001a\u001a3Ø\u0010¨Ê@U6\u0004ª²!P\r3pS\u0019lÆ\f6Ì@Cc\u0006\u001bf ¡1\r3ÐÐÁ@U6\u0004ª²!P\rªlBÌ`Ã\f44f°a\u0006\u001a\u001a3Ø0\u0003\r\u0019l\bTeC *\u001b\u0002UÙ\u0010¨Ê\u0019t#øFÞv^»å#láÒÄý\u001fÝrÀ\u00116Ì \u0006~\u001dMÜyå\u0003°!P\rªl\bTeC *\u001b\u0002UÙ\u0010¨Ê@U6\u0004ª²!P\rªl\bTeC *\u001b\u00025=|ôûiV\u001a\u0010r\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000´\u0000\u0000\u0000´\b\u0006\u0000\u0000\u0000=Í\u00062\u0000\u0000\u0000\u0001sRGB\u0000®Î\u001cé\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000.\"\u0000\u0000.\"\u0001ªâÝ\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0004ûIDATx^íÛÁ±ÓH\u0014FaB`?\u001bB\u0010`\u0010\b\u0010\b\u0010\b\u0010\b\u0010Ø²\f<÷V«T3XR·¤÷¿:oÁ¡º_Ó%Û¼¹ÝnÒ«QJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJQJq_ýñ±|-ß\u0017úÏÝßÒÏ\\¥æó®|*Ë¹¶/åOú+Õ>ÇµýV^òÚöüóíµ}O?³\u0017ÆQ5Éüßåö\u001bý÷Ë¥_ã÷b÷âÒ\u001c~©¿GÍ¡7ìÏçô;½Y^ÂÚöIGó[êßgÊÚbÜ«&õ¶ôYHþ?½Q.Yø\u001a·¯rÏN¼GèXG«q{m×l¥^ÛK^]zÜ²um?Ó±¶À¸WM¨\u0017&úÌéºÆ{¿\u0018«áßªÆÜz¡¸ëMuöÚîÙÌw_èkaÜ£&Ò·\u000f4Áµ¾ÓqPcõÕnïßvûQc¹¶+aÜª&Ð÷J4±­NÙ$5ÎÖnò=[Ók;ºAÚG:þl5ÎèÉ×~Ò±×À¸UM \u001f@hb[}£ãÏTcÌ¸Ü\u001d~\u0002Ö\u001836H;ë\u0004µ¶\u001fèøÏ`Üª\u0006ß{ïü\u001fÇ­Æè\u0007A\u001c{¡û½5jik[\u000e½®ã<<Úµ¶\u0018·É8ôªWÇuÅkßÂ#^ýÚbÜ\n&3Â\r½\u0000cpC¯\u0001\u0019á^1G¸¡×ÉpC/À#ÜÐkÔàI\u000f3\u001f\\\u000eÿ¥ÆXó±ü*Ç­Æx5\u000fýÝ\rÔV_éø³Õ8³ÞZ:ücå\u001a£¿»Acouø[¢­ÆYó=5v­-Æ­jðYïí\u001eúxWãÌxi<üv£Õ8®í\u0006\u0018÷¨I^I\u000eO÷®ÆêM2rÔ\u001bì\u001d\u001dû\b5Öè{ç§¼òÝÕx£k»û\u000fã^5½\u001f)ò)ÖR9ò\u0005S>F^ª1w¯m9ûËI#\u001f×\u000f­-Æ\u00115¡­/9ý\u000fuÕ×G{So¹ô?Ò®dg¨±·®mCïªµíM}úÚb\u001cU\u0013ë§ÝgOçýðpÙæ¸«9ôíGogWËN¼¥CkÖöôW\u0011RóX»¶Sná0ÎÒ,ý\u000eHÿRwýç\u0017÷_ZÍ«OÄå\\[ß¿^¾\u001fÕzmû¹e9×´µþßÅ0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0J©0Jnoþ\u0001­êbõÎ.#\u000b\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000#\b\u0006\u0000\u0000\u0000ü\u0005¨ \u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÃ\u0000\u0000\u000eÃ\u0001Ço¨d\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0002 IDATXGÍïKSq\u0014Æ¿äÏ\u001a FsAB\u0011ú\"\bÔ`Sæ,üi?bÍEX¨ÛÐÌ¦L¯s)º\u0017Ñ«þ³§ãlzï¾Ç²nøõÅçrÏsöçìÞË½\u0002À\u0015UÂ*aE°¢JXQ%¢£§\u0011\\\\ZÒÎ\bìühnn¢µÄ òÍ\rá¬«a*ðiµ{÷m{{\u0007ñxüÐßÿ$3Ã(ºQÀrd\u0016hiuJý 3\u0004'På,ÂXÒ\u0004\u001c®rÖfÈjc(þ¥°\u001f54Tb\u0002\u0019n\u0016Â?÷¬ü¼$¬È\u0011ÿ¾Bµ\u000e\u0019ty¹ÀT®\u0015çcØÛGV~Þa°bÞ6\\¼lÂ8¬\u0005Yè\u001dl%\u001b?ë¨\u0018\nïX?ý3\u0014Ægµ ëù\u0005R\u0011=/ª¥°ß-ð|´\u0016Á·ðÏ`Ü7\bïøSubh¤ö¡²ê|)T\u0015Á­vÒª\u000blS\u0005\u001fVK!Ü£QYY\u0005Ãñ\u001f¨«®\u001e-\u000f\u001e¢³£\u000bµ®\nddñá\u001cs\rüeÙù\tß-bCõ¤Ó+¤»¯,\u0007^Ã 3<ê¹'\u0005r\\-´âýÔ+²ðsXñ(|¦OÅm{¡\u0014ÈQßhGl{lü,=¬x\u0018\u0003îNäÙ2¥ÀTÎÛ²1äé&\u000b?'\u0010ðcqõ\rÊ=IÐ\u0013ÝZ³á\u0014ÈQVQÐ\u0014ÙøYz4m=áYOSiì\u0019]Æ'_âÊõ?¿\n,çè|ÖB\u0016£ÿ(Äb_÷çcïH:è%\u000e­í÷No`} ÇÙ\fô{Ì.\u0016¿|2Ì\rF¼$ïõÄM{¡©¹'±°;/IMU$\u0016*±çI\r\u0015,|{\u000bí\u001eT _f92KÒ/=yrD£\u001bûË¬m,tÐ3üð¸Ð4-±ÌæNJcÏP\u001c\u0017@\u0000¡ÈG:{ \u001aVT\u0007ÄO\u0011î\rf\u0002Î{\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0001sRGB\u0000®Î\u001cé\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000b\u0012\u0000\u0000\u000b\u0012\u0001ÒÝ~ü\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.134\u0003[z\u0000\u0000\u0003IDATXGíØ_HSq\u0014\u0007pû§E%\"\u0016\u0006Ö¨P\u0012\u0019ø'2\u0014lµ|iD\u0014a\u001e61E}hÈB3§àò\u001f² èEèÏ[OQø¦S\u0011©Ã\u000ff/\u0005Õé{~xå¶~ÎÝy\b\u000f|\u0018÷rÏùýî»°­\b!\u0015\"ÅÑÆÄ.¸\f¯`\u001f\b\u0014c@°\u0004\u000fà$è\u0015Gá\u000ex×`û!`¼\u0007åbÅG°A(Sãi\\×ð\u0013Ôu¿À^ø+ÎÀiØ\u0003Ûà\bðH\u001bÇê\u0003.ÀS{\bÁLí\u0018¨§Á¿»p\u001dNÀ\u000eØ\tF¸\u0004+ñ\u00188é;ð4îC\u0011ðàßäËeþSS¦ñ\u0014ÞzñíÀuC\u000e¸à\u001d|\u0005^Û\r+¡4$Ã\tÈ\u0005®\u0001\u0017T\u001fó`\u0003p\u000eoÎq\b.B=ð¤?l\r\u0016tC2\u000bÀ{â6ð¼p\u0014¡\u001aÃ'ø\u0005²|u5ä\u0017öß°ZéÚ\u001e¶\u001aZ~\rEFFRzz:Y­V²ÙlâSQ\\\\L¹¹¹(ÍUÑ¯!Á@UUU4>>N\u001e&''WðñÐÐ\u0010åååIsUôk(>>ZZZhiid1;;KeeeÒ\\\u0015ý\u001aJHH ÖÖÖU\u001b§\ni®~\rEGGSvv6555Ëå\u0012ÍuuuQoo/õ÷÷sf³Y«\u0012zCáááETRRB¥¥¥T]]MmmmÔÙÙIuuuO\u0019\u0019\u0019Iiii\u0014\u001b\u001b+­¥\u0012zC|W566Òðð0ÍÌÌÐÔÔ\u0014MLLÐèè¨ø\u001c\u001c\u001c¤\u0002in\u0000¡7\u0014\u0015\u0015E===äõzwÉ122\"&&Ë\r`}\r\r\f\fÍ*±±1ª­­æ\u0006\u0010zC\u0011\u0011\u0011d±XÈn·SCC\u0003Õ××¯àcÞS¼d¹\u0001hkÈd2'oee¥¸\u001d\u000exöðFæ»JÑÞÞNÍÍÍTSSCåååâú¢¢\"2\u001aÒº*Ú\u001aâ[ÚívÓÂÂø©øa7==-ÄþøüÜÜ\u001cù|>q=o~¾#euU´5ÔÝÝ-\u0012\u001bò¤îëë£ÅÅÅå%´\u0005O:Y]\u0015m\råääÓé\u0014{D½gÖÒÑÑ!6;?HeuU´5\u0014\u0017\u0017'6fJJ\n%''\u0007-55(&&FZWE[Càßnß2\u000bá\u001e|o KÒÓ\u000f\u0018\u0001(TX5vÃ)¸\u0001`\u0004¸¬p0ø5É\u0003ÏÀ\u000egaÝÿ®p\u0001\u0013Ü\u0004~Uæ\u0005V{\u0011äÿ\u0002^À-°ÀAØà.\u0003p\u0015øµ_³ÿ\b\u000bû\rÀ!ú4w)ý\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÁ\u0000\u0000\u000eÁ\u0001¸kí\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0002÷IDATXGíÏ+\u0004a\u0018Ç·ü(\u0012VÉ\u0005E!\u0007¤M¤²¥(\u0017IB.þ\u0000ÉaS\u000e\u001c\u001f99(å@\bÑöæàê´).JJ}½Ïg}{¶\u001dfj\u001dL}ÚçýÎÌ÷ûÌ»ïìÌ\u0000ü)T1¨b6QE7³³³ÈÏÏG^^/rssQZZýý}c«g\u0011ª(ôõõ#Bspp`ìõLU\u0014l£ ¨¨¨0öi25Q°¢¨¨ÈØ§ÉÔDÁ6\nââbc&S\u0013\u0005Û((|5T__­­-\\__ó'IO$\u0012\u0018\u001d\u001duBÛÛ[pÝÝÝíím\\^^bww\u0017ýýý¬ûjèýý\u001dÑh\u0014ÂÛÛ\u001b\n\n\n°ººããc\u000e\u0010ÆÆÆðððÀõÈÈ±\u0000VVVP]]ÞÞ^\u001eÏÌÌü¾¡¶¶6<>>¦Ò\u0015·¶¶¢°°Ð\u001c\u0002þ}}ggg\u0018\u001f\u001fçfPfD\u0018\u0018\u0018ÀÉÉ¿\u0019:::Âýý=_éððpJÀÅÅ\u0005&''¹þ\u000eáºªª\n)ÇºñÕ\u0010ÑÓÓõõu#¨¬¬d}hh\b§§§\\/..bccë\u0006¼¾¾rMÌÏÏó¹´}||ü¾¡\tLOO;Æ\u0004.--9ãççgþ¡»¹¹q\u0016|NN\u000e¯µºº:ç8¢¹¹\u0019///¿o\u0016r<\u001eGMMcº³³Ã[ÆôUÒ\u001dtwwçhD,\u0016ÃÕÕ\u0015ß\u0000¢ÍÍÍáééÉßW¶¼¼ÌÓ/Ûææ¦\u0013@±înRX[[C2äý´£©©Éÿ\u001a\"ÊËËú§Ãáq \r\u0005ÉCøo(\u0013®!ÂÎ\u0012TQ°M¼ÒÒÒbN×=3¡\u001dä½½=s:Bô¬£§¿\u001bz.\u001e\u001e\u001eò~\rU\u0014ì ¯Ð£ÒöE\"\u0011c­ç\u0011ª(Øf^¡h\u0016lýû%MÍ\u0012TQ°\r½¢5D¯³¶¿*\nnÃ`7ÔÕÕeìô\f\u001bU\u0014Äð§¸\u001bêìì4Vº¿*\n\u000b\u000b\u000b)A^¡÷núR[[kltït¨¢\u001bºÚ\u000eÐ\u000b{{{F\u001a\u001b\u001bùßíã\u0015UÌ&ªMT1{ ô\u0005ñZ\u0001\nÂRÊ\u0015\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 77 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000$\u0000\u0000\u0000$\b\u0006\u0000\u0000\u0000á\u0000\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000\u000eÀ\u0000\u0000\u000eÀ\u0001jÖ\t\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.134\u0003[z\u0000\u0000\u0001\u0003IDATXGÍá\n\u00021\f}ÿÇ\u0015Aü5ï¦$a;fOøä\u0012Ú¯°[kíRØ²\u0012[VbË\fÇïüKA\u001e\f+è\bäÁ°\u001e@\u001e\f+è\bäÁ°\u001e@\u001e\f+è\u001fy\u001e¼Èá\nØ²\u0012[ÎçN£NÄ3TA-g¨<:\u0011[ÎPy\u0006u\"¶¡ò\fêDl9Cå\u0019ÔØ²\u0012[VâËïÓþ\u000bºa²°\u001bºa²°\u001bºa²°\u001bºa²°\u001bºa²°ÇÁýü¦Û\u0018®-+áðyÊ%¢>ï;\u0014d8CÔó}\fgúp¾ïPá\fQ\u001fÎ÷\u001d\n2!êÃù¾CA3D}8ßw´¨ÆØ²v{\u0003DT\u001dXrV \u0000\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 78 */
/***/ (function(module, exports) {

module.exports = "PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000Z\u0000\u0000\u0000´\b\u0006\u0000\u0000\u0000\u0014æ;ð\u0000\u0000\u0000\u0004gAMA\u0000\u0000±\u000büa\u0005\u0000\u0000\u0000\tpHYs\u0000\u0000.!\u0000\u0000.!\u0001\u0007[üÿ\u0000\u0000\u0000\u0019tEXtSoftware\u0000paint.net 4.0.12C\u0004kì\u0000\u0000\u0003qIDATx^íÒ±i\u0003A\u0000\u0005QUs]\u001c¨3\u0015¨¢ì\u001bs\u0019;Ó\u000fgà³°lôØGUUUUUUUUUUUUUUÕãù|\u001e×^ÿì¸Ô§yçû:¿¼û>ìE\u0017$?÷\u000fò¯½î§õI@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^\u0004¤`½ \u0017\u0001)X/èE@\nÖ\u000bz\u0011õ^tA\u001eçy¾û³ûþ¸Ö§yí\\UUUUUUUUUUUUUUUU\u001föx|\u0003ú\u0013³3zõü\u0000\u0000\u0000\u0000IEND®B`"

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(31)
var ieee754 = __webpack_require__(85)
var isArray = __webpack_require__(80)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(91)))

/***/ }),
/* 80 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(10)(undefined);
// imports


// module
exports.push([module.i, "/* Common stuff */\n.picker-wrapper,\n.slide-wrapper {\n    position: relative;\n    float: left;\n}\n.picker-indicator,\n.slide-indicator {\n    position: absolute;\n    left: 0;\n    top: 0;\n    pointer-events: none;\n}\n.picker,\n.slide {\n    cursor: crosshair;\n    float: left;\n}\n\n/* Default skin */\n\n.cp-default {\n    background-color: gray;\n    padding: 12px;\n    box-shadow: 0 0 40px #000;\n    border-radius: 15px;\n    float: left;\n}\n.cp-default .picker {\n    width: 200px;\n    height: 200px;\n}\n.cp-default .slide {\n    width: 30px;\n    height: 200px;\n}\n.cp-default .slide-wrapper {\n    margin-left: 10px;\n}\n.cp-default .picker-indicator {\n    width: 5px;\n    height: 5px;\n    border: 2px solid darkblue;\n    -moz-border-radius: 4px;\n    -o-border-radius: 4px;\n    -webkit-border-radius: 4px;\n    border-radius: 4px;\n    opacity: .5;\n    -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=50)\";\n    filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=50);\n    filter: alpha(opacity=50);\n    background-color: white;\n}\n.cp-default .slide-indicator {\n    width: 100%;\n    height: 10px;\n    left: -4px;\n    opacity: .6;\n    -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=60)\";\n    filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=60);\n    filter: alpha(opacity=60);\n    border: 4px solid lightblue;\n    -moz-border-radius: 4px;\n    -o-border-radius: 4px;\n    -webkit-border-radius: 4px;\n    border-radius: 4px;\n    background-color: white;\n}\n\n/* Small skin */\n\n.cp-small {\n    padding: 5px;\n    background-color: white;\n    /*float: left;*/\n    border-radius: 5px;\n}\n.cp-small .picker {\n    width: 100px;\n    height: 100px;\n}\n.cp-small .slide {\n    width: 15px;\n    height: 100px;\n}\n.cp-small .slide-wrapper {\n    margin-left: 5px;\n}\n.cp-small .picker-indicator {\n    width: 1px;\n    height: 1px;\n    border: 1px solid black;\n    background-color: white;\n}\n.cp-small .slide-indicator {\n    width: 100%;\n    height: 2px;\n    left: 0px;\n    background-color: black;\n}\n\n/* Fancy skin */\n\n.cp-fancy {\n    padding: 10px;\n/*    background-color: #C5F7EA; */\n    background: -webkit-linear-gradient(top, #aaa 0%, #222 100%);\n    float: left;\n    border: 1px solid #999;\n    box-shadow: inset 0 0 10px white;\n}\n.cp-fancy .picker {\n    width: 200px;\n    height: 200px;\n}\n.cp-fancy .slide {\n    width: 30px;\n    height: 200px;\n}\n.cp-fancy .slide-wrapper {\n    margin-left: 10px;\n}\n.cp-fancy .picker-indicator {\n    width: 24px;\n    height: 24px;\n    background-image: url(http://cdn1.iconfinder.com/data/icons/fugue/bonus/icons-24/target.png);\n}\n.cp-fancy .slide-indicator {\n    width: 30px;\n    height: 31px;\n    left: 30px;\n    background-image: url(http://cdn1.iconfinder.com/data/icons/bluecoral/Left.png);\n}\n\n/* Normal skin */\n\n.cp-normal {\n    padding: 10px;\n    background-color: white;\n    float: left;\n    border: 4px solid #d6d6d6;\n    box-shadow: inset 0 0 10px white;\n}\n.cp-normal .picker {\n    width: 200px;\n    height: 200px;\n}\n.cp-normal .slide {\n    width: 30px;\n    height: 200px;\n}\n.cp-normal .slide-wrapper {\n    margin-left: 10px;\n}\n.cp-normal .picker-indicator {\n    width: 5px;\n    height: 5px;\n    border: 1px solid gray;\n    opacity: .5;\n    -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=50)\";\n    filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=50);\n    filter: alpha(opacity=50);\n    background-color: white;\n    pointer-events: none;\n}\n.cp-normal .slide-indicator {\n    width: 100%;\n    height: 10px;\n    left: -4px;\n    opacity: .6;\n    -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=60)\";\n    filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=60);\n    filter: alpha(opacity=60);\n    border: 4px solid gray;\n    background-color: white;\n    pointer-events: none;\n}", ""]);

// exports


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(10)(undefined);
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n\nbody, input, textarea, select, text {\n  font-family: \"Segoe UI Web Regular\",\"wf_segoe-ui_normal\",\"Segoe UI\",\"Segoe UI Symbol\",\"Myriad\",\"Calibri\",\"UnDotum\",\"Optima\",\"Tahoma\",\"Century Gothic\",\"Helvetica Neue\",\"BBAlpha Sans\",\"S60 Sans\",\"Arial\",sans-serif;\n  margin: 0px;\n}\n\na {\n  text-decoration: none;\n  color: #626262;\n}\n\na:hover {\n  text-decoration: underline;\n}\n\n.img_btn_enabled {\n  filter: grayscale(0%);\n  cursor: pointer;\n  opacity: 1;\n  transition: all 0.3s ease;\n  border: 1px solid #CCCCCC;\n  margin: 2px;\n  border-radius: 5px;\n  -webkit-box-shadow: #FEFFFF 0px 1px 1px;\n  -moz-box-shadow: #FEFFFF 0px 1px 1px ;\n  box-shadow: #FEFFFF 0px 1px 1px ;\n  -webkit-border-radius: 5px;\n  -moz-border-radius: 5px;\n  display:inline-block;\n  background-color: #f4f5f5;\n  background-image: -webkit-gradient(linear, left top, left bottom, from(#f4f5f5), to(#dfdddd));\n  background-image: -webkit-linear-gradient(top, #f4f5f5, #dfdddd);\n  background-image: -moz-linear-gradient(top, #f4f5f5, #dfdddd);\n  background-image: -ms-linear-gradient(top, #f4f5f5, #dfdddd);\n  background-image: -o-linear-gradient(top, #f4f5f5, #dfdddd);\n  background-image: linear-gradient(to bottom, #f4f5f5, #dfdddd);\n  filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#f4f5f5, endColorstr=#dfdddd);\n  user-select: none;\n}\n\n.img_btn_enabled:hover {\n  border: 1px solid #ff0000;\n  background-color: #d9dddd;\n  background-image: -webkit-gradient(linear, left top, left bottom, from(#d9dddd), to(#c6c3c3));\n  background-image: -webkit-linear-gradient(top, #d9dddd, #c6c3c3);\n  background-image: -moz-linear-gradient(top, #d9dddd, #c6c3c3);\n  background-image: -ms-linear-gradient(top, #d9dddd, #c6c3c3);\n  background-image: -o-linear-gradient(top, #d9dddd, #c6c3c3);\n  background-image: linear-gradient(to bottom, #d9dddd, #c6c3c3);\n  filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#d9dddd, endColorstr=#c6c3c3);\n}\n\n.import-button-container {\n  position:absolute;\n  left:0;\n  top:0;\n  width:100%;\n  height:100%;\n  margin:2px;\n}\n\n.import-button {\n  margin-top:20px;\n  margin-bottom:10px;\n  margin-right:6px;\n  position:relative;\n}\n\n.import-button:hover {\n  cursor: pointer;\n}\n\n.import-button:hover img {\n  border: 1px solid #f00;\n  background-color: #d9dddd;\n  background-image: -webkit-gradient(linear, left top, left bottom, from(#d9dddd), to(#c6c3c3));\n  background-image: -webkit-linear-gradient(top, #d9dddd, #c6c3c3);\n  background-image: -moz-linear-gradient(top, #d9dddd, #c6c3c3);\n  background-image: -ms-linear-gradient(top, #d9dddd, #c6c3c3);\n  background-image: -o-linear-gradient(top, #d9dddd, #c6c3c3);\n  background-image: linear-gradient(to bottom, #d9dddd, #c6c3c3);\n  filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#d9dddd, endColorstr=#c6c3c3);\n}\n\n.img_btn_disabled {\n  filter: grayscale(100%);\n  cursor: default;\n  border: 1px solid #cccccc;\n  border-radius: 5px;\n  -webkit-box-shadow: #FEFFFF 0px 1px 1px ;\n  -moz-box-shadow: #FEFFFF 0px 1px 1px ;\n  box-shadow: #FEFFFF 0px 1px 1px ;\n  -webkit-border-radius: 5px;\n  -moz-border-radius: 5px5px;\n  margin: 2px;\n  user-select: none;\n}\n\n.filter_header_icon {\n  cursor: default;\n  border: 1px solid transparent;\n  user-select: none;\n  border-radius: 5px;\n  -webkit-box-shadow: #FEFFFF 0px 1px 1px ;\n  -moz-box-shadow: #FEFFFF 0px 1px 1px ;\n  box-shadow: #FEFFFF 0px 1px 1px ;\n  -webkit-border-radius: 5px;\n  -moz-border-radius: 5px5px;\n  margin: 2px;\n}\n\n.intro_btn {\n  width: 36px;\n  height: 36px;\n  float: left;\n}\n\n.text_input {\n  margin: 0px ;\n  line-height: 18px;\n  font-size: 14px;\n  padding: 9px;\n  border: 0;\n}\n\n/* This css rule is TOO broad, it makes it difficult to add new elements */\ninput {\n  display: block;\n  float: left;\n}\n\n/* Undo global input changes */\n.offline_image_cb,\n.add_image_popup input {\n  display: inline;\n  float: none;\n}\n\nlabel.option_rb > input,\nlabel.menu_rb > input,\nlabel.nav_cb > input  { /* HIDE RADIO */\n  visibility: hidden; /* Makes input not-clickable */\n  position: absolute; /* Remove input from document flow */\n  height: 0px;\n  width: 0px;\n}\n\ntext {\n  color: #666;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  user-select: none;\n  -ms-user-select: none;\n  cursor: default;\n}\n\n#footer {\n  bottom: 0px;\n  left: 0px;\n  position: absolute;\n  z-index: 1;\n  background: #F2F2F2;\n  border: 1px solid #999;\n  text-align: right;\n  vertical-align: middle;\n  width: 100%;\n  height: 25px;\n  transition: all 0.5s ease;\n  -webkit-transition: all 0.5s ease;\n  user-select:none;\n}\n\n#footer_left {\n  bottom: 0px;\n  left: 0px;\n  z-index: 1;\n  text-align: left;\n  vertical-align: middle;\n  margin-right: 0px;\n  height: 25px;\n  transition: all 0.5s ease;\n  -webkit-transition: all 0.5s ease;\n  float: left;\n}\n\n#footer_right {\n  bottom: 0px;\n  right: 0px;\n  z-index: 1;\n  text-align: right;\n  vertical-align: middle;\n  margin-left: 0px;\n  height: 25px;\n  transition: all 0.5s ease;\n  -webkit-transition: all 0.5s ease;\n  float: right;\n}\n\n.control_div {\n  background: #F2F2F2;\n  border: 1px solid #999;\n  z-index: 1;\n  box-shadow: 2px 2px 2px #888888;\n  border-radius: 10px;\n  text-align: center;\n  vertical-align: middle;\n  transition: all 0.5s ease;\n  -webkit-transition: all 0.5s ease;\n}\n\n.ui_label {\n  margin-left: auto;\n  margin-right: auto;\n  position: absolute;\n  text-align: center;\n  vertical-align: top;\n  font-size: 12px;\n}\n\n#menu_div {\n  left: -50px;\n  top: 50%;\n  width: 34px;\n  margin-top: -166px;\n  position: absolute;\n  padding: 5px;\n}\n\n.menu_label {\n  font-weight: normal;\n  font-size: 10px;\n}\n\n.menu_hr {\n  margin-bottom: 0px;\n  margin-top: 5px\n}\n\n.menu_rb {\n  float: left;\n}\n\n.menu_rb > input:disabled + img{ /* IMAGE STYLES */\n  cursor:default;\n  opacity: 0.3;\n}\n\n.menu_rb > input:enabled + img{ /* (RADIO CHECKED) IMAGE STYLES */\n  border: 2px solid #ccc;\n  cursor:pointer;\n  opacity: 1;\n}\n\n.menu_rb > input:enabled:hover + img{ /* (RADIO CHECKED) IMAGE STYLES */\n  border-bottom: 2px solid #666;\n  border-right: 2px solid #666;\n}\n\n.menu_rb > input:enabled:checked + img{ /* (RADIO CHECKED) IMAGE STYLES */\n  border-bottom: 2px solid #f00;\n  border-right: 2px solid #f00;\n}\n.menu_rb > input:enabled:checked:hover + img{ /* (RADIO CHECKED) IMAGE STYLES */\n  border-bottom: 2px solid #f00;\n  border-right: 2px solid #f00;\n}\n\n#menu_div input {\n  margin-top: 5px;\n  margin-bottom: 5px;\n}\n\n\n#export_formats .img_btn_disabled, #control_panel .img_btn_disabled{\n  opacity: 0.3;\n}\n\n#filter_div {\n  left: 56px;\n  top: 50%;\n  margin-top: -166px;\n  padding: 5px;\n  position: absolute;\n  min-width: 280px;\n}\n\n.filter_div_section {\n  position: relative;\n  clear: both;\n}\n\n.filter_div_header {\n  float: left;\n  width: 44px;\n  margin: 5px;\n  top: 50%;\n  transform: translate(0%,50%);\n}\n\n.filter_div_header text {\n  margin-left: -5px;\n}\n\n\n.filter_label {\n  display: block;\n}\n\n.filter_select {\n  margin-top: 5px;\n  width: 225px;\n  font-size: 10px;\n  border: solid #999 1px;\n  cursor:pointer;\n}\n\n.filter_select option:focus {\n  background-color: #000;\n}\n\nselect > option:focus:active {\n  background-color: #000;\n}\n\nselect > option {\n  background-color: #fff;\n  color: black;\n}\n\nselect > option:hover {\n  background-color: #999;\n  color: white;\n}\n\n/* The view options (top) and the scene bar (bottom) share one width: they leave room for the\n   side controls, grow with the window, and stop at a common maximum. */\n#option_div,\n#navigation_div {\n  left: 70px;\n  right: 70px;\n  width: auto;\n  max-width: 980px;\n  margin-left: auto;\n  margin-right: auto;\n  box-sizing: border-box;\n}\n\n#option_div {\n  top: 10px;\n  display: flex;\n  flex-wrap: nowrap;\n  justify-content: center;\n  overflow-x: auto;\n  overflow-y: hidden;\n  position: absolute;\n  padding-bottom: 5px;\n  padding-left: 0px;\n  padding-right: 0px;\n  padding-top: 5px;\n  user-select:none;\n}\n\n.option_rb {\n  margin-top: 20px;\n  vertical-align: top;\n  display: inline-block;\n  text-align: center;\n}\n\n.option_rb > input + img{ /* IMAGE STYLES */\n  cursor:pointer;\n  border: 2px solid transparent;\n}\n\n.option_rb > input:enabled:checked + img{ /* (RADIO CHECKED) IMAGE STYLES */\n  border-bottom: 2px solid #f00;\n  border-right: 2px solid #f00;\n}\n.option_rb > input:enabled:checked:hover + img{ /* (RADIO CHECKED) IMAGE STYLES */\n  border-bottom: 2px solid #f00;\n  border-right: 2px solid #f00;\n}\n.option_rb > input:enabled:hover + img{ /* (RADIO CHECKED) IMAGE STYLES */\n  border-bottom: 2px solid #666;\n  border-right: 2px solid #666;\n}\n\n.option_rb > input:enabled + img{ /* (RADIO CHECKED) IMAGE STYLES */\n  border: 2px solid #eee;\n  background-color: #fff;\n}\n\n.option_rb > .img_btn_enabled {\n  background-color: #fff;\n  background-image: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#fff));\n  background-image: -webkit-linear-gradient(top, #fff, #fff);\n  background-image: -moz-linear-gradient(top, #fff, #fff);\n  background-image: -ms-linear-gradient(top, #fff, #fff);\n  background-image: -o-linear-gradient(top, #fff, #fff);\n  background-image: linear-gradient(to bottom, #fff, #fff);\n  filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#fff, endColorstr=#fff);\n}\n\n.option_rb > .img_btn_enabled:hover {\n  background-color: #fff;\n  background-image: -webkit-gradient(linear, left top, left bottom, from(#eee), to(#ddd));\n  background-image: -webkit-linear-gradient(top, #fff, #eee);\n  background-image: -moz-linear-gradient(top, #fff, #eee);\n  background-image: -ms-linear-gradient(top, #fff, #eee);\n  background-image: -o-linear-gradient(top, #fff, #eee);\n  background-image: linear-gradient(to bottom, #fff, #eee);\n  filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#fff, endColorstr=#eee);\n}\n\n.option_rb > input:disabled + img{ /* (RADIO CHECKED) IMAGE STYLES */\n  filter: grayscale(100%);\n}\n\n.option_rb_label {\n  font-weight: normal;\n  font-size: 9px;\n  display: block;\n  color: #777;\n  user-select:none;\n}\n\n#rb_hint {\n  position: absolute;\n  border: 1px solid #444;\n  -webkit-border-radius: 10px;\n  -moz-border-radius: 10px;\n  border-radius: 10px;\n  max-width: 220px;\n  z-index: 1;\n  font-size: 12px;\n  padding: 5px;\n  font-style: italic;\n  background-color: #444;\n  color: #fff;\n  -webkit-box-shadow: 2px 2px 4px #888;\n  -moz-box-shadow: 2px 2px 4px #888;\n  box-shadow: 2px 2px 4px #888;\n}\n\n.rb_hint_left:before {\n  content: ' ';\n  position: absolute;\n  width: 0;\n  height: 0;\n  left: -15px;\n  top: 10px;\n  border-width: 10px 15px 10px 0;\n  border-style: solid;\n  border-color: transparent #444;\n}\n\n.rb_hint_right:before {\n  content: ' ';\n  position: absolute;\n  width: 0;\n  height: 0;\n  right: -15px;\n  top: 10px;\n  border-width: 10px 0px 10px 15px;\n  border-style: solid;\n  border-color: transparent #444;\n}\n\n.rb_hint_rep_highlight {\n  font-weight: bolder;\n  color: #2DAAE1;\n}\n\n.rb_hint_scale_highlight {\n  font-weight: bolder;\n  color: #E94E1B;\n}\n\n.rb_hint_layout_highlight {\n  font-weight: bolder;\n  color: #94C11F;\n}\n\n#hint_div {\n  right: 15px;\n  top: 20px;\n  height: 34px;\n  position: absolute;\n  padding: 5px;\n  transition: all 0.5s ease;\n  -webkit-transition: all 0.5s ease;\n}\n\n.introjs-hints a {\n    margin-left: -15px;\n    margin-top: -30px;\n}\n\n.introjs-hint-dot {\n  border: 10px solid rgba(255,165,0,0.7);\n}\n\n#export_div {\n  text-align: center;\n  position: absolute;\n  padding: 5px 5px 5px 5px;\n  vertical-align: middle;\n  top: -70px;\n  left: 10px;\n  right: 10px;\n  width: auto;\n  max-width: 650px;\n  margin-left: auto;\n  margin-right: auto;\n  user-select:none;\n}\n\n#export_formats {\n  text-align: center;\n  display: inline-flex;\n}\n\n#import_div {\n  text-align: center;\n  position: absolute;\n  top: -70px;\n  left: 10px;\n  right: 10px;\n  width: auto;\n  max-width: 650px;\n  margin-left: auto;\n  margin-right: auto;\n  user-select:none;\n}\n\n#boilerplate {\n  justify-content: center;\n  height: 25px;\n}\n\n#disclaimer {\n  justify-content: center;\n  border-top: 1px solid #999;\n  border-bottom: 1px solid #999;\n  padding: 5px;\n  clear: both;\n}\n\n.boilerplate_title {\n  text-align: center;\n  font-weight: 600;\n  font-stretch: ultra-expanded;\n  font-size: 16px;\n  color: #000;\n  bottom: 0px;\n  margin-left: -17px\n}\n\n.disclaimer_title {\n  text-align: center;\n  font-size: 12px;\n  color: #333;\n  margin-left: -17px\n}\n\n.metadata_title {\n  font-weight: bold;\n  font-size: 12px;\n  color: #333;\n  vertical-align: sub;\n}\n\n.boilerplate_text {\n  text-align: center;\n  font-size: 12px;\n  font-weight: bold;\n  color: #777;\n  bottom: 0px;\n  text-decoration: none;\n}\n\n.disclaimer_text {\n  font-weight: normal;\n  font-size: 10px;\n  text-align: center;\n  color: #333;\n}\n\n.metadata_content {\n  font-weight: normal;\n  font-size: 12px;\n  text-align: left;\n  color: #333;\n  margin-right: 10px;\n}\n\n.category_element {\n  width: auto;\n}\n\ninput[type=\"color\"]::-webkit-color-swatch-wrapper {\n\tpadding: 0;\n}\ninput[type=\"color\"]::-webkit-color-swatch {\n\tborder: none;\n}\n\ninput[type=\"color\"]::-moz-color-swatch-wrapper {\n\tpadding: 0;\n}\ninput[type=\"color\"]::-moz-color-swatch {\n\tborder: none;\n}\n\n.colorpicker_wrapper {\n  float: left;\n  width: 12px;\n  height: 12px;\n  margin-right: 5px;\n  margin-top: 2px;\n  cursor: pointer;\n  border: 1px solid #999;\n  padding: 0;\n  box-shadow: #999 0px 1px 1px;\n  -webkit-box-shadow: #999 0px 1px 1px;\n  -moz-box-shadow: #999 0px 1px 1px ;\n}\n\n.colorpicker {\n  /*width: 10px;\n  height: 10px;*/\n  width: 100%;\n  height: 100%;\n  cursor: pointer;\n  /*margin-right: 5px;\n  margin-top: 2px;*/\n  padding: 0;\n  /*opacity: 0;*/\n}\n\n.colorpicker:hover {\n  border: 1px solid #f00;\n}\n\n.colorpicker_wrapper:hover {\n  border: 1px solid #f00;\n}\n\n.footer_text_left {\n  text-align: left;\n  font-size: .8em;\n  margin-left: 24px;\n  color: #626262;\n  bottom: 0px;\n  text-decoration: none;\n}\n\n.footer_text {\n  text-align: right;\n  font-size: .8em;\n  margin-right: 24px;\n  color: #626262;\n  bottom: 0px;\n  text-decoration: none;\n}\n\n#data_picker {\n  width: 100%;\n  box-sizing: border-box;\n  transition: all 0.5s ease;\n  -webkit-transition: all 0.5s ease;\n  border-top: 1px solid #999;\n  padding-left: 0px;\n  padding-right: 0px;\n  padding-top: 0px;\n  padding-bottom: 0px;\n  margin-top: 0px;\n  margin-right: 0px;\n  margin-left: 0px;\n  margin-bottom: 0px;\n  display: flex;\n}\n\n.data_story_picker {\n  /*float: left;*/\n  flex: 1;\n  display: flex;\n  justify-content: center;\n  margin-top: 0px;\n  margin-right: 0px;\n  margin-left: 0px;\n  margin-bottom: 0px;\n  width: 320px;\n  border-right: 1px solid #999;\n}\n\n#timeline_metadata {\n  width: 100%;\n  box-sizing: border-box;\n  transition: all 0.5s ease;\n  border-top: 1px solid #999;\n  -webkit-transition: all 0.5s ease;\n  padding-left: 0px;\n  padding-right: 0px;\n  padding-top: 0px;\n  padding-bottom: 0px;\n  float: left;\n  font-size: 12px;\n}\n\n#timeline_metadata_contents{\n  width: 630px;\n  float: left;\n  padding-left: 10px;\n  padding-right: 10px;\n  padding-bottom: 0px;\n}\n\n.timeline_metadata_contents_div{\n  width: 630px;\n  clear: both;\n}\n\n.draw_timeline {\n  margin-left: 5px;\n  margin-left: 5px;\n  margin-bottom: 5px;\n  margin-top: 0px;\n  width: 320px;\n  padding-top: 15px;\n  padding-bottom: 15px;\n  height: 25px;\n  bottom: 0px;\n  right: 0px;\n  border-radius: 10px;\n  background-color: #ff7f0e;\n  border-color: #da6600;\n  background: #ff7f0e;\n  background-image: -webkit-linear-gradient(top, #ff7f0e, #da6600);\n  background-image: -moz-linear-gradient(top, #ff7f0e, #da6600);\n  background-image: -ms-linear-gradient(top, #ff7f0e, #da6600);\n  background-image: -o-linear-gradient(top, #ff7f0e, #da6600);\n  background-image: linear-gradient(to bottom, #ff7f0e, #da6600);\n}\n\n.draw_timeline:hover {\n  background-color: #da6600;\n  border-color: #ff7f0e;\n  background: #da6600;\n  background-image: -webkit-linear-gradient(top, #da6600, #ff7f0e);\n  background-image: -moz-linear-gradient(top, #da6600, #ff7f0e);\n  background-image: -ms-linear-gradient(top, #da6600, #ff7f0e);\n  background-image: -o-linear-gradient(top, #da6600, #ff7f0e);\n  background-image: linear-gradient(to bottom, #da6600, #ff7f0e);\n}\n\n.inputfile {\n  width: 0px;\n  height: 0px;\n  opacity: 0;\n  overflow: hidden;\n  position: absolute;\n  z-index: -1;\n  margin: auto;\n}\n\n#demo_dataset_picker {\n  width: 40px;\n  height: 40px;\n  opacity: 0;\n  border: 0px solid transparent;\n  cursor: pointer;\n  position: absolute;\n  z-index: 1;\n  font-size: 10px;\n  background: transparent;\n}\n\n.import_label > select + img {\n  border:1px solid #cccccc;\n}\n\n.import_label > select:hover + img:hover{ /* (RADIO CHECKED) IMAGE STYLES */\n  border-bottom: 1px solid #f00;\n}\n.import_label {\n  margin-top: 10px;\n}\n\n.demo_dataset_label {\n  border: 1px solid #cccccc;\n  width: 40px;\n  height: 40px;\n  margin-right: 2px;\n  margin-top: 20px;\n  border-radius: 5px;\n  background-color: #f4f5f5;\n  background-image: -webkit-gradient(linear, left top, left bottom, from(#f4f5f5), to(#dfdddd));\n  background-image: -webkit-linear-gradient(top, #f4f5f5, #dfdddd);\n  background-image: -moz-linear-gradient(top, #f4f5f5, #dfdddd);\n  background-image: -ms-linear-gradient(top, #f4f5f5, #dfdddd);\n  background-image: -o-linear-gradient(top, #f4f5f5, #dfdddd);\n  background-image: linear-gradient(to bottom, #f4f5f5, #dfdddd);\n  filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#f4f5f5, endColorstr=#dfdddd);\n}\n\n.demo_dataset_label:hover {\n  border: 1px solid #ff0000;\n  background-color: #d9dddd;\n  background-image: -webkit-gradient(linear, left top, left bottom, from(#d9dddd), to(#c6c3c3));\n  background-image: -webkit-linear-gradient(top, #d9dddd, #c6c3c3);\n  background-image: -moz-linear-gradient(top, #d9dddd, #c6c3c3);\n  background-image: -ms-linear-gradient(top, #d9dddd, #c6c3c3);\n  background-image: -o-linear-gradient(top, #d9dddd, #c6c3c3);\n  background-image: linear-gradient(to bottom, #d9dddd, #c6c3c3);\n  filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=#d9dddd, endColorstr=#c6c3c3);\n}\n\n.annotation_div {\n  position: absolute;\n  text-align: center;\n  position: absolute;\n  padding: 5px 5px 5px 5px;\n  vertical-align: middle;\n  left: 56px;\n  top: 50%;\n}\n\n.annotation_circle {\n  fill: #fff;\n  stroke: #f00;\n  stroke-width: 1px;\n}\n\n.annotation_line {\n  fill: none;\n  stroke: #f00;\n  stroke-width: 1px;\n}\n\n.event_annotation_line {\n  stroke: dashed .5px #aaa;\n}\n\n.annotation_frame {\n  fill:#fff;\n  stroke-width: 1px;\n  stroke:transparent;\n}\n\n.annotation_control {\n  border: 1px solid #ccc;\n  stroke-width: 1px;\n  stroke: #ccc;\n  cursor: pointer;\n  fill: transparent;\n}\n\n#caption_div {\n  margin-top: -95px;\n}\n\n.caption_frame, .image_frame {\n  fill:#fff;\n  stroke-width: 1px;\n  stroke:transparent;\n}\n\n.caption_drag_area, .annotation_drag_area, .image_drag_area {\n  fill: transparent;\n  fill-opacity: 0;\n  stroke-width: 1px;\n  stroke: transparent;\n  cursor: move;\n  box-shadow: 2px 2px 2px #888888;\n  -webkit-box-shadow: 2px 2px 2px #888888;\n  -moz-box-shadow: 2px 2px 2px #888888;\n}\n\n.caption_label {\n  font-size: 18px;\n  position: absolute;\n  display: inline-block;\n  top: 0;\n  left: 0;\n  font-weight: normal;\n}\n\n#add_caption_text_input {\n  resize: vertical;\n  display: block;\n  float: left;\n  padding: 10px;\n}\n\n.add_image_popup {\n  margin-top: -55px;\n}\n\n.onhover {\n  opacity: 0.33;\n}\n\n.onhover:hover {\n  opacity: 1;\n}\n\n#playback_bar {\n  display: flex;\n  align-items: center;\n  width: 100%;\n}\n\n#navigation_div {\n  bottom: -100px;\n  position: absolute;\n  padding-bottom: 5px;\n  padding-left: 0px;\n  padding-right: 0px;\n  padding-top: 5px;\n}\n\n.playback_mode #navigation_div {\n  width: auto;\n  left: 10px;\n  right: auto;\n  margin-left: 0;\n  margin-right: 0;\n  -webkit-transition: all 0.5s;\n  transition: all 0.5s;\n}\n\n.nav_cb > input:enabled:checked + img {\n  border: 1px solid #f00;\n}\n\n\n#playback_bar .nav_bttn {\n  display: flex;\n  flex: 0 1 26px;\n}\n\n.nav_bttn .nav_cb {\n  display: inline-flex;\n}\n\n#stepper_container {\n  height: 50px;\n  padding: 0px;\n  margin-right: 5px;\n  background-color: white;\n  border: 1px solid #999;\n  padding: 5px;\n  border-radius: 5px;\n  vertical-align: middle;\n  overflow-y: hidden;\n  overflow-x: overlay;\n  flex: 1;\n}\n\n.playback_mode #stepper_container {\n  display: none;\n}\n\n#stepper_svg {\n  height: 50px;\n  padding: 0px;\n  float: left;\n}\n\n#stepper_svg_placeholder {\n  fill: #ccc;\n  font-size: 0.8em;\n}\n\n.scene_delete rect {\n  fill: transparent;\n  stroke: #ccc;\n  stroke-width: '1px';\n}\n\n.frame_hover {\n  height: 300px;\n  width: 300px;\n  background: #fff;\n  border: 1px solid #999;\n  z-index: 1;\n  box-shadow: 2px 2px 2px #888888;\n  -webkit-box-shadow: 2px 2px 2px #888888;\n  -moz-box-shadow: 2px 2px 2px #888888;\n  border-radius: 10px;\n  text-align: center;\n  position: absolute;\n  vertical-align: middle;\n  transition: all 0.5s ease;\n  -webkit-transition: all 0.5s ease;\n}\n\n.option_picker {\n  flex: 0 0 auto;\n  display: flex;\n  justify-content: center;\n  border-right: 1px solid #999;\n  padding-bottom: 0px;\n  padding-top: 0px;\n  padding-left: 5px;\n  padding-right: 5px;\n  margin: 0px;\n}\n\n.option_picker:last-child {\n  border-right: none;\n}\n\n#main_svg {\n  transition: all 0.5s ease;\n  -webkit-transition: all 0.5s ease;\n}\n\n.legend {\n  margin: 0px 0px 0px 0px;\n  fill: none;\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  z-index: 1;\n}\n\n.legend_rect {\n  fill: #fff;\n  stroke: #aaa;\n  stroke-width: 1px;\n}\n\n.legend_title {\n  fill: #666;\n  font-size: 12px;\n  font-weight: bolder;\n  font-stretch: expanded;\n}\n\n.legend:hover > .legend_rect:hover, .legend_title:hover {\n  cursor:move;\n}\n\n.legend:hover > .legend_rect {\n  stroke: #f00;\n}\n\n.legend_element_g text {\n  fill: #666;\n  font-size: 12px;\n  cursor:pointer;\n}\n\n.legend_element rect {\n  stroke: #fff;\n  stroke-width: 0.25px;\n  cursor:pointer;\n}\n\n.time_elapsed {\n  fill:#aaa;\n  stroke: #aaa;\n  stroke-width: 0.5px;\n}\n\n.timeline_frame {\n  fill:transparent;\n  opacity: 0.1;\n  stroke: none;\n}\n\n.timeline_frame:hover {\n  stroke: #999;\n  stroke-width: 0.5px;\n}\n\n.timeline_facet_frame {\n  fill:none;\n  stroke: #999;\n  stroke-width: 0.5px;\n}\n\n.timeline_segment_frame {\n  fill:none;\n  stroke: #999;\n  stroke-width: 0.5px;\n}\n\n.form-group {\n  margin-bottom: 0px;\n  display:inline-block;\n}\n\n.radio-inline {\n  padding-left: 0px;\n  margin-left: 0px;\n}\n\n.radio-inline label {\n  padding-left: 0px;\n}\n\n.radio-inline input[type=radio] {\n  margin-left: 0px;\n}\n\n.unit_circle {\n  fill: #fff;\n  stroke: #000;\n  stroke-width: 1px;\n}\n\n.x_axis path, .interim_duration_axis path, .timeline_axis path {\n  fill: none;\n  stroke: #999;\n  stroke-width: 1px;\n  z-index: -1;\n}\n\n.radial_axis_tick path {\n  fill: none;\n  stroke: #999;\n  stroke-width: 1px;\n  stroke-dasharray: 2;\n  z-index: -1;\n}\n\n@keyframes dash {\n  to {\n    stroke-dashoffset: 0;\n  }\n}\n\n@keyframes undash {\n  from {\n    stroke-dashoffset: 0;\n  }\n  to {\n    stroke-dashoffset: -110%;\n  }\n}\n\n.x_axis line, .interim_duration_axis line, .timeline_axis line {\n  fill: none;\n  stroke: #999;\n  shape-rendering: crispEdges;\n  stroke-width: 1px;\n  stroke-dasharray: 2;\n  z-index: -1;\n}\n\n.x_axis text, .interim_duration_axis text, .timeline_axis text {\n  font-size: 12px;\n  fill: #000;\n  z-index: 1;\n}\n\n/* d3-axis sets its own font on the axis group; keep the app's font. */\n.interim_duration_axis, .timeline_axis {\n  font-family: inherit;\n}\n\n.event_rect {\n  fill: #8dd3c7;\n  stroke: #fff;\n}\n\n.event_rect:hover {\n  fill: #8dd3c7;\n  stroke: #00f;\n}\n\n.event_span, .event_span_component {\n  stroke: #fff;\n  stroke-width: 0.25px;\n  cursor:pointer;\n}\n\n.event_span_selected {\n  stroke: #000;\n  stroke-width: 1px;\n}\n\n.event_dropline {\n  stroke: #00f;\n  stroke-width: 0px;\n}\n\n.frame_resizer:hover {\n  cursor: ew-resize;\n}\n\n.start_end_label, .radial_axis_tick, .weekday_label {\n  font-size: 12px;\n}\n\n.facet_title, .segment_title {\n  font-size: 13px;\n  font-weight:bold;\n  font-stretch: extra-expanded;\n}\n\n.event_label {\n  fill: #f00;\n  font-size: 12px;\n  position: absolute;\n  display: inline-block;\n  top: 0;\n  left: 0;\n  font-weight: normal;\n}\n\n.event_date {\n  font: 10px sans-serif;\n  display: none;\n}\n\n.spiral_seq_number {\n  font: 10px sans-serif;\n  fill: #666;\n}\n\n.event_text {\n  font: 10px sans-serif;\n  display: none;\n}\n\n.year_cell, .day_cell, .rad_center, .day_cell_rect {\n  stroke: #aaa;\n  stroke-width: 0.25px;\n  fill: none;\n}\n\n.rad_track {\n  stroke: #999;\n  stroke-width: 0.5px;\n  fill: none;\n  z-index: -1;\n}\n\n.timeline_start_line {\n  stroke: #aaa;\n  stroke-width: 0.5px;\n}\n\n.year_label {\n  font-size: 10px;\n}\n\n.day_cell_label {\n  font-size: 7px;\n}\n\n.month {\n  fill: none;\n  stroke: #999;\n  stroke-width: 1px;\n}\n\n.time_elapsed {\n  stroke: #aaa;\n  stroke-width: 0.5px;\n  fill: #ccc;\n}\n\n.time_elapsed:hover {\n  stroke: #00f;\n  stroke-width: 0.5px;\n  fill: #00f;\n  fill-opacity: 0.25;\n}\n\n.point_event {\n  fill: #000;\n  fill-opacity: .1;\n  stroke: #000;\n  stroke-width: 0.5px;\n}\n\n.event_start {\n  fill: #f00;\n  fill-opacity: .1;\n  stroke: #f00;\n  stroke-width: 0.5px;\n}\n\n.event_end {\n  fill: #00f;\n  fill-opacity: .1;\n  stroke: #00f;\n  stroke-width: 0.5px;\n}\n\n.non_event {\n  display: none;\n}\n\n.span_line {\n  stroke: #00f;\n  stroke-opacity: 0.2;\n  stroke-width: 5px;\n}\n\n.span_line:hover {\n  stroke: #ff0;\n  stroke-opacity: 1;\n  stroke-width: 5px;\n}\n\n.arc {\n  fill: #aaa;\n}\n\n.line {\n  fill: none;\n  stroke: #aaa;\n  stroke-width: 1px;\n  stroke-linejoin: round;\n  stroke-linecap: round;\n  z-index:-1;\n}\n\n.image_div_error {\n  color: red;\n}\n\n.path_end_indicator {\n  fill: none;\n  stroke: #fff;\n}\n\n#timecurve{\n  fill:none;\n  stroke-width:10px;\n  stroke:#777777;\n  opacity: .2;\n  transition: all 0.5s ease;\n  -webkit-transition: all 0.5s ease;\n}\n\n/* introjs overrides */\n\n.introjs-overlay {\n  background-color: #999;\n  background: -webkit-radial-gradient(center,ellipse cover,rgba(153,153,153,0.4) 0,rgba(153,153,153,0.9) 100%)\n}\n\n.introjs-helperLayer {\n  border: 1px solid #f00;\n  background-color: transparent;\n}\n\n.timeline_storyteller-container {\n  width: 100%;\n  height: 100%;\n  overflow: auto;\n  box-sizing: border-box;\n  padding-bottom: 50px;\n  padding-top: 50px;\n  padding-left: 50px;\n  padding-right: 50px;\n  text-align: center;\n}\n\n.show-about-bar .timeline_storyteller-container {\n    height: calc(100% - 25px);\n}\n\n.playback_mode .timeline_storyteller-container {\n  padding-left: 0;\n  padding-right: 0;\n}\n\nhtml, body {\n  width: 100%;\n  height: 100%;\n}\n\n.timeline_storyteller {\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  position: relative;\n}\n\n.loading_data_indicator {\n  font-weight: bold;\n  margin-bottom: 10px;\n}\n\n\n/* Add Image Popup */\n.add_image_popup h4 {\n  margin: 3px;\n}\n.add_image_popup h5 {\n  margin: 3px;\n}\n\n.resize_width, .resize_height {\n  width: 55px;\n}\n\n.resize_options {\n  margin-bottom: 5px;\n}\n\n.add_image_selected_file {\n  font-size: 14px;\n  cursor: pointer;\n}\n\n.add_image_file_chooser {\n  margin-bottom: 5px;\n}\n\n.selected_file_remove_btn {\n  width: 18px;\n  height: 18px;\n  float: right;\n}\n\n.selected_files_container {\n  vertical-align: middle;\n  margin: 5px;\n}\n\n.image_div_container {\n   position: relative;\n}\n\n.image_div_container .add_image_link {\n  width: 100%;\n  box-sizing: border-box;\n}\n.image_local_add_drop_zone {\n  border: 2px dashed #bbb;\n  -moz-border-radius: 5px;\n  -webkit-border-radius: 5px;\n  border-radius: 5px;\n  padding: 10px;\n  color: #bbb;\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.image_local_add_drop_zone.dragging {\n  border-color: #333;\n  color: #333;\n}\n\n.add_image_btn {\n  float: right;\n}\n\n.add_image_popup {\n  font-size: 14px;\n}\n\n.add_image_popup input[type=\"checkbox\"] {\n  vertical-align: middle;\n}\n\n.timeline_storyteller-error {\n  position: absolute;\n  top: 150px;\n  width: 100%;\n  margin: 0 auto;\n}\n\n/* Narrow windows: smaller option icons without captions, then tighter side margins. */\n@media (max-width: 900px) {\n  #option_div .option_rb img {\n    width: 30px;\n    height: 30px;\n  }\n\n  #option_div .option_rb_label {\n    display: none;\n  }\n}\n\n@media (max-width: 700px) {\n  #option_div,\n  #navigation_div {\n    left: 10px;\n  }\n\n  #option_div {\n    justify-content: flex-start;\n  }\n}\n\n/* Labels in other languages can be wider than the English ones: keep them on one line. */\n#menu_div .menu_label {\n  display: block;\n  margin-left: -5px;\n  margin-right: -5px;\n  text-align: center;\n  white-space: nowrap;\n}\n\n.filter_div_header {\n  white-space: nowrap;\n}\n", ""]);

// exports


/***/ }),
/* 83 */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(83);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 85 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 86 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 87 */
/***/ (function(module, exports) {

module.exports = "(function (b) {\n  function a(b, d) {\n    if ({}.hasOwnProperty.call(a.cache, b)) return a.cache[b];var e = a.resolve(b);if (!e) throw new Error('Failed to resolve module ' + b);var c = { id: b, require: a, filename: b, exports: {}, loaded: !1, parent: d, children: [] };d && d.children.push(c);var f = b.slice(0, b.lastIndexOf('/') + 1);return a.cache[b] = c.exports, e.call(c.exports, c, c.exports, f, b), c.loaded = !0, a.cache[b] = c.exports;\n  }a.modules = {}, a.cache = {}, a.resolve = function (b) {\n    return {}.hasOwnProperty.call(a.modules, b) ? a.modules[b] : void 0;\n  }, a.define = function (b, c) {\n    a.modules[b] = c;\n  }, a.define('/gif.worker.coffee', function (d, e, f, g) {\n    var b, c;b = a('/GIFEncoder.js', d), c = function c(a) {\n      var c, e, d, f;return c = new b(a.width, a.height), a.index === 0 ? c.writeHeader() : c.firstFrame = !1, c.setTransparent(a.transparent), c.setRepeat(a.repeat), c.setDelay(a.delay), c.setQuality(a.quality), c.addFrame(a.data), a.last && c.finish(), d = c.stream(), a.data = d.pages, a.cursor = d.cursor, a.pageSize = d.constructor.pageSize, a.canTransfer ? (f = function (c) {\n        for (var b = 0, d = a.data.length; b < d; ++b) {\n          e = a.data[b], c.push(e.buffer);\n        }return c;\n      }.call(this, []), self.postMessage(a, f)) : self.postMessage(a);\n    }, self.onmessage = function (a) {\n      return c(a.data);\n    };\n  }), a.define('/GIFEncoder.js', function (e, h, i, j) {\n    function c() {\n      this.page = -1, this.pages = [], this.newPage();\n    }function b(a, b) {\n      this.width = ~~a, this.height = ~~b, this.transparent = null, this.transIndex = 0, this.repeat = -1, this.delay = 0, this.image = null, this.pixels = null, this.indexedPixels = null, this.colorDepth = null, this.colorTab = null, this.usedEntry = new Array(), this.palSize = 7, this.dispose = -1, this.firstFrame = !0, this.sample = 10, this.out = new c();\n    }var f = a('/TypedNeuQuant.js', e),\n        g = a('/LZWEncoder.js', e);c.pageSize = 4096, c.charMap = {};for (var d = 0; d < 256; d++) {\n      c.charMap[d] = String.fromCharCode(d);\n    }c.prototype.newPage = function () {\n      this.pages[++this.page] = new Uint8Array(c.pageSize), this.cursor = 0;\n    }, c.prototype.getData = function () {\n      var d = '';for (var a = 0; a < this.pages.length; a++) {\n        for (var b = 0; b < c.pageSize; b++) {\n          d += c.charMap[this.pages[a][b]];\n        }\n      }return d;\n    }, c.prototype.writeByte = function (a) {\n      this.cursor >= c.pageSize && this.newPage(), this.pages[this.page][this.cursor++] = a;\n    }, c.prototype.writeUTFBytes = function (b) {\n      for (var c = b.length, a = 0; a < c; a++) {\n        this.writeByte(b.charCodeAt(a));\n      }\n    }, c.prototype.writeBytes = function (b, d, e) {\n      for (var c = e || b.length, a = d || 0; a < c; a++) {\n        this.writeByte(b[a]);\n      }\n    }, b.prototype.setDelay = function (a) {\n      this.delay = Math.round(a / 10);\n    }, b.prototype.setFrameRate = function (a) {\n      this.delay = Math.round(100 / a);\n    }, b.prototype.setDispose = function (a) {\n      a >= 0 && (this.dispose = a);\n    }, b.prototype.setRepeat = function (a) {\n      this.repeat = a;\n    }, b.prototype.setTransparent = function (a) {\n      this.transparent = a;\n    }, b.prototype.addFrame = function (a) {\n      this.image = a, this.getImagePixels(), this.analyzePixels(), this.firstFrame && (this.writeLSD(), this.writePalette(), this.repeat >= 0 && this.writeNetscapeExt()), this.writeGraphicCtrlExt(), this.writeImageDesc(), this.firstFrame || this.writePalette(), this.writePixels(), this.firstFrame = !1;\n    }, b.prototype.finish = function () {\n      this.out.writeByte(59);\n    }, b.prototype.setQuality = function (a) {\n      a < 1 && (a = 1), this.sample = a;\n    }, b.prototype.writeHeader = function () {\n      this.out.writeUTFBytes('GIF89a');\n    }, b.prototype.analyzePixels = function () {\n      var g = this.pixels.length,\n          d = g / 3;this.indexedPixels = new Uint8Array(d);var a = new f(this.pixels, this.sample);a.buildColormap(), this.colorTab = a.getColormap();var b = 0;for (var c = 0; c < d; c++) {\n        var e = a.lookupRGB(this.pixels[b++] & 255, this.pixels[b++] & 255, this.pixels[b++] & 255);this.usedEntry[e] = !0, this.indexedPixels[c] = e;\n      }this.pixels = null, this.colorDepth = 8, this.palSize = 7, this.transparent !== null && (this.transIndex = this.findClosest(this.transparent));\n    }, b.prototype.findClosest = function (e) {\n      if (this.colorTab === null) return -1;var k = (e & 16711680) >> 16,\n          l = (e & 65280) >> 8,\n          m = e & 255,\n          c = 0,\n          d = 16777216,\n          j = this.colorTab.length;for (var a = 0; a < j;) {\n        var f = k - (this.colorTab[a++] & 255),\n            g = l - (this.colorTab[a++] & 255),\n            h = m - (this.colorTab[a] & 255),\n            i = f * f + g * g + h * h,\n            b = parseInt(a / 3);this.usedEntry[b] && i < d && (d = i, c = b), a++;\n      }return c;\n    }, b.prototype.getImagePixels = function () {\n      var a = this.width,\n          g = this.height;this.pixels = new Uint8Array(a * g * 3);var b = this.image,\n          c = 0;for (var d = 0; d < g; d++) {\n        for (var e = 0; e < a; e++) {\n          var f = d * a * 4 + e * 4;this.pixels[c++] = b[f], this.pixels[c++] = b[f + 1], this.pixels[c++] = b[f + 2];\n        }\n      }\n    }, b.prototype.writeGraphicCtrlExt = function () {\n      this.out.writeByte(33), this.out.writeByte(249), this.out.writeByte(4);var b, a;this.transparent === null ? (b = 0, a = 0) : (b = 1, a = 2), this.dispose >= 0 && (a = dispose & 7), a <<= 2, this.out.writeByte(0 | a | 0 | b), this.writeShort(this.delay), this.out.writeByte(this.transIndex), this.out.writeByte(0);\n    }, b.prototype.writeImageDesc = function () {\n      this.out.writeByte(44), this.writeShort(0), this.writeShort(0), this.writeShort(this.width), this.writeShort(this.height), this.firstFrame ? this.out.writeByte(0) : this.out.writeByte(128 | this.palSize);\n    }, b.prototype.writeLSD = function () {\n      this.writeShort(this.width), this.writeShort(this.height), this.out.writeByte(240 | this.palSize), this.out.writeByte(0), this.out.writeByte(0);\n    }, b.prototype.writeNetscapeExt = function () {\n      this.out.writeByte(33), this.out.writeByte(255), this.out.writeByte(11), this.out.writeUTFBytes('NETSCAPE2.0'), this.out.writeByte(3), this.out.writeByte(1), this.writeShort(this.repeat), this.out.writeByte(0);\n    }, b.prototype.writePalette = function () {\n      this.out.writeBytes(this.colorTab);var b = 768 - this.colorTab.length;for (var a = 0; a < b; a++) {\n        this.out.writeByte(0);\n      }\n    }, b.prototype.writeShort = function (a) {\n      this.out.writeByte(a & 255), this.out.writeByte(a >> 8 & 255);\n    }, b.prototype.writePixels = function () {\n      var a = new g(this.width, this.height, this.indexedPixels, this.colorDepth);a.encode(this.out);\n    }, b.prototype.stream = function () {\n      return this.out;\n    }, e.exports = b;\n  }), a.define('/LZWEncoder.js', function (e, g, h, i) {\n    function f(y, D, C, B) {\n      function w(a, b) {\n        r[f++] = a, f >= 254 && t(b);\n      }function x(b) {\n        u(a), k = i + 2, j = !0, l(i, b);\n      }function u(b) {\n        for (var a = 0; a < b; ++a) {\n          h[a] = -1;\n        }\n      }function A(z, r) {\n        var g, t, d, e, y, w, s;for (q = z, j = !1, n_bits = q, m = p(n_bits), i = 1 << z - 1, o = i + 1, k = i + 2, f = 0, e = v(), s = 0, g = a; g < 65536; g *= 2) {\n          ++s;\n        }s = 8 - s, w = a, u(w), l(i, r);a: while ((t = v()) != c) {\n          if (g = (t << b) + e, d = t << s ^ e, h[d] === g) {\n            e = n[d];continue;\n          }if (h[d] >= 0) {\n            y = w - d, d === 0 && (y = 1);do {\n              if ((d -= y) < 0 && (d += w), h[d] === g) {\n                e = n[d];continue a;\n              }\n            } while (h[d] >= 0);\n          }l(e, r), e = t, k < 1 << b ? (n[d] = k++, h[d] = g) : x(r);\n        }l(e, r), l(o, r);\n      }function z(a) {\n        a.writeByte(s), remaining = y * D, curPixel = 0, A(s + 1, a), a.writeByte(0);\n      }function t(a) {\n        f > 0 && (a.writeByte(f), a.writeBytes(r, 0, f), f = 0);\n      }function p(a) {\n        return (1 << a) - 1;\n      }function v() {\n        if (remaining === 0) return c;--remaining;var a = C[curPixel++];return a & 255;\n      }function l(a, c) {\n        g &= d[e], e > 0 ? g |= a << e : g = a, e += n_bits;while (e >= 8) {\n          w(g & 255, c), g >>= 8, e -= 8;\n        }if ((k > m || j) && (j ? (m = p(n_bits = q), j = !1) : (++n_bits, n_bits == b ? m = 1 << b : m = p(n_bits))), a == o) {\n          while (e > 0) {\n            w(g & 255, c), g >>= 8, e -= 8;\n          }t(c);\n        }\n      }var s = Math.max(2, B),\n          r = new Uint8Array(256),\n          h = new Int32Array(a),\n          n = new Int32Array(a),\n          g,\n          e = 0,\n          f,\n          k = 0,\n          m,\n          j = !1,\n          q,\n          i,\n          o;this.encode = z;\n    }var c = -1,\n        b = 12,\n        a = 5003,\n        d = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535];e.exports = f;\n  }), a.define('/TypedNeuQuant.js', function (A, F, E, D) {\n    function C(A, B) {\n      function I() {\n        o = [], q = new Int32Array(256), t = new Int32Array(a), y = new Int32Array(a), z = new Int32Array(a >> 3);var c, d;for (c = 0; c < a; c++) {\n          d = (c << b + 8) / a, o[c] = new Float64Array([d, d, d, 0]), y[c] = e / a, t[c] = 0;\n        }\n      }function J() {\n        for (var c = 0; c < a; c++) {\n          o[c][0] >>= b, o[c][1] >>= b, o[c][2] >>= b, o[c][3] = c;\n        }\n      }function K(b, a, c, e, f) {\n        o[a][0] -= b * (o[a][0] - c) / d, o[a][1] -= b * (o[a][1] - e) / d, o[a][2] -= b * (o[a][2] - f) / d;\n      }function L(j, e, n, l, k) {\n        var h = Math.abs(e - j),\n            i = Math.min(e + j, a),\n            g = e + 1,\n            f = e - 1,\n            m = 1,\n            b,\n            d;while (g < i || f > h) {\n          d = z[m++], g < i && (b = o[g++], b[0] -= d * (b[0] - n) / c, b[1] -= d * (b[1] - l) / c, b[2] -= d * (b[2] - k) / c), f > h && (b = o[f--], b[0] -= d * (b[0] - n) / c, b[1] -= d * (b[1] - l) / c, b[2] -= d * (b[2] - k) / c);\n        }\n      }function C(p, s, q) {\n        var h = 2147483647,\n            k = h,\n            d = -1,\n            m = d,\n            c,\n            j,\n            e,\n            n,\n            l;for (c = 0; c < a; c++) {\n          j = o[c], e = Math.abs(j[0] - p) + Math.abs(j[1] - s) + Math.abs(j[2] - q), e < h && (h = e, d = c), n = e - (t[c] >> i - b), n < k && (k = n, m = c), l = y[c] >> g, y[c] -= l, t[c] += l << f;\n        }return y[d] += x, t[d] -= r, m;\n      }function D() {\n        var d,\n            b,\n            e,\n            c,\n            h,\n            g,\n            f = 0,\n            i = 0;for (d = 0; d < a; d++) {\n          for (e = o[d], h = d, g = e[1], b = d + 1; b < a; b++) {\n            c = o[b], c[1] < g && (h = b, g = c[1]);\n          }if (c = o[h], d != h && (b = c[0], c[0] = e[0], e[0] = b, b = c[1], c[1] = e[1], e[1] = b, b = c[2], c[2] = e[2], e[2] = b, b = c[3], c[3] = e[3], e[3] = b), g != f) {\n            for (q[f] = i + d >> 1, b = f + 1; b < g; b++) {\n              q[b] = d;\n            }f = g, i = d;\n          }\n        }for (q[f] = i + n >> 1, b = f + 1; b < 256; b++) {\n          q[b] = n;\n        }\n      }function E(j, i, k) {\n        var b,\n            d,\n            c,\n            e = 1e3,\n            h = -1,\n            f = q[i],\n            g = f - 1;while (f < a || g >= 0) {\n          f < a && (d = o[f], c = d[1] - i, c >= e ? f = a : (f++, c < 0 && (c = -c), b = d[0] - j, b < 0 && (b = -b), c += b, c < e && (b = d[2] - k, b < 0 && (b = -b), c += b, c < e && (e = c, h = d[3])))), g >= 0 && (d = o[g], c = i - d[1], c >= e ? g = -1 : (g--, c < 0 && (c = -c), b = d[0] - j, b < 0 && (b = -b), c += b, c < e && (b = d[2] - k, b < 0 && (b = -b), c += b, c < e && (e = c, h = d[3]))));\n        }return h;\n      }function F() {\n        var c,\n            f = A.length,\n            D = 30 + (B - 1) / 3,\n            y = f / (3 * B),\n            q = ~~(y / w),\n            n = d,\n            o = u,\n            a = o >> h;for (a <= 1 && (a = 0), c = 0; c < a; c++) {\n          z[c] = n * ((a * a - c * c) * m / (a * a));\n        }var i;f < s ? (B = 1, i = 3) : f % l !== 0 ? i = 3 * l : f % k !== 0 ? i = 3 * k : f % p !== 0 ? i = 3 * p : i = 3 * j;var r,\n            t,\n            x,\n            e,\n            g = 0;c = 0;while (c < y) {\n          if (r = (A[g] & 255) << b, t = (A[g + 1] & 255) << b, x = (A[g + 2] & 255) << b, e = C(r, t, x), K(n, e, r, t, x), a !== 0 && L(a, e, r, t, x), g += i, g >= f && (g -= f), c++, q === 0 && (q = 1), c % q === 0) for (n -= n / D, o -= o / v, a = o >> h, a <= 1 && (a = 0), e = 0; e < a; e++) {\n            z[e] = n * ((a * a - e * e) * m / (a * a));\n          }\n        }\n      }function G() {\n        I(), F(), J(), D();\n      }function H() {\n        var b = [],\n            g = [];for (var c = 0; c < a; c++) {\n          g[o[c][3]] = c;\n        }var d = 0;for (var e = 0; e < a; e++) {\n          var f = g[e];b[d++] = o[f][0], b[d++] = o[f][1], b[d++] = o[f][2];\n        }return b;\n      }var o, q, t, y, z;this.buildColormap = G, this.getColormap = H, this.lookupRGB = E;\n    }var w = 100,\n        a = 256,\n        n = a - 1,\n        b = 4,\n        i = 16,\n        e = 1 << i,\n        f = 10,\n        B = 1 << f,\n        g = 10,\n        x = e >> g,\n        r = e << f - g,\n        z = a >> 3,\n        h = 6,\n        t = 1 << h,\n        u = z * t,\n        v = 30,\n        o = 10,\n        d = 1 << o,\n        q = 8,\n        m = 1 << q,\n        y = o + q,\n        c = 1 << y,\n        l = 499,\n        k = 491,\n        p = 487,\n        j = 503,\n        s = 3 * j;A.exports = C;\n  }), a('/gif.worker.coffee');\n}).call(this, this);\n//# sourceMappingURL=gif.worker.js.map\n// gif.worker.js 0.1.6 - https://github.com/jnordberg/gif.js"

/***/ }),
/* 88 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(81);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(12)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./colorpicker.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./colorpicker.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(82);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(12)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./style.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 91 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);
});