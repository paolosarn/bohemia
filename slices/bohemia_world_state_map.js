/* A DIFFERENT VALLEY EVERY GAME (WORLD 7, 11/3/26, rule 339, ask line 347).
   PAOLO, AGAIN: 'the map is not giving procedurally generated vibes.' WORLD 6's code moved the home bases; the map still
   looked the same every game. This file draws the campaign's STATE of the real valley and makes it true, through marked
   hooks (__A_DIFFERENT_VALLEY_EVERY_GAME__ in slices/BOHEMIA_CITY_WORLD.html), each of which does nothing without it:
     (1) THE BLOCKS. engine/bohemia_world_state.js decides from the code which blocks are burned, looted or rebuilt; the
         painter paints them in the worker (char and ash, stripped grey and junk, panels and gardens), so they are the
         painting's own texels at every zoom. Which neighbourhoods are DARK is the power grid's own dark: the seeded circuits
         are put out with POWER.douse, so the painting, the lamps, the town and every 'is it black in here' reader agree.
     (2) WHAT STANDS OUT THERE. Camps (their smoke stands up over the valley by day, the fire glows at night), lairs (a wreck,
         bones, the birds turning over it), ruins (a burned shell standing black), legendary places (a mast, its red light
         blinking): drawn standing in the world at their blocks, scaled with the zoom, in the map's own palette; the tall
         parts rise out of the fog (Battle Brothers' smoke on the horizon), the ground and the name only where he has seen.
     (3) THE ROADS. A few freeway blocks are shut across their whole width (a jackknifed truck, a fallen overpass, a
         barricade), only where the valley stays one piece; one or two of the real passes out are shut (a rockslide, a
         checkpoint). The walk refuses them, so the routes go round.
     (4) THE SKY. The start's weather (a dust day, a heat haze, a cold clear night, smoke over the valley) washes the map for
         the first days, and goes to the fight with the block's state.
   THE OLD VALLEY (no code, or a game saved before this file) gets none of it: WORLD_STATE_ON is false and nothing here runs.
   Gate: gates/a_different_valley_every_game_gate.js. */
(function (root) {
  'use strict';
  var WS = null, TRIED = 0, PWR = null, DOUSED = 0, PASSES = null, OUT = null, PASS_CELLS = [], LAST = { drew: {}, err: null };
  var SPR = {};
  var PAL = {
    s: [[44, 40, 38], [78, 73, 69], [138, 132, 124], [196, 190, 180]],
    fire: '#ff8a2a', fireHi: '#ffd27a', ember: '#c4461c', rust: '#6b3b22', rustHi: '#8e5634', char: '#231c18', bone: '#d9d1bd',
    mast: '#1f1b19', mastHi: '#3e3732', red: '#ff3b2a', shell: '#1b1715', shellHi: '#3d342d', slide: '#8a7a66', slideHi: '#b3a387',
    bar: '#e0702a', barHi: '#efe6d2', sand: '#a8916a', bird: '#141110', truck: '#cfc8b8', truckHi: '#efe9dc'
  };

  /* ---------- small things ---------- */
  function on() { try { return !!root.WORLD_STATE_ON && !!root.WORLD_SEED; } catch (e) { return false; } }
  function N() { try { return om.n | 0; } catch (e) { return 0; } }
  function hidden(x, y) { try { return typeof fogHides === 'function' && fogHides(x, y); } catch (e) { return false; } }
  function beat() { try { return mapArtBeat() | 0; } catch (e) { return 0; } }
  function nightNow() { try { return !!isNight(); } catch (e) { return false; } }
  function dayNow() { try { return loopDay() | 0; } catch (e) { return 1; } }
  function hsh(a, b) { var h = 2166136261 ^ (a | 0); h = Math.imul(h, 16777619) ^ (b | 0); h = Math.imul(h, 16777619); h ^= h >>> 13; return (h >>> 0) / 4294967296; }
  function ground(x, y, ox, oy) { var p = iso(x, y, ox, oy); return { sx: p.sx, sy: p.sy + TH * 0.5 }; }
  function onGlass(p, m) { var W = 390, H = 736; try { W = CVW; H = CVH; } catch (e) {} m = m || 40; return p.sx > -m && p.sx < W + m && p.sy > -m && p.sy < H + m * 3; }
  function unit() { var t = 4; try { t = TW; } catch (e) {} return Math.max(1, Math.min(4, Math.round(t / 9))); }
  function font(px) { var f = 'monospace'; try { if (typeof FACE === 'function') f = FACE('casing'); } catch (e) {} return '700 ' + px + 'px ' + f; }
  function rgb(c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + a + ')'; }
  function D() { try { return root.BohemiaWorldState.data(); } catch (e) { return null; } }

  /* ---------- the state: worked out once from the real valley and the code, and made true ---------- */
  var RAW_WALK = (typeof root.cityWalkable === 'function') ? root.cityWalkable : null;
  function build() {
    TRIED++;
    if (!on() || !root.BohemiaWorldState) return null;
    var n = N(); if (!n || typeof POWER === 'undefined') return null;
    var bases = {}; try { bases = ctBases() || {}; } catch (e) { return null; }
    var acc = {}, circuits = [];
    try { POWER.cells().forEach(function (c) { var a = acc[c.id] || (acc[c.id] = { id: c.id, n: 0, x: 0, y: 0, live: 0 }); a.n++; a.x += c.x; a.y += c.y;
      try { if (POWER.at(c.x, c.y).live) a.live++; } catch (e) {} }); } catch (e) {}
    for (var k in acc) { var a = acc[k]; if (a.live) circuits.push({ id: a.id, x: a.x / a.n, y: a.y / a.n }); }
    circuits.sort(function (p, q) { return p.id - q.id; });
    var t0 = (root.performance && performance.now()) || 0;
    var S = root.BohemiaWorldState.make({ n: n, at: function (x, y) { var t = om.at(x, y); return t && t.district; } }, root.WORLD_SEED,
      { bases: bases, circuits: circuits, walk: function (x, y) { try { return RAW_WALK ? !!RAW_WALK(x, y) : false; } catch (e) { return false; } } });
    if (!S) return null;
    S.ms = Math.round((((root.performance && performance.now()) || 0) - t0) * 10) / 10;
    S.circuitsLive = circuits.length;
    WS = S; root.__WS_CELL = S.cell; root.__WS_KEY = S.key; root.__WORLD_STATE = S;
    douse(); repaint();
    return S;
  }
  /* the dark is the grid's own: re-made at every boot from the code (never written to the bill's dark set), and again if the
     grid is rebuilt under it */
  function douse() {
    if (!WS) return; PWR = POWER; var got = 0;
    WS.dark.ids.forEach(function (id) { try { if (POWER.douse(id)) got++; } catch (e) {} });
    DOUSED = got;
  }
  function repaint() {
    try { VBC.key = null; VBC.checked = 0; } catch (e) {}
    try { VBT.tiles.clear(); } catch (e) {}
    try { MAP_GROUND.key = ''; } catch (e) {}
  }
  function ready() {
    if (!WS && TRIED < 40) build();
    if (!WS) return false;
    if (typeof POWER !== 'undefined' && PWR !== POWER) { douse(); repaint(); }
    if (!PASSES && root.BOH_REGION && Array.isArray(root.BOH_REGION.passes)) shutPasses();
    return true;
  }
  /* the passes: the region joins its portals once the real land is in; then one or two are shut */
  function shutPasses() {
    var n = WS.n, d = D(), reach = (d && d.roads && d.roads.passes && d.roads.passes.reach) || 2;
    PASSES = root.BohemiaWorldState.passes(WS.code, root.BOH_REGION.passes, d); OUT = {}; PASS_CELLS = [];
    PASSES.forEach(function (p) {
      if (p.open) return;
      for (var dy = -reach; dy <= reach; dy++) for (var dx = -reach; dx <= reach; dx++) {
        var x = p.x + dx, y = p.y + dy;
        if (x < 0 || y < 0 || x >= n || y >= n) OUT[x + ',' + y] = 1;
      }
      if (p.x >= 0 && p.y >= 0 && p.x < n && p.y < n) { WS.block[p.y * n + p.x] = 1; }
      PASS_CELLS.push(p);
    });
  }

  /* ---------- the walk refuses a shut road ---------- */
  if (RAW_WALK) {
    root.cityWalkable = function (x, y) {
      if (WS) {
        var n = WS.n;
        if (x >= 0 && y >= 0 && x < n && y < n) { if (WS.block[y * n + x]) return false; }
        else if (OUT && OUT[x + ',' + y]) return false;
      }
      return RAW_WALK(x, y);
    };
  }

  /* ---------- the landmarks, each a small picture made once per size and frame, in the map's own colours ---------- */
  function sprite(key, w, h, paint) {
    var s = SPR[key]; if (s) return s;
    var c = document.createElement('canvas'); c.width = Math.max(1, w); c.height = Math.max(1, h);
    var x = c.getContext('2d'); x.imageSmoothingEnabled = false; paint(x);
    SPR[key] = c; return c;
  }
  function px(x, u, i, j, col) { x.fillStyle = col; x.fillRect(i * u, j * u, u, u); }
  /* a column of smoke, rising and leaning off the wind; four frames, the puffs climbing on the beat */
  function smoke(u, f, lean) {
    var W = 22, H = 46;
    return sprite('smoke:' + u + ':' + f + ':' + lean, W * u, H * u, function (x) {
      for (var i = 0; i < 11; i++) {
        var t = (i + f / 4) / 11, cy = H - 2 - t * (H - 6), cx = W / 2 + lean * Math.pow(t, 1.5) * 7, r = 1.1 + t * 4.2;
        var tone = PAL.s[Math.min(3, Math.floor(t * 4))], al = 0.98 - t * 0.5;
        for (var j = -Math.ceil(r); j <= Math.ceil(r); j++) for (var k = -Math.ceil(r); k <= Math.ceil(r); k++) {
          var dd = Math.sqrt(j * j + k * k) / r; if (dd > 1) continue;
          if (hsh(i * 97 + k + 31, j * 13 + f * 7 + 5) > 1.05 - dd * 0.55) continue;   /* dithered at the edge, solid inside */
          x.globalAlpha = al; px(x, u, Math.round(cx + k), Math.round(cy + j), rgb(tone, 1));
        }
      }
      x.globalAlpha = 1;
    });
  }
  function birds(gx, sx, sy, u, b, k0) {
    gx.fillStyle = PAL.bird;
    for (var k = 0; k < 3; k++) {
      var a = b * 0.55 + k * 2.1 + k0, rx = 9 * u, ry = 4 * u, bx = Math.round(sx + Math.cos(a) * rx), by = Math.round(sy - 22 * u + Math.sin(a) * ry), fl = (b + k) % 2;
      gx.fillRect(bx - u, by - fl * u, u, u); gx.fillRect(bx, by, u, u); gx.fillRect(bx + u, by - fl * u, u, u);
    }
  }
  function wreck(u) {
    return sprite('wreck:' + u, 12 * u, 7 * u, function (x) {
      for (var i = 0; i < 9; i++) for (var j = 0; j < 4; j++) px(x, u, i + 1 + (3 - j) * 0.5 | 0, j + 2, j === 0 ? PAL.rustHi : (i % 2 && j === 1) ? PAL.char : PAL.rust);
      [[0, 6], [10, 5], [11, 6], [3, 6]].forEach(function (b) { px(x, u, b[0], b[1], PAL.bone); });
    });
  }
  function shell(u, hgt, seed) {
    return sprite('shell:' + u + ':' + hgt + ':' + seed, 7 * u, (hgt + 2) * u, function (x) {
      for (var j = 0; j < hgt; j++) for (var i = 0; i < 5; i++) {
        var top = hgt - j, gone = j < 3 && hsh(i * 7 + seed, j * 3) < 0.45 - j * 0.1;   /* the jagged top */
        if (gone) continue;
        var col = i === 0 ? PAL.shellHi : ((j % 2 === 1 && i % 2 === 1) ? '#0c0a09' : PAL.shell);
        px(x, u, i + 1, j + 1, col);
      }
      px(x, u, 0, hgt, PAL.shell); px(x, u, 6, hgt, PAL.shell);
    });
  }
  function mast(u) {
    var H = 26;
    return sprite('mast:' + u, 7 * u, (H + 2) * u, function (x) {
      for (var j = 1; j <= H; j++) { px(x, u, 3, j, j % 3 === 0 ? PAL.mastHi : PAL.mast); if (j % 3 === 0 && j > 4) { px(x, u, 2, j, PAL.mast); px(x, u, 4, j, PAL.mast); } }
      for (var j2 = 8; j2 <= H; j2 += 2) { x.globalAlpha = 0.35; px(x, u, j2 > 18 ? 1 : 0, j2, PAL.mast); px(x, u, j2 > 18 ? 5 : 6, j2, PAL.mast); }
      x.globalAlpha = 1; px(x, u, 2, H + 1, PAL.mast); px(x, u, 4, H + 1, PAL.mast);
    });
  }
  function roadblock(kind, u) {
    return sprite('road:' + kind + ':' + u, 12 * u, 7 * u, function (x) {
      if (kind === 'truck') { for (var i = 0; i < 8; i++) for (var j = 0; j < 3; j++) px(x, u, i + (j > 0 ? 1 : 0) + 1, j + 1 + (i >> 2), j === 0 ? PAL.truckHi : PAL.truck);
        for (var i2 = 0; i2 < 3; i2++) px(x, u, 9 + (i2 >> 1), 3 + i2, PAL.rust); px(x, u, 2, 5, PAL.char); px(x, u, 7, 6, PAL.char); }
      else if (kind === 'overpass') { for (var i3 = 0; i3 < 10; i3++) { px(x, u, i3 + 1, 2 + (i3 > 4 ? 2 : 0) + (i3 % 3 === 0 ? 1 : 0), i3 % 2 ? '#8c8780' : '#6d6862'); if (hsh(i3, 9) < 0.6) px(x, u, i3 + 1, 5, '#4f4a45'); }
        px(x, u, 5, 1, '#9f9a92'); px(x, u, 6, 3, PAL.char); }
      else if (kind === 'slide') { for (var i4 = 0; i4 < 10; i4++) for (var j4 = 0; j4 < 4; j4++) { if (Math.abs(i4 - 5) + j4 * 1.6 > 6) continue; px(x, u, i4 + 1, 5 - j4, (i4 + j4) % 3 === 0 ? PAL.slideHi : PAL.slide); } }
      else { for (var i5 = 0; i5 < 10; i5++) { px(x, u, i5 + 1, 3, (i5 >> 1) % 2 ? PAL.barHi : PAL.bar); px(x, u, i5 + 1, 4, PAL.sand); } px(x, u, 1, 5, PAL.char); px(x, u, 10, 5, PAL.char); }
    });
  }
  function plate(gx, t, sx, sy, col) {
    gx.font = font(9); gx.textAlign = 'center'; gx.textBaseline = 'alphabetic';
    var w = gx.measureText(t).width + 6, h = 11;
    gx.fillStyle = 'rgba(14,11,8,0.82)'; gx.fillRect(Math.round(sx - w / 2), Math.round(sy), Math.round(w), h);
    gx.fillStyle = col || '#efe6d2'; gx.fillText(t, Math.round(sx), Math.round(sy + h - 3)); gx.textAlign = 'start';
  }
  function blitAt(gx, c, sx, sy, ax, ay, a) { if (!c) return; gx.globalAlpha = a == null ? 1 : a; gx.drawImage(c, Math.round(sx - ax), Math.round(sy - ay)); gx.globalAlpha = 1; }

  /* the day pass (under him and the names, over the land, the towns and the fog) */
  function draw(ox, oy) {
    if (!ready()) return;
    var gx = null; try { gx = g; } catch (e) { return; }
    var u = unit(), b = beat(), dr = { camps: 0, lairs: 0, ruins: 0, masts: 0, roads: 0, passes: 0, names: 0 }, names = [];
    var lean = ((root.BohemiaWorldState.hash(WS.code + ':wind') % 3) - 1) || 1, tw = 0; try { tw = TW; } catch (e) {}
    gx.save(); gx.imageSmoothingEnabled = false;
    try {
      WS.marks.forEach(function (m) {
        var p = ground(m.x, m.y, ox, oy); if (!onGlass(p, 60 * u)) return;
        var seen = !hidden(m.x, m.y);
        if (m.look === 'smoke') {
          var sm = smoke(u, b % 4, lean); blitAt(gx, sm, p.sx, p.sy, sm.width / 2, sm.height - u, seen ? 0.95 : 0.8);
          if (seen) { gx.fillStyle = PAL.fire; gx.fillRect(Math.round(p.sx - u), Math.round(p.sy - u), 2 * u, u); if (b % 2) { gx.fillStyle = PAL.fireHi; gx.fillRect(Math.round(p.sx), Math.round(p.sy - 2 * u), u, u); } }
          dr.camps++;
        } else if (m.look === 'wreck') {
          if (seen) { var wk = wreck(u); blitAt(gx, wk, p.sx, p.sy, wk.width / 2, wk.height - u); }
          birds(gx, p.sx, p.sy, u, b, m.x * 0.3); dr.lairs++;
        } else if (m.look === 'shell') {
          var hg = 12 + (root.BohemiaWorldState.hash(m.name + m.x) % 7), sh = shell(u, hg, m.x * 31 + m.y);
          blitAt(gx, sh, p.sx, p.sy, sh.width / 2, sh.height - u, seen ? 1 : 0.85); dr.ruins++;
        } else if (m.look === 'mast') {
          var ms = mast(u); blitAt(gx, ms, p.sx, p.sy, ms.width / 2, ms.height - u);
          gx.fillStyle = PAL.red; gx.globalAlpha = (b % 2) ? 1 : 0.45; gx.fillRect(Math.round(p.sx - u / 2), Math.round(p.sy - ms.height + u), u, u); gx.globalAlpha = 1;
          dr.masts++;
        }
        if (seen && tw >= 14) names.push([m.name, p.sx, p.sy + 2, m.kind === 'legend' ? '#ffd27a' : m.kind === 'lair' ? '#ff8f7a' : '#efe6d2']);
      });
      WS.roads.forEach(function (r) {
        if (hidden(r.x, r.y)) return;
        var p = ground(r.x, r.y, ox, oy); if (!onGlass(p)) return;
        var rb = roadblock(r.kind, u); blitAt(gx, rb, p.sx, p.sy, rb.width / 2, rb.height - u); dr.roads++;
        if (tw >= 14) names.push([r.name, p.sx, p.sy + 2, '#ffb36b']);
      });
      PASS_CELLS.forEach(function (q) {
        var p = ground(q.x, q.y, ox, oy); if (!onGlass(p)) return;
        var rb = roadblock(q.kind === 'slide' ? 'slide' : 'barricade', u); blitAt(gx, rb, p.sx, p.sy, rb.width / 2, rb.height - u); dr.passes++;
        if (tw >= 10) names.push([q.road + ': ' + q.name, p.sx, p.sy + 2, '#ffb36b']);
      });
      names.forEach(function (nm) { plate(gx, nm[0], nm[1], nm[2], nm[3]); dr.names++; });
    } catch (e) { LAST.err = String(e && e.message || e); }
    gx.restore();
    LAST.drew = dr; LAST.u = u;
  }
  /* after the night wash: the camps' fires and the masts' lights cut the dark; then the start's sky over everything */
  function after(ox, oy, night) {
    if (!WS) return;
    var gx = null; try { gx = g; } catch (e) { return; }
    var u = unit(), b = beat(), lit = 0;
    gx.save(); gx.imageSmoothingEnabled = false;
    try {
      if (night) {
        WS.marks.forEach(function (m) {
          if (m.look !== 'smoke' && m.look !== 'mast') return;
          var p = ground(m.x, m.y, ox, oy); if (!onGlass(p, 60 * u)) return;
          if (m.look === 'smoke') {
            var fl = 0.8 + 0.2 * ((b + m.x) % 3) / 2, R = 7 * u;
            for (var r = 3; r >= 1; r--) { gx.globalAlpha = 0.11 * fl * (4 - r); gx.fillStyle = PAL.fire;
              var rr = Math.round(R * r / 3); gx.fillRect(Math.round(p.sx - rr), Math.round(p.sy - rr / 2 - u), rr * 2, rr); }
            gx.globalAlpha = 1; gx.fillStyle = PAL.fireHi; gx.fillRect(Math.round(p.sx - u), Math.round(p.sy - 2 * u), 2 * u, u);
            gx.fillStyle = PAL.fire; gx.fillRect(Math.round(p.sx - u), Math.round(p.sy - u), 2 * u, u);
          } else {
            if (b % 2) { var top = p.sy - 27 * u; gx.globalAlpha = 0.3; gx.fillStyle = PAL.red; gx.fillRect(Math.round(p.sx - 2 * u), Math.round(top - 2 * u), 4 * u, 4 * u);
              gx.globalAlpha = 1; gx.fillRect(Math.round(p.sx - u / 2), Math.round(top), u, u); }
          }
          lit++;
        });
      }
      sky(gx, b);
    } catch (e) { LAST.err = String(e && e.message || e); }
    gx.restore();
    LAST.night = lit;
  }
  /* THE START'S SKY: a wash in the weather's own colour over the first days, fading out; dust and smoke carry a slow grain */
  var GRAIN = null;
  function sky(gx, b) {
    var w = WS.weather; if (!w) { LAST.sky = 0; return; }
    var d = dayNow(), days = w.days || 2; if (d > days) { LAST.sky = 0; return; }
    var fade = d <= 1 ? 1 : Math.max(0, 1 - (d - 1) / days), W = 390, H = 736; try { W = CVW; H = CVH; } catch (e) {}
    var a = (w.alpha || 0.15) * fade; if (a <= 0.005) { LAST.sky = 0; return; }
    gx.globalAlpha = 1; gx.fillStyle = rgb(w.tint || [128, 120, 110], a); gx.fillRect(0, 0, W, H);
    if (w.grain) {
      if (!GRAIN) { GRAIN = document.createElement('canvas'); GRAIN.width = GRAIN.height = 96; var x = GRAIN.getContext('2d'), im = x.createImageData(96, 96), q = im.data;
        for (var i = 0; i < 96 * 96; i++) { var v = hsh(i, 77) < 0.06 ? 1 : 0; q[i * 4] = w.tint[0] + 40; q[i * 4 + 1] = w.tint[1] + 34; q[i * 4 + 2] = w.tint[2] + 26; q[i * 4 + 3] = v ? 200 : 0; }
        x.putImageData(im, 0, 0); }
      gx.globalAlpha = Math.min(1, w.grain * fade); var o = (b * 7) % 96;
      for (var yy = -96; yy < H; yy += 96) for (var xx = -96; xx < W; xx += 96) gx.drawImage(GRAIN, xx + o, yy + (o >> 1));
      gx.globalAlpha = 1;
    }
    LAST.sky = Math.round(a * 100) / 100;
  }

  /* ---------- the fight's door: a burned block deals a burned board ---------- */
  function handOver(msg) {
    if (!ready() || !msg) return;
    var at = msg.at, x, y;
    if (at && at.length === 2) { x = at[0] | 0; y = at[1] | 0; } else if (at && at.gx != null) { x = at.gx | 0; y = at.gy | 0; } else if (at && at.x != null) { x = at.x | 0; y = at.y | 0; }
    else { try { x = city.x | 0; y = city.y | 0; } catch (e) { return; } }
    var st = root.BohemiaWorldState.stateAt(WS, x, y), d = D();
    msg.block_state = st;
    try { msg.powered = !!POWER.at(x, y).live; } catch (e) {}
    if (st === 'burned') { var B = d && d.scars && d.scars.burned && d.scars.burned.board; if (B && B.district && msg.district !== B.district && (!B.on || B.on.indexOf(msg.district) >= 0)) { msg.district_was = msg.district; msg.district = B.district; } }
    try { if (WS.weather && dayNow() <= (WS.weather.days || 2)) { msg.world = msg.world || {}; msg.world.start = WS.weather.id; } } catch (e) {}
  }

  function info() {
    if (!WS) return { on: on(), built: false, tried: TRIED };
    var s = root.BohemiaWorldState.summary(WS);
    s.on = true; s.doused = DOUSED; s.circuitsLive = WS.circuitsLive; s.ms = WS.ms;
    s.passes = PASSES ? PASSES.filter(function (p) { return !p.open; }).map(function (p) { return p.road + ' ' + p.name; }) : null;
    s.drew = LAST.drew; s.night = LAST.night; s.sky = LAST.sky; s.err = LAST.err;
    return s;
  }
  try { build(); } catch (e) { LAST.err = String(e && e.message || e); }
  try { if (WS && typeof MODE !== 'undefined' && MODE === 'city') setTimeout(function () { try { render(); } catch (e) {} }, 0); } catch (e) {}
  root.BohemiaWorldStateMap = { draw: draw, after: after, handOver: handOver, info: info, state: function () { return WS; }, passes: function () { return PASSES; }, last: LAST };
})(typeof window !== 'undefined' ? window : this);
