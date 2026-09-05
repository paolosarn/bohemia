// BOHEMIA HOUSING — somebody lives in what you built.
// (9/5/26, LIFE + CITY lane. VAMILY job [people housed] / HOUSING: "residents per
//  plot, capacity, a population number that moves; the other half of the 7/26
//  economy law, zero built".)
//
// WHAT WAS MEASURED FIRST, ON THE REAL SURFACE, BEFORE A LINE OF THIS WAS WRITTEN:
// build a suburb on empty desert and the valley's census does not move. 297 people
// before, 297 after, and headsAt() on the plot you just built answers 0 both times.
// It is not a bug in the population module -- it is the module answering a
// different question. Everything it knows comes from the SEED: zoneAt() surveys a
// 4x4 neighbourhood, rolls the ruled three-zone share against a hash, and a quarter
// of the map is 'empty' ON PURPOSE (laws/BOHEMIA_ADDENDUM_HOW_MANY_PEOPLE_7_29_26).
// So THE POPULATION IS A FUNCTION OF THE SEED, NOT OF WHAT THE PLAYER BUILDS, and
// there was no path at all from "I built a house" to "somebody lives in it".
//
// THE 7/26 LAW IS THE OTHER HALF AND IT IS LOCKED: "BUILDINGS: house people or
// produce one of the three. That's the economy." Production shipped this round.
// This is the half that was still zero.
//
// *** HOUSING DOES NOT CREATE PEOPLE. IT HOUSES THEM. ***
// This is the whole design decision and it is the REALISTIC answer rather than the
// convenient one, which is why it is allowed to be mine. His 7/29 ruling is LOCKED
// and it is not a detail: THE POPULATION IS THE FOOD CARRYING CAPACITY -- "mfs
// gotta eat and drink" -- ~65,000 in the valley, ~300 walkable bodies, and the
// research behind it found the food supply cannot meaningfully grow in a lifetime
// (the valley is caliche; soil is BUILT at ~20 acres a year). A city builder where
// putting up flats makes new people appear would break that law quietly, in the
// direction every city builder drifts. So:
//
//   CAPACITY   how many your buildings COULD house      (grows when you build)
//   RESIDENTS  how many actually live in what you built (capped by the valley)
//
// People move into what you build FROM the valley they were already in. That costs
// the food ceiling nothing, it is what actually happens when better housing appears
// in a place people already live, and it gives the CENTURY RULE the number it has
// been missing: how many the dynasty housed, act over act.
//
// HOW MANY PER BUILDING, AND WHY IT IS NOT A GUESS. HOUSEHOLD_MEAN = 2.2 is already
// in engine/bohemia_population.js, already researched, already the number the rest
// of the valley is counted with. ONE BUILDING HOUSES ONE HOUSEHOLD, and the mean is
// applied to the TOTAL rather than rounded per building -- ten buildings house 22
// people, not 20, because rounding 2.2 down at every plot would quietly delete a
// fifth of everybody. WHICH types house anybody is not typed here either: it is
// BohemiaPopulation.RESIDENTIAL, the map the whole valley is already counted from.
// [PENDING Paolo: whether an apartment block should hold more than a trailer.]
// Nothing here invents a district, a rate or a person.
//
// REUSE CHECK: cooks NO pixels, adds NO second list of building types, and does not
// count plots itself -- BohemiaProduction.placed() already answers "one entry per
// BUILDING, spans counted once", which is the same unit demolish and produce() use.
// A third opinion about what a building is would be the bug this lane has now
// written three post-mortems about.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  function POP() {
    if (HASREQ) { try { return require('./bohemia_population.js'); } catch (e) { return null; } }
    return root.BohemiaPopulation || (typeof BohemiaPopulation !== 'undefined' ? BohemiaPopulation : null);
  }
  function PROD() {
    if (HASREQ) { try { return require('./bohemia_production.js'); } catch (e) { return null; } }
    return root.BohemiaProduction || (typeof BohemiaProduction !== 'undefined' ? BohemiaProduction : null);
  }

  var RULING = '7/26 BUILDINGS HOUSE PEOPLE OR PRODUCE + 7/29 THE POPULATION IS THE FOOD CEILING';
  var CAP = {};                      /* buildingId -> {people, ruling, tuned:false} */

  function has(o, k) { return o && Object.prototype.hasOwnProperty.call(o, k); }

  /* ---------------------------------------------------------------------------
     1. WHICH BUILDINGS HOUSE ANYBODY, READ AND NEVER TYPED.
     --------------------------------------------------------------------------- */
  function installCap() {
    var P = POP();
    if (!P || !P.RESIDENTIAL) return { installed: 0, kept: 0, types: 0 };
    var t = Object.keys(P.RESIDENTIAL), added = 0, kept = 0;
    for (var i = 0; i < t.length; i++) {
      if (has(CAP, t[i])) { kept++; continue; }          /* his ruling always wins */
      CAP[t[i]] = { people: P.HOUSEHOLD_MEAN, ruling: RULING, tuned: false };
      added++;
    }
    return { installed: added, kept: kept, types: t.length };
  }

  /* A building that is not residential houses nobody, and that is an ANSWER rather
     than a gap: a solar farm having no beds is not an unruled number. */
  function capacityOf(type) { return has(CAP, type) ? CAP[type].people : 0; }

  /* ---------------------------------------------------------------------------
     2. WHAT HE HAS BUILT. One entry per BUILDING, borrowed whole from production so
        a 4-lot block is one household here exactly as it is one payout there.
     --------------------------------------------------------------------------- */
  function homes(edits) {
    var R = PROD();
    if (!R) return [];
    var b = R.placed(edits) || [], out = [];
    for (var i = 0; i < b.length; i++) if (capacityOf(b[i].type) > 0) out.push(b[i]);
    return out;
  }

  function capacity(edits) {
    var h = homes(edits), n = 0;
    for (var i = 0; i < h.length; i++) n += capacityOf(h[i].type);
    return n;                        /* the mean is applied to the TOTAL, not per plot */
  }

  /* ---------------------------------------------------------------------------
     3. THE NUMBER THAT MOVES. Residents are capped by the valley, because housing
        does not create people, and the valley's size is the food ceiling he ruled.
     --------------------------------------------------------------------------- */
  /* NULL MEANS "COULD NOT MEASURE", AND IT IS NOT THE SAME AS ZERO. The first cut
     returned 0 for both, and a gate caught what that costs: with no world to census,
     "the valley holds nobody" and "I have no idea how big the valley is" became the
     same answer, the cap fell through, and forty blocks of flats housed eighty-eight
     people out of a valley of none. THE LAW MUST NOT BE BREAKABLE BY A MEASUREMENT
     FAILURE, so an unmeasurable valley houses nobody rather than everybody. */
  function valleyPeople(om, POWER, seed, overN) {
    var P = POP();
    if (!P || !om || typeof om.at !== 'function') return null;
    try {
      var c = P.census(om, POWER, seed, overN || om.n || 96);
      return (c && typeof c.people === 'number') ? c.people : null;
    } catch (e) { return null; }
  }

  function report(om, POWER, seed, edits, overN) {
    var cap = capacity(edits);
    var valley = valleyPeople(om, POWER, seed, overN);
    /* A WHOLE NUMBER OF PEOPLE, because a person is a whole person on every surface
       (the population module's own rule, and the reason it rolls a hash against a
       weight rather than rounding a fraction at every plot). */
    if (valley === null) {
      return { buildings: homes(edits).length, capacity: cap, residents: 0,
               valley: null, capped: false, reason: 'NO_VALLEY' };
    }
    var res = Math.floor(cap + 0.0001);
    var capped = res > valley;
    if (capped) res = valley;
    return { buildings: homes(edits).length, capacity: cap, residents: res,
             valley: valley, capped: capped };
  }

  /* ---------------------------------------------------------------------------
     4. RESIDENTS PER PLOT -- and the honest part is WHICH QUESTION EACH PLOT CAN
        ANSWER, because the two kinds of ground know different things.

     A PLOT HE BUILT is his building, so its household is its own: capacityOf().
     GENERATED GROUND is counted by the population module, and that module's number
     is a NEIGHBOURHOOD number -- headsAt() takes a cell, resolves it to its 4x4
     block and returns the block's heads. Reporting that as "people on this plot"
     would claim thirteen residents sixteen times over for one settlement of
     thirteen. So it is returned as what it is, `scope:'block'`, and the surface
     says "on this block". A number is not honest until its UNIT is.
     --------------------------------------------------------------------------- */
  function builtAt(edits, x, y) {
    var R = PROD();
    if (!R || !edits) return null;
    var b = R.placed(edits) || [];
    for (var i = 0; i < b.length; i++) {
      var e = b[i];
      if (x >= e.x && x < e.x + e.w && y >= e.y && y < e.y + e.h) return e;
    }
    return null;
  }

  function residentsAt(om, POWER, seed, edits, x, y) {
    var mine = builtAt(edits, x, y);
    if (mine) return { scope: 'plot', yours: true, type: mine.type,
                       people: Math.round(capacityOf(mine.type)) };
    var P = POP();
    if (!P || !om) return null;
    var n = 0;
    try { n = P.headsAt(om, POWER, x, y, seed) || 0; } catch (e) { return null; }
    return { scope: 'block', yours: false, people: n };
  }

  var API = { RULING: RULING, CAP: CAP,
              installCap: installCap, capacityOf: capacityOf,
              homes: homes, capacity: capacity, valleyPeople: valleyPeople,
              report: report, builtAt: builtAt, residentsAt: residentsAt };
  if (HASREQ) module.exports = API;
  root.BohemiaHousing = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
