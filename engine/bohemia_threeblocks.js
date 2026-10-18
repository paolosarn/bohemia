/* ============================================================================
   BOHEMIA -- THE THREE BLOCKS THE VALLEY NEEDS   (10/10/26, WORLD lane)
   Row [the apron, the compound and the civic interior].

   THE ROW (mine, written 10/10 under rule 74 off this lane's own measurement):
   24 of the 78 districts have no board of their own and they are three families,
   so three blocks are missing. COMBAT cuts the blocks; WORLD owns WHAT IS ON THAT
   GROUND before a fight starts.

   ============================================================================
   *** RULE 12: THE VALLEY ALREADY KNOWS WHAT TWO OF THE THREE ARE MADE OF, AND
   *** THE THIRD IS NOT MISSING AT ALL -- IT IS BUILT AND WIRED TO NOTHING.
   ============================================================================
   THIRTEEN of the 24 districts already have a kit that draws, so for two of the
   three families the material is not a thing to invent, it is a thing to read:

     AN APRON      measured on speedway, stadium, ballpark, terminal
                   72.8% floor, 18.5% cover, 0.56% door; drive 40%, ground 33%
                   grandstand, catch fence, pit road, garage row, light tower,
                   tunnel mouth, racing surface, infield, scoreboard, dead race car
     A COMPOUND    measured on battery, substation, watertreat
                   71.3% floor, 27.6% cover, 0.031% door; ground 69%, structure 22%
                   perimeter fence, gate, transformer, switchgear, busbar, cable
                   trench, clarifier wall, aeration basin, pipe gallery, pole light

   Both of those are real and both are the row's own words back: the apron IS open
   paved ground with a long shed and a fence, and the compound IS a wall with one
   gate (0.031% of cells is a door -- about one in three thousand) and tanks and
   sheds inside it. Nothing here was invented; it was counted.

   *** AND THE CIVIC INTERIOR IS THE ONE THAT BREAKS. ***
   Not because the civic kits are thin. They are not: cityhall, courthouse, jail,
   policestation, firestation and medical all draw, at 61.2% floor and 33.3%
   cover. The break is that EVERY ONE OF THOSE CELLS IS OUTSIDE. Measured across
   all 50 kits: of 813 named pieces, 256 are things you can stand on, and NOT ONE
   OF THEM IS THE FLOOR OF A ROOM. The closest the valley has is the concourse
   under a stadium's stands, twice, which is a covered outdoor loop. The city hall
   is `city hall [building]` -- a solid block. The jail is `building (cell
   block/admin) [building]` with a `cell detail [structure]`, both impassable.
   THE VALLEY HAS NEVER DRAWN AN INSIDE.

   ============================================================================
   *** AND THEN THE ONE THAT MAKES THIS ROUND WORTH IT: AN INTERIOR ALREADY
   *** EXISTS IN THE FIGHT AND NOTHING CAN ASK FOR IT.
   ============================================================================
   The fight deals from a block library built out of slices/fight_ground/
   fight_ground.json. Build that library the way the fight builds it and it holds
   EIGHTEEN block kinds. The board_mix families name FIFTEEN. nfKind can lead with
   TEN. Cross them:

     IN NO FAMILY AND UNREACHABLE, so they can never appear in any fight, ever:
        casino, freewayo, scrubroad
     IN A FAMILY BUT NO DISTRICT LEADS WITH THEM, so they only ever turn up as the
     shuffled second or third block:
        lots, main, works

   `casino` is 294 flat cells, 6 of height and 201 cover pieces -- pillars, slot
   banks and tables. IT IS THE ONLY INTERIOR IN THE GAME. COMBAT TWO cut it, and
   the map cannot ask for it, and the mix will never roll it.

   So the row's own sentence, "three blocks are missing", is half right and the
   better half is the correction: TWO are missing and the valley has the material
   for both; THE THIRD IS BUILT AND DISCONNECTED. A civic interior is not a thing
   nobody has drawn -- it is one wire away from the thing somebody already drew.

   NO SECOND LIST: the families come from bohemia_boardkinds.js, the districts
   from bohemia_boardterrain.js, who holds a ground from bohemia_valleyground.js.
   Nothing here restates a number that lives next door.

     node gates/three_blocks_gate.js
   ========================================================================== */
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var BK = HASREQ ? require('./bohemia_boardkinds.js') : (root.BOH_BOARDKINDS || null);
  var VG = HASREQ ? require('./bohemia_valleyground.js') : (root.BOH_VALLEYGROUND || null);
  if (BK && BK.BOH_BOARDKINDS) BK = BK.BOH_BOARDKINDS;
  if (VG && VG.BOH_VALLEYGROUND) VG = VG.BOH_VALLEYGROUND;

  var NO_MATERIAL = 'NO_MATERIAL';
  var NOT_A_FAMILY = 'NOT_A_FAMILY';

  var SRC_KITS = 'measured on the district kits of this family that really DRAW: '
    + 'five seeds each, every cell counted (WORLD 10/10). Not a legend count.';
  var SRC_LIB = 'slices/fight_ground/fight_ground.json, the block library the fight '
    + 'deals from, read the way the fight reads it (kind = the name before the dot)';

  /* ------------------------------------------------------------------------
     WHAT THE VALLEY'S OWN KITS SAY EACH FAMILY IS MADE OF.
     Carried as data so a browser needs no filesystem; the gate re-measures every
     number off the kits on every run, so none of it can drift from the city.
     ---------------------------------------------------------------------- */
  var MADE_OF = {
    infrastructure: {
      block: 'AN APRON',
      has: true,
      kits: ['speedway', 'stadium', 'ballpark', 'terminal'],
      floor: 0.728, cover: 0.185, door: 0.0056,
      topKinds: ['drive', 'ground', 'building', 'structure', 'marking'],
      pieces: ['grandstand', 'catch fence', 'pit road', 'garage row', 'light tower',
               'tunnel mouth', 'racing surface', 'track marking', 'infield (dead turf)',
               'scoreboard / jumbotron', 'dead race car', 'concourse (loop under the stands)',
               'facade (outer stadium wall)', 'gate / entrance'],
      ruling: SRC_KITS, tuned: false,
      reads: 'open paved ground you can cross at a run, one long shed down a side, '
           + 'a fence round the whole lot and a tunnel mouth into the stands. The '
           + 'widest board in the valley: nothing to hide behind for a hundred metres.'
    },
    plant: {
      block: 'A COMPOUND',
      has: true,
      kits: ['battery', 'substation', 'watertreat'],
      floor: 0.713, cover: 0.276, door: 0.00031,
      topKinds: ['ground', 'structure', 'building', 'drive', 'overhead'],
      pieces: ['perimeter fence', 'gate', 'transformer', 'switchgear structure',
               'busbar / conductor', 'cable trench', 'clarifier wall / core',
               'aeration / filter basin', 'pipe gallery / catwalk', 'pole light',
               'control building', 'battery container', 'hazard marking', 'gravel yard'],
      ruling: SRC_KITS, tuned: false,
      reads: 'a wall with ONE gate and a gravel yard inside it, full of waist-high '
           + 'steel that stops a bullet and not a man. The door share is 0.031% of '
           + 'cells, about one in three thousand: there is one way in and everybody '
           + 'inside knows where it is.'
    },
    civic: {
      block: 'A CIVIC INTERIOR',
      has: false,
      kits: ['cityhall', 'courthouse', 'jail', 'policestation', 'firestation', 'medical'],
      floor: 0.612, cover: 0.333, door: 0.00385,
      topKinds: ['ground', 'building', 'drive', 'structure', 'walk'],
      pieces: ['city hall', 'civic plaza', 'forecourt hardpan', 'curtain wall glazing',
               'podium', 'entry pier', 'doorway', 'council chamber roof', 'roof edge',
               'building (cell block/admin)', 'cell detail', 'apparatus bay door'],
      ruling: SRC_KITS, tuned: false,
      reads: 'EVERY ONE OF THOSE CELLS IS OUTSIDE. The plaza, the forecourt, the '
           + 'glazing, the roof. The city hall is one solid block and the jail is '
           + 'another with a cell detail stuck on the face of it. There is a '
           + 'doorway and nothing behind it.'
    }
  };

  /* THE MEASUREMENT THAT MAKES THE CIVIC CASE, kept as its own fact because it is
     about the WHOLE city and not about the civic kits. */
  var NO_INSIDE = {
    namedPieces: 813, standable: 256, insideRooms: 0,
    closest: ['ballpark: concourse', 'stadium: concourse (loop under the stands)'],
    ruling: 'every legend of all 50 district kits that draw (WORLD 10/10)',
    because: 'of 256 things you can stand on in the whole valley, not one is the floor '
           + 'of a room. The nearest is the covered loop under a stadium\'s stands, '
           + 'twice. A COMBAT TILE IS A HOUSE (Paolo 9/4) and the INTERIOR-MATCHES-'
           + 'EXTERIOR LAW both assume an inside the city has never drawn.'
  };

  /* THE BLOCKS THAT EXIST AND CANNOT BE REACHED. The gate rebuilds this from the
     library, the families and nfKind on every run. */
  var UNREACHABLE = {
    neverAtAll: ['casino', 'freewayo', 'scrubroad'],
    neverTheLead: ['lots', 'main', 'works'],
    ruling: SRC_LIB,
    casino: {
      flatCells: 294, heightCells: 6, coverPieces: 201,
      coverKinds: ['pillar', 'slot_bank', 'table'],
      is: 'THE ONLY INTERIOR IN THE GAME. COMBAT TWO cut it, the map cannot ask for '
        + 'it and the mix will never roll it, so it has never appeared in a fight.'
    }
  };

  function families() { return BK ? Object.keys(BK.FAMILIES) : Object.keys(MADE_OF); }

  function madeOf(family) {
    if (!MADE_OF[family]) return { known: false, why: NOT_A_FAMILY, family: family };
    var m = MADE_OF[family];
    if (!m.has) {
      return { known: false, why: NO_MATERIAL, family: family, block: m.block,
               kits: m.kits, floor: m.floor, cover: m.cover, door: m.door,
               reads: m.reads, noInside: NO_INSIDE,
               butItExists: UNREACHABLE.casino,
               because: 'the civic kits are not thin -- they draw at ' + Math.round(m.floor * 100)
                      + '% floor. Every cell of it is OUTSIDE the building, and the one '
                      + 'interior that exists in the game is unreachable.',
               whose: 'COMBAT [board generator]: one wire, not a new block.' };
    }
    return { known: true, family: family, block: m.block, kits: m.kits,
             floor: m.floor, cover: m.cover, door: m.door, topKinds: m.topKinds,
             pieces: m.pieces, reads: m.reads, ruling: m.ruling, tuned: false };
  }

  /* WHO IS STANDING ON IT. Not restated: handed to the ground module, which
     already derives the roaming pool off the live turf. */
  function heldBy(family, opts) {
    if (!MADE_OF[family]) return { known: false, why: NOT_A_FAMILY, family: family };
    if (!VG || !opts || !opts.map) {
      return { known: false, why: 'NO_MAP', family: family,
               whose: 'bohemia_valleyground.poolOf, handed the map and the live turf' };
    }
    var grounds = {};
    if (BK) MADE_OF[family].kits.concat(BK.FAMILIES[family] ? BK.FAMILIES[family].districts : [])
      .forEach(function (d) { var g = BK.districts()[d]; if (g) grounds[g] = true; });
    return { known: true, family: family, grounds: Object.keys(grounds),
             pools: Object.keys(grounds).map(function (g) {
               return { ground: g, pool: VG.poolOf({ map: opts.map, turf: opts.turf, ground: g }) };
             }),
             ruling: 'derived off the live turf by bohemia_valleyground.poolOf, never typed here' };
  }

  var API = {
    NO_MATERIAL: NO_MATERIAL, NOT_A_FAMILY: NOT_A_FAMILY,
    SRC_KITS: SRC_KITS, SRC_LIB: SRC_LIB,
    MADE_OF: MADE_OF, NO_INSIDE: NO_INSIDE, UNREACHABLE: UNREACHABLE,
    families: families, madeOf: madeOf, heldBy: heldBy
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.BOH_THREEBLOCKS = API;
})(typeof self !== 'undefined' ? self : this);
