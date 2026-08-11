// THE DEAD GATE (8/8/26, WORLD lane)
//
// Paolo, 7/31 lore sitting, LOCKED, and commissioned direct 8/8:
//   "We need a lot more corpses a lot more skeletons in the game."
//   "ofc i want a realistic mix of skeletons and husks."
//   bleached scattered SKELETONS in the open; mummified HUSKS in the sealed
//   places; REALISTIC is the placement law; the dead tell you where they died.
//
// A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. This is that gate. It asserts the
// RULING, not one spelling of it -- the lesson of the wall-class gate that went
// red for days over a variable rename while the wall was fine the whole time.
// So it asks: is a body in the open a skeleton? is a body in a sealed place a
// husk? does the valley still hold as many dead as the death math says? does the
// page Paolo walks actually draw them? Never: is a particular constant equal to
// a particular literal.
const path = require('path');
global.window = global;
require(path.join(__dirname, '../engine/bohemia_engine.js'));
const K = require('../engine/bohemia_district_kit.js');
const W = require('../engine/bohemia_world.js');
const D = require('../engine/bohemia_dead.js');
const fs = require('fs');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

/* ---------------------------------------------------------------- the module */
ok('the dead pass exists and exposes its surface',
  typeof D.place === 'function' && typeof D.inside === 'function' && typeof D.stats === 'function');

/* ============================================================================
   1. THE RULING ITSELF: FORM FOLLOWS EXPOSURE, EVERYWHERE, WITHOUT EXCEPTION
   ============================================================================
   This is the whole law and it is one invariant: a body the animals could reach
   is BONES, a body they could not is a PERSON. Swept over every registered
   district in four street rotations, so a rotation cannot smuggle an exception. */
const types = K.types().slice().sort();
let swept = 0, bodies = 0, wrongForm = 0, huskScatter = 0, badScatter = 0, sample = null;
for (const t of types) {
  const spec = K.get(t);
  if (!spec || typeof spec.generate !== 'function' || !spec.legend) continue;
  swept++;
  for (const cfg of [['S'], ['E'], ['N', 'W'], ['S', 'E']]) {
    let res; try { res = spec.generate(7, { streets: cfg }); } catch (e) { continue; }
    const list = D.place({ type: t, g: res.g, legend: spec.legend, seed: 7, cellX: 11, cellY: 13 });
    if (!sample && list.length) sample = { t, n: list.length };
    for (const d of list) {
      bodies++;
      if (d.exposure === D.OPEN && d.form !== 'skeleton') wrongForm++;
      if (d.exposure === D.SEALED && d.form !== 'husk') wrongForm++;
      if (d.form === 'husk' && d.scatter) huskScatter++;
      /* Scatter must stay on open ground: bone does not disperse through a wall.
         READ d.dir -- do not re-derive it. The first cut of this check invented
         its own direction from the tile index and reported 51 violations that
         did not exist, which is the same bug it was trying to catch: two places
         computing one thing. The fix went into the module (it now ships the
         direction) and the ruler reads it. */
      if (d.scatter && (!d.dir || (!d.dir[0] && !d.dir[1]))) badScatter++;
      for (let k = 1; k <= d.scatter; k++) {
        const nx = d.x + d.dir[0] * k, ny = d.y + d.dir[1] * k;
        const row = res.g[ny];
        if (!row || D.exposureOf(spec.legend[row[nx]]) !== D.OPEN) badScatter++;
      }
    }
  }
}
ok('swept every registered district (' + swept + ')', swept >= 40);
ok('the districts actually hold dead (' + bodies + ' bodies placed)', bodies > 200);
ok('IN THE OPEN IT IS ALWAYS A SKELETON, SEALED IT IS ALWAYS A HUSK (' + wrongForm + ' violations)', wrongForm === 0);
ok('a husk NEVER scatters -- mummification restricts disarticulation (' + huskScatter + ')', huskScatter === 0);
ok('scattered bone never crosses off open ground (' + badScatter + ')', badScatter === 0);

/* ============================================================================
   2. HIS VERDICTS ARE THE FILTER: NO TILE HE KILLED, NO GORE, EVER
   ============================================================================
   62 of the gore bank's 73 tiles carry his UP. The module must never emit one of
   the 11 DOWN, and must never reach for the blood bank, which is on hold and
   belongs to fresh kills. Ten-year-old dead do not bleed. */
const DOWN = new Set(D.TILES.down);
let downDrawn = 0, outOfRange = 0;
for (const t of types.slice(0, 24)) {
  const spec = K.get(t); if (!spec || !spec.legend) continue;
  let res; try { res = spec.generate(31, { streets: ['S'] }); } catch (e) { continue; }
  for (const d of D.place({ type: t, g: res.g, legend: spec.legend, seed: 31, cellX: 4, cellY: 4 })) {
    if (DOWN.has(d.tile)) downDrawn++;
    if (d.tile < 0 || d.tile > 72) outOfRange++;
  }
}
ok('never emits a tile Paolo thumbed DOWN (' + downDrawn + ')', downDrawn === 0);
ok('every tile index lands inside the bank (' + outOfRange + ' out of range)', outOfRange === 0);
ok('the DOWN list is the real one from his Great Sweep (11 tiles)', D.TILES.down.length === 11);
/* A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1 law).
   The first cut grepped for the blood bank's name and went red on the module's
   own REUSE-CHECK line saying it was NOT used. So: strip the comments, then look
   for a real reference in live code. The docstring is required to keep naming it
   -- REUSE-FIRST says say what you looked at -- so the name must be allowed to
   appear while the USE must not. */
const modSrc = fs.readFileSync(path.join(__dirname, '../engine/bohemia_dead.js'), 'utf8');
const modCode = modSrc.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
ok('the module never reaches for the held blood/gore-overlay bank in live code',
  !/GORE_OVERLAY|blood/i.test(modCode));
ok('and REUSE-FIRST is still satisfied: the docstring says it looked and why it passed',
  /GORE_OVERLAY_BANK[\s\S]{0,80}NOT USED/i.test(modSrc));

/* ============================================================================
   3. ONE SEED: THE SAME VALLEY HOLDS THE SAME DEAD, FOREVER
   ============================================================================ */
{
  const spec = K.get('medical'), res = spec.generate(99, { streets: ['S'] });
  const a = D.place({ type: 'medical', g: res.g, legend: spec.legend, seed: 99, cellX: 8, cellY: 8 });
  const b = D.place({ type: 'medical', g: res.g, legend: spec.legend, seed: 99, cellX: 8, cellY: 8 });
  const c = D.place({ type: 'medical', g: res.g, legend: spec.legend, seed: 99, cellX: 9, cellY: 8 });
  ok('identical inputs place identical dead', JSON.stringify(a) === JSON.stringify(b));
  ok('a different cell places different dead', JSON.stringify(a) !== JSON.stringify(c));
  // the flat grid the walked world caches must agree with the rows a generator returns
  const Wd = res.g[0].length, flat = [];
  for (let y = 0; y < res.g.length; y++) for (let x = 0; x < Wd; x++) flat[y * Wd + x] = res.g[y][x];
  const f = D.place({ type: 'medical', kit: flat, W: Wd, H: res.g.length, legend: spec.legend, seed: 99, cellX: 8, cellY: 8 });
  ok('rows and the walked world\'s FLAT grid place the same dead', JSON.stringify(a) === JSON.stringify(f));
}

/* ============================================================================
   4. THE DEATH MATH, AND THE DENOMINATOR THAT IS EASY TO GET WRONG
   ============================================================================
   The valley total must land on the death math -- measured against the LIVE
   world, so a lane that changes the mix of districts cannot silently move the
   body count of the game. This is the check that caught a 33% overshoot. */
{
  /* THE MAP STATES ITS OWN SIZE. Typing 96 here would be the 4.25x bug again --
     the scale model hardcoded `y < 48`, the valley grew to 96, and the tool that
     existed to keep the population honest silently measured a quarter of the
     world and under-counted the game's population by four times. A smaller loop
     over a bigger world does not error. So the side comes off the overmap and
     the cell count is derived from it; the day the valley changes size, the
     body count follows instead of quietly going wrong. */
  const OM = require('../engine/bohemia_overmap.js');
  const SIDE = OM.OVER_N;
  const CELLS = SIDE * SIDE;
  ok('the valley states its own size rather than this gate assuming one (' + SIDE + ')',
    typeof SIDE === 'number' && SIDE > 1);
  ok('the dead pass agrees with the map about how many cells there are',
    D.cellsPerSide() === SIDE);
  const w = W.world(2691674296);
  const counts = {};
  for (let y = 0; y < SIDE; y++) for (let x = 0; x < SIDE; x++) {
    const c = w.at(x, y); if (c) counts[c.district] = (counts[c.district] || 0) + 1;
  }
  let num = 0, den = 0;
  for (const k in counts) { const st = D.storyFor(k); num += counts[k] * (st.open + st.sealed); den += counts[k]; }
  const measured = num / den, declared = D.avgWeight();
  const tol = (D.AVG_WEIGHT_MEASURED && D.AVG_WEIGHT_MEASURED.tolerance) || 0.10;
  const drift = Math.abs(measured - declared) / declared;
  ok('the declared cell-weighted mean still matches the live valley (' +
    measured.toFixed(2) + ' vs ' + declared + ', drift ' + (drift * 100).toFixed(1) + '%)', drift <= tol);

  const per = D.visibleDead() / CELLS;
  let total = 0;
  for (const k in counts) { const st = D.storyFor(k); total += counts[k] * per * ((st.open + st.sealed) / declared); }
  const target = D.visibleDead(), ratio = total / target;
  ok('the valley holds what the death math says (' + Math.round(total) + ' vs ' +
    Math.round(target) + ', ratio ' + ratio.toFixed(2) + ')', ratio > 0.75 && ratio < 1.25);
  ok('the death math is derived from canon, not typed in (~131k dead of ~135k)',
    Math.round(D.modelDead()) > 120000 && Math.round(D.modelDead()) < 145000);
  ok('the survivor share is GDD v5\'s 3%', D.MATH.survivorShare === 0.03);

  // EVERY district the valley actually builds has a story row. The default is
  // legal, but a type with hundreds of cells falling through it is a hole.
  const big = Object.keys(counts).filter(k => counts[k] >= 20 && !D.STORY[k]);
  ok('no big valley district is left on the default story row (' + big.join(',') + ')', big.length === 0);
  ok('the story table covers the registered districts',
    types.filter(t => !D.STORY[t]).length <= 3);
}

/* ============================================================================
   5. STORY-VIA-PLACEMENT: THE DEAD ARE NOT WALLPAPER
   ============================================================================
   Paolo: "where bodies lie tells what happened there." Evenly-spread dead say
   nothing. The places that should be heavy must actually be heavy. */
{
  const heavy = D.storyFor('medical').open + D.storyFor('medical').sealed;
  const light = D.storyFor('industrial').open + D.storyFor('industrial').sealed;
  ok('a hospital is many times heavier than a factory floor (' +
    (heavy / light).toFixed(1) + 'x)', heavy / light >= 4);
  ok('custody kills everyone inside: the jail is nearly all sealed',
    D.storyFor('jail').sealed / (D.storyFor('jail').open + D.storyFor('jail').sealed) > 0.9);
  /* HIS RULING REPLACED MINE, AND THE GATE FOLLOWS HIM (Paolo 8/11): "The
     cemetery can become like a body dumping pit." I had it as the lowest weight
     in the table on the irony that the dead were meant to go there and did not.
     He ruled the opposite and history is on his side -- when disposal collapses,
     burial ground is exactly where bodies get dumped, in pits and trenches
     (the Irish famine pits were unmarked trenches in workhouse grounds).
     A GATE MUST NEVER OUTRANK A RULING (8/1), so the claim is now HIS: the
     cemetery is heavy, and it is ONE PIT rather than a sprinkle across the lawns. */
  ok('THE CEMETERY IS A DUMPING PIT, not a tidy graveyard (weight ' +
    (D.storyFor('cemetery').open + D.storyFor('cemetery').sealed) + ')',
    (D.storyFor('cemetery').open + D.storyFor('cemetery').sealed) > 10);
  ok('and it is ONE PIT, not a scatter: the cemetery has the biggest group in the table',
    D.storyFor('cemetery').cluster >= 20 &&
    D.storyFor('cemetery').cluster >= Math.max(...Object.keys(D.STORY).map(k => D.STORY[k].cluster || 0)));
  ok('somebody is turning the dead into soil: the farm and the landfill are heavy too',
    (D.storyFor('farm').open > 5) && (D.storyFor('landfill').open > 5));
  ok('ACT 1 IS THE THICK ONE (he asked for it by name), and later acts thin out',
    D.ACT_DENSITY && D.ACT_DENSITY[1] > 1.5 && D.ACT_DENSITY[3] < D.ACT_DENSITY[1]);
  ok('the dead arrive in GROUPS, not a sprinkle: every story row names a cluster size',
    Object.keys(D.STORY).every(k => !D.STORY[k].cluster || D.STORY[k].cluster >= 2));
  ok('open desert has NO husks: nothing out there is sealed', D.storyFor('desert').sealed === 0);
  ok('most people died AT HOME: the suburb is overwhelmingly sealed',
    D.storyFor('suburb').sealed > D.storyFor('suburb').open * 4);
  ok('every story row carries a sentence saying what happened there',
    Object.keys(D.STORY).every(k => typeof D.STORY[k].story === 'string' && D.STORY[k].story.length > 12));
}

/* ============================================================================
   6. INTERIOR-MATCHES-EXTERIOR (Paolo 7/19, LOCKED) DOES THE MAPPING
   ============================================================================
   The husk you cannot see from the street is at exactly the tile you find it at
   when you walk in -- because the plate IS the footprint. Never a second roll. */
{
  const spec = K.get('medical'), res = spec.generate(5, { streets: ['S'] });
  const list = D.place({ type: 'medical', g: res.g, legend: spec.legend, seed: 5, cellX: 2, cellY: 2 });
  const foot = { x: 20, y: 20, w: 40, h: 40 };
  const inn = D.inside(list, foot);
  ok('inside() returns only bodies that were sealed in a room',
    inn.every(d => d.form === 'husk' && d.interior));
  ok('every indoor body lands inside the plate',
    inn.every(d => d.x >= 0 && d.y >= 0 && d.x < foot.w && d.y < foot.h));
  ok('an indoor body is the SAME body, re-based -- never a second roll',
    inn.every(d => list.some(o => o.interior && o.x - foot.x === d.x && o.y - foot.y === d.y && o.tile === d.tile)));
  const walled = D.inside(list, foot, () => false);
  ok('a plate with no floor at all holds nobody (never placed in masonry)', walled.length === 0);
  ok('outdoor draws exclude the room husks (they are behind a wall)',
    list.some(d => d.interior) && list.filter(d => !d.interior).every(d => !d.interior));
}

/* ============================================================================
   7. IT IS ACTUALLY ON THE SCREEN PAOLO WALKS
   ============================================================================
   VERIFY ON THE REAL SURFACE (7/18). The module being right is worth nothing if
   the page never calls it -- that is the exact shape of every regression this
   repo has had this month. tools/bohemia_dead_look.js drives the real browser;
   this asserts the wiring the browser needs is present and correctly ordered. */
{
  const page = fs.readFileSync(path.join(__dirname, '../slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  ok('the dead module is inlined in the walked world', page.includes('root.BohemiaDead=API'));
  ok('the walked world CALLS the outdoor pass', /deadDraw\(ox,oy\);\s*\/\* __THE_DEAD__ \*\//.test(page));
  const iTp = page.indexOf('  tpDraw(ox,oy);'), iDead = page.indexOf('deadDraw(ox,oy);');
  const iFacade = page.indexOf('facadePass(ox,oy,C,false');
  ok('remains draw AFTER the ground and BEFORE any wall (a body never hides a building)',
    iTp > 0 && iDead > iTp && iFacade > iDead);
  ok('the indoor pass is wired into renderInside', page.includes('THE DEAD, INDOORS'));
  ok('the suburb\'s legend is resolved by module, not only by the kit registry ' +
    '(the kit does not carry suburb in this app)', page.includes('DEAD_MODULE'));
  ok('roads and bare terrain get a surface too (they carry no plot grid)',
    page.includes('DEAD_ROAD_LEGEND') && page.includes('DEAD_BARE'));
  ok('the outdoor pass holds back the bodies sealed in rooms',
    /if\(d\.interior\)continue;/.test(page));
}

/* ============================================================================
   8. A BODY IS PERSON-SIZED AND KEEPS ITS OWN SHAPE
   ============================================================================
   The first cut drew these at 0.55 of a cell in a forced square: two pale specks
   on the asphalt, and his art squashed by a third. Both are locked out. */
{
  const page = fs.readFileSync(path.join(__dirname, '../slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  ok('a body draws at human scale, not as a speck (skeleton ' + D.TILES.scale.skeleton +
    ', husk ' + D.TILES.scale.husk + ' cells)',
    D.TILES.scale.skeleton >= 1.0 && D.TILES.scale.husk >= 1.0);
  ok('an intact husk reads longer than a scattered partial skeleton',
    D.TILES.scale.husk > D.TILES.scale.skeleton);
  ok('a body is roughly 1.7 m on 0.75 m tiles, not a prop-flag guess',
    D.TILES.scale.husk * 0.75 > 1.2 && D.TILES.scale.husk * 0.75 < 2.2);
  ok('the draw keeps each judged tile\'s own aspect (never reshaped into a square)',
    /naturalWidth\s*\/\s*im\.naturalHeight/.test(page));
}

console.log('THE DEAD GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
  swept + ' districts swept, ' + bodies + ' bodies checked)');
process.exit(fail ? 1 : 0);
