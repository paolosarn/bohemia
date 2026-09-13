#!/usr/bin/env node
/*
 * THE BOX SPEED YARDSTICK -- HOW FAST IS THIS MACHINE, RIGHT NOW.
 * (9/13/26, PLUMBER lane, VAMILY row [suite runs].)
 *
 * ## WHY THIS EXISTS, AND IT IS A LESSON PAID FOR TWICE
 *
 * Every gate time this suite prints is a WALL CLOCK on a shared box, and this box
 * does not run at one speed. Measured on one unchanged tree:
 *
 *     FACTION ASK COST, alone, no code change      359.6 s   then   663.4 s
 *     one city boot, same file, same probe           8.0 s   then    11.1 s
 *
 * Both cities were then booted in ONE window, old against current, and read
 * 11.0 s against 11.1 s -- identical. The content had not changed. The machine had.
 *
 * THE MECHANISM ALREADY EXISTED AND I DID NOT APPLY IT. gates/fps_on_a_phone_gate.js
 * has carried a yardstick since 9/5, with this comment in it:
 *
 *     "A TIME BUDGET WITHOUT ONE OF THESE GOES RED ON A BUSY AFTERNOON AND GETS
 *      SWITCHED OFF. Measured on one tree this session: the demo reached its first
 *      step in 14.1 s on a quiet box and 19.9 s an hour later on the same tree with
 *      nothing in the game changed."
 *
 * That was written by this lane. Then this lane spent a whole round comparing gate
 * runtimes taken hours apart, concluded three different wrong things, and pushed one
 * of them. The fix is not a new idea. It is putting the idea where everybody trips
 * over it: at the top of every suite run, in the log, beside the times it explains.
 *
 * ## WHAT IT IS
 *
 * The SAME fixed lump of integer work the phone yardstick uses -- four million
 * rounds of a linear congruential step -- run in plain node instead of in a page, so
 * it costs no browser and runs in well under a second. Median of five, because one
 * scheduling hiccup in five should not move it.
 *
 * It is deliberately NOT the city, NOT a browser, and NOT anything in this repo: a
 * yardstick that changes when the game changes measures the game, not the machine.
 *
 * ## PROVED TO TRACK THE MACHINE, NOT GUESSED
 *
 * Validated the way the phone yardstick was validated, by making the box genuinely
 * busy and watching the number follow. Four cores here, so N busy processes:
 *
 *     0 busy    28.79 ms   0.99x      a free core, reads the baseline
 *     2 busy    30.23 ms   1.04x      still a core spare, barely moves
 *     4 busy    63.19 ms   2.17x      saturated, and it doubles
 *     8 busy    71.79 ms   2.47x
 *
 * Flat while there is a core to have, sharp the moment there is not. That is the
 * shape it should have, and it means a 2.17x reading is a real statement about the
 * machine rather than noise.
 *
 * ## WHAT IT IS NOT
 *
 * It is not a verdict and it never fails anything. A yardstick that can go red is a
 * budget, and the moment a correction can fail it starts getting argued with. This
 * prints a number and a ratio and stops. What reads it decides what it means.
 *
 *   node gates/bohemia_box_speed.js          one line, human
 *   node gates/bohemia_box_speed.js --json   one line, machine
 *   require(...).measure()                   { ms, ratio, spread, samples }
 */

/* THE BASELINE, MEASURED 9/13/26 on this container while otherwise idle, median of
 * five medians (25.9 / 28.2 / 29.1 / 29.2 / 29.3, median 29.1). A ratio above 1 means the box is SLOWER than the day the baseline
 * was taken; below 1, faster. Never edit this to make a number look better -- the
 * whole point is that it is a fixed stick. If the hardware genuinely changes, take a
 * new baseline on an idle box and say so here with the date. */
const BASELINE_MS = 29.1;

const ROUNDS = 4000000;
const REPS = 5;

function once() {
  const t0 = process.hrtime.bigint();
  let x = 12345;
  for (let i = 0; i < ROUNDS; i++) { x = (x * 1103515245 + 12345) & 0x7fffffff; }
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  return { ms, sink: x };
}

function measure(reps) {
  const runs = [];
  for (let i = 0; i < (reps || REPS); i++) runs.push(once().ms);
  runs.sort((a, b) => a - b);
  const med = runs[Math.floor(runs.length / 2)];
  return {
    ms: +med.toFixed(2),
    ratio: +(med / BASELINE_MS).toFixed(2),
    spread: [+runs[0].toFixed(2), +runs[runs.length - 1].toFixed(2)],
    samples: runs.length,
    baselineMs: BASELINE_MS,
  };
}

function line(r) {
  const how = r.ratio > 1.15 ? 'SLOWER than the baseline box'
            : r.ratio < 0.87 ? 'FASTER than the baseline box'
            : 'about the same as the baseline box';
  return 'BOX SPEED: ' + r.ms + ' ms (baseline ' + r.baselineMs + ' ms) = '
    + r.ratio.toFixed(2) + 'x, ' + how
    + '   [spread ' + r.spread[0] + '-' + r.spread[1] + ' over ' + r.samples + ']';
}

module.exports = { measure, line, BASELINE_MS };

if (require.main === module) {
  const r = measure();
  if (process.argv.includes('--json')) console.log(JSON.stringify(r));
  else {
    console.log(line(r));
    console.log('  A WALL-CLOCK TIME FROM THIS RUN IS ONLY COMPARABLE TO ONE TAKEN AT THE');
    console.log('  SAME RATIO. Pair every before/after inside one window, or the number is');
    console.log('  about the hour and not about the code.');
  }
}
