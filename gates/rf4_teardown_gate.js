#!/usr/bin/env node
/* ============================================================================
   RF4 TEARDOWN SPEC GATE (LAB lane, 8/17/26)

   Paolo 8/17: "For combat, I completely just want to. I really need you to
   re-create rogue fable four holy shit please."
   Paolo 8/16, LOCKED: "the reference lab and the combat chats are going to be
   working together to make a live recreation of Rogue Fable 4 for our game bar
   none. idc if its a rip off. we are going to do this right!!!"

   laws/BOHEMIA_ADDENDUM_RECREATE_RF4_FIRST_8_16_26.md §4 puts TWO CHATS on ONE
   SYSTEM and names the seam as a FILE to stop them colliding:
     LAB owns the teardown spec + the measured diff. LAB WRITES NO COMBAT CODE.
     COMBAT owns the implementation and the STATUS column.
     Neither lane edits the other's column.

   This gate holds that seam. It checks four things a machine can actually check:
     1. the spec exists in the mandated shape, numbered, with a status per item
     2. every BOHEMIA TODAY number is RE-DERIVED off the running fight, so no
        status can be justified by a sentence I typed
     3. LAB stayed on its side of the seam (no combat code in this lane's diff)
     4. the research honesty survives: the items whose PRIMARY SOURCE IS
        EGRESS-BLOCKED stay marked [SECONDHAND], because COMBAT is about to
        build off this file and a lead dressed as a fact is how that goes wrong

   ★ AND IT DOES NOT DEMAND RF4's NUMBERS. Encounter size is 8 in every fight
   against RF4's 3-6, but EIGHT IS NOT A RULING and 3-6 is not one either -- the
   6/27 addendum uses eight as the STRESS CASE. A GATE MUST NEVER OUTRANK A
   RULING, so this gate demands the divergence stay MEASURED AND DECLARED until
   COMBAT or Paolo rules on the curve. When the curve lands it goes red and the
   spec gets rewritten, rather than quietly becoming false -- the same design as
   civ5_gate D4, which caught its own finding expiring on 8/13.

   REUSE CHECK: cooks no graphic pixels. The measurement comes from
   tools/bohemia_rf4_teardown_measure.js, which itself reuses the
   drive-into-the-combat-frame path from gates/fight_moves_you_gate.js.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { measure, RF4_LO, RF4_HI } = require('../tools/bohemia_rf4_teardown_measure.js');

const ROOT = path.join(__dirname, '..');
const SPEC = 'records/BOHEMIA_RF4_TEARDOWN_SPEC.md';
const LAW = 'laws/BOHEMIA_ADDENDUM_RECREATE_RF4_FIRST_8_16_26.md';
const DNA = 'laws/BOHEMIA_ADDENDUM_COMBAT_DNA_RF4_6_30_26.md';
const MOVES = 'laws/BOHEMIA_ADDENDUM_THE_FIGHT_HAS_TO_MOVE_YOU_8_15_26.md';

let pass = 0; const fails = [];
const ok = (n, c) => { if (c) { pass++; console.log('  PASS ' + n); } else { fails.push(n); console.log('  FAIL ' + n); } };

(async () => {
  /* ---- A. THE MANDATE AND THE SHAPE ------------------------------------- */
  ok('A1 the 8/16 law that mandates this file still exists', fs.existsSync(path.join(ROOT, LAW)));
  ok('A2 the spec exists at the path the law names', fs.existsSync(path.join(ROOT, SPEC)));
  ok('A3 the 6/30 DNA doc still exists (the law says nothing in it is repealed)',
     fs.existsSync(path.join(ROOT, DNA)));
  if (fails.length) return report();

  const spec = fs.readFileSync(path.join(ROOT, SPEC), 'utf8');
  /* ★ prose checks run WHITESPACE-COLLAPSED. Hard-wrapped markdown has broken
     exact-match assertions in this lane six separate times now. */
  const flat = spec.replace(/\s+/g, ' ');

  const items = [...spec.matchAll(/\*\*RF4-(\d\d)\*\*/g)].map(m => +m[1]);
  const uniq = [...new Set(items)];
  ok(`A4 the spec is NUMBERED (${uniq.length} items) and the numbers are unique`,
     uniq.length >= 20 && uniq.length === items.length);
  ok('A5 the numbers run 1..N with no gaps',
     uniq.sort((a, b) => a - b).every((n, i) => n === i + 1));

  /* every item must carry exactly one of the three statuses the law names */
  const rows = spec.split('\n').filter(l => /\*\*RF4-\d\d\*\*/.test(l) && l.startsWith('|'));
  const STAT = /\|\s*(SPECED|BUILT|DIFFERS-ON-PURPOSE)\s*\|?\s*$/;
  const bad = rows.filter(l => !STAT.test(l.trim()));
  ok(`A6 every numbered row ends in a STATUS the law defines (${rows.length} rows)`
     + (bad.length ? ' -> ' + bad.length + ' missing' : ''),
     rows.length === uniq.length && bad.length === 0);
  ok('A7 the column-ownership rule is stated so COMBAT knows what not to edit',
     /Neither lane edits the other/i.test(flat) && /LAB does not move a status to BUILT/i.test(flat));

  /* ---- B. MEASURE THE REAL FIGHT ---------------------------------------- */
  const m = await measure();
  ok('B1 the combat frame was really reached and driven', m.reached === true);
  if (!m.reached) return report();
  ok(`B2 no page errors while measuring (${m.errors.length})`, m.errors.length === 0);
  ok(`B3 the measurement is real (${m.bodies} bodies across ${m.arenas} arenas)`,
     m.bodies > 0 && m.counts.length === m.arenas);

  /* ---- C. RF4-20, THE BIG DIVERGENCE ------------------------------------ */
  ok(`C1 ★ encounter size MEASURED: min ${m.encMin} max ${m.encMax} mean ${m.encMean}, `
     + `inside RF4's ${RF4_LO}-${RF4_HI}: ${m.inBand}/${m.arenas}`, true);
  ok(`C2 the spec states the SAME measured numbers it was written from`,
     new RegExp('MEASURED: ' + m.encMean + '\\.0 per fight\\. min ' + m.encMin
                + ', max ' + m.encMax, 'i').test(flat)
     || new RegExp('min ' + m.encMin + ', max ' + m.encMax + ', across ' + m.arenas + ' arenas', 'i').test(flat));
  ok(`C3 and the SAME in-band count (${m.inBand} of ${m.arenas})`,
     new RegExp('INSIDE RF4.S ' + RF4_LO + '-' + RF4_HI + ' BAND: ' + m.inBand + ' OF ' + m.arenas, 'i').test(flat));
  const diverges = m.inBand < m.arenas;
  ok('C4 while the fight diverges from RF4, the spec DECLARES it rather than smoothing it',
     !diverges || (/the single largest measured divergence/i.test(flat) &&
                   /the ceiling shipped as the constant/i.test(flat)));
  ok('C5 and it PROVES eight was never a ruling before anyone is blamed for it',
     !diverges || (/STRESS CASE/i.test(flat) && /One enemy or eight/i.test(flat) &&
                   /explicit design axis/i.test(flat)));
  ok('C6 A GATE MUST NEVER OUTRANK A RULING: this gate does not demand 3-6',
     /does not demand RF4.s NUMBERS/i.test(fs.readFileSync(__filename, 'utf8')));
  ok('C7 the spec hands the encounter CURVE to COMBAT rather than picking it',
     /WHAT COMBAT DECIDES HERE, AND LAB MUST NOT/i.test(flat) && /the curve is design/i.test(flat));

  /* ---- D. THE BUILT ITEMS ARE ACTUALLY BUILT ---------------------------- */
  /* A status of BUILT has to correspond to something in the running fight, or
     the spec is a wish list with confident formatting. */
  ok(`D1 RF4-17 cover/LOS is genuinely in the fight (${m.cover.length} fns)`, m.cover.length >= 5);
  ok(`D2 RF4-16 environment genuinely fights back (${m.environment.length} fns)`, m.environment.length >= 5);
  ok(`D3 RF4-02 field readouts genuinely exist (${m.readouts.length} fns)`, m.readouts.length >= 4);
  ok(`D4 RF4-18 ranges genuinely exist (${m.ranges.length} fns)`, m.ranges.length >= 5);
  ok(`D5 RF4-03 target selection genuinely exists (${m.targeting.length} fns)`, m.targeting.length >= 3);
  ok(`D6 RF4-19 the way out is genuinely wired (${m.exitWire.join(', ')})`, m.exitWire.length === 2);
  ok(`D7 RF4-14/25 no stat mitigation: armor is 0 on all ${m.bodies} bodies`, m.armored === 0);
  ok('D8 and the spec cites the armor-always-0 smell under RF4-04 unification',
     /a stat that exists and never does anything/i.test(flat));

  /* ---- E. THE GAPS STAY GAPS, AND ARE NOT OVERSTATED -------------------- */
  ok('E1 RF4-07 POWER really is absent', m.powerStat.length === 0 && /\*\*ABSENT\.\*\*/i.test(flat));
  ok('E2 RF4-10 there really is no ability system', m.abilityFns.length === 0);
  ok(`E3 but RF4-13 credits the verbs that DO exist, so the gap is not overstated (${m.verbs.length})`,
     m.verbs.length >= 6 && /the gap is narrower than it sounds/i.test(flat));
  ok(`E4 RF4-21 credits the roster depth: ${m.types} types, ${m.hpTiers} hp tiers, ${m.elite} elite`,
     m.types >= 5 && m.hpTiers >= 8 && m.elite > 0 && /better than expected/i.test(flat));
  ok('E5 RF4-22 is marked NOT MEASURED instead of guessed',
     /\*\*NOT MEASURED\.\*\*/i.test(flat) && /Flagged, not guessed/i.test(flat));

  /* ---- F. RESEARCH HONESTY: THE BLOCKED SOURCES ------------------------- */
  /* COMBAT is about to build off this file. The three items at the heart of the
     recreation came from search summaries because every primary domain is
     egress-blocked here. If that admission is ever edited out, somebody
     implements a number off a lead. */
  ok('F1 the confidence marking scheme is defined', /\[PRIMARY\]/.test(flat) && /\[SECONDHAND\]/.test(flat));
  ok('F2 the spec says WHY the trinity items are secondhand (the proxy blocks the sources)',
     /egress-blocked/i.test(flat) && /could not open them/i.test(flat));
  ok('F3 ★ and it forbids COMBAT implementing numbers off a secondhand item',
     /should not implement a number off one/i.test(flat) &&
     /COMBAT must not implement numbers off them/i.test(flat));
  ok('F4 the three weakest items are named explicitly, not left for COMBAT to discover',
     /RF4-05, RF4-08 and RF4-10/.test(flat));

  /* ---- G. THE LANE SEAM ------------------------------------------------- */
  ok('G1 the spec states LAB WROTE NO COMBAT CODE', /LAB WROTE NO COMBAT CODE/i.test(flat));
  ok('G2 and cites the law that assigns the fight to COMBAT',
     /COMBAT owns this/i.test(flat) && fs.existsSync(path.join(ROOT, MOVES)));
  /* the machine half of G1: this lane's own commit must not touch combat code */
  /* ★ G3 HAD A HOLE ON ITS FIRST WRITE, caught by mutation testing: it only ran
     `git diff origin/main...HEAD`, which sees COMMITTED history. I appended a line to
     engine/bohemia_claim.js, staged it, and the gate passed 39/0 -- the exact seam
     crossing it exists to catch, invisible because it had not been committed yet.
     A boundary check that only notices after you commit tells you too late. It now
     unions the committed diff, the STAGED diff and the WORKING TREE. */
  let touched = '';
  for (const cmd of ['git diff --name-only origin/main...HEAD',
                     'git diff --name-only --cached',
                     'git diff --name-only',
                     'git ls-files --others --exclude-standard']) {
    try { touched += execSync(cmd, { cwd: ROOT }).toString() + '\n'; } catch (e) { }
  }
  const combatish = touched.split('\n').filter(f =>
    /^engine\/|^slices\/.*\.html$/.test(f.trim()) && f.trim());
  /* ★ AND G3 HAD A SECOND HOLE, THE OPPOSITE ONE: it forbade the thing the law
     REQUIRES. The column rule gives STATUS to COMBAT ("LAB does not move a
     status to BUILT"), and COMBAT is by definition the lane that edits slices --
     so the moment COMBAT marked an item BUILT, this went red for doing its job.
     A gate must never outrank a ruling, so it now tests the REAL invariant:
     LAB-OWNED COLUMNS AND CODE MUST NOT MOVE TOGETHER. A status-only edit beside
     a slice change is COMBAT doing exactly what it was told; anything touching
     the RF4 MECHANIC / SOURCE / BOHEMIA TODAY columns beside code is the seam
     crossing this exists to catch. Same intent, correct scope. */
  const rowKey = l => (l.match(/\*\*RF4-(\d\d)\*\*/) || [])[1];
  const nonStatus = l => l.split('|').slice(0, -2).join('|');
  let labEdit = false, labWhy = '';
  try {
    const was = execSync('git show origin/main:' + SPEC, { cwd: ROOT }).toString();
    const wasRows = {}, nowRows = {};
    was.split('\n').forEach(l => { const k = rowKey(l); if (k) wasRows[k] = l; });
    spec.split('\n').forEach(l => { const k = rowKey(l); if (k) nowRows[k] = l; });
    for (const k of Object.keys(nowRows)) {
      if (!wasRows[k]) { labEdit = true; labWhy = 'new row RF4-' + k; break; }
      if (nonStatus(wasRows[k]) !== nonStatus(nowRows[k])) {
        labEdit = true; labWhy = 'RF4-' + k + ' changed outside the STATUS column'; break; }
    }
    /* prose outside the table is LAB's too */
    const strip = t => t.split('\n').filter(l => !rowKey(l)).join('\n');
    if (!labEdit && strip(was) !== strip(spec)) { labEdit = true; labWhy = 'spec prose changed'; }
  } catch (e) { labEdit = true; labWhy = 'could not read the spec at origin/main'; }
  ok('G3 ★ LAB\'s columns and combat code never move together'
     + (labEdit && combatish.length ? ' -> ' + labWhy + ' beside ' + combatish.join(', ') : ''),
     !(labEdit && combatish.length));
  ok('G4 the expression line is honoured: no RF4 name is adopted as a Bohemia name',
     /never as a Bohemia name/i.test(flat) && /GAME MECHANICS AND SYSTEMS ARE NOT COPYRIGHTABLE/i
       .test(fs.readFileSync(path.join(ROOT, LAW), 'utf8').replace(/\s+/g, ' ')));
  ok('G5 NO DAMAGE BEFORE THE DIAL is cited as why LAB set no combat numbers',
     /NO DAMAGE BEFORE THE DIAL/i.test(flat));

  report();
})().catch(e => { console.log('  FAIL crashed: ' + e.message); fails.push('crash'); report(); });

function report() {
  console.log('='.repeat(74));
  console.log(`  RF4 TEARDOWN GATE: ${pass} pass / ${fails.length} fail`);
  console.log('='.repeat(74));
  process.exit(fails.length ? 1 : 0);
}
