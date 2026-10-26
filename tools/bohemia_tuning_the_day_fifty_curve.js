#!/usr/bin/env node
// TUNING [the day-fifty curve] 10/26 -- RESEARCH INSTRUMENT, NOT A GATE (rules 254, 255; rule 38g). Paolo 10/26: 'up to 50 days is when
// shit starts getting difficult, but I don't even want you to have jobs available like six wolves; I played as the Lone Wolf, you have
// to understand how dangerous some of this is' (records/BOHEMIA_PAOLO_THE_BLOOD_IS_THE_AUTO_COLOUR_AND_THE_DANGER_RAMPS_TO_DAY_FIFTY_10_26_26.md).
// THE LONE WOLF ALONE (the door's roll, engine/bohemia_origin_start.js 'wolf') on the live fight, AUTO both sides, against every
// faction a job can send (brigands, beasts, kids, machines, heavies) at every count from 2 to 6, dressed for days 1, 10 and 20; each
// fight read as the AUTO calculator reads it (ours.odds_colour: 1 won with nobody down, 0 lost; he is alone, so a won fight is clean).
// The worth's mean is the same hidden number the job's blood and the AUTO tint read (rule 254).
//   node tools/bohemia_tuning_the_day_fifty_curve.js [--n 60] [--shard i/m] [--out file]
// Every number it prints is DRAFT; the bank (draft:true, nothing in the game reads it) is written by the caller.
'use strict';
const fs = require('fs'), path = require('path');
const B = require('./bohemia_tuning_auto_brain.js'), WATCH = require('./bohemia_tuning_stupid_move_watch.js');
const FACTIONS = ['brigands', 'beasts', 'kids', 'machines', 'heavies'], COUNTS = [2, 3, 4, 5, 6], DAYS = [1, 10, 20];

async function one(faction, count, days, k) {
  const ctx = await B.engineFor('today'), F = ctx.FIGHT, W = B.fightOf(k, ctx.DB.boardKinds.districts);
  const D = await WATCH.door(), company = D.roll('wolf', 4242 + k * 977) || [];
  ctx.setSeed(W.seed);
  F.setup({ auto: true, formation: null, company, cap: company.length, party: { faction, count, days }, days, district: W.district, cell: W.cell, act: 1 });
  F.S.deploy = false;
  const S = F.S; let g = 0;
  while (!S.over && S.round <= 60 && g++ < 200000) { const v = F.current(); if (!v) break; F.aiStep(v); }
  const mine = S.units.filter(u => u.side === 'you'), them = S.units.filter(u => u.side === 'them');
  return { won: S.result === 'won' ? 1 : 0, clean: S.result === 'won' && !mine.some(u => u.down || u.dead) ? 1 : 0, rounds: S.round,
    enemies: them.length, kinds: them.map(u => u.kind || u.arche || '?') };
}
(async () => {
  const a = process.argv.slice(2), arg = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
  const n = +arg('--n', 60), sh = arg('--shard', '0/1').split('/').map(Number), rows = [];
  for (const f of FACTIONS) for (const c of COUNTS) for (const d of DAYS) {
    const r = { faction: f, count: c, days: d, n: 0, won: 0, clean: 0, enemies: 0, kinds: {} };
    for (let k = 0; k < n; k++) { if (k % sh[1] !== sh[0]) continue;
      const o = await one(f, c, d, k); r.n++; r.won += o.won; r.clean += o.clean; r.enemies += o.enemies; o.kinds.forEach(x => { r.kinds[x] = (r.kinds[x] || 0) + 1; }); }
    rows.push(r);
  }
  const s = JSON.stringify({ rows }); const o = arg('--out', null);
  if (o) fs.writeFileSync(o, s); else console.log(s.slice(0, 3000));
})().catch(e => { console.error(e); process.exit(1); });
