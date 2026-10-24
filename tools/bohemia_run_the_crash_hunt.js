#!/usr/bin/env node
/* ============================================================================
   THE CRASH HUNT (RUN 10/24/26, row [the crash and the save], rule 141(e))

   Paolo 10/24: 'it's crashing for different reasons... I was in the settlement
   menu, I just talked to everyone, and then it crashed.'

   A phone tab dies when it holds more than the phone lets it hold. So this does
   not guess: it boots the demo through the one driver on his phone's profile,
   walks into a town, and talks to EVERY person there (every keeper's door, every
   man in the crowd) with a finger, ROUND after ROUND. After each round it forces
   the garbage collector and counts what is still alive, in every frame:

     heap        the JS heap the whole page holds (the browser's own number)
     nodes       DOM nodes, event listeners, documents, frames (the browser's own)
     audio       every audio node ever made, how many are still CONNECTED (a node
                 nobody disconnects is a node the phone's audio graph keeps: Safari
                 frees an audio node only when it is disconnected), every audio
                 buffer decoded and its bytes as floats, every AudioContext
     canvas      every canvas made, how many still alive, their backing pixels
     images      every Image made and still alive
     timers      intervals still running; animation-frame callbacks a second

   A count that climbs with every round and never comes back is the leak. The
   numbers per round go to records/run/THE_CRASH_HUNT.json; the record names
   the cause.

     node tools/bohemia_run_the_crash_hunt.js [--rounds 6] [--file BOHEMIA_DEMO.html] [--out x.json]
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const D = require('./bohemia_drive_the_demo.js');

const ROOT = path.dirname(__dirname);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const ROUNDS = +arg('rounds', 6);
const FILE = arg('file', 'BOHEMIA_DEMO.html');
const OUT = arg('out', path.join(ROOT, 'records/run/THE_CRASH_HUNT.json'));

/* armed in EVERY document before its own scripts: the counters live on window.__LEAK of each frame */
const ARM = `(() => {
  if (window.__LEAK) return;
  const L = window.__LEAK = { nodes: [], bufs: [], canv: [], imgs: [], ctxs: [], iv: new Map(), raf: 0, conn: new WeakMap(), made: {} };
  const W = (a, o, x) => { try { a.push(Object.assign({ r: new WeakRef(o) }, x || {})); } catch (e) {} };
  const site = () => { try { const s = new Error().stack.split('\\n').slice(3, 5).join(' | '); return s.replace(/https?:\\/\\/[^/]+\\//g, '').replace(/\\s+/g, ' ').slice(0, 220); } catch (e) { return '?'; } };
  const AC = window.AudioContext || window.webkitAudioContext;
  if (AC) {
    const Wrapped = function (...a) { const c = new AC(...a); W(L.ctxs, c, { at: site() }); return c; };
    Wrapped.prototype = AC.prototype;
    try { window.AudioContext = Wrapped; } catch (e) {}
    const B = (window.BaseAudioContext || AC).prototype;
    Object.getOwnPropertyNames(B).forEach((m) => {
      if (!/^create/.test(m) || m === 'createBuffer' || m === 'createPeriodicWave') return;
      const f = B[m]; if (typeof f !== 'function') return;
      B[m] = function (...a) { const n = f.apply(this, a); L.made[m] = (L.made[m] || 0) + 1; W(L.nodes, n, { kind: m, at: site() }); return n; };
    });
    const cb = B.createBuffer;
    B.createBuffer = function (ch, len, sr) { const b = cb.apply(this, arguments); W(L.bufs, b, { bytes: ch * len * 4, at: site() }); return b; };
    const dec = B.decodeAudioData;
    B.decodeAudioData = function (ab, ok, bad) {
      const at = site();
      const keep = (b) => { if (b) W(L.bufs, b, { bytes: b.numberOfChannels * b.length * 4, at: at }); return b; };
      const p = dec.call(this, ab, (b) => { keep(b); if (ok) ok(b); }, bad);
      return p && p.then ? p.then((b) => b) : p;
    };
    const N = window.AudioNode.prototype, cn = N.connect, dc = N.disconnect;
    N.connect = function (...a) { L.conn.set(this, (L.conn.get(this) || 0) + 1); return cn.apply(this, a); };
    N.disconnect = function (...a) { L.conn.set(this, a.length ? Math.max(0, (L.conn.get(this) || 0) - 1) : 0); return dc.apply(this, a); };
  }
  const ce = Document.prototype.createElement;
  Document.prototype.createElement = function (t, o) { const e = ce.call(this, t, o); const n = String(t).toLowerCase();
    if (n === 'canvas') W(L.canv, e, { at: site() }); else if (n === 'img') W(L.imgs, e, { at: site() }); return e; };
  const I0 = window.Image;
  window.Image = function (...a) { const im = new I0(...a); W(L.imgs, im, { at: site() }); return im; };
  window.Image.prototype = I0.prototype;
  const si = window.setInterval, ci = window.clearInterval;
  window.setInterval = function (f, ms, ...a) { const id = si.call(window, f, ms, ...a); L.iv.set(id, { ms: ms, at: site() }); return id; };
  window.clearInterval = function (id) { L.iv.delete(id); return ci.call(window, id); };
  const ra = window.requestAnimationFrame;
  window.requestAnimationFrame = function (f) { L.raf++; return ra.call(window, f); };
  L.snap = () => {
    const alive = (a) => a.map((x) => Object.assign({ o: x.r.deref() }, x)).filter((x) => x.o);
    const nodes = alive(L.nodes), conn = nodes.filter((x) => (L.conn.get(x.o) || 0) > 0);
    const bufs = alive(L.bufs), canv = alive(L.canv), imgs = alive(L.imgs);
    const by = (a, k) => { const m = {}; a.forEach((x) => { const v = typeof k === 'function' ? k(x) : x[k]; m[v] = (m[v] || 0) + 1; }); return m; };
    const top = (m, n) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n || 6);
    const r = {
      url: location.pathname.split('/').pop(),
      audio: { made: L.nodes.length, alive: nodes.length, connected: conn.length, connectedBy: by(conn, 'kind'),
               connectedAt: top(by(conn, 'at'), 4), ctxs: alive(L.ctxs).length,
               bufs: bufs.length, bufMB: +(bufs.reduce((s, x) => s + x.bytes, 0) / 1048576).toFixed(1),
               bufsAt: top(by(bufs, (x) => x.at.split(' | ')[0]), 4) },
      canvas: { made: L.canv.length, alive: canv.length, onPage: canv.filter((x) => x.o.isConnected).length,
                MB: +(canv.reduce((s, x) => s + (x.o.width * x.o.height * 4), 0) / 1048576).toFixed(1),
                aliveAt: top(by(canv.filter((x) => !x.o.isConnected), 'at'), 4) },
      images: { made: L.imgs.length, alive: imgs.length, files: (() => { const u = {}; imgs.forEach((x) => { u[x.o.currentSrc || x.o.src || ''] = 1; }); return Object.keys(u).length; })(),
                /* one decoded copy per FILE (the browser shares it between Image objects of the same src) */
                MB: +((() => { const u = {}; imgs.forEach((x) => { u[x.o.currentSrc || x.o.src || ''] = (x.o.naturalWidth || 0) * (x.o.naturalHeight || 0) * 4; }); return Object.values(u).reduce((a, b) => a + b, 0); })() / 1048576).toFixed(1),
                byDir: top((() => { const m = {}, seen = {}; imgs.forEach((x) => { const u = String(x.o.currentSrc || x.o.src || ''); const k = u.startsWith('data:') ? 'data:' + u.slice(5, 20) : u.replace(/^https?:\\/\\/[^/]+\\//, '').replace(/[^/]+$/, ''); if (seen[u]) return; seen[u] = 1; m[k] = (m[k] || 0) + (x.o.naturalWidth || 0) * (x.o.naturalHeight || 0) * 4 / 1048576; }); Object.keys(m).forEach((k) => { m[k] = +m[k].toFixed(1); }); return m; })(), 8),
                biggest: [...new Map(imgs.map((x) => [x.o.currentSrc || x.o.src, x])).values()].map((x) => [String(x.o.currentSrc || x.o.src || '').replace(/^https?:\\/\\/[^/]+\\//, '').slice(0, 90), x.o.naturalWidth + 'x' + x.o.naturalHeight]).sort((a, b) => { const n = (s) => s[1].split('x').reduce((p, v) => p * v, 1); return n(b) - n(a); }).slice(0, 8),
                at: top(by(imgs, (x) => x.at.split(' | ')[0]), 5) },
      timers: { intervals: L.iv.size, intervalsAt: top(by([...L.iv.values()], 'at'), 4), raf: L.raf }
    };
    L.raf = 0;
    return r;
  };
})();`;

async function main() {
  const d = await D.open({ file: FILE, arm: ARM, keepCards: false });
  const page = d.page, fr = d.fr;
  const cdp = await d.ctx.newCDPSession(page);
  await cdp.send('Performance.enable');
  const H = { file: FILE, when: new Date().toISOString(), box: 'Playwright Chromium, phone 390x844 touch, full CPU', rounds: [] };
  const snapAll = async (label) => {
    await cdp.send('HeapProfiler.collectGarbage').catch(() => {});
    await page.waitForTimeout(300);
    await cdp.send('HeapProfiler.collectGarbage').catch(() => {});
    const m = {}; (await cdp.send('Performance.getMetrics')).metrics.forEach((x) => { m[x.name] = x.value; });
    const frames = [];
    for (const f of page.frames()) { try { const s = await f.evaluate(() => window.__LEAK ? window.__LEAK.snap() : null); if (s) frames.push(s); } catch (e) {} }
    const sum = (fn) => frames.reduce((s, x) => s + fn(x), 0);
    const row = { label, heapMB: +(m.JSHeapUsedSize / 1048576).toFixed(1), domNodes: m.Nodes, listeners: m.JSEventListeners, documents: m.Documents, frames: m.Frames,
      audioMade: sum((x) => x.audio.made), audioConnected: sum((x) => x.audio.connected), audioCtxs: sum((x) => x.audio.ctxs), audioBufMB: +sum((x) => x.audio.bufMB).toFixed(1),
      canvasAlive: sum((x) => x.canvas.alive), canvasOffPage: sum((x) => x.canvas.alive - x.canvas.onPage), canvasMB: +sum((x) => x.canvas.MB).toFixed(1),
      imagesAlive: sum((x) => x.images.alive), imagesMB: +sum((x) => x.images.MB).toFixed(1), intervals: sum((x) => x.timers.intervals),
      perFrame: frames };
    console.log('  ' + label.padEnd(14) + ' heap ' + row.heapMB + ' MB  dom ' + row.domNodes + '  listeners ' + row.listeners + '  docs ' + row.documents
      + '  | audio made ' + row.audioMade + ' connected ' + row.audioConnected + ' ctx ' + row.audioCtxs + ' buf ' + row.audioBufMB + ' MB'
      + '  | canvas ' + row.canvasAlive + ' (' + row.canvasOffPage + ' off page) ' + row.canvasMB + ' MB  | img ' + row.imagesAlive + ' ' + row.imagesMB + ' MB  | intervals ' + row.intervals);
    return row;
  };
  try {
    await page.waitForTimeout(6000);   /* the squiggle bank loads 4 s after the music runs */
    H.rounds.push(await snapAll('on the map'));
    /* into the nearest town (the scripted door: the talks are what is measured, and they are real touches) */
    const town = await fr.evaluate(() => { const bs = ctBases() || {}; let n = null, best = 1e9;
      for (const k in bs) { const b = bs[k], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd < best) { best = dd; n = k; } }
      const b = bs[n]; return { name: n, x: b.x, y: b.y, tier: mapTierOf(n) }; });
    H.town = town;
    await fr.evaluate((t) => loopOpenTown(t), town);
    const fh = await fr.waitForSelector('#settleFrame', { timeout: 20000 });
    const sf = await fh.contentFrame();
    await sf.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.folk().length > 0, null, { timeout: 30000 });
    await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1500);
    H.rounds.push(await snapAll('in the town'));
    const off = async () => { const a = await (await fr.frameElement()).boundingBox(), b = await fh.boundingBox(); return { x: a.x + b.x, y: a.y + b.y }; };
    const close = async () => { if (await sf.evaluate(() => document.getElementById('sheet').classList.contains('on'))) {
      const b = await sf.evaluate(() => { const r = document.getElementById('close').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      const o = await off(); await page.touchscreen.tap(o.x + b.x, o.y + b.y); await page.waitForTimeout(250); } };
    for (let round = 1; round <= ROUNDS; round++) {
      let talks = 0, opened = 0;
      for (const k of await sf.evaluate(() => BohemiaSettlement.order())) {
        await close();
        const xy = await sf.evaluate((k) => BohemiaSettlement.where(k), k); if (!xy) continue;
        const o = await off(); await page.touchscreen.tap(o.x + xy.x, o.y + xy.y); talks++;
        await page.waitForTimeout(1600);   /* he reads the line: the voice says it */
        if (await sf.evaluate(() => document.getElementById('sheet').classList.contains('on'))) opened++;
      }
      const n = await sf.evaluate(() => BohemiaSettlement.folk().length);
      for (let i = 0; i < n; i++) {
        await close();
        const pt = await sf.evaluate((i) => { const q = BohemiaSettlement.folk()[i]; if (!q || q.keeper || q.walker) return null; const s0 = BohemiaSettlement.scale(); BohemiaSettlement.where(q.keeper ? q.k : 'stall');
          const v = BohemiaSettlement._view(), r = document.getElementById('scene').getBoundingClientRect();
          return { x: r.left + v.ox + q.x * v.s, y: r.top + v.oy + (q.y - s0.person * 0.45) * v.s }; }, i);
        if (!pt) continue;
        await page.waitForTimeout(120);
        const o = await off(); await page.touchscreen.tap(o.x + pt.x, o.y + pt.y); talks++;
        await page.waitForTimeout(1600);
        if (await sf.evaluate(() => BohemiaSettlement.state.open === 'person')) {
          opened++;
          /* and asks who he is, when he can (a second line in his mouth) */
          const ask = await sf.evaluate(() => { const b = [...document.querySelectorAll('#sbody button, #sbody .act')].filter((e) => /Who are you/i.test(e.textContent))[0]; if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
          if (ask) { const o2 = await off(); await page.touchscreen.tap(o2.x + ask.x, o2.y + ask.y); talks++; await page.waitForTimeout(1600); }
        }
      }
      await close();
      const row = await snapAll('round ' + round);
      row.talks = talks; row.opened = opened;
      H.rounds.push(row);
    }
    H.errors = d.errs.slice(0, 20);
  } finally {
    const slim = JSON.parse(JSON.stringify(H));
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(slim, null, 1));
    console.log('  wrote ' + path.relative(ROOT, OUT));
    await d.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
