/* ============================================================================
   BOHEMIA -- THE REGION'S LAND, READ (10/17/26, WORLD lane).  Row [the region], rules 109, 110, 46, 33, 77, 40g.

   engine/BOHEMIA_REGION_LAND.json is the real Las Vegas region on RUN's 496-block grid
   (tools/bohemia_world_region.py writes it; nothing in it is drawn). This file reads it
   for whoever paints or walks on it, in THE VALLEY'S OWN COORDINATES:
     x, y in blocks, the valley at 0..95, the region -200..295 (slices/bohemia_region.js).

   THE ONE THING IT KNOWS THAT THE DATA DOES NOT: the compass. The data is real (north is
   y = 0, east is +x). The valley rolls its east-west mirror per seed (vbCore: east is x1
   when the 15 runs west of the Strip, else x0), so when the compass says east is x0 this
   file mirrors x. y never mirrors: north is north on every seed, the painter's own rule.

   WHAT IT GIVES
     at(x, y, compass)        -> { code, kind, road, pass, minutes, speed }   rule 46's kind, rule 33's cost
     edgesAt(x, y, compass)   -> [n, e, s, w]  four typed edges (rule 77, TILES ARE LEGOS): what runs out of
                                 each side, symmetric by construction, so A's east is always B's west
     stitch(exits, compass)   -> the valley's rolled freeway exits joined to the real highways' portals, so a
                                 road out of the valley never ends in sand; returns the connector cells
     passGrid(compass)        -> Uint8Array D*D in RUN's layout and codes (0 open, 1 road, 2 rough, 3 cannot)
     places(compass), placeAt(x, y, r, compass), numbers()

   Headless-safe: no canvas, no DOM. In node: require() and pass the JSON (or call load() with no
   argument and it reads the file beside it). In a page: fetch the JSON and pass it to load().
   ============================================================================ */
(function (root) {
  'use strict';

  var FAMILY = { '.': 'desert', 'h': 'hills', '^': 'hills', '~': 'water', 's': 'shore', 'f': 'city', 'b': 'city',
    'i': 'city', 'a': 'city', 'p': 'city', 'l': 'city', 'g': 'city', 't': 'city', 'x': 'city', 'V': 'valley' };
  var ROADCLS = { '-': 0, 'F': 1, 'S': 2, 'D': 3 };

  function decodeRows(rows, D, map) {
    var out = new Uint8Array(D * D), j, i, k, n, c, run;
    for (j = 0; j < rows.length; j++) {
      var s = rows[j]; i = 0; k = j * D;
      for (n = 0; n < s.length;) {
        run = 0;
        while (s.charCodeAt(n) >= 48 && s.charCodeAt(n) <= 57) { run = run * 10 + (s.charCodeAt(n) - 48); n++; }
        if (!run) run = 1;
        c = map(s.charAt(n)); n++;
        while (run-- > 0) { out[k + i] = c; i++; }
      }
      if (i !== D) throw new Error('region row ' + j + ' decodes to ' + i + ' cells, not ' + D);
    }
    return out;
  }

  function load(json) {
    if (!json) {
      if (typeof require !== 'function') throw new Error('region land: pass the JSON in a page');
      json = require('./BOHEMIA_REGION_LAND.json');
    }
    var N = json.N, K = json.K, D = json.D;
    var CODES = Object.keys(json.legend);
    var codeIndex = {}; CODES.forEach(function (c, i) { codeIndex[c] = i + 1; });
    var KIND = decodeRows(json.rows, D, function (ch) { return codeIndex[ch] || 0; });
    var ROAD = decodeRows(json.roadRows, D, function (ch) { return ROADCLS[ch] || 0; });
    var speeds = json.speeds;
    var L = { json: json, N: N, K: K, D: D, metresPerCell: json.metresPerCell, extra: {} };

    function mirrored(compass) { return !!(compass && compass.e === 'x0'); }
    function realX(x, compass) { return mirrored(compass) ? (N - 1 - x) : x; }
    function inGrid(x, y) { return x >= -K && y >= -K && x < N + K && y < N + K; }
    function inValley(x, y) { return x >= 0 && y >= 0 && x < N && y < N; }
    function index(x, y, compass) { return (y + K) * D + (realX(x, compass) + K); }
    function key(compass) { return mirrored(compass) ? 'x0' : 'x1'; }

    function codeAt(x, y, compass) { if (!inGrid(x, y)) return null; return CODES[KIND[index(x, y, compass)] - 1] || null; }
    function roadAt(x, y, compass) {
      if (!inGrid(x, y)) return 0;
      var k = index(x, y, compass), ex = L.extra[key(compass)];
      var r = ROAD[k]; if (ex && ex[k]) r = r ? Math.min(r, ex[k]) : ex[k];
      return r;
    }
    function speedOf(code, road) {
      if (road === 1 || road === 2) return 'paved';
      if (road === 3) return 'dirt';
      if (code === '.') return 'open';
      if (code === 's') return 'wash';
      if (code === 'h') return 'hills';
      if (code === '~' || code === '^') return null;
      if (code === 'V' && speeds.valley) return 'valley';   /* the valley's own paved streets (10/18, one clock) */
      return 'streets';
    }
    function passOf(code, road) {
      if (road) return 1;
      var p = json.pass[code]; return p == null ? 3 : p;
    }
    L.at = function (x, y, compass) {
      var code = codeAt(x, y, compass); if (!code) return null;
      var road = roadAt(x, y, compass), sp = speedOf(code, road);
      return { x: x, y: y, code: code, kind: json.legend[code], road: road, pass: passOf(code, road),
        speed: sp, minutes: sp ? speeds[sp].minutesPerCell : null, water: code === '~', peak: code === '^', valley: code === 'V' };
    };
    /* rule 77: what runs out of each side. Two neighbours of one family share that family's edge; a road on both
       sides is a road edge (the lane lines continue); otherwise the edge is the pair, sorted, so it reads the same
       from either cell. 'rim' is the edge of the world. */
    function edgeBetween(x, y, nx, ny, compass) {
      var a = codeAt(x, y, compass), b = codeAt(nx, ny, compass);
      if (!a) return null; if (!b) return 'rim';
      if (roadAt(x, y, compass) && roadAt(nx, ny, compass)) return 'road';
      var fa = FAMILY[a], fb = FAMILY[b];
      if (fa === fb) return fa;
      return fa < fb ? fa + '|' + fb : fb + '|' + fa;
    }
    L.edgesAt = function (x, y, compass) {
      if (!inGrid(x, y)) return null;
      return [edgeBetween(x, y, x, y - 1, compass), edgeBetween(x, y, x + 1, y, compass),
        edgeBetween(x, y, x, y + 1, compass), edgeBetween(x, y, x - 1, y, compass)];
    };

    /* the valley's own freeway exits (vbCore's roads list: { edge, c, w, name }) joined to the real highways'
       portals on the same side. A connector is laid two blocks out, along the rim band, and in to the portal;
       with no portal within forty blocks the exit runs straight out to the world's edge, the painter's old way,
       and is reported as unstitched so the gate can count it. */
    L.stitch = function (exits, compass) {
      var ex = {}, out = [], m = mirrored(compass);
      function flip(edge) { return m ? (edge === 'x0' ? 'x1' : edge === 'x1' ? 'x0' : edge) : edge; }
      var portals = (json.portals || []).map(function (p) { return { road: p.road, cls: p.cls, edge: flip(p.edge), x: m ? N - 1 - p.x : p.x, y: p.y }; });
      function lay(x, y, cls) { if (!inGrid(x, y) || inValley(x, y)) return; var k = index(x, y, compass); if (!ex[k] || cls < ex[k]) ex[k] = cls; out.push({ x: x, y: y, cls: cls }); }
      (exits || []).forEach(function (e) {
        var edge = e.edge, c = Math.round((e.c || 0) - 0.5), cls = 1;
        var along = edge[0] === 'x' ? 'y' : 'x';
        var ox = edge === 'x0' ? -1 : edge === 'x1' ? 1 : 0, oy = edge === 'y0' ? -1 : edge === 'y1' ? 1 : 0;
        var sx = edge === 'x0' ? -1 : edge === 'x1' ? N : c, sy = edge === 'y0' ? -1 : edge === 'y1' ? N : c;
        var best = null, bd = 1e9;
        portals.forEach(function (p) { if (p.edge !== edge) return; var d = Math.abs((along === 'x' ? p.x : p.y) - c); if (d < bd) { bd = d; best = p; } });
        if (!best || bd > 40) {
          var t; for (t = 0; t < K; t++) lay(sx + ox * t, sy + oy * t, 1);
          out.push({ unstitched: true, edge: edge, c: c, name: e.name || null });
          return;
        }
        cls = best.cls;
        var pc = along === 'x' ? best.x : best.y, step = pc > c ? 1 : -1, i;
        for (i = 0; i <= 2; i++) lay(sx + ox * i, sy + oy * i, cls);                    /* out two */
        for (i = c; i !== pc; i += step) lay(along === 'x' ? i : sx + ox * 2, along === 'x' ? sy + oy * 2 : i, cls);   /* along the band */
        for (i = 2; i >= 0; i--) lay(along === 'x' ? pc : sx + ox * i, along === 'x' ? sy + oy * i : pc, cls);         /* in to the portal */
        out.push({ stitched: true, edge: edge, c: c, to: best.road, cells: Math.abs(pc - c) + 6 });
      });
      L.extra[key(compass)] = ex;
      return out;
    };

    L.passGrid = function (compass) {
      var P = new Uint8Array(D * D), x, y, ex = L.extra[key(compass)];
      for (y = -K; y < N + K; y++) for (x = -K; x < N + K; x++) {
        var k = index(x, y, compass), code = CODES[KIND[k] - 1];
        var road = ROAD[k]; if (ex && ex[k]) road = road ? Math.min(road, ex[k]) : ex[k];
        P[(y + K) * D + (x + K)] = passOf(code, road);
      }
      return P;
    };
    L.places = function (compass) {
      return json.places.map(function (p) { var q = {}; for (var k in p) q[k] = p[k]; q.x = mirrored(compass) ? N - 1 - p.x : p.x; return q; });
    };
    L.placeAt = function (x, y, r, compass) {
      var best = null, bd = 1e9;
      L.places(compass).forEach(function (p) { var d = Math.max(Math.abs(p.x - x), Math.abs(p.y - y)); if (d <= (r == null ? 1 : r) && d < bd) { bd = d; best = p; } });
      return best;
    };
    L.beyond = function (compass) {
      return json.beyond.map(function (b) { var q = {}; for (var k in b) q[k] = b[k]; if (q.rimX != null) q.rimX = mirrored(compass) ? N - 1 - b.rimX : b.rimX; return q; });
    };
    L.portals = function (compass) {
      var m = mirrored(compass);
      return json.portals.map(function (p) { return { road: p.road, cls: p.cls, x: m ? N - 1 - p.x : p.x, y: p.y,
        edge: m ? (p.edge === 'x0' ? 'x1' : p.edge === 'x1' ? 'x0' : p.edge) : p.edge }; });
    };
    L.numbers = function () { return json.numbers; };
    L.inGrid = inGrid; L.inValley = inValley; L.mirrored = mirrored;
    return L;
  }

  var API = { load: load, FAMILY: FAMILY };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.BohemiaRegionLand = API;
})(typeof window !== 'undefined' ? window : this);
