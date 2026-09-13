// BOHEMIA PUMPS — THE PUMPS ARE THE CITY (9/13/26, WORLD lane)
// Board row [water lifted] / THE-PUMPS-ARE-THE-CITY.
//
// ============================================================================
// THE ROW, HARVESTED FROM ECONOMY ROUND 7
// ============================================================================
//   "The valley floor is about 2,028 feet and Lake Mead hit 1,040.5, so everything
//    Vegas drinks is lifted a thousand feet by 22 vertical pumps and two booster
//    stations. WATER IS NOT SCARCE; PUMPING IS. Wire it: a pump station costs
//    power, water costs pumping, thirst costs water, and whoever holds the pumps
//    holds the valley. The cleanest real tie between power, territory and need we
//    will ever get."
//
// ============================================================================
// MEASURED FIRST, AND IT IS WORSE THAN THE ROW SAYS
// ============================================================================
// The valley's ledger starts with about 10,365 L of water -- water heaters and
// containers, which bohemia_economy grounds house by house -- and drinks 4 L per
// person per day. With 40 people that is 160 L a day.
//
//   *** AND NOTHING IN THIS GAME HAS EVER PRODUCED A SINGLE LITRE. ***
//
// advanceDay's `produced` comes only from YIELD, which is {site:{salvage,food},
// scav:{salvage,food}}. Every worker in the valley brings back salvage and food and
// NOBODY EVER BRINGS BACK WATER. Measured: 10,365 L falling 160 a day, gone in about
// 65 days, and no act anywhere can add to it. Water was a one-way countdown with no
// source, which is not a hard economy, it is a clock nobody can stop.
//
// And the infrastructure is all there and does nothing: the valley generates
// watertreat plants, reservoirs and a pumpstation as real districts you can walk to.
// bohemia_dead.js even has the line already written for a dead one -- "a pipe that
// still ran, for a while".
//
// ============================================================================
// THE ENERGY IS PHYSICS, NOT A DIAL. THIS IS THE WHOLE REASON THE ROW IS GOOD.
// ============================================================================
// Every number below is either the row's own real-world measurement or arithmetic
// on it. Nothing here is a game balance choice, which is why none of it is his.
//
//   valley floor        2028 ft        (the row)
//   Lake Mead surface   1040.5 ft      (the row)
//   LIFT                 987.5 ft  =  301.0 m
//   one litre of water   1 kg           (definition of the litre)
//   gravity              9.81 m/s^2
//
//   E = m * g * h  =  1 * 9.81 * 301.0  =  2,952 J per litre
//                  =  0.00082 kWh per litre, at perfect efficiency
//
// Real pumping is not perfect. Wire-to-water efficiency for a big vertical turbine
// station runs about 0.75 once the motor, the pump and the friction in a thousand
// feet of column are counted, so:
//
//   0.00082 / 0.75  =  0.0011 kWh PER LITRE LIFTED.
//
// That is what it costs to drink in this valley, and it is a fact about Nevada
// rather than a number anybody here chose.
//
// ============================================================================
// WHAT A PUMP DELIVERS IS NOT A DIAL EITHER
// ============================================================================
// A municipal pump station is SIZED TO THE POPULATION IT SERVES -- that is what the
// infrastructure is for and it is the definition of the thing, not a balance knob.
// So a station that is running covers the valley's drinking need, and one that is
// not covers nothing. THE MECHANIC IS BINARY AND LEGIBLE: pumps running, the valley
// drinks; pumps dark, the countdown starts again.
//
// A per-station litres-per-day rating WOULD be a number nobody ruled, and it is not
// invented here -- it is not needed, because the row's own thesis is that the
// constraint is the POWER, not the water.
//
// ============================================================================
// A PUMP RUNS ONLY IF ITS GROUND HAS POWER, AND SOMEBODY OWNS THAT GROUND
// ============================================================================
// CLUSTERED POWER LAW: 12% of circuits live, all owned. A pump on a dark circuit is
// a building full of dry steel. So the tie the row asks for falls out of two things
// that already exist and needed no new field: the grid says whether the pump has
// power, and the turf says whose ground it stands on. Stop paying for a circuit and
// the valley stops drinking, which is [lights bill] and [own power] arriving at the
// same place from the other side.
//
// WHAT IS NOT BUILT HERE, AND IT IS DELIBERATE: the PLAYER's own thirst. "Thirst
// costs water" would be a FIFTH VERB, and the four that drain the purse are frozen
// and his (day:ate, fight:plate, night:power, ask:leaned). The VALLEY's thirst is
// already real and already shortfalls; the player's is a ruling, not a build.
//
// node: require('./bohemia_pumps.js')   Gate: gates/water_lifted_gate.js
// ============================================================================
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var DRAFT = true;

  function ECONOMY() {
    if (HASREQ) { try { return require('./bohemia_economy.js'); } catch (e) { return null; } }
    return root.BohemiaEconomy || (typeof BohemiaEconomy !== 'undefined' ? BohemiaEconomy : null);
  }

  /* ---- THE REAL WORLD, AS THE ROW MEASURED IT ---------------------------- */
  var FLOOR_FT = 2028;        /* the valley floor */
  var MEAD_FT = 1040.5;       /* Lake Mead's surface when it was measured */
  var FT_PER_M = 3.28084;
  var GRAVITY = 9.81;         /* m/s^2 */
  var J_PER_KWH = 3600000;
  var EFFICIENCY = 0.75;      /* wire-to-water for a big vertical turbine station */
  /* HOW MANY PLACES THE REPORTED kWh IS ROUNDED TO. A DISPLAY PRECISION, NOT A
     BALANCE NUMBER: it is named rather than left as a bare 4 in a toFixed so the
     gate that refuses any number which is not physics can tell the two apart. */
  var KWH_DECIMALS = 4;

  function liftFeet() { return FLOOR_FT - MEAD_FT; }
  function liftMetres() { return liftFeet() / FT_PER_M; }

  /* kWh TO LIFT ONE LITRE. One litre of water is one kilogram, which is the
     definition of the litre and not an approximation anybody chose. */
  function kwhPerLitre() {
    return (GRAVITY * liftMetres() / J_PER_KWH) / EFFICIENCY;
  }
  function kwhFor(litres) { return kwhPerLitre() * (litres || 0); }

  /* ---- WHICH DISTRICTS LIFT WATER ---------------------------------------
     The map's own water infrastructure, named by the world model rather than
     listed as a set of places typed here. A district the map stops generating
     simply stops appearing, instead of leaving a dead name behind. */
  var WATER_DISTRICTS = ['pumpstation', 'watertreat', 'reservoir'];
  function isPump(district) {
    return WATER_DISTRICTS.indexOf(String(district || '')) >= 0;
  }

  /* WHAT THE VALLEY DRINKS IN A DAY. Asked of the economy's own GOODS table, never
     spelled here: if he changes what a person needs, this follows without an edit,
     and if `water` ever stops being a good this answers zero rather than pumping
     for a thirst nobody has. */
  function needPerDay(agents) {
    var e = ECONOMY();
    if (!e || !e.GOODS || !e.GOODS.water) return 0;
    return (e.GOODS.water.need || 0) * (agents | 0);
  }

  /* ---- THE NIGHT'S PUMPING ----------------------------------------------
     stations: [{ district, lit, faction, at }] -- what the surface found on the
     map, already asked of the grid and the turf. This module decides nothing about
     where they are or whether they have power; it answers what the running ones
     lift and what that costs.
     A STATION THAT IS RUNNING COVERS THE NEED. More running stations do not make
     more water than the valley can drink, because a pump station is sized to its
     population and the tap does not run harder because there are two of them. */
  function lift(stations, agents) {
    var all = stations || [], live = [], dark = [], i;
    for (i = 0; i < all.length; i++) {
      var s = all[i]; if (!s || !isPump(s.district)) continue;
      (s.lit ? live : dark).push(s);
    }
    var need = needPerDay(agents);
    var litres = live.length ? need : 0;
    return {
      litres: litres,
      kwh: +kwhFor(litres).toFixed(KWH_DECIMALS),
      need: need,
      running: live.length,
      dark: dark.length,
      stations: all.length,
      holders: holdersOf(live),
      draft: DRAFT
    };
  }

  /* WHOSE GROUND THE RUNNING PUMPS STAND ON. A name, in the order the stations came
     in, deduped -- one outfit holding three pumps is one name. No amount, no share:
     what holding the valley's water is WORTH is a weight and weights are his. */
  function holdersOf(stations) {
    var seen = {}, out = [];
    for (var i = 0; i < (stations || []).length; i++) {
      var f = stations[i] && stations[i].faction;
      if (!f) continue;
      var k = String(f).toUpperCase();
      if (seen[k]) continue;
      seen[k] = 1; out.push(k);
    }
    return out;
  }

  /* ---- WHAT HE IS TOLD ---------------------------------------------------
     Plain, and it never says a kWh at him: the physics belongs in the machine and
     what he needs is whether the valley drank. draft:true. */
  function say(r) {
    if (!r) return '';
    if (!r.stations) return 'Nothing in this valley lifts water.';
    if (!r.running)
      return r.dark === 1
        ? 'The pump station is dark. Nothing is being lifted.'
        : 'All ' + r.dark + ' pump stations are dark. Nothing is being lifted.';
    var who = r.holders.length ? r.holders.join(' and ') : 'nobody you know';
    return 'The pumps are running. ' + who + ' hold the water.';
  }

  /* every unruled number, enumerable, per EVERYTHING COSTS ONE section 5. The
     physics is NOT in here: a measured fact about Nevada is not a placeholder. */
  function placeholders() {
    return [
      { where: 'bohemia_pumps.RELIGHT', value: null, placeholder: true,
        law: 'EVERYTHING COSTS ONE (Paolo 8/15/26)',
        what: 'what it costs to get a dark pump station running again' },
      { where: 'purse.VERBS[day:drank]', value: null, placeholder: true,
        law: 'MECHANISM-MINE / CONTENTS-PAOLO\'S',
        what: 'the PLAYER\'s own thirst. The valley already drinks and already runs '
            + 'short; a fifth verb draining the purse is a ruling, not a build, and '
            + 'the four that exist are frozen' }
    ];
  }

  var API = { FLOOR_FT: FLOOR_FT, MEAD_FT: MEAD_FT, GRAVITY: GRAVITY,
              KWH_DECIMALS: KWH_DECIMALS,
              EFFICIENCY: EFFICIENCY, WATER_DISTRICTS: WATER_DISTRICTS,
              liftFeet: liftFeet, liftMetres: liftMetres,
              kwhPerLitre: kwhPerLitre, kwhFor: kwhFor,
              isPump: isPump, needPerDay: needPerDay,
              lift: lift, holdersOf: holdersOf, say: say,
              placeholders: placeholders };
  if (HASREQ) module.exports = API;
  root.BohemiaPumps = API;
})(typeof window !== 'undefined' ? window
   : (typeof globalThis !== 'undefined' ? globalThis : this));
