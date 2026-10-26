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

  function buyEach(file, good, ctx) {
    var g = goodOf(file, good); if (!g) return null;
    ctx = ctx || {};
    var need = ctx.need > 0 ? ctx.need : 1;
    return num(g.buy, 1) * need * (1 - (ctx.relBuySub || 0)) * (ctx.buyMult || 1);
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
    var v = num(g.buy, 1) * Math.max(0, share) * (ctx.sellMult || 1);
    /* the stall always keeps something: never more than sell_share_max of what it charges a stranger for the same
       unit (the standing left out, so a company it likes is never paid LESS for being liked) */
    var cap = num(file && file.sell_share_max, 0.85) * buyEach(file, good, Object.assign({}, ctx, { need: cardNeed || need, relBuySub: 0 }));
    return Math.min(v, cap);
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
      word: need >= wordAt && units - (ctx.soldToNeed || 0) > 0 ? 'short' : (need < 1 && !h ? 'plenty' : null)
    };
  }

  /* rule 242(a): a sale of food that leaves the wagon under a night for every man warns first */
  function warns(file, good, foodAfter, crew) {
    if (good !== 'food') return false;
    return (foodAfter | 0) < num(file && file.warn_food_nights, 1) * Math.max(1, crew | 0);
  }

  var API = { buyEach: buyEach, buyShown: buyShown, sellEach: sellEach, sellEachAt: sellEachAt, pays: pays,
              handful: handful, line: line, needUnits: needUnits, needAt: needAt, warns: warns, cutOf: cutOf };
  if (HASREQ) module.exports = API;
  if (typeof window !== 'undefined') window.BohemiaStallPrices = API;
})(this);
