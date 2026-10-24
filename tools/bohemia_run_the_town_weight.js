#!/usr/bin/env node
/* ============================================================================
   THE TOWN'S WEIGHT (RUN 10/24/26, row [the crash and the save], rule 141(e))

   The settlement screen alone, on his phone's profile, the way the gates open it: a camp, a town and a
   fortress, every building opened and every person tapped (the talk he did before the crash), then the
   decoded weight of every picture it holds, ONE COPY PER FILE, by the line that asked for it, and the
   canvases it keeps. The crash hunt (tools/bohemia_run_the_crash_hunt.js) found the screen held 340 MB
   of pictures after the talks; this names which.

     node tools/bohemia_run_the_town_weight.js [--out records/run/THE_TOWN_WEIGHT.json] [--budget MB]
   Exit 1 when --budget is given and the screen holds more than it.
   ============================================================================ */
'use strict';
const path = require('path'), fs = require('fs'), http = require('http');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = path.dirname(__dirname);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg('out', null), BUDGET = arg('budget', null);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.css': 'text/css' };
const ARM = `(() => {
  const L = window.__IMS = [];
  const site = () => { try { return new Error().stack.split('\\n').slice(3, 4).join('').replace(/https?:\\/\\/[^/]+\\//g, '').replace(/\\s+/g, ' ').trim().slice(0, 120); } catch (e) { return '?'; } };
  const I0 = window.Image; window.Image = function (...a) { const im = new I0(...a); L.push({ r: new WeakRef(im), at: site() }); return im; }; window.Image.prototype = I0.prototype;
  const ce = Document.prototype.createElement; window.__CVS = [];
  Document.prototype.createElement = function (t, o) { const e = ce.call(this, t, o); const n = String(t).toLowerCase();
    if (n === 'img') L.push({ r: new WeakRef(e), at: site() }); if (n === 'canvas') window.__CVS.push({ r: new WeakRef(e), at: site() }); return e; };
})();`;
(async () => {
  /* the screen inside a frame, the way the map hosts it (the map hides the frame on LEAVE, it never unloads it) */
  const WRAP = '<!doctype html><html><body style="margin:0"><iframe id="settleFrame" src="BOHEMIA_SETTLEMENT_SCREEN.html" style="position:fixed;inset:0;width:100%;height:100%;border:0"></iframe></body></html>';
  const srv = http.createServer((q, s) => { if (q.url.split('?')[0] === '/slices/__wrap.html') { s.writeHead(200, { 'Content-Type': 'text/html' }); return s.end(WRAP); }
    const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(s); });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const PORT = srv.address().port;
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ctx.addInitScript({ content: ARM });
  const top = await ctx.newPage(); const errs = []; top.on('pageerror', e => errs.push(e.message));
  const cdp = await ctx.newCDPSession(top);
  await top.goto('http://127.0.0.1:' + PORT + '/slices/__wrap.html', { waitUntil: 'load' });
  const p = await (await top.$('#settleFrame')).contentFrame();
  p.mouse = top.mouse; p.waitForTimeout = (ms) => top.waitForTimeout(ms); p.click = (sel) => p.$(sel).then(h => h.click());
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.folk().length > 0, null, { timeout: 30000 });
  const close = async () => { if (await p.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await p.click('#close'); await p.waitForTimeout(200); } };
  let taps = 0;
  for (const tier of ['camp', 'town', 'fortress']) {
    await close();
    await p.evaluate(t => BohemiaSettlement.open({ place: { name: 'WEIGHT ' + t.toUpperCase(), tier: t }, traits: [], day: 4 }), tier);
    await p.waitForTimeout(500);
    await p.waitForFunction(() => BohemiaSettlement.ready() && BohemiaSettlement.folk().length > 0, null, { timeout: 15000 }).catch(() => {});
    for (const k of await p.evaluate(() => BohemiaSettlement.order())) {
      await close(); const xy = await p.evaluate(k => BohemiaSettlement.where(k), k); if (!xy) continue;
      await p.mouse.click(xy.x, xy.y); taps++; await p.waitForTimeout(700);
    }
    const n = await p.evaluate(() => BohemiaSettlement.folk().length);
    for (let i = 0; i < n; i++) {
      await close();
      const pt = await p.evaluate(i => { const q = BohemiaSettlement.folk()[i]; if (!q || q.keeper) return null; const s0 = BohemiaSettlement.scale(); BohemiaSettlement.where('stall');
        const v = BohemiaSettlement._view(), r = document.getElementById('scene').getBoundingClientRect();
        return { x: r.left + v.ox + q.x * v.s, y: r.top + v.oy + (q.y - s0.person * 0.45) * v.s }; }, i);
      if (!pt) continue; await p.mouse.click(pt.x, pt.y); taps++; await p.waitForTimeout(400);
    }
  }
  await close(); await p.waitForTimeout(1500);
  const weigh = async () => { await cdp.send('HeapProfiler.collectGarbage'); await p.waitForTimeout(300); await cdp.send('HeapProfiler.collectGarbage'); return p.evaluate(() => {
    const files = {}, at = {};
    window.__IMS.forEach(x => { const o = x.r.deref(); if (!o || !o.naturalWidth) return; const u = (o.currentSrc || o.src).replace(/^https?:\/\/[^/]+\//, ''); if (files[u]) return;
      const mb = o.naturalWidth * o.naturalHeight * 4 / 1048576; files[u] = { mb: +mb.toFixed(2), wh: o.naturalWidth + 'x' + o.naturalHeight, at: x.at }; at[x.at] = (at[x.at] || 0) + mb; });
    const cv = window.__CVS.map(x => x.r.deref()).filter(Boolean);
    return { files: Object.keys(files).length, MB: +Object.values(files).reduce((s, f) => s + f.mb, 0).toFixed(1),
      bySite: Object.entries(at).map(([k, v]) => [k, +v.toFixed(1)]).sort((a, b) => b[1] - a[1]).slice(0, 10),
      byDir: Object.entries(Object.keys(files).reduce((m, u) => { const d = u.replace(/[^/]+$/, ''); m[d] = (m[d] || 0) + files[u].mb; return m; }, {})).map(([k, v]) => [k, +v.toFixed(1)]).sort((a, b) => b[1] - a[1]).slice(0, 8),
      biggest: Object.entries(files).sort((a, b) => b[1].mb - a[1].mb).slice(0, 12).map(([u, f]) => [u, f.wh, f.mb, f.at]),
      canvases: cv.length, canvasMB: +(cv.reduce((s, c) => s + c.width * c.height * 4, 0) / 1048576).toFixed(1) };
  }); };
  const W = await weigh();
  /* LEAVE: the map hides the frame; what does the screen still hold on the map */
  await top.evaluate(() => { document.getElementById('settleFrame').style.display = 'none'; });
  await p.waitForTimeout(2500);
  const A = await weigh();
  W.afterLeave = { files: A.files, MB: A.MB, canvases: A.canvases, canvasMB: A.canvasMB, letGo: await p.evaluate(() => window.__TOWN_LET_GO | 0) };
  W.taps = taps; W.errors = errs.slice(0, 5);
  console.log(JSON.stringify(W, null, 1));
  if (OUT) fs.writeFileSync(path.resolve(OUT), JSON.stringify(W, null, 1));
  await b.close(); srv.close();
  console.log('HELD WITH THE TOWN OPEN: ' + W.files + ' files, ' + W.MB + ' MB; AFTER LEAVE: ' + W.afterLeave.files + ' files, ' + W.afterLeave.MB + ' MB');
  if (BUDGET && W.MB > +BUDGET) { console.log('OVER BUDGET: ' + W.MB + ' MB > ' + BUDGET); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });
