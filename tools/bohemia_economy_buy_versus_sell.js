#!/usr/bin/env node
/* ECONOMY [buy versus sell] (rule 242), the calculator behind
   records/BOHEMIA_ECONOMY_DAY_82_BUY_VERSUS_SELL_THE_STALL_PAYS_HALF_AND_A_TOWN_IN_NEED_PAYS_THE_DIFFERENCE_10_26_26.md.
   A research instrument, not a gate (the gate is gates/buy_versus_sell_gate.js, which calls this file's run()).

   What it does, every number from a file on main:
   - every town's cards for every week of a year, with the map's own dice (engine/bohemia_livingmap.js traitsFor over
     records/target/settlement_traits.json; the 14 home bases of the map, CT_BASES_BAKED, their tiers from
     engine/bohemia_towns.js over the faction graph), the stall's knobs the settlement screen's own way (traitMult);
   - every stall's buy and sell for food, meds, rounds and tape through engine/bohemia_stall_prices.js over
     records/target/bb/stall_prices.json;
   - THE ARBITRAGE: buy at the cheapest stall in the valley that week, sell into every town's need up to its units,
     every needy town reached (the travel is checked, not charged), so the number is a ceiling a smart company cannot beat;
   - the same week with every card stacked at once in every town (the ceiling of the ceiling);
   - the squeeze tests (Day 82 s4): the best week pays under ONE routine contract (30) and under the crew's week of
     food (42 for three); every stall sells under what it buys; a calm town pays half.
   node tools/bohemia_economy_buy_versus_sell.js [--json] [--share 0.5] [--model constant_cut|proportional] */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const J = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const SP = require(path.join(ROOT, 'engine/bohemia_stall_prices.js'));
const LM = require(path.join(ROOT, 'engine/bohemia_livingmap.js'));
const TOWNS = require(path.join(ROOT, 'engine/bohemia_towns.js'));

function arg(name, dflt) { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : dflt; }

function load(over) {
  const file = J('records/target/bb/stall_prices.json');
  if (over && over.share != null) file.sell_share = Object.assign({}, file.sell_share, { value: +over.share });
  if (over && over.model) file.need_model = Object.assign({}, file.need_model, { value: over.model });
  if (over && over.units) file.need_units = Object.assign({}, file.need_units, { value: over.units });
  const traits = J('records/target/settlement_traits.json');
  const arrival = J('records/target/bb/arrival_traits.json');
  const places = J('records/target/BOHEMIA_BAR_NEWS_PLACES.json').places;
  const tiers = TOWNS.tiers(J('engine/BOHEMIA_faction_graph.json'), 1);
  const board = J('records/target/BOHEMIA_BOARD_SHELF.json');
  const bill = J('records/target/bb/nightly_bill.json');
  const origins = J('records/target/bb/origins.json');
  return { file, traits, arrival, places, tiers, board, bill, origins };
}

/* the settlement screen's traitMult(), line for line (slices/BOHEMIA_SETTLEMENT_SCREEN.html): a caused card reads the
   arrival file's effects, a rolled one its own fields */
function knobs(D, cards) {
  const m = { buy: 1, sell: 1, meds: 1, food: 1 };
  cards.forEach(t => {
    if (t.caused_by === 'ledger') {
      const f = (D.arrival.traits[t.id] && D.arrival.traits[t.id].effects) || {}, v = k => f[k] ? f[k].value : 1;
      m.buy *= v('buy_price_mult'); m.sell *= v('sell_price_mult'); return;
    }
    m.buy *= (t.buy_mult || t.price_mult || 1); m.sell *= (t.sell_mult || t.price_mult || 1);
    m.meds *= (t.medicine_buy_mult || 1); m.food *= (t.food_buy_mult || 1);
  });
  return m;
}
const card = (D, id) => D.traits.traits.find(t => t.id === id);
const GOODS = ['food', 'meds', 'rounds', 'tape'];
function ctxFor(D, tier, cards, rel) {
  const k = knobs(D, cards);
  rel = rel || { buySub: 0, sellAdd: 0 };
  return g => ({ tier, need: g === 'food' ? k.food : g === 'meds' ? k.meds : 1, buyMult: k.buy, sellMult: k.sell,
                 relBuySub: rel.buySub, relSellAdd: rel.sellAdd, soldToNeed: 0 });
}
const ALLIED = D => ({ buySub: D.traits.relation_prices.buy_sub_at_100, sellAdd: D.traits.relation_prices.sell_add_at_100 });

/* one week of the valley: every place's cards, every stall's lines, the cheapest buy, the arbitrage */
function week(D, w, opt) {
  opt = opt || {};
  const stalls = D.places.map(p => {
    const tier = (D.tiers[p.id] && D.tiers[p.id].tier) || 'camp';
    let cards = opt.stack ? opt.stack.map(id => card(D, id)).filter(Boolean) : LM.traitsFor(D.traits, p.id, w * 7);
    const ctx = ctxFor(D, tier, cards, opt.allied ? ALLIED(D) : null);
    return { place: p.id, tier, x: p.x, y: p.y, cards: cards.map(c => c.id), ctx };
  });
  /* the cheapest place to buy each good this week (a source stall can be well supplied and allied in the stacked case) */
  const srcCtx = opt.stack ? ctxFor(D, 'fortress', [card(D, 'well_supplied')], ALLIED(D)) : null;
  const minBuy = {};
  GOODS.forEach(g => {
    minBuy[g] = Math.min.apply(null, stalls.map(s => SP.buyShown(D.file, g, s.ctx(g))));
    if (srcCtx) minBuy[g] = Math.min(minBuy[g], SP.buyShown(D.file, g, srcCtx(g)));
  });
  let total = 0; const legs = [];
  stalls.forEach(s => GOODS.forEach(g => {
    const c = s.ctx(g), n = SP.needUnits(D.file, g, s.tier, c.need);
    if (!n) return;
    const gain = SP.pays(D.file, g, c, n) - n * minBuy[g];
    if (gain > 0) { total += gain; legs.push({ place: s.place, tier: s.tier, good: g, units: n, pays: SP.pays(D.file, g, c, n), cost: n * minBuy[g], gain }); }
  }));
  return { w, total, legs, minBuy, stalls };
}

/* the needy towns of a week visited in one loop from the first: nearest next, straight lines on the 384 m cells, at the
   map's minutes a cell (slices/BOHEMIA_CITY_WORLD.html cityStepMins: MIN_PER_CELL 0.084 x FN 128) */
const MIN_A_CELL = 0.084 * 128;
function tourHours(stops) {
  if (stops.length < 2) return 0;
  const left = stops.slice(1); let at = stops[0], cells = 0;
  while (left.length) {
    let bi = 0, bd = 1e9;
    left.forEach((s, i) => { const d = Math.hypot(s.x - at.x, s.y - at.y); if (d < bd) { bd = d; bi = i; } });
    cells += bd; at = left.splice(bi, 1)[0];
  }
  return cells * MIN_A_CELL / 60;
}

function run(over) {
  const D = load(over);
  const out = { share: D.file.sell_share.value, model: D.file.need_model.value, units: D.file.need_units.value };
  /* the bar: a routine contract (the board's one-skull pay, the commonest), the crew's week of food */
  const pays = D.board.offers ? D.board.offers.map(o => o.pay) : [];
  const shelf = JSON.stringify(D.board).match(/"pay":\s*(\d+)/g).map(s => +s.split(':')[1]);
  out.routineContract = Math.min.apply(null, shelf);
  out.weekBill = 3 * D.bill.per_man_per_night.value * 7;

  /* the calm valley, and the lines he sees at a calm stall and at a sick one */
  const calm = ctxFor(D, 'town', []), sick = ctxFor(D, 'town', [card(D, 'sickness')]);
  const sickMarket = ctxFor(D, 'town', [card(D, 'sickness'), card(D, 'market_day')]);
  const refugees = ctxFor(D, 'town', [card(D, 'refugees')]);
  out.lines = {};
  [['calm', calm], ['sick', sick], ['sick + market day', sickMarket], ['refugees', refugees], ['market day', ctxFor(D, 'town', [card(D, 'market_day')])],
   ['taken (conquered)', ctxFor(D, 'town', [card(D, 'conquered')])], ['well supplied', ctxFor(D, 'town', [card(D, 'well_supplied')])]]
    .forEach(([name, c]) => { out.lines[name] = {}; GOODS.forEach(g => { const l = SP.line(D.file, g, c(g)); out.lines[name][g] = { buy: l.buy, handful: l.handful, pays: l.handfulPays, each: +l.sellEach.toFixed(3), need: l.need, needLeft: l.needLeft, word: l.word }; }); });

  /* every week of a year with the dice; week one is week 0 in every game (the seed is the place's name and the week) */
  const year = []; for (let w = 0; w < 52; w++) year.push(week(D, w));
  out.weekOne = { total: year[0].total, legs: year[0].legs, sick: year[0].stalls.filter(s => s.cards.length).map(s => s.place + ' ' + s.tier + ' ' + s.cards.join('+')) };
  const best = year.reduce((a, b) => b.total > a.total ? b : a);
  out.yearBest = { w: best.w, total: best.total, needy: best.legs.length, hours: +tourHours(best.legs.map(l => D.places.find(p => p.id === l.place)).filter((v, i, a) => a.indexOf(v) === i)).toFixed(1) };
  out.yearMean = +(year.reduce((a, b) => a + b.total, 0) / year.length).toFixed(1);
  /* the same year for a company every town loves (Allied: buys up to 0.15 of worth cheaper, sells 0.02 dearer) */
  const loved = []; for (let w = 0; w < 52; w++) loved.push(week(D, w, { allied: true }));
  out.allied = { weekOne: loved[0].total, best: Math.max.apply(null, loved.map(y => y.total)) };
  /* the bar for one man (the Lone Wolf's week of food), reported, not tested: his squeeze is the hall, not the bill */
  out.loneWolfWeek = 1 * D.bill.per_man_per_night.value * 7;
  const sickShare = year.reduce((a, y) => a + y.stalls.filter(s => s.cards.includes('sickness')).length, 0) / (52 * D.places.length);
  out.sickShare = +sickShare.toFixed(3);

  /* the ceiling of the ceiling: every town sick, on market day, with refugees, he Allied everywhere, the source well supplied */
  const stacked = week(D, 0, { stack: ['sickness', 'market_day', 'refugees'], allied: true });
  out.stacked = { total: stacked.total, perTier: {} };
  stacked.legs.forEach(l => { out.stacked.perTier[l.tier + ' ' + l.good] = l.gain; });
  out.stackedHours = +tourHours(D.places).toFixed(1);

  /* every stall sells under what it buys: every place, every week, every good, every count to twelve, both standings */
  let bad = 0, checked = 0;
  [false, true].forEach(allied => year.slice(0, 13).forEach((y, wi) => {
    const yy = allied ? week(D, wi, { allied: true }) : y;
    yy.stalls.forEach(s => GOODS.forEach(g => { const c = s.ctx(g); for (let k = 1; k <= 12; k++) { checked++; if (SP.pays(D.file, g, c, k) >= k * SP.buyShown(D.file, g, c)) bad++; } }));
  }));
  /* and the stacked famines that could beat it: food x6 (Short on Food on Sickness), Allied */
  [2, 3, 4, 6].forEach(n => GOODS.forEach(g => { const c = { tier: 'fortress', need: n, buyMult: 1, sellMult: 1.25, relBuySub: 0.15, relSellAdd: 0.02 }; for (let k = 1; k <= 12; k++) { checked++; if (SP.pays(D.file, g, c, k) >= k * SP.buyShown(D.file, g, c)) bad++; } }));
  out.sellUnderBuy = { checked, bad };

  /* what each origin's starting kit brings sold whole at a calm stall, in the crew's nights of food */
  out.kits = D.origins.origins.map(o => {
    const s = o.supplies || {}, crew = (o.men || []).length || 3, c = calm;
    const v = sh => (SP.pays(D.file, 'meds', c('meds'), (s.meds || {})[sh] || 0) + SP.pays(D.file, 'tape', c('tape'), (s.tape || {})[sh] || 0)
      + SP.pays(D.file, 'rounds', c('rounds'), Math.floor(((s.rounds || {})[sh] || 0) / 6)));
    return { id: o.id, crew, full: v('full'), thin: v('thin'), bare: v('bare'), nightsFull: +(v('full') / (crew * D.bill.per_man_per_night.value)).toFixed(1) };
  });

  /* THE SQUEEZE (Day 82 s4): S1 the first week, every game, trading's ceiling pays under one routine contract
     ('spilling blood pays better than spilling wine', bb_all/0834); S2 no week of the year, trading's ceiling feeds a
     crew of three (it is a bonus on the work, never the work); S3 no stall is a bank; S4 a calm town pays half */
  out.tests = {
    S1_week_one_under_one_contract: Math.max(out.weekOne.total, out.allied.weekOne) < out.routineContract,
    S2_every_week_under_a_week_of_food: Math.max(out.yearBest.total, out.allied.best) < out.weekBill,
    S3_sell_under_buy_everywhere: bad === 0,
    S4_calm_pays_half: Math.abs(out.lines.calm.food.each - SP.buyEach(D.file, 'food', calm('food')) * D.file.sell_share.value) < 0.001
  };
  return out;
}

if (require.main === module) {
  const over = { share: arg('--share', null), model: arg('--model', null) };
  const r = run(over);
  if (process.argv.includes('--json')) { console.log(JSON.stringify(r, null, 1)); process.exit(0); }
  console.log('BUY VERSUS SELL: share ' + r.share + ', model ' + r.model + ', need units ' + JSON.stringify(r.units));
  console.log('the bar: one routine contract ' + r.routineContract + ', a week of food for three ' + r.weekBill);
  Object.keys(r.lines).forEach(n => console.log('  ' + n.padEnd(18) + GOODS.map(g => { const l = r.lines[n][g]; return g + ' buy ' + l.buy + ' / sell ' + l.pays + ' for ' + l.handful + (l.word ? ' [' + l.word + ' ' + l.needLeft + ']' : ''); }).join(' | ')));
  console.log('week one (every game): ' + r.weekOne.total + ' from ' + r.weekOne.legs.length + ' needy lines; carded towns: ' + r.weekOne.sick.join(', '));
  r.weekOne.legs.forEach(l => console.log('    ' + l.place + ' (' + l.tier + ') ' + l.good + ': ' + l.units + ' sold for ' + l.pays + ', bought for ' + l.cost + ', +' + l.gain));
  console.log('the year: best week ' + r.yearBest.w + ' pays ' + r.yearBest.total + ' (' + r.yearBest.needy + ' needy lines, the loop ' + r.yearBest.hours + ' h), mean ' + r.yearMean + '; sick place-weeks ' + (100 * r.sickShare).toFixed(1) + '%');
  console.log('a company every town loves (Allied): week one ' + r.allied.weekOne + ', best week ' + r.allied.best + '; one man\'s week of food ' + r.loneWolfWeek + ' (reported)');
  console.log('stacked, never on the dice (every town sick + market day + refugees at once, Allied, the source well supplied): ' + r.stacked.total + ' ' + JSON.stringify(r.stacked.perTier) + '; the loop through all 14: ' + r.stackedHours + ' h');
  console.log('sell under buy: ' + r.sellUnderBuy.checked + ' checked, ' + r.sellUnderBuy.bad + ' at or over');
  console.log('a starting kit sold whole, calm: ' + r.kits.map(k => k.id + ' ' + k.full + '/' + k.thin + '/' + k.bare + ' (' + k.nightsFull + ' nights)').join(', '));
  console.log('TESTS ' + JSON.stringify(r.tests));
}
/* ---- TRADE GOODS (rule 266; Day 83) --------------------------------------------------------------------------------
   T1 A TYPICAL CARRY PAYS: every good, its maker's restock carried to every town that does not make it, on a calm neutral
      day, the one leg on dirt (the slow ground: the honest cost), against the leg's food and wages for a crew of three
      (2 a man a night, records/target/bb/nightly_bill.json; the median hired man's wage, backgrounds.json at ten to one).
   T2 THE FIRST WEEK'S SQUEEZE: the richest start on main (origins.json, the biggest FULL purse), from every town, perfect
      knowledge, road speed everywhere (the fast ground: the honest ceiling), week one's real cards (the dice), every
      maker's restock every 3 days; the trader takes, over and over, the carry that pays most per hour. Week one's food is
      in the wagon (origins.json food_days 7), so what it makes is all profit. The bar: under one routine contract a day
      (7 x 30), when the map's pace holds four to six jobs a day (records/BOHEMIA_COORDINATOR_THE_PACE_MATH_OUR_DAY_AGAINST_
      BATTLE_BROTHERS_10_26_26.md): trading never pays like working.
   T3 THE STOCK CEILING, reported: every maker's whole week of stock sold at its best buyer, nothing for time or money. */
const MIN_DIRT = 0.084 * 128, MIN_ROAD = MIN_DIRT * 0.5;   /* cityStepMins: MIN_PER_CELL x FN, PAVED_SPEED.factor 0.5 */
function legH(a, b, mins) { return Math.hypot(a.x - b.x, a.y - b.y) * mins / 60; }
function runTrade(over) {
  const D = load(over), F = D.file;
  if (over && over.stock) F.trade.stock = Object.assign({}, F.trade.stock, { value: over.stock });
  if (over && over.restock) F.trade.restock_days = Object.assign({}, F.trade.restock_days, { value: over.restock });
  const P = D.places.map(p => ({ id: p.id, x: p.x, y: p.y, tier: (D.tiers[p.id] && D.tiers[p.id].tier) || 'camp' }));
  const goods = F.trade.goods.map(g => g.id);
  const bg = J('records/target/bb/backgrounds.json').rows.map(r => +r.daily_wage || 0).filter(w => w > 0).sort((a, b) => a - b);
  const wage = bg[Math.floor(bg.length / 2)] / 10, perManDay = D.bill.per_man_per_night.value + wage, crew = 3;
  const out = { stock: F.trade.stock.value, wageMedian: wage, tripCostPerHour: +(crew * perManDay / 24).toFixed(3) };
  const ctxAt = (p, cards) => { const k = knobs(D, cards || []); return { place: p.id, tier: p.tier, buyMult: k.buy, sellMult: k.sell, stockMult: k.stock || 1, relBase: 0 }; };

  /* T1: the carries */
  const carries = [];
  goods.forEach(g => P.filter(m => SP.madeHere(F, g, m.id)).forEach(m => P.filter(b => !SP.madeHere(F, g, b.id)).forEach(b => {
    const n = SP.tradeStock(F, g, ctxAt(m)), cost = n * SP.tradeBuy(F, g, ctxAt(m)), paid = n * SP.tradeSell(F, g, ctxAt(b));
    const h = legH(m, b, MIN_DIRT), trip = h * out.tripCostPerHour;
    carries.push({ good: g, from: m.id, to: b.id, units: n, gain: paid - cost, hours: +h.toFixed(1), trip: +trip.toFixed(1), net: +(paid - cost - trip).toFixed(1) });
  })));
  carries.sort((a, b) => a.net - b.net);
  /* the typical carry is the obvious one the map would show him (266(b) marks the towns that pay more, best first):
     each good's batch to the NEAREST town that pays more than its maker charges; the median of the twelve */
  const obvious = goods.map(g => carries.filter(c => c.good === g && c.gain > 0).sort((a, b) => a.hours - b.hours)[0]).filter(Boolean).sort((a, b) => a.net - b.net);
  const med = obvious[Math.floor(obvious.length / 2)];
  out.obvious = obvious;
  out.carries = { n: carries.length, paying: carries.filter(c => c.net > 0).length, median: med, worst: carries[0], best: carries[carries.length - 1] };
  out.byGood = goods.map(g => { const cs = carries.filter(c => c.good === g).sort((a, b) => b.net - a.net); return { good: g, from: cs[0].from, units: cs[0].units, best: cs[0].to + ' +' + cs[0].net, nearestPaying: (cs.filter(c => c.net > 0).sort((a, b) => a.hours - b.hours)[0] || {}).to, paying: cs.filter(c => c.net > 0).length + ' of ' + cs.length }; });

  /* T2: the week-one trader */
  const purse = Math.max.apply(null, D.origins.origins.map(o => (o.batteries || {}).full || 0));
  const cards0 = {}; P.forEach(p => { cards0[p.id] = LM.traitsFor(D.traits, p.id, 0); });
  function trader(start) {
    let at = P.find(p => p.id === start), cash = purse, t = 0, made = 0, trips = 0;
    const taken = {};   /* good:place:restock -> units bought */
    const H = 7 * 24, per = F.trade.restock_days.value * 24;
    while (t < H) {
      const r = Math.floor(t / per); let best = null;
      goods.forEach(g => P.filter(m => SP.madeHere(F, g, m.id)).forEach(m => {
        const cm = ctxAt(m, cards0[m.id]), left = SP.tradeStock(F, g, cm) - (taken[g + ':' + m.id + ':' + r] || 0);
        const pb = SP.tradeBuy(F, g, cm), n = Math.min(left, Math.floor(cash / pb), 36);
        if (n <= 0) return;
        P.forEach(b => { if (SP.madeHere(F, g, b.id)) return;
          const gain = n * (SP.tradeSell(F, g, ctxAt(b, cards0[b.id])) - pb), h = legH(at, m, MIN_ROAD) + legH(m, b, MIN_ROAD) + 0.25;
          if (gain > 0 && t + h <= H && (!best || gain / h > best.rate)) best = { g, m, b, n, pb, gain, h, rate: gain / h };
        });
      }));
      if (!best) { t = (r + 1) * per; if (t >= H) break; continue; }
      taken[best.g + ':' + best.m.id + ':' + r] = (taken[best.g + ':' + best.m.id + ':' + r] || 0) + best.n;
      cash += best.gain; made += best.gain; t += best.h; at = best.b; trips++;
    }
    return { start, made, trips };
  }
  const runs = P.map(p => trader(p.id)).sort((a, b) => b.made - a.made);
  out.weekOne = { purse, best: runs[0], worst: runs[runs.length - 1], median: runs[Math.floor(runs.length / 2)] };
  out.jobDay = 30; out.bar = 7 * out.jobDay;

  /* T3: the stock ceiling */
  let ceil = 0;
  goods.forEach(g => P.filter(m => SP.madeHere(F, g, m.id)).forEach(m => {
    const cm = ctxAt(m, cards0[m.id]), n = SP.tradeStock(F, g, cm) * Math.ceil(7 / F.trade.restock_days.value);
    const top = Math.max.apply(null, P.filter(b => !SP.madeHere(F, g, b.id)).map(b => SP.tradeSell(F, g, ctxAt(b, cards0[b.id]))));
    ceil += Math.max(0, n * (top - SP.tradeBuy(F, g, cm)));
  }));
  out.stockCeiling = ceil;

  /* the made-here rule holds at every stall: the maker buys back for little, nobody sells for what it charges */
  let bad = 0;
  goods.forEach(g => P.forEach(p => ['camp', 'town', 'fortress'].forEach(() => { const c = ctxAt(p); [0, 0.15].forEach(rel => { c.relBase = rel; if (SP.tradeSell(F, g, c) >= SP.tradeBuy(F, g, c)) bad++; }); })));
  out.sellUnderBuy = bad;
  out.tests = {
    T1_a_typical_carry_pays: med.net > 0,
    T2_week_one_under_a_job_a_day: out.weekOne.best.made < out.bar,
    T4_no_stall_buys_back_at_its_price: bad === 0
  };
  return out;
}

module.exports = { run, week, load, knobs, runTrade };
