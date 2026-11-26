#!/usr/bin/env node
/* EVERY TYPE THROUGH A FIGHT (BESTIARY 2 gate, 11/26, VAMILY rule 480(b): 'improve on what we already have'; the round BESTIARY wrote
   for it: 'put each of the enemy types already built through a fight: its look reads, its moves work, its drops land, no bug').
   Before this gate, THE BESTIARY FLOOR checked only the rows BESTIARY added (35 of the 80 kinds the bands deal); the wiki's rows
   (the brigands, the beasts, the ghost, the machines, the kids, the heavies, the dogs) were fielded by nobody's check.
   On the live fight's rules (tools/bohemia_bestiary_every_type.js, the fight's own scripts and the page's own spoilsOf), for EVERY KIND
   A BAND DEALS (bohemia_enemies.json and ours.json enemy_tiers: mix and heads):
     E1 ITS LOOK: fielded, named, armed; a man's look is on the fight's rig and its file on disk; a beast has its own picture
        (beast_rig_looks), never the dire wolf the drawing falls back to
     E2 ITS MOVES: in its band's fights and alone against a crew of six on AUTO it acts, every fight ends, nothing throws, and a brain
        that gives it a thing of its own (the siren, the call, the riposte...) shows it
     E3 ITS DROPS: a man's weapon is one the bag knows (the end screen can hand it over), and in ten fights' rolls through the spoils
        screen's own rules something of his can drop; THE DEBT: the kinds named below leave nothing because the spoils' rules read a
        thrown weapon with no wear as wrecked and a sling with no count as spent (ask row 742, FIGHT SCREEN 3); the list can only
        shrink: a kind on it that drops again must come off it, a kind not on it that leaves nothing is red
     E4 THE COUNT: every kind dealt was checked (none skipped), and the count never drops below 80
     E5 EVERY PARTY HAS ITS WORDS: the fight's THEY_ARE names every faction a band deals (a missing one read 'The road crew')
   PLANTED (--plant): the coyote's picture taken out (drawn as the dire wolf), the bowman's sheets off the rig, the siren's brain without
   its siren: each turns its kind red, or the gate fails.
   node gates/every_type_through_a_fight_gate.js [--plant]   About 4 min. */
'use strict';
const path = require('path'), { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname), TOOL = path.join(ROOT, 'tools/bohemia_bestiary_every_type.js');
const KINDS_AT_LEAST = 80;
/* THE DEBT (ask row 742): kinds whose only weapon the spoils' rules never hand over; it only shrinks */
const NO_DROP_DEBT = ['lower_goblin_skirmisher', 'goblin_skirmisher', 'goblin_skirmisher_champion', 'keeper_thrall', 'water_slinger'];
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  PASS  ' : '  FAIL  ') + what + (ok || !why ? '' : '\n        ' + why)); };
const run = (env) => { const o = execFileSync('node', [TOOL], { cwd: ROOT, env: Object.assign({}, process.env, env), maxBuffer: 1 << 26, timeout: 900000 }).toString(); return JSON.parse(o.split('RESULT ')[1]); };
console.log('EVERY TYPE THROUGH A FIGHT (rule 480(b)): every kind a band deals, its look, its moves, its drops, on the live rules');
const R = run({ FIGHTS: '4', ALONE: '2', ROLLS: '10' }), K = R.kinds, ids = Object.keys(K);
const bad = (re) => ids.filter(k => K[k].bugs.some(b => re.test(b)));
const lookBad = bad(/not fielded|picture of its own|not on the fight rig|picture file is missing|no name|unarmed/);
leg(!lookBad.length, 'E1 ITS LOOK: ' + (ids.length - lookBad.length) + ' of ' + ids.length + ' kinds fielded in their own picture (men on the rig, beasts on their own sheet, never the dire wolf), named, armed',
  lookBad.map(k => k + ': ' + K[k].bugs.join('; ')).join('\n        '));
const moveBad = bad(/never ended|never acted|own move never seen|THREW/);
const movers = ids.filter(k => (K[k].own_move || []).length);
leg(!moveBad.length, 'E2 ITS MOVES: every kind acts, every fight ends, nothing throws; the ' + movers.length + ' with a thing of their own show it (' + movers.map(k => k + ' ' + K[k].own_move[0] + ' x' + (K[k].acts.skills[K[k].own_move[0]] || 0)).join(', ') + ')',
  moveBad.map(k => k + ': ' + K[k].bugs.join('; ')).join('\n        '));
const bagBad = bad(/never reaches the end screen/), noDrop = bad(/drops nothing/);
const newNoDrop = noDrop.filter(k => NO_DROP_DEBT.indexOf(k) < 0), paid = NO_DROP_DEBT.filter(k => K[k] && noDrop.indexOf(k) < 0);
const men = ids.filter(k => !K[k].beast);
leg(!bagBad.length && !newNoDrop.length && !paid.length, 'E3 ITS DROPS: ' + (men.length - noDrop.length) + ' of ' + men.length + ' kinds of men can leave a piece on the end screen; THE DEBT (ask row 742): ' + NO_DROP_DEBT.length + ' leave nothing (' + NO_DROP_DEBT.join(', ') + ')',
  bagBad.map(k => k + ': ' + K[k].bugs.join('; ')).concat(newNoDrop.map(k => 'NEW, NOT ON THE DEBT: ' + k + ': ' + K[k].bugs.join('; ')), paid.map(k => 'PAID, TAKE IT OFF THE DEBT: ' + k)).join('\n        '));
leg(R.n === R.of && R.of >= KINDS_AT_LEAST, 'E4 THE COUNT: ' + R.n + ' of the ' + R.of + ' kinds the bands deal checked (at least ' + KINDS_AT_LEAST + ')', 'checked ' + R.n + ' of ' + R.of);
/* E5 EVERY PARTY HAS ITS WORDS: the fight's THEY_ARE (the wipe card's 'who keep the field', the end screen's fallback) names every
   faction a band deals; a missing one fell back to 'The road crew' (nine beast parties did, 11/26) */
const fs = require('fs'), vm = require('vm');
const theyAre = (html) => { const i = html.indexOf('const THEY_ARE = {'), j = html.indexOf('};', i); return vm.runInNewContext('(' + html.slice(i + 'const THEY_ARE = '.length, j + 1) + ')'); };
const NE = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/bohemia_enemies.json'), 'utf8')), OU = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8'));
const facs = Array.from(new Set(Object.keys(NE.mix).concat(Object.keys(OU.enemy_tiers.value.mix))));
const html = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8'), TA = theyAre(html), noName = facs.filter(f => !TA[f]);
const WS = (() => { const i = html.indexOf('const WIPE_SAYS = {'), j = html.indexOf('};', i); return vm.runInNewContext('(' + html.slice(i + 'const WIPE_SAYS = '.length, j + 1) + ')'); })();
const agrees = /\{keep\}/.test(WS.took) && /\{have\}/.test(WS.next) && /keep: one \? 'keeps' : 'keep', have: one \? 'has' : 'have'/.test(html);
const ones = facs.filter(f => /^(A|An) /.test(TA[f] || ''));
leg(!noName.length && agrees, 'E5 EVERY PARTY HAS ITS WORDS: ' + (facs.length - noName.length) + ' of the ' + facs.length + ' factions a band deals are named in the fight (the wipe card never says the road crew for a ground sloth), and the card agrees with one beast (' + ones.length + ' named as one: \'' + (TA[ones[0]] || '') + ' keeps the field\')', (noName.length ? 'no words: ' + noName.join(', ') + '. ' : '') + (agrees ? '' : 'the wipe card no longer agrees with one beast'));
if (process.argv.indexOf('--plant') >= 0) {
  const TP = theyAre(html.replace("sloths: 'A ground sloth', ", '')), pl5 = facs.filter(f => !TP[f]);
  leg(pl5.length === 1 && pl5[0] === 'sloths', 'PLANTED E5: the ground sloth\'s words taken out: ' + (pl5.join(', ') || 'MISSED'), 'the plant did not bite');
}
if (process.argv.indexOf('--plant') >= 0) {
  const P = [['no_beast_picture', 'coyote', /picture of its own/], ['man_off_rig', 'watch_bowman', /not on the fight rig/], ['move_gone', 'watch_siren', /own move never seen/]];
  const bit = P.map(([pl, k, re]) => { const r = run({ PLANT: pl, ONLY: k, FIGHTS: '2', ALONE: '1', ROLLS: '2' }); return [pl, (r.kinds[k] || { bugs: [] }).bugs.some(b => re.test(b))]; });
  leg(bit.every(b => b[1]), 'PLANTED: ' + bit.map(b => b[0] + (b[1] ? ' red' : ' MISSED')).join(', '), 'a plant did not turn its kind red');
}
console.log((fail ? 'RED' : 'GREEN') + ' ' + pass + '/' + fail);
process.exit(fail ? 1 : 0);
