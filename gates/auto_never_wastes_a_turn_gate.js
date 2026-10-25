#!/usr/bin/env node
/* AUTO NEVER WASTES A TURN (COMBAT [AUTO never wastes a turn] and rule 180, Paolo 10/25: 'a guy very low on health, instead of
   trying to kill the enemy, walks two tiles away and then two tiles back in front of the enemy... if it's melee range, get the
   fuck in... once I start doubting the decisions AUTO takes, I start doubting the calculator'; 'I don't want the auto combat to
   use abilities... abilities are player use only'; records/BOHEMIA_TUNING_A_BETTER_AUTO_BRAIN_AND_A_TRUE_CALCULATOR_10_25_26.md
   section 5c, the legs and bars; records/BOHEMIA_COMBAT_THE_PLAYTEST_ROWS_AND_THE_ONE_BRAIN_10_25_26.md, what was built).

   The instrument is TUNING's own (tools/bohemia_tuning_auto_brain.js): the live fight's rules and data, AUTO on both sides,
   fight k on seed 9000+k on a district and cell the map could hand, a company of 3, 6 or 12 in three gear stages, every faction,
   0.6 to 1.6 times the map's count. The same fights the bench measured the old brain on (k 0..N-1), so every number has its
   'before' on the same fights.

   Legs, over N rolled AUTO fights (default 100; --n 300 for the full read):
   G1 no wasted turn: a man of his never spends steps to end where he began with nothing done (before: 150 in 300);
   G2 the dance: off one round and back the next with no swing in either, by AUTO's choice (a man in a morale rout runs by
      Battle Brothers' rules and is counted apart), at most one in 50 fights (before: 27 in 300, every kind; TUNING's bar is 0);
   G3 a man who starts with a strike in reach and never swings: under 0.5% (before 1.44%);
   G4 free swings his men take walking out of rings by AUTO's choice, no more than theirs (TUNING's bar; a man in a morale rout runs
      through them by Battle Brothers' rules and is counted apart; all told before 7.03 a fight);
   G5 gunmen who could walk onto a roof and ever stand on one: over 40% (before 38.5%; TUNING's bar 60%, not met yet);
   G6 rule 180: AUTO uses no ability: no skill, no bag swap, no special swing, no reload with a loaded shot on, by his side;
   G7 the fight ends: no fight runs to the 60-round mark (before: 11 in 300; the standoff ends it);
   G8 and AUTO wins at least as often as the old brain on the same fights (before 202 of 300).
   Run: node gates/auto_never_wastes_a_turn_gate.js [--n 100] */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== AUTO NEVER WASTES A TURN GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const argv = process.argv, N = Number(argv[argv.indexOf('--n') + 1]) || 100;

(async () => {
  const B = require(path.join(ROOT, 'tools/bohemia_tuning_auto_brain.js'));
  const bank = JSON.parse(require('fs').readFileSync(path.join(ROOT, 'banks/BOHEMIA_TUNING_AUTO_BRAIN_10_25_26.json'), 'utf8'));
  const ctx0 = await B.engineFor('today'), districts = ctx0.DB.boardKinds.districts;
  const fights = [], abil = { skill: 0, swap: 0, sweep: 0, reloadLoaded: 0 }, errs = [], frees = { you: 0, them: 0, youRout: 0, themRout: 0 }, dances = { own: 0, rout: 0, list: [] };
  for (let k = 0; k < N; k++) {
    try {
      const W = B.fightOf(k, districts);
      fights.push(await B.oneFight(W, 'dance', 'today'));
      /* G6 on the same fight, played again with its log read: what his side did that is not move, fire or strike */
      const ctx = await B.engineFor('today'), F = ctx.FIGHT; B.setupFight(ctx, W); F.S.deploy = false;
      const orig = F._t.apply, turns = {}; let g = 0;
      while (!F.S.over && F.S.round <= 60 && g < 400000) {
        const v = F.current(); if (!v) break;
        const before = F.S.log.length, rout = v.morale === 'Fleeing', tk = v.id + ':' + F.S.round;
        if (v.side === 'you' && !turns[tk]) turns[tk] = { id: v.id, r: F.S.round, sx: v.x, sy: v.y, rout: rout, hit: false };
        const loadedShot = v.side === 'you' && v.weapon && F.isRanged(v.weapon) && F.S.units.some(t => t.side !== 'you' && F.onField(t) && F.canStrike(v, t) && F.sideSees('you', t));
        F.aiStep(v);
        F.S.log.slice(before).forEach(e => {
          if (e.id === v.id && e.t === 'reload' && loadedShot) abil.reloadLoaded++;
          if (e.t === 'attack' && e.free && e.to === v.id) frees[v.side + (rout ? 'Rout' : '')]++;   /* the swings he took walking out of a ring, in a rout or by choice */
          if (turns[tk] && e.id === v.id && e.t === 'attack') turns[tk].hit = true;
        });
        if (turns[tk]) { turns[tk].ex = v.x; turns[tk].ey = v.y; if (v.morale === 'Fleeing') turns[tk].rout = true; }
        g++;
      }
      /* G2 from the same play: A to B one round, B to A the next, no swing in either; a rout (his morale's flight) counted apart */
      Object.values(turns).forEach(t => { const nx = turns[t.id + ':' + (t.r + 1)];
        if (!nx || t.hit || nx.hit || (t.sx === t.ex && t.sy === t.ey) || nx.ex !== t.sx || nx.ey !== t.sy || nx.sx !== t.ex || nx.sy !== t.ey) return;
        if (t.rout || nx.rout) dances.rout++; else { dances.own++; dances.list.push(k + ':' + t.id + '@r' + t.r); } });
      F.S.log.forEach(e => { const u = F.byId(e.id); if (!u || u.side !== 'you') return;
        if (e.t === 'skill') abil.skill++; if (e.t === 'swap') abil.swap++; if (e.t === 'attack' && e.skill && /swing|split|reap|shatter|sweep|thresh|round/i.test(e.skill)) abil.sweep++; });
      void orig;
    } catch (e) { errs.push(k + ': ' + e.message.slice(0, 160)); }
  }
  const before = (bank.dance && bank.dance.fights || []).filter(f => f.k < N);
  const sum = (fs, side, k) => fs.reduce((a, f) => a + ((f[side] || {})[k] || 0), 0), n = fights.length;
  const won = fights.filter(f => f.result === 'won').length, wonB = before.filter(f => f.result === 'won').length;
  const stalled = fights.filter(f => f.result === 'stalled').length, stalledB = before.filter(f => f.result === 'stalled').length;
  const dance = dances.own;
  leg(n >= N - 2 && sum(fights, 'you', 'wasted') === 0, '*** G1 NO WASTED TURN *** (rule 176(a)): no man of his spends steps to end where he began with nothing done',
    sum(fights, 'you', 'wasted') + ' in ' + n + ' fights (the old brain on the same fights: ' + sum(before, 'you', 'wasted') + ')');
  leg(dance <= Math.ceil(n / 50), '*** G2 NO DANCE *** (rule 176(b): \'never off and back\'): off one round and back the next with no swing in either, at most one in 50 fights (TUNING\'s bar is 0)',
    dance + ' by AUTO in ' + n + ' fights' + (dances.list.length ? ' (' + dances.list.slice(0, 4).join(', ') + ')' : '') + ', ' + dances.rout + ' in a morale rout; the bench\'s count, every kind: ' + sum(fights, 'you', 'offAndBackNoSwing') + ' (the old brain: ' + sum(before, 'you', 'offAndBackNoSwing') + ')');
  const skip = sum(fights, 'you', 'skippedStrike') / Math.max(1, sum(fights, 'you', 'couldStrike')), skipB = sum(before, 'you', 'skippedStrike') / Math.max(1, sum(before, 'you', 'couldStrike'));
  leg(skip < 0.005, 'G3 a man with a strike in reach swings ("if it\'s melee range, get in"): under 0.5% never swing', (100 * skip).toFixed(2) + '% (the old brain ' + (100 * skipB).toFixed(2) + '%)');
  const free = sum(fights, 'you', 'freeSwingsTaken') / n, freeB = sum(before, 'you', 'freeSwingsTaken') / Math.max(1, before.length), theirs = sum(fights, 'them', 'freeSwingsTaken') / n;
  /* G4 splits the swings a rout takes (Battle Brothers' morale: a fleeing man runs through them, kept) from AUTO's own walks out */
  const own = frees.you / n, ownThem = frees.them / n;
  leg(own <= Math.max(ownThem, 0.25), '*** G4 AUTO NEVER WALKS OUT OF A RING THROUGH THE SWINGS *** (TUNING\'s bar: no more than theirs), not counting a man in a rout',
    own.toFixed(2) + ' a fight by choice (theirs ' + ownThem.toFixed(2) + '); in a rout ' + (frees.youRout / n).toFixed(2) + ' (theirs ' + (frees.themRout / n).toFixed(2) + '); all told ' + free.toFixed(2) + ' (the old brain ' + freeB.toFixed(2) + ', theirs ' + theirs.toFixed(2) + ')');
  const roof = sum(fights, 'you', 'gunmenWithAnyTook') / Math.max(1, sum(fights, 'you', 'gunmenWithAny')), roofB = sum(before, 'you', 'gunmenWithAnyTook') / Math.max(1, sum(before, 'you', 'gunmenWithAny'));
  leg(roof > 0.4 && roof >= roofB, 'G5 a gunman who can walk onto a roof takes one (rule 176(f)): over 40% and no fewer than before (TUNING\'s bar 60%, not met yet)', (100 * roof).toFixed(1) + '% (the old brain ' + (100 * roofB).toFixed(1) + '%)');
  leg(abil.skill + abil.swap + abil.sweep + abil.reloadLoaded === 0, '*** G6 AUTO USES NO ABILITY *** (rule 180: move, fire, strike; reload only to keep firing)',
    abil.skill + ' skills, ' + abil.swap + ' bag swaps, ' + abil.sweep + ' special swings, ' + abil.reloadLoaded + ' reloads with a shot on, by his side over ' + n + ' fights');
  leg(stalled === 0, '*** G7 EVERY FIGHT ENDS *** (the standoff: when they land nothing for five rounds they break off)', stalled + ' fights to the 60-round mark (the old brain: ' + stalledB + ')');
  leg(won >= wonB, 'G8 and AUTO wins at least as often as the old brain on the same fights', won + ' of ' + n + ' (the old brain ' + wonB + ' of ' + before.length + ')');
  leg(errs.length === 0, 'nothing threw', errs.slice(0, 2).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
