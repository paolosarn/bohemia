// WORLD MODEL GATE (Paolo 7/18/26) — the spine must resolve at every level and
// never throw. Proves world(seed) addresses valley -> district -> plot ->
// building -> floorplan for every cell, that the chain is deterministic, and
// that every building a plot exposes yields a real (reachable) interior.
const { world, districtTypes } = require('../engine/bohemia_world.js');
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

// INTERIOR === EXTERIOR FOOTPRINT (Paolo 7/19, LOCKED: "if your interior does not match the
// width and length of the exterior every time, you are failing... I am not having it any other
// way"). EVERY enterable building's interior must be EXACTLY the footprint's w x h.
let dimOk = true, dimChecked = 0, dimBad = null;
for (let y = 6; y < 90 && dimChecked < 200; y++) for (let x = 6; x < 90 && dimChecked < 200; x++) {
  const c = w.at(x, y); if (!c) continue; const p = w.plot(x, y);
  if (!p || typeof p.tileInfo !== 'function' || !p.buildings) continue;   // factory plots
  for (const b of p.buildings) {
    if (typeof b.interior !== 'function') continue;
    const it = b.interior(); dimChecked++;
    let iw, ih;
    if (it.kind === 'garage') { iw = it.W; ih = it.H; if (it.decks.some(d => d.length !== b.h || d.some(r => r.length !== b.w))) { dimOk = false; dimBad = 'garage deck grid'; } }
    else if (it.kind === 'crypt') { iw = it.W; ih = it.H; if (it.grid.length !== b.h || it.grid.some(r => r.length !== b.w)) { dimOk = false; dimBad = 'crypt grid'; } }
    else { iw = it.floorplan.W; ih = it.floorplan.H; }
    if (iw !== b.w || ih !== b.h) { dimOk = false; dimBad = b.kind + ' ' + iw + 'x' + ih + ' != footprint ' + b.w + 'x' + b.h; }
  }
}
ok('INTERIOR matches EXTERIOR footprint w x h EXACTLY, every building (' + dimChecked + ' checked)' + (dimBad ? ' — ' + dimBad : ''), dimOk && dimChecked > 0);

// INTERIORS EVERYWHERE (7/26) — the coordinate scan above only ever reached whatever
// district types happened to sit in its window, and it stopped at 200 buildings. That is
// how 343 clamped interiors (storage unit rows, farm strips, trailer singles, a watertreat
// plant) lived in the valley under a green gate. This sweeps EVERY married district type by
// name, one real cell each, ALL of its buildings — so a type can never again be enterable
// only in the sample. Plus: a building that cannot answer interior() is not enterable at
// all, and a floorplan whose door lands on a wall with nothing outside it is an interior
// that contradicts its exterior.
// A rare landmark type (firestation, swapmeet, terminal, cityhall, jail...) does not place
// in EVERY valley, so one seed can never cover the table — sweep several and union them.
const TYPES = districtTypes();
const SEEDS = [12345, 7, 99, 2026];
const covered = new Set();
let typesMissing = [], typeDimBad = [], typeNoInterior = [], typeSwept = 0, entBad = [], noSurface = [];
for (const seed of SEEDS) {
  const ws = seed === 12345 ? w : world(seed);
  for (const t of TYPES) {
    if (covered.has(t)) continue;
    const found = ws.districtsOfType(t);
    let p = null;
    for (const c of found.slice(0, 4)) { const pp = ws.plot(c.x, c.y); if (pp && pp.buildings && pp.buildings.length) { p = pp; break; } }
    if (!p) continue;
    covered.add(t);
    for (const b of p.buildings) {
      typeSwept++;
      if (typeof b.interior !== 'function') { typeNoInterior.push(t); break; }
      const it = b.interior();
      let iw, ih;
      if (it.kind === 'garage' || it.kind === 'crypt') { iw = it.W; ih = it.H; }
      else { iw = it.floorplan.W; ih = it.floorplan.H; }
      if (iw !== b.w || ih !== b.h) { typeDimBad.push(t + ' ' + b.kind + ' ' + b.w + 'x' + b.h + ' -> ' + iw + 'x' + ih); break; }
      // the door is cut into a side the plot can actually deliver you to
      if (it.kind === 'floorplan' && b.entrance && it.floorplan.meta.entrance !== b.entrance) { entBad.push(t); break; }
    }
  }
}
// A district with NO surface buildings at all is legal, but only DELIBERATELY: `wash` is a
// concrete flood channel whose only way in is the SEWER TUNNEL MOUTH down to THE UNDERGROUND
// (the LIFE flood-tunnel level), so it declares footprints:[] on purpose. The gate makes that
// explicit instead of letting a district with silently-zero buildings pass as "covered".
for (const t of TYPES) {
  if (covered.has(t)) continue;
  let sawCell = false, sawFoot = false;
  for (const seed of SEEDS) {
    const ws = seed === 12345 ? w : world(seed);
    const found = ws.districtsOfType(t);
    if (found.length) sawCell = true;
    for (const c of found.slice(0, 4)) { const pp = ws.plot(c.x, c.y); if (pp && pp.buildings && pp.buildings.length) sawFoot = true; }
  }
  if (sawCell && !sawFoot) noSurface.push(t); else typesMissing.push(t);
}
ok('every married district type is covered — enterable buildings, or deliberately none (' +
  covered.size + ' enterable + ' + noSurface.length + ' no-surface [' + (noSurface.join(',') || '-') + '] of ' + TYPES.length + ')' +
  (typesMissing.length ? ' — never placed in any test seed: ' + typesMissing.join(',') : ''), typesMissing.length === 0);
ok('every building of every district type answers interior() (' + typeSwept + ' swept)' +
  (typeNoInterior.length ? ' — ' + typeNoInterior.join(',') : ''), typeNoInterior.length === 0);
ok('INTERIOR === EXTERIOR across EVERY district type, all buildings' +
  (typeDimBad.length ? ' — ' + typeDimBad.slice(0, 3).join(' | ') : ''), typeDimBad.length === 0);
ok('the interior door is cut into the side the exterior actually opens on' +
  (entBad.length ? ' — ' + entBad.join(',') : ''), entBad.length === 0);

// THE BESPOKE / LANDMARK CELLS: casino, resort, strip (Paolo 7/18 — reserved for his own
// hand, no DISTGEN entry) and the recipe-built landmarks (airport, campus, prison, town...).
// They exposed floorplan() but no interior(), so the one uniform question every consumer
// asks threw on them. Enterable is enterable EVERYWHERE or the rung has a hole in it.
let lmCells = 0, lmBuildings = 0, lmNoInterior = 0, lmDimBad = null;
for (let y = 0; y < 96 && lmCells < 25; y++) for (let x = 0; x < 96 && lmCells < 25; x++) {
  const c = w.at(x, y); if (!c) continue;
  const p = w.plot(x, y);
  if (!p || typeof p.tileInfo === 'function' || !p.buildings || !p.buildings.length) continue;  // NON-factory only
  lmCells++;
  for (const b of p.buildings) {
    lmBuildings++;
    if (typeof b.interior !== 'function') { lmNoInterior++; continue; }
    const it = b.interior();
    if (it.floorplan.W !== b.w || it.floorplan.H !== b.h) lmDimBad = c.district + ' ' + b.w + 'x' + b.h;
  }
}
ok('bespoke/landmark cells are enterable too (' + lmCells + ' cells, ' + lmBuildings + ' buildings)', lmCells > 0 && lmBuildings > 0 && lmNoInterior === 0);
ok('bespoke/landmark interiors match their footprint exactly' + (lmDimBad ? ' — ' + lmDimBad : ''), !lmDimBad);

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

// LOCATION QUERY (7/24): findable, cheap (never generates plot content), and
// deterministic. Proves quests/factions/LIFE now have a real "find X" primitive.
const suburbs = w.districtsOfType('suburb');
ok('districtsOfType finds real districts of a common type', suburbs.length > 0);
ok('districtsOfType results are all the requested type', suburbs.every(d => d.district === 'suburb'));
const residential = w.districtsInCategory('residential');
ok('districtsInCategory finds real districts by category', residential.length >= suburbs.length);
const nearest = w.nearestDistrictOfType(48, 48, 'suburb');
ok('nearestDistrictOfType finds a real result', !!nearest && nearest.district === 'suburb');
if (nearest) {
  const dx = nearest.x - 48, dy = nearest.y - 48;
  ok('nearestDistrictOfType.dist matches real straight-line distance', Math.abs(nearest.dist - Math.sqrt(dx * dx + dy * dy)) < 1e-9);
  const closer = suburbs.some(d => { const ddx = d.x - 48, ddy = d.y - 48; return Math.sqrt(ddx * ddx + ddy * ddy) < nearest.dist - 1e-9; });
  ok('nearestDistrictOfType is actually nearest (no closer suburb exists)', !closer);
}
const custom = w.findDistricts(c => c.district === 'courthouse');
ok('findDistricts (custom predicate) runs without throwing', Array.isArray(custom));
const w3 = world(12345);
ok('location query is deterministic (same seed -> same district count)', w.districtsOfType('suburb').length === w3.districtsOfType('suburb').length);

console.log('WORLD MODEL GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
  scanned + ' plots, ' + withBuildings + ' with buildings)');
process.exit(fail ? 1 : 0);
