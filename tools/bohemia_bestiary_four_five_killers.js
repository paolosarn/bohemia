#!/usr/bin/env node
// BESTIARY 4 11/27 -- FIVE KILLERS AGAINST THE HARDEST WORK (VAMILY rules 491(a), 493(a)(d)).
// Paolo 11/27: 'I have five combat people [that] were absolute killers and there's no more challenges, nothing else to do.'
//
// The LIVE fight (slices/BOHEMIA_FIGHT.html fight-data and fight-rules, plain, both sides on AUTO, seeded; tools/
// bohemia_tuning_the_whole_grid.js engine) plays the map's own job party (slices/BOHEMIA_CITY_WORLD.html partyMath 'job', copied
// below line for line off records/target/bb/party_math.json) against a company, for each star of job, for each faction a job sends:
//   FIVE KILLERS   five men at level 11 (Battle Brothers' last perk level, the wiki's experience table) in the city shelf's
//                  kit (210 body, 210 head, the late weapons: the 'late' stage; the 300-and-300 'endgame' kit spends a man's breath in one swing), day 90
//   STRONG TWELVE  JOBS 2's strong company: twelve at level 8 in the city shelf, day 90
// It reads: the count the map sends, the day the party is dressed for (its phase), the band's armour and kinds, a champion in it,
// his win in 100, his men struck down a fight. Nothing in the game reads this file.
//   node tools/bohemia_bestiary_four_five_killers.js [--n 16] [--who killers|twelve|both] [--json out.json]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const G = require('./bohemia_tuning_the_whole_grid.js');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const N = +arg('--n', 16), WHO = arg('--who', 'both'), OUT = arg('--json', null);
const PM = J('records/target/bb/party_math.json');
const ARM = (() => { const a = J('records/target/bb/armor.json'), m = {}; ['head', 'body'].forEach(k => (a[k] || []).forEach(r => { if (r && r.id) m[r.id] = +r.durability || 0; })); return m; })();
const FACTIONS = (arg('--factions', '') || 'brigands,house,heavies,hired').split(',');

/* the map's job math, as slices/BOHEMIA_CITY_WORLD.html partyMath plays it (job_bb; the SEEN IT level, the door's default) */
function strengthOf(company) {
  const R = PM.roster_strength.value, kp = +R.kit_per_armour || 0;
  const each = company.map(m => R.per_man + R.per_level * (m.level - 1) + kp * ((ARM[(m.gear || {}).head] || 0) + (ARM[(m.gear || {}).body] || 0)));
  const use = each.sort((a, b) => b - a).slice(0, R.strongest);
  return { strength: Math.round(use.reduce((t, s) => t + s, 0) * 10) / 10, counted: use.length };
}
function dressDay(str, T) {
  if (str <= T[0][0]) return T[0][1];
  for (let i = 1; i < T.length; i++) if (str <= T[i][0]) return Math.round(T[i - 1][1] + (T[i][1] - T[i - 1][1]) * (str - T[i - 1][0]) / (T[i][0] - T[i - 1][0]));
  return Math.min(PM.day_cap.value || 100, Math.round(T[T.length - 1][1] + (str - T[T.length - 1][0]) / 4));
}
function jobParty(cs, skulls, day) {
  const B = PM.job_bb.value, P = PM.job.value, dif = 1, mult = PM.difficulty_count_mult.value[dif];
  const G0 = B.grows; let strC = cs.strength, t = 0;
  if (G0 && G0.small && cs.counted < G0.like_men) { const sm = G0.small; t = Math.max(0, Math.min(1, (cs.strength / cs.counted - sm.from_per_man) / (sm.full_per_man - sm.from_per_man))); strC = cs.strength * Math.pow(G0.like_men / cs.counted, sm.exp * t); }
  const bm = Math.max(B.mult_min, Math.min(B.mult_max, B.k * Math.pow(strC / 100, B.exp)));
  const raw = (B.base_men[String(skulls)] || B.base_men['2']) * bm * mult;
  /* __THE_ENEMY_GROWS_WITH_HIS_COMPANY__ (when the data carries it): the dress reads his men as they are, a company of men like his */
  const G2 = B.grows || null, dressStr = G2 && cs.counted && cs.counted < G2.like_men ? cs.strength * Math.pow(G2.like_men / cs.counted, t) : cs.strength;
  const A = B.dress_ahead, m = (A && A.mult && A.mult[dif]) || 1;
  const days = Math.min(dressDay(dressStr, B.dress), Math.min(PM.day_cap.value || 100, Math.round(day + Math.max(0, day - ((A && A.from_day) | 0)) * (m - 1))));
  const mx = (P.max_by_difficulty && P.max_by_difficulty[dif]) || P.max;
  const n = Math.max(P.min, Math.min(mx, Math.floor(raw + 0.5)));
  return { count: n, days, difficulty: dif, over: G2 && raw > n + 0.5 ? +(Math.max(1, raw / n)).toFixed(3) : 1, raw: +raw.toFixed(2), strength: cs.strength, dressStr: Math.round(dressStr) };
}

/* HIS MEN AS THE GAME GROWS THEM (engine/bohemia_roster.js levelUp/raise: every level rolls the eight stats on his star column and he
   takes per_level.attributes_raised of them; the calculator's plans, CEIL_DEF): each man's background at its middle, then every level
   past one adds his plan's first four stats at the one-star column's mean (records/target/bb/rules.json experience.stat_gains_by_stars;
   60 in 100 men have one star, talent_star_odds). A man of level 11 in the fight is what the crew screen made him, never a recruit */
const RULES = J('records/target/bb/rules.json').experience, BGS = J('records/target/bb/backgrounds.json').rows, CREW = J('records/target/bb/ours.json').crew.value;
const PLANS = { melee: ['melee_skill', 'melee_defense', 'ranged_defense', 'hp'], gun: ['ranged_skill', 'melee_defense', 'hp', 'fatigue'] };
const SKEY = { hp: 'HP', fatigue: 'Fatigue', resolve: 'Resolve', initiative: 'Initiative', melee_skill: 'Melee Skill', ranged_skill: 'Ranged Skill', melee_defense: 'Melee Defense', ranged_defense: 'Ranged Defense' };
const mean = t => { const m = String(t).split('-').map(Number); return (m[0] + m[m.length - 1]) / 2; };
function grown(men) {
  const G = RULES.stat_gains_by_stars.value, pick = RULES.per_level.value.attributes_raised;
  return men.map((m, i) => { const bg = BGS.filter(r => r.id === m.background)[0], st = {};
    Object.keys(bg.stats).forEach(k => st[k] = Math.round((bg.stats[k][0] + bg.stats[k][bg.stats[k].length - 1]) / 2));
    const jobs = CREW[i % CREW.length].jobs || [], plan = jobs.some(j => /rifle|pistol|shotgun|bottles/.test(j)) ? PLANS.gun : PLANS.melee;
    for (let l = 1; l < (m.level || 1); l++) plan.slice(0, pick).forEach(k => st[k] += mean(G[SKEY[k]][1]));
    Object.keys(st).forEach(k => st[k] = Math.round(st[k]));
    return Object.assign({}, m, { stats: st }); });
}
async function main() {
  const ctx = await G.engine(true, null), F = ctx.FIGHT, DB = ctx.DB;
  const companies = [];
  if (WHO !== 'twelve') companies.push({ id: 'killers', name: 'FIVE KILLERS: 5 men, level 11, the city shelf, day 90', men: grown(G.companyOf(5, 'late').map(m => Object.assign({}, m, { level: 11 }))), day: 90 });
  if (WHO !== 'killers') companies.push({ id: 'twelve', name: 'STRONG TWELVE: 12 men, level 8, the city shelf, day 90', men: grown(G.companyOf(12, 'late').map(m => Object.assign({}, m, { level: 8 }))), day: 90 });
  const rows = [];
  for (const C of companies) {
    const cs = strengthOf(C.men);
    console.log(`\n${C.name}: strength ${cs.strength}; YOU ${JSON.stringify(C.men[0].stats)}`);
    for (const skulls of [1, 2, 3]) {
      const P = jobParty(cs, skulls, C.day);
      for (const fac of FACTIONS) {
        const T = { won: 0, lost: 0, stall: 0, down: 0, armour: 0, hp: 0, foes: 0, champ: 0, kinds: {} };
        for (let k = 0; k < N; k++) {
          ctx.setSeed(9100 + k);
          F.setup({ auto: true, formation: null, company: C.men, cap: 12, party: { faction: fac, count: P.count, days: P.days, difficulty: P.difficulty, over: P.over, skulls: skulls }, days: P.days });
          const them = F.S.units.filter(u => u.side === 'them');
          them.forEach(u => { T.armour += (u.armH || 0) + (u.armB || 0); T.hp += u.hp || 0; T.kinds[u.kind] = (T.kinds[u.kind] || 0) + 1; });
          T.foes += them.length; if (them.some(u => u.champion)) T.champ++;
          let g = 0; const idle = G.idleWatch(F);
          while (!F.S.over && g < 400000) { const u = F.current(); if (!u) break; F.aiStep(u); g++; if (idle()) break; }
          const S = F.S, ids = new Set(S.units.filter(u => u.side === 'you').map(u => u.id));
          if (!S.over) T.stall++; else if (S.result === 'won') T.won++; else T.lost++;
          S.log.forEach(e => { if ((e.t === 'down' || e.t === 'dead') && ids.has(e.id)) T.down++; });
        }
        const top = Object.keys(T.kinds).sort((a, b) => T.kinds[b] - T.kinds[a]).slice(0, 4).map(k => k + ' ' + (T.kinds[k] / N).toFixed(1)).join(', ');
        const row = { company: C.id, skulls, faction: fac, count: P.count, raw: P.raw, over: P.over, dressed_for_day: P.days, foes: +(T.foes / N).toFixed(1),
          armour_a_man: Math.round(T.armour / Math.max(1, T.foes)), hp_a_man: Math.round(T.hp / Math.max(1, T.foes)), champion_in_100: Math.round(100 * T.champ / N),
          won_in_100: Math.round(100 * T.won / N), down_a_fight: +(T.down / N).toFixed(2), kinds: top };
        rows.push(row);
        console.log(`  ${skulls} skull  ${fac.padEnd(8)} ${String(row.foes).padStart(4)} of them (math ${P.raw}, past the most x${P.over})  dressed day ${String(P.days).padStart(3)}  armour ${String(row.armour_a_man).padStart(3)}  hp ${String(row.hp_a_man).padStart(3)}  champion ${String(row.champion_in_100).padStart(3)}  WON ${String(row.won_in_100).padStart(3)}  down ${row.down_a_fight}  | ${top}`);
      }
    }
  }
  if (OUT) fs.writeFileSync(path.join(ROOT, OUT), JSON.stringify({ n: N, rows }, null, 1));
}
module.exports = { grown, jobParty, strengthOf, PM };
if (require.main === module) main().catch(e => { console.error(e.stack || e.message); process.exit(1); });
