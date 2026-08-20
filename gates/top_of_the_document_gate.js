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
const NEXT_HEAD = /WHAT COMES NEXT FOR THIS LANE, IN ORDER[^\n]*\n([\s\S]{0,700})/;
const m = NEXT_HEAD.exec(handoff);
ok('T2 THE LANE DECLARES WHAT IT DOES NEXT, IN THE HANDOFF, WHERE THE NEXT SESSION READS IT. An order that lives only in my head is an order nobody can check and nobody can inherit',
  !!m);

if (m) {
  const block = m[1];
  const firstItem = (/^\s*1\.\s*([\s\S]*?)(?=\n\s*2\.)/m.exec(block) || [, ''])[1];
  const named = [...firstItem.matchAll(/RF4-(\d\d)/g)].map(x => 'RF4-' + x[1]);
  const topNamed = named.filter(id => byId[id] && byId[id].stars > 0);
  /* the escape hatch: a written reason, in the block, in words */
  const reasoned = /\bBLOCKED BY LAW\b/.test(block) || /\bwhy am I doing it first\b/.test(handoff);

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
ok('T6 AND THE ANSWER TO "WHY DOES IT FEEL FLAT" IS STILL SITTING UNBUILT IN HIS OWN DOCUMENT. RF4-25 (three stars) says enemies must read each other, and our own diff column already answered the complaint: "5 real types exist and NONE OF THEM READ EACH OTHER. This is the actual answer to why the fight feels flat." When it is built this check goes red and gets rewritten, rather than quietly becoming false',
  !!byId['RF4-25'] && byId['RF4-25'].stars === 3 && byId['RF4-25'].status === 'SPECED' &&
  /\bnone of them read each other\b/.test(spec));
/* AND THE CASE MATTERED. The first write of T6 searched for it in CAPITALS,
   because that is how I had written it into my own record -- and the spec says
   it in lower case. The gate went red on my misquote, which is the gate working:
   a verbatim quote that is not verbatim is the same defect as a number typed
   beside the constant instead of read from it. */

console.log('=== TOP OF THE DOCUMENT GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
