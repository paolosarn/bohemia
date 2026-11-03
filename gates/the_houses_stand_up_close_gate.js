#!/usr/bin/env node
/* ============================================================================
   THE HOUSES STAND UP CLOSE GATE (WORLD 8, 11/3/26; ask lines 117 and 185; rules 300 and 337).

   PAOLO 10/25: 'the buildings to be taller taller taller... the bottom of your legs... are behind the buildings.' PAOLO 10/26:
   'zoom in a lot more, even on the main map... you feel like you're actually watching your team walk through the city.'
   PAOLO 10/27: 'why can't the graphics just get better as you zoom in.' Code: slices/bohemia_map_houses.js, hooks
   tools/bohemia_world_8_map_houses_patch.py, models tools/bohemia_world_8_map_houses.py (slices/map_houses/).

   On the demo, through the one driver (node gates/the_houses_stand_up_close_gate.js [phone_portrait|phone_landscape|computer]):
     Z1 ONE PINCH: real two-finger spreads on the map take it past the old closest stop to the street stop (a block at least 370
        CSS px), on the same corner-on camera (the old second mode, STREET, stays off)
     Z2 the old closest stop keeps its number (zoomBounds()[1]): every check that names it still means the same place
     M1 at the street stop the studio's models stand on the painter's lots: at least 8 drawn, every one a house or trailer lot
     M2 under them the painter lays the yard: the painting's depth at a drawn house's ground is flat on its tile; the same tile
        painted without the yards stands there (MUTATION)
     M3 TALLER: at the street stop a house stands over his men (the median 1.6 times, the tallest twice)
     M4 ONE HAND-OVER, NO GHOST: at the old stop (a block 85) the painted houses; from a block 96 the models, each only on a
        tile whose yards are laid (never a painted box and a model at once)
     W1 BEHIND A HOUSE: a walker behind a model is covered at its pixels; in front of it he is not
     W2 his crew, walking at the street stop, is covered by models (the depth test counts model pixels over them)
     W3 THE WALK READS: at the street stop a block takes several beats and the crew crosses the glass at most 130 CSS px a
        second; at the opening stop one beat, as before
     F1 no model stands on ground he has not seen
     C1 the layer costs at most 3 ms a frame at the street stop (the median of 10; the whole frame printed beside it)
     R1 ROADS FIRST (rule 356): the valley's road network is one piece
     R2 every street end is drawn as an end (the painter's cul-de-sac with a kerb all round): at the city's edge, open ground or
        water, a place's own gate, or a walled suburb street
     C2 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };

async function run(prof) {
  console.log('\n-- ' + prof + ' --');
  const d = await open({ profile: prof, fog: true, engage: true, beforeTap: async (p) => {
    for (let i = 0; i < 120; i++) { if (await p.evaluate(() => !!(window.BOH_TITLE && BOH_TITLE.up && BOH_TITLE.up())).catch(() => false)) break; await p.waitForTimeout(500); }
    await require(path.join(ROOT, 'tools', 'bohemia_through_the_title.js')).throughTheTitle(p, 60000); } });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.BohemiaMapHouses).catch(() => false)) break; }
  /* the start's town: he leaves it the way a player does */
  for (let i = 0; i < 80; i++) { const t = await fr.evaluate(() => ({ on: !!(window.__START_IN_TOWN), opened: !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened) })).catch(() => ({})); if (t.opened || (i > 12 && !t.on)) break; await page.waitForTimeout(500); }
  const inTown = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block')).catch(() => false);
  if (await inTown()) {
    await page.waitForTimeout(1500);
    const sfr = page.frames().find(f => /SETTLEMENT_SCREEN/.test(f.url())), lv = sfr && await sfr.$('#leave'), bx = lv && await lv.boundingBox();
    if (bx) { if (prof === 'computer') await page.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); else await page.touchscreen.tap(bx.x + bx.width / 2, bx.y + bx.height / 2); }
    for (let i = 0; i < 8 && await inTown(); i++) await page.waitForTimeout(500);
    if (await inTown()) await fr.evaluate(() => loopClose()).catch(() => {});
  }
  for (let i = 0; i < 30; i++) { if (await fr.evaluate(() => BohemiaMapHouses.ready()).catch(() => false)) break; await fr.evaluate(() => { try { render(); } catch (e) {} }); await page.waitForTimeout(500); }
  /* every game starts somewhere else (rule 155(a)): he is stood on a road beside a suburb he has seen, away from any town, so
     every phone and every seed measures the same thing (a road block with at least four house blocks round it) */
  const spot = await fr.evaluate(() => { const N = om.n, H = /^(suburb|estate|gated|trailer)$/; let best = null, bd = 1e9;
    for (let y = 3; y < N - 3; y++) for (let x = 3; x < N - 3; x++) { if (!cityWalkable(x, y) || loopTownAt(x, y, 3)) continue;
      let k = 0; for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) { const t = om.at(x + a, y + b); if (t && H.test(t.district)) k++; }
      if (k < 4) continue; const dd = Math.abs(x - city.x) + Math.abs(y - city.y); if (dd < bd) { bd = dd; best = [x, y]; } }
    if (!best) return null; try { travelStop(); } catch (e) {} city.x = best[0]; city.y = best[1]; CITY_GLIDE.tx = null; fogClear(best[0], best[1], 7);
    try { camHold(); } catch (e) {} render(); return best; });
  console.log('  (stood at ' + JSON.stringify(spot) + ', a road beside a suburb)');
  const frameBox = await (await fr.frameElement()).boundingBox();
  const zb = await fr.evaluate(() => zoomBounds());
  const settleTiles = async () => { for (let i = 0; i < 60; i++) { const w = await fr.evaluate(() => { render(); return VBT.want | 0; }); if (!w && i > 2) break; await page.waitForTimeout(400); } await fr.evaluate(() => render()); };

  /* ---------- Z1: one pinch, real fingers ---------- */
  await fr.evaluate(() => { setZoomAt(1); try { camHold(); } catch (e) {} render(); });
  const cx = frameBox.x + frameBox.width / 2, cy = frameBox.y + frameBox.height * 0.32;
  const spread = async () => {
    if (prof === 'computer') { await page.mouse.move(cx, cy); for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, -240); await page.waitForTimeout(40); } await page.waitForTimeout(300); return; }
    for (let i = 0; i <= 16; i++) { const r = 20 + 110 * i / 16;
      await d.cdp.send('Input.dispatchTouchEvent', { type: i === 0 ? 'touchStart' : 'touchMove', touchPoints: [{ x: cx - r, y: cy, id: 1 }, { x: cx + r, y: cy, id: 2 }] });
      await page.waitForTimeout(24); }
    await d.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await page.waitForTimeout(400);
  };
  const tws = [];
  for (let k = 0; k < 14; k++) { await spread(); const t = await fr.evaluate(() => TW); tws.push(Math.round(t)); if (tws.length > 2 && tws[tws.length - 1] === tws[tws.length - 2] && tws[tws.length - 1] > 300) break; }
  const z1 = await fr.evaluate(() => ({ TW, CZOOM, street: !!(window.STREET && STREET.on), mult: window.STREET ? STREET.mult : 1, k: TH / TW }));
  ok('Z1 ' + prof + ': one pinch takes the map past the old closest stop to the street stop, on the same camera', z1.TW >= 370 && !z1.street && Math.abs(z1.mult - 1) < 1e-6 && Math.abs(z1.k - 0.5) < 1e-6,
     'a block ' + tws.join(' > ') + ' CSS px (the old closest stop ' + Math.round(zb[1] * 18) + '); the second mode ' + (z1.street ? 'ON' : 'off') + ', the ground 2:1 ' + (Math.abs(z1.k - 0.5) < 1e-6));
  const zb2 = await fr.evaluate(() => zoomBounds());
  ok('Z2 ' + prof + ': the old closest stop keeps its number', Math.abs(zb2[1] - zb[1]) < 1e-9 && zb[1] * 18 < 300, 'zoomBounds()[1] ' + zb[1].toFixed(2) + ' (a block ' + Math.round(zb[1] * 18) + ' px), the pinch\'s own stop ' + (z1.TW / 18).toFixed(2));

  /* ---------- M: the models at the street stop ---------- */
  await fr.evaluate(() => { setZoomAt(BohemiaMapHouses.streetTW() / TW0); try { camHold(); } catch (e) {} render(); });
  await settleTiles();
  const ph = await fr.evaluate(() => { const o = mapPersonDraw, hs = []; mapPersonDraw = function () { const r = o.apply(this, arguments); if (r) hs.push(r.h); return r; };
    MAP_GROUND.key = ''; render(); mapPersonDraw = o; return hs; });
  const M = await fr.evaluate(() => {
    const F = BohemiaMapHouses.frame(), L = BohemiaMapHouses.last, out = { n: F.length, a: L.a, kinds: {}, unseen: 0, flat: 0, flatN: 0, tall: [], keys: {} };
    F.forEach(e => { out.kinds[e.kind] = (out.kinds[e.kind] | 0) + 1; out.keys[e.k.replace(/_\d+$/, '')] = 1; if (!fogSeen(e.gx, e.gy)) out.unseen++; if (e.kind === 0) out.tall.push(e.rh); });
    F.filter(e => e.kind === 0).slice(0, 12).forEach(e => { const T = e.T; if (!T || !T.dep || !T.flat) return; out.flatN++;
      const u = Math.floor((e.X - T.org[0]) * T.S), v = Math.floor((e.Y - T.org[1]) * T.S); const k = T.dep[v * T.P + u] | 0; (out.ks || (out.ks = [])).push(k); if (k < Math.max(1, T.S / 24)) out.flat++; });
    return out; });
  ok('M1 ' + prof + ': at the street stop the studio\'s models stand on the painter\'s lots', M.n >= 8 && M.a === 1 && (M.kinds[0] | 0) + (M.kinds[1] | 0) === M.n,
     M.n + ' drawn (' + (M.kinds[0] | 0) + ' houses, ' + (M.kinds[1] | 0) + ' trailers; models ' + Object.keys(M.keys).join(', ') + ')');
  /* M2 and its mutation: the same tile painted without the yards */
  const mut = await fr.evaluate(() => {
    const F = BohemiaMapHouses.frame().filter(e => e.kind === 0 && e.T && e.T.flat); if (!F.length) return null;
    const T = F[0].T, inp = vbTileInput(T.tx, T.ty, T.S); inp.flat = false; const c = vbCityCore(inp); let stand = 0, n = 0;
    F.filter(e => e.T === T).slice(0, 12).forEach(e => { const u = Math.floor((e.X - T.org[0]) * c.S), v = Math.floor((e.Y - T.org[1]) * c.S); n++; if ((c.dep[v * c.P + u] | 0) >= Math.max(1, c.S / 24)) stand++; });
    return { stand, n }; });
  /* a nearer tower can stand over a yard's middle on the picture (its depth is the tower's): four in five */
  ok('M2 ' + prof + ': under the models the painter lays the yard (and without the yards the box stands there)', M.flatN >= 4 && M.flat >= Math.ceil(M.flatN * 0.8) && !!mut && mut.n >= 1 && mut.stand >= Math.ceil(mut.n * 0.75),
     M.flat + ' of ' + M.flatN + ' house grounds flat on their yard tiles (depth ' + (M.ks || []).join(',') + '); painted without the yards ' + (mut ? mut.stand + ' of ' + mut.n + ' stand' : 'no tile'));
  const man = ph.length ? Math.max.apply(null, ph) : 0, tallMed = M.tall.length ? M.tall.slice().sort((a, b) => a - b)[M.tall.length >> 1] : 0;
  /* his men are the party at their one size (rule 21); a house grows with the zoom: at the street stop it stands over them */
  ok('M3 ' + prof + ': TALLER: at the street stop a house stands over his men (the median at least 1.6 times his height, the tallest twice)', man > 0 && tallMed >= 1.6 * man && Math.max.apply(null, M.tall) >= 2 * man,
     'houses ' + tallMed.toFixed(0) + ' CSS px tall (median of ' + M.tall.length + ', the tallest ' + Math.max.apply(null, M.tall).toFixed(0) + '), his men ' + man.toFixed(0) + ' px');
  ok('F1 ' + prof + ': no model stands on ground he has not seen', M.unseen === 0 && M.n > 0, M.unseen + ' of ' + M.n + ' on unseen ground; ' + (await fr.evaluate(() => BohemiaMapHouses.last.unseen)) + ' lots left off unseen ground');
  const M4 = await fr.evaluate(async () => { const r = {}; for (const tw of [85, 100]) { setZoomAt(tw / TW0); render();
      for (let i = 0; i < 40 && (VBT.want | 0); i++) { await new Promise(q => setTimeout(q, 300)); render(); } render();
      const F = BohemiaMapHouses.frame(); r[tw] = { n: F.length, notYard: F.filter(e => !e.T || !e.T.flat).length }; } return r; });
  ok('M4 ' + prof + ': ONE HAND-OVER, NO GHOST: at the old closest stop the painted houses, from a block 96 the models, each only on a tile whose yards are laid',
     M4[85].n === 0 && M4[100].n > 0 && M4[100].notYard === 0, 'a block 85 px: ' + M4[85].n + ' models; a block 100: ' + M4[100].n + ', ' + M4[100].notYard + ' over a painted box');

  /* ---------- W1: behind and in front ---------- */
  await fr.evaluate(() => { setZoomAt(BohemiaMapHouses.streetTW() / TW0); try { camHold(); } catch (e) {} render(); });
  await settleTiles();
  const W1 = await fr.evaluate(() => { const F = BohemiaMapHouses.frame(); let tried = 0, behind = 0, front = 0;
    for (const e of F.slice(0, 20)) { let pt = null;
      for (let v = Math.floor(e.ih * 0.3); v < e.ih * 0.7 && !pt; v += 4) for (let u = Math.floor(e.iw * 0.3); u < e.iw * 0.7; u += 4) if (e.al[v * e.iw + u] > 200) { pt = [e.rx + (u + 0.5) * e.s, e.ry + (v + 0.5) * e.s]; break; }
      if (!pt) continue; tried++;
      /* only a model that is the nearest one there counts for 'in front' (a nearer model could stand over the same pixel) */
      if (mapDepthCovers(pt[0], pt[1], { d: e.d - 0.6, cx: -9, cy: -9 })) behind++;
      /* in front of it: covered only where a model nearer than him stands over that pixel (counted by hand over the frame) */
      const R = { d: e.d + 0.6, cx: -9, cy: -9 }, want = F.some(o => { if (o.d <= R.d + 0.08) return false; if (pt[0] < o.rx || pt[1] < o.ry || pt[0] >= o.rx + o.rw || pt[1] >= o.ry + o.rh) return false;
        const u = Math.floor((pt[0] - o.rx) / o.s), v = Math.floor((pt[1] - o.ry) / o.s); return o.al[v * o.iw + u] > 110; });
      if (BohemiaMapHouses.covers(pt[0], pt[1], R) === want) front++; }
    return { tried, behind, front }; });
  ok('W1 ' + prof + ': BEHIND A HOUSE he is covered at its pixels, in front of it he is not', W1.tried >= 5 && W1.behind === W1.tried && W1.front === W1.tried, W1.behind + ' of ' + W1.tried + ' covered behind, ' + W1.front + ' clear in front');

  /* ---------- W2 + W3: his crew walks at the street stop ---------- */
  const trip = await fr.evaluate(() => { const F = BohemiaMapHouses.frame().filter(e => e.kind === 0), C = [], seen = {};
    /* a block he can walk to, two to five off, beside a house lot (so the way passes the models), on a way that never enters a
       town (a town's screen would open and end the walk): the game's own route is read and a way through a town is passed over */
    for (const e of F) for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) { const x = e.gx + a, y = e.gy + b, k = x + ',' + y, dd = Math.abs(x - city.x) + Math.abs(y - city.y);
      if (!seen[k] && dd >= 2 && dd <= 5 && cityWalkable(x, y) && !loopTownAt(x, y, 1)) { seen[k] = 1; C.push({ x, y, dd }); } }
    C.sort((p, q) => p.dd - q.dd);
    window.__W8C = BohemiaMapHouses.last.covered; if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1);
    for (const c of C.slice(0, 12)) { const r = travelTo(0, 0, [c.x, c.y]);
      if (r && TRAVEL && TRAVEL.path && !TRAVEL.path.slice(Math.max(1, TRAVEL.i | 0)).some(q => loopTownAt(q[0], q[1], 0))) { try { travelGoes(); } catch (e) {} return { to: [c.x, c.y], r: true, wb: BohemiaMapHouses.watchBeats(), sp: TRAVEL_SPEED, n: TRAVEL.path.length }; }
      try { travelStop(); } catch (e) {} }
    return null; });
  const samp = [];
  if (trip) for (let i = 0; i < 24; i++) { await page.waitForTimeout(250);
    samp.push(await fr.evaluate(() => { const G = cityGlidePos(performance.now()); return { t: performance.now(), x: G.x, y: G.y, tw: TW }; })); }
  const W2 = await fr.evaluate(() => ({ cov: BohemiaMapHouses.last.covered - (window.__W8C | 0), at: [city.x, city.y], tr: TRAVEL ? { i: TRAVEL.i, n: TRAVEL.path.length, gb: TRAVEL.gb | 0 } : null, sp: TRAVEL_SPEED }));
  /* and stood on a road with a house just below him on the glass (the block below his, its lot near the top corner): his crew is
     drawn and the depth test covers part of them with the model */
  /* and stood on a road beside a house at a block 105 px (the models full in): the street stop's road is a block wide, so there a
     house stands beside his road, not in front of him; at a block about 100 to 120 his men overlap the houses beside the road */
  const W2b = await fr.evaluate(() => { try { travelStop(); } catch (e) {} const keep = [city.x, city.y], z0 = CZOOM; let res = null, tried = 0;
    setZoomAt(105 / TW0); render();
    const near = []; for (let y = keep[1] - 6; y <= keep[1] + 6; y++) for (let x = keep[0] - 6; x <= keep[0] + 6; x++) if (cityWalkable(x, y) && !loopTownAt(x, y, 1)) near.push([x, y]);
    for (const c of near) { city.x = c[0]; city.y = c[1]; CITY_GLIDE.tx = null; try { camHold(); } catch (e) {} tried++;
      const c0 = BohemiaMapHouses.last.covered; MAP_GROUND.key = ''; render(); render();
      const dc = BohemiaMapHouses.last.covered - c0; if (dc > 0) { res = { at: c, cov: dc }; break; } }
    city.x = keep[0]; city.y = keep[1]; CITY_GLIDE.tx = null; setZoomAt(z0); try { camHold(); } catch (e) {} render(); return res || { tried }; });
  let px = 0; for (let i = 1; i < samp.length; i++) { const a = samp[i - 1], b = samp[i], dx = (b.x - b.y) - (a.x - a.y), dy = (b.x + b.y) - (a.x + a.y); px += Math.hypot(dx * b.tw / 2, dy * b.tw / 4); }
  const secs = samp.length > 1 ? (samp[samp.length - 1].t - samp[0].t) / 1000 : 1, v = px / secs;
  ok('W2 ' + prof + ': his crew goes behind the models: on the walk up close, or stood on a road beside the houses at a block 105 px', (!!trip && W2.cov > 0) || !!(W2b && W2b.cov > 0),
     'on the walk ' + (trip ? W2.cov + ' of his pixels covered (to ' + trip.to.join(',') + ')' : 'no walk') + '; stood at ' + (W2b && W2b.at ? W2b.at.join(',') + ' (a block 105 px): ' + W2b.cov + ' of his pixels behind a model' : 'none of ' + (W2b ? W2b.tried : 0) + ' road blocks near him'));
  const wb1 = await fr.evaluate(() => { const t = TW; setZoomAt(1); const w = BohemiaMapHouses.watchBeats(); setZoomAt(t / TW0); return w; });
  ok('W3 ' + prof + ': THE WALK READS: up close a block takes several beats and the crew crosses the glass at a walk; at the opening stop one beat', !!trip && trip.wb >= 3 && v > 5 && v <= 130 && wb1 === 1,
     trip ? 'a block ' + trip.wb + ' beats at ' + trip.sp + 'x, the crew at ' + v.toFixed(0) + ' CSS px a second over ' + secs.toFixed(1) + ' s; the opening stop ' + wb1 + ' beat' : 'no trip');
  await fr.evaluate(() => { try { travelStop(); } catch (e) {} });

  /* ---------- C1: the cost ---------- */
  /* this box draws a canvas in software (no GPU), so a frame's time here is not a phone's: the honest budget is the work, the
     pixels the models paint a frame, against the glass; a phone's GPU fills a few glasses a frame at 60 many times over. The
     software times are printed beside it; the phone's own 60 at the street stop is PLUMBER's to measure on a phone */
  const C = await fr.evaluate(() => { const a = [], f = [], dpr = (typeof CV_DPR === 'number' && CV_DPR) || 1; let px = 0;
    for (let i = 0; i < 6; i++) { MAP_GROUND.key = ''; const t0 = performance.now(); render(); f.push(performance.now() - t0); a.push(BohemiaMapHouses.last.ms); }
    BohemiaMapHouses.frame().forEach(e => { px += e.rw * e.rh; });
    const H = BohemiaMapHouses.H; H.on = false; MAP_GROUND.key = ''; const t1 = performance.now(); render(); const off = performance.now() - t1; H.on = true; render();
    const med = (v) => v.slice().sort((x, y) => x - y)[v.length >> 1]; return { layer: med(a), frame: med(f), off, n: BohemiaMapHouses.last.drew, over: px / (CVW * CVH) }; });
  ok('C1 ' + prof + ': the models paint at most two and a half glasses of pixels a frame at the street stop', C.over <= 2.5,
     C.n + ' models paint ' + C.over.toFixed(2) + ' glasses; on this software box the layer ' + C.layer.toFixed(1) + ' ms, the frame ' + C.frame.toFixed(0) + ' ms (' + C.off.toFixed(0) + ' ms with the models off)');
  /* ---------- ROADS FIRST (rule 356): the valley's road network is one piece, and a street ends only where an end reads ---------- */
  const RG = await fr.evaluate(() => { const N = om.n, isR = (x, y) => x >= 0 && y >= 0 && x < N && y < N && !!(om.at(x, y) && ROAD[om.at(x, y).district]);
    const comp = new Int32Array(N * N).fill(-1); let nc = 0, n = 0;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { if (!isR(x, y) || comp[y * N + x] >= 0) continue; const q = [[x, y]]; comp[y * N + x] = nc;
      while (q.length) { const [a, b] = q.pop(); n++; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const u = a + dx, v = b + dy; if (isR(u, v) && comp[v * N + u] < 0) { comp[v * N + u] = nc; q.push([u, v]); } } } nc++; }
    const HOUSE = /^(suburb|estate|gated|trailer|apartment|town)$/, OPEN = /^(mountain|desert|land|wash|water|lake|playa|basin|dam|springs|scrub|dunes)$/, out = { nc, n, ends: 0, open: 0, site: 0, house: [], roadEnds: 0, drawnEnd: 0 }; let JF = null; try { JF = vbStreetFlagsValley(); } catch (e) {}
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { if (!isR(x, y)) continue; let k = 0, dx = 0, dy = 0;
      for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (isR(x + a, y + b)) { k++; dx = -a; dy = -b; }
      if (k !== 1 || x === 0 || y === 0 || x === N - 1 || y === N - 1) continue; out.ends++;
      const t = om.at(x + dx, y + dy), d = t ? t.district : 'edge';
      if (d === 'edge' || OPEN.test(d)) out.open++; else if (HOUSE.test(d)) out.house.push(x + ',' + y + ' into ' + d); else out.site++;
      if (JF && om.at(x, y).district === 'arterial') { out.roadEnds++; const m = JF.f.jm[y * JF.w + x] | 0; let reads = !(m & (m - 1));   /* one join or none: the painter's cul-de-sac */
        if (!reads) { reads = true; for (const [bit, ddx, ddy] of [[1, 0, -1], [2, 1, 0], [4, 0, 1], [8, -1, 0]]) { if (!(m & bit) || isR(x + ddx, y + ddy)) continue;
          if (!(JF.f.jm[(y + ddy) * JF.w + x + ddx] | 0)) reads = false; } }   /* or it runs on: the next block is drawn as its street (the painter's through-street) */
        if (reads) out.drawnEnd++; } }
    return out; });
  ok('R1 ' + prof + ': ROADS FIRST: the valley\'s roads are one network, no street out of thin air', RG.nc === 1 && RG.n > 1000, RG.n + ' road blocks in ' + RG.nc + ' network');
  ok('R2 ' + prof + ': every street end is drawn as an end (the painter\'s cul-de-sac, a kerb all round): at the city\'s edge, a place\'s gate, or a walled street', RG.roadEnds > 0 && RG.drawnEnd === RG.roadEnds,
     RG.ends + ' ends: ' + RG.open + ' at the edge, the mountains or the water, ' + RG.site + ' at a place\'s gate, ' + RG.house.length + ' into houses' + (RG.house.length ? ' (' + RG.house.join('; ') + ')' : '') + '; ' + RG.drawnEnd + ' of ' + RG.roadEnds + ' street ends drawn as a cul-de-sac');
  ok('C2 ' + prof + ': nothing threw', errs.length === 0 && d.errs.length === 0, errs.concat(d.errs).slice(0, 2).join(' | '));
  if (process.env.HOUSES_SHOTS) { try { await d.shot(path.join(process.env.HOUSES_SHOTS, prof + '_street.png')); } catch (e) {} }
  await d.close().catch(() => {});
}

(async () => {
  const want = process.argv[2];
  const profiles = want ? [want] : ['phone_portrait', 'computer'];
  for (const p of profiles) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.stack || e.message).slice(0, 300)); } }
  console.log('\nTHE HOUSES STAND UP CLOSE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
