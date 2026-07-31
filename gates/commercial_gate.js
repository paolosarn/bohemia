// COMMERCIAL GATE — THE DEAD POWER CENTER (rewritten 7/31/26 for the rebuilt district)
//
// The old district was one flat tan L and a striped parking lot, and Paolo's 7/31 ruling
// ("WE GOTTA BUILD THIS FUCKING WORLD!!! AND MAKE IT LOOK GOOD") sent it back. This gate
// is rewritten to the thing that replaced it and to the standard the approved high school
// set (89%, 7/31): a landmark silhouette, density over pavement, no flat rectangles, real
// hue, and dressed.
//
// TWO THINGS THIS GATE NOW HOLDS THAT THE OLD ONE STRUCTURALLY COULD NOT:
//
// 1. ALL SIX PLACEMENTS. The old gate ran S / N / two corners only, with a standing note
//    that the standalone any-edge form was "[PENDING Paolo]" — because the old generator
//    genuinely could not do it. The rebuild is canonical-south on the district kit and
//    rotates, which is exactly what the kit is for, so E and W are gated now and that
//    PENDING is closed.
//
// 2. IT IS ACTUALLY REGISTERED. The old module never bound K: its registration sat behind
//    `typeof K!=='undefined'`, resolving against a global some other module happened to
//    leak, so whether this district existed at all depended on file load order — and the
//    walked city was drawing commercial from LEGACY PREFAB STAMPS with not one enterable
//    building. This gate asserts the registration directly, so it cannot silently fall out
//    of the world again.
//
//   node gates/commercial_gate.js
const C = require('../engine/bohemia_commercial.js');
const K = require('../engine/bohemia_district_kit.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = r => { const t = {}; for (const row of r.g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };

const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
const purpleFree = pal => {
  for (const c of Object.keys(pal)) {
    const h = pal[c], R = parseInt(h.slice(1, 3), 16) / 255, G = parseInt(h.slice(3, 5), 16) / 255,
          B = parseInt(h.slice(5, 7), 16) / 255, mx = Math.max(R, G, B), mn = Math.min(R, G, B), d = mx - mn;
    if (d > 0.06 && mx > 0.12) {
      let hu = mx === R ? 60 * (((G - B) / d) % 6) : mx === G ? 60 * ((B - R) / d + 2) : 60 * ((R - G) / d + 4);
      if (hu < 0) hu += 360;
      if (hu >= 255 && hu < 320) return false;
    }
  }
  return true;
};

let anatomy = true, hue = true, filled = true, streetOk = true, cornerPed = true, drive = true,
    contentDom = true, roofsAndDoors = true, units = true, service = true;

for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const r = C.generate(s * 17 + 3, { streets: cfg }), t = counts(r), g = r.g, W = g[0].length, H = g.length;

  /* THE PROGRAMME: an anchor + shop units (2) under awnings, a lot (1) with stall ticks
     (11), the service alley (15) with docks (16), the pylon (12), outparcels — the fuel
     canopy (19) with pumps (20) — landscape planting (3), the covered walks (6), the
     shopfront glass (7), and it is DRESSED: cars (17) and carts (18) nobody came back for. */
  if (!(t[2] > 2000 && t[1] > 1500 && (t[11] || 0) > 300 && (t[15] || 0) > 400 &&
        (t[16] || 0) > 60 && (t[12] || 0) > 20 && (t[19] || 0) > 80 && (t[20] || 0) > 4 &&
        (t[6] || 0) > 300 && (t[7] || 0) > 30 && (t[17] || 0) > 30 && (t[18] || 0) > 3 &&
        (t[3] || 0) > 20)) anatomy = false;

  /* THE AWNINGS ARE THE COLOUR, and all THREE must be present. A strip mall is identical
     concrete boxes made different by a row of faded brand colours; one colour is a stripe,
     three is a strip. This is the district's whole answer to the 7/28 hue finding. */
  if (!((t[8] || 0) > 40 && (t[9] || 0) > 40 && (t[10] || 0) > 40)) hue = false;

  /* THE SHOP UNITS ARE SEPARATE MASSES. Drawn as one long rectangle they merge into a
     single box and the strip reads as one blob — which is how the old district read, and
     how the first cut of the rebuild read too, until I looked at the render. */
  if (r.footprints.length < 8) units = false;

  /* NO BUILDING IS A FLAT RECTANGLE (Paolo 7/30): every mass over 100 tiles carries a roof
     ridge AND a doorway. Same claim the school gate holds, same reason. */
  {
    const isBody = v => v === 2 || v === 13 || v === 14 || v === 7;
    const seen = new Set();
    for (let y0 = 0; y0 < H; y0++) for (let x0 = 0; x0 < W; x0++) {
      if (!isBody(g[y0][x0]) || seen.has(x0 + ',' + y0)) continue;
      const st = [[x0, y0]], cells = []; seen.add(x0 + ',' + y0);
      while (st.length) {
        const p = st.pop(); cells.push(p);
        for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = p[0] + d[0], ny = p[1] + d[1], k = nx + ',' + ny;
          if (!seen.has(k) && nx >= 0 && ny >= 0 && nx < W && ny < H && isBody(g[ny][nx])) { seen.add(k); st.push([nx, ny]); }
        }
      }
      if (cells.length <= 100) continue;
      if (!cells.some(p => g[p[1]][p[0]] === 13)) roofsAndDoors = false;
      if (!cells.some(p => g[p[1]][p[0]] === 14)) roofsAndDoors = false;
    }
  }

  const ls = K.landStats(g, C.legend);
  if (!(ls.contentPct >= ls.drivePct)) contentDom = false;
  if (!K.legendOk(g, C.palette) || K.voidFraction(g) > 0.20) filled = false;
  if (!C.driveConnected(r)) drive = false;
  if (!C.hasServiceAccess(r)) service = false;

  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  const gE = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (g[y][x] !== 5) continue;
    const e = edgeOf(x, y);
    if (!e || !cfg.includes(e)) streetOk = false; else gE.add(e);
  }
  if (cfg.length > 1) { for (const e of cfg) if (!gE.has(e)) cornerPed = false; }
}

ok('THE POWER CENTER: a big-box ANCHOR + inline shop units + the lot with its stall ticks ' +
   '+ the service alley with docks + the pylon + outparcel pads (fuel canopy and pumps), ' +
   'and it is DRESSED with the cars and carts nobody came back for', anatomy);
ok('THE AWNINGS ARE THE COLOUR: all THREE faded brand colours present, which is what makes ' +
   'a row of identical concrete boxes read as a strip (the 7/28 hue finding, answered)', hue);
ok('THE SHOP UNITS ARE SEPARATE MASSES, not one long box wearing one outline ' +
   '(8+ distinct building masses)', units);
ok('NO BUILDING IS A FLAT RECTANGLE: every mass over 100 tiles carries a ROOF and a DOOR ' +
   '(Paolo 7/30 — he circled three buildings and asked what they were)', roofsAndDoors);
ok('WALKABLE-LAND: content dominates pavement — the failure that kept this district ' +
   'unregistered (the old form ran 61% drive against 30% content)', contentDom);
ok('every tile named + low void (EXPLAIN-EVERY-TILE)', filled);
ok('DRIVABLE: the lot, the pads, the drive-thru lane and the service alley are ONE network ' +
   'reachable from the kerb, in all six placements', drive);
ok('every business keeps a BACK DOOR onto the service alley (Paolo 7/18)', service);
ok('gates sit only on street edges', streetOk);
ok('CORNER: car entrance on the primary street + a pedestrian gate on each side street', cornerPed);
ok('IT IS REGISTERED WITH THE DISTRICT KIT and filed as commercial — the old module never ' +
   'bound K and the walked city was drawing legacy prefab stamps instead',
   !!K.get('commercial') && K.category('commercial') === 'commercial');
ok('the registered generator IS this module (one canonical body, ENGINE SYNC LAW)',
   K.get('commercial').generate === C.generate);
ok('buildings are ENTERABLE (the legacy stamps had not one)',
   /interior/i.test((C.legend[2] || {}).enter || '') &&
   C.generate(7, { streets: ['S'] }).footprints.length >= 8);
ok('PURPLE RESERVATION: no swatch reads purple', purpleFree(C.palette));
ok('NOTES complete (summary/reference/layout/circulation/layering/decisions)',
   !!(C.notes && C.notes.summary && C.notes.reference.length && C.notes.layout.length &&
      C.notes.circulation && C.notes.layering && C.notes.decisions.length));
{
  let legOk = true;
  for (const c of Object.keys(C.legend)) if (!C.legend[c].name || !C.legend[c].kind) legOk = false;
  ok('LEGEND: every code named + kinded', legOk);
}
ok('the awnings and the fuel canopy are OVERHEAD — you walk and drive UNDER them',
   ['8', '9', '10', '19'].every(c => C.legend[c].layer === 'overhead'));
ok('deterministic per seed',
   JSON.stringify(C.generate(70, { streets: ['S'] }).g) === JSON.stringify(C.generate(70, { streets: ['S'] }).g));

console.log('COMMERCIAL GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
