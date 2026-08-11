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
  cold.beats.some(b => b.kind === 'handoff' && b.to === 'combat' &&
    b.encounter === 'family_defense' && b.returns === true));

/* ---- 3. THE WORDS ARE HIS ------------------------------------------------- */
/* THE CHECK THAT MATTERS MOST IN THIS FILE. LINES ships empty; the cold open's
   say beats are silent ON PURPOSE. If text ever appears in one, somebody put
   words in his family's mouths. */
const spoke = cold.beats.filter(b => b.kind === 'say' && b.text);
ok('NO WORDS WERE INVENTED for the family — every say beat is his to fill' +
  (spoke.length ? ' — FOUND: ' + spoke.map(b => b.id).join(', ') : ''),
  spoke.length === 0);
/* and every beat traces to his addendum */
ok('every beat records WHY it exists, quoting the ruling it came from',
  cold.beats.every(b => typeof b.why === 'string' && b.why.length > 10));

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
