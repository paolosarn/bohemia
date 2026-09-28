#!/usr/bin/env node
/* ============================================================================
   NO ATARI   (COMBAT lane, [fight on the grid], rule 37a)

   *** PAOLO 9/27, his DOWN on the card that put the house board beside the 32 px cell
   board: "Now looks better than what you had planned, bro that was really bad." ***
   *** RULE 37a, LOCKED (laws/BOHEMIA_ADDENDUM_THE_THIRD_VOTES_9_28_26.md s1): "Pixel
   detail is never reduced. 'Tiny character' means SMALL RELATIVE TO BUILDINGS... The 32 px
   cell and the 28 px one-cell sprite are DEAD as defaults. BEFORE ANY GRID IS BUILT, he
   sees OPTIONS." ***

   This file used to be the_fight_is_on_cells_gate.js and it asserted the cell board as the
   default, 12/0. He voted that board down. A gate that stayed green on a thing he rejected
   would be the exact failure this lane's own 9/12 note warns about -- A GATE MUST NEVER
   OUTRANK A RULING -- so it is turned over rather than deleted:

     THE DEFAULT is the board he chose: the man at full detail (112, the art we made), a
     tile a house of 12 m, TILE_WIDE 1.75, and his 9/22 distances: 12, 24, 36 metres.
     THE CELL ROW stays honest as an OPTION, because [tile options] shows him candidates in
     the real fight: switched on, it still derives (3 m, 32 px, 4/8/12 cells = the same
     metres), and switched off again, the default comes back byte for byte.
     V229's 4x4 lot layout runs ONLY on the cell row; on the default the layout he approved
     runs.

   Every number is checked as ARITHMETIC where it is derived, so a lane tuning a row cannot
   leave this gate green about a board nobody plays. Runs on the one driver (rule 14g).
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
        try { if (await f.evaluate(() => typeof setupCombat === 'function'
          && typeof setBoardOpt === 'function' && typeof bodyRule === 'function')) { fr = f; break; } } catch (e) {}
      }
      if (!fr) await d.page.waitForTimeout(500);
    }
    if (!fr) { ok('the fight answers, and it has a board table to pick from', false); return; }
    ok('the fight answers, and it has a board table to pick from', true);

    const R = await fr.evaluate(() => {
      const read = () => {
        try { BohemiaArena.set(3); setupCombat(); } catch (e) {}
        const cv = document.getElementById('cv'), W = cv.width, H = cv.height, m = Math.min(W, H);
        const r = { opt: G.boardOpt || BOARD_DEFAULT, tileM: +tileMetres().toFixed(4),
          bodyPx: +(112 * bodyRule()).toFixed(3), wide: TILE_WIDE,
          tilePx: +(m * fieldPitch(W, H)).toFixed(2), sight: sightTiles(), ceil: reachCeil(),
          reach: {}, lot: [] };
        for (const w of ['pistol', 'rifle', 'sniper']) r.reach[w] = houseRange(w).max;
        /* the lot's layout, sampled across one property's worth of tiles */
        for (let y = 0; y < 8; y++) for (let x = 10; x < 15; x++) r.lot.push(lotSubKind(x, y));
        return r; };
      const out = {};
      out.def = read();
      setBoardOpt('cell'); out.cell = read();
      setBoardOpt('house'); out.back = read();
      return out;
    });
    const D = R.def, C = R.cell, B = R.back;
    console.log('  DEFAULT ' + JSON.stringify({ opt: D.opt, tileM: D.tileM, bodyPx: D.bodyPx, tilePx: D.tilePx, reach: D.reach }));
    console.log('  CELL    ' + JSON.stringify({ opt: C.opt, tileM: C.tileM, bodyPx: C.bodyPx, tilePx: C.tilePx, reach: C.reach }));

    /* ===== THE DEFAULT IS HIS PICK ===== */
    ok('*** THE BOARD A FIGHT STARTS ON IS THE ONE HE CHOSE (9/27 vote: "now looks better than '
       + 'what you had planned"). ***', D.opt === 'house', 'default row: ' + D.opt);
    ok('*** NO ATARI: THE MAN IS AT FULL DETAIL, the 112 px art we made (rule 37a: "pixel detail '
       + 'is never reduced", the 28 px one-cell sprite is dead). ***',
       Math.abs(D.bodyPx - 112) < 0.5, 'the fighter is ' + D.bodyPx + ' px');
    ok('a tile on the default board is a house of twelve metres, as the board he approved had it',
       Math.abs(D.tileM - 12) < 1e-6, D.tileM + ' m');
    ok('and the house is TILE_WIDE sprite widths of the full-detail man, which is his dial '
       + '(1.75, "his number, by eye")',
       D.wide === 1.75 && Math.abs(D.tilePx - D.wide * D.bodyPx) < 1.5,
       'tile ' + D.tilePx + ' px = ' + D.wide + ' x ' + D.bodyPx);
    const metres = (row, w) => (row.reach[w] || 0) * row.tileM;
    ok('*** HIS 9/22 DISTANCES, ON THE DEFAULT: a pistol twelve metres, a rifle twenty-four, a '
       + 'scope thirty-six. ***',
       metres(D, 'pistol') === 12 && metres(D, 'rifle') === 24 && metres(D, 'sniper') === 36,
       'pistol ' + metres(D, 'pistol') + ', rifle ' + metres(D, 'rifle') + ', scope ' + metres(D, 'sniper'));
    const approved = ['wall', 'house', 'yard', 'wall'];   /* the layout V97 wrote: wall every 4th column, house on even rows */
    const oldLayout = (x, y) => (((x % 4) + 4) % 4 === 0) ? 'wall' : ((((y % 2) + 2) % 2 === 0) ? 'house' : 'yard');
    let same = 0; for (let y = 0, i = 0; y < 8; y++) for (let x = 10; x < 15; x++, i++) if (D.lot[i] === oldLayout(x, y)) same++;
    ok('the lot beside the road is laid out the way the board he approved laid it out (V229\'s '
       + 'four-by-four layout was for the cell row only)', same === D.lot.length, same + ' of ' + D.lot.length + ' tiles');

    /* ===== THE CELL ROW STAYS AN HONEST OPTION ===== */
    ok('the cell row still derives when picked, so [tile options] can show it in the real fight: '
       + 'a 3 m cell, two body tiles, his same metres',
       C.opt === 'cell' && Math.abs(C.tileM - 3) < 1e-6
       && metres(C, 'pistol') === 12 && metres(C, 'rifle') === 24 && metres(C, 'sniper') === 36,
       C.tileM + ' m, pistol ' + metres(C, 'pistol') + ', rifle ' + metres(C, 'rifle') + ', scope ' + metres(C, 'sniper'));
    ok('and switching back puts the default back exactly, so a preview can never strand him on '
       + 'a board he did not pick',
       B.opt === 'house' && B.bodyPx === D.bodyPx && B.tileM === D.tileM && B.tilePx === D.tilePx
       && JSON.stringify(B.reach) === JSON.stringify(D.reach),
       'back: ' + B.opt + ', ' + B.bodyPx + ' px, ' + B.tileM + ' m');

    ok('no page errors while the rows were switched', d.errs.length === 0, d.errs.slice(0, 2).join(' ; '));
  } finally {
    console.log('=== NO ATARI GATE: ' + pass + ' passed, ' + fail + ' failed ===');
    await d.close();
    process.exit(fail ? 1 : 0);
  }
})();
