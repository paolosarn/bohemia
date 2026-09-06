/* ============================================================================
   THE MAP KNOWS WHERE PEOPLE ARE (9/6/26, LIFE + CITY lane)
   Round 3 of VAMILY [more people] POPULATION-DEFAULT. The row stays OPEN.

   ROUNDS 1 AND 2 put residents at their own front doors and gave a neighbourhood
   places to gather. A walk still only meets somebody 9 times in 32, because a
   crowd is real when you are standing in it and invisible when you are not. What
   was left was FINDING.

   MEASURED FIRST, AND THE MAP HAD NEVER ASKED: renderCity() does not call
   headsAt(), census() or pplPeople() once. You can open the map of the whole
   valley and nothing on it says a single person lives anywhere. That is the exact
   sentence this file already carries about factions -- "you could open the map of
   the whole valley and nothing on it said that anybody held any of it" -- and
   people were the half nobody came back for.

   AND THE NUMBER THAT MAKES IT WORTH DRAWING: HE WAKES ONE KILOMETRE FROM A
   SETTLEMENT OF 220 PEOPLE. Eight overmap cells; a twenty-minute walk on the roads
   BB-ROADS-ARE-FAST made fast. The game has never had any way to tell him it is
   there.

   TWO THINGS THE REAL SCREEN KILLED, and neither was visible from the code:
     1. The first cut also marked all 139 neighbourhoods that hold ANYBODY. On the
        actual map that is clutter over the streets and lights the map is for, and
        a small pale diamond IS INDISTINGUISHABLE FROM THE GOLD DIAMONDS THE MAP
        ALREADY DRAWS FOR EVERY LANDMARK. A mark that reads as a different mark is
        worse than no mark. Thirteen settlements, nothing else.
     2. It measured 2.41:1 against the ground it sits on. This repo has just had 38
        pieces of text measured as too faint to read; adding a 39th would be its own
        defect. It is 10.5:1 now.
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
console.log('THE MAP KNOWS WHERE PEOPLE ARE — you can see where to walk');
console.log('='.repeat(74));

const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
const DEMO = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_DEMO.html'), 'utf8');

/* A1. MAP LAW: NOTHING IS PLACED HERE. Every mark has to be a neighbourhood the
   zone map already decided; a map that invents a settlement is a map that lies. */
ok('A1 the grid is derived from the population module and places nothing '
   + '(zoneAt + headsAt + dialAt, no coordinates of its own)',
   /function pplGrid\(\)/.test(CITY)
   && /P\.zoneAt\(om, POWER/.test(CITY) && /P\.headsAt\(om, POWER/.test(CITY)
   && /P\.dialAt\(nx, ny\)/.test(CITY));

/* A2. AND IT IS CACHED WITH THE VALLEY, keyed on the rules version so a mass edit
   cannot leave the map drawing the pre-edit world. */
ok('A2 one flat array built once with the valley, keyed on seed AND the rules '
   + 'version so an edit cannot leave a stale map',
   /PPL_MAP_KEY === k && PPL_MAP/.test(CITY)
   && /BohemiaPopulation\.rulesVersion\(\)/.test(CITY.slice(CITY.indexOf('function pplGrid'),
                                                            CITY.indexOf('function pplGrid') + 400)));

/* A3. IT REACHES THE CUT DEMO. The demo loads the walked city in an iframe rather
   than inlining it, so this asserts the wire and section C proves the behaviour. */
ok('A3 the cut demo loads the walked city, which is where this draws',
   /<iframe[^>]*BOHEMIA_CITY_WORLD/.test(DEMO) || /CITY_SRC/.test(DEMO));

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

  async function open(file, framed) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
    await page.goto('http://127.0.0.1:' + port + '/slices/' + file, { waitUntil: 'load', timeout: 300000 });
    await page.waitForTimeout(framed ? 15000 : 9000);
    if (framed) {
      await page.evaluate(() => {
        const f = document.getElementById('fronttap') || document.getElementById('front');
        if (f) f.click(); });
      await page.waitForTimeout(20000);
    }
    const target = framed
      ? (page.frames().filter(f => /BOHEMIA_CITY_WORLD/.test(f.url()))[0] || null)
      : page;
    return { ctx, page, target, errs };
  }

  const W = await open('BOHEMIA_CITY_WORLD.html', false);

  /* B1. THE GRID AGREES WITH THE VALLEY IT CLAIMS TO DESCRIBE. If these two ever
     drift, the map is telling him about a different world than the one he walks. */
  const grid = W.target ? await W.target.evaluate(() => {
    try {
      const P = BohemiaPopulation, NB = P.NB, gr = pplGrid();
      if (!gr) return { none: true };
      let any = 0, clusters = 0, total = 0;
      for (let i = 0; i < gr.heads.length; i++) {
        if (!gr.heads[i]) continue;
        any++; total += gr.heads[i];
        if (gr.zone[i] === 'cluster') clusters++;
      }
      /* and the same numbers asked straight of the module, never of the grid */
      let z = { cluster: 0 }, walked = 0;
      for (let ny = 0; ny < gr.n; ny++) for (let nx = 0; nx < gr.n; nx++) {
        let zz = null;
        try { zz = P.zoneAt(om, POWER, nx * NB, ny * NB, seed); } catch (e) {}
        if (zz === 'cluster') z.cluster++;
        try { walked += P.headsAt(om, POWER, nx * NB, ny * NB, seed) * P.dialAt(nx, ny); } catch (e) {}
      }
      return { entries: gr.heads.length, withAnybody: any, settlements: clusters,
               people: total, moduleClusters: z.cluster, modulePeople: Math.round(walked) };
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'no surface' };
  ok('B1 the grid says exactly what the population module says ('
     + (grid.err || (grid.settlements + ' settlements against the module\'s '
        + grid.moduleClusters + ', ' + grid.people + ' people against '
        + grid.modulePeople)) + ')',
     !grid.err && !grid.none && grid.settlements > 0
     && grid.settlements === grid.moduleClusters
     && grid.people === grid.modulePeople);

  /* B2. *** THE MARK IS ON THE GLASS. *** A drawing that changes no pixels is not a
     drawing, and this lane has shipped a probe that could not see one before. */
  const glass = W.target ? await W.target.evaluate(() => {
    try {
      MODE = 'city';
      city.x = hx >> 7; city.y = hy >> 7;
      renderCity();
      const a = g.getImageData(0, 0, cv.width, cv.height).data;
      const marks = window.__PPL_MARKS | 0;
      const was = window.pplGrid;
      window.pplGrid = function () { return null; };
      renderCity();
      const b = g.getImageData(0, 0, cv.width, cv.height).data;
      window.pplGrid = was;
      renderCity();
      let diff = 0;
      for (let i = 0; i < a.length; i += 4)
        if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2]) diff++;
      return { pixels: diff, marksOnScreen: marks, of: a.length / 4 };
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'no surface' };
  ok('B2 *** THE MARKS ARE ACTUALLY ON THE GLASS *** — ' + (glass.err || (
       glass.pixels + ' pixels change when the pass is switched off, '
       + glass.marksOnScreen + ' marks in view')),
     !glass.err && glass.pixels > 200 && glass.marksOnScreen > 0);

  /* B2b. *** AND EVERY MARK IS A SETTLEMENT. *** The real screen forced this
     decision and only a leg can hold it: the first cut also marked all 139
     neighbourhoods that hold anybody, which is clutter over the streets the map is
     for and a shape indistinguishable from the gold diamonds the map already draws
     for every landmark. Loosening it back went UNCAUGHT by every other leg here --
     69 marks in view instead of 6, contrast unchanged, pixels merrily changing --
     because "is it drawn" and "is it bright" say nothing about WHAT is drawn.
     So this counts the settlements whose centre lands on screen, ITSELF, off the
     module rather than off the grid, and requires the drawn count to be exactly
     that. */
  const onlyClusters = W.target ? await W.target.evaluate(() => {
    try {
      const P = BohemiaPopulation, NB = P.NB;
      MODE = 'city'; city.x = hx >> 7; city.y = hy >> 7; renderCity();
      const drew = window.__PPL_MARKS | 0;
      const ox = Math.round(cv.width / 2 - (city.x - city.y) * TW / 2 + panX);
      const oy = Math.round(cv.height / 2 - (city.x + city.y) * TH / 2 + panY);
      let clustersInView = 0, anybodyInView = 0;
      const N = Math.ceil((om.n | 0) / NB);
      for (let ny = 0; ny < N; ny++) for (let nx = 0; nx < N; nx++) {
        const cx = nx * NB + (NB >> 1), cy = ny * NB + (NB >> 1);
        if (cx >= om.n || cy >= om.n) continue;
        const c = iso(cx, cy, ox, oy);
        if (c.sx < -40 || c.sx > cv.width + 40) continue;
        if (c.sy < -40 || c.sy > cv.height + 40) continue;
        let z = null, h = 0;
        try { z = P.zoneAt(om, POWER, nx * NB, ny * NB, seed); } catch (e) {}
        if (!z || z === 'empty') continue;
        try { h = Math.round(P.headsAt(om, POWER, nx * NB, ny * NB, seed) * P.dialAt(nx, ny)); }
        catch (e) {}
        if (!h) continue;
        anybodyInView++;
        if (z === 'cluster') clustersInView++;
      }
      return { drew: drew, clustersInView: clustersInView, anybodyInView: anybodyInView };
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'no surface' };
  ok('B2b every mark is a SETTLEMENT and nothing else — ' + (onlyClusters.err || (
       onlyClusters.drew + ' drawn against ' + onlyClusters.clustersInView
       + ' settlements in view (and ' + onlyClusters.anybodyInView
       + ' neighbourhoods in view hold somebody, which are deliberately NOT marked)')),
     !onlyClusters.err && onlyClusters.clustersInView > 0
     && onlyClusters.drew === onlyClusters.clustersInView
     && onlyClusters.anybodyInView > onlyClusters.clustersInView);

  /* B3. *** AND IT IS BRIGHT ENOUGH TO BE A MARK. *** 38 pieces of text on the
     screen he lands on were measured too faint to read this round; a map mark under
     the same floor is the same defect wearing a different shape. WCAG puts a
     graphic at 3:1. The first cut of THIS measurement read the centre of the ring,
     which is a deliberate dark hole, and reported the hole. */
  const contrast = W.target ? await W.target.evaluate(() => {
    try {
      const P = BohemiaPopulation, NB = P.NB, gr = pplGrid();
      let best = null, bd = 1e9;
      const n0 = [Math.floor((hx >> 7) / NB), Math.floor((hy >> 7) / NB)];
      for (let ny = 0; ny < gr.n; ny++) for (let nx = 0; nx < gr.n; nx++) {
        if (gr.zone[ny * gr.n + nx] !== 'cluster') continue;
        const d = Math.max(Math.abs(nx - n0[0]), Math.abs(ny - n0[1]));
        if (d < bd) { bd = d; best = [nx, ny]; }
      }
      if (!best) return { none: true };
      city.x = best[0] * NB + 2; city.y = best[1] * NB + 2;
      MODE = 'city'; renderCity();
      const ox = Math.round(cv.width / 2 - (city.x - city.y) * TW / 2 + panX);
      const oy = Math.round(cv.height / 2 - (city.x + city.y) * TH / 2 + panY);
      const c = iso(best[0] * NB + 2, best[1] * NB + 2, ox, oy);
      const lum = (x, y) => {
        const d = g.getImageData(x | 0, y | 0, 1, 1).data;
        const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
        return 0.2126 * f(d[0]) + 0.7152 * f(d[1]) + 0.0722 * f(d[2]);
      };
      /* THE RING, NOT THE HOLE IN IT */
      const r = Math.max(4, TW * 0.34);
      const mark = lum(c.sx + r * 0.7, c.sy + TH / 2);
      const ground = lum(c.sx + TW * 1.4, c.sy + TH / 2);
      const hi = Math.max(mark, ground), lo = Math.min(mark, ground);
      return { ratio: +((hi + 0.05) / (lo + 0.05)).toFixed(2),
               settlementCellsAway: bd * NB,
               km: +(bd * NB * 128 / 1000).toFixed(2) };
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'no surface' };
  ok('B3 a mark is bright enough to BE a mark (' + (contrast.err || contrast.none
       ? 'NO SETTLEMENT' : contrast.ratio + ':1 against the ground it sits on, '
       + 'floor is 3:1') + ')',
     !contrast.err && !contrast.none && contrast.ratio >= 3);

  /* B4. THE NUMBER THIS ROUND EXISTS FOR: there is a crowd within a day's walk of
     where he wakes, and until now nothing told him. */
  ok('B4 the nearest settlement to where he wakes is ' + (contrast.km || '?')
     + ' km away, and the map now says so',
     !contrast.err && !contrast.none && contrast.settlementCellsAway > 0
     && contrast.km < 10);

  /* B5. *** NOT A HUD PIN. *** The territory pass above states this as a rule and it
     is the difference between a map and a quest arrow: it is not on the walking
     screen, so it cannot follow him around. */
  const human = W.target ? await W.target.evaluate(() => {
    try {
      MODE = 'human';
      window.__PPL_MARKS = -1;
      render();
      return { marks: window.__PPL_MARKS };
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'no surface' };
  ok('B5 NOT A HUD PIN: nothing is drawn on the walking screen ('
     + (human.err || 'marks counter untouched at ' + human.marks) + ')',
     !human.err && human.marks === -1);

  ok('B6 nothing threw on the walked surface'
     + (W.errs.length ? ' -> ' + W.errs[0] : ''), W.errs.length === 0);
  await W.ctx.close();

  /* C. THE CUT DEMO ---------------------------------------------------------- */
  const D = await open('BOHEMIA_DEMO.html', true);
  const dgot = D.target ? await D.target.evaluate(() => {
    try {
      const gr = pplGrid();
      if (!gr) return { none: true };
      let c = 0;
      for (let i = 0; i < gr.heads.length; i++) if (gr.zone[i] === 'cluster') c++;
      MODE = 'city'; city.x = hx >> 7; city.y = hy >> 7; renderCity();
      return { settlements: c, marksOnScreen: window.__PPL_MARKS | 0 };
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'NO CITY FRAME' };
  ok('C1 the cut demo draws them too ('
     + (dgot.err || dgot.none ? 'NONE' : dgot.settlements + ' settlements, '
        + dgot.marksOnScreen + ' in view') + ')',
     !dgot.err && !dgot.none && dgot.settlements > 0);
  ok('C2 nothing threw in the demo' + (D.errs.length ? ' -> ' + D.errs[0] : ''),
     D.errs.length === 0);
  await D.ctx.close();

  console.log('  MEASURED ON THE WALKED SURFACE:');
  console.log('    the valley           : ' + grid.settlements + ' settlements, '
    + grid.withAnybody + ' neighbourhoods with anybody, ' + grid.people + ' people');
  console.log('    the marks            : ' + glass.marksOnScreen + ' in view, '
    + glass.pixels + ' pixels, ' + (contrast.ratio || '?') + ':1 contrast');
  console.log('    nearest crowd        : ' + (contrast.km || '?')
    + ' km from where he wakes  [THE JOB STAYS OPEN]');

  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  THE MAP KNOWS WHERE PEOPLE ARE: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  THE MAP KNOWS WHERE PEOPLE ARE: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
