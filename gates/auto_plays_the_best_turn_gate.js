#!/usr/bin/env node
/* AUTO PLAYS THE BEST TURN (COMBAT 6, rule 332, Paolo 11/2: 'are we going to let auto combat use abilities... two offhand items you
   can bring... a rifle and a melee weapon... I don't want AI to prioritize finding the mechanic, then the melee guy has to go straight
   for the mechanic and dodge through all the robots... the best course of action in that turn, to do the most damage and take the
   least damage within that turn... what happens if the character is out of stamina'). The brain is slices/BOHEMIA_FIGHT.html
   bestTurn (ours.auto_best_turn, the crew's switch best_turn); the round swing's three in front (rule 333) is weapon_shapes_gate's.

   Legs, headless on the live fight's rules:
   B1 THE RULE IS DATA: ours.auto_best_turn and ours.round_swing with source, quote and why; the crew's switch best_turn on;
   B2 A SWEEP WHEN ITS SUM BEATS THE BEST BLOW: his sledge man with three of theirs in Shatter's arc sweeps; with one he strikes;
   B3 THE BAG BOTH WAYS: a club man with a man of theirs out of his reach and in his pistol's range swaps to the pistol and shoots;
   B4 OUT OF STAMINA: a sweep that would leave him unable to swing next turn (their breath on him counted), nothing it drops: he
      takes the plain blow his breath carries; the same sweep on men it drops: he sweeps (a kill on offer always wins);
   B7 THE REST IS SCORED (ask line 334): his axeman one breath short of Round Swing with three lined up in front rests for next turn's
      swing exactly when that rest outscores every blow now (and at a high next_turn in the memory copy, he does);
   B5 NO LONG CHASE: a club man three tiles from a man of theirs standing with two more: he does not walk in (the old brain did);
   B6 IN THE FIGHTS: the probe's four kinds (wolves, raiders, robots, the act-one bosses), the same seeds, his brain against the one
      before it, both against their side's new brain (rule 332 amended: the same brain plays them): wins no fewer, his men down no more, fewer or as few long chases, abilities or swaps used, every kind under 4
      minutes on AUTO, nothing threw.
   Run: node gates/auto_plays_the_best_turn_gate.js [--n 8] */
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const NI = process.argv.indexOf('--n'), N = NI > 0 ? Number(process.argv[NI + 1]) : 8;
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb', f), 'utf8'));
const OURS = J('ours.json'), AI = J('ai.json'), WP = J('weapons.json');
const row = id => WP.rows.filter(r => r.id === id)[0];

/* B1 */
const has = r => !!(r && r.value && r.source && r.quote && r.why);
leg(has(OURS.auto_best_turn) && has(OURS.round_swing) && OURS.round_swing.value.on === true && OURS.round_swing.value.tiles === 3 && AI.archetypes.crew.value.best_turn === true,
  '*** B1 THE RULE IS DATA ***: ours.auto_best_turn, ours.round_swing (three tiles), the crew\'s switch best_turn',
  Object.keys(OURS.auto_best_turn.value).join(', '));

const ctx = engine(), F = ctx.FIGHT, T = F._t;
ctx.setSeed(5); F.setup({ kind: 'suburb', formation: null, deploy: false, flat: true, band: ['brigand_thug', 'brigand_thug', 'brigand_thug', 'brigand_thug'] });
const S = F.S, mine = S.units.filter(u => u.side === 'you'), theirs = S.units.filter(u => u.side === 'them');
const field = keep => { S.units.forEach(u => { u.fled = keep.indexOf(u) < 0; u.dead = false; u.down = false; u.netted = null; u.tauntedBy = null; }); S.over = false; S.focus = null; };
const arm = (u, id) => { const w = Object.assign({}, row(id)); u.weapon = w; const am = w.ammo ? String(w.ammo).match(/\d+/) : null; u.ammo = w.mag || (am ? Number(am[0]) : null); u.ammoMax = u.ammo; u.loaded = true; };
const turn = u => { S.order = [u.id].concat(S.units.filter(v => v !== u && !v.fled).map(v => v.id)); S.idx = 0; u.ap = u.apTurn; u.fat = 0; u.begun = true; u.morale = 'Steady'; u.turnLog = S.log.length; u.turnFrom = { x: u.x, y: u.y }; u.lastTurn = null; u.upRound = null; u.disarmed = false; u.stunned = false; };
const put = (u, x, y) => { u.x = x; u.y = y; };
const did = (u, L0) => S.log.slice(L0).filter(e => e.id === u.id && !e.free);
/* B2 */
{
  const m = mine[0], t = theirs.slice(0, 3);
  field([m].concat(t)); arm(m, 'two_handed_mallet'); m.bag = []; m.perks = []; turn(m);
  put(m, 10, 6); put(t[0], 11, 6); put(t[1], 11, 5); put(t[2], 10, 5); t.forEach(u => { u.hp = u.hpMax = 60; u.armB = 0; u.armH = 0; });
  let L0 = S.log.length; F.aiStep(m); const three = did(m, L0).filter(e => e.t === 'attack')[0];
  field([m, t[0]]); turn(m); put(m, 10, 6); put(t[0], 11, 6);
  L0 = S.log.length; F.aiStep(m); const one = did(m, L0).filter(e => e.t === 'attack')[0];
  leg(!!three && three.skill === 'Shatter' && !!one && one.skill !== 'Shatter',
    '*** B2 A SWEEP WHEN ITS SUM BEATS THE BEST BLOW ***: his sledge man with three of theirs in the arc swings Shatter, with one a plain blow',
    'three: ' + (three ? three.skill || 'a plain blow' : 'nothing') + '; one: ' + (one ? one.skill || 'a plain blow' : 'nothing') + '; weighed ' + JSON.stringify(m.btLast || []));
}
/* B3 */
{
  const m = mine[1], t = theirs[0];
  field([m, t]); arm(m, 'bludgeon'); m.bag = [F._t.pistolShot(row('dagger')) || row('dagger')]; m.bagState = []; m.perks = []; m.shield = null; turn(m);
  put(m, 6, 6); put(t, 10, 6); t.hp = t.hpMax = 60;   /* four tiles: past a club's walk and blow (3 tiles, 6 AP, then 4), inside the pistol's 4 */
  const L0 = S.log.length; let g = 0; while (F.current() === m && g++ < 12) F.aiStep(m);
  const ev = did(m, L0), sw = ev.filter(e => e.t === 'swap')[0], shot = ev.filter(e => e.t === 'attack' && e.shot)[0];
  leg(!!sw && !!shot, '*** B3 THE BAG BOTH WAYS ***: a club man, a man of theirs out of his reach and in his pistol\'s range: he swaps to the pistol and shoots ("a rifle and a melee weapon")',
    ev.map(e => e.t + (e.to ? ' ' + e.to : '')).join(', ') + '; weighed ' + JSON.stringify(m.btLast || []));
}
/* B4: his sledge man beside three of theirs, his breath such that Shatter (30) leaves him unable to swing next turn once their blows
   put their breath on him, while a plain Smite (15) does not */
{
  const m = mine[2], t = theirs.slice(0, 3);
  const set = (hp) => { field([m].concat(t)); arm(m, 'two_handed_mallet'); m.bag = []; m.perks = []; turn(m); put(m, 10, 6); put(t[0], 11, 6); put(t[1], 11, 5); put(t[2], 10, 5);
    t.forEach(u => { u.hp = u.hpMax = hp; u.armB = hp > 1 ? 300 : 0; u.armH = 0; u.weapon = Object.assign({}, row('woodcutter_s_axe')); });
    const sk = F.sweepSkill(m.weapon, 'Shatter'), sw = T.skillFat(m, sk), sf = T.skillFat(m, F.strikeSkill(m.weapon));
    const back = ctx.DB.rules.fatigue.recovery_per_turn.value, them = OURS.fatigue_from_them_between_turns.value, top = F.fatMax(m);
    m.fat = top - sw;   /* Shatter is affordable now and leaves him at his most: less the 15 back, plus theirs, no blow next turn */
    return { sw, sf, back, them, top, fat: m.fat }; };
  const n1 = set(999); let L0 = S.log.length, g = 0; while (F.current() === m && g++ < 12) F.aiStep(m);
  const ev1 = did(m, L0).filter(e => e.t === 'attack'), plain = ev1.every(e => e.skill !== 'Shatter') && (ev1.length > 0 || /^rests/.test(m.btSay || ''));   /* the plain blow, or (ask line 334) the rest for next turn's sweep */
  set(1); L0 = S.log.length; g = 0; while (F.current() === m && g++ < 12) F.aiStep(m);
  const ev2 = did(m, L0).filter(e => e.t === 'attack' && !e.sweep), kill = ev2.some(e => e.skill === 'Shatter');
  leg(plain && kill, '*** B4 OUT OF STAMINA ***: a sweep that would leave him unable to swing next turn and drops nobody is not swung (he takes the blow his breath can carry, or rests for next turn\'s sweep); the same sweep that drops them is (a kill on offer always wins)',
    JSON.stringify(n1) + '; no kill: ' + (ev1.map(e => e.skill || 'blow').join(', ') || m.btSay || 'held') + '; a kill on offer: ' + (ev2.map(e => e.skill || 'blow').join(', ') || 'nothing'));
}
/* B7: THE REST IS SCORED (rule 332 amended, ask line 334: 'taking a breath so you can make a triple swing next turn'): his axeman
   with three of theirs lined up in front, his breath one short of Round Swing; struck now he is still short next turn, rested (30
   back) he swings on all three. The rest is an option like the rest: nothing now plus next_turn x the swing, against the blow now
   plus next_turn x the blow next turn. Leg: he rests exactly when that rest outscores every blow, and both are said (the record
   carries this worked example: with Battle Brothers' greataxe and rule 333's three tiles the swing on three is worth under the
   1 + 1/next_turn plain blows a rest needs, so he swings the axe now; raise next_turn to 1 in the memory copy and the bar drops) */
{
  const m = mine[1], t = theirs.slice(0, 3), D0 = OURS.auto_best_turn.value.next_turn;
  const play = D => {
    ctx.DB.ours.auto_best_turn.value.next_turn = D;
    field([m].concat(t)); arm(m, 'greataxe'); m.bag = []; m.perks = []; turn(m); put(m, 10, 6); put(t[0], 11, 6); put(t[1], 11, 5); put(t[2], 11, 7);
    t.forEach(u => { u.hp = u.hpMax = 999; u.armB = 300; u.armH = 0; u.weapon = Object.assign({}, row('woodcutter_s_axe')); });
    const rsw = F.sweepSkill(m.weapon, 'Round Swing'), sw = T.skillFat(m, rsw), top = F.fatMax(m);
    m.fat = top - sw + 1; m.btLast = null;   /* one short of the swing now; the blow then the 15 back leave him one short next turn too */
    const L0 = S.log.length; let g = 0, weighed = null; while (F.current() === m && g++ < 12) { F.aiStep(m); weighed = weighed || m.btLast; }
    const ev = did(m, L0), rested = !ev.some(e => e.t === 'attack');
    const vals = (weighed || []).map(x => ({ k: x.split(' ')[0], v: Number(x.split(' ')[1].split('/')[0]) }));
    const restV = (vals.filter(x => x.k === 'rest')[0] || {}).v, bestV = Math.max.apply(null, vals.filter(x => x.k !== 'rest' && x.k !== 'hold').map(x => x.v).concat([-Infinity]));
    return { D: D, rested: rested, restV: restV, bestV: bestV, say: m.btSay || '', ok: restV !== undefined && rested === (restV > bestV) };
  };
  const a = play(D0), b = play(3);
  ctx.DB.ours.auto_best_turn.value.next_turn = D0;
  leg(a.ok && b.ok && b.rested, '*** B7 THE REST IS SCORED ***: one breath short of Round Swing with three lined up in front, he rests for next turn\'s swing exactly when the rest outscores every blow now (at next_turn ' + D0 + ' and, in the memory copy, at 3: there he rests)',
    JSON.stringify([a, b]));
}
/* B5 */
{
  const m = mine[0], t = theirs.slice(0, 3);
  const play = on => {
    ctx.DB.ai.archetypes.crew.value.best_turn = on;
    field([m].concat(t)); arm(m, 'woodcutter_s_axe'); m.bag = []; m.perks = []; turn(m);
    put(m, 6, 6); put(t[0], 10, 6); put(t[1], 11, 5); put(t[2], 11, 7); t.forEach(u => { u.hp = u.hpMax = 999; u.armB = 200; u.weapon = Object.assign({}, row('woodcutter_s_axe')); });
    const L0 = S.log.length; let g = 0; while (F.current() === m && g++ < 12) F.aiStep(m);
    return { steps: did(m, L0).filter(e => e.t === 'step').length, at: m.x + ',' + m.y };
  };
  const old = play(false), now = play(true); ctx.DB.ai.archetypes.crew.value.best_turn = true;
  leg(now.steps < OURS.auto_best_turn.value.chase_tiles || T.longChase(m, m.x, m.y, 0) === false,
    '*** B5 NO LONG CHASE ***: three tiles from a man of theirs who stands with two more, nothing to drop: he does not walk into their three clubs (the player plans that)',
    'now ' + now.steps + ' steps to ' + now.at + '; the brain before: ' + old.steps + ' steps to ' + old.at);
}
/* B6 */
{
  const probe = path.join(ROOT, 'tools/bohemia_combat_auto_best_turn_probe_11_2_26.js');
  const run = extra => { const out = execFileSync('node', [probe, '--n', String(N)].concat(extra), { cwd: ROOT, maxBuffer: 1 << 26, timeout: 1200000 }).toString();
    const r = {}; out.split('\n').forEach(l => { const m = l.match(/^(\w+) (\{.*\})$/); if (m) r[m[1]] = JSON.parse(m[2]); }); return r; };
  let now = {}, old = {}, err = null;
  try { now = run([]); old = run(['--old-his']); } catch (e) { err = String(e.message).slice(0, 200); }   /* both arms against their new brain (ask line 334) */
  const K = Object.keys(now), sum = (r, k) => Object.keys(r).reduce((s, x) => s + r[x][k], 0);
  const errs = K.reduce((s, k) => s + now[k].errors.length, 0);
  const ok = !err && K.length === 4 && sum(now, 'won') >= sum(old, 'won') && sum(now, 'his_men_down') <= sum(old, 'his_men_down') && sum(now, 'long_chases') <= sum(old, 'long_chases')
    && sum(now, 'abilities') + sum(now, 'swaps') > 0 && K.every(k => now[k].minutes_on_auto < 4) && errs === 0;
  leg(ok, '*** B6 IN THE FIGHTS ***: ' + N + ' fights a kind on the same seeds: wins no fewer, his men down no more, long chases no more, abilities or swaps used, under 4 minutes, nothing threw',
    err || ('won ' + sum(now, 'won') + ' (before ' + sum(old, 'won') + '), down ' + sum(now, 'his_men_down') + ' (' + sum(old, 'his_men_down') + '), long chases ' + sum(now, 'long_chases') + ' (' + sum(old, 'long_chases') + '), abilities ' + sum(now, 'abilities') + ' (' + sum(old, 'abilities') + '), swaps ' + sum(now, 'swaps') + ' (' + sum(old, 'swaps') + '), minutes ' + K.map(k => k + ' ' + now[k].minutes_on_auto).join(', ') + ', errors ' + errs));
}
console.log('AUTO PLAYS THE BEST TURN: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
