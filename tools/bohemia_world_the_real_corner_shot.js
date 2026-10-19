#!/usr/bin/env node
/* WORLD [the dam in one place], round two (10/19): the picture for the VOTE tab, from the map's own camera (the second
   votes: SHOW IT FROM THE GAME'S CAMERA). The committed demo's map, the same spot twice:
     NOW       the map frame as main has it: Lake Las Vegas, Boulder City, Hoover Dam and Lake Mead in the valley's own
               corner, about five km from the Strip;
     THE REAL  the same frame with engine/bohemia_the_real_corner.js applied to the map it boots (served from a copy in
               the scratch folder, one script added and the far land's painted lake left out, nothing in slices/
               changes): the corner as the ground that is really there, the McCullough foothills, MacDonald Highlands and
               the Pittman basins; the dam, the town and the lake stay where the region already has them, 25 to 41 km out.
   The camera is centred on the cluster's middle at the zoom the far stop holds the land at.
     node tools/bohemia_world_the_real_corner_shot.js <scratch-dir>
   -> records/target/world_the_real_corner/{now,real}.png and shots.json (the committed picture is the sheet; the full
      frames stay in the scratch folder) */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records/target/world_the_real_corner');
const SCRATCH = process.argv[2];
const ZOOM = Number(process.argv[3] || 1.6);

function candidateCity() {
  const src = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  const boot = 'let seed=BOH_ONE_SEED(), om=OM.buildOvermap(seed);';
  if (src.split(boot).length !== 2) throw new Error('the city\'s boot line moved; this shot will not guess where the map is built');
  const mod = fs.readFileSync(path.join(ROOT, 'engine/bohemia_the_real_corner.js'), 'utf8');
  /* and the far land's painted LAKE MEAD (RUN's painter, which lays a lake out past whichever corner the valley's
     mead sits in, while the region's real land has no lake within 12 blocks of that corner) is left out of the
     photograph, because a yes takes it with the cluster; that half of the move is RUN's file, named in the record */
  /* (the painter runs in a worker and sees only what the page hands it, so the lake is left out where it is handed) */
  const lake = 'L: { fwyX: L.fwyX, stripX: L.stripX, mead: L.mead,';
  if (src.split(lake).length !== 2) throw new Error('the far land\'s lake painter moved; this shot will not guess');
  const out = src.replace(boot, boot + '\n/* WORLD shot only: the candidate */\n' + mod + '\nBohemiaTheRealCorner.apply(om);\n')
                 .replace(lake, 'L: { fwyX: L.fwyX, stripX: L.stripX, mead: (om.realCorner ? null : L.mead),');
  const f = path.join(SCRATCH, 'BOHEMIA_CITY_WORLD.real_corner.html');
  fs.writeFileSync(f, out);
  return f;
}

async function shoot(mode, file) {
  const serve = file ? { '/slices/BOHEMIA_CITY_WORLD.html': file } : {};
  const d = await D.open({ serve });
  const info = await d.fr.evaluate((z) => {
    try { moversAdvance = function () {}; } catch (_e) {}
    const L = om.layout, R = L.boulder, cx = L.damR.x + 1, cy = L.damR.y;
    CZOOM = Math.max(zoomBounds()[0], Math.min(zoomBounds()[1], z)); TW = TW0 * CZOOM; TH = TH0 * CZOOM;
    panX = -((cx - city.x) - (cy - city.y)) * TW / 2; panY = -((cx - city.x) + (cy - city.y)) * TH / 2;
    try { MAP_GROUND.key = ''; } catch (_e) {}
    render();
    const kinds = {};
    for (let y = R.y - 3; y < R.y + R.h + 6; y++) for (let x = Math.max(0, L.mead.x - 1); x < L.lakeLV.x + L.lakeLV.w + 2; x++) {
      const t = om.at(x, y); if (t) kinds[t.district] = (kinds[t.district] || 0) + 1; }
    return { at: [cx, cy], zoom: CZOOM, corner: om.realCorner ? om.realCorner.corner : null,
             names: om.realCorner ? om.realCorner.pieces.map(p => p.name) : ['LAKE LAS VEGAS', 'BOULDER CITY', 'HOOVER DAM', 'LAKE MEAD'],
             kinds: kinds };
  }, ZOOM);
  await d.page.waitForTimeout(900);
  fs.writeFileSync(path.join(SCRATCH, mode + '.png'), await d.page.screenshot({}));
  await d.close();
  return info;
}

(async () => {
  process.chdir(ROOT);
  if (!SCRATCH) throw new Error('give a scratch folder');
  fs.mkdirSync(SCRATCH, { recursive: true }); fs.mkdirSync(OUT, { recursive: true });
  const out = { now: await shoot('now', null), real: await shoot('real', candidateCity()) };
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
