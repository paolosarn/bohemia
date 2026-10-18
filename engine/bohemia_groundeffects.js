/* ============================================================================
   BOHEMIA -- WHAT EACH GROUND DOES TO A FIGHT   (10/9/26, WORLD lane)
   Row [ground effects].

   THE ROW: rule 59 (Paolo 10/1, "every floor tile from Battle Brothers needs a
   proper translation for our game... how it impacts your accuracy or your defence
   or the positioning, how many action points it costs to move through"). WORLD
   owns the GROUND half, COMBAT owns what the fight does with it.

   ============================================================================
   *** RULE 12 FIRST, AND THE PREMISE WAS WRONG IN A WAY THAT ONLY MATTERS HERE.
   ============================================================================
   [the valley's grounds] (10/9, mine) measures how open a ground is by counting
   its kits' LEGEND: how many of the distinct tile kinds a district declares are
   open rather than built. That is a VOCABULARY count. It says what a board can
   contain, never how much of a board is that thing.

   Measured this round on what the kits actually DRAW -- every live ground, every
   district kit that can generate, five seeds each, 4.1 million cells:

     ground            legend says blocked     the board really is
     open_desert              50%                      1.5%
     hills                    50%                     95.8%
     golf_and_park            46%                     10.7%
     the_strip                50%                     34.5%

   THE LEGEND SAYS EVERY GROUND IN THE VALLEY IS 43% TO 57% BLOCKED, A 1.33x
   SPREAD. THE BOARD SAYS 1.5% TO 95.8%, A 64x SPREAD. The desert fight and the
   mountain fight are the two most different fights in this game and the legend
   called them the same place.

   BOTH ENDS CHECK OUT AGAINST THE REAL WORLD, which is how I know the drawn
   number is the honest one and not a second bug: the mountain kit's own legend is
   bedrock face, ridge crest and cliff band, all solid:true, with ravine floor and
   talus between them -- a mountain block IS mostly cliff. The desert kit is
   ninety-seven per cent open ground. Neither of those is a defect; the 50/50 that
   the legend reported for both of them was.

   *** AND THE SHIPPED TRAVEL SPEEDS ARE NOT WRONG, WHICH I CHECKED BEFORE SAYING
   ANY OF THIS. *** Travel uses openness as a RANK and re-anchors it on his own
   ruled dirt speed, so the bias very largely cancels: re-deriving all nine derived
   speeds off the drawn shares moves the worst of them by 0.15 and most by under
   0.05, and his four RULED speeds are untouched by construction. A rank survives a
   biased count. AN ABSOLUTE DOES NOT, and a fight needs the absolute: "how much of
   this board is cover" is the whole of Battle Brothers' formation game. That is
   why this file measures its own numbers instead of reusing the ones next door,
   and it is the only honest reason to measure the same thing twice.

   ============================================================================
   *** AND ONLY ONE ROW OF BATTLE BROTHERS' TERRAIN TABLE CAN FIRE ON OUR BOARDS.
   ============================================================================
   The school page (records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_EVERY_FLOOR_TILE_AND_
   ITS_TRANSLATION_10_1_26.md) rules nine rows. Measured against every tile kind
   the valley's kits really draw:

     OBSTACLES        trees, rocks, walls -> our buildings, structures, dead cars,
                      boulders, dead trees, fences, props.  PRESENT ON ALL 13.
     THE DOOR         a gate or a portal is the one way into the built stuff.
                      Present on 9 of 13; a desert, a mountain and a wash have none.
     NIGHT            -2 vision, -30% ranged. Not a tile; the board carries it.
     SWAMP / WATER    4 AP and a melee-defence malus.  *** NOT ONE WET CELL IN THE
                      WHOLE VALLEY. *** The district literally named `water` draws
                      six kinds of dry ground, two drained basins, a dead car, a
                      dead tree and a prop. Zero water. The wash is dry, the pools
                      are drained, and the only wet water in the game at all is in
                      the landmarks module (the reservoir, the tailrace, Las Vegas
                      Creek), which is not a district kit, so no fight board can
                      ever be cut from it -- and all three are marked void anyway,
                      which is the CLIFFS row, not the SWAMP row.
     ROUGH / FOREST   3 AP.  NO SKIN. Every standable kind the valley draws is flat
                      and hard. The mountain's own legend calls its talus "slow
                      going" in its description and nothing reads a description.
     HEIGHT           +1 AP a level, +10%/-10% to hit, +1 reach.  UNREAD: not one
                      kit records a level. COMBAT's high ground is a feature the
                      board generator puts on, not a fact the ground carries.

   So the honest statement is that OUR GROUND CHANGES A FIGHT BY HOW MUCH OF IT YOU
   CANNOT STAND ON, and nothing else, and that single number runs 1.5% to 95.8%.
   The holes are named here rather than filled with a zero, because a zero for
   "height" is indistinguishable from "this ground is flat", which the mountain is
   very much not.

   EVERYTHING COSTS ONE (8/15) IS UNTOUCHED AND IS NOT A HOLE: Battle Brothers'
   2/3/4 AP ladder collapses to one step on our boards, and that is his ruling, not
   a gap in the data. The gap is that nothing would tell us a rubble field from a
   parking lot if he ever wanted the second beat back.

   NO SECOND LIST OF GROUNDS: the grounds come from bohemia_boardterrain.js live.
   NO SECOND COPY OF A NUMBER: the travel speed and the sight bonus are looked up
   from bohemia_valleyground.js, never restated here.

     node gates/ground_effects_gate.js
   ========================================================================== */
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var BT = HASREQ ? require('./bohemia_boardterrain.js') : (root.BOH_BOARDTERRAIN || null);
  var VG = HASREQ ? require('./bohemia_valleyground.js') : (root.BOH_VALLEYGROUND || null);
  if (BT && BT.BOH_BOARDTERRAIN) BT = BT.BOH_BOARDTERRAIN;
  if (VG && VG.BOH_VALLEYGROUND) VG = VG.BOH_VALLEYGROUND;

  var NOT_A_GROUND = 'NOT_A_GROUND';
  var UNREAD = 'UNREAD';
  var NO_KIT = 'NO_KIT';

  var SRC_DRAWN = 'measured on what the district kits really DRAW: every live '
    + 'ground, every kit that can generate, five seeds each, 4.1 million cells '
    + '(WORLD 10/9). NOT a legend count -- see the header.';
  var SRC_SCHOOL = 'records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_EVERY_FLOOR_TILE_AND_'
    + 'ITS_TRANSLATION_10_1_26.md, the coordinator\'s 10/1 school page off the '
    + 'wiki\'s Combat Mechanics and Hit Chance pages';

  /* ------------------------------------------------------------------------
     BATTLE BROTHERS' TERRAIN TABLE, AND WHICH OF OUR TILE KINDS CARRIES EACH ROW.
     Every row here is the school page's, quoted; the `ours` list is the only
     part that is a reading, and the gate proves every kind named is a kind the
     kits really draw. A row with an empty `ours` has NO SKIN IN THIS GAME and
     says so, which is the point of keeping it in the table.
     ---------------------------------------------------------------------- */
  var ROWS = {
    obstacles: {
      bb: 'Obstacles: trees, rocks, fences -- impassable, block movement and line of sight',
      ours: ['building', 'structure', 'prop', 'vehicle', 'tree-dead', 'fence'],
      does: 'you cannot stand there, you cannot shoot through it, and you can stand behind it',
      ruling: SRC_SCHOOL, tuned: false
    },
    door: {
      bb: 'INDOORS (ours, not Battle Brothers\'): a house tile is cover and a wall '
        + 'at once, and its door is the one way in',
      ours: ['gate', 'portal'],
      does: 'the one cell that gets you through a wall, so it is where a fight indoors is decided',
      ruling: SRC_SCHOOL, tuned: false
    },
    flat: {
      bb: 'Plains, grass, road and Dirt, sand -- 2 AP, no effect',
      ours: ['ground', 'drive', 'walk', 'court', 'turf-dead', 'marking'],
      does: 'one step, nothing else (EVERYTHING COSTS ONE, Paolo 8/15)',
      ruling: SRC_SCHOOL, tuned: false
    },
    rough: {
      bb: 'Forest floor 3 AP and Snow 3 AP -- a second beat to cross',
      ours: [],
      does: 'NOTHING HERE: no kit draws a rough standable cell, so this row cannot fire',
      ruling: SRC_SCHOOL, tuned: false
    },
    swamp: {
      bb: 'Swamp, murky water -- 4 AP and a melee-defence malus',
      ours: [],
      does: 'NOTHING HERE: the valley is dry. Not one wet cell on any ground.',
      ruling: SRC_SCHOOL, tuned: false
    },
    height: {
      bb: 'Hills, elevation -- +1 AP a level, +10% to hit down, -10% up, +1 range a level',
      ours: [],
      does: 'UNREAD: no kit records a level, so a ground cannot say whether it has one',
      ruling: SRC_SCHOOL, tuned: false
    },
    night: {
      bb: 'Night -- -2 vision, -30% ranged skill, -30% ranged defence',
      ours: [],
      does: 'not a tile at all: the board carries it, the same on every ground',
      ruling: SRC_SCHOOL, tuned: false
    }
  };

  /* ------------------------------------------------------------------------
     MEASURED ON THE DRAWN BOARDS (SRC_DRAWN). Carried as data so a browser needs
     no filesystem; the gate re-measures every one of them off the kits on every
     run, so they cannot drift from the city.
     cover = the share of drawn cells you cannot stand on
     room  = the share you can
     door  = the share that is a way through a wall
     (cover + room + door does not reach 1: the rest is dressing and overhead,
     which change nothing you can stand on. That is said out loud rather than
     normalised away, because a normalised number would hide the overhead.)
     ---------------------------------------------------------------------- */
  var DRAWN = {
    suburb_block:    { cover: 0.327, room: 0.627, door: 0.0030 },
    the_strip:       { cover: 0.345, room: 0.531, door: 0.0018 },
    industrial:      { cover: 0.246, room: 0.707, door: 0.0029 },
    open_desert:     { cover: 0.015, room: 0.985, door: 0.0000 },
    wash_and_shore:  { cover: 0.297, room: 0.702, door: 0.0002 },
    hills:           { cover: 0.958, room: 0.042, door: 0.0000 },
    freeway:         { cover: 0.166, room: 0.634, door: 0.0052 },
    lot_and_bigbox:  { cover: 0.207, room: 0.734, door: 0.0024 },
    trailer_park:    { cover: 0.296, room: 0.659, door: 0.0003 },
    golf_and_park:   { cover: 0.107, room: 0.876, door: 0.0005 },
    airport:         { cover: 0.245, room: 0.569, door: 0.0056 },
    solar_and_pumps: { cover: 0.217, room: 0.773, door: 0.0003 },
    landfill:        { cover: 0.150, room: 0.831, door: 0.0004 }
  };

  /* THE TILE KINDS THE VALLEY DRAWS THAT NO RULED ROW COVERS. Named, never
     guessed at. Each one is a real thing in the city that Battle Brothers simply
     has no equivalent for, so inventing an effect for it would be inventing a
     dial, and every felt number is TUNING's (rule 36). */
  var UNRULED = {
    'water-dead': 'a drained pool, a dry fountain, an empty basin. The ruled row is '
      + 'MURKY WATER and this is its opposite: you do not wade it, you climb down '
      + 'into it. Closest to the HEIGHT row read backwards, and nothing measures '
      + 'how deep it is, so it answers UNREAD rather than borrowing a number.',
    panel: 'a solar array. Waist-high, walk-through or not is undecided; Battle '
      + 'Brothers has no half-height obstacle.',
    play: 'playground equipment: a climbing frame, a slide, a swing set. Same shape '
      + 'of question as the panel and a worse one, because you can stand ON a '
      + 'climbing frame and under it, and Battle Brothers has no tile that is '
      + 'cover and a floor at the same height.',
    overhead: 'an awning, a canopy, an overpass deck above you. Battle Brothers has '
      + 'nothing over your head that you are not standing on; on the freeway this '
      + 'is 14% of the drawn cells, so it is not a rounding error.'
  };

  function grounds() {
    return BT ? BT.KINDS.filter(function (k) { return !BT.NOT_ON_THE_MAP[k]; }) : [];
  }

  function isGround(g) { return grounds().indexOf(g) >= 0; }

  /* WHICH RULED ROWS CAN FIRE ON THIS GROUND. A row fires if the ground really
     draws one of the kinds that carries it. `kindsOn` is handed in by the caller
     (the gate measures it off the kits); with nothing handed in, the question is
     answered for the rows that are ground-independent and the rest say so. */
  function rowsOn(ground, kindsOn) {
    if (!isGround(ground)) return { known: false, why: NOT_A_GROUND, ground: ground };
    var fires = [], silent = [];
    Object.keys(ROWS).forEach(function (r) {
      var row = ROWS[r];
      if (!row.ours.length) { silent.push(r); return; }
      if (!kindsOn) { silent.push(r); return; }
      var hit = row.ours.filter(function (k) { return kindsOn.indexOf(k) >= 0; });
      (hit.length ? fires : silent).push(r);
    });
    return { known: true, ground: ground, fires: fires, silent: silent,
             measured: !!kindsOn, ruling: SRC_SCHOOL, tuned: false };
  }

  /* WHAT THIS GROUND DOES TO A FIGHT. */
  function effectOf(ground) {
    if (!isGround(ground)) return { known: false, why: NOT_A_GROUND, ground: ground };
    var d = DRAWN[ground];
    if (!d) return { known: false, why: NO_KIT, ground: ground,
                     because: 'no district kit of this ground can draw a block, so '
                            + 'what a fight on it looks like cannot be measured' };
    return {
      known: true, ground: ground,
      cover: d.cover, room: d.room, door: d.door,
      ruling: SRC_DRAWN, tuned: false,
      /* the two numbers next door, looked up live, never restated here */
      travel: VG ? VG.speedOf(ground) : null,
      sight: VG ? VG.sightOf(ground) : null
    };
  }

  /* THE COST OF A STEP. His ruling, not a measurement, and it says so. */
  function costOf(ground) {
    if (!isGround(ground)) return { known: false, why: NOT_A_GROUND, ground: ground };
    return { known: true, ground: ground, steps: 1,
             ruling: 'EVERYTHING COSTS ONE (Paolo 8/15). Battle Brothers\' 2/3/4 AP '
                   + 'ladder collapses to one step on our boards by his ruling, and '
                   + 'separately no kit draws a rough standable cell, so there is '
                   + 'nothing for a second beat to attach to.',
             tuned: false };
  }

  /* HEIGHT IS UNREAD AND THAT IS NOT THE SAME AS FLAT. */
  function heightOf(ground) {
    if (!isGround(ground)) return { known: false, why: NOT_A_GROUND, ground: ground };
    return { known: false, why: UNREAD, ground: ground,
             because: 'not one district kit records a level, so a ground cannot say '
                    + 'whether it has one. A zero here would read as "this ground is '
                    + 'flat", and the mountain is 96% cliff. COMBAT\'s high ground is '
                    + 'a feature the board generator places, not a fact the ground carries.',
             whose: 'COMBAT [board generator], with the HEIGHT row of ' + SRC_SCHOOL };
  }

  /* THE VALLEY IS DRY, AS A MEASUREMENT. */
  function wet() {
    return { known: true, wetCellsOnAnyGround: 0,
             ruling: SRC_DRAWN,
             because: 'no district kit of any live ground draws a cell of kind '
                    + '`water`. The district named `water` draws dry ground, two '
                    + 'drained basins and three blockers. The only wet water in the '
                    + 'game is in the landmarks module (reservoir, tailrace, Las '
                    + 'Vegas Creek), which is not a district kit and is marked void, '
                    + 'so it is the CLIFFS row and never the SWAMP row.',
             killsRow: 'swamp', tuned: false };
  }

  var API = {
    NOT_A_GROUND: NOT_A_GROUND, UNREAD: UNREAD, NO_KIT: NO_KIT,
    SRC_DRAWN: SRC_DRAWN, SRC_SCHOOL: SRC_SCHOOL,
    ROWS: ROWS, DRAWN: DRAWN, UNRULED: UNRULED,
    grounds: grounds, rowsOn: rowsOn, effectOf: effectOf,
    costOf: costOf, heightOf: heightOf, wet: wet
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.BOH_GROUNDEFFECTS = API;
})(typeof self !== 'undefined' ? self : this);
