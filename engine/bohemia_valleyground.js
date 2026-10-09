/* ============================================================================
   BOHEMIA -- THE VALLEY'S GROUNDS (10/9/26, WORLD lane).
   Row [the valley's grounds], rule 75b.

   HIS WORDS (Paolo 10/5 and 10/9, and via Grok): THE GROUND PICKS WHO SHOWS UP.
   The row asks for a data file of the valley's grounds, each with its FACTION
   POOL and its TRAVEL COST, the costs translated off the Battle Brothers wiki's
   map speeds: road 1, dirt 0.75, wash 0.5, rubble 0.65, the ranges 0.25; sight 1,
   hills 1.25, ridges 2.

   ============================================================================
   RULE 12 FIRST: HALF OF THIS WAS ALREADY BUILT, AND THE OTHER HALF WAS A GUESS
   ============================================================================
   THE GROUNDS EXIST. [board terrains] shipped on 9/30: every map cell already
   carries one of thirteen terrain kinds, 0 unmapped across a hundred rolled
   valleys. So this file DOES NOT WRITE A SECOND LIST OF GROUNDS -- a second list
   of the same thing is two lists that drift, which is the defect this lane has
   measured three times now. A GROUND IS A TERRAIN KIND. The gate refuses if the
   two ever stop agreeing.

   *** AND THE TRAVEL COST THAT EXISTS IS A TWO-SPEED WORLD. *** Measured on the
   walked surface: `PAVED = {asphalt, concrete}` and `PAVED_SPEED.factor = 0.5`,
   so a paved cell costs half and EVERY OTHER CELL IN LAS VEGAS COSTS THE SAME --
   the mountains cost exactly what a parking lot costs. His translated numbers are
   a five-speed world where the road's edge over a dirt track is SMALLER (1 against
   0.75, not 2 against 1) and the ranges are four times worse than a road. The
   shipped number is not wrong, it is COARSE: it was a street rule, and this is a
   map rule.
   NOTHING HERE TOUCHES THE STREET. The walked surface says "one number in one
   place for the speed... tuning the street tunes the map", and that stays true of
   the street. This is the map's own table, it is read by travel, and the conflict
   is written down rather than resolved by me -- every felt number is TUNING's
   (rule 36) and these carry `tuned:false` and their source.

   ============================================================================
   RULED WHERE HE RULED, MEASURED WHERE HE DID NOT, AND EACH ONE SAYS WHICH
   ============================================================================
   Four grounds have a speed from his own row, translated off the wiki. The other
   nine do not, and inventing nine numbers would be exactly what rule 36 forbids.
   So they are MEASURED off the city's own kits: a ground's kits declare, cell by
   cell, what is open and what is built or blocked, and HOW MUCH OF A GROUND YOU
   CAN ACTUALLY CROSS is a fact about the city, not an opinion.

   *** AND THE DERIVED SCALE IS ANCHORED ON A RULED POINT, not on a constant I
   picked. *** Open desert measures 0.50 open and he ruled it 0.75, so the scale
   is openShare x 1.5 and the anchor is his number. That is the whole of the
   arithmetic, it is one line, and if he retunes the desert every derived ground
   moves with it.

   ============================================================================
   THE POOL IS NOT A TABLE. IT IS WHO HOLDS THE GROUND.
   ============================================================================
   "The ground picks who shows up" could be an authored list of factions per
   ground, and that would be content, which is his (MECHANISM-MINE /
   CONTENTS-PAOLO'S), and it would also go stale the moment the map moved.
   It does not need to be authored: bohemia_towns.turf already answers who holds
   every cell in the valley -- measured 14 factions, 0 cells unheld. So the pool
   of a ground is WHICH FACTIONS HOLD CELLS OF IT, weighted by how many, derived
   fresh from the live map. Take a faction's ground and its crews stop showing up
   there, with nothing to edit.

   THE THREE THAT ARE NOT GROUNDS, named rather than faked, the same way
   [board terrains] named its two: RUIN is a CONDITION (act one IS the ruin),
   CASINO FLOOR is an INTERIOR, and RIDGES -- which his sight list names -- is a
   FEATURE INSIDE THE HILLS: nothing in this valley marks a ridge, so a sight
   bonus for one cannot be read off the map yet.

     node gates/valley_grounds_gate.js
   ========================================================================== */
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var BT = HASREQ ? require('./bohemia_boardterrain.js') : (root.BohemiaBoardTerrain || null);

  /* *** NOT A SECOND LIST. *** The grounds are the terrain kinds, read from the
     module that owns them. */
  function grounds() { return BT ? BT.KINDS.slice() : []; }

  var SRC_WIKI = 'the Battle Brothers wiki map speeds, translated in the row (Paolo 10/5 and 10/9, rule 75b)';
  var SRC_KITS = 'measured off the city\'s own district kits: the share of a ground\'s legend that is open rather than built or blocked';

  /* HIS, TRANSLATED. Four grounds and the sight list. */
  var RULED_SPEED = {
    freeway:        { speed: 1.00, as: 'road',       ruling: SRC_WIKI, tuned: false },
    open_desert:    { speed: 0.75, as: 'dirt',       ruling: SRC_WIKI, tuned: false },
    wash_and_shore: { speed: 0.50, as: 'wash',       ruling: SRC_WIKI, tuned: false },
    hills:          { speed: 0.25, as: 'the ranges', ruling: SRC_WIKI, tuned: false }
  };
  var RULED_SIGHT = {
    hills: { sight: 1.25, ruling: SRC_WIKI, tuned: false }
  };
  var BASE_SIGHT = { sight: 1.00, ruling: SRC_WIKI, tuned: false };

  /* HIS LIST NAMES TWO THINGS THE MAP CANNOT HAND OVER. `rubble` at 0.65 is the
     RUIN, which [board terrains] already measured as a CONDITION and not a kind
     of ground; `ridges` at sight 2 is a feature inside the hills and nothing in
     the valley marks one. Both are carried with their ruled number so they are
     ready the day something marks them, and both answer by name today. */
  var NOT_A_GROUND = {
    ruin:         { is: 'CONDITION', speed: 0.65, as: 'rubble', ruling: SRC_WIKI,
                    because: 'act one IS the ruin, so rubble is a state a suburb or strip ground is in, not a ground ([board terrains], 9/30)' },
    casino_floor: { is: 'INTERIOR', because: 'you arrive at a strip ground and go in ([board terrains], 9/30)' },
    ridges:       { is: 'FEATURE', sight: 2.00, ruling: SRC_WIKI,
                    because: 'a ridge is inside the hills and nothing in this valley marks one, so a sight bonus for it cannot be read off the map yet' }
  };

  /* THE ANCHOR, and it is the only arithmetic in this file. Open desert measures
     0.50 open and he ruled it 0.75, so a measured ground's speed is its open
     share times this. His number sets the scale; if he retunes the desert, every
     derived ground moves with it. */
  var ANCHOR = {
    ground: 'open_desert', measuredOpen: 0.50, ruledSpeed: 0.75, factor: 1.5,
    ruling: 'the scale is anchored on his own ruled dirt speed rather than a constant', tuned: false
  };

  /* MEASURED OFF THE KITS (see SRC_KITS). Carried as data so a browser needs no
     filesystem, and re-measured by the gate every run so it cannot drift. */
  var OPEN_SHARE = {
    suburb_block: 0.33, the_strip: 0.34, industrial: 0.31, open_desert: 0.50,
    wash_and_shore: 0.48, hills: 0.50, freeway: 0.44, lot_and_bigbox: 0.35,
    trailer_park: 0.27, golf_and_park: 0.48, airport: 0.25, solar_and_pumps: 0.37,
    landfill: 0.50
  };

  var NOT_A_GROUND_WHY = 'NOT_A_GROUND';
  var NO_MAP = 'NO_MAP';

  function speedOf(ground) {
    if (Object.prototype.hasOwnProperty.call(NOT_A_GROUND, ground))
      return { known: false, why: NOT_A_GROUND_WHY, ground: ground,
               is: NOT_A_GROUND[ground].is, because: NOT_A_GROUND[ground].because };
    if (grounds().indexOf(ground) < 0)
      return { known: false, why: 'NOT_A_KIND', ground: ground };
    if (Object.prototype.hasOwnProperty.call(RULED_SPEED, ground)) {
      var r = RULED_SPEED[ground];
      return { known: true, ground: ground, speed: r.speed, from: 'RULED',
               as: r.as, ruling: r.ruling, tuned: false };
    }
    var o = OPEN_SHARE[ground];
    if (o === undefined)
      return { known: false, why: 'NO_KIT', ground: ground,
               because: 'no district kit declares this ground, so how crossable it is cannot be measured' };
    return { known: true, ground: ground,
             speed: +(o * ANCHOR.factor).toFixed(2), from: 'MEASURED',
             openShare: o, anchor: ANCHOR.ground, ruling: SRC_KITS, tuned: false };
  }

  function sightOf(ground) {
    if (Object.prototype.hasOwnProperty.call(NOT_A_GROUND, ground))
      return { known: false, why: NOT_A_GROUND_WHY, ground: ground,
               is: NOT_A_GROUND[ground].is, because: NOT_A_GROUND[ground].because };
    if (grounds().indexOf(ground) < 0) return { known: false, why: 'NOT_A_KIND', ground: ground };
    var r = Object.prototype.hasOwnProperty.call(RULED_SIGHT, ground) ? RULED_SIGHT[ground] : BASE_SIGHT;
    return { known: true, ground: ground, sight: r.sight, ruling: r.ruling, tuned: false };
  }

  /* *** THE POOL, DERIVED FROM THE LIVE MAP. *** Hand in the map and the turf the
     game already computes; this counts, it does not decide. */
  function poolOf(o) {
    o = o || {};
    var m = o.map, turf = o.turf, ground = o.ground, n = o.size || 96;
    if (!m || !turf || typeof turf.at !== 'function')
      return { known: false, why: NO_MAP,
               because: 'the pool is who holds the ground, so it needs the live map and the live turf; it is never a table in this file' };
    if (!BT) return { known: false, why: NO_MAP };
    var by = {}, cells = 0;
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var a = BT.at(m, x, y);
      if (!a.known || a.kind !== ground) continue;
      cells++;
      var t = turf.at(x, y);
      var f = (t && t.faction) || null;
      if (f) by[f] = (by[f] || 0) + 1;
    }
    var pool = Object.keys(by).map(function (f) {
      return { faction: f, cells: by[f], share: +(by[f] / (cells || 1)).toFixed(3) };
    }).sort(function (a, b) { return b.cells - a.cells; });
    return { known: true, ground: ground, cells: cells, pool: pool,
             derived: 'who holds the ground, counted off the live turf; nothing here is authored' };
  }

  function census(m, turf, n) {
    n = n || 96;
    var out = { cells: 0, withGround: 0, withSpeed: 0, byGround: {}, held: 0, unheld: 0 };
    if (!BT) return out;
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var a = BT.at(m, x, y);
      out.cells++;
      if (!a.known) continue;
      out.withGround++;
      out.byGround[a.kind] = (out.byGround[a.kind] || 0) + 1;
      if (speedOf(a.kind).known) out.withSpeed++;
      if (turf && typeof turf.at === 'function') {
        var t = turf.at(x, y);
        if (t && t.faction) out.held++; else out.unheld++;
      }
    }
    return out;
  }

  var API = {
    grounds: grounds, RULED_SPEED: RULED_SPEED, RULED_SIGHT: RULED_SIGHT,
    BASE_SIGHT: BASE_SIGHT, NOT_A_GROUND: NOT_A_GROUND, ANCHOR: ANCHOR,
    OPEN_SHARE: OPEN_SHARE, NOT_A_GROUND_WHY: NOT_A_GROUND_WHY, NO_MAP: NO_MAP,
    speedOf: speedOf, sightOf: sightOf, poolOf: poolOf, census: census
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.BohemiaValleyGround = API;
})(typeof self !== 'undefined' ? self : this);
