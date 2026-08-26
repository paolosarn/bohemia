const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* THE WALKED SURFACE GATE (8/18/26, WORLD lane).
 *
 * FOUR TIMES IN ONE DAY the same bug: a district's engine module is finished, gated and
 * dossiered, and the surface Paolo actually walks draws something else.
 *   1. THE STRIP        resort/strip/casino had no module at all -- 204 cells of flat box.
 *   2. EIGHTEEN TYPES   utility x12, airfield x2, campus, speedway, town, ballpark had a
 *                       module the page did not CARRY -- 165 cells.
 *   3. THE ROADS        arterial/freeway had a module the page carried and IGNORED for its
 *                       own four-number XSEC table -- 3,386 cells at 8.6% and 17.9% drawn.
 *   4. THE TERRAIN      desert/mountain/water/wash/rail, same -- 1,771 cells at ONE OR TWO
 *                       COLOURS while their modules build cliff bands, creosote grids, the
 *                       lake's bathtub ring and a lined flood channel.
 *
 * EVERY GATE IN THIS REPO THAT READS engine/ WAS GREEN THROUGH ALL FOUR. That is the whole
 * point: a checker that reads the SOURCE cannot see a page that does not read the source.
 * A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, so this is the machine -- and it is the
 * only gate here that opens the real alpha, walks to RUN, and asks THE PAGE.
 *
 * WHAT IT ASKS, per district type, off three cells spread across that type's own footprint
 * (the first cell found is always a valley EDGE cell, and edges are not typical -- sampling
 * one of them is how the first version of this sweep got suburb and desert wrong):
 *   - WHICH PATH drew it: the district kit, the suburb generator, or a FALLBACK.
 *   - HOW MANY DISTINCT SURFACES came back. A cell drawn in two colours is a painted
 *     rectangle whatever its module contains.
 *
 * THE DEBT IS NAMED AND MAY ONLY SHRINK. Nothing joins it without a reason written beside
 * it, and a type that gets fixed and stays on the list fails too -- a stale debt entry is
 * how a list like this quietly stops meaning anything.
 */
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = path.dirname(__dirname);

const MIN_COLOURS = 5;          // below this a cell is a painted rectangle, not a place

/* NO MODULE AT ALL, and named rather than quietly waved through. */
const NO_MODULE_DEBT = {
  // BUILDABLE: EMPTY, 8/19. The five that were here -- convention, prison, dam, minigp,
  // fort -- are built (engine/bohemia_landmarks.js), so they came OFF this list rather than
  // sitting on it green, which is what the ratchet below exists to force.
  // IDENTITY, and therefore NOT MINE (MECHANISM-MINE / CONTENTS-PAOLO'S). Every one of
  // these is a NAMED, REAL Las Vegas landmark, and what each one IS in Bohemia -- who holds
  // it, what it became -- is Paolo's ruling. Building them before he rules would be
  // inventing canon he reserved. [PENDING Paolo]
  sphere:     '[PENDING Paolo] IDENTITY. 4 cells.',
  luxor:      '[PENDING Paolo] IDENTITY. 1 cell.',
  strat:      '[PENDING Paolo] IDENTITY. 1 cell.',
  sign:       '[PENDING Paolo] IDENTITY -- the Welcome sign. 1 cell.',
  highroller: '[PENDING Paolo] IDENTITY. 1 cell.',
  springs:    '[PENDING Paolo] IDENTITY. 1 cell.',
};

/* HAS A MODULE, still not routed through it, WITH THE MEASUREMENT THAT SAYS WHY NOT. */
/* HAS A MODULE, still not routed through it, WITH THE MEASUREMENT THAT SAYS WHY NOT.
   EMPTY, 8/19. The interchange was the last entry: it was here because routed with only
   BOUNDS it came back WORSE than the table it replaced -- 8,843 bare tiles and THREE tiles
   of road against 20% drawn -- and it came OFF when it got what it was actually missing,
   which was its APPROACHES (which columns have a highway arriving, which rows do). 20.1%
   -> 69.9% drawn, 10 surfaces. Every road in the valley is now drawn by its own module.
   The ratchet below is what forced it off rather than letting it sit here green. */
const NOT_ROUTED_DEBT = {
};

let pass = 0; const fails = [];
const ok = (n, c) => { if (c) pass++; else fails.push(n); };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  await page.goto('file://' + path.resolve(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'),
    { waitUntil: 'load', timeout: 240000 });
  await SETTLE(page, 5000);
  const _runTab = await page.evaluate(() => {
    const f = document.querySelector('#front, #fronttap'); if (f) f.click();
    /* NEVER SWALLOW A MISSING TAB (ONE WORLD TAB): `if (t) t.click()` reports
       GREEN when the tab is gone, which is how gates read green for weeks. */
    const t = [...document.querySelectorAll('.tab')].find(e => /RUN/i.test(e.textContent || ''));
    if (!t) return false;
    t.click(); return true;
  });
  ok('the RUN tab exists in the alpha and was tapped', _runTab === true);
  await SETTLE(page, 16000);
  const fr = page.frames().find(f => /CITY_WORLD/.test(f.url()));
  ok('the alpha opens the world on the RUN tab', !!fr);
  if (!fr) return report(browser);
  ok('the walked surface loads with NO page error', errs.length === 0);
  if (errs.length) errs.slice(0, 3).forEach(e => console.log('        ! ' + e));

  const rows = await fr.evaluate(() => {
    const cells = {};
    /* THE VALLEY SAYS HOW BIG IT IS -- and INSIDE the page that is `om`, not the
       node-side world handle. The first cut of this reached for `world` here and
       crashed with ReferenceError, because this loop runs in the BROWSER. */
    for (let y = 0, _N = (typeof om !== 'undefined' && om.n) ? om.n : 96; y < _N; y++)
      for (let x = 0; x < _N; x++) {
      const c = om.at(x, y); if (!c) continue;
      (cells[c.district] = cells[c.district] || []).push([x, y]);
    }
    const out = [];
    for (const d of Object.keys(cells)) {
      const all = cells[d];
      const pick = [all[0], all[Math.floor(all.length / 2)], all[all.length - 1]]
        .filter((v, i, a) => a.indexOf(v) === i);
      const hist = {}; const paths = new Set();
      for (const [cx, cy] of pick) {
        let m = null; try { m = tileMeta(cx, cy); } catch (e) { continue; }
        paths.add(m.kit ? 'kit' : m.sub ? 'sub' : m.road ? 'road' : m.open ? 'open' : 'FALLBACK');
        for (let ly = 0; ly < 128; ly += 3) for (let lx = 0; lx < 128; lx += 3) {
          let c = null; try { c = realizeCell(cx * 128 + lx, cy * 128 + ly); } catch (e) { }
          if (!c) continue;
          const k = c.s || c.g || 'none'; hist[k] = (hist[k] || 0) + 1;
        }
      }
      out.push({ d, n: all.length, paths: [...paths],
                 colours: Object.keys(hist).length });
    }
    return out.sort((a, b) => b.n - a.n);
  });

  ok('every district type in the valley was reached and measured', rows.length > 50);

  const fellBack = rows.filter(r => r.paths.includes('FALLBACK'));
  const unnamedFallback = fellBack.filter(r => !NO_MODULE_DEBT[r.d]);
  ok('NO DISTRICT FALLS BACK TO THE PLACEHOLDER WITHOUT BEING NAMED'
     + (unnamedFallback.length ? ' -> ' + unnamedFallback.map(r => r.d + ' (' + r.n + ' cells)').join(', ') : ''),
     unnamedFallback.length === 0);

  const thin = rows.filter(r => r.colours < MIN_COLOURS);
  const unnamedThin = thin.filter(r => !NO_MODULE_DEBT[r.d] && !NOT_ROUTED_DEBT[r.d]);
  ok('NO DISTRICT IS DRAWN IN FEWER THAN ' + MIN_COLOURS + ' SURFACES WITHOUT BEING NAMED'
     + (unnamedThin.length ? ' -> ' + unnamedThin.map(r => r.d + ' (' + r.colours + ' colours, ' + r.n + ' cells)').join(', ') : ''),
     unnamedThin.length === 0);

  /* THE RATCHET, both ways. A debt entry that has been fixed must come OFF the list, or
     the list stops describing the build and starts decorating it. */
  const byName = {}; rows.forEach(r => { byName[r.d] = r; });
  const staleNoModule = Object.keys(NO_MODULE_DEBT)
    .filter(d => byName[d] && !byName[d].paths.includes('FALLBACK'));
  ok('THE NO-MODULE DEBT ONLY SHRINKS: nothing on it is already building'
     + (staleNoModule.length ? ' -> ' + staleNoModule.join(', ') : ''), staleNoModule.length === 0);
  const staleRouted = Object.keys(NOT_ROUTED_DEBT)
    .filter(d => byName[d] && byName[d].colours >= MIN_COLOURS && byName[d].paths.includes('kit'));
  ok('THE NOT-ROUTED DEBT ONLY SHRINKS' + (staleRouted.length ? ' -> ' + staleRouted.join(', ') : ''),
     staleRouted.length === 0);

  /* EVERY DEBT ENTRY CARRIES A REASON, because a bare list of names teaches the next
     session nothing and is indistinguishable from a list of things nobody looked at. */
  const noReason = [...Object.entries(NO_MODULE_DEBT), ...Object.entries(NOT_ROUTED_DEBT)]
    .filter(([, why]) => !why || why.length < 25).map(([d]) => d);
  ok('every named debt carries a written reason' + (noReason.length ? ' -> ' + noReason.join(', ') : ''),
     noReason.length === 0);

  /* CAN YOU ACTUALLY GET ANYWHERE? Paolo 8/1, LOCKED: "the streets have to touch the
     streets bro... make sure I cant be locked in any certain district ever again."
     NOTHING HAS EVER ASKED THE WALKED SURFACE THIS, and on 8/19 the answer was THREE CELLS
     OF 9,216. bohemia_arterial.js's band table ended `if (b <= ROW) return 8` -- the block
     wall -- and with WALK = SET = 63 and ROW = 64 that is EXACTLY ONE COLUMN: the west edge
     of every arterial cell, a one-tile wall 128 tiles tall down all 2,434 of them. You could
     not cross a street westward anywhere in the game.
     IT WAS INVISIBLE FOR EIGHT DAYS because the walked surface drew streets from its own
     four-number table until 8/18; routing them through their real module is what made the
     bug reachable, and this check is what found it. 3 cells -> 7,616 (82.6%).
     THE FLOOR ONLY RISES. Mountain, freeway and walled subdivisions are legitimately not
     walkable, so this is not 100% and should not be -- but it may never fall.
     RAISED 75 -> 90 ON 8/22, and this is the whole point of saying "only rises" out loud:
     the number sat at 75 while the surface measured 82.6, so an eight-point regression
     could have landed green. It measures 93.1% now that the LANDLOCK RELAY is wired into
     the two generator call sites (+970 cells, 357 stranded pockets drained), and 90 is
     that result with a little headroom for another lane moving a district. Paolo 8/1:
     "make sure I cant be locked in any certain district ever again it's so fucking
     creepy." A floor below the measurement is not a ratchet, it is a decoration. */
  const REACH_FLOOR = 90;
  const reach = await fr.evaluate(() => {
    const FN = 128, N = 96;
    const walkAt = (gx, gy) => { let c = null; try { c = realizeCell(gx, gy); } catch (e) { return false; }
      return !!(c && c.walk !== false); };
    /* EVERY TILE, NOT EVERY OTHER ONE (8/22). This swept `i += 2` and so only ever looked
       at EVEN offsets along a shared boundary. A suburb's street-facing edge has SEVEN
       walkable tiles out of 128 -- that is the driveway, the one gap in the block -- and
       whether those seven land on even indices is luck. MEASURED: cells 16,30 · 91,30 and
       58,70 each share exactly ONE walkable tile with the arterial they front, at index 67,
       61 and 67. All three odd. All three reported UNREACHABLE by this gate and all three
       walkable in the actual game.
       A sampler that steps over half the boundary cannot see a one-tile crossing, and a
       one-tile crossing is what a driveway IS. Stride 1. It costs a little time on the
       pairs that genuinely do not connect (the ones that do still return on first hit) and
       it buys a number that means what it says. FIX THE RULER, NEVER THE TARGET. */
    const crossable = (ax, ay, bx, by) => {
      if (ax === bx) { const y = (by > ay) ? (ay * FN + FN - 1) : (ay * FN);
        const y2 = (by > ay) ? (by * FN) : (by * FN + FN - 1);
        for (let i = 0; i < FN; i++) if (walkAt(ax * FN + i, y) && walkAt(ax * FN + i, y2)) return true;
        return false; }
      const x = (bx > ax) ? (ax * FN + FN - 1) : (ax * FN);
      const x2 = (bx > ax) ? (bx * FN) : (bx * FN + FN - 1);
      for (let i = 0; i < FN; i++) if (walkAt(x, ay * FN + i) && walkAt(x2, ay * FN + i)) return true;
      return false; };
    const sx = Math.max(0, Math.min(N - 1, (hx / FN) | 0)), sy = Math.max(0, Math.min(N - 1, (hy / FN) | 0));
    const seen = new Set([sx + ',' + sy]); const q = [[sx, sy]]; let h = 0;
    const D = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (h < q.length) { const [cx, cy] = q[h++];
      for (const [dx, dy] of D) { const nx = cx + dx, ny = cy + dy, k = nx + ',' + ny;
        if (nx < 0 || ny < 0 || nx >= N || ny >= N || seen.has(k)) continue;
        if (!crossable(cx, cy, nx, ny)) continue;
        seen.add(k); q.push([nx, ny]); } }
    return { pct: +(100 * seen.size / (N * N)).toFixed(1), cells: seen.size };
  });
  /* THE RECEIPTS FROM __kitBlock's CATCH (8/22). That catch is non-fatal on purpose -- one
     district's generator throwing must not take the valley down -- which is exactly why it
     spent 8/21 reporting a bare ReferenceError as a believable "86.8% drawn by their own
     module". It records the reason now, and this prints it, so a swallowed wiring bug is a
     line on screen instead of a number with a trade-off shape. A ReferenceError or a
     TypeError in that block is ALWAYS a wiring bug in the page, never a district's data. */
  const kitfail = await fr.evaluate(() => window.__KITFAIL || {});
  const kfk = Object.keys(kitfail);
  if (kfk.length) kfk.slice(0, 8).forEach(d => console.log('        ! kit generate threw for ' + d + ': ' + kitfail[d]));
  ok('NO DISTRICT\'S GENERATOR THREW ON THE PAGE: __kitBlock\'s catch caught nothing, so no '
     + 'cell is falling back to a painted rectangle for a reason nobody can see'
     + (kfk.length ? '  -- threw: ' + kfk.join(', ') : ''), kfk.length === 0);
  ok('YOU CAN WALK OUT OF WHERE YOU SPAWN: at least ' + REACH_FLOOR + '% of the valley is '
     + 'reachable on foot from the player start (measured ' + reach.pct + '%, ' + reach.cells + ' cells)',
     reach.pct >= REACH_FLOOR);
  console.log('  reachable on foot from spawn: ' + reach.cells + ' cells (' + reach.pct + '%)');

  /* A LINEAR DISTRICT RUNS THROUGH A CELL, AND THIS ASKS THE PAGE, NOT THE MODULE (8/25).
     The wash was fixed in engine/bohemia_wash.js, wired in engine/bohemia_world.js, gated,
     mutation-tested, and every one of those was green while the game still drew 60 separate
     channels -- because THIS PAGE DOES NOT CARRY world.js. It keeps its own district
     dispatch, its own comment has said so since 8/21, and wash is filed TERRAIN so it is
     served by a branch that had never heard of any of it.
     A module gate cannot see that. Only asking the surface can, so it is asked here, where a
     page is already booted. THE TEST IS THE TUNNEL MOUTHS: a channel goes underground where
     it ENDS, so the count should track the number of ENDS, never the number of cells. 60 of
     60 was the bug; 21 of 60 is 18 ends plus 3 lone cells, which is the whole answer in one
     number. Mutation-tested by stopping the page passing neighbours: 21 -> 60. */
  const wash = await fr.evaluate(() => {
    const N = OM.OVER_N, W = 128;
    const isW = (x, y) => { const c = om.at(x, y); return !!(c && c.district === 'wash'); };
    let cells = 0, ends = 0, mouths = 0;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      if (!isW(x, y)) continue;
      cells++;
      const deg = (isW(x, y - 1) ? 1 : 0) + (isW(x, y + 1) ? 1 : 0) + (isW(x + 1, y) ? 1 : 0) + (isW(x - 1, y) ? 1 : 0);
      if (deg <= 1) ends++;
      const m = (typeof tileMeta === 'function') ? tileMeta(x, y) : null;
      const g = m && m.kit;                    // a FLAT Uint16Array, not rows -- g[r][c] is undefined
      if (!g || g.length !== W * W) continue;
      for (let i = 0; i < g.length; i++) if (g[i] === 8) { mouths++; break; }
    }
    return { cells, ends, mouths };
  });
  /* EVERY CLUSTER DISTRICT, ON THE PAGE, IN ONE SWEEP (8/26). The wash and the railyard each
     got their own check here after each was fixed in the model, gated green, and still drawn
     wrong in the game -- world.js is not on this page, and the page's copy of every engine
     module is its own. Three more landed the same day (stadium, landfill, cemetery), so the
     bespoke checks stop here and this asks the question of ALL of them at once.
     THE QUESTION IS THE SAME ONE THE MODEL GATE ASKS, put to the surface: a facility does not
     multiply when you give it more ground. Count the connected runs of each district's own
     BUILDING MASS across its blob. One stadium bowl is one run however many cells it spans;
     four bowls are four. Anything that scales with the cell count is a page that did not get
     the fix. */
  const blobs = await fr.evaluate(() => {
    const N = OM.OVER_N, W = 128;
    const at = (x, y) => { const c = om.at(x, y); return c ? c.district : null; };
    const seen = new Set(), out = [];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const d = at(x, y); if (!d) continue;
      const k = x + ',' + y; if (seen.has(k)) continue;
      const cells = [], st = [[x, y]]; seen.add(k);
      while (st.length && cells.length < 64) {
        const c = st.pop(); cells.push(c);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = c[0] + dx, ny = c[1] + dy, k2 = nx + ',' + ny;
          if (seen.has(k2) || at(nx, ny) !== d) continue;
          seen.add(k2); st.push([nx, ny]);
        }
      }
      if (cells.length < 2 || cells.length > 12) continue;
      const spec = (typeof BohemiaDistrictKit !== 'undefined') ? BohemiaDistrictKit.get(d) : null;
      if (!spec || typeof spec.body !== 'function') continue;
      const xs = cells.map(c => c[0]), ys = cells.map(c => c[1]);
      const bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys), by1 = Math.max(...ys);
      const bw = (bx1 - bx0 + 1) * W, bh = (by1 - by0 + 1) * W;
      const big = new Int16Array(bw * bh).fill(-1);
      let built = 0;
      for (const [cx, cy] of cells) {
        const m = (typeof tileMeta === 'function') ? tileMeta(cx, cy) : null;
        const g = m && m.kit;                 // FLAT Uint16Array, not rows
        if (!g || g.length !== W * W) continue;
        built++;
        for (let ly = 0; ly < W; ly++) for (let lx = 0; lx < W; lx++)
          big[((cy - by0) * W + ly) * bw + ((cx - bx0) * W + lx)] = g[ly * W + lx];
      }
      if (built !== cells.length) continue;
      const mark = new Uint8Array(bw * bh);
      let runs = 0;
      for (let i = 0; i < big.length; i++) {
        if (mark[i] || big[i] < 0 || !spec.body(big[i])) continue;
        runs++;
        const st2 = [i]; mark[i] = 1;
        while (st2.length) {
          const p = st2.pop(), px = p % bw, py = (p / bw) | 0;
          const nb = [px + 1 < bw ? p + 1 : -1, px > 0 ? p - 1 : -1,
                      py + 1 < bh ? p + bw : -1, py > 0 ? p - bw : -1];
          for (const q of nb) { if (q < 0 || mark[q] || big[q] < 0 || !spec.body(big[q])) continue; mark[q] = 1; st2.push(q); }
        }
      }
      out.push({ d, n: cells.length, runs });
    }
    return out;
  });
  /* AND IT IS THE CLUSTER DISTRICTS ONLY, WITH A NUMBER EACH, which is a narrower claim than
     the first cut and a true one. Swept across everything it flagged a hundred blobs -- and
     every one of them was right to have what it had. A COMMERCIAL strip is twenty-four
     separate stores per cell BY DESIGN; a TOWN is three hundred houses; a FARM has five barns.
     "One facility per blob" is not a fact about districts, it is a fact about the handful
     that ARE one facility, and a rule that fires on the rest is noise a reader learns to
     scroll past.
     THE GENERAL VERSION OF THIS CHECK LIVES IN gates/one_district_per_blob_gate.js, where it
     can build each blob BOTH ways and compare -- which is the honest way to ask it and is not
     available here, because this side only has what the page drew. So what this asks is the
     narrow, decisive thing: the numbers the model gate measured, seen on the page. Each is
     mutation-tested by breaking the page's wiring and watching it multiply. */
  const EXPECT = {
    stadium:  { max: 2,  why: 'ONE bowl. Four cells built four.' },
    landfill: { max: 3,  why: 'ONE scale house and ONE gas plant. Four cells built four of each.' },
    /* 7 and not 8: measured 6 as one ground and 8 built per cell, so 8 would sit exactly
       on the wrong side of the defect and let it through. A ceiling that does not fail the bug
       it was written for is decoration. */
    cemetery: { max: 7,  why: 'ONE chapel, ONE office and a row of mausolea. Four cells built four sets.' },
    railyard: { max: 3,  why: 'ONE engine shed and ONE office. Six cells built six of each.' },
    solar:    { max: 4,  why: 'ONE control building per plant, not per cell.' },
  };
  const watched = blobs.filter(b => EXPECT[b.d]);
  const scaled = watched.filter(b => b.runs > EXPECT[b.d].max);
  if (watched.length) {
    console.log('  one-facility districts on the page (cells/hero structures): '
      + watched.sort((a, b) => b.n - a.n).map(b => b.d + ' ' + b.n + 'c/' + b.runs + 'r').join('  '));
    ok('ON THE PAGE, A FACILITY DOES NOT MULTIPLY WITH ITS GROUND'
       + (scaled.length ? ' -> ' + scaled.map(b => b.d + ' (' + b.n + ' cells, ' + b.runs
           + ' structures, expected at most ' + EXPECT[b.d].max + ': ' + EXPECT[b.d].why + ')').join(', ') : ''),
       scaled.length === 0);
  }

  /* AND THE SAME QUESTION FOR THE RAILYARD (8/26), because the same trap caught it the same
     way. The yard was fixed in engine/bohemia_railyard.js, wired in world.js, gated 18/0 and
     mutation-tested -- and the page still drew SIX engine sheds, because the walked surface
     carries its own INLINED COPY of every engine module and that copy was the old one. One
     tool resyncs it (tools/bohemia_city_module_resync.py) and nothing forces anybody to run
     it. So the page is asked directly: a classification yard has ONE engine shed however
     many cells it spans. 6 of 6 was the bug, 1 of 6 is the answer. */
  const yard = await fr.evaluate(() => {
    const N = OM.OVER_N, W = 128;
    const isY = (x, y) => { const c = om.at(x, y); return !!(c && c.district === 'railyard'); };
    let cells = 0, sheds = 0, gantries = 0;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      if (!isY(x, y)) continue;
      cells++;
      const m = (typeof tileMeta === 'function') ? tileMeta(x, y) : null;
      const g = m && m.kit;                    // FLAT Uint16Array, not rows
      if (!g || g.length !== W * W) continue;
      let hasShed = false, hasGantry = false;
      for (let i = 0; i < g.length; i++) { if (g[i] === 2) hasShed = true; else if (g[i] === 13) hasGantry = true; }
      if (hasShed) sheds++;
      if (hasGantry) gantries++;
    }
    return { cells, sheds, gantries };
  });
  if (yard.cells > 1) {
    console.log('  the railyard: ' + yard.cells + ' cells, ' + yard.sheds + ' engine sheds, '
      + yard.gantries + ' gantry cranes (one of each per cell was the bug)');
    ok('THE RAILYARD IS ONE YARD: a classification yard has ONE engine shed and ONE gantry '
       + 'however many cells it spans (measured ' + yard.sheds + ' sheds, ' + yard.gantries
       + ' gantries across ' + yard.cells + ' cells)',
       yard.sheds === 1 && yard.gantries === 1);
  }

  if (wash.cells) {
    console.log('  the wash: ' + wash.cells + ' cells, ' + wash.ends + ' ends, '
      + wash.mouths + ' tunnel mouths (one per cell was the bug)');
    ok('THE WASH IS A RIVER, NOT ONE RIVER PER CELL: the channel goes underground where it '
       + 'ENDS, so the tunnel mouths track the ' + wash.ends + ' ends and not the '
       + wash.cells + ' cells (measured ' + wash.mouths + ')',
       wash.mouths <= wash.ends + 2 && wash.mouths >= Math.max(1, wash.ends - 2));
  }

  const reached = rows.filter(r => !r.paths.includes('FALLBACK'))
    .reduce((a, r) => a + r.n, 0);
  const total = rows.reduce((a, r) => a + r.n, 0);
  console.log('  ' + rows.length + ' district types, ' + reached + ' of ' + total +
              ' cells (' + (100 * reached / total).toFixed(1) + '%) drawn by their own module');
  const worst = rows.filter(r => r.colours < MIN_COLOURS)
    .map(r => r.d + ':' + r.colours).join(' ');
  if (worst) console.log('  thin (named debt): ' + worst);
  report(browser);
})().catch(e => { fails.push('crashed: ' + e.message.slice(0, 90)); report(null); });

function report(browser) {
  if (browser) browser.close();
  fails.forEach(f => console.log('  FAIL: ' + f));
  console.log('WALKED SURFACE GATE: ' + pass + ' passed, ' + fails.length + ' failed');
  process.exit(fails.length ? 1 : 0);
}
