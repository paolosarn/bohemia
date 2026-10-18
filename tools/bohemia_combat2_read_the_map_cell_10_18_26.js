/* ==========================================================================
   READ THE MAP CELL  (COMBAT TWO, 10/18/26, [the board at Battle Brothers' size], rule 109)

   The fight board is cut from one map cell, so the cut starts from what the map itself holds there, never from a
   drawing of ours. This opens the demo the way a player does (tools/bohemia_drive_the_demo.js), finds three cells
   nearest the party (a street: an arterial running east-west between suburb blocks; a yard: a suburb block with
   suburb all round; a lot: a commercial block on an arterial), and for each one saves:
     1. the map's own fine grid of that cell and its eight neighbours (cellAt, the 128 x 128 a block the map's
        realizer gives every block: road, lane paint, walk, roof, lamp, yard), as a code table plus the codes;
     2. the nine blocks' districts and road joins (om.at, tileMeta);
     3. the map as he sees it at the near stop, centred on the cell (the canvas only), for the sheet's twin.
   Output: reference/art_bank/fight_board/COMBAT2_MAP_CELLS_10_18.json and COMBAT2_MAP_CELL_<kind>_10_18.png (the committed
   copies were re-saved as .webp and the file's 'shot' paths point at them).
   The cut itself is tools/bohemia_combat2_the_board_cut_from_the_map_cell_cook_10_18_26.py.

     node tools/bohemia_combat2_read_the_map_cell_10_18_26.js          (about a minute)
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'reference/art_bank/fight_board');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

(async () => {
  const d = await drive.open({ keepCards: true, world: 1 });
  const fr = d.fr;
  for (let i = 0; i < 160; i++) {
    if (await fr.evaluate(() => typeof cellAt === 'function' && typeof om !== 'undefined' && om && om.n > 0 && typeof zoomBounds === 'function')) break;
    await d.page.waitForTimeout(250);
  }
  await d.page.waitForTimeout(3000);
  /* the three cells: the nearest of each kind to where the party stands */
  const pick = await fr.evaluate(() => {
    const D = (x, y) => { const t = om.at(x, y); return t ? t.district : null; };
    const cx = city.x, cy = city.y, cand = { street: [], yard: [], lot: [] };
    for (let y = 2; y < om.n - 2; y++) for (let x = 2; x < om.n - 2; x++) {
      const d = D(x, y), dist = Math.abs(x - cx) + Math.abs(y - cy);
      if (d === 'arterial' && D(x - 1, y) === 'arterial' && D(x + 1, y) === 'arterial' && D(x, y - 1) === 'suburb' && D(x, y + 1) === 'suburb') cand.street.push([dist, x, y]);
      if (d === 'suburb') { let s = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (D(x + dx, y + dy) === 'suburb') s++; if (s >= 8) cand.yard.push([dist, x, y]); }
      if (d === 'commercial' && [D(x - 1, y), D(x + 1, y), D(x, y - 1), D(x, y + 1)].some(v => v === 'arterial')) cand.lot.push([dist, x, y]);
    }
    const res = {};
    for (const k in cand) { cand[k].sort((a, b) => a[0] - b[0] || a[2] - b[2] || a[1] - b[1]); const c = cand[k][0]; if (c) res[k] = { x: c[1], y: c[2], of: cand[k].length }; }
    return { seed: om.seed, party: [cx, cy], FN: FN, res };
  });
  const out = { lane: 'COMBAT TWO', row: "[the board at Battle Brothers' size]", source: 'tools/bohemia_combat2_read_the_map_cell_10_18_26.js on slices/BOHEMIA_DEMO.html',
    what: 'each cell: its 3 x 3 neighbourhood of map blocks at the fine grid (S = 3 x FN), grid[y*S+x] indexes codes; a code is g|s|walk|face|lamp|gArtPool|markPool|artPool',
    seed: pick.seed, party: pick.party, FN: pick.FN, cells: {} };
  for (const k of Object.keys(pick.res)) {
    const p = pick.res[k];
    const r = await fr.evaluate(([px, py]) => {
      const pal = {}, codes = []; let n = 0; const x0 = (px - 1) * FN, y0 = (py - 1) * FN, S = 3 * FN, grid = new Array(S * S);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const c = cellAt(x0 + x, y0 + y);
        const key = c ? [c.g, c.s, c.walk ? 1 : 0, c.face ? 1 : 0, c.lamp ? 1 : 0, c.gArtPool || '', c.markPool || '', c.artPool || ''].join('|') : 'null';
        if (!(key in pal)) { pal[key] = n++; codes.push(key); }
        grid[y * S + x] = pal[key];
      }
      const blocks = [];
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const t = om.at(px + dx, py + dy), m = tileMeta(px + dx, py + dy);
        blocks.push({ dx, dy, district: t && t.district, N: !!m.N, S: !!m.S, E: !!m.E, W: !!m.W });
      }
      return { S, codes, grid, blocks };
    }, [p.x, p.y]);
    /* the map as he sees it, the near stop, the cell in the middle of the glass */
    await fr.evaluate(([px, py]) => { const zb = zoomBounds(); CZOOM = zb[1]; TW = TW0 * CZOOM; TH = TH0 * CZOOM;
      panX = -((px - city.x) - (py - city.y)) * TW / 2; panY = -((px - city.x) + (py - city.y)) * TH / 2; try { __CITY.rerender(); } catch (_e) {} }, [p.x, p.y]);
    await d.page.waitForTimeout(1500);
    const cam = await fr.evaluate(() => ({ CZOOM, TW, TH, CVW, CVH }));
    const shot = path.join(OUT, 'COMBAT2_MAP_CELL_' + k.toUpperCase() + '_10_18.png');
    await d.shot(shot);
    out.cells[k] = Object.assign({ x: p.x, y: p.y, nearestOf: p.of, camera: cam, shot: path.relative(ROOT, shot) }, r);
    console.log(k, 'block', p.x, p.y, '(' + p.of + ' of its kind on the map)', r.codes.length, 'codes', r.blocks[4].district);
  }
  fs.writeFileSync(path.join(OUT, 'COMBAT2_MAP_CELLS_10_18.json'), JSON.stringify(out));
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
