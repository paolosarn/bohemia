#!/usr/bin/env node
/* CHARACTER IN THE VOTE TAB GATE (9/18/26, CHARACTER lane, VAMILY [into the vote tab])
 *
 * RULE 15, ONE VOTE TAB (Paolo 9/14, LOCKED): "everything from sounds to portrait to hair
 * to everything that is new, where I vote on it... after I vote on something it needs to
 * stop presenting itself."
 *
 * UI OWNS THE TAB AND ALREADY GATES IT (gates/vote_tab_gate.js, 28 legs: the queue, the
 * vanish, the door, the dead-link check). THIS GATE IS THE LANE'S HALF, which that one
 * cannot cover because it is about what CHARACTER does with an answer:
 *
 *   1. THIS LANE IS ACTUALLY IN THE QUEUE. Zero candidates is the state the row was opened
 *      about -- the tab shipped 9/15 and this lane had nothing in it for three rounds.
 *   2. ITS PICTURES ARE REAL. A registered candidate whose image is missing or empty is a
 *      row that promises and does nothing, which rule 14(d) calls the worst bug in the game.
 *   3. *** AND EVERY VERDICT ON THIS LANE'S WORK HAS BEEN ACTED ON. *** This is the half
 *      that makes the row real rather than a JSON edit. NOTES ARE RULINGS (7/19): the
 *      moment he thumbs, an UP has to be built in and a DOWN has to be graveyarded with a
 *      post-mortem. A registry nobody reads back is a suggestion box.
 *
 * IT SAYS OUT LOUD WHEN A CHECK IS ARMED BUT UNFIRED. verdicts[] is empty today, so leg 3
 * is vacuous right now. A green over nothing is a lie this lane has published before, so
 * the count of verdicts it actually examined is printed rather than hidden, and the leg is
 * mutation-proven by planting one.
 *
 *   node gates/character_in_the_vote_tab_gate.js
 */
'use strict';
const path = require('path');
const fs = require('fs');
const REPO = path.dirname(__dirname);
const REG = path.join(REPO, 'records/target/BOHEMIA_VOTE_REGISTRY.json');
const SLICES = path.join(REPO, 'slices');
const RECORDS = path.join(REPO, 'records');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('\n=== CHARACTER IN THE VOTE TAB: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

const LANE = 'character';

ok('the one registry exists where the tab reads it', fs.existsSync(REG));
if (!fs.existsSync(REG)) done();
let R = null;
try { R = JSON.parse(fs.readFileSync(REG, 'utf8')); } catch (e) {}
ok('and it parses', !!R && Array.isArray(R.items));
if (!R || !Array.isArray(R.items)) done();

const mine = R.items.filter(i => i && i.lane === LANE);
const verdicts = Array.isArray(R.verdicts) ? R.verdicts : [];

/* 1. IN THE QUEUE AT ALL. */
ok('*** THIS LANE HAS CANDIDATES IN THE ONE QUEUE *** -- zero is the state this row was '
   + 'opened about: the tab shipped and this lane put nothing in it (' + mine.length + ')',
   mine.length > 0);
ok('and it is not burying the other lanes -- the tab is the only place he judges anything, '
   + 'so one lane filling it is its own failure (' + mine.length + ' of ' + R.items.length + ')',
   mine.length <= Math.max(4, Math.ceil(R.items.length / 3)));

/* EVERY FIELD THE TAB READS, because a row missing one renders as a blank. */
const badField = mine.filter(i => !i.id || !i.kind || !i.sha || !i.title || !i.why || !i.show || !i.show.how);
ok('every candidate carries the fields the tab renders (' + badField.length + ' short'
   + (badField.length ? ': ' + badField.map(i => i.id).join(', ') : '') + ')', badField.length === 0);
const ids = mine.map(i => i.id);
ok('and no id is used twice, because a vote consumes an ID and a duplicate would be '
   + 'consumed for both', new Set(ids).size === ids.length);
/* AND NO ID COLLIDES WITH ANOTHER LANE'S, which would consume theirs when he votes on ours. */
const others = R.items.filter(i => i && i.lane !== LANE).map(i => i.id);
ok('and none of them collides with another lane\'s id',
   ids.every(x => others.indexOf(x) < 0));

/* 2. THE PICTURES ARE REAL. */
const dead = [];
for (const i of mine) {
  if (['image', 'page', 'clip', 'audio'].indexOf(i.show.how) < 0) continue;
  const f = path.join(SLICES, String(i.show.src || ''));
  if (!fs.existsSync(f)) { dead.push(i.id + ' (missing ' + i.show.src + ')'); continue; }
  if (fs.statSync(f).size < 1024) dead.push(i.id + ' (' + fs.statSync(f).size + ' bytes)');
}
ok('*** EVERY CANDIDATE HAS SOMETHING REAL TO SHOW *** -- a row that promises and does '
   + 'nothing is what rule 14(d) calls the worst bug in the game (' + dead.length + ' dead'
   + (dead.length ? ': ' + dead.join(', ') : '') + ')', dead.length === 0);

/* 3. THE VERDICTS ARE READ BACK AND ACTED ON. */
const mineIds = new Set(ids);
const judged = verdicts.filter(v => v && mineIds.has(v.id));
const txt = fs.existsSync(RECORDS) ? fs.readdirSync(RECORDS).filter(f => /\.txt$/i.test(f)) : [];
const txtBlob = txt.map(f => { try { return fs.readFileSync(path.join(RECORDS, f), 'utf8'); } catch (e) { return ''; } }).join('\n');
const unanswered = judged.filter(v => txtBlob.indexOf(v.id) < 0);
ok('*** EVERY VERDICT ON THIS LANE IS WRITTEN DOWN IN records/ AS .txt *** -- NOTES ARE '
   + 'RULINGS: a registry nobody reads back is a suggestion box (' + judged.length
   + ' judged, ' + unanswered.length + ' with nothing written'
   + (unanswered.length ? ': ' + unanswered.map(v => v.id).join(', ') : '') + ')',
   unanswered.length === 0);
/* SAID OUT LOUD RATHER THAN HIDDEN: a leg that examined nothing is not evidence. */
if (judged.length === 0)
  console.log('  NOTE: he has voted on nothing from this lane yet, so the verdict leg above '
    + 'examined ZERO rows. It is armed, not proven by this run; the mutation proves it.');

console.log('\n  ' + mine.length + ' candidates from ' + LANE + ' in a queue of ' + R.items.length
  + ', ' + judged.length + ' judged');
for (const i of mine) console.log('    ' + i.id.padEnd(46) + i.title);
done();
