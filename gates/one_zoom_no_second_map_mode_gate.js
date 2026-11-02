#!/usr/bin/env node
/* ============================================================================
   ONE ZOOM, NO SECOND MAP MODE GATE (WORLD 11/2, ask line 276, rule 300).

   PAOLO 10/27: 'when I zoom in even more on the map then I just see a re-printed out combat map... a weird angle... why can't the
   graphics just get better as you zoom in, why does it have to enter a whole second map mode... very annoying.'
   It replaces THE MAP ZOOMS IN TO THE STREET (archive/the_map_zooms_in_to_the_street_gate.js), which held the 10/26 street: past the
   map's closest stop the camera turned to the fight's straight-on camera and the painting gave way to the fight's blocks. That is the
   second mode he named, and it is off (STREET.on false in slices/BOHEMIA_CITY_WORLD.html, __ONE_ZOOM_NO_SECOND_MAP_MODE__).

   On the demo, through the one driver, with real two-finger squeezes (node gates/one_zoom_no_second_map_mode_gate.js [profile];
   the phone and the computer when none is named):
     O1  THE PINCH CLIMBS TO THE CLOSEST STOP AND STOPS: from the far stop, squeezes in reach the map's closest stop, and two more
         squeezes there change nothing (the same zoom, no street, no block close-up, no sky, no town screen, the city mode)
     O2  THE SAME MAP AT EVERY RUNG: on every squeeze the painting drew at full weight, the camera stayed corner-on (no turn), the
         street drew nothing, and it is the same canvas
     O3  THE STOP IS WHERE THE ART HOLDS UP: at the closest stop a block's 256-px art lands one art pixel to a device pixel or finer
     O4  THE PHONE AND THE BAR NEVER MOVED through the squeezes
     O5  MUTATION: the street back on, the same squeeze at the closest stop opens the second mode (so O1 bites)
     O6  nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };

async function run(profile) {
  console.log('\n-- ' + profile + ' --');
  const d = await open({ profile, fog: false });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && typeof MAP_DREW !== 'undefined' && MAP_DREW && MAP_DREW.you && typeof streetIsOn === 'function'))) break; await page.waitForTimeout(500); }
  await page.waitForTimeout(2000);
  const chrome = () => fr.evaluate(() => { const R = window.BOH_PHONE_RECT ? BOH_PHONE_RECT() : null, b = document.getElementById('bmtb');
    const q = r => r ? [r.left, r.top, r.width, r.height].map(Math.round).join(',') : 'none';
    return { phone: q(R), bar: q(b && b.getBoundingClientRect()) }; });
  const st = () => fr.evaluate(() => {
    const sf = document.getElementById('settleFrame');
    return { cz: CZOOM, zmin: zoomBounds()[0], zmax: zoomBounds()[1], mode: MODE, mult: STREET.mult, on: streetIsOn(), te: STREET.te || 0,
      look: !!(typeof LOOK !== 'undefined' && LOOK.on), sky: !!(typeof SKY !== 'undefined' && SKY), settle: !!sf && getComputedStyle(sf).display !== 'none',
      street: !!(MAP_DREW && MAP_DREW.street), alpha: VBC.alpha, draws: VBC.draws, cvId: (cv.__oneZoomId = cv.__oneZoomId || Math.random()),
      artPx: TW * ((typeof CV_DPR === 'number' && CV_DPR) || 1), tw: TW };
  });
  /* the far stop first, the crew held: the way in starts from the whole valley */
  await fr.evaluate(() => { ZGEST.fresh = true; setZoomAt(zoomBounds()[0]); camHold(); render(); });
  await page.waitForTimeout(1200);
  const c0 = await chrome(), s0 = await st();
  const rungs = [s0];
  let reached = -1;
  for (let i = 0; i < 16; i++) {
    await d.pinchIn(); await page.waitForTimeout(700);
    const s = await st(); rungs.push(s);
    if (reached < 0 && Math.abs(s.cz - s.zmax) < 1e-3) reached = i + 1;
    if (reached > 0 && i + 1 >= reached + 2) break;   /* two more squeezes at the closest stop */
  }
  const last = rungs[rungs.length - 1], atStop = reached > 0 ? rungs[reached] : null;
  ok('O1 THE PINCH CLIMBS TO THE CLOSEST STOP AND STOPS: squeezes in reach it, and two more there change nothing',
     reached > 0 && rungs.length - 1 >= reached + 2 && Math.abs(last.cz - last.zmax) < 1e-3 && last.mode === 'city' && last.mult === 1 && !last.on && !last.look && !last.sky && !last.settle,
     'from ' + s0.cz.toFixed(2) + ' to ' + last.cz.toFixed(2) + ' of ' + last.zmax.toFixed(2) + ' in ' + reached + ' squeezes; after two more: mode ' + last.mode + ', street ' + last.mult + ', close-up ' + last.look + ', sky ' + last.sky + ', town ' + last.settle);
  const bad = rungs.filter(s => !(s.alpha >= 0.99) || s.te > 0 || s.on || s.street || s.cvId !== s0.cvId || s.mode !== 'city');
  const drew = rungs.slice(1).filter((s, i) => s.draws > rungs[i].draws).length;
  ok('O2 THE SAME MAP AT EVERY RUNG: the painting at full weight, the camera corner-on, no street, the same canvas, on every squeeze',
     bad.length === 0 && drew >= rungs.length - 3, rungs.length + ' rungs, ' + bad.length + ' off the one map, the painting redrawn on ' + drew + ' squeezes');
  ok('O3 THE STOP IS WHERE THE ART HOLDS UP: at the closest stop a block\'s 256-px art is one art pixel to a device pixel or finer',
     !!atStop && atStop.artPx <= 256 + 1 && atStop.artPx >= 200, atStop ? 'a block ' + atStop.tw.toFixed(1) + ' CSS px, ' + atStop.artPx.toFixed(0) + ' device px' : 'never reached');
  const c1 = await chrome();
  ok('O4 THE PHONE AND THE BAR NEVER MOVED', c0.phone === c1.phone && c0.bar === c1.bar, 'phone ' + c0.phone + ' -> ' + c1.phone + ', bar ' + c0.bar + ' -> ' + c1.bar);
  /* O5: the second mode back on, the same squeeze at the closest stop opens it */
  await fr.evaluate(() => { STREET.on = true; ZGEST.fresh = true; setZoomAt(zoomBounds()[1]); camHold(); render(); });
  await page.waitForTimeout(800);
  await d.pinchIn(); await page.waitForTimeout(700);
  const s5 = await st();
  await fr.evaluate(() => { STREET.mult = 1; STREET.on = false; try { streetLeft(); } catch (_e) {} ZGEST.fresh = true; setZoomAt(zoomBounds()[1]); render(); });
  ok('O5 MUTATION: the street back on, the same squeeze at the closest stop opens the second mode', s5.mult > 1, 'street ' + s5.mult.toFixed(2));
  ok('O6 nothing threw', errs.length === 0 && !(await fr.evaluate(() => STREET.err)), errs.slice(0, 2).join(' | ') || 'none');
  await d.close();
}

(async () => {
  const profs = process.argv[2] ? [process.argv[2]] : ['phone_portrait', 'computer'];
  for (const p of profs) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e && e.stack || e).slice(0, 300)); } }
  console.log('\nONE ZOOM, NO SECOND MAP MODE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
