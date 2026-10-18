// BOHEMIA STASH -- WHAT THE BAR'S SIX COUNTS COST A DAY (10/9/26, ECONOMY)
// VAMILY [what the stash is], rule 74 top row. "The six counts' rules from the wiki's
// provisions page ... in a data file the clock reads; the bar's six move for real reasons."
//
// Pure functions over two sources: records/target/bb/stash_rates.json (terrain food
// multiplier, tool repair rate, medicine and ammo caps and per-shot costs) and
// records/target/bb/price_table.json's dailyRates block (the base food/day, tool exchange
// rate and medicine/day COMBAT's sibling row already shipped, read here rather than
// re-typed -- REUSE-FIRST). This file computes nothing price-shaped; a day's SPEND is a
// COUNT consumed, never a battery charge (buying more food/tools/meds/ammo to refill the
// stash is the price table's job, read engine/bohemia_pricetable.js for that half).
//
// MECHANISM-MINE / CONTENTS-PAOLO'S: every number this file touches carries its source in
// the JSON beside it. This file does arithmetic only; it invents no rate.
//
// node: require('./bohemia_stash.js')   Gate: gates/stash_gate.js
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  function loadJSON(path) {
    if (!HASREQ) return null;
    try { return require(path); } catch (e) { return null; }
  }
  var RATES = loadJSON('../records/target/bb/stash_rates.json');
  var PRICES = loadJSON('../records/target/bb/price_table.json');

  /* FOOD: baseline 2/man/day (price_table.json dailyRates.foodPerManPerDay) times the
     terrain multiplier (1.0 plains to 2.0 mountains). A party standing still still eats --
     this function takes a terrain, never a "travelling or not" flag, matching
     BOHEMIA_ECONOMY_DAY_53's own finding that BB's 2/day is flat across march vs camp. */
  function foodNeededPerDay(headcount, terrain) {
    if (!PRICES || !RATES) return null;
    var base = PRICES.dailyRates.foodPerManPerDay.value;
    var mult = RATES.foodByTerrain[terrain];
    if (typeof mult !== 'number') mult = RATES.foodByTerrain.plains; // unknown terrain reads as plains, never silently zero
    return (headcount || 0) * base * mult;
  }

  /* Eats the food that spoils soonest first (rule 47, confirmed again by this same wiki
     page). Given a shelf of {kind, count, daysUntilSpoiled}, returns the kind to consume
     today. A shelf with nothing on it returns null -- a caller's problem, not this
     function's to paper over. */
  function soonestToSpoil(shelf) {
    if (!shelf || !shelf.length) return null;
    var sorted = shelf.slice().sort(function (a, b) { return a.daysUntilSpoiled - b.daysUntilSpoiled; });
    return sorted[0].kind;
  }

  /* TOOLS: how many tool POINTS a given amount of lost durability costs, at the wiki's
     15-durability-per-point exchange (price_table.json dailyRates.toolDurabilityRepairedPerTool),
     and how many real-time ticks that repair takes at the stated rate (3 durability/hour,
     doubled at a camp, +33% with a blacksmith). */
  function toolPointsForDurability(durabilityLost) {
    if (!PRICES) return null;
    var per = PRICES.dailyRates.toolDurabilityRepairedPerTool.value;
    return Math.ceil((durabilityLost || 0) / per);
  }
  function hoursToRepair(durabilityLost, opts) {
    if (!RATES) return null;
    opts = opts || {};
    var rate = RATES.toolRepair.ticksPerHour;
    if (opts.atCamp) rate *= RATES.toolRepair.campMultiplier;
    if (opts.hasBlacksmith) rate *= (1 + RATES.toolRepair.blacksmithBonus);
    return (durabilityLost || 0) / rate;
  }

  /* MEDICINE: one point per injury per day, period -- not per man, per OPEN injury. Lost
     health that is not a standing injury heals on its own and costs nothing (the wiki's
     own distinction, kept rather than flattened). */
  function medicineNeededPerDay(openInjuryCount) {
    if (!RATES) return null;
    return (openInjuryCount || 0) * RATES.medicine.pointsPerInjuryPerDay;
  }

  /* AMMO: cost of one shot by weapon class, and whether a bundle (50 points) covers a
     given count of shots of that class. */
  function ammoCostForShot(shotKind) {
    if (!RATES) return null;
    var table = RATES.ammo.costPerShot;
    if (shotKind === 'arrow' || shotKind === 'bolt') return table.arrowOrBolt;
    if (shotKind === 'handgonne') return table.handgonne;
    if (shotKind === 'thrown' || shotKind === 'fireLance') return table.throwingWeaponOrFireLance;
    return null;
  }
  function shotsPerBundle(shotKind) {
    var cost = ammoCostForShot(shotKind);
    if (!cost) return null;
    return Math.floor(RATES.ammo.bundlePoints / cost);
  }

  /* CARRY CAPS, every stash good, by difficulty. Returns null for a good with no cap on
     the sourced pages (food and batteries carry none that either wiki page states). */
  function carryCap(good, difficulty) {
    if (!RATES) return null;
    var band = (difficulty === 'beginner') ? 'beginner' : 'veteranAndExpert';
    if (good === 'medicine') return RATES.medicine.carryCap[band];
    if (good === 'ammo') return RATES.ammo.carryCap[band];
    if (good === 'tools') return RATES.toolRepair.carryCap[band];
    return null;
  }

  /* A DAY'S SPEND ON THE ROAD -- the one worked example the VOTE row asks for. Counts
     consumed, never battery prices; a stationary company spends the same food and medicine
     (terrain and injuries do not care whether you moved) and zero ammo (nothing fired). */
  function daySpend(party) {
    party = party || {};
    return {
      food: foodNeededPerDay(party.headcount, party.terrain || 'plains'),
      medicine: medicineNeededPerDay(party.openInjuries),
      ammo: 0, // a day of travel fires nothing; a fight's own ammo cost is COMBAT's, not this file's
      tools: 0 // tools are spent on REPAIR, an event, not a daily tax
    };
  }

  var API = {
    foodNeededPerDay: foodNeededPerDay,
    soonestToSpoil: soonestToSpoil,
    toolPointsForDurability: toolPointsForDurability,
    hoursToRepair: hoursToRepair,
    medicineNeededPerDay: medicineNeededPerDay,
    ammoCostForShot: ammoCostForShot,
    shotsPerBundle: shotsPerBundle,
    carryCap: carryCap,
    daySpend: daySpend,
    _rates: RATES,
    _prices: PRICES
  };

  if (HASREQ) module.exports = API;
  if (typeof window !== 'undefined') window.BohemiaStash = API;
})(this);
