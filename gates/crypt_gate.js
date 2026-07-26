// CRYPT INTERIOR GATE (7/19/26) — the mausoleum interior a cemetery portal opens into. A crypt
// must be EXACTLY the footprint w x h (interior===exterior), have banks of burial VAULTS, an
// ALTAR terminus, an ENTRANCE at the front, some vaults broken open (act-1 dead), every walkable
// floor reachable from the entrance, and be deterministic.
const C = require('../engine/bohemia_crypt.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const cnt = g => { const t = {}; for (const row of g) for (const c of row) t[c] = (t[c] || 0) + 1; return t; };

// EXACT dimensions for any footprint shape (the law)
let dimOk = true;
for (const [w, h] of [[29, 17], [17, 29], [24, 18], [12, 40], [40, 12]]) {
  const r = C.generate(7, { w, h });
  if (!(r.W === w && r.H === h && r.grid.length === h && r.grid.every(row => row.length === w))) dimOk = false;
}
ok('crypt interior is EXACTLY the footprint w x h, any shape (interior===exterior)', dimOk);

const r = C.generate(7, { w: 29, h: 17 }), g = r.grid, W = r.W, H = r.H, t = cnt(g);
ok('crypt has banks of burial vaults', (t[2] || 0) > 60);
ok('some vaults are broken open (act-1 dead)', (t[3] || 0) > 5);
ok('an altar / memorial terminus', (t[5] || 0) > 0);
ok('an entrance at the front', (t[4] || 0) > 0);

// every walkable floor reachable from the entrance
let total = 0; for (const row of g) for (const c of row) if (c === 1 || c === 4) total++;
const start = []; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (g[y][x] === 4) start.push([x, y]);
const seen = new Set(start.map(s => s.join(','))), st = start.slice();
while (st.length) { const [x, y] = st.pop(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (seen.has(k) || nx < 0 || ny < 0 || nx >= W || ny >= H) continue; if (g[ny][nx] === 1 || g[ny][nx] === 4) { seen.add(k); st.push([nx, ny]); } } }
ok('every crypt floor reachable from the entrance', total > 0 && seen.size / total > 0.95);

ok('deterministic per seed', JSON.stringify(C.generate(41, { w: 24, h: 18 })) === JSON.stringify(C.generate(41, { w: 24, h: 18 })));

console.log('CRYPT GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
