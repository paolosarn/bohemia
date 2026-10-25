#!/usr/bin/env node
// WORLD [most jobs fit the company] 10/25 -- THE MEASUREMENT FIRST (rule 192(d)).
// Paolo 10/25: 'I don't know why the game is so in love with throwing overpowered enemies in like 75% of the quests that I take...
// look how Battle Brothers does it.'
//
// The LIVE fight (slices/BOHEMIA_FIGHT.html's fight-data and fight-rules, plain, no hooks: TUNING's engine, tools/
// bohemia_tuning_the_whole_grid.js) plays a job's party against his company, both sides on the fight's own brain (AUTO), seeded,
// at four points of a game (day 1, 20, 50, 90), for each star of job (the board's skulls, 1 to 3):
//   THE PARTY   the map's own job math (slices/BOHEMIA_CITY_WORLD.html partyMath 'job': records/target/bb/party_math.json, his
//               roster's strength and the job's skulls; the day-one cap), or the math under test (--math bb: Battle Brothers'
//               contract multiplier off Grok's ask 105, 0.94 x (strength / 100)^0.89 held to 0.75..5)
//   THE COMPANY day 1: A New Crew (the origin's three, their own kit); day 20: six men at level 3, their kit; day 50: nine at level 5
//               in the town's shelf; day 90: twelve at level 8 in the city's shelf (TUNING's gear rows)
//   WHAT IT READS  his win in 100 (the fight won), the share of fights where a man of theirs OUTCLASSES YOU from the first look (the
//               fight's own classOf rule: three levels over his best, or DODGES and ARMOUR both), men of his struck down
//   AND THE BOARDS  the share of offered jobs of each star on a town's board (the shelf's skulls by tier) and on the phone (its two
//               best paid), so 'the share of jobs that outclass him' is weighted by what is actually offered
//   node tools/bohemia_world_most_jobs_fit.js [--n 40] [--math bb|old] [--dress strength|calendar] [--base a,b,c] [--small 1] [--json out.json]
// Every number it prints is a MEASUREMENT of the game as it is (or with the math under test); nothing in the game reads it.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const G = require('./bohemia_tuning_the_whole_grid.js');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const N = +arg('--n', 40), OUT = arg('--json', null);
const PM = J('records/target/bb/party_math.json'), SHELF = J('records/target/BOHEMIA_BOARD_SHELF.json');
/* the game as it plays: Battle Brothers' contract math (party_math.json job_bb) dressed for the company's strength; --math old
   --dress calendar is the math before rule 192 (one enemy a man, dressed for the calendar), for the before-and-after */
const MATH = arg('--math', PM.job_bb ? 'bb' : 'old');

/* the four points of a game: the company as it would stand (Battle Brothers' company is about level 3 by day 20, 5 by day 50, 8
   by day 90 on the wiki's experience table; the gear is TUNING's town and city shelves) */
const POINTS = (arg('--small', '') ? [
  { day: 6, men: 3, level: 2, gear: 'early' },
  { day: 12, men: 4, level: 2, gear: 'early' },
  { day: 30, men: 3, level: 4, gear: 'early' }
] : []).concat([
  { day: 1, men: 3, level: null, gear: 'early' },
  { day: 20, men: 6, level: 3, gear: 'early' },
  { day: 50, men: 9, level: 5, gear: 'middle' },
  { day: 90, men: 12, level: 8, gear: 'late' }
]).filter(P => !arg('--small', '') || P.day !== 1 && P.day !== 20 && P.day !== 50 && P.day !== 90);
function strengthOf(levels) {
  const R = PM.roster_strength.value;
  return levels.slice().sort((a, b) => b - a).slice(0, R.strongest).reduce((t, l) => t + R.per_man + R.per_level * (l - 1), 0);
}
/* the job's count: the map's partyMath('job') as it plays today, or Battle Brothers' contract multiplier under test */
/* the math under test (--math bb): Battle Brothers' contract multiplier (Grok 105) on a base a skull (--base a,b,c), and the
   party dressed for the company's strength, not the calendar (--dress strength): the day a typical company stands that strong */
const BASE = (arg('--base', '') || '').split(',').filter(Boolean).map(Number);
const DRESS = arg('--dress', MATH === 'bb' ? 'strength' : 'calendar');
const BBM = (PM.job_bb && PM.job_bb.value) || { k: 0.94, exp: 0.89, mult_min: 0.75, mult_max: 5, base_men: { 1: 3, 2: 4, 3: 5 }, dress: [[30, 1], [84, 20], [162, 50], [288, 90]] };
function dressDay(str) {
  const T = BBM.dress; if (str <= T[0][0]) return T[0][1];
  for (let i = 1; i < T.length; i++) if (str <= T[i][0]) return Math.round(T[i - 1][1] + (T[i][1] - T[i - 1][1]) * (str - T[i - 1][0]) / (T[i][0] - T[i - 1][0]));
  return Math.min(100, Math.round(T[T.length - 1][1] + (str - T[T.length - 1][0]) / 4));
}
function jobCount(str, skulls, crew, day, math) {
  const P = PM.job.value, mult = PM.difficulty_count_mult.value[1];   /* the door's default: Veteran ('seen') */
  let n;
  if (math === 'bb') {
    const m = Math.max(BBM.mult_min, Math.min(BBM.mult_max, BBM.k * Math.pow(str / 100, BBM.exp)));
    n = (BASE.length ? BASE[skulls - 1] : BBM.base_men[String(skulls)]) * m * mult;
  } else n = str / P.strength_per_enemy * P.skull_mult[String(skulls)] * mult;
  n = Math.max(P.min, Math.min(P.max, Math.floor(n + 0.5)));
  if (day <= 1 && n > crew + 1) n = crew + 1;   /* __EVERY_FIGHT_SIZED_TO_THE_CREW__: the first day */
  return n;
}
/* the stars the map shows (loopJobStars: the party against his men: fewer one, his men or one more two, more three) */
function starsOf(n, crew) { return n < crew ? 1 : n <= crew + 1 ? 2 : 3; }

/* what is offered: a town's board by its tier (the shelf picks the tier's own rows), and the phone's two best paid */
function offered() {
  const rows = SHELF.offers;
  const share = {}; [1, 2, 3].forEach(s => share[s] = rows.filter(r => r.skulls === s).length / rows.length);
  /* the phone: every place's offers, the two best paid; pay is 30 a skull, so the two are the highest skulls on offer */
  const per = {}; [1, 2, 3].forEach(s => per[s] = 0);
  const R = (seed => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; })(9);
  const T = 400;
  for (let t = 0; t < T; t++) {
    /* a valley's boards this day: fourteen places, each offering one to three rows at random from the shelf */
    const all = [];
    for (let p = 0; p < 14; p++) { const k = 1 + Math.floor(R() * 3); for (let i = 0; i < k; i++) all.push(rows[Math.floor(R() * rows.length)]); }
    all.sort((a, b) => b.pay - a.pay || b.skulls - a.skulls);
    const seen = {}, top = [];
    for (const r of all) { if (seen[r.id]) continue; seen[r.id] = 1; top.push(r); if (top.length === 2) break; }
    top.forEach(r => per[r.skulls] += 1 / (2 * T));
  }
  return { board: share, phone: per };
}

async function main() {
  const ctx = await G.engine(true, null), F = ctx.FIGHT, DB = ctx.DB;
  const R = ctx.R || (p => { throw new Error('no R'); });
  const O = R('ours.outclass'), cap = R('hit_chance.cap'), sc = R('hit_chance.defense_soft_cap'), X = R('parsed.brother_xp');
  const soft = d => d > sc.threshold ? sc.threshold + (d - sc.threshold) * sc.over_threshold_multiplier : d;
  const lvOf = v => v.side === 'you' ? (v.level || 1) : Math.max(1, Math.round(1 + ((v.xp || X.base) - X.base) / X.per_level));
  /* the fight's own classOf, at the first look */
  function outclassed(S) {
    const crew = S.units.filter(v => v.side === 'you'), top = crew.reduce((m, v) => Math.max(m, lvOf(v)), 1);
    let any = 0, worst = 0;
    S.units.filter(t => t.side === 'them').forEach(t => {
      let best = null, blows = Infinity;
      crew.forEach(f => { const c = F.isRanged(f.weapon) ? f.rskill - soft(t.rdef) : f.mskill - soft(t.mdef); best = best === null ? c : Math.max(best, c);
        try { blows = Math.min(blows, F.preview(f, t).blows); } catch (_e) {} });
      const hit = best === null ? null : Math.max(cap.min, Math.min(cap.max, Math.round(best)));
      const dodge = hit !== null && hit <= O.dodge_chance_at_most, armour = blows >= O.blows_at_least, lv = lvOf(t);
      if (lv - top >= O.level_gap || (dodge && armour)) any++;
      worst = Math.max(worst, lv - top);
    });
    return { any: any > 0, n: any, gap: worst };
  }
  const offers = offered(), rows = [];
  for (const P of POINTS) {
    const stage = P.gear, company = G.companyOf(P.men, stage).map(m => Object.assign({}, m, P.level ? { level: P.level } : {}));
    const bgs = new Map(DB.backgrounds.rows.map(r => [r.id, r]));
    const levels = company.map(m => m.level || (sl => (sl[0] + sl[sl.length - 1]) / 2)(bgs.get(m.background).starting_level));
    const str = strengthOf(levels);
    for (const skulls of [1, 2, 3]) {
      const count = jobCount(str, skulls, P.men, P.day, MATH), stars = MATH === 'bb' ? skulls : starsOf(count, P.men);   /* rule 192(a): the stars are the skulls */
      const T = { won: 0, lost: 0, stall: 0, oc: 0, down: 0, men: 0 };
      for (let k = 0; k < N; k++) {
        ctx.setSeed(7000 + k);
        const dd = DRESS === 'strength' ? dressDay(str) : P.day;
        F.setup({ auto: true, formation: null, company: company, cap: P.men, party: { faction: 'brigands', count: count, days: dd, difficulty: 1 }, days: dd });
        if (outclassed(F.S).any) T.oc++;
        let g = 0; const idle = G.idleWatch(F);
        while (!F.S.over && g < 400000) { const u = F.current(); if (!u) break; F.aiStep(u); g++; if (idle()) break; }
        const S = F.S, ids = new Set(S.units.filter(u => u.side === 'you').map(u => u.id));
        if (!S.over) T.stall++; else if (S.result === 'won') T.won++; else T.lost++;
        T.men += ids.size; S.log.forEach(e => { if ((e.t === 'down' || e.t === 'dead') && ids.has(e.id)) T.down++; });
      }
      const row = { day: P.day, dressed_for_day: DRESS === 'strength' ? dressDay(str) : P.day, men: P.men, level: Math.round(levels.reduce((a, b) => a + b, 0) / levels.length * 10) / 10, strength: str, skulls, enemies: count, stars,
        won_in_100: Math.round(100 * T.won / N), outclass_in_100: Math.round(100 * T.oc / N), struck_down_share: Math.round(100 * T.down / Math.max(1, T.men)),
        board_share: Math.round(100 * offers.board[skulls]), phone_share: Math.round(100 * offers.phone[skulls]) };
      rows.push(row);
      console.log(`day ${String(row.day).padStart(2)} (dressed ${String(row.dressed_for_day).padStart(2)})  ${row.men} men L${row.level}  ${skulls} skull${skulls > 1 ? 's' : ' '}  ${String(count).padStart(2)} of them (${stars}★)  won ${String(row.won_in_100).padStart(3)}  outclassed ${String(row.outclass_in_100).padStart(3)}  down ${String(row.struck_down_share).padStart(3)}%   on a board ${row.board_share}%  on the phone ${row.phone_share}%`);
    }
  }
  /* the shares he meets: jobs whose enemy outclasses him or that he loses more than half the time, weighted by what is offered */
  const sum = {};
  POINTS.forEach(P => {
    const r = rows.filter(x => x.day === P.day), w = (k, f) => r.reduce((t, x) => t + x[k] * (f(x) ? 1 : 0), 0);
    const lost = x => x.won_in_100 < 50, marked = x => x.outclass_in_100 >= 50;
    sum[P.day] = { board_lost_more_than_won_in_100: Math.round(w('board_share', lost)), phone_lost_more_than_won_in_100: Math.round(w('phone_share', lost)),
      board_marked_outclass_in_most_fights_in_100: Math.round(w('board_share', marked)) };
    console.log(`day ${P.day}: jobs lost more often than won: on a board ${sum[P.day].board_lost_more_than_won_in_100} in 100, on the phone ${sum[P.day].phone_lost_more_than_won_in_100} in 100; jobs where the fight marks a man OUTCLASSES YOU in most fights (COMBAT's mark): ${sum[P.day].board_marked_outclass_in_most_fights_in_100} in 100`);
  });
  /* the win per star across the game */
  [1, 2, 3].forEach(s => { const r = rows.filter(x => x.stars === s); if (r.length) console.log(`${s}★: won ${Math.round(r.reduce((t, x) => t + x.won_in_100, 0) / r.length)} in 100 over ${r.length} cells`); });
  if (OUT) fs.writeFileSync(OUT, JSON.stringify({ math: MATH, n: N, rows, over_his_head: sum, offered: offers }, null, 1));
}
main().catch(e => { console.error(e.stack || e.message); process.exit(1); });
