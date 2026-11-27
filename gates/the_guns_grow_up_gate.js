#!/usr/bin/env node
/* THE GUNS GROW UP (ARMORY 3, Paolo 11/27, VAMILY rules 489(b) and 490, ask rows 758, 762, 763: 'we haven't even added automatic guns
   or more intense guns, maybe even a rocket launcher... I'm not even seeing any drones'; 'the drone maybe doesn't explode and move the
   same turn, and it's possible to escape from it, but an explosion from a drone is gonna be damn near a one KO for most people').
   records/BOHEMIA_ARMORY_THREE_THE_GUNS_GROW_UP_AND_THE_DRONE_11_27_26.md.

   Holds, through the fight's own rules (tools/bohemia_fight_headless.js, the page's scripts unchanged):
     DATA    the sixteen pieces are weapon rows of armory.json, each between two Battle Brothers rows, each one hand or two (rule 477),
             each gun's rounds in ours.gun_rounds (rule 478); THE OLD GUNS' DAMAGE IS UNTOUCHED (rule 489(d))
     SEMI    a magazine: two shots a turn, no reload between, none at an empty magazine until it is reloaded whole
     BURST   one press, 'burst' rounds at one man, each its own roll, each after the first armory_fire.burst harder; the press stops
             when he falls
     BELT    the traverse: the man and the tile each side of him across the line, straight and diagonal; six rounds, each man twice
     ROCKET  the blast: the tile and its eight, the other side only, one round, the handgonne's reload
     DRONE   it never lands the turn it flies; it lands at its operator's next turn on whoever is still on the cross, either side; a
             man who steps off walks away whole; shot down it never lands; its operator dropped, it falls; a melee man has no shot at
             it; a shotgun's chance is the surest; one in the air a man; a bare man is struck down every time, heavy armour may live
     SPOT    his side sees every man of theirs and its shots at them land easier, for its turns
     SIGHT   at night the night sight's shot at a man in the dark is the dark's cut surer; the heat sight's through smoke
     STOCK   a rocket costs the stock its own rounds; a drone is never refilled
     AUTO    real fights, both sides on AUTO, drones and bursts in their hands: nothing throws, drones fly, some are shot down, men
             step off the cross
   node gates/the_guns_grow_up_gate.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (c, n, why) => { c ? pass++ : fail++; console.log('  ' + (c ? 'ok  ' : 'FAIL') + ' ' + n + (why ? '  [' + why + ']' : '')); };
const t0 = Date.now();

const ctx = engine(), F = ctx.FIGHT, DB = ctx.DB, T = F._t;
const R = k => { const p = k.split('.'); const o = DB[p[0]][p[1]]; return o && o.value !== undefined ? o.value : o; };
const row = id => DB.weapons.rows.find(r => r.id === id);
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/armory.json'), 'utf8'));
const NEW = SPEC.weapons.filter(s => s.fire || s.worn_of || ['pipe_shotgun'].indexOf(s.id) >= 0).map(s => s.id);   /* round two (11/27): the worn and the double too */
const AF = R('ours.armory_fire'), G = R('ours.gun_rounds');

/* ---------------- DATA ---------------- */
const rows = NEW.map(row);
leg(NEW.length >= 23 && rows.every(Boolean) && rows.every(r => r.armory && r.armory.between && r.armory.between.length === 2),
  'the pieces (sixteen, then six worn and the double) are weapon rows of armory.json, each between two Battle Brothers rows', NEW.length + ': ' + NEW.join(', '));
const hands = r => r.hands ? r.hands | 0 : (/^(bow|crossbow|firearm)$/.test(r.class) ? 2 : 1);
leg(rows.every(r => hands(r) === 1 || hands(r) === 2) && ['switched_pistol', 'box_smg', 'pipe_smg', 'charge_drone', 'scout_drone'].every(id => hands(row(id)) === 1) && ['belt_fed', 'rocket_launcher', 'ranch_ar'].every(id => hands(row(id)) === 2),
  'each says one hand or two (rule 477): the pistols, the SMGs and the drone kits (launched off the palm) one, the long guns, the belt and the rockets two', rows.map(r => r.id + ' ' + hands(r) + 'H').join(', '));
const withRounds = SPEC.weapons.filter(s => s.fire && s.fire.rounds);
leg(withRounds.every(s => G.by_id[s.id] === s.fire.rounds) && (G.consumable || []).indexOf('charge_drone') >= 0 && G.per_shot_by_id.rocket_launcher > G.stock.per_shot,
  "every gun's rounds are in ours.gun_rounds (rule 478): what it carries, a rocket's dear refill, a drone kit never refilled", withRounds.map(s => s.id + ' ' + G.by_id[s.id]).join(', '));
const OLD = { zip_gun: [15, 30], snub_revolver: [20, 35], lever_rifle: [35, 55], scoped_deer_rifle: [45, 65], sawed_off: [35, 65], pump_shotgun: [45, 75], knife: [15, 25], dagger: [15, 35], light_crossbow: [30, 50], crossbow: [40, 60], heavy_crossbow: [50, 70], handgonne: [35, 75], bundle_of_javelins: [30, 45] };
const moved = Object.keys(OLD).filter(id => { const r = row(id); return !r || r.damage_min !== OLD[id][0] || r.damage_max !== OLD[id][1]; });
leg(!moved.length, "*** THE OLD GUNS' DAMAGE IS UNTOUCHED *** (rule 489(d): damage waits on him)", moved.length ? 'moved: ' + moved.join(', ') : Object.keys(OLD).length + ' rows as they were');

/* ---------------- ROUND TWO (rule 490(e): makes, worn and homemade versions, each told apart in his hands) ---------------- */
const worn = SPEC.weapons.filter(s => s.worn_of), wornBad = [];
worn.forEach(s => { const r = row(s.id), b = row(s.worn_of); if (!r || !b) return wornBad.push(s.id + ' missing');
  const hb = x => { const k = (x.shot_skill ? [x.shot_skill] : x.skills).find(q => !/^Reload/.test(q.name)); return k && k.hit_bonus; };
  if (r.damage_min !== b.damage_min || r.damage_max !== b.damage_max) wornBad.push(s.id + ' damage moved');
  if (hb(r) !== hb(b) + s.worn.hit) wornBad.push(s.id + ' hit ' + hb(r) + ' against ' + hb(b));
  if (!(r.value < b.value)) wornBad.push(s.id + ' not cheaper');
  if (r.burst !== b.burst || r.mag !== b.mag || G.by_id[s.id] !== G.by_id[s.worn_of]) wornBad.push(s.id + ' fires otherwise'); });
leg(worn.length >= 6 && !wornBad.length, "WORN: a beat-up gun is its gun, the same damage (rule 489(d)) and the same fire, its shot harder to land and its price lower",
  wornBad.length ? wornBad.join('; ') : worn.map(s => s.id + ' ' + Math.round(row(s.id).value / 10) + ' of ' + Math.round(row(s.worn_of).value / 10)).join(', '));
const OG = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_rig/own_guns.json'), 'utf8')), ogBad = [];
SPEC.weapons.forEach(s => { const g = s.own_gun || (s.worn_of && (SPEC.weapons.find(x => x.id === s.worn_of) || {}).own_gun); if (!g) return;
  if (OG.by_row[s.id] !== g || !OG.guns[g]) ogBad.push(s.id); });
leg(!ogBad.length && ['switched_pistol', 'pipe_smg', 'pipe_shotgun', 'auto_shotgun', 'night_sight_ar', 'thermal_rifle', 'double_shotgun'].every(id => OG.by_row[id]),
  "TOLD APART IN HIS HANDS: a piece whose own_gun names one of COOK's own guns is drawn as that gun (the service pistol, the zip gun, the sawed-off's two barrels, the pump, the scoped rifle)",
  ogBad.length ? 'unmapped: ' + ogBad.join(', ') : Object.keys(OG.by_row).filter(k => NEW.indexOf(k) >= 0).map(k => k + ' -> ' + OG.by_row[k]).join(', '));

/* ---------------- a board ---------------- */
ctx.setSeed(3);
F.setup({ seed: 3, kind: 'strip', auto: true, formation: null, party: { faction: 'brigands', count: 4, days: 1 } });
const S = F.S, a = S.units.find(u => u.side === 'you'), them = S.units.filter(u => u.side === 'them');
function arm(u, id) { const w = row(id), ps = T.pistolShot(w); u.weapon = ps || w; const am = u.weapon.ammo ? String(u.weapon.ammo).match(/\d+/) : null; u.ammo = am ? +am[0] : null; u.loaded = true; u.rounds = null; }
function fresh(id, offs) {
  arm(a, id); a.ap = a.apTurn = 9; a.fat = 0; a.rskill = 70; a.morale = 'Steady'; a.dead = a.down = a.fled = false; a.hp = a.hpMax = 60; a.disarmed = false;
  them.forEach((t, i) => { const o = offs[i] || [9, 9 - i]; t.hp = t.hpMax = 900; t.armB = t.armH = 0; t.x = a.x + o[0]; t.y = a.y + o[1]; t.dead = t.down = t.fled = false; t.morale = 'Steady'; t.immune = []; t.rdef = 0; });
  S.order = [a.id].concat(them.map(t => t.id)); S.idx = 0; S.over = false; S.drones = []; S.spot = {}; S.night = false; S.smoke = [];
}
const atk = n0 => S.log.slice(n0).filter(e => e.t === 'attack');

/* ---------------- SEMI ---------------- */
fresh('ranch_ar', [[3, 0]]);
let n0 = S.log.length; const s1 = F.strike(a, them[0]), s2 = F.strike(a, them[0]), s3 = F.strike(a, them[0]);
const semiTwo = !!s1 && !!s2 && !s3 && atk(n0).length === 2 && a.ammo === 28;
a.ap = 9; a.ammo = 0; const dryNo = !F.canStrike(a, them[0]); const rl = F.reload(a); const back = a.ammo === 30;
leg(semiTwo && dryNo && rl && back, 'SEMI: a magazine fires two shots a turn with no reload between (Quick Shot, 4 AP); empty it cannot fire; RELOAD fills it whole',
  'two shots ' + semiTwo + ', 30 -> 28; empty refused ' + dryNo + '; reloaded to ' + a.ammo);

fresh('double_shotgun', [[2, 0]]);
n0 = S.log.length; const d1 = F.strike(a, them[0]), d2 = F.strike(a, them[0]), d3 = F.strike(a, them[0]);
leg(!!d1 && !!d2 && !d3 && a.ammo === 0 && F.reloadSkill(a.weapon) && T.skillAP(a.weapon, F.reloadSkill(a.weapon), a) === 9,
  'THE DOUBLE: two blasts, then it is open and loaded (the handgonne\'s 9 AP)', 'two blasts ' + (!!d1 && !!d2) + ', a third refused ' + !d3 + ', shells left ' + a.ammo);

/* ---------------- BURST ---------------- */
fresh('guard_carbine', [[3, 0]]);
n0 = S.log.length; F.strike(a, them[0], { roll: 100, all: { roll: 100 } });
const b3 = atk(n0), ch = b3.map(e => e.chance);
leg(b3.length === 3 && b3.every(e => e.to === them[0].id) && a.ammo === 27 && ch[0] - ch[1] === AF.burst.recoil_per_round && ch[1] - ch[2] === AF.burst.recoil_per_round,
  'BURST: one press of the Guard Carbine, three rounds at one man, each its own roll, each after the first ' + AF.burst.recoil_per_round + ' harder', b3.length + ' rolls at ' + ch.join('/') + '%, magazine 30 -> ' + a.ammo);
fresh('box_smg', [[2, 0]]); them[0].hp = 5;
n0 = S.log.length; F.strike(a, them[0], { roll: 1, head: false, base: 40 });
leg(atk(n0).length === 1 && a.ammo === 29, 'BURST: the press stops when the man falls (the rounds are kept)', atk(n0).length + ' round fired, magazine 30 -> ' + a.ammo);

/* ---------------- BELT ---------------- */
const sk = n => ({ name: n }), P = (x, y) => ({ x, y }), same = (p, q) => p.length === q.length && p.every(z => q.some(w => w.x === z.x && w.y === z.y));
const A0 = { x: 10, y: 6 };
const straight = F.shapeTiles(A0, P(13, 6), sk('Traverse')), diag = F.shapeTiles(A0, P(12, 8), sk('Traverse')), blast = F.shapeTiles(A0, P(13, 6), sk('Fire Rocket'));
const crossLit = F.shapeTiles(A0, P(14, 6), sk('Launch Drone'));
leg(same(crossLit, [P(14, 6), P(15, 6), P(13, 6), P(14, 7), P(14, 5)]),
  "THE DRONE'S CROSS IS ITS SHAPE: his own launch lights the man's tile and the four beside it before he taps (the tiles it will land on)", crossLit.map(q => q.x + ',' + q.y).join(' '));
leg(same(straight, [P(13, 6), P(13, 5), P(13, 7)]) && same(diag, [P(12, 8), P(11, 9), P(13, 7)]),
  "BELT: the traverse is the man and the tile each side of him across the line of fire, straight and diagonal (Paolo: 'a machine gun is comparable to a greatsword')", straight.map(q => q.x + ',' + q.y).join(' ') + ' | ' + diag.map(q => q.x + ',' + q.y).join(' '));
fresh('belt_fed', [[3, -1], [3, 0], [3, 1]]);
n0 = S.log.length; F.strike(a, them[1], { roll: 100, all: { roll: 100 } });
const bl = atk(n0), per = {}; bl.forEach(e => { per[e.to] = (per[e.to] || 0) + 1; });
leg(bl.length === 6 && Object.keys(per).length === 3 && Object.values(per).every(n => n === 2) && a.ammo === 94,
  'BELT: one press, six rounds, each of the three men rolled twice', JSON.stringify(per) + ', belt 100 -> ' + a.ammo);

/* ---------------- ROCKET ---------------- */
fresh('rocket_launcher', [[4, 0], [5, 1], [5, -1], [6, 0]]);
const mate = S.units.find(u => u.side === 'you' && u !== a); if (mate) { mate.x = a.x + 4; mate.y = a.y + 1; }
n0 = S.log.length; F.strike(a, them[0], { roll: 1, all: { roll: 1 } });
const rk = atk(n0), hitIds = rk.map(e => e.to);
leg(blast.length === 9 && rk.length === 3 && hitIds.indexOf(them[3].id) < 0 && !(mate && hitIds.indexOf(mate.id) >= 0) && !a.loaded && T.skillAP(a.weapon, F.reloadSkill(a.weapon), a) === 9,
  "ROCKET: the blast is the tile and its eight (the Fire Pot's), the other side only (rule 117), one round, the handgonne's 9 AP reload",
  blast.length + ' tiles; struck ' + rk.length + ' (the man two off untouched, his own man passed over); loaded ' + a.loaded);
if (mate) { mate.x = 0; mate.y = 0; }

/* ---------------- DRONE ---------------- */
function launchAt(target, opId) {
  const op = them[0]; arm(op, 'charge_drone'); op.ap = 9; op.fat = 0; op.x = target.x + 5; op.y = target.y; op.dead = op.down = op.fled = false; op.morale = 'Steady'; op.hp = 900;
  S.order = [op.id, a.id]; S.idx = 0; op.begun = true; S.drones = [];
  const k0 = S.log.length, q = F.strike(op, target);
  return { op, q, hitNow: atk(k0).length, d: S.drones[0] };
}
function landNow(op) { S.order = [op.id, a.id]; S.idx = 0; op.begun = true; const k0 = S.log.length; T.beginTurn(op); return S.log.slice(k0); }
fresh('kalash', []); a.armB = 0; a.hp = a.hpMax = 60; them.slice(1).forEach(t => { t.x = 0; t.y = 0; });
let L = launchAt(a);
const noBlowNow = L.q && L.q.drone && L.hitNow === 0 && a.hp === 60 && !F.canStrike(L.op, a);
let ev = landNow(L.op);
const landed = ev.some(e => e.t === 'skill' && e.skill === 'drone_lands') && a.hp <= 0;
leg(noBlowNow && landed, "DRONE: it never lands the turn it flies (rule 490(a)); one in the air a man; at the operator's next turn it lands on the man still on its cross",
  'launch: ' + L.hitNow + ' blows, his health 60, a second launch refused ' + !F.canStrike(L.op, a) + '; landed: health ' + a.hp);
fresh('kalash', []); a.armB = 0; a.hp = a.hpMax = 60; them.slice(1).forEach(t => { t.x = 0; t.y = 0; });
L = launchAt(a); a.x += 1; a.y += 1; ev = landNow(L.op);
leg(a.hp === 60 && ev.some(e => e.skill === 'drone_lands' && e.n === 0), 'DRONE: a man who steps off the cross (a diagonal step) walks away whole', 'health ' + a.hp);
fresh('auto_shotgun', []); them.slice(1).forEach(t => { t.x = 0; t.y = 0; });
L = launchAt(a); S.order = [a.id, L.op.id]; S.idx = 0; a.ap = 9;
const shotCh = F.droneChance(a, L.d); arm(a, 'kalash'); const rifleCh = F.droneChance(a, L.d); arm(a, 'auto_shotgun');
const can = F.canShootDrone(a, L.d); let downs = 0; for (let i = 0; i < 40 && !downs; i++) { a.ap = 9; a.fat = 0; a.ammo = 7; S.drones = [L.d]; const r = F.shootDrone(a, L.d); if (r && r.hit) downs++; }
ev = landNow(L.op);
leg(can && downs === 1 && !S.drones.length && !ev.some(e => e.skill === 'drone_lands') && shotCh - rifleCh >= AF.drone.shoot_down.shotgun_bonus - 15,
  'DRONE: a gun shoots it out of the air and it never lands; a shotgun is the surest (the Ukrainian finding)', 'shotgun ' + shotCh + '% against the Kalash ' + rifleCh + '%');
fresh('pawn_katana', []); them.slice(1).forEach(t => { t.x = 0; t.y = 0; });
L = launchAt(a); S.order = [a.id, L.op.id]; S.idx = 0; a.ap = 9;
const melee = !F.canShootDrone(a, L.d);
L.op.hp = 0; L.op.dead = true; a.begun = false; T.beginTurn(a); const fell = !S.drones.length && S.log.slice(-8).some(e => e.skill === 'drone_falls');
leg(melee && fell, 'DRONE: a melee man has no shot at it (rule 490(d)); its operator dropped, it falls (490(c))', 'katana shot ' + !melee + ', fell ' + fell);
const lethal = {};
for (const ar of [0, 180]) { let down = 0; for (let i = 0; i < 200; i++) { fresh('kalash', []); them.slice(1).forEach(t => { t.x = 0; t.y = 0; }); a.armB = ar; a.hp = a.hpMax = 60; a.nineUsed = true; L = launchAt(a); S.coverCount[a.y][a.x] = 0; landNow(L.op); if (a.hp <= 0) down++; } lethal[ar] = Math.round(down / 2); }
leg(lethal[0] === 100 && lethal[180] < 60, "DRONE: if it lands it is close to one hit (rule 490(b)): a bare 60-health man struck down every time; heavy armour may live",
  'bare ' + lethal[0] + '%, road-sign riot armour (180) ' + lethal[180] + '%, 200 landings each');

/* ---------------- SPOT ---------------- */
fresh('scout_drone', [[7, 0]]); S.night = true;
const before = them.filter(t => F.sideSees('you', t)).length;
F.strike(a, them[0]);
const after = them.filter(t => F.sideSees('you', t)).length, mate2 = S.units.find(u => u.side === 'you' && u !== a);
let sp = false; if (mate2) { arm(mate2, 'ranch_ar'); mate2.rskill = 60; const c = F.hitChance(mate2, them[0]); sp = c.parts.indexOf('spotted') >= 0; }
a.begun = false; for (let i = 0; i < AF.spot.turns; i++) T.beginTurn(a);
leg(after === them.length && sp && !F.spotted('you'), 'SPOT: the scout drone up, his side sees every man of theirs, its shots at them say SPOTTED; it comes down after its turns',
  'seen ' + before + ' -> ' + after + ' of ' + them.length + '; spotted on the chance ' + sp + '; after ' + AF.spot.turns + ' turns ' + F.spotted('you'));

/* ---------------- SIGHT ---------------- */
fresh('night_sight_ar', [[3, 0]]); S.night = true; S.lit = null;
const cNight = F.hitChance(a, them[0]).chance; a.weapon = Object.assign({}, a.weapon, { sight: undefined }); const cNo = F.hitChance(a, them[0]).chance;
fresh('thermal_rifle', [[4, 0]]); S.smoke = [{ x: a.x + 2, y: a.y, until: S.round + 3 }];
const sOn = F.hitChance(a, them[0]); a.weapon = Object.assign({}, a.weapon, { sight: undefined }); const sOff = F.hitChance(a, them[0]);
leg(cNight > cNo && sOn.parts.indexOf('smoke') < 0 && sOff.parts.indexOf('smoke') >= 0,
  "SIGHT: at night the night sight's shot at a man in the dark is surer than the same gun's without; the heat sight shoots through the smoke",
  'night ' + cNo + '% -> ' + cNight + '%; smoke ' + sOff.chance + '% -> ' + sOn.chance + '%');

/* ---------------- STOCK ---------------- */
const store = {}; const ls = { getItem: k => store[k] === undefined ? null : store[k], setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
const ctx2 = engine({ extra: { localStorage: ls } }), F2 = ctx2.FIGHT;
store['bohemia.supplies.v1'] = JSON.stringify({ rounds: 100 });
ctx2.setSeed(4);
F2.setup({ seed: 4, kind: 'strip', auto: true, formation: null, company: [{ name: 'YOU', main: true, background: 'sellsword', level: 3, perks: [], marks: [], gear: { main: 'rocket_launcher', off: null, body: null, head: null, bag: ['charge_drone', null] } }], party: { faction: 'brigands', count: 1, days: 1 } });
const me = F2.S.units.find(u => u.side === 'you'); me.rounds = 0; if (me.bagState && me.bagState[0]) me.bagState[0].rounds = 0;
F2.S.over = true; const st = F2.settleRounds();
const rocket = st && st.men[0] && st.men[0].guns.find(g => g.id === 'rocket_launcher'), drone = st && st.men[0] && st.men[0].guns.find(g => g.id === 'charge_drone');
leg(rocket && rocket.filled === 2 && st.stockAfter === 100 - 2 * G.per_shot_by_id.rocket_launcher && drone && drone.filled === 0,
  "STOCK: a rocket costs the company's rounds its own price (" + G.per_shot_by_id.rocket_launcher + " a rocket); a drone kit is never refilled (Battle Brothers' throwable items)",
  st ? 'rockets ' + (rocket && rocket.filled) + ', stock 100 -> ' + st.stockAfter + ', drones refilled ' + (drone && drone.filled) : 'no settle');

/* ---------------- AUTO ---------------- */
const kits = [['belt_fed', 'charge_drone', 'kalash', 'auto_shotgun'], ['switched_pistol', 'rocket_launcher', 'guard_carbine', 'scout_drone'], ['box_smg', 'pipe_smg', 'printed_carbine', 'night_sight_ar'], ['throwaway_rocket', 'thermal_rifle', 'ranch_ar', 'pipe_shotgun']];
const tally = {}; let errs = [], fights = 0;
for (let seed = 1; seed <= 8; seed++) {
  const company = kits[seed % kits.length].map((id, i) => ({ name: 'M' + i, main: i === 0, background: 'sellsword', level: 4, perks: [], marks: [], gear: { main: id, off: null, body: 'riot_gear_jacket', head: 'football_helmet', bag: [null, null] } }));
  try {
    ctx.setSeed(seed);
    F.setup({ seed, kind: 'strip', auto: true, formation: null, company, party: { faction: 'brigands', count: 6, days: 20 } });
    const th = F.S.units.filter(u => u.side === 'them'); arm(th[0], 'charge_drone'); if (seed % 2) arm(th[1], 'belt_fed');
    let g = 0; while (!F.S.over && g < 20000) { const u = F.current(); if (!u) break; F.aiStep(u); g++; }
    fights++;
    F.S.log.forEach(e => { const k = e.t === 'skill' ? e.skill + (e.skill === 'drone_lands' ? (e.n ? '_on_men' : '_on_nobody') : '') : e.t === 'attack' && e.skill ? 'attack:' + e.skill : null; if (k) tally[k] = (tally[k] || 0) + 1; });
  } catch (e) { errs.push(seed + ': ' + String(e.message).slice(0, 120)); }
}
leg(!errs.length && fights === 8 && tally.drone_launch > 0 && tally.drone_down > 0 && tally.drone_lands_on_nobody > 0 && tally.burst > 0 && tally['attack:Traverse'] > 0,
  'AUTO: eight real fights, both sides on AUTO, drones and bursts in their hands: nothing throws; drones fly, are shot down, and men step off the cross',
  errs.length ? errs.join('; ') : JSON.stringify(tally));

console.log('THE GUNS GROW UP: ' + pass + ' passed, ' + fail + ' failed (' + Math.round((Date.now() - t0) / 1000) + ' s)');
process.exit(fail ? 1 : 0);
