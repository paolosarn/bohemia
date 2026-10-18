/* ============================================================================
   BOHEMIA -- THE PLACES WORTH GOING TO (10/9/26, WORLD lane).
   Row [where the god gear is].

   HIS WORDS (Paolo 10/9): "finding good bros and good equipment throughout the
   settlements". The row: the valley's special places as Battle Brothers'
   legendary locations in our skin -- the arsenal off the strip, the two dead fuel
   depots, the granary, the robotics plant, the data fortress, the library -- each
   a place on the map with a GUARD PARTY SIZED BY THE MATH and a REWARD TABLE off
   the best rows of weapons.json and armor.json, found by rumour at the bar.

   ============================================================================
   RULE 12 FIRST, AND IT FOUND A HOLE IN THE PREMISE
   ============================================================================
   ALL SIX PLACES ARE REAL DISTRICTS the generator already makes, so nothing here
   invents a location. But they are NOT GUARANTEED, and a legendary location that
   might not exist is a rumour pointing at nothing. Swept over forty rolled
   valleys:

       arsenal      40/40        datafort     40/40
       robofactory  39/40        fueldepot    38/40
       granary      37/40        LIBRARY      31/40

   *** NINE VALLEYS IN FORTY HAVE NO LIBRARY AT ALL. *** Battle Brothers places
   its legendary locations on every map it generates; ours rolls them and
   sometimes does not. This file does not paper over it: `on()` reports which of
   the six are MISSING from the valley in front of it, by name, so RUN never
   prints a rumour about a building that is not there and FACTIONS never guards
   an empty square. Whether a missing one should be forced onto the map is a
   generator ruling and it is not mine; it is written down and routed.

   ============================================================================
   NOTHING HERE IS A TABLE. THE CHAIN IS: SIZE -> GUARD -> REWARD.
   ============================================================================
   A reward table and a guard table would both be CONTENT, which is his, and both
   would go stale the moment the map rolled differently. So:

   1. *** AND THE FIRST CUT OF THIS RANKED THEM BY SIZE, WHICH MADE FIVE OF THE
      SIX IDENTICAL. *** Measured: the data fortress is six cells and EVERY OTHER
      ONE IS EXACTLY ONE, so size gave five places the same guard of 10 and the
      same three reward rows -- which is [bb places]' own 9/25 defect, a shelf
      that is a function of tier alone, every camp selling the same four things.
      I said then it would never ship again.
      Scarcity across rolled valleys does separate them (library 48/60, granary
      55, fuel depot 58, robotics 59, data fort and arsenal 60/60) but it ranks
      the data fortress near the BOTTOM, which is not what a fortress is. THE
      HONEST READING IS THAT THE MAP DOES NOT ENCODE WHICH OF THESE IS THE BIGGER
      PRIZE, and dressing a prestige order up as a measurement would be the thing
      this lane keeps catching itself doing.
      So the order below IS MINE, it has a real-world reason rather than a coin
      flip, and it is ONE LINE TO CHANGE: an arsenal and a data fortress were
      BUILT TO BE DEFENDED, a robotics plant and a fuel depot were built to be
      secured, a granary and a library were built to be walked into. That is
      REALISM FIRST, it is stated as a default rather than smuggled in as
      arithmetic, and it carries tuned:false like every other felt number.

   2. THE GUARD IS SIZED BY HIS OWN CEILING. He said it himself describing the
      biggest fight Battle Brothers ever gives you: "12 VERSUS 60". A company is
      about twelve men (rule 39d), so sixty is the number at the top, and the
      heaviest place in the valley is the one that earns it. Every other place
      scales down by weight. *** NOT ONE CONSTANT IN THAT IS MINE. ***

   3. THE REWARD IS A SLICE OF THE GEAR POOL BY RANK, not a list. 310 rows exist
      across weapons.json and armor.json, every one with a value. The hardest
      place draws from the top of that pool and a lighter one draws further down,
      so a better-guarded place yields better gear BY CONSTRUCTION and there is no
      table to maintain. If he ever rules that the arsenal is weapons only, that
      is one line of content and the mechanism does not change.

   WHAT IS NOT MINE AND SHIPS EMPTY: WHO guards (the row says FACTIONS owns it,
   and it is derivable from the turf the same way the roaming pool is), and the
   FLOOR on a guard party -- the math gives what it gives and the smallest comes
   out small, which is TUNING's to set, not mine to pick.

     node gates/god_gear_gate.js
   ========================================================================== */
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* THE SIX, EACH ONE A DISTRICT THE GENERATOR REALLY MAKES. The name on the left
     is his; the name on the right is the overmap's. Nothing invents a place. */
  var PLACES = {
    arsenal:     { district: 'arsenal',     his: 'the arsenal one block off the strip' },
    fuel_depot:  { district: 'fueldepot',   his: 'the two dead fuel depots' },
    granary:     { district: 'granary',     his: 'the granary' },
    robotics:    { district: 'robofactory', his: 'the robotics plant' },
    data_fort:   { district: 'datafort',    his: 'the data fortress' },
    library:     { district: 'library',     his: 'the library' }
  };

  /* HIS CEILING, IN HIS OWN WORDS. Rule 79, 10/9: "12 versus 60". A company is
     about twelve men (rule 39d), so sixty is the top of the scale and the
     heaviest place in the valley earns it. */
  var CEILING = {
    guard: 60, against: 12,
    ruling: 'Paolo 10/9, rule 79: "12 versus 60" is the biggest fight Battle Brothers gives you',
    tuned: false
  };

  /* *** MINE, STATED, AND ONE LINE TO CHANGE. *** How hard a place is to crack,
     most defended to least, because of what the building WAS before the money
     died -- not because of anything the map says, which is measured below as
     saying nothing (five of the six are one cell each). */
  var DEFENDED = {
    data_fort: 6, arsenal: 5, robotics: 4, fuel_depot: 3, granary: 2, library: 1
  };
  var DEFENDED_RULING = {
    ruling: 'WORLD 10/9, a stated default and not a measurement: an arsenal and a data fortress were BUILT to be defended, a robotics plant and a fuel depot to be secured, a granary and a library to be walked into. The map does not rank them -- five of the six are one cell each.',
    tuned: false, mine: true
  };

  /* *** SHIPS EMPTY. *** Who guards a place is FACTIONS', by the row's own words.
     What a place is FOR, beyond the gear its rank earns, is content. */
  var GUARDED_BY = {};
  var FLAVOUR = {};

  var NOT_ON_THIS_VALLEY = 'NOT_ON_THIS_VALLEY';
  var NO_MAP = 'NO_MAP';
  var NO_GEAR = 'NO_GEAR';
  var NO_RULING = 'NO_RULING';

  function names() { var o = []; for (var k in PLACES) o.push(k); return o; }

  /* ---- WHERE THE SIX ARE ON ONE VALLEY ----------------------------------- */
  function on(m, size) {
    var n = size || 96;
    if (!m || typeof m.at !== 'function') return { known: false, why: NO_MAP };
    var found = {}, missing = [];
    for (var k in PLACES) found[k] = { cells: [], weight: 0 };
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var c = m.at(x, y);
      if (!c || !c.district) continue;
      for (var p in PLACES) {
        if (PLACES[p].district !== c.district) continue;
        found[p].cells.push([x, y]);
        found[p].weight++;
      }
    }
    for (var q in PLACES) if (!found[q].weight) missing.push(q);
    return { known: true, places: found, missing: missing,
             here: names().filter(function (p) { return found[p].weight > 0; }),
             because: missing.length
               ? 'the generator rolls these and does not guarantee them; a rumour about a missing one would point at nothing'
               : null };
  }

  /* ---- THE GUARD, OFF HIS CEILING ---------------------------------------- */
  function guards(spot) {
    if (!spot || !spot.known) return { known: false, why: NO_MAP };
    var top = 0, p;
    for (p in DEFENDED) if (DEFENDED[p] > top) top = DEFENDED[p];
    var anyHere = false;
    for (p in spot.places) if (spot.places[p].weight) anyHere = true;
    if (!anyHere) return { known: false, why: NOT_ON_THIS_VALLEY,
                           because: 'not one of the six is on this valley' };
    var out = {};
    for (p in spot.places) {
      var w = spot.places[p].weight;
      if (!w) continue;
      var d = DEFENDED[p] || 1;
      out[p] = { cells: w, defended: d,
                 guard: Math.round(CEILING.guard * (d / top)),
                 ofTop: +(d / top).toFixed(3) };
    }
    return { known: true, ceiling: CEILING, order: DEFENDED,
             orderIs: DEFENDED_RULING, by: out, tuned: false };
  }

  /* ---- THE REWARD: A SLICE OF THE POOL BY RANK, NEVER A LIST -------------- */
  /* The pool is handed in, so this file opens no data file and holds no gear. */
  function rewardOf(o) {
    o = o || {};
    var pool = o.pool, guard = o.guard, ceiling = (o.ceiling || CEILING.guard), take = o.take || 3;
    if (!Array.isArray(pool) || !pool.length)
      return { known: false, why: NO_GEAR,
               because: 'the gear pool is handed in from weapons.json and armor.json; this file holds no gear of its own' };
    if (typeof guard !== 'number' || guard <= 0)
      return { known: false, why: 'NO_GUARD' };
    var ranked = pool.slice().sort(function (a, b) { return (b.value || 0) - (a.value || 0); });
    /* THE HARDEST PLACE DRAWS FROM THE TOP. A place guarded at half the ceiling
       starts half way down the pool, so better guarded is better gear by
       construction and nothing is authored. */
    var start = Math.round((1 - (guard / ceiling)) * (ranked.length - take));
    if (start < 0) start = 0;
    if (start > ranked.length - take) start = Math.max(0, ranked.length - take);
    return { known: true, guard: guard, from: start,
             rows: ranked.slice(start, start + take),
             derived: 'a slice of the ranked pool, positioned by the guard; no reward table exists' };
  }

  function guardedBy(place) {
    if (!Object.prototype.hasOwnProperty.call(PLACES, place))
      return { known: false, why: 'NOT_A_PLACE', place: place, are: names() };
    if (!Object.prototype.hasOwnProperty.call(GUARDED_BY, place))
      return { known: false, why: NO_RULING, table: 'GUARDED_BY', place: place,
               because: 'who guards a place is FACTIONS\', by the row\'s own words, and is derivable from the live turf' };
    return { known: true, place: place, by: GUARDED_BY[place] };
  }

  var API = {
    PLACES: PLACES, CEILING: CEILING, DEFENDED: DEFENDED, DEFENDED_RULING: DEFENDED_RULING,
    GUARDED_BY: GUARDED_BY, FLAVOUR: FLAVOUR,
    NOT_ON_THIS_VALLEY: NOT_ON_THIS_VALLEY, NO_MAP: NO_MAP, NO_GEAR: NO_GEAR,
    NO_RULING: NO_RULING,
    names: names, on: on, guards: guards, rewardOf: rewardOf, guardedBy: guardedBy
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.BohemiaGodGear = API;
})(typeof self !== 'undefined' ? self : this);
