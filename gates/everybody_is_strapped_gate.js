#!/usr/bin/env node
/* EVERYBODY IS STRAPPED (BESTIARY 3 11/27, VAMILY rule 489(a), Paolo 11/27: 'most enemies should be having pistols... if you are a
   force walking around, bro you're at least gonna have some guns... human forces probably have at the very least pistols, everybody
   is strapped'; rule 478: the rounds stay scarce). On the live rules (tools/bohemia_fight_headless.js), the fight's own dealer:
     S1 EVERY MAN IS ARMED WITH A GUN: every human kind a band deals (not a beast, a machine or a ghost), four of him at the first day
        that deals him, has a gun in his hands or a pistol in his waistband (his bag), every one of him
     S2 THE ROUNDS STAY SCARCE: every waistband pistol carries a count (never an endless quiver), at least one and no more than its
        phase's numbers.strapped rounds; his own gear's pistol first (the thug's Dagger, the poacher's Knife)
     S3 HE DRAWS IT, AND PUTS IT AWAY DRY: 24 fights on AUTO against six of his: their men pull the pistol (the bag's swap) and fire it;
        no pistol of theirs fires with no round left; a dry pistol goes back in the waistband and his own weapon comes out (no man of
        theirs swings his fists while his own weapon rides in his bag)
     S4 IT DROPS: a dead man's waistband pistol rides home on his body (the page's spoilsOf, read out of the page) and the spoils'
        found() hands it over on the weapon's roll with the rounds left in it
     S5 YOU SEE IT: the fight plays the 'swap' and 'dry' notes (NOTE_BEATS), and their swap to the pistol has its flash and words
   PLANTED (--plant): the strapped table emptied (S1 red), a pistol with an endless quiver (S2 red), the dry pistol to his fists (S3 red).
   node gates/everybody_is_strapped_gate.js [--plant]   About 1 min. */
'use strict';
const path = require('path'), fs = require('fs'), vm = require('vm');
const ROOT = path.dirname(__dirname);
const { engine, FIGHT_FILE } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const SP = require(path.join(ROOT, 'engine/bohemia_spoils.js'));
const LOOT = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/loot.json'), 'utf8'));
const html = fs.readFileSync(FIGHT_FILE, 'utf8');
let pass = 0, fail = 0;
const check = (ok, id, msg) => { console.log((ok ? '  PASS  ' : '  FAIL  ') + id + ' ' + msg); ok ? pass++ : fail++; };

function run(plant) {
  const patch = plant === 'fists' ? (r => r.replace('if (strapHome(u)) {}', 'if (false) {}'))
    : plant === 'endless' ? (r => r.replace('loaded: true, rounds: s.rounds, roundsMax: s.rounds }]', 'loaded: true, rounds: null, roundsMax: null }]')) : null;
  const ctx = engine(patch ? { patch } : {}), F = ctx.FIGHT, DB = ctx.DB;
  const P = DB.newEnemies.numbers.strapped.value;
  if (plant === 'table') Object.keys(P.by_phase).forEach(k => { P.by_phase[k].pistols = []; });
  const setup = (o, seed) => { ctx.setSeed(seed || 9); F.setup(Object.assign({ kind: 'ruin', deploy: false, formation: null, flat: true }, o)); return F.S; };
  setup({ party: [{ kind: 'watch_neighbor', count: 1 }] });
  const T = DB.ours.enemy_tiers.value, phases = T.phases, KINDS = {};
  Object.keys(T.mix).forEach(f => phases.forEach(ph => Object.keys(T.mix[f][ph.name] || {}).forEach(k => { if (T.mix[f][ph.name][k] > 0 && !KINDS[k]) KINDS[k] = { from: ph.from_day, phase: ph.name }; })));
  Object.keys(T.heads || {}).forEach(f => { const k = T.heads[f]; if (!KINDS[k]) KINDS[k] = { from: 1, phase: phases[0].name }; });
  /* BESTIARY 4 11/27 __A_CHAMPION_IS_ROLLED__: the wiki's champion kinds left the late mixes; the roll deals them (champions.swap), late */
  Object.values((DB.newEnemies.champions || {}).swap || {}).forEach(k => { if (!KINDS[k]) KINDS[k] = { from: phases[phases.length - 1].from_day, phase: phases[phases.length - 1].name }; });
  /* S1, S2 */
  let men = 0; const bare = [], badRounds = [], ownFirst = [];
  for (const id of Object.keys(KINDS)) {
    const S = setup({ party: [{ kind: id, count: 4 }], days: KINDS[id].from }, 9);
    const us = S.units.filter(v => v.side === 'them' && v.kind === id); if (!us.length || us[0].beast || us[0].machine || us[0].ghost) continue;
    men++;
    const cap = (P.by_phase[F._t.tierPhase(KINDS[id].from, 0)] || {}).rounds;
    us.forEach(v => {
      const inHand = v.weapon && !v.weapon.fists && F.isGun(v.weapon), pist = v.strapped && (v.bag || []).some(b => b && b.id === v.strapped);
      if (!inHand && !pist) bare.push(id + ' (' + (v.weapon && v.weapon.name) + ')');
      if (pist) { const st = v.bagState && v.bagState[0]; if (!st || st.rounds == null || !(st.rounds >= 1) || st.rounds > Math.max(1, cap | 0)) badRounds.push(id + ' ' + (st ? st.rounds : 'none')); }
    });
    const row = DB.enemies.rows.find(e => e.id === id), own = (row.gear || []).map(n => DB.weapons.rows.find(w => w.name === n)).find(w => w && F._t.pistolShot(w));
    if (own && us.some(v => v.strapped && v.strapped !== own.id)) ownFirst.push(id);
  }
  /* S3 */
  const crew = n => { const c = []; for (let i = 0; i < n; i++) c.push({ background: 'farmhand', level: 1 }); return c; };
  let draws = 0, shots = 0, dryShots = 0, dry = 0, fists = 0, fights = 0;
  ['brigands', 'watch', 'flock', 'keepers'].forEach(f => { for (let s = 1; s <= 6; s++) {
    ctx.setSeed(s * 13 + 5); F.setup({ auto: true, formation: null, deploy: false, company: crew(6), kind: 'ruin', party: { faction: f, count: 6, days: 25, difficulty: 0 } });
    let g = 0; fights++;
    const start = {}, fired = {};
    F.S.units.forEach(v => { if (v.side === 'them' && v.strapped && v.bagState && v.bagState[0]) start[v.id] = v.bagState[0].rounds; });
    while (!F.S.over && g < 200000) { const c = F.current(); if (!c) break;
      F.aiStep(c);
      (F.S.events || []).forEach(e => { const u = e.id && F.byId(e.id); if (!u || u.side !== 'them' || !u.strapped) return;
        if (e.t === 'swap' && e.to === u.strappedName) draws++;
        if (e.t === 'dry') dry++;
        if (e.t === 'attack' && e.arm === u.strapped && !e.astray) { shots++;   /* a stray (the miss that hits the man beside) is the same round */
           fired[u.id] = (fired[u.id] | 0) + 1; }
        if (e.t === 'attack' && e.arm === 'fists' && (u.bag || []).some(b => b && !F.isGun(b) && !F.isShield(b))) fists++; });
      F.S.events = []; g++; }
    Object.keys(fired).forEach(id => { if (start[id] != null && fired[id] > start[id]) dryShots += fired[id] - start[id]; }); } });
  /* S4: the page's spoilsOf, read out of the page, on a fight's dead */
  const grab = name => { const i = html.indexOf('function ' + name + '('); const j = html.indexOf('\n}\n', i); return html.slice(i, j + 2); };
  vm.runInContext('var __FAC = null; function theirFaction() { return __FAC; } var THEY_ARE = {}; function recapOf() { return null; }\n' + grab('spoilsOf') + '\n' + grab('isGunW') + '\nthis.spoilsOf = spoilsOf;', ctx);
  ctx.setSeed(7); F.setup({ auto: true, formation: null, deploy: false, company: crew(6), kind: 'ruin', party: { faction: 'brigands', count: 6, days: 25, difficulty: 0 } });
  F.S.units.filter(v => v.side === 'them').forEach(v => { v.dead = true; v.hp = 0; });
  const sp = ctx.spoilsOf(), withArm = sp.bodies.filter(b => b.sidearm);
  let found = 0, rounds = 0; for (let k = 0; k < 20; k++) { let x = (k + 1) * 9301; const rnd = () => { x = (x * 16807) % 2147483647; return x / 2147483647; }; const o = SP.found(sp, LOOT, rnd); found += o.items.filter(i => i.sidearm).length; rounds += o.counts.rounds; }
  return { men, bare, badRounds, ownFirst, draws, shots, dryShots, dry, fists, fights, bodies: sp.bodies.length, withArm: withArm.length, found, rounds };
}
const PLANT = process.argv.includes('--plant');
console.log('EVERYBODY IS STRAPPED (rule 489(a)): every man of theirs carries a gun, its rounds few');
const R = run(null);
check(R.men >= 50 && !R.bare.length, 'S1', 'EVERY MAN IS ARMED WITH A GUN: ' + R.men + ' human kinds, four of each; with no gun in hand and none in the waistband ' + R.bare.length + (R.bare.length ? ' (' + R.bare.slice(0, 5).join('; ') + ')' : ''));
check(!R.badRounds.length && !R.ownFirst.length, 'S2', 'THE ROUNDS STAY SCARCE: every waistband pistol counts its rounds, 1 to its phase\'s few; off the count ' + R.badRounds.length + (R.badRounds.length ? ' (' + R.badRounds.slice(0, 5).join('; ') + ')' : '') + '; his own gear\'s pistol passed over ' + R.ownFirst.length + (R.ownFirst.length ? ' (' + R.ownFirst.join(', ') + ')' : ''));
check(R.draws > 0 && R.shots > 0 && R.dryShots === 0 && R.dry > 0 && R.fists === 0, 'S3', 'HE DRAWS IT, AND PUTS IT AWAY DRY: ' + R.fights + ' fights on AUTO: ' + R.draws + ' draws, ' + R.shots + ' pistol shots, fired dry ' + R.dryShots + '; ' + R.dry + ' pistols ran dry, fists with his own weapon in the bag ' + R.fists);
check(R.withArm > 0 && R.found > 0 && R.rounds > 0, 'S4', 'IT DROPS: ' + R.withArm + ' of ' + R.bodies + ' dead carry a waistband pistol home; 20 rolls of the spoils found ' + R.found + ' of them and ' + R.rounds + ' rounds');
const nb = /const NOTE_BEATS = \{[\s\S]*?\};/.exec(html), nbs = nb ? nb[0] : '';
check(/\bdry: 0\b/.test(nbs) && /\bswap: 0\b/.test(nbs) && /e\.t === 'swap' && u && u\.side === 'them' && u\.strappedName/.test(html) && /from his waistband\./.test(html), 'S5', 'YOU SEE IT: the fight plays the swap and dry notes (at no length) and their pistol coming out has its flash and its words');
if (PLANT) {
  const a = run('table'); check(a.bare.length > 0, 'S1p', 'planted: the strapped table emptied leaves men with no gun (' + a.bare.length + ')');
  const b = run('endless'); check(b.badRounds.length > 0, 'S2p', 'planted: a pistol with no rounds counted is caught (' + b.badRounds.length + ')');
  const c = run('fists'); check(c.fists > 0, 'S3p', 'planted: the dry pistol to his fists is caught (' + c.fists + ' blows)');
}
console.log((fail ? 'RED ' : 'GREEN ') + pass + '/' + fail);
process.exit(fail ? 1 : 0);
