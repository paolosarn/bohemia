/* ============================================================================
   MAP DENSITY GATE -- THE MAP IS DRAWN AT BATTLE BROTHERS' PIXELS OR IT IS RED
   (PLUMBER 9/28/26, row [density leg], rule 38a; this is the cook gate's map leg,
   in its own file because it needs a browser and COOK EVERY ROUND does not)

   PAOLO 9/28: "how many pixels the Battle Brothers map is and we need to have that
   exact same number at the bare minimum... that has to happen like now."
   THE FLOOR is DIRECTION's (records/BOHEMIA_BB_DENSITY_THE_MAP_FLOOR_9_28_26.md):
     1. one painted pixel per screen pixel at the default map zoom: the map canvas
        renders at the phone's own pixels (device pixel ratio);
     2. no flat-colour cells;
     3. mean flat-colour run <= 1.5 device px on both axes.

   IT LANDS RED ON PURPOSE. Measured 9/28 on both surfaces, twice, identical: the map
   canvas is 378 pixels wide and shown 1134 device pixels wide, so every painted pixel
   is a 3x3 block; one painted unit covers 3.6 x 3.5 device px at the opening zoom and
   8.0 x 7.3 at the far stop. That is under Paolo's floor, and a green gate here would
   be the lie. The fix is RUN's [bb map] and COOK's map art; this gate is the number
   they climb against, and the NEVER WORSE leg keeps anyone from sliding further while
   they do.

   *** WHY THE VERDICT READS THE CANVAS'S OWN PIXELS, NOT THE GLASS. *** Floor item 3
   as written is read off the screen, and the screen can be passed by BLUR: the browser
   smooths the 3x stretch, every device pixel differs from its neighbour by a shade, and
   the glass reads 1.15 x 1.11 on the opening view -- under the floor -- while the map
   paints a third of the pixels on each axis. Self-test S3 plants exactly that and shows
   the glass reading fooled. So the verdict is (the canvas's own mean run) x (device
   pixels each canvas pixel covers). The glass reading is printed beside it, labelled,
   so it stays comparable with DIRECTION's 9/24 frame (3.8 x 3.5, which the glass method
   reads 3.79 x 3.51 in S2: it is DIRECTION's own measure, read the same way).

   LEGS
     S1-S4 self-test: the pure measure (full detail reads 1, a 3x stretch reads 3, flat
           reads its width); DIRECTION's filed frame reads 3.79 x 3.51; a blurred 3x
           stretch fools the glass reading; the verdict passes a canvas at full
           resolution with full detail and fails one at a third.
     per surface (the demo and the alpha), at the zoom the map opens on:
       G0  the map canvas is found and its own pixels are readable (a canvas this
           cannot read would make every leg below measure nothing)
       G1  the map draws at the phone's own pixels (floor item 1)
       G2  one painted unit is at most 1.5 device px on both axes (floor item 3)
       R   NEVER WORSE, at the opening zoom AND the far stop: the painted unit may not
           grow past today's reading plus 5% (ceilings below)
     V     every VOTE item that declares floor:'map' and shows an image is drawn at the
           floor: own-pixel run <= 1.5 and at least Battle Brothers' 2,073,600 pixels
     OWED, printed every run: marker size (no Battle Brothers number exists yet: their
           screenshots are behind the blocked hosts); detail measured by frequency, which
           is what would catch small textures blown up WITH smoothing inside a
           full-resolution canvas (floor item 2).

   Mutation hook: BOHEMIA_DENSITY_CEILING_SCALE=0.5 halves the ceilings, and R must go
   red on both surfaces.
     node gates/map_density_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const M = require(path.join(ROOT, 'tools/bohemia_map_density.js'));

const FLOOR_RUN = 1.5;                 /* DIRECTION, floor item 3 */
const BB_MIN_PIXELS = 2073600;         /* DIRECTION, floor item 1: 1920 x 1080 */
/* Measured 9/28 (twice, identical), device px per painted unit:
     demo  opening 3.62 x 3.54   far 7.95 x 7.32
     alpha opening 3.46 x 3.38   far 7.97 x 7.26
   Ceiling = the worse surface + 5%. THESE MAY ONLY FALL: lower them when the map gets
   finer, and never raise them. */
const SCALE = +(process.env.BOHEMIA_DENSITY_CEILING_SCALE || 1);
const CEIL = { opening: [3.80 * SCALE, 3.72 * SCALE], far: [8.37 * SCALE, 7.69 * SCALE] };

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };
const f2 = M.fmt;

/* the verdict on one reading, kept pure so the self-test can hold it to known answers */
function verdict(m) {
  const c = m.canvas;
  const atDevice = !!c && c.w >= Math.round(c.cw * c.dpr) - 1 && c.h >= Math.round(c.ch * c.dpr) - 1;
  const fine = !!m.device && m.device[0] <= FLOOR_RUN && m.device[1] <= FLOOR_RUN;
  return { atDevice, fine };
}

(async () => {
  console.log('='.repeat(74));
  console.log('MAP DENSITY: the map at Battle Brothers\' pixels (Paolo 9/28, rule 38a)');
  console.log('='.repeat(74));

  /* ---- S1: the pure measure ---------------------------------------------- */
  const W = 60, H = 40;
  const rnd = new Uint8ClampedArray(W * H * 4);
  /* the HIGH bits of the generator: its low byte repeats every 256 steps, which read as
     flat runs and made 'full detail' measure 1.29 on the first cut of this test */
  let seed = 7; const r8 = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) >> 16) & 255;
  for (let i = 0; i < rnd.length; i++) rnd[i] = (i % 4 === 3) ? 255 : r8();
  const up = new Uint8ClampedArray(W * 3 * H * 3 * 4);
  for (let y = 0; y < H * 3; y++) for (let x = 0; x < W * 3; x++) for (let k = 0; k < 4; k++)
    up[(y * W * 3 + x) * 4 + k] = rnd[(((y / 3) | 0) * W + ((x / 3) | 0)) * 4 + k];
  const flat = new Uint8ClampedArray(10 * 10 * 4).fill(90);
  const a = M.runs(rnd, W, H), b = M.runs(up, W * 3, H * 3), c = M.runs(flat, 10, 10);
  ok('S1 the measure: full detail reads ~1 (' + f2(a) + '), a 3x stretch reads 3 (' + f2(b)
     + '), a flat block reads its width (' + f2(c) + ')',
     a[0] < 1.05 && a[1] < 1.05 && Math.abs(b[0] - 3) < 0.05 && Math.abs(b[1] - 3) < 0.05
     && c[0] === 10 && c[1] === 10);

  /* THE SELF-TESTS NEED A BROWSER, NOT THE GAME. The first cut booted the whole demo just
     to decode two test pictures: 344 s for the gate. A bare page does the same job. */
  const bare = await chromium.launch();
  const bctx = await bare.newContext();
  let d = null;
  try {
    /* ---- S2: DIRECTION's own frame, read the glass way ------------------- */
    const CAL = 'records/target/DIRECTION_THE_MAP_TODAY_9_24.png';
    const cal = await M.pngRuns(bctx, fs.readFileSync(path.join(ROOT, CAL)), 2);
    ok('S2 DIRECTION\'s filed frame reads ' + f2(cal.run) + ' (their record: 3.8 x 3.5), so the glass '
       + 'reading printed below is their measure', Math.abs(cal.run[0] - 3.79) < 0.06
       && Math.abs(cal.run[1] - 3.51) < 0.06, CAL + ' read ' + f2(cal.run));

    /* ---- S3: blur fools the glass reading -------------------------------- */
    const p = await bctx.newPage();
    const s3 = await p.evaluate(([src]) => {
      const R = eval('(' + src + ')');
      const s = document.createElement('canvas'); s.width = 126; s.height = 100;
      const g = s.getContext('2d'); const id = g.createImageData(126, 100);
      let q = 11; for (let i = 0; i < id.data.length; i++)
        id.data[i] = i % 4 === 3 ? 255 : ((q = (q * 1103515245 + 12345) & 0x7fffffff) >> 16) & 255;
      g.putImageData(id, 0, 0);
      const big = document.createElement('canvas'); big.width = 378; big.height = 300;
      const G = big.getContext('2d'); G.imageSmoothingEnabled = true; G.drawImage(s, 0, 0, 378, 300);
      return R(G.getImageData(0, 0, 378, 300).data, 378, 300, 0);
    }, [M.runs.toString()]);
    await p.close();
    ok('S3 a blurred 3x stretch FOOLS the glass reading (' + f2(s3) + ' when the truth is 3.0), which '
       + 'is why the verdict reads the canvas\'s own pixels', s3[0] < FLOOR_RUN && s3[1] < FLOOR_RUN,
       'read ' + f2(s3) + '; if blur no longer fools it, the reason for the own-pixel verdict should be re-measured');

    /* ---- S4: the verdict on known answers -------------------------------- */
    const good = verdict({ canvas: { w: 1134, h: 2490, cw: 378, ch: 830, dpr: 3 }, device: [1.02, 1.01] });
    const bad = verdict({ canvas: { w: 378, h: 830, cw: 378, ch: 830, dpr: 3 }, device: [3.62, 3.54] });
    ok('S4 the verdict passes a full-resolution, full-detail map and fails a third-resolution one',
       good.atDevice && good.fine && !bad.atDevice && !bad.fine);

    /* ---- the two surfaces ------------------------------------------------ */
    for (const which of ['demo', 'alpha']) {
      let r;
      try { r = await M.readSurface(open, which); }
      catch (e) { ok(which.toUpperCase() + ' G0 the map was reached and read', false, String(e).slice(0, 200)); continue; }
      const o = r.opening, fr = r.far, W_ = which.toUpperCase();
      console.log('  ' + M.line(which + ' opening zoom', o));
      console.log('  ' + M.line(which + ' far stop', fr));
      const readable = o.canvas && o.canvas.own && fr.canvas && fr.canvas.own;
      ok(W_ + ' G0 the map canvas is found and its own pixels are readable (' + (o.canvas ? '#' + o.canvas.id
         + ', ' + o.canvas.kind : 'none') + ')', !!readable,
         'a map this cannot read would make every leg below measure nothing; if the map moved to WebGL, '
         + 'this leg needs a readback before it can judge');
      if (!readable) continue;
      const v = verdict(o);
      ok(W_ + ' G1 the map draws at the phone\'s own pixels (canvas ' + o.canvas.w + 'x' + o.canvas.h
         + ', shown ' + Math.round(o.canvas.cw * o.canvas.dpr) + 'x' + Math.round(o.canvas.ch * o.canvas.dpr)
         + ' device px)', v.atDevice,
         'every painted pixel is shown ' + o.per.map(x => x.toFixed(1)).join(' x ') + ' device px. Floor item 1: '
         + 'the canvas renders at devicePixelRatio. Owner: RUN [bb map] (the map\'s drawing), COOK (its art).');
      ok(W_ + ' G2 one painted unit is at most ' + FLOOR_RUN + ' device px at the opening zoom (' + f2(o.device) + ')',
         v.fine, 'Battle Brothers paints one unit per screen pixel; this map paints one per '
         + (o.device[0] * o.device[1]).toFixed(1) + ' device px, ' + (100 / (o.device[0] * o.device[1])).toFixed(1)
         + '% of the phone\'s pixels. Floor items 2 and 3.');
      const under = (x, cap) => x[0] <= cap[0] && x[1] <= cap[1];
      ok(W_ + ' R  NEVER WORSE: opening ' + f2(o.device) + ' within ' + f2(CEIL.opening) + ', far stop '
         + f2(fr.device) + ' within ' + f2(CEIL.far), under(o.device, CEIL.opening) && under(fr.device, CEIL.far),
         'the map got COARSER than the 9/28 reading. The floor above is the target; this leg is the one that '
         + 'stops it sliding further while the floor is being climbed.');
      if (o.device[0] < CEIL.opening[0] / 1.05 * 0.9 || fr.device[0] < CEIL.far[0] / 1.05 * 0.9)
        console.log('  NOTE: ' + which + ' is more than 10% finer than the ceiling: lower CEIL in this gate to lock it in.');
    }

    /* ---- V: VOTE items that declare themselves map items ------------------ */
    const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
    const declared = (reg.items || []).filter(i => i.floor === 'map');
    if (!declared.length) {
      console.log('  NOTE: 0 VOTE items declare floor:\'map\', so the vote leg judged nothing this run (not a pass). '
        + 'A lane registering a map picture adds floor:\'map\' to its item and this leg holds it to the floor.');
    } else {
      for (const it of declared) {
        const src = it.show && it.show.src;
        if (!it.show || it.show.how !== 'image') {
          console.log('  OWED: ' + it.id + ' is a ' + (it.show && it.show.how) + ' item; only pictures are read so far');
          continue;
        }
        let rr = null; try { rr = await M.pngRuns(bctx, fs.readFileSync(path.join(ROOT, 'slices', src)), 2); } catch (e) {}
        ok('V ' + it.id + ' (' + it.lane + ') is drawn at the floor' + (rr ? ' (' + rr.w + 'x' + rr.h + ', run ' + f2(rr.run) + ')' : ''),
           !!rr && rr.run[0] <= FLOOR_RUN && rr.run[1] <= FLOOR_RUN && rr.w * rr.h >= BB_MIN_PIXELS,
           rr ? 'needs run <= ' + FLOOR_RUN + ' both axes and at least ' + BB_MIN_PIXELS + ' pixels' : 'slices/' + src + ' did not decode');
      }
    }
    console.log('  OWED: marker size (Battle Brothers\' banner and icon sizes need their screenshots, behind the blocked hosts); '
      + 'detail read by frequency (catches small textures blown up WITH smoothing inside a full-resolution canvas).');
  } finally { if (d) await d.close(); await bare.close(); }

  console.log('\n=== MAP DENSITY GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  if (fail) console.log('    Red on purpose while the map is under Paolo\'s floor (rule 38a). RUN [bb map] and COOK own the climb.');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('MAP DENSITY GATE CRASHED: ' + (e && e.stack || e)); process.exit(1); });
