#!/usr/bin/env node
/* THE PARTY WALKS AS ONE (ANIMATION [the party walks as one], 10/11; his tenth votes on the parties walking, YES with
   fixes: 'make them closer to me, more behind me, a cohesive unit; behind the main character there's like a shadow
   line, very ugly; I'm so confused what the arrow is for'). The 'shadow line' was the banner's dark pole standing at
   his back and the 'arrow' its yellow cloth (COOK's marker); the company walked level with his shoulders, 20 px out.
   MAP_PARTY_AS_ONE (slices/BOHEMIA_CITY_WORLD.html, __THE_PARTY_WALKS_AS_ONE__) is a CANDIDATE, OFF BY DEFAULT (rule
   100: nothing into the game before his FINAL). Asked of the real map in the alpha (chromium through the one driver,
   playwright), the clock driven, a trip in every one of the eight directions, the map's own report (MAP_DREW):
     OFF at boot, and OFF draws what the game drew (the banner, the shoulders 20 px out);
     ON: no banner rides with him; both companions are a step BEHIND him along the way he walks; both STAY IN SIGHT,
     one each side of him on the glass, never behind his body; and CLOSE, within 24 px of him: one unit. */
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, why) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n + (why ? '  [' + why + ']' : ''))); };
const done = () => { console.log('\nTHE PARTY WALKS AS ONE GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const src = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html'), 'utf8');
ok('the candidate is in the map and OFF in the file (rule 100: nothing into the game before his FINAL)', /var MAP_PARTY_AS_ONE = \{ on: false,/.test(src));

(async () => {
  const d = await open({ alpha: true }); const p = d.page;
  let f = null; for (let i = 0; i < 60 && !(f = p.frames().find(x => /CITY_WORLD/.test(x.url()))); i++) await p.waitForTimeout(500);
  if (!f) { ok('the map loads inside the alpha', false); await d.browser.close(); return done(); }
  for (let i = 0; i < 160; i++) { const n = await f.evaluate(() => typeof CAST_WALK === 'undefined' ? -1 : Object.keys(CAST_WALK).length).catch(() => -1); if (n >= 12) break; await p.waitForTimeout(500); }
  /* the 3D people in before measuring them, as THE SHADOW LINE waits (RUN 10/25: his own men's sheet is part of 'the people are in' now) */
  for (let i = 0; i < 120; i++) { if (await f.evaluate(() => typeof rigAllReady !== 'function' || rigAllReady() || (typeof rigFailed === 'function' && rigFailed())).catch(() => false)) break; await p.waitForTimeout(500); }
  const r = await f.evaluate(() => {
    const out = { bootOff: MAP_PARTY_AS_ONE.on === false, trips: [] };
    let T = performance.now() + 5000; const real = performance.now; performance.now = () => T;
    try { if (typeof setMode === 'function') setMode('city'); MODE = 'city'; try { HC = HZOOM; } catch (e) {}
      const runs = []; for (let dd = 0; dd < 8; dd++) { let hit = null;
        outer: for (let y = 3; y < om.n - 3; y++) for (let x = 3; x < om.n - 3; x++) { const [dx, dy] = DIRS[dd]; let okk = true;
          for (let k = 0; k <= 6; k++) if (!cityWalkable(x + k * dx, y + k * dy)) { okk = false; break; } if (okk) { hit = { x, y, d: dd }; break outer; } }
        if (hit) runs.push(hit); }
      for (const on of [false, true]) { MAP_PARTY_AS_ONE.on = on;
        for (const run of runs) { city.x = run.x; city.y = run.y; T += 5000; MAP_DREW = null; render(); render(); stepOnce(run.d);
          for (let i = 0; i < 12; i++) { T += 1000 / 60; MAP_DREW = null; render(); }
          const you = MAP_DREW && MAP_DREW.you, comp = (MAP_DREW && MAP_DREW.companyAt) || [], v = MAP_VEC_OF[mapFaceNow()] || [1, 1];
          const fx = (v[0] - v[1]) * TW / 2, fy = (v[0] + v[1]) * TH / 2, fl = Math.hypot(fx, fy) || 1;
          out.trips.push({ on, d: run.d, you: you && [you.x, you.y], banner: (MAP_DREW && MAP_DREW.banner) | 0, comp, fdir: [fx / fl, fy / fl], K: Math.max(0.75, MAP_PEOPLE_K) }); } }
    } finally { MAP_PARTY_AS_ONE.on = false; performance.now = real; }
    return out; });
  const off = r.trips.filter(t => !t.on), on = r.trips.filter(t => t.on);
  console.log('         ' + on.length + ' trips, one in each direction the map can walk, with the candidate off and on');
  ok('OFF AT BOOT: the map starts with the candidate off', r.bootOff);
  ok('  and OFF draws what the game drew: the banner rides with him and the two stand at his shoulders, 20 px out',
     off.length > 0 && off.every(t => t.banner > 0 && t.comp.length === 2 && t.comp.every(c => Math.abs(Math.abs(c[0] - t.you[0]) - 20 * t.K + 0) <= 8 * t.K)),
     off.filter(t => !t.banner).map(t => 'dir ' + t.d).join(','));
  ok('ON: NO BANNER rides with him (the pole at his back and the yellow cloth he took for an arrow)', on.length > 0 && on.every(t => t.banner === 0), on.filter(t => t.banner).map(t => 'dir ' + t.d).join(','));
  const behind = on.filter(t => !t.comp.every(c => ((c[0] - t.you[0]) * t.fdir[0] + (c[1] - t.you[1]) * t.fdir[1]) < 0));
  ok('ON: both companions walk a step BEHIND him along the way he goes', on.every(t => t.comp.length === 2) && !behind.length, behind.map(t => 'dir ' + t.d + ' ' + JSON.stringify(t.comp)).join(' | '));
  /* first written 'one each side of him': that was the first formation's shape, and walking across the glass it could
     not be both behind him and seen (measured 10/11); the claim is the seeing: each 12 px clear of his middle, and
     the two 10 px or more apart, so nobody stands behind anybody */
  const hidden = on.filter(t => { const s = t.comp.map(c => c[0] - t.you[0]);
    return !(s.every(x => Math.abs(x) >= 12 * t.K - 0.5) && Math.hypot(t.comp[0][0] - t.comp[1][0], t.comp[0][1] - t.comp[1][1]) >= 10 * t.K); });
  ok('ON: both STAY IN SIGHT: each 12 px or more clear of his middle on the glass and 10 px from each other (never behind his body or each other)', !hidden.length, hidden.map(t => 'dir ' + t.d + ' ' + JSON.stringify(t.comp) + ' you ' + t.you).join(' | '));
  const far = on.filter(t => !t.comp.every(c => Math.hypot(c[0] - t.you[0], c[1] - t.you[1]) <= 24 * t.K));
  ok('ON: CLOSE, every companion within 24 px of him: one unit (OFF had them 20 px out level with him)', !far.length, far.map(t => 'dir ' + t.d).join(','));
  await d.browser.close(); try { d.server && d.server.close(); } catch (_e) {}
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });
