/* ============================================================================
   BOHEMIA -- SCAVENGE ON THE DIAL: THE RULES (SCAVENGE 11/7/26).
   PAOLO 11/7, YES on the design (VOTE scavenge-the-design-for-his-yes-11-7, rule 426(b)): 'I want it to be like a fun minigame'.
   His three, ONE game (rule 331, LOCKED 11/2): 'Search houses, the detector, the siphon: these are the only ones I liked... depending
   on the map, but somehow involving some rhythm-based game working in the Dead Shot Dial'. The design he said yes to:
   records/BOHEMIA_SCAVENGE_THE_DESIGN_FOR_HIS_YES_11_7_26.md.

   THIS FILE IS THE RULES ONLY: no drawing, no page, nothing of the fight. Node and browser (root.BohemiaScavengeGame). The page that
   plays it is slices/BOHEMIA_SCAVENGE.html; the dial is engine/bohemia_dial.js (the old fight's stamped engine, one module); the
   gate is gates/scavenge_on_the_dial_gate.js.

   WHAT IT DECIDES
   1. THE MAP PICKS THE SPOTS, from the dealt board's own tiles (the board a fight on this block deals): a house tile (a roof, level 1
      or more) -> SEARCH, from the open tile at its door; a tile with a dead car on it (a cover piece named *car*) -> SIPHON, from the
      open tile beside it; open dirt or a yard by the houses (level 0, no cover, rough first) -> DETECTOR, on the tile itself. Never a
      list of places: a block with no cars has no siphon. At most SIX at once, never more than the lot's count says is left, at least
      one of each kind the board has, the rest in turn, nearest the crew first.
   2. THE THREE WAYS ON THE ONE DIAL (the old fight's engine, its 52 patterns and five packages, the middle on the downbeat):
      SEARCH   one tap, the bands shown (the old shot);
      DETECTOR one tap, the bands hidden: the beeps fill in on the 120 grid as the needle nears the middle (one a beat, two, four, then
               one long tone in the dead centre);
      SIPHON   hold, the needle climbs from the edge a gulp a beat and reaches the middle on a beat; let go in it. Hold past the middle
               and it is a mouthful: nothing. (The old dial's press-hold-release, WITHOUT greed: no speed-up, no x3; rule 331.)
   3. WHAT HE GETS (the design's question, left unanswered with his YES: its lead, A, what the place really holds, is built; his to
      correct): always ONE thing or nothing (EVERYTHING COSTS ONE; WORLD's scavenge call 1). Dead centre the best thing there, amber an
      ordinary thing, blue the least, out nothing. A house: meds / food / tape. The ground (a detector hears METAL): batteries / rounds
      / tape (tools). A car: its gas, traded for a battery / a can of food under the seat / tape out of the trunk.
   NOT HERE (rule 331, not approved): a noise meter, anyone coming, hours per search, a chain, greed, loot by district. The outing
   costs what the SCAVENGE button already cost (four hours, once), paid by the screen that opens it.
   Words: none here; the finds' names are the settlement screen's own lines (draft:true).
   ============================================================================ */
(function (root) {
  'use strict';
  var MAX_SPOTS = 6;
  var GIVE_UP_BEATS = 16;          /* four bars on the dial and no press: he gives up, nothing */
  var ARM_BEATS = 1;               /* the dial opens on a downbeat with the needle at rest in the middle; a press before one beat has
                                      passed is not taken (the middle comes round again on the next ONE) */
  var SIPHON_BEATS = { 0: 8, 1: 4, 2: 4, 3: 2, 4: 2 };     /* edge to middle, in beats, by package (EASY two bars ... BOHEMIAN half a bar) */
  var SIPHON_SHAKE = { 0: 0, 1: 0, 2: 0.06, 3: 0, 4: 0.06 };  /* HARD and BOHEMIAN: the hose kicks (a share of LIM) */
  var FINDS = {
    house:  { kill: 'medicine', vital: 'food', hit: 'tape' },
    ground: { kill: 'battery',  vital: 'ammo', hit: 'tape' },
    car:    { kill: 'battery',  vital: 'food', hit: 'tape' }
  };
  var ZONE_WORD = { kill: 'DEAD CENTRE', vital: 'GOOD', hit: 'SCRAPS', miss: 'NOTHING' };

  function rng(seed) { var s = (seed >>> 0) || 1; return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }

  /* ------------------------------------------------------------------ 1. the spots, from the dealt board
     board: { w, h, tiles: [[{ lvl, pass, terr, cover }]] } (cover: the cover piece's name or ''), crew: [{ x, y }] */
  /* a dead car: a cover piece that IS a car (yards_car, strip_car, car_kerb, ...), never the carts (a golf cart runs on batteries, a
     luggage cart on nothing) */
  function carAt(t) { return !!(t && t.cover && /(^|_)car(_|$)/i.test(t.cover)); }
  function at(board, x, y) { return x >= 0 && y >= 0 && x < board.w && y < board.h ? board.tiles[y][x] : null; }
  /* A HOUSE: on a board laid from the map, the map's own house or shop (the fight's FIGHT.isRoof reads the map's roofs there); on a
     template board, a raised tile of a block of built ground. Raised LAND is never a house: the canyon's shelves, the desert's and the
     wash's rises, a freeway's deck, the rail bed, a landfill's pile (slices/fight_ground/fight_ground.json's block families). */
  var LAND = ['basin', 'canyon', 'desert', 'golf', 'lakebed', 'pass', 'scrub', 'scrubroad', 'shore', 'wash', 'landfill', 'dump', 'freeway', 'freewayo', 'rail'];
  function houseAt(t) {
    if (!t) return false;
    if (t.laid) return !!t.roof;
    return t.lvl > 0 && t.terr !== 'blocked' && !(t.fam && LAND.indexOf(t.fam) >= 0);
  }
  function openTile(t) { return !!(t && t.pass && !(t.lvl > 0) && !t.cover && t.terr !== 'blocked' && t.terr !== 'water'); }
  var ASPHALT = 92;   /* a tile whose own ground reads darker than this on the baked board is road (luma 0..255; the page measures it) */
  function dirt(t) { return openTile(t) && !(t.luma != null && t.luma < ASPHALT); }
  var N4 = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  var N8 = N4.concat([[1, 1], [1, -1], [-1, 1], [-1, -1]]);
  function standBeside(board, x, y, near) {
    var best = null;
    N4.forEach(function (d) { var X = x + d[0], Y = y + d[1], t = at(board, X, Y); if (!openTile(t)) return;
      var k = Math.abs(X - near.x) + Math.abs(Y - near.y) + (d[1] === 1 ? -0.5 : 0);   /* the front (south, toward the camera) first */
      if (!best || k < best.k) best = { x: X, y: Y, k: k }; });
    return best;
  }
  function candidates(board, near) {
    var out = { house: [], ground: [], car: [] }, built = false;
    for (var yy = 0; yy < board.h && !built; yy++) for (var xx = 0; xx < board.w; xx++) if (houseAt(at(board, xx, yy))) { built = true; break; }
    for (var y = 0; y < board.h; y++) for (var x = 0; x < board.w; x++) {
      var t = at(board, x, y); if (!t) continue;
      if (houseAt(t)) {
        /* A COMBAT TILE IS A HOUSE (Paolo 9/4, 9/28): every roof tile is one house to search, from the open tile at its door */
        var sd = standBeside(board, x, y, near);
        if (sd) out.house.push({ kind: 'house', x: x, y: y, sx: sd.x, sy: sd.y });
      } else if (carAt(t)) {
        var s2 = standBeside(board, x, y, near); if (s2) out.car.push({ kind: 'car', x: x, y: y, sx: s2.x, sy: s2.y });
      } else if (dirt(t)) {
        var byHouse = false, byCar = false;
        N8.forEach(function (d) { var u = at(board, x + d[0], y + d[1]); if (houseAt(u)) byHouse = true; if (carAt(u)) byCar = true; });
        /* in a built block: the yards by the houses and the rough lots; on open land (no house on the board), any dirt */
        if (!byCar && (t.terr === 'rough' || byHouse || !built)) out.ground.push({ kind: 'ground', x: x, y: y, sx: x, sy: y, rough: t.terr === 'rough' });
      }
    }
    return out;
  }
  function centroid(crew) {
    if (!crew || !crew.length) return { x: 0, y: 0 };
    var x = 0, y = 0; crew.forEach(function (c) { x += c.x; y += c.y; }); return { x: x / crew.length, y: y / crew.length };
  }
  function spots(board, o) {
    o = o || {};
    var n = Math.max(0, Math.min(MAX_SPOTS, o.n == null ? MAX_SPOTS : o.n | 0));
    var near = o.near || centroid(board.crew), r = rng(o.seed || 1), C = candidates(board, near);
    var crewAt = {}; (board.crew || []).forEach(function (c) { crewAt[c.x + ',' + c.y] = 1; });
    var dist = function (s) { return Math.hypot(s.sx - near.x, s.sy - near.y) + (s.rough ? -0.5 : 0) + r() * 0.8; };
    ['house', 'ground', 'car'].forEach(function (k) {
      C[k] = C[k].filter(function (s) { return !crewAt[s.sx + ',' + s.sy] && !crewAt[s.x + ',' + s.y] && (!o.keep || o.keep(s)); })   /* o.keep: the page keeps the spots it can show (on the glass, clear of the plate) */
        .map(function (s) { s.d = dist(s); return s; }).sort(function (a, b) { return a.d - b.d; });
    });
    var kinds = ['house', 'ground', 'car'].filter(function (k) { return C[k].length; })
      .sort(function (a, b) { return C[b].length - C[a].length; });
    var chosen = [], used = {}, idx = { house: 0, ground: 0, car: 0 };
    /* two spots never share a tile or a stand, and never sit side by side (their marks and labels would touch) */
    var clash = function (s) { return chosen.some(function (c) { return Math.abs(c.x - s.x) + Math.abs(c.y - s.y) <= 1 || (c.sx === s.sx && c.sy === s.sy) || (c.sx === s.x && c.sy === s.y) || (s.sx === c.x && s.sy === c.y); }); };
    var guard = 0;
    while (chosen.length < n && kinds.length && guard++ < 200) {
      for (var i = 0; i < kinds.length && chosen.length < n; i++) {
        var k = kinds[i], L = C[k];
        while (idx[k] < L.length && clash(L[idx[k]])) idx[k]++;
        if (idx[k] >= L.length) { kinds.splice(i, 1); i--; continue; }
        var s = L[idx[k]++]; s.id = k + ':' + s.x + ',' + s.y; delete s.d; chosen.push(s); used[s.id] = 1;
      }
    }
    return chosen;
  }

  /* ------------------------------------------------------------------ 2. the three ways */
  function dial() { return root.BohemiaDial || (typeof require === 'function' ? require('../engine/bohemia_dial.js') : null); }
  function zoneOf(angle) { var D = dial(); return D.zoneOf({ angle: angle }); }
  /* the detector's ear: how many beeps a beat at this needle (Infinity = the one long tone of the dead centre) */
  function beepsPerBeat(angle) {
    var z = zoneOf(angle); return z === 'kill' ? Infinity : z === 'vital' ? 4 : z === 'hit' ? 2 : 1;
  }
  /* the siphon's needle: b beats since the draw began (it begins on a beat); from -LIM through the middle (at SIPHON_BEATS) and on */
  function siphonAngle(b, pkg) {
    var D = dial(), LIM = D.K.LIM, n = SIPHON_BEATS[pkg] != null ? SIPHON_BEATS[pkg] : 4, sh = SIPHON_SHAKE[pkg] || 0;
    var a = -LIM + (LIM / n) * Math.max(0, b);
    if (sh) a += Math.sin(b * Math.PI * 2 * 0.75) * sh * LIM * Math.min(1, b / n);
    return a;
  }
  function siphonOver(b, pkg) { return siphonAngle(b, pkg) > dial().K.LIM; }   /* past the far edge: he let it run into his mouth */
  function siphonBeats(pkg) { return SIPHON_BEATS[pkg] != null ? SIPHON_BEATS[pkg] : 4; }
  function findOf(kind, zone) { return zone && zone !== 'miss' && FINDS[kind] ? FINDS[kind][zone] || null : null; }
  /* the resolution contract's row (engine/bohemia_engine.js CombatBridge: outcome killshot | hit | miss, zone, greedMult, patMeta) */
  function result(spot, zone, extra) {
    var D = dial();
    return Object.assign({ outcome: D.outcomeOf(zone), zone: zone, greedMult: 1, kind: spot.kind, spot: spot.id, got: findOf(spot.kind, zone), word: ZONE_WORD[zone] || '' }, extra || {});
  }

  var API = {
    MAX_SPOTS: MAX_SPOTS, GIVE_UP_BEATS: GIVE_UP_BEATS, ARM_BEATS: ARM_BEATS, SIPHON_BEATS: SIPHON_BEATS, FINDS: FINDS, ZONE_WORD: ZONE_WORD,
    candidates: candidates, spots: spots, dirt: dirt, houseAt: houseAt, LAND: LAND, ASPHALT: ASPHALT, centroid: centroid, zoneOf: zoneOf, beepsPerBeat: beepsPerBeat,
    siphonAngle: siphonAngle, siphonOver: siphonOver, siphonBeats: siphonBeats, findOf: findOf, result: result, carAt: carAt, openTile: openTile
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.BohemiaScavengeGame = API;
})(typeof window !== 'undefined' ? window : this);
