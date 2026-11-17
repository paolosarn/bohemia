#!/usr/bin/env node
/* COOK FIVE 11/17/26, VAMILY rules 453, 441, 408: THE PLACES' OWN PIECES ON THE MAP, ON A PHONE. The proof of
   records/BOHEMIA_COOK_FIVE_THE_BUS_YARD_AND_THE_GREENHOUSES_11_17_26.md, and the shots its VOTE card shows. It changes nothing in
   the game. A new game on the demo (the fog lifted, as a checker measures the map), out of the town, the crew sent by the map's own travelTo
   to a block beside each real place that has a piece (place_pieces/place_pieces.json), and the same frame shot twice: BohemiaPlacePieces.on false (the kit art it wore) and true (its own piece). Prints where the place is, how wide
   a block is on the glass and the rectangle the piece was drawn in.
     node tools/bohemia_the_place_pieces_on_the_page_11_17_26.js <outdir> [phone_portrait|phone_landscape] [id,id]
   Out: <outdir>/<id>_off.png, <id>_on.png (the map's part of the screen), and a line of JSON a gate can read. */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const OUT = process.argv[2] || path.join(ROOT, 'records', 'target', 'cook5_places', 'page'), PROFILE = process.argv[3] || 'phone_portrait', ONLY = process.argv[4] ? process.argv[4].split(',') : null;
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const d = await open({ profile: PROFILE, fog: false, alpha: !!process.env.PLACES_ALPHA });   /* the demo: the game he plays (the alpha's RUN tab opens on the workshop's old walk) */
  const fr = d.fr, page = d.page, res = { profile: PROFILE, places: {} };
  const tapEl = async (h) => { const b = h && await h.boundingBox(); if (!b) return false; await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); return true; };
  for (let i = 0; i < 80; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.BohemiaPlacePieces && !!BohemiaPlacePieces.pics && !!window.BOH_REAL_PLACES && BOH_REAL_PLACES.loaded).catch(() => false)) break; }
  const inTown = () => fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display === 'block'; }).catch(() => false);
  for (let i = 0; i < 30 && !(await inTown()); i++) await page.waitForTimeout(500);
  for (let k = 0; k < 3 && await inTown(); k++) { await page.waitForTimeout(900); await tapEl(await page.$('#bohphone .bpctx.town .lv')); await page.waitForTimeout(1300); }
  const guard = setInterval(() => { fr.evaluate(() => { try { if (MEET.up && window.MEET_DONE) MEET_DONE(false); } catch (e) {} }).catch(() => {}); }, 400);
  const go = (c) => fr.evaluate((c) => { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); try { travelSpeedSet(4); } catch (e) {} const r = travelTo(0, 0, c); try { travelGoes(); } catch (e) {} return !!r; }, c);
  const settle = async () => { for (let i = 0; i < 200; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length).catch(() => false)) break; } await page.waitForTimeout(900); };
  const loaded = await fr.evaluate(() => ({ module: !!window.BohemiaPlacePieces, pictures: window.BohemiaPlacePieces && BohemiaPlacePieces.pics ? Object.keys(BohemiaPlacePieces.pics) : [], places: window.BOH_REAL_PLACES ? BOH_REAL_PLACES.cellsNow().length : 0 })).catch(() => null);
  res.loaded = loaded;
  const cells = await fr.evaluate(() => BOH_REAL_PLACES.cellsNow().filter(c => BohemiaPlacePieces.pics[c.id]).map(c => ({ id: c.id, x: c.x, y: c.y, kind: c.kind, name: c.name })));
  const box = await (await page.$('#cityFrame')).boundingBox();
  for (const c of cells) {
    if (ONLY && ONLY.indexOf(c.id) < 0) continue;
    /* the crew walks there by the map's own travelTo (six blocks short of the place, to one side), the way he would; the map will not be dragged
       that far (its pan is held near him) */
    /* (11/17, the fifth build) a spot is good when the map is what is on the glass there (a town a block away opens its screen: leave it and try the
       next side) and the whole piece is inside the shot */
    const state = async (on) => { await fr.evaluate((v) => { BohemiaPlacePieces.on = v; try { render(); } catch (e) {} }, on); await page.waitForTimeout(700);
      return fr.evaluate((id) => ({ mode: (typeof MODE !== 'undefined' ? MODE : null), min: BohemiaPlacePieces.man && BohemiaPlacePieces.man.min_block_px, tw: TW, here: [city.x | 0, city.y | 0], drew: BohemiaPlacePieces.drew, rect: BohemiaPlacePieces.last[id] || null, err: BohemiaPlacePieces.err, cvw: CVW, cvh: CVH, cw: cv.getBoundingClientRect().width, cl: cv.getBoundingClientRect().left, ct: cv.getBoundingClientRect().top }), c.id); };
    const clip = { x: box.x, y: box.y + 60, width: box.width, height: Math.min(box.height - 60, box.width * 1.05) };
    const leave = async () => { for (let q = 0; q < 4 && await inTown(); q++) { await page.waitForTimeout(700); await tapEl(await page.$('#bohphone .bpctx.town .lv')); await page.waitForTimeout(1300); } return !(await inTown()); };
    let went = false, tried = 0, kept = null, on = null;
    for (const off of [[6, 0], [0, 6], [-6, 0], [0, -6], [7, 2], [2, 7], [-7, 2], [2, -7], [5, 5], [-5, 5]]) {
      if (!(await go([c.x + off[0], c.y + off[1]]))) continue;
      tried++; went = [c.x + off[0], c.y + off[1]];
      await settle(); await page.waitForTimeout(1500);
      if (await inTown()) { await leave(); continue; }
      kept = await fr.evaluate(() => [city.x | 0, city.y | 0]);
      on = await state(true);
      const r = on.rect, kk = on.cw / on.cvw;
      if (r && r.x * kk + on.cl >= clip.x && r.y * kk + on.ct >= clip.y && (r.x + r.w) * kk + on.cl <= clip.x + clip.width && (r.y + r.h) * kk + on.ct <= clip.y + clip.height) break;
      on = null;
    }
    if (!on) { res.places[c.id] = { at: [c.x, c.y], kind: c.kind, sent_to: went, tried: tried, err: 'no spot showed the map with the whole piece on it' }; continue; }
    const off = await state(false); await page.screenshot({ path: path.join(OUT, c.id + '_off.png'), clip: clip });
    on = await state(true); await page.screenshot({ path: path.join(OUT, c.id + '_on.png'), clip: clip });
    const k = on.cw / on.cvw, at = on.rect ? { x: Math.round(on.rect.x * k + on.cl), y: Math.round(on.rect.y * k + on.ct - 60), w: Math.round(on.rect.w * k), h: Math.round(on.rect.h * k) } : null;   /* the piece on the shot, in the shot's own points */
    res.places[c.id] = { at: [c.x, c.y], kind: c.kind, sent_to: went, tried: tried, arrived: !!went && kept[0] === went[0] && kept[1] === went[1], here: on.here, block_css: +(on.tw * on.cw / on.cvw).toFixed(1), mode: on.mode, tw: on.tw, min: on.min, off_drew: off.drew, on_drew: on.drew, rect: on.rect, on_shot: at, shot_points: [clip.width, clip.height], err: on.err };
  }
  clearInterval(guard);
  fs.writeFileSync(path.join(OUT, 'page_' + PROFILE + '.json'), JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res));
  await d.close ? d.close() : (d.browser && d.browser.close());
  process.exit(0);
})().catch(e => { console.log('FAILED ' + (e && e.stack || e)); process.exit(1); });
