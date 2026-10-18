#!/usr/bin/env node
// TUNING [the settlement's numbers] 10/18 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g, rule 88: a page, no sheet).
// From [the one table seeded] s4: the fight reads its felt numbers through one door; the screens around it (the
// settlement screen, the roster, the hire roll, the camp staff) TYPE theirs. This reads every felt number off those
// screens the same way the seed read the fight: each row names the file, a pattern that must match the live code
// exactly once, the value the pattern must capture, the unit, what the player feels, the source (or 'no source but
// the code'), whether the table ALREADY holds the number unread, and an owner.
//
// A row whose pattern no longer matches, or captures a different value, is printed as DRIFTED: the screen changed
// and the table row is stale. Nothing is self-attested; the value printed is the value in the file.
//
//   node tools/bohemia_tuning_screens_seed.js            prints the counts and any drift
//   node tools/bohemia_tuning_screens_seed.js --write    writes banks/BOHEMIA_TUNING_THE_SCREENS_SEED_10_18_26.json
//                                                         (draft:true, NOTHING IN THE GAME READS IT)
// tools/bohemia_tuning_one_table_seed.js requires this file and folds the rows into the one table's section C.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const F = {
  settle: 'slices/BOHEMIA_SETTLEMENT_SCREEN.html',
  roster: 'slices/BOHEMIA_ROSTER_SCREEN.html',
  hire: 'engine/bohemia_goodbros.js',
  crew: 'engine/bohemia_roster.js',
  staff: 'engine/bohemia_followers.js',
};
const SRC = {};
for (const [k, f] of Object.entries(F)) SRC[k] = fs.existsSync(path.join(ROOT, f)) ? fs.readFileSync(path.join(ROOT, f), 'utf8') : '';
const J = f => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch (e) { return null; } };
const RULES = J('records/target/bb/rules.json') || {};
const PT = J('records/target/bb/price_table.json') || {};
const BG = J('records/target/bb/backgrounds.json') || {};

/* where the table already holds the number (the row exists, the screen does not read it) */
const inTable = (p) => { let n = RULES; for (const k of p.split('.')) n = n ? n[k] : undefined; return n && 'value' in n ? n : null; };

// screen: which screen; re: a regex source that must match once (a capture group, when present, must equal String(value))
const ROWS = [
  /* ---------------- THE STALL (the market) ---------------- */
  { id: 'market.sell_cut', screen: 'settle', re: 'var SELL_CUT = (1/7);', value: '1/7', unit: 'fraction of the price', feel: 'what the stall pays you back for a thing you bought: about a seventh',
    bb: 'price_table.json sellCutByRelationAndSize: camp 0.1091, town 0.1364, city 0.1769 at relation 50, rising to +0.02 at relation 100 (GROK_119, the wiki\'s Market prices page, expert difficulty); engine/bohemia_pricetable.js sellFraction(tier, relation) computes it and the screen does not load that file',
    table: 'price_table.json sellCutByRelationAndSize', owner: 'economy / run two (his YES 10/10 on one seventh stands)', ruling: 'his YES on tuning-the-price-ratios-audit-10-10' },
  { id: 'market.crowns_per_battery', screen: 'settle', re: 'function priceOf\\(v\\)\\{ return Math\\.max\\(1, Math\\.round\\(\\(v\\|\\|0\\)/(10)\\)\\); \\}', value: '10', unit: 'crowns', feel: 'a thing worth ten of the wiki\'s crowns costs one battery at the stall',
    bb: 'price_table.json conversion.crownsPerBattery = 10 (GROK_31, his 10/1); engine/bohemia_pricetable.js CROWNS_PER_BATTERY', table: 'price_table.json conversion', owner: 'economy' },
  { id: 'market.price_floor', screen: 'settle', re: 'function priceOf\\(v\\)\\{ return Math\\.max\\((1),', value: '1', unit: 'batteries', feel: 'nothing at the stall costs less than one battery',
    bb: 'price_table.json conversion.floorBatteries = 1 (GROK_33, his 10/1)', table: 'price_table.json conversion', owner: 'economy' },
  { id: 'market.markup', screen: 'settle', re: 'it\\.price = Math\\.max\\(1, Math\\.round\\(it\\.price \\* (tm\\.price)\\)\\)', value: 'tm.price', unit: 'multiplier', feel: 'the stall sells at the thing\'s worth times the place\'s trait (no town markup, no relation)',
    bb: 'price_table.json buyToSellRatioAtNeutral 6.67 (veteran) and buySideDropAtTopOfBar 0.15: Battle Brothers sells at about 1.3 times worth at neutral relation and up to 15 percent less at the top of the bar; engine buyFraction(relation) is unread', table: 'price_table.json buySideDropAtTopOfBar', owner: 'economy / run two' },
  { id: 'market.quality_band', screen: 'settle', re: "band = (tier==='camp' \\? \\[0,\\.4\\] : tier==='town' \\? \\[\\.15,\\.75\\] : \\[\\.3,1\\])", value: "tier==='camp' ? [0,.4] : tier==='town' ? [.15,.75] : [.3,1]", unit: 'share of the worth-sorted list', feel: 'a camp sells the cheapest 40 percent of gear, a town the middle, a fortress the top 70 percent',
    bb: null, owner: 'economy / run two' },
  { id: 'market.stock_counts', screen: 'settle', re: "S\\.stock = \\{arms: W\\(sm\\(4\\),'arms'\\)\\.concat\\(A\\(sm\\(3\\),'arms'\\)\\), smith: W\\(sm\\(7\\),'smith'\\), armourer: A\\(sm\\(6\\),'armourer'\\)\\.concat\\(pick\\(BB\\.armor\\.shields, 2,", value: 'arms 4+3, smith 7, armourer 6+2', unit: 'items on the shelf', feel: 'how many things each seller has before a trait moves it',
    bb: null, owner: 'economy / run two' },
  { id: 'bag.slots', screen: 'settle', re: 'var BAG_SLOTS = (36), BAGKEY', value: '36', unit: 'slots', feel: 'how many things your bag holds (the same 36 on the roster screen, typed twice)',
    bb: 'the code\'s own comment: Battle Brothers\' stash is 36 slots to start; no data row holds it', owner: 'run two' },
  /* ---------------- THE PLACE'S TRAITS ---------------- */
  { id: 'place.second_trait_chance', screen: 'settle', re: 'n = 1 \\+ \\(R1\\(\\) < (\\.3) \\? 1 : 0\\)', value: '.3', unit: 'chance', feel: 'a place with one trait has a second one this often',
    bb: 'settlement_traits.json roll.max = 2 holds the cap but not this chance; the first chance (0.7) IS read from the file', owner: 'run two (the roll) / tuning holds the row' },
  /* ---------------- THE BOARD (contracts) ---------------- */
  { id: 'contract.offers_by_size', screen: 'settle', re: 'var TIER_OFFERS = (\\{camp:1, town:2, fortress:3\\});', value: '{camp:1, town:2, fortress:3}', unit: 'contracts on the board', feel: 'a camp offers one job, a town two, a fortress three',
    bb: null, owner: 'run two / world' },
  { id: 'contract.pay_one_skull', screen: 'settle', re: "skulls:1,\\s*title:'[^']*', pay:(\\d+)", value: '30', unit: 'batteries', feel: 'what a one-skull job pays (two skulls 60, three 90; the four rows are typed in the OFFERS list)',
    bb: 'price_table.json contractPay: the one sourced line is 610 crowns after + 10 a head x 15 heads = 760 crowns = 76 batteries (GROK_10, the wiki\'s Contracts page); skull scaling unsourced; engine contractPayBatteries(headcount) is unread', table: 'price_table.json contractPay', owner: 'tuning (the curve, the screen says so) / run two' },
  { id: 'contract.pay_three_skulls', screen: 'settle', re: "skulls:3,\\s*title:'[^']*', pay:(\\d+)", value: '90', unit: 'batteries', feel: 'what a three-skull job pays',
    bb: 'as above: one sourced anchor, 76 batteries, nothing per skull', table: 'price_table.json contractPay', owner: 'tuning / run two' },
  { id: 'contract.slots', screen: 'settle', re: 'var SLOTS = (2);', value: '2', unit: 'contracts held', feel: 'how many jobs you can carry at once',
    bb: 'the wiki\'s Contracts page (bb_all/0441_Contracts.txt): "You may only have one active contract at a time." Ours holds two', owner: 'run two / world' },
  /* ---------------- THE CLINIC (a second copy of the roster's formula) ---------------- */
  { id: 'clinic.base_price_settlement', screen: 'settle', re: 'var crowns = (20) \\* 1 \\* traitMult\\(\\)\\.price \\* w\\.days \\* \\(1 \\+ \\(w\\.level - 1\\) \\* 0\\.2\\);', value: '20', unit: 'crowns per day', feel: 'the clinic\'s price per laid-up day, typed again here (the roster types the same 20 and 0.2 in its own clinicPrice)',
    bb: 'injuries.json rules.temporary_healing base price 20 and 0.2 a level (bb_all/1936_Temporary Injuries.txt); the data holds it and neither screen reads it', table: 'injuries.json rules.temporary_healing', owner: 'economy / run two' },
  { id: 'clinic.halving_settlement', screen: 'settle', re: 'cut = Math\\.ceil\\(w\\.days/(2)\\)', value: '2', unit: 'divisor', feel: 'treatment halves the days left, rounded up',
    bb: 'injuries.json treatment_heal_time_multiplier 0.5, unread', table: 'injuries.json rules.temporary_healing', owner: 'economy / run two' },
  { id: 'clinic.medic_day', screen: 'settle', re: '\\(\\(S\\.hired && S\\.hired\\.medic\\) \\? (1) : 0\\)', value: '1', unit: 'game days', feel: 'a medic on the payroll takes one more day off a treated man',
    bb: null, owner: 'economy / run two' },
  { id: 'clinic.default_days', screen: 'settle', re: 'w\\.days = r && r\\.heal_days \\? r\\.heal_days\\[1\\] : (30);', value: '30', unit: 'game days', feel: 'a wounded man with no injury row is out this long',
    bb: 'the long injury ruling is 30 to 40 days (rule 56, ours.struck_down_laid_up_days); 30 is its floor, typed', table: 'ours.struck_down_laid_up_days', owner: 'run two' },
  /* ---------------- THE BAR ---------------- */
  { id: 'bar.rounds_a_night', screen: 'settle', re: 'roundsLeft = (4) - \\(S\\.rounds\\|\\|0\\)', value: '4', unit: 'rounds', feel: 'how many rounds you can buy in one night at one place',
    bb: null, owner: 'run two' },
  { id: 'bar.round_price', screen: 'settle', re: 'function roundPrice\\(\\)\\{ return Math\\.max\\(1, S\\.crewSize \\|\\| (3)\\); \\}', value: '3', unit: 'batteries (one a man; 3 if the crew size is unknown)', feel: 'a round costs one battery for every man in the company',
    bb: 'the code\'s comment: Battle Brothers\' tavern round is priced by company size (GROK_20/21)', owner: 'run two' },
  { id: 'bar.round_morale', screen: 'settle', re: "post\\('round', \\{morale:(1), relation:0\\.1", value: '1', unit: 'mood steps', feel: 'a round lifts every man one mood step',
    bb: 'GROK_20/21 per the code comment', owner: 'run two' },
  { id: 'bar.round_relation', screen: 'settle', re: "post\\('round', \\{morale:1, relation:(0\\.1)", value: '0.1', unit: 'relation points', feel: 'a round buys the place a tenth of a point of goodwill',
    bb: 'GROK_118 per the code comment', owner: 'run two / factions' },
  { id: 'bar.rumour_on_talk', screen: 'settle', re: 'r = R\\(\\) < (\\.35) \\? nextRumour\\(\\) : null', value: '.35', unit: 'chance', feel: 'a person you talk to tells you a rumour this often',
    bb: null, owner: 'run two / words' },
  /* ---------------- THE HALL (the posts and the camp staff) ---------------- */
  { id: 'hall.posts_by_size', screen: 'settle', re: 'var POST_COUNT = (\\{camp:2, town:4, fortress:6\\});', value: '{camp:2, town:4, fortress:6}', unit: 'men at the posts', feel: 'how many men want work: a camp two, a town four, a fortress six',
    bb: 'the code\'s comment: Battle Brothers\' shape by size; the abductedChildren and siege situations halve recruits (price_table.json situationMultipliers), ours sets them to none', owner: 'people / run two' },
  { id: 'hall.market_day_extra', screen: 'settle', re: "t\\.id === 'market_day'; \\}\\) \\? (2) : 0\\);", value: '2', unit: 'men', feel: 'market day brings two more men to the posts',
    bb: 'settlement_traits.json market_day recruits:+1, which this line does not read (the file says one, the screen adds two)', owner: 'run two' },
  { id: 'hall.posts_refresh', screen: 'settle', re: "var key = S\\.place\\.name \\+ ':' \\+ Math\\.floor\\(\\(S\\.day\\|\\|0\\)/(7)\\);", value: '7', unit: 'game days', feel: 'the men at the posts change once a week',
    bb: null, owner: 'people / run two' },
  { id: 'hall.camp_staff_price', screen: 'settle', re: "act\\('Take the '\\+id\\+' on', '(1 battery a night)'", value: '1 battery a night', unit: 'label', feel: 'THE PRICE THE BUTTON SHOWS for camp staff; the click debits nothing and nothing charges a night',
    bb: 'engine/bohemia_followers.js prices the same staff 200 to 350 batteries once (tuned:false), and the city\'s old companion road charges that once through hirePrice(); the settlement screen never calls hirePrice()', owner: 'economy / run two' },
  /* ---------------- ONE BATTERY (the ruling) ---------------- */
  { id: 'stall.goods_price', screen: 'settle', re: "var ab = act\\(g\\.label, '(1 battery)'", value: '1 battery', unit: 'batteries', feel: 'food, rounds, tape: every good at the stall costs one',
    bb: 'price_table.json foodStackBatteries 5 to 11 a stack; EVERYTHING COSTS ONE (Paolo 8/15) is the ruling over it', owner: 'paolo (the ruling)', ruling: 'EVERYTHING COSTS ONE, Paolo 8/15' },
  { id: 'barber.price', screen: 'settle', re: "act\\('Sit in the chair', '(1 battery)'", value: '1 battery', unit: 'batteries', feel: 'a haircut costs one', bb: null, owner: 'paolo (the ruling)', ruling: 'EVERYTHING COSTS ONE, Paolo 8/15' },
  { id: 'yard.swap_price', screen: 'settle', re: "act\\('Swap a veteran\\\\'s mastery', '(1 battery)'", value: '1 battery', unit: 'batteries', feel: 'swapping a veteran\'s mastery costs one (the keeper says three days; nothing counts them)', bb: null, owner: 'paolo (the ruling) / combat', ruling: 'EVERYTHING COSTS ONE, Paolo 8/15' },
  { id: 'build.price', screen: 'settle', re: "B\\.build = \\{name:'BUILD', short:'(1 battery, 1 day)'\\};", value: '1 battery, 1 day', unit: 'batteries and days', feel: 'a building costs one battery and one day', bb: null, owner: 'paolo (the ruling) / life+city', ruling: 'EVERYTHING COSTS ONE, Paolo 8/15' },
  { id: 'build.lots', screen: 'settle', re: 'var BUILD_LOTS = (4);', value: '4', unit: 'lots', feel: 'how many buildings fit on your own ground', bb: null, owner: 'life+city / run two' },
  { id: 'lot.search_hours', screen: 'settle', re: "act\\('Search the lot', '(4) hours'", value: '4', unit: 'hours', feel: 'one search of the junk lot costs four hours (the odds are the share left, read from the block, no number typed)',
    bb: null, owner: 'world (engine/bohemia_scavenge.js owns the odds)' },
  { id: 'sound.night_trim', screen: 'settle', re: 'var NIGHT_TRIM = (0\\.5);', value: '0.5', unit: 'gain', feel: 'the place is half as loud at night', bb: 'his sixth votes\' ambience trim, per the code comment', owner: 'sounds' },
  /* ---------------- THE HIRE ROLL (engine/bohemia_goodbros.js) ---------------- */
  { id: 'hire.star_odds', screen: 'hire', re: 'if \\(u < (0\\.60)\\) return 1;', value: '0.60', unit: 'chance', feel: 'a starred stat has one star 60 in 100, two 30, three 10',
    bb: 'rules.json experience.talent_star_odds {1:0.6, 2:0.3, 3:0.1} (bb_all/1926_Talents.txt), in the table, unread: typed here and typed again in engine/bohemia_roster.js', table: 'experience.talent_star_odds', owner: 'people' },
  { id: 'hire.starred_stats', screen: 'hire', re: "var starredStat = (starredStatFor)\\(key \\+ '\\|star-which'\\);", value: 'starredStatFor', unit: 'stats', feel: 'HOW MANY STATS A HIRED MAN HAS STARS ON: ONE',
    bb: 'the wiki\'s Talents page: "he will randomly have a series of stars next to THREE of his Attributes"; the starting crew (engine/bohemia_roster.js) rolls one to three', owner: 'people' },
  { id: 'hire.star_raises_start', screen: 'hire', re: 'lo \\+= \\(starCount >= 2\\) \\? (2) : 1;', value: '2', unit: 'stat points', feel: 'a star raises the man\'s STARTING roll in that stat (+1, +2, and +1 on the top with three)',
    bb: 'the wiki\'s Talents page: a star raises the points gained ON LEVEL-UP ("1 star increases the minimum by 1, 2 stars by 2 and 3 stars also increase the maximum by one"), never the starting roll; the roster\'s levelUp() reads stat_gains_by_stars correctly', table: 'experience.stat_gains_by_stars', owner: 'people' },
  { id: 'hire.price_militia_top', screen: 'hire', re: "id: 'militia', name: 'Militia', wage: 10, hireMin: 254, hireMax: (2248)", value: '2248', unit: 'crowns (225 batteries)', feel: 'the dearest a level-one militiaman can cost at the posts',
    bb: 'backgrounds.json: the six ranges are the Game Guide\'s OBSERVED prices, which "include equipment and level, not the base"; the wiki\'s own formula is base 30 to 150 + 1.25 x gear + 500 x (level - 1)^1.5, all in the table; engine/bohemia_pricetable.js hireCostRange() computes it and nothing calls it', table: 'backgrounds.json hiring_and_wage_rules', owner: 'people / economy' },
  { id: 'hire.price_farmhand_top', screen: 'hire', re: "id: 'farmhand', name: 'Farmhand', wage: 10, hireMin: 115, hireMax: (409)", value: '409', unit: 'crowns (41 batteries)', feel: 'the dearest a level-one farmhand can cost',
    bb: 'as above', table: 'backgrounds.json hiring_and_wage_rules', owner: 'people / economy' },
  { id: 'hire.wage_charged', screen: 'hire', re: 'wageChargedHere: (0),', value: '0', unit: 'batteries a day', feel: 'a hired man costs nothing after the day you hire him',
    bb: 'backgrounds.json daily_wage 3 to 35 crowns a day; bought once is the ruling over it', owner: 'paolo (the ruling)', ruling: 'rule 56, bought once' },
  /* ---------------- THE STARTING CREW (engine/bohemia_roster.js) ---------------- */
  { id: 'crew.starred_stats', screen: 'crew', re: 'n = 1 \\+ Math\\.floor\\(R\\(\\) \\* (3)\\);', value: '3', unit: 'stats', feel: 'a starting man has stars on one to three stats, each as likely',
    bb: 'the wiki: always three; the hall\'s man: one', owner: 'run two (the roster) / people' },
  { id: 'crew.star_odds', screen: 'crew', re: 'stars\\[k2\\] = q < (\\.6) \\? 1 : q < \\.9 \\? 2 : 3;', value: '.6', unit: 'chance', feel: 'the 60/30/10 star split, typed a second time',
    bb: 'rules.json experience.talent_star_odds, unread', table: 'experience.talent_star_odds', owner: 'run two / people' },
  { id: 'crew.veteran_xp', screen: 'crew', re: 't \\+= (4000) \\+ 1000 \\* \\(l - top\\);', value: '4000', unit: 'experience', feel: 'each level past eleven costs 4000 plus 1000 for every level past eleven',
    bb: 'rules.json experience.veteran_level_xp "4000 + 1000 * (current_lvl - 11)" (bb_all/1165), in the table as a formula string the code cannot read, so it is typed', table: 'experience.veteran_level_xp', owner: 'run two' },
  { id: 'crew.veteran_from', screen: 'crew', re: 'var tb = D\\.xp\\.level_table_total_xp\\.value, top = (11);', value: '11', unit: 'level', feel: 'the level where perk points stop and veteran levels begin',
    bb: 'rules.json experience.veteran_level_rules (the wiki: level 11 is the veteran level)', table: 'experience.veteran_level_rules', owner: 'run two' },
  /* ---------------- THE ROSTER SCREEN ---------------- */
  { id: 'roster.company_cap', screen: 'roster', re: "\\.length \\+ ' / (20)'", value: '20', unit: 'men', feel: 'the company holds twenty',
    bb: 'rules.json board.roster_max 20 (bb_all/0828_Game Mechanics) and ours.roster_size 20 (rule 63b), both in the table, the screen types it', table: 'board.roster_max', owner: 'run two' },
  { id: 'roster.bag_slots', screen: 'roster', re: 'BAG_SLOTS = (36), BAGKEY', value: '36', unit: 'slots', feel: 'the same 36-slot bag, typed a second time', bb: 'see bag.slots', owner: 'run two' },
  { id: 'roster.first_free_column', screen: 'roster', re: 'var f = (2), b = 2;', value: '2', unit: 'formation columns', feel: 'the default formation starts filling the front and back rows from the third column', bb: null, owner: 'run two / combat' },
  /* ---------------- THE CAMP STAFF (engine/bohemia_followers.js) ---------------- */
  { id: 'staff.price_cook', screen: 'staff', re: "id: 'cook', bb: 'cook', price: (200), tuned: false", value: '200', unit: 'batteries, once', feel: 'what the cook costs (scout and lookout 250, blacksmith 300, paymaster and surgeon 350), marked tuned:false',
    bb: 'no retinue price in the data we hold; the wiki\'s Retinue pages name no crown figure', owner: 'economy / tuning' },
  { id: 'staff.scout_travel', screen: 'staff', re: "changes: \\{ kind: 'travel', mult: (0\\.85),", value: '0.85', unit: 'fraction of travel time', feel: 'a scout makes every block on the map cost 15 percent less time',
    bb: 'the code\'s own note: the wiki\'s scout gives +15% travel speed (0.85 of the time is 1/1.176, a little more than +15%)', owner: 'economy / world' },
  { id: 'staff.paymaster_cut', screen: 'staff', re: "changes: \\{ kind: 'hireDiscount', mult: (0\\.85),", value: '0.85', unit: 'fraction of a price', feel: 'a paymaster takes 15 percent off every other staff price',
    bb: 'the wiki\'s paymaster: -15% wages, re-read as the one-time price (the code says so)', owner: 'economy' },
];

function lineOf(src, idx) { return src.slice(0, idx).split('\n').length; }
const out = [], drift = [];
for (const r of ROWS) {
  const src = SRC[r.screen] || '';
  const re = new RegExp(r.re, 'g');
  const hits = [...src.matchAll(re)];
  let got = null, line = null, ok = false;
  if (hits.length === 1) { line = lineOf(src, hits[0].index); got = hits[0].length > 1 ? hits[0][1] : r.value; ok = String(got) === String(r.value); }
  const t = r.table ? (r.table.indexOf('.json') < 0 ? inTable(r.table) : true) : null;
  const row = {
    kind: 'typed', id: r.id, value: ok ? r.value : (got == null ? '(pattern gone)' : got), unit: r.unit, feel: r.feel,
    source: r.bb ? r.bb : 'no source but the code', source_kind: r.ruling ? 'ruling' : r.bb ? (r.table ? 'wiki (in the table, unread)' : 'wiki or comment') : 'NO SOURCE',
    read_at: F[r.screen] + (line ? ':' + line : ' (NOT FOUND)'), reads: 0, owner: r.owner, screen: r.screen, ruling: r.ruling || null,
    in_table_unread: r.table ? r.table : null, in_table_resolves: t === null ? null : !!t,
    status: ok ? 'typed, not read from the table' : 'DRIFTED: ' + (hits.length === 0 ? 'the pattern no longer matches' : hits.length > 1 ? 'the pattern matches ' + hits.length + ' times' : 'the value is now ' + got),
  };
  if (!ok) drift.push(r.id + ' (' + row.status + ')');
  out.push(row);
}
const by = {}; out.forEach(r => by[r.screen] = (by[r.screen] || 0) + 1);
const summary = {
  rows: out.length, by_screen: by, drifted: drift,
  no_source: out.filter(r => r.source_kind === 'NO SOURCE').length,
  rulings: out.filter(r => r.source_kind === 'ruling').length,
  in_table_unread: out.filter(r => r.in_table_unread).length,
  unresolved_table_keys: out.filter(r => r.in_table_resolves === false).map(r => r.id),
};
module.exports = { rows: out, summary, files: F };
if (require.main === module) {
  console.log('THE SCREENS SEED: ' + JSON.stringify(summary));
  if (process.argv.includes('--write')) {
    const bank = {
      _readme: 'TUNING [the settlement\'s numbers] 10/18 (rule 21 one numbers table; rule 38g research only; rule 88 a page, no sheet). draft:true. NOTHING IN THE GAME READS THIS FILE. Every felt number the screens around the fight TYPE (the settlement screen, the roster, the hire roll, the starting crew, the camp staff), each read off the live file by a pattern that must match once, with its source or "no source but the code", whether the table already holds it unread, and an owner. Regenerate: node tools/bohemia_tuning_screens_seed.js --write. The one table folds these rows into section C. Record: records/BOHEMIA_TUNING_THE_SCREENS_AROUND_THE_FIGHT_IN_THE_ONE_TABLE_10_18_26.md',
      draft: true, schema: 1, files: F, summary, rows: out,
    };
    fs.writeFileSync(path.join(ROOT, 'banks/BOHEMIA_TUNING_THE_SCREENS_SEED_10_18_26.json'), JSON.stringify(bank, null, 1) + '\n');
    console.log('wrote banks/BOHEMIA_TUNING_THE_SCREENS_SEED_10_18_26.json');
    /* the VOTE tab's page (rule 88: a page, no sheet), rendered from the same rows so the two cannot disagree */
    const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const NAME = { settle: 'THE SETTLEMENT SCREEN', hire: 'THE HIRE ROLL', crew: 'THE STARTING CREW', roster: 'THE ROSTER', staff: 'THE CAMP STAFF' };
    const h = [];
    h.push('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">');
    h.push('<title>THE NUMBERS AROUND THE FIGHT</title>');
    h.push('<style>:root{--bg:#f4efe4;--ink:#1b1711;--line:#8a7d66;--mark:#7a2e1c}body{margin:0;padding:16px;background:var(--bg);color:var(--ink);font:15px/1.4 Georgia,serif}h1{font-size:20px;margin:0 0 6px}h2{font-size:16px;margin:18px 0 6px}p,li{max-width:72ch}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid var(--line);padding:5px 6px;vertical-align:top;text-align:left}th{background:#e8dfcd}td.n{white-space:nowrap}.f{background:#f1dcd4}.k{font-size:11px;color:#5b5244}.np{color:#6b6052;font-style:italic}</style></head><body>');
    h.push('<h1>THE NUMBERS AROUND THE FIGHT</h1>');
    h.push('<p>TUNING, research only. The fight reads every number from one table. The screens around it (the settlement, the roster, hiring, the camp staff) type theirs into the code: ' + out.length + ' numbers, ' + summary.in_table_unread + ' of them already sitting in the table unread, ' + summary.no_source + ' with no source at all. Each one below was read off the live file. Full page: records/BOHEMIA_TUNING_THE_SCREENS_AROUND_THE_FIGHT_IN_THE_ONE_TABLE_10_18_26.md</p>');
    h.push('<h2>What is wrong, in three lines</h2><ol>');
    h.push('<li><b>A hired man levels worse than in Battle Brothers.</b> There, every recruit has stars on three stats and the stars make his level-ups bigger. Here, a man from the hall has a star on one stat, and the star raises his starting number instead.</li>');
    h.push('<li><b>Camp staff are free.</b> The button says one battery a night. The cook says two hundred batteries, once. The tap charges nothing, and nothing charges at night.</li>');
    h.push('<li><b>The right numbers already exist and nobody uses them.</b> A price file with the wiki\'s own sell-back, hiring and contract maths was written; no screen loads it. So a level-one militiaman can cost 225 batteries, when the wiki\'s formula tops out near 49.</li></ol>');
    h.push('<table><thead><tr><th>Screen</th><th>Number</th><th>What you feel</th><th>Where it comes from</th><th>Owner</th></tr></thead><tbody>');
    const flag = new Set(['hire.starred_stats', 'hire.star_raises_start', 'hall.camp_staff_price', 'hire.price_militia_top', 'contract.slots', 'hall.market_day_extra']);
    for (const r of out) h.push('<tr' + (flag.has(r.id) ? ' class="f"' : '') + '><td class="n">' + esc(NAME[r.screen]) + '</td><td class="n"><b>' + esc(r.value) + '</b><div class="k">' + esc(r.unit) + '</div></td><td>' + esc(r.feel) + '<div class="k">' + esc(r.id) + '</div></td><td' + (r.source_kind === 'NO SOURCE' ? ' class="np"' : '') + '>' + esc(r.source) + '<div class="k">' + esc(r.read_at) + '</div></td><td>' + esc(r.owner) + '</td></tr>');
    h.push('</tbody></table>');
    h.push('<p class="k">Regenerate: node tools/bohemia_tuning_screens_seed.js --write. Every row is a pattern that must match the live file once; a changed screen prints DRIFTED. draft:true; nothing in the game reads this page or its bank.</p>');
    h.push('</body></html>');
    fs.writeFileSync(path.join(ROOT, 'slices/BOHEMIA_TUNING_THE_NUMBERS_AROUND_THE_FIGHT_10_18_26.html'), h.join('\n') + '\n');
    console.log('wrote slices/BOHEMIA_TUNING_THE_NUMBERS_AROUND_THE_FIGHT_10_18_26.html');
  }
}
