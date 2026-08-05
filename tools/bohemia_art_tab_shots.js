/* THE SHOTS THE ART TAB JUDGES (8/4/26).
 *
 * Paolo 8/4: "bro can you put all the work in a different fucking tab like the life
 * tab bro wtf like u want me to hunt all your work down bro thats goofy asf"
 *
 * He is right and it is the NAME THE TAB law, which I broke by telling him to go
 * open PNGs in records/target/. A thing he cannot reach does not exist. So the work
 * goes in a TAB, and this is the part that makes the pictures for it.
 *
 * SIX FRAMES OF THE SAME STANDING SPOT. Walk out the front door once, then shoot
 * without moving, changing exactly ONE thing between frames. Anything else and it
 * is not an A/B, it is two different pictures.
 *
 *   LIGHT OFF   the game as it was: no grade, no shadows
 *   SUN OFF     the grade only, so the cast shadow can be seen ON ITS OWN
 *   LIGHT ON    what shipped
 *   GRIME 0 / 0.30 / 0.55   the dial he has to put a number on
 *
 * THE GRIME DIAL IS OVERRIDDEN IN THE PAGE, NOT IN THE BUILD. GRIME_STRENGTH is a
 * const inside draw() and the shipped build holds it at 0.0 until he rules. This
 * patches draw()'s own source in the browser so the three frames can exist without
 * the game ever shipping at anything but zero.
 *
 * REUSE CHECK: draws nothing. Screenshots the shipped run. The walk-out is lifted
 * from tools/bohemia_street_shot.js, which already solved steering by the INTERIOR's
 * own door and pressing the last step on the beat.
 *
 *   node tools/bohemia_art_tab_shots.js  ->  records/target/ART_*.png
 */
'use strict';
const path = require('path'), fs = require('fs');
function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'records', 'target');

function bfs(passable, from, to) {
  const H = passable.length, W = passable[0].length, key = (x, y) => x + ',' + y;
  const prev = new Map([[key(from[0], from[1]), null]]);
  const q = [from], D = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length) {
    const [x, y] = q.shift();
    if (x === to[0] && y === to[1]) break;
    for (const [dx, dy] of D) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H || !passable[ny][nx]) continue;
      const k = key(nx, ny);
      if (prev.has(k)) continue;
      prev.set(k, [x, y]); q.push([nx, ny]);
    }
  }
  const out = []; let cur = key(to[0], to[1]);
  if (!prev.has(cur)) return out;
  let node = to;
  while (prev.get(cur)) {
    const p = prev.get(cur);
    out.unshift([node[0] - p[0], node[1] - p[1]]); node = p; cur = key(p[0], p[1]);
  }
  return out;
}

(async () => {
  const { chromium } = playwright();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(REPO, 'slices', 'BOHEMIA_RUN_CURRENT.html'));
  await p.waitForFunction(() => window.__RUN && window.__RUN.state, null, { timeout: 60000 });
  await p.waitForTimeout(4000);
  for (let i = 0; i < 3; i++) { await p.mouse.click(195, 620); await p.waitForTimeout(700); }

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
      await p.keyboard.press(KEY[s[0] + ',' + s[1]]); await p.waitForTimeout(45);
      if ((await p.evaluate(() => window.__RUN.state().mode)) !== 'int') break;
    }
    for (let i = 0; i < 8; i++) {
      const c = await p.evaluate(() => window.__RUN.state());
      if (c.mode !== 'int') break;
      const dx = Math.sign(home.door[0] - c.px), dy = Math.sign(home.door[1] - c.py);
      await p.keyboard.press(dx ? (dx > 0 ? 'ArrowRight' : 'ArrowLeft')
                                : (dy > 0 ? 'ArrowDown' : dy < 0 ? 'ArrowUp' : 'ArrowDown'));
      await p.waitForTimeout(520);
    }
  }
  /* three steps clear of the door so the HOUSE is in frame and can cast */
  for (let i = 0; i < 3; i++) { await p.keyboard.press('ArrowDown'); await p.waitForTimeout(140); }
  await p.waitForTimeout(1200);

  const st = await p.evaluate(() => window.__RUN.state());
  if (st.mode === 'int') { console.log('  STILL INSIDE -- the shots are not the world'); await b.close(); process.exit(1); }

  /* THE FRAME MUST HAVE BUILDINGS IN IT. A cast shadow shot on an empty lot is a
     picture of nothing, and it would look like the feature failed. */
  const scene = await p.evaluate(() => {
    const s = window.__RUN.state(); let solid = 0, sh = 0;
    for (let y = s.py - 9; y <= s.py + 9; y++) for (let x = s.px - 5; x <= s.px + 5; x++) {
      if (y < 0 || x < 0 || !SOLIDG[y] || x >= SOLIDG[y].length) continue;
      if (sunSolid(x, y)) { solid++; continue; }
      for (let d = 1; d <= SUN.reach; d++) if (sunSolid(x - d, y - d)) { sh++; break; }
    }
    return { solid: solid, sh: sh };
  });
  if (!scene.solid || !scene.sh) {
    console.log('  NO BUILDINGS (' + scene.solid + ') OR NO SHADOW (' + scene.sh + ') IN FRAME');
    await b.close(); process.exit(1);
  }

  const box = await p.evaluate(() => {
    const c = document.getElementById('cv'), r = c.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });

  /* the dial lives inside draw()'s scope; rewrite draw() ONCE so the three grime
     frames can be taken without the shipped build ever holding anything but 0.0 */
  const patched = await p.evaluate(() => {
    const src = draw.toString().replace('var GRIME_STRENGTH = 0.0;',
                                        'var GRIME_STRENGTH = (window.__GRIME||0);');
    if (src === draw.toString()) return false;
    window.draw = eval('(' + src + ')'); return true;
  });
  if (!patched) { console.log('  COULD NOT REACH THE GRIME DIAL'); await b.close(); process.exit(1); }

  async function shot(file, look, sun, grime) {
    await p.evaluate(v => {
      LOOK.on = v.look; SUN.on = v.sun; window.__GRIME = v.grime; _lookLut = null;
      for (const k in _looked) delete _looked[k];
      for (const k2 in _skinLit) delete _skinLit[k2];
      try { draw(); } catch (_e) {}
    }, { look: look, sun: sun, grime: grime });
    await p.waitForTimeout(900);
    await p.evaluate(() => { try { draw(); } catch (_e) {} });
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(OUT, file), clip: box });
    return file;
  }

  fs.mkdirSync(OUT, { recursive: true });
  const made = [];
  made.push(await shot('ART_LIGHT_OFF.png',  false, false, 0));
  made.push(await shot('ART_SUN_OFF.png',    true,  false, 0));
  made.push(await shot('ART_LIGHT_ON.png',   true,  true,  0));
  made.push(await shot('ART_GRIME_030.png',  true,  true,  0.30));
  made.push(await shot('ART_GRIME_055.png',  true,  true,  0.55));
  await b.close();

  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  console.log('  standing ' + st.px + ',' + st.py + ' · ' + scene.solid +
              ' structure cells · ' + scene.sh + ' in shadow');
  console.log('  ' + made.join('\n  '));
})();
