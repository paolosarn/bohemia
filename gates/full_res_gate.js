/* ============================================================================
   FULL RES GATE (8/1/26) -- HIS ART REACHES THE GLASS AT THE SIZE HE DREW IT.

   Paolo, three times: "WHY IS THE PIXEL QUALITY NOT AT FULL BRO WTF" /
   "when I say pixel quality, I mean of the terrain of the ground of the houses".

   THE BUG THIS LOCKS OUT. The ground was baked into chunk textures at TPX=22
   while his approved street tiles are 44x44, so every tile was decimated 2:1
   before it was ever composited. Zooming in did not help, because the zoom stops
   multiplied an ALREADY-HALVED bake. Measured on the surface he plays:

       before   44x44 art  ->  22x22 blit      (half of every pixel discarded)
       after    44x44 art  ->  44x44 blit      (1:1, nothing discarded)

   WHY THIS GATE DRIVES A REAL BROWSER AND COUNTS DRAWS. Three separate attempts
   at this complaint were placebos that all passed a source-reading check:
     - devicePixelRatio on the run slice, which he never opens
     - devicePixelRatio on the city, identical pixels at 9x the memory
     - imageSmoothingEnabled, already set false in three render paths
   Every one of them "looked right" in the source. The only thing that could have
   told them apart is what SIZE the art is when it lands. So this gate wraps
   drawImage on the real world canvas and measures source-vs-destination. A
   constant can be read; a blit ratio has to be earned.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };

function requirePlaywright() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}
/* WHERE the city app lives and WHAT SHAPE it is in are not this gate's business
   (8/4). The payload-wall pass moved it out of the alpha on 8/2 and stopped
   base64-ing it, and this gate went red about a city that was fine. One resolver
   knows: gates/bohemia_city_app.js. The `alpha` argument is ignored, kept only so
   the call sites below read exactly as they did. */
const CITY_APP = require('./bohemia_city_app.js');
function cityBlob(_alpha) { const a = CITY_APP.read(); return a ? a.src : null; }

(async () => {
  const alpha = fs.readFileSync(ALPHA, 'utf8');
  const city = cityBlob(alpha);
  ok('the alpha carries a readable CITY blob', !!city && city.length > 100000);

  /* ---- the bake resolution must EQUAL his art, derived from the art itself --- */
  let artSize = null;
  if (city) {
    const sa = city.match(/const SA_TILES=(\{[\s\S]*?\});/);
    if (sa) {
      let tiles = null; try { tiles = JSON.parse(sa[1]); } catch (e) {}
      if (tiles) {
        const sizes = new Set();
        for (const pool of ['street', 'side'])
          for (const t of (tiles[pool] || []).slice(0, 4)) {
            const b = Buffer.from(t, 'base64');
            sizes.add(b.readUInt32BE(16) + 'x' + b.readUInt32BE(20));
          }
        ok('his approved street art is one size (' + [...sizes].join(',') + ')', sizes.size === 1);
        artSize = [...sizes][0] ? parseInt([...sizes][0], 10) : null;
      }
    }
    const tpx = city.match(/const TPX=(\d+)/);
    ok('the city declares a bake resolution', !!tpx);
    if (tpx && artSize)
      ok('THE BAKE EQUALS HIS ART (TPX ' + tpx[1] + ' == art ' + artSize + 'px) -- '
         + 'anything less throws his pixels away before compositing',
         parseInt(tpx[1], 10) === artSize);
    /* the memory this costs must stay declared and sane */
    const cap = city.match(/const CVCAP=(\d+)/);
    if (cap && tpx) {
      const mb = (parseInt(cap[1], 10) * Math.pow(16 * parseInt(tpx[1], 10), 2) * 4) / 1048576;
      ok('the chunk budget stays under the iOS floor this file names (' + mb.toFixed(1)
         + ' MB < 224)', mb < 224);
    }
  }

  /* ---- footsteps sit under the music (Paolo 8/1) --------------------------- */
  const gain = alpha.match(/var STEP_GAIN = ([\d.]+)/);
  ok('footsteps have their own level, not the music master', !!gain);
  if (gain) ok('and it is A LOT quieter than the music (' + gain[1] + ' <= 0.25)',
               parseFloat(gain[1]) <= 0.25);
  ok('his approved sound vectors are NOT edited to do it (a bus, not a re-cook)',
     /STEP_BUS\.gain\.value = STEP_GAIN/.test(alpha));

  /* ---- AND THE PIXELS ACTUALLY LAND 1:1, MEASURED IN A BROWSER ------------- */
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
    await page.goto('file://' + ALPHA);
    await page.waitForTimeout(3000);
    /* ELEMENT CLICKS, NOT COORDINATES. The splash is dismissed by its own
       element and the world is opened from the RUN tab -- the CITY tab is hidden
       in the shipped alpha, so a gate that navigates by clicking `.tab[data-p=
       "city"]` waits forever on an unclickable element. That is what the RUN tab
       mapping to the city panel means in practice. */
    await page.evaluate(() => { const fr = document.getElementById('front'); if (fr) fr.click(); });
    await page.waitForTimeout(2000);
    const opened = await page.evaluate(() => {
      const t = document.querySelector('[data-p="run"]'); if (!t) return false; t.click(); return true;
    });
    ok('the RUN tab exists and opens', opened);

    let f = null;
    for (let i = 0; i < 14; i++) {
      await page.waitForTimeout(3000);
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
      await f.evaluate(() => { const b = document.getElementById('mode');
        if (typeof MODE !== 'undefined' && MODE !== 'human' && b) b.click(); });
      await page.waitForTimeout(3000);
      const r = await f.evaluate(() => {
        const c = document.getElementById('cv'), ctx = c.getContext('2d');
        const seen = new Map(); const orig = ctx.drawImage.bind(ctx);
        ctx.drawImage = function (img, ...a) {
          try {
            const sw = img.width || img.naturalWidth, sh = img.height || img.naturalHeight;
            let dw, dh;
            if (a.length >= 8) { dw = a[6]; dh = a[7]; }
            else if (a.length >= 4) { dw = a[2]; dh = a[3]; } else { dw = sw; dh = sh; }
            if (sw > 8 && sh > 8) {
              const k = sw + 'x' + sh + '->' + Math.round(dw) + 'x' + Math.round(dh);
              seen.set(k, (seen.get(k) || 0) + 1);
            }
          } catch (e) {}
          return orig(img, ...a);
        };
        try { render(); } catch (e) {}
        ctx.drawImage = orig;
        const draws = [...seen.entries()].sort((x, y) => y[1] - x[1]);
        const total = draws.reduce((a, d) => a + d[1], 0);
        const scaled = draws.filter(d => {
          const m = d[0].match(/^(\d+)x(\d+)->(\d+)x(\d+)$/);
          return m && (m[1] !== m[3] || m[2] !== m[4]);
        });
        return { mode: typeof MODE !== 'undefined' ? MODE : '?', total,
                 top: draws.slice(0, 4), scaledPct: total ? 100 * scaled.reduce((a, d) => a + d[1], 0) / total : 0,
                 worst: scaled.slice(0, 3) };
      });
      ok('the probe is measuring the WALKED world, not the overview', r.mode === 'human');
      ok('the world actually drew something (' + r.total + ' image draws)', r.total > 10);
      ok('HIS ART LANDS 1:1 -- no world draw is resampled ('
         + r.scaledPct.toFixed(1) + '% scaled'
         + (r.worst.length ? ', worst: ' + r.worst.map(w => w[0]).join(' ') : '') + ')',
         r.scaledPct === 0);
      if (r.top.length) console.log('   top draws: ' + r.top.map(t => t[0] + ' x' + t[1]).join(' | '));
    }
  } finally { await browser.close(); }

  console.log('FULL RES GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('FULL RES GATE CRASHED: ' + e.message); process.exit(1); });
