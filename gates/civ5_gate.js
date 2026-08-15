#!/usr/bin/env node
/* BOHEMIA — CIV 5 REFERENCE GATE (LAB lane, 8/13/26)
 *
 * Paolo 8/13: "do big brain research into civilization five and all of the technologies in
 * the tech tree. This may help you with your goals."
 *
 * A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and a RESEARCH FINDING without one rots
 * into a thing somebody once said. This gate re-measures the vendored Civ 5 tree and OUR
 * OWN boss ladder on every run, and fails if any number claimed in
 * records/BOHEMIA_RESEARCH_CIV5_TECHTREE_8_13_26.md has drifted from what the data says.
 *
 * IT EXISTS BECAUSE I ALREADY GOT TWO NUMBERS WRONG WRITING THAT FILE:
 *   1. I reported a 43%-units / 43%-buildings split per era as a design finding. It was a
 *      CORRUPT COLUMN -- buildings_enabled is a verbatim copy of units_enabled in 81 of 81
 *      source nodes. A perfect 1:1 match across eight independent eras is a tell, not a
 *      result. (Check C.)
 *   2. I hand-typed "236 prerequisite edges" into the comparison table from nothing at all.
 *      It is 130. (Check A6.)
 * Both were caught by measuring instead of remembering, which is the only reason this file
 * is worth having.
 *
 * ★ AND THE LADDER HALF IS THE POINT. The gap table in the record ("our ladder is a LINE,
 * fan of 1, zero prereq edges") is measured off the LIVE ladder, not copied. So the day
 * somebody adds a prerequisite column to the ladder, THIS GATE GOES RED and forces the
 * record to be rewritten instead of quietly becoming false. A finding about our own work
 * has to track our own work.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { measureCiv, measureLadder } = require('../tools/bohemia_civ5_measure.js');

const REF = 'records/BOHEMIA_REF_CIV5_TECHTREE_BNW.json';
const REC = 'records/BOHEMIA_RESEARCH_CIV5_TECHTREE_8_13_26.md';
const LADDER = 'records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md';

let pass = 0; const fails = [];
const ok = (name, cond) => { if (cond) pass++; else fails.push(name); };

/* ---- A. THE MEASUREMENT IS REPRODUCIBLE ---------------------------------- */
ok('A1 the vendored Civ 5 reference dataset exists', fs.existsSync(path.join(ROOT, REF)));
ok('A2 the research record exists', fs.existsSync(path.join(ROOT, REC)));
if (fails.length) { report(); process.exit(1); }

const rec = fs.readFileSync(path.join(ROOT, REC), 'utf8');
/* ★ prose assertions run on a WHITESPACE-COLLAPSED copy. Hard-wrapped markdown breaks
   every exact-match check across a newline, and this lane has shipped that bug three
   separate times. */
const flat = rec.replace(/\s+/g, ' ');
const civ = measureCiv();
const boh = measureLadder();

ok('A3 the reference tree is 81 nodes', civ.nodes === 81);
ok('A4 it spans 8 eras', civ.eras === 8);
ok('A5 the tree is 18 tiers deep', civ.tiers === 18);
ok('A6 the prereq edge count is MEASURED, and the record states it (' + civ.edges + ')',
   civ.edges === 130 && flat.includes('| **' + civ.edges + '** | **0** |'));
ok('A7 the record states the true node count', flat.includes('technologies | **' + civ.nodes + '**'));
ok('A8 the record states the true tier depth', flat.includes('total tiers deep | **' + civ.tiers + '**'));

/* ---- B. THE FIVE FINDINGS ARE THE ONES THE DATA SUPPORTS ----------------- */
/* B1 THE CHOICE FAN. This is the load-bearing finding: 3-7 for 91% of the game, median 4,
   and 1 only at the endpoints. If the dataset ever changes such that the band moves, the
   headline claim is wrong and must not stand. */
ok('B1 the choice fan really does sit at median ' + civ.fanMedian + ', max ' + civ.fanMax,
   civ.fanMedian === 4 && civ.fanMax === 7);
/* ★ B2 originally hunted a phrasing I had GUESSED ("It is **1** exactly three times") rather
   than the claim, and failed on prose that states the claim correctly. Same bug family this
   lane has now hit sixteen times: a checker that hunts a WORD instead of a THING. Fixed the
   ruler, not the record. It now asserts the two SUBSTANTIVE claims -- fan is a held constant,
   and it bottoms out at 1 exactly three times -- in a phrasing-independent way. */
ok('B2 and the record leads with the fan as a HELD CONSTANT, not an accident',
   /THE CHOICE FAN IS A HELD CONSTANT/.test(flat) &&
   /exactly three times/.test(flat) && /\bIt is\b[^.]{0,30}\b1\b/.test(flat));
ok('B3 an era is 2-3 tiers deep and five of eight span exactly 2',
   civ.eraSpanMin === 2 && civ.eraSpanMax === 3 && civ.eraSpansOfTwo === 5);
ok('B4 the record says FIVE of eight, not six (the generator corrected my eyeball)',
   /five of the eight span exactly \*\*2\*\*/i.test(flat));
ok('B5 every tech leads somewhere: 2 terminals in 81',
   civ.terminals.length === 2 && flat.includes('**2 of 81**'));
ok('B6 the cost step DECAYS rather than compounding (3.17x -> 1.45x)',
   civ.eraStepFirst > civ.eraStepLast &&
   civ.eraStepFirst.toFixed(2) === '3.17' && civ.eraStepLast.toFixed(2) === '1.45');
ok('B7 the record states the decay as a decay, not as growth',
   /era-to-era cost step \| \*\*decays\*\*/.test(flat));
ok('B8 a playthrough takes a FRACTION: Gunpowder on 15 of 81',
   civ.beelineGunpowder === 15 && flat.includes('**15 of 81 techs = 19% of the tree**'));
ok('B9 and the endgame is near-total: Future Tech needs 80 of 81',
   civ.beelineFuture === 80 && flat.includes('**80 of 81 = 99%**'));
ok('B10 unlocks per tech front-load (Ancient richer than Information)',
   civ.unlocksPerTechEarly > civ.unlocksPerTechLate);
ok('B11 the root gates the entire tree', civ.rootGates === civ.nodes - 1);

/* ---- C. THE CORRUPT COLUMN STAYS NAMED AND STAYS DELETED ----------------- */
/* The single most useful thing in the record is the admission that I reported a corrupt
   column as a finding. If that admission is ever edited out, the gate fails: the next
   session needs to know the building data does not exist. */
const ref = JSON.parse(fs.readFileSync(path.join(ROOT, REF), 'utf8'));
ok('C1 the vendored copy carries NO buildings_enabled column at all',
   ref.every(t => !('buildings_enabled' in t)));
ok('C2 the record NAMES the corruption and says it was 81 of 81',
   /verbatim copy of `units_enabled` in 81 of 81/.test(flat));
ok('C3 the record ADMITS I wrote the bad 43/43 split down as a result before checking',
   /I had already written that 43\/43 split down as a result before I checked it/.test(flat));
ok('C4 the record states plainly that BUILDING COUNTS ARE NOT AVAILABLE',
   /building counts/i.test(flat) && /Nothing below\s*reports one|reports one/.test(flat));
ok('C5 and the measurer itself never reports a building count',
   !/buildings_enabled/.test(
     fs.readFileSync(path.join(ROOT, 'tools/bohemia_civ5_measure.js'), 'utf8')
       .split('module.exports')[0].replace(/\/\*[\s\S]*?\*\//g, '')));

/* ---- D. THE GAP TABLE TRACKS THE LIVE LADDER ----------------------------- */
/* THIS is the check that earns its keep. The record claims our ladder is a line with a fan
   of 1 and zero prereq edges. That is true TODAY. The moment a prereq column lands, the
   claim is false -- so it is measured, never trusted. */
const lad = fs.readFileSync(path.join(ROOT, LADDER), 'utf8');
ok('D1 the live ladder is still the file the record compares against', fs.existsSync(path.join(ROOT, LADDER)));
ok('D2 the ladder node count in the record matches the live ladder (' + boh.nodes + ')',
   flat.includes('| ' + civ.nodes + ' | ' + boh.nodes + ' |'));
ok('D3 the act split in the record matches the live ladder (' + boh.perAct.join('/') + ')',
   flat.includes(boh.perAct.join(' / ')));
/* ★ D4 DID ITS JOB ON 8/13 AND THIS IS WHAT THAT LOOKS LIKE. It used to assert the ladder
   had ZERO prerequisite edges, which was the finding. Then he ruled "Sure" and a graph was
   built, so the finding went stale -- exactly the event this check was written to catch. It
   now demands the record ACKNOWLEDGE the graph rather than pretend the ladder is still a
   line. A gate that guards a fact must change when the fact does, or it starts defending a
   lie. (What it must never do is get deleted so the stale claim can stand.) */
const graphExists = fs.existsSync(path.join(ROOT, 'records/BOHEMIA_LADDER_GRAPH_8_13_26.json'));
ok('D4 if a prerequisite graph exists, the record ADMITS the line-finding is now history',
   !graphExists || (/this finding is now history/i.test(flat) &&
                    /SNAPSHOT of 8\/13 morning/i.test(flat)));
ok('D4b and it records that he reached 4-6 independently of the Civ 5 measurement',
   !graphExists || /without being shown it/i.test(flat));
ok('D5 the record states the ladder fan is 1 and Civ 5 is not',
   /\*\*1, always\*\*/.test(flat) && /median 4/.test(flat));
ok('D6 the record calls our ladder a LINE in those words',
   /OUR LADDER IS A LINE AND CIV 5 IS A GRAPH/.test(flat));

/* ---- E. IT DOES NOT QUIETLY REDESIGN HIS GAME ---------------------------- */
/* STOP PRODUCING + MECHANISM-MINE/CONTENTS-PAOLO'S. Research may diagnose. It may not
   draw the edges, and it may not cut his bosses to fit a reference game's shape. */
ok('E1 the record explicitly declines to draw the edges itself',
   /I am \*\*not\*\* drawing the edges/.test(flat));
ok('E2 it says which half is his: the column is mechanism, the contents are his',
   /MECHANISM-MINE \/ CONTENTS-PAOLO'S/.test(flat));
ok('E3 it does NOT propose cutting bosses to fit Civ 5 (the act sizes already fit)',
   /the 53 do not need cutting to fit this shape/i.test(flat));
ok('E4 and it reports the encouraging half too, not just the defect',
   /THE ACT SIZES ARE ALREADY RIGHT/.test(flat));
ok('E5 the ladder file itself was NOT edited by this research',
   /53 CANDIDATES|THIS IS THE LIVE LADDER/i.test(lad));

/* ---- F. HONESTY ABOUT WHAT THE TECH LIST IS WORTH ------------------------ */
ok('F1 the record admits the original hope (mine 81 names for bosses) was the weaker half',
   /weak source of bosses and a strong source of ORDERING/.test(flat));
ok('F2 sources are cited, including that the dataset is a transcription not a game dump',
   /neoddish\/Civ-TechTree/.test(flat) && /transcrib/i.test(flat));
ok('F3 the record names the tab situation (it is not in one)', /NOT IN A TAB YET/.test(flat));

function report() {
  console.log('='.repeat(74));
  fails.forEach(f => console.log('  FAIL: ' + f));
  console.log(`  CIV 5 REFERENCE GATE: ${pass} pass / ${fails.length} fail`);
  if (!fails.length) {
    console.log(`  civ5: ${civ.nodes} techs · ${civ.edges} edges · ${civ.tiers} tiers · `
      + `fan ${civ.fanMin}-${civ.fanMax} (med ${civ.fanMedian})`);
    console.log(`  ours: ${boh.nodes} bosses · ${boh.prereqEdges} edges · ${boh.tiers} tiers · `
      + `fan ${boh.fan}` + (boh.isGraph ? ` (A GRAPH since 8/13, opening fan ${boh.openingFan})`
                                        : ' (still a LINE)'));
  }
  console.log('='.repeat(74));
}
report();
process.exit(fails.length ? 1 : 0);
