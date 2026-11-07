/* WHAT LIVES ON THE MAP HAS A CAP (WORLD 12, 11/7/26; VAMILY rule 431(a)(b), ask lines 510 and 511).
   PAOLO 11/7: 'there's too many vultures on screen on the map. They don't even look like vultures... you didn't even put any sort of
   checker... this shit is nonstop'. Rule 431(b): no ambient thing (birds, smoke, specks, critters) on the map without a cap on how
   many show at once and how often, held by a gate with a planted flood.
   LEGS:
     A1 THE TABLE: every kind in records/target/bb/map_ambient.json has its cap at once, and a cap a minute unless it stays put; the
        vulture and the lair birds are at nought; the module's own defaults are the file's numbers (the cap holds before the file is in)
     A2 THE DRAWERS ASK: the camps' smoke and the masts' lights (bohemia_world_state_map.js), his fire's embers (the map's btwDraw), the
        rise off a kill (bohemia_carcass.js) each ask the cap; no bird is drawn anywhere on the map (the kill's file and the world-state
        layer have no bird left in them)
     A3 ON THE PHONE, THE WHOLE VALLEY: the far stop, the middle and the near stop, panned across the valley by day and by night: every
        kind's most at once within its cap, no vulture, no lair birds
     A4 A PLANTED FLOOD, HELD: 300 camps and 60 masts dropped round him: at most 5 smoke columns and 6 lights drawn, the camps still all
        there on the ground; 25 kills taken in a second: at most 2 icons at once, at most 20 rises in the minute; making camp: at most
        7 embers
     A5 (--plant) THE CAP TAKEN OUT: the same flood with the cap made to say yes to everything turns A4 red (the leg measures)
     R  nothing threw.
   node gates/the_map_lives_under_a_cap_gate.js [--plant] */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, ms, every) { const t = Date.now(); while (Date.now() - t < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(every || 250); } return null; }
const PLANT = process.argv.includes('--plant');
let pass = 0, fail = 0, d = null;
const errs = [];
function ok(name, good, why) { if (good) pass++; else fail++; console.log('  ' + (good ? 'ok  ' : 'FAIL') + ' ' + name + (why ? '  [' + why + ']' : '')); return !!good; }
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

/* ---------- A1, A2: the files ---------- */
console.log('\nWHAT LIVES ON THE MAP HAS A CAP (rule 431(b))');
const TAB = JSON.parse(read('records/target/bb/map_ambient.json')).kinds;
const MOD = read('slices/bohemia_map_ambient.js');
const defs = {}; { const m = /var DEF = \{([\s\S]*?)\n  \};/.exec(MOD); if (m) for (const r of m[1].matchAll(/(\w+): \{ at_once: (\d+)(?:, per_minute: (\d+))?(?:, persistent: (true))? \}/g)) defs[r[1]] = { at_once: +r[2], per_minute: r[3] == null ? null : +r[3], persistent: !!r[4] }; }
const kinds = Object.keys(TAB).filter(k => k.charAt(0) !== '_');
const tabOk = kinds.every(k => Number.isInteger(TAB[k].at_once) && TAB[k].at_once >= 0 && (TAB[k].persistent === true || Number.isInteger(TAB[k].per_minute)));
const sameDefs = kinds.length === Object.keys(defs).length && kinds.every(k => defs[k] && defs[k].at_once === TAB[k].at_once && (TAB[k].persistent ? defs[k].persistent : defs[k].per_minute === TAB[k].per_minute));
ok('A1 THE TABLE: every kind has its cap at once and a minute; the vulture and the lair birds at nought; the module\'s defaults are the file\'s',
  tabOk && TAB.vulture && TAB.vulture.at_once === 0 && TAB.lair_birds && TAB.lair_birds.at_once === 0 && sameDefs, JSON.stringify({ kinds, defs }));
const WSM = read('slices/bohemia_world_state_map.js'), CAR = read('slices/bohemia_carcass.js'), CW = read('slices/BOHEMIA_CITY_WORLD.html');
const asks = {
  camp_smoke: /allow\(c\.k, 1\)/.test(WSM) && /'camp_smoke'/.test(WSM), mast_light: /'mast_light'/.test(WSM),
  camp_embers: /BohemiaAmbient\.allow\('camp_embers', 7\)/.test(CW), kill_rise: /A\.allow\('kill_rise'/.test(CAR) && /A\.appear\('kill_rise'\)/.test(CAR),
  loaded: /<script src="bohemia_map_ambient\.js"><\/script>/.test(CW) };
const noBirds = !/function bird\(/.test(CAR) && !/function birds\(/.test(WSM) && !/\bbirds\(gx/.test(WSM);
ok('A2 THE DRAWERS ASK: the smoke, the masts\' lights, his fire\'s embers, the rise off a kill; no bird is drawn anywhere on the map', Object.values(asks).every(Boolean) && noBirds, JSON.stringify({ asks, noBirds }));

(async () => {
  /* a valley with its state (camps, lairs, masts): the bench walks a code, the way A DIFFERENT VALLEY EVERY GAME does */
  d = await D.open({ profile: 'phone_portrait', arm: "try { localStorage.setItem('bohemia.world.bench.v1', 'DUST42'); } catch (e) {}" });
  d.page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const fr = d.fr;
  await waitFor(() => fr.evaluate(() => MODE === 'city' && typeof RESTORE_ANSWERED !== 'undefined' && RESTORE_ANSWERED && window.BohemiaAmbient && BohemiaAmbient.loaded() && window.BohemiaWorldStateMap && BohemiaWorldStateMap.state()), 60000);
  await fr.evaluate(() => { try { if (LOOP.open) loopClose(); } catch (e) {} try { travelStop(); } catch (e) {} });

  /* ---------- A3: the whole valley, three zooms, day and night ---------- */
  const walk = await fr.evaluate(async () => {
    const A = BohemiaAmbient; A.reset(); const [zmin, zmax] = zoomBounds(); const N = om.n, out = { frames: 0, smokeMax: 0, lightMax: 0, camps: 0 };
    const at = [city.x, city.y];
    for (const night of [false, true]) {
      if (night) { try { advance((23 * 60 - T.min + 1440) % 1440); } catch (e) {} }
      for (const z of [zmin, Math.sqrt(zmin * zmax), zmax]) {
        for (const q of [[0.5, 0.5], [0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]]) {
          city.x = Math.round(N * q[0]); city.y = Math.round(N * q[1]);
          try { camHold(); setZoomAt(z, CVW / 2, CVH / 2); camHold(); render(); } catch (e) {}
          await new Promise(r => setTimeout(r, 60)); out.frames++;
          const I = BohemiaWorldStateMap.info(), dr = I.drew || {};
          out.smokeMax = Math.max(out.smokeMax, dr.smoke | 0); out.lightMax = Math.max(out.lightMax, dr.lights | 0); out.camps = Math.max(out.camps, dr.camps | 0);
        }
      }
    }
    city.x = at[0]; city.y = at[1]; try { camHold(); render(); } catch (e) {}
    out.stats = A.stats(); return out; });
  const S3 = walk.stats || {};
  const within = Object.keys(S3).every(k => !S3[k].unlisted && (S3[k].peak | 0) <= (S3[k].cap | 0));
  ok('A3 ON THE PHONE, THE WHOLE VALLEY (far, middle, near; day and night): every kind within its cap, no vulture, no lair birds',
    within && walk.camps >= 1 && walk.smokeMax <= 5 && walk.lightMax <= 6 && (S3.vulture || {}).peak === 0 && (S3.lair_birds || {}).peak === 0 && walk.frames >= 30,
    JSON.stringify({ frames: walk.frames, smokeMax: walk.smokeMax, lightMax: walk.lightMax, campsOnGlassMax: walk.camps, stats: S3 }));

  /* ---------- A4: the planted flood ---------- */
  const flood = () => fr.evaluate(async () => {
    const A = BohemiaAmbient, WS = BohemiaWorldStateMap.state(); A.reset();
    const keep = WS.marks.slice(), tmpl = WS.marks.find(m => m.look === 'smoke') || { look: 'smoke', kind: 'camp', name: 'A CAMP' }, mast = WS.marks.find(m => m.look === 'mast') || { look: 'mast', kind: 'legend', name: 'A MAST' };
    for (let i = 0; i < 300; i++) WS.marks.push(Object.assign({}, tmpl, { x: city.x + (i % 20) - 10, y: city.y + Math.floor(i / 20) - 7, name: 'FLOOD ' + i }));
    for (let i = 0; i < 60; i++) WS.marks.push(Object.assign({}, mast, { x: city.x + (i % 10) - 5, y: city.y + Math.floor(i / 10) - 3, name: 'MAST ' + i }));
    const [zmin, zmax] = zoomBounds(); try { camHold(); setZoomAt(Math.sqrt(zmin * zmax), CVW / 2, CVH / 2); camHold(); render(); } catch (e) {}
    await new Promise(r => setTimeout(r, 100)); try { render(); } catch (e) {}
    const dr = BohemiaWorldStateMap.info().drew || {}, st1 = A.stats();
    WS.marks.length = 0; keep.forEach(m => WS.marks.push(m)); try { render(); } catch (e) {}
    /* 25 kills taken in a second */
    BohemiaCarcass.reset(); const bag0 = localStorage.getItem('bohemia.bag.v1');
    let rises = 0, flyMax = 0;
    for (let i = 0; i < 25; i++) { localStorage.setItem('bohemia.bag.v1', '[]');
      const c = BohemiaCarcass.fightHome({ outcome: { dead: 1, bodies: [{ kind: 'coyote', beast: true }], result: 'win', victory: true }, at: { gx: city.x, gy: city.y } });
      try { render(); } catch (e) {} BohemiaCarcass.take(c.id); flyMax = Math.max(flyMax, BohemiaCarcass.sky().flying); }
    for (let k = 0; k < 60 && !(A.stats().kill_rise.asked > 0 && BohemiaCarcass.sky().frames >= 3); k++) await new Promise(r => requestAnimationFrame(() => setTimeout(r, 50)));   /* real frames: the rise draws */
    const st2 = A.stats(), skyFrames = BohemiaCarcass.sky().frames, skyWhy = BohemiaCarcass.last().skyWhy || null, modeNow = MODE, hid = document.hidden;
    localStorage.setItem('bohemia.bag.v1', bag0 || '[]'); BohemiaCarcass.reset();
    /* making camp: his fire's embers */
    let made = false; try { made = !!BohemiaMapCamp.make(); } catch (e) {}
    await new Promise(r => setTimeout(r, 2200));
    const st3 = A.stats(); try { if (window.CAMP && CAMP.on) campBreak('left'); } catch (e) {}
    return { smoke: dr.smoke | 0, lights: dr.lights | 0, camps: dr.camps | 0, masts: dr.masts | 0, smokeCap: st1.camp_smoke, lightCap: st1.mast_light,
      rise: st2.kill_rise, flyMax, skyFrames, skyWhy, modeNow, hid, embers: st3.camp_embers, made };
  });
  const held = (f) => f.camps >= 300 && f.masts >= 60 && f.smoke <= 5 && f.lights <= 6 && f.smokeCap.refused > 0 && f.rise.peak >= 1 && f.rise.peak <= 2 && f.rise.minute <= 20 && f.rise.refused >= 5 && f.flyMax <= 20 && (!f.made || (f.embers.peak <= 7 && f.embers.asked > 0));
  const f4 = await flood();
  ok('A4 A PLANTED FLOOD, HELD: 300 camps and 60 masts round him, 25 kills taken in a second, his fire made', held(f4), JSON.stringify(f4));

  /* ---------- A5: the cap taken out must turn A4 red ---------- */
  if (PLANT) {
    console.log('\n--- PLANTED (must go red) ---');
    await fr.evaluate(() => { const A = BohemiaAmbient; window.__GATE_REAL = { allow: A.allow, appear: A.appear }; A.allow = function (k, w) { return w == null ? 1 : w; }; A.appear = function () { return true; }; });
    const f5 = await flood();
    await fr.evaluate(() => { const A = BohemiaAmbient, R = window.__GATE_REAL; A.allow = R.allow; A.appear = R.appear; });
    console.log('  plant: the cap says yes to everything -> ' + (held(f5) ? 'still green (THE LEG DOES NOT MEASURE)' : 'A4 red') + '  ' + JSON.stringify({ smoke: f5.smoke, lights: f5.lights, rise: f5.rise && f5.rise.minute }));
    ok('A5 PLANTED: the cap taken out turns the flood leg red', !held(f5), JSON.stringify({ smoke: f5.smoke, lights: f5.lights }));
  }
  ok('R nothing threw on any page', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log('\nWHAT LIVES ON THE MAP HAS A CAP: ' + pass + ' passed, ' + fail + ' failed');
  try { await d.close(); } catch (e) {}
  process.exit(fail ? 1 : 0);
})().catch(async (e) => { console.error(e); try { await d.close(); } catch (x) {} process.exit(1); });
