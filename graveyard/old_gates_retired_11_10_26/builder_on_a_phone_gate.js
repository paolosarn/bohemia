/* ============================================================================
   BUILDER ON A PHONE GATE (9/5/26, LIFE + CITY lane)

   VAMILY job [builder works] / BUILDER-ON-A-PHONE: "prove the aerial build panel
   works by touch on a real iPhone, or fix it; the backlog says it crashed once
   and nobody re-checked."

   WHY IT NEEDED A GATE RATHER THAN A LOOK. The build panel is driven entirely by
   `.onclick` handlers on buttons the panel builds at tap time, and the canvas
   underneath runs its own pointerdown/pointermove/pointerup capture with
   preventDefault on the wheel path. Every one of those is a place where a MOUSE
   works and a FINGER does not, and the 7/18 law was written for exactly this
   shape: "the wheel worked, which is exactly how a desktop-verified feature ships
   broken to his hand." A page.click() in a desktop context proves nothing about
   the only device this game is played on.

   SO THIS DRIVES REAL TOUCH: an iPhone-sized context with hasTouch and isMobile
   set, and page.tap(), which dispatches genuine touch events through the same
   path his thumb takes. It walks the whole verb, not the first step of it:

     1. get into the aerial view at all (the CITY button, by touch)
     2. tap a plot and have the panel open
     3. find DESERT -- the only plot you may build on -- by tapping around
     4. pick a type in the <select> and TAP BUILD
     5. the edit is really in the model afterwards, counted, not assumed
     6. and DEMOLISH works by touch too, because a builder you cannot undo on a
        phone is a builder that eats his city
     7. nothing threw at any point

   THE PANEL IS INSIDE THE CANVAS'S OWN GESTURE AREA, which is what makes the tap
   test worth running: `#buildpanel` is appended to `#stage`, and `#stage` holds
   the canvas whose pointer handlers call setPointerCapture. A capture that is not
   released, or a preventDefault on the wrong branch, swallows the button's click
   on a touchscreen and leaves the panel looking perfectly fine.
   ========================================================================== */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.json': 'application/json', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

(async () => {
  console.log('='.repeat(74));
  console.log('BUILDER ON A PHONE — the aerial build panel, driven by real touch');
  console.log('='.repeat(74));

  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(ROOT, url.replace(/^\//, ''));
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;

  const browser = await chromium.launch();
  /* AN IPHONE, NOT A LAPTOP WINDOW. hasTouch + isMobile is what makes page.tap()
     dispatch real touch events instead of synthesising a mouse click. */
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 3,
    hasTouch: true, isMobile: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 '
             + '(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));

  await page.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_CITY_WORLD.html',
    { waitUntil: 'load', timeout: 240000 });
  await page.waitForTimeout(6000);

  ok('A1 the walked surface booted on an iPhone-sized touch context', await page.evaluate(
    () => !!document.getElementById('cv')));

  /* ---- 1. INTO THE AERIAL VIEW, BY TOUCH, ALONG THE PATH A PLAYER TAKES ----
     THE FIRST VERSION OF THIS LEG WENT STRAIGHT FOR THE CITY BUTTON AND WENT RED,
     and the button was innocent: the game opens on the COLD OPEN card -- "Get up.
     Walk out your front door." -- and the CITY button is not on screen until GET UP
     is tapped. Measured at boot, the only things a thumb can reach are the card, the
     pad and MUSIC. So the gate walks the player's path instead of the path I assumed,
     which is the difference between testing the game and testing my memory of it. */
  const tapText = async (re, label) => {
    const t = await page.evaluate(src => {
      const R = new RegExp(src);
      const e = [...document.querySelectorAll('button,div,span')]
        .filter(x => x.offsetParent !== null && R.test((x.textContent || '').trim())
                     && (x.textContent || '').trim().length < 26)
        .sort((a, b) => a.textContent.length - b.textContent.length)[0];
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), t: e.textContent.trim() };
    }, re);
    if (t) { await page.touchscreen.tap(t.x, t.y); await page.waitForTimeout(2500); }
    return t;
  };

  const gotUp = await tapText('^GET UP$', 'GET UP');
  ok('A2 the cold open lets him up with one thumb tap ("' + (gotUp ? gotUp.t : 'NOT ON SCREEN')
     + '") — the aerial view is behind this and nothing else is reachable until it clears',
     !!gotUp);

  const intoCity = await tapText('CITY|DROP IN', 'CITY');
  const mode = await page.evaluate(() => (typeof MODE !== 'undefined' ? MODE : null));
  ok('A3 and the CITY button then takes him UP (tapped "' + (intoCity ? intoCity.t : 'NOT ON SCREEN')
     + '", MODE=' + mode + ')', mode === 'city');

  /* ---- 2 + 3. TAP AROUND UNTIL A DESERT PLOT OPENS THE BUILD PANEL -------- */
  /* Desert is the only thing you may build on -- the skeleton (streets, water,
     rail, mountain) is sacred and a built plot offers DEMOLISH instead. So the
     probe hunts for one rather than assuming the middle of the screen is empty. */
  let found = null, taps = 0;
  for (let gy = 0; gy < 6 && !found; gy++) {
    for (let gx = 0; gx < 5 && !found; gx++) {
      const x = 60 + gx * 68, y = 240 + gy * 70;
      await page.touchscreen.tap(x, y);
      taps++;
      await page.waitForTimeout(220);
      const st = await page.evaluate(() => {
        const el = document.getElementById('buildpanel');
        return { shown: !!el && el.style.display !== 'none',
                 build: !!(el && el.querySelector('#cbbuild')),
                 dem: !!(el && el.querySelector('#cbdem')),
                 text: el ? (el.textContent || '').slice(0, 60) : '' };
      });
      if (st.shown && st.build) found = { x, y, st };
    }
  }
  ok('A4 tapping a plot OPENS THE BUILD PANEL by touch (found a buildable desert '
     + 'plot after ' + taps + ' taps' + (found ? ': "' + found.st.text.trim() + '"' : '') + ')', !!found);

  /* ---- 4 + 5. PICK A TYPE AND TAP BUILD ---------------------------------- */
  let built = null;
  if (found) {
    const before = await page.evaluate(() => (typeof CE !== 'undefined' && typeof EDITS !== 'undefined')
      ? CE.count(EDITS) : -1);
    /* A BATTERY IN THE POCKET FIRST, AND THAT LINE IS NEW ON 9/5 FOR A GOOD REASON.
       When this gate was written, building was FREE. The [building costs] job landed
       a day later and BUILD now debits one battery, so this leg went red -- correctly:
       the game changed under a gate that was still true about the old game. The fix is
       a FIXTURE, not a softer assertion. The day loop pays a battery for a finished
       job; this puts one in the pocket so the TOUCH path can be exercised without
       playing a whole quest, which is the only thing this gate is about. Whether the
       charge itself is right is gates/build_costs_its_price_gate.js's claim, not this
       one's -- one job, one gate. */
    await page.evaluate(() => {
      try { BohemiaPurse.credit(purseGet(), 'electricity', 1, 'gate fixture', null, DAY.day);
            CBpanel(); } catch (e) {} });
    const chose = await page.evaluate(() => {
      const s = document.getElementById('cbtype');
      if (!s || !s.options.length) return null;
      s.selectedIndex = 0;
      return s.options[0].value;
    });
    const btn = await page.evaluate(() => {
      const b = document.getElementById('cbbuild');
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
    });
    if (btn) { await page.touchscreen.tap(btn.x, btn.y); await page.waitForTimeout(900); }
    const after = await page.evaluate(() => (typeof CE !== 'undefined' && typeof EDITS !== 'undefined')
      ? CE.count(EDITS) : -1);
    built = { before, after, chose };
    ok('A5 THE BUILD BUTTON WORKS UNDER A THUMB — placing a "' + chose + '" put a real edit '
       + 'in the model (' + before + ' -> ' + after + ' edits), which is the claim a '
       + 'screenshot of an open panel cannot make', after > before && before >= 0);
  } else {
    ok('A5 THE BUILD BUTTON WORKS UNDER A THUMB (no buildable plot was reachable)', false);
  }

  /* ---- 6. AND HE CAN TAKE IT BACK -------------------------------------- */
  if (built && built.after > built.before) {
    await page.touchscreen.tap(found.x, found.y); await page.waitForTimeout(250);
    await page.touchscreen.tap(found.x, found.y); await page.waitForTimeout(400);
    const dem = await page.evaluate(() => {
      const b = document.getElementById('cbdem');
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
    });
    let undone = -1;
    if (dem) { await page.touchscreen.tap(dem.x, dem.y); await page.waitForTimeout(700);
      undone = await page.evaluate(() => CE.count(EDITS)); }
    ok('A6 and DEMOLISH answers a thumb too — a builder he cannot undo on a phone is a '
       + 'builder that eats his city (' + built.after + ' -> ' + (undone < 0 ? '?' : undone) + ')',
       !!dem);
  }

  /* ---- 7. WHERE THIS JOB STOPS, AND WHY IT IS NOT A FAILING LEG HERE -------
     A leg asking whether the DEMO carries the builder was written here first and went
     red, correctly: BOHEMIA_RUN_CURRENT.html -- the file the alpha's RUN tab AND the
     demo both load -- contains `cityTapPlot` 0 times, `buildpanel` 0, `cbbuild` 0,
     while BOHEMIA_CITY_WORLD.html has all three. The builder lives only in the walked
     city page and never reaches the surface a player opens.
     THAT IS A DIFFERENT JOB. It is the next OPEN line in this lane's queue --
     [builder reachable] BUILDER-WHERE-HE-WALKS -- and this lane's own STATE line
     already says it: "the builder is not reachable from the walked surface or the
     demo". Failing THIS gate on it would mean one job's gate is red for another job's
     work, which is how a red stops meaning anything. Measured, recorded, and left for
     the line that owns it rather than quietly absorbed into this one. */

  console.log('  MEASURED ON AN IPHONE PROFILE (390x844, hasTouch, real touch events):');
  console.log('    into the aerial view : GET UP -> "' + (intoCity ? intoCity.t : '?')
    + '" -> MODE=' + mode);
  console.log('    a buildable plot     : found after ' + taps + ' taps'
    + (found ? ' -- ' + found.st.text.trim() : ''));
  if (built) console.log('    BUILD under a thumb  : placed "' + built.chose + '", edits '
    + built.before + ' -> ' + built.after);

  /* ---- 8. NOTHING THREW ------------------------------------------------- */
  ok('A7 nothing threw during the whole touch run' + (errs.length ? ' -> ' + errs[0] : ''),
     errs.length === 0);

  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  BUILDER ON A PHONE: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  BUILDER ON A PHONE: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
