#!/usr/bin/env node
/* COOK TWO [the curb on the map] (10/18): the picture for the VOTE tab, from the map's own camera.
   The committed demo, the same moment three times:
     BEFORE      the map as it ships;
     REGISTERED  every block picture drawn on its own block (HERO_ANCH.by set to the picture's own diamond centre,
                 measured from its bottom vertex): MEASURED THIS ROUND, the anchors are 192 rows for every picture,
                 right for the 259-row towers and up to 125 rows too high for the trimmed ground pictures (the arterial
                 101, the desert 124, the suburb 102), so the arterial picture sits 0.8 of a block above its block and
                 266 of the 273 street bands RUN draws on the true block are painted over by the next row. RUN's fix,
                 shown here so the AFTER is honest about what is under the kit;
     AFTER       REGISTERED, with COOK TWO's kit laid: the BLOCK piece in place of the arterial picture (the street is
                 the road block), the BAND piece where RUN's band is drawn on the other streets; one piece a block,
                 chosen by RUN's own neighbour test, the curb's lip, face and shadow at the map's pixel count.
   Everything is done IN THE PAGE ONLY, for the photograph: nothing in slices/ changes (rule 100); RUN lays it for real.
   Three zooms: the near stop (a block 256 device px, the kit's own pixel), one step out (128) and the middle (64).
     node tools/bohemia_cook2_the_curb_on_the_map_shot_10_18_26.js
   -> records/target/cook2_map_curb/shots/{near,step,middle}_{before,registered,after}.png REFERENCE CHECK (the 9/4 standing duty): the compare law (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md):
   the kit is compared to the world it lands in, the committed demo's own map, from the game's camera; his slab and the
   curb he voted up are the twin on the sheet. No reference game. */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const KIT = path.join(ROOT, 'records/target/cook2_map_curb');
const OUT = path.join(KIT, 'shots');

(async () => {
  process.chdir(ROOT);
  fs.mkdirSync(OUT, { recursive: true });
  const kit = JSON.parse(fs.readFileSync(path.join(KIT, 'COOK2_MAP_CURB_KIT.json'), 'utf8'));
  const atl = {}, faces = {};
  for (const fam of Object.keys(kit.families)) { atl[fam] = {};
    for (const k of Object.keys(kit.families[fam].levels)) { atl[fam][k] = fs.readFileSync(path.join(ROOT, kit.families[fam].levels[k].file)).toString('base64'); faces[k] = kit.families[fam].levels[k].face_px; } }
  const d = await D.open({});
  /* the kit into the page, and the lay (RUN's mapStreetTile with the band swapped for a piece) */
  await d.fr.evaluate(async ([atl, faces]) => {
    try { moversAdvance = function () {}; } catch (_e) {}
    const load = (s) => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + s; });
    window.__CURB = { img: {}, face: faces, on: false, drew: 0, band: 0, block: 0 };
    for (const fam of Object.keys(atl)) { window.__CURB.img[fam] = {}; for (const k of Object.keys(atl[fam])) window.__CURB.img[fam][k] = await load(atl[fam][k]); }
    /* the registration: each picture's own diamond centre, from its bottom vertex under the anchor column */
    window.__ANCH0 = {}; window.__ANCH1 = {};
    for (const k in HERO_IMG) { const im = HERO_IMG[k], an = HERO_ANCH[k]; if (!im.naturalWidth || !an) continue;
      const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
      const a = x.getImageData(0, 0, c.width, c.height).data, W = c.width, H = c.height;
      const plate = (typeof HERO_PLATE !== 'undefined' && HERO_PLATE && HERO_PLATE[k]) || (W - 28);
      let yb = -1; for (let y = H - 1; y >= 0 && yb < 0; y--) for (let xx = Math.max(0, an.bx - 6); xx <= Math.min(W - 1, an.bx + 6); xx++) if (a[(y * W + xx) * 4 + 3] > 8) { yb = y; break; }
      window.__ANCH0[k] = an.by; window.__ANCH1[k] = Math.round(yb - plate / 4); }
    window.__REG = function (on) { for (const k in window.__ANCH0) HERO_ANCH[k].by = on ? window.__ANCH1[k] : window.__ANCH0[k]; };
    const ART = { arterial: 1, arterial_x: 1 };
    const hero = drawHero;
    drawHero = function (name, p, flip, span) { if (window.__CURB.on && ART[name]) return true; return hero(name, p, flip, span); };
    const band = mapStreetTile;
    mapStreetTile = function (x, y, t, ox, oy, night) {
      const C = window.__CURB, J = STREETS_JOIN.J;
      const fam = ART[t.district] ? 'block' : 'band';
      if (!C.on || night || J[t.district] !== 1 || TW < 6) { C.band++; return band(x, y, t, ox, oy, night); }
      let mask = 0, flat = fam === 'block' || overpassAt(x, y) === 0;
      const N = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (let dd = 0; dd < 4; dd++) {
        const nx = x + N[dd][0], ny = y + N[dd][1], u = om.at(nx, ny);
        if (u && J[u.district]) { mask |= 1 << dd; if (overpassAt(nx, ny) !== 0) flat = false; }
      }
      if (!flat) { C.band++; return band(x, y, t, ox, oy, night); }    /* a deck or a dip keeps the band */
      const dev = TW * CV_DPR, lv = Object.keys(C.img[fam]).map(Number).sort((a, b) => a - b);
      let L = lv[0]; for (const v of lv) if (v <= dev + 0.5) L = v;
      const f = C.face[L], hk = L / 2 + f, vr = (x * 7 + y * 13) % 2, s = TW / L;
      const p = iso(x, y, ox, oy), o = overpassAt(x, y), lift = o === 1 ? Math.round(TH * 0.55) : o === 2 ? -Math.round(TH * 0.16) : 0;
      const sm = g.imageSmoothingEnabled; g.imageSmoothingEnabled = false;
      g.drawImage(C.img[fam][L], mask * L, vr * hk, L, hk, p.sx - TW / 2, p.sy - lift - f * s, TW, hk * s);
      g.imageSmoothingEnabled = sm;
      C.drew++; if (fam === 'block') C.block++;
    };
  }, [atl, faces]);
  const out = {};
  for (const [name, z] of [['near', 'near'], ['step', 2.4], ['middle', 1.21]]) {
    for (const mode of ['before', 'registered', 'after']) {
      const info = await d.fr.evaluate(([z, mode]) => {
        window.__REG(mode !== 'before'); window.__CURB.on = mode === 'after';
        window.__CURB.drew = 0; window.__CURB.band = 0; window.__CURB.block = 0;
        CZOOM = z === 'near' ? zoomBounds()[1] : z; TW = TW0 * CZOOM; TH = TH0 * CZOOM; panX = 0; panY = 0;
        try { clampPan(); } catch (_e) {}
        MAP_GROUND.key = ''; const t0 = performance.now(); render();
        return { ms: Math.round(performance.now() - t0), TW_device: TW * CV_DPR, pieces: window.__CURB.drew, block_pieces: window.__CURB.block,
                 bands: window.__CURB.band, err: window.__STREETS_ERR || null };
      }, [z, mode]);
      await d.page.waitForTimeout(700);
      const f = path.join(OUT, name + '_' + mode + '.png');
      fs.writeFileSync(f, await d.page.screenshot({}));
      out[name + '_' + mode] = info;
      console.log(name, mode, JSON.stringify(info));
    }
  }
  out.anchors = await d.fr.evaluate(() => ({ before: window.__ANCH0, registered: window.__ANCH1 }));
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(out, null, 1));
  await d.close();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
