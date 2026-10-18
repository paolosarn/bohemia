#!/usr/bin/env node
// TUNING [easier than Battle Brothers, measured] 10/18 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g; rule 117).
// The board's row: 'a page that lists every felt number in the one table beside Battle Brothers' own value, marks each one
// that is as hard or harder, and proposes the easier starting value and the slider range above it.'
// It reads the one table (banks/BOHEMIA_TUNING_THE_ONE_TABLE_SEED_10_17_26.json, 209 rows), the rule 117 levers
// (banks/BOHEMIA_TUNING_RULE_117_EASIER_THAN_BB_10_18_26.json) and the fights played headless
// (banks/BOHEMIA_TUNING_EASIER_MEASURED_10_18_26.json, tools/bohemia_tuning_easier_measured.js), and writes:
//   banks/BOHEMIA_TUNING_EASIER_ROWS_10_18_26.json      every row: ours, Battle Brothers', who feels it, the verdict, the start
//   records/BOHEMIA_TUNING_EASIER_THAN_BATTLE_BROTHERS_MEASURED_10_18_26.md   the page the building lanes cite
//   slices/BOHEMIA_TUNING_EASIER_MEASURED_10_18_26.html  the VOTE page (rule 88: a page, no sheet)
// The verdict is COMPUTED where both numbers are numbers (ours against Battle Brothers' in the direction that is easier for
// the player); a row whose value IS the wiki's quoted number is the same number by construction. A row in no family and
// with no twin prints UNSORTED and is counted, so nothing slips through.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const SEED = J('banks/BOHEMIA_TUNING_THE_ONE_TABLE_SEED_10_17_26.json');
const R117 = J('banks/BOHEMIA_TUNING_RULE_117_EASIER_THAN_BB_10_18_26.json');
const M = J('banks/BOHEMIA_TUNING_EASIER_MEASURED_10_18_26.json');

/* ---------- what a player feels in a fight: the measured fields ---------- */
const FELT = {
  won: { f: 'won_in_100', up: true, w: 'fights won, in 100' },
  land: { f: 'your_swings_land_in_100', up: true, w: 'your swings that land, in 100' },
  theirs: { f: 'their_swings_land_in_100', up: false, w: 'their swings that land on you, in 100' },
  down: { f: 'your_men_struck_down_per_fight', up: false, w: 'your men struck down, a fight' },
  dead: { f: 'your_men_dead_per_100_fights', up: false, w: 'your men dead, in 100 fights' },
  hurt: { f: 'your_men_hurt_per_fight', up: false, w: 'your men hurt, a fight' },
  ran: { f: 'your_men_who_ran_per_fight', up: false, w: 'your men who ran, a fight' },
  rout: { f: 'their_men_who_ran_per_fight', up: true, w: 'their men who ran, a fight' },
  streak: { f: 'three_misses_in_a_row_on_a_good_shot_per_fight', up: false, w: 'three misses in a row on a 50+ shot, a fight' },
  xp: { f: 'fights_to_200_xp', up: false, w: 'fights to a level-up\'s 200 experience' },
  length: { f: 'minutes_on_auto', up: false, w: 'minutes a fight on AUTO' }
};
const SC = M.scenarios.map(s => s.id);
const avg = (set, key) => Math.round(10 * SC.reduce((a, s) => a + M.felt[s][set][FELT[key].f], 0) / SC.length) / 10;
const moved = key => avg('start', key) - avg('bb', key);
const better = (key, d) => FELT[key].up ? d > 0 : d < 0;

/* ---------- the levers (rule 117 bank) by the short ids the fight bench uses ---------- */
const LEVER = {
  hit: 'combat.hit_roll_shift (+5 / 0 / -5)', streak: 'combat.miss_streak_help (+10 a miss on a 50+ shot / none)',
  count: 'the party at their Beginner (0.85 / 1.0 / 1.15)', nerve: 'ours.enemy_nerve (0.9 / 1.0)',
  breath: 'fatigue.recovery_per_turn, YOUR side (18 / 15)', tiers: 'ours.enemy_tiers (day 25 and 75 / 20 and 60 / 20 days early)',
  xp: 'experience.global_modifier (-0.05 / -0.15)', stars: 'hire.star_odds and crew.star_odds (50/35/15 / 60/30/10)',
  gains: 'a level raises three stats (Battle Brothers\' own; the fight has none today)', money: 'start funds High, the hall pays 20 in 100, Beginner\'s carry caps',
  own: 'ours.own_nerve (1.1 / 1.0), PROPOSED this round'
};

/* ---------- families: who feels the row, and in which measured number ---------- */
const FAM = [
  { re: /^(look\.|sound\.|input\.|board\.|deployment\.|money\.crowns_per_battery$|market\.crowns_per_battery$|market\.quality_band$|place\.second_trait_chance$|roster\.first_free_column$|morale\.states$|morale\.distance_tables$|ours\.(people_looks|board_mix|beat_bpm|weapon_rows|perk_builds|formation|formation_depth_lines|start_cols|board_tiles|board_fit|night_lights|night|gun_classes|crew|field_size|cover_tile_blocks_line|gun_min_range)$)/, shape: true },
  { re: /^injuries\.permanent\./, who: 'YOURS ONLY', felt: null, carried: [], start: 'half the bite (a broken knee -20 percent defence, not -40); the slider to the wiki\'s whole bite', why: 'a mark is carried only by his men (theirs die); the death roll is already eased, the bite is not' },
  { re: /^(hit_chance\.|parsed\.hit_roll_die$|head_and_critical\.base_head_chance_pct$|weapons\.head_hit_chance$)/, who: 'BOTH SIDES', felt: 'land', carried: ['hit', 'streak'] },
  { re: /^(damage\.|head_and_critical\.|weapons\.(damage_min|damage_max|armor_damage_pct|armor_ignore_pct|durability)$|armor\.durability$)/, who: 'BOTH SIDES', felt: 'down', carried: ['hit', 'count'] },
  { re: /^(fatigue\.|weapons\.fatigue$|armor\.fatigue$)/, who: 'BOTH SIDES', felt: 'down', carried: ['breath'] },
  { re: /^(morale\.|parsed\.morale|parsed\.brother_xp$|ours\.captain_aura$)/, who: 'BOTH SIDES', felt: 'rout', carried: ['nerve', 'own'] },
  { re: /^(injuries\.|injuries_and_death\.temp)/, who: 'BOTH SIDES', felt: 'hurt', carried: ['hit', 'count'] },
  { re: /^enemies\./, who: 'THEIRS ONLY', felt: 'won', carried: ['count', 'tiers', 'nerve'], why: 'Battle Brothers keeps enemy stats and gear the same on every difficulty and moves the count and the timing; so do we' },
  { re: /^backgrounds\./, who: 'YOURS ONLY', felt: 'won', carried: ['gains', 'stars'] },
  { re: /^experience\./, who: 'YOURS ONLY', felt: 'xp', carried: ['xp'] },
  { re: /^(ap\.|initiative_and_turn_order\.|zone_of_control\.|weapons\.|armor\.|perks\.|ai\.|parsed\.|ours\.cover_defence$)/, who: 'BOTH SIDES', felt: 'won', carried: ['hit', 'count', 'tiers'] }
];

/* ---------- the twins: rows that are not the wiki's own number (rulings, typed escapes, section D) ----------
   bb: Battle Brothers' value; n: [ours, bb] as numbers when they compare; dir: 'lower' or 'higher' is easier for him;
   v: a verdict given by hand only where the two do not compare as numbers (the reason is in note) */
const T = {
  'ours.enemy_tiers': { bb: 'middle from day 20, late from day 60 (the wiki\'s own day gates); Beginner: easier groups later', n: [20, 20], dir: 'higher', who: 'THEIRS ONLY', felt: 'won', carried: ['tiers'], start: 'middle from day 25, late from day 75' },
  'ours.first_band': { bb: 'sized like any job by the company\'s strength: the twelve at their starting levels, one skull = 10 at Veteran, 9 at Beginner (records/target/bb/party_math.json)', n: [9, 10], dir: 'lower', who: 'THEIRS ONLY', felt: 'won', carried: ['count'], start: 'size it by the job math at the door\'s pick (9 at NEW); the fixed nine is already Beginner\'s count' },
  'ours.struck_down_death_per_mark': { bb: '0.67 flat (survival 0.33 whatever he carries)', n: [0.4, 0.67], dir: 'lower', who: 'YOURS ONLY', felt: 'dead', note: 'four marks is 0.40, still under 0.67' },
  'ours.struck_down_death_chance': { bb: '0.67 (survival 0.33)', n: [0.2, 0.67], dir: 'lower', who: 'YOURS ONLY', felt: 'dead' },
  'ours.main_character_dies': { bb: 'yes: any man can die, and in the one-man origins the campaign ends', v: 'EASIER THAN BB', who: 'YOURS ONLY', felt: 'dead', note: 'his ruling (rule 37g)' },
  'ours.struck_down_laid_up_days': { bb: '0 days out: the survivor fights on with his permanent injury', n: [30, 0], dir: 'lower', who: 'YOURS ONLY', felt: 'dead', word: 'rule 36b (Paolo 9/27: a debilitating injury out 30 to 40 days)', start: '30 days (the floor), the clinic halving it', slider: '30 to 40', note: 'the trade is his: 0.20 dead and a month out against Battle Brothers\' 0.67 dead and none out; per fall, men lost for good drop by 70 percent' },
  'ours.struck_down_injury': { bb: 'a permanent injury, for good', v: 'EASIER THAN BB', who: 'YOURS ONLY', felt: 'won', note: 'ours lasts the days laid up (lasts: laid_up_days); marks still ride in with him when the roster hands them' },
  'hit_chance.cap': { bb: 'the same: 5 to 95 (the wiki, Hit Chance)', v: 'AS HARD AS BB', who: 'BOTH SIDES', felt: 'land', carried: ['hit', 'streak'], start: '5 to 95 held: a sure hit makes it a chess puzzle again (rule 37); start: hit + streak' },
  'ours.captain_aura': { bb: 'the same: the Captain perk (bb_all/0343_Captain.txt)', v: 'AS HARD AS BB', who: 'BOTH SIDES', felt: 'rout', carried: ['nerve', 'own'] },
  'ours.cover_defence': { bb: 'no such rule: Battle Brothers\' cover is the blocked shot line only', v: 'NO TWIN', who: 'BOTH SIDES', felt: 'won', note: 'cars and walls on a tile help whoever stands there (rule 67); not a hardness lever' },
  'ours.veteran_death_chance': { bb: '0.67', v: 'SUPERSEDED', who: 'YOURS ONLY', felt: 'dead', note: 'read by nobody on purpose (the fifth votes\' flat 0.20 is newer, COMBAT 10/18); 0.20 is EASIER than 0.67, so last round\'s HARDER THAN BB mark on this row was wrong and is withdrawn' },
  'injuries_and_death.struck_down_survival_chance': { bb: 'this row IS Battle Brothers\' number', v: 'BB\'S OWN ROW', who: 'YOURS ONLY', felt: 'dead', note: 'ours: 0.80 survive (ours.struck_down_death_chance 0.20)' },
  'injuries_and_death.struck_down_survivor_trait': { bb: 'this row IS Battle Brothers\' number (a Survivor lives 90 in 100)', v: 'BB\'S OWN ROW', who: 'YOURS ONLY', felt: 'dead', note: 'the fight has no traits; every man lives 80 in 100' },
  'injuries_and_death.struck_down_impossible_if': { bb: 'this row IS Battle Brothers\' rule: a killing blow, a man retreating, and more kill outright', v: 'EASIER THAN BB', who: 'YOURS ONLY', felt: 'dead', note: 'ours rolls the 0.20 on every fall, the killing blow included' },
  'market.sell_cut': { bb: 'a town hall 0.136 at neutral (camp 0.109, city 0.177)', n: [1 / 7, 0.1364], dir: 'higher', who: 'YOURS ONLY', carried: ['money'], start: '0.20 (the lever)', slider: '0.20 to the wiki\'s by size', note: 'one seventh is a hair over a town, under a city' },
  'market.price_floor': { bb: 'no floor (prices in crowns)', v: 'BOTH WAYS', who: 'YOURS ONLY', note: 'one battery lifts the price of cheap things to buy and to sell alike' },
  'market.markup': { bb: 'buy over sell 6.67 at neutral, Veteran', v: 'NOT A NUMBER IN THE CODE', who: 'YOURS ONLY', carried: ['money'], note: 'the screen reads it off the place\'s cards (tm.buy); ECONOMY names the number' },
  'market.stock_counts': { bb: 'stock by settlement size, no fixed count published', v: 'NO TWIN', who: 'YOURS ONLY' },
  'bag.slots': { bb: '36', n: [36, 36], dir: 'higher', who: 'YOURS ONLY', carried: ['money'], start: '36 held; the carry caps lever is the easier start for what a bag holds' },
  'roster.bag_slots': { bb: '36', n: [36, 36], dir: 'higher', who: 'YOURS ONLY', carried: ['money'], start: '36 held (see bag.slots)' },
  'contract.offers_by_size': { bb: 'more contracts in bigger places, no number published', v: 'NO TWIN', who: 'YOURS ONLY' },
  'contract.pay_one_skull': { bb: 'one sourced anchor: 760 crowns (76 batteries) for a fifteen-head job; nothing per skull', v: 'NO TWIN', who: 'YOURS ONLY', note: 'ECONOMY: price a skull from the wiki before this can be compared' },
  'contract.pay_three_skulls': { bb: 'as contract.pay_one_skull', v: 'NO TWIN', who: 'YOURS ONLY' },
  'contract.slots': { bb: '1 active contract', n: [2, 1], dir: 'higher', who: 'YOURS ONLY' },
  'clinic.base_price': { bb: '20', n: [20, 20], dir: 'lower', who: 'YOURS ONLY', carried: ['money'] },
  'clinic.per_level_price_factor': { bb: '0.2', n: [0.2, 0.2], dir: 'lower', who: 'YOURS ONLY', carried: ['money'] },
  'clinic.halves_days': { bb: '0.5', n: [0.5, 0.5], dir: 'lower', who: 'YOURS ONLY', carried: ['money'] },
  'clinic.base_price_settlement': { bb: '20', n: [20, 20], dir: 'lower', who: 'YOURS ONLY', carried: ['money'] },
  'clinic.halving_settlement': { bb: 'x0.5 (a divisor of 2)', n: [2, 2], dir: 'higher', who: 'YOURS ONLY', carried: ['money'] },
  'clinic.medic_day': { bb: 'no such step', v: 'NO TWIN', who: 'YOURS ONLY' },
  'clinic.default_days': { bb: '0 days out (see ours.struck_down_laid_up_days)', n: [30, 0], dir: 'lower', who: 'YOURS ONLY', word: 'rule 36b', start: '30 (the floor)', slider: '30 to 40' },
  'bar.rounds_a_night': { bb: 'no cap published', v: 'NO TWIN', who: 'YOURS ONLY' },
  'bar.round_price': { bb: 'priced by company size, no flat number', v: 'NO TWIN', who: 'YOURS ONLY' },
  'bar.round_morale': { bb: 'one mood step (GROK_20/21)', n: [1, 1], dir: 'higher', who: 'YOURS ONLY', carried: ['money'] },
  'bar.round_relation': { bb: '0.1 (GROK_118)', n: [0.1, 0.1], dir: 'higher', who: 'YOURS ONLY', carried: ['money'] },
  'bar.rumour_on_talk': { bb: 'no number published', v: 'NO TWIN', who: 'YOURS ONLY' },
  'hall.posts_by_size': { bb: 'by size, the same shape', v: 'AS HARD AS BB', who: 'YOURS ONLY', carried: ['stars'] },
  'hall.market_day_extra': { bb: '+1 recruit on market day', v: 'AS HARD AS BB', who: 'YOURS ONLY', carried: ['stars'], note: '+25 percent of four posts is one' },
  'hall.posts_refresh': { bb: 'no number published', v: 'NO TWIN', who: 'YOURS ONLY' },
  'hall.camp_staff_price': { bb: 'a follower 200 to 350 once (engine/bohemia_followers.js, the wiki\'s retinue)', v: 'EASIER THAN BB', who: 'YOURS ONLY' },
  'stall.goods_price': { bb: 'food 5 to 11 batteries a stack', n: [1, 5], dir: 'lower', who: 'YOURS ONLY', note: 'his ruling, EVERYTHING COSTS ONE (8/15)' },
  'barber.price': { bb: 'free', n: [1, 0], dir: 'lower', who: 'YOURS ONLY', word: 'EVERYTHING COSTS ONE (Paolo 8/15)', start: '1 (his word)', slider: 'none' },
  'yard.swap_price': { bb: 'the Potion of Oblivion: 5000 crowns and seven rare parts for a whole reset', n: [1, 500], dir: 'lower', who: 'YOURS ONLY' },
  'build.price': { bb: 'Battle Brothers builds nothing', v: 'NO TWIN', who: 'YOURS ONLY' },
  'build.lots': { bb: 'Battle Brothers builds nothing', v: 'NO TWIN', who: 'YOURS ONLY' },
  'lot.search_hours': { bb: 'no lot search', v: 'NO TWIN', who: 'YOURS ONLY' },
  'hire.star_odds': { bb: '0.60 / 0.30 / 0.10', n: [0.6, 0.6], dir: 'lower', who: 'YOURS ONLY', carried: ['stars'], start: '0.50 / 0.35 / 0.15 (the lever)', slider: 'to 0.60 / 0.30 / 0.10' },
  'crew.star_odds': { bb: '0.60 one star', n: [0.6, 0.6], dir: 'lower', who: 'YOURS ONLY', carried: ['stars'], start: '0.50 (the lever)', slider: 'to 0.60' },
  'hire.starred_stats': { bb: 'three stats', n: [1, 3], dir: 'higher', who: 'YOURS ONLY', felt: 'won', start: 'three', slider: 'none: three is the rule', owner: 'PEOPLE + RUN TWO' },
  'hire.star_raises_start': { bb: 'a star raises the LEVEL-UP gain, never the start', v: 'NOT THE SAME RULE', who: 'YOURS ONLY', note: 'folded into hire.starred_stats' },
  'hire.price_militia_top': { bb: '49 batteries by the wiki\'s formula (engine/bohemia_pricetable.js, base plus 1.25 x the kit)', n: [225, 49], dir: 'lower', who: 'YOURS ONLY', start: '40 (four fifths of the formula)', slider: '40 to 49', owner: 'RUN TWO + ECONOMY' },
  'hire.price_farmhand_top': { bb: '29 batteries by the same formula', n: [41, 29], dir: 'lower', who: 'YOURS ONLY', start: '23 (four fifths)', slider: '23 to 29', owner: 'RUN TWO + ECONOMY' },
  'hire.wage_charged': { bb: '3 to 35 crowns a day, every day', n: [0, 3], dir: 'lower', who: 'YOURS ONLY', note: 'his ruling: bought once' },
  'crew.starred_stats': { bb: '3', n: [3, 3], dir: 'higher', who: 'YOURS ONLY', carried: ['stars'] },
  'crew.veteran_xp': { bb: '4000 + 1000 a level past 11', n: [4000, 4000], dir: 'lower', who: 'YOURS ONLY', felt: 'xp', carried: ['xp'] },
  'crew.veteran_from': { bb: '11', n: [11, 11], dir: 'higher', who: 'YOURS ONLY', felt: 'xp', carried: ['xp'] },
  'roster.company_cap': { bb: '20', n: [20, 20], dir: 'higher', who: 'YOURS ONLY', start: '20 held: his rule 63b (the roster 20), the bench is not a hardness lever' },
  'staff.price_cook': { bb: 'no retinue price in the data we hold', v: 'NO TWIN', who: 'YOURS ONLY' },
  'staff.scout_travel': { bb: '0.85 (+15 percent speed)', n: [0.85, 0.85], dir: 'lower', who: 'YOURS ONLY', carried: ['money'] },
  'staff.paymaster_cut': { bb: '0.85 (-15 percent wages)', n: [0.85, 0.85], dir: 'lower', who: 'YOURS ONLY', carried: ['money'] }
};

/* ---------- the verdict ---------- */
function judge(r) {
  const t = T[r.id], fam = FAM.find(f => f.re.test(r.id));
  const o = { id: r.id, kind: r.kind, ours: r.value };
  if (t) {
    Object.assign(o, { bb: t.bb, who: t.who, felt: t.felt || null, carried: t.carried || [], note: t.note || null, owner: t.owner || null });
    if (t.v) o.verdict = t.v;
    else {
      const [a, b] = t.n, eq = Math.abs(a - b) < 1e-9;
      o.verdict = eq ? 'AS HARD AS BB' : ((t.dir === 'lower') === (a < b) ? 'EASIER THAN BB' : 'HARDER THAN BB');
      o.compared = { ours: a, bb: b, easier_when: t.dir };
    }
    if (o.verdict === 'HARDER THAN BB') o.verdict += t.word ? ', HIS WORD' : ', NO WORD';
    if (t.word) o.word = t.word;
    if (t.start) o.start = t.start; if (t.slider) o.slider = t.slider;
  } else if (fam && fam.shape) {
    Object.assign(o, { bb: 'not a hardness number', who: 'NOBODY', verdict: 'NOT A HARDNESS NUMBER', felt: null, carried: [] });
  } else if (fam) {
    const wiki = r.source_kind === 'wiki' || /wiki/.test(r.source_kind || '');
    Object.assign(o, { bb: wiki ? 'the same: the row is the wiki\'s number, quoted' : 'the same (Battle Brothers\' rule)', who: fam.who, felt: fam.felt, carried: fam.carried.slice(), verdict: 'AS HARD AS BB' });
    if (fam.start) o.start = fam.start; if (fam.why) o.note = fam.why;
  } else {
    Object.assign(o, { bb: '?', who: '?', verdict: 'UNSORTED', felt: null, carried: [] });
  }
  /* the lever this round names for a row Battle Brothers sets for both sides: the row holds, the lever is the start */
  const lv = R117.levers.find(l => l.id === r.id);
  if (lv && lv.start !== undefined && !o.start) { o.start = (typeof lv.start === 'object' ? JSON.stringify(lv.start) : String(lv.start)) + ' (' + lv.way + ')'; o.slider = JSON.stringify(lv.slider); }
  if (o.verdict === 'AS HARD AS BB' && o.who === 'BOTH SIDES' && !o.start) o.start = 'holds (shared: bending it eases them too); start: ' + o.carried.join(' + ');
  if (o.verdict === 'AS HARD AS BB' && !o.start && o.carried.length) o.start = 'holds; start: ' + o.carried.join(' + ');
  if (o.verdict === 'AS HARD AS BB' && !o.start) o.start = 'held at Battle Brothers\' number: NO LEVER YET (named in section 3.6)';
  if (o.felt) o.measured = { what: FELT[o.felt].w, bb: avg('bb', o.felt), start: avg('start', o.felt), today: avg('today', o.felt) };
  return o;
}
const rows = SEED.rows.map(judge);
const by = {}; rows.forEach(r => { by[r.verdict] = (by[r.verdict] || 0) + 1; });
const unsorted = rows.filter(r => r.verdict === 'UNSORTED').map(r => r.id);
const noLever = rows.filter(r => /NO LEVER YET/.test(r.start || '')).map(r => r.id);

/* ---------- the measured story ---------- */
const SETS = M.settings.map(s => s.id), NAME = Object.fromEntries(M.settings.map(s => [s.id, s.name]));
const lev = ['hit', 'streak', 'count', 'nerve', 'breath', 'breath_both', 'tiers'];
const keys = ['won', 'down', 'dead', 'ran', 'rout', 'land', 'theirs', 'streak', 'xp', 'length'];
const fmt = x => (Math.round(x * 100) / 100).toString();
const sgn = x => (x > 0 ? '+' : '') + fmt(x);

if (unsorted.length) console.log('UNSORTED rows: ' + unsorted.join(', '));
console.log('rows ' + rows.length + ': ' + Object.entries(by).map(e => e[1] + ' ' + e[0]).join(', '));
keys.forEach(k => console.log(k.padEnd(7) + ' today ' + avg('today', k) + '  bb ' + avg('bb', k) + '  start ' + avg('start', k) + '  start_own ' + avg('start_own', k) + '  expert ' + avg('expert', k)));
lev.forEach(l => console.log('alone ' + l.padEnd(12) + keys.map(k => k + ' ' + sgn(avg(l, k) - avg('bb', k))).join('  ')));

if (!process.argv.includes('--write')) process.exit(0);

/* ---------- the bank ---------- */
fs.writeFileSync(path.join(ROOT, 'banks/BOHEMIA_TUNING_EASIER_ROWS_10_18_26.json'), JSON.stringify({
  _readme: 'TUNING [easier than Battle Brothers, measured] 10/18 (rule 117; rule 38g research only). draft:true. NOTHING IN THE GAME READS THIS FILE. '
    + 'Every row of the one numbers table beside Battle Brothers\' own value, who feels it, the verdict (computed where both are numbers), the start and the slider, '
    + 'and the measured number it shows up in (the average of the four fights in banks/BOHEMIA_TUNING_EASIER_MEASURED_10_18_26.json). Generated by tools/bohemia_tuning_easier_page.js.',
  draft: true, schema: 1, counts: by, unsorted: unsorted, levers: LEVER, rows: rows
}, null, 1) + '\n');

/* ---------- the page ---------- */
const md = [];
const v = x => { const s = x === undefined || x === null ? '' : typeof x === 'string' ? x : JSON.stringify(x); return (s && s.length > 70 ? s.slice(0, 67) + '...' : s).replace(/\|/g, '/'); };
const sc = id => M.scenarios.find(s => s.id === id).name;
md.push('# TUNING [easier than Battle Brothers, measured] EVERY FELT NUMBER BESIDE ITS BATTLE BROTHERS TWIN, AND THE FIGHT PLAYED AT BOTH (10/18/26)');
md.push('# Rule 117 (Paolo 10/18, LOCKED, on TUNING\'s numbers card): "I want you to be easier than Battle Brothers... bringing Battle Brothers');
md.push('# into this fun, like Nintendo simplified way kind of vibes, like minimalist vibes... make the people feel that they\'re successfully doing it."');
md.push('# The row: \'easier has to be a number, or it drifts back to hard.\' Research only (rule 38g); nothing in the game reads any file named here.');
md.push('# The frame is Battle Brothers and his word Nintendo-simple, nothing else (the row\'s constraint; section 6 withdraws three outside citations of mine).');
md.push('');
md.push('## 0. WHAT LANDED');
md.push('- EVERY ROW BESIDE BATTLE BROTHERS\' OWN VALUE: all ' + rows.length + ' rows of the one table, the verdict computed by machine where both are numbers (section 5).');
md.push('  ' + Object.entries(by).map(e => e[1] + ' ' + e[0]).join('; ') + '. Unsorted: ' + unsorted.length + '.');
md.push('- THE FIGHT PLAYED AT BOTH: the live fight\'s own rules (slices/BOHEMIA_FIGHT.html, both scripts, the data it loads) run headless by');
md.push('  tools/bohemia_tuning_easier_measured.js, ' + M.fights_per_cell + ' fights a cell, ' + SC.length + ' fights a player meets x ' + SETS.length + ' settings = '
  + (M.fights_per_cell * SC.length * SETS.length) + ' fights, both sides on the fight\'s own brain (AUTO), seeded so every setting meets the same fights.');
md.push('- Data: banks/BOHEMIA_TUNING_EASIER_MEASURED_10_18_26.json (the fights) and banks/BOHEMIA_TUNING_EASIER_ROWS_10_18_26.json (the rows), both draft:true.');
md.push('');
md.push('## 1. THE FIGHT, MEASURED: TODAY, BATTLE BROTHERS (THE HARD END), THE START, AND PAST THE HARD END');
md.push('Each cell is ' + M.fights_per_cell + ' fights. TODAY is the game as it plays (the door defaults to Veteran). BATTLE BROTHERS is Veteran in full: today plus the one');
md.push('thing Battle Brothers does that our fight does not (a level raises three stats; section 3.1). THE START is every rule 117 lever together.');
for (const s of SC) {
  md.push(''); md.push('### ' + sc(s));
  md.push('| setting | ' + keys.map(k => FELT[k].w).join(' | ') + ' | enemies |');
  md.push('|---|' + keys.map(() => '---').join('|') + '|---|');
  for (const st of ['today', 'bb', 'start', 'start_own', 'expert']) md.push('| ' + st + ' | ' + keys.map(k => fmt(M.felt[s][st][FELT[k].f])).join(' | ') + ' | ' + M.felt[s][st].enemies + ' |');
}
md.push('');
md.push('### The four fights averaged (the number each row in section 5 shows)');
md.push('| what he feels | today | Battle Brothers | the start | start + own nerve | past the hard end |'); md.push('|---|---|---|---|---|---|');
for (const k of keys) md.push('| ' + FELT[k].w + ' | ' + avg('today', k) + ' | ' + avg('bb', k) + ' | ' + avg('start', k) + ' | ' + avg('start_own', k) + ' | ' + avg('expert', k) + ' |');
md.push('');
md.push('## 2. EACH LEVER ALONE, ON TOP OF BATTLE BROTHERS (the four fights averaged; the change from Battle Brothers)');
md.push('| lever | ' + keys.map(k => FELT[k].w).join(' | ') + ' |'); md.push('|---|' + keys.map(() => '---').join('|') + '|');
for (const l of lev) md.push('| ' + NAME[l] + ' | ' + keys.map(k => { const d = avg(l, k) - avg('bb', k); return (Math.abs(d) < 1e-9 ? '0' : sgn(d)) + (Math.abs(d) >= 0.05 && better(k, d) ? ' (easier)' : Math.abs(d) >= 0.05 ? ' (harder)' : ''); }).join(' | ') + ' |');
md.push('');

/* ---------- 3. the findings, each read off the data above ---------- */
const at = (s, st, k) => M.felt[s][st][FELT[k].f];
const demo = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_DEMO.html'), 'utf8');
const pk = (demo.match(/var pick = \{ combat:'(\w+)', econ:'(\w+)'/) || []);
const ORG = J('records/target/bb/origins.json'), nc = ORG.origins.find(o => o.id === 'newcrew');
const harderNo = rows.filter(r => r.verdict === 'HARDER THAN BB, NO WORD'), harderHis = rows.filter(r => r.verdict === 'HARDER THAN BB, HIS WORD');
md.push('## 3. THE FINDINGS');
md.push('');
md.push('### 3.1 A LEVEL NEVER RAISES A STAT IN THE FIGHT, AND THE MAP SIZES THE ENEMY BY YOUR LEVELS (HARDER THAN BATTLE BROTHERS, NO WORD)');
md.push('The fight builds every man of his from a fresh roll of his background\'s ranges (crewUnit: hp, skills and defences from bg.stats); his');
md.push('level only picks his perks. Battle Brothers raises three stats every level (rules.json experience.per_level: three attributes; stat_gains:');
md.push('melee skill and defence 1 to 4, ranged skill, hp, breath and nerve 2 to 5). Meanwhile the map sizes a job by the company\'s strength,');
md.push('10 a man plus 2 a level past one (records/target/bb/party_math.json): so every level ADDS ENEMIES and adds nothing to his men.');
md.push('Measured where the gains are the only difference (the grown company and the tough one; in the first fight TODAY also meets the fixed');
md.push('nine where Battle Brothers\' job math sends ten, and the new crew is level one, so neither isolates it):');
md.push('| fight | won in 100, today | won in 100, with the gains | struck down a fight, today | with the gains | your swings that land, today | with the gains |'); md.push('|---|---|---|---|---|---|---|');
for (const s of ['grown', 'tough']) md.push('| ' + sc(s) + ' | ' + at(s, 'today', 'won') + ' | ' + at(s, 'bb', 'won') + ' | ' + at(s, 'today', 'down') + ' | ' + at(s, 'bb', 'down') + ' | ' + at(s, 'today', 'land') + ' | ' + at(s, 'bb', 'land') + ' |');
const G = J('records/target/bb/rules.json').experience.stat_gains.value, gm = k => (G[k][0] + G[k][1]) / 2;
const p1 = gm('primary (melee skill, melee defense)'), s2 = gm('secondary (ranged skill, ranged defense, HP, fatigue, resolve)');
md.push('THE SIZE: small at level three or four (two or three level-ups: +' + 2 * p1 + ' to +' + 3 * p1 + ' melee skill and defence), and it grows every level: a level-11 man');
md.push('in Battle Brothers carries +' + 10 * p1 + ' melee skill, +' + 10 * p1 + ' melee defence and +' + 10 * s2 + ' hp over his roll, while ours carries none and the map has added');
md.push('20 strength for him (two more enemies on a job for every ten such men). The longer he plays, the further under Battle Brothers he falls.');
md.push('Owner: COMBAT (crewUnit reads the stats the roster hands, or adds the level\'s gains) and RUN TWO (the roster hands each man\'s stats).');
md.push('Until it lands, every grown company plays harder than Battle Brothers, which rule 117 makes a NO.');
md.push('');
md.push('### 3.2 THE OTHER ROWS HARDER THAN BATTLE BROTHERS');
md.push('No word from him (a NO before he sees them):');
const oursOf = r => Array.isArray(r.ours) ? v(r.ours) : r.compared ? String(Math.round(r.compared.ours * 1000) / 1000) : v(r.ours);
for (const r of harderNo) md.push('- ' + r.id + ': ours ' + oursOf(r) + ', Battle Brothers ' + v(r.bb) + '. Start: ' + (r.start || '') + (r.owner ? '. Owner: ' + r.owner : '') + '.');
md.push('His word (they stand; the trade is his, rule 117d):');
for (const r of harderHis) md.push('- ' + r.id + ': ours ' + oursOf(r) + ', Battle Brothers ' + v(r.bb) + ' (' + r.word + ')' + (r.note ? '. ' + r.note : '') + '.');
md.push('');
md.push('### 3.3 THE DOOR DEFAULTS TO BATTLE BROTHERS\' OWN DEFAULTS');
md.push('The start screen\'s picks default to combat \'' + pk[1] + '\' and economy \'' + pk[2] + '\' (slices/BOHEMIA_DEMO.html, var pick). \'' + pk[1] + '\' is Battle Brothers\' Veteran');
md.push('(party_math difficulty_by_pick ' + JSON.stringify(PM_PICK()) + ': the party at ' + PM_MULT()[1] + ' of its count); \'' + pk[2] + '\' is its Medium funds (' + nc.batteries.thin + ' batteries for A New Crew, ' + nc.crowns.medium + ' crowns).');
md.push('Rule 117a: Battle Brothers\' default is our HARD END. So the start is the door\'s other two words: combat \'new\' (the party at ' + PM_MULT()[0] + ', Battle Brothers\' Beginner)');
md.push('and economy \'full\' (' + nc.batteries.full + ' batteries, their High). Two words in one line of the door; RUN owns the door\'s cut, UI its stamp. Measured, the party at Beginner alone:');
md.push('fights won ' + avg('bb', 'won') + ' -> ' + avg('count', 'won') + ' in 100, men struck down ' + avg('bb', 'down') + ' -> ' + avg('count', 'down') + ' a fight (the four fights averaged).');
md.push('');
md.push('### 3.4 A SHARED RULE BENT IS NOT EASIER (the control)');
md.push('Breath 18 a turn for BOTH sides against 18 for YOUR men only, on top of Battle Brothers (the four fights averaged, the change):');
md.push('| | ' + ['won', 'down', 'dead', 'land', 'theirs'].map(k => FELT[k].w).join(' | ') + ' |'); md.push('|---|---|---|---|---|---|');
for (const l of ['breath_both', 'breath']) md.push('| ' + NAME[l] + ' | ' + ['won', 'down', 'dead', 'land', 'theirs'].map(k => sgn(avg(l, k) - avg('bb', k))).join(' | ') + ' |');
md.push('A lever has to sit on one side. Every lever in this page does: your roll, their roll, their count, their timing, their nerve, your');
md.push('breath, your dice streak, your money. The rows both sides share stay at Battle Brothers\' number (Battle Brothers keeps enemy stats and gear');
md.push('the same on every difficulty and moves the count and the timing; wiki, Game Mechanics: Difficulty levels).');
md.push('');
md.push('### 3.5 WHAT THE START BUYS, IN WHAT HE FEELS (the four fights averaged)');
for (const k of ['won', 'down', 'dead', 'ran', 'rout', 'land', 'theirs', 'streak', 'xp', 'length']) md.push('- ' + FELT[k].w + ': Battle Brothers ' + avg('bb', k) + ', the start ' + avg('start', k) + ' (today ' + avg('today', k) + ', past the hard end ' + avg('expert', k) + ').');
md.push('');
md.push('### 3.6 WHAT STAYS AS HARD AFTER EVERY LEVER');
const stay = keys.filter(k => k !== 'length' && (!better(k, moved(k)) || Math.abs(moved(k)) < 0.05));
md.push(stay.length ? 'Measured numbers the start does not move the easy way: ' + stay.map(k => FELT[k].w + ' (' + avg('bb', k) + ' -> ' + avg('start', k) + ')').join('; ') + '.' : 'Every measured number of hardness moves the easy way at the start.');
md.push('The length is not a hardness number: his 9/29 band (a routine fight 2 to 4 minutes, a tough one never past 15) is the rule. On AUTO the start\'s');
md.push('fights run ' + avg('bb', 'length') + ' -> ' + avg('start', 'length') + ' minutes because fewer end in a quick wipe; a fight he wins lasts longer than one he loses, and every cell stays under the band\'s top.');
const ownHelps = avg('start', 'ran') - avg('start_own', 'ran') >= 0.1 && avg('start_own', 'won') >= avg('start', 'won');
md.push('Your own men\'s nerve has no lever in rule 117\'s set (their nerve does). Measured, ours.own_nerve 1.1 on top of the start: your men who ran '
  + avg('start', 'ran') + ' -> ' + avg('start_own', 'ran') + ' a fight, fights won ' + avg('start', 'won') + ' -> ' + avg('start_own', 'won') + ' in 100. '
  + (ownHelps ? 'PROPOSED: it joins the levers (the lever file, ours.own_nerve, slider 1.1 / 1.0 / 0.9).' : 'NOT PROPOSED: the start already holds his line; a lever that moves nothing is a number on a screen for nothing (rule 117b).'));
md.push('Rows held at Battle Brothers\' number with no lever on them yet: ' + (noLever.length ? noLever.join(', ') : 'none') + '.');
md.push('');
md.push('### 3.7 THE SLIDER, CALIBRATED (the start, Battle Brothers, past it; won in 100 and men struck down a fight)');
md.push('| fight | the start | Battle Brothers (the hard end) | past the hard end (their Expert) |'); md.push('|---|---|---|---|');
for (const s of SC) md.push('| ' + sc(s) + ' | ' + at(s, 'start', 'won') + ' won, ' + at(s, 'start', 'down') + ' down | ' + at(s, 'bb', 'won') + ' won, ' + at(s, 'bb', 'down') + ' down | ' + at(s, 'expert', 'won') + ' won, ' + at(s, 'expert', 'down') + ' down |');
md.push('');
md.push('## 4. THE LIMITS (said once)');
md.push('- AUTO plays his side: the numbers are the fight\'s own brain on both sides. A good player wins more at every setting; the CHANGE between');
md.push('  settings is the measurement, not the level. The fights are seeded, so every setting meets the same men on the same boards.');
md.push('- Battle Brothers\' level gains are taken at the middle of the wiki\'s range, three stats a level, no stars (a melee man: skill, defence,');
md.push('  hp; a shooter: ranged skill, defence, hp).');
md.push('- The money rows are not in a fight; they are compared row by row (section 5), not played. ECONOMY\'s loop would measure them.');
md.push('- The experience lever (-0.05) is in the start; it moves only the experience number.');
md.push('- Every man wears the kit of his place in the line (ours.crew); by day 65 a Battle Brothers company has bought better armour, so A TOUGH');
md.push('  ONE at Battle Brothers\' numbers (0 won in 300) reads harder than Battle Brothers\' real day 65. The change between settings still holds.');
md.push('- CONTROL: with the hooks set to change nothing, the bench replays the unhooked fight event for event (node tools/bohemia_tuning_easier_measured.js');
md.push('  --control: six seeded fights, the same result, the same rounds, the same number of events).');
md.push('');
md.push(...tb_rows());
md.push('');
md.push('## 6. ROUTED (nothing here is built by TUNING)');
md.push('- COMBAT: 3.1 (a level raises his stats in the fight); the levers as rows read through R(): your roll +5 and theirs -5, the streak');
md.push('  breaker, their nerve 0.9, YOUR breath 18 (never both sides, 3.4), the tier days 25 and 75; the first fight sized by the job math.');
md.push('- RUN + UI: 3.3, the door\'s defaults \'new\' and \'full\'.');
md.push('- RUN TWO + PEOPLE: three starred stats; the roster hands each man\'s stats (3.1). RUN TWO + ECONOMY: the hire prices off the formula.');
md.push('- ECONOMY: the money rows with no twin (contract pay per skull, the markup as a number).');
md.push('- PEOPLE + COMBAT: ours.own_nerve (3.6) as a proposed row.');
md.push('- My last page (records/BOHEMIA_TUNING_RULE_117_EVERY_FELT_NUMBER_STARTS_EASIER_THAN_BATTLE_BROTHERS_10_18_26.md) carries a CORRECTED block:');
md.push('  its three citations outside Battle Brothers are withdrawn, the veteran row is easier not harder, the breath lever is yours only.');
md.push('');
md.push('## 7. SOURCES');
md.push('- The live fight: slices/BOHEMIA_FIGHT.html (fight-data, fight-rules), records/target/bb/*.json, slices/fight_ground, slices/fight_people.');
md.push('- Battle Brothers\' numbers: the wiki dump in records/target/bb/rules.json (Level and Experience, Combat Mechanics, Hit Chance, Morale),');
md.push('  records/target/bb/party_math.json and records/target/bb/origins.json (the wiki\'s origin pages), records/BOHEMIA_TUNING_THE_DIFFICULTY_STEPS_EXACTLY_10_9_26.md.');
md.push('');
md.push('[bb Battle Brothers makes a fight harder by sending more men sooner and by your dice and money, and a man gets better every level; we keep all of it and start one step easier.]');
md.push('[analog horror: the rout is the loudest win these numbers make, and the start makes it about ' + Math.round(10 * avg('start', 'rout') / Math.max(0.01, avg('bb', 'rout'))) / 10 + ' times as common; named for SOUNDS, not moved.]');
fs.writeFileSync(path.join(ROOT, 'records/BOHEMIA_TUNING_EASIER_THAN_BATTLE_BROTHERS_MEASURED_10_18_26.md'), md.join('\n') + '\n');

function PM_PICK() { return J('records/target/bb/party_math.json').difficulty_by_pick.value; }
function PM_MULT() { return J('records/target/bb/party_math.json').difficulty_count_mult.value; }
function tb_rows() {
  const tb = [];
  tb.push('## 5. EVERY ROW BESIDE BATTLE BROTHERS\' OWN VALUE (' + rows.length + ')');
  tb.push('ours = the live value; Battle Brothers = its twin; who = who the number bites; measured = the number it shows up in, the four fights averaged,');
  tb.push('Battle Brothers -> the start. Levers: ' + Object.entries(LEVER).map(e => e[0] + ' = ' + e[1]).join('; ') + '.');
  tb.push('| id | ours | Battle Brothers | who | verdict | measured (BB -> start) | the start and the slider |'); tb.push('|---|---|---|---|---|---|---|');
  const raw = x => String(x || '').replace(/\|/g, '/');
  for (const r of rows) tb.push('| ' + [r.id, r.compared && typeof r.ours === 'string' && Number(r.ours) !== r.compared.ours ? fmt(r.compared.ours) + ' (typed ' + v(r.ours) + ')' : v(r.ours), raw(r.bb), r.who, r.verdict,
    r.measured ? r.measured.what + ': ' + r.measured.bb + ' -> ' + r.measured.start : /^injuries\.permanent\./.test(r.id) ? 'not measured: no man on the bench carries a mark' : 'not a fight number',
    [raw(r.start) + (r.slider ? ' (slider ' + raw(r.slider) + ')' : ''), raw(r.note)].filter(Boolean).join('. ')].join(' | ') + ' |');
  return tb;
}

/* ---------- the VOTE page: two fights he will meet, at the hard end and at the start; what is harder than Battle Brothers ---------- */
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const h = [];
h.push('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">');
h.push('<title>EASIER, MEASURED</title>');
h.push('<style>:root{--bg:#f4efe4;--ink:#1b1711;--line:#8a7d66;--mark:#7a2e1c}body{margin:0;padding:16px;background:var(--bg);color:var(--ink);font:15px/1.4 Georgia,serif}h1{font-size:20px;margin:0 0 6px}h2{font-size:16px;margin:18px 0 6px}p,li{max-width:72ch}.w{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid var(--line);padding:5px 6px;vertical-align:top;text-align:left}th{background:#e8dfcd}.f{background:#f1dcd4}.g{background:#dfe8d2}.k{font-size:11px;color:#5b5244;overflow-wrap:anywhere}</style></head><body>');
h.push('<h1>EASIER, MEASURED</h1>');
h.push('<p>TUNING, research only. We played ' + (M.fights_per_cell * SC.length * SETS.length).toLocaleString('en-US') + ' fights of the real fight, by itself, at Battle Brothers\' numbers and at our easier start, so "easier" is a count and not a feeling.</p>');
h.push('<h2>Four fights you will meet</h2><div class="w"><table><thead><tr><th>The fight</th><th>Battle Brothers: won in 100</th><th>Our start: won in 100</th><th>Battle Brothers: your men down a fight</th><th>Our start: your men down a fight</th></tr></thead><tbody>');
for (const s of SC) h.push('<tr><td>' + esc(sc(s)) + '</td><td>' + at(s, 'bb', 'won') + '</td><td class="g">' + at(s, 'start', 'won') + '</td><td>' + at(s, 'bb', 'down') + '</td><td class="g">' + at(s, 'start', 'down') + '</td></tr>');
h.push('</tbody></table></div>');
h.push('<h2>Harder than Battle Brothers right now</h2><ol>');
h.push('<li class="f"><b>Your men never get stronger when they level up in a fight,</b> but every level makes the enemy bigger. The grown company wins ' + at('grown', 'today', 'won') + ' in 100 today, ' + at('grown', 'bb', 'won') + ' with Battle Brothers\' level-ups.</li>');
h.push('<li class="f"><b>The game starts on Battle Brothers\' normal setting.</b> Our start is the easier one: fewer enemies and more batteries.</li>');
const PLAIN = { 'hire.starred_stats': 'A man you hire gets stars on one stat. Battle Brothers gives three.',
  'hire.price_militia_top': 'A militiaman at the hall costs up to 225 batteries. By Battle Brothers\' own price he is 49.',
  'hire.price_farmhand_top': 'A farmhand costs up to 41 batteries. By Battle Brothers\' own price he is 29.' };
for (const r of harderNo) h.push('<li>' + esc(PLAIN[r.id] || (r.id + ': ours ' + oursOf(r) + ', Battle Brothers ' + v(r.bb))) + '</li>');
h.push('</ol>');
h.push('<p class="k">The table, the 209 numbers beside Battle Brothers\' and the limits: records/BOHEMIA_TUNING_EASIER_THAN_BATTLE_BROTHERS_MEASURED_10_18_26.md. AUTO played both sides. draft:true; nothing in the game reads this page.</p>');
h.push('</body></html>');
fs.writeFileSync(path.join(ROOT, 'slices/BOHEMIA_TUNING_EASIER_MEASURED_10_18_26.html'), h.join('\n') + '\n');
console.log('wrote banks/BOHEMIA_TUNING_EASIER_ROWS_10_18_26.json, records/BOHEMIA_TUNING_EASIER_THAN_BATTLE_BROTHERS_MEASURED_10_18_26.md, slices/BOHEMIA_TUNING_EASIER_MEASURED_10_18_26.html');
