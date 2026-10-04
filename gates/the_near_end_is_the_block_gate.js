/* ==========================================================================
   THE NEAR END IS THE BLOCK  (RUN, 10/4/26, VAMILY [map pixels now], rules 50, 65, 67 s3)

   PAOLO 9/30 (rule 50): one continuous pinch from one person on a bench to the whole valley; the
   near end is looking, not walking. 10/2: "got to be able to zoom tf in so much."
   MEASURED BEFORE: the map's closest stop clamped; past it there was nothing.
   NOW (__THE_NEAR_END_IS_THE_BLOCK__): a new pinch in at the closest map stop drops into the block he
   stands on, drawn from COMBAT TWO's blocks (the walk's banks at 42.9 px a metre), from one art pixel
   per device pixel in to the walk's scale; he stands on its ground at his own 112 box; pinching out
   past one-to-one is the map again.

   LEGS, driven with real two-finger pinches on the demo:
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

    await d.pinchIn(); await d.page.waitForTimeout(1500);
    const s2 = await st();
    const want = await d.fr.evaluate(() => { const t = om.at(city.x, city.y); return lookKind(t && t.district, city.x, city.y); });
    ok('*** N2 THE NEXT SQUEEZE IN OPENS THE BLOCK HE STANDS ON *** (' + s2.kind + ' for his block, ' + s2.ready + ' block pictures drawn)', s2.look && s2.kind === want && s2.ready >= 1);
    const smin = 1 / s2.dpr;
    const youOpen = s2.you;
    for (let i = 0; i < 4; i++) { await d.pinchIn(); await d.page.waitForTimeout(400); }
    const s3 = await st();
    ok('N3 it opens at one art pixel per device pixel and pinches in to the walk\'s 42.9 px a metre (scale ' + s2.s.toFixed(3) + ' -> ' + s3.s.toFixed(3) + '; '
      + (s2.s * s2.dpr).toFixed(2) + ' device px an art px -> ' + (42.9 * s3.s).toFixed(1) + ' CSS px a metre)', Math.abs(s2.s - smin) < 1e-6 && Math.abs(s3.s - 1) < 1e-6);
    ok('N4 he keeps his size at both ends (' + (youOpen ? youOpen.w : '?') + ' -> ' + (s3.you ? s3.you.w : '?') + ' px wide, the 112 box)', !!youOpen && !!s3.you && youOpen.w === 112 && s3.you.w === 112);
    const ground = await d.fr.evaluate(() => {
      if (!LOOK_FG) return null; const src = LOOK.kind; let key = null; for (const k in LOOK_FG.blocks) if (LOOK_FG.blocks[k].src === src) { key = k; break; }
      const T = LOOK_FG.tile_px, tx = Math.floor(LOOK.foot.x / T[0]), ty = Math.floor(LOOK.foot.y / T[1]);
      for (const bn in LOOK_FG.boards) { const B = LOOK_FG.boards[bn]; for (let by = 0; by < B.blocks.length; by++) for (let bx = 0; bx < B.blocks[by].length; bx++)
        if (B.blocks[by][bx] === key) return { tile: [tx, ty], t: B.terrain[by * LOOK_FG.block_tiles + ty][bx * LOOK_FG.block_tiles + tx] }; }
      return null; });
    /* and in every block picture there is, not just the one he happens to be in (his may have street in the middle) */
    const all = await d.fr.evaluate(() => new Promise(res => {
      const T = LOOK_FG.tile_px, bt = LOOK_FG.block_tiles, out = { n: 0, roofMid: 0, bad: [] }; const keys = Object.keys(LOOK_FG.blocks); let left = keys.length;
      const terr = (key, tx, ty) => { for (const bn in LOOK_FG.boards) { const B = LOOK_FG.boards[bn]; for (let by = 0; by < B.blocks.length; by++) for (let bx = 0; bx < B.blocks[by].length; bx++)
        if (B.blocks[by][bx] === key) return B.terrain[by * bt + ty][bx * bt + tx]; } return null; };
      const G = /^(flat|rough|debris)$/;
      keys.forEach(key => lookFoot(LOOK_FG.blocks[key].src, f => {
        let anyGround = false; for (let ty = 0; ty < bt; ty++) for (let tx = 0; tx < bt; tx++) if (G.test(terr(key, tx, ty) || '')) anyGround = true;
        if (anyGround) { out.n++; const mid = terr(key, (bt - 1) / 2, (bt - 1) / 2); if (!G.test(mid || '')) out.roofMid++;
          const t = terr(key, Math.floor(f.x / T[0]), Math.floor(f.y / T[1])); if (!G.test(t || '')) out.bad.push(key + ':' + t); }
        if (--left === 0) res(out); })); }));
    ok('N5 he stands on ground (' + (ground ? 'tile ' + ground.tile.join(',') + ' is ' + ground.t : 'no terrain read') + '; and in every block picture: '
      + (all.n - all.bad.length) + ' of ' + all.n + ' on ground, ' + all.roofMid + ' of them with no ground in the middle' + (all.bad.length ? ', on ' + all.bad.slice(0, 3).join(' ') : '') + ')',
      !!ground && /^(flat|rough|debris)$/.test(ground.t) && all.n > 0 && all.bad.length === 0);
    const tap = await d.fr.evaluate(() => { const before = TRAVEL && TRAVEL.path ? TRAVEL.path.length : 0; const r = travelTo(CVW * 0.3, CVH * 0.7); return { r, travel: !!(TRAVEL && TRAVEL.path && TRAVEL.path.length > before) }; });
    ok('N6 looking is not walking: a tap here does not travel (' + JSON.stringify(tap) + ')', tap.r === false && !tap.travel);
    const hud = await d.fr.evaluate(() => { const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(), st = getComputedStyle(el); return r.width > 0 && r.height > 0 && st.display !== 'none' && st.visibility !== 'hidden'; };
      const pad = [...document.querySelectorAll('button,div')].find(x => /^1X$/i.test((x.textContent || '').trim()) && x.getBoundingClientRect().width > 10);
      return { pad: vis(pad), phone: vis(document.getElementById('cityfeed')) }; });
    ok('N7 the HUD stays (speed pad ' + hud.pad + ', phone ' + hud.phone + ')', hud.pad && hud.phone);

    /* N8: out past one-to-one, then the map zooms out on the next squeeze */
    let s4 = await st();
    for (let i = 0; i < 6 && s4.look; i++) { await d.pinchOut(); await d.page.waitForTimeout(400); s4 = await st(); }
    const atStop = Math.abs(s4.cz - s4.zmax) < 1e-3;
    await d.pinchOut(); await d.page.waitForTimeout(400);
    const s5 = await st();
    ok('*** N8 PINCHING OUT PAST ONE-TO-ONE IS THE MAP AGAIN *** (looking ' + s4.look + ', the map at ' + s4.cz.toFixed(2) + ' of ' + s4.zmax.toFixed(2) + '; the next squeeze out: ' + s5.cz.toFixed(2) + ')',
      !s4.look && s4.mode === 'city' && atStop && s5.cz < s4.cz - 0.1);
    ok('N9 nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 100) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
  }
  await d.close();
  done();
})();
