#!/usr/bin/env node
// TUNING [what you can see in a city, and money teaches] 10/25 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g; rule 151(b)).
// Paolo 10/24: 'if the first thing I did was I hired a full squad 12 people from three... a lot of people would be dying, I'd be
// wasting money... keep a squad fed and paid... it would hurt my ability to hire or recruit better people or get better weapons
// and armor.' This reads the LIVE money files and multiplies the first week out, beside Battle Brothers' own week at ten to one:
//   records/target/bb/nightly_bill.json      the one nightly bill (RUN 10/23): per man per night, food and water
//   records/target/bb/origins.json           A NEW CREW's purse ('full' 290, the door's default: the four boots, 10/24)
//   records/target/bb/price_table.json       the hire formula's base range, 1.25 x the kit (wageAndHire)
//   records/target/BOHEMIA_HALL_PRICE.json   the rule 117 start on the price (four fifths)
//   engine/bohemia_goodbros.js               the six at the post (each background's wiki wage, observed price range)
//   slices/BOHEMIA_SETTLEMENT_SCREEN.html    the hall's KIT per background and hallPrice() (read as text, matched once)
//   records/target/bb/party_math.json        the job's size: the 12 strongest at 10 + 2 a level, one enemy per 10, skulls
//   records/target/bb/weapons.json, armor.json  the kit's value
// node tools/bohemia_tuning_money_teaches.js   prints the tables; --json for the bank
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const BILL = J('records/target/bb/nightly_bill.json'), ORIG = J('records/target/bb/origins.json').origins;
const PT = J('records/target/bb/price_table.json').wageAndHire, HALL = J('records/target/BOHEMIA_HALL_PRICE.json');
const PM = J('records/target/bb/party_math.json'), W = J('records/target/bb/weapons.json').rows, A = J('records/target/bb/armor.json');
const BGS = J('records/target/bb/backgrounds.json');
/* the six at the post, read out of the live file */
const gbCtx = { window: {}, console };
vm.createContext(gbCtx); vm.runInContext(fs.readFileSync(path.join(ROOT, 'engine/bohemia_goodbros.js'), 'utf8'), gbCtx);
const GB = gbCtx.window.BohemiaGoodBros || gbCtx.BohemiaGoodBros;
const SET = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'), 'utf8');
const kitM = SET.match(/var KIT = (\{[\s\S]*?\});/);
if (!kitM || SET.split('var KIT = ').length !== 2) throw new Error('THE HALL MOVED: var KIT not matched once');
const KIT = vm.runInNewContext('(' + kitM[1] + ')');
if (SET.indexOf('return Math.max(1, Math.floor(crowns * HALL.easier / 10));') < 0) throw new Error('THE HALL MOVED: hallPrice changed');

const valueOf = id => { const w = W.filter(r => r.id === id)[0]; if (w) return w.value || 0;
  for (const k of ['body', 'head', 'shields']) { const a = (A[k] || []).filter(r => r.id === id)[0]; if (a) return a.value || 0; } return 0; };
const kitCrowns = bg => (KIT[bg] || []).reduce((s, id) => s + valueOf(id), 0);
/* hallPrice() as the hall computes it, for a man at fraction f of his background's observed price range */
function hall(bg, f, level) {
  const crowns = PT.hiringBaseRange.min + f * (PT.hiringBaseRange.maxApprox - PT.hiringBaseRange.min) + 500 * Math.pow(Math.max(0, (level || 1) - 1), 1.5) + PT.equipmentCostMultiplier * kitCrowns(bg);
  return { batteries: Math.max(1, Math.floor(crowns * HALL.easier / 10)), crowns_bb: Math.round(crowns) };
}
const wageOf = id => { const b = BGS.rows.filter(r => r.id === id)[0]; return b ? b.daily_wage : null; };
/* the wage as the roster already shows it (engine/bohemia_roster.js manOf: daily_wage / 10, rounded, floor one) and as the
   wiki climbs it (x 1.1 a level to 11, engine/bohemia_pricetable.js dailyWageBatteries' rule) */
const wageB = (id, level) => Math.max(1, Math.round((wageOf(id) || 10) * Math.pow(1.1, Math.min(10, (level || 1) - 1)) / 10));
const per = BILL.per_man_per_night.value;
const nc = ORIG.filter(o => o.id === 'newcrew')[0];
const purse = nc.batteries.full;
const NC_MEN = nc.men.map(m => m.background);   /* the founding three: the first is YOU (no wage: the player pays none, GROK_117) */
const SIX = GB.CANDIDATES.map(c => c.id);

function jobCount(n, skulls, level) {
  const R = PM.roster_strength.value, P = PM.job.value;
  const str = Math.min(n, R.strongest) * (R.per_man + R.per_level * ((level || 1) - 1));
  return Math.max(P.min, Math.min(P.max, Math.floor(str / P.strength_per_enemy * P.skull_mult[String(skulls)] + 0.5)));
}
const PAY = { 1: 30, 2: 60, 3: 90 };   /* the board's typed pay (the one table, contract.pay_one_skull), slices/BOHEMIA_SETTLEMENT_SCREEN.html OFFERS */

function week(n, rule) {
  /* hire n - 3 from the post on night one, round-robin through the six, each at the middle of his range (f = 0.5) */
  const hires = Array.from({ length: Math.max(0, n - 3) }, (_, i) => SIX[i % SIX.length]);
  const hireCost = hires.reduce((s, b) => s + hall(b, 0.5).batteries, 0);
  const wageNight = rule === 'today' ? 0 : NC_MEN.slice(1).concat(hires).reduce((s, b) => s + wageB(b, 1), 0);
  const night = n * per + wageNight;
  const left = purse - hireCost;
  return { men: n, hire_cost: hireCost, purse_after_hiring: left, bill_a_night: night, wage_share: wageNight,
    nights_of_runway: Math.floor(left / night), a_one_skull_job: { enemies: jobCount(n, 1), pays: PAY[1], nights_it_pays: Math.round(10 * PAY[1] / night) / 10 },
    a_two_skull_job: { enemies: jobCount(n, 2), pays: PAY[2], nights_it_pays: Math.round(10 * PAY[2] / night) / 10 } };
}
/* Battle Brothers' own first week, at its own numbers (A New Company, Medium 2,400 crowns, the wiki's wages, 2 food a man a day
   at the grain stack's 2 crowns a unit, the Game Guide's observed hire prices at the middle of the range), then at ten to one */
function bbWeek(n) {
  const crowns = nc.crowns.medium, comp = 14;   /* a Companion's wage (ECONOMY Day 72, bb_all/0427_Companion) */
  const hires = Array.from({ length: Math.max(0, n - 3) }, (_, i) => GB.CANDIDATES[i % GB.CANDIDATES.length]);
  const hire = hires.reduce((s, c) => s + (c.hireMin + c.hireMax) / 2, 0);
  const wages = 3 * comp + hires.reduce((s, c) => s + c.wage, 0), food = n * 2 * 2;
  const day = wages + food, left = crowns - hire;
  return { men: n, hire_crowns: Math.round(hire), purse_after_hiring_crowns: Math.round(left), a_day_crowns: day,
    days_of_runway: Math.floor(left / day), at_ten_to_one: { hire: Math.round(hire / 10), purse_after: Math.round(left / 10), a_day: Math.round(day / 10) } };
}

const out = { draft: true, about: 'TUNING 10/25 [money teaches]: research only; nothing reads this', purse_full: purse, per_man_per_night: per, founding: NC_MEN,
  the_six_at_the_post: SIX.map(b => ({ id: b, hall_price_mid: hall(b, 0.5).batteries, hall_price_low: hall(b, 0).batteries, hall_price_high: hall(b, 1).batteries,
    kit_crowns: kitCrowns(b), wiki_wage_crowns: wageOf(b), wage_batteries_level1: wageB(b, 1), wage_batteries_level11: wageB(b, 11) })),
  today: [3, 6, 9, 12].map(n => week(n, 'today')), with_the_wage: [3, 6, 9, 12].map(n => week(n, 'wage')), battle_brothers: [3, 6, 9, 12].map(bbWeek) };
if (process.argv.indexOf('--json') >= 0) console.log(JSON.stringify(out, null, 1));
else {
  console.log('THE SIX AT THE POST (hall price low/mid/high; wage a day at level 1 and 11):');
  out.the_six_at_the_post.forEach(s => console.log('  ' + s.id.padEnd(10) + s.hall_price_low + '/' + s.hall_price_mid + '/' + s.hall_price_high + '   wage ' + s.wage_batteries_level1 + ' -> ' + s.wage_batteries_level11 + '  (wiki ' + s.wiki_wage_crowns + ' crowns)'));
  ['today', 'with_the_wage'].forEach(k => { console.log(k.toUpperCase());
    out[k].forEach(r => console.log('  ' + r.men + ' men: hire ' + r.hire_cost + ', left ' + r.purse_after_hiring + ', bill ' + r.bill_a_night + '/night, runway ' + r.nights_of_runway + ' nights; 1 skull: ' + r.a_one_skull_job.enemies + ' enemies for ' + r.a_one_skull_job.pays + ' = ' + r.a_one_skull_job.nights_it_pays + ' nights; 2 skulls: ' + r.a_two_skull_job.enemies + ' for 60 = ' + r.a_two_skull_job.nights_it_pays)); });
  console.log('BATTLE BROTHERS (Medium 2,400 crowns)');
  out.battle_brothers.forEach(r => console.log('  ' + r.men + ' men: hire ' + r.hire_crowns + ', left ' + r.purse_after_hiring_crowns + ', ' + r.a_day_crowns + '/day, runway ' + r.days_of_runway + ' days'));
}
