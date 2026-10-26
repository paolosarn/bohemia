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
   RE-AIMED 10/26 BY RULE 258 (the map zooms in to the street): N2 the next squeeze goes on into the street on the one map;
   N8 squeezing out comes back out of it to the closest stop and on out (THE MAP ZOOMS IN TO THE STREET is the street's own gate).
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
       rough-draft horseshit'): no block close-up from the map he plays. RE-AIMED AGAIN 10/26 (RUN [the map zooms in to the street],
       rule 258, Paolo: 'I want the zoom to zoom in a lot more, even on the main map... it doesn't have to transition to a whole other
       screen or phase'): the closest stop of the painting is checked FIRST (N3, N4, N7, the painting at its sharpest), then the next
       squeeze goes on into the street on the same map (N2: still no close-up, the city mode, the map's own zoom held at its closest,
       the street past it; its own gate is THE MAP ZOOMS IN TO THE STREET), and squeezing out comes back to the closest stop and on
       out (N8). */
    let tl = null;
    for (let i = 0; i < 24; i++) { tl = await d.fr.evaluate(() => ({ S: VBT.S, held: VBT.tiles.size, want: VBT.want | 0, busy: VBT.busy, blocks: !!window.__MAP_BLOCKS_DREW, a: vbCityAlpha() })); if (tl.held > 0 && !tl.want && !tl.busy) break; await d.page.waitForTimeout(500); }
    ok('N3 the closest stop is the painting at its sharpest (' + tl.S + ' texels a block, ' + tl.held + ' tiles kept, ' + tl.want + ' waiting; the painting at ' + tl.a + ', the old blocks ' + (tl.blocks ? 'DRAWN' : 'off') + ')',
      tl.S === 96 && tl.held > 0 && tl.want === 0 && tl.a === 1 && !tl.blocks);
    const you = await d.fr.evaluate(() => (MAP_DREW && MAP_DREW.you) ? { w: Math.round(MAP_DREW.you.w), how: MAP_DREW.you.how } : null);
    ok('N4 he is on the map at the closest stop at his own size (' + JSON.stringify(you) + ')', !!you && you.w > 0);
    /* RE-AIMED 10/26: UI TWO's one phone (bohemia_phone.js, rule 213) carries PLAY now; the old speed pad and #cityfeed are hidden under it */
    const hud = await d.fr.evaluate(() => { const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(), st = getComputedStyle(el); return r.width > 0 && r.height > 0 && st.display !== 'none' && st.visibility !== 'hidden'; };
      const R = window.BOH_PHONE_RECT ? BOH_PHONE_RECT() : null, Q = sel => document.querySelector(sel) || (window.parent && window.parent !== window ? window.parent.document.querySelector(sel) : null), play = Q('.app[data-app=play]');
      return { pad: vis(play), phone: !!(R && R.on !== false && R.width > 2) }; });
    ok('N7 the HUD stays (the phone ' + hud.phone + ', its PLAY ' + hud.pad + ')', hud.pad && hud.phone);
    await d.pinchIn(); await d.page.waitForTimeout(1500);
    const s2 = await st(), m2 = await d.fr.evaluate(() => (typeof STREET !== 'undefined') ? STREET.mult : 1);
    ok('*** N2 THE NEXT SQUEEZE IN GOES ON INTO THE STREET, ON THE ONE MAP *** (looking ' + s2.look + ', ' + s2.mode + ', the map held at ' + s2.cz.toFixed(2) + ' of ' + s2.zmax.toFixed(2) + ', the street ' + m2.toFixed(2) + ': no block close-up, rules 142 and 258)',
      !s2.look && s2.mode === 'city' && Math.abs(s2.cz - s2.zmax) < 1e-3 && m2 > 1);

    /* N8: out of the street to the closest stop, then the map zooms out on the next squeeze */
    let s4 = await st(), m4 = m2;
    for (let i = 0; i < 4 && m4 > 1; i++) { await d.pinchOut(); await d.page.waitForTimeout(400); s4 = await st(); m4 = await d.fr.evaluate(() => STREET.mult); }
    const out1 = s4.cz < s4.zmax - 0.1 || m4 === 1;
    if (Math.abs(s4.cz - s4.zmax) < 1e-3) { await d.pinchOut(); await d.page.waitForTimeout(400); }
    const s5 = await st();
    ok('*** N8 PINCHING OUT OF THE STREET COMES BACK TO THE MAP AND ZOOMS IT OUT *** (looking ' + s4.look + ', the street ' + m4 + ', the map then ' + s5.cz.toFixed(2) + ' of ' + s5.zmax.toFixed(2) + ')',
      !s4.look && s4.mode === 'city' && out1 && m4 === 1 && s5.cz < s5.zmax - 0.1);
    ok('N9 nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 100) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
  }
  await d.close();
  done();
})();
