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
var TS_PATH = 'banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt';
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
