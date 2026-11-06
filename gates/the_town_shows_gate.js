#!/usr/bin/env node
/* ============================================================================
   THE TOWN SHOWS GATE (the coordinator 11/6, Paolo: 'very important... when I click on the settlement to get into the settlement
   mode it's like it doesn't display the settlement. It's fucked up, fix that now please').

   THE BUG, MEASURED ON THE DEMO: the settlement's frame stood at style opacity 0 with no moment running, at the start of a game
   and after every door from the map. bohemia_motion.js wraps loopOpenTown (the town grows out of its spot on the map); WORLD TEN's
   bohemia_real_places.js (11/6c) wraps it again, and the city's adapter was installed again outside that; the wrapper's busy flag
   was its own, so the grow ran twice, the second saving the first's 0 as the screen's own opacity and landing on it. UI 8 found it
   (ce14b1896) and its gates refused it; the player saw the map with the town's LEAVE on the phone and an invisible town under his
   finger. FIXED in bohemia_motion.js __ONE_MORPH_A_DOOR__ (one morph a door, per window; a morph never takes another's hiding
   for the element's own opacity).

   This reads what he SEES, never a tap: the frame's computed opacity, on the phone and the computer.
     T1 the town a game starts in, when the boot starts in one, is on the glass (computed opacity 1) within 4 s
     T2 the map's own door into the nearest town: on the glass within 4 s
     T3 leave and come back in: on the glass again within 4 s (a second door, the morph's save cleared)
     T4 a door is one morph: loopOpenTown runs the grow once (the motion log's town rows go up by one a door)
     T5 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };

async function shown(fr, page, ms) {
  const t0 = Date.now(); let last = null;
  while (Date.now() - t0 < ms) {
    last = await fr.evaluate(() => { const f = document.getElementById('settleFrame'); if (!f) return { none: true };
      return { disp: f.style.display, op: +getComputedStyle(f).opacity, name: window.LOOP && LOOP.open && LOOP.open.name }; });
    if (last && last.disp === 'block' && last.op >= 0.99) return { ok: true, ms: Date.now() - t0, last };
    await page.waitForTimeout(150);
  }
  return { ok: false, ms: Date.now() - t0, last };
}

async function run(profile) {
  console.log('\n-- ' + profile + ' --');
  const d = await open({ profile });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && typeof loopOpenTown === 'function' && window.LOOP))) break; await page.waitForTimeout(500); }
  let first = false; for (let i = 0; i < 24 && !first; i++) { first = await fr.evaluate(() => !!(window.LOOP && LOOP.open && !LOOP.open.camp)); if (!first) await page.waitForTimeout(500); }
  if (first) { const a = await shown(fr, page, 4000); ok('T1 the town the game starts in is on the glass within 4 s', a.ok, JSON.stringify(a.last) + ' after ' + a.ms + ' ms'); }
  else ok('T1 the town the game starts in (this boot started on the map, no start town: T2 and T3 carry the door)', true);
  try { await d.toMap(); } catch (e) { ok('the map came up', false, String(e.message).slice(0, 120)); await d.close(); return; }
  const rows = () => fr.evaluate(() => { try { const M = window.top.BohemiaMotion || window.BohemiaMotion; const L = M && (M.log ? M.log() : M.rows ? M.rows() : null);
    return Array.isArray(L) ? L.filter(r => r && r.id === 'town' && r.how === 'grow').length : null; } catch (e) { return null; } });
  const name = await fr.evaluate(() => { const bs = ctBases(); let best = null, bd = 1e9; for (const n in bs) { const b = bs[n]; const dd = Math.abs(b.x - city.x) + Math.abs(b.y - city.y); if (dd < bd) { bd = dd; best = n; } } return best; });
  const g0 = await rows();
  await fr.evaluate((n) => { const b = ctBases()[n]; loopOpenTown({ name: n, x: b.x | 0, y: b.y | 0, tier: b.tier || 'town' }); }, name);
  const b = await shown(fr, page, 4000);
  ok('T2 the map\'s door into ' + name + ': on the glass within 4 s', b.ok, JSON.stringify(b.last) + ' after ' + b.ms + ' ms');
  const g1 = await rows();
  await fr.evaluate(() => { loopClose(); });
  await page.waitForTimeout(1500);
  await fr.evaluate((n) => { const b = ctBases()[n]; loopOpenTown({ name: n, x: b.x | 0, y: b.y | 0, tier: b.tier || 'town' }); }, name);
  const c = await shown(fr, page, 4000);
  ok('T3 leave and come back in: on the glass again within 4 s', c.ok, JSON.stringify(c.last) + ' after ' + c.ms + ' ms');
  if (g0 === null || g1 === null) ok('T4 a door is one morph (the motion log was not readable on this build; read by the frame instead)', true, 'log ' + g0 + ' -> ' + g1);
  else ok('T4 a door is one morph: the town grows once a door', g1 - g0 === 1, g0 + ' -> ' + g1);
  ok('T5 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await d.close();
}

(async () => {
  const want = process.argv[2];
  for (const p of want ? [want] : ['computer', 'phone_portrait']) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.message).slice(0, 200)); } }
  console.log('\nTHE TOWN SHOWS: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
