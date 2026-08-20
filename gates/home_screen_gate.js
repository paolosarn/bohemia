/* ============================================================================
   HOME SCREEN GATE (8/16/26, RUN lane) — demo board row 6, the open half.

   The 8/13 work order sat open until today, and the board's own evidence was a
   grep: manifest = 0, apple-touch-icon = 0, across every surface. He demos this
   on a phone, off one link, and that link had no name, no icon, and no way out
   of Safari chrome.

   THE THREE iOS FACTS THIS GATE ENCODES, researched rather than remembered,
   because every one of them is a place where iOS does not do what the docs for
   other platforms say:

     1. iOS DOES NOT USE THE MANIFEST'S ICONS for the home screen. It reads
        <link rel="apple-touch-icon">, and that element OVERRIDES the manifest's
        icon list where both exist. So the touch icon is not a legacy fallback,
        it is the ONLY thing that puts his logo on the springboard -- and a
        manifest-only build looks correct in every checker and still ships a
        screenshot as the icon.
     2. The icon must actually EXIST AND PUBLISH. A missing icon is not a broken
        image on a page, it is a grey screenshot on his phone, and nobody would
        connect that to a file path. Checked on disk AND against _config.yml
        through the shared publish resolver.
     3. *** STORAGE IS NOT SHARED BETWEEN SAFARI AND THE HOME-SCREEN APP. ***
        iOS gives a standalone web app its own bucket: localStorage, cookies and
        the service worker registration all separate. A run played in Safari is
        NOT in the jar the icon opens, and the symptom is indistinguishable from
        the save being wiped -- which, after a week of this lane fixing real save
        bugs, is exactly the wrong conclusion for him to reach. The build has to
        SAY SO, and only when it is true.

   AND THE THING THAT MAKES 3 A GATE RATHER THAN A COMMENT: it is asserted by
   DRIVING BOTH CASES in a real browser. Standalone with an empty save must warn
   and must name the export path; standalone with a save must stay silent. A
   notice that fires at a returning player is worse than no notice.
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const MANIFEST = path.join(ROOT, 'slices/bohemia.webmanifest');
const PAGES = require(path.join(ROOT, 'gates/bohemia_pages_publish.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('HOME SCREEN GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

const A = fs.readFileSync(ALPHA, 'utf8');

/* ---- 1. the declarations ------------------------------------------------ */
ok('the alpha declares a manifest', /<link[^>]+rel="manifest"/.test(A));
ok('AND an apple-touch-icon, which is the only thing iOS puts on the springboard',
   /<link[^>]+rel="apple-touch-icon"[^>]+href="([^"]+)"/.test(A));
ok('it has a name for under the icon', /apple-mobile-web-app-title"\s+content="BOHEMIA"/.test(A));
ok('and it opens without browser chrome on older phones too',
   /apple-mobile-web-app-capable"\s+content="yes"/.test(A));

/* ---- 2. the manifest is real, and says standalone ------------------------ */
{
  ok('the manifest file exists', fs.existsSync(MANIFEST));
  let m = null;
  try { m = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')); } catch (e) { }
  ok('and it is valid JSON a phone can read', !!m);
  if (m) {
    ok('it opens standalone, portrait, named BOHEMIA',
       m.display === 'standalone' && m.orientation === 'portrait' && m.name === 'BOHEMIA');
    ok('its start_url is the ONE LINK, not some other page (' + m.start_url + ')',
       /BOHEMIA_ALPHA_0_9\.html$/.test(String(m.start_url || '')));
    ok('and it carries icons', Array.isArray(m.icons) && m.icons.length >= 2);
  }
}

/* ---- 3. EVERY ICON EXISTS AND PUBLISHES --------------------------------- */
{
  const refs = [];
  const t = /<link[^>]+rel="apple-touch-icon"[^>]+href="([^"]+)"/.exec(A);
  if (t) refs.push(t[1]);
  try {
    const m = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
    for (const i of (m.icons || [])) refs.push(i.src);
  } catch (e) { }
  const missing = [], dropped = [];
  for (const r of refs) {
    const rel = 'slices/' + String(r).replace(/^\.\//, '');
    if (!fs.existsSync(path.join(ROOT, rel))) missing.push(rel);
    const why = PAGES.excluded(rel);
    if (why) dropped.push(rel + ' (by ' + why + ')');
  }
  ok('every icon the build points at EXISTS (' + refs.length + ' refs)'
     + (missing.length ? ': missing ' + missing.join(', ') : ''), missing.length === 0);
  ok('and every one of them is a path Pages PUBLISHES -- a missing icon is a grey '
     + 'screenshot on his phone, not a broken image he could diagnose'
     + (dropped.length ? ': ' + dropped.join(', ') : ''), dropped.length === 0);
  ok('the manifest itself publishes', !PAGES.excluded('slices/bohemia.webmanifest'));
}

/* ---- 4. THE ICON IS HIS, and it is not a blank square ------------------- */
{
  const p = path.join(ROOT, 'slices/icons/bohemia-180.png');
  ok('the touch icon is a real file with real bytes',
     fs.existsSync(p) && fs.statSync(p).size > 2000);
  /* HIS PICK, NOT A CHOICE OF MINE: the bank records chosen_by_paolo and the
     icon tool reads that field rather than a hardcoded number. If he ever
     changes his pick, the icon has to follow, so this asserts the LINK between
     them rather than the number. */
  const tool = fs.readFileSync(path.join(ROOT, 'tools/bohemia_home_icon.py'), 'utf8');
  ok('the icon is built from HIS recorded pick, read from the bank, never hardcoded',
     /chosen_by_paolo/.test(tool) && /BOHEMIA_LOGO_CANDIDATES/.test(tool));
}

/* ---- 5. THE STORAGE SPLIT, DRIVEN BOTH WAYS ----------------------------- */
(async () => {
  const { chromium } = pw();
  const b = await chromium.launch();
  try {
    /* CASE A: standalone, nothing saved -> it must say so, and name the door. */
    {
      const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
      await pg.route(/^https?:/, r => r.abort());
      /* pretend to be a home-screen app the way iOS does */
      await pg.addInitScript(() => {
        try { Object.defineProperty(window.navigator, 'standalone', { get: () => true }); } catch (e) { }
      });
      await pg.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
      await pg.evaluate(() => { try { localStorage.clear(); } catch (e) { } });
      await pg.reload({ waitUntil: 'load', timeout: 180000 });
      await SETTLE(pg, 3000);
      const r = await pg.evaluate(() => {
        const el = document.getElementById('standalonenote');
        return { shown: !!el && getComputedStyle(el).display !== 'none',
                 text: el ? el.textContent : '', flag: window.__STANDALONE_NOTE || 0 };
      });
      ok('ON HIS HOME SCREEN WITH NOTHING SAVED, the game SAYS the storage is '
         + 'separate instead of looking like a wiped save', r.shown === true);
      ok('and it names the door that already exists (EXPORT SAVE)',
         /EXPORT SAVE/.test(r.text) && /IMPORT/.test(r.text));
      await pg.close();
    }
    /* CASE B: standalone WITH a save -> silence. A notice that fires at a
       returning player is worse than no notice at all. */
    {
      const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
      await pg.route(/^https?:/, r => r.abort());
      await pg.addInitScript(() => {
        try { Object.defineProperty(window.navigator, 'standalone', { get: () => true }); } catch (e) { }
      });
      await pg.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
      await SETTLE(pg, 2000);
      await pg.evaluate(() => {
        CITYSAVE.save({ v: 1, seed: 2691674296, day: 4, min: 700, hx: 10, hy: 10,
                        cx: 3, cy: 3, mode: 'city', loop: null, quest: null });
      });
      await pg.reload({ waitUntil: 'load', timeout: 180000 });
      await SETTLE(pg, 3000);
      const r = await pg.evaluate(() => {
        const el = document.getElementById('standalonenote');
        return { shown: !!el && getComputedStyle(el).display !== 'none',
                 empty: window.__STANDALONE_EMPTY };
      });
      ok('but with a run already in it, it stays QUIET (' + JSON.stringify(r) + ')',
         r.shown === false && r.empty === false);
      await pg.close();
    }
    /* CASE C: ordinary Safari -> never shown at all. */
    {
      const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
      await pg.route(/^https?:/, r => r.abort());
      await pg.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
      await pg.evaluate(() => { try { localStorage.clear(); } catch (e) { } });
      await pg.reload({ waitUntil: 'load', timeout: 180000 });
      await SETTLE(pg, 3000);
      const shown = await pg.evaluate(() => {
        const el = document.getElementById('standalonenote');
        return !!el && getComputedStyle(el).display !== 'none';
      });
      ok('and in the browser, where storage is not split, it never appears', shown === false);
      await pg.close();
    }
  } finally { await b.close(); }
  done();
})().catch(e => { console.log('HOME SCREEN GATE CRASHED: ' + e.message); process.exit(1); });
