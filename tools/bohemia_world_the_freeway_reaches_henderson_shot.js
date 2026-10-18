#!/usr/bin/env node
/* WORLD [the freeway as one road in the data], the gap closed (10/18): the picture for the VOTE tab, from the map's own
   camera (the second votes: SHOW IT FROM THE GAME'S CAMERA). The committed demo's map, the same spot twice:
     BEFORE  the map frame as main had it before THE HENDERSON LEG (served from a checkout of that commit, nothing else
             changed): the real road to Henderson comes in from the region and stops at the valley's edge;
     AFTER   the map frame now: the leg runs out of the ring's real-east side to meet it.
   Nothing in slices/ changes for the photograph (rule 100). The camera is centred on the leg's outer end.
     node tools/bohemia_world_the_freeway_reaches_henderson_shot.js <before-checkout-root>
   -> records/target/world_henderson_leg/{before,after}.png and shots.json (the committed picture is before_after.png, the
      two cropped left of the phone, side by side; the full frames are not committed) */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records/target/world_henderson_leg');
const BEFORE = process.argv[2];

async function shoot(mode) {
  const serve = mode === 'before' ? { '/slices/BOHEMIA_CITY_WORLD.html': path.join(BEFORE, 'slices/BOHEMIA_CITY_WORLD.html') } : {};
  const d = await D.open({ serve });
  const info = await d.fr.evaluate(() => {
    try { moversAdvance = function () {}; } catch (_e) {}
    const L = om.layout, east1 = L.fwyX < L.stripX, B = L.beltRect;
    /* the leg's outer end (after), or where it would be (before): the ring's real-east side at row 76, the box's edge */
    const cx = east1 ? om.n - 1 : 0, cy = 78;
    CZOOM = Math.max(zoomBounds()[0], Math.min(zoomBounds()[1], 1.6)); TW = TW0 * CZOOM; TH = TH0 * CZOOM;
    panX = -((cx - city.x) - (cy - city.y)) * TW / 2; panY = -((cx - city.x) + (cy - city.y)) * TH / 2;
    try { MAP_GROUND.key = ''; } catch (_e) {}
    render();
    const fw = []; for (let x = 0; x < om.n; x++) { const t = om.at(x, 76); if (t && /freeway|interchange/.test(t.district)) fw.push(x); }
    return { leg: L.henderson || null, ringEast: east1 ? B.rgt : B.lft, row76freeway: fw.length, zoom: CZOOM, at: [cx, cy] };
  });
  await d.page.waitForTimeout(900);
  fs.writeFileSync(path.join(OUT, mode + '.png'), await d.page.screenshot({}));
  await d.close();
  return info;
}

(async () => {
  process.chdir(ROOT);
  if (!BEFORE || !fs.existsSync(path.join(BEFORE, 'slices/BOHEMIA_CITY_WORLD.html'))) throw new Error('give the before checkout root');
  fs.mkdirSync(OUT, { recursive: true });
  const out = { before: await shoot('before'), after: await shoot('after') };
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
