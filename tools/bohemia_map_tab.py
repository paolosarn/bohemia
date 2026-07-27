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
import subprocess

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
    'engine/bohemia_cityhall.js', 'engine/bohemia_battery.js', 'engine/bohemia_terminal.js', 'engine/bohemia_arterial.js', 'engine/bohemia_freeway.js', 'engine/bohemia_terrain_noise.js', 'engine/bohemia_airfield.js',
    'engine/bohemia_rail.js', 'engine/bohemia_interchange.js',
    'engine/bohemia_desert.js', 'engine/bohemia_mountain.js', 'engine/bohemia_water.js',
    'engine/bohemia_overmap.js', 'engine/bohemia_overmap_bridge.js', 'engine/bohemia_blockgen.js',
    'engine/bohemia_floorplan.js', 'engine/bohemia_garage.js', 'engine/bohemia_crypt.js',
    'engine/bohemia_world.js',
    'engine/bohemia_valleymap.js',
]
# SEED_NOTE: ask the ENGINE what 'bohemia' hashes to rather than restating the
# number here, so the map can never drift from the seed the loop actually boots.
SEED = int(subprocess.run(
    ['node', '-e', "process.stdout.write(String(require('./engine/bohemia_engine.js').WorldGen.hashSeed('bohemia')))"],
    capture_output=True, text=True, check=True).stdout.strip())

bodies = {m: open(m, encoding='utf8').read() for m in MODULES}
md5s = {m: hashlib.md5(bodies[m].encode('utf8')).hexdigest() for m in MODULES}
engine = '\n'.join('/* ==== %s ==== */\n%s' % (m, bodies[m]) for m in MODULES)

GAME = r"""
// ===== MAP TAB — the valley aerial, live, read-only =====
// ONE VALLEY (7/26/26, WORLD lane). This was 1337 while the game itself boots
// bohemia_loop.js on the text seed 'bohemia' — two different valleys, so the map
// Paolo explored was never the map the phone plays, and a quest cast to X29 Y77
// pointed at a tile that only existed in the other world. The seed below IS the
// engine's own hashSeed('bohemia'), computed by the engine at build time (see
// SEED_NOTE in tools/bohemia_map_tab.py) and baked as a fixed literal so the map
// stays reproducible. Change the game's seed text and rerun the tool; never
// hand-type a number here.
var SEED = __SEED__;
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
  trailer:'BohemiaTrailer', warehouse:'BohemiaWarehouse', waterpark:'BohemiaWaterpark', mall:'BohemiaMall',
  cityhall:'BohemiaCityhall', battery:'BohemiaBattery', terminal:'BohemiaTerminal', arterial:'BohemiaArterial', freeway:'BohemiaFreeway', desert:'BohemiaDesert', mountain:'BohemiaMountain', water:'BohemiaWater', airport:'BohemiaAirfield', airbase:'BohemiaAirfield'
};
function modOf(dist){ var n = MODMAP[dist]; return n ? window[n] : null; }

// THE ONE MAP (Paolo 7/27): these tables used to be a SECOND COPY, pasted here
// from tools/bohemia_aerial.js with a comment admitting it. Copies drift, and this
// exact class of drift already put the MAP tab on a different valley from the game
// for months. They now come from engine/bohemia_valleymap.js, which is the one copy
// the phone's map app reads too. Law: laws/BOHEMIA_ADDENDUM_ONE_MAP_7_27_26.md
var VM = BohemiaValleyMap;
var FILL = VM.FILL, ROADCOL = VM.ROADCOL, ROAD = VM.ROAD, TERRAIN = VM.TERRAIN, FABRIC = VM.FABRIC;

function rng(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1103515245+12345)>>>0; return s/4294967296; }; }
function seedOf(ox,oy){ return ((ox*73856093)^(oy*19349663))>>>0; }

// ---- per-cell render, cached at NATIVE 128x128 tile resolution (1 tile = 1 canvas px) ----
var cellCache = {};
function renderCell(ox, oy){
  var key = ox+','+oy;
  var hit = cellCache[key]; if (hit) return hit;
  var cv = document.createElement('canvas'); cv.width = 128; cv.height = 128;
  // the SHARED painter — the same pixels the phone's map app draws for this cell
  VM.paintCell(W, ox, oy, cv.getContext('2d'));
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
      ctx.fillStyle = VM.toneOf(W, x, y); ctx.fillRect(sx, sy, zc, zc);
    } else {
      var bmp = renderCell(x, y);
      ctx.drawImage(bmp, sx, sy, zc, zc);
    }
  }
  if (highlightMatches) {
    ctx.fillStyle = '#f0cd78'; ctx.strokeStyle = '#1a1610'; ctx.lineWidth = 1;
    var r = Math.max(3, Math.min(7, Z * 0.18));
    for (var hi = 0; hi < highlightMatches.length; hi++) {
      var hm = highlightMatches[hi];
      var hsx = (hm.x - px) * Z + w / 2 + Z / 2, hsy = (hm.y - py) * Z + h / 2 + Z / 2;
      if (hsx < -r || hsx > w + r || hsy < -r || hsy > h + r) continue;
      ctx.beginPath(); ctx.arc(hsx, hsy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
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
var highlightMatches = null, highlightLabel = '';
function refreshHUD(){
  if (!sel) {
    HUD.textContent = highlightMatches
      ? highlightMatches.length + ' ' + highlightLabel + ' shown on the map — drag/zoom to look, tap the map to clear.'
      : 'The valley, live — every district rendered by its own real generator. Drag to pan, wheel/pinch to zoom, tap a cell to inspect it.';
    return;
  }
  var c = W.at(sel[0], sel[1]);
  if (!c) { HUD.textContent = '(' + sel[0] + ',' + sel[1] + ') off the map'; return; }
  var mod = modOf(c.district);
  var desc = mod && mod.notes && mod.notes.summary ? mod.notes.summary :
    (ROAD[c.district] ? 'a mile arterial / freeway — the street grid' :
     TERRAIN[c.district] ? 'undeveloped terrain, no street access needed' :
     'a bespoke landmark type — reserved, not yet in the auto-factory');
  var tail = highlightMatches ? '  ·  ' + highlightMatches.length + ' ' + highlightLabel + ' shown' : '';
  HUD.textContent = '(' + sel[0] + ',' + sel[1] + ') ' + c.district.toUpperCase() + ' — ' + desc + tail;
}

var down = false, sx0 = 0, sy0 = 0, spx = 0, spy = 0, moved = 0;
cv.addEventListener('pointerdown', function(e){ down = true; sx0 = e.clientX; sy0 = e.clientY; spx = px; spy = py; moved = 0; cv.setPointerCapture(e.pointerId); if (findPanel.style.display === 'block') findPanel.style.display = 'none'; });
cv.addEventListener('pointermove', function(e){ if (!down) return; var dx = e.clientX - sx0, dy = e.clientY - sy0; moved += Math.abs(dx) + Math.abs(dy); px = spx - dx / Z; py = spy - dy / Z; draw(); });
cv.addEventListener('pointerup', function(e){
  down = false;
  if (moved < 6) {
    var w = cv.width, h = cv.height;
    var wx = Math.floor(px + (e.offsetX - w / 2) / Z), wy = Math.floor(py + (e.offsetY - h / 2) / Z);
    sel = [wx, wy]; highlightMatches = null; refreshHUD(); draw();
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

// ---- FIND (7/24/26): the first live consumer of world().districtsOfType/
// nearestDistrictOfType — read-only, matches the MAP tab's own tier (never
// build/demolish, just find and look). Lists every district TYPE that
// actually exists in this valley (queried once, not guessed), tap one to
// jump the camera to the nearest instance from wherever you're currently
// looking. Proves the location-query API on the real surface, not just a gate.
var findBtn = document.getElementById('findbtn'), findPanel = document.getElementById('findpanel');
var TYPE_LABEL = {
  suburb:'Suburb', gated:'Gated Suburb', estate:'Estate', apartment:'Apartment Complex',
  commercial:'Commercial', industrial:'Industrial', medical:'Hospital', solar:'Solar Farm',
  park:'Park', wash:'Flood Wash', cemetery:'Cemetery', drivein:'Drive-In', golf:'Golf Course',
  stadium:'Stadium', truckstop:'Truck Stop', school:'School', firestation:'Fire Station',
  swapmeet:'Swap Meet', storage:'Self-Storage', watertreat:'Water Treatment', boneyard:'Salvage Yard',
  policestation:'Police Station', library:'Library', landfill:'Landfill', railyard:'Railyard',
  substation:'Substation', chapel:'Church', courthouse:'Courthouse', jail:'Jail', farm:'Farm',
  downtown:'Downtown', trailer:'Trailer Park', warehouse:'Warehouse', waterpark:'Water Park',
  mall:'Mall', cityhall:'City Hall', battery:'Battery Storage', terminal:'Transit Terminal'
};
/* THE GROUND ITSELF IS FINDABLE (7/26). Terrain and roads are real generated ground
   now, and they are the biggest things in the valley, so FIND lists them alongside the
   districts. They are SURFACES, so they come from surfaceCellsOfType, not districtsOfType. */
var SURFACE_LABEL = { mountain:'Mountains', desert:'Open Desert', water:'The Lake',
                      arterial:'Mile Road', freeway:'Freeway' };
function buildFindList(){
  var present = [];
  for (var stype in SURFACE_LABEL) {
    var sn = W.surfaceCellsOfType(stype).length;
    if (sn > 0) present.push({type:stype, label:SURFACE_LABEL[stype], n:sn, surface:true});
  }
  for (var type in MODMAP) {
    var n = W.districtsOfType(type).length;
    if (n > 0) present.push({type:type, label:TYPE_LABEL[type] || type, n:n});
  }
  present.sort(function(a,b){ return a.label < b.label ? -1 : a.label > b.label ? 1 : 0; });
  findPanel.innerHTML = '';
  present.forEach(function(item){
    var row = document.createElement('div');
    row.className = 'finditem';
    row.textContent = item.label + '  ·  ' + item.n;
    row.addEventListener('pointerup', function(){
      var nearest = item.surface ? W.nearestSurfaceOfType(px, py, item.type)
                                 : W.nearestDistrictOfType(px, py, item.type);
      highlightMatches = item.surface ? W.surfaceCellsOfType(item.type)
                                      : W.districtsOfType(item.type);
      highlightLabel = item.label;
      if (nearest) { px = nearest.x; py = nearest.y; sel = [nearest.x, nearest.y]; }
      findPanel.style.display = 'none';
      refreshHUD(); draw();
    });
    findPanel.appendChild(row);
  });
}
findBtn.addEventListener('pointerup', function(e){
  e.stopPropagation();
  var open = findPanel.style.display === 'block';
  if (open) { findPanel.style.display = 'none'; return; }
  if (!findPanel.childElementCount) buildFindList();
  findPanel.style.display = 'block';
});
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
  #findbtn{position:absolute;top:10px;right:10px;font:11px ui-monospace,monospace;color:#f0cd78;
    background:#161310cc;border:1px solid #4a4030;border-radius:6px;padding:6px 12px;
    letter-spacing:1px;user-select:none}
  #findpanel{display:none;position:absolute;top:44px;right:10px;max-height:min(60vh,420px);
    overflow-y:auto;background:#161310ee;border:1px solid #4a4030;border-radius:6px;
    min-width:180px;font:11px ui-monospace,monospace}
  .finditem{padding:8px 12px;color:#c9c1aa;border-bottom:1px solid #241f18;white-space:nowrap}
  .finditem:last-child{border-bottom:none}
  .finditem:active{background:#2a2318;color:#f0cd78}
</style></head><body>
<canvas id="cv"></canvas>
<div id="hud"></div>
<div id="findbtn">FIND</div>
<div id="findpanel"></div>
<script>
%s
</script>
<script>
%s
</script>
</body></html>""" % (stamps, engine, GAME.replace('__SEED__', str(SEED)))

with open(OUT, 'w', encoding='utf8') as f:
    f.write(html)
print('map tab -> %s (%d KB)' % (OUT, len(html) // 1024))
for m in MODULES:
    print('  %s md5 %s' % (m, md5s[m][:8]))
