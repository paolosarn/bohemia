/* ==========================================================================
   READ A BLOCK OF EVERY DISTRICT  (COMBAT TWO, 10/18/26, [a board from every district], rule 52)

   His 10/18 YES on the board cut from the map: a fight on the Strip and a fight in the suburbs must look like the
   places they are. So the cut starts from the map again, the way tools/bohemia_combat2_read_the_map_cell_10_18_26.js
   read three blocks, but this time one block from each of the five districts the row names, chosen by the map's own
   district word (om.at(x, y).district, the same word nfKind hands the fight):
     strip       the Strip            a 'strip' block with the most Strip-family blocks around it (strip, resort, casino)
     downtown    downtown             a 'downtown' block with the most downtown around it
     suburb      the suburbs          a 'suburb' block with suburb on all eight sides
     wash        the wash             a 'wash' block with the most wash and basin around it
     industrial  the industrial edge  an 'industrial' block with the most of the works around it (industrial,
                                      warehouse, storage, rail, railyard) and at least one block of something else:
                                      the edge where the works meet the town or the desert
   Ties go to the block nearest the party, then north, then west. For each block it saves the same three things the
   first reader saved: the 3 x 3 fine grid (cellAt), the nine blocks' districts and road joins, and the near-stop
   picture of the map centred on it.
   Output: reference/art_bank/fight_board/COMBAT2_DISTRICT_CELLS_10_18.json and COMBAT2_DISTRICT_CELL_<KIND>_10_18.png
   (the committed copies are re-saved as .webp and the file's 'shot' paths point at them).
   The cut is tools/bohemia_combat2_a_board_from_every_district_cook_10_18_26.py.

     node tools/bohemia_combat2_read_the_district_cells_10_18_26.js          (about a minute and a half)
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'reference/art_bank/fight_board');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

const WANT = {
  strip: { is: ['strip'], family: ['strip', 'resort', 'casino', 'sphere', 'highroller', 'luxor', 'strat', 'sign', 'convention'] },
  downtown: { is: ['downtown'], family: ['downtown'] },
  suburb: { is: ['suburb'], family: ['suburb'], all: true },
  wash: { is: ['wash'], family: ['wash', 'basin'] },
  industrial: { is: ['industrial'], family: ['industrial', 'warehouse', 'storage', 'rail', 'railyard'], edge: true },
};

(async () => {
  const d = await drive.open({ keepCards: true, world: 1 });
  const fr = d.fr;
  for (let i = 0; i < 160; i++) {
    if (await fr.evaluate(() => typeof cellAt === 'function' && typeof om !== 'undefined' && om && om.n > 0 && typeof zoomBounds === 'function')) break;
    await d.page.waitForTimeout(250);
  }
  await d.page.waitForTimeout(3000);
  const pick = await fr.evaluate((WANT) => {
    const D = (x, y) => { const t = om.at(x, y); return t ? t.district : null; };
    const cx = city.x, cy = city.y, res = {};
    for (const k in WANT) {
      const w = WANT[k]; let best = null;
      for (let y = 2; y < om.n - 2; y++) for (let x = 2; x < om.n - 2; x++) {
        if (w.is.indexOf(D(x, y)) < 0) continue;
        let fam = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && w.family.indexOf(D(x + dx, y + dy)) >= 0) fam++;
        if (w.all && fam < 8) continue;
        if (w.edge && fam > 7) continue;
        const dist = Math.abs(x - cx) + Math.abs(y - cy);
        const c = [-fam, dist, y, x];
        if (!best || c[0] < best[0] || (c[0] === best[0] && (c[1] < best[1] || (c[1] === best[1] && (c[2] < best[2] || (c[2] === best[2] && c[3] < best[3])))))) best = c;
      }
      if (best) res[k] = { x: best[3], y: best[2], family_around: -best[0], dist: best[1] };
    }
    return { seed: om.seed, n: om.n, party: [cx, cy], FN: FN, res };
  }, WANT);
  const out = { lane: 'COMBAT TWO', row: '[a board from every district]', source: 'tools/bohemia_combat2_read_the_district_cells_10_18_26.js on slices/BOHEMIA_DEMO.html',
    what: 'each cell: its 3 x 3 neighbourhood of map blocks at the fine grid (S = 3 x FN), grid[y*S+x] indexes codes; a code is g|s|walk|face|lamp|gArtPool|markPool|artPool',
    seed: pick.seed, n: pick.n, party: pick.party, FN: pick.FN, want: WANT, cells: {} };
  for (const k of Object.keys(WANT)) {
    const p = pick.res[k];
    if (!p) { console.log(k, 'NONE on this map'); continue; }
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
    await fr.evaluate(([px, py]) => { const zb = zoomBounds(); CZOOM = zb[1]; TW = TW0 * CZOOM; TH = TH0 * CZOOM;
      panX = -((px - city.x) - (py - city.y)) * TW / 2; panY = -((px - city.x) + (py - city.y)) * TH / 2; try { __CITY.rerender(); } catch (_e) {} }, [p.x, p.y]);
    await d.page.waitForTimeout(1500);
    const cam = await fr.evaluate(() => ({ CZOOM, TW, TH, CVW, CVH }));
    const shot = path.join(OUT, 'COMBAT2_DISTRICT_CELL_' + k.toUpperCase() + '_10_18.png');
    await d.shot(shot);
    out.cells[k] = Object.assign({ x: p.x, y: p.y, family_around: p.family_around, from_party: p.dist, camera: cam, shot: path.relative(ROOT, shot) }, r);
    console.log(k, 'block', p.x, p.y, 'family around', p.family_around, 'from the party', p.dist, r.codes.length, 'codes', r.blocks.map(b => b.district).join(','));
  }
  fs.writeFileSync(path.join(OUT, 'COMBAT2_DISTRICT_CELLS_10_18.json'), JSON.stringify(out));
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
