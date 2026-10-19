/* ============================================================================
   THE REAL CORNER  (WORLD, 10/19/26; row [the dam in one place], ONE-HOOVER-DAM-ONE-BOULDER-CITY)
   Record: records/BOHEMIA_WORLD_THE_DAM_IN_ONE_PLACE_10_18_26.md (round two, section 7)

   A CANDIDATE, NOT THE GAME. The roll (engine/bohemia_overmap.js, Paolo's 7/5 layout) lays Lake Las Vegas,
   Boulder City, Hoover Dam, Lake Mead and the intake inside the valley's own corner, about five km from the
   Strip, while the region (engine/BOHEMIA_REGION_LAND.json) carries the real ones 22 to 41 km out where they
   are. One place twice. Where the corner rule is his, the change is his vote, so NOTHING CALLS THIS: the roll
   is untouched, and this answers what the corner would be if he says yes.

   WHAT IT DOES: takes a built overmap and turns each cell of the five pieces into the ground that is really
   in that corner of the valley, in place, the same footprint:
     Lake Mead, the dam, the intake  -> mountain   the rim hills that stand there
     Boulder City                    -> gated      the edge of town on those hills
     Lake Las Vegas                  -> basin      a flood basin, where the wash already ends
   On the game's seed the corner is the real south-east (south Henderson), so the names are real:
     THE MCCULLOUGH FOOTHILLS (Black Mountain, 5,093 ft, the range's north end, 7 km south of the corner),
     MACDONALD HIGHLANDS (the guard-gated hills of south Henderson, 2,300 to 3,200 ft; a lot in it sits at
     36.0007 N, 115.053 W, which is block 74,86 of the box in real order, seven blocks from the piece it replaces),
     THE PITTMAN BASINS (the flood district's basins at the foot of Black Mountain; the Pittman Wash drains
     Henderson to the Las Vegas Wash and the lake).
   On a seed where the roll put the cluster in another corner (127 of 210, [the roll]'s own finding: the
   cluster rolls axisFlip and the mirror apart from the compass), the same kinds with plain words and
   named:false, never a real name guessed.

   WHY IT MOVES NO CAPITAL WHERE THE CLUSTER IS ON THE SOUTH BORDER (measured, the record's section 7): the faction
   seats are picked from the cells districtsOf() keeps, the buildable ('sand') cells that front a road, in scan
   order, and the spread fallback picks by POSITION in that list. Every change here keeps a cell's class (water,
   dam and intake stay unbuildable as mountain and basin; the town stays buildable as gated) and touches no road,
   so the list is the same cells in the same order, and 'town' to 'gated' is a kind no faction's home list names.
   On the game's seed and every south-border seed (169 of 210): 0 capitals move, 0 streets stop dead.
   THE ONE PLACE A ROAD IS TOUCHED: a town is BIG (a street may end at it), a gated block is not, so a street that
   ended at the town is carried on through the houses (carryStreets). It never happens on a south-border seed; on
   the 41 seeds where the roll puts the cluster on the side edge (axisFlip) it does, and those streets move capitals
   on 35 of them and leave 12 short stubs. That is [the roll]'s own finding (drop axisFlip), not this file's to hide.

   USE IT:  var C = require('./engine/bohemia_the_real_corner.js');
            var m = OM.buildOvermap(seed); var said = C.apply(m);   // m is changed in place
            said -> { corner: 'SE', named: true, changed: 84, pieces: [{key, from, to, name, what, cells}] }
   ========================================================================== */
(function (global) {
  'use strict';

  /* what each piece is in the roll, and what it becomes; `was` is the only kind a cell is turned from, so a
     street the grid punched through a soft piece, or anything else that landed there, is left as it is */
  var PIECES = [
    { key: 'mead',    was: ['water'],  to: 'mountain', real: 'LAKE MEAD' },
    { key: 'damR',    was: ['dam'],    to: 'mountain', real: 'HOOVER DAM' },
    { key: 'intake',  was: ['intake'], to: 'mountain', real: 'THE INTAKE' },
    { key: 'boulder', was: ['town'],   to: 'gated',    real: 'BOULDER CITY' },
    { key: 'lakeLV',  was: ['water'],  to: 'basin',    real: 'LAKE LAS VEGAS' }
  ];

  /* THE WORDS. The south-east is the game's seed and the real corner the 7/5 layout meant ('Charleston NW,
     dam SE'); every name in it is a real place inside the box, draft:true (words get an attempt). */
  var NAMES = {
    SE: {
      mead:    { name: 'THE MCCULLOUGH FOOTHILLS', what: 'the north end of the range; Black Mountain stands over it, 5,093 feet, and the flood water comes off it into town' },
      damR:    { name: 'THE MCCULLOUGH FOOTHILLS', what: 'the same hills; the old maps drew a dam here, and the real one is forty km on' },
      intake:  { name: 'THE MCCULLOUGH FOOTHILLS', what: 'the same hills, where the cut for the pipe would have gone' },
      boulder: { name: 'MACDONALD HIGHLANDS',      what: 'the guard-gated hills of south Henderson; the houses climb the ridge they call the Sleeping Dragon' },
      lakeLV:  { name: 'THE PITTMAN BASINS',       what: 'the flood basins at the foot of Black Mountain; the wash ends in them and they hold a monsoon' }
    }
  };
  var PLAIN = {
    mountain: { name: 'THE RIM HILLS',     what: 'the hills at the edge of the valley' },
    gated:    { name: 'THE EDGE OF TOWN',  what: 'the last houses before the hills' },
    basin:    { name: 'A FLOOD BASIN',     what: 'where the wash ends and the storm water sits' }
  };

  /* the valley's compass, the region file's own rule: east is x1 when the 15 runs west of the Strip, else x0 */
  function compassOf(L) { return { e: (L.fwyX < L.stripX) ? 'x1' : 'x0' }; }

  /* which real corner the cluster sits in: Lake Mead's centre, x through the compass, y never mirrors */
  function cornerOf(L, n) {
    var R = L.mead, N = n || 96, cx = R.x + R.w / 2, cy = R.y + R.h / 2;
    var rx = compassOf(L).e === 'x0' ? (N - 1 - cx) : cx;
    return (cy > N / 2 ? 'S' : 'N') + (rx > N / 2 ? 'E' : 'W');
  }

  function inRect(x, y, R) { return !!R && x >= R.x && x < R.x + R.w && y >= R.y && y < R.y + R.h; }

  /* A STREET NEVER STOPS DEAD IN THE HILLS. A town is BIG (a mass a street may end at, Paolo 7/18); a gated community
     is not, so a street that ended at the old town would now stop in fabric (street_connectivity's NO-STREET-BREAK).
     Where that would happen, and only there, the street is carried on through the houses to the far side, which is what
     the roll's GRID RE-ASSERT does to every soft piece. Only where needed, because every new street cell changes which
     lots front a road, and the faction seats are picked from that list by position (measured: punching the whole grid
     through moves 7 capitals on the game's seed; carrying only the stopped streets moves none there, where none stop).
     The road and mass sets are street_connectivity's own, read from it in the record, not invented here. */
  var ROADS = { arterial: 1, freeway: 1, strip: 1, beltway: 1, interchange: 1, downtown: 1, town: 1 };
  var D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  function big(d) {
    var O = global.BohemiaOvermap || ((typeof require === 'function') ? require('./bohemia_overmap.js') : null);
    return !!(O && O.BIG && O.BIG.has(d));
  }
  function carryStreets(m, kindAt, inTown) {
    var carried = [], guard = 0, moved = true;
    while (moved && guard++ < 8) {
      moved = false;
      for (var y = 0; y < m.n; y++) for (var x = 0; x < m.n; x++) {
        if (kindAt(x, y) !== 'arterial' || x % 9 === 0 || y % 9 === 0) continue;
        var rn = 0, bn = 0, edge = false, into = null;
        for (var k = 0; k < 4; k++) {
          var nx = x + D4[k][0], ny = y + D4[k][1], nd = kindAt(nx, ny);
          if (nd == null) { edge = true; continue; }
          if (ROADS[nd]) rn++; else if (big(nd)) bn++;
          if (inTown(nx, ny) && nd !== 'arterial') into = D4[k];
        }
        if (rn > 1 || bn > 0 || edge || !into) continue;
        /* carry it across: along the street's own line, through the houses, until the far side */
        var cx = x + into[0], cy = y + into[1];
        while (inTown(cx, cy) && kindAt(cx, cy) !== 'arterial') { carried.push([cx, cy]); cx += into[0]; cy += into[1]; moved = true; }
      }
    }
    return carried;
  }

  /* the answer without changing anything: which cells would change, to what, under which name */
  function plan(m) {
    var L = m.layout, corner = cornerOf(L, m.n), named = !!NAMES[corner], out = [], i, j;
    var to = {};
    for (i = 0; i < PIECES.length; i++) {
      var pc = PIECES[i], R = L[pc.key], cells = [];
      if (!R) continue;
      for (var y = R.y; y < R.y + R.h; y++) for (var x = R.x; x < R.x + R.w; x++) {
        var t = m.at(x, y); if (!t || pc.was.indexOf(t.district) < 0) continue;
        /* an earlier piece claimed it (the intake sits on the lake's shore): count it once */
        if (to[x + ',' + y]) continue;
        to[x + ',' + y] = pc.to; cells.push([x, y]);
      }
      var w = named ? NAMES[corner][pc.key] : PLAIN[pc.to];
      out.push({ key: pc.key, from: pc.was[0], to: pc.to, real: pc.real, name: w.name, what: w.what, cells: cells, draft: true });
    }
    var kindAt = function (x, y) { var t = m.at(x, y); return t ? (to[x + ',' + y] || t.district) : null; };
    var town = out.filter(function (p) { return p.key === 'boulder'; })[0];
    var inTown = function (x, y) { return to[x + ',' + y] === 'gated'; };
    var carried = town ? carryStreets(m, kindAt, inTown) : [];
    carried.forEach(function (c) {
      to[c[0] + ',' + c[1]] = 'arterial';
      town.cells.forEach(function (tc) { if (tc[0] === c[0] && tc[1] === c[1]) tc[2] = 'arterial'; });
    });
    var changed = 0; for (i = 0; i < out.length; i++) changed += out[i].cells.length;
    return { corner: corner, named: named, changed: changed, streetsCarried: carried.length, pieces: out };
  }

  /* the candidate itself: the overmap changed in place, the plan handed back */
  function apply(m) {
    var said = plan(m);
    said.pieces.forEach(function (p) {
      p.cells.forEach(function (c) { var t = m.at(c[0], c[1]); t.district = c[2] || p.to; t.realCorner = p.key; });
    });
    m.realCorner = said;
    return said;
  }

  var API = { PIECES: PIECES, NAMES: NAMES, PLAIN: PLAIN, compassOf: compassOf, cornerOf: cornerOf, plan: plan, apply: apply };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  global.BohemiaTheRealCorner = API;
})(typeof window !== 'undefined' ? window : globalThis);
