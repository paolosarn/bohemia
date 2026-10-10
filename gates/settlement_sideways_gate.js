/* THE SETTLEMENT ON ITS SIDE GATE (RUN TWO, row [the sideways band], 10/10/26).
   UI's review: on a phone lying on its side the settlement picture was capped by the height and left
   flat page-colour bands at both edges (his NO: 'the brown-grey sides'). Now a wider glass fills the
   width and crops top and bottom, and a drag moves both ways. Measured the way UI's sideways gate
   measures the map: the outer 6 points at each edge vary like the picture and almost none is the page
   colour, on its side and upright, every tier; every building still opens with a tap. Writes the
   before/after picture at his phone's pixels (rule 89): slices/vote/RUN2_THE_SIDEWAYS_BAND_10_10.png.
   Run: node gates/settlement_sideways_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8867;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
async function edges(p) {
  const png = (await p.screenshot()).toString('base64');
  return p.evaluate(async png => {
    const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const sc = im.width / innerWidth, B = getComputedStyle(document.body).backgroundColor.match(/\d+/g).map(Number);
    const sc0 = document.getElementById('scene').getBoundingClientRect(), top = Math.ceil(sc0.top + 2), h = Math.floor(sc0.height - 4);
    const strip = x0 => { const d = g.getImageData(Math.round(x0 * sc), Math.round(top * sc), Math.round(6 * sc), Math.round(h * sc)).data;
      let n = 0, s = 0, s2 = 0, page = 0; for (let i = 0; i < d.length; i += 4) { const l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; n++; s += l; s2 += l * l;
        if (Math.abs(d[i] - B[0]) <= 4 && Math.abs(d[i + 1] - B[1]) <= 4 && Math.abs(d[i + 2] - B[2]) <= 4) page++; }
      const mean = s / n; return { spread: +Math.sqrt(Math.max(0, s2 / n - mean * mean)).toFixed(1), page: +(page / n).toFixed(3) }; };
    return { left: strip(0), right: strip(innerWidth - 6) };
  }, png);
}
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch(); const errs = [], shots = {};
  for (const prof of [{ n: 'on its side', w: 844, h: 390 }, { n: 'upright', w: 390, h: 844 }]) {
    /* the before is the screen as it was before the fix (git show 1dc4a712:slices/BOHEMIA_SETTLEMENT_SCREEN.html saved as
       slices/__before_settlement.html); without it the gate measures the after alone and keeps the last picture */
    const files = fs.existsSync(path.join(ROOT, 'slices/__before_settlement.html')) ? ['__before_settlement.html', 'BOHEMIA_SETTLEMENT_SCREEN.html'] : ['BOHEMIA_SETTLEMENT_SCREEN.html'];
    for (const file of files) {
      const ctx = await b.newContext({ viewport: { width: prof.w, height: prof.h }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
      const p = await ctx.newPage(); if (file[0] !== '_') p.on('pageerror', e => errs.push(e.message));
      await p.goto('http://127.0.0.1:' + PORT + '/slices/' + file, { waitUntil: 'load' });
      await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
      await p.waitForTimeout(1200);
      const before = file[0] === '_';
      if (before) { if (prof.w > prof.h) shots.before = await p.screenshot(); await ctx.close(); continue; }
      for (const tier of ['camp', 'town', 'fortress']) {
        await p.evaluate(t => BohemiaSettlement.open({ place: { tier: t, name: 'X ' + t }, traits: [] }), tier); await p.waitForTimeout(700);
        const e = await edges(p), cov = await p.evaluate(() => { const v = BohemiaSettlement._view(); return { l: v.ox, r: v.ox + v.pw * v.s, W: v.W, t: v.oy, b: v.oy + v.ph * v.s, H: v.H }; });
        /* the band was the page colour beside a picture that stopped short; the picture's own plain sand is not a band,
           so the test is: the picture reaches both edges, and the outer 6 points are not the page colour */
        const side = prof.w > prof.h;
        ok(prof.n + ', ' + tier + ': the picture reaches both edges, no page colour beside it', cov.l <= 0.5 && cov.r >= cov.W - 0.5 && (!side || (e.left.page < 0.05 && e.right.page < 0.05)) && (!side || (cov.t <= 0.5 && cov.b >= cov.H - 0.5)),
           'picture ' + Math.round(cov.l) + '..' + Math.round(cov.r) + ' of ' + cov.W + ', page colour ' + e.left.page + '/' + e.right.page + ', spread ' + e.left.spread + '/' + e.right.spread);
        if (tier === 'town' && prof.w > prof.h) shots.after = await p.screenshot();
        const order = await p.evaluate(() => BohemiaSettlement.order()); let landed = 0;
        for (const k of order) {
          await p.evaluate(() => { const c = document.getElementById('close'); if (c && c.offsetParent) c.click(); }); await p.waitForTimeout(120);
          await p.evaluate(k => BohemiaSettlement.where(k), k); await p.waitForTimeout(200);
          const pt = await p.evaluate(k => BohemiaSettlement.where(k), k);
          const vis = pt.x > 0 && pt.y > 0 && pt.x < prof.w && pt.y < prof.h;
          if (vis) { await p.mouse.click(pt.x, pt.y); await p.waitForTimeout(250); }
          if (vis && await p.evaluate(() => BohemiaSettlement.state.open) === k) landed++; else console.log('     missed ' + k);
        }
        ok('  every building is reachable and opens with a tap', landed === order.length, landed + ' of ' + order.length);
      }
      await ctx.close();
    }
  }
  if (shots.before) {
  /* the before/after at his phone's pixels, side by side in one picture (rule 89) */
  const ctx = await b.newContext({ viewport: { width: 844, height: 820 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.setContent('<body style="margin:0;background:#000;color:#fff;font:bold 14px monospace"><div>BEFORE</div><img id=a style="width:844px"><div>AFTER</div><img id=b style="width:844px"></body>');
  await p.evaluate(s => { document.getElementById('a').src = 'data:image/png;base64,' + s.a; document.getElementById('b').src = 'data:image/png;base64,' + s.b; }, { a: shots.before.toString('base64'), b: shots.after.toString('base64') });
  await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(ROOT, 'slices/vote/RUN2_THE_SIDEWAYS_BAND_10_10.png'), fullPage: true });
  }
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE SETTLEMENT ON ITS SIDE GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
