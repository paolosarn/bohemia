#!/usr/bin/env node
/* BUY VERSUS SELL (ECONOMY [buy versus sell], rule 242, Paolo 10/26: 'at the stall where a dose of med six rounds food
   and water are available, I should also be able to sell... how much you can make, buy versus sell prices').
   records/BOHEMIA_ECONOMY_DAY_82_BUY_VERSUS_SELL_THE_STALL_PAYS_HALF_AND_A_TOWN_IN_NEED_PAYS_THE_DIFFERENCE_10_26_26.md

   The numbers' half of rule 242(d); RUN TWO's [sell at the stall] gate holds the screen's half (the tap, the count, the
   batteries). Legs:
   F  the price file: every row the stall reads has a value and a source; every 'quote' is the cited page's own words,
      read out of the wiki tarball (or his own words, out of the record that holds them); no need multiplier typed here (a card's need lives on the card, never a second list).
   P  the prices: a calm town pays half; a sick town pays more for food than a calm one and says so; rounds and tape
      have no need; a glut town takes nothing; the warning fires before a sale leaves under a night a man.
   U  242(d) 'sell under buy everywhere': every stall of the valley, every week of a quarter, both standings, every count
      to twelve, and the stacked famines, never pays as much as the same count costs there.
   S  THE SQUEEZE (Day 82 s4), on the live dice: week one's best trading pays under one routine contract, and no week of
      the year's feeds a crew of three; Battle Brothers' own spread at the slider's hard end pays nothing on any trade.
   G  trade goods (rule 266): twelve makers, Battle Brothers' made-here rule, a typical carry pays its trip, and week one's
      perfect trader (the richest purse, every price known, the roads) makes under one routine job a day.
   T  TUNING's one table carries the rows (section R) and names the file.
   M  the gate bites: each mutation of the file turns a leg red. */
'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const FILE = 'records/target/bb/stall_prices.json';
const SP = require(path.join(ROOT, 'engine/bohemia_stall_prices.js'));
const CALC = require(path.join(ROOT, 'tools/bohemia_economy_buy_versus_sell.js'));
let pass = 0, fail = 0;
function ok(what, cond, why) { if (cond) pass++; else { fail++; console.log('  FAIL ' + what + (why ? ' (' + why + ')' : '')); } }

const raw = JSON.parse(fs.readFileSync(path.join(ROOT, FILE), 'utf8'));
const TAR = path.join(ROOT, 'reference/library/grok/wiki/PAGES_ALL.tar.gz');
const pageCache = {};
function page(src) {
  const r = String(src).match(/^((records|laws)\/[^ ,;]+\.md)/);   /* his words: the record that holds them */
  if (r) { try { return fs.readFileSync(path.join(ROOT, r[1]), 'utf8'); } catch (e) { return null; } }
  const m = String(src).match(/(bb_all\/[^,;]+?\.txt)/); if (!m) return null;
  if (!(m[1] in pageCache)) { try { pageCache[m[1]] = cp.execSync('tar -xzOf "' + TAR + '" "' + m[1] + '"', { encoding: 'utf8' }); } catch (e) { pageCache[m[1]] = null; } }
  return pageCache[m[1]];
}
const flat = s => String(s).replace(/<br\s*\/?>/g, ' ').replace(/\s+/g, ' ').trim();

/* ---- F: the file ---- */
function legsF(file, say) {
  let bad = [];
  const reads = ['sell_share', 'need_model', 'sell_share_max', 'buy_floor', 'need_units', 'need_eases', 'need_word_at', 'handful_max', 'warn_food_nights', 'undo_same_visit'];
  reads.forEach(k => { const r = file[k]; if (!r || r.value === undefined || !r.source) bad.push(k); });
  ['food', 'meds', 'rounds', 'tape'].forEach(g => { const r = file.goods && file.goods[g]; if (!r || !r.unit || !r.buy || typeof r.buy.value !== 'number' || !r.buy.source) bad.push('goods.' + g); });
  say('F1 every row the stall reads has a value and a source', bad.length === 0, bad.join(', '));
  /* every quote anywhere in the file is on its page, word for word */
  const quotes = [];
  (function walk(o, at) { if (!o || typeof o !== 'object') return; if (typeof o.quote === 'string') quotes.push({ at, q: o.quote, src: o.source }); if (typeof o.bb_quote === 'string') quotes.push({ at: at + '.bb_quote', q: o.bb_quote, src: o.bb_quote_source }); for (const k in o) walk(o[k], at + '.' + k); })(file, '');
  const miss = quotes.filter(x => { const p = page(x.src); return !p || flat(p).indexOf(flat(x.q)) < 0; }).map(x => x.at);
  say('F2 every quote is its page\'s own words, read out of the tarball (' + quotes.length + ')', quotes.length >= 6 && miss.length === 0, miss.join(', '));
  const typed = JSON.stringify(file).match(/"(sickness|refugees|market_day|short_on_food|drought|besieged|food_buy_mult|medicine_buy_mult)"\s*:/g);
  say('F3 no need multiplier typed in the price file (the card holds it, never a second list)', !typed, typed && typed.join(' '));
  const units = file.need_units && file.need_units.value || {};
  say('F4 only food and meds have a need (no Battle Brothers situation moves ammunition or tools)', Object.keys(units).sort().join() === 'food,meds', Object.keys(units).join());
}

/* ---- P: the prices ---- */
const calm = g => ({ tier: 'town', need: 1, buyMult: 1, sellMult: 1 });
function legsP(file, say) {
  const half = SP.buyEach(file, 'food', calm()) * file.sell_share.value;
  say('P1 a calm town pays half of what it charges: a night of food bought for ' + SP.buyShown(file, 'food', calm()) + ' sells for ' + half.toFixed(2), SP.pays(file, 'food', calm(), 1) === Math.floor(half) && Math.abs(SP.sellEach(file, 'food', calm()) - half) < 1e-9);
  const sz = file.size_mult.value;
  say('P1b a small place pays less than a big one (265(b)): a camp, a town, a fortress', SP.sellEach(file, 'food', { tier: 'camp' }) < SP.sellEach(file, 'food', { tier: 'town' }) && SP.sellEach(file, 'food', { tier: 'town' }) < SP.sellEach(file, 'food', { tier: 'fortress' }) && sz.camp < sz.town && sz.town < sz.fortress);
  say('P2 a calm town takes a dose, a roll and six rounds two for a battery', ['meds', 'rounds', 'tape'].every(g => SP.handful(file, g, calm()) === 2 && SP.pays(file, g, calm(), 2) === 1));
  const sick = { tier: 'town', need: 2, buyMult: 1, sellMult: 1 };
  const sickLine = SP.line(file, 'food', sick);
  say('P3 a sick town pays more for food than a calm one, and says it is short', SP.pays(file, 'food', sick, 1) > SP.pays(file, 'food', calm(), 1) && sickLine.word === 'short', JSON.stringify(sickLine));
  const sickMeds = SP.line(file, 'meds', { tier: 'town', need: 3, buyMult: 1, sellMult: 1 });
  say('P4 a sick town pays more for a dose than a calm one does', SP.pays(file, 'meds', { tier: 'town', need: 3 }, 1) > SP.pays(file, 'meds', calm(), 1) && sickMeds.word === 'short');
  /* the need eases: the first unit pays the most, past the town's units it is calm again */
  const n = SP.needUnits(file, 'food', 'fortress', 2), f = { tier: 'fortress', need: 2 };
  const first = SP.sellEach(file, 'food', f), last = SP.sellEach(file, 'food', Object.assign({}, f, { soldToNeed: n - 1 })), past = SP.sellEach(file, 'food', Object.assign({}, f, { soldToNeed: n }));
  say('P5 the need eases with every unit and is calm past the town\'s ' + n, n > 0 && first > last && last > past && past === SP.sellEach(file, 'food', { tier: 'fortress' }), [first, last, past].join(' > '));
  const glut = { tier: 'camp', need: 0.5 };
  say('P6 a glut pays little and never refuses (265(b)): a harvest camp takes food, a handful of twelve or fewer for a battery, and says it has plenty', SP.handful(file, 'food', glut) > SP.handful(file, 'food', { tier: 'camp' }) && SP.handful(file, 'food', glut) <= file.handful_max.value && SP.line(file, 'food', glut).word === 'plenty');
  say('P6b every stall takes every supply, every size, calm or glutted (never refuses)', ['camp', 'town', 'fortress'].every(t => ['food', 'meds', 'rounds', 'tape'].every(g => [0.5, 1, 2, 3].every(n => SP.handful(file, g, { tier: t, need: n }) >= 1))));
  say('P7 the warning: a sale leaving under a night a man warns, one leaving a night does not', SP.warns(file, 'food', 2, 3) && !SP.warns(file, 'food', 3, 3) && !SP.warns(file, 'meds', 0, 3));
  say('P8 a company a town loves is never paid less for its food than a stranger', SP.pays(file, 'food', Object.assign({ relBuySub: 0.15, relSellAdd: 0.02 }, f), 3) >= SP.pays(file, 'food', f, 3));
}

/* ---- U and S: the valley, through the calculator over the same file ---- */
function legsUS(over, say) {
  const r = CALC.run(over);
  say('U1 no stall sells for as much as it charges: ' + r.sellUnderBuy.checked + ' checks', r.sellUnderBuy.checked > 10000 && r.sellUnderBuy.bad === 0, r.sellUnderBuy.bad + ' at or over');
  say('S1 week one, every game: the best trading pays ' + Math.max(r.weekOne.total, r.allied.weekOne) + ', under one routine contract (' + r.routineContract + ')', r.tests.S1_week_one_under_one_contract);
  say('S2 no week of the year: the best trading pays ' + Math.max(r.yearBest.total, r.allied.best) + ', under a week of food for three (' + r.weekBill + ')', r.tests.S2_every_week_under_a_week_of_food);
  say('S3 the real arithmetic was measured (week one has needy lines on the live dice)', r.weekOne.legs.length > 0 && r.sickShare > 0);
  return r;
}

legsF(raw, ok);
legsP(raw, ok);
legsUS(null, ok);
const bb = CALC.run({ share: raw.slider.bb.sell_share, model: raw.slider.bb.need_model });
ok('S4 Battle Brothers\' spread (the slider\'s hard end) pays nothing on any trade, all year', bb.yearBest.total === 0 && bb.weekOne.total === 0, bb.yearBest.total);

/* ---- G: trade goods (rule 266) ---- */
function legsG(file, say) {
  const goods = file.trade.goods, places = ['Anarchists', 'Blues', 'Caravans', 'Cartel', 'Church', 'Colorful', 'Homeless', 'Mob', 'Network', 'Reds', 'Remnants', 'Trades'];
  say('G1 twelve goods, each made by one place, each of those places makes one; Volunteers and Custom make none', goods.length === 12 && places.every(p => SP.makes(file, p).length === 1) && SP.makes(file, 'Volunteers').length === 0 && SP.makes(file, 'Custom').length === 0);
  say('G2 every good is worth its Battle Brothers worth at ten to one', goods.every(g => g.worth * 10 === +String(g.worth_source.quote).match(/(\d+)$/)[1]));
  const atMaker = goods.every(g => { const c = { place: g.made_by[0], tier: 'town' }; return SP.tradeSell(file, g.id, c) <= Math.ceil(0.2 * SP.tradeBuy(file, g.id, c)); });
  say('G3 the maker buys its own good back for little (Battle Brothers\' 15%)', atMaker);
  const away = goods.every(g => { const c = t => ({ place: 'Volunteers', tier: t }); return SP.tradeSell(file, g.id, c('camp')) <= SP.tradeSell(file, g.id, c('town')) && SP.tradeSell(file, g.id, c('town')) <= SP.tradeSell(file, g.id, c('fortress')) && SP.tradeBuy(file, g.id, c('town')) > SP.tradeBuy(file, g.id, { place: g.made_by[0], tier: 'town' }); });
  say('G4 away from its maker a good costs half again and sells dear, more in a bigger place', away);
}
legsG(raw, ok);
const TR = CALC.runTrade();
ok('G5 a typical carry pays its trip\'s food and wages: the median of the twelve obvious carries nets ' + TR.carries.median.net + ' (' + TR.carries.median.good + ', ' + TR.carries.median.from + ' to ' + TR.carries.median.to + ')', TR.tests.T1_a_typical_carry_pays);
ok('G6 week one, the perfect trader with the richest purse makes ' + TR.weekOne.best.made + ' on goods, under one routine job a day (' + TR.bar + ')', TR.tests.T2_week_one_under_a_job_a_day);
const SUP = CALC.run(null);
ok('G7 goods and supplies together in week one: ' + (TR.weekOne.best.made + Math.max(SUP.weekOne.total, SUP.allied.weekOne)) + ', still under ' + TR.bar, TR.weekOne.best.made + Math.max(SUP.weekOne.total, SUP.allied.weekOne) < TR.bar);
ok('G8 no stall buys a good back at what it charges, stranger or loved', TR.tests.T4_no_stall_buys_back_at_its_price);
ok('G9 every good has a carry that pays', TR.obvious.length === 12 && TR.obvious.every(c => c.gain > 0));

/* ---- T: TUNING's one table ---- */
const TABLE = fs.readFileSync(path.join(ROOT, 'records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md'), 'utf8');
const secP = TABLE.split(/\n## /).find(s => /^[A-Z]\. BUY VERSUS SELL/.test(s)) || '';
ok('T1 the one table has a buy versus sell section, naming the file', /BUY VERSUS SELL/.test(secP) && secP.indexOf(FILE) >= 0);
const rowsP = (secP.match(/^\| stall\.[a-z_]+ \|/gm) || []).length;
ok('T2 the section carries the stall\'s rows (' + rowsP + ')', rowsP >= 8);
ok('T3 the section\'s sell share is the file\'s', new RegExp('\\| stall\\.sell_share \\| ' + raw.sell_share.value + ' \\|').test(secP));

/* ---- M: the gate bites ---- */
function bites(name, mutate, leg) {
  const m = JSON.parse(JSON.stringify(raw)); mutate(m);
  let red = 0; const say = (w, c) => { if (!c) red++; };
  leg(m, say);
  ok('M ' + name + ' turns red', red > 0);
}
bites('a quote nobody wrote', m => { m.sell_share.bb_veteran.quote = 'the merchant pays a fifth'; }, legsF);
bites('a need typed into the price file', m => { m.need_units.value.sickness = { town: 9 }; }, legsF);
bites('a supply with no source', m => { delete m.goods.tape.buy.source; }, legsF);
bites('a calm town paying a third', m => { m.sell_share.value = 0.33; }, legsP);
bites('a need that never eases', m => { m.need_eases.value = false; }, legsP);
bites('a stall that refuses a glut', m => { m.sell_floor_share.value = 0; }, legsP);
bites('a camp paying what a fortress pays', m => { m.size_mult.value.camp = 1.10; }, legsP);
bites('no warning at all', m => { m.warn_food_nights.value = 0; }, legsP);
function bitesValley(name, over) {
  let red = 0; const say = (w, c) => { if (!c) red++; };
  legsUS(over, say);
  ok('M ' + name + ' turns the squeeze red', red > 0);
}
bitesValley('a town that wants three times as much', { units: { food: { camp: 6, town: 12, fortress: 18 }, meds: { camp: 3, town: 3, fortress: 6 } } });
bitesValley('the easiest end paying two thirds', { share: raw.slider.easiest.sell_share });
function bitesTrade(name, over) { const r = CALC.runTrade(over); ok('M ' + name + ' turns the trade squeeze red', !r.tests.T2_week_one_under_a_job_a_day); }
bitesTrade('Battle Brothers\' three-day restock', { restock: 3 });
bitesTrade('a maker with three times the batch', { stock: { camp: 3, town: 6, fortress: 6 } });
bites('a maker that buys its own good back at full price', m => { m.trade.made_here.value.sell = 1.0; }, legsG);
bites('a good worth what its page does not say', m => { m.trade.goods[0].worth = 11; }, legsG);

console.log('=== BUY VERSUS SELL GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
