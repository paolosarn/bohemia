#!/usr/bin/env node
/* THE VALLEY CENSUS (8/5/26, WORLD lane).
 *
 * REUSE CHECK: cooks no graphic pixels. It draws nothing, bakes nothing and opens
 * no bank -- it only ASKS the shipped world model what is standing on each of the
 * 9,216 cells of the valley. Diagnosis, not production.
 *
 * WHY IT EXISTS. Paolo, 8/4: "know what comes after." Every answer to that so far
 * has been a guess off a backlog file somebody wrote weeks ago. This measures the
 * actual world instead: for every district type in the valley it reports how many
 * cells it owns, whether a plot of it has any building on it at all, and whether
 * that building yields a real interior.
 *
 * THE TRAP THE FIRST VERSION FELL IN, and it is the house bug again -- A VALUE
 * PASSED BY HAND WHERE A VALUE COULD BE DERIVED. Version one sampled every third
 * cell of the map, which is a stride over GEOGRAPHY. Twenty-one district types are
 * smaller than the stride, so they were sampled ZERO times and printed a dash --
 * and a dash reads exactly like "nothing to see here". The sample has to be drawn
 * per TYPE, from the type's own cell list, or the rare types are invisible in the
 * census that exists to find them.
 *
 *   node tools/bohemia_valley_census.js [seed]
 */
const { world } = require('../engine/bohemia_world.js');

const SEED = process.argv[2] ? (parseInt(process.argv[2], 10) >>> 0) : 12345;
const CAP = 8;                    // plots per type, spread evenly across its cells

function census(seed, cap) {
  const w = world(seed >>> 0), n = w.n;
  const cellsOf = {};
  let total = 0;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const c = w.at(x, y);
    if (!c) continue;
    total++;
    const t = c.district || '(null)';
    (cellsOf[t] || (cellsOf[t] = [])).push([x, y]);
  }

  const rows = [];
  let sampled = 0, threw = 0;
  for (const t of Object.keys(cellsOf)) {
    const list = cellsOf[t];
    const step = Math.max(1, Math.floor(list.length / (cap || CAP)));
    const r = { type: t, cells: list.length, plots: 0, flat: 0, buildings: 0,
                threw: 0, interiors: 0, noInterior: 0 };
    for (let i = 0; i < list.length && r.plots + r.threw < (cap || CAP); i += step) {
      const [x, y] = list[i];
      sampled++;
      try {
        const p = w.plot(x, y);
        if (!p) { r.threw++; threw++; continue; }
        r.plots++;
        const nb = (p.buildings && p.buildings.length) || 0;
        r.buildings += nb;
        if (!nb) { r.flat++; continue; }
        try {
          const fp = p.building(0).floorplan();
          if (fp && fp.rooms && fp.rooms.length) r.interiors++; else r.noInterior++;
        } catch (e) { r.noInterior++; }
      } catch (e) { r.threw++; threw++; }
    }
    rows.push(r);
  }
  rows.sort((a, b) => b.cells - a.cells);
  return { seed: seed >>> 0, cells: total, sampled: sampled, threw: threw, rows: rows };
}

// a type is FLAT when every plot of it that generated has nothing standing on it
function flatTypes(c) { return c.rows.filter(r => r.plots > 0 && r.flat === r.plots); }

module.exports = { census: census, flatTypes: flatTypes, CAP: CAP };

if (require.main === module) {
  const c = census(SEED, CAP);
  console.log('VALLEY ' + c.seed + ': ' + c.cells + ' cells, ' + c.sampled +
              ' plots sampled, ' + c.threw + ' threw');
  console.log('');
  console.log('type              cells  %valley  plots  flat  bldg/plot  interiors  noInt');
  for (const r of c.rows) {
    const pct = (100 * r.cells / c.cells).toFixed(1);
    const bp = r.plots ? (r.buildings / r.plots).toFixed(1) : '-';
    console.log(r.type.padEnd(16) + String(r.cells).padStart(6) + pct.padStart(8) + '%' +
      String(r.plots).padStart(7) + String(r.flat).padStart(6) + String(bp).padStart(11) +
      String(r.interiors).padStart(11) + String(r.noInterior).padStart(7));
  }
  const flat = flatTypes(c);
  const flatCells = flat.reduce((s, r) => s + r.cells, 0);
  console.log('');
  console.log('FLAT (no building on any sampled plot): ' + flat.length + ' types, ' +
              flatCells + ' cells, ' + (100 * flatCells / c.cells).toFixed(1) + '% of the valley');
  console.log('  ' + flat.map(r => r.type + '(' + r.cells + ')').join(' '));
  const ni = c.rows.filter(r => r.noInterior > 0);
  console.log('BUILDING WITH NO INTERIOR: ' + ni.length + ' types' +
              (ni.length ? '  ' + ni.map(r => r.type).join(' ') : ''));
}
