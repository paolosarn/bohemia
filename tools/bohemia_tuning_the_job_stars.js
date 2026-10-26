#!/usr/bin/env node
// TUNING [the job's stars, the cut-offs] 10/26 -- RESEARCH INSTRUMENT, NOT A GATE (rule 208(b)(f), rule 38g).
// Paolo 10/25: 'make sure on the job the stars are red... depending on how difficult the job is, especially if it's gonna be super
// overpowered like wolves... that's one of the weak points of Battle Brothers, not really accurate, so try to be accurate.'
// Rule 208(b): one to three red stars from the chance he comes home clean (nobody of his dead or down); the cut-offs are a
// COORDINATOR'S DEFAULT (one star clean nine in ten or better, three worse than six in ten), TUNING's to set from its own fights.
// Rule 208(f), the gate: 200 rolled jobs, stars against 100 AUTO plays each: one star clean at least 85 in 100, three under 65.
//
// This rolls 200 jobs the map could hand (six crews he plays at the points of a game, one to three skulls, every faction, a
// district and a cell, the party counted by WORLD's job math and dressed for his strength: records/target/bb/party_math.json
// job_bb), sets each one up on the LIVE fight, freezes the board the way the calculator does, and plays it:
//   THE READ   the calculator's own way (the fight's ODDS_RUNS from the frozen board on its own seed), kept run by run so the read
//              at 8, 12, 24 and 48 runs can be tried
//   THE TRUTH  100 more plays of the same board on other dice: clean (won, nobody of his dead or down), won, a death
// then tries every pair of cut-offs on the read and reports, for each: the pooled truth of the one-star and three-star jobs (the
// gate's two numbers), the share of jobs at each star, and how often two independent reads of one job disagree on its stars (a
// button that flickers is a button that lies).
//   node tools/bohemia_tuning_the_job_stars.js [--n 200] [--jobs 4] [--save]
//   --job <k>      one job (the workers)
// The cache lives in TUNING_CACHE (default /tmp), never in the repo. Every number it prints is DRAFT.
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const B = require('./bohemia_tuning_auto_brain.js'), G = require('./bohemia_tuning_the_whole_grid.js');
const BANK = path.join(ROOT, 'banks/BOHEMIA_TUNING_THE_JOB_STARS_10_26_26.json');
const CACHE = process.env.TUNING_CACHE || '/tmp';
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const PM = J('records/target/bb/party_math.json');
const READ_MAX = 48, TRUTH = 100;

/* WORLD's job math, read off records/target/bb/party_math.json the way tools/bohemia_world_most_jobs_fit.js plays it */
function strengthOf(levels) { const R = PM.roster_strength.value; return levels.slice().sort((a, b) => b - a).slice(0, R.strongest).reduce((t, l) => t + R.per_man + R.per_level * (l - 1), 0); }
function dressDay(str) { const T = PM.job_bb.value.dress; if (str <= T[0][0]) return T[0][1];
  for (let i = 1; i < T.length; i++) if (str <= T[i][0]) return Math.round(T[i - 1][1] + (T[i][1] - T[i - 1][1]) * (str - T[i - 1][0]) / (T[i][0] - T[i - 1][0]));
  return Math.min(100, Math.round(T[T.length - 1][1] + (str - T[T.length - 1][0]) / 4)); }
function jobCount(str, skulls, crew, day) {
  const P = PM.job.value, BB = PM.job_bb.value, mult = PM.difficulty_count_mult.value[1];
  const m = Math.max(BB.mult_min, Math.min(BB.mult_max, BB.k * Math.pow(str / 100, BB.exp)));
  let n = Math.max(P.min, Math.min(P.max, Math.floor(BB.base_men[String(skulls)] * m * mult + 0.5)));
  if (day <= 1 && n > crew + 1) n = crew + 1;   /* the first day: every fight sized to the crew */
  return n;
}
/* the crews at the points of a game */
const g = (main, off) => ({ main, off, body: null, head: null, bag: [] });
const HIS = [{ background: 'companion_ranged', name: 'YOU', main: true, gear: g('light_crossbow', null) },
  { background: 'companion_1hand', name: 'RAUL', gear: g('militia_spear', 'wooden_shield') }, { background: 'companion_1hand', name: 'JAMAL', gear: g('militia_spear', 'wooden_shield') }];
const CREWS = [
  { id: 'newcrew', why: 'A New Crew from the door, day 1', day: 1, door: 'newcrew' },
  { id: 'his', why: 'his crew (a rifle, two spear-and-car-door men), day 10', day: 10, men: () => HIS },
  { id: 'wolf', why: 'the Lone Wolf from the door, day 1', day: 1, door: 'wolf' },
  { id: 'six', why: 'six men at level 3, their kit, day 20', day: 20, n: 6, level: 3, stage: 'early' },
  { id: 'nine', why: 'nine at level 5 in the town shelf, day 50', day: 50, n: 9, level: 5, stage: 'middle' },
  { id: 'twelve', why: 'twelve at level 8 in the city shelf, day 90', day: 90, n: 12, level: 8, stage: 'late' }
];
const FACTIONS = ['brigands', 'beasts', 'brigands', 'kids', 'brigands', 'machines', 'brigands', 'heavies'];
function jobOf(k) { return { k, crew: CREWS[k % CREWS.length].id, skulls: 1 + Math.floor(k / CREWS.length) % 3, faction: FACTIONS[(k * 7 + Math.floor(k / 18)) % FACTIONS.length], seed: 31000 + k }; }

const cleanOf = F => { if (F.S.result !== 'won') return 0; return F.S.units.some(v => v.side === 'you' && (v.dead || v.down)) ? 0 : 1; };
async function oneJob(k) {
  const ctx = await B.engineFor('today'), F = ctx.FIGHT, districts = ctx.DB.boardKinds.districts, Jb = jobOf(k), C = CREWS.filter(c => c.id === Jb.crew)[0];
  let company, levels;
  if (C.door) company = await doorRoll(C.door, 4242 + k * 977);
  else if (C.men) company = C.men();
  else company = G.companyOf(C.n, C.stage).map(m => Object.assign({}, m, { level: C.level }));
  const bgs = new Map(ctx.DB.backgrounds.rows.map(r => [r.id, r]));
  levels = company.map(m => m.level || (sl => (sl[0] + sl[sl.length - 1]) / 2)(bgs.get(m.background).starting_level));
  const str = strengthOf(levels), count = jobCount(str, Jb.skulls, company.length, C.day), dd = dressDay(str);
  const Wf = B.fightOf(k, districts);
  ctx.setSeed(Jb.seed);
  F.setup({ auto: true, formation: null, company: company, cap: company.length, party: { faction: Jb.faction, count: count, days: dd, difficulty: 1 }, days: dd, district: Wf.district, cell: Wf.cell, act: 1 });
  F.S.deploy = false;
  const snap = F.freeze();
  const play = (seed, runs) => { const out = [];
    /* run by run, the calculator's own loop (readOdds: thaw the frozen board, AUTO both sides, a standoff counts 0) */
    for (let i = 0; i < runs; i++) {
      const R = B.readOdds(ctx, snap, (seed + i * 2654435761) >>> 0, 1);
      const mine = ctx.FIGHT.S.units.filter(v => v.side === 'you'), dead = mine.filter(v => v.dead).length, down = mine.filter(v => v.down || v.dead || v.fled).length;
      /* OK: the reading for a big crew (TUNING 10/26): won, nobody dead, and no more than one man in six laid up (a crew under six: none) */
      out.push([R.values[0] === 1 ? 1 : 0, R.wins[0], R.wins[0] && !dead && down <= Math.floor(mine.length / 6) ? 1 : 0, dead ? 1 : 0]);
    }
    return out; };
  /* the read on the calculator's seed (the fight's own: freeze, then the odds' dice), the truth on others */
  const read = play(0x9e3779b9 ^ Jb.seed, READ_MAX), read2 = play(0x7f4a7c15 ^ Jb.seed, 24), truth = play(0x5bd1e995 ^ Jb.seed, TRUTH);
  return { k, crew: Jb.crew, skulls: Jb.skulls, faction: Jb.faction, men: company.length, enemies: F.S.units.filter(u => u.side === 'them').length, str, dressed: dd,
    read: read.map(r => r[0]).join(''), read2: read2.map(r => r[0]).join(''), clean: truth.reduce((t, r) => t + r[0], 0), won: truth.reduce((t, r) => t + r[1], 0),
    readOk: read.map(r => r[2]).join(''), read2Ok: read2.map(r => r[2]).join(''), ok: truth.reduce((t, r) => t + r[2], 0), deaths: truth.reduce((t, r) => t + r[3], 0) };
}
let DOOR = null;
async function doorRoll(id, seed) {
  if (!DOOR) { const vm = require('vm'), ctx = { console, Math, JSON, Date, Object, Array, String, Number, Promise, setTimeout: () => 0, localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    fetch: u => Promise.resolve({ json: () => Promise.resolve(JSON.parse(fs.readFileSync(path.join(ROOT, 'slices', u), 'utf8'))) }) };
    ctx.window = ctx; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(ROOT, 'engine/bohemia_origin_start.js'), 'utf8'), ctx); await ctx.BohemiaOriginStart.load(); DOOR = ctx.BohemiaOriginStart; }
  return DOOR.roll(id, seed);
}

/* ---------- the cut-offs, tried on the read ---------- */
function starOf(p, c1, c3) { return p >= c1 ? 1 : p < c3 ? 3 : 2; }
function tryCuts(jobs, n, c1, c3, m) {
  const RD = m === 'ok' ? 'readOk' : 'read', RD2 = m === 'ok' ? 'read2Ok' : 'read2', TR = m === 'ok' ? 'ok' : 'clean';
  jobs = jobs.map(j => Object.assign({}, j, { read: j[RD], read2: j[RD2], clean: j[TR] }));
  const pr = j => j.read.slice(0, n).split('').reduce((t, c) => t + (+c), 0) / n, pr2 = j => j.read2.slice(0, Math.min(n, 24)).split('').reduce((t, c) => t + (+c), 0) / Math.min(n, 24);
  const by = { 1: [], 2: [], 3: [] }; let flip = 0;
  jobs.forEach(j => { const s = starOf(pr(j), c1, c3); by[s].push(j); if (s !== starOf(pr2(j), c1, c3)) flip++; });
  const pool = a => a.length ? Math.round(100 * a.reduce((t, j) => t + j.clean, 0) / (TRUTH * a.length)) : null;
  /* a job the read starred one whose truth is under 85, or starred three whose truth is 65 or more: the lie the gate looks for */
  const lie1 = by[1].filter(j => j.clean < 85).length, lie3 = by[3].filter(j => j.clean >= 65).length;
  return { c1, c3, n, one: { jobs: by[1].length, clean: pool(by[1]), lies: lie1 }, two: { jobs: by[2].length, clean: pool(by[2]) }, three: { jobs: by[3].length, clean: pool(by[3]), lies: lie3 },
    flip_in_100: Math.round(100 * flip / jobs.length), gate: pool(by[1]) !== null && pool(by[1]) >= 85 && (pool(by[3]) === null || pool(by[3]) < 65) };
}

async function main() {
  const argv = process.argv, arg = (k, d) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };
  if (argv[2] === '--job') { process.stdout.write(JSON.stringify(await oneJob(Number(argv[3])))); return; }
  const N = Number(arg('--n', 200)), JOBS = Number(arg('--jobs', 4)), fp = B.rulesPrint();
  const me = require('crypto').createHash('sha1').update(fs.readFileSync(__filename)).digest('hex').slice(0, 8);
  const CF = path.join(CACHE, 'tuning_job_stars.' + fp + '.' + me + '.ndjson'), res = {};
  if (fs.existsSync(CF)) fs.readFileSync(CF, 'utf8').split('\n').filter(Boolean).forEach(l => { try { const x = JSON.parse(l); res[x.k] = x; } catch (e) { /* cut */ } });
  /* --small-from <bank>: a crew under six men reads the same on both readings (no man in six may be laid up, and clean already
     means nobody dead or down), so its jobs are taken from the first pass's bank and only the six, the nine and the twelve play */
  const SF = arg('--small-from', null);
  if (SF) JSON.parse(fs.readFileSync(SF, 'utf8')).jobs.forEach(j => { if (!res[j.k] && j.men < 6 && j.k < N) res[j.k] = Object.assign({}, j, { readOk: j.read, read2Ok: j.read2, ok: j.clean, deaths: null }); });
  const work = []; for (let k = 0; k < N; k++) if (!res[k]) work.push(k);
  process.stderr.write('rules ' + fp + '; resume ' + (N - work.length) + ' of ' + N + '\n');
  let next = 0, running = 0; const t0 = Date.now();
  await new Promise(done => { const pump = () => { while (running < JOBS && next < work.length) { const k = work[next++]; running++;
    cp.execFile(process.execPath, [__filename, '--job', String(k)], { maxBuffer: 1 << 26 }, (err, so) => { running--;
      if (err) console.error('job failed', k, err.message.slice(0, 300)); else { const x = JSON.parse(so); res[k] = x; fs.appendFileSync(CF, JSON.stringify(x) + '\n'); }
      if (next % 20 === 0) process.stderr.write(next + '/' + work.length + ' ' + Math.round((Date.now() - t0) / 1000) + 's\n');
      if (next >= work.length && running === 0) done(); else pump(); }); } }; if (!work.length) done(); else pump(); });
  const jobs = Object.values(res).filter(j => j.k < N);
  /* the truth's own spread: how the jobs the map hands sit on clean */
  const band = [[0, 30], [30, 60], [60, 65], [65, 85], [85, 90], [90, 101]];
  console.log('\n' + jobs.length + ' jobs, the truth (100 plays each): clean in 100 by band ' + band.map(b => b[0] + '-' + Math.min(100, b[1]) + ': ' + jobs.filter(j => j.clean >= b[0] && j.clean < b[1]).length).join(', '));
  CREWS.forEach(c => { const a = jobs.filter(j => j.crew === c.id); [1, 2, 3].forEach(s => { const b = a.filter(j => j.skulls === s); if (b.length) console.log('  ' + c.id.padEnd(8) + s + ' skull' + (s > 1 ? 's' : ' ') + '  n=' + b.length + '  clean ' + Math.round(b.reduce((t, j) => t + j.clean, 0) / b.length) + '  won ' + Math.round(b.reduce((t, j) => t + j.won, 0) / b.length) + '  enemies ' + (b.reduce((t, j) => t + j.enemies, 0) / b.length).toFixed(1)); }); });
  const grid = [];
  ['clean', 'ok'].forEach(m => [8, 12, 24, 48].forEach(n => { for (let c1 = 0.80; c1 <= 0.971; c1 += 0.01) for (let c3 = 0.50; c3 <= 0.751; c3 += 0.05) grid.push(Object.assign(tryCuts(jobs, n, +c1.toFixed(2), +c3.toFixed(2), m), { m })); }));
  console.log('\nTHE BIG-CREW READING (ok: won, nobody dead, at most one man in six laid up; under six men it is clean):');
  CREWS.forEach(c => { const a = jobs.filter(j => j.crew === c.id); [1, 2, 3].forEach(s => { const b = a.filter(j => j.skulls === s); if (b.length) console.log('  ' + c.id.padEnd(8) + s + ' skull' + (s > 1 ? 's' : ' ') + '  clean ' + Math.round(b.reduce((t, j) => t + j.clean, 0) / b.length) + '  ok ' + Math.round(b.reduce((t, j) => t + j.ok, 0) / b.length) + '  won ' + Math.round(b.reduce((t, j) => t + j.won, 0) / b.length) + '  a death ' + Math.round(b.reduce((t, j) => t + j.deaths, 0) / b.length)); }); });
  const show = r => '  read ' + String(r.n).padStart(2) + ' runs  cut ' + r.c1.toFixed(2) + '/' + r.c3.toFixed(2) + '  one: ' + r.one.jobs + ' jobs clean ' + r.one.clean + ' (' + r.one.lies + ' under 85)  two: ' + r.two.jobs + ' clean ' + r.two.clean
    + '  three: ' + r.three.jobs + ' clean ' + r.three.clean + ' (' + r.three.lies + ' at 65+)  flips ' + r.flip_in_100 + ' in 100  ' + (r.gate ? 'GATE PASS' : 'gate fail');
  ['clean', 'ok'].forEach(m => {
    console.log('\n[' + m + '] THE COORDINATOR\'S DEFAULT (0.90 / 0.60):'); [8, 12, 24, 48].forEach(n => console.log(show(grid.filter(r => r.m === m && r.n === n && r.c1 === 0.9 && r.c3 === 0.6)[0])));
    console.log('[' + m + '] THE LOWEST ONE-STAR CUT THAT PASSES WITH ONE LIE IN TEN OR FEWER, per read size (three-star cut 0.60):');
    [8, 12, 24, 48].forEach(n => { const ok = grid.filter(r => r.m === m && r.n === n && r.c3 === 0.6 && r.gate && r.one.lies <= Math.max(1, Math.round(r.one.jobs / 10))).sort((a, b) => a.c1 - b.c1)[0]; console.log(ok ? show(ok) : '  read ' + n + ': none'); });
  });
  if (argv.includes('--save')) {
    fs.writeFileSync(BANK, JSON.stringify({ draft: true, _readme: 'TUNING [the job\'s stars, the cut-offs] (rule 208(b)(f); research only). draft:true. NOTHING IN THE GAME READS THIS FILE. '
      + 'Each job is a live-fight board the map could hand (tools/bohemia_tuning_the_job_stars.js); read: the calculator\'s runs on its own seed, one digit a run (1 = clean: won, nobody of his dead or down); '
      + 'read2: 24 runs on other dice (the flicker test); clean and won: of 100 more plays (the truth); readOk, read2Ok, ok: the big-crew reading (won, nobody dead, at most one man in six laid up; for a crew under six it is clean, copied from the first pass); deaths: plays of the 100 with a man dead (null where copied). grid: every pair of cut-offs tried on the read, both readings (m).', rules_print: fp, crews: CREWS.map(c => ({ id: c.id, why: c.why })), jobs, grid }) + '\n');
    console.log('wrote ' + path.relative(ROOT, BANK));
  }
}
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { jobOf, tryCuts, starOf };
