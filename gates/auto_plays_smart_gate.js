#!/usr/bin/env node
/* HEIGHT IS ACCURACY, NEVER A WALL, AND AUTO PLAYS SMART (COMBAT 4, rules 321 and 322, Paolo 11/2; ask lines 318 and 319):
   'each story, from one to two to three, depending how high it is, doesn't mean the character next to you can't melee, it's just
   accuracy... a wolf somehow ended up on top of a roof and my main guy couldn't hit him... it's not that you can never hit him,
   it's just more inaccurate'; 'with auto combat you want the characters to get into places where they have the ability to hit
   the enemy... my sniper, my rifle character, ends his turn without trying to get to the best point of view'.
   records/BOHEMIA_COMBAT_HEIGHT_IS_ACCURACY_AND_AUTO_PLAYS_SMART_11_2_26.md.
   Legs, headless on the live fight's rules:
   H1 THE RULING IS DATA: ours.height_is_accuracy (melee and the ring across any storey, a storey's points both ways), ours.climbers
      and ours.auto_finds_a_shot each carry a source, his words and the why; the library's own rows stay as Battle Brothers wrote them;
   H2 ACROSS THREE STOREYS: a club on the street beside a man three storeys up can strike him and holds him in his ring, and the
      storeys move only the chance: from below 3 x below_per_storey, from above 3 x above_per_storey (against the same tile flat);
   H3 A WOLF NEVER CLIMBS: on a board with roofs, no roof tile is in a wolf's walk, and in the probe's wolf fights no beast stands
      on a roof, ever;
   H4 AUTO FINDS A SHOT: the probe's fights (wolves, raiders, the robots, the act-one bosses): no turn a shooter of his ended with no
      shot while a tile he could walk to that turn gave one; no idle turn while a tile he could walk to gave a hit next turn, when
      the tile he stood on gave none;
   H5 nothing threw, and the fights stay short (minutes on AUTO, the bench's own sum, under 4).
   Run: node gates/auto_plays_smart_gate.js [--n 8] */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const N = Number(arg('--n', 8));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const CREW3 = [{ background: 'companion_2hand', name: 'RAUL' }, { background: 'companion_1hand', name: 'DESI' }, { background: 'companion_ranged', name: 'TINA' }];

/* H1 */
const O = J('records/target/bb/ours.json'), RL = J('records/target/bb/rules.json');
const row = k => O[k] && O[k].value && O[k].source && (O[k].quote || '').length > 20 && (O[k].why || '').length > 100;
const HA = O.height_is_accuracy && O.height_is_accuracy.value;
leg(row('height_is_accuracy') && row('climbers') && row('auto_finds_a_shot') && HA.melee_any_storey === true && HA.zone_any_storey === true && HA.above_per_storey > 0 && HA.below_per_storey < 0 &&
  RL.zone_of_control.height_gap_breaks_zoc_levels.value === 2 && RL.hit_chance.height.melee_max_height_gap.value === 1 && J('records/target/bb/ai.json').archetypes.crew.value.finds_a_shot === true,
  'H1 THE RULING IS DATA: height_is_accuracy, climbers, auto_finds_a_shot sourced with his words; the library rows kept as Battle Brothers wrote them',
  JSON.stringify(HA));

/* H2 + H3 on the live rules */
{
  const ctx = engine(), F = ctx.FIGHT, T = F._t;
  let found = null, sd = 0;
  for (sd = 1; sd < 60 && !found; sd++) { ctx.setSeed(sd); F.setup({ kind: 'works', company: CREW3, cap: 12, deploy: false, formation: null, band: ['brigand_thug', 'direwolf'] });
    const S = F.S; for (let y = 1; y < S.h - 1 && !found; y++) for (let x = 1; x < S.w - 1 && !found; x++) if (S.terrain[y][x] === 'height3' && F.isRoof(x, y)) {
      for (const [dx, dy] of [[0, 1], [1, 0], [-1, 0], [0, -1], [1, 1], [-1, 1]]) { const q = { x: x + dx, y: y + dy }; if (S.terrain[q.y] && S.terrain[q.y][q.x] === 'flat' && T.passable(q.x, q.y)) { found = { x, y, foot: q }; break; } } } }
  if (!found) leg(false, 'H2 a three-storey roof with street beside it', 'none in 60 seeds of works');
  else {
    const S = F.S, me = S.units.filter(v => v.side === 'you')[0], club = S.units.filter(v => v.side === 'them' && v.kind === 'brigand_thug')[0], wolf = S.units.filter(v => v.side === 'them' && v.beast)[0];
    S.units.forEach(v => { if (v !== me && v !== club) { v.x = -50; v.y = -50; } });
    me.x = found.x; me.y = found.y; club.x = found.foot.x; club.y = found.foot.y;
    club.ap = club.apTurn; club.fat = 0; club.mskill = 60; me.mdef = 0; me.mskill = 60; club.mdef = 0;
    const was = S.terrain[found.y][found.x];
    const can = F.canStrike(club, me), ring = F.zocOn(me, me.x, me.y).indexOf(club) >= 0;
    const up = F.hitChance(club, me).chance, down = F.hitChance(me, club).chance;
    S.terrain[found.y][found.x] = 'flat';
    const upFlat = F.hitChance(club, me).chance, downFlat = F.hitChance(me, club).chance;
    S.terrain[found.y][found.x] = was;
    leg(can && ring && up - upFlat === 3 * HA.below_per_storey && down - downFlat === 3 * HA.above_per_storey,
      'H2 ACROSS THREE STOREYS: the club beside him strikes him and rings him; only the chance moves (' + 3 * HA.below_per_storey + ' up at him, +' + 3 * HA.above_per_storey + ' down from him)',
      JSON.stringify({ seed: sd - 1, roof: found, canStrike: can, ring, clubUp: [up, upFlat], fromRoof: [down, downFlat] }));
    /* H3: the wolf's walk, from the street beside the roof, a full turn and more: no roof tile in it */
    me.x = -50; me.y = -50; club.x = -50; club.y = -50; wolf.x = found.foot.x; wolf.y = found.foot.y; wolf.ap = 40;
    const f = F.reach(wolf, 40), roofs = Object.keys(f.best).map(Number).filter(k => F.isRoof(k % S.w, Math.floor(k / S.w)));
    const anyRoof = []; for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (F.isRoof(x, y)) anyRoof.push(1);
    leg(roofs.length === 0 && anyRoof.length > 0 && Object.keys(f.best).length > 10, 'H3 A WOLF NEVER CLIMBS: no roof tile in a wolf\'s walk (40 AP from the foot of a three-storey roof)',
      JSON.stringify({ walkTiles: Object.keys(f.best).length, roofTilesInWalk: roofs.length, roofTilesOnBoard: anyRoof.length }));
  }
}

/* H3 (fights), H4, H5: the probe */
{
  const out = path.join(os.tmpdir(), 'auto_plays_smart_gate_' + process.pid + '.json');
  const r = cp.spawnSync(process.execPath, [path.join(ROOT, 'tools/bohemia_combat_auto_plays_smart_probe_11_2_26.js'), '--n', String(N), '--json', out], { encoding: 'utf8', timeout: 600000 });
  let P = null; try { P = JSON.parse(fs.readFileSync(out, 'utf8')); fs.unlinkSync(out); } catch (e) { /* below */ }
  if (!P) { leg(false, 'the probe ran', (r.stderr || r.stdout || '').slice(0, 300)); }
  else {
    const K = P.kinds, ks = Object.keys(K), sum = f => ks.reduce((t, k) => t + (K[k][f] || 0), 0);
    leg(ks.length === 4 && K.wolves && K.wolves.beast_on_roof_steps === 0 && K.wolves.beast_climbed_a_roof === 0 && K.wolves.beast_dealt_on_a_roof === 0,
      'H3 A WOLF NEVER CLIMBS: ' + K.wolves.fights + ' wolf fights, no beast on a roof at any step', JSON.stringify({ onRoof: K.wolves.beast_on_roof_steps, climbed: K.wolves.beast_climbed_a_roof, dealt: K.wolves.beast_dealt_on_a_roof }));
    leg(sum('shooter_ended_no_shot_when_a_tile_gave_one') === 0 && sum('shooter_turns') > 100,
      '*** H4 AUTO FINDS A SHOT: ' + sum('shooter_turns') + ' shooter turns in ' + sum('fights') + ' fights, none ended with no shot while a tile he could walk to gave one ***',
      ks.map(k => k + ' ' + K[k].shooter_ended_no_shot_when_a_tile_gave_one + ' (moved to a shot ' + K[k].shooter_moved_to_a_shot + ')').join(', '));
    leg(sum('idle_when_a_move_gave_a_hit_next_turn') === 0 && sum('height_walled_turns') === 0,
      '  H4 nobody idle while a tile he could walk to gave a hit next turn (the tile he stood on giving none); no club walled off by storeys',
      ks.map(k => k + ' idle ' + K[k].idle_when_a_move_gave_a_hit_next_turn + ' walled ' + K[k].height_walled_turns).join(', '));
    leg(ks.every(k => !K[k].errors.length && K[k].minutes_on_auto < 4),
      'H5 nothing threw; every kind under 4 minutes on AUTO', ks.map(k => k + ' ' + K[k].minutes_on_auto + ' min, won ' + K[k].won + '/' + K[k].fights + (K[k].errors.length ? ' ERR ' + K[k].errors[0] : '')).join(', '));
  }
}
console.log('=== AUTO PLAYS SMART GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
