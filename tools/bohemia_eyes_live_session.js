/* ============================================================================
   EYES: THE LIVE DEMO, HELD OPEN AND PLAYED STEP BY STEP (eyes-every-ask-10-25w, rule 179)

   The audit plays the deployed demo the way he plays it, one step at a time, looking at the glass between steps.
   github.io is refused by this box's proxy (403), so the deployed tree is answered from disk AT THE REAL ADDRESS:
   every request to https://paolosarn.github.io/bohemia/ is served from slices/, engine/ and records/target/ (the three
   folders .github/workflows/pages.yml publishes), every other host is refused, and the service worker is blocked so
   the browser asks for every file itself. No server: the browser's own request hook answers.

   ONE BROWSER, STEPS FROM FILES, AND IT STOPS ITSELF:
     node tools/bohemia_eyes_live_session.js <phone|computer> <dir>
   A step is a file <dir>/NNN.js holding the body of an async function given S (the page, the frames, a finger, a
   shutter); what it returns is written to <dir>/NNN.out.json. A file <dir>/QUIT, or 40 minutes with no step, ends it.
   ========================================================================== */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PROFILE = process.argv[2] || 'phone';
const DIR = process.argv[3] || path.join('/tmp', 'eyes_session_' + PROFILE);
const SHOTS = process.env.EYES_SHOTS || path.join(DIR, 'shots');
const IDLE_MS = +(process.env.EYES_IDLE_MS || 40 * 60 * 1000);
const BASE = 'https://paolosarn.github.io/bohemia/';
const PUBLISHED = ['slices/', 'engine/', 'records/target/'];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.m4a': 'audio/mp4', '.webm': 'audio/webm', '.opus': 'audio/ogg',
  '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream', '.txt': 'text/plain',
  '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };
const PROFILES = {
  phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true },
  computer: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, hasTouch: false, isMobile: false } };

fs.mkdirSync(DIR, { recursive: true });
fs.mkdirSync(SHOTS, { recursive: true });
const LOG = path.join(DIR, 'session.log');
const log = (...a) => fs.appendFileSync(LOG, new Date().toISOString().slice(11, 19) + ' ' + a.join(' ') + '\n');

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const prof = PROFILES[PROFILE];
  const ctx = await browser.newContext(Object.assign({}, prof, { serviceWorkers: 'block' }));
  const served = { n: 0, bytes: 0, missing: [], refused: [] };
  await ctx.route('**/*', async (route) => {
    const u = route.request().url();
    if (!u.startsWith(BASE)) { if (!/^(data|blob):/.test(u)) served.refused.push(u.slice(0, 120)); return route.abort(); }
    const rel = decodeURIComponent(u.slice(BASE.length).split('?')[0].split('#')[0]);
    const f = path.join(ROOT, rel);
    if (!PUBLISHED.some(p => rel.startsWith(p)) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      served.missing.push(rel.slice(0, 120)); return route.fulfill({ status: 404, body: '' });
    }
    const body = fs.readFileSync(f);
    served.n++; served.bytes += body.length;
    return route.fulfill({ status: 200, body, headers: { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream',
      'Content-Length': String(body.length), 'Cache-Control': 'max-age=600' } });
  });
  const errs = [];
  const watch = (p) => {
    p.on('pageerror', e => { errs.push({ at: Date.now(), e: String(e).slice(0, 200) }); log('PAGEERROR', String(e).slice(0, 200)); });
    p.on('crash', () => { errs.push({ at: Date.now(), e: 'TAB CRASHED' }); log('TAB CRASHED'); });
  };
  let page = await ctx.newPage();
  watch(page);
  const cdpOf = async (p) => ctx.newCDPSession(p);
  let cdp = await cdpOf(page);
  await page.goto(BASE + 'slices/BOHEMIA_DEMO.html', { waitUntil: 'load', timeout: 300000 });
  log('opened', PROFILE, page.url());

  const frameBy = (re) => page.frames().filter(f => re.test(f.url()))[0] || null;
  const S = {
    ROOT, PROFILE, TOUCH: prof.hasTouch, get page() { return page; }, ctx, browser, errs, served, log, BASE,
    fr: () => frameBy(/BOHEMIA_CITY_WORLD/),
    frameBy,
    /* a frame's element box in the page's own pixels, so a finger inside a frame lands where its element is */
    frameBox: async (f) => { const h = await f.frameElement(); return h ? h.boundingBox() : null; },
    sf: async () => { const fr = frameBy(/BOHEMIA_CITY_WORLD/); if (!fr) return null; const h = await fr.$('#settleFrame'); return h ? h.contentFrame() : null; },
    fight: async () => { const h = await page.$('#fightFrame'); return h ? h.contentFrame() : null; },
    wait: (ms) => page.waitForTimeout(ms),
    until: async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < (ms || 10000)) { try { if (await fn()) return true; } catch (e) {} await page.waitForTimeout(250); } return false; },
    /* a finger (the phone) or the mouse (the computer) at a point in the page's own pixels */
    tap: async (x, y) => { if (prof.hasTouch) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y); S.taps++; },
    taps: 0,
    /* a finger on an element inside a frame (or the page), at its real place on the glass */
    tapEl: async (f, sel, re) => {
      const b = await f.evaluate(([sel, re]) => { const e = [...document.querySelectorAll(sel)].filter(x => {
          if (re && !new RegExp(re, 'i').test(x.textContent)) return false; const r = x.getBoundingClientRect(); return r.width > 2 && r.height > 2; })[0];
        if (!e) return null; const r = e.getBoundingClientRect();
        const on = r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth;
        if (!on) e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, scrolled: !on }; }, [sel, re || null]);
      if (!b) return null;
      let ox = 0, oy = 0;
      if (f !== page && f.parentFrame && f.parentFrame()) { let g = f; while (g && g.parentFrame()) { const fb = await S.frameBox(g); if (fb) { ox += fb.x; oy += fb.y; } g = g.parentFrame(); } }
      await S.tap(ox + b.x, oy + b.y); if (b.scrolled) S.scrolls++;
      return { x: ox + b.x, y: oy + b.y, scrolled: b.scrolled };
    },
    scrolls: 0,
    key: async (k) => { await page.keyboard.press(k); },
    shot: async (name, opts) => { const p = path.join(SHOTS, name + '.png'); await page.screenshot(Object.assign({ path: p }, opts || {})); return p; },
    texts: async (f, sel) => (f || page).evaluate((sel) => [...document.querySelectorAll(sel || 'body')].filter(e => e.offsetParent !== null || e === document.body).map(e => e.innerText).join('\n---\n'), sel),
    heap: async () => { try { const r = await cdp.send('Runtime.getHeapUsage'); return Math.round(r.usedSize / 1048576); } catch (e) { return null; } },
    pinch: async (from, to, steps) => {
      steps = steps || 20; const vp = page.viewportSize(); const CX = vp.width / 2, CY = vp.height / 2;
      for (let i = 0; i <= steps; i++) { const r = from + (to - from) * i / steps;
        await cdp.send('Input.dispatchTouchEvent', { type: i === 0 ? 'touchStart' : 'touchMove', touchPoints: [{ x: CX, y: CY - r, id: 1 }, { x: CX, y: CY + r, id: 2 }] });
        await page.waitForTimeout(28); }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await page.waitForTimeout(1200);
    },
    /* the same phone, the tab killed and opened again (rule 141) */
    reopen: async () => { try { await page.goto('chrome://crash', { timeout: 3000 }); } catch (e) {} await page.close().catch(() => {});
      page = await ctx.newPage(); watch(page); cdp = await cdpOf(page);
      await page.goto(BASE + 'slices/BOHEMIA_DEMO.html', { waitUntil: 'load', timeout: 300000 }); return page.url(); },
    keep: {},
  };

  let last = Date.now(), seq = 0;
  for (;;) {
    if (fs.existsSync(path.join(DIR, 'QUIT'))) { log('QUIT'); break; }
    if (Date.now() - last > IDLE_MS) { log('idle, stopping'); break; }
    const next = path.join(DIR, String(seq + 1).padStart(3, '0') + '.js');
    if (!fs.existsSync(next)) { await new Promise(r => setTimeout(r, 300)); continue; }
    seq++; last = Date.now();
    await new Promise(r => setTimeout(r, 100));
    const body = fs.readFileSync(next, 'utf8');
    const out = next.replace(/\.js$/, '.out.json');
    const t0 = Date.now(); let res, err = null;
    S.taps = 0; S.scrolls = 0;
    try {
      const fn = new Function('S', 'require', 'return (async () => {\n' + body + '\n})();');
      res = await Promise.race([fn(S, require), new Promise((_, rej) => setTimeout(() => rej(new Error('step timed out at 9 minutes')), 9 * 60 * 1000))]);
    } catch (e) { err = String(e && e.stack || e).slice(0, 1500); }
    const newErrs = errs.filter(e => e.at >= t0).map(e => e.e);
    fs.writeFileSync(out, JSON.stringify({ step: seq, ms: Date.now() - t0, taps: S.taps, scrolls: S.scrolls, err, pageErrors: newErrs, res }, null, 1));
    log('step', seq, err ? 'ERR ' + err.slice(0, 120) : 'ok', (Date.now() - t0) + 'ms');
    last = Date.now();
  }
  await browser.close();
  log('closed');
  process.exit(0);
})().catch(e => { log('FATAL', String(e && e.stack || e)); process.exit(1); });
