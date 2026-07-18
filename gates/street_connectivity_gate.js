// STREET CONNECTIVITY GATE (Paolo 7/18/26: NO-STREET-BREAK LAW)
// The surface-street grid must run continuous — no street dead-ends into an
// empty buildable lot. A street may legitimately END at anything real: the
// map edge, water, mountain, wash, the freeway, OR any claimed big-architecture
// landmark (the Strip, casinos, estates, malls, solar, gated communities,
// airport, ...). The ONLY illegitimate end is dead-ending into OPEN desert or
// suburb lots with nothing there — that is the "broken off" street Paolo saw.
const O = require('../engine/bohemia_overmap.js');
let pass = 0, fail = 0;
function ok(n, c) { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); }

const m = O.buildOvermap(12345);
const N = m.n;
const ROAD = new Set(['arterial', 'freeway', 'strip', 'beltway', 'interchange', 'downtown', 'town']);
// BIG = the ONLY architecture allowed to break the grid (Paolo 7/18/26): real
// physical masses + huge installations + the blessed Strip/casino megablocks.
// EVERYTHING else is city fabric a street must not dead-end into. This mirrors
// the BIG set in engine/bohemia_overmap.js exactly.
const BIG = new Set(['mountain', 'water', 'freeway', 'interchange', 'beltway', 'dam', 'rail', 'railyard',
  'wash', 'basin', 'gypsum', 'quarry', 'intake', 'solar', 'airport', 'airbase', 'speedway', 'prison',
  'datafort', 'arsenal', 'landfill', 'boneyard', 'waterpark', 'minigp', 'stadium', 'ballpark', 'convention',
  'springs', 'strip', 'resort', 'casino', 'luxor', 'sphere', 'highroller', 'strat', 'sign', 'town', 'truckstop']);
const d4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

let breaks = 0, sample = [];
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
  if (m.at(x, y).district !== 'arterial') continue;
  if (x % 9 === 0 || y % 9 === 0) continue;   // mile spine is grade-separated, ends at BIG masses only
  let roadN = 0, bigN = 0, edge = false;
  for (const [dx, dy] of d4) {
    const c = m.at(x + dx, y + dy);
    if (!c) { edge = true; continue; }
    if (ROAD.has(c.district)) roadN++;
    else if (BIG.has(c.district)) bigN++;         // the only legit terminator
  }
  // a break: a street nub with <=1 road neighbor, no BIG mass beside it, not the
  // map edge -> it just stops in fabric (desert/suburb/a soft landmark). A
  // monument must sit in its plot, not break the street.
  if (roadN <= 1 && bigN === 0 && !edge) {
    breaks++;
    if (sample.length < 10) sample.push(x + ',' + y);
  }
}
ok('no surface street dead-ends into fabric — monuments sit in plots (NO-STREET-BREAK LAW)', breaks === 0);
if (breaks) console.log('  street breaks: ' + breaks + ' e.g. ' + sample.join(' '));

// GLOBAL CONNECTIVITY: the whole road network must be ONE connected component.
// Flood-fill from a mile-arterial cell across all ROAD cells; every road cell
// must be reachable. Any island = "streets not connected to each other".
const isRoad = (x, y) => { const c = m.at(x, y); return c && ROAD.has(c.district); };
let total = 0, start = null;
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (isRoad(x, y)) {
  total++; if (!start && x % 9 === 0 && y % 9 === 0) start = [x, y];
}
let reached = 0;
if (start) {
  const seen = new Uint8Array(N * N), st = [start];
  seen[start[1] * N + start[0]] = 1;
  while (st.length) {
    const [x, y] = st.pop(); reached++;
    for (const [dx, dy] of d4) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= N || ny >= N) continue;
      const k = ny * N + nx;
      if (!seen[k] && isRoad(nx, ny)) { seen[k] = 1; st.push([nx, ny]); }
    }
  }
}
const islands = total - reached;
ok('the road network is ONE connected grid (no islands)', islands === 0);
if (islands) console.log('  disconnected road cells: ' + islands + ' of ' + total);

// sanity: the mile grid is still dense and continuous (the spine survived)
let arts = 0;
for (const t of m.tiles) if (t.district === 'arterial') arts++;
ok('mile grid intact (>= 2000 arterial cells)', arts >= 2000);

console.log('STREET CONNECTIVITY GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
  breaks + ' breaks, ' + arts + ' arterials)');
process.exit(fail ? 1 : 0);
