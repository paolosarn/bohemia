/* THE TILE BOARD JUDGE PAGE (8/9/26).
 *
 * Paolo 8/8: "ultracode go: swarm the tile request board... deliver everything as
 * assembled judge scenes batched by discipline for one Paolo sitting."
 *
 * The swarm cooked 15 of the board's 49 merged jobs before the clock ran out
 * (session usage limit). Every cooked bank is UNJUDGED by its own law line;
 * nothing in them draws a pixel in the game until he sweeps them. This page is
 * that sitting: one card per tile family, the money shot first (the family
 * ASSEMBLED in a scene beside the approved art it has to live with), tap to step
 * through the proofs, thumbs, note, export .txt.
 *
 * WHY THE IMAGES ARE COPIED INTO records/target/: GitHub Pages publishes ONLY
 * slices/ + engine/ + records/target (_config.yml, 8/6, after three builds in a
 * row died copying the whole repo). records/tileforms_proofs/ is NOT published,
 * so a page that referenced it would work on disk and 404 in production — the
 * exact trap the config file warns about at its top. This builder copies the
 * curated shots (about 7 MB of the 19 MB proof set) into
 * records/target/tileforms/, which is already on the publish list, so no config
 * and no workflow change and pages_publish_gate stays untouched.
 *
 * REUSE CHECK: cooks no game pixels. It lays out proof renders the tfcook swarm
 * already produced under records/tileforms_proofs/, and reuses the judge-page
 * conventions already shipped in slices/BOHEMIA_ART_CURRENT.html (tap-to-flip,
 * thumbs + per-item note + bottom comment + SUN MODE + .txt export).
 *
 *   node tools/build_tileforms_judge.js
 *     -> records/target/tileforms/*.png (curated copies)
 *     -> slices/BOHEMIA_TILEFORMS_JUDGE_8_9_26.html
 */
'use strict';
const fs = require('fs');
const path = require('path');

const REPO = path.dirname(__dirname);
const PROOFS = path.join(REPO, 'records', 'tileforms_proofs');
const PUB = path.join(REPO, 'records', 'target', 'tileforms');
const OUT = path.join(REPO, 'slices', 'BOHEMIA_TILEFORMS_JUDGE_8_9_26.html');

/* one card per cooked family. title = his words. shots = money shot FIRST
   (assembled, in place, beside approved art), then the anchor comparison, then
   the contact sheet so he can point at one tile by name. */
const FORMS = [
  { id: 'TF-ART-001', tiles: 6, title: 'THE GREY BLOCK WALL',
    what: 'the concrete block wall that rings half of Vegas: the field you already approved, plus the cap beam and the vent block it never had.',
    shots: [['WALL_ASSEMBLY_cap_vent_field.png', 'WALL ASSEMBLED'],
            ['ANCHOR_COMPOSITE_beside_block_grey_and_starter.png', 'BESIDE YOUR APPROVED WALL'],
            ['CONTACT_SHEET_all_variants.png', 'EVERY TILE']] },
  { id: 'TF-ART-002', tiles: 26, title: 'CORRUGATED METAL + ROLL-UP DOORS',
    what: 'warehouse skin: ribbed metal in four paints, rust runs, the under-eave shadow course, and roll-up doors including one pried half open.',
    shots: [['WAREHOUSE_FACE_10TILE_4COURSE.png', 'WAREHOUSE FACE ASSEMBLED'],
            ['STORAGE_ROW_vs_STUCCO_PASS_vs_HOUSE.png', 'BESIDE STORAGE + HOUSE'],
            ['DOORS_pried_and_surround_in_wall.png', 'THE DOORS'],
            ['CONTACT_SHEET_all_variants.png', 'EVERY TILE']] },
  { id: 'TF-ART-003', tiles: 49, title: 'PARKING LOT LINES',
    what: 'stall stripes, double lines, the ADA hatch and the painted arrow, all washed down to 30 years of sun per your street-bank rulings.',
    shots: [['ASSEMBLED_STALL_ROW_with_bank_arrow.png', 'STALL ROW ASSEMBLED'],
            ['ANCHOR_COMPOSITE_beside_road_crossing.png', 'BESIDE YOUR ROAD'],
            ['RAIN_STATE_same_row_palette_only.png', 'SAME ROW, RAIN'],
            ['CONTACT_SHEET_all_variants.png', 'EVERY TILE']] },
  { id: 'TF-ART-004', tiles: 31, title: 'CHAIN-LINK FENCE',
    what: 'see-through chain-link with posts, gates, slat and razor-wire variants. It stays transparent so the world shows through the mesh.',
    shots: [['proof_anchor_composite.png', 'IN PLACE'],
            ['proof_transparency_bright_dark_day_night.png', 'SEE-THROUGH TEST'],
            ['proof_3x3_run_rail.png', 'RUN WITH TOP RAIL'],
            ['proof_contact_sheet_all.png', 'EVERY TILE']] },
  { id: 'TF-ART-005', tiles: 60, title: 'DEAD SPORTS FIELDS + TRACK',
    what: 'the school and stadium ground set: dead turf with faded lines, the oxide running track, the cracked court, infield, bunkers, banking.',
    shots: [['STADIUM_IN_PLACE_1x.png', 'STADIUM IN PLACE'],
            ['FIELD_CORNER_LINE_STOPS_beside_yard_desert.png', 'FIELD CORNER VS DESERT'],
            ['CONTACT_SHEET_all.png', 'EVERY TILE']] },
  { id: 'TF-ART-006', tiles: 38, title: 'EMPTY POOLS',
    what: 'the drained backyard pool and the concrete basin: ring band, deep end shadow, silt floor, and the treatment-plant clarifier.',
    shots: [['POOL_ASSEMBLY_ANCHOR.png', 'POOL ASSEMBLED'],
            ['CLARIFIER_ANCHOR.png', 'THE CLARIFIER'],
            ['RING_CLOSURE.png', 'THE RING CLOSES'],
            ['CONTACT_SHEET.png', 'EVERY TILE']] },
  { id: 'TF-ART-008', tiles: 34, title: 'STOREFRONT GLASS',
    what: 'the shop fronts: dead dark act-1 glass, boarded and shuttered bays, the sign band, awnings over the walk. Nothing glows; power is territory.',
    shots: [['SHOPRUN_IN_PLACE_2x.png', 'SHOP RUN IN PLACE'],
            ['ANCHOR_COMPOSITE.png', 'BESIDE APPROVED ART'],
            ['CONTACT_SHEET_all.png', 'EVERY TILE']] },
  { id: 'TF-ART-009', tiles: 10, title: 'BRICK',
    what: 'running bond brick, the soldier course, the corner stack, and the painted-over wall, in the tan-wall world you locked.',
    shots: [['RUN_6WIDE_3TALL.png', 'WALL RUN ASSEMBLED'],
            ['ANCHOR_COMPOSITE_3x.png', 'BESIDE APPROVED ART'],
            ['CONTACT_SHEET_all.png', 'EVERY TILE']] },
  { id: 'TF-ART-010', tiles: 22, title: 'TRAIN TRACKS',
    what: 'ballast, ties and rail that run seamless for twenty cells, plus the road crossing, the turnout and the buffer stop for the railyard.',
    shots: [['CONTINUITY_20CELL_with_freeway.png', '20 CELLS UNDER THE FREEWAY'],
            ['CROSSING_ASSEMBLED.png', 'THE ROAD CROSSING'],
            ['TURNOUT_ASSEMBLED.png', 'THE TURNOUT'],
            ['CONTACT_SHEET_all.png', 'EVERY TILE']] },
  { id: 'TF-ART-011', tiles: 16, title: 'THE FREEWAY',
    what: 'wide-lane asphalt with drifted sand, the concrete barrier, guardrail, shoulder and the elevated deck edge.',
    shots: [['proof_deck_daylight.png', 'THE DECK IN DAYLIGHT'],
            ['proof_phase_barrier_20cells.png', 'BARRIER RUNS 20 CELLS'],
            ['proof_contact_sheet_all.png', 'EVERY TILE']] },
  { id: 'TF-ART-012', tiles: 86, title: 'FLAT ROOFS',
    what: 'what you see from above every store: gravel and cap-sheet roof fields, the parapet ring in three colourways, dead AC units, hatches, ducts.',
    shots: [['P08_warehouse_plate_galv.png', 'WAREHOUSE ROOF ASSEMBLED'],
            ['P09_civic_plate_bone.png', 'CIVIC ROOF ASSEMBLED'],
            ['P10_anchor_composite.png', 'BESIDE APPROVED ART'],
            ['P11_contact_sheet.png', 'EVERY TILE']] },
  { id: 'TF-ART-013', tiles: 45, title: 'MOBILE HOMES',
    what: 'the trailer park set: ribbed siding in the real park colours, skirt, awning, hitch, and the burned-out row.',
    shots: [['SINGLEWIDE_ASSEMBLED_16CELL.png', 'SINGLE-WIDE ASSEMBLED'],
            ['TRAILER_ROW_vs_SUBURB_STREET.png', 'TRAILER ROW VS SUBURB'],
            ['BURNED_ROW_DEADLEVEL_RAILS.png', 'THE BURNED ROW'],
            ['CONTACT_SHEET_all_variants.png', 'EVERY TILE']] },
  { id: 'TF-ART-014', tiles: 43, title: 'DEAD CROP FIELDS',
    what: 'the farm ground: dead furrowed field, bare plot, the field edge ring against desert, berms, ditches and the dirt track.',
    shots: [['FARM_BLOCK_IN_PLACE_1x.png', 'FARM BLOCK IN PLACE'],
            ['EDGE_RING_vs_desert.png', 'FIELD EDGE VS DESERT'],
            ['CONTACT_SHEET_all.png', 'EVERY TILE']] },
  { id: 'TF-ART-015', tiles: 55, title: 'THE LANDFILL',
    what: 'refuse ground, the caliche cover cap, the pond edge, the haul road and litter drift on the fence line.',
    shots: [['SCENE_12x12.png', 'THE WHOLE CELL ASSEMBLED'],
            ['ANCHOR_COMPOSITE.png', 'BESIDE APPROVED ART'],
            ['CONTACT_SHEET.png', 'EVERY TILE']] },
  { id: 'TF-CMB-005', tiles: 4, title: 'THE DECK STAIRS',
    what: 'the stair run from the parking deck down to the lot, for the combat arena approaches.',
    shots: [['arena_mock_full_2x.png', 'IN THE ARENA MOCK'],
            ['anchor_composite_3x.png', 'BESIDE APPROVED ART'],
            ['contact_sheet_3x.png', 'EVERY TILE']] },
  { id: 'TF-RUN-008', tiles: 6, title: 'THE THREE MONEY ICONS',
    what: 'the game’s first UI marks, for the Wallet and the ME tab: RESOURCES is a duct-tape roll with a hammer behind it and an apple at the base, ENERGY is a dented jerrycan with a bolt across it and a scavenged battery, CLOUT is a crowd merged into one shape with a speech bubble. Each also ships a dimmed can’t-afford version. Never on a feed post (you killed that badge 7/21).',
    shots: [['PHONE_CHROME_MOCK.png', 'ON PHONE CHROME, BOTH THEMES'],
            ['CONTACT_32_64_96.png', 'THREE SIZES'],
            ['SOLID_BLACK_TEST.png', 'THE SILHOUETTE TEST'],
            ['DIMMED_ROW.png', 'CANT-AFFORD STATE']] },
  { id: 'TF-CHAR-001', tiles: 6, title: 'THE SHADOW UNDER YOUR FEET',
    what: 'a soft warm oval that darkens whatever ground you stand on, so the body stops floating like a sticker. Three sizes (standing, walking, crouched), a faint version for unlit cells. It has no colour of its own: on pale dirt it reads, on dark asphalt it nearly disappears, which is how real Vegas shade works.',
    shots: [['REAL_FRAME_AB.png', 'REAL FRAME, WITHOUT / WITH'],
            ['GROUND_RESPONSE_ALL_SURFACES.png', 'ON EVERY GROUND YOU APPROVED'],
            ['STAMPS_2X_ON_FLAT.png', 'ALL SIX STAMPS']] },
];

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

/* copy the curated shots into the published folder. A card missing its picture
   lies; fail loudly. */
fs.mkdirSync(PUB, { recursive: true });
const missing = [];
let copied = 0, bytes = 0;
for (const f of FORMS) {
  for (const [file] of f.shots) {
    const src = path.join(PROOFS, f.id, file);
    if (!fs.existsSync(src)) { missing.push(f.id + '/' + file); continue; }
    const dst = path.join(PUB, f.id + '__' + file);
    fs.copyFileSync(src, dst);
    copied++; bytes += fs.statSync(dst).size;
  }
}
if (missing.length) {
  console.error('MISSING PROOFS:\n  ' + missing.join('\n  '));
  process.exit(1);
}

const totalTiles = FORMS.reduce((n, f) => n + f.tiles, 0);

const cardHtml = FORMS.map((f, i) => `
  <section class="card" data-id="${f.id}">
    <h2><span class="n">${i + 1}</span>${esc(f.title)}</h2>
    <p class="ask">Tap the picture to step through. Does this belong in your world?</p>
    <div class="shotwrap cyc" data-card="${f.id}">
      ${f.shots.map(([file, lbl], j) => `<img class="cycimg${j === 0 ? ' on' : ''}" data-j="${j}"
           src="../records/target/tileforms/${f.id}__${file}" alt="${esc(lbl)}" loading="lazy">`).join('\n      ')}
      <div class="flag" id="flag_${f.id}">${esc(f.shots[0][1])} · 1/${f.shots.length}</div>
      <div class="taphint">TAP FOR NEXT</div>
    </div>
    <p class="why">${esc(f.what)}</p>
    <p class="num">${f.tiles} candidate tiles · ${esc(f.id)} · UNJUDGED until you thumb it</p>
    <div class="verdict">
      <button class="thumb up"   data-card="${f.id}" data-v="UP">&#128077; YES</button>
      <button class="thumb down" data-card="${f.id}" data-v="DOWN">&#128078; NO</button>
    </div>
    <textarea class="note" data-card="${f.id}" placeholder="say anything about this one"></textarea>
  </section>`).join('\n');

const META = JSON.stringify(FORMS.map(f => ({
  id: f.id, title: f.title, labels: f.shots.map(s => s[1]) })));

const html = `<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA — TILE BOARD</title>
<style>
  :root{ --bg:#0d0d12; --ink:#e8e0cc; --faint:#8a8070; --line:#2a2620;
         --gold:#d8b24a; --card:#15151c; }
  body.sun{ --bg:#e9e4d6; --ink:#1a1710; --faint:#5c5446; --line:#b8ae98; --card:#f4f0e4; }
  *{ box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
  body{ margin:0; background:var(--bg); color:var(--ink);
        font:14px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;
        padding:10px 10px 40px; }
  header{ display:flex; align-items:center; gap:8px; margin-bottom:10px; }
  h1{ font-size:13px; letter-spacing:2px; margin:0; flex:1; color:var(--gold); }
  .sunbtn{ font:11px ui-monospace,monospace; letter-spacing:1px; padding:7px 10px;
           background:transparent; color:var(--ink); border:1px solid var(--line);
           border-radius:4px; }
  .back{ font:11px ui-monospace,monospace; letter-spacing:1px; padding:7px 10px;
         color:var(--ink); border:1px solid var(--line); border-radius:4px;
         text-decoration:none; flex:none; }
  .lede{ font-size:12px; color:var(--faint); margin:0 0 14px; line-height:1.55; }
  .card{ background:var(--card); border:1px solid var(--line); border-radius:8px;
         padding:12px; margin-bottom:16px; }
  h2{ font-size:13px; letter-spacing:1.5px; margin:0 0 6px; display:flex; gap:8px; align-items:center; }
  .n{ display:inline-flex; align-items:center; justify-content:center; width:20px; height:20px;
      border-radius:50%; background:var(--gold); color:#14120c; font-size:11px; flex:none; }
  .ask{ font-size:13px; margin:0 0 10px; }
  .shotwrap{ position:relative; line-height:0; border:1px solid var(--line);
             border-radius:6px; overflow:hidden; background:#000; cursor:pointer; }
  .shotwrap img{ width:100%; display:none; image-rendering:pixelated; }
  .shotwrap img.on{ display:block; }
  .flag{ position:absolute; left:8px; top:8px; font:11px ui-monospace,monospace;
         letter-spacing:1px; background:rgba(12,10,8,.82); color:#e8e0cc;
         border:1px solid #3a3020; border-radius:3px; padding:4px 8px; line-height:1; }
  .taphint{ position:absolute; right:8px; bottom:8px; font:10px ui-monospace,monospace;
            letter-spacing:2px; background:rgba(12,10,8,.82); color:#d8b24a;
            border:1px solid #3a3020; border-radius:3px; padding:4px 8px; line-height:1; }
  .why{ font-size:12px; color:var(--faint); margin:10px 0 4px; line-height:1.55; }
  .num{ font-size:11px; color:var(--gold); margin:0 0 10px; letter-spacing:.5px; }
  .verdict{ display:flex; gap:8px; }
  .thumb{ flex:1; font:12px ui-monospace,monospace; letter-spacing:1px; padding:12px 4px;
          background:transparent; color:var(--ink); border:1px solid var(--line); border-radius:5px; }
  .thumb.on.up{ background:#2f5d34; border-color:#4a8a52; color:#eaffea; }
  .thumb.on.down{ background:#5d2f2f; border-color:#8a4a4a; color:#ffeaea; }
  textarea{ width:100%; margin-top:8px; min-height:44px; background:transparent;
            color:var(--ink); border:1px solid var(--line); border-radius:5px;
            padding:8px; font:12px ui-monospace,monospace; resize:vertical; }
  .bottom{ border-top:1px solid var(--line); padding-top:14px; }
  .bottom h3{ font-size:12px; letter-spacing:1.5px; margin:0 0 8px; color:var(--gold); }
  .bottom textarea{ min-height:110px; }
  .exp{ width:100%; margin-top:10px; font:12px ui-monospace,monospace; letter-spacing:2px;
        padding:15px; background:var(--gold); color:#14120c; border:0; border-radius:6px; }
  .done{ font-size:11px; color:var(--faint); text-align:center; margin-top:8px; min-height:14px; }
</style>

<header>
  <a class="back" href="BOHEMIA_ART_CURRENT.html">&larr; ART</a>
  <h1>TILE BOARD &middot; 8/9 &middot; ${FORMS.length} FAMILIES, ${totalTiles} TILES</h1>
  <button class="sunbtn" id="sunbtn">SUN MODE</button>
</header>
<p class="lede">The tile request board, cooked. ${FORMS.length} tile families, ${totalTiles} candidate
tiles, every one measured against your palette laws before it got here, NONE of it in
the game yet. A thumbs up unlocks a family for real use; a thumbs down kills it. Tap
each picture to step through the shots. EXPORT at the bottom and send me the file.</p>

${cardHtml}

<div class="bottom">
  <h3>ANYTHING ELSE</h3>
  <textarea id="all" placeholder="whatever you want to say"></textarea>
  <button class="exp" id="exp">EXPORT MY VERDICT</button>
  <div class="done" id="done"></div>
</div>

<script>
var FORMS = ${META};
var V = {}, NOTE = {}, AT = {};

/* tap steps through the shots; the flag names what you are on */
document.querySelectorAll('.shotwrap.cyc').forEach(function(w){
  var id = w.getAttribute('data-card');
  AT[id] = 0;
  w.addEventListener('click', function(){
    var imgs = w.querySelectorAll('.cycimg');
    AT[id] = (AT[id] + 1) % imgs.length;
    imgs.forEach(function(im, j){ im.classList.toggle('on', j === AT[id]); });
    var f = FORMS.filter(function(x){ return x.id === id; })[0];
    document.getElementById('flag_' + id).textContent =
      f.labels[AT[id]] + ' \\u00b7 ' + (AT[id] + 1) + '/' + imgs.length;
  });
});

document.querySelectorAll('.thumb').forEach(function(bt){
  bt.addEventListener('click', function(){
    var id = bt.getAttribute('data-card'), v = bt.getAttribute('data-v');
    V[id] = (V[id] === v) ? null : v;
    document.querySelectorAll('.thumb[data-card="' + id + '"]').forEach(function(o){
      o.classList.toggle('on', V[id] === o.getAttribute('data-v'));
    });
  });
});
document.querySelectorAll('textarea.note').forEach(function(t){
  t.addEventListener('input', function(){ NOTE[t.getAttribute('data-card')] = t.value; });
});

/* warm the hidden frames after paint so every tap lands instantly */
window.addEventListener('load', function(){
  setTimeout(function(){
    document.querySelectorAll('img').forEach(function(im){
      if (im.naturalWidth) return;
      var w = new Image(); w.src = im.getAttribute('src');
    });
  }, 400);
});

document.getElementById('sunbtn').addEventListener('click', function(){
  document.body.classList.toggle('sun');
});

/* .txt, NEVER .json (verdict workflow, standing) */
document.getElementById('exp').addEventListener('click', function(){
  var L = ['BOHEMIA TILE BOARD VERDICT', 'sitting 8/9 - 15 FAMILIES', ''];
  FORMS.forEach(function(f){
    L.push(f.id + ' ' + f.title);
    L.push('  verdict: ' + (V[f.id] || 'NO ANSWER'));
    if (NOTE[f.id]) L.push('  note: ' + NOTE[f.id]);
    L.push('');
  });
  var all = document.getElementById('all').value;
  if (all) { L.push('ANYTHING ELSE'); L.push(all); L.push(''); }
  var blob = new Blob([L.join('\\n')], { type: 'text/plain' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'BOHEMIA_TILE_BOARD_VERDICT.txt';
  document.body.appendChild(a); a.click(); a.remove();
  document.getElementById('done').textContent = 'exported. send me the file.';
});
</script>
`;

fs.writeFileSync(OUT, html);
console.log('built slices/BOHEMIA_TILEFORMS_JUDGE_8_9_26.html (' + html.length + ' bytes, ' +
            FORMS.length + ' cards, ' + copied + ' shots copied, ' +
            (bytes / 1048576).toFixed(1) + ' MB into records/target/tileforms/)');
