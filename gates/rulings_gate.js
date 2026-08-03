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
 ['R11 walked-map inheritance', /R11's inheritance of the walked map/i],
 ['R13 check keys', /R13's actual check keys/i],
 ['R21 spread rates and NPC memory', /R21's spread rates/i],
 ['R25 the boost', /R25's boost/i],
 ['R27 whether the robot exists', /R27 — whether the robot companion exists|R27 -- whether the robot companion exists/i]
].forEach(([what, re]) => ok('B2 still his: ' + what, re.test(stillHis)));
ok('B3 R5 is marked pending at the ruling itself, not only in the summary list',
   /\[PENDING Paolo\][^.]{0,40}NO DIAL, NO NUMBERS/i.test(rec) ||
   /R5[\s\S]{0,300}\[PENDING Paolo\]/.test(rec));
ok('B4 R11 is offered as MY recommendation with HIS call left open',
   /\[MY RECOMMENDATION, HIS CALL\]/.test(rec) && /Still yours to rule/i.test(rec));
/* The quote mark sits OUTSIDE the period in the prose ("maybe."), so a regex that
   demanded a closing quote straight after the word failed on correct text. Same
   family as every other prose bug in this repo: match the words, not the punctuation. */
ok('B5 R27 stays a MAYBE and is not promoted to a ruling',
   /Recorded as a MAYBE, not a ruling/i.test(rec) && /it stays ["'“]?maybe/i.test(rec));

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
