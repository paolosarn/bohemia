/* build_run_slice.js — regenerate slices/BOHEMIA_RUN_CURRENT.html (the file the
   alpha's RUN tab loads in an iframe) from the dev source
   slices/BOHEMIA_RUN_SLICE_7_26_26.html, by INLINING every engine module it
   references so the run is fully self-contained (works standalone on Pages/main,
   no external refs). Same shape, same canonical module order, and the same
   freshness contract as tools/build_current_slice.js — one embed order everywhere.

   REUSE CHECK (REUSE-FIRST LAW, Paolo 7/22): before any pixel of the run's look
   was considered, this builder opens slices/BOHEMIA_SUBURB_WALK_7_18_26.html —
   the APPROVED dressed block (canon doors 7/21 + the approved house-skin roofs,
   yards and walls) — and lifts its art-bank block VERBATIM into the run page.
   Nothing new was cooked: the run wears the exact bytes Paolo already approved.

   Flow:
     1) edit slices/BOHEMIA_RUN_SLICE_7_26_26.html  (references ../engine, easy to edit)
     2) node tools/build_run_slice.js               (regenerates the self-contained run)
     3) node gates/run_gate.js                      (plays the whole loop headless)
     4) push slices/BOHEMIA_RUN_CURRENT.html (Pages serves main) */
'use strict';
var fs = require('fs');

var SRC  = 'slices/BOHEMIA_RUN_SLICE_7_26_26.html';
var OUT  = 'slices/BOHEMIA_RUN_CURRENT.html';
var WALK = 'slices/BOHEMIA_SUBURB_WALK_7_18_26.html';   // the APPROVED dressed block

var html = fs.readFileSync(SRC, 'utf8');

/* ---- the real canon faction graph (GDD v2 §9). Must be a real JS value before
   bohemia_loop.js's script runs (a bare {...} at script top level parses as a
   block, not an object), exactly as the phone slice does it. ---- */
if (html.indexOf('__FACTION_GRAPH_JSON__') < 0) throw new Error('missing __FACTION_GRAPH_JSON__ placeholder');
html = html.replace('__FACTION_GRAPH_JSON__', fs.readFileSync('engine/BOHEMIA_faction_graph.json', 'utf8').trim());

/* ---- THE NINE REAL CANON QUESTS, verbatim, as a JSON array of source strings:
   the SAME bytes gates/bohemia_canon_quests_gate.js proves playable. There is no
   second, drifting copy of a quest anywhere. ---- */
if (html.indexOf('__CANON_QUESTS_JSON__') < 0) throw new Error('missing __CANON_QUESTS_JSON__ placeholder');
var BQ_DIR = 'quests/bq';
var bqFiles = fs.readdirSync(BQ_DIR).filter(function (f) { return /\.bq$/.test(f); }).sort();
if (!bqFiles.length) throw new Error('no .bq canon quests found in ' + BQ_DIR);
html = html.replace('__CANON_QUESTS_JSON__', JSON.stringify(bqFiles.map(function (f) {
  return fs.readFileSync(BQ_DIR + '/' + f, 'utf8');
})));

/* ---- THE APPROVED ART BANKS, lifted verbatim from the approved walk surface.
   The block runs from `var DOOR_B64=[` through the `lampAt` helper: the canon
   door bank + the approved roof/yard/wall skins and their pickers. ---- */
var walk = fs.readFileSync(WALK, 'utf8');
var a = walk.indexOf('var DOOR_B64=[');
var bMark = 'function lampAt(';
var b = walk.indexOf(bMark, a);
if (a < 0 || b < 0) throw new Error('could not find the approved art banks in ' + WALK);
var end = walk.indexOf('\n', b);
var banks = walk.slice(a, end);
if (banks.indexOf('ROOF_IMG') < 0 || banks.indexOf('YARD_IMG') < 0 ||
    banks.indexOf('WALL_IMG') < 0 || banks.indexOf('DOOR_B64') < 0) {
  throw new Error('the lifted art block is missing one of the approved banks');
}
/* ---- RUN PERIMETER (7/28, Paolo: "i went on the run and the suburb border
   walls are not changed its still the house tiles"). He was right and it was
   worse than a wiring slip: the run returned 'wall_base' for the suburb
   perimeter, which is the SAME starter-tileset tile its own bodyTile() lays as
   the bottom course of a house. His 13 approved border walls - 61 candidates
   judged down over two sessions - had never existed in this renderer at all.
   The tan half of the pool comes in verbatim, like the door bank. ---- */
var PERIM_POOL = 'banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt';
var perimBank = JSON.parse(fs.readFileSync(PERIM_POOL, 'utf8'));
var perimTan = perimBank.pool.filter(function (p) { return p.variant === 'tan'; }).map(function (p) { return p.b64; });
if (perimTan.length < 12) throw new Error('the approved suburb border walls are missing from ' + PERIM_POOL);
if (html.indexOf('__PERIM_B64_JSON__') < 0) throw new Error('missing __PERIM_B64_JSON__ placeholder');
html = html.replace('__PERIM_B64_JSON__', JSON.stringify(perimTan));

/* ---- BOUGHT BEATS PAINTED (Paolo 7/31, LOCKED: "if i bought it i prefer it!
   Thats for all textures bro!!!"). His purchased, seam-processed ground library.
   These are the tiles he PAID FOR; the painted starter-set ground tiles are the
   fallback, never the first choice. Lifted VERBATIM at 44x44, which is exactly the
   corpus cell, so every one blits 1:1 and nothing is ever resampled.
   Only tier S/A (seam-ready) and only pure=true (PURPLE RESERVATION holds). ---- */
var GROUND_LIB = 'banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt';
var groundBank = JSON.parse(fs.readFileSync(GROUND_LIB, 'utf8'));
function boughtGround(match) {
  return groundBank.tiles.filter(function (t) {
    var pack = String(t.pack || '').toLowerCase();
    return match.test(pack) && (t.tier === 'S' || t.tier === 'A') && t.pure === true && t.b64;
  }).map(function (t) { return t.b64; });
}
var boughtRoad = boughtGround(/cracked street/);

/* ---- THE YARD IS HIS NOW TOO (Paolo 7/31: "Is there anyway u can just implement
   them back right now please what I approved and the loo of thigs were going for").
   Screenshot records/target/STREET_BEFORE_YARD.png is the argument: his bought road
   and sidewalk are rich, cracked, weeded, detailed, and then the yard directly below
   them was a FLAT PAINTED TAN NOISE FIELD. Same frame, two different games. The yard
   is the largest single surface on the block and it was the worst-looking thing in
   the shot.

   His concrete pack is not one texture, it is a desert range: the same 20 tiles run
   from pale poured concrete to brown dirt-and-gravel. So they SPLIT BY SATURATION,
   which is a PLACEMENT decision (clause 4) and not a change to one pixel of his art
   -- every tile still blits 1:1, verbatim, out of the bank he paid for:

     sat >= 0.24  ->  YARD      the brown gravelly ones (#19 .37, #21 .37, #26 .30 ...)
     sat <  0.24  ->  SIDEWALK  the pale poured-concrete ones
   Measured, not eyeballed, and asserted below so the split can never silently empty
   one of the two pools. ---- */
var boughtAll = groundBank.tiles.filter(function (t) {
  var pack = String(t.pack || '').toLowerCase();
  return /contrete|concrete/.test(pack) && (t.tier === 'S' || t.tier === 'A')
         && t.pure === true && t.b64;
});
/* saturation measured off the decoded PNG by the same helper the audit uses, so the
   number in this file and the number in records/ come from one place */
var SAT = JSON.parse(require('child_process').execFileSync('python3',
  ['tools/bohemia_tile_saturation.py'], { encoding: 'utf8' }));
function satOf(t) { var v = SAT[t.pack + '#' + t.idx]; return (v === undefined) ? 0 : v; }
var boughtYard = boughtAll.filter(function (t) { return satOf(t) >= 0.24; })
                          .map(function (t) { return t.b64; });
var boughtWalk = boughtAll.filter(function (t) { return satOf(t) < 0.24; })
                          .map(function (t) { return t.b64; });
if (boughtWalk.length < 8) throw new Error('BOUGHT BEATS PAINTED: his concrete pack is missing from ' + GROUND_LIB);
if (boughtRoad.length < 8) throw new Error('BOUGHT BEATS PAINTED: his street pack is missing from ' + GROUND_LIB);
if (boughtYard.length < 4) throw new Error('BOUGHT BEATS PAINTED: the yard split emptied - his dirt-toned tiles vanished from ' + GROUND_LIB);
if (html.indexOf('__BOUGHT_WALK_JSON__') < 0) throw new Error('missing __BOUGHT_WALK_JSON__ placeholder');
if (html.indexOf('__BOUGHT_ROAD_JSON__') < 0) throw new Error('missing __BOUGHT_ROAD_JSON__ placeholder');
if (html.indexOf('__BOUGHT_YARD_JSON__') < 0) throw new Error('missing __BOUGHT_YARD_JSON__ placeholder');
html = html.replace('__BOUGHT_WALK_JSON__', JSON.stringify(boughtWalk));
html = html.replace('__BOUGHT_ROAD_JSON__', JSON.stringify(boughtRoad));
html = html.replace('__BOUGHT_YARD_JSON__', JSON.stringify(boughtYard));
console.log('  BOUGHT GROUND: ' + boughtWalk.length + ' concrete + ' + boughtRoad.length
            + ' street + ' + boughtYard.length + ' dirt/yard, his own, verbatim');

/* ---- THE APPROVED TEXTURE-MATCH WALLS AND ROOFS (Paolo 8/1, TWICE) ----------
   "Holy shit so fucking good ... the graphics tiles that you made are fucking
   fantastic thank you" (36 tiles), then "I approve of them all! Dont be scared to
   have a little more variety in color!" (all 90+).

   These REPLACE the 7/21 painted house skins on the wall and roof FIELD. Both sets
   are his, so this is newest-date-wins on a measured difference, not a preference:
   the 7/21 skins average 81 COLOURS PER TILE at edge 9.4, his purchased ground art
   measures 1443 at edge 20.9, and the texture-match set is built to the second. The
   7/21 skins are what made the houses read as flat mush directly above his rich
   bought asphalt.
   The yard is untouched: it already wears his BOUGHT dirt. ---- */
var TEX = 'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt';
var texBank = JSON.parse(fs.readFileSync(TEX, 'utf8'));
function texPool(kinds, exclude) {
  return texBank.tiles.filter(function (t) {
    return kinds.indexOf(t.kind) >= 0 && String(t.verdict || '').indexOf('APPROVED') === 0
           && (!exclude || !exclude.test(t.material));
  }).map(function (t) { return t.b64; });
}
/* WALLS: the house body materials only. asphalt, ballast, turf and furrow are
   GROUND in this bank and would put a road surface on a bungalow. */
var texWall = texPool(['stucco', 'block', 'brick', 'ashlar', 'tiltup'], null);
/* ROOFS: the things a roof is actually made of. */
var texRoof = texPool(['barrel', 'shingle', 'gravel'], null);
if (texWall.length < 12) throw new Error('TEXTURE MATCH: wall pool too thin (' + texWall.length + ')');
if (texRoof.length < 9) throw new Error('TEXTURE MATCH: roof pool too thin (' + texRoof.length + ')');
if (html.indexOf('__TEX_WALL_JSON__') < 0) throw new Error('missing __TEX_WALL_JSON__ placeholder');
if (html.indexOf('__TEX_ROOF_JSON__') < 0) throw new Error('missing __TEX_ROOF_JSON__ placeholder');
html = html.replace('__TEX_WALL_JSON__', JSON.stringify(texWall));
html = html.replace('__TEX_ROOF_JSON__', JSON.stringify(texRoof));
console.log('  TEXTURE MATCH: ' + texWall.length + ' wall + ' + texRoof.length
            + ' roof tiles, approved 8/1, onto the house field');

if (html.indexOf('__ART_BANKS__') < 0) throw new Error('missing __ART_BANKS__ placeholder');
html = html.replace('__ART_BANKS__', banks);

/* ---- THE REAL ANIMATED DOORS (Paolo 7/26: "we actually already made a lot of
   doors with even animations where it opens, you can't find that anywhere in the
   fucking files"). They were in banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt the
   whole time: 30 approved clips, 9 frames each, open/close over 2 beats at
   120 BPM, queue CLOSED 30/30. The residential pack ("4. Doors and entrances")
   is the one a house wears, and every frame is 88x176 — ONE TILE WIDE, TWO TILES
   TALL, which is the door law he just stated out loud. Lifted verbatim; nothing
   is re-cooked, resized or squished. ---- */
var DOOR_BANK = 'banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt';
var bank = JSON.parse(fs.readFileSync(DOOR_BANK, 'utf8'));
var doorClips = Object.keys(bank.clips).filter(function (k) { return /^4\._Doors_a_\d+_swing$/.test(k); }).sort();
if (doorClips.length < 6) throw new Error('the approved residential animated doors are missing from ' + DOOR_BANK);
var doorOut = doorClips.map(function (k) {
  var c = bank.clips[k];
  if (c.frames.length !== bank.frames_per_clip) throw new Error(k + ' is not a full ' + bank.frames_per_clip + '-frame clip');
  // DOOR LAW: every frame must be exactly 1 tile wide x 2 tiles tall (88x176)
  c.frames.forEach(function (f, i) {
    var buf = Buffer.from(f, 'base64');
    var w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
    if (w !== 88 || h !== 176) throw new Error(k + ' frame ' + i + ' is ' + w + 'x' + h + ', not the 1-wide-2-tall door law (88x176)');
  });
  return { id: k, style: c.style, frames: c.frames };
});
if (html.indexOf('__DOOR_ANIM_JSON__') < 0) throw new Error('missing __DOOR_ANIM_JSON__ placeholder');
html = html.replace('__DOOR_ANIM_JSON__', JSON.stringify({
  version: bank.version, framesPerClip: bank.frames_per_clip, tileW: 1, tileH: 2, clips: doorOut }));

/* ---- THE VISUAL CONSTITUTION'S OWN TILES (Paolo verdicted the target screen
   CBB on 7/26: it ships, it is FROZEN, and the visual freeze lifted with it).
   banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt is the 42-tile set the target
   frame was reassembled from, byte-locked by gates/target_match_gate.py. The run
   CONSUMES it — no new pixels are cooked here, which is why nothing registers a
   new bank. The tile ids are the language: road/walk/kerb/gutter/crossing,
   yard/concrete/dirt, wall + window/boarded/base/under_eave/ends, door_top and
   door_bottom (the 2-tall door law, in the target's own hand), garage top and
   bottom, and a real hip roof (slope/ridge/eave/four hips) + deck/parapet. ---- */
/* 7/29: THIS MOVED, ON HIS WORD, AND IT IS THE ONLY THING THAT EVER MOVES IT.
   The run shipped the frozen 7/26 set right up until today, which means the tiles
   Paolo approved on 7/28 ("I checked it to do the other 41 mark it approved") had
   never once been on his screen inside the actual run. Asked A or B on 7/29 he said
   "A" — this set — approving it a second time. The constitution's own note says
   changing the frozen tileset "requires a NEW RULING FROM PAOLO, not a new render";
   there are two, so it changes. The frozen FRAME does not move: he verdicted that
   picture and it is still the picture. */
var TS_PATH = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt';
var ts = JSON.parse(fs.readFileSync(TS_PATH, 'utf8'));
var tsMD5 = require('crypto').createHash('md5').update(fs.readFileSync(TS_PATH)).digest('hex');
var constitution = JSON.parse(fs.readFileSync('records/target/BOHEMIA_VISUAL_CONSTITUTION.json', 'utf8'));
if (constitution.frozen.tileset.md5 !== tsMD5) {
  throw new Error('the starter tileset does not match the frozen constitution md5 — it is FROZEN, do not re-render it');
}
var tsTiles = {};
(ts.tiles || []).forEach(function (t) { tsTiles[t.id] = t.b64; });
['road_0', 'walk_0', 'yard_0', 'concrete_0', 'dirt', 'wall_0', 'door_top',
 'door_bottom', 'roof_slope', 'roof_ridge', 'roof_eave'].forEach(function (id) {
  if (!tsTiles[id]) throw new Error('the frozen tileset is missing ' + id);
});
if (html.indexOf('__TARGET_TILES_JSON__') < 0) throw new Error('missing __TARGET_TILES_JSON__ placeholder');
html = html.replace('__TARGET_TILES_JSON__', JSON.stringify({
  version: ts.version, cell: ts.cell_px, md5: tsMD5, tiles: tsTiles }));

/* ---- THE INTERIOR POOL, CITY's artifact, consumed not re-cooked.
   banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt is Paolo's Great Sweep crossed to real
   images and filtered UP-ONLY: 465 tiles bucketed by room function with a draw
   scale per tile. CITY built it and deliberately left it unwired, waiting for a
   surface with rooms to put it in. This is that surface.
   A BOUNDED SUBSET ships: every floor, dirt floor and wall (a room's own
   surfaces, where variety reads), plus a capped set per prop bucket. The whole
   465 would put ~4.6MB of art on a phone for props nobody can tell apart. ---- */
var POOL_PATH = 'banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt';
var pool = JSON.parse(fs.readFileSync(POOL_PATH, 'utf8'));
if (!/UP-ONLY/.test(pool.law || '')) throw new Error(POOL_PATH + ' is not the UP-only pool');
var SURFACE_BUCKETS = ['floors', 'dirtfloor', 'walls'];
var PROP_CAP = 10;
var poolOut = {};
Object.keys(pool.buckets).forEach(function (b) {
  var list = pool.buckets[b];
  var take = SURFACE_BUCKETS.indexOf(b) >= 0 ? list.length : Math.min(PROP_CAP, list.length);
  poolOut[b] = list.slice(0, take).map(function (e) {
    return { s: parseFloat(e.scale) || 1, p: e.pack, b64: e.b64 };
  });
});
['floors', 'walls', 'dirtfloor', 'furniture', 'container', 'clutter', 'debris'].forEach(function (b) {
  if (!poolOut[b] || !poolOut[b].length) throw new Error('the interior pool is missing bucket ' + b);
});
if (html.indexOf('__INTERIOR_POOL_JSON__') < 0) throw new Error('missing __INTERIOR_POOL_JSON__ placeholder');
html = html.replace('__INTERIOR_POOL_JSON__', JSON.stringify({
  version: pool.version, px: pool.px, buckets: poolOut }));

/* ---- the engine modules, inlined in the page's own (canonical) order. Every
   `<script src="../engine/X.js">` becomes the byte-identical body of engine/X.js,
   so gates/run_gate.js can prove freshness by substring. ---- */
var inlined = 0;
html = html.replace(/<script src="\.\.\/engine\/([a-zA-Z0-9_]+)\.js"><\/script>/g, function (_m, mod) {
  var body = fs.readFileSync('engine/' + mod + '.js', 'utf8');
  inlined++;
  return '<script>\n/* inlined: engine/' + mod + '.js */\n' + body + '\n</' + 'script>';
});
if (!inlined) throw new Error('no engine module tags found to inline');
if (/\.\.\/engine/.test(html)) throw new Error('external ../engine ref still present after inlining');

html = html.replace('<title>BOHEMIA — THE RUN (dev source)</title>',
  '<title>BOHEMIA — THE RUN</title>\n' +
  '<!-- THE RUN: loaded by the alpha RUN tab iframe. Self-contained. Generated by tools/build_run_slice.js — never edit this file directly. -->');

fs.writeFileSync(OUT, html);
console.log('built ' + OUT + ' (' + html.length + ' bytes, ' + inlined + ' engine modules inlined)');
