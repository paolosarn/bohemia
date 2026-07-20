// TILE SPEC GATE (Paolo 7/19/26) — the machine half of the "record everything you built"
// flow. Every built district must expose a complete LEGEND so the tiling phase never meets an
// undocumented tile: every palette code (and code 0) has a legend entry with a name, a kind,
// and an ACT-1 material; and every code that actually APPEARS in a generated cell is in the
// legend (no orphan codes). A district whose note section drifts from its tiles fails here.
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const DISTRICTS = [
  { name: 'suburb', mod: require('../engine/bohemia_suburb.js') },
  { name: 'commercial', mod: require('../engine/bohemia_commercial.js') },
  { name: 'industrial', mod: require('../engine/bohemia_industrial.js') },
  { name: 'medical', mod: require('../engine/bohemia_medical.js') },
  { name: 'solar', mod: require('../engine/bohemia_solar.js') },
  { name: 'park', mod: require('../engine/bohemia_park.js') },
  { name: 'wash', mod: require('../engine/bohemia_wash.js') },
  { name: 'cemetery',   mod: require('../engine/bohemia_cemetery.js') },
];

for (const d of DISTRICTS) {
  const L = d.mod.legend, P = d.mod.palette || {}, NT = d.mod.notes;
  ok(d.name + ': exposes a LEGEND + PALETTE', !!L && !!d.mod.palette);
  // the DOSSIER (Paolo 7/19: "record all the notes of what the hell is happening"): every
  // district carries a NOTES block — summary + real-world reference + layout + circulation +
  // decisions — so its full build story is recorded, not just the tile legend.
  ok(d.name + ': carries a full NOTES dossier (summary/reference/layout/circulation/layering/decisions)',
    !!NT && !!NT.summary && Array.isArray(NT.reference) && NT.reference.length > 0 &&
    Array.isArray(NT.layout) && NT.layout.length > 0 && !!NT.circulation && !!NT.layering &&
    Array.isArray(NT.decisions) && NT.decisions.length > 0);
  if (!L) continue;
  // LAYERING (Paolo 7/19): every tile resolves to a valid render/occupancy layer + a solid
  // flag, so the ¾ renderer + the interior/zoom system know how to treat it (what has a front
  // face, what you pass under, what you go into). No tile ships with an unknown layer.
  const LAYERS = new Set(['ground', 'structure', 'overhead', 'prop', 'portal']);
  const layerOk = Object.keys(L).every(c => { const t = K.tileLayer(L[c]); return LAYERS.has(t.layer) && typeof t.solid === 'boolean'; });
  ok(d.name + ': every tile resolves to a valid layer + occupancy (layering recorded)', layerOk);
  // anything with an interior (enter) must be a structure or a portal (you enter through a face/door)
  const enterOk = Object.keys(L).every(c => { const t = K.tileLayer(L[c]); return !t.enter || t.layer === 'structure' || t.layer === 'portal'; });
  ok(d.name + ': every enterable tile is a structure or a portal', enterOk);
  // every legend entry is complete (name + kind + act-1 material)
  const complete = Object.keys(L).every(c => L[c] && L[c].name && L[c].kind && L[c].act1);
  ok(d.name + ': every legend entry has name + kind + ACT-1 material', complete);
  // every palette color code is documented in the legend
  const palDoc = Object.keys(P).every(c => L[c]);
  ok(d.name + ': every palette code is documented', palDoc);
  // every code that ACTUALLY appears in a generated cell is documented (no orphan tiles)
  let orphan = null;
  try {
    const r = d.mod.generate(3, { streets: ['S'], cw: 1, ch: 1 });
    for (const row of r.g) for (const c of row) if (!(c in L)) { orphan = c; break; }
  } catch (e) { orphan = 'threw:' + e.message.slice(0, 30); }
  ok(d.name + ': no undocumented tile code appears in a generated cell', orphan === null);
  if (orphan !== null) console.log('        orphan code: ' + orphan);
}

// the tiling-phase INSTRUCTIONS must exist (Paolo 7/19: leave yourself instructions for when
// it's time to place tiles) and the index must point to them.
const fs = require('fs'), path = require('path'), ROOT = path.dirname(__dirname);
const instr = path.join(ROOT, 'laws', 'BOHEMIA_TILING_PHASE_INSTRUCTIONS.md');
const idx = path.join(ROOT, 'records', 'BOHEMIA_TILESPEC_INDEX.md');
ok('tiling-phase instructions exist', fs.existsSync(instr) && fs.readFileSync(instr, 'utf8').length > 800);
ok('the tile-spec index points to the tiling instructions', fs.existsSync(idx) && /BOHEMIA_TILING_PHASE_INSTRUCTIONS/.test(fs.readFileSync(idx, 'utf8')));

console.log('TILESPEC GATE: ' + pass + ' passed, ' + fail + ' failed  (' + DISTRICTS.length + ' districts)');
process.exit(fail ? 1 : 0);
