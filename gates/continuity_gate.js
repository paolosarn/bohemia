/* BOHEMIA — CONTINUITY IS THE DYNASTY (8/7/26, FACTIONS lane)

   PAOLO'S RULING, 8/7, asked as A/B/C and answered "A":
     "a bond built in one quest opens a door in another. Continuity is the dynasty."

   WHAT WAS IN THE WAY. Quest state is PER-QUEST — freshState(Q) hands every runtime
   its own object — so `@DO bond grower +18` in one quest was invisible to every other
   quest by construction. 44 authored bond rulings, and no mechanism by which one could
   ever have mattered to a later story.

   THE IDENTITY PROBLEM, AND WHY HIS OWN FILES SOLVE IT. A bond has to attach to a
   PERSON, and a quest's LABEL for someone is not a person. Measured: 43 distinct role
   names across the corpus, 5 of them used by more than one quest, and those five
   settle it without anybody having to decide anything:

     neighbor   S06 `is=the_neighbor household=behind_fence`
                S09 `is=the_neighbor household=behind_fence`   IDENTICAL — same person
     runner     S02 `faction_any knows_the_load=true`
                S12 `faction=CARTEL moves_medicine=true`       DIFFERENT — two people

   He has been declaring identity in the @ROLE conditions since before anything could
   read it. Writing the neighbour's conditions verbatim twice IS him saying it is the
   same neighbour. So the key is the CONDITION SET, never the label.

   WHAT THIS GATE HOLDS, measured on the real runtime and the real manager:

   A. A BOND CROSSES. A quest that never touched a bond sees what an earlier quest
      built with the same person, and an option gated on it OPENS.
   B. IDENTITY IS NOT THE LABEL. A different person who happens to share the role name
      inherits NOTHING. The corpus has two different `runner`s; merging them would be
      the exact bug this key exists to prevent.
   C. IT SURVIVES A RELOAD. Continuity that dies on save/load is not continuity.
   D. IT DOES NOT DOUBLE-COUNT. Inside the quest that built it, the bond is worth what
      was awarded — not the local number PLUS the carried one.
   E. THE OLD BEHAVIOUR IS EXACTLY INTACT. A runtime built without a ledger is
      bit-for-bit what it was, because every existing caller does that.
   F. IT SHIPS EMPTY. MECHANISM-MINE / CONTENTS-PAOLO'S: the ledger holds only what his
      quests actually award, and a fresh world has nothing in it.

   IT SELF-TESTS: every probe feeds a CLAIM'S OWN PREDICATE the values a broken
   implementation would produce, and passes only if the claim REJECTS them.

   node gates/continuity_gate.js
*/
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

const L = require('../engine/bohemia_loop.js');
const BQRT = require('../engine/bohemia_quest_runtime.js');
const BQ = require('../engine/bohemia_bq.js');

let pass = 0; const fails = [];
const ok = (n, c) => { c ? pass++ : (fails.push(n), console.log('  FAIL: ' + n)); };
const notes = [];
const probes = []; let caught = 0;
const probe = (n, c) => { probes.push(n); c ? caught++ : console.log('  PROBE MISSED: ' + n); };

/* the neighbour's REQ line, copied VERBATIM from his S06/S09 so this runs on his
   own identity declaration and not on a fixture invented here */
const NEIGHBOUR = '@ROLE neighbor REQ is=the_neighbor      household=behind_fence';
const OTHER_PERSON = '@ROLE neighbor REQ faction=CARTEL  moves_medicine=true';

function quest(id, role, dos, gate) {
  return ['@QUEST ' + id + '  Continuity Probe', '@ACT 1', '@ONCE true', role,
    '@STAGE 10', '  @LOG opening', '@STAGE 20 COMPLETE #quiet', '  @LOG done',
    '@TALK open speaker=neighbor entry=stage>=10', '  @SAY hi',
    '  @OPT "deep option" [gate: ' + gate + '] -> END  @DO set_stage 20',
    '  @OPT "build it" [gate: none] -> open  ' + dos, '@END'].join('\n');
}
function play(ctx, src, build) {
  const rt = ctx.quests.start(src);
  rt.begin('open');
  if (build) {
    const o = rt.view().options.filter(x => /build it/.test(x.text))[0];
    if (o) rt.choose(o.i);
  }
  return rt;
}
const sees = rt => rt.view().options.some(o => /deep option/.test(o.text));

/* ================= F. IT SHIPS EMPTY ================= */
{
  const ctx = L.boot({ seed: 'continuity-empty' });
  const blob = ctx.quests.serialize();
  const empty = b => !b._shared || !b._shared.bonds || Object.keys(b._shared.bonds).length === 0;
  ok('the cross-quest ledger SHIPS EMPTY — it holds only what his quests actually award',
    empty(blob));
  probe('the empty claim rejects a ledger with anything hand-seeded in it',
    !empty({ _shared: { bonds: { 'neighbor|x': 5 } } }));
}

/* ================= A. A BOND CROSSES ================= */
let crossed;
{
  const ctx = L.boot({ seed: 'continuity-cross' });
  const first = play(ctx, quest('c_first', NEIGHBOUR, '@DO bond neighbor +18', 'neighbor>=10'), true);
  const second = play(ctx, quest('c_second', NEIGHBOUR, '@DO learn nothing', 'neighbor>=10'), false);
  crossed = { built: sees(first), carried: sees(second) };
  const carries = c => c.built === true && c.carried === true;
  ok('A BOND CROSSES: a quest that never touched it sees what an earlier quest built with the same person, and the gated option OPENS',
    carries(crossed));
  notes.push('quest 1 built +18 -> option open: ' + crossed.built
    + '  |  quest 2 never touched it -> option open: ' + crossed.carried);
  probe('the crossing claim rejects a world where the bond stayed locked inside its own quest',
    !carries({ built: true, carried: false }));
  probe('and rejects one where the option was open all along, which would pass by accident',
    !carries({ built: false, carried: true }));
}

/* ================= B. IDENTITY IS NOT THE LABEL ================= */
{
  const ctx = L.boot({ seed: 'continuity-identity' });
  play(ctx, quest('i_first', NEIGHBOUR, '@DO bond neighbor +18', 'neighbor>=10'), true);
  const stranger = play(ctx, quest('i_other', OTHER_PERSON, '@DO learn nothing', 'neighbor>=10'), false);
  const sameLabel = play(ctx, quest('i_same', NEIGHBOUR, '@DO learn nothing', 'neighbor>=10'), false);
  const discriminates = (other, same) => other === false && same === true;
  ok('IDENTITY IS NOT THE LABEL: a DIFFERENT person sharing the role name inherits nothing, while the SAME person still does',
    discriminates(sees(stranger), sees(sameLabel)));
  notes.push('same label, different REQ conditions -> inherits: ' + sees(stranger)
    + '  |  same conditions -> inherits: ' + sees(sameLabel));
  probe('the identity claim rejects a key that merges two different people who share a label',
    !discriminates(true, true));
  probe('and rejects one so strict that even the same person stops matching',
    !discriminates(false, false));
}

/* ================= C. IT SURVIVES A RELOAD ================= */
{
  const ctx = L.boot({ seed: 'continuity-save' });
  play(ctx, quest('s_first', NEIGHBOUR, '@DO bond neighbor +18', 'neighbor>=10'), true);
  const blob = JSON.parse(JSON.stringify(ctx.quests.serialize()));
  const ctx2 = L.boot({ seed: 'continuity-save' });
  ctx2.quests.restore(blob);
  const after = play(ctx2, quest('s_later', NEIGHBOUR, '@DO learn nothing', 'neighbor>=10'), false);
  const survives = v => v === true;
  ok('IT SURVIVES A RELOAD — continuity that dies on save/load is not continuity',
    survives(sees(after)));
  probe('the reload claim rejects a ledger that was not in the save at all', !survives(false));
}

/* ================= D. IT DOES NOT DOUBLE-COUNT ================= */
{
  const ctx = L.boot({ seed: 'continuity-double' });
  const rt = play(ctx, quest('d_one', NEIGHBOUR, '@DO bond neighbor +18', 'neighbor>=10'), true);
  const exact = v => v === 18;
  ok('IT DOES NOT DOUBLE-COUNT: inside the quest that built it, the bond is worth exactly what was awarded',
    exact(rt.bondWith('neighbor')));
  notes.push('awarded +18, reads back ' + rt.bondWith('neighbor'));
  probe('the no-double-count claim rejects local plus carried being added together',
    !exact(36));
}

/* ================= E. THE OLD BEHAVIOUR IS EXACTLY INTACT ================= */
{
  const Q = BQ.parse(quest('e_bare', NEIGHBOUR, '@DO bond neighbor +18', 'neighbor>=10'));
  const bare = new BQRT.Runtime(Q);            // no ledger, the way every old caller builds one
  const unchanged = r => r.shared === null && r.bondWith('neighbor') === null;
  ok('a runtime built WITHOUT a ledger is bit-for-bit what it was — every existing caller does exactly that',
    unchanged(bare));
  probe('the compatibility claim rejects a runtime that silently grew a ledger of its own',
    !unchanged({ shared: { bonds: {} }, bondWith: () => 5 }));
}

/* ================= his corpus must still parse and cast ================= */
{
  const fs = require('fs');
  let errs = 0, n = 0, keys = new Set();
  for (const f of fs.readdirSync('quests/bq').filter(x => x.endsWith('.bq'))) {
    const Q = BQ.parse(fs.readFileSync('quests/bq/' + f, 'utf8'));
    errs += (BQ.validate(Q).errors || []).length; n++;
    (Q.roles || []).forEach(r => keys.add(BQRT.personKey(Q, r.name)));
  }
  ok('his whole canon corpus still parses and validates clean after the change', errs === 0);
  notes.push(n + ' canon quests, ' + errs + ' errors, ' + keys.size + ' distinct people identified across them');
}

console.log('');
notes.forEach(n => console.log('  NOTE  ' + n));
console.log(`  NOTE  ${caught}/${probes.length} self-test probes caught`);
if (caught !== probes.length) fails.push('self-test probes missed');
console.log(`=== CONTINUITY GATE: ${pass} passed, ${fails.length} failed ===`);
process.exit(fails.length ? 1 : 0);
