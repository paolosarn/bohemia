#!/usr/bin/env node
// TUNING [how long a life is] 10/18 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g; rule 88: a page, no sheet).
// His 9/27 vote: 'a random variable number, procedure generated, how old people can live... come up with a mechanic
// that's fun'. Measures THREE candidate rule sets for dying of age across the three acts, under the rulings that bound
// it: AN ACT IS A YEAR (rule 84, 300 to 450 days), a fold is about 30 years (canon), the future is computed from the
// past (rule 31), EASIER THAN BATTLE BROTHERS (rule 117). Seeded, so every number below can be argued with.
// Writes banks/BOHEMIA_TUNING_LIFESPANS_THREE_SETS_10_18_26.json with --write. Nothing in the game reads it.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
let seed = 1; const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; // mulberry32
const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const FOLD = 30, B = 6e-5, G = Math.LN2 / 8.2;
// the times: act 1 is the ruin (second votes: the game starts in the ruin and the future gets better); acts 2 and 3
// are HARD or GOOD by what the earlier acts did (rule 31). Two futures measured: played well (crash, hard, good) and
// played badly (crash, crash, hard; the third votes: the future goes both ways).
const FUTURES = { well: ['crash', 'hard', 'good'], badly: ['crash', 'crash', 'hard'] };
const SETS = {
  A_THE_REAL_ROLL: {
    plain: 'a yearly risk that doubles every 8.2 years, plus bad luck; the times set both (my 9/28 page, the real curve)',
    times: { crash: { A: 0.005, m: 1.8 }, hard: { A: 0.002, m: 1.3 }, good: { A: 0.0005, m: 1.0 } },
    floor: 0, omen: 0.03, kind: 'gompertz',
  },
  B_THE_KIND_ROLL: {
    plain: 'the same curve with the bad luck taken out (violence lives in the fight, never in the dice), the stress softer, nobody dies of age before 60, and the body shows it at least one act before',
    times: { crash: { A: 0, m: 1.4 }, hard: { A: 0, m: 1.15 }, good: { A: 0, m: 1.0 } },
    floor: 60, omen: 0.02, kind: 'gompertz',
  },
  C_THE_STORY_SPAN: {
    plain: 'every person rolls the age they will die at on the day you meet them (a bell around a middle set by the times), never re-rolled, and the stoop comes five years before',
    times: { crash: { mean: 72 }, hard: { mean: 78 }, good: { mean: 84 } },
    sd: 7, clamp: [58, 100], omenYears: 5, kind: 'span',
  },
};
// one person, met in act 1 at a given age; returns the age they die of age (or 120 if never)
function lifeOf(set, ageMet, future) {
  if (set.kind === 'span') {
    // the span re-rolls its middle by the times of the act in which the person is, nudged once per fold (rule 31)
    let dieAt = Math.max(set.clamp[0], Math.min(set.clamp[1], set.times[future[0]].mean + set.sd * gauss()));
    if (dieAt < ageMet) dieAt = ageMet + rnd() * 3;   /* already past his middle: he goes inside the next three years */
    // a better future gives years back (Russia's men got theirs back): the difference of the middles, half of it
    const back = (set.times[future[1]].mean - set.times[future[0]].mean) / 2 + (set.times[future[2]].mean - set.times[future[1]].mean) / 2;
    if (dieAt > ageMet + FOLD) dieAt = Math.min(set.clamp[1], dieAt + back);
    return Math.floor(dieAt);
  }
  for (let year = 0; year < 120 - ageMet; year++) {
    const age = ageMet + year, act = Math.min(2, Math.floor(year / FOLD)), t = set.times[future[act]];
    if (age < set.floor) continue;
    const h = t.A + B * Math.exp(G * age) * t.m;
    if (rnd() < 1 - Math.exp(-h)) return age;
  }
  return 120;
}
// a town's named people in act 1: an age pyramid for a hard place (more young than old), adults 18 to 85
function pyramid() { let a; do { a = 18 + Math.floor(-Math.log(rnd()) * 22); } while (a > 85); return a; }
const N = 20000, out = {};
for (const [name, set] of Object.entries(SETS)) {
  out[name] = { plain: set.plain };
  for (const [fname, future] of Object.entries(FUTURES)) {
    seed = 1;
    const met = { 20: [], 40: [], 60: [] }, deaths = [];
    for (const a of [20, 40, 60]) for (let i = 0; i < N; i++) met[a].push(lifeOf(set, a, future));
    // deaths of age inside ONE act (one year) among 40 named people, and over a fold among the same 40
    let inAct = 0, overFold = 0, early = 0, total = 0;
    const R = 2000;
    for (let r = 0; r < R; r++) for (let i = 0; i < 40; i++) {
      const a = pyramid(), d = lifeOf(set, a, future);
      if (d === a) inAct++;
      if (d < a + FOLD) overFold++;
      if (d < a + FOLD && d < 60) early++;
      total++; deaths.push(d);
    }
    const alive = (arr, years) => Math.round(100 * arr.filter(d => d > arrAge(arr) + years).length / arr.length);
    const arrAge = arr => (arr === met[20] ? 20 : arr === met[40] ? 40 : 60);
    const sorted = met[20].slice().sort((x, y) => x - y), q = p => sorted[Math.floor(p * sorted.length)];
    out[name][fname] = {
      future: future.join(' > '),
      of_100_met_at_20_alive_in_act_2: alive(met[20], FOLD), of_100_met_at_20_alive_in_act_3: alive(met[20], 2 * FOLD),
      of_100_met_at_40_alive_in_act_2: alive(met[40], FOLD), alive_in_act_3: undefined,
      of_100_met_at_40_alive_in_act_3: alive(met[40], 2 * FOLD),
      of_100_met_at_60_alive_in_act_2: alive(met[60], FOLD),
      deaths_of_age_in_one_act_among_40_named: +(inAct / R).toFixed(2),
      deaths_of_age_across_one_fold_among_40_named: +(overFold / R).toFixed(1),
      share_of_age_deaths_before_60_pct: +(100 * early / Math.max(1, overFold)).toFixed(1),
      met_at_20_dies_of_age_p10_median_p90: [q(0.1), q(0.5), q(0.9)].map(Math.round),
    };
    delete out[name][fname].alive_in_act_3;
  }
}
console.log(JSON.stringify(out, null, 1));
if (process.argv.includes('--write')) {
  fs.writeFileSync(path.join(ROOT, 'banks/BOHEMIA_TUNING_LIFESPANS_THREE_SETS_10_18_26.json'), JSON.stringify({
    _readme: 'TUNING [how long a life is] 10/18 (rule 38g research only; rules 84, 31, 117). draft:true. NOTHING IN THE GAME READS THIS FILE. Three candidate rule sets for dying of age, measured by tools/bohemia_tuning_lifespans_sim.js (seed 1, 20,000 lives a cell; 2,000 towns of 40 named people). Record: records/BOHEMIA_TUNING_HOW_LONG_A_LIFE_IS_THREE_SETS_ACROSS_THREE_ACTS_10_18_26.md',
    draft: true, schema: 1, fold_years: FOLD, gompertz: { B, doubling_years: 8.2 }, sets: SETS, measured: out,
  }, null, 1) + '\n');
  console.log('wrote banks/BOHEMIA_TUNING_LIFESPANS_THREE_SETS_10_18_26.json');
}
