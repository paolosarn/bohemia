/* ==========================================================================
   THE FINGER SETS THE BEAT  (FIXES 3, 11/26/26, ask row 726, FOUND BY EYES 11/26 on a phone slowed 4x; VAMILY rules 480(c), 482, 441)

   EYES MEASURED: 'Tap it twice to buy' at a town's stall timed the two taps by when the page HANDLED them (performance.now(), a 450 ms
   beat), not when the finger landed: at 4x three quick double taps 150 ms apart were handled 510, 440 and 473 ms apart, so one bought
   and two did nothing. The same clock stood under every 'tap it twice' in the town (the shop, the stall, the stall's gear, the trade
   goods) and the end screen's loot ('tap it twice to take it').
   THE LAW (__THE_FINGER_SETS_THE_BEAT__, slices/BOHEMIA_SETTLEMENT_SCREEN.html and slices/BOHEMIA_SPOILS_SCREEN.html fingerAt): a real tap
   is timed by its own finger (the click's timeStamp, stamped by the browser when the finger lifted), however late the page handles it.

   THE SLOW PHONE, MADE ON PURPOSE: every click in the page waits 500 ms before its own handler runs (the slow re-render a slowed phone
   pays after each tap), and each double tap is two real touches stamped 150 ms apart by the phone's own input clock (CDP's timestamp).
   LEGS (the demo upright, a NEW GAME, the first town's stall; the end screen on its own page)
     B1 three double taps on the tape roll's BUY: three rolls bought
     B2 one tap alone buys nothing (it lights the box); two taps 700 ms apart by the finger buy nothing
     L1 the end screen: three double taps on the first piece on the ground: three pieces taken into the stash
     P1 PLANTED (the old clock, the handling time): B1's three double taps buy at most one, and L1's take at most one; the leg sees it
     Z  nothing threw
   node gates/the_finger_sets_the_beat_gate.js   (about 2 min)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), http = require('http'), zlib = require('zlib');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const { chromium } = require('playwright');
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const OLD = s => s.replace('return e && e.isTrusted && e.timeStamp > 0', 'return false && e && e.isTrusted && e.timeStamp > 0');   /* the plant: the handling time */
const TOWN = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'), 'utf8'), SPOILS = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SPOILS_SCREEN.html'), 'utf8');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'finger-'));
const TOWN_OLD = path.join(TMP, 'BOHEMIA_SETTLEMENT_SCREEN.html'); fs.writeFileSync(TOWN_OLD, OLD(TOWN));
/* the slow phone: every click waits 500 ms before its handler (the page's own work after a tap, as a slowed phone pays it) */
const SLOW = () => { if (window.__SLOW_ON) return; window.__SLOW_ON = true; document.addEventListener('click', function () { const t = performance.now(); while (performance.now() - t < 500) {} }, true); };
/* a double tap by the phone's own clock: two touches 'gap' seconds apart, each lifted 40 ms after it lands, sent without waiting */
async function doubleTap(cdp, x, y, gap) {
  const t0 = Date.now() / 1000, all = [];
  for (const t of gap == null ? [t0] : [t0, t0 + gap]) {
    all.push(cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }], timestamp: t }));
    all.push(cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [], timestamp: t + 0.04 }));
  }
  await Promise.all(all);
}
async function stall(planted) {
  const d = await drive.open({ profile: 'phone_portrait', keepCards: true, serve: planted ? { '/slices/BOHEMIA_SETTLEMENT_SCREEN.html': TOWN_OLD } : {}, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  const out = { errs: [] };
  try {
    d.page.on('pageerror', e => out.errs.push(String(e && e.message || e).slice(0, 160)));
    await d.page.waitForTimeout(3000);
    await d.fr.evaluate(() => { loopSettleBats(Math.max(loopBats(), 400), 'the gate'); });
    await d.fr.evaluate(() => { const bs = ctBases(), names = Object.keys(bs), t0 = names.find(k => /church/i.test(k)) || names[0], t = { name: t0, x: bs[t0].x, y: bs[t0].y, tier: mapTierOf(t0) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
    let sf = null; for (let k = 0; k < 60 && !sf; k++) { await d.page.waitForTimeout(300);
      for (const x of d.page.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && !!BohemiaSettlement.tape(); } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } }
    if (!sf) { out.why = 'no town'; return out; }
    await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {});
    const fb = async () => (await sf.frameElement()).boundingBox();
    for (let i = 0; i < 6; i++) { if (await sf.evaluate(() => BohemiaSettlement.state.open === 'stall' && !!document.querySelector('#sbody [data-good=tape]'))) break;
      const w = await sf.evaluate(() => BohemiaSettlement.where('stall')); const b = await fb(); if (w) await d.page.touchscreen.tap(b.x + w.x, b.y + w.y); await d.page.waitForTimeout(600); }
    out.planted = await sf.evaluate(() => typeof window.__FINGER_AT === 'function' && /false && e/.test(String(window.__FINGER_AT)));
    await sf.evaluate(SLOW);
    const cdp = await d.page.context().newCDPSession(d.page);
    const roll = async () => { const r = await sf.evaluate(() => { const e = document.querySelector('#sbody .stline[data-good=tape][data-n="1"] .sb[data-side=buy]'); if (!e) return null; e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }); const b = await fb(); return r ? { x: b.x + r.x, y: b.y + r.y } : null; };
    const bought = () => sf.evaluate(() => (window.__TAPE_BOUGHT && window.__TAPE_BOUGHT.count) | 0);
    const settle = async () => { await d.page.waitForTimeout(2600); };
    out.b0 = await bought(); out.at = await roll();
    for (let i = 0; i < 3 && out.at; i++) { const a = await roll(); await doubleTap(cdp, a.x, a.y, 0.15); await settle(); }
    out.b1 = await bought();
    if (!planted) {
      let a = await roll(); await doubleTap(cdp, a.x, a.y, null); await settle(); out.one = (await bought()) - out.b1;
      a = await roll(); await doubleTap(cdp, a.x, a.y, 0.7); await settle(); out.slow = (await bought()) - out.b1 - out.one;
    }
  } catch (e) { out.why = String(e && e.message || e).slice(0, 200); }
  finally { await d.close().catch(() => {}); }
  return out;
}
/* the end screen on its own page, framed the shell's way */
const HOST = `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><body style="margin:0;background:#000"><script>
function go(){ var f = document.createElement('iframe'); f.src = 'BOHEMIA_SPOILS_SCREEN.html'; f.style.cssText = 'position:fixed;inset:0;border:0;width:100%;height:100%'; document.body.appendChild(f); window.F = f;
  f.addEventListener('load', function(){ var W = f.contentWindow; W.postMessage({ type:'BOHEMIA_SPOILS_OPEN', fight: JSON.parse(JSON.stringify(W.BohemiaSpoilsScreen.SAMPLE)), day: 1, seq: Date.now(), seed: 7 }, '*'); }); }
</script>`;
async function loot(browser, page) {
  const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.css': 'text/css', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg' };
  const srv = http.createServer((req, res) => { const u = decodeURIComponent(req.url.split('?')[0]);
    if (u === '/slices/__finger.html') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(HOST); }
    if (u === '/slices/BOHEMIA_SPOILS_SCREEN.html') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(page); }
    const f = path.join(ROOT, u.replace(/^\//, '')); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    const head = { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' };
    if (/\.(html|js|json|css)$/.test(f) && /gzip/.test(req.headers['accept-encoding'] || '')) { head['Content-Encoding'] = 'gzip'; res.writeHead(200, head); return fs.createReadStream(f).pipe(zlib.createGzip({ level: 6 })).pipe(res); }
    res.writeHead(200, head); fs.createReadStream(f).pipe(res); });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  const p = await ctx.newPage(); const out = { errs: [] }; p.on('pageerror', e => out.errs.push(String(e && e.message || e).slice(0, 160)));
  try {
    await p.goto('http://127.0.0.1:' + srv.address().port + '/slices/__finger.html'); await p.evaluate(() => { try { localStorage.clear(); } catch (e) {} go(); });
    let fr = null; for (let i = 0; i < 200 && !fr; i++) { await p.waitForTimeout(100); fr = p.frames().find(x => /BOHEMIA_SPOILS_SCREEN/.test(x.url())); if (fr && !(await fr.evaluate(() => !!(window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened)).catch(() => false))) fr = null; }
    if (!fr) { out.why = 'no end screen'; return out; }
    await p.waitForTimeout(800); await fr.evaluate(SLOW);
    const cdp = await ctx.newCDPSession(p);
    const piece = async () => { const r = await fr.evaluate(() => { const e = document.querySelector('#ground .slot.full'); if (!e) return null; e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; }); if (!r) return null; const b = await (await fr.frameElement()).boundingBox(); return { x: b.x + r.x, y: b.y + r.y }; };
    const took = () => fr.evaluate(() => BohemiaSpoilsScreen.state.stash.length);
    out.s0 = await took(); out.ground = await fr.evaluate(() => BohemiaSpoilsScreen.state.ground.length);
    for (let i = 0; i < 3; i++) { const a = await piece(); if (!a) break; await doubleTap(cdp, a.x, a.y, 0.15); await p.waitForTimeout(2600); }
    out.s1 = await took();
  } catch (e) { out.why = String(e && e.message || e).slice(0, 200); }
  finally { await ctx.close(); srv.close(); }
  return out;
}
(async () => {
  console.log('\nTHE FINGER SETS THE BEAT\n');
  const A = await stall(false);
  ok('B1 the stall, a slowed phone (every tap handled 500 ms late): three double taps on the tape roll\'s BUY, 150 ms apart by the finger, buy three rolls', !!A.at && A.b1 - A.b0 === 3,
    JSON.stringify({ bought: A.b1 - A.b0, why: A.why || null }));
  ok('B2 one tap alone buys nothing (it lights the box); two taps 700 ms apart by the finger buy nothing', A.one === 0 && A.slow === 0, JSON.stringify({ one: A.one, slow: A.slow }));
  const browser = await chromium.launch();
  const L = await loot(browser, SPOILS);
  ok('L1 the end screen, the same slowed phone: three double taps on the first piece on the ground take three pieces into the stash', L.ground >= 3 && L.s1 - L.s0 === 3, JSON.stringify({ took: L.s1 - L.s0, ground: L.ground, why: L.why || null }));
  const PA = await stall(true), PL = await loot(browser, OLD(SPOILS));
  ok('P1 PLANTED (the old clock: each tap timed by when the page handled it): the stall\'s three double taps buy at most one and the end screen\'s take at most one; the leg sees it',
    PA.planted && PA.b1 - PA.b0 <= 1 && PL.s1 - PL.s0 <= 1, JSON.stringify({ planted: PA.planted, bought: PA.b1 - PA.b0, took: PL.s1 - PL.s0 }));
  const errs = [].concat(A.errs, L.errs);
  ok('Z nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await browser.close(); try { fs.rmSync(TMP, { recursive: true, force: true }); } catch (e) {}
  console.log('\nTHE FINGER SETS THE BEAT: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
