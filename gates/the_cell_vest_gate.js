#!/usr/bin/env node
/* THE CELL VEST (COMBAT 5 ship 2, rule 305, Paolo 11/2; ask line 297). The design: records/BOHEMIA_PAOLO_THE_CELL_VEST_THE_WRONGNESS_
   AND_TRUE_JOB_TIMES_11_2_26.md section 1; what shipped: records/BOHEMIA_COMBAT_THE_CELL_VEST_11_2_26.md. Every number is read from
   ours.cell_vest, never typed here. Legs, headless on the live fight's rules:
   V1 THE DATA AND THE NAME: ours.cell_vest sourced with his words and the why; no player-facing word of it says suicide or bomb;
   V2 ON A MAN, NEVER ON YOU: a hire handed a vest (gear.acc) wears it, its cells from the data; the main man handed one does not;
   V3 THE SQUEEZE: on the beat every cell, off it half; each man touching him (friend and foe) loses cells x damage_per_cell, half
      through the armour and the rest on it; a man two tiles off nothing; he goes down; his tile and the eight round it burn and smoke;
      both sides have seen it; the risk lit first (sparkPreview) is what landed;
   V4 A WALL x1.5, A MACHINE x1.5;
   V5 THE DEAD MAN'S SWITCH: struck down by their blow, every cell goes off with no squeeze, and burns the men touching him;
   V6 THE DEATH ROLL: 20% + 25% for the vest (45% with no marks), -15% in fire gear; 100+ squeezes (of 400 seeds, the boards with open
      ground) land inside three spreads of the odds;
   V7 NOTHING LEFT: his most health 1; a blow his armour can hold takes armour only; with the armour gone he falls;
   V8 THE GROUND: a man ending his turn on a burning tile takes On Fire's 15 to 30 (the armour first, a tenth through); the fire is
      gone after its rounds; a shot through the smoke reads -20 and 'smoke';
   V9 THE FEAR: once a side has seen one go off, the tiles beside a live vest cost its men danger_per_vest, and its club beside two
      of ours steps to the one without a vest; before, nothing;
   V10 AUTO NEVER SQUEEZES, THE SWITCH ON AUTO: fights on AUTO with a vest on a hire end, nothing threw, under 4 minutes; no squeeze by
      AUTO; climbed this turn, the squeeze is refused (rule 328).
   Run: node gates/the_cell_vest_gate.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const O = J('records/target/bb/ours.json'), CVR = O.cell_vest, V = CVR && CVR.value;
const html = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');

/* V1 */
{
  const says = (html.match(/const SPARK_SAYS = \{[\s\S]*?\};/) || [''])[0];
  leg(!!(V && CVR.source && /suicide bomber/.test(CVR.quote || '') && (CVR.why || '').length > 400 && V.vests.cell_vest_scrap.cells === 4 && V.vests.cell_vest_yard.cells === 8 && V.vests.cell_vest_late.cells === 12 && says && !/suicid|bomb/i.test(says) && V.look.edge && !/^#(8|9|a)[0-9a-f]{2}(c|d|e|f)/i.test(V.look.edge)),
    'V1 THE DATA AND THE NAME: ours.cell_vest sourced with his words; 4, 8, 12 cells; the words never say suicide or bomb; the edge crimson, never purple',
    JSON.stringify({ edge: V && V.look.edge, words: says.length }));
}
const CREW = [{ background: 'companion_2hand', name: 'RAUL' }, { background: 'companion_1hand', name: 'DESI', gear: { acc: 'cell_vest_yard' } }, { background: 'companion_ranged', name: 'TINA' }];
const MAINV = [{ background: 'companion_2hand', name: 'RAUL', gear: { acc: 'cell_vest_late' } }, { background: 'companion_1hand', name: 'DESI' }];
/* a clean stage: a board with open flat ground, the men put where the leg wants them, everybody else off the board */
function stage(seed, company, band) {
  const ctx = engine(), F = ctx.FIGHT, T = F._t;
  ctx.setSeed(seed); F.setup({ kind: 'works', company: company || CREW, cap: 12, deploy: false, formation: null, band: band || ['brigand_thug', 'brigand_thug', 'brigand_thug'] });
  const S = F.S;
  const open = (x, y) => T.passable(x, y) && F.level(x, y) === 0 && !F.isRoof(x, y);
  let c = null;
  for (let y = 3; y < S.h - 3 && !c; y++) for (let x = 3; x < S.w - 3 && !c; x++) {
    let ok = true; for (let dy = -2; dy <= 2 && ok; dy++) for (let dx = -2; dx <= 2 && ok; dx++) ok = open(x + dx, y + dy) && !T.byWall({ x: x + dx, y: y + dy });
    if (ok) c = { x, y };
  }
  S.units.forEach(v => { v.x = -50; v.y = -50; });
  return { ctx, F, T, S, c };
}
const put = (v, x, y) => { v.x = x; v.y = y; v.dead = false; v.down = false; v.fled = false; };
const vestMan = S => S.units.filter(v => v.side === 'you' && v.vest)[0];

/* V2 */
{
  const a = stage(3), m = vestMan(a.S);
  const b = stage(3, MAINV), main = b.S.units.filter(v => v.main)[0];
  leg(!!(m && m.vest.cells === V.vests.cell_vest_yard.cells && !m.main && main && !main.vest),
    'V2 ON A MAN, NEVER ON YOU: the hire handed the yard vest wears ' + V.vests.cell_vest_yard.cells + ' cells; the main man handed one wears none',
    JSON.stringify({ hire: m && m.vest, main: main && (main.vest || null) }));
}

/* V3 + V6 (the odds) */
{
  let rows = null, offCells = null, preview = null, tiles = 0, seen = null, stood = null, farHit = null;
  const per = V.damage_per_cell;
  for (let sd = 3; sd < 40 && !rows; sd++) {
    const a = stage(sd); if (!a.c) continue;
    const { F, S, T, c } = a, m = vestMan(S), foes = S.units.filter(v => v.side === 'them'), mate = S.units.filter(v => v.side === 'you' && v !== m)[0];
    put(m, c.x, c.y); put(foes[0], c.x + 1, c.y); put(foes[1], c.x, c.y + 1); put(foes[2], c.x + 2, c.y - 2); put(mate, c.x - 1, c.y);
    [foes[0], foes[1], mate, foes[2]].forEach(v => { v.armB = 100; v.hp = 200; v.hpMax = 200; v.ghost = false; });
    S.order = [m.id].concat(S.order.filter(id => id !== m.id)); S.idx = 0; m.ap = m.apTurn; m.fat = 0; m.morale = 'Steady';
    preview = F.sparkPreview(m, true);
    const before = [foes[0], foes[1], mate, foes[2]].map(v => ({ hp: v.hp, arm: v.armB }));
    const r = F.spark(m, true);
    rows = [foes[0], foes[1], mate, foes[2]].map((v, i) => ({ id: v.id, hp: before[i].hp - v.hp, arm: before[i].arm - v.armB }));
    tiles = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].filter(q => F.fireAt(c.x + q[0], c.y + q[1]) && F.smokeAt(c.x + q[0], c.y + q[1])).length;
    seen = Object.assign({}, S.sparkSeen); stood = F.onField(m); farHit = rows[3].hp + rows[3].arm;
    rows.cells = r && r.cells;
    /* off the beat, on a fresh copy of the same stage */
    const b = stage(sd), mb = vestMan(b.S); put(mb, b.c.x, b.c.y); b.S.order = [mb.id]; b.S.idx = 0; mb.ap = mb.apTurn; mb.fat = 0; mb.morale = 'Steady';
    const r2 = b.F.spark(mb, false); offCells = r2 && r2.cells;
  }
  const all = V.vests.cell_vest_yard.cells, d = all * per, direct = Math.round(d * V.through_armour_share);
  const okHits = rows && rows.slice(0, 3).every(r => r.hp === direct && r.arm === d - direct);
  const okPrev = rows && preview && preview.men.length === 3 && preview.men.every(p => { const r = rows.filter(x => x.id === p.id)[0]; return r && r.hp === p.hp && r.arm === p.armour; });
  leg(!!(rows && rows.cells === all && offCells === Math.floor(all * V.dial.off_beat_share) && okHits && farHit === 0 && !stood && tiles === 9 && seen.you && seen.them && okPrev),
    'V3 THE SQUEEZE: on the beat ' + all + ' cells, off it ' + Math.floor(all * V.dial.off_beat_share) + '; each man touching him (friend and foe) -' + direct + ' health -' + (d - direct) + ' armour; two tiles off untouched; he goes down; 9 tiles burn and smoke; both sides saw it; the risk lit first is what landed',
    JSON.stringify({ rows, offCells, tiles, stood, seen, preview: preview && preview.men }));
}
/* V4 */
{
  let wall = null, mach = null;
  for (let sd = 1; sd < 60 && (!wall || !mach); sd++) {
    const a = stage(sd, CREW, ['wiederganger', 'brigand_thug']); const { F, S, T } = a, m = vestMan(S);
    const w = S.units.filter(v => v.side === 'them' && F.isMachine(v))[0], b = S.units.filter(v => v.side === 'them' && !F.isMachine(v))[0];
    if (!wall) for (let y = 2; y < S.h - 2 && !wall; y++) for (let x = 2; x < S.w - 2 && !wall; x++) {
      if (!T.passable(x, y) || !T.byWall({ x, y })) continue;
      const q = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(o => ({ x: x + o[0], y: y + o[1] })).filter(o => T.passable(o.x, o.y))[0]; if (!q) continue;
      put(m, x, y); put(b, q.x, q.y); b.armB = 100; b.hp = 300;
      const h = T.sparkHurt(m, b, 4); put(m, -50, -50);
      wall = { at: [x, y], all: h.all };
    }
    if (!mach && a.c && w) { put(m, a.c.x, a.c.y); put(w, a.c.x + 1, a.c.y); put(b, a.c.x - 1, a.c.y); mach = { m: T.sparkHurt(m, w, 4).all, man: T.sparkHurt(m, b, 4).all }; }
  }
  const plain = 4 * V.damage_per_cell;
  leg(!!(wall && wall.all === Math.round(plain * V.wall_x) && mach && mach.man === plain && mach.m === Math.round(plain * V.machine_x)),
    'V4 A WALL x' + V.wall_x + ', A MACHINE x' + V.machine_x + ' (4 cells: ' + plain + ' in the open)', JSON.stringify({ wall, mach }));
}
/* V5 */
{
  let res = null;
  for (let sd = 3; sd < 40 && !res; sd++) {
    const a = stage(sd); if (!a.c) continue;
    const { F, S, T, c } = a, m = vestMan(S), foes = S.units.filter(v => v.side === 'them');
    put(m, c.x, c.y); put(foes[0], c.x + 1, c.y); put(foes[1], c.x - 1, c.y + 1);
    foes.slice(0, 2).forEach(v => { v.armB = 100; v.hp = 200; });
    m.hp = 1; m.armB = 0; m.armH = 0;
    const L0 = S.log.length, h0 = foes[1].hp + foes[1].armB;
    T.apply(foes[0], m, { hit: true, head: false, hp: 10, armour: 0, chance: 100 });
    const ev = S.log.slice(L0), sp = ev.filter(e => e.t === 'spark')[0];
    res = { fell: !F.onField(m), spark: sp ? { how: sp.how, cells: sp.cells } : null, burned: h0 - (foes[1].hp + foes[1].armB), vestGone: !F.vestLive(m) };
  }
  leg(!!(res && res.fell && res.spark && res.spark.how === 'switch' && res.spark.cells === V.vests.cell_vest_yard.cells && res.burned === V.vests.cell_vest_yard.cells * V.damage_per_cell && res.vestGone),
    'V5 THE DEAD MAN\'S SWITCH: struck down by their blow, all ' + V.vests.cell_vest_yard.cells + ' cells go with no squeeze and burn the men touching him', JSON.stringify(res));
}
/* V6 */
{
  const a = stage(5), { F, S, T, c } = a, m = vestMan(S);
  const p0 = F.sparkDeath(m), base = O.struck_down_death_chance.value;
  m.bodyRow = { id: 'gate_fire_apron' }; a.ctx.DB.ours.cell_vest.value.fire_gear = ['gate_fire_apron'];
  const p1 = F.sparkDeath(m); a.ctx.DB.ours.cell_vest.value.fire_gear = [];
  let dead = 0, n = 0;
  for (let k = 0; k < 400; k++) {
    const b = stage(1000 + k); if (!b.c) continue; const mb = vestMan(b.S); put(mb, b.c.x, b.c.y); b.S.order = [mb.id]; b.S.idx = 0; mb.ap = mb.apTurn; mb.fat = 0; mb.morale = 'Steady'; mb.injuries = mb.injuries.filter(j => j.kind !== 'permanent');
    if (!b.F.spark(mb, true)) continue; n++; if (mb.dead) dead++;
  }
  const want = base + V.death_share, got = dead / Math.max(1, n), sd = Math.sqrt(want * (1 - want) / Math.max(1, n));
  leg(Math.abs(p0 - want) < 1e-9 && Math.abs(p1 - (want - V.fire_gear_cut)) < 1e-9 && n >= 100 && Math.abs(got - want) <= 3 * sd,
    'V6 THE DEATH ROLL: ' + Math.round(base * 100) + '% + ' + Math.round(V.death_share * 100) + '% for the vest = ' + Math.round(want * 100) + '%, fire gear -' + Math.round(V.fire_gear_cut * 100) + '%; ' + n + ' squeezes, ' + (100 * got).toFixed(1) + '% died',
    JSON.stringify({ p0, p1, dead, n }));
}
/* V7 */
{
  const crew = [{ background: 'companion_2hand', name: 'RAUL' }, { background: 'companion_1hand', name: 'DESI', perks: ['nothing_left'] }];
  const a = stage(7, crew), { F, S, T } = a, m = S.units.filter(v => v.name === 'DESI')[0], foe = S.units.filter(v => v.side === 'them')[0];
  put(m, 5, 5); put(foe, 6, 5); m.armB = 50;
  const hpMax = m.hpMax;
  T.apply(foe, m, { hit: true, head: false, hp: 20, armour: 10, chance: 100 });
  const held = { hp: m.hp, arm: m.armB, on: F.onField(m) };
  T.apply(foe, m, { hit: true, head: false, hp: 25, armour: 0, chance: 100 });
  const after = { hp: m.hp, arm: m.armB, on: F.onField(m) };
  leg(hpMax === V.nothing_left.hp_max && held.hp === 1 && held.arm === 20 && held.on && !after.on,
    'V7 NOTHING LEFT: his most health ' + V.nothing_left.hp_max + '; a blow of 30 his armour of 50 holds takes 30 armour and no health; the next, past the armour, drops him',
    JSON.stringify({ hpMax, held, after }));
}
/* V8 */
{
  let res = null;
  for (let sd = 3; sd < 40 && !res; sd++) {
    const a = stage(sd); if (!a.c) continue;
    const { F, S, T, c } = a, m = vestMan(S), foes = S.units.filter(v => v.side === 'them'), shooter = S.units.filter(v => v.side === 'you' && v !== m && F.isRanged(v.weapon))[0];
    put(m, c.x, c.y); S.order = [m.id]; S.idx = 0; m.ap = m.apTurn; m.fat = 0; m.morale = 'Steady';
    F.spark(m, true);
    const v = foes[0]; put(v, c.x + 1, c.y + 1); v.armB = 10; v.hp = 300; v.ghost = false;
    const r0 = S.round, h0 = { hp: v.hp, arm: v.armB };
    T.burnTick(v);
    const tick = { hp: h0.hp - v.hp, arm: h0.arm - v.armB };
    let smoke = null;
    if (shooter) { put(shooter, c.x - 2, c.y); put(foes[1], c.x + 2, c.y); shooter.loaded = true;
      const h1 = F.hitChance(shooter, foes[1]); const keep = S.smoke; S.smoke = []; const h2 = F.hitChance(shooter, foes[1]); S.smoke = keep;
      smoke = { with: h1.chance, without: h2.chance, parts: h1.parts.indexOf('smoke') >= 0 }; }
    S.round = r0 + V.burn.rounds; const gone = !F.fireAt(c.x + 1, c.y + 1) && !F.smokeAt(c.x + 1, c.y + 1);
    res = { tick, gone, smoke };
  }
  const B = V.burn, t = res && res.tick, total = t ? t.hp + t.arm : 0;
  /* armour 10: the armour takes 10, a tenth straight through, the rest past the armour */
  leg(!!(res && total >= B.damage[0] && total <= B.damage[0] + B.damage[1] && t.arm === 10 && t.hp > 0 && res.gone && res.smoke && res.smoke.parts && (res.smoke.without - res.smoke.with === -V.smoke.hit_points || res.smoke.with <= 5)),
    'V8 THE GROUND: ending a turn on a burning tile costs On Fire\'s ' + B.damage[0] + ' to ' + B.damage[1] + ' (armour first, a tenth through); gone after ' + B.rounds + ' rounds; a shot through the smoke ' + V.smoke.hit_points + ' and says smoke',
    JSON.stringify(res));
}
/* V9 */
{
  let res = null;
  const crew = [{ background: 'companion_2hand', name: 'RAUL' }, { background: 'companion_1hand', name: 'DESI', gear: { acc: 'cell_vest_yard' } }, { background: 'companion_2hand', name: 'OSO' }];
  for (let sd = 3; sd < 60 && !res; sd++) {
    const run = seen => {
      const a = stage(sd, crew, ['brigand_thug']); if (!a.c) return null;
      const { F, S, T, c } = a, m = vestMan(S), p = S.units.filter(v => v.side === 'you' && !v.vest && !v.main)[0] || S.units.filter(v => v.side === 'you' && !v.vest)[0], e = S.units.filter(v => v.side === 'them')[0];
      put(m, c.x + 2, c.y); put(p, c.x - 2, c.y); put(e, c.x, c.y); e.ap = e.apTurn; e.fat = 0; e.morale = 'Steady';
      S.sparkSeen = seen ? { them: true, you: true } : {};
      const dz = T.sparkDanger(e, c.x + 1, c.y), dzP = T.sparkDanger(e, c.x - 1, c.y);
      S.order = [e.id]; S.idx = 0; let g = 0; while (F.current() === e && g < 20) { F.aiStep(e); g++; }
      const dm = Math.max(Math.abs(e.x - m.x), Math.abs(e.y - m.y)), dp = Math.max(Math.abs(e.x - p.x), Math.abs(e.y - p.y));
      return { dz, dzP, besideVest: dm === 1, besidePlain: dp === 1, at: [e.x, e.y] };
    };
    const before = run(false), after = run(true);
    if (before && after) res = { before, after };
  }
  leg(!!(res && res.before.dz === 0 && res.after.dz === V.fear.danger_per_vest && res.after.dzP === 0 && !res.after.besideVest && res.after.besidePlain),
    'V9 THE FEAR: once a side has seen one go off, the tiles beside a live vest cost its men ' + V.fear.danger_per_vest + ' and its club steps beside the man with no vest',
    JSON.stringify(res));
}
/* V10 */
{
  const a = stage(11), errs = [], mins = [], squeezes = [], switches = [];
  for (let k = 0; k < 12; k++) {
    try {
      const ctx = engine(), F = ctx.FIGHT; ctx.setSeed(8800 + k);
      F.setup({ auto: true, formation: null, company: CREW.concat([{ background: 'companion_ranged', name: 'LUZ', gear: { acc: 'cell_vest_scrap' } }]), cap: 4, days: 30, act: 1, party: { faction: 'brigands', count: 5, days: 30 } });
      const S = F.S; S.deploy = false; let g = 0;
      while (!S.over && g < 200000) { const u = F.current(); if (!u) break; F.aiStep(u); g++; }
      S.log.forEach(e => { if (e.t === 'spark') (e.how === 'switch' ? switches : squeezes).push(k); });
      let beats = 0, op = false, acted = false;
      S.log.forEach(e => { if (e.t === 'turn') { if (op) beats += acted ? 2 : 0.5; op = true; acted = false; } else if (/^(step|attack|reload|skill|spark)$/.test(e.t)) acted = true; });
      if (op) beats += acted ? 2 : 0.5; mins.push(beats / 120);
      if (!S.over) errs.push(k + ': never ended');
    } catch (e) { errs.push(k + ': ' + String(e && e.message).slice(0, 140)); }
  }
  /* climbed this turn, the squeeze is refused (rule 328) */
  const { F, S, T } = a, m = vestMan(S); let climbRefused = null;
  for (let y = 1; y < S.h - 1 && climbRefused === null; y++) for (let x = 1; x < S.w - 1 && climbRefused === null; x++) {
    if (!F.isRoof(x, y) || !T.passable(x, y)) continue;
    const foot = [[0, 1], [1, 0], [-1, 0], [0, -1]].map(o => ({ x: x + o[0], y: y + o[1] })).filter(o => T.passable(o.x, o.y) && !F.isRoof(o.x, o.y) && F.level(o.x, o.y) < F.level(x, y))[0];
    if (!foot) continue;
    put(m, foot.x, foot.y); S.order = [m.id]; S.idx = 0; m.ap = 40; m.fat = 0; m.morale = 'Steady';
    const can0 = F.canSpark(m); F.moveTo(m, x, y);
    climbRefused = can0 && F.climbedNow(m) && !F.canSpark(m);
  }
  const avg = mins.reduce((s, x) => s + x, 0) / Math.max(1, mins.length);
  leg(errs.length === 0 && squeezes.length === 0 && avg < 4 && climbRefused === true,
    'V10 AUTO NEVER SQUEEZES (the squeeze is his button); 12 fights on AUTO with a vest on a hire end, nothing threw, under 4 minutes; climbed this turn, the squeeze is refused (rule 328)',
    JSON.stringify({ errs: errs.slice(0, 3), squeezesByAuto: squeezes.length, switchesWentOff: switches.length, minutes: Math.round(avg * 10) / 10, climbRefused }));
}
console.log('\nTHE CELL VEST: ' + pass + '/' + (pass + fail));
process.exit(fail ? 1 : 0);
