#!/usr/bin/env node
/* COOK [every town looks its own] (10/25/26), THE SHEET: every home base and every region place drawn ALONE by the game's own
   painter (vbCityCore on its blocks, the streets and what is not the town cut away, 96 texels a block, the same input the likeness
   reads), side by side on one sheet, its name under it. Rule 186(b): 'no two read the same'; this is the picture of that.
     node tools/bohemia_cook_every_town_side_by_side_10_25_26.js [out.jpg] ['Town;Town...'] [cell px]
   REFERENCE CHECK: Battle Brothers' world map's towns, each its own drawing (the reference of the row). */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'records/target/cook_towns/final/every_town_alone.jpg'));
const ONLY = process.argv[3] ? process.argv[3].split(';') : null, CELL = +(process.argv[4] || 300);
(async () => {
  process.chdir(ROOT);
  const d = await D.open({ fog: false, profile: 'computer' });
  try {
    for (let i = 0; i < 160; i++) { const ok = await d.fr.evaluate(() => { try { return !!(VB_TOWNS.list && VBC.day); } catch (e) { return false; } }); if (ok) break; await d.page.waitForTimeout(500); }
    const b64 = await d.fr.evaluate((A) => {
      let list = (VB_TOWNS.list || []).slice();
      try { const R = window.BOH_REGION; if (R && R.ready && R.places) R.places.forEach(function (p) { list.push(Object.assign(vbRegionTown(p, vbRegionPatchGeom(p)), { region: 1, place: p })); }); } catch (_e) {}
      if (A.only) list = list.filter(function (t) { return A.only.indexOf(t.name) >= 0; });
      const S = 96, cell = A.cell, cols = Math.min(8, list.length), rows = Math.ceil(list.length / cols), c = document.createElement('canvas'); c.width = cols * cell; c.height = rows * (cell + 26) + 50;
      const g2 = c.getContext('2d'); g2.fillStyle = '#16140f'; g2.fillRect(0, 0, c.width, c.height);
      g2.fillStyle = '#e0d6c0'; g2.font = 'bold 26px monospace'; g2.fillText('EVERY TOWN, DRAWN ALONE BY THE MAP\'S PAINTER (14 home bases, then the region\'s places)', 12, 34);
      list.forEach(function (tw, k) {
        const n = tw.n, cls = new Uint8Array(n * n), live = new Uint8Array(n * n), sub = new Uint8Array(n * n), thm = new Uint8Array(n * n);
        for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { let cl = VB_CLASS.land, sb = 0, th = 255;
          if (tw.region) cl = tw.tier === 1 ? VB_CLASS.roof : tw.tier === 2 ? VB_CLASS.houses : VB_CLASS.land;
          else { const t = om.at(tw.x0 + i, tw.y0 + j); cl = vbClassOf(t && t.district); sb = vbSubOf(t && t.district); th = vbCookThemeOf(t && t.district); }
          cls[j * n + i] = cl; sub[j * n + i] = sb; thm[j * n + i] = th; }
        const r = vbCityCore(tw.place ? vbRegionPatchInput(tw.place, S) : { kind: 'tile', N: n, NF: om.n, S: S, PAD: 0, hashPad: VB_CPAD, org: [tw.x0, tw.y0], seed: om.seed, cls: cls, live: live, sub: sub,
          thm: VB_COOK.themes ? thm : null, cook: VB_COOK.themes, key: 'sheet:' + tw.name, tx: 0, ty: 0, cutout: true, towns: [tw], townPal: VB_TOWNS.pal });   /* a region place: the game's own patch */
        const pc = document.createElement('canvas'); pc.width = r.P; pc.height = r.P; pc.getContext('2d').putImageData(new ImageData(r.day, r.P, r.P), 0, 0);
        const X = (k % cols) * cell, Y = 50 + Math.floor(k / cols) * (cell + 26), sc = (cell - 20) / (r.P * 1.0);
        g2.save(); g2.translate(X + cell / 2, Y + 14); g2.scale(sc / 1.42, sc / 1.42 * 0.5); g2.rotate(Math.PI / 4); g2.imageSmoothingEnabled = true; g2.drawImage(pc, 0, 0); g2.restore();   /* the map's own diamond */
        g2.fillStyle = tw.region ? '#a9a08c' : '#e8dcc0'; g2.font = 'bold 15px monospace'; g2.fillText(tw.name + ' (' + (tw.trade || '') + ')', X + 8, Y + cell + 16);
      });
      return c.toDataURL('image/jpeg', 0.84).split(',')[1];
    }, { only: ONLY, cell: CELL });
    fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, Buffer.from(b64, 'base64')); console.log('wrote ' + path.relative(ROOT, OUT));
  } finally { await d.close(); }
})().catch(e => { console.error(e); process.exit(1); });
