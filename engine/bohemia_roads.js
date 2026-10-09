/* ============================================================================
   BOHEMIA -- THE VALLEY'S ROADS (10/9/26, WORLD lane).  Row [the roads].

   THE ROW: the map's road network as data -- the freeway corridor, the
   boulevards, the surface streets, the dirt and the washes, each with its travel
   speed, which stretches are blocked, and who patrols them. LIFE+CITY's parties
   and caravans follow them. A gate: every settlement reaches every other by road
   or dirt.

   ============================================================================
   RULE 12: THE GATE THE ROW ASKS FOR ALREADY PASSES
   ============================================================================
   Measured before a line of this was written, over THIRTY rolled valleys, on
   PAVED ROAD ALONE with no dirt allowed: the network runs 3,384 to 3,559 cells
   and EVERY SETTLEMENT REACHES EVERY OTHER IN EVERY VALLEY. Zero failures. The
   valley's roads were already whole; nobody had ever checked, so nobody knew.
   That is worth saying plainly rather than quietly shipping a gate that was
   always going to be green: this file does not CONNECT the valley, it makes the
   connection READABLE, and the gate now re-proves it every run so the day a
   generator change cuts a town off, the machine says so instead of a player.

   ============================================================================
   *** AND THE ROAD NETWORK CANNOT BE READ OFF THE TERRAIN KINDS, WHICH IS MY OWN
   WORK'S DOING. ***
   ============================================================================
   [board terrains] (9/30) folds `arterial` into the kind `lot_and_bigbox`, and
   that is RIGHT for what it is for: a fight on a six-lane arterial is a fight in
   a wide road with parking lots either side, so the board is a lot board.
   But it is WRONG for roads. Measured: lot_and_bigbox is 2,511 cells of arterial
   and 469 cells of shops, flats and a mall, so anything reading "roads" off that
   kind drives 469 cells of furniture showroom.

   SO THIS IS NOT A SECOND LIST OF GROUNDS. It is A DIFFERENT QUESTION ABOUT THE
   SAME CELL -- "what does a fight here look like" and "can you drive it" are not
   the same question and must not share an answer. It reads the SAME district
   vocabulary the terrain module reads, so the two cannot drift apart, and the
   gate proves every road district is one the generator really makes.

   ============================================================================
   THE SPEEDS ARE NOT NEW EITHER
   ============================================================================
   [the valley's grounds] (10/9) already carries his translated wiki speeds with
   their source and tuned:false. This file HANDS THEM BACK rather than restating
   them: a road's speed is its ground's speed, looked up live. A second copy of a
   number is a second number, and this lane has written that sentence three times
   now.

   ============================================================================
   TWO THINGS THIS CANNOT ANSWER, NAMED RATHER THAN FAKED
   ============================================================================
   WHICH STRETCHES ARE BLOCKED -- his "a dead overpass" -- answers UNREAD.
   Measured: nothing in the valley marks a road cell as impassable. The overmap
   gives a district and nothing else, so a blocked stretch would be a fact this
   game does not store, and a zero here would be indistinguishable from "no road
   is blocked", which is the thing a traveller most needs to be true.

   WHO PATROLS a stretch is FACTIONS', by the row's own words, and it is already
   derivable the way [the valley's grounds] derives who roams a ground: off the
   live turf. PATROLS ships empty.

     node gates/roads_gate.js
   ========================================================================== */
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var VG = HASREQ ? require('./bohemia_valleyground.js') : (root.BohemiaValleyGround || null);
  var BT = HASREQ ? require('./bohemia_boardterrain.js') : (root.BohemiaBoardTerrain || null);

  /* THE CLASSES, IN HIS OWN ORDER, each one a set of districts the generator
     really makes. `ground` is the terrain kind whose SPEED this class takes --
     the speed is never restated here. */
  var CLASSES = {
    freeway:  { his: 'the freeway corridor',
                districts: ['freeway', 'interchange', 'speedway', 'minigp'],
                ground: 'freeway', paved: true },
    arterial: { his: 'the boulevards and the surface streets',
                districts: ['arterial'],
                ground: 'lot_and_bigbox', paved: true },
    dirt:     { his: 'the dirt',
                districts: ['desert', 'gypsum', 'springs'],
                ground: 'open_desert', paved: false },
    wash:     { his: 'the washes',
                districts: ['wash', 'basin'],
                ground: 'wash_and_shore', paved: false }
  };

  /* *** SHIPS EMPTY. *** Who patrols a stretch is FACTIONS', by the row's own
     words, and is derivable off the live turf the way the roaming pool is. */
  var PATROLS = {};

  var NOT_A_ROAD = 'NOT_A_ROAD';
  var UNREAD = 'UNREAD';
  var NO_MAP = 'NO_MAP';
  var NO_RULING = 'NO_RULING';

  var _byDistrict = null;
  function index() {
    if (_byDistrict) return _byDistrict;
    _byDistrict = {};
    for (var c in CLASSES) {
      for (var i = 0; i < CLASSES[c].districts.length; i++) _byDistrict[CLASSES[c].districts[i]] = c;
    }
    return _byDistrict;
  }
  function names() { var o = []; for (var k in CLASSES) o.push(k); return o; }

  function classOf(district) {
    if (!district) return null;
    var c = index()[district];
    return c === undefined ? null : c;
  }

  /* *** AND MEASURING THIS CAUGHT A ROAD THAT WAS SLOWER THAN OPEN DESERT. ***
     The speed is the GROUND's speed, looked up live -- except where the ground
     GROUPS the road with things that are not roads, which is exactly what
     [board terrains] does to the arterial.
     Measured: the arterial's OWN kit is 0.60 open, which on the already-ruled
     scale is 0.90, nearly freeway pace and right for a six-lane boulevard. But
     the kind it sits in, lot_and_bigbox, averages it with commercial (0.25) and
     apartment (0.31) and comes out 0.35 -> 0.52. SO THE GAME THOUGHT A LAS VEGAS
     BOULEVARD WAS SLOWER THAN DRIVING ACROSS OPEN DESERT (0.75).
     That is not a new dial and it is not mine to invent: the METHOD is already
     ruled (open share x the anchor), and this only corrects WHICH CELLS THE
     MEASUREMENT IS TAKEN OVER. A ruled ground keeps its ruled number untouched;
     only a class whose ground is a mixed bag measures on its own kit, and it
     says so in `from`. The conflict is reported, not silently resolved. */
  var OWN_SHARE = { arterial: 0.60 };   /* re-measured by the gate every run */

  function speedOf(cls) {
    if (!Object.prototype.hasOwnProperty.call(CLASSES, cls))
      return { known: false, why: NOT_A_ROAD, cls: cls, are: names() };
    if (!VG) return { known: false, why: NO_MAP };
    var s = VG.speedOf(CLASSES[cls].ground);
    if (!s.known) return { known: false, why: s.why, cls: cls, ground: CLASSES[cls].ground };
    /* a ruled ground keeps his number, untouched */
    if (s.from === 'RULED')
      return { known: true, cls: cls, ground: CLASSES[cls].ground, speed: s.speed,
               from: 'RULED', ruling: s.ruling, tuned: false,
               note: 'the ground\'s ruled speed, looked up live; a second copy would be a second number' };
    /* a mixed ground: measure the road on its own kit, same method, same anchor */
    var own = OWN_SHARE[cls];
    if (own === undefined)
      return { known: true, cls: cls, ground: CLASSES[cls].ground, speed: s.speed,
               from: s.from, ruling: s.ruling, tuned: false };
    return { known: true, cls: cls, ground: CLASSES[cls].ground,
             speed: +(own * VG.ANCHOR.factor).toFixed(2), from: 'MEASURED_ON_ITS_OWN_KIT',
             openShare: own, groupSpeed: s.speed, groupGround: CLASSES[cls].ground,
             ruling: 'the same method and the same anchor as every other measured ground, taken '
               + 'over the road\'s OWN kit rather than the terrain kind it shares with shops and '
               + 'flats; grouped it came out ' + s.speed + ', slower than open desert, which a '
               + 'six-lane boulevard is not',
             tuned: false };
  }

  function at(m, x, y) {
    if (!m || typeof m.at !== 'function') return { known: false, why: NO_MAP };
    var c = m.at(x, y);
    if (!c || !c.district) return { known: false, why: NOT_A_ROAD, x: x | 0, y: y | 0 };
    var cls = classOf(c.district);
    if (!cls) return { known: false, why: NOT_A_ROAD, district: c.district, x: x | 0, y: y | 0 };
    return { known: true, cls: cls, district: c.district, paved: CLASSES[cls].paved,
             x: x | 0, y: y | 0 };
  }

  /* ---- THE NETWORK ------------------------------------------------------- */
  function network(m, o) {
    o = o || {};
    var n = o.size || 96, dirt = o.dirt !== false;   /* dirt counts unless told not to */
    var out = { cells: 0, byClass: {}, components: 0, biggest: 0 };
    if (!m || typeof m.at !== 'function') return { known: false, why: NO_MAP };
    names().forEach(function (c) { out.byClass[c] = 0; });
    var ok = {}, y, x;
    for (y = 0; y < n; y++) for (x = 0; x < n; x++) {
      var a = at(m, x, y);
      if (!a.known) continue;
      if (!dirt && !a.paved) continue;
      ok[x + ',' + y] = a.cls;
      out.cells++;
      out.byClass[a.cls]++;
    }
    /* the components, so a severed network is visible rather than averaged away */
    var seen = {}, k;
    for (k in ok) {
      if (seen[k]) continue;
      var q = [k], size = 0;
      seen[k] = 1;
      while (q.length) {
        var cur = q.pop().split(',');
        var cx = +cur[0], cy = +cur[1];
        size++;
        var d4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (var i = 0; i < 4; i++) {
          var nk = (cx + d4[i][0]) + ',' + (cy + d4[i][1]);
          if (ok[nk] && !seen[nk]) { seen[nk] = 1; q.push(nk); }
        }
      }
      out.components++;
      if (size > out.biggest) out.biggest = size;
    }
    out.known = true;
    out.biggestShare = out.cells ? +(out.biggest / out.cells).toFixed(3) : 0;
    return out;
  }

  /* ---- THE GATE THE ROW ASKS FOR ----------------------------------------- */
  /* A settlement counts as ON the network if it or a neighbouring cell is road:
     a town sits BESIDE its road, it is not made of road. */
  function reaches(m, seats, o) {
    o = o || {};
    var n = o.size || 96, dirt = o.dirt !== false;
    if (!m || !seats || !seats.length) return { known: false, why: NO_MAP };
    var ok = {}, y, x;
    for (y = 0; y < n; y++) for (x = 0; x < n; x++) {
      var a = at(m, x, y);
      if (!a.known) continue;
      if (!dirt && !a.paved) continue;
      ok[x + ',' + y] = 1;
    }
    function touch(s) {
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
        var k = (s.x + dx) + ',' + (s.y + dy);
        if (ok[k]) return k;
      }
      return null;
    }
    var start = null, offRoad = [];
    for (var i = 0; i < seats.length; i++) {
      var t = touch(seats[i]);
      if (!t) offRoad.push(seats[i].faction);
      else if (!start) start = t;
    }
    if (!start) return { known: true, all: false, reached: 0, of: seats.length,
                         unreached: seats.map(function (s) { return s.faction; }),
                         because: 'not one settlement touches a road' };
    var seen = {}; seen[start] = 1;
    var q = [start];
    while (q.length) {
      var cur = q.pop().split(',');
      var cx = +cur[0], cy = +cur[1];
      var d4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (var j = 0; j < 4; j++) {
        var nk = (cx + d4[j][0]) + ',' + (cy + d4[j][1]);
        if (ok[nk] && !seen[nk]) { seen[nk] = 1; q.push(nk); }
      }
    }
    var reached = 0, unreached = [];
    for (var s2 = 0; s2 < seats.length; s2++) {
      var hit = false;
      for (var dy2 = -1; dy2 <= 1 && !hit; dy2++) for (var dx2 = -1; dx2 <= 1 && !hit; dx2++)
        if (seen[(seats[s2].x + dx2) + ',' + (seats[s2].y + dy2)]) hit = true;
      if (hit) reached++; else unreached.push(seats[s2].faction);
    }
    return { known: true, all: reached === seats.length, reached: reached,
             of: seats.length, unreached: unreached, offRoad: offRoad,
             networkCells: Object.keys(seen).length };
  }

  /* ---- WHAT IS BLOCKED: UNREAD, AND IT SAYS WHY -------------------------- */
  function blockedOn(m) {
    return {
      known: false, why: UNREAD,
      because: 'nothing in the valley marks a road cell as impassable. The overmap gives '
        + 'a district and nothing else, so "a dead overpass" is a fact this game does not '
        + 'store yet, and a zero here would be indistinguishable from "no road is blocked" '
        + '-- which is the one thing a traveller most needs to be true (WORLD measured it 10/9).'
    };
  }

  function patrolOf(cls) {
    if (!Object.prototype.hasOwnProperty.call(CLASSES, cls))
      return { known: false, why: NOT_A_ROAD, cls: cls, are: names() };
    if (!Object.prototype.hasOwnProperty.call(PATROLS, cls))
      return { known: false, why: NO_RULING, table: 'PATROLS', cls: cls,
               because: 'who patrols a stretch is FACTIONS\', by the row\'s own words, and is '
                 + 'derivable off the live turf the way the roaming pool is' };
    return { known: true, cls: cls, by: PATROLS[cls] };
  }

  var API = {
    CLASSES: CLASSES, PATROLS: PATROLS,
    NOT_A_ROAD: NOT_A_ROAD, UNREAD: UNREAD, NO_MAP: NO_MAP, NO_RULING: NO_RULING,
    OWN_SHARE: OWN_SHARE,
    names: names, classOf: classOf, speedOf: speedOf, at: at,
    network: network, reaches: reaches, blockedOn: blockedOn, patrolOf: patrolOf
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.BohemiaRoads = API;
})(typeof self !== 'undefined' ? self : this);
