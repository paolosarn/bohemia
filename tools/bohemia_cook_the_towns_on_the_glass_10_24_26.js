#!/usr/bin/env node
/* COOK [the cities sit in the ground] (10/24/26), THE LOOK. Rule 154 (Paolo 10/24: 'I asked you a long time ago to fix the
   settlements so they're part of the map instead of a sticker on top'): 'checked at every zoom'. The demo's map through the
   one driver (tools/bohemia_drive_the_demo.js), the pinch stepped through five stops, and at each one every town the render
   says it drew (MAP_TOWN_HIT, the render's own record of where each building landed) cropped at 3x its size with the map
   around it, on one contact sheet a stop; plus how the render drew it (the edge and the oval are __THE_TOWN_SITS_IN_THE_GROUND__).
     node tools/bohemia_cook_the_towns_on_the_glass_10_24_26.js [label]
   -> records/target/cook_map_colour/towns_<label>/{z*.png, towns.json}
   REFERENCE CHECK (the 9/4 standing duty): measured as it ships, from the game's camera, beside Battle Brothers' towns (9/24). */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const LABEL = process.argv[2] || 'after';
const OUT = path.join(ROOT, 'records/target/cook_map_colour', 'towns_' + LABEL);

(async () => {
  process.chdir(ROOT);
  fs.mkdirSync(OUT, { recursive: true });
  const d = await D.open({});
  for (let i = 0; i < 120; i++) {
    const ok = await d.fr.evaluate(() => { try { if (typeof vbReady === 'function') vbReady();
      let n = 0, l = 0; for (const k in HERO_IMG) { n++; if (HERO_IMG[k].complete && HERO_IMG[k].naturalWidth) l++; }
      return !!(VB && VB.day) && l === n; } catch (e) { return false; } });
    if (ok) break; await d.page.waitForTimeout(500);
  }
  const zb = await d.fr.evaluate(() => zoomBounds());
  const stops = [['z1_district', 0.5], ['z2_opening', 1], ['z3_mid', 1.8], ['z4_step', 2.6], ['z5_near', zb[1]]];
  const res = { label: LABEL, stops: {} };
  for (const [name, z] of stops) {
    const info = await d.fr.evaluate(async (z) => {
      CZOOM = z; TW = TW0 * CZOOM; TH = TH0 * CZOOM; panX = 0; panY = 0;
      try { clampPan(); } catch (_e) {}
      MAP_GROUND.key = ''; render();
      await new Promise(r => setTimeout(r, 900)); MAP_GROUND.key = ''; render();
      const hits = (typeof MAP_TOWN_HIT !== 'undefined' ? MAP_TOWN_HIT : []).map(h => ({ name: h.name, bld: h.bld }));
      return { hits, W: cv.width, H: cv.height, cssW: CVW, cssH: CVH, edge: typeof TOWN_IN_GROUND !== 'undefined' ? TOWN_IN_GROUND.on : null };
    }, z);
    const box = await d.fr.evaluate(() => { const r = cv.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
    const frameBox = await (await d.page.$('iframe')).boundingBox().catch(() => null);
    const shots = [];
    for (const h of info.hits.slice(0, 6)) {
      const b = h.bld; if (!b) continue;
      const cx = b.x + b.w / 2, cy = b.y + b.h / 2, s = Math.max(b.w, b.h) * 1.6;
      const ox = (frameBox ? frameBox.x : 0) + box.x, oy = (frameBox ? frameBox.y : 0) + box.y;
      const clip = { x: Math.max(0, ox + cx - s), y: Math.max(0, oy + cy - s * 0.75), width: s * 2, height: s * 1.5 };
      const fn = path.join(OUT, name + '_' + String(h.name).replace(/[^a-z0-9]+/gi, '_').slice(0, 24) + '.png');
      try { await d.page.screenshot({ path: fn, clip }); shots.push(path.relative(ROOT, fn)); } catch (_e) {}
    }
    await d.page.screenshot({ path: path.join(OUT, name + '_whole.jpg'), type: 'jpeg', quality: 80 });
    res.stops[name] = { czoom: z, towns: info.hits.length, edgeOff: info.edge, shots };
    console.log(name, JSON.stringify(res.stops[name]));
  }
  fs.writeFileSync(path.join(OUT, 'towns.json'), JSON.stringify(res, null, 1));
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
