#!/usr/bin/env node
/* ============================================================================
   BATTLE BROTHERS REFERENCE STUDY GATE (LAB lane, 8/18/26)

   Paolo 8/18: "fucking look up battle brothers right now right now."

   laws/BOHEMIA_ADDENDUM_THE_REFERENCE_LAB_7_26_26.md: one session = one system =
   one named game. He named the game. LAB WRITES NO COMBAT CODE.

   WHY A RESEARCH RECORD NEEDS A GATE AT ALL: A LAW WITHOUT A MACHINE GATE IS NOT
   ENFORCED, and the 7/16 sweep found six of nine gated laws already broken. A
   study's failure mode is not that it crashes -- it is that its load-bearing
   findings get softened, its refusals get quietly dropped, or LAB starts deciding
   things that are Paolo's. This gate holds four things:

     1. the study exists and stays cross-referenced to the RF4 teardown, because
        the two references AGREE on some things and CONTRADICT on others, and the
        contradiction is the most valuable finding in it
     2. THE REFUSAL SURVIVES. Battle Brothers is pure d100 dice with a 5% floor on
        being hit. "Perfect play = zero damage at any enemy count" is LOCKED. Those
        are arithmetically incompatible, so this study must keep saying DO NOT TAKE
        IT. A reference study that forgets what it refused is how a locked law dies.
     3. the forks stay Paolo's -- morale, the wage, and injury re-roling are all
        marked [PENDING, Paolo's call] and LAB does not answer them
     4. LAB stayed on its side of the seam: no engine module, no slice

   ★ AND IT DOES NOT ASSERT THAT ANY OF THIS SHOULD BE BUILT. A reference is not a
   plan. A GATE MUST NEVER OUTRANK A RULING, so every check here is about the
   HONESTY of the record, never about the game adopting it.

   REUSE CHECK: cooks no graphic pixels, so the shopping law does not bind. It
   reads two records files and the laws directory; no new machinery.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const STUDY = 'records/BOHEMIA_BATTLE_BROTHERS_REFERENCE_STUDY_8_18_26.md';
const RF4 = 'records/BOHEMIA_RF4_TEARDOWN_SPEC.md';
const LABLAW = 'laws/BOHEMIA_ADDENDUM_THE_REFERENCE_LAB_7_26_26.md';
const COMBATLAW = 'laws/BOHEMIA_ADDENDUM_COMBAT_6_27_26.md';

let pass = 0; const fails = [];
const ok = (n, c) => { if (c) { pass++; console.log('  PASS ' + n); } else { fails.push(n); console.log('  FAIL ' + n); } };

/* ---- A. IT EXISTS, IN THE LANE'S OWN SHAPE ------------------------------- */
ok('A1 the LAB charter law still exists', fs.existsSync(path.join(ROOT, LABLAW)));
ok('A2 the study exists', fs.existsSync(path.join(ROOT, STUDY)));
if (fails.length) { report(); }

const raw = fs.readFileSync(path.join(ROOT, STUDY), 'utf8');
/* prose checks run WHITESPACE-COLLAPSED: hard-wrapped markdown has broken
   exact-match assertions in this lane seven separate times now. */
const flat = raw.replace(/\s+/g, ' ');

ok('A3 it names ONE game, per one-session-one-named-game',
   /THE NAMED GAME IS|The named game is \*\*Battle Brothers\*\*/i.test(flat));
ok('A4 it names the tab, per NAME THE TAB', /NOT IN A TAB/i.test(flat) && /the fight is the \*\*COMBAT\*\* tab|the fight is the COMBAT tab/i.test(flat));
ok('A5 it declares the sourcing limit rather than implying clean research',
   /blocked by this environment.s\s*egress proxy as organization policy/i.test(flat));
ok('A6 ★ and it does not claim to have routed around a policy denial',
   /report policy denials rather than route around them, so I did not/i.test(flat));
ok('A7 it says Paolo owning the game beats the search channel',
   /one session of him playing beats every line/i.test(flat));

/* ---- B. THE HEADLINE: STRUCTURE, NOT COMBAT ----------------------------- */
/* The reason this study is worth anything is that it answers a question RF4
   cannot: what is a CAMPAIGN. If that framing is lost the file becomes a second
   combat reference competing with the first. */
ok('B1 ★★ the headline is that BB is our STRUCTURAL reference, not another combat one',
   /BATTLE BROTHERS IS THE GAME BOHEMIA.S STRUCTURE ACTUALLY IS/i.test(flat));
ok('B2 and it says why RF4 cannot be that (a one-hour run with a fresh character)',
   /one-hour run with a fresh character/i.test(flat));
ok('B3 ★ it ties to THERE ARE NO RUNS without re-opening it',
   /THERE ARE NO RUNS/i.test(flat) && /No run structure at all|no runs\s*at all/i.test(flat));
ok('B4 it maps the dynasty onto a roster that outlives its bodies',
   /outlives its individual men/i.test(flat));

/* ---- C. THE REFUSAL. THIS IS THE CHECK THAT MATTERS MOST ---------------- */
/* A 5% floor on being hit and "perfect play = zero damage at any enemy count"
   cannot both be true. If a future turn softens this, a locked law has been
   quietly overwritten by a reference game. */
ok('C1 the locked combat addendum still exists', fs.existsSync(path.join(ROOT, COMBATLAW)));
ok('C2 ★★★ the study still states BB is pure dice and REFUSES it',
   /pure RNG/i.test(flat) && /DO NOT TAKE THIS\. IT BREAKS A LOCKED LAW/i.test(flat));
ok('C3 ★★ and it shows the arithmetic, not just an opinion',
   /cannot be lower than 5%/i.test(flat) &&
   /a 5% hit floor contradicts it arithmetically|perfect play cannot produce zero damage/i.test(flat));
ok('C4 it quotes the law it would break',
   /perfect play = zero damage at any enemy count/i.test(flat));
ok('C5 ★ and it notes the two references DISAGREE here, which is the finding',
   /TAKE BATTLE BROTHERS. STRUCTURE\. REFUSE ITS DICE|TAKE BATTLE BROTHERS' STRUCTURE\. REFUSE ITS DICE/i
     .test(flat.replace(/’/g, "'")));

/* ---- D. THE CONVERGENCE FINDINGS ---------------------------------------- */
/* Two independent games landing on the same mechanic is a much stronger signal
   than either alone. These checks keep that reasoning visible. */
ok('D1 ★★ the destructible armour layer is named as CONVERGENT with RF4-05',
   /armor points are reduced instead of hitpoints/i.test(flat) &&
   /convergent design/i.test(flat));
ok('D2 and it is tied to the measured zero on all 320 bodies',
   /is 0 on every one of them/i.test(flat));
ok('D3 ★ where they differ, it recommends RF4\'s absolute rule over BB\'s leak',
   /at least 10% of damage\s*will penetrate armor/i.test(flat) &&
   /RF4.s rule is the one that\s*makes a plan trustworthy/i.test(flat));
ok('D4 ★★ fatigue is identified as SP inverted, with the floor as the transferable part',
   /THE SAME MECHANIC AS RF4.s SPEED POINTS, INVERTED/i.test(flat) &&
   /at least one slash a turn/i.test(flat) &&
   /THE TRANSFERABLE PART IS THE FLOOR/i.test(flat));
ok('D5 fatigue is connected to the stam we already carry',
   /already carries `stam`/i.test(flat));
ok('D6 ★ morale is named as answering RF4-25 (enemies reading each other) cheaply',
   /no enemy\s*reads any other enemy/i.test(flat) &&
   /without any AI coordination at all/i.test(flat));
ok('D7 and every morale trigger is noted as already firing in our combat',
   /already happens in our combat and that we already detect/i.test(flat));
ok('D8 difficulty-without-stat-inflation is logged as a THIRD independent source',
   /THIRD INDEPENDENT SOURCE FOR THE SAME PRINCIPLE/i.test(flat) &&
   /NO DAMAGE BEFORE THE DIAL/i.test(flat));

/* ---- E. THE ECONOMY, WHICH IS THE MOST BOHEMIA-SHAPED PART -------------- */
ok('E1 the daily per-head wage is recorded with its consequence',
   /may decide to desert/i.test(flat) && /payroll is Tuesday/i.test(flat));
ok('E2 ★ and it is framed against his own identity line for the game',
   /most realistic\s*economic crash simulator, but fun/i.test(flat));
ok('E3 levelling raising the wage is kept as the anti-snowball valve',
   /LEVELLING RAISES THE WAGE/i.test(flat) && /anti-snowball valve/i.test(flat));

/* ---- F. PULL HOLES. A STUDY THAT ONLY PRAISES IS USELESS ---------------- */
ok('F1 ★★ the no-endgame-goal flaw is named as BB\'s biggest',
   /it is all for naught/i.test(flat));
ok('F2 ★★ and Bohemia\'s existing answer to it is stated (the one-way Act 3 heir)',
   /the dynasty is not decoration, it is the fix for this game.s biggest\s*failure/i.test(flat));
ok('F3 the difficulty curve breaking at both ends is logged as a perk-tree warning',
   /insultingly easy battle/i.test(flat));
ok('F4 repetition is answered with the 60 bosses handing you a verb',
   /A NEW VERB/i.test(flat) && /the opposite of a grind/i.test(flat));
ok('F5 the worldmap-inconsistency complaint is tied to our own map laws',
   /materialize out of nowhere/i.test(flat) &&
   /if the map has rules, the spawner obeys them/i.test(flat));

/* ---- G. THE ART AND INJURY FINDINGS ------------------------------------- */
ok('G1 ★ the injury system is read as the dynasty\'s unhealed-wounds clause in miniature',
   /the unhealed wounds/i.test(flat) &&
   /a permanent injury does not\s*delete a person, it re-roles them/i.test(flat));
ok('G2 ★ the deliberate caricature-face finding is recorded with its reason',
   /almost caricature style with large heads/i.test(flat) &&
   /to make constant death bearable|make constant death bearable/i.test(flat));
ok('G3 and it is tied to our own 64x64 identity law reached from the pixel side',
   /identity at 64.64 is SIZE AND SPACING, NOT DETAIL/i.test(flat));
ok('G4 roster attachment is described as ENGINEERED, with the cast left to Paolo',
   /engineered, not hoped for/i.test(flat) && /WHO ANYBODY IS STAYS PAOLO.S/i.test(flat));

/* ---- H. THE LANE SEAM AND THE FORKS ------------------------------------- */
ok('H1 the study says LAB WROTE NO COMBAT CODE and nothing here is canon',
   /LAB WROTE NO COMBAT CODE and nothing here is canon/i.test(flat));
ok('H2 ★ the three real forks are left [PENDING, Paolo\'s call]',
   (flat.match(/\[PENDING, Paolo's call\]/gi) || []).length >= 3);
ok('H3 ★ and the one thing LAB would build first is explicitly NOT its decision',
   /and it is not/i.test(flat) && /IF IT WERE MINE TO DECIDE/i.test(flat));
ok('H4 it cross-references the RF4 teardown so the two references stay one system',
   fs.existsSync(path.join(ROOT, RF4)) && /BOHEMIA_RF4_TEARDOWN_SPEC/.test(flat));

/* the machine half of the seam: this lane's diff must not touch combat code.
   ★ this check unions committed, staged, working-tree and untracked files --
   an earlier version of the equivalent check in rf4_teardown_gate only read
   committed history, so a staged engine edit passed it clean. A boundary check
   that only notices after you commit tells you too late. */
let touched = '';
for (const cmd of ['git diff --name-only origin/main...HEAD',
                   'git diff --name-only --cached',
                   'git diff --name-only',
                   'git ls-files --others --exclude-standard']) {
  try { touched += execSync(cmd, { cwd: ROOT }).toString() + '\n'; } catch (e) { }
}
const combatish = touched.split('\n').map(f => f.trim())
  .filter(f => f && /^engine\/|^slices\/.*\.html$/.test(f));
ok('H5 ★ LAB\'s diff touches NO engine module and NO slice'
   + (combatish.length ? ' -> ' + [...new Set(combatish)].join(', ') : ''),
   combatish.length === 0);
ok('H6 A GATE MUST NEVER OUTRANK A RULING: this gate asserts no adoption',
   /it does not assert that any of this should be built/i
     .test(fs.readFileSync(__filename, 'utf8').replace(/\s+/g, ' ')));

report();

function report() {
  console.log('='.repeat(74));
  console.log(`  BATTLE BROTHERS GATE: ${pass} pass / ${fails.length} fail`);
  console.log('='.repeat(74));
  process.exit(fails.length ? 1 : 0);
}
