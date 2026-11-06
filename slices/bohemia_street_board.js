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
  /* every picture a laid board needs, once */
  function srcs(L) { var s = {}; L.ground.forEach(function (g) { if (g) s[g] = 1; }); L.sprites.forEach(function (q) { s[q.src] = 1; }); return Object.keys(s); }
  root.BohemiaStreetBoard = { plan: plan, lay: lay, srcs: srcs, streetPiece: streetPiece, ready: hostReady, TILE_M: TILE_M };
})(typeof window !== 'undefined' ? window : this);
