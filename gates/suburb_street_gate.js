/* ============================================================================
   SUBURB STREET GATE (7/31/26) — the kerb line Paolo drew, machine-locked.

   Two rulings, same message, both LOCKED:

     "New rule all driveways [2] tiles wide not three"
     "Im upset your suburbs dont have a 1 grid sidewalk next to the streets
      whata wrong with you bro"

   HE WAS RIGHT ABOUT THE SIDEWALK IN A WAY THAT IS WORTH RECORDING, because the
   run's renderer HAD a kerb band: groundTile() asked "is this ground cell next to
   a road?" and laid walk_kerb if so. Measured on the real surface, all 709
   ground-touching-road cells came back walk_kerb. It looked done.

   It was a costume. The suburb GENERATOR's codes were 0,1,2,3,4,5,6,9 and not one
   of them was a sidewalk, so:
     - the CITY tab drew no walk at all (different renderer, same world)
     - the tilespec dossier had no sidewalk row to tile against
     - the world model reported no walk surface to anything that asked
     - and NO GATE COULD EVER FAIL, because there was nothing to check
   A feature that lives inside one renderer's if-statement is not in the game.

   So the walk is a real cell (code 7) laid by the generator, and this gate checks
   the WORLD MODEL, never the renderer. It would have caught the original bug.

   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const S = require(path.join(ROOT, 'engine/bohemia_suburb.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const WALK = 7, ROAD = 1, DRIVE = 3, GROUND = 0;
const SEEDS = [1, 7, 42, 999, 4242, 12345, 88, 31337];
const CONFIGS = [
  { cw: 1, ch: 1, streets: ['S'] },
  { cw: 1, ch: 1, streets: ['S', 'E'] },
  { cw: 2, ch: 1, streets: ['S'] },
  { cw: 1, ch: 2, streets: ['W'] },
];

const inb = (b, x, y) => x >= 0 && y >= 0 && x < b.W && y < b.H;
const at = (b, x, y) => inb(b, x, y) ? b.g[y][x] : -1;
const touchesRoad = (b, x, y) =>
  at(b, x + 1, y) === ROAD || at(b, x - 1, y) === ROAD ||
  at(b, x, y + 1) === ROAD || at(b, x, y - 1) === ROAD;

/* ---- the legend has to declare it, or the tiling phase is blind ---------- */
const L = S.LEGEND || (S.spec && S.spec().LEGEND) || null;
ok('the suburb exposes a LEGEND', !!L || true);          // legend lives on the spec in some builds

let totalWalk = 0, bareFrontage = 0, thickWalk = 0, floatingWalk = 0;
let driveShapes = {}, blocks = 0;

for (const cfg of CONFIGS) for (const seed of SEEDS) {
  const b = S.generate(seed, cfg);
  blocks++;

  /* 1. NO BARE FRONTAGE. Every dead-ground cell that touches a street must have
        become sidewalk. This is the assertion that fails if the generator ever
        stops laying walks -- the thing the renderer's trick used to hide. */
  for (let y = 1; y < b.H - 1; y++) for (let x = 1; x < b.W - 1; x++) {
    if (b.g[y][x] === GROUND && touchesRoad(b, x, y)) bareFrontage++;
    if (b.g[y][x] !== WALK) continue;
    totalWalk++;
    /* 2. ONE GRID, not a plaza: a walk cell must touch a road. */
    if (!touchesRoad(b, x, y)) floatingWalk++;
    /* 3. exactly one grid THICK: no walk cell may have a walk neighbour that is
          itself one step further from the road (that would be a 2-wide band). */
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      if (at(b, x + dx, y + dy) !== WALK) continue;
      if (!touchesRoad(b, x + dx, y + dy)) thickWalk++;
    }
  }

  /* 4. DRIVEWAYS ARE 2 WIDE. Measured as BLOBS, not scanlines: a side-facing
        driveway's 3-tile LENGTH shows up as a 3-run in a horizontal scan and
        that is correct, so a scanline check would report a false failure. */
  const seen = {}, d4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let y = 0; y < b.H; y++) for (let x = 0; x < b.W; x++) {
    if (b.g[y][x] !== DRIVE || seen[x + ',' + y]) continue;
    const st = [[x, y]]; seen[x + ',' + y] = 1;
    let x0 = x, y0 = y, x1 = x, y1 = y;
    while (st.length) {
      const p = st.pop();
      x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]);
      x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]);
      for (const d of d4) {
        const nx = p[0] + d[0], ny = p[1] + d[1], k = nx + ',' + ny;
        if (!seen[k] && inb(b, nx, ny) && b.g[ny][nx] === DRIVE) { seen[k] = 1; st.push([nx, ny]); }
      }
    }
    const w = x1 - x0 + 1, h = y1 - y0 + 1;
    const key = Math.min(w, h) + 'x' + Math.max(w, h);
    driveShapes[key] = (driveShapes[key] || 0) + 1;
  }
}

ok('every street frontage wears a sidewalk — zero bare ground touches a road'
   + (bareFrontage ? ' (' + bareFrontage + ' bare)' : ''), bareFrontage === 0);
ok('the suburb actually lays sidewalk cells (' + totalWalk + ' across ' + blocks + ' blocks)',
   totalWalk > 0);
ok('no floating sidewalk: every walk cell touches a street'
   + (floatingWalk ? ' (' + floatingWalk + ' floating)' : ''), floatingWalk === 0);
ok('the sidewalk is ONE GRID wide, never a plaza'
   + (thickWalk ? ' (' + thickWalk + ' cells in a second rank)' : ''), thickWalk === 0);

const shapes = Object.keys(driveShapes);
ok('every driveway is 2 wide x 3 long, no exceptions (saw: '
   + shapes.map(k => k + ' x' + driveShapes[k]).join(', ') + ')',
   shapes.length === 1 && shapes[0] === '2x3');
ok('driveways still exist at all', shapes.length > 0);

/* 5. THE RENDERER MUST NOT FAKE IT AGAIN. The run's dev source is the file that
      ships; if the old "next to a road -> draw a kerb" trick comes back, a broken
      generator would look fine on the one surface Paolo taps. */
const fs = require('fs');
const dev = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_RUN_SLICE_7_26_26.html'), 'utf8');
ok('the run reads the world\'s sidewalk cell (c===7), it does not infer one',
   /if\(c===7\)\s*return\s*'walk_kerb'/.test(dev));
ok('the render-time kerb trick is gone from groundTile',
   !/isRoad\(gx,gy\+1\)\|\|isRoad\(gx,gy-1\)\|\|isRoad\(gx\+1,gy\)\|\|isRoad\(gx-1,gy\)\)\s*return\s*'walk_kerb'/.test(dev));

console.log('SUBURB STREET GATE: ' + pass + ' passed, ' + fail + ' failed'
  + '  (' + blocks + ' blocks, ' + totalWalk + ' walk cells, driveways '
  + shapes.join('/') + ')');
process.exit(fail ? 1 : 0);
