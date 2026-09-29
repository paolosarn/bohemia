#!/usr/bin/env node
/* ============================================================================
   A HOUSE IS NEVER SMALLER THAN A MAN   (COMBAT lane, [house tiles back], V232)

   *** PAOLO 9/28, overworld law s14: "for the combat a tile is as big as a house." ***
   *** RULE 37a: "'tiny character' means SMALL RELATIVE TO BUILDINGS." ***
   *** RULE 21: the person is one size; the camera moves the ground, never him. ***

   MEASURED BEFORE (V231's round): the auto frame sat at its 0.20 floor in 40 of 40 arenas, so a
   house was drawn 39 px beside a 112 px man. This gate holds, in real fights on the one driver
   with the camera left to itself:
     1. on the house board, a house on the glass is never narrower than the man;
     2. nobody is lost: every living enemy is either wholly on the glass or has a marker on its
        edge, and every marker is inside the glass;
     3. the body board's camera is untouched (floor 0.20).
   ========================================================================== */
const { open } = require('../tools/bohemia_drive_the_demo.js');

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  PASS ' + n + (note ? ' (' + note + ')' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? ' (' + note + ')' : ''))); };

(async () => {
  const d = await open({ alpha: true });
  try {
    await d.page.click('[data-p="combat"]').catch(() => {});
    await d.page.waitForTimeout(7000);
    let fr = null;
    for (let i = 0; i < 40 && !fr; i++) {
      for (const f of d.page.frames()) {
        try { if (await f.evaluate(() => typeof setupCombat === 'function' && typeof camFloor === 'function'
          && typeof drawEdgeMarks === 'function')) { fr = f; break; } } catch (e) {}
      }
      if (!fr) await d.page.waitForTimeout(500);
    }
    if (!fr) { ok('the fight answers, and it has the camera floor and the edge marks', false); return; }
    ok('the fight answers, and it has the camera floor and the edge marks', true);

    const rows = [];
    for (let s = 1; s <= 24; s++) {
      await fr.evaluate(s => { try { BohemiaArena.set(s); setupCombat(); G._uzE = null; G._camTouchAt = 0; G.phase = 'cover'; } catch (e) {} }, s);
      await d.page.waitForTimeout(1400);   /* the auto frame eases 10% a frame; this is ~80 frames */
      rows.push(await fr.evaluate(() => {
        const cv = document.getElementById('cv'), W = cv.width, H = cv.height;
        const ringF = Math.min(W, H) * fieldPitch(W, H), uz = uzEff();
        const cx = W / 2, cy = H * 0.56, pnx = G.userPan.x || 0, pny = G.userPan.y || 0;
        const k = Math.max(1, W / Math.max(1, cv.getBoundingClientRect().width || W));
        let alive = 0, onGlass = 0;
        for (const e of G.e) { if (!e || e.dead || e.downed || e.fleeing) continue; alive++;
          const p = fieldPos(e, W, H, cx, cy);
          const sx = (p[0] - W / 2) * uz + W / 2 + pnx, sy = (p[1] - H / 2) * uz + H / 2 + pny;
          if (sx >= 0 && sx <= W && sy - 100 * k >= 0 && sy <= H) onGlass++; }
        const marks = G._edgeMarks || [];
        return { kind: G.arenaKind, house: houseOn(), uz: +uz.toFixed(3), housePx: +(ringF * uz).toFixed(1),
          manPx: +(112 * bodyRule()).toFixed(1), alive, onGlass, marks: marks.length,
          inside: marks.every(m => m.x >= 0 && m.x <= W && m.y >= 0 && m.y <= H), over: !!G.over, phase: G.phase };
      }));
    }
    const R = rows.filter(r => r.phase === 'cover' && !r.over);
    const small = R.filter(r => r.housePx < r.manPx - 0.5);
    const lost = R.filter(r => r.onGlass + r.marks < r.alive);
    const outside = R.filter(r => !r.inside);
    const zs = R.map(r => r.uz);
    console.log('  ' + R.length + ' fights in cover; camera ' + Math.min(...zs) + ' to ' + Math.max(...zs)
      + '; house on the glass ' + Math.min(...R.map(r => r.housePx)) + ' to ' + Math.max(...R.map(r => r.housePx))
      + ' px beside a ' + R[0].manPx + ' px man; ' + R.reduce((a, r) => a + r.marks, 0) + ' men shown on the edge, '
      + R.reduce((a, r) => a + r.onGlass, 0) + ' on the glass');
    console.log('  BEFORE V232 (measured): the camera at 0.20 in 40 of 40, a house 39 px beside 112');

    ok('*** A HOUSE IS NEVER NARROWER THAN THE MAN (law s14 + rule 37a: tiny means small relative '
       + 'to buildings) ***', R.length >= 12 && small.length === 0,
       small.length + ' of ' + R.length + ' fights drew a house under the man');
    ok('*** NOBODY IS LOST: every living enemy is on the glass or marked on its edge (V23: "can\'t '
       + 'LOSE anyone") ***', lost.length === 0,
       lost.length ? lost.map(r => r.onGlass + '+' + r.marks + '/' + r.alive).join(', ') : 'all accounted for');
    ok('and the edge actually gets used: the fights with a man past the glass show him',
       R.some(r => r.marks > 0), R.filter(r => r.marks > 0).length + ' fights with a marker');
    ok('every marker is inside the glass', outside.length === 0, outside.length + ' outside');

    const body = await fr.evaluate(() => { const was = G.houseTile; G.houseTile = false;
      const f = camFloor(Math.min(cv.width, cv.height) * fieldPitch(cv.width, cv.height)); G.houseTile = was; return f; });
    ok('the body board\'s camera is untouched (floor 0.20)', Math.abs(body - 0.20) < 1e-9, 'floor ' + body);
    ok('no page errors', d.errs.length === 0, d.errs.slice(0, 2).join(' ; '));
  } finally {
    console.log('=== A HOUSE IS NEVER SMALLER THAN A MAN GATE: ' + pass + ' passed, ' + fail + ' failed ===');
    await d.close();
    process.exit(fail ? 1 : 0);
  }
})();
