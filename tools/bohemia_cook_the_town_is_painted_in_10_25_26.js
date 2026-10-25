#!/usr/bin/env node
/* COOK [the cities sit in the ground] (10/25/26), THE LOOK OF __THE_TOWN_IS_PAINTED_IN__. Rule 154 (Paolo 10/24: 'I asked you
   a long time ago to fix the settlements so they're part of the map instead of a sticker on top'): 'checked at every zoom'.
   The demo's map through the one driver (tools/bohemia_drive_the_demo.js); the camera put on each town in turn (a fortress,
   a town and a camp, two of each) at six stops from the far end to the near one, the tiles let land, and the glass round
   the town cut out; one contact sheet a town, its six stops (drawn in the page on a canvas). It also says, from the render's own record, whether each
   town was drawn as the painting (MAP_DREW.art.painted) or as a picture laid over it.
     node tools/bohemia_cook_the_town_is_painted_in_10_25_26.js [label] [Town,Town,...]
   -> records/target/cook_map_colour/painted_<label>/{<town>_<stop>.png, sheet_<town>.jpg, towns.json}
   REFERENCE CHECK (the 9/4 standing duty): from the game's camera, beside Battle Brothers' towns on its world map (9/24). */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const LABEL = process.argv[2] || 'look';
const PICK = (process.argv[3] || 'Remnants,Network,Church,Reds,Colorful,Homeless').split(',');
const OUT = path.join(ROOT, 'records/target/cook_map_colour', 'painted_' + LABEL);

(async () => {
  process.chdir(ROOT);
  fs.mkdirSync(OUT, { recursive: true });
  const d = await D.open({});
  for (let i = 0; i < 120; i++) {
    const ok = await d.fr.evaluate(() => { try { if (typeof vbReady === 'function') vbReady(); return !!(VB && VB.day && VBC && VBC.day); } catch (e) { return false; } });
    if (ok) break; await d.page.waitForTimeout(500);
  }
  const zb = await d.fr.evaluate(() => zoomBounds());
  const stops = [['s0_far', zb[0]], ['s1_district', 0.5], ['s2_opening', 1], ['s3_mid', 1.8], ['s4_step', 2.6], ['s5_near', zb[1]]];
  const frameBox = await (await d.page.$('iframe')).boundingBox().catch(() => null);
  const res = { label: LABEL, stops: stops.map(s => s[0]), towns: {} };
  for (const name of PICK) {
    res.towns[name] = {};
    for (const [stop, z] of stops) {
      const info = await d.fr.evaluate(async (a) => {
        const B = ctBases(); const b = B && B[a.name]; if (!b) return { err: 'no base' };
        CZOOM = a.z; TW = TW0 * CZOOM; TH = TH0 * CZOOM;
        try { camLetGo(); } catch (_e) {}   /* the camera holds the crew (rule 163): let it go, as a drag by hand does */
        const put = () => { panX = ((city.x - city.y) - (b.x - b.y)) * TW / 2; panY = ((city.x + city.y) - (b.x + b.y + 1)) * TH / 2; };
        put(); MAP_GROUND.key = ''; render();
        for (let i = 0; i < 40; i++) { await new Promise(r => setTimeout(r, 250)); put(); MAP_GROUND.key = ''; render(); if (!VBT.busy && !VBT.want) break; }
        put(); MAP_GROUND.key = ''; render();
        const r = cv.getBoundingClientRect(), tp = (typeof vbTownPainted === 'function') ? vbTownPainted(a.name) : null;
        return { x: r.left, y: r.top, w: r.width, h: r.height, TW, painted: !!tp, tier: tp ? tp.tier : null, n: tp ? tp.n : null,
                 drewPainted: MAP_DREW && MAP_DREW.art ? MAP_DREW.art.painted || 0 : 0, want: VBT.want || 0, key: VBC.key };
      }, { name, z });
      if (info.err) { res.towns[name][stop] = info; continue; }
      const ox = (frameBox ? frameBox.x : 0) + info.x, oy = (frameBox ? frameBox.y : 0) + info.y;
      const cw = Math.min(380, info.w - 10), ch = 320;
      const clip = { x: ox + info.w / 2 - cw / 2, y: oy + info.h / 2 - ch / 2 + 20, width: cw, height: ch };
      const fn = path.join(OUT, name + '_' + stop + '.png');
      await d.page.screenshot({ path: fn, clip });
      res.towns[name][stop] = { TW: Math.round(info.TW * 10) / 10, painted: info.painted, tier: info.tier, n: info.n, drewPainted: info.drewPainted, tilesWaiting: info.want, shot: path.relative(ROOT, fn) };
      console.log(name, stop, JSON.stringify(res.towns[name][stop]));
    }
  }
  fs.writeFileSync(path.join(OUT, 'towns.json'), JSON.stringify(res, null, 1));
  /* the sheets, drawn in the page: one a town (its six stops) */
  for (const name of PICK) {
    const files = stops.map(s => path.join(OUT, name + '_' + s[0] + '.png')).filter(f => fs.existsSync(f));
    if (!files.length) continue;
    const imgs = files.map(f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64'));
    const b64 = await d.page.evaluate(async (a) => {
      const ims = await Promise.all(a.imgs.map(src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; })));
      const w = ims[0].width, h = ims[0].height, c = document.createElement('canvas'); c.width = w * 3 + 8; c.height = h * 2 + 4 + 40;
      const x = c.getContext('2d'); x.fillStyle = '#111'; x.fillRect(0, 0, c.width, c.height);
      ims.forEach((im, i) => x.drawImage(im, (i % 3) * (w + 4), 40 + Math.floor(i / 3) * (h + 4)));
      x.fillStyle = '#ddd'; x.font = 'bold 28px monospace'; x.fillText(a.title, 10, 30);
      return c.toDataURL('image/jpeg', 0.85).split(',')[1];
    }, { imgs, title: name + ' (' + LABEL + '): far, district, opening, mid, step, near' });
    fs.writeFileSync(path.join(OUT, 'sheet_' + name + '.jpg'), Buffer.from(b64, 'base64'));
  }
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
