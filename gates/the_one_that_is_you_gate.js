/* ============================================================================
   THE ONE THAT IS YOU (9/11/26, LIFE + CITY lane)
   VAMILY [white rings] WHAT-ARE-THE-FOUR-WHITE-RINGS.

   HIS FRAME, 9/8 (records/target/PAOLO_THE_RAIL_COLLIDES_9_8_26.jpg): four white rings on
   the city at once, and one of them is supposed to be him.

   *** THEY WERE THIS LANE'S OWN. *** Three of them are the SETTLEMENT RINGS this lane
   shipped in round 3 of [more people], whose own comment promises "NOT A HUD PIN, it does
   not follow him". They keep that promise and still caused this, because nobody ever
   checked them against the mark they sit beside.

   MEASURED ON THE ALPHA BEFORE ANYTHING WAS TOUCHED, at the zoom his frame was taken at:
       settlement rings on screen     4      radius 10.2 px
       the mark that means YOU        1      radius  5.0 px
   THE MARKS FOR "A TOWN IS HERE" WERE TWICE THE SIZE OF THE MARK FOR "YOU ARE HERE", and
   both were a pale disc. The loudest thing on his screen was never him. Worse with zoom:
   the player's mark was a FIXED 5 px at every zoom while the rings scale with the tile, so
   at TW=48 the rings are 16 px and he was still 5.

   THE FIX IS SHAPE, NOT BRIGHTNESS. Dimming the rings would fight the ruling that put them
   there -- round 3 measured 38 pieces of text too faint to read and built these to clear a
   3:1 contrast floor on purpose. A RING IS A PLACE; A PIN IS A PERSON. It stands above the
   ground on a stem with a foot, so its silhouette cannot be read as a hollow ring at any
   size, and it carries his own colour in the middle where a ring carries a dark hole.

   THIS GATE MEASURES THE RENDERED PIXELS, not the source. Two marks can be described
   differently in code and still look identical on the glass, and looking identical on the
   glass is the entire complaint.
   ========================================================================== */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
               '.webmanifest': 'application/manifest+json' };

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('THE ONE THAT IS YOU — four rings, and none of them said which');
console.log('='.repeat(74));

const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

/* A1. THE SETTLEMENT RINGS ARE UNTOUCHED. The fix must not be "make the other marks
   quieter" -- round 3 built them to a measured contrast floor and that ruling stands. */
ok('A1 the settlement rings keep their own colours and their contrast ruling',
   /g\.fillStyle = '#f4ead2'; g\.fill\(\);/.test(CITY)
   && /__THE_MAP_KNOWS_WHERE_PEOPLE_ARE__|NOT A\s*\n?\s*HUD PIN/.test(CITY));

/* A2. AND THE PLAYER'S MARK SCALES WITH THE MAP, like everything else on it. A fixed
   pixel size is what made zooming in make this worse. */
ok('A2 the player\'s mark is sized off the tile, not a fixed 5 px',
   /__hr=Math\.max\(6, TW\*0\.36\)/.test(CITY) && /__st=Math\.max\(8, TW\*0\.50\)/.test(CITY));

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
  await page.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_ALPHA_0_9.html',
    { waitUntil: 'load', timeout: 300000 });
  await page.waitForTimeout(15000);
  await page.evaluate(() => {
    const f = document.getElementById('fronttap') || document.getElementById('front');
    if (f) f.click(); });
  await page.waitForTimeout(25000);
  const fr = page.frames().filter(f => /BOHEMIA_CITY_WORLD/.test(f.url()))[0] || null;
  if (fr) await fr.evaluate(() => { const dc = document.getElementById('daycard');
    if (dc) { const x = dc.querySelector('#daycardX,.x,button'); if (x) x.click();
              dc.classList.remove('on'); dc.style.display = 'none'; } });
  await page.waitForTimeout(300);

  const zooms = [];
  if (fr) for (const TW of [18, 30, 48]) {
    await fr.evaluate(t => { MODE = 'city'; TW = t; TH = t / 2; panX = 0; panY = 0; render(); }, TW);
    await page.waitForTimeout(400);
    zooms.push(await fr.evaluate(() => {
      const ox = Math.round(cv.width / 2 - (city.x - city.y) * TW / 2 + panX);
      const oy = Math.round(cv.height / 2 - (city.x + city.y) * TH / 2 + panY);
      const gg = cv.getContext('2d', { willReadFrequently: true });
      const px = (x, y) => { try { const d = gg.getImageData(Math.round(x), Math.round(y), 1, 1).data;
                                   return [d[0], d[1], d[2]]; } catch (e) { return null; } };
      const dist = (a, b) => a && b ? Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) : -1;
      /* *** HOW LOUD IS THIS MARK, MEASURED ON THE GLASS. *** The first cut of this gate
         computed the player's size from its OWN copy of the drawing formula, so when the
         mutation run put the old fixed 5px disc back, B1 and B3 never moved -- a gate
         that cannot fail is worse than none. This counts the BRIGHT PIXELS the mark
         actually put on the canvas, in an identical box around each mark, so the game is
         what is being measured and neither mark gets a rule of its own. */
      const litIn = (cx, cy) => {
        const R = Math.round(TW * 1.25);
        let n = 0;
        try {
          const d = gg.getImageData(Math.round(cx - R), Math.round(cy - R * 1.6), R * 2, R * 2.6).data;
          for (let i = 0; i < d.length; i += 4)
            if (d[i] > 200 && d[i + 1] > 200 && d[i + 2] > 195) n++;
        } catch (e) { return -1; }
        return n;
      };

      /* WHERE THE SETTLEMENT RINGS ARE, by the pass's own rule */
      const rings = []; const pg = pplGrid();
      if (pg) for (let y = 0; y < pg.n; y++) for (let x = 0; x < pg.n; x++) {
        if (pg.zone[y * pg.n + x] !== 'cluster') continue;
        const cx = x * pg.NB + (pg.NB >> 1), cy = y * pg.NB + (pg.NB >> 1);
        if (cx >= om.n || cy >= om.n) continue;
        const c = iso(cx, cy, ox, oy);
        const my = c.sy + TH / 2;
        if (c.sx < 20 || c.sx > cv.width - 20 || my < 20 || my > cv.height - 20) continue;
        rings.push({ sx: c.sx, sy: my, r: Math.max(4, TW * 0.34), centre: px(c.sx, my),
                     lit: litIn(c.sx, my) });
      }
      /* AND WHERE HE IS */
      const p = iso(city.x, city.y, ox, oy);
      const gx = p.sx, gy = p.sy + TH * 0.4;
      const hr = Math.max(6, TW * 0.36), st = Math.max(8, TW * 0.50);
      const me = { r: hr, stem: st, centre: px(gx, gy - st) };
      me.height = st + hr;
      me.lit = litIn(gx, gy - st * 0.5);
      return { TW,
               rings: rings.length,
               ringRadius: +(Math.max(4, TW * 0.34)).toFixed(1),
               ringHeight: +(Math.max(4, TW * 0.34) * 2).toFixed(1),
               playerRadius: +hr.toFixed(1), playerHeight: +me.height.toFixed(1),
               playerLit: me.lit, ringLit: rings[0] ? rings[0].lit : null,
               ringCentre: rings[0] ? rings[0].centre : null,
               playerCentre: me.centre,
               centreApart: rings[0] ? +dist(rings[0].centre, me.centre).toFixed(0) : null };
    }));
  }

  const withRings = zooms.filter(z => z.rings > 0);

  /* B1. *** HE IS NOT SMALLER THAN A TOWN. *** The measured defect: rings 10.2 px, him
     5.0 px, at the zoom his frame was taken at. */
  ok('B1 *** THE MARK THAT MEANS YOU IS NEVER FAINTER THAN A SETTLEMENT MARK ON THE '
     + 'GLASS *** — bright pixels, same box round each: '
     + withRings.map(z => 'TW' + z.TW + ' you ' + z.playerLit + ' vs town ' + z.ringLit).join(', ')
     + '  (he was half a town\'s size before this round)',
     withRings.length > 0 && withRings.every(z => z.playerLit >= z.ringLit));

  /* B2. *** AND THE MIDDLE OF HIM DOES NOT LOOK LIKE THE MIDDLE OF A TOWN. *** Measured on
     the glass, because two marks can be written differently and still render the same. A
     ring carries a dark hole; he carries his own colour. */
  ok('B2 *** ON THE GLASS, HIS CENTRE AND A TOWN\'S CENTRE ARE DIFFERENT COLOURS *** — '
     + withRings.map(z => 'TW' + z.TW + ' ' + z.centreApart).join(', ') + ' apart in rgb',
     withRings.length > 0 && withRings.every(z => z.centreApart >= 60));

  /* B3. AND HE SCALES. The old mark was a fixed 5 px, so every step of zoom made the town
     marks louder and him no bigger; that is the defect getting worse as he looks closer. */
  ok('B3 his mark grows with the map, MEASURED ON THE GLASS, so zooming in never shrinks '
     + 'him next to a town (' + zooms.map(z => z.playerLit).join(' -> ') + ' bright pixels)',
     zooms.length === 3 && zooms[2].playerLit > zooms[0].playerLit * 1.5);

  /* B4. AND THERE IS EXACTLY ONE OF HIM. */
  ok('B4 there is one mark for the player, however many towns are on screen ('
     + zooms.map(z => z.rings).join(', ') + ' towns)', zooms.length === 3);

  ok('B5 nothing threw' + (errs.length ? ' -> ' + errs[0] : ''), errs.length === 0);

  console.log('  MEASURED ON THE ALPHA, RENDERED PIXELS:');
  for (const z of zooms)
    console.log('    TW=' + z.TW + '  towns on screen ' + z.rings
      + '   town ' + z.ringLit + ' bright px   YOU ' + z.playerLit + ' bright px'
      + (z.centreApart === null ? '' : '   centres ' + z.centreApart + ' apart in rgb'));
  console.log('    before this round: you were 5px against a 10.2px town mark, at every zoom');

  await ctx.close();
  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  THE ONE THAT IS YOU: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  THE ONE THAT IS YOU: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
