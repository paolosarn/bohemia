#!/usr/bin/env node
/* ============================================================================
   THE PIECE THAT ANSWERS IT, ON HIS PHONE (WORLD THIRTEEN 11/11, rule 429(a)(b)(c)): the fight page on a phone, a fight started
   the way one on the map asks for its board (the map kind, the table's kind), one per map kind, a picture of each at the start.
     node tools/bohemia_world_thirteen_piece_shots.js OUTDIR [kind,kind,...]
   ============================================================================ */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2], KINDS = (process.argv[3] || 'suburb,industrial,casino,wash,airport,apartment').split(',');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.css': 'text/css', '.woff2': 'font/woff2' };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const { chromium } = require('playwright');
  const srv = http.createServer((q, r) => {
    const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
  }).listen(0);
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  await p.addInitScript(() => { window.FIGHT_OPTS = { seed: 5, speed: 1, board: 'desert', night: false }; try { localStorage.clear(); } catch (e) {} });
  await p.goto('http://localhost:' + srv.address().port + '/slices/BOHEMIA_FIGHT.html', { waitUntil: 'load' });
  await p.waitForFunction(() => { try { return !!(eval('FIGHT').S.board) && !!window.BohemiaFightKinds; } catch (e) { return false; } }, null, { timeout: 120000 });
  const said = {};
  for (const [i, d] of KINDS.entries()) {
    const pc = await p.evaluate((d) => window.BohemiaFightKinds.piece(d), d);
    await p.evaluate((o) => { window.FIGHT_OPTS = o; start(); }, { seed: 4100 + i, speed: 1, kind: pc.deal.kind, district: d, cell: { gx: 40, gy: 40 }, night: false, auto: false });
    await p.waitForFunction(() => { const l = document.getElementById('load'); return l && l.style.display === 'none'; }, null, { timeout: 90000 }).catch(() => {});
    await p.waitForTimeout(2500);
    const B = await p.evaluate(() => { const S = eval('FIGHT').S, B = S.boardDef || {}; return { blocks: B.blocks || [], own: !!B.own, name: B.name || null }; });
    said[d] = { piece: pc, dealt: B };
    const f = path.join(OUT, 'PIECE_' + d.toUpperCase() + '.png');
    await p.screenshot({ path: f });
    console.log('  ' + d + ': ' + JSON.stringify(B.blocks) + '  ' + f);
  }
  fs.writeFileSync(path.join(OUT, 'pieces.json'), JSON.stringify(said, null, 1));
  await br.close(); srv.close();
})().catch((e) => { console.error(e); process.exit(1); });
