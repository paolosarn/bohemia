/* ============================================================================
   BLOCKING CHUNK GATE (8/27/26, CITY lane)

   THE ONE FILE THE WORLD WAITS ON, AND THE MERGE THAT KEEPS FATTENING IT.

   The tile bank is split into nine chunks. Chunk 1 is the ONLY one that blocks:
   it is a plain <script> tag because it declares every bank NAME the page reads.
   The other eight are pulled by a loader after a world is on screen, precisely so
   26 MB of sprites cannot sit in the pipe ahead of the 1.75 MB the world is
   actually waiting for.

   SO CHUNK 1's SIZE IS THE PLAYER'S WAIT, ALMOST DIRECTLY. Measured on a
   throttled weak-4G profile, same tree, same day, nothing else changed:

       chunk 1 = 4.35 MB  ->  14.3s after the tap   (RED, ceiling 12s)
       chunk 1 = 1.75 MB  ->   8.7s after the tap   (green)

   Six seconds of a stranger's patience, for one file being the wrong size.

   *** AND IT GETS THE WRONG SIZE BY MERGING, NOT BY EDITING. *** Another lane
   bakes hero art into the bank and commits a chunk 1 around 4.4 MB. Every rebase
   onto main brings that file back, git reports no conflict because only one side
   touched it, and the fix is simply to re-run the chunker -- which re-splits the
   same bank and hands the blocking slot back its 1.75 MB. EQUIVALENCE: IDENTICAL
   every time; no art is lost either way, only the split changes.

   IT HAS HAPPENED TWICE IN ONE DAY. Both times it was written down as a standing
   note -- "run the chunker after every rebase" -- and the second time it got
   through anyway, because the rebase happened inside an automated push loop where
   there was nobody to read the note. A STANDING NOTE IS NOT A MACHINE GATE, which
   is the oldest rule in this repo, and this is the gate.

   WHY IT IS ITS OWN FILE AND NOT A LEG ON time_to_play. time_to_play DID catch it,
   red, at 14.3s -- the machine worked. But it is a browser gate that costs ~43
   seconds and boots three throttled Chromium profiles to say so. This is a stat()
   call. A guard nobody can afford to run before every push is a guard that runs
   after the damage, and the whole point of catching this one is to catch it
   BEFORE it reaches the link Paolo pastes.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SLICES = path.join(ROOT, 'slices');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const MB = b => (b / 1048576).toFixed(2) + ' MB';

console.log('='.repeat(74));
console.log('BLOCKING CHUNK GATE — chunk 1 is the only file the world waits on,');
console.log('                      and a rebase keeps handing it another lane\'s 4.4 MB');
console.log('='.repeat(74));

const chunks = fs.readdirSync(SLICES)
  .filter(f => /^BOHEMIA_CITY_TILES_\d+\.js$/.test(f)).sort();
ok('A1 the bank is split into chunks (' + chunks.length + ' found)', chunks.length >= 2);

const first = chunks[0];
ok('A2 the first chunk is numbered 01, so "first" is not a sort accident (' + first + ')',
   first === 'BOHEMIA_CITY_TILES_01.js');

/* THE CEILING. 1.75 MB is what the chunker produces; 4.35 MB is what the merge keeps
   bringing back. 2.5 MB sits between them with room for the bank to grow honestly, and
   it FAILS THE BUG IT WAS WRITTEN FOR -- which a ceiling that does not is decoration. */
const CEIL = 2.5 * 1048576;
const size = fs.existsSync(path.join(SLICES, first)) ? fs.statSync(path.join(SLICES, first)).size : 0;
ok('B1 THE BLOCKING CHUNK IS SMALL ENOUGH TO WAIT FOR: ' + first + ' is ' + MB(size)
   + ', ceiling ' + MB(CEIL) + (size > CEIL
     ? ' -- this is another lane\'s hero bake, brought back by a rebase. Run '
       + '`python3 tools/bohemia_city_chunk_tile_bank.py`; it re-splits the same bank, '
       + 'reports EQUIVALENCE: IDENTICAL, and hands this slot back its ~1.75 MB. '
       + 'No art is lost -- only the split changes.'
     : ''),
   size > 0 && size <= CEIL);

/* AND ONLY ONE OF THEM BLOCKS. The saving comes entirely from the other eight NOT being
   tags: a deferred tag still DOWNLOADS during the parse, which is the thing that put 26 MB
   in the pipe ahead of the world in the first place. If a second chunk ever grows a tag,
   chunk 1 being small stops meaning anything. */
const page = fs.readFileSync(path.join(SLICES, 'BOHEMIA_CITY_WORLD.html'), 'utf8');
const tagged = chunks.filter(c => new RegExp('<script[^>]+src="' + c + '"').test(page));
ok('B2 …and it is the ONLY chunk the page loads with a tag (' + tagged.length + ': '
   + (tagged.join(', ') || 'none') + ') — the other ' + (chunks.length - 1)
   + ' are pulled by the loader once a world is on screen, because a deferred tag still '
   + 'downloads during the parse',
   tagged.length === 1 && tagged[0] === first);

const total = chunks.reduce((n, c) => n + fs.statSync(path.join(SLICES, c)).size, 0);
console.log('  the bank: ' + MB(total) + ' across ' + chunks.length + ' chunks, of which '
  + MB(size) + ' blocks');

console.log('='.repeat(74));
console.log('  BLOCKING CHUNK GATE: ' + pass + ' pass / ' + fail + ' fail');
console.log('='.repeat(74));
process.exit(fail ? 1 : 0);
