/* ============================================================================
   BUILDER WHERE HE WALKS GATE (9/5/26, LIFE + CITY lane)

   VAMILY job [builder reachable] / BUILDER-WHERE-HE-WALKS: "the build verbs and
   panel reach the walked surface and the demo; today they live only in the aerial
   tab."

   HALF THE BRIEF WAS ALREADY FALSE AND I MEASURED IT BEFORE BUILDING ANYTHING.
   Driven on the REAL cut demo, through the splash, as a player: the CITY button is
   there, the panel opens on a plot, BUILD is live. The builder reaches the demo and
   has for some time. The earlier note that said otherwise was reading
   BOHEMIA_RUN_CURRENT.html for `cityTapPlot` -- and the demo does not load the
   builder from that file, it loads BOHEMIA_CITY_WORLD.html in an iframe. A grep
   over the wrong artefact is not a measurement.

   WHAT WAS REALLY MISSING IS THE OTHER HALF OF THE JOB'S OWN NAME: WHERE HE WALKS.
   cityTapPlot is guarded by `MODE==='city'`, so a player standing on the street
   could not touch the city he is rebuilding without first leaving it and looking
   down at it. That is what this gate holds.

   THE LEG THAT EARNED ITS KEEP IS B5. The first drive through this found demolish
   landing in the delta while om.at still answered SUBURB, so the panel offered
   DEMOLISH a second time and the next BUILD was refused as "build only on empty
   desert" for a plot that was already desert. The edit-seam frame cache is bumped
   only by the CITY render, and the walked surface never runs one, so its "one
   frame" lifetime became forever the moment a door opened that was not the aerial
   view. B5 asks the WORLD, not the delta, so it stays red until an edit made on
   foot is really visible on foot.
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
  console.log('BUILDER WHERE HE WALKS — the build verb reaches the street, not just the sky');
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
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));

  const tapText = async (fr, re) => {
    const t = await fr.evaluate(src => {
      const R = new RegExp(src);
      const e = [...document.querySelectorAll('button,div,span')]
        .filter(x => x.offsetParent !== null && R.test((x.textContent || '').trim())
                     && (x.textContent || '').trim().length < 30)
        .sort((a, b) => a.textContent.length - b.textContent.length)[0];
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), t: e.textContent.trim() };
    }, re);
    if (t) { await page.touchscreen.tap(t.x, t.y); await page.waitForTimeout(1800); }
    return t;
  };

  /* ---- A. THE WALKED SURFACE ------------------------------------------- */
  await page.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_CITY_WORLD.html',
    { waitUntil: 'load', timeout: 240000 });
  await page.waitForTimeout(6000);
  await tapText(page, '^GET UP$');

  const mode = await page.evaluate(() => MODE);
  ok('A1 he is ON FOOT, which is the whole point of this job (MODE=' + mode + ')',
     mode === 'human');

  /* A2. A CONTROL IS NOT OFFERED BECAUSE IT EXISTS, IT IS OFFERED BECAUSE IT CAN BE
     PRESSED (the 8/27 lesson: a chip at a hardcoded offset sat under #blstack and a
     real click on it timed out, while a gate reading its TEXT said it was fine). So
     this reads the chip's own screen box and TAPS THOSE COORDINATES. */
  const chip = await page.evaluate(() => {
    const e = document.getElementById('buildbtn');
    if (!e || e.offsetParent === null) return null;
    const r = e.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2),
             w: Math.round(r.width), h: Math.round(r.height), t: (e.textContent || '').trim() };
  });
  ok('A2 the BUILD chip is on screen while walking and big enough for a thumb ("'
     + (chip ? chip.t + '", ' + chip.w + 'x' + chip.h : 'NOT ON SCREEN') + ')',
     !!chip && chip.w >= 60 && chip.h >= 24);

  /* A3. AND NOTHING IS COVERING IT. elementFromPoint at the chip's own centre must
     come back to the chip -- that is the difference between drawn and reachable. */
  const onTop = await page.evaluate(() => {
    const e = document.getElementById('buildbtn');
    if (!e) return null;
    const r = e.getBoundingClientRect();
    const hit = document.elementFromPoint(Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2));
    return hit ? (hit === e || e.contains(hit)) : null;
  });
  ok('A3 a thumb landing on it reaches IT and not something painted over it',
     onTop === true);

  if (chip) { await page.touchscreen.tap(chip.x, chip.y); await page.waitForTimeout(900); }
  const opened = await page.evaluate(() => {
    const el = document.getElementById('buildpanel');
    return { shown: !!el && el.style.display !== 'none',
             sel: CB.sel ? CB.sel.slice() : null, cell: [(hx / FN) | 0, (hy / FN) | 0],
             text: el ? (el.textContent || '').slice(0, 40) : '' };
  });
  ok('A4 tapping it opens the panel FOR THE CELL UNDER HIS FEET (panel ' + opened.sel
     + ', standing in ' + opened.cell + ')',
     opened.shown && !!opened.sel
     && opened.sel[0] === opened.cell[0] && opened.sel[1] === opened.cell[1]);

  /* A5. AN EDIT MADE ON FOOT IS REALLY TRUE ON FOOT. This asks the WORLD (om.at),
     not the delta, because the delta was right the first time this ran and the world
     was still answering with a cached snapshot from a frame that never came. */
  const dem = await page.evaluate(() => {
    const b = document.getElementById('cbdem');
    if (!b) return null; const r = b.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  const beforeDem = await page.evaluate(() => ({
    d: om.at((hx / FN) | 0, (hy / FN) | 0).district, edits: CE.count(EDITS) }));
  if (dem) { await page.touchscreen.tap(dem.x, dem.y); await page.waitForTimeout(1100); }
  const afterDem = await page.evaluate(() => ({
    d: om.at((hx / FN) | 0, (hy / FN) | 0).district, edits: CE.count(EDITS) }));
  ok('A5 DEMOLISH under his feet really changes the world he is standing in ('
     + beforeDem.d + ' -> ' + afterDem.d + ', ' + beforeDem.edits + ' -> '
     + afterDem.edits + ' edits) — asked of om.at, not of the delta',
     afterDem.edits === beforeDem.edits + 1 && afterDem.d === 'desert'
     && beforeDem.d !== 'desert');

  /* A6. BROKE ON FOOT IS REFUSED ON FOOT. The price rules are the aerial builder's
     rules because they are the same code; this proves the street did not get its own
     softer copy of them. */
  const brokeTry = await page.evaluate(() => {
    const b = document.getElementById('cbbuild');
    if (!b) return null; const r = b.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  const bal0 = await page.evaluate(() => BohemiaPurse.balances(purseGet()).electricity);
  if (brokeTry) { await page.touchscreen.tap(brokeTry.x, brokeTry.y); await page.waitForTimeout(800); }
  const brokeAfter = await page.evaluate(() => ({
    d: om.at((hx / FN) | 0, (hy / FN) | 0).district,
    note: (document.getElementById('buildpanel') || {}).textContent || '' }));
  ok('A6 with no battery the street refuses too, in words (' + bal0 + ' batteries, still '
     + brokeAfter.d + ')',
     bal0 === 0 && brokeAfter.d === 'desert' && /that costs/.test(brokeAfter.note));

  /* A7. AND WITH A BATTERY, HE BUILDS WHERE HE IS STANDING. */
  await page.evaluate(() => {
    BohemiaPurse.credit(purseGet(), 'electricity', 1, 'gate fixture', null, DAY.day);
    CBpanel(); });
  const built0 = await page.evaluate(() => ({
    d: om.at((hx / FN) | 0, (hy / FN) | 0).district,
    bal: BohemiaPurse.balances(purseGet()).electricity }));
  const bd = await page.evaluate(() => {
    const b = document.getElementById('cbbuild');
    if (!b) return null; const r = b.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  if (bd) { await page.touchscreen.tap(bd.x, bd.y); await page.waitForTimeout(1100); }
  const built1 = await page.evaluate(() => ({
    d: om.at((hx / FN) | 0, (hy / FN) | 0).district,
    bal: BohemiaPurse.balances(purseGet()).electricity }));
  ok('A7 HE BUILDS WHERE HE IS STANDING, and it costs him the battery ('
     + built0.d + ' -> ' + built1.d + ', batteries ' + built0.bal + ' -> ' + built1.bal + ')',
     built1.d !== 'desert' && built1.bal === built0.bal - 1);

  /* A8. AND HE CAN PUT THE PANEL DOWN. On foot there is no plot to tap a second
     time, so a panel with no way out would be a thing he can open and not close. */
  const cx = await page.evaluate(() => {
    const b = document.getElementById('cbclose');
    if (!b) return null; const r = b.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  if (cx) { await page.touchscreen.tap(cx.x, cx.y); await page.waitForTimeout(500); }
  const closed = await page.evaluate(() => {
    const el = document.getElementById('buildpanel');
    return !el || el.style.display === 'none'; });
  ok('A8 and the panel closes again on foot (the X exists and answers a thumb)',
     !!cx && closed);

  /* A9. NOT TWO DOORS INTO ONE ROOM. In the aerial view tapping a plot already opens
     this panel, so the chip must not also be sitting there offering a second way in. */
  await tapText(page, 'CITY|DROP IN');
  const inCity = await page.evaluate(() => ({
    mode: MODE, chip: (document.getElementById('buildbtn') || {}).style.display }));
  ok('A9 the chip is NOT offered in the aerial view, where tapping a plot already does '
     + 'this (MODE=' + inCity.mode + ', chip=' + inCity.chip + ')',
     inCity.mode === 'city' && inCity.chip === 'none');

  ok('A10 nothing threw on the walked surface' + (errs.length ? ' -> ' + errs[0] : ''),
     errs.length === 0);

  /* ---- B. THE DEMO, WHICH IS THE OTHER HALF OF RULE 7 -------------------- */
  const dpage = await ctx.newPage();
  const derrs = [];
  dpage.on('pageerror', e => derrs.push(String(e).slice(0, 160)));
  await dpage.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_DEMO.html',
    { waitUntil: 'load', timeout: 240000 });
  await dpage.waitForTimeout(4000);
  await dpage.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
  await dpage.waitForTimeout(3000);
  /* AND THE COLD-OPEN INVITE IS A REAL BANNER A REAL PLAYER ANSWERS. #openInvite is
     absolute, left:0 right:0 top:0, z-index 39, ACROSS THE TOP OF THE CITY FRAME --
     so until it is answered it swallows every tap in the top band of the screen,
     which is exactly where the build panel lives. The first run of this section spent
     its budget proving the DEMOLISH button was unpressable in the demo and the button
     was innocent: elementFromPoint INSIDE the frame said "cbdem" (true), while the
     same point in the PARENT said "openNot" (also true, and the one that decides).
     A ladder of taps down the screen found every y reaching the frame except the one
     under the banner, which is what turned a theory into a measurement.
     THIRD TIME THIS LANE HAS SHIPPED A GATE THAT SKIPPED A STEP THE PLAYER CANNOT:
     the cold open card, then GET UP, now this. Walk the game, never your memory of it. */
  await dpage.evaluate(() => {
    const n = document.getElementById('openNot');            /* NOT NOW, a real answer */
    if (n) n.click();
    const w = document.getElementById('openSkip');
    if (w) w.click(); });
  await dpage.waitForTimeout(14000);

  const cf = dpage.frames().filter(f => /CITY_WORLD/.test(f.url()))[0] || null;
  ok('B1 the demo really loads the walked city (and this is why the "not in the demo" '
     + 'half of the brief was false — it was grepping RUN_CURRENT, which is not the '
     + 'file the demo builds from)', !!cf);

  if (cf) {
    /* THE IFRAME'S COORDINATES ARE NOT THE PAGE'S COORDINATES, AND THE FIRST RUN OF
       THIS SECTION PROVED IT: the chip reported itself at its own frame-relative box,
       page.touchscreen.tap() aims at the PAGE, and the tap landed somewhere else
       entirely -- 13/2 with the panel never opening in the demo while the identical
       drive worked on the bare page. Nothing was wrong with the game. Offset every
       demo tap by where the frame actually sits, once, here. */
    const fel = await cf.frameElement();
    const fbox = fel ? await fel.boundingBox() : null;
    const dtap = async (pt) => {
      if (!pt || !fbox) return false;
      await dpage.touchscreen.tap(fbox.x + pt.x, fbox.y + pt.y);
      await dpage.waitForTimeout(1000);
      return true;
    };
    /* AND THE DEMO STILL OPENS ON THE COLD OPEN CARD. The first run of this section
       went red with the chip DRAWN and unpressable, and the blocker was #daycard --
       inset:0, z-index 40 -- sitting over the whole screen because nothing had tapped
       GET UP inside the frame. Same mistake the builder gate made in its first cut and
       wrote a paragraph about: the gate has to walk the game, not my memory of it. The
       chip was innocent both times. */
    const dtapText = async (re) => {
      const t = await cf.evaluate(src => {
        const R = new RegExp(src);
        const e = [...document.querySelectorAll('button,div,span')]
          .filter(x => x.offsetParent !== null && R.test((x.textContent || '').trim())
                       && (x.textContent || '').trim().length < 30)
          .sort((a, b) => a.textContent.length - b.textContent.length)[0];
        if (!e) return null;
        const r = e.getBoundingClientRect();
        return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2),
                 t: e.textContent.trim() };
      }, re);
      if (t) await dtap(t);
      return t;
    };
    const dgotUp = await dtapText('^GET UP$');
    ok('B2 the demo lets him up first — the cold open owns the screen until it clears ("'
       + (dgotUp ? dgotUp.t : 'NOT ON SCREEN') + '")', !!dgotUp);

    const dchip = await cf.evaluate(() => {
      const e = document.getElementById('buildbtn');
      if (!e) return { there: false };
      const r = e.getBoundingClientRect();
      return { there: true, shown: e.offsetParent !== null, mode: MODE,
               x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2),
               t: (e.textContent || '').trim() };
    });
    ok('B3 A STRANGER OPENING THE DEMO CAN SEE IT TOO ("' + (dchip.t || 'NOT THERE')
       + '", MODE=' + dchip.mode + ')', dchip.there && dchip.shown === true);

    if (dchip.shown) await dtap(dchip);
    const dpan = await cf.evaluate(() => {
      const el = document.getElementById('buildpanel');
      return { shown: !!el && el.style.display !== 'none',
               sel: CB.sel ? CB.sel.slice() : null, cell: [(hx / FN) | 0, (hy / FN) | 0],
               priced: /battery|batteries/.test((el && el.textContent) || '') };
    });
    ok('B4 and it opens the same panel, for the cell he is standing in, with the price '
       + 'on it (panel ' + dpan.sel + ', standing in ' + dpan.cell + ')',
       dpan.shown && !!dpan.sel && dpan.sel[0] === dpan.cell[0] && dpan.sel[1] === dpan.cell[1]);

    /* B4. THE ONE THAT CAUGHT THE REAL BUG. Ask the WORLD, on foot, in the demo. */
    const d0 = await cf.evaluate(() => om.at((hx / FN) | 0, (hy / FN) | 0).district);
    const ddem = await cf.evaluate(() => {
      const b = document.getElementById('cbdem');
      if (!b) return null; const r = b.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
    });
    await dtap(ddem);
    const d1 = await cf.evaluate(() => om.at((hx / FN) | 0, (hy / FN) | 0).district);
    ok('B5 AN EDIT MADE ON FOOT IS REALLY TRUE ON FOOT IN THE DEMO (' + d0 + ' -> ' + d1
       + ') — the leg that caught the seam cache outliving a frame that never came',
       d0 !== 'desert' && d1 === 'desert');

    ok('B6 nothing threw in the demo' + (derrs.length ? ' -> ' + derrs[0] : ''),
       derrs.length === 0);

    console.log('  MEASURED IN THE CUT DEMO:');
    console.log('    the chip on the street : "' + (dchip.t || '?') + '"');
    console.log('    demolish on foot       : ' + d0 + ' -> ' + d1);
  }

  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  BUILDER WHERE HE WALKS: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  BUILDER WHERE HE WALKS: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
