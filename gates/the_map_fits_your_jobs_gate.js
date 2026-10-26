#!/usr/bin/env node
/* ============================================================================
   THE MAP FITS YOUR JOBS GATE (RUN 10/26, row [the map fits your jobs], rule 228(a); EYES' normie hour F7: 'leaving Caravans the
   map stays put and the job's labels are cut at the glass's left edge').

   PAOLO 10/26: 'when you get out of the settlement the map should be as big as the two quests you added... depending where they
   are on the map, with the padding, the screen flipped or straight up, it has to zoom out so the edges are where the quests are.'

   On the demo, through the one driver, the phone and the computer (node gates/the_map_fits_your_jobs_gate.js [profile]). Jobs taken
   off the nearest town's board by its own 'Take it' message, the town left by its own LEAVE message:
     J1  TWO JOBS, LEAVING: the camera eases and HE and BOTH places the jobs send him to sit inside the OPEN area (the phone's
         margin out) with room past them; none under the phone; none off the glass
     J2  ONE JOB: the same leave fits closer (a zoom at least the two jobs' when the dropped job was the farther)
     J3  TAKEN ON THE MAP: a job taken while the map is up fits the same way
     J4  HIS AFTER IT: a pinch or the wheel during the ease stops it where it is; a journey takes the camera back to him
     J5  MUTATION: the fit off, leaving with two far jobs leaves a place off the open area
     J6  nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };

/* where he and each job's next place are on the glass, against the open area */
const WHERE = () => {
  render(); const A = mapOpenArea(), ox = CVW / 2 - (city.x - city.y) * TW / 2 + panX, oy = CVH / 2 - (city.x + city.y) * TH / 2 + panY;
  const pts = mapFitPlaces().map(q => { const p = iso(q.x, q.y, ox, oy); return { id: q.id, x: p.sx, y: p.sy + TH / 2 }; });
  const y = MAP_DREW.you; if (y) pts.unshift({ id: 'you', x: y.x, y: y.y });
  const R = window.BOH_PHONE_RECT ? BOH_PHONE_RECT() : null, cf = document.getElementById('cityfeed'), c = cv.getBoundingClientRect();
  let ph = null; if (R && R.on !== false && R.width > 2) ph = [R.left - c.left, R.top - c.top, R.right - c.left, R.bottom - c.top];
  else if (cf && getComputedStyle(cf).display !== 'none') { const a = cf.getBoundingClientRect(); ph = [a.left - c.left, a.top - c.top, a.right - c.left, a.bottom - c.top]; }
  const inside = pts.every(p => p.x >= A.x0 + 8 && p.x <= A.x1 - 8 && p.y >= A.y0 + 20 && p.y <= A.y1 - 8);
  const underPh = pts.filter(p => ph && p.x > ph[0] && p.x < ph[2] && p.y > ph[1] && p.y < ph[3]).length;
  return { cz: CZOOM, A: [A.x0, A.y0, A.x1, A.y1].map(Math.round), pts: pts.map(p => p.id + '@' + Math.round(p.x) + ',' + Math.round(p.y)), inside, underPh, n: pts.length, fit: MAP_FIT.last };
};

async function run(profile) {
  console.log('\n-- ' + profile + ' --');
  const d = await open({ profile, fog: false });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && typeof MAP_DREW !== 'undefined' && MAP_DREW.you && window.mapFitJobs && window.BohemiaJobKinds && BohemiaJobKinds.ready()))) break; await page.waitForTimeout(500); }
  await page.waitForTimeout(2000);
  const W = () => fr.evaluate(WHERE);
  const openTown = async () => {
    await fr.evaluate(() => { LOOP.held = []; LOOP.fighting = null; const bs = ctBases() || {}; let best = null; for (const n in bs) { const b = bs[n]; if (!b) continue; const dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (!best || dd < best.d) best = { name: n, x: b.x | 0, y: b.y | 0, d: dd, tier: mapTierOf(n) }; } if (best) loopOpenTown(best); });
    let sf = null; for (let i = 0; i < 60 && !sf; i++) { const fh = await fr.$('#settleFrame'); sf = fh ? await fh.contentFrame() : null; if (!sf) await page.waitForTimeout(300); }
    await sf.waitForFunction(() => window.BohemiaBoardShelf && BohemiaBoardShelf.ready && BohemiaBoardShelf.ready(), null, { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(600);
    return sf;
  };
  const take = (sf, id) => sf.evaluate((id) => { const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === id)[0]; if (!o) return null; const c = Object.assign({}, o, { says: String(o.says).replace(/\{pay\}/g, o.pay) }), S = BohemiaSettlement.state; S.held.push(o.id);
    window.parent.postMessage({ type: 'BOHEMIA_SETTLEMENT', act: 'contract', place: S.place.name, batteries: null, contract: c }, '*'); return o.id; }, id);
  const leave = (sf) => sf.evaluate(() => window.parent.postMessage({ type: 'BOHEMIA_SETTLEMENT', act: 'leave', place: BohemiaSettlement.state.place.name, batteries: null }, '*'));
  /* LEAVE, then the fit run to its end (it waits for the phone to come back over the map, and fits again if it comes back late) */
  const leaveFit = async (sf) => { const n0 = await fr.evaluate(() => MAP_FIT.n); await leave(sf);
    for (let i = 0; i < 70; i++) { await page.waitForTimeout(100); if (await fr.evaluate((n0) => !!(MAP_FIT.n > n0 && MAP_FIT.last && MAP_FIT.last.done && (MAP_FIT.last.again || performance.now() - MAP_FIT.last.at > 1500)), n0)) break; }
    await page.waitForTimeout(400); };
  /* at the near stop before each town (the phone's 4.7, the computer's 14), so the jobs start off the glass on a wide screen too */
  const zoomIn = () => fr.evaluate(() => { ZGEST.fresh = true; setZoomAt(zoomBounds()[1]); camHold(); render(); });
  /* J1 */
  await zoomIn();
  let sf = await openTown();
  const offers = await sf.evaluate(() => BohemiaBoardShelf.shelf().offers.map(o => o.id));
  for (const id of offers.slice(0, 2)) { await take(sf, id); await page.waitForTimeout(700); }
  const before = await W();
  await leaveFit(sf);
  const j1 = await W();
  ok('J1 two jobs, leaving the town: he and both places inside the open area, none under the phone', before.n >= 3 && j1.n >= 3 && j1.inside && j1.underPh === 0 && j1.fit && j1.fit.done && j1.fit.why === 'leave',
     'zoom ' + before.cz.toFixed(2) + ' -> ' + j1.cz.toFixed(2) + ', open ' + j1.A + ', ' + j1.pts.join(' ') + (before.inside ? ' (already inside before)' : ' (not inside before)') + '; fit ' + JSON.stringify(j1.fit && { why: j1.fit.why, done: j1.fit.done, stopped: j1.fit.stopped, open: j1.fit.open, z1: j1.fit.z1 && +j1.fit.z1.toFixed(3) }));
  /* J2: drop the farther job, the same leave */
  const far = await fr.evaluate(() => { const H = LOOP.held.slice(), d = j => { const n = BohemiaJobKinds.nextOf(j) || j.target; return Math.max(Math.abs((n.x | 0) - city.x), Math.abs((n.y | 0) - city.y)); };
    H.sort((a, b) => d(b) - d(a)); return H[0] ? { id: H[0].id, keep: H[1] ? H[1].id : null } : null; });
  await zoomIn();
  sf = await openTown();
  for (const id of offers.slice(0, 2)) { if (far && id !== far.id) await take(sf, id); await page.waitForTimeout(500); }
  await leaveFit(sf);
  const j2 = await W();
  ok('J2 one job: the same leave fits closer', j2.inside && j2.underPh === 0 && j2.cz >= j1.cz - 1e-6 && j2.n === 2, 'zoom ' + j2.cz.toFixed(3) + ' against two jobs\' ' + j1.cz.toFixed(3) + '; ' + j2.pts.join(' ') + '; fit ' + JSON.stringify(j2.fit && { why: j2.fit.why, done: j2.fit.done, stopped: j2.fit.stopped, open: j2.fit.open }));
  /* J3: a job taken out on the map */
  await zoomIn();
  sf = await openTown();
  const third = offers[0];
  await fr.evaluate(() => { try { LOOP.frame.style.display = 'none'; } catch (e) {} });   /* the map is up; the board's message still comes from its window */
  await page.waitForTimeout(300);
  await take(sf, third); await page.waitForTimeout(1300);
  const j3 = await W();
  ok('J3 a job taken while the map is up fits the same way', j3.inside && j3.fit && j3.fit.why === 'take' && j3.fit.done, 'zoom ' + j3.cz.toFixed(2) + '; ' + j3.pts.join(' '));
  try { await fr.evaluate(() => loopClose()); } catch (e) {}
  /* J4 */
  await zoomIn();
  const j4n = await fr.evaluate(() => MAP_FIT.n);
  sf = await openTown();
  for (const id of offers.slice(0, 2)) { await take(sf, id); await page.waitForTimeout(500); }
  await leave(sf);
  for (let i = 0; i < 40; i++) { await page.waitForTimeout(50); if (await fr.evaluate((n0) => !!(MAP_FIT.last && MAP_FIT.n > n0 && !MAP_FIT.last.done), j4n)) break; }   /* the ease is running */
  await page.waitForTimeout(120);
  await fr.evaluate(() => { setZoomAt(CZOOM * 1.1, CVW / 2, CVH / 2); });
  await page.waitForTimeout(900);
  const stopped = await fr.evaluate(() => MAP_FIT.last && MAP_FIT.last.stopped);
  const back = await fr.evaluate(() => { const n = om.n; let c = null; for (let rr = 4; rr <= 10 && !c; rr++) for (const v of DIRS) { const x = city.x + v[0] * rr, y = city.y + v[1] * rr; if (x > 1 && y > 1 && x < n - 1 && y < n - 1 && cityWalkable(x, y) && !loopTownAt(x, y, 2)) { c = [x, y]; break; } }
    travelTo(0, 0, c); const r = CAMF.on; travelStop(); return r; });
  ok('J4 his after it: a pinch during the ease stops it; a journey takes the camera back to him', stopped === 'zoom' && back === true, 'stopped by ' + stopped + ', held on a journey ' + back);
  /* J5 MUTATION */
  await fr.evaluate(() => { MAP_FIT.on = false; });
  await zoomIn();
  sf = await openTown();
  for (const id of offers.slice(0, 2)) { await take(sf, id); await page.waitForTimeout(500); }
  await leave(sf); await page.waitForTimeout(2200);
  const j5 = await W();
  await fr.evaluate(() => { MAP_FIT.on = true; });
  ok('J5 MUTATION: the fit off, a place is left off the open area at the zoom he went in at', !j5.inside, 'zoom ' + j5.cz.toFixed(2) + '; ' + j5.pts.join(' '));
  ok('J6 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await d.close();
}

(async () => {
  const want = process.argv[2];
  for (const p of want ? [want] : ['phone_portrait', 'computer']) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.message).slice(0, 220)); } }
  console.log('\nTHE MAP FITS YOUR JOBS: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
