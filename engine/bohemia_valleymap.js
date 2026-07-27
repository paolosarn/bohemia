/* ============================================================================
   BOHEMIA — THE ONE VALLEY MAP   (bohemia_valleymap.js, 7/27/26)

   Paolo, 7/27: "THE ONE MAP, my order at the top of your queue: the phone's map
   app becomes the real city-builder valley map with quest locations pinned on
   top." Law: laws/BOHEMIA_ADDENDUM_ONE_MAP_7_27_26.md

   THE PROBLEM THIS FILE EXISTS TO END. There were FOUR independent valley
   renderers in this repo and no shared layer under any of them:
     tools/bohemia_map_tab.py          the MAP tab      seed hashSeed('bohemia')
     tools/bohemia_quest_placement_judge.py             seed hashSeed('bohemia')
     tools/bohemia_aerial.js           showcase renders seed 1337
     tools/bohemia_city_tab.py         orphaned output  seed 12345
   plus CITY_B64 inside the alpha on seed 2026. Their colour tables were
   copy-pasted between files with comments admitting it ("same values as
   tools/bohemia_aerial.js so ... read as one system"), and the 128x128 per-cell
   painter existed twice, verbatim.

   That is not a tidiness complaint. It has already caused the exact bug it looks
   like it would: the MAP tab sat on the literal seed 1337 for months while the
   game booted the text seed 'bohemia', so the valley Paolo explored and the
   valley his quests were cast into were different worlds, and a quest at X29 Y77
   pointed at a tile that only existed in the other one. Copies drift. The fix for
   drift is not care, it is one copy.

   So: ONE set of tones, ONE per-cell painter, ONE tap-to-inspect answer, and
   every surface that draws the valley reads them from here.

   WHAT IS DELIBERATELY NOT IN HERE. No layout, no placement, no opinion about
   where anything goes — MAP LAW: Claude never designs map layouts, plumbing only.
   No quest content either: this file can be handed pins and will draw them, but
   it does not know what a quest is or decide where one belongs.

   HEADLESS-SAFE: the tone/label half runs in node with no canvas. The painting
   half needs a 2D context and is only called from a browser.
   Gate: gates/one_map_gate.js
   ========================================================================== */
(function (root) {
  'use strict';

  var K = (typeof module !== 'undefined' && typeof require !== 'undefined')
        ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit !== 'undefined' ? BohemiaDistrictKit : root.BohemiaDistrictKit);

  var TILE = 128;                       // tiles across one overmap cell

  /* THE TONES. One copy, and this is the copy. Every value here was already
     living in two or three files at once. */
  var FILL = {
    mountain: '#3b352b', desert: '#8a7a58', wash: '#6f6547', water: '#2f5a6e', dam: '#7a746a',
    strip: '#5a5350', resort: '#6a6050', mall: '#5a544a', casino: '#645a52', stadium: '#4a5a44',
    speedway: '#4a4640', convention: '#54504a', waterpark: '#3a6a72', minigp: '#4a4640', estate: '#6a6250',
    airport: '#565048', airbase: '#4e4a40', campus: '#5a6250', rail: '#463f36', town: '#5f584c',
    golf: '#4a5e3c', gated: '#6a6250', ballpark: '#4a5a44', fort: '#4e4a40', strat: '#645a58',
    reclaim: '#5a5040', datafort: '#454048', warehouse: '#524c44', railyard: '#463f36', watertreat: '#4c5a58',
    springs: '#2f5a6e', default: '#4a463c'
  };
  var ROADCOL = { freeway: '#33333c', arterial: '#33333c', beltway: '#33333c', strip: '#33333c', interchange: '#2b2b31' };
  var ROAD = { freeway: 1, arterial: 1, strip: 1, beltway: 1, interchange: 1 };
  var TERRAIN = { mountain: 1, desert: 1, wash: 1, water: 1, dam: 1 };
  var FABRIC = '#6a6258';               // built ground, seen from far enough that detail is a lie
  var VOID = '#161410';                 // off the map
  var UNBUILT = '#231f18';              // code 0 inside a generated plot

  function rng(seed) { var s = (seed >>> 0) || 1; return function () { s = (s * 1103515245 + 12345) >>> 0; return s / 4294967296; }; }
  function seedOf(ox, oy) { return ((ox * 73856093) ^ (oy * 19349663)) >>> 0; }

  /* The district's own canon palette, straight off the kit registry. The MAP tab
     used to carry a 46-entry MODMAP from district name to generator global just
     to reach this; the registry already has it, so that table is gone too. */
  function paletteOf(district) {
    var reg = K && K.get ? K.get(district) : null;
    return (reg && reg.palette) ? reg.palette : {};
  }
  function isBuilt(district) { return !!(K && K.get && K.get(district)); }

  /* ------------------------------------------------------------------------
     TONE — one flat colour for one cell. This is the whole-valley view: the LOD
     the MAP tab uses below FAR_ZOOM and the only view a phone screen has room
     for. Pure, node-safe, and the thing the gate compares between surfaces.
     ---------------------------------------------------------------------- */
  function toneOf(world, x, y) {
    var cell = world && world.at ? world.at(x, y) : null;
    if (!cell) return VOID;
    var d = cell.district;
    if (ROAD[d]) return ROADCOL[d] || ROADCOL.freeway;
    if (TERRAIN[d]) return FILL[d] || FILL.default;
    if (isBuilt(d)) return FABRIC;
    return FILL[d] || FILL.default;
  }

  /* What a cell IS, in words, for a tap. Also pure. */
  function describe(world, x, y) {
    var cell = world && world.at ? world.at(x, y) : null;
    if (!cell) return null;
    var d = cell.district;
    return {
      x: x, y: y, district: d,
      category: (K && K.category) ? (K.category(d) || null) : null,
      built: isBuilt(d),
      // the registry's own flag, not the local tables: rail and interchange are
      // surfaces that ROAD/TERRAIN never listed, and a tap that calls the railway
      // a district is a small lie the map does not need to tell
      surface: !!(ROAD[d] || TERRAIN[d] || ((K && K.get && K.get(d)) ? K.get(d).surface : false)),
      tone: toneOf(world, x, y)
    };
  }

  /* ------------------------------------------------------------------------
     PAINT — the real 128x128 ground of ONE cell, 1 tile = 1 canvas pixel. This
     is the city-builder's own art, and it is what makes the phone's map the real
     map rather than a schematic of it. Lifted out of tools/bohemia_map_tab.py
     unchanged in behaviour so the two surfaces cannot diverge by a pixel.
     ---------------------------------------------------------------------- */
  function paintCell(world, x, y, cx) {
    var cell = world && world.at ? world.at(x, y) : null;
    if (!cell) { cx.fillStyle = VOID; cx.fillRect(0, 0, TILE, TILE); return 'void'; }
    var d = cell.district;
    var plot = null;
    try { plot = world.plot(x, y); } catch (e) { plot = null; }

    if (plot && plot.block && plot.block.grid && plot.legend) {
      var g = plot.block.grid, pal = paletteOf(d);
      for (var ty = 0; ty < TILE; ty++) {
        var row = g[ty] || [], i = 0;
        while (i < TILE) {
          var code = row[i] != null ? row[i] : 0, j = i;
          while (j < TILE && (row[j] != null ? row[j] : 0) === code) j++;
          cx.fillStyle = code === 0 ? UNBUILT : (pal[code] || '#3a352b');
          cx.fillRect(i, ty, j - i, 1);
          i = j;
        }
      }
      return 'plot';
    }
    if (ROAD[d]) {
      cx.fillStyle = ROADCOL[d] || ROADCOL.freeway; cx.fillRect(0, 0, TILE, TILE);
      var isRoad = function (nx, ny) { var c = world.at(nx, ny); return !!(c && ROAD[c.district]); };
      var vert = isRoad(x, y - 1) || isRoad(x, y + 1);
      var horiz = isRoad(x - 1, y) || isRoad(x + 1, y);
      if (horiz) {
        cx.fillStyle = '#26262c'; cx.fillRect(0, 63, TILE, 2);
        cx.fillStyle = '#d9c589'; for (var dx = 6; dx < TILE; dx += 16) cx.fillRect(dx, 63, 8, 2);
      }
      if (vert) {
        cx.fillStyle = '#26262c'; cx.fillRect(63, 0, 2, TILE);
        cx.fillStyle = '#d9c589'; for (var dy = 6; dy < TILE; dy += 16) cx.fillRect(63, dy, 2, 8);
      }
      return 'road';
    }
    if (TERRAIN[d]) {
      cx.fillStyle = FILL[d] || FILL.default; cx.fillRect(0, 0, TILE, TILE);
      var r1 = rng(seedOf(x, y));
      for (var i1 = 0; i1 < 90; i1++) {
        var sx = Math.floor(r1() * TILE), sy = Math.floor(r1() * TILE);
        var sw = 2 + Math.floor(r1() * 4), sh = 2 + Math.floor(r1() * 4);
        cx.fillStyle = r1() < 0.5 ? 'rgba(0,0,0,0.19)' : 'rgba(255,255,255,0.08)';
        cx.fillRect(sx, sy, sw, sh);
      }
      return 'terrain';
    }
    // a canon type Paolo reserved for his own hand (strip, resort, casino...):
    // tagged RESERVED, never drawn as if it were empty or broken land
    cx.fillStyle = FILL[d] || FILL.default; cx.fillRect(0, 0, TILE, TILE);
    cx.strokeStyle = 'rgba(0,0,0,0.13)'; cx.lineWidth = 3;
    for (var d2 = -TILE; d2 < TILE; d2 += 14) { cx.beginPath(); cx.moveTo(d2, 0); cx.lineTo(d2 + TILE, TILE); cx.stroke(); }
    cx.fillStyle = 'rgba(0,0,0,0.55)'; cx.fillRect(6, 6, Math.min(116, d.length * 7 + 8), 14);
    cx.fillStyle = '#c79a3f'; cx.font = '10px ui-monospace,monospace'; cx.fillText(String(d).toUpperCase(), 10, 16);
    return 'reserved';
  }

  /* ------------------------------------------------------------------------
     THE WHOLE VALLEY, one flat image at 1 pixel per cell. A phone draws this and
     scales it up; the MAP tab draws the same tones cell by cell. Same numbers,
     same order, one function.
     ---------------------------------------------------------------------- */
  function paintValley(world, cx, n) {
    n = n || (world && world.n) || 0;
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      cx.fillStyle = toneOf(world, x, y);
      cx.fillRect(x, y, 1, 1);
    }
    return n;
  }

  /* ------------------------------------------------------------------------
     PINS. Handed the placements the quest manager already made, this groups them
     by cell so a stack of quests on one tile reads as a stack instead of three
     pins drawn on top of each other. It DECIDES NOTHING: a quest with no
     placement produces no pin and is counted as unplaced, because inventing a
     location is the one thing the map must never do.
     ---------------------------------------------------------------------- */
  function pinsFrom(placements, isOpen) {
    var byCell = {}, out = [], unplaced = 0;
    (placements || []).forEach(function (p) {
      if (!p || p.x == null || p.y == null) { unplaced++; return; }
      if (isOpen && !isOpen(p.questId)) return;
      var k = p.x + ',' + p.y;
      if (!byCell[k]) { byCell[k] = { x: p.x, y: p.y, quests: [], channels: {} }; out.push(byCell[k]); }
      byCell[k].quests.push(p.questId);
      byCell[k].channels[p.channel || 'feed'] = 1;
    });
    out.sort(function (a, b) { return (a.y - b.y) || (a.x - b.x); });
    out.forEach(function (c) { c.count = c.quests.length; c.channel = c.channels.inperson ? 'inperson' : 'feed'; });
    return { pins: out, unplaced: unplaced, cells: out.length,
             total: out.reduce(function (s, c) { return s + c.count; }, 0) };
  }

  var API = { TILE: TILE, FILL: FILL, ROADCOL: ROADCOL, ROAD: ROAD, TERRAIN: TERRAIN,
              FABRIC: FABRIC, VOID: VOID, UNBUILT: UNBUILT,
              toneOf: toneOf, describe: describe, paintCell: paintCell,
              paintValley: paintValley, pinsFrom: pinsFrom,
              paletteOf: paletteOf, isBuilt: isBuilt, rng: rng, seedOf: seedOf };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaValleyMap = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
