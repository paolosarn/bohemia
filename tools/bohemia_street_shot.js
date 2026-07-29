/* THE STREET, AS PAOLO SEES IT (7/29/26).
 *
 * The run's tile set moved on his ruling ("A"), and the interior does not use the
 * street tiles at all — so a screenshot of the bedroom proves nothing about the
 * swap. This walks OUT the front door and shoots the street, which is the only
 * surface the 42 tiles actually appear on. VERIFY-ON-THE-REAL-SURFACE.
 *
 * The walk-out is lifted from tools/bohemia_canvas_memory_probe.js, which already
 * solved this the hard way: steer by the INTERIOR's own door and passability grid
 * (state().homeDoor is exterior coordinates and walks you at a wall), BFS a real
 * path instead of greedy-stepping into a corner, and press the last step ON THE
 * BEAT because walking into a shut door spends the press opening it.
 *
 * REUSE CHECK: draws nothing. A screenshot of the shipped run.
 *   node tools/bohemia_street_shot.js [out.png] -> records/target/STREET_NOW.png */
const path = require('path'), fs = require('fs');
function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}
const REPO = path.dirname(__dirname);
const OUT = process.argv[2] || path.join(REPO, 'records', 'target', 'STREET_NOW.png');

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
  if (!prev.has(cur)) return out;
  let node = to;
  while (prev.get(cur)) {
    const p = prev.get(cur);
    out.unshift([node[0] - p[0], node[1] - p[1]]);
    node = p; cur = key(p[0], p[1]);
  }
  return out;
}

(async () => {
  const { chromium } = playwright();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 418, height: 912 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(REPO, 'slices', 'BOHEMIA_RUN_CURRENT.html'));
  await p.waitForFunction(() => window.__RUN && window.__RUN.state, null, { timeout: 30000 });
  await p.waitForTimeout(4000);
  for (let i = 0; i < 3; i++) { await p.mouse.click(209, 640); await p.waitForTimeout(700); }

  const home = await p.evaluate(() => {
    const i = window.__RUN.interior(), s = window.__RUN.state();
    if (!i) return null;
    const d = i.door;
    return { pass: i.pass, at: [s.px, s.py],
             door: d ? (d.x !== undefined ? [d.x, d.y] : [d[0], d[1]]) : null };
  });
  const KEY = { '1,0': 'ArrowRight', '-1,0': 'ArrowLeft', '0,1': 'ArrowDown', '0,-1': 'ArrowUp' };
  if (home && home.door) {
    for (const s of bfs(home.pass, home.at, home.door)) {
      await p.keyboard.press(KEY[s[0] + ',' + s[1]]);
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
  // out of the house — now get clear of the driveway so the ROAD is in frame
  for (let i = 0; i < 14; i++) { await p.keyboard.press('ArrowDown'); await p.waitForTimeout(150); }
  await p.waitForTimeout(1200);

  const st = await p.evaluate(() => window.__RUN.state());
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await p.screenshot({ path: OUT });
  await b.close();
  console.log(st.mode === 'int' ? '  STILL INSIDE — the shot is not the street'
                                : '  outside at ' + st.px + ',' + st.py + ' -> ' + OUT);
  process.exit(st.mode === 'int' ? 1 : 0);
})();
