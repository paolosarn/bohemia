/* INTERCHANGE GATE (7/27/26, WORLD lane) — the machine gate for
   engine/bohemia_interchange.js: the 16-cell block at x50-53, y19-22 where the valley's
   two interstates cross, built as ONE object across all sixteen cells.

   THE ONE THAT MATTERS IS THAT THERE IS NO PER-CELL STATE, and here it is not inferred
   from how the seams happen to look — it is proved. The module exposes solve(), the whole
   junction as one pure function of valley position; the gate solves the block ONCE and
   requires every tile of every cell's rendered grid to equal what that solution says
   belongs at that valley coordinate. A 300 m directional flyover cannot be drawn 96 m at
   a time, and the moment somebody keys anything on the cell instead of the block, this
   goes red. It caught exactly that on its first run: the infield noise was keyed on the
   cell seed, so all sixteen cells were quietly solving different ground.

   Also proves: the ramps EXIST (the first version put its radii on the axis spacing
   instead of the corridor envelope and all eight rendered as 0.9% of the block, which is
   the defect this file is the answer to); the mainlines run through edge to edge on both
   axes; the east-west road really is carried OVER on a deck on piers, so the two-level
   truth is in the data; the approaches come from the MAP and not from a symmetry
   assumption; the infield is dressed and not a void; there is no dither; the palette
   conforms to the frozen visual constitution; and interchange is a SURFACE, never a
   district.

   Run: node gates/interchange_gate.js   Registered as INTERCHANGE. */
'use strict';
const K = require('../engine/bohemia_district_kit.js');
const ICH = require('../engine/bohemia_interchange.js');
const World = require('../engine/bohemia_world.js');
const E = require('../engine/bohemia_engine.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = g => { const c = {}; g.forEach(r => r.forEach(v => { c[v] = (c[v] || 0) + 1; })); return c; };

const w = World.world(E.WorldGen.hashSeed('bohemia'));
const T = w.TILE_PER_CELL;

const CELLS = [];
for (let y = 0; y < w.n; y++) for (let x = 0; x < w.n; x++) {
  const c = w.at(x, y);
  if (c && c.district === 'interchange') CELLS.push([x, y]);
}
ok('the valley has its stack (' + CELLS.length + ' interchange cells)', CELLS.length >= 4);

const X0 = Math.min(...CELLS.map(c => c[0])), X1 = Math.max(...CELLS.map(c => c[0]));
const Y0 = Math.min(...CELLS.map(c => c[1])), Y1 = Math.max(...CELLS.map(c => c[1]));
const BOUNDS = { x0: X0, x1: X1, y0: Y0, y1: Y1, cells: CELLS.length };
ok('and it is one solid block, not scattered cells (' + (X1 - X0 + 1) + 'x' + (Y1 - Y0 + 1) + ')',
   CELLS.length === (X1 - X0 + 1) * (Y1 - Y0 + 1));

const GRID = {};
CELLS.forEach(([x, y]) => { GRID[x + ',' + y] = w.plot(x, y).block.grid; });
const blockCounts = (() => {
  const c = {};
  CELLS.forEach(([x, y]) => GRID[x + ',' + y].forEach(r => r.forEach(v => { c[v] = (c[v] || 0) + 1; })));
  return c;
})();
const BLOCK_TILES = CELLS.length * T * T;
const pct = code => 100 * (blockCounts[code] || 0) / BLOCK_TILES;

// ---- 1. NO PER-CELL STATE, PROVED RATHER THAN INFERRED ----------------------
/* Every tile is a pure function of its valley position. That is a claim the gate can
   check outright instead of guessing at it from how the seams happen to look: solve()
   the whole block ONCE, then require every tile of every cell's rendered grid to equal
   what the block-wide solution says belongs at that valley coordinate. A single mismatch
   means per-cell state crept in — the exact change that would break a 300 m flyover into
   sixteen stubs. It caught a real one the first time it ran: the field noise was keyed on
   the CELL seed, so all sixteen cells were solving different infields. */
{
  const approach = { ns: [], ew: [] };
  const HIWAY = { freeway: 1, beltway: 1 };
  for (let x = X0; x <= X1; x++) {
    const n = w.at(x, Y0 - 1), s = w.at(x, Y1 + 1);
    if ((n && HIWAY[n.district]) || (s && HIWAY[s.district])) approach.ns.push(x);
  }
  for (let y = Y0; y <= Y1; y++) {
    const e = w.at(X1 + 1, y), wst = w.at(X0 - 1, y);
    if ((e && HIWAY[e.district]) || (wst && HIWAY[wst.district])) approach.ew.push(y);
  }
  const S = ICH.solve(0, { bounds: BOUNDS, approach: approach });
  let mism = 0, first = null;
  CELLS.forEach(([x, y]) => {
    const g = GRID[x + ',' + y];
    for (let ty = 0; ty < T; ty++) for (let tx = 0; tx < T; tx++) {
      if (g[ty][tx] === S.at(x * T + tx, y * T + ty)) continue;
      mism++;
      first = first || (x + ',' + y + ' tile ' + tx + ',' + ty);
    }
  });
  ok('every rendered tile equals the ONE block-wide solution at its valley position (' +
     mism + ' mismatches' + (first ? ', first at ' + first : '') + ')', mism === 0);

  // the field is keyed on the BLOCK, so a cell's own seed cannot change what it draws
  ok('a cell\'s own seed does not change the ground it draws',
     JSON.stringify(ICH.generate(11, { cellX: X0, cellY: Y0, bounds: BOUNDS, approach: approach }).g) ===
     JSON.stringify(ICH.generate(9999, { cellX: X0, cellY: Y0, bounds: BOUNDS, approach: approach }).g));
  ok('but a DIFFERENT block gets a different field',
     ICH.fieldSeed(BOUNDS) !== ICH.fieldSeed({ x0: X0 + 7, x1: X1 + 7, y0: Y0, y1: Y1 }));

  // and the seams therefore hold: a road tile never dies at a property line
  /* A roadway never dies at a property line. Checked with a three-row tolerance because a
     ramp arc crossing the seam at a shallow angle legitimately leaves one cell on row ty
     and enters the next on ty+1 — that is a curve, not a break. A severed corridor has no
     road tile anywhere near the matching row and still fails. */
  // debris (15) is deliberately NOT in this set: in the infield it doubles as riprap and
  // gravel stockpile, so counting it as roadway asks a gravel heap to continue as a road
  const ROADY = { 1: 1, 2: 1, 3: 1, 10: 1, 11: 1, 12: 1, 16: 1, 17: 1, 18: 1 };
  let seamRows = 0, seamOk = 0;
  for (let y = Y0; y <= Y1; y++) for (let x = X0; x < X1; x++) {
    const a = GRID[x + ',' + y], b = GRID[(x + 1) + ',' + y];
    for (let ty = 0; ty < T; ty++) {
      if (!ROADY[a[ty][T - 1]]) continue;
      seamRows++;
      for (let k = -3; k <= 3; k++) {
        const r = ty + k;
        if (r >= 0 && r < T && ROADY[b[r][0]]) { seamOk++; break; }
      }
    }
  }
  ok('a roadway never dies at an internal cell boundary (' + seamOk + '/' + seamRows + ')',
     seamRows > 300 && seamOk === seamRows);
}

// ---- 2. determinism ---------------------------------------------------------
ok('interchange is deterministic (same seed + cell + bounds => identical grid)',
   JSON.stringify(ICH.generate(5, { cellX: X0, cellY: Y0, bounds: BOUNDS }).g) ===
   JSON.stringify(ICH.generate(5, { cellX: X0, cellY: Y0, bounds: BOUNDS }).g));

// ---- 3. THE APPROACHES COME FROM THE MAP ------------------------------------
/* An interchange has to put its ramps on the road that is really there. The world model
   walks the block's perimeter and reports which columns and rows the FREEWAY arrives on
   — freeway, not any road, because the mile-grid arterials touch this block on every
   side and counting them made the corridors swallow the whole thing. */
{
  const HIWAY = { freeway: 1, beltway: 1 };
  const wantNS = [], wantEW = [];
  for (let x = X0; x <= X1; x++) {
    const n = w.at(x, Y0 - 1), s = w.at(x, Y1 + 1);
    if ((n && HIWAY[n.district]) || (s && HIWAY[s.district])) wantNS.push(x);
  }
  for (let y = Y0; y <= Y1; y++) {
    const e = w.at(X1 + 1, y), wst = w.at(X0 - 1, y);
    if ((e && HIWAY[e.district]) || (wst && HIWAY[wst.district])) wantEW.push(y);
  }
  ok('the interstate really does arrive on both axes (' + wantNS.length + ' columns, ' +
     wantEW.length + ' rows)', wantNS.length > 0 && wantEW.length > 0);
  ok('and not on every column and row (that is the bug that swallowed the ramps)',
     wantNS.length < (X1 - X0 + 1) || wantEW.length < (Y1 - Y0 + 1));

  const res = ICH.generate(1, { cellX: X0, cellY: Y0, bounds: BOUNDS,
                                approach: { ns: wantNS, ew: wantEW } });
  ok('the module lays its carriageways on exactly those columns',
     JSON.stringify(res.ns) === JSON.stringify(wantNS.map(c => c * T + T / 2)));
  ok('and on exactly those rows',
     JSON.stringify(res.ew) === JSON.stringify(wantEW.map(c => c * T + T / 2)));
  ok('the flyover radius is bigger than the connector radius', res.R2 > res.R1);
  ok('and eight ramps are laid, two per quadrant', res.ramps === 8);
}

// ---- 4. THE RAMPS EXIST -----------------------------------------------------
/* The defect this gate is the answer to. Radii taken off the axis spacing instead of the
   corridor envelope put every ramp INSIDE the mainline it was supposed to leave, and the
   whole eight rendered as under 1% of the block. */
{
  ok('ramp lanes are really on the ground (' + pct(16).toFixed(2) + '% of the block)', pct(16) > 0.8);
  ok('with their own shoulders (' + pct(17).toFixed(2) + '%)', pct(17) > 0.5);

  // the ramps are ARCS, not straight stubs: they appear in every quadrant of the block
  const quad = { NE: 0, NW: 0, SE: 0, SW: 0 };
  const mx = (X0 + X1 + 1) / 2 * T, my = (Y0 + Y1 + 1) / 2 * T;
  CELLS.forEach(([x, y]) => {
    const g = GRID[x + ',' + y];
    for (let ty = 0; ty < T; ty++) for (let tx = 0; tx < T; tx++) {
      if (g[ty][tx] !== 16 && g[ty][tx] !== 17) continue;
      const gx = x * T + tx, gy = y * T + ty;
      quad[(gy < my ? 'N' : 'S') + (gx < mx ? 'W' : 'E')]++;
    }
  });
  ok('there is a ramp in all four quadrants (NE ' + quad.NE + ' NW ' + quad.NW +
     ' SE ' + quad.SE + ' SW ' + quad.SW + ')',
     Object.keys(quad).every(q => quad[q] > 200));
}

// ---- 5. BOTH MAINLINES RUN THROUGH ------------------------------------------
/* A junction you cannot drive through is a wall. Both interstates must reach the block's
   outer edge on all four sides, on real drivable surface. */
{
  const DRIVE = { 1: 1, 2: 1, 3: 1, 10: 1, 11: 1, 12: 1, 15: 1, 16: 1, 17: 1, 18: 1 };
  const edges = { N: 0, S: 0, E: 0, W: 0 };
  for (let x = X0; x <= X1; x++) {
    const gN = GRID[x + ',' + Y0], gS = GRID[x + ',' + Y1];
    for (let tx = 0; tx < T; tx++) {
      if (DRIVE[gN[0][tx]]) edges.N++;
      if (DRIVE[gS[T - 1][tx]]) edges.S++;
    }
  }
  for (let y = Y0; y <= Y1; y++) {
    const gW = GRID[X0 + ',' + y], gE = GRID[X1 + ',' + y];
    for (let ty = 0; ty < T; ty++) {
      if (DRIVE[gW[ty][0]]) edges.W++;
      if (DRIVE[gE[ty][T - 1]]) edges.E++;
    }
  }
  ok('a vehicle reaches all four sides of the block (N ' + edges.N + ' S ' + edges.S +
     ' E ' + edges.E + ' W ' + edges.W + ')',
     Object.keys(edges).every(d => edges[d] >= 40));
}

// ---- 6. IT IS A STACK: THERE IS A LEVEL ABOVE -------------------------------
{
  ok('a real deck exists over the junction (' + pct(12).toFixed(1) + '% of the block)', pct(12) > 4);
  ok('carried on real piers (' + (blockCounts[13] || 0) + ' tiles)', (blockCounts[13] || 0) > 200);
  const deck = K.tileLayer(ICH.legend[12]), pier = K.tileLayer(ICH.legend[13]);
  ok('the deck is an OVERHEAD tile you pass under, not a painted crossing',
     deck.layer === 'overhead' && deck.solid === false);
  ok('and the piers are solid', pier.solid === true);
  ok('the median barrier and the sound wall block',
     K.tileLayer(ICH.legend[4]).solid === true && K.tileLayer(ICH.legend[8]).solid === true);
}

// ---- 7. LINE COLOR: white only, no yellow on a freeway ----------------------
{
  const names = Object.keys(ICH.legend).map(k => ICH.legend[k].name.toLowerCase()).join('|');
  ok('no yellow paint anywhere in the junction (a barrier does that job)', !/yellow/.test(names));
  ok('but there IS lane paint (' + (blockCounts[2] || 0) + ' tiles)', (blockCounts[2] || 0) > 1000);
}

// ---- 8. THE INFIELD IS DRESSED, NOT A VOID ----------------------------------
{
  ok('the infield is not a void (' + pct(0).toFixed(1) + '% undifferentiated dirt)', pct(0) < 15);
  ok('it is graded ground with real brush on it (' + pct(6).toFixed(1) + '% slope, ' +
     pct(7).toFixed(1) + '% brush)', pct(6) > 5 && pct(7) > 5);
  ok('and the structure drains somewhere (' + pct(19).toFixed(1) + '% retention basin)', pct(19) > 1);
  ok('with a way in for the crews (' + pct(20).toFixed(1) + '% maintenance track)', pct(20) > 0.2);

  let worstBlob = 0, worstAt = null, driveWins = 0, worstGap = -99;
  const MARGIN = 22;                 // walkable_gate.js's own number
  CELLS.forEach(([x, y]) => {
    const g = GRID[x + ',' + y];
    const bl = K.largestBlob(g, c => c === 0);
    if (bl > worstBlob) { worstBlob = bl; worstAt = x + ',' + y; }
    const st = K.landStats(g, ICH.legend);
    const gap = st.drivePct - st.contentPct;
    if (gap > worstGap) worstGap = gap;
    if (gap > MARGIN) driveWins++;
  });
  ok('no cell is a single big blank slab (worst blob ' + (worstBlob * 100).toFixed(1) +
     '% at ' + worstAt + ')', worstBlob < 0.10);
  ok('pavement never dominates content (worst gap +' + worstGap.toFixed(1) +
     ', law allows +' + MARGIN + ')', driveWins === 0);
}

// ---- 9. ACT-1 DEAD: the jam starts here -------------------------------------
{
  ok('the traffic is still sitting in it (' + pct(10).toFixed(1) + '% dead cars)', pct(10) > 1);
  ok('including the trucks (' + (blockCounts[11] || 0) + ' tiles)', (blockCounts[11] || 0) > 100);
  ok('and every light is dark (high-mast towers exist: ' + (blockCounts[9] || 0) + ' tiles)',
     (blockCounts[9] || 0) > 0);
  const act1 = Object.keys(ICH.legend).filter(k => !ICH.legend[k].act1);
  ok('every tile has an act-1 material (' + act1.length + ' missing)', act1.length === 0);
}

// ---- 10. NO DITHER, and explain every tile ----------------------------------
/* The constitution bans stipple outright: act 1 does not dither, falloffs are solid. The
   infield's first pass used tight high-octave noise and came out speckled, so this
   measures the alternation energy the constitution measures. */
{
  const C = require('fs').existsSync('records/target/BOHEMIA_VISUAL_CONSTITUTION.json')
    ? JSON.parse(require('fs').readFileSync('records/target/BOHEMIA_VISUAL_CONSTITUTION.json', 'utf8')) : null;
  const g = GRID[X0 + ',' + (Y0 + 1)];
  let alt = 0, tot = 0;
  for (let ty = 1; ty < T - 1; ty++) for (let tx = 1; tx < T - 1; tx++) {
    tot++;
    if (g[ty][tx] !== g[ty][tx - 1] && g[ty][tx] !== g[ty][tx + 1] &&
        g[ty][tx - 1] === g[ty][tx + 1]) alt++;
  }
  const energy = alt / tot;
  ok('no dither: single-tile alternation stays under the constitution\'s ceiling (' +
     energy.toFixed(3) + ')', !C || energy <= C.proxies.dither.max_alt_energy);

  let named = 0;
  CELLS.forEach(([x, y]) => { if (K.legendOk(GRID[x + ',' + y], ICH.palette)) named++; });
  ok('EXPLAIN-EVERY-TILE: every tile maps to a named thing (' + named + '/' + CELLS.length + ')',
     named === CELLS.length);
  const purple = Object.keys(ICH.palette).filter(k => {
    const h = ICH.palette[k].replace('#', '');
    const r = parseInt(h.slice(0, 2), 16), g2 = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return r > g2 + 20 && b > g2 + 20;
  });
  ok('PURPLE RESERVATION: no purple in the junction', purple.length === 0);
}

// ---- 11. SURFACE, NOT DISTRICT ----------------------------------------------
ok('interchange is NOT an auto-district', !World.isAutoDistrict('interchange'));
ok('interchange IS a surface cell', World.isSurfaceCell('interchange'));
ok('and it never appears in the district type list', World.districtTypes().indexOf('interchange') < 0);
{
  let rendered = 0;
  CELLS.forEach(([x, y]) => {
    const p = w.plot(x, y);
    if (p && p.block && p.block.grid && p.block.grid.length === T) rendered++;
  });
  ok('every interchange cell in the real valley renders a plot (' + rendered + '/' + CELLS.length + ')',
     rendered === CELLS.length);
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
    Object.keys(ICH.palette).forEach(code => {
      const L = ICH.legend[code];
      if (!L) return;
      seen++;
      const b = bands[LAYER_BAND[K.tileLayer(L).layer] || 'ground'] || bands.ground;
      const v = lum(ICH.palette[code]);
      if (v < b.lo - slack || v > b.hi + slack) {
        outside++;
        console.log('    OUT OF BAND: ' + code + ' ' + L.name + ' lum ' + v.toFixed(0) +
                    ' vs ' + b.lo + '..' + b.hi);
      }
    });
    ok('every palette entry sits in its layer\'s value band (' + (seen - outside) + '/' + seen + ')',
       seen > 0 && outside === 0);
    ok('the constitution being conformed to is the frozen one', C.status === 'IN FORCE');
  }
}

console.log('INTERCHANGE GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CELLS.length + ' cells)');
process.exit(fail ? 1 : 0);
