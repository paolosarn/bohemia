/* ============================================================================
   THE CASINO FLOOR: THE FIRST BIG INTERIOR (COMBAT TWO 11/8/26; VAMILY rule 416, ask line 468)

   PAOLO 11/6: 'what are some large ass interiors that we could fight... I don't want the interiors to be like human sized as the
   characters are for real, I still want like this is a block and turf war, I always want that feeling... some fights could be
   inside too, that's just part of this open world kind of vibe'. The coordinator's plan (records/BOHEMIA_PAOLO_THE_BIG_INTERIORS_
   11_6_26.md): THE TILE STAYS A HOUSE inside; the same camera with the roof cut away; the board the building's real plan; cover,
   blockers, high ground, chokepoints; THE DARK (no power unless somebody pays). The first one: a Strip casino's floor.

   THE BOARD (data: slices/fight_ground/casino/casino_floor.json, a layout is 15 strings of 20 characters, a modder edits them; the
   pieces' pictures: slices/fight_ground/casino/, made through the master rig by tools/bohemia_combat_two_the_casino_floor_11_8_26.py,
   the slot banks, tables and pillars the 10/20 rig's own):
     the gaming floor  the carpet of block_casino_* (his 10/9 YES), slot banks in rows (cover), the pit's tables in a ring between
                       the two lines (low cover), columns (nobody walks through one);
     the cage          the cashier's counter under steel bars on the north wall (no way through), the strong room behind it, one
                       door: the chokepoint the floor is fought over;
     the sportsbook    its wall of dead screens on the north wall (one frozen on the last odds), its seats at their desk (low cover);
     the bar           the centre bar, a counter a man takes cover at;
     the lounge stage  one step up: high ground (a level, rule 9/27 'high ground is a roof');
     the high-limit    a room behind a cut-away wall, one door;
     the front doors   on the south edge, two leaves gone.
   THE DARK: the casino has no power unless the map hands it (power_default false): no lamp is lit, the fight is at night inside
   (no sun under a roof); with power, the slot banks still on a battery glow.
   deal(seed, D, G, W, H, opt) -> the board the fight applies (the street board's laid format, as the freeway's), or null.
   check(B) -> the gate's reading: the floor joined, the cage's one door, the dark.
   [bb] Battle Brothers fights only outdoors; this is our own swag (rule 416). [analog horror] one sportsbook screen still lit,
   frozen on the odds of games nobody played.
   ============================================================================ */
(function (root) {
  'use strict';
  function rngOf(s) { s = s >>> 0 || 1; return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return (s >>> 0) / 4294967296; }; }
  function hz(x, y, salt, seed) { var h = (x * 374761393 + y * 668265263 + salt * 2246822519 + (seed >>> 0)) >>> 0; h = (h ^ (h >>> 13)) * 1274126177 >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  var NESW = [[0, -1], [1, 0], [0, 1], [-1, 0]];

  function deal(seed, D, G, W, H, opt) {
    if (!D || !D.data || !D.data.board || !G) return null;
    var B0 = D.data.board, T = B0.templates.floor; if (!T) return null;
    var rnd = rngOf((seed >>> 0) ^ 0x51ed270b), names = Object.keys(T.layouts);
    var lname = opt && opt.layout && T.layouts[opt.layout] ? opt.layout : names[Math.floor(rnd() * names.length)];
    var rows = T.layouts[lname]; if (!rows || rows.length !== H || rows[0].length !== W) return null;
    var fc = !!(T.flip && T.flip.cols) && rnd() < 0.5; if (opt && opt.flip) fc = !!opt.flip[1];
    var ch = function (x, y) { return x >= 0 && y >= 0 && x < W && y < H ? rows[y].charAt(fc ? W - 1 - x : x) : null; };
    var leg = function (c) { return c ? B0.legend[c] || null : null; };
    var tm = G.tile_metres, TP = G.tile_px, pxm = G.px_per_metre, pym = TP[1] / tm, R = 10, AW = W + 2 * R, AH = H + 2 * R;
    var F = D.data.floor, sizes = D.sizes || {}, kit = D.data.kit || {};
    var carpet = function (ax, ay) { var p = F.carpet[Math.floor(hz(ax, ay, 3, seed) * F.carpet.length)]; return p + '#' + Math.floor(hz(ax, ay, 5, seed) * 5) + ',' + Math.floor(hz(ax, ay, 7, seed) * 5); };
    var ground = new Array(AW * AH), terrain = [], roofs = [], tiles = [], cover = [], lights = [], sprites = [];
    for (var ay = 0; ay < AH; ay++) for (var ax = 0; ax < AW; ax++) ground[ay * AW + ax] = carpet(ax, ay);
    /* the pieces' size and foot: the casino kit's (sizes.json: [w, h] px and its foot), the 10/20 rig's cover (the fight's own) */
    var sizeOf = function (p) { var k = p.replace(/^casino_/, ''), s = sizes[k]; if (s) return [s.w, s.h, s.foot[0], s.foot[1]];
      var c = G.cover[p] || (G.cover_extra || {})[p]; return c && c.px ? c.px : null; };
    var put = function (p, x, y, fx, fy, tag) {
      var s = sizeOf(p), d = kit[p] || G.cover[p] || (G.cover_extra || {})[p] || {}, e;
      if (s) e = { piece: p, x_m: Math.round(((x + fx) * tm - s[2] / pxm) * 100) / 100, y_m: Math.round(((y + fy) * tm - s[3] / pym) * 100) / 100, tx: x, ty: y, from: 'casino', what: tag || null };
      else e = { piece: p, x_m: Math.round((x + fx) * tm * 100) / 100 - 3, y_m: Math.round((y + fy) * tm * 100) / 100 - 1.5, tx: x, ty: y, from: 'casino', what: tag || null };
      if (d.blocks_move) e.blocking = true;
      cover.push(e);
    };
    var wallAt = function (x, y) { var q = leg(ch(x, y)); return !!q && q.is === 'wall'; };
    for (var y = 0; y < H; y++) { var tr = [], rr = [], nr = []; for (var x = 0; x < W; x++) {
      var c = ch(x, y), q = leg(c) || { is: 'floor' }, t = 'flat';
      if (q.is === 'wall') t = 'blocked'; else if (q.is === 'stage') t = 'height';
      if (q.is === 'vault') ground[(y + R) * AW + x + R] = F.vault[Math.floor(hz(x, y, 11, seed) * F.vault.length)];
      tr.push(t); rr.push(false); nr.push(q.is);
    } terrain.push(tr); roofs.push(rr); tiles.push(nr); }
    var n = { slots: 0, tables: 0 };
    for (var y2 = 0; y2 < H; y2++) for (var x2 = 0; x2 < W; x2++) {
      var c2 = ch(x2, y2), q2 = leg(c2); if (!q2 || !q2.piece) continue;
      var p = q2.piece;
      if (p === 'casino_wall') p = (wallAt(x2, y2 - 1) || wallAt(x2, y2 + 1)) && !(wallAt(x2 - 1, y2) || wallAt(x2 + 1, y2)) ? 'casino_wall_ns' : 'casino_wall_ew';
      if (p === 'slot_bank') {                               /* a tile of the floor is a house: three rows of two banks, back to back, an aisle between */
        [0.3, 0.58, 0.86].forEach(function (fy) { [0.27, 0.73].forEach(function (fx) { put('slot_bank', x2, y2, fx, fy, 'slots'); n.slots++; }); });
        lights.push({ kind: 'lamp', src: D.data.lights.src, x_m: (x2 + 0.5) * tm, y_m: (y2 + 0.5) * tm, live: true, radius_m: D.data.lights.radius_m, circuit: 'grid', casino: true }); }
      else if (p === 'table') { [[0.25, 0.42], [0.72, 0.42], [0.25, 0.85], [0.72, 0.85]].forEach(function (f) { put('table', x2, y2, f[0], f[1], 'pit'); n.tables++; }); }
      else if (p === 'pillar') put('pillar', x2, y2, 0.5, 0.7);
      else if (p === 'casino_cage' || p === 'casino_bar' || p === 'casino_seats') put(p, x2, y2, 0.5, 0.62);
      else if (p === 'casino_screens') put(p, x2, y2, 0.5, 0.5);
      else if (p === 'casino_wall_ew' || p === 'casino_door' || p === 'casino_glass') put(p, x2, y2, 0.5, 0.55);
      else if (p === 'casino_wall_ns') put(p, x2, y2, 0.5, 0.95);
      else if (p === 'casino_stage') { put(p, x2, y2, 0.5, 0.97);
        if (!(leg(ch(x2, y2 + 1)) && leg(ch(x2, y2 + 1)).is === 'stage')) put('casino_stage_steps', x2, y2, 0.5, 1.0, 'the front'); }   /* the riser's front, on its south edge */
    }
    var L = { W: W, H: H, ring: R, AW: AW, AH: AH, ground: ground, sprites: sprites, terrain: terrain, roofs: roofs, cover: cover, lights: lights, tiles: tiles,
      houses: 0, X0: 0, Y0: 0, seed: seed >>> 0, shift: [0, 0], interior: 'casino' };
    var blocks = []; for (var by = 0; by < Math.ceil(H / (G.block_tiles || 5)); by++) { var br = []; for (var bx = 0; bx < Math.ceil(W / (G.block_tiles || 5)); bx++) br.push('casino.0'); blocks.push(br); }
    return { blocks: blocks, terrain: terrain, cover: cover, lights: lights, name: T.name, kinds: ['casino', 'interior'], family: 'interior', lead: 'casino', shape: null,
      place: 'casino', own: 'casino', start: null, camp: null, lm: null, laid: L, roofs: roofs, interior: 'casino',
      say: { height: 'The lounge stage, one step up.' }, casino: { layout: lname, flip: [false, fc], slots: n.slots, tables: n.tables } };
  }

  /* the gate's reading of a board: every open tile joined to every other (a door, never a wall), the strong room's ways in */
  function check(B) {
    var L = B && B.laid; if (!L) return null;
    var W = L.W, H = L.H, T = L.terrain, solid = {};
    (B.cover || []).forEach(function (c) { if (c.blocking) solid[c.ty * W + c.tx] = 1; });
    var open = function (x, y) { return x >= 0 && y >= 0 && x < W && y < H && T[y][x] !== 'blocked' && !solid[y * W + x]; };
    var seen = new Uint8Array(W * H), q = [], start = -1, total = 0;
    for (var i = 0; i < W * H; i++) if (open(i % W, Math.floor(i / W))) { total++; if (start < 0) start = i; }
    if (start >= 0) { seen[start] = 1; q.push(start); }
    while (q.length) { var cur = q.pop(), cx = cur % W, cy = (cur - cx) / W;
      NESW.forEach(function (d) { var u = cx + d[0], v = cy + d[1]; if (open(u, v) && !seen[v * W + u]) { seen[v * W + u] = 1; q.push(v * W + u); } }); }
    var reached = 0; for (var j = 0; j < W * H; j++) if (seen[j]) reached++;
    var vault = [], waysIn = 0;
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) if (L.tiles[y][x] === 'vault') vault.push([x, y]);
    var inVault = {}; vault.forEach(function (p) { inVault[p[1] * W + p[0]] = 1; });
    vault.forEach(function (p) { NESW.forEach(function (d) { var u = p[0] + d[0], v = p[1] + d[1]; if (open(u, v) && !inVault[v * W + u]) waysIn++; }); });
    return { open: total, reached: reached, vault: vault.length, waysIn: waysIn, lights: (B.lights || []).length };
  }
  root.BohemiaCasinoFloor = { deal: deal, check: check };
})(typeof window !== 'undefined' ? window : this);
