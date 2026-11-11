#!/usr/bin/env node
/* THE GROUND IS NOT REPAINTED BEHIND THE DOOR (PLUMBER 8, 11/11/26; ask row 561, rule 441: the boot and the reload freeze).
   MEASURED (the demo, phone upright, CPU 4x, a quiet box, MAP_GROUND.why read at the door, two runs of a cold boot and of the reopen):
   before the door's load was in, the whole ground was painted 41 to 46 times, 25 to 33 of them 'still' (the same size, the same place),
   under the loading picture that covers it; the ground's blit alone 1.7 to 2.3 s of the boot. __THE_GROUND_IS_NOT_REPAINTED_BEHIND_THE_DOOR__
   (slices/BOHEMIA_CITY_WORLD.html mapGroundBegin): while the shell's __LOAD_READY is false a ground already painted at this size and place
   is laid again; the first ground after the door is painted fresh. After: painted 11 to 16 times (21 to 26 laid again), the blit 0.6 to
   1.0 s; the time to ready and the frozen total stayed inside the box's run-to-run swing (the door paces its own lines).
     G1 behind the door: the ground was laid again, not painted, most of the times it was asked (painted at most 20 times)
     G2 the door passed: the first ground drawn is painted fresh (nothing left stale), and it is the map's own picture
     P1 PLANTED: the old way (window.__BOOT_GROUND_EACH, armed before the page) paints it again every time (over 25 paints)
   node gates/the_ground_is_not_repainted_behind_the_door_gate.js   (about 2 min) */
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined && x !== '' ? '  [' + x + ']' : '')); };

async function atTheDoor(arm) {
  let at = null, d = null;
  const check = async (pg) => {
    for (let i = 0; i < 600 && !(await pg.evaluate(() => !!window.__LOAD_READY).catch(() => false)); i++) await pg.waitForTimeout(200);
    const cf = pg.frames().find(f => /BOHEMIA_CITY_WORLD/.test(f.url()));
    at = cf ? await cf.evaluate(() => ({ builds: MAP_GROUND.builds, why: MAP_GROUND.why, reused: MAP_GROUND.bootReuses | 0, stale: !!MAP_GROUND.bootStale })).catch(e => ({ err: e.message })) : { err: 'no map frame' };
    await throughTheTitle(pg);
  };
  d = await drive.open(Object.assign({ profile: 'phone_portrait', door: 180000, beforeTap: check }, arm ? { arm } : {}));
  return { d, at };
}

(async () => {
  console.log('\nTHE GROUND IS NOT REPAINTED BEHIND THE DOOR (ask row 561)\n');
  try {
    const { d, at } = await atTheDoor(null);
    ok('G1 behind the door: the ground was laid again, not painted, most of the times it was asked (painted at most 20 times)',
      at && !at.err && at.builds <= 20 && at.reused > at.builds, JSON.stringify(at));
    const g2 = await d.fr.evaluate(() => { const b0 = MAP_GROUND.builds, s0 = !!MAP_GROUND.bootStale; try { renderCity(); } catch (e) { return { err: e.message }; }
      return { staleBefore: s0, staleAfter: !!MAP_GROUND.bootStale, painted: MAP_GROUND.builds - b0, w: MAP_GROUND.cv ? MAP_GROUND.cv.width : 0 }; });
    ok('G2 the door passed: the first ground drawn is painted fresh (nothing left stale)', g2 && !g2.err && g2.staleAfter === false && g2.painted >= 1 && g2.w > 0, JSON.stringify(g2));
    await d.close();
    const P = await atTheDoor('window.__BOOT_GROUND_EACH = true;');
    ok('P1 PLANTED: the old way paints it again every time (over 25 paints behind the door)', P.at && !P.at.err && P.at.builds > 25 && P.at.reused === 0, JSON.stringify(P.at));
    await P.d.close();
  } catch (e) { ok('the walk ran to the end [' + String(e.message).slice(0, 200) + ']', false); }
  console.log('\nTHE GROUND IS NOT REPAINTED BEHIND THE DOOR: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
