#!/usr/bin/env node
/* BOHEMIA -- RUN [the demo wears the rig] (rule 115g): the picture for the VOTE tab.
   The demo's own map at his phone's profile, the camera on the I-15 where the cargo rolls, two frames from the same
   moment: BEFORE (the 6 x 4 box the map drew since the overmap was born) and AFTER (the rig's worn truck he voted UP),
   side by side at 1:1 and again at 3x, saved to slices/vote/RUN_THE_RIG_TRUCK_ON_THE_MAP_10_18.png.
     node tools/bohemia_run_the_rig_truck_on_the_map_shot.js */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'slices/vote/RUN_THE_RIG_TRUCK_ON_THE_MAP_10_18.png');

(async () => {
  process.chdir(ROOT);
  const d = await D.open({});
  const fr = d.fr;
  /* the camera onto the cargo: the map's middle zoom, panned so the truck sits mid-glass, and the movers held still */
  const at = await fr.evaluate(() => {
    try { moversAdvance = function(){}; } catch (_e) {}
    const zb = zoomBounds(); CZOOM = Math.min(zb[1], Math.max(zb[0], 0.55)); TW = TW0 * CZOOM; TH = TH0 * CZOOM;
    const L = om.layout, cy2 = Math.round(6 + cargo.t * (96 - 12));
    panX = -((L.fwyX - city.x) - (cy2 - city.y)) * TW / 2; panY = -((L.fwyX - city.x) + (cy2 - city.y)) * TH / 2;
    try { clampPan(); } catch (_e) {}
    render();
    const r = document.getElementById('cv').getBoundingClientRect();
    const ox = Math.round(CVW / 2 - (city.x - city.y) * TW / 2 + panX), oy = Math.round(CVH / 2 - (city.x + city.y) * TH / 2 + panY);
    const p = iso(L.fwyX, cy2, ox, oy);
    return { x: r.left + p.sx, y: r.top + p.sy, zoom: CZOOM };
  });
  await d.page.waitForTimeout(1500);
  const box = { x: Math.max(0, at.x - 60), y: Math.max(0, at.y - 60), width: 120, height: 90 };
  const after = await d.page.screenshot({ clip: box });
  await fr.evaluate(() => { window.__RIG_TRUCK_SAVED = window.__RIG_TRUCK; window.__RIG_TRUCK = { complete: false, naturalWidth: 0 }; render(); });
  await d.page.waitForTimeout(400);
  const before = await d.page.screenshot({ clip: box });
  await fr.evaluate(() => { window.__RIG_TRUCK = window.__RIG_TRUCK_SAVED; render(); });
  /* lay them out in the page itself: one canvas, two crops at 1:1 then at 3x, nearest neighbour */
  const sheet = await d.page.evaluate(async ([a, b]) => {
    const load = (s) => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + s; });
    const A = await load(a), B = await load(b);
    const w = A.width, h = A.height, c = document.createElement('canvas');
    c.width = w * 2 + 30 + w * 6 + 10; c.height = h * 3 + 40;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
    g.fillStyle = '#14110d'; g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = '#e8dcc0'; g.font = 'bold 12px monospace';
    g.fillText('BEFORE', 4, 14); g.fillText('AFTER: THE RIG\'S TRUCK', w + 14, 14);
    g.drawImage(B, 0, 22); g.drawImage(A, w + 10, 22);
    g.drawImage(B, w * 2 + 30, 22, w * 3, h * 3); g.drawImage(A, w * 2 + 30 + w * 3 + 10, 22, w * 3, h * 3);
    return c.toDataURL('image/png').split(',')[1];
  }, [after.toString('base64'), before.toString('base64')]);
  fs.writeFileSync(OUT, Buffer.from(sheet, 'base64'));
  console.log('zoom ' + at.zoom.toFixed(3) + ', truck at ' + Math.round(at.x) + ',' + Math.round(at.y) + ' -> ' + path.relative(ROOT, OUT));
  await d.close();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
