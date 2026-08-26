/* BOHEMIA MATERIAL PEEK (8/25, WORLD lane) -- photograph ANY tile in the valley, on demand.
 *
 * WHY THIS EXISTS. Adobe shipped UNVERIFIED and then got pulled back out, because I could not
 * take a picture of the fort. I hand-rolled a throwaway probe, it warped the camera and the
 * world did not move with it, the shot came back showing a suburb, and rather than ship a
 * material I had not looked at I dropped the material. THE MISSING TOOL COST THE FEATURE.
 *
 * bohemia_look_shots.js could always have taken that picture -- it is the tool that photographs
 * the city and it has worked all along -- but every one of its shots is a MANIFEST ENTRY, a
 * titled thing in the LOOK tab that Paolo opens. There was no way to just LOOK at something
 * while working on it, so the answer each time was to write another throwaway probe and get it
 * wrong. This is that missing half: same page, same camera, no manifest, no tab, no ceremony.
 *
 * WHAT THE THROWAWAY PROBES KEPT GETTING WRONG, all three of them:
 *   1. THE ZOOM IS `HC`, not setZoomAt(). Calling setZoomAt threw into a swallowed catch and
 *      left the camera wherever it was.
 *   2. THE CAMERA CENTRES ON THE PLAYER, so centring on the subject puts the body on top of it.
 *      Stand a few tiles off (look_shots learned this the same way).
 *   3. THE CHROME IS DOM ON TOP OF THE CANVAS. A screenshot without hiding it gets a d-pad
 *      across the art, or -- the first time -- the whole day-one wake card over the frame,
 *      which is the "money shot rendered UNDER a modal" failure the gates file already warns
 *      about.
 *
 * AND IT PROVES ITSELF BEFORE IT IS BELIEVED. `--selftest` photographs the dam wall, whose
 * answer is already known and already in the LOOK tab, and reports the district the camera
 * actually landed in. An instrument that has not been shown to give a right answer on a known
 * case is not evidence -- that rule has been earned about a dozen times in this repo, and the
 * probe that lost adobe is the most recent.
 *
 * REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks nothing and opens no bank. It drives
 * slices/BOHEMIA_CITY_WORLD.html, the same file the alpha opens and the same file look_shots
 * photographs, and screenshots the canvas the game drew. Every camera and chrome step is the
 * one bohemia_look_shots.js already proved; this only removes the manifest.
 *
 *   node tools/bohemia_material_peek.js --district dam --code 2 [--zoom 22] [--out x.png]
 *   node tools/bohemia_material_peek.js --material concrete        (first tile that routes)
 *   node tools/bohemia_material_peek.js --selftest
 */
'use strict';
const path = require('path');
const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ROOT = path.dirname(__dirname);
const arg = (k, d) => {
  const i = process.argv.indexOf('--' + k);
  return i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')
    ? process.argv[i + 1] : d;
};
const SELFTEST = process.argv.includes('--selftest');
const DIST = arg('district', SELFTEST ? 'dam' : null);
const CODE = arg('code', SELFTEST ? '2' : null);
const MATERIAL = arg('material', null);
const ZOOM = Number(arg('zoom', 22));
const OUT = arg('out', path.join(ROOT, 'records', 'target', 'PEEK.png'));
const STAND_OFF = 5;          /* the camera centres on the player; step off the subject */

if (!MATERIAL && (!DIST || CODE === null)) {
  console.log('usage: --district <name> --code <n>   |   --material <sTex>   |   --selftest');
  process.exit(2);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  let pageErr = null;
  page.on('pageerror', e => { pageErr = pageErr || String(e).slice(0, 200); });
  await page.goto('file://' + path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), { waitUntil: 'load' });
  await page.waitForFunction(() => typeof render === 'function', null, { timeout: 120000 });

  /* FIND AN INSTANCE IN THE BUILT VALLEY, and say so if there is not one. A picture of the
     wrong place is worse than no picture: it reads as "the feature does not work". */
  const spot = await page.evaluate(({ d, c, mat }) => {
    const want = c === null ? null : Number(c);
    for (let ty = 2; ty < om.n - 2; ty++) for (let tx = 2; tx < om.n - 2; tx++) {
      const t = om.at(tx, ty); if (!t) continue;
      if (d && t.district !== d) continue;
      let m; try { m = tileMeta(tx, ty); } catch (e) { continue; }
      const grid = m && (m.kit || m.sub); if (!grid) continue;
      /* SEARCH THE WHOLE PLOT, NOT AN INSET OF IT. The first cut looked at 12..FN-12 to keep
         the camera off the cell seam, and it reported MISS for substation:12 -- because a
         PERIMETER FENCE lives on the perimeter, rows 7 and H-8, which the inset threw away.
         An instrument that cannot see the edge of a plot cannot photograph a fence, a wall, a
         sound wall or a gate: most of the boundary vocabulary of the game. It failed LOUDLY,
         which is the only reason this was a two-minute fix and not a wrong picture. */
      for (let ly = 2; ly < FN - 2; ly++) for (let lx = 2; lx < FN - 2; lx++) {
        if (want !== null && grid[ly * FN + lx] !== want) continue;
        if (mat) {
          const cell = realizeCell(tx * FN + lx, ty * FN + ly);
          if (!cell || cell.sTex !== mat) continue;
        }
        return { hx: tx * FN + lx, hy: ty * FN + ly, district: t.district,
                 code: grid[ly * FN + lx] };
      }
    }
    return null;
  }, { d: DIST, c: CODE, mat: MATERIAL });

  if (!spot) {
    console.log('MISS: no instance of ' + (MATERIAL ? ('material ' + MATERIAL)
                : (DIST + ':' + CODE)) + ' in the built valley');
    await browser.close(); process.exit(1);
  }

  const landed = await page.evaluate(({ s, z, off }) => {
    hx = s.hx; hy = s.hy - off;
    if (typeof HC !== 'undefined' && z) HC = z;      /* THE ZOOM IS HC. Not setZoomAt. */
    /* HIDE EVERYTHING THAT IS NOT THE CANVAS, by asking what OVERLAYS it rather than naming
       today's element ids -- a blocklist of ids goes stale the moment a lane adds a button. */
    const cv = document.getElementById('cv');
    for (const el of document.body.querySelectorAll('*')) {
      if (el === cv || el.contains(cv)) continue;
      const cs = getComputedStyle(el);
      if (cs.position !== 'absolute' && cs.position !== 'fixed') continue;
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      el.style.visibility = 'hidden';
    }
    render();
    /* REPORT WHERE THE CAMERA ACTUALLY IS, not where it was asked to go. Every throwaway probe
       that lied about this lied because nobody made it say. */
    const t = om.at((hx / FN) | 0, (hy / FN) | 0);
    return { hx, hy, HC: typeof HC !== 'undefined' ? HC : null, district: t && t.district };
  }, { s: spot, z: ZOOM, off: STAND_OFF });

  await page.waitForTimeout(1300);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await page.screenshot({ path: OUT });
  await browser.close();

  console.log('PEEK ' + (MATERIAL ? ('material=' + MATERIAL) : (spot.district + ':' + spot.code)) +
              '  subject at ' + spot.hx + ',' + spot.hy +
              '  camera in ' + landed.district + ' at ' + landed.hx + ',' + landed.hy +
              '  zoom ' + landed.HC);
  console.log('  -> ' + OUT + (pageErr ? '   PAGE ERROR: ' + pageErr : ''));
  if (landed.district !== spot.district) {
    console.log('  WARNING: the camera landed in a DIFFERENT district from the subject. The ' +
                'stand-off crossed a cell boundary; re-run with a smaller --zoom or expect the ' +
                'subject near the frame edge.');
  }
  if (SELFTEST) {
    const ok = landed.district === 'dam' && !pageErr;
    console.log('SELFTEST: ' + (ok ? 'PASS' : 'FAIL') +
                ' -- the camera reached the dam wall, the case whose answer is already known.');
    process.exit(ok ? 0 : 1);
  }
})();
