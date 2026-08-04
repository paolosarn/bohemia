// TRANSIT TERMINAL GATE (7/23/26; REWRITTEN 8/2/26 for the rebuilt district).
//
// It used to guard a generic intercity coach station: a rectangular hall, a schedule-board CLOCK
// TOWER, a flat canopy, and 26% of the plot painted dead green LAWN — the same greenwash Paolo
// caught in downtown, in a valley that has not watered anything in a decade.
//
// Rewritten to the one this valley has: the BONNEVILLE TRANSIT CENTER (2010, downtown Las Vegas),
// LEED Platinum. Its numbers ARE the assertions, and that is the point:
//   16 on-site vehicle BAYS, sawtooth, so a coach pulls straight out instead of reversing.
//   7 on-street LOADING POINTS at the kerb.
//   ~100 double-stacked BIKE RACKS.
// A number taken from the real building is a fact the machine can hold. A number invented on the
// day is decoration — and the 8/2 library post-mortem is what happens when a gate asserts a count
// nobody ever ruled and then forces every future session to keep it.
const D = require('../engine/bohemia_terminal.js');
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };
const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
const MARGIN = 22; // matches the WALKABLE-LAND gate: a terminal is paved-heavy but the fleet+building anchor it
const purpleFree = pal => { for (const c of Object.keys(pal)) { const h = pal[c], R = parseInt(h.slice(1,3),16)/255, G = parseInt(h.slice(3,5),16)/255, B = parseInt(h.slice(5,7),16)/255, mx = Math.max(R,G,B), mn = Math.min(R,G,B), d = mx-mn; if (d>0.06&&mx>0.12){ let hu = mx===R?60*(((G-B)/d)%6):mx===G?60*((B-R)/d+2):60*((R-G)/d+4); if(hu<0)hu+=360; if(hu>=255&&hu<320) return false; } } return true; };

let anatomy = true, filled = true, streetOk = true, cornerPed = true, driveConnected = true, walkable = true, oneNetwork = true,
    bays16 = true, kerb7 = true, racks100 = true, oneBuilding = true, noGreen = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = D.generate(s * 37 + 5, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;
  /* THE PROGRAMME: the curved head house (2) with its glazing (11), roof joints (21), roof
     edge (14) and rooftop plant (8); the boarding platform (13) under the solar shade (6) in
     its frames (9); the bay boxes (20) with bay posts (10); the buses left in them (15); the
     bike racks (12); the apron (1) with its lane lines (22); the park-and-ride ticks (17) and
     the cars nobody came back for (18); the kerb loading marks (19); the hardpan (4). */
  if (!(t[2] > 1500 && (t[11] || 0) > 200 && (t[21] || 0) > 200 && (t[14] || 0) > 100 &&
        (t[8] || 0) > 100 && (t[13] || 0) > 900 && (t[6] || 0) > 150 &&
        (t[20] || 0) > 900 && (t[10] || 0) >= 16 && (t[15] || 0) > 300 && (t[12] || 0) >= 40 &&
        (t[1] || 0) > 3000 && (t[22] || 0) > 60 && (t[17] || 0) > 250 &&   /* ticks, minus whatever the dead cars are parked on top of */ (t[18] || 0) > 20 &&
        (t[19] || 0) > 100 && (t[4] || 0) > 500)) anatomy = false;
  /* THE REAL BUILDING'S OWN COUNTS. Exactly, every placement, every seed. */
  if (r.bays !== D.BAYS) bays16 = false;
  if (r.kerbPoints !== D.KERB_POINTS) kerb7 = false;
  if (r.bikeRacks !== D.BIKE_RACKS) racks100 = false;
  if (r.footprints.length !== 1) oneBuilding = false;
  /* DEAD THINGS ARE NOT GREEN: read the NAME, then read the swatch. */
  for (const code of Object.keys(D.legend)) {
    const e = D.legend[code]; if (K.tileLayer(e).layer !== 'ground') continue;
    if (/tree|plant|shrub/i.test(e.name)) continue;
    const h = D.palette[code]; if (!h) continue;
    const R = parseInt(h.slice(1,3),16), G2 = parseInt(h.slice(3,5),16), B = parseInt(h.slice(5,7),16);
    if (G2 > R + 6 && G2 > B + 6) noGreen = false;
  }
  const ls = K.landStats(g, D.legend);
  if (!(ls.drivePct <= ls.contentPct + MARGIN)) walkable = false;
  if (K.driveNetworkReach(g, D.legend) < 0.999) oneNetwork = false;  // one connected surface a coach can turn in
  if (!K.legendOk(r.g, D.palette) || K.voidFraction(r.g) > 0.20) filled = false;
  if (!D.driveConnected(r)) driveConnected = false;
  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  const gE = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (g[y][x] !== 5) continue; const e = edgeOf(x, y); if (!e || !cfg.includes(e)) streetOk = false; else gE.add(e); }
  if (cfg.length > 1) { for (const e of cfg) if (!gE.has(e)) cornerPed = false; }
}
ok('THE PROGRAMME: the curved head house under its glazing and roof joints, the boarding ' +
   'platform under the photovoltaic shade, the bay boxes with their posts and the buses still ' +
   'in them, the bike racks, the apron with lane lines, and the park-and-ride', anatomy);
ok('EXACTLY 16 BAYS — Bonneville\'s own count, in every placement and at every seed', bays16);
ok('EXACTLY 7 ON-STREET LOADING POINTS at the kerb, beyond the 16 on site', kerb7);
ok('EXACTLY 100 DOUBLE-STACKED BIKE RACKS', racks100);
ok('ONE BUILDING (8/2, ARTICULATION IS NOT FRAGMENTATION): the curved concourse is merged ' +
   'into the bar, one footprint, never two sheds on a lot', oneBuilding);
ok('NOTHING IS GREEN: no ground swatch reads as living plant. The old 26% lawn here was the ' +
   'same greenwash Paolo caught in downtown', noGreen);
ok('THE CLOCK TOWER IS DEAD: no legend entry names a clock, because a schedule-board clock ' +
   'tower is an intercity coach station and this is a transit centre',
   !Object.keys(D.legend).some(c => /clock/i.test(D.legend[c].name)));
ok('NOTHING ON THIS PLOT IS OVERHEAD (Paolo 8/2: "no more canopies"). The photovoltaics moved ' +
   'ONTO THE HEAD HOUSE ROOF, which keeps the building\'s real signature and leaves nothing ' +
   'for a person to stand under. Every painted thing is still MARKING, so nothing painted ' +
   'severs a bus route either (RULE NUMBER ONE, 7/31)',
   Object.keys(D.legend).every(c => K.tileLayer(D.legend[c]).layer !== 'overhead') &&
   D.legend[20].kind === 'marking' && D.legend[17].kind === 'marking' &&
   D.legend[19].kind === 'marking' && D.legend[22].kind === 'marking');
ok('VEHICULAR VENUE declared: at a transit centre the vehicle surface IS the venue, so the ' +
   'WALKABLE-LAND pavement cap is lifted — and the exemption is not a licence for a bare apron',
   K.get('terminal').vehicular === true);
ok('WALKABLE-LAND: drive does not dominate content by more than the +22 margin (fleet+building anchor the paved surface)', walkable);
ok('ONE connected car surface: bays, layover, loop, and lot all reach the curb (driveReachFromStreet)', oneNetwork);
ok('every tile named + low void (EXPLAIN-EVERY-TILE)', filled);
ok('DRIVABLE: the drive network reaches the curb in every placement', driveConnected);
ok('gates sit only on street edges', streetOk);
ok('CORNER: car entrance on the primary street + a pedestrian gate on each side street', cornerPed);
ok('PURPLE RESERVATION: no swatch reads purple', purpleFree(D.palette));
ok('terminal registered + filed as infrastructure', !!K.get('terminal') && K.category('terminal') === 'infrastructure');
ok('terminal-building footprint exposed + enterable', D.generate(5, { streets: ['S'] }).footprints.length >= 1);
const N = D.notes, L = D.legend;
ok('NOTES complete (summary/reference/layout/circulation/layering/decisions)', !!(N && N.summary && N.reference.length && N.layout.length && N.circulation && N.layering && N.decisions.length));
let legOk = true; for (const c of Object.keys(L)) if (!L[c].name || !L[c].kind) legOk = false;
ok('LEGEND: every code named + kinded', legOk);
ok('terminal(2) enterable, drive(1) drive, rooftop array(6) structure, bus(15) a vehicle',
   /interior/i.test(D.legend[2].enter || '') && D.legend[1].kind === 'drive' &&
   D.legend[6].kind === 'structure' && D.legend[15].kind === 'vehicle');
ok('distinct from railyard: PASSENGER vocabulary (platform/bay/terminal), not freight', /platform/i.test(JSON.stringify(L)) && /terminal/i.test(JSON.stringify(L)));
ok('deterministic per seed', JSON.stringify(D.generate(70, { streets: ['S'] }).g) === JSON.stringify(D.generate(70, { streets: ['S'] }).g));
console.log('TERMINAL GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
