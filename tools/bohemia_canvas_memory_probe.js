/* BOHEMIA — THE CANVAS MEMORY PROBE (7/27/26)
 *
 * Section 8 of laws/BOHEMIA_MOBILE_RENDER_CONTRACT_7_26_26.md said, in its own
 * words, "NOT YET INSTRUMENTED. No session has measured live canvas bytes on a
 * real device... Instrumenting it is a backlog item, not a claim." This is that
 * instrument. It exists BEFORE the tile set multiplies, because the whole point
 * of the clause is that chunk caches times era variants is how a small game
 * hits a 224 MB wall, and you cannot notice that happening if nobody is
 * counting.
 *
 * WHAT IT MEASURES, and it is bytes the browser actually holds, not an estimate
 * of what the source implies:
 *   1. CANVAS BACKING STORES. Every canvas the page owns - in the DOM, detached
 *      in a cache, or an OffscreenCanvas - at width * height * 4. The registry
 *      is installed by addInitScript so it is in place BEFORE the page's first
 *      line runs, and it holds WeakRefs, so a canvas the app has genuinely let
 *      go stops counting. An LRU that works therefore shows up as a number that
 *      stops climbing, which is exactly the property the clause asks for.
 *   2. DECODED IMAGE BYTES. An <img> costs naturalW * naturalH * 4 once decoded,
 *      no matter how small the PNG was. The alpha is 33 MB of base64 art; that
 *      art is the memory, and counting only canvases would miss most of it.
 *   3. IMAGEBITMAPS, wrapped at createImageBitmap.
 *   4. The JS heap, via performance.memory, reported alongside but never mixed
 *      in - it is a different pool.
 *
 * THE HONESTY CLAUSE, and it stays in every output this thing writes: THIS IS A
 * HEADLESS DESKTOP CHROMIUM MEASUREMENT. It is not an iPhone. Backing-store
 * bytes are the same arithmetic on any device, so those numbers transfer; the
 * JS heap and the compositor's own copies do not. What this proves is the shape
 * of the curve - does memory level off as you walk, or climb forever - and that
 * is the thing that kills a phone. A real-device number still needs a real
 * device.
 *
 * WHAT IT DELIBERATELY DOES NOT DO: it does not touch a single line of engine
 * code, it renders no art, and it changes no behaviour. It reads.
 *
 * REUSE CHECK: cooks no graphic pixels and opens no bank. It drives the already
 * shipped surfaces (slices/BOHEMIA_ALPHA_0_9.html, BOHEMIA_RUN_CURRENT.html,
 * BOHEMIA_CITY_CURRENT.html) in a real browser and reads numbers off them.
 *
 *   node tools/bohemia_canvas_memory_probe.js
 *     -> records/target/BOHEMIA_CANVAS_MEMORY.json
 */
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const md5 = f => crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex');
function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}
const REPO = path.dirname(__dirname);
const MB = 1024 * 1024;

/* The iOS Safari live-canvas floor from the contract. Not a number this tool
 * invented - it is read back out of the law so the two can never drift. */
const CONTRACT = path.join(REPO, 'laws', 'BOHEMIA_MOBILE_RENDER_CONTRACT_7_26_26.md');
function iosFloorMB() {
  const m = /iOS Safari canvas floor to respect is \*\*~(\d+) MB\*\*/
    .exec(fs.readFileSync(CONTRACT, 'utf8'));
  if (!m) throw new Error('the contract no longer states an iOS floor; fix the law first');
  return parseInt(m[1], 10);
}

/* Installed before the page's first line. Everything in here runs in the page. */
const REGISTRY = `(function(){
  var R = { canvas: [], img: [], bitmap: [] };
  window.__BOH_MEM = R;
  function track(list, o){ try { list.push(new WeakRef(o)); } catch(e) {} return o; }

  var ce = document.createElement.bind(document);
  document.createElement = function(tag){
    var el = ce.apply(null, arguments);
    var t = String(tag).toLowerCase();
    if (t === 'canvas') track(R.canvas, el);
    else if (t === 'img') track(R.img, el);
    return el;
  };
  var NativeImage = window.Image;
  window.Image = function(w, h){ return track(R.img, new NativeImage(w, h)); };
  window.Image.prototype = NativeImage.prototype;
  if (window.OffscreenCanvas) {
    var OC = window.OffscreenCanvas;
    window.OffscreenCanvas = function(w, h){ return track(R.canvas, new OC(w, h)); };
    window.OffscreenCanvas.prototype = OC.prototype;
  }
  if (window.createImageBitmap) {
    var cib = window.createImageBitmap;
    window.createImageBitmap = function(){
      return cib.apply(window, arguments).then(function(b){ return track(R.bitmap, b); });
    };
  }

  /* Live bytes, right now. WeakRefs that no longer deref are dropped, so a
     cache that actually evicts shows as a number that stops growing. */
  window.__bohMem = function(){
    var seen = new Set(), out = { canvas: 0, canvases: 0, img: 0, imgs: 0,
                                  bitmap: 0, bitmaps: 0, biggest: [] };
    function addCanvas(c){
      if (!c || seen.has(c)) return;
      seen.add(c);
      var w = c.width | 0, h = c.height | 0;
      if (!w || !h) return;
      out.canvas += w * h * 4; out.canvases++;
      out.biggest.push({ kind: 'canvas', id: c.id || '(detached)', w: w, h: h, bytes: w * h * 4 });
    }
    Array.prototype.forEach.call(document.querySelectorAll('canvas'), addCanvas);
    R.canvas.forEach(function(ref){ addCanvas(ref.deref()); });
    R.img.forEach(function(ref){
      var i = ref.deref();
      if (!i || seen.has(i)) return;
      seen.add(i);
      var w = i.naturalWidth | 0, h = i.naturalHeight | 0;
      if (!w || !h) return;                       /* not decoded = not resident */
      out.img += w * h * 4; out.imgs++;
      out.biggest.push({ kind: 'img', id: (i.id || i.className || '(img)'),
                         w: w, h: h, bytes: w * h * 4 });
    });
    Array.prototype.forEach.call(document.images, function(i){
      if (seen.has(i)) return;
      seen.add(i);
      var w = i.naturalWidth | 0, h = i.naturalHeight | 0;
      if (!w || !h) return;
      out.img += w * h * 4; out.imgs++;
      out.biggest.push({ kind: 'img', id: (i.id || i.className || '(img)'),
                         w: w, h: h, bytes: w * h * 4 });
    });
    R.bitmap.forEach(function(ref){
      var b = ref.deref();
      if (!b || seen.has(b) || !b.width) return;
      seen.add(b);
      out.bitmap += b.width * b.height * 4; out.bitmaps++;
    });
    out.total = out.canvas + out.img + out.bitmap;
    out.biggest.sort(function(a, b){ return b.bytes - a.bytes; });
    out.biggest = out.biggest.slice(0, 8);
    out.heap = (performance.memory && performance.memory.usedJSHeapSize) || null;
    return out;
  };
})()`;

/* The heap is read over CDP, not off performance.memory. performance.memory
 * quantizes hard - it reported the alpha at a flat "139000000" and the run slice
 * at a flat "18200000" three measurements running, which cannot tell you whether
 * anything grew. Runtime.getHeapUsage after a forced collection is the real
 * number, and forcing the collection first is the whole point: an uncollected
 * heap makes a leak and a full nursery look identical. */
/* EVERY FRAME COUNTS. The alpha carries its biggest module - the streaming
 * Las Vegas world - inside an iframe, so a main-frame-only reading would report
 * the one surface that holds the most pixels as holding none. addInitScript
 * installs the registry in every frame; this adds up what they all report. */
async function pixels(p) {
  const parts = [];
  for (const f of p.frames()) {
    try {
      const r = await f.evaluate(() => (window.__bohMem ? window.__bohMem() : null));
      if (!r) continue;
      /* WHICH MODULE. The alpha embeds its labs as base64 iframes, so "2604
       * canvases" with no address is a number nobody can act on. The frame's own
       * name is the address, and it is what turns this record from a warning
       * into a work item. */
      r.frame = f === p.mainFrame() ? '(main)' : (f.name() || null);
      if (!r.frame) {
        try {
          const el = await f.frameElement();
          r.frame = await el.evaluate(n => n.id || n.className || '(embedded module)');
        } catch (e) { r.frame = '(embedded module)'; }
      }
      parts.push(r);
    } catch (e) { /* a frame that navigated mid-read is not a measurement */ }
  }
  const out = { canvas: 0, canvases: 0, img: 0, imgs: 0, bitmap: 0, bitmaps: 0,
                biggest: [], frames: parts.length, by_frame: [] };
  for (const r of parts) {
    for (const k of ['canvas', 'canvases', 'img', 'imgs', 'bitmap', 'bitmaps']) out[k] += r[k];
    out.biggest = out.biggest.concat(r.biggest);
    if (r.canvas + r.img > 0) {
      out.by_frame.push({ frame: r.frame, canvases: r.canvases,
                          canvas_mb: +((r.canvas) / (1024 * 1024)).toFixed(1),
                          img_mb: +((r.img) / (1024 * 1024)).toFixed(1) });
    }
  }
  out.by_frame.sort((a, b) => (b.canvas_mb + b.img_mb) - (a.canvas_mb + a.img_mb));
  out.total = out.canvas + out.img + out.bitmap;
  out.biggest.sort((a, b) => b.bytes - a.bytes);
  out.biggest = out.biggest.slice(0, 8);
  return out;
}

async function measure(p, cdp, label) {
  await cdp.send('HeapProfiler.collectGarbage');
  const m = await pixels(p);
  const usage = await cdp.send('Runtime.getHeapUsage');
  m.moment = label;
  m.heap_precise = Math.round(usage.usedSize);
  console.log('    %s canvas %s MB (%d)  img %s MB (%d)  = %s MB   heap %s MB   [%d frames]',
    String(label).padEnd(18), (m.canvas / MB).toFixed(1), m.canvases,
    (m.img / MB).toFixed(1), m.imgs, (m.total / MB).toFixed(1),
    (m.heap_precise / MB).toFixed(1), m.frames);
  return m;
}

/* Walk the run slice a long way. This is the only exercise that matters: the
 * clause is about caches multiplying as the world streams past you.
 *
 * IT REPORTS WHERE IT ACTUALLY ENDED UP. A probe that presses 480 keys into a
 * page that ignored them, and then reports "memory did not grow", is a lie with
 * a number attached. The position before and after goes in the record, and the
 * gate refuses a walk that did not move. */
async function walk(p, steps) {
  const keys = ['ArrowRight', 'ArrowRight', 'ArrowDown', 'ArrowRight',
                'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowDown'];
  for (let i = 0; i < steps; i++) {
    await p.keyboard.press(keys[i % keys.length]);
    if (i % 24 === 0) await p.waitForTimeout(60);
  }
  await p.waitForTimeout(400);
}

/* GET OUT OF THE HOUSE FIRST. The run slice starts you standing in your own
 * bedroom, and 480 arrow presses against a bedroom wall move you one tile and
 * measure nothing - the streaming world is OUTSIDE. So: steer for the front
 * door, and when an axis is blocked, take the other one. Reported either way. */
async function walkOutside(p, tries) {
  /* THE DOOR YOU WANT IS THE INTERIOR'S DOOR. state().homeDoor is in EXTERIOR
   * grid coordinates; while you are inside, px/py are interior coordinates, so
   * steering at homeDoor walks you at a wall in a different coordinate system.
   * That is exactly what the first run did, for ninety presses. */
  const door = await p.evaluate(() => {
    const i = window.__RUN.interior();
    return i && i.door ? [i.door.x !== undefined ? i.door.x : i.door[0],
                          i.door.y !== undefined ? i.door.y : i.door[1]] : null;
  });
  const st = await p.evaluate(() => window.__RUN.state());
  let last = { x: st.px, y: st.py }, stuck = 0, axis = 0;
  for (let i = 0; i < tries; i++) {
    const s = await p.evaluate(() => window.__RUN.state());
    if (s.mode !== 'int') return { got_out: true, at: [s.px, s.py], steps: i, door: door };
    const tx = door ? door[0] : s.px, ty = door ? door[1] : s.py;
    const dx = Math.sign(tx - s.px), dy = Math.sign(ty - s.py);
    let key;
    if ((axis === 0 && dx) || !dy) key = dx > 0 ? 'ArrowRight' : dx < 0 ? 'ArrowLeft' : 'ArrowDown';
    else key = dy > 0 ? 'ArrowDown' : 'ArrowUp';
    await p.keyboard.press(key);
    await p.waitForTimeout(45);
    if (s.px === last.x && s.py === last.y) { stuck++; if (stuck > 2) { axis ^= 1; stuck = 0; } }
    else stuck = 0;
    last = { x: s.px, y: s.py };
  }
  const s = await p.evaluate(() => window.__RUN.state());
  return { got_out: s.mode !== 'int', at: [s.px, s.py], steps: tries, door: door };
}

async function where(p) {
  return await p.evaluate(() => {
    try {
      const s = window.__RUN && window.__RUN.state ? window.__RUN.state() : null;
      return s ? { x: s.px, y: s.py, mode: s.mode, phase: s.phase } : null;
    } catch (e) { return null; }
  });
}

/* The alpha's exercise is not walking, it is Paolo's thumb: every tab, because
 * a tab he has not opened has not built its bodies yet. The peak is the build
 * after he has been everywhere, which is the state he is in five minutes in. */
async function visitEveryTab(p) {
  /* TAP TO ENTER. The front splash sits over the whole app, so every tab click
   * lands on the splash instead of the tab. The first probe silently timed out
   * on all eleven and reported the alpha as holding 0.8 MB of pixels, which is
   * what a build looks like when you have never opened it. */
  try { await p.click('#front', { timeout: 4000 }); await p.waitForTimeout(1200); }
  catch (e) { console.log('    (no front splash to dismiss)'); }
  const tabs = await p.evaluate(() =>
    Array.prototype.map.call(document.querySelectorAll('#tabs .tab'), t => t.dataset.p));
  const opened = [];
  for (const t of tabs) {
    /* Dispatched, not tapped. One tab sits under the toolbar's own scroll and a
     * real pointer never reaches it; the app's handler is the same either way,
     * and a tab this probe cannot open is a tab it cannot measure. */
    const ok = await p.evaluate((tab) => {
      const el = document.querySelector('#tabs .tab[data-p="' + tab + '"]');
      if (!el) return false;
      el.click();
      return true;
    }, t);
    if (ok) opened.push(t); else console.log('    (tab %s not found)', t);
    await p.waitForTimeout(1100);
  }
  return opened;
}

const SURFACES = [
  { file: 'BOHEMIA_RUN_CURRENT.html', name: 'RUN (the walked world)', exercise: 'walk',
    why: 'the surface that streams cells and therefore the one that can climb forever' },
  { file: 'BOHEMIA_CITY_CURRENT.html', name: 'CITY (the map)', exercise: null,
    why: 'the other shipped world surface' },
  { file: 'BOHEMIA_ALPHA_0_9.html', name: 'ALPHA (the shipped build)', exercise: 'tabs',
    why: 'what Paolo actually taps: every tab, every baked body, all in one page' },
];

(async () => {
  const floor = iosFloorMB();
  const { chromium } = playwright();
  const b = await chromium.launch({ args: ['--js-flags=--expose-gc'] });
  const results = [];
  for (const s of SURFACES) {
    console.log('  %s', s.name);
    const ctx = await b.newContext({
      viewport: { width: 390, height: 844 },        // iPhone portrait, the only shape
      deviceScaleFactor: 3,                          // and the 3x buffer it really has
    });
    await ctx.addInitScript(REGISTRY);
    const p = await ctx.newPage();
    p.on('pageerror', e => console.log('    PAGEERR', String(e).slice(0, 160)));
    const cdp = await ctx.newCDPSession(p);
    const t0 = Date.now();
    await p.goto('file://' + path.join(REPO, 'slices', s.file), { timeout: 180000 });
    await p.waitForTimeout(3500);
    const moments = [await measure(p, cdp, 'loaded')];
    const proof = {};
    if (s.exercise === 'walk') {
      proof.before = await where(p);
      proof.exit = await walkOutside(p, 90);
      moments.push(await measure(p, cdp, 'out of the house'));
      await walk(p, 120);
      moments.push(await measure(p, cdp, 'after 120 steps'));
      await walk(p, 360);
      moments.push(await measure(p, cdp, 'after 480 steps'));
      proof.after = await where(p);
      proof.moved = !!(proof.before && proof.after &&
        (proof.before.x !== proof.after.x || proof.before.y !== proof.after.y ||
         proof.before.mode !== proof.after.mode));
      console.log('    walked: %j -> %j  (moved: %s)', proof.before, proof.after, proof.moved);
    } else if (s.exercise === 'tabs') {
      proof.tabs = await visitEveryTab(p);
      moments.push(await measure(p, cdp, 'every tab opened'));
      proof.moved = proof.tabs.length > 1;
      console.log('    opened %d tabs: %s', proof.tabs.length, proof.tabs.join(' '));
    }
    const peak = Math.max(...moments.map(m => m.total));
    const heapPeak = Math.max(...moments.map(m => m.heap_precise));
    /* RESIDENT PEAK IS ONE MOMENT'S TOTAL, not the pixel peak added to the heap
     * peak. Those two maxima can land at different moments - the alpha's heap is
     * highest at load and its pixels are highest after every tab is open - and
     * adding them reports a state the tab was never actually in. */
    const residentPeak = Math.max(...moments.map(m => m.total + m.heap_precise));
    const last = moments[moments.length - 1];
    results.push({
      surface: s.file, name: s.name, why: s.why,
      load_ms: Date.now() - t0,
      exercise: s.exercise, exercise_proof: proof,
      moments: moments,
      peak_bytes: peak, peak_mb: +(peak / MB).toFixed(1),
      heap_peak_bytes: heapPeak, heap_peak_mb: +(heapPeak / MB).toFixed(1),
      /* graphics + heap, at the single worst moment. Not a canvas number and not
       * pretending to be one: it is what the tab is holding, which is what the
       * phone kills you for. */
      resident_peak_bytes: residentPeak,
      resident_peak_mb: +(residentPeak / MB).toFixed(1),
      growth_under_exercise_mb: +((last.total - moments[0].total) / MB).toFixed(1),
      heap_growth_under_exercise_mb:
        +((last.heap_precise - moments[0].heap_precise) / MB).toFixed(1),
      pct_of_ios_floor: +(100 * residentPeak / (floor * MB)).toFixed(1),
      pct_of_ios_floor_pixels_only: +(100 * peak / (floor * MB)).toFixed(1),
      surface_md5: md5(path.join(REPO, 'slices', s.file)),
    });
    await ctx.close();
  }
  await b.close();

  const worst = results.reduce(
    (a, r) => r.resident_peak_mb > a.resident_peak_mb ? r : a, results[0]);
  const out = {
    version: 'BOHEMIA_CANVAS_MEMORY_v2',
    measured: '2026-07-27',
    clause: 'section 8, laws/BOHEMIA_MOBILE_RENDER_CONTRACT_7_26_26.md',
    ios_floor_mb: floor,
    what_is_counted: 'canvas backing stores (w*h*4) + decoded image bytes + ImageBitmaps, '
      + 'WeakRef-tracked so anything the app has released stops counting; plus the JS '
      + 'heap read over CDP after a FORCED COLLECTION, which is the only way a leak and '
      + 'an uncollected nursery look different.',
    HONESTY: 'HEADLESS DESKTOP CHROMIUM, NOT AN IPHONE. Backing-store arithmetic is '
      + 'device-independent so those bytes transfer; the JS heap and the compositor\'s '
      + 'own copies do not. What this proves is the SHAPE of the curve - whether memory '
      + 'levels off under exercise - which is the thing that kills a phone. A real-device '
      + 'number still needs a real device.',
    THE_FINDING: 'The 224 MB clause watches canvases. Canvases are not where this game '
      + 'keeps its memory: every shipped surface holds single-digit MB of pixels, and the '
      + 'ALPHA holds most of a phone\'s budget in the JS HEAP instead - the art arrives as '
      + 'base64 strings and lives as JS pixel arrays, never as an image or a canvas. So '
      + 'the number to watch while the tile set multiplies is the heap, and this record '
      + 'tracks both.',
    /* WHEN THIS MEASUREMENT GOES STALE. The clause is specifically about the tile
     * set multiplying, so the tile set's own hash is recorded here and the gate
     * HARD FAILS if it moves without a fresh measurement. The three surfaces are
     * hashed too, but a moved surface is only REPORTED: every lane touches the
     * alpha on every ship, and a gate that made the whole fleet re-run a
     * three-minute browser probe to land a text change would be deleted inside a
     * week, which enforces nothing. The tile set is the thing that grows. */
    tileset: 'banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt',
    tileset_md5: md5(path.join(REPO, 'banks', 'BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt')),
    worst_surface: worst.name,
    worst_resident_peak_mb: worst.resident_peak_mb,
    worst_pct_of_floor: worst.pct_of_ios_floor,
    surfaces: results,
  };
  const dest = path.join(REPO, 'records', 'target', 'BOHEMIA_CANVAS_MEMORY.json');
  fs.writeFileSync(dest, JSON.stringify(out, null, 1));
  console.log('\n  WORST: %s at %s MB resident (%s MB pixels + %s MB heap) = %s%% of the %d MB floor',
    worst.name, worst.resident_peak_mb, worst.peak_mb, worst.heap_peak_mb,
    worst.pct_of_ios_floor, floor);
  console.log('OK -> records/target/BOHEMIA_CANVAS_MEMORY.json');
})();
