/* ============================================================================
   SHIPPED TRUTH GATE (8/6/26)

   THE CLASS OF FAILURE THIS EXISTS FOR, four times in one week:

     - the city renderer moved out of the alpha into its own file, and FIFTEEN
       browser gates went silently blind. They did not go red. They went quiet.
     - a rebase conflict resolved against a rewound checkout, and a whole feature
       vanished from a branch without one error.
     - a working tree silently rolled back to an old commit, three times, and
       every measurement taken in those windows was correct arithmetic over the
       wrong bytes.
     - a session spent a turn planning to re-land work that was already shipped,
       because it trusted a BRANCH as the record instead of what actually ships.

   Every one of those is the same shape: THE CODE MOVED AND NOTHING NOTICED.
   Not one of them was caught by a gate. All of them were caught by Paolo being
   angry, or by luck.

   SO THIS GATE ASKS ONE QUESTION: is the work we say we shipped STILL IN THE
   THING HE TAPS? Not in a branch. Not in a commit message. In the file the RUN
   tab loads, right now, on disk.

   A marker here is a CLAIM THE MACHINE CAN CHECK. Adding a line is how a lane
   says "this is live"; the gate going red is how the fleet learns it stopped
   being live. It costs one grep per feature and it would have caught all four.
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };

/* WHERE THE GAME ACTUALLY IS. If the renderer moves again, this list is the one
   place that has to change -- and the gate goes red the same day instead of
   fifteen other gates going quiet. */
const SURFACES = ['slices/BOHEMIA_CITY_WORLD.html', 'slices/BOHEMIA_ALPHA_0_9.html'];

/* THE MANIFEST: what the RUN lane says is live, and his words for why it matters.
   Every entry was verified drawing on the real canvas the day it landed. */
const CLAIMS = [
  ['sigPass',                       'his 348-sprite traffic signals, on the intersections'],
  ['shadowPass',                    'buildings cast shadows and the sun moves them'],
  ['__DOOR_JAMB2__',                '"it should stick out slightly on the next tile"'],
  ['__STEP_INSIDE__',               '"why when i enter a house i cant go left and right"'],
  ['__EVERY_BUILDING_HAS_A_DOOR__', '"i can enter it from just walking to ANY wall"'],
  ['__EW_FACING_DOORS__',           '"i never saw your eastern west facing doors"'],
  ['__SUBURB_EW_DOORS__',           '...and in the district he actually spawns in'],
  ['__XRAY_WHOLE_BUILDING__',       '"the building should be absolutely transparent"'],
];

/* THE SOUND LANE'S CLAIMS. Same contract, different lane: every marker here was
   measured on the real bus the day it landed, and every one of them is a thing
   that has ALREADY broken once by a file moving underneath it. The SFX bus hung
   off the music master for weeks -- turning music off killed every sound in the
   game and no gate noticed, because the code was all still there. It was WIRED
   somewhere else. That is exactly the failure this file exists for. */
const SOUND_CLAIMS = [
  ['__OUTBUS',        'turning the music off no longer mutes every sound in the game'],
  ['setSFXVolume',    'music, sounds and master are three separate knobs'],
  ['sbWrap',          '"every sfx should be in the sfx in the music menu"'],
  ['__SFX_APPROVED',  'only the sounds he thumbed up ever play'],
  ['voiceOK',         'sixteen sounds at once used to come out quieter than one'],
  ['sfxSpace',        'a room sounds like a room and the street sounds like the street'],
  ['__musicPhase',    'the clock moves and the music changes with it'],
  ['shufWrap',        '"honestly im lazy today" -- a verdict costs one tap now'],
  ['onPhaseChange',   'dawn is audible in 16 seconds instead of 128'],
  ['fresh.length',    'a two-song pool stopped being a coin flip on repeating itself'],
  ['__strikeHours',   '"have it the amount of time that goes by" -- four hours strike four times'],
];

let blob = '', found = [];
for (const s of SURFACES) {
  const p = path.join(ROOT, s);
  if (!fs.existsSync(p)) continue;
  found.push(s + ' (' + (fs.statSync(p).size / 1e6).toFixed(1) + ' MB)');
  blob += fs.readFileSync(p, 'utf8');
}
ok('the surface he taps exists on disk -- ' + (found.join(', ') || 'NOTHING FOUND'),
   found.length > 0 && blob.length > 100000);

/* the manifest cannot be quietly emptied to make this gate green */
ok('the manifest still lists the RUN lane\'s shipped work (' + CLAIMS.length + ')',
   CLAIMS.length >= 8);

let live = 0;
for (const [marker, why] of CLAIMS) {
  const n = blob.split(marker).length - 1;
  if (n > 0) live++;
  ok('STILL SHIPPED: ' + marker + '  -- ' + why, n > 0);
}
console.log('    ' + live + '/' + CLAIMS.length + ' of the RUN lane\'s features are live in the surface he plays.');

/* the sound manifest cannot be quietly emptied either */
ok('the manifest still lists the SOUND lane\'s shipped work (' + SOUND_CLAIMS.length + ')',
   SOUND_CLAIMS.length >= 11);
let sLive = 0;
for (const [marker, why] of SOUND_CLAIMS) {
  const n = blob.split(marker).length - 1;
  if (n > 0) sLive++;
  ok('STILL SHIPPED: ' + marker + '  -- ' + why, n > 0);
}
console.log('    ' + sLive + '/' + SOUND_CLAIMS.length + ' of the SOUND lane\'s features are live in the surface he hears.');
console.log('SHIPPED TRUTH GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
