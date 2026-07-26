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

// INTERIOR-MATCHES-EXTERIOR LAW (Paolo 7/19, LOCKED: "if your interior does not match the
// width and length of the exterior every time, you are failing... I am not having it any
// other way"). The generator used to PAD any footprint too small for its zone's room
// grammar (`W=Math.max(minR+2,W|0)`) — 343 buildings in the seed-12345 valley came back
// bigger inside than out: a 3x108 storage unit row as 10x108, a 1x19 farm strip as 6x19.
// This sweeps the pathological sizes exhaustively — every zone, every entrance side, every
// plate from 1x1 up, plus the exact real footprints the valley scan caught. The plate must
// come back EXACTLY as asked AND still be a real interior: rooms with area, every room
// roled, a perimeter entrance, every room reachable through it.
let dimExact = true, dimBad = null, slivRooms = true, slivReach = true, slivEnt = true, slivRoled = true, sizesChecked = 0;
const SIZES = [];
for (let W = 1; W <= 14; W++) for (let H = 1; H <= 14; H++) SIZES.push([W, H]);
// the real footprints the valley probe flagged as clamped, verbatim
[[1, 19], [19, 1], [3, 108], [4, 108], [3, 51], [4, 51], [8, 1], [5, 16], [16, 5], [7, 6], [2, 40], [40, 2]].forEach(p => SIZES.push(p));
for (const z of ZONES) {
  for (const e of ['S', 'N', 'W', 'E']) {
    for (const [W, H] of SIZES) {
      const fp = F.generate(W * 7919 + H * 104729 + e.charCodeAt(0), W, H, { zone: z, entrance: e });
      sizesChecked++;
      if (fp.W !== W || fp.H !== H) { dimExact = false; if (!dimBad) dimBad = z + ' ' + W + 'x' + H + ' -> ' + fp.W + 'x' + fp.H; }
      if (!fp.rooms.length || fp.rooms.some(r => r.w <= 0 || r.h <= 0)) slivRooms = false;
      if (!fp.rooms.every(r => r.role)) slivRoled = false;
      const ent = fp.doors.find(d => d[0] === 0 || d[1] === 0 || d[0] === fp.W - 1 || d[1] === fp.H - 1);
      if (!ent) { slivEnt = false; continue; }
      const seen = new Set([ent[0] + ',' + ent[1]]), st = [ent];
      const passable = (x, y) => { if (x < 0 || y < 0 || x >= fp.W || y >= fp.H) return false; const c = fp.grid[y][x]; return c.g === 'floor' || c.g === 'door'; };
      while (st.length) { const [x, y] = st.pop(); for (const [dx, dy] of d4) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (!seen.has(k) && passable(nx, ny)) { seen.add(k); st.push([nx, ny]); } } }
      const reached = new Set();
      for (let y = 0; y < fp.H; y++) for (let x = 0; x < fp.W; x++) if (seen.has(x + ',' + y) && fp.grid[y][x].room >= 0) reached.add(fp.grid[y][x].room);
      if (reached.size !== fp.rooms.length) slivReach = false;
    }
  }
}
// LEISURE: drivein/golf/stadium/waterpark declare zone 'leisure' in DISTGEN and used to
// fall through to the nameless 'default' grammar. A zone the world model asks for must exist.
const leisure = F.generate(31337, 30, 20, { zone: 'leisure' });

ok('every room reachable from the street entrance (all zones, all seeds)', allReach);
ok('the plate is EXACTLY the footprint, never padded (' + sizesChecked + ' sizes x zones x sides)' + (dimBad ? ' — ' + dimBad : ''), dimExact);
ok('every plate yields real rooms with area (no zero-area room)', slivRooms);
ok('every plate has a perimeter entrance, down to a 1-cell sliver', slivEnt);
ok('every room reachable at every plate size', slivReach);
ok('every room roled at every plate size', slivRoled);
ok('the leisure zone exists (drivein/golf/stadium/waterpark ask for it)', !!F.ZONES.leisure && leisure.rooms.every(r => F.ZONES.leisure.roles.includes(r.role)));
ok('rooms never overlap', noOverlap);
ok('every building has a perimeter entrance', hasEntrance);
ok('every room is zoned (has a role)', roled);
ok('generation is deterministic per seed', deterministic);

console.log('FLOORPLAN GATE: ' + pass + ' passed, ' + fail + ' failed  (' + ZONES.length + ' zones)');
process.exit(fail ? 1 : 0);
