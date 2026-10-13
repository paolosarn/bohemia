/* BAKE THE DEMO'S MAP PEOPLE  (RUN, 10/13/26, VAMILY [ten seconds to play] round four)

   The demo's map stands six people from the start, each in eight facings: a still and four breathing frames (the
   still IS the breath's 0.25 frame). Baking them was 1.0 s of the boot at full speed before BEGIN could light
   (about 4 s on a phone at 4x) and 1.2 s more of breath after it, and they are the same pictures every boot (hashed,
   THE DEMO BOOTS LIGHT B10). So the cut bakes them once, here, from the demo it just wrote, the game's own way: this
   opens the demo in a browser with the one-piece bake switched on (window.__BOH_CAST_WHOLE), catches the cast
   message the shell sends the map, and writes it beside the demo as slices/BOHEMIA_DEMO_CAST.json, under the key the
   cut wrote into the demo's first line (a fingerprint of the workshop it was cut from). The demo fetches the file in
   its first line and uses it only when the key matches; otherwise it bakes live, exactly as before.
   AND THE CROWD (round four, the same key): the six later people and all twelve walks, caught as the shell's two passes
   send them, into slices/BOHEMIA_DEMO_CROWD.json, which the demo asks for after the door.

     node tools/bohemia_bake_the_demo_cast.js     # run by tools/bohemia_cut_the_demo.js after every cut
*/
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname);
const DEMO = path.join(ROOT, 'slices/BOHEMIA_DEMO.html');
const OUT = path.join(ROOT, 'slices/BOHEMIA_DEMO_CAST.json');
const OUT2 = path.join(ROOT, 'slices/BOHEMIA_DEMO_CROWD.json');
let chromium;
try { chromium = require('playwright').chromium; } catch (_e) { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }

const html = fs.readFileSync(DEMO, 'utf8');
const km = html.match(/window\.__DEMO_CAST=\{state:"pending",key:"([0-9a-f]+)"/);
if (!km) { console.error('the demo carries no cast key (cut it with tools/bohemia_cut_the_demo.js first)'); process.exit(1); }
const KEY = km[1];

const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.css': 'text/css', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };

(async () => {
  const server = http.createServer((q, r) => {
    const u = decodeURIComponent(q.url.split('?')[0]), f = path.join(ROOT, u);
    if (!f.startsWith(ROOT)) { r.writeHead(403); return r.end(); }
    /* the bake never reads an older baked file */
    if (/BOHEMIA_DEMO_(CAST|CROWD)\.json$/.test(f)) { r.writeHead(404); return r.end(); }
    fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(b); });
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch();
  let out = null, err = null, crowd = null;
  try {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true });
    await ctx.addInitScript(() => {
      if (window === window.top) { window.__BOH_CAST_WHOLE = true; return; }
      /* in the map: the first whole cast (not a later person appended) */
      window.__CROWD_CAUGHT = { looks: [], walks: [] };
      window.addEventListener('message', (e) => { const m = e.data;
        if (m && m.type === 'BOHEMIA_CITY_CAST' && !m.append && !window.__CAST_CAUGHT) window.__CAST_CAUGHT = m;
        /* and the crowd after it: the later people (appended) and every walk */
        if (m && m.type === 'BOHEMIA_CITY_CAST' && m.append) (m.looks || []).forEach(l => __CROWD_CAUGHT.looks.push(l));
        if (m && m.type === 'BOHEMIA_CITY_CAST_WALK') __CROWD_CAUGHT.walks.push({ id: m.id, dirs: m.dirs }); });
    });
    const page = await ctx.newPage();
    await page.goto('http://127.0.0.1:' + server.address().port + '/slices/BOHEMIA_DEMO.html', { waitUntil: 'domcontentloaded', timeout: 120000 });
    const t0 = Date.now();
    while (Date.now() - t0 < 180000) {
      const fr = page.frames().find(f => /BOHEMIA_CITY_WORLD/.test(f.url()));
      if (fr) {
        out = await fr.evaluate(() => {
          const m = window.__CAST_CAUGHT; if (!m) return null;
          const b64 = (a) => { let s = ''; for (let i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000)); return btoa(s); };
          const enc = (f) => { const o = { w: f.w, h: f.h }; ['pal', 'rle', 'idx', 'raw'].forEach(k => { if (f[k]) o[k] = b64(f[k]); }); return o; };
          const phs = window.parent.eval('CAST_PHS'), at = phs.indexOf(0.25);
          const looks = m.looks.map(l => { const dirs = {};
            Object.keys(l.dirs).forEach(d => { const x = l.dirs[d];
              if (!x.breathe || x.idle !== x.breathe[at]) throw new Error('the still is not the breath\'s 0.25 frame for ' + l.id + ' ' + d);
              dirs[d] = x.breathe.map(enc); });
            return { id: l.id, dirs }; });
          return { w: m.w, h: m.h, phs, looks };
        }).catch(e => { err = e; return null; });
        if (out || err) break;
      }
      await page.waitForTimeout(250);
    }
    /* the crowd: wait for the shell's two passes to finish (they run on idle time, a whole person a task here) */
    if (out && !err) {
      const t1 = Date.now();
      while (Date.now() - t1 < 180000 && !(await page.evaluate(() => typeof CREST !== 'undefined' && CREST && CREST.done && typeof CWALK !== 'undefined' && CWALK && CWALK.done).catch(() => false))) await page.waitForTimeout(250);
      await page.waitForTimeout(500);
      const fr = page.frames().find(f => /BOHEMIA_CITY_WORLD/.test(f.url()));
      crowd = await fr.evaluate(() => {
        const b64 = (a) => { let s = ''; for (let i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000)); return btoa(s); };
        const enc = (f) => { const o = { w: f.w, h: f.h }; ['pal', 'rle', 'idx', 'raw'].forEach(k => { if (f[k]) o[k] = b64(f[k]); }); return o; };
        const phs = window.parent.eval('CAST_PHS'), wphs = window.parent.eval('CAST_WALK_PHS'), at = phs.indexOf(0.25), C = window.__CROWD_CAUGHT;
        const looks = C.looks.map(l => { const dirs = {}; Object.keys(l.dirs).forEach(d => { const x = l.dirs[d];
          if (!x.breathe || x.idle !== x.breathe[at]) throw new Error('a later person\'s still is not the breath\'s 0.25 frame: ' + l.id + ' ' + d);
          dirs[d] = x.breathe.map(enc); }); return { id: l.id, dirs }; });
        const walks = C.walks.map(w => { const dirs = {}; Object.keys(w.dirs).forEach(d => { dirs[d] = w.dirs[d].map(enc); }); return { id: w.id, dirs }; });
        return { phs, wphs, looks, walks };
      }).catch(e => { err = e; return null; });
    }
  } finally { await browser.close(); server.close(); }
  if (err) { console.error('the bake failed: ' + err.message); process.exit(1); }
  if (!out) { console.error('the bake failed: the map never received its cast in 180 s'); process.exit(1); }
  const n = out.looks.reduce((s, l) => s + Object.keys(l.dirs).length * out.phs.length, 0);
  const file = JSON.stringify(Object.assign({ key: KEY, made: 'tools/bohemia_bake_the_demo_cast.js' }, out));
  fs.writeFileSync(OUT, file);
  let crowdNote = 'no crowd file';
  if (crowd && crowd.looks.length && crowd.walks.length) {
    const f2 = JSON.stringify(Object.assign({ key: KEY, made: 'tools/bohemia_bake_the_demo_cast.js', w: out.w, h: out.h }, crowd));
    fs.writeFileSync(OUT2, f2);
    const n2 = crowd.looks.length * 8 * crowd.phs.length + crowd.walks.length * 8 * crowd.wphs.length;
    crowdNote = 'the crowd ' + crowd.looks.length + ' people and ' + crowd.walks.length + ' walks, ' + n2 + ' frames, into ' + path.relative(ROOT, OUT2) + ' (' + (f2.length / 1024).toFixed(0) + ' KB)';
  } else { try { fs.unlinkSync(OUT2); } catch (_e) { } }
  console.log('baked ' + out.looks.length + ' map people, ' + n + ' frames, into ' + path.relative(ROOT, OUT) + ' (' + (file.length / 1024).toFixed(0) + ' KB, key ' + KEY + '); ' + crowdNote);
})().catch(e => { console.error('the bake failed: ' + e.message); process.exit(1); });
