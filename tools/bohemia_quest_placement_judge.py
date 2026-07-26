#!/usr/bin/env python3
"""
BOHEMIA QUEST PLACEMENT JUDGE (7/26/26, WORLD lane) — WHERE DO THE NINE QUESTS HAPPEN?

Backlog WORLD-1: "Quest NPC placement CANDIDATES for the 9 live quests: propose
per-quest placements with reasons | rendered on the map for one-look judging |
never place canon yourself | [PENDING Paolo verdict to apply]."

WHAT PAOLO SEES: the real valley from above with a pin per candidate, then one card
per quest holding THREE side-by-side options — WHERE IT IS NOW (the anchor: exactly
what the shipped engine casts today), BEST SETTING (the district whose own dossier
owns the quest's own words), and SHORT WALK (the best fit close to the faction the
quest itself demands). Each option carries a REAL render of that cell (the same
world model the MAP tab draws, inlined here, generated live in the page — not a
mockup, not a screenshot) and plain-English reasons. He taps one per quest, or
NONE OF THESE, and exports .txt.

MAP LAW HELD: nothing here designs a map. The candidates come out of
engine/bohemia_quest_placement.js, which only crosses the quest's OWN prose with
each district's OWN dossier over the ALREADY-GENERATED valley. The pick is Paolo's;
applying it is a separate turn on his verdict.

ONE VALLEY: the map is built at the seed the PHONE actually runs (the loop's
'bohemia' seed, hashed by the engine itself and baked in below), so a pin here is
the same tile the quest is cast to in the game.

REUSE CHECK: no graphic pixels are cooked here at all — every pixel on this page is
rendered by the SHIPPED district generators through bohemia_world.js (the same 44
modules tools/bohemia_map_tab.py inlines, same load order, same per-cell render at
native 128x128), so banks/ has nothing to offer and nothing was cooked. The
candidate reasons are text. The district dossiers are read verbatim from
records/tilespec/.

TASTE CHECK: laws/BOHEMIA_PAOLO_TASTE_CANON.md — no em dashes in UI copy, no purple
anywhere (the Amalgamation's alone), exports .txt never .json, SUN MODE
daylight-readable, comment box at the bottom always.

Reached from inside the alpha: LIFE tab -> hub -> WHERE THE QUESTS HAPPEN
(one-alpha law; a judge tool is never "the build").

Gate: gates/quest_placement_gate.js (byte-locks every inlined module, proves the
anchor equals the live engine's cast, proves determinism).

  python3 tools/bohemia_quest_placement_judge.py
    -> slices/BOHEMIA_QUEST_PLACEMENT_JUDGE_7_26_26.html
"""
import hashlib
import json
import os
import subprocess

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUT = 'slices/BOHEMIA_QUEST_PLACEMENT_JUDGE_7_26_26.html'

# same 44 modules, same load order as tools/bohemia_map_tab.py (world.js LAST)
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
    'engine/bohemia_cityhall.js', 'engine/bohemia_battery.js', 'engine/bohemia_terminal.js', 'engine/bohemia_arterial.js', 'engine/bohemia_freeway.js', 'engine/bohemia_terrain_noise.js',
    'engine/bohemia_desert.js', 'engine/bohemia_mountain.js', 'engine/bohemia_water.js',
    'engine/bohemia_overmap.js', 'engine/bohemia_overmap_bridge.js', 'engine/bohemia_blockgen.js',
    'engine/bohemia_floorplan.js', 'engine/bohemia_garage.js', 'engine/bohemia_crypt.js',
    'engine/bohemia_world.js',
]

# ---------------------------------------------------------------------------
# THE REAL DATA, FROM THE REAL ENGINE. Booting the actual loop is the only way the
# anchor can be the SHIPPED cast rather than a second implementation of it.
# ---------------------------------------------------------------------------
NODE = r'''
var fs = require('fs'), path = require('path');
var BQ = require('./engine/bohemia_bq.js');
var Loop = require('./engine/bohemia_loop.js');
var E = require('./engine/bohemia_engine.js');
var P = require('./engine/bohemia_quest_placement.js');
var World = require('./engine/bohemia_world.js');

var SEED_TEXT = 'bohemia';
var ctx = Loop.boot({ seed: SEED_TEXT });
var seedNum = E.WorldGen.hashSeed(SEED_TEXT);
var w = ctx.worldMap.real;

// district dossiers — each district module's OWN generated notes + legend
var DD = 'records/tilespec', dossiers = {};
fs.readdirSync(DD).filter(function (f) { return /^BOHEMIA_TILESPEC_.*\.md$/.test(f); })
  .forEach(function (f) {
    dossiers[f.replace('BOHEMIA_TILESPEC_', '').replace('.md', '')] =
      fs.readFileSync(path.join(DD, f), 'utf8');
  });
var vocab = P.buildVocab(dossiers);

// the nine canon quests + where the SHIPPED engine casts each one today
var quests = {}, meta = {};
fs.readdirSync('quests/bq').filter(function (f) { return /\.bq$/.test(f); }).sort()
  .forEach(function (f) {
    var text = fs.readFileSync(path.join('quests/bq', f), 'utf8');
    var Q = BQ.parse(text);
    var at = ctx.quests.castTarget(Q);
    var cell = w.at(at.x, at.y);
    at.kind = cell ? cell.district : null;
    quests[f] = { id: Q.id, title: Q.title, text: text, anchor: at };
    var premise = [];
    if (Q.talks[0]) Q.talks[0].says.forEach(function (s) { premise.push(s.text); });
    meta[f] = { id: Q.id, title: Q.title, act: Q.act, once: Q.once, premise: premise,
                speaker: at.speaker, channel: at.channel, demanded: at.faction };
  });

var batch = P.batch({
  worldMap: ctx.worldMap,
  owner: function (id) { return ctx.factions.owner.get(id) || null; },
  vocab: vocab, quests: quests
});

// ---- the overview: one kind per cell, cheap (w.at only, never w.plot) ----
var N = w.n, kinds = [], kindIx = {}, rows = [];
for (var y = 0; y < N; y++) {
  var row = [];
  for (var x = 0; x < N; x++) {
    var c = w.at(x, y);
    var k = c ? c.district : 'void';
    if (kindIx[k] == null) { kindIx[k] = kinds.length; kinds.push(k); }
    row.push(kindIx[k]);
  }
  rows.push(row);
}

// ---- a representative colour per district kind: the MODAL palette colour of a
//      real generated cell of that kind. The district's own material, not a
//      decorative palette invented here. Terrain/road kinds have no generator, so
//      they fall back to the FILL table the aerial + MAP tab already use.
var FILL = {
  mountain:'#3b352b', desert:'#8a7a58', wash:'#6f6547', water:'#2f5a6e', dam:'#7a746a',
  strip:'#5a5350', resort:'#6a6050', mall:'#5a544a', casino:'#645a52', stadium:'#4a5a44',
  speedway:'#4a4640', convention:'#54504a', waterpark:'#3a6a72', minigp:'#4a4640', estate:'#6a6250',
  airport:'#565048', airbase:'#4e4a40', campus:'#5a6250', rail:'#463f36', town:'#5f584c',
  golf:'#4a5e3c', gated:'#6a6250', ballpark:'#4a5a44', fort:'#4e4a40', strat:'#645a58',
  reclaim:'#5a5040', datafort:'#454048', warehouse:'#524c44', railyard:'#463f36', watertreat:'#4c5a58',
  springs:'#2f5a6e', freeway:'#33333c', arterial:'#33333c', beltway:'#33333c', interchange:'#2b2b31',
  'void':'#161410', default:'#4a463c'
};
var MODFILE = __MODFILE__;
var firstCellOf = {};
ctx.worldMap.districts.forEach(function (d) { if (!firstCellOf[d.kind]) firstCellOf[d.kind] = d.pos; });
var kindColor = {};
kinds.forEach(function (k) {
  var pos = firstCellOf[k];
  if (pos) {
    try {
      var plot = w.plot(pos[0], pos[1]);
      var mod = MODFILE[k] ? require('./' + MODFILE[k]) : null;
      var pal = (mod && mod.palette) ? mod.palette : null;
      var g = plot && plot.block ? plot.block.grid : null;
      if (g) {
        var count = {};
        for (var yy = 0; yy < g.length; yy++) {
          var r = g[yy] || [];
          for (var xx = 0; xx < r.length; xx++) { var cd = r[xx] || 0; count[cd] = (count[cd] || 0) + 1; }
        }
        /* The cell's AVERAGE colour — literally what that district looks like from
           altitude, mixed from its own palette over its own generated grid (code 0 =
           the kit's dead ground, painted the same '#231f18' the per-cell renderer
           uses). Averaging, not modal: a suburb and a warehouse yard both have
           asphalt as their single most common tile, so the mode makes different
           districts identical while the mix keeps them apart. */
        var rs = 0, gs = 0, bs = 0, tot = 0;
        Object.keys(count).forEach(function (cd) {
          var hex = (cd === '0') ? '#231f18' : (pal && pal[cd] ? pal[cd] : null);
          if (!hex || hex.charAt(0) !== '#' || hex.length !== 7) return;
          var n = count[cd];
          rs += parseInt(hex.substr(1, 2), 16) * n;
          gs += parseInt(hex.substr(3, 2), 16) * n;
          bs += parseInt(hex.substr(5, 2), 16) * n;
          tot += n;
        });
        if (tot) {
          var hx = function (v) { var t = Math.round(v / tot).toString(16); return t.length < 2 ? '0' + t : t; };
          kindColor[k] = '#' + hx(rs) + hx(gs) + hx(bs);
        }
      }
    } catch (e) { /* a kind whose generator refuses this cell keeps the FILL tone */ }
  }
  if (!kindColor[k]) kindColor[k] = FILL[k] || FILL.default;
});

process.stdout.write(JSON.stringify({
  seedText: SEED_TEXT, seed: seedNum, n: N,
  kinds: kinds, kindColor: kindColor, cells: rows,
  meta: meta, batch: batch
}));
'''

MODFILE = {k: 'engine/bohemia_%s.js' % ('suburb' if k in ('gated', 'estate') else k)
           for k in ('suburb', 'gated', 'estate', 'apartment', 'commercial', 'industrial',
                     'medical', 'solar', 'park', 'wash', 'cemetery', 'drivein', 'golf',
                     'stadium', 'truckstop', 'school', 'firestation', 'swapmeet', 'storage',
                     'watertreat', 'boneyard', 'policestation', 'library', 'landfill',
                     'railyard', 'substation', 'chapel', 'courthouse', 'jail', 'farm',
                     'downtown', 'trailer', 'warehouse', 'waterpark', 'mall', 'cityhall',
                     'battery', 'terminal', 'arterial', 'freeway', 'desert', 'mountain', 'water')}

data = json.loads(subprocess.run(['node', '-e', NODE.replace('__MODFILE__', json.dumps(MODFILE))],
                                 capture_output=True, text=True, check=True).stdout)

# a per-kind palette for the page's cell renderer (module global name per kind),
# identical mapping to tools/bohemia_map_tab.py's MODMAP
MODMAP = {
    'suburb': 'BohemiaSuburb', 'gated': 'BohemiaSuburb', 'estate': 'BohemiaSuburb',
    'apartment': 'BohemiaApartment', 'commercial': 'BohemiaCommercial',
    'industrial': 'BohemiaIndustrial', 'medical': 'BohemiaMedical', 'solar': 'BohemiaSolar',
    'park': 'BohemiaPark', 'wash': 'BohemiaWash', 'cemetery': 'BohemiaCemetery',
    'drivein': 'BohemiaDrivein', 'golf': 'BohemiaGolf', 'stadium': 'BohemiaStadium',
    'truckstop': 'BohemiaTruckstop', 'school': 'BohemiaSchool', 'firestation': 'BohemiaFirestation',
    'swapmeet': 'BohemiaSwapmeet', 'storage': 'BohemiaStorage', 'watertreat': 'BohemiaWatertreat',
    'boneyard': 'BohemiaBoneyard', 'policestation': 'BohemiaPolicestation',
    'library': 'BohemiaLibrary', 'landfill': 'BohemiaLandfill', 'railyard': 'BohemiaRailyard',
    'substation': 'BohemiaSubstation', 'chapel': 'BohemiaChapel', 'courthouse': 'BohemiaCourthouse',
    'jail': 'BohemiaJail', 'farm': 'BohemiaFarm', 'downtown': 'BohemiaDowntown',
    'trailer': 'BohemiaTrailer', 'warehouse': 'BohemiaWarehouse', 'waterpark': 'BohemiaWaterpark',
    'mall': 'BohemiaMall', 'cityhall': 'BohemiaCityhall', 'battery': 'BohemiaBattery',
    'terminal': 'BohemiaTerminal', 'arterial': 'BohemiaArterial', 'freeway': 'BohemiaFreeway', 'desert': 'BohemiaDesert', 'mountain': 'BohemiaMountain', 'water': 'BohemiaWater',
}

bodies = {m: open(m, encoding='utf8').read() for m in MODULES}
md5s = {m: hashlib.md5(bodies[m].encode('utf8')).hexdigest() for m in MODULES}
engine = '\n'.join('/* ==== %s ==== */\n%s' % (m, bodies[m]) for m in MODULES)
stamps = '\n'.join('<!-- engine-md5:%s:%s -->' % (m, md5s[m]) for m in MODULES)

PAGE = r"""<!doctype html><html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>BOHEMIA - WHERE THE QUESTS HAPPEN</title>
__STAMPS__
<style>
  html,body{margin:0;background:#0d0f0a;color:#ddd;font-family:-apple-system,sans-serif}
  #bar{position:sticky;top:0;z-index:9;background:#0d0f0a;padding:10px 12px;display:flex;gap:8px;
       align-items:center;flex-wrap:wrap;border-bottom:1px solid #2a2a1f}
  #hdr{font:700 15px -apple-system,sans-serif;color:#cdbd8a;flex:1}
  button{font:600 13px -apple-system,sans-serif}
  .btn{padding:9px 13px;border-radius:8px;border:1px solid #887;background:#222;color:#ddd}
  .go{background:#3f8c3f;color:#fff;border:0}
  #intro{font:12px/1.6 -apple-system,sans-serif;color:#8f8770;padding:12px 14px 0;max-width:760px}
  .card{margin:14px 12px;border-radius:12px;padding:14px;background:#181a12;border:1px solid #2a2a1f}
  .qt{font:700 16px -apple-system,sans-serif;color:#cdbd8a}
  .qm{font:11px ui-monospace,monospace;color:#8f8770;margin-top:3px}
  .prem{font:13px/1.6 -apple-system,sans-serif;margin:9px 0 4px;color:#c8c0a8}
  .opts{display:flex;gap:7px;padding:8px 0 2px}
  .opt{flex:1 1 0;min-width:0;border-radius:10px;padding:6px;background:#12140d;
       border:2px solid #2a2a1f}
  .opt.sel{border-color:#3f8c3f}
  .opt.focus{border-color:#c79a3f}
  .oh{font:700 9px -apple-system,sans-serif;letter-spacing:0.5px;color:#c79a3f;text-align:center}
  .ok{font:9px ui-monospace,monospace;color:#9a9480;margin:2px 0 4px;text-align:center;
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .detail{margin-top:10px;padding:11px;border-radius:10px;background:#12140d}
  .dh{font:700 12px -apple-system,sans-serif;letter-spacing:1px}
  canvas.thumb{width:100%;aspect-ratio:1/1;image-rendering:pixelated;border-radius:8px;background:#0a0c08;display:block}
  .rs{font:12px/1.5 -apple-system,sans-serif;color:#b0a890;margin-top:7px}
  .rs div{margin-bottom:5px}
  .pick{width:100%;margin-top:9px;padding:10px;border-radius:9px;border:0;background:#2a2a1f;color:#ddd}
  .pick.on{background:#3f8c3f;color:#fff}
  textarea{width:100%;padding:9px;border-radius:9px;border:1px solid #888;box-sizing:border-box;
           background:#111;color:#ddd;font:13px sans-serif;margin-top:8px}
  #mapwrap{position:relative;margin:12px;border-radius:12px;overflow:hidden;border:1px solid #2a2a1f}
  #valley{width:100%;display:block;image-rendering:pixelated;background:#0d0b08}
  #pins{position:absolute;inset:0;width:100%;height:100%}
  .legend{font:10px ui-monospace,monospace;color:#8f8770;padding:0 14px}
</style></head>
<body id="bd">
<div id="bar">
  <div id="hdr">WHERE THE QUESTS HAPPEN <span id="tally" style="font:600 11px monospace;color:#8f8770"></span></div>
  <button id="sun" class="btn">&#9728; SUN MODE</button>
  <button id="exp" class="btn go">&#10515; EXPORT .txt</button>
</div>
<div id="intro">
  Nine real quests are live in the phone, and right now the engine drops every single
  one of them in a generic suburb tract, because that is where the factions happen to
  be based. This page proposes better addresses. Each quest gets three options: where
  it sits NOW, the district whose own build notes match the quest's own words, and the
  best match that is still a short walk away. The map is the real valley, at the seed
  the game runs. Tap the one you want per quest, or NONE OF THESE, then export.
</div>
<div id="mapwrap"><canvas id="valley"></canvas><svg id="pins" viewBox="0 0 96 96" preserveAspectRatio="none"></svg></div>
<div class="legend" id="leg"></div>
<div id="list"></div>
<div style="padding:16px 14px 60px;max-width:760px">
  <div id="gcap" style="font:12px sans-serif;color:#8f8770;margin-bottom:4px">PAOLO COMMENTS (rides the export):</div>
  <textarea id="gc" rows="5"></textarea>
</div>
<script>__ENGINE__</script>
<script>
/* ===== the real valley, at the seed the PHONE runs ===== */
var D = __DATA__;
var W = BohemiaWorld.world(D.seed);
var MODMAP = __MODMAP__;
function modOf(k){ var n = MODMAP[k]; return n ? window[n] : null; }
var FILLC = {};
D.kinds.forEach(function(k,i){ FILLC[i] = D.kindColor[k]; });

/* ---- the overview: one pixel per overmap cell, straight from D.cells ---- */
(function(){
  var cv = document.getElementById('valley');
  cv.width = D.n; cv.height = D.n;
  var cx = cv.getContext('2d');
  for (var y=0; y<D.n; y++){
    var row = D.cells[y];
    for (var x=0; x<D.n; x++){ cx.fillStyle = FILLC[row[x]] || '#161410'; cx.fillRect(x,y,1,1); }
  }
})();

/* ---- a candidate cell, rendered for real: the SHIPPED district generator's own
       grid + its own palette at native 128x128, same path the MAP tab draws. ---- */
var cellCache = {};
function renderCell(ox, oy, into){
  var key = ox+','+oy, cv = cellCache[key];
  if (!cv){
    cv = document.createElement('canvas'); cv.width = 128; cv.height = 128;
    var cx = cv.getContext('2d');
    var cell = W.at(ox, oy), plot = null;
    try { plot = W.plot(ox, oy); } catch(e){ plot = null; }
    if (plot && plot.block && plot.block.grid && plot.legend){
      var g = plot.block.grid, mod = modOf(cell ? cell.district : null);
      var pal = (mod && mod.palette) ? mod.palette : {};
      for (var ty=0; ty<128; ty++){
        var row = g[ty] || [], i = 0;
        while (i < 128){
          var code = row[i] != null ? row[i] : 0, j = i;
          while (j < 128 && (row[j] != null ? row[j] : 0) === code) j++;
          cx.fillStyle = code === 0 ? '#231f18' : (pal[code] || '#3a352b');
          cx.fillRect(i, ty, j-i, 1);
          i = j;
        }
      }
    } else {
      cx.fillStyle = (cell && D.kindColor[cell.district]) || '#3a352b';
      cx.fillRect(0,0,128,128);
    }
    cellCache[key] = cv;
  }
  into.width = 128; into.height = 128;
  into.getContext('2d').drawImage(cv, 0, 0);
}

/* ===== judging state ===== */
var SUN = false, pick = {}, focus = {}, comments = {};
var STRAT = { anchor:'WHERE IT IS NOW', setting:'BEST SETTING', nearby:'SHORT WALK' };
var STRATC = { anchor:'#8f8770', setting:'#c79a3f', nearby:'#6a9ac7' };

function tally(){
  var n = 0; D.batch.forEach(function(q){ if (pick[q.questId]) n++; });
  document.getElementById('tally').textContent = '('+n+' of '+D.batch.length+' picked)';
}

function drawPins(){
  var svg = document.getElementById('pins');
  svg.setAttribute('viewBox','0 0 '+D.n+' '+D.n);
  var s = '';
  D.batch.forEach(function(q, qi){
    q.candidates.forEach(function(c){
      var chosen = pick[q.questId] === c.strategy;
      var col = STRATC[c.strategy];
      s += '<circle cx="'+(c.x+0.5)+'" cy="'+(c.y+0.5)+'" r="'+(chosen?2.4:1.6)+'" fill="'+col
         + '" fill-opacity="'+(chosen?0.95:0.55)+'" stroke="#0d0f0a" stroke-width="0.4"></circle>';
      s += '<text x="'+(c.x+0.5)+'" y="'+(c.y+1.1)+'" font-size="2.2" text-anchor="middle" '
         + 'fill="#0d0f0a" font-family="monospace">'+(qi+1)+'</text>';
    });
  });
  svg.innerHTML = s;
}

function build(){
  document.body.style.background = SUN ? '#efe7cf' : '#0d0f0a';
  document.getElementById('bar').style.background = SUN ? '#efe7cf' : '#0d0f0a';
  document.getElementById('hdr').style.color = SUN ? '#3a3320' : '#cdbd8a';
  document.getElementById('intro').style.color = SUN ? '#6a6045' : '#8f8770';
  document.getElementById('gcap').style.color = SUN ? '#6a6045' : '#8f8770';
  var gc = document.getElementById('gc');
  gc.style.background = SUN ? '#fff' : '#111'; gc.style.color = SUN ? '#222' : '#ddd';

  var leg = document.getElementById('leg');
  leg.style.color = SUN ? '#6a6045' : '#8f8770';
  leg.innerHTML = 'PINS: grey = where it is now &#183; amber = best setting &#183; blue = short walk. '
                + 'The number is the quest, in the order below.';

  var list = document.getElementById('list');
  list.innerHTML = '';
  D.batch.forEach(function(q, qi){
    var m = D.meta[q.file] || {};
    var card = document.createElement('div');
    card.className = 'card';
    card.style.background = SUN ? '#e4dbc0' : '#181a12';
    card.style.borderColor = SUN ? '#c9bd9a' : '#2a2a1f';

    var t = document.createElement('div');
    t.className = 'qt'; t.style.color = SUN ? '#3a3320' : '#cdbd8a';
    t.textContent = (qi+1) + '. ' + (m.title || q.questId);
    card.appendChild(t);

    var mm = document.createElement('div');
    mm.className = 'qm'; mm.style.color = SUN ? '#7a6f50' : '#8f8770';
    mm.textContent = (m.demanded ? ('needs the ' + m.demanded) : 'needs nobody in particular')
      + '  ·  ' + (m.channel === 'inperson' ? 'IN PERSON ONLY (no phone)' : 'picked up over the phone')
      + (m.speaker ? ('  ·  ' + m.speaker) : '');
    card.appendChild(mm);

    if (m.premise && m.premise.length){
      var p = document.createElement('div');
      p.className = 'prem'; p.style.color = SUN ? '#3a3320' : '#c8c0a8';
      p.textContent = '“' + m.premise[0] + '”';
      card.appendChild(p);
    }

    var opts = document.createElement('div');
    opts.className = 'opts';
    var detail = document.createElement('div');
    detail.className = 'detail';
    detail.style.background = SUN ? '#d8ceae' : '#12140d';

    /* THREE RENDERS SIDE BY SIDE, always all three on screen at once (the anchor is
       the approved thing the two candidates are being compared against). Tap one to
       read why it was proposed and to take it. */
    function showDetail(c){
      detail.innerHTML = '';
      var h = document.createElement('div');
      h.className = 'dh'; h.style.color = STRATC[c.strategy];
      h.textContent = STRAT[c.strategy] + '  ·  ' + c.kind.toUpperCase()
        + '  ·  X' + c.x + ' Y' + c.y + (c.dist ? ('  ·  ' + c.dist + ' cells out') : '');
      detail.appendChild(h);
      var rs = document.createElement('div');
      rs.className = 'rs'; rs.style.color = SUN ? '#4a4230' : '#b0a890';
      c.reasons.forEach(function(r){
        var d = document.createElement('div'); d.textContent = r; rs.appendChild(d);
      });
      detail.appendChild(rs);
      var b = document.createElement('button');
      b.className = 'pick' + (pick[q.questId] === c.strategy ? ' on' : '');
      b.textContent = pick[q.questId] === c.strategy ? '\u2713 PICKED' : 'PUT IT HERE';
      b.onclick = function(){
        pick[q.questId] = (pick[q.questId] === c.strategy) ? null : c.strategy;
        focus[q.questId] = c.strategy;
        build(); drawPins();
      };
      detail.appendChild(b);
    }

    var focused = focus[q.questId] || pick[q.questId];
    if (!focused || focused === 'none') {
      var pref = q.candidates.filter(function(c){ return c.strategy === 'setting'; })[0];
      focused = pref ? pref.strategy : q.candidates[0].strategy;
    }

    q.candidates.forEach(function(c){
      var o = document.createElement('div');
      o.className = 'opt' + (pick[q.questId] === c.strategy ? ' sel'
                    : (focused === c.strategy ? ' focus' : ''));
      o.style.background = SUN ? '#d8ceae' : '#12140d';

      var h = document.createElement('div');
      h.className = 'oh'; h.style.color = STRATC[c.strategy];
      h.textContent = STRAT[c.strategy];
      o.appendChild(h);

      var k = document.createElement('div');
      k.className = 'ok'; k.style.color = SUN ? '#5a5138' : '#9a9480';
      k.textContent = c.kind.toUpperCase();
      o.appendChild(k);

      var cv = document.createElement('canvas');
      cv.className = 'thumb';
      o.appendChild(cv);
      renderCell(c.x, c.y, cv);

      o.onclick = function(){ focus[q.questId] = c.strategy; build(); };
      opts.appendChild(o);
      if (focused === c.strategy) showDetail(c);
    });
    card.appendChild(opts);
    card.appendChild(detail);

    var none = document.createElement('button');
    none.className = 'pick' + (pick[q.questId] === 'none' ? ' on' : '');
    none.style.marginTop = '10px';
    none.textContent = pick[q.questId] === 'none' ? '✓ NONE OF THESE' : 'NONE OF THESE';
    none.onclick = function(){
      pick[q.questId] = (pick[q.questId] === 'none') ? null : 'none';
      build(); drawPins();
    };
    card.appendChild(none);

    var cm = document.createElement('textarea');
    cm.rows = 2; cm.placeholder = 'where should ' + (m.title || q.questId) + ' happen?';
    cm.value = comments[q.questId] || '';
    cm.style.background = SUN ? '#fff' : '#111'; cm.style.color = SUN ? '#222' : '#ddd';
    cm.oninput = function(){ comments[q.questId] = cm.value; };
    card.appendChild(cm);

    list.appendChild(card);
  });
  tally();
}

function exportTxt(){
  var L = [];
  L.push('BOHEMIA QUEST PLACEMENT VERDICT - WHERE THE NINE QUESTS HAPPEN');
  L.push('valley seed: ' + D.seedText + ' (the seed the phone runs)');
  L.push('');
  D.batch.forEach(function(q, qi){
    var m = D.meta[q.file] || {};
    var p = pick[q.questId];
    L.push((qi+1) + '. ' + (m.title || q.questId) + '   (' + q.file + ')');
    if (!p) L.push('    [UNPICKED]');
    else if (p === 'none') L.push('    [NONE OF THESE]');
    q.candidates.forEach(function(c){
      L.push('    ' + (p === c.strategy ? '[PICKED] ' : '        ')
             + STRAT[c.strategy] + ': ' + c.kind + ' X' + c.x + ' Y' + c.y
             + (c.owner ? (' held by ' + c.owner) : ' unheld')
             + (c.dist ? (' (' + c.dist + ' cells out)') : ''));
    });
    if (comments[q.questId]) L.push('    comment: ' + comments[q.questId]);
    L.push('');
  });
  L.push('PAOLO COMMENTS:');
  L.push(document.getElementById('gc').value || '(none)');
  var blob = new Blob([L.join('\n')], {type:'text/plain'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'BOHEMIA_QUEST_PLACEMENT_VERDICT_7_26_26.txt';
  a.click();
}

document.getElementById('sun').onclick = function(){ SUN = !SUN; build(); };
document.getElementById('exp').onclick = exportTxt;
build(); drawPins();
</script>
</body></html>
"""

html = (PAGE.replace('__STAMPS__', stamps)
            .replace('__ENGINE__', engine)
            .replace('__MODMAP__', json.dumps(MODMAP))
            .replace('__DATA__', json.dumps(data)))
open(OUT, 'w', encoding='utf-8').write(html)
picks = sum(len(q['candidates']) for q in data['batch'])
print('built %s (%d quests, %d candidates, %d bytes, seed %s)'
      % (OUT, len(data['batch']), picks, len(html), data['seed']))
