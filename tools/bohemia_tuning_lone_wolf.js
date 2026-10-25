#!/usr/bin/env node
// TUNING [the first fifty days and the lone wolf] 10/25 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g; rule 183).
// Paolo 10/25: 'there definitely isn't incentive for the first 50 days to grow your crew unless it's god-tier recruits...
// that's why in Battle Brothers I always loved playing Lone Wolf: you start with a mega god who, when you get him good
// equipment, is virtually impossible to kill until the game starts getting harder on you.'
//
// Three things, all on the LIVE fight (slices/BOHEMIA_FIGHT.html played headless through tools/bohemia_tuning_the_whole_grid.js's
// engine, plain: no hooks), both sides on the fight's own brain (AUTO), seeded:
//  WHO     who stands at the door when he picks THE LONE WOLF: the man the fight builds from records/target/bb/origins.json
//          (a level-4 hedge knight in YOU's place in the line), his kit and his perks, read off the fight's own setup.
//  LADDER  one man alone against 1 to 8 brigands dressed for day 1 to 100 (the map's faction; ours.enemy_tiers dresses them),
//          four wolves (below), at the door's level: how often he wins, how often he falls, how close he comes.
//  CAMPAIGN the days PLAYED: from the door to day 100 (the first fifty are the window he named; 51 to 100 is the turn), a fight
//          every C days, the party the map hands (records/target/bb/party_math.json: the job's count from his roster's strength
//          and the skulls, a roaming party's from the days and the blocks from town, the day-one cap of the company plus one),
//          dressed by the day; XP from the fight's own count, level-ups his choice on his star rolls (rules.json), the purse
//          (the door's start money, the board's pay a skull, two batteries a man a night, a hire's wage), and a second man
//          hired at the post (ordinary) or one the post never offers (exceptional).
//
//   node tools/bohemia_tuning_lone_wolf.js --who                 the man at the door (fast)
//   node tools/bohemia_tuning_lone_wolf.js --ladder [--n 60]     the ladder (resumable)
//   node tools/bohemia_tuning_lone_wolf.js --campaign [--seeds 100]   the days played (resumable)
//   node tools/bohemia_tuning_lone_wolf.js --write               everything cached, into banks/BOHEMIA_TUNING_LONE_WOLF_10_25_26.json
//   --jobs 4 worker processes; --job '<json>' (a worker)
// Every number it prints is DRAFT (research only; nothing in the game reads the bank).
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const BANK = path.join(ROOT, 'banks/BOHEMIA_TUNING_LONE_WOLF_10_25_26.json');
const CELLS = BANK.replace(/\.json$/, '.cells.ndjson');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const G = require('./bohemia_tuning_the_whole_grid.js');
const XP = J('records/target/bb/rules.json').experience, BGS = J('records/target/bb/backgrounds.json');
const PM = J('records/target/bb/party_math.json'), ORIGINS = J('records/target/bb/origins.json').origins;
const SHELF = J('records/target/BOHEMIA_BOARD_SHELF.json'), BILL = J('records/target/bb/nightly_bill.json');
const WEAPONS = J('records/target/bb/weapons.json').rows, ARMOR = J('records/target/bb/armor.json');
const WOLF = ORIGINS.filter(o => o.id === 'wolf')[0];

const STATS = ['hp', 'fatigue', 'resolve', 'initiative', 'melee_skill', 'ranged_skill', 'melee_defense', 'ranged_defense'];
const KEY = { hp: 'HP', fatigue: 'Fatigue', resolve: 'Resolve', initiative: 'Initiative', melee_skill: 'Melee Skill', ranged_skill: 'Ranged Skill',
  melee_defense: 'Melee Defense', ranged_defense: 'Ranged Defense' };
function rng(seed) { let a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function rint(R, a, b) { return a + Math.floor(R() * (b - a + 1)); }
function rollRange(txt, R) { const m = String(txt).split('-').map(Number); return rint(R, m[0], m.length > 1 ? m[1] : m[0]); }
const bgRow = id => BGS.rows.filter(r => r.id === id)[0];

/* ---------- THE KITS ----------
   TODAY   what the live game hands THE LONE WOLF: nothing in origins.json names his gear, so the fight puts him in the first place
           in the line, YOU's (ours.crew[0]): the pistol (dagger), the car door (wooden shield), a work jacket (padded surcoat, 50)
           and a rag hood (open leather cap, 40).
   GOOD    Battle Brothers' 'great equipment' (the Lone Wolf page says those words and names no item): the hedge knight's own kit
           off the wiki's Hedge Knight (Enemy) page, its light end: an arming sword and a heater shield, a reinforced mail
           hauberk (210) and a closed flat top with mail (280). GOOD2H: the same armour, a greatsword. */
const KITS = {
  today: null,
  good: { main: 'arming_sword', off: 'heater_shield', body: 'reinforced_mail_hauberk', head: 'closed_flat_top_with_mail', bag: [] },
  good2h: { main: 'greatsword', off: null, body: 'reinforced_mail_hauberk', head: 'closed_flat_top_with_mail', bag: [] },
  mid: { main: 'winged_mace', off: 'kite_shield', body: 'mail_hauberk', head: 'nasal_helmet_with_mail', bag: [] }
};
function priceOf(id) {   /* engine/bohemia_roster.js priceOf: the row's value / 10 */
  const w = WEAPONS.filter(r => r.id === id)[0]; if (w) return Math.max(1, Math.round(w.value / 10));
  for (const k of ['body', 'head', 'shields']) { const a = ARMOR[k].filter(r => r.id === id)[0]; if (a) return Math.max(1, Math.round(a.value / 10)); }
  return null;
}
/* the perks a sword man takes, a Battle Brothers Lone Wolf's order (tier n opens after n-1 points, the fight's own pickPerks rule):
   Colossus, Steel Brow, Brawny (the armour weighs less on his breath), then the mastery, the Lone Wolf perk itself, Battle
   Forged, Shield Expert, Indomitable, Killing Frenzy. A pistol man takes the fight's own pistol build (ours.perk_builds). */
const SWORD_PERKS = ['colossus', 'steel_brow', 'brawny', 'sword_mastery', 'lone_wolf', 'battle_forged', 'shield_expert', 'nine_lives', 'indomitable', 'killing_frenzy'];

/* ---------- THE WOLVES ----------
   w_today   the live game: the fight's own roll of YOU as a hedge knight (deterministic: every Lone Wolf is this man), level 4,
             the three door levels giving no stats (the crew screen's startLevel hands the points and no rolls), the pistol
             build's perks the fight picks for level 4, the TODAY kit
   w_good    the same man in the GOOD kit, the sword perks (the fight has no perk build for a sword: a sword man fights with none)
   w_bb      Battle Brothers' Lone Wolf: a hedge knight rolled in the wiki's range (melee defence -2, 4 to 8, the Lone Wolf page),
             three talents (60/30/10), his three door level-ups taken (Battle Brothers' three picks: melee skill, melee defence,
             fatigue), the sword perks, the GOOD kit
   w_bb2h    the same, with the greatsword */
const WOLVES = {
  w_today: { name: 'TODAY: the live game\'s Lone Wolf (YOU\'s kit, the three door levels give no stats, the pistol build\'s perks)', kit: 'today', stats: 'door', perks: null },
  w_good: { name: 'TODAY\'S MAN IN GOOD GEAR (the hedge knight\'s kit off the wiki, the sword perks)', kit: 'good', stats: 'door', perks: SWORD_PERKS },
  w_bb: { name: 'BATTLE BROTHERS\' LONE WOLF (his three door level-ups taken, three talents, the good kit, the sword perks)', kit: 'good', stats: 'bb', perks: SWORD_PERKS },
  w_bb2h: { name: 'BATTLE BROTHERS\' LONE WOLF WITH THE GREATSWORD', kit: 'good2h', stats: 'bb', perks: SWORD_PERKS }
};
const PLAN = { four: ['melee_skill', 'melee_defense', 'fatigue', 'ranged_defense'], bb: ['melee_skill', 'melee_defense', 'fatigue'] };

function perksFor(order, level, DB) {
  const tier = id => { const r = DB.perks.rows.filter(x => x.id === id)[0]; return r ? r.tier : 99; };
  const got = [], pts = Math.min(level, 11) - 1;
  order.forEach(id => { if (got.length < pts && got.length >= tier(id) - 1) got.push(id); });
  return got;
}
function starsOf(R) {   /* Battle Brothers' talents: three of the eight, 60/30/10 (rules.json talent_star_odds) */
  const pool = STATS.slice(), st = {}, O = XP.talent_star_odds.value;
  for (let s = 0; s < 3; s++) { const k = pool.splice(Math.floor(R() * pool.length), 1)[0]; const q = R(); st[k] = q < O['1'] ? 1 : q < O['1'] + O['2'] ? 2 : 3; }
  return st;
}
function levelRolls(stars, level, R) {   /* one level's eight rolls on his star columns; past 11 the veteran +1 */
  const out = {};
  STATS.forEach(k => { out[k] = level > 11 ? XP.veteran_level_rules.value.max_per_stat : rollRange(XP.stat_gains_by_stars.value[KEY[k]][stars[k] || 0], R); });
  return out;
}
function bbBase(R) {   /* a hedge knight off the wiki's range, the Lone Wolf's melee defence -2 */
  const b = bgRow('hedge_knight'), st = {};
  STATS.forEach(k => { const r = b.stats[k]; st[k] = rint(R, r[0], r[r.length - 1]); });
  st.melee_defense -= 2;
  return st;
}
function xpFor(level) {   /* engine/bohemia_roster.js xpFor: the wiki's table, past 11 the veteran formula */
  if (level <= 1) return 0;
  const tb = XP.level_table_total_xp.value; if (level <= 11) return tb[String(level)];
  let t = tb['11']; for (let l = 11; l < level; l++) t += 4000 + 1000 * (l - 11); return t;
}
function levelOf(xp) { let l = 1; while (l < XP.veteran_level_rules.value.max_level && xp >= xpFor(l + 1)) l++; return l; }

/* ---------- ONE FIGHT ---------- */
function fight(ctx, company, party, seed, cap) {
  const F = ctx.FIGHT; ctx.setSeed(seed);
  F.setup({ auto: true, formation: null, company: company, cap: cap || 12, party: party, days: party.days });
  const yours = F.S.units.filter(u => u.side === 'you'), w = yours[0];
  const idle = G.idleWatch(F);
  let g = 0, minHp = 1, wolfTurns = 0, wolfSpent = 0, last = -1;
  while (!F.S.over && g < 200000) {
    const u = F.current(); if (!u) break;
    if (u === w && last !== F.S.round) { last = F.S.round; wolfTurns++; if (w.fat >= F.fatMax(w) - 5) wolfSpent++; }
    F.aiStep(u); g++;
    if (w.hpMax) minHp = Math.min(minHp, Math.max(0, w.hp) / w.hpMax);
    if (idle()) break;
  }
  const S = F.S;
  let swings = 0, struck = 0, theirSwingsAtHim = 0;
  S.log.forEach(e => { if (e.t === 'attack') { if (e.id === w.id) swings++; else if (e.to === w.id) { theirSwingsAtHim++; if (e.hit) struck++; } } });
  return { won: S.over && S.result === 'won', stalled: !S.over, rounds: S.round, wolfDown: !!(w.down || w.dead), minHp: minHp,
    men: yours.map(u => ({ name: u.name, down: !!u.down, dead: !!u.dead, xp: u.xpGained || 0 })), enemies: S.units.length - yours.length,
    wolfTurns: wolfTurns, wolfSpent: wolfSpent, swings: swings, struck: struck, swungAt: theirSwingsAtHim };
}

/* the man at the door, as the fight builds him from the origin (the live path: the door hands {background, level} and nothing
   else; the fight puts him in YOU's place) */
function doorMan(ctx) {
  const F = ctx.FIGHT; ctx.setSeed(1);
  F.setup({ auto: true, formation: null, company: WOLF.men.map(m => ({ background: m.background, level: m.level })), cap: WOLF.field_cap, party: { faction: 'brigands', count: 2, days: 1, difficulty: 0 }, days: 1 });
  const w = F.S.units.filter(u => u.side === 'you')[0];
  return { name: w.name, main: w.main, level: w.level, background: w.kind, perks: w.perks.slice(), job: w.job,
    stats: { hp: w.hpMax, fatigue: w.fatigue, resolve: w.resolve, initiative: w.initiative, melee_skill: w.mskill, ranged_skill: w.rskill, melee_defense: w.mdef, ranged_defense: w.rdef },
    kit: { main: w.weapon.id || w.weapon.name, off: w.shield ? w.shield.id : null, body: w.bodyRow ? w.bodyRow.id : null, head: w.headRow ? w.headRow.id : null },
    armour: { body: w.armB, head: w.armH }, breath: F.fatMax(w) };
}
/* the same man through the crew screen (engine/bohemia_roster.js manOf + the screen's startLevel), the other live path */
async function screenMan() {
  const code = fs.readFileSync(path.join(ROOT, 'engine/bohemia_roster.js'), 'utf8');
  const sb = { console, Math, JSON, Object, Array, String, Number, Promise,
    fetch: u => Promise.resolve({ json: () => Promise.resolve(JSON.parse(fs.readFileSync(path.join(ROOT, u.replace(/^\.\.\//, '').replace(/^fight_people/, 'slices/fight_people')), 'utf8'))) }) };
  sb.window = sb; vm.createContext(sb); vm.runInContext(code, sb);
  await sb.BohemiaRoster.load('records/target/bb/');
  const C = sb.BohemiaRoster, def = Object.assign({}, C.data.ours.crew.value[0], { background: 'hedge_knight', level: 4 });
  const m = C.manOf(def, 0);
  return { level_on_the_card: 4, level_manOf_deals: m.level, stats: m.stats, stars: m.stars, perks: m.perks, points_after_startLevel: 3,
    rolls_pending: (m.rolls || []).length, gear: { main: m.gear.main && m.gear.main.id, off: m.gear.off && m.gear.off.id, body: m.gear.body && m.gear.body.id, head: m.gear.head && m.gear.head.id } };
}

/* ---------- A WOLF FOR A FIGHT: company entry from a wolf state ---------- */
function wolfEntry(W, st, DB) {
  const c = { background: 'hedge_knight', level: st.level, stats: Object.assign({}, st.stats) };
  if (KITS[W.kit]) c.gear = Object.assign({}, KITS[st.kit || W.kit]);
  else if (st.kit && KITS[st.kit]) c.gear = Object.assign({}, KITS[st.kit]);
  if (W.perks) c.perks = perksFor(W.perks, st.level, DB);
  return c;
}
function newWolf(W, door, seed) {
  const R = rng(seed * 7919 + 13), stars = starsOf(R);
  let stats;
  if (W.stats === 'door') stats = Object.assign({}, door.stats);
  else {
    stats = bbBase(R);
    for (let lv = 2; lv <= WOLF.men[0].level; lv++) { const r = levelRolls(stars, lv, R); PLAN.bb.forEach(k => { stats[k] += r[k]; }); }
  }
  return { level: WOLF.men[0].level, xp: xpFor(WOLF.men[0].level), stats: stats, stars: stars, R: R, plan: W.stats === 'bb' ? PLAN.bb : PLAN.four, kit: W.kit };
}
function grant(st, xp) {
  st.xp += Math.max(0, Math.round(xp));
  const to = levelOf(st.xp);
  while (st.level < to) { st.level++; const r = levelRolls(st.stars, st.level, st.R); st.plan.forEach(k => { st.stats[k] += r[k]; }); }
}

/* ---------- THE MAP'S PARTY (party_math.json, the live map's own sums: BOHEMIA_CITY_WORLD.html partyMath) ---------- */
function rosterStrength(levels) {
  const R = PM.roster_strength.value;
  return levels.slice().sort((a, b) => b - a).slice(0, R.strongest).reduce((t, l) => t + R.per_man + R.per_level * (Math.max(1, l) - 1), 0);
}
function mapCount(kind, levels, day, ctx) {
  const str = rosterStrength(levels), days = Math.max(1, Math.min(PM.day_cap.value, day)), dif = 0;   /* NEW HERE, the door's default (RUN 10/23) */
  const mult = PM.difficulty_count_mult.value[dif];
  let n, P;
  if (kind === 'job') { P = PM.job.value; n = str / P.strength_per_enemy * (P.skull_mult[String(ctx.skulls)] || 1) * mult; }
  else { P = PM.roaming.value; n = (P.base + P.per_day * (days - 1) + P.per_block_from_town * (ctx.blocks || 0) + P.per_strength * str) * mult; }
  n = Math.max(P.min, Math.min(P.max, Math.floor(n + 0.5)));
  if (day <= 1 && n > levels.length + 1) n = levels.length + 1;   /* the first game day: the company plus one */
  if (kind === 'job' && ctx.camp) n += 2;   /* a camp is bigger than a crew (records/target/BOHEMIA_JOB_KINDS.json clear-camp extra_men) */
  return n;
}
const WORD = n => { const W = PM.count_words.value; for (const w of W) if (n >= w.lo && n <= w.hi) return w.word; return n < 2 ? 'ONE' : 'A FEW'; };

/* ---------- THE RECRUITS ----------
   ord   the best man the post offers: a militia (engine/bohemia_goodbros.js: six backgrounds at the post, the militia's ranges the
         best), level 1, rolled in his range with the post's one star, walking in with what he held (the hall's KIT: the knife,
         the pistol, and a padded surcoat), priced the hall's way (slices/BOHEMIA_SETTLEMENT_SCREEN.html hallPrice), paid his wage
   ex    what the post never offers: a 'god-tier' recruit as Battle Brothers deals one now and then in a big town (a hedge knight,
         level 2, rolled in the top quarter of his range, three talents on melee skill, melee defence and fatigue, his own mid kit:
         a winged mace, a kite shield, mail and a nasal helm with mail), priced on Battle Brothers' own formula (base 150, level
         500 x (level-1)^1.5, his kit at 1.25), paid his wage */
function recruit(kind, seed) {
  const R = rng(seed * 104729 + (kind === 'ex' ? 7 : 3)), st = {};
  if (kind === 'ord') {
    const b = bgRow('militia');
    STATS.forEach(k => { const r = b.stats[k]; st[k] = rint(R, r[0], r[r.length - 1]); });
    const stars = {}; stars[STATS[Math.floor(R() * 8)]] = 1;
    return { name: 'THE HIRE', background: 'militia', level: 1, xp: 0, stats: st, stars: stars, R: R, plan: PLAN.four,
      gear: { main: 'knife', off: null, body: 'padded_surcoat', head: null, bag: [] }, price: hirePrice('militia', 1, ['knife', 'militia_spear', 'padded_surcoat'], R), wage: wageOf('militia', 1) };
  }
  const b = bgRow('hedge_knight');
  STATS.forEach(k => { const r = b.stats[k]; const lo = r[0] + Math.ceil((r[r.length - 1] - r[0]) * 0.75); st[k] = rint(R, lo, r[r.length - 1]); });
  const stars = { melee_skill: 3, melee_defense: 2, fatigue: 2 };
  const out = { name: 'THE GOD-TIER HIRE', background: 'hedge_knight', level: 2, xp: xpFor(2), stats: st, stars: stars, R: R, plan: PLAN.four, gear: Object.assign({}, KITS.mid) };
  const r2 = levelRolls(stars, 2, R); PLAN.four.forEach(k => { st[k] += r2[k]; });
  const kitCrowns = ['winged_mace', 'kite_shield', 'mail_hauberk', 'nasal_helmet_with_mail'].reduce((t, id) => t + priceOf(id) * 10, 0);
  out.price = Math.floor((150 + 500 * Math.pow(1, 1.5) + 1.25 * kitCrowns) * HALL / 10);
  out.wage = wageOf('hedge_knight', 2);
  return out;
}
function hirePrice(bg, level, kit, R) {   /* the hall: base 30..150 by the man's place in the post's price range, the level, the kit at 1.25 */
  const PT = J('records/target/bb/price_table.json').wageAndHire || {};
  const lo = (PT.hiringBaseRange && PT.hiringBaseRange.min) || 30, hi = (PT.hiringBaseRange && PT.hiringBaseRange.maxApprox) || 150;
  const kitCrowns = kit.reduce((t, id) => t + (priceOf(id) || 0) * 10, 0);
  return Math.max(1, Math.floor((lo + R() * (hi - lo) + 500 * Math.pow(Math.max(0, level - 1), 1.5) + (PT.equipmentCostMultiplier || 1.25) * kitCrowns) * HALL / 10));
}
function wageOf(bg, level) { const w = bgRow(bg).daily_wage; return Math.max(1, Math.round(w / 10 * Math.pow(1.1, Math.min(11, level) - 1))); }

/* ---------- THE CAMPAIGN ----------
   track: { wolf, policy: 'takes'|'picks', every: C days, hire: null|'ord'|'ex', hireDay, buys: bool }
   takes  every fight day the map hands a party and he meets it: a job half the time (one, two or three skulls alike, one job in
          five a camp), a roaming party the other half (0 to 8 blocks from the nearest town)
   picks  he looks first (MEET BEFORE YOU FIGHT, rule 151(e)): he takes the job with the most skulls the map sizes at A FEW (2 or 3),
          and falls back from a roaming party bigger than A FEW (that day has no fight). His words: 'make sure he doesn't run
          into any group too big'
   buys   the TODAY man buys the good kit at the market piece by piece the moment the purse covers a piece (the body first, then the
          helm, the shield, the sword), keeping a week of food */
const PAY = Number(SHELF.pay_per_skull), HALL = J('records/target/BOHEMIA_HALL_PRICE.json').easier, START_ECON = 'full', ECON_MULT = { full: 1.5, thin: 1, bare: 0.75 }[START_ECON];
const BUY_ORDER = ['body', 'head', 'off', 'main'];
function campaign(ctx, door, track, seed, days) {
  const W = WOLVES[track.wolf], DB = ctx.DB, R = rng(seed * 31337 + 1);
  const wolf = newWolf(W, door, seed);
  let have = track.buys ? { main: null, off: null, body: null, head: null } : null;
  let hire = null, purse = WOLF.batteries[START_ECON];
  const log = [];
  for (let day = 1; day <= days; day++) {
    /* hireDay a number: hired that day whatever the purse says (his worth, measured; the purse may go under); 'afford': the first day
       the purse covers his price and a week of food for two */
    if (track.hire && !hire) { const h = recruit(track.hire, seed);
      if (track.hireDay === 'afford' ? purse >= h.price + 14 * BILL.per_man_per_night.value : day === track.hireDay) { purse -= h.price; hire = h; hire.hiredOn = day; log.push({ day: day, hired: h.background, price: h.price }); } }
    const men = 1 + (hire && !hire.dead ? 1 : 0);
    purse -= BILL.per_man_per_night.value * men + (hire && !hire.dead && !hire.laidUntil ? hire.wage : 0);
    if (hire && hire.laidUntil && day >= hire.laidUntil) hire.laidUntil = 0;
    if (have) {   /* the market, when it is in reach (a week of food kept) */
      for (const slot of BUY_ORDER) { const id = KITS.good[slot]; if (have[slot] || !id) continue; const p = priceOf(id);
        if (purse - p >= 7 * BILL.per_man_per_night.value * men) { purse -= p; have[slot] = id; log.push({ day: day, bought: id, price: p }); } else break; }
    }
    if ((day - 1) % track.every !== 0) continue;
    const fit = hire && !hire.dead && !hire.laidUntil;
    const levels = [wolf.level].concat(hire && !hire.dead ? [hire.level] : []);   /* the roster the map counts (the laid-up still count, the dead do not) */
    let enc, count;
    if (track.policy === 'takes') {
      if (R() < 0.5) { const sk = 1 + Math.floor(R() * 3), camp = R() < 0.2; enc = { kind: 'job', skulls: sk, camp: camp }; count = mapCount('job', levels, day, enc); }
      else { const bl = Math.floor(R() * 9); enc = { kind: 'roaming', blocks: bl }; count = mapCount('roaming', levels, day, enc); }
    } else {
      if (R() < 0.5) {
        let best = null; for (let sk = 3; sk >= 1 && !best; sk--) { const e = { kind: 'job', skulls: sk, camp: false }, c = mapCount('job', levels, day, e); if (c <= 3) { best = e; count = c; } }
        enc = best;
      } else { const bl = Math.floor(R() * 9), e = { kind: 'roaming', blocks: bl }, c = mapCount('roaming', levels, day, e); if (c <= 3) { enc = e; count = c; } else { log.push({ day: day, fellBack: c }); enc = null; } }
    }
    if (!enc) continue;
    const company = [wolfEntry(W, wolf, DB)];
    if (have) { company[0].gear = { main: have.main || 'dagger', off: have.off || (have.main ? null : 'wooden_shield'), body: have.body || 'padded_surcoat', head: have.head || 'open_leather_cap', bag: [] };
      if (have.main) company[0].perks = perksFor(SWORD_PERKS, wolf.level, DB); }
    if (fit) company.push({ name: hire.name, background: hire.background, level: hire.level, stats: Object.assign({}, hire.stats), gear: Object.assign({}, hire.gear) });
    const party = { faction: 'brigands', count: count, days: day, difficulty: 0 };
    const f = fight(ctx, company, party, seed * 1000 + day, WOLF.field_cap);
    grant(wolf, f.men[0].xp);
    if (fit) { const hm = f.men[1]; if (hm) { if (hm.dead) hire.dead = true; else { grant(hire, hm.xp); if (hm.down) hire.laidUntil = day + 30; } } }
    let pay = 0; if (f.won && enc.kind === 'job') pay = Math.round(PAY * enc.skulls * ECON_MULT);
    purse += pay;
    log.push({ day: day, kind: enc.kind, skulls: enc.skulls || null, blocks: enc.blocks != null ? enc.blocks : null, camp: !!enc.camp, count: count, won: f.won, down: f.wolfDown,
      minHp: Math.round(f.minHp * 100) / 100, level: wolf.level, purse: purse, hireUp: fit, hireDead: !!(hire && hire.dead), spent: f.wolfTurns ? Math.round(100 * f.wolfSpent / f.wolfTurns) : 0 });
  }
  return { seed: seed, log: log, end: { level: wolf.level, xp: wolf.xp, purse: purse, stats: wolf.stats, hire: hire ? { level: hire.level, dead: !!hire.dead, price: hire.price, wage: hire.wage, day: hire.hiredOn } : null, have: have } };
}

/* ---------- THE LADDER ---------- */
const L_DAYS = [1, 10, 20, 40, 60, 100], L_COUNTS = [1, 2, 3, 4, 5, 6, 8];
function ladderCell(ctx, door, c, n) {
  const W = WOLVES[c.wolf], T = { n: 0, won: 0, down: 0, minHp: 0, close: 0, rounds: 0, spent: 0, turns: 0, swings: 0, swungAt: 0, struck: 0 };
  for (let k = 0; k < n; k++) {
    const st = newWolf(W, door, 500 + k);
    const f = fight(ctx, [wolfEntry(W, st, ctx.DB)], { faction: 'brigands', count: c.count, days: c.day, difficulty: 0 }, 7000 + k, WOLF.field_cap);
    T.n++; if (f.won) T.won++; if (f.wolfDown) T.down++; T.minHp += f.minHp; if (f.won && f.minHp < 0.25) T.close++; T.rounds += f.rounds;
    T.spent += f.wolfSpent; T.turns += f.wolfTurns; T.swings += f.swings; T.swungAt += f.swungAt; T.struck += f.struck;
  }
  const p = x => Math.round(100 * x / T.n), r1 = x => Math.round(10 * x / T.n) / 10;
  return { fights: T.n, won_in_100: p(T.won), down_in_100: p(T.down), avg_lowest_health_pct: p(T.minHp), won_under_a_quarter_health_in_100: p(T.close),
    rounds: r1(T.rounds), turns_out_of_breath_pct: Math.round(100 * T.spent / Math.max(1, T.turns)), his_swings: r1(T.swings), swung_at: r1(T.swungAt), struck: r1(T.struck) };
}

/* ---------- THE TRACKS (the campaign rows) ---------- */
const TRACKS = [
  { id: 'today_takes', wolf: 'w_today', policy: 'takes', every: 2 },
  { id: 'today_picks', wolf: 'w_today', policy: 'picks', every: 2 },
  { id: 'good_takes', wolf: 'w_good', policy: 'takes', every: 2 },
  { id: 'good_picks', wolf: 'w_good', policy: 'picks', every: 2 },
  { id: 'bb_takes', wolf: 'w_bb', policy: 'takes', every: 2 },
  { id: 'bb_picks', wolf: 'w_bb', policy: 'picks', every: 2 },
  { id: 'today_buys', wolf: 'w_today', policy: 'picks', every: 2, buys: true },
  { id: 'today_picks_ord1', wolf: 'w_today', policy: 'picks', every: 2, hire: 'ord', hireDay: 1 },
  { id: 'today_picks_ex1', wolf: 'w_today', policy: 'picks', every: 2, hire: 'ex', hireDay: 1 },
  { id: 'good_picks_ord1', wolf: 'w_good', policy: 'picks', every: 2, hire: 'ord', hireDay: 1 },
  { id: 'good_picks_ex1', wolf: 'w_good', policy: 'picks', every: 2, hire: 'ex', hireDay: 1 },
  { id: 'good_takes_ord1', wolf: 'w_good', policy: 'takes', every: 2, hire: 'ord', hireDay: 1 },
  { id: 'good_takes_ex1', wolf: 'w_good', policy: 'takes', every: 2, hire: 'ex', hireDay: 1 },
  { id: 'good_picks_ex_afford', wolf: 'w_good', policy: 'picks', every: 2, hire: 'ex', hireDay: 'afford' },
  { id: 'good_picks_ord25', wolf: 'w_good', policy: 'picks', every: 2, hire: 'ord', hireDay: 25 },
  { id: 'good_picks_every1', wolf: 'w_good', policy: 'picks', every: 1 },
  { id: 'good_picks_every4', wolf: 'w_good', policy: 'picks', every: 4 },
  { id: 'today_picks_every4', wolf: 'w_today', policy: 'picks', every: 4 }
];
const DAYS = 100;

/* the stamp: the fight and its files (the whole grid's print) plus this bench's own logic */
function stamp() { return G.fightPrint([{ text: fs.readFileSync(__filename, 'utf8') }]); }
function cache() {
  const fp = stamp(), got = {};
  if (fs.existsSync(CELLS)) fs.readFileSync(CELLS, 'utf8').split('\n').filter(Boolean).forEach(l => { try { const x = JSON.parse(l); if (x.fp === fp) got[x.k] = x.v; } catch (e) { } });
  return { fp: fp, got: got, put: (k, v) => fs.appendFileSync(CELLS, JSON.stringify({ k: k, fp: fp, v: v }) + '\n') };
}

async function worker(job) {
  const ctx = await G.engine(true), door = doorMan(ctx);
  if (job.kind === 'ladder') return ladderCell(ctx, door, job.cell, job.n);
  if (job.kind === 'campaign') { const T = TRACKS.filter(t => t.id === job.track)[0]; return job.seeds.map(s => campaign(ctx, door, T, s, DAYS)); }
  throw new Error('no such job');
}
function pool(jobs, N, onDone) {
  return new Promise(done => {
    let next = 0, running = 0, t0 = Date.now(), fin = 0;
    if (!jobs.length) return done();
    const pump = () => {
      while (running < N && next < jobs.length) {
        const j = jobs[next++]; running++;
        cp.execFile(process.execPath, [__filename, '--job', JSON.stringify(j.job)], { maxBuffer: 1 << 28 }, (err, out) => {
          running--; fin++;
          if (err) { console.error('job failed', JSON.stringify(j.job).slice(0, 200), err.message.slice(0, 400)); process.exit(1); }
          onDone(j, JSON.parse(out));
          if (fin % 10 === 0 || fin === jobs.length) process.stderr.write(fin + '/' + jobs.length + ' ' + Math.round((Date.now() - t0) / 1000) + 's\n');
          if (fin === jobs.length) done(); else pump();
        });
      }
    };
    pump();
  });
}

/* ---------- SUMMARIES ---------- */
function sumCampaign(runs, upTo) {
  const out = { seeds: runs.length, by_window: {} };
  const windows = [[1, 10], [11, 20], [21, 30], [31, 40], [41, 50], [51, 60], [61, 70], [71, 80], [81, 90], [91, 100]];
  windows.forEach(([a, b]) => {
    let f = 0, w = 0, d = 0, close = 0, cnt = 0, lvl = 0, nl = 0, fell = 0, roam = 0, roamW = 0, job = 0, jobW = 0, purse = 0, np = 0, spent = 0;
    runs.forEach(r => {
      r.log.forEach(e => { if (e.day < a || e.day > b) return;
        if (e.fellBack) { fell++; return; } if (e.count == null) return;
        f++; if (e.won) w++; if (e.down) d++; if (e.won && e.minHp < 0.25) close++; cnt += e.count; spent += e.spent;
        if (e.kind === 'roaming') { roam++; if (e.won) roamW++; } else { job++; if (e.won) jobW++; } });
      const last = r.log.filter(e => e.day <= b && e.level).pop(); if (last) { lvl += last.level; nl++; purse += last.purse; np++; }
    });
    const p = (x, y) => y ? Math.round(100 * x / y) : null;
    out.by_window[a + '-' + b] = { fights: f, won_in_100: p(w, f), he_fell_in_100: p(d, f), won_under_a_quarter_health_in_100: p(close, f), avg_enemies: f ? Math.round(10 * cnt / f) / 10 : null,
      jobs_won_in_100: p(jobW, job), roaming_won_in_100: p(roamW, roam), fell_back_from: fell, level_at_end: nl ? Math.round(10 * lvl / nl) / 10 : null,
      purse_at_end: np ? Math.round(purse / np) : null, turns_out_of_breath_pct: f ? Math.round(spent / f) : null };
  });
  const first50 = runs.map(r => r.log.filter(e => e.day <= 50 && e.count != null));
  const lost = first50.map(L => L.filter(e => !e.won).length);
  out.first_fifty = {
    fights: Math.round(10 * first50.reduce((t, L) => t + L.length, 0) / runs.length) / 10,
    won_in_100: Math.round(100 * first50.reduce((t, L) => t + L.filter(e => e.won).length, 0) / Math.max(1, first50.reduce((t, L) => t + L.length, 0))),
    seeds_that_never_lost_in_100: Math.round(100 * lost.filter(x => x === 0).length / runs.length),
    losses_per_run: Math.round(10 * lost.reduce((a, b) => a + b, 0) / runs.length) / 10,
    closest_call_median_health_pct: median(first50.map(L => Math.min.apply(null, L.filter(e => e.won).map(e => e.minHp).concat([1])))) * 100 | 0,
    level_day_50: median(runs.map(r => { const l = r.log.filter(e => e.day <= 50 && e.level).pop(); return l ? l.level : 4; })),
    purse_day_50: median(runs.map(r => { const l = r.log.filter(e => e.day <= 50 && e.purse != null).pop(); return l ? l.purse : null; }).filter(x => x != null))
  };
  const bought = runs.map(r => r.log.filter(e => e.bought)); if (bought.some(b => b.length)) {
    out.bought = {}; BUY_ORDER.forEach(s => { const id = KITS.good[s]; const ds = bought.map(b => (b.filter(e => e.bought === id)[0] || {}).day).filter(Boolean);
      out.bought[id] = { price: priceOf(id), seeds_that_bought_it_in_100: Math.round(100 * ds.length / runs.length), median_day: ds.length ? median(ds) : null }; });
  }
  const hires = runs.map(r => r.end.hire).filter(Boolean); if (hires.length) out.hire = { hired_in_100: Math.round(100 * hires.length / runs.length), dead_by_100_in_100: Math.round(100 * hires.filter(h => h.dead).length / Math.max(1, hires.length)),
    price: median(hires.map(h => h.price)), wage: median(hires.map(h => h.wage)), level_day_100: median(hires.filter(h => !h.dead).map(h => h.level)),
    median_day_hired: median(runs.map(r => (r.log.filter(e => e.hired)[0] || {}).day).filter(Boolean)) };
  /* the day the map's party first beats him more often than not: the first ten-day window where he wins under half (takes) */
  return out;
}
function median(a) { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; }

async function main() {
  const argv = process.argv, arg = (k, d) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : d; };
  if (argv[2] === '--job') { process.stdout.write(JSON.stringify(await worker(JSON.parse(argv[3])))); return; }
  const JOBS = Number(arg('--jobs', 4));
  if (argv.includes('--who')) {
    const ctx = await G.engine(true), door = doorMan(ctx), scr = await screenMan();
    console.log(JSON.stringify({ door: door, screen: scr, wolf_origin: WOLF, good_kit_price: Object.values(KITS.good).filter(x => typeof x === 'string').map(id => [id, priceOf(id)]) }, null, 1));
    return;
  }
  const C = cache();
  if (argv.includes('--ladder')) {
    const n = Number(arg('--n', 60)), jobs = [];
    Object.keys(WOLVES).forEach(w => L_DAYS.forEach(d => L_COUNTS.forEach(c => { const k = 'ladder|' + w + '|' + d + '|' + c + '|' + n; if (!C.got[k]) jobs.push({ k: k, job: { kind: 'ladder', n: n, cell: { wolf: w, day: d, count: c } } }); })));
    process.stderr.write('ladder: ' + jobs.length + ' cells to play\n');
    await pool(jobs, JOBS, (j, v) => { C.put(j.k, v); C.got[j.k] = v; });
  }
  if (argv.includes('--campaign')) {
    const S = Number(arg('--seeds', 100)), chunk = Number(arg('--chunk', 10)), only = arg('--track', null), jobs = [];
    TRACKS.filter(t => !only || t.id === only).forEach(t => { const seeds = t.every === 1 ? Math.ceil(S / 2) : S;
      for (let s0 = 1; s0 <= seeds; s0 += chunk) { const ss = []; for (let s = s0; s < s0 + chunk && s <= seeds; s++) ss.push(s);
        const k = 'campaign|' + t.id + '|' + ss[0] + '-' + ss[ss.length - 1]; if (!C.got[k]) jobs.push({ k: k, job: { kind: 'campaign', track: t.id, seeds: ss } }); } });
    process.stderr.write('campaign: ' + jobs.length + ' chunks to play\n');
    await pool(jobs, JOBS, (j, v) => { C.put(j.k, v); C.got[j.k] = v; });
  }
  if (argv.includes('--write') || argv.includes('--print')) {
    const ctx = await G.engine(true), door = doorMan(ctx), scr = await screenMan();
    const ladder = {}, camp = {};
    Object.keys(C.got).forEach(k => { const p = k.split('|');
      if (p[0] === 'ladder') ladder[p[1] + '|' + p[2] + '|' + p[3]] = Object.assign({ wolf: p[1], day: +p[2], count: +p[3] }, C.got[k]);
      if (p[0] === 'campaign') (camp[p[1]] = camp[p[1]] || []).push.apply(camp[p[1]], C.got[k]); });
    const tracks = {};
    TRACKS.forEach(t => { if (camp[t.id]) tracks[t.id] = Object.assign({ track: t }, sumCampaign(camp[t.id].sort((a, b) => a.seed - b.seed))); });
    /* the map's party by day for one man (the counts the map hands him), at the levels the GOOD campaign reached */
    const lvlAt = d => { const runs = camp.good_takes || []; return median(runs.map(r => { const l = r.log.filter(e => e.day <= d && e.level).pop(); return l ? l.level : 4; })) || 4; };
    const mapByDay = [1, 10, 20, 30, 40, 50, 60, 80, 100].map(d => { const lv = lvlAt(d);
      return { day: d, his_level: lv, job_1_skull: mapCount('job', [lv], d, { skulls: 1 }), job_2_skulls: mapCount('job', [lv], d, { skulls: 2 }), job_3_skulls: mapCount('job', [lv], d, { skulls: 3 }),
        camp_3_skulls: mapCount('job', [lv], d, { skulls: 3, camp: true }), roaming_at_town: mapCount('roaming', [lv], d, { blocks: 0 }), roaming_4_blocks: mapCount('roaming', [lv], d, { blocks: 4 }),
        roaming_8_blocks: mapCount('roaming', [lv], d, { blocks: 8 }), with_a_second_man_level_1_job_2_skulls: mapCount('job', [lv, 1], d, { skulls: 2 }) }; });
    const out = { _readme: 'TUNING [the first fifty days and the lone wolf] 10/25 (rule 183; research only, rule 38g). draft:true. NOTHING IN THE GAME READS THIS FILE. '
        + 'Every fight is the live fight (slices/BOHEMIA_FIGHT.html and exactly the files its loadAll() reads, played headless, AUTO both sides, seeded) through tools/bohemia_tuning_lone_wolf.js. '
        + 'who: the man the fight builds from origins.json (door) and the crew screen\'s card (screen). ladder: one man alone, key wolf|day|count. campaign: the days played, per track, by ten-day window. map_by_day: the counts party_math hands one man.',
      draft: true, schema: 1, stamp: C.fp, who: { door: door, screen: scr, origin: WOLF }, kits: KITS, wolves: WOLVES, sword_perks: SWORD_PERKS, plans: PLAN,
      good_kit_prices: Object.values(KITS.good).filter(x => typeof x === 'string').map(id => ({ id: id, batteries: priceOf(id) })),
      map_by_day: mapByDay, ladder: ladder, campaign: tracks };
    if (argv.includes('--write')) { fs.writeFileSync(BANK, JSON.stringify(out, null, 1) + '\n'); console.log('wrote ' + path.relative(ROOT, BANK)); }
    else console.log(JSON.stringify({ map_by_day: mapByDay, tracks: Object.fromEntries(Object.entries(tracks).map(([k, v]) => [k, v.first_fifty])) }, null, 1));
  }
}
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
module.exports = { campaign, fight, doorMan, screenMan, ladderCell, mapCount, recruit, WOLVES, KITS, TRACKS, priceOf };
