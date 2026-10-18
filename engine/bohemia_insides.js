/* ============================================================================
   BOHEMIA -- THE VALLEY'S INSIDES, AS ONE TABLE   (10/10/26, WORLD lane)
   Row [the valley has no inside].

   ============================================================================
   *** RULE 12: THE ROW IS WRONG AND I WROTE IT. THE VALLEY HAS AN INSIDE AND
   *** HAS HAD ONE SINCE 7/26.
   ============================================================================
   The row says "across all 50 district kits, of 813 named pieces 256 are things
   you can stand on and ZERO are the floor of a room, so every building in the
   valley is solid to the touch."

   That measurement is correct and it is about ONE LAYER. The district kits are
   the OUTDOOR tilesets: they draw the block from above and a building in them is
   a footprint. They were never where an inside lives.

   The inside lives in engine/bohemia_floorplan.js, which has been there since
   7/26 and is green in the suite (FLOORPLAN, INTERIOR GROUND). Asked for the
   city hall's real footprint it returns 204 FLOOR CELLS, 97 of wall and 7 doors,
   laid out as a hall, a reception, an office, a records room and a bath. There
   is a district -> room-grammar table (DISTGEN in engine/bohemia_world.js, this
   lane's own file) covering 62 OF THE 78 LIVE DISTRICTS, eleven zones, and a law
   behind it: INTERIOR-MATCHES-EXTERIOR (Paolo 7/19, LOCKED, "if your interior
   does not match the width and length of the exterior every time, you are
   failing"), gated by world_gate.js and interiors_gate.js.

   SO THAT IS THREE ROUNDS RUNNING WHERE RULE 12 FOUND THE PREMISE WRONG, AND THE
   SECOND TIME THE PREMISE WAS ONE I WROTE MYSELF. Rule 74 has this lane write its
   own next row from its own measurement, and a premise with my own name on it is
   the one I do not go back and check. Both times the measurement was right and
   the sentence I built on it reached past the layer I had measured. Written down
   here rather than in a handoff, because it is the third one.

   ============================================================================
   WHAT IS REALLY WRONG: THE TABLE EXISTS TWICE AND THE COPIES DISAGREE.
   ============================================================================
   The engine's DISTGEN and the CITY app's IN_ZONE are two hand-kept copies of
   one table. Measured:

     sign            in the engine, not in the app at all
     campus          engine says school         app says institutional
     firestation     engine says firehouse      app says institutional
     policestation   engine says civic          app says institutional
     school          engine says school         app says institutional
     terminal        engine says transit        app says institutional

   The pattern is one-way: every disagreement collapses a specific grammar into
   the generic `institutional`, so THE APP IS HOLDING THE OLD TABLE. WORLD added
   five specific room grammars and the thing that builds the rooms never learned
   them.

   WHAT THAT MEANS ON THE GLASS: `institutional` is a ward, a ward, a service
   room, an office and a bath. SO A POLICE STATION IS GENERATED WITH TWO HOSPITAL
   WARDS IN IT. So is a fire station, whose own grammar -- a garage and an office
   -- exists and is never used. So is a school. So is a bus terminal, whose
   grammar is a concourse and a counter.

   FIVE ROOM GRAMMARS THAT WORK, AND NOTHING CAN REACH THEM. That is the same
   disease as last round's casino block: built, correct, wired to nothing. Two
   rounds, two systems.

   ============================================================================
   AND SIXTEEN LIVE DISTRICTS HAVE NO ROOM GRAMMAR AT ALL, WHICH IS TWO THINGS.
   ============================================================================
   SEVEN OF THEM SHOULD NOT HAVE ONE and their absence is correct, because they
   are not buildings: desert, mountain, springs, water, freeway, interchange,
   arterial.

   NINE OF THEM OWE ONE: airport, airbase, highroller, luxor, sphere, strat,
   rail, robofactory, strip. FOUR OF THOSE ARE THE STRIP'S OWN CASINOS -- the
   Luxor, the Sphere, the Stratosphere, the High Roller -- which have no inside
   in a game whose one hand-made interior board is a casino floor.

   And seven of the nine cannot simply be given a zone: a DISTGEN row needs a kit
   module and a footprint function, and airport, airbase, highroller, luxor,
   sphere, strat and robofactory have no kit module at all (measured 10/10, and
   it is the open row [the cells with no board]'s own list). Only `rail` and
   `strip` have a kit and no grammar, so only those two are a one-line add.

   THE SPLIT INTO SEVEN-CORRECT AND NINE-OWED IS A READING AND IT IS MINE, with
   tuned:false. Which zone each of the nine gets is not decided here: that is
   content, and the mechanism is what ships.

   NO SECOND COPY OF THE TABLE IS MADE HERE. This file holds no district-to-zone
   map of its own. It reads DISTGEN, and the gate reads DISTGEN and the app and
   compares all of it, so the day the two agree this module says so without being
   edited.

     node gates/the_insides_gate.js
   ========================================================================== */
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var BK = HASREQ ? require('./bohemia_boardkinds.js') : (root.BOH_BOARDKINDS || null);
  var FP = HASREQ ? require('./bohemia_floorplan.js') : (root.BohemiaFloorplan || null);
  if (BK && BK.BOH_BOARDKINDS) BK = BK.BOH_BOARDKINDS;

  var NO_GRAMMAR = 'NO_GRAMMAR';
  var NOT_A_DISTRICT = 'NOT_A_DISTRICT';
  var NO_RULING = 'NO_RULING';

  var SRC_DISTGEN = 'DISTGEN in engine/bohemia_world.js, the one district -> room-grammar '
    + 'table this lane owns. Read live by the gate, never copied here.';
  var SRC_FP = 'engine/bohemia_floorplan.js, the interior generator (7/26), under the '
    + 'INTERIOR-MATCHES-EXTERIOR LAW (Paolo 7/19, LOCKED)';

  /* THE DRIFT, as this lane measured it 10/10. The gate re-derives all of it from
     the two live tables on every run; these are here so the record and the data
     file have something to be checked against, and so the ratchet has a number. */
  var DRIFT = {
    missingFromTheApp: ['sign'],
    disagree: {
      campus:        { engine: 'school',    app: 'institutional' },
      firestation:   { engine: 'firehouse', app: 'institutional' },
      policestation: { engine: 'civic',     app: 'institutional' },
      school:        { engine: 'school',    app: 'institutional' },
      terminal:      { engine: 'transit',   app: 'institutional' }
    },
    allOneWay: 'every disagreement collapses a specific grammar into the generic '
             + '`institutional`, so the app is holding the OLD table',
    costsOnTheGlass: 'a police station, a fire station, a school and a bus terminal are '
             + 'each generated with two hospital wards in them, and the firehouse '
             + '(a garage and an office) and transit (a concourse and a counter) '
             + 'grammars exist and are never used',
    ruling: SRC_DISTGEN, tuned: false
  };

  /* THE SIXTEEN WITH NO GRAMMAR, SPLIT. The split is a reading, stated as mine. */
  var NO_GRAMMAR_YET = {
    correctlyNone: {
      districts: ['desert', 'mountain', 'springs', 'water', 'freeway', 'interchange', 'arterial'],
      why: 'not a building. A road, a wash, a mountain and a spring have no inside to '
         + 'generate, and a grammar for one would be a room nobody built.',
      mine: true, tuned: false
    },
    owesOne: {
      districts: ['airport', 'airbase', 'highroller', 'luxor', 'sphere', 'strat',
                  'rail', 'robofactory', 'strip'],
      why: 'every one of these is a building people went inside. FOUR OF THEM ARE THE '
         + 'STRIP\'S OWN CASINOS -- the Luxor, the Sphere, the Stratosphere, the High '
         + 'Roller -- in a game whose one hand-made interior board is a casino floor.',
      blocked: ['airport', 'airbase', 'highroller', 'luxor', 'sphere', 'strat', 'robofactory'],
      blockedBecause: 'a DISTGEN row needs a kit module and a footprint function, and these '
         + 'seven have no kit module at all. That is the open row [the cells with no board]\'s '
         + 'own list, so it is one job and not two.',
      aOneLineAdd: ['rail', 'strip'],
      mine: true, tuned: false
    }
  };

  function districts() { return BK ? BK.districts() : {}; }

  /* WHAT THE INSIDE OF A DISTRICT IS. The grammar is handed in by the caller (the
     gate parses DISTGEN); with nothing handed in this says so rather than keeping
     a second copy of the table. */
  function insideOf(district, distgen) {
    var ds = districts();
    if (!ds[district]) return { known: false, why: NOT_A_DISTRICT, district: district };
    if (!distgen) {
      return { known: false, why: NO_RULING, district: district,
               whose: SRC_DISTGEN,
               because: 'this file keeps no district-to-zone map of its own, because the '
                      + 'whole finding of the row is that the table already exists twice.' };
    }
    var z = distgen[district];
    if (!z) {
      var owes = NO_GRAMMAR_YET.owesOne.districts.indexOf(district) >= 0;
      return { known: false, why: NO_GRAMMAR, district: district,
               owesOne: owes,
               because: owes ? NO_GRAMMAR_YET.owesOne.why : NO_GRAMMAR_YET.correctlyNone.why,
               blocked: NO_GRAMMAR_YET.owesOne.blocked.indexOf(district) >= 0 };
    }
    return { known: true, district: district, zone: z, ruling: SRC_DISTGEN, tuned: false };
  }

  /* AND THE INSIDE IS REAL, PROVED BY RUNNING THE GENERATOR RATHER THAN CLAIMED. */
  function proveAnInside(zone, w, h, seed) {
    if (!FP || typeof FP.generate !== 'function') {
      return { known: false, why: NO_RULING, because: 'the floorplan generator is not here' };
    }
    var p = FP.generate(seed || 1337, w || 22, h || 14, { zone: zone });
    var floor = 0, wall = 0, door = 0;
    (p.grid || []).forEach(function (row) {
      row.forEach(function (c) {
        var g = c && c.g; if (g === 'floor') floor++; else if (g === 'wall') wall++; else if (g === 'door') door++;
      });
    });
    return { known: true, zone: zone, w: p.W, h: p.H, floor: floor, wall: wall, door: door,
             rooms: (p.rooms || []).map(function (r) { return r.role; }),
             ruling: SRC_FP };
  }

  var API = {
    NO_GRAMMAR: NO_GRAMMAR, NOT_A_DISTRICT: NOT_A_DISTRICT, NO_RULING: NO_RULING,
    SRC_DISTGEN: SRC_DISTGEN, SRC_FP: SRC_FP,
    DRIFT: DRIFT, NO_GRAMMAR_YET: NO_GRAMMAR_YET,
    districts: districts, insideOf: insideOf, proveAnInside: proveAnInside
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.BOH_INSIDES = API;
})(typeof self !== 'undefined' ? self : this);
