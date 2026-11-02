#!/usr/bin/env node
/* COMBAT MAPS 2 [every ground its own] 11/2 -- THE SHOTS: every place's fight on his upright phone (390 x 844, the driver's
   phone_portrait profile), by day, in the LIVE fight (slices/BOHEMIA_FIGHT.html), each started the way the map starts it (its
   district and its cell: rule 46a's seeded deal), one start() a shot (the alpha's own restart door). Run once on the old floors
   (before) and once on the new (after); tools/bohemia_combat_maps_every_ground_its_own_11_2_26.py --sheet measures and lays out.
     node tools/bohemia_combat_maps_every_ground_sheet_11_2_26.js <outdir>   */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'records/target/combat_maps_11_2c/after');
const PLACES = [
  ['strip', 'THE STRIP'], ['downtown', 'DOWNTOWN'], ['industrial', 'THE WORKS'], ['suburb', 'THE SUBURBS'], ['wash', 'THE WASH'],
  ['reservoir', 'THE SHORE'], ['mountain', 'THE DESERT PASS'], ['desert', 'THE DESERT'], ['springs', 'RED ROCK'],
  ['trailer', 'THE TRAILER PARK'], ['golf', 'THE GOLF COURSE'], ['water', 'THE MARINA'], ['medical', 'THE LAB YARD'],
  ['airport', 'THE AIRPORT'], ['landfill', 'THE LANDFILL']
];
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.css': 'text/css', '.wasm': 'application/wasm', '.glb': 'model/gltf-binary' };
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
  await p.waitForFunction(() => { try { return !!(eval('FIGHT').S.board); } catch (e) { return false; } }, null, { timeout: 60000 });
  await p.waitForTimeout(2500);
  const made = [];
  for (const [district, name] of PLACES) {
    const o = { seed: 7, speed: 1, kind: 'ruin', district, cell: { x: 31, y: 44 }, night: false };
    await p.evaluate(o => { window.FIGHT_OPTS = o; start(); }, o);
    await p.waitForTimeout(400);
    await p.waitForFunction(() => { const l = document.getElementById('load'); return l && l.style.display === 'none'; }, null, { timeout: 60000 });
    await p.waitForTimeout(2600);
    const info = await p.evaluate(() => { const F = eval('FIGHT'); return { bar: F.S.boardDef.name, blocks: F.S.boardDef.blocks }; });
    const fn = path.join(OUT, 'shot_' + district + '.png');
    await p.screenshot({ path: fn });
    made.push({ district, name, file: path.relative(ROOT, fn), bar: info.bar, blocks: info.blocks });
    console.log(district, info.bar, JSON.stringify(info.blocks));
  }
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(made, null, 1));
  await br.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
