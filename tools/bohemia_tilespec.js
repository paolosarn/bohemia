// BOHEMIA TILE SPEC GENERATOR (Paolo 7/19/26: "every time I approve a district you're
// recording a note section about everything you built, so when it comes to put TILES on it
// it's a lot easier, right"). This is that note section, GENERATED from the source of truth
// (each district module's exposed LEGEND + PALETTE) so it can never drift from the code.
//
// For every built district it writes records/tilespec/BOHEMIA_TILESPEC_<name>.md — the sheet
// the tiling phase reads: every tile code -> name, kind, its ACT-1 dead-world material, its
// color, and whether it actually appears in a generated cell. Act 2/3 evolution is left
// [PENDING Paolo] (CONTENTS-PAOLO'S). Also writes a consolidated INDEX.
//
//   node tools/bohemia_tilespec.js
const fs = require('fs'), path = require('path');
const K = require('../engine/bohemia_district_kit.js');
const ROOT = path.dirname(__dirname);

/* *** THE CITATION WAS A GUESS, AND TWENTY-ONE DOSSIERS POINTED AT FILES THAT DO NOT
   EXIST. (9/23, PLUMBER, row [rot ceiling].) ***
   Every sheet this tool writes opens with "GENERATED from `engine/bohemia_<name>.js`",
   and that path used to be BUILT FROM THE DISTRICT'S NAME rather than from the module
   that was actually loaded. For the districts named by hand below that happens to be
   true. For every district the REGISTRY SWEEP finds -- the mechanism added so a new
   landmark needs no edit here -- it is a guess, because those live inside SHARED
   modules: twelve utility landmarks are all in bohemia_utility.js, five more in
   bohemia_landmarks.js, two in bohemia_airfield.js, and so on.

   MEASURED before changing anything: 71 dossiers carry a citation, 21 CITE A FILE THAT
   IS NOT ON DISK, and across all 72 registered types the old guess was right for 50 and
   WRONG FOR 22. Three of them (reclaim, reservoir, strip_x) name files that have never
   been in git at all, which is what pushed canon_rot_gate over its ceiling and made
   every lane read that red as its own.

   THE FIX IS NOT A TABLE OF EXCEPTIONS, because the next landmark would need a line in
   it and that is the bug the sweep was built to kill. ASK NODE WHO REGISTERED THE TYPE:
   wrap K.register before a single generator loads and record the engine file that was
   executing. It covers all 72 with no list to maintain, and a shared module that gains
   a thirteenth landmark cites itself correctly with no edit.
   FLOOR, below: a citation is never written unless the file is ON DISK. A generator
   that states a path it did not check is the same defect in a smaller font. */
const OWNER = {};
(function traceOwners() {
  const real = K.register.bind(K);
  K.register = function (type, spec) {
    const st = (new Error().stack || '').split('\n').slice(2);
    const hit = st.map(l => { const m = /\(?(\/[^()\s:]+\.js):\d+/.exec(l); return m && m[1]; })
                  .filter(Boolean).find(f => f.includes(path.sep + 'engine' + path.sep));
    if (hit && !OWNER[type]) OWNER[type] = path.relative(ROOT, hit).split(path.sep).join('/');
    return real(type, spec);
  };
})();

/* the citation, or an honest refusal. Never a path nobody looked for. */
let unciteable = [];
function citationFor(name) {
  const own = OWNER[name];
  if (own && fs.existsSync(path.join(ROOT, own))) return '`' + own + '`';
  unciteable.push(name + (own ? ' -> ' + own + ' (not on disk)' : ' (no owning module found)'));
  return 'a module this generator could not identify';
}
const OUT = path.join(ROOT, 'records', 'tilespec');
fs.mkdirSync(OUT, { recursive: true });

const DISTRICTS = [
  { name: 'suburb',     mod: require('../engine/bohemia_suburb.js') },
  { name: 'commercial', mod: require('../engine/bohemia_commercial.js') },
  { name: 'industrial', mod: require('../engine/bohemia_industrial.js') },
  { name: 'medical',    mod: require('../engine/bohemia_medical.js') },
  { name: 'solar',      mod: require('../engine/bohemia_solar.js') },
  { name: 'park',       mod: require('../engine/bohemia_park.js') },
  { name: 'wash',       mod: require('../engine/bohemia_wash.js') },
  { name: 'cemetery',   mod: require('../engine/bohemia_cemetery.js') },
  { name: 'drivein',    mod: require('../engine/bohemia_drivein.js') },
  { name: 'golf',       mod: require('../engine/bohemia_golf.js') },
  { name: 'stadium',    mod: require('../engine/bohemia_stadium.js') },
  { name: 'truckstop',  mod: require('../engine/bohemia_truckstop.js') },
  { name: 'school',     mod: require('../engine/bohemia_school.js') },
  { name: 'firestation',mod: require('../engine/bohemia_firestation.js') },
  { name: 'swapmeet',   mod: require('../engine/bohemia_swapmeet.js') },
  { name: 'storage',    mod: require('../engine/bohemia_storage.js') },
  { name: 'watertreat', mod: require('../engine/bohemia_watertreat.js') },
  { name: 'boneyard',   mod: require('../engine/bohemia_boneyard.js') },
  { name: 'policestation', mod: require('../engine/bohemia_policestation.js') },
  { name: 'library',    mod: require('../engine/bohemia_library.js') },
  { name: 'landfill',   mod: require('../engine/bohemia_landfill.js') },
  { name: 'railyard',   mod: require('../engine/bohemia_railyard.js') },
  { name: 'substation', mod: require('../engine/bohemia_substation.js') },
  { name: 'chapel',     mod: require('../engine/bohemia_chapel.js') },
  { name: 'courthouse', mod: require('../engine/bohemia_courthouse.js') },
  { name: 'jail',       mod: require('../engine/bohemia_jail.js') },
  { name: 'farm',       mod: require('../engine/bohemia_farm.js') },
  { name: 'downtown',   mod: require('../engine/bohemia_downtown.js') },
  { name: 'trailer',    mod: require('../engine/bohemia_trailer.js') },
  { name: 'apartment',  mod: require('../engine/bohemia_apartment.js') },
  { name: 'warehouse',  mod: require('../engine/bohemia_warehouse.js') },
  { name: 'waterpark',  mod: require('../engine/bohemia_waterpark.js') },
  { name: 'mall',       mod: require('../engine/bohemia_mall.js') },
  { name: 'cityhall',   mod: require('../engine/bohemia_cityhall.js') },
  { name: 'battery',    mod: require('../engine/bohemia_battery.js') },
  { name: 'terminal',   mod: require('../engine/bohemia_terminal.js') },
  // SURFACE CELLS (7/26/26): the road network tiles. Not districts (they never become
  // territory or an address), but they are real ground bodies stand on and 37% of the
  // valley is made of them, so the tiling phase needs their sheets exactly the same way.
  { name: 'arterial',   mod: require('../engine/bohemia_arterial.js') },
  { name: 'freeway',    mod: require('../engine/bohemia_freeway.js') },
  { name: 'desert',     mod: require('../engine/bohemia_desert.js') },
  { name: 'mountain',   mod: require('../engine/bohemia_mountain.js') },
  { name: 'water',      mod: require('../engine/bohemia_water.js') },
  { name: 'airport',    mod: require('../engine/bohemia_airfield.js') },
  { name: 'rail',       mod: require('../engine/bohemia_rail.js') },
  { name: 'interchange',mod: require('../engine/bohemia_interchange.js') },
  { name: 'campus',     mod: require('../engine/bohemia_campus.js') },
  { name: 'speedway',   mod: require('../engine/bohemia_speedway.js') },
  { name: 'town',       mod: require('../engine/bohemia_town.js') },
  { name: 'ballpark',   mod: require('../engine/bohemia_ballpark.js') },
];

// AND THEN EVERY DISTRICT THE HAND-WRITTEN LIST ABOVE DOES NOT KNOW ABOUT.
// 8/5/26, seventh-and-then-some sighting of A VALUE PASSED BY HAND WHERE A VALUE COULD BE
// DERIVED: this list is a second copy of the district registry, kept by hand, and the
// twelve utility landmarks shipped with no dossier because nobody remembered to add twelve
// lines here. The kit registry ALREADY knows every district that exists -- it is the thing
// the world model, the renderers and every other gate read. So sweep it, and anything the
// list above did not name gets its dossier from the registry entry itself. The thirteenth
// landmark needs no edit to this file, which is the whole point.
require('../engine/bohemia_world.js');            // loads + registers every generator
const named = new Set(DISTRICTS.map(d => d.name));
for (const t of K.types().sort()) {
  if (named.has(t)) continue;
  const spec = K.get(t);
  if (!spec || typeof spec.generate !== 'function' || !spec.legend) continue;
  DISTRICTS.push({ name: t, mod: spec });
}

const TILE = K.TILE, N = K.SZ;
function countCodes(mod) {
  try { const r = mod.generate(1, { streets: ['S'], cw: 1, ch: 1 }); const t = {};
    for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t;
  } catch (e) { return null; }
}

const index = [];
for (const d of DISTRICTS) {
  const legend = d.mod.legend, palette = d.mod.palette || {};
  if (!legend) { console.log('  SKIP ' + d.name + ' (no legend exposed)'); continue; }
  const cat = K.category(d.name) || '(uncategorized)';
  const present = countCodes(d.mod) || {};
  const drivable = Object.keys(legend).some(c => legend[c].kind === 'drive');
  const codes = Object.keys(legend).map(Number).sort((a, b) => a - b);

  const notes = d.mod.notes;
  let md = '# BOHEMIA DISTRICT DOSSIER — ' + d.name.toUpperCase() + '\n\n';
  md += '_Category: **' + cat + '**  ·  Cell: 96 m × 96 m = ' + N + '×' + N + ' tiles (' + TILE + ' m/tile)  ·  ';
  md += 'Street-aware + ' + (drivable ? 'drivable (explicit car network)' : 'no car network') + '_\n\n';
  md += 'GENERATED from ' + citationFor(d.name) + ' (NOTES + LEGEND + PALETTE) — do not hand-edit; ';
  md += 'rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ';
  md += 'ACT-2/3 evolution is Paolo\'s call.\n\n';
  // ---- the DOSSIER: what the hell is happening in this district ----
  if (notes) {
    if (notes.summary) md += '**' + notes.summary + '**\n\n';
    if (notes.reference && notes.reference.length) md += '### Real-world reference\n' + notes.reference.map(s => '- ' + s).join('\n') + '\n\n';
    if (notes.layout && notes.layout.length) md += '### Layout — what is where\n' + notes.layout.map(s => '- ' + s).join('\n') + '\n\n';
    if (notes.circulation) md += '### Circulation (street-aware / drivable)\n' + notes.circulation + '\n\n';
    if (notes.layering) md += '### Layering — exterior vs interior, what blocks, what you go under/into\n' + notes.layering + '\n\n';
    if (notes.decisions && notes.decisions.length) md += '### Decisions & rulings\n' + notes.decisions.map(s => '- ' + s).join('\n') + '\n\n';
  }
  md += '### Tile legend — every code: material to skin + layer/occupancy/interior\n';
  md += '_layer: ground=flat floor · structure=has a ¾ front face, blocks · overhead=drawn above, pass under · prop=object on the ground · portal=go through into an interior._\n\n';
  md += '| code | color | tile / name | kind | ACT-1 material (tile this) | layer | solid | enter (interior) | in cell |\n';
  md += '|---|---|---|---|---|---|---|---|---|\n';
  for (const c of codes) {
    const L = legend[c], col = c === 0 ? 'dead-dirt (kit ground)' : (palette[c] || '—'), ly = K.tileLayer(L);
    md += '| ' + c + ' | `' + col + '` | ' + L.name + ' | ' + L.kind + ' | ' + L.act1 +
          ' | ' + ly.layer + ' | ' + (ly.solid ? 'yes' : 'no') + ' | ' + (ly.enter || '—') +
          ' | ' + (present[c] ? present[c] : '—') + ' |\n';
  }
  // CITE THE GATE THAT EXISTS, NOT THE ONE THE NAME IMPLIES. This line assumed every
  // district has a gates/<name>_gate.js, which was true while every district was hand-built
  // and stopped being true the moment a FACTORY registered twelve of them at once. canon_rot
  // caught the dead citations (town, water) the first run after this file learned to sweep
  // the registry. A citation is a claim a machine can check -- so only make the ones that hold.
  const own = 'gates/' + d.name + '_gate.js';
  const hasOwn = fs.existsSync(path.join(ROOT, own));
  md += '\n**Gate:** ' + (hasOwn ? '`' + own + '` (+ ' : '') +
        'the street-aware/drivable law via `gates/district_kit_gate.js`' + (hasOwn ? ')' : '') +
        ', the walkable-land law via `gates/walkable_gate.js`, and this dossier via ' +
        '`gates/tilespec_gate.js`.\n';
  md += '**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.\n';
  fs.writeFileSync(path.join(OUT, 'BOHEMIA_TILESPEC_' + d.name + '.md'), md);
  index.push({ name: d.name, cat, codes: codes.length, drivable });
  console.log('  wrote tilespec for ' + d.name + ' (' + codes.length + ' codes)');
}

let idx = '# BOHEMIA TILE SPEC — INDEX (the district "note sections" for the tiling phase)\n\n';
idx += '**START HERE when tiling:** read `laws/BOHEMIA_TILING_PHASE_INSTRUCTIONS.md` — the full ';
idx += 'brief (scale, act-1-dead, 45-degree, layering->render/occupancy, interior===exterior, ';
idx += 'order of operations). Then tile each district from its sheet below.\n\n';
idx += 'One sheet per built district: every tile code -> name, kind, ACT-1 dead-world material, ';
idx += 'color. GENERATED from each module\'s LEGEND — run `node tools/bohemia_tilespec.js` after ';
idx += 'a district changes. The tiling phase reads these so every code maps to known art.\n\n';
idx += '| district | category | tile codes | drivable |\n|---|---|---|---|\n';
for (const e of index) idx += '| [' + e.name + '](tilespec/BOHEMIA_TILESPEC_' + e.name + '.md) | ' +
  e.cat + ' | ' + e.codes + ' | ' + (e.drivable ? 'yes' : '—') + ' |\n';
idx += '\nWHEN A DISTRICT IS APPROVED: it exposes a LEGEND (code -> {name, kind, act1}); this ';
idx += 'generator writes its sheet; `gates/tilespec_gate.js` fails if any tile code ships ';
idx += 'undocumented. That is the standing "record everything you built" flow.\n';
fs.writeFileSync(path.join(ROOT, 'records', 'BOHEMIA_TILESPEC_INDEX.md'), idx);
console.log('  wrote INDEX (' + index.length + ' districts)');

/* AND SAY SO IF ANY SHEET WENT OUT WITHOUT A REAL CITATION. Silence here is how
   twenty-one of them drifted in the first place: the tool printed "wrote tilespec
   for reservoir" either way. (9/23, PLUMBER, row [rot ceiling].) */
if (unciteable.length) {
  console.log('\n  ' + '!'.repeat(70));
  console.log('  ' + unciteable.length + ' SHEET(S) HAVE NO CITABLE MODULE, so they say so instead of');
  console.log('  naming a file nobody looked for:');
  unciteable.forEach(u => console.log('     ' + u));
  console.log('  ' + '!'.repeat(70));
} else {
  console.log('  every sheet cites a module that is on disk (' + Object.keys(OWNER).length
    + ' registered types traced)');
}
