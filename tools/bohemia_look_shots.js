/* BOHEMIA LOOK SHOTS (8/8/26) — TAKE THE PICTURE, SO HE NEVER HAS TO GO FIND IT.
 *
 * Paolo 8/8, LOCKED (laws/BOHEMIA_ADDENDUM_SHOW_ME_PICTURES_IN_A_TAB_8_8_26.md):
 *   "don't say play the run so I can see the art assets and what's wrong ...
 *    show me pictures put it in one of the tabs ... I can't be exploring and
 *    hunting your new additions ... just give me pictures and put it in a tab"
 *
 * The valley is 84.9 km2. Asking the director to walk it until he bumps into a
 * change is asking him to do a search the machine can do in seconds. So this does
 * the search: for every SUBJECT it opens the REAL page in a real browser at iPhone
 * portrait, hunts the live world for an actual instance, frames the camera ON it,
 * and photographs what he would see.
 *
 * VERIFY ON THE REAL SURFACE (7/18) is the whole design. Nothing here mocks a
 * scene or draws its own preview -- it drives slices/BOHEMIA_CITY_WORLD.html, the
 * same file the alpha opens, and screenshots the canvas the game drew into. A
 * picture from a side-door probe is the same lie as a verdict from one.
 *
 * A SUBJECT MUST FIND ITS OWN INSTANCE OR FAIL LOUDLY. `find` returns a world
 * position or null; a null is reported as a MISS and no file is written, because
 * a picture of the wrong place is worse than no picture -- it would tell him the
 * feature looks like empty asphalt.
 *
 *   node tools/bohemia_look_shots.js [--only <id>]
 *     -> slices/look/<id>.png   +   records/BOHEMIA_LOOK_MANIFEST.json
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ROOT = path.join(__dirname, '..');
const OUTDIR = path.join(ROOT, 'slices', 'look');
const MANIFEST = path.join(ROOT, 'records', 'BOHEMIA_LOOK_MANIFEST.json');
const ONLY = (process.argv.includes('--only') && process.argv[process.argv.indexOf('--only') + 1]) || null;
const STAMP = process.env.BOHEMIA_LOOK_STAMP || '8/8/26';

/* ---------------------------------------------------------------------------
 * THE SUBJECTS. One row per thing Paolo should be able to LOOK at.
 * `find` runs inside the page and returns {hx, hy, zoom} or null.
 * `caption` is plain English and MUST name the tab (NAME THE TAB, 7/28).
 * ------------------------------------------------------------------------- */
const SUBJECTS = [
  {
    id: 'vista',
    title: 'THE VISTA: the mountain overlook',
    caption: 'THE DEMO MONEY SHOT. Stand on the west rim and the whole valley is laid out below you, drawn by the valley view that already existed. RUN tab, on reaching the overlook.',
    open: `(() => { if (!window.__VISTA) return null; return window.__VISTA.open() ? {vista:true} : null; })()`,
  },
  {
    id: 'dead-suburb',
    title: 'THE DEAD: a suburban street',
    caption: 'Bones lying in the open on a suburb street, bleached and scattered by ten years of scavengers. RUN tab.',
    find: `(() => {
      for (let ty = 26; ty < 74; ty++) for (let tx = 26; tx < 74; tx++) {
        const t = om.at(tx, ty); if (!t || t.district !== 'suburb') continue;
        tileMeta(tx, ty); const e = deadForCell(tx, ty); const o = e.list.filter(z => !z.interior);
        if (o.length >= 3) return { hx: tx*FN + o[0].x, hy: ty*FN + o[0].y, zoom: 44 };
      } return null; })()`,
  },
  {
    id: 'dead-road',
    title: 'THE DEAD: the road out',
    caption: 'The exodus road. Remains on the asphalt where people stopped walking. RUN tab.',
    find: `(() => {
      for (let ty = 24; ty < 76; ty++) for (let tx = 24; tx < 76; tx++) {
        const t = om.at(tx, ty); if (!t || (t.district !== 'freeway' && t.district !== 'arterial')) continue;
        tileMeta(tx, ty); const e = deadForCell(tx, ty); const o = e.list.filter(z => !z.interior);
        if (o.length >= 3) return { hx: tx*FN + o[0].x, hy: ty*FN + o[0].y, zoom: 44 };
      } return null; })()`,
  },
  {
    id: 'dead-desert',
    title: 'THE DEAD: the walk-out',
    caption: 'Open desert. The ones who walked out and did not make it, thin and scattered, no mummified bodies because nothing out here is sealed. RUN tab.',
    find: `(() => {
      for (let ty = 20; ty < 80; ty++) for (let tx = 20; tx < 80; tx++) {
        const t = om.at(tx, ty); if (!t || t.district !== 'desert') continue;
        tileMeta(tx, ty); const e = deadForCell(tx, ty); const o = e.list.filter(z => !z.interior);
        if (o.length >= 2) return { hx: tx*FN + o[0].x, hy: ty*FN + o[0].y, zoom: 44 };
      } return null; })()`,
  },
  {
    id: 'dead-pit',
    title: 'THE PIT: the cemetery',
    caption: 'They stopped digging graves and dug one hole. The cemetery is a dumping pit now, about 34 bodies in a single heap. RUN tab.',
    /* SCAN THE WHOLE MAP, NOT A COMFORTABLE MIDDLE. Measured 8/11: this seed puts
       exactly three cemetery cells on the board -- (40,17), (57,67), (58,67) -- and
       the old 20..80 window could not see the first one. A rare district needs the
       full 96, or the tool reports "no instance in the live world" about a world
       that has one. */
    find: `(() => {
      for (let ty = 0; ty < 96; ty++) for (let tx = 0; tx < 96; tx++) {
        const t = om.at(tx, ty); if (!t || t.district !== 'cemetery') continue;
        tileMeta(tx, ty); const e = deadForCell(tx, ty); const o = e.list.filter(z => !z.interior);
        if (o.length >= 10) return { hx: tx*FN + o[0].x, hy: ty*FN + o[0].y, zoom: 30 };
      } return null; })()`,
  },
  {
    id: 'dead-cluster',
    title: 'A CLUSTER: they died together',
    caption: 'The dead come in groups now, not sprinkled one by one. This is what you find in an abandoned block. RUN tab.',
    find: `(() => {
      let best=null, bn=0;
      for (let ty = 26; ty < 74; ty++) for (let tx = 26; tx < 74; tx++) {
        tileMeta(tx, ty); const e = deadForCell(tx, ty); const o = e.list.filter(z => !z.interior);
        if (o.length > bn && o.length < 25) { bn = o.length; best = { tx, ty, d: o[0] }; }
      }
      if (!best) return null;
      return { hx: best.tx*FN + best.d.x, hy: best.ty*FN + best.d.y, zoom: 30 };
    })()`,
  },
  {
    id: 'dead-density',
    title: 'THE DEAD: how thick they lie',
    caption: 'A wider view of the same ground, so the density reads. Too many, too few, or about right is the only call needed. RUN tab.',
    find: `(() => {
      let best = null, bestN = 0;
      for (let ty = 26; ty < 74; ty++) for (let tx = 26; tx < 74; tx++) {
        tileMeta(tx, ty); const e = deadForCell(tx, ty); const o = e.list.filter(z => !z.interior);
        if (o.length > bestN) { bestN = o.length; best = { tx, ty, d: o[0] }; }
      }
      if (!best) return null;
      return { hx: best.tx*FN + best.d.x, hy: best.ty*FN + best.d.y, zoom: 22 };
    })()`,
  },
];

/* ------------------------------------------------------------------ helpers */
function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }

(async () => {
  ensureDir(OUTDIR);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  /* deviceScaleFactor 2, not 3. The shot has to live in the repository forever and
     a 3x phone frame is ~1.4 MB of PNG per picture. 2x is still sharp on his
     screen and roughly halves what every future commit carries. */
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await page.goto('file://' + path.resolve(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'),
    { waitUntil: 'load', timeout: 240000 });
  await page.waitForTimeout(7000);
  await page.evaluate(() => { try { if (typeof MODE !== 'undefined' && MODE === 'city') swapMode(); } catch (e) {} });
  await page.waitForTimeout(2500);

  const shots = [];
  for (const s of SUBJECTS) {
    if (ONLY && s.id !== ONLY) continue;
    /* A SUBJECT MAY OPEN ITSELF. The vista is a camera MOMENT, not a thing lying
       on the ground, so it has no world position to hunt for -- it has a trigger.
       Same contract either way: it either produces a real frame or it writes no
       picture and says why. */
    if (s.open) {
      let got = null, err = '';
      try { got = await page.evaluate(s.open); } catch (e) { err = ' — ' + String(e.message || e).split('\n')[0].slice(0, 120); }
      if (!got) { console.log('  MISS  ' + s.id.padEnd(16) + 'the moment did not open' + err); continue; }
      await page.waitForTimeout(1400);
      await page.evaluate(() => {
        window.__LOOK_HIDDEN = [];
        const cv = document.getElementById('cv');
        for (const el of document.body.querySelectorAll('*')) {
          if (el === cv || el.contains(cv)) continue;
          if (el.id === 'vistaCard' || el.closest('#vistaCard')) continue;   // the card IS part of the moment
          const cs = getComputedStyle(el);
          if (cs.position !== 'absolute' && cs.position !== 'fixed') continue;
          if (cs.display === 'none' || cs.visibility === 'hidden') continue;
          const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
          window.__LOOK_HIDDEN.push([el, el.style.visibility]); el.style.visibility = 'hidden';
        }
      });
      const file2 = path.join(OUTDIR, s.id + '.png');
      await page.screenshot({ path: file2 });
      await page.evaluate(() => {
        for (const [el, v] of (window.__LOOK_HIDDEN || [])) { try { el.style.visibility = v; } catch (e) {} }
        window.__LOOK_HIDDEN = [];
        try { window.__VISTA && window.__VISTA.close(); } catch (e) {}
      });
      const kb2 = fs.statSync(file2).size / 1024;
      shots.push({ id: s.id, title: s.title, caption: s.caption, file: 'look/' + s.id + '.png',
                   at: null, kb: +kb2.toFixed(1), stamp: STAMP });
      console.log('  SHOT  ' + s.id.padEnd(16) + kb2.toFixed(0).padStart(5) + ' KB   (a moment, not a place)');
      continue;
    }
    let spot = null, why = '';
    /* DO NOT SWALLOW THE REASON. The first run of this tool reported four clean
       MISSes and told me nothing, because the catch threw the error away -- the
       same swallow-the-failure bug this repo has now been bitten by four times.
       A miss must say WHY it missed. */
    try { spot = await page.evaluate(s.find); }
    catch (e) { why = ' — ' + String(e.message || e).split('\n')[0].slice(0, 120); }
    if (!spot) {
      /* A MISS IS REPORTED, NEVER PAPERED OVER. Writing a shot of wherever the
         camera happened to be would show him empty ground and read as "the
         feature does not work". */
      console.log('  MISS  ' + s.id.padEnd(16) + 'no instance found in the live world' + why);
      continue;
    }
    /* THE CAMERA CENTRES ON THE PLAYER, SO CENTRING ON THE SUBJECT PUTS THE
       PLAYER ON TOP OF IT. The clean-chrome shot still had the body underneath
       the character. Standing him a few tiles north lands the subject just below
       centre, in clear air, with nothing invented -- this is still the real
       surface, just photographed from a step away instead of from on top. */
    const STAND_OFF = 5;
    await page.evaluate(({ hxv, hyv, z }) => {
      hx = hxv; hy = hyv;
      if (typeof HC !== 'undefined' && z) HC = z;
      /* GET THE CHROME OFF THE ART. His words: "so I can see the art assets and
         what's wrong". The D-pad, the button row and the toast are DOM sitting ON
         TOP of the canvas, so screenshotting the canvas element still composites
         them over the picture -- the first shot of the dead had a thumb-stick
         covering a quarter of the frame. They are hidden for the photograph and
         restored straight after; the GAME is untouched, only the picture is
         clean. */
      /* NAMING THE OVERLAYS BY ID DOES NOT HOLD. The first pass hid #pad/#hud/
         #topbar and the shot still had the CITY button, the BIKE button and a
         toast sitting on the art -- a blocklist of today's element names goes
         stale the moment a lane adds a button, which is the same "ask for the
         property, never the spelling" lesson the wall gate cost. So: hide
         EVERYTHING that is not the canvas, by asking what overlays it. */
      window.__LOOK_HIDDEN = [];
      const cv = document.getElementById('cv');
      for (const el of document.body.querySelectorAll('*')) {
        if (el === cv || el.contains(cv)) continue;
        const cs = getComputedStyle(el);
        if (cs.position !== 'absolute' && cs.position !== 'fixed') continue;
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        window.__LOOK_HIDDEN.push([el, el.style.visibility]);
        el.style.visibility = 'hidden';
      }
      if (typeof render === 'function') render();
    }, { hxv: spot.hx, hyv: spot.hy - STAND_OFF, z: spot.zoom });
    await page.waitForTimeout(1100);

    /* Photograph the CANVAS, not the chrome. He is judging the art. */
    const el = await page.$('#cv');
    const file = path.join(OUTDIR, s.id + '.png');
    if (el) await el.screenshot({ path: file }); else await page.screenshot({ path: file });
    await page.evaluate(() => {
      for (const [el, v] of (window.__LOOK_HIDDEN || [])) { try { el.style.visibility = v; } catch (e) {} }
      window.__LOOK_HIDDEN = [];
    });
    const kb = fs.statSync(file).size / 1024;
    shots.push({ id: s.id, title: s.title, caption: s.caption, file: 'look/' + s.id + '.png',
                 at: { x: spot.hx, y: spot.hy, zoom: spot.zoom || null }, kb: +kb.toFixed(1), stamp: STAMP });
    console.log('  SHOT  ' + s.id.padEnd(16) + kb.toFixed(0).padStart(5) + ' KB   at ' + spot.hx + ',' + spot.hy);
  }

  await browser.close();
  if (errs.length) errs.slice(0, 3).forEach(e => console.log('  page error: ' + e));

  /* MERGE, never clobber: a run with --only must not delete the other subjects'
     entries, or the tab silently loses everything the last lane put in it. */
  let prev = [];
  if (fs.existsSync(MANIFEST)) { try { prev = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).shots || []; } catch (e) {} }
  const byId = {};
  for (const p of prev) byId[p.id] = p;
  for (const s of shots) byId[s.id] = s;
  const all = Object.values(byId);
  fs.writeFileSync(MANIFEST, JSON.stringify({ built: STAMP, shots: all }, null, 1));
  console.log('LOOK: ' + shots.length + ' picture(s) taken, ' + all.length + ' in the tab -> ' + MANIFEST);
  process.exit(shots.length ? 0 : 1);
})();
