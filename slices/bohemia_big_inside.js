/* ============================================================================
   A BIG INSIDE, FROM ITS DATA FILE (COMBAT THREE 11/17/26; VAMILY rules 416, 453; ask row 468's list: 'then the convention center's
   halls, the mall, a warehouse, the data fort, the terminal, the stadium, the Sphere, the dam's powerhouse')

   PAOLO 11/6: 'what are some large ass interiors that we could fight... I don't want the interiors to be human sized as the
   characters are for real, I still want this to be a block and turf war... some fights could be inside too'.
   The casino floor, the flood tunnels and the parking garage each have a module of their own. From the fourth on an inside is DATA:
   slices/fight_ground/<id>/<id>.json (its layouts, 15 strings of 20 characters a modder edits; its legend; its tiles' table, every
   kind with its cost and its effect, rule 59; its pieces; its lights; its ceiling, rule 451(a)) and this one module lays any of them.
   The list of them is slices/fight_ground/insides.json.

   THE TILE STAYS A HOUSE (rule 416(a)); the same camera, the roof cut away; cover, blockers, high ground, chokepoints; THE DARK.
     a legend entry   is: 'wall' | 'floor' | 'high' | 'ramp'; tile: the kind's name in the tiles' table (else its 'is'); piece: a
                      piece of the kit, or a list (the cell's own dice pick); at: [fx, fy] where its foot stands on the tile; more:
                      [{ piece, at }] drawn beside it; light: a kind of the data's lights; floor: which floor picture list; wall:
                      'air' for a partition inside the room (the data's walls_air)
     high ground      'high' tiles are a raised deck (terrain height, the fight's roof: a climb from below; rule 328) on the data's
                      high.deck, its rail on every open edge; a 'ramp' is the walk up (the deck east or west of it), never a roof
     the pictures     the inside's own art file (<id>_art.json, COOK FIVE's: floor lists and a kit, the garage's format) when it is
                      in; until then every piece names a finished piece it is drawn AS ('like': the garage's kit, the tunnels', the
                      casino's, the street board's dressing): a stand-in, said so on the board (inside.stand_in)
   kit(data, art, pools) -> the inside's pieces, each with its picture and its size, for the fight's piece table.
   deal(seed, D, G, W, H, opt) -> the board the fight applies (the street board's laid format), or null.
   check(B) -> the gate's reading: the floor joined, the high ground walked onto by its ramps and by nothing else, the lights.
   [bb] Battle Brothers fights only outdoors; an inside is our own swag (rule 416).
   ============================================================================ */
(function (root) {
  'use strict';
  function rngOf(s) { s = s >>> 0 || 1; return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return (s >>> 0) / 4294967296; }; }
  function hz(x, y, salt, seed) { var h = (x * 374761393 + y * 668265263 + salt * 2246822519 + (seed >>> 0)) >>> 0; h = (h ^ (h >>> 13)) * 1274126177 >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }

  /* a finished piece of another kit, as the fight's own table holds it, and its picture's size: [w, h, foot x, foot y] in pixels */
  function home(name, P) {
    var g = P.garage, t = P.tunnels, c = P.casino, d = P.dress, s;
    if (g && g.kit && g.kit[name]) { var a = g.kit[name]; if (a.foot) return { def: a, size: [a.w, a.h_px, a.foot[0], a.foot[1]] };
      s = (g.sizes || {})[a.like || name.replace(/^garage_/, '')]; if (s) return { def: a, size: [s.w, s.h, s.foot[0], s.foot[1]] }; }
    if (t && t.kit && t.kit[name]) { s = (t.sizes || {})[name.replace(/^tunnel_/, '')]; if (s) return { def: t.kit[name], size: [s.w, s.h, s.foot[0], s.foot[1]] }; }
    if (c && c.kit && c.kit[name]) { s = (c.sizes || {})[name.replace(/^casino_/, '')]; if (s) return { def: c.kit[name], size: [s.w, s.h, s.foot[0], s.foot[1]] }; }
    if (d && d[name] && d[name].foot) return { def: d[name], size: [d[name].w, d[name].h, d[name].foot[0], d[name].foot[1]] };
    return null;
  }
  function kit(data, art, P) {
    var out = {}, K = (data && data.kit) || {}, AK = (art && art.kit) || {};
    Object.keys(K).forEach(function (p) {
      var own = K[p], a = AK[p];
      if (a && a.src && a.foot) { out[p] = Object.assign({}, a, own, { src: a.src, size: [a.w, a.h_px, a.foot[0], a.foot[1]], stand_in: false }); delete out[p].like; return; }
      /* 'like' may name a piece of THIS inside (COMBAT FOUR 11/20, COOK SIX's ask: the stadium's south stand's seats drawn as the north's
         until their own picture faces the field): its finished picture if the art has it, else that piece's own stand-in */
      var mine = own.like && AK[own.like], kin = own.like && K[own.like] && K[own.like] !== own ? K[own.like] : null;
      var h = mine && mine.src && mine.foot ? { def: mine, size: [mine.w, mine.h_px, mine.foot[0], mine.foot[1]] } : own.like ? (home(own.like, P || {}) || (kin && kin.like ? home(kin.like, P || {}) : null)) : null;
      if (!h) return;   /* a piece with no picture is never laid (the gate counts them) */
      out[p] = Object.assign({}, h.def, own, { src: h.def.src, size: h.size, stand_in: true });
    });
    return out;
  }

  function deal(seed, D, G, W, H, opt) {
    if (!D || !D.data || !D.data.board || !G || !D.kit) return null;
    var X = D.data, B0 = X.board, T = B0.templates[Object.keys(B0.templates)[0]]; if (!T) return null;
    var rnd = rngOf((seed >>> 0) ^ 0x51ed270b), names = Object.keys(T.layouts);
    var lname = opt && opt.layout && T.layouts[opt.layout] ? opt.layout : names[Math.floor(rnd() * names.length)];
    var rows = T.layouts[lname]; if (!rows || rows.length !== H || rows[0].length !== W) return null;
    var fc = !!(T.flip && T.flip.cols) && rnd() < 0.5; if (opt && opt.flip) fc = !!opt.flip[1];
    var ch = function (x, y) { return x >= 0 && y >= 0 && x < W && y < H ? rows[y].charAt(fc ? W - 1 - x : x) : null; };
    var leg = function (c) { return c ? B0.legend[c] || null : null; };
    var tm = G.tile_metres, TP = G.tile_px, pxm = G.px_per_metre, pym = TP[1] / tm, R = 10, AW = W + 2 * R, AH = H + 2 * R;
    var FL = (D.art && D.art.floor) || X.floor || {}, K = D.kit, night = !!(opt && opt.night), TK = X.tiles || {}, HI = X.high || {};
    var up = (HI.h_m || 1.42) * pxm / pym;   /* a thing standing on the raised deck is drawn this far north: a height is not foreshortened, the ground is */
    var pick = function (list, x, y, salt) { return list[Math.floor(hz(x, y, salt, seed) * list.length)]; };
    var is = function (x, y) { var q = leg(ch(x, y)); return q ? q.is : 'wall'; };
    var isWall = function (x, y) { return is(x, y) === 'wall'; }, isHigh = function (x, y) { return is(x, y) === 'high'; };
    var floorOf = function (q) { var k = (q && q.floor) || (q && q.is === 'high' ? 'high' : 'floor'); return FL[k] || FL.floor || []; };
    var ground = new Array(AW * AH), terrain = [], roofs = [], tiles = [], cover = [], lights = [], n = { pieces: 0, ramps: 0, high: 0, stand_in: 0, missing: [] };
    var ring = FL.ring || FL.floor || [];
    for (var ay = 0; ay < AH; ay++) for (var ax = 0; ax < AW; ax++) ground[ay * AW + ax] = ring.length ? pick(ring, ax, ay, 3) : null;
    for (var y = 0; y < H; y++) { var tr = [], rr = [], nr = []; for (var x = 0; x < W; x++) {
      var q = leg(ch(x, y)) || { is: 'wall' }, name = q.tile || q.is, row = TK[name] || {};
      var t = row.terrain || (q.is === 'wall' ? 'blocked' : (q.is === 'high' || q.is === 'ramp') ? 'height' : 'flat');
      var fl = floorOf(q); if (fl.length) ground[(y + R) * AW + x + R] = pick(fl, x, y, 5);
      tr.push(t); rr.push(q.is === 'high'); nr.push(name); if (q.is === 'high') n.high++;
    } terrain.push(tr); roofs.push(rr); tiles.push(nr); }
    var put = function (p, x, y, fx, fy, tag, lift) {
      var d = K[p]; if (!d || !d.size) { if (n.missing.indexOf(p) < 0) n.missing.push(p); return; }
      var s = d.size, e = { piece: p, x_m: Math.round(((x + fx) * tm - s[2] / pxm) * 100) / 100, y_m: Math.round(((y + fy) * tm - s[3] / pym - (lift ? up : 0)) * 100) / 100, tx: x, ty: y, from: X.id, what: tag || null };
      if (d.blocks_move) e.blocking = true;
      if (d.stand_in) n.stand_in++;
      cover.push(e); n.pieces++;
    };
    var lamp = function (kind, lx, ly) { var Lk = (X.lights || {})[kind]; if (!Lk) return;
      lights.push({ kind: 'lamp', src: Lk.src || null, x_m: lx, y_m: ly, live: Lk.day ? !night : true, radius_m: Lk.radius_m, circuit: Lk.day ? 'day' : 'fire', inside: kind }); };
    var one = function (v, x, y, salt) { return Array.isArray(v) ? pick(v, x, y, salt) : v; };
    var WL = X.walls || {}, WA = X.walls_air || WL;
    /* north to south, so what stands nearer the camera is laid later (the raised deck under what stands on it) */
    for (var y2 = 0; y2 < H; y2++) for (var x2 = 0; x2 < W; x2++) {
      var q2 = leg(ch(x2, y2)); if (!q2) continue;
      var hi = q2.is === 'high';
      if (q2.is === 'wall') {
        var w = q2.wall === 'air' ? WA : WL, open = function (u, v) { return u >= 0 && v >= 0 && u < W && v < H && !isWall(u, v); };
        if (w.ew && open(x2, y2 - 1)) put(w.ew, x2, y2, 0.5, 0.1, 'wall');
        if (w.ew && open(x2, y2 + 1)) put(w.ew, x2, y2, 0.5, 1.0, 'wall');
        if (w.ns && open(x2 - 1, y2)) put(w.ns, x2, y2, 0.03, 1.0, 'wall');
        if (w.ns && open(x2 + 1, y2)) put(w.ns, x2, y2, 0.97, 1.0, 'wall');
        if (q2.piece) put(one(q2.piece, x2, y2, 7), x2, y2, 0.5, 0.98, q2.tile || 'wall');
        continue;
      }
      if (hi && HI.deck) put(one(HI.deck, x2, y2, 9), x2, y2, 0.5, 1.0, 'deck');
      if (q2.is === 'ramp') { var re = isHigh(x2 + 1, y2) ? HI.ramp_e : HI.ramp_w; if (re) put(re, x2, y2, 0.5, 1.0, 'ramp'); n.ramps++; }
      if (q2.piece) { var at = q2.at || [0.5, 0.8]; put(one(q2.piece, x2, y2, 11), x2, y2, at[0], at[1], q2.tile || 'piece', hi); }
      (q2.more || []).forEach(function (m, i) { if (hz(x2, y2, 60 + i, seed) < (m.share == null ? 1 : m.share)) put(one(m.piece, x2, y2, 20 + i), x2, y2, m.at[0], m.at[1], 'more', hi); });
      if (hi) { var low = function (u, v) { var k = is(u, v); return k !== 'high' && k !== 'ramp' && k !== 'wall'; };
        if (HI.rail_ew && low(x2, y2 - 1)) put(HI.rail_ew, x2, y2, 0.5, 0.06, 'rail', true);
        if (HI.rail_ns && low(x2 - 1, y2)) put(HI.rail_ns, x2, y2, 0.02, 1.0, 'rail', true);
        if (HI.rail_ns && low(x2 + 1, y2)) put(HI.rail_ns, x2, y2, 0.98, 1.0, 'rail', true);
        if (HI.rail_ew && low(x2, y2 + 1)) put(HI.rail_ew, x2, y2, 0.5, 1.0, 'rail', true); }
      if (q2.light) lamp(q2.light, (x2 + 0.5) * tm, (y2 + (q2.light_at == null ? 0.4 : q2.light_at)) * tm - (hi ? up : 0));
    }
    /* the day through the open sides: a pool every few tiles along the inside of each open edge (no fixture: the day itself) */
    var side = (X.lights || {}).side, every = (side && side.every) || 3, os = X.open_sides || [];
    if (side) { for (var sx = 1; sx < W - 1; sx += every) {
      if (os.indexOf('n') >= 0 && !isWall(sx, 1)) lamp('side', (sx + 0.5) * tm, 1.0 * tm);
      if (os.indexOf('s') >= 0 && !isWall(sx, H - 2)) lamp('side', (sx + 0.5) * tm, (H - 1.0) * tm); } }
    var L = { W: W, H: H, ring: R, AW: AW, AH: AH, ground: ground, sprites: [], terrain: terrain, roofs: roofs, cover: cover, lights: lights, tiles: tiles,
      houses: 0, X0: 0, Y0: 0, seed: seed >>> 0, shift: [0, 0], interior: X.id };
    var blocks = []; for (var by = 0; by < Math.ceil(H / (G.block_tiles || 5)); by++) { var br = []; for (var bx = 0; bx < Math.ceil(W / (G.block_tiles || 5)); bx++) br.push('casino.0'); blocks.push(br); }
    return { blocks: blocks, terrain: terrain, cover: cover, lights: lights, name: T.name || X.name, kinds: [X.id, 'interior'], family: 'interior', lead: X.id, shape: null,
      place: X.id, own: X.id, start: (opt && opt.start !== undefined) ? opt.start : (X.start || null), gallery: X.gallery || null, camp: null, lm: null, laid: L, roofs: roofs, interior: X.id,
      say: X.say || {}, tileKey: TK, inside: { id: X.id, layout: lname, flip: [false, fc], pieces: n.pieces, ramps: n.ramps, high: n.high, stand_in: n.stand_in, missing: n.missing } };
  }

  /* the gate's reading of a board: every open tile joined; the raised deck WALKED onto only by its ramps (a step from low floor
     straight onto it is the fight's climb, never a walk) */
  function check(B) {
    var L = B && B.laid; if (!L) return null;
    var W = L.W, H = L.H, T = L.terrain, RF = L.roofs, solid = {};
    (B.cover || []).forEach(function (c) { if (c.blocking) solid[c.ty * W + c.tx] = 1; });
    var open = function (x, y) { return x >= 0 && y >= 0 && x < W && y < H && T[y][x] !== 'blocked' && !solid[y * W + x]; };
    var deck = function (x, y) { return !!(RF[y] && RF[y][x]); }, low = function (x, y) { return T[y][x] !== 'height'; };
    var flood = function (walkOnly, noRamps) { var seen = new Uint8Array(W * H), q = [], start = -1, total = 0;
      for (var i = 0; i < W * H; i++) if (open(i % W, Math.floor(i / W))) { total++; if (low(i % W, Math.floor(i / W))) start = i; }
      if (start >= 0) { seen[start] = 1; q.push(start); }
      while (q.length) { var cur = q.pop(), cx = cur % W, cy = (cur - cx) / W;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var u = cx + dx, v = cy + dy; if (!(dx || dy) || !open(u, v) || seen[v * W + u]) continue;
          if (dx && dy && !open(cx + dx, cy) && !open(cx, cy + dy)) continue;
          if (walkOnly && deck(u, v) && low(cx, cy)) continue;
          if (noRamps && L.tiles[v][u] === 'ramp') continue;
          seen[v * W + u] = 1; q.push(v * W + u); } }
      var reached = 0, high = 0; for (var j = 0; j < W * H; j++) if (seen[j]) { reached++; if (deck(j % W, Math.floor(j / W))) high++; }
      return { total: total, reached: reached, high: high }; };
    var all = flood(false, false), walk = flood(true, false), shut = flood(true, true), highTiles = 0;
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) if (deck(x, y) && open(x, y)) highTiles++;
    return { open: all.total, reached: all.reached, high: highTiles, highReached: all.high, highWalked: walk.high, highWithoutRamps: shut.high,
      ramps: (B.inside || {}).ramps || 0, lights: (B.lights || []).length,
      day: (B.lights || []).filter(function (l) { return l.circuit === 'day'; }).length, fire: (B.lights || []).filter(function (l) { return l.circuit === 'fire'; }).length };
  }
  root.BohemiaBigInside = { kit: kit, deal: deal, check: check, home: home };
})(typeof window !== 'undefined' ? window : this);
