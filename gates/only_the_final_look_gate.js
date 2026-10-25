/* ==========================================================================
   ONLY THE FINAL LOOK  (RUN, 10/25/26, VAMILY [only the final look loads], rule 174)

   PAOLO 10/25: "I'm still seeing the months-ago 2-D character skins underneath everything... just have things that are
   going to be final visuals load... we don't need a whole 2-D world underneath it... you say you're loading, I press go,
   and it's still loading ghost month-old bullshit before I see the 3-D maps."

   MEASURED BEFORE (BUILD 10/25o, his computer's profile, every painted frame from GO): his old 2-D body on the old per-block
   pictures for 2.9 s, then the 3-D crew on the old blocks until 4.8 s, then the painted map; and 28.5 MB of the old street-
   tile bank and the 1.6 MB baked 2-D crowd fetched AFTER GO. records/BOHEMIA_RUN_THE_CRASH_AND_ONLY_THE_FINAL_LOOK_10_25_26.md

   THE DEMO, AS A STRANGER (NEW GAME, the fog on), on his computer and on a phone held upright:
     F1 no dead file is requested at any moment, title to twelve seconds after GO (the late tile bank, the baked 2-D cast and
        crowd, the towns' stand-in pictures)
     F2 the loading screen held GO until the map said its final look was in (mapFinalLook), and never timed out
     F3 from GO, no dead layer is drawn at any moment: the old per-block pictures, his and the crowd's old 2-D bodies, the old
        flat marks, the old building pictures (a census of every drawImage in every frame, by what the picture is)
     F4 the first frame after GO is the final look: the same scene as three seconds later (the glass compared, HUD aside), and
        not the loading screen
     F5 the times are written: title to GO, GO to the first frame (records/run/ONLY_THE_FINAL_LOOK.json)
   node gates/only_the_final_look_gate.js [--profile computer|phone_portrait]
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n + (why ? ' (' + why + ')' : '')); } };
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const PROFILES = arg('profile', null) ? [arg('profile')] : ['computer', 'phone_portrait'];

/* the dead files: never requested by the demo at any moment */
const DEAD_FILES = [/BOHEMIA_CITY_TILES_0[2-9]\.js$/, /BOHEMIA_CITY_TILES_READY\.js$/, /BOHEMIA_DEMO_CAST\.json$/, /BOHEMIA_DEMO_CROWD\.json$/,
  /map_towns\/BOHEMIA_TOWN_IN_GROUND_[a-z]+\.png$/];
/* the dead layers: a draw from any of these after GO is an old look on his glass */
const DEAD_DRAWS = [/at decodePlayerFrame/, /at mapArtSprite/, /at drawHero/, /at mapBaseSprite/, /BOHEMIA_TOWN_IN_GROUND/];

const ARM = `(() => {
  if (window.top === window) { const iv = setInterval(() => { const f = document.getElementById('front');
    if (window.__GO_AT) { clearInterval(iv); return; }
    if (f && window.__LOAD_READY && getComputedStyle(f).display === 'none') window.__GO_AT = Date.now(); }, 8); }
  if (window.__CEN) return; const C = window.__CEN = { b: {}, site: new WeakMap(), blocks: 0, blocksAt: null };
  const site = () => { try { return new Error().stack.split('\\n').slice(3, 4).join('').replace(/https?:\\/\\/[^/]+\\//g, '').replace(/\\s+/g, ' ').slice(0, 120); } catch (e) { return '?'; } };
  const ce = Document.prototype.createElement;
  Document.prototype.createElement = function (t, o) { const e = ce.call(this, t, o); const n = String(t).toLowerCase(); if (n === 'canvas' || n === 'img') C.site.set(e, site()); return e; };
  const I0 = window.Image; window.Image = function (...a) { const im = new I0(...a); C.site.set(im, site()); return im; }; window.Image.prototype = I0.prototype;
  const keyOf = (img) => { try {
    if (img instanceof HTMLImageElement) { const s = String(img.currentSrc || img.src || ''); return s.startsWith('data:') ? 'img data: ' + (C.site.get(img) || '?') : 'img ' + s.replace(/^https?:\\/\\/[^/]+\\//, ''); }
    if (img instanceof HTMLCanvasElement) return 'canvas ' + (C.site.get(img) || '?');
    return 'other ' + String(img && img.src || '').replace(/^https?:\\/\\/[^/]+\\//, '');
  } catch (e) { return 'err'; } };
  const P = CanvasRenderingContext2D.prototype, d0 = P.drawImage;
  P.drawImage = function (img) { try { const g = window.top.__GO_AT || 0; if (g) { const k = keyOf(img), t = Math.floor((Date.now() - g) / 500);
      const bk = C.b[t] || (C.b[t] = {}); bk[k] = (bk[k] || 0) + 1; } } catch (e) {} return d0.apply(this, arguments); };
  /* the old per-block pictures: the map says so on every paint */
  try { Object.defineProperty(window, '__MAP_BLOCKS_DREW', { configurable: true, get() { return C._mb; },
    set(v) { C._mb = v; try { if (v && window.top.__GO_AT) { C.blocks++; if (C.blocksAt === null) C.blocksAt = Date.now() - window.top.__GO_AT; } } catch (e) {} } }); } catch (e) {}
})();`;

async function one(profile) {
  console.log('== ' + profile);
  const frames = []; let cdpS = null;
  const d = await D.open({ file: 'BOHEMIA_DEMO.html', arm: ARM, keepCards: false, profile, fog: true,
    beforeTap: async (page) => {
      cdpS = await page.context().newCDPSession(page);
      cdpS.on('Page.screencastFrame', async (f) => { frames.push({ t: Math.round(f.metadata.timestamp * 1000), data: f.data }); try { await cdpS.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) {} });
      await cdpS.send('Page.startScreencast', { format: 'png', everyNthFrame: 1, maxWidth: 720, maxHeight: 720 });
    } });
  const R = { profile, file: d.openedFile() };
  try {
    const page = d.page;
    for (let i = 0; i < 100 && !(await page.evaluate(() => window.__GO_AT || 0)); i++) await page.waitForTimeout(100);
    const GO = await page.evaluate(() => window.__GO_AT || 0);
    await page.waitForTimeout(12000);
    await cdpS.send('Page.stopScreencast').catch(() => {});
    const t00 = d.bootAt();
    R.goMs = GO ? GO - t00 : null;
    R.titleToGoMs = GO ? GO - t00 : null;
    /* F1 */
    const dead = d.loads.filter((l) => DEAD_FILES.some((re) => re.test(l.url)));
    R.requests = d.loads.length; R.deadRequests = dead.map((l) => l.url);
    R.afterGo = d.loads.filter((l) => GO && t00 + l.at >= GO).map((l) => [l.at - (GO - t00), l.url, l.bytes]);
    ok('F1 no dead file requested, title to 12 s after GO (' + d.loads.length + ' requests' + (dead.length ? '; dead: ' + [...new Set(dead.map((l) => l.url))].join(' ') : '') + ')', dead.length === 0);
    /* F2 */
    const held = await page.evaluate(() => { const f = document.getElementById('cityFrame'); let w = null; try { w = f.contentWindow; } catch (e) {}
      return { timedOut: window.__FINAL_LOOK_TIMED_OUT || null, readyAt: w && w.FINAL_LOOK ? w.FINAL_LOOK.readyAt : null, asks: w && w.FINAL_LOOK ? w.FINAL_LOOK.asks : 0, now: w ? w.mapFinalLook && w.mapFinalLook() : null, why: w && w.FINAL_LOOK ? w.FINAL_LOOK.why : null }; });
    R.held = held;
    ok('F2 the loading screen held GO until the final look was in (asked ' + held.asks + ' times, ready ' + (held.readyAt !== null ? 'yes' : 'no') + ', timed out: ' + (held.timedOut || 'no') + ')',
      !held.timedOut && held.asks > 0 && held.readyAt !== null && held.now === true);
    /* F3 */
    const cen = {};
    let blocks = 0, blocksAt = null;
    for (const f of page.frames()) { try { const r = await f.evaluate(() => window.__CEN ? { b: window.__CEN.b, blocks: window.__CEN.blocks, at: window.__CEN.blocksAt } : null);
      if (r) { blocks += r.blocks; if (r.at !== null && (blocksAt === null || r.at < blocksAt)) blocksAt = r.at;
        Object.entries(r.b).forEach(([t, kk]) => Object.entries(kk).forEach(([k, n]) => { if (+t < 0) return; cen[k] = (cen[k] || 0) + n; })); } } catch (e) {} }
    const deadDraws = Object.entries(cen).filter(([k]) => DEAD_DRAWS.some((re) => re.test(k)));
    R.drawsAfterGo = Object.entries(cen).sort((a, b) => b[1] - a[1]).slice(0, 30); R.deadDraws = deadDraws; R.oldBlocks = { paints: blocks, firstAt: blocksAt };
    ok('F3 from GO no dead layer drawn (' + Object.values(cen).reduce((a, b) => a + b, 0) + ' draws from ' + Object.keys(cen).length + ' sources; old per-block paints ' + blocks
      + (deadDraws.length ? '; dead: ' + deadDraws.map((x) => x[0] + ' x' + x[1]).join(' | ') : '') + ')', deadDraws.length === 0 && blocks === 0);
    /* F4: the first frame after GO against the frame 3 s later, the map's middle (HUD and phone aside) */
    const after = frames.filter((f) => GO && f.t >= GO);
    let f4 = null;
    if (after.length > 2) {
      const { execFileSync } = require('child_process');
      const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'finallook-'));
      const a = after[0], b = after.filter((f) => f.t >= a.t + 3000)[0] || after[after.length - 1];
      fs.writeFileSync(path.join(dir, 'a.png'), Buffer.from(a.data, 'base64')); fs.writeFileSync(path.join(dir, 'b.png'), Buffer.from(b.data, 'base64'));
      const out = execFileSync('python3', ['-c', `
import sys, json, numpy as np
from PIL import Image
a = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(float); b = np.asarray(Image.open(sys.argv[2]).convert('RGB')).astype(float)
h, w = a.shape[:2]; y0, y1, x0, x1 = int(h * .18), int(h * .82), int(w * .1), int(w * .72)
d = np.abs(a[y0:y1, x0:x1] - b[y0:y1, x0:x1]).mean()
lum = a[y0:y1, x0:x1].mean()
print(json.dumps({'meanDiff': round(float(d), 2), 'lum': round(float(lum), 1)}))
`, path.join(dir, 'a.png'), path.join(dir, 'b.png')], { encoding: 'utf8' });
      f4 = JSON.parse(out.trim()); f4.firstMs = a.t - GO; f4.laterMs = b.t - GO;
    }
    R.firstFrame = f4;
    ok('F4 the first frame after GO is the scene he plays (' + (f4 ? 'at +' + f4.firstMs + ' ms, mean difference ' + f4.meanDiff + ' against +' + f4.laterMs + ' ms' : 'no frames') + ')',
      !!f4 && f4.firstMs < 250 && f4.meanDiff < 12);
    /* F5 */
    ok('F5 the times are written (title to GO ' + (R.titleToGoMs / 1000).toFixed(1) + ' s; GO to the first frame ' + (f4 ? f4.firstMs : '?') + ' ms)', R.titleToGoMs > 0 && !!f4);
    R.errors = d.errs.slice(0, 10);
  } catch (e) { ok('the run finished [' + String(e && e.message).slice(0, 200) + ']', false); }
  await d.close();
  return R;
}

(async () => {
  const out = { when: new Date().toISOString(), runs: [] };
  for (const p of PROFILES) out.runs.push(await one(p));
  const file = path.join(ROOT, 'records/run/ONLY_THE_FINAL_LOOK' + (PROFILES.length === 1 ? '_' + PROFILES[0] : '') + '.json');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(out, null, 1));
  console.log('ONLY THE FINAL LOOK: ' + pass + ' passed, ' + fail + ' failed  (' + path.relative(ROOT, file) + ')');
  process.exit(fail ? 1 : 0);
})();
