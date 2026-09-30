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
   V231 (Paolo 9/28, overworld law s14: "for the combat a tile is as big as a house"): the cell row
   is DELETED, not kept; the street is four houses wide, not seventeen; no roof lies on the ground;
   and the one tile of high ground is a standing house on a lot, his 9/27 UP.
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
          reach: {}, lot: [], bands: [] };
        for (const w of ['pistol', 'rifle', 'sniper']) r.reach[w] = houseRange(w).max;
        for (let y = 0; y < 8; y++) for (let x = -8; x < 12; x++) if (streetKindAt(x) === 'lot') r.lot.push(lotSubKind(x, y));
        for (let x = -4; x <= 5; x++) r.bands.push(streetKindAt(x));
        return r; };
      const out = {};
      out.def = read();
      out.cellRefused = setBoardOpt('cell') === false;
      out.names = ['cellBoard', 'roofBlock', 'HOUSE_CELLS', 'LOT_PERIOD_X'].filter(n => { try { return typeof eval(n) !== 'undefined'; } catch (e) { return false; } });
      out.back = read();
      /* THE HIGH GROUND, across 60 arenas: where it stands, and whether it stands up */
      const hg = { street: 0, withDeck: 0, onLot: 0, standing: 0, dists: [] };
      for (let s = 1; s <= 60; s++) { try { BohemiaArena.set(s); setupCombat(); } catch (e) { continue; }
        if (G.arenaKind !== 'street') continue; hg.street++;
        if (!G.deck.length) continue; hg.withDeck++;
        const q = pXY(G.deck[0]), k = streetKindAt(Math.round(G.worldOff.x + q[0]));
        if (k === 'lot') hg.onLot++; if (standingHouse()) hg.standing++;
        hg.dists.push(+Math.hypot(q[0], q[1]).toFixed(2)); }
      out.hg = hg;
      /* THE BOARDS, 24 of them: the kinds of ground, the houses, the blockers, what is inside */
      const hb = [];
      for (let s = 1; s <= 24; s++) { try { BohemiaArena.set(s); setupCombat(); } catch (e) { continue; }
        if (G.arenaKind !== 'street') continue;
        const wox = G.worldOff.x || 0, woy = G.worldOff.y || 0, kinds = {}; let houses = 0, un = 0, inside = 0;
        for (let ty = -5; ty <= 5; ty++) for (let tx = -5; tx <= 5; tx++) {
          let k = streetKindAt(Math.round(wox + tx)); if (k === 'lot') k = lotSubKind(Math.round(wox + tx), Math.round(woy + ty));
          kinds[k] = 1;
          if (k === 'house') { houses++;
            const blk = G.pillars.some(P => P.house && Math.abs(pXY(P)[0] - tx) < 0.5 && Math.abs(pXY(P)[1] - ty) < 0.5);
            if (!blk && !deckTileAt(tx, ty) && !(G._walkOK && G._walkOK[tx + ',' + ty])) un++; } }
        const inH = (x, y) => !!(G._houseSet && G._houseSet[Math.round(x) + ',' + Math.round(y)]);
        for (const e of G.e) if (e && !e.dead && inH(Math.cos(e.ea) * e.edist, Math.sin(e.ea) * e.edist)) inside++;
        for (const P of G.pillars) if (!P.house && inH(pXY(P)[0], pXY(P)[1])) inside++;
        if (G.exit && inH(Math.cos(G.exit.ea) * G.exit.edist, Math.sin(G.exit.ea) * G.exit.edist)) inside++;
        hb.push({ road: !!kinds.road, walk: !!kinds.walk, kinds: Object.keys(kinds).length, houses, housesUnblocked: un, inside }); }
      out.hb = hb;
      return out;
    });
    const D = R.def, B = R.back, HG = R.hg, HB = R.hb;
    console.log('  DEFAULT ' + JSON.stringify({ opt: D.opt, tileM: D.tileM, bodyPx: D.bodyPx, tilePx: D.tilePx, reach: D.reach }));
    console.log('  STREET  ' + D.bands.join(' '));
    console.log('  HIGH GROUND ' + JSON.stringify({ street: HG.street, withDeck: HG.withDeck, onLot: HG.onLot, standing: HG.standing,
      near: Math.min(...HG.dists), far: Math.max(...HG.dists) }));

    /* ===== THE DEFAULT IS HIS PICK ===== */
    ok('*** THE BOARD A FIGHT STARTS ON IS THE ONE HE CHOSE (9/27 vote: "now looks better than '
       + 'what you had planned"). ***', D.opt === 'house', 'default row: ' + D.opt);
    ok('*** NO ATARI: THE MAN IS AT FULL DETAIL, the 112 px art we made (rule 37a: "pixel detail '
       + 'is never reduced", the 28 px one-cell sprite is dead). ***',
       Math.abs(D.bodyPx - 112) < 0.5, 'the fighter is ' + D.bodyPx + ' px');
    ok('*** A COMBAT TILE IS A HOUSE (Paolo 9/28, overworld law s14: "for the combat a tile is as big '
       + 'as a house"): twelve metres ***', Math.abs(D.tileM - 12) < 1e-6, D.tileM + ' m');
    ok('and the house is TILE_WIDE sprite widths of the full-detail man, which is his dial '
       + '(1.75, "his number, by eye")',
       D.wide === 1.75 && Math.abs(D.tilePx - D.wide * D.bodyPx) < 1.5,
       'tile ' + D.tilePx + ' px = ' + D.wide + ' x ' + D.bodyPx);
    const metres = (row, w) => (row.reach[w] || 0) * row.tileM;
    ok('*** HIS 9/22 DISTANCES, ON THE DEFAULT: a pistol twelve metres, a rifle twenty-four, a '
       + 'scope thirty-six. ***',
       metres(D, 'pistol') === 12 && metres(D, 'rifle') === 24 && metres(D, 'sniper') === 36,
       'pistol ' + metres(D, 'pistol') + ', rifle ' + metres(D, 'rifle') + ', scope ' + metres(D, 'sniper'));

    /* ===== THE CELL BOARD IS GONE, NOT AN OPTION (s14b; GRAVEYARD IS FINAL) ===== */
    ok('*** THE CELL BOARD IS GONE: asking for it is refused, and none of its names are left in the '
       + 'fight (s14b: the cell-grid fight is dead) ***', R.cellRefused && R.names.length === 0,
       R.cellRefused ? ('names left: ' + (R.names.join(', ') || 'none')) : 'setBoardOpt(\'cell\') still switches');
    ok('and asking for it changes nothing, so no preview can strand him on a board he did not pick',
       B.opt === 'house' && B.bodyPx === D.bodyPx && B.tileM === D.tileM && B.tilePx === D.tilePx
       && JSON.stringify(B.reach) === JSON.stringify(D.reach),
       'after: ' + B.opt + ', ' + B.bodyPx + ' px, ' + B.tileM + ' m');

    /* ===== THE STREET IS A STREET, IN HOUSES ===== */
    const road = D.bands.filter(k => k === 'road').length, walk = D.bands.filter(k => k === 'walk').length;
    ok('*** THE STREET IS FOUR HOUSES WIDE, NOT SEVENTEEN: two tiles of road (24 m), one of sidewalk '
       + 'each side, then the lots (it was 204 m of road on a glass 6.6 houses across) ***',
       road === 2 && walk === 2 && D.bands.filter(k => k === 'lot').length === D.bands.length - 4,
       D.bands.join(' '));
    ok('*** NO ROOF LIES ON THE GROUND, AND THE NEIGHBOURS STAND UP (Paolo 9/28: "one tile is the size of '
       + 'a house doesn\'t mean every tile is a house; it still has to look like a city; we have neighbours"): '
       + 'the lot is houses, yards and walls, and every house on it is standing ***',
       D.lot.includes('house') && D.lot.includes('yard') && D.lot.includes('wall') && D.lot.every(k => ['house', 'yard', 'wall'].includes(k)),
       ['house', 'yard', 'wall'].map(k => k + ' ' + D.lot.filter(v => v === k).length).join(', '));
    ok('*** HOUSE-SIZED, NOT HOUSE-FILLED: every board carries a street and more than one kind of ground '
       + '(the owed gate on [house tiles back]) ***', HB.every(b => b.road && b.walk && b.kinds >= 4),
       HB.filter(b => !(b.road && b.walk && b.kinds >= 4)).length + ' of ' + HB.length + ' boards short; kinds per board '
       + Math.min(...HB.map(b => b.kinds)) + ' to ' + Math.max(...HB.map(b => b.kinds)));
    ok('*** EVERY NEIGHBOUR\'S HOUSE IS A BLOCKER: a house-sized piece of tall cover on every house tile '
       + 'but the one you climb and the walk to its stair; nobody walks through a house ***',
       HB.every(b => b.housesUnblocked === 0) && HB.some(b => b.houses > 0),
       HB.reduce((a, b) => a + b.houses, 0) + ' houses standing, ' + HB.reduce((a, b) => a + b.housesUnblocked, 0) + ' with no blocker');
    ok('and nobody starts inside a house: no enemy, no crate, no car, no way out',
       HB.every(b => b.inside === 0), HB.reduce((a, b) => a + b.inside, 0) + ' things inside a house');
    /* ===== THE HIGH GROUND IS A HOUSE WITH ITS ROOF ON (his UP, 9/27; s14e) ===== */
    ok('*** THE HIGH GROUND STANDS ON A LOT, NEVER IN THE ROAD (measured before: 80 of 80 in the '
       + 'carriageway) ***', HG.withDeck > 5 && HG.onLot === HG.withDeck, HG.onLot + ' of ' + HG.withDeck + ' street fights with one');
    ok('and it is drawn as a standing house, two or three houses from him, in reach of a walk',
       HG.standing === HG.withDeck && Math.min(...HG.dists) >= 1.9 && Math.max(...HG.dists) <= 4.3,
       HG.standing + ' standing, ' + Math.min(...HG.dists) + ' to ' + Math.max(...HG.dists) + ' houses');

    ok('no page errors while the board was asked for a dead row', d.errs.length === 0, d.errs.slice(0, 2).join(' ; '));
  } finally {
    console.log('=== NO ATARI GATE: ' + pass + ' passed, ' + fail + ' failed ===');
    await d.close();
    process.exit(fail ? 1 : 0);
  }
})();
