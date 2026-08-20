#!/usr/bin/env node
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* FURNISH GATE (8/18/26, WORLD lane) — what is in the room, and therefore what you can
 * get behind.
 *
 * THIS IS THE SECOND HALF OF A NUMBER THIS LANE PUBLISHED THIS MORNING. gates/retreat_
 * gate.js measured the hard obligation from laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26.md
 * §6 — "a cramped room deletes the entire core verb" — and found a clean break: every
 * plate at 10x10 or under is ONE ROOM with 94% of its floor unable to get out of sight.
 * Walls cannot fix that, because a 6x6 plate is 4.5 METRES SQUARE and partitioning a shed
 * to make a gate go green is inventing architecture that does not exist. Cover at that
 * size is WHAT IS IN THE ROOM, and the floorplan generator has carried the string
 * "furniture per role" in meta.pending since July without anything measuring its absence.
 *
 * AND THE TIMING IS NOT LUCK: __CITY_FIGHT__ ("THE DOOR IS THE FIGHT") landed on the
 * walked surface while this was being built, so inEnter is now both the way inside and
 * the way into a fight. The room being furnished is the room the fight happens in.
 *
 * THE ONE THING THIS GATE EXISTS TO STOP is the cheat that would make every number look
 * better while the game plays exactly the same: calling a desk "cover". Only class
 * `cover` blocks sight — racking, lockers, a fridge, a counter run, chest-to-head and
 * opaque. `low` (a bed, a sofa, a meeting table) blocks the BODY and never the LOOK,
 * because there is no crouch in this game and a sofa cannot hide you. Flip that one flag
 * and the retreat obligation passes everywhere while nothing has changed on screen.
 *
 * IT ALSO HOLDS THE TWO WAYS FURNISHING BREAKS A ROOM RATHER THAN DRESSING IT:
 *   a piece across a doorway seals the room shut, which is worse than leaving it empty;
 *   a racking run across the middle cuts the floor in two and strands the half without
 *   the door, and nothing else in the engine would ever notice.
 * Both mutation-confirmed, along with the desk-is-cover flip.
 *
 *   node gates/furnish_gate.js
 */
const path = require('path');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
function ok(what, cond) {
  if (cond) { pass++; console.log('  ok   ' + what); }
  else { fail++; console.log('  FAIL ' + what); }
}

const FP = require(path.join(ROOT, 'engine/bohemia_floorplan.js'));
const F = require(path.join(ROOT, 'engine/bohemia_furnish.js'));
const R = require(path.join(ROOT, 'engine/bohemia_retreat.js'));
const ZONES = Object.keys(FP.ZONES);
const SEEDS = [1, 2, 3, 4, 5, 6];

console.log('FURNISH GATE — a room you can get behind something in\n');

/* ── 1. THE THREE CLASSES, AND THE ONE THAT MATTERS ────────────────────────── */
console.log('THE CLASSES, AND THE CHEAT THEY EXIST TO STOP');
ok('there are exactly three classes: cover, low, loose',
   F.COVER === 'cover' && F.LOW === 'low' && F.LOOSE === 'loose');
ok('COVER blocks the body AND the look',
   F.blocksMove({ furn: { cls: 'cover' } }) === true &&
   F.blocksSight({ furn: { cls: 'cover' } }) === true);
ok('LOW blocks the body and NOT the look — there is no crouch in this game, so a sofa ' +
   'cannot hide you and must not pretend to',
   F.blocksMove({ furn: { cls: 'low' } }) === true &&
   F.blocksSight({ furn: { cls: 'low' } }) === false);
ok('LOOSE blocks nothing at all, so nothing downstream can mistake litter for cover',
   F.blocksMove({ furn: { cls: 'loose' } }) === false &&
   F.blocksSight({ furn: { cls: 'loose' } }) === false);
ok('and the retreat measure agrees with all three, which is what makes the number honest',
   R.opaque({ g: 'floor', furn: { cls: 'cover' } }) === true &&
   R.opaque({ g: 'floor', furn: { cls: 'low' } }) === false &&
   R.walkable({ g: 'floor', furn: { cls: 'low' } }) === false &&
   R.walkable({ g: 'floor', furn: { cls: 'loose' } }) === true);

/* ── 2. EVERY ROLE THE GENERATOR CAN EMIT IS FURNISHED ─────────────────────────
   DERIVED FROM THE FLOORPLAN'S OWN ZONE TABLE, never from a list kept here. A new zone
   role added next month either has furniture or turns this red the same day — which is
   the only way a table like this stays true to the thing it describes. */
console.log('\nEVERY ROLE THE FLOORPLAN CAN EMIT, DERIVED FROM ITS OWN TABLE');
{
  const roles = new Set();
  ZONES.forEach(z => FP.ZONES[z].roles.forEach(r => roles.add(r)));
  const missing = [...roles].filter(r => !F.ROLES[r]);
  console.log('       ' + roles.size + ' distinct roles across ' + ZONES.length + ' zones');
  ok('every one of them has real furniture' + (missing.length ? ' — MISSING: ' + missing.join(', ') : ''),
     missing.length === 0);
  ok('and the default role is covered too, for a plate whose zone nobody declared',
     !!F.ROLES.room);
}

/* ── 3. DENSITY IS A FACT ABOUT THE ROOM, NOT A TASTE CALL ─────────────────────
   The ORDER is asserted and the values are not: a stockroom is wall-to-wall racking and
   a lobby is nearly empty, and that is true of buildings rather than of this game. What
   ships EMPTY is the global multiplier — how furnished the world should FEEL is his. */
console.log('\nDENSITY IS A FACT ABOUT THE ROOM; THE FEEL IS HIS');
ok('a stockroom is denser than an office, which is denser than a hall',
   F.ROLES.stockroom.per25 > F.ROLES.office.per25 &&
   F.ROLES.office.per25 > F.ROLES.hall.per25);
ok('a records room is racking, an atrium is not',
   F.ROLES.records.per25 >= 5 && F.ROLES.atrium.per25 <= 1);
ok('the global density dial is EMPTY and answers NO_RULING',
   Object.keys(F.DENSITY).length === 0 && F.densityDial() === F.NO_RULING);
ok('and no piece is branded, named or owned by anybody — a room\'s contents are generic ' +
   'because generic is what is true; whose room it is, is canon and therefore his',
   Object.keys(F.ROLES).every(r => F.ROLES[r].pieces.every(p => /^[a-z_]+$/.test(p.id))));

/* ── 4. THE TWO WAYS FURNISHING BREAKS A ROOM ────────────────────────────────── */
console.log('\nTHE TWO WAYS FURNISHING BREAKS A ROOM INSTEAD OF DRESSING IT');
const SIZES = [[6, 6], [8, 8], [10, 10], [12, 10], [16, 14], [20, 16], [24, 18], [40, 28]];
{
  let sealed = 0, split = 0, onWall = 0, plans = 0, pieces = 0;
  for (const [W, H] of SIZES) for (const z of ZONES) for (const s of SEEDS) {
    const seed = s * 7919 + W * 31 + H;
    const p = F.furnish(FP.plate(seed, W, H, { zone: z }), seed);
    plans++; pieces += (p.furniture || []).length;
    for (let y = 0; y < p.H; y++) for (let x = 0; x < p.W; x++) {
      const c = p.grid[y][x];
      if (!c) continue;
      if (c.furn && c.g !== 'floor') onWall++;
      if (!(c.door === true || c.g === 'door')) continue;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const n = p.grid[y + dy] && p.grid[y + dy][x + dx];
        if (n && n.furn) sealed++;
      }
    }
    if (R.measure(p).components > 1) split++;
  }
  console.log('       ' + plans + ' furnished plans, ' + pieces + ' pieces placed');
  ok('NOTHING is placed in a doorway or the cell beside one — furnishing a room shut is ' +
     'worse than leaving it empty (' + sealed + ' violations)', sealed === 0);
  ok('NO plate is cut into disconnected pieces — a racking run across the middle strands ' +
     'the half without the door, and nothing else in the engine would notice (' + split +
     ' split)', split === 0);
  ok('nothing is stamped on a wall (' + onWall + ')', onWall === 0);
  ok('and it actually placed something, so none of the above passed by doing nothing',
     pieces > 1000);
}

/* ── 5. DETERMINISTIC AND IDEMPOTENT ─────────────────────────────────────────── */
console.log('\nDETERMINISTIC, AND IT DOES NOT DOUBLE UP');
{
  const sig = (p) => p.grid.map(r => r.map(c => c.furn ? c.furn.id[0] + c.furn.cls[0] : '.').join('')).join('|');
  const a = F.furnish(FP.plate(4242, 20, 16, { zone: 'office' }), 4242);
  const b = F.furnish(FP.plate(4242, 20, 16, { zone: 'office' }), 4242);
  ok('same seed and plate gives a byte-identical furnishing', sig(a) === sig(b));
  const c = FP.plate(4242, 20, 16, { zone: 'office' });
  F.furnish(c, 4242); const once = sig(c);
  F.furnish(c, 4242);
  ok('furnishing an already-furnished plate changes nothing — inEnter can be called ' +
     'twice on the same building and the room does not fill up with a second set',
     sig(c) === once);
  const d = F.furnish(FP.plate(4243, 20, 16, { zone: 'office' }), 4243);
  ok('a different seed gives a different room', sig(d) !== once);
}

/* ── 6. THE PENDING STRING IT EXISTS TO RETIRE ─────────────────────────────── */
console.log('\nTHE TODO IT RETIRES');
{
  const bare = FP.plate(7, 20, 16, { zone: 'retail' });
  ok('a BARE plate still admits it has no furniture',
     (bare.meta.pending || []).indexOf('furniture per role') >= 0);
  const done = F.furnish(FP.plate(7, 20, 16, { zone: 'retail' }), 7);
  ok('a furnished one does not, and says how many pieces are in it instead',
     (done.meta.pending || []).indexOf('furniture per role') < 0 && done.meta.furnished > 0);
}

/* ── 7. THE NUMBER IT WAS BUILT TO MOVE ────────────────────────────────────────
   This is the assertion the whole file is for. Everything above could be true of a
   furnisher that scattered decoration and changed nothing about whether a room can
   hold a fight. */
console.log('\nTHE NUMBER IT WAS BUILT TO MOVE');
const ladder = [];
for (const [W, H] of SIZES) {
  let badB = 0, badF = 0, sB = 0, sF = 0, n = 0;
  for (const z of ZONES) for (const s of SEEDS) {
    const seed = s * 7919 + W * 31 + H;
    const bare = R.measure(FP.plate(seed, W, H, { zone: z }));
    const full = R.measure(F.furnish(FP.plate(seed, W, H, { zone: z }), seed));
    n++; if (!bare.ok) badB++; if (!full.ok) badF++;
    sB += bare.noBreak.length; sF += full.noBreak.length;
  }
  ladder.push({ W, H, n, badB, badF, sB, sF });
  console.log('       ' + (W + 'x' + H).padEnd(7) + ' no-retreat plans ' +
              String(badB).padStart(3) + ' -> ' + String(badF).padStart(3) +
              '    stranded cells ' + String(sB).padStart(5) + ' -> ' + String(sF).padStart(5));
}
{
  const tB = ladder.reduce((a, r) => a + r.sB, 0), tF = ladder.reduce((a, r) => a + r.sF, 0);
  console.log('       TOTAL stranded ' + tB + ' -> ' + tF +
              '  (' + (100 * (tB - tF) / tB).toFixed(0) + '% fewer)');
  ok('furnishing strands FEWER cells everywhere, never more', ladder.every(r => r.sF <= r.sB));
  ok('and it is a large move, not a rounding one (' + (100 * (tB - tF) / tB).toFixed(0) + '%)',
     (tB - tF) / tB > 0.5);

  /* THE BREAK POINT COMES DOWN, and that is a ratchet: the smallest footprint from which
     every larger one guarantees a retreat for every cell. 320 tiles bare, measured 8/18;
     224 furnished. It may only ever get SMALLER. */
  let breakAt = null;
  for (let i = 0; i < ladder.length; i++) {
    const rest = ladder.slice(i).filter(r => r.W * r.H >= ladder[i].W * ladder[i].H);
    if (rest.every(r => r.badF === 0)) { breakAt = ladder[i]; break; }
  }
  const RATCHET = 224;          /* 16x14, measured 8/18 furnished. MAY ONLY COME DOWN. */
  ok('there is still a footprint from which the obligation holds absolutely', !!breakAt);
  if (breakAt) {
    const area = breakAt.W * breakAt.H;
    console.log('       break point: ' + breakAt.W + 'x' + breakAt.H + ' (' + area +
                ' tiles) — it was 20x16 / 320 bare');
    ok('THE BREAK POINT CAME DOWN from 320 bare tiles to ' + area + ', and it is a ' +
       'ratchet that may only ever come down further', area <= RATCHET);
  }
  /* AND THE RESIDUAL IS HONEST. A 4.5 m shed with one shelf in it still has sightlines,
     and saying so is better than tuning density until a number goes green. */
  const small = ladder.filter(r => r.W * r.H <= 100);
  console.log('       residual below 10x10: ' + small.reduce((a, r) => a + r.badF, 0) +
              ' of ' + small.reduce((a, r) => a + r.n, 0) + ' plans still strand somebody');
  ok('the smallest plates are IMPROVED but not claimed fixed — a 4.5 m room with one ' +
     'shelf in it still has sightlines, and tuning density until that number went green ' +
     'would be lying about a shed',
     small.some(r => r.badF > 0) && small.every(r => r.badF < r.badB));
}

/* ── 8. THE REAL SURFACE ───────────────────────────────────────────────────────
   Everything above could be true of a module nobody loads. VERIFY ON THE REAL SURFACE
   (7/18): walk into a real building in the real valley and ask the running page. */
const PAGE = 'slices/BOHEMIA_CITY_WORLD.html';
function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

(async () => {
  console.log('\nTHE REAL SURFACE — a real building in the real valley');
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
    await SETTLE(p, 3500);
    await p.evaluate(() => { try { cardHide(); } catch (e) {} });

    const r = await p.evaluate(() => {
      const out = { mod: typeof BohemiaFurnish !== 'undefined', entered: null, cells: 0,
                    classes: {}, draws: 0, blocked: null, err: null };
      if (!out.mod) return out;
      const P = __proof.getPos();
      /* a plate small enough that the camera FITS it, so the draw pass is on screen */
      outer:
      for (let rad = 1; rad < 240; rad++) {
        for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== rad) continue;
          const gx = P.hx + dx, gy = P.hy + dy;
          const c = cellAt(gx, gy);
          if (!(c && c.enter && !c.walk)) continue;
          const from = cellAt(gx, gy + 1);
          if (!(from && from.walk)) continue;
          let foot; try { foot = inFootprint(gx, gy); } catch (e) { continue; }
          if (!foot || foot.w * foot.h > 420 || foot.w < 6 || foot.h < 6) continue;
          try {
            __proof.setPos(gx, gy + 1);
            if (inEnter(gx, gy, gx, gy + 1, false)) {
              out.entered = { gx: gx, gy: gy, w: foot.w, h: foot.h }; break outer;
            }
          } catch (e) { out.err = String(e); }
        }
      }
      if (!out.entered) return out;
      /* READ THE CELLS, not fp.furniture: generate() returns an object whose levels[0]
         is a VIEW sharing grid/rooms/meta by reference, so the manifest lands on the
         view while the CELLS are shared. The grid is the truth and the grid is what
         draws — and reading the wrong field is exactly how the first probe of this
         reported ZERO furniture in a room that had 2,760 furnished cells in it. */
      const fp = INSIDE.fp;
      let coverCell = null;
      for (let y = 0; y < fp.H; y++) for (let x = 0; x < fp.W; x++) {
        const c = fp.grid[y][x];
        if (!(c && c.furn)) continue;
        out.cells++;
        out.classes[c.furn.cls] = (out.classes[c.furn.cls] || 0) + 1;
        if (c.furn.cls === 'cover' && !coverCell) coverCell = [x, y];
      }
      /* A PIECE OF FURNITURE YOU WALK THROUGH IS A DRAWING, NOT AN OBJECT. */
      if (coverCell) out.blocked = inPassable(coverCell[0], coverCell[1]);
      /* THE CANVAS HOLDS THE LAST FRAME. Ask for a new one, or this counts the draws of
         whatever was on screen before he walked in — which is how the first screenshot
         of this came back showing the OUTDOOR view with the HUD saying INSIDE. */
      window.__FURN_DRAWS = 0;
      try { render(); } catch (e) { out.err = String(e); }
      out.draws = window.__FURN_DRAWS || 0;
      return out;
    });

    ok('the furnisher is ON the page he walks into', r.mod);
    ok('a real building in the real valley was entered through its door' +
       (r.entered ? ' (' + r.entered.w + 'x' + r.entered.h + ')' : ''), !!r.entered);
    ok('and the room he is standing in has things in it (' + r.cells + ' cells, ' +
       JSON.stringify(r.classes) + ')', r.cells > 0);
    ok('with both classes present, so the room is not made entirely of one thing',
       !!r.classes.cover && !!r.classes.low);
    ok('a COVER cell REFUSES to be walked into — a shelf you can walk through is a ' +
       'drawing, not an object, and every retreat number above assumes it stops you',
       r.blocked === false);
    ok('and one real frame DRAWS them (' + r.draws + ' volumes)', r.draws > 0);
    ok('no page errors walking into a furnished building' + (errs.length ? ' — ' + errs[0] : ''),
       errs.length === 0);
    await browser.close();
  } catch (e) {
    if (browser) try { await browser.close(); } catch (_e) {}
    ok('the real-surface half ran at all — ' + String(e).split('\n')[0], false);
  }

  console.log('\nFURNISH GATE: ' + pass + ' passed, ' + fail + ' failed  (rooms have things ' +
              'in them, only the chest-high things hide you, no doorway is sealed, no ' +
              'floor is cut in two, and it reaches the glass)');
  process.exit(fail ? 1 : 0);
})();
