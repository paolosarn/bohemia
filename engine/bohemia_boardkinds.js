/* ============================================================================
   BOHEMIA -- WHICH BOARD A MAP CELL FIGHTS ON   (10/10/26, WORLD lane)
   Row [the cells with no board].

   ============================================================================
   *** RULE 12 FIRST, AND THE ROW'S PREMISE WAS WRONG. I WROTE THE ROW. ***
   ============================================================================
   This lane wrote the row last round off its own measurement: 28 of the 78
   district names the thirteen live grounds are made of have no kit that can draw
   a block, "so a fight cut from one of those map cells has nothing to build a
   board out of."

   THAT IS NOT HOW A FIGHT GETS ITS BOARD, and one read of the live code says so.
   The fight never cuts a board from a district kit. The district kits draw the
   WALKED CITY and the painted map. The fight asks `nfKind(district)` for one of
   nine BOARD KINDS and COMBAT's generator deals a board out of its block library
   (records/target/bb/ours.json, board_mix). A district with no kit is not a fight
   with no floor; estate and gated have no kit and both land on `culdesac`, a real
   board, every time.

   So the row as written asked for a fix to something that is not broken, and the
   honest thing is to say so in the first paragraph rather than to find work in it.

   ============================================================================
   *** WHAT IS REALLY BROKEN IS NEXT DOOR, AND IT IS BIGGER. ***
   ============================================================================
   `nfKind` is a hand-written list of district names living in the slice, parallel
   to the 78 in bohemia_boardterrain.js, with nothing binding them together. Run
   every live district through it:

     ruin         24 districts   <- the catch-all, and THE BIGGEST BUCKET
     strip        15
     landfill     11
     suburb        8
     scrub         6
     shore         6
     culdesac      3
     wash          2
     freeway       2
     suburb_stem   1

   TWENTY-FOUR OF THE SEVENTY-EIGHT FALL THROUGH TO `ruin`. That is more than any
   real kind gets, and `ruin` is a real block in the city family, so the fight
   works -- it just always leads with the same block. Measured over twenty rolled
   valleys: 154 cells a valley, 1.67% of the map.

   WHO IS IN IT MATTERS MORE THAN HOW MANY. The airport and the airbase (99 cells
   a valley between them, the biggest single set-piece in the valley). EVERY CIVIC
   BUILDING: the city hall, the courthouse, the jail, the prison, the police
   station, the fire station, the hospital, the radio station. The speedway and
   the stadium. AND THREE OF THE SIX LEGENDARY GEAR PLACES this lane shipped on
   10/9 -- the arsenal, the data fortress and the granary -- the places guarded by
   up to sixty men with the best gear in the game. They all open the same fight.

   That is rule 46 (NO TWO COMBAT BOARDS ARE THE SAME) failing a level up from
   where it is checked: the board still varies, because the other one or two
   blocks are shuffled, but THE THING THE PLACE IS always reads as a ruin.

   And because the two lists are only held together by hand, every district WORLD
   adds becomes a ruin silently. The fight's list already knows one name (`beltway`)
   that no live ground uses, which is the same drift running the other way.

   ============================================================================
   WHAT THIS FILE DOES NOT DO: PICK A STAND-IN.
   ============================================================================
   The obvious next move is to give each of the 24 the existing kind whose boards
   are closest in how blocked they are. I built that and threw it away: it matches
   the courthouse and the jail to `culdesac` because both are about 30% blocked,
   and a jail that fights like a cul-de-sac is WORSE than the ruin it replaces,
   because it is confidently wrong. That is [bb places]' 9/25 defect and the
   god-gear round's own mistake (10/9): dressing a reading up as a measurement.
   `standInFor()` answers NO_RULING and names COMBAT.

   WHAT IT DOES INSTEAD is say which BLOCK IS MISSING, which is a fact about the
   block library rather than a guess about the map. The 24 are three families and
   the library has no block for any of them. The grouping is a reading of what the
   real buildings are, and it is STATED AS MINE with tuned:false, not smuggled in
   as arithmetic.

   NO SECOND LIST: the districts come from bohemia_boardterrain.js live, and the
   fight's own mapping is parsed out of the slice by the gate on every run, so
   this file cannot drift from either.

     node gates/board_kinds_gate.js
   ========================================================================== */
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var BT = HASREQ ? require('./bohemia_boardterrain.js') : (root.BOH_BOARDTERRAIN || null);
  if (BT && BT.BOH_BOARDTERRAIN) BT = BT.BOH_BOARDTERRAIN;

  var NO_RULING = 'NO_RULING';
  var NOT_A_DISTRICT = 'NOT_A_DISTRICT';
  var CATCH_ALL = 'ruin';

  var SRC_SLICE = 'nfKind() in slices/BOHEMIA_ALPHA_0_9.html, the live fight\'s own '
    + 'district-to-board-kind mapping (COMBAT [rebuild] round two, 2b16ed5). Mirrored '
    + 'here as DATA so the two can be held together by a machine; the gate parses the '
    + 'slice on every run and goes red if they differ by one name.';
  var SRC_MIX = 'records/target/bb/ours.json board_mix: the block families COMBAT\'s '
    + 'generator deals from. `ruin` is a real block of the city family, so a '
    + 'fall-through is a same-looking fight, never a broken one.';

  /* THE FIGHT'S OWN MAPPING, MIRRORED. Order matters: the live code tests in this
     order and returns on the first hit. Changing a name here without changing the
     slice turns the gate red, which is the whole point of writing it down. */
  var RULES = [
    { kind: 'strip',       names: ['strip', 'resort', 'casino', 'commercial', 'mall', 'downtown',
                                   'convention', 'luxor', 'sphere', 'highroller', 'strat', 'sign',
                                   'truckstop', 'swapmeet', 'drivein'] },
    { kind: 'freeway',     names: ['freeway', 'beltway', 'interchange'] },
    { kind: 'shore',       names: ['water', 'reservoir', 'intake', 'dam', 'springs', 'waterpark'] },
    { kind: 'landfill',    names: ['landfill', 'quarry', 'gypsum', 'industrial', 'warehouse',
                                   'robofactory', 'boneyard', 'fueldepot', 'storage', 'rail', 'railyard'] },
    { kind: 'wash',        names: ['wash', 'basin'] },
    { kind: 'scrub',       names: ['desert', 'mountain', 'solar', 'farm', 'park', 'golf'] },
    { kind: 'culdesac',    names: ['estate', 'gated', 'trailer'] },
    { kind: 'suburb_stem', names: ['arterial'] },
    { kind: 'suburb',      names: ['suburb', 'apartment', 'town', 'school', 'campus',
                                   'library', 'chapel', 'cemetery'] }
  ];

  /* THE THREE FAMILIES THE FALL-THROUGHS ARE, AND THE BLOCK EACH ONE WANTS.
     *** THIS GROUPING IS A READING AND IT IS MINE. *** It is what the real
     buildings are, not a number: a courthouse and a jail are the same KIND of
     place to fight in (a public counter, then corridors, then cells and offices)
     and neither is a cul-de-sac. Stated out loud rather than derived from a
     percentage, because deriving it from a percentage is exactly what this lane
     caught itself doing on 10/9 and said it would not ship again. tuned:false:
     whether these blocks get cut, and what they look like, is COMBAT's. */
  var FAMILIES = {
    civic: {
      mine: true, tuned: false,
      is: 'a building the public walks into: a counter at the front, corridors '
        + 'behind it, offices and cells and wards off those. The fight is indoors '
        + 'and the door is the whole problem.',
      districts: ['cityhall', 'courthouse', 'jail', 'prison', 'policestation',
                  'firestation', 'medical', 'radio'],
      wantsABlock: 'A CIVIC INTERIOR: a counter, a corridor spine, small rooms either side.'
    },
    infrastructure: {
      mine: true, tuned: false,
      is: 'a big flat paved expanse with one or two enormous sheds on it and a '
        + 'fence round the lot. Nothing to hide behind for a hundred metres and '
        + 'then a wall.',
      districts: ['airport', 'airbase', 'speedway', 'minigp', 'stadium', 'ballpark', 'terminal'],
      wantsABlock: 'AN APRON: open paved ground, one long shed, a perimeter fence.'
    },
    plant: {
      mine: true, tuned: false,
      is: 'a fenced compound of tanks, sheds and a wall, built to be secured. '
        + 'Every one of these is somewhere somebody is still guarding.',
      districts: ['arsenal', 'datafort', 'granary', 'fort', 'battery',
                  'substation', 'pumpstation', 'reclaim', 'watertreat'],
      wantsABlock: 'A COMPOUND: a wall with one gate, tanks and sheds inside it.'
    }
  };

  function districts() {
    if (!BT) return [];
    var out = {}, live = BT.KINDS.filter(function (k) { return !BT.NOT_ON_THE_MAP[k]; });
    live.forEach(function (g) { (BT.FROM[g] || []).forEach(function (d) { out[d] = g; }); });
    return out;
  }

  /* THE FIGHT'S ANSWER FOR A DISTRICT, by the mirrored rules in their own order. */
  function kindOf(district) {
    var d = String(district || '');
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i].names.indexOf(d) >= 0) {
        return { known: true, district: d, kind: RULES[i].kind, catchAll: false, ruling: SRC_SLICE };
      }
    }
    return { known: true, district: d, kind: CATCH_ALL, catchAll: true,
             ruling: SRC_SLICE, because: SRC_MIX };
  }

  /* EVERY LIVE DISTRICT THAT LANDS ON THE CATCH-ALL, with the ground it sits on. */
  function fallThrough() {
    var g = districts(), out = [];
    Object.keys(g).sort().forEach(function (d) {
      if (kindOf(d).catchAll) out.push({ district: d, ground: g[d], family: familyOf(d) });
    });
    return out;
  }

  function familyOf(district) {
    var hit = null;
    Object.keys(FAMILIES).forEach(function (f) {
      if (FAMILIES[f].districts.indexOf(district) >= 0) hit = f;
    });
    return hit;
  }

  /* *** AND IT REFUSES TO GUESS. *** */
  function standInFor(district) {
    var g = districts();
    if (!g[district]) return { known: false, why: NOT_A_DISTRICT, district: district };
    if (!kindOf(district).catchAll) {
      return { known: true, district: district, kind: kindOf(district).kind,
               note: 'this one already has a board kind of its own' };
    }
    return {
      known: false, why: NO_RULING, district: district, whose: 'COMBAT [board generator]',
      family: familyOf(district),
      wantsABlock: familyOf(district) ? FAMILIES[familyOf(district)].wantsABlock : null,
      because: 'picking an existing kind for this by matching how blocked it is gives a '
             + 'courthouse that fights like a cul-de-sac, which is worse than the ruin it '
             + 'would replace because it is confidently wrong. The answer is a new block, '
             + 'named above, and cutting it is COMBAT\'s.'
    };
  }

  /* THE NAMES THE FIGHT'S LIST KNOWS THAT NO LIVE GROUND USES: drift, the other way. */
  function ghosts() {
    var g = districts(), out = [];
    RULES.forEach(function (r) { r.names.forEach(function (n) { if (!g[n]) out.push(n); }); });
    return out.sort();
  }

  var API = {
    NO_RULING: NO_RULING, NOT_A_DISTRICT: NOT_A_DISTRICT, CATCH_ALL: CATCH_ALL,
    SRC_SLICE: SRC_SLICE, SRC_MIX: SRC_MIX,
    RULES: RULES, FAMILIES: FAMILIES,
    districts: districts, kindOf: kindOf, fallThrough: fallThrough,
    familyOf: familyOf, standInFor: standInFor, ghosts: ghosts
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.BOH_BOARDKINDS = API;
})(typeof self !== 'undefined' ? self : this);
