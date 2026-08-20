/* BOHEMIA INTERIOR GROUND (8/20/26, WORLD lane)
 * THE FLOOR CAN DO SOMETHING TO YOU, EXCEPT INDOORS, WHICH IS WHERE EVERY FIGHT IS.
 *
 * Paolo 8/17, LOCKED: "THE WORLD HAS TO FEEL MORE ALIVE."
 * laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26.md §5 routes that to WORLD, and its closing
 * line is the whole brief: *a room only feels alive if the floor can do something to you.*
 *
 * On 8/18 this lane read every district legend in the valley and found 31 hazard tiles in
 * 22 districts — drained pools, talus, leachate, ballast, and on 8/20 four real voids. All
 * of it OUTDOORS. The fight-room payload has carried a `ground` channel since 8/19 and its
 * own comment admitted what was in it: "Interiors carry none today -- the channel ships
 * anyway so combat reads ONE shape indoors and out."
 *
 * MEASURED: a floorplan cell carries `g, room, door, role` and NOTHING ELSE. Zero cells in
 * any interior in the game have ever carried terrain. So the ground channel is 320 dots for
 * a 20x16 room, every room, every fight — and the only fights that exist happen inside.
 * The one system built to make a room feel alive was switched off in every room.
 *
 * ── IT INVENTS NO VOCABULARY, WHICH IS THE POINT ────────────────────────────────────────
 * Everything here is named so that engine/bohemia_hazard.js's EXISTING rules classify it,
 * with no new rule and no edit to the classifier. Checked before a line of this was written:
 *     "standing water"          -> DISABLES   (the rule already reads /\bstanding water\b/i)
 *     "fallen ceiling rubble"   -> AMPLIFIES  (already reads /\brubble\b|\bdebris\b/i)
 *     "lift shaft"              -> KILLS      (already reads /\bshaft\b/i)
 * If it had needed a new rule it would have been a new vocabulary wearing the old one's
 * clothes. It needed none, because these are the same three things a dead building has that
 * a dead quarry has: liquid you can walk into, footing you cannot set, and a hole.
 *
 * ── WHERE IT GOES IS DERIVED FROM THE BUILDING, NEVER FROM A RATE ──────────────────────
 * MECHANISM-MINE / CONTENTS-PAOLO'S. The outdoor classes were derived from ground the
 * generators had already authored; an interior has no authored hazard to read, so the
 * temptation is to invent a frequency and call it design. Instead every placement answers a
 * question about the building that the plan can already answer:
 *
 *   STANDING WATER goes where the PLUMBING is — bath, restroom, kitchen, breakroom, locker.
 *     A building whose roof went ten years ago drains through the wet stack, and it POOLS
 *     AWAY FROM THE THRESHOLD, so the cells chosen are the ones furthest from the room's
 *     own door. Water does not sit in the doorway; it sits at the back.
 *   FALLEN CEILING RUBBLE goes where the SPAN is longest — floor_open, atrium, concourse,
 *     hall, gallery, shopfloor, ward. An unsupported ceiling fails in the MIDDLE, furthest
 *     from any wall carrying it, which is a distance the plan already knows.
 *   A LIFT SHAFT goes in a SERVICE room, and only in a building that would have a lift.
 *     A house does not have one. This is the interior void: the doors forced open a decade
 *     ago and the car at the bottom.
 *
 * So the amount is a consequence of the room's own size, role and door position, and the
 * dial that would ADD hazard beyond what the building implies is SPREAD, which ships EMPTY
 * because how common it should be is his call. Exactly the shape DIALS ships in the hazard
 * module and DENSITY ships in the furnish module.
 *
 * ── THE FOUR REFUSALS, WHICH ARE THE SAME FOUR A ROOM CAN BE RUINED BY ─────────────────
 * Lifted deliberately from engine/bohemia_furnish.js rather than reinvented, because they
 * are not furniture rules, they are ROOM rules:
 *   1. never in a doorway or the cell each side of it — flooding a room shut is a bug
 *   2. never where furniture already stands — a hole under a filing cabinet is silly
 *   3. never so that the floor stops being one piece — a shaft across a corridor strands
 *      the half without the door, and nothing else in the engine would notice
 *   4. a VOID additionally never touches a door cell at all, because a hole you fall into
 *      the instant you walk through a door is not a hazard, it is a trap the player could
 *      not have read, and NO DAMAGE BEFORE THE DIAL is not a licence to kill him for free
 *
 * REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks ZERO pixels and opens no bank. It emits
 * legend-shaped tiles that the EXISTING hazard classifier already classifies and the
 * EXISTING fight-room channel already carries, onto plates the floorplan module already
 * generates, using the placement guards engine/bohemia_furnish.js already proved. The one
 * thing it adds is three materials, and their names had to match rules that already existed.
 * Opened: engine/bohemia_hazard.js (the rules), engine/bohemia_furnish.js (the guards),
 * engine/bohemia_floorplan.js (ZONES and the roles), records/BOHEMIA_THE_FLOOR_CAN_KILL_
 * YOU_8_18_26.md (what the outdoor classes are and what the ART ask is).
 */
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  /* ── THE THREE MATERIALS ────────────────────────────────────────────────────────────
     Legend-entry shaped, because that is what BohemiaHazard.classOf reads and what a
     district tile is. `act1` is written as if it ships (ALWAYS MAKE AN ATTEMPT, 8/11) and
     is his to edit. draft:true so every word he has not approved can be found. */
  var TILES = {
    water: {
      name: 'standing water', kind: 'water-dead', draft: true,
      act1: 'water standing where the wet stack finally let go, flat and skinned over, ' +
            'with the tide line up the wall behind it'
    },
    rubble: {
      name: 'fallen ceiling rubble', kind: 'ground', draft: true,
      act1: 'the ceiling came down in the middle of the span: grid, tile and insulation ' +
            'in a heap, and daylight through what is left'
    },
    shaft: {
      /* THE INTERIOR VOID. Structure kind, declared `void`, so the kit gives it
         solid:false and the walked surface draws it as a hole rather than a mass —
         see the void note in engine/bohemia_district_kit.js (8/20). */
      name: 'lift shaft', kind: 'structure', 'void': true, draft: true,
      act1: 'the lift doors forced open a long time ago and never closed, the car sitting ' +
            'at the bottom of the pit in the dark'
    }
  };

  /* WHICH ROOMS, and every list answers a question about the real building rather than
     naming rooms I felt like flooding.

     *** THE WET LIST IS DELIBERATELY UNUSED BY DEFAULT, AND FINDING THAT OUT IS THE MOST
     USEFUL THING THIS MODULE DID. *** The first cut placed standing water in every bath,
     kitchen, breakroom and locker on the plan, because that is where the plumbing is and
     the derivation was sound. Then I read the numbers it produced: 34 tiles of standing
     water in a HOUSE, across six seeds, every seed. A bathroom the size of a swimming pool.
     And the number was the small problem. THE BIG ONE IS THAT THIS IS LAS VEGAS AND IT IS
     TEN YEARS LATER. This is the driest major city in the United States, roughly 100 mm of
     rain a year and summer humidity in single digits. Water in an unroofed building here
     does not sit for a decade; it is gone in a season, and what is left is the TIDE LINE
     and the stain, not the pool. Every interior in act one is bone dry.
     So the material stays DEFINED — the day he wants a flooded plant room or a basement
     that still takes water it is one entry in SPREAD, not a system — and it is PLACED
     nowhere, on purpose, with the reason written here rather than deleted so the next
     person re-derives it and ships puddles. DISABLES therefore has no indoor presence, and
     saying so is better than flooding the valley to fill a column. */
  var WET   = { bath: 1, restroom: 1, kitchen: 1, breakroom: 1, locker: 1 };
  var RISER = { service: 1 };
  /* A HOUSE HAS NO LIFT. Residential and the default plan are excluded by zone, not by
     room name, because `service` means something different in a home. */
  var NO_LIFT = { residential: 1, 'default': 1 };

  /* AND RUBBLE NEEDS NO ROOM LIST AT ALL, which is what tells you the derivation is real.
     A ceiling comes down because it is SPANNING, and how far a ceiling spans is a fact
     about the room's shape that the plan already holds: a cell two or more tiles from
     every wall of its room has no wall near enough to be carrying the deck above it. That
     is the unsupported core, it only exists in rooms about five tiles across and bigger,
     and small rooms are excluded automatically because their ceilings are short-span and
     short-span ceilings do not fall. The first cut used a hand-written list of big-room
     roles (atrium, concourse, hall...) and it was the same answer arrived at by naming
     things instead of measuring them — and it missed every large room whose role happened
     not to be on the list. */
  var UNSUPPORTED = 2;

  /* HIS DIAL, SHIPPED EMPTY. How common each of these should be is a decision, not a
     word, so it waits (MECHANISM-MINE / CONTENTS-PAOLO'S). Everything below is a
     consequence of the room's own size, role and door — not of a number I chose. */
  var SPREAD = {};

  function isFloor(c) { return c && c.g === 'floor'; }
  function isDoor(c) { return !!(c && (c.door === true || c.g === 'door')); }

  function nearDoor(fp, x, y) {
    for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
      var c = fp.grid[y + dy] && fp.grid[y + dy][x + dx];
      if (isDoor(c)) return true;
    }
    return false;
  }

  /* ── CONNECTIVITY, AND I GOT THIS WRONG TWICE BEFORE MEASURING IT ────────────────────
     THE FIRST VERSION copied the furniture module's guard verbatim: flood-fill THE ROOM,
     treat every stamped cell as an obstacle. It looked right and it was wrong twice over,
     and the gate caught it -- 22 of 64 plates came back with their floor cut in two, while
     the same plates furnished alone came back 0 of 64. Mine, unambiguously.

     WRONG ONE: MOST OF THIS GROUND DOES NOT BLOCK ANYTHING. Rubble is AMPLIFIES and water
     is DISABLES -- both are ground-layer, neither is solid, and you WALK ON BOTH. That is
     the entire point of those classes: unstable footing you can stand on and liquid you can
     wade. Counting them as obstacles invented a connectivity problem that does not exist
     and then refused perfectly good placements to solve it.
     WRONG TWO: THE ONE THING THAT DOES BLOCK IS A VOID, and a void does not care about room
     boundaries. A shaft is a hole in the PLATE. Checking only the room it sits in cannot see
     that it has sealed the corridor the rest of the building reaches that room through, and
     a room-local check is exactly how you get a plate that is fine room by room and cut in
     half overall.

     So: only a VOID blocks, and the flood-fill is over the WHOLE PLATE, across doorways,
     including the furniture the furniture pass already placed -- because the question is
     "can a body still get everywhere in this building", and that question has never had a
     room-shaped answer. */
  function blocks(c, out) {
    if (!c) return true;
    if (out && out[c.__gx + ',' + c.__gy]) return true;
    if (c.furn && (c.furn.cls === 'cover' || c.furn.cls === 'low')) return true;
    return false;
  }
  function plateConnected(fp, pending) {
    var open = [], seen = {}, x, y, k, c;
    function passable(px, py) {
      var cc = fp.grid[py] && fp.grid[py][px];
      if (!cc) return false;
      if (!(isFloor(cc) || isDoor(cc))) return false;
      if (pending && pending[px + ',' + py]) return false;   /* the void being tried */
      if (cc.terrain && cc.terrain['void']) return false;    /* a void already stamped */
      if (cc.furn && (cc.furn.cls === 'cover' || cc.furn.cls === 'low')) return false;
      return true;
    }
    for (y = 0; y < fp.H; y++) for (x = 0; x < fp.W; x++) if (passable(x, y)) open.push([x, y]);
    if (!open.length) return true;
    var q = [open[0]], N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]], n = 0;
    seen[open[0][0] + ',' + open[0][1]] = 1;
    while (q.length) {
      var cur = q.pop(); n++;
      for (k = 0; k < 4; k++) {
        var nx = cur[0] + N4[k][0], ny = cur[1] + N4[k][1], key = nx + ',' + ny;
        if (seen[key] || !passable(nx, ny)) continue;
        seen[key] = 1; q.push([nx, ny]);
      }
    }
    return n === open.length;
  }

  /* THE ROOM'S OWN DOORS, so "far from the threshold" is a real distance and not a guess. */
  function doorsOf(fp, rm) {
    var d = [], x, y;
    for (y = rm.y - 1; y <= rm.y + rm.h; y++) for (x = rm.x - 1; x <= rm.x + rm.w; x++) {
      var c = fp.grid[y] && fp.grid[y][x];
      if (isDoor(c)) d.push([x, y]);
    }
    return d;
  }

  /* Every candidate cell in a room, ranked by how far it is from the nearest door.
     WATER pools at the far end; RUBBLE falls in the middle of the span. Both are just
     orderings of this one list, which is why neither needs a rate. */
  function ranked(fp, rm, out, byWall) {
    var doors = doorsOf(fp, rm), cells = [], x, y, i;
    for (y = rm.y; y < rm.y + rm.h; y++) for (x = rm.x; x < rm.x + rm.w; x++) {
      var c = fp.grid[y] && fp.grid[y][x];
      if (!isFloor(c)) continue;
      if (c.furn) continue;                       /* nothing under the furniture */
      if (nearDoor(fp, x, y)) continue;           /* never seal a doorway */
      if (out[x + ',' + y]) continue;
      var dd = 1e9;
      for (i = 0; i < doors.length; i++)
        dd = Math.min(dd, Math.abs(x - doors[i][0]) + Math.abs(y - doors[i][1]));
      /* distance from the nearest WALL of this room: how far the ceiling is spanning */
      var dw = Math.min(x - rm.x, rm.x + rm.w - 1 - x, y - rm.y, rm.y + rm.h - 1 - y);
      cells.push({ x: x, y: y, door: dd, wall: dw });
    }
    cells.sort(function (a, b) {
      return byWall ? (b.wall - a.wall) || (b.door - a.door)
                    : (b.door - a.door) || (b.wall - a.wall);
    });
    return cells;
  }

  /* HOW MANY, DERIVED FROM THE FAILURE AND NOT FROM A KNOB. The unsupported core of a room
     is the part of its ceiling that had the furthest to span, so it is the part that came
     down — and how big that core is, is a fact about the room, not a rate I picked. A third
     of it: enough that a big room reads as damaged, little enough that it is a feature in
     the room rather than the room's floor. SPREAD multiplies it when he fills it in; with
     SPREAD empty, a room's own shape decides entirely.
     `water` returns 0 with SPREAD empty. See the WET note above: this valley is bone dry
     and the material is defined for the day he rules otherwise. */
  function howMany(kind, coreCells) {
    var mul = (SPREAD && SPREAD[kind] != null) ? SPREAD[kind] : (kind === 'water' ? 0 : 1);
    if (!mul) return 0;
    return Math.max(1, Math.floor(coreCells * 0.34 * mul));
  }

  function stamp(fp, cell, tile) { fp.grid[cell.y][cell.x].terrain = tile; }

  /* ground: stamp `terrain` onto the plate's own grid. Deterministic for a given plate.
     Returns the plan, mutated, plus a manifest so a gate can say what went where. */
  function ground(fp, zone) {
    if (!fp || !fp.grid || !fp.rooms) return fp;
    if (fp.meta && fp.meta.grounded) return fp;
    var out = {}, made = { water: 0, rubble: 0, shaft: 0, rooms: 0 }, ri, i;

    for (ri = 0; ri < fp.rooms.length; ri++) {
      var rm = fp.rooms[ri], role = rm.role, area = rm.w * rm.h;

      /* THE LIFT SHAFT, and it is the only thing here that can kill, so it is the only
         thing here that gets a fourth refusal. */
      if (RISER[role] && !NO_LIFT[zone] && area >= 12) {
        var spots = ranked(fp, rm, out, false);
        for (i = 0; i < spots.length; i++) {
          var s = spots[i];
          /* A HOLE BEHIND A DOOR IS A TRAP, NOT A HAZARD. Two cells clear of any door,
             not one, so walking through the threshold can never drop him. He has to be
             able to SEE it before he is standing next to it. */
          if (s.door < 3) continue;
          /* THE ONLY CONNECTIVITY CHECK IN THIS MODULE, because the shaft is the only
             thing in it that blocks. Whole plate, not this room: a hole is a hole in the
             BUILDING, and a room-local check cannot see the corridor it just sealed. */
          var pend = {}; pend[s.x + ',' + s.y] = 1;
          if (!plateConnected(fp, pend)) continue;
          out[s.x + ',' + s.y] = 1;
          stamp(fp, s, TILES.shaft); made.shaft++; made.rooms++;
          break;
        }
        continue;
      }
      /* CEILING RUBBLE: the unsupported core, measured, in ANY room big enough to have
         one. No role list — see the UNSUPPORTED note. A room five tiles across or smaller
         has no core and is skipped by arithmetic rather than by being left off a list. */
      var list = ranked(fp, rm, out, true);
      var core = [];
      for (i = 0; i < list.length; i++) if (list[i].wall >= UNSUPPORTED) core.push(list[i]);
      var want = howMany('rubble', core.length);
      var put = 0;
      for (i = 0; i < core.length && put < want; i++) {
        var c = core[i];
        /* NO CONNECTIVITY GUARD: rubble is AMPLIFIES, ground-layer, not solid -- you walk
           on it. That is the whole class. Guarding it was inventing a problem. */
        out[c.x + ',' + c.y] = 1;
        stamp(fp, c, TILES.rubble); put++;
      }
      if (put) { made.rubble += put; made.rooms++; }

      /* WATER, which places nothing while SPREAD is empty. Kept as a live branch rather
         than deleted so that filling in SPREAD.water is genuinely one entry. */
      if (WET[role]) {
        var wl = ranked(fp, rm, out, false), wn = howMany('water', wl.length), wp = 0;
        for (i = 0; i < wl.length && wp < wn; i++) {
          var w = wl[i];
          /* NO CONNECTIVITY GUARD: water is DISABLES, and you wade it. */
          out[w.x + ',' + w.y] = 1;
          stamp(fp, w, TILES.water); wp++;
        }
        if (wp) { made.water += wp; made.rooms++; }
      }
    }

    fp.meta = fp.meta || {};
    fp.meta.grounded = true;
    fp.meta.groundMade = made;
    return fp;
  }

  var API = { TILES: TILES, WET: WET, RISER: RISER, NO_LIFT: NO_LIFT,
              UNSUPPORTED: UNSUPPORTED, SPREAD: SPREAD, ground: ground, howMany: howMany };
  root.BohemiaInteriorGround = API;
  if (HASREQ) module.exports = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
