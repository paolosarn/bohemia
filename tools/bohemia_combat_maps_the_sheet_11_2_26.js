#!/usr/bin/env node
/* COMBAT MAPS [every district its own] 11/2 -- THE SHEET: every new fight block on his upright phone (390 x 844, the driver's
   phone_portrait profile), by day and by night, in the LIVE fight (slices/BOHEMIA_FIGHT.html), each on its own named board, and
   each district deal that leads with it. One page, one start() a shot (the alpha's own restart door).
     node tools/bohemia_combat_maps_the_sheet_11_2_26.js <outdir>
   Writes <outdir>/shot_<kind>_<day|night>.png and the sheet the VOTE tab shows. */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'records/target/combat_maps_11_2b');
const SHOTS = [
  { kind: 'pass', district: 'mountain', name: 'THE PASS ROAD' }, { kind: 'canyon', district: 'springs', name: 'RED ROCK' },
  { kind: 'trailer', district: 'trailer', name: 'THE TRAILER PARK' }, { kind: 'golf', district: 'golf', name: 'THE GOLF COURSE' },
  { kind: 'marina', district: 'water', name: 'THE DRY MARINA' }, { kind: 'apron', district: 'airport', name: 'THE AIRPORT APRON' }
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
  await p.addInitScript(() => { window.FIGHT_OPTS = { seed: 5, speed: 1, board: 'pass', night: false }; try { localStorage.clear(); } catch (e) {} });
  await p.goto('http://localhost:' + port + '/slices/BOHEMIA_FIGHT.html', { waitUntil: 'load' });
  await p.waitForFunction(() => { try { return !!(eval('FIGHT').S.board); } catch (e) { return false; } }, null, { timeout: 60000 });
  await p.waitForTimeout(2500);
  const made = [];
  for (const s of SHOTS) for (const night of [false, true]) for (const how of ['board', 'district']) {
    const o = how === 'board' ? { seed: 5, speed: 1, board: s.kind, night } : { seed: 7, speed: 1, kind: 'ruin', district: s.district, cell: { x: 31, y: 44 }, night };
    await p.evaluate(o => { window.FIGHT_OPTS = o; start(); }, o);
    await p.waitForTimeout(400);   /* then the fight's own loading screen down, the ground drawn */
    await p.waitForFunction(() => { const l = document.getElementById('load'); return l && l.style.display === 'none'; }, null, { timeout: 60000 });
    await p.waitForTimeout(2200);
    const info = await p.evaluate(() => { const F = eval('FIGHT'); return { name: F.S.boardDef.name, blocks: F.S.boardDef.blocks }; });
    const fn = path.join(OUT, 'shot_' + s.kind + '_' + how + '_' + (night ? 'night' : 'day') + '.png');
    await p.screenshot({ path: fn });
    made.push({ kind: s.kind, how, night, file: path.relative(ROOT, fn), bar: info.name, blocks: info.blocks });
    console.log(s.kind, how, night ? 'night' : 'day', info.name);
  }
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(made, null, 1));
  await br.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
