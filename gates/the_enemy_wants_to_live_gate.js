#!/usr/bin/env node
/* THE ENEMY WANTS TO LIVE AND TAKES THE HIGH GROUND (COMBAT 7, rule 366, ask line 390; Paolo 11/3: 'Battle Brothers [enemies are]
   slightly intelligent, they try to preserve their [lives]... our enemies should be climbing on tops as high as they can, reasonable...
   the enemy can have abilities as well'). Battle Brothers' AI is the floor; the measures are in
   tools/bohemia_combat_the_enemy_wants_to_live_probe_11_3_26.js and records/BOHEMIA_COMBAT_7_AUTO_NEVER_LEAVES_A_MAN_11_3_26.md s5.
   Legs, headless on the live fight's rules:
   W1 THE RULE IS DATA: ours.enemy_wants_to_live (storey_weight, alone_into, alone_penalty_tiles) with source, quote and why; their
      shooters' brains (ai.json backline, kid, mechanic) take the high ground
   W2 NOBODY WALKS ALONE INTO FIVE: a man of theirs with nothing to hit this turn, four of ours ahead, no friend near: he does not end
      his walk where three or more of ours can hit him (the brain before this round did)
   W3 AS HIGH AS THEY CAN: a shooter of theirs with no shot, two roofs he can reach that give him one next turn, one a storey higher:
      he climbs the higher (the climb brain now theirs, rule 328 kept: never while a tile gives him the shot this turn)
   W4 ABILITIES: a man of theirs with Rally the Troops and two of his breaking beside him rallies them
   Run: node gates/the_enemy_wants_to_live_gate.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb', f), 'utf8'));
const OURS = J('ours.json'), AI = J('ai.json');
const dist = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
const BEFORE = r => r.replace("if (u.side !== 'you' && !canHit && sc > -Infinity && !friends(u)", "if (false && !friends(u)").replace("+ (u.side !== 'you' ? level(x, y) * R('ours.enemy_wants_to_live').storey_weight * R('ap.move_cost.flat') : 0)", '');

/* W1 */
const ew = OURS.enemy_wants_to_live;
leg(!!(ew && ew.value && ew.source && ew.quote && ew.why && ew.value.storey_weight > 0 && ew.value.alone_into >= 2) && ['backline', 'kid', 'mechanic'].every(k => AI.archetypes[k].value.high_ground === true),
  '*** W1 THE RULE IS DATA ***: ours.enemy_wants_to_live with its source, his words and why; their shooters take the high ground', JSON.stringify(ew && ew.value));

/* W2: on a flat board, one thug of theirs, four of ours in a block ahead: count the turns he ends alone in reach of 3+ */
function w2(ctx) {
  const F = ctx.FIGHT; let alone = 0, n = 0;
  /* rule 428(d) (COMBAT TWO 11/7): one of theirs against four of ours is outmatched and digs in, never walking at all; this leg is the
     walk of a man who comes on, so the odds read is off for it (THE OLD LAYOUT, THE NEW HOUSES E4 holds the digging) */
  if (ctx.DB.ours.outmatched) ctx.DB.ours.outmatched.value.on = false;
  for (let sd = 1; sd <= 10; sd++) {
    ctx.setSeed(sd); F.setup({ kind: 'suburb', formation: null, deploy: false, flat: true, company: [{ background: 'companion_2hand' }, { background: 'companion_1hand' }, { background: 'companion_2hand' }, { background: 'companion_1hand' }], cap: 4, band: ['brigand_thug', 'brigand_thug'] });
    const S = F.S, mine = S.units.filter(u => u.side === 'you'), t = S.units.filter(u => u.side === 'them');
    S.units.forEach(u => { u.fled = mine.indexOf(u) < 0 && u !== t[0]; });
    const cx = Math.floor(S.w / 2), cy = Math.floor(S.h / 2);
    const WPN = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/weapons.json'), 'utf8')).rows;
    [[0, 0], [0, 1], [1, 0], [1, 1]].forEach((d, i) => { mine[i].x = cx + d[0]; mine[i].y = cy + d[1]; mine[i].weapon = Object.assign({}, WPN.filter(r => r.id === (i % 2 ? 'dagger' : 'bludgeon'))[0]); mine[i].ammo = null; mine[i].bag = []; });
    t[0].x = Math.max(0, cx - 6); t[0].y = cy; t[0].morale = 'Steady';
    S.order = [t[0].id].concat(mine.map(u => u.id)); S.idx = 0; t[0].ap = t[0].apTurn; t[0].begun = true; t[0].turnLog = S.log.length;
    let g = 0; while (F.current() === t[0] && g++ < 10) F.aiStep(t[0]);
    const struck = S.log.some(e => e.id === t[0].id && e.t === 'attack');
    const reach = mine.filter(m => !!F._t.threatReach(m, t[0])).length;
    n++; if (!struck && reach >= OURS.enemy_wants_to_live.value.alone_into) alone++;
  }
  return { alone, n };
}
{
  const now = w2(engine()), was = w2(engine({ patch: BEFORE }));
  leg(now.alone === 0 && was.alone > 0, '*** W2 NOBODY WALKS ALONE INTO FIVE ***: a lone man of theirs, nothing to hit, four of ours ahead: he never ends his walk where three of ours can strike him (the brain before: ' + was.alone + ' of ' + was.n + ')',
    now.alone + ' of ' + now.n + ' walked into it');
}

/* W3: find a board with two roofs of different storeys he can reach, each with a man of ours in range from it and none from the ground */
function w3(ctx) {
  const F = ctx.FIGHT, T = F._t;
  for (let sd = 1; sd < 80; sd++) {
    ctx.setSeed(sd); F.setup({ kind: 'works', formation: null, deploy: false, company: [{}], cap: 1, band: ['brigand_marksman'] });
    const S = F.S, me = S.units.filter(u => u.side === 'you')[0], t = S.units.filter(u => u.side === 'them')[0];
    S.units.forEach(u => { u.fled = u !== me && u !== t; });
    for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) {
      if (!T.passable(x, y) || F.level(x, y) !== 0 || F.isRoof(x, y)) continue;
      t.x = x; t.y = y; t.ap = t.apTurn; t.loaded = true; t.climbed = null; t.upRound = null;
      const f = F.reach(t), roofs = Object.keys(f.best).map(Number).map(k => ({ x: k % S.w, y: Math.floor(k / S.w), c: f.best[k] })).filter(q => F.isRoof(q.x, q.y) && F.level(q.x, q.y) >= 1 && !F.zocOn(t, q.x, q.y).length);
      const lv = new Set(roofs.map(q => F.level(q.x, q.y)));
      if (lv.size < 2) continue;
      /* a man of ours out of his range from the ground, in range from every roof */
      const far = F.rangeMax(t.weapon.range);
      for (let yy = 0; yy < S.h; yy++) for (let xx = 0; xx < S.w; xx++) {
        if (!T.passable(xx, yy) || F.isRoof(xx, yy)) continue;
        if (dist({ x: xx, y: yy }, t) <= far + 1) continue;
        me.x = xx; me.y = yy;
        const from = q => { const ox = t.x, oy = t.y; t.x = q.x; t.y = q.y; const ok = F._t.inRange(t, me) && F.sideSees('them', me); t.x = ox; t.y = oy; return ok; };
        const ground = Object.keys(f.best).map(Number).map(k => ({ x: k % S.w, y: Math.floor(k / S.w) })).filter(q => !F.isRoof(q.x, q.y));
        if (ground.some(from)) continue;   /* no ground tile in his walk gives him the shot this turn: the roof is the only way */
        const good = roofs.filter(from); if (new Set(good.map(q => F.level(q.x, q.y))).size < 2) continue;
        roofs.length = 0; good.forEach(q => roofs.push(q));
        const hi = Math.max.apply(null, roofs.map(q => F.level(q.x, q.y)));
        S.order = [t.id, me.id]; S.idx = 0; t.begun = true; t.turnLog = S.log.length; S.round = 2;
        let g = 0; while (F.current() === t && g++ < 10) F.aiStep(t);
        return { sd, top: F.level(t.x, t.y), hi, lo: Math.min.apply(null, roofs.map(q => F.level(q.x, q.y))), climbed: F.isRoof(t.x, t.y) };
      }
    }
  }
  return null;
}
{
  const now = w3(engine()), was = w3(engine({ patch: BEFORE }));
  leg(!!now && now.climbed && now.top === now.hi, '*** W3 AS HIGH AS THEY CAN ***: a shooter of theirs with no shot and roofs of two heights that give him one: he takes the highest',
    JSON.stringify({ now, before: was }));
}

/* W4 */
{
  const ctx = engine(), F = ctx.FIGHT;
  ctx.setSeed(3); F.setup({ kind: 'suburb', formation: null, deploy: false, flat: true, company: [{}], cap: 1, band: ['brigand_leader', 'brigand_thug', 'brigand_thug'] });
  const S = F.S, me = S.units.filter(u => u.side === 'you')[0], th = S.units.filter(u => u.side === 'them');
  const cap = th.filter(u => (u.perks || []).some(p => p && (p.id === 'rally_the_troops' || p === 'rally_the_troops')))[0] || th[0];
  if ((cap.perks || []).every(p => !(p && (p.id === 'rally_the_troops' || p === 'rally_the_troops')))) cap.perks = (cap.perks || []).concat([ctx.DB.perks.rows ? ctx.DB.perks.rows.rally_the_troops || 'rally_the_troops' : 'rally_the_troops']);
  const others = th.filter(u => u !== cap);
  cap.x = 8; cap.y = 6; others[0].x = 8; others[0].y = 7; others[1].x = 9; others[1].y = 6; me.x = 2; me.y = 2;
  others.forEach(u => { u.morale = 'Breaking'; });
  S.order = [cap.id, me.id].concat(others.map(u => u.id)); S.idx = 0; cap.ap = cap.apTurn; cap.fat = 0; cap.begun = true; cap.rallied = false;
  const L0 = S.log.length; let g = 0; while (F.current() === cap && g++ < 10) F.aiStep(cap);
  const ev = S.log.slice(L0).filter(e => e.id === cap.id && e.t === 'skill');
  leg(ev.some(e => /rally/.test(e.skill)), '*** W4 ABILITIES ***: a man of theirs with Rally the Troops, two of his breaking beside him: he rallies them', ev.map(e => e.skill).join(', ') || 'no skill used');
}
console.log('\n=== THE ENEMY WANTS TO LIVE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
