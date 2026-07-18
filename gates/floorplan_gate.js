// FLOORPLAN GATE (Paolo 7/18/26) — the enterable rung must always be enterable.
// A generated interior is worthless if a room is sealed off or the building has
// no way in. This proves, across many zones and seeds: every room is reachable
// from the street entrance, rooms never overlap, every room has a role, a
// perimeter entrance exists, and generation is deterministic.
const F = require('../engine/bohemia_floorplan.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const ZONES = Object.keys(F.ZONES);
const d4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

let allReach = true, noOverlap = true, hasEntrance = true, roled = true, deterministic = true;
for (const z of ZONES) {
  for (let s = 1; s <= 8; s++) {
    const W = 26 + (s * 3) % 14, H = 18 + (s * 2) % 10;
    const fp = F.generate(s * 911 + 13, W, H, { zone: z, entrance: 'SNWE'[s % 4] });

    // overlap: every floor cell maps to exactly its room's rectangle
    for (const rm of fp.rooms) {
      for (let y = rm.y; y < rm.y + rm.h; y++) for (let x = rm.x; x < rm.x + rm.w; x++) {
        if (fp.grid[y][x].room !== fp.rooms.indexOf(rm) && fp.grid[y][x].g === 'floor') noOverlap = false;
      }
    }

    // entrance on the perimeter
    const ent = fp.doors.find(d => d[0] === 0 || d[1] === 0 || d[0] === fp.W - 1 || d[1] === fp.H - 1);
    if (!ent) { hasEntrance = false; continue; }

    // flood from the entrance through floor+door; every room must be touched
    const seen = new Set([ent[0] + ',' + ent[1]]), st = [ent];
    const passable = (x, y) => { if (x < 0 || y < 0 || x >= fp.W || y >= fp.H) return false; const c = fp.grid[y][x]; return c.g === 'floor' || c.g === 'door'; };
    while (st.length) { const [x, y] = st.pop(); for (const [dx, dy] of d4) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (!seen.has(k) && passable(nx, ny)) { seen.add(k); st.push([nx, ny]); } } }
    const reached = new Set();
    for (let y = 0; y < fp.H; y++) for (let x = 0; x < fp.W; x++) if (seen.has(x + ',' + y) && fp.grid[y][x].room >= 0) reached.add(fp.grid[y][x].room);
    if (reached.size !== fp.rooms.length) allReach = false;

    // every room has a role
    if (!fp.rooms.every(r => r.role)) roled = false;
  }
}
// determinism
const a = JSON.stringify(F.generate(4242, 30, 20, { zone: 'retail' }));
const b = JSON.stringify(F.generate(4242, 30, 20, { zone: 'retail' }));
if (a !== b) deterministic = false;

ok('every room reachable from the street entrance (all zones, all seeds)', allReach);
ok('rooms never overlap', noOverlap);
ok('every building has a perimeter entrance', hasEntrance);
ok('every room is zoned (has a role)', roled);
ok('generation is deterministic per seed', deterministic);

console.log('FLOORPLAN GATE: ' + pass + ' passed, ' + fail + ' failed  (' + ZONES.length + ' zones)');
process.exit(fail ? 1 : 0);
