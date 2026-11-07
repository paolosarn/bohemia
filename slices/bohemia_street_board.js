/* ============================================================================
   THE BOARD IS THE CITY AT THAT SPOT (COMBAT TWO, 11/6/26; rule 407(g) STEP ONE; ask line 450)

   PAOLO 11/4: 'imagine if you made a combat map whose street layout was exactly like the city, the way you make the regular
   combat map, and the sizing is the same... use all the same assets, right now it's two different maps.'

   MEASURED BEFORE (main, 11/6): a fight's board was dealt from its district's template (ours.place_boards: the suburb's own
   five-tile blocks, the Strip's, downtown's...), seeded by the cell, so the board was OF the district but never the streets
   the map drew there: two different maps.

   NOW ONE MAP. The map's own painter (vbCityCore, slices/BOHEMIA_CITY_WORLD.html) is asked, once, for the ground where the
   fight is: every texel of every block there, the texel's kind and part as it paints it (its 'coli' and 'hs', a texel a
   map q of 3 m), and the house lots it stands its models on (the same lots slices/bohemia_map_houses.js draws). ONE RULER:
   a map block is BohemiaMapHouses.H.B = 36 m, a fight tile is a house, 12 m (fight_ground.json tile_metres), so a block is
   3 x 3 tiles and a tile is 4 x 4 of the painter's texels. Every fight tile takes what its 16 texels are: a street (its
   sidewalk on whichever edges the map has it, its centre line, its dead cars, its lamps), a yard, a house (the SAME model
   the map stands there: ranch_plain, _porch, _wing, _garage, _carport, by the map's own pick), a burned house, a shop's or
   a works' building, a tower, a casino's podium, the parking, the desert, the water. The ring round the board is the same
   read, further out: the map around the board IS the map.

   TWO HALVES, ONE FILE:
     plan(cell, W, H, ring)  runs in the MAP's frame (it reads the painter), returns a plain object (no functions):
                             the tiles' kinds, walks, lamps, cars, houses, blocks. The fight asks the map for it.
     lay(plan, K, G)         pure: turns a plan into a board (terrain, cover, lights, roofs) and its picture's pieces
                             (one ground piece a tile, the buildings standing on them), from the street board kit (K,
                             slices/fight_ground/street_board/street_board.json: COOK TWO's street kit, ground cut from the
                             fight's own blocks, the five ranch houses and the shops through the master rig at the fight's
                             camera; tools/bohemia_combat_two_the_street_board_kit_11_6_26.py).
   407(f): NOTHING OF THE FIGHT IS TORN DOWN; only where a board's layout comes from changes. The fight's rules, UI, props,
   lights and the camp (rule 406, CAMP THREE) read the board exactly as before.
   [bb] Battle Brothers lays its battlefield from the world tile it is fought on; ours is the very street the map drew.
   [analog horror] the board is the same street the map showed a second ago, every dead car where it was: a recording of the
   block, not a stage built for the fight.
   Gate: gates/the_board_is_the_city_at_that_spot_gate.js.
   ============================================================================ */
(function (root) {
  'use strict';
  var TILE_M = 12, QB = 12;   /* a fight tile is 12 m; the painter paints a block in 12 q */
  var CL = { lot: 0, road: 1, freeway: 2, blvd: 3, houses: 4, roof: 5, tower: 6, casino: 7, green: 8, water: 9, land: 10, mountain: 11, solar: 12, field: 13, dam: 14, rail: 15, town: 16 };
  var PT = { ground: 0, roof: 1, roofL: 2, top: 3, side: 4, line: 5, edge: 6, spot: 7, burn: 8, hole: 9, tree: 10, row: 11, neon: 12, window: 13, lampspot: 14, centre: 15 };
  var STREET = function (c) { return c === CL.road || c === CL.blvd || c === CL.freeway; };

  /* ------------------------------------------------------------------------------------------------------------------
     THE MAP'S HALF: read the painter where the fight is
     ------------------------------------------------------------------------------------------------------------------ */
  function hostReady() {
    try { return typeof om !== 'undefined' && om && om.n > 0 && typeof vbTileInput === 'function' && typeof vbCityCore === 'function'; } catch (e) { return false; }
  }
  function blockM() { try { return (root.BohemiaMapHouses && root.BohemiaMapHouses.H && root.BohemiaMapHouses.H.B) || 36; } catch (e) { return 36; } }
  function modelOf(L, j) {   /* the map's own model for this lot (bohemia_map_houses.js pick), its key 'ranch_garage_90' */
    try { if (root.BohemiaMapHouses && root.BohemiaMapHouses.pick) return root.BohemiaMapHouses.pick(L[j], L[j + 7], L[j + 8], L[j + 9]); } catch (e) {}
    var H = ['ranch_plain', 'ranch_porch', 'ranch_wing', 'ranch_garage', 'ranch_carport'];
    return L[j] === 1 ? 'trailer_0' : H[Math.floor(L[j + 8] * 997) % H.length] + '_0';
  }
  /* cell {gx, gy} (the map's block), W x H board tiles, ring tiles round it. Returns null when the map cannot say. */
  function plan(cell, W, H, ring, opt) {
    if (!hostReady() || !cell) return null;
    var t0 = (root.performance || Date).now(), B = blockM(), TPB = Math.round(B / TILE_M);
    if (TPB < 1 || TPB * TILE_M !== B || QB % TPB) return { err: 'ruler', block_m: B, tile_m: TILE_M };
    var QT = QB / TPB, gx = cell.gx != null ? cell.gx : cell.x != null ? cell.x : cell[0], gy = cell.gy != null ? cell.gy : cell.y != null ? cell.y : cell[1];
    gx = gx | 0; gy = gy | 0; ring = ring | 0; W = W | 0; H = H | 0;
    if (gx < 0 || gy < 0 || gx >= om.n || gy >= om.n) return { err: 'off the valley', cell: [gx, gy] };
    var sx = (opt && opt.shift && opt.shift[0]) | 0, sy = (opt && opt.shift && opt.shift[1]) | 0;
    var AW = W + 2 * ring, AH = H + 2 * ring;
    /* the board's middle tile is the fight's block's middle tile (a shift moves the cut, the same city) */
    var X0 = gx * TPB + (TPB >> 1) - (W >> 1) - ring + sx, Y0 = gy * TPB + (TPB >> 1) - (H >> 1) - ring + sy;
    var bx0 = Math.floor(X0 / TPB), bx1 = Math.floor((X0 + AW - 1) / TPB), by0 = Math.floor(Y0 / TPB), by1 = Math.floor((Y0 + AH - 1) / TPB);
    var cx = Math.round((bx0 + bx1) / 2), cy = Math.round((by0 + by1) / 2);
    /* the painter reads a block's neighbours to paint it, so the blocks we use stay one inside the square it is asked for */
    var M = Math.max(cx - bx0, bx1 - cx, cy - by0, by1 - cy) + 2, inp, out;
    var kT = VB_TILE, kM = VB_TILE_M;
    try { VB_TILE = 1; VB_TILE_M = M; inp = vbTileInput(cx, cy, QB); } finally { VB_TILE = kT; VB_TILE_M = kM; }
    inp.coli = true; inp.lots = true; inp.key = 'street-board:' + cx + ',' + cy + ':' + M;
    out = vbCityCore(inp);
    if (!out || !out.coli) return { err: 'painter' };
    var P = out.P, org = inp.org, n = inp.N, coli = out.coli, hs = out.hs;
    var N = AW * AH, kind = new Array(N), walk = new Uint8Array(N), axis = new Uint8Array(N), car = new Uint8Array(N), lamp = new Uint8Array(N),
        burn = new Uint8Array(N), lift = new Float32Array(N), blk = new Int32Array(N), cls = new Uint8Array(N), jers = new Uint8Array(N);
    var cnt = new Int32Array(32);
    for (var ay = 0; ay < AH; ay++) for (var ax = 0; ax < AW; ax++) {
      var i = ay * AW + ax, TX = X0 + ax, TY = Y0 + ay, bx = Math.floor(TX / TPB), by = Math.floor(TY / TPB);
      blk[i] = (by - org[1]) * n + (bx - org[0]);
      if (bx < 0 || by < 0 || bx >= om.n || by >= om.n) { kind[i] = 'edge'; continue; }
      var q0x = (TX - bx * TPB) * QT, q0y = (TY - by * TPB) * QT, u0 = (bx - org[0]) * QB + q0x, v0 = (by - org[1]) * QB + q0y;
      var wk = 0, wN = 0, wS = 0, wE = 0, wW = 0, cH = 0, cV = 0, cars = 0, lamps = 0, burns = 0, hmax = 0, tops = 0, lifted = 0, roofs = 0, lines = 0, trees = 0, rows = 0;
      for (var c = 0; c < 32; c++) cnt[c] = 0;
      for (var qy = 0; qy < QT; qy++) for (var qx = 0; qx < QT; qx++) {
        var o = (v0 + qy) * P + (u0 + qx), cv = coli[o], cl = (cv >> 4) & 31, pt = cv & 15, h = hs[o];
        cnt[cl]++; if (h > hmax) hmax = h;
        if ((cv >> 9) & 1) burns++;
        if (STREET(cl)) {
          var isWalk = cl !== CL.freeway && (pt === PT.top || pt === PT.lampspot || pt === PT.neon || pt === PT.window);
          if (isWalk) { wk++; if (qy === 0) wN++; if (qy === QT - 1) wS++; if (qx === 0) wW++; if (qx === QT - 1) wE++; }
          if (pt === PT.lampspot) lamps++;
          if (pt === PT.centre) { /* the centre line runs the long way of its texels */ if (qx > 0 && ((coli[o - 1] & 15) === PT.centre)) cH++; if (qy > 0 && ((coli[o - P] & 15) === PT.centre)) cV++; }
          if (!isWalk && h > 0.1 && h < 1.2 && (pt === PT.roof || pt === PT.roofL || pt === PT.tree || pt === PT.burn)) cars++;   /* the cars left in the lanes and at the kerb */
          if (cl === CL.freeway && pt === PT.row) jers++;
        } else {
          if (pt === PT.top) tops++;
          if (h >= 0.9) lifted++;
          if (pt === PT.roof || pt === PT.roofL || pt === PT.window) roofs++;
          if (pt === PT.line || pt === PT.edge) lines++;
          if (pt === PT.tree) trees++;
          if (pt === PT.row) rows++;
        }
      }
      var best = 0; for (var c2 = 1; c2 < 32; c2++) if (cnt[c2] > cnt[best]) best = c2;
      cls[i] = best; lift[i] = Math.round(hmax * 100) / 100; burn[i] = burns > QT * QT / 2 ? 1 : 0; lamp[i] = lamps ? 1 : 0; car[i] = cars >= 2 ? 1 : 0;
      var all = QT * QT, half = all / 2;
      if (STREET(best)) {
        walk[i] = (wN >= QT - 1 ? 1 : 0) | (wE >= QT - 1 ? 2 : 0) | (wS >= QT - 1 ? 4 : 0) | (wW >= QT - 1 ? 8 : 0);
        axis[i] = cH > cV ? 1 : cV > cH ? 2 : 0;
        kind[i] = best === CL.freeway ? 'freeway' : wk > half ? 'walk' : 'road';
        if (jers) axis[i] |= 4;
      } else if (best === CL.houses) kind[i] = burn[i] && lifted > 2 ? 'ruin' : (inp.sub && inp.sub[blk[i]] === 4 && lifted >= half) ? 'slab' : 'yard';   /* the apartments' slabs; a house's own lot is its model's (below) */
      else if (best === CL.roof) kind[i] = burn[i] && lifted > 2 ? 'ruin' : lifted >= half ? 'building' : lines >= 3 ? 'lot' : 'yard';
      else if (best === CL.town) kind[i] = lifted >= half ? 'building' : 'yard';
      else if (best === CL.tower || best === CL.casino) kind[i] = tops >= half && hmax >= 3 ? 'tower' : lifted >= half ? 'podium' : 'plaza';
      else if (best === CL.green) kind[i] = trees >= 2 ? 'park_trees' : 'park';
      else if (best === CL.water) kind[i] = 'water';
      else if (best === CL.land) kind[i] = hmax > 1.6 ? 'rough' : 'dirt';
      else if (best === CL.mountain) kind[i] = hmax > 6 ? 'cliff' : 'rough';
      else if (best === CL.rail) kind[i] = 'rail';
      else if (best === CL.solar) kind[i] = 'solar';
      else if (best === CL.field || best === CL.dam) kind[i] = 'apron';
      else kind[i] = 'lot';
    }
    /* the houses: the map's own lots (the ones it stands a model on), each on the tile its middle falls in */
    var houses = [], L = out.lots || [], taken = {};
    for (var j = 0; j + 9 < L.length; j += 10) {
      var lbx = L[j + 1], lby = L[j + 2];
      if (lbx < org[0] + 1 || lby < org[1] + 1 || lbx > org[0] + n - 2 || lby > org[1] + n - 2) continue;   /* a margin block's lot is read off its own square */
      var Xm = (lbx + L[j + 3] + L[j + 5] / 2) * B, Ym = (lby + L[j + 4] + L[j + 6] / 2) * B;   /* the lot's middle in valley metres */
      var hx = Math.floor(Xm / TILE_M) - X0, hy = Math.floor(Ym / TILE_M) - Y0;
      if (hx < 0 || hy < 0 || hx >= AW || hy >= AH) continue;
      var key = modelOf(L, j), us = key.lastIndexOf('_');
      var hi = hy * AW + hx; if (taken[hi]) continue; taken[hi] = 1;
      houses.push({ x: hx, y: hy, kind: L[j] === 1 ? 'trailer' : 'house', model: key.slice(0, us), turn: +key.slice(us + 1), key: key,
        mx: Math.round((Xm - X0 * TILE_M) * 10) / 10, my: Math.round((Ym - Y0 * TILE_M) * 10) / 10,
        w_m: Math.round(L[j + 5] * B * 10) / 10, d_m: Math.round(L[j + 6] * B * 10) / 10, roll: Math.round(L[j + 8] * 1e4) / 1e4, block: [lbx, lby] });
      kind[hi] = L[j] === 1 ? 'trailer' : 'house';
    }
    /* the blocks under the area: their district, kind, sub-kind and power, for the board's name, its buildings and its lamps */
    var blocks = {}, live = inp.live, sub = inp.sub;
    for (var by2 = by0; by2 <= by1; by2++) for (var bx2 = bx0; bx2 <= bx1; bx2++) {
      if (bx2 < 0 || by2 < 0 || bx2 >= om.n || by2 >= om.n) continue;
      var t = om.at(bx2, by2), k2 = (by2 - org[1]) * n + (bx2 - org[0]);
      blocks[k2] = { bx: bx2, by: by2, district: t && t.district || null, cls: inp.cls[k2], sub: sub ? sub[k2] : 0, live: live ? live[k2] : 0, state: inp.wst ? inp.wst[k2] : 0, jm: inp.jm ? inp.jm[k2] : 0 };
    }
    var here = om.at(gx, gy);
    return { v: 1, seed: om.seed, cell: [gx, gy], district: here && here.district || null, W: W, H: H, ring: ring, AW: AW, AH: AH, X0: X0, Y0: Y0,
      tpb: TPB, tile_m: TILE_M, block_m: B, shift: [sx, sy],
      kind: kind, walk: Array.from(walk), axis: Array.from(axis), car: Array.from(car), lamp: Array.from(lamp), burn: Array.from(burn),
      lift: Array.from(lift), cls: Array.from(cls), blk: Array.from(blk), blocks: blocks, houses: houses,
      painter: { P: P, M: M, n: n, org: org, ms: out.ms }, ms: Math.round(((root.performance || Date).now() - t0) * 10) / 10 };
  }

  /* ------------------------------------------------------------------------------------------------------------------
     THE FIGHT'S HALF: lay a plan as a board
     ------------------------------------------------------------------------------------------------------------------ */
  function hash(a, b, c) { var h = (a * 374761393 + b * 668265263 + (c | 0) * 2246822519) >>> 0; h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  /* the street piece for a tile: its walks (N 1, E 2, S 4, W 8) as the map paints them, its centre line's way */
  function streetPiece(w, ax) {
    var N = w & 1, E = w & 2, S = w & 4, Wt = w & 8;
    if (N && S && !E && !Wt) return 'road_ew_both';
    if (E && Wt && !N && !S) return 'road_ns_both';
    if (N && Wt && !S && !E) return 'corner_nw';
    if (N && E && !S && !Wt) return 'corner_ne';
    if (S && Wt && !N && !E) return 'corner_sw';
    if (S && E && !N && !Wt) return 'corner_se';
    if (N && !E && !S && !Wt) return 'road_ew_walk_n';
    if (S && !E && !N && !Wt) return 'road_ew_walk_s';
    if (Wt && !N && !S && !E) return 'road_ns_walk_w';
    if (E && !N && !S && !Wt) return 'road_ns_walk_e';
    if (w) return 'walk';
    var a = ax & 3;
    return a === 1 ? 'road_ew_median' : a === 2 ? 'road_ns' : 'junction';
  }
  var BUILDING_BY = { works: ['warehouse'], shop: ['pawn_shop', 'gas_station', 'motel'], civic: ['school', 'church', 'chapel'], town: ['motel', 'pawn_shop', 'chapel'], tower: ['casino', 'school'], casino: ['casino'] };
  /* a downtown tower is drawn by the rig's casino or school for now: the tower casino stands 34 m and its picture covers five rows of
     the board north of it (every man there behind it, THE LAYERS); a tower the fight can live beside is COOK's to make (WEAK) */
  var ONE_STOREY = ['pawn_shop', 'gas_station', 'motel', 'chapel'];
  /* K: street_board.json, G: fight_ground.json (tile_metres, tile_px, px_per_metre) */
  function lay(p, K, G) {
    if (!p || p.err || !K) return null;
    var AW = p.AW, AH = p.AH, R = p.ring, W = p.W, H = p.H, tm = G.tile_metres, TP = G.tile_px, pxm = G.px_per_metre, pym = TP[1] / tm;
    var ground = new Array(AW * AH), sprites = [], cover = [], lights = [], terrain = [], roofs = [], roof = {};
    var gsrc = function (k, x, y) { var v = K.ground[k] || K.ground.dirt; return 'street_board/' + v[Math.floor(hash(x + p.X0, y + p.Y0, 7) * v.length)].src; };
    var spc = function (k) { return K.streets.dir + K.streets.pieces[k].src; };
    var put = function (piece, x, y, ox, oy) { if (x >= R && y >= R && x < R + W && y < R + H) cover.push({ piece: piece, x_m: (x - R) * tm + (ox == null ? 2 : ox), y_m: (y - R) * tm + (oy == null ? 2 : oy), from: 'map' }); };
    var terr = {};
    /* the buildings: ONE picture of the rig a built block (a shop's, a works', a civic block, a tower, a casino, a town's, the
       apartments' slabs), where the map paints its boxes: at its own metres (0.6 to 1 of them, to fit), centred on the block's
       built tiles, its wall's foot on their south edge; only the tiles under its body are blocked (a one-storey roof is a roof
       you can get onto), the block's other built tiles its forecourt */
    var BUILT = { building: 1, tower: 1, podium: 1, slab: 1 }, byBlk = {};
    for (var i = 0; i < AW * AH; i++) if (BUILT[p.kind[i]]) (byBlk[p.blk[i]] || (byBlk[p.blk[i]] = [])).push(i);
    Object.keys(byBlk).forEach(function (bk) {
      var comp = byBlk[bk], x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
      comp.forEach(function (c) { var cx = c % AW, cy = (c / AW) | 0; x0 = Math.min(x0, cx); x1 = Math.max(x1, cx); y0 = Math.min(y0, cy); y1 = Math.max(y1, cy); });
      var b = p.blocks[bk] || {}, fam = b.cls === 6 ? 'tower' : b.cls === 7 ? 'casino' : b.cls === 16 || b.cls === 4 ? 'town' : b.sub === 1 ? 'shop' : b.sub === 2 ? 'works' : 'civic';
      var list = BUILDING_BY[fam], name = list[Math.floor(hash(b.bx | 0, b.by | 0, 11) * list.length)], m = K.buildings[name];
      var runW = (x1 - x0 + 1) * tm, runD = (y1 - y0 + 1) * tm, s = Math.min(1, Math.max(0.6, Math.min(runW / m.dims_m[0], runD / m.dims_m[1]) * 1.15));
      var bw = Math.max(1, Math.min(x1 - x0 + 1, Math.round(m.dims_m[0] * s / tm))), bd = Math.max(1, Math.min(y1 - y0 + 1, Math.round(m.dims_m[1] * s / tm)));
      var fx0 = x0 + Math.floor((x1 - x0 + 1 - bw) / 2), fy1 = y1;
      var footX = (fx0 + bw / 2) * TP[0], footY = (fy1 + 0.94) * TP[1];
      sprites.push({ src: 'street_board/' + m.src, x: footX - m.foot[0] * s, y: footY - m.foot[1] * s, w: m.w * s, h: m.h * s, line: fy1 + 0.5, kind: fam, name: name, tiles: [fx0, fy1 - bd + 1, bw, bd] });
      var under = ONE_STOREY.indexOf(name) >= 0 ? 'height' : 'blocked', gk = fam === 'tower' || fam === 'casino' ? 'plaza' : fam === 'town' ? 'dirt' : 'apron';
      comp.forEach(function (c2) { var cx2 = c2 % AW, cy2 = (c2 / AW) | 0;
        if (cx2 >= fx0 && cx2 < fx0 + bw && cy2 > fy1 - bd && cy2 <= fy1) { terr[c2] = under; if (under === 'height') roof[c2] = 1; }
        ground[c2] = fam === 'shop' ? spc('junction') : gsrc(gk, cx2, cy2); });
      /* a body wider than the built tiles stands on its neighbours too: they are under it, so they are blocked as well */
      for (var yy = fy1 - bd + 1; yy <= fy1; yy++) for (var xx = fx0; xx < fx0 + bw; xx++) { var ci = yy * AW + xx; if (xx >= 0 && yy >= 0 && xx < AW && yy < AH && !terr[ci] && p.kind[ci] !== 'road' && p.kind[ci] !== 'freeway' && p.kind[ci] !== 'walk' && p.kind[ci] !== 'house') { terr[ci] = under; if (under === 'height') roof[ci] = 1; } }
    });
    for (var y = 0; y < AH; y++) for (var x = 0; x < AW; x++) {
      var i2 = y * AW + x, kk = p.kind[i2], t = terr[i2] || 'flat';
      if (BUILT[kk] && ground[i2]) { terr[i2] = t; continue; }
      switch (kk) {
        case 'road': case 'walk': ground[i2] = spc(streetPiece(p.walk[i2], p.axis[i2])); break;
        case 'freeway': ground[i2] = spc(p.axis[i2] & 2 ? 'road_ns' : p.axis[i2] & 1 ? 'road_ew' : 'junction');
          if (p.axis[i2] & 4) put('jersey', x, y, 3, 4); break;
        case 'house': case 'trailer': case 'yard': case 'park': case 'park_trees': case 'dirt': case 'solar': ground[i2] = gsrc('dirt', x, y); break;
        case 'rough': ground[i2] = gsrc('dirt', x, y); t = 'rough'; break;
        case 'cliff': ground[i2] = gsrc('rubble', x, y); t = 'blocked'; break;
        case 'rail': ground[i2] = gsrc('rubble', x, y); t = 'rough'; break;
        case 'ruin': ground[i2] = gsrc('rubble', x, y); t = 'debris'; put('rubble_' + Math.floor(hash(x, y, 3) * 12), x, y, 3, 3); break;
        case 'water': ground[i2] = gsrc('water', x, y); t = 'water'; break;
        case 'lot': ground[i2] = spc('junction'); break;
        case 'plaza': ground[i2] = gsrc('plaza', x, y); break;
        case 'building': case 'tower': case 'podium': case 'slab': if (!ground[i2]) ground[i2] = gsrc('apron', x, y); break;
        case 'apron': ground[i2] = gsrc('apron', x, y); break;
        case 'edge': ground[i2] = gsrc('dirt', x, y); t = 'blocked'; break;
        default: if (!ground[i2]) ground[i2] = gsrc('dirt', x, y);
      }
      if (p.car[i2] && (kk === 'road' || kk === 'freeway')) put((p.walk[i2] ? 'car_kerb' : 'car_lane'), x, y, 3.5, 3.5);
      if (p.lamp[i2] && (kk === 'road' || kk === 'walk') && ((x + y + p.X0 + p.Y0) & 1) === 0 && x >= R && y >= R && x < R + W && y < R + H) {
        var b2 = p.blocks[p.blk[i2]] || {}, wm = p.walk[i2], lx = (x - R) * tm + (wm & 8 ? 1 : wm & 2 ? tm - 1 : tm / 2), ly = (y - R) * tm + (wm & 1 ? 1.6 : wm & 4 ? tm - 0.4 : tm / 2);
        lights.push({ kind: 'lamp', src: 'light_lamp_house_side.webp', x_m: lx, y_m: ly, live: !!b2.live, radius_m: 7, circuit: 'grid', from: 'map' });
      }
      terr[i2] = t;
    }
    /* the houses: the map's own model on the tile its lot's middle falls in, at the map's own fit to its lot (0.8 to 1 of
       its metres: bohemia_map_houses.js, never shrunk under 0.8), its wall's foot near the tile's south edge */
    p.houses.forEach(function (h) {
      var i3 = h.y * AW + h.x;
      if (h.kind === 'trailer') { put('trailer', h.x, h.y, 1, 2); return; }
      var m = K.houses[h.model] || K.houses.ranch_plain, mf = (m.map_foot_m && m.map_foot_m[String(h.turn)]) || [m.dims_m[0], m.dims_m[1]];
      var fit = Math.max(0.8, Math.min(1.0, Math.min(h.w_m / mf[0], h.d_m / mf[1])));   /* the map's own: bohemia_map_houses.js draw(), fit to its lot, never under 0.8 */
      var footX = (h.mx / tm) * TP[0], footY = (h.y + 0.94) * TP[1];
      sprites.push({ src: 'street_board/' + m.src, x: footX - m.foot[0] * fit, y: footY - m.foot[1] * fit, w: m.w * fit, h: m.h * fit, line: h.y + 0.5, kind: 'house', name: h.model, map_key: h.key, tiles: [h.x, h.y, 1, 1] });
      /* one roof in seven is a roof you can get onto (the map's one in seven two storeys; high ground is a roof, the third votes) */
      terr[i3] = h.roll * 13 % 1 < 1 / 7 ? 'height' : 'blocked'; if (terr[i3] === 'height') roof[i3] = 1;
    });
    sprites.sort(function (a, b) { return a.line - b.line || a.x - b.x; });
    for (var by = 0; by < H; by++) { var row = [], rr = []; for (var bx = 0; bx < W; bx++) { var ii = (by + R) * AW + bx + R; row.push(terr[ii] || 'flat'); rr.push(!!roof[ii]); } terrain.push(row); roofs.push(rr); }
    /* what stands on each board tile, for the gate and the bar */
    var tiles = []; for (var ty = 0; ty < H; ty++) { var tr = []; for (var tx = 0; tx < W; tx++) tr.push(p.kind[(ty + R) * AW + tx + R]); tiles.push(tr); }
    var houses = p.houses.filter(function (h) { return h.x >= R && h.y >= R && h.x < R + W && h.y < R + H; }).length;
    return { W: W, H: H, ring: R, AW: AW, AH: AH, ground: ground, sprites: sprites, terrain: terrain, roofs: roofs, cover: cover, lights: lights, tiles: tiles,
      houses: houses, district: p.district, cell: p.cell, X0: p.X0, Y0: p.Y0, seed: p.seed, shift: p.shift };
  }
  /* ------------------------------------------------------------------------------------------------------------------
     THE BOARD WEARS ITS DRESSING (COMBAT TWO 11/7, rule 419, ask line 479; Paolo 11/7: 'it feels like you got rid of the rest
     of the maps, we need more love and better shit'). MEASURED BEFORE (gates/the_board_is_the_city_at_that_spot_gate.js K1, 18
     spots): every laid board was poorer than the template board the same spot dealt before 11/6h on two to six of the six
     counts: the Strip 76 props to 0, the desert 39 to 0, downtown's roofs 94 to 0 to 5, the suburb's props 86 to 21 to 34.
     NOW dress(L, p, T, D) keeps the map's layout tile for tile (no street, house, lot or building moves) and puts the template's
     own dressing on it, where it fits, seeded by the spot so no two boards are the same (records/BOHEMIA_COMBAT_TWO_THE_BOARDS_
     WEAR_THEIR_DRESSING_11_7_26.md):
       1. LIFTED TILES: a template tile that carries something (a baked prop, a cover piece, rough, rubble or water, a rise, a lamp
          or a drum) is lifted WHOLE (its own picture, a source rect of its block's picture, its terrain, its cover entry, its
          light) onto a laid tile of the same ground; its own place first, elsewhere only a tile that holds its thing inside it
          (its border the place's bare ground). Never asphalt, never a building's roof or wall, never a tile a building south of
          it stands up into.
       2. THE TEMPLATE'S OWN PIECES not lifted with a tile stand on the laid streets and open ground nearest where they stood; a
          baked one with no picture of its own is the kit's nearest of its kind.
       3. ROOFS AND HIGH GROUND: houses and low buildings become roofs you can get onto, never taking the blockers under the
          template's; then the kit's masses you climb (a container, bales) or stand on (a rubble heap), against the buildings.
       4. THE FLOOR'S EFFECTS, 5. BLOCKERS: more of the template's own tiles; else the kit's rubble on rubble ground, its masses.
       6. THE KIT (dressing.json kit: the master rig's renders, every one a STAND-IN, 408(c)) by context until the board carries
          the template's props, cover and distinct pieces, then a little more love on every board; the lanes last.
       7. WHERE THE TWO SIDES START: the template's start and its camp, on the nearest open laid tile.
       8. THE GROUND: bare yards, dirt and the ground under houses take the template's own bare ground; the ring too.
     level 2 everything; 1 nothing new that blocks a step (the fight asks it when 2 cuts his line from theirs); 0 bare (last).
     407(f) stands: nothing of the fight is torn down; the boards' dressing comes back.
     ------------------------------------------------------------------------------------------------------------------ */
  var OPEN_ACCEPT = { yard: 'ground', dirt: 'ground', park: 'ground', park_trees: 'ground', rough: 'ground', solar: 'ground', plaza: 'paved', apron: 'paved' };
  var BUILT_K = { building: 1, tower: 1, podium: 1, slab: 1 }, STREET_K = { road: 1, walk: 1, freeway: 1 };
  var CAR_RX = /car|wreck|patrol|ambulance|bus/;
  function dress(L, p, T, D, opt) {
    if (!L || !T || !D || !D.lift) return L;
    var lv = opt && opt.level != null ? opt.level : 2; if (!lv) return L;
    var W = L.W, H = L.H, R = L.ring, AW = L.AW, AH = L.AH, tm = (D.tile_metres || TILE_M), bt = D.block_tiles || 5, TP = D.tile_px || [515, 364];
    var pxm = TP[0] / tm, pym = TP[1] / tm, def = D.def || function () { return null; }, KIT = D.kit || {};
    var hz = function (salt, x, y) { return hash(x + p.X0 * 7, y + p.Y0 * 13, salt); };
    var terr = L.terrain.map(function (r) { return r.slice(); }), roofs = L.roofs.map(function (r) { return r.slice(); });
    var gi = function (x, y) { return (y + R) * AW + x + R; }, kindAt = function (x, y) { return p.kind[gi(x, y)]; };
    var taken = new Uint8Array(W * H), solid = new Uint8Array(W * H), cover = L.cover.slice(), lights = L.lights.slice(), sprites = L.sprites.slice();
    var tileOfC = function (c) { return { x: c.tx != null ? c.tx : Math.floor(c.x_m / tm), y: c.ty != null ? c.ty : Math.floor(c.y_m / tm) }; };
    cover.forEach(function (c) { var t = tileOfC(c); if (t.x >= 0 && t.y >= 0 && t.x < W && t.y < H) { taken[t.y * W + t.x] = 1; var d = def(c.piece); if (d && d.blocks_move) solid[t.y * W + t.x] = 1; } });
    var isH = function (t) { return /^height/.test(t); }, out = { lifted: 0, ground: 0, moved: 0, kit: 0, mass: 0, roofs: 0 };
    /* the template, counted the way the gate counts it (props, cover tiles, blockers, roofs, effects, distinct pieces) */
    var hide = function (d) { return !!d && (d.kind === 'COVER' || d.kind === 'LOW_COVER'); };
    var count = function (Tr, C, so0) {
      var c = { props: 0, cover: 0, blockers: 0, roofs: 0, effects: 0, distinct: 0 }, cv = {}, so = {}, names = {};
      C.forEach(function (q) { var t = tileOfC(q); if (t.x < 0 || t.y < 0 || t.x >= W || t.y >= H) return; c.props++; names[q.piece] = 1; var d = def(q.piece);
        if (hide(d)) cv[t.y * W + t.x] = 1; if (d && d.blocks_move) so[t.y * W + t.x] = 1; });
      for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) { var t = Tr[y][x], k = y * W + x;
        if (t === 'blocked' || so[k]) c.blockers++; if (isH(t)) c.roofs++; if (t === 'rough' || t === 'debris' || t === 'water') c.effects++; if (cv[k]) c.cover++; }
      c.distinct = Object.keys(names).length; return c;
    };
    var want = count(T.terrain, T.cover || []), have = function () { return count(terr, cover); };
    /* the template's tiles: what each carries, its picture, its class */
    var cat = [];
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var row = T.blocks[Math.floor(y / bt)], n = row && row[Math.floor(x / bt)]; if (!n) continue;
      var base = n.split('|')[0], fl = n.split('|')[1] || '', info = D.lift[base]; if (!info || fl.indexOf('v') >= 0) continue;
      var lx = x % bt, ly = y % bt, sxT = fl.indexOf('h') >= 0 ? bt - 1 - lx : lx, idx = ly * bt + sxT, t = T.terrain[y][x];
      var south = ly + 1 < bt && y + 1 < H ? T.terrain[y + 1][x] : 'flat';
      /* a building's roof or wall is never lifted (its picture is cut through a building); nor asphalt (the map's own streets
         keep COOK TWO's kit), nor a tile a building south of it stands up into */
      var cls = info.dark[idx] >= 30 ? 'asphalt' : (isH(t) || t === 'blocked') ? (info.fam === 'nature' ? 'land' : 'built') : info.fam === 'paved' ? 'paved' : 'ground';
      if (cls !== 'built' && info.fam !== 'nature' && (isH(south) || south === 'blocked')) cls = 'overhang';
      var pcs = (T.cover || []).filter(function (c) { var q = tileOfC(c); return q.x === x && q.y === y; });
      var lts = (T.lights || []).filter(function (l) { return Math.floor(l.x_m / tm) === x && Math.floor(l.y_m / tm) === y; });
      cat.push({ x: x, y: y, src: info.src + '#' + sxT + ',' + ly + (fl.indexOf('h') >= 0 ? 'h' : ''), t: t, cls: cls, pcs: pcs, lts: lts, lum: info.lum[idx], edge: info.edge ? info.edge[idx] : info.lum[idx],
        rich: pcs.length > 0 || t !== 'flat' || lts.length > 0 });
    }
    /* the place's own bare ground: the light of its bare tiles; a tile whose border is that ground holds its thing inside it */
    var bare = cat.filter(function (s) { return !s.rich && (s.cls === 'ground' || s.cls === 'paved'); }), med = 0;
    if (bare.length) { var ls = bare.map(function (s) { return s.edge; }).sort(function (a, b) { return a - b; }); med = ls[ls.length >> 1]; }
    var inside = function (s) { return !bare.length || Math.abs(s.edge - med) <= 14; };
    var accept = function (x, y, cls) {
      if (taken[y * W + x]) return false; var k = kindAt(x, y), t = terr[y][x];
      if (cls === 'ground' || cls === 'land') return OPEN_ACCEPT[k] === 'ground' && (t === 'flat' || t === 'rough');
      if (cls === 'paved') return OPEN_ACCEPT[k] === 'paved' && t === 'flat';
      return false;
    };
    var nearest = function (x0, y0, ok, salt, rmax) {
      if (ok(x0, y0)) return { x: x0, y: y0 };
      for (var r = 1; r <= (rmax || 8); r++) { var best = null, bv = 2;
        for (var yy = y0 - r; yy <= y0 + r; yy++) for (var xx = x0 - r; xx <= x0 + r; xx++) {
          if (Math.max(Math.abs(xx - x0), Math.abs(yy - y0)) !== r || xx < 0 || yy < 0 || xx >= W || yy >= H || !ok(xx, yy)) continue;
          var v = hz(salt, xx, yy); if (v < bv) { bv = v; best = { x: xx, y: yy }; } }
        if (best) return best; }
      return null;
    };
    var blocksStep = function (t, pcs) { return t === 'blocked' || pcs.some(function (c) { var d = def(c.piece); return d && d.blocks_move; }); };
    var lift = function (s, at) {
      var k = at.y * W + at.x, dx = (at.x - s.x) * tm, dy = (at.y - s.y) * tm;
      L.ground[gi(at.x, at.y)] = s.src; terr[at.y][at.x] = s.t; roofs[at.y][at.x] = false; taken[k] = 1;
      s.pcs.forEach(function (c) { var q = { piece: c.piece, x_m: c.x_m + dx, y_m: c.y_m + dy, from: 'template' }; if (c.tx != null) { q.tx = at.x; q.ty = at.y; } cover.push(q); var d = def(c.piece); if (d && d.blocks_move) solid[k] = 1; });
      s.lts.forEach(function (l) { var q = {}; for (var kk in l) q[kk] = l[kk]; q.x_m = l.x_m + dx; q.y_m = l.y_m + dy; q.from = 'template'; delete q.block; lights.push(q); });
      out.lifted++;
    };
    /* 1. LIFTED TILES: each to its own place; elsewhere (the nearest that fits) only a tile that holds its thing inside it */
    var placed = {};
    cat.filter(function (s) { return s.rich && (s.cls === 'ground' || s.cls === 'land' || s.cls === 'paved') && (lv > 1 || !blocksStep(s.t, s.pcs)); })
      .sort(function (a, b) { return hz(3, a.x, a.y) - hz(3, b.x, b.y); })
      .forEach(function (s) { var ok = function (x, y) { return accept(x, y, s.cls); };
        var at = ok(s.x, s.y) ? { x: s.x, y: s.y } : inside(s) ? nearest(s.x, s.y, ok, 5, 6) : null; if (at) { lift(s, at); placed[s.y * W + s.x] = 1; } });
    /* 2. the template's pieces that did not come with their tile, on the laid streets and open ground nearest where they stood */
    var streetFree = function (x, y) { return !taken[y * W + x] && !!STREET_K[kindAt(x, y)] && terr[y][x] === 'flat'; };
    var openFree = function (x, y) { var k = kindAt(x, y); return !taken[y * W + x] && terr[y][x] !== 'blocked' && !isH(terr[y][x]) && terr[y][x] !== 'water' && (!!OPEN_ACCEPT[k] || k === 'lot' || (!!BUILT_K[k] && terr[y][x] === 'flat')); };
    var runOf = function (x, y, dx, dy) { var n = 0; for (var i = 1; i < 6; i++) { var a = x + dx * i, b = y + dy * i; if (a < 0 || b < 0 || a >= W || b >= H || !STREET_K[kindAt(a, b)]) break; n++; } return n; };
    var alongAt = function (x, y) { var w = p.walk[gi(x, y)], a = p.axis[gi(x, y)] & 3; if ((w & 5) && !(w & 10)) return 'ew'; if ((w & 10) && !(w & 5)) return 'ns'; if (a === 1) return 'ew'; if (a === 2) return 'ns';
      var ew = runOf(x, y, 1, 0) + runOf(x, y, -1, 0), ns = runOf(x, y, 0, 1) + runOf(x, y, 0, -1); return ew > ns ? 'ew' : ns > ew ? 'ns' : hz(9, x, y) < 0.5 ? 'ew' : 'ns'; };
    var kitFor = function (ctx, along, salt, x, y, need) {   /* a kit piece for this place, the ones not on the board yet first */
      var on = {}; cover.forEach(function (c) { on[c.piece] = 1; });
      var ks = Object.keys(KIT).filter(function (k) { var d = KIT[k]; return d.ctx.indexOf(ctx) >= 0 && !d.mass_only && (!need || need(d)) &&
        (!along || d.along === along || !KIT[k.replace(/_[SE]$/, d.along === 'ew' ? '_E' : '_S')]); });   /* a car lies along its street */
      if (!ks.length) return null; var fresh = ks.filter(function (k) { return !on[k]; }), pool = fresh.length ? fresh : ks;
      return pool[Math.floor(hz(salt, x, y) * pool.length)];
    };
    var putKit = function (key, x, y, salt) {   /* a standing piece, its foot somewhere in the south half of its tile */
      var d = KIT[key]; if (!d) return false;
      var fx = x * tm + tm / 2 + (hz(salt + 1, x, y) - 0.5) * 6, fy = y * tm + tm * (0.6 + 0.32 * hz(salt + 2, x, y));
      cover.push({ piece: key, x_m: Math.round((fx - d.foot[0] / pxm) * 100) / 100, y_m: Math.round((fy - d.foot[1] / pym) * 100) / 100, tx: x, ty: y, from: 'kit' });
      taken[y * W + x] = 1; out.kit++; return true;
    };
    var putMass = function (key, x, y, as, salt) {   /* a whole tile: a roof you climb, a rise, or a blocker, drawn as the map's houses are */
      var d = KIT[key]; if (!d) return false;
      var ax = x + R, ay = y + R, fx = (ax + 0.5 + (hz(salt, x, y) - 0.5) * 0.2) * TP[0], fy = (ay + 0.9) * TP[1];
      sprites.push({ src: d.src, x: fx - d.foot[0], y: fy - d.foot[1], w: d.w, h: d.h, line: ay + 0.5, kind: 'kit', name: key, mass: as, tiles: [ax, ay, 1, 1] });
      terr[y][x] = as === 'block' ? 'blocked' : 'height'; roofs[y][x] = as === 'roof'; taken[y * W + x] = 1; out.mass++; return true;
    };
    var ctxOf = function (x, y) {
      var k = kindAt(x, y), t = terr[y][x]; if (taken[y * W + x] || t === 'blocked' || isH(t) || t === 'water') return null;
      if (k === 'ruin') return 'ruin';
      if (k === 'walk') { for (var d2 = 0; d2 < 4; d2++) { var nx = x + [1, -1, 0, 0][d2], ny = y + [0, 0, 1, -1][d2]; if (nx >= 0 && ny >= 0 && nx < W && ny < H && (BUILT_K[kindAt(nx, ny)] || kindAt(nx, ny) === 'lot')) return 'alley'; } return 'walk'; }
      if (k === 'road' || k === 'freeway') return 'street';
      if (k === 'lot') return 'lot';
      if (BUILT_K[k]) return (p.blocks[p.blk[gi(x, y)]] || {}).sub === 2 ? 'works' : 'front';
      if (OPEN_ACCEPT[k] === 'paved') return 'plaza';
      if (OPEN_ACCEPT[k] === 'ground') { for (var d3 = 0; d3 < 4; d3++) { var mx = x + [1, -1, 0, 0][d3], my = y + [0, 0, 1, -1][d3]; if (mx >= 0 && my >= 0 && mx < W && my < H && kindAt(mx, my) === 'ruin') return 'ruin'; } return 'yard'; }
      return null;
    };
    (T.cover || []).forEach(function (c, i) {
      var t = tileOfC(c); if (t.x < 0 || t.y < 0 || t.x >= W || t.y >= H || placed[t.y * W + t.x]) return;
      var d = def(c.piece) || {}, street = /^car_|jersey/.test(c.piece) || (CAR_RX.test(c.piece) && !d.blocks_move);
      if (d.blocks_move && lv < 2) return;
      var at = nearest(t.x, t.y, street ? streetFree : openFree, 11 + i % 7, 6) || (street ? nearest(t.x, t.y, openFree, 13, 6) : null); if (!at) return;
      if (d.src) {   /* its own picture, the same place inside its tile */
        cover.push({ piece: c.piece, x_m: at.x * tm + (c.x_m - t.x * tm), y_m: at.y * tm + (c.y_m - t.y * tm), from: 'template' }); taken[at.y * W + at.x] = 1;
        if (d.blocks_move) solid[at.y * W + at.x] = 1; out.moved++; return; }
      /* a piece modelled into its block's picture: the kit's nearest of its kind */
      var ctx = ctxOf(at.x, at.y) || 'yard';
      var k = kitFor(ctx, ctx === 'street' ? alongAt(at.x, at.y) : null, 17, at.x, at.y, function (q) { return street ? CAR_RX.test(q.name.toLowerCase()) || q.ctx.indexOf('street') >= 0 : q.kind === (d.kind === 'LOW_COVER' ? 'LOW_COVER' : 'COVER'); })
        || kitFor(ctx, ctx === 'street' ? alongAt(at.x, at.y) : null, 18, at.x, at.y, null);
      if (k) { putKit(k, at.x, at.y, 19); out.moved++; }
    });
    /* the free tiles, in the spot's own order: never a street first, so the lanes stay the last to fill */
    var spots = [];
    for (var y3 = 0; y3 < H; y3++) for (var x3 = 0; x3 < W; x3++) spots.push({ x: x3, y: y3, v: hz(37, x3, y3) });
    spots.sort(function (a, b) { return a.v - b.v; });
    var MASS_CTX = { lot: 1, front: 1, works: 1, yard: 1, plaza: 1, ruin: 1 }, massN = {};
    /* a mass stands against a building (the map's own block or house), never alone in the middle of a lot when it can */
    var hugs = function (x, y) { for (var d4 = 0; d4 < 4; d4++) { var a = x + [1, -1, 0, 0][d4], b = y + [0, 0, 1, -1][d4];
      if (a >= 0 && b >= 0 && a < W && b < H && (terr[b][a] === 'blocked' || isH(terr[b][a])) && (BUILT_K[kindAt(a, b)] || kindAt(a, b) === 'house' || massAt[b * W + a])) return true; } return false; };
    var massAt = {};
    var masses = function (as, enough) {
      var order = spots.map(function (s) { return { x: s.x, y: s.y, v: s.v }; });
      for (var pass = 0; pass < 2 && !enough(); pass++) {
        order.forEach(function (s) { s.k = (hugs(s.x, s.y) ? 0 : 1) + s.v; }); order.sort(function (a, b) { return a.k - b.k; });
        for (var si = 0; si < order.length && !enough(); si++) {
          var s = order[si], cx = ctxOf(s.x, s.y); if (!cx || !MASS_CTX[cx]) continue;
          if (!pass && cx !== 'lot' && cx !== 'front' && cx !== 'works' && cx !== 'ruin') continue;   /* the lots and the built blocks' bare ground first */
          /* the kind with the fewest on the board so far (a container, the bales, a heap, a dozer; the sign twice at most) */
          var bases = {}; Object.keys(KIT).forEach(function (k) { var d = KIT[k]; if (d.mass && as.split('|').some(function (a) { return d.mass.indexOf(a) >= 0; }) &&
            !(d.mass_only && ((massN[k.replace(/_[SE]$/, '')] || 0) >= 2 || (cx !== 'front' && cx !== 'plaza')))) (bases[k.replace(/_[SE]$/, '')] = bases[k.replace(/_[SE]$/, '')] || []).push(k); });
          var bn = Object.keys(bases).sort(function (a, b) { return (massN[a] || 0) - (massN[b] || 0) || hz(71, s.x + a.length, s.y) - hz(71, s.x + b.length, s.y); })[0]; if (!bn) continue;
          var fk = bases[bn][Math.floor(hz(79, s.x, s.y) * bases[bn].length)];
          if (putMass(fk, s.x, s.y, KIT[fk].mass.indexOf('roof') >= 0 && as.indexOf('roof') >= 0 ? 'roof' : KIT[fk].mass.indexOf('rise') >= 0 && as.indexOf('rise') >= 0 ? 'rise' : 'block', 73)) { massN[bn] = (massN[bn] || 0) + 1; massAt[s.y * W + s.x] = 1; }
        }
      }
    };
    /* 3. ROOFS AND HIGH GROUND: the map's houses, then its low buildings, become roofs you can get onto, never taking the board's
       blockers under the template's; then the kit's masses you climb (a container, a stack of bales) and the rubble heaps you
       stand on, where the board is still short */
    var now = have(), extra = now.blockers - want.blockers;
    if (now.roofs < want.roofs && extra > 0) {
      var ups = [];
      for (var yy = 0; yy < H; yy++) for (var xx = 0; xx < W; xx++) if (terr[yy][xx] === 'blocked' && !solid[yy * W + xx] && (kindAt(xx, yy) === 'house' || BUILT_K[kindAt(xx, yy)]) && kindAt(xx, yy) !== 'tower') ups.push({ x: xx, y: yy, v: (kindAt(xx, yy) === 'house' ? 0 : 1) + hz(23, xx, yy) });
      ups.sort(function (a, b) { return a.v - b.v; });
      for (var u = 0; u < ups.length && now.roofs < want.roofs && extra > 0; u++) { terr[ups[u].y][ups[u].x] = 'height'; roofs[ups[u].y][ups[u].x] = true; now.roofs++; extra--; out.roofs++; }
    }
    masses('roof|rise', function () { return have().roofs >= want.roofs || out.mass > 80; });
    /* 4. THE FLOOR'S EFFECTS: more of the template's own rough, rubble and water, only tiles that hold it inside them */
    var effectsPool = cat.filter(function (s) { return (s.t === 'rough' || s.t === 'debris' || s.t === 'water') && (s.cls === 'ground' || s.cls === 'land' || s.cls === 'paved') && inside(s) && (lv > 1 || !blocksStep(s.t, s.pcs)); });
    for (var e = 0, ef = 0; e < spots.length && effectsPool.length && have().effects < want.effects; e++) {
      var s4 = effectsPool[ef % effectsPool.length]; if (!accept(spots[e].x, spots[e].y, s4.cls)) continue; lift(s4, spots[e]); ef++; }
    /* where none of the template's own fits, the kit's rubble pile on rubble ground (BB snow, slow: the map's burned houses' own) */
    for (var e2 = 0; e2 < spots.length * 2 && have().effects < want.effects; e2++) {
      var s5 = spots[e2 % spots.length], c5 = ctxOf(s5.x, s5.y); if (!c5 || (e2 < spots.length && (c5 === 'street' || c5 === 'walk'))) continue;
      var rk = KIT['sb_rubble_' + (hz(83, s5.x, s5.y) < 0.5 ? 'S' : 'E')] ? 'sb_rubble_' + (hz(83, s5.x, s5.y) < 0.5 ? 'S' : 'E') : null;
      if (rk && putKit(rk, s5.x, s5.y, 89)) terr[s5.y][s5.x] = 'debris';
    }
    /* 5. BLOCKERS: the kit's masses (a container, bales, a dead dozer, a sign), where the board is still short */
    if (lv > 1) masses('block', function () { return have().blockers >= want.blockers || out.mass > 90; });
    /* 6. THE KIT, by context, until the board carries the template's props, cover and distinct pieces, then a little more love */
    var short = function () { var c = have(); return c.props < want.props || c.cover < want.cover || c.distinct < want.distinct; };
    var love = 0, LOVE = 4 + Math.floor(hz(41, 0, 0) * 4);   /* a little more on every board, never the same count */
    for (var pass2 = 0; pass2 < 2; pass2++) for (var si2 = 0; si2 < spots.length && (short() || love < LOVE); si2++) {
      var s3 = spots[si2], cx3 = ctxOf(s3.x, s3.y); if (!cx3) continue;
      if (!pass2 && cx3 === 'street') continue;   /* the lanes last */
      if (cx3 === 'street' && !short()) continue;
      var key = kitFor(cx3, cx3 === 'street' || cx3 === 'walk' || cx3 === 'alley' ? alongAt(s3.x, s3.y) : null, 47, s3.x, s3.y, null);
      if (key && putKit(key, s3.x, s3.y, 53) && !short()) love++;
    }
    /* WHERE THE TWO SIDES START: the template's own (the line, wide, their camp, a pincer), its camp on the nearest open tile */
    var camp = null;
    if (T.camp && (T.start === 'camp' || T.start === 'pincer')) camp = nearest(Math.max(0, Math.min(W - 1, T.camp.x)), Math.max(0, Math.min(H - 1, T.camp.y)), function (x, y) { return terr[y][x] !== 'blocked' && !isH(terr[y][x]) && !solid[y * W + x]; }, 59, 8);
    /* THE GROUND: the board's bare yards and dirt (and the ground under its houses) take the template's own bare ground, so a lifted
       tile sits in its own ground; the ring round the board too, with a share of the template's dressed tiles that hold their
       thing inside them (pictures only: the ring is seen, never walked). A bare tile darker or lighter than the place's own ground
       (a wall's shadow cut at its edge) is left out */
    var plain = bare.filter(function (s) { return s.cls === 'ground' && Math.abs(s.edge - med) <= 12 && Math.abs(s.lum - med) <= 14; });
    var ringRich = cat.filter(function (s) { return s.rich && (s.cls === 'ground' || s.cls === 'land') && inside(s) && !blocksStep(s.t, s.pcs); });
    if (plain.length) for (var ay = 0; ay < AH; ay++) for (var ax = 0; ax < AW; ax++) {
      var inB = ax >= R && ay >= R && ax < R + W && ay < R + H, lk = p.kind[ay * AW + ax];
      if (OPEN_ACCEPT[lk] !== 'ground' && lk !== 'house' && lk !== 'trailer') continue;
      if (String(L.ground[ay * AW + ax]).indexOf('#') >= 0) continue;   /* a lifted tile keeps its own */
      if (inB && terr[ay - R][ax - R] !== 'flat' && lk !== 'house' && lk !== 'trailer' && !taken[(ay - R) * W + ax - R]) continue;   /* the map's rough keeps its look */
      var pool2 = !inB && hash(ax + p.X0, ay + p.Y0, 61) < 0.25 && ringRich.length ? ringRich : plain;
      L.ground[ay * AW + ax] = pool2[Math.floor(hash(ax + p.X0, ay + p.Y0, 67) * pool2.length)].src; out.ground++;
    }
    sprites.sort(function (a, b) { return a.line - b.line || a.x - b.x; });
    L.terrain = terr; L.roofs = roofs; L.cover = cover; L.lights = lights; L.sprites = sprites;
    L.start = T.start || null; L.camp = camp;
    L.dressed = { level: lv, lifted: out.lifted, moved: out.moved, kit: out.kit, mass: out.mass, roofs: out.roofs, ring: out.ground, from: T.name || null, want: want, have: have() };
    return L;
  }
  /* a ground entry 'block_yards_1.webp#3,1h' is a tile of a block's picture (column 3, row 1, mirrored): the picture is the block's */
  function picOf(g) { var i = g.indexOf('#'); return i < 0 ? g : g.slice(0, i); }
  /* every picture a laid board needs, once */
  function srcs(L) { var s = {}; L.ground.forEach(function (g) { if (g) s[picOf(g)] = 1; }); L.sprites.forEach(function (q) { s[q.src] = 1; }); return Object.keys(s); }
  root.BohemiaStreetBoard = { plan: plan, lay: lay, dress: dress, srcs: srcs, picOf: picOf, streetPiece: streetPiece, ready: hostReady, TILE_M: TILE_M };
})(typeof window !== 'undefined' ? window : this);
