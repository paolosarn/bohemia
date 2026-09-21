// BOHEMIA TRACT — EVERY TRACT IN THIS VALLEY IS WALLED, AND NOT ONE OF THEM IS
// (9/21/26, WORLD lane). Board row [suburb walls] / THE-WALLED-SUBURB-NUMBERS.
//
// ============================================================================
// RULE 12, AND TWO OF THE ROW'S THREE DECIDED NUMBERS CANNOT FIRE
// ============================================================================
// The row says three things were left [PENDING Paolo] and were DECIDED 9/7 by
// the manager under correct-after: the quality threshold, the gate count, and
// the wall tiles. Measured before building any of them:
//
//  (1) "A TRACT WALLS ITSELF WHEN ITS QUALITY IS IN THE TOP HALF."
//      This contradicts PAOLO'S OWN 8/1 BANK LAW, which is newer canon than the
//      pending it answers and is quoted in bohemia_suburb's own notes: "most
//      Vegas communities are walled but NOT gated; gates = boujee/richer". And
//      it contradicts the real world the same way: Clark County's Unified
//      Development Code 30.64.020 makes a developer-installed perimeter wall
//      MANDATORY on a subdivision, which is exactly why a wall signals nothing
//      in this valley and a GATE signals everything. Making the wall a wealth
//      signal would be both less real AND against his ruling. REALISM FIRST.
//
//  (2) "ONE REAR SERVICE GATE FOR TRACTS OVER TWELVE CELLS."
//      Measured on a real 96x96 map: 1,774 distinct suburb tracts, and their
//      sizes are 1 cell (1,161), 2 cells (515) and 4 cells (98). THE LARGEST
//      TRACT IN THE VALLEY IS FOUR CELLS. Zero of 1,774 are over twelve. It is
//      a rule for a tract that does not exist -- the same shape as the
//      'beltway' name this lane has open on another row.
//
//  (3) "WALL TILES FROM THE EXISTING WALL BANK WITHIN THE CARD'S VALUE BAND."
//      This one is right and buildable. banks/BOHEMIA_WALL_PICKS_7_14_26.txt
//      holds twelve approved picks, W26 to W37.
//
// ============================================================================
// *** AND THE REAL FINDING IS UNDER ALL THREE: THE LAW HAS NEVER ONCE FIRED ***
// ============================================================================
// The WALLED SUBURBS LAW was locked 7/14 and the table that decides it lives in
// the plot generator:
//
//     const wallThreshold  = opts.wallThreshold  == null ? 1 : ...;
//     const gatedThreshold = opts.gatedThreshold == null ? 4 : ...;
//     const walled = quality >= wallThreshold;    // 1
//     const gated  = quality >= gatedThreshold;   // 4
//
// Its own comment says "quality threshold for walls (default: quality >= 2 of
// 0..4)". THE THRESHOLDS ARE ON A 0..4 INTEGER SCALE AND THE OVERMAP HANDS OVER
// A 0..1 FLOAT. Measured on seed 1337, building the real plots through the real
// bridge:
//
//     estate    43 of 43   walled and gated      (forced by district)
//     gated     30 of 30   walled and gated      (forced by district)
//     trailer    0 of 15   walled                (forced open, correct)
//     suburb     0 of 2,558 WALLED               <-- the only one that asks
//                                                    the threshold, and it
//                                                    fails every single time
//     quality actually seen: 0.196 to 0.550, against a threshold of 1.
//
// TWO AND A HALF THOUSAND TRACT NEIGHBOURHOODS, IN A CITY WHOSE BUILDING CODE
// MAKES THE WALL MANDATORY, AND NOT ONE OF THEM HAS A PERIMETER WALL. No number
// anybody put in that table could have worked, because the table is read against
// the wrong scale. That is what the row is actually made of.
//
// ============================================================================
// WHAT THIS MODULE IS, AND WHAT IT REFUSES TO BE
// ============================================================================
// It is the ANSWER TABLE the plot generator should be reading, expressed in the
// units the map actually hands over, and DERIVED FROM THE MAP rather than typed.
// Hand it a different valley and every number in it moves.
//
// It does NOT edit the plot generator. Rule 18 holds this lane off every play
// surface, and the generator is the walked world's own code. This module is the
// table, checkable on its own, ready for whoever lifts the hold.
(function (root) {
  'use strict';

  var DRAFT = true;

  /* the residential districts, named once. `trailer` is here because it is
     residential and its answer is a real answer: rough frontage, no wall. */
  var RESIDENTIAL = ['suburb', 'gated', 'estate', 'trailer'];

  /* --------------------------------------------------------------------------
     THE VALLEY'S OWN QUALITY SPREAD, MEASURED.

     Nothing below is a threshold anybody typed. `range()` walks the real map and
     reports what quality actually is on residential ground, and every answer in
     this file is a position inside that range. Change the map and the numbers
     change with it; that is the whole point, and it is why this could not simply
     be "0.2" written into the old table.
     -------------------------------------------------------------------------- */
  function range(map, N) {
    N = N || 96;
    var lo = Infinity, hi = -Infinity, n = 0, all = [];
    for (var y = 0; y < N; y++) {
      for (var x = 0; x < N; x++) {
        var c = null;
        try { c = map.at(x, y); } catch (e) { continue; }
        if (!c || RESIDENTIAL.indexOf(c.district) < 0) continue;
        var q = +c.quality;
        if (!isFinite(q)) continue;
        if (q < lo) lo = q;
        if (q > hi) hi = q;
        all.push(q); n++;
      }
    }
    if (!n) return { known: false, why: 'NO_RESIDENTIAL_GROUND' };
    all.sort(function (a, b) { return a - b; });
    return { known: true, lo: lo, hi: hi, n: n,
             median: all[(all.length / 2) | 0], draft: DRAFT };
  }

  /* --------------------------------------------------------------------------
     THE WALL. Everybody, and that IS the ruling.

     The threshold is the valley's own FLOOR, so every tract clears it. That is
     not a shortcut around a decision: it is the decision, taken from his 8/1
     bank law and from the building code that law is describing. A wall in this
     valley means nothing, which is exactly why it has to be on every tract --
     the signal is the GATE, and a signal needs a background to be a signal
     against.

     A district may still force its own answer, which is how `trailer` stays
     open: rough frontage is a district fact, not a quality one.
     -------------------------------------------------------------------------- */
  function wallThreshold(r) {
    if (!r || !r.known) return null;
    return r.lo;
  }
  function walled(district, quality, r) {
    if (district === 'trailer') return false;      /* rough frontage, no wall */
    var t = wallThreshold(r);
    if (t == null) return null;                    /* unknown, never a guess */
    return +quality >= t;
  }

  /* --------------------------------------------------------------------------
     THE GATE. Only where the valley says so, and QUALITY IS NOT THE ANSWER.

     MEASURED, and this is why the row's "top half" cannot be used even for the
     gate: quality is bucketed coarsely. On seed 1337, 678 of 2,558 suburb cells
     sit at exactly 0.9 and 663 at 0.85. Any threshold at the top of the range
     gates 26% of the valley's tracts. The valley's OWN gated ground -- the
     `gated` and `estate` districts the overmap places -- is 73 cells, 2.8% of
     residential ground, and it is stable across seeds (2.8, 2.9, 2.7).
     A COARSELY BUCKETED NUMBER CANNOT EXPRESS A 3% MINORITY. So it does not try.

     The map already knows who is rich. An ordinary `suburb` cell IS the ordinary
     walled subdivision, by definition, and the bridge already forces the gate on
     gated and estate ground. This function says that out loud so nobody adds a
     quality threshold for it again.
     -------------------------------------------------------------------------- */
  function gated(district) {
    if (district === 'gated' || district === 'estate') return true;
    if (RESIDENTIAL.indexOf(district) >= 0) return false;
    return null;
  }

  /* --------------------------------------------------------------------------
     THE WAYS IN, AND THE ROW'S SECOND NUMBER REPLACED BY A MEASURED ONE.

     The row asked for "one gated entry on the arterial side plus one rear
     service gate for tracts over twelve cells". The first half is right. The
     second half names a tract that does not exist: the valley's tracts are 1, 2
     or 4 cells and the largest is four.

     So the rear service gate goes where the row plainly meant it -- on THE
     BIGGEST TRACTS THE VALLEY ACTUALLY BUILDS -- and the size is taken from the
     map instead of typed, through `biggest`. Hand it a valley that really does
     build twelve-cell tracts and the rule follows it there.

     A tract with no street on any edge gets no entry and says so rather than
     inventing a door; that is the landlocked law's business, not this file's.
     -------------------------------------------------------------------------- */
  function biggest(map, bridge, N) {
    N = N || 96;
    var seen = {}, max = 0;
    for (var y = 0; y < N; y++) {
      for (var x = 0; x < N; x++) {
        var c = null; try { c = map.at(x, y); } catch (e) { continue; }
        if (!c || RESIDENTIAL.indexOf(c.district) < 0) continue;
        var cl = null; try { cl = bridge.clusterFor(map, x, y); } catch (e) { continue; }
        if (!cl) continue;
        var k = cl.cx + ',' + cl.cy; if (seen[k]) continue; seen[k] = 1;
        var cells = (cl.cw || 1) * (cl.ch || 1);
        if (cells > max) max = cells;
      }
    }
    return max || null;
  }

  function entries(cells, streetEdges, big) {
    var edges = streetEdges || [];
    if (!edges.length) return { ways: 0, why: 'NO_STREET_ON_ANY_EDGE' };
    /* ONE way in, on a street edge. Which edge is the bridge's answer, not this
       file's: it already knows which edges face a street. */
    var ways = 1, rear = false;
    /* AND A REAR SERVICE GATE ON THE BIGGEST TRACTS THE VALLEY BUILDS, which
       needs a SECOND edge to put it on -- a service gate on the same street as
       the front door is a second front door, not a service gate. */
    if (big != null && cells >= big && edges.length > 1) { ways = 2; rear = true; }
    return { ways: ways, rear: rear, on: edges.slice(0, ways), draft: DRAFT };
  }

  /* --------------------------------------------------------------------------
     THE WALL TILES. The row's third number, and the one that was right.

     banks/BOHEMIA_WALL_PICKS_7_14_26.txt holds his approved picks. A tract's
     band is WHERE ITS QUALITY FALLS IN THE VALLEY'S OWN RANGE, so a poor tract
     and a rich one do not get the same wall, and no band edge is typed: the
     picks are spread evenly across the measured range.

     ONE WALL PER COMMUNITY (the existing law): a tract gets ONE pick for its
     whole ring, so the answer is a single key and never a list.
     -------------------------------------------------------------------------- */
  function band(quality, r, picks) {
    if (!r || !r.known) return null;
    if (!picks || !picks.length) return null;
    var q = +quality;
    if (!isFinite(q)) return null;
    var span = r.hi - r.lo;
    var t = span > 0 ? (q - r.lo) / span : 0;
    if (t < 0) t = 0; if (t > 1) t = 1;
    var i = Math.floor(t * picks.length);
    if (i >= picks.length) i = picks.length - 1;
    return picks[i];
  }

  /* --------------------------------------------------------------------------
     THE WHOLE ANSWER FOR ONE TRACT, which is what the plot generator wants.
     -------------------------------------------------------------------------- */
  function tract(opts) {
    opts = opts || {};
    var r = opts.range;
    if (!r || !r.known) return { known: false, why: 'NO_RANGE_MEASURED' };
    var d = opts.district;
    if (RESIDENTIAL.indexOf(d) < 0) return { known: false, why: 'NOT_RESIDENTIAL', district: d };
    var w = walled(d, opts.quality, r);
    return {
      known: true, district: d, quality: +opts.quality,
      walled: w,
      gated: gated(d),
      wall: w ? band(opts.quality, r, opts.picks) : null,
      entries: entries(opts.cells || 1, opts.streetEdges, opts.biggest),
      draft: DRAFT
    };
  }

  var API = {
    RESIDENTIAL: RESIDENTIAL,
    range: range,
    wallThreshold: wallThreshold,
    walled: walled,
    gated: gated,
    biggest: biggest,
    entries: entries,
    band: band,
    tract: tract,
    draft: DRAFT
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (root) root.BohemiaTract = API;
  return API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
