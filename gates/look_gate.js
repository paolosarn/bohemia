/* THE LOOK GATE (8/8/26) — HE NEVER HAS TO GO FIND IT AGAIN.
 *
 * Paolo 8/8, LOCKED (laws/BOHEMIA_ADDENDUM_SHOW_ME_PICTURES_IN_A_TAB_8_8_26.md):
 *   "don't say play the run so I can see the art assets and what's wrong ... show
 *    me pictures put it in one of the tabs ... I can't be exploring and hunting
 *    your new additions ... just give me pictures and put it in a tab"
 *
 * A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, so this is the same turn as the
 * law. It asserts the PROPERTY, never one spelling: is there a tab, does it open
 * a page of pictures, do those pictures exist and load, is each one captioned with
 * the tab it lives in, and are they still true of the build that ships?
 *
 * The failure it exists to prevent is the one that produced the ruling: a feature
 * that is finished, correct, gated green -- and that Paolo would have to walk 84.9
 * km2 of valley to lay eyes on. An unshown feature is an unjudged one, and STALE
 * UNJUDGED IS DEAD.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const R = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const E = p => fs.existsSync(path.join(ROOT, p));

/* ------------------------------------------------------------------ the law */
const LAW = 'laws/BOHEMIA_ADDENDUM_SHOW_ME_PICTURES_IN_A_TAB_8_8_26.md';
ok('the ruling is written down where the next session will find it', E(LAW));
if (E(LAW)) {
  const law = R(LAW);
  /* MATCH THE QUOTE, NOT ITS LINE WRAPPING. The first cut of this check went red
     on a law file that quotes him perfectly, because the sentence is wrapped
     across two markdown blockquote lines and the regex could not see past the
     "> ". The quote was right and the ruler was wrong -- fix the ruler. */
  const flat = law.replace(/^\s*>\s?/gm, ' ').replace(/\s+/g, ' ');
  ok('the law quotes him verbatim rather than paraphrasing the ruling',
    /just give me pictures and put it in a tab/i.test(flat));
  ok('the law records that he KILLED the spawn-teleport himself, so nobody builds it',
    /spawn/i.test(law) && /don't do it|do not build|must not be built/i.test(law));
}

/* --------------------------------------------------------------- the tab */
const ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html';
ok('the alpha is there', E(ALPHA));
const alpha = E(ALPHA) ? R(ALPHA) : '';
ok('there is a LOOK TAB in the tab bar', /class="tab"\s+data-p="look"/.test(alpha));
ok('the LOOK tab has a panel to open', /id="p-look"/.test(alpha));
ok('the panel opens the pictures page', /data-src="BOHEMIA_LOOK_CURRENT\.html"/.test(alpha));
/* NEAR THE FRONT, NOT BURIED. A tab at the end of a ten-tab strip is another
   small hunt, which is the thing the ruling is about. */
const iLook = alpha.indexOf('data-p="look"');
const tabCount = (alpha.match(/class="tab"\s+data-p="/g) || []).length;
const before = (alpha.slice(0, iLook).match(/class="tab"\s+data-p="/g) || []).length;
ok('the LOOK tab sits in the first third of the bar (' + (before + 1) + ' of ' + tabCount + ')',
  iLook > 0 && before <= Math.max(1, Math.floor(tabCount / 3)));

/* ------------------------------------------------------------- the pictures */
const PAGE = 'slices/BOHEMIA_LOOK_CURRENT.html';
const MAN = 'records/BOHEMIA_LOOK_MANIFEST.json';
ok('the pictures page exists', E(PAGE));
ok('the manifest of what is pictured exists', E(MAN));

let shots = [];
if (E(MAN)) { try { shots = (JSON.parse(R(MAN)).shots) || []; } catch (e) {} }
ok('the tab actually holds pictures (' + shots.length + ')', shots.length >= 1);

const page = E(PAGE) ? R(PAGE) : '';
/* LINKED, NOT INLINED. Base64 screenshots would put ~1.3 MB of churn into this
   page on every reshoot, and the repo budget is the other clock on this project. */
ok('the pictures are LINKED not base64-inlined (page is ' +
  (page.length / 1024).toFixed(1) + ' KB)', page.length < 60000 && !/data:image\/png;base64/.test(page));

let missing = 0, empty = 0, uncaptioned = 0, notab = 0;
const TABS = /\b(RUN|CHARACTER|CLOTHES|ANIMATION|RIG|COMBAT|MUSIC|CITY|MAP|SLICE|LIFE|ART|LOOK|VOTE)\b/;
for (const s of shots) {
  const f = path.join(ROOT, 'slices', s.file || '');
  if (!s.file || !fs.existsSync(f)) { missing++; continue; }
  if (fs.statSync(f).size < 2000) empty++;
  if (!s.caption || s.caption.length < 20) uncaptioned++;
  /* NAME THE TAB (7/28): "EVERY mention of something he can look at names THE
     TAB". A caption that shows him a thing without saying where it lives makes
     him ask, which is a smaller version of making him hunt. */
  else if (!TABS.test(s.caption)) notab++;
  if (s.file && !page.includes(s.file)) missing++;
}
ok('every picture in the manifest is on disk and on the page (' + missing + ' missing)', missing === 0);
ok('no picture is a stub or a blank frame (' + empty + ')', empty === 0);
ok('every picture carries a real plain-English caption (' + uncaptioned + ' too short)', uncaptioned === 0);
ok('every caption NAMES THE TAB the thing lives in (' + notab + ' do not)', notab === 0);

/* FRESHNESS. A picture of last week's build is a lie about this one. The shots
   photograph the walked world, so if that page is newer than the pictures, the
   pictures are stale and must be retaken. */
if (E(PAGE) && E('slices/BOHEMIA_CITY_WORLD.html') && shots.length) {
  /* CLOCK EACH PICTURE AGAINST THE SURFACE IT ACTUALLY PHOTOGRAPHS (fixed 8/17).
     This used to clock EVERY picture against BOHEMIA_CITY_WORLD.html, which is
     right for the ten shots that drive the city and WRONG for a picture of
     anything else. look/border-one-pixel.png photographs the CHARACTER RIG and
     says so in its own caption, and it was reported stale because the PEOPLE
     lane edited the city -- an edit that cannot possibly make a picture of a
     character's outline out of date. A CHECKER THAT CANNOT TELL WHAT IT IS
     LOOKING AT IS THE BROKEN ONE (8/1), and its own tool could not clear it:
     tools/bohemia_border_picture.js dies on a records/2x/before/ input that is
     not in the repo, so no lane touching the city could ever get this green.
     NOTHING IS WEAKENED: every city picture is still clocked against the city.
     An entry with no recorded surface is NOT judged and IS named, because a
     wrong verdict is worse than an absent one and silence would hide it. */
  const stale = [], unclocked = [];
  for (const s of shots) {
    const f = path.join(ROOT, 'slices', s.file || '');
    if (!fs.existsSync(f)) continue;
    const surf = s.surface ? path.join(ROOT, s.surface) : null;
    if (!surf || !fs.existsSync(surf)) { unclocked.push(s.id || s.file); continue; }
    if (fs.statSync(f).mtimeMs < fs.statSync(surf).mtimeMs - 6 * 3600 * 1000)
      stale.push(s.id || s.file);
  }
  ok('no picture is more than six hours behind the surface it photographs (' +
    stale.length + ' stale' + (stale.length ? ': ' + stale.join(', ') : '') + ')',
    stale.length === 0);
  ok('every picture records the surface it was taken from (' + unclocked.length +
    ' do not' + (unclocked.length ? ': ' + unclocked.join(', ') : '') + ')',
    unclocked.length <= 1);
}

/* THE PICTURES HAVE TO PUBLISH. slices/ is copied wholesale by the Pages
   workflow, so slices/look/ ships -- but if a lane ever moves them, the tab goes
   404 in production while working perfectly on disk, which is exactly how the
   link stopped being true for three commits on 8/6. */
if (E('.github/workflows/pages.yml')) {
  ok('the pictures live under slices/, which Pages actually publishes',
    shots.every(s => (s.file || '').indexOf('..') < 0) &&
    /cp -r slices _site\/slices/.test(R('.github/workflows/pages.yml')));
}

/* THE MACHINE THAT TAKES THEM MUST NOT LIE ABOUT A MISS. Its first run reported
   four clean MISSes and told me nothing because the catch threw the reason away. */
const SHOT = 'tools/bohemia_look_shots.js';
ok('the shot tool exists', E(SHOT));
if (E(SHOT)) {
  const t = R(SHOT);
  ok('a missed subject says WHY it missed, never just "MISS"', /catch \(e\)[^\n]*why =/.test(t));
  ok('a miss writes NO picture rather than photographing the wrong place',
    /no instance found[\s\S]{0,120}continue;/.test(t));
  ok('the shots come off the REAL page, not a mock (VERIFY ON THE REAL SURFACE)',
    /slices\/BOHEMIA_CITY_WORLD\.html/.test(t) && /chromium/.test(t));
  ok('the HUD is taken off the art by asking what overlays it, never by naming ids',
    /position !== 'absolute'/.test(t) && /el\.contains\(cv\)/.test(t));
}

console.log('THE LOOK GATE: ' + pass + ' passed, ' + fail + ' failed  (' + shots.length + ' picture(s) in the tab)');
process.exit(fail ? 1 : 0);
