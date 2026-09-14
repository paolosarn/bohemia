#!/usr/bin/env node
/* ============================================================================
   THE FIVE MINUTES, COUNTED (9/14/26, PLUMBER lane, VAMILY row [demo errors])

   PAOLO 9/13: "it's like this glitchy, buggy AI experience where nothing's
   complete." Rule 14 makes the demo's first five minutes on a phone the only
   measure of the game. This turns his sentence into four numbers, every round:

       PAGE ERRORS          anything the page threw while he played
       STALLS               gaps longer than ONE BEAT (500 ms at 120 BPM)
       DEAD TAPS            taps that changed not one pixel
       SLOW FRAMES          frames that took longer than 1/60 s

   RULE 14 (g): THERE IS ONE DRIVER. This REQUIRES tools/bohemia_drive_the_demo.js
   (LIFE + CITY) rather than opening its own browser, because that lane paid four
   rounds for the four traps between a script and the glass -- the iframe offset,
   the card that eats every tap, a text selector not being a finger, and assignment
   not being input. None of that is re-learned here.

   ## A DEAD TAP IS MEASURED ON THE GLASS, NOT FROM A SELECTOR

   Rule 14 (g) again: "A screenshot is the honest instrument; a selector is a
   guess." So a tap counts as DEAD only when the canvas is byte-identical before
   and after it. Not "no handler fired", not "no variable moved" -- the player
   cannot see either of those. He sees a screen that did not change.

   That is deliberately strict in the player's favour and loose in ours: a tap that
   changes one pixel is not counted dead, even if what it changed is useless. This
   number is a floor on the problem, never the whole of it.

   ## WHY THE BOX SPEED IS PRINTED BESIDE THE FRAME NUMBERS

   This lane spent a round concluding three different wrong things from wall clocks
   taken hours apart, because this machine runs up to 1.8x slower some hours with
   nothing in the game changed. SLOW FRAMES is a wall clock. It is reported with
   the ratio the run was taken at, or it is a number about an afternoon.

   ## FLOORS

   A walk that drove no taps, or saw no frames, agrees that the demo is perfect.
   Three of the counts only mean something if the walk actually happened, so the
   walk's own size is asserted first and printed whether it passes or not.

     node tools/bohemia_five_minutes.js            five minutes, the real thing
     node tools/bohemia_five_minutes.js --quick    ~60 s, for checking the wiring
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const D = require(path.join(__dirname, 'bohemia_drive_the_demo.js'));
const SPEED = require(path.join(__dirname, '..', 'gates', 'bohemia_box_speed.js'));

const ROOT = path.join(__dirname, '..');
const BEAT = 500;            /* 120 BPM, the law */
const FRAME = 1000 / 60;     /* the only frame budget in the building */
const RECORD = 'records/BOHEMIA_FIVE_MINUTES.json';

/* Installed in the page: every animation frame, and how long since the last one.
   rAF is what the game paints on, so this is the same clock the player's eye is on. */
const WATCH = `(function(){
  window.__fm = { frames: 0, slow: 0, dropped: 0, stalls: 0, worst: 0, last: 0, t0: 0 };
  
  function tick(t){
    const f = window.__fm;
    if (f.last) { const dt = t - f.last;
      f.frames++;
      if (dt > ${FRAME}) f.slow++;
      if (dt > ${FRAME} * 2) f.dropped++;
      if (dt > ${BEAT}) f.stalls++;
      if (dt > f.worst) f.worst = dt; }
    f.last = t;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})()`;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async function main() {
  process.chdir(ROOT);
  const quick = process.argv.includes('--quick');
  const SECONDS = quick ? 60 : 300;

  const before = SPEED.measure();
  console.log('\nTHE FIVE MINUTES, COUNTED -- ' + SECONDS + ' s on a phone\n');
  console.log('  ' + SPEED.line(before));

  const d = await D.open();
  await d.fr.evaluate(WATCH);

  /* THE WHOLE PHONE, NOT JUST THE CANVAS. (fixed 9/14, second wrong number.)
     The first two walks clipped the picture to the canvas, and MUSIC, SAVE, PHONE1
     and OUTFIT still came back dead eight times each -- after those same buttons had
     been proved on the glass to change the screen. The reason is that what they open
     is drawn in the PAGE around the canvas, not on it, so the instrument was
     photographing the one part of the phone that did not move.
     A player does not look at the canvas. He looks at the phone. */
  const shot = async () => {
    const b = await d.page.screenshot().catch(() => null);
    return b ? b.toString('base64') : null;
  };

  const controls = await d.controls();
  console.log('  ' + controls.length + ' control(s) on screen at the door');

  const taps = [];
  const t0 = Date.now();
  let i = 0;
  /* Walk him around and press what he can see, turn and turn about, until the
     five minutes are up. The order is fixed so two runs are comparable. */
  while ((Date.now() - t0) / 1000 < SECONDS) {
    const live = await d.controls();
    if (!live.length) break;
    const c = live[i % live.length];
    i++;
    const pre = await shot();
    /* tapEl takes a SELECTOR, not the words on the button. The first cut passed
       the text straight in and 45 taps in a row landed nowhere -- caught by the
       floor below, which is the whole reason it is there. Prefer the id, because
       an id is a handle and matching words can hit a hidden copy (the driver's own
       trap 3). Fall back to the words only when there is no id. */
    let ok = false;
    const sel = c.id ? '#' + c.id : 'text="' + c.text.replace(/"/g, '') + '"';
    /* DID THE TAP EVEN REACH THE CONTROL? (fixed 9/14, after the first real walk.)
       The first five-minute walk reported 162 DEAD TAPS of 230 -- 70% -- and the
       number was WRONG. Verified on the glass one at a time from a clean state, all
       eight named buttons (MUSIC, SAVE, PHONE1, OUTFIT, MARKET, SCAVENGE, BUILD HERE,
       STANDING) CHANGE THE SCREEN. What the walk had actually measured was itself:
       cycling through controls opens a panel, the panel then sits over the next
       button, the tap lands on the panel, and nothing changes -- which is correct
       behaviour being counted as a bug.
       So a tap only counts at all if the topmost thing at those coordinates IS the
       control. Anything else is a tap the player would never have made, and counting
       it is how an instrument reports its own confusion as the game's. */
    let reached = false;
    try {
      ok = await d.tapEl(sel);
      if (ok) reached = await d.fr.evaluate((q) => {
        const el = document.querySelector(q); if (!el) return false;
        const r = el.getBoundingClientRect();
        const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        return !!(top && (top === el || el.contains(top) || top.contains(el)));
      }, sel);
    } catch (e) { ok = false; }
    await sleep(900);                       /* nearly two beats to answer */
    const post = await shot();
    const changed = pre && post ? pre !== post : null;
    taps.push({ text: c.text, id: c.id, tapped: !!ok, reached: !!reached, changed });
    if (taps.length % 25 === 0) {
      const el = ((Date.now() - t0) / 1000).toFixed(0);
      console.log('    ' + el + ' s   ' + taps.length + ' taps   '
        + taps.filter(t => t.changed === false).length + ' dead so far');
    }
  }

  const fm = await d.fr.evaluate(() => window.__fm);
  const errs = d.errs.slice();
  await d.close();
  const after = SPEED.measure();

  const driven = taps.filter(t => t.tapped && t.reached);
  const blocked = taps.filter(t => t.tapped && !t.reached);
  const dead = driven.filter(t => t.changed === false);
  const secs = ((Date.now() - t0) / 1000).toFixed(0);

  console.log('\n  ==================  THE FOUR NUMBERS  ==================');
  console.log('    PAGE ERRORS   ' + String(errs.length).padStart(6));
  console.log('    STALLS        ' + String(fm.stalls).padStart(6)
    + '   gaps over one beat (' + BEAT + ' ms); worst ' + fm.worst.toFixed(0) + ' ms');
  console.log('    DEAD TAPS     ' + String(dead.length).padStart(6)
    + '   of ' + driven.length + ' taps that REACHED their control, on the glass'
    + (blocked.length ? '   (' + blocked.length + ' more were covered by something and do not count)' : ''));
  /* THE RAW COUNT OVER 16.7 ms IS ALMOST ALWAYS MOST OF THEM AND NOBODY CAN ACT ON
     IT. A 60 s wiring run read 2,106 of 3,346 -- 63% -- because the average frame
     was 18.2 ms, so nearly every frame clears the line by a hair. The number he can
     act on is the RATE he actually got, and the count of frames so late that a whole
     frame went missing. Both are printed; the raw count stays because rule 14 asked
     for it by name, and hiding a number because it is inconvenient is how a measure
     stops being one. */
  const fps = fm.frames / (+secs || 1);
  console.log('    FRAME RATE    ' + fps.toFixed(1).padStart(6) + '   fps over the walk'
    + (fps >= 58 ? '' : '   <- under 60'));
  console.log('    DROPPED       ' + String(fm.dropped).padStart(6)
    + '   frames over ' + (FRAME * 2).toFixed(1) + ' ms: a whole frame missing, which is'
    + ' what an eye sees');
  console.log('    (frames over ' + FRAME.toFixed(1) + ' ms: ' + fm.slow + ' of ' + fm.frames
    + ', ' + (100 * fm.slow / (fm.frames || 1)).toFixed(0) + '% -- true but nearly always true)');
  console.log('  ========================================================');
  console.log('    walked ' + secs + ' s, box ' + before.ratio + 'x at the start, '
    + after.ratio + 'x at the end');

  /* THE FLOORS, AFTER THE NUMBERS SO THEY ARE ALWAYS VISIBLE, AND BEFORE ANY VERDICT */
  const floors = [];
  if (driven.length < 10) floors.push('only ' + driven.length + ' taps landed: a walk that '
    + 'pressed nothing agrees the demo is perfect');
  if (fm.frames < 100) floors.push('only ' + fm.frames + ' frames seen: the frame watcher '
    + 'was not running, so the frame counts mean nothing');
  if (floors.length) {
    console.log('\n  *** THIS WALK DOES NOT COUNT ***');
    for (const f of floors) console.log('      ' + f);
  }

  if (dead.length) {
    const byName = {};
    for (const t of dead) byName[t.text] = (byName[t.text] || 0) + 1;
    console.log('\n  THE DEAD ONES, BY WHAT THEY SAY (he reads the words, not the id):');
    for (const [k, v] of Object.entries(byName).sort((a, b) => b[1] - a[1]).slice(0, 12)) {
      console.log('      ' + String(v).padStart(3) + '  ' + k);
    }
  }
  if (errs.length) {
    console.log('\n  THE ERRORS:');
    for (const e of [...new Set(errs)].slice(0, 8)) console.log('      ' + e);
  }

  fs.writeFileSync(RECORD, JSON.stringify({
    what: 'The demo\'s first ' + SECONDS + ' s on a phone, as four numbers. '
        + 'Written by tools/bohemia_five_minutes.js for VAMILY row [demo errors].',
    why: 'PAOLO 9/13: "it\'s like this glitchy, buggy AI experience where nothing\'s '
       + 'complete." Rule 14 makes these five minutes the only measure of the game.',
    taken: new Date().toISOString(),
    secondsWalked: +secs,
    boxSpeed: { start: before.ratio, end: after.ratio, baselineMs: before.baselineMs },
    numbers: { pageErrors: errs.length, stalls: fm.stalls,
               deadTaps: dead.length, slowFrames: fm.slow,
               droppedFrames: fm.dropped, fps: +(fm.frames / (+secs || 1)).toFixed(1) },
    of: { tapsReached: driven.length, tapsBlocked: blocked.length,
          tapsTried: taps.length, frames: fm.frames,
          worstGapMs: +fm.worst.toFixed(0) },
    floorsFailed: floors,
    deadByName: dead.reduce((a, t) => (a[t.text] = (a[t.text] || 0) + 1, a), {}),
    errors: [...new Set(errs)],
  }, null, 1));
  console.log('\n  ' + RECORD);
  process.exit(0);
})().catch(e => { console.error('FIVE MINUTES CRASHED: ' + (e && e.stack || e)); process.exit(1); });
