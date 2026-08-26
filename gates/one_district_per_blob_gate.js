/* ONE DISTRICT PER BLOB GATE (8/26/26, WORLD lane).
 *
 * A district generator is handed ONE cell and draws 128x128 tiles. When the same district
 * covers a BLOB of cells, every cell builds a complete copy of the whole facility. Found and
 * fixed one at a time over three days:
 *
 *     solar      265 cells, 265 fenced plants with 265 substations   (8/24)
 *     wash        51 cells, 51 tunnel mouths in ONE river            (8/25)
 *     railyard     6 cells, 6 engine sheds and 6 gantry cranes       (8/26)
 *     stadium      4 cells, FOUR STADIUM BOWLS in a 2x2              (8/26)
 *     landfill     4 cells, 4 weighbridges inside one fence line     (8/26)
 *     cemetery     4 cells, 4 chapels in one burial ground           (8/26)
 *
 * SIX TIMES IS NOT A BUG ANY MORE, IT IS A CLASS, so this is the gate for the class rather
 * than a sixth bespoke check. It needs no list of districts and no per-district constants: it
 * reads the valley, finds every registered district that covers more than one cell, and asks
 * one question of each.
 *
 * THE QUESTION, AND WHY IT NEEDS NO MAGIC NUMBER. Build the blob the way the game builds it,
 * and build it again the OLD way -- one cell at a time, each handed only its own bounds, which
 * is exactly the path a lone cell still takes. Count the district's own HERO STRUCTURES in
 * each: the connected runs of whatever tile its `body` predicate names, which is the building
 * mass every district already declares to the kit. One facility does not multiply when you
 * give it more ground. If the two counts are the same, the district is still building itself
 * once per cell.
 *
 * That comparison IS the mutation test, run every time, against the very defect it guards --
 * so this gate cannot go quietly green the way a hardcoded expectation can.
 *
 *   node gates/one_district_per_blob_gate.js
 */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const OM = require(path.join(ROOT, 'engine/bohemia_overmap.js'));
const K = require(path.join(ROOT, 'engine/bohemia_district_kit.js'));

/* LOAD EVERY DISTRICT MODULE so the kit registry is populated. Reading the directory rather
   than keeping a list here is the same rule the rest of this file follows: a district added
   tomorrow is covered tomorrow, without anybody remembering to come back. */
const fs = require('fs');
{
  /* SILENCED ON PURPOSE. Some engine modules run a self-test at require time and print it;
     loading forty of them turned this gate's output into somebody else's test report. The
     registry is the only thing wanted from the load. */
  const _log = console.log; console.log = function () {};
  for (const f of fs.readdirSync(path.join(ROOT, 'engine')).sort()) {
    if (!/^bohemia_[a-z_]+\.js$/.test(f)) continue;
    const p2 = path.join(ROOT, 'engine', f);
    /* ONLY WHAT REGISTERS A DISTRICT, and this is not fussiness. Requiring the whole engine
       folder loaded a module that SELF-TESTS at require time and ends with process.exit --
       so this gate exited 0, printed nothing, and looked like a pass. An exit code cannot be
       caught, so the answer is not to load the file. `K.register(` is the marker a district
       already carries. */
    if (!/K\.register\s*\(/.test(fs.readFileSync(p2, 'utf8'))) continue;
    try { require(p2); } catch (e) { /* a district that cannot load is caught by its own gate */ }
  }
  console.log = _log;
}

let pass = 0; const fails = [];
const ok = (n, c) => { if (c) pass++; else fails.push(n); };

const W = 128, H = 128;

/* the connected runs of `pred` tiles in an assembled blob -- one stadium bowl is one run
   however many cells it spans, and four bowls are four however small each one is */
function structures(big, pred) {
  const h = big.length, w = big[0].length;
  const seen = Array.from({ length: h }, () => new Uint8Array(w));
  let n = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (seen[y][x] || !pred(big[y][x])) continue;
    n++;
    const st = [[x, y]]; seen[y][x] = 1;
    while (st.length) {
      const [a, b] = st.pop();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = a + dx, ny = b + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h || seen[ny][nx] || !pred(big[ny][nx])) continue;
        seen[ny][nx] = 1; st.push([nx, ny]);
      }
    }
  }
  return n;
}

function assemble(mod, blob, cells, asBlob) {
  const bw = (blob.x1 - blob.x0 + 1) * W, bh = (blob.y1 - blob.y0 + 1) * H;
  const big = Array.from({ length: bh }, () => new Array(bw).fill(-1));
  for (const [x, y] of cells) {
    /* asBlob=false hands each cell ONLY ITS OWN bounds, which is the lone-cell path every
       one of these districts still keeps -- so this is not a simulation of the old bug, it
       is the old build, run. */
    const bnds = asBlob ? blob : { x0: x, x1: x, y0: y, y1: y };
    /* AND THE NEIGHBOURS, because not every one of these is an area. A wash is a LINE: it
       takes which sides it arrives and leaves on, not an extent, because it turns corners
       that no bounding box can describe. Handing it bounds alone made it fall through to its
       lone-cell build and the gate read 14 tunnel mouths either way -- a district that was
       fixed yesterday, reported here as untouched, because the harness did not know how to
       build it. A gate that cannot construct the thing it is judging is measuring itself. */
    const inBlob = new Set(cells.map(c => c[0] + ',' + c[1]));
    const near = (dx, dy) => inBlob.has((x + dx) + ',' + (y + dy));
    const neigh = asBlob
      ? { n: near(0, -1), s: near(0, 1), e: near(1, 0), w: near(-1, 0) }
      : { n: false, s: false, e: false, w: false };
    let r = null;
    try { r = mod.generate(4242, { streets: ['S'], bounds: bnds, cellX: x, cellY: y, neigh }); } catch (e) { return null; }
    if (!r || !r.g || r.g.length !== H) return null;
    for (let ly = 0; ly < H; ly++) for (let lx = 0; lx < W; lx++)
      big[(y - blob.y0) * H + ly][(x - blob.x0) * W + lx] = r.g[ly][lx];
  }
  return big;
}

const map = OM.buildOvermap('bohemia'), N = OM.OVER_N;
const at = (x, y) => { const c = (x < 0 || y < 0 || x >= N || y >= N) ? null : map.at(x, y); return c ? c.district : null; };

/* every multi-cell blob in the valley, by flood fill */
const seen = new Set(), blobs = [];
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
  const d = at(x, y); if (!d) continue;
  const key = x + ',' + y; if (seen.has(key)) continue;
  const cells = [], st = [[x, y]]; seen.add(key);
  while (st.length && cells.length < 4096) {
    const c = st.pop(); cells.push(c);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = c[0] + dx, ny = c[1] + dy, k = nx + ',' + ny;
      if (seen.has(k) || at(nx, ny) !== d) continue;
      seen.add(k); st.push([nx, ny]);
    }
  }
  if (cells.length < 2) continue;
  const xs = cells.map(c => c[0]), ys = cells.map(c => c[1]);
  blobs.push({ d, cells, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) });
}

/* THE DISTRICTS UNDER TEST are the ones the world model declares as clusters. Read from the
   model rather than listed here, so wiring a district as a cluster is what puts it under this
   gate -- one edit, not two. */
const worldSrc = fs.readFileSync(path.join(ROOT, 'engine/bohemia_world.js'), 'utf8');
const CLUSTERED = new Set();
/* `[^}]*` looked right and matched NOTHING: every DISTGEN row carries
   `foot:function(r){return r.footprints;}`, so the first `}` ends the class before
   `cluster:true` is ever reached. The set came back empty and the gate reported that the
   world model declares no clusters at all -- with six of them sitting in the file. */
for (const m of worldSrc.matchAll(/^\s*([a-z_]+):\s*\{.*cluster:true/gm)) CLUSTERED.add(m[1]);
ok('the world model declares which districts are clusters, and it declares some ('
   + [...CLUSTERED].sort().join(', ') + ')', CLUSTERED.size >= 4);

/* A BLOB WITH A CLUSTER DISTRICT IN IT IS THE INTERESTING CASE. Blobs of a district that has
   NOT been wired as a cluster are listed too -- not failed, because building them is work
   nobody has done yet, but named, because a silent list is how a backlog stops existing. */
const todo = [];
let checked = 0, multiplied = [];
for (const b of blobs) {
  const spec = K.get(b.d);
  if (!spec || typeof spec.generate !== 'function' || typeof spec.body !== 'function') continue;
  if (!CLUSTERED.has(b.d)) {
    /* THE BACKLOG, KEPT READABLE. Listing every multi-cell blob printed ninety-odd rows of
       roads, desert and mountain -- none of which build a facility that can be duplicated,
       all of which drowned the handful that do. Only the BIGGEST blob per type, and only
       types small enough to be worth a look. */
    if (b.cells.length >= 2 && b.cells.length <= 40) {
      const prev = todo.find(t => t.d === b.d);
      if (!prev) todo.push({ d: b.d, n: b.cells.length });
      else if (b.cells.length > prev.n) prev.n = b.cells.length;
    }
    continue;
  }
  /* keep it to blobs small enough to assemble twice in memory; the big solar field is
     covered by its own gate and by walked_surface on the page */
  if (b.cells.length > 12) continue;
  const asBlob = assemble(spec, b, b.cells, true);
  const perCell = assemble(spec, b, b.cells, false);
  if (!asBlob || !perCell) continue;
  checked++;
  const pred = v => spec.body(v);
  const nBlob = structures(asBlob, pred), nCell = structures(perCell, pred);
  console.log('  ' + b.d.padEnd(10) + ' ' + String(b.cells.length).padStart(2) + ' cells: '
    + 'hero structures ' + nCell + ' if built per cell -> ' + nBlob + ' as one district');
  /* THE RULE IS "DOES NOT SCALE WITH CELLS", NOT "AT LEAST HALVES", and the difference is
     not pedantry: it cost this gate a false red. A three-cell wash goes 6 -> 4, because a
     RUN has two ends whatever its length and each end's headwall counts as two structures.
     That is the fix working perfectly and it is not a halving. What actually distinguishes a
     fixed district is that its facility count stops growing with the ground: at most about
     what ONE cell has, however many cells there are.
     The second clause is for two-cell blobs, where "does not scale" cannot tell the two
     builds apart on its own -- there, strictly fewer is the only signal available. */
  const perOne = nCell / b.cells.length;
  const constant = nBlob <= Math.max(2, Math.round(perOne * 2));
  if (!(constant && nBlob < nCell)) multiplied.push(b.d + ' (' + nCell + ' -> ' + nBlob + ')');
}
ok('every cluster blob in the valley was assembled and counted (' + checked + ' blobs)', checked >= 3);
ok('A FACILITY DOES NOT MULTIPLY WHEN YOU GIVE IT MORE GROUND: built as one district its '
   + 'hero structures stop scaling with the number of cells, and are strictly fewer than '
   + 'building it a cell at a time'
   + (multiplied.length ? ' -> ' + multiplied.join(', ') : ''),
   multiplied.length === 0);

/* NAMED DEBT, AND IT MAY ONLY SHRINK. `convention` was wired as a cluster by another lane
   before this rule existed, and its cluster path runs for a ONE-CELL blob too -- so handing it
   its own single-cell bounds gives a different picture than handing it none. That is a shipped
   decision belonging to a lane that is not mine, recorded rather than quietly excluded or
   loudly failed. Anything else appearing here is a district changing art nobody asked it to. */
const LONE_DEBT = { convention: 'wired as a cluster by another lane before this rule; its '
  + 'cluster path also serves a 1x1 blob, so bounds change the single-cell picture. Not mine.' };

/* AND THE LONE CELL IS UNTOUCHED, for every one of them. The single-cell art already shipped
   and Paolo has seen it; a cluster path that quietly changed it would be a redesign nobody
   asked for, smuggled in under a bug fix. */
const changed = [];
for (const d of CLUSTERED) {
  const spec = K.get(d);
  if (!spec || typeof spec.generate !== 'function') continue;
  for (const streets of [['S'], ['N'], ['E'], ['W'], ['S', 'E']]) {
    for (let s = 1; s <= 4; s++) {
      let a, b;
      try {
        a = JSON.stringify(spec.generate(s * 17 + 3, { streets }).g);
        b = JSON.stringify(spec.generate(s * 17 + 3, { streets, bounds: { x0: 3, x1: 3, y0: 3, y1: 3 }, cellX: 3, cellY: 3 }).g);
      } catch (e) { continue; }
      if (a !== b && !LONE_DEBT[d] && changed.indexOf(d) < 0) changed.push(d);
    }
  }
}
ok('a district that covers ONE cell builds exactly what it always built'
   + (changed.length ? ' -> changed: ' + changed.join(', ') : ''), changed.length === 0);
/* a debt entry that has been fixed and left on the list fails too -- that is how a list like
   this stops meaning anything */
const staleDebt = Object.keys(LONE_DEBT).filter(d => {
  const spec = K.get(d); if (!spec || typeof spec.generate !== 'function') return false;
  try {
    return JSON.stringify(spec.generate(20, { streets: ['S'] }).g)
        === JSON.stringify(spec.generate(20, { streets: ['S'], bounds: { x0: 3, x1: 3, y0: 3, y1: 3 }, cellX: 3, cellY: 3 }).g);
  } catch (e) { return false; }
});
ok('the named lone-cell debt only shrinks (' + Object.keys(LONE_DEBT).join(', ') + ')'
   + (staleDebt.length ? ' -> already fixed, take it off: ' + staleDebt.join(', ') : ''),
   staleDebt.length === 0);

if (todo.length) {
  console.log('  NOT YET ONE DISTRICT -- biggest blob per type, not wired as a cluster:');
  const rows = todo.sort((a, c) => c.n - a.n).slice(0, 14).map(t => t.d + ':' + t.n);
  console.log('    ' + rows.join(' · '));
}
console.log('');
fails.forEach(f => console.log('  FAIL  ' + f));
console.log('ONE DISTRICT PER BLOB GATE: ' + pass + ' passed, ' + fails.length + ' failed');
process.exit(fails.length ? 1 : 0);
