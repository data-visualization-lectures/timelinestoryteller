# Timeline Storyteller

Timeline Storyteller is an expressive visual storytelling environment for presenting timelines in the browser.

Use it to present different aspects of timeline data using a palette of timeline representations, scales, and layouts, as well as controls for filtering, highlighting, and annotation.

![Timeline Design dimensions](docs/img/dims.png "Timeline Design dimensions")

## About this fork

This repository is a fork of [microsoft/timelinestoryteller](https://github.com/microsoft/timelinestoryteller) (MIT License, © Microsoft Corporation), originally developed at Microsoft Research by Matthew Brehmer, Bongshin Lee, Nathalie Henry Riche, Darren Edge, Christopher White, Kate Lytvynets, and David Tittsworth. It is not affiliated with or endorsed by Microsoft.

Changes from the original:

- The app runs as static files and does not send data to a server. The research logging over socket.io was removed.
- The email / consent step before exporting was removed.
- Microsoft branding, policy links, and contact links were removed from the app. The original landing page was replaced by a usage guide in Japanese and English (`docs/help.html`).
- d3 and moment are served from `docs/js/vendor` instead of a CDN.
- d3 was upgraded from v3 to v7. Tick spacing on linear axes, the order of new elements, and the hyphen for negative numbers were kept as they were in v3 (see `utils.ticks`, `utils.removeOnEnd`, and `globals.formatNumber`).
- The guided tour (intro.js, AGPL-3.0 / commercial licence) was removed. Its explanations were moved into the usage guide.
- Loading from Google Spreadsheets was removed, because the Google API it relied on no longer exists.
- The bundled demo datasets and demo story became sample files in `docs/data/`, chosen from the shared tool header instead of the import panel.

## dataviz.jp integration

| Item | Value |
|---|---|
| `appName` / `chartType` | `timeline-storyteller` |
| Public host | `https://timeline-storyteller.dataviz.jp/` (the app is served from the root of the host) |
| Scope | `viz` |
| Shared scripts | `dataviz-locale.v1.js`, `supabase.v1.js`, `dataviz-auth-client.v1.js`, `dataviz-tool-header.v1.js` from `id.data-viz-lectures.com`, loaded in `docs/index.html` |
| Integration code | `docs/js/dataviz-integration.js` (plain script, not part of the webpack bundle) |
| Languages | Japanese and English. The language follows the shared resolver (`?lang=ja` / `?lang=en`, an `/en` path, the `locale` cookie, then the browser language). UI text lives in `src/i18n.js` and `src/locales/ja.js`; English is the source language. |
| Sample data | Chosen from the tool header ("Sample Data"), which lists the entries of `https://app.dataviz.jp/catalog.json` whose `compatibleTools` include `timeline-storyteller`. The files are in `docs/data/`. The entries to register are in `dataviz/catalog-entries.json`. |
| Saved projects | Supported through the tool header ("Load Project" / "Save Project"), project backend `projects` |
| Share pages | Not supported: no share table and no publish function |

Start-up order: `?projectId=` restores a saved project and nothing else runs; otherwise `?data_url=` loads a file from this site or a dataviz.jp host; otherwise the first catalog sample for this tool is loaded; without any, the app's own import panel stays open.

A saved project has the shape `{ version: 1, chartType: "timeline-storyteller", data, settings }`. `data` is the list of events. `settings.story` is the app's story state (scenes, annotations, captions, images, colours) without the events and the usage log. `settings.view` is the representation, scale and layout, used when no scene was recorded.

Visitors who are not signed in are redirected to the sign-in page after a few seconds. Add `?auth_debug` to the URL to stay on the page, both locally and on a preview host.

To learn more about the research that informed the original project, see [timelinesrevisited.github.io](https://timelinesrevisited.github.io/).

## Setup / Testing

1. Ensure that [nodejs](https://nodejs.org/) and [npm](https://www.npmjs.com/) are installed. The build was last checked with Node.js 22.

2. Install node modules: `npm ci`

3. Start the development server: `npm start`, then open [localhost:8000/?auth_debug](http://localhost:8000/?auth_debug). In development the server builds the app from `src/` on the fly.

4. Build the files that are served in production: `npm run package`. This writes `docs/js/timelinestoryteller.js` and copies d3 and moment into `docs/js/vendor`. Commit the result.

5. The site is published with GitHub Pages from the `docs/` directory of the default branch. `docs/.nojekyll` turns off Jekyll processing. The app is `docs/index.html` and the usage guide is `docs/help.html`. The usage guide does not load the shared sign-in.

`npm test` runs lint, the unit tests, and the build. The unit tests are configured for PhantomJS, which no longer runs on current systems, so that step needs a different karma browser.

The application source code can be found in the [src/](src) directory.

## Preparing your data

Timeline Storyteller supports datasets of events in CSV or JSON format.

Each event is specified by the following attributes:

- __Required__: `start_date`, date: YYYY, YYYY-MM-DD, or YYYY-MM-DD HH:MMZ (ISO 8601) formats are supported (Z necessary for specifying UTC, otherwise HH:MM will be time-zone dependent). BC dates are permitted, e.g., -27, -13800000000
- __Optional__: `end_date`, date: using same format as `start_date`
- __Optional__: `category`, a string corresponding to the category of the event (which Timeline Storyteller encodes as colour)
- __Optional__: `facet`,a string corresponding to another category of the event (which Timeline Storyteller uses to create a faceted timeline layout; `category` and `facet` can be identical if desired)
- __Optional__: `content_text`, a string description of the event (which Timeline Storyteller exposes as event annotations)

### Example event in JSON:

`{
  "start_date":"1775",
  "end_date":"1783",
  "content_text":"American Revolutionary War: an armed struggle for secession from the British Empire by the Thirteen Colonies that would subsequently become the United States.",
  "facet":"North America",
  "category":"North America"
},`

### Example event in CSV:

header row:

`start_date,end_date,content_text,facet,category`

example event row:

`1775,1783,American Revolutionary War: an armed struggle for secession from the British Empire by the Thirteen Colonies that would subsequently become the United States.,North America,North America`

## Usage

A usage guide in Japanese and English is included at `docs/help.html`.

1. Load timeline data (demo dataset, JSON, CSV) or saved timeline story (a JSON Blob with extension .cdc; see step 6)

2. Select a combination of representation, scale, and layout from the menu at the top of the screen; only some combinations are valid; see [our guidance on selecting appropriate combinations for your story](http://timelinesrevisited.github.io/supplemental/gallery/). Mouseover these options to view a tooltip that describes how they might be useful.

3. Edit the canvas

	* Click on events to annotate with their `content_text` label; resize and reposition labels; SHIFT + click to highlight events without showing label.

	* Annotate with captions and images; resize and reposition captions and images.

 	* Filter events by category, facet, or segment. Filter by highlighting emphasizing matching events (de-emphasizing non-matching events).

	* You can also filter by hiding non-matching events.

4. Record current canvas as a scene, which retains labels, captions, and images. Enter playback mode, navigate to previous / next recorded scene.

5. Export current canvas as a PNG, SVG.

6. Export the scenes as an animated GIF or as a JSON Blob (.cdc extension).

## License

Timeline Storyteller

Copyright (c) Microsoft Corporation

All rights reserved.

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the Software), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Acknowledgements

### Citing the original work

If you use Timeline Storyteller to make a timeline for a research paper, please cite the original authors. You can cite the tool itself:

`@misc{TimelineStoryteller,
author = {Matthew Brehmer and Bongshin Lee and Nathalie Henry Riche and Darren Edge and Christopher White and Kate Lytvynets and David Tittsworth},
title = {Microsoft Timeline Storyteller},
year = {2017},
note = {\url{https://timelinestoryteller.com}}
}`

Or you can cite their journal paper about the timeline design space:

`@article{Brehmer2016,
author = {Matthew Brehmer and Bongshin Lee and Benjamin Bach and Nathalie Henry Riche and Tamara Munzner},
title = {Timelines Revisited: A Design Space and Considerations for Expressive Storytelling},
journal = {IEEE Transactions on Visualization and Computer Graphics (TVCG)},
year = {2017},
volume = {23},
issue = {9},
pages = {2151--2164},
doi = {10.1109/TVCG.2016.2614803},
ISSN = {1077-2626}
}`

### Demo dataset provenance

- [Priestley's Chart of Biography](https://upload.wikimedia.org/wikipedia/commons/9/98/PriestleyChart.gif)
- [Great Philosophers since the 8th Century BC](http://bl.ocks.org/rengel-de/5603464)
- [History's Largest Empires](http://nowherenearithaca.github.io/empires/index.html)
- [East Asian Dynasties](http://bl.ocks.org/bunkat/2338034)
- [Epidemics since the 14th Century](https://en.wikipedia.org/wiki/List_of_epidemics)
- [Prime Ministers of Canada](http://www.downloadexcelfiles.com/ca_en/download-excel-file-list-prime-ministers-canada)
- [Presidents of France](http://www.downloadexcelfiles.com/fr_en/download-excel-file-list-presidents-france)
- [Chancellors of Germany](https://en.wikipedia.org/wiki/List_of_Chancellors_of_Germany)
- [Presidents of Italy](http://www.downloadexcelfiles.com/it_en/download-excel-file-list-presidents-italy)
- [Prime Ministers of Japan](http://www.downloadexcelfiles.com/jp_en/download-excel-file-list-prime-ministers-japan)
- [Prime Ministers of the UK](http://www.downloadexcelfiles.com/gb_en/download-excel-file-list-prime-ministers-uk)
- [Presidents of the USA](https://raw.githubusercontent.com/hitch17/sample-data/master/presidents.json)
- [C4-5 Hurricanes: 1960-2010](http://www.aoml.noaa.gov/hrd/hurdat/easyread-2011.html)
- [The Daily Routines of Famous Creative People](https://podio.com/site/creative-routines)
-['Visualizing painters' lives" by Accurat](http://www.brainpickings.org/2013/06/07/painters-lives-accurat-giorgia-lupi/)
- ['From first published to masterpieces' by Accurat](http://www.brainpickings.org/2013/11/29/accurat-modern-library/)
- [Kurzweil's 'Countdown to Singularity'](http://www.singularity.com/images/charts/CountdowntoSingularityLog.jpg)
- ['A Perspective on Time' by mayra.artes for Wait But Why](http://visual.ly/perspective-time)
- ['Life of a Typical American' by Tim Urban for Wait But Why](http://waitbutwhy.com/2014/05/life-weeks.html)

### Noun Project icons used in the user interface

All Icons [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/us/), by name and author:

- [check-mark](https://thenounproject.com/term/check-mark/608852) (Arthur Shlain)
- [calendar](https://thenounproject.com/term/calendar/38869) (Kiril Tomilov)
- [timeline](https://thenounproject.com/term/timeline/152347) (Alecander Bickov)
- [gif-file](https://thenounproject.com/term/gif-file/446903) (Pranav Grover)
- [png-file](https://thenounproject.com/term/png-file/446907) (Pranav Grover)
- [svg-file](https://thenounproject.com/term/svg-file/446904) (Pranav Grover)
- [json-file](https://thenounproject.com/term/json-file/446959) (Pranav Grover)
- [csv-file](https://thenounproject.com/term/csv-file/446962) (Pranav Grover)
- [grid](https://thenounproject.com/term/grid/539919) (Doejo)
- [folder](https://thenounproject.com/term/folder/43216) (iconoci)
- [filter](https://thenounproject.com/term/filter/132317) (Creative Shell)
- [image](https://thenounproject.com/term/image/332296) (Creative Shell)
- [quotation-mark](https://thenounproject.com/term/quotation-mark/378366) (Veronika Krpciarova)
- [pin](https://thenounproject.com/term/pin/172903) (Alexandr Cherkinsky)
- [eraser](https://thenounproject.com/term/eraser/3715) (Terrence Kevin Oleary)
- [invisible](https://thenounproject.com/term/invisible/506290) (Kid A)
- [book](https://thenounproject.com/term/book/861149) (Setyo Ari Wibowo)
