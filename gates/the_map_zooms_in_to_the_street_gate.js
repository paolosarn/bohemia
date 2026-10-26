#!/usr/bin/env node
/* ============================================================================
   THE MAP ZOOMS IN TO THE STREET GATE (RUN 10/26, row [the map zooms in to the street], rule 258(e)).

   PAOLO 10/26: 'I want the zoom to zoom in a lot more, even on the main map... almost like I'm on the combat map, or maybe use
   assets of the combat map... you feel like you're actually watching your team walk through the city... you can easily zoom back
   out... it doesn't have to transition to a whole other screen or phase.'

   On the demo, through the one driver, with real two-finger pinches (node gates/the_map_zooms_in_to_the_street_gate.js [profile];
   both profiles when none is named):
     Z1  ONE PINCH GOES ON: from the map's closest stop the next squeezes carry on past it, on the same map (the same canvas, the
         city mode, no close-up, the phone and the bar where they were), down to the street stop
     Z2  THE STREET STOP IS THE FIGHT'S GROUND: straight on (the fight's camera), every block on the glass one of the fight's own
         blocks (COMBAT TWO's, from street_ground), nothing missing, the painting not under it; a house to his man as in the fight
     Z3  HIS MEN WALK IT AT THEIR SIZE: a journey at the street stop: he stays at the focus, the ground goes by under him at a walk,
         his stride turns over, he faces the way he goes on the glass, his two men with him, his size the map's own
     Z4  THE ROAMING PARTIES TOO: a party in sight, looked at on the street, stands there in its people and a finger can find it
     Z5  A TAP TRAVELS: on the street a tap on the farthest other block on the glass sets a journey to the block under the finger
     Z6  AND BACK OUT: squeezes out from the street stop come back through the turn to the map and on to the whole city, him never
         jumping more than 30 px at a frame, the phone and the bar never moving
     Z7  THE FRAME LINE: a street frame (after the turn) costs no more than the map's own closest frame on this box; a frame of the
         turn no more than one and a half of it
     Z8  THE MEMORY LINE (rule 173): after two minutes of walking and zooming at the close end the street holds its budget (20 MB)
         and, with the painting's close tiles let go, no more than those tiles were allowed (28 MB)
     Z9  MUTATION: the street off, the same squeeze past the old stop does nothing (Z1 bites)
     Z10 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const FIGHT_IDS = Object.keys(JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_ground/fight_ground.json'), 'utf8')).blocks);
const med = a => { const b = a.slice().sort((x, y) => x - y); return b.length ? b[b.length >> 1] : 0; };

async function run(profile) {
  console.log('\n-- ' + profile + ' --');
  const d = await open({ profile, fog: false });
  const fr = d.fr, page = d.page, errs = [], urls = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  page.on('response', r => { const u = r.url(); if (u.indexOf('street_ground/') >= 0) urls.push(u.replace(/^.*street_ground\//, '')); });
  for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && typeof MAP_DREW !== 'undefined' && MAP_DREW.you && typeof streetIsOn === 'function'))) break; await page.waitForTimeout(500); }
  await page.waitForTimeout(2000);
  const chrome = () => fr.evaluate(() => { const R = window.BOH_PHONE_RECT ? BOH_PHONE_RECT() : null, b = document.getElementById('bmtb'), c = cv.getBoundingClientRect();
    const q = r => r ? [r.left, r.top, r.width, r.height].map(Math.round).join(',') : 'none';
    return { phone: q(R), bar: q(b && b.getBoundingClientRect()), cv: q(c), mode: MODE, look: !!(typeof LOOK !== 'undefined' && LOOK.on), settle: !!document.getElementById('settleFrame') && getComputedStyle(document.getElementById('settleFrame')).display !== 'none' }; });
  const st = () => fr.evaluate(() => ({ cz: CZOOM, zmax: zoomBounds()[1], mult: STREET.mult, max: streetMultMax(), te: STREET.te, s: STREET.s, F: mapFocus(), you: MAP_DREW.you, street: MAP_DREW.street, camf: CAMF.on }));
  /* to the map's closest stop, the crew held */
  await fr.evaluate(() => { ZGEST.fresh = true; setZoomAt(zoomBounds()[1]); camHold(); render(); });
  await page.waitForTimeout(1200);
  const c0 = await chrome(), s0 = await st();
  /* Z9 first, the street off: the same squeeze past the old stop does nothing */
  await fr.evaluate(() => { STREET.on = false; });
  await d.pinchIn(); await page.waitForTimeout(600);
  const s9 = await st();
  await fr.evaluate(() => { STREET.on = true; ZGEST.fresh = true; setZoomAt(zoomBounds()[1]); camHold(); render(); });
  await page.waitForTimeout(800);
  ok('Z9 MUTATION: the street off, a squeeze past the old stop does nothing', s9.mult === 1 && Math.abs(s9.cz - s9.zmax) < 1e-3, 'zoom ' + s9.cz.toFixed(2) + ' of ' + s9.zmax.toFixed(2) + ', street ' + s9.mult);
  /* Z1: real squeezes, from the closest stop to the street stop */
  const trail = [];
  let n = 0, s1 = s0;
  for (; n < 8 && s1.mult < s1.max - 1e-3; n++) { await d.pinchIn(); await page.waitForTimeout(500); s1 = await st(); trail.push(+s1.mult.toFixed(2)); }
  const c1 = await chrome();
  const same = c1.phone === c0.phone && c1.bar === c0.bar && c1.cv === c0.cv && c1.mode === 'city' && !c1.look && !c1.settle;
  ok('Z1 one pinch goes on past the old closest stop to the street stop, on the same map', s1.mult >= s1.max - 1e-3 && Math.abs(s1.cz - s1.zmax) < 1e-3 && same,
     n + ' squeezes: ' + trail.join(' > ') + ' of ' + s1.max.toFixed(1) + ' (the map\'s ' + s1.zmax.toFixed(2) + ' held); phone ' + c1.phone + ', bar ' + c1.bar + ', ' + c1.mode + (c1.look ? ' LOOK' : '') + (c1.settle ? ' SETTLEMENT' : ''));
  /* Z2 */
  for (let i = 0; i < 40; i++) { const m = await fr.evaluate(() => { render(); return MAP_DREW.street && MAP_DREW.street.missing; }); if (m === 0) break; await page.waitForTimeout(250); }
  const z2 = await fr.evaluate(() => { render(); const S = STREET, sd = MAP_DREW.street, cs = [streetFrom(0, 0), streetFrom(CVW, CVH)], ids = {};
    for (let Y = Math.floor((cs[0].y + 0.5) * S.per); Y <= Math.floor((cs[1].y + 0.5) * S.per); Y++) for (let X = Math.floor((cs[0].x + 0.5) * S.per); X <= Math.floor((cs[1].x + 0.5) * S.per); X++) ids[streetBlockId(X, Y)] = 1;
    const y = MAP_DREW.you; return { te: S.te, phi: S.phi, k: S.k, a: S.a, sd: sd, ids: Object.keys(ids), tile: S.s / (S.per * 5), manBox: y && y.h, painting: S.a < 1 || !!(sd && sd.missing) }; });
  const fightRatio = 171 / 104, mapRatio = z2.tile / (z2.manBox * 110 / 145);
  ok('Z2 the street stop is the fight\'s ground, straight on, a house to his man as in the fight', z2.te === 1 && Math.abs(z2.phi) < 1e-6 && Math.abs(z2.k - Math.SQRT1_2) < 1e-6 && z2.a === 1
       && z2.sd && z2.sd.direct > 0 && z2.sd.missing === 0 && !z2.painting && z2.ids.every(i => FIGHT_IDS.indexOf(i) >= 0) && urls.length > 0 && Math.abs(mapRatio / fightRatio - 1) < 0.1,
     'turn ' + z2.te + ', tip ' + z2.k.toFixed(3) + '; ' + z2.sd.direct + ' fight blocks drawn, ' + z2.sd.missing + ' missing, ids ' + z2.ids.join(' ') + '; pictures fetched ' + urls.length
       + '; a house ' + z2.tile.toFixed(0) + ' px to his ' + (z2.manBox * 110 / 145).toFixed(0) + ' px man: ' + mapRatio.toFixed(2) + ' (the fight\'s ' + fightRatio.toFixed(2) + ')');
  /* Z3: a journey at the street stop */
  const go = await fr.evaluate(() => { for (let k = 2; k < 10; k++) for (const [dx, dy] of [[k, 0], [0, k], [-k, 0], [0, -k]]) { const x = city.x + dx, y = city.y + dy; if (!cityWalkable(x, y)) continue; const r = cityRoute(city.x, city.y, x, y); if (r && r.length) { travelPath(r, [x, y]); travelSpeedSet(TRAVEL_DEFAULT); return { to: [x, y], n: r.length }; } } return null; });
  const walk = [];
  for (let i = 0; i < 7; i++) { await page.waitForTimeout(1000);
    walk.push(await fr.evaluate(() => { render(); const y = MAP_DREW.you, F = mapFocus(), L = STREET.lead, sc = L ? (function(){ const a = streetTo(L.cx, L.cy), b = streetTo(L.cx + L.dx, L.cy + L.dy); return Math.atan2(b.y - a.y, b.x - a.x); })() : null;
      const want = sc == null ? null : ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'][((Math.round(sc / (Math.PI / 4)) % 8) + 8) % 8];
      return { t: performance.now(), W: [STREET.W.x, STREET.W.y], s: STREET.s, dx: y.x - F.x, dy: y.y - F.y, st: y.st, face: y.face, want: want, h: y.h, comp: MAP_DREW.company | 0, moving: y.moving }; })); }
  const speeds = []; for (let i = 1; i < walk.length; i++) { const a = walk[i - 1], b = walk[i]; speeds.push(Math.hypot((b.W[0] - a.W[0]) * a.s, (b.W[1] - a.W[1]) * a.s * Math.SQRT1_2) / ((b.t - a.t) / 1000)); }
  const held = walk.every(w => Math.abs(w.dx) <= 3 && Math.abs(w.dy) <= 3), strides = new Set(walk.map(w => w.st == null ? 'x' : Math.floor(w.st * 6))).size;
  const faced = walk.every(w => w.want == null || w.face === w.want), sp = med(speeds);
  ok('Z3 his men walk the street at their size: held at the focus, the ground by at a walk, his stride turning, facing his way, his two with him', !!go && held && sp >= 35 && sp <= 90 && strides >= 3 && faced && walk.every(w => w.comp >= 2 && w.moving && Math.abs(w.h - z2.manBox) < 0.5),
     (go ? go.n + ' blocks to ' + go.to : 'NO JOURNEY') + '; off the focus ' + walk.map(w => Math.round(w.dx) + ',' + Math.round(w.dy)).join(' ') + '; the ground ' + speeds.map(Math.round).join(' ') + ' px/s; stride keys '
       + strides + '; facing ' + walk.map(w => w.face + (w.want && w.want !== w.face ? '(' + w.want + '!)' : '')).join(' ') + '; his two ' + walk.map(w => w.comp).join(' ') + '; his box ' + walk[0].h);
  await fr.evaluate(() => { travelStop(); });
  /* Z4: a roaming party in sight, looked at on the street. At 06:00 of a new game every party is still at its seat, so first the valley
     goes on a while: a walk at the map's own zoom (every block pays its clock, the parties step with it) */
  await fr.evaluate(() => { ZGEST.fresh = true; setZoomAt(zoomBounds()[1]); camHold(); for (let k = 10; k < 30; k++) for (const [dx, dy] of [[k, 0], [0, k], [-k, 0], [0, -k]]) { const x = city.x + dx, y = city.y + dy;
    if (!cityWalkable(x, y)) continue; const r = cityRoute(city.x, city.y, x, y); if (r && r.length > 8) { travelPath(r, [x, y]); travelSpeedSet(TRAVEL_DEFAULT); return; } } });
  for (let i = 0; i < 24; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => (partiesAll() || []).filter(p => p && p.at && p.from && Math.max(Math.abs(p.at.x - p.from.x), Math.abs(p.at.y - p.from.y)) >= 2).length >= 3)) break; }
  await fr.evaluate(() => { travelStop(); });
  await page.waitForTimeout(1200);   /* his last step's glide lands first: the map's camera is him plus a look, so an aim during a glide moves with him */
  const z4 = await fr.evaluate(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const pp = (partiesAll() || []).filter(p => p && p.at && !(p.from && !p.arrived && Math.max(Math.abs(p.at.x - p.from.x), Math.abs(p.at.y - p.from.y)) < 2));
    pp.sort((a, b) => Math.max(Math.abs(a.at.x - city.x), Math.abs(a.at.y - city.y)) - Math.max(Math.abs(b.at.x - city.x), Math.abs(b.at.y - city.y)));
    const p = pp[0]; if (!p) return { none: true };
    const was = window.mapSees; window.mapSees = function(){ return true; };   /* sight is its own gate's (SIGHT DOWN THE STREET); here: drawn when seen */
    try { camLetGo(); setZoomAt(CZOOM * (8 / STREET.mult), mapFocus().x, mapFocus().y); streetAimAt({ x: p.at.x, y: p.at.y }); render(); await sleep(400); render();
      const pid = p.id != null ? p.id : null, hit = MAP_PARTY_HIT.filter(h => h.id === pid)[0], at = MAP_DREW.partyAt && MAP_DREW.partyAt[pid];
      return { id: pid, drawn: MAP_DREW.parties | 0, people: MAP_DREW.art.partyPeople | 0, hit: !!hit, box: hit && hit.box, at: at, d: Math.max(Math.abs(p.at.x - city.x), Math.abs(p.at.y - city.y)) };
    } finally { window.mapSees = was; camHold(); } });
  ok('Z4 a roaming party in sight stands on the street in its people, a finger can find it', !z4.none && z4.drawn >= 1 && z4.people >= 2 && z4.hit,
     z4.none ? 'no party out' : z4.id + ' ' + z4.d + ' blocks off, drawn ' + z4.drawn + ', people ' + z4.people + ', hit box ' + JSON.stringify(z4.box && [z4.box.x, z4.box.y].map(Math.round)));
  /* Z5: a tap two blocks off, at a zoom where two blocks are on the glass */
  await fr.evaluate(() => { camHold(); const F = mapFocus(); setZoomAt(CZOOM * (2 / STREET.mult), F.x, F.y); render(); });
  await page.waitForTimeout(900);
  const tgt = await fr.evaluate(() => { render(); const A = mapOpenArea(), r = cv.getBoundingClientRect(), C = [];
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) < 1) continue; const x = city.x + dx, y = city.y + dy;
      if (!cityWalkable(x, y) || (typeof townAtDoor === 'function' && townAtDoor(x, y, true))) continue; const p = streetTo(x, y);
      if (p.x > A.x0 + 16 && p.x < A.x1 - 16 && p.y > A.y0 + 16 && p.y < A.y1 - 16) C.push({ x, y, sx: p.x, sy: p.y, cx: r.left, cy: r.top, d: Math.max(Math.abs(dx), Math.abs(dy)) }); }
    C.sort((a, b) => b.d - a.d); return C[0] || null; });
  if (tgt) { await fr.evaluate(() => travelStop());
    if (profile === 'computer') { const fb = await (await fr.frameElement()).boundingBox(); await page.mouse.click(fb.x + tgt.cx + tgt.sx, fb.y + tgt.cy + tgt.sy); }   /* his computer has a mouse, not a touchscreen */
    else await d.tapAt(tgt.cx + tgt.sx, tgt.cy + tgt.sy);
    await page.waitForTimeout(700); }
  const z5 = await fr.evaluate(() => ({ to: TRAVEL && TRAVEL.to, tap: window.__MAP_TAP, mult: STREET.mult }));
  ok('Z5 on the street a tap on another block (the farthest on the glass) sets a journey to the block under the finger', !!tgt && !!z5.to && z5.to[0] === tgt.x && z5.to[1] === tgt.y && z5.mult > 1,
     tgt ? 'tapped ' + Math.round(tgt.sx) + ',' + Math.round(tgt.sy) + ' over block ' + tgt.x + ',' + tgt.y + ': journey to ' + JSON.stringify(z5.to) + ' (' + (z5.tap ? z5.tap.what : 'no tap record') + ')' : 'no block on the glass');
  await fr.evaluate(() => { travelStop(); camHold(); });
  /* Z6: back out, squeeze by squeeze, him watched at every frame */
  await fr.evaluate(() => { const F = mapFocus(); setZoomAt(CZOOM * (streetMultMax() / STREET.mult), F.x, F.y); render(); });
  await page.waitForTimeout(800);
  const outs = [];
  const watch = await fr.evaluate(() => { window.__Z6 = []; const f = () => { if (!window.__Z6) return; const y = MAP_DREW && MAP_DREW.you; if (y) window.__Z6.push([y.x, y.y, STREET.mult, CZOOM]); requestAnimationFrame(f); }; requestAnimationFrame(f); return true; });
  for (let i = 0; i < 4; i++) { await d.pinchOut(); await page.waitForTimeout(300); outs.push(await st()); }
  const fr6 = await fr.evaluate(() => { const a = window.__Z6; window.__Z6 = null; return a; });
  let jump = 0, at = -1; for (let i = 1; i < fr6.length; i++) { const j = Math.hypot(fr6[i][0] - fr6[i - 1][0], fr6[i][1] - fr6[i - 1][1]); if (j > jump) { jump = j; at = i; } }
  const c6 = await chrome(), last = outs[outs.length - 1];
  ok('Z6 squeezes out from the street stop come back through the turn to the map and on out, him never jumping', watch && last.mult === 1 && last.cz < last.zmax * 0.5 && jump <= 30 && c6.phone === c0.phone && c6.bar === c0.bar && c6.mode === 'city',
     outs.map(o => o.mult > 1 ? 'street ' + o.mult.toFixed(1) : 'map ' + o.cz.toFixed(2)).join(' > ') + '; ' + fr6.length + ' frames, his biggest jump ' + jump.toFixed(1) + ' px' + (at > 0 ? ' (street ' + fr6[at - 1][2].toFixed(2) + ' > ' + fr6[at][2].toFixed(2) + ', map ' + fr6[at][3].toFixed(2) + ')' : ''));
  /* Z7: the frame line */
  const z7 = await fr.evaluate(() => {
    camHold(); ZGEST.fresh = true; setZoomAt(zoomBounds()[1]); render();
    const time = n => { const a = []; for (let i = 0; i < n; i++) { const t = performance.now(); render(); a.push(performance.now() - t); } a.sort((x, y) => x - y); return a[a.length >> 1]; };
    const iso = (function(){ const a = []; for (let i = 0; i < 7; i++) { try { MAP_GROUND.key = ''; } catch (_e) {} const t = performance.now(); render(); a.push(performance.now() - t); } a.sort((x, y) => x - y); return a[a.length >> 1]; })();
    const F = mapFocus(), at = m => { setZoomAt(CZOOM * (m / STREET.mult), F.x, F.y); render(); };
    at(1.5); const turn = time(5); at(3); const far = time(5); at(streetMultMax()); const near = time(5);
    return { iso, turn, far, near };
  });
  ok('Z7 the frame line: a street frame no more than the map\'s own closest frame, a frame of the turn no more than one and a half of it', z7.far <= z7.iso && z7.near <= z7.iso && z7.turn <= z7.iso * 1.5,
     'the map at its closest ' + z7.iso.toFixed(1) + ' ms; the turn ' + z7.turn.toFixed(1) + ', the street far ' + z7.far.toFixed(1) + ', at the street stop ' + z7.near.toFixed(1) + ' (medians, this box)');
  /* Z8: two minutes of walking and zooming at the close end */
  const t8 = Date.now();
  await fr.evaluate(() => { const F = mapFocus(); setZoomAt(CZOOM * (streetMultMax() / STREET.mult), F.x, F.y); camHold(); });
  const legs = [streetMax => streetMax, () => 12, () => 3, m => m, () => 6, () => 20];
  let k8 = 0, journeys = 0;
  while (Date.now() - t8 < 120000) {
    const has = await fr.evaluate(() => !!TRAVEL);
    if (!has) { const g8 = await fr.evaluate(() => { for (let k = 3; k < 14; k++) for (const [dx, dy] of [[k, 0], [0, k], [-k, 0], [0, -k], [k, k], [-k, -k]]) { const x = city.x + dx, y = city.y + dy; if (!cityWalkable(x, y)) continue; const r = cityRoute(city.x, city.y, x, y); if (r && r.length > 2) { travelPath(r, [x, y]); travelSpeedSet(TRAVEL_DEFAULT); return true; } } return false; }); if (g8) journeys++; }
    const mx = await fr.evaluate(() => streetMultMax()), m = legs[k8++ % legs.length](mx);
    await fr.evaluate((m) => { const F = mapFocus(); setZoomAt(CZOOM * (Math.min(m, streetMultMax()) / STREET.mult), F.x, F.y); render(); }, m);
    await page.waitForTimeout(10000);
  }
  const z8 = await fr.evaluate(() => ({ bytes: STREET.bytes, peak: STREET.peak, budget: STREET.budget, vbt: VBT.bytes, vbtBudget: VBT.budget, pics: STREET.pics.size, comps: STREET.comp.size, dropped: STREET.dropped, landed: STREET.landed, failed: STREET.failed, moved: [city.x, city.y] }));
  ok('Z8 the memory line: two minutes at the close end, the street inside its budget and with the painting\'s tiles let go no more than they were allowed', z8.bytes <= z8.budget && z8.peak <= z8.budget * 1.25 && z8.bytes + z8.vbt <= z8.vbtBudget && z8.failed === 0,
     'held ' + (z8.bytes / 1e6).toFixed(1) + ' MB (peak ' + (z8.peak / 1e6).toFixed(1) + ') of ' + (z8.budget / 1e6) + '; the painting\'s tiles ' + (z8.vbt / 1e6).toFixed(1) + ' MB of ' + (z8.vbtBudget / 1e6) + '; ' + z8.pics + ' pictures, ' + z8.comps + ' laid blocks, ' + z8.landed + ' fetched, ' + z8.dropped + ' let go, ' + z8.failed + ' failed; ' + journeys + ' journeys, ' + k8 + ' zooms');
  ok('Z10 nothing threw', errs.length === 0 && !(await fr.evaluate(() => STREET.err)), errs.slice(0, 2).join(' | ') + ' ' + (await fr.evaluate(() => STREET.err || '')));
  await d.close();
}

(async () => {
  const profs = process.argv[2] ? [process.argv[2]] : ['phone_portrait', 'computer'];
  for (const p of profs) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e && e.stack || e).slice(0, 300)); } }
  console.log('\nTHE MAP ZOOMS IN TO THE STREET: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
