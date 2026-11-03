#!/usr/bin/env node
/* COMBAT MAPS 3 [every place its own board] 11/3 -- THE SHOTS for his VOTE cards: each place on his upright phone (390 x 844,
   touch), by day, in the LIVE fight (slices/BOHEMIA_FIGHT.html), started the way the map starts it (its district and a cell),
   one start() a shot: AFTER is the fight's opening view (the board and both sides where they start), IN PLAY is the same fight
   on AUTO a few turns on (the twist being used: the lanes, the wreck, the flanks). BEFORE is COMBAT MAPS 2's own after shot of the
   place (the right half of its card, records/target/combat_maps_11_2c/ground_<district>.webp), the board as it stood on main.
   The seed is searched until the deal shows the start the card is about (the place's own: camp, wide, pincer).
     node tools/bohemia_combat_maps_every_place_its_own_board_shots_11_3_26.js <place:district:start> ...   */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'records/target/combat_maps_11_3/shots');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.css': 'text/css', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary' };
const want = process.argv.slice(2).map(a => { const [place, district, start, turns] = a.split(':'); return { place, district, start, turns: +(turns || 3) }; });
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = http.createServer((q, r) => {
    const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
  }).listen(0);
  const port = srv.address().port;
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  await p.addInitScript(() => { window.FIGHT_OPTS = { seed: 5, speed: 1, board: 'desert', night: false }; try { localStorage.clear(); } catch (e) {} });
  await p.goto('http://localhost:' + port + '/slices/BOHEMIA_FIGHT.html', { waitUntil: 'load' });
  await p.waitForFunction(() => { try { return !!(eval('FIGHT').S.board); } catch (e) { return false; } }, null, { timeout: 90000 });
  await p.waitForTimeout(2500);
  const made = [];
  for (const w of want) {
    let seed = 0, info = null;
    for (let s = 3; s < 400; s++) {   /* the deal alone, headless in the page, until it shows the start the card is about */
      const st = await p.evaluate(o => { const F = eval('FIGHT'); eval('SEED = ' + (o.seed >>> 0)); F.setup(o); return F.S.boardDef.start; },
        { seed: s, kind: 'ruin', district: w.district, cell: { x: 31, y: 44 }, night: false, auto: true, formation: null });
      if (!w.start || st === w.start) { seed = s; break; }
    }
    const o = { seed, speed: 1, kind: 'ruin', district: w.district, cell: { x: 31, y: 44 }, night: false, teach: false, formation: null };
    await p.evaluate(o => { eval('UI').auto = false; window.FIGHT_OPTS = o; start(); }, o);   /* the opening view: the line he sets (AUTO off) */
    await p.waitForTimeout(400);
    await p.waitForFunction(() => { const l = document.getElementById('load'); return l && l.style.display === 'none'; }, null, { timeout: 90000 });
    await p.waitForTimeout(2800);
    info = await p.evaluate(() => { const F = eval('FIGHT'); return { bar: F.S.boardDef.name, blocks: F.S.boardDef.blocks, start: F.S.boardDef.start, own: F.S.boardDef.own }; });
    const fa = path.join(OUT, w.place + '_after.png'); await p.screenshot({ path: fa });
    /* IN PLAY: the same deal, AUTO, w.turns rounds on */
    const o2 = Object.assign({}, o, { auto: true, speed: 4 });
    await p.evaluate(o => { window.FIGHT_OPTS = o; start(); }, o2);
    await p.waitForTimeout(400);
    await p.waitForFunction(() => { const l = document.getElementById('load'); return l && l.style.display === 'none'; }, null, { timeout: 90000 });
    await p.waitForFunction(n => { const F = eval('FIGHT'); return F.S.round >= n || F.S.over; }, w.turns, { timeout: 120000, polling: 250 }).catch(() => {});
    await p.waitForTimeout(600);
    const fp = path.join(OUT, w.place + '_play.png'); await p.screenshot({ path: fp });
    const round = await p.evaluate(() => eval('FIGHT').S.round);
    made.push(Object.assign({ place: w.place, district: w.district, seed, round, after: path.relative(ROOT, fa), play: path.relative(ROOT, fp) }, info));
    console.log(w.place, w.district, 'seed', seed, info.start, info.own, 'round', round, JSON.stringify(info.blocks));
  }
  const led = path.join(OUT, 'shots.json'); const L = fs.existsSync(led) ? JSON.parse(fs.readFileSync(led, 'utf8')) : {};
  made.forEach(m => { L[m.place] = m; }); fs.writeFileSync(led, JSON.stringify(L, null, 1));
  await br.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
