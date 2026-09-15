#!/usr/bin/env node
/* __BOHEMIA_SOLO__
 * ============================================================================
 * WHAT LOADS AFTER THE DOOR -- A BUDGET ON THE ROUGHNESS PAOLO FELT
 * (9/15/26, PLUMBER lane, VAMILY row [sixty fps] FPS-ON-A-PHONE)
 *
 * PAOLO 9/15, his second play of the demo:
 *
 *     "It's kinda not running as smoothly as I would like. MAYBE IT'S CAUSE
 *      THINGS ARE LOADING IN REAL TIME."
 *
 * Coordinator ruling 5 of that play sends it here by name: "frames per second on
 * the demo's first five minutes on a throttled phone profile, one number, AND THE
 * LOADING THAT HAPPENS DURING PLAY NAMED."
 *
 * ## HE IS RIGHT, AND HERE IS THE NUMBER NOBODY HAD
 *
 * Measured on the demo, phone profile, 9/15:
 *
 *     the door opens after            3 files
 *     then, while he is playing      30 files, 75.9 MB
 *     the last one arrives           227 s after the door
 *
 * Seventy-five megabytes of tile banks stream in behind him for nearly four
 * minutes. That is not a bug somebody introduced; it is the warm-fetch queue in
 * the demo shell working as designed, and its own comment explains why it defers.
 * The design is defensible. THE SIZE IS WHAT NOBODY WAS WATCHING.
 *
 * ## WHY THIS IS A RATCHET AND NOT A TARGET
 *
 * There is no defensible "right" number of megabytes here and inventing one would
 * be a guess with a decimal point on it. What IS defensible: THIS MUST NEVER GET
 * WORSE WITHOUT SOMEBODY DECIDING IT SHOULD. So the gate pins what this build
 * does and goes red the day it grows, the same shape fps_on_a_phone_gate.js and
 * frame_budget_gate.js chose, and for the same reason: a budget that is red on
 * arrival gets switched off by the next session that hits it.
 *
 * ## THE FLOORS, BECAUSE A GATE THAT MEASURES NOTHING MUST NOT PASS
 *
 * This lane has now shipped three gates that were green while measuring nothing,
 * and found a fourth in another lane. Every ceiling here is paired with a floor:
 *
 *   - the door must have been reached, or there was no "after the door"
 *   - at least one file must have arrived BEFORE the door, or the load log is
 *     not wired and "0 MB after the door" is a lie with a zero in it
 *   - frames must have been seen, or the page was not running
 *   - the box-speed yardstick is printed, because a wall clock on a shared box
 *     is about the hour unless it carries its ratio (this lane's own 9/13 lesson)
 *
 * ## WHAT IT CANNOT SEE, SAID OUT LOUD
 *
 * It serves the files from a local server that sets no cache headers, and this
 * container's network policy blocks the live site, so I could NOT check what
 * GitHub Pages sends. Whether a real browser re-downloads these or re-reads them
 * from disk is UNKNOWN from here and this gate does not pretend to know. What is
 * true either way: the bytes are parsed and executed on the main thread while he
 * is playing, and that cost is not a cache question.
 *
 *   node gates/loading_during_play_gate.js
 * ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const SPEED = require(path.join(__dirname, 'bohemia_box_speed.js'));

/* THE RATCHET, pinned 9/15 off the measured walk (30 files, 75.9 MB over 227 s).
   This gate watches a SHORTER window than the full walk so it can live in the
   suite, so the pins are the window's numbers, not the walk's. Headroom is
   deliberate and stated: the queue is timing-driven, so which chunks land inside
   a 75 s window moves run to run. LOWER THESE WHEN THE BUILD EARNS IT. Never
   raise one to make a run green -- that is the only way this gate can fail at
   its job. */
const WINDOW_S = 75;
/* PINNED OFF THIS GATE'S OWN RUNS, NOT OFF THE FIVE-MINUTE WALK. The first cut of
   these numbers was estimated from the walk's totals and went red on its own first
   run (62 MB pin against 63.9 measured). Two runs of THIS gate, minutes apart, both
   read 63.9 MB and 27 files, so the window is stable and the pin is the measurement
   plus a stated 10% for the run-to-run drift of a timing-driven queue.
   RAISING ONE OF THESE TO MAKE A RUN GREEN IS THE ONLY WAY THIS GATE CAN FAIL AT ITS
   JOB. Lower them when the build earns it; raise one only with the reason in the
   same commit. */
const MAX_MB_AFTER_DOOR = 70;      /* measured 63.9 MB twice on 9/15 */
const MAX_FILES_AFTER_DOOR = 30;   /* measured 27 twice on 9/15 */

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };

(async function main() {
  process.chdir(ROOT);
  const box = SPEED.measure();
  console.log('\nWHAT LOADS AFTER THE DOOR -- the budget on Paolo\'s "loading in real time"\n');
  console.log('  ' + SPEED.line(box) + '\n');

  let d = null;
  try {
    d = await D.open();
  } catch (e) {
    console.log('  FAIL THE DEMO OPENS AT ALL\n         ' + String(e).slice(0, 140));
    console.log('\n=== LOADING DURING PLAY GATE: 0 passed, 1 failed ===');
    process.exit(1);
  }

  await d.fr.evaluate(`(function(){ window.__lp = { frames: 0 };
    (function t(){ window.__lp.frames++; requestAnimationFrame(t); })(); })()`);

  const doorMs = d.firstPaintMs();
  const beforeDoor = d.loads.length;
  /* SIT THERE AND LET IT LOAD. Nothing is pressed: this gate is about what the
     game does on its own while he is looking at it, not about what tapping costs. */
  await new Promise(r => setTimeout(r, WINDOW_S * 1000));

  const frames = await d.fr.evaluate(() => window.__lp.frames).catch(() => 0);
  const late = d.lateLoads();
  const mb = late.reduce((a, l) => a + (l.bytes || 0), 0) / 1048576;
  const lastAt = late.length ? (late[late.length - 1].at - doorMs) / 1000 : 0;
  await d.close();

  console.log('  the door opened at ' + (doorMs / 1000).toFixed(1) + ' s, after '
    + beforeDoor + ' file(s).');
  console.log('  in the ' + WINDOW_S + ' s after it, ' + late.length + ' more file(s) arrived, '
    + mb.toFixed(1) + ' MB, the last ' + lastAt.toFixed(1) + ' s after the door.');
  console.log('  ' + frames + ' frames were painted while that happened.\n');
  const by = {};
  for (const l of late) by[l.url] = (by[l.url] || 0) + 1;
  const twice = Object.entries(by).filter(([, n]) => n > 1);
  if (twice.length) {
    console.log('  ASKED FOR MORE THAN ONCE IN THAT WINDOW (the shell warm-fetches, then the'
      + ' city frame loads them again; whether a real host\'s cache absorbs the second ask'
      + ' is NOT KNOWN FROM HERE, see the header):');
    for (const [u, n] of twice.slice(0, 12)) console.log('      ' + n + 'x  ' + u.slice(-52));
    console.log('');
  }

  /* --- THE FLOORS FIRST: this gate must prove it measured something --- */
  ok('THE DOOR WAS REACHED, so there is an "after the door" to measure',
    doorMs !== null && doorMs > 0, 'no door means every number below is about nothing');
  ok('THE LOAD LOG IS WIRED (files arrived BEFORE the door)', beforeDoor > 0,
    'zero files before the door means the log is not listening, and a 0 MB result '
    + 'would be an instrument failure reported as good news');
  ok('THE PAGE WAS ACTUALLY RUNNING (frames were painted)', frames > 60,
    'saw ' + frames + ' frames in ' + WINDOW_S + ' s; a still page loads nothing '
    + 'and would pass every ceiling below');
  ok('THE WINDOW SAW LOADING AT ALL', late.length > 0,
    'nothing arrived after the door. That is either very good news or a broken '
    + 'log, and this gate is not allowed to guess which');

  /* --- THE RATCHET --- */
  ok('MEGABYTES AFTER THE DOOR HAVE NOT GROWN (' + mb.toFixed(1) + ' MB, pin '
    + MAX_MB_AFTER_DOOR + ' MB)', mb <= MAX_MB_AFTER_DOOR,
    'more is streaming in behind the player than when this was pinned on 9/15. '
    + 'Paolo felt this: "maybe it\'s cause things are loading in real time." If the '
    + 'growth is deliberate, move the pin in the same commit and say why.');
  ok('FILES AFTER THE DOOR HAVE NOT GROWN (' + late.length + ', pin '
    + MAX_FILES_AFTER_DOOR + ')', late.length <= MAX_FILES_AFTER_DOOR,
    'each one is another round trip while he is trying to play');

  console.log('\n=== LOADING DURING PLAY GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  if (!fail) console.log('    what streams in behind the player is not getting worse.');
  process.exit(fail ? 1 : 0);
})();
