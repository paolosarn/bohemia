/* ===========================================================================
   BOHEMIA ROOMS — step 1 of ONE WORLD INTERIORS
   records/BOHEMIA_ONE_WORLD_INTERIORS_SPEC_7_31_26.md, S2 + build order step 1.

   Paolo 7/31: "i want it like project zomboid when you enter a house you still
   are part of the same world no loading screens thats why were making this html
   game its not a lot of processing"

   THE WHOLE POINT OF THIS FILE: "am I inside?" stops being a STATE OF THE PLAYER
   and becomes a PROPERTY OF THE CELL. Today the engine answers that question by
   swapping the player onto a separate grid, which is why six of his complaints
   exist at once (can't walk left/right inside, windows don't match outside,
   entering through any wall, a loading screen he can feel). None of those are
   six bugs. They are one: `mode`.

   This module does not delete `mode` — that is step 5, and the spec says each
   step ships green on its own. This is step 1 and it changes NOTHING on screen.
   It only computes, for every cell of a plot:

       room  an id, 0 = outdoors. Cells sharing an id are ONE enclosed space.
       roof  which roof group covers the cell (same id in step 1: a building's
             roof covers exactly its own enclosed shell). Step 4 hides a roof
             group when the player's room id matches it — the flood-fill reveal.

   WHY FLOOD FILL AND NOT TRIGGERS. The research (recorded in the spec) is that
   every engine converges on four techniques, and flood fill over connected
   roofed tiles is the one recommended for tile games because it needs ZERO
   per-building authoring. That matters here more than anywhere: Bohemia has 48
   district generators making buildings procedurally. Anything needing a human
   to place a door sensor is dead on arrival. It is also the algorithm the file
   ALREADY uses — homeFootprints() and KIT.footprints() are both flood fills, so
   this is the shape the codebase is already in, not a new idea bolted on.

   FOUR-CONNECTED, NEVER EIGHT. Two houses that touch only at a CORNER are two
   enclosed spaces, not one. You cannot walk diagonally through a corner touch in
   real geometry, so a diagonal must never merge two rooms. Getting this wrong
   would silently weld half a suburb block into a single "room" and every roof on
   it would vanish at once the first time you stepped indoors. The gate holds it
   down with a corner-touch fixture.

   PURE: no DOM, no canvas, no engine imports. Takes a grid, returns arrays.
   =========================================================================== */
;(function (root) {
  'use strict';

  /* group(g, opt) -> { W,H, room:Int32Array, roof:Int32Array, groups:[...] }
       g            the plot grid, g[y][x] = tile code
       opt.indoor   fn(code,x,y) -> true if this cell is INSIDE an enclosed
                    structure. Required: the caller owns what "inside" means,
                    because only the district's own legend knows (MECHANISM-MINE
                    / CONTENTS-PAOLO'S — this file never guesses at tile codes).

     room[y*W+x] and roof[y*W+x] are 0 outdoors and a group id (>=1) indoors.
     groups[i] = {id, cells, minX, minY, maxX, maxY} — cells is the count, the
     bbox is what step 4 needs to know which roof to stop drawing. */
  function group(g, opt) {
    opt = opt || {};
    var indoor = opt.indoor;
    if (typeof indoor !== 'function') throw new Error('rooms.group: opt.indoor is required');
    var H = g.length, W = H ? g[0].length : 0;
    var room = new Int32Array(W * H);
    var groups = [];
    var next = 1;
    var stack = [];

    for (var sy = 0; sy < H; sy++) {
      for (var sx = 0; sx < W; sx++) {
        var si = sy * W + sx;
        if (room[si]) continue;
        if (!indoor(g[sy][sx], sx, sy)) continue;

        var id = next++;
        var cells = 0, minX = sx, maxX = sx, minY = sy, maxY = sy;
        room[si] = id;
        stack.length = 0;
        stack.push(sx, sy);

        while (stack.length) {
          var y = stack.pop(), x = stack.pop();
          cells++;
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
          /* FOUR-CONNECTED. A corner touch is not a doorway. */
          for (var d = 0; d < 4; d++) {
            var nx = x + (d === 0 ? 1 : d === 1 ? -1 : 0);
            var ny = y + (d === 2 ? 1 : d === 3 ? -1 : 0);
            if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
            var ni = ny * W + nx;
            if (room[ni]) continue;
            if (!indoor(g[ny][nx], nx, ny)) continue;
            room[ni] = id;
            stack.push(nx, ny);
          }
        }
        groups.push({ id: id, cells: cells, minX: minX, minY: minY, maxX: maxX, maxY: maxY });
      }
    }

    /* THE ROOF COVERS THE SHELL. In step 1 a group's roof is exactly its own
       enclosed footprint, which is true by construction: the roof of a building
       is the building's plan. When step 2 stamps floorplans INTO the grid the
       rooms subdivide and the roof stays the shell — that is why these are two
       arrays from day one instead of one array with two names later. */
    var roof = room;

    return { W: W, H: H, room: room, roof: roof, groups: groups, count: groups.length };
  }

  /* the two reads everything else will use, so no caller ever indexes by hand */
  function roomAt(res, x, y) {
    if (!res || x < 0 || y < 0 || x >= res.W || y >= res.H) return 0;
    return res.room[y * res.W + x];
  }
  function inside(res, x, y) { return roomAt(res, x, y) !== 0; }

  var API = { group: group, roomAt: roomAt, inside: inside };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.BOH_ROOMS = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
