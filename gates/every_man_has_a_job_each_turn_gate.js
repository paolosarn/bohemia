#!/usr/bin/env node
/* EVERY MAN HAS A JOB EACH TURN (COMBAT [every man has a job each turn], rule 188, Paolo 10/25: 'one of my spear and car-door men
   was behind a house so he couldn't engage, just doing nothing... if someone is using melee they want to be able to melee, not be
   fucked up behind a house... I can't be explaining all these, you gotta know all this';
   records/BOHEMIA_PAOLO_EVERY_MAN_HAS_A_JOB_EACH_TURN_AND_HE_STOPS_FINDING_AUTOS_MISTAKES_10_25_26.md).

   Measured 10/25 on his crew (a rifle and two spear-and-car-door men), 300 of TUNING's rolled fights (tools/bohemia_tuning_auto_brain.js
   fightOf: a district and cell the map could hand, every faction, AUTO both sides): 742 of 2,689 turns of his spear men (27.6%)
   ended with no blow and not one step nearer the fight while a walk to an enemy was open; 52 of 600 never struck all fight.
   Three rules the brain read, each measured:
   - THE LINE WAS THE RIFLEMAN: 'keep formation' measured the line's middle from every mate, the shooter too; with three men the
     middle was the rifleman at the back, and the shooter may never step ahead of his front man: both held, until the enemy
     walked in. The line's middle is now his melee men's (742 -> 427);
   - HE WAITED FOR THEM: his crew's 'hold the line' kept a melee man still until a blow landed somewhere; a man of his with a
     melee weapon now closes (rule 188(a): 'never idle while a move brings him closer');
   - THE WALK WENT THROUGH HIS OWN MAN: the field AUTO walks by ran through the tiles his friends stand on, so the walk round a
     house looked no shorter and he stood (a spear man four rounds, measured); a friend's tile is reached, never walked through;
   - and a line is held against men who come to it: with only a thrower or a gunman left, it runs him down.
   Legs, over N fights (default 300):
   J1 HIS CREW: no turn of his melee men with a walk to an enemy open, AP for a step, breath for a blow, not in a morale rout (Battle Brothers' flight),
      that ends with no blow and no step nearer: at most 1 in 100 of their turns (before 27.6%);
   J2 a melee man of his who never strikes in a fight of four rounds or more: under 5 in 100 (before 52 of 600);
   J3 TUNING's own crews (3, 6 and 12 men, three gear stages) the same as J1;
   J4 and AUTO wins his crew's fights at least as often as before (178 of the 300).
   Run: node gates/every_man_has_a_job_each_turn_gate.js [--n 300] */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== EVERY MAN HAS A JOB EACH TURN GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const argv = process.argv, N = Number(argv[argv.indexOf('--n') + 1]) || 300;
const BEFORE = { n: 300, won: 178, parked: 742, turns: 2689, never: 52, men: 600 };   /* his crew, the same 300 fights, before this gate */

(async () => {
  const B = require(path.join(ROOT, 'tools/bohemia_tuning_auto_brain.js'));
  const ctx = await B.engineFor('today'), F = ctx.FIGHT, T = F._t, districts = ctx.DB.boardKinds.districts;
  const g = (main, off) => ({ main, off, body: null, head: null, bag: [] });
  const HIS = [{ background: 'companion_ranged', name: 'YOU', main: true, gear: g('light_crossbow', null) },
    { background: 'companion_1hand', name: 'RAUL', gear: g('militia_spear', 'wooden_shield') },
    { background: 'companion_1hand', name: 'JAMAL', gear: g('militia_spear', 'wooden_shield') }];
  const errs = [];
  /* play one fight to its end, AUTO both sides, and read every turn of his melee men */
  const play = (tally) => {
    const S = F.S, hit = {};
    let cur = null, t0 = null, guard = 0;
    const close = () => {
      if (!t0) return; const u = t0.u, h1 = T.huntField(u)(u.x, u.y), did = S.log.slice(t0.n).some(e => e.id === u.id && e.t === 'attack' && !e.free);
      tally.turns++; if (did) hit[u.id] = 1;
      else if (t0.h0 > 1 && isFinite(t0.h0) && h1 >= t0.h0 && t0.ap >= T.stepCost(u, u.x, u.y, u.x, u.y) && t0.breath && !t0.rout && u.morale !== 'Fleeing') { tally.parked++; if (tally.ex.length < 4) tally.ex.push(t0.k + ':' + u.name + '@r' + t0.r + ' ' + t0.h0 + '->' + h1); }
      t0 = null; };
    while (!S.over && S.round <= 60 && guard++ < 200000) {
      const v = F.current(); if (!v) break;
      if (v !== cur) { close(); cur = v; if (v.side === 'you' && v.weapon && !F.isRanged(v.weapon) && F.onField(v)) t0 = { u: v, k: tally.k, n: S.log.length, h0: T.huntField(v)(v.x, v.y), ap: v.ap, r: S.round, rout: v.morale === 'Fleeing', breath: v.fat + T.skillFat(v, F.strikeSkill(v.weapon)) <= F.fatMax(v) }; }
      F.aiStep(v);
    }
    close();
    S.units.filter(u => u.side === 'you' && u.weapon && !F.isRanged(u.weapon)).forEach(u => { tally.men++; if (!hit[u.id] && S.round >= 4) tally.never++; });
    if (S.result === 'won') tally.won++;
  };
  const his = { turns: 0, parked: 0, men: 0, never: 0, won: 0, n: 0, ex: [] }, theirs = { turns: 0, parked: 0, men: 0, never: 0, won: 0, n: 0, ex: [] };
  for (let k = 0; k < N; k++) {
    const W = B.fightOf(k, districts), days = 1 + (k % 5) * 12;
    try { ctx.setSeed(W.seed); F.setup({ auto: true, formation: null, company: HIS, cap: 3, party: { faction: W.faction, count: 2 + (k % 4), days: days }, days: days, district: W.district, cell: W.cell, act: 1 });
      F.S.deploy = false; his.k = k; his.n++; play(his); } catch (e) { errs.push('his ' + k + ': ' + e.message.slice(0, 120)); }
    if (k % 2) continue;
    try { B.setupFight(ctx, W); F.S.deploy = false; theirs.k = k; theirs.n++; play(theirs); } catch (e) { errs.push('bench ' + k + ': ' + e.message.slice(0, 120)); }
  }
  const pct = (a, b) => (100 * a / Math.max(1, b)).toFixed(2) + '%';
  leg(his.n >= N - 2 && his.parked <= his.turns / 100, '*** J1 NOBODY PARKED BEHIND A HOUSE *** (rule 188(a)): his crew\'s melee men, a walk to an enemy open, AP for a step and breath for a blow, not in a rout: no blow and no step nearer at most 1 in 100 turns',
    his.parked + ' of ' + his.turns + ' turns, ' + pct(his.parked, his.turns) + ' over ' + his.n + ' fights' + (his.ex.length ? ' (' + his.ex.join(', ') + ')' : '') + '; before ' + BEFORE.parked + ' of ' + BEFORE.turns + ', ' + pct(BEFORE.parked, BEFORE.turns));
  leg(his.never < his.men / 20, '  J2 a melee man of his who never strikes in a fight of four rounds or more: under 5 in 100', his.never + ' of ' + his.men + ' (' + pct(his.never, his.men) + '); before ' + BEFORE.never + ' of ' + BEFORE.men);
  leg(theirs.n >= N / 2 - 2 && theirs.parked <= theirs.turns / 100, '  J3 TUNING\'s own crews (3, 6 and 12 men, three gear stages): the same, at most 1 in 100',
    theirs.parked + ' of ' + theirs.turns + ' turns, ' + pct(theirs.parked, theirs.turns) + ' over ' + theirs.n + ' fights' + (theirs.ex.length ? ' (' + theirs.ex.join(', ') + ')' : ''));
  leg(his.won >= Math.floor(BEFORE.won * his.n / BEFORE.n), '  J4 and AUTO wins his crew\'s fights at least as often as before', his.won + ' of ' + his.n + ' (before ' + BEFORE.won + ' of ' + BEFORE.n + ')');
  leg(errs.length === 0, 'nothing threw', errs.slice(0, 2).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
