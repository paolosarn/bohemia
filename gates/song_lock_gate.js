#!/usr/bin/env node
/* ============================================================================
   BOHEMIA -- SONG LOCK GATE
   NOBODY TOUCHES PAOLO'S SONGS WITHOUT SAYING SO OUT LOUD.

   Paolo 7/26/26: "first off you're not editing any of the actual songs right,
   like you're just editing bullshit and the different layers right, like I
   don't want you touching the actual songs themselves, bro."

   He is right to ask, and "I promise I didn't" is not an answer a machine can
   check. This is. Every canon music body is byte-hashed against a manifest:

     records/BOHEMIA_SONG_LOCK.json

   If a hash moves and the manifest does not, THE BUILD FAILS.

   THIS IS NOT A BAN ON NEW MUSIC. The music lane cooks new songs and that is
   the whole point of it. What the lock kills is a song changing QUIETLY -- as a
   side effect of somebody's feature, a bad merge, or a session deciding a
   creeper would feel better with more kick. To change a song you must update
   the manifest in the same commit with a REASON, which puts it in the diff
   where Paolo can see it, instead of it happening in a 32MB base64 blob where
   nobody would ever notice.

   WHAT IS LOCKED (the songs themselves, and nothing else):
     - OVERWORLD_SONGS   the 6 encounter creepers, in the combat demo
     - MLOOPS            his 46 approved vibes, in the alpha
     - MFACTIONS         the 28 faction song slots
     - SONG_ARR/ROOT     the 7/3 TWO MINUTE LAW arrangement and key movement
     - synthV / drumV    the voice banks every song is played with
     - the 7/3 KILL LADDER rungs at 2 and 4, which are his LOCKED law

   WHAT IS DELIBERATELY NOT LOCKED: layers that play ALONGSIDE the songs (the
   v75 fight pulse), when the shuffle swaps, the metronome, the UI. Those are
   mechanism, they are mine, and they are supposed to move.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.dirname(__dirname);
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const MANIFEST = path.join(ROOT, 'records', 'BOHEMIA_SONG_LOCK.json');

let pass = 0, fail = 0;
function ok(msg, cond) {
  if (cond) { pass++; console.log('  PASS ' + msg); }
  else { fail++; console.log('  FAIL ' + msg); }
}

const alphaRaw = fs.readFileSync(ALPHA, 'utf8');
/* CUT THE LAWBOOK OUT BEFORE LOOKING FOR ANYTHING (8/24). The alpha carries the
   music repo as a <script type="text/plain"> block: the lawbook and every batch
   history travel WITH the build, which is the point of it. But this gate finds
   each locked body by SEARCHING THE FILE for a declaration, and that block is
   part of the file -- so the moment a batch note QUOTED a declaration in prose,
   the search found the prose first and the span ran from inside the lawbook to
   the next matching end anchor anywhere after it. MLOOPS measured 2,228,716
   bytes instead of 31,446, and --write would have cheerfully hashed the wrong
   two megabytes and called the lock updated.
   That is not hypothetical: it happened while writing the batch-24 note, whose
   subject was this very anchor. gates/music_gate.js has excluded this block
   since it was written, for exactly this reason and in almost these words. This
   gate should have too.
   A GATE THAT SEARCHES A FILE CONTAINING ITS OWN DOCUMENTATION MUST EXCLUDE THE
   DOCUMENTATION. */
const _ri = alphaRaw.indexOf('<script type="text/plain" id="BOHEMIA_MUSIC_REPO">');
const _rj = _ri >= 0 ? alphaRaw.indexOf('</script>', _ri) : -1;
const alpha = (_ri >= 0 && _rj > _ri)
  ? alphaRaw.slice(0, _ri) + alphaRaw.slice(_rj)
  : alphaRaw;
const b64key = "const COMBAT_B64='";
const bi = alphaRaw.indexOf(b64key) + b64key.length;
const bj = alphaRaw.indexOf("'", bi);
const demo = Buffer.from(alphaRaw.slice(bi, bj), 'base64').toString('utf8');

/* pull a named body out of a source by its opening and closing anchors */
function body(src, start, end, label) {
  const i = src.indexOf(start);
  if (i < 0) return null;
  const j = src.indexOf(end, i + start.length);
  if (j < 0) return null;
  return src.slice(i, j + end.length);
}
function md5(s) { return crypto.createHash('md5').update(s).digest('hex'); }

/* THE LOCKED BODIES. Each entry names WHAT it is in plain English, because a
   hash with no name is exactly the kind of thing that gets "fixed" by whoever
   trips over it next (NAME IT OR DON'T DRAW IT, applied to a gate). */
const LOCKED = [
  { key: 'OVERWORLD_SONGS', src: 'demo', start: 'const OVERWORLD_SONGS=[', end: '\n];',
    what: 'the 6 encounter creepers: every note, pattern, key, kit and lead voice' },
  { key: 'SONG_ARR', src: 'demo', start: 'const SONG_ARR=[', end: '];',
    what: 'the 7/3 TWO MINUTE LAW arrangement: 16 sections, A/B/C/D, 2:08' },
  { key: 'SONG_ROOT', src: 'demo', start: 'const SONG_ROOT=[', end: '];',
    what: 'the root movement per 8-bar section' },
  { key: 'KILL_LADDER_RUNGS', src: 'demo', start: 'if(_sk>=2){ if(s%4===2)', end: "RAMP 2 -- 4 KILLS: the bass (7/3 law) */",
    what: 'his 7/3 LOCKED rungs: hats at 2 kills, bass at 4' },
  { key: 'KLAY_STYLES', src: 'demo', start: "const _kl=f.klay||'drive';", end: '/* === V64 KILL LADDER',
    what: 'how each song intensifies in its own way (drive/stabs/melody/drums/bassrise)' },
  { key: 'MLOOPS', src: 'alpha', start: 'const MLOOPS=[', end: '\n];',
    what: 'his 46 approved vibe songs' },
  { key: 'MFACTIONS', src: 'alpha', start: 'const MFACTIONS=[', end: '\n];',
    what: 'the 28 faction song slots, all CANON' },
  { key: 'synthV', src: 'demo', start: 'function synthV(', end: '\nfunction ',
    what: 'the melodic voice bank every song is played with' },
  { key: 'drumV', src: 'demo', start: 'function drumV(', end: '\nfunction ',
    what: 'the drum voice bank every song is played with' },
];

console.log('--- SONG LOCK: his songs are canon, and canon is byte-checked ---');

const WRITING = process.argv.indexOf('--write') >= 0;
let manifest = null;
try { manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')); } catch (_e) { manifest = null; }
if (!WRITING) ok('the lock manifest exists at records/BOHEMIA_SONG_LOCK.json', !!manifest && !!manifest.bodies);
if (!WRITING && (!manifest || !manifest.bodies)) {
  console.log('=== SONG LOCK GATE: ' + pass + ' pass / ' + (fail + 1) + ' fail ===');
  console.log('HINT: regenerate with  node gates/song_lock_gate.js --write  and say WHY in the commit.');
  process.exit(1);
}

const live = {};
for (const L of LOCKED) {
  const src = L.src === 'demo' ? demo : alpha;
  const b = body(src, L.start, L.end, L.key);
  ok('LOCKED BODY FOUND: ' + L.key + ' -- ' + L.what, b !== null && b.length > 0);
  if (b) live[L.key] = { md5: md5(b), bytes: b.length, what: L.what };
}

/* --write regenerates the manifest. It is a DELIBERATE act that shows up in the
   diff, which is the entire point: a song may change, but never quietly. */
if (WRITING) {
  fs.writeFileSync(MANIFEST, JSON.stringify({
    law: 'laws/BOHEMIA_ADDENDUM_HIS_SONGS_ARE_CANON_7_26_26.md',
    note: 'Paolo 7/26: "I don\'t want you touching the actual songs themselves." If a hash below moves, the build fails until someone updates this file ON PURPOSE and says why. Updating it is allowed (the music lane cooks new songs); doing it silently is not.',
    bodies: live
  }, null, 2) + '\n');
  console.log('  WROTE ' + MANIFEST + ' (' + Object.keys(live).length + ' bodies)');
}

if (WRITING) { manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')); }
for (const L of LOCKED) {
  const want = manifest.bodies[L.key], got = live[L.key];
  if (!want) { ok('MANIFEST COVERS ' + L.key, false); continue; }
  if (!got) continue;
  ok('UNTOUCHED: ' + L.key + ' (' + got.bytes + ' bytes) -- ' + L.what,
    want.md5 === got.md5);
  if (want.md5 !== got.md5) {
    console.log('       expected md5 ' + want.md5);
    console.log('       found    md5 ' + got.md5 + ' (' + got.bytes + ' bytes, manifest had ' + want.bytes + ')');
    console.log('       IF THIS CHANGE IS INTENDED: run  node gates/song_lock_gate.js --write  and say WHY in the commit.');
    console.log('       IF IT IS NOT: something edited Paolo\'s canon music. Revert it.');
  }
}

/* the lock must not creep: it locks the SONGS, never the layers around them,
   or the next session cannot ship a mix change without a fight. */
ok('THE LOCK DOES NOT OVERREACH: the fight pulse, the shuffle timing and the metronome are NOT locked -- they are mechanism and they are supposed to move',
  !Object.keys(manifest.bodies).some(k => /PULSE|SHUFFLE|METRONOME|GROOVE/i.test(k)));

console.log('=== SONG LOCK GATE: ' + pass + ' pass / ' + fail + ' fail ===');
process.exit(fail ? 1 : 0);
