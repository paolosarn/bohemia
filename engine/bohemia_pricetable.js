// BOHEMIA PRICE TABLE -- EVERY PRICE IN THE DEMO FROM THE WIKI, AT TEN TO ONE (10/9/26, ECONOMY)
// VAMILY [the price table at ten to one], rule 74 top row. "One data file the market, the
// posts and the board read." This is that mechanism: pure functions over three sources --
// records/target/bb/price_table.json (the market-level numbers: sell cut by relation and size,
// situation multipliers, the one contract-pay anchor, the daily rates) and the wiki's own
// per-item extracts COMBAT already pulled (backgrounds.json for the exact daily-wage and
// hiring-cost formula, weapons.json/armor.json for item value, read by the caller, not here).
//
// THE CONVERSION IS HIS, LOCKED (GROK_31/32/33, 2026-10-01): every wiki crown number is divided
// by 10 and floored at 1 battery. No crowns anywhere in the game -- this module never returns a
// crown number, only batteries.
//
// MECHANISM-MINE / CONTENTS-PAOLO'S: every table this file reads carries its source in the JSON
// beside it. This file adds no number of its own; it only does the arithmetic the ten-to-one
// ruling and the wiki's own formulas already specify.
//
// node: require('./bohemia_pricetable.js')   Gate: gates/pricetable_gate.js
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  function loadJSON(path) {
    if (!HASREQ) return null;
    try { return require(path); } catch (e) { return null; }
  }
  var TABLE = loadJSON('../records/target/bb/price_table.json');
  var BACKGROUNDS = loadJSON('../records/target/bb/backgrounds.json');

  var CROWNS_PER_BATTERY = (TABLE && TABLE.conversion && TABLE.conversion.crownsPerBattery) || 10;
  var FLOOR_BATTERIES = (TABLE && TABLE.conversion && TABLE.conversion.floorBatteries) || 1;

  /* THE ONE CONVERSION EVERYTHING ELSE IN THIS FILE CALLS. Town markup is applied by the
     CALLER before this (this function does not know what a settlement's markup is); this
     function only does "divide by ten, floor at one". A value of 0 stays 0 -- the floor is a
     FLOOR on a real trade, not a rule that money appears from nothing (the indebted wage and
     the Lone Wolf's wage are both a real, ruled 0, not 1). */
  function toBatteries(crowns, opts) {
    opts = opts || {};
    var c = crowns || 0;
    if (c === 0 && opts.allowZero) return 0;
    // GROK_31: "Divide every crown price by 10. Round down for the slice." Floor, not
    // round-to-nearest -- verified against GROK_34's own battery-tier grouping, which puts
    // disowned_noble (wiki wage 18) in the "1 battery a day" bucket: 18/10 floors to 1,
    // rounding-to-nearest would give 2 and contradict Grok's own table.
    return Math.max(FLOOR_BATTERIES, Math.floor(c / CROWNS_PER_BATTERY));
  }

  function backgroundRow(id) {
    if (!BACKGROUNDS || !BACKGROUNDS.rows) return null;
    var want = String(id || '').toLowerCase().replace(/[\s_]+/g, '_');
    for (var i = 0; i < BACKGROUNDS.rows.length; i++) {
      var r = BACKGROUNDS.rows[i];
      if (r.id === want || String(r.id || '').toLowerCase() === want) return r;
    }
    return null;
  }

  /* THE WIKI'S OWN WAGE FORMULA (backgrounds.json hiring_and_wage_rules, sourced from the Game
     Guide, cross-checked in GROK_117): base * random(0.9,1.1) * 1.1^(level-1) for levels 1-11,
     then wage(11) * 1.03^(level-11) after. rand() is injected so this is deterministic under
     test; the caller supplies its own seeded roll in play. */
  function dailyWageBatteries(backgroundId, level, rand) {
    var row = backgroundRow(backgroundId);
    if (!row) return null;
    var base = row.daily_wage || 0;
    if (base === 0) return 0; // the indebted/Lone Wolf case: a real ruled zero, never floored up
    var r = (typeof rand === 'number') ? rand : 0.5; // 0.5 = mult 1.0, "with no other modifiers" (the wiki's own worked example: lvl 11 Hedge Knight 91, lvl 21 122)
    var mult = 0.9 + r * 0.2;
    var lvl = Math.max(1, level || 1);
    var wage;
    if (lvl <= 11) {
      wage = base * mult * Math.pow(1.1, lvl - 1);
    } else {
      var wageAt11 = base * mult * Math.pow(1.1, 10);
      wage = wageAt11 * Math.pow(1.03, lvl - 11);
    }
    return toBatteries(wage);
  }

  /* HIRE PRICE: equipment (1.25x its base value, which the caller supplies -- this module does
     not price gear, weapons.json/armor.json's own value field plus toBatteries() does that)
     PLUS a level cost (500 * (level-1)^1.5, the wiki's own formula), both converted to
     batteries. The base hiring cost itself has no per-background wiki number (backgrounds.json
     says so on every row); only the Game Guide's approximate range exists, so this function
     returns that RANGE rather than inventing a false precision. */
  function hireCostRange(backgroundId, level) {
    var row = backgroundRow(backgroundId);
    var wa = TABLE && TABLE.wageAndHire;
    if (!wa) return null;
    var isSwordmaster = row && /swordmaster/i.test(row.id || row.name || '');
    var baseLo = isSwordmaster ? wa.hiringBaseRange.swordmasterException : wa.hiringBaseRange.min;
    var baseHi = isSwordmaster ? wa.hiringBaseRange.swordmasterException : wa.hiringBaseRange.maxApprox;
    var lvl = Math.max(1, level || 1);
    var levelCost = 500 * Math.pow(lvl - 1, 1.5);
    return {
      loBatteries: toBatteries(baseLo + levelCost),
      hiBatteries: toBatteries(baseHi + levelCost),
      levelCostBatteries: toBatteries(levelCost, { allowZero: true }),
      equipmentCostMultiplier: wa.equipmentCostMultiplier
    };
  }

  /* SELL CUT: fraction of worth paid back when the player sells TO a settlement, by tier and
     relation, linearly interpolated between the two sourced points (50 and 100 relation) and
     extrapolated below 50 with the same slope, clamped at 0. This replaces an unsourced flat
     constant with the wiki's own two measured points. */
  function sellFraction(tier, relation) {
    if (!TABLE) return null;
    var curve = TABLE.sellCutByRelationAndSize[tier] || TABLE.sellCutByRelationAndSize.town;
    var rel = (typeof relation === 'number') ? relation : 50;
    var slope = (curve.relation100 - curve.relation50) / 50;
    var frac = curve.relation50 + slope * (rel - 50);
    return Math.max(0, frac);
  }

  /* BUY SIDE: the sourced top-of-bar drop (about 15% of worth) applied as a discount off 1.0,
     scaled by how far relation sits above neutral (50), same interpolation shape as sellFraction
     so a trait or situation multiplier (below) can stack on either side the same way. */
  function buyFraction(relation) {
    if (!TABLE) return null;
    var rel = (typeof relation === 'number') ? relation : 50;
    var drop = TABLE.buySideDropAtTopOfBar.fraction * Math.max(0, Math.min(1, (rel - 50) / 50));
    return Math.max(0, 1 - drop);
  }

  function situationMultiplier(name) {
    if (!TABLE) return null;
    return TABLE.situationMultipliers[name] || null;
  }

  /* CONTRACT PAY: the one real sample (610 after + 10/head, 15 heads, 760 total) scaled
     proportionally by headcount against that sample's own headcount -- NOT a felt per-skull
     curve, which this file refuses to invent (see price_table.json skullScaling.sourced:false). */
  function contractPayBatteries(headcount) {
    if (!TABLE) return null;
    var s = TABLE.contractPay.sampleBatteries;
    var heads = (typeof headcount === 'number') ? headcount : s.sampleHeadcount;
    return {
      base: s.afterCompletion,
      perHead: s.perHead,
      total: s.afterCompletion + s.perHead * heads
    };
  }

  function dailyRate(key) {
    if (!TABLE) return null;
    var r = TABLE.dailyRates[key];
    return r ? r.value : null;
  }

  var API = {
    CROWNS_PER_BATTERY: CROWNS_PER_BATTERY,
    FLOOR_BATTERIES: FLOOR_BATTERIES,
    toBatteries: toBatteries,
    backgroundRow: backgroundRow,
    dailyWageBatteries: dailyWageBatteries,
    hireCostRange: hireCostRange,
    sellFraction: sellFraction,
    buyFraction: buyFraction,
    situationMultiplier: situationMultiplier,
    contractPayBatteries: contractPayBatteries,
    dailyRate: dailyRate,
    _table: TABLE,
    _backgrounds: BACKGROUNDS
  };

  if (HASREQ) module.exports = API;
  if (typeof window !== 'undefined') window.BohemiaPriceTable = API;
})(this);
