/* ============================================================================
   RULINGS GATE (8/3/26, LAB lane)

   Record: records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md

   He answered twelve questions and five follow-ups, saying each time "Don't do
   anything yet I'm still answering your questions." I obeyed that -- and then kept
   obeying it after he had finished, so thirty rulings sat unrecorded for two days.
   GIT IS THE MEMORY. "Don't do anything" meant don't build; it never meant don't
   write it down.

   WHAT A MACHINE CAN AND CANNOT DO HERE. Most of these thirty are DIRECTIONS whose
   only real enforcement is the lane that owns them doing the work right. This gate
   does not pretend otherwise. It checks:

     1. THE RECORD IS INTACT and the six things still his are still marked his.
     2. THE ROW EXISTS. Every ruling that could get asked a second time is a trigger
        in the answered index, which answered_gate.py already sweeps. That is the
        real lock on the failure mode that produced this file.
     3. THE TWO STRUCTURAL BANS ARE SWEPT. R12 (no percentage social check, because a
        percentage invites save scumming) and R17 (record silently -- a ledger, never
        a morality bar shown to the player) are not tastes, they are bans on a
        STRUCTURE, and a lane could break either one while believing it was helping.

   Prose is normalised before matching, and per-item checks are scoped to the item.
   Both of those are the recurring bug classes in this repo, written down in
   traumatic_gate.js and no_paint_gate.js.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const REC = 'records/BOHEMIA_RULINGS_FROM_THE_QUESTION_ROUND_8_3_26.md';
const INDEX = 'records/BOHEMIA_ANSWERED_QUESTIONS_INDEX.md';
const QUESTIONS = 'records/BOHEMIA_LAB_QUESTIONS_FOR_PAOLO_8_1_26.md';

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('RULINGS GATE — thirty answers he already gave, written down');
console.log('               and machine-locked so he never gives them twice');
console.log('='.repeat(74));

const norm = (t) => t
  .replace(/^[ \t]*>[ \t]?/gm, '')
  .replace(/[*`]/g, '')
  .replace(/\s+/g, ' ');

ok('A1 the record exists', fs.existsSync(path.join(ROOT, REC)));
if (!fs.existsSync(path.join(ROOT, REC))) process.exit(1);
const rec = norm(fs.readFileSync(path.join(ROOT, REC), 'utf8'));

ok('A2 it owns the delay instead of hiding it',
   /That was the mistake/i.test(rec) && /GIT IS THE MEMORY/.test(rec));
ok('A3 and states the distinction that caused it',
   /meant don't go build/i.test(rec) && /never meant don't write it down/i.test(rec));
ok('A4 the source question file still exists', fs.existsSync(path.join(ROOT, QUESTIONS)));
ok('A5 it cites the source question file', rec.indexOf(path.basename(QUESTIONS)) > 0);

/* ALL THIRTY RULINGS ARE PRESENT AND NUMBERED. A record that loses a ruling is the
   exact failure this file was written to end. */
/* Matched on the RAW text against the bolded HEADING form, not on normalised prose.
   The first draft accepted a bare "R21 " anywhere, which prose like "R18 is the
   granularity it needs" satisfies for free -- so deleting a ruling and leaving a
   cross-reference behind would have passed. Mutation found it. */
const rawRec = fs.readFileSync(path.join(ROOT, REC), 'utf8');
const headings = new Set();
(rawRec.match(/\*\*R(\d+) —/g) || []).forEach(h => headings.add(+h.match(/\d+/)[0]));
let missing = [];
for (let i = 1; i <= 30; i++) if (!headings.has(i)) missing.push('R' + i);
ok('A6 all thirty rulings are present' + (missing.length ? ' -> missing ' + missing.join(',') : ''),
   missing.length === 0);

/* THE LOAD-BEARING ONES, BY CONTENT not by number, so renumbering cannot hide a loss */
[['R3 rest is a VISIBLE fast-forward, never a fade to black',
  /VISIBLE FAST-FORWARD, NEVER A FADE TO BLACK/i],
 ['R7 sleeping, chilling and hanging out are ONE thing',
  /ONE THING WITH ONE SET OF BENEFITS/i],
 ['R8 there is ONE universal clock', /THERE IS ONE UNIVERSAL CLOCK/i],
 ['R9 fast travel is gated on having WALKED the district',
  /GATED ON HAVING WALKED THE DISTRICT/i],
 ['R10 encumbrance is a slowdown, not a wall', /A SLOWDOWN, NOT A WALL/i],
 ['R12 no save scumming: checks are BINARY', /CHECKS ARE BINARY: YOU CAN OR YOU CANNOT/i],
 ['R14 main quests cannot be refused', /MAIN QUESTS CANNOT BE REFUSED/i],
 ['R17 record everything SILENTLY', /RECORD EVERYTHING SILENTLY/i],
 ['R20 witnesses need plumbing on ALL NPCs', /PLUMBING ON ALL NPCS/i],
 ['R21 stories spread like a plague', /STORIES SPREAD LIKE A PLAGUE/i],
 ['R24 gear at the family house carries across generations',
  /GEAR STORED AT THE FAMILY HOUSE CARRIES ACROSS GENERATIONS/i],
 ['R25 no inherited perks, a boosted start instead', /NO INHERITED PERKS/i],
 ['R28 the source of all of it is REALISM', /THE SOURCE OF ALL OF IT IS REALISM/i]
].forEach(([what, re]) => ok('A7 still ruled: ' + what, re.test(rec)));

/* THE APPARENT CONTRADICTIONS ARE RESOLVED IN WRITING, not left for a later session
   to "fix". Both of these are cases where two live canon statements look like they
   fight and do not, and an unexplained apparent conflict is how real regressions get
   introduced by somebody being helpful. */
ok('A8 ONE CLOCK vs the camp meter is resolved in writing',
   /ONE CLOCK, TWO METERS/i.test(rec) && /is not two clocks/i.test(rec));
ok('A9 and "how does neglect bite without upkeep" is answered by the upgradeable camp',
   /you just still have the shitty camp/i.test(rec) &&
   /EARNED_NOT_AFFORDED/.test(rec));

/* THE KILLED DIRECTION STAYS KILLED. R29 records that he named Rogue Fable, and the
   RF4 direction was killed after that -- so the record must say out loud that R29 is
   not live permission, or it becomes a loophole back to a graveyarded thing. */
ok('A10 R29 says explicitly it is NOT live permission to retry the killed direction',
   /NOT live permission to try it again/i.test(rec) && /GRAVEYARD IS FINAL/.test(rec));
ok('A11 and it cites the kill record', /RF4_DIRECTION_KILL/.test(rec));
ok('A12 the kill record still exists',
   fs.existsSync(path.join(ROOT, 'records/BOHEMIA_RF4_DIRECTION_KILL_8_1_26.md')));

/* GARBLED TRANSCRIPTION IS NEVER GUESSED AT -- CLAUDE.md's first rule about how he
   works. Two rulings came through garbled and the record has to say so rather than
   invent a term. */
ok('A13 it refuses to guess at the garbled words',
   /not going to guess what a garbled word meant/i.test(rec));

/* HIS OWN STATED GOAL IS RECORDED VERBATIM */
ok('A14 his standing goal is recorded in his words',
   /multimillionaire off this game/i.test(rec));

/* ---- THE PENDINGS STAY PENDING, SCOPED PER ITEM --------------------------- */
const stillHis = rec.slice(rec.search(/WHAT IS STILL HIS/i));
ok('B1 the WHAT IS STILL HIS section exists', stillHis.length > 80);
[['R5 rest numbers', /R5's rest numbers/i],
 ['R13 check keys', /R13's actual check keys/i],
 ['R21 spread rates and NPC memory', /R21's spread rates/i],
 ['R25 the boost', /R25's boost/i],
 ['R27 whether the robot exists', /R27 — whether the robot companion exists|R27 -- whether the robot companion exists/i]
].forEach(([what, re]) => ok('B2 still his: ' + what, re.test(stillHis)));
ok('B3 R5 is marked pending at the ruling itself, not only in the summary list',
   /\[PENDING Paolo\][^.]{0,40}NO DIAL, NO NUMBERS/i.test(rec) ||
   /R5[\s\S]{0,300}\[PENDING Paolo\]/.test(rec));
/* R11 WAS THE ONE OPEN RECOMMENDATION AND HE RULED IT ON 8/3: "NO THEN". An heir does
   not inherit the walked map. Two things gated: the ruling is recorded with his word,
   and it came OFF the still-his list the same turn -- a pending that stays listed after
   it has been ruled is how a session ends up asking him twice. */
ok('B4 R11 is RULED, with his word, and no longer offered as a recommendation',
   /RULED 8\/3\/26: AN HEIR DOES NOT INHERIT THE WALKED MAP/i.test(rec) &&
   /"NO THEN"/.test(rec) && !/\[MY RECOMMENDATION, HIS CALL\]/.test(rec));
ok('B4b R11 was removed from the still-his list the same turn it was ruled',
   !/R11's inheritance of the walked map/i.test(stillHis) &&
   /R11 came off this list on 8\/3/i.test(stillHis));
ok('B4c and the ruling explains WHY it is right, not just that he said it',
   /nobody ever walks again/i.test(rec) && /going back out/i.test(rec));
/* The quote mark sits OUTSIDE the period in the prose ("maybe."), so a regex that
   demanded a closing quote straight after the word failed on correct text. Same
   family as every other prose bug in this repo: match the words, not the punctuation. */
ok('B5 R27 stays a MAYBE and is not promoted to a ruling',
   /Recorded as a MAYBE, not a ruling/i.test(rec) && /it stays ["'“]?maybe/i.test(rec));

/* ---- R21's RESEARCH, AND THE MECHANIC HE APPROVED OFF IT ------------------- */
/* He asked for this research by name ("do some online research on how games have
   previously done that"), then on 8/3 approved its darkest recommendation outright:
   "ABSOLUTELY ANYTHING U THINK U CAN AND SHOULD DO IS IMPORTANT." That sentence is a
   grant of JUDGEMENT on mechanism, and the risk is over-reading it as a blank cheque on
   content he has reserved. So the record has to hold both halves, and the gate holds
   that it holds both. */
const SPREAD = 'records/BOHEMIA_RESEARCH_STORIES_SPREAD_8_3_26.md';
ok('E1 the rumour research exists', fs.existsSync(path.join(ROOT, SPREAD)));
const spread = fs.existsSync(path.join(ROOT, SPREAD))
  ? norm(fs.readFileSync(path.join(ROOT, SPREAD), 'utf8')) : '';
ok('E2 R21 cites it', rec.indexOf(path.basename(SPREAD)) > 0);
ok('E3 its headline is the OBJECT model, not a reputation number',
   /a rumour is an OBJECT, not a number/i.test(spread) ||
   /A RUMOUR IS AN OBJECT, NOT A NUMBER/i.test(spread));
ok('E4 Skyrim is kept as the anti-reference, with the reason',
   /THE ANTI-REFERENCE/i.test(spread) &&
   /a meter cannot remember who was in the room/i.test(spread));
ok('E5 rule 5 records his approval verbatim',
   /ABSOLUTELY ANYTHING U THINK U CAN AND SHOULD DO IS IMPORTANT/.test(spread));
ok('E6 and reads it as a grant of JUDGEMENT, not a blank cheque on his content',
   /GRANT OF JUDGEMENT, NOT A BLANK CHEQUE/i.test(spread) &&
   /does not repeal NO DAMAGE BEFORE THE DIAL/i.test(spread));
ok('E7 the mechanic may not be softened into something safer',
   /no lane may soften it/i.test(spread) && /the option is real/i.test(spread));
ok('E8 the three constraints that make it fair are all held',
   /THERE HAS TO BE A WINDOW/i.test(spread) &&
   /THE WITNESS MUST BE FINDABLE/i.test(spread) &&
   /IT MUST COST/i.test(spread));
ok('E9 and approving the mechanic did NOT set any number',
   /Approving the mechanic did not set a single one of them/i.test(spread));
ok('E10 the spread numbers are still his',
   /\[PENDING Paolo\]: the numbers/i.test(spread));
ok('E11 it is still honest about being DOC_ONLY off unreachable primaries',
   /DOC_ONLY/.test(spread) && /403/.test(spread));

/* ---- THE VALHEIM STUDY, AND THE TWO RULINGS IT CONFIRMED ------------------ */
/* He asked why Valheim is successful. The answer turned out to CORROBORATE two of his
   own rulings in real source: R1 (the camp is a no-spawn radius "the way a Valheim
   workbench is") and R10 (encumbrance is a slowdown, not a wall). Those corroborations
   are the most valuable thing in the study, because they are evidence his instinct
   matched a shipped ten-million-copy game -- so they are gated, and so is the honesty
   about the citations being to a MOD rather than to Iron Gate's closed source. */
const VALHEIM = 'records/BOHEMIA_RESEARCH_WHY_VALHEIM_WORKED_8_3_26.md';
ok('F1 the Valheim study exists', fs.existsSync(path.join(ROOT, VALHEIM)));
const vh = fs.existsSync(path.join(ROOT, VALHEIM))
  ? norm(fs.readFileSync(path.join(ROOT, VALHEIM), 'utf8')) : '';
ok('F2 it quotes his ask verbatim',
   /im an intense fan of valheim and its progression open world system/i.test(vh));
ok('F3 its headline is the absence of a character sheet',
   /NO CHARACTER SHEET/i.test(vh) && /never in a number attached to you/i.test(vh));
ok('F4 it is SOURCED, and says which files',
   /Player\.cs/.test(vh) && /Skills\.cs/.test(vh) && /CraftingStation\.cs/.test(vh) &&
   /Character\.cs/.test(vh) && /Game\.cs/.test(vh));
ok('F5 R1 is recorded as confirmed by real code, with the citation',
   /EXACTLY HIS R1 RULING, CONFIRMED IN REAL CODE/i.test(vh) &&
   /CraftingStation\.cs:2[0-9]/.test(vh));
ok('F6 R10 is recorded as confirmed by real code, with the citation',
   /m_encumberedStaminaDrain IS HIS R10 RULING/i.test(vh) &&
   /Player\.cs:2[0-9]-3[0-9]/.test(vh));
ok('F7 the two action-cost-shape clauses it corroborates are named',
   /clause 3/i.test(vh) && /clause 5/i.test(vh) && /THE ACTION_COST_SHAPE|ACTION_COST_SHAPE/i.test(vh));
/* THE LIMIT THAT MATTERS: a line number in a MOD is not a line number in the game. A
   later session that reads these as Iron Gate citations will over-trust a constant. */
ok('F8 it discloses that the citations are to a MOD, not to Iron Gate source',
   /ValheimPlus, a MOD/i.test(vh) && /closed/i.test(vh));
ok('F9 and separates sourced STRUCTURE from indicative CONSTANTS',
   /STRUCTURE as sourced and any specific constant as indicative/i.test(vh));
ok('F10 the boss/biome gating is marked community-documented, not code',
   /community-documented, not code/i.test(vh));
ok('F11 the food model is understood but explicitly NOT proposed',
   /NO DAMAGE BEFORE THE DIAL/.test(vh) && /not proposed/i.test(vh));
ok('F12 the readable-danger pending is FLAGGED and not answered by a lane',
   /FLAGGED, NOT ASKED/i.test(vh) &&
   /\[PENDING Paolo\]/.test(vh) &&
   /stays flagged rather than answered by a lane/i.test(vh));
ok('F13 the dynasty settled question is not re-opened by the death-penalty finding',
   /DYNASTY, not a one-life run/i.test(vh));

/* ---- THE BOSS LADDER: V1 RESTORED --------------------------------------------
   He rejected the ladder TWICE -- once the substance framing ("kind of stupid"), once the
   tool framing ("that kinda sucks too") -- and then said: "i liked your first version the
   best cant we build off that."

   THE PATTERN BEHIND BOTH REJECTIONS: I KEPT REPLACING THE PERSON WITH A THING. v1's bosses
   were PEOPLE who own a piece of the city. He said "concrete boss" and I renamed them after
   substances; he said "tool vibes" and I renamed them after objects. Both times I heard
   RENAME and deleted the character, which was the only thing making them interesting.

   So this block guards a RESTORE, not another framing. The load-bearing check is G3: the
   thirteen headings he liked must be BYTE-IDENTICAL to commit 7da7c89's, because "restored"
   is a claim a machine can verify and a paraphrase would silently break it. STOP PRODUCING
   says a second rejection ends the feature for the session, so there is no v5 to guard. */
const LADDER = 'records/BOHEMIA_THE_BOSS_LADDER_CANDIDATES_8_3_26.md';
ok('G1 the boss ladder record exists', fs.existsSync(path.join(ROOT, LADDER)));
const rawLad = fs.existsSync(path.join(ROOT, LADDER))
  ? fs.readFileSync(path.join(ROOT, LADDER), 'utf8') : '';
const lad = norm(rawLad);

ok('G2 his second rejection and the revert instruction are quoted verbatim',
   /i liked your first version the best cant we build off that/i.test(lad));

/* ★ THE 13 ARE THE ONES HE LIKED, BYTE FOR BYTE. Hardcoded here rather than read from git,
   so the check still works in a fresh clone with no history walk. */
const V1 = [
  '**1. THE TAP — water.**',
  '**2. THE BURN — heat and fuel.**',
  '**3. THE TOLL — passage.**',
  '**4. THE STRIPPER — salvage.**',
  '**6. THE WARD — medicine.**',
  '**8. THE DRAIN — sanitation.**',
  '**9. THE BOOK — debt.**',
  '**10. THE JUDGE — law.**',
  '**11. THE SCHOOL — knowledge.**',
  '**13. THE GRID — the network itself.**'
];
const missingV1 = V1.filter(h => rawLad.indexOf(h) < 0);
ok('G3 v1\'s headings are byte-identical, not paraphrased' +
   (missingV1.length ? ' -> altered: ' + missingV1.slice(0, 3).join(' | ') : ''),
   missingV1.length === 0);
ok('G4 the two starred v1 entries survive with their emphasis',
   /\*\*5\. ★ THE LIGHTS — power\./.test(rawLad) &&
   /\*\*7\. ★ THE VOICE — the airwaves\.\*\*/.test(rawLad) &&
   /\*\*12\. ★★ THE SOIL — life\./.test(rawLad));
ok('G5 it says the 13 were recovered from git rather than rewritten from memory',
   /recovered out of git/i.test(lad) && /7da7c89/.test(lad));

/* THE POST-MORTEM MUST STAY, because it is the thing that stops a third rename. */
ok('G6 the root pattern is named: I kept replacing the person with a thing',
   /I KEPT REPLACING THE PERSON WITH A THING/i.test(lad));
ok('G7 and that a boss is a SOMEONE -- the thing both renames deleted',
   /a boss is a\s*someone/i.test(lad) && /THE PERSON WAS THE POINT/i.test(lad));
ok('G8 STOP PRODUCING is cited and the session stops proposing shapes',
   /STOP_PRODUCING/.test(lad) &&
   /then I stop\s*proposing shapes for the ladder/i.test(lad));

/* THE COUNT, MACHINE-COUNTED. Same rot class the earlier passes kept hitting. */
const entries = (rawLad.match(/^\*\*(\d+)\. /gm) || []).map(e => +e.match(/\d+/)[0]);
const stated = (rawLad.match(/THE BOSS LADDER: (\d+) CANDIDATES/) || [])[1];
ok('G9 the stated count matches the entries (' + entries.length + ' entries, states ' +
   stated + ')', !!stated && +stated === entries.length);
ok('G10 the entries run 1..N with no duplicates or gaps',
   entries.every((n, i) => n === i + 1));
ok('G11 the five additions are marked as additions, not smuggled into v1',
   /THE FIVE ADDED \(8\/4\/26\)/.test(lad));

/* G11b-G11e (8/7) — HE RE-OPENED THE LADDER, SO THE STOP HAD TO BE LIFTED BY HIM AND SAID SO.
   G8 above holds the 8/4 self-imposed stop ("then I stop proposing shapes"). On 8/7 he asked
   for the list again and said "maybe there's more than 18 bosses", which under
   laws/BOHEMIA_LAW_HOW_HAIR_AND_SHAPE_WORK_8_1_26.md (A GATE MUST NEVER OUTRANK A RULING)
   lifts it. The danger is a future session reading the extension and treating the ladder as
   open season, so the lift has to name WHO did it, and his TEST has to be enforced. */
ok('G11b the 8/7 lift is recorded and attributed to HIM, not taken by the session',
   /IS LIFTED BY\s*HIM/i.test(lad) && /not quietly dropped and it was not lifted by me/i.test(lad));
ok('G11c his BUILD-OR-EXPLORE test is stated as the filter every boss must pass',
   /MUST GRANT A POWER THAT HELPS YOU BUILD OR EXPLORE THE WORLD/i.test(lad) &&
   /SIZED TO THE ACT YOU ARE IN/i.test(lad));
ok('G11d the four bosses that FAIL his test are flagged for his call and NOT cut by me',
   /FOUR FAIL/i.test(lad) && /I am not cutting them/i.test(lad) &&
   ['THE VOICE','THE BOOK','THE JUDGE','THE BROKER'].every(n => lad.indexOf(n) > 0));
ok('G11e the four additions are marked as additions too, with their own date',
   /THE FOUR ADDED \(8\/7\/26\)/.test(lad));

/* WHAT SURVIVES FROM THE DEAD PASSES -- mechanism he never rejected. */
ok('G12 a biome is a MISSING FUNCTION, not a place',
   /BIOME"? IS A MISSING FUNCTION, NOT A PLACE/i.test(lad));
ok('G13 the three acts are three different verbs',
   /ACT 1 you do it · ACT 2 your crews do it · ACT 3 the\s*city does it around you/i.test(lad));
ok('G14 the locked caps law is cited and no percentage is invented here',
   /THE_VALHEIM_SHAPE_8_4_26/.test(lad) && /Sets no percentage/i.test(lad));
ok('G15 act 3\'s currency is ALLIANCE, and the broker carries it',
   /currency is ALLIANCE/i.test(lad) && /THE BROKER/.test(lad));
ok('G16 the ability-not-resource rule stands, and is owned as the one I broke',
   /A BOSS GRANTS THE ABILITY, NEVER THE RESOURCE/i.test(lad) &&
   /the thing I then broke/i.test(lad));
ok('G17 building stays optional -- beating none of them still finishes the game',
   /CEILINGS never floors/i.test(lad) &&
   /beats none of them still finishes the game/i.test(lad));
ok('G18 the faction roster is cited as existing, and no faction canon is written',
   /records\/factions\//.test(lad) && /sixteen dossiers/i.test(lad) &&
   /not writing faction canon/i.test(lad));
ok('G19 it stays candidates and the names stay handles',
   /handles to argue with, never canon/i.test(lad));
ok('G20 no damage number leaked in', /NO DAMAGE BEFORE THE DIAL/.test(lad));

/* ---- THE CAMP-FEEL RULING (8/4) ---------------------------------------------
   "Valheim's build menu ... it really felt like you could just set up fucking camp anywhere
   quickly." A reference ruling under NOTES ARE RULINGS -- and the one that most needs a
   machine, because clause 11 of the mobile camp law is HIS OWN ruling that SETTING UP CAMP
   TAKES TIME. Read carelessly, "very quickly" repeals it. The record has to keep both alive:
   CHEAP IN TAPS, NEVER FREE IN TIME. A later session that collapses those two into one would
   break a law he wrote while trying to honour a thing he said. */
const CAMPFEEL = 'records/BOHEMIA_RESEARCH_VALHEIM_BUILD_FEEL_8_4_26.md';
const CAMPLAW = 'laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md';
ok('H1 the camp-feel study exists', fs.existsSync(path.join(ROOT, CAMPFEEL)));
const cf = fs.existsSync(path.join(ROOT, CAMPFEEL))
  ? norm(fs.readFileSync(path.join(ROOT, CAMPFEEL), 'utf8')) : '';
ok('H2 his words are quoted verbatim', /set up fucking camp anywhere quickly/i.test(cf));
ok('H3 the camp law it must not repeal still exists', fs.existsSync(path.join(ROOT, CAMPLAW)));
/* THE LOAD-BEARING CHECK: the two currencies stay separate. */
ok('H4 clause 11 is NOT repealed -- time cost and interaction cost are named as different',
   /CHEAP IN TAPS\. NEVER FREE IN TIME/i.test(cf) && /Does not repeal clause 11/i.test(cf));
ok('H5 and it says outright that nobody may read it as making camping free',
   /permission to make camping free/i.test(cf));
ok('H6 the real mechanism is recorded: no roof, no cover, for the two jobs that matter',
   /NO ROOF AND NO COVER AT ALL/i.test(cf) &&
   /not building a camp, you are placing one/i.test(cf));
ok('H7 the refund finding carries its source citation',
   /Piece\.cs:1[349]/.test(cf) && /m_recover/.test(cf) &&
   /no punishment for guessing wrong/i.test(cf));
ok('H8 the tool-is-the-menu finding is recorded', /THERE IS NO BUILD MODE/i.test(cf));
/* THE TWO HONEST LIMITS -- both are sentences a later session would cut as hedging, and both
   are the difference between copying the right system and the wrong one. */
ok('H9 it separates the CAMP flow (loved) from the ARCHITECTURE tooling (complained about)',
   /Building Feels Terrible/i.test(cf) && /manual build-piece snapping in 2023/i.test(cf) &&
   /this is what transfers/i.test(cf));
ok('H10 and warns that reading it as "copy Valheim building" builds the wrong one',
   /will build the second one/i.test(cf));
ok('H11 the mouse-versus-thumb problem is named rather than glossed',
   /assumes a mouse/i.test(cf) && /one thumb, portrait/i.test(cf));
ok('H12 the transferable principle is ONE OBJECT, tied back to R1',
   /ONE OBJECT PLACES THE WHOLE CAMP/i.test(cf) &&
   /no-spawn radius\s*the way a Valheim workbench is/i.test(cf));
ok('H13 UX is left to the lane that owns the surface',
   /UX is not my call/i.test(cf) && /RUN lane owns the surface/i.test(cf));
ok('H14 and the ValheimPlus mod-not-Iron-Gate caveat is repeated here too',
   /a line number is a\s*line in the MOD/i.test(cf));

/* ---- ★ CROSS-LANE: THE RULINGS THIS LANE HOLDS ARE STILL BUILT BY THE LANE THAT BUILT
   THEM ------------------------------------------------------------------------
   A ruling can be built and then quietly become UNBUILT, and nothing would notice, because
   the lane holding the RULING is not the lane holding the IMPLEMENTATION. Verified 8/5 by
   reading the code rather than their record: R17/R19/R20/R21 are satisfied in
   engine/bohemia_standing.js + bohemia_deeds.js, gated by standing_gate (35/0) and
   deed_bridge_gate (27/0). See records/BOHEMIA_CROSS_LANE_WITNESS_VERIFICATION_8_5_26.md.

   THIS CHECKS THE CONTRACT, NEVER THE NUMBERS. HEARSAY_LOSS, MAX_HOPS and GEN_LOSS are
   their dials and his rulings; asserting values here would freeze another lane's tuning
   from outside. So every check below reads STRUCTURE -- that the mechanism still exists --
   and none of them reads a magnitude. If a value ever needs locking, that is his ruling and
   it belongs in their gate, not this one. */
const STAND = 'engine/bohemia_standing.js';
const DEEDS = 'engine/bohemia_deeds.js';
const XREC = 'records/BOHEMIA_CROSS_LANE_WITNESS_VERIFICATION_8_5_26.md';
const standSrc = fs.existsSync(path.join(ROOT, STAND))
  ? fs.readFileSync(path.join(ROOT, STAND), 'utf8') : '';
const deedSrc = fs.existsSync(path.join(ROOT, DEEDS))
  ? fs.readFileSync(path.join(ROOT, DEEDS), 'utf8') : '';

ok('X1 the witness/gossip organ still exists', standSrc.length > 0);
ok('X2 R20 still built: a deed enters through a WITNESS, in range',
   /function\s+witness\s*\(/.test(standSrc) && /SEE_RANGE/.test(standSrc));
ok('X3 R21 still built: a deed travels mind to mind (gossip)',
   /function\s+gossip\s*\(/.test(standSrc));
ok('X4 R21 still built: hearsay is WEAKER than eyesight',
   /HEARSAY_LOSS/.test(standSrc) && /Math\.pow\(\s*HEARSAY_LOSS/.test(standSrc));
ok('X5 R21 still built: a story RUNS OUT (a hop ceiling exists)',
   /MAX_HOPS/.test(standSrc) && /hops/.test(standSrc));
ok('X6 R21 "different degrees of stories" still built: per-deed hop budgets',
   /function\s+hopsFor\s*\(/.test(deedSrc) && /MAX_HOPS/.test(deedSrc));
ok('X7 R17 still built: standing is DERIVED, not stored as a score',
   /function\s+standingOf\s*\(/.test(standSrc));
ok('X8 R19 has its material: becauseOf() explains a standing',
   /function\s+becauseOf\s*\(/.test(standSrc));
ok('X9 the dynasty carry still exists (inherit)',
   /function\s+inherit\s*\(/.test(standSrc));
ok('X10 and their own gates still exist to own the numbers',
   fs.existsSync(path.join(ROOT, 'gates/standing_gate.js')) &&
   fs.existsSync(path.join(ROOT, 'gates/deed_bridge_gate.js')));

/* THE VERIFICATION RECORD MUST STAY HONEST ABOUT THE THREE THINGS THAT ARE EASY TO LOSE:
   that the work was another lane's, that a ruling of his is currently UNEXPRESSIBLE, and
   that I had been re-declaring a blocker instead of resolving it. */
const xr = fs.existsSync(path.join(ROOT, XREC))
  ? norm(fs.readFileSync(path.join(ROOT, XREC), 'utf8')) : '';
ok('X11 the verification record exists', xr.length > 0);
ok('X12 it credits the other lane instead of claiming the work',
   /ALREADY DONE, BY THE PEOPLE LANE, AND BETTER THAN I WOULD\s*HAVE DONE IT/i.test(xr));
ok('X13 it owns that the blocker was re-declared for three turns, not resolved',
   /not a blocker, it is a\s*habit/i.test(xr));
ok('X14 it verified CODE rather than believing their record',
   /A record is\s*not proof/i.test(xr));
ok('X15 ★ R18 is flagged as currently UNEXPRESSIBLE pending his deed vocabulary',
   /R18 IS CURRENTLY UNEXPRESSIBLE/i.test(xr) &&
   /at least two distinguishable kinds for mercy/i.test(xr));
ok('X16 and the approved kill-the-witness mechanic is routed, not built here',
   /Routed to COMBAT/i.test(xr) && /not touching their organ/i.test(xr));
ok('X17 it states this gate checks the CONTRACT and not their dials',
   /checks the CONTRACT, never the numbers/i.test(xr));

/* ---- THE ROWS EXIST ------------------------------------------------------- */
/* This is the actual lock. answered_gate.py reads the machine block; a ruling with no
   row is a ruling he will be asked about again. */
const idx = fs.existsSync(path.join(ROOT, INDEX))
  ? fs.readFileSync(path.join(ROOT, INDEX), 'utf8') : '';
ok('C1 the answered index exists', idx.length > 0);
const block = (idx.match(/```answered([\s\S]*?)```/) || [, ''])[1];
ok('C2 its machine block is readable', block.length > 200);
[['one universal clock', /universal clock/i],
 ['fast travel unlock', /fast travel/i],
 ['encumbrance', /encumbran|over.?weight|carry too much/i],
 ['percentage social checks / save scumming', /save scum|percentage.*check|speech check/i],
 ['refusing a main quest', /refuse a (main )?quest|turn down a quest/i],
 ['a morality meter', /morality/i],
 ['inherited perks', /inherit.*perk|perks carry/i],
 ['sleeping vs hanging out', /hanging out|chilling/i],
 ['fade to black on rest', /fade to black/i]
].forEach(([what, re]) => ok('C3 a settled row exists for: ' + what, re.test(block)));
ok('C4 every row in the block still has all three fields',
   block.trim().split('\n').filter(Boolean).every(l => l.split('|').length === 3));
/* The index's headings are hand-numbered and I duplicated 18/19/20 the first time I
   inserted three rows in the middle of it. A duplicate number in a REGISTRY is rot: two
   "question 18"s means a citation to one of them is ambiguous forever. Cheap to check,
   so it is checked. */
const nums = (idx.match(/^### (\d+)\./gm) || []).map(h => +h.match(/\d+/)[0]);
ok('C4b the index headings are numbered 1..N with no duplicates and no gaps (' +
   nums.length + ' questions)',
   nums.length > 0 && nums.every((n, i) => n === i + 1));
ok('C5 every row cites a file that exists',
   block.trim().split('\n').filter(Boolean).every(l => {
     const f = l.split('|')[2].trim();
     return fs.existsSync(path.join(ROOT, f));
   }));

/* ---- THE SWEEP: THE TWO STRUCTURAL BANS ----------------------------------- */
/* Structures, not words. A gate that hunts a WORD instead of a THING is the bug this
   repo has now shipped eight times, so these patterns match code shapes: an odds
   value attached to a social check, and a player-facing morality number. */
function walk(dir, ext, out) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return out;
  for (const f of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.join(dir, f.name);
    if (f.isDirectory()) { walk(rel, ext, out); continue; }
    if (ext.test(f.name)) out.push(rel);
  }
  return out;
}
const surfaces = walk('slices', /\.(html|js)$/, walk('engine', /\.js$/, []))
  .filter(f => f.indexOf('slices/lab/') !== 0);

const BANNED = [
  /* R12: a social/skill check resolved by a roll against odds. The tell is a
     chance/odds/percent value NAMED for a social check, or an rng compared to one. */
  [/\b(speech|persuad\w*|charisma|dialogue|convince|intimidat\w*)(Chance|Odds|Pct|Percent|Prob)\b/i,
   'R12: a percentage-based social check (save-scum bait)'],
  [/\b(checkChance|skillCheckChance|passChance)\s*[:=]/,
   'R12: a check resolved by odds instead of can/cannot'],
  /* R17: THE LEDGER IS REQUIRED. THE DISPLAY IS BANNED. The first draft of this check
     matched any `karma: 0` and immediately red-flagged engine/bohemia_engine.js --
     which is the dynasty save's SILENT karma counter feeding the monument form, i.e.
     precisely the thing R17 asks for ("record it and then we can do what we want with
     the information"). That is the ninth time in this repo a check has hunted a WORD
     instead of a THING, and it would have failed another lane's correct work the way
     ten_years_cold_gate falsely failed bohemia_purse.js. The ban is DISPLAY only. */
  [/\b(fillText|drawText|drawLabel|hudText|innerText|textContent)\s*[(=][^)\n]{0,80}\b(karma|moralit\w*)\b/i,
   'R17: a morality/karma value shown to the player'],
  [/\b(karma|morality)(Bar|Meter|Gauge|Display|Hud|Readout|Label)\b/i,
   'R17: a morality meter/readout built for the player']
];
let hits = [];
surfaces.forEach(f => {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  BANNED.forEach(([re, what]) => { if (re.test(src)) hits.push(f + ': ' + what); });
});
ok('D1 neither structural ban is broken on any shipped surface (' + surfaces.length +
   ' swept)' + (hits.length ? ' -> ' + hits.slice(0, 3).join('; ') : ''), hits.length === 0);

console.log('='.repeat(74));
console.log('  RULINGS GATE: ' + pass + ' pass / ' + fail + ' fail');
console.log('='.repeat(74));
process.exit(fail ? 1 : 0);
