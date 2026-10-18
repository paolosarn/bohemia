#!/usr/bin/env node
/* BOHEMIA -- ANIMATION [the shadow line and the choppy fall] (10/18). THE FILM of the party half: opens the real alpha
   through the one driver, turns the candidate on (MAP_PARTY_AS_ONE.on, __THE_SHADOW_LINE__), and films him and his two
   walking on the map, the clock driven, one picture every 50 ms (a step every beat, ten pictures), cropped 160 x 110 map
   px around his feet at the phone's own pixels (rule 89); two walks: across the glass, and back across it. Off again after.
   Writes <out>/party_<walk>_<i>.png; the .py packs them. REFERENCE CHECK: the frames are the map's own.
   usage: node tools/bohemia_animation_the_shadow_line_film.js <out dir> */
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const OUT = process.argv[2]; if (!OUT) { console.error('usage: ... <out dir>'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });
const N = 48;
(async () => {
  const d = await open({ alpha: true }); const p = d.page;
  let f = null; for (let i = 0; i < 60 && !(f = p.frames().find(x => /CITY_WORLD/.test(x.url()))); i++) await p.waitForTimeout(500);
  if (!f) { console.error('the map did not load'); process.exit(1); }
  for (let i = 0; i < 160; i++) { const n = await f.evaluate(() => typeof CAST_WALK === 'undefined' ? -1 : Object.keys(CAST_WALK).length).catch(() => -1); if (n >= 12) break; await p.waitForTimeout(500); }
  const r = await f.evaluate((N) => {
    const out = {}; let T = performance.now() + 5000; const real = performance.now; performance.now = () => T;
    try { if (typeof setMode === 'function') setMode('city'); MODE = 'city'; try { HC = HZOOM; } catch (e) {}
      const cv = document.querySelector('canvas'), q = devicePixelRatio || 1, W = 160, H = 110;
      const crop = document.createElement('canvas'); crop.width = W * q; crop.height = H * q; const cx = crop.getContext('2d');
      /* the two walks: the first clear run of nine blocks across the glass, and one back the other way */
      const runs = []; for (let dd = 0; dd < 8; dd++) { let hit = null;
        outer: for (let y = 3; y < om.n - 3; y++) for (let x = 3; x < om.n - 3; x++) { const [dx, dy] = DIRS[dd]; let okk = true;
          for (let k = 0; k <= 9; k++) if (!cityWalkable(x + k * dx, y + k * dy)) { okk = false; break; } if (okk) { hit = { x, y, d: dd, v: DIRS[dd] }; break outer; } }
        if (hit) runs.push(hit); }
      /* across the glass: the screen x of a step is (dx - dy); up it: (dx + dy) with dx - dy == 0 */
      const across = runs.find(h => Math.abs(h.v[0] - h.v[1]) === 2) || runs.find(h => h.v[0] !== h.v[1]);
      /* and back the other way across it (the streak joined on five of the eight trips with the old drawing, measured
         10/18 by gates/the_shadow_line_gate.js; a walk up the glass found only a caravan's name plate on him) */
      const back = runs.find(h => (h.v[0] - h.v[1]) === -(across.v[0] - across.v[1]) && h !== across) || null;
      MAP_PARTY_AS_ONE.on = true;
      for (const [name, run] of [['across', across], ['back', back]]) { if (!run) continue; out[name] = [];
        city.x = run.x; city.y = run.y; T += 5000; MAP_DREW = null; render(); render();
        for (let i = 0; i < N; i++) { if (i % 10 === 0) stepOnce(run.d); T += 50; MAP_DREW = null; render();
          const you = MAP_DREW.you; cx.clearRect(0, 0, crop.width, crop.height);
          cx.drawImage(cv, Math.round((you.x - W / 2) * q), Math.round((you.y - H * 0.62) * q), W * q, H * q, 0, 0, W * q, H * q);
          out[name].push(crop.toDataURL('image/png').split(',')[1]); } }
    } finally { MAP_PARTY_AS_ONE.on = false; performance.now = real; }
    return out; }, N);
  let n = 0; for (const w in r) r[w].forEach((b, i) => { fs.writeFileSync(path.join(OUT, 'party_' + w + '_' + String(i).padStart(2, '0') + '.png'), Buffer.from(b, 'base64')); n++; });
  console.log(JSON.stringify({ out: OUT, walks: Object.keys(r), pictures: n }));
  await d.browser.close(); try { d.server && d.server.close(); } catch (_e) {}
  process.exit(0);
})().catch(e => { console.error('ERR ' + e.message); process.exit(1); });
