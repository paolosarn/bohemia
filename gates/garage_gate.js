// GARAGE INTERIOR GATE (7/19/26) — the first special interior a portal opens into. A parking
// structure must be MULTI-DECK, each deck a drive aisle with stalls + abandoned cars + a stair
// core, decks joined by an aligned RAMP, the ground deck holding the entrance, and — the real
// test — a car must be able to drive from the entrance UP THROUGH THE RAMPS to reach every deck
// (a 3D reachability check). Deterministic.
const G = require('../engine/bohemia_garage.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const cnt = g => { const t = {}; for (const row of g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };

const r = G.generate(7, { w: 28, h: 20, decks: 3 });
ok('generates a multi-deck garage', r.kind === 'garage' && r.levels >= 2 && r.decks.length === r.levels);

let anatomy = true, rampAligned = true, groundEntrance = false;
let rampPos = null;
for (let L = 0; L < r.levels; L++) {
  const t = cnt(r.decks[L]);
  if (!(t[1] > 20 && (t[2] || 0) + (t[3] || 0) > 60 && t[3] > 10 && t[5] > 0)) anatomy = false; // aisle, stalls+cars, cars, stair core
  if (L === 0 && t[6] > 0) groundEntrance = true;
  if (L < r.levels - 1) { if (!(t[4] > 0)) rampAligned = false; }
}
ok('every deck has an aisle + stalls + abandoned cars + a stair core', anatomy);
ok('the ground deck has the entrance (from the exterior ramp)', groundEntrance);
ok('every non-top deck has a ramp up', rampAligned);

// 3D REACHABILITY: from the ground entrance, drive the aisles + ramps and reach EVERY deck.
// ramp cells (4) at (x,y) connect level L to level L+1 at the same (x,y).
const decks = r.decks, W = r.W, H = r.H, N = r.levels;
const pass3 = (L, x, y) => { if (L < 0 || L >= N || x < 0 || y < 0 || x >= W || y >= H) return false; const c = decks[L][y][x]; return c === 1 || c === 4 || c === 6; };
const start = [];
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (decks[0][y][x] === 6) start.push([0, x, y]);
const seen = new Set(start.map(s => s.join(','))), st = start.slice();
while (st.length) {
  const [L, x, y] = st.pop();
  const nbrs = [[L, x + 1, y], [L, x - 1, y], [L, x, y + 1], [L, x, y - 1]];
  if (decks[L][y][x] === 4) { nbrs.push([L + 1, x, y]); nbrs.push([L - 1, x, y]); }   // ride the ramp between decks
  if (L > 0 && decks[L - 1] && decks[L - 1][y][x] === 4) nbrs.push([L - 1, x, y]);
  for (const [nl, nx, ny] of nbrs) { const k = nl + ',' + nx + ',' + ny; if (!seen.has(k) && pass3(nl, nx, ny)) { seen.add(k); st.push([nl, nx, ny]); } }
}
const decksReached = new Set(); for (const k of seen) decksReached.add(k.split(',')[0]);
ok('a car drives from the entrance UP THE RAMPS to reach every deck (3D reachable)', decksReached.size === N);

// every stall/car sits in a bank that opens onto the aisle (not walled off)
let bankOk = true;
for (let L = 0; L < N; L++) for (let y = 1; y < H - 1; y++) {
  const row = decks[L][y]; let hasStall = row.some(c => c === 2 || c === 3);
  if (hasStall) { let hasDrive = row.some(c => c === 1 || c === 4 || c === 6); if (!hasDrive) bankOk = false; }
}
ok('every stall row opens onto the drive aisle', bankOk);

ok('deterministic per seed', JSON.stringify(G.generate(9, { w: 26, h: 18, decks: 3 })) === JSON.stringify(G.generate(9, { w: 26, h: 18, decks: 3 })));

console.log('GARAGE GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
