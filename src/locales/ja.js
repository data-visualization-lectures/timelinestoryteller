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
  "A <span class='rb_hint_rep_highlight'>LINEAR</span> representation is read left-to-right and is the most familiar timeline representation.":
    "<span class='rb_hint_rep_highlight'>線形</span>は左から右へ読む、最もなじみのある年表の形です。",
  "A <span class='rb_hint_rep_highlight'>RADIAL</span> representation is useful for showing cyclical patterns. It has the added benefit of a square aspect ratio.":
    "<span class='rb_hint_rep_highlight'>放射状</span>は円形に並べます。周期的なパターンを見せるのに向いています。全体が正方形に収まる利点もあります。",
  "A <span class='rb_hint_rep_highlight'>SPIRAL</span> is a compact and playful way to show a sequence of events. It has a square aspect ratio and is only compatible with a <span class='rb_hint_scale_highlight'>Sequential</span> scale.":
    "<span class='rb_hint_rep_highlight'>らせん</span>は、出来事の並びをコンパクトに、遊び心をもって見せます。全体が正方形に収まります。<span class='rb_hint_scale_highlight'>順序</span>スケールでだけ使えます。",
  "A <span class='rb_hint_rep_highlight'>CURVE</span> is a playful way to show a sequence of events. It is only compatible with a <span class='rb_hint_scale_highlight'>Sequential</span> scale and a <span class='rb_hint_layout_highlight'>Unified</span> layout.Drag to draw a curve on the canvas; double click the canvas to reset the curve.":
    "<span class='rb_hint_rep_highlight'>曲線</span>は、自分で描いた線に沿って出来事を並べます。<span class='rb_hint_scale_highlight'>順序</span>スケールと<span class='rb_hint_layout_highlight'>統合</span>レイアウトでだけ使えます。キャンバス上をドラッグして曲線を描き、ダブルクリックで描き直します。",
  "A month-week-day <span class='rb_hint_rep_highlight'>CALENDAR</span> is a familiar representation that is compatible with a <span class='rb_hint_scale_highlight'>Chronological</span> scale and a <span class='rb_hint_layout_highlight'>Segmented</span> layout. This representation does not currently support timelines spanning decades or longer.":
    "月・週・日の<span class='rb_hint_rep_highlight'>カレンダー</span>です。<span class='rb_hint_scale_highlight'>年代順</span>スケールと<span class='rb_hint_layout_highlight'>区切り</span>レイアウトで使えます。数十年以上にわたる年表には対応していません。",
  "A 10x10 <span class='rb_hint_rep_highlight'>GRID</span> representation is compatible with a <span class='rb_hint_scale_highlight'>Chronological</span> scale and a <span class='rb_hint_layout_highlight'>Segmented</span> layout. This representation is ideal for timelines spanning decades or centuries.":
    "10×10 のマス目の<span class='rb_hint_rep_highlight'>グリッド</span>です。<span class='rb_hint_scale_highlight'>年代順</span>スケールと<span class='rb_hint_layout_highlight'>区切り</span>レイアウトで使えます。数十年から数世紀にわたる年表に向いています。",
  "A <span class='rb_hint_scale_highlight'>CHRONOLOGICAL</span> scale is useful for showing absolute dates and times, like 2017, or 1999-12-31, or 6:37 PM.":
    "<span class='rb_hint_scale_highlight'>年代順</span>は、2017年、1999-12-31、午後6時37分のような、実際の日付や時刻を示すのに向いています。",
  "A <span class='rb_hint_scale_highlight'>RELATIVE</span> scale is useful when comparing <span class='rb_hint_layout_highlight'>Faceted</span> timelines with a common baseline at time 'zero'.For example, consider a timeline of person 'A' who lived between 1940 to 2010 and person 'B' who lived between 1720 and 1790. A <span class='rb_hint_scale_highlight'>Relative</span> scale in this case would span from 0 to 70 years.":
    "<span class='rb_hint_scale_highlight'>相対</span>は、<span class='rb_hint_layout_highlight'>ファセット</span>レイアウトの複数の年表を、共通の起点「ゼロ」にそろえて比べるのに向いています。たとえば1940年から2010年まで生きた人物と、1720年から1790年まで生きた人物を並べると、どちらも0年から70年の目盛りで比べられます。",
  "A base-10 <span class='rb_hint_scale_highlight'>LOGARITHMIC</span> scale is useful for long-spanning timelines and a skewed distributions of events.  This scale is compatible with a <span class='rb_hint_rep_highlight'>Linear</span> representation.":
    "10を底とする<span class='rb_hint_scale_highlight'>対数</span>の目盛りです。長い期間にわたり、出来事の分布が偏っている年表に向いています。<span class='rb_hint_rep_highlight'>線形</span>の表現で使えます。",
  "A <span class='rb_hint_scale_highlight'>SEQUENTIAL</span> scale is useful for showing simply the order and number of events.":
    "<span class='rb_hint_scale_highlight'>順序</span>は、出来事の順序と数だけを示します。",
  "A <span class='rb_hint_scale_highlight'>COLLAPSED</span> scale is a hybrid between <span class='rb_hint_scale_highlight'>Sequential</span> and <span class='rb_hint_scale_highlight'>Chronological</span>, and is useful for showing uneven distributions of events. It is compatible with a <span class='rb_hint_rep_highlight'>Linear</span> representation and <span class='rb_hint_layout_highlight'>Unified</span> layout. The duration between events is encoded as the length of bars.":
    "<span class='rb_hint_scale_highlight'>圧縮</span>は、<span class='rb_hint_scale_highlight'>順序</span>と<span class='rb_hint_scale_highlight'>年代順</span>の中間です。出来事の分布が不均等な年表に向いています。出来事と出来事の間隔を棒の長さで表します。<span class='rb_hint_rep_highlight'>線形</span>の表現と<span class='rb_hint_layout_highlight'>統合</span>レイアウトで使えます。",
  "A <span class='rb_hint_layout_highlight'>UNIFIED</span> layout is a single uninterrupted timeline and is useful when your data contains no facets.":
    "<span class='rb_hint_layout_highlight'>統合</span>は、途切れのない1本の年表です。データにファセットがないときに向いています。",
  "A <span class='rb_hint_layout_highlight'>FACETED</span> layout is useful when you have multiple timelines to compare.":
    "<span class='rb_hint_layout_highlight'>ファセット</span>は、ファセットごとに年表を分けて並べます。複数の年表を比べたいときに向いています。",
  "A <span class='rb_hint_layout_highlight'>SEGMENTED</span> layout splits a timeline into meaningful segments like centuries or days, depending on the extent of your timeline.It is compatible with a <span class='rb_hint_scale_highlight'>Chronological</span> scale and is useful for showing patterns or differences across segments, such as periodicity.":
    "<span class='rb_hint_layout_highlight'>区切り</span>は、年表を世紀や日のような意味のある単位に分けます。単位は年表の期間に応じて決まります。<span class='rb_hint_scale_highlight'>年代順</span>スケールで使え、周期性のような、区切りごとのパターンや違いを見せるのに向いています。",

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
  "Smaller images should be preferred as larger images increase the final size of the story, this will automatically resize your images to the given size":
    "大きな画像はストーリーのファイルを大きくします。チェックすると、指定した大きさに自動で縮小します。",
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
