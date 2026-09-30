/* ============================================================================
   BOHEMIA -- BOARD TERRAIN (9/30/26, WORLD lane).  Row [board terrains], rule 46.

   HIS WORDS (Paolo 9/29): "think about all the assets you're gonna need for the
   combat board... no single combat map in Battle Brothers is exactly the same...
   different terrains, nature zones, tile blockers... let's just recreate Battle
   Brothers with our whole swag." And the correction that shapes this whole file:
   *** MOST FIGHTS ARE BLOCK WARS. MOST CELLS ARE CITY KINDS; NATURE IS THE EDGE. ***

   THE JOB, narrowly: every map cell carries ONE TERRAIN KIND from the fifteen in
   records/BOHEMIA_THE_COMBAT_BOARD_ASSETS_WHAT_WE_HAVE_AND_WHAT_WE_NEED_9_29_26.md.
   The kind is what COMBAT's board generator reads and what COOK cooks assets for.
   It is NOT the board. The board is cut from the kind plus the district's own
   layout, seeded, never the same twice -- that is COMBAT's, and nothing in this
   file draws anything.

   ============================================================================
   WHAT MEASURING FOUND, AND TWO OF THE FIFTEEN ARE NOT MAP KINDS AT ALL
   ============================================================================
   The valley generates SEVENTY-FIVE distinct districts across 9,216 cells. Every
   one of them is mapped below, and the gate refuses if the generator ever makes a
   district this file has not heard of -- a fight that starts on unmapped ground is
   a fight with no board.

   *** T11 THE RUIN IS A CONDITION, NOT A PLACE. *** No district in this valley
   generates "ruin". It cannot: act one IS the ruin, so a burnt block is a STATE a
   suburb or a strip cell is in, not a kind of ground the map makes. The inventory
   lists it beside the other fourteen as though the generator would hand it over,
   and it never will. It is reported by name as CONDITION so nobody waits for cells
   that are not coming, and so COOK cooks scorched VARIANTS of T1 and T2 rather
   than a fifteenth tileset nothing would ever select.

   *** T13 THE CASINO FLOOR IS AN INTERIOR, NOT A CELL. *** You do not travel to a
   casino floor on the map; you arrive at a strip cell and go IN. The indoor fight
   already exists. So T13 is reported as INTERIOR, reached THROUGH a T2 cell, and
   the map never assigns it.

   Naming those two instead of quietly assigning them a handful of cells is the
   whole point of doing this as a measurement rather than a table. Thirteen kinds
   come off the map; two come off what happens to it and what is inside it.

   ============================================================================
   WHAT IS MINE AND WHAT IS NOT
   ============================================================================
   MINE: which kind a cell is. That is a reading of the valley, and the valley
   already decided it -- every line below is a district the generator really makes.
   NOT MINE, AND SHIPS EMPTY: what a kind's board LOOKS like. The blockers, the
   mounds, the roofs, the spawn rules are COMBAT's and COOK's, and ASSETS ships
   empty here so nothing in this file can quietly become art direction.

     node gates/board_terrains_gate.js
   ========================================================================== */
(function (root) {
  'use strict';

  /* THE FIFTEEN, IN THE INVENTORY'S OWN ORDER AND ITS OWN NAMES. */
  var KINDS = [
    'suburb_block',   /* T1  houses, yards, streets, sidewalks, cars, walls, sheds */
    'the_strip',      /* T2  casino fronts, the boulevard, fountains, signs */
    'industrial',     /* T3  loading docks, containers, fences, yards */
    'open_desert',    /* T4  creosote flats, washes, a dirt road, rocks */
    'wash_and_shore', /* T5  the Las Vegas Wash, Lake Mead's edge, tamarisk, mud */
    'hills',          /* T6  stepped rock, scrub, a road cut */
    'freeway',        /* T7  overpass, on-ramp, jammed cars, barriers */
    'lot_and_bigbox', /* T8  Walmart-scale lots, car islands, cart corrals */
    'trailer_park',   /* T9  tight, many blockers, propane tanks, fences */
    'golf_and_park',  /* T10 open grass, water hazards, sand traps, palms */
    'ruin',           /* T11 *** A CONDITION, NOT A MAP KIND. See below. *** */
    'airport',        /* T12 apron, hangars, a dead plane */
    'casino_floor',   /* T13 *** AN INTERIOR, NOT A MAP KIND. See below. *** */
    'solar_and_pumps',/* T14 panel rows, the switchgear fence, the pump house */
    'landfill'        /* T15 */
  ];

  /* THE TWO THAT THE MAP NEVER HANDS OVER, and why, in one word each. */
  var NOT_ON_THE_MAP = {
    ruin: 'CONDITION',   /* act one IS the ruin: a burnt block is a state a suburb
                            or strip cell is in, never a kind of ground */
    casino_floor: 'INTERIOR'  /* reached by going IN from a strip cell */
  };

  /* *** EVERY DISTRICT THE GENERATOR REALLY MAKES, AND NOTHING ELSE. ***
     Each name here was read off built valleys. This file invents no district and
     the gate proves it both ways: nothing unmapped, and nothing mapped that the
     generator does not make.

     *** AND ONE SEED IS NOT THE VALLEY, WHICH THIS TABLE LEARNED THE HARD WAY. ***
     Built against seed 1337 it came out at 75 districts and 9,216 of 9,216 cells
     mapped -- a clean sweep, and wrong. Rule 40(g) says the valley is ROLLED PER
     NEW GAME, so the only honest vocabulary is the one across many rolls: a
     hundred seeds make SEVENTY-EIGHT districts, and the three that seed 1337
     never happens to place (drivein, library, fort) would each have been a cell
     a fight could start on with no board under it. They are mapped now, and the
     gate sweeps ten seeds rather than one so the next district to appear is
     caught by the machine and not by a player. */
  var FROM = {
    suburb_block: ['suburb', 'estate', 'gated', 'town', 'school', 'chapel',
                   'medical', 'courthouse', 'cityhall', 'policestation',
                   'firestation', 'jail', 'prison', 'radio', 'library'],
    the_strip: ['strip', 'resort', 'casino', 'sphere', 'luxor', 'highroller',
                'strat', 'sign', 'convention', 'downtown'],
    industrial: ['industrial', 'warehouse', 'railyard', 'rail', 'storage',
                 'boneyard', 'fueldepot', 'granary', 'robofactory', 'truckstop',
                 'quarry', 'arsenal', 'datafort', 'swapmeet', 'fort'],
    open_desert: ['desert', 'gypsum', 'springs'],
    wash_and_shore: ['wash', 'water', 'basin', 'reservoir', 'intake', 'dam',
                     'watertreat'],
    hills: ['mountain'],
    freeway: ['freeway', 'interchange', 'speedway', 'minigp'],
    lot_and_bigbox: ['arterial', 'commercial', 'mall', 'apartment', 'drivein'],
    trailer_park: ['trailer'],
    golf_and_park: ['golf', 'park', 'ballpark', 'stadium', 'waterpark', 'campus',
                    'farm', 'cemetery'],
    ruin: [],            /* a condition; see NOT_ON_THE_MAP */
    airport: ['airport', 'airbase', 'terminal'],
    casino_floor: [],    /* an interior; see NOT_ON_THE_MAP */
    solar_and_pumps: ['solar', 'battery', 'substation', 'pumpstation', 'reclaim'],
    landfill: ['landfill']
  };

  /* CITY OR NATURE. His ruling is that most cells are CITY and nature is the
     EDGE, so the split is named here and the gate measures it rather than
     trusting it. */
  var NATURE = ['open_desert', 'wash_and_shore', 'hills', 'golf_and_park'];

  /* *** SHIPS EMPTY. *** What a kind's board looks like -- its blockers, its
     mounds, its roofs, its spawns -- is COMBAT's and COOK's. */
  var ASSETS = {};

  var NOT_A_CELL = 'NOT_A_CELL';
  var UNMAPPED = 'UNMAPPED_DISTRICT';
  var NO_RULING = 'NO_RULING';

  var _index = null;
  function index() {
    if (_index) return _index;
    _index = {};
    for (var k in FROM) {
      if (!Object.prototype.hasOwnProperty.call(FROM, k)) continue;
      for (var i = 0; i < FROM[k].length; i++) _index[FROM[k][i]] = k;
    }
    return _index;
  }

  function kindOf(district) {
    if (!district) return null;
    var k = index()[district];
    return k === undefined ? null : k;
  }

  /* THE ONE DOOR. A cell off the map, or on ground this file has never heard of,
     answers BY NAME rather than falling back to a kind -- a silent fallback is how
     a fight ends up on the wrong board and nobody finds out. */
  function at(m, x, y) {
    if (!m || typeof m.at !== 'function') return { known: false, why: NOT_A_CELL };
    var c = m.at(x, y);
    if (!c) return { known: false, why: NOT_A_CELL, x: x | 0, y: y | 0 };
    var k = kindOf(c.district);
    if (!k) return { known: false, why: UNMAPPED, district: c.district || null,
                     x: x | 0, y: y | 0,
                     because: 'the generator makes this ground and no terrain kind '
                       + 'claims it, so a fight here would have no board' };
    return { known: true, kind: k, district: c.district, x: x | 0, y: y | 0,
             nature: NATURE.indexOf(k) >= 0 };
  }

  function assetsOf(kind) {
    if (KINDS.indexOf(kind) < 0)
      return { known: false, why: 'NOT_A_KIND', kind: kind, are: KINDS.slice() };
    if (!Object.prototype.hasOwnProperty.call(ASSETS, kind))
      return { known: false, why: NO_RULING, table: 'ASSETS', kind: kind,
               because: 'what a board looks like is COMBAT\'s and COOK\'s' };
    return { known: true, kind: kind, assets: ASSETS[kind] };
  }

  /* THE VALLEY'S OWN ANSWER. Everything the gate and the data file report comes
     from here, so there is one count and not two that can disagree. */
  function census(m, size) {
    var n = size || 96;
    var out = { cells: 0, mapped: 0, unmapped: 0, byKind: {}, byDistrict: {},
                unmappedDistricts: {}, city: 0, nature: 0 };
    for (var i = 0; i < KINDS.length; i++) out.byKind[KINDS[i]] = 0;
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var c = m.at(x, y);
      if (!c) continue;
      out.cells++;
      var d = c.district || null;
      if (d) out.byDistrict[d] = (out.byDistrict[d] || 0) + 1;
      var k = kindOf(d);
      if (!k) {
        out.unmapped++;
        if (d) out.unmappedDistricts[d] = (out.unmappedDistricts[d] || 0) + 1;
        continue;
      }
      out.mapped++;
      out.byKind[k]++;
      if (NATURE.indexOf(k) >= 0) out.nature++; else out.city++;
    }
    return out;
  }

  var API = {
    KINDS: KINDS, FROM: FROM, NATURE: NATURE, ASSETS: ASSETS,
    NOT_ON_THE_MAP: NOT_ON_THE_MAP,
    NOT_A_CELL: NOT_A_CELL, UNMAPPED: UNMAPPED, NO_RULING: NO_RULING,
    kindOf: kindOf, at: at, assetsOf: assetsOf, census: census
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.BohemiaBoardTerrain = API;
})(typeof self !== 'undefined' ? self : this);
