/* BOHEMIA — THE THIRD EFFECT FINALLY LANDS (8/7/26, FACTIONS lane)

   THE HOLE. engine/bohemia_quest_runtime.js has parsed `@DO faction_posture CARTEL +1`
   into rt.state.posture since 7/25. The world bridge in bohemia_loop.js carried the
   other two quest effects to the real FactionWorld — standing (@DO faction) and
   territory (@DO advance_territory) — and dropped posture on the floor. SEVENTEEN
   authored rulings across the canon corpus, parsed correctly, written to a field, and
   read by nothing. Exactly the shape of the clout-tag hole closed on 8/6: content he
   authored that no organ was listening for.

   WHAT THIS GATE HOLDS, measured rather than asserted:

   A. POSTURE IS NOT STANDING, AND THE CORPUS PROVES IT RATHER THAN ME ASSERTING IT.
      There is at least one authored stage that writes BOTH on the SAME faction in the
      same breath (S17.33: `faction CARAVANS -15` and `faction_posture CARAVANS +1`).
      If posture meant "toward the player" that would be a duplicate line. Read off
      his files, so if the corpus ever stops saying it, this claim fails.

   B. IT REACHES THE REAL WORLD. A quest carrying a posture line, run through the REAL
      runtime and the REAL bridge, changes the REAL FactionWorld. Before this, that
      number went nowhere and every test still passed.

   C. IT MOVES THE KNOB THAT ALREADY EXISTS. Faction.quota is already "districts it
      WANTS to hold" and already the appetite term scoreClaim() reads. No new field,
      no new module, no second appetite system.

   D. THE PACING LAW IS UNTOUCHED (Paolo 7/24: factions are not at war 24/7). Appetite
      is not a turn. A posture line must NOT move one district on its own; only an
      explicit @DO advance_territory still shakes the map. Measured by running a
      posture quest and asserting the owner map is byte-identical afterward.

   E. NOTHING WAS INVENTED. Every posture row this reads traces to a `@DO
      faction_posture` line in one of his .bq files, checked by re-grepping the raw
      source text. The direction is his too: every authored value is positive — nobody
      ever wrote a faction calmer — and the gate fails if a hand-written negative
      appears here without a corpus line behind it.

   F. AN UNSTIRRED FACTION IS UNCHANGED. A quest with no posture line leaves every
      quota exactly where it was, so nothing already in the world moved.

   IT SELF-TESTS: every probe feeds a CLAIM'S OWN PREDICATE the values a broken
   implementation would produce, and passes only if the claim REJECTS them.

   node gates/faction_posture_gate.js
*/
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

const LOOP = require('../engine/bohemia_loop.js');
const E = require('../engine/bohemia_engine.js');

let pass = 0; const fails = [];
const ok = (n, c) => { c ? pass++ : (fails.push(n), console.log('  FAIL: ' + n)); };
const notes = [];
const probes = []; let caught = 0;
const probe = (n, c) => { probes.push(n); c ? caught++ : console.log('  PROBE MISSED: ' + n); };

const BQDIR = 'quests/bq';
const FILES = fs.readdirSync(BQDIR).filter(f => f.endsWith('.bq'));
const RAW = FILES.map(f => fs.readFileSync(path.join(BQDIR, f), 'utf8')).join('\n');

/* ================= E. NOTHING WAS INVENTED ================= */
const postureRows = [...RAW.matchAll(/@DO\s+faction_posture\s+([A-Za-z_]+)\s+([-+]?\d+)/g)]
  .map(m => ({ faction: m[1], delta: parseInt(m[2], 10) }));
ok('his corpus actually carries authored posture rulings', postureRows.length > 0);
notes.push(`${postureRows.length} authored @DO faction_posture rulings across ${FILES.length} quest files`);

const allPositive = rows => rows.length > 0 && rows.every(r => r.delta > 0);
ok('every authored posture value is POSITIVE — nobody ever writes a faction calmer, so the mechanism must not invent a way to',
  allPositive(postureRows));
notes.push('authored magnitudes: ' + [...new Set(postureRows.map(r => r.delta))].sort().join(', '));
probe('the direction claim rejects a table with a hand-added negative behind no corpus line',
  !allPositive(postureRows.concat([{ faction: 'X', delta: -3 }])));
probe('and rejects an empty table, which would pass an every() vacuously',
  !allPositive([]));

/* ================= A. POSTURE IS NOT STANDING — PROVED OFF HIS FILES ========= */
/* find a stage that writes BOTH effects on the SAME faction */
let bothOnOne = null;
for (const f of FILES) {
  const src = fs.readFileSync(path.join(BQDIR, f), 'utf8');
  for (const block of src.split(/^@STAGE /m).slice(1)) {
    const st = [...block.matchAll(/@DO\s+faction\s+([A-Za-z_]+)\s+([-+]?\d+)/g)].map(m => m[1]);
    const po = [...block.matchAll(/@DO\s+faction_posture\s+([A-Za-z_]+)/g)].map(m => m[1]);
    const shared = po.find(p => st.includes(p));
    if (shared) { bothOnOne = { file: f, faction: shared, stage: block.split(/\s/)[0] }; break; }
  }
  if (bothOnOne) break;
}
const twoAxes = b => !!b;
ok('at least one authored stage writes STANDING and POSTURE on the SAME faction at once — so they are two axes, not one restated',
  twoAxes(bothOnOne));
if (bothOnOne) notes.push(`two axes on one faction: ${bothOnOne.file} stage ${bothOnOne.stage} -> ${bothOnOne.faction}`);
probe('the two-axes claim rejects a corpus where posture never co-occurs with standing',
  !twoAxes(null));

/* ================= THE REAL RUN =================
   Driven exactly the way engine/bohemia_loop_faction_bridge_tests.js drives it —
   boot, start a quest, walk a real dialogue choice to completion — so the bridge
   fires through its own code path and not through a hook invented for the test.
   The FIRST version of this gate poked at an export that does not exist; nothing
   ran, and the claim correctly FAILED rather than passing vacuously. That is the
   gate working, and it is why the claim is written as a measurement of the world
   rather than "the function was called". */
function factionIds(ctx) { return [...ctx.factions.factions.keys()]; }
function pick(v, s) { return (v.options || []).filter(o => o.text.indexOf(s) >= 0)[0]; }

function quest(id, doLines) {
  return [
    '@QUEST ' + id + '  Posture Probe', '@ACT 1', '@ONCE true',
    '@STAGE 10', '  @LOG opening',
    '@STAGE 20 COMPLETE #notable', '  @LOG resolved',
  ].concat(doLines.map(l => '  ' + l)).concat([
    '@TALK open speaker=k entry=stage>=10',
    '  @SAY hi', '  @OPT "resolve it" [gate: none] -> END  @DO set_stage 20',
    '@END',
  ]).join('\n');
}
function resolve(ctx, src) {
  const rt = ctx.quests.start(src);
  rt.begin('open');
  rt.choose(pick(rt.view(), 'resolve it').i);
  return rt;
}

const ctx0 = LOOP.boot({ seed: 'posture-gate-boot' });
ok('the boot really produced a live FactionWorld to measure against',
  !!(ctx0 && ctx0.factions && factionIds(ctx0).length > 0));
const SOME = factionIds(ctx0).sort()[0];
notes.push(`booted ${factionIds(ctx0).length} real factions; probing with "${SOME}"`);

/* ================= B + C. IT REACHES THE REAL WORLD, VIA THE EXISTING KNOB ==== */
{
  const ctx = LOOP.boot({ seed: 'posture-gate-lands' });
  const before = ctx.factions.factions.get(SOME).quota;
  const ownersBefore = JSON.stringify([...ctx.factions.owner.entries()].sort());
  const rt = resolve(ctx, quest('posture_lands', ['@DO faction_posture ' + SOME.toUpperCase() + ' +2']));
  ok('the probe quest actually completed (or nothing below measures anything)', rt.state.done === true);
  const after = ctx.factions.factions.get(SOME).quota;
  const ownersAfter = JSON.stringify([...ctx.factions.owner.entries()].sort());
  const landed = (b, a) => a === b + 2;
  const mapStill = (b, a) => b === a;
  ok('a posture ruling REACHES the real FactionWorld and raises that faction\'s appetite for ground',
    landed(before, after));
  notes.push(`${SOME} quota ${before} -> ${after} on an authored +2`);
  ok('THE PACING LAW HELD: stirring a faction up moves NOT ONE DISTRICT on its own — only @DO advance_territory shakes the map',
    mapStill(ownersBefore, ownersAfter));
  probe('the landing claim rejects a bridge that silently dropped posture again',
    !landed(before, before));
  probe('and rejects one that moved the wrong amount',
    !landed(before, before + 7));
  probe('the pacing claim rejects a bridge that claimed territory off a posture line alone',
    !mapStill('{"a":1}', '{"a":2}'));
}

/* ================= F. AN UNSTIRRED FACTION IS UNCHANGED ================= */
{
  const ctx = LOOP.boot({ seed: 'posture-gate-noop' });
  const quotas = () => factionIds(ctx).sort().map(id => ctx.factions.factions.get(id).quota).join(',');
  const before = quotas();
  resolve(ctx, quest('posture_noop', ['@DO faction ' + SOME.toUpperCase() + ' +5']));
  const after = quotas();
  const untouched = (b, a) => b === a;
  ok('a quest with NO posture line leaves every faction\'s appetite exactly where it was — nothing already in the world moved',
    untouched(before, after));
  notes.push('ordinary standing bump, quotas across all factions: ' + (before === after ? 'unchanged' : before + ' -> ' + after));
  probe('the no-op claim rejects a bridge that stirred everybody up on an ordinary standing bump',
    !untouched('1,1,1', '2,1,1'));
}

console.log('');
notes.forEach(n => console.log('  NOTE  ' + n));
console.log(`  NOTE  ${caught}/${probes.length} self-test probes caught`);
if (caught !== probes.length) fails.push('self-test probes missed');
console.log(`=== FACTION POSTURE GATE: ${pass} passed, ${fails.length} failed ===`);
process.exit(fails.length ? 1 : 0);
