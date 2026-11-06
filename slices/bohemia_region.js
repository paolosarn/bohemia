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
  COST[3] = Infinity; COST[4] = 3.0;   /* 4: a peak, crossed at the mountain pace (WORLD 11/2, ask line 288; the land's speeds.mountain) */
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
        R.lastLand = r;
        if (!adoptRealLand(r)) placeTowns(r);
        try { if (typeof render === 'function') render(); } catch(_e){}
      }
    } catch(_e){}
    return out;
  };
  /* __THE_REGION_NEVER_MISSES_THE_LAND__ (WORLD 10/25, found driving [the PC playtest: the jobs' part]): MEASURED on the demo, the
     land's painting came back from its worker 3 s after boot, BEFORE this file had wrapped vbLand, and the region then never turned
     on (BOH_REGION.ready false for the whole sitting: no PRIMM, no HOOVER DAM, no road out; three runs in five on this box). The
     land is asked once more, quietly, the same picture painted again into the wrapper; nothing is cleared while it comes. */
  try {
    if (typeof VB !== 'undefined' && VB.day && !VB.busy && !R.ready && typeof vbInput === 'function') {
      R.reasked = true;
      if (VB.worker) { VB.asked = performance.now(); VB.worker.postMessage(vbInput()); }
      else if (typeof vbCore === 'function') setTimeout(function(){ vbLand(vbCore(vbInput())); }, 0);
    }
  } catch(_e){}

  /* ---- THE REAL LAND (RUN 10/18, round two; WORLD [the region] c6df0bd + c1aaeb8, engine/BOHEMIA_REGION_LAND.json) ----
     WORLD wrote the real Las Vegas region on this grid (the lake east on every seed, the highways in three classes, the
     real places at their real kilometres) and the pass grid in this file's own codes, so the swap is: the party walks on
     WORLD's land, the twelve made-up TOWNS give way to its places, and a block costs the data's minutes.
     THE ONE SCALE NUMBER (the coordinator at AM: 'settle it with WORLD, one number') was already law and WORLD settled it
     (c1aaeb8, laws/BOHEMIA_ADDENDUM_VALLEY_SCALE_LAW_7_6_26.md): A BLOCK IS 384 m OF REAL GROUND (96 m drawn, the 7/6
     law's 1:4), the region 190 km across, and a block costs THE VALLEY'S OWN MINUTES on the valley's own 1,440-minute
     clock (10.752 open, half that on a road, 1.8 times in the hills or a wash). So out there is the same clock as in
     here: the data's minutes are used as they come, nothing scaled. What that gives: the real I-15 rim to rim 3.05 days,
     the 95 to the 93 3.38, open ground straight 3.7; Battle Brothers 2 to 4 (players' reports, EYES 10/17).
     (This round first picked 333 m and a twelve-hour marching day; WORLD's ruling landed the same hour, it is the law's,
     and this file follows it.) ECONOMY's 'four times too close' (its page 3c) was round one's implied 96 m block.
     The painter keeps painting its own land until COOK's tiles come; where the two disagree the party walks on the real
     one. Until the data arrives (a fetch), or if it never does, round one's land and twelve TOWNS stand as they were. */
  var CLOCK_PER_MARCH = 1;   /* the data's minutes are the valley's clock minutes (WORLD c1aaeb8) */
  R.metresPerBlock = 384; R.real = false; R.land = null;
  (function loadRealLand(){
    try {
      if (typeof document === 'undefined' || typeof fetch !== 'function') return;
      var s = document.createElement('script'); s.src = '../engine/bohemia_region_land.js';
      s.onload = function(){
        fetch('../engine/BOHEMIA_REGION_LAND.json').then(function(r){ return r.json(); }).then(function(j){
          if (typeof BohemiaRegionLand === 'undefined') return;
          R.land = BohemiaRegionLand.load(j); R.metresPerBlock = R.land.metresPerCell || 384;
          if (R.lastLand && adoptRealLand(R.lastLand)) { try { if (typeof render === 'function') render(); } catch(_e){} }
        }).catch(function(){});
      };
      (document.head || document.documentElement).appendChild(s);
    } catch(_e){}
  })();
  /* ==== __THE_PASSES__ (WORLD 11/2 round 3, ask line 303, rule 310; Paolo 11/2: 'there should always be, in the middle of any
     mountain outside of Vegas, a street going out from it, so I'm confused why I had to walk all the way across'). The real roads
     through the ranges were already on the region from real coordinates (tools/bohemia_world_region.py: I-15 north past Apex and
     south past Jean to Primm, US-95 north-west past Indian Springs and south-east to Searchlight, I-11 / US-93 through the River
     Mountains to Boulder City and the dam, NV-160 over Mountain Springs to Pahrump, NV-159 past Red Rock, NV-157 up Kyle Canyon,
     NV-147 Lake Mead Boulevard through the gap by Frenchman and Sunrise), and each meets the valley's box at its PORTAL. But the
     valley rolls its own rim, and where a portal met the rim's mountain or its open ground there was no road on the valley's side:
     the walk crossed the mountain to reach the pass road. NOW each portal is joined, through the rim, to the nearest of the valley's
     own roads: the shortest way over the rim's mountain and open ground (straight in first) becomes road, the road the pass comes
     down (t.passRoad names it, t.passWas keeps what it was). A portal that lands on the valley's road already costs nothing. ==== */
  function cutThePasses(C){
    var N = om.n, out = [], CP = (typeof CITY_PAVED !== 'undefined') ? CITY_PAVED : { freeway: 1, arterial: 1, strip: 1, beltway: 1, interchange: 1 };
    var soft = function(d){ return d === 'mountain' || (typeof TERRAIN_GOING !== 'undefined' && !!TERRAIN_GOING[d]); };
    var P = (R.land && R.land.portals) ? R.land.portals(C) : [];
    P.forEach(function(p){
      var sx = Math.max(0, Math.min(N - 1, p.x)), sy = Math.max(0, Math.min(N - 1, p.y)), t0 = om.at(sx, sy);
      if (!t0) return;
      if (!CP[t0.district] && !soft(t0.district) && !t0.passRoad) {   /* the portal lands on a works or a farm: the nearest block beside it along the edge that is road or ground */
        var lx = (p.y < 0 || p.y >= N) ? 1 : 0, ly = 1 - lx;
        for (var o = 1; o <= 4; o++) { var ok2 = false; [o, -o].forEach(function(s2){ if (ok2) return; var ax = sx + lx * s2, ay = sy + ly * s2, ta = om.at(ax, ay);
          if (ta && (CP[ta.district] || soft(ta.district) || ta.passRoad)) { sx = ax; sy = ay; t0 = ta; ok2 = true; } }); if (ok2) break; }
      }
      if (t0.passRoad) { out.push({ road: p.road, x: sx, y: sy, cut: 0, shared: t0.passRoad }); return; }
      if (CP[t0.district]) { out.push({ road: p.road, x: sx, y: sy, cut: 0 }); return; }
      if (!soft(t0.district)) { out.push({ road: p.road, x: sx, y: sy, cut: -1, why: t0.district }); return; }
      var D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]], inw = p.x < 0 ? 0 : p.x >= N ? 1 : p.y < 0 ? 2 : 3;
      D4 = [D4[inw]].concat(D4.filter(function(_d, i){ return i !== inw; }));
      var from = {}, q = [[sx, sy]], seen = {}, hit = null; seen[sx + ',' + sy] = 1;
      for (var h = 0; h < q.length && !hit && h < 6000; h++) { var c = q[h];
        for (var d = 0; d < 4; d++) { var nx = c[0] + D4[d][0], ny = c[1] + D4[d][1], k = nx + ',' + ny;
          if (nx < 0 || ny < 0 || nx >= N || ny >= N || seen[k]) continue; seen[k] = 1;
          var t = om.at(nx, ny); if (!t) continue;
          if (CP[t.district]) { hit = c; break; }
          if (!soft(t.district)) continue;
          from[k] = c; q.push([nx, ny]); } }
      if (!hit) { out.push({ road: p.road, x: sx, y: sy, cut: -1, why: 'no road within reach' }); return; }
      var path = [], cur = hit; while (cur) { path.push(cur); cur = from[cur[0] + ',' + cur[1]]; }
      var mt = 0; path.forEach(function(b){ var t = om.at(b[0], b[1]); if (t.district === 'mountain') mt++; t.passWas = t.district; t.passRoad = p.road; t.district = 'arterial'; });
      out.push({ road: p.road, x: sx, y: sy, cut: path.length, mountain: mt });
    });
    if (out.some(function(o){ return o.cut > 0; })) {   /* the painting, the tiles and the join masks read the districts once: again */
      try { VB_STF.seed = null; } catch(_e){} try { VBC.key = null; VBT.tiles.clear(); } catch(_e){} try { MAP_GROUND.key = ''; } catch(_e){}
    }
    return out;
  }
  function adoptRealLand(r){
    var L = R.land; if (!L || L.D !== r.D || L.K !== r.K || L.N !== om.n) return false;
    var C = r.compass || { n: 'y0', s: 'y1', e: 'x1', w: 'x0' };
    try { R.stitched = L.stitch(r.roads || [], C); } catch(_e){ R.stitched = null; }
    R.pass = L.passGrid(C); R.compass = C; R.real = true;
    try { R.passes = cutThePasses(C); } catch(_e){ R.passes = { err: String(_e && _e.message || _e) }; }   /* __THE_PASSES__ */
    R.places = L.places(C).filter(function(p){ return !inCity(p.x, p.y) && inRegion(p.x, p.y) && passAt(p.x, p.y) < 3; })
      .map(function(p){ return { name: p.name, x: p.x, y: p.y, tier: p.tier, role: p.role, km: p.km, road: passAt(p.x, p.y) === 1, what: p.what }; });
    return true;
  }
  /* the minutes on the clock for one block out there, the real land's way */
  function realMins(x, y){
    var a = R.land.at(x, y, R.compass); if (!a || a.minutes == null) return null;
    var dm = 1;
    try { if (typeof BohemiaFollowers !== 'undefined' && typeof CT_FOLLOWERS !== 'undefined') dm = BohemiaFollowers.travelMultiplier(CT_FOLLOWERS); } catch(_e){}
    /* WORLD 4 [a job's time is the truth]: the caravan's pace out here too (the valley's own clock carries it; out past the valley a
       caravan walked at a man's pace, so 'about 20 hours to PRIMM' was walked in 14) */
    try { if (window.BohemiaJobKinds) dm *= BohemiaJobKinds.pace(); } catch(_e){}
    return a.minutes * CLOCK_PER_MARCH * dm;
  }

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
        var p = passAt(px, py); if (p === 3 || p === 4) continue;   /* never a town on a peak */
        var score = r2 + (p === 1 ? 0 : (r2 <= 12 ? 12 : 0)) + (p === 2 ? 6 : 0);
        if (score < bd) { bd = score; best = [px, py]; }
      }
      if (best) R.places.push({ name: t[0], x: best[0], y: best[1], tier: t[3], road: passAt(best[0], best[1]) === 1 });
    });
  }
  R.placeAt = function(x, y, rr){
    var best = null, bd = 1e9;
    R.places.forEach(function(p){ var d = Math.max(Math.abs(p.x - x), Math.abs(p.y - y));
      if (d <= (rr == null ? 1 : rr) && d < bd) { bd = d; best = { name: p.name, x: p.x, y: p.y, tier: p.tier, role: p.role || 'base', region: true }; } });
    return best;
  };

  /* ---- where he can stand, what a step costs ---- */
  var _walk = cityWalkable;
  cityWalkable = function(x, y){
    if (inCity(x, y)) return _walk(x, y);
    var p = passAt(x, y); return R.on && R.ready && (p < 3 || (p === 4 && !(typeof TERRAIN_GOING !== 'undefined' && TERRAIN_GOING.on === false)));   /* __OVER_THE_MOUNTAIN__: a peak is slow going, never a wall */
  };
  var _mins = cityStepMins;
  cityStepMins = function(x, y){
    if (inCity(x, y) || !R.ready) return _mins(x, y);
    if (R.real) { var rm = realMins(x, y); if (rm != null) return rm; }
    var base = _mins(x, y);   /* the street's own rough-going block, with the scout's multiplier */
    var p = passAt(x, y);
    var m = base * (p === 1 ? COST[1] : p === 2 ? COST[2] : p === 4 ? COST[4] : COST[0]);
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
    if (inCity(x, y)) { try { var tv = om.at(x, y), pf = (typeof PAVED_SPEED !== 'undefined' && PAVED_SPEED.factor) || 0.5;   /* __OVER_THE_MOUNTAIN__: the valley's own going, a road 1 */
      if (tv && typeof TERRAIN_GOING !== 'undefined' && TERRAIN_GOING.on !== false && TERRAIN_GOING[tv.district] && !(typeof CITY_PAVED !== 'undefined' && CITY_PAVED[tv.district])) return TERRAIN_GOING[tv.district] / pf; } catch (_e) {} return 1; }
    if (R.real) { var a = R.land.at(x, y, R.compass); if (a && a.minutes != null) return a.minutes / 5.376; }   /* a road block is 1 */
    var p = passAt(x, y); return p === 1 ? 1 : p === 2 ? 4 : p === 4 ? 6 : 2;
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
  R.valleyFar = function(){ return _zb()[0]; };   /* the valley's own far stop, the far end he liked (rule 104f) */
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

  /* ---- __THE_ROADS_OUT_JOIN__ (RUN [the districts connect on the map], 10/18) ----
     PAOLO 10/18: "doesn't look like shit's connected." MEASURED: 31 of the 34 places out here stand ON a road
     (3,298 road blocks in the pass grid), but the roads were only the land picture's faint lines, so a town read
     as a stamp on sand. Now the roads are drawn the way the valley's streets are (__THE_STREETS_JOIN__): one dark
     band block to block, joined to the valley's own roads at the rim, and the three places off a road get a dirt
     track to the nearest one. Painted inside the cached ground, so it costs nothing while the camera slides. */
  var RJ = { key: null, segs: null, tracks: null };
  function roadsOutBuild(){
    if (RJ.key === R.pass) return;
    RJ.key = R.pass; RJ.segs = []; RJ.tracks = [];
    var J = (typeof STREETS_JOIN !== 'undefined') ? STREETS_JOIN.J : { freeway: 1, arterial: 1 };
    var isRoad = function(x, y){ if (inCity(x, y)) { var t = om.at(x, y); return !!(t && J[t.district]); } return passAt(x, y) === 1; };
    /* each block draws from the middle of each road edge it shares: a block with two links at a right angle draws
       the straight cut between the two edge middles, so a staircase of blocks reads as one diagonal road; any other
       block draws its links through its own middle. The valley's own blocks are the valley's (__THE_STREETS_JOIN__);
       only the half of a rim link on this side is drawn here. */
    var NB = [[1,0],[-1,0],[0,1],[0,-1]];
    for (var y = -R.K; y < R.N + R.K; y++) for (var x = -R.K; x < R.N + R.K; x++) {
      if (inCity(x, y) || !isRoad(x, y)) continue;
      var ln = [];
      for (var k = 0; k < 4; k++) if (isRoad(x + NB[k][0], y + NB[k][1])) ln.push([x + NB[k][0] / 2, y + NB[k][1] / 2]);
      if (ln.length === 2 && ln[0][0] !== ln[1][0] && ln[0][1] !== ln[1][1]) { RJ.segs.push([ln[0][0], ln[0][1], ln[1][0], ln[1][1]]); continue; }
      for (var m = 0; m < ln.length; m++) RJ.segs.push([x, y, ln[m][0], ln[m][1]]);
    }
    R.places.forEach(function(p){
      if (passAt(p.x, p.y) === 1) return;
      var best = null, bd = 1e9;
      for (var dy = -40; dy <= 40; dy++) for (var dx = -40; dx <= 40; dx++) {
        var d = Math.abs(dx) + Math.abs(dy); if (d >= bd) continue;
        if (isRoad(p.x + dx, p.y + dy)) { bd = d; best = [p.x + dx, p.y + dy]; } }
      if (!best) return;
      var path = null; try { path = regionRoute(p.x, p.y, best[0], best[1]); } catch(_e){}
      if (path) RJ.tracks.push(path);
    });
    R.roadsOut = { segments: RJ.segs.length, tracks: RJ.tracks.length };
  }
  R.drawRoads = function(ox, oy, night){
    if (!R.ready || !R.pass || window.__STREETS_OFF) return;
    roadsOutBuild();
    var C = (typeof STREETS_JOIN !== 'undefined') ? (night ? STREETS_JOIN.night : STREETS_JOIN.day) : { asph: '#34322f', edge: '#a39a84' };
    var ctr = function(x, y){ var q = iso(x, y, ox, oy); return [q.sx, q.sy + TH / 2]; };
    var w = Math.max(1.2, TW * 0.17), kb = TW >= 6 ? Math.max(1, Math.round(TW * 0.05)) : 0;
    var path = function(){ g.beginPath();
      for (var i = 0; i < RJ.segs.length; i++) { var s = RJ.segs[i], a = ctr(s[0], s[1]), b = ctr(s[2], s[3]);
        if ((a[0] < -240 && b[0] < -240) || (a[0] > CVW + 240 && b[0] > CVW + 240) || (a[1] < -240 && b[1] < -240) || (a[1] > CVH + 240 && b[1] > CVH + 240)) continue;
        g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); } };
    g.save(); g.lineCap = 'square'; g.globalAlpha = 1;
    if (kb) { g.strokeStyle = C.edge; g.lineWidth = w + 2 * kb; path(); g.stroke(); }
    g.strokeStyle = C.asph; g.lineWidth = w; path(); g.stroke();
    /* the tracks: packed dirt, dashed, half the road's width */
    g.strokeStyle = night ? '#4a3e2c' : '#7a6444'; g.lineWidth = Math.max(1, w * 0.6); g.setLineDash([Math.max(2, TW * 0.4), Math.max(1.5, TW * 0.25)]);
    g.beginPath();
    RJ.tracks.forEach(function(t){ for (var i = 0; i < t.length; i++) { var c = ctr(t[i][0], t[i][1]); if (i) g.lineTo(c[0], c[1]); else g.moveTo(c[0], c[1]); } });
    g.stroke(); g.restore();
  };

  /* ---- the places drawn: the map's own settlement art, named ---- */
  var _rc = renderCity;
  R.landAfterPlaces = true;   /* RUN 10/26 (__NO_NAME_COVERS_ANOTHER__, [eyes: names on names]): the land's names are painted after these places */
  renderCity = function(){
    var out = _rc.apply(this, arguments);
    try { if (R.ready && typeof MODE !== 'undefined' && MODE === 'city') { landmarkTick(); drawLandmarks(); } } catch(_e){ LM.err = String(_e && _e.message || _e); }   /* __SEVEN_MAGIC_MOUNTAINS__: under the places' names */
    try { if (R.ready && typeof MODE !== 'undefined' && MODE === 'city') drawPlaces(); } catch(_e){}
    try { if (window.mapNamesLate) window.mapNamesLate(); } catch(_e){}   /* RUN 10/26: then the land's names, which step aside for every place */
    return out;
  };
  function drawPlaces(){
    var ox = Math.round(CVW / 2 - (city.x - city.y) * TW / 2 + panX), oy = Math.round(CVH / 2 - (city.x + city.y) * TH / 2 + panY);
    var drawn = 0, named = 0, boxes = [], jobNamed = 0, names = [];
    g.save();
    R.places.forEach(function(p){
      if (window.fogHides && window.fogHides(p.x, p.y)) return;   /* RUN 10/25 __A_FRESH_START_AND_A_FOG_OF_WAR__: not on his map yet */
      var q = iso(p.x, p.y, ox, oy); if (q.sx < -60 || q.sx > CVW + 60 || q.sy < -60 || q.sy > CVH + 60) return;
      var foot = q.sy + TH / 2 + 6, ps = null;
      try { ps = mapBaseDraw(p.tier, p.name, q.sx, foot, false, mapArtBeat()); } catch(_e){ ps = null; }
      if (!ps) { g.fillStyle = 'rgba(14,11,8,0.6)'; g.beginPath(); g.ellipse(q.sx, foot - 4, 14, 5, 0, 0, 7); g.fill();
        g.fillStyle = '#c8a558'; g.fillRect(q.sx - 5, foot - 16, 10, 12); }
      /* __A_JOB_NAMES_ITS_PLACE__ (WORLD, rule 164 item 3): a place a held job names is always named, lit, and the one it sends
         him to next wears the lit ring (slices/bohemia_job_kinds.js) */
      var job = null; try { job = (window.BohemiaJobKinds && BohemiaJobKinds.names) ? BohemiaJobKinds.names(p.name) : null; } catch(_e){}
      if (job === 'next') { g.save(); g.globalAlpha = 0.55 + 0.35 * ((mapArtBeat() % 2) ? 1 : 0); g.strokeStyle = '#f0b44c'; g.lineWidth = 2;
        g.beginPath(); g.ellipse(q.sx, foot - 2, 30, 11, 0, 0, 7); g.stroke(); g.restore(); }
      /* WORLD [eyes: a place that is nothing] (EYES round 2, new 18: 'a click on SLOAN... on arrival nothing opens'): MEASURED, a
         click on a place's name or building out here walked to the ground under the finger (SLOAN's name: block 50,96, six blocks
         off); the place now answers a tap the way a valley town does (the map's MAP_TOWN_HIT: its building, then its name), so the
         click goes to its gate and its screen opens */
      var bw = (ps && ps.width) || 40, bh = ps ? ps.height : 16, hitE = { name: p.name, x: p.x, y: p.y, plate: null, region: true,
        bld: { x: q.sx - bw / 2, y: foot - bh, w: bw, h: bh + 8 } };
      try { MAP_TOWN_HIT.push(hitE); } catch(_e){}
      names.push({ p: p, q: q, foot: foot, h: bh, job: job, hit: hitE });
      drawn++;
    });
    /* THE NAMES AFTER EVERY BUILDING, a job's places first (WORLD [eyes: a place that is nothing], EYES round 2: 'PRIMM's own name
       sits under IVANPAH SOLAR's plate'): a building drawn later never covers a name, and the place a job names keeps its spot;
       a neighbour moves up around it */
    names.sort(function(a, b){ return (b.job ? 1 : 0) - (a.job ? 1 : 0); });
    names.forEach(function(n){
      var p = n.p, q = n.q, job = n.job;
      g.font = 'bold 10px ui-monospace, monospace'; g.textAlign = 'center';
      var w = g.measureText(p.name).width + 8, ty = Math.round(n.foot - n.h - 10);
      /* a name never sits on another: nudged up a line at a time, three tries, else the place stands unnamed */
      var bx = Math.round(q.sx - w / 2), free = false;
      for (var tries = 0; tries < 4 && !free; tries++) {
        /* a name is 13 tall, from ty - 10 to ty + 3 (WORLD 10/25: the test let two overlap by up to 10, PRIMM under IVANPAH SOLAR) */
        free = boxes.every(function(b){ return bx + w <= b[0] || bx >= b[0] + b[2] || ty + 3 <= b[1] || ty - 10 >= b[1] + 13; })
          && (!window.mapNameFree || window.mapNameFree([bx, ty - 10, w, 13]));   /* RUN 10/26 (__NO_NAME_COVERS_ANOTHER__): never on a town's plate, his crew or the phone */
        if (!free) ty -= 14; }
      if (!free && !job) return;
      boxes.push([bx, ty - 10, w, p.name]);
      try { if (window.mapNameTake) window.mapNameTake([bx, ty - 10, w, 13], p.name, 'place'); } catch(_e){}
      n.hit.plate = { x: bx, y: ty - 10, w: w, h: 13 };
      g.fillStyle = 'rgba(14,11,8,0.82)'; g.fillRect(bx, ty - 10, Math.round(w), 13);
      g.fillStyle = job ? '#ffd27a' : '#e8dcc0'; g.fillText(p.name, Math.round(q.sx), ty);
      if (job) jobNamed++;
      named++;
    });
    g.restore();
    R.drawn = drawn; R.named = named; R.jobNamed = jobNamed; R.nameBoxes = boxes;
  }

  /* ==== __SEVEN_MAGIC_MOUNTAINS__ (the coordinator 11/5, VAMILY rule 410, ask line 459; Paolo 11/5: 'Las Vegas actually has an
     art exhibit like the seven magic mountains... definitely implement this in the game'). The real piece (Ugo Rondinone, 2016):
     seven stacks of 33 painted limestone boulders, 25 to 35 feet tall, beside Las Vegas Boulevard between Sloan and Jean, at
     35.839 N, 115.271 W. THE FIRST LANDMARK: not a settlement (no screen, no parties, never on the jobs, never in R.places); a
     thing in the desert he sees from far off and walks to. The data is records/target/bb/landmarks.json (a modder adds the next).
       SEEN FROM FAR: once he is within seeBlocks (16, about 6 km) it stands through the fog for the rest of the game (the fog's
         own memory keeps it: its block is cleared like a town's under REVEAL THE TOWNS).
       CLIMB IT AND LOOK: on the stack the horizon is about 12 km out on the flat, so arriving lifts the fog lookBlocks (30) round
         it, once a game (Battle Brothers' high place that shows the land round it, at the real distance).
       A POST ON THE FEED the first time he stands on it (draft words).
     THE LOOK: drawn from its own boulders, the real count (7 stacks, 33 stones), the day-glo paint a third of the way to the
     playa's dust because nobody repaints it now, a shadow on the sand, darker at night. Its final picture is COOK FOUR's golden
     piece (rule 408); the stacks, the count, the spot and what it does stay. ==== */
  var LM = R.landmarks = { list: [], loaded: false, drawn: 0, named: 0, posts: 0, st: { seen: {}, climbed: {} }, key: 'bohemia.landmarks.v1' };
  try { var lmSt = JSON.parse(localStorage.getItem(LM.key) || 'null'); if (lmSt && lmSt.seen && lmSt.climbed) LM.st = lmSt; } catch(_e){}
  function lmSave(){ try { localStorage.setItem(LM.key, JSON.stringify(LM.st)); } catch(_e){} }
  R.landmarksUse = function(list){ LM.list = (list || []).slice(); LM.loaded = true; };   /* the check's door, and the loader's */
  (function loadLandmarks(){
    try {
      if (typeof fetch !== 'function') return;
      fetch('../records/target/bb/landmarks.json').then(function(r){ return r.json(); }).then(function(j){
        R.landmarksUse((j && j.landmarks) || []);
        try { if (typeof render === 'function') render(); } catch(_e){}
      }).catch(function(){});
    } catch(_e){}
  })();
  /* a new game's map has seen nothing and climbed nothing (the fog's own new game) */
  try {
    if (typeof fogNewGame === 'function') { var _fng = fogNewGame;
      fogNewGame = function(){ LM.st = { seen: {}, climbed: {} }; lmSave(); return _fng.apply(this, arguments); }; }
  } catch(_e){}
  function lmXY(m){ var C = R.compass || { e: 'x1' }; return { x: C.e === 'x0' ? om.n - 1 - m.x : m.x, y: m.y }; }
  R.landmarkAt = function(id){ for (var i = 0; i < LM.list.length; i++) if (LM.list[i].id === id) { var p = lmXY(LM.list[i]); return { id: id, name: LM.list[i].name, x: p.x, y: p.y }; } return null; };
  function landmarkTick(){
    if (!LM.list.length || typeof city === 'undefined') return;
    var cx = city.x, cy = city.y;
    LM.list.forEach(function(m){
      var p = lmXY(m), d = Math.sqrt((p.x - cx) * (p.x - cx) + (p.y - cy) * (p.y - cy));
      if (d <= (m.seeBlocks || 16) && !LM.st.seen[m.id]) { LM.st.seen[m.id] = 1; lmSave(); }
      if (LM.st.seen[m.id]) { try { if (window.fogHides && window.fogHides(p.x, p.y) && typeof fogReveal === 'function') fogReveal(p.x, p.y, 1.6); } catch(_e){} }
      if (d <= 1.5 && !LM.st.climbed[m.id]) {
        LM.st.climbed[m.id] = 1; lmSave();
        try { if (typeof fogReveal === 'function') fogReveal(p.x, p.y, m.lookBlocks || 30); } catch(_e){}
        var f = m.feed;
        if (f) { try { if (window.BOHEMIA_FEED) { window.BOHEMIA_FEED.push({ who: f.who, txt: f.txt, kind: f.kind || 'world', draft: true }); LM.posts++; } } catch(_e){} }
      }
    });
  }
  R.landmarkTick = landmarkTick;
  function lmMix(a, b, t){
    var pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), o = [16, 8, 0].map(function(s){
      return Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t); });
    return 'rgb(' + o.join(',') + ')';
  }
  function lmShade(c, k){   /* k < 0 darker, k > 0 toward white */
    var m = /rgb\((\d+),(\d+),(\d+)\)/.exec(c); if (!m) return c;
    var v = [1, 2, 3].map(function(i){ var x = +m[i]; return Math.max(0, Math.min(255, Math.round(k < 0 ? x * (1 + k) : x + (255 - x) * k))); });
    return 'rgb(' + v.join(',') + ')';
  }
  function lmHash(i){ var h = (i * 2654435761) >>> 0; h ^= h >>> 13; h = (h * 1274126177) >>> 0; return (h >>> 8) / 16777216; }
  function drawLandmarks(){
    LM.drawn = 0; LM.named = 0;
    if (!LM.list.length) return;
    var ox = Math.round(CVW / 2 - (city.x - city.y) * TW / 2 + panX), oy = Math.round(CVH / 2 - (city.x + city.y) * TH / 2 + panY);
    var night = false; try { night = typeof isNight === 'function' && isNight(); } catch(_e){}
    g.save();
    LM.list.forEach(function(m){
      var p = lmXY(m);
      if (window.fogHides && window.fogHides(p.x, p.y) && !LM.st.seen[m.id]) return;
      /* HOW BIG: glass pixels a metre. Up close, THE HOUSES' OWN SCALE (slices/bohemia_map_houses.js: TW / (sqrt 2 x 36)), so a
         stack of ten metres stands over a house the way the real ones stand over a car. Under that, a floor tied to his men (the
         person never shrinks with the zoom, the 9/21 law): from the middle zooms in, the tallest stack is about one and a third
         of a man and more (about 100 px), so they read as mountains beside the crew, never pebbles (the real ones are five men
         tall); far out it shrinks with the land to a mark about the size of a town's picture (24 px). */
      var q = iso(p.x, p.y, ox, oy), u = Math.max(Math.max(2.4, Math.min(10, TW * 0.24)), TW / (Math.SQRT2 * 36));
      var stacks = m.stacks || [6, 5, 4, 5, 4, 5, 4], n = stacks.length, gap = 4.3 * u;
      if (q.sx < -n * gap - 60 || q.sx > CVW + n * gap + 60 || q.sy < -16 * u || q.sy > CVH + 8 * u) return;
      var foot = q.sy + TH / 2, cols = m.colours || ['#ff4fb0', '#fff01e', '#2f8cff'], fade = m.fade == null ? 0.36 : m.fade, dust = m.dust || '#cdb99a';
      var lime = night ? '#4a463f' : '#9d958a';   /* the grey limestone where the paint has gone */
      /* the shadow on the sand, the sun high and to the left (the land's own north-west sun) */
      g.fillStyle = night ? 'rgba(6,5,4,0.35)' : 'rgba(30,22,14,0.30)';
      g.beginPath(); g.ellipse(q.sx + 2.5 * u, foot + 0.5 * u, (n * gap) / 2 + 2.5 * u, 2.4 * u, -0.22, 0, 7); g.fill();
      /* one stone: a lumpy outline from ten radii (a real boulder, not a disc), resting flatter top and bottom */
      function stoneAt(cx, cy, rw, rh, seed){
        var pts = [];
        for (var i = 0; i < 10; i++) {
          var a = i / 10 * Math.PI * 2, j = 0.86 + lmHash(seed * 10 + i) * 0.22, flat = Math.abs(Math.sin(a)) > 0.8 ? 0.93 : 1;
          pts.push([cx + Math.cos(a) * rw * j, cy + Math.sin(a) * rh * j * flat]);
        }
        g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
        for (var t = 0; t < 10; t++) { var a2 = pts[t], b2 = pts[(t + 1) % 10]; g.quadraticCurveTo(a2[0], a2[1], (a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2); }
        g.closePath();
      }
      var k = 0, top = foot;
      for (var s = 0; s < n; s++) {
        /* the seven stand in a loose line across the iso ground, the back ones higher on the glass */
        var bx = q.sx + (s - (n - 1) / 2) * gap, by = foot - (s - (n - 1) / 2) * gap * 0.24 + (lmHash(s + 91) - 0.5) * u * 1.5, y = by;
        for (var b = 0; b < stacks[s]; b++, k++) {
          /* a chunky stone, nearly as tall as it is wide (the real ones are about 2 to 3 m), the upper ones a little smaller */
          var rw = (0.95 + lmHash(k + 7) * 0.4) * u * (1 - b * 0.05), rh = (0.78 + lmHash(k + 31) * 0.3) * u,
              col = lmMix(cols[Math.floor(lmHash(k + 3) * cols.length)], dust, fade);
          if (night) col = lmShade(col, -0.55);
          var cy2 = y - rh, cx2 = bx + (lmHash(k + 57) - 0.5) * u * 0.6;
          stoneAt(cx2 + 0.12 * u, cy2 + 0.1 * u, rw, rh, k); g.fillStyle = lmShade(col, -0.45); g.fill();   /* the side away from the sun */
          g.save(); stoneAt(cx2, cy2, rw * 0.97, rh * 0.95, k); g.clip();
          g.fillStyle = col; g.fillRect(cx2 - rw * 1.2, cy2 - rh * 1.2, rw * 2.4, rh * 2.4);
          if (lmHash(k + 13) < 0.22) {   /* a striped stone, as some of the real ones are */
            var sc = lmMix(cols[Math.floor(lmHash(k + 77) * cols.length)], dust, fade);
            g.fillStyle = night ? lmShade(sc, -0.55) : sc; g.fillRect(cx2 - rw * 1.2, cy2 - rh * 0.22, rw * 2.4, rh * 0.44);
          }
          g.fillStyle = lmShade(col, -0.3); g.globalAlpha = 0.55;   /* the round of it turning away, right and under */
          g.beginPath(); g.ellipse(cx2 + rw * 0.55, cy2 + rh * 0.35, rw * 0.75, rh * 0.8, 0, 0, 7); g.fill(); g.globalAlpha = 1;
          if (lmHash(k + 41) < 0.55) {   /* where the paint has gone and the grey stone shows (nobody repaints it now) */
            var px2 = cx2 + (lmHash(k + 43) - 0.5) * rw, py2 = cy2 + (lmHash(k + 47) - 0.3) * rh, pr = (0.18 + lmHash(k + 49) * 0.22) * rw;
            stoneAt(px2, py2, pr, pr * 0.6, k + 500); g.fillStyle = lime; g.fill();
          }
          g.fillStyle = lmShade(col, 0.35); g.globalAlpha = 0.7;   /* the sun on its top-left */
          g.beginPath(); g.ellipse(cx2 - rw * 0.35, cy2 - rh * 0.42, rw * 0.32, rh * 0.22, -0.3, 0, 7); g.fill(); g.globalAlpha = 1;
          g.restore();
          stoneAt(cx2, cy2, rw * 0.97, rh * 0.95, k); g.strokeStyle = 'rgba(20,14,10,0.45)'; g.lineWidth = 1; g.stroke();
          y -= rh * 1.78;   /* the next stone sits down into this one */
        }
        top = Math.min(top, y);
      }
      LM.drawn++;
      /* the name, after the stones, never over another name (the map's own list) */
      g.font = 'bold 10px ui-monospace, monospace'; g.textAlign = 'center';
      var tw = g.measureText(m.name).width + 8, tx = Math.round(q.sx - tw / 2), ty = Math.round(top - 8), free = false;
      for (var tries = 0; tries < 4 && !free; tries++) {
        free = !window.mapNameFree || window.mapNameFree([tx, ty - 10, tw, 13]);
        if (!free) ty -= 14;
      }
      if (free) {
        try { if (window.mapNameTake) window.mapNameTake([tx, ty - 10, tw, 13], m.name, 'place'); } catch(_e){}
        g.fillStyle = 'rgba(14,11,8,0.82)'; g.fillRect(tx, ty - 10, Math.round(tw), 13);
        g.fillStyle = '#e8dcc0'; g.fillText(m.name, Math.round(q.sx), ty); LM.named++;
      }
    });
    g.restore();
  }
  /* ==== /__SEVEN_MAGIC_MOUNTAINS__ ==== */

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
    if (R.real) { var sp = R.land.json.speeds; crossOpen = R.D * sp.open.minutesPerCell * CLOCK_PER_MARCH; crossRoad = R.D * sp.paved.minutesPerCell * CLOCK_PER_MARCH; }
    var vb = (typeof ctBases === 'function' && ctBases()) ? Object.keys(ctBases()).length : 0;
    var zb = zoomBounds();
    return {
      tilesAcross: R.D, tiles: R.D * R.D, bbTilesAcross: 140, bbTiles: 19600,
      daysAcrossOpen: +(crossOpen / 1440).toFixed(1), daysAcrossRoad: +(crossRoad / 1440).toFixed(1), bbDaysAcross: [2, 4], bbDaysAcrossSource: 'players\' reports, no official figure (EYES 10/17, records/BOHEMIA_EYES_THE_MAPS_FOUR_NUMBERS_OURS_BESIDE_BATTLE_BROTHERS_10_17_26.md)',
      realLand: R.real, metresPerBlock: R.metresPerBlock, kmAcross: Math.round(R.D * R.metresPerBlock / 100) / 10,
      realCrossings: R.real && R.land.numbers ? (R.land.numbers().daysAcross || null) : null,
      settlements: vb + R.places.length, regionPlaces: R.places.length, bbSettlements: 17,
      zoomFar: +zb[0].toFixed(3), zoomNear: +zb[1].toFixed(2),
      farShowsBlocksAcross: Math.round(CVW / (TW0 * zb[0])), nearShowsBlocksAcross: +(CVW / (TW0 * zb[1])).toFixed(1)
    };
  };
})();
