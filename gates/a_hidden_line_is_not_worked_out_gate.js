#!/usr/bin/env node
/* A HIDDEN LINE IS NOT WORKED OUT (PLUMBER 8, 11/11/26; ask row 561, rule 441: the boot and the reload freeze).
   MEASURED (the demo, phone upright, CPU 4x, a CPU profile of a cold boot and of the reopen on its save, two runs each):
   the save's restore drew the quest line once, and the address in it is the day's whole cast found on the map (ctDayCast:
   castAddresses over every person near every role, cellAt and realizeCell for thousands of blocks): 1.9 s of a 3.2 s restore,
   for a line that on the map is display:none (body.onmap #qline, rule 61b); and every save snapshot worked the cast out again
   just to keep it (the reopen's first save, 1.9 to 2.4 s). __A_HIDDEN_LINE_IS_NOT_WORKED_OUT__ (slices/BOHEMIA_CITY_WORLD.html):
   while the line is not drawn its address is not worked out, and a save keeps a cast only if it was worked out for this quest
   and day. Before -> after: the restore 3.2 s -> 0.13 s; ready 18.3-23.0 s -> 17.2-17.5 s cold, 21.0-28.1 s -> 18.3-19.3 s
   reopened; frozen 9.3-13.7 s -> 7.5-7.6 s cold, 10.8-16.9 s -> 6.4-8.9 s reopened.
     H1 behind the door (the map booted, the quest line hidden): the day's cast was never worked out, and a save does not work it out
     H2 the line drawn: its address is worked out (the cast found, the line carries it), as before
     P1 PLANTED: the old way (window.__QLINE_ALWAYS) works the cast out in a save the map never shows
   node gates/a_hidden_line_is_not_worked_out_gate.js   (about 1 min) */
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined && x !== '' ? '  [' + x + ']' : '')); };

(async () => {
  console.log('\nA HIDDEN LINE IS NOT WORKED OUT (ask row 561)\n');
  /* behind the door, as he waits: the map boots under the door's loading picture, and that is where the cast was worked out */
  let d, R = null;
  const check = async (pg) => {
    for (let i = 0; i < 600 && !(await pg.evaluate(() => !!window.__LOAD_READY).catch(() => false)); i++) await pg.waitForTimeout(200);
    const cf = pg.frames().find(f => /BOHEMIA_CITY_WORLD/.test(f.url()));
    if (!cf) { R = { err: 'no map frame' }; return; }
    R = await cf.evaluate(() => {
      /* the case: a day quest with its cast (the save a reopen restores carries one when the game was saved before its first BEGIN) */
      try { if (!(DQ && DQ.spec)) DQ.openDay(DAY.day); } catch (_e) {}
      try { updQline(); } catch (_e) {}   /* the restore's own draw of the line */
      const el = document.getElementById('qline'), roles = !!(typeof DQ !== 'undefined' && DQ && DQ.Q && DQ.Q.roles && DQ.Q.roles.length);
      const h1 = { roles, spec: DQ && DQ.spec && DQ.spec.id, hidden: !!el && getComputedStyle(el).display === 'none', before: CT_DAYCAST === null };
      let saved = null; try { saved = citySnapshot().daycast; } catch (e) { saved = 'threw ' + e.message; }
      h1.saved = saved === null; h1.after = CT_DAYCAST === null;
      CT_DAYCAST = null; window.__QLINE_ALWAYS = true; let t = performance.now(), ps = null; try { ps = citySnapshot().daycast; } catch (e) {}
      const p1 = { saved: !!ps, ms: Math.round(performance.now() - t) }; window.__QLINE_ALWAYS = false; CT_DAYCAST = null;
      document.body.classList.remove('onmap'); t = performance.now(); try { updQline(); } catch (e) {}
      const h2 = { cast: !!(CT_DAYCAST && CT_DAYCAST.cast), roles: CT_DAYCAST ? Object.keys(CT_DAYCAST.cast || {}).length : 0, line: (el && el.textContent || '').slice(0, 90), ms: Math.round(performance.now() - t) };
      document.body.classList.add('onmap'); CT_DAYCAST = null;
      return { h1, h2, p1 };
    }).catch(e => ({ err: String(e.message).slice(0, 160) }));
    await require(path.join(ROOT, 'tools/bohemia_through_the_title.js')).throughTheTitle(pg);
  };
  try { d = await drive.open({ profile: 'phone_portrait', door: 180000, beforeTap: check }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  if (!R || R.err) ok('the map frame behind the door answered', false, R && R.err);
  else {
    ok('H1 behind the door (the map booted, the quest line hidden): the day\'s cast was never worked out, and a save does not work it out',
      R.h1.roles && R.h1.hidden && R.h1.before && R.h1.saved && R.h1.after, JSON.stringify(R.h1));
    ok('H2 the line drawn: its address is worked out (the cast found), as before', R.h2.cast && R.h2.roles > 0, JSON.stringify(R.h2));
    ok('P1 PLANTED: the old way (window.__QLINE_ALWAYS) works the cast out in a save the map never shows', R.p1.saved, JSON.stringify(R.p1));
  }
  return done();
  async function done() {
    try { if (d && d.close) await d.close(); } catch (_e) {}
    console.log('\nA HIDDEN LINE IS NOT WORKED OUT: ' + pass + ' passed, ' + fail + ' failed');
    process.exit(fail ? 1 : 0);
  }
})();
