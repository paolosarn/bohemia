#!/usr/bin/env node
/* THE CUT, ON HIS PHONE (WORLD THIRTEEN 11/11, rule 429(a)(c)): the fight page on a phone dealt the airport's board without the map's place
   (before: its blocks shuffled) and with it (now: its own board as the map has it). node tools/bohemia_world_thirteen_cut_shots.js OUTDIR */
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = '/home/user/bohemia', OUT = process.argv[2];
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.css': 'text/css', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg' };
(async () => {
  const { chromium } = require('playwright');
  const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }).listen(0);
  const br = await chromium.launch(), ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }), p = await ctx.newPage();
  await p.addInitScript(() => { window.FIGHT_OPTS = { seed: 5, speed: 1, board: 'desert', night: false }; try { localStorage.clear(); } catch (e) {} });
  await p.goto('http://localhost:' + srv.address().port + '/slices/BOHEMIA_FIGHT.html', { waitUntil: 'load' });
  await p.waitForFunction(() => { try { return !!(eval('FIGHT').S.board); } catch (e) { return false; } }, null, { timeout: 120000 });
  for (const [name, tpl] of [['BEFORE', null], ['AFTER', { id: 'airport', board: 'place_airport', tx: 9, ty: 6, flip: false, cell: [7, 7] }]]) {
    await p.evaluate((o) => { window.FIGHT_OPTS = o; start(); }, Object.assign({ seed: 4242, speed: 1, kind: 'ruin', district: 'airport', cell: { gx: 7, gy: 7 }, night: false, auto: false }, tpl ? { template: tpl } : {}));
    await p.waitForFunction(() => { const l = document.getElementById('load'); return l && l.style.display === 'none'; }, null, { timeout: 90000 }).catch(() => {});
    await p.waitForTimeout(2500);
    console.log(name, JSON.stringify(await p.evaluate(() => { const B = eval('FIGHT').S.boardDef; return { own: B.own, blocks: B.blocks }; })));
    await p.screenshot({ path: path.join(OUT, 'CUT_' + name + '.png') });
  }
  await br.close(); srv.close();
})().catch((e) => { console.error(e); process.exit(1); });
