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
/* ZERO until Paolo rules -- and on 8/9 he ruled: 0.30, from the ART tab dial
   (records/BOHEMIA_GRIME_VERDICT_8_9_26.txt). The refusal stays, re-aimed: the
   bank must say exactly the RULED amount, so nobody can quietly move the dial
   in either direction without a new verdict file and a matching edit here. */
if (grime.ships_at !== 0.30) throw new Error('GRIME: the bank says it ships at ' + grime.ships_at
  + '. Paolo ruled 0.30 on 8/9; a different number needs a NEW verdict, not an edit.');
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

/* ---- THE APPROVED TILE FAMILIES (Paolo 8/11, TILE BOARD sitting) ------------
   records/BOHEMIA_TILE_BOARD_VERDICT_8_11_26.txt: 14 families UP. Only pieces a
   wiring actually draws are injected, and ONLY from a bank whose law line says
   APPROVED - an unjudged or dead bank can never reach the map. First wiring:
   TF-ART-010 rail (the railyard's classification fan). */
var RAIL_BANK = 'banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json';
var railBank = JSON.parse(fs.readFileSync(RAIL_BANK, 'utf8'));
if (String(railBank.law || '').indexOf('APPROVED') !== 0)
  throw new Error('TILEFORM: ' + RAIL_BANK + ' law line is not APPROVED - nothing unjudged draws');
var tileformOut = {};
var RAIL_PIECES = ['rail_yard_corridor_0A', 'rail_yard_corridor_0B', 'rail_yard_corridor_1A',
                   'rail_yard_corridor_1B', 'rail_yard_corridor_2A', 'rail_yard_corridor_2B',
                   'rail_plate_0', 'rail_plate_1', 'rail_plate_2'];
railBank.tiles.forEach(function (t) {
  if (RAIL_PIECES.indexOf(t.name) >= 0) tileformOut[t.name] = t.b64;
});
if (Object.keys(tileformOut).length !== RAIL_PIECES.length)
  throw new Error('TILEFORM: rail pieces missing from ' + RAIL_BANK + ' (have '
    + Object.keys(tileformOut).length + ' of ' + RAIL_PIECES.length + ')');
/* second family: TF-ART-003 parking striping - the 44px stall-line pieces the
   WANG mask in the run actually asks for (wheel stops and ADA marks are later
   volume; they are single placements, not line pieces) */
var STALL_BANK = 'banks/tileforms/TF-ART-003_CANDIDATES_8_8_26.json';
var stallBank = JSON.parse(fs.readFileSync(STALL_BANK, 'utf8'));
if (String(stallBank.law || '').indexOf('APPROVED') !== 0)
  throw new Error('TILEFORM: ' + STALL_BANK + ' law line is not APPROVED - nothing unjudged draws');
var stallCount = 0;
stallBank.tiles.forEach(function (t) {
  if (/^stall_(v_\d|h_\d|v_end[NS]_\d|h_end[EW]_\d|corner_[NS][EW]_\d|tee_[NS]_\d|cross_0)$/.test(t.name)) {
    tileformOut[t.name] = t.b64; stallCount++;
  }
});
if (stallCount < 30) throw new Error('TILEFORM: only ' + stallCount + ' stall pieces matched in ' + STALL_BANK);
/* third family: TF-ART-012 flat-roof ring + field + single-cell duct pieces.
   The RTUs are 88x86 (NOT a whole number of 44px cells) and are deliberately
   NOT injected - the no-resample law forbids a fractional blit. */
var ROOF_BANK = 'banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json';
var roofBank = JSON.parse(fs.readFileSync(ROOF_BANK, 'utf8'));
if (String(roofBank.law || '').indexOf('APPROVED') !== 0)
  throw new Error('TILEFORM: ' + ROOF_BANK + ' law line is not APPROVED - nothing unjudged draws');
var roofCount = 0;
roofBank.tiles.forEach(function (t) {
  if (/^(parapet_(galv|bone|oxide)_(run_[nesw]_[ab]|out_[ns][ew]|in_[ns][ew]|end_open[nse]|scupper)|parapet_galv_run_[ne]_drift|bur_gravel_\d|duct_straight_\d|duct_elbow_0|rtu_small_[01]|rtu_large_0|hatch_0|panel_pulled_0|drain_sump_0)$/.test(t.name)) {
    tileformOut[t.name] = t.b64; roofCount++;
  }
});
if (roofCount !== 74) throw new Error('TILEFORM: only ' + roofCount + ' roof pieces matched in ' + ROOF_BANK);
/* fifth family: TF-ART-004 chain-link - the run sheets, N-S columns and the
   post hub. Gates, toppers and slat variants are named volume. */
var FENCE_BANK = 'banks/tileforms/TF-ART-004_CANDIDATES_8_8_26.json';
var fenceBank = JSON.parse(fs.readFileSync(FENCE_BANK, 'utf8'));
if (String(fenceBank.law || '').indexOf('APPROVED') !== 0)
  throw new Error('TILEFORM: ' + FENCE_BANK + ' law line is not APPROVED - nothing unjudged draws');
var FENCE_PIECES = ['run_plain_0', 'run_plain_1', 'run_plain_2', 'run_rail_0', 'run_rail_1',
                    'run_rail_2', 'run_breach', 'ns_run_0', 'ns_run_1', 'post_hub',
                    /* VOLUME 8/14: the bank's own gates, two-cell 88px pairs on the run */
                    'gate_shut', 'gate_sag', 'gate_open',
                    /* VOLUME 8/15: the rest of the wardrobe - security wire, privacy
                       slats, blown trash, a leaning section */
                    'run_barbed', 'run_razor', 'run_slat_tan', 'run_slat_bone',
                    'run_trash_0', 'run_trash_1', 'run_lean'];
var fenceCount = 0;
fenceBank.tiles.forEach(function (t) {
  if (FENCE_PIECES.indexOf(t.name) >= 0) { tileformOut[t.name] = t.b64; fenceCount++; }
});
if (fenceCount !== FENCE_PIECES.length)
  throw new Error('TILEFORM: only ' + fenceCount + ' fence pieces matched in ' + FENCE_BANK);
/* eighth family: TF-ART-014 crop fields - the farm's own named ground. Edge
   WANG set, berms, concrete ditches and the dirt track are named volume. */
var CROP_BANK = 'banks/tileforms/TF-ART-014_CANDIDATES_8_8_26.json';
var cropBank = JSON.parse(fs.readFileSync(CROP_BANK, 'utf8'));
if (String(cropBank.law || '').indexOf('APPROVED') !== 0)
  throw new Error('TILEFORM: ' + CROP_BANK + ' law line is not APPROVED - nothing unjudged draws');
var CROP_PIECES = ['field_plain_0', 'field_plain_1', 'field_plain_2', 'field_windrow_0',
                   'field_windrow_1', 'field_bald_0', 'field_bald_1', 'bare_plot_0',
                   'bare_plot_1', 'ditch_earth_silted', 'ditch_earth_scoured'];
var cropCount = 0;
cropBank.tiles.forEach(function (t) {
  if (CROP_PIECES.indexOf(t.name) >= 0) { tileformOut[t.name] = t.b64; cropCount++; }
});
if (cropCount !== CROP_PIECES.length)
  throw new Error('TILEFORM: only ' + cropCount + ' crop pieces matched in ' + CROP_BANK);
/* ninth family: TF-ART-005 sports surfaces (line WANGs, lanes and banking are
   volume). tenth family: TF-ART-008 storefronts (signbands, pilasters, ends
   and the smashed pair are volume). */
function grabPieces(bankPath, names) {
  var bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
  if (String(bank.law || '').indexOf('APPROVED') !== 0)
    throw new Error('TILEFORM: ' + bankPath + ' law line is not APPROVED - nothing unjudged draws');
  var got = 0;
  bank.tiles.forEach(function (t) {
    if (names.indexOf(t.name) >= 0) { tileformOut[t.name] = t.b64; got++; }
  });
  if (got !== names.length)
    throw new Error('TILEFORM: only ' + got + ' of ' + names.length + ' pieces matched in ' + bankPath);
}
grabPieces('banks/tileforms/TF-ART-005_CANDIDATES_8_8_26.json',
  ['turf_stripe_a0', 'turf_stripe_b0', 'turf_stripe_a1', 'turf_stripe_b1',
   'turf_stripe_a2', 'turf_stripe_b2', 'court_0', 'court_1', 'court_2',
   'track_0', 'track_1', 'track_2', 'infield_0', 'infield_1', 'infield_2',
   'putting_0', 'putting_1', 'bunker_0', 'bunker_1', 'bunker_2',
   /* VOLUME 8/15: the painted lines - court ghost-line WANG + track lanes */
   'court_line_N', 'court_line_E', 'court_line_S', 'court_line_W',
   'court_line_NE', 'court_line_NS', 'court_line_NW', 'court_line_ES',
   'court_line_EW', 'court_line_SW', 'court_line_NES', 'court_line_NEW',
   'court_line_NSW', 'court_line_ESW', 'court_line_NESW',
   'track_lane_NS', 'track_lane_EW', 'track_lane_NE', 'track_lane_NW',
   'track_lane_ES', 'track_lane_SW',
   /* VOLUME 8/15 (second pass): the stadium's own 'field markings' cells
      draw the turf yard-line network */
   'turf_line_N', 'turf_line_E', 'turf_line_S', 'turf_line_W',
   'turf_line_NE', 'turf_line_NS', 'turf_line_NW', 'turf_line_ES',
   'turf_line_EW', 'turf_line_SW', 'turf_line_NES', 'turf_line_NEW',
   'turf_line_NSW', 'turf_line_ESW', 'turf_line_NESW']);
grabPieces('banks/tileforms/TF-ART-006_CANDIDATES_8_8_26.json',
  ['rim_N', 'rim_E', 'rim_S', 'rim_W', 'rim_NE', 'rim_NS', 'rim_NW', 'rim_ES',
   'rim_EW', 'rim_SW', 'rim_NES', 'rim_NEW', 'rim_NSW', 'rim_ESW', 'rim_NESW',
   'rim_N_ladder', 'silt_0', 'silt_1', 'silt_2', 'floor_drain',
   /* VOLUME 8/15: the hopper - slopes descend to the darker deep end */
   'slope_n_0', 'slope_n_1', 'slope_e_0', 'slope_e_1', 'slope_s_0', 'slope_s_1',
   'slope_w_0', 'slope_w_1', 'deep_0', 'deep_1', 'deep_2']);
grabPieces('banks/tileforms/TF-ART-008_CANDIDATES_8_8_26.json',
  ['sf_bay_tall_0', 'sf_bay_tall_1', 'sf_boarded_0', 'sf_boarded_1', 'sf_boarded_2',
   'sf_shutter_down_0', 'sf_shutter_down_1', 'sf_grille_half_0', 'sf_grille_half_1',
   'sf_awning_rust_0', 'sf_awning_rust_1', 'sf_awning_teal_0', 'sf_awning_teal_1',
   'sf_awning_sand_stripe_0', 'sf_awning_sand_stripe_1', 'sf_awning_sage_0', 'sf_awning_sage_1']);
/* twelfth family: TF-ART-001 CMU courses. Must be grabbed HERE, before the
   replace below, or the pieces never reach the page registry. */
grabPieces('banks/tileforms/TF-ART-001_CANDIDATES_8_8_26.json',
  ['cmu_capbeam_0', 'cmu_capbeam_1', 'cmu_capbeam_2', 'cmu_vent_0', 'cmu_vent_1', 'cmu_vent_2']);
/* VOLUME 8/14: TF-ART-013 skirts - the panel band overlays the base of every
   trailer-district mass (drawCivicSkin bottom-row hook). */
grabPieces('banks/tileforms/TF-ART-013_CANDIDATES_8_8_26.json',
  ['mh_skirt_0', 'mh_skirt_1', 'mh_skirt_2', 'mh_skirt_vent_0', 'mh_skirt_missing_0',
   /* VOLUME 8/15: the tow hitch still on every tongue end */
   'mh_hitch_0']);
/* VOLUME 8/15 (second pass): the dead signbands above the storefront glass,
   cooked from harvested family palette - tools/tfcook/TF-ART-008_signband_cook.py */
grabPieces('banks/tileforms/TF-ART-008_SIGNBAND_VOLUME_8_15_26.json',
  ['sb_blank_0', 'sb_blank_1', 'sb_blank_2', 'sb_ghost_0', 'sb_ghost_1',
   'sb_ghost_2', 'sb_broken_0', 'sb_broken_1']);
/* VOLUME 8/15 (second cook): the smashed fronts and the pilaster rhythm -
   tools/tfcook/TF-ART-008_smash_pilaster_cook.py */
grabPieces('banks/tileforms/TF-ART-008_SMASH_VOLUME_8_15_26.json',
  ['sf_smashed_0', 'sf_smashed_1', 'sf_pilaster_0', 'sf_pilaster_1']);
/* VOLUME 8/18: side-facing awning ribbons for the vertical runs -
   tools/tfcook/TF-ART-008_sideawning_cook.py */
grabPieces('banks/tileforms/TF-ART-008_SIDEAWNING_VOLUME_8_18_26.json',
  ['awn_side_w_rust_0', 'awn_side_w_rust_1', 'awn_side_e_rust_0', 'awn_side_e_rust_1',
   'awn_side_w_teal_0', 'awn_side_w_teal_1', 'awn_side_e_teal_0', 'awn_side_e_teal_1',
   'awn_side_w_sand_stripe_0', 'awn_side_w_sand_stripe_1', 'awn_side_e_sand_stripe_0',
   'awn_side_e_sand_stripe_1', 'awn_side_w_sage_0', 'awn_side_w_sage_1',
   'awn_side_e_sage_0', 'awn_side_e_sage_1']);
/* VOLUME 8/16: the yard's track ends - a buffer stop on one end in four,
   blown-sand tapers on the rest - tools/tfcook/TF-ART-010_ends_cook.py */
grabPieces('banks/tileforms/TF-ART-010_ENDS_VOLUME_8_16_26.json',
  ['rail_buffer_e', 'rail_buffer_w', 'rail_taper_e', 'rail_taper_w']);
/* TF-ART-018 8/16 second pass: kerb returns + crossing ramps wire into the
   suburb streets (the measured home of every sidewalk). Drops still held. */
grabPieces('banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json',
  ['kerb_return_ne', 'kerb_return_nw', 'kerb_return_se', 'kerb_return_sw',
   'kerb_drop_n', 'kerb_drop_e', 'kerb_drop_s', 'kerb_drop_w']);
/* TF-ART-007 8/19 (corrected by measurement - the walked courthouse is
   PRECAST and names its own joints, which reuse the shipped tu_joint):
   the chapel's arcade columns, dead civic glazing, the stained glass -
   tools/tfcook/TF-ART-007_cook.py */
grabPieces('banks/tileforms/TF-ART-007_CANDIDATES_8_19_26.json',
  ['civ_column_0', 'glz_dead_0', 'glz_dead_1', 'glz_stained_0']);
/* TF-ART-016 8/19 (TF-RUN-007 merged in): the power districts - panel
   tables (4 rows x 3 phases), table ends, the pad-mount cabinet, the dead
   battery racks - tools/tfcook/TF-ART-016_cook.py. The dead-panel glass
   states (browned, crumb) stay BANKED: no stripped block exists yet. */
grabPieces('banks/tileforms/TF-ART-016_CANDIDATES_8_19_26.json',
  ['sol_r0_p0', 'sol_r0_p1', 'sol_r0_p2', 'sol_r1_p0', 'sol_r1_p1', 'sol_r1_p2',
   'sol_r2_p0', 'sol_r2_p1', 'sol_r2_p2', 'sol_r3_p0', 'sol_r3_p1', 'sol_r3_p2',
   'sol_end_w', 'sol_end_e', 'sol_inv_box', 'bat_rack_dead_0', 'bat_rack_dead_1']);
/* VOLUME 8/20: the reclaim plant's inlet headers (x171, the one new name
   the 8/20 re-probe surfaced) - tools/tfcook/TF-ART-016_inlet_cook.py */
grabPieces('banks/tileforms/TF-ART-016_INLET_VOLUME_8_20_26.json',
  ['inlet_header_0', 'inlet_header_1']);
/* VOLUME 8/20: member 5, the folded one - the O&M two-track wheel ruts
   riding the bought gravel on every plant service lane -
   tools/tfcook/TF-ART-016_lane_cook.py */
/* VOLUME 8/23: the arsenal's twelve earth-covered magazines -
   tools/tfcook/TF-ART-001_magazine_cook.py */
grabPieces('banks/tileforms/TF-ART-001_MAGAZINE_VOLUME_8_23_26.json',
  ['mag_crest_0', 'mag_crest_1', 'mag_mid_0', 'mag_mid_1',
   'mag_edge_n_0', 'mag_edge_n_1', 'mag_edge_s_0', 'mag_edge_s_1',
   'mag_head_0', 'mag_head_1', 'mag_door']);
/* TF-ART-020 8/24: the reservoir's 1434 valve/hatch lids and vault covers -
   tools/tfcook/TF-ART-020_valve_hatch_cook.py */
grabPieces('banks/tileforms/TF-ART-020_CANDIDATES_8_24_26.json',
  ['vh_round_0', 'vh_round_1', 'vh_vault_h_0', 'vh_vault_h_1',
   'vh_vault_v_0', 'vh_vault_v_1']);
/* TF-ART-021 8/24: the granary's 1514 loadout spouts + dust cyclones -
   tools/tfcook/TF-ART-021_spout_bin_cook.py */
grabPieces('banks/tileforms/TF-ART-021_CANDIDATES_8_24_26.json',
  ['sd_bin_0', 'sd_bin_1', 'sd_spout_0', 'sd_spout_1']);
/* TF-ART-022 8/24: the arsenal's 1607 post-and-cable barricade lines -
   tools/tfcook/TF-ART-022_barricade_post_cook.py */
grabPieces('banks/tileforms/TF-ART-022_CANDIDATES_8_24_26.json',
  ['bp_post_0', 'bp_post_1', 'bp_cable_h_0', 'bp_cable_h_1',
   'bp_cable_v_0', 'bp_cable_v_1']);
/* VOLUME 8/22: the industrial yard's 28 dead semi-trailers (4x16 each) -
   tools/tfcook/TF-ART-002_trailer_cook.py */
grabPieces('banks/tileforms/TF-ART-002_TRAILER_VOLUME_8_22_26.json',
  ['trailer_box_0', 'trailer_box_1', 'trailer_box_2']);
/* VOLUME 8/21: the cemetery's 925 headstones -
   tools/tfcook/TF-ART-005_headstone_cook.py */
grabPieces('banks/tileforms/TF-ART-005_HEADSTONE_VOLUME_8_21_26.json',
  ['headstone_0', 'headstone_1', 'headstone_2']);
/* VOLUME 8/21: the stadium bowl's raked seating + the school's metal
   bleachers + aisle stairs - tools/tfcook/TF-ART-005_seating_cook.py */
grabPieces('banks/tileforms/TF-ART-005_SEATING_VOLUME_8_21_26.json',
  ['seat_rows_h_0', 'seat_rows_h_1', 'seat_rows_v_0', 'seat_rows_v_1',
   'bleach_rows_h_0', 'bleach_rows_h_1', 'bleach_rows_v_0', 'bleach_rows_v_1',
   'seat_aisle_h', 'seat_aisle_v']);
/* VOLUME 8/21: the gypsum stockpiles (x3015, found by the inventory
   ranking) - tools/tfcook/TF-ART-015_stockpile_cook.py */
grabPieces('banks/tileforms/TF-ART-015_STOCKPILE_VOLUME_8_21_26.json',
  ['gyp_pile_0', 'gyp_pile_1', 'gyp_pile_2']);
grabPieces('banks/tileforms/TF-ART-016_LANE_VOLUME_8_20_26.json',
  ['lane_track_h_0', 'lane_track_h_1', 'lane_track_v_0', 'lane_track_v_1']);
/* TF-ART-019 8/21: THE GRID KIT - the substation's transformer bays,
   switchgear lattice, overhead busbars and insulators (maintained, the
   NETWORK's half of CLUSTERED POWER) + the battery yard's container banks
   (dead) - tools/tfcook/TF-ART-019_cook.py */
grabPieces('banks/tileforms/TF-ART-019_CANDIDATES_8_21_26.json',
  ['xf_body', 'swg_post_v', 'swg_post_h', 'bus_over_h', 'bus_over_v',
   'ins_pin', 'bat_lid_a', 'bat_lid_b', 'bat_seam', 'bat_end_w', 'bat_end_e',
   'hvac_pack']);
/* TF-ART-017 8/19: THE THICKNESS - pure value-geometry joinery overlays
   (outside corners with the bead hairline, window/boarded reveals) that
   ride every skin and civic material - tools/tfcook/TF-ART-017_cook.py.
   cor_in_* stay banked until a live concave site is measured. */
grabPieces('banks/tileforms/TF-ART-017_CANDIDATES_8_19_26.json',
  ['cor_out_l', 'cor_out_r', 'cor_in_l', 'cor_in_r', 'rev_window', 'rev_boarded']);
/* TF-RUN-005 8/19: the tilt-up panel language - the joint rhythm, cap,
   plinth, rain streaks and boarded windows that make the live tilt-up
   field read as lifted panels - tools/tfcook/TF-RUN-005_cook.py */
grabPieces('banks/tileforms/TF-RUN-005_CANDIDATES_8_19_26.json',
  ['tu_joint_0', 'tu_joint_1', 'tu_parapet_0', 'tu_parapet_1',
   'tu_base_0', 'tu_base_1', 'tu_streak_0', 'tu_streak_1', 'tu_streak_2',
   'tu_board_0', 'tu_board_1']);
/* TF-WORLD-010 8/19: SIGNS - the tallest thing in every district. The
   district-named sign cells (pylon, marquee, screen tower, scoreboard,
   blade sign, roof antenna/dish) measured 8/19 all rendered as flat generic
   masses; these skin them - tools/tfcook/TF-WORLD-010_cook.py */
grabPieces('banks/tileforms/TF-WORLD-010_CANDIDATES_8_19_26.json',
  ['sign_screen_face_0', 'sign_screen_face_1', 'sign_screen_face_2',
   'sign_screen_torn_0', 'sign_screen_torn_1', 'sign_screen_top',
   'sign_screen_foot', 'sign_screen_edge_w', 'sign_screen_edge_e',
   'sign_board_face_0', 'sign_board_face_1', 'sign_board_blown',
   'sign_board_top', 'sign_board_foot', 'sign_board_edge_w', 'sign_board_edge_e',
   'sign_marq_face_0', 'sign_marq_face_1', 'sign_marq_top',
   'sign_marq_edge_w', 'sign_marq_edge_e',
   'sign_pyl_face_0', 'sign_pyl_face_1', 'sign_pyl_blown_0', 'sign_pyl_blown_1',
   'sign_pyl_top', 'sign_pyl_foot', 'sign_pyl_pole', 'sign_pyl_edge_w', 'sign_pyl_edge_e',
   'sign_blade_w_0', 'sign_blade_w_1', 'sign_blade_e_0', 'sign_blade_e_1',
   'sign_ant_whip', 'sign_ant_dish']);
if (html.indexOf('__TILEFORM_B64_JSON__') < 0) throw new Error('missing __TILEFORM_B64_JSON__ placeholder');
html = html.replace('__TILEFORM_B64_JSON__', JSON.stringify(tileformOut));
console.log('  TILEFORMS: ' + Object.keys(tileformOut).length + ' approved pieces ('
            + RAIL_PIECES.length + ' rail TF-ART-010 + ' + stallCount + ' stall TF-ART-003)');

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

var civicWall = {}, civicBlock = {}, civicOrder = Object.keys(CIVIC).sort();
civicOrder.forEach(function (d) {
  civicWall[d] = texMats(CIVIC[d]);
  civicBlock[d] = CIVIC[d].map(function (id) { return id.indexOf('block_') === 0; });
});
/* THE APPROVED CORRUGATED FAMILY (TF-ART-002, Paolo's 8/11 TILE BOARD verdict):
   the fourth wired family. Three real paint colourways + the bare ribbed metal
   with its rust runs join the metal districts' pools as MATERIALS of their own,
   through the same one-material-per-building machinery the 8/3 pools use. The
   under-eave course, the end jambs and the 110px roll-up doors need course/
   multi-cell placement and stay as named volume. Same refusal as every wired
   family: the bank's law line must say APPROVED. */
var CORR_BANK = 'banks/tileforms/TF-ART-002_CANDIDATES_8_8_26.json';
var corrBank = JSON.parse(fs.readFileSync(CORR_BANK, 'utf8'));
if (String(corrBank.law || '').indexOf('APPROVED') !== 0)
  throw new Error('TILEFORM: ' + CORR_BANK + ' law line is not APPROVED - nothing unjudged draws');
function corrMat(names) {
  return names.map(function (n) {
    var t = corrBank.tiles.filter(function (x) { return x.name === n; })[0];
    if (!t) throw new Error('TILEFORM: piece "' + n + '" missing from ' + CORR_BANK);
    return t.b64;
  });
}
var CORR_MATS = [
  corrMat(['metal_base_0', 'metal_base_1', 'metal_base_2',
           'metal_rust_run_0', 'metal_rust_run_1', 'metal_rust_run_2']),
  corrMat(['metal_paint_offwhite_0', 'metal_paint_offwhite_1', 'metal_paint_offwhite_base']),
  corrMat(['metal_paint_sand_0', 'metal_paint_sand_1', 'metal_paint_sand_base']),
  corrMat(['metal_paint_bluegrey_0', 'metal_paint_bluegrey_1', 'metal_paint_bluegrey_base']),
];
['industrial', 'warehouse', 'storage', 'railyard', 'granary', 'battery',
 'reclaim', 'landfill', 'swapmeet', 'farm'].forEach(function (d) {
  if (civicWall[d]) CORR_MATS.forEach(function (m) { civicWall[d].push(m); civicBlock[d].push(false); });
});
console.log('  TILEFORMS: TF-ART-002 corrugated joins 10 metal districts as 4 materials (fourth wired family)');
/* sixth family: TF-ART-009 brick - the painted-over ghost-sign wall field joins
   the old-brick districts as a material (soldier courses + corners are course
   volume). seventh family: TF-ART-013 mobile home - three real park colourways
   (field + stripe courses) join the trailer pool; skirt, roofs, awning, hitch
   and the burned row are placement volume. Same APPROVED refusal as all. */
function bankMat(bank, bankPath, names) {
  return names.map(function (n) {
    var t = bank.tiles.filter(function (x) { return x.name === n; })[0];
    if (!t) throw new Error('TILEFORM: piece "' + n + '" missing from ' + bankPath);
    return t.b64;
  });
}
var BRICK_BANK = 'banks/tileforms/TF-ART-009_CANDIDATES_8_8_26.json';
var brickBank = JSON.parse(fs.readFileSync(BRICK_BANK, 'utf8'));
if (String(brickBank.law || '').indexOf('APPROVED') !== 0)
  throw new Error('TILEFORM: ' + BRICK_BANK + ' law line is not APPROVED - nothing unjudged draws');
var brickGhost = bankMat(brickBank, BRICK_BANK,
  ['brick_painted_ghost_0', 'brick_painted_ghost_1', 'brick_painted_ghost_2']);
['downtown', 'chapel', 'school', 'commercial', 'courthouse', 'library'].forEach(function (d) {
  if (civicWall[d]) { civicWall[d].push(brickGhost); civicBlock[d].push(false); }
});
var MH_BANK = 'banks/tileforms/TF-ART-013_CANDIDATES_8_8_26.json';
var mhBank = JSON.parse(fs.readFileSync(MH_BANK, 'utf8'));
if (String(mhBank.law || '').indexOf('APPROVED') !== 0)
  throw new Error('TILEFORM: ' + MH_BANK + ' law line is not APPROVED - nothing unjudged draws');
['cream', 'white', 'turq'].forEach(function (cw) {
  var m = bankMat(mhBank, MH_BANK,
    ['mh_field_' + cw + '_0', 'mh_field_' + cw + '_1', 'mh_field_' + cw + '_2',
     'mh_stripe_' + cw + '_0', 'mh_stripe_' + cw + '_1', 'mh_stripe_' + cw + '_2']);
  if (civicWall.trailer) { civicWall.trailer.push(m); civicBlock.trailer.push(false); }
});
/* VOLUME 8/15: the BURNED ROW joins the pool as a material of its own - one
   mass in six draws the burn, whole, because a post-crash park has dead homes
   and a burn is a whole-home event, never a per-cell patchwork. */
var mhBurned = bankMat(mhBank, MH_BANK,
  ['mh_burned_body_0', 'mh_burned_body_1', 'mh_burned_body_2']);
if (civicWall.trailer) { civicWall.trailer.push(mhBurned); civicBlock.trailer.push(false); }
console.log('  TILEFORMS: TF-ART-009 ghost brick joins 6 old-brick districts; TF-ART-013 adds 3 park colourways + the burned row to the trailer pool (sixth + seventh wired families)');
/* PLACEMENT FIX (Paolo 8/11, 'the placement was shit but individually the
   tiles are good'): the roof INTERIOR drew the old 8/1 pool while the new
   coping ring is TF-ART-012 - a brick-textured field against a gravel-rim
   coping read as two different roofs. The roof pool is now the APPROVED
   family's own fields, so ring and field are one roof. */
function roofMat(names) {
  return names.map(function (n) {
    var t = roofBank.tiles.filter(function (x) { return x.name === n; })[0];
    if (!t) throw new Error('TILEFORM: roof field "' + n + '" missing from ' + ROOF_BANK);
    return t.b64;
  });
}
var civicRoofPool = [
  roofMat(['bur_gravel_0', 'bur_gravel_1', 'bur_gravel_2']),
  roofMat(['capsheet_grey_0', 'capsheet_grey_1']),
  roofMat(['capsheet_tan_0', 'capsheet_tan_1']),
];
console.log('  TILEFORMS: TF-ART-012 fields replace the civic roof pool (ring and field are one roof now)');
/* twelfth family: TF-ART-001 CMU courses (pieces grabbed in the early tileform
   section). The cap beam is the top course of a BLOCK-material wall and the vent
   block a sparse mid-wall cell - the bd/bdef flags tell the page which masses
   drew a block material. */
/* TF-RUN-005 8/19: which pool slots are TILT-UP, so the page can hang the
   panel language (joints, cap, plinth, streaks, boards) on exactly the
   masses that drew the tilt-up field. Extras pushed onto the pools after
   the CIVIC map (corrugate, ghost brick, park colourways, burned) are
   never tilt-up, and an absent flag reads falsy, so no padding is needed. */
var civicTilt = {};
civicOrder.forEach(function (d) {
  civicTilt[d] = CIVIC[d].map(function (id) { return id === 'tiltup_concrete'; });
});
var civicPayload = { d: civicWall, def: texMats(CIVIC_DEFAULT), roof: civicRoofPool,
                     bd: civicBlock,
                     bdef: CIVIC_DEFAULT.map(function (id) { return id.indexOf('block_') === 0; }),
                     td: civicTilt,
                     tdef: CIVIC_DEFAULT.map(function (id) { return id === 'tiltup_concrete'; }) };
if (html.indexOf('__CIVIC_SKIN_JSON__') < 0) throw new Error('missing __CIVIC_SKIN_JSON__ placeholder');
html = html.replace('__CIVIC_SKIN_JSON__', JSON.stringify(civicPayload));
console.log('  DISTRICT MATERIALS: ' + civicOrder.length + ' district types mapped to real '
            + 'Vegas construction, + a tilt-up/CMU default, flat tar-and-gravel roofs');

/* ---- THE PARAPET AND THE CIVIC OPENINGS (8/3). Their buildings had the right material
   and NO TOP AND NO WAY IN. On a strip mall the parapet coping and fascia are literally
   the parts a customer sees from the parking lot; on a warehouse the roof is invisible
   from the ground entirely. The parapet is the SILHOUETTE, not trim.
   And it is the OPPOSITE of a house eave: a house roof oversails the WALL, a parapet
   WALL oversails the roof. Getting that backwards makes every warehouse a very large
   bungalow. Cook + sources: tools/bohemia_civic_openings_cook.py ---- */
var CIVIC_OPEN = 'banks/BOHEMIA_CIVIC_OPENINGS_8_3_26.txt';
var civOpen = JSON.parse(fs.readFileSync(CIVIC_OPEN, 'utf8'));
var civMap = {};
civOpen.tiles.forEach(function (t) { civMap[t.id.replace('civic_', '')] = t.b64; });
['parapet', 'dock', 'storefront', 'mandoor'].forEach(function (k) {
  if (!civMap[k]) throw new Error('CIVIC OPENINGS: missing "' + k + '" in ' + CIVIC_OPEN);
});
/* WHICH OPENING A BUILDING GETS, and "none" is a real answer. A casino is famously a
   blank box and a corrugated warehouse wall is a blank box; punching an opening into
   everything would be the lie. */
var CIVIC_OPEN_BY = {
  dock: ['industrial', 'warehouse', 'storage', 'railyard', 'granary', 'arsenal',
         'battery', 'substation', 'reclaim', 'landfill', 'airbase', 'farm', 'swapmeet',
         'speedway', 'minigp', 'radio', 'fort'],
  storefront: ['commercial', 'mall', 'downtown', 'casino', 'strip', 'resort', 'medical',
               'school', 'library', 'campus', 'convention', 'ballpark', 'waterpark',
               'courthouse', 'chapel', 'policestation', 'highroller', 'sphere', 'strat'],
  mandoor: ['jail', 'apartment', 'trailer']
};
if (html.indexOf('__CIVIC_OPEN_JSON__') < 0) throw new Error('missing __CIVIC_OPEN_JSON__ placeholder');
html = html.replace('__CIVIC_OPEN_JSON__', JSON.stringify({ t: civMap, by: CIVIC_OPEN_BY }));
console.log('  CIVIC OPENINGS: parapet + dock + storefront + man door, '
            + Object.keys(CIVIC_OPEN_BY).reduce(function (n, k) {
                return n + CIVIC_OPEN_BY[k].length; }, 0) + ' districts assigned');

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
/* ---- THE EXTERIOR POOL (8/5). The same crossing as the interior pool above,
   pointed OUTSIDE, where the valley had literally zero objects in it.
   banks/BOHEMIA_HD_TILE_REPO_part1..4 is 8,674 tiles he bought and MEASURED ZERO
   had ever drawn a pixel; banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26 is his own
   Great Sweep over them, 1,927 UP. One lane took the 465 that belong in rooms and
   stopped at the front door. This ships the outdoor ones.
   UP-ONLY IS LOAD-BEARING: a DOWN tile in this file would put art on his screen
   he already rejected, so the builder refuses the pool rather than trust it. ---- */
var XPOOL_PATH = 'banks/BOHEMIA_EXTERIOR_POOL_8_5_26.txt';
var xpool = JSON.parse(fs.readFileSync(XPOOL_PATH, 'utf8'));
if (!/UP-ONLY/.test(xpool.law || '')) throw new Error(XPOOL_PATH + ' is not the UP-only pool');
var xOut = {};
Object.keys(xpool.buckets).forEach(function (b) {
  xOut[b] = xpool.buckets[b].map(function (e) {
    return { s: parseFloat(e.s) || 1, p: e.pack, b64: e.b64 };
  });
});
['street', 'wreck', 'trash', 'crate', 'dead', 'barrier', 'camp'].forEach(function (b) {
  if (!xOut[b] || !xOut[b].length) throw new Error('the exterior pool is missing bucket ' + b);
});
/* ---- THE GROUND POOL (8/6). Measured: boughtForTile() only ever answers
   road / walk / yard, so forty named surfaces collapse to the SUBURB'S dirt and a
   farm has no field. His own 7/13 sweep approved soil, dirt path, stone path and
   cracked concrete tiles and none of them had ever drawn. UP-only, same as the
   others, and the builder refuses the pool rather than trust it. ---- */
var GPOOL_PATH = 'banks/BOHEMIA_GROUND_POOL_8_6_26.txt';
var gpool = JSON.parse(fs.readFileSync(GPOOL_PATH, 'utf8'));
if (!/UP-ONLY/.test(gpool.law || '')) throw new Error(GPOOL_PATH + ' is not the UP-only pool');
var gOut = {};
Object.keys(gpool.buckets).forEach(function (b) {
  gOut[b] = gpool.buckets[b].map(function (e) { return { p: e.pack, b64: e.b64 }; });
});
['gravel'].forEach(function (b) {
  if (!gOut[b] || !gOut[b].length) throw new Error('the ground pool is missing bucket ' + b);
});
if (html.indexOf('__GROUND_POOL_JSON__') < 0) throw new Error('missing __GROUND_POOL_JSON__ placeholder');
html = html.replace('__GROUND_POOL_JSON__', JSON.stringify({ version: gpool.version, buckets: gOut }));
console.log('  GROUND POOL: ' + Object.keys(gOut).reduce(function (n, b) { return n + gOut[b].length; }, 0) +
            ' ground tiles he approved 7/13, drawing for the first time');

if (html.indexOf('__EXTERIOR_POOL_JSON__') < 0) throw new Error('missing __EXTERIOR_POOL_JSON__ placeholder');
html = html.replace('__EXTERIOR_POOL_JSON__', JSON.stringify({
  version: xpool.version, buckets: xOut }));
console.log('  EXTERIOR POOL: ' + Object.keys(xOut).reduce(function (n, b) { return n + xOut[b].length; }, 0) +
            ' objects he thumbed UP on 7/13, outdoors for the first time');

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
