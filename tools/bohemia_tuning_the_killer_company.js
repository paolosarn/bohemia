#!/usr/bin/env node
// TUNING [the killer company: stats and level-ups] 10/25 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g; rule 162).
// Paolo 10/24: 'three people with the gun in the back line... ranged attack, melee attack and fatigue/health... the nine other people
// ... fatigue, melee attack and melee defense... now you gotta care a lot more about range defense... we might just have to give more
// points... the rolls on resolve mattered.'
//
// Two things, both seeded:
//  LINES  every man of his shape (three shooters, nine in front) rolled the Battle Brothers way (background range, exactly three
//         starred stats at 60/30/10, every attribute rolled a level on its star column, the player takes his plan's picks), under
//         each LEVEL RULE below, at level 6, 11 and 16 (the veteran levels: +1 on three, no perk); 2,000 companies a cell.
//  FIGHTS those twelve on the live fight (slices/BOHEMIA_FIGHT.html, exactly the files its loadAll() reads, through
//         tools/bohemia_tuning_the_whole_grid.js's engine), both sides on the fight's own brain, against three late bands:
//         the late brigands as the fight dresses them (two shooters in ten), A GUN LINE (half shooters: a crew that fights
//         like ours), and the kids (the goblins: throwers and nets). The company's stats are handed the way the roster hands
//         them (engine/bohemia_roster.js company(): stats chosen at each level go to the fight, rule 162(e)), so the level
//         rule is the ONLY thing that moves between rows: same men, same gear, same perks, same seeds.
//
//   node tools/bohemia_tuning_the_killer_company.js --lines            the stat lines only (fast)
//   node tools/bohemia_tuning_the_killer_company.js --fights [--n 60] [--jobs 4]   the fights (resumable, a cells.ndjson cache)
//   node tools/bohemia_tuning_the_killer_company.js --write            both, into banks/BOHEMIA_TUNING_THE_KILLER_COMPANY_10_25_26.json
//   --cell '<json>' <n>   one cell (the workers)
// Every number it prints is DRAFT (research only; nothing reads the bank).
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const BANK = path.join(ROOT, 'banks/BOHEMIA_TUNING_THE_KILLER_COMPANY_10_25_26.json');
const CELLS = BANK.replace(/\.json$/, '.cells.ndjson');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const G = require('./bohemia_tuning_the_whole_grid.js');
const RULES = J('records/target/bb/rules.json').experience, BGS = J('records/target/bb/backgrounds.json');

const STATS = ['hp', 'fatigue', 'resolve', 'initiative', 'melee_skill', 'ranged_skill', 'melee_defense', 'ranged_defense'];
const KEY = { hp: 'HP', fatigue: 'Fatigue', resolve: 'Resolve', initiative: 'Initiative', melee_skill: 'Melee Skill', ranged_skill: 'Ranged Skill',
  melee_defense: 'Melee Defense', ranged_defense: 'Ranged Defense' };
const BY_STARS = RULES.stat_gains_by_stars.value, STAR_ODDS = RULES.talent_star_odds.value;

/* ---------- HIS SHAPE (rule 162(c)): the three shooters and the nine in front, their gear and their plans ----------
   The men: the backgrounds a Battle Brothers player builds a late company from (the wiki's fighting backgrounds), one each,
   rolled inside their own ranges. The gear: the whole grid's LATE shelf (reinforced mail, bascinet with mail, heavy crossbow,
   winged mace and heater shield, two-handed hammer) and its ENDGAME shelf (coat of scales, full helm: the weight test). */
const FRONT_BG = ['hedge_knight', 'sellsword', 'retired_soldier', 'gladiator', 'militia', 'sellsword', 'hedge_knight', 'gladiator', 'brawler'];
const BACK_BG = ['hunter', 'sellsword', 'poacher'];
const SHELF = {
  late: { shield: 'winged_mace', off: 'heater_shield', two: 'two_handed_hammer', gun: 'heavy_crossbow', body: 'reinforced_mail_hauberk', head: 'bascinet_with_mail' },
  endgame: { shield: 'winged_mace', off: 'heater_shield', two: 'two_handed_hammer', gun: 'heavy_crossbow', body: 'coat_of_scales', head: 'full_helm' }
};
/* the front: five with a shield, four with a two-hander (the Battle Brothers line: the ends and the middle hold, the hammers break) */
const FRONT_KIT = ['shield', 'two', 'shield', 'two', 'shield', 'two', 'shield', 'two', 'shield'];

/* ---------- THE LEVEL RULES: what a level gives, each a row the one table would carry ----------
   picks   how many of the eight he raises a level (Battle Brothers 3)
   free    stats that rise EVERY level on their roll, on top of the picks (guns first: ranged defence)
   plan    his order of priority per role (the min-max): he takes the first 'picks' of it every level */
const PLANS = {
  bb3: { name: 'BATTLE BROTHERS: three picks, his old plan (front: melee skill, melee defence, fatigue; back: ranged skill, fatigue, hitpoints)',
    picks: 3, free: [], front: ['melee_skill', 'melee_defense', 'fatigue'], back: ['ranged_skill', 'fatigue', 'hp'] },
  rd_for_fat: { name: 'THREE PICKS, RANGED DEFENCE IN PLACE OF FATIGUE (what three picks cost him if he obeys the guns)',
    picks: 3, free: [], front: ['melee_skill', 'melee_defense', 'ranged_defense'], back: ['ranged_skill', 'ranged_defense', 'hp'] },
  bb3_rd_free: { name: 'THREE PICKS + RANGED DEFENCE RISES BY ITSELF EVERY LEVEL (ranged defence weighted for guns first)',
    picks: 3, free: ['ranged_defense'], front: ['melee_skill', 'melee_defense', 'fatigue'], back: ['ranged_skill', 'fatigue', 'hp'] },
  four: { name: 'FOUR PICKS (his old plan plus ranged defence, his choice)',
    picks: 4, free: [], front: ['melee_skill', 'melee_defense', 'fatigue', 'ranged_defense'], back: ['ranged_skill', 'fatigue', 'hp', 'ranged_defense'] },
  four_rd_free: { name: 'FOUR PICKS + RANGED DEFENCE BY ITSELF (front adds hitpoints, back adds resolve)',
    picks: 4, free: ['ranged_defense'], front: ['melee_skill', 'melee_defense', 'fatigue', 'hp'], back: ['ranged_skill', 'fatigue', 'hp', 'resolve'] },
  four_res: { name: 'FOUR PICKS + RANGED DEFENCE BY ITSELF, RESOLVE IN PLACE OF HITPOINTS IN FRONT (rule 162(d): the rolls on resolve)',
    picks: 4, free: ['ranged_defense'], front: ['melee_skill', 'melee_defense', 'fatigue', 'resolve'], back: ['ranged_skill', 'fatigue', 'hp', 'resolve'] },
  five: { name: 'FIVE PICKS (front: melee skill, melee defence, fatigue, ranged defence, hitpoints; back: ranged skill, fatigue, hitpoints, ranged defence, resolve)',
    picks: 5, free: [], front: ['melee_skill', 'melee_defense', 'fatigue', 'ranged_defense', 'hp'], back: ['ranged_skill', 'fatigue', 'hp', 'ranged_defense', 'resolve'] },
  none: { name: 'NO LEVEL-UPS AT ALL (the floor: the fight as it played before RUN TWO wired the choice)', picks: 0, free: [], front: [], back: [] }
};

function rng(seed) { let a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function rint(R, a, b) { return a + Math.floor(R() * (b - a + 1)); }
function rollRange(txt, R) { const m = String(txt).split('-').map(Number); return rint(R, m[0], m.length > 1 ? m[1] : m[0]); }
function bg(id) { return BGS.rows.filter(r => r.id === id)[0]; }

/* stars: exactly three of the eight, 60/30/10 (Talents); 'luck' = 'any' (the wiki's draw) or 'kept' (he kept a man whose stars
   sit on his plan: the killer premise, the best of the men he saw, a bound not a draw) */
function starsOf(R, plan, luck) {
  const st = {};
  const pool = luck === 'kept' ? plan.slice(0, 3).concat(STATS.filter(k => plan.slice(0, 3).indexOf(k) < 0)) : STATS.slice();
  for (let s = 0; s < 3; s++) {
    const k = luck === 'kept' ? pool[s] : pool.splice(Math.floor(R() * pool.length), 1)[0];
    const q = R(); st[k] = q < STAR_ODDS['1'] ? 1 : q < STAR_ODDS['1'] + STAR_ODDS['2'] ? 2 : 3;
  }
  return st;
}
/* one man to a level: the stats he would hand the fight under a level rule */
function manTo(bgId, role, rule, level, luck, seed) {
  const R = rng(seed), b = bg(bgId), st = {};
  STATS.forEach(k => { const r = b.stats[k]; st[k] = rint(R, r[0], r[r.length - 1]); });
  const P = PLANS[rule], plan = P[role];
  const stars = starsOf(R, plan.length ? plan : PLANS.bb3[role], luck);
  for (let lv = 2; lv <= level; lv++) {
    const vet = lv > 11, rolls = {};
    STATS.forEach(k => { rolls[k] = vet ? RULES.veteran_level_rules.value.max_per_stat : rollRange(BY_STARS[KEY[k]][stars[k] || 0], R); });
    if (!P.picks) continue;
    const take = new Set(P.free);
    plan.forEach(k => { if (take.size < P.picks + P.free.length && !take.has(k)) take.add(k); });
    /* a free stat that is also in his plan does not cost a pick: he takes the next one */
    if (P.free.some(f => plan.indexOf(f) >= 0)) plan.forEach(k => { if (take.size < P.picks + P.free.length && !take.has(k)) take.add(k); });
    take.forEach(k => { st[k] += rolls[k]; });
  }
  return { stats: st, stars: stars };
}
function companyOf(rule, level, luck, shelf, seed) {
  const S = SHELF[shelf], men = [];
  FRONT_BG.forEach((b, i) => { const m = manTo(b, 'front', rule, level, luck, seed * 31 + i);
    const two = FRONT_KIT[i] === 'two';
    men.push({ background: b, level: level, stats: m.stats, role: 'front', gear: { main: two ? S.two : S.shield, off: two ? null : S.off, body: S.body, head: S.head } }); });
  BACK_BG.forEach((b, i) => { const m = manTo(b, 'back', rule, level, luck, seed * 31 + 20 + i);
    men.push({ background: b, level: level, stats: m.stats, role: 'back', gear: { main: S.gun, off: null, body: S.body, head: S.head } }); });
  return men;
}

/* ---------- LINES: the average man of each role at each level under each rule ---------- */
function lines(N) {
  const out = {};
  Object.keys(PLANS).forEach(rule => ['any', 'kept'].forEach(luck => [6, 11, 16].forEach(level => {
    const acc = { front: {}, back: {} }, n = { front: 0, back: 0 };
    for (let s = 0; s < N; s++) companyOf(rule, level, luck, 'late', 100000 + s).forEach(m => {
      n[m.role]++; STATS.forEach(k => { acc[m.role][k] = (acc[m.role][k] || 0) + m.stats[k]; });
    });
    ['front', 'back'].forEach(role => { const row = {}; STATS.forEach(k => { row[k] = Math.round(acc[role][k] / n[role]); });
      out[[rule, luck, level, role].join('|')] = row; });
  })));
  return out;
}

/* ---------- FIGHTS ---------- */
const BANDS = {
  brigands: { name: 'THE LATE BRIGANDS as the fight dresses them (day 80: raiders, marauders, two shooters in ten, a leader)', party: n => ({ faction: 'brigands', count: n, days: 80, difficulty: 0 }) },
  gunline: { name: 'A GUN LINE: half of them shoot (brigand marksmen with bows and crossbows, the rest raiders and marauders): a crew that fights like ours',
    party: n => Array.from({ length: n }, (_, i) => i % 2 === 0 ? 'brigand_marksman' : (i % 4 === 1 ? 'brigand_raider' : 'brigand_marauder')) },
  kids: { name: 'THE KIDS, late (goblin skirmishers and wolfriders: bolas and nets)', party: n => ({ faction: 'kids', count: n, days: 80, difficulty: 0 }) }
};
const COUNTS = [13, 20, 30, 40];
/* 'four' rolls the same men as 'bb3_rd_free' under his plan (the fourth pick is ranged defence either way) and 'five' the same as
   'four_rd_free', so they are not played twice: the LINES show them, the fights play one of each pair (measured: identical stats) */
const RULE_ROWS = ['none', 'bb3', 'rd_for_fat', 'bb3_rd_free', 'four_rd_free'];
function cellsAll() {
  const out = [];
  RULE_ROWS.forEach(rule => Object.keys(BANDS).forEach(band => COUNTS.forEach(count => ['late', 'endgame'].forEach(shelf => {
    if (shelf === 'endgame' && band !== 'brigands') return;   /* the weight test: one band */
    /* the kids are easy for every level-11 company (measured: won 95 to 100 even with no level-ups at 13 to 40); one count, the hardest */
    if (band === 'kids' && count !== 40) return;
    out.push({ rule: rule, band: band, count: count, shelf: shelf, level: 11, luck: 'any' });
  }))));
  /* the veteran company (level 16) and the kept stars, on the band that tests ranged defence hardest */
  ['bb3', 'bb3_rd_free', 'four_rd_free'].forEach(rule => [20].forEach(count => {
    out.push({ rule: rule, band: 'gunline', count: count, shelf: 'late', level: 16, luck: 'any' });
    out.push({ rule: rule, band: 'gunline', count: count, shelf: 'late', level: 11, luck: 'kept' });
  }));
  /* resolve (rule 162(d)): the front's fourth pick resolve against hitpoints, on the two human bands and the ghosts' scream */
  [20, 30].forEach(count => ['brigands', 'gunline'].forEach(band => out.push({ rule: 'four_res', band: band, count: count, shelf: 'late', level: 11, luck: 'any' })));
  /* the middle of the game: level 6 against the map's own late cap (13) on every band */
  RULE_ROWS.forEach(rule => ['brigands', 'gunline'].forEach(band => out.push({ rule: rule, band: band, count: 13, shelf: 'late', level: 6, luck: 'any' })));
  return out;
}
const keyOf = c => [c.rule, c.band, c.count, c.shelf, c.level, c.luck].join('|');

async function cell(C, n) {
  const ctx = await G.engine(true), F = ctx.FIGHT;
  const T = { fights: 0, won: 0, lost: 0, stalled: 0, down: 0, dead: 0, men: 12, theirShots: 0, theirShotsHit: 0, theirSwings: 0, theirSwingsHit: 0,
    yourAtt: 0, yourHit: 0, ran: 0, theirDown: 0, rounds: 0, noneDown: 0, spent: 0, turns: 0 };
  for (let k = 0; k < n; k++) {
    ctx.setSeed(9000 + k);
    const company = companyOf(C.rule, C.level, C.luck, C.shelf, 7 + k).map(m => ({ background: m.background, level: m.level, stats: m.stats, gear: m.gear }));
    F.setup({ auto: true, formation: null, company: company, cap: 12, party: BANDS[C.band].party(C.count), days: 80 });
    const you = new Set(F.S.units.filter(u => u.side === 'you').map(u => u.id));
    let g = 0, seen = 0;
    const idle = G.idleWatch(F);
    while (!F.S.over && g < 400000) {
      const u = F.current(); if (!u) break;
      /* a turn he begins within 15 of his ceiling (his fatigue less the gear's weight, the fight's own fatMax): he cannot swing */
      if (you.has(u.id)) { T.turns++; if (F.fatMax(u) - u.fat < 15) T.spent++; }
      F.aiStep(u); g++; if (idle()) break;
    }
    const S = F.S, byId = new Map(S.units.map(u => [u.id, u]));
    T.fights++; T.rounds += S.round;
    if (!S.over) T.stalled++; else if (S.result === 'won') T.won++; else T.lost++;
    let downs = 0; const ran = new Set(), downT = new Set();
    S.log.forEach(e => {
      if (e.t === 'attack') {
        const a = byId.get(e.id), mine = a && you.has(a.id);   /* the attack event: id the striker, to the target, shot a ranged blow (the control) */
        const ranged = !!e.shot;
        if (a && !mine) { if (ranged) { T.theirShots++; if (e.hit) T.theirShotsHit++; } else { T.theirSwings++; if (e.hit) T.theirSwingsHit++; } }
        if (mine) { T.yourAtt++; if (e.hit) T.yourHit++; }
      }
      if ((e.t === 'down' || e.t === 'dead') && you.has(e.id)) { downs++; if (e.t === 'dead') T.dead++; }
      if ((e.t === 'down' || e.t === 'dead') && !you.has(e.id)) downT.add(e.id);
      if (e.t === 'morale' && e.to === 'Fleeing' && you.has(e.id)) ran.add(e.id);
    });
    T.down += downs; T.ran += ran.size; T.theirDown += downT.size; if (S.result === 'won' && downs === 0) T.noneDown++;
  }
  return T;
}
function felt(T) {
  const f = T.fights, p = x => Math.round(100 * x), r2 = x => Math.round(x * 100) / 100;
  return { fights: f, won_in_100: p(T.won / f), stalled_in_100: p(T.stalled / f), won_nobody_down_in_100: p(T.noneDown / f),
    your_men_down_per_fight: r2(T.down / f), your_dead_per_100_fights: Math.round(100 * T.dead / f),
    their_shots_land_in_100: T.theirShots ? p(T.theirShotsHit / T.theirShots) : null, their_swings_land_in_100: T.theirSwings ? p(T.theirSwingsHit / T.theirSwings) : null,
    your_blows_land_in_100: p(T.yourHit / Math.max(1, T.yourAtt)), your_men_who_ran_per_fight: r2(T.ran / f),
    turns_begun_spent_in_100: p(T.spent / Math.max(1, T.turns)), rounds: Math.round(10 * T.rounds / f) / 10 };
}

/* the attack event's shape, read once from a real fight so the counter is pointed at the right thing (a control, below) */
async function control() {
  const ctx = await G.engine(true), F = ctx.FIGHT;
  ctx.setSeed(9000);
  F.setup({ auto: true, formation: null, company: companyOf('bb3', 11, 'any', 'late', 7).map(m => ({ background: m.background, level: m.level, stats: m.stats, gear: m.gear })), cap: 12, party: BANDS.gunline.party(13), days: 80 });
  const u0 = F.S.units.filter(u => u.side === 'you')[0];
  const hand = companyOf('bb3', 11, 'any', 'late', 7)[0];
  let g = 0; while (!F.S.over && g < 400000) { const u = F.current(); if (!u) break; F.aiStep(u); g++; }
  const att = F.S.log.filter(e => e.t === 'attack');
  return { first_attack_event: att[0], attacks: att.length, handed_melee_skill: hand.stats.melee_skill, fight_melee_skill: u0.mskill,
    handed_ranged_defense: hand.stats.ranged_defense, fight_ranged_defense: u0.rdef };
}

/* THE STAMP: the fight's fingerprint (the fight file and every data file it reads) and this bench's own logic (the men, the
   plans, the bands, one cell), never the cell list, so adding a cell keeps every cell already played */
const BENCH = () => ({ text: [rng, rint, rollRange, starsOf, manTo, companyOf, cell].map(f => f.toString()).join('\n') + JSON.stringify(PLANS) +
  JSON.stringify(SHELF) + FRONT_BG.join() + BACK_BG.join() + FRONT_KIT.join() + Object.keys(BANDS).map(k => BANDS[k].party.toString()).join() });
async function runFights(n, jobs) {
  const cache = G.cellCache(CELLS, n, [BENCH()]);
  const todo = cellsAll().filter(c => !cache.has(keyOf(c)));
  process.stderr.write('cells: ' + cellsAll().length + ', to play: ' + todo.length + ' at ' + n + ' fights\n');
  let i = 0;
  const work = () => new Promise(res => {
    const next = () => {
      if (i >= todo.length) return res();
      const c = todo[i++];
      const t0 = Date.now();
      cp.execFile(process.execPath, [__filename, '--cell', JSON.stringify(c), String(n)], { maxBuffer: 1 << 26 }, (err, out) => {
        if (err) { process.stderr.write('FAILED ' + keyOf(c) + ': ' + err.message + '\n'); return next(); }
        const v = JSON.parse(out); cache.put(keyOf(c), v, n);
        process.stderr.write(keyOf(c) + '  won ' + felt(v).won_in_100 + '  down ' + felt(v).your_men_down_per_fight + '  (' + Math.round((Date.now() - t0) / 1000) + ' s)\n');
        next();
      });
    };
    next();
  });
  await Promise.all(Array.from({ length: jobs }, work));
  const fresh = G.cellCache(CELLS, n, [BENCH()]);
  const out = {};
  cellsAll().forEach(c => { const v = fresh.has(keyOf(c)); if (v) out[keyOf(c)] = felt(v); });
  return out;
}

async function main() {
  const a = process.argv.slice(2), arg = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
  if (a[0] === '--cell') { const T = await cell(JSON.parse(a[1]), Number(a[2])); process.stdout.write(JSON.stringify(T)); return; }
  if (a.indexOf('--stamp') >= 0) { console.log(G.fightPrint([BENCH()])); return; }
  if (a.indexOf('--control') >= 0) { console.log(JSON.stringify(await control(), null, 1)); return; }
  const out = { draft: true, about: 'TUNING [the killer company] 10/25: research only (rule 38g); nothing reads this bank', plans: PLANS, bands: Object.fromEntries(Object.keys(BANDS).map(k => [k, BANDS[k].name])),
    men: { front: FRONT_BG, back: BACK_BG, front_kit: FRONT_KIT, shelf: SHELF } };
  if (a.indexOf('--lines') >= 0 || a.indexOf('--write') >= 0) out.lines = lines(Number(arg('--N', 2000)));
  if (a.indexOf('--fights') >= 0 || a.indexOf('--write') >= 0) { out.fights = await runFights(Number(arg('--n', 60)), Number(arg('--jobs', 4))); out.fights_per_cell = Number(arg('--n', 60)); }
  if (a.indexOf('--write') >= 0) fs.writeFileSync(BANK, JSON.stringify(out, null, 1) + '\n');
  else console.log(JSON.stringify(out.lines || out.fights, null, 1));
}
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { PLANS, companyOf, manTo, lines, cell, felt, BANDS };
