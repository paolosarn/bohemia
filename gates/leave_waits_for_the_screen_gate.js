/* ==========================================================================
   LEAVE WAITS FOR THE SCREEN  (FIXES 3, 11/26/26, VAMILY rule 480(b) 'improve what we already have', rule 441 on the real glass;
   ask rows 697 and 722; the end screen is RUN's page, slices/BOHEMIA_SPOILS_SCREEN.html, __LEAVE_WAITS_FOR_THE_SCREEN__)

   MEASURED 11/26 on main ec97371ae (a phone upright, the page framed the shell's way: a fresh frame, the fight posted on its load):
   the end screen draws its LEAVE before its tables are in (about 1 MB of them), and a tap on LEAVE in that moment went home at once:
   the summary he asked to stand (rule 164 item 28: 'it goes away way too quickly, I can't read it') never showed, and the batteries,
   rounds and tape off the bodies were never paid (they are only found when the screen opens on the fight).
   THE LAW: until the screen has opened LEAVE and MAKE CAMP read as not ready; once it opens they light and LEAVE goes home with what
   was in their pockets paid first; if the tables cannot load at all, LEAVE still goes home.
   RE-AIMED 11/27 by FIXES 4 (ask row 776 FOUND BY EYES: 'a tap on the faint LEAVE is lost ... the same tap, two outcomes, no sign it
   was heard'; __A_FAINT_TAP_IS_KEPT__): a tap on the faint LEAVE no longer does nothing. It sends nothing home while the screen is not
   open (the summary and the pockets still come first), it shows pressed at once, and the moment the screen lights it goes home by
   itself, once, the counts paid before the leave. The light itself waits for the screen on the glass (__LEAVE_LIGHTS_ON_THE_GLASS__,
   gate LEAVE LIGHTS ON THE GLASS); this host's frame stands still, so it lights at once.

   LEGS (a phone, 390 x 844, real taps on the glass)
     L1 the tables held back: LEAVE is on the glass, reads not ready (faint), and a tap on it sends nothing home, and shows pressed
     L2 the tables let in: the screen opens, LEAVE lights, and the kept tap goes home by itself, once, the pockets paid first; a
        second tap sends no second leave
     L4 no early tap: the screen opens, LEAVE lights, a tap goes home once, the pockets' counts paid before the leave
     L3 the loot table refused (a dead network): LEAVE lights and a tap still goes home
     P1 PLANTED (the wait taken out, main's old page): the tap before the screen opened goes home, the leg sees it
     P2 PLANTED (the kept tap dropped, FIXES 3's 11/26 page): the faint tap is lost, nothing goes home after the screen opens
     Z  nothing threw
   node gates/leave_waits_for_the_screen_gate.js   (about 40 s)
   ========================================================================== */
'use strict';
const path = require('path'), fs = require('fs'), http = require('http'), zlib = require('zlib');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.css': 'text/css', '.mp3': 'audio/mpeg', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const PAGE = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SPOILS_SCREEN.html'), 'utf8');
/* the plant: the page with its wait taken out (the two lines that hold LEAVE until the screen is open) */
const PLANT = PAGE.replace(/\n\s*if\(!S\.seq && !S\.failed\)\{ S\.asked = [^\n]*/, '\n').replace(/\n\s*if\(!S\.seq\)\{ if\(S\.leaving === 'failed'\)[^\n]*/, '\n');
/* the second plant: FIXES 3's 11/26 page, the faint tap dropped on the floor (row 776's two outcomes) */
const DROP = PAGE.replace(/if\(!S\.seq && !S\.failed\)\{ S\.asked = [^\n]*/, 'if(!S.seq && !S.failed) return;');
/* the shell's own way (slices/BOHEMIA_ALPHA_0_9.html spoilsOpen): a fresh frame, the fight posted on its load; the host hears what the game hears */
const HOST = `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><body style="margin:0;background:#000">
<script>
window.HEARD = [];
window.addEventListener('message', function(ev){ var m = ev.data; if(m && m.type === 'BOHEMIA_SPOILS') HEARD.push({ act: m.act, n: (m.batteries | 0) + (m.rounds | 0) + (m.tape | 0), failed: !!m.failed }); });
function go(){
  var wrap = document.createElement('div'); wrap.id = 'spoilsdoor'; wrap.style.cssText = 'position:fixed;inset:0;z-index:8000;background:#120e0a';
  var f = document.createElement('iframe'); f.src = 'BOHEMIA_SPOILS_SCREEN.html'; f.style.cssText = 'border:0;width:100%;height:100%;display:block';
  wrap.appendChild(f); document.body.appendChild(wrap); window.F = f;
  f.addEventListener('load', function(){ var W = f.contentWindow, smp = JSON.parse(JSON.stringify(W.BohemiaSpoilsScreen.SAMPLE));   /* its THUG's gun holds 3 rounds: the pockets pay */
    W.postMessage({ type:'BOHEMIA_SPOILS_OPEN', fight: smp, day: 1, seq: Date.now(), seed: 7 }, '*'); });
}
</script>`;
function server(page, opts) {
  const s = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    if (u === '/slices/__leave_host.html') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(HOST); }
    if (u === '/slices/BOHEMIA_SPOILS_SCREEN.html') { res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' }); return res.end(page); }
    if (opts.refuse && /records\/target\/bb\/loot\.json$/.test(u)) { res.writeHead(503); return res.end('down'); }
    const f = path.join(ROOT, u.replace(/^\//, ''));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    const send = () => { const head = { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' };
      if (/\.(html|js|json|css)$/.test(f) && /gzip/.test(req.headers['accept-encoding'] || '')) { head['Content-Encoding'] = 'gzip'; res.writeHead(200, head); return fs.createReadStream(f).pipe(zlib.createGzip({ level: 6 })).pipe(res); }
      res.writeHead(200, head); fs.createReadStream(f).pipe(res); };
    /* the tables held back until the leg lets them in (a slow phone network, made long enough to tap in) */
    if (opts.hold && /records\/target\/bb\/loot\.json$/.test(u)) return opts.hold.then(send);
    send();
  });
  return new Promise(r => s.listen(0, '127.0.0.1', () => r(s)));
}
async function leg(browser, page, opts) {
  let release = null; const hold = opts.held ? new Promise(r => { release = r; }) : null;
  const srv = await server(page, { hold, refuse: opts.refuse });
  const base = 'http://127.0.0.1:' + srv.address().port;
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e && e.message || e).slice(0, 200)));
  await p.goto(base + '/slices/__leave_host.html'); await p.evaluate(() => go());
  const fr = () => p.frames().find(x => /BOHEMIA_SPOILS_SCREEN/.test(x.url()));
  /* LEAVE on the glass: its box in the phone's own coordinates, its look, whether the screen has opened */
  const look = async () => { const f = fr(); if (!f) return null;
    const r = await f.evaluate(() => { const b = document.getElementById('leave'); if (!b) return null; const q = b.getBoundingClientRect(), cs = getComputedStyle(b);
      const S = window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state; return { x: q.x + q.width / 2, y: q.y + q.height / 2, w: q.width, h: q.height, op: +cs.opacity, open: !!(S && S.opened), failed: !!(S && S.failed) }; }).catch(() => null);
    if (!r) return null; const fb = await (await f.frameElement()).boundingBox(); r.x += fb.x; r.y += fb.y; return r; };
  let L = null; for (let i = 0; i < 200 && !(L && L.w > 0 && L.y < 844); i++) { await p.waitForTimeout(50); L = await look(); }
  const out = { before: L, errs };
  if (opts.held) {
    if (L) await p.touchscreen.tap(L.x, L.y);
    await p.waitForTimeout(600);
    out.heardEarly = await p.evaluate(() => HEARD.filter(m => m.act === 'leave').length);
    const fq = fr(); out.pressed = fq ? await fq.evaluate(() => ({ asked: document.documentElement.classList.contains('sp-asked'), op: +getComputedStyle(document.getElementById('leave')).opacity })).catch(() => null) : null;
    out.stillOpenBefore = (await look() || {}).open;
    release();
  }
  let A = null; for (let i = 0; i < 300 && !(A && (A.open || A.failed) && A.op > 0.9); i++) { await p.waitForTimeout(50); A = await look(); }
  await p.waitForTimeout(600); A = await look();
  out.after = A;
  const n0 = await p.evaluate(() => HEARD.filter(m => m.act === 'leave').length);
  out.kept = n0;   /* the kept tap's leaves, by itself, once the screen lit */
  if (A) { await p.touchscreen.tap(A.x, A.y); await p.waitForTimeout(600); }
  out.heard = await p.evaluate(() => HEARD.slice());
  out.leaves = out.heard.filter(m => m.act === 'leave').length - n0;
  const iL = out.heard.findIndex(m => m.act === 'leave'), iC = out.heard.findIndex(m => m.act === 'counts');
  out.paidFirst = iC >= 0 && iL > iC && out.heard[iC].n > 0; out.paid = iC >= 0 ? out.heard[iC].n : 0;
  await ctx.close(); srv.close();
  return out;
}
(async () => {
  console.log('\nLEAVE WAITS FOR THE SCREEN\n');
  const browser = await chromium.launch();
  try {
    const A = await leg(browser, PAGE, { held: true });
    ok('L1 the tables held back: LEAVE is on the glass, reads not ready, a tap on it sends nothing home, and it shows pressed (kept)', !!A.before && A.before.w >= 44 && A.before.y < 844 && !A.before.open && A.before.op < 0.6 && A.heardEarly === 0 && !!A.pressed && A.pressed.asked && A.pressed.op > A.before.op,
      JSON.stringify({ leave: A.before && { y: Math.round(A.before.y), w: Math.round(A.before.w), opacity: A.before.op, open: A.before.open }, wentHome: A.heardEarly, pressed: A.pressed }));
    ok('L2 the tables let in: the screen opens, LEAVE lights, and the kept tap goes home by itself, once, the pockets paid first; a second tap sends no second leave', !!A.after && A.after.open && A.after.op > 0.9 && A.kept === 1 && A.leaves === 0 && A.paidFirst,
      JSON.stringify({ open: A.after && A.after.open, opacity: A.after && A.after.op, keptWentHome: A.kept, secondTap: A.leaves, paid: A.paid, heard: A.heard.map(m => m.act) }));
    const N = await leg(browser, PAGE, {});
    ok('L4 no early tap: the screen opens, LEAVE lights, a tap goes home once with the pockets paid first', !!N.after && N.after.open && N.after.op > 0.9 && N.kept === 0 && N.leaves === 1 && N.paidFirst,
      JSON.stringify({ open: N.after && N.after.open, opacity: N.after && N.after.op, leaves: N.leaves, paid: N.paid, heard: N.heard.map(m => m.act) }));
    const B = await leg(browser, PAGE, { refuse: true });
    ok('L3 the loot table refused (a dead network): LEAVE lights and a tap still goes home', !!B.after && B.after.failed && B.after.op > 0.9 && B.leaves === 1 && B.heard.some(m => m.act === 'leave' && m.failed),
      JSON.stringify({ failed: B.after && B.after.failed, opacity: B.after && B.after.op, leaves: B.leaves }));
    const P = await leg(browser, PLANT, { held: true });
    ok('P1 PLANTED (the wait taken out): the tap before the screen opened goes home, the summary unseen and nothing paid; the leg sees it', PLANT !== PAGE && P.heardEarly === 1 && !P.stillOpenBefore,
      JSON.stringify({ wentHomeEarly: P.heardEarly, paid: P.paid }));
    const Q = await leg(browser, DROP, { held: true });
    ok('P2 PLANTED (the kept tap dropped, FIXES 3\'s 11/26 page): the faint tap is lost, nothing goes home once the screen opens; the leg sees it', DROP !== PAGE && Q.heardEarly === 0 && Q.kept === 0,
      JSON.stringify({ keptWentHome: Q.kept, pressed: Q.pressed }));
    const errs = [].concat(A.errs, B.errs, N.errs);
    ok('Z nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  } catch (e) { ok('the gate ran', false, String(e && e.stack || e).slice(0, 400)); }
  await browser.close();
  console.log('\nLEAVE WAITS FOR THE SCREEN: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
