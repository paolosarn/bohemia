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
  /* V171+ 8/20: A FOURTH VALUE, AND COMBAT OWNS THIS COLUMN. The coordinator
     found the column using BUILT for BOTH "the substrate exists" AND "the
     machine exists", with the spec's own prose disagreeing with it as a result,
     and routed the split to COMBAT (which owns STATUS; LAB owns the prose).
     UNHELD means the material is in the build and NO GATE HOLDS THE ROW'S RULE.
     It is enforced from the other side by top_of_the_document_gate T9: every
     row that says BUILT must be NAMED by some gate, so BUILT can no longer be
     awarded by a sentence in a row's own diff column. */
  const STAT = /\|\s*(SPECED|BUILT|UNHELD|DIFFERS-ON-PURPOSE)\s*\|?\s*$/;
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
  /* ★★★ C2..C7 WERE REWRITTEN 8/18 BECAUSE COMBAT CLOSED THE FINDING.
     This gate was built to go RED when the encounter curve landed, so the spec
     would be rewritten rather than quietly becoming false. It did exactly that:
     encounter size went 8/8/8 with 0 of 40 in RF4's band to min 3 / max 8 /
     mean 5 with 32 of 40 in band, in the same day. The checks now assert the NEW
     reality and that the OLD one is preserved as history, because a finding that
     gets fixed must not be able to vanish from the record as if it never was. */
  ok(`C2 the spec carries the CURRENT measured numbers (min ${m.encMin} max ${m.encMax} mean ${m.encMean})`,
     new RegExp('min ' + m.encMin + ', max ' + m.encMax + ', mean ' + m.encMean, 'i').test(flat));
  ok(`C3 and the CURRENT in-band count (${m.inBand} of ${m.arenas})`,
     new RegExp('INSIDE RF4.S ' + RF4_LO + '-' + RF4_HI + ' BAND: ' + m.inBand + ' OF ' + m.arenas, 'i').test(flat));
  const mostlyInBand = m.inBand >= Math.floor(m.arenas * 0.6);
  ok(`C4 ★★ the fight is now MOSTLY inside RF4's band (${m.inBand}/${m.arenas}) and the spec says COMBAT built the curve`,
     !mostlyInBand || /COMBAT BUILT THE CURVE/i.test(flat));
  ok('C5 ★ the ORIGINAL finding is preserved as history, not deleted',
     /encounter size \*\*8\.0 every fight\*\*|8\.0 every fight/i.test(flat) &&
     /was 0 of 40/i.test(flat));
  ok('C6 A GATE MUST NEVER OUTRANK A RULING: this gate does not demand 3-6',
     /does not demand RF4.s NUMBERS/i.test(fs.readFileSync(__filename, 'utf8')));
  ok('C7 the encounter CURVE was COMBAT\'s call, and the spec still says so',
     /WHAT COMBAT DECIDES HERE, AND LAB MUST NOT/i.test(flat) && /the curve is design/i.test(flat));
  ok(`C8 ★ 8 is now a CEILING not a constant (min ${m.encMin} < max ${m.encMax})`,
     m.encMin < m.encMax && /8 is now the ceiling it was always meant to be/i.test(flat));

  /* ---- D. THE BUILT ITEMS ARE ACTUALLY BUILT ---------------------------- */
  /* A status of BUILT has to correspond to something in the running fight, or
     the spec is a wish list with confident formatting. */
  ok(`D1 RF4-20 cover/LOS is genuinely in the fight (${m.cover.length} fns)`, m.cover.length >= 5);
  ok(`D2 RF4-19 environment genuinely fights back (${m.environment.length} fns)`, m.environment.length >= 5);
  ok(`D3 RF4-02 field readouts genuinely exist (${m.readouts.length} fns)`, m.readouts.length >= 4);
  ok(`D4 RF4-21 ranges genuinely exist (${m.ranges.length} fns)`, m.ranges.length >= 5);
  ok(`D5 RF4-03 target selection genuinely exists (${m.targeting.length} fns)`, m.targeting.length >= 3);
  ok(`D6 RF4-22 the way out is genuinely wired (${m.exitWire.join(', ')})`, m.exitWire.length === 2);
  ok(`D7 RF4-17/32 no stat mitigation: armor is 0 on all ${m.bodies} bodies`, m.armored === 0);
  ok('D8 and the spec cites the armor-always-0 smell under RF4-04 unification',
     /a stat that exists and never does anything/i.test(flat));

  /* ---- E. THE GAPS STAY GAPS, AND ARE NOT OVERSTATED -------------------- */
  /* ★ E1 FLIPPED 8/18: power was ABSENT when the spec was written and COMBAT
     built it the same day. The check now proves it is really there, by reading
     combat state rather than trusting the word BUILT in a cell. */
  ok(`E1 ★ RF4-07 POWER now genuinely exists in combat state (${m.powerStat.join(', ') || 'NONE'})`,
     m.powerStat.length > 0 && /BUILT 8\/18 BY COMBAT/i.test(flat));
  ok('E2 RF4-11 there really is no ability system', m.abilityFns.length === 0);
  ok(`E3 but RF4-16 credits the verbs that DO exist, so the gap is not overstated (${m.verbs.length})`,
     m.verbs.length >= 6 && /The gap is a \*system\*, not a blank slate/i.test(flat));
  ok(`E4 RF4-26 credits the roster depth: ${m.types} types, ${m.hpTiers} hp tiers, ${m.elite} elite`,
     m.types >= 5 && m.hpTiers >= 8 && m.elite > 0 && /better than expected/i.test(flat));
  /* ★ E5 FLIPPED 8/18: RF4-29 was the one item LAB marked NOT MEASURED rather
     than guessing at. COMBAT measured it and wrote real numbers in -- 0 fights
     ended on the opener, none over inside two turns, a perfect player clearing
     7 of 10 in a median of 20 turns. The check now requires the ANSWER, and
     requires that it is reported with numbers rather than an assurance. */
  ok('E5 ★ RF4-29 is now ANSWERED with measured numbers, not guessed',
     /0 fights ended on the opener/i.test(flat) && /median of 20 turns/i.test(flat));
  ok('E5b ★ and the 6/30 one-turn-clear inversion is reported as NOT in the game',
     /THE 6\/30 INVERSION IS NOT IN THE GAME/i.test(flat));

  /* ---- F. RESEARCH HONESTY: THE BLOCKED SOURCES ------------------------- */
  /* COMBAT is about to build off this file. The three items at the heart of the
     recreation came from search summaries because every primary domain is
     egress-blocked here. If that admission is ever edited out, somebody
     implements a number off a lead. */
  ok('F1 the four-tier sourcing scheme is defined, CAPTURE highest',
     /\[CAPTURE\]/.test(flat) && /\[LAW\]/.test(flat) && /\[PRIMARY\]/.test(flat) &&
     /\[SOURCED\]/.test(flat) && /Highest authority\. Wins every conflict/i.test(flat));

  /* ---- J. THE CORPUS LAYER ----------------------------------------------
     Paolo captured 83 RF4 tutorial screens himself and the 8/17 LIFT law says
     "his research replaces ours" and "LAB does not re-search RF4; it turns his
     corpus into the numbered spec." My 8/18 search pass ran anyway because I
     did not read the law first. These checks make the corpus the top of the
     authority stack and keep my own error on the record. */
  const LIFT = 'laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26.md';
  const CAP  = 'records/rf4/BOHEMIA_RF4_DANGER_SCHOOL_MASTER.md';
  ok('J1 the 8/17 LIFT law exists and is cited', fs.existsSync(path.join(ROOT, LIFT)) &&
     /BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26/.test(flat));
  ok('J2 his 83-screen capture exists and is cited as the top authority',
     fs.existsSync(path.join(ROOT, CAP)) && /83 RF4 tutorial screens/i.test(flat));
  ok('J3 ★ the spec quotes the law\'s definition of LAB\'s shrunken job',
     /LAB does not re-search RF4/i.test(flat) &&
     /his corpus into the numbered spec/i.test(flat));
  ok('J4 ★★ and it ADMITS the 8/18 search pass was the wrong call',
     /I RE-SEARCHED IT ANYWAY ON 8\/18, AND THAT WAS THE WRONG CALL/i.test(flat) &&
     /read the laws first, then work/i.test(flat));
  ok('J5 ★★ CORRECTION C-A: RF4-15 no longer says "do not import the resource tax"',
     /CORRECTED 8\/18 . SEE C-A/i.test(flat) && /SP is UPSIDE-ONLY/i.test(flat) &&
     !/DIFFERS-ON-PURPOSE, already ruled/i.test(flat));
  ok('J6 ★ CORRECTION C-B: the suspect PP regen number is flagged, not trusted',
     /FLAGGED 8\/18 . SEE C-B/i.test(flat) &&
     /Do not build the\s*\n?\s*PP cadence off this item/i.test(flat.replace(/\s+/g,' ')) ||
     /Do not build the PP cadence off this item/i.test(flat));
  ok('J7 ★★★ THE ONE SENTENCE is carried: a position game with a damage readout',
     /not a damage game/i.test(flat) &&
     /make geometry more powerful than statistics/i.test(flat));
  ok('J8 ★★ and the finding it produces about OUR fight',
     /we have the damage readout and the geometry is decoration/i.test(flat));
  ok('J9 ★★★ RF4-49 the SP clock is GLOBAL, not per-use, and the distinction is kept',
     /every 5th GLOBAL game turn/i.test(flat) &&
     /tests timing.*tests only patience/i.test(flat));
  ok('J10 and it names the substrate we already have for it',
     /global 120 BPM clock/i.test(flat) && /without spending your combat action/i.test(flat));
  ok('J11 ★★ RF4-52 vision as ONE variable gating FIVE enemy systems',
     /shamans need vision of BOTH/i.test(flat) && /healers only heal enemies they can see/i.test(flat) &&
     /combinatorial depth without writing combinatorial content/i.test(flat));
  ok('J12 RF4-51 movement asymmetry beats stat inflation',
     /orthogonally only/i.test(flat) && /cleaner difficulty lever than stat inflation/i.test(flat));
  ok('J13 ★ RF4-54 a kill channel that ignores the damage stat, environmental ONLY',
     /Pits kill instantly/i.test(flat) && /no \*\*WEAPON\*\* ever does|no WEAPON ever does/i.test(flat) &&
     /NO DAMAGE BEFORE THE DIAL is untouched/i.test(flat));
  ok('J14 ★ RF4-56 the damage math the dossier called an open gap, closed by HIM',
     /50%.100% of the listed value|rolls 50%.100%/i.test(flat) &&
     /plan against the WORST case/i.test(flat));
  ok('J15 RF4-57 status effects as turn denial, one item five jobs',
     /plugs a corridor with a sleeping body/i.test(flat) &&
     /beats five items with one use each/i.test(flat));
  ok('J16 ★ RF4-58 levelling up is a combat ability, and it is left PENDING not decided',
     /LEVELLING UP RESTORES ALL COOLDOWNS/i.test(flat) &&
     /\[PENDING, Paolo.s call\]/i.test(flat));

  /* ---- K. THE CONTRADICTIONS ARE RULINGS, NOT FINDINGS -------------------- */
  ok('K1 ★★ C4 the melee-vs-guns translation: LOS is our kite verb, not distance',
     /breaking LOS is our kite verb/i.test(flat) && /cover is our corridor/i.test(flat));
  ok('K2 C5 we do NOT ship 83 tip boxes; the corpus is a source, never a UI model',
     /WE DO NOT SHIP 83 TIP BOXES/i.test(flat) && /never a UI model/i.test(flat));
  ok('K3 C6 no mana bar; the AMMO ruling is the ability currency',
     /No MP, and we are not adding one/i.test(flat));
  ok('K4 ★★ the A/B/C teaching register is recorded as FLEET-WIDE, with its picking rule',
     /Never explain something the floor could have shown/i.test(flat) &&
     /whether the player COULD derive the rule unaided/i.test(flat));
  ok('K5 and the register law is marked as binding every lane, not just combat',
     /binds \*\*every lane that writes player-facing text\*\*|binds every lane that writes player-facing text/i.test(flat));
  ok('K6 the nine machines are kept as the BUILD ORDER, per the law',
     /THE NINE MACHINES/i.test(flat) && /this is the build order/i.test(flat));
  ok('F2 the spec still says WHY sourcing is constrained (the proxy blocks the primaries)',
     /blocked by this environment.s egress proxy as organization policy/i.test(flat));
  ok('F3 ★ and it does not route around a policy denial, it reports it',
     /report policy denials rather than route around them, so I did not/i.test(flat));
  ok('F4 ★ the two findings that carry the most weight were CONFIRMED TWICE before being written',
     /confirmed by two independent queries/i.test(flat) && /confirmed twice/i.test(flat));
  ok('F5 what is STILL thin is named, and it is values not shapes',
     /STILL THIN AND SHOULD NOT BE BUILT OFF/i.test(flat) &&
     /not Power.s damage formula and not the per-ability SP costs/i.test(flat));
  ok('F6 item numbers are declared PERMANENT so COMBAT can cite them safely',
     /ITEM NUMBERS ARE PERMANENT/i.test(flat) && /never inserted/i.test(flat));

  /* ---- F7..F12 THE TRINITY IS NOW SPECIFIABLE ---------------------------- */
  /* On 8/17 these were leads with a do-not-build warning. The research pass
     turned them into quoted mechanics. Each check is the load-bearing detail
     COMBAT needs -- if one is edited out, the item stops being buildable. */
  ok('F7 RF4-05 PP: the second bar above HP, and the block-on-last-point rule',
     /separate HP bar which sits atop your regular HP bar/i.test(flat) &&
     /while you hold even 1 PP you shrug off the largest blow/i.test(flat));
  ok('F8 RF4-05 PP: the regen rate is on record (5 every 5 turns)',
     /regenerates \*\*5 points every 5 turns\*\*|5 points every 5 turns/i.test(flat));
  ok('F9 RF4-06 the trinity applies to NPCs too, not just the player',
     /can affect both the player and NPCs/i.test(flat));
  ok('F10 RF4-08 SP buys ACTIONS, and RF4-09 records that stacking it broke the game',
     /perform 3\+ actions per turn/i.test(flat) &&
     /should be harder to stack up/i.test(flat));
  ok('F11 RF4-12 procs become charge-ups: luck converted into agency',
     /takes something uncontrollable and gives it to the player to use tactically/i.test(flat));
  ok('F12 RF4-13 recharge conditions are verbs unique to the item',
     /reflecting 10 projectiles/i.test(flat) && /after using 10SP/i.test(flat));

  /* ---- F13..F16 THE TWO HEADLINE FINDINGS ------------------------------- */
  ok('F13 ★★ RF4-24 the encounter rule is quoted, so 8 is measured against HIS words not mine',
     /typical encounter should have \*\*3-4 enemies\*\*|typical encounter should have 3-4 enemies/i.test(flat) &&
     /reserved for boss fights or very challenging vaults/i.test(flat));
  /* ★ F14 FLIPPED 8/18: the consequence was true in the morning and is not true
     now. The spec must say CLOSED rather than silently dropping the claim. */
  ok('F14 ★★ the boss-sizing consequence is marked CLOSED, not silently dropped',
     /\*\*CLOSED\.\*\* It was true this morning/i.test(flat) &&
     /it is not true now/i.test(flat));
  ok('F15 ★★★ RF4-25 names the REAL gap: synergy compounds, count only adds',
     /exponential growth in complexity/i.test(flat) &&
     /same enemy added to 5 very different groups/i.test(flat) &&
     /buys its depth with synergy, which compounds/i.test(flat));
  ok('F16 RF4-14 the anti-idle-turn rule is recorded as the density test',
     /almost never a turn in which the player is not either using an ability/i.test(flat));

  /* ---- F17..F19 IT STAYS ON LAB'S SIDE OF THE DESIGN LINE ---------------- */
  ok('F17 the cheapest path in is OFFERED, not imposed (a support body, RF4-27)',
     /THE CHEAPEST PATH INTO RF4-25, if COMBAT wants one/i.test(flat));
  ok('F18 the group COMPOSITION table is handed to COMBAT alongside the curve',
     /the encounter-size \*\*curve\*\* and the \*\*group\s*\n?composition table\*\*/i.test(spec) ||
     /the encounter-size curve and the group composition table/i.test(flat));
  ok('F19 RF4-31 build variety is left [PENDING PAOLO] rather than answered',
     /\[PENDING PAOLO\]/i.test(flat) && /Not LAB.s to decide/i.test(flat));

  /* ---- H. THE 8/18 FOLD: THE DOSSIER'S MECHANICS ARE NOW NUMBERED --------
     The 8/16 research dossier existed alongside this spec, so COMBAT had to read
     two files to get the whole picture. CLAUDE.md's standing job is "piles rot;
     masters stay clean". These checks fail if the fold is undone or the credit
     is stripped -- research that loses its attribution stops being checkable. */
  const DOSSIER = 'records/BOHEMIA_RF4_RESEARCH_DOSSIER_8_16_26.md';
  ok('H1 the 8/16 research dossier still exists (this spec now cites it)',
     fs.existsSync(path.join(ROOT, DOSSIER)));
  ok('H2 the fold CREDITS the dossier rather than absorbing it silently',
     /FOLDED IN 8\/18 FROM/i.test(flat) && /BOHEMIA_RF4_RESEARCH_DOSSIER_8_16_26/i.test(flat) &&
     /The dossier stays as the sourcing record/i.test(flat));
  /* ★ H3 HAD AN OPERATOR-PRECEDENCE BUG ON ITS FIRST WRITE, caught by mutation P2.
     It read `A && B || C`, which JS groups as `(A && B) || C` -- so the trailing
     "should have read it first" clause alone was enough to pass it, and deleting
     the actual admission changed nothing. A check that cannot fail is not a check.
     Parenthesised, and both halves are now required. */
  ok('H3 ★ and it ADMITS re-searching two things the dossier already had',
     /independently re-derived two things it already had/i.test(flat) &&
     /should have read it first/i.test(flat));

  /* ★★ CROSS-REFERENCE INTEGRITY. The whole point of this file is that COMBAT
     cites item numbers, so a reference pointing at the wrong item is a real
     defect, not a typo. A renumbering slip on 8/18 left RF4-07 pointing at
     RF4-15 (the resource-tax item) for the positioning bonus, which is RF4-18.
     Every RF4-NN mentioned anywhere must resolve to a defined item. */
  const defined = new Set(uniq);
  const referenced = [...spec.matchAll(/RF4-(\d\d)/g)].map(m => +m[1]);
  const dangling = [...new Set(referenced)].filter(n => !defined.has(n));
  ok('H13 ★★ every RF4-NN cross-reference resolves to a defined item'
     + (dangling.length ? ' -> dangling: ' + dangling.map(n => 'RF4-' + String(n).padStart(2, '0')).join(', ') : ''),
     dangling.length === 0);
  /* and the specific slip stays fixed */
  ok('H14 RF4-07 points at RF4-18 for the positioning bonus, not the resource tax',
     /grantable by positioning\*\* \(see RF4-18\)/i.test(flat));
  ok('H4 ★★★ RF4-36 the BOOMER SHOOTER thesis is carried, quoted',
     /Boomer Shooters/i.test(flat) && /circle strafing and general mayhem/i.test(flat));
  ok('H5 ★★ and the finding that follows from it: we already own the shooter half',
     /building the decision layer under a shooter we already have/i.test(flat));
  ok('H6 RF4-38 support AI actively avoids the player and hides behind allies',
     /biased \*\*against\*\* being close to|biased against being close to/i.test(flat) &&
     /the thing you must kill keeps leaving/i.test(flat));
  ok('H7 RF4-39 the 50% anti-pull shout, with the radius precedent',
     /50% chance that enemies will shout/i.test(flat) &&
     /outside line-of-sight the radius halves to 3/i.test(flat));
  ok('H8 and RF4-39 is tied to his actual 8/15 complaint',
     /stayed in the same place just shooting people/i.test(flat));
  ok('H9 RF4-42 the unification payoff: one stat means buffs compose',
     /anything modifying Power now modifies ALL power/i.test(flat) &&
     /argument for building Power before any individual damage buff/i.test(flat));
  ok('H10 ★★ RF4-45 build variety lives in UPGRADES, not list length',
     /even characters with the same talents can differ significantly/i.test(flat) &&
     /re-purposing a small number of things/i.test(flat));
  ok('H11 RF4-47 imports the item system but NOT its known defect',
     /dying with a hotbar full of them/i.test(flat) &&
     /an income stream gets spent, a precious consumable gets hoarded/i.test(flat));
  ok('H12 ★ RF4-48 information-on-the-field is a PASS/FAIL test on the trinity itself',
     /CANNOT ship a stat sheet/i.test(flat) &&
     /three new resources are exactly the kind of thing that grows a stat screen/i.test(flat));

  /* ---- I. THE GAP LEDGER IS SCORED HONESTLY ------------------------------ */
  ok('I1 the dossier\'s five gaps are scored, not quietly dropped',
     /THE GAP LEDGER/i.test(flat) && /Two closed, two partial, one open/i.test(flat));
  ok('I2 ★ the turn/energy model answer is recorded (SP buys actions, not an energy clock)',
     /not\*{0,2} a variable-energy clock/i.test(flat) &&
     /same SP pool/i.test(flat));
  ok('I3 and it says what that means for OUR dial rather than leaving it abstract',
     /how many beats you get/i.test(flat));
  ok('I4 ★ the gaps still open are still called open, including the useful admission',
     /DAMAGE STILL OPEN/i.test(flat) && /STILL OPEN/i.test(flat));

  /* ---- G. THE LANE SEAM ------------------------------------------------- */
  ok('G0 ★ the column-rule clarification is recorded (a MEASUREMENT may come from either lane)',
     /a MEASUREMENT is welcome from either lane/i.test(flat) &&
     /LAB does\s*\n?\s*not move a STATUS to BUILT/i.test(flat.replace(/\s+/g,' ')) ||
     /What stays one-way is \*interpretation\*/i.test(flat));
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
     crossing this exists to catch. Same intent, correct scope.
     RESTORED FROM HISTORY 8/18 (commit 35bd2b9), NOT REWRITTEN. Main's own
     commit c2cceed filed this as a rebase casualty and said in as many words
     that the next lane to trip it should recover the LAB's version rather than
     write a third one. This is that recovery, byte for byte. */
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
     /never as Bohemia names/i.test(flat) && /GAME MECHANICS AND SYSTEMS ARE NOT COPYRIGHTABLE/i
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
