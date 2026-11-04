#!/usr/bin/env node
/* AUTO HOLDS THE ROOF (the coordinator 11/4, rule 385 and its amendment, ask lines 416 and 417; Paolo: 'why am I watching my people
   climb on top of a roof and then climb off to get a shot... just stick on the roof... I'm losing battles because the auto keeps wanting
   my men to get off the roof'; 'they have enemies in range of a shot and they're still getting off the roof... why can't they just post
   up for one turn, especially when it's a tight battle').
   Legs, headless on the live fight's rules:
   R1 THE RULE IS DATA: ours.auto_holds_the_roof on, hold_turns and hold_turns_tight (tight >= normal >= 1), his words and the why;
   R2 A SHOT FROM UP THERE KEEPS HIM UP THERE: his shooter on a roof with a man of theirs in reach from it, on AUTO: his turn ends on his
      storey; the same man's own tap (no AUTO) still walks him down to the street (his taps are his);
   R3 THE PROBE'S FIGHTS (wolves, raiders, the robots, the act-one bosses; tools/bohemia_combat_auto_holds_the_roof_probe_11_4_26.js):
      no turn of his shooter that opened up there ended lower with a shot from up there; none came down before posting up; none climbed
      and came straight back down; roofs are still taken (roof turns > 0); nothing threw.
   Run: node gates/auto_holds_the_roof_gate.js [--n 12] */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const N = Number(arg('--n', 12));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const O = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8')), H = O.auto_holds_the_roof;

/* R1 */
leg(!!(H && H.value && H.value.on === true && H.value.hold_turns >= 1 && H.value.hold_turns_tight >= H.value.hold_turns && H.source &&
  /stick on the roof/.test(H.quote || '') && /post up/.test(H.quote || '') && (H.why || '').length > 200),
  'R1 THE RULE IS DATA: ours.auto_holds_the_roof on, hold ' + (H && H.value.hold_turns) + ' turn(s), ' + (H && H.value.hold_turns_tight) + ' in a tight fight, his words and the why');

/* R2 */
{
  const ctx = engine(), F = ctx.FIGHT, T = F._t;
  const CREW = [{ background: 'companion_ranged', name: 'TINA' }, { background: 'companion_2hand', name: 'RAUL' }];
  let got = null, sd;
  for (sd = 1; sd < 120 && !got; sd++) {
    ctx.setSeed(sd); F.setup({ kind: 'works', company: CREW, cap: 12, deploy: false, formation: null, band: ['brigand_thug', 'brigand_thug'] });
    const S = F.S, me = S.units.filter(v => v.side === 'you' && F.isRanged(v.weapon))[0], foe = S.units.filter(v => v.side === 'them')[0];
    if (!me || !foe) continue;
    S.units.forEach(v => { if (v !== me && v !== foe) { v.x = -50; v.y = -50; } });
    for (let y = 1; y < S.h - 1 && !got; y++) for (let x = 1; x < S.w - 1 && !got; x++) {
      if (!F.isRoof(x, y) || F.level(x, y) < 1 || !T.passable(x, y)) continue;
      const foot = [[0, 1], [1, 0], [-1, 0], [0, -1]].map(d => ({ x: x + d[0], y: y + d[1] })).filter(q => T.passable(q.x, q.y) && F.level(q.x, q.y) < F.level(x, y))[0];
      if (!foot) continue;
      for (let dy = -6; dy <= 6 && !got; dy++) for (let dx = -6; dx <= 6 && !got; dx++) {
        const q = { x: x + dx, y: y + dy }; if (!T.passable(q.x, q.y) || F.isRoof(q.x, q.y) || Math.max(Math.abs(dx), Math.abs(dy)) < 3) continue;
        me.x = x; me.y = y; foe.x = q.x; foe.y = q.y; me.ap = me.apTurn; me.fat = 0; me.loaded = true; me.upRound = undefined;
        if (F.canStrike(me, foe) && F.sideSees('you', foe)) got = { roof: { x, y, lv: F.level(x, y) }, foot, foe: q };
      }
    }
  }
  if (!got) leg(false, 'R2 a roof with a man of theirs in reach from it', 'none in 120 seeds of works');
  else {
    const S = F.S, me = S.units.filter(v => v.side === 'you' && F.isRanged(v.weapon))[0], foe = S.units.filter(v => v.side === 'them')[0];
    const put = () => { me.x = got.roof.x; me.y = got.roof.y; foe.x = got.foe.x; foe.y = got.foe.y; me.ap = me.apTurn; me.fat = 0; me.loaded = true; me.upRound = undefined; me.morale = 'Steady'; S.order = [me.id, foe.id]; S.idx = 0; S.retreat = false; };
    put();
    let g = 0; const L0 = S.log.length; const r0 = S.round;
    while (!S.over && F.current() === me && S.round === r0 && g < 40) { F.aiStep(me); g++; }
    const lvAfter = F.level(me.x, me.y), shot = S.log.slice(L0).some(e => e.t === 'attack' && e.id === me.id && !e.free);
    put();
    const tap = F.moveTo(me, got.foot.x, got.foot.y), lvTap = F.level(me.x, me.y);
    leg(lvAfter >= got.roof.lv && tap && lvTap < got.roof.lv,
      'R2 A SHOT FROM UP THERE KEEPS HIM UP THERE: on AUTO his turn ends on his storey; his own tap still walks him down',
      JSON.stringify({ seed: sd - 1, roof: got.roof, foe: got.foe, autoEndsOn: [me.x, me.y, 'lv' + lvAfter], shot, tapDown: tap, tapLv: lvTap }));
  }
}

/* R3 */
{
  const out = path.join(os.tmpdir(), 'auto_holds_the_roof_gate_' + process.pid + '.json');
  const r = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools/bohemia_combat_auto_holds_the_roof_probe_11_4_26.js'), '--n', String(N), '--json', out], { encoding: 'utf8', timeout: 900000 });
  let P = null; try { P = JSON.parse(fs.readFileSync(out, 'utf8')); fs.unlinkSync(out); } catch (e) { /* below */ }
  if (!P) leg(false, 'R3 the probe ran', (r.stderr || r.stdout || '').slice(0, 300));
  else {
    const K = P.kinds, ks = Object.keys(K), sum = f => ks.reduce((t, k) => t + (K[k][f] || 0), 0);
    leg(ks.length === 4 && sum('roof_turns') > 0 && sum('left_with_a_shot') === 0 && sum('left_while_posting') === 0 && sum('up_then_down') === 0 && ks.every(k => !K[k].errors.length),
      '*** R3 THE FIGHTS: ' + sum('roof_turns') + ' roof turns in ' + sum('fights') + ' fights; none left the roof with a shot from it, none came down before posting up, none climbed and came straight back down ***',
      ks.map(k => k + ' roof ' + K[k].roof_turns + ' stayed ' + K[k].stayed_up + ' left-with-shot ' + K[k].left_with_a_shot + ' left-posting ' + K[k].left_while_posting + ' up-down ' + K[k].up_then_down + ' won ' + K[k].won + '/' + K[k].fights + (K[k].errors.length ? ' ERR ' + K[k].errors[0] : '')).join(', '));
  }
}
console.log('=== AUTO HOLDS THE ROOF: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
