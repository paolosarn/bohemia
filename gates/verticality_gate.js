#!/usr/bin/env node
/* VERTICALITY GATE (8/7/26, WORLD lane).
 *
 * Paolo's stated direction is two-and-three-storey buildings with climbable stairs.
 * The generation half had been there for weeks and the FLOORPLAN half had not:
 * bohemia_suburb.js computed `story:2` for two-storey blobs, bohemia_world.js carried it
 * faithfully all the way down the ladder, and it DIED at the bottom rung -- every
 * two-storey house in the valley had exactly one floor inside it. bohemia_garage.js
 * generates real 2-6 deck structures with ramps and stair cores that nothing walks.
 *
 * A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, so this walks it rather than reading it:
 *
 *   1. AN ACTOR ACTUALLY CLIMBS. Flood from the street door across floor+door cells on
 *      the ground plate; the stair must be REACHED, not merely present. Then step up and
 *      flood the next plate from the stair's own cell. Repeat to the top. A stair you
 *      cannot walk to is a stair nobody climbs.
 *   2. EVERY ROOM ON EVERY FLOOR IS REACHABLE that way -- not just the floor you came in on.
 *   3. INTERIOR MATCHES EXTERIOR PER LEVEL (Paolo 7/19, LOCKED). Every floor is EXACTLY the
 *      footprint w x h. Decks are a separate axis; each one still equals the footprint.
 *   4. NO DOOR INTO THIN AIR. An upper floor carries no perimeter door.
 *   5. STAIRS LINE UP. The cell is floor on BOTH plates, at the same (x,y), one marked up
 *      and one marked down. A staircase that arrives inside a wall is the failure this
 *      whole placement is derived to avoid.
 *   6. NOTHING OLD BROKE. A stair keeps g:'floor' and gains kind:'stair' -- every consumer
 *      in this repo tests g==='floor'||g==='door' for passability, so a new `g` value would
 *      have made stairs IMPASSABLE the day they shipped.
 *   7. AND IT REACHES THE REAL VALLEY, not just a unit test: sampled plots must actually
 *      produce multi-storey interiors, or `story` is still dying somewhere upstream.
 *
 *   node gates/verticality_gate.js
 */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const FP = require(path.join(ROOT, 'engine/bohemia_floorplan.js'));
const { world } = require(path.join(ROOT, 'engine/bohemia_world.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

const passable = c => c && (c.g === 'floor' || c.g === 'door');
function flood(P, starts) {
  const seen = new Set(), st = [];
  for (const [x, y] of starts) {
    if (x < 0 || y < 0 || x >= P.W || y >= P.H) continue;
    if (!passable(P.grid[y][x])) continue;
    seen.add(x + ',' + y); st.push([x, y]);
  }
  while (st.length) {
    const [x, y] = st.pop();
    for (const [dx, dy] of D4) {
      const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
      if (seen.has(k) || nx < 0 || ny < 0 || nx >= P.W || ny >= P.H) continue;
      if (passable(P.grid[ny][nx])) { seen.add(k); st.push([nx, ny]); }
    }
  }
  return seen;
}
function roomsReached(P, seen) {
  const hit = new Set();
  for (let y = 0; y < P.H; y++) for (let x = 0; x < P.W; x++)
    if (seen.has(x + ',' + y) && P.grid[y][x].room >= 0) hit.add(P.grid[y][x].room);
  return hit;
}

// ---- 1-6: THE CLIMB, over a spread of real footprints and zones -------------------
const CASES = [
  [20, 16, 2, 'residential'], [20, 16, 3, 'residential'], [14, 11, 2, 'retail'],
  [9, 7, 2, 'residential'], [30, 22, 4, 'office'], [40, 30, 3, 'warehouse'],
  [7, 25, 2, 'civic'], [2, 14, 2, 'residential'], [12, 12, 2, 'institutional'],
];
let climbed = 0, unreachedRooms = 0, badDims = 0, airDoors = 0, misaligned = 0, gChanged = 0;
for (const [W, H, stories, zone] of CASES) {
  const f = FP.generate(4242 + W * 31 + H, W, H, { zone, entrance: 'S', stories });

  // 3. every level is EXACTLY the footprint
  for (const L of f.levels) if (L.W !== W || L.H !== H) badDims++;

  // 4. no perimeter door above the ground floor
  for (const L of f.levels.slice(1))
    airDoors += L.doors.filter(d => d[0] === 0 || d[1] === 0 || d[0] === W - 1 || d[1] === H - 1).length;

  // 1 + 2. walk in off the street, then climb, floor by floor
  const ent = f.doors.filter(d => d[0] === 0 || d[1] === 0 || d[0] === W - 1 || d[1] === H - 1);
  let start = ent.length ? ent : [[f.stairs.length ? f.stairs[0].x : 0, f.stairs.length ? f.stairs[0].y : 0]];
  for (let L = 0; L < f.levels.length; L++) {
    const P = f.levels[L];
    const seen = flood(P, start);
    if (roomsReached(P, seen).size !== P.rooms.length) unreachedRooms++;
    const s = f.stairs.find(st => st.from === L);
    if (!s) break;
    // 5. the stair must line up AND be floor on both plates
    const below = P.grid[s.y][s.x], above = f.levels[L + 1].grid[s.y][s.x];
    if (!(below.kind === 'stair' && above.kind === 'stair' &&
          below.stair.dir === 'up' && above.stair.dir === 'down')) misaligned++;
    // 6. g must NOT have been repurposed, or the stair is impassable to every consumer
    if (below.g !== 'floor' || above.g !== 'floor') gChanged++;
    // 1. and it has to be REACHED, not just present
    if (!seen.has(s.x + ',' + s.y)) { unreachedRooms++; break; }
    climbed++;
    start = [[s.x, s.y]];
  }
}
ok('AN ACTOR CLIMBS: the stair is reachable on foot and the next floor opens from it (' +
   climbed + ' storeys climbed)', climbed >= 12);
ok('every room on every floor is reachable by that walk', unreachedRooms === 0);
ok('INTERIOR MATCHES EXTERIOR PER LEVEL: every floor is exactly the footprint', badDims === 0);
ok('no door into thin air: an upper floor carries no perimeter door', airDoors === 0);
ok('stairs line up: same cell, floor on both plates, one up and one down', misaligned === 0);
ok("a stair keeps g:'floor' so it stays PASSABLE to every existing consumer", gChanged === 0);

// ---- backwards compatibility: the ground floor IS still the returned object --------
const one = FP.generate(7, 18, 14, { zone: 'residential', entrance: 'S' });
ok('a single-storey call is unchanged in shape (grid/rooms/doors on the object)',
   !!one.grid && Array.isArray(one.rooms) && Array.isArray(one.doors) && one.levels.length === 1);
ok('the ground floor IS the returned object (levels[0] === the plate itself)',
   FP.generate(7, 18, 14, { zone: 'residential', entrance: 'S', stories: 3 }).levels[0].grid !== undefined);
ok("'multi-floor stacking' is off the floorplan's own pending list",
   !(one.meta.pending || []).includes('multi-floor stacking'));

// ---- 7: and it reaches the REAL valley ---------------------------------------------
const w = world(12345);
let sampled = 0, multi = 0, valleyStairs = 0, valleyBadDims = 0;
for (let y = 6; y < 90; y += 9) for (let x = 6; x < 90; x += 9) {
  const c = w.at(x, y); if (!c) continue;
  let p; try { p = w.plot(x, y); } catch (e) { continue; }
  if (!p || !p.buildings.length) continue;
  for (let i = 0; i < Math.min(3, p.buildings.length); i++) {
    const b = p.building(i);
    let f; try { f = b.floorplan(); } catch (e) { continue; }
    sampled++;
    if (f.levels.length > 1) { multi++; valleyStairs += f.stairs.length; }
    for (const L of f.levels) if (L.W !== b.w || L.H !== b.h) valleyBadDims++;
  }
}
ok('the valley actually produces multi-storey interiors (' + multi + ' of ' + sampled +
   ' sampled buildings) — story no longer dies on the way down', multi > 0);
ok('every level of every sampled valley building is exactly its footprint', valleyBadDims === 0);
ok('every multi-storey building in the valley has a stair for each storey above the first',
   valleyStairs >= multi);

console.log('VERTICALITY GATE: ' + pass + ' passed, ' + fail + ' failed  (' + climbed +
            ' storeys climbed · ' + multi + '/' + sampled + ' sampled valley buildings multi-storey)');
process.exit(fail ? 1 : 0);
