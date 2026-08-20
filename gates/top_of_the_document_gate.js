#!/usr/bin/env node
/* ============================================================================
   COUNT THE STARS BEFORE YOU PICK (Paolo 8/20/26, and it binds every lane)

   > "bro i gave you a whole document to play like rgue fable 4 this is not even
   >  close. how do i shoot a car?"

   THIRD REJECTION OF THE COMBAT LANE'S DIRECTION IN THREE DAYS. The finding,
   counted for the first time that day, is in
   records/BOHEMIA_COMBAT_I_BUILT_THE_BOTTOM_OF_HIS_DOCUMENT_8_20_26.md:

     TWO of the TEN highest-priority rows of the teardown spec were built.
     EIGHTEEN of the FIFTY lowest were.

   Six ships in three days, every one of them measured, every one of them green,
   and the top of his ranked document untouched. The order came from an internal
   routing decision (the "machine" numbering of the RF4 lift), and the machines
   are not ranked by how much they change the FEEL. Nothing in the machine cared,
   which is the same shape as every other finding this week: A LAW WITHOUT A
   MACHINE GATE IS NOT ENFORCED.

   SO THIS GATE ENFORCES ONE SENTENCE, AND ONLY WHERE IT IS CHECKABLE:

     WHEN A LANE DECLARES WHAT IT DOES NEXT, THAT ITEM MUST BE ONE OF THE TOP
     ROWS OF THE DOCUMENT THE WORK IS DRAWN FROM -- OR THE HANDOFF MUST SAY IN
     WRITING WHY NOT.

   "It was routed to my lane" is not an answer. "It gated green" is not an
   answer.

   ★ AND IT DELIBERATELY DOES NOT DEMAND THAT STARRED ROWS BE BUILT FIRST, FULL
   STOP. A GATE MUST NEVER OUTRANK A RULING (8/1). Paolo can want a small thing
   next, a row can be blocked by law (machine 8 is, by NO DAMAGE BEFORE THE
   DIAL), and a lane can legitimately be paying down a defect. What the machine
   can honestly demand is that the choice was MADE WITH THE RANKING IN FRONT OF
   IT rather than by accident -- so the escape hatch is a written reason, and the
   thing it makes impossible is doing the bottom of the list silently.

   REUSE CHECK: cooks no graphic pixels. Reads the same spec table
   gates/rf4_teardown_gate.js parses, and the same handoff every lane rewrites.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SPEC = path.join(ROOT, 'records', 'BOHEMIA_RF4_TEARDOWN_SPEC.md');
const HANDOFF = path.join(ROOT, '00_START_HERE_NEXT_SESSION.md');
const FINDING = path.join(ROOT, 'records',
  'BOHEMIA_COMBAT_I_BUILT_THE_BOTTOM_OF_HIS_DOCUMENT_8_20_26.md');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  PASS ' + n)) : (fail++, console.log('  FAIL ' + n)); };

const spec = fs.readFileSync(SPEC, 'utf8');
const handoff = fs.readFileSync(HANDOFF, 'utf8');

/* ---- the ranking, read off the document itself ---- */
const rows = spec.split('\n').filter(l => l.startsWith('|') && /\*\*RF4-\d\d\*\*/.test(l))
  .map(l => {
    const c = l.split('|');
    return { id: 'RF4-' + /RF4-(\d\d)/.exec(c[1])[1], stars: (c[2].match(/★/g) || []).length,
             status: c[4].trim() };
  });
const byId = Object.fromEntries(rows.map(r => [r.id, r]));
const tier = s => rows.filter(r => r.stars === s);
const built = a => a.filter(r => r.status === 'BUILT').length;

const starred = rows.filter(r => r.stars > 0);
console.log('  the ranking, counted off the document:');
for (const s of [3, 2, 1, 0]) {
  const t = tier(s);
  if (t.length) console.log('    ' + ('★'.repeat(s) || 'unstarred').padEnd(9)
    + built(t) + ' built of ' + t.length);
}

ok('T1 THE DOCUMENT RANKS ITSELF AND THE RANKING IS READABLE BY A MACHINE. If the stars ever stop parsing, this gate is measuring nothing and would go green forever',
  rows.length > 40 && starred.length >= 8 && tier(0).length >= 20);

/* ---- THE ONE THAT BITES ---- */
/* The lane's declared next item is the FIRST numbered line under its handoff
   heading. It must name a starred row, or the block must carry a written reason.
   This is the check that would have caught six ships in a row. */
/* THE BLOCK IS READ TO THE END OF ITS LIST, NOT TO A CHARACTER COUNT. The first
   write capped it at 700 characters and that cap FIRED A FALSE NEGATIVE on its
   second run: a long item 1 pushed the "2." terminator out of the window, the
   extraction came back empty, and the gate reported "NO RF4 ROW AT ALL" about a
   line that opens with RF4-14. The cap was an implementation detail I invented,
   not part of the claim, so widening it here is fixing a broken ruler and NOT
   the forbidden move of loosening a check to make my own work pass -- the check
   that DID catch me legitimately (a bookkeeping item put at the top of the list)
   still fires, because the item read is the LOWEST-NUMBERED one, whatever number
   a lane gives it. */
const NEXT_HEAD = /WHAT COMES NEXT FOR THIS LANE, IN ORDER[^\n]*\n((?:[ \t]+\S[^\n]*\n|\n(?=[ \t]+\d+\.))*)/;
const m = NEXT_HEAD.exec(handoff);
ok('T2 THE LANE DECLARES WHAT IT DOES NEXT, IN THE HANDOFF, WHERE THE NEXT SESSION READS IT. An order that lives only in my head is an order nobody can check and nobody can inherit',
  !!m);

if (m) {
  const block = m[1];
  /* the LOWEST-numbered item is "next", whatever a lane numbers it. Writing an
     item 0 to slip something above the list is exactly the move this catches. */
  const items = [...block.matchAll(/^[ \t]*(\d+)\.\s([\s\S]*?)(?=^[ \t]*\d+\.\s|$)/gm)]
    .map(x => ({ n: +x[1], text: x[2] })).sort((a, b) => a.n - b.n);
  const firstItem = items.length ? items[0].text : '';
  const named = [...firstItem.matchAll(/RF4-(\d\d)/g)].map(x => 'RF4-' + x[1]);
  const topNamed = named.filter(id => byId[id] && byId[id].stars > 0);
  /* THE ESCAPE HATCH IS A MARKER A LANE HAS TO TYPE ON PURPOSE, ON THE ITEM
     ITSELF. The first write accepted the phrase "why am I doing it first"
     ANYWHERE IN THE HANDOFF -- and that phrase is part of the rule's own
     explanation, which sits in the handoff permanently, so T4 could never fail.
     A mutation pointing the next item at an unstarred row sailed through it. An
     escape hatch that the law's own text unlocks is not an escape hatch, it is
     the check being switched off in writing. Now it must be declared on the
     item, in these words, which nobody types by accident. */
  const reasoned = /NOT A TOP ROW BECAUSE/.test(firstItem);

  console.log('  the next item names: ' + (named.join(', ') || 'NO RF4 ROW AT ALL')
    + (topNamed.length ? '   (starred: ' + topNamed.map(i => i + ' ' + '★'.repeat(byId[i].stars)).join(', ') + ')' : ''));

  ok('T3 THE NEXT ITEM NAMES A ROW OF THE DOCUMENT AT ALL. Six ships in three days were picked by an internal routing number instead, and an item that cannot be traced to a row cannot be ranked against the others -- which is exactly how the bottom of the list gets built first',
    named.length > 0);

  ok('T4 *** AND IT IS ONE OF THE TOP ROWS, OR THE HANDOFF SAYS IN WRITING WHY NOT. *** This is the whole gate. "It was routed to my lane" is not an answer and "it gated green" is not an answer',
    topNamed.length > 0 || reasoned);
}

/* ---- and the finding cannot quietly evaporate ---- */
ok('T5 THE FINDING IS WRITTEN DOWN WHERE THE NEXT SESSION TRIPS OVER IT, with the count that produced it -- because the reusable part is not "build RF4-25", it is "count the stars before you pick"',
  fs.existsSync(FINDING) &&
  /TWO of the TEN|two of the ten/i.test(fs.readFileSync(FINDING, 'utf8')) &&
  /BOHEMIA_COMBAT_I_BUILT_THE_BOTTOM_OF_HIS_DOCUMENT_8_20_26/.test(handoff));

/* ---- and the specific claim the finding rests on, re-derived rather than quoted ---- */
/* T6 DID ITS JOB BY GOING RED. It was written on 8/20 as "RF4-25 is still
   SPECED", with the note: "when it is built this check goes red and gets
   rewritten, rather than quietly becoming false." It went red the same day, on
   the commit that built it. A check that expires loudly is the only kind worth
   writing about work in progress. What it holds now is the OTHER half -- that
   the row which answered his complaint is built, and that the ledger the finding
   rests on actually moved. */
ok('T6 THE THREE-STAR ROW THAT ANSWERED HIS COMPLAINT IS BUILT. RF4-25 -- "the same enemy added to 5 very different groups should produce 5 very different combat encounters" -- whose own diff column read "5 real types exist and none of them read each other. This is the actual answer to why the fight feels flat"',
  !!byId['RF4-25'] && byId['RF4-25'].stars === 3 && byId['RF4-25'].status === 'BUILT' &&
  /\bnone of them read each other\b/.test(spec));

/* AND THE CASE MATTERED. The first write of T6 searched for that sentence in
   CAPITALS, because that is how I had written it into my own record -- and the
   spec says it in lower case. The gate went red on my misquote, which is the
   gate working: a verbatim quote that is not verbatim is the same defect as a
   number typed beside the constant instead of read from it. */

ok('T7 AND THE LEDGER MOVED IN THE RIGHT DIRECTION, which is the only thing that makes the finding more than a story. On 8/20 it was 2 starred rows built against 18 unstarred; a lane that "took the note on board" and then built three more unstarred rows would read exactly the same as one that did not',
  built(starred) >= 4);

ok('T8 AND THE TOP OF THE DOCUMENT IS NOT DECLARED FINISHED. The thesis row (RF4-36, three stars, "the most important line in any of this") is still open, so the ledger cannot be read as a job done -- when it closes this check goes red and gets rewritten, the same way T6 just did',
  !!byId['RF4-36'] && byId['RF4-36'].stars === 3 && byId['RF4-36'].status !== 'BUILT');

/* ---- T9: BUILT HAS TO MEAN SOMETHING A MACHINE CAN SEE ----
   The coordinator routed this here on 8/20: the spec's STATUS column "uses BUILT
   for both 'the substrate exists' and 'the machine exists', and its prose
   disagrees with its own column because of it." COMBAT owns the column, so
   COMBAT splits the values -- and the split is only worth anything if it is
   CHECKABLE, otherwise it is one more word somebody types.

   THE RULE: a row is BUILT when some gate NAMES it. Everything in this repo
   already works that way (a law without a machine gate is not enforced), and
   naming the row is the same discipline the QUEST STUDY LAW puts on quests: a
   citation is a claim the machine can check, never a name-drop. A row whose
   material exists but which no gate holds is UNHELD -- an honest third value a
   lane can clear by writing the check.

   MEASURED WHEN THIS WAS WRITTEN: 24 rows said BUILT and 20 of them were named
   by a gate. Of the four that were not, two were genuinely held and simply never
   cited (the citations were added), one had a real rule nobody checked and got a
   gate that day (RF4-35, the expression line), and two were demoted to UNHELD.

   ★ AND THE FIRST VERSION OF THIS SCAN WAS WRONG IN A WAY WORTH KEEPING: it read
   citations with /RF4-\d\d/ and so missed "RF4-17/32", reporting a held row as
   unheld. A sweep that silently under-counts reads exactly like a clean one. */
const CITE = /RF4-(\d\d(?:\s*[\/,]\s*\d\d)*)/g;
const named = new Set();
for (const f of fs.readdirSync(path.join(ROOT, 'gates'))) {
  const fp = path.join(ROOT, 'gates', f);
  let t = '';
  try { if (!fs.statSync(fp).isFile()) continue; t = fs.readFileSync(fp, 'utf8'); } catch (e) { continue; }
  for (const m of t.matchAll(CITE))
    for (const n of m[1].match(/\d\d/g) || []) named.add('RF4-' + n);
}
const builtRows = rows.filter(r => r.status === 'BUILT');
const unnamed = builtRows.filter(r => !named.has(r.id));
console.log('  BUILT rows: ' + builtRows.length + ', named by a gate: ' + (builtRows.length - unnamed.length)
  + (unnamed.length ? ', NOT NAMED: ' + unnamed.map(r => r.id).join(', ') : ''));

ok('T9 EVERY ROW THAT SAYS BUILT IS NAMED BY A GATE. That is what the word now means, and it is why the star ledger can be trusted at all: BUILT used to cover both "the material exists" and "the machine exists", so a row could be marked done on the strength of a sentence in its own diff column. UNHELD is the honest third value for material nobody checks',
  unnamed.length === 0);

ok('T10 AND THE THIRD VALUE IS ACTUALLY IN USE, not a word added to a legend and never applied. If UNHELD ever empties, either every claim really is held -- or somebody quietly promoted the awkward rows back, which is the failure this split exists to make visible',
  rows.some(r => r.status === 'UNHELD'));

console.log('=== TOP OF THE DOCUMENT GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
