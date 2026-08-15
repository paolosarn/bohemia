#!/usr/bin/env node
/* BOHEMIA — LADDER GRAPH GATE (LAB lane, 8/13/26)
 *
 * Paolo 8/13 approved the prerequisite column ("Sure") and specified it in the same breath:
 * the live menu holds 4 to 6, a prerequisite may be a boss OR a quest, and -- the big one --
 * NOT EVERY NODE IS A BOSS, because "the idea is that it's something that's ACQUIRED so it
 * doesn't have to maybe not killing or persuading a particular person like it's just a quest."
 *
 * This gate holds three things the machine can actually check:
 *   1. the graph is LEGAL (a DAG over real ladder rows, every edge carrying its reason)
 *   2. his rulings are recorded VERBATIM and not softened
 *   3. THE GAP IS DECLARED. Physical necessity opens 20 doors and he asked for 4-6. That gap
 *      is the honest headline of this build and it must not be quietly closed by me inventing
 *      14 gates, nor quietly hidden by not mentioning it.
 *
 * ★ WHY CHECK 3 IS THE ONE THAT MATTERS. The tempting move was to invent enough edges to hit
 * 4-6 and present a graph that matches his number. That would have meant making fourteen
 * design decisions about how his game is played and burying them in a data file where they
 * look like physics. STOP PRODUCING names that shape exactly: finding a legal way to ship the
 * thing anyway IS the violation. So the gate fails if the quest gates are filled in without a
 * ruling, AND it fails if the shortfall stops being stated out loud.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { build, FAN_LO, FAN_HI } = require('../tools/bohemia_ladder_graph.js');

const RULINGS = 'records/BOHEMIA_HIS_GRAPH_RULINGS_8_13_26.md';
const GRAPH = 'records/BOHEMIA_LADDER_GRAPH_8_13_26.json';
const LADDER = 'records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md';

let pass = 0; const fails = [];
const ok = (n, c) => { if (c) pass++; else fails.push(n); };

ok('A1 his rulings are recorded in their own file', fs.existsSync(path.join(ROOT, RULINGS)));
ok('A2 the graph data exists', fs.existsSync(path.join(ROOT, GRAPH)));
if (fails.length) { report(); process.exit(1); }

const rul = fs.readFileSync(path.join(ROOT, RULINGS), 'utf8');
/* ★ prose checks run on a WHITESPACE-COLLAPSED copy. Hard-wrapped markdown has broken
   exact-match assertions in this lane four separate times now. */
const flat = rul.replace(/\s+/g, ' ');
const g = JSON.parse(fs.readFileSync(path.join(ROOT, GRAPH), 'utf8'));
const r = build();

/* ---- B. THE GRAPH IS LEGAL ---------------------------------------------- */
ok('B1 every edge endpoint is a real ladder row' +
   (r.unknownEndpoints.length ? ' -> ' + r.unknownEndpoints.join(', ') : ''),
   r.unknownEndpoints.length === 0);
ok('B2 THE GRAPH IS ACYCLIC (a cycle means a node gates itself and nothing opens)' +
   (r.cycles.length ? ' -> ' + r.cycles.join(' | ') : ''),
   r.cycles.length === 0);
ok('B3 every edge carries a REASON long enough to be an argument (' +
   r.edgesMissingReason + ' too short)', r.edgesMissingReason === 0);
ok('B4 the graph actually has edges (' + r.edges + ')', r.edges >= 30);
ok('B5 the whole ladder is reachable: the fan walk consumed all 53 nodes',
   r.fan.length === r.nodes);
/* an edge whose reason does not mention either endpoint's own vocabulary is me asserting a
   dependency rather than reading one off the rows */
const lad = fs.readFileSync(path.join(ROOT, LADDER), 'utf8');
ok('B6 no edge points a node at itself', g.edges.every(e => e.to !== e.from));
ok('B7 no duplicate edges', new Set(g.edges.map(e => e.from + '>' + e.to)).size === g.edges.length);

/* ---- C. THE SHAPE IS ACT-SHAPED ----------------------------------------- */
/* Civ 5, measured: an era is 2-3 tiers deep. Three acts at that rate is 6 to 9 tiers.
   The graph came out at 8, which is the one number in this build that landed where the
   reference predicted without being aimed there. */
ok('C1 the graph is ' + r.tiers + ' tiers deep, inside the 6-9 that 3 acts at Civ 5 depth predicts',
   r.tiers >= 6 && r.tiers <= 9);
ok('C2 and the rulings file records that his 4-6 matched the measured Civ 5 fan independently',
   /independent convergence/i.test(flat) && /3 to 7/.test(flat));

/* ---- D. THE GAP IS DECLARED, NOT CLOSED BY ME --------------------------- */
ok('D1 HIS TARGET IS RECORDED AS 4-6 IN HIS OWN WORDS',
   FAN_LO === 4 && FAN_HI === 6 && /5 or 6 of them or four of them/.test(flat));
ok('D2 the opening fan is MEASURED, not asserted (' + r.openingFan + ' roots)',
   r.openingFan === r.roots.length);
/* ★ D3 WAS A TAUTOLOGY ON ITS FIRST WRITE. I wrote a ternary whose two branches were the
   SAME expression, so the condition structure decided nothing -- a check that cannot come out
   two different ways is not a check. And the sentence it guards had a hand-typed "twenty-one"
   in it when the measurement is 20: the THIRD number I have hand-typed wrong in two days.
   So D3 now does the only useful thing: it reads the spelled-out count out of the prose and
   compares it to what the tool measured. */
const WORD = { nineteen: 19, twenty: 20, 'twenty-one': 21, 'twenty-two': 22, eighteen: 18 };
const claimed = (flat.match(/\*\*([A-Za-z-]+)\s+nodes have no prerequisite at all\*\*/) || [])[1];
ok('D3 ★ THE SHORTFALL IS STATED OUT LOUD and its number MATCHES the measurement (prose says '
   + claimed + ', tool measures ' + r.openingFan + ')',
   claimed !== undefined && WORD[claimed.toLowerCase()] === r.openingFan &&
   r.openingFan > FAN_HI && /Physical necessity cannot get us to 4-6/i.test(flat));
ok('D4 and the rulings file names the tool that closes it as HIS, not mine',
   /Which nodes sit behind a quest is content, and content is his/i.test(flat));
ok('D5 THE QUEST GATES ARE EMPTY -- filling in 14 of them myself would be inventing his game',
   r.questGates === 0);
ok('D6 the graph file says out loud that quest_gates is deliberately empty',
   /deliberately EMPTY/i.test(JSON.stringify(g)));

/* ---- E. R-ACQUIRED: NOT EVERYTHING IS A BOSS ---------------------------- */
/* This is the largest of his rulings and the easiest to let slide, because acting on it
   properly means admitting the artifact is misnamed. */
ok('E1 the ROUTE mechanism exists with all three types defined',
   g.routes && g.routes._types && ['BOSS', 'QUEST', 'FOUND'].every(t => t in g.routes._types));
ok('E2 the routes table is EMPTY except where he actually ruled (' + r.routesDeclared + ' of ' +
   r.nodes + ')', r.routesDeclared >= 1 && r.routesDeclared <= 2);
ok('E3 THE POT is declared BOSS because he called it "the first boss" in his own words',
   g.routes['THE POT'] === 'BOSS');
ok('E4 the rulings file states the unit of the ladder is the ACQUISITION, not the fight',
   /the unit of the ladder is the ACQUISITION, not the fight/i.test(flat));
ok('E5 and it flags the RENAME as his call rather than quietly renaming his file',
   /\[PENDING Paolo\] on the rename/i.test(flat));
ok('E6 the ladder file has NOT been renamed or retitled behind his back',
   /THE BOSS LADDER/i.test(lad));

/* ---- F. THE NARRATIVE TRIANGLE IS RECORDED AS AN UNSOLVED PROBLEM ------- */
/* He gave three constraints that fight each other. Writing them down as a solved thing
   would be the lie; they are recorded as a vice with nothing built. */
ok('F1 the Valheim complaint is recorded: it gives NO narrative and that is the failure',
   /Valheim/i.test(flat) && /a little/i.test(flat));
ok('F2 the no-cutscene constraint is recorded as a HARD constraint on delivery',
   /never a cutscene|cannot be delivered as a cutscene/i.test(flat));
ok('F3 the anti-MMO constraint is recorded, with WHY the cheap fix is banned',
   /MMO quest log/i.test(flat) && /markers/i.test(flat));
ok('F4 ★ and the three are presented as an UNSOLVED vice, not answered with a feature',
   /it is not solved here/i.test(flat));
ok('F5 no surface, tab or feature was shipped for the narrative problem this turn',
   !fs.existsSync(path.join(ROOT, 'slices/BOHEMIA_QUEST_NARRATIVE_8_13_26.html')));

/* ---- G. THE LADDER ROWS THEMSELVES WERE NOT REWRITTEN ------------------- */
/* The graph is a NEW file beside the ladder. Adding 53 prereq cells into his ladder rows
   would be an eighth rebuild of a file he has already judged seven times. */
ok('G1 the live ladder still holds 53 rows and was not restructured', r.nodes === 53);
ok('G2 the ladder still has its original six columns (no column was forced into it)',
   /\|\s*#\s*\|\s*BOSS\s*\|\s*HOLDS\s*\|[^|]*\|[^|]*\|\s*KIND\s*\|/.test(lad));

function report() {
  console.log('='.repeat(74));
  fails.forEach(f => console.log('  FAIL: ' + f));
  console.log(`  LADDER GRAPH GATE: ${pass} pass / ${fails.length} fail`);
  if (!fails.length) {
    console.log(`  ${r.nodes} nodes · ${r.edges} edges · ${r.tiers} tiers · fan ${r.fanMin}-${r.fanMax}` +
      ` (med ${r.fanMedian}) · opening ${r.openingFan} vs his target ${FAN_LO}-${FAN_HI}`);
    console.log(`  ${r.gatesNeededToHitTarget} quest gates still needed, ${r.questGates} declared` +
      ` -- HIS CALL, and the gate fails if I declare them`);
  }
  console.log('='.repeat(74));
}
report();
process.exit(fails.length ? 1 : 0);
