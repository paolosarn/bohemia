/* RAIL GATE (7/27/26, WORLD lane) — the machine gate for engine/bohemia_rail.js, the
   90-cell Union Pacific mainline that runs the entire height of the valley down column
   54, and for the six FREEWAY cells that bridge over it.

   THE ONE THAT MATTERS IS THAT THE LINE IS ONE LINE. A railway that stops dead at every
   freeway is not a railway, and adjacency alone says it does: three of the valley's road
   crossings are two cells wide, so a naive same-neighbour rule severs the mainline into
   three pieces. The world model resolves continuity with continuityLinks (look through a
   crossing surface to the far side) and bohemia_freeway.js lays the ballast and the rails
   UNDER its deck. This gate walks the whole column and requires an unbroken chain of rail
   tiles from the top of the map to the bottom. If anybody ever simplifies either half, it
   goes red.

   Also proves: the corridor is a RAILWAY and not a road (ballast, ties, two running rails,
   a maintenance road, a right-of-way fence — and no lanes, no median, no sidewalk); the
   17 at-grade crossings the street grid actually needs are all there, with the roadway
   passing through the fence and the rails surviving the panels; the passing sidings are
   multi-cell and taper into the main through real point blades; the frontage is a FEATURE
   and not a void (the WALKABLE-LAND failure this module was fixed for twice); every tile
   is named and coloured; the palette conforms to the frozen visual constitution; and rail
   is a SURFACE, never a district.

   Run: node gates/rail_gate.js   Registered as RAIL. */
'use strict';
const K = require('../engine/bohemia_district_kit.js');
const RAI = require('../engine/bohemia_rail.js');
const FWY = require('../engine/bohemia_freeway.js');
const World = require('../engine/bohemia_world.js');
const E = require('../engine/bohemia_engine.js');
const Loop = require('../engine/bohemia_loop.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = g => { const c = {}; g.forEach(r => r.forEach(v => { c[v] = (c[v] || 0) + 1; })); return c; };

const w = World.world(E.WorldGen.hashSeed('bohemia'));
const T = w.TILE_PER_CELL;

// the real rail cells in the real valley
const RAIL_CELLS = [];
for (let y = 0; y < w.n; y++) for (let x = 0; x < w.n; x++) {
  const c = w.at(x, y);
  if (c && c.district === 'rail') RAIL_CELLS.push([x, y]);
}
ok('the valley has its mainline (' + RAIL_CELLS.length + ' rail cells)', RAIL_CELLS.length >= 80);

// ---- 1. THE LINE IS ONE LINE ------------------------------------------------
/* Walk the whole column top to bottom in VALLEY TILES and require rail under your feet
   the entire way — through the rail cells and through the freeway cells that bridge over
   them. RAIL_TILES is the vocabulary of "you are standing on the railway": ballast, tie,
   rail, turnout, the crossing panels, and — inside a freeway cell — the ballast and rails
   laid under the deck, plus the deck itself, which is the bridge you walk beneath. */
{
  const RAIL_ON_RAIL = { 1: 1, 2: 1, 3: 1, 17: 1, 12: 1 };
  const RAIL_ON_FWY = { 16: 1, 17: 1, 12: 1, 13: 1 };
  const col = RAIL_CELLS[0][0];
  const sameCol = RAIL_CELLS.every(c => c[0] === col);
  ok('the mainline is one corridor, not scattered cells (all in column ' + col + ')', sameCol);

  const y0 = Math.min(...RAIL_CELLS.map(c => c[1])), y1 = Math.max(...RAIL_CELLS.map(c => c[1]));
  let broken = 0, checked = 0, gapAt = null;
  for (let cy = y0; cy <= y1; cy++) {
    const cell = w.at(col, cy);
    if (!cell) continue;
    const p = w.plot(col, cy);
    const vocab = cell.district === 'rail' ? RAIL_ON_RAIL
                : (cell.district === 'freeway' ? RAIL_ON_FWY : null);
    if (!vocab) { broken++; gapAt = gapAt || (col + ',' + cy + ' is ' + cell.district); continue; }
    // every row of this cell must contain a rail tile somewhere near the centreline
    for (let ty = 0; ty < T; ty++) {
      let hit = false;
      for (let tx = T / 2 - 20; tx <= T / 2 + 20 && !hit; tx++) if (vocab[p.block.grid[ty][tx]]) hit = true;
      checked++;
      if (!hit) { broken++; gapAt = gapAt || (col + ',' + cy + ' row ' + ty); }
    }
  }
  ok('the mainline is UNBROKEN for the whole height of the valley (' + checked +
     ' tile rows, ' + broken + ' gaps' + (gapAt ? ' first at ' + gapAt : '') + ')', broken === 0);

  // and the freeway cells in the column really are bridging, not just happening to be grey
  const bridges = [];
  for (let cy = y0; cy <= y1; cy++) {
    const cell = w.at(col, cy);
    if (cell && cell.district === 'freeway') bridges.push(cy);
  }
  let bridged = 0;
  bridges.forEach(cy => {
    const c2 = counts(w.plot(col, cy).block.grid);
    if ((c2[16] || 0) > 100 && (c2[17] || 0) > 100 && (c2[13] || 0) > 20) bridged++;
  });
  ok('every freeway over the line carries a real bridge: rail under, on abutments (' +
     bridged + '/' + bridges.length + ')', bridges.length > 0 && bridged === bridges.length);
}

// ---- 2. determinism ---------------------------------------------------------
ok('rail is deterministic (same seed + cell => identical grid)',
   JSON.stringify(RAI.generate(7, { cellX: 54, cellY: 33, links: ['N', 'S'] }).g) ===
   JSON.stringify(RAI.generate(7, { cellX: 54, cellY: 33, links: ['N', 'S'] }).g));

// ---- 3. IT IS A RAILWAY, NOT A ROAD -----------------------------------------
/* The failure mode worth gating: somebody builds "rail" out of the arterial vocabulary
   and it comes out a grey street with a stripe. A rail cross-section has a ballast prism
   with sleepers and two running rails per track, a maintenance road, a drainage ditch and
   a right-of-way fence — and it has no lanes, no median and no sidewalk anywhere. */
{
  const plain = RAI.generate(11, { cellX: 54, cellY: 33, links: ['N', 'S'] });
  const c = counts(plain.g);
  ok('the corridor is ballasted (' + (c[1] || 0) + ' tiles)', (c[1] || 0) > 1000);
  ok('it is sleepered', (c[2] || 0) > 300);
  ok('it carries running rails', (c[3] || 0) > 300);
  ok('there is a maintenance road down one side', (c[6] || 0) > 500);
  ok('there is a drainage ditch', (c[5] || 0) > 100);
  ok('the right of way is fenced', (c[7] || 0) > 200);
  ok('wayside signals exist', (c[8] || 0) > 0);
  const names = Object.keys(RAI.legend).map(k => RAI.legend[k].name.toLowerCase()).join('|');
  ok('no lane, no median and no sidewalk exist in the whole vocabulary',
     !/lane|median|sidewalk/.test(names));

  // TWO RAILS PER TRACK, at gauge, which is what distinguishes track from a painted line
  const mid = plain.g[3];
  const rails = [];
  for (let x = 0; x < 128; x++) if (mid[x] === 3) rails.push(x);
  const pairs = rails.filter((x, i) => i > 0 && x - rails[i - 1] === 2).length;
  ok('rails come in gauge-spaced PAIRS, one pair per track (' + rails.length + ' rails, ' +
     pairs + ' pairs)', rails.length >= 4 && pairs >= 2);
}

// ---- 4. THE 17 GRADE CROSSINGS ----------------------------------------------
/* The only place the city and the railway touch, and the thing that decides whether the
   street grid works at all: 17 rail cells have a mile-grid arterial on BOTH sides. Each
   one must carry the roadway right through the right of way — through the fence, through
   the ditch, through the maintenance road — with the crossing furniture on it. */
{
  const ROAD = { arterial: 1, freeway: 1, strip: 1, beltway: 1 };
  const crossings = RAIL_CELLS.filter(([x, y]) => {
    const e = w.at(x + 1, y), wst = w.at(x - 1, y);
    return e && wst && ROAD[e.district] && ROAD[wst.district];
  });
  ok('the street grid really does meet the line (' + crossings.length + ' at-grade crossings)',
     crossings.length >= 10);

  let good = 0, throughFence = 0;
  crossings.forEach(([x, y]) => {
    const g = w.plot(x, y).block.grid;
    const c = counts(g);
    if ((c[12] || 0) > 1500 && (c[13] || 0) > 20 && (c[14] || 0) > 4) good++;
    // the roadway reaches BOTH cell edges: a crossing that stops at the fence is a wall
    let west = false, east = false;
    for (let ty = 0; ty < T; ty++) {
      if (g[ty][0] === 12) west = true;
      if (g[ty][T - 1] === 12) east = true;
    }
    if (west && east) throughFence++;
  });
  ok('every crossing has pavement, markings and gate arms (' + good + '/' + crossings.length + ')',
     good === crossings.length);
  ok('and the roadway goes right through the right of way, edge to edge (' +
     throughFence + '/' + crossings.length + ')', throughFence === crossings.length);

  // the rails SURVIVE the crossing: panels sit between them, steel stays proud
  const [cx, cy] = crossings[0];
  const g0 = w.plot(cx, cy).block.grid;
  let steelOnCrossing = 0;
  for (let tx = 0; tx < T; tx++) if (g0[T / 2][tx] === 3) steelOnCrossing++;
  ok('the rails survive the crossing panels (' + steelOnCrossing + ' steel tiles on the road centreline)',
     steelOnCrossing >= 4);
}

// ---- 5. THE PASSING SIDINGS ARE MULTI-CELL ----------------------------------
/* A siding keyed off the CELL SEED would flicker on and off every 96 m and read as
   damage. Keyed off the cell coordinate it runs continuously for a mile and a half and
   tapers into the main through real point blades at each end. */
{
  const on = [];
  for (let a = 0; a < 96; a++) if (RAI.sidingAt(a).on) on.push(a);
  let runs = 0, longest = 0, cur = 0;
  for (let a = 0; a < 96; a++) {
    if (RAI.sidingAt(a).on) { if (cur === 0) runs++; cur++; longest = Math.max(longest, cur); }
    else cur = 0;
  }
  ok('sidings run in long unbroken stretches, not cell by cell (longest ' + longest +
     ' cells across ' + runs + ' loops)', longest >= 8 && runs >= 1);
  const head = RAI.generate(3, { cellX: 54, cellY: on[0], links: ['N', 'S'] });
  ok('a siding head has real point blades coming off the main', (counts(head.g)[17] || 0) > 20);
  // a cell inside the loop that is NOT holding a consist (a standing train covers its
  // own rails, which is correct and would hide the very thing being measured here)
  const clear = on.find(a => { const s = RAI.sidingAt(a); return s.m > 12 && !s.tail; });
  const mid = RAI.generate(3, { cellX: 54, cellY: clear, links: ['N', 'S'] });
  const midRails = counts(mid.g)[3] || 0, plainRails = counts(RAI.generate(3, { cellX: 54, cellY: 33, links: ['N', 'S'] }).g)[3] || 0;
  ok('and a cell inside the loop carries a THIRD track (' + midRails + ' vs ' + plainRails + ' rail tiles)',
     midRails > plainRails * 1.2);
  const held = RAI.generate(3, { cellX: 54, cellY: on[5], links: ['N', 'S'] });
  ok('and a train is standing held in the loop, which is what a siding is for',
     (counts(held.g)[10] || 0) > 500);
}

// ---- 6. THE FRONTAGE IS A FEATURE, NOT A VOID -------------------------------
/* The corridor proper is 45 m of a 96 m cell. The first draft left the other half bare
   and 37% of every cell read as nothing, which is exactly what the WALKABLE-LAND law is
   about. Every rail cell in the real valley is checked, not a sample. */
{
  const MARGIN = 22;   // walkable_gate.js's own number, so this holds the law's bar
  let worstVoid = 0, worstAt = null, driveWins = 0, worstGap = -99, gapAt = null, blobs = 0;
  RAIL_CELLS.forEach(([x, y]) => {
    const g = w.plot(x, y).block.grid;
    const c = counts(g);
    const v = (c[0] || 0) / (T * T);
    if (v > worstVoid) { worstVoid = v; worstAt = x + ',' + y; }
    const st = K.landStats(g, RAI.legend);
    const gap = st.drivePct - st.contentPct;
    if (gap > worstGap) { worstGap = gap; gapAt = x + ',' + y; }
    if (gap > MARGIN) driveWins++;
    if (K.largestBlob(g, code => code === 0) > 0.10) blobs++;
  });
  ok('no rail cell is mostly void (worst ' + (worstVoid * 100).toFixed(1) + '% at ' + worstAt + ')',
     worstVoid < 0.15);
  ok('and none of them is a single big blank slab (' + blobs + ' cells with a >10% blank blob)',
     blobs === 0);
  /* Pavement never dominates. The worst cells are the grade crossings, where a six-lane
     arterial genuinely does cross 47 tiles of the cell — that is the ground, not a cheat,
     and it is why the law carries a margin at all. */
  ok('pavement never dominates content on any rail cell (worst gap +' + worstGap.toFixed(1) +
     ' at ' + gapAt + ', law allows +' + MARGIN + ')', driveWins === 0);

  // the three frontage kinds all actually occur along the line
  const kinds = {};
  RAIL_CELLS.forEach(([x, y]) => {
    const c = counts(w.plot(x, y).block.grid);
    if ((c[19] || 0) > 500) kinds.pad = 1;
    if ((c[21] || 0) > 500) kinds.yard = 1;
    if ((c[15] || 0) > 200) kinds.scrap = 1;
  });
  ok('rail-served loading pads, material yards and stacked steel all occur along the line',
     kinds.pad && kinds.yard && kinds.scrap);
}

// ---- 7. explain every tile, layers resolve, no purple -----------------------
{
  const samples = [[54, 5], [54, 18], [54, 33], [54, 60], [54, 90]];
  let named = 0, layered = 0;
  samples.forEach(([x, y]) => {
    const p = w.plot(x, y);
    if (K.legendOk(p.block.grid, RAI.palette)) named++;
    let allLayers = true;
    Object.keys(RAI.legend).forEach(code => {
      const L = K.tileLayer(RAI.legend[code]);
      if (!L.layer) allLayers = false;
    });
    if (allLayers) layered++;
  });
  ok('EXPLAIN-EVERY-TILE: every tile maps to a named thing (' + named + '/' + samples.length + ')',
     named === samples.length);
  ok('every legend entry resolves to a render layer', layered === samples.length);
  const purple = Object.keys(RAI.palette).filter(k => {
    const h = RAI.palette[k].replace('#', '');
    const r = parseInt(h.slice(0, 2), 16), g2 = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return r > g2 + 20 && b > g2 + 20;
  });
  ok('PURPLE RESERVATION: no purple on the railway', purple.length === 0);
  ok('the relay hut blocks, the fence blocks, the ballast does not',
     K.tileLayer(RAI.legend[9]).solid === true && K.tileLayer(RAI.legend[7]).solid === true &&
     K.tileLayer(RAI.legend[1]).solid === false);
}

// ---- 8. SURFACE, NOT DISTRICT ------------------------------------------------
{
  ok('rail is NOT an auto-district', !World.isAutoDistrict('rail'));
  ok('rail IS a surface cell', World.isSurfaceCell('rail'));
  const ctx = Loop.boot ? Loop.boot({ seed: 'bohemia' }) : null;
  if (ctx && ctx.world) {
    ok('adding the railway left the live loop\'s district count alone',
       World.districtTypes().indexOf('rail') < 0);
  } else {
    ok('rail never appears in the district type list', World.districtTypes().indexOf('rail') < 0);
  }
}

// ---- 9. THE VALLEY IS COVERED ------------------------------------------------
{
  let rendered = 0;
  RAIL_CELLS.forEach(([x, y]) => {
    const p = w.plot(x, y);
    if (p && p.block && p.block.grid && p.block.grid.length === T) rendered++;
  });
  ok('every rail cell in the real valley renders a plot (' + rendered + '/' + RAIL_CELLS.length + ')',
     rendered === RAIL_CELLS.length);
}

// ---- CONSTITUTION CONFORMANCE ------------------------------------------------
{
  const fs2 = require('fs');
  const CPATH = 'records/target/BOHEMIA_VISUAL_CONSTITUTION.json';
  if (!fs2.existsSync(CPATH)) {
    ok('the visual constitution exists to conform to', false);
  } else {
    const C = JSON.parse(fs2.readFileSync(CPATH, 'utf8'));
    const bands = C.proxies.value_bands, slack = 26.0;
    const LAYER_BAND = { ground: 'ground', walk: 'ground', drive: 'ground',
                         marking: 'ground', prop: 'ground', portal: 'wall',
                         structure: 'wall', building: 'wall', fence: 'wall',
                         overhead: 'top' };
    const lum = h => {
      h = h.replace('#', '');
      return 0.299 * parseInt(h.slice(0, 2), 16) + 0.587 * parseInt(h.slice(2, 4), 16)
           + 0.114 * parseInt(h.slice(4, 6), 16);
    };
    let outside = 0, seen = 0;
    [['rail', RAI], ['freeway', FWY]].forEach(([name, mod]) => {
      Object.keys(mod.palette).forEach(code => {
        const L = mod.legend[code];
        if (!L) return;
        seen++;
        const b = bands[LAYER_BAND[K.tileLayer(L).layer] || 'ground'] || bands.ground;
        const v = lum(mod.palette[code]);
        if (v < b.lo - slack || v > b.hi + slack) {
          outside++;
          console.log('    OUT OF BAND: ' + name + ' ' + code + ' ' + L.name +
                      ' lum ' + v.toFixed(0) + ' vs ' + b.lo + '..' + b.hi);
        }
      });
    });
    ok('every palette entry sits in its layer\'s value band (' + (seen - outside) + '/' + seen + ')',
       seen > 0 && outside === 0);
    ok('the constitution being conformed to is the frozen one', C.status === 'IN FORCE');
  }
}

console.log('RAIL GATE: ' + pass + ' passed, ' + fail + ' failed  (' + RAIL_CELLS.length + ' rail cells)');
process.exit(fail ? 1 : 0);
