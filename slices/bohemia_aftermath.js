/* BOHEMIA AFTERMATH -- the minutes after a fight, played behind the end screen (RUN FOUR [the aftermath plays behind the loot
   screen], VAMILY rule 245, Paolo 10/26: 'the background is all black... instead a live show, as zoomed in as it can be, of your
   characters looting the bodies, walking between them, talking about what's next... animating in the background at a lower
   opacity').
   WHAT MEN DO IN THE MINUTES AFTER A FIGHT (the record: records/BOHEMIA_RUN4_THE_AFTERMATH_BEHIND_THE_LOOT_10_26_26.md, its
   sources cited there): the fire stops and nobody moves at once; then the men who can walk go to the wounded first, then
   through the dead, one at a time, turning out what they carried (the army calls the whole of it 'consolidate and reorganize':
   security out, the wounded seen to, the dead searched, ammunition counted and shared); a man stands over a body longer than the
   search needs; somebody lights a cigarette; two talk low about what comes next. So: his men who can walk go first to a friend
   who is down and stand over him, then from body to body, the nearest first, a man to a body, each stopping beside it a few bars
   facing it; between them, one smokes and two talk. The dead lie where they fell, in the fall the fight drew, a pool under each.
   THE PICTURES ARE THE FIGHT'S OWN: the board baked for this fight (its ground, cover and lamps), every man's sheet as the fight
   holds it (the packed atlas, the night's copy where no lamp reaches), the idles (engine/bohemia_idles.js, ANIMATION's: he
   breathes and shifts while he stands), the walk off his fight sheet with a long gun in his hands (a pistol is put away), and
   ANIMATION's town acts where his look has them (a smoke, the talk). Nothing is loaded that the fight did not already hold, so
   it costs no memory but its one canvas. ANIMATION's [the minutes after a fight] (kneel and loot, bind a cut, reload) take the
   stops' places the day they land: A.ACTS below says where.
   THE CAMERA is the fight's near stop (the closest it zooms: a house tile 121 css px, the man at his 104), drifting from man to
   man like a hand-held camera, four bars on each.
     BohemiaAftermath.fromFight(fightWindow)        a scene from the fight that just ended (its frame is still up behind), or null
     BohemiaAftermath.fromSample(o)                 a scene with no fight behind it (the screen on its own): a ground block of the
                                                    fight's, his men's sheets and the bodies' (packed atlases); Promise
     BohemiaAftermath.start(canvas, scene, o)       plays it: o.dim (0..1 black over it), o.fps (12: twice the walk's six keys a second, on the beat), o.ratio (canvas px per css px)
     BohemiaAftermath.stop()                        lets go of the canvas and the clock
     BohemiaAftermath.state()                       for the gates: the men, what each is doing, frames drawn, the cost of a frame
   Gate: gates/the_aftermath_gate.js */
(function (root) {
  'use strict';
  var BEAT = 500, KEY = BEAT / 3;   /* 120 BPM, three keys a beat (the rig's keys_per_beat) */
  var NEAR_TILE = 121, MAN_IDLE = 104, RULER = 98, STAGGER = 0.25;   /* the fight's own numbers (slices/BOHEMIA_FIGHT.html) */
  var DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
  var CLIPS = { stand: [0], walk: [1, 2, 3, 4, 5, 6], fall: [15, 16, 17], carry: [18], carrywalk: [19, 20, 21, 22, 23, 24] };
  var GUNCLIPS = { carry: [0], carrywalk: [1, 2, 3, 4, 5, 6] }, GUNORDER = ['pistol', 'rifle', 'shotgun'];
  /* WHERE ANIMATION'S AFTERMATH ACTS GO when they land: a stop's act ('loot' at a body, 'tend' by a friend down) plays
     BohemiaIdles.activity(look, seed, now, face, {act}) when his look has it; until then he stands there in his idles */
  var ACTS = { loot: 'loot', tend: 'tend', smoke: 'smoke', talk: 'talk' };
  var A = { cv: null, g: null, scene: null, raf: 0, last: 0, frames: 0, ms: 0, worst: 0, t0: 0, cam: null, ratio: 1, dim: 0.58, fps: 12, on: false };

  function dirOf(ddx, ddy) { return (Math.round(Math.atan2(ddx, ddy) / (Math.PI / 4)) % 8 + 8) % 8; }
  function hash(s) { var h = 2166136261 >>> 0; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
  function rnd(seed) { var x = (seed >>> 0) || 1; return function () { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 100000) / 100000; }; }

  /* one cell of a man's sheet: a packed atlas (the fight's PackedSheet: a table of where each cell's pixels sit) or the whole sheet */
  function cell(g, sheet, col, row, L, ox, oy, s) {
    if (!sheet) return false;
    if (sheet.atlas && sheet.t) {
      var i = (row * sheet.cols + col) * 6, t = sheet.t, tw = t[i + 4], th = t[i + 5]; if (!tw) return true;
      g.drawImage(sheet.atlas, t[i], t[i + 1], tw, th, ox + t[i + 2] * s, oy + t[i + 3] * s, tw * s, th * s); return true;
    }
    g.drawImage(sheet, col * L.w, row * L.h, L.w, L.h, ox, oy, L.w * s, L.h * s); return true;
  }

  /* ---------- THE SCENE FROM THE FIGHT THAT JUST ENDED ---------- */
  function fromFight(fw) {
    try {
      /* FIGHT is a const of the fight's script, seen from outside only through its own eval (the shell's nfFight does the same) */
      var F = null; try { F = fw && (fw.FIGHT || fw.eval('typeof FIGHT!=="undefined"?FIGHT:null')); } catch (e) { F = null; }
      var U = fw && fw.FIGHT_UI;
      if (!F || !F.S || !U || !U.board || !U.tw || typeof fw.lookOf !== 'function') return null;
      var S = F.S, k = fw.document.getElementById('cv');
      var sc = { from: 'fight', board: U.board, tw: U.tw, th: U.th, w: S.w, h: S.h, near: U.near || (NEAR_TILE / U.th), night: !!S.night, men: [], fw: fw,
        stagger: typeof fw.stagger === 'function' ? fw.stagger : function (y) { return -STAGGER * Math.cos(Math.PI * y); },
        passable: F._t && typeof F._t.passable === 'function' ? function (x, y) { try { return !!F._t.passable(x, y); } catch (e) { return true; } } : function () { return true; },
        lit: F._t && typeof F._t.litAt === 'function' ? function (x, y) { try { return !!F._t.litAt(x, y); } catch (e) { return true; } } : function () { return true; },
        idles: fw.BohemiaIdles || root.BohemiaIdles || null, bg: '#0d0b09' };
      /* the man's size at the near stop: the fight's own rigScale read at that stop (the person never grows past it, rule 21) */
      var ms = 0;
      try { var z = U.zoom; U.zoom = sc.near; ms = fw.rigScale(); U.zoom = z; } catch (e) { ms = 0; }
      sc.manDev = ms > 0 ? ms : 0;   /* device px a sheet px, on the fight's glass */
      sc.dpr = fw.devicePixelRatio || 1;
      S.units.forEach(function (v) {
        if (v.fled) return;
        var L = null; try { L = fw.lookOf(v); } catch (e) { L = null; } if (!L || !L.file) return;
        var sheet = null; try { sheet = fw.sheetOf(v); } catch (e) { sheet = null; }
        if (!sheet) sheet = U.imgs && U.imgs['fight_rig/' + L.file]; if (!sheet) return;
        var gs = null; try { gs = fw.gunSheet(v, L); } catch (e) { gs = null; }
        /* the look's name: the fight's own (idleDraw keeps it on the look; a rolled man's cells are under 'fight_' + it) */
        var key = L._key || v.look || null, idle = key, B = sc.idles;
        try { if (key && B && B.has && B.has('fight_' + key)) idle = 'fight_' + key; } catch (e) {}
        sc.men.push({ id: v.id, name: v.name, side: v.side, main: !!v.main, x: v.x, y: v.y, face: v._face || 0, L: L, look: idle, town: key, sheet: sheet,
          gun: gs && gs.row > 0 ? gs : null, beast: !!v.beast, machine: !!v.machine, ghost: !!v.ghost,
          state: v.dead ? 'dead' : v.down ? 'down' : 'up' });
      });
      return sc.men.some(function (m) { return m.side === 'you' && m.state === 'up'; }) || sc.men.length ? sc : null;
    } catch (e) { return null; }
  }

  /* ---------- A SCENE WITH NO FIGHT BEHIND IT (the screen on its own; the gates' sample) ---------- */
  function packed(stem) {
    return fetch('fight_rig/packed/' + stem + '.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (m) {
      if (!m) return null;
      return new Promise(function (res) { var im = new Image(); im.onload = function () {
        var b = atob(m.cells), u = new Uint16Array(b.length >> 1); for (var i = 0; i < u.length; i++) u[i] = b.charCodeAt(i * 2) | (b.charCodeAt(i * 2 + 1) << 8);
        res({ atlas: im, t: u, cw: m.cw, ch: m.ch, cols: m.cols, rows: m.rows, width: m.w, height: m.h }); }; im.onerror = function () { res(null); }; im.src = 'fight_rig/packed/' + m.atlas; });
    }).catch(function () { return null; });
  }
  function fromSample(o) {
    o = o || {};
    return Promise.all([fetch('fight_rig/fight_rig.json').then(function (r) { return r.json(); }), fetch('fight_ground/fight_ground.json').then(function (r) { return r.json(); })]).then(function (j) {
      var rig = j[0], G = j[1], blocks = Object.keys(G.blocks || {}), want = o.block && G.blocks[o.block] ? o.block : (blocks.filter(function (b) { return /street|road|lot|yard|park/.test(b); })[0] || blocks[0]);
      return new Promise(function (res) { var im = new Image(); im.onload = function () { res(im); }; im.onerror = function () { res(null); }; im.src = 'fight_ground/' + G.blocks[want].src; }).then(function (im) {
        var bt = G.block_tiles || 5, tw = G.tile_px[0] / 4, th = G.tile_px[1] / 4, n = 2;   /* a quarter of the art: a board of 10 by 10 tiles, two blocks a side */
        var c = document.createElement('canvas'); c.width = Math.round(tw * bt * n); c.height = Math.round(th * bt * n);
        var g = c.getContext('2d'); g.fillStyle = '#2a2219'; g.fillRect(0, 0, c.width, c.height);
        if (im) for (var by = 0; by < n; by++) for (var bx = 0; bx < n; bx++) g.drawImage(im, bx * bt * tw, by * bt * th, bt * tw, bt * th);
        var men = (o.men || []), dead = (o.dead || []), all = men.map(function (m) { return m.look; }).concat(dead.map(function (d) { return d.look; }));
        var stems = all.filter(function (x, i) { return x && all.indexOf(x) === i && rig.looks[x]; });
        return Promise.all(stems.map(function (s) { return packed(rig.looks[s].file.replace(/\.[a-z]+$/, '')); })).then(function (ps) {
          var SH = {}; stems.forEach(function (s, i) { SH[s] = ps[i]; });
          var sc = { from: 'sample', board: c, tw: tw, th: th, w: bt * n, h: bt * n, near: NEAR_TILE / th, night: false, men: [],
            stagger: function (y) { return -STAGGER * Math.cos(Math.PI * y); }, passable: function () { return true; }, lit: function () { return true; },
            idles: root.BohemiaIdles || null, bg: '#0d0b09', manDev: 0, dpr: root.devicePixelRatio || 1 };
          men.concat(dead).forEach(function (m, i) { var L = rig.looks[m.look]; if (!L || !SH[m.look]) return;
            sc.men.push({ id: 'm' + i, name: m.name || '', side: i < men.length ? 'you' : 'them', main: !!m.main, x: m.x, y: m.y, face: m.face || 0, L: L, look: m.look, town: m.look,
              sheet: SH[m.look], gun: null, state: m.state || (i < men.length ? 'up' : 'dead') }); });
          return sc;
        });
      });
    });
  }

  /* ---------- WHO DOES WHAT: the stops (a friend down first, then the dead nearest first, a man to a body; a smoke; a talk) ---------- */
  function bfs(sc, from, to) {
    var W = sc.w, H = sc.h, key = function (x, y) { return y * W + x; }, prev = {}, q = [from], seen = {};
    seen[key(from.x, from.y)] = true;
    while (q.length) { var p = q.shift(); if (p.x === to.x && p.y === to.y) break;
      [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].forEach(function (d) {
        var x = p.x + d[0], y = p.y + d[1], k = key(x, y); if (x < 0 || y < 0 || x >= W || y >= H || seen[k]) return;
        if (!(x === to.x && y === to.y) && !sc.passable(x, y)) return; seen[k] = true; prev[k] = p; q.push({ x: x, y: y }); }); }
    var path = [], c = to; if (!seen[key(to.x, to.y)]) return [from, to];
    while (c) { path.unshift(c); if (c.x === from.x && c.y === from.y) break; c = prev[key(c.x, c.y)]; }
    return path;
  }
  function plan(sc) {
    var up = sc.men.filter(function (m) { return m.side === 'you' && m.state === 'up' && !m.machine; });
    var dead = sc.men.filter(function (m) { return m.state === 'dead' && m.side !== 'you'; });
    var down = sc.men.filter(function (m) { return m.side === 'you' && m.state !== 'up'; });
    var taken = {};
    up.forEach(function (m, i) {
      m.seed = hash('aftermath:' + m.id); m.r = rnd(m.seed); m.stops = [];
      m.wx = m.x; m.wy = m.y; m.at = 0; m.act = 'arrive'; m.until = (2 + (i % 3)) * BEAT;   /* the quiet first: nobody moves at once */
    });
    /* SECURITY FIRST (the doctrine's order, the record's finding): with three or more standing, the last of them takes the watch
       before anyone searches: a few bars at his own place, facing out, away from the dead */
    if (up.length >= 3 && dead.length) {
      var w = up[up.length - 1], cx = 0, cy = 0; dead.forEach(function (d) { cx += d.x; cy += d.y; }); cx /= dead.length; cy /= dead.length;
      w.stops.push({ watch: { x: w.x, y: w.y, face: dirOf(w.x - cx, w.y - cy) }, act: 'watch', beats: 10 });
    }
    /* the friend down: the nearest man who can walk goes to him first and stays longest */
    down.forEach(function (d) {
      var m = up.slice().sort(function (a, b) { return Math.hypot(a.x - d.x, a.y - d.y) - Math.hypot(b.x - d.x, b.y - d.y); })[0];
      if (m) m.stops.push({ to: d, act: ACTS.tend, beats: 10 });
    });
    /* the dead: each body to the nearest man who has fewest, then each man's own walk through them nearest first */
    dead.slice().sort(function (a, b) { return a.y - b.y || a.x - b.x; }).forEach(function (d) {
      var m = up.slice().sort(function (a, b) { return (a.stops.length - b.stops.length) * 3 + Math.hypot(a.x - d.x, a.y - d.y) - Math.hypot(b.x - d.x, b.y - d.y); })[0];
      if (m) { m.stops.push({ to: d, act: ACTS.loot, beats: 8 + (hash(m.id + d.id) % 5) }); taken[d.id] = true; }
    });
    /* a smoke for the one whose look has it (YOU, ANIMATION's town acts), and two who talk over what comes next */
    var acts = function (m) { try { return sc.idles && sc.idles.activities ? sc.idles.activities(m.town) : []; } catch (e) { return []; } };
    up.forEach(function (m) { acts(m); });   /* asks for his town index now, so it is in by the time he stops */
    var smoker = up.filter(function (m) { return acts(m).indexOf('smoke') >= 0; })[0] || up.filter(function (m) { return m.main; })[0] || up[up.length - 1] || null;
    if (smoker) smoker.stops.push({ act: ACTS.smoke, beats: 16 });
    if (up.length >= 2) {
      var a = up[0], b = up[1];
      var mx = Math.round((a.x + b.x) / 2), my = Math.round((a.y + b.y) / 2);
      a.stops.push({ meet: { x: mx, y: my, side: -1 }, with: b, act: ACTS.talk, beats: 16, pair: 'aftermath:' + a.id + b.id });
      b.stops.push({ meet: { x: mx, y: my, side: 1 }, with: a, act: ACTS.talk, beats: 16, pair: 'aftermath:' + a.id + b.id, partner: true });
    }
    /* the man on the watch joins the search after it: the body nearest him */
    up.forEach(function (m) { if (m.stops.length === 1 && m.stops[0].watch && dead.length) {
      var d = dead.slice().sort(function (a, b) { return Math.hypot(a.x - m.x, a.y - m.y) - Math.hypot(b.x - m.x, b.y - m.y); })[0];
      m.stops.push({ to: d, act: ACTS.loot, beats: 8 }); } });
    up.forEach(function (m) { m.stops.forEach(function (s) { s.of = m; }); m.next = 0; });
    return up;
  }
  /* the point he stands at for a stop: beside a body (a third of a tile off its middle, facing it), at the talk's meeting place */
  function spot(sc, m, s) {
    if (s.watch) return { x: s.watch.x, y: s.watch.y, tile: { x: s.watch.x, y: s.watch.y } };
    if (s.meet) return { x: s.meet.x + s.meet.side * 0.22, y: s.meet.y, tile: { x: s.meet.x, y: s.meet.y } };
    if (s.to) { var side = (hash(m.id + s.to.id) & 1) ? 1 : -1; return { x: s.to.x + side * 0.34, y: s.to.y - 0.06, tile: { x: s.to.x, y: s.to.y } }; }
    return { x: m.wx, y: m.wy, tile: { x: Math.round(m.wx), y: Math.round(m.wy) } };
  }
  function nextStop(sc, m, now) {
    var s = m.stops[m.next % Math.max(1, m.stops.length)]; m.next++;
    if (!s) { m.act = 'stand'; m.until = now + 8 * BEAT; return; }
    var p = spot(sc, m, s), from = { x: Math.round(m.wx), y: Math.round(m.wy) }, path = bfs(sc, from, p.tile);
    var pts = path.map(function (q) { return { x: q.x, y: q.y }; }); pts[0] = { x: m.wx, y: m.wy }; pts[pts.length - 1] = { x: p.x, y: p.y };
    var len = 0; for (var i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    m.stop = s; m.path = pts; m.len = len; m.walkAt = now; m.act = len > 0.05 ? 'walk' : 'there';
    m.dur = len / 0.6 * 1000;   /* 0.6 of a house tile a second: a slow walk at the man's own size (the walk's six keys a second) */
    if (m.act === 'there') arrive(sc, m, now);
  }
  function arrive(sc, m, now) {
    var s = m.stop; m.act = s.act; m.since = now; m.until = now + s.beats * BEAT;
    if (s.watch) m.face = s.watch.face;
    var at = s.to || s.with; if (at) m.face = dirOf((at.wx !== undefined ? at.wx : at.x) - m.wx, (at.wy !== undefined ? at.wy : at.y) - m.wy);
  }
  function step(sc, m, now) {
    if (m.act === 'walk') {
      var t = Math.min(1, (now - m.walkAt) / Math.max(1, m.dur)), d = t * m.len, i = 1;
      while (i < m.path.length - 1 && d > Math.hypot(m.path[i].x - m.path[i - 1].x, m.path[i].y - m.path[i - 1].y)) { d -= Math.hypot(m.path[i].x - m.path[i - 1].x, m.path[i].y - m.path[i - 1].y); i++; }
      var p = m.path[i - 1], q = m.path[i], L = Math.max(1e-6, Math.hypot(q.x - p.x, q.y - p.y)), f = Math.min(1, d / L);
      m.wx = p.x + (q.x - p.x) * f; m.wy = p.y + (q.y - p.y) * f; m.face = dirOf(q.x - p.x, q.y - p.y);
      if (t >= 1) arrive(sc, m, now);
      return;
    }
    if (now >= m.until) nextStop(sc, m, now);
  }

  /* ---------- THE DRAW ---------- */
  function camTarget(sc, men, now) {
    var up = men.length ? men : sc.men, n = up.length, i = Math.floor(now / (16 * BEAT)) % Math.max(1, n), m = up[i] || up[0];
    if (!m) return { x: sc.board.width / 2, y: sc.board.height / 2, m: null };
    var x = m.wx !== undefined ? m.wx : m.x, y = m.wy !== undefined ? m.wy : m.y;
    return { x: (x + 0.5 + sc.stagger(y)) * sc.tw, y: (y + 0.9) * sc.th, m: m };   /* his feet */
  }
  function frame(now) {
    A.raf = root.requestAnimationFrame(frame);
    if (!A.on || !A.scene) return;
    if (root.document.hidden || A.hold || (A.paused && A.paused())) return;
    if (now - A.last < 1000 / A.fps) return;
    A.last = now;
    var t0 = root.performance.now();
    draw(now - A.t0);
    var ms = root.performance.now() - t0; A.frames++; A.ms += ms; if (ms > A.worst) A.worst = ms;
    A.times.push(ms); if (A.times.length > 240) A.times.shift();
  }
  function draw(now) {
    var sc = A.scene, g = A.g, cv = A.cv, W = cv.width, H = cv.height, r = A.ratio;
    var up = A.men;
    up.forEach(function (m) { step(sc, m, now); });
    /* the camera: the near stop, easing toward the man it is on (a hand-held drift, four bars each) */
    /* the camera: the near stop, his feet held where the screen leaves the scene open (o.focus: the phone's window over the
       crew, else the middle), easing after the man it is on (a hand-held follow, half a second behind, four bars a man) */
    var k = sc.near * r, T = camTarget(sc, up, now), F = (A.focus && A.focus()) || [0.5, 0.5];
    if (!A.cam || A.cam.m !== T.m && !A.cam.m) A.cam = { x: T.x, y: T.y, m: T.m };
    var e = 1 - Math.pow(0.5, (1000 / A.fps) / 600); A.cam.x += (T.x - A.cam.x) * e; A.cam.y += (T.y - A.cam.y) * e;
    var bw = sc.board.width, bh = sc.board.height;
    var ox = W * F[0] - A.cam.x * k, oy = H * F[1] + 48 * r - A.cam.y * k;
    ox = bw * k > W ? Math.max(W - bw * k, Math.min(0, ox)) : (W - bw * k) / 2;
    oy = bh * k > H ? Math.max(H - bh * k, Math.min(0, oy)) : (H - bh * k) / 2;
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    g.fillStyle = sc.bg; g.fillRect(0, 0, W, H);
    /* only the part of the board on the glass: the source cut to the view (a full-board blit asks the copy to clip 3,200 by 1,700
       board pixels every frame) */
    var sx0 = Math.max(0, -ox / k), sy0 = Math.max(0, -oy / k), sw = Math.min(bw - sx0, W / k + 1), sh = Math.min(bh - sy0, H / k + 1);
    g.imageSmoothingEnabled = k < 1;
    if (sw > 0 && sh > 0) g.drawImage(sc.board, sx0, sy0, sw, sh, ox + sx0 * k, oy + sy0 * k, sw * k, sh * k);
    g.imageSmoothingEnabled = false;
    var s = sc.manDev > 0 ? Math.max(1, Math.round(sc.manDev / sc.dpr * r)) : Math.max(1, Math.round(MAN_IDLE * r / RULER));
    var X = function (x, y) { return ox + (x + 0.5 + sc.stagger(y)) * sc.tw * k; }, Y = function (y) { return oy + (y + 0.9) * sc.th * k; };
    var hman = RULER * s;
    /* the dead and the down: where they fell, the fall's last key, a pool under each */
    var lying = sc.men.filter(function (m) { return m.state !== 'up'; });
    lying.forEach(function (m) { var x = X(m.x, m.y), y = Y(m.y), rx = hman * 0.32 * (m.state === 'dead' ? 1 : 0.8);
      if (!m.ghost) { g.fillStyle = m.machine ? 'rgba(12,11,10,.8)' : 'rgba(92,13,8,.72)'; g.beginPath(); g.ellipse(x, y - hman * 0.05, rx, rx * 0.3, 0, 0, Math.PI * 2); g.fill(); } });
    var people = lying.map(function (m) { return { m: m, y: m.y, lie: true }; }).concat(up.map(function (m) { return { m: m, y: m.wy }; })).sort(function (a, b) { return a.y - b.y; });
    people.forEach(function (p) {
      var m = p.m, L = m.L, x = X(p.lie ? m.x : m.wx, p.lie ? m.y : m.wy), y = Y(p.lie ? m.y : m.wy), x0 = Math.round(x) - L.foot[0] * s, y0 = Math.round(y) - L.foot[1] * s;
      var clips = L.clips || CLIPS;
      if (p.lie) { var fc = clips.fall || CLIPS.fall; cell(g, m.sheet, fc[fc.length - 1], m.face || 0, L, x0, y0, s); return; }
      drawUp(sc, g, m, x, y, x0, y0, s, now, clips);
    });
    /* dimmed to the floor, the edges going dark, the tape's scanlines every third row (rule 245(c); the camera is a tape, at the
       source): one picture made once for the canvas's size and laid over every frame in a single pass (four passes a frame cost the
       computer's frame 65 ms a second, measured) */
    if (!A.over || A.over.width !== W || A.over.height !== H) {
      A.over = root.document.createElement('canvas'); A.over.width = W; A.over.height = H; var og = A.over.getContext('2d');
      og.fillStyle = 'rgba(10,8,6,' + A.dim + ')'; og.fillRect(0, 0, W, H);
      var gr = og.createRadialGradient(W / 2, H * 0.42, Math.min(W, H) * 0.25, W / 2, H * 0.5, Math.hypot(W, H) * 0.62);
      gr.addColorStop(0, 'rgba(8,6,4,0)'); gr.addColorStop(1, 'rgba(8,6,4,.7)'); og.fillStyle = gr; og.fillRect(0, 0, W, H);
      og.fillStyle = 'rgba(0,0,0,.18)'; for (var yy = 2; yy < H; yy += 3) og.fillRect(0, yy, W, 1);
    }
    g.globalAlpha = 1; g.drawImage(A.over, 0, 0);
    A.view = { ox: ox, oy: oy, k: k, s: s };
  }
  function drawUp(sc, g, m, x, y, x0, y0, s, now, clips) {
    var f = m.face || 0, B = sc.idles, gun = m.gun, dark = sc.night && !sc.lit(Math.round(m.wx), Math.round(m.wy)), fw = sc.fw;
    var im = function (i) { if (!dark || !fw || typeof fw.nightSheet !== 'function') return i; try { return fw.nightSheet(i, fw.moonOf(Math.round(m.wx), Math.round(m.wy))); } catch (e) { return i; } };
    m.drawn = m.act;
    if (m.act === 'walk') {
      var k = Math.floor(Math.max(0, now - m.walkAt) / (BEAT / 3)) % 6, c = gun ? (clips.carrywalk || CLIPS.carrywalk) : (clips.walk || CLIPS.walk);
      cell(g, m.sheet, c[k % c.length], f, m.L, x0, y0, s);
      if (gun && gun.img) { var gc = GUNCLIPS.carrywalk[k % 6]; cell(g, gun.img, gc, gun.row * 8 + f, m.L, x0, y0, s); }
      return;
    }
    /* a stop: ANIMATION's act where his look has it (the smoke, the talk; loot and tend when they land), else his idles */
    var act = m.act === 'smoke' || m.act === 'talk' || m.act === 'loot' || m.act === 'tend' ? m.act : null;
    if (act && B && B.activity) {
      try { var o = { act: act, since: m.since, beatMs: BEAT, n: sc.men.indexOf(m) };
        if (act === 'talk' && m.stop) { o.pair = m.stop.pair; o.partner = !!m.stop.partner; }
        var a = B.activity(m.town, m.seed, now, f, o);
        if (a && a.img) { var fx = (a.foot || m.L.foot); var ax = Math.round(x) - fx[0] * s, ay = Math.round(y) - fx[1] * s;
          g.drawImage(im(a.img), a.x, a.y, a.w, a.h, ax + a.dx * s, ay + a.dy * s, a.w * s, a.h * s); m.drawn = 'act:' + act; return; }
      } catch (e) {}
    }
    if (B && B.frame && m.look) {
      try { var set = gun ? 'carry' : 'bare', c2 = B.frame(m.look, 'aftermath:' + m.id, now, f, { set: set, beatMs: BEAT, since: m.since });
        if (c2 && c2.img && !c2.person) {
          var gg = gun ? B.gun(m.look, GUNORDER[gun.row], c2.pose, f) : null;
          if (!gun || gg) {
            g.drawImage(im(c2.img), c2.x, c2.y, c2.w, c2.h, x0 + c2.dx * s, y0 + c2.dy * s, c2.w * s, c2.h * s);
            if (gg && !gg.hidden) g.drawImage(im(gg.img), gg.x, gg.y, gg.w, gg.h, x0 + gg.dx * s, y0 + gg.dy * s, gg.w * s, gg.h * s);
            m.drawn = 'idle'; return; } }
      } catch (e) {}
    }
    var st = gun ? (clips.carry || CLIPS.carry) : (clips.stand || CLIPS.stand);
    cell(g, m.sheet, st[0], f, m.L, x0, y0, s);
    if (gun && gun.img) cell(g, gun.img, GUNCLIPS.carry[0], gun.row * 8 + f, m.L, x0, y0, s);
    m.drawn = 'still';
  }

  function size() {
    if (!A.cv) return;
    /* one canvas pixel a css pixel, stretched by the glass with no smoothing: the man's sheet pixel lands on the same device pixels
       the fight gives it (its rigScale is the device ratio at the near stop), and a phone's glass uploads a ninth of the pixels */
    var r = 1, w = Math.max(1, Math.round(root.innerWidth * r)), h = Math.max(1, Math.round(root.innerHeight * r));
    A.ratio = r; if (A.cv.width !== w || A.cv.height !== h) { A.cv.width = w; A.cv.height = h; A.over = null; }
  }
  function start(cv, scene, o) {
    stop(); o = o || {};
    A.cv = cv; A.g = cv.getContext('2d'); A.scene = scene; A.dim = o.dim != null ? o.dim : A.dim; A.over = null; A.fps = o.fps || 12; A.paused = o.paused || null; A.focus = o.focus || null;
    A.frames = 0; A.ms = 0; A.worst = 0; A.times = []; A.cam = null; A.t0 = root.performance.now(); A.last = 0; A.on = true;
    size(); A.men = plan(scene);
    draw(0);   /* drawn on open (rule 245(c)): the first picture before the first frame of the clock */
    if (!A.sized) { A.sized = true; root.addEventListener('resize', size); }
    A.raf = root.requestAnimationFrame(frame);
    return true;
  }
  function stop() {
    A.on = false; if (A.raf) root.cancelAnimationFrame(A.raf); A.raf = 0;
    if (A.scene) { A.scene.fw = null; A.scene.board = null; } A.scene = null; A.men = null; A.over = null;
  }
  function state() {
    var ts = (A.times || []).slice().sort(function (a, b) { return a - b; });
    return { on: A.on, from: A.scene && A.scene.from, frames: A.frames, msAvg: A.frames ? A.ms / A.frames : 0, msWorst: A.worst, msP95: ts.length ? ts[Math.floor(ts.length * 0.95)] : 0, dim: A.dim, ratio: A.ratio,
      canvas: A.cv ? [A.cv.width, A.cv.height] : null, bytes: (A.cv ? A.cv.width * A.cv.height * 4 : 0) + (A.over ? A.over.width * A.over.height * 4 : 0), view: A.view || null,
      same: function (b) { return !!(A.scene && b && A.scene.board === b); },
      board: A.scene ? { tw: A.scene.tw, th: A.scene.th, w: A.scene.w, h: A.scene.h, bw: A.scene.board && A.scene.board.width, bh: A.scene.board && A.scene.board.height, near: A.scene.near, manDev: A.scene.manDev, dpr: A.scene.dpr } : null,
      at: function (x, y) { var v = A.view, sc = A.scene; return v && sc ? [v.ox + (x + 0.5 + sc.stagger(y)) * sc.tw * v.k, v.oy + (y + 0.9) * sc.th * v.k] : null; },
      men: (A.men || []).map(function (m) { return { id: m.id, name: m.name, act: m.act, drawn: m.drawn, x: m.wx, y: m.wy, face: m.face, stops: m.stops.length, sheet: !!m.sheet, packed: !!(m.sheet && m.sheet.atlas), L: [m.L.w, m.L.h, m.L.foot],
        stop: m.stop ? (m.stop.to ? 'body:' + m.stop.to.id : m.stop.with ? 'with:' + m.stop.with.id : m.stop.act) : null }; }),
      lying: A.scene ? A.scene.men.filter(function (m) { return m.state !== 'up'; }).map(function (m) { return { id: m.id, side: m.side, state: m.state, x: m.x, y: m.y }; }) : [] };
  }
  root.BohemiaAftermath = { fromFight: fromFight, fromSample: fromSample, start: start, stop: stop, state: state, ACTS: ACTS, cell: cell,
    hold: function (on) { A.hold = !!on; } };   /* the gates: the page measured with the scene's clock held, then running */
})(typeof window !== 'undefined' ? window : this);
