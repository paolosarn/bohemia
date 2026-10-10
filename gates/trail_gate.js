/* ============================================================================
   THE TRAIL FILE -- NO FIELD WRITTEN BY HAND, AND THE COUNTING HOLDS
   (PLUMBER 10/10/26, row [the trail file]; rule 96, the coordinator's school round 7)

   Rule 96: "records/target/BOHEMIA_TRAIL.json, one row per mark with last_cite, lanes_citing and
   strength, written by tools/bohemia_trail_sweep.js at every VAMILY and never by hand." The row's
   constraint: "no field in the trail file is ever written by hand."

   LEGS (no browser, no network, under a second)
     T1  THE SEAL: the trail file's seal is the hash of its marks as the tool wrote them; a hand edit
         to any mark breaks it.
     T2  a lane is read from the commit's subject (COOK THREE is not COOK, RUNWAY is not RUN, "VAMILY: "
         is stripped).
     T3  a cite is read from the message: "rules 82 and 82a" is rule 82, "(rule 89)" and "the rule-89
         reds" are rule 89, a [label], a record's file name, a STOP signal.
     T4  silence is counted in sweeps after the last cite.
     T5  the handoff split keeps a lane's two newest blocks, moves the third and the July document, reads
         COOK FOUR's "=== LANE: ... (date" head, and names a lane's line dated in the last three days
         inside a moving block as a hazard.
   RED CASE: T1 on a copy of the trail file with one mark's "silent" changed by hand; T5's hazard on a
   planted handoff (the split is refused while it is there).
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const T = require(path.join(ROOT, 'tools/bohemia_trail_sweep.js'));

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };

console.log('='.repeat(74));
console.log('THE TRAIL FILE: sealed, and the counting holds (rule 96)');
console.log('='.repeat(74));

/* T1 the seal, on the real file and on a hand-edited copy */
const sealOf = (text) => {
  const lines = text.split('\n'), a = lines.indexOf(' "marks": ['), z = lines.lastIndexOf(' ]');
  const rows = lines.slice(a + 1, z).map(l => l.trim().replace(/,$/, ''));
  return { rows, stored: (text.match(/"seal": "([0-9a-f]+)"/) || [])[1], computed: T.seal(rows) };
};
if (!fs.existsSync(T.OUT)) ok('T1 the trail file exists (run node tools/bohemia_trail_sweep.js)', false);
else {
  const text = fs.readFileSync(T.OUT, 'utf8');
  const s = sealOf(text);
  const edited = text.replace(/("kind":"rule","id":"rule \d+","title":"[^"]*","silent":)(\d+)/, (m, a, n) => a + (+n + 1));
  const e = sealOf(edited);
  ok('T1 the trail file is sealed as the tool wrote it (' + s.rows.length + ' marks, seal ' + s.stored + '); one "silent" changed by hand breaks it',
     s.stored && s.stored === s.computed && edited !== text && e.stored !== e.computed,
     'stored ' + s.stored + ', computed ' + s.computed + '. Re-run node tools/bohemia_trail_sweep.js; never edit the file.');
}

/* T2 lanes */
const lanes = [['COOK THREE [the enemy tiers repainted] round 4', 'COOK THREE'], ['VAMILY: COOK post-mortems five rows', 'COOK'],
  ['COMBAT TWO [the boards from the packs]', 'COMBAT TWO'], ['RUN [the far end]', 'RUN'], ['RUNWAY names', null],
  ['VAMILY: PLUMBER claims [the trail file]', 'PLUMBER'], ['EYES AND EARS [a fresh phone]', 'EYES AND EARS'], ['LIFE+CITY on hold', 'LIFE + CITY']];
const badLane = lanes.filter(([s, l]) => T.laneOf(s) !== l);
ok('T2 a commit\'s lane is read from its subject (' + (lanes.length - badLane.length) + ' of ' + lanes.length + ')', !badLane.length,
   badLane.map(([s, l]) => s + ' -> ' + T.laneOf(s) + ', want ' + l).join('; '));

/* T3 cites */
const c = T.citesIn('PLUMBER [the pack gate]: rules 82 and 82a; the rule-89 reds (rule 89). Record: records/BOHEMIA_THE_PACKS_ARE_THE_BAR_10_10_26.md\nSTOP [judge the old] 1a2b3c4 nothing has opened it since 9/2');
ok('T3 a message\'s cites: rules ' + [...c.rules].join(',') + ', labels ' + [...c.labels].join(',') + ', ' + c.files.size + ' file, ' + c.stops.length + ' STOP',
   c.rules.has(82) && c.rules.has(89) && c.rules.size === 2 && c.labels.has('the pack gate') && c.files.has('BOHEMIA_THE_PACKS_ARE_THE_BAR_10_10_26.md')
   && c.stops.length === 1 && c.stops[0].mark === '[judge the old]');

/* T4 silence */
const sw = [{ t: 10 }, { t: 20 }, { t: 30 }];
ok('T4 silence is the sweeps after the last cite (5 -> 3, 15 -> 2, 35 -> 0)',
   T.silentAfter(sw, 5) === 3 && T.silentAfter(sw, 15) === 2 && T.silentAfter(sw, 35) === 0);

/* T5 the split */
const d = new Date(), today = (d.getMonth() + 1) + '/' + d.getDate();
const HO = ['ALPHA (alpha-aaaaaa): ' + today + ' (c) LATEST -- newest', 'body',
  'BETA (beta-bbbbbb): ' + today + ' LATEST -- only one', 'body',
  'ALPHA (alpha-aaaaaa): ' + today + ' (b) LATEST -- second', 'body',
  'ALPHA (alpha-aaaaaa): 9/2 (a) LATEST -- third, old', 'body',
  '=== GAMMA: THE THING, round 1 (' + today + ', gamma)', 'body',
  'ALPHA (alpha-aaaaaa): 9/1 LATEST -- fourth, old', '- BETA ' + today + ' a bullet of another lane written into an old block',
  '# START HERE -- the July document', '## WHERE THE ALPHA LANE IS', 'old'].join('\n');
const h = T.splitHandoff(HO, new Set(['ALPHA', 'BETA', 'GAMMA']));
const keep = h.blocks.filter(b => b.keep).map(b => b.lane + b.rank).join(' '), move = h.blocks.filter(b => !b.keep).map(b => b.lane + b.rank).join(' ');
const hz = h.blocks.filter(b => b.hazards && b.hazards.length);
ok('T5 the split keeps ' + keep + ', moves ' + move + '; the hazard: ' + hz.map(b => b.lane + b.rank + ' holds ' + b.hazards.map(x => x.lane).join(',')).join('; '),
   keep === 'ALPHA1 BETA1 ALPHA2 GAMMA1' && move === 'ALPHA3 ALPHA4 LEGACY1' && hz.length === 1 && hz[0].lane === 'ALPHA' && hz[0].rank === 4 && hz[0].hazards[0].lane === 'BETA');

console.log('\n=== THE TRAIL FILE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
