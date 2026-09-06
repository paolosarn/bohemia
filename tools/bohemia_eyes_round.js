/* BOHEMIA -- EYES AND EARS: THE ROUND, IN A HUMAN'S ORDER (lane 17, E8, 9/5/26)
 *
 * WHAT E8 ASKED: what does a human art reviewer do in the first sixty seconds with a
 * new asset, what does an audio reviewer do in the first ten seconds with a sound,
 * and turn both into the order this lane checks things in.
 *
 * WHY AN ORDER MATTERS AT ALL. This lane now owns ten instruments. Run in any order
 * they produce a pile of numbers; run in the reviewer's order they produce a REPORT,
 * because a reviewer's order is not arbitrary -- each step is only worth doing if the
 * one before it passed. Nobody checks a palette on a screen that did not render.
 *
 * THE ART ORDER (the first sixty seconds, from how directors actually review):
 *   1s   IS IT THERE            did it render at all
 *   5s   THE SQUINT            shrink it: does it still read? the thumbnail test
 *   10s  VALUE, NOT COLOUR     is contrast doing the work, or is colour carrying it
 *   15s  DOES IT FIT THE GLASS nothing off the edge, no text wider than its box
 *   30s  IS IT THE SAME WORLD  the reference score's seven machine questions
 *   60s  THE CRAFT             orphans, banding, jaggies, the light
 *   then TASTE, which is Paolo's and never a machine's
 *
 * THE SOUND ORDER (the first ten seconds, from the broadcast QC pass):
 *   1s   IS THERE A SOUND      did anything render at all
 *   2s   IS IT TOO HOT         true peak, clipping
 *   4s   CAN HE HEAR IT        on a phone speaker, at arm's length
 *   6s   IS IT THE THING       does it read as the material -- a person answers
 *   10s  DOES IT SIT           against the music and the steps, and in mono
 *
 * USAGE:  node tools/bohemia_eyes_round.js [--port 8099] [--quick]
 *         --quick skips the full 27-screen pass and checks the player's screens only.
 */
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.dirname(__dirname);
const args = process.argv.slice(2);
const PORT = (args.indexOf('--port') >= 0) ? args[args.indexOf('--port') + 1] : '8099';
const QUICK = args.includes('--quick');

const step = (n, secs, name) => console.log('\n' + '='.repeat(72) + '\n  ' + n + '. [' + secs + '] ' + name + '\n' + '='.repeat(72));
const run = (cmd, a, opts = {}) => {
  try { return execFileSync(cmd, a, { cwd: ROOT, encoding: 'utf8', timeout: opts.timeout || 300000,
    env: { ...process.env, ...(opts.env || {}) } }); }
  catch (e) { return (e.stdout || '') + '\n  [the step did not finish: ' + String(e).split('\n')[0].slice(0, 120) + ']'; }
};
const tail = (s, n) => s.trim().split('\n').slice(-n).join('\n');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eyes-round-'));

console.log('\nEYES AND EARS -- THE ROUND, IN THE ORDER A HUMAN REVIEWS IN');
console.log('a step is only worth running if the one before it passed, which is why this has an order at all');

/* ---------- THE ART SIDE ------------------------------------------------ */
step(1, '1s', 'IS IT THERE, AND DOES IT FIT THE GLASS  (the gate: a live canvas, nothing off the edge, no cut text, nothing threw, and the checker still bites)');
console.log(tail(run('node', [path.join(ROOT, 'gates/eyes_gate.js')], { timeout: 400000 }), 14));

step(2, '5-10s', 'THE SQUINT, AND VALUE BEFORE COLOUR  (can he read the words on the screen he lands on)');
const probeJson = path.join(dir, 'probe.json');
run('node', [path.join(ROOT, 'tools/bohemia_eyes_probe.js'), '--port', PORT, '--out', probeJson],
    { env: { EYES_SHOT_DIR: dir }, timeout: 400000 });
console.log(tail(run('python3', [path.join(ROOT, 'tools/bohemia_eyes_readable.py'), probeJson, dir]), 10));

step(3, '15s', 'THE PICTURES  (every tab, phone size -- the record of what this build looked like)');
if (QUICK) {
  console.log('  skipped (--quick). The player\'s two screens were captured in step 2.');
} else {
  console.log(tail(run('node', [path.join(ROOT, 'tools/bohemia_eyes_shots.js'), '--out', 'slices/eyes'],
    { timeout: 900000 }), 3));
}

step(4, '30s', 'WHAT MOVED SINCE LAST ROUND  (a number per screen, judged against its own measured noise floor)');
const shots = fs.existsSync(path.join(ROOT, 'slices/eyes')) ? fs.readdirSync(path.join(ROOT, 'slices/eyes')).filter(f => f.endsWith('.png')) : [];
console.log('  ' + shots.length + ' pictures on file. Compare with tools/bohemia_eyes_diff.py against the previous round;');
console.log('  the floor for each screen is in records/BOHEMIA_EYES_NOISE_FLOOR_9_5_26.json (15 of 27 screens are');
console.log('  byte-identical run to run; the other 12 shuffle and their numbers mean nothing under that floor).');

step(5, '60s', 'THE CRAFT  (banding and jaggies across the art banks -- the two tells the craft gate does not hold)');
console.log(tail(run('python3', [path.join(ROOT, 'tools/bohemia_eyes_pixel_tells.py'), '--limit', '8'], { timeout: 600000 }), 6));

/* ---------- THE SOUND SIDE ---------------------------------------------- */
step(6, '1-4s', 'IS THERE A SOUND, AND CAN HE HEAR IT  (the walk, on the real surface, with the engine proven alive)');
console.log(tail(run('node', [path.join(ROOT, 'tools/bohemia_eyes_ears_live.js'), '--seconds', '25', '--port', PORT],
  { timeout: 300000 }), 10));

step(7, '10s', 'DOES IT SIT  (the mix is still nobody\'s job: E5 gap 10, and the next instrument this lane builds)');
console.log('  every sound is measured alone (records/BOHEMIA_EYES_EARS_MEASURED_9_5_26.json, 185 picks).');
console.log('  NOTHING has ever metered the game\'s own output while music, steps and a bark arrive together.');

console.log('\n' + '='.repeat(72));
console.log('  AND THEN TASTE, WHICH IS HIS. Does this belong to the world; is this the same');
console.log('  game two taps apart; is the loudest thing on screen the thing that matters.');
console.log('  A machine can put the pictures side by side. It never answers those.');
console.log('='.repeat(72) + '\n');
