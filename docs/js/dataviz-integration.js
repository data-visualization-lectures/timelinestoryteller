// ============================================================
// Timeline Storyteller - dataviz.jp integration
//
// Connects the app to the shared tool header:
//   - sample data from the shared catalog (header "Sample data" button)
//   - project save / load (header buttons on the right)
//   - start-up from ?projectId= and ?data_url=
//
// Load priority at start-up, as for the other tools:
//   1. ?projectId=   restore a saved project; nothing below runs
//   2. ?data_url=    a file chosen in the data library (background)
//   3. catalog.json  the first sample that lists this tool (background)
//   4. nothing       the app's own import panel stays open
// ============================================================

(function () {
  "use strict";

  var APP_NAME = "timeline-storyteller";
  var PAYLOAD_VERSION = 1;

  var teller = window.teller;
  if (!teller) {
    return;
  }

  var currentProject = { id: null, name: null };
  var projectLoadStarted = false;
  var hasLoadedProject = false;
  var internalLoad = false;
  var header = null;

  // ----------------------------------------------------------
  // language
  // ----------------------------------------------------------
  function locale() {
    var resolved = (window.DatavizLocale && typeof window.DatavizLocale.resolve === "function")
      ? window.DatavizLocale.resolve()
      : (typeof window.dvzResolveLocale === "function" ? window.dvzResolveLocale() : null);
    return resolved === "en" ? "en" : "ja";
  }

  function text(ja, en) {
    return locale() === "en" ? en : ja;
  }

  function toast(message, type, duration) {
    if (header && typeof header.showMessage === "function") {
      header.showMessage(message, type || "info", duration);
    }
  }

  // ----------------------------------------------------------
  // start-up parameters
  // ----------------------------------------------------------
  function param(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function hasProjectRouteParam() {
    return !!param("projectId");
  }

  function shouldSkipAutoSampleLoad() {
    return hasProjectRouteParam() || hasLoadedProject || projectLoadStarted;
  }

  // ----------------------------------------------------------
  // loading into the app
  // ----------------------------------------------------------
  function hasScenes(state) {
    return !!(state && state.scenes && state.scenes.length);
  }

  // Applies a view the way a click on the option buttons does.
  function applyView(view) {
    if (!view) {
      return;
    }
    var steps = [
      ["representation", view.representation],
      ["layout", view.layout],
      ["scale", view.scale],
      ["representation", view.representation],
      ["layout", view.layout]
    ];
    steps.forEach(function (step) {
      var input = document.querySelector(".timeline_storyteller input[name=\"" + step[0] + "_rb\"][value=\"" + step[1] + "\"]");
      if (input && !input.disabled && !input.checked) {
        input.checked = true;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  }

  // Loads a state into the app and resolves when it is drawn.
  function loadState(state, options) {
    options = options || {};
    internalLoad = true;
    teller.importPanel.hide();
    return teller.load(state, !!options.playback, true).then(function () {
      internalLoad = false;
      if (!hasScenes(state) && options.view) {
        applyView(options.view);
      }
    }, function (err) {
      internalLoad = false;
      throw err;
    });
  }

  // Turns the text of a data file into a state the app can load.
  function parseDataFile(body, format) {
    var kind = String(format || "").toLowerCase();
    if (kind === "json") {
      var parsed = JSON.parse(body);
      return Array.isArray(parsed) ? { timeline_json_data: parsed } : parsed;
    }
    var rows = kind === "tsv" ? window.d3.tsvParse(body) : window.d3.csvParse(body);
    return { timeline_json_data: rows };
  }

  // ?data_url= is followed only to this site and the dataviz.jp family of hosts.
  function isTrustedDataUrl(url) {
    try {
      var parsed = new URL(url, window.location.href);
      if (parsed.origin === window.location.origin) {
        return true;
      }
      if (parsed.protocol !== "https:") {
        return false;
      }
      return /(^|\.)(dataviz\.jp|dataprep\.jp|data-viz-lectures\.com)$/.test(parsed.hostname);
    } catch (e) {
      return false;
    }
  }

  function formatFromUrl(url) {
    var extension = String(url || "").split(/[?#]/)[0].split(".").pop().toLowerCase();
    return extension === "json" ? "json" : (extension === "tsv" ? "tsv" : "csv");
  }

  // Fetches a sample or a data-library file and loads it.
  function loadDataUrl(url, format, options) {
    options = options || {};
    if (options.background && shouldSkipAutoSampleLoad()) {
      return Promise.resolve(false);
    }
    if (!options.background) {
      toast(text("サンプルデータを読み込み中です", "Loading sample data..."), "info", 5000);
    }
    return fetch(url).then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      return response.text();
    }).then(function (body) {
      if (options.background && shouldSkipAutoSampleLoad()) {
        return false;
      }
      var state = parseDataFile(body, format || formatFromUrl(url));
      if (!state || !Array.isArray(state.timeline_json_data) || !state.timeline_json_data.length) {
        throw new Error("no events in " + url);
      }
      currentProject = { id: null, name: null };
      // a sample that is a recorded story opens in playback, like the app's own story files
      return loadState(state, { playback: hasScenes(state) }).then(function () {
        return true;
      });
    }).catch(function (err) {
      console.error("[" + APP_NAME + "] data load failed:", err);
      if (!options.background) {
        toast(text("データを読み込めませんでした", "Could not load the data"), "error", 5000);
      }
      return false;
    });
  }

  // ----------------------------------------------------------
  // project payload
  //   { version, chartType, data, settings }: data is the list of events,
  //   settings.story is the app's own story state without the events,
  //   settings.view is the current view for a project without recorded scenes
  // ----------------------------------------------------------
  function buildProjectData() {
    var story = teller.saveState();
    var events = story && story.timeline_json_data;
    if (!Array.isArray(events) || !events.length) {
      return null;
    }
    var rest = {};
    Object.keys(story).forEach(function (key) {
      // the usage log is the app's interaction history; it is not part of the project
      if (key !== "timeline_json_data" && key !== "usage_log") {
        rest[key] = story[key];
      }
    });
    rest.usage_log = [];
    return {
      version: PAYLOAD_VERSION,
      chartType: APP_NAME,
      data: events,
      settings: {
        view: teller.getView(),
        story: rest
      }
    };
  }

  function restoreProjectData(payload) {
    if (!payload || typeof payload !== "object") {
      return Promise.reject(new Error("empty project"));
    }
    var state;
    var view = null;
    if (Array.isArray(payload.data)) {
      var settings = payload.settings || {};
      state = Object.assign({}, settings.story || {}, { timeline_json_data: payload.data });
      view = settings.view || null;
    } else if (Array.isArray(payload.timeline_json_data)) {
      // a story file saved by the app itself
      state = payload;
    } else {
      return Promise.reject(new Error("unknown project format"));
    }
    hasLoadedProject = true;
    return loadState(state, { view: view });
  }

  function thumbnail() {
    var story = teller.saveState();
    var scenes = (story && story.scenes) || [];
    var latest = scenes.length ? scenes[scenes.length - 1].s_src : null;
    if (latest) {
      return Promise.resolve(latest);
    }
    return teller.getImageDataUri().catch(function () {
      return null;
    });
  }

  function buildSavePayload() {
    var data = buildProjectData();
    if (!data) {
      return Promise.resolve(null);
    }
    return thumbnail().then(function (thumbnailDataUri) {
      return {
        name: currentProject.name || "",
        data: data,
        thumbnailDataUri: thumbnailDataUri || null,
        existingProjectId: currentProject.id || null
      };
    });
  }

  // ----------------------------------------------------------
  // header
  // ----------------------------------------------------------
  function waitForHeader() {
    var element = document.querySelector("dataviz-tool-header");
    if (!element) {
      return Promise.resolve(null);
    }
    if (typeof element.setConfig === "function") {
      return Promise.resolve(element);
    }
    if (!window.customElements || typeof window.customElements.whenDefined !== "function") {
      return Promise.resolve(null);
    }
    return window.customElements.whenDefined("dataviz-tool-header").then(function () {
      return document.querySelector("dataviz-tool-header");
    });
  }

  function setupHeader(element) {
    header = element;

    header.setConfig({
      logo: { type: "text", text: "Timeline Storyteller" },
      buttons: [
        {
          label: text("使い方", "How to use"),
          type: "link",
          href: "help.html?lang=" + locale(),
          target: "_blank"
        },
        {
          label: text("プロジェクトの読込", "Load Project"),
          action: function () {
            header.showLoadModal();
          },
          align: "right"
        },
        {
          label: text("プロジェクトの保存", "Save Project"),
          action: function () {
            toast(text("保存準備中です", "Preparing save..."), "info", 5000);
            buildSavePayload().then(function (payload) {
              if (!payload) {
                toast(text("データがありません", "No data to save"), "error");
                return;
              }
              header.showSaveModal(payload);
            });
          },
          align: "right"
        }
      ]
    });

    header.setProjectConfig({
      appName: APP_NAME,
      toolName: "Timeline Storyteller",
      toolNameEn: "Timeline Storyteller",
      onProjectLoad: function (projectData, meta) {
        var overwritable = !!(meta && meta.canOverwrite);
        currentProject = {
          id: overwritable ? (meta.projectId || null) : null,
          name: overwritable ? (meta.projectName || null) : null
        };
        restoreProjectData(projectData).catch(function (err) {
          console.error("[" + APP_NAME + "] project restore failed:", err);
          toast(text("プロジェクトを復元できませんでした", "Could not restore the project"), "error", 5000);
        });
      },
      onProjectSave: function (meta) {
        var project = (meta && meta.project) || meta || {};
        currentProject = { id: project.id || null, name: project.name || null };
      },
      onProjectDelete: function (deletedId) {
        if (deletedId && currentProject.id === deletedId) {
          currentProject = { id: null, name: null };
        }
      }
    });

    header.setSampleConfig({
      toolId: APP_NAME,
      onSampleSelect: function (detail) {
        if (detail && detail.url) {
          loadDataUrl(detail.url, detail.format, {});
        }
      }
    });
  }

  // A file opened through the app's own import panel is new, unsaved work.
  function watchAppLoads() {
    var load = teller.load;
    teller.load = function () {
      if (!internalLoad) {
        currentProject = { id: null, name: null };
        if (header && typeof header.setProjectContext === "function") {
          header.setProjectContext({ sourceType: "import", canOverwrite: false });
        }
      }
      return load.apply(teller, arguments);
    };
  }

  // ----------------------------------------------------------
  // start-up
  // ----------------------------------------------------------
  function loadProjectFromUrl() {
    var projectId = String(param("projectId") || "").trim();
    if (!projectId || !header || typeof header.loadProject !== "function") {
      return;
    }
    projectLoadStarted = true;
    header.loadProject(projectId).then(function (projectData) {
      // the header keeps the save context (name, overwrite permission) for a project it loaded
      var context = typeof header.getProjectContext === "function" ? header.getProjectContext() : null;
      var overwritable = !!(context && context.canOverwrite);
      currentProject = {
        id: overwritable ? projectId : null,
        name: overwritable ? (context.projectName || null) : null
      };
      return restoreProjectData(projectData);
    }).catch(function (err) {
      console.error("[" + APP_NAME + "] project load failed:", err);
    });
  }

  function autoLoadFromCatalog() {
    if (shouldSkipAutoSampleLoad()) {
      return;
    }
    var catalogUrl = (window.datavizAuthUrl || "https://app.dataviz.jp") + "/catalog.json";
    fetch(catalogUrl).then(function (response) {
      return response.ok ? response.json() : null;
    }).then(function (catalog) {
      if (!catalog || shouldSkipAutoSampleLoad()) {
        return;
      }
      var entries = (catalog.entries || []).filter(function (entry) {
        return (entry.compatibleTools || []).indexOf(APP_NAME) !== -1;
      });
      if (!entries.length) {
        return;
      }
      var first = entries[0];
      var url = locale() === "en" ? (first.fileUrlEn || first.fileUrl) : (first.fileUrl || first.fileUrlEn);
      if (url) {
        if (header && typeof header.setProjectContext === "function") {
          header.setProjectContext({
            sourceType: "sample",
            sourceName: first.name || "",
            sourceNameEn: first.nameEn || "",
            canOverwrite: false
          });
        }
        loadDataUrl(url, first.format, { background: true });
      }
    }).catch(function () {
      // without the catalog, the import panel stays open
    });
  }

  function start() {
    watchAppLoads();
    waitForHeader().then(function (element) {
      if (element && typeof element.setConfig === "function") {
        setupHeader(element);
      }

      if (hasProjectRouteParam()) {
        loadProjectFromUrl();
        return;
      }
      var dataUrl = param("data_url");
      if (dataUrl) {
        if (isTrustedDataUrl(dataUrl)) {
          loadDataUrl(dataUrl, null, { background: true });
        } else {
          console.warn("[" + APP_NAME + "] data_url ignored: not a dataviz.jp host");
        }
      } else {
        autoLoadFromCatalog();
      }
    });
  }

  start();
})();
