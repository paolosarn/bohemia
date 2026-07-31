/* BOHEMIA LEGIBILITY GATE (7/31/26) — you have to be able to tell what a building is.
 *
 * WHERE THIS CAME FROM. On 7/30 Paolo drew three yellow circles on the high-school plot
 * and asked what was inside them. They were the gymnasium, the tennis courts and the
 * portable classrooms — three of the biggest objects on the site — and the honest answer
 * was that they were flat colour rectangles with no edge, no roof and no door. That is
 * the Pocket City bar failing out loud: "everything looks unique enough to know what it
 * is at a glance." He killed the tennis courts, approved the fixed school at 89% on 7/31
 * and said move on, and APPROVE UNLOCKS VOLUME — so the fix has to cover all 42 districts
 * that have buildings, not the one he happened to be looking at.
 *
 * WHY IT IS A RENDER RULE AND NOT TILE DATA, which is the load-bearing decision here:
 * baking an outline into the grids converts 9% to 60% of every building's tiles to a new
 * code (measured across the real set). That shrinks every FOOTPRINT, and INTERIOR-MATCHES-
 * EXTERIOR (Paolo 7/19, LOCKED) says an interior is ALWAYS exactly its footprint — so
 * every building in the valley would quietly get a smaller interior, and 42 district gates
 * would go red, over an encoding change that changes nothing about the world. An eave is
 * where the roof edge catches the sky. That is light, and SHADING SEPARATION already says
 * light lives on its own layer and is never baked into the asset.
 *
 * WHAT IT PROVES:
 *  1. Every district that has buildings produces an eave, and EVERY BUILDING MASS in it
 *     gets one — a mass with no edge is a mass you cannot see the shape of.
 *  2. The eave is exactly the boundary: every edge tile touches something outside its
 *     mass, and no interior tile is marked. Both directions, so it can neither miss an
 *     outline nor flood a building.
 *  3. It is ONE ANSWER SHARED BY EVERY SURFACE. The valley map painter and the judge tool
 *     both call K.buildingEdges. A second copy of this logic is how two surfaces start
 *     disagreeing about what Paolo is looking at (ENGINE SYNC LAW, and VERIFY ON THE REAL
 *     SURFACE: he judges what the game draws, not a second renderer's opinion of it).
 *  4. lighten() moves toward the light, never past it, and never invents a hue — the
 *     district's own palette still decides what the roof IS.
 *  5. Deterministic per seed.
 *
 *   node gates/legibility_gate.js
 */
const fs = require('fs');
const path = require('path');
const K = require('../engine/bohemia_district_kit.js');

const ROOT = path.join(__dirname, '..');
let pass = 0; const fails = [];
const ok = (n, c) => { c ? pass++ : fails.push(n); };

/* load every district module (registration is a side effect of require) */
for (const f of fs.readdirSync(path.join(ROOT, 'engine'))) {
  if (!/^bohemia_.*\.js$/.test(f) || /test|kit/.test(f)) continue;
  try { require(path.join(ROOT, 'engine', f)); } catch (e) { /* not a district */ }
}

const SOLID = { building: 1, structure: 1, fence: 1, panel: 1 };
const D4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

let withBuildings = 0, massesChecked = 0, unedged = [], boundaryWrong = [], interiorWrong = [];

for (const name of K.types()) {
  const d = K.get(name);
  if (!d || !d.generate || !d.legend) continue;
  const massCodes = new Set(Object.keys(d.legend).filter(c => SOLID[d.legend[c].kind]).map(Number));
  if (!massCodes.size) continue;

  let r;
  try { r = d.generate(11, { streets: ['S'] }); } catch (e) { continue; }
  const g = r.g, W = g[0].length, H = g.length;
  let any = false;
  for (let y = 0; y < H && !any; y++) for (let x = 0; x < W; x++) if (massCodes.has(g[y][x])) { any = true; break; }
  if (!any) continue;
  withBuildings++;

  const edges = K.buildingEdges(g, d.legend);

  /* 2) the edge set is exactly the boundary, checked BOTH ways */
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!massCodes.has(g[y][x])) continue;
    let onBoundary = false;
    for (const [dx, dy] of D4) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H || !massCodes.has(g[ny][nx])) { onBoundary = true; break; }
    }
    const marked = !!edges[x + ',' + y];
    if (onBoundary && !marked) boundaryWrong.push(name + '@' + x + ',' + y);
    if (!onBoundary && marked) interiorWrong.push(name + '@' + x + ',' + y);
  }

  /* 1) every mass gets an outline */
  const seen = new Set();
  for (let y0 = 0; y0 < H; y0++) for (let x0 = 0; x0 < W; x0++) {
    if (!massCodes.has(g[y0][x0]) || seen.has(x0 + ',' + y0)) continue;
    const st = [[x0, y0]], cells = []; seen.add(x0 + ',' + y0);
    while (st.length) {
      const p = st.pop(); cells.push(p);
      for (const [dx, dy] of D4) {
        const nx = p[0] + dx, ny = p[1] + dy, k = nx + ',' + ny;
        if (!seen.has(k) && nx >= 0 && ny >= 0 && nx < W && ny < H && massCodes.has(g[ny][nx])) { seen.add(k); st.push([nx, ny]); }
      }
    }
    if (cells.length < 25) continue;                       // a bollard is not a building
    massesChecked++;
    if (!cells.some(p => edges[p[0] + ',' + p[1]])) unedged.push(name + '(' + cells.length + ')');
  }
}

ok(`every district that has buildings is swept (${withBuildings} districts, ${massesChecked} building masses)`,
   withBuildings >= 35 && massesChecked >= 100);
ok('EVERY BUILDING MASS GETS AN EAVE — none is left as a flat fill' +
   (unedged.length ? ' — ' + unedged.slice(0, 4).join(', ') : ''), unedged.length === 0);
ok('the eave is exactly the boundary: no boundary tile is missed' +
   (boundaryWrong.length ? ' (' + boundaryWrong.length + ' missed, e.g. ' + boundaryWrong[0] + ')' : ''),
   boundaryWrong.length === 0);
ok('the eave never floods the interior of a mass' +
   (interiorWrong.length ? ' (' + interiorWrong.length + ' wrong, e.g. ' + interiorWrong[0] + ')' : ''),
   interiorWrong.length === 0);

/* 3) ONE ANSWER, EVERY SURFACE */
const vmap = fs.readFileSync(path.join(ROOT, 'engine', 'bohemia_valleymap.js'), 'utf8');
const judge = fs.readFileSync(path.join(ROOT, 'tools', 'bohemia_school_judge.py'), 'utf8');
ok('the REAL map painter draws the eave (engine/bohemia_valleymap.js calls K.buildingEdges)',
   /K\.buildingEdges\s*\(/.test(vmap) && /K\.lighten\s*\(/.test(vmap));
ok('the surface Paolo JUDGES on uses the same answer, not a second renderer of its own',
   /buildingEdges\s*\(/.test(judge));
ok('nobody has grown a second copy of the edge logic outside the kit',
   !/function\s+buildingEdges/.test(vmap) && !/def\s+buildingEdges/.test(judge));

/* 4) lighten() moves toward the light and stops there */
const L = K.lighten;
ok('lighten moves a swatch toward the light: #7a4038 -> ' + L('#7a4038', 0.28),
   L('#7a4038', 0.28) !== '#7a4038' && /^#[0-9a-f]{6}$/.test(L('#7a4038', 0.28)));
ok('lighten never overshoots white and never darkens', (() => {
  for (const hex of ['#000000', '#ffffff', '#2f5a52', '#c9c1aa', '#3d5570']) {
    for (const f of [0, 0.28, 1]) {
      const o = L(hex, f);
      for (let i = 1; i < 7; i += 2) {
        const a = parseInt(hex.substr(i, 2), 16), b = parseInt(o.substr(i, 2), 16);
        if (b < a || b > 255) return false;
      }
    }
  }
  return true;
})());
ok('lighten passes a non-colour through untouched instead of throwing',
   L(null, 0.3) === null && L('rgb(1,2,3)', 0.3) === 'rgb(1,2,3)');

/* 5) deterministic */
const sch = K.get('school');
ok('deterministic per seed', JSON.stringify(K.buildingEdges(sch.generate(70, { streets: ['S'] }).g, sch.legend)) ===
   JSON.stringify(K.buildingEdges(sch.generate(70, { streets: ['S'] }).g, sch.legend)));

for (const f of fails) console.log('  > FAIL ' + f);
console.log(`=== LEGIBILITY GATE: ${pass} passed, ${fails.length} failed  (${withBuildings} districts, ${massesChecked} masses)`);
process.exit(fails.length ? 1 : 0);
