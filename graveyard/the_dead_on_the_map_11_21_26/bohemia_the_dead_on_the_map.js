/* ==========================================================================
   __THE_DEAD_ON_THE_MAP__ (WORLD 15, 11/21; VAMILY rule 360 and its amendment the same round, ask rows 384 and 394; rule 441;
   rule 454(a): no words)

   PAOLO 11/3: 'we don't see enough corpses even throughout the world or in the combat map... make things as realistic as
   possible... billions of people have died' (canon: two to three billion in the first decade). AMENDED THE SAME ROUND: 'keep the
   bodies lore friendly... if it's a busy civilized settlement or part of the town, obviously they don't have [corpses], but the
   gameplay should be very simplified'. COOK DEAD made the thirteen dead as real models through the master rig (11/3,
   records/target/dead/); its manifest left the map's half to WORLD: 'the pit at each stadium and the landfill, the grave rows on the
   parks, the golf courses and the school fields, a clinic's bag row at the hospitals; the single bodies on the blocks the counts name'.
   MEASURED 11/21: no page read records/target/dead/; the map showed no dead at any zoom.

   NOW, up close (from a block 96 px, where the house models stand, to the street stop): the dead lie on the ground of the blocks
   nobody holds, at the house models' own scale (twice their metres, the scale the map's men stand at), toned to the map's light:
   downtown's doorways and sidewalks, the Strip's morgue doors, the washes' camps, the jam on the freeway, the trailer parks, a body
   on a bench on an arterial; the graves on the parks, the golf courses and the school fields; the pit at the landfill and the
   stadiums; the bag row at a clinic. WHERE PEOPLE LIVE (within 2 blocks of a town's ground, a real place he walks into, his home
   base) the living buried them: graves only. Only on ground he has seen (the fog). Scenery only: no tap, no word, no rule; the
   same valley lays the same dead every time (the valley's own seed and the campaign's). Under the houses (a house nearer the
   camera stands in front) and behind the painted towers (the map's own depth read), under the night, the fog, the names and the people.
     slices/map_dead/rules.json   where they lie (a modder's file);  slices/map_dead/pieces.json  the pictures (the tool's)
     BohemiaDeadOnTheMap.list()   every dead piece on this valley: {x, y, fx, fy, id, lived}
     BohemiaDeadOnTheMap.last     what the last frame drew;  .on = false is the page test's switch, never the game's
   The map calls BohemiaDeadOnTheMap.draw(ox, oy) once a frame, before the house models (one line in BOHEMIA_CITY_WORLD.html).
   ========================================================================== */
(function (root) {
  'use strict';
  if (typeof root.iso !== 'function') return;
  var D = root.BohemiaDeadOnTheMap = { on: true, rules: null, pieces: null, img: {}, ready: false, asked: false, key: '', all: [], last: { drew: 0, culled: 0, unseen: 0, hidden: 0, ms: 0 }, err: null };

  function load() {
    if (D.asked) return; D.asked = true;
    try {
      Promise.all([fetch('map_dead/rules.json').then(function (r) { return r.json(); }), fetch('map_dead/pieces.json').then(function (r) { return r.json(); })]).then(function (a) {
        D.rules = a[0]; D.pieces = a[1].pieces || {}; var ks = Object.keys(D.pieces), left = ks.length;
        ks.forEach(function (k) { var im = new Image(); im.onload = im.onerror = function () { if (--left <= 0) { D.ready = true; try { if (root.MAP_GROUND) root.MAP_GROUND.key = ''; if (typeof root.render === 'function') root.render(); } catch (e) {} } };
          im.src = 'map_dead/' + String(D.pieces[k].file).replace(/[^\w.]/g, ''); D.img[k] = im; });
      }).catch(function (e) { D.err = String(e && e.message || e); });
    } catch (e) { D.err = String(e && e.message || e); }
  }
  function h32(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15; return h >>> 0; }
  function r01(seed, x, y, salt) { return h32(seed + ':' + x + ',' + y + ':' + salt) / 4294967296; }
  function valley() { return (typeof om !== 'undefined' && om && om.n && om.at) ? om : null; }

  /* WHERE PEOPLE LIVE: every town's ground (its foot) and the blocks round it, the real places, his home base */
  function livedIn(M, R) {
    var n = M.n, L = new Uint8Array(n * n), mark = function (x0, y0, x1, y1) { for (var y = Math.max(0, y0); y <= Math.min(n - 1, y1); y++) for (var x = Math.max(0, x0); x <= Math.min(n - 1, x1); x++) L[y * n + x] = 1; };
    try { var bs = root.ctBases ? root.ctBases() : null; for (var k in (bs || {})) { var b = bs[k]; if (!b) continue; var t = { name: k, x: b.x | 0, y: b.y | 0 }, f = null;
      try { f = root.townFoot ? root.townFoot(t) : null; } catch (e) { f = null; }
      if (f && f.n) mark(f.x0 - R, f.y0 - R, f.x0 + f.n - 1 + R, f.y0 + f.n - 1 + R); else mark(t.x - R - 1, t.y - R - 1, t.x + R + 1, t.y + R + 1); } } catch (e) {}
    try { var RP = root.BOH_REAL_PLACES; (RP && RP.cellsNow ? RP.cellsNow() : []).forEach(function (c) { mark((c.x | 0) - R, (c.y | 0) - R, (c.x | 0) + R, (c.y | 0) + R); }); } catch (e) {}
    try { var hr = root.BohemiaHomeMap && root.BohemiaHomeMap.rec ? root.BohemiaHomeMap.rec() : null, p = hr && hr.planted; if (p && isFinite(p.x)) mark((p.x | 0) - R, (p.y | 0) - R, (p.x | 0) + R, (p.y | 0) + R); } catch (e) {}
    return L;
  }
  function keyNow(M) {
    var s = String(M.seed) + '|' + (typeof WORLD_SEED === 'string' ? WORLD_SEED : '');
    try { var bs = root.ctBases ? root.ctBases() : null; for (var k in (bs || {})) if (bs[k]) s += '|' + k + (bs[k].x | 0) + ',' + (bs[k].y | 0); } catch (e) {}
    try { var hr = root.BohemiaHomeMap && root.BohemiaHomeMap.rec ? root.BohemiaHomeMap.rec() : null, p = hr && hr.planted; if (p) s += '|home' + (p.x | 0) + ',' + (p.y | 0); } catch (e) {}
    try { var RP = root.BOH_REAL_PLACES; if (RP && RP.cellsNow) s += '|rp' + RP.cellsNow().length; } catch (e) {}
    return s;
  }
  /* THE VALLEY'S DEAD, laid once per valley (and again when a town moves): one piece at most a block, by the block's own group */
  D.list = function () {
    var M = valley(), RU = D.rules; if (!M || !RU || !D.pieces) return [];
    var key = keyNow(M); if (key === D.key) return D.all;
    var n = M.n, lived = livedIn(M, RU.lived_r | 0), out = [], seed = String(h32(key.split('|').slice(0, 2).join('|'))), pits = [];
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var t = M.at(x, y); if (!t) continue;
      var gk = RU.districts[t.district], G = gk ? RU.groups[gk] : null; if (!G) continue;
      if (r01(seed, x, y, 'd') >= G.density) continue;
      var li = !!lived[y * n + x], ids = [], w = [], tot = 0;
      for (var id in G.mix) { var P = D.pieces[id]; if (!P || (li && !P.grave) || (RU.never_on_the_map || []).indexOf(id) >= 0) continue; ids.push(id); w.push(G.mix[id]); tot += G.mix[id]; }
      if (!tot) continue;
      var r = r01(seed, x, y, 'k') * tot, pick = ids[ids.length - 1]; for (var i = 0; i < ids.length; i++) { r -= w[i]; if (r < 0) { pick = ids[i]; break; } }
      if (pick === 'mass_grave') { var near = pits.some(function (q) { return Math.max(Math.abs(q[0] - x), Math.abs(q[1] - y)) <= (RU.once_r | 0); }); if (near) continue; pits.push([x, y]); }
      out.push({ x: x, y: y, fx: 0.2 + 0.6 * r01(seed, x, y, 'x'), fy: 0.2 + 0.6 * r01(seed, x, y, 'y'), id: pick, lived: li, group: gk });
    }
    D.key = key; D.all = out; return out;
  };
  function open() {
    try { return !!(D.on && typeof MODE !== 'undefined' && MODE === 'city' && !(typeof LOOK !== 'undefined' && LOOK.on) && !(typeof VISTA !== 'undefined' && VISTA) && !(typeof SKY !== 'undefined' && SKY)); } catch (e) { return false; }
  }
  function seen(x, y) { try { return typeof root.fogSeen !== 'function' || !!root.fogSeen(x, y); } catch (e) { return true; } }
  /* THE PAINTING STANDS IN FRONT: a tower painted on a block nearer the camera hides the ground behind it (the map's own depth read,
     mapDepthAt, the one that hides his men behind buildings); a piece whose ground or top is behind the painting is not drawn over it */
  /* and a body lies only on ground he can see: where the painting stands up at its ground point (a tower on its own block, or one in
     front of it), there is no ground there to lie on (measured 11/21: a body laid on a downtown block was drawn on the tower's face) */
  function standing(sx, sy, ox, oy) { try { var q = root.mapDepthAt ? root.mapDepthAt(sx, sy, ox, oy) : null; return !!(q && q.L > 0.15); } catch (e) { return false; } }
  function behind(sx, sy, d, cx, cy, ox, oy) {
    try { var q = root.mapDepthAt ? root.mapDepthAt(sx, sy, ox, oy) : null; if (!q || !(q.L > 0)) return false;
      var bx = q.bx + q.L, by = q.by + q.L; if (Math.floor(bx) === cx && Math.floor(by) === cy) return false; return bx + by > d + 0.08; } catch (e) { return false; }
  }

  D.draw = function (ox, oy) {
    var L = D.last; L.drew = 0; L.culled = 0; L.unseen = 0; L.on = [];
    if (!open()) return;
    var from = (D.rules && D.rules.from_tw) || 96; if (!(TW >= from)) return;
    load(); if (!D.ready) return;
    var t0 = performance.now();
    try {
      var all = D.list(), k = TW / (Math.SQRT2 * 36) * ((D.rules && D.rules.lift) || 2), ppm = 16, sm = g.imageSmoothingEnabled, M = 0;
      try { M = (root.MAP_GROUND && root.MAP_GROUND.M) || 0; } catch (e) { M = 0; }
      g.imageSmoothingEnabled = true;
      for (var i = 0; i < all.length; i++) {
        var q = all[i], P = D.pieces[q.id], im = D.img[q.id]; if (!P || !im || !im.complete || !im.naturalWidth) continue;
        var p = root.iso(q.x + q.fx, q.y + q.fy, ox, oy), s = k / ppm, rw = P.w * s, rh = P.h * s, rx = p.sx - P.anchor_px[0] * s, ry = p.sy - P.anchor_px[1] * s;
        if (rx > CVW + 2 * M || ry > CVH + 2 * M || rx + rw < -M || ry + rh < -M) { L.culled++; continue; }   /* the ground is painted a margin wider than the glass (__THE_MAP_GROUND_IS_PAINTED_ONCE__) */
        if (!seen(q.x, q.y)) { L.unseen++; continue; }
        var dd = q.x + q.fx + q.y + q.fy; if (standing(p.sx, p.sy - 1, ox, oy) || behind(p.sx, ry + rh * 0.25, dd, q.x, q.y, ox, oy)) { L.hidden++; continue; }
        g.drawImage(im, rx, ry, rw, rh); L.drew++;
        if (L.on.length < 400) L.on.push({ id: q.id, at: [q.x, q.y], lived: q.lived, r: [Math.round(rx), Math.round(ry), Math.round(rw), Math.round(rh)] });
      }
      g.imageSmoothingEnabled = sm;
    } catch (e) { D.err = String(e && e.message || e); }
    L.ms = Math.round((performance.now() - t0) * 100) / 100;
  };
})(window);
