/* BOHEMIA SCENE GATE (8/9/26) — one scene plays end to end, and the family can speak.
 *
 * Paolo 8/9, demo-critical: "the scripted-scene runtime whose first consumer is the
 * Act 1 cold open (family defense, the locked 7/19 shape), and dialogue playing
 * clean through the one contextual verb so the family can speak."
 *
 * Backlog 0sc's acceptance, verbatim: "one scene plays end to end on the real
 * surface, gated | scene content = his".
 *
 * WHAT THIS GATE REFUSES TO LET HAPPEN, in order of how much it would cost:
 *
 *  1. A SCENE THAT INVENTS HIS STORY. Every scene must CITE the ruling it was
 *     authored from, and the cold open's citation must resolve to a law on disk.
 *     A scene with no citation is somebody's fan fiction wearing canon's clothes.
 *  2. A DIALOGUE BEAT THAT SWALLOWS ITS LINE. Opening a conversation is three
 *     calls (start -> available -> begin); the first version of the runtime made
 *     one, and view() answered {ended:true, says:[]}. A beat that plays silent
 *     looks EXACTLY like a line Paolo has not written yet, so the failure would
 *     have hidden behind the empty-lines-are-legal rule forever. This gate opens
 *     a REAL .bq and asserts words come out.
 *  3. WORDS APPEARING THAT HE DID NOT WRITE. The cold open's say beats carry no
 *     text on purpose. If text shows up there, somebody filled in his family's
 *     mouths.
 *  4. A SCENE THAT NEVER GIVES CONTROL BACK. Every scene must end, and
 *     playerLocked must be false once it has.
 *
 *   node gates/scene_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const S = require('../engine/bohemia_scene.js');
const LAWS_IDX = JSON.parse(fs.readFileSync('records/BOHEMIA_QUESTBOOK_LAW_INDEX.json', 'utf8')).laws;
const RT = require('../engine/bohemia_quest_runtime.js');
const BQ = require('../engine/bohemia_bq.js');
const parseBQ = BQ.parse || Object.values(BQ).find(v => typeof v === 'function');

/* ---- 1. THE RUNTIME ------------------------------------------------------- */
ok('the scene runtime exists and exports a player', typeof S.Scene === 'function');
ok('120 BPM LAW: durations are beats, and the beat is 0.5s', S.BEAT_MS === 500);
ok('the engine ships NO scenes of its own (contents-Paolo\'s)',
  S.SCENES && Object.keys(S.SCENES).length === 0);

/* it must reject a scene that never returns control */
let rejected = false;
try { new S.Scene({ id: 'x', cites: 'y', beats: [{ kind: 'wait', beats: 1 }] }); }
catch (e) { rejected = /end/.test(String(e)); }
ok('a scene with no `end` beat is REFUSED (control would never come back)', rejected);

let uncited = false;
try { new S.Scene({ id: 'x', beats: [{ kind: 'end' }] }); }
catch (e) { uncited = /cites/.test(String(e)); }
ok('a scene that CITES NO RULING is REFUSED — authored canon must name its source', uncited);

/* ---- 2. THE COLD OPEN, THE FIRST CONSUMER --------------------------------- */
const SCENE_PATH = 'records/BOHEMIA_SCENE_ACT1_COLD_OPEN.json';
ok('the Act 1 cold open is on disk', fs.existsSync(SCENE_PATH));
const cold = JSON.parse(fs.readFileSync(SCENE_PATH, 'utf8'));
ok('the cold open is a legal scene', S.validate(cold).length === 0);

/* THE CITATION MUST RESOLVE. A cite that names a file which does not exist is a
   name-drop, and this repo has a law about that. */
const cited = (cold.cites || '').match(/laws\/[A-Za-z0-9_./]+\.md/);
ok('the cold open cites a ruling by path (' + (cited ? cited[0] : 'NONE') + ')', !!cited);
ok('and that ruling really is on disk', !!cited && fs.existsSync(cited[0]));

/* THE LOCKED 7/19 SHAPE, beat by beat. Not "a scene exists" — THE shape he
   locked: a warm pre-collapse table, the same framing, one cut, ten years, the
   same table dingy, the father waking you, the family-defense handoff. */
const kinds = cold.beats.map(b => b.kind);
const byId = {}; cold.beats.forEach(b => { if (b.id) byId[b.id] = b; });
ok('THE MATCH-CUT EXISTS — the beat his ruling turns on', kinds.indexOf('cut') >= 0);
const cut = cold.beats.find(b => b.kind === 'cut');
ok('the cut keeps the SAME FRAMING (or it is not a match-cut, just a fade)',
  !!cut && cut.keepFraming === true);
ok('the cut crosses the collapse (pre -> post) and spans the ten years',
  !!cut && cut.from === 'pre_collapse' && cut.to === 'post_collapse' && cut.years === 10);
ok('it opens PRE-COLLAPSE and warm, before it takes anything',
  cold.beats[0].era === 'pre_collapse' && cold.beats[0].mood === 'warm');
ok('the player is a CHILD before the cut and an ADULT after',
  byId.you_child && byId.you_child.age === 'child' &&
  byId.you_adult && byId.you_adult.age === 'adult');
ok('the same seat either side of the cut (the match)',
  byId.you_child && byId.you_adult && byId.you_child.at === byId.you_adult.at);
ok('the whole family is at the first table — father, mother, both siblings',
  ['father', 'mother', 'sibling_older', 'sibling_lost']
    .every(a => cold.beats.some(b => b.kind === 'actor' && b.actor === a)));
ok('FIREWORKS: the 10-year anniversary of the 4th of July is set',
  cold.beats.some(b => b.sky === 'fireworks'));
ok('the FATHER wakes you (his ruling: the father raises the alarm)',
  cold.beats.some(b => b.kind === 'say' && b.speaker === 'father'));
ok('it hands off to COMBAT for the family-defense tutorial, and comes back',
  cold.beats.some(b => b.kind === 'handoff' && b.to === 'combat' && b.returns === true));
/* *** THE TWO HALVES MUST ACTUALLY MEET. ***
   COMBAT shipped the family-defense fight on 8/11 while this lane shipped the scene
   that hands off to it -- complementary by the demo plan's own routing (item 10).
   But my handoff beat originally said `family_defense` and COMBAT named it
   `cold_open`, so the pieces would have passed in the night. TWO LANES BUILDING
   HALVES THAT NEVER CONNECT IS THIS REPO'S MOST EXPENSIVE RECURRING BUG, and a
   name agreed by eye is not agreed. So: read THEIR contract and compare. */
const handoff = cold.beats.find(b => b.kind === 'handoff');
const combatSrc = fs.existsSync('tools/bohemia_alpha_cold_open_patch.py')
  ? fs.readFileSync('tools/bohemia_alpha_cold_open_patch.py', 'utf8') : '';
ok('COMBAT really exposes a cold-open encounter to hand off to', /function startColdOpen\(/.test(combatSrc));
const theirId = (/encounterId:'([a-z_]+)'/.exec(combatSrc) || [])[1];
ok('the scene\'s handoff names the encounter COMBAT ACTUALLY EXPOSES (scene says "' +
  (handoff && handoff.encounter) + '", combat says "' + theirId + '")',
  !!handoff && !!theirId && handoff.encounter === theirId);
ok('and it names the function COMBAT exposes, so the join is callable',
  !!handoff && handoff.call === 'startColdOpen' && combatSrc.indexOf('function startColdOpen(') >= 0);

/* ---- 3. EVERY LINE MAKES AN ATTEMPT (Paolo 8/11, LOCKED) ------------------
   *** THIS SECTION USED TO ASSERT THE EXACT OPPOSITE, AND IT WAS INVERTED, NOT
   DELETED. *** On 8/9 it failed if ANY text appeared in a say beat, because
   CONTENTS-PAOLO'S was read as "ship no words at all". On 8/11 he overturned
   that reading for words:

     "FOR ANY TEXT JUST HAVE PLACEHOLDING GOOD ESTIMATES OF SPEECH BRO I WILL
      EDIT IT LIVE THATS WHY I HAVENT DONE QUESTS YET JUST MAKE AN ATTEMPT"

   The old claim was not merely wrong, it was ACTIVELY COSTING HIM THE QUESTS: an
   empty field is a blank page, and he edits rather than writes from nothing.
   A GATE MUST NEVER OUTRANK A RULING (Paolo 8/1). Law:
   laws/BOHEMIA_ADDENDUM_ALWAYS_MAKE_AN_ATTEMPT_8_11_26.md */
const says = cold.beats.filter(b => b.kind === 'say');
ok('the cold open actually SPEAKS (' + says.length + ' spoken beats)', says.length > 0);
const silent = says.filter(b => !b.text || !String(b.text).trim());
ok('EVERY spoken beat makes an attempt at the words — a silent line is the failure now' +
  (silent.length ? ' — SILENT: ' + silent.map(b => b.id).join(', ') : ''),
  silent.length === 0);
/* he has to be able to FIND every word he has not approved */
const untagged = says.filter(b => b.text && b.draft !== true);
ok('every attempt is tagged draft:true so he can find and edit it' +
  (untagged.length ? ' — UNTAGGED: ' + untagged.map(b => b.id).join(', ') : ''),
  untagged.length === 0);
/* "GOOD ESTIMATES" was the ask. A draft is not an excuse for filler: if it is
   lazy he rewrites from scratch, which is the blank page all over again. */
const FILLER = /\b(TODO|TBD|FIXME|lorem|ipsum|placeholder|XXX|\.\.\.)\b/i;
const lazy = says.filter(b => b.text && FILLER.test(b.text));
ok('no attempt is filler — "good estimates" means written as if it ships' +
  (lazy.length ? ' — FILLER: ' + lazy.map(b => b.id).join(', ') : ''), lazy.length === 0);
const stub = says.filter(b => b.text && String(b.text).trim().length < 8);
ok('no attempt is a stub too short to be edited', stub.length === 0);

/* STRUCTURE IS STILL HIS. The 8/11 rule freed the WORDS and changed nothing
   else: who dies, who holds what, the dials. This is the half that must not
   drift now that the other half is open. */
/* THIS CHECK WAS WRITTEN WRONG FIRST, and the way it was wrong is the point.
   v1 grepped the whole beat for /dies|death|kill/ and went red -- on the `why`
   fields, which QUOTE his addendum ("the sibling's death are COMBAT's and his to
   author"). It flagged the citation of a ruling as a violation of it. A CHECKER
   THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (Paolo 8/1), and that
   is the fourth time this session. So: check the DATA, never the prose. A scene
   decides a casualty by carrying a field that says so, not by quoting him. */
const decidesDeath = cold.beats.filter(b =>
  b.dies === true || b.casualty || b.kills || (b.kind === 'actor' && b.state === 'dead'));
ok('the casualty is still NOT decided here — no beat carries a death (structure stays his)' +
  (decidesDeath.length ? ' — ' + decidesDeath.map(b => b.id).join(', ') : ''),
  decidesDeath.length === 0);
ok('every beat still records WHY it exists, quoting the ruling it came from',
  cold.beats.every(b => typeof b.why === 'string' && b.why.length > 10));

/* ---- 3b. THE PERSON WHO DIES TONIGHT IS IN THE ROOM TONIGHT (8/19) --------
   Backlog 0sc's 8/13 amendment, off the PLAYED-ATTACHMENT research: "attachment
   before the sibling's death is a 13.5s WATCHED match-cut ... the death needs
   PLAYED attachment ... name and one quirk surfaced before the fight
   (draft:true)". Tone research R1, finding 1: A CHARACTER NOBODY LAUGHED WITH IS
   A CHARACTER NOBODY MOURNS.

   MEASURED ON THE SCENE FILE BEFORE THIS SECTION WAS WRITTEN: sibling_lost was
   staged ONLY at the pre-collapse table and had ONE line, as a child, ten years
   before the night she is taken. She was not in the room on the night she dies.
   Every other assertion in this file was green.

   His own 7/19 ruling is what makes that a bug rather than a choice: "the death
   happens during the raid, away from [the table], in motion, in the house." She
   is alive at that table minutes before. The scene simply never put her there. */
const lostBefore = cold.beats.filter(b => b.kind === 'actor' && b.actor === 'sibling_lost');
const cutAt = cold.beats.findIndex(b => b.kind === 'cut');
ok('the sibling who is taken is staged on BOTH sides of the cut — she is alive at ' +
  'this table minutes before the raid, and a person the player never met cannot be mourned',
  lostBefore.some(b => cold.beats.indexOf(b) < cutAt) &&
  lostBefore.some(b => cold.beats.indexOf(b) > cutAt));
const lostSays = says.filter(b => b.speaker === 'sibling_lost');
ok('and she SPEAKS on both sides of the cut (' + lostSays.length + ' lines) — one line as a ' +
  'child ten years earlier is a photograph, not an acquaintance',
  lostSays.some(b => cold.beats.indexOf(b) < cutAt) &&
  lostSays.some(b => cold.beats.indexOf(b) > cutAt));

/* THE QUIRK IS ONE QUIRK, AND IT IS THE SAME ONE TWICE. Dialogue craft card 2:
   ONE quirk, played deep, not a spread of traits. The bit is his own existing
   line ("I'm not eating the green ones") rather than something invented for her,
   which is REUSE-FIRST applied to words. */
const bit = /green ones/i;
ok('her ONE quirk is the same bit on both sides of the cut, not two different traits',
  lostSays.filter(b => bit.test(b.text || '')).length >= 2);

/* AND IT PAYS OFF AT THE GRIEF DINNER. Rule of three: plant, repeat, break. The
   third instance is the mother performing the habit for somebody who is not
   there, which is his 7/19 empty-chair motif in one domestic sentence. */
const GRIEF_PATH = 'records/BOHEMIA_SCENE_ACT1_GRIEF_DINNER.json';
if (fs.existsSync(GRIEF_PATH)) {
  const grief = JSON.parse(fs.readFileSync(GRIEF_PATH, 'utf8'));
  const payoff = (grief.beats || []).filter(b => b.kind === 'say' && bit.test(b.text || ''));
  ok('the bit PAYS OFF at the grief dinner — a joke with two instances and no third is ' +
    'a joke, and the third is what makes the empty chair hurt', payoff.length >= 1);
  ok('and the payoff never says the word — his 7/19 table stays sacred, so the grief ' +
    'arrives as a kitchen habit and not as a speech about death',
    payoff.every(b => !/\b(died|dead|death|killed|gone forever)\b/i.test(b.text || '')));
}

/* ---- 3c. SHE HAS A NAME, AND IT COMES FROM THE ONE PLACE NAMES LIVE -------
   7/19, RESOLVED: "the surviving sibling is the SAME GENDER as the player. Male
   player -> older brother survives (sister dies); female player -> older sister
   survives (brother dies)." So a line saying her name cannot be one string.

   *** THE FIRST CUT OF THIS SECTION ASSERTED THE WRONG THING AND WAS GREEN. ***
   It put a drafted name pair in the scene file and checked THAT. Screenshotting
   the scene is what caught it: the mother's speaker label came back DENISE, from
   FAMILY_CAST -- a table that has held the family's drafted names since the cast
   shipped, complete with this exact gender flip in `survivesIf`. Two places
   holding one name is not redundancy, it is a promise that renaming her in one
   leaves the other saying the old name. So the scene owns NO names now, and this
   asserts the join instead. Same technique this file already uses to check the
   combat handoff: read the OTHER lane's table and compare. */
const FAM_SRC = 'tools/bohemia_family_cast_patch.py';
ok('the family cast table exists to take names from', fs.existsSync(FAM_SRC));
const famSrc = fs.existsSync(FAM_SRC) ? fs.readFileSync(FAM_SRC, 'utf8') : '';
const famRows = [...famSrc.matchAll(/role:'([A-Z]+)',\s*age:'[a-z]+',\s*name:'([A-Z]+)'\s*,\s*draft:true,\s*survivesIf:'([a-z]+)'/g)]
  .map(m => ({ role: m[1], name: m[2], survivesIf: m[3] }));
ok('and it really names the whole family, all drafts (' + famRows.map(r => r.name).join(', ') + ')',
  famRows.length === 4 && famRows.every(r => r.name.length > 1));
const lostFor = sex => (famRows.find(r => r.survivesIf === (sex === 'female' ? 'male' : 'female')) || {}).name;
ok('the cast already encodes HIS flip, so nothing here reinvents it (male player loses ' +
  lostFor('male') + ', female loses ' + lostFor('female') + ')',
  !!lostFor('male') && !!lostFor('female') && lostFor('male') !== lostFor('female'));

ok('the scene file carries NO names of its own — one source of truth',
  !cold.cast && typeof cold.castNote === 'string' && /FAMILY_CAST/.test(cold.castNote));

/* THE TOKEN MUST ACTUALLY RESOLVE ON THE SURFACE. A line that reaches a player
   reading "{sibling_lost}. Green ones too." is worse than no name at all. */
const named = cold.beats.filter(b => b.kind === 'say' && /\{[a-z_]+\}/.test(b.text || ''));
ok('at least one line actually says her name out loud (' + named.length + ')', named.length > 0);
['male', 'female'].forEach(sex => {
  const want = lostFor(sex);
  const pl = new S.Scene(cold, { names: { sibling_lost: want } });
  let bad = 0, saw = 0;
  for (let n = 0; n < 4000 && !pl.done; n++) {
    const st = pl.step();
    if (st.beat && st.beat.kind === 'say' && /\{[a-z_]+\}/.test(st.beat.text || '')) {
      saw++;
      if (!st.line || /\{[a-z_]+\}/.test(st.line) || st.line.indexOf(want) < 0) bad++;
    }
  }
  ok('a ' + sex + ' player hears the right name from the cast — ' + want + ' (' + saw +
    ' lines, ' + bad + ' wrong)', saw > 0 && bad === 0);
});

/* AND THE SURFACE HAS TO PRINT THE RESOLVED ONE. The runtime resolving correctly
   while the draw path prints beat.text raw is a green gate over a caption full of
   braces, and that is exactly what the first cut did. */
const SURF = 'engine/bohemia_story_surface.js';
const surf = fs.existsSync(SURF) ? fs.readFileSync(SURF, 'utf8') : '';
ok('the story surface RESOLVES the line rather than printing the authored token',
  /fillNames\(b\.text/.test(surf) && !/text: b\.text \|\| ''/.test(surf));
ok('and it takes the family\'s names from FAMILY_CAST, owning none itself',
  /FAMILY_CAST/.test(surf) && /survivesIf/.test(surf));

/* ---- 3d. BEAT 3 OF HIS LOCKED OPENING: THE BURIAL ON THE RIDGE (8/19) -----
   His 7/19 law calls the sequence CRYSTALLIZED and lists three beats: NIGHT
   RAID, THE GRIEF DINNER, THE BURIAL ON THE RIDGE ("tutorial ends here").
   Scenes 1 and 2 shipped 8/9-8/11. Beat 3 was never built, and scene 2 ended
   with the mother saying "We go up in the morning" -- a promise the game had
   nothing to keep. Meanwhile the vista shipped and plays with NO grave and NO
   family, which is his thesis exactly backwards: "the first time you ever see
   Bohemia's beauty, you see it through tears, over a fresh grave." */
const RIDGE_PATH = 'records/BOHEMIA_SCENE_ACT1_RIDGE_BURIAL.json';
ok('beat 3 of the locked opening sequence exists at all', fs.existsSync(RIDGE_PATH));
if (fs.existsSync(RIDGE_PATH)) {
  const ridge = JSON.parse(fs.readFileSync(RIDGE_PATH, 'utf8'));
  ok('the burial is a legal scene', S.validate(ridge).length === 0);
  const rCite = (ridge.cites || '').match(/laws\/[A-Za-z0-9_./]+\.md/);
  ok('and it cites the ruling it was authored from, on disk',
    !!rCite && fs.existsSync(rCite[0]));

  /* THE CHAIN. A scene nothing leads to is the vista's own bug wearing a
     different hat: built, armed, zero callers. */
  const grief2 = JSON.parse(fs.readFileSync(GRIEF_PATH, 'utf8'));
  const link = (grief2.beats || []).find(b => b.kind === 'handoff' && b.scene === ridge.id);
  ok('THE GRIEF DINNER LEADS TO IT — the opening is one unbroken chain, 1 -> 2 -> 3',
    !!link);
  ok('and the tutorial ends there rather than coming back (his law: "tutorial ends here")',
    !!link && link.returns === false);

  /* THE REVEAL IS WORDLESS. His match-cut shows the apocalypse "without a word";
     the valley gets the same. A line over the reveal is the game telling the
     player how to feel about the view. */
  const rb = ridge.beats;
  const camAt = rb.findIndex(b => b.kind === 'camera');
  const firstSay = rb.findIndex(b => b.kind === 'say');
  ok('the full-scope valley reveal exists as its own framing beat', camAt >= 0);
  ok('and NOBODY SPEAKS OVER IT — the reveal is silent, then people talk',
    camAt >= 0 && firstSay > camAt &&
    rb.slice(camAt, firstSay).some(b => b.kind === 'wait' && b.beats >= 4));

  /* THE RULE OF THREE IS SPENT. The green-ones bit ran plant/repeat/break across
     the first two scenes. A fourth instance here would cheapen the one that
     lands at the grief dinner. */
  ok('the green-ones bit is NOT called back a fourth time — three was the joke',
    !rb.some(b => b.kind === 'say' && /green ones/i.test(b.text || '')));

  /* WORDS: drafted, cited, no filler, spanning the corpus. */
  const rSays = rb.filter(b => b.kind === 'say');
  ok('the burial speaks (' + rSays.length + ' lines), every one a tagged draft',
    rSays.length >= 3 && rSays.every(b => b.text && b.draft === true));
  const rStudies = {}, rMasters = {}, rBad = [];
  rSays.forEach(b => {
    if (!b.study || b.study.length < 2) { rBad.push(b.id + ' (<2)'); return; }
    b.study.forEach(c => {
      const e = LAWS_IDX[c.id];
      if (!e) { rBad.push(b.id + ' -> ' + c.id + ' unresolved'); return; }
      if (String(e.title).trim() !== String(c.title).trim()) rBad.push(b.id + ' -> ' + c.id + ' not verbatim');
      if (String(c.applied || '').trim().length < 40) rBad.push(b.id + ' -> ' + c.id + ' thin');
      rStudies[e.study] = 1; rMasters[e.kind] = 1;
    });
  });
  ok('every burial line cites the catalogue, verbatim, applied (' +
    Object.keys(rStudies).length + ' studies, ' + Object.keys(rMasters).length + ' masters)',
    rBad.length === 0 && Object.keys(rStudies).length >= 2 && Object.keys(rMasters).length >= 2,
    rBad.slice(0, 3).join(' | '));

  /* STRUCTURE IS STILL HIS. */
  ok('the burial decides no casualty either',
    !rb.some(b => b.dies === true || b.casualty || b.kills || (b.kind === 'actor' && b.state === 'dead')));
  ok('and it does not resolve whether the father is on that hill — his call, and ' +
    'the DIRECT tab is where it gets made',
    !rb.some(b => b.kind === 'actor' && b.actor === 'father'));
  ok('her name comes from the same one place (the token, not a copy)',
    rb.some(b => b.kind === 'say' && /\{sibling_lost\}/.test(b.text || '')) && !ridge.cast);

  /* *** AND IT MUST NOT BE DRAWN WRONG. *** The cutscene surface builds an
     INTERIOR -- walls, floor, baseboard, window, table, bodies posed sit-chair.
     Handed an outdoor burial it silently generated the family's living room and
     sat three people down at dinner. Rendered and looked at, which is the only
     way that was ever going to be caught. */
  ok('the burial DECLARES that its set art does not exist yet',
    typeof ridge.needsArt === 'string' && ridge.needsArt.length > 8);
  const surf2 = fs.readFileSync('engine/bohemia_story_surface.js', 'utf8');
  ok('and the surface HONOURS that with an empty frame instead of the wrong room',
    /this\.blank = this\.scene\.needsArt/.test(surf2) && /NO SET ART YET/.test(surf2));
}

/* ---- 3e. THE OPENING IS A SEQUENCE, AND IT PLAYED ONE THIRD OF ONE (8/19) --
   His law: "The pieces fuse into ONE UNBROKEN SEQUENCE: 1. NIGHT RAID ...
   2. THE GRIEF DINNER ... 3. THE BURIAL ON THE RIDGE (tutorial ends here)."
   The opening runner played scene 1 and called openDone, so beats 2 and 3 had
   never happened in the played game -- they were chips in a dev tab. */
const ALPHA_SRC = fs.existsSync('slices/BOHEMIA_ALPHA_0_9.html')
  ? fs.readFileSync('slices/BOHEMIA_ALPHA_0_9.html', 'utf8') : '';
ok('the opening runner reads what a scene says comes next',
  /function openNext\(/.test(ALPHA_SRC));
ok('and every scene of the sequence is played by the SAME code path (openPlay)',
  /function openPlay\(/.test(ALPHA_SRC) && /openHandoff[^]{0,900}return openPlay\(nxt\)/.test(ALPHA_SRC));
ok('every scene it plays gets HIS DIRECT edits, not only the first one',
  /function openDirected\(/.test(ALPHA_SRC));

/* *** THE ONE THAT MATTERS: IT MUST NOT SKIP THE RAID. *** The cold open hands
   off to COMBAT, where the sibling is taken. MEASURED 8/19: startColdOpen has
   exactly ONE occurrence in the alpha -- its own definition -- and ZERO callers,
   so the raid has never been played from anywhere and the death the entire
   opening is built on does not happen in the played game. Auto-advancing past a
   combat handoff would seat the family at the grief dinner mourning somebody the
   player never saw die, which is worse than stopping. */
ok('a handoff to another SCENE chains, and anything else stops the sequence',
  /h\.to *=== *'scene'/.test(ALPHA_SRC) && !/h\.to *!== *'scene'[^]{0,80}openPlay/.test(ALPHA_SRC));
ok('and there is a published seam to resume it once the raid is wired (openContinue)',
  /function openContinue\(/.test(ALPHA_SRC));

/* THE COMBAT SEAM IS REAL BUT UNCALLED, and that is the demo's biggest hole.
   This asserts the seam EXISTS (so the chain is wireable) without asserting it
   is called, because it is not, and a gate that lies about that helps nobody. */
const callers = (ALPHA_SRC.match(/startColdOpen\(/g) || []).length;
ok('the raid COMBAT published is still callable by name (' + callers + ' occurrence' +
  (callers === 1 ? ', its definition only — NOBODY CALLS IT, the raid never plays' : 's') + ')',
  /function startColdOpen\(/.test(ALPHA_SRC));

/* A SCENE SAYS WHEN IT IS. The caption was hardcoded to two values, so the
   morning after the raid was captioned "ten years later" on both surfaces. */
ok('a scene can say WHEN it is, and both surfaces read it',
  /scene\.when/.test(ALPHA_SRC) && (ALPHA_SRC.match(/\.when/g) || []).length >= 2);
if (fs.existsSync(GRIEF_PATH)) {
  const g3 = JSON.parse(fs.readFileSync(GRIEF_PATH, 'utf8'));
  const r3 = fs.existsSync(RIDGE_PATH) ? JSON.parse(fs.readFileSync(RIDGE_PATH, 'utf8')) : {};
  ok('and the two scenes after the cut actually say so (' + (g3.when || '?') + ' / ' +
    (r3.when || '?') + ')', !!g3.when && !!r3.when);
}

/* ---- 3f. THE RAID ACTUALLY RUNS NOW (8/20) --------------------------------
   startColdOpen(onEnd) sat in the alpha from 8/8 with exactly ONE occurrence,
   its own definition. The family-defense encounter -- the combat tutorial, the
   raid, the scene the sibling is killed in -- had never been played from
   anywhere, so the game went warm dinner -> cut -> "get to the back door" ->
   wake up on day 1 and get a job. The death the whole opening is built on did
   not happen, which made the grief dinner mourn nothing and the burial bury
   nobody. Twelve days, every gate green. */
ok('the opening HONOURS a combat handoff instead of ending on it',
  /function openHandoff\(/.test(ALPHA_SRC) && /function openRaid\(/.test(ALPHA_SRC));
ok('and it calls the seam by the name THE SCENE declares, never a hardcoded one',
  /window\[h\.call\]/.test(ALPHA_SRC) && !/openRaid[^]{0,400}startColdOpen\(/.test(ALPHA_SRC));
ok('it switches the surface with the alpha\'s OWN switcher, not a second one',
  /showTabPanel\('combat'\)/.test(ALPHA_SRC) && /showTabPanel\('run'\)/.test(ALPHA_SRC));
ok('IT FAILS SAFE: no seam, no switcher, or a throw, and the opening just ends ' +
  'the way it did before', /typeof fn !== 'function'\) return false/.test(ALPHA_SRC) &&
  /typeof showTabPanel !== 'function'\) return false/.test(ALPHA_SRC));
ok('and it does not invent a second handoff path — cityEncounterIn\'s shape is ' +
  'cited and mirrored', /cityEncounterIn/.test(ALPHA_SRC));

/* *** A returns:true HANDOFF THAT NAMES NOTHING TO RETURN TO STOPS ON SUCCESS. ***
   Found by driving it: the raid fired, and the resume read the cold open's
   handoff, saw to:'combat', found nothing to chain, and ended the opening. The
   grief dinner would never have played AFTER the fight -- and it would have
   shipped green, because until this turn the raid had never run far enough for
   the resume path to be reached at all. */
const hoff = cold.beats.find(b => b.kind === 'handoff');
ok('the cold open\'s handoff names what plays when the raid comes back (then: ' +
  ((hoff && hoff.then) || 'NOTHING') + ')', !!(hoff && hoff.returns === true && hoff.then));
ok('and that scene really exists in the catalogue',
  !!(hoff && hoff.then) && fs.existsSync(GRIEF_PATH) &&
  JSON.parse(fs.readFileSync(GRIEF_PATH, 'utf8')).id === hoff.then);
ok('openContinue reads `then`, so resuming from a fight goes somewhere',
  /h\.then \|\|/.test(ALPHA_SRC));
/* every returns:true handoff, not just this one */
const dangling = cold.beats.filter(b => b.kind === 'handoff' && b.returns === true && !b.then);
ok('no handoff promises to return and names nowhere to return to',
  dangling.length === 0, dangling.map(b => b.id).join(' '));

/* ---- 4. IT PLAYS END TO END ----------------------------------------------- */
const player = new S.Scene(cold);
const run = player.playAll();
ok('THE COLD OPEN PLAYS END TO END (' + run.steps + ' steps, ' +
  S.sceneBeats(cold) + ' beats = ' + (S.beatsToMs(S.sceneBeats(cold)) / 1000) + 's at 120 BPM)',
  run.done === true);
ok('and it gives control back when it ends', player.playerLocked() === false);
ok('the beats played in the authored order', run.log.length === cold.beats.length);

/* DETERMINISTIC — a scene the gate can play is a scene that plays the same for him */
const a = new S.Scene(cold).playAll().log, b = new S.Scene(cold).playAll().log;
ok('deterministic: the same scene twice is the same scene', JSON.stringify(a) === JSON.stringify(b));

/* ---- 5. THE FAMILY CAN SPEAK: dialogue clean through the runtime ---------- */
/* Driven with a REAL .bq, not a stub, because the failure this catches is a beat
   that opens nothing and plays silent. */
const bqPath = 'quests/bq/S02_THE_SAME_CRATE_TWICE.bq';
ok('a real canon conversation is on disk to prove this with', fs.existsSync(bqPath));
if (fs.existsSync(bqPath)) {
  const Q = parseBQ(fs.readFileSync(bqPath, 'utf8'));
  const sc = { id: 'dlg', cites: 'gate probe', beats: [{ kind: 'say', speaker: 'red_boss', bq: Q, stage: 10, beats: 1 }, { kind: 'end' }] };
  const p = new S.Scene(sc, { bq: RT });
  const step = p.step();
  ok('a say beat OPENS the real dialogue runtime (not a second one — REUSE-FIRST)', !!step.dialogue);
  const v = step.dialogue;
  ok('it names a SPEAKER (' + (v && v.speaker) + ')', !!v && !!v.speaker);
  ok('WORDS COME OUT — the beat does not swallow the line', !!v && (v.says || []).length > 0 &&
    String(v.says[0]).length > 10);
  ok('the player is offered choices (' + (v ? (v.options || []).length : 0) + ')',
    !!v && (v.options || []).length > 0);
  ok('SILENCE is one of them — saying nothing is a move in this game',
    !!v && (v.options || []).some(o => o.silence));
  /* PLAYS CLEAN THROUGH means it ADVANCES, not just opens.
     GUARDED, because the first version of this line CRASHED when the mutation
     test broke begin(): p.dialogue was null and .choose() threw, so the gate
     died instead of reporting. A crash asserts NOTHING -- that is the same
     lesson DEVIATION taught this lane on 8/4, and it is not allowed to repeat
     in a gate written the same week. */
  const after = (p.dialogue && typeof p.dialogue.choose === 'function') ? p.dialogue.choose(0) : null;
  ok('choosing advances the conversation to another node (' +
    (after ? after.node : 'NO CONVERSATION WAS OPEN') + ')',
    !!after && after.ended === false && !!after.node);
}

console.log('SCENE GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
