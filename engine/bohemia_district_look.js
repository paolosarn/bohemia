// BOHEMIA DISTRICT LOOK -- WHOSE STREETS THEY ARE, WHETHER THEY STILL HAVE POWER, AND WHAT A PLACE'S MONEY LOOKS LIKE (WORLD 17, 11/27/26)
//
// VAMILY rule 485(a) (Paolo 11/26: 'Lets go cyberpunk vibes but their world has a running economy vibes!'): 'every district reads who
// lives there and why without a word (the money it has or lost, whose streets they are ...), the dead Strip and the half-built luxury
// the money walked away from beside the blocks that still have power, each gang's streets carrying its look and its code (COLOUR IS
// TERRITORY, the runway law)'. Rule 485(b), ECONOMY FOUR's calls (records/BOHEMIA_ECONOMY_FOUR_A_PLACE_EARNS_OR_GOES_DARK_11_27_26.md
// s5): 'a broke town and a well-off one can LOOK it (the verdict is on the town's S.wealth: broke, getting_by, well_off)'.
// Rule 495(b): ONE THING, ONE PLACE. This is the one module the map's painter asks how a block looks for who holds it, whether it has
// power, and what its place can pay for. The painter (vbCityCore in slices/BOHEMIA_CITY_WORLD.html) calls it; it carries no copy.
// Record: records/BOHEMIA_WORLD_17_WHOSE_STREETS_AND_WHAT_THE_MONEY_LOOKS_LIKE_11_27_26.md. Gate: gates/whose_streets_gate.js.
//
// WHAT IT PAINTS (nothing new stands up, no icon, no word: the same texels the painter already paints, read off facts it already has):
//   1. WHOSE STREETS. A block on a wire a faction runs (engine/bohemia_powergrid.js: every live circuit is OWNED, 'light = territory';
//      POWER.at(x, y).faction, the Network's lit grid included) carries that faction's tags along the foot of its walls, in the
//      faction's own colour as the map already draws it (mapFactionColour, the banners off his wardrobe). A neighbourhood's own lights
//      and a lone panel are nobody's, so they carry nothing. At night, where that wire still has power, its neon and its casino floors
//      glow in that colour (a saturated faction; a drab one keeps the street's own light, its drabness is its statement).
//   2. THE BLOCKS THAT STILL HAVE POWER (moved here from WORLD 15's 11/27 painter lines, pixel for pixel): by day a casino or a tower
//      on a block with no power reads dead (its gold and neon dull dust, its windows black, its walls grimed).
//   3. WHAT THE PLACE CAN PAY FOR (ECONOMY FOUR's verdict, engine/bohemia_place_book.js, handed in per town): a BROKE town's windows are
//      boarded, its roofs and tarps gone to dust, a third of its floors lit at night; a town GETTING BY is as it was; a WELL-OFF town
//      is putting panels on its roofs (the reclaimed look the valley's rebuilt blocks already wear) and lights more floors.
//
// THE PAGE HALF (pure, no DOM): palette(), markOf(), wealthOf(). THE PAINTER HALF: vbDistrictDay and vbDistrictLit, self-contained
// (they call nothing but each other and the painter's own vbHash), handed to the painter's worker as source (WORKER).
// node: require('./bohemia_district_look.js')
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  function hexRgb(h) {
    var s = String(h || '').replace('#', '');
    if (!/^[0-9a-f]{6}$/i.test(s)) return null;
    return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
  }
  /* HSV: the tag keeps the faction's own colour; a light is that hue at full value (a lamp is not a garment) */
  function hsv(c) {
    var r = c[0] / 255, g = c[1] / 255, b = c[2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, hh = 0;
    if (d > 0) hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [(hh * 60 + 360) % 360, mx > 0 ? d / mx : 0, mx];
  }
  function rgbOf(h, s, v) {
    var c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c, r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; } else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; } else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  }
  /* a faction is DRAB when its colour carries under this much saturation (COLOUR IS TERRITORY test 2: drab is legal when drabness
     is the statement); a drab faction's tags are its own grey, its light is the street's */
  var DRAB = 0.22;

  /* THE PAINTER'S MARKS, one per faction, index 0 none. names: the factions in the map's own order; colourOf(name): its hex (the
     map's mapFactionColour). Returns { names, tag: [null, rgb...], light: [null, rgb | null...], key } */
  var PAL_CACHE = {};
  function palette(names, colourOf) {
    var ns = (names || []).slice(), cols = ns.map(function (n) { try { return colourOf ? colourOf(n) : null; } catch (_e) { return null; } });
    var key = ns.map(function (n, i) { return n + '=' + (cols[i] || ''); }).join(';');
    if (PAL_CACHE[key]) return PAL_CACHE[key];
    var tag = [null], light = [null], drab = [false];
    for (var i = 0; i < ns.length; i++) {
      var c = hexRgb(cols[i]);
      if (!c) { tag.push(null); light.push(null); drab.push(false); continue; }
      var q = hsv(c), dr = q[1] < DRAB;
      tag.push(c);
      light.push(dr ? null : rgbOf(q[0], Math.min(0.85, Math.max(0.6, q[1])), 0.96));
      drab.push(dr);
    }
    var out = { names: ns, tag: tag, light: light, drab: drab, key: 'd1:' + hash(key) };
    PAL_CACHE[key] = out;
    return out;
  }
  function hash(s) { var h = 2166136261 >>> 0; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36); }

  /* WHOSE STREET A BLOCK IS, as the palette's index: the faction that runs its wire (POWER.at's faction: a faction's own circuit, or
     the Network's lit grid), else, on a wire that is lit or was lit and lost, the faction whose ground it runs under (the same answer
     ECONOMY FOUR's book gives: that faction keeps it lit, collects there, and loses it when it cannot feed its men); 0 for a wire that
     was never lit on nobody's ground, or ground no wire runs down */
  function markOf(pal, cell) {
    if (!pal || !cell || !(cell.id >= 0)) return 0;
    var who = cell.faction || ((cell.live || cell.doused) ? cell.ground : null);
    if (!who) return 0;
    var f = String(who).toUpperCase();
    for (var i = 0; i < pal.names.length; i++) if (String(pal.names[i]).toUpperCase() === f) return pal.tag[i + 1] ? i + 1 : 0;
    return 0;
  }

  /* THE VALLEY'S TWO GRIDS FOR THE PAINTER, one pass (n x n blocks):
       live: WHETHER A BLOCK HAS POWER. MEASURED (the demo, 11/27): the grid's wires run only down the roads (arterials, the Strip's
         boulevard, the freeway), so the painter read every building as unpowered: by day every casino and tower in the valley was
         dulled dead (WORLD 15's dead Strip had nothing to stand beside) and at night not one tower window was lit. A feeder feeds the
         buildings along its street: a building has power when a street it faces (not the freeway: its lamps are its own) carries a
         live wire; a wire's own block, when its circuit is live.
       turf: WHOSE STREET IT IS (markOf), and a building is its street's: the mark of the lit street it faces, else of any marked
         street it faces (N, E, S, W, the same answer every time).
     cellAt(x, y): the grid's answer (POWER.at); streetAt(x, y): a street a building can face; deadAt(x, y) (optional): a block that
     cannot take power whatever its street carries (a burned shell, a frame the money left: WORLD 15's 'never powered'). Returns { live, turf, n } */
  function grids(pal, n, cellAt, streetAt, deadAt) {
    var N = n | 0, live = new Uint8Array(N * N), turf = new Uint8Array(N * N), st = new Uint8Array(N * N), lit0 = new Uint8Array(N * N);
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      var k = y * N + x, c = null; try { c = cellAt(x, y); } catch (_e) { c = null; }
      lit0[k] = c && c.live ? 1 : 0; turf[k] = pal ? markOf(pal, c) : 0;
      try { st[k] = streetAt(x, y) ? 1 : 0; } catch (_e) { st[k] = 0; }
    }
    var D = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    for (var y2 = 0; y2 < N; y2++) for (var x2 = 0; x2 < N; x2++) {
      var k2 = y2 * N + x2; live[k2] = lit0[k2];
      if (st[k2] || lit0[k2]) continue;
      var litMark = 0, anyMark = 0;
      for (var i = 0; i < 4; i++) { var nx = x2 + D[i][0], ny = y2 + D[i][1]; if (nx < 0 || ny < 0 || nx >= N || ny >= N) continue;
        var q = ny * N + nx; if (!st[q]) continue;
        if (lit0[q]) { live[k2] = 1; if (!litMark && turf[q]) litMark = turf[q]; }
        if (!anyMark && turf[q]) anyMark = turf[q]; }
      if (!turf[k2]) turf[k2] = litMark || anyMark;
    }
    if (deadAt) for (var k3 = 0; k3 < N * N; k3++) { var dx3 = k3 % N, dy3 = (k3 / N) | 0; try { if (live[k3] && !st[k3] && !lit0[k3] && deadAt(dx3, dy3)) live[k3] = 0; } catch (_e) {} }   /* a building only: a street keeps its own lamps as it always did */
    return { live: live, turf: turf, n: N };
  }

  /* WHAT A PLACE CAN PAY FOR, as the painter reads it: 0 broke, 1 getting by (or no verdict yet: as it always looked), 2 well off.
     w: the town's verdict ({ verdict }) or the verdict word itself */
  function wealthOf(w) {
    var v = w && typeof w === 'object' ? w.verdict : w;
    return v === 'broke' ? 0 : v === 'well_off' ? 2 : 1;
  }

  /* ---- THE PAINTER HALF (runs in the painter's worker as source: self-contained) ----
     One texel's daylight colour. b: the colour the painter has so far; K: 1 casino, 2 tower, 3 a house or a roof, 4 a town's own box;
     neon / win: the texel is the block's neon or its window; top / roof: a top face, and one that stands a storey up; lift: texels
     above the ground; Q: the painter's scale (texels a twelfth of a block); lit: the block has power; ws: the valley's state of the
     block (0 none, 1 burned, 2 looted, 3 rebuilt, 4 a frame the money left); tag: the faction's tag colour or null; wl: the town's
     money (0 broke, 1 getting by, 2 well off; -1 not a town); u, v: the texel's ground coordinates in the valley; sd: the painter's
     seed; dust: the painter's dust grey */
  function vbDistrictDay(b, K, neon, win, top, roof, lift, Q, lit, ws, tag, wl, u, v, sd, dust) {
    /* THE DEAD STRIP BY DAY (WORLD 15, 11/27, moved here as it was): a casino or a tower on a block with no power, the valley's state
       not on it, reads dead in daylight */
    if (!ws && !lit && (K === 1 || K === 2)) {
      if (neon || (top && K === 1)) { var k1 = 0.62; return [(b[0] * (1 - k1) + dust * k1) * 0.78, (b[1] * (1 - k1) + dust * k1) * 0.76, (b[2] * (1 - k1) + dust * k1) * 0.74]; }
      if (win) return [b[0] * 0.18 + 24, b[1] * 0.18 + 23, b[2] * 0.18 + 22];
      var k2 = 0.2; b = [(b[0] * (1 - k2) + dust * k2) * 0.84, (b[1] * (1 - k2) + dust * k2) * 0.83, (b[2] * (1 - k2) + dust * k2) * 0.82];
    }
    /* WHOSE STREETS: the faction's tags along the foot of the walls on its blocks, in dashes two storeys of paint high at most; not on
       a burned block or a frame (nobody tags char or bare rebar) */
    if (tag && K >= 1 && K <= 3 && !top && lift >= 1 && lift <= 2 * Q && ws !== 1 && ws !== 4) {
      var seg = (((u + v * 3) / (2 * Q)) | 0), hs = (Math.imul(seg ^ 0x2c1b3c6d, 0x297a2d39) ^ (sd | 0)) >>> 0;
      if ((hs & 7) < 4 && !(lift > Q && ((hs >>> 3) & 3) === 0) && vbHash(u, v + lift * 5, (sd | 0) + 43) < 0.82)   /* sprayed: a few texels of wall show through */
        return [b[0] * 0.28 + tag[0] * 0.72, b[1] * 0.28 + tag[1] * 0.72, b[2] * 0.28 + tag[2] * 0.72];
    }
    /* and its colour, faded, on a share of the roofs along its street (tarps, tanks, a sheet over a hole): the way every town already
       wears its own (EVERY TOWN ITS OWN), and the one face of a building the map always shows */
    if (tag && K >= 1 && K <= 3 && roof && ws !== 1 && ws !== 4) {
      var hr = (Math.imul(((u / (3 * Q)) | 0) ^ 0x51ed27, 0x2c1b3c6d) ^ Math.imul((v / (3 * Q)) | 0, 0x297a2d39) ^ (sd | 0)) >>> 0;
      if (hr % 100 < 14) return [b[0] * 0.45 + tag[0] * 0.55, b[1] * 0.45 + tag[1] * 0.55, b[2] * 0.45 + tag[2] * 0.55];
    }
    /* WHAT THE PLACE CAN PAY FOR, on a town's own box */
    if (K === 4 && wl === 0) {
      var hb = vbHash(u, v + lift * 7, (sd | 0) + 41);
      if (!top && lift > 1 && (lift % 2) === 1 && hb < 0.45) return hb < 0.3 ? [100, 80, 58] : [82, 66, 50];   /* a boarded window: weathered plywood, never a warm light */
      if (top) {
        if (roof) { var hh = vbHash((u / Q) | 0, (v / Q) | 0, (sd | 0) + 47);
          if (hh < 0.13) return [34, 30, 28];   /* a hole where the roof went */
          if (hh < 0.21) return [96, 98, 100]; }   /* a sheet of tin weighed down over one */
        var kt = roof ? 0.42 : 0.18, L = b[0] * 0.3 + b[1] * 0.59 + b[2] * 0.11;   /* dust on the roofs, the colour gone out of its tarps */
        return [(b[0] * 0.5 + L * 0.5) * (1 - kt) + 150 * kt, (b[1] * 0.5 + L * 0.5) * (1 - kt) + 140 * kt, (b[2] * 0.5 + L * 0.5) * (1 - kt) + 122 * kt]; }
      return [(b[0] * 0.78 + dust * 0.22) * 0.9, (b[1] * 0.78 + dust * 0.22) * 0.9, (b[2] * 0.78 + dust * 0.22) * 0.9];   /* the walls grimed */
    }
    if (K === 4 && wl === 2) {
      if (roof && (((u >> 1) + (v >> 2)) % 2) === 0) { var pu = ((u >> 1) + v) % 4; return pu === 0 ? [132, 172, 200] : pu === 3 ? [46, 80, 122] : [64, 104, 146]; }   /* panels going up on the roofs */
      if (!top) return [Math.min(255, b[0] * 1.06), Math.min(255, b[1] * 1.06), Math.min(255, b[2] * 1.06)];   /* the walls kept */
    }
    return b;
  }
  /* the share of a town's tall floors lit at night where it has power, by its money (getting by: the 0.3 it always had) */
  function vbDistrictLit(wl) { return wl === 0 ? 0.12 : wl === 2 ? 0.55 : 0.3; }

  var API = { palette: palette, markOf: markOf, grids: grids, wealthOf: wealthOf, day: vbDistrictDay, lit: vbDistrictLit, WORKER: [vbDistrictDay, vbDistrictLit], DRAB: DRAB };
  if (HASREQ) module.exports = API;
  root.BohemiaDistrictLook = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
