/* WHAT A STRANGER DOWNLOADS BEFORE HE CAN PLAY, AND WHAT HIS PHONE HOLDS (PLUMBER 6, 11/6/26; rule 418(a)(b), ask line 475)
   ================================================================================
   PAOLO 11/6: 'why can't we try to make this work like a flash website... I need to be able to play it too... my idea of this
   game was that it was always not taxing on any system, international, this is how the African kids can play it, on a little
   laptop.' Rule 418: (a) the first play under 20 MB now, under 8 MB as the goal (Poki's first-download bar; a Flash game averaged
   about 1 MB); the rest streams in when it is needed. (b) the heap flat and under 200 MB through the whole loop.

   ONE READING: a FRESH browser (a stranger's first visit: no cache, no saved game), the page through the one driver, served LIKE
   GITHUB PAGES (gzip on text, max-age=600, ETag; opts.pages), on the phone held upright or a computer. Nobody touches anything but
   what a stranger touches: NEW GAME (the driver's real touch), then nothing. FIRST PLAY is the first moment he can act in the game:
   the town screen he starts in is up and its LEAVE is on the glass (or the map, when a build starts him on it). Every byte that
   finished arriving by then is THE FIRST PLAY; what arrives in the next `linger` ms while he does nothing is printed beside it,
   because it is downloading while he plays.

   HOW IT COUNTS: the browser's own network events (a CDP session armed before the page is requested), wire bytes (compressed when
   the server compressed them, headers included), every frame. THE SERVICE WORKER IS BLOCKED for the byte count (opts.noWorker): the
   always-fresh worker (slices/sw.js) claims the page during the first visit, and a response it serves reaches the page as
   'from service worker' while the real download happens in the worker's own target, which a page session cannot see. The worker is
   network-first with no cache of its own, so the downloads are the same files; blocking it is the only way to weigh each one once.
   A file is DOWNLOADED TWICE when two of its responses each carried more than 2 KB of body (a 304 is a few hundred bytes).
   THE HEAP is the page's JavaScript heap (every same-origin frame shares it), read by CDP after a forced garbage collection, so the
   number is what is held, not what is waiting to be swept.

     node tools/bohemia_first_play.js [--alpha] [--profile computer] [--throttle 4] [--linger 20000] [--json out.json] [--off]
       [--base https://paolosarn.github.io/bohemia]   THE LIVE SITE (GitHub's runner only: .github/workflows/weight.yml)
     require(...).measure({ alpha, profile, throttle, linger })
   ================================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

const MB = (b) => +(b / 1048576).toFixed(2);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function heapNow(cdp) {
  try { await cdp.send('HeapProfiler.collectGarbage'); } catch (e) { /* not every target answers; read anyway */ }
  try { const h = await cdp.send('Runtime.getHeapUsage'); return { used: h.usedSize, total: h.totalSize }; } catch (e) { return null; }
}

/* the page's own moments, on its own clock: the title up, BEGIN pressed (__PLAY_BEGAN), the shell's FIRST PLAY (__FIRST_PLAY) */
const STAMP = `(() => { if (window.top !== window || window.__FP_T) return; const T = window.__FP_T = {};
  const tick = () => { const n = Math.round(performance.now());
    if (T.title == null) { const t = document.getElementById('title'); if (t && !t.classList.contains('gone')) T.title = n; }
    if (T.begin == null && window.__PLAY_BEGAN) T.begin = n;
    if (T.firstPlay == null && window.__FIRST_PLAY) { T.firstPlay = n; T.why = window.__FIRST_PLAY.why; }
    /* PLAY: the first moment he can act in the game, by what is on the glass and nothing else (not the shell's own signal):
       the town he starts in is shown and a LEAVE is on the glass (the phone's band, or the town's own), or the door is gone
       and the map is his screen with no town */
    if (T.play == null && window.__PLAY_BEGAN) { try {
      const on = (el) => { if (!el) return false; const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 4 && r.height > 4 && s.visibility !== 'hidden' && s.display !== 'none'; };
      const cf = document.getElementById('cityFrame'), w = cf && cf.contentWindow, L = w && w.LOOP;
      const front = document.getElementById('front'), doorGone = !front || getComputedStyle(front).display === 'none';
      const town = !!(L && L.open && L.frame && L.frame.style.display === 'block');
      let leave = on(document.querySelector('#bohphone .bpctx button.lv'));
      if (!leave && town) { try { leave = on(L.frame.contentDocument.getElementById('leave')); } catch (e) {} }
      /* and the town is DRAWN: its picture is in (the town screen's own picIn), not a brown glass waiting for it */
      let drawn = false; try { const BS = L.frame.contentWindow.BohemiaSettlement; drawn = !!(BS && typeof BS.picIn === 'function' && BS.picIn()); } catch (e) {}
      if (doorGone && town && leave && drawn) { T.play = n; T.playWhere = 'the town he starts in, drawn, LEAVE on the glass'; }
      else if (doorGone && !town && w && w.MODE === 'city' && T.begin != null && n - T.begin > 4000) { T.play = n; T.playWhere = 'the map'; }
    } catch (e) {} }
    if (T.firstPlay == null || T.play == null) setTimeout(tick, 50); };
  tick(); })();`;

async function measure(o) {
  o = o || {};
  const reqs = {};            /* requestId -> one response's record */
  let base = null;
  const arm = async (cdp) => {
    await cdp.send('Network.enable').catch(() => {});
    cdp.on('Network.requestWillBeSent', (e) => {
      if (base === null && e.type === 'Document') base = e.timestamp;
      const r = reqs[e.requestId] = reqs[e.requestId] || {};
      /* the live site sits under /bohemia/; the same file reads the same on both */
      Object.assign(r, { url: e.request.url.replace(/^https?:\/\/[^/]+/, '').split('?')[0].replace(/^\/bohemia\//, '/'), type: e.type, at: e.timestamp, frame: e.frameId });
    });
    cdp.on('Network.responseReceived', (e) => {
      const r = reqs[e.requestId] = reqs[e.requestId] || {};
      Object.assign(r, { status: e.response.status, mime: e.response.mimeType, enc: (e.response.headers['Content-Encoding'] || e.response.headers['content-encoding'] || ''),
        fromCache: !!(e.response.fromDiskCache || e.response.fromPrefetchCache), fromSW: !!e.response.fromServiceWorker });
    });
    cdp.on('Network.dataReceived', (e) => { const r = reqs[e.requestId] = reqs[e.requestId] || {}; r.body = (r.body || 0) + (e.dataLength || 0); r.chunks = (r.chunks || 0) + (e.encodedDataLength || 0); });
    cdp.on('Network.loadingFinished', (e) => { const r = reqs[e.requestId]; if (!r) return; r.wire = Math.max(e.encodedDataLength || 0, r.chunks || 0); r.end = e.timestamp; r.how = 'finished'; });
    cdp.on('Network.loadingFailed', (e) => { const r = reqs[e.requestId]; if (!r) return; r.wire = r.chunks || 0; r.end = e.timestamp; r.how = e.canceled ? 'cancelled' : 'failed'; });
  };
  const t0 = Date.now();
  /* world: the driver's own wait for the world is the DEAD WALK's (MODE 'human' and eight walk-pad buttons, which never come
     since 9/28), so it always runs its full ceiling; this reading waits for the first play itself instead */
  const d = await D.open(Object.assign(o.base ? { base: o.base } : {}, { profile: o.profile || 'phone_portrait', alpha: !!o.alpha, pages: true, noWorker: true, fog: true,
    throttle: o.throttle || 4, beforeGoto: arm, world: 1500,
    /* o.off: the shell's hold switched off before any page script runs (window.__FIRST_PLAY_OFF), the before of __FIRST_PLAY_IS_LIGHT__ */
    arm: (o.off ? 'window.__FIRST_PLAY_OFF = true;\n' : '') + STAMP }));
  const heaps = [];
  o._doorMs = Date.now() - t0;
  let firstPlayMs = null, where = null;
  try {
    const fr = d.fr;
    /* FIRST PLAY: the town he starts in is on the glass with its LEAVE (the phone's band or the town's own), or the map is up */
    const tEnd = Date.now() + (o.wait || 240000);
    while (Date.now() < tEnd) {
      const s = await fr.evaluate(() => {
        const inTown = !!(window.LOOP && LOOP.open && LOOP.frame && LOOP.frame.style.display === 'block');
        return { inTown, mode: typeof MODE !== 'undefined' ? MODE : '?' };
      }).catch(() => null);
      let leave = false;
      if (s && s.inTown) {
        leave = await d.page.evaluate(() => { const b = document.querySelector('#bohphone .bpctx button.lv'); if (!b) return false; const r = b.getBoundingClientRect(); return r.width > 4 && r.height > 4; }).catch(() => false);
        if (!leave) { const sfr = d.page.frames().find(f => /SETTLEMENT_SCREEN/.test(f.url()));
          if (sfr) leave = await sfr.evaluate(() => { const b = document.getElementById('leave'); if (!b) return false; const r = b.getBoundingClientRect(); return r.width > 4; }).catch(() => false); }
      }
      const drawn = s && s.inTown ? await fr.evaluate(() => { try { const BS = LOOP.frame.contentWindow.BohemiaSettlement; return !!(BS && typeof BS.picIn === 'function' && BS.picIn()); } catch (e) { return false; } }).catch(() => false) : false;
      if (s && s.inTown && leave && drawn) { where = 'the town he starts in, drawn, LEAVE on the glass'; break; }
      if (s && !s.inTown && s.mode === 'city' && d.doorIsBehindUs() && Date.now() - t0 > 5000 && o.mapCounts) { where = 'the map'; break; }
      await sleep(250);
    }
    /* FIRST PLAY needs no shared clock: the files that had FINISHED the moment it was seen are the first play, exactly */
    firstPlayMs = where ? Date.now() - t0 : null;
    o._stamps = await d.page.evaluate(() => window.__FP_T || null).catch(() => null);
    const doneAtPlay = new Set(Object.keys(reqs).filter(k => reqs[k].end != null));
    heaps.push(Object.assign({ at: 'first play' }, await heapNow(d.cdp)));
    if (o.linger) { await sleep(o.linger); heaps.push(Object.assign({ at: 'first play + ' + Math.round(o.linger / 1000) + ' s' }, await heapNow(d.cdp))); }
    /* a data: or blob: address is inline, never a download */
    const all = Object.keys(reqs).filter(k => reqs[k].url && reqs[k].end != null && !/^(data|blob):/.test(reqs[k].url))
      .map(k => Object.assign({ id: k }, reqs[k], { endMs: base == null ? null : Math.round((reqs[k].end - base) * 1000) }));
    /* the split: by the page's own PLAY stamp when it has one (the page's clock and the network's share their zero, the top
       document's request), else by what had finished when this tool saw it */
    const playMs = o._stamps && o._stamps.play != null ? o._stamps.play : null;
    if (playMs != null) { firstPlayMs = playMs; where = o._stamps.playWhere; }
    const before = playMs != null ? all.filter(r => r.endMs != null && r.endMs <= playMs) : all.filter(r => doneAtPlay.has(r.id));
    const after = playMs != null ? all.filter(r => !(r.endMs != null && r.endMs <= playMs)) : all.filter(r => !doneAtPlay.has(r.id));
    return summarize({ d, before, after, all, firstPlayMs, where, heaps, o });
  } finally { try { await d.close(); } catch (e) {} }
}

function summarize({ d, before, after, all, firstPlayMs, where, heaps, o }) {
  const sum = (a) => a.reduce((s, r) => s + (r.wire || 0), 0);
  const body = (r) => (r.body || 0);
  const files = (a) => a.filter(r => (r.wire || 0) > 0 && !r.fromCache).length;
  const byUrl = {};
  /* twice = two responses that each crossed the wire with more than 2 KB (a cache hit or a 304 does not) */
  for (const r of all) { if ((r.status === 200 || r.status === 206) && !r.fromCache && (r.wire || 0) > 2048) (byUrl[r.url] = byUrl[r.url] || []).push(r); }
  const twice = Object.entries(byUrl).filter(([, v]) => v.length > 1).map(([u, v]) => ({ url: u, times: v.length, kb: Math.round(sum(v) / 1024) }))
    .sort((a, b) => b.kb - a.kb);
  const big = (a, n) => a.slice().sort((x, y) => (y.wire || 0) - (x.wire || 0)).slice(0, n || 15)
    .map(r => ({ url: r.url, kb: Math.round((r.wire || 0) / 1024), unzippedKb: Math.round(body(r) / 1024), enc: r.enc || '', endMs: r.endMs }));
  const peak = heaps.reduce((m, h) => Math.max(m, (h && h.used) || 0), 0);
  return {
    surface: d.openedFile() + (o.base ? ' at ' + o.base + ' (THE LIVE SITE)' : ''), profile: o.profile || 'phone_portrait', throttle: o.throttle || 4,
    firstPlayMs, where: where || 'NEVER (no town screen with its LEAVE, no map)',
    firstPlay: { mb: MB(sum(before)), files: files(before), unzippedMb: MB(before.reduce((s, r) => s + body(r), 0)) },
    afterFirstPlay: { lingerMs: o.linger || 0, mb: MB(sum(after)), files: files(after) },
    twice, biggest: big(before, o.top || 15), biggestAfter: big(after, 8), folders: folders(before),
    afterList: after.filter(r => (r.wire || 0) > 0).map(r => r.url), off: !!o.off,
    doorMs: o._doorMs || null, stamps: o._stamps || null,
    heaps: heaps.map(h => ({ at: h.at, usedMb: h.used ? MB(h.used) : null, totalMb: h.total ? MB(h.total) : null })),
    heapPeakMb: MB(peak), errors: (d.errs || []).slice(0, 5),
    files: before.filter(r => (r.wire || 0) > 0).map(r => ({ url: r.url, kb: +((r.wire || 0) / 1024).toFixed(1), endMs: r.endMs, type: r.type }))
      .sort((x, y) => y.kb - x.kb)
  };
}

/* where the bytes go: the folder (two levels deep under slices/, one elsewhere) */
function folders(a) {
  const f = {};
  for (const r of a) { const parts = r.url.replace(/^\//, '').split('/'); const k = parts.length > 2 ? parts.slice(0, parts[0] === 'slices' ? 2 : 3).join('/') + '/' : parts.join('/');
    const e = f[k] = f[k] || { mb: 0, files: 0 }; e.mb += (r.wire || 0) / 1048576; if ((r.wire || 0) > 0) e.files++; }
  return Object.entries(f).map(([k, v]) => ({ path: k, mb: +v.mb.toFixed(2), files: v.files })).sort((x, y) => y.mb - x.mb);
}

function print(r) {
  console.log('\n  ' + r.surface + ', ' + r.profile + ', CPU ' + r.throttle + 'x, ' + (/LIVE SITE/.test(r.surface) ? 'served by GitHub Pages itself' : 'served like GitHub Pages (gzip on text)') + (r.off ? ', THE HOLD SWITCHED OFF (the before)' : ''));
  console.log('  the driver was through the title and the door at ' + (r.doorMs / 1000).toFixed(1) + ' s');
  if (r.stamps) console.log('  the page\'s own clock: title ' + r.stamps.title + ' ms, BEGIN ' + r.stamps.begin + ' ms, the shell\'s FIRST PLAY ' + r.stamps.firstPlay + ' ms (' + r.stamps.why + ')');
  console.log('  FIRST PLAY at ' + (r.firstPlayMs == null ? 'never' : (r.firstPlayMs / 1000).toFixed(1) + ' s') + ': ' + r.where);
  console.log('  BEFORE IT: ' + r.firstPlay.mb + ' MB on the wire in ' + r.firstPlay.files + ' files (' + r.firstPlay.unzippedMb + ' MB unzipped)');
  console.log('  IN THE ' + Math.round(r.afterFirstPlay.lingerMs / 1000) + ' s AFTER, doing nothing: ' + r.afterFirstPlay.mb + ' MB in ' + r.afterFirstPlay.files + ' files');
  console.log('  DOWNLOADED TWICE: ' + (r.twice.length ? r.twice.map(t => t.url + ' x' + t.times + ' (' + t.kb + ' KB)').join(', ') : 'none'));
  console.log('  THE HEAP: ' + r.heaps.map(h => h.at + ' ' + h.usedMb + ' MB').join(', '));
  console.log('  BIGGEST BEFORE FIRST PLAY:');
  for (const b of r.biggest) console.log('    ' + String(b.kb).padStart(6) + ' KB  ' + (b.enc ? '(' + b.enc + ', ' + b.unzippedKb + ' KB unzipped) ' : '') + b.url + '  @' + (b.endMs / 1000).toFixed(1) + ' s');
  console.log('  BY FOLDER (before first play):');
  for (const f of r.folders.slice(0, o_top())) console.log('    ' + String(f.mb.toFixed(2)).padStart(6) + ' MB ' + String(f.files).padStart(4) + ' files  ' + f.path);
  if (r.biggestAfter.length) { console.log('  BIGGEST AFTER:'); for (const b of r.biggestAfter) console.log('    ' + String(b.kb).padStart(6) + ' KB  ' + b.url + '  @' + (b.endMs / 1000).toFixed(1) + ' s'); }
  if (r.errors.length) console.log('  page errors: ' + r.errors.join(' | '));
}

function o_top() { return 25; }
module.exports = { measure, print, MB };

if (require.main === module) {
  const a = process.argv.slice(2), arg = (k, dflt) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : dflt; };
  (async () => {
    const r = await measure({ alpha: a.includes('--alpha'), profile: arg('--profile', 'phone_portrait'), throttle: +arg('--throttle', 4), linger: +arg('--linger', 20000), top: +arg('--top', 15), base: arg('--base', null), off: a.includes('--off') });
    print(r);
    const out = arg('--json', null); if (out) fs.writeFileSync(out, JSON.stringify(r, null, 1));
    process.exit(0);
  })().catch(e => { console.error(e); process.exit(2); });
}
