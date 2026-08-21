/* build_current_slice.js — regenerate slices/BOHEMIA_CURRENT_SLICE.html (the file the
   alpha's SLICE tab loads in an iframe) from the dev phone source
   slices/BOHEMIA_SOCIAL_PHONE_DEMO_7_20_26.html by INLINING the engine modules, so the
   slice is fully self-contained (works standalone on Pages/main, no external refs).

   Flow to show Paolo new phone work:
     1) edit slices/BOHEMIA_SOCIAL_PHONE_DEMO_7_20_26.html (references ../engine, easy to edit)
     2) node tools/build_current_slice.js         (regenerates the self-contained slice)
     3) browser-verify the slice
     4) push ONLY slices/BOHEMIA_CURRENT_SLICE.html to main (Pages serves main)
   Then: alpha SLICE tab -> iframe -> the phone. */
'use strict';
var fs = require('fs');
var SRC = 'slices/BOHEMIA_SOCIAL_PHONE_DEMO_7_20_26.html';
var OUT = 'slices/BOHEMIA_CURRENT_SLICE.html';
// world-model modules (district_kit..crypt, then world.js last — it references
// every generator as a global) match tools/bohemia_map_tab.py's MODULES list:
// the same real world model, one canonical embed order, everywhere it's inlined.
var MODS = ['bohemia_engine','bohemia_scheduler','bohemia_bq','bohemia_quest_runtime',
  'bohemia_district_kit','bohemia_suburb','bohemia_commercial','bohemia_industrial',
  'bohemia_medical','bohemia_solar','bohemia_park','bohemia_wash','bohemia_cemetery',
  'bohemia_drivein','bohemia_golf','bohemia_stadium','bohemia_truckstop','bohemia_school',
  'bohemia_firestation','bohemia_swapmeet','bohemia_storage','bohemia_watertreat',
  'bohemia_boneyard','bohemia_policestation','bohemia_library','bohemia_landfill',
  'bohemia_railyard','bohemia_substation','bohemia_chapel','bohemia_courthouse',
  'bohemia_jail','bohemia_farm','bohemia_downtown','bohemia_trailer','bohemia_apartment',
  'bohemia_warehouse','bohemia_waterpark','bohemia_mall','bohemia_cityhall','bohemia_battery',
  'bohemia_terminal','bohemia_overmap','bohemia_overmap_bridge','bohemia_blockgen',
  'bohemia_floorplan','bohemia_garage','bohemia_crypt',
  // the SURFACES (7/27) — without these the phone's world model is missing nine
  // generators and its map draws blanks where the MAP tab draws ground
  'bohemia_arterial','bohemia_freeway','bohemia_terrain_noise','bohemia_airfield',
  'bohemia_desert','bohemia_mountain','bohemia_water','bohemia_rail','bohemia_interchange',
  'bohemia_campus','bohemia_speedway','bohemia_town','bohemia_ballpark',
  // ONE WORLD INTERIORS step 1: rooms loads BEFORE world, which reads BOH_ROOMS.
  // THE UTILITY LANDMARK FACTORY (8/5) loads BEFORE world.js, which reads BohemiaUtility off
  // the global for its twelve DISTGEN entries. No require() in a browser bundle, so a module
  // missing from this list is a throw on load, not a quiet degrade.
  'bohemia_utility',
  'bohemia_rooms',
  // CLOUT LOADS BEFORE LOOP (8/21, RUN lane). bohemia_loop.js reads
  // root.BohemiaClout for the CLOUT scale and THROWS when it is absent -- "it is
  // the one copy of that table and there is no fallback on purpose". It was not
  // in this list, so running this tool produced a phone that died on load: the
  // TAKE IT button never rendered, the job could not be taken, and the whole
  // demo gate went 21/0 -> 17/4. THE TRAP WAS THAT THE GATE TOLD YOU TO RUN IT:
  // CURRENT SLICE goes red with "regenerating changes nothing" and names this
  // command, so following the instruction broke the game. The list's own comment
  // already warned why -- "no require() in a browser bundle, so a module missing
  // from this list is a throw on load, not a quiet degrade" -- it just had not
  // been updated when loop.js grew the dependency.
  'bohemia_clout',
  'bohemia_world','bohemia_valleymap','bohemia_loop'];

var html = fs.readFileSync(SRC, 'utf8');
// the real canon faction graph (GDD v2 §9): loop.js's DEFAULT_GRAPH browser
// fallback reads root.BOHEMIA_FACTION_GRAPH, so it must be a real JS value
// before bohemia_loop.js's own script tag runs, not a <script src> to the raw
// .json (a bare {...} at script top level parses as a block, not an object).
if (html.indexOf('__FACTION_GRAPH_JSON__') < 0) throw new Error('missing __FACTION_GRAPH_JSON__ placeholder');
html = html.replace('__FACTION_GRAPH_JSON__', fs.readFileSync('engine/BOHEMIA_faction_graph.json', 'utf8').trim());

// THE NINE REAL CANON QUESTS, verbatim. Inlined as a JSON array of source
// strings (JSON.stringify escapes every quote/newline safely) so the phone
// ships the SAME bytes gates/bohemia_canon_quests_gate.js proves playable —
// there is no second, drifting copy of a quest anywhere.
if (html.indexOf('__CANON_QUESTS_JSON__') < 0) throw new Error('missing __CANON_QUESTS_JSON__ placeholder');
var BQ_DIR = 'quests/bq';
var bqFiles = fs.readdirSync(BQ_DIR).filter(function(f){ return /\.bq$/.test(f); }).sort();
if (!bqFiles.length) throw new Error('no .bq canon quests found in ' + BQ_DIR);
var bqTexts = bqFiles.map(function(f){ return fs.readFileSync(BQ_DIR + '/' + f, 'utf8'); });
html = html.replace('__CANON_QUESTS_JSON__', JSON.stringify(bqTexts));
MODS.forEach(function(m){
  var tag = '<script src="../engine/' + m + '.js"></' + 'script>';
  if (html.indexOf(tag) < 0) throw new Error('missing module tag: ' + m);
  html = html.replace(tag, '<script>\n/* inlined: engine/' + m + '.js */\n' + fs.readFileSync('engine/' + m + '.js','utf8') + '\n</' + 'script>');
});
html = html.replace('<title>BOHEMIA — The Phone (systems preview)</title>',
  '<title>BOHEMIA — The Phone (current slice)</title>\n<!-- CURRENT SLICE: loaded by the alpha SLICE tab iframe. Self-contained. Generated by tools/build_current_slice.js -->');
if (/\.\.\/engine/.test(html)) throw new Error('external ../engine ref still present after inlining');
fs.writeFileSync(OUT, html);
console.log('built ' + OUT + ' (' + html.length + ' bytes)');
