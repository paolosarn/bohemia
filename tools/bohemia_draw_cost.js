#!/usr/bin/env node
/* ============================================================================
   WHAT ONE NEW THING COSTS TO DRAW  (9/7/26, COMBAT lane, VAMILY [draw budget])

   The row: "the fight loop is FULL (497 of 500 ms a beat, measured). Anything
   new that draws in the fight is designed and built, but SHIPS WITH ITS COST
   STATED IN MILLISECONDS PER BEAT, and does not enter the fight loop until there
   is room for it. Not an art freeze and not a stop: one rule, a number with
   every new thing that draws."

   THERE WAS NO WAY TO GET THAT NUMBER. The PLUMBER's beat profile answers "what
   does the whole beat cost" and names the systems inside it; nothing anywhere
   answers "what does THIS ONE THING cost", which is the number the rule demands
   from every lane before it ships a visual.

   WHY THIS DOES NOT REUSE THE DRIVEN-FIGHT PROFILE, and it is their own finding:
   the driven beat measured 347 to 497.5 ms across seven samples of ONE build,
   and what it depends on is how much the camera happened to move. A per-feature
   cost read off a spread that wide would be noise wearing a decimal point. So:

   1. THE CAMERA IS PINNED. Every draw in a run uses the same zoom, the same pan
      and the same focus, restored before each call, so both arms draw the same
      picture. This is the one thing the plumber measured as the whole cause of
      the spread.
   2. THE ARMS INTERLEAVE FRAME BY FRAME, never N of one then N of the other. A
      block of one setting followed by a block of the other measures whatever
      drifted in between -- which is exactly how one of my own checkers reported
      a working feature as doing nothing two rows ago.
   3. draw() IS CALLED DIRECTLY, the same function loop() calls, so this is the
      real frame and not a re-implementation of it.
   4. THE MEDIAN IS THE HEADLINE. One garbage collection inside a sample moves a
      mean and cannot move a median.

   THE UNIT. The row asks for MILLISECONDS PER BEAT. A beat at 120 BPM is 500 ms
   and the fight draws one frame per animation frame, so the conversion is
   frames-per-beat x the per-draw cost. 30 is used (60 fps), stated rather than
   hidden: the measured fight runs 41-56 fps, so 30 is the honest upper bound of
   how many times a new draw can be paid for inside one beat.

     node tools/bohemia_draw_cost.js                    # every feature in the ledger
     node tools/bohemia_draw_cost.js --only "beat ghost"
     node tools/bohemia_draw_cost.js --write            # update the ledger's numbers
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');
const LEDGER = path.join(__dirname, '..', 'engine', 'bohemia_draw_budget.json');

const FRAMES_PER_BEAT = 30;      /* 500 ms at 60 fps; the fight measures 41-56 */
const REPEATS = 40;              /* samples per arm, interleaved */
const WARMUP = 8;              /* a whole number of ABBA groups */
/* DRAWS INSIDE ONE SAMPLE. THE CLOCK IS THE LIMIT, NOT THE NOISE: Chromium
   clamps performance.now() to 0.1 ms on a page that is not cross-origin
   isolated, and one frame costs about 10 ms, so a single timed draw cannot see
   anything under 1% of a frame -- measured, and it put EVERY feature below the
   floor including one everybody can see on screen. Twelve draws in one timed
   block divides the tick by twelve, which is the whole trick. */
const DRAWS_PER_SAMPLE = 12;

const sleep = ms => new Promise(r => setTimeout(r, ms));

function med(a) { const b = a.slice().sort((x, y) => x - y); return b[b.length >> 1]; }
function round(n, d) { const p = Math.pow(10, d == null ? 4 : d); return Math.round(n * p) / p; }

/* ---- open the alpha, get into a real fight ------------------------------- */
async function openFight(page) {
  await page.goto('file://' + ALPHA);
  await sleep(9000);
  await page.mouse.click(215, 450); await sleep(2500);
  await page.mouse.click(215, 450); await sleep(2500);
  await page.click('[data-p="combat"]'); await sleep(7000);
  await page.mouse.click(215, 460); await sleep(5000);
  const fr = page.frames().find(f => { try { return f.name() === 'combatFrame'; } catch (e) { return false; } });
  if (!fr) throw new Error('no combat frame');
  /* THE BOSS DICE OFF and a plain fight, so two runs of this tool are comparing
     the same picture rather than two different rosters. */
  await fr.evaluate(() => { G.bossOff = true; G.bossPick = null; });
  return fr;
}

/* ---- the measurement ----------------------------------------------------- */
async function costOf(fr, feature) {
  return fr.evaluate(async (F) => {
    const on = new Function('G', F.on);
    const off = new Function('G', F.off);
    const isOn = new Function('G', 'return (' + F.read + ');');

    /* PIN THE CAMERA. The plumber measured this as the entire cause of the
       driven beat's 150 ms spread: the auto-frame eases 10% of the remaining
       distance every frame toward a target that is a function of where the
       enemies are, so it is never still while anybody is playing. Held at one
       value here, restored before every single draw, so both arms paint the
       same picture and the only difference left is the feature. */
    const camKeys = ['x', 'y', 'zoom'];
    const camWas = {}; camKeys.forEach(k => { camWas[k] = G.cam ? G.cam[k] : null; });
    const uzWas = G._uzE;
    const pin = () => {
      if (G.cam) camKeys.forEach(k => { if (camWas[k] != null) G.cam[k] = camWas[k]; });
      G._uzE = uzWas;
    };

    /* WHAT WAS ON THE BOARD WHEN THIS WAS TAKEN. A cost of zero can mean the
       feature is free or it can mean the feature was not there, and a reader who
       cannot tell the two apart is how a ceiling gets published as a result. */
    const state = { alive: (G.e || []).filter(e => e && !e.dead).length,
      men: (G.e || []).length, ally: !!G.ally, exit: !!(G.exit || G._exitKeep),
      phase: G.phase, over: !!G.over, arena: G.arenaKind };

    /* AND THE RASTER IS PAID FOR INSIDE THE SAMPLE. draw() only QUEUES canvas
       commands; the work happens later, so timing draw() alone reported 0.8 ms
       for a whole frame the plumber measured at ~14 ms and every feature came
       out free. One pixel read back forces the queue to flush, so the sample
       contains the drawing and not just the asking. Its own cost is the same in
       both arms, so it cancels out of the difference. */
    const flush = () => { try { ctx.getImageData(0, 0, 1, 1); } catch (e) {} };

    const was = isOn(G);
    const A = [], B = [];   /* A = feature on, B = feature off */
    const total = F.warmup + F.repeats * 2;
    for (let i = 0; i < total; i++) {
      /* ABBA, NOT ABAB. The first cut ran the ON arm first in every pair, and
         the CONTROL -- the same setting in both halves -- came back at +0.0333
         against its own +/-0.0234, which is a bias and not a cost: whatever the
         first draw after a flush pays, one arm was paying it every time. Four in
         a group, on-off-off-on, cancels both the first-position bias and any
         drift across the group. */
      const armOn = [true, false, false, true][i % 4];
      (armOn ? on : off)(G);
      pin();
      await new Promise(r => requestAnimationFrame(r));
      pin();
      const t0 = performance.now();
      /* TWELVE DRAWS, ONE FLUSH AT THE END OF THE BLOCK, and both halves of that
         were measured rather than chosen. NO FLUSH AT ALL times the ASKING and
         not the doing: a whole frame read 0.8 ms and every feature came out
         free. A FLUSH PER DRAW pays about 27 ms of pure GPU-to-CPU stall per
         call, which swamps the thing being measured and put every feature under
         the noise. One flush per block still forces all twelve draws' commands
         to execute -- canvas2d keeps a retained bitmap, so nothing is skipped --
         while the sync is paid once and divided by twelve. */
      for (let k = 0; k < F.perSample; k++) draw();
      flush();
      const dt = (performance.now() - t0) / F.perSample;
      if (i >= F.warmup) (armOn ? A : B).push(dt);
    }
    (was ? on : off)(G);
    pin();
    /* HOW FINE THE CLOCK ACTUALLY IS, measured rather than assumed: the smallest
       gap between two distinct readings. Chromium clamps performance.now() on a
       page that is not cross-origin isolated, and a tool that reports three
       decimals off a clock with one is lying in the last two. */
    const all = A.concat(B).slice().sort((x, y) => x - y);
    let tick = Infinity;
    for (let i = 1; i < all.length; i++) { const d = all[i] - all[i - 1]; if (d > 1e-9 && d < tick) tick = d; }
    return { on: A, off: B, restored: isOn(G) === was, state: state,
      tick: (tick === Infinity ? null : tick) };
  }, feature);
}

async function main() {
  const args = process.argv.slice(2);
  const only = (() => { const i = args.indexOf('--only'); return i >= 0 ? args[i + 1] : null; })();
  const write = args.includes('--write');

  const ledger = JSON.parse(fs.readFileSync(LEDGER, 'utf8'));
  const wanted = ledger.features.filter(f => !only || f.name === only);
  if (!wanted.length) { console.log('no such feature in the ledger: ' + only); process.exit(1); }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));

  let fr;
  try { fr = await openFight(page); }
  catch (e) { console.log('FAILED TO OPEN A FIGHT: ' + e.message); await browser.close(); process.exit(1); }

  console.log('=== WHAT ONE NEW THING COSTS TO DRAW ===');
  console.log('  a beat is 500 ms; ' + FRAMES_PER_BEAT + ' draws a beat (60 fps, an upper bound: the fight runs 41-56)');
  console.log('  ' + REPEATS + ' samples an arm of ' + DRAWS_PER_SAMPLE + ' draws each, interleaved, camera pinned\n');

  const out = []; let shownState = false; let floor = null;
  for (const f of wanted) {
    if (f.on == null || f.off == null || !f.read) { console.log('  ' + f.name + ': no toggle in the ledger, cannot be measured'); continue; }
    const r = await costOf(fr, { on: f.on, off: f.off, read: f.read, repeats: REPEATS, warmup: WARMUP, perSample: DRAWS_PER_SAMPLE });
    /* PAIRED, AND ITS OWN UNCERTAINTY COMES OUT OF THE SAME DATA. The arms are
       interleaved, so sample i of each arm sits next to the other in time: the
       difference of the pair cancels whatever the machine was doing. The spread
       of those differences is what this instrument cannot see through, and it is
       measured here rather than guessed from a separate control run -- the
       control read +/-0.0167 while a real feature swung 0.0417 the wrong way,
       which is a floor that was flattering itself. */
    const n = Math.min(r.on.length, r.off.length);
    const diffs = []; for (let i = 0; i < n; i++) diffs.push(r.on[i] - r.off[i]);
    const perDraw = med(diffs);
    const dev = diffs.map(d => Math.abs(d - perDraw));
    const err = 1.4826 * med(dev) / Math.sqrt(n);      /* robust standard error */
    const mOn = med(r.on), mOff = med(r.off);
    const perBeat = perDraw * FRAMES_PER_BEAT;
    /* *** THE FLOOR IS WHAT THE CONTROL ACTUALLY READS, AND IT IS NOT ZERO. ***
       Same setting in both arms, ABBA-counterbalanced, and it still comes back
       about 0.03 ms a draw out -- roughly one millisecond of every beat, which is
       the same size as the features being priced. Pretending that is zero would
       make this tool's own bias look like somebody's feature. So the floor is
       the worse of the control's reading and the spread of the paired
       differences, and everything under it is reported as under it. */
    if (f.control) { floor = Math.max(Math.abs(perDraw), 2 * err);
      console.log('  the clock ticks every ' + round(r.tick || 0)
        + ' ms across ' + DRAWS_PER_SAMPLE + ' draws a sample; THE FLOOR IS '
        + round(floor) + ' ms a draw (' + round(floor * FRAMES_PER_BEAT, 2) + ' ms a beat)'); }
    /* BELOW THE FLOOR IS NOT ZERO. The control arm above measured what this
       instrument reads when nothing changed; anything inside that is a number
       this tool cannot see, and saying "free" would be the lie. */
    const belowFloor = !f.control && Math.abs(perDraw) <= Math.max(2 * err, floor || 0);
    console.log('  ' + f.name.padEnd(28)
      + 'on ' + round(mOn) + ' ms   off ' + round(mOff) + ' ms   '
      + (f.control
          ? ('THE CONTROL READS ' + round(perDraw) + ' +/- ' + round(2 * err) + ' ms a draw, which is the zero this instrument sees')
          : belowFloor
            ? ('BELOW THE FLOOR: ' + round(perDraw) + ' +/- ' + round(2 * err) + ' ms a draw, too small for this instrument, NOT free')
            : ('THE COST: ' + round(perDraw) + ' +/- ' + round(2 * err) + ' ms a draw = ' + round(perBeat, 2) + ' MS A BEAT'))
      + (r.restored ? '' : '   [WARNING: the toggle did not restore]'));
    out.push({ name: f.name, perDraw: round(perDraw), perBeat: round(perBeat, 2),
      medOn: round(mOn), medOff: round(mOff), n: n, err: round(2 * err),
      errBeat: round(2 * err * FRAMES_PER_BEAT, 2), belowFloor: belowFloor,
      control: !!f.control, restored: r.restored });
    if (!shownState) { shownState = true;
      console.log('  measured on: ' + JSON.stringify(r.state) + '\n'); }
  }

  console.log('\n  page errors: ' + errs.length);
  if (errs.length) console.log('    ' + errs.slice(0, 3).join('\n    '));

  if (write) {
    const today = new Date().toISOString().slice(0, 10);
    for (const m of out) {
      const f = ledger.features.find(x => x.name === m.name);
      if (!f) continue;
      f.ms_per_beat = m.perBeat;
      f.ms_per_draw = m.perDraw;
      f.err_ms_per_beat = m.errBeat;
      /* BELOW THE FLOOR IS WRITTEN DOWN AS SUCH. A bare 0.25 in a ledger reads
         like a measurement; this one is smaller than the instrument's own zero,
         and a reader has to be able to tell those apart. */
      f.below_floor = m.belowFloor;
      f.measured = today;
    }
    ledger.measured = today;
    if (floor != null) { ledger.floor_ms_per_draw = round(floor);
      ledger.floor_ms_per_beat = round(floor * FRAMES_PER_BEAT, 2); }
    fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + '\n');
    console.log('  ledger updated: ' + path.relative(process.cwd(), LEDGER));
  }

  await browser.close();
}

main().catch(e => { console.log('THREW: ' + (e && e.stack || e)); process.exit(1); });
