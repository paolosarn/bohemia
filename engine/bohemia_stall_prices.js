// BOHEMIA STALL PRICES -- WHAT THE STALL CHARGES AND WHAT IT PAYS, FOR HIS SUPPLIES (10/26/26, ECONOMY)
// VAMILY ECONOMY [buy versus sell], rule 242 (Paolo 10/26: 'at the stall where a dose of med six rounds
// food and water are available, I should also be able to sell... how much you can make, buy versus sell').
// records/BOHEMIA_ECONOMY_DAY_82_BUY_VERSUS_SELL_THE_STALL_PAYS_HALF_AND_A_TOWN_IN_NEED_PAYS_THE_DIFFERENCE_10_26_26.md
//
// THE RULE IN FOUR LINES (every number in records/target/bb/stall_prices.json, sourced):
//   1. BUY  = the good's price x the town's need for it x (1 - the standing's cut) x the town's buy knob
//            (the stall's own arithmetic today, plus the standing the gear already gets), never under one.
//   2. SELL = the good's price x (need - the stall's cut + the standing's add) x the town's sell knob:
//            a calm town pays HALF; a town in need pays the rise, the stall keeps the same cut; a glut pays nothing.
//   3. A TOWN'S NEED IS A NUMBER OF UNITS a week: past it the town is calm for that good again.
//   4. A SALE PAYS WHOLE BATTERIES, floored, and never as much as the same count would cost to buy here.
// AND (rules 265, 266, Paolo 10/26): every price moves with the place's size; a stall never refuses; the tape shelf
// holds at least a stack every visit; trade goods are cheap where they are made and dear everywhere else.
//
// MECHANISM-MINE / CONTENTS-PAOLO'S: this file types no felt number; the caller hands it the price file
// and the town (its knobs, its need, how much of the need is already sold). Pure functions, no DOM.
// node: require('./bohemia_stall_prices.js')   Gate: gates/buy_versus_sell_gate.js
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  function num(row, dflt) { return row && typeof row.value === 'number' ? row.value : dflt; }
  function goodOf(file, good) { return (file && file.goods && file.goods[good]) || null; }

  /* the share of the calm buy price the stall keeps: what it pays a calm town is (1 - cut) */
  function cutOf(file) { return 1 - num(file && file.sell_share, 0.5); }

  /* ctx: {tier, need, buyMult, sellMult, relBuySub, relSellAdd, soldToNeed}
     need      the town's multiplier on this good (Sickness food 2, meds 3; 1 when calm; under 1 a glut)
     buyMult   the town's general buy knob (traitMult().buy), sellMult its sell knob (traitMult().sell)
     relBuySub, relSellAdd  the standing (relPrice(): up to 0.15 off the buy, 0.02 onto the sell, of worth)
     soldToNeed  units of this good already sold into this town's need this week */
  function needUnits(file, good, tier, need) {
    if (!(need > 1)) return 0;
    var t = file && file.need_units && file.need_units.value && file.need_units.value[good];
    if (!t) return 0;
    return t[tier] != null ? t[tier] : (t.town != null ? t.town : 0);
  }

  /* rule 265(b): the place's size moves every price it charges and pays (Battle Brothers' base multiplier by settlement
     level: small, medium, large); a tier the file does not name is 1 */
  function sizeOf(file, tier) {
    var s = file && file.size_mult && file.size_mult.value;
    return (s && s[tier] != null) ? s[tier] : 1;
  }

  function buyEach(file, good, ctx) {
    var g = goodOf(file, good); if (!g) return null;
    ctx = ctx || {};
    var need = ctx.need > 0 ? ctx.need : 1;
    return num(g.buy, 1) * sizeOf(file, ctx.tier) * need * (1 - (ctx.relBuySub || 0)) * (ctx.buyMult || 1);
  }
  /* what the stall shows and charges for ONE unit: the stall's own rounding today (round, floor at one) */
  function buyShown(file, good, ctx) {
    var b = buyEach(file, good, ctx); if (b == null) return null;
    return Math.max(num(file && file.buy_floor, 1), Math.round(b));
  }

  /* the value of one unit sold, before the floor, at a need of `need` (1 is calm); the cap reads the town's card
     need (`cardNeed`), what the stall charges */
  function sellEachAt(file, good, ctx, need, cardNeed) {
    var g = goodOf(file, good); if (!g) return null;
    ctx = ctx || {};
    var cut = cutOf(file), model = (file && file.need_model && file.need_model.value) || 'constant_cut', share;
    if (model === 'proportional') share = need * (1 - cut) + (ctx.relSellAdd || 0);   /* Battle Brothers' own: need moves both sides alike */
    else share = need - cut + (ctx.relSellAdd || 0);                                  /* the realistic: the stall keeps the same cut, the rise is yours */
    var v = num(g.buy, 1) * sizeOf(file, ctx.tier) * Math.max(0, share) * (ctx.sellMult || 1);
    /* the stall always keeps something: never more than sell_share_max of what it charges a stranger for the same
       unit (the standing left out, so a company it likes is never paid LESS for being liked) */
    var stranger = buyEach(file, good, Object.assign({}, ctx, { need: cardNeed || need, relBuySub: 0 }));
    /* rule 265(b), it never refuses: even a glut pays Battle Brothers' price for any other thing, a share of what
       it charges a stranger on a calm day */
    var floor = num(file && file.sell_floor_share, 0) * buyEach(file, good, Object.assign({}, ctx, { need: 1, relBuySub: 0 }));
    return Math.min(Math.max(v, floor), num(file && file.sell_share_max, 0.85) * stranger);
  }
  /* the need the i-th unit sold into this week's card meets: the card's full need for the first, easing in even
     steps to calm at the last of the town's units (need_eases), or the full need for all of them; calm past them */
  function needAt(file, good, ctx, i) {
    var need = ctx.need > 0 ? ctx.need : 1, units = needUnits(file, good, ctx.tier, need);
    if (i >= units) return Math.min(need, 1);
    var eases = !(file && file.need_eases && file.need_eases.value === false);
    return eases ? 1 + (need - 1) * (1 - i / units) : need;
  }
  /* what the NEXT unit brings, before the floor */
  function sellEach(file, good, ctx) {
    ctx = ctx || {};
    return sellEachAt(file, good, ctx, needAt(file, good, ctx, ctx.soldToNeed || 0), ctx.need > 0 ? ctx.need : 1);
  }

  /* what k units bring, in whole batteries: each one at the need it meets (the first at the card's, easing to calm);
     floored; and never as much as k units cost to buy at this same stall */
  function pays(file, good, ctx, k) {
    ctx = ctx || {}; k = Math.max(0, k | 0); if (!k) return 0;
    var cardNeed = ctx.need > 0 ? ctx.need : 1, from = ctx.soldToNeed || 0, v = 0;
    for (var j = 0; j < k; j++) v += sellEachAt(file, good, ctx, needAt(file, good, ctx, from + j), cardNeed);
    var p = Math.floor(v + 1e-9);
    return Math.max(0, Math.min(p, k * buyShown(file, good, ctx) - 1));
  }

  /* the smallest handful that brings one whole battery (one unit when a unit already does); 0 = the stall
     will not take it here (a glut) */
  function handful(file, good, ctx) {
    var most = num(file && file.handful_max, 12);
    for (var k = 1; k <= most; k++) if (pays(file, good, ctx, k) >= 1) return k;
    return 0;
  }

  /* the whole line, as the stall shows it: buy for one, what a handful brings, the need and how much of
     it is left, and the word's key when the town is short (rule 242(c)) or full (a glut) */
  function line(file, good, ctx) {
    ctx = ctx || {};
    var g = goodOf(file, good); if (!g) return null;
    var need = ctx.need > 0 ? ctx.need : 1, units = needUnits(file, good, ctx.tier, need);
    var h = handful(file, good, ctx), wordAt = num(file && file.need_word_at, 1.25);
    return {
      good: good, unit: g.unit, buy: buyShown(file, good, ctx),
      handful: h, handfulPays: h ? pays(file, good, ctx, h) : 0,
      sellEach: sellEach(file, good, ctx),
      need: need, needLeft: Math.max(0, units - (ctx.soldToNeed || 0)), needUnits: units,
      word: need >= wordAt && units - (ctx.soldToNeed || 0) > 0 ? 'short' : (need < 1 ? 'plenty' : null)
    };
  }

  /* rule 242(a): a sale of food that leaves the wagon under a night for every man warns first */
  function warns(file, good, foodAfter, crew) {
    if (good !== 'food') return false;
    return (foodAfter | 0) < num(file && file.warn_food_nights, 1) * Math.max(1, crew | 0);
  }

  /* ---- THE TAPE SHELF (rule 265(a)): every stall, every visit, at least a stack; more in a bigger place, double where
     the place makes it (Battle Brothers' workshop); a town's card thins or fills it, never under the floor; restocked
     every few days; past the shelf the keeper sells from the back at a dearer price, never sold out.
     ctx: {place, tier, stockMult (traitMult().stock), soldThisRestock} */
  function tapeShelf(file, ctx) {
    var t = file && file.tape_shelf; if (!t || !t.value) return 0;
    ctx = ctx || {};
    var n = t.value[ctx.tier] != null ? t.value[ctx.tier] : t.value.camp;
    if (t.made_by && ctx.place && t.made_by.value && t.made_by.value.indexOf(ctx.place) >= 0) n *= num(t.made_mult, 2);
    n = Math.round(n * (ctx.stockMult > 0 ? ctx.stockMult : 1));
    return Math.max(num(t.min, 20), n);
  }
  /* the price of the next roll: the stall's own buy while the shelf holds, the back room's past it */
  function tapePrice(file, ctx) {
    ctx = ctx || {};
    var base = buyShown(file, 'tape', ctx), t = file && file.tape_shelf;
    if ((ctx.soldThisRestock || 0) < tapeShelf(file, ctx)) return base;
    return Math.max(base + 1, Math.round(base * num(t && t.back_room_mult, 2)));
  }

  /* ---- TRADE GOODS (rule 266(a)): Battle Brothers' rule. A good is cheap where it is made and the maker buys it back
     for little; anywhere else it costs half again and sells at a premium. The place's size and the standing move the
     base (small 0.95, medium 1.02, large 1.10; up to 0.15 off buying and onto selling at Allied); the town's card
     multiplies after.  ctx: {place, tier, buyMult, sellMult, relBase (0 to 0.15)} */
  function tradeGood(file, id) {
    var list = file && file.trade && file.trade.goods; if (!list) return null;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function madeHere(file, id, place) {
    var g = tradeGood(file, id); return !!(g && place && (g.made_by || []).indexOf(place) >= 0);
  }
  function makes(file, place) {
    var list = (file && file.trade && file.trade.goods) || [];
    return list.filter(function (g) { return (g.made_by || []).indexOf(place) >= 0; }).map(function (g) { return g.id; });
  }
  function tradeSides(file, id, ctx) {
    var T = file.trade, m = madeHere(file, id, ctx.place) ? T.made_here.value : T.not_made.value;
    return m;
  }
  function tradeBuy(file, id, ctx) {
    var g = tradeGood(file, id); if (!g) return null;
    ctx = ctx || {};
    var v = g.worth * (sizeOf(file, ctx.tier) - (ctx.relBase || 0)) * tradeSides(file, id, ctx).buy * (ctx.buyMult || 1);
    return Math.max(num(file.buy_floor, 1), Math.round(v));
  }
  /* what one unit brings, whole batteries, never as much as the same stall charges for it */
  function tradeSell(file, id, ctx) {
    var g = tradeGood(file, id); if (!g) return null;
    ctx = ctx || {};
    var v = g.worth * (sizeOf(file, ctx.tier) + (ctx.relBase || 0)) * tradeSides(file, id, ctx).sell * (ctx.sellMult || 1);
    return Math.max(0, Math.min(Math.floor(v + 1e-9), tradeBuy(file, id, ctx) - 1));
  }
  /* how many of its own good a maker's stall holds each restock (none of a good it does not make: that is carried in) */
  function tradeStock(file, id, ctx) {
    ctx = ctx || {};
    if (!madeHere(file, id, ctx.place)) return 0;
    var s = file.trade.stock.value, n = s[ctx.tier] != null ? s[ctx.tier] : s.camp;
    return Math.max(1, Math.round(n * (ctx.stockMult > 0 ? ctx.stockMult : 1)));
  }

  var API = { buyEach: buyEach, buyShown: buyShown, sellEach: sellEach, sellEachAt: sellEachAt, pays: pays,
              handful: handful, line: line, needUnits: needUnits, needAt: needAt, warns: warns, cutOf: cutOf, sizeOf: sizeOf,
              tapeShelf: tapeShelf, tapePrice: tapePrice,
              tradeGood: tradeGood, madeHere: madeHere, makes: makes, tradeBuy: tradeBuy, tradeSell: tradeSell, tradeStock: tradeStock };
  if (HASREQ) module.exports = API;
  if (typeof window !== 'undefined') window.BohemiaStallPrices = API;
})(this);
