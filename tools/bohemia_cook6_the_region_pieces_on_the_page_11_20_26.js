#!/usr/bin/env node
/* COOK SIX 11/20/26, VAMILY rules 461, 441, 408: THE REGION'S PLACES WEAR THEIR OWN PIECE, ON A PHONE. The proof of
   records/BOHEMIA_COOK_SIX_THE_REGIONS_FOUR_11_20_26.md and the shots its VOTE card shows; the region leg (R1 to R3) of gate
   THE PLACES WEAR THEIR OWN PIECE. It changes nothing in the game. A new game on the demo (the fog lifted, as a checker measures the map),
   out of the town, the crew sent by the map's own travelTo out past the rim to a block beside each region place that has a piece
   (place_pieces.json, where 'region'), and the same frame shot twice: BohemiaPlacePieces.on false (the region's own painted patch) and
   true (its own piece). A place the crew cannot reach in the time (the region is real kilometres) is shot from where the map's camera
   is put beside it, and the result says so ('put': true) rather than calling it walked.
     node tools/bohemia_cook6_the_region_pieces_on_the_page_11_20_26.js <outdir> [phone_portrait|phone_landscape] [id,id]
   Out: <outdir>/<id>_off.png, <id>_on.png (the map's part of the screen) and page_<profile>.json. */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const OUT = process.argv[2] || path.join(ROOT, 'records', 'target', 'cook6_places_region', 'page'), PROFILE = process.argv[3] || 'phone_portrait', ONLY = process.argv[4] ? process.argv[4].split(',') : null;
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const d = await open({ profile: PROFILE, fog: false, alpha: !!process.env.PLACES_ALPHA });
  const fr = d.fr, page = d.page, res = { profile: PROFILE, places: {}, errors: [] };
  page.on('pageerror', e => res.errors.push(String(e && e.message || e)));
  const tapEl = async (h) => { const b = h && await h.boundingBox(); if (!b) return false; await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); return true; };
  for (let i = 0; i < 80; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.BohemiaPlacePieces && !!BohemiaPlacePieces.pics && !!window.BOH_REAL_PLACES && BOH_REAL_PLACES.loaded && !!window.BOH_REGION && BOH_REGION.ready).catch(() => false)) break; }
  const inTown = () => fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display === 'block'; }).catch(() => false);
  for (let i = 0; i < 30 && !(await inTown()); i++) await page.waitForTimeout(500);
  for (let k = 0; k < 3 && await inTown(); k++) { await page.waitForTimeout(900); await tapEl(await page.$('#bohphone .bpctx.town .lv')); await page.waitForTimeout(1300); }
  const guard = setInterval(() => { fr.evaluate(() => { try { if (MEET.up && window.MEET_DONE) MEET_DONE(false); } catch (e) {} }).catch(() => {}); }, 400);
  const go = (c) => fr.evaluate((c) => { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); try { travelSpeedSet(4); } catch (e) {} const r = travelTo(0, 0, c); try { travelGoes(); } catch (e) {} return !!r; }, c);
  const settle = async (n) => { for (let i = 0; i < n; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length).catch(() => false)) return true; } return false; };
  res.loaded = await fr.evaluate(() => ({ module: !!window.BohemiaPlacePieces, seam: !!(BohemiaPlacePieces.region), pictures: Object.keys(BohemiaPlacePieces.pics || {}), region: (BOH_REGION.places || []).length })).catch(() => null);
  const cells = await fr.evaluate(() => { const ids = {}; BOH_REAL_PLACES.list.forEach(p => { if (p.where === 'region') ids[p.name] = p.id; });
    return (BOH_REGION.places || []).filter(p => ids[p.name] && BohemiaPlacePieces.pics[ids[p.name]]).map(p => ({ id: ids[p.name], name: p.name, x: p.x, y: p.y, tier: p.tier })); });
  res.seated = cells.map(c => c.id);
  const box = await (await page.$('#cityFrame')).boundingBox();
  const clip = { x: box.x, y: box.y + 60, width: box.width, height: Math.min(box.height - 60, box.width * 1.05) };
  const state = async (on, id) => { let o = null;
    for (let t = 0; t < 6; t++) {   /* (a frame after a screenshot can come without the region's pass: render again until the frame carries it, or six tries) */
      await fr.evaluate((v) => { BohemiaPlacePieces.on = v; try { render(); } catch (e) {} }, on); await page.waitForTimeout(t ? 500 : 700);
      o = await read(id); if (!on || o.rect) break; }
    return o; };
  const read = (id) => fr.evaluate((id) => ({ mode: (typeof MODE !== 'undefined' ? MODE : null), tw: TW, here: [city.x | 0, city.y | 0], drew: BohemiaPlacePieces.region.drew, rect: BohemiaPlacePieces.region.last[id] || null, err: BohemiaPlacePieces.err,
      cvw: CVW, cw: cv.getBoundingClientRect().width, cl: cv.getBoundingClientRect().left, ct: cv.getBoundingClientRect().top }), id);
  for (const c of cells) {
    if (ONLY && ONLY.indexOf(c.id) < 0) continue;
    let walked = false, put = false, sent = [c.x, c.y + 3];
    if (await go(sent)) walked = await settle(240);
    if (await inTown()) { for (let q = 0; q < 4 && await inTown(); q++) { await page.waitForTimeout(700); await tapEl(await page.$('#bohphone .bpctx.town .lv')); await page.waitForTimeout(1300); } }
    let on = await state(true, c.id); console.log(c.id, 'walked', walked, 'here', JSON.stringify(on.here), 'rect', JSON.stringify(on.rect), 'drew', on.drew, 'mode', on.mode, 'tw', on.tw);
    const inside = (o) => { const r = o.rect, k = o.cw / o.cvw; return r && r.x * k + o.cl >= clip.x && r.y * k + o.ct >= clip.y && (r.x + r.w) * k + o.cl <= clip.x + clip.width && (r.y + r.h) * k + o.ct <= clip.y + clip.height; };
    if (!inside(on)) {   /* the region is real kilometres: put the map's camera beside it (the party marker moves with it), and say so */
      put = true; await fr.evaluate((c) => { try { if (TRAVEL) TRAVEL.path = []; } catch (e) {} city.x = c.x; city.y = c.y + 3; try { panX = 0; panY = 0; } catch (e) {} try { render(); } catch (e) {} }, c); await page.waitForTimeout(900);
      on = await state(true, c.id);
    }
    if (!inside(on)) { res.places[c.id] = { at: [c.x, c.y], tier: c.tier, walked: walked, put: put, err: 'no frame showed the whole piece', here: on.here, rect: on.rect, drew: on.drew }; console.log(c.id, JSON.stringify(res.places[c.id])); continue; }
    const off = await state(false, c.id); await page.screenshot({ path: path.join(OUT, c.id + '_off.png'), clip: clip });
    on = await state(true, c.id); await page.screenshot({ path: path.join(OUT, c.id + '_on.png'), clip: clip });
    if (!inside(on)) { res.places[c.id] = { at: [c.x, c.y], tier: c.tier, walked: walked, put: put, err: 'the frame moved between the two shots', first: true, here: on.here, rect: on.rect, drew: on.drew }; console.log(c.id, JSON.stringify(res.places[c.id])); continue; }
    const k = on.cw / on.cvw, at = { x: Math.round(on.rect.x * k + on.cl), y: Math.round(on.rect.y * k + on.ct - 60), w: Math.round(on.rect.w * k), h: Math.round(on.rect.h * k) };
    res.places[c.id] = { at: [c.x, c.y], name: c.name, tier: c.tier, walked: walked, put: put, here: on.here, block_css: +(on.tw * k).toFixed(1), mode: on.mode, off_drew: off.drew, on_drew: on.drew, rect: on.rect, on_shot: at, shot_points: [clip.width, clip.height], err: on.err };
  }
  clearInterval(guard);
  fs.writeFileSync(path.join(OUT, 'page_' + PROFILE + '.json'), JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res));
  await d.close ? d.close() : (d.browser && d.browser.close());
  process.exit(0);
})().catch(e => { console.log('FAILED ' + (e && e.stack || e)); process.exit(1); });
