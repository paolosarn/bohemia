// BOHEMIA RETREAT — a room you cannot back out of is a room with no fight in it.
// (8/18/26, WORLD lane.)
//
// laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26.md §6 routes this here, in his synthesis's
// own words, and it is the sharpest sentence in the whole document:
//
//   "if your combat loop requires retreat, your level generator has a HARD OBLIGATION to
//    guarantee retreat is possible... combat design and map generation are the same system
//    wearing two hats. A CRAMPED ROOM DELETES THE ENTIRE CORE VERB."
//
// That is an obligation on WORLD, not on COMBAT, and it is the kind of obligation nobody
// notices breaking: every room generates, every gate stays green, and the fight is just
// worse than it should be everywhere, forever, for a reason nobody can point at.
//
// ============================================================================
// WHAT RETREAT MEANS IN A GUN GAME, WHICH IS NOT WHAT IT MEANS IN RF4
// ============================================================================
// §3 C4 of the same law is explicit about the translation and it is the whole basis of
// what this measures. RF4's retreat works because most enemies must CLOSE to hurt you, so
// DISTANCE is safety. WITH GUNS ON BOTH SIDES, DISTANCE IS NOT SAFETY — LINE OF SIGHT IS.
// Running twelve tiles down an open hall is not a retreat, it is a longer shot. So the
// gun-native question this module asks about a room is not "how big is it" and not "how
// far can you run":
//
//        FROM WHERE I AM STANDING, CAN I GET SOMEWHERE THEY CANNOT SEE ME?
//
// If yes, the room has a fight in it. If no, the room is a shooting gallery with two
// people in it and whoever draws first wins, which is the exact failure his sentence
// names. Everything below is that one question, asked from every floor cell.
//
// ============================================================================
// FOUR MEASUREMENTS, AND WHY EACH ONE IS A DIFFERENT FAILURE
// ============================================================================
//   BREAKS       from this cell, does ANY reachable cell exist that cannot see it.
//                The binary obligation. No threshold, no radius, no invented number —
//                either a place to hide exists or it does not.
//   COST         how many steps to the nearest one. Reported, never asserted: how far a
//                retreat may be before it stops being a retreat is a feel question and
//                therefore HIS. The distribution is printed so he can answer it by
//                looking rather than by being asked.
//   LOOP         does the walkable graph contain a CYCLE. His words: loops, corners and
//                pillars, never boxes. A tree-shaped interior can always be cornered at a
//                leaf, because every retreat is a dead end by construction — you can only
//                ever go back the way they are coming.
//   PINCH        cells with exactly ONE walkable neighbour. A dead end is where the core
//                verb goes to die, and counting them is how "cramped" stops being a
//                vibe and becomes a number.
//
// ============================================================================
// WHAT IS NOT HERE, ON PURPOSE
// ============================================================================
// No thresholds, no pass marks, no "a good room has N corners". This module MEASURES; the
// gate asserts the one binary obligation his law states and REPORTS everything else. The
// day he rules how far a retreat may be, it is one number in one table. Filling that in
// myself would be inventing the feel of every fight in the game and calling it plumbing.
// (MECHANISM-MINE / CONTENTS-PAOLO'S.)
//
// It also does not touch the generator. Measure first, and let the numbers say which
// interiors are actually broken — the alternative is rewriting room grammar on a hunch
// and calling the result better because I made it.
(function (root) {
  'use strict';

  var HASREQ = (typeof module !== 'undefined' && module.exports);
  var NO_RULING = 'NO_RULING';

  /* HIS DIALS. How far a retreat may be before it stops counting, and how many dead ends
     a room may carry. Both are feel, both are his, both ship empty. */
  var LIMITS = {};
  function limitFor(k) {
    return Object.prototype.hasOwnProperty.call(LIMITS, k) ? LIMITS[k] : NO_RULING;
  }

  /* THE GENERATOR'S OWN SHAPE, READ RATHER THAN ASSUMED. A floorplan cell is
     {g:'floor'|'wall', room, door:bool, role}, and a DOOR is a WALL cell with door:true
     rather than a third g value — plus generate() stamps `kind:'stair'` on the shared
     stair cell, so two conventions live on one grid. The first version of this file
     invented a `kind:'floor'` field and measured NINE ZONES AT ZERO CELLS, reporting a
     clean sweep of total failure with perfect confidence. A reader that does not match
     the writer measures nothing and says so in the language of a result. */
  function walkable(c) {
    if (!c) return false;
    return c.g === 'floor' || c.door === true || c.kind === 'stair';
  }
  /* A cell that stops a bullet and a look. A wall does; a doorway in it does not. */
  function opaque(c) { return !c || (c.g === 'wall' && c.door !== true); }

  /* LINE OF SIGHT, symmetric, on the grid the generator actually produces. Bresenham
     between cell centres; any opaque cell strictly between the ends blocks it. The
     endpoints themselves never block — you can always see the floor you stand on and the
     floor they stand on. */
  function sees(grid, x0, y0, x1, y1) {
    var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    var sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    var err = dx - dy, x = x0, y = y0, e2;
    for (;;) {
      if (x === x1 && y === y1) return true;
      e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x += sx; }
      if (e2 < dx) { err += dx; y += sy; }
      if (x === x1 && y === y1) return true;
      if (opaque(grid[y] && grid[y][x])) return false;
    }
  }

  var N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  /* measure: one level of a floorplan -> the four numbers, plus everything needed to say
     WHERE it is bad rather than only THAT it is bad. */
  function measure(level) {
    var grid = level && level.grid;
    var out = { cells: 0, breaks: 0, noBreak: [], cost: [], worst: 0, loops: 0,
                pinches: 0, edges: 0, ok: false };
    if (!grid || !grid.length) return out;
    var H = grid.length, W = grid[0].length, x, y, i;

    var floors = [];
    for (y = 0; y < H; y++) for (x = 0; x < W; x++)
      if (walkable(grid[y][x])) floors.push([x, y]);
    out.cells = floors.length;
    if (!out.cells) return out;

    /* the walkable graph: 4-neighbour, because a body moves on cells and a diagonal
       squeeze between two wall corners is not a doorway. */
    var idx = {}, k;
    for (i = 0; i < floors.length; i++) idx[floors[i][0] + ',' + floors[i][1]] = i;
    var deg = new Array(floors.length).fill(0), edges = 0;
    for (i = 0; i < floors.length; i++) {
      for (k = 0; k < 4; k++) {
        var nx = floors[i][0] + N4[k][0], ny = floors[i][1] + N4[k][1];
        if (idx[nx + ',' + ny] === undefined) continue;
        deg[i]++; edges++;
      }
    }
    edges = edges / 2;
    out.edges = edges;
    for (i = 0; i < deg.length; i++) if (deg[i] === 1) out.pinches++;

    /* components, so LOOPS is counted honestly: a graph's cycle count is
       edges - nodes + components, and treating a two-part interior as one graph
       would report a phantom loop the moment anything is walled off. */
    var seen = new Array(floors.length).fill(false), comps = 0, q, cur, ci;
    for (i = 0; i < floors.length; i++) {
      if (seen[i]) continue;
      comps++; seen[i] = true; q = [i];
      while (q.length) {
        cur = q.pop();
        for (k = 0; k < 4; k++) {
          ci = idx[(floors[cur][0] + N4[k][0]) + ',' + (floors[cur][1] + N4[k][1])];
          if (ci === undefined || seen[ci]) continue;
          seen[ci] = true; q.push(ci);
        }
      }
    }
    out.components = comps;
    out.loops = edges - floors.length + comps;

    /* THE OBLIGATION. From every floor cell, BFS outward until a cell turns up that
       cannot see the start. The first one found is the cheapest retreat, and its depth
       is the cost. Nothing is asserted about that cost here. */
    for (i = 0; i < floors.length; i++) {
      var sxp = floors[i][0], syp = floors[i][1];
      var dist = {}, head = 0;
      var bfs = [[sxp, syp, 0]];
      dist[sxp + ',' + syp] = 0;
      var found = -1;
      while (head < bfs.length) {
        var n = bfs[head++], cx = n[0], cy = n[1], d = n[2];
        if (d > 0 && !sees(grid, sxp, syp, cx, cy)) { found = d; break; }
        for (k = 0; k < 4; k++) {
          var ax = cx + N4[k][0], ay = cy + N4[k][1];
          if (idx[ax + ',' + ay] === undefined) continue;
          if (dist[ax + ',' + ay] !== undefined) continue;
          dist[ax + ',' + ay] = d + 1;
          bfs.push([ax, ay, d + 1]);
        }
      }
      if (found < 0) out.noBreak.push([sxp, syp]);
      else { out.breaks++; out.cost.push(found); if (found > out.worst) out.worst = found; }
    }
    out.ok = out.noBreak.length === 0;
    out.share = out.breaks / out.cells;
    out.cost.sort(function (a, b) { return a - b; });
    out.median = out.cost.length ? out.cost[(out.cost.length / 2) | 0] : null;
    return out;
  }

  /* ── THE ROOM GRAPH, WHICH IS THE ONE THAT MEANS WHAT HE MEANT ────────────────
     "loops, corners and pillars, never boxes" is a statement about the PLAN, and counting
     cycles on the CELL grid does not test it: any floor wider than one tile is a mesh, so
     the cell-graph cycle count is enormous and positive no matter how the rooms connect.
     That number would have gone green on a strictly tree-shaped building forever — a
     measurement that cannot fail is not a measurement.
     The real question is whether the DOOR graph has a cycle: can you leave a room one way
     and come back another. A spanning tree of rooms cannot, so every retreat in it is a
     dead end by construction and you can only ever go back the way they are coming.
     Derived off the grid rather than off plan.doors, because a door cell knows which two
     rooms it joins by looking at its neighbours and the doors array is only coordinates. */
  function roomGraph(plan) {
    var grid = plan && plan.grid, out = { rooms: 0, edges: 0, loops: 0, components: 0 };
    if (!grid || !grid.length || !plan.rooms) return out;
    var H = grid.length, W = grid[0].length, x, y, k;
    out.rooms = plan.rooms.length;
    var seenEdge = {}, adj = {};
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      var c = grid[y][x];
      if (!c || !c.door) continue;
      var ids = {};
      for (k = 0; k < 4; k++) {
        var n = grid[y + N4[k][1]] && grid[y + N4[k][1]][x + N4[k][0]];
        if (n && n.room >= 0) ids[n.room] = 1;
      }
      var list = Object.keys(ids).map(Number);
      if (list.length !== 2) continue;              /* a perimeter door joins one room */
      var key = Math.min(list[0], list[1]) + ',' + Math.max(list[0], list[1]);
      if (seenEdge[key]) continue;                  /* two doorways, one adjacency */
      seenEdge[key] = 1; out.edges++;
      (adj[list[0]] = adj[list[0]] || []).push(list[1]);
      (adj[list[1]] = adj[list[1]] || []).push(list[0]);
    }
    var seen = {}, i, q, cur, j;
    for (i = 0; i < out.rooms; i++) {
      if (seen[i]) continue;
      out.components++; seen[i] = 1; q = [i];
      while (q.length) {
        cur = q.pop();
        var ns = adj[cur] || [];
        for (j = 0; j < ns.length; j++) if (!seen[ns[j]]) { seen[ns[j]] = 1; q.push(ns[j]); }
      }
    }
    out.loops = out.edges - out.rooms + out.components;
    return out;
  }

  /* the whole building: every level, worst level wins, because the fight happens on
     whichever floor you are standing on. */
  function measureBuilding(plan) {
    var lv = (plan && plan.levels) ? plan.levels : (plan ? [plan] : []);
    var all = lv.map(measure);
    return {
      levels: all,
      ok: all.length > 0 && all.every(function (m) { return m.ok || m.cells === 0; }),
      cells: all.reduce(function (a, m) { return a + m.cells; }, 0),
      noBreak: all.reduce(function (a, m) { return a + m.noBreak.length; }, 0),
      loops: all.reduce(function (a, m) { return a + m.loops; }, 0),
      pinches: all.reduce(function (a, m) { return a + m.pinches; }, 0),
      worst: all.reduce(function (a, m) { return Math.max(a, m.worst); }, 0)
    };
  }

  var API = { measure: measure, measureBuilding: measureBuilding, sees: sees,
              roomGraph: roomGraph,
              walkable: walkable, opaque: opaque, LIMITS: LIMITS, limitFor: limitFor,
              NO_RULING: NO_RULING };
  if (HASREQ) module.exports = API;
  root.BohemiaRetreat = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
