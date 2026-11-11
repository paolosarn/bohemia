#!/usr/bin/env node
/* the headless half of THE BESTIARY FLOOR's men (BESTIARY 11/10, rule 443(d): 'each type its own look... and its own way to fight;
   champions as rare named men'), on the live fight's rules (tools/bohemia_fight_headless.js). For every enemy type BESTIARY added
   (records/target/bb/bohemia_enemies.json rows with added_by BESTIARY): its party deals it at the first phase whose mix holds it
   (20 seeded parties), it is armed from its own gear (a volley brain holds a weapon that shoots), and in 10 played-out fights (AUTO,
   a crew of 6) it strikes: a volley brain from range. For every champion kind the fight deals (records/target/bb/bohemia_enemies.json
   champions.kinds): a band dealt one names him from his list, with his title, and two in one band never share a name; and how rare:
   bands that carry one before the late phase and in it (a late band of 12), and the most one band carries (one). Prints one line: RESULT {...}. */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const ctx = engine(), F = ctx.FIGHT, DB = ctx.DB;
const N = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/bohemia_enemies.json'), 'utf8'));
const setup = (o, seed) => { ctx.setSeed(seed || 5); F.setup(Object.assign({ kind: 'ruin', deploy: false, formation: null, flat: true }, o)); return F.S; };
const crew = n => { const c = []; for (let i = 0; i < n; i++) c.push({ background: 'farmhand', level: 1 }); return c; };
setup({ party: [{ kind: 'watch_neighbor', count: 1 }] });   /* the fold runs once: the tiers below are the folded ones */
const T = DB.ours.enemy_tiers.value, phases = T.phases;
const MINE = N.rows.filter(r => String(r.added_by || '').startsWith('BESTIARY') && !r.beast);
const out = { men: {}, champions: {}, rate: {} };
for (const r of MINE) {
  const o = { faction: r.faction, brain: r.brain };
  const mix = T.mix[r.faction] || {};
  const ph = phases.filter(p => mix[p.name] && mix[p.name][r.id]).map(p => p)[0] || (T.heads[r.faction] === r.id ? phases[0] : null);
  o.phase = ph ? ph.name : null;
  if (ph) {
    let dealt = 0; for (let s = 1; s <= 20; s++) { const S = setup({ party: { faction: r.faction, count: 6, days: ph.from_day + 1, difficulty: 0 } }, s); if (S.units.some(u => u.side === 'them' && u.kind === r.id)) dealt++; }
    o.dealt = dealt;
  }
  const u = setup({ party: [{ kind: r.id, count: 1 }] }).units.filter(v => v.side === 'them')[0];
  o.name = u.name; o.look = u.look; o.weapon = u.weapon && u.weapon.name; o.ranged = !!(u.weapon && F.isRanged(u.weapon));
  o.fromGear = (r.gear || null) ? (r.gear.indexOf(o.weapon) >= 0) : true;
  const acts = { melee: 0, ranged: 0, kick: 0, charge: 0 }; let won = 0;
  if (ph) for (let s = 1; s <= 10; s++) {
    ctx.setSeed(s); F.setup({ auto: true, formation: null, kind: ['ruin', 'suburb', 'strip'][s % 3], deploy: false, company: crew(6), party: { faction: r.faction, count: 6, days: ph.from_day + 1, difficulty: 0 } });
    let g = 0; while (!F.S.over && g < 200000) { const c = F.current(); if (!c) break; F.aiStep(c);
      (F.S.events || []).forEach(e => { if (e.t === 'skill' && (e.skill === 'kick' || e.skill === 'charge')) { const a = F.byId(e.id); if (a && a.kind === r.id) acts[e.skill] = (acts[e.skill] || 0) + 1; return; }
        if (e.t !== 'attack') return; const a = F.byId(e.id), t = F.byId(e.to); if (!a || a.kind !== r.id || !t) return;
        if (Math.max(Math.abs(a.x - t.x), Math.abs(a.y - t.y)) > 1) acts.ranged++; else acts.melee++; });
      F.S.events = []; g++; }
    if (F.S.result === 'won') won++;
  }
  o.acts = acts; o.won_by_crew_of_6 = won;
  out.men[r.id] = o;
}
const CH = (N.champions && N.champions.kinds) || {};
for (const k of Object.keys(CH)) {
  const S = setup({ party: [{ kind: k, count: 2 }, { kind: 'brigand_raider', count: 1 }] }, 7), us = S.units.filter(v => v.side === 'them' && v.kind === k);
  const names = CH[k].names.map(n => String(n).toUpperCase());
  out.champions[k] = { named: us.length === 2 && us.every(u => u.champion && names.indexOf(u.name) >= 0 && u.champTitle === CH[k].title), names: us.map(u => u.name),
    unique: us.length === 2 && us[0].name !== us[1].name, listed: (S.champions || []).length, title: CH[k].title };
}
const mixF = Object.keys(T.mix).filter(f => Object.values(T.mix[f]).some(m => Object.keys(m).some(k => CH[k])));
for (const f of mixF) {
  const r = { before_late: 0, late: 0, n: 100, most_in_a_band: 0 };
  for (let s = 1; s <= 100; s++) { const a = setup({ party: { faction: f, count: 6, days: 40, difficulty: 0 } }, s); if ((a.champions || []).length) r.before_late++;
    const b = setup({ party: { faction: f, count: 12, days: 70, difficulty: 0 } }, s), n = (b.champions || []).length; if (n) r.late++; r.most_in_a_band = Math.max(r.most_in_a_band, n); }
  out.rate[f] = r;
}
console.log('RESULT ' + JSON.stringify(out));
