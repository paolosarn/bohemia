// SUBURB MODULARITY + FOOTPRINT GATE (Paolo 7/18/26)
// The canonical block must be MODULAR at both levels:
//  - HOUSES vary (not clones): multiple widths + both one- and two-story present.
//  - NEIGHBORHOOD is street-aware: gates ONLY on the edges that face a street; a
//    corner exits two streets; adjacent cells MERGE into a connected 2x1/2x2 union
//    with gates scaled per street edge. Plus the standing laws: 3-tile backyards to
//    the wall + between homes, dead world (no vegetation), every home enterable.
const S = require('../engine/bohemia_suburb.js');
const FP = require('../engine/bohemia_floorplan.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

// configs Paolo named: 1x1 on one street, a corner (two streets), merged 2x1 (two
// gates on the main street), merged 2x2 (two streets).
const CONFIGS = [
  { cw: 1, ch: 1, streets: ['S'] },
  { cw: 1, ch: 1, streets: ['S', 'E'] },   // corner
  { cw: 2, ch: 1, streets: ['S'] },
  { cw: 1, ch: 2, streets: ['W'] },
  { cw: 2, ch: 2, streets: ['S', 'E'] },
];

const isBody = v => v === 2 || v === 9;
const isH = v => v === 2 || v === 3 || v === 6 || v === 9;

// ---- connectivity + real homes + garage/driveway at every config ----
let allConn = true, allHomes = true, allGarage = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 3; s++) {
  const res = S.generate(s * 41 + 3, cfg);
  if (!S.roadConnected(res)) allConn = false;
  if (res.houses < cfg.cw * cfg.ch * 10) allHomes = false;
  let gar = 0, drv = 0, hs = 0;
  for (const row of res.g) for (const c of row) { if (c === 6) gar++; else if (c === 3) drv++; else if (isBody(c)) hs++; }
  if (!gar || !drv || !hs) allGarage = false;
}
ok('connected network at 1x1 / corner / 2x1 / 1x2 / 2x2 (MODULARITY LAW)', allConn);
ok('a real number of homes at every size', allHomes);
ok('every config has garages + driveways', allGarage);

// ---- STREET-AWARE GATES: gates only on street edges; a corner exits two; a 2-wide
// street gets 2 gates. Each gate cell (5) must lie on an edge listed in streets. ----
let gatesOk = true, cornerOk = true, mergeGates = true;
for (const cfg of CONFIGS) {
  const res = S.generate(99, cfg), g = res.g, W = res.W, H = res.H;
  const edgeOf = (x, y) => (y === 0 ? 'N' : y === H - 1 ? 'S' : x === 0 ? 'W' : x === W - 1 ? 'E' : null);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (g[y][x] !== 5) continue;
    const e = edgeOf(x, y);
    if (!e || !cfg.streets.includes(e)) gatesOk = false;   // a gate on a non-street edge
  }
  const edgesHit = new Set(res.gates.map(t => t.edge));
  for (const e of cfg.streets) if (!edgesHit.has(e)) gatesOk = false;   // a street with no gate
}
{
  const corner = S.generate(99, { cw: 1, ch: 1, streets: ['S', 'E'] });
  cornerOk = new Set(corner.gates.map(t => t.edge)).size === 2;
  const two = S.generate(99, { cw: 2, ch: 1, streets: ['S'] });
  mergeGates = two.gates.filter(t => t.edge === 'S').length === 2;   // 2-wide main street -> 2 gates
}
ok('gates sit ONLY on street-facing edges, every street gets a gate', gatesOk);
ok('a corner block exits TWO streets', cornerOk);
ok('a merged 2x1 puts two gates on the main street', mergeGates);

// ---- MODULAR HOUSES: not clones. Multiple widths + both stories present. ----
let variety = true;
for (const cfg of [{ cw: 1, ch: 1, streets: ['S'] }, { cw: 2, ch: 2, streets: ['S', 'E'] }]) {
  const fps = S.homeFootprints(S.generate(7, cfg));
  const widths = new Set(fps.map(f => f.w)), stories = new Set(fps.map(f => f.story));
  if (widths.size < 3 || stories.size < 2) variety = false;
}
ok('houses are modular: 3+ distinct widths AND both one- and two-story present', variety);

// ---- SPACING LAW: at worst a 3-tile backyard AND 3 tiles between homes ----
function spacingOk(res) {
  const g = res.g, W = res.W, H = res.H, GAP = 3, id = [];
  for (let y = 0; y < H; y++) id.push(new Array(W).fill(-1));
  let next = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!isH(g[y][x]) || id[y][x] >= 0) continue;
    const st = [[x, y]]; id[y][x] = next;
    while (st.length) { const [cx, cy] = st.pop();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy;
        if (nx >= 0 && ny >= 0 && nx < W && ny < H && isH(g[ny][nx]) && id[ny][nx] < 0) { id[ny][nx] = next; st.push([nx, ny]); } } }
    next++;
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (id[y][x] < 0) continue; const a = id[y][x];
    for (let dy = -GAP; dy <= GAP; dy++) for (let dx = -GAP; dx <= GAP; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      if (id[ny][nx] >= 0 && id[ny][nx] !== a) return false;
    }
  }
  return true;
}
let spaced = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 2; s++) if (!spacingOk(S.generate(s * 41 + 3, cfg))) spaced = false;
ok('homes keep a >=3 tile gap from each other + backyard (SPACING LAW)', spaced);

// ---- WALL BACKYARD LAW: a house body (2/9) never within 3 tiles of a wall (4) ----
function wallOk(res) {
  const g = res.g, W = res.W, H = res.H;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!isBody(g[y][x])) continue;
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      if (g[ny][nx] === 4) return false;
    }
  }
  return true;
}
let wallBack = true;
for (const cfg of CONFIGS) for (let s = 1; s <= 2; s++) if (!wallOk(S.generate(s * 41 + 3, cfg))) wallBack = false;
ok('every home keeps a 3-tile DEAD backyard to the wall (WALL BACKYARD LAW)', wallBack);

// ---- DEAD WORLD: no vegetation (tree 7 / pool 8) anywhere ----
let dead = true;
for (const cfg of CONFIGS) { const g = S.generate(7, cfg).g; for (const row of g) for (const c of row) if (c === 7 || c === 8) dead = false; }
ok('no vegetation anywhere — dead world (no trees, no pools)', dead);

// ---- footprints house-sized + enterable (WALK CAMPANA path) ----
const fps = S.homeFootprints(S.generate(7, { cw: 1, ch: 1, streets: ['S'] }));
ok('home footprints exposed for the world model (>0)', fps.length > 0);
ok('footprints are house-sized (6..30 tiles)', fps.every(f => f.w >= 6 && f.w <= 30 && f.h >= 6 && f.h <= 30));
let enterOk = true, checked = 0;
try {
  const wres = S.generate(7, { cw: 1, ch: 1, streets: ['S'] });
  for (const [i, f] of S.homeFootprints(wres).entries()) {
    const fp = FP.generate((7 ^ ((i + 1) * 0x9E3779B1)) >>> 0, f.w, f.h, { zone: 'residential', entrance: 'S' });
    checked++;
    if (!(fp.rooms.length > 0 && fp.doors.length > 0)) enterOk = false;
  }
} catch (e) { enterOk = false; console.log('  enter-path threw: ' + e.message); }
ok('every home is enterable — a live floorplan (WALK CAMPANA, ' + checked + ' homes)', enterOk && checked > 0);

// ---- determinism ----
ok('deterministic per seed', JSON.stringify(S.generate(99, { cw: 2, ch: 1, streets: ['S'] }).g) === JSON.stringify(S.generate(99, { cw: 2, ch: 1, streets: ['S'] }).g));

console.log('SUBURB MODULARITY GATE: ' + pass + ' passed, ' + fail + ' failed  (' + CONFIGS.length + ' configs)');
process.exit(fail ? 1 : 0);
