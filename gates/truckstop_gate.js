// TRUCK STOP / GAS STATION GATE (7/20/26). A dead highway fuel stop — an overhead FUEL CANOPY on
// columns over dry rusted PUMP ISLANDS, a boarded STORE/diner, a dead WASH bay, long pull-through
// big-rig PARKING, a blank price PYLON, on a cracked drivable FORECOURT. Built on the DISTRICT KIT:
// street-aware (canonical-south + rotateToStreet) + DRIVABLE (the whole forecourt is the car surface,
// reachable from the curb in EVERY placement), full dossier + layering (the canopy exercises the
// OVERHEAD pass-under layer). Research-first (real gas-station + truck-stop site plans, not memory).
const D = require('../engine/bohemia_truckstop.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];

let anatomy = true, filled = true, streetOk = true, cornerPed = true, driveConnected = true, noPurple = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = D.generate(s * 29 + 5, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;
  // ANATOMY: forecourt(1) dominant + store(2) + a BOLD filled canopy roof(4) + pumps(6) + wash(7) +
  // pylon(8) + pole lights(9) + abandoned vehicles(10) + stalls(11) + rubble(3) + concrete pad(12) +
  // landscaping planters(13). The canopy + pad are enforced substantial (the "looks like shit" fix).
  if (!(t[1] > 7000 && t[2] > 400 && (t[4] || 0) > 600 && (t[6] || 0) > 40 && (t[7] || 0) > 150 &&
        (t[8] || 0) > 15 && (t[9] || 0) >= 5 && (t[10] || 0) > 30 && (t[11] || 0) > 100 && (t[3] || 0) > 40 &&
        (t[12] || 0) > 600 && (t[13] || 0) > 60)) anatomy = false;
  if (!K.legendOk(r.g, D.palette) || K.voidFraction(r.g) > 0.22) filled = false;

  // DRIVABLE: a car reaches the forecourt from the curb, any placement
  if (!D.driveConnected(r)) driveConnected = false;

  // gates on street edges; corner gets car entrance on primary + a pedestrian gate on the side
  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  const gateEdges = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.includes(e)) streetOk = false; else gateEdges.add(e); }
  if (cfg.length > 1) { for (const e of cfg) if (!gateEdges.has(e)) cornerPed = false; }
}
// PURPLE RESERVATION: no palette swatch may read purple (Amalgamation only).
for (const c of Object.keys(D.palette)) {
  const hex = D.palette[c]; const R = parseInt(hex.slice(1, 3), 16) / 255, G = parseInt(hex.slice(3, 5), 16) / 255, B = parseInt(hex.slice(5, 7), 16) / 255;
  const mx = Math.max(R, G, B), mn = Math.min(R, G, B), d = mx - mn;
  if (d > 0.06 && mx > 0.12) { let h = 0;
    if (mx === R) h = 60 * (((G - B) / d) % 6); else if (mx === G) h = 60 * ((B - R) / d + 2); else h = 60 * ((R - G) / d + 4);
    if (h < 0) h += 360; if (h >= 255 && h < 320) noPurple = false; }
}
ok('forecourt + store + bold canopy roof + pumps + wash + pylon + lights + vehicles + stalls + concrete pad + planters', anatomy);
ok('every tile named + low void (EXPLAIN-EVERY-TILE)', filled);
ok('DRIVABLE: a car reaches the forecourt from the curb in every placement', driveConnected);
ok('gates sit only on street edges', streetOk);
ok('CORNER: car entrance on the primary street + a pedestrian gate on each side street', cornerPed);
ok('PURPLE RESERVATION: no swatch reads purple (Amalgamation only)', noPurple);

ok('truckstop registered + filed as commercial', !!K.get('truckstop') && K.category('truckstop') === 'commercial');
ok('store + wash-bay footprints exposed + enterable', D.generate(7, { streets: ['S'] }).footprints.length >= 2);

const N = D.notes, L = D.legend;
ok('NOTES: summary + reference + layout + circulation + layering + decisions', !!(N && N.summary && N.reference && N.reference.length && N.layout && N.layout.length && N.circulation && N.layering && N.decisions && N.decisions.length));
let legLayered = true;
for (const c of Object.keys(L)) { const e = L[c]; if (!e.name || !e.kind) legLayered = false; }
ok('LEGEND: every code named + kinded (layer/solid/enter resolvable)', legLayered);
// the CANOPY exercises the OVERHEAD pass-under layer; store/wash enterable, forecourt drives, pump solid
const canopyLayer = K.tileLayer(L[4]);
ok('canopy(4) resolves to OVERHEAD + pass-under (not solid)', L[4].kind === 'overhead' && canopyLayer.layer === 'overhead' && canopyLayer.solid === false);
ok('store(2)+wash(7) enterable interiors, forecourt(1) drive, pump(6) solid prop', /interior/i.test(L[2].enter || '') && /interior/i.test(L[7].enter || '') && L[1].kind === 'drive' && K.tileLayer(L[6]).solid === true);

ok('deterministic per seed', JSON.stringify(D.generate(70, { streets: ['S'] }).g) === JSON.stringify(D.generate(70, { streets: ['S'] }).g));

console.log('TRUCK STOP GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
