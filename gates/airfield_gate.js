/* AIRFIELD GATE (7/26/26, WORLD lane) — the last big flat thing in the valley: 40
   airport cells and 54 airbase cells, built by engine/bohemia_airfield.js.

   THE ONE THAT MATTERS IS CONTINUITY ACROSS THE FIELD. A runway is three kilometres
   long and a cell is 96 metres, so an airfield is a BLOB of cells with one runway
   across all of them. The world model hands every cell of a cluster the same bounds
   (clusterBoundsOf) and the runway is laid in valley coordinates against them. If
   anybody ever "simplifies" that to per-cell, this goes red: adjacent cells stop
   agreeing at the seam, and the cross-section stops lining up.

   Also proves: the field USES its land (the first version left half the airbase as
   bare dirt and that is what this caught), a runway and its markings exist, the
   pavements connect, every tile is named and coloured, the palette conforms to the
   frozen visual constitution, and it is a SURFACE and not a district.

   Run: node gates/airfield_gate.js   Registered as AIRFIELD. */
'use strict';
const fs = require('fs');
const K = require('../engine/bohemia_district_kit.js');
const AIR = require('../engine/bohemia_airfield.js');
const World = require('../engine/bohemia_world.js');
const E = require('../engine/bohemia_engine.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = g => { const c = {}; g.forEach(r => r.forEach(v => { c[v] = (c[v] || 0) + 1; })); return c; };

const w = World.world(E.WorldGen.hashSeed('bohemia'));
const T = w.TILE_PER_CELL;

// ---- the real fields in the live valley -------------------------------------
const fields = { airport: [], airbase: [] };
for (let y = 0; y < w.n; y++) for (let x = 0; x < w.n; x++) {
  const c = w.at(x, y);
  if (c && fields[c.district]) fields[c.district].push([x, y]);
}
ok('the valley has both fields (' + fields.airport.length + ' airport, ' +
   fields.airbase.length + ' airbase)', fields.airport.length > 10 && fields.airbase.length > 10);

// ---- 1. the field uses its land ---------------------------------------------
for (const kind of ['airport', 'airbase']) {
  let bare = 0;
  fields[kind].forEach(([x, y]) => {
    const c = counts(w.plot(x, y).block.grid);
    const built = Object.keys(c).reduce((n, k) => n + (k === '0' ? 0 : c[k]), 0);
    if (built < 800) bare++;
  });
  ok(kind + ': no cell is left as bare dirt (' + bare + ' bare)', bare === 0);
}

// ---- 2. CONTINUITY: adjacent cells of a field agree at the seam ---------------
{
  let checked = 0, agreed = 0;
  for (const kind of ['airport', 'airbase']) {
    const set = new Set(fields[kind].map(p => p.join(',')));
    fields[kind].forEach(([x, y]) => {
      if (!set.has((x + 1) + ',' + y) || checked >= 8) return;
      const a = w.plot(x, y).block.grid, b = w.plot(x + 1, y).block.grid;
      let m = 0;
      for (let i = 0; i < 128; i++) if (a[i][127] === b[i][0]) m++;
      checked++;
      if (m / 128 >= 0.90) agreed++;
      else console.log('    seam breaks at ' + x + ',' + y + ' (' + (m / 128).toFixed(2) + ')');
    });
  }
  ok('every sampled seam inside a field lines up (' + agreed + '/' + checked + ')',
     checked > 0 && agreed === checked);
}

// ---- 3. a runway, its markings and its pavements ------------------------------
{
  const big = AIR.generate(7, { cellX: 6, cellY: 7, kind: 'airbase',
                                bounds: { x0: 3, x1: 11, y0: 5, y1: 10, cells: 54 } });
  const c = counts(big.g);
  ok('a big field lays two parallel runways', big.runways === 2 && !big.small);
  ok('the runway is there (' + (c[1] || 0) + ' tiles)', (c[1] || 0) > 2000);
  ok('it is marked', (c[2] || 0) > 50);
  ok('there is a taxiway in the cross-section', (c[4] || 0) > 500);
  /* The amber centreline lives on the taxiway, which may not fall inside any one
     sampled cell (that is the point of a field spanning cells), so this asks the FIELD,
     not the cell. Getting this wrong the first time was the gate's error, not the
     generator's, and the fix is to ask the right question. */
  {
    let amber = 0, taxi = 0;
    fields.airbase.concat(fields.airport).forEach(([x, y]) => {
      const cc = counts(w.plot(x, y).block.grid);
      amber += (cc[5] || 0); taxi += (cc[4] || 0);
    });
    ok('the field carries an amber taxiway centreline (' + amber + ' tiles on ' + taxi + ' of taxiway)',
       amber > 200 && taxi > 5000);
  }
  ok('the runway fraction is sane (' + AIR.runwayFraction(big).toFixed(2) + ')',
     AIR.runwayFraction(big) > 0.1 && AIR.runwayFraction(big) < 0.75);
  const small = AIR.generate(7, { cellX: 0, cellY: 0, kind: 'airport',
                                  bounds: { x0: 0, x1: 1, y0: 0, y1: 1, cells: 4 } });
  ok('a small field becomes a one-runway strip instead of a broken big one',
     small.small && small.runways === 1);
}

// ---- 4. determinism, naming, layers ------------------------------------------
{
  const o = { cellX: 6, cellY: 7, kind: 'airbase', bounds: { x0: 3, x1: 11, y0: 5, y1: 10, cells: 54 } };
  ok('deterministic', JSON.stringify(AIR.generate(3, o).g) === JSON.stringify(AIR.generate(3, o).g));
  const c = counts(AIR.generate(3, o).g);
  ok('every tile is named', Object.keys(c).filter(k => k !== '0' && !AIR.legend[k]).length === 0);
  ok('every tile has a colour', Object.keys(c).filter(k => k !== '0' && !AIR.palette[k]).length === 0);
  ok('the jet bridge is overhead', K.tileLayer(AIR.legend[10]).layer === 'overhead');
  ok('the terminal and the fence block',
     K.tileLayer(AIR.legend[8]).solid === true && K.tileLayer(AIR.legend[13]).solid === true);
  ok('the runway does not', K.tileLayer(AIR.legend[1]).solid === false);
}

// ---- 5. surface, not district -------------------------------------------------
ok('an airfield is not an auto-district',
   !World.isAutoDistrict('airport') && !World.isAutoDistrict('airbase'));
ok('an airfield is a surface cell',
   World.isSurfaceCell('airport') && World.isSurfaceCell('airbase'));

// ---- 6. CONSTITUTION CONFORMANCE ---------------------------------------------
{
  const CPATH = 'records/target/BOHEMIA_VISUAL_CONSTITUTION.json';
  if (!fs.existsSync(CPATH)) ok('the visual constitution exists to conform to', false);
  else {
    const C = JSON.parse(fs.readFileSync(CPATH, 'utf8'));
    const bands = C.proxies.value_bands, slack = 26.0;
    const LB = { ground: 'ground', walk: 'ground', drive: 'ground', marking: 'ground',
                 prop: 'ground', portal: 'wall', structure: 'wall', building: 'wall',
                 fence: 'wall', vehicle: 'ground', overhead: 'top' };
    const lum = h => { h = h.replace('#', '');
      return 0.299 * parseInt(h.slice(0, 2), 16) + 0.587 * parseInt(h.slice(2, 4), 16)
           + 0.114 * parseInt(h.slice(4, 6), 16); };
    let out = 0, seen = 0;
    Object.keys(AIR.palette).forEach(code => {
      const L = AIR.legend[code]; if (!L) return;
      seen++;
      const b = bands[LB[K.tileLayer(L).layer] || 'ground'] || bands.ground;
      const v = lum(AIR.palette[code]);
      if (v < b.lo - slack || v > b.hi + slack) {
        out++; console.log('    OUT OF BAND: ' + code + ' ' + L.name + ' lum ' + v.toFixed(0));
      }
    });
    ok('every palette entry sits in its layer band (' + (seen - out) + '/' + seen + ')', out === 0);
  }
}

console.log('AIRFIELD GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
