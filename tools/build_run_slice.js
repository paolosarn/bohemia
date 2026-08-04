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
/* ---- HIS 7/14 BORDER WALLS ARE DEAD, and this is where they used to be loaded.
   Paolo 8/2 thumbed all thirteen DOWN on a card that asked one question: "thumbs up
   means KEEP IT and it goes back in." So the pool is no longer read, no longer inlined,
   and the run is 13 images lighter. The bank file stays on disk as the record of what he
   judged; gates/perimeter_gate.py asserts those bytes never reach the run again.
   Post-mortem in gates/bohemia_graveyard.txt, verdict in
   records/BOHEMIA_VERDICT_PERIMETER_8_2_26.txt.

   The WB4 rescue that lived here (a 3x tiling preview being crushed into one 44px cell)
   moved to tools/bohemia_perim_rescue.py, which the judge page still calls: what he
   killed had to be the wall he actually chose and not the smear. ---- */
if (html.indexOf('__PERIM_B64_JSON__') < 0) throw new Error('missing __PERIM_B64_JSON__ placeholder');
html = html.replace('__PERIM_B64_JSON__', '[]');

/* ---- THE COOKED PERIMETER WALL (8/2). His 13 approved walls measure edge 5.76 /
   grain 20.0% against a tolerance floor of 14.27 / 54.8 derived from the tiles he
   BOUGHT: a third of the local contrast of the ground they stand on. That is the same
   measured gap that replaced the 7/21 house skins, and the same thing he described
   himself on 7/31 looking at the yard - two different games in one frame. So this is
   newest-date-wins on a MEASURED difference, and his pool stays right above this line,
   rescued and correct, one word from going back.

   ONE WALL PER COMMUNITY is his law (banks/BOHEMIA_REAL_VEGAS_VERDICTS_R2_7_14_26.txt:
   "each plot = ONE wall design (seeded per plot); variety BETWEEN plots"), so the run
   picks one MATERIAL+COLOURWAY per 4x4 plot and then alternates that design's own FACE
   and PILLAR along the run. ---- */
var PERIM_COOK = 'banks/BOHEMIA_PERIMETER_8_2_26.txt';
var perimCook = JSON.parse(fs.readFileSync(PERIM_COOK, 'utf8'));
/* HIS 8/2 VERDICT SHIPS, AND THEN HE WIDENED IT: ALL EIGHTEEN.
   First pass he thumbed 11 up and 7 down. Shown the fix he said "to be Frank, I liked
   all of them" - NOTES ARE RULINGS, so all eighteen are live and PERIM_APPROVED is the
   whole set. The seven were never bad designs; they were the ones where the 44px stamp
   had nothing to hide behind, which is why every flat material failed and every coursed
   one survived. Record: records/BOHEMIA_VERDICT_PERIMETER_8_2_26.txt.
   He killed all thirteen of his own 7/14 walls in the same pass, so that swap is settled.

   AND EVERY DESIGN IS A POOL, NOT A TILE. "Looks like it's glitching out" was one hero
   feature stamped at exactly 44px pitch: one face tile per design, repeated forever, so
   the same crack landed on every cell of the wall. Eight faces and eight bases per
   design now, shuffled per cell, and most of them carry no damage at all. */
var PERIM_APPROVED = ['perim_slump_0', 'perim_slump_1', 'perim_slump_2',
                      'perim_cmu_0', 'perim_cmu_1', 'perim_cmu_2',
                      'perim_stucco_0', 'perim_stucco_1', 'perim_stucco_2',
                      'perim_precast_0', 'perim_precast_1', 'perim_precast_2',
                      'perim_rose_0', 'perim_rose_1', 'perim_rose_2',
                      'perim_splitface_0', 'perim_splitface_1', 'perim_splitface_2'];
var perimSets = {};
perimCook.tiles.forEach(function (t) {
  if (['face', 'pillar', 'base'].indexOf(t.form) < 0) return;
  var key = t.material + '_' + t.colourway;
  if (PERIM_APPROVED.indexOf(key) < 0) return;
  var d = perimSets[key] = perimSets[key] || { face: [], base: [], pillar: null };
  if (t.form === 'pillar') d.pillar = t.b64; else d[t.form].push(t.b64);
});
var perimDesigns = Object.keys(perimSets).sort().filter(function (k) {
  return perimSets[k].face.length >= 4 && perimSets[k].base.length >= 4 && perimSets[k].pillar;
}).map(function (k) { return [perimSets[k].face, perimSets[k].pillar, perimSets[k].base]; });
if (perimDesigns.length !== PERIM_APPROVED.length) {
  throw new Error('PERIMETER: he approved ' + PERIM_APPROVED.length + ' designs on 8/2 and '
                  + perimDesigns.length + ' are complete in ' + PERIM_COOK);
}
/* THE GATE COMES IN FOUR PIECES PER KIND, not one. The entrance aperture is seven
   tiles wide and it is ONE gate: 'l' carries the left pier, 'r' the right, 'm' neither,
   'lr' both for a one-cell opening. Repeating a jambed tile across the aperture drew
   four separate barred gates in a row (seen at estate cell 8,35). */
/* THE GATE COMES IN TWELVE PIECES PER KIND. The entrance aperture is seven tiles WIDE
   and it is ONE gate: 'l' carries the left pier, 'r' the right, 'm' neither. It is also
   TWO CELLS TALL where the perimeter runs east-west, and it is still ONE gate: 'top'
   has the coping above it and runs off its bottom edge, 'bottom' arrives from above and
   carries the threshold, 'full' is a one-cell opening with both.
   Paolo 8/2 circled the defect this fixes: drawing the same piece on both rows let the
   lower one's transparent coping band show A COURSE OF BRICK straight through the middle
   of the gate. "why is there a middle brick part of it" */
var perimGates = ['open', 'steel'].map(function (kind) {
  return ['full', 'top', 'bottom'].map(function (v) {
    return ['lr', 'l', 'm', 'r'].map(function (e) {
      var id = 'perim_gate_' + kind + '_' + e + '_' + v;
      var t = perimCook.tiles.filter(function (q) { return q.id === id; })[0];
      if (!t) throw new Error('missing gate overlay ' + id + ' in ' + PERIM_COOK);
      return t.b64;
    });
  });
});
['__PERIM_COOK_JSON__', '__PERIM_GATE_JSON__'].forEach(function (p) {
  if (html.indexOf(p) < 0) throw new Error('missing ' + p + ' placeholder');
});
html = html.replace('__PERIM_COOK_JSON__', JSON.stringify(perimDesigns));
html = html.replace('__PERIM_GATE_JSON__', JSON.stringify(perimGates));
console.log('  PERIMETER: ' + perimDesigns.length + ' designs he approved 8/2, '
            + perimDesigns[0][0].length + ' face + ' + perimDesigns[0][2].length
            + ' base variants each (the 44px stamp is gone), + 2 gate kinds');

/* ---- THE GRIME PASS (8/3). THE MACHINE ONLY; THE DIAL IS ZERO.
   Paolo 8/3 on Machine Party: "I really love machine parties aesthetic." Klubnika, on
   his own texturing: he "added dirty and grimy leaks to every corner, which BLENDS
   EVERYTHING TOGETHER rather than having different objects" -- a direct answer to the
   failure Paolo named himself on 7/31, two different games in one frame.
   ONE CONTINUOUS 8x8-CELL SHEET, sampled per cell by WORLD position, so a stain that
   starts on one cell carries onto the next. It is NOT a tile: a mark baked into a 44px
   tile repeats at cell pitch forever, which is the bug he circled on 8/2.
   IT SHIPS AT STRENGTH 0. The machinery is cheap and invalidates no approved art; the
   TUNING is a whole-world call and one district of twenty-seven is built. The game looks
   exactly as it did. gates/grime_gate.py holds the zero. ---- */
var GRIME_BANK = 'banks/BOHEMIA_GRIME_8_3_26.txt';
var grime = JSON.parse(fs.readFileSync(GRIME_BANK, 'utf8'));
if (!grime.b64 || grime.patch_cells < 4) throw new Error('the grime sheet is missing from ' + GRIME_BANK);
if (grime.ships_at !== 0) throw new Error('GRIME: the bank says it ships at ' + grime.ships_at
  + '. The machine ships at ZERO until Paolo rules on the amount.');
['__GRIME_B64__', '__GRIME_CELLS__'].forEach(function (ph) {
  if (html.indexOf(ph) < 0) throw new Error('missing ' + ph + ' placeholder');
});
html = html.replace('__GRIME_B64__', JSON.stringify(grime.b64));
html = html.replace('__GRIME_CELLS__', String(grime.patch_cells));
console.log('  GRIME: ' + grime.patch_cells + 'x' + grime.patch_cells
            + '-cell sheet wired, strength 0 (machine only, the game is unchanged)');

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
/* THE SPLIT OVERLAPS IN THE MIDDLE, AND THE YARD GETS THE DEEPER POOL (8/3).
   The hard cut at 0.24 gave the YARD exactly FIVE tiles - for the LARGEST surface on
   the block - while the narrow sidewalk band got fifteen. That is backwards: a pool's
   depth should follow how much of the screen it covers, and with five tiles a weed
   lands on every fifth cell of an entire yard. It is the same defect Paolo circled on
   8/2 on the wall, just with a period of five instead of one.
   And the hard cut was never real. His pack is a CONTINUUM from pale poured concrete
   to brown dirt-and-gravel, and 0.24 fell straight through the densest part of it:
   #41 at .237 and #3 at .230 were called sidewalk while #12 at .251 was called yard,
   on a difference of two hundredths. Tiles in the middle honestly read as either.
   So the band 0.20-0.28 now serves BOTH pools. Yard goes 5 -> 15, sidewalk keeps its
   depth, and not one pixel of his art is touched - this is clause 4, PLACEMENT. */
var boughtYard = boughtAll.filter(function (t) { return satOf(t) >= 0.20; })
                          .map(function (t) { return t.b64; });
var boughtWalk = boughtAll.filter(function (t) { return satOf(t) < 0.28; })
                          .map(function (t) { return t.b64; });
if (boughtWalk.length < 8) throw new Error('BOUGHT BEATS PAINTED: his concrete pack is missing from ' + GROUND_LIB);
if (boughtRoad.length < 8) throw new Error('BOUGHT BEATS PAINTED: his street pack is missing from ' + GROUND_LIB);
if (boughtYard.length < 12) throw new Error('BOUGHT BEATS PAINTED: the yard pool is only '
  + boughtYard.length + ' tiles. The yard is the biggest surface on the block and a thin '
  + 'pool repeats a weed on every Nth cell (' + GROUND_LIB + ')');
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

/* ---- WHAT THE REST OF THE VALLEY IS BUILT OUT OF (8/3) -----------------------
   His ground now draws on all 55 district types. Their BUILDINGS are still flat
   starter tile: the warehouse in records/target/VALLEY_INDUSTRIAL.png is the proof.
   The art already exists and he already APPROVED it on 8/1 (tilt-up concrete,
   corrugated metal, rusted steel, painted brick, civic ashlar, storefront aluminium
   were all in the 90 tiles he passed).

   BUT IT CANNOT JUST BE UNGATED, and that is the whole design problem. The house
   pool is fifteen stucco/block skins; ungating it puts a bungalow's butter-yellow
   stucco on a warehouse and a casino. A material is not decoration, it says what a
   building IS.

   SO THE MAP IS BY WHAT VEGAS ACTUALLY BUILDS WITH, researched rather than guessed:
   TILT-UP CONCRETE is the dominant commercial and light-industrial exterior in the
   valley (warehouses, strip retail, and now offices, schools, churches and theatres
   too - over 15% of all US industrial building is tilt-up), and STUCCO/EIFS is the
   preferred southwestern commercial finish. Sources in
   records/BOHEMIA_DISTRICT_MATERIALS_8_3_26.md.

   AND THE ROOFS ARE FLAT. This is the correctness point that matters most and the
   one a lazy ungating would have got wrong: a commercial or industrial building in
   Vegas has a FLAT tar-and-gravel roof, not a pitched barrel tile. Barrel and
   shingle are HOUSE roofs. Putting a terracotta pitched roof on a distribution
   warehouse would be a lie about the building, so the civic roof pool is gravel and
   tar paper only. ---------------------------------------------------------------- */
function texMats(ids) {
  var out = [];
  ids.forEach(function (m) {
    var got = texBank.tiles.filter(function (t) { return t.material === m; })
                           .map(function (t) { return t.b64; });
    if (!got.length) throw new Error('DISTRICT MATERIALS: no tiles for material "' + m + '"');
    out.push(got);
  });
  return out;
}
/* wall pools by what the building IS. Each entry is a list of MATERIALS; a whole
   building picks one material and then shuffles that material's colourways per cell,
   so a warehouse is one warehouse rather than a patchwork. */
var CIVIC = {
  /* heavy industry, storage, utilities: tilt-up slab, corrugated skin, rusted steel */
  industrial: ['tiltup_concrete', 'metal_corrugate', 'steel_rusted'],
  warehouse:  ['tiltup_concrete', 'metal_corrugate', 'steel_rusted'],
  storage:    ['tiltup_concrete', 'metal_corrugate'],
  railyard:   ['metal_corrugate', 'steel_rusted', 'tiltup_concrete'],
  granary:    ['metal_corrugate', 'steel_rusted'],
  arsenal:    ['tiltup_concrete', 'steel_rusted'],
  battery:    ['tiltup_concrete', 'metal_corrugate'],
  substation: ['tiltup_concrete', 'steel_rusted'],
  reclaim:    ['tiltup_concrete', 'metal_corrugate'],
  landfill:   ['tiltup_concrete', 'metal_corrugate'],
  airbase:    ['tiltup_concrete', 'metal_corrugate', 'steel_rusted'],
  fort:       ['tiltup_concrete', 'steel_rusted'],
  farm:       ['metal_corrugate', 'wood_fence', 'steel_rusted'],
  /* retail: tilt-up shells with aluminium storefront across the front */
  commercial: ['tiltup_concrete', 'storefront_alum', 'brick_painted', 'stucco_bone'],
  mall:       ['tiltup_concrete', 'storefront_alum', 'stucco_bone'],
  swapmeet:   ['metal_corrugate', 'tiltup_concrete'],
  /* civic and institutional: cut stone and painted brick, the oldest buildings here */
  downtown:   ['civic_stone', 'brick_painted', 'storefront_alum', 'brick_running'],
  courthouse: ['civic_stone', 'brick_running'],
  library:    ['civic_stone', 'brick_painted'],
  policestation: ['civic_stone', 'tiltup_concrete'],
  jail:       ['tiltup_concrete', 'civic_stone'],
  school:     ['brick_painted', 'tiltup_concrete', 'civic_stone'],
  campus:     ['brick_running', 'civic_stone', 'tiltup_concrete'],
  medical:    ['tiltup_concrete', 'stucco_bone', 'storefront_alum'],
  chapel:     ['civic_stone', 'brick_painted', 'stucco_bone'],
  courthouse2: ['civic_stone'],
  /* the show: big blank masses with glazing, not domestic materials */
  casino:     ['storefront_alum', 'civic_stone', 'tiltup_concrete'],
  strip:      ['storefront_alum', 'civic_stone', 'tiltup_concrete'],
  resort:     ['storefront_alum', 'tiltup_concrete', 'stucco_bone'],
  convention: ['tiltup_concrete', 'storefront_alum'],
  highroller: ['steel_rusted', 'storefront_alum'],
  sphere:     ['tiltup_concrete', 'storefront_alum'],
  strat:      ['tiltup_concrete', 'storefront_alum'],
  minigp:     ['tiltup_concrete', 'metal_corrugate'],
  speedway:   ['tiltup_concrete', 'metal_corrugate', 'steel_rusted'],
  ballpark:   ['tiltup_concrete', 'civic_stone'],
  waterpark:  ['tiltup_concrete', 'stucco_bone'],
  radio:      ['tiltup_concrete', 'steel_rusted'],
  /* people still live in these, and in Vegas they really are stucco */
  apartment:  ['stucco_tan', 'stucco_bone', 'stucco_ochre', 'stucco_sand_pink'],
  /* a trailer park is ribbed siding, and that material was cooked for exactly this */
  trailer:    ['mobile_siding', 'metal_corrugate'],
};
/* THE DEFAULT for anything unlisted: the honest neutral. Tilt-up and CMU are what
   an unremarkable building in this valley is made of, and it is never a house. */
var CIVIC_DEFAULT = ['tiltup_concrete', 'block_grey', 'block_painted'];
/* FLAT ROOFS. Not a preference - a commercial or industrial building in Vegas has a
   tar-and-gravel roof, and a pitched barrel tile on a warehouse would be a lie. */
var CIVIC_ROOF = ['gravel_roof', 'tar_paper'];

var civicWall = {}, civicOrder = Object.keys(CIVIC).sort();
civicOrder.forEach(function (d) { civicWall[d] = texMats(CIVIC[d]); });
var civicPayload = { d: civicWall, def: texMats(CIVIC_DEFAULT), roof: texMats(CIVIC_ROOF) };
if (html.indexOf('__CIVIC_SKIN_JSON__') < 0) throw new Error('missing __CIVIC_SKIN_JSON__ placeholder');
html = html.replace('__CIVIC_SKIN_JSON__', JSON.stringify(civicPayload));
console.log('  DISTRICT MATERIALS: ' + civicOrder.length + ' district types mapped to real '
            + 'Vegas construction, + a tilt-up/CMU default, flat tar-and-gravel roofs');

/* ---- THE OPENINGS (8/2): window, boarded window, garage bay. -----------------
   OVERLAYS WITH ALPHA, not whole tiles. The run picks ONE wall skin per house out of
   fifteen (his wall law: one design per plot, variety between plots), so a window baked
   as a complete tile could only carry ONE of those fifteen walls and fourteen houses in
   fifteen would show a window in the wrong stucco. Drawn on top of whatever skin the
   house already wears, they match for free - including for skins cooked later. ---- */
var OPEN_BANK = 'banks/BOHEMIA_OPENINGS_8_2_26.txt';
var openBank = JSON.parse(fs.readFileSync(OPEN_BANK, 'utf8'));
var openMap = {};
openBank.tiles.forEach(function (t) { openMap[t.id] = t.b64; });
['wall_window', 'wall_boarded', 'garage_top', 'garage_bottom',
 'garage_top_l', 'garage_bottom_l', 'garage_top_r', 'garage_bottom_r'
].forEach(function (k) {
  if (!openMap[k]) throw new Error('OPENINGS: missing ' + k + ' in ' + OPEN_BANK);
});
if (html.indexOf('__OPENINGS_JSON__') < 0) throw new Error('missing __OPENINGS_JSON__ placeholder');
html = html.replace('__OPENINGS_JSON__', JSON.stringify(openMap));
console.log('  OPENINGS: ' + Object.keys(openMap).length + ' alpha overlays onto the wall skin');

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
