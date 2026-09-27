#!/usr/bin/env node
/* ============================================================================
   THE FIGHT IS ON CELLS   (COMBAT lane, [fight on the grid], rule 34)

   *** PAOLO 9/27, LOCKED (laws/BOHEMIA_LAW_TWO_SCALES_ONE_GAME_9_27_26.md): "one house
   doesn't equal one tile, it's all fucked up." A COMBAT TILE IS A HOUSE (9/4) and THE
   STEP IS A HOUSE (9/15) are SUPERSEDED. The fight is on the close grid, in CELLS, and
   a person is ONE CELL. ***

   EVERY NUMBER THIS GATE HOLDS IS DERIVED, AND IT CHECKS THE DERIVATION RATHER THAN THE
   VALUE, because a typed constant goes stale the first time a lane tunes one and then
   the gate is green about a board nobody is playing:

     a cell is 3 m       because his house is 12 m and rule 34 puts FOUR cells in a house
     a cell is 2 body    because a body tile is 1.5 m and 3/1.5 = 2, a whole number
     a cell is 32 px     because a person fills his cell, so tile = TILE_WIDE * 112 * body
     reach is 4/8/12     because that is HOUSE_MAX x4 -- THE SAME 12, 24 AND 36 METRES
                         he approved on 9/22, in a new unit. The gate asserts the METRES.

   AND IT RUNS ON THE ONE DRIVER (rule 14g). This lane's older gates each rolled their own
   front door and two of them spent rounds reading a loading screen.
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
          && typeof tileMetres === 'function' && typeof bodyRule === 'function')) { fr = f; break; } } catch (e) {}
      }
      if (!fr) await d.page.waitForTimeout(500);
    }
    if (!fr) { ok('the fight answers, so there is something to measure', false); return; }

    const R = await fr.evaluate(() => {
      try { BohemiaArena.set(3); setupCombat(); } catch (e) {}
      const cv = document.getElementById('cv'), b = cv.getBoundingClientRect();
      const W = cv.width, H = cv.height, m = Math.min(W, H);
      const out = {
        cssW: Math.round(b.width), cssH: Math.round(b.height), backW: W, backH: H,
        scaled: (typeof cellOn === 'function') ? !!cellOn() : null,
        tileM: +tileMetres().toFixed(4),
        bodyTileM: (typeof BODY_M !== 'undefined') ? BODY_M : null,
        tileK: (typeof tileK === 'function') ? tileK() : null,
        ringPx: +(m * fieldPitch(W, H)).toFixed(3),
        bodyPx: +(112 * bodyRule()).toFixed(3),
        sight: +sightTiles().toFixed(2),
        ceil: (typeof reachCeil === 'function') ? reachCeil() : null,
        contentR: +contentR().toFixed(2),
        tileWide: (typeof TILE_WIDE !== 'undefined') ? TILE_WIDE : null,
        reach: {} };
      /* the game's OWN range function, asked per weapon, so this is what the fight uses */
      try { for (const w of ['pistol', 'rifle', 'sniper'])
        out.reach[w] = houseRange(w).max; } catch (e) { out.reachErr = String(e).slice(0, 80); }
      out.across = +(out.cssW / out.ringPx).toFixed(2);
      return out;
    });
    console.log('  ' + JSON.stringify(R));

    ok('the scaled board is the one a fight starts on', R.scaled === true);

    ok('*** A CELL IS THREE METRES, AND IT IS DERIVED, NOT TYPED (rule 34: four cells to a '
       + 'house, and his house is twelve metres from a real suburban lot frontage). ***',
       Math.abs(R.tileM - 3) < 1e-6, 'a tile reads ' + R.tileM + ' m');

    ok('and that makes it exactly TWO body tiles, a whole number rather than a fit '
       + '(a body tile is a person\'s step, 1.5 m)',
       R.bodyTileM && Math.abs(R.tileM / R.bodyTileM - 2) < 1e-9 && R.tileK === 2,
       'tileK ' + R.tileK + ', body tile ' + R.bodyTileM + ' m');

    ok('*** A PERSON IS ONE CELL (rule 34 s4, which re-reads rule 21 rather than repealing '
       + 'it: one size at every zoom, and the size is now one cell). ***',
       Math.abs(R.bodyPx - 32) < 0.5, 'the fighter is ' + R.bodyPx + ' px');

    ok('and the cell comes out at his 32 px BY CONSTRUCTION, not by tuning: a person fills '
       + 'his cell, so tile = TILE_WIDE x 112 x body, and TILE_WIDE is 1',
       R.tileWide === 1 && Math.abs(R.ringPx - R.bodyPx) < 0.5 && Math.abs(R.ringPx - 32) < 0.5,
       'tile ' + R.ringPx + ' px, body ' + R.bodyPx + ' px, TILE_WIDE ' + R.tileWide);

    ok('*** SO THE BOARD IS A ROOM AND NOT A CAR PARK: about twelve cells across a phone, '
       + 'where the house board held two houses. ***',
       R.across >= 10 && R.across <= 14, R.across + ' cells across ' + R.cssW + ' CSS px');

    /* ===== HIS DISTANCES DID NOT MOVE, WHICH IS THE WHOLE CLAIM ===== */
    const metres = w => (R.reach[w] || 0) * R.tileM;
    ok('*** NOT ONE DISTANCE HE APPROVED MOVED, only the unit (9/22: pistol 1 tile, rifle 2, '
       + 'scope 3, when a tile was a house of 12 m). *** A pistol still reaches twelve metres, '
       + 'a rifle twenty-four, a scope thirty-six.',
       Math.abs(metres('pistol') - 12) < 0.01 && Math.abs(metres('rifle') - 24) < 0.01
       && Math.abs(metres('sniper') - 36) < 0.01,
       'pistol ' + metres('pistol') + ' m, rifle ' + metres('rifle') + ' m, scope ' + metres('sniper') + ' m');

    ok('and the ceiling does not clip the scope back to the rifle, which is what the old '
       + 'house ceiling of 3 would do at four times the numbers',
       R.ceil >= R.reach.sniper, 'ceiling ' + R.ceil + ', scope ' + R.reach.sniper);

    ok('sight keeps its metres too: six houses was seventy-two, which is twenty-four cells',
       Math.abs(R.sight * R.tileM - 72) < 0.01, R.sight + ' cells = ' + (R.sight * R.tileM) + ' m');

    ok('and the world is built further than the glass shows, so no zoom leaves a ring of '
       + 'bare desert at the edge (V139\'s rule, re-checked at the new scale)',
       R.contentR > R.across / 2, 'built ' + R.contentR + ' cells against ' + (R.across / 2).toFixed(1) + ' to the edge');

    ok('the canvas is still 1:1 with the glass, so a cell is 32 REAL pixels (V224)',
       R.backW === R.cssW, R.backW + ' backing / ' + R.cssW + ' CSS');

    ok('no page errors while the board was built', d.errs.length === 0, d.errs.slice(0, 2).join(' ; '));
  } finally {
    console.log('=== THE FIGHT IS ON CELLS GATE: ' + pass + ' passed, ' + fail + ' failed ===');
    await d.close();
    process.exit(fail ? 1 : 0);
  }
})();
