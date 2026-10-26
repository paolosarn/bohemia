#!/usr/bin/env node
/* ============================================================================
   THE NUMERALS ON A SCREEN, COUNTED (UI THREE, row [icons not numbers, everywhere], 10/26/26; VAMILY rule 224(c), Paolo
   10/26: 'I'm tired of it just being numbers numbers numbers... more icons, more green up arrow, down red arrow, and the
   only number that matters is by how much').

   ONE COUNTER FOR BEFORE AND AFTER, so 'fewer numbers' is a number. A NUMERAL is a run of digits in a shown text node
   (shown: rendered with a size, not hidden, not see-through; a screen reader's hidden words are not shown). It counts the
   screens UI THREE's component reaches, the same way on any version:
     crew       the crew screen as it opens (YOU), the stranger's six (tools/bohemia_ui_company_screen_count.js)
     levelup    the crew screen on BOOKIE, his level waiting
     hall       the settlement's hall, its first card (BLUE DIAMOND, day 1)
     shop       the armourer, a shield tapped: its card with ON A MAN
   Each on his phone (390 x 844) and a computer (1440 x 900).

     node tools/bohemia_ui_three_numeral_count.js [--at <sha>]     # --at counts the screens as they were at that commit
   ============================================================================ */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http'), cp = require('child_process');
const ROOT = path.dirname(__dirname);
const T = require(path.join(ROOT, 'tools', 'bohemia_ui_company_screen_count.js'));
const at = (process.argv.indexOf('--at') >= 0) ? process.argv[process.argv.indexOf('--at') + 1] : null;
const FILES = ['slices/BOHEMIA_ROSTER_SCREEN.html', 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'];
const OVER = {};
if (at) FILES.forEach(f => { OVER['/' + f] = cp.execFileSync('git', ['show', at + ':' + f], { cwd: ROOT, maxBuffer: 64 << 20 }).toString(); });
const HOST = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
  + '<style>html,body{margin:0;height:100%;background:#120e0a}</style></head><body>'
  + '<script>window.BOH_START={picks:function(){return window.__PICKS;}};window.__PICKS=null;</script>'
  + '<script src="engine/bohemia_crew_door.js"></script></body></html>';
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (u === '/__host.html') { rs.setHeader('content-type', 'text/html'); return rs.end(HOST); }
  if (OVER[u]) { rs.setHeader('content-type', 'text/html'); return rs.end(OVER[u]); }
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
/* in the page: the numerals in shown text under a root */
const NUMERALS = sel => {
  const root = sel ? document.querySelector(sel) : document.body; if (!root) return { n: -1, list: [] };
  const shown = el => { const r = el.getBoundingClientRect(); if (!(r.width > 1 && r.height > 1)) return false;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; }
    return true; };
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), list = []; let t;
  while ((t = w.nextNode())) { const m = t.nodeValue.match(/\d+/g); if (!m || !t.parentElement || !shown(t.parentElement)) continue; list.push(...m); }
  return { n: list.length, list: list.slice(0, 80) };
};
const CO = [{ name: 'YOU', main: true, look: 'you', level: 1, stats: { hp: 57, fatigue: 95, resolve: 36, initiative: 106, melee_skill: 64, ranged_skill: 50, melee_defense: 7, ranged_defense: 7 }, stars: { resolve: 1, initiative: 2, ranged_defense: 1 }, perks: [], gear: { main: null, off: null, body: null, head: null } },
  { name: 'RAUL', look: 'you', level: 2, stats: { hp: 60, fatigue: 100, resolve: 40, initiative: 105, melee_skill: 55, ranged_skill: 40, melee_defense: 3, ranged_defense: 2 }, stars: { hp: 3, melee_defense: 2, fatigue: 1 }, perks: [], gear: { main: null, off: null, body: null, head: null } }];
(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r)); const port = srv.address().port;
  const { chromium } = require('playwright'); const b = await chromium.launch(); const out = {};
  for (const [name, prof] of Object.entries(T.PROFILES)) {
    const o = out[name] = {};
    { const ctx = await b.newContext(prof), page = await ctx.newPage();
      const fr = await T.openCrew(page, port);
      o.crew = await fr.evaluate(NUMERALS, null);
      const sel = await fr.evaluate(n => { const S = BohemiaRosterScreen.state, i = S.crew.findIndex(m => m.name === n); return '.cell[data-man="' + i + '"]'; }, T.THIRD);
      await fr.click(sel); await page.waitForTimeout(500);
      o.levelup = await fr.evaluate(NUMERALS, null);
      await ctx.close(); }
    { const ctx = await b.newContext(prof), p = await ctx.newPage();
      await p.addInitScript(co => { try { localStorage.setItem('bohemia.company.v1', JSON.stringify(co)); } catch (e) {} }, CO);
      await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
      await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && window.BohemiaRoster, null, { timeout: 30000 });
      const go = async bld => { await p.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click();
          BohemiaSettlement.open({ place: { name: 'BLUE DIAMOND', tier: 'town' }, traits: [], day: 1, batteries: 3000 }); }); await p.waitForTimeout(400);
        const hx = await p.evaluate(k => BohemiaSettlement.where(k), bld); if (hx) await p.mouse.click(hx.x, hx.y); await p.waitForTimeout(1500); };
      await go('hall');
      await p.waitForFunction(() => document.querySelectorAll('#sheet.on .hire .hceil').length > 0, null, { timeout: 15000 }).catch(() => {});
      await p.waitForTimeout(600);
      o.hall = await p.evaluate(NUMERALS, '#sheet.on .hire');
      await go('armourer');
      const n = await p.evaluate(() => (BohemiaSettlement.state.stock.armourer || []).findIndex(i => i.kind === 'shield'));
      if (n >= 0) { await p.click('#shelfgrid .slot:nth-child(' + (n + 1) + ')'); await p.waitForTimeout(700); }
      o.shop = await p.evaluate(NUMERALS, '#sbody .onman');
      await ctx.close(); }
  }
  await b.close(); srv.close();
  const brief = {}; Object.keys(out).forEach(p => { brief[p] = {}; Object.keys(out[p]).forEach(s => { brief[p][s] = out[p][s].n; }); });
  console.log(JSON.stringify({ at: at || 'working tree', numerals: brief, detail: out }, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
