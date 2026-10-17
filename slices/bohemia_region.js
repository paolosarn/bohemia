/* ==========================================================================
   THE REGION (RUN, 10/16/26, VAMILY [the map at Battle Brothers' size], rules 109 and 110)

   PAOLO 10/16: "our map has to be as big as fucking Battle Brothers and that's still not the case ... I don't know if
   we need to break the grid ... a larger grid or something ... I'm choosing Battle Brothers."

   MEASURED FIRST. The map's travel grid was the valley, 96 x 96 blocks (9,216 cells), and the camera stopped at its rim.
   Battle Brothers' world is about 140 x 140 tiles (community-measured: the game's world.nut SizeX/SizeY 140, a map
   tool counting 19,400 tiles; the same size every campaign; about seventeen settlements, Global Map, the wiki). And the
   picture of the land around the valley was already there, 496 blocks across: the map's own land painting (vbCore) runs
   200 blocks past every rim, with the Spring Mountains, Mt Charleston, Lake Mead and the roads out. It was a backdrop:
   nobody could walk on it and nothing lived there.

   NOW (this file, loaded after the map's own script, wrapping its functions by name so the valley's own behaviour is
   byte for byte what it was):
     - THE GRID BREAKS INTO TWO, his words: the valley keeps its 96 x 96 street grid, and around it a REGION grid of the
       same blocks, 496 x 496 (246,016 cells; Battle Brothers' is about 19,600), read off the land painting itself:
       open desert, roads (the I-15, the 95, the 93 out to the edge), rough hills, and what cannot be crossed (the lake,
       the peaks). The party walks off the valley's roads onto it and back.
     - A CROSSING TAKES DAYS: a block of open desert costs the street's own rough-going time, a road half that, hills
       nearly double. Rim to rim across the region is printed by the check.
     - PLACES OUT THERE ARE DESTINATIONS: twelve real ones around Las Vegas (Henderson, Boulder City, the Hoover Dam,
       the Lake Mead marina, Jean, Primm, Searchlight, Indian Springs, the Mt Charleston lodge, Pahrump, Moapa,
       Mesquite), set by their real bearing from the city and pulled onto their road or open ground, drawn as the
       map's own settlement art (placeholders, rule 101), and opened as a settlement screen on arrival, like any other.
     - THE CAMERA PULLS OUT TWICE AS FAR AND PANS OVER THE WHOLE REGION: the far stop shows about 200 blocks across
       (Battle Brothers' whole map is about 140 wide), the camera pans to the region's rim; the near stop is unchanged.
   ========================================================================== */
(function(){
  'use strict';
  if (typeof om === 'undefined' || typeof cityWalkable !== 'function') return;
  var R = window.BOH_REGION = { on: true, ready: false, N: 0, K: 0, D: 0, pass: null, places: [], steps: 0,
    mins: 0, version: 1 };

  /* the region's own blocks: 0 open ground, 1 road, 2 rough (hills, a wash), 3 cannot be crossed (the lake, a peak) */
  var COST = [1, PAVED_SPEED_FACTOR(), 1.8];
  function PAVED_SPEED_FACTOR(){ try { return (typeof PAVED_SPEED !== 'undefined' && PAVED_SPEED.factor) || 0.5; } catch(_e){ return 0.5; } }
  function inCity(x, y){ return x >= 0 && y >= 0 && x < om.n && y < om.n; }
  function inRegion(x, y){ return !!R.pass && x >= -R.K && y >= -R.K && x < R.N + R.K && y < R.N + R.K; }
  function passAt(x, y){ return inRegion(x, y) ? R.pass[(y + R.K) * R.D + (x + R.K)] : 3; }
  R.passAt = passAt; R.inCity = inCity;

  /* ---- the land arrives from the map's own painter (vbLand), with its passability ---- */
  var _vbLand = vbLand;
  vbLand = function(r){
    var out = _vbLand.apply(this, arguments);
    try {
      if (r && r.pass && r.D && r.seed === om.seed) {
        R.pass = r.pass; R.D = r.D; R.K = r.K; R.N = om.n; R.ready = true; R.compass = r.compass || null;
        placeTowns(r);
        try { if (typeof render === 'function') render(); } catch(_e){}
      }
    } catch(_e){}
    return out;
  };

  /* ---- the places: a real bearing and distance from the city, pulled onto ground he can stand on ---- */
  /* east / north in blocks past the city's middle; the map's own compass says which way is which (north is y = 0) */
  var TOWNS = [
    ['HENDERSON',          62,  -78, 'town'],
    ['BOULDER CITY',      122, -128, 'town'],
    ['HOOVER DAM',        178, -112, 'fortress'],
    ['LAKE MEAD MARINA',  150,  -30, 'camp'],
    ['JEAN',              -14, -150, 'camp'],
    ['PRIMM',             -30, -215, 'town'],
    ['SEARCHLIGHT',        64, -228, 'camp'],
    ['INDIAN SPRINGS',   -150,  150, 'fortress'],
    ['MT CHARLESTON LODGE',-130, 70, 'camp'],
    ['PAHRUMP',          -222,   10, 'town'],
    ['MOAPA',             118,  170, 'camp'],
    ['MESQUITE',          212,  218, 'town']
  ];
  function placeTowns(r){
    var C = r.compass || { n: 'y0', s: 'y1', e: 'x1', w: 'x0' }, sx = C.e === 'x1' ? 1 : -1, mid = (om.n - 1) / 2, lim = R.K - 8;
    R.places = [];
    TOWNS.forEach(function(t){
      var x = Math.round(mid + sx * t[1]), y = Math.round(mid - t[2]);
      x = Math.max(-lim, Math.min(om.n - 1 + lim, x)); y = Math.max(-lim, Math.min(om.n - 1 + lim, y));
      /* on its road when one runs within twelve blocks, else the nearest open ground; never in the city's own box */
      var best = null, bd = 1e9;
      for (var r2 = 0; r2 <= 24; r2++) for (var dy = -r2; dy <= r2; dy++) for (var dx = -r2; dx <= r2; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r2) continue;
        var px = x + dx, py = y + dy; if (inCity(px, py) || !inRegion(px, py)) continue;
        var p = passAt(px, py); if (p === 3) continue;
        var score = r2 + (p === 1 ? 0 : (r2 <= 12 ? 12 : 0)) + (p === 2 ? 6 : 0);
        if (score < bd) { bd = score; best = [px, py]; }
      }
      if (best) R.places.push({ name: t[0], x: best[0], y: best[1], tier: t[3], road: passAt(best[0], best[1]) === 1 });
    });
  }
  R.placeAt = function(x, y, rr){
    var best = null, bd = 1e9;
    R.places.forEach(function(p){ var d = Math.max(Math.abs(p.x - x), Math.abs(p.y - y));
      if (d <= (rr == null ? 1 : rr) && d < bd) { bd = d; best = { name: p.name, x: p.x, y: p.y, tier: p.tier, region: true }; } });
    return best;
  };

  /* ---- where he can stand, what a step costs ---- */
  var _walk = cityWalkable;
  cityWalkable = function(x, y){
    if (inCity(x, y)) return _walk(x, y);
    return R.on && R.ready && passAt(x, y) < 3;
  };
  var _mins = cityStepMins;
  cityStepMins = function(x, y){
    if (inCity(x, y) || !R.ready) return _mins(x, y);
    var base = _mins(x, y);   /* the street's own rough-going block, with the scout's multiplier */
    var p = passAt(x, y);
    var m = base * (p === 1 ? COST[1] : p === 2 ? COST[2] : COST[0]);
    return m;
  };

  /* ---- a step he actually took out there (counted where the party moves, not where a route is costed) ---- */
  var _step = stepOnce;
  stepOnce = function(di){
    var moved = _step.apply(this, arguments);
    try { if (moved && !inCity(city.x, city.y)) { R.steps++; R.lastOut = [city.x, city.y]; } } catch(_e){}
    return moved;
  };

  /* ---- the route: inside the valley exactly as before; anything that leaves it, by cost over both grids ---- */
  var _route = cityRoute;
  cityRoute = function(ax, ay, bx, by){
    if (!R.ready || (inCity(ax, ay) && inCity(bx, by))) return _route(ax, ay, bx, by);
    if (!cityWalkable(bx, by)) return null;
    return regionRoute(ax, ay, bx, by);
  };
  function stepCost(x, y){
    if (inCity(x, y)) return 1;   /* the valley's roads: its own fast going */
    var p = passAt(x, y); return p === 1 ? 1 : p === 2 ? 4 : 2;
  }
  function regionRoute(ax, ay, bx, by){
    var K = R.K, D = R.D, NN = D * D;
    var idx = function(x, y){ return (y + K) * D + (x + K); };
    var g = new Float32Array(NN).fill(Infinity), from = new Int32Array(NN).fill(-1), closed = new Uint8Array(NN);
    var heap = [], push = function(f, i){ heap.push([f, i]); var c = heap.length - 1;
      while (c > 0) { var p = (c - 1) >> 1; if (heap[p][0] <= heap[c][0]) break; var t = heap[p]; heap[p] = heap[c]; heap[c] = t; c = p; } };
    var pop = function(){ var top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; var c = 0;
      for (;;) { var l = 2 * c + 1, r = l + 1, m = c; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
        if (m === c) break; var t = heap[m]; heap[m] = heap[c]; heap[c] = t; c = m; } } return top; };
    var h = function(x, y){ return Math.max(Math.abs(x - bx), Math.abs(y - by)); };
    var s = idx(ax, ay), goal = idx(bx, by); g[s] = 0; push(h(ax, ay), s);
    var DIRS4 = (typeof DIRS !== 'undefined') ? DIRS : [[1,0],[-1,0],[0,1],[0,-1]];
    var n = 0;
    while (heap.length) {
      var cur = pop()[1]; if (closed[cur]) continue; closed[cur] = 1;
      if (cur === goal) break;
      if (++n > 400000) return null;
      var cx = (cur % D) - K, cy = ((cur / D) | 0) - K;
      for (var d = 0; d < DIRS4.length; d++) {
        var nx = cx + DIRS4[d][0], ny = cy + DIRS4[d][1];
        if (!inRegion(nx, ny) && !inCity(nx, ny)) continue;
        if (!cityWalkable(nx, ny)) continue;
        var ni = idx(nx, ny); if (closed[ni]) continue;
        var ng = g[cur] + stepCost(nx, ny);
        if (ng < g[ni]) { g[ni] = ng; from[ni] = cur; push(ng + h(nx, ny), ni); }
      }
    }
    if (from[goal] < 0 && goal !== s) return null;
    var path = [], c2 = goal;
    while (c2 !== -1) { path.push([(c2 % D) - K, ((c2 / D) | 0) - K]); if (c2 === s) break; c2 = from[c2]; }
    path.reverse();
    return path.length > 1 ? path : null;
  }
  R.route = regionRoute;

  /* ---- a tap out past the valley names a region block ---- */
  var _cell = CBcellAt;
  CBcellAt = function(sx, sy){
    var c = _cell(sx, sy); if (c || !R.ready) return c;
    var ox = Math.round(CVW / 2 - (city.x - city.y) * TW / 2 + panX), oy = Math.round(CVH / 2 - (city.x + city.y) * TH / 2 + panY);
    var dx = sx - ox, dy = sy - oy - TH / 2;
    var x = Math.round(dx / TW + dy / TH), y = Math.round(dy / TH - dx / TW);
    return inRegion(x, y) ? [x, y] : null;
  };

  /* ---- the camera pulls out twice as far as the valley's stop, and pans over the whole region ----
     The first cut fit all 496 blocks to the glass: on a phone held upright the region became a thin strip in a sea of
     sand. Battle Brothers' own camera does not show its whole world either; its far zoom shows part of it and you pan.
     So the far stop shows twice what the valley's did (about 200 blocks across, more than Battle Brothers' whole map is
     wide), and the camera pans to the region's rim. */
  var _zb = zoomBounds;
  zoomBounds = function(){
    var b = _zb();
    if (!R.ready) return b;
    var D = R.D, fitAll = Math.min(CVW / ((D + 1) * TW0), CVH / ((D + 1) * TH0)) * 0.96;
    return [Math.max(fitAll, b[0] * 0.5), b[1]];
  };
  var _cp = clampPan;
  clampPan = function(){
    if (!R.ready) return _cp();
    var D = R.D, hx2 = (D * TW0 * CZOOM) / 2 + CVW * 0.5, hy2 = (D * TH0 * CZOOM) / 2 + CVH * 0.5;
    panX = Math.max(-hx2, Math.min(hx2, panX)); panY = Math.max(-hy2, Math.min(hy2, panY));
  };

  /* ---- arrival: a region place opens as a settlement, the same screen as every other ---- */
  var _town = loopTownAt;
  loopTownAt = function(x, y, r){
    var t = _town(x, y, r); if (t) return t;
    return R.ready ? R.placeAt(x, y, r) : null;
  };

  /* ---- the places drawn: the map's own settlement art, named ---- */
  var _rc = renderCity;
  renderCity = function(){
    var out = _rc.apply(this, arguments);
    try { if (R.ready && typeof MODE !== 'undefined' && MODE === 'city') drawPlaces(); } catch(_e){}
    return out;
  };
  function drawPlaces(){
    var ox = Math.round(CVW / 2 - (city.x - city.y) * TW / 2 + panX), oy = Math.round(CVH / 2 - (city.x + city.y) * TH / 2 + panY);
    var drawn = 0, named = 0, boxes = [];
    g.save();
    R.places.forEach(function(p){
      var q = iso(p.x, p.y, ox, oy); if (q.sx < -60 || q.sx > CVW + 60 || q.sy < -60 || q.sy > CVH + 60) return;
      var foot = q.sy + TH / 2 + 6, ps = null;
      try { ps = mapBaseDraw(p.tier, p.name, q.sx, foot, false, mapArtBeat()); } catch(_e){ ps = null; }
      if (!ps) { g.fillStyle = 'rgba(14,11,8,0.6)'; g.beginPath(); g.ellipse(q.sx, foot - 4, 14, 5, 0, 0, 7); g.fill();
        g.fillStyle = '#c8a558'; g.fillRect(q.sx - 5, foot - 16, 10, 12); }
      var h = ps ? ps.height : 16;
      g.font = 'bold 10px ui-monospace, monospace'; g.textAlign = 'center';
      var w = g.measureText(p.name).width + 8, ty = Math.round(foot - h - 10);
      /* a name never sits on another: nudged up a line at a time, three tries, else the place stands unnamed */
      var bx = Math.round(q.sx - w / 2), free = false;
      for (var tries = 0; tries < 4 && !free; tries++) {
        free = boxes.every(function(b){ return bx + w <= b[0] || bx >= b[0] + b[2] || ty <= b[1] - 10 || ty - 10 >= b[1] + 3; });
        if (!free) ty -= 14; }
      drawn++;
      if (!free) return;
      boxes.push([bx, ty - 10, w]);
      g.fillStyle = 'rgba(14,11,8,0.82)'; g.fillRect(bx, ty - 10, Math.round(w), 13);
      g.fillStyle = '#e8dcc0'; g.fillText(p.name, Math.round(q.sx), ty);
      named++;
    });
    g.restore();
    R.drawn = drawn; R.named = named;
  }

  /* ---- what the map says out loud while he is out there ---- */
  R.where = function(){
    if (inCity(city.x, city.y)) return null;
    var p = passAt(city.x, city.y);
    return p === 1 ? 'THE ROAD OUT' : p === 2 ? 'THE HILLS' : 'THE DESERT';
  };

  /* ---- the four numbers, printed beside Battle Brothers' (rule 109c) ---- */
  R.numbers = function(){
    if (!R.ready) return null;
    var base = _mins(Math.floor(om.n / 2), Math.floor(om.n / 2));
    var crossOpen = R.D * base * COST[0], crossRoad = R.D * base * COST[1];
    var vb = (typeof ctBases === 'function' && ctBases()) ? Object.keys(ctBases()).length : 0;
    var zb = zoomBounds();
    return {
      tilesAcross: R.D, tiles: R.D * R.D, bbTilesAcross: 140, bbTiles: 19600,
      daysAcrossOpen: +(crossOpen / 1440).toFixed(1), daysAcrossRoad: +(crossRoad / 1440).toFixed(1), bbDaysAcross: null,
      settlements: vb + R.places.length, regionPlaces: R.places.length, bbSettlements: 17,
      zoomFar: +zb[0].toFixed(3), zoomNear: +zb[1].toFixed(2),
      farShowsBlocksAcross: Math.round(CVW / (TW0 * zb[0])), nearShowsBlocksAcross: +(CVW / (TW0 * zb[1])).toFixed(1)
    };
  };
})();
