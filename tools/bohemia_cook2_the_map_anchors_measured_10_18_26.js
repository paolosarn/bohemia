#!/usr/bin/env node
/* COOK TWO [the curb on the map] (10/18): THE FINDING, measured on the committed demo so RUN can read it again.
   Why the street bands RUN draws (__THE_STREETS_JOIN__) barely show on the map: every block picture (HERO_IMG) is drawn
   at dy = p.sy + TH/2 - HERO_ANCH[k].by * sc, and HERO_ANCH.by is about 192 rows for EVERY picture, right for the
   259-row towers and too big by (259 - the picture's height) for the trimmed ground pictures, so those draw too high.
   Two numbers per picture and one count:
     by        the anchor the map uses;
     centre    the picture's own diamond centre: its bottom vertex under the anchor column, minus a quarter plate;
     off_rows  by - centre (the rows the picture draws above its own block; TH at the near stop is 128 device px);
     overdrawn of the road blocks whose band is drawn, how many have their band's middle under a picture drawn later.
   Nothing changes in slices/ (rule 100): the page is read, never written.
     node tools/bohemia_cook2_the_map_anchors_measured_10_18_26.js  ->  records/BOHEMIA_COOK2_THE_MAP_ANCHORS_MEASURED_10_18_26.json REFERENCE CHECK (the 9/4 standing duty): the compare law (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md):
   the kit is compared to the world it lands in, the committed demo's own map, from the game's camera; his slab and the
   curb he voted up are the twin on the sheet. No reference game. */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records/BOHEMIA_COOK2_THE_MAP_ANCHORS_MEASURED_10_18_26.json');

(async () => {
  process.chdir(ROOT);
  const d = await D.open({});
  const r = await d.fr.evaluate(() => {
    try { moversAdvance = function () {}; } catch (_e) {}
    const pics = {};
    for (const k in HERO_IMG) {
      const im = HERO_IMG[k], an = HERO_ANCH[k]; if (!im.naturalWidth || !an) continue;
      const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
      const a = x.getImageData(0, 0, c.width, c.height).data, W = c.width, H = c.height;
      const plate = (typeof HERO_PLATE !== 'undefined' && HERO_PLATE && HERO_PLATE[k]) || (W - 28);
      let yb = -1; for (let y = H - 1; y >= 0 && yb < 0; y--) for (let xx = Math.max(0, an.bx - 6); xx <= Math.min(W - 1, an.bx + 6); xx++) if (a[(y * W + xx) * 4 + 3] > 8) { yb = y; break; }
      const centre = yb - plate / 4;
      pics[k] = { w: W, h: H, plate, by: an.by, centre: Math.round(centre), off_rows: Math.round(an.by - centre) };
    }
    /* the count, at the near stop: each band's middle, and every picture drawn after it on the same canvas */
    CZOOM = zoomBounds()[1]; TW = TW0 * CZOOM; TH = TH0 * CZOOM; panX = 0; panY = 0;
    const log = []; const P = CanvasRenderingContext2D.prototype, di = P.drawImage; let seq = 0;
    P.drawImage = function (im, ...a) { const t = this.getTransform(); let dx, dy, dw, dh;
      if (a.length === 2) { dx = a[0]; dy = a[1]; dw = im.width; dh = im.height; } else if (a.length === 4) { [dx, dy, dw, dh] = a; } else { [, , , , dx, dy, dw, dh] = a; }
      const ex = [t.a * dx + t.e, t.a * (dx + dw) + t.e], ey = [t.d * dy + t.f, t.d * (dy + dh) + t.f];
      /* the opaque test is the picture's own alpha at that point, not its box */
      log.push({ k: 'img', im, cv: this.canvas, x0: ex[0], x1: ex[1], y0: ey[0], y1: ey[1], seq: seq++ }); return di.call(this, im, ...a); };
    const band = mapStreetTile;
    mapStreetTile = function (x, y, t, ox, oy, night) { const p = iso(x, y, ox, oy), tr = g.getTransform();
      log.push({ k: 'band', cv: g.canvas, cx: tr.a * p.sx + tr.e, cy: tr.d * (p.sy + TH / 2) + tr.f, seq: seq++ }); return band(x, y, t, ox, oy, night); };
    MAP_GROUND.key = ''; render();
    P.drawImage = di; mapStreetTile = band;
    const alphaAt = (e, X, Y) => { try { const im = e.im, w = im.naturalWidth || im.width, h = im.naturalHeight || im.height;
      const u = Math.floor((X - e.x0) / (e.x1 - e.x0) * w), v = Math.floor((Y - e.y0) / (e.y1 - e.y0) * h);
      if (u < 0 || v < 0 || u >= w || v >= h) return 0;
      const c = document.createElement('canvas'); c.width = 1; c.height = 1; const x = c.getContext('2d'); x.drawImage(im, u, v, 1, 1, 0, 0, 1, 1);
      return x.getImageData(0, 0, 1, 1).data[3]; } catch (_e) { return 0; } };
    const bands = log.filter(e => e.k === 'band');
    let over = 0;
    for (const b of bands) {
      const later = log.filter(e => e.k === 'img' && e.seq > b.seq && e.cv === b.cv && Math.min(e.x0, e.x1) <= b.cx && b.cx <= Math.max(e.x0, e.x1) && e.y0 <= b.cy && b.cy <= e.y1);
      if (later.some(e => alphaAt(e, b.cx, b.cy) > 8)) over++;
    }
    return { pictures: pics, near_stop: { TH_device: TH * CV_DPR, bands: bands.length, band_middle_painted_over: over } };
  });
  r._what = 'COOK TWO 10/18: the map\'s block pictures against their own blocks (tools/bohemia_cook2_the_map_anchors_measured_10_18_26.js). '
          + 'off_rows > 0: the picture draws that many rows above its block; the fix is HERO_ANCH[k].by = centre (RUN).';
  const offs = Object.values(r.pictures).map(p => p.off_rows).sort((a, b) => a - b);
  r.summary = { pictures: offs.length, off_rows_median: offs[offs.length >> 1], off_rows_max: offs[offs.length - 1], within_4_rows: offs.filter(o => Math.abs(o) <= 4).length };
  fs.writeFileSync(OUT, JSON.stringify(r, null, 1));
  console.log(JSON.stringify(r.summary), JSON.stringify(r.near_stop));
  await d.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
