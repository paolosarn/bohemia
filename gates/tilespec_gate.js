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
];

for (const d of DISTRICTS) {
  const L = d.mod.legend, P = d.mod.palette || {}, NT = d.mod.notes;
  ok(d.name + ': exposes a LEGEND + PALETTE', !!L && !!d.mod.palette);
  // the DOSSIER (Paolo 7/19: "record all the notes of what the hell is happening"): every
  // district carries a NOTES block — summary + real-world reference + layout + circulation +
  // decisions — so its full build story is recorded, not just the tile legend.
  ok(d.name + ': carries a full NOTES dossier (summary/reference/layout/circulation/decisions)',
    !!NT && !!NT.summary && Array.isArray(NT.reference) && NT.reference.length > 0 &&
    Array.isArray(NT.layout) && NT.layout.length > 0 && !!NT.circulation &&
    Array.isArray(NT.decisions) && NT.decisions.length > 0);
  if (!L) continue;
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

console.log('TILESPEC GATE: ' + pass + ' passed, ' + fail + ' failed  (' + DISTRICTS.length + ' districts)');
process.exit(fail ? 1 : 0);
