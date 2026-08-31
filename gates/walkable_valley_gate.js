#!/usr/bin/env node
/* ============================================================================
   THE WORLD YOU CAN WALK TO  (8/30/26, WORLD lane)

   Paolo's demo is a person on foot. Every screenshot of it says SUBURB · ON FOOT.
   The whole first act is walking somewhere and back.

   AND NOTHING IN THIS REPO HAS EVER ASKED WHETHER YOU CAN.

   street_contract_gate answers "does this seam line up" 7,600 times and, since
   8/28, "can a CAR reach the rest of the road network". Both are about ROADS.
   walkable_gate answers "is this district mostly parking lot", one district at a
   time. drive_network_gate answers "can a car reach every stall", inside one
   plot. Not one of them asks the only question the player actually asks:

       FROM WHERE THE GAME STARTS ME, WHAT CAN I WALK TO?

   THE MEASURE. One node per valley cell that has any standable tile on any edge.
   An edge between two cells when there is at least one index i where BOTH sides'
   edge tile at i is standable -- which is exactly the condition a body needs to
   step across a cell boundary. Then connected components, and the component that
   contains the cell the demo opens in.

   Cell resolution on purpose: 96x96 cells of 128x128 tiles is 150 million tiles
   and a flood over that in a browser is a hang, not a measurement. Standability
   along the shared edge is the only thing cell resolution has to get right, and
   it gets it exactly right.

   *** IT ASKS THE GAME, NOT A COPY OF THE GAME. ***
   The first draft of this read the district kit's own per-tile solidity, which is
   correct for every kit district and BLIND TO THE SUBURB -- the one district the
   demo starts in, because SUB_RES cells carry `m.sub` and never `m.kit`. It
   reported that the player can walk to 0.0% of the valley. That is a statement
   about the instrument, not about the game, and it is the fourth time this month
   a measurement's first answer was about itself.
   So it calls `realizeCell`, which IS the walked surface's own answer and cannot
   drift from what a body experiences. Same reason occupancy_gate compares the
   model against the running page instead of trusting either one alone.

   MEASURED 8/30: 9,043 cells carry standable ground; the player can walk to
   8,653 of them, 95.7%, and it is the valley's biggest network. Everything out
   of reach is MOUNTAIN except eighteen cells, and all eighteen are one- to
   twelve-cell pockets pressed against the rim.

     node gates/walkable_valley_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const ROOT = path.dirname(__dirname);
const PAGE = 'slices/BOHEMIA_CITY_WORLD.html';

let pass = 0, fail = 0;
const ok = (what, cond) => { if (cond) { pass++; console.log('  ok   ' + what); }
                             else { fail++; console.log('  FAIL ' + what); } };

/* FLOORS AND CEILINGS ON THE WHOLE MAP. The share only ever goes UP and the stranded
   count only ever goes DOWN, so no future change can quietly wall the player into a
   corner of the valley while every local seam check still passes. */
const REACH_FLOOR = 0.955;      // measured 0.957
const STRANDED_DEBT = 18;       // measured 18, all of them pockets against the rim

function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

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
    await SETTLE(p, 4000);
    await p.evaluate(() => { try { cardHide(); } catch (e) {} });

    /* THE SWEEP LIVES ON THE PAGE so the mutation test can re-run the identical code
       against a mutated world without a second definition of anything. */
    await p.evaluate(() => {
      window.__WALKNET = function (blockHome) {
        const N = om.n;
        function walkEdge(tx, ty, edge) {
          const out = new Uint8Array(FN); let any = 0;
          for (let i = 0; i < FN; i++) {
            const lx = edge === 'W' ? 0 : edge === 'E' ? FN - 1 : i;
            const ly = edge === 'N' ? 0 : edge === 'S' ? FN - 1 : i;
            let c; try { c = realizeCell(tx * FN + lx, ty * FN + ly); } catch (e) { continue; }
            if (c && c.walk) { out[i] = 1; any = 1; }
          }
          return any ? out : null;
        }
        const idx = (x, y) => y * N + x;
        const has = new Map(), prof = new Map();
        for (let ty = 0; ty < N; ty++) for (let tx = 0; tx < N; tx++) {
          const t = om.at(tx, ty); if (!t) continue;
          const e = {}; let any = false;
          for (const ed of ['N', 'S', 'E', 'W']) { const w = walkEdge(tx, ty, ed); if (w) { e[ed] = w; any = true; } }
          if (any) { has.set(idx(tx, ty), t.district); prof.set(idx(tx, ty), e); }
        }
        const homeK = idx(city.x, city.y);
        const par = new Map();
        const find = a => { while (par.get(a) !== a) { par.set(a, par.get(par.get(a))); a = par.get(a); } return a; };
        for (const k of has.keys()) par.set(k, k);
        for (let ty = 0; ty < N; ty++) for (let tx = 0; tx < N; tx++) {
          const k = idx(tx, ty); if (!has.has(k)) continue;
          /* THE MUTATION: seal the cell the demo opens in. If the number does not
             collapse, this sweep is not measuring reachability from home at all. */
          if (blockHome && k === homeK) continue;
          for (const [ed, dx, dy, opp] of [['S', 0, 1, 'N'], ['E', 1, 0, 'W']]) {
            const k2 = idx(tx + dx, ty + dy); if (!has.has(k2)) continue;
            if (blockHome && k2 === homeK) continue;
            const A = prof.get(k)[ed], B = prof.get(k2)[opp]; if (!A || !B) continue;
            let step = false;
            for (let i = 0; i < FN; i++) if (A[i] && B[i]) { step = true; break; }
            if (step) { const a = find(k), b = find(k2); if (a !== b) par.set(a, b); }
          }
        }
        const cnt = new Map();
        for (const k of has.keys()) { const r = find(k); cnt.set(r, (cnt.get(r) || 0) + 1); }
        let root = null, big = -1;
        for (const [r, n] of cnt) if (n > big) { big = n; root = r; }
        const homeRoot = has.has(homeK) ? find(homeK) : null;
        const homeN = homeRoot !== null ? cnt.get(homeRoot) : 0;
        const byKind = {}; const stranded = [];
        for (const [k, d] of has) {
          if (homeRoot !== null && find(k) === homeRoot) continue;
          byKind[d] = (byKind[d] || 0) + 1;
          /* MOUNTAIN AND WATER ARE ALLOWED TO BE UNREACHABLE. A rim you cannot walk up
             is the valley having edges, not the valley being broken, and counting them
             in the headline would let a real stranding hide behind 371 mountains. */
          if (d !== 'mountain' && d !== 'water' && stranded.length < 40)
            stranded.push(d + '(' + (k % N) + ',' + Math.floor(k / N) + ') in a pocket of ' + cnt.get(find(k)));
        }
        let strandedN = 0;
        for (const d in byKind) if (d !== 'mountain' && d !== 'water') strandedN += byKind[d];
        return { cells: has.size, comps: cnt.size, biggest: big,
                 home: { x: city.x, y: city.y, d: (om.at(city.x, city.y) || {}).district },
                 homeReach: homeN, homeIsBiggest: homeRoot === root,
                 strandedN: strandedN, stranded: stranded,
                 byKind: Object.entries(byKind).sort((a, b) => b[1] - a[1]).slice(0, 10) };
      };
    });

    console.log('\nTHE WORLD YOU CAN WALK TO\n');
    const R = await p.evaluate(() => window.__WALKNET(false));
    const pct = R.cells ? R.homeReach / R.cells : 0;

    console.log('       the demo opens in ' + R.home.d + '(' + R.home.x + ',' + R.home.y + ')');
    console.log('       ' + R.cells + ' cells carry standable ground, in ' + R.comps +
                ' separate walk networks; the biggest is ' + R.biggest + '.');

    ok('THE PLAYER CAN WALK OUT OF WHERE THE GAME PUT HIM — the cell the demo opens in is ' +
       'on the valley\'s biggest walk network, not in a pocket of its own',
       R.homeIsBiggest && R.homeReach > 1);

    ok('AND HE CAN WALK TO THE WORLD — the share of standable cells reachable ON FOOT from ' +
       'the opening cell only ever goes UP, so nothing may quietly wall him into a corner ' +
       'while every seam still lines up ' +
       '(' + (100 * pct).toFixed(1) + '%, floor ' + (100 * REACH_FLOOR).toFixed(1) + '%)',
       pct >= REACH_FLOOR);
    if (pct > REACH_FLOOR + 0.002)
      console.log('       RATCHET: on-foot reach is up to ' + (100 * pct).toFixed(1) + '%; raise REACH_FLOOR.');

    console.log('       out of reach, by district: ' +
                R.byKind.map(([d, n]) => d + ' ' + n).join(', '));
    ok('AND WHAT HE CANNOT REACH IS THE MOUNTAIN, not somebody\'s street — every cell out ' +
       'of reach that is NOT rim or water is counted and only ever goes down ' +
       '(' + R.strandedN + ', ceiling ' + STRANDED_DEBT + ')',
       R.strandedN <= STRANDED_DEBT);
    if (R.stranded.length) {
      console.log('       the pockets, to go and look at:');
      R.stranded.slice(0, 8).forEach(s => console.log('         ' + s));
    }
    if (R.strandedN < STRANDED_DEBT)
      console.log('       RATCHET: stranded pockets are down to ' + R.strandedN + '; lower STRANDED_DEBT.');

    /* ── THE MUTATION TEST ─────────────────────────────────────────────────────────
       A NEGATIVE RESULT IS A CLAIM ABOUT YOUR INSTRUMENT UNTIL YOU HAVE SHOWN THE
       INSTRUMENT COULD HAVE SEEN A POSITIVE ONE -- and the first draft of this very
       sweep returned 0.0% because it could not see the suburb, so the warning is not
       theoretical here. Seal the opening cell off from its neighbours and the reach
       must collapse to that one cell. If it does not, the sweep is measuring
       something other than "reachable from home". */
    console.log('');
    const M = await p.evaluate(() => window.__WALKNET(true));
    ok('THE MUTATION TEST: seal the cell the demo opens in and his reach collapses — this ' +
       'sweep is following standable ground, not agreeing with itself ' +
       '(' + R.homeReach + ' cells -> ' + M.homeReach + ')',
       M.homeReach <= 1 && R.homeReach > 100);

    ok('and the world is unchanged after the mutation — it was done in the sweep\'s own ' +
       'copy of the graph and never on the page',
       (await p.evaluate(() => window.__WALKNET(false))).homeReach === R.homeReach);

    ok('the page threw nothing while all of this ran', errs.length === 0);
    if (errs.length) errs.slice(0, 3).forEach(e => console.log('       ' + e));

    console.log('\n' + (fail ? 'FAIL' : 'PASS') + '  ' + pass + ' ok, ' + fail + ' failed\n');
  } finally {
    if (browser) await browser.close();
  }
  process.exit(fail ? 1 : 0);
})();
