/* BOHEMIA WEAR -- CHARACTER [the armour he wears shows] (rule 272, Paolo 10/26, LOCKED: 'the weapons and the shield show,
   but the good armour I have on me doesn't show, like a police helmet... I know it's a lot of placeholder, we're gonna have
   to cook up so much art... it's not visually shown'; records/BOHEMIA_CHARACTER_THE_ARMOUR_HE_WEARS_SHOWS_10_26_26.md).
   NOTHING HE WEARS IS INVISIBLE: his helmet and his body armour are drawn on him wherever he is drawn, from the piece he has
   on, by one player every screen shares (the crew card, the fight, the camp, the map's close end, his portrait).

   THE PIECES: slices/wear/wear.webp, one placeholder per armour CLASS and extra (records/target/bb/armour_looks.json sorts
   every armor.json row into one: the police riot helmet, the motorcycle helmet, the welder's mask, the hard hat, the police
   vest, the car door strapped on, the plated jacket...), modelled in the rig's look and turned through the eight facings
   (tools/bohemia_character_the_armour_shows.py); slices/wear/wear_face.webp the same headgear for the portrait. COOK's own
   art for a named piece replaces its class's cells over the rounds; nothing here changes.

   WHERE HE IS: every picture of a man in this game is a cell of a sheet laid where it stood ([x, y, w, h, dx, dy]); his head
   is found on the cell's own pixels, once per cell (the first row wide enough to be a head, up to its top, down to the neck),
   so a piece sits on his head in every clip, sheet and screen without a table of joints. A man lying down drops his helmet
   on the ground beside him (Battle Brothers knocks it off); his body piece is not drawn on the ground (the fall has no layer).

     BohemiaWear.load(cb)                      the index and the class map, once (cb(true|false))
     BohemiaWear.ready()                       both are in
     BohemiaWear.piece(slot, id)               {slot, id, cls, key} the piece a 'head' or 'body' row is drawn as, or null
     BohemiaWear.of(man)                       {head, body} ids from anything that wears gear (a crew man, a company row, a
                                               fight unit's headRow and bodyRow)
     BohemiaWear.know(list)                    the men a screen holds (their looks and gear), so a screen that knows only a look
                                               (the camp, the map, a face) finds what that man wears
     BohemiaWear.fallback(list)                the company a screen began from (the door's), used where nothing newer is saved
     BohemiaWear.wearOf(look)                  {head, body} of the man with that look (know()n first, the saved company, the fallback)
     BohemiaWear.on(ctx, c, ox, oy, s, f, wear, o)   over the cell c = {img, x, y, w, h, dx, dy} that was just drawn at
                                               (ox + dx*s, oy + dy*s), s device pixels a pixel, facing f (0..7, S SE E NE N NW
                                               W SW): his body piece, then his head piece. o.tint(img) the screen's night
                                               version of a sheet; o.who his id (a cell not yet read uses his last place);
                                               o.where the screen's name for the count; o.hw a head's width on that sheet (25)
     BohemiaWear.face(ctx, img, size, look, wear, redo, crop)   his headgear over his portrait (img the portrait drawn at size,
                                               crop [sx, sy, sw, sh] if it is a cell of a sheet); redo() once the face sheet lands
     BohemiaWear.anchor(img, x, y, w, h, hw)   where his head is on a cell: {cx, top, w} (or {lying}), null if none
     BohemiaWear.seen                          what each screen drew: seen[where]['head:riot_helmet'] = frames
     BohemiaWear.at[who]                       where his head was last drawn {x, y, s, where, d}, in the drawing context's units
     BohemiaWear.off                           true: nothing is drawn (a checker's plant, to prove the checker sees the loss) */
(function (root) {
  'use strict';
  var DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
  var BASE = root.BOHEMIA_WEAR_BASE || 'wear/';
  var DATA = root.BOHEMIA_WEAR_DATA || '../records/target/bb/armour_looks.json';
  var HW = 25;                                  /* his head across at the fight's 57 pixels a metre */
  var META = null, LOOKS = null, state = 0, waiters = [], IM = {}, KNOWN = {}, FALL = {}, LAST = {}, SAVED = { at: 0, by: {} };
  var seen = {}, at = {};
  function load(cb) {
    if (cb) waiters.push(cb);
    if (state) { if (state > 1) done(state === 2); return; }
    state = 1;
    var j = function (u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error(u); return r.json(); }); };
    try {
      Promise.all([j(BASE + 'wear.json'), j(DATA)]).then(function (a) { META = a[0]; LOOKS = a[1]; state = META && META.pieces && LOOKS ? 2 : 3;
        if (state === 2) { sheet(META.sheet); if (root.BOHEMIA_WEAR_FACES !== false) sheet(META.face_sheet); }   /* both sheets on their way at once */
        done(state === 2); },
        function () { state = 3; done(false); });
    } catch (e) { state = 3; done(false); }
  }
  function done(ok) { var w = waiters; waiters = []; w.forEach(function (f) { try { f(ok); } catch (e) {} }); }
  function ready() { if (!state) load(); return state === 2; }
  function sheet(file, cb) {
    var e = IM[file];
    if (!e) {
      e = IM[file] = { im: new Image(), ok: false, cbs: [] };
      e.im.onload = function () { e.ok = true; var c = e.cbs; e.cbs = []; c.forEach(function (f) { try { f(); } catch (x) {} }); };
      e.im.src = BASE + file;
    }
    if (!e.ok && cb && e.cbs.indexOf(cb) < 0 && e.cbs.length < 64) e.cbs.push(cb);
    return e.ok ? e.im : null;
  }
  function idOf(it) { return it ? (typeof it === 'string' ? it : it.id || null) : null; }
  function piece(slot, id) {
    if (!id || !ready()) return null;
    var r = LOOKS[slot] && LOOKS[slot][id]; if (!r) return null;
    var key = r['class'] + (r.feats || []).slice().sort().map(function (f) { return '+' + f; }).join('');
    if (!META.pieces[key]) key = r['class'];
    return META.pieces[key] ? { slot: slot, id: id, cls: r['class'], key: key } : null;
  }
  function of(m) {
    if (!m) return null;
    if (m.headRow !== undefined || m.bodyRow !== undefined) return { head: idOf(m.headRow), body: idOf(m.bodyRow) };   /* a fight unit */
    var g = m.gear || m;
    return { head: idOf(g.head), body: idOf(g.body) };
  }
  function know(list) {
    (list || []).forEach(function (m) { if (m && m.look && (m.gear || m.headRow !== undefined)) KNOWN[m.look] = of(m); });
  }
  function fallback(list) {   /* the company a screen started from (the door's), read only when the crew screen has saved none */
    (list || []).forEach(function (m) { if (m && m.look && m.gear && !FALL[m.look]) FALL[m.look] = of(m); });
  }
  function wearOf(look) {
    if (!look) return null;
    if (KNOWN[look]) return KNOWN[look];
    var now = Date.now();
    if (now - SAVED.at > 1000) {   /* the crew screen's saved company, read at most once a second */
      SAVED = { at: now, by: {} };
      try { (JSON.parse(localStorage.getItem('bohemia.company.v1') || '[]') || []).forEach(function (m) { if (m && m.look && m.gear) SAVED.by[m.look] = of(m); }); } catch (e) {}
    }
    return SAVED.by[look] || FALL[look] || null;
  }
  /* ---- where his head is, read off the cell's own pixels (once a cell; a few new cells a frame) ---- */
  var CACHE = typeof WeakMap === 'function' ? new WeakMap() : null, SCR = null, BUDGET = { t: 0, n: 0 };
  function find(d, w, h, hw) {
    var t = -1, b = -1, l = w, r = -1, x, y;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] >= 128) { if (t < 0) t = y; b = y; if (x < l) l = x; if (x > r) r = x; }
    if (t < 0 || b - t < 8) return null;
    var FH = b - t + 1, FW = r - l + 1;
    if (FW > FH * 1.05) return { lying: true, t: t, b: b, l: l, r: r };
    var R = {};
    function runs(y) {
      if (R[y]) return R[y];
      var out = [], x = 0, o = y * w * 4;
      while (x < w) { if (d[o + x * 4 + 3] >= 128) { var s0 = x; while (x < w && d[o + x * 4 + 3] >= 128) x++; out.push([s0, x]); } else x++; }
      return (R[y] = out);
    }
    function over(rs, c) { var best = null, bo = 0; rs.forEach(function (q) { var ov = Math.min(q[1], c[1]) - Math.max(q[0], c[0]); if (ov > bo) { bo = ov; best = q; } }); return best; }
    var y0 = -1, run = null;
    for (y = t; y < Math.min(b, t + Math.floor(0.5 * FH)) && y0 < 0; y++) {
      var rs = runs(y);
      for (var i = 0; i < rs.length; i++) if (rs[i][1] - rs[i][0] >= 0.55 * hw) { y0 = y; run = rs[i]; break; }
    }
    if (y0 < 0) return null;
    var cur = run, yt = y0;
    for (y = y0 - 1; y >= t; y--) { var up = over(runs(y), cur); if (!up) break; cur = up; yt = y; }
    cur = run; var ws = [];
    for (y = y0; y <= b && y - yt < 1.25 * hw; y++) {
      var dn = over(runs(y), cur); if (!dn) break; cur = dn; ws.push([y, dn]);
      if (dn[1] - dn[0] > 1.5 * hw) break;
    }
    var k = 0, lim = Math.max(1, Math.floor(0.8 * hw));
    for (i = 1; i < Math.min(ws.length, lim); i++) if (ws[i][1][1] - ws[i][1][0] > ws[k][1][1] - ws[k][1][0]) k = i;
    var q = ws[k][1];
    return { lying: false, cx: (q[0] + q[1]) / 2, top: yt, w: q[1] - q[0], t: t, b: b, l: l, r: r };
  }
  function anchor(img, x, y, w, h, hw) {
    if (!img || !CACHE) return null;
    var per = CACHE.get(img); if (!per) { per = {}; CACHE.set(img, per); }
    var key = x + ',' + y + ',' + w + ',' + h;
    if (per[key] !== undefined) return per[key];
    var now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (now - BUDGET.t > 16) { BUDGET.t = now; BUDGET.n = 0; }
    if (BUDGET.n >= (root.BohemiaWear.BUDGET | 0)) return undefined;   /* the rest next frame: never a stall for reading pictures */
    BUDGET.n++;
    var res = null;
    try {
      if (!SCR) SCR = document.createElement('canvas');
      if (SCR.width < w || SCR.height < h) { SCR.width = Math.max(SCR.width, w); SCR.height = Math.max(SCR.height, h); }
      var g = SCR.getContext('2d', { willReadFrequently: true });
      g.clearRect(0, 0, w, h); g.drawImage(img, x, y, w, h, 0, 0, w, h);
      res = find(g.getImageData(0, 0, w, h).data, w, h, hw || HW);
    } catch (e) { res = null; }
    per[key] = res;
    return res;
  }
  function count(where, slot, cls) { var w = seen[where || 'any'] = seen[where || 'any'] || {}; w[slot + ':' + cls] = (w[slot + ':' + cls] || 0) + 1; }
  function on(ctx, c, ox, oy, s, f, wear, o) {
    if (root.BohemiaWear.off || !wear || !c || !c.img || !ready()) return false;   /* off: a checker's plant (nothing drawn) */
    o = o || {};
    var hp = piece('head', wear.head), bp = piece('body', wear.body);
    if (!hp && !bp) return false;
    var im = sheet(META.sheet); if (!im) return false;
    var a = anchor(c.img, c.x, c.y, c.w, c.h, o.hw), who = o.who != null ? String(o.who) : null, dx = c.dx || 0, dy = c.dy || 0;
    if (a && !a.lying && who) LAST[who] = { cx: a.cx + dx, top: a.top + dy, w: a.w };
    else if ((a === undefined || a === null) && who && LAST[who]) { a = LAST[who]; dx = 0; dy = 0; }   /* this cell not read yet: where he just was */
    if (!a) return false;
    var src = o.tint ? o.tint(im) || im : im, hw = o.hw || HW, drew = false;
    var put = function (key, d, x, y, k) {
      var q = META.pieces[key] && META.pieces[key][d]; if (!q) return false;
      ctx.drawImage(src, q[0], q[1], q[2], q[3], Math.round(x + q[4] * k * s), Math.round(y + q[5] * k * s), Math.round(q[2] * k * s), Math.round(q[3] * k * s));
      return true;
    };
    if (a.lying) {   /* down: the helmet knocked off beside him, on the ground at his side */
      var kd = 1;
      if (hp && put(hp.key, 'drop', ox + (dx + a.r + 4) * s, oy + (dy + a.b + 1) * s, kd)) { count(o.where, 'head', hp.cls); drew = true; }
      return drew;
    }
    var k = Math.max(0.7, Math.min(1.35, a.w / hw)); if (k > 0.88 && k < 1.14) k = 1;   /* his own head's size; a whole pixel near the ruler */
    var ax = ox + (dx + a.cx) * s, ay = oy + (dy + a.top + Math.min(a.w, hw * 1.2) / 2) * s, d = DIRS[((f | 0) % 8 + 8) % 8];
    if (who) at[who] = { x: ax, y: ay, s: s * k, where: o.where || 'any', d: d };   /* where his head was drawn, in the context's own units */
    if (bp && put(bp.key, d, ax, ay, k)) { count(o.where, 'body', bp.cls); count(o.where, 'body', bp.cls + '@' + d); drew = true; }
    if (hp && put(hp.key, d, ax, ay, k)) { count(o.where, 'head', hp.cls); count(o.where, 'head', hp.cls + '@' + d); drew = true; }
    return drew;
  }
  /* his portrait: the widest row of his head (in its top two thirds) is his head across; its top, or its middle if the frame
     cuts his crown off */
  var FACE = typeof WeakMap === 'function' ? new WeakMap() : null;
  function faceAnchor(img, crop) {
    if (!FACE) return null;
    var per = FACE.get(img); if (!per) { per = {}; FACE.set(img, per); }
    var key = crop ? crop.join(',') : 'all';
    if (per[key] !== undefined) return per[key];
    var a = null;
    try {
      var sx = crop ? crop[0] : 0, sy = crop ? crop[1] : 0, w = crop ? crop[2] : img.naturalWidth || img.width, h = crop ? crop[3] : img.naturalHeight || img.height;
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      var g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, sx, sy, w, h, 0, 0, w, h);
      var d = g.getImageData(0, 0, w, h).data, best = null, top = -1;
      for (var y = 0; y < Math.floor(h * 0.68); y++) {
        var x0 = -1, x1 = -1;
        for (var x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] >= 128) { if (x0 < 0) x0 = x; x1 = x; }
        if (x0 < 0) continue;
        if (top < 0) top = y;
        if (!best || x1 - x0 > best[2] - best[1]) best = [y, x0, x1];
      }
      if (best) {
        var bw = best[2] - best[1] + 1, cy = top <= 1 ? best[0] : Math.min(best[0], top + bw / 2);
        a = { cx: (best[1] + best[2] + 1) / 2, cy: cy, w: bw, iw: w };
      }
    } catch (e) { a = null; }
    per[key] = a;
    return a;
  }
  /* crop: [sx, sy, sw, sh] when the portrait is a cell of a sheet (the fight's faces), drawn at size x size */
  function face(ctx, img, size, look, wear, redo, crop) {
    if (root.BohemiaWear.off) return false;
    if (!ready()) { if (redo) load(function (ok) { if (ok) redo(); }); return false; }
    wear = wear || wearOf(look);
    var hp = wear && piece('head', wear.head); if (!hp) return false;
    var fs = sheet(META.face_sheet, redo); if (!fs) return false;
    var q = META.pieces[hp.key] && META.pieces[hp.key].portrait, a = faceAnchor(img, crop); if (!q || !a) return false;
    var m = size / a.iw, k = a.w * m / (HW * 3);
    var prev = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = true;
    ctx.drawImage(fs, q[0], q[1], q[2], q[3], a.cx * m + q[4] * k, a.cy * m + q[5] * k, q[2] * k, q[3] * k);
    ctx.imageSmoothingEnabled = prev;
    count('face', 'head', hp.cls);
    return true;
  }
  root.BohemiaWear = { DIRS: DIRS, HW: HW, load: load, ready: ready, piece: piece, of: of, know: know, fallback: fallback, wearOf: wearOf, on: on, face: face,
    off: !!root.BOHEMIA_WEAR_OFF, BUDGET: 24, anchor: anchor, seen: seen, at: at, meta: function () { return META; }, looks: function () { return LOOKS; }, sheet: sheet };
  if (typeof fetch !== 'undefined') load();
})(typeof window !== 'undefined' ? window : this);
