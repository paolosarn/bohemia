const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   HOW WALKING FEELS, MEASURED IN THE PIXELS HE SEES (8/23/26, RUN lane)

   THE CLAIM THIS EXISTS TO REFUSE is "SLIDE is wired". Wired is what the last
   dozen bugs in this lane all were. The claim here is that the world he is
   looking at MOVES BETWEEN BEATS, and the only place that is true or false is
   the canvas.

   HOW IT IS MEASURED, and why it is not a grep and not a seam read. The gate
   holds the pad down and samples a rectangle of the STAGE CANVAS every ~40ms
   for a second, then takes the MEDIAN change between adjacent samples:

     SLIDE   the whole frame is shifting on nearly every frame, so most adjacent
             pairs differ over most of the rectangle. Median runs high.
     GRID    the world is nailed down between beats. A few things still move --
             the movers tween for 420ms, signals blink, people walk -- so the
             median is NOT zero and a gate that demanded zero would be lying
             about what a still frame of this game looks like. It is SMALL.

   THE MEDIAN IS THE POINT. A mean would be dragged up in GRID by the two frames
   that straddle a beat boundary, where the world really does jump a whole cell,
   and those are exactly the frames the feature exists to remove. The median asks
   what a TYPICAL frame looks like, which is what the eye integrates.

   THE RECTANGLE EXCLUDES THE BODY. The player is pinned to the centre of the
   screen and his legs cycle in both modes, so a rectangle containing him would
   report motion in GRID for a reason that has nothing to do with the world. The
   sample sits in the upper third, well above the sprite's head.

   IT PROVES ITS OWN EYES FIRST, because the FIRST BYTES gate learned that the
   hard way. Before comparing anything it asserts the two samples it takes while
   standing STILL are nearly identical and that the two it takes ACROSS a beat
   boundary in GRID are very different. If the instrument cannot see a 56-pixel
   jump it cannot be trusted to report a 3-pixel one, and every number below it
   would be noise wearing a verdict.

   MUTATION-TESTED TWICE, AND THE SECOND ONE IS WHY THE PIXELS ARE HERE.

     MUTANT 1  camCell never interpolates                    -> 5 claims red
     MUTANT 2  camCell interpolates PERFECTLY and the
               renderer goes back to reading hx,hy directly  -> 2 claims red

   Mutant 2 is this lane's most-found bug wearing its best disguise: a finished
   thing with a published seam and no caller. Under it EVERY MODEL CLAIM STAYED
   GREEN -- "the camera sat between cells for 87.5% of a walked beat" was still
   true, because the camera really was between cells, and nothing drew it there.
   The only checks that noticed were the two that look at the canvas. A gate
   built on the seam would have shipped a feature that does nothing and called
   it proved.

   AND IT CHECKS HE CAN CHANGE IT (8/12, HE MUST BE ABLE TO DIRECT IT). A chip
   he can tap, a label that tells the truth about which feel is live, and a
   choice that survives a reload. A feel he cannot switch is a feel he cannot
   judge.

   node gates/walk_feel_gate.js
   ========================================================================== */
const path = require('path');
const ROOT = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('\n=== WALK FEEL: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

/* 120 BPM LAW: BEAT=0.5s, so a press shorter than a beat lands nothing. This
   lane measured 220ms presses landing 8 of 14 steps once. */
const HOLD = 2600;          /* long enough to cover the whole sampling window */

/* ---------------------------------------------------------------------------
   THE INSTRUMENT, and it runs INSIDE the page on purpose: a playwright
   round-trip is tens of milliseconds and a beat is five hundred, so sampling
   from node would smear the very interval being measured.
   ------------------------------------------------------------------------- */
const SAMPLER = function (opts) {
  const cv = document.getElementById('cv') || document.querySelector('canvas');
  if (!cv) return { err: 'no canvas' };
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  /* upper third: world, never the body. The player is drawn with his feet at
     H/2 and stands about two cells tall, so his head is around H/2 - 2*C. */
  const rx = Math.max(0, (W * 0.10) | 0), rw = Math.max(8, (W * 0.80) | 0);
  const ry = Math.max(0, (H * 0.10) | 0), rh = Math.max(8, (H * 0.22) | 0);
  const snap = () => {
    const d = ctx.getImageData(rx, ry, rw, rh).data;
    const out = [];
    for (let i = 0; i < d.length; i += 4 * 7) out.push(d[i], d[i + 1], d[i + 2]);
    return out;
  };
  /* fraction of sampled channels that moved by more than a hair. The threshold
     is 8/255 so a compositor rounding difference is not counted as motion. */
  const diff = (a, b) => {
    let n = 0;
    const L = Math.min(a.length, b.length);
    for (let i = 0; i < L; i++) if (Math.abs(a[i] - b[i]) > 8) n++;
    return L ? n / L : 0;
  };
  const pad = document.querySelectorAll('#pad .pb')[opts.dir];
  return new Promise((resolve) => {
    const shots = [];
    if (pad && opts.hold)
      pad.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    const t0 = performance.now();
    const tick = () => {
      shots.push(snap());
      if (performance.now() - t0 < opts.ms) { setTimeout(tick, opts.every); return; }
      if (pad && opts.hold)
        pad.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      const ds = [];
      for (let i = 1; i < shots.length; i++) ds.push(diff(shots[i - 1], shots[i]));
      ds.sort((a, b) => a - b);
      resolve({
        n: ds.length,
        median: ds.length ? ds[ds.length >> 1] : 0,
        max: ds.length ? ds[ds.length - 1] : 0,
        min: ds.length ? ds[0] : 0,
        rect: [rx, ry, rw, rh],
      });
    };
    tick();
  });
};

const pct = (x) => (x * 100).toFixed(1) + '%';

(async () => {
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 4000);
    await page.click('#front').catch(() => { });
    await SETTLE(page, 30000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try { return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1); }
      catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up', !!city);
    if (!city) done();

    /* the shell raises the cold open over the stage; declining it is a real
       answer a player gives, and the walk has to survive it. */
    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1200);

    /* the day card sits over the stage on boot; get it out of the way the way a
       player does, by tapping GET UP. */
    await city.evaluate(() => {
      const g = document.querySelector('#daycardIn .dcgo') || document.querySelector('#daycardIn .dcbtn');
      if (g) g.click();
    });
    await SETTLE(page, 1800);

    /* ---- 1. THE SEAM ------------------------------------------------------ */
    const seam = await city.evaluate(() => {
      if (!window.__WALKFEEL) return null;
      return {
        mode: window.__WALKFEEL.mode(),
        feels: window.__WALKFEEL.feels(),
        cam: window.__WALKFEEL.cam(),
        gliding: window.__WALKFEEL.gliding(),
        chip: !!document.getElementById('walkfeel'),
        inDrawer: !!(document.getElementById('devtray') &&
                     document.getElementById('devtray').contains(document.getElementById('walkfeel'))),
        label: (document.getElementById('walkfeel') || {}).textContent || '',
      };
    });
    ok('the walk feel is a thing the page has', !!seam);
    if (!seam) done();
    ok('and it offers GRID and SLIDE ([' + seam.feels.join(', ') + '])',
      seam.feels.indexOf('GRID') >= 0 && seam.feels.indexOf('SLIDE') >= 0);
    ok('SLIDE IS WHAT HE GETS WITHOUT ASKING -- the default is the good one, not '
      + 'the one you have to find (' + seam.mode + ')', seam.mode === 'SLIDE');
    ok('standing still, the camera is on the true cell and nothing is gliding',
      seam.gliding === false);

    /* ---- 2. HE CAN CHANGE IT HIMSELF (8/12) -------------------------------- */
    ok('there is a chip for it, and it is in the BUILDER\'S DRAWER rather than the '
      + 'row his thumb reaches PHONE in (his 8/16 ruling)', seam.chip && seam.inDrawer);
    ok('and the chip says which feel is live ("' + seam.label.trim() + '")',
      /SLIDE/.test(seam.label));
    const flipped = await city.evaluate(() => {
      document.getElementById('walkfeel').click();
      return { mode: window.__WALKFEEL.mode(),
               label: document.getElementById('walkfeel').textContent,
               stored: (function () { try { return localStorage.getItem('BOH_WALKFEEL'); }
                                      catch (e) { return null; } })() };
    });
    ok('TAPPING IT REALLY CHANGES THE FEEL (' + flipped.mode + ')', flipped.mode === 'GRID');
    ok('and the label follows ("' + flipped.label.trim() + '")', /GRID/.test(flipped.label));
    ok('and the choice is remembered, so a reload does not undo him ('
      + flipped.stored + ')', flipped.stored === 'GRID');

    /* ---- 3. PROVE THE INSTRUMENT BEFORE TRUSTING IT ----------------------- */
    /* still, in GRID: the rectangle should be almost dead. If this is not small,
       nothing below means anything. */
    const stillGrid = await city.evaluate(SAMPLER, { dir: 4, hold: false, ms: 900, every: 40 });
    ok('THE INSTRUMENT CAN SEE STILLNESS: standing still, the sampled rectangle '
      + 'barely moves (median ' + pct(stillGrid.median) + ' of '
      + stillGrid.n + ' frame pairs)', stillGrid.median < 0.06);

    /* walking in GRID: the median stays low (still between beats) but the MAX is
       big, because a beat boundary really does move the whole world one cell.
       That max is the instrument proving it can see a jump. */
    const walkGrid = await city.evaluate(SAMPLER, { dir: 4, hold: true, ms: 1600, every: 40 });
    ok('AND IT CAN SEE A 56-PIXEL JUMP: walking in GRID, at least one frame pair '
      + 'changes most of the rectangle (max ' + pct(walkGrid.max) + ')',
      walkGrid.max > 0.35);

    /* ---- 4. THE ACTUAL CLAIM ---------------------------------------------- */
    ok('GRID IS WHAT IT SAYS IT IS -- the world is nailed down between beats and '
      + 'only the beat moves it (median ' + pct(walkGrid.median) + ')',
      walkGrid.median < 0.12);

    await city.evaluate(() => window.__WALKFEEL.set('SLIDE'));
    await SETTLE(page, 500);
    const walkSlide = await city.evaluate(SAMPLER, { dir: 4, hold: true, ms: 1600, every: 40 });
    ok('*** THE WORLD MOVES WHILE HE WALKS *** -- in SLIDE the typical frame is '
      + 'already different from the one before it, which is the whole feature '
      + '(median ' + pct(walkSlide.median) + ' vs GRID\'s ' + pct(walkGrid.median) + ')',
      walkSlide.median > 0.30);
    ok('and it is not a marginal difference: SLIDE moves the world on a typical '
      + 'frame at least three times as much as GRID does',
      walkSlide.median > walkGrid.median * 3);

    /* ---- 5. THE CAMERA IS REALLY BETWEEN CELLS ---------------------------- */
    /* the pixels are the proof; this says the same thing in the model's own
       numbers, which is what makes a failure readable instead of just red. */
    const between = await city.evaluate(async () => {
      const pad = document.querySelectorAll('#pad .pb')[4];
      pad.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      const seen = [];
      for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 25));
        const c = window.__WALKFEEL.cam();
        seen.push([c[0] - hx, c[1] - hy]);
      }
      pad.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      const frac = seen.filter(d => (Math.abs(d[0]) > 0.02 || Math.abs(d[1]) > 0.02)).length;
      const maxoff = Math.max.apply(null, seen.map(d => Math.max(Math.abs(d[0]), Math.abs(d[1]))));
      return { frac: frac / seen.length, maxoff: maxoff, n: seen.length };
    });
    ok('the camera is genuinely BETWEEN cells for most of a walked beat, not '
      + 'snapped to one ( ' + pct(between.frac) + ' of ' + between.n + ' samples)',
      between.frac > 0.4);
    /* THE FIRST CUT OF THIS CLAIM DEMANDED <= 1 CELL AND WAS WRONG ABOUT THE
       GAME, not about the code: it measured 2.00 exactly, because holding the
       pad for two beats starts RUNNING and a run is two cells in one beat
       (the metronome's own `if(running&&moved)stepOnce(di)`), and the bike is
       four. So the honest bound is the VEHICLE LADDER's own ceiling, which is
       also what camCell's teleport guard is set to. A gate that had been left
       at 1 would have failed every time he ran, which is most of the time. */
    ok('and it never runs further from the body than the cells it is crossing '
      + 'this beat -- 1 walking, 2 running, 4 on the bike (worst '
      + between.maxoff.toFixed(2) + ')',
      between.maxoff > 0.05 && between.maxoff <= 4.05);

    /* ---- 6. A TELEPORT IS NOT DRAWN AS A STROLL --------------------------- */
    /* loadCell, a spawn and a door all move him further than a step can. The
       guard is a real branch of the shipped function and this calls it. */
    const tele = await city.evaluate(() => {
      const before = window.__WALKFEEL.cam();
      const far = camCell(hx + 40, hy + 40);
      return { snapped: (far[0] === hx + 40 && far[1] === hy + 40), before: before };
    });
    ok('a jump too big to be a step is drawn where it lands, never slid across '
      + 'the map', tele.snapped === true);

    /* ---- 7. IT DID NOT COST A LOOP --------------------------------------- */
    /* the whole find was that animate() already rAFs for exactly one beat and
       already renders every frame of it. If SLIDE had added a timer, this would
       still be running with nothing to draw. */
    await city.evaluate(() => new Promise(r => setTimeout(r, 900)));
    const idle = await city.evaluate(() => ({ gliding: window.__WALKFEEL.gliding() }));
    ok('and when he stops walking the glide really stops -- no timer left running '
      + 'behind the game', idle.gliding === false);

    ok('and the whole of it threw nothing ('
      + (errs.length ? errs.slice(0, 2).join(' | ') : 'none') + ')', errs.length === 0);

    /* THE NUMBERS PRINT WHETHER OR NOT ANYTHING FAILED. A gate that only speaks
       when it is angry makes the next person re-derive the finding. */
    console.log('  MEASURED, in the pixels of the stage canvas, rect '
      + JSON.stringify(walkSlide.rect) + ':');
    console.log('    standing still, GRID   median ' + pct(stillGrid.median)
      + '   max ' + pct(stillGrid.max));
    console.log('    walking,        GRID   median ' + pct(walkGrid.median)
      + '   max ' + pct(walkGrid.max) + '   <- the max IS the 56px jump');
    console.log('    walking,        SLIDE  median ' + pct(walkSlide.median)
      + '   max ' + pct(walkSlide.max));
    console.log('    the camera sat between cells for ' + pct(between.frac)
      + ' of a walked beat, worst offset ' + between.maxoff.toFixed(2) + ' cells');
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  done();
})();
