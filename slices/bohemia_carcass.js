/* ==== __THE_KILL_GOES_IN_THE_STASH__ (WORLD 12, 11/7/26; VAMILY rule 426(e), ask line 496; it REPLACES WORLD 11's carcass of 11/6,
   which he voted NO; and rule 431(a), ask line 510: the map's vultures are off the map, every one) ====
   PAOLO 11/6, on the old build: 'Maybe you're not really making it like simplified bro you're adding information you're making some
   bullshit for some car shit like I just wanna easy. Quick interaction shit... Maybe they do end up in our storage... I said something
   about like a shopping cart to pick up the bodies, but like that was an example and you just really ran with him.'
   His first words, 11/4 (rule 392): 'their corpse has so much meat that could feed people... this could help you get some extra
   batteries'. And 11/7 (rule 431): 'there's too many vultures on screen on the map. They don't even look like vultures... this shit
   is nonstop... I thought they would be like an enemy type'; his answer B, then 'just another animal we can fight'.
   NOW, AND NOTHING ELSE (draft:true, his to change):
   - a won fight with beasts in it leaves the kill on the map beside where the fight was: the animal's own fight picture on its side,
     no plate, no words, no clock;
   - ONE TAP on it puts what it gives in our storage: its MEAT in the company's FOOD (the supplies the top bar counts: two nights a
     man, what the company eats before it turns; the night's food bill is that much smaller, and any stall buys food), and its HIDE
     in the STASH as a roll of ECONOMY's own trade good HIDES (rule 425(b): every stall buys it at the town's price, the map marks
     where it sells best). Beside it: taken at once. Off from it: the crew walks there and takes it when it arrives, still one tap.
     The food and hides icons rise off the kill into the air, so he sees it went somewhere (under the map's cap,
     slices/bohemia_map_ambient.js 'kill_rise'); a stash with no room takes the meat and leaves the hide on the kill with one line;
     a kill nobody takes is gone after two game days, quietly.
   - NO VULTURES (rule 431(a)(f)): nothing circles a kill, nothing follows him. The vulture is a beast he meets and fights, never a
     sign on the map; the cap's table holds 'vulture' at nought.
   STRIPPED FROM THE OLD BUILD (WORLD 11, none of it asked for): the shopping cart and its slower walk, the plate with the kilos and the
   FRESH / TURNING / GONE clock, the three ways (HAUL IT and its hours of knives, TELL a town and its carts, LEAVE IT and the den that
   started the next hunt), EAT IT, the butcher and the stew, the clean-kill share, the feed posts, the men's dead stains, and every
   vulture (over a kill, over a boss's yard, following a company that kills, the wing's shadow across the glass, the bird that does
   not fly). The kill's picture is the animal's own fight sheet (BohemiaJobKinds.beastPic), laid on its side.
   Numbers: records/target/bb/carcass.json (the mods law). Hooks in BOHEMIA_CITY_WORLD.html (__THE_CARCASS__): the draw, the tap, the
   clock (advance: two days and it is gone), a walk's end (loopArrived: the walk to a kill takes it); the fight's bodies come home in
   the outcome (one marked line in the shell's nfOverIn). Gate: gates/the_kill_goes_in_the_stash_gate.js. ==== */
(function (root) {
  'use strict';
  if (typeof document === 'undefined' || !root.addEventListener) { root.BohemiaCarcass = { node: true }; return; }
  var KEY = 'bohemia.carcass.v2', BAG = 'bohemia.bag.v1', DATA = null, S = null, HITS = [], LAST = { drew: {}, born: [], taken: [], full: 0 }, FLY = [];
  try { localStorage.removeItem('bohemia.carcass.v1'); } catch (e) {}   /* the old build's carts and clocks: nothing reads them now */
  fetch('../records/target/bb/carcass.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (j) { DATA = j; try { render(); } catch (e) {} }).catch(function () {});
  function V(path, dflt) { var o = DATA; String(path).split('.').forEach(function (k) { o = o == null ? undefined : o[k]; }); if (o && typeof o === 'object' && 'value' in o && !Array.isArray(o)) o = o.value; return o == null ? dflt : o; }
  function cheb(ax, ay, bx, by) { return Math.max(Math.abs(ax - bx), Math.abs(ay - by)); }
  function now() { try { return (T.day | 0) * 1440 + (T.min | 0); } catch (e) { return 0; } }
  function worldSeed() { try { return typeof seed !== 'undefined' ? seed : null; } catch (e) { return null; } }
  function fresh() { return { v: 2, seed: worldSeed(), n: 0, list: [] }; }
  function st() {
    if (!S) { try { S = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { S = null; } }
    if (!S || S.v !== 2) S = fresh();
    var ws = worldSeed(); if (ws != null && S.seed != null && S.seed !== ws) S = fresh();   /* a different valley: its kills are not here */
    if (S.seed == null) S.seed = ws;
    if (!Array.isArray(S.list)) S.list = [];
    return S;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  /* ---------- what it is, and what it gives ---------- */
  function kindRow(id) { var K = (DATA && DATA.kinds) || {}; return K[id] || K['default'] || { faction: 'beasts', label: 'BEAST', kg: 60 }; }
  function idOfFaction(f) { var B = (DATA && DATA.by_faction) || {}; return f && f !== '_about' ? B[f] || null : null; }
  function kindId(k) { return (DATA && DATA.kinds && DATA.kinds[k] && k !== '_about') ? k : (idOfFaction(k) || 'default'); }
  /* WHAT A KILL GIVES (draft:true): its MEAT goes in the company's food (the supplies the top bar counts, the wagon's food: a man's
     night a half kilo, as much as the company eats before it turns, two nights a man), and its HIDE is ECONOMY's own trade good,
     HIDES ('hides off the escaped lab beasts, rolled', records/target/bb/stall_prices.json trade): one roll a kill, in the stash, made
     by ECONOMY's own tradeItem so every stall buys it at the town's price and the map marks where it sells best (rule 425(b)) */
  function goodsOf(by) {
    var kg = 0; Object.keys(by || {}).forEach(function (id) { kg += (kindRow(id).kg || 60) * Math.max(1, by[id] | 0); });
    return [{ what: 'meat', kg: Math.round(kg * V('meat_share', 0.45)) }, { what: 'hide', good: V('hide.good', 'hides'), n: Math.max(1, V('hide.rolls_a_kill', 1) | 0) }];
  }
  var STALLP = null, PIC = {};
  fetch('../records/target/bb/stall_prices.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (j) { STALLP = j; }).catch(function () {});
  function pic(src) { if (!src) return null; if (!PIC[src]) { var im = new Image(); im.src = src; PIC[src] = im; } return PIC[src]; }
  pic('market_icons/s_food.png'); pic('market_icons/g_hides.png');
  function hideItem(good) { try { if (STALLP && root.BohemiaStallPrices && BohemiaStallPrices.tradeItem) { var it = BohemiaStallPrices.tradeItem(STALLP, good, { place: null, day: (typeof loopDay === 'function' ? loopDay() : null) }); if (it) { it.from = 'a kill'; return it; } } } catch (e) {} return null; }
  function crewN() { try { return Math.max(1, crewCount() | 0); } catch (e) { return 3; } }
  function foodOf(g) { return Math.max(0, Math.min(crewN() * V('meat.nights_a_man', 2), Math.floor((g.kg || 0) / V('meat.kg_a_night', 0.5)))); }
  function bagGet() { try { var b = JSON.parse(localStorage.getItem(BAG) || '[]'); return Array.isArray(b) ? b : []; } catch (e) { return []; } }
  function bagPut(b) { try { localStorage.setItem(BAG, JSON.stringify(b)); } catch (e) {} }
  function bagRoom() { var cap = 36; try { if (root.BohemiaCamp && BohemiaCamp.stashSlots) cap = BohemiaCamp.stashSlots() | 0 || 36; } catch (e) {} return Math.max(0, cap - bagGet().length); }
  function spotNear(x, y, salt) {   /* the block beside where the fight was, never under his feet: the board is a piece of the city round that spot */
    var D = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]], k = Math.abs(salt | 0) % 8;
    for (var i = 0; i < 8; i++) { var q = D[(i + k) % 8], nx = x + q[0], ny = y + q[1]; try { if (cityWalkable(nx, ny) && !(townGround && townGround(nx, ny))) return [nx, ny]; } catch (e) {} }
    return [x, y];
  }

  /* ---------- 1. A FIGHT WON: the beasts that died lie where they fell ---------- */
  function fightHome(d) {
    var o = (d && d.outcome) || {};
    if (o.withdrew || o.arena || o.retreated || !(o.victory || o.result === 'win')) return null;   /* he ran, he lost, or the pit: no kill */
    var at = d.at && d.at.gx != null ? [d.at.gx | 0, d.at.gy | 0] : null; if (!at) { try { at = [city.x | 0, city.y | 0]; } catch (e) { return null; } }
    var s = st(), handed = null; try { handed = root.__HANDED || null; } catch (e) {}
    var bodies = Array.isArray(o.bodies) ? o.bodies : null, by = {}, n = 0;
    if (bodies) bodies.forEach(function (b) { if (b && b.beast) { var id = kindId(b.kind); by[id] = (by[id] | 0) + 1; n++; } });
    else if ((o.dead | 0) > 0) { var f = handed && handed.party && handed.party.faction, id0 = idOfFaction(f); if (id0) { by[id0] = o.dead | 0; n = o.dead | 0; } }
    if (!n) return null;
    var top = Object.keys(by).sort(function (a, b) { return kindRow(b).kg * by[b] - kindRow(a).kg * by[a]; })[0];
    var spot = spotNear(at[0], at[1], ++s.n);
    var c = { id: 'k' + s.n, at: spot, kind: top, faction: kindRow(top).faction, n: n, by: by, goods: goodsOf(by), born: now(), age: 0, want: false };
    s.list.push(c); if (s.list.length > 12) s.list.splice(0, s.list.length - 12);
    LAST.born.push({ id: c.id, n: n, by: by, at: spot.slice(), bodies: !!bodies }); if (LAST.born.length > 12) LAST.born.shift();
    save(); try { render(); } catch (e) {}
    return c;
  }
  root.addEventListener('message', function (ev) { var d = ev && ev.data; if (!d || d.type !== 'BOHEMIA_CITY_COMBAT_END') return; try { if (DATA) fightHome(d); else setTimeout(function () { try { fightHome(d); } catch (e) {} }, 1500); } catch (e) { root.__CARCASS_ERR = String(e && e.message || e); } });

  /* ---------- 2. THE CLOCK: a kill nobody takes is gone after two game days, with no clock shown ---------- */
  function tick(mins) {
    if (!DATA || !(mins > 0)) return;
    var s = st(), keep = V('keep_h', 48) * 60, n0 = s.list.length;
    s.list.forEach(function (c) { c.age += mins; });
    s.list = s.list.filter(function (c) { return c.age < keep && c.goods && c.goods.length; });
    if (s.list.length !== n0) { save(); try { render(); } catch (e) {} }
  }

  /* ---------- 3. ONE TAP: into the stash ---------- */
  function byId(id) { var c = null; st().list.forEach(function (q) { if (q.id === id) c = q; }); return c; }
  function near(c) { try { return cheb(city.x, city.y, c.at[0], c.at[1]) <= V('stash.reach_blocks', 1); } catch (e) { return false; } }
  function take(id) {
    var s = st(), c = byId(id); if (!c || !c.goods || !c.goods.length) return false;
    var icons = [], food = 0, rolls = 0, full = false, keep = [];
    c.goods.forEach(function (g) {
      if (g.what === 'meat') {   /* into the company's food: no room needed */
        food = foodOf(g);
        if (food > 0) { try { var w = wagonGet() || { food: 0 }; w.food = (w.food | 0) + food; wagonPut(w); } catch (e) {} icons.push(pic('market_icons/s_food.png')); }
        return; }
      if (g.what === 'hide') {   /* into the stash: a slot a roll */
        var b = bagGet(), room = bagRoom(), it = null;
        while (g.n > 0 && room > 0 && (it = hideItem(g.good))) { b.push(it); g.n--; room--; rolls++; }
        if (rolls) { bagPut(b); icons.push(pic((it && it.icon) || 'market_icons/g_hides.png')); }
        if (g.n > 0) { keep.push(g); if (room <= 0) full = true; }
        return; }
    });
    c.goods = keep; c.want = false;
    if (!c.goods.length) s.list = s.list.filter(function (q) { return q !== c; });
    save();
    if (full) { LAST.full++; try { travelSay('Your stash is full.'); } catch (e) {} }   /* draft:true: the one line, only when the hide could not go in */
    LAST.taken.push({ id: c.id, food: food, rolls: rolls, left: c.goods.length, at: now() }); if (LAST.taken.length > 12) LAST.taken.shift();
    if (!food && !rolls) return false;
    try { if (typeof billPublish === 'function') billPublish(); } catch (e) {} try { if (typeof updHud === 'function') updHud(); } catch (e) {} try { if (typeof root.__barPaintRead === 'function') root.__barPaintRead(); } catch (e) {}   /* the top bar's food counts up */
    try { var A = root.BohemiaAmbient; if (c._p && (!A || A.appear('kill_rise'))) FLY.push({ x: c._p.x, y: c._p.y, kp: c._p.kp, t0: null, icons: icons });   /* its clock starts at its first frame, so a slow phone still sees the whole rise */ } catch (e) {}   /* under the map's cap (rule 431(b)) */
    try { if (typeof saveNow === 'function') saveNow('the kill'); } catch (e) {}
    try { if (root.parent && root.parent !== root) root.parent.postMessage({ type: 'BOHEMIA_SFX', ev: 'pickup' }, '*'); } catch (e) {}   /* the shop's own pickup sound, the map's way (the shell plays it) */
    try { render(); } catch (e) {} skyGo();
    return true;
  }
  /* off from it: the crew walks there, and the walk's end takes it (loopArrived calls arrived) */
  function goTake(c) {
    if (near(c)) return take(c.id);
    st().list.forEach(function (q) { q.want = false; }); c.want = true; save();
    try { travelStop(); } catch (e) {}
    var went = false; try { went = !!travelTo(0, 0, c.at); } catch (e) {}
    if (!went) c.want = false;
    return true;
  }
  function arrived() { var hit = false; st().list.slice().forEach(function (c) { if (c.want && near(c)) hit = take(c.id) || hit; }); return hit; }

  /* ---------- 4. DRAWN ON THE MAP (the map's own pen): the animal on its side, a pool under it; no words, no birds ---------- */
  function k() { try { return Math.max(0.55, Math.min(2.2, (MAP_PEOPLE_K || 1))); } catch (e) { return 1; } }
  function onGlass(p, m) { m = m == null ? 80 : m; try { return !(p.sx < -m || p.sx > CVW + m || p.sy < -m - 60 || p.sy > CVH + m); } catch (e) { return true; } }
  /* the animal on its side: its own fight sheet, the idle frame pressed flat to the ground about its feet, darkened, a pool under it */
  function heap(c, sx, fy, kp) {
    var box = { w: 60 * kp, h: 24 * kp };
    g.save();
    g.fillStyle = 'rgba(92,18,12,0.7)'; g.beginPath(); g.ellipse(sx, fy, 30 * kp, 9 * kp, 0, 0, 7); g.fill();
    var drew = false;
    try { var B = root.BohemiaJobKinds && BohemiaJobKinds.beastPic ? BohemiaJobKinds.beastPic(c.faction) : null;
      if (B && B.im && B.m) { var m = B.m, sc = 0.5 * MAP_PERSON_K * MAP_PEOPLE_K, w = m.w * sc, h = m.h * sc;
        g.save(); g.translate(Math.round(sx), Math.round(fy)); g.scale(1.1, 0.55); g.rotate(0.05);
        var sm = g.imageSmoothingEnabled; g.imageSmoothingEnabled = false; g.filter = 'brightness(0.6) saturate(0.7)';
        g.drawImage(B.im, 0, 2 * m.h, m.w, m.h, -m.foot[0] * sc, -m.foot[1] * sc, w, h);
        g.filter = 'none'; g.imageSmoothingEnabled = sm; g.restore(); drew = true; box.w = Math.max(box.w, w * 1.1); box.h = Math.max(box.h, h * 0.55); } } catch (e) { try { g.filter = 'none'; } catch (e2) {} }
    if (!drew) {   /* the sheet not in yet: ribs in the sand */
      g.strokeStyle = 'rgba(214,204,182,0.8)'; g.lineWidth = Math.max(1, kp);
      for (var i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(sx + i * 3 * kp, fy - 1); g.quadraticCurveTo(sx + i * 3 * kp + 2 * kp, fy - 7 * kp, sx + i * 3 * kp + 4 * kp, fy - 1); g.stroke(); }
    }
    g.restore();
    return box;
  }
  /* ---------- THE SKY: the two icons rising off a kill he took play on their own thin layer over the map, for 0.9 s; the map itself
     draws only when it would anyway (WORLD 11 measured it: 33 ms a redraw, eight a second, the other way). Nothing circles. ---------- */
  var SKY = { cv: null, x: null, raf: 0, frames: 0, ms: 0 };
  function skyCanvas() {
    if (SKY.cv && SKY.cv.isConnected) return SKY.cv;
    var base = document.getElementById('cv'); if (!base || !base.parentNode) return null;
    var c = document.createElement('canvas'); c.id = 'killrise'; c.setAttribute('aria-hidden', 'true');
    c.style.cssText = 'position:fixed;left:0;top:0;pointer-events:none;z-index:1;image-rendering:pixelated';
    base.parentNode.insertBefore(c, base.nextSibling); SKY.cv = c; SKY.x = c.getContext('2d'); return c;
  }
  function here(gx, gy, kp) { var M = null; try { M = g.getTransform(); } catch (e) {} var P = M ? M.transformPoint(new DOMPoint(gx, gy)) : { x: gx, y: gy }, sc = M ? Math.hypot(M.a, M.b) || 1 : 1; return { x: P.x, y: P.y, kp: kp * sc }; }
  function skyDraw() {
    SKY.raf = 0;
    var t1 = performance.now(); FLY = FLY.filter(function (f) { return f.t0 == null || t1 - f.t0 < 900; });
    var on = FLY.length; if (!on && !SKY.cv) { LAST.skyWhy = 'nothing'; return; }
    var c = skyCanvas(), base = document.getElementById('cv'); if (!c || !base) { LAST.skyWhy = 'no canvas'; return; }
    var hidden = false; try { hidden = document.hidden || (typeof MODE !== 'undefined' && MODE !== 'city'); } catch (e) {}
    LAST.skyWhy = hidden ? 'hidden' : on ? 'drew' : 'clear';
    /* at the glass's plain points, never its device pixels (RUN's budget for the map: nothing glass-sized at the phone's pixels) */
    var r = base.getBoundingClientRect(), W = Math.max(1, Math.round(r.width)), Hc = Math.max(1, Math.round(r.height)), k0 = base.width / Math.max(1, r.width);
    if (c.width !== W || c.height !== Hc) { c.width = W; c.height = Hc; }
    c.style.left = r.left + 'px'; c.style.top = r.top + 'px'; c.style.width = r.width + 'px'; c.style.height = r.height + 'px';
    var x = SKY.x; x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, c.width, c.height);
    if (!on || hidden) return;
    x.setTransform(1 / k0, 0, 0, 1 / k0, 0, 0);   /* the queue is in the map canvas's own pixels */
    var now0 = performance.now(), A = root.BohemiaAmbient;
    /* what he took rises off the kill and is gone: the stash's own icons, no words, never more at once than the map's cap */
    try { if (A) A.frame('kill_rise'); } catch (e) {}
    FLY.forEach(function (f) { if (f.t0 == null) f.t0 = now0; var u = (now0 - f.t0) / 900, kp = f.kp || 1, sz = 30 * kp, n = f.icons.length;
      try { if (A) n = A.allow('kill_rise', n); } catch (e) {}
      x.save(); x.globalAlpha = Math.max(0, 1 - u * u); var sm = x.imageSmoothingEnabled; x.imageSmoothingEnabled = false;
      f.icons.slice(0, n).forEach(function (ic, i) { if (!ic || (ic.complete === false) || ic.naturalWidth === 0) return; var ox = (i - (n - 1) / 2) * sz * 1.15; x.drawImage(ic, Math.round(f.x + ox - sz / 2), Math.round(f.y - 20 * kp - u * 70 * kp - sz), sz, sz); });
      x.imageSmoothingEnabled = sm; x.restore(); LAST.flew = (LAST.flew | 0) + 1; });
    SKY.frames++; SKY.ms = Math.round((performance.now() - now0) * 100) / 100;
    if (FLY.length) SKY.raf = requestAnimationFrame(skyDraw);
  }
  function skyGo() { if (!SKY.raf) SKY.raf = requestAnimationFrame(skyDraw); }
  function draw(ox, oy) {
    HITS = []; var s = st(); if (!DATA) return; var kp = k();
    var drew = { carcass: 0, words: 0 };
    LAST.drew = drew;
    s.list.forEach(function (c, i) {
      var p = iso(c.at[0], c.at[1], ox, oy); if (!onGlass(p, 200)) return; var fy = p.sy + TH / 2 + 2;
      c._p = here(p.sx, fy, kp);
      if (onGlass(p)) {
        var bx = heap(c, p.sx, fy, kp); drew.carcass++;
        /* the finger's box: the animal and its pool, never under a 48 x 44 point target */
        var w = Math.max(48, bx.w + 8), h = Math.max(44, bx.h + 18);
        HITS.push({ x: p.sx - w / 2, y: fy - h + 10, w: w, h: h, what: { kill: c.id } });
      }
    });
    root.__CARCASS_DREW = drew;
    try { MAP_DREW.carcass = drew.carcass; } catch (e) {}
  }
  /* a tap on a kill */
  function tap(sx, sy) {
    for (var i = HITS.length - 1; i >= 0; i--) { var h = HITS[i]; if (sx < h.x || sx > h.x + h.w || sy < h.y || sy > h.y + h.h) continue;
      var c = byId(h.what.kill); if (!c) continue;
      root.__CARCASS_TAP = { id: c.id, near: near(c), at: now() };
      return goTake(c) || true;
    }
    return false;
  }

  root.BohemiaCarcass = {
    draw: draw, tap: tap, tick: tick, arrived: arrived, fightHome: fightHome, take: take,
    /* reading, for the gate */
    data: function () { return DATA; }, ready: function () { return !!DATA && !!STALLP; }, state: function () { return st(); }, goodsOf: goodsOf, hideItem: hideItem, foodOf: foodOf, last: function () { return LAST; },
    hits: function () { return HITS.slice(); }, sky: function () { return { px: SKY.cv ? [SKY.cv.width, SKY.cv.height] : null, birds: 0, frames: SKY.frames, ms: SKY.ms, flying: FLY.length }; },
    reset: function () { S = fresh(); save(); FLY = []; }
  };
})(typeof window !== 'undefined' ? window : this);
