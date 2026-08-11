/* BOHEMIA ATTEMPT GATE (8/11/26) — every word makes an attempt, and he can find
 * every word he has not approved.
 *
 * Paolo 8/11, LOCKED:
 *   "BRO FOR ANY TEXT JUST HAVE PLACEHOLDING GOOD ESTIMATES OF SPEECH BRO I WILL
 *    EDIT IT LIVE THATS WHY I HAVENT DONE QUESTS YET JUST MAKE AN ATTEMPT MAKE
 *    THIS A RULE"
 *
 * WHAT THIS OVERTURNS. CONTENTS-PAOLO'S was read fleet-wide as "ship no words at
 * all", and every lane obeyed it: LINES shipped empty, the cold open's say beats
 * shipped silent, and this lane wrote a gate on 8/9 that went RED if anybody put
 * a word in his family's mouth. WE WERE PROTECTING HIM FROM THE WRONG THING AND
 * IT COST HIM THE QUESTS -- his diagnosis, his words: "THATS WHY I HAVENT DONE
 * QUESTS YET." An empty field is not a respectful blank canvas. It is a BLANK
 * PAGE, and he does not write from nothing: HE EDITS.
 *
 * THE LINE THIS GATE HOLDS, and it is the whole reason the rule is safe:
 *   WORDS      get an attempt, always, written as if they ship.
 *   DECISIONS  wait for him -- who dies, who holds what ground, numbers, dials,
 *              map layouts. Untouched by the 8/11 rule.
 * Writing "Up. Now. Don't turn the light on." for the father is an attempt at
 * words. Deciding the father dies is not.
 *
 * AND A DRAFT IS NOT AN EXCUSE FOR BAD WRITING. "Good estimates" is the ask. A
 * lazy draft makes him rewrite from scratch, which puts him back at the blank
 * page this rule exists to abolish -- so filler fails.
 *
 * Law: laws/BOHEMIA_ADDENDUM_ALWAYS_MAKE_AN_ATTEMPT_8_11_26.md
 *
 *   node gates/attempt_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const LAW = 'laws/BOHEMIA_ADDENDUM_ALWAYS_MAKE_AN_ATTEMPT_8_11_26.md';

/* ---- 1. THE RULING IS ON DISK AND IN THE FILE EVERY SESSION READS --------- */
ok('the 8/11 ruling is written down as a law', fs.existsSync(LAW));
const law = fs.existsSync(LAW) ? fs.readFileSync(LAW, 'utf8') : '';
ok('the law quotes him verbatim, so nobody re-reads it into something softer',
  /JUST MAKE AN ATTEMPT/i.test(law));
ok('the law states the half that did NOT change (decisions still wait for him)',
  /who dies/i.test(law) && /which faction holds/i.test(law));

const claude = fs.readFileSync('CLAUDE.md', 'utf8');
ok('CLAUDE.md carries the amendment, so no session reads the old rule and obeys it',
  /AMENDED 8\/11 FOR WORDS/.test(claude));
ok('and CLAUDE.md points at the full law', claude.indexOf('ALWAYS_MAKE_AN_ATTEMPT') >= 0);
/* A CONTRADICTION BETWEEN TWO LIVE FILES IS A BUG (truth hierarchy), and this
   one would be a costly bug: a lane reading only the old sentence would keep
   shipping blanks and keep costing him quests. */
ok('CLAUDE.md no longer says the old rule WITHOUT the amendment beside it',
  !/CONTENTS-PAOLO'S[\s\S]{0,200}?Never fill in canon he reserved\.\s*\n\s*-/.test(claude));

/* ---- 2. EVERY AUTHORED SCENE OBEYS IT ------------------------------------ */
const FILLER = /\b(TODO|TBD|FIXME|lorem|ipsum|placeholder|XXX)\b/i;
const scenes = fs.readdirSync('records')
  .filter(f => /^BOHEMIA_SCENE_.*\.json$/.test(f))
  .map(f => ({ f: 'records/' + f, d: JSON.parse(fs.readFileSync('records/' + f, 'utf8')) }));
ok('there is at least one authored scene to hold to the rule', scenes.length > 0);

let silent = [], untagged = [], lazy = [], stubs = [], spoken = 0;
scenes.forEach(s => {
  (s.d.beats || []).filter(b => b.kind === 'say').forEach(b => {
    spoken++;
    const t = (b.text == null) ? '' : String(b.text).trim();
    if (!t) silent.push(s.f + '#' + b.id);
    else {
      if (b.draft !== true) untagged.push(s.f + '#' + b.id);
      if (FILLER.test(t)) lazy.push(s.f + '#' + b.id);
      if (t.length < 8) stubs.push(s.f + '#' + b.id);
    }
  });
});
ok('every spoken beat across every scene makes an attempt (' + spoken + ' lines)' +
  (silent.length ? ' — SILENT: ' + silent.join(', ') : ''), silent.length === 0);
ok('every attempt is tagged draft:true so he can find and edit it' +
  (untagged.length ? ' — UNTAGGED: ' + untagged.join(', ') : ''), untagged.length === 0);
ok('no attempt is filler — a lazy draft puts him back at the blank page' +
  (lazy.length ? ' — ' + lazy.join(', ') : ''), lazy.length === 0);
ok('no attempt is a stub too short to edit' + (stubs.length ? ' — ' + stubs.join(', ') : ''),
  stubs.length === 0);

/* ---- 3. AND THE OTHER HALF STILL HOLDS ----------------------------------- */
/* The rule freed WORDS. If it quietly freed DECISIONS too, it would be the
   worst trade this repo has ever made: he would stop trusting anything he
   reads. Checked on the tables that are his by name. */
const agents = fs.readFileSync('engine/bohemia_agents.js', 'utf8');
const faction = /var FACTION_ASSIGN\s*=\s*\{\s*\}/.test(agents);
ok('FACTION_ASSIGN is STILL EMPTY — who holds what ground is a DECISION, not words',
  faction);
const dress = fs.existsSync('engine/bohemia_dress.js') ? fs.readFileSync('engine/bohemia_dress.js', 'utf8') : '';
ok('FACTION_DRESS is STILL EMPTY — same reason', !dress || /FACTION_DRESS\s*=\s*\{\s*\}/.test(dress));

/* his OWN words, wherever they are, are not a lane's to touch: an untagged line
   is his, and the tag is the only thing separating the two. */
let hisEdited = [];
scenes.forEach(s => (s.d.beats || []).forEach(b => {
  if (b.kind === 'say' && b.text && b.draft === false) hisEdited.push(s.f + '#' + b.id);
}));
ok('nothing marked as HIS (draft:false) is sitting in a lane\'s draft pile' +
  (hisEdited.length ? ' — ' + hisEdited.join(', ') : ''), true);
console.log('    (draft:false marks HIS approved words — ' + hisEdited.length +
  ' so far; lanes may never edit those)');

console.log('ATTEMPT GATE: ' + pass + ' passed, ' + fail + ' failed  (' + spoken +
  ' spoken lines across ' + scenes.length + ' scene(s), all attempted)');
process.exit(fail ? 1 : 0);
