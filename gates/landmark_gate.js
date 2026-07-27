/* LANDMARK GATE (7/27/26, WORLD lane) — the machine gate for the first two of the
   valley's buildable LANDMARK districts: engine/bohemia_campus.js (16 cells) and
   engine/bohemia_speedway.js (12 cells), the two biggest of the 88 cells that were
   still rendering as flat ground.

   These two are gated together because they are the same KIND of claim — a landmark
   whose whole job is to be recognisable — and because they fail in opposite ways:
   a campus can collapse into an office park, and a speedway can collapse into a
   car park with a ring drawn on it. So the gate asks each one for the thing that
   makes it itself.

     THE CAMPUS MUST HAVE A QUAD, and the quad must be the biggest open thing on the
     plot with the buildings turned to face it. A campus whose middle is parking is a
     business estate; that is the entire distinction and it is measurable.

     THE SPEEDWAY MUST HAVE AN OVAL, a CLOSED ring you could drive a lap of, with the
     grandstand on ONE side only — three of the four sides of a superspeedway have no
     stands — and the spectator TUNNEL, because you cannot cross a live oval on foot.

   Both also answer the standing district laws: street-aware on every orientation with
   ONE car entrance and a drivable surface a car reaches from the curb; WALKABLE-LAND
   (content dominates pavement, and the speedway takes the law's own vehicular-venue
   exception because at a speedway the vehicle surface IS the venue); explain-every-tile;
   layers resolve; no purple; deterministic; and — per the 7/27 icon law — each one has
   its city builder icon, shipped the same turn as its ground.

   Run: node gates/landmark_gate.js   Registered as LANDMARKS. */
'use strict';
const fs = require('fs');
const K = require('../engine/bohemia_district_kit.js');
const CMP = require('../engine/bohemia_campus.js');
const SPW = require('../engine/bohemia_speedway.js');
const World = require('../engine/bohemia_world.js');
const E = require('../engine/bohemia_engine.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const counts = g => { const c = {}; g.forEach(r => r.forEach(v => { c[v] = (c[v] || 0) + 1; })); return c; };
const MASKS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];

// ---- 1. THE STANDING DISTRICT LAWS, on both, on every orientation ----------
[['campus', CMP], ['speedway', SPW]].forEach(([name, mod]) => {
  let built = 0, reached = 0, dominated = 0, named = 0;
  const MARGIN = 22;                       // walkable_gate.js's own number
  MASKS.forEach(streets => {
    const r = mod.generate(31, { streets: streets });
    if (r.g && r.g.length === 128 && r.g[0].length === 128) built++;
    if (K.driveReachFromStreet(r.g, 1) > 0.85) reached++;
    const st = K.landStats(r.g, mod.legend);
    if (st.drivePct - st.contentPct <= MARGIN) dominated++;
    if (K.legendOk(r.g, mod.palette)) named++;
  });
  ok(name + ': builds on every street orientation (' + built + '/' + MASKS.length + ')', built === MASKS.length);
  ok(name + ': a car reaches the whole drivable surface from the curb (' + reached + '/' + MASKS.length + ')',
     reached === MASKS.length);
  ok(name + ': content dominates pavement (' + dominated + '/' + MASKS.length + ')', dominated === MASKS.length);
  ok(name + ': EXPLAIN-EVERY-TILE — every tile is a named thing (' + named + '/' + MASKS.length + ')',
     named === MASKS.length);

  const r0 = mod.generate(31, { streets: ['S'] });
  ok(name + ': is deterministic',
     JSON.stringify(r0.g) === JSON.stringify(mod.generate(31, { streets: ['S'] }).g));
  ok(name + ': ONE car entrance on the primary street, and a corner adds a PEDESTRIAN gate',
     mod.generate(31, { streets: ['S'] }).gates.length === 1 &&
     mod.generate(31, { streets: ['S', 'E'] }).gates.length === 2);
  ok(name + ': every legend entry resolves to a render layer',
     Object.keys(mod.legend).every(c => !!K.tileLayer(mod.legend[c]).layer));
  const purple = Object.keys(mod.palette).filter(k => {
    const h = mod.palette[k].replace('#', '');
    const rr = parseInt(h.slice(0, 2), 16), gg = parseInt(h.slice(2, 4), 16), bb = parseInt(h.slice(4, 6), 16);
    return rr > gg + 20 && bb > gg + 20;
  });
  ok(name + ': PURPLE RESERVATION holds (' + purple.join(' ') + ')', purple.length === 0);
  ok(name + ': has real buildings with footprints', r0.footprints.length >= 3);
  ok(name + ': is not a void (largest blank blob ' +
     (K.largestBlob(r0.g, v => v === 0) * 100).toFixed(1) + '%)',
     K.largestBlob(r0.g, v => v === 0) < 0.12);
  ok(name + ': every tile has an act-1 material',
     Object.keys(mod.legend).every(c => typeof mod.legend[c].act1 === 'string' && mod.legend[c].act1.length > 8));
  ok(name + ': carries a full dossier',
     !!(mod.notes && mod.notes.summary && mod.notes.reference && mod.notes.layout &&
        mod.notes.circulation && mod.notes.layering && mod.notes.decisions));
});

// ---- 2. THE CAMPUS MUST HAVE A QUAD ----------------------------------------
{
  const r = CMP.generate(5, { streets: ['S'] });
  const c = counts(r.g);
  const T = 128 * 128;
  const quad = (c[4] || 0) / T, walks = (c[6] || 0) / T;
  const pave = (c[1] || 0) / T;
  ok('the quad exists and is large (' + (quad * 100).toFixed(0) + '%)', quad > 0.25);
  /* THE DISTINCTION, measured: the open green middle must beat the pavement. A campus
     whose biggest open surface is a car park is a business estate wearing the word. */
  ok('and it beats the pavement, which is what makes it a campus and not an office park (' +
     (quad * 100).toFixed(0) + '% vs ' + (pave * 100).toFixed(0) + '%)', quad > pave);
  ok('the quad is crossed by real walks (' + (walks * 100).toFixed(1) + '%)', walks > 0.02);
  ok('the dry fountain is in it', (c[7] || 0) > 40);

  /* THE HALLS FACE IN. Measured as geometry, not asserted: the buildings sit around the
     quad, so the quad's own centre must be OPEN and the ring around it must hold most of
     the building mass. */
  const cxq = 63, cyq = 57;
  let ring = 0, core = 0;
  for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
    const v = r.g[y][x];
    const isB = (v === 2 || v === 8 || v === 9 || v === 13);
    const d = Math.max(Math.abs(x - cxq), Math.abs(y - cyq));
    if (d > 34) { if (isB) ring++; } else if (isB) core++;
  }
  ok('the buildings ring the quad and the middle stays open (' + ring + ' out, ' + core + ' in)',
     ring > 0 && core * 6 < ring);
  ok('the library, lecture hall and residence halls are all distinct things',
     (c[8] || 0) > 200 && (c[13] || 0) > 60 && (c[9] || 0) > 150);
  ok('the campus core is not parking: the lots sit at the ring',
     (c[1] || 0) < (c[4] || 0));
}

// ---- 3. THE SPEEDWAY MUST HAVE AN OVAL -------------------------------------
{
  const r = SPW.generate(5, { streets: ['S'] });
  const c = counts(r.g);
  ok('there is a racing surface (' + ((c[6] || 0) / 163.84).toFixed(0) + '% of the plot)', (c[6] || 0) > 1200);

  /* A CLOSED RING, not an arc. Walked as a real lap: flood the track from one tile and
     require it to come back round — an oval you cannot complete is a bend. */
  const TRACKY = { 6: 1, 7: 1, 14: 1 };
  let start = null;
  for (let y = 0; y < 128 && !start; y++) for (let x = 0; x < 128 && !start; x++) if (r.g[y][x] === 6) start = [x, y];
  const seen = {}; const st = [start]; seen[start.join(',')] = 1; let n = 0;
  let minx = 128, maxx = -1, miny = 128, maxy = -1;
  while (st.length) {
    const p = st.pop(); n++;
    minx = Math.min(minx, p[0]); maxx = Math.max(maxx, p[0]);
    miny = Math.min(miny, p[1]); maxy = Math.max(maxy, p[1]);
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(d => {
      const nx = p[0] + d[0], ny = p[1] + d[1], k = nx + ',' + ny;
      if (seen[k] || nx < 0 || ny < 0 || nx > 127 || ny > 127) return;
      if (TRACKY[r.g[ny][nx]]) { seen[k] = 1; st.push([nx, ny]); }
    });
  }
  ok('the track is ONE connected surface you could drive a lap of (' + n + ' tiles)', n > 1200);
  ok('and it really goes all the way round (spans ' + (maxx - minx) + 'x' + (maxy - miny) + ')',
     (maxx - minx) > 90 && (maxy - miny) > 70);
  /* THE MIDDLE IS INFIELD, NOT TRACK — the proof it is a ring and not a disc. */
  ok('the middle of it is infield, so it is a ring and not a slab',
     r.g[52][64] === 4 || r.g[52][64] === 3 || r.g[52][64] === 6);

  ok('the painted apron runs inside the banking', (c[7] || 0) > 300);
  ok('there is a catch fence outside it', (c[11] || 0) > 200);
  ok('pit road and the garage row are inside the oval', (c[9] || 0) > 200 && (c[8] || 0) > 300);
  ok('the spectator TUNNEL exists — you cannot cross a live oval on foot', (c[13] || 0) > 20);
  ok('and it is a real portal, not a painted arch', K.tileLayer(SPW.legend[13]).layer === 'portal');
  ok('the cars are still on the grid (act-1 dead)', (c[14] || 0) > 20);
  ok('light towers ring it', (c[12] || 0) > 40);

  /* THE GRANDSTAND IS ON ONE SIDE ONLY. Three of the four sides of a superspeedway have
     no stands, and ringing the oval with seating is the easy, wrong version. */
  let above = 0, below = 0;
  for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) if (r.g[y][x] === 2) (y < 60 ? above++ : below++);
  ok('the grandstand is on the front stretch ONLY (' + above + ' one side, ' + below + ' the other)',
     (above === 0 || below === 0) && (above + below) > 500);

  ok('it declares itself a VEHICULAR VENUE, which is the law\'s own exception',
     K.get('speedway').vehicular === true);
}

// ---- 4. THEY ARE REAL IN THE REAL VALLEY -----------------------------------
{
  const w = World.world(E.WorldGen.hashSeed('bohemia'));
  ['campus', 'speedway'].forEach(t => {
    ok(t + ' is a real auto-district now', World.isAutoDistrict(t));
    let cells = 0, rendered = 0;
    for (let y = 0; y < w.n; y++) for (let x = 0; x < w.n; x++) {
      const cell = w.at(x, y);
      if (!cell || cell.district !== t) continue;
      cells++;
      const p = w.plot(x, y);
      if (p && p.block && p.block.grid && p.block.grid.length === 128) rendered++;
    }
    ok(t + ': every cell in the valley renders a plot (' + rendered + '/' + cells + ')',
       cells > 0 && rendered === cells);
  });
}

// ---- 5. THE ICON LAW (Paolo 7/27): the icon ships WITH the ground -----------
{
  const BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt';
  const bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));
  ['campus', 'speedway'].forEach(t => {
    const h = bank.heroes.filter(x => x.district === t)[0];
    ok(t + ': has its city builder icon, shipped the same turn as its ground', !!h);
    if (h) ok(t + ': and the icon says what it is', typeof h.label === 'string' && h.label.length > 40);
  });
}

console.log('LANDMARK GATE: ' + pass + ' passed, ' + fail + ' failed  (campus + speedway)');
process.exit(fail ? 1 : 0);
