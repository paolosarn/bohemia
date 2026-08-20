/* ============================================================================
   CITY KIT BINDING GATE (8/3/26)

   THE BUG THIS EXISTS FOR. The alpha's CITY app inlines ~40 engine modules into
   one script, in a fixed order. `engine/bohemia_suburb.js` is inlined at line
   2950 and `engine/bohemia_district_kit.js` at line 3335 -- the suburb is the ONE
   district of thirty-nine that loads BEFORE the kit. Every district module opens
   with

       var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
             : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);

   which CAPTURES the kit at LOAD time. For the suburb that capture is `undefined`,
   forever. It sat harmless for as long as the suburb never actually reached for the
   kit; the first line that did took the entire world down --
   "Cannot read properties of undefined (reading 'layWalks')" out of realizeCell --
   and turned 32 gates red in one suite run, with the alpha still booting cleanly so
   nothing looked wrong until you walked into a suburb.

   MEASURED FALLOUT, same cause, still true: BohemiaDistrictKit.types() in the
   running app returns 35 districts and `suburb` is NOT one of them. The
   `K.register('suburb', ...)` at the tail of that module has never run in the CITY
   app. The comment sitting above the binding says the 7/26 fix was for exactly that
   symptom -- it fixed the guard and left the load order, so the symptom survived.

   TWO ASSERTIONS:
     1. STATIC, on the shipped blob -- any engine district module inlined BEFORE the
        kit must NOT capture the kit at load time. Resolve it lazily or be inlined
        after the kit; there is no third option that works.
     2. LIVE, in the browser -- the walked world generates without throwing, at the
        spawn district and at a plain suburb cell. A blob that parses is not a blob
        that runs.
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const CITY_APP = require('./bohemia_city_app.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
function pw(){ try{ return require('/opt/node22/lib/node_modules/playwright'); }
  catch(e){ return require('playwright'); } }
/* WHERE the city app lives and WHAT SHAPE it is in are not this gate's business
   (8/4). One resolver knows; this asks it. */
const CITY = require('./bohemia_city_app.js');
function cityBlob(_a){ const x = CITY.read(); return x ? x.src : ''; }
/* the SECOND cityBlob was deleted 8/6. It was declared after the resolver one
   above it, and in JavaScript the LAST function declaration wins -- so the
   resolver was dead here exactly as it was in thirteen other gates this
   morning. It read the world file directly, which stopped seeing the art
   banks the moment they were split out. One resolver, and only one. */
/* a LOAD-TIME capture: `var K = ... BohemiaDistrictKit ...` at module top level.
   A lazy accessor (`function K(){...}`) is what a pre-kit module must use instead. */
const CAPTURE = /var\s+K\s*=\s*\(typeof\s+module/;

(async () => {
  const alpha = fs.readFileSync(ALPHA, 'utf8');
  const city = cityBlob(alpha);
  ok('the alpha carries a readable CITY renderer', city.length > 100000);

  /* 1. STATIC: module order, and who reaches for the kit before it exists */
  const lines = city.split('\n');
  const mods = [];
  lines.forEach((l, i) => {
    const s = l.trim();
    const m = /^\/\* ==== engine\/(bohemia_[a-z_]+)\.js /.exec(s);
    if (m && s.endsWith('==== */')) mods.push({ name: m[1], line: i });
  });
  ok('the blob announces its inlined engine modules (' + mods.length + ')', mods.length >= 30);
  const kit = mods.find(m => m.name === 'bohemia_district_kit');
  ok('engine/bohemia_district_kit.js is inlined in the blob', !!kit);
  if (kit) {
    const before = mods.filter(m => m.line < kit.line && m.name !== 'bohemia_district_kit');
    /* every module inlined ahead of the kit is checked against its own source slice */
    let bad = [];
    for (const m of before) {
      const end = mods.filter(x => x.line > m.line).reduce((a, x) => Math.min(a, x.line), lines.length);
      const src = lines.slice(m.line, end).join('\n');
      if (!/BohemiaDistrictKit/.test(src)) continue;      // does not want the kit at all
      if (CAPTURE.test(src)) bad.push(m.name);
    }
    ok('no module inlined BEFORE the kit captures it at load time'
       + (bad.length ? ' -- ' + bad.join(', ') + ' froze K as undefined' : '')
       + ' (' + before.length + ' modules ahead of the kit)', bad.length === 0);
    ok('the suburb resolves the kit lazily (it is the one module ahead of the kit)',
       /function K\(\)\{/.test(city) && /K\(\)\.layWalks\(/.test(city));
  }

  /* 2. LIVE: the world actually generates. A blob that parses is not a blob that runs. */
  const { chromium } = pw();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 3000);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await SETTLE(page, 1500);
    /* ONE WORLD TAB LAW: a tab click may NEVER swallow its own failure. A missing
       RUN tab used to mean this gate quietly probed the wrong surface and failed
       thirty seconds later, nowhere near the cause. */
    await page.evaluate(() => { const t = document.querySelector('[data-p="run"]');
      if (!t) throw new Error('THE RUN TAB IS GONE from the alpha tab bar');
      t.click(); });
    let f = null;
    for (let i = 0; i < 20; i++) {
      await SETTLE(page, 3000);
      /* FIND THE FRAME BY WHAT IT IS, NOT BY HOW IT WAS LOADED (8/4). It was a
         srcdoc frame until the payload-wall pass; it is a sibling src frame now.
         One predicate knows: gates/bohemia_city_app.js. */
      f = page.frames().find(fr => CITY_APP.isFrame(fr, page));
      if (!f) continue;
      const up = await f.evaluate(() => typeof fit === 'function' &&
        document.getElementById('cv').width > 300).catch(() => false);
      if (up) break;
    }
    ok('the world frame booted', !!f);
    if (f) {
      const r = await f.evaluate(() => {
        const out = { cells: 0 };
        out.kit = typeof BohemiaDistrictKit;
        try { if (MODE !== 'human' && typeof swapMode === 'function') swapMode(); }
        catch (e) { out.swapErr = String(e && e.message || e).slice(0, 120); }
        /* the spawn district, then a spread of cells across it */
        try {
          for (let ly = 4; ly < FN - 4; ly += 17) for (let lx = 4; lx < FN - 4; lx += 17) {
            const c = cellAt(city.x * FN + lx, city.y * FN + ly);
            if (c) out.cells++;
          }
        } catch (e) { out.cellErr = String(e && e.message || e).slice(0, 120); }
        /* and a real render, which is what he actually looks at */
        try { render(); } catch (e) { out.renderErr = String(e && e.message || e).slice(0, 120); }
        return out;
      });
      ok('the kit is up in the running app', r.kit === 'object');
      ok('entering the walked world does not throw' + (r.swapErr ? ' -- ' + r.swapErr : ''), !r.swapErr);
      ok('generating the spawn district does not throw' + (r.cellErr ? ' -- ' + r.cellErr : ''), !r.cellErr);
      ok('it generated real cells (' + r.cells + ')', r.cells > 20);
      ok('and it renders' + (r.renderErr ? ' -- ' + r.renderErr : ''), !r.renderErr);
    }
    ok('no uncaught page error while walking the world'
       + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  } finally { await browser.close(); }
  console.log('CITY KIT BINDING GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('CITY KIT BINDING GATE CRASHED: ' + e.message); process.exit(1); });
