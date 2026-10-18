#!/usr/bin/env node
/* ============================================================================
   REACH IS LIT ON THE TILES   (COMBAT lane, V241, the 9/22 ruling)

   *** PAOLO 9/22, LOCKED: "reach lit on the tiles (pistol 1, rifle 2, scope 3)". ***
   Rule 46f: a place is shown by lighting its square tile in the ground's own colour.

   On the one driver, in a real fight on the house board, the draw calls are watched (litTile) while he
   holds each gun, and every reach-lit tile is read back to its house (tapTile, the same inverse a finger
   uses). For each gun:
     1. the lit set is EXACTLY the tiles the game's own reach says he can shoot (maxRange(myRange())),
        minus the tiles under a house;
     2. the reach is the ruling's: a pistol the eight houses round him, a rifle two, a scope three;
     3. a man inside the reach has his tile lit stronger than an empty one.
   Control: on the build before V241 nothing is lit for reach at all.
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
        try { if (await f.evaluate(() => typeof setupCombat === 'function' && typeof litTile === 'function')) { fr = f; break; } } catch (e) {}
      }
      if (!fr) await d.page.waitForTimeout(500);
    }
    if (!fr) { ok('the fight answers', false); return; }
    ok('the fight answers', true);

    const R = await fr.evaluate(async () => {
      const out = { v241: typeof REACH_LIT !== 'undefined', guns: {} };
      const A = typeof REACH_A !== 'undefined' ? REACH_A : -1, AM = typeof REACH_MAN_A !== 'undefined' ? REACH_MAN_A : -1;
      for (let s = 1; s <= 30; s++) { BohemiaArena.set(s); setupCombat(); if (G.arenaKind === 'street' && houseOn()) break; }
      G.phase = 'cover'; G.inc = null;
      try { G.dayPhase = 'day'; } catch (e) {}
      const _lt = litTile;
      for (const gun of ['pistol', 'rifle', 'sniper']) {
        try { WEAPON = gun; } catch (e) {}
        const got = {}; let strong = 0, faint = 0;
        litTile = function (x, p, ring, a, rgb) {
          const isReach = Math.abs(a - A) < 1e-6 || (a >= AM - 1e-6 && a <= AM + 0.07);
          if (isReach && !rgb) { const t = tapTile(p[0], p[1]); if (t) { got[t[0] + ',' + t[1]] = a; if (Math.abs(a - A) < 1e-6) faint++; else strong++; } }
          return _lt.apply(this, arguments); };
        try { _FLK = null; draw(); } catch (e) { out.err = String(e); }
        litTile = _lt;
        let Rr = 0; try { Rr = maxRange(myRange()); } catch (e) {}
        const hs = {}; for (const P of (G.pillars || [])) if (P.house) { const q = pXY(P); hs[Math.round(q[0]) + ',' + Math.round(q[1])] = 1; }
        const want = []; const n = Math.floor(Rr + 1e-6);
        for (let dy = -n; dy <= n; dy++) for (let dx = -n; dx <= n; dx++) { if (!dx && !dy) continue; if (Math.hypot(dx, dy) > Rr + 1e-6) continue; if (hs[dx + ',' + dy]) continue; want.push(dx + ',' + dy); }
        const gotK = Object.keys(got).sort(), wantK = want.sort();
        const men = (G.e || []).filter(e => e && !e.dead && !e.downed && e.edist <= Rr).map(e => { const q = pXY(e); return Math.round(q[0]) + ',' + Math.round(q[1]); }).filter(k => !hs[k]);
        out.guns[gun] = { R: +Rr.toFixed(3), lit: gotK.length, want: wantK.length, same: JSON.stringify(gotK) === JSON.stringify(wantK), faint, strong, menIn: men.length,
          menLitStrong: men.every(k => got[k] !== undefined && got[k] > A + 1e-6) };
      }
      try { WEAPON = 'pistol'; } catch (e) {}
      return out;
    });
    console.log('  ' + JSON.stringify(R));
    const g = R.guns;
    ok('V241 is in the fight (reach has a light)', R.v241);
    for (const gun of ['pistol', 'rifle', 'sniper']) {
      ok('*** ' + gun.toUpperCase() + ': THE LIT TILES ARE EXACTLY THE ONES HIS GUN REACHES (the game\'s own reach, minus the houses) ***',
         g[gun].same && g[gun].lit > 0, g[gun].lit + ' lit, ' + g[gun].want + ' in reach, reach ' + g[gun].R);
    }
    ok('*** AND THE REACH IS THE RULING\'S: a pistol the eight houses round him (sqrt 2), a rifle two, a scope three ***',
       Math.abs(g.pistol.R - Math.SQRT2) < 0.01 && Math.abs(g.rifle.R - 2) < 0.01 && Math.abs(g.sniper.R - 3) < 0.01,
       'pistol ' + g.pistol.R + ', rifle ' + g.rifle.R + ', scope ' + g.sniper.R);
    ok('a man inside his reach has his tile lit stronger than an empty one (checked on every gun with a man in reach)',
       ['pistol', 'rifle', 'sniper'].every(k => g[k].menLitStrong) && ['pistol', 'rifle', 'sniper'].some(k => g[k].menIn > 0),
       ['pistol', 'rifle', 'sniper'].map(k => k + ' ' + g[k].menIn + ' in reach').join(', '));
    ok('no page errors', d.errs.length === 0 && !R.err, (R.err || '') + d.errs.slice(0, 2).join(' ; '));
  } finally {
    console.log('=== REACH IS LIT GATE: ' + pass + ' passed, ' + fail + ' failed ===');
    await d.close();
    process.exit(fail ? 1 : 0);
  }
})();
