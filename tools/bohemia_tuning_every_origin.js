#!/usr/bin/env node
// TUNING [every origin starts like itself] 10/25 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g; rule 184).
// Paolo 10/25: 'for all the origins tune up what happens, especially the numbers they get when they start off; in Battle
// Brothers Lone Wolf you get a gilded god with three stars in the stats that actually matter... I don't even see that on this
// wolf guy, it's just one regular guy, definitely not a lone wolf.'
//
// Every fight is THE LIVE FIGHT (slices/BOHEMIA_FIGHT.html and exactly the files its loadAll() reads, played headless through
// tools/bohemia_tuning_the_whole_grid.js's engine, plain: no hooks), both sides on the fight's own brain (AUTO), seeded.
//  START    who stands at the door for an origin: TODAY (what records/target/bb/origins.json hands the fight: a background and a
//           level a man, the stats the fight rolls for his place in the line, the kit of his place) or a PROPOSAL (this page's:
//           a real body for his level, his stars, his kit), rolled new for every seed
//  LADDER   the Lone Wolf alone against 1 to 8 brigands dressed for the day
//  DAYS     the origin's first days PLAYED: a fight every second day, the party the map hands (records/target/bb/party_math.json
//           as the live map sums it: the job's count off the roster's strength and the skulls, a roaming party's off the days and
//           the blocks from town, the first day capped at the company plus one), dressed by the day; the XP the fight counts,
//           level-ups on each man's stars (four picks, TUNING 10/25 killer company), the fallen laid up the days the fight rolls,
//           the dead gone, the purse (the door's start, the board's pay a skull and the origin's own pay, two a man a night; a
//           short night one man walks, never YOU)
//
//   node tools/bohemia_tuning_every_origin.js --who [origin]            the door, today and proposed (fast)
//   node tools/bohemia_tuning_every_origin.js --ladder [--n 60]         the Lone Wolf ladder (resumable)
//   node tools/bohemia_tuning_every_origin.js --days [--seeds 100] [--only id]   the first days played (resumable)
//   node tools/bohemia_tuning_every_origin.js --write                   everything cached into banks/BOHEMIA_TUNING_EVERY_ORIGIN_10_25_26.json
//   --jobs 4 worker processes
// Every number it prints is DRAFT (research only; nothing in the game reads the bank).
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const BANK = path.join(ROOT, 'banks/BOHEMIA_TUNING_EVERY_ORIGIN_10_25_26.json');
const CELLS = BANK.replace(/\.json$/, '.cells.ndjson');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const G = require('./bohemia_tuning_the_whole_grid.js');
const LW = require('./bohemia_tuning_lone_wolf.js');
const XP = J('records/target/bb/rules.json').experience, BGS = J('records/target/bb/backgrounds.json');
const ORIGINS = J('records/target/bb/origins.json').origins, OURS = J('records/target/bb/ours.json');
const SHELF = J('records/target/BOHEMIA_BOARD_SHELF.json'), BILL = J('records/target/bb/nightly_bill.json');
const val = k => { const x = OURS[k]; return x && typeof x === 'object' && 'value' in x ? x.value : x; };
const CREW = val('crew'), BUILDS = val('perk_builds'), PERKS = J('records/target/bb/perks.json').rows;

const STATS = ['hp', 'fatigue', 'resolve', 'initiative', 'melee_skill', 'ranged_skill', 'melee_defense', 'ranged_defense'];
const KEY = { hp: 'HP', fatigue: 'Fatigue', resolve: 'Resolve', initiative: 'Initiative', melee_skill: 'Melee Skill', ranged_skill: 'Ranged Skill',
  melee_defense: 'Melee Defense', ranged_defense: 'Ranged Defense' };
function rng(seed) { let a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function rint(R, a, b) { return a + Math.floor(R() * (b - a + 1)); }
function rollRange(txt, R) { const m = String(txt).split('-').map(Number); return rint(R, m[0], m.length > 1 ? m[1] : m[0]); }
const pickOf = (R, a) => a[Math.floor(R() * a.length)];
const bgRow = id => BGS.rows.filter(r => r.id === id)[0];
function median(a) { const s = a.filter(x => x != null).slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; }
function xpFor(level) { if (level <= 1) return 0; const tb = XP.level_table_total_xp.value; if (level <= 11) return tb[String(level)];
  let t = tb['11']; for (let l = 11; l < level; l++) t += 4000 + 1000 * (l - 11); return t; }
function levelOf(xp) { let l = 1; while (l < XP.veteran_level_rules.value.max_level && xp >= xpFor(l + 1)) l++; return l; }
function levelRolls(stars, level, R) { const out = {};
  STATS.forEach(k => { out[k] = level > 11 ? XP.veteran_level_rules.value.max_per_stat : rollRange(XP.stat_gains_by_stars.value[KEY[k]][stars[k] || 0], R); });
  return out; }
/* Battle Brothers' talents: three of the eight, 60/30/10 (rules.json talent_star_odds) */
function starsOf(R) { const pool = STATS.slice(), st = {}, O = XP.talent_star_odds.value;
  for (let s = 0; s < 3; s++) { const k = pool.splice(Math.floor(R() * pool.length), 1)[0]; const q = R(); st[k] = q < O['1'] ? 1 : q < O['1'] + O['2'] ? 2 : 3; }
  return st; }
const tierOf = id => { const r = PERKS.filter(x => x.id === id)[0]; return r ? r.tier : 99; };
function perksFor(order, level) { const got = [], pts = Math.min(level, 11) - 1;
  order.forEach(id => { if (got.length < pts && got.length >= tierOf(id) - 1) got.push(id); }); return got; }

/* ---------- TODAY'S MAN: the stats the fight rolls for a man the door hands with no card (crewUnit: a named man rolls from
   his name, his look and his background inside his background's range, the same in every game) ---------- */
function seedOfRules(t) { let h = 2166136261; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry(a) { return rng(a); }
function todayStats(bg, i) {
  const t = Object.assign({}, CREW[i % CREW.length]); if (i >= CREW.length) { t.main = false; t.name = t.name + ' II'; }
  const b = bgRow(bg), who = (t.name || '') + '|' + (t.look || '') + '|' + bg + '|' + (t.main ? 'main' : i), st = {};
  STATS.forEach(k => { const r = b.stats[k], lo = r[0], hi = r[r.length - 1]; st[k] = lo + Math.floor(mulberry(seedOfRules(who + ':' + k))() * (hi - lo + 1)); });
  return { name: t.name, main: !!t.main, stats: st, jobs: t.jobs };
}

/* ---------- THE PLANS (what a man raises when he levels, four picks: TUNING 10/25 [the killer company]) ---------- */
const PLAN = {
  front: ['melee_skill', 'melee_defense', 'fatigue', 'ranged_defense'],
  back: ['ranged_skill', 'fatigue', 'hp', 'ranged_defense'],
  wolf_blade: ['ranged_defense', 'melee_skill', 'melee_defense', 'fatigue'],
  wolf_gun: ['ranged_defense', 'ranged_skill', 'melee_defense', 'fatigue']
};
const BACK_JOBS = ['rifle', 'shotgun', 'bottles'];
/* the perks a blade man takes (the fight has no build for a sword or an axe): the Lone Wolf's order */
const BLADE = { sword: 'sword_mastery', axe: 'axe_mastery', cleaver: 'cleaver_mastery', spear: 'spear_mastery' };   /* the classes the fight has no build for (a mace is a pipe and keeps the fight's pipe build) */
const bladePerks = cls => ['colossus', 'steel_brow', 'brawny', BLADE[cls] || 'sword_mastery', 'lone_wolf', 'battle_forged', 'shield_expert', 'nine_lives', 'indomitable', 'killing_frenzy'];
const WROWS = J('records/target/bb/weapons.json').rows;
const classOf = id => { const w = WROWS.filter(r => r.id === id)[0]; return w ? w.class : null; };

/* ---------- THE LONE WOLF AT THE DOOR: TODAY, BATTLE BROTHERS', AND THE GILDED GODS (this page's proposal) ----------
   GOD a hedge knight rolled in his background's range (melee defence -2, the Lone Wolf page), his three door level-ups TAKEN
   (levels 2 to 4: four picks each on his star rolls), stars on the stats rule 162 names, and the hedge knight's own kit off the
   wiki's Hedge Knight (Enemy) page in our world's things (COOK's table records/target/cook_every_item/: an arming or noble
   sword is a machete, a fighting axe a fire axe, a kite shield a riot shield, a reinforced mail hauberk to a coat of plates
   full riot armour, a closed flat top or a full helm a full riot helm), each piece rolled per game */
const HK_KIT = {
  mains_1h: ['arming_sword', 'noble_sword', 'fighting_axe'],
  bodies: ['reinforced_mail_hauberk', 'heavy_lamellar_armor', 'coat_of_scales', 'coat_of_plates'],
  heads: ['closed_flat_top_with_mail', 'full_helm']
};
const GODS = {
  /* the live game today: YOU's place in the line (pistol, car door, a work jacket and a rag hood), the three door levels give no stats */
  today: { kind: 'today' },
  /* Battle Brothers' Lone Wolf as last round played him (three talents at 60/30/10, three picks a level, the light good kit) */
  bb: { kind: 'god', stars: 'bb', picks: 3, plan: ['melee_skill', 'melee_defense', 'fatigue'], kit: { main: ['arming_sword'], off: ['heater_shield'], body: ['reinforced_mail_hauberk'], head: ['closed_flat_top_with_mail'] } },
  /* GOD3: three talents, every one three stars: ranged defence, his weapon's skill, melee defence (rule 162's order) */
  god3: { kind: 'god', stars: { ranged_defense: 3, melee_skill: 3, melee_defense: 3 }, picks: 4, plan: PLAN.wolf_blade,
    kit: { main: HK_KIT.mains_1h, off: ['kite_shield'], body: HK_KIT.bodies, head: HK_KIT.heads } },
  /* the same man in the light end only (reinforced mail, the closed flat top) */
  god3_light: { kind: 'god', stars: { ranged_defense: 3, melee_skill: 3, melee_defense: 3 }, picks: 4, plan: PLAN.wolf_blade,
    kit: { main: HK_KIT.mains_1h, off: ['kite_shield'], body: ['reinforced_mail_hauberk'], head: ['closed_flat_top_with_mail'] } },
  /* GOD5: three stars on all five stats rule 184(a) names (ranged defence, his weapon's skill, defence, resolve, fatigue) */
  god5: { kind: 'god', stars: { ranged_defense: 3, melee_skill: 3, melee_defense: 3, resolve: 3, fatigue: 3 }, picks: 4, plan: PLAN.wolf_blade,
    kit: { main: HK_KIT.mains_1h, off: ['kite_shield'], body: HK_KIT.bodies, head: HK_KIT.heads } },
  /* GUNS FIRST (rule 120(a)): the god with the pistol in his hand and the riot shield, stars on ranged defence, ranged skill, melee defence */
  god3_gun: { kind: 'god', stars: { ranged_defense: 3, ranged_skill: 3, melee_defense: 3 }, picks: 4, plan: PLAN.wolf_gun,
    kit: { main: ['rondel_dagger'], off: ['kite_shield'], body: HK_KIT.bodies, head: HK_KIT.heads } }
};
function rollGod(spec, seed) {
  const R = rng(seed * 7919 + 101), b = bgRow('hedge_knight'), st = {};
  STATS.forEach(k => { const r = b.stats[k]; st[k] = rint(R, r[0], r[r.length - 1]); });
  st.melee_defense -= 2;   /* the Lone Wolf page: 'modified by -2 so he has a range of 4-8' */
  const stars = spec.stars === 'bb' ? starsOf(R) : Object.assign({}, spec.stars);
  const plan = spec.plan.slice(0, spec.picks);
  for (let lv = 2; lv <= 4; lv++) { const r = levelRolls(stars, lv, R); plan.forEach(k => { st[k] += r[k]; }); }
  const main = pickOf(R, spec.kit.main), cls = classOf(main);
  const gear = { main: main, off: pickOf(R, spec.kit.off), body: pickOf(R, spec.kit.body), head: pickOf(R, spec.kit.head), bag: cls === 'dagger' ? [] : ['rondel_dagger'] };
  return { background: 'hedge_knight', name: 'YOU', main: true, level: 4, xp: xpFor(4), stats: st, stars: stars, plan: plan, gear: gear,
    perkOrder: BLADE[cls] ? bladePerks(cls) : null, R: rng(seed * 104729 + 17) };
}
function wolfStart(godId, seed) {
  const W = ORIGINS.filter(o => o.id === 'wolf')[0], spec = GODS[godId];
  let man;
  if (spec.kind === 'today') { const t = todayStats('hedge_knight', 0); const R0 = rng(seed * 7919 + 101);
    man = { background: 'hedge_knight', name: t.name, main: true, level: 4, xp: xpFor(4), stats: t.stats, stars: starsOf(R0), plan: PLAN.wolf_gun, gear: null, perkOrder: null, R: rng(seed * 104729 + 17) }; }
  else man = rollGod(spec, seed);
  return { origin: 'wolf', variant: godId, men: [man], purse: W.batteries.full, cap: W.field_cap, pay: W.pay | 0 };
}

/* ---------- ONE FIGHT, A WHOLE COMPANY ---------- */
function entryOf(m, i) {
  const c = { background: m.background, level: m.level, stats: Object.assign({}, m.stats) };
  if (m.gear) c.gear = Object.assign({}, m.gear);
  if (m.perkOrder) c.perks = perksFor(m.perkOrder, m.level);
  if (m.look) c.look = m.look;
  return c;
}
function fightCrew(ctx, men, party, seed, cap) {
  const F = ctx.FIGHT; ctx.setSeed(seed);
  F.setup({ auto: true, formation: null, company: men.map(entryOf), cap: cap || 12, party: party, days: party.days });
  const yours = F.S.units.filter(u => u.side === 'you'), w = yours[0], idle = G.idleWatch(F);
  let g = 0, minHp = 1;
  while (!F.S.over && g < 200000) { const u = F.current(); if (!u) break; F.aiStep(u); g++;
    if (w.hpMax) minHp = Math.min(minHp, Math.max(0, w.hp) / w.hpMax); if (idle()) break; }
  const S = F.S;
  return { won: S.over && S.result === 'won', stalled: !S.over, rounds: S.round, mainDown: !!(w.down || w.dead), minHp: minHp,
    men: yours.map(u => ({ down: !!u.down, dead: !!u.dead, xp: u.xpGained || 0, laidUp: u.laidUp || 0 })), enemies: S.units.length - yours.length };
}

/* ---------- THE FIRST DAYS ---------- */
const PAY = Number(SHELF.pay_per_skull), ECON = 1.5;   /* FULL SHELVES, the door's default: x1.5 */
function grant(m, xp) { m.xp += Math.max(0, Math.round(xp)); const to = levelOf(m.xp);
  while (m.level < to) { m.level++; const r = levelRolls(m.stars, m.level, m.R); m.plan.forEach(k => { m.stats[k] += r[k]; }); } }
function days(ctx, start, track, seed) {
  const R = rng(seed * 31337 + 1), men = start.men, log = [];
  let purse = start.purse;
  for (let day = 1; day <= track.days; day++) {
    const alive = men.filter(m => !m.dead && !m.walked);
    purse -= BILL.per_man_per_night.value * alive.length;
    if (purse < 0) { const go = alive.filter(m => !m.main).pop(); if (go) { go.walked = day; log.push({ day: day, walked: 1 }); } }
    if ((day - 1) % track.every !== 0) continue;
    const fit = alive.filter(m => !(m.laidUntil && day < m.laidUntil) && !m.walked);
    if (!fit.length) { log.push({ day: day, nobody: 1 }); continue; }
    /* PICKS rests in town while fewer than half the company can stand (the fallen are laid up 30 to 40 days, Paolo 9/27): a man
       who walks out alone with his crew in bed loses for a month (measured: a new crew fields YOU alone in 237 of 300 fights in
       days 11 to 20 when it never rests) */
    if (track.policy === 'picks' && fit.length < Math.ceil(alive.length / 2)) { log.push({ day: day, rested: 1 }); continue; }
    const levels = alive.map(m => m.level), most = Math.max(3, fit.length + 1);
    let enc = null, count = null;
    if (track.policy === 'takes') {
      if (R() < 0.5) { const sk = 1 + Math.floor(R() * 3), camp = R() < 0.2; enc = { kind: 'job', skulls: sk, camp: camp }; count = LW.mapCount('job', levels, day, enc); }
      else { enc = { kind: 'roaming', blocks: Math.floor(R() * 9) }; count = LW.mapCount('roaming', levels, day, enc); }
    } else {
      if (R() < 0.5) { for (let sk = 3; sk >= 1 && !enc; sk--) { const e = { kind: 'job', skulls: sk, camp: false }, c = LW.mapCount('job', levels, day, e); if (c <= most) { enc = e; count = c; } } }
      else { const e = { kind: 'roaming', blocks: Math.floor(R() * 9) }, c = LW.mapCount('roaming', levels, day, e); if (c <= most) { enc = e; count = c; } else log.push({ day: day, fellBack: c }); }
    }
    if (!enc) continue;
    const f = fightCrew(ctx, fit, { faction: 'brigands', count: count, days: day, difficulty: 0 }, seed * 1000 + day, start.cap);
    let downs = 0, deaths = 0;
    fit.slice(0, f.men.length).forEach((m, i) => { const r = f.men[i]; if (!r) return;
      if (r.dead && !m.main) { m.dead = day; deaths++; return; }
      grant(m, r.xp); if (r.down) { downs++; if (!m.main) m.laidUntil = day + Math.max(1, r.laidUp || 30); } });
    let pay = 0; if (f.won && enc.kind === 'job') pay = Math.round(PAY * enc.skulls * ECON) + (start.pay | 0);
    purse += pay;
    log.push({ day: day, kind: enc.kind, skulls: enc.skulls || null, count: count, fielded: Math.min(fit.length, start.cap), won: f.won, mainDown: f.mainDown,
      minHp: Math.round(f.minHp * 100) / 100, downs: downs, deaths: deaths, purse: purse, level: men[0].level, levels: Math.round(10 * men.filter(m => !m.dead && !m.walked).reduce((t, m) => t + m.level, 0) / Math.max(1, men.filter(m => !m.dead && !m.walked).length)) / 10 });
  }
  return { seed: seed, log: log, end: { men: men.length, alive: men.filter(m => !m.dead && !m.walked).length, dead: men.filter(m => m.dead).length, walked: men.filter(m => m.walked).length,
    main_level: men[0].level, purse: purse, stats0: men[0].stats } };
}
function sumDays(runs, upTo) {
  const fights = runs.map(r => r.log.filter(e => e.day <= upTo && e.count != null));
  const n = fights.reduce((t, L) => t + L.length, 0), won = fights.reduce((t, L) => t + L.filter(e => e.won).length, 0);
  const lost = fights.map(L => L.filter(e => !e.won).length), p = (x, y) => y ? Math.round(100 * x / y) : null;
  const win10 = [[1, 10], [11, 20], [21, 30], [31, 40], [41, 50], [51, 60], [61, 70], [71, 80], [81, 90], [91, 100]].filter(([a]) => a <= upTo).map(([a, b]) => { const F = [].concat.apply([], runs.map(r => r.log.filter(e => e.day >= a && e.day <= b && e.count != null)));
    return { days: a + '-' + b, fights: F.length, won_in_100: p(F.filter(e => e.won).length, F.length), avg_enemies: F.length ? Math.round(10 * F.reduce((t, e) => t + e.count, 0) / F.length) / 10 : null }; });
  return { seeds: runs.length, days: upTo, fights_a_run: Math.round(10 * n / runs.length) / 10, won_in_100: p(won, n), lost_fights_a_run: Math.round(10 * lost.reduce((a, b) => a + b, 0) / runs.length) / 10,
    runs_never_lost_in_100: p(lost.filter(x => x === 0).length, runs.length), first_fight_won_in_100: p(fights.filter(L => L[0] && L[0].won).length, fights.filter(L => L[0]).length),
    you_down_in_100_fights: p(fights.reduce((t, L) => t + L.filter(e => e.mainDown).length, 0), n), men_down_a_fight: n ? Math.round(100 * fights.reduce((t, L) => t + L.reduce((s, e) => s + e.downs, 0), 0) / n) / 100 : null,
    dead_a_run: Math.round(10 * runs.reduce((t, r) => t + r.log.filter(e => e.day <= upTo).reduce((s, e) => s + (e.deaths || 0), 0), 0) / runs.length) / 10,
    walked_a_run: Math.round(10 * runs.reduce((t, r) => t + r.log.filter(e => e.day <= upTo && e.walked).length, 0) / runs.length) / 10,
    closest_call_median_pct: Math.round(100 * median(fights.map(L => Math.min.apply(null, L.filter(e => e.won).map(e => e.minHp).concat([1]))))),
    main_level: median(runs.map(r => { const l = r.log.filter(e => e.day <= upTo && e.level).pop(); return l ? l.level : null; })),
    purse: median(runs.map(r => { const l = r.log.filter(e => e.day <= upTo && e.purse != null).pop(); return l ? l.purse : null; })), by_ten_days: win10 };
}

/* ---------- THE LADDER (the Lone Wolf alone) ---------- */
const L_DAYS = [1, 20, 40], L_COUNTS = [1, 2, 3, 4, 5, 6, 8];
function ladderCell(ctx, c, n) {
  const T = { won: 0, down: 0, minHp: 0, close: 0 };
  for (let k = 0; k < n; k++) { const s = wolfStart(c.god, 500 + k);
    const f = fightCrew(ctx, s.men, { faction: 'brigands', count: c.count, days: c.day, difficulty: 0 }, 7000 + k, 12);
    if (f.won) T.won++; if (f.mainDown) T.down++; T.minHp += f.minHp; if (f.won && f.minHp < 0.25) T.close++; }
  const p = x => Math.round(100 * x / n);
  return { fights: n, won_in_100: p(T.won), down_in_100: p(T.down), avg_lowest_health_pct: p(T.minHp), won_under_a_quarter_in_100: p(T.close) };
}

/* ---------- THE TRACKS ---------- */
const WOLF_TRACKS = Object.keys(GODS).map(g => ({ id: 'wolf_' + g + '_picks', start: { wolf: g }, policy: 'picks', every: 2, days: 50 }))
  .concat(['today', 'god3', 'god5'].map(g => ({ id: 'wolf_' + g + '_takes', start: { wolf: g }, policy: 'takes', every: 2, days: 50 })))
  .concat(['picks', 'takes'].map(p => ({ id: 'wolf_god3_' + p + '_100', start: { wolf: 'god3' }, policy: p, every: 2, days: 100 })));
const TRACKS = () => WOLF_TRACKS.concat(ORIGIN_TRACKS.filter(t => !t.needs || !!PROPOSALS[t.needs]));
let ORIGIN_TRACKS = [];   /* filled after the origin starts below */
const ORIGIN_DAYS = 30, ORIGIN_SEEDS = 60;
function startOf(track, seed) { if (track.start.wolf) return wolfStart(track.start.wolf, seed); return originStart(track.start.origin, track.start.variant, seed); }

/* ---------- THE OTHER FOURTEEN: TODAY and the PROPOSAL (section 2 of the page; filled in its own commit) ---------- */
function todayMan(m, i, seed) {
  const t = todayStats(m.background, i), R0 = rng(seed * 7919 + 31 * i + 7), job = (t.jobs || []).filter(j => j !== 'car_door')[0];
  return { background: m.background, name: t.name, main: t.main, level: m.level || 1, xp: xpFor(m.level || 1), stats: t.stats, stars: starsOf(R0),
    plan: BACK_JOBS.indexOf(job) >= 0 ? PLAN.back : PLAN.front, gear: null, perkOrder: null, R: rng(seed * 104729 + 31 * i + 3) };
}
/* THE PROPOSALS (section 2 of the page): every man at his stated level is a REAL body (his door level-ups taken, four picks
   on his plan), exactly three talents at 60/30/10 unless his origin's promise says otherwise, and the kit the promise names
   handed in our world's things (COOK's table), guns first (rule 120(a)); the purse is the origin's, plus a week of the bill in
   the wagon (Battle Brothers starts every company with 3 to 19 days of food; rule 117: ours never fewer, the easy end a week) */
const KIT = {   /* the rows by the things a player meets them as */
  pistol: 'dagger', pistol2: 'rondel_dagger', rifle: 'light_crossbow', rifle2: 'crossbow', shotgun: 'handgonne', pipe: 'bludgeon', pipe2: 'winged_mace',
  sledge: 'two_handed_mallet', machete: 'shortsword', machete2: 'falchion', fire_axe: 'crude_axe', hatchet: 'hatchet', spear: 'boar_spear', bow: 'hunting_bow',
  car_door: 'wooden_shield', car_door2: 'heater_shield', riot_shield: 'kite_shield',
  rags: 'linen_tunic', work_jacket: 'thick_tunic', padded_vest: 'padded_surcoat', padded_vest2: 'leather_lamellar_armor', plate_carrier: 'basic_mail_shirt', plate_carrier2: 'mail_hauberk', riot_armour: 'reinforced_mail_hauberk',
  rag_hood: 'hood', hard_hat: 'aketon_cap', hard_hat2: 'closed_mail_coif', riot_helmet: 'nasal_helmet', full_riot_helm: 'nasal_helmet_with_mail'
};
const kit = (main, off, body, head, bag) => ({ main: KIT[main] || main || null, off: off ? KIT[off] || off : null, body: body ? KIT[body] || body : null, head: head ? KIT[head] || head : null, bag: (bag || []).map(b => KIT[b] || b) });
function realMan(spec, i, seed) {
  const R = rng(seed * 7919 + 977 * (i + 1)), b = bgRow(spec.bg), st = {};
  STATS.forEach(k => { const r = b.stats[k]; st[k] = rint(R, r[0], r[r.length - 1]); });
  const stars = spec.stars && spec.stars !== 'bb' ? Object.assign({}, spec.stars) : starsOf(R);
  const plan = PLAN[spec.plan || (spec.gear && BACK_JOBS.indexOf(jobOfMain(spec.gear.main)) >= 0 ? 'back' : 'front')];
  const level = spec.level || 1;
  for (let lv = 2; lv <= level; lv++) { const r = levelRolls(stars, lv, R); plan.forEach(k => { st[k] += r[k]; }); }
  const cls = spec.gear && classOf(spec.gear.main);
  return { background: spec.bg, name: CREW[i % CREW.length].name, main: i === 0, level: level, xp: xpFor(level), stats: st, stars: stars, plan: plan,
    gear: spec.gear || null, perkOrder: spec.perks || (BLADE[cls] ? bladePerks(cls) : null), R: rng(seed * 104729 + 31 * i + 3) };
}
function jobOfMain(id) { const c = classOf(id); return { crossbow: 'rifle', bow: 'rifle', firearm: 'shotgun', throwing: 'bottles' }[c] || c; }
const WEEK = 7;
const P = (men, extra) => Object.assign({ men: men, food_days: WEEK }, extra || {});
const PROPOSAL_SPECS = {
  /* THE CREW THAT IS LEFT (Rebuilding a Company, easy, the tutorial): the three who are left, level 1, the learning start */
  rebuild: P([{ bg: 'companion_2hand', gear: kit('pistol', 'car_door', 'padded_vest', 'hard_hat') },
              { bg: 'companion_1hand', gear: kit('pipe', 'car_door', 'padded_vest', 'hard_hat') },
              { bg: 'companion_ranged', gear: kit('rifle', null, 'padded_vest', 'rag_hood') }]),
  /* A NEW CREW (A New Company, easy, 'three experienced mercenaries'): the same three, a step better kit, nothing owed */
  newcrew: P([{ bg: 'companion_2hand', gear: kit('pistol', 'car_door', 'padded_vest2', 'hard_hat') },
              { bg: 'companion_1hand', gear: kit('pipe', 'car_door2', 'padded_vest2', 'hard_hat') },
              { bg: 'companion_ranged', gear: kit('rifle', null, 'padded_vest', 'hard_hat') }]),
  /* UP FROM HENDERSON (Southern Mercenaries, easy; our line: 'three guns and no friends'): every man a gun */
  south: P([{ bg: 'companion_2hand', gear: kit('pistol', 'car_door', 'padded_vest', 'hard_hat') },
            { bg: 'companion_1hand', gear: kit('shotgun', null, 'padded_vest', 'hard_hat') },
            { bg: 'companion_ranged', gear: kit('rifle', null, 'padded_vest', 'rag_hood') }]),
  /* THE WATER TRUCK (Trading Caravan, easy): two drivers, a pistol and a rifle; the money is the strength (the wagon's goods) */
  truck: P([{ bg: 'caravan_hand', gear: kit('pistol', 'car_door', 'padded_vest', 'hard_hat') },
            { bg: 'caravan_hand', gear: kit('rifle', null, 'padded_vest', 'rag_hood') }], { food_days: 19, wagon: 171 }),
  /* THE BLOCK WATCH (Peasant Militia, easy): twelve neighbours, numbers over gear: two rifles to the best eyes, pipes and car doors */
  watch: P([{ bg: 'farmhand', gear: kit('pistol', 'car_door', 'work_jacket', 'rag_hood') }, { bg: 'farmhand', gear: kit('pipe', 'car_door', 'work_jacket', 'rag_hood') },
            { bg: 'poacher', gear: kit('rifle', null, 'work_jacket', 'rag_hood') }, { bg: 'daytaler', gear: kit('pipe', 'car_door', 'work_jacket', 'rag_hood') },
            { bg: 'daytaler', gear: kit('sledge', null, 'work_jacket', 'rag_hood') }, { bg: 'miller', gear: kit('pipe', 'car_door', 'work_jacket', 'rag_hood') },
            { bg: 'fisherman', gear: kit('rebar', null, 'work_jacket', 'rag_hood') }, { bg: 'militia', gear: kit('rifle', null, 'work_jacket', 'rag_hood') },
            { bg: 'militia', gear: kit('pipe', 'car_door', 'padded_vest', 'rag_hood') }, { bg: 'minstrel', gear: kit('pistol', null, 'work_jacket', 'rag_hood') },
            { bg: 'vagabond', gear: kit('pipe', 'car_door', 'work_jacket', 'rag_hood') }, { bg: 'butcher', gear: kit('cleaver', 'car_door', 'work_jacket', 'rag_hood') }]),
  /* THE SCAVENGERS (Band of Poachers, medium): three shooters who look before they go in (they always pick) */
  scav: P([{ bg: 'hunter', gear: kit('rifle2', null, 'padded_vest', 'rag_hood') }, { bg: 'poacher', gear: kit('rifle', null, 'padded_vest', 'rag_hood') },
           { bg: 'poacher', gear: kit('rifle', null, 'padded_vest', 'rag_hood') }], { food_days: WEEK }),
  /* THE PROMISE KEEPERS (Oathtakers, medium): two men, each in good kit; the old one level 3 with the standard */
  promise: P([{ bg: 'oathtaker', level: 3, gear: kit('pipe2', 'riot_shield', 'plate_carrier2', 'full_riot_helm') },
              { bg: 'oathtaker', level: 1, gear: kit('pistol2', 'car_door2', 'plate_carrier2', 'riot_helmet') }]),
  /* THE DESERTERS (medium): soldiers' armour (the wiki's own kit: three mail hauberks, two heater shields, aketon caps, a light
     crossbow, a shortsword, a hatchet), hunted */
  desert: P([{ bg: 'deserter', level: 2, gear: kit('pistol', 'car_door2', 'plate_carrier2', 'hard_hat', ['hatchet']) },
             { bg: 'deserter', level: 2, gear: kit('machete', 'car_door2', 'plate_carrier2', 'hard_hat') },
             { bg: 'deserter', level: 1, gear: kit('rifle', null, 'plate_carrier2', 'hard_hat') }]),
  /* THE RAIDERS (Northern Raiders, medium): three veteran raiders in heavy kit and the monk; outlaws */
  raid: P([{ bg: 'barbarian', level: 3, gear: kit('fire_axe', 'car_door2', 'plate_carrier2', 'riot_helmet') },
           { bg: 'barbarian', level: 3, gear: kit('sledge', null, 'plate_carrier2', 'riot_helmet') },
           { bg: 'barbarian', level: 3, gear: kit('shotgun', null, 'plate_carrier2', 'riot_helmet') },
           { bg: 'monk', gear: kit('pistol', 'car_door', 'work_jacket', 'rag_hood') }]),
  /* THE LAB RATS (Anatomists, medium): three who are not fighters; they shoot from the back and the money is theirs */
  lab: P([{ bg: 'anatomist', gear: kit('pistol', 'car_door', 'padded_vest', 'hard_hat') }, { bg: 'anatomist', gear: kit('rifle', null, 'padded_vest', 'rag_hood') },
          { bg: 'anatomist', gear: kit('rifle', null, 'padded_vest', 'rag_hood') }]),
  /* THE FAITHFUL (Davkul Cultists, medium): four in rags with pipes and a pistol; their resolve is their own */
  faith: P([{ bg: 'cultist', gear: kit('pistol', 'car_door', 'rags', 'rag_hood') }, { bg: 'cultist', gear: kit('pipe', 'car_door', 'rags', 'rag_hood') },
            { bg: 'cultist', gear: kit('pipe', 'car_door', 'rags', 'rag_hood') }, { bg: 'cultist', gear: kit('rifle', null, 'rags', 'rag_hood') }]),
  /* THE DEBT COLLECTORS (Manhunters, hard): two collectors with guns, four in debt with pipes in front */
  debt: P([{ bg: 'manhunter', gear: kit('pistol', 'car_door', 'padded_vest', 'hard_hat') }, { bg: 'manhunter', gear: kit('rifle', null, 'padded_vest', 'hard_hat') },
           { bg: 'indebted', gear: kit('pipe', 'car_door', 'rags', null) }, { bg: 'southern_indebted', gear: kit('pipe', 'car_door', 'rags', null) },
           { bg: 'southern_indebted', gear: kit('pipe', 'car_door', 'rags', null) }, { bg: 'southern_indebted', gear: kit('sledge', null, 'rags', null) }]),
  /* THE HUNTERS (Beast Slayers, hard): three level-2 slayers in decent kit, the spear and two rifles */
  hunt: P([{ bg: 'beast_slayer', level: 2, gear: kit('spear', 'car_door2', 'padded_vest2', 'hard_hat2') },
           { bg: 'beast_slayer', level: 2, gear: kit('rifle2', null, 'padded_vest2', 'hard_hat2') },
           { bg: 'beast_slayer', level: 2, gear: kit('rifle', null, 'padded_vest2', 'hard_hat2') }]),
  /* THE FIGHT PIT (Gladiators, hard): three arena stars, level 3, good kit, all three die and it ends */
  pit: P([{ bg: 'gladiator', level: 3, gear: kit('machete2', 'riot_shield', 'plate_carrier2', 'riot_helmet') },
          { bg: 'gladiator', level: 3, gear: kit('fire_axe', 'car_door2', 'plate_carrier2', 'riot_helmet') },
          { bg: 'gladiator', level: 3, gear: kit('shotgun', null, 'plate_carrier2', 'riot_helmet') }])
};
KIT.rebar = 'militia_spear'; KIT.cleaver = 'butcher_s_cleaver';
const PROPOSALS = {};   /* id -> function(seed) -> { men, purse } */
Object.keys(PROPOSAL_SPECS).forEach(id => { const S = PROPOSAL_SPECS[id], o = ORIGINS.filter(x => x.id === id)[0];
  PROPOSALS[id] = function (seed) { const men = S.men.map((m, i) => realMan(Object.assign({}, m, { gear: Object.assign({}, m.gear, { main: KIT[m.gear.main] || m.gear.main }) }), i, seed));
    return { men: men, purse: o.batteries.full + (S.wagon || 0) + BILL.per_man_per_night.value * men.length * (S.food_days || 0) }; };
  PROPOSALS[id].spec = S; });
function originStart(id, variant, seed) {
  const o = ORIGINS.filter(x => x.id === id)[0];
  if (variant === 'today') return { origin: id, variant: variant, men: o.men.map((m, i) => todayMan(m, i, seed)), purse: o.batteries.full, cap: o.field_cap, pay: o.pay | 0 };
  const P = PROPOSALS[id](seed);
  return { origin: id, variant: variant, men: P.men, purse: P.purse != null ? P.purse : o.batteries.full, cap: P.cap || o.field_cap, pay: P.pay != null ? P.pay : (o.pay | 0) };
}

/* the stamp: the fight and its files plus this bench's own logic */
ORIGIN_TRACKS = [].concat.apply([], ORIGINS.filter(o => o.id !== 'wolf').map(o => [].concat.apply([], ['today', 'proposed'].map(v => ['picks', 'takes'].map(p =>
  ({ id: o.id + '_' + v + '_' + p, start: { origin: o.id, variant: v }, policy: p, every: 2, days: ORIGIN_DAYS, seeds: ORIGIN_SEEDS, needs: v === 'proposed' ? o.id : null }))))));

/* the stamp: the fight and its files, the map's sums (the lone wolf bench's mapCount) and this bench's play logic (LOGIC, bumped
   when days() or fightCrew() change); a track's own start is in its key (specOf), so a new proposal plays only itself */
const LOGIC = 'days-v2';
function stamp() { return G.fightPrint([{ text: LOGIC }, { text: fs.readFileSync(path.join(__dirname, 'bohemia_tuning_lone_wolf.js'), 'utf8') }]); }
function hashOf(t) { let h = 2166136261; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
function specOf(t) { const s = t.start.wolf ? JSON.stringify(GODS[t.start.wolf]) + rollGod.toString() + wolfStart.toString()
  : (t.start.variant === 'today' ? todayMan.toString() : JSON.stringify(PROPOSAL_SPECS[t.start.origin]) + realMan.toString() + JSON.stringify(KIT)); return hashOf(s + JSON.stringify(t)); }
function cache() { const fp = stamp(), got = {};
  if (fs.existsSync(CELLS)) fs.readFileSync(CELLS, 'utf8').split('\n').filter(Boolean).forEach(l => { try { const x = JSON.parse(l); if (x.fp === fp) got[x.k] = x.v; } catch (e) { } });
  return { fp: fp, got: got, put: (k, v) => fs.appendFileSync(CELLS, JSON.stringify({ k: k, fp: fp, v: v }) + '\n') }; }
async function worker(job) {
  const ctx = await G.engine(true);
  if (job.kind === 'ladder') return ladderCell(ctx, job.cell, job.n);
  if (job.kind === 'days') { const T = TRACKS().filter(t => t.id === job.track)[0]; return job.seeds.map(s => days(ctx, startOf(T, s), T, s)); }
  throw new Error('no such job');
}
function pool(jobs, N, onDone) {
  return new Promise(done => { let next = 0, running = 0, fin = 0; const t0 = Date.now(); if (!jobs.length) return done();
    const pump = () => { while (running < N && next < jobs.length) { const j = jobs[next++]; running++;
      cp.execFile(process.execPath, [__filename, '--job', JSON.stringify(j.job)], { maxBuffer: 1 << 28 }, (err, out) => { running--; fin++;
        if (err) { console.error('job failed', JSON.stringify(j.job).slice(0, 200), err.message.slice(0, 600)); process.exit(1); }
        onDone(j, JSON.parse(out)); if (fin % 10 === 0 || fin === jobs.length) process.stderr.write(fin + '/' + jobs.length + ' ' + Math.round((Date.now() - t0) / 1000) + 's\n');
        if (fin === jobs.length) done(); else pump(); }); } };
    pump(); });
}
function doorCard(s) {   /* what stands at the door: each man's level, stats, stars and kit */
  return s.men.map(m => ({ background: m.background, level: m.level, stats: m.stats, stars: m.stars, gear: m.gear, perks: m.perkOrder ? perksFor(m.perkOrder, m.level) : '(the fight picks by his job)' }));
}
async function main() {
  const argv = process.argv, arg = (k, d) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };
  if (argv[2] === '--job') { process.stdout.write(JSON.stringify(await worker(JSON.parse(argv[3])))); return; }
  const JOBS = Number(arg('--jobs', 4));
  if (argv.includes('--who')) { const id = arg('--who', 'wolf');
    if (id === 'wolf' || !id) Object.keys(GODS).forEach(g => console.log(g, JSON.stringify(doorCard(wolfStart(g, 1)))));
    else ['today'].concat(PROPOSALS[id] ? ['proposed'] : []).forEach(v => console.log(id, v, JSON.stringify(doorCard(originStart(id, v, 1)))));
    return; }
  const C = cache();
  if (argv.includes('--ladder')) { const n = Number(arg('--n', 60)), jobs = [];
    Object.keys(GODS).forEach(g => L_DAYS.forEach(d => L_COUNTS.forEach(c => { const k = 'ladder|' + g + '|' + d + '|' + c + '|' + n; if (!C.got[k]) jobs.push({ k: k, job: { kind: 'ladder', n: n, cell: { god: g, day: d, count: c } } }); })));
    process.stderr.write('ladder: ' + jobs.length + ' cells\n'); await pool(jobs, JOBS, (j, v) => { C.put(j.k, v); C.got[j.k] = v; }); }
  if (argv.includes('--days')) { const S = Number(arg('--seeds', 100)), chunk = Number(arg('--chunk', 10)), only = arg('--only', null), jobs = [];
    TRACKS().filter(t => !only || t.id.indexOf(only) === 0).forEach(t => { const seeds = t.seeds || S;
      for (let s0 = 1; s0 <= seeds; s0 += chunk) { const ss = []; for (let s = s0; s < s0 + chunk && s <= seeds; s++) ss.push(s);
        const k = 'days|' + t.id + '|' + ss[0] + '-' + ss[ss.length - 1] + '|' + specOf(t); if (!C.got[k]) jobs.push({ k: k, job: { kind: 'days', track: t.id, seeds: ss } }); } });
    process.stderr.write('days: ' + jobs.length + ' chunks\n'); await pool(jobs, JOBS, (j, v) => { C.put(j.k, v); C.got[j.k] = v; }); }
  if (argv.includes('--write') || argv.includes('--print')) {
    const ladder = {}, runs = {};
    Object.keys(C.got).forEach(k => { const p = k.split('|');
      if (p[0] === 'ladder') ladder[p[1] + '|' + p[2] + '|' + p[3]] = Object.assign({ god: p[1], day: +p[2], count: +p[3] }, C.got[k]);
      if (p[0] === 'days') { const T = TRACKS().filter(t => t.id === p[1])[0]; if (T && specOf(T) === p[3]) (runs[p[1]] = runs[p[1]] || []).push.apply(runs[p[1]], C.got[k]); } });
    const tracks = {};
    TRACKS().forEach(t => { if (!runs[t.id]) return; const R = runs[t.id].sort((a, b) => a.seed - b.seed);
      tracks[t.id] = { track: t, first: sumDays(R, t.days), first_ten: sumDays(R, 10), door: doorCard(startOf(t, 1)) }; });
    const spread = {}; Object.keys(GODS).forEach(g => { if (GODS[g].kind !== 'god') return; const S = []; for (let s = 1; s <= 200; s++) S.push(wolfStart(g, s).men[0]);
      spread[g] = {}; STATS.forEach(k => { const v = S.map(m => m.stats[k]).sort((a, b) => a - b); spread[g][k] = [v[0], v[100], v[199]]; }); });
    const out = { _readme: 'TUNING [every origin starts like itself] 10/25 (rule 184; research only, rule 38g). draft:true. NOTHING IN THE GAME READS THIS FILE. '
      + 'Every fight is the live fight (slices/BOHEMIA_FIGHT.html, AUTO both sides, seeded) through tools/bohemia_tuning_every_origin.js. ladder: the Lone Wolf alone, key god|day|count. '
      + 'tracks: each start played its first days (first) and its first ten (first_ten). wolf_spread: the rolled gods over 200 seeds, [lowest, median, highest] a stat.',
      draft: true, schema: 1, stamp: C.fp, gods: GODS, hk_kit: HK_KIT, plans: PLAN, wolf_spread: spread, ladder: ladder, tracks: tracks };
    if (argv.includes('--write')) { fs.writeFileSync(BANK, JSON.stringify(out, null, 1) + '\n'); console.log('wrote ' + path.relative(ROOT, BANK)); }
    else console.log(JSON.stringify(Object.fromEntries(Object.entries(tracks).map(([k, v]) => [k, Object.assign({}, v.first, { by_ten_days: v.first.by_ten_days.map(w => w.won_in_100).join('/') })])), null, 1));
  }
}
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { wolfStart, originStart, days, fightCrew, todayStats, GODS, PROPOSALS, PLAN };
