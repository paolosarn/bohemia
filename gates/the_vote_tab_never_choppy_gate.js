#!/usr/bin/env node
/* THE VOTE TAB IS NEVER CHOPPY (WORDS THREE 11/26/26; VAMILY rule 480(c)(d), Paolo 11/26: 'make sure fps is never choppy for
   nothing'; the coordinator's round: 'the VOTE tab opens and scrolls the sheets with no hitch'; ask row 723)
   MEASURED BEFORE (the real tab, a phone 390 x 844 with the CPU slowed four times, his homework sheets behind MORE):
     the open had 3 to 5 frames past 50 ms, worst 167 to 867 ms: the 1.9 MB registry turned from bytes into text in one task (89 ms),
     the first cards built and laid out in one frame (67 to 83 ms), and the YES list under the comment box, 608 lines and 36,000 px
     far under the fold, laid out in one frame (170 to 230 ms); tapping MORE held one frame 167 to 183 ms. Scrolling the sheets was
     already 60 fps.
   NOW (slices/BOHEMIA_VOTE_TAB.html): a card and a YES line are laid out only near the glass (content-visibility); the registry is read
   and turned to text off the screen's thread and parsed a frame later; the first cards are built off the page and put on the glass a
   card a frame; MORE the same.
   This gate walks the real tab the way a thumb does, on the slowed phone:
     N1  OPEN: no frame past 50 ms, and 55 frames a second or better, from the first frame until a second after the cards are up
     N2  DOWN: a thumb scrolling the first screen's cards down to MORE: the same
     N3  MORE: the tap on MORE and the second after it: the same
     N4  THE SHEETS: scrolling every homework card behind MORE (his sheets) to the last one: the same
     N5  the fixes are in the page (a card and a YES line laid out near the glass; the read off the thread; the first draw and MORE
         in frames), each by its own words
     N6  no page error
     P   PLANT: the same tab with the near-the-glass layout taken out and the drawing put back in one frame is served instead; the open
         goes red (the YES list alone is a frame of 100 ms or more)
   A FRAME PAST 50 MS: the screen draws 60 times a second, so a frame is read from the page's own frame clock; three refreshes read
   50.0 to 50.1 ms on that clock, so a frame counts as a hitch past 50.5 ms. A walk with a hitch is walked once more; red only when
   both walks hitch in the same part (one machine's hiccup is not the page's).
   A browser, its own small server, under a minute.   node gates/the_vote_tab_never_choppy_gate.js
   __BOHEMIA_SOLO__ (a gate whose subject is time runs with the box to itself) */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.join(__dirname, '..');
const TAB = 'slices/BOHEMIA_VOTE_TAB.html';
let pass = 0, fail = 0;
const ok = (n, g, why) => { console.log((g ? '  ok   ' : '  FAIL ') + n + (why ? '  [' + why + ']' : '')); g ? pass++ : fail++; };
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.css': 'text/css', '.txt': 'text/plain' };
const HITCH = 50.5, FPS = 55;

function serve(plantHtml) {
  return new Promise(res => {
    const srv = http.createServer((q, r) => {
      const rel = decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/, '');
      if (plantHtml && rel === TAB) { r.setHeader('content-type', 'text/html'); return r.end(plantHtml); }
      const f = path.join(ROOT, rel);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.statusCode = 404; return r.end('no'); }
      r.setHeader('content-type', TYPES[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(r);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}

async function walk(br, port, openOnly) {
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
  const pg = await ctx.newPage(), errs = [];
  pg.on('pageerror', e => errs.push(String(e)));
  const cdp = await ctx.newCDPSession(pg); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await pg.addInitScript(() => {
    window.__F = []; window.__phase = 'open'; let last = null;
    const tick = t => { if (last !== null) window.__F.push([window.__phase, t - last]); last = t; requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  const phase = p => pg.evaluate(x => { window.__phase = x; }, p);
  await pg.goto('http://127.0.0.1:' + port + '/' + TAB, { waitUntil: 'load' });
  await pg.waitForFunction(() => window.__voteReady === true, null, { timeout: 60000 }).catch(() => {});
  await pg.waitForTimeout(1200);
  let sheets = 0;
  if (!openOnly) {
    await phase('down');
    for (let i = 0; i < 400; i++) {
      const t = await pg.evaluate(() => { const f = document.getElementById('fold'); return f && !f.hidden ? f.getBoundingClientRect().top : -1; });
      if (t < 600) break; await pg.mouse.wheel(0, 120); await pg.waitForTimeout(16);
    }
    await pg.waitForTimeout(800);
    const fb = await pg.evaluate(() => { const f = document.getElementById('fold'); if (!f || f.hidden) return null; const r = f.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
    await phase('more');
    if (fb) await pg.touchscreen.tap(fb[0], fb[1]);
    await pg.waitForTimeout(1200);
    sheets = await pg.evaluate(() => document.querySelectorAll('#more .row[data-id^="words-two-hw"]').length);
    await phase('sheets');
    for (let i = 0; i < 600; i++) {
      const b = await pg.evaluate(() => { const rs = document.querySelectorAll('#more .row[data-id^="words-two-hw"]'); const r = rs[rs.length - 1]; return r ? r.getBoundingClientRect().bottom : 0; });
      if (b < 800) break; await pg.mouse.wheel(0, 120); await pg.waitForTimeout(16);
    }
    await pg.waitForTimeout(800);
  }
  await phase('end');
  const F = await pg.evaluate(() => window.__F);
  await ctx.close();
  const out = {};
  for (const p of ['open', 'down', 'more', 'sheets']) {
    const ds = F.filter(f => f[0] === p).map(f => f[1]).slice(1);
    if (!ds.length) continue;
    const sum = ds.reduce((a, b) => a + b, 0);
    out[p] = { frames: ds.length, fps: +(1000 * ds.length / sum).toFixed(1), worst: +Math.max(...ds).toFixed(1), hitches: ds.filter(d => d > HITCH).map(d => Math.round(d)) };
  }
  return { out, errs, sheets };
}
const bad = w => w && (w.hitches.length > 0 || w.fps < FPS);
const say = w => w ? w.fps + ' fps, worst ' + w.worst + ' ms' + (w.hitches.length ? ', past 50: ' + w.hitches.join(' ') : '') : 'not walked';

(async () => {
  let chromium; try { ({ chromium } = require('playwright')); } catch (e) { ok('a browser to walk the tab in (playwright)', false, String(e.message)); process.exit(1); }
  const html = fs.readFileSync(path.join(ROOT, TAB), 'utf8');
  const br = await chromium.launch();
  const srv = await serve(null), port = srv.address().port;
  let A = await walk(br, port, false), B = null;
  const parts = ['open', 'down', 'more', 'sheets'];
  if (parts.some(p => bad(A.out[p]))) B = await walk(br, port, false);
  const names = { open: 'N1 OPEN', down: 'N2 DOWN to MORE', more: 'N3 the tap on MORE', sheets: 'N4 THE SHEETS behind MORE' };
  for (const p of parts) {
    const a = A.out[p], b = B && B.out[p];
    const red = !a || (bad(a) && (!B || bad(b)));
    ok(names[p] + ': no frame past 50 ms, ' + FPS + ' fps or better (' + say(a) + (b ? '; walked again: ' + say(b) : '') + ')' + (p === 'sheets' ? ', ' + A.sheets + ' homework cards' : ''), !red);
  }
  const fixes = [
    ['a card laid out near the glass', /\.row\{\s*content-visibility:auto/],
    ['a YES line laid out near the glass', /#yeses \.yl\{\s*content-visibility:auto/],
    ['the registry read off the screen\'s thread', /new Worker\(/],
    ['the first draw a card a frame', /function firstDraw\(/],
    ['MORE a card a frame', /function revealMore\(/],
  ];
  const missing = fixes.filter(f => !f[1].test(html)).map(f => f[0]);
  ok('N5 the fixes are in the page (' + fixes.map(f => f[0]).join('; ') + ')', missing.length === 0, missing.join(', '));
  ok('N6 no page error', A.errs.length === 0 && (!B || B.errs.length === 0), A.errs.concat(B ? B.errs : []).slice(0, 2).join(' | '));
  srv.close();
  /* the plant: near-the-glass layout out, and every frame trick off (a page that draws no frames takes the old one-frame way) */
  const plant = html.replace(/content-visibility:auto;?/g, '').replace("var FRAMES = typeof requestAnimationFrame === 'function';", 'var FRAMES = false;');
  const psrv = await serve(plant);
  const P = await walk(br, psrv.address().port, true);
  psrv.close();
  const pw = P.out.open;
  const caught = plant !== html && !!pw && pw.hitches.some(h => h >= 100);
  ok('P  PLANT: the tab with the fixes taken out is caught at the open (' + say(pw) + ')', caught, caught ? '' : plant === html ? 'the plant did not change the page' : 'no frame of 100 ms or more');
  await br.close();
  console.log('\n=== THE VOTE TAB IS NEVER CHOPPY: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
