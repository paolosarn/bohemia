// COMMERCIAL CORNER-PLAZA GATE (Paolo 7/18/26) — the first commercial district.
// A corner shopping plaza must: have store buildings + a parking lot, keep the lot
// CONNECTED to the streets (curb cuts reach the aisles), and be STREET-AWARE like the
// suburb — entrances only on the edges that touch a street, a corner exits two. Built
// under the PLACEMENT PLAYBOOK, so it is gated the same turn it lands.
const C = require('../engine/bohemia_commercial.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

// NOTE (Paolo 7/18): commercial is the CORNER-plaza form by design — "we'd have to completely
// remake it to squeeze between two other districts." So it's gated on the placements it's built
// for (S / corners / N), NOT arbitrary single edges. Its standalone-any-edge form is a PENDING
// design call for Paolo (flagged in the handoff), unlike medical/industrial/solar which now pass
// all six placements under the street-aware/drivable law.
const CONFIGS = [
  { streets: ['S', 'E'] },   // corner
  { streets: ['S', 'W'] },   // corner (other hand)
  { streets: ['S'] },
  { streets: ['N'] },
];

// stores + parking + a lot connected to the street at every config
let allStores = true, allPark = true, allConn = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = C.generate(s * 37 + 5, cfg);
  if (!r.stores.length) allStores = false;
  let park = 0, store = 0;
  for (const row of r.g) for (const c of row) { if (c === 1 || c === 3) park++; else if (c === 2) store++; }
  if (park < 400) allPark = false;
  if (store < 200) allStores = false;
  if (!C.driveConnected(r)) allConn = false;
}
ok('every plaza has store buildings', allStores);
ok('every plaza has a real parking lot', allPark);
ok('the parking lot stays connected to the street (curb cuts reach the aisles)', allConn);

// BACK ENTRANCE LAW (Paolo 7/18): every business can throw out trash — a service door
// onto a rear service alley (the "mini road" at the back corner).
let serviceOk = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) if (!C.hasServiceAccess(C.generate(s * 37 + 5, cfg))) serviceOk = false;
ok('every business has a back service door + rear alley (trash-out)', serviceOk);

// GAS STATION in the street corner (needs two streets); and MORE curb cuts (2 per street)
const cornerG = C.generate(7, { streets: ['S', 'E'] });
ok('a corner plaza has a gas station pad in the corner', !!cornerG.gas);
{
  const perEdge = {};
  for (const t of cornerG.gates) perEdge[t.edge] = (perEdge[t.edge] || 0) + 1;
  ok('commercial gets 2+ curb cuts per street (front + service)', cornerG.streets.every(e => perEdge[e] >= 2));
}

// STREET-AWARE entrances: a curb cut (code 5) only on a street-facing edge; every
// street gets one; a corner exits two.
let gatesOk = true, cornerOk = true;
for (const cfg of CONFIGS) {
  const r = C.generate(99, cfg), g = r.g, W = r.W, H = r.H;
  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (g[y][x] !== 5) continue;
    const e = edgeOf(x, y);
    if (!e || !cfg.streets.includes(e)) gatesOk = false;
  }
  const hit = new Set(r.gates.map(t => t.edge));
  for (const e of cfg.streets) if (!hit.has(e)) gatesOk = false;
}
{
  const corner = C.generate(99, { streets: ['S', 'E'] });
  cornerOk = new Set(corner.gates.map(t => t.edge)).size === 2;
}
ok('curb cuts sit ONLY on street edges, every street gets one', gatesOk);
ok('a corner plaza exits TWO streets', cornerOk);

// store footprints exposed for the world model, reasonably sized
const fps = C.storeFootprints(C.generate(7, { streets: ['S', 'E'] }));
ok('store footprints exposed (>0)', fps.length > 0);
ok('store footprints are building-sized (w,h >= 6 tiles)', fps.every(f => f.w >= 6 && f.h >= 6));

// determinism
ok('deterministic per seed', JSON.stringify(C.generate(99, { streets: ['S', 'E'] }).g) === JSON.stringify(C.generate(99, { streets: ['S', 'E'] }).g));

console.log('COMMERCIAL GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
