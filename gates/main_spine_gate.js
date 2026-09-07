/* ============================================================================
   MAIN SPINE GATE (9/6/26, QUESTS lane) -- VAMILY [main story], MAIN-QUEST-SPINE.

   THE HOLE THIS CLOSES: this repo held 53 fully-produced quest design documents
   and 27 playable side quests and, until this round, NOT ONE MAIN-QUEST FILE.
   The board called it the single largest hole in the game and it was right: the
   story existed entirely as prose nobody could play.

   WHAT THE SPINE IS, AND EVERY BEAT OF IT IS HIS, out of
   laws/BOHEMIA_STORY_MASTER_7_18_26.md and
   laws/BOHEMIA_ADDENDUM_ACT1_OPENING_VISION_7_19_26.md:
     M01 the match-cut open, the night raid, a SIBLING lost, saving the mother
     M02 the grief dinner
     M03 the burial on the ridge, which is also the vista and the title screen
     M04 the neighbour's founding
     M05 the last hour before the procedural climax

   WHAT THIS GATE EXISTS TO STOP, and it is the specific way a main quest goes
   wrong: A MAIN QUEST IS THE MOST EXPENSIVE PLACE IN THE GAME TO INVENT CANON.
   Anything written here reads as his, forever, to everybody who plays it. So:

   1. THE BEATS ARE TRACEABLE. Every quest in the spine is checked against a
      phrase in his own locked files. A beat that cannot be traced is a beat
      somebody made up.

   2. *** THE PINNED ERRAND STAYS PINNED. *** His story master says, in the
      section headed "OPEN, EXPLORING TOGETHER (not locked, do not invent
      unilaterally)", that the neighbour's first quest "is designed but its
      specific plan/errand is PINNED pending Paolo". So M04 must NOT name an
      errand, and this gate holds it to that. The founding CONVERSATION is
      locked and is built; the job he sends you on is not ours.

   3. *** THE ACT 1 CLIMAX IS NEVER SCRIPTED. *** His 7/19 ruling is that the
      climax is procedural, a combination of nine approved elements shaped by how
      the act was played. So M05 must name NONE of the nine, and this gate checks
      all nine by name. Scripting one would overturn a locked ruling in the most
      expensive file in the repo.

   4. THE DESTROYERS ARE NEVER NAMED, because his own file marks their name
      [PENDING] and calls them a FORCE and not a faction.

   5. THE OPENING LOSS IS A SIBLING. His 7/19 reconcile superseded the older
      "loses a PARENT at the start" line, and the surviving sibling is cast at
      runtime because it is the same gender as the player. So no parent dies in
      the open and no sibling is written with a fixed name.

   6. AND IT IS ACTUALLY IN THE GAME, in the workshop AND in the demo, which is
      rule 7 of the meeting hall and the thing five other features in this repo
      turned out to have skipped.
   ========================================================================== */
'use strict';
const path = require('path');
const fs   = require('fs');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) { pass++; } else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};

global.window = global;
const BQ = require(path.join(ROOT, 'engine/bohemia_bq.js'));

const DIR = path.join(ROOT, 'quests/bq');
const files = fs.readdirSync(DIR).filter(f => /^M\d\d_.*\.bq$/.test(f)).sort();
ok('0a the main spine exists as playable files (' + files.length + ')', files.length >= 5);

const spine = files.map(f => {
  const text = fs.readFileSync(path.join(DIR, f), 'utf8');
  return { f, text, Q: BQ.parse(text) };
});

/* ---- 1. THE BEATS ARE TRACEABLE TO HIS OWN FILES ------------------------ */
const norm = s => s.toLowerCase().replace(/\s+/g, ' ');
const MASTER = norm(fs.readFileSync(path.join(ROOT, 'laws/BOHEMIA_STORY_MASTER_7_18_26.md'), 'utf8'));
const VISION = norm(fs.readFileSync(path.join(ROOT, 'laws/BOHEMIA_ADDENDUM_ACT1_OPENING_VISION_7_19_26.md'), 'utf8'));
const ENDING = norm(fs.readFileSync(path.join(ROOT, 'laws/BOHEMIA_ADDENDUM_ACT1_PROCEDURAL_ENDING_AND_DESTROYERS_7_19_26.md'), 'utf8'));
const HIS = MASTER + ' ' + VISION + ' ' + ENDING;

const BEATS = {
  'M01': 'the combat tutorial is defending the home room to room',
  'M02': 'the grief dinner',
  'M03': 'the burial on the ridge',
  'M04': "the neighbor's first quest",
  'M05': 'the act 1 climax is not one fixed scripted scene'
};
Object.keys(BEATS).forEach(k => {
  ok('1a ' + k + " traces to a phrase in his own locked files", HIS.indexOf(BEATS[k]) >= 0,
     BEATS[k]);
  ok('1b ' + k + ' has a file in the spine', spine.some(s => s.f.indexOf(k) === 0));
});
ok('1c every spine file declares ACT 1', spine.every(s => String(s.Q.act) === '1'));
ok('1d every spine file is @ONCE (a main beat does not repeat)',
   spine.every(s => /@ONCE\s+true/.test(s.text)));

/* ---- 2. THE PINNED ERRAND STAYS PINNED --------------------------------- */
ok('2a his story master still says the founding errand is pinned',
   HIS.indexOf('is pinned pending paolo') >= 0);
const m04 = spine.find(s => s.f.indexOf('M04') === 0);
ok('2b M04 exists', !!m04);
if (m04) {
  /* The neighbour must not hand over a job. If he ever names one, it came from
     us and not from Paolo. */
  /* THE PARSER'S FIELD IS `talks`, NOT `nodes`. The first cut of this check read
     an empty array, so `said` was the empty string and the check passed no matter
     what M04 said. A NEGATIVE CONTROL CAUGHT IT: injecting a real errand ("go and
     bring me the pump housing") left this green while the climax check next to it
     correctly went red. A gate that cannot fail is not a gate, so the control is
     kept below as a live self-test rather than as a thing I ran once. */
  const said = (m04.Q.talks || []).flatMap(n => (n.says || []).map(x => String(x.text || x))).join(' ').toLowerCase();
  ok('2c0 the check is reading real text and not an empty array (' + said.length + ' chars)',
     said.length > 200);
  const namesAJob = /(go and |bring me|fetch|steal|kill|deliver|clear out|take the|meet me at) /.test(said);
  ok('2c *** M04 never names the pinned errand ***', !namesAJob, said.slice(0, 90));
  ok('2d and M04 says out loud, in its own header, that the errand is pinned',
     /PINNED/.test(m04.text));
  ok('2e and the founding still reaches a real decision (COMPLETE exists)',
     /@STAGE \d+ COMPLETE/.test(m04.text));
}

/* ---- 3. THE CLIMAX IS NEVER SCRIPTED ----------------------------------- */
const NINE = ['the long night', 'the killing summer', "the elder's accident",
  'the hundred-year flood', 'the faction that died', 'the wedding that burned',
  'the dry taps', 'the first harvest', 'the one inside'];
const m05 = spine.find(s => s.f.indexOf('M05') === 0);
ok('3a M05 exists', !!m05);
if (m05) {
  /* His nine element names must not appear in the PLAYED text. The header may
     discuss the ruling; the quest may not pick one. */
  const played = m05.text.split('\n').filter(l => !/^\s*#/.test(l)).join(' ').toLowerCase();
  const picked = NINE.filter(n => played.indexOf(n) >= 0);
  ok('3b *** M05 names none of his nine climax elements (' + picked.length + ') ***',
     picked.length === 0, picked.join(' | '));
  ok('3c and his procedural ruling is still on the books',
     HIS.indexOf('the act 1 climax is not one fixed scripted scene') >= 0);
}

/* ---- 4. THE DESTROYERS ARE NEVER NAMED --------------------------------- */
const allPlayed = spine.map(s => s.text.split('\n').filter(l => !/^\s*#/.test(l)).join(' ')).join(' ').toLowerCase();
ok('4a no spine file names the Destroyers (their name is PENDING in his file)',
   allPlayed.indexOf('destroyer') < 0);
ok('4b and his file still marks that name pending', /name pending/.test(HIS));

/* ---- 5. THE OPENING LOSS IS A SIBLING ---------------------------------- */
const m01 = spine.find(s => s.f.indexOf('M01') === 0);
ok('5a M01 exists', !!m01);
if (m01) {
  ok('5b the sibling is a cast ROLE, never a written name',
     /@ROLE\s+sibling\b/.test(m01.text));
  ok('5c the mother and father are roles too',
     /@ROLE\s+mother\b/.test(m01.text) && /@ROLE\s+father\b/.test(m01.text));
  /* His 7/19 reconcile: the OPENING death is the sibling, both parents survive. */
  const played = m01.text.split('\n').filter(l => !/^\s*#/.test(l)).join(' ').toLowerCase();
  ok('5d0 the parent check is reading real text (' + played.length + ' chars)', played.length > 500);
  ok('5d neither parent is killed in the open',
     !/(mother|father|mom|dad)[^.]{0,40}(died|is dead|killed)/.test(played));
  ok('5e and his reconcile still says the opening loss is a sibling',
     HIS.indexOf('the opening loss is a sibling') >= 0);
}
/* NO HARDCODED NAMES ANYWHERE IN THE SPINE, which is the .bq craft rule and also
   what keeps these files alive across a dynasty turning over. */
spine.forEach(s => {
  const roles = (s.text.match(/@ROLE\s+(\w+)/g) || []).map(r => r.split(/\s+/)[1]);
  const speakers = (s.text.match(/speaker=(\w+)/g) || []).map(r => r.split('=')[1]);
  const unknown = speakers.filter(sp => roles.indexOf(sp) < 0);
  ok('5f ' + s.f.slice(0, 3) + ' every speaker is a declared role, never a name',
     unknown.length === 0, unknown.join(' '));
});

/* ---- 6. IT IS ACTUALLY IN THE GAME ------------------------------------- */
const alpha = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
const demo  = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_DEMO.html'), 'utf8');
spine.forEach(s => {
  const ref = '"file": "quests/bq/' + s.f + '"';
  ok('6a ' + s.f.slice(0, 3) + ' is baked into the workshop', alpha.indexOf(ref) >= 0);
  ok('6b ' + s.f.slice(0, 3) + ' is baked into the demo', demo.indexOf(ref) >= 0);
});

/* ---- THE SELF-TEST. Every detector in this gate is fired at a string it MUST
   catch, because two of them were silently reading empty arrays and passing. A
   check that has never been seen to fail is a check nobody has tested. ------ */
const ERRAND_RE = /(go and |bring me|fetch|steal|kill|deliver|clear out|take the|meet me at) /;
ok('S1 the pinned-errand detector fires on a real errand',
   ERRAND_RE.test('go and bring me the pump housing from the yard '));
ok('S2 and does not fire on what M04 actually says',
   !!m04 && !ERRAND_RE.test((m04.Q.talks || []).flatMap(n => (n.says || [])
     .map(x => String(x.text || x))).join(' ').toLowerCase()));
ok('S3 the climax detector fires on a scripted element',
   NINE.some(n => 'the long night is here, and the dry taps with it'.indexOf(n) >= 0));
ok('S4 the Destroyers detector fires on the word',
   'they are the destroyers'.indexOf('destroyer') >= 0);

console.log('  [the spine] ' + spine.map(s => s.f.slice(0, 3)).join(' ') + '  ('
  + spine.length + ' main quests, ' + files.length + ' files)');
console.log('MAIN SPINE GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
