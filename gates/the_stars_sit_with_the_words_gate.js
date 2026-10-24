/* THE STARS SIT WITH THE WORDS GATE (RUN TWO [the stars sit with the words], rule 146(e), 10/24/26).
   PAOLO 10/24: 'we already have stars showing how high class a hire can be, so jobs should just have stars as well; but
   even on the hire screen the stars are a little too big and not nicely put with the UI's letters, so make the stars
   smaller too.' MEASURED before: a 10-point star against capitals 7 to 8 tall, centred or dropped a point under the line,
   touching the number. On his phone's profile (390 x 844 at 3x), on the hall's hire cards and on a man's page:
     S1 every star is drawn (no typed star left) and is ONE size, 7 points, no taller than the capitals beside it
     S2 every star stands on the words' baseline (its foot within half a point of the letters' foot)
     S3 every star has a point or more of air after the number before it, and a star never touches the next one
     S4 the same star a job uses: BohemiaMaterials.stars(n) hands n of that star, the same picture, ink or gold
   Run: node gates/the_stars_sit_with_the_words_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8894;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
/* every drawn star under root: its size, its foot against the letters' foot, the air after the number, the capitals' height */
const MEASURE = (sel) => {
  const out = [];
  document.querySelectorAll(sel + ' .bmstar').forEach(st => {
    const par = st.parentNode, cs = getComputedStyle(par.nodeType === 1 ? par : par.parentNode);
    const probe = document.createElement('i'); probe.style.cssText = 'display:inline-block;width:0;height:0;margin:0;padding:0';
    par.insertBefore(probe, st); const base = probe.getBoundingClientRect().bottom; probe.remove();
    const r = st.getBoundingClientRect();
    const c = document.createElement('canvas').getContext('2d'); c.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    const cap = c.measureText('H').actualBoundingBoxAscent;
    /* the character before it: a star after a star, or the number's last glyph */
    let prev = st.previousSibling, gap = null;
    if (prev && prev.nodeType === 1 && prev.classList.contains('bmstar')) gap = r.left - prev.getBoundingClientRect().right;
    else {
      let t = prev; while (t && !(t.nodeType === 3 && t.nodeValue.trim())) t = t.previousSibling;
      if (!t && par.previousSibling) { t = par.previousSibling; if (t.nodeType !== 3) t = null; }   /* a .stars span after the number's text */
      if (t) { const s = t.nodeValue, k = s.replace(/\s+$/, '').length; if (k > 0) { const rg = document.createRange(); rg.setStart(t, k - 1); rg.setEnd(t, k); gap = r.left - rg.getBoundingClientRect().right; } }
    }
    out.push({ w: +r.width.toFixed(2), h: +r.height.toFixed(2), foot: +(r.bottom - base).toFixed(2), cap: +cap.toFixed(2), gap: gap == null ? null : +gap.toFixed(2), after: !!(prev && prev.nodeType === 1 && prev.classList.contains('bmstar')),
      img: getComputedStyle(st).backgroundImage.slice(0, 80) });
  });
  return { stars: out, typed: (document.querySelector(sel) ? document.querySelector(sel).textContent.match(/★/g) || [] : []).length };
};
const judge = (where, m) => {
  const s = m.stars;
  ok(where + ' S1 every star drawn (none typed), one size, 7 points, no taller than the capitals beside it',
     s.length > 0 && m.typed === 0 && s.every(x => Math.round(x.w) === 7 && Math.round(x.h) === 7 && x.h <= x.cap + 0.5),
     s.length + ' stars, ' + [...new Set(s.map(x => x.w + 'x' + x.h + ' (caps ' + x.cap + ')'))].join(', ') + ', ' + m.typed + ' typed');
  ok(where + ' S2 every star stands on the words\' baseline', s.every(x => Math.abs(x.foot) <= 0.5), [...new Set(s.map(x => x.foot))].join(', '));
  ok(where + ' S3 a point of air after the number; a star never touches the next', s.every(x => x.gap != null && x.gap >= (x.after ? 0.9 : 1.9)), s.map(x => x.gap).join(','));
};
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const errs = [];
  /* the hall's hire cards */
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push('settlement: ' + e.message));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.traitsIn(), null, { timeout: 30000 });
  await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'HENDERSON' }, traits: [], night: false, batteries: 999 }));
  for (let k = 0; k < 6; k++) { await p.waitForTimeout(400); if (await p.evaluate(() => BohemiaSettlement.state.open === 'hall' && document.querySelectorAll('#sbody .hire .bmstar').length > 0)) break;
    const w = await p.evaluate(() => BohemiaSettlement.where('hall')); if (w) await p.mouse.click(w.x, w.y); }
  await p.evaluate(() => document.fonts && document.fonts.ready); await p.waitForTimeout(500);
  judge('THE HALL:', await p.evaluate(MEASURE, '#sbody'));
  /* S4 the job's star: the same picture */
  const four = await p.evaluate(() => { const M = window.BohemiaMaterials; if (!M || !M.stars) return null; const h = document.createElement('div'); h.style.cssText = 'font:10px BohemiaCasing';
    h.textContent = 'A JOB'; const a = M.stars(3), k = M.stars(2, { ink: true }); h.appendChild(a); h.appendChild(k); document.getElementById('sbody').appendChild(h);
    const one = document.querySelector('#sbody .hire .hstats .bmstar'), bg = e => getComputedStyle(e).backgroundImage;
    const r = { gold: a.querySelectorAll('.bmstar').length, ink: k.querySelectorAll('.bmstar').length, sizes: [...h.querySelectorAll('.bmstar')].map(e => Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height)),
      sameInk: [...k.querySelectorAll('.bmstar')].every(e => bg(e) === bg(one)), label: a.getAttribute('aria-label') };
    h.remove(); return r; });
  ok('S4 THE SAME STAR A JOB USES: BohemiaMaterials.stars(n) hands n of it, 7 points, the hall\'s own ink picture', four && four.gold === 3 && four.ink === 2 && four.sizes.every(s => s === '7x7') && four.sameInk && four.label === '3 stars', JSON.stringify(four));
  /* a man's page */
  const q = await ctx.newPage(); q.on('pageerror', e => errs.push('crew: ' + e.message));
  await q.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
  await q.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready && document.querySelectorAll('#card .bmstar').length > 0, null, { timeout: 30000 });
  await q.evaluate(() => document.fonts && document.fonts.ready); await q.waitForTimeout(500);
  judge('HIS PAGE:', await q.evaluate(MEASURE, '#card'));
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE STARS SIT WITH THE WORDS GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
