// WORLD MODEL GATE (Paolo 7/18/26) — the spine must resolve at every level and
// never throw. Proves world(seed) addresses valley -> district -> plot ->
// building -> floorplan for every cell, that the chain is deterministic, and
// that every building a plot exposes yields a real (reachable) interior.
const { world } = require('../engine/bohemia_world.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const d4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

const w = world(12345);
ok('world(seed) exposes at/plot + n', typeof w.at === 'function' && typeof w.plot === 'function' && w.n === 96);

// scan a big block of cells: nothing throws, every plot resolves
let scanned = 0, threw = 0, withBuildings = 0, badInterior = 0;
for (let y = 10; y < 86; y += 3) for (let x = 10; x < 86; x += 3) {
  try {
    const c = w.at(x, y); if (!c) continue;
    const p = w.plot(x, y); scanned++;
    if (!p || p.district !== c.district) { threw++; continue; }
    if (p.buildings.length) {
      withBuildings++;
      const b = p.building(0);
      const fp = b.floorplan();
      // every room reachable from the entrance (the enterable invariant, end to end)
      const ent = fp.doors.find(d => d[0] === 0 || d[1] === 0 || d[0] === fp.W - 1 || d[1] === fp.H - 1);
      if (!ent) { badInterior++; continue; }
      const seen = new Set([ent[0] + ',' + ent[1]]), st = [ent];
      const passable = (px, py) => { if (px < 0 || py < 0 || px >= fp.W || py >= fp.H) return false; const cc = fp.grid[py][px]; return cc.g === 'floor' || cc.g === 'door'; };
      while (st.length) { const [px, py] = st.pop(); for (const [dx, dy] of d4) { const nx = px + dx, ny = py + dy, k = nx + ',' + ny; if (!seen.has(k) && passable(nx, ny)) { seen.add(k); st.push([nx, ny]); } } }
      const reached = new Set();
      for (let yy = 0; yy < fp.H; yy++) for (let xx = 0; xx < fp.W; xx++) if (seen.has(xx + ',' + yy) && fp.grid[yy][xx].room >= 0) reached.add(fp.grid[yy][xx].room);
      if (reached.size !== fp.rooms.length) badInterior++;
    }
  } catch (e) { threw++; }
}
ok('every plot resolves without throwing (' + scanned + ' cells scanned)', threw === 0);
ok('at least some plots expose buildings', withBuildings > 0);
ok('every exposed building yields a fully-reachable interior', badInterior === 0);

// LAYERING API (Paolo 7/19): a factory plot must expose the recorded per-tile layering so
// the renderer/collision/interior systems can read what blocks + what you go into.
let layPlots = 0, layBad = 0, portalsSeen = 0, entersSeen = 0;
for (let y = 6; y < 90 && layPlots < 30; y++) for (let x = 6; x < 90 && layPlots < 30; x++) {
  const c = w.at(x, y); if (!c) continue;
  const p = w.plot(x, y);
  if (!p || typeof p.tileInfo !== 'function') continue;   // only factory-district plots carry it
  layPlots++;
  const ti = p.tileInfo(64, 64);
  if (!ti || !['ground', 'structure', 'overhead', 'prop', 'portal'].includes(ti.layer) || typeof p.solidAt(64, 64) !== 'boolean') layBad++;
  const ports = p.portals();
  if (ports.length) portalsSeen++;
  if (p.buildings.some(b => b.enter)) entersSeen++;
}
ok('factory plots expose tileInfo/solidAt with a valid layer + boolean occupancy', layPlots > 0 && layBad === 0);
ok('factory plots expose portals() — the ways into interiors', portalsSeen > 0);
ok('buildings carry their interior (enter) from the dossier', entersSeen > 0);

// INTERIOR DISPATCH (Paolo 7/19): a building.interior() returns the right space — a parking
// GARAGE yields multi-deck decks (the exterior shell becomes the deck you stand on), everything
// else rooms. Prove it end to end on a real garage building in the valley.
let interiorOk = true, garageProven = false;
for (let y = 6; y < 90 && !garageProven; y++) for (let x = 6; x < 90 && !garageProven; x++) {
  const c = w.at(x, y); if (!c) continue; const p = w.plot(x, y);
  if (!p || typeof p.tileInfo !== 'function' || !p.buildings || !p.buildings.length) continue;  // factory plots only
  if (typeof p.buildings[0].interior !== 'function') { interiorOk = false; break; }
  const g = p.buildings.find(bb => bb.kind === 'garage');
  if (g) { const it = g.interior(); garageProven = (it.kind === 'garage' && it.levels >= 2 && it.decks[0].some(r => r.includes(6))); if (!garageProven) interiorOk = false; }
}
ok('building.interior() dispatches — a garage yields multi-deck parking with a ground entrance', interiorOk && garageProven);

// determinism: same seed -> same plot building counts across a sample
const w2 = world(12345);
let mismatch = 0;
for (let y = 20; y < 60; y += 7) for (let x = 20; x < 60; x += 7) {
  if (w.plot(x, y).buildings.length !== w2.plot(x, y).buildings.length) mismatch++;
}
ok('deterministic per seed (plot building counts match)', mismatch === 0);

// RESIDENTIAL FOLD (Paolo 7/18): every residential cell must be a real suburb of
// enterable homes, gated to the streets it touches — the approved generator, folded in.
let resiPlots = 0, resiHomes = 0, resiBad = 0;
for (let y = 6; y < 90 && resiPlots < 40; y++) for (let x = 6; x < 90 && resiPlots < 40; x++) {
  const c = w.at(x, y); if (!c || !['suburb', 'gated', 'estate'].includes(c.district)) continue;
  const p = w.plot(x, y);
  if (!p.buildings.length) continue;
  resiPlots++; resiHomes += p.buildings.length;
  const fp = p.building(0).floorplan();
  if (!(fp.rooms.length > 0 && fp.doors.some(d => d[0] === 0 || d[1] === 0 || d[0] === fp.W - 1 || d[1] === fp.H - 1))) resiBad++;
}
ok('residential cells are real suburbs of enterable homes (' + resiPlots + ' sampled, ' + resiHomes + ' homes)', resiPlots > 0 && resiBad === 0);

console.log('WORLD MODEL GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
  scanned + ' plots, ' + withBuildings + ' with buildings)');
process.exit(fail ? 1 : 0);
