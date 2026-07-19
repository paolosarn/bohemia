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
const OUT = path.join(ROOT, 'records', 'tilespec');
fs.mkdirSync(OUT, { recursive: true });

const DISTRICTS = [
  { name: 'suburb',     mod: require('../engine/bohemia_suburb.js') },
  { name: 'commercial', mod: require('../engine/bohemia_commercial.js') },
  { name: 'industrial', mod: require('../engine/bohemia_industrial.js') },
  { name: 'medical',    mod: require('../engine/bohemia_medical.js') },
  { name: 'solar',      mod: require('../engine/bohemia_solar.js') },
  { name: 'park',       mod: require('../engine/bohemia_park.js') },
];

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
  md += 'GENERATED from `engine/bohemia_' + d.name + '.js` (NOTES + LEGEND + PALETTE) — do not hand-edit; ';
  md += 'rerun `node tools/bohemia_tilespec.js`. ACT-1 material is the dead-world look to tile now; ';
  md += 'ACT-2/3 evolution is Paolo\'s call.\n\n';
  // ---- the DOSSIER: what the hell is happening in this district ----
  if (notes) {
    if (notes.summary) md += '**' + notes.summary + '**\n\n';
    if (notes.reference && notes.reference.length) md += '### Real-world reference\n' + notes.reference.map(s => '- ' + s).join('\n') + '\n\n';
    if (notes.layout && notes.layout.length) md += '### Layout — what is where\n' + notes.layout.map(s => '- ' + s).join('\n') + '\n\n';
    if (notes.circulation) md += '### Circulation (street-aware / drivable)\n' + notes.circulation + '\n\n';
    if (notes.decisions && notes.decisions.length) md += '### Decisions & rulings\n' + notes.decisions.map(s => '- ' + s).join('\n') + '\n\n';
  }
  md += '### Tile legend — every code, its material to skin\n';
  md += '| code | color | tile / name | kind | ACT-1 material (tile this) | in cell | ACT-2/3 |\n';
  md += '|---|---|---|---|---|---|---|\n';
  for (const c of codes) {
    const L = legend[c], col = c === 0 ? 'dead-dirt (kit ground)' : (palette[c] || '—');
    md += '| ' + c + ' | `' + col + '` | ' + L.name + ' | ' + L.kind + ' | ' + L.act1 +
          ' | ' + (present[c] ? present[c] + ' tiles' : '—') + ' | [PENDING Paolo] |\n';
  }
  md += '\n**Gate:** `gates/' + d.name + '_gate.js` (+ the street-aware/drivable law via `district_kit_gate.js`).\n';
  md += '**Decisions / rejections:** see `records/BOHEMIA_FAILURE_GRAVEYARD_7_19_26.md` + the handoff.\n';
  fs.writeFileSync(path.join(OUT, 'BOHEMIA_TILESPEC_' + d.name + '.md'), md);
  index.push({ name: d.name, cat, codes: codes.length, drivable });
  console.log('  wrote tilespec for ' + d.name + ' (' + codes.length + ' codes)');
}

let idx = '# BOHEMIA TILE SPEC — INDEX (the district "note sections" for the tiling phase)\n\n';
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
