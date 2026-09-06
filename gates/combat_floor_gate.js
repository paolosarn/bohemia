/* ============================================================================
   COMBAT FLOOR GATE (9/5/26, LIFE + CITY lane)

   VAMILY job [combat floor] / THE-AERIAL-VIEW-IS-THE-COMBAT-FLOOR: "with COMBAT:
   the zoomed-out city render is what the fight stands on (9/4 tile law 3b); expose
   it as a drawable layer COMBAT can centre on a block."

   HIS RULING IS THE SPEC AND IT IS LOCKED. 3b: "the size of the 'ground' changes but
   the player is the same size just what they 'walk' on is a more zoomed out city so
   it really feels like war is spilling in the streets type shit". And the law answers
   the HOW itself -- "REUSE-FIRST, and it is already built ... The combat floor is
   that render, centred on the block you are standing on, NOT A NEW BOARD. ONE SEED,
   same coordinates, so the fight happens on the actual streets you walked to."

   SO B2 IS THE LEG THAT MATTERS MOST: the floor must be THE CITY'S OWN RENDERER,
   pointed somewhere else and put back. A second renderer would be byte-different from
   the streets he walked to get there, which is exactly what "ONE SEED, same
   coordinates" forbids. B3 is its twin and the one that would bite a player: the
   camera has to come back EXACTLY, because a camera left pointing at somebody else's
   fight is a bug that outlives the frame that caused it.

   A2 IS A RULING HELD AS A RULE. "The player is the same size" only reads as war on a
   map if the ground is genuinely smaller than the person, so a tile at or above the
   112px sprite is REFUSED BY NAME rather than drawn -- a floor that zooms IN is not
   this ruling with a different number, it is the opposite of it.
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

const F = require('../engine/bohemia_combatfloor.js');

console.log('='.repeat(74));
console.log('COMBAT FLOOR — the city he walked, handed to the fight as ground');
console.log('='.repeat(74));

/* ---- A. THE CONTRACT, HEADLESS ------------------------------------------ */

const pl = F.plan({ cx: 40, cy: 40, w: 390, h: 400, n: 96 });
ok('A1 a plan is pure arithmetic and needs no pixels — COMBAT can place bodies '
   + 'without drawing a frame (' + pl.cells.length + ' cells, radius ' + pl.radius + ')',
   pl.ok === true && pl.cells.length > 0 && pl.radius > 0);

/* A2. THE RULING, HELD AS A RULE. */
const zoomIn = F.plan({ cx: 40, cy: 40, w: 390, h: 400, tileW: F.SPRITE_PX });
ok('A2 A FLOOR AT OR ABOVE THE FIGURE IS REFUSED BY NAME — the player stays the same '
   + 'size and only the ground zooms out (' + zoomIn.reason + ')',
   zoomIn.ok === false && zoomIn.reason === 'FLOOR_BIGGER_THAN_THE_FIGURE');

/* A3. AND THE DEFAULT REALLY IS WAR ON A MAP. His own numbers: the 56 rig draws at
   112, the city's own tile is 18. A figure six blocks wide is the picture he asked
   for, and this is the number that says so out loud. */
ok('A3 at the city\'s own tile a figure stands ' + pl.figureTiles + ' blocks wide, '
   + 'which is "figures on a war map" as a number rather than an adjective',
   pl.figureTiles >= 4 && pl.spritePx === 112 && pl.tileW === 18);

/* A4. THE FLOOR IS CENTRED ON THE BLOCK, and it stays inside the map. */
const edge = F.plan({ cx: 0, cy: 0, w: 390, h: 400, n: 96 });
ok('A4 the plan is centred on the block asked for and never leaves the map ('
   + 'centre ' + pl.cx + ',' + pl.cy + '; at the corner ' + edge.cells.length + ' cells, '
   + 'none negative)',
   pl.cx === 40 && pl.cy === 40
   && edge.cells.every(c => c[0] >= 0 && c[1] >= 0 && c[0] < 96 && c[1] < 96)
   && edge.cells.length < pl.cells.length);

/* A5. A BIGGER SCREEN IS MORE GROUND, not bigger ground. */
const small = F.plan({ cx: 40, cy: 40, w: 200, h: 200, n: 96 });
ok('A5 a bigger viewport shows MORE blocks at the same scale, never bigger ones ('
   + small.cells.length + ' -> ' + pl.cells.length + ' cells, tile ' + small.tileW
   + ' both times)',
   pl.cells.length > small.cells.length && small.tileW === pl.tileW);

/* A6. WITHOUT A SURFACE IT SAYS SO RATHER THAN DRAWING NOTHING QUIETLY. */
const noPainter = F.paint({}, { cx: 1, cy: 1, w: 10, h: 10 });
ok('A6 with no surface registered it refuses by name (' + noPainter.reason + ')',
   noPainter.ok === false && noPainter.reason === 'NO_PAINTER');

/* ---- B. THE REAL SURFACE ------------------------------------------------ */
(async () => {
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
  await page.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_CITY_WORLD.html',
    { waitUntil: 'load', timeout: 240000 });
  await page.waitForTimeout(6000);

  const tapText = async (re) => {
    const t = await page.evaluate(src => {
      const R = new RegExp(src);
      const e = [...document.querySelectorAll('button,div,span')]
        .filter(x => x.offsetParent !== null && R.test((x.textContent || '').trim())
                     && (x.textContent || '').trim().length < 30)
        .sort((a, b) => a.textContent.length - b.textContent.length)[0];
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
    }, re);
    if (t) { await page.touchscreen.tap(t.x, t.y); await page.waitForTimeout(1800); }
    return t;
  };
  await tapText('^GET UP$');

  const live = await page.evaluate(() => {
    const out = {};
    out.ready = BohemiaCombatFloor.ready();
    const cell = [(hx / FN) | 0, (hy / FN) | 0];
    out.cell = cell;
    /* THE CAMERA IS PUT SOMEWHERE DISTINCTIVE FIRST, AND THAT IS THE WHOLE POINT OF
       THIS LEG. The first cut captured the camera as it happened to sit, painted a
       floor centred on the SAME block at the SAME tile, and compared -- so deleting
       the restore changed nothing and the mutation walked straight through. The camera
       at boot already sat on the walked cell at the default tile, which is accidental
       correctness of exactly the kind that rots. Now it is parked somewhere the floor
       will definitely move it away from. */
    city.x = 7; city.y = 11; TW = 26; TH = 13; panX = 5; panY = -9;
    const before = { x: city.x, y: city.y, TW: TW, TH: TH, panX: panX, panY: panY };

    function shoot(cx, cy) {
      const c = document.createElement('canvas'); c.width = 390; c.height = 400;
      const r = BohemiaCombatFloor.paint(c.getContext('2d'),
        { cx: cx, cy: cy, w: 390, h: 400, n: om.n });
      return { r: r, url: c.toDataURL() };
    }
    /* far from where the camera is parked, and at the floor's own tile, so a missing
       restore cannot look like a restore */
    const a = shoot(cell[0], cell[1]);
    const after = { x: city.x, y: city.y, TW: TW, TH: TH, panX: panX, panY: panY };
    const again = shoot(cell[0], cell[1]);
    /* somewhere else entirely, so "it painted" cannot be a fixed picture */
    const far = shoot(Math.min(om.n - 3, cell[0] + 30), Math.min(om.n - 3, cell[1] + 30));

    /* did pixels land, and how many colours */
    const c2 = document.createElement('canvas'); c2.width = 390; c2.height = 400;
    BohemiaCombatFloor.paint(c2.getContext('2d'), { cx: cell[0], cy: cell[1], w: 390, h: 400, n: om.n });
    const d = c2.getContext('2d').getImageData(0, 0, 390, 400).data;
    let opaque = 0; const seen = {};
    for (let i = 0; i < d.length; i += 4 * 97) {
      seen[d[i] + ',' + d[i + 1] + ',' + d[i + 2]] = 1;
      if (d[i + 3] > 0) opaque++;
    }

    const plan = BohemiaCombatFloor.plan({ cx: cell[0], cy: cell[1], w: 390, h: 400, n: om.n });
    const cover = BohemiaCombatFloor.coverOn(plan) || [];
    return { ready: out.ready, cell: cell, ok: a.r.ok, from: a.r.from,
             cameraRestored: JSON.stringify(before) === JSON.stringify(after),
             cameraWas: before, cameraNow: after,
             deterministic: a.url === again.url,
             differentBlock: a.url !== far.url,
             opaque: opaque, samples: Math.floor(d.length / (4 * 97)),
             colours: Object.keys(seen).length,
             here: BohemiaCombatFloor.at(cell[0], cell[1]),
             cover: cover.length, coverScope: (cover[0] || {}).scope,
             planCells: plan.cells.length };
  });

  ok('B1 the walked surface registers its own renderer as the floor painter',
     live.ready === true);

  ok('B2 A FLOOR REALLY PAINTS — ' + live.opaque + ' of ' + live.samples
     + ' sampled pixels opaque in ' + live.colours + ' colours, cropped from '
     + JSON.stringify(live.from) + ', and the SAME block twice is byte-identical while '
     + 'a block thirty away is not — so it is the city, at those coordinates, and not '
     + 'a picture',
     live.ok === true && live.opaque > live.samples * 0.9 && live.colours > 20
     && live.deterministic === true && live.differentBlock === true);

  /* B3. THE CAMERA COMES BACK. A camera left pointing at somebody else's fight is a
     bug that outlives the frame that caused it, which is why the restore is in a
     finally and why this leg compares every field rather than eyeballing the view. */
  ok('B3 the city camera is put back EXACTLY after the floor is taken — parked at '
     + JSON.stringify(live.cameraWas) + ', found at ' + JSON.stringify(live.cameraNow),
     live.cameraRestored === true
     /* and the park really was somewhere the floor had to move away from, or this
        leg is grading a claim against itself */
     && (live.cameraWas.x !== live.cell[0] || live.cameraWas.TW !== 18));

  /* B4. AND COVER IS THE BUILDINGS THAT ARE REALLY THERE, in the unit it really has. */
  ok('B4 cover reads the real world in a stated unit (' + live.cover + ' solid of '
     + live.planCells + ' cells, scope "' + live.coverScope + '", standing on '
     + (live.here && live.here.district) + ')',
     live.cover > 0 && live.cover <= live.planCells && live.coverScope === 'block'
     && !!live.here && !!live.here.district && live.here.scope === 'block');

  ok('B5 nothing threw on the walked surface' + (errs.length ? ' -> ' + errs[0] : ''),
     errs.length === 0);

  /* ---- C. THE DEMO (rule 7) ---------------------------------------------- */
  const dpage = await ctx.newPage();
  const derrs = [];
  dpage.on('pageerror', e => derrs.push(String(e).slice(0, 160)));
  await dpage.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_DEMO.html',
    { waitUntil: 'load', timeout: 240000 });
  await dpage.waitForTimeout(4000);
  await dpage.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
  await dpage.waitForTimeout(3000);
  await dpage.evaluate(() => {
    const n = document.getElementById('openNot'); if (n) n.click();
    const s2 = document.getElementById('openSkip'); if (s2) s2.click(); });
  await dpage.waitForTimeout(14000);
  const cf = dpage.frames().filter(f => /CITY_WORLD/.test(f.url()))[0] || null;
  const dem = cf ? await cf.evaluate(() => {
    try {
      const cell = [(hx / FN) | 0, (hy / FN) | 0];
      const before = { x: city.x, y: city.y, TW: TW };
      const c = document.createElement('canvas'); c.width = 320; c.height = 320;
      const r = BohemiaCombatFloor.paint(c.getContext('2d'),
        { cx: cell[0], cy: cell[1], w: 320, h: 320, n: om.n });
      const after = { x: city.x, y: city.y, TW: TW };
      const d = c.getContext('2d').getImageData(0, 0, 320, 320).data;
      let opaque = 0;
      for (let i = 3; i < d.length; i += 4 * 97) if (d[i] > 0) opaque++;
      return { ok: r.ok, opaque: opaque,
               restored: JSON.stringify(before) === JSON.stringify(after) };
    } catch (e) { return { err: String(e).slice(0, 90) }; }
  }) : null;
  ok('C1 the floor paints in the cut demo and puts the camera back ('
     + (dem && dem.ok != null ? dem.opaque + ' opaque samples, restored ' + dem.restored
        : (dem && dem.err) || 'NO CITY FRAME') + ')',
     !!dem && dem.ok === true && dem.opaque > 100 && dem.restored === true);
  ok('C2 nothing threw in the demo' + (derrs.length ? ' -> ' + derrs[0] : ''),
     derrs.length === 0);

  console.log('  MEASURED ON THE WALKED SURFACE:');
  console.log('    standing on        : ' + live.cell + ' (' + (live.here && live.here.district) + ')');
  console.log('    a figure is        : ' + pl.figureTiles + ' blocks wide at the city\'s own tile');
  console.log('    the floor          : ' + live.planCells + ' blocks, ' + live.cover
    + ' of them built up');
  console.log('    same block twice   : ' + (live.deterministic ? 'identical' : 'DIFFERENT')
    + ' | thirty blocks away: ' + (live.differentBlock ? 'different' : 'IDENTICAL'));

  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  COMBAT FLOOR: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  COMBAT FLOOR: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
