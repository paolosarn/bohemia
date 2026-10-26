#!/usr/bin/env node
// TUNING [every weapon's range bands] 10/26 -- RESEARCH INSTRUMENT, NOT A GATE (rule 187, rule 38g). Also [the aim he sees] (rule 120(b)).
// Paolo 10/25: 'certain weapons will have their range accuracy; all weapons can shoot the tile next to them, depending on the type:
// a rifle shooting one tile next to it might be a range debuff; a shotgun, the closer you are, after one or two tiles... you'll
// have to do research on this.'
//
// TODAY, measured on the LIVE fight (its own hitChance, resolveAttack and dice, no hooks), two ways:
//   THE RANGE   each gun row at every distance it reaches, a level-2 shooter on a flat open board (no cover, no height, day),
//               against three men (a thug with no shield, a raider with a car door, a man in heavy armour): the chance the tile
//               shows (hitChance), the chance the dice deliver over SHOTS shots (resolveAttack), the hitpoints a shot takes
//   THE FIGHTS  where AUTO actually shoots from: every shot in rolled fights (the watch's six crew shapes) by class and distance,
//               its shown chance and whether it hit
//   node tools/bohemia_tuning_range_bands.js [--shots 2000] [--fights 60] [--json out.json]
// Every number it prints is DRAFT; the bands proposed from it are in records/BOHEMIA_TUNING_EVERY_WEAPONS_RANGE_BANDS_10_26_26.md.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const B = require('./bohemia_tuning_auto_brain.js'), W = require('./bohemia_tuning_stupid_move_watch.js');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const SHOTS = Number(arg('--shots', 2000)), FIGHTS = Number(arg('--fights', 60)), OUT = arg('--json', null);
const GUNS = [['pistol (dagger)', 'dagger'], ['pistol (rondel)', 'rondel_dagger'], ['shotgun (handgonne)', 'handgonne'],
  ['rifle (light crossbow)', 'light_crossbow'], ['rifle (crossbow)', 'crossbow'], ['rifle, the heavy (heavy crossbow)', 'heavy_crossbow']];
const TARGETS = [['a thug (ranged defence 0, rags)', 'brigand_thug', null], ['a raider (ranged defence 10, mail)', 'brigand_raider', null], ['a marauder (ranged defence 10, heavy kit)', 'brigand_marauder', null]];   /* the fight dresses each by his row: no shield on any of the three */

async function rangeTable() {
  const ctx = await B.engineFor('today'), F = ctx.FIGHT, S = F.S, rows = [];
  for (const [gname, gid] of GUNS) for (const [tname, tid] of TARGETS) {
    ctx.setSeed(5150);
    F.setup({ auto: true, formation: null, flat: true, company: [{ background: 'companion_ranged', level: 2, name: 'YOU', gear: { main: gid, off: null, body: 'padded_surcoat', head: null, bag: [] } }],
      cap: 1, party: [tid], days: 30, act: 1 });
    F.S.deploy = false; S.night = false;
    const a = S.units.filter(u => u.side === 'you')[0], t = S.units.filter(u => u.side === 'them')[0];
    const reach = Math.max(1, (a.weapon.range_max || 1));
    const y = Math.floor(S.h / 2), x0 = 1;
    for (let d = 1; d <= reach + 1; d++) {
      a.x = x0; a.y = y; t.x = x0 + d; t.y = y;
      if (t.x >= S.w) break;
      S.units.forEach(u => { if (u !== a && u !== t) { u.x = -9; u.y = -9; } });
      a.ap = 99; a.fat = 0; a.loaded = true; if (a.ammo !== null && a.ammo !== undefined) a.ammo = 99;
      const can = F.canStrike(a, t), shown = F.hitChance(a, t).chance;
      let hit = 0, hp = 0, arm = 0;
      for (let i = 0; i < SHOTS; i++) { const r = F.resolveAttack(a, t); if (r.hit) { hit++; hp += r.hp; arm += r.armour; } }
      rows.push({ gun: gname, row: gid, target: tname, d, inReach: can, shown, done: Math.round(1000 * hit / SHOTS) / 10, hpPerShot: Math.round(10 * hp / SHOTS) / 10, hpPerHit: hit ? Math.round(10 * hp / hit) / 10 : 0, armPerHit: hit ? Math.round(10 * arm / hit) / 10 : 0,
        rskill: a.rskill, tdef: t.rdef, tshield: !!t.shield });
    }
  }
  return rows;
}
/* where AUTO shoots from, in rolled fights of the watch's crew shapes */
async function fightShots() {
  const tally = {};
  const shapes = ['his', 'newcrew', 'spear', 'watch', 'bench'];
  for (let k = 0; k < FIGHTS; k++) {
    const shape = shapes[k % shapes.length], ctx = await B.engineFor('today'), F = ctx.FIGHT, S = F.S;
    await W.setupShape(ctx, shape, k, ctx.DB.boardKinds.districts);
    let g = 0;
    while (!S.over && g++ < 200000 && S.round <= 60) {
      const v = F.current(); if (!v) break;
      const n0 = S.log.length, pre = v.side === 'you' && F.isRanged(v.weapon) ? new Map(S.units.filter(t => t.side !== v.side && F.onField(t)).map(t => [t.id, F.hitChance(v, t).chance])) : null;
      F.aiStep(v);
      if (!pre) continue;
      S.log.slice(n0).forEach(e => {
        if (e.t !== 'attack' || e.free || e.id !== v.id || !e.shot) return;
        const t = F.byId(e.to), d = Math.max(Math.abs(v.x - t.x), Math.abs(v.y - t.y)), cls = (v.weapon.of || v.weapon).class;
        const key = cls + '|' + d, q = tally[key] = tally[key] || { cls, d, shots: 0, hits: 0, shown: 0 };
        q.shots++; q.hits += e.hit ? 1 : 0; q.shown += e.chance;
      });
    }
  }
  return Object.values(tally).sort((a, b) => a.cls < b.cls ? -1 : a.cls > b.cls ? 1 : a.d - b.d).map(q => Object.assign(q, { done: Math.round(1000 * q.hits / q.shots) / 10, shownMean: Math.round(10 * q.shown / q.shots) / 10 }));
}

(async () => {
  const rows = await rangeTable();
  console.log('THE RANGE (flat, open, day; a level-2 shooter; ' + SHOTS + ' shots a cell): distance: shown / done, hp a shot');
  const groups = {}; rows.forEach(r => { (groups[r.gun + ' | ' + r.target] = groups[r.gun + ' | ' + r.target] || []).push(r); });
  Object.keys(groups).forEach(k => console.log('  ' + k.padEnd(62) + groups[k].map(r => r.d + ':' + (r.inReach ? r.shown + '/' + r.done + ' ' + r.hpPerShot : 'out')).join('  ')));
  const shots = await fightShots();
  console.log('\nTHE FIGHTS (' + FIGHTS + ' rolled fights, AUTO): class, distance: shots, shown mean / done');
  const byC = {}; shots.forEach(q => { (byC[q.cls] = byC[q.cls] || []).push(q); });
  Object.keys(byC).forEach(c => { const tot = byC[c].reduce((t, q) => t + q.shots, 0); console.log('  ' + c.padEnd(10) + byC[c].map(q => q.d + ': ' + q.shots + ' (' + Math.round(100 * q.shots / tot) + '%) ' + q.shownMean + '/' + q.done).join('   ')); });
  if (OUT) fs.writeFileSync(OUT, JSON.stringify({ draft: true, rules_print: B.rulesPrint(), shots_a_cell: SHOTS, fights: FIGHTS, range: rows, in_fights: shots }) + '\n');
})().catch(e => { console.error(e); process.exit(1); });
