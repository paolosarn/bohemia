/* ==========================================================================
   THE REGION IS BATTLE BROTHERS' SIZE  (RUN, 10/16/26, VAMILY [the map at Battle Brothers' size], rules 109, 110)

   PAOLO 10/16: "our map has to be as big as fucking Battle Brothers and that's still not the case ... a larger grid or
   something ... I'm choosing Battle Brothers."
   MEASURED FIRST: the map's travel grid was the valley, 96 x 96 (9,216 blocks), the camera stopped at its rim, and the
   painted land around it (496 blocks across) could not be walked. Battle Brothers: about 140 x 140 tiles (19,600;
   community-measured from world.nut and a map tool's 19,400), about seventeen settlements, the same size every game.
   NOW (slices/bohemia_region.js): the valley keeps its grid and a region grid of the same blocks surrounds it, read off
   the land painting (open, road, rough, impassable); the party walks out onto it; twelve real places around Las Vegas
   are settlements there; the camera's far stop is the whole region.

   LEGS, on the demo's map:
     R1 *** THE MAP IS BIGGER THAN BATTLE BROTHERS' *** (blocks across and in all, against 140 and 19,600)
     R2 *** THE FAR STOP IS THE WHOLE REGION, THE NEAR STOP A BLOCK *** (blocks across the glass at each stop)
     R3 *** A CROSSING TAKES DAYS *** (the real route from the city to the far places, summed by the step cost: days)
     R4 *** HE WALKS OUT OF THE VALLEY *** (a tap on a place out there sets a journey that leaves the valley's box, and
        the party stands outside it; the clock moved)
     R5 *** A PLACE OUT THERE IS A SETTLEMENT *** (arriving at one opens the settlement screen with its name)
     R6 the places are drawn at the far stop (twelve set on ground he can stand on, those on the glass drawn)
     R7 the valley's own journeys never leave the valley (a route between two valley blocks stays inside its box)
     R8 nothing threw
   node gates/the_region_is_battle_brothers_size_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('THE REGION IS BATTLE BROTHERS\' SIZE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true, world: 1 }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  try {
    const fr = d.fr;
    for (let i = 0; i < 120; i++) { if (await fr.evaluate(() => !!(window.BOH_REGION && BOH_REGION.ready))) break; await d.page.waitForTimeout(250); }
    const N = await fr.evaluate(() => window.BOH_REGION && BOH_REGION.ready ? BOH_REGION.numbers() : null);
    ok('*** R1 THE MAP IS BIGGER THAN BATTLE BROTHERS\' *** (' + (N && N.tilesAcross) + ' blocks across, ' + (N && N.tiles) + ' in all; Battle Brothers about 140 and 19,600; the valley alone was 96 and 9,216)',
      !!N && N.tilesAcross >= 140 && N.tiles >= 19600);
    ok('*** R2 THE FAR STOP IS THE WHOLE REGION, THE NEAR STOP A BLOCK *** (far: ' + (N && N.farShowsBlocksAcross) + ' blocks across the glass at zoom ' + (N && N.zoomFar) + '; near: ' + (N && N.nearShowsBlocksAcross) + ' blocks at zoom ' + (N && N.zoomNear) + ')',
      !!N && N.farShowsBlocksAcross >= N.tilesAcross * 0.95 && N.nearShowsBlocksAcross <= 6);
    /* R3: the real routes, costed the way a step is costed */
    const X = await fr.evaluate(() => {
      const R = BOH_REGION, far = R.places.slice().sort((a, b) => Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)) - Math.max(Math.abs(a.x - city.x), Math.abs(a.y - city.y)));
      const out = [];
      for (const p of far.slice(0, 3)) { const pa = cityRoute(city.x, city.y, p.x, p.y); if (!pa) { out.push({ name: p.name, blocks: null }); continue; }
        let m = 0; for (let i = 1; i < pa.length; i++) m += cityStepMins(pa[i][0], pa[i][1]); out.push({ name: p.name, blocks: pa.length - 1, days: +(m / 1440).toFixed(1) }); }
      return out; });
    const best = X.filter(x => x.days != null).sort((a, b) => b.days - a.days)[0];
    ok('*** R3 A CROSSING TAKES DAYS *** (' + X.map(x => x.name + ' ' + (x.blocks == null ? 'NO ROUTE' : x.blocks + ' blocks, ' + x.days + ' days')).join('; ') + '; rim to rim ' + (N && N.daysAcrossRoad) + ' days on a road, ' + (N && N.daysAcrossOpen) + ' across open ground)',
      X.length >= 3 && X.every(x => x.blocks != null) && !!best && best.days >= 1);
    /* R4: walk out. The nearest place, tapped on the glass the way a finger does, at 5x */
    const T = await fr.evaluate(() => {
      const R = BOH_REGION, p = R.places.slice().sort((a, b) => Math.max(Math.abs(a.x - city.x), Math.abs(a.y - city.y)) - Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)))[0];
      const r = document.getElementById('cv').getBoundingClientRect(), q = __CITY.isoAt(p.x, p.y);
      return { name: p.name, px: p.x, py: p.y, x: r.left + q.sx, y: r.top + q.sy + TH / 2, on: q.sx > 0 && q.sx < r.width && q.sy > 0 && q.sy < r.height, min0: (T && T.min) | 0, day0: (T && T.day) | 0 }; });
    let started = false;
    /* a quiet road for this walk: an encounter on the way (the road's own director) is a fight, which is not what this leg asks */
    await fr.evaluate(() => { window.__roadDir = roadDirector; roadDirector = function(){ return null; }; });
    if (T.on) { await d.tapAt(T.x, T.y); }
    else { await fr.evaluate((t) => { const r = document.getElementById('cv').getBoundingClientRect(); const ox = CVW / 2 - (city.x - city.y) * TW / 2 + panX, oy = CVH / 2 - (city.x + city.y) * TH / 2 + panY; const q = iso(t.px, t.py, ox, oy); travelTo(q.sx, q.sy + TH / 2); }, T); }
    started = await fr.evaluate(() => !!(TRAVEL && TRAVEL.path && TRAVEL.path.some(c => !BOH_REGION.inCity(c[0], c[1]))));
    await fr.evaluate(() => { try { TRAVEL_SPEED = 5; } catch (_e) { } });
    /* the steps he takes out there are counted where they are taken (a region step's cost), with the last block */
    let out = null; for (let i = 0; i < 400; i++) { out = await fr.evaluate(() => ({ x: city.x, y: city.y, steps: BOH_REGION.steps, last: BOH_REGION.lastOut || null, day: (T && T.day) | 0, min: (T && T.min) | 0 })); if (out.steps >= 3) break; await d.page.waitForTimeout(250); }
    const lastOut = out && out.last && !(out.last[0] >= 0 && out.last[1] >= 0 && out.last[0] < 96 && out.last[1] < 96);
    ok('*** R4 HE WALKS OUT OF THE VALLEY *** (tapped ' + T.name + (T.on ? ' on the glass' : ' off the glass, by its own spot') + '; the journey leaves the valley ' + started + '; ' + (out && out.steps) + ' steps taken out on the region, the last at ' + (out && out.last) + ' (outside the 96-block box ' + lastOut + '); day ' + T.day0 + ' ' + T.min0 + ' min -> day ' + (out && out.day) + ' ' + (out && out.min) + ' min)',
      started && !!out && out.steps >= 3 && lastOut && (out.day > T.day0 || out.min > T.min0));
    await fr.evaluate(() => { if (window.__roadDir) roadDirector = window.__roadDir; });
    /* R5: arrive. Set down beside the place (the walk itself is R4) and touch it */
    const A = await fr.evaluate((t) => { try { TRAVEL = null; city.x = t.px; city.y = t.py + 1; render(); } catch (_e) { }
      const ok2 = travelTo((function(){ const ox = CVW / 2 - (city.x - city.y) * TW / 2 + panX, oy = CVH / 2 - (city.x + city.y) * TH / 2 + panY; return iso(t.px, t.py, ox, oy).sx; })(),
        (function(){ const ox = CVW / 2 - (city.x - city.y) * TW / 2 + panX, oy = CVH / 2 - (city.x + city.y) * TH / 2 + panY; return iso(t.px, t.py, ox, oy).sy + TH / 2; })());
      return { ok2 }; }, T);
    let S = null; for (let i = 0; i < 60; i++) { S = await fr.evaluate(() => ({ open: !!(LOOP.frame && LOOP.frame.style.display === 'block'), name: LOOP.open && LOOP.open.name, region: !!(LOOP.open && LOOP.open.region) })); if (S.open) break; await d.page.waitForTimeout(250); }
    ok('*** R5 A PLACE OUT THERE IS A SETTLEMENT *** (beside ' + T.name + ', a touch on it opens the settlement screen ' + (S && S.open) + ' as ' + (S && S.name) + ')', !!S && S.open && S.name === T.name);
    await fr.evaluate(() => { try { loopClose && loopClose(); } catch (_e) { } try { if (LOOP.frame) LOOP.frame.style.display = 'none'; } catch (_e) { } });
    /* R6: the places drawn at the far stop */
    const P = await fr.evaluate(() => { const zb = zoomBounds(); CZOOM = zb[0]; TW = TW0 * CZOOM; TH = TH0 * CZOOM; panX = 0; panY = 0; try { city.x = 48; city.y = 48; } catch (_e) { } render(); return { n: BOH_REGION.places.length, drawn: BOH_REGION.drawn, names: BOH_REGION.places.map(p => p.name) }; });
    ok('R6 the places are drawn at the far stop (' + P.n + ' set on ground he can stand on, ' + P.drawn + ' drawn on the glass: ' + P.names.join(', ') + ')', P.n >= 10 && P.drawn >= Math.min(P.n, 8));
    /* R7: a valley journey stays in the valley */
    const V = await fr.evaluate(() => { const cands = []; for (let y = 5; y < om.n - 5; y += 7) for (let x = 5; x < om.n - 5; x += 7) if (cityWalkable(x, y)) cands.push([x, y]);
      const a = cands[Math.floor(cands.length / 2)];
      let routes = 0, left = 0; for (const b of cands.slice(0, 14)) { if (!a || (b[0] === a[0] && b[1] === a[1])) continue; const pa = cityRoute(a[0], a[1], b[0], b[1]); if (!pa) continue; routes++; if (pa.some(c => !BOH_REGION.inCity(c[0], c[1]))) left++; }
      return { routes, left }; });
    ok('R7 the valley\'s own journeys never leave the valley (' + V.routes + ' routes between valley blocks, ' + V.left + ' left the box)', V.routes >= 3 && V.left === 0);
    ok('R8 nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 140) : '') + ')', d.errs.length === 0);
  } catch (e) { ok('the gate ran without throwing [' + String(e.message).slice(0, 200) + ']', false); }
  await d.close();
  done();
})();
