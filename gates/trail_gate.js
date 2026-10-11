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
     T6  THE MOVES, round 2: the split is refused while a hazard exists; without it, two blocks a lane stay,
         the rest go newest first to handoffs/<LANE>_ARCHIVE.md, and no line is lost.
     T7  a rule leaving the page takes its indented lines and leaves a registry line when it quotes Paolo; a
         folded rule is one line with its pointer; both texts are kept verbatim.
     T8  an OPEN row past 14 sweeps leaves as one line, past 10 it is STALE, a row claimed since is untouched.
     T9  no move without the coordinator's CORRECT named; no move from a trail file edited by hand.
     T10 THE HEARBACK (sweep AI): the manual (rules 0-13) and every rule with his words fold at 14 silent
         sweeps and never leave; a coordinator rule folds at 7 and leaves at 14.
     T11 a held lane (HOLD, PAUSED, PARKED, or a mode rule 88 or 100 narrows) is read from its live mode; its rows
         do not evaporate.
   RED CASE: T1 on a copy of the trail file with one mark's "silent" changed by hand; T5's hazard on a
   planted handoff (the split is refused while it is there, T6); T9 on a hand-edited copy.
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

/* T6-T9 THE MOVES (round 2), on planted text: what the command line does only with the coordinator's CORRECT */
{
  const refused = T.applyHandoff(HO, new Set(['ALPHA', 'BETA', 'GAMMA']));
  const clean = HO.replace(/\n- BETA [^\n]*/, '');
  const r = T.applyHandoff(clean, new Set(['ALPHA', 'BETA', 'GAMMA']));
  const after = (r.start || '').split('\n').concat(...Object.values(r.archives || {}).map(t => t.split('\n')));
  const lost = clean.split('\n').filter(l => !after.includes(l));
  ok('T6 the split is refused while a hazard exists (' + (refused.refused ? 'refused' : 'NOT refused') + '); without it: ' + r.kept + ' kept, ' + r.moved + ' moved to '
     + Object.keys(r.archives || {}).join(', ') + ', ' + lost.length + ' lines lost',
     !!refused.refused && r.kept === 4 && r.moved === 3 && !!r.archives['handoffs/ALPHA_ARCHIVE.md'] && !!r.archives['handoffs/LEGACY_ARCHIVE.md'] && !lost.length
     && r.archives['handoffs/ALPHA_ARCHIVE.md'].indexOf('third, old') < r.archives['handoffs/ALPHA_ARCHIVE.md'].indexOf('fourth, old'));
}
{
  const B = ['## READ THIS FRONT PAGE', '1. ONE RULE (PAOLO 9/1, LOCKED; laws/BOHEMIA_ONE.md): the first', '   line two of it', '2. TWO RULE (coordinator 9/2): the second',
    '3. THREE RULE (PAOLO 9/3): kept', '', '## THE TWENTY CHATS'].join('\n');
  const r = T.applyRules(B, [{ n: 1, fold: false, silent: 20, paolo: true }, { n: 2, fold: true, silent: 8, paolo: false }], '10/11', 'records/BOHEMIA_EVAPORATED_X.md');
  ok('T7 a rule leaving the page goes with its indented lines and keeps a registry line; a folded rule is one line with its pointer; both texts are kept verbatim',
     !/^1\. /m.test(r.board) && !/line two of it/.test(r.board) && /^2\. TWO RULE \(folded to one line 10\/11 by rule 96: no lane named it for 8 sweeps; the full text is records\/BOHEMIA_EVAPORATED_X\.md\)\.$/m.test(r.board)
     && /^3\. THREE RULE/m.test(r.board) && r.evaporatedText.includes('   line two of it') && r.evaporatedText.includes('2. TWO RULE (coordinator 9/2): the second')
     && r.registry.length === 1 && /^BOHEMIA_ONE\.md \| rule 1 left the front page/.test(r.registry[0]), r.board);
}
{
  const B = ['## ALPHA  (the lane)', '- OPEN  [old job]  OLD-JOB -- nobody named it', '- OPEN  [quiet job]  QUIET-JOB -- ten sweeps', '- CLAIMED 10/11 alpha-x  [taken job]  TAKEN -- claimed since'].join('\n');
  const r = T.applyRows(B, [{ label: 'old job', lane: 'ALPHA', silent: 20 }, { label: 'quiet job', lane: 'ALPHA', silent: 11, stale: true }, { label: 'taken job', lane: 'ALPHA', silent: 30 }], '10/11');
  ok('T8 an OPEN row past 14 leaves as one line, a row past 10 gets STALE, a row claimed since is not touched',
     !/old job/.test(r.board) && r.gone.length === 1 && /ALPHA: OPEN  \[old job\]/.test(r.gone[0]) && /- OPEN  \(STALE 10\/11 by rule 96: no lane named it for 11 sweeps\)  \[quiet job\]/.test(r.board)
     && /- CLAIMED 10\/11 alpha-x  \[taken job\]/.test(r.board), r.board);
}
{
  let noCorrect = '', badSeal = '';
  try { T.applyAll('rows', null); } catch (e) { noCorrect = e.message; }
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'trail-'));
  try {
    if (fs.existsSync(T.OUT)) {
      const edited = fs.readFileSync(T.OUT, 'utf8').replace(/("kind":"row","id":"[^"]*","lane":"[^"]*","status":"OPEN","silent":)(\d+)/, (m, a, n) => a + (+n + 9));
      fs.writeFileSync(path.join(tmp, 't.json'), edited);
      try { T.readTrail(path.join(tmp, 't.json')); } catch (e) { badSeal = e.message; }
    }
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  ok('T9 no move without the coordinator\'s CORRECT named, and no move from a trail file edited by hand',
     /CORRECT IS THE PREMISE/.test(noCorrect) && /seal does not match/.test(badSeal), noCorrect + ' | ' + badSeal);
}

/* T10-T11 THE HEARBACK (sweep AI, NEGATIVE): the manual and his words never leave; a held lane's rows keep their clock */
{
  const A = (n, text, silent) => T.ruleAction(n, text, silent).action;
  const cases = [
    [A(0, 'VAMILY is a keyword.', 30), /^FOLDS/], [A(1, 'Paolo talks ONLY to the coordinator', 13), /^$/],
    [A(40, 'THE HOURS GO TO THE WORLD (PAOLO 9/29: ...)', 30), /^FOLDS.*never leaves/], [A(40, 'THE HOURS (PAOLO 9/29)', 9), /^$/],
    [A(81, 'WHAT A MONSTER BECOMES (coordinator 10/9)', 14), /^LEAVES/], [A(81, 'WHAT A MONSTER BECOMES (coordinator 10/9)', 8), /^FOLDS TO ONE LINE$/],
    [A(53, 'THE FOURTH VOTES (Paolo, LOCKED; folded to one line 10/10 ...)', 30), /^$/]];
  const bad = cases.filter(([a, re]) => !re.test(a));
  ok('T10 the manual (0-13) and a rule with his words fold at 14 and never leave; a coordinator rule folds at 7 and leaves at 14; a folded rule is not folded twice (' + (cases.length - bad.length) + ' of ' + cases.length + ')',
     !bad.length, bad.map(b => JSON.stringify(b[0])).join('; '));
}
{
  const B = ['## ALPHA  (a)', "MODE: HOLD (rule 88, Paolo 10/10: 'prioritize how it looks')", '## BETA  (b)', 'MODE: RUN (rule 78)',
    '## GAMMA  (c)', 'MODE: THE BEST SOUNDS (lifting the hold) (was: MODE: HOLD (rule 88))', '## DELTA  (d)', 'MODE: LOOK ROWS ONLY (rule 88)',
    '## EPSILON  (e)', 'MODE: COOK ONLY FOR THE LOOK ROWS, HOLD FOR MECHANICS', '## ZETA  (z)', 'MODE: RESEARCH ONLY, RUNNING'].join('\n');
  const h = [...T.heldOf(B)].sort().join(' ');
  ok('T11 held lanes read from the live mode: ' + h + ' (a lane that left HOLD, a running lane and a research lane are running)', h === 'ALPHA DELTA EPSILON');
}

console.log('\n=== THE TRAIL FILE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
