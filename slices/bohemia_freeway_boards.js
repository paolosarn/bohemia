/* ============================================================================
   THE FREEWAY FIGHT (FREEWAY 11/7/26; VAMILY rule 432, ask lines 513 and 514)

   PAOLO 11/7: 'you never made a freeway map, that would be so awesome... the freeways can get large and wide and we often
   traverse on it, and when combat starts on it, it just puts me on a suburb house... why can't it be an underpass or a
   large overpass towering over the rest of the city, you can't quite hop off it... Fallout New Vegas had this DLC called
   Lonesome Road and fighting on the freeway was so fun' (that reference is for the freeway fight only).

   MEASURED BEFORE (main 5b9f86db): a fight from a freeway cell of the map is handed district 'freeway' (or 'beltway',
   'interchange') and its cell; the fight lays the map's own block there (slices/bohemia_street_board.js plan + lay), and
   the map's freeway band is two cells (72 m, six fight tiles) inside a 20 x 15 board of 12 m tiles, so the board was the
   suburb either side of it, dressed from the suburb's template: his 'suburb house'. Measured over 24 valleys in
   gates/the_freeway_fight_gate.js leg B0.

   NOW a fight on a freeway cell is dealt a FREEWAY BOARD from four templates, real Las Vegas:
     THE DECK         the elevated freeway (I-15, US-95 on their viaducts): the party is on it, the city 10 m down past the
                      parapets on both sides, nobody can step off the edge, the road itself the only way on and off.
     THE OVERPASS     where a street crosses the freeway band (the map draws its deck there): the deck two levels over the
                      street, a ramp down at each end, men above and men below.
     THE UNDERPASS    the same crossing seen from under it: the deck's shade, the bents of columns, a camp, the street's
                      light at both ends.
     THE INTERCHANGE  the Spaghetti Bowl and the 215's stacks: flyovers climbing off the deck, the top one level three, the
                      highest ground in the valley.
   Each template is DATA (slices/fight_ground/freeway/freeway_boards.json: 15 strings of 20 characters a layout, a
   modder edits them), seeded (the spot and the fight's die pick the layout, mirror it, dress it), and placed by WHAT THE
   MAP IS at that spot (rule 429(f): a template the generator places wherever a freeway lands, any seed).
   THE RULES OF 423/428 HOLD: a level is a storey (one: defence; two and three: defence and range); a ramp climbs one level
   a tile at most; no two neighbouring tiles a man can stand on are two levels apart (THE EDGE HOLDS); a drop is never
   stood on and never blocks a shot; every road joined; every tile reachable.

   TWO HALVES, ONE FILE (pure: no DOM, no images, the same answer for the same input; node runs it in the gate):
     spot(at, cell, district)   'at(x, y)' gives the map's district at a block; returns what the fight stands on
                                ({ kind: deck|overpass|underpass|interchange, crossing, axis, ... }) or null (not freeway)
     atFromPlan(plan)           an 'at' from the street board's plan (the blocks it read round the fight)
     deal(spot, seed, D, G, W, H)  D = { boards, kit }, G = fight_ground.json; returns the board the fight applies
                                (terrain, cover, lights, roofs and a laid picture: the street board's own format)
     check(B)                   the gate's reading of a board: levels, the edge, the drops, reach, the roads
   Gate: gates/the_freeway_fight_gate.js.
   [bb] Battle Brothers cuts a tactical map from the world tile's terrain; a road tile there is still a field. Ours is the
   road itself, standing on its viaduct.
   [analog horror] the deck you crossed on the map a minute ago, ten lanes of it, every car where it died, one lamp still
   burning over the median for nobody, and the drop past the wall.
   ============================================================================ */
(function (root) {
  'use strict';
  var FW = { freeway: 1, beltway: 1, interchange: 1 };
  var ROAD = { arterial: 1, strip: 1, rail: 1 };   /* the map's RD less the freeway family (BOHEMIA_CITY_WORLD.html overpassAt) */
  function isFreeway(d) { return !!FW[String(d || '')]; }

  /* ---------------- seeded numbers (never the fight's own dice) ---------------- */
  function mix(a, b) { var h = (Math.imul(a >>> 0, 2654435761) ^ Math.imul((b >>> 0) + 0x9e3779b9, 1597334677)) >>> 0; h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13; h = Math.imul(h, 3266489917) >>> 0; return (h ^ (h >>> 16)) >>> 0; }
  function rngOf(seed) { var s = seed >>> 0 || 1; return function () { s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function strHash(s) { var h = 2166136261 >>> 0; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }

  /* ---------------- WHERE: what the map is at the fight's spot ---------------- */
  function cellXY(cell) { if (!cell) return null; var x = cell.gx != null ? cell.gx : cell.x != null ? cell.x : cell[0], y = cell.gy != null ? cell.gy : cell.y != null ? cell.y : cell[1]; return x == null || y == null ? null : [x | 0, y | 0]; }
  /* the map's own crossing test (overpassAt): a freeway cell carries a deck only where a street crosses the whole band */
  function crossingAt(at, x, y) {
    var SPAN = 12, AX = [[0, 1], [1, 0]];
    var fw = function (a, b) { return isFreeway(at(a, b)); }, rd = function (a, b) { return !!ROAD[at(a, b) || '']; };
    for (var i = 0; i < 2; i++) {
      var a = AX[i][0], b = AX[i][1], back = 1, fwd = 1;
      while (back < SPAN && fw(x - a * back, y - b * back)) back++;
      while (fwd < SPAN && fw(x + a * fwd, y + b * fwd)) fwd++;
      if (rd(x - a * back, y - b * back) && rd(x + a * fwd, y + b * fwd)) return i === 0 ? 'ns' : 'ew';   /* the street's way */
    }
    return null;
  }
  /* the band's way: the freeway runs the way its cells run on longest */
  function axisAt(at, x, y) {
    var run = function (a, b) { var n = 0; for (var k = -6; k <= 6; k++) if (isFreeway(at(x + a * k, y + b * k))) n++; return n; };
    return run(1, 0) >= run(0, 1) ? 'ew' : 'ns';
  }
  function spot(at, cell, district) {
    var c = cellXY(cell), d = String(district || (at && c ? at(c[0], c[1]) : '') || '');
    if (!isFreeway(d)) return null;
    var s = { v: 1, district: d, cell: c, kind: null, crossing: null, axis: null, read: !!(at && c) };
    if (at && c) { try { s.crossing = crossingAt(at, c[0], c[1]); s.axis = axisAt(at, c[0], c[1]); } catch (e) { s.read = false; } }
    s.kind = d === 'interchange' ? 'interchange' : s.crossing ? 'crossing' : 'deck';
    return s;
  }
  /* an 'at' from the street board's plan: the blocks it read round the board (their districts) */
  function atFromPlan(p) {
    if (!p || !p.blocks) return null;
    var m = {}; Object.keys(p.blocks).forEach(function (k) { var b = p.blocks[k]; if (b) m[b.bx + ',' + b.by] = b.district || null; });
    return function (x, y) { var v = m[x + ',' + y]; return v === undefined ? null : v; };
  }
  /* the template the spot gets: the crossing is the overpass or the underpass by the cell's own hash (the pick's weights) */
  function kindFor(s, D, seed) {
    var P = (D && D.boards && D.boards.pick) || {}, row = s.kind === 'crossing' ? P.crossing : P[s.kind] || P[s.district] || { deck: 1 };
    if (s.kind !== 'crossing' && D && D.boards && D.boards.templates[s.kind]) return s.kind;
    var ks = Object.keys(row || {}); if (!ks.length) return 'deck';
    var tot = ks.reduce(function (t, k) { return t + row[k]; }, 0), r = (mix(strHash((s.cell || []).join(',') + ':' + s.district), seed >>> 0) / 4294967296) * tot;
    for (var i = 0; i < ks.length; i++) { r -= row[ks[i]]; if (r < 0) return ks[i]; }
    return ks[0];
  }

  /* ---------------- THE BOARD: a template laid, seeded ---------------- */
  var TERR = ['flat', 'height', 'height2', 'height3'];
  var NESW = [[0, -1, 'n'], [1, 0, 'e'], [0, 1, 's'], [-1, 0, 'w']];
  /* the legend read into what each tile IS: drop / broken / deck (level) / ground (level 0) / pillar */
  function readLayout(rows, legend, deckLevel) {
    var H = rows.length, W = rows[0].length, t = [];
    for (var y = 0; y < H; y++) { var r = []; for (var x = 0; x < W; x++) {
      var ch = rows[y][x], L = legend[ch] || legend['~'];
      r.push({ ch: ch, is: L.is, level: L.is === 'deck' ? (L.level != null ? L.level : deckLevel) : 0, pic: L.pic || null, shade: !!L.shade, terrain: L.terrain || null, median: !!L.median, camp: !!L.camp,
        street: L.is === 'ground' && (!!L.street || /^(road|junction|walk)/.test(L.pic || '')) });
    } t.push(r); }
    return t;
  }
  function flipT(t, rows, cols) {
    var o = rows ? t.slice().reverse() : t.slice();
    return cols ? o.map(function (r) { return r.slice().reverse(); }) : o;
  }
  var STAND = { deck: 1, ground: 1 };
  function deal(sp, seed, D, G, W, H, opt) {
    if (!sp || !D || !D.boards || !D.kit) return null;
    var B0 = D.boards, K = D.kit, kind = opt && opt.kind && B0.templates[opt.kind] ? opt.kind : sp.kind === 'crossing' ? kindFor(sp, D, seed) : (B0.templates[sp.kind] ? sp.kind : 'deck');   /* opt.kind: a bench or a gate asks for one */
    var T = B0.templates[kind]; if (!T) return null;
    var rnd = rngOf(mix(seed >>> 0, strHash(kind + ':' + (sp.cell || []).join(','))));
    var names = Object.keys(T.layouts), lname = opt && opt.layout && T.layouts[opt.layout] ? opt.layout : names[Math.floor(rnd() * names.length)];
    var rows = T.layouts[lname]; if (!rows || rows.length !== H || rows[0].length !== W) return null;
    var fr = !!(T.flip && T.flip.rows) && rnd() < 0.5, fc = !!(T.flip && T.flip.cols) && rnd() < 0.5;
    if (opt && opt.flip) { fr = !!opt.flip[0]; fc = !!opt.flip[1]; }
    var t = flipT(readLayout(rows, B0.legend, T.deck_level | 0), fr, fc);
    var tm = G.tile_metres, TP = G.tile_px, pxm = G.px_per_metre, pym = TP[1] / tm, R = 10, AW = W + 2 * R, AH = H + 2 * R;
    var at = function (x, y) { return x >= 0 && y >= 0 && x < W && y < H ? t[y][x] : null; };
    var deckAt = function (x, y) { var q = at(x, y); return q && q.is === 'deck' ? q : null; };
    var holeAt = function (x, y) { var q = at(x, y); return !!q && (q.is === 'drop' || q.is === 'broken'); };
    var pick = function (list, h) { return list[Math.floor(h * list.length) % list.length]; };
    var hz = function (x, y, s) { return mix(mix(x + 1000, y + 2000), (seed >>> 0) + s * 7919) / 4294967296; };
    var terrain = [], roofs = [], cover = [], lights = [], sprites = [], taken = {}, ground = new Array(AW * AH);
    var key = function (x, y) { return y * W + x; };
    /* THE CITY BELOW: the map's own 36 m blocks (three tiles) far down past the wall, a street every second block each way,
       the houses on their lots in the dark, one fire somewhere on the board (ring-inclusive coordinates, so it runs on) */
    /* __THE_FREEWAY_FINISHED__ (COOK FIVE 11/10, rule 443(g), ask row 557): a template may carry a skin (which family of pictures
       its faces, its broken ends and the ground past its walls wear): the overpass stands on the street, so its drop is the
       street's own dirt and its faces stand on it; the deck and the interchange stand over the city */
    var SK = T.skin || {};
    var ox = (seed >>> 3) % 5, oy = (seed >>> 7) % 5, fireAt = -1;
    var city = function (ax, ay) {
      var g = K.tiles, C = K.city;
      if (SK.city === false) return pick(g[SK.below || 'dirt'] || g.dirt, hz(ax, ay, 15));
      if (SK.city === 'near') C = C && C.near;   /* the overpass stands on the street: the fight's own blocks round it, as they lie */
      if (C && C.subs && C.subs.length) {   /* the fight's own suburb blocks seen from the deck: a block is five tiles a side, its street runs on east and west, a cross street every few blocks */
        var gx = ax + ox, gy = ay + oy, scx = Math.floor(gx / 5), scy = Math.floor(gy / 5), cx = gx - scx * 5, cy = gy - scy * 5;
        var cross = C.cross && C.cross.length && mix(scx + 77, (seed >>> 0) ^ 0x51ed) % (C.cross_every || 3) === 0;
        return pick(cross ? C.cross : C.subs, mix(mix(scx + 1000, scy + 2000), (seed >>> 0) + 31) / 4294967296) + '#' + cx + ',' + cy;
      }
      var sx = (ax + ox) % 6 === 0, sy = (ay + oy) % 6 === 0;
      if (sx && sy) return pick(g.below_junction || g.below, 0);
      if (sx) return pick(g.below_road_ns || g.below, 0);
      if (sy) return pick(g.below_road_ew || g.below, 0);
      if (ay * AW + ax === fireAt) return pick(g.below_fire || g.below, 0);
      return hz(ax, ay, 2) < 0.6 ? pick(g.below_house || g.below, hz(ax, ay, 14)) : pick(g.below, hz(ax, ay, 15));
    };
    (function () { var c = []; for (var yy = 0; yy < H; yy++) for (var xx = 0; xx < W; xx++) { var q = t[yy][xx], n = at(xx, yy - 1); if (q.is === 'drop' && !(n && (n.is === 'deck' || n.is === 'broken')) && SK.city !== false) c.push((yy + R) * AW + xx + R); }
      if (c.length) fireAt = c[Math.floor(rnd() * c.length)]; })();
    /* the face under a deck's south edge: a bent every third tile (36 m spans), the street going under where one does, the low
       wall of a ramp, the hanging end under a broken span; hx is the tile's place along the whole picture, the ring included */
    var brokenAt = function (x, y) { var q = at(x, y); return !!q && q.is === 'broken'; };
    var facePic = function (x, y, n, hx) {
      var g = K.tiles, fam = SK.face || 'face';
      if (n.is === 'broken') { var bs = deckAt(x - 1, y - 1) ? 'w' : deckAt(x + 1, y - 1) ? 'e' : ''; if (bs && g[fam + '_brk_' + bs]) return pick(g[fam + '_brk_' + bs], hz(hx, y, 1)); }
      if (SK.face_low_level != null && n.is === 'deck' && n.level <= SK.face_low_level && g[fam + '_low']) return pick(g[fam + '_low'], hz(hx, y, 1));
      var s = at(x, y + 1); if (s && s.is === 'ground' && s.pic === 'road_ns' && g[fam + '_v']) return pick(g[fam + '_v'], hz(hx, y, 1));
      if (hx % 3 === 1 && g[fam + '_bent']) return pick(g[fam + '_bent'], hz(hx, y, 1));
      return pick(g[fam] || g.face, hz(hx, y, 1));
    };
    /* --- the ground picture of every board tile --- */
    var picOf = function (x, y, hx, hy) {
      var q = t[y][x], g = K.tiles;
      if (hx == null) { hx = x + R; hy = y + R; }
      if (q.is === 'drop') {
        var n = at(x, y - 1);
        if (n && (n.is === 'deck' || n.is === 'broken')) return facePic(x, y, n, hx);
        var sdk = deckAt(x, y + 1), dn = g[SK.drop_n || 'drop_n'];   /* north of a deck: the deck's own shadow on the ground behind it */
        if (sdk && dn) return pick(dn, hz(hx, hy, 16));
        return city(hx, hy);
      }
      if (q.is === 'broken') {   /* the torn end: which side the deck is on, and whether it is the deck's north or south edge row */
        var bfam = SK.broken || 'broken', bside = deckAt(x - 1, y) ? 'w' : deckAt(x + 1, y) ? 'e' : '';
        var bn = !(deckAt(x, y - 1) || brokenAt(x, y - 1)), bsth = !(deckAt(x, y + 1) || brokenAt(x, y + 1)), bk = bfam + '_' + bside + (bn || bsth ? '_' + (bn ? 'n' : '') + (bsth ? 's' : '') : '');
        return bside ? pick(g[bk] || g[bfam + '_' + bside] || g['broken_' + bside] || g.face, hz(hx, hy, 3)) : pick(g.face, hz(hx, hy, 1));
      }
      if (q.is === 'pillar') {   /* a bent stands on the verge beside it (the dirt, the walk), on the street only where the street is all there is */
        var pa = at(x - 1, y), pb = at(x + 1, y), isG = function (n) { return !!n && n.is === 'ground'; }, soft = function (n) { return isG(n) && !/^(road|junction)/.test(n.pic || ''); };
        var pn = soft(pa) ? pa : soft(pb) ? pb : isG(pa) ? pa : pb;
        return pick(g['shade_' + ((pn && pn.pic) || 'dirt')] || g.shade_dirt, hz(hx, hy, 4)); }
      if (q.is === 'ground') { var gp = (q.shade ? 'shade_' : '') + (q.pic || 'dirt');
        if (q.shade) { var lw = at(x - 1, y), le = at(x + 1, y), lip = lw && lw.is === 'ground' && !lw.shade ? 'w' : le && le.is === 'ground' && !le.shade ? 'e' : '';
          if (lip && g[gp + '_lip' + lip]) return pick(g[gp + '_lip' + lip], hz(hx, hy, 5)); }   /* the street's light coming in under the deck's edge */
        return pick(g[gp] || g.dirt, hz(hx, hy, 5)); }
      /* the deck: a wall on every side that faces a drop (a broken end has none: the lanes run to the tear), a slope where its east or west neighbour is a level up */
      var walls = NESW.filter(function (d) { return holeAt(x + d[0], y + d[1]) && !brokenAt(x + d[0], y + d[1]); }).map(function (d) { return d[2]; }).join('');
      var e = deckAt(x + 1, y), w = deckAt(x - 1, y), up = e && e.level > q.level ? 'e' : w && w.level > q.level ? 'w' : '';
      if (up) { var ws = walls.replace(/[ew]/g, ''); return pick(g['slope_' + up + (ws ? '_' + ws : '')] || g['slope_' + up], hz(hx, hy, 6)); }
      if (walls === 'ew' || walls === 'e' || walls === 'w') { var nsg = g['lane_ns_' + walls]; if (nsg && !deckAt(x - 1, y) && !deckAt(x + 1, y)) return pick(nsg, hz(hx, hy, 7)); }
      if (!walls && q.median) return pick(g.median, hz(hx, hy, 8));
      return pick(walls ? g['lane_' + walls] || g.lane : g.lane, hz(hx, hy, 9));
    };
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) ground[(y + R) * AW + x + R] = picOf(x, y);
    /* the ring: the board's edge runs on (the lanes on, the face on under them, the street on), each tile its own pick of the
       pictures; past a drop the city */
    for (var ay = 0; ay < AH; ay++) for (var ax = 0; ax < AW; ax++) {
      if (ax >= R && ay >= R && ax < R + W && ay < R + H) continue;
      var bx = Math.max(0, Math.min(W - 1, ax - R)), by = Math.max(0, Math.min(H - 1, ay - R)), q = t[by][bx];
      if (q.is === 'pillar') { ground[ay * AW + ax] = pick(K.tiles.shade_dirt, hz(ax, ay, 4)); continue; }
      if (q.is === 'drop') { var nq = by > 0 ? t[by - 1][bx] : null, beside = ay >= R && ay < R + H;
        var sq2 = by + 1 < H ? t[by + 1][bx] : null, dn2 = K.tiles[SK.drop_n || 'drop_n'];
        ground[ay * AW + ax] = beside && nq && (nq.is === 'deck' || nq.is === 'broken') ? facePic(bx, by, nq, ax) : beside && sq2 && sq2.is === 'deck' && dn2 ? pick(dn2, hz(ax, ay, 16)) : city(ax, ay); continue; }
      ground[ay * AW + ax] = picOf(bx, by, ax, ay);
    }
    /* the marks that are there ONCE (a burnt patch, the skid marks into the wall): one tile of the board wears each, never the ring */
    if (K.once) Object.keys(K.once).forEach(function (k) { var list = K.tiles[k] || [], c = [];
      for (var yo = 0; yo < H; yo++) for (var xo = 0; xo < W; xo++) if (list.indexOf(ground[(yo + R) * AW + xo + R]) >= 0) c.push((yo + R) * AW + xo + R);
      if (c.length) ground[c[Math.floor(hz(c.length, 7, 21) * c.length)]] = pick(K.once[k], hz(c.length, 3, 22)); });
    /* --- the terrain, the drops, the pillars --- */
    for (var y2 = 0; y2 < H; y2++) { var tr = [], rr = []; for (var x2 = 0; x2 < W; x2++) {
      var q2 = t[y2][x2], tt = 'flat';
      if (q2.is === 'deck') tt = TERR[Math.max(0, Math.min(3, q2.level))];
      else if (q2.is === 'ground') tt = q2.terrain || 'flat';
      else if (q2.is === 'pillar') tt = 'blocked';
      tr.push(tt); rr.push(false);
    } terrain.push(tr); roofs.push(rr); }
    var size = function (p) { var s = K.sizes[p]; return s || [100, 80, 50, 70]; };
    /* a piece at tile (x, y): its foot at fraction (fx, fy) of the tile */
    var put = function (p, x, y, fx, fy, why) {
      var s = size(p); cover.push({ piece: p, x_m: Math.round(((x + fx) * tm - s[2] / pxm) * 100) / 100, y_m: Math.round(((y + fy) * tm - s[3] / pym) * 100) / 100, tx: x, ty: y, from: 'freeway', why: why || null });
      taken[key(x, y)] = p; return true;
    };
    var baked = function (p, x, y) { cover.push({ piece: p, x_m: x * tm + tm / 2, y_m: y * tm + tm / 2, tx: x, ty: y, from: 'freeway' }); taken[key(x, y)] = p; };
    for (var y3 = 0; y3 < H; y3++) for (var x3 = 0; x3 < W; x3++) {
      var q3 = t[y3][x3];
      if (q3.is === 'drop') baked('fw_drop', x3, y3);
      else if (q3.is === 'broken') baked('fw_broken', x3, y3);
      else if (q3.is === 'pillar') put('fw_bent', x3, y3, 0.5, 0.8, 'a bent of the deck');
    }
    /* --- THE PARAPET: a deck tile beside the drop stands behind the wall (low cover, the wall is in the picture) --- */
    var edge = function (x, y) { return deckAt(x, y) && NESW.some(function (d) { return d[0] === 0 && holeAt(x, y + d[1]); }); };
    for (var y4 = 0; y4 < H; y4++) for (var x4 = 0; x4 < W; x4++) if (edge(x4, y4) && !taken[key(x4, y4)]) baked('fw_parapet', x4, y4);
    /* --- THE MEDIAN: Jersey barriers, gaps where the cars broke through --- */
    for (var y5 = 0; y5 < H; y5++) for (var x5 = 0; x5 < W; x5++) { var q5 = t[y5][x5]; if (q5.is === 'deck' && q5.median && !taken[key(x5, y5)] && hz(x5, y5, 11) > 0.3) put('jersey', x5, y5, 0.5, 0.62, 'median'); }
    var Dr = T.dress || {}, lineCols = { 6: 1, 7: 1, 12: 1, 13: 1 };
    var free = function (x, y, okLine) { var q = at(x, y); return !!q && STAND[q.is] && !taken[key(x, y)] && (okLine || !lineCols[x]); };
    var lanes = [], below = [], camp = [], crest = [];
    for (var y6 = 0; y6 < H; y6++) for (var x6 = 0; x6 < W; x6++) { var q6 = t[y6][x6];
      if (q6.is === 'deck' && !q6.median && !taken[key(x6, y6)]) lanes.push([x6, y6]);
      if (q6.is === 'ground' && /road|junction/.test(q6.pic || '') && !q6.shade) below.push([x6, y6]);
      if (q6.is === 'ground' && q6.shade && /road|junction/.test(q6.pic || '')) below.push([x6, y6]);
      if (q6.camp) camp.push([x6, y6]);
      if (q6.is === 'deck' && q6.level === 3) crest.push([x6, y6]); }
    var shuffle = function (a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; };
    var range = function (r) { return r ? (Array.isArray(r) ? r[0] + Math.floor(rnd() * (r[1] - r[0] + 1)) : r) : 0; };
    var mid = function (x) { return x >= 8 && x <= 11; };
    var dressed = { cars: 0, semi: 0, gantry: 0, container: 0, checkpoint: 0, camp: 0, fences: 0 };
    /* THE JACKKNIFED SEMI: its trailer across a lane in the no man's land between the lines, its cab dead beside it */
    if (Dr.semi) { var sl = shuffle(lanes.filter(function (c) { return mid(c[0]) && free(c[0], c[1]) && free(c[0] + 1, c[1]) && deckAt(c[0], c[1]).level === (T.deck_level | 0); }))[0];
      if (sl) { put('trailer', sl[0], sl[1], 0.5, 0.8, 'the jackknifed semi'); put('fw_cab', sl[0] + 1, sl[1], 0.35, 0.72, 'its cab'); dressed.semi = 1; } }
    /* THE FALLEN SIGN: a gantry down across the lanes near one end */
    for (var gi = range(Dr.gantry); gi > 0; gi--) { var gl = shuffle(lanes.filter(function (c) { return (c[0] <= 4 || c[0] >= 15) && free(c[0], c[1]); }))[0]; if (gl) { put('fw_gantry', gl[0], gl[1], 0.5, 0.74, 'the fallen sign'); dressed.gantry++; } }
    /* THE BOX OFF A TRUCK: a container fallen in the lanes, a roof you climb (one level: defence, no range, rule 428(b)) */
    for (var ci = range(Dr.container); ci > 0; ci--) {
      var cl = shuffle(lanes.filter(function (c) { return !mid(c[0]) && !lineCols[c[0]] && free(c[0], c[1]) && deckAt(c[0], c[1]).level === (T.deck_level | 0) && !edge(c[0], c[1]); }))[0];
      if (!cl) break;
      var kp = rnd() < 0.5 ? 'sb_container_S' : 'sb_container_E', ks = size(kp), ax2 = cl[0] + R, ay2 = cl[1] + R, fx2 = (ax2 + 0.5) * TP[0], fy2 = (ay2 + 0.88) * TP[1];
      sprites.push({ src: K.srcs[kp], x: fx2 - ks[2], y: fy2 - ks[3], w: ks[0], h: ks[1], line: ay2 + 0.5, kind: 'kit', name: kp, mass: 'roof', tiles: [ax2, ay2, 1, 1] });
      terrain[cl[1]][cl[0]] = TERR[Math.min(3, (T.deck_level | 0) + 1)]; roofs[cl[1]][cl[0]] = true; taken[key(cl[0], cl[1])] = 'mass'; dressed.container++;
    }
    /* THE TOLL: a checkpoint of sandbags and a barrier at one end, batteries to pass (the economy's own wall) */
    if (Dr.checkpoint && rnd() < Dr.checkpoint) { var endX = rnd() < 0.5 ? 2 : W - 3;
      lanes.filter(function (c) { return c[0] === endX && free(c[0], c[1]); }).slice(0, 3).forEach(function (c, i) { put(i % 2 ? 'sb_barrier_S' : 'sb_sandbags_S', c[0], c[1], 0.5, 0.7, 'the toll'); dressed.checkpoint++; }); }
    /* THE DEAD CARS: where they stopped, in the lanes */
    var share = Dr.cars ? Dr.cars[0] + rnd() * (Dr.cars[1] - Dr.cars[0]) : 0, CARS = ['car_lane', 'car_lane', 'sb_wreck_S', 'sb_patrol_S', 'sb_wreck_E'];
    shuffle(lanes.slice()).slice(0, Math.round(lanes.length * share)).forEach(function (c) { if (free(c[0], c[1], true)) { put(pick(CARS, rnd()), c[0], c[1], 0.3 + 0.4 * rnd(), 0.62 + 0.25 * rnd(), 'a dead car'); dressed.cars++; } });
    for (var bc = range(Dr.below_cars); bc > 0; bc--) { var bcl = shuffle(below.filter(function (c) { return free(c[0], c[1], true); }))[0]; if (bcl) { var vq = at(bcl[0], bcl[1]); put(/ns/.test(vq.pic) ? 'sb_wreck_E' : pick(['car_lane', 'sb_wreck_S'], rnd()), bcl[0], bcl[1], 0.5, 0.74, 'a dead car below'); dressed.cars++; } }
    if (kind === 'underpass') shuffle(below.slice()).slice(0, Math.round(below.length * (Dr.cars ? Dr.cars[0] : 0.06))).forEach(function (c) { if (free(c[0], c[1], true)) { put(pick(['car_lane', 'sb_wreck_S', 'sb_wreck_E'], rnd()), c[0], c[1], 0.5, 0.74, 'a dead car under the deck'); dressed.cars++; } });
    /* THE CAMP under the deck: the drums, the carts, the tyres, the tanks, the sandbags of the people who had nowhere else */
    if (camp.length) { var CAMP = ['sb_drums_S', 'sb_cart_S', 'sb_tyres_S', 'sb_propane_S', 'sb_sandbags_S', 'sb_cart_S'];
      shuffle(camp.slice()).slice(0, range(Dr.camp) || camp.length).forEach(function (c, i) { if (free(c[0], c[1], true)) { put(CAMP[i % CAMP.length], c[0], c[1], 0.5, 0.7, 'the camp'); dressed.camp++; } });
      for (var di = range(Dr.drums) || 1, dn = 0; dn < di && dn < camp.length; dn++) { var dc = camp[(dn * 3) % camp.length];
        lights.push({ kind: 'drum', src: 'light_oil_drum.webp', x_m: (dc[0] + 0.5) * tm + (dn ? 2 : -2), y_m: (dc[1] + 0.95) * tm, live: true, radius_m: 6, circuit: 'fire', from: 'freeway' }); } }
    /* THE FENCES of the lots below the overpass (see-through cover) */
    for (var fi = range(Dr.fences); fi > 0; fi--) { var fl = shuffle(below.length ? (function () { var a = []; for (var yy = 0; yy < H; yy++) for (var xx = 0; xx < W; xx++) { var qq = t[yy][xx]; if (qq.is === 'ground' && /dirt|plaza/.test(qq.pic || '') && !qq.shade && free(xx, yy)) a.push([xx, yy]); } return a; })() : [])[0];
      if (fl) { put(rnd() < 0.5 ? 'fence' : 'dumpster', fl[0], fl[1], 0.5, 0.6, 'a lot below'); dressed.fences++; } }
    /* THE CREST: the flyover's top, a barrier or two to crouch behind on the highest ground */
    shuffle(crest.filter(function (c) { return free(c[0], c[1], true); })).slice(0, range(Dr.crest_cover)).forEach(function (c) { put(rnd() < 0.5 ? 'sb_barrier_S' : 'jersey', c[0], c[1], 0.5, 0.66, 'the crest'); });
    /* THE LAMPS: freeway lights on the median (or the sidewalks below), most of them dead, one or two still burning */
    var every = Dr.lamps_every || 4, liveShare = Dr.lamps_live == null ? 0.3 : Dr.lamps_live, lampRows = [];
    for (var y7 = 0; y7 < H; y7++) { var row7 = t[y7]; if (row7.filter(function (q) { return q.median; }).length > W / 2) lampRows.push(y7); }
    var mastSrc = lampRows.length && K.lamp && K.lamp.src ? K.lamp.src : 'light_lamp_house_side.webp';   /* on the median the freeway's own mast; on a sidewalk below the street's lamp */
    if (!lampRows.length) for (var y8 = 0; y8 < H; y8++) { var walkN = t[y8].filter(function (q) { return q.is === 'ground' && q.pic === 'walk' && !q.shade; }).length; if (walkN >= 8) lampRows.push(y8); }
    lampRows.forEach(function (ly, li) { for (var lx = (li * 2 + 1) % every; lx < W; lx += every) { var lq = at(lx, ly); if (!lq || !STAND[lq.is] || lq.shade) continue;
      lights.push({ kind: 'lamp', src: mastSrc, x_m: (lx + 0.5) * tm, y_m: (ly + 0.55) * tm, live: hz(lx, ly, 13) < liveShare, radius_m: 7, circuit: 'grid', from: 'freeway' }); } });
    /* the one fire somewhere in the city below (rule 20: a thing burning and nobody at it), laid on its tile */
    if (fireAt >= 0 && K.city && K.city.fire) { var fa = fireAt % AW, fb = Math.floor(fireAt / AW), fs = K.city.fire;
      sprites.push({ src: fs.src, x: (fa + 0.5) * TP[0] - fs.w / 2, y: (fb + 0.6) * TP[1] - fs.h / 2, w: fs.w, h: fs.h, line: fb, kind: 'kit', name: 'fw_fire', tiles: [fa, fb, 1, 1] }); }
    sprites.sort(function (a, b) { return a.line - b.line || a.x - b.x; });
    /* what each tile IS, for the gate and the bar */
    var tiles = t.map(function (r) { return r.map(function (q) { return q.is === 'deck' ? 'deck' + q.level : q.is === 'ground' ? (q.street ? 'street' : q.shade ? 'under' : 'below') : q.is; }); });
    var L = { W: W, H: H, ring: R, AW: AW, AH: AH, ground: ground, sprites: sprites, terrain: terrain, roofs: roofs, cover: cover, lights: lights, tiles: tiles,
      houses: 0, district: sp.district, cell: sp.cell, X0: 0, Y0: 0, seed: seed >>> 0, shift: [0, 0] };
    var blocks = []; for (var by2 = 0; by2 < Math.ceil(H / (G.block_tiles || 5)); by2++) { var br = []; for (var bx2 = 0; bx2 < Math.ceil(W / (G.block_tiles || 5)); bx2++) br.push('freeway.0'); blocks.push(br); }
    var say = { height: 'The ramp, one level up.', height2: kind === 'overpass' ? 'The overpass, two levels up.' : 'The flyover, two levels up.', height3: 'The flyover, three levels up: the highest ground in the valley.' };
    if (dressed.container) say.height = 'On the container, one level up.';
    return { blocks: blocks, terrain: terrain, cover: cover, lights: lights, name: T.name + (sp.district === 'beltway' ? ' · THE 215' : sp.district === 'interchange' ? ' · THE BOWL' : ''), kinds: ['freeway', kind, sp.district].filter(function (k, i, a) { return a.indexOf(k) === i; }),
      family: 'freeway', lead: 'freeway', shape: null, place: sp.district, own: 'freeway', start: null, camp: null, lm: null, laid: L, roofs: roofs, say: say,
      freeway: { kind: kind, layout: lname, flip: [fr, fc], deck_level: T.deck_level | 0, spot: sp, dressed: dressed } };
  }

  /* ---------------- THE GATE'S READING (pure): what a board lets a man do ---------------- */
  function check(B, def, cols) {
    def = def || function () { return null; };
    var T = B.terrain, H = T.length, W = T[0].length, lv = function (x, y) { var t = T[y][x]; return /^height/.test(t) ? (Number(t.slice(6)) || 1) : 0; };
    var solid = []; for (var y = 0; y < H; y++) { solid.push([]); for (var x = 0; x < W; x++) solid[y].push(false); }
    var drop = []; for (var y1 = 0; y1 < H; y1++) { drop.push([]); for (var x1 = 0; x1 < W; x1++) drop[y1].push(false); }
    (B.cover || []).forEach(function (c) { var d = def(c.piece) || {}; if (d.blocks_move && c.tx != null && solid[c.ty]) solid[c.ty][c.tx] = true; if (/^fw_(drop|broken)$/.test(c.piece) && drop[c.ty]) drop[c.ty][c.tx] = true; });
    if (B.laid && B.laid.tiles) for (var y0 = 0; y0 < H; y0++) for (var x0 = 0; x0 < W; x0++) if (/^(drop|broken)$/.test(B.laid.tiles[y0][x0])) drop[y0][x0] = true;   /* what the tile IS, whatever stands on it */
    var pass = function (x, y) { return x >= 0 && y >= 0 && x < W && y < H && T[y][x] !== 'blocked' && !solid[y][x]; };
    var hops = [], dropsStood = [], DIR = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    for (var y2 = 0; y2 < H; y2++) for (var x2 = 0; x2 < W; x2++) {
      if (drop[y2][x2] && pass(x2, y2)) dropsStood.push([x2, y2]);
      if (!pass(x2, y2)) continue;
      DIR.forEach(function (d) { var a = x2 + d[0], b = y2 + d[1]; if (pass(a, b) && Math.abs(lv(a, b) - lv(x2, y2)) >= 2) hops.push([x2, y2, a, b]); });
    }
    /* reach: from his front column to theirs, and every tile a man can stand on from his line */
    cols = cols || [7, 12];
    var seen = {}, q = [], open = 0;
    for (var y3 = 0; y3 < H; y3++) if (pass(cols[0], y3)) { seen[y3 * W + cols[0]] = 1; q.push([cols[0], y3]); }
    while (q.length) { var n = q.shift(); DIR.forEach(function (d) { var a = n[0] + d[0], b = n[1] + d[1]; if (!pass(a, b) || seen[b * W + a]) return;
      if (d[0] && d[1] && !pass(n[0] + d[0], n[1]) && !pass(n[0], n[1] + d[1])) return;   /* no squeeze between two walls */
      if (Math.abs(lv(a, b) - lv(n[0], n[1])) >= 2) return; seen[b * W + a] = 1; q.push([a, b]); }); }
    var lost = [], theirs = false;
    for (var y4 = 0; y4 < H; y4++) for (var x4 = 0; x4 < W; x4++) if (pass(x4, y4)) { open++; if (!seen[y4 * W + x4]) lost.push([x4, y4]); if (x4 === cols[1] && seen[y4 * W + x4]) theirs = true; }
    /* the roads joined: every lane and street tile (and its sidewalk) reaches every other through roads */
    var road = function (x, y) { var k = B.laid && B.laid.tiles && B.laid.tiles[y] && B.laid.tiles[y][x]; if (!k) return false;
      return /^deck/.test(k) ? pass(x, y) || !!solid[y][x] : k === 'street'; };   /* a deck lane under a dead car is still the road; a street under the fallen span is still the street */
    var rs = [], rseen = {}, comps = 0;
    for (var y5 = 0; y5 < H; y5++) for (var x5 = 0; x5 < W; x5++) if (road(x5, y5)) rs.push([x5, y5]);
    rs.forEach(function (s) { if (rseen[s[1] * W + s[0]]) return; comps++; var qq = [s]; rseen[s[1] * W + s[0]] = 1;
      while (qq.length) { var m = qq.shift(); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var a = m[0] + d[0], b = m[1] + d[1]; if (a < 0 || b < 0 || a >= W || b >= H || rseen[b * W + a] || !road(a, b)) return;
        if (Math.abs(lv(a, b) - lv(m[0], m[1])) >= 2) return; rseen[b * W + a] = 1; qq.push([a, b]); }); } });
    var levels = [0, 0, 0, 0]; for (var y6 = 0; y6 < H; y6++) for (var x6 = 0; x6 < W; x6++) if (pass(x6, y6)) levels[lv(x6, y6)]++;
    return { hops: hops, dropsStood: dropsStood, lost: lost, theirs: theirs, open: open, roadTiles: rs.length, roadParts: comps, levels: levels };
  }

  root.BohemiaFreewayBoards = { isFreeway: isFreeway, spot: spot, atFromPlan: atFromPlan, kindFor: kindFor, deal: deal, check: check, crossingAt: crossingAt };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.BohemiaFreewayBoards;
})(typeof window !== 'undefined' ? window : this);
