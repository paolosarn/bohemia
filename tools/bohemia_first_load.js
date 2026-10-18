/* HOW LONG UNTIL THE TITLE, AND UNTIL NEW GAME IS READY (PLUMBER 10/9, row [first load])
   ================================================================================
   PAOLO 10/5: "I feel like I gotta wait 40 seconds for this shit to load."
   Rule 66a: the title paints within two seconds of the tap, the world loads behind it,
   NEW GAME and CONTINUE light when it is ready. Rule 72, release line 12: about 17 MB
   before the first frame; time to first tap on cell data, measured.

   One reading = a FRESH browser (cold cache, no service worker yet: a stranger's first
   open), the demo page, through the one driver, on a phone-shaped CPU (4x throttle) and,
   when asked, a phone's network. Recorded from INSIDE the page, in ms since the tap:
     first paint     the browser's own first-contentful-paint
     title           the first frame with the title layer on screen (#title, not gone)
     buttons         the first frame its menu is visible (NEW GAME, CONTINUE, SETTINGS)
     ready           the game sets __LOAD_READY: the loading bar goes and NEW GAME is live
   and from the browser's network events: every file, its bytes, when it finished, so the
   bytes that had to arrive BEFORE the title are a list with sizes.

   node tools/bohemia_first_load.js [runs]      the demo at 4x CPU, then 4x + LTE
   require(...).readOnce(open, { throttle, net })
   ================================================================================ */
'use strict';
const path = require('path');

const ARM = `(() => {
  if (window.top !== window || window.__BOOT_T) return;
  const T = window.__BOOT_T = { title: null, buttons: null, ready: null, fcp: null };
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint' && T.fcp === null) T.fcp = e.startTime; })
    .observe({ type: 'paint', buffered: true }); } catch (e) {}
  const shown = (el) => { if (!el) return false; const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden') return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const tick = (now) => {
    const t = document.getElementById('title');
    if (T.title === null && t && !t.classList.contains('gone') && shown(t)) T.title = now;
    if (T.buttons === null && t && !t.classList.contains('gone')) {
      const m = t.querySelector('.m') || t.querySelector('.menu');
      if (m && shown(m)) T.buttons = now; }
    if (T.ready === null && window.__LOAD_READY) T.ready = now;
    if (T.title === null || T.buttons === null || T.ready === null) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();`;

const LTE = { down: 12000, up: 3000, rtt: 70 };      /* a typical LTE phone: 12 Mbit/s down, 70 ms */

/* ONE READING, WITH NOBODY TOUCHING THE GLASS. The driver opens the page with its door
   left alone (opts.bare: no knock, no tap), because a stranger who has just opened the link
   has not tapped anything yet, and a driver that knocks mid-load changes what it measures. */
async function readOnce(open, o) {
  o = o || {};
  /* SERVED LIKE GITHUB PAGES (cache rules and gzip) unless a caller says otherwise: without them the
     test server, not the game, decides how many bytes a phone pays for */
  const d = await open(Object.assign({ bare: true, file: o.file || 'BOHEMIA_DEMO.html', arm: ARM, netlog: true,
    pages: o.pages !== false, throttle: o.throttle || 4 }, o.net ? { net: o.net } : {}, o.serve ? { serve: o.serve } : {}));
  try {
    const t0 = Date.now(); let T = null;
    while (Date.now() - t0 < (o.wait || 240000)) {
      T = await d.page.evaluate(() => window.__BOOT_T ? Object.assign({}, window.__BOOT_T) : null).catch(() => null);
      if (T && T.ready !== null && T.title !== null && T.buttons !== null) break;
      await d.page.waitForTimeout(500);
    }
    T = T || {};
    /* THE PAGE'S OWN DOWNLOAD. The browser's network events report every navigated document as 0
       bytes (measured 10/9: the 2.4 MB page and the 1.9 MB map both read 0 KB), so a later full
       re-read of the page had no first copy to match. The page's own timing records know: the
       navigation entry for the page, and the iframe entries for the frames it opened. */
    const sizes = await d.page.evaluate(() => {
      const n = performance.getEntriesByType('navigation')[0];
      const strip = (u) => u.replace(/^https?:\/\/[^/]+/, '').split('?')[0];
      return { main: n ? [strip(n.name), n.transferSize] : null,
        frames: performance.getEntriesByType('resource').filter(e => e.initiatorType === 'iframe').map(e => [strip(e.name), e.transferSize]) };
    }).catch(() => ({ main: null, frames: [] }));
    const docSize = {}; if (sizes.main) docSize[sizes.main[0]] = sizes.main[1]; for (const [u, b] of sizes.frames) docSize[u] = b;
    const net = d.netlog.map(n => (n.type === 'Document' && !n.bytes && docSize[n.url]) ? Object.assign({}, n, { bytes: docSize[n.url] }) : n);
    const before = (ms) => ms == null ? null : net.filter(n => n.endMs != null && n.endMs <= ms);
    const sum = (a) => a ? a.reduce((s2, n) => s2 + (n.bytes || 0), 0) : null;
    const big = (a) => a ? a.slice().sort((x, y) => y.bytes - x.bytes).slice(0, 8)
      .map(n => ({ url: n.url, kb: Math.round(n.bytes / 1024), endMs: n.endMs })) : [];
    /* THE SAME FILE DOWNLOADED TWICE before NEW GAME is ready: two responses that each carried at
       least half of the file's largest response. A cache hit or a 304 is a request, not a download,
       and the first cut of this count called those duplicates (measured 10/9: with Pages' caching the
       "twice" list fell from 15 files to the ones that really crossed the wire twice). data: URLs are
       inline, not downloads. A read stopped early on purpose carries a fraction, so it is not a copy. */
    /* ONE YARDSTICK FOR "A FULL COPY": the file's own size on the wire, read from disk (gzipped when
       served like Pages, as text is). Comparing responses with each other mixed units: the page's
       navigation reads its decoded size (6.0 MB) while a re-read reads compressed (2.4 MB), and the
       re-read looked like 40% of a copy. A response of at least half the file is a copy. */
    const zlib = require('zlib'), fs = require('fs');
    const ROOT = path.join(__dirname, '..');
    const wire = {};
    const wireSize = (u) => { if (u in wire) return wire[u];
      const f = (o.serve && o.serve[u]) || path.join(ROOT, u.replace(/^\//, ''));
      let w = 0; try { const buf = fs.readFileSync(f);
        w = (o.pages !== false && /\.(html?|js|mjs|json|css|txt|svg|md)$/i.test(f)) ? zlib.gzipSync(buf, { level: 6 }).length : buf.length; } catch (e) {}
      return (wire[u] = w); };
    const groups = {};
    for (const n of (before(T.ready) || net)) { if (/^data:/.test(n.url)) continue; (groups[n.url] = groups[n.url] || []).push(n.bytes || 0); }
    const twice = Object.entries(groups).map(([u, bs]) => { const w = wireSize(u);
      const full = bs.filter(b => w > 4096 && b >= 0.5 * w).length; return { url: u, times: full, mb: +(bs.reduce((a, b) => a + b, 0) / 1048576).toFixed(2) }; })
      .filter(t => t.times > 1);
    return { says: d.says(), throttle: o.throttle || 4, net: o.net || null,
      fcp: T.fcp, title: T.title, buttons: T.buttons, ready: T.ready,
      bytesBeforeTitle: sum(before(T.title)), bytesBeforeReady: sum(before(T.ready)), bytesAll: sum(net),
      filesBeforeTitle: before(T.title) ? before(T.title).length : null,
      biggestBeforeTitle: big(before(T.title)), twice, errs: d.errs.length };
  } finally { await d.close(); }
}

const s = (ms) => ms == null ? 'never' : (ms / 1000).toFixed(1) + ' s';
const mb = (b) => b == null ? '?' : (b / 1048576).toFixed(1) + ' MB';
function line(r) {
  return 'first paint ' + s(r.fcp) + ' | title ' + s(r.title) + ' | buttons ' + s(r.buttons) + ' | NEW GAME ready ' + s(r.ready)
    + ' | before the title: ' + mb(r.bytesBeforeTitle) + ' in ' + r.filesBeforeTitle + ' files | before ready: ' + mb(r.bytesBeforeReady);
}

module.exports = { ARM, LTE, readOnce, line };

if (require.main === module) {
  const { open } = require(path.join(__dirname, 'bohemia_drive_the_demo.js'));
  const runs = +process.argv[2] || 2;
  (async () => {
    for (const [name, o] of [['4x CPU, no network limit', { throttle: 4 }], ['4x CPU + LTE (12 Mbit/s, 70 ms)', { throttle: 4, net: LTE }]]) {
      for (let i = 0; i < runs; i++) {
        const r = await readOnce(open, o);
        console.log(name + ' #' + (i + 1) + ': ' + line(r));
        r.twice.forEach(t => console.log('     TWICE ' + t.times + 'x  ' + t.mb + ' MB  ' + t.url));
        if (i === 0) r.biggestBeforeTitle.forEach(b => console.log('     ' + String(b.kb).padStart(6) + ' KB  ' + b.url + '  (done ' + s(b.endMs) + ')'));
      }
    }
    process.exit(0);
  })().catch(e => { console.error(e); process.exit(1); });
}
