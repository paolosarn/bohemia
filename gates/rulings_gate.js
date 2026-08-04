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

/* ---- THE BOSS LADDER ------------------------------------------------------- */
/* He gave the mechanism ("unlock a new skill or like a tool to alter the world around
   you") and then the NAMING ("maybe there's like a water BOSS ... a concrete boss"). Two
   rulings, both recorded. The checks here are on the things a machine can hold: his two
   quotes survive, the ladder is internally consistent, the count in the prose matches the
   count of actual entries, and the load-bearing design catches are still written down. */
const LADDER = 'records/BOHEMIA_THE_BOSS_LADDER_CANDIDATES_8_3_26.md';
ok('G1 the boss ladder record exists', fs.existsSync(path.join(ROOT, LADDER)));
const rawLad = fs.existsSync(path.join(ROOT, LADDER))
  ? fs.readFileSync(path.join(ROOT, LADDER), 'utf8') : '';
const lad = norm(rawLad);
ok('G2 his mechanism quote survives',
   /unlock a new skill or like a tool to alter the world around you/i.test(lad));
ok('G3 his NAMING quote survives',
   /there's like a water BOSS maybe there's like a light boss maybe there's like a concrete boss/i
     .test(lad));
ok('G4 the boss IS the substance, not a character handle',
   /THE BOSS IS THE SUBSTANCE/i.test(lad));
/* THE COUNT MUST MATCH THE ENTRIES. I wrote "17" while there were 16, by double-counting a
   RENAME as an addition -- the toll boss becoming the asphalt boss is not a new boss. A
   stated total that disagrees with the list is the same class of rot as the duplicated
   heading numbers C4b catches, so it gets the same treatment: count the things. */
const entries = (rawLad.match(/^\*\*\d+\. [★ ]*THE [A-Z]+ BOSS/gm) || []);
const stated = (rawLad.match(/THE LADDER — (\d+) CANDIDATES/) || [])[1];
ok('G5 the stated count matches the actual entries (' + entries.length + ' entries, states ' +
   stated + ')', !!stated && +stated === entries.length);
ok('G6 the entries are numbered 1..N with no duplicates or gaps',
   entries.map(e => +e.match(/\d+/)[0]).every((n, i) => n === i + 1));
ok('G7 the miscount is recorded rather than quietly corrected',
   /First draft of this line said 17/i.test(lad));
/* THE FOUR DESIGN CATCHES. Each is a sentence a later session would delete as waffle, and
   each is the reason the ladder is not broken. */
ok('G8 a biome is a MISSING FUNCTION, not a place',
   /A BOHEMIA "?BIOME"? IS A MISSING FUNCTION, NOT A PLACE/i.test(lad));
ok('G9 the ability/resource rule that stops the light boss ending the game',
   /A BOSS GRANTS THE ABILITY, NEVER THE RESOURCE/i.test(lad) &&
   /the light boss ends the game/i.test(lad));
ok('G10 concrete carries REAL prerequisites, not an invented tier order',
   /the only material in Bohemia you cannot scavenge/i.test(lad) &&
   /the order is physics/i.test(lad));
ok('G11 the Destroyers are excluded from boss-hood, with the citation',
   /Destroyers can never be bosses/i.test(lad) &&
   /ACT1_PROCEDURAL_ENDING_AND_DESTROYERS/.test(lad));
ok('G12 the soil boss depends on the dead-world law rather than breaking it',
   /DEAD WORLD BY LAW/i.test(lad) && /most powerful thing in Bohemia is a green shoot/i.test(lad));
ok('G13 every boss is takeable WITHOUT killing -- the thing that makes it not Valheim',
   /can be taken WITHOUT killing/i.test(lad) &&
   /least possible loss of life/i.test(lad));
ok('G14 it stays candidates, and the names stay placeholders',
   /CANDIDATES FOR HIS THUMBS\. NOT CANON/i.test(lad) &&
   /Every name above is a PLACEHOLDER/i.test(lad));
ok('G15 no damage number leaked into it',
   /No numbers anywhere: NO DAMAGE BEFORE THE DIAL/i.test(lad));

/* ---- REVISION 2: THE LADDER MUST FIT THE LOCKED CAPS, NOT INVENT ITS OWN ----
   The act repair caps (15% / 33-40% / 80-100%) were LOCKED by another session on 8/4 in
   THE VALHEIM SHAPE §3, while this lane was working. The danger with a proposal that
   arrives at the same subject independently is that it quietly restates the numbers
   slightly differently and the fleet ends up with two versions. So: the ladder must CITE
   that law, must not state a percentage of its own, and must carry the clause that
   corrected it -- §4b, that the endgame currency is ALLIANCE and not concrete. */
const SHAPE = 'laws/BOHEMIA_ADDENDUM_THE_VALHEIM_SHAPE_8_4_26.md';
ok('G16 the locked act-caps law exists', fs.existsSync(path.join(ROOT, SHAPE)));
ok('G17 the ladder cites it rather than restating his numbers as new input',
   /THE_VALHEIM_SHAPE_8_4_26/.test(lad) && /already LOCKED canon/i.test(lad));
ok('G18 and says plainly it sets no percentage of its own',
   /It sets no percentage of its own/i.test(lad));
ok('G19 §4b is carried: the endgame currency is ALLIANCE, not concrete',
   /endgame currency is NOT CONCRETE, IT IS\s*ALLIANCE/i.test(lad) ||
   /currency is NOT CONCRETE, IT IS ALLIANCE/i.test(lad));
ok('G20 and the ladder records that this CORRECTED it, instead of pretending it agreed',
   /That last clause is the correction/i.test(lad));
ok('G21 BUILDING IS OPTIONAL survives: the caps are ceilings, never floors',
   /CEILINGS, never floors/i.test(lad) &&
   /a player who beats none of them still finishes the game/i.test(lad));
/* THE THREE VERBS ARE THE ANTI-GRIND ARCHITECTURE. Without them the ladder is just a
   longer list, and a longer list is exactly what the research says causes the wall. */
ok('G22 each act changes the VERB rather than repeating one',
   /YOU build it/i.test(lad) && /YOUR CREWS build it/i.test(lad) &&
   /THE CITY builds itself/i.test(lad));
ok('G23 the research finding that explains why (unit of work must grow) is recorded',
   /LAST UNIT OF PROGRESS COSTING THE SAME AS THE FIRST/i.test(lad));
ok('G24 and the certainty finding, which is why alliance keeps the tail alive',
   /CERTAINTY PROBLEM, NOT A LENGTH PROBLEM/i.test(lad) &&
   /you can still lose it/i.test(lad));
ok('G25 the optional-boss precedent is cited with its real count (Hollow Knight)',
   /Hollow Knight/i.test(lad) && /47/.test(lad) && /OPTIONAL/i.test(lad));
ok('G26 the faction roster is cited as existing rather than invented',
   /records\/factions\//.test(lad) && /16 dossiers/i.test(lad));
ok('G27 and no faction canon is written here',
   /I am not writing faction canon/i.test(lad));
ok('G28 the parallel-session collision is disclosed, not hidden',
   /PARALLEL-SESSION NOTE/i.test(lad));

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
