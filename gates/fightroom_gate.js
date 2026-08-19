#!/usr/bin/env node
/* FIGHT ROOM GATE (8/19/26, WORLD lane) — THE FIGHT GETS THE ROOM, NOT ITS DIMENSIONS.
 *
 * `__CITY_FIGHT__` made the door the fight on the walked surface. The handoff it posted to
 * combat described the room as `{ w, h, zone }` — two numbers and a label — and its own
 * comment said why: walls as cover and doorways as chokepoints "belong to the teardown spec,
 * WHICH DOES NOT EXIST". It exists now, so the seam was the last thing left.
 *
 * IT IS THE PUREST FORM OF WHAT THE RF4 LIFT §6 WARNS ABOUT. This lane spent a day making
 * the floor mean something — cover you can get behind, ground that kills or slows you, a
 * measured retreat guarantee — and at the moment a fight starts, combat got a BOX. Every one
 * of those systems was invisible exactly where it was built to matter.
 *
 * THIS GATE STANDS ON THAT SEAM AND NOWHERE ELSE. It does not assert anything about how a
 * fight should play — §6 routes that to COMBAT. It asserts that the room combat receives IS
 * the room the player is standing in, cell for cell, and that the message says what its own
 * characters mean.
 *
 * THE FOUR WAYS THIS COULD BE A LIE, and each is a separate check:
 *   1. THE MAP IS THE WRONG SIZE. w*h characters or it is describing a different room.
 *   2. THE MAP DISAGREES WITH THE FLOOR HE WALKS ON. Every '.' must be a cell inPassable()
 *      actually admits him to, and every '#' one it refuses — the same seam bug that had the
 *      occupancy model and the walked surface disagreeing about 4,327 of 4,327 cells.
 *   3. COVER IS FLATTENED. Chest-high and knee-high must arrive as different characters,
 *      because only one of them hides you and merging them is the cheat that makes every
 *      number look better while the game plays the same.
 *   4. THE LEGEND IS MISSING. A payload whose characters mean whatever the reader assumes is
 *      a payload that will mean something different the day either side changes.
 *
 *   node gates/fightroom_gate.js
 */
const path = require('path');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
function ok(what, cond) {
  if (cond) { pass++; console.log('  ok   ' + what); }
  else { fail++; console.log('  FAIL ' + what); }
}

const PAGE = 'slices/BOHEMIA_CITY_WORLD.html';
function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

console.log('FIGHT ROOM GATE — the fight gets the room, not its dimensions\n');

(async () => {
  let browser;
  try {
    const { chromium } = requirePlaywright();
    browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto('file://' + path.join(ROOT, PAGE));
    await p.waitForTimeout(3500);
    await p.evaluate(() => { try { cardHide(); } catch (e) {} });

    const r = await p.evaluate(() => {
      const out = { entered: null, room: null, mismatch: [], checked: 0, err: null,
                    measureOnPage: typeof BohemiaRetreat !== 'undefined' };
      const P = __proof.getPos();
      outer:
      for (let rad = 1; rad < 240; rad++) {
        for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== rad) continue;
          const gx = P.hx + dx, gy = P.hy + dy, cc = cellAt(gx, gy);
          if (!(cc && cc.enter && !cc.walk)) continue;
          const from = cellAt(gx, gy + 1); if (!(from && from.walk)) continue;
          let foot; try { foot = inFootprint(gx, gy); } catch (e) { continue; }
          if (!foot || foot.w * foot.h > 420 || foot.w < 8 || foot.h < 8) continue;
          try {
            __proof.setPos(gx, gy + 1);
            if (inEnter(gx, gy, gx, gy + 1, false)) { out.entered = { w: foot.w, h: foot.h }; break outer; }
          } catch (e) { out.err = String(e); }
        }
      }
      if (!out.entered || typeof INSIDE === 'undefined' || !INSIDE) return out;
      const room = cityFightRoom(INSIDE.fp, INSIDE.foot);
      out.room = {
        w: room.w, h: room.h, zone: room.zone,
        floorLen: (room.floor || '').length,
        stand: (room.floor || '').split('').filter(c => c === '.').length,
        cover: (room.cover || '').split('').filter(c => c === 'C').length,
        low: (room.cover || '').split('').filter(c => c === 'l').length,
        groundLen: (room.ground || '').length,
        doors: (room.doors || []).length,
        retreat: room.retreat || null,
        legend: Object.keys(room.legend || {})
      };
      /* THE MAP MUST AGREE WITH THE FLOOR HE WALKS ON, cell for cell. inPassable() is what
         actually decides where his body may stand indoors; if the fight's map and his feet
         disagree, combat is fighting in a room that does not exist. */
      for (let y = 0; y < room.h; y++) for (let x = 0; x < room.w; x++) {
        const ch = room.floor[y * room.w + x];
        const walk = inPassable(x, y);
        out.checked++;
        if ((ch === '.') !== !!walk && out.mismatch.length < 8)
          out.mismatch.push(x + ',' + y + ' map=' + ch + ' inPassable=' + walk);
      }
      return out;
    });

    ok('a real building in the real valley was entered through its door' +
       (r.entered ? ' (' + r.entered.w + 'x' + r.entered.h + ')' : ''), !!r.entered);
    const R = r.room || {};
    console.log('       room ' + R.w + 'x' + R.h + ' (' + R.zone + '): ' + R.stand +
                ' standable, ' + R.cover + ' cover, ' + R.low + ' low, ' + R.doors + ' doors');
    console.log('       retreat ' + JSON.stringify(R.retreat));

    /* 1. the map is the right size */
    ok('the floor map is exactly w*h characters (' + R.floorLen + ' of ' + (R.w * R.h) +
       ') — anything else is describing a different room', R.floorLen === R.w * R.h);
    ok('and the ground channel is the same shape, so combat reads ONE geometry (' +
       R.groundLen + ')', R.groundLen === R.w * R.h);

    /* 2. it agrees with his feet */
    ok('EVERY cell of the map agrees with inPassable() — the thing that actually decides ' +
       'where his body may stand (' + r.checked + ' cells' +
       (r.mismatch.length ? ', MISMATCH: ' + r.mismatch.join('; ') : '') + ')',
       r.checked > 0 && r.mismatch.length === 0);
    ok('and the room is not solid: there is real floor in it (' + R.stand + ')', R.stand > 20);

    /* 3. cover is not flattened */
    ok('chest-high and knee-high arrive as DIFFERENT characters (' + R.cover + ' C, ' +
       R.low + ' l) — merging them is the cheat that makes every number look better while ' +
       'the game plays exactly the same', R.cover > 0 && R.low > 0);

    /* the chokepoints */
    ok('the doorways ride as chokepoints (' + R.doors + ') — a body in a doorway is a tool ' +
       'in his own corpus, and combat cannot find one in a rectangle', R.doors > 0);

    /* the retreat obligation, for THIS room */
    ok('the measure is ON THE PAGE, not only in a gate — a payload that silently drops the ' +
       'retreat field looks exactly like a feature nobody wired', r.measureOnPage === true);
    ok('the retreat obligation rides, measured for THIS room, not for rooms in general',
       !!R.retreat && typeof R.retreat.ok === 'boolean' &&
       typeof R.retreat.stranded === 'number' && typeof R.retreat.worst === 'number');
    ok('and its cell count matches the standable cells in the map (' +
       ((R.retreat || {}).cells) + ' vs ' + R.stand + ') — two independent counts of the ' +
       'same room, so a disagreement means one of them is measuring something else',
       !!R.retreat && R.retreat.cells === R.stand);

    /* 4. the legend rides */
    ok('the LEGEND rides in the payload (' + (R.legend || []).join(', ') + ') — combat never ' +
       'guesses what a character means, and a change on one side cannot silently mean ' +
       'something else on the other',
       (R.legend || []).indexOf('floor') >= 0 && (R.legend || []).indexOf('cover') >= 0 &&
       (R.legend || []).indexOf('ground') >= 0 && (R.legend || []).indexOf('order') >= 0);

    ok('no page errors building the room payload' + (errs.length ? ' — ' + errs[0] : ''),
       errs.length === 0);
    await browser.close();
  } catch (e) {
    if (browser) try { await browser.close(); } catch (_e) {}
    ok('the gate ran at all — ' + String(e).split('\n')[0], false);
  }

  console.log('\nFIGHT ROOM GATE: ' + pass + ' passed, ' + fail + ' failed  (combat receives ' +
              'the room the player is standing in, cell for cell, with its own legend)');
  process.exit(fail ? 1 : 0);
})();
