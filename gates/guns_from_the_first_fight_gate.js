#!/usr/bin/env node
/* GUNS FROM THE FIRST FIGHT (COMBAT [guns from the first fight], rule 120(a), Paolo 10/18: 'I wanna start off with the guns
   too... the guns were supposed to be the main way this is gonna be solved'). The live fight's rules, headless through the
   page's own data list (tools/bohemia_fight_headless.js). Measured before this gate: A NEW CREW, the door's first pick, walked
   into its first fight with two pipes and a sledge and fired no shot in 120 fights; the PISTOL rode Battle Brothers' dagger and
   had never fired once (rule 83 shut every gun out of the tile beside it); a band of three thugs beat it 45 times in 100.

   Legs:
   1. every origin's company as the door builds it (background and level, no gear) carries a gun; every company of two or
      more a pistol and a rifle; the rifle in the hands of the best eye;
   2. the PISTOL fires from two tiles to four and clubs at one; its five rounds are a magazine, a reload refills it, only when
      it is empty; PISTOL WORK (dagger mastery) fires it at three AP;
   3. every gun clubs at one (the rifle, the shotgun), and never fires there; the bow and the bottles are not guns and do not;
   4. the first week's band is thugs (ours.enemy_tiers 'first'); the lesser raider from day eight;
   5. Battle Brothers' Beginner aim is the default (ours.hit_roll_shift): +5 his, -5 theirs on SEEN IT, nothing on OUTLIVED IT;
   6. THE FIRST FIGHT IS WON BY SHOOTING: A NEW CREW against its first week's band of two and of three (day 1, SEEN IT), AUTO
      both sides, SEEDS fights each: it wins at least 90 and 75 in 100, and the guns land at least half the kills;
   7. gear the roster hands over wins (a man handed the bludgeon fights with it, and with no gun).
   Run: node gates/guns_from_the_first_fight_gate.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const SEEDS = 40;
const ctx = engine(), F = ctx.FIGHT, T = F._t, DB = ctx.DB;
const ORIGINS = J('records/target/bb/origins.json').origins;
const gunName = u => u.weapon.of ? 'pistol' : u.weapon.class === 'crossbow' ? 'rifle' : u.weapon.class === 'firearm' ? 'shotgun' : null;
const mid = (bg, k) => { const v = DB.backgrounds.rows.filter(r => r.id === bg)[0].stats[k]; return (v[0] + v[v.length - 1]) / 2; };

/* 1. every origin carries guns */
const bare = [], short = [], eye = [];
ORIGINS.forEach(o => {
  ctx.setSeed(3); F.setup({ formation: null, company: o.men.map(m => ({ background: m.background, level: m.level })), cap: o.field_cap, party: ['brigand_thug'] });
  const us = F.S.units.filter(u => u.side === 'you'), guns = us.map(gunName);
  if (!guns.some(Boolean)) bare.push(o.id);
  if (us.length >= 2 && !(guns.indexOf('pistol') >= 0 && guns.indexOf('rifle') >= 0)) short.push(o.id + ' (' + guns.join(',') + ')');
  const r = us.filter(u => gunName(u) === 'rifle'), others = us.filter(u => !gunName(u) || gunName(u) === 'pistol');
  if (r.length && others.some(u => mid(u.kind, 'ranged_skill') > Math.min(...r.map(x => mid(x.kind, 'ranged_skill'))))) eye.push(o.id);
});
leg(!bare.length && !short.length, '*** EVERY ORIGIN\'S FIRST FIGHT HAS GUNS IN THE COMPANY\'S HANDS (rule 120(a)) ***: every company the door builds carries a gun, every one of two or more a pistol and a rifle',
  bare.length || short.length ? 'no gun: ' + bare.join(', ') + '; short: ' + short.join(', ') : ORIGINS.length + ' origins');
leg(!eye.length, '  the long gun goes to the best eye (the middle of his background\'s wiki ranged skill)', eye.length ? 'not: ' + eye.join(', ') : 'every rifle');

/* 2 and 3. where each gun fires and clubs */
ctx.setSeed(3); F.setup({ formation: null, flat: true, deploy: false, cap: 1, party: ['brigand_thug'] });
const u = F.S.units.filter(v => v.side === 'you')[0], t = F.S.units.filter(v => v.side === 'them')[0], W = DB.weapons.rows;
const reach = {};
['dagger', 'crossbow', 'firearm', 'bow', 'throwing', 'mace'].forEach(c => {
  const w0 = W.filter(x => x.class === c)[0], w = T.pistolShot(w0) || w0;
  u.weapon = w; u.club = T.clubFor(w); u.loaded = true; u.ammo = w.mag || (w.ammo ? Number(String(w.ammo).match(/\d+/)[0]) : null);
  const fires = [], clubs = [];
  for (let d = 1; d <= 8; d++) { u.x = 2; u.y = 7; t.x = 2 + d; t.y = 7; u.ap = u.apTurn; u.fat = 0; if (F.canStrike(u, t)) (T.armIn(u, t) === u.weapon ? fires : clubs).push(d); }
  reach[c] = { fires: fires.join(','), clubs: clubs.join(',') };
});
leg(reach.dagger.fires === '2,3,4' && reach.dagger.clubs === '1', '*** THE PISTOL SHOOTS (ours.pistol_shot) ***: from two tiles to four, a club at one', 'fires ' + reach.dagger.fires + ', clubs ' + reach.dagger.clubs);
leg(reach.crossbow.clubs === '1' && reach.firearm.clubs === '1' && reach.crossbow.fires.split(',')[0] === '2' && reach.firearm.fires === '2',
  '*** EVERY GUN IS A CLUB AT ONE (ours.gun_club) ***: the rifle and the shotgun club the man beside them and fire from two', 'rifle fires ' + reach.crossbow.fires + ' clubs ' + reach.crossbow.clubs + '; shotgun fires ' + reach.firearm.fires + ' clubs ' + reach.firearm.clubs);
leg(!reach.bow.clubs && !reach.throwing.clubs && !reach.mace.clubs, '  the bow, the bottles and the pipe are not guns: none of them clubs as a gun', 'bow ' + reach.bow.fires + ', bottles ' + reach.throwing.fires + ', pipe ' + reach.mace.fires);
/* the magazine */
const pw = T.pistolShot(W.filter(x => x.id === 'dagger')[0]);
u.weapon = pw; u.club = T.clubFor(pw); u.ammo = pw.mag; u.x = 2; u.y = 7; t.x = 4; t.y = 7; t.hp = t.hpMax = 99999; F.S.over = false;
let shots = 0, beforeEmpty = null;
for (let i = 0; i < 12; i++) {
  F.S.order = [u.id]; F.S.idx = 0; u.ap = u.apTurn; u.fat = 0;
  if (F.canReload(u)) { if (beforeEmpty === null) beforeEmpty = shots; F.reload(u); }
  else if (F.strike(u, t)) shots++;
}
const early = (() => { u.ammo = pw.mag - 1; return F.canReload(u); })();
leg(pw.mag === 5 && beforeEmpty === 5 && shots > 5 && !early, '*** THE ROUNDS ARE A MAGAZINE ***: five rounds, a reload only when it is empty, then five more', pw.mag + ' rounds, reload offered after ' + beforeEmpty + ' shots, ' + shots + ' shots in all, a reload with one fired: ' + early);
u.perks = []; const ap0 = T.skillAP(pw, F.strikeSkill(pw), u); u.perks = ['dagger_mastery']; const ap1 = T.skillAP(pw, F.strikeSkill(pw), u); u.perks = [];
leg(ap0 === 4 && ap1 === 3, '  PISTOL WORK (dagger mastery) is still the pistol\'s: its shot at the stab\'s 3 AP', ap0 + ' -> ' + ap1 + ' AP');

/* 4. the first week */
const kindsOn = days => { const k = {}; for (let s = 1; s <= 30; s++) { ctx.setSeed(s); T.partyFor({ faction: 'brigands', count: 4, days: days, difficulty: 1 }).forEach(x => { k[x] = 1; }); } return Object.keys(k).sort(); };
const d1 = kindsOn(1), d7 = kindsOn(7), d8 = kindsOn(8);
leg(d1.join() === 'brigand_thug' && d7.join() === 'brigand_thug' && d8.indexOf('lower_brigand_raider') >= 0, '*** THE FIRST BAND IS BUILT TO BE SHOT AT ***: days 1 to 7 are thugs, the lesser raider joins on day 8', 'day 1: ' + d1 + '; day 7: ' + d7 + '; day 8: ' + d8);

/* 5. the Beginner aim */
F.S.difficulty = 1; const s1 = [T.rollShift(u), T.rollShift(t)]; F.S.difficulty = 2; const s2 = [T.rollShift(u), T.rollShift(t)]; F.S.difficulty = 0; const s0 = [T.rollShift(u), T.rollShift(t)];
leg(s1[0] === 5 && s1[1] === -5 && s0[0] === 5 && s2[0] === 0 && s2[1] === 0, '*** BATTLE BROTHERS\' BEGINNER AIM IS OUR DEFAULT (rule 117) ***: +5 his and -5 theirs on NEW HERE and SEEN IT, nothing on OUTLIVED IT', 'seen ' + s1.join('/') + ', new ' + s0.join('/') + ', outlived ' + s2.join('/'));

/* 6. the first fight is won by shooting */
const nc = ORIGINS.filter(o => o.id === 'newcrew')[0];
const firstFight = n => {
  let won = 0, kills = 0, gunKills = 0;
  for (let s = 1; s <= SEEDS; s++) {
    ctx.setSeed(s * 7919);
    F.setup({ auto: true, formation: null, company: nc.men.map(m => ({ background: m.background, level: m.level })), cap: nc.field_cap, kind: 'suburb', party: { count: n, days: 1, difficulty: 1, faction: 'brigands' } });
    let g = 0; while (!F.S.over && g < 200000) { const c = F.current(); if (!c) break; F.aiStep(c); g++; }
    if (F.S.result === 'won') won++;
    const last = {};
    F.S.log.forEach(e => { const a = F.S.units.filter(v => v.id === e.id)[0];
      if (e.t === 'attack' && a.side === 'you') last[e.to] = e.shot;
      if (e.t === 'dead' && a && a.side === 'them') { kills++; if (last[e.id]) gunKills++; } });
  }
  return { win: Math.round(100 * won / SEEDS), guns: Math.round(100 * gunKills / Math.max(1, kills)) };
};
const two = firstFight(2), three = firstFight(3);
leg(two.win >= 90 && three.win >= 75, '*** THE FIRST FIGHT IS WINNABLE, EASIER THAN BATTLE BROTHERS (rule 117) ***: A NEW CREW beats its first week\'s two at least 90 times in 100 and three at least 75', 'two: ' + two.win + ' in 100, three: ' + three.win + ' in 100 (' + SEEDS + ' fights each)');
leg(two.guns >= 50 && three.guns >= 50, '*** SHOOTING IS THE MAIN WAY IT IS WON ***: the guns land at least half the kills', 'two: ' + two.guns + '%, three: ' + three.guns + '% of their dead fell to a shot');

/* 7. the roster's gear wins */
ctx.setSeed(3); F.setup({ formation: null, company: [{ background: 'companion_ranged', gear: { main: 'bludgeon', off: null, body: null, head: null } }], cap: 1, party: ['brigand_thug'] });
const hand = F.S.units.filter(v => v.side === 'you')[0];
leg(hand.weapon.id === 'bludgeon' && !gunName(hand), '  gear the roster hands over wins: a man handed the bludgeon fights with it', hand.weapon.name);

console.log('=== GUNS FROM THE FIRST FIGHT GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
