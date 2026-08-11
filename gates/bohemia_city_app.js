/* ============================================================================
   WHERE THE CITY APP IS — the one resolver, 8/4/26 (WORLD lane).

   THE BUG THIS EXISTS TO KILL. Twenty-one gates and tools in this repo went
   looking for the city renderer by writing, by hand, the same two facts:

       WHERE it lives   -> slices/BOHEMIA_ALPHA_0_9.html
       WHAT SHAPE it is -> const CITY_B64='<base64 of an entire HTML page>'

   Neither fact is theirs to know. On 8/2 the payload-wall pass legitimately
   moved the city out of the alpha into slices/BOHEMIA_CITY_WORLD.html and
   stopped base64-ing it on the way (the alpha went 38.7 MB -> 2.92 MB and the
   first load went 29x faster, so the move was RIGHT). Every one of those
   hand-written facts went stale in the same instant, and gates across four
   lanes started reporting "the alpha carries a readable CITY blob — FAIL"
   about a city that was fine.

   That is the same bug as the hand-passed door plane, the hand-passed window
   fraction, the hand-passed prism cap and the hand-passed plot rectangle:
   A VALUE PASSED BY HAND WHERE A VALUE COULD BE DERIVED. A gate that asserts
   a LOCATION is not testing the thing it was written to protect — it fails when
   somebody legitimately moves a file, and its red says nothing.

   WORSE THAN A FALSE RED: a false GREEN. tools/bohemia_city_module_resync.py
   did not fail when it could not find the blob, it silently did NOTHING, so the
   engine and the app would have drifted apart without a word.

   USE IT LIKE THIS, and never write a path or a regex for the city again:

       const CITY = require('./bohemia_city_app.js');
       const app = CITY.read();          // {src, file, inline} — or null
       if (!app) fail('the city app is not findable');
       app.src.indexOf('function drawHero(') >= 0

   ADDING A NEW HOME for the city is one line in FILES below, in preference
   order. Adding a new SHAPE is one clause in read(). Nothing else changes.
   ========================================================================= */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);

/* preference order: the standalone page first (where it lives today), the alpha
   second (where it lived until 8/2, and where a rollback would put it back). */
const FILES = [
  'slices/BOHEMIA_CITY_WORLD.html',
  'slices/BOHEMIA_ALPHA_0_9.html',
];

/* the marker that says "this text IS the city renderer", whatever file it is in
   and however it got there. A body, not a location. */
const BODY = 'function renderCity(';

/**
 * Find the city renderer and hand back its SOURCE.
 * @returns {{src:string, file:string, inline:boolean}|null}
 *   src    the decoded renderer source, ready to search
 *   file   the file it was found in, for the failure message
 *   inline true if the source sits in the page as-is, false if it was base64
 */
/* THE ART BANK LIVES NEXT DOOR NOW (8/6). The walked world is rewritten by string
   surgery several times a day and was carrying 27 MB of base64 art it never edits,
   which made it the repository's top growth driver at 20.5 MB/day against a 5 GB
   GitHub ceiling ~130 days out. The page is 1 MB now; the art is in
   BOHEMIA_CITY_TILES.js and changes rarely.
   EVERY CONSUMER STILL SEES THE WHOLE LOGICAL DOCUMENT. Twenty-odd gates ask this
   resolver for the city source and some of them grep it for tile data; splitting
   the FILES without splitting the ANSWER is exactly the trap that cost the fleet a
   day on 8/2 and again on 8/4. So read() glues it back on. The split is a storage
   decision, not a visible one. */
function tileBank() {
  const p = path.join(ROOT, 'slices/BOHEMIA_CITY_TILES.js');
  try { return fs.existsSync(p) ? '\n' + fs.readFileSync(p, 'utf8') : ''; }
  catch (e) { return ''; }
}

function read() {
  for (const rel of FILES) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) continue;
    const txt = fs.readFileSync(abs, 'utf8');

    /* SHAPE 1: base64'd into a string literal (the pre-8/2 arrangement) */
    const m = /const CITY_B64\s*=\s*'([^']+)'/.exec(txt);
    if (m) {
      let dec = '';
      try { dec = Buffer.from(m[1], 'base64').toString('utf8'); } catch (e) { dec = ''; }
      if (dec.indexOf(BODY) >= 0) return { src: dec, file: rel, inline: false };
    }

    /* SHAPE 2: the page IS the renderer (the arrangement since 8/2) */
    if (txt.indexOf(BODY) >= 0) return { src: txt + tileBank(), file: rel, inline: true };
  }
  return null;
}

/** Every candidate home, for a failure message that names where it looked. */
function searched() { return FILES.slice(); }

/**
 * IS THIS PLAYWRIGHT FRAME THE CITY? Same bug, second surface: a dozen browser
 * gates found the world frame with /srcdoc/.test(fr.url()), which is a fact about
 * HOW it was loaded, not about WHAT it is. Until 8/2 the city was srcdoc'd in from
 * a base64 blob; it is a sibling page loaded with fr.src now, and every one of
 * those gates started reporting "the world frame booted — FAIL" about a frame that
 * boots fine.
 *
 *   f = page.frames().find(fr => CITY.isFrame(fr, page));
 *
 * @param {object} fr    a Playwright Frame
 * @param {object} page  the Page it belongs to (its main frame is never the city)
 */
const NAMED = /BOHEMIA_CITY_WORLD|BOHEMIA_CITY_CURRENT/;

function isFrame(fr, page) {
  if (!fr || (page && fr === page.mainFrame())) return false;
  const u = String(fr.url() || '');
  /* CITY_CURRENT included 8/4: thirteen gates called this and then IMMEDIATELY
     overwrote the result on the next line with their own regex, which also
     matched CITY_CURRENT. Removing that shadow without widening here would have
     quietly NARROWED what the fleet finds. Superset first, then the shadow goes. */
  if (NAMED.test(u)) return true;

  /* SRCDOC IS A LAST RESORT NOW, AND THAT IS THE WHOLE FIX (8/11/26).
     FIVE gates were crashing with `ReferenceError: om is not defined` -- three of
     them already red on origin/main -- and every diagnosis called it a timing
     race against a slow boot. It was not timing. The alpha carries MORE THAN ONE
     srcdoc frame now, and callers do

         page.frames().find(fr => CITY.isFrame(fr, page))

     which takes the FIRST match in frame order. That first match was somebody
     else's EMPTY about:srcdoc frame, so the gates ran their whole measurement
     inside a blank document and reported the city broken. Measured 8/11: two
     frames matched, [about:srcdoc {fit:undefined, om:undefined, cv.width:0}] and
     [BOHEMIA_CITY_WORLD {fit:function, om:object, cv.width:378}], and find()
     returned the first one every single time.

     The /srcdoc/ test was right when the city WAS srcdoc'd from a base64 blob.
     It is a sibling src page now, so a bare srcdoc match is no longer evidence of
     anything. It stays only as a fallback for a surface that still srcdocs the
     app -- and ONLY when this page has no named city frame at all, so it can
     never again outrank the real thing. Same disease as the comment above: a
     predicate that keeps matching the shape the code used to have. */
  if (!/srcdoc/.test(u)) return false;
  if (page && typeof page.frames === 'function') {
    try {
      if (page.frames().some(f => NAMED.test(String(f.url() || '')))) return false;
    } catch (e) { /* fall through: a bare srcdoc match is better than none */ }
  }
  return true;
}

module.exports = { read, searched, isFrame, FILES, BODY };
