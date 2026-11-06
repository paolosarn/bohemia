/* ==========================================================================
   __THE_MISSING_REAL_PLACES__ (WORLD TEN 11/6, VAMILY rules 409(c) and 411, ask line 458)

   PAOLO 11/5: "I want you to research every building type in Pocket City 2 and like the eight different genres that they
   have buildings for and see if you're missing any of those buildings."

   THE CHECK (records/BOHEMIA_PAOLO_POCKET_CITY_2_BUILDINGS_AGAINST_OURS_11_5_26.md): financial was the hole, power and resources
   half, and the beasts' own lab was named in the map's text and never drawn. NOW, each a REAL Las Vegas place in the collapse at
   its real spot (records/target/bb/real_places.json, the one list a modder edits):
     ON THE VALLEY, nine new map kinds the generator seats on every seed (engine/bohemia_overmap.js REAL_PLACES): THE BANK (Valley
       Bank Plaza, 300 S 4th, by the courts), the UNEMPLOYMENT OFFICE (JobConnect, Maryland Parkway), two HOME CENTERs (the big-box
       hardware stores on the mile-street corners), CLARK STATION (the valley's own gas plant at Whitney), SHARK REEF (under the
       casino south of Luxor), the ANIMAL SHELTER (Mojave Road), THE MOB MUSEUM (the 1933 courthouse), the NATURAL HISTORY MUSEUM
       (by Cashman Field) and CHANNEL 8. They wear the kit art of the kind each is like until COOK FOUR's golden piece (rule 408).
     ON THE REGION, two places the region's own machinery draws, names and opens (tools/bohemia_world_region.py): TULE SPRINGS LAB
       on the fossil beds and LENZIE STATION, the big gas plant at Apex.

   WHAT THIS FILE DOES (loaded after the map's own script and the region's, wrapping functions by name, so nothing else of the map
   changes): for the valley's nine,
     - THE NAME: a plate on the place once a block is wide enough to read it, never on another name (the map's own list: taken,
       free), never through the fog;
     - THE TAP: the plate and the building answer a tap the way a town's do (MAP_TOWN_HIT), so the crew walks there;
     - THE SCREEN: arriving opens it as a settlement screen (the same screen as every place; its district goes with it, so its
       SCAVENGE searches the place's own ground, engine/bohemia_scavenge.js);
     - THE POST: the first time he arrives, one post on the feed (draft words, the file's 'feed').
   The fight on a place's block deals its kind's board (the shell's nfKind, records/target/BOHEMIA_BOARD_KINDS.json).
   ========================================================================== */
(function(){
  'use strict';
  if (typeof om === 'undefined' || typeof loopTownAt !== 'function') return;
  var RP = window.BOH_REAL_PLACES = { list: [], byId: {}, loaded: false, seed: null, cells: [], drawn: 0, named: 0, posts: 0,
    opened: 0, st: { seen: {} }, key: 'bohemia.realplaces.v1', minBlockPx: 20 };
  try { var st0 = JSON.parse(localStorage.getItem(RP.key) || 'null'); if (st0 && st0.seen) RP.st = st0; } catch(_e){}
  function save(){ try { localStorage.setItem(RP.key, JSON.stringify(RP.st)); } catch(_e){} }
  try {
    if (typeof fogNewGame === 'function') { var _fng = fogNewGame;
      fogNewGame = function(){ RP.st = { seen: {} }; save(); return _fng.apply(this, arguments); }; }
  } catch(_e){}

  RP.use = function(list){   /* the check's door, and the loader's */
    RP.list = (list || []).slice(); RP.byId = {};
    RP.list.forEach(function(p){ if (p && p.id) RP.byId[p.id] = p; });
    RP.loaded = true; RP.seed = null;
  };
  (function load(){
    try {
      if (typeof fetch !== 'function') return;
      fetch('../records/target/bb/real_places.json').then(function(r){ return r.json(); }).then(function(j){
        RP.use((j && j.places) || []);
        try { if (typeof render === 'function') render(); } catch(_e){}
      }).catch(function(){});
    } catch(_e){}
  })();

  /* A TOWN WAS BUILT FIRST: the generator stamps each place on the finished valley; the faction seats are chosen from what every
     block WAS, so they never move, and a place their painted ground would cover moves to its next clear block, a block clear of
     every town (engine/bohemia_overmap.js restampRealPlaces). Once a valley; the painting is asked again if anything moved. */
  function settle(){
    if (RP.settled === om.seed) return true;
    var bs = null; try { bs = (typeof ctBases === 'function') ? ctBases() : null; } catch(_e){ bs = null; }
    if (!bs || !Object.keys(bs).length) return false;
    var feet = [];
    for (var nm in bs) { var b = bs[nm]; if (!b) continue; try { feet.push(townFoot({ name: nm, x: b.x | 0, y: b.y | 0 })); } catch(_e){} }
    var keepOut = function(x, y){ for (var i = 0; i < feet.length; i++) { var f = feet[i];
      if (x >= f.x0 - 1 && x <= f.x0 + f.n && y >= f.y0 - 1 && y <= f.y0 + f.n) return true; } return false; };
    var E = (typeof OM !== 'undefined' && OM.restampRealPlaces) ? OM : (window.BohemiaOvermap || null), moved = [];
    try { if (E && E.restampRealPlaces) moved = E.restampRealPlaces(om, keepOut); } catch(_e){ RP.err = String(_e && _e.message || _e); }
    RP.settled = om.seed; RP.moved = moved.length; RP.towns = feet.length; RP.seed = null;
    if (moved.length) {   /* the painting, the tiles and the ground read the districts once: again (the region's own way, __THE_PASSES__) */
      try { VB_STF.seed = null; } catch(_e){} try { VBC.key = null; VBT.tiles.clear(); } catch(_e){} try { MAP_GROUND.key = ''; } catch(_e){}
    }
    return true;
  }
  RP.settle = settle;
  /* the valley's seats, read off the generator's own layout every time the valley changes (a new game rolls a new one) */
  function cells(){
    var ready = settle();
    if (RP.seed === om.seed && RP.cells.length && ready) return RP.cells;
    var L = om.layout || null, out = [];
    ((L && L.realPlaces) || []).forEach(function(s){
      if (s.x == null) return;
      var d = RP.byId[s.id] || null, t = om.at(s.x, s.y);
      if (!d) return;   /* only what the file names: a modder who takes a place out of the file takes it off the map's use */
      if (!t || t.district !== s.kind) return;   /* the generator lost it: the gate counts this */
      out.push({ id: s.id, kind: s.kind, name: d.name, x: s.x, y: s.y, tier: d.tier || 'camp', d: d });
    });
    RP.cells = out; RP.seed = ready ? om.seed : null;
    return out;
  }
  RP.cellsNow = cells;
  RP.at = function(x, y, r){
    var rr = (r == null ? 1 : r), best = null, bd = 1e9;
    cells().forEach(function(c){ var dd = Math.max(Math.abs(c.x - x), Math.abs(c.y - y)); if (dd <= rr && dd < bd) { bd = dd; best = c; } });
    return best ? { name: best.name, x: best.x, y: best.y, tier: best.tier, role: 'place', real: best.id, kind: best.kind } : null;
  };

  /* ---- THE SCREEN: a place he arrives at opens, the same screen as every other ---- */
  var _town = loopTownAt;
  loopTownAt = function(x, y, r){
    var t = _town.apply(this, arguments); if (t) return t;
    return RP.at(x, y, r);
  };
  /* ---- THE POST: the first time he is there ---- */
  var _open = loopOpenTown;
  loopOpenTown = function(t){
    var out = _open.apply(this, arguments);
    try {
      if (t && t.real) { RP.opened++;
        if (!RP.st.seen[t.real]) { RP.st.seen[t.real] = 1; save();
          var f = RP.byId[t.real] && RP.byId[t.real].feed;
          if (f && window.BOHEMIA_FEED) { window.BOHEMIA_FEED.push({ who: f.who, txt: f.txt, kind: f.kind || 'world', draft: true }); RP.posts++; } } }
    } catch(_e){}
    return out;
  };

  /* ---- THE NAME AND THE TAP: drawn before the land's names, which step aside for it ---- */
  function drawNames(){
    RP.drawn = 0; RP.named = 0;
    if (typeof MODE === 'undefined' || MODE !== 'city') return;
    if (!(TW >= RP.minBlockPx)) return;   /* at the far stops the valley is its towns; up close it is its buildings */
    var ox = Math.round(CVW / 2 - (city.x - city.y) * TW / 2 + panX), oy = Math.round(CVH / 2 - (city.x + city.y) * TH / 2 + panY);
    g.save();
    g.font = 'bold 10px ui-monospace, monospace'; g.textAlign = 'center';
    cells().forEach(function(c){
      if (window.fogHides && window.fogHides(c.x, c.y)) return;
      var q = iso(c.x, c.y, ox, oy); if (q.sx < -60 || q.sx > CVW + 60 || q.sy < -60 || q.sy > CVH + 60) return;
      RP.drawn++;
      var hit = { name: c.name, x: c.x, y: c.y, tier: c.tier, real: c.id, kind: c.kind, plate: null,
        bld: { x: q.sx - TW / 2, y: q.sy - TH, w: TW, h: TH * 1.5 } };
      try { MAP_TOWN_HIT.push(hit); } catch(_e){}
      var w = Math.ceil(g.measureText(c.name).width) + 8, ty = Math.round(q.sy - TH * 0.6), bx = Math.round(q.sx - w / 2), free = false;
      for (var tries = 0; tries < 3 && !free; tries++) {
        free = (!window.mapNameFree || window.mapNameFree([bx, ty - 10, w, 13])); if (!free) ty -= 14; }
      if (!free || ty < 12 || ty > CVH - 4) return;
      try { if (window.mapNameTake) window.mapNameTake([bx, ty - 10, w, 13], c.name, 'place'); } catch(_e){}
      hit.plate = { x: bx, y: ty - 10, w: w, h: 13 };
      g.fillStyle = 'rgba(14,11,8,0.82)'; g.fillRect(bx, ty - 10, w, 13);
      g.fillStyle = '#e8dcc0'; g.fillText(c.name, Math.round(q.sx), ty);
      RP.named++;
    });
    g.restore();
  }
  var _late = window.mapNamesLate;
  window.mapNamesLate = function(){
    try { drawNames(); } catch(_e){ RP.err = String(_e && _e.message || _e); }
    if (typeof _late === 'function') return _late.apply(this, arguments);
  };
  RP.drawNames = drawNames;
})();
