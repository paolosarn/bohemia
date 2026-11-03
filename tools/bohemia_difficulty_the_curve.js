#!/usr/bin/env node
// DIFFICULTY [the curve] 11/3 -- A MEASURING TOOL, NOT A GATE (rule 351(c)(d), ask line 363).
// Paolo 11/3: 'day 20 with like 10 super soldiers... I'm playing on the easiest difficulty... Lonewolf... I reached the ceiling...
// the hardest difficulty in the early game isn't gonna be hell'.
//
// Plays THE LIVE FIGHT (slices/BOHEMIA_FIGHT.html fight-data + fight-rules, loaded headless by tools/bohemia_tuning_the_whole_grid.js,
// AUTO both sides, seeded) day by day for two companies on each of the three levels, against the job the map would hand them:
//   THE PARTY   the map's own job math (slices/BOHEMIA_CITY_WORLD.html partyMath 'job', copied here line for line): Battle Brothers'
//               contract multiplier on the roster's strength, the skulls, the level's count, dressed for the day a company that strong
//               stands (job_bb.dress), never further ahead of the calendar than the level allows (job_bb.dress_ahead: after its
//               first week the calendar counts mult times by level; none before the curve), the first day's cap; then THE FIGHT dresses it by tier (ours.enemy_tiers, the level's days on top)
//   THE COMPANIES (a growth line, said plainly: the fights do not feed back into who he hires)
//     LONE WOLF  the door's roll (engine/bohemia_origin_start.js 'wolf', the level-4 hedge knight in his kit), alone to day 5, then a
//                good hire every couple of days: 10 men on day 20 (his game), 12 on day 30; the hires climb a level every few days
//                and are dressed in the town's shelf from day 10, the city's from day 20 (TUNING's gear rows)
//     FULL CREW  the Block Watch's twelve from day 1 (the militia, the biggest start), level 1 climbing to 6 by day 30, the town's
//                shelf from day 12, the city's from day 24
//   THE JOBS    each sample day, the job a player takes: one skull to day 3, two to day 7, then the HARDEST the board offers (three),
//               plus the routine two-skull job; factions in turn (brigands twice, machines, kids, heavies; the beasts stay off a lone
//               man's board under WORLD's curve, so they are left out of every line alike)
//   IT READS    won in 100, men struck down a fight (the hurt), men killed a fight (the fight's own 20% roll), and the battery stash
//               by day (the origin's start, 30 a skull for a won job, 2 a man a night; one job a day)
//   node tools/bohemia_difficulty_the_curve.js [--n 24] [--tag before] [--out file.json]
// Every number it prints is a MEASUREMENT of the game with the data files as they stand on disk; nothing in the game reads it.
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const argv = process.argv.slice(2), arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };

const LEVELS = [{ id: 'new', dif: 0 }, { id: 'seen', dif: 1 }, { id: 'out', dif: 2 }];
const DAYS = (arg('--days', '') || '1,3,5,7,10,13,16,20,25,30').split(',').map(Number);
const FACTIONS = ['brigands', 'machines', 'brigands', 'kids', 'heavies'];
const lerp = (pts, d) => { if (d <= pts[0][0]) return pts[0][1]; for (let i = 1; i < pts.length; i++) if (d <= pts[i][0]) return pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * (d - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]); return pts[pts.length - 1][1]; };

/* ---- the companies by day ---- */
const COMPANY = {
  wolf: { name: 'LONE WOLF', origin: 'wolf', start: 125,
    men: d => Math.round(lerp([[1, 1], [5, 1], [8, 2], [12, 4], [16, 7], [20, 10], [25, 11], [30, 12]], d)),
    wolfLevel: d => Math.round(lerp([[1, 4], [10, 5], [20, 7], [30, 9]], d)),
    hireLevel: d => Math.round(lerp([[5, 2], [12, 3], [20, 5], [30, 7]], d)),
    gear: d => d >= 20 ? 'late' : d >= 10 ? 'middle' : 'early' },
  crew: { name: 'FULL CREW', origin: 'watch', start: 125,
    men: () => 12,
    hireLevel: d => Math.round(lerp([[1, 1], [10, 2], [20, 4], [30, 6]], d)),
    gear: d => d >= 24 ? 'late' : d >= 12 ? 'middle' : 'early' }
};
function skullsOn(d) { return d <= 3 ? 1 : d <= 7 ? 2 : 3; }

/* ---- the map's job math, line for line with partyMath('job') ---- */
function strengthOf(levels) {
  const R = J('records/target/bb/party_math.json').roster_strength.value;
  return levels.slice().sort((a, b) => b - a).slice(0, R.strongest).reduce((t, l) => t + R.per_man + R.per_level * (l - 1), 0);
}
function dressDay(str, T) {
  if (str <= T[0][0]) return T[0][1];
  for (let i = 1; i < T.length; i++) if (str <= T[i][0]) return Math.round(T[i - 1][1] + (T[i][1] - T[i - 1][1]) * (str - T[i - 1][0]) / (T[i][0] - T[i - 1][0]));
  return Math.min(100, Math.round(T[T.length - 1][1] + (str - T[T.length - 1][0]) / 4));
}
function jobParty(PM, str, skulls, day, dif, crew) {
  const B = PM.job_bb.value, P = PM.job.value;
  const mult = (PM.difficulty_count_mult.value || [])[dif] || 1;
  const bm = Math.max(B.mult_min, Math.min(B.mult_max, B.k * Math.pow(str / 100, B.exp)));
  let n = (B.base_men[String(skulls)] || B.base_men['2']) * bm * mult;
  const A = B.dress_ahead || null, am = A ? (A.mult[dif] || 1) : 1;
  const days = Math.min(dressDay(str, B.dress), Math.min(100, Math.round(day + Math.max(0, day - (A ? A.from_day : 0)) * (am - 1))));
  const max = ((P.max_by_difficulty || [])[dif]) || P.max;
  n = Math.max(P.min, Math.min(max, Math.floor(n + 0.5)));
  if (day <= 1 && crew > 0 && n > crew + 1) n = crew + 1;
  return { count: n, days };
}

/* ---- one fight on the live engine ---- */
let CTX = null, DOOR = null, G = null;
async function boot() {
  if (CTX) return;
  G = require('./bohemia_tuning_the_whole_grid.js');
  CTX = await G.engine(true);
  const vm = require('vm');
  const ctx = { console, Math, JSON, Date, Object, Array, String, Number, Promise, setTimeout: () => 0,
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    fetch: u => Promise.resolve({ json: () => Promise.resolve(JSON.parse(fs.readFileSync(path.join(ROOT, 'slices', u), 'utf8'))) }) };
  ctx.window = ctx; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'engine/bohemia_origin_start.js'), 'utf8'), ctx);
  await ctx.BohemiaOriginStart.load();
  DOOR = ctx.BohemiaOriginStart;
}
function companyFor(key, d, seed) {
  const C = COMPANY[key], n = C.men(d), stage = C.gear(d), lv = C.hireLevel(d);
  let men = [];
  if (key === 'wolf') {
    const w = (DOOR.roll('wolf', seed) || [{ background: 'hedge_knight', level: 4 }])[0];
    const me = JSON.parse(JSON.stringify(w)); me.level = C.wolfLevel(d); me.main = true;
    if (stage !== 'early' && me.gear) { const g = G.GEAR[stage]; me.gear = Object.assign({}, me.gear, { body: g.body, head: g.head }); }
    men.push(me);
    if (n > 1) G.companyOf(Math.max(6, n), stage).slice(0, n - 1).forEach(m => { m.level = lv; men.push(m); });
  } else {
    const o = J('records/target/bb/origins.json').origins.filter(x => x.id === C.origin)[0];
    const kit = stage === 'early' ? null : G.companyOf(12, stage);
    men = o.men.slice(0, n).map((m, i) => { const out = { background: m.background, level: lv }; if (kit) out.gear = kit[i].gear; if (i === 0) out.main = true; return out; });
  }
  return men;
}
function one(key, lvl, d, skulls, k, PM) {
  const seed = 7000 + k * 131 + d * 17 + skulls * 3 + lvl.dif * 1000;
  const company = companyFor(key, d, 4242 + k * 977);
  const str = strengthOf(company.map(m => m.level || 1));
  const job = jobParty(PM, str, skulls, d, lvl.dif, company.length);
  const faction = FACTIONS[k % FACTIONS.length];
  const F = CTX.FIGHT, W = { district: 'subs', cell: { x: 11 + (k % 29), y: 7 + (k % 31) } };
  CTX.setSeed(seed);
  F.setup({ auto: true, formation: null, company, cap: Math.max(12, company.length), party: { faction, count: job.count, days: job.days, difficulty: lvl.dif },
    days: job.days, district: W.district, cell: W.cell, act: 1 });
  F.S.deploy = false;
  const S = F.S; let g = 0;
  while (!S.over && S.round <= 60 && g++ < 200000) { const v = F.current(); if (!v) break; F.aiStep(v); }
  const mine = S.units.filter(u => u.side === 'you'), them = S.units.filter(u => u.side === 'them');
  return { won: S.result === 'won' ? 1 : 0, down: mine.filter(u => u.down && !u.dead).length, dead: mine.filter(u => u.dead).length,
    men: mine.length, enemies: them.length, champs: them.filter(u => /champion/.test(u.kind || '')).length, str, count: job.count, dress: job.days };
}

const TRY = JSON.parse(arg('--try', '{}'));
function put(o, k, v) { const p = k.split('.'); let t = o; for (let i = 0; i < p.length - 1; i++) t = t[p[i]] = t[p[i]] || {}; t[p[p.length - 1]] = v; }
async function shard(i, m, n) {
  await boot();
  const PM = J('records/target/bb/party_math.json'), out = [];
  Object.keys(TRY.pm || {}).forEach(k => put(PM, k, TRY.pm[k]));
  Object.keys(TRY.ours || {}).forEach(k => put(CTX.DB.ours, k, TRY.ours[k]));
  for (const key of Object.keys(COMPANY)) for (const lvl of LEVELS) for (const d of DAYS) {
    const jobs = skullsOn(d) === 3 ? [2, 3] : [skullsOn(d)];
    for (const sk of jobs) for (let k = 0; k < n; k++) {
      if (((d * 7 + k + sk) % m) !== i) continue;
      const r = one(key, lvl, d, sk, k, PM); r.key = key; r.level = lvl.id; r.day = d; r.skulls = sk; out.push(r);
    }
  }
  return out;
}

function summarise(rows) {
  const cells = {};
  rows.forEach(r => { const id = [r.key, r.level, r.day, r.skulls].join('|'); const c = cells[id] || (cells[id] = { key: r.key, level: r.level, day: r.day, skulls: r.skulls, n: 0, won: 0, down: 0, dead: 0, men: 0, enemies: 0, champs: 0, count: 0, dress: 0, str: 0 });
    c.n++; ['won', 'down', 'dead', 'men', 'enemies', 'champs', 'count', 'dress', 'str'].forEach(f => { c[f] += r[f]; }); });
  const list = Object.values(cells).map(c => ({ key: c.key, level: c.level, day: c.day, skulls: c.skulls, n: c.n,
    won: Math.round(100 * c.won / c.n), downPerFight: +(c.down / c.n).toFixed(2), deadPerFight: +(c.dead / c.n).toFixed(2),
    men: Math.round(c.men / c.n), enemies: +(c.enemies / c.n).toFixed(1), champsPerFight: +(c.champs / c.n).toFixed(2), dressDay: Math.round(c.dress / c.n), strength: Math.round(c.str / c.n) }));
  list.sort((a, b) => a.key.localeCompare(b.key) || a.level.localeCompare(b.level) || a.day - b.day || a.skulls - b.skulls);
  /* the stash by day: one job a day (the day's hardest), 30 a skull won, 2 a man a night, from the origin's start */
  const stash = {};
  Object.keys(COMPANY).forEach(key => LEVELS.forEach(l => {
    const C = COMPANY[key], pts = DAYS.map(d => { const sk = skullsOn(d), c = list.filter(x => x.key === key && x.level === l.id && x.day === d && x.skulls === sk)[0]; return [d, c ? c.won / 100 : 0]; });
    let b = C.start; const by = {};
    for (let d = 1; d <= 30; d++) { b += 30 * skullsOn(d) * lerp(pts, d) - 2 * C.men(d); if (DAYS.indexOf(d) >= 0) by[d] = Math.round(b); }
    stash[key + '|' + l.id] = by;
  }));
  return { cells: list, stash };
}

(async () => {
  if (argv[0] === '--shard') {
    const [i, m] = argv[1].split('/').map(Number), n = +argv[2];
    process.stdout.write(JSON.stringify(await shard(i, m, n)));
    return;
  }
  const n = +arg('--n', 24), tag = arg('--tag', 'now'), outf = arg('--out', null), m = Math.max(1, Math.min(4, os.cpus().length));
  const parts = await Promise.all(Array.from({ length: m }, (_, i) => new Promise((res, rej) => {
    const p = cp.spawn(process.execPath, [__filename, '--shard', i + '/' + m, String(n)].concat(argv.indexOf('--try') >= 0 ? ['--try', arg('--try')] : []).concat(argv.indexOf('--days') >= 0 ? ['--days', arg('--days')] : []), { stdio: ['ignore', 'pipe', 'inherit'] });
    let s = ''; p.stdout.on('data', b => { s += b; }); p.on('close', c => c ? rej(new Error('shard ' + i + ' exit ' + c)) : res(JSON.parse(s)));
  })));
  const rows = [].concat.apply([], parts), sum = summarise(rows);
  sum.tag = tag; sum.n = n; sum.draft = true; sum.at = new Date().toISOString();
  sum.about = 'DIFFICULTY [the curve] 11/3, tools/bohemia_difficulty_the_curve.js: the live fight, AUTO both sides, the map\'s job math; draft:true, nothing in the game reads this file';
  if (outf) fs.writeFileSync(path.join(ROOT, outf), JSON.stringify(sum, null, 1));
  sum.cells.filter(c => c.skulls === skullsOn(c.day)).forEach(c => console.log([c.key, c.level, 'day ' + c.day, c.skulls + ' skulls', 'won ' + c.won, 'down ' + c.downPerFight, 'dead ' + c.deadPerFight, c.men + ' v ' + c.enemies, 'dress ' + c.dressDay, 'champs ' + c.champsPerFight].join('  ')));
  Object.keys(sum.stash).forEach(k => console.log('stash', k, JSON.stringify(sum.stash[k])));
})().catch(e => { console.error(e); process.exit(1); });
