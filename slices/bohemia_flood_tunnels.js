/* ============================================================================
   THE FLOOD TUNNELS: THE SECOND BIG INTERIOR (COMBAT TWO 11/9/26; VAMILY rule 440(a), rule 416's list, ask line 539)

   PAOLO 11/9: 'More everything pls'. Rule 416's list, the second: the valley's flood channels, 600 to 700 miles of them, about 200
   underground, 300 to 1,500 people living in them, 31 flood deaths since 1960 (records/BOHEMIA_PAOLO_THE_BIG_INTERIORS_11_6_26.md).
   The coordinator: 'a long chain of house-sized culvert tiles, camps on the walls, the street's light through the grates, dark unless
   lit, the flash flood as the event; a fight at a wash or a drain mouth can use it'.

   THE BOARD (data: slices/fight_ground/tunnels/tunnels.json, a layout of 15 strings of 20 characters, mirrored by the dice; pictures
   slices/fight_ground/tunnels/ through the master rig, tools/bohemia_combat_two_the_flood_tunnels_11_9_26.py), THE TILE STAYS A HOUSE:
     the main channel     three tiles wide east to west, the wash's own concrete channel floor (its silt line), a drain's mouth at
                          each end with its trash rack bent open (the wash's light);
     the drains           one tile wide, north and south off the main, to the drains along the top and the bottom;
     the chambers         where they meet, a little room;
     the camps            on the walls: a mattress and a cart of bags, a lean-to of tarp (low cover);
     the jam              what the last flood left in the main channel (cover);
     the fill             the gravel the culverts are buried in (the landfill's own), every culvert wall cut away at 1.8 m.
   THE DARK: under the ground it is night; the day falls through the street grates and in at the mouths (by day only), and the
   fires people keep in drums burn day and night.
   THE FLASH FLOOD: on a round the dice pick (round_min to round_max), a roar the round before, then the main channel fills with
   water (ground row: swamp, a man there fights worse and walks slow) for 'lasts' rounds, then drops, the silt left behind (rough).
   deal(seed, D, G, W, H, opt) -> the board the fight applies (the street board's laid format), or null; check(B) -> the gate's reading.
   [bb] Battle Brothers fights only outdoors; under the city is our own swag (rule 416).
   [analog horror] a candle in a jar still burning on a crate in a camp nobody is in, a hundred metres into the dark.
   ============================================================================ */
(function (root) {
  'use strict';
  function rngOf(s) { s = s >>> 0 || 1; return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return (s >>> 0) / 4294967296; }; }
  function hz(x, y, salt, seed) { var h = (x * 374761393 + y * 668265263 + salt * 2246822519 + (seed >>> 0)) >>> 0; h = (h ^ (h >>> 13)) * 1274126177 >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  var NESW = [[0, -1], [1, 0], [0, 1], [-1, 0]];

  function deal(seed, D, G, W, H, opt) {
    if (!D || !D.data || !D.data.board || !G) return null;
    var B0 = D.data.board, T = B0.templates.drains; if (!T) return null;
    var rnd = rngOf((seed >>> 0) ^ 0x7f4a7c15), names = Object.keys(T.layouts);
    var lname = opt && opt.layout && T.layouts[opt.layout] ? opt.layout : names[Math.floor(rnd() * names.length)];
    var rows = T.layouts[lname]; if (!rows || rows.length !== H || rows[0].length !== W) return null;
    var fc = !!(T.flip && T.flip.cols) && rnd() < 0.5, fr = !!(T.flip && T.flip.rows) && rnd() < 0.5;
    if (opt && opt.flip) { fr = !!opt.flip[0]; fc = !!opt.flip[1]; }
    var ch = function (x, y) { if (x < 0 || y < 0 || x >= W || y >= H) return null; return rows[fr ? H - 1 - y : y].charAt(fc ? W - 1 - x : x); };
    var leg = function (c) { return c ? B0.legend[c] || null : null; };
    var isOpen = function (x, y) { var q = leg(ch(x, y)); return !!q && q.is !== 'fill'; };
    var tm = G.tile_metres, TP = G.tile_px, pxm = G.px_per_metre, pym = TP[1] / tm, R = 10, AW = W + 2 * R, AH = H + 2 * R;
    var F = D.data.floor, sizes = D.sizes || {}, kit = D.data.kit || {}, night = !!(opt && opt.night);
    var pic = function (list, x, y, salt) { return list[Math.floor(hz(x, y, salt, seed) * list.length)]; };
    var ground = new Array(AW * AH), terrain = [], roofs = [], tiles = [], cover = [], lights = [], sprites = [], channel = [];
    /* the ring: the fill, and a channel or a drain running off the board runs on in it */
    for (var ay = 0; ay < AH; ay++) for (var ax = 0; ax < AW; ax++) {
      var bx = Math.max(0, Math.min(W - 1, ax - R)), by = Math.max(0, Math.min(H - 1, ay - R)), inB = ax >= R && ay >= R && ax < R + W && ay < R + H;
      var q0 = leg(ch(bx, by)), run = q0 && q0.is !== 'fill' && (inB || ((ax < R || ax >= R + W) && ay >= R && ay < R + H) || ((ay < R || ay >= R + H) && ax >= R && ax < R + W));
      ground[ay * AW + ax] = run ? (q0.is === 'channel' ? pic(F.channel, ax, ay, 3) : pic(F.floor, ax, ay, 5)) : pic(F.fill, ax, ay, 7);
    }
    for (var y = 0; y < H; y++) { var tr = [], rr = [], nr = []; for (var x = 0; x < W; x++) {
      var q = leg(ch(x, y)) || { is: 'fill' }, t = q.is === 'fill' ? 'blocked' : 'flat';
      if (q.is === 'channel') channel.push([x, y]);
      tr.push(t); rr.push(false); nr.push(q.tile || q.is);   /* the tile's own name: its row in the data's 'tiles' (its cost, its effect, its line) */
    } terrain.push(tr); roofs.push(rr); tiles.push(nr); }
    var sizeOf = function (p) { var s = sizes[p.replace(/^tunnel_/, '')]; return s ? [s.w, s.h, s.foot[0], s.foot[1]] : null; };
    var put = function (p, x, y, fx, fy, tag) {
      var dk = (opt && opt.dress && opt.dress[p]) || null;   /* a piece of the street board's own kit, reused (the flood carried it in): its size and its foot from that kit */
      var s = sizeOf(p) || (dk && dk.foot ? [dk.w, dk.h, dk.foot[0], dk.foot[1]] : null), d = kit[p] || dk || {}, e;
      if (s) e = { piece: p, x_m: Math.round(((x + fx) * tm - s[2] / pxm) * 100) / 100, y_m: Math.round(((y + fy) * tm - s[3] / pym) * 100) / 100, tx: x, ty: y, from: 'tunnels', what: tag || null };
      else e = { piece: p, x_m: Math.round((x + fx) * tm * 100) / 100 - 2, y_m: Math.round((y + fy) * tm * 100) / 100 - 1, tx: x, ty: y, from: 'tunnels', what: tag || null };
      if (d.blocks_move) e.blocking = true;
      cover.push(e);
    };
    /* a light: the grate's ladder, the drum; the mouth's is the wash's day itself, no fixture (src null), its pool from the
       culvert's end (the tile's outer edge) */
    var lamp = function (kind, x, y) { var Lk = D.data.lights[kind]; if (!Lk) return;
      var edge = !Lk.src && (x === 0 || x === W - 1), lx = edge ? (x === 0 ? 0 : W) * tm : (x + 0.5) * tm, ly = edge ? (y + 0.5) * tm : (y + 0.3) * tm;
      lights.push({ kind: 'lamp', src: Lk.src || null, x_m: lx, y_m: ly, live: Lk.day ? !night : true, radius_m: Lk.radius_m, circuit: Lk.day ? 'day' : 'fire', tunnels: kind }); };
    for (var y2 = 0; y2 < H; y2++) for (var x2 = 0; x2 < W; x2++) {
      var q2 = leg(ch(x2, y2));
      if (!q2 || q2.is === 'fill') {
        /* the culvert's wall, cut away, on every edge this fill tile shares with a culvert */
        if (isOpen(x2, y2 - 1)) put('tunnel_wall_ew', x2, y2, 0.5, 0.12, 'wall');
        if (isOpen(x2, y2 + 1)) put('tunnel_wall_ew', x2, y2, 0.5, 1.0, 'wall');
        if (isOpen(x2 - 1, y2)) put('tunnel_wall_ns', x2, y2, 0.04, 1.0, 'wall');
        if (isOpen(x2 + 1, y2)) put('tunnel_wall_ns', x2, y2, 0.96, 1.0, 'wall');
        continue;
      }
      if (q2.piece) put(q2.piece, x2, y2, 0.5, 0.6, q2.is);
      /* the trash rack across the culvert's end: a channel tile on the board's edge (the channel runs on into the wash), the
         mouth's own tile wearing it pried open */
      if (q2.is === 'channel' && (x2 === 0 || x2 === W - 1)) put(q2.light === 'mouth' ? 'tunnel_mouth' : 'tunnel_rack', x2, y2, x2 === 0 ? 0.04 : 0.96, 1.0, 'rack');
      if (q2.light) lamp(q2.light, x2, y2);
    }
    var TK = D.data.tiles || {};
    var fl = D.data.flood || {}, lo = fl.round_min || 3, hi = fl.round_max || lo, fround = lo + Math.floor(rnd() * (hi - lo + 1));
    var flood = { tiles: channel, round: fround, warn: fl.warn == null ? 1 : fl.warn, lasts: fl.lasts || 2, on: false, said: {} };
    var L = { W: W, H: H, ring: R, AW: AW, AH: AH, ground: ground, sprites: sprites, terrain: terrain, roofs: roofs, cover: cover, lights: lights, tiles: tiles,
      houses: 0, X0: 0, Y0: 0, seed: seed >>> 0, shift: [0, 0], interior: 'tunnels' };
    var blocks = []; for (var bby = 0; bby < Math.ceil(H / (G.block_tiles || 5)); bby++) { var br = []; for (var bbx = 0; bbx < Math.ceil(W / (G.block_tiles || 5)); bbx++) br.push('wash.3'); blocks.push(br); }
    return { blocks: blocks, terrain: terrain, cover: cover, lights: lights, name: T.name, kinds: ['tunnels', 'interior'], family: 'interior', lead: 'tunnels', shape: null,
      place: 'tunnels', own: 'tunnels', start: null, camp: null, lm: null, laid: L, roofs: roofs, interior: 'tunnels',
      say: { water: (TK.flood && TK.flood.water && TK.flood.water.say) || 'Flood water: you fight worse, and it drags at you.', rough: (TK.flood && TK.flood.silt && TK.flood.silt.say) || 'The flood\'s silt: slow going.' }, tileKey: TK, tunnels: { layout: lname, flip: [fr, fc], flood: flood } };
  }

  /* the gate's reading: every open tile joined, the channel the flood fills, the lights by day and by night */
  function check(B) {
    var L = B && B.laid; if (!L) return null;
    var W = L.W, H = L.H, T = L.terrain, open = function (x, y) { return x >= 0 && y >= 0 && x < W && y < H && T[y][x] !== 'blocked'; };
    var seen = new Uint8Array(W * H), q = [], total = 0, start = -1;
    for (var i = 0; i < W * H; i++) if (open(i % W, Math.floor(i / W))) { total++; if (start < 0) start = i; }
    if (start >= 0) { seen[start] = 1; q.push(start); }
    while (q.length) { var c = q.pop(), cx = c % W, cy = (c - cx) / W;
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var u = cx + dx, v = cy + dy; if ((dx || dy) && open(u, v) && !seen[v * W + u]) { seen[v * W + u] = 1; q.push(v * W + u); } } }
    var reached = 0; for (var j = 0; j < W * H; j++) if (seen[j]) reached++;
    var t = B.tunnels || {}, fl = t.flood || {};
    return { open: total, reached: reached, channel: (fl.tiles || []).length, floodRound: fl.round, lights: (B.lights || []).length,
      day: (B.lights || []).filter(function (l) { return l.circuit === 'day'; }).length, fire: (B.lights || []).filter(function (l) { return l.circuit === 'fire'; }).length,
      camps: (B.cover || []).filter(function (cv) { return /camp/.test(cv.piece); }).length };
  }
  root.BohemiaFloodTunnels = { deal: deal, check: check };
})(typeof window !== 'undefined' ? window : this);
