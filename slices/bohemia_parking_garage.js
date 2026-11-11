/* ============================================================================
   THE PARKING GARAGE: THE THIRD BIG INTERIOR (COMBAT THREE 11/11/26; VAMILY rule 440(a), rule 416's list, ask row 539)

   PAOLO 11/9: 'More everything pls'. The coordinator: 'THE FLOOD TUNNELS and THE PARKING GARAGE as fight boards, house-sized tiles,
   each tile with its cost and effect, every building on a road, AUTO scrambles off the open floor; the casino floor is the golden
   piece to match'. The big interiors' plan (records/BOHEMIA_PAOLO_THE_BIG_INTERIORS_11_6_26.md): THE TILE STAYS A HOUSE inside; the
   same camera, the decks above cut away; cover, blockers, high ground, chokepoints; THE DARK.

   THE BOARD (data: slices/fight_ground/garage/garage.json, a layout is 15 strings of 20 characters, a modder edits them). THE PICTURES
   ARE COOK FIVE'S FINISHED KIT (slices/fight_ground/garage/garage_art.json: the floor's stalls and aisle, the raised bay, the ramps,
   the rails, the outer wall, the columns, the core, the pay booths); the parked cars are COMBAT's own
   (tools/bohemia_combat_three_the_parking_garage_11_11_26.py). One deck of a Strip casino's parking structure, a split level:
     the low bay     rows of DEAD CARS IN THEIR STALLS (cover) either side of the two-way DRIVE AISLES (the garage's OPEN FLOOR: on AUTO
                     nobody stays on it), columns nobody walks through, wrecks left across an aisle (cover), the pay booths at the
                     way out to the street;
     the high bay    a raised bay under the north wall, half a storey up: HIGH GROUND (a blow or a shot down lands easier, a gun
                     reaches a tile more), its own cars and wrecks, the guard rail on its open edges;
     the ramps       in the bay's own aisle, climbing east or west: the WALK up (a man who walks up still strikes that turn). Over
                     the rail anywhere else is the fight's CLIMB (rule 328: no attack that turn; a beast cannot climb);
     the core        the stairs and the lift on the north wall; the outer wall all round.
   THE DARK: under the decks above it is night by day and by night. By day the light comes in the open sides (the north and the
   south edge rows) and at the way in; the middle of the deck is dark; the drum fires somebody keeps burn day and night.
   EVERY TILE HAS ITS COST AND ITS EFFECT: the data's 'tiles' (rule 59), handed to the fight as the board's tileKey.
   deal(seed, D, G, W, H, opt) -> the board the fight applies (the street board's laid format, as the casino's), or null.
   check(B) -> the gate's reading: the floor joined, the high bay walked onto by the ramps and by nothing else, the lights.
   [bb] Battle Brothers fights only outdoors; a garage is our own swag (rule 416). [analog horror] one car in the whole dark deck
   with towels in its windows and a chair set beside it, the stall next to it swept clean.
   ============================================================================ */
(function (root) {
  'use strict';
  function rngOf(s) { s = s >>> 0 || 1; return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return (s >>> 0) / 4294967296; }; }
  function hz(x, y, salt, seed) { var h = (x * 374761393 + y * 668265263 + salt * 2246822519 + (seed >>> 0)) >>> 0; h = (h ^ (h >>> 13)) * 1274126177 >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  var NESW = [[0, -1], [1, 0], [0, 1], [-1, 0]];

  function deal(seed, D, G, W, H, opt) {
    if (!D || !D.data || !D.data.board || !G || !D.art || !D.art.floor) return null;
    var B0 = D.data.board, T = B0.templates.deck; if (!T) return null;
    var rnd = rngOf((seed >>> 0) ^ 0x3c6ef372), names = Object.keys(T.layouts);
    var lname = opt && opt.layout && T.layouts[opt.layout] ? opt.layout : names[Math.floor(rnd() * names.length)];
    var rows = T.layouts[lname]; if (!rows || rows.length !== H || rows[0].length !== W) return null;
    var fc = !!(T.flip && T.flip.cols) && rnd() < 0.5; if (opt && opt.flip) fc = !!opt.flip[1];
    var ch = function (x, y) { return x >= 0 && y >= 0 && x < W && y < H ? rows[y].charAt(fc ? W - 1 - x : x) : null; };
    var leg = function (c) { return c ? B0.legend[c] || null : null; };
    var tm = G.tile_metres, TP = G.tile_px, pxm = G.px_per_metre, pym = TP[1] / tm, R = 10, AW = W + 2 * R, AH = H + 2 * R;
    var AF = D.art.floor, AK = D.art.kit || {}, sizes = D.sizes || {}, kit = D.kit || D.data.kit || {}, night = !!(opt && opt.night), dress = (opt && opt.dress) || {}, TK = D.data.tiles || {};
    var up = (D.data.bay_m || 1.42) * pxm / pym;   /* how far north (in ground metres) a thing standing on the raised bay is drawn: a height is not foreshortened, the ground is */
    var cell = function (list, x, y, salt) { return list[Math.floor(hz(x, y, salt, seed) * list.length)]; };
    var is = function (x, y) { var q = leg(ch(x, y)); return q ? q.is : 'wall'; };
    var isWall = function (x, y) { return is(x, y) === 'wall'; }, isHigh = function (x, y) { return is(x, y) === 'high'; };
    var ground = new Array(AW * AH), terrain = [], roofs = [], tiles = [], cover = [], lights = [], sprites = [];
    /* the ring: the deck goes on past the fight's walls (a garage is bigger than any fight in it): the aisle's floor */
    for (var ay = 0; ay < AH; ay++) for (var ax = 0; ax < AW; ax++) ground[ay * AW + ax] = cell(AF.aisle, ax, ay, 3);
    var n = { cars: 0, wrecks: 0, ramps: 0, lived: 0, high: 0 };
    for (var y = 0; y < H; y++) { var tr = [], rr = [], nr = []; for (var x = 0; x < W; x++) {
      var q = leg(ch(x, y)) || { is: 'wall' }, name = q.tile || q.is, t = q.terrain || (q.is === 'wall' ? 'blocked' : (q.is === 'high' || q.is === 'ramp') ? 'height' : 'flat');
      var stalls = q.is === 'stall' || name === 'high_cars' || name === 'high_stall' || name === 'high_fire' || (q.is === 'high' && name === 'column');
      ground[(y + R) * AW + x + R] = cell(stalls ? AF.stalls : AF.aisle, x, y, 5);
      tr.push(t); rr.push(q.is === 'high'); nr.push(name); if (q.is === 'high') n.high++;   /* the raised bay is the fight's roof (a climb from below); a ramp is high ground a man walks up */
    } terrain.push(tr); roofs.push(rr); tiles.push(nr); }
    /* a piece's size and foot: COOK FIVE's kit (garage_art.json), COMBAT's own cars (the data's sizes), the street board's kit */
    var sizeOf = function (p) { var a = AK[p]; if (a && a.foot) return [a.w, a.h_px, a.foot[0], a.foot[1]];
      var s = sizes[(kit[p] && kit[p].like) || p.replace(/^garage_/, '')]; if (s) return [s.w, s.h, s.foot[0], s.foot[1]];
      var dk = dress[p]; if (dk && dk.foot) return [dk.w, dk.h, dk.foot[0], dk.foot[1]];
      var c = G.cover[p] || (G.cover_extra || {})[p]; return c && c.px ? c.px : null; };
    var put = function (p, x, y, fx, fy, tag, lift) {
      var s = sizeOf(p), d = kit[p] || AK[p] || dress[p] || G.cover[p] || (G.cover_extra || {})[p] || {}, e;
      if (s) e = { piece: p, x_m: Math.round(((x + fx) * tm - s[2] / pxm) * 100) / 100, y_m: Math.round(((y + fy) * tm - s[3] / pym - (lift ? up : 0)) * 100) / 100, tx: x, ty: y, from: 'garage', what: tag || null };
      else e = { piece: p, x_m: Math.round((x + fx) * tm * 100) / 100 - 3, y_m: Math.round(((y + fy) * tm - (lift ? up : 0)) * 100) / 100 - 1.5, tx: x, ty: y, from: 'garage', what: tag || null };
      if (d.blocks_move) e.blocking = true;
      cover.push(e);
    };
    var lamp = function (kind, lx, ly) { var Lk = D.data.lights[kind]; if (!Lk) return;
      lights.push({ kind: 'lamp', src: Lk.src || null, x_m: lx, y_m: ly, live: Lk.day ? !night : true, radius_m: Lk.radius_m, circuit: Lk.day ? 'day' : 'fire', garage: kind }); };
    var C = D.data.cars || {}, stallCars = C.stalls || ['garage_cars_a'], wrecks = C.wrecks || ['sb_wreck_S'], pk = C.parked || [], ps = C.parked_share == null ? 0.8 : C.parked_share;
    /* north to south, so what stands nearer the camera is laid later (the raised bay under what stands on it) */
    for (var y2 = 0; y2 < H; y2++) for (var x2 = 0; x2 < W; x2++) {
      var q2 = leg(ch(x2, y2)); if (!q2) continue;
      var p = q2.piece, hi = q2.is === 'high', nm = q2.tile || q2.is;
      if (q2.is === 'wall') {
        /* the outer wall on every edge this wall tile shares with the deck; the core stands on its own tile */
        var open = function (u, v) { return u >= 0 && v >= 0 && u < W && v < H && !isWall(u, v); };
        if (open(x2, y2 - 1)) put('garage_wall_ew', x2, y2, 0.5, 0.1, 'wall');
        if (open(x2, y2 + 1)) put('garage_wall_ew', x2, y2, 0.5, 1.0, 'wall');
        if (open(x2 - 1, y2)) put('garage_wall_ns', x2, y2, 0.03, 1.0, 'wall');
        if (open(x2 + 1, y2)) put('garage_wall_ns', x2, y2, 0.97, 1.0, 'wall');
        if (p === 'garage_core') put(p, x2, y2, 0.5, 0.98, 'stair');
        continue;
      }
      if (hi) put(nm === 'high' || nm === 'high_wreck' ? 'garage_level_aisle' : 'garage_level', x2, y2, 0.5, 1.0, 'bay');   /* the raised bay, a whole tile, the casino stage's way */
      if (q2.is === 'ramp') { put(isHigh(x2 + 1, y2) ? 'garage_ramp_e' : 'garage_ramp_w', x2, y2, 0.5, 1.0, 'ramp'); n.ramps++; }
      if (q2.cars) {
        /* a tile of stalls is a house wide: two rows nose to nose. One group of cars a row is COVER (two pieces a tile); the
           same cars in the stalls beside them are drawn and never counted (kind DRESS): a row of parked cars reads as a row */
        var a = stallCars[Math.floor(hz(x2, y2, 11, seed) * stallCars.length)], b = stallCars[Math.floor(hz(x2, y2, 13, seed) * stallCars.length)], west = hz(x2, y2, 31, seed) < 0.5;
        if (hz(x2, y2, 17, seed) < (C.lived_in_share || 0)) { a = 'garage_cars_c'; n.lived++; }
        if (pk.length && hz(x2, y2, 37, seed) < ps) put(pk[Math.floor(hz(x2, y2, 41, seed) * pk.length)], x2, y2, west ? 0.74 : 0.26, 0.47, 'parked', hi);
        put(a, x2, y2, west ? 0.26 : 0.74, 0.47, 'cars', hi);
        if (pk.length && hz(x2, y2, 43, seed) < ps) put(pk[Math.floor(hz(x2, y2, 47, seed) * pk.length)], x2, y2, west ? 0.26 : 0.74, 0.96, 'parked', hi);
        put(b, x2, y2, west ? 0.74 : 0.26, 0.96, 'cars', hi); n.cars += 2;
      }
      else if (q2.wreck) { put(wrecks[Math.floor(hz(x2, y2, 29, seed) * wrecks.length)], x2, y2, 0.5, 0.66, 'wreck', hi); n.wrecks++; }
      else if (p === 'garage_column') put(hz(x2, y2, 53, seed) < 0.5 ? 'garage_column' : 'garage_column_b', x2, y2, 0.5, 0.7, 'column', hi);
      else if (p === 'garage_booth') put(p, x2, y2, 0.5, 0.8, 'booth');
      /* the guard rail on the raised bay's open edges (a low tile that is not a ramp beyond it) */
      if (hi) { var low = function (u, v) { var k = is(u, v); return k !== 'high' && k !== 'ramp' && k !== 'wall'; };
        if (low(x2, y2 - 1)) put('garage_rail_ew', x2, y2, 0.5, 0.06, 'rail', true);
        if (low(x2 - 1, y2)) put('garage_rail_ns', x2, y2, 0.02, 1.0, 'rail', true);
        if (low(x2 + 1, y2)) put('garage_rail_ns', x2, y2, 0.98, 1.0, 'rail', true);
        if (low(x2, y2 + 1)) put('garage_rail_ew', x2, y2, 0.5, 1.0, 'rail', true); }
      if (q2.light) lamp(q2.light, (x2 + 0.5) * tm, (y2 + (q2.light === 'gate' ? 1.0 : 0.4)) * tm - (hi ? up : 0));
    }
    /* the day through the open sides: a pool every few tiles along the inside of each open edge (no fixture: the day itself) */
    var side = D.data.lights.side, every = (side && side.every) || 3, os = D.data.open_sides || [];
    if (side) { for (var sx = 1; sx < W - 1; sx += every) {
      if (os.indexOf('n') >= 0 && !isWall(sx, 1)) lamp('side', (sx + 0.5) * tm, 1.0 * tm);
      if (os.indexOf('s') >= 0 && !isWall(sx, H - 2)) lamp('side', (sx + 0.5) * tm, (H - 1.0) * tm); } }
    var L = { W: W, H: H, ring: R, AW: AW, AH: AH, ground: ground, sprites: sprites, terrain: terrain, roofs: roofs, cover: cover, lights: lights, tiles: tiles,
      houses: 0, X0: 0, Y0: 0, seed: seed >>> 0, shift: [0, 0], interior: 'garage' };
    var blocks = []; for (var by = 0; by < Math.ceil(H / (G.block_tiles || 5)); by++) { var br = []; for (var bx = 0; bx < Math.ceil(W / (G.block_tiles || 5)); bx++) br.push('casino.0'); blocks.push(br); }
    return { blocks: blocks, terrain: terrain, cover: cover, lights: lights, name: T.name, kinds: ['garage', 'interior'], family: 'interior', lead: 'garage', shape: null,
      place: 'garage', own: 'garage', start: (opt && opt.start !== undefined) ? opt.start : (D.data.start || null), gallery: D.data.gallery || null, camp: null, lm: null, laid: L, roofs: roofs, interior: 'garage',
      say: D.data.say || {}, tileKey: TK, garage: { layout: lname, flip: [false, fc], cars: n.cars, wrecks: n.wrecks, ramps: n.ramps, lived: n.lived, high: n.high } };
  }

  /* the gate's reading of a board: every open tile joined; the raised bay WALKED onto only by its ramps (a step from low floor
     straight onto the bay is the fight's climb, never a walk) */
  function check(B) {
    var L = B && B.laid; if (!L) return null;
    var W = L.W, H = L.H, T = L.terrain, RF = L.roofs, solid = {};
    (B.cover || []).forEach(function (c) { if (c.blocking) solid[c.ty * W + c.tx] = 1; });
    var open = function (x, y) { return x >= 0 && y >= 0 && x < W && y < H && T[y][x] !== 'blocked' && !solid[y * W + x]; };
    var bay = function (x, y) { return !!(RF[y] && RF[y][x]); }, low = function (x, y) { return T[y][x] !== 'height'; };
    var flood = function (walkOnly, noRamps) { var seen = new Uint8Array(W * H), q = [], start = -1, total = 0;
      for (var i = 0; i < W * H; i++) if (open(i % W, Math.floor(i / W))) { total++; if (low(i % W, Math.floor(i / W))) start = i; }
      if (start >= 0) { seen[start] = 1; q.push(start); }
      while (q.length) { var cur = q.pop(), cx = cur % W, cy = (cur - cx) / W;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var u = cx + dx, v = cy + dy; if (!(dx || dy) || !open(u, v) || seen[v * W + u]) continue;
          if (dx && dy && !open(cx + dx, cy) && !open(cx, cy + dy)) continue;                         /* no squeeze between two blockers */
          if (walkOnly && bay(u, v) && low(cx, cy)) continue;                                        /* low floor straight onto the bay: a climb */
          if (noRamps && L.tiles[v][u] === 'ramp') continue;
          seen[v * W + u] = 1; q.push(v * W + u); } }
      var reached = 0, high = 0; for (var j = 0; j < W * H; j++) if (seen[j]) { reached++; if (bay(j % W, Math.floor(j / W))) high++; }
      return { total: total, reached: reached, high: high }; };
    var all = flood(false, false), walk = flood(true, false), shut = flood(true, true), highTiles = 0;
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) if (bay(x, y) && open(x, y)) highTiles++;
    return { open: all.total, reached: all.reached, high: highTiles, highReached: all.high, highWalked: walk.high, highWithoutRamps: shut.high,
      ramps: (B.garage || {}).ramps || 0, lights: (B.lights || []).length,
      day: (B.lights || []).filter(function (l) { return l.circuit === 'day'; }).length, fire: (B.lights || []).filter(function (l) { return l.circuit === 'fire'; }).length };
  }
  root.BohemiaParkingGarage = { deal: deal, check: check };
})(typeof window !== 'undefined' ? window : this);
