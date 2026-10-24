/* ==========================================================================
   THE NEAR END IS THE BLOCK  (RUN, 10/4/26, VAMILY [map pixels now], rules 50, 65, 67 s3)

   PAOLO 9/30 (rule 50): one continuous pinch from one person on a bench to the whole valley; the
   near end is looking, not walking. 10/2: "got to be able to zoom tf in so much."
   MEASURED BEFORE: the map's closest stop clamped; past it there was nothing.
   NOW (__THE_NEAR_END_IS_THE_BLOCK__): a new pinch in at the closest map stop drops into the block he
   stands on, drawn from COMBAT TWO's blocks (the walk's banks at 42.9 px a metre), from one art pixel
   per device pixel in to the walk's scale; he stands on its ground at his own 112 box; pinching out
   past one-to-one is the map again.

   RE-AIMED 10/24 BY RULE 142 (one map at every zoom): past the closest stop the camera stops on the one map; N2-N6
   below are the one-map legs (the block close-up they tested is retired from the map he plays).
   LEGS, driven with real two-finger pinches on the demo (as of 10/4):
     N1 one squeeze climbs the map to its closest stop and stops there (one gesture, one rung)
     N2 *** THE NEXT SQUEEZE IN OPENS THE BLOCK HE STANDS ON *** (its kind from his cell, drawn)
     N3 it opens at one art pixel per device pixel and pinches in to the walk's 42.9 px a metre
     N4 he keeps his size at both ends (the 112 box, rule 21)
     N5 he stands on ground (a flat, rough or debris tile), never on a roof
     N6 looking is not walking: a tap here does not travel
     N7 the HUD stays: the speed pad and the phone are on the glass
     N8 *** PINCHING OUT PAST ONE-TO-ONE IS THE MAP AGAIN *** at its closest stop, and the next
        squeeze out zooms the map out
     N9 nothing threw
   node gates/the_near_end_is_the_block_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('THE NEAR END IS THE BLOCK: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  try {
    await d.page.waitForTimeout(3000);
    const st = () => d.fr.evaluate(() => ({ cz: CZOOM, zmax: zoomBounds()[1], look: LOOK.on, s: LOOK.s, kind: LOOK.kind, ready: LOOK.ready | 0,
      you: LOOK.you, dpr: CV_DPR, mode: MODE }));
    /* N1: squeeze until the map is at its closest; the squeeze that gets there must not also drop in */
    let s1 = await st();
    for (let i = 0; i < 6 && Math.abs(s1.cz - s1.zmax) > 1e-3; i++) { await d.pinchIn(); await d.page.waitForTimeout(400); s1 = await st(); }
    ok('N1 one squeeze climbs the map to its closest stop and stops there (zoom ' + s1.cz.toFixed(2) + ' of ' + s1.zmax.toFixed(2) + ', looking ' + s1.look + ')', Math.abs(s1.cz - s1.zmax) < 1e-3 && !s1.look);

    /* RE-AIMED 10/24 (RUN [one map at every zoom], rule 142, Paolo: 'when the map blows up I see the skeleton, ugly old 2D
       rough-draft horseshit'): the squeeze past the closest stop no longer drops into the old block close-up (LOOK, the walk's
       street in its tiles); the camera stops at its closest, on the ONE map, and that stop is the painting at its sharpest.
       The 10/4 legs N2 to N6 tested the close-up itself and are retired with it (git history keeps them). */
    await d.pinchIn(); await d.page.waitForTimeout(1500);
    const s2 = await st();
    ok('*** N2 THE NEXT SQUEEZE IN STAYS ON THE ONE MAP *** (looking ' + s2.look + ', ' + s2.mode + ' at ' + s2.cz.toFixed(2) + ' of ' + s2.zmax.toFixed(2) + ': no block close-up, rule 142)',
      !s2.look && s2.mode === 'city' && Math.abs(s2.cz - s2.zmax) < 1e-3);
    let tl = null;
    for (let i = 0; i < 24; i++) { tl = await d.fr.evaluate(() => ({ S: VBT.S, held: VBT.tiles.size, want: VBT.want | 0, busy: VBT.busy, blocks: !!window.__MAP_BLOCKS_DREW, a: vbCityAlpha() })); if (tl.held > 0 && !tl.want && !tl.busy) break; await d.page.waitForTimeout(500); }
    ok('N3 the closest stop is the painting at its sharpest (' + tl.S + ' texels a block, ' + tl.held + ' tiles kept, ' + tl.want + ' waiting; the painting at ' + tl.a + ', the old blocks ' + (tl.blocks ? 'DRAWN' : 'off') + ')',
      tl.S === 96 && tl.held > 0 && tl.want === 0 && tl.a === 1 && !tl.blocks);
    const you = await d.fr.evaluate(() => (MAP_DREW && MAP_DREW.you) ? { w: Math.round(MAP_DREW.you.w), how: MAP_DREW.you.how } : null);
    ok('N4 he is on the map at the closest stop at his own size (' + JSON.stringify(you) + ')', !!you && you.w > 0);
    const hud = await d.fr.evaluate(() => { const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(), st = getComputedStyle(el); return r.width > 0 && r.height > 0 && st.display !== 'none' && st.visibility !== 'hidden'; };
      const pad = [...document.querySelectorAll('button,div')].find(x => /^1X$/i.test((x.textContent || '').trim()) && x.getBoundingClientRect().width > 10);
      return { pad: vis(pad), phone: vis(document.getElementById('cityfeed')) }; });
    ok('N7 the HUD stays (speed pad ' + hud.pad + ', phone ' + hud.phone + ')', hud.pad && hud.phone);

    /* N8: out past one-to-one, then the map zooms out on the next squeeze */
    let s4 = await st();
    const atStop = Math.abs(s4.cz - s4.zmax) < 1e-3;
    await d.pinchOut(); await d.page.waitForTimeout(400);
    const s5 = await st();
    ok('*** N8 PINCHING OUT FROM THE CLOSEST STOP ZOOMS THE MAP OUT *** (looking ' + s4.look + ', the map at ' + s4.cz.toFixed(2) + ' of ' + s4.zmax.toFixed(2) + '; the next squeeze out: ' + s5.cz.toFixed(2) + ')',
      !s4.look && s4.mode === 'city' && atStop && s5.cz < s4.cz - 0.1);
    ok('N9 nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 100) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
  }
  await d.close();
  done();
})();
