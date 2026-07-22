#!/usr/bin/env python3
"""
BOHEMIA MAP TAB (7/21/26, district-factory session) — THE VALLEY AERIAL, LIVE, REACHABLE.

Paolo: "where do I go see your work?" — until now the answer was "nowhere, I hand you
screenshots." This closes that gap: a new MAP tab in the alpha that embeds the REAL world
model (bohemia_world.js + every auto-factory district generator, not a simplified color-only
skeleton like the CITY tab) and renders it live, client-side, exactly like
tools/bohemia_aerial.js — native tile resolution, real intersection topology (read from actual
neighbor connectivity, not a coin flip), honest reserved-placeholder tags for bespoke/unbuilt
landmark types, canon street color. Read-only exploration (pan/zoom/tap-to-inspect) — this is
NOT the CITY tab's build/demolish city-builder, a deliberately separate, simpler tier.

Each visited cell renders ONCE into an offscreen canvas at native 128x128 tile resolution and
is cached; panning/zooming just blits the cache, so real per-tile detail costs nothing after
the first visit.

map_tab_gate.js byte-locks EVERY embedded module to its canon body (ENGINE SYNC LAW) — rerun
this tool any time bohemia_world.js or any district engine module changes.

  python3 tools/bohemia_map_tab.py
    -> slices/BOHEMIA_MAP_CURRENT.html   (the stable URL the MAP tab loads)
"""
import hashlib
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUT = 'slices/BOHEMIA_MAP_CURRENT.html'

# load order matters in a plain browser bundle: district_kit + every generator (all depend only
# on district_kit) + overmap/bridge/blockgen/floorplan/garage/crypt (no deps) can load in any
# order among themselves; bohemia_world.js must load LAST (it references all of them as globals).
MODULES = [
    'engine/bohemia_district_kit.js',
    'engine/bohemia_suburb.js', 'engine/bohemia_commercial.js', 'engine/bohemia_industrial.js',
    'engine/bohemia_medical.js', 'engine/bohemia_solar.js', 'engine/bohemia_park.js',
    'engine/bohemia_wash.js', 'engine/bohemia_cemetery.js', 'engine/bohemia_drivein.js',
    'engine/bohemia_golf.js', 'engine/bohemia_stadium.js', 'engine/bohemia_truckstop.js',
    'engine/bohemia_school.js', 'engine/bohemia_firestation.js', 'engine/bohemia_swapmeet.js',
    'engine/bohemia_storage.js', 'engine/bohemia_watertreat.js', 'engine/bohemia_boneyard.js',
    'engine/bohemia_policestation.js', 'engine/bohemia_library.js', 'engine/bohemia_landfill.js',
    'engine/bohemia_railyard.js', 'engine/bohemia_substation.js', 'engine/bohemia_chapel.js',
    'engine/bohemia_courthouse.js', 'engine/bohemia_jail.js', 'engine/bohemia_farm.js',
    'engine/bohemia_downtown.js', 'engine/bohemia_trailer.js', 'engine/bohemia_apartment.js',
    'engine/bohemia_warehouse.js', 'engine/bohemia_waterpark.js', 'engine/bohemia_mall.js',
    'engine/bohemia_overmap.js', 'engine/bohemia_overmap_bridge.js', 'engine/bohemia_blockgen.js',
    'engine/bohemia_floorplan.js', 'engine/bohemia_garage.js', 'engine/bohemia_crypt.js',
    'engine/bohemia_world.js',
]
bodies = {m: open(m, encoding='utf8').read() for m in MODULES}
md5s = {m: hashlib.md5(bodies[m].encode('utf8')).hexdigest() for m in MODULES}
engine = '\n'.join('/* ==== %s ==== */\n%s' % (m, bodies[m]) for m in MODULES)

GAME = r"""
// ===== MAP TAB — the valley aerial, live, read-only =====
var SEED = 1337;
var W = BohemiaWorld.world(SEED);
var N = W.n;

// district-type -> the global its generator module exported (matches DISTGEN in bohemia_world.js)
var MODMAP = {
  suburb:'BohemiaSuburb', gated:'BohemiaSuburb', estate:'BohemiaSuburb', apartment:'BohemiaApartment',
  commercial:'BohemiaCommercial', industrial:'BohemiaIndustrial', medical:'BohemiaMedical',
  solar:'BohemiaSolar', park:'BohemiaPark', wash:'BohemiaWash', cemetery:'BohemiaCemetery',
  drivein:'BohemiaDrivein', golf:'BohemiaGolf', stadium:'BohemiaStadium', truckstop:'BohemiaTruckstop',
  school:'BohemiaSchool', firestation:'BohemiaFirestation', swapmeet:'BohemiaSwapmeet',
  storage:'BohemiaStorage', watertreat:'BohemiaWatertreat', boneyard:'BohemiaBoneyard',
  policestation:'BohemiaPolicestation', library:'BohemiaLibrary', landfill:'BohemiaLandfill',
  railyard:'BohemiaRailyard', substation:'BohemiaSubstation', chapel:'BohemiaChapel',
  courthouse:'BohemiaCourthouse', jail:'BohemiaJail', farm:'BohemiaFarm', downtown:'BohemiaDowntown',
  trailer:'BohemiaTrailer', warehouse:'BohemiaWarehouse', waterpark:'BohemiaWaterpark', mall:'BohemiaMall'
};
function modOf(dist){ var n = MODMAP[dist]; return n ? window[n] : null; }

// fill tone for non-DISTGEN cells (roads, terrain, not-yet-built district types) — same values
// as tools/bohemia_aerial.js so the live map and the showcase renders read as one system.
var FILL = {
  mountain:'#3b352b', desert:'#8a7a58', wash:'#6f6547', water:'#2f5a6e', dam:'#7a746a',
  strip:'#5a5350', resort:'#6a6050', mall:'#5a544a', casino:'#645a52', stadium:'#4a5a44',
  speedway:'#4a4640', convention:'#54504a', waterpark:'#3a6a72', minigp:'#4a4640', estate:'#6a6250',
  airport:'#565048', airbase:'#4e4a40', campus:'#5a6250', rail:'#463f36', town:'#5f584c',
  golf:'#4a5e3c', gated:'#6a6250', ballpark:'#4a5a44', fort:'#4e4a40', strat:'#645a58',
  reclaim:'#5a5040', datafort:'#454048', warehouse:'#524c44', railyard:'#463f36', watertreat:'#4c5a58',
  springs:'#2f5a6e', default:'#4a463c'
};
var ROADCOL = {freeway:'#33333c', arterial:'#33333c', beltway:'#33333c', strip:'#33333c', interchange:'#2b2b31'};
var ROAD = {freeway:1, arterial:1, strip:1, beltway:1, interchange:1};
var TERRAIN = {mountain:1, desert:1, wash:1, water:1, dam:1};

function rng(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1103515245+12345)>>>0; return s/4294967296; }; }
function seedOf(ox,oy){ return ((ox*73856093)^(oy*19349663))>>>0; }

// ---- per-cell render, cached at NATIVE 128x128 tile resolution (1 tile = 1 canvas px) ----
var cellCache = {};
function renderCell(ox, oy){
  var key = ox+','+oy;
  var hit = cellCache[key]; if (hit) return hit;
  var cv = document.createElement('canvas'); cv.width = 128; cv.height = 128;
  var cx = cv.getContext('2d');
  var cell = W.at(ox, oy);
  if (!cell) { cx.fillStyle = '#161410'; cx.fillRect(0,0,128,128); cellCache[key] = cv; return cv; }
  var dist = cell.district;
  var plot = null; try { plot = W.plot(ox, oy); } catch (e) { plot = null; }
  if (plot && plot.block && plot.block.grid && plot.legend) {
    var g = plot.block.grid, mod = modOf(dist), pal = (mod && mod.palette) ? mod.palette : {};
    for (var ty = 0; ty < 128; ty++) {
      var row = g[ty] || [], i = 0;
      while (i < 128) {
        var code = row[i] != null ? row[i] : 0, j = i;
        while (j < 128 && (row[j] != null ? row[j] : 0) === code) j++;
        cx.fillStyle = code === 0 ? '#231f18' : (pal[code] || '#3a352b');
        cx.fillRect(i, ty, j - i, 1);
        i = j;
      }
    }
  } else if (ROAD[dist]) {
    cx.fillStyle = ROADCOL[dist] || ROADCOL.freeway; cx.fillRect(0, 0, 128, 128);
    var isRoad = function(nx, ny){ var c = W.at(nx, ny); return !!(c && ROAD[c.district]); };
    var vert = isRoad(ox, oy - 1) || isRoad(ox, oy + 1);
    var horiz = isRoad(ox - 1, oy) || isRoad(ox + 1, oy);
    if (horiz) {
      cx.fillStyle = '#26262c'; cx.fillRect(0, 63, 128, 2);
      cx.fillStyle = '#d9c589'; for (var dx = 6; dx < 128; dx += 16) cx.fillRect(dx, 63, 8, 2);
    }
    if (vert) {
      cx.fillStyle = '#26262c'; cx.fillRect(63, 0, 2, 128);
      cx.fillStyle = '#d9c589'; for (var dy = 6; dy < 128; dy += 16) cx.fillRect(63, dy, 2, 8);
    }
  } else if (TERRAIN[dist]) {
    var col = FILL[dist] || FILL.default; cx.fillStyle = col; cx.fillRect(0, 0, 128, 128);
    var r1 = rng(seedOf(ox, oy));
    for (var i1 = 0; i1 < 90; i1++) {
      var sx = Math.floor(r1() * 128), sy = Math.floor(r1() * 128), sw = 2 + Math.floor(r1() * 4), sh = 2 + Math.floor(r1() * 4);
      cx.fillStyle = r1() < 0.5 ? 'rgba(0,0,0,0.19)' : 'rgba(255,255,255,0.08)';
      cx.fillRect(sx, sy, sw, sh);
    }
  } else {
    // a canon district type NOT YET in the auto-factory (bespoke landmarks: casino, ballpark,
    // stadium-class, etc.) — RESERVED tag, never rendered as if it were empty/broken land.
    var col2 = FILL[dist] || FILL.default; cx.fillStyle = col2; cx.fillRect(0, 0, 128, 128);
    cx.strokeStyle = 'rgba(0,0,0,0.13)'; cx.lineWidth = 3;
    for (var d2 = -128; d2 < 128; d2 += 14) { cx.beginPath(); cx.moveTo(d2, 0); cx.lineTo(d2 + 128, 128); cx.stroke(); }
    cx.fillStyle = 'rgba(0,0,0,0.55)'; cx.fillRect(6, 6, Math.min(116, dist.length * 7 + 8), 14);
    cx.fillStyle = '#c79a3f'; cx.font = '10px ui-monospace,monospace'; cx.fillText(dist.toUpperCase(), 10, 16);
  }
  cellCache[key] = cv; return cv;
}

// ---- pan / zoom / tap-to-inspect (same pointer/wheel pattern as the CITY tab) ----
var cv = document.getElementById('cv'), ctx = cv.getContext('2d');
var HUD = document.getElementById('hud');
// ZMIN low enough to see the WHOLE valley at once (N=96) — Paolo 7/21: "if I zoom out a lot it
// make me feel good about the different views." Below FAR_ZOOM there's no legible per-tile
// detail anyway, so we skip the per-cell canvas entirely and paint a flat, honest tone
// (road / terrain / reserved-landmark / built city fabric) straight onto the main canvas — cheap
// enough to pan the entire valley smoothly, and it reads as a clean minimap, not a muddy blur.
var px = N / 2, py = N / 2, Z = 48, ZMIN = 3, ZMAX = 128, FAR_ZOOM = 16;
var FABRIC = '#6a6258'; // built DISTGEN content at far zoom: one honest "city fabric" tone

function draw(){
  var w = cv.width, h = cv.height;
  ctx.fillStyle = '#0d0b08'; ctx.fillRect(0, 0, w, h);
  var far = Z < FAR_ZOOM;
  ctx.imageSmoothingEnabled = far;
  var x0 = Math.max(0, Math.floor(px - w / Z / 2)), x1 = Math.min(N - 1, Math.ceil(px + w / Z / 2));
  var y0 = Math.max(0, Math.floor(py - h / Z / 2)), y1 = Math.min(N - 1, Math.ceil(py + h / Z / 2));
  for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) {
    var sx = Math.round((x - px) * Z + w / 2), sy = Math.round((y - py) * Z + h / 2), zc = Math.ceil(Z);
    if (far) {
      var cell = W.at(x, y);
      var col = !cell ? '#161410' : ROAD[cell.district] ? (ROADCOL[cell.district] || ROADCOL.freeway) :
        TERRAIN[cell.district] ? (FILL[cell.district] || FILL.default) :
        MODMAP[cell.district] ? FABRIC : (FILL[cell.district] || FILL.default);
      ctx.fillStyle = col; ctx.fillRect(sx, sy, zc, zc);
    } else {
      var bmp = renderCell(x, y);
      ctx.drawImage(bmp, sx, sy, zc, zc);
    }
  }
  if (sel) {
    ctx.strokeStyle = '#f0cd78'; ctx.lineWidth = 2;
    ctx.strokeRect(Math.round((sel[0] - px) * Z + w / 2), Math.round((sel[1] - py) * Z + h / 2), Math.ceil(Z), Math.ceil(Z));
  }
}
function resize(){ cv.width = cv.clientWidth; cv.height = cv.clientHeight; draw(); }
window.addEventListener('resize', resize);

var sel = null;
function refreshHUD(){
  if (!sel) { HUD.textContent = 'The valley, live — every district rendered by its own real generator. Drag to pan, wheel/pinch to zoom, tap a cell to inspect it.'; return; }
  var c = W.at(sel[0], sel[1]);
  if (!c) { HUD.textContent = '(' + sel[0] + ',' + sel[1] + ') off the map'; return; }
  var mod = modOf(c.district);
  var desc = mod && mod.notes && mod.notes.summary ? mod.notes.summary :
    (ROAD[c.district] ? 'a mile arterial / freeway — the street grid' :
     TERRAIN[c.district] ? 'undeveloped terrain, no street access needed' :
     'a bespoke landmark type — reserved, not yet in the auto-factory');
  HUD.textContent = '(' + sel[0] + ',' + sel[1] + ') ' + c.district.toUpperCase() + ' — ' + desc;
}

var down = false, sx0 = 0, sy0 = 0, spx = 0, spy = 0, moved = 0;
cv.addEventListener('pointerdown', function(e){ down = true; sx0 = e.clientX; sy0 = e.clientY; spx = px; spy = py; moved = 0; cv.setPointerCapture(e.pointerId); });
cv.addEventListener('pointermove', function(e){ if (!down) return; var dx = e.clientX - sx0, dy = e.clientY - sy0; moved += Math.abs(dx) + Math.abs(dy); px = spx - dx / Z; py = spy - dy / Z; draw(); });
cv.addEventListener('pointerup', function(e){
  down = false;
  if (moved < 6) {
    var w = cv.width, h = cv.height;
    var wx = Math.floor(px + (e.offsetX - w / 2) / Z), wy = Math.floor(py + (e.offsetY - h / 2) / Z);
    sel = [wx, wy]; refreshHUD(); draw();
  }
});
cv.addEventListener('wheel', function(e){ e.preventDefault(); var f = e.deltaY < 0 ? 1.15 : 1 / 1.15; Z = Math.max(ZMIN, Math.min(ZMAX, Z * f)); draw(); }, {passive: false});
var pinchD = null;
cv.addEventListener('touchmove', function(e){
  if (e.touches.length === 2) {
    e.preventDefault();
    var dx = e.touches[0].clientX - e.touches[1].clientX, dy = e.touches[0].clientY - e.touches[1].clientY;
    var d = Math.hypot(dx, dy);
    if (pinchD) Z = Math.max(ZMIN, Math.min(ZMAX, Z * (d / pinchD)));
    pinchD = d; draw();
  }
}, {passive: false});
cv.addEventListener('touchend', function(){ pinchD = null; });

resize(); refreshHUD(); draw();
"""

stamps = '\n'.join('<!-- engine-md5:%s:%s -->' % (m, md5s[m]) for m in MODULES)

html = """<!doctype html><html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<title>BOHEMIA MAP</title>
%s
<style>
  html,body{margin:0;padding:0;background:#0d0b08;overflow:hidden;height:100%%;touch-action:none}
  #cv{display:block;width:100%%;height:calc(100%% - 34px);background:#0d0b08}
  #hud{position:absolute;bottom:0;left:0;right:0;height:34px;display:flex;align-items:center;
    padding:0 10px;font:11px ui-monospace,monospace;color:#c9c1aa;background:#161310;
    border-top:1px solid #332e26;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
</style></head><body>
<canvas id="cv"></canvas>
<div id="hud"></div>
<script>
%s
</script>
<script>
%s
</script>
</body></html>""" % (stamps, engine, GAME)

with open(OUT, 'w', encoding='utf8') as f:
    f.write(html)
print('map tab -> %s (%d KB)' % (OUT, len(html) // 1024))
for m in MODULES:
    print('  %s md5 %s' % (m, md5s[m][:8]))
