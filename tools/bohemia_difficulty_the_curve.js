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
//
// TUNING 2 [the fight is close] 11/3 (rule 370, ask line 396; Paolo: 'right now I'm just killing, I'm unstoppable... rare men in cheap
// gear... I don't even feel like I get one shot anywhere... the numbers, how close things can get, but you still feel good'):
//   --close   MEASURED BY CLOSENESS, NOT WINS (370(6)): the days 1, 5, 10, 20, 40; three companies: the LONE WOLF, a FRESH company (A New
//             Crew's three companions growing to twelve) and HIS WAY (the Lone Wolf and the post's rare men, each in the cheapest kit of his
//             kind, never upgraded); every man CLIMBS as the game climbs him (his level-ups taken on his stars and his plan,
//             engine/bohemia_roster.js levelUp's own columns, so a level-9 man fights as one, the difference from the DIFFICULTY round);
//             two jobs a day, the ROUTINE one (one skull to day 3, then two) and the TOUGH one (two skulls to day 3, then three).
//             Each fight reads: won; men struck down; health left (each man's health over his whole, a man down counts 0); NEAR-DEATHS
//             (a man who stood at a quarter of his health or less and lived: one more hit from the grave); BIG HITS (the share of the
//             enemy's landed hits that took half a man's whole health or more); the rounds.
//   --companies wolf,fresh,mine   --days 1,5,10,20,40   --out banks/x.json   --try '{"ours":{...},"pm":{...},"rows":{...}}'
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');
const JC = {}, J = f => JC[f] || (JC[f] = JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')));
const argv = process.argv.slice(2), arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };

const LEVELS = [{ id: 'new', dif: 0 }, { id: 'seen', dif: 1 }, { id: 'out', dif: 2 }];
const CLOSE = argv.indexOf('--close') >= 0, OWN_KIT = argv.indexOf('--own-kit') >= 0;
const DAYS = (arg('--days', '') || (CLOSE ? '1,5,10,20,40' : '1,3,5,7,10,13,16,20,25,30')).split(',').map(Number);
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
/* TUNING 2 [the fight is close]: the three companies of rule 370's measure. Every man climbs (grown below). */
const CLOSE_COMPANY = {
  wolf: { name: 'LONE WOLF', origin: 'wolf', start: 125,
    men: d => Math.round(lerp([[1, 1], [5, 1], [8, 2], [12, 4], [16, 7], [20, 10], [25, 11], [30, 12]], d)),
    wolfLevel: d => Math.round(lerp([[1, 4], [10, 5], [20, 7], [30, 9], [40, 10]], d)),
    hireLevel: d => Math.round(lerp([[5, 2], [12, 3], [20, 5], [30, 7], [40, 8]], d)),
    gear: d => d >= 20 ? 'late' : d >= 10 ? 'middle' : 'early' },
  /* A FRESH COMPANY: A New Crew's three companions as the door rolls them (level 2, their kit), a hire every few days to twelve by day 40,
     the town's shelf from day 20, the city's from day 40 (what a company that size can pay for, DIFFICULTY's stash line) */
  fresh: { name: 'FRESH COMPANY', origin: 'newcrew', start: 125,
    men: d => Math.round(lerp([[1, 3], [5, 4], [10, 6], [20, 9], [40, 12]], d)),
    hireLevel: d => Math.round(lerp([[1, 1], [10, 2], [20, 4], [40, 7]], d)),
    doorLevel: d => Math.round(lerp([[1, 2], [10, 3], [20, 5], [40, 8]], d)),
    gear: d => d >= 40 ? 'late' : d >= 20 ? 'middle' : 'early' },
  /* HIS WAY (Paolo 11/3: 'the people have to be rare... I just buy them [gear for] 21 and nothing can stop me'): the Lone Wolf in his own
     kit, and every hire one of the post's rare men (records/target/bb/rare_recruits.json: rolled in the top quarter of his background,
     his stars, his plan, level 2 or 3 and climbing), each in THE CHEAPEST KIT of his kind (CHEAP below), never upgraded */
  mine: { name: 'HIS WAY', origin: 'wolf', start: 125,
    men: d => Math.round(lerp([[1, 1], [5, 1], [8, 2], [12, 4], [16, 7], [20, 10], [25, 11], [30, 12]], d)),
    wolfLevel: d => Math.round(lerp([[1, 4], [10, 5], [20, 7], [30, 9], [40, 10]], d)),
    hireLevel: d => Math.round(lerp([[5, 3], [12, 4], [20, 6], [30, 8], [40, 9]], d)) }
};
/* THE CHEAPEST KIT OF HIS KIND (his 'gear for 21'): the bottom row the smith sells of the class his rare kit carries, a car door for the
   one who carries a shield, and the cloth: padded_surcoat (50, 9 batteries) and aketon_cap (40, 7). About 21 batteries a man. */
const CHEAP = { mace: 'wooden_stick', sword: 'broken_ancient_sword', crossbow: 'light_crossbow', body: 'padded_surcoat', head: 'aketon_cap', off: 'wooden_shield' };
function skullsOn(d) { return d <= 3 ? 1 : d <= 7 ? 2 : 3; }
/* the close measure's two jobs a day: the routine one and the tough one */
function jobsOn(d) { return d <= 3 ? [1, 2] : [2, 3]; }
const STATS8 = ['hp', 'fatigue', 'resolve', 'initiative', 'melee_skill', 'ranged_skill', 'melee_defense', 'ranged_defense'];
const STAT_KEY = { hp: 'HP', fatigue: 'Fatigue', resolve: 'Resolve', initiative: 'Initiative', melee_skill: 'Melee Skill', ranged_skill: 'Ranged Skill', melee_defense: 'Melee Defense', ranged_defense: 'Ranged Defense' };
function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function rollRange(txt, R) { const m = String(txt).split('-').map(Number); const a = m[0], b = m.length > 1 ? m[1] : m[0]; return a + Math.floor(R() * (b - a + 1)); }
/* a man's level-ups from level `from` to `to`, his plan's first four stats on his star column (engine/bohemia_roster.js levelUp + raise) */
function grow(st, from, to, plan, stars, R) {
  const XP = J('records/target/bb/rules.json').experience, G = XP.stat_gains_by_stars.value, pick = XP.per_level.value.attributes_raised;
  for (let l = from + 1; l <= Math.min(11, to); l++) plan.slice(0, pick).forEach(k => { st[k] += rollRange(G[STAT_KEY[k]][(stars || {})[k] || 0], R); });
  for (let l = Math.max(12, from + 1); l <= to; l++) plan.slice(0, pick).forEach(k => { st[k] += XP.veteran_level_rules.value.max_per_stat; });
  return st;
}
function talentsOf(R) {
  const O = J('records/target/bb/rules.json').experience.talent_star_odds.value, pool = STATS8.slice(), st = {};
  for (let s = 0; s < 3; s++) { const k = pool.splice(Math.floor(R() * pool.length), 1)[0], q = R(); st[k] = q < O['1'] ? 1 : q < O['1'] + O['2'] ? 2 : 3; }
  return st;
}
const GUN_JOBS = ['rifle', 'shotgun', 'pistol'];
/* a hire of the crew rows who has climbed to `lv`: rolled in his background's range, his talents, his plan by his arm */
function hireStats(bgId, job, lv, R, floor) {
  const bg = J('records/target/bb/backgrounds.json').rows.filter(r => r.id === bgId)[0], st = {};
  STATS8.forEach(k => { const r = bg.stats[k], lo = r[0] + Math.ceil((r[r.length - 1] - r[0]) * (floor || 0)), hi = r[r.length - 1]; st[k] = lo + Math.floor(R() * (hi - lo + 1)); });
  const plans = J('records/target/bb/recruit_ceiling.json').plans.value, plan = GUN_JOBS.indexOf(job) >= 0 ? plans.gun : plans.melee;
  return grow(st, 1, lv, plan, talentsOf(R), R);
}

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
/* TUNING 2: the close measure's companies, every man climbed to the day's level */
function closeCompanyFor(key, d, seed) {
  const C = CLOSE_COMPANY[key], n = C.men(d), R = mulberry(seed * 31 + 7), men = [];
  if (key === 'wolf' || key === 'mine') {
    const w = (DOOR.roll('wolf', seed) || [{ background: 'hedge_knight', level: 4 }])[0];
    const me = JSON.parse(JSON.stringify(w)), to = C.wolfLevel(d); me.main = true;
    if (me.stats) grow(me.stats, me.level, to, me.plan || [], me.stars || {}, R);
    me.level = to;
    if (key === 'wolf') { const stage = C.gear(d); if (stage !== 'early' && me.gear) { const g = G.GEAR[stage]; me.gear = Object.assign({}, me.gear, { body: g.body, head: g.head }); } }
    men.push(me);
  }
  if (key === 'wolf' && n > 1) G.companyOf(Math.max(6, n), C.gear(d)).slice(0, n - 1).forEach((m, i) => {
    const job = J('records/target/bb/ours.json').crew.value[(i + 1) % 12].jobs.filter(j => j !== 'car_door')[0];
    m.level = C.hireLevel(d); m.stats = hireStats(m.background, job, m.level, mulberry(seed + 101 * (i + 1))); men.push(m); });
  if (key === 'mine') {
    const RR = J('records/target/bb/rare_recruits.json'), W = J('records/target/bb/weapons.json').rows;
    for (let i = 1; i < n; i++) {
      const spec = RR.men[(i - 1) % RR.men.length], r = mulberry(seed + 977 * i), lv0 = RR.levels[0] + Math.floor(r() * (RR.levels[1] - RR.levels[0] + 1));
      const st = hireStats(spec.background, null, 1, r, RR.stat_floor);   /* rolled in the top quarter, as the post rolls him */
      /* hireStats grew nothing at level 1; his own stars and plan from the file, to the post's level, then to the day's */
      grow(st, 1, Math.max(lv0, C.hireLevel(d)), spec.plan, spec.stars, r);
      const cls = (W.filter(x => x.id === spec.kit.main)[0] || {})['class'];
      men.push({ background: spec.background, level: Math.max(lv0, C.hireLevel(d)), stats: st, name: 'RARE ' + i,
        gear: OWN_KIT ? { main: spec.kit.main, off: spec.kit.off || null, body: spec.kit.body || null, head: spec.kit.head || null }   /* --own-kit: as the post dresses him */
          : { main: CHEAP[cls] || spec.kit.main, off: spec.kit.off ? CHEAP.off : null, body: CHEAP.body, head: CHEAP.head } });
    }
  }
  if (key === 'fresh') {
    const door = DOOR.roll('newcrew', seed) || [];
    door.forEach((m, i) => { if (i >= n) return; const me = JSON.parse(JSON.stringify(m)), to = C.doorLevel(d);
      if (me.stats) grow(me.stats, me.level, to, me.plan || [], me.stars || {}, R); me.level = to; if (i === 0) me.main = true;
      const stage = C.gear(d); if (stage !== 'early' && me.gear) { const g = G.GEAR[stage]; me.gear = Object.assign({}, me.gear, { body: g.body, head: g.head }); }
      men.push(me); });
    if (n > door.length) G.companyOf(12, C.gear(d)).slice(door.length, n).forEach((m, i) => {
      const job = J('records/target/bb/ours.json').crew.value[(i + door.length) % 12].jobs.filter(j => j !== 'car_door')[0];
      m.level = C.hireLevel(d); m.stats = hireStats(m.background, job, m.level, mulberry(seed + 211 * (i + 1))); men.push(m); });
  }
  return men;
}
function one(key, lvl, d, skulls, k, PM) {
  const seed = 7000 + k * 131 + d * 17 + skulls * 3 + lvl.dif * 1000;
  const company = CLOSE ? closeCompanyFor(key, d, 4242 + k * 977) : companyFor(key, d, 4242 + k * 977);
  const str = strengthOf(company.map(m => m.level || 1));
  const job = jobParty(PM, str, skulls, d, lvl.dif, company.length);
  const faction = FACTIONS[k % FACTIONS.length];
  const F = CTX.FIGHT, W = { district: 'subs', cell: { x: 11 + (k % 29), y: 7 + (k % 31) } };
  CTX.setSeed(seed);
  F.setup({ auto: true, formation: null, company, cap: Math.max(12, company.length), party: { faction, count: job.count, days: job.days, difficulty: lvl.dif },
    days: job.days, district: W.district, cell: W.cell, act: 1 });
  F.S.deploy = false;
  const S = F.S; let g = 0;
  const mine0 = S.units.filter(u => u.side === 'you'), low = new Map(mine0.map(u => [u.id, u.hp]));
  while (!S.over && S.round <= 60 && g++ < 200000) {
    const v = F.current(); if (!v) break; F.aiStep(v);
    /* THE LOWEST HE STOOD AT (370(6)): read after every step, so a bleed, a fire or a blow all count */
    if (CLOSE) for (const u of mine0) if (!u.down && !u.dead && !u.fled && u.hp < low.get(u.id)) low.set(u.id, u.hp);
  }
  const mine = S.units.filter(u => u.side === 'you'), them = S.units.filter(u => u.side === 'them');
  const out = { won: S.result === 'won' ? 1 : 0, down: mine.filter(u => u.down && !u.dead).length, dead: mine.filter(u => u.dead).length,
    men: mine.length, enemies: them.length, champs: them.filter(u => /champion/.test(u.kind || '')).length, str, count: job.count, dress: job.days };
  if (CLOSE) {
    const byId = new Map(S.units.map(u => [u.id, u]));
    let hits = 0, big = 0, bigBare = 0, bare = 0, maxHit = 0;
    S.log.forEach(e => { if (e.t !== 'attack' || !e.hit) return; const a = byId.get(e.id), t = byId.get(e.to); if (!a || !t || a.side !== 'them' || t.side !== 'you') return;
      hits++; const half = (e.hp || 0) >= 0.5 * (t.hpWhole || t.hpMax); if (half) big++; maxHit = Math.max(maxHit, (e.hp || 0) / (t.hpWhole || t.hpMax)); });
    const struck = mine.filter(u => u.down || u.dead);
    out.struck = struck.length;
    out.hpLeft = mine.reduce((t, u) => t + (u.down || u.dead ? 0 : Math.max(0, u.hp) / u.hpMax), 0) / Math.max(1, mine.length);
    out.hpWorst = mine.reduce((m, u) => Math.min(m, u.down || u.dead ? 0 : Math.max(0, u.hp) / u.hpMax), 1);
    out.near = mine.filter(u => !(u.down || u.dead) && low.get(u.id) <= 0.25 * u.hpMax).length;
    out.hits = hits; out.big = big; out.maxHit = maxHit; out.rounds = S.round;
    out.nobodyHurt = mine.every(u => !(u.down || u.dead) && low.get(u.id) > 0.5 * u.hpMax) ? 1 : 0;
  }
  return out;
}

const TRY = JSON.parse(arg('--try', '{}'));
function put(o, k, v) { const p = k.split('.'); let t = o; for (let i = 0; i < p.length - 1; i++) t = t[p[i]] = t[p[i]] || {}; t[p[p.length - 1]] = v; }
async function shard(i, m, n) {
  await boot();
  const PM = J('records/target/bb/party_math.json'), out = [];
  Object.keys(TRY.pm || {}).forEach(k => put(PM, k, TRY.pm[k]));
  Object.keys(TRY.ours || {}).forEach(k => put(CTX.DB.ours, k, TRY.ours[k]));
  const KEYS = CLOSE ? (arg('--companies', 'wolf,fresh,mine')).split(',') : Object.keys(COMPANY);
  for (const key of KEYS) for (const lvl of LEVELS) for (const d of DAYS) {
    const jobs = CLOSE ? jobsOn(d) : skullsOn(d) === 3 ? [2, 3] : [skullsOn(d)];
    for (const sk of jobs) for (let k = 0; k < n; k++) {
      if (((d * 7 + k + sk) % m) !== i) continue;
      const r = one(key, lvl, d, sk, k, PM); r.key = key; r.level = lvl.id; r.day = d; r.skulls = sk; out.push(r);
    }
  }
  return out;
}

/* TUNING 2: the close summary, one cell per company, level, day and job (routine or tough) */
function summariseClose(rows) {
  const cells = {}, F = ['won', 'struck', 'down', 'dead', 'hpLeft', 'hpWorst', 'near', 'hits', 'big', 'maxHit', 'rounds', 'men', 'enemies', 'champs', 'dress', 'nobodyHurt'];
  rows.forEach(r => { const jb = jobsOn(r.day).indexOf(r.skulls) === 0 ? 'routine' : 'tough', id = [r.key, r.level, r.day, jb].join('|');
    const c = cells[id] || (cells[id] = Object.assign({ key: r.key, level: r.level, day: r.day, job: jb, skulls: r.skulls, n: 0 }, ...F.map(f => ({ [f]: 0 })))); c.n++; F.forEach(f => { c[f] += r[f] || 0; }); });
  const r2 = x => +x.toFixed(2);
  const list = Object.values(cells).map(c => ({ key: c.key, level: c.level, day: c.day, job: c.job, skulls: c.skulls, n: c.n,
    won: Math.round(100 * c.won / c.n), struckPerFight: r2(c.struck / c.n), deadPerFight: r2(c.dead / c.n),
    hpLeft: Math.round(100 * c.hpLeft / c.n), hpWorst: Math.round(100 * c.hpWorst / c.n), nearPerFight: r2(c.near / c.n),
    bigHitShare: Math.round(100 * c.big / Math.max(1, c.hits)), theirHitsPerFight: r2(c.hits / c.n), biggestHit: Math.round(100 * c.maxHit / c.n),
    nobodyHurt: Math.round(100 * c.nobodyHurt / c.n), rounds: r2(c.rounds / c.n), men: Math.round(c.men / c.n), enemies: +(c.enemies / c.n).toFixed(1),
    champsPerFight: r2(c.champs / c.n), dressDay: Math.round(c.dress / c.n) }));
  const ord = { wolf: 0, fresh: 1, mine: 2 }, lo = { new: 0, seen: 1, out: 2 };
  list.sort((a, b) => (ord[a.key] - ord[b.key]) || (lo[a.level] - lo[b.level]) || a.day - b.day || a.skulls - b.skulls);
  return { cells: list };
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
    const p = cp.spawn(process.execPath, [__filename, '--shard', i + '/' + m, String(n)].concat(argv.indexOf('--try') >= 0 ? ['--try', arg('--try')] : []).concat(argv.indexOf('--days') >= 0 ? ['--days', arg('--days')] : []).concat(CLOSE ? ['--close'] : []).concat(OWN_KIT ? ['--own-kit'] : []).concat(argv.indexOf('--companies') >= 0 ? ['--companies', arg('--companies')] : []), { stdio: ['ignore', 'pipe', 'inherit'] });
    let s = ''; p.stdout.on('data', b => { s += b; }); p.on('close', c => c ? rej(new Error('shard ' + i + ' exit ' + c)) : res(JSON.parse(s)));
  })));
  const rows = [].concat.apply([], parts);
  if (CLOSE) {
    const sum = summariseClose(rows);
    sum.tag = tag; sum.n = n; sum.draft = true; sum.at = new Date().toISOString(); sum.days = DAYS;
    sum.about = 'TUNING 2 [the fight is close] 11/3 (rule 370(6)), tools/bohemia_difficulty_the_curve.js --close: the live fight, AUTO both sides, the map\'s job math; '
      + 'won in 100, men struck down a fight, health left (the share of the company\'s whole health standing at the end, a man down 0), the worst man\'s health left, '
      + 'near-deaths a fight (a man who stood at a quarter of his health or less and lived), big hits (the share of the enemy\'s landed hits that took half a man or more), '
      + 'nobody hurt (fights where no man of his went under half); draft:true, nothing in the game reads this file';
    if (outf) fs.writeFileSync(path.resolve(ROOT, outf), JSON.stringify(sum, null, 1));
    sum.cells.forEach(c => console.log([c.key.padEnd(5), c.level.padEnd(4), ('d' + c.day).padEnd(3), c.job.padEnd(7), 'won ' + String(c.won).padStart(3), 'struck ' + c.struckPerFight, 'dead ' + c.deadPerFight,
      'hp ' + c.hpLeft + '%', 'worst ' + c.hpWorst + '%', 'near ' + c.nearPerFight, 'big ' + c.bigHitShare + '%', 'max ' + c.biggestHit + '%', 'clean ' + c.nobodyHurt, c.men + 'v' + c.enemies, 'r' + c.rounds].join('  ')));
    return;
  }
  const sum = summarise(rows);
  sum.tag = tag; sum.n = n; sum.draft = true; sum.at = new Date().toISOString();
  sum.about = 'DIFFICULTY [the curve] 11/3, tools/bohemia_difficulty_the_curve.js: the live fight, AUTO both sides, the map\'s job math; draft:true, nothing in the game reads this file';
  if (outf) fs.writeFileSync(path.resolve(ROOT, outf), JSON.stringify(sum, null, 1));
  sum.cells.filter(c => c.skulls === skullsOn(c.day)).forEach(c => console.log([c.key, c.level, 'day ' + c.day, c.skulls + ' skulls', 'won ' + c.won, 'down ' + c.downPerFight, 'dead ' + c.deadPerFight, c.men + ' v ' + c.enemies, 'dress ' + c.dressDay, 'champs ' + c.champsPerFight].join('  ')));
  Object.keys(sum.stash).forEach(k => console.log('stash', k, JSON.stringify(sum.stash[k])));
})().catch(e => { console.error(e); process.exit(1); });
