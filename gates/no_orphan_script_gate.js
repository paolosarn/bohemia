/* ============================================================================
   NO ORPHAN SCRIPT GATE (8/27/26, CITY lane)

   A REBASE ATE ANOTHER LANE'S SCRIPT TAG AND NOTHING CONFLICTED.

   The ART lane shipped room-aware floors on 8/27: a data file,
   slices/BOHEMIA_CITY_FLOORS.js, and ONE line in the walked page that loads it --

     <!-- __ROOM_FLOOR__ BEGIN --><script src="BOHEMIA_CITY_FLOORS.js"></script><!-- ... -->

   In the same region of the same file, this lane's progressive-loading work had
   DELETED a run of tile-bank script tags. Git merged a deletion against an
   insertion in adjacent lines, kept the deletion, dropped the insertion, and
   reported NO CONFLICT, because from git's point of view nothing overlapped.

   The result: the 69 KB floor file still sat in slices/, still tracked, still in
   the deploy list, and NOTHING ON EARTH LOADED IT. `window.FLOOR_POOL_B64` was
   undefined on the page Paolo walks. Every floor in every interior fell back.

   *** THE FILE SURVIVING IS WHY THIS IS INVISIBLE. *** A deleted file is loud --
   git says so, the diff says so, a build says so. A file that still exists with
   nothing pointing at it looks exactly like a file that works. Nothing in the
   repo compares "what is in slices/" against "what the page actually asks for",
   so an orphaned script is silent in every check we own except the one gate the
   ART lane happened to write against the real surface.

   AND THAT GATE ONLY EXISTS BECAUSE THEY BUILT IT. floor_gate.js caught this,
   red, on the real page -- VERIFY ON THE REAL SURFACE doing exactly its job. But
   it only covers FLOORS. The next lane to lose a tag this way loses it silently,
   because their file has no floor_gate of its own. So: the general question,
   asked once, for every file.

   THE RULE. Every .js in slices/ must be NAMED by something that can load it --
   the walked page, the alpha, or the late loader those two pull chunks with. A
   file nothing names is an orphan, and an orphan is either a bug (a tag that got
   eaten) or dead weight in a 106 MB deploy (which is its own problem).

   Deliberately a NAME check and not a parse: the chunk loader builds its URLs by
   constructing strings, so "is there a <script src> for it" would fail eight
   files that are loaded correctly. What matters is that SOMETHING still refers to
   the file by name. When the tag was eaten, the name went to zero everywhere --
   which is the mutation this gate is tested against, below.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SLICES = path.join(ROOT, 'slices');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('NO ORPHAN SCRIPT GATE — every file in slices/ is named by something');
console.log('                        that can load it. A tag a merge ate is silent.');
console.log('='.repeat(74));

/* THE SURFACES THAT CAN LOAD A SLICE. Anything that names a file counts, whether
   it does it with a tag or by building the URL. */
const SURFACES = fs.readdirSync(SLICES)
  .filter(f => /\.(html|js)$/.test(f))
  .map(f => ({ name: f, src: fs.readFileSync(path.join(SLICES, f), 'utf8') }));

ok('A1 there are slices to check (' + SURFACES.length + ' files in slices/)', SURFACES.length > 3);

const SCRIPTS = fs.readdirSync(SLICES).filter(f => /\.js$/.test(f));
ok('A2 and .js files among them (' + SCRIPTS.length + ')', SCRIPTS.length > 0);

/* A file naming ITSELF is not a reference -- a header comment saying what the file
   is would otherwise make every orphan look reachable. */
const orphans = [], reached = [];
SCRIPTS.forEach(js => {
  const by = SURFACES.filter(s => s.name !== js && s.src.indexOf(js) >= 0).map(s => s.name);
  if (by.length) reached.push(js + ' <- ' + by.join(', ')); else orphans.push(js);
});

reached.forEach(r => console.log('    ' + r));
ok('B1 NOTHING IN slices/ IS AN ORPHAN — every .js is named by a page or a loader'
   + (orphans.length ? ' -> ' + orphans.join(', ') + ' (nothing loads ' +
      (orphans.length === 1 ? 'it' : 'them') + ')' : ' (' + reached.length + ' reached)'),
   orphans.length === 0);

/* AND THE ONE THAT ACTUALLY GOT EATEN, BY NAME. B1 is the general rule and it is
   the one that matters, but a general rule quietly stops covering a specific case
   the day somebody rewrites it. This says the floor data is on the walked page,
   in the words of the thing that broke. */
const world = SURFACES.find(s => s.name === 'BOHEMIA_CITY_WORLD.html');
ok('B2 the walked page still loads the room-floor data — the exact line a rebase '
   + 'dropped on 8/27, restored',
   !!world && /BOHEMIA_CITY_FLOORS\.js/.test(world.src));

/* THE MARKERS ARE NOT THE TAG. The picker code carries __ROOM_FLOOR__ comments of
   its own, so counting markers would have said "present" the whole time it was
   broken -- a checker that cannot tell a mention from a use is the broken one. */
ok('B3 …and it is the SCRIPT that is there, not just the marker comments around '
   + 'the picker (markers alone said "fine" through the whole outage)',
   !!world && /<script[^>]+BOHEMIA_CITY_FLOORS\.js/.test(world.src));

console.log('='.repeat(74));
console.log('  NO ORPHAN SCRIPT GATE: ' + pass + ' pass / ' + fail + ' fail');
console.log('='.repeat(74));
process.exit(fail ? 1 : 0);
