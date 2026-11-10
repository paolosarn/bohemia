/* ============================================================================
   EARNED NOT AFFORDED GATE (7/31/26, LAB lane)

   Paolo 7/31: "VALHEIM PROJECT ZOMBOID FALLOUT NEW VEGAS WITH POCKET CITY 2 ONTOP
   OF IT". Pocket City 2 was already locked as the city-builder base on 7/1/26, so
   going to READ that addendum before building anything is what found the bug this
   gate now holds shut.

   THE BUG: laws/BOHEMIA_ADDENDUM_CITYBUILDER_MODEL_7_1_26.md required "daily upkeep
   on everything" and "overbuilding past your income bankrupts you". Paolo's 7/31 TEN
   YEARS COLD law bans economic gameplay as a CATEGORY. Two live canon files
   contradicting each other is a BUG by CLAUDE.md, not an interpretation choice, and
   the truth hierarchy resolves it: NEWEST DATE WINS.

   Law: laws/BOHEMIA_ADDENDUM_EARNED_NOT_AFFORDED_7_31_26.md

   Every check below matches a STRUCTURE, never a mention. The laws are REQUIRED to
   name upkeep and bankruptcy in order to kill them, and a check that trips on its
   own prohibition is the mistake this repo has shipped six separate times.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const LAW = 'laws/BOHEMIA_ADDENDUM_EARNED_NOT_AFFORDED_7_31_26.md';
const OLD = 'laws/BOHEMIA_ADDENDUM_CITYBUILDER_MODEL_7_1_26.md';
const COLD = 'laws/BOHEMIA_ADDENDUM_TEN_YEARS_COLD_7_31_26.md';

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('EARNED NOT AFFORDED GATE — buildings are earned, not afforded;');
console.log('                           and two laws may not contradict each other');
console.log('='.repeat(74));

ok('A1 the resolution law exists', fs.existsSync(path.join(ROOT, LAW)));
if (!fs.existsSync(path.join(ROOT, LAW))) process.exit(1);
const lawRaw = fs.readFileSync(path.join(ROOT, LAW), 'utf8');
/* PROSE IS MATCHED WHITESPACE-COLLAPSED, ALWAYS. A7 failed on its first run because
   the law says "there are no\nmicrotransactions" -- hard-wrapped, so /no
   microtransactions/ found nothing. That is the SEVENTH time this repo has shipped a
   check that assumed prose respects line endings (lab_gate A24 twice, and the
   word-versus-thing family). Fixed once, here, for every prose check in the file
   rather than per-check: `law` is collapsed, `lawRaw` keeps the layout for the checks
   that genuinely need it. */
const law = lawRaw.replace(/\s+/g, ' ');

ok('A2 it quotes the prompt that caused it', /POCKET CITY 2 ONTOP OF IT/.test(law));
ok('A3 it names the contradiction as a CONTRADICTION, not a nuance',
   /THE CONTRADICTION/.test(law) && /bug/i.test(law));
ok('A4 it applies the truth hierarchy explicitly', /NEWEST DATE WINS/i.test(law));
ok('A5 it cites BOTH laws it is reconciling',
   law.indexOf(path.basename(OLD)) > 0 && law.indexOf(path.basename(COLD)) > 0);
ok('A6 it states the replacement discipline in the affirmative',
   /EARNED, NOT AFFORDED/i.test(law));
ok('A7 it grounds the replacement in the reference rather than inventing it',
   /no microtransactions/i.test(law) && /City Competitions/i.test(law));
ok('A8 it says what is STILL HIS, and does not fill it in',
   /WHAT IS STILL HIS/i.test(law) && /\[PENDING Paolo\]/.test(law));
ok('A9 it flags the hole the resolution opens rather than hiding it',
   /one real hole/i.test(law));

/* the cited laws must still exist — a citation to a deleted law is rot */
[OLD, COLD].forEach((f, i) => ok('A10.' + (i + 1) + ' cited law exists: ' + path.basename(f),
  fs.existsSync(path.join(ROOT, f))));

/* PART B — the superseded clause is dead WHERE IT LIVES, not just here. A reader who
   opens only the 7/1 file must not act on a dead clause. */
const oldLaw = fs.readFileSync(path.join(ROOT, OLD), 'utf8');
ok('B1 the 7/1 upkeep clause is struck through and marked DEAD in place',
   /DEAD 7\/31\/26/.test(oldLaw) && /~~\*\*Daily upkeep on everything/.test(oldLaw));
ok('B2 and it points at the law that superseded it', oldLaw.indexOf(path.basename(LAW)) > 0);
ok('B3 and it says the discipline was REPLACED, not removed',
   /REPLACED, NOT REMOVED/i.test(oldLaw));
ok('B4 the rest of the 7/1 addendum survives (zoning, act gates, rubble, mayor)',
   /Zone, don't hand-place/.test(oldLaw) && /gated by ACT/.test(oldLaw) &&
   /genuinely be rubble/i.test(oldLaw) && /pseudo-mayor/.test(oldLaw));

/* PART C — THE SWEEP. No shipped surface may implement the dead mechanic. */
function walk(dir, ext, out) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return out;
  for (const f of fs.readdirSync(full, { withFileTypes: true })) {
    if (f.isDirectory()) continue;
    if (ext.test(f.name)) out.push(path.join(dir, f.name));
  }
  return out;
}
const surfaces = walk('slices', /\.(html|js)$/, walk('engine', /\.js$/, []))
  .filter(f => f.indexOf('slices/lab/') !== 0);
const BANNED = [
  [/\b(daily)?[Uu]pkeep\s*[:=(]/, 'an upkeep mechanic'],
  [/\bbankrupt\w*\s*[:=(]/i, 'a bankruptcy mechanic'],
  [/\bincomePer\w*\s*[:=(]|\bnetIncome\s*[:=(]/, 'an income term']
];
let hits = [];
surfaces.forEach(f => {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  BANNED.forEach(([re, what]) => { if (re.test(src)) hits.push(f + ': ' + what); });
});
ok('C1 NO SHIPPED SURFACE IMPLEMENTS UPKEEP, INCOME OR BANKRUPTCY (' + surfaces.length +
   ' swept)' + (hits.length ? ' -> ' + hits.slice(0, 3).join('; ') : ''), hits.length === 0);

/* PART C2 — THE HOLE THIS GATE SHIPPED WITH, AND THE REASON IT MATTERS MOST.
   The first version swept engine/ and slices/ for an IMPLEMENTATION of the dead
   mechanic and never asked whether another LAW still asserted it. It did not, and the
   claim was still live, verbatim, in laws/BOHEMIA_GDD_v4.md:74 -- a master that
   CLAUDE.md and gates/gdd_gate.js both hold LIVE, which makes it MORE authoritative
   than the addendum I had struck. So my fix was incomplete and my gate said green.
   A contradiction lives in PROSE before it ever reaches code. Sweeping only code
   catches it after somebody has already built the wrong thing. */
const laws = walk('laws', /\.md$/, walk('records', /\.md$/, []))
  .filter(f => f.indexOf(path.basename(LAW)) < 0 &&
               f.indexOf('ANSWERED_QUESTIONS_INDEX') < 0);
/* An ASSERTION is the mechanic stated as a live rule. A struck-through line (~~...~~)
   or one carrying a DEAD marker is the record of the ruling and must pass -- the whole
   point is that the words stay visible with a line through them. And prose about the
   real world ("the telecoms went bankrupt") is history, not a mechanic. */
const ASSERTS = /(daily upkeep on everything|past your income bankrupts|past income and you bankrupt|cost currency per period to maintain)/i;
let liveAsserts = [];
laws.forEach(f => {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  src.split('\n').forEach((line, i) => {
    if (!ASSERTS.test(line)) return;
    const struck = /~~/.test(line) || /DEAD 7\/31\/26/.test(line) || /SUPERSEDED/i.test(line);
    if (!struck) liveAsserts.push(f + ':' + (i + 1));
  });
});
ok('C2 NO LAW OR RECORD STILL ASSERTS UPKEEP/BANKRUPTCY AS LIVE (' + laws.length +
   ' swept)' + (liveAsserts.length ? ' -> ' + liveAsserts.join(', ') : ''),
   liveAsserts.length === 0);
ok('C3 and the GDD v4 master specifically carries the strike, since it outranks the addendum',
   /~~\*\*daily upkeep on everything/i.test(
     fs.readFileSync(path.join(ROOT, 'laws/BOHEMIA_GDD_v4.md'), 'utf8')));

/* PART D — the pendings stay pending */
[['the building catalog', /building catalog/i],
 ['whether degradation needs a cost', /degradation still needs a cost/i],
 ['the zone naming', /naming of the zones/i]
].forEach(([what, re]) => {
  /* THE WINDOW IS TAKEN FROM THE COLLAPSED TEXT AROUND THE MATCH. The first version
     built a regex with [^\n]* against text that had just been whitespace-collapsed,
     so it matched the entire document and every pending "passed" no matter what.
     Caught by mutating a pending to a filled-in value and watching the gate stay
     green -- which is the only reason this line is right. A check you have not seen
     FAIL is not a check. */
  /* SCOPED TO THE ITEM, not to a character count -- see the same fix and the same
     reasoning in gates/traumatic_gate.js, where a flat window passed a filled-in
     pending because the NEXT bullet's [PENDING Paolo] fell inside it. Two gates in
     one turn with the same bug, so both are fixed the same way. */
  const m = re.exec(law);
  let near = '';
  if (m) {
    near = law.slice(m.index, m.index + 400);
    const nextBullet = near.indexOf(' - ', 1);
    if (nextBullet > 0) near = near.slice(0, nextBullet);
  }
  ok('D1 STILL PENDING, not quietly filled in: ' + what,
     !!m && /\[PENDING Paolo\]/.test(near));
});

console.log('='.repeat(74));
console.log('  EARNED NOT AFFORDED GATE: ' + pass + ' pass / ' + fail + ' fail');
console.log('='.repeat(74));
process.exit(fail ? 1 : 0);
