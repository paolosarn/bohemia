// BOHEMIA FURNISH — what is IN the room, and therefore what you can get behind.
// (8/18/26, WORLD lane.)
//
// ============================================================================
// THIS IS NOT DECORATION. IT IS THE FIX THE RETREAT GATE NAMED, WITH A NUMBER.
// ============================================================================
// gates/retreat_gate.js, 8/18, measured across nine zones x six seeds x nine
// footprints, holding the hard obligation from laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_
// 8_17_26.md §6: "a cramped room deletes the entire core verb."
//
//     6x6, 8x8, 10x10   ONE ROOM every time, 94% of the floor with nowhere to hide
//     20x16 and up      every cell of every plan in every zone has a retreat
//
// And the reason the small plates cannot be fixed with walls is a ruling, not a shrug:
// A 6x6 PLATE IS 4.5 METRES SQUARE. It is a shed. Partitioning a shed so a gate goes
// green would be inventing architecture that does not exist, and REALISM FIRST says no.
// Cover in a room that size comes from WHAT IS IN IT. That is this file.
//
// The floorplan generator has known this since July: `meta.pending` has carried the
// string "furniture per role" the whole time. A pending string is not a requirement
// until something measures what its absence costs. It costs 9,630 stranded floor cells.
//
// ============================================================================
// THREE CLASSES, AND THE ONLY ONE THAT MATTERS FOR A FIGHT IS THE FIRST
// ============================================================================
//   COVER  chest-to-head and opaque: racking, lockers, a fridge, a wardrobe, a counter
//          run, a reception desk. Blocks the body AND blocks the look. THIS is what
//          turns a box into a room you can fight in.
//   LOW    knee-to-waist: a bed, a sofa, a desk, a meeting table. Blocks the body,
//          NOT the look. It shapes where you can walk and where you can be pushed,
//          which is machine 3 (movement asymmetry), and it is honest about what it
//          is: we have no crouch, so a sofa cannot hide you and will not pretend to.
//   LOOSE  a spilled drawer, a mattress on the floor, scattered paper. Blocks nothing.
//          It is there because a looted room is not an empty room, and it must never
//          be counted as cover by anything downstream.
// The split is the whole design. Calling a desk "cover" would make every office pass
// the retreat gate while playing exactly as badly as before -- a number that improves
// while the game does not is worse than a number that stays red.
//
// ============================================================================
// REUSE CHECK -- AND THE ANSWER IS A WARNING, NOT A SHOPPING LIST
// ============================================================================
// Opened, decoded and LOOKED AT (not read about -- rendered to PNG and viewed):
//   banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt -- 31 furniture, 60 container, 80 clutter,
//     50 debris at 48px, its header claiming "every tile here carries a Paolo UP
//     verdict". WHAT IS ACTUALLY IN IT: banded oak barrels, burlap sacks, wooden
//     crates, tavern benches, potion bottles and LIVE FLOWERING PLANTS. It is a
//     generic fantasy asset pack. Nobody in a 2020s Las Vegas apartment owns a
//     coopered barrel, and live greenery breaks the dead-world standing law outright.
//   banks/BOHEMIA_DEMO_PROP_POOL_7_10_26.txt -- 314 props. Its `container` family is
//     GLOWING SCI-FI LOOT CRATES. Its `cover` family (13, "Barricades and defenses")
//     is the one genuinely usable set in either bank: concrete jersey barriers with
//     yellow hazard stripes, sandbag stacks, a striped traffic barricade, steel plate.
//     Real, and right for a room somebody fortified -- and wrong for a bedroom.
// SO NOTHING IS WIRED FROM EITHER. This file defines the TYPES and their footprints;
// the pixels are ART's, per the same §6 routing that gave WORLD the types and ART the
// forms. Putting a fantasy barrel in the one surface he plays, because a bank existed
// and a law said reuse first, is how a build ends up looking like somebody else's game.
// REUSE-FIRST asks what you looked at and why nothing fit. This is why nothing fit.
//
// ============================================================================
// WHAT IS HIS
// ============================================================================
// DENSITY is a real-world fact per room and it is derived from what the room IS -- a
// stockroom is wall-to-wall racking and a lobby is nearly empty, and that is not a
// taste call. What ships EMPTY is the global multiplier: how furnished the world
// should feel overall is feel, and feel is his. (MECHANISM-MINE / CONTENTS-PAOLO'S.)
// Nothing here is branded, named, or owned by anybody. A room's contents are generic
// because generic is what is true; whose room it is, is canon and therefore his.
(function (root) {
  'use strict';

  var HASREQ = (typeof module !== 'undefined' && module.exports);
  var NO_RULING = 'NO_RULING';

  var COVER = 'cover', LOW = 'low', LOOSE = 'loose';

  /* A piece: what it is, how big, which class, and whether it belongs against a wall.
     `wall:true` means it is a thing that lives with its back to something (racking, a
     counter run, a wardrobe). `wall:false` means it stands in the room (an island, a
     meeting table, a gondola row) -- and ISLANDS ARE WHERE THE LINE OF SIGHT ACTUALLY
     BREAKS, because a room lined entirely in shelving is still one open box. */
  function P(id, w, h, cls, wall) {
    return { id: id, w: w, h: h, cls: cls, wall: !!wall };
  }

  /* ROLE -> WHAT IS REALLY IN IT. The roles are the floorplan generator's own
     (engine/bohemia_floorplan.js ZONES), not a new vocabulary. Every entry is a thing
     that is actually in that kind of room in a real building, act-1 dead: looted,
     shoved around, still there because nobody could carry it. */
  var ROLES = {
    /* residential */
    living:    { pieces: [P('shelf_unit', 2, 1, COVER, true), P('sofa', 3, 1, LOW, true),
                          P('tv_stand', 2, 1, LOW, true)], per25: 3 },
    kitchen:   { pieces: [P('counter_run', 3, 1, COVER, true), P('fridge', 1, 1, COVER, true),
                          P('island', 2, 1, COVER, false)], per25: 4 },
    bed:       { pieces: [P('wardrobe', 2, 1, COVER, true), P('bed', 2, 3, LOW, true),
                          P('dresser', 2, 1, LOW, true)], per25: 3 },
    bath:      { pieces: [P('vanity', 2, 1, LOW, true)], per25: 1 },
    /* retail */
    shopfloor: { pieces: [P('gondola', 5, 1, COVER, false), P('endcap', 2, 1, COVER, false)],
                 per25: 5 },
    checkout:  { pieces: [P('till_counter', 4, 1, COVER, true)], per25: 2 },
    stockroom: { pieces: [P('racking', 6, 1, COVER, false), P('pallet_stack', 2, 2, COVER, false)],
                 per25: 6 },
    /* office / civic */
    lobby:     { pieces: [P('reception_desk', 3, 1, COVER, false), P('seating', 2, 1, LOW, true)],
                 per25: 2 },
    office:    { pieces: [P('filing_cabinet', 1, 1, COVER, true), P('partition', 3, 1, COVER, false),
                          P('desk', 2, 1, LOW, false)], per25: 4 },
    meeting:   { pieces: [P('long_table', 4, 2, LOW, false)], per25: 1 },
    breakroom: { pieces: [P('counter_run', 3, 1, COVER, true), P('table', 2, 2, LOW, false)],
                 per25: 3 },
    hall:      { pieces: [P('bench', 3, 1, LOW, true)], per25: 1 },
    reception: { pieces: [P('reception_desk', 3, 1, COVER, false), P('seating', 2, 1, LOW, true)],
                 per25: 2 },
    records:   { pieces: [P('racking', 6, 1, COVER, false), P('filing_cabinet', 1, 1, COVER, true)],
                 per25: 6 },
    /* institutional */
    ward:      { pieces: [P('screen', 2, 1, COVER, false), P('bed', 2, 3, LOW, true),
                          P('supply_cart', 1, 1, LOW, false)], per25: 3 },
    service:   { pieces: [P('racking', 6, 1, COVER, false)], per25: 5 },
    /* warehouse */
    floor_open:{ pieces: [P('racking', 6, 1, COVER, false), P('pallet_stack', 2, 2, COVER, false)],
                 per25: 4 },
    dock:      { pieces: [P('pallet_stack', 2, 2, COVER, false)], per25: 3 },
    /* landmark */
    atrium:    { pieces: [P('planter_block', 2, 2, COVER, false)], per25: 1 },
    gallery:   { pieces: [P('plinth', 1, 1, COVER, false), P('case', 3, 1, LOW, false)], per25: 2 },
    /* leisure */
    concourse: { pieces: [P('kiosk', 2, 2, COVER, false), P('bench', 3, 1, LOW, true)], per25: 2 },
    counter:   { pieces: [P('till_counter', 4, 1, COVER, true)], per25: 2 },
    locker:    { pieces: [P('locker_bank', 4, 1, COVER, true), P('bench', 3, 1, LOW, false)],
                 per25: 5 },
    restroom:  { pieces: [P('stall_run', 3, 1, COVER, true)], per25: 3 },
    /* default */
    room:      { pieces: [P('shelf_unit', 2, 1, COVER, true), P('table', 2, 2, LOW, false)],
                 per25: 3 }
  };

  /* THE ONE DIAL THAT IS HIS: a global multiplier on how furnished the world feels.
     The per-role densities above are facts about buildings; the overall level is feel. */
  var DENSITY = {};
  function densityDial() {
    return Object.prototype.hasOwnProperty.call(DENSITY, 'global') ? DENSITY.global : NO_RULING;
  }

  function rng(seed) {
    var s = (seed >>> 0) || 1;
    return function () { s = (Math.imul(s, 1103515245) + 12345) >>> 0; return s / 4294967296; };
  }

  function isFloor(c) { return c && c.g === 'floor'; }
  function isDoor(c) { return !!(c && (c.door === true || c.g === 'door')); }

  /* CAN THIS PIECE STAND HERE. Four refusals, and every one of them is a way a room
     stops working rather than a way it looks wrong. */
  function fits(fp, blocked, rm, x, y, w, h) {
    var i, j, c;
    if (x < rm.x || y < rm.y || x + w > rm.x + rm.w || y + h > rm.y + rm.h) return false;
    for (j = y; j < y + h; j++) for (i = x; i < x + w; i++) {
      c = fp.grid[j] && fp.grid[j][i];
      if (!isFloor(c)) return false;                       /* only on this room's floor */
      if (blocked[i + ',' + j]) return false;              /* nothing stacks */
      if (nearDoor(fp, i, j)) return false;                /* NEVER seal a doorway */
    }
    return true;
  }
  /* A door and the cell each side of it stay clear. Furnishing a room shut is worse
     than leaving it empty: an empty room is boring, a sealed one is a bug. */
  function nearDoor(fp, x, y) {
    for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
      var c = fp.grid[y + dy] && fp.grid[y + dy][x + dx];
      if (isDoor(c)) return true;
    }
    return false;
  }

  /* AND THE ROOM MUST STILL BE ONE PIECE. A racking run dropped across the middle of a
     stockroom can cut it in half; the half without the door becomes unreachable, and
     nothing else in the engine would ever notice. Flood-fill after every placement and
     take the piece back if the floor stopped being connected. */
  function connected(fp, blocked, rm) {
    var open = [], seen = {}, x, y, k;
    for (y = rm.y; y < rm.y + rm.h; y++) for (x = rm.x; x < rm.x + rm.w; x++)
      if (isFloor(fp.grid[y][x]) && !blocked[x + ',' + y]) open.push([x, y]);
    if (!open.length) return true;
    var q = [open[0]], N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]], n = 0;
    seen[open[0][0] + ',' + open[0][1]] = 1;
    while (q.length) {
      var cur = q.pop(); n++;
      for (k = 0; k < 4; k++) {
        var nx = cur[0] + N4[k][0], ny = cur[1] + N4[k][1], key = nx + ',' + ny;
        if (seen[key]) continue;
        if (nx < rm.x || ny < rm.y || nx >= rm.x + rm.w || ny >= rm.y + rm.h) continue;
        if (!isFloor(fp.grid[ny][nx]) || blocked[key]) continue;
        seen[key] = 1; q.push([nx, ny]);
      }
    }
    return n === open.length;
  }

  /* furnish: stamp `furn` onto the plate's own grid. Deterministic per (seed, plate).
     Returns the plan, mutated, plus a manifest so a gate can say what went where. */
  function furnish(fp, seed) {
    if (!fp || !fp.grid || !fp.rooms) return fp;
    if (fp.meta && fp.meta.furnished) return fp;
    var r = rng(((seed >>> 0) || 1) ^ Math.imul(fp.W || 1, 2654435761) ^ ((fp.H || 1) * 40503));
    var blocked = {}, placed = [], ri, i;

    for (ri = 0; ri < fp.rooms.length; ri++) {
      var rm = fp.rooms[ri];
      var spec = ROLES[rm.role] || ROLES.room;
      /* HOW MANY: the role's real density, scaled by the room's real area. 25 is
         square metres and a tile is 0.75 m, so 25 m2 is about 44 tiles. Derived from
         the engine's own scale, never a magic constant chosen to make a number move. */
      var TILE_M2 = 0.75 * 0.75;
      var area = rm.w * rm.h * TILE_M2;
      var want = Math.max(1, Math.round(spec.per25 * area / 25));
      var tries = 0;
      while (placed.length < 4096 && want > 0 && tries < want * 40) {
        tries++;
        var pc = spec.pieces[(r() * spec.pieces.length) | 0];
        /* orientation: a run that is 6x1 is also 1x6, and which one fits is the room's
           business, not the table's. Pick per attempt so a tall room gets tall racking. */
        var w = pc.w, h = pc.h;
        if (r() < 0.5) { w = pc.h; h = pc.w; }
        var x, y;
        if (pc.wall) {
          /* against a wall, which is where these things actually live */
          var side = (r() * 4) | 0;
          if (side === 0) { x = rm.x + ((r() * Math.max(1, rm.w - w + 1)) | 0); y = rm.y; }
          else if (side === 1) { x = rm.x + ((r() * Math.max(1, rm.w - w + 1)) | 0); y = rm.y + rm.h - h; }
          else if (side === 2) { x = rm.x; y = rm.y + ((r() * Math.max(1, rm.h - h + 1)) | 0); }
          else { x = rm.x + rm.w - w; y = rm.y + ((r() * Math.max(1, rm.h - h + 1)) | 0); }
        } else {
          x = rm.x + ((r() * Math.max(1, rm.w - w + 1)) | 0);
          y = rm.y + ((r() * Math.max(1, rm.h - h + 1)) | 0);
        }
        if (!fits(fp, blocked, rm, x, y, w, h)) continue;
        var mark = [];
        for (var j = y; j < y + h; j++) for (i = x; i < x + w; i++) { blocked[i + ',' + j] = 1; mark.push([i, j]); }
        if (!connected(fp, blocked, rm)) {
          for (i = 0; i < mark.length; i++) delete blocked[mark[i][0] + ',' + mark[i][1]];
          continue;
        }
        for (i = 0; i < mark.length; i++) {
          var cc = fp.grid[mark[i][1]][mark[i][0]];
          cc.furn = { id: pc.id, cls: pc.cls, room: ri };
        }
        placed.push({ id: pc.id, cls: pc.cls, x: x, y: y, w: w, h: h, room: ri, role: rm.role });
        want--;
      }
    }
    fp.furniture = placed;
    fp.meta = fp.meta || {};
    fp.meta.furnished = placed.length;
    /* the pending string this file exists to retire */
    if (fp.meta.pending) fp.meta.pending = fp.meta.pending.filter(function (s) {
      return s !== 'furniture per role';
    });
    return fp;
  }

  /* what a cell's contents do to a body. Read by the retreat measure and by combat. */
  function blocksMove(c) { return !!(c && c.furn && (c.furn.cls === COVER || c.furn.cls === LOW)); }
  function blocksSight(c) { return !!(c && c.furn && c.furn.cls === COVER); }

  var API = {
    ROLES: ROLES, DENSITY: DENSITY, NO_RULING: NO_RULING,
    COVER: COVER, LOW: LOW, LOOSE: LOOSE,
    furnish: furnish, blocksMove: blocksMove, blocksSight: blocksSight,
    densityDial: densityDial
  };
  if (HASREQ) module.exports = API;
  root.BohemiaFurnish = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
