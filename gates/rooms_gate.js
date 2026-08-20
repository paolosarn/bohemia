/* ===========================================================================
   ROOMS GATE — step 1 of ONE WORLD INTERIORS, gated the same turn (FACTORY LAW).

   The spec names this gate's spec verbatim
   (records/BOHEMIA_ONE_WORLD_INTERIORS_SPEC_7_31_26.md, build order step 1):

       "Gate: every building has exactly one room group per enclosed space, and
        no room id leaks outdoors."

   WHY THIS GATE IS WORTH MORE THAN IT LOOKS. Step 1 changes nothing on screen,
   so there is no way to SEE it be wrong. Steps 2-6 all build on top of it, and
   the two ways it can be quietly wrong are both catastrophic later:

     ROOMS THAT MERGE  eight-connected flood fill welds two houses that touch at
                       a corner into one "room". Step 4 then hides both roofs the
                       moment you walk into either. Held down by a corner-touch
                       fixture, not by reading the code.
     ROOMS THAT LEAK   an over-broad indoor predicate paints a room id onto the
                       driveway, so the game thinks you are indoors on the street
                       and it rains on you in the living room. Held down by
                       sweeping every registered district and asserting every
                       outdoor cell is 0.

   It also asserts the WIRING, because a perfect module nothing calls is the
   exact failure this repo has hit three times in two days (border walls,
   the bought sidewalk, footsteps): tileInfo must actually carry room/roof.
   =========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const RMS = require('../engine/bohemia_rooms.js');
const W = require('../engine/bohemia_world.js');
const KIT = require('../engine/bohemia_district_kit.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };

/* ---- 1. the module is real and shaped right ---------------------------- */
ok('the rooms module exists', fs.existsSync(path.join(ROOT, 'engine', 'bohemia_rooms.js')));
ok('it exports group/roomAt/inside',
   typeof RMS.group === 'function' && typeof RMS.roomAt === 'function' && typeof RMS.inside === 'function');
ok('it REFUSES to guess what indoors means (the caller owns the predicate)',
   (() => { try { RMS.group([[1]], {}); return false; } catch (e) { return true; } })());

/* ---- 2. the fixtures: the two ways a flood fill goes wrong -------------- */
const IN = { indoor: c => c === 1 };

/* CORNER TOUCH. Two 2x2 masses meeting only at a diagonal are TWO buildings.
   An 8-connected fill says one, and every roof on the block would vanish at once. */
const corner = RMS.group([
  [1, 1, 0, 0],
  [1, 1, 0, 0],
  [0, 0, 1, 1],
  [0, 0, 1, 1],
], IN);
ok('a CORNER touch does not weld two buildings into one room (got ' + corner.count + ', want 2)',
   corner.count === 2);
ok('both corner-touch groups are whole (4 cells each)',
   corner.groups.length === 2 && corner.groups.every(g => g.cells === 4));

/* EDGE TOUCH. Sharing a wall IS one enclosed shell (house + attached garage). */
const edge = RMS.group([
  [1, 1, 1, 1],
  [1, 1, 1, 1],
], IN);
ok('an EDGE-shared mass is ONE enclosed space', edge.count === 1 && edge.groups[0].cells === 8);

/* NOTHING INDOORS. An open lot has no rooms and no ids anywhere. */
const bare = RMS.group([[0, 0], [0, 0]], IN);
ok('an outdoor-only plot has zero rooms and zero ids',
   bare.count === 0 && Array.from(bare.room).every(v => v === 0));

/* THE BBOX step 4 will hide by */
ok('a group reports the bbox the roof reveal needs',
   edge.groups[0].minX === 0 && edge.groups[0].minY === 0 &&
   edge.groups[0].maxX === 3 && edge.groups[0].maxY === 1);

/* ---- 3. the wiring: tileInfo actually carries it ----------------------- */
const src = fs.readFileSync(path.join(ROOT, 'engine', 'bohemia_world.js'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');   // code, never prose
ok('world.js loads the rooms module', /require\(['"]\.\/bohemia_rooms\.js['"]\)/.test(src));
ok('tileInfo carries room and roof', /room:rid/.test(src) && /roof:rid/.test(src));
ok('the plot answers roomAt(x,y) so nothing indexes the array by hand', /roomAt:function/.test(src));

/* ---- 4. THE REAL SWEEP: every registered district ----------------------- */
/*   every building = exactly one room group  AND  no id outdoors            */
const world = W.world(20260731);
const types = W.districtTypes().filter(t => W.isAutoDistrict(t));
ok('there are districts to sweep (' + types.length + ')', types.length > 10);

/* SAMPLE BY TYPE, NOT BY POSITION. Scanning the first N plots in grid order buys
   a lot of the same suburb and misses whole district families -- and the one real
   bug this gate has caught so far (commercial's roomless 'doorway' storefront)
   lives in a type that scan never reached. So: up to PER_TYPE plots of EVERY
   registered district. Costs ~4s and covers the registry instead of a corner. */
const PER_TYPE = 6;
let swept = 0, merged = [], leaked = [], roomless = [];
const seenType = new Map();
sweep:
for (let x = 0; x < 96; x++) {
  for (let y = 0; y < 96; y++) {
    const cell = world.at(x, y);
    if (!cell || !W.isAutoDistrict(cell.district)) continue;
    if ((seenType.get(cell.district) || 0) >= PER_TYPE) continue;
    let p; try { p = world.plot(x, y); } catch (e) { continue; }
    if (!p || !p.rooms || !p.buildings) continue;
    swept++; seenType.set(cell.district, (seenType.get(cell.district) || 0) + 1);

    /* every building's footprint sits in ONE room group */
    for (const b of p.buildings) {
      const ids = new Set();
      for (let yy = b.y; yy < b.y + b.h; yy++)
        for (let xx = b.x; xx < b.x + b.w; xx++) ids.add(p.roomAt(xx, yy));
      ids.delete(0);                       // a footprint rect can clip open ground
      if (ids.size === 0) roomless.push(cell.district + ' b' + b.index);
      else if (ids.size > 1) merged.push(cell.district + ' b' + b.index + ' spans ' + ids.size);
    }

    /* NO ID LEAKS OUTDOORS. This deliberately does NOT mirror the engine's indoor
       predicate -- a gate that re-runs the implementation only proves the code
       equals itself. It asserts the thing he would SEE: open ground that no
       building stands on is never indoors. Street, sidewalk, driveway, lawn. */
    const g = p.block.grid, lg = p.legend;
    const onFoot = {};
    for (const b of p.buildings)
      for (let yy = b.y; yy < b.y + b.h; yy++)
        for (let xx = b.x; xx < b.x + b.w; xx++) onFoot[xx + ',' + yy] = 1;
    for (let yy = 0; yy < p.block.H; yy++) for (let xx = 0; xx < p.block.W; xx++) {
      if (onFoot[xx + ',' + yy]) continue;
      const L = lg[g[yy][xx]];
      const ly = L ? KIT.tileLayer(L) : null;
      const openGround = !!(ly && ly.layer === 'ground' && !ly.solid && !ly.enter);
      if (openGround && p.roomAt(xx, yy) !== 0) {
        leaked.push(cell.district + ' @' + xx + ',' + yy + ' (' + (L ? L.name : '?') + ')');
        yy = p.block.H; break;
      }
    }
  }
}

ok('plots actually swept (' + swept + ' across ' + seenType.size + ' district types)',
   swept >= 100 && seenType.size >= 25);
/* the sweep must reach nearly the whole registry, or a green here means nothing */
const missed = types.filter(t => !seenType.has(t));
ok('the sweep reached ' + seenType.size + '/' + types.length + ' registered district types'
   + (missed.length ? ' (unplaced this seed: ' + missed.slice(0, 6).join(', ') + ')' : ''),
   seenType.size >= types.length - 6);
ok('NO ROOM ID LEAKS OUTDOORS' + (leaked.length ? ': ' + leaked.slice(0, 4).join('; ') : ''),
   leaked.length === 0);
ok('every building is ONE enclosed space, never welded to its neighbour'
   + (merged.length ? ': ' + merged.slice(0, 4).join('; ') : ''), merged.length === 0);
ok('every building HAS a room (' + roomless.length + ' with none)', roomless.length === 0);

/* ---- 5. deterministic, like every other level of the world model -------- */
const a = W.world(4242), b = W.world(4242);
let cmpDone = false, same = true;
for (let x = 0; x < 96 && !cmpDone; x++) for (let y = 0; y < 96; y++) {
  const c = a.at(x, y);
  if (!c || !W.isAutoDistrict(c.district)) continue;
  const pa = a.plot(x, y), pb = b.plot(x, y);
  if (!pa.rooms || !pb.rooms) continue;
  same = pa.rooms.count === pb.rooms.count &&
         String(pa.rooms.room) === String(pb.rooms.room);
  cmpDone = true; break;
}
ok('rooms are deterministic from the seed', cmpDone && same);

/* ---- 6. AND IT IS ALIVE IN A BROWSER ----------------------------------
   VERIFY ON THE REAL SURFACE (7/18). Everything above runs under node, where
   require() always resolves. In the browser these modules are script tags in a
   fixed order, and world.js reads BOH_ROOMS as a bare global -- so if the tag is
   missing, RMS is null, every cell answers room 0, and NOTHING THROWS. That is a
   silent dead feature with a green gate on top of it: the exact shape of this
   session's two worst misses. So the browser gets asked directly. */
(async () => {
  const RUN = path.join(ROOT, 'slices', 'BOHEMIA_RUN_CURRENT.html');
  ok('the built run surface exists', fs.existsSync(RUN));
  let chromium;
  try { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
  catch (e) { ({ chromium } = require('playwright')); }
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('file://' + RUN);
    await SETTLE(page, 2500);
    const probe = await page.evaluate(() => {
      const out = { rooms: typeof BOH_ROOMS !== 'undefined', world: typeof BohemiaWorld !== 'undefined',
                    indoorCells: 0, outdoorCells: 0, wired: false };
      if (!out.rooms || !out.world) return out;
      const w = BohemiaWorld.world(20260731);
      for (let x = 0; x < 40 && out.indoorCells === 0; x++) for (let y = 0; y < 40; y++) {
        const c = w.at(x, y);
        if (!c || !BohemiaWorld.isAutoDistrict(c.district)) continue;
        let p; try { p = w.plot(x, y); } catch (e) { continue; }
        if (!p || typeof p.roomAt !== 'function' || !p.buildings || !p.buildings.length) continue;
        out.wired = true;
        for (let yy = 0; yy < p.block.H; yy++) for (let xx = 0; xx < p.block.W; xx++)
          p.roomAt(xx, yy) ? out.indoorCells++ : out.outdoorCells++;
        if (out.indoorCells) break;
      }
      return out;
    });
    ok('BOH_ROOMS is actually LOADED in the browser (not just require-able)', probe.rooms);
    ok('the plot answers roomAt() in the browser', probe.wired);
    ok('a real plot has indoor cells on the browser surface ('
       + probe.indoorCells + ' in / ' + probe.outdoorCells + ' out)', probe.indoorCells > 0);
    ok('and it is NOT everything (outdoors still exists)', probe.outdoorCells > probe.indoorCells);
  } finally { await browser.close(); }

  console.log('ROOMS GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('ROOMS GATE CRASHED: ' + e.message); process.exit(1); });
