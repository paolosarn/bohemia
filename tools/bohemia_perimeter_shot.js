/* THE PERIMETER WALL, ON THE REAL SURFACE (8/2/26).
 *
 * VERIFY ON THE REAL SURFACE is law (7/18): art is verified ONLY on the surface Paolo
 * sees, and a side-door probe is a lie. The perimeter wall and the gate mouth are the
 * only two surfaces this session touched, and neither is anywhere near where the run
 * starts you - tools/bohemia_street_shot.js walks out the front door and shoots a yard,
 * which proves nothing about a wall on the far side of the block.
 *
 * So this walks the player to the community wall itself. It reads the run's own grid
 * through window.__RUN.grid(), finds the nearest walkable cell that is standing right
 * next to a perimeter cell (code 4) and, separately, one next to the gate mouth (code
 * 5), BFSes a real path to each, and shoots the frame. The steering is lifted whole
 * from tools/bohemia_street_shot.js, which already solved walking this world headless.
 *
 * REUSE CHECK: draws nothing, cooks nothing. Screenshots of the shipped run.
 *   node tools/bohemia_perimeter_shot.js
 *     -> records/target/PERIMETER_WALL_LIVE.png
 *     -> records/target/PERIMETER_GATE_LIVE.png */
const path = require('path');
function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}
const REPO = path.dirname(__dirname);

function bfs(pass, from, to) {
  const H = pass.length, W = pass[0].length;
  const key = (x, y) => x + ',' + y;
  const prev = new Map([[key(from[0], from[1]), null]]);
  const q = [from], D = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length) {
    const [x, y] = q.shift();
    if (x === to[0] && y === to[1]) break;
    for (const [dx, dy] of D) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H || !pass[ny][nx]) continue;
      const k = key(nx, ny);
      if (prev.has(k)) continue;
      prev.set(k, [x, y]); q.push([nx, ny]);
    }
  }
  const out = [];
  let cur = key(to[0], to[1]);
  if (!prev.has(cur)) return null;
  let node = to;
  while (prev.get(cur)) {
    const p = prev.get(cur);
    out.unshift([node[0] - p[0], node[1] - p[1]]);
    node = p; cur = key(p[0], p[1]);
  }
  return out;
}

const KEY = { '1,0': 'ArrowRight', '-1,0': 'ArrowLeft', '0,1': 'ArrowDown', '0,-1': 'ArrowUp' };

(async () => {
  const { chromium } = playwright();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 418, height: 912 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(REPO, 'slices', 'BOHEMIA_RUN_CURRENT.html'));
  await p.waitForFunction(() => window.__RUN && window.__RUN.state, null, { timeout: 30000 });
  await p.waitForTimeout(4000);          // let every bank decode before anything is shot
  for (let i = 0; i < 3; i++) { await p.mouse.click(209, 640); await p.waitForTimeout(700); }

  /* THE RUN STARTS YOU IN BED. Lifted from tools/bohemia_street_shot.js, which already
     solved this: steer by the INTERIOR's own door and passability grid, then press the
     last step ON THE BEAT, because walking into a shut door spends the press opening
     it rather than moving you through it. */
  const home = await p.evaluate(() => {
    const i = window.__RUN.interior(), s = window.__RUN.state();
    if (!i) return null;
    const d = i.door;
    return { pass: i.pass, at: [s.px, s.py],
             door: d ? (d.x !== undefined ? [d.x, d.y] : [d[0], d[1]]) : null };
  });
  if (home && home.door) {
    for (const st of bfs(home.pass, home.at, home.door) || []) {
      await p.keyboard.press(KEY[st[0] + ',' + st[1]]);
      await p.waitForTimeout(45);
      if ((await p.evaluate(() => window.__RUN.state().mode)) !== 'int') break;
    }
    for (let i = 0; i < 8; i++) {
      const c = await p.evaluate(() => window.__RUN.state());
      if (c.mode !== 'int') break;
      const dx = Math.sign(home.door[0] - c.px), dy = Math.sign(home.door[1] - c.py);
      await p.keyboard.press(dx ? (dx > 0 ? 'ArrowRight' : 'ArrowLeft')
                                : (dy > 0 ? 'ArrowDown' : dy < 0 ? 'ArrowUp' : 'ArrowDown'));
      await p.waitForTimeout(520);          // one beat, 120 BPM law
    }
  }
  await p.waitForTimeout(900);

  /* CODE 5 IS RARE ON PURPOSE. "GATED IS RICH" is a Paolo ruling the generator
     enforces: a gate assembly appears ONLY on a gated/estate community, measured at
     1.9% of residential cells on the canon seed. An ordinary walled suburb gets the
     street running through a gap in the wall instead. So the block the game opens on
     almost certainly has no gate, and shooting only that block would report the art
     missing when it is simply somewhere else. gotoCell() walks the valley to find one
     - the run's own loadCell, the same call the edge-crossing makes, so what is shot
     is what a player who walked there sees. */
  async function findCell(c) {
    const here = await p.evaluate((cc) => {
      const g = window.__RUN.grid();
      for (let y = 0; y < g.H; y++) for (let x = 0; x < g.W; x++) if (g.code[y][x] === cc) return true;
      return false;
    }, c);
    /* AND IT HAS TO BE A SUBURB. drawPerim()/drawGateMouth() only run on suburb cells -
       every other district falls through to genericTile() - so a gate found in a MEDICAL
       block is a gate that never gets this art drawn on it. The first run of this walked
       149 steps to exactly that and shot a hospital car park. */
    const sub = await p.evaluate(() => window.__RUN.cell().suburb);
    if (here && sub) return true;
    const home = await p.evaluate(() => window.__RUN.cell().at);
    /* ASK THE OVERMAP, DO NOT WALK THE VALLEY. Hunting a gate by loading cell after cell
       is hundreds of full loadCell+buildSim rounds to find the 1.9% that are gated;
       __RUN.gatedCells() answers it straight from WORLD.tile() with nothing generated. */
    const cands = (c === 5)
      /* RADIUS 30, NOT 12. "GATED IS RICH" bites harder than the 1.9% headline suggests
         - the nearest gated/estate community to the home block is 42 cells away by
         manhattan distance, so a 12-cell search legitimately found nothing and reported
         the art missing. Two exist inside 30. */
      ? await p.evaluate(() => window.__RUN.gatedCells(30).slice(0, 40))
      : [];
    for (const cd of cands) {
      const got = await p.evaluate((a) => {
        if (!window.__RUN.gotoCell(a[0], a[1])) return false;
        if (!window.__RUN.cell().suburb) return false;
        const g = window.__RUN.grid();
        for (let y = 0; y < g.H; y++) for (let x = 0; x < g.W; x++) if (g.code[y][x] === a[2]) return true;
        return false;
      }, [cd[0], cd[1], c]);
      if (got) { await p.waitForTimeout(900); return true; }
    }
    await p.evaluate((h) => window.__RUN.gotoCell(h[0], h[1]), home);
    return false;
  }

  for (const [code, name] of [[4, 'PERIMETER_WALL_LIVE'], [5, 'PERIMETER_GATE_LIVE']]) {
    if (!(await findCell(code))) {
      console.log('  ' + name + ': no cell of code ' + code + ' within 9 cells of home');
      continue;
    }
    const plan = await p.evaluate((c) => {
      const g = window.__RUN.grid(), s = window.__RUN.state();
      if (s.mode !== 'ext') return { err: 'not outside' };
      /* STAND WHERE THE WALL FILLS THE FRAME. The first version took the NEAREST
         walkable cell touching the wall and landed at x=1 - hard against the map edge,
         with the wall itself off-screen behind a field of black. What is wanted is a
         long RUN of wall seen broadside, so each candidate is scored by how much wall
         is within a screen of it, and edge cells are dropped outright. */
      /* THE WALL *IS* THE BLOCK BOUNDARY. Every one of this block's 494 wall cells sits
         on the outer border of the 128x128 grid - that is what a community perimeter is
         - so there is no interior wall run to stand at and requiring one found nothing.
         What CAN be controlled is which way the black points: keeping clear of the left
         and right borders puts the wall across the top or bottom of the frame with a
         full width of block under it, instead of half a screenshot of off-map. */
      const MX = 6;
      const want = [];
      for (let y = 1; y < g.H - 1; y++) for (let x = MX; x < g.W - MX; x++) {
        if (!g.pass[y][x]) continue;
        let touch = false;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          if (g.code[y + dy][x + dx] === c) touch = true;
        }
        if (!touch) continue;
        let n = 0, off = 0;
        for (let yy = y - 8; yy <= y + 8; yy++)
          for (let xx = x - 5; xx <= x + 5; xx++) {
            if (yy < 0 || xx < 0 || yy >= g.H || xx >= g.W) { off++; continue; }
            if (g.code[yy][xx] === 4 || g.code[yy][xx] === 5) n++;
          }
        want.push([x, y, n * 3 - off]);
      }
      if (!want.length) return { err: 'no reachable cell beside code ' + c };
      want.sort((a, b2) => b2[2] - a[2]);
      return { from: [s.px, s.py], to: [want[0][0], want[0][1]], pass: g.pass, sees: want[0][2] };
    }, code);
    if (plan.err) { console.log('  ' + name + ': ' + plan.err); continue; }
    const steps = bfs(plan.pass, plan.from, plan.to);
    if (!steps) { console.log('  ' + name + ': no path'); continue; }
    for (const st of steps) {
      await p.keyboard.press(KEY[st[0] + ',' + st[1]]);
      await p.waitForTimeout(90);
    }
    await p.waitForTimeout(700);
    const out = path.join(REPO, 'records', 'target', name + '.png');
    await p.screenshot({ path: out });
    const at = await p.evaluate(() => { const s = window.__RUN.state(); return [s.px, s.py]; });
    console.log('  ' + name + ': stood at ' + at + ' (' + steps.length + ' steps) -> ' + out);
  }
  await b.close();
})();
