/* ============================================================================
   BOHEMIA -- TILE KINDS AT HOUSE SIZE (10/1/26, WORLD lane).  Row [tile options].

   THE SURVIVING HALF OF THE ROW, in the coordinator's words (9/28): "the list of
   tile KINDS at house size is yours: every kind the city has, from the block's own
   layout; the board must still read as the city."

   COOK owns what a tile LOOKS like. This file owns WHAT A TILE CAN BE.

   ============================================================================
   HARVESTED, NOT INVENTED
   ============================================================================
   REUSE-FIRST, and it is not close: the city already declares this vocabulary.
   FIFTY-TWO district kits each carry a legend whose every entry names a `kind`,
   and across them there are NINETEEN distinct kinds over 921 entries. Not one of
   them was invented here. The gate re-harvests the kits every run and refuses if
   a kit ever declares a kind this table has not heard of, so the list cannot
   quietly fall behind the city it is supposed to describe.

   ============================================================================
   *** AND MOST OF WHAT THE CITY DRAWS IS NOT A TILE AT HOUSE SIZE. ***
   ============================================================================
   This is the finding, and it is rule 38(e) turned into a count instead of a
   promise. The kits were drawn for THE WALK, at 0.75 m a cell, so their legend
   kinds are at the walk's resolution. At HOUSE SIZE most of them stop being a
   square you stand on and become something that happens ON one:

     A PAINTED LANE LINE IS NOT A TILE. A SIDEWALK IS NOT A TILE -- he said it
     outright on 9/28, "never a fight where one tile is one sidewalk". A parked
     car is not a tile; it is a thing on one, which is what makes it cover.

   So every one of the nineteen is classified, and only ten of them are TILES.
   The other nine are DRESSING, BLOCKERS, EDGES or OVERHEAD -- which is exactly
   what rule 38(e) said would happen to the walk's assets ("every asset the walk
   produced is the fight's ground"), stated as a table a generator can read.

   ============================================================================
   HOW BIG A HOUSE TILE IS, MEASURED OFF OUR OWN SUBURB
   ============================================================================
   A COMBAT TILE IS A HOUSE (9/4, 9/24, 9/28) is a ruling in houses, not metres,
   so the metres had to be measured rather than chosen. In our own generated
   suburb block, 128 cells of 0.75 m square:
     a house footprint is 21 x 12 cells = 15.8 m x 9.0 m
     THE LOT PITCH -- nearest house centre to nearest house centre -- is 26.0
     cells = 19.5 m, over a range of 18.0 to 21.8 m
   The pitch is the number that matters, because what tiles a city is not the
   house, it is the house plus its yard and half its driveway. So a house tile is
   about TWENTY METRES SQUARE and a 96 m block is about five tiles across. That
   number is the suburb's; a strip tile or an industrial tile is not forced to
   match it and nothing here says it must.

   ============================================================================
   WHAT IS NOT MINE
   ============================================================================
   LOOKS ships empty. What a tile kind is DRAWN as is COOK's, and what it does in
   a fight -- cover, reach, the mound -- is COMBAT's. Asking answers NO_RULING by
   name. There is no colour, no pixel and no damage number in this file.

     node gates/tile_kinds_gate.js
   ========================================================================== */
(function (root) {
  'use strict';

  /* THE NINETEEN THE CITY REALLY DECLARES, each with what it becomes at house
     size. Every name is read off a district kit's legend. */
  var CLASS = {
    /* --- TILES: the square itself is this ------------------------------- */
    ground:     'TILE',      /* a yard, a lot, bare Mojave dirt */
    drive:      'TILE',      /* the roadway: a street tile */
    building:   'TILE',      /* a house, or one tile of a bigger building */
    structure:  'TILE',      /* built and not a dwelling: a wall run, a shed */
    water:      'TILE',
    water_dead: 'TILE',      /* a drained pool, a dry channel */
    turf_dead:  'TILE',      /* dead grass */
    court:      'TILE',
    play:       'TILE',      /* a playground */
    panel:      'TILE',      /* a solar panel row */

    /* --- DRESSING: drawn on a tile, no mechanics ------------------------ */
    marking:    'DRESSING',  /* painted lines: at twenty metres a lane line is paint */
    walk:       'DRESSING',  /* THE SIDEWALK. His words, 9/28: "never a fight
                                where one tile is one sidewalk." */

    /* --- BLOCKERS: sit on a tile, block it or cover you ------------------ */
    prop:       'BLOCKER',
    vehicle:    'BLOCKER',   /* a parked car is not a tile, it is cover on one */
    tree_dead:  'BLOCKER',
    fence:      'BLOCKER',

    /* --- EDGES: a property of the boundary between two tiles ------------- */
    gate:       'EDGE',
    portal:     'EDGE',      /* a door is where two tiles meet, not a tile */

    /* --- OVERHEAD: you pass under it ------------------------------------- */
    overhead:   'OVERHEAD'
  };

  /* the kits spell two of them with a hyphen; the city's spelling is the city's */
  var ALIAS = { 'water-dead': 'water_dead', 'turf-dead': 'turf_dead', 'tree-dead': 'tree_dead' };

  var CLASSES = ['TILE', 'DRESSING', 'BLOCKER', 'EDGE', 'OVERHEAD'];

  /* MEASURED OFF engine/bohemia_suburb.js, seed 1337. Every number here was taken,
     not chosen, and the gate re-takes them so they cannot drift from the city. */
  var MEASURED = {
    kitCell_m: 0.75,          /* his 0.75 m world unit */
    kitBlock_cells: 128,
    houseFootprint_cells: [21, 12],
    lotPitch_cells: 26,
    lotPitch_m: 19.5,
    lotPitch_range_m: [18.0, 21.8],
    source: 'engine/bohemia_suburb.js at seed 1337, 20 houses in one block'
  };

  /* *** SHIPS EMPTY. *** What a kind is drawn as is COOK's; what it does in a
     fight is COMBAT's. */
  var LOOKS = {};

  var NO_RULING = 'NO_RULING';
  var NOT_A_KIND = 'NOT_A_KIND';

  function normal(kind) {
    if (!kind) return null;
    return Object.prototype.hasOwnProperty.call(ALIAS, kind) ? ALIAS[kind] : kind;
  }

  /* THE ONE DOOR. An unknown kind answers by name rather than guessing TILE --
     guessing TILE is how a painted line ends up as a square you stand on. */
  function classOf(kind) {
    var k = normal(kind);
    if (!k || !Object.prototype.hasOwnProperty.call(CLASS, k))
      return { known: false, why: NOT_A_KIND, kind: kind,
               because: 'a district kit declares this and the tile table has never '
                 + 'heard of it; guessing TILE is how a painted line becomes a '
                 + 'square you stand on' };
    return { known: true, kind: k, klass: CLASS[k], isTile: CLASS[k] === 'TILE' };
  }

  function tiles() {
    var out = [];
    for (var k in CLASS) if (CLASS[k] === 'TILE') out.push(k);
    return out;
  }

  function looksOf(kind) {
    var k = normal(kind);
    if (!k || !Object.prototype.hasOwnProperty.call(CLASS, k))
      return { known: false, why: NOT_A_KIND, kind: kind };
    if (!Object.prototype.hasOwnProperty.call(LOOKS, k))
      return { known: false, why: NO_RULING, table: 'LOOKS', kind: k,
               because: 'what a tile is drawn as is COOK\'s, and what it does in a '
                 + 'fight is COMBAT\'s' };
    return { known: true, kind: k, looks: LOOKS[k] };
  }

  /* THE CITY'S OWN COUNT, so the gate and the data file read one number. */
  function census(legendKinds) {
    var out = { entries: 0, distinct: 0, byClass: {}, byKind: {}, unknown: {} };
    CLASSES.forEach(function (c) { out.byClass[c] = 0; });
    var seen = {};
    (legendKinds || []).forEach(function (raw) {
      out.entries++;
      var c = classOf(raw);
      if (!c.known) { out.unknown[raw] = (out.unknown[raw] || 0) + 1; return; }
      seen[c.kind] = 1;
      out.byKind[c.kind] = (out.byKind[c.kind] || 0) + 1;
      out.byClass[c.klass]++;
    });
    out.distinct = Object.keys(seen).length;
    return out;
  }

  var API = {
    CLASS: CLASS, CLASSES: CLASSES, ALIAS: ALIAS, LOOKS: LOOKS, MEASURED: MEASURED,
    NO_RULING: NO_RULING, NOT_A_KIND: NOT_A_KIND,
    classOf: classOf, tiles: tiles, looksOf: looksOf, census: census
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.BohemiaTileKinds = API;
})(typeof self !== 'undefined' ? self : this);
