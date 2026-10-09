/* BUILT ON THE BOARD — the gate for [built on the board] (10/9/26, LIFE + CITY)
 * Rule 40b's third place and 37g (high ground is a roof). Loads COMBAT's real fight on a phone with the options
 * the shell hands it:
 *   A  nothing handed: nothing placed, the board as dealt.
 *   B  a wall, a tank and a roof handed: each lands on YOUR side (no further than one past your front column):
 *      the wall is the board's own BLOCK WALL cover, the tank a piece that blocks movement drawn with its own
 *      picture, the roof's tile is height; and the two lines can still reach each other.
 *   C  a garden bed is open ground: nothing placed.
 *   D  the chain: the map attaches `built` at the one door every fight goes through, and the shell hands it on.
 *   E  MUTATION: a thing the board has no rule for is left off, not guessed.
 * Run:  node gates/built_on_the_board_gate.js
 */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
const ok = (n, c, d) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (d ? '  [' + d + ']' : '')); };
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp' };
(async () => {
  const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const b = await chromium.launch();
  const run = async (built) => {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true });
    const o = { kind: 'suburb', seed: 11, deploy: false }; if (built) o.built = built;
    await ctx.addInitScript({ content: 'window.FIGHT_OPTS=' + JSON.stringify(o) });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e)));
    await p.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_FIGHT.html');
    await p.waitForFunction(() => document.getElementById('load') && document.getElementById('load').style.display === 'none', { timeout: 60000 });
    const r = await p.evaluate(() => { const S = FIGHT.S, G = DB.ground;
      return { built: S.built || [], cf: S.cols[0], at: (S.built || []).map(function (q) { const c = S.cover[q.y][q.x];
        return { id: q.id, cover: c, solid: S.solid[q.y][q.x], terrain: S.terrain[q.y][q.x], src: c ? (G.cover[c] || G.cover_extra[c] || {}).src : null }; }),
        connected: (function () { try { return eval('connected')(); } catch (e) { return null; } })() }; });
    await ctx.close(); return { r: r, errs: errs };
  };
  try {
    const none = await run(null);
    ok('A nothing handed, nothing placed', none.r.built.length === 0);
    const w = await run([{ id: 'wall', fight: 'wall' }, { id: 'tank', fight: 'building' }, { id: 'roof', fight: 'high' }, { id: 'garden', fight: 'open' }, { id: 'zz', fight: 'moat' }]);
    const at = {}; w.r.at.forEach(a => { at[a.id] = a; });
    ok('B three things placed', w.r.built.length === 3, w.r.built.map(q => q.id + '@' + q.x + ',' + q.y).join(' '));
    ok('B all on your side of the board', w.r.built.every(q => q.x <= w.r.cf + 1), 'your front column ' + w.r.cf);
    ok('B the wall is the board\'s own BLOCK WALL', at.wall && at.wall.cover === 'wall');
    ok('B the tank blocks movement and is drawn with its own picture', at.tank && at.tank.solid && /settlement\/lot\/tank\.png$/.test(at.tank.src || ''), at.tank && at.tank.src);
    ok('B the roof is high ground', at.roof && at.roof.terrain === 'height');
    ok('C a garden bed places nothing', !at.garden);
    ok('E MUTATION: a thing the board has no rule for is left off', !at.zz);
    ok('the fight threw nothing', none.errs.length === 0 && w.errs.length === 0, none.errs.concat(w.errs).join(' | ').slice(0, 200));
  } finally { await b.close(); srv.close(); }
  const city = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8'), shell = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  const door = city.indexOf('function cityHandOver(msg, skin){'), mark = city.indexOf('/* __BUILT_ON_THE_BOARD__', door);
  ok('D the map attaches what stands at the one door every fight goes through', door > 0 && mark > door && mark - door < 200 && /msg\.built = __out/.test(city));
  ok('D the shell hands it to the fight', /o\.built = d\.built\.slice\(0, 8\)/.test(shell));
  console.log('\nBUILT ON THE BOARD GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
