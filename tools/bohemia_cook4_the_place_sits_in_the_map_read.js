/* ==========================================================================
   COOK FOUR [the place sits in the map], round one (10/19): READ THE PLACE'S OWN BLOCK OFF THE MAP.

   The settlement picture is cut from what the map holds where the place stands, never from a drawing of
   ours. This opens the demo the way a player does (tools/bohemia_drive_the_demo.js, as COMBAT TWO's
   tools/bohemia_combat2_read_the_map_cell_10_18_26.js does for a fight board), finds the place by name
   (ctBases(), the map's own list of who holds what), and saves:
     1. the map's own fine grid (cellAt, 128 x 128 a block: ground colour, roof colour, walk, face, lamp, the
        pools) of the place's block and the blocks round it (5 x 5), as a code table plus the codes;
     2. the 25 blocks' districts and road joins (om.at, tileMeta);
     3. THE MAP AS HE SEES IT at the near stop, centred on the place (the canvas only), for the sheet's twin;
     4. THE MAP'S GROUND AS HE SEES IT: the screen pixel under the middle of every fine cell of the place's
        block at the near stop, grouped by what the cell is (yard, street, walk, roof), so the picture's dirt
        and asphalt are matched to what is on his glass, the district's cast and the hour's light included.
   Output: reference/art_pipe/cook4/place_in_the_map/COOK4_PLACE_<NAME>.json and _NEAR.png.
   Nothing in slices/ or engine/ is written (rule 100).
   REFERENCE CHECK (the 9/4 compare law): this reader IS the compare's first half: the world the picture lands
   in, read off the committed demo from the game's own camera (his glass at the near stop) and the map's own
   plan; the picture is laid against both by tools/bohemia_cook4_the_place_sits_in_the_map.py.  No reference game.

     node tools/bohemia_cook4_the_place_sits_in_the_map_read.js Church        (about two minutes)
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'reference/art_pipe/cook4/place_in_the_map');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const NAME = process.argv[2] || 'Church';
const R = 2;                                   /* blocks each way round the place: 5 x 5 */

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const d = await drive.open({ keepCards: true, world: 1 });
  const fr = d.fr;
  for (let i = 0; i < 160; i++) {
    if (await fr.evaluate(() => typeof cellAt === 'function' && typeof om !== 'undefined' && om && om.n > 0 && typeof ctBases === 'function')) break;
    await d.page.waitForTimeout(250);
  }
  await d.page.waitForTimeout(3000);
  const place = await fr.evaluate((name) => {
    const gb = ctBases(); const k = Object.keys(gb).find(n => n.toUpperCase() === name.toUpperCase());
    if (!k) return { err: 'no place ' + name, have: Object.keys(gb) };
    const b = gb[k]; return { name: k, x: b.x | 0, y: b.y | 0, tier: typeof mapTierOf === 'function' ? mapTierOf(k) : null,
      district: (om.at(b.x | 0, b.y | 0) || {}).district, FN: FN, seed: om.seed, party: [city.x, city.y] };
  }, NAME);
  if (place.err) { console.error(place); process.exit(1); }
  const plan = await fr.evaluate(([px, py, R]) => {
    const pal = {}, codes = []; let n = 0; const S = (2 * R + 1) * FN, x0 = (px - R) * FN, y0 = (py - R) * FN, grid = new Array(S * S);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const c = cellAt(x0 + x, y0 + y);
      const key = c ? [c.g, c.s, c.walk ? 1 : 0, c.face ? 1 : 0, c.lamp ? 1 : 0, c.gArtPool || '', c.markPool || '', c.artPool || ''].join('|') : 'null';
      if (!(key in pal)) { pal[key] = n++; codes.push(key); }
      grid[y * S + x] = pal[key];
    }
    const blocks = [];
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
      const t = om.at(px + dx, py + dy), m = tileMeta(px + dx, py + dy);
      blocks.push({ dx, dy, district: t && t.district, N: !!m.N, S: !!m.S, E: !!m.E, W: !!m.W });
    }
    return { S, R, codes, grid, blocks };
  }, [place.x, place.y, R]);
  /* the near stop, the place's block in the middle of the glass (COMBAT TWO's camera line) */
  await fr.evaluate(([px, py]) => { try { moversAdvance = function () {}; } catch (_e) {}
    const zb = zoomBounds(); CZOOM = zb[1]; TW = TW0 * CZOOM; TH = TH0 * CZOOM;
    panX = -((px + 0.5 - city.x) - (py + 0.5 - city.y)) * TW / 2; panY = -((px + 0.5 - city.x) + (py + 0.5 - city.y)) * TH / 2;
    try { MAP_GROUND.key = ''; } catch (_e) {} try { __CITY.rerender(); } catch (_e) {} }, [place.x, place.y]);
  await d.page.waitForTimeout(1500);
  const cam = await fr.evaluate(() => ({ CZOOM, TW, TH, CVW, CVH, DPR: CV_DPR, night: isNight() }));
  const shot = path.join(OUT, 'COOK4_PLACE_' + place.name.toUpperCase() + '_NEAR.png');   /* the main tool re-saves it as .webp (lossless) */
  await d.shot(shot);
  /* where every fine cell of the place's block lands on the glass (the canvas's own iso; the shot is the canvas) */
  const proj = await fr.evaluate(([px, py]) => {
    const out = []; const step = 4;
    for (let fy = 2; fy < FN; fy += step) for (let fx = 2; fx < FN; fx += step) {
      const p = __CITY.isoAt(px + (fx + 0.5) / FN, py + (fy + 0.5) / FN);
      out.push([fx, fy, Math.round(p.sx * CV_DPR), Math.round(p.sy * CV_DPR)]);
    }
    return out;
  }, [place.x, place.y]);
  const res = Object.assign({ lane: 'COOK FOUR', row: '[the place sits in the map]', source: 'tools/bohemia_cook4_the_place_sits_in_the_map_read.js on slices/BOHEMIA_DEMO.html',
    what: 'grid[y*S+x] indexes codes over the (2R+1)^2 blocks round the place at the fine grid; a code is g|s|walk|face|lamp|gArtPool|markPool|artPool; proj: [fx, fy, device x, device y] of the place block\'s fine cells on the near-stop shot',
    camera: cam, shot: path.relative(ROOT, shot), proj }, place, plan);
  fs.writeFileSync(path.join(OUT, 'COOK4_PLACE_' + place.name.toUpperCase() + '.json'), JSON.stringify(res));
  console.log(place.name, place.tier, place.district, 'block', place.x, place.y, plan.codes.length, 'codes', 'night', cam.night);
  console.log(plan.blocks.map(b => b.dx + ',' + b.dy + ' ' + b.district).join(' | '));
  await d.close();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
