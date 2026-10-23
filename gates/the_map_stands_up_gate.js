/* ==========================================================================
   THE MAP STANDS UP  (RUN, 10/23/26, VAMILY [the map stands up], rules 121 and 123)

   PAOLO, his YES on the painted map he opens on: "yes but it's flat, not elevated".
   And the coordinator's words for the round: "the painted map he opens on gets height (buildings,
   hills and the Strip standing up, shadows that read as height)".

   MEASURED BEFORE ANYTHING WAS WRITTEN (the painting at 24 texels a block, his opening zoom a block
   18 CSS px): a house rose Q = 2 texels (0.75 CSS px, under one phone pixel of wall), a works block
   0.75 to 1.5 px, the freeway, the rail and the trees lay on the ground, and nothing cast a shadow.
   Only the towers, the casinos and the rim stood. NOW (__THE_MAP_STANDS_UP__, the city file's
   vbCityCore): houses a wall under a gable, works blocks one to three boxes with a parapet, the
   freeway on a berm, towers on a podium, trees as crowns, and the land's own sun casting all of it.

   LEGS (the painting re-baked in the page from the demo's own valley, and read):
     U1 built blocks show walls: of the texels the painting gives to houses, works and freeway, at least
        a sixth are wall faces (a flat carpet shows almost none)
     U2 a house stands: the tallest house is at least 3.5 T (T = one texel at 24 a block)
     U3 the freeway is on its berm: the freeway is lifted at least 2.5 T
     U4 the sun casts: at least 6% of the painting's visible tops are in shade
     U5 the opening zoom is the painting alone (the standing city is what he opens on, not a fade)
     U6..U8 MUTATIONS, each must turn its leg red: the sun put out (U4), the houses laid flat (U1/U2),
        the berm cut (U3). A leg that cannot go red proves nothing.
     U9 nothing threw
   node gates/the_map_stands_up_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('THE MAP STANDS UP: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const pc = v => Math.round(v * 1000) / 10 + '%';

function legs(st) {
  return {
    walls: st.wall / Math.max(1, st.built), house: st.houseMax / st.T, fwy: st.fwyMax / st.T, shade: st.shade / Math.max(1, st.top),
  };
}
const holds = L => ({ U1: L.walls >= 1 / 6, U2: L.house >= 3.5, U3: L.fwy >= 2.5, U4: L.shade >= 0.06 });

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  try {
    for (let i = 0; i < 90; i++) { if (await d.fr.evaluate(() => !!(window.VBC && typeof vbCityCore === 'function' && om && om.n))) break; await d.page.waitForTimeout(500); }
    /* the core run in the page, as written, and three times with one line of it broken */
    const MUT = {
      sun: ['SUN_DROP = 0.78', 'SUN_DROP = 1e9'],
      flat: ['wall + 1.6 * T * (1 - dr)', 'Q'],
      berm: ['lift = Math.min(top3, (dB + 0.5) * 1.1);', 'lift = 0;'],
    };
    const runs = await d.fr.evaluate((MUT) => {
      const inp = vbCityInput(), out = {}, src = vbCityCore.toString();
      out.real = vbCityCore(inp).stand;
      for (const k in MUT) {
        if (src.indexOf(MUT[k][0]) < 0) { out[k] = { missing: MUT[k][0] }; continue; }
        const f = (0, eval)('(' + src.replace(MUT[k][0], MUT[k][1]) + ')');
        out[k] = f(inp).stand;
      }
      return out;
    }, MUT);
    const R = legs(runs.real), H = holds(R);
    ok('U1 built blocks show walls: ' + pc(R.walls) + ' of the houses\', works\' and freeway\'s texels are wall faces (at least 16.7%)', H.U1);
    ok('U2 a house stands: the tallest house ' + R.house.toFixed(1) + ' T (at least 3.5 T; it was 2 T)', H.U2);
    ok('U3 the freeway is on its berm: ' + R.fwy.toFixed(1) + ' T (at least 2.5 T; it was 0)', H.U3);
    ok('U4 the sun casts: ' + pc(R.shade) + ' of the painting\'s visible tops are in shade (at least 6%; there were none)', H.U4);

    const fade = await d.fr.evaluate(() => { setZoomAt(1); MAP_GROUND.key = ''; VBC.alpha = -1; render(); return { TW, a: TW >= VB_CITY_NONE ? 0 : VBC.alpha }; });
    ok('U5 the opening zoom (a block ' + Math.round(fade.TW) + ' px) is the standing painting alone (alpha ' + fade.a + ')', fade.a === 1);

    const m = (k, leg) => {
      const r = runs[k];
      if (!r || r.missing) return ok('U' + leg + ' mutation "' + k + '" found its line in the painter [' + (r && r.missing) + ']', false);
      const Lm = holds(legs(r));
      return Lm;
    };
    const ms = m('sun', 6); if (ms) ok('U6 mutation, the sun put out: U4 goes red (' + pc(legs(runs.sun).shade) + ' in shade)', !ms.U4);
    const mf = m('flat', 7); if (mf) ok('U7 mutation, the houses laid flat: U2 goes red (' + legs(runs.flat).house.toFixed(1) + ' T)', !mf.U2);
    const mb = m('berm', 8); if (mb) ok('U8 mutation, the berm cut: U3 goes red (' + legs(runs.berm).fwy.toFixed(1) + ' T)', !mb.U3);
    ok('U9 nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 100) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
  }
  await d.close();
  done();
})();
