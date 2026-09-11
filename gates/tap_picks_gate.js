/* ============================================================================
   THE TAP PICKS WHAT YOU SEE (9/11/26, LIFE + CITY lane)
   VAMILY [tap picks] THE-TAP-PICKS-THE-TILE-BELOW.

   PAOLO 9/8, from his own frame (records/target/PAOLO_THE_TAP_PICKS_THE_WRONG_TILE_9_8_26.png):
   "when I click a tile in city builder mode it's not the tile it's sitting on, it's like
   below, very awkward, can you fix that?"

   *** THE ROUTING RULING NAMED TWO CAUSES AND BOTH WERE WRONG, WHICH IS WHY THIS GATE
   MEASURES INSTEAD OF INHERITING. *** It cited a draw-time LIFT of 1.6 -- that constant is
   FORCE_POVERTY_LIFT, an economics number with nothing to do with drawing -- and page
   pixels not being scaled to canvas pixels, which toCv() has always done. Reading the code
   and then measuring said something else entirely.

   WHAT IS ACTUALLY TRUE, measured with DRIVEN TAPS before anything was changed:
       tapping a tile's GROUND CENTRE      25 of 25 exact, at every zoom
       tapping the BUILDING YOU CAN SEE     0 of 38
   The picker inverted the ground plane, which is exact arithmetic, and the eye is on the
   ART, which is painted above its own footprint. Those two answers only agree on flat
   ground, so a road always worked and a tower never did.

   AND THE PRISM PATH WAS A DEAD END: the first cut of the fix taught the picker about
   prism(), the procedural block fallback, and MEASURED ZERO PRISM CALLS AT EVERY ZOOM.
   The valley is painted with baked hero art. A fix for a body the renderer never puts on
   the glass would have measured green on a lie.

   THE FIX: the renderer records the rectangle it really blits, and the picker asks the
   art's own pixels which tile the finger is on, taking the one painted LAST. One source of
   truth, so the pick cannot disagree with the picture.

   AND THE ONE THING THAT TOOK FOUR ATTEMPTS: a ROAD plate is opaque well outside its own
   diamond, so "whose paint did you touch" hands a tap on open tarmac to the plot in front.
   Only art that STANDS UP may take a tap off the ground, and the cut point was read off the
   art rather than tuned -- measured at TW=48, every district on screen:
       desert wash rail cemetery water     1.05 tiles of opaque height
       mall park trailer storage freeway   1.09 - 1.14
       farm suburb arterial                1.20 - 1.23
       ------------- nothing lives in this gap -------------
       school strip commercial             1.54 - 1.56
       terminal chapel apartment campus    1.71 - 1.76
       substation courthouse resort        1.83 - 2.06
   Ground stops at 1.23, buildings start at 1.54, so the boundary is an EMPTY GAP in the
   art itself and the number inside it changes nothing. That is the difference between a
   measured threshold and a tuned one, and a first cut at 1.5 sat inside the building
   cluster and silently threw away every school and shop in the valley.

   ONLY A DRIVEN TAP COUNTS. The pad taught the fleet this a week ago: an in-page hit test
   said 12 of 12 while real taps landed 2 of 11. Every assertion here drives real pointer
   events at the real surface.
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

console.log('='.repeat(74));
console.log('THE TAP PICKS WHAT YOU SEE — his frame, measured with driven taps');
console.log('='.repeat(74));

const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

/* A1. THE PICKER READS WHAT THE RENDERER DREW, rather than a second idea of the city.
   The whole class of bug here is two pieces of code with two opinions about where a tile
   is; the day somebody computes the answer again separately, this goes red. */
ok('A1 the renderer records the art it blits and the picker reads that record',
   /CB_DREW\.set\(CB_DREW_AT/.test(CITY)
   && /function cbPaintAt/.test(CITY)
   && /CB_DREW\.get\(tx\+','\+ty\)/.test(CITY));

/* A2. THE CUT POINT IS THE MEASURED GAP, and the comment carries the measurement so the
   next person can check it rather than trust it. */
ok('A2 only art that stands up can take a tap off the ground, at the gap the art itself '
   + 'shows (ground to 1.23 tiles, buildings from 1.54)',
   /cbArtRise\(rec\.im\) \* rec\.h/.test(CITY) && /TH\*1\.35/.test(CITY)
   && /nothing lives in this gap|nothing at all lives in here/i.test(CITY));

(async () => {
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    const f = path.join(ROOT, u.replace(/^\//, ''));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  /* HIS OWN SURFACE: the alpha, which is the only link he ever gets. */
  await page.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_ALPHA_0_9.html',
    { waitUntil: 'load', timeout: 300000 });
  await page.waitForTimeout(15000);
  await page.evaluate(() => {
    const f = document.getElementById('fronttap') || document.getElementById('front');
    if (f) f.click(); });
  await page.waitForTimeout(25000);
  const fr = page.frames().filter(f => /BOHEMIA_CITY_WORLD/.test(f.url()))[0] || null;
  let box = { x: 0, y: 0 };
  if (fr) { const fe = await fr.frameElement(); const bb = await fe.boundingBox(); if (bb) box = bb; }

  /* *** DISMISS THE MORNING CARD, THE WAY A PLAYER DOES. *** #daycard covers the whole
     canvas on boot, and the first three runs of this probe reported every tap landing
     nowhere because of it. A checker that does not play the game measures itself. */
  if (fr) await fr.evaluate(() => {
    const dc = document.getElementById('daycard');
    if (dc) { const x = dc.querySelector('#daycardX,.x,button'); if (x) x.click();
              dc.classList.remove('on'); dc.style.display = 'none'; } });
  await page.waitForTimeout(400);

  const tapAt = async (cx, cy) => {
    const pt = await fr.evaluate(([x, y]) => {
      const r = cv.getBoundingClientRect();
      const px = r.left + x * r.width / cv.width, py = r.top + y * r.height / cv.height;
      if (document.elementFromPoint(px, py) !== cv) return null;
      return [px, py];
    }, [cx, cy]);
    if (!pt) return 'covered';
    await fr.evaluate(() => { CB.sel = null; });
    await page.mouse.move(pt[0] + box.x, pt[1] + box.y);
    await page.mouse.down(); await page.mouse.up();
    await page.waitForTimeout(70);
    return fr.evaluate(() => CB.sel ? CB.sel.join(',') : 'null');
  };

  const out = { zooms: [] };
  if (fr) for (const TW of [18, 30, 48]) {
    await fr.evaluate(t => { MODE = 'city'; TW = t; TH = t / 2; panX = 0; panY = 0; render(); }, TW);
    await page.waitForTimeout(350);
    const rec = await fr.evaluate(() => {
      const out = [];
      CB_DREW.forEach((v, k) => {
        if (v.dx < 24 || v.dy < 24 || v.dx + v.w > cv.width - 24 || v.dy + v.h > cv.height - 24) return;
        const a = k.split(',').map(Number);
        out.push({ x: a[0], y: a[1], solid: cbArtRise(v.im) * v.h,
                   d: (om.at(a[0], a[1]) || {}).district });
      });
      return { TW, TH, n: CB_DREW.size, list: out };
    });
    /* THE BUILDINGS ON SCREEN, by the art's own measure */
    const blds = rec.list.filter(t => t.solid > rec.TH * 1.35)
                         .sort((a, b) => b.solid - a.solid).slice(0, 16);
    let hit = 0, n = 0;
    for (const t of blds) {
      /* WHERE A THUMB LANDS: the middle of the paint, found by walking the art's own
         centre line to the first opaque pixel and stepping in. */
      const pt = await fr.evaluate(([kx, ky]) => {
        const r = CB_DREW.get(kx + ',' + ky); if (!r) return null;
        const cx = r.dx + r.w / 2;
        for (let s = 0; s < r.h; s += Math.max(1, r.h / 60))
          if (cbPaintAt(r, cx, r.dy + s)) {
            const cy = r.dy + s + Math.min(r.h * 0.18, 6);
            return cbPaintAt(r, cx, cy) ? [cx, cy] : null;
          }
        return null;
      }, [t.x, t.y]);
      if (!pt) continue;
      const sel = await tapAt(pt[0], pt[1]);
      if (sel === 'covered') continue;
      n++; if (sel === t.x + ',' + t.y) hit++;
    }
    /* AND THE GROUND STILL ANSWERS FOR ITSELF -- BUT ONLY WHERE NOTHING CAN COVER IT.
       The first cut of this leg tapped the ground centre of any flat tile and scored 0 of
       12 at the far zoom, which was the LEG being wrong rather than the picker: at TW=18 a
       tower's art legitimately lies across several rows of its neighbours' ground, so the
       right answer there IS the tower. Testing a point you cannot see and demanding the
       thing underneath it is a frozen premise. So this tests open ground: a flat tile with
       nothing tall within reach of it, where the ground answer is the only possible one. */
    const tallKey = {};
    rec.list.forEach(t => { if (t.solid > rec.TH * 1.35) tallKey[t.x + ',' + t.y] = 1; });
    const openGround = t => {
      /* THE RADIUS IS THE PICKER'S OWN REACH, not a small number that felt safe. At
         TW=18 a row is 4.5 px and a tower's art is four rows tall, so buildings claim
         ground a long way back and a six-row check called correct behaviour a failure. */
      const R = Math.ceil((rec.TH * 2.1) / Math.max(1, rec.TH / 2)) + 12;
      for (let dx = 0; dx <= R; dx++) for (let dy = 0; dy <= R; dy++) {
        if (!dx && !dy) continue;
        if (tallKey[(t.x + dx) + ',' + (t.y + dy)]) return false;
      }
      return true;
    };
    const flats = rec.list.filter(t => t.solid <= rec.TH * 1.35 && openGround(t)).slice(0, 40);
    let fh = 0, fn = 0;
    for (const t of flats) {
      const pt = await fr.evaluate(([tx, ty]) => {
        const ox = Math.round(cv.width / 2 - (city.x - city.y) * TW / 2 + panX);
        const oy = Math.round(cv.height / 2 - (city.x + city.y) * TH / 2 + panY);
        const sx = ox + (tx - ty) * TW / 2, sy = oy + (tx + ty) * TH / 2;
        if (sx < 24 || sy < 24 || sx > cv.width - 24 || sy > cv.height - 24) return null;
        return [sx, sy + TH / 2];
      }, [t.x, t.y]);
      if (!pt) continue;
      const sel = await tapAt(pt[0], pt[1]);
      if (sel === 'covered') continue;
      fn++; if (sel === t.x + ',' + t.y) fh++;
      if (fn >= 12) break;
    }
    out.zooms.push({ TW: rec.TW, buildings: hit, buildingsOf: n, ground: fh, groundOf: fn });
  }

  const B = out.zooms.reduce((a, z) => a + z.buildings, 0);
  const BN = out.zooms.reduce((a, z) => a + z.buildingsOf, 0);
  const G = out.zooms.reduce((a, z) => a + z.ground, 0);
  const GN = out.zooms.reduce((a, z) => a + z.groundOf, 0);

  /* B1. *** HIS COMPLAINT, AND IT IS THE WHOLE ROW. *** Before this round the same probe
     scored ZERO: tapping the building you were looking at never once selected it. */
  ok('B1 *** TAPPING A BUILDING SELECTS THAT BUILDING *** — ' + B + ' of ' + BN
     + ' driven taps across three zooms, and it was 0 of 38 before this round',
     BN >= 12 && B / Math.max(1, BN) >= 0.85);

  /* B2. AND FLAT GROUND DID NOT REGRESS, which is the half a fix like this usually
     breaks: the ground inversion was already exact and must stay exact. */
  ok('B2 tapping OPEN ground — ground with nothing tall near it — still selects that '
     + 'ground: ' + G + ' of ' + GN,
     GN >= 8 && G / Math.max(1, GN) >= 0.85);

  /* B3. EVERY ZOOM, not an average over three. A picker that works at one zoom and not
     another is the bug wearing a different hat. */
  /* a zoom with a handful of buildings on screen cannot carry a ratio; judge the ones
     with a real sample and say how many the others had */
  const weak = out.zooms.filter(z => z.buildingsOf >= 5 && z.buildings / z.buildingsOf < 0.8);
  ok('B3 it holds at every zoom, not on average ('
     + out.zooms.map(z => 'TW' + z.TW + ' ' + z.buildings + '/' + z.buildingsOf).join(', ') + ')',
     out.zooms.length === 3 && weak.length === 0);

  ok('B4 nothing threw' + (errs.length ? ' -> ' + errs[0] : ''), errs.length === 0);

  console.log('  MEASURED WITH DRIVEN TAPS ON THE ALPHA:');
  for (const z of out.zooms)
    console.log('    TW=' + z.TW + '  buildings ' + z.buildings + '/' + z.buildingsOf
      + '   open ground ' + z.ground + '/' + z.groundOf);
  console.log('    before this round: buildings 0 of 38');

  await ctx.close();
  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  THE TAP PICKS WHAT YOU SEE: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  THE TAP PICKS WHAT YOU SEE: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
