#!/usr/bin/env node
/* ============================================================================
   WHERE DOES THE STREET ACTUALLY STOP?  (8/28/26, WORLD lane)

   Paolo, after playing the 8/28k build: "streets are stillls uper fucked".

   street_contract_gate.js was green: arterial 0 of 2594, rail 0 of 86, and a
   named, ratcheted debt for everything else. HE IS STILL RIGHT AND THE GATE IS
   THE BROKEN PART, and the reason is two lines of it:

       const t = om.at(tx, ty);            if (!t || !RD[t.district]) continue;
       const u = om.at(tx + dx, ty + dy);  if (!u || !RD[u.district]) continue;

   BOTH SIDES OF A SEAM MUST BE A ROAD DISTRICT OR THE SEAM IS NOT LOOKED AT.
   So every edge where a street meets a SUBURB, a COMMERCIAL block, DOWNTOWN, a
   TOWN, an INDUSTRIAL park -- which is every edge a person actually walks up to
   -- was skipped in silence. The contract governs the road network talking to
   itself and says nothing about the road network talking to the city.

   THIS PROBE ASKS THE HONEST QUESTION AT EVERY EDGE IN THE VALLEY:
     if EITHER side has a drivable corridor reaching this edge, the other side
     must have one too, and they must be the same tiles.
   A road that runs to a boundary and finds bare ground on the other side is a
   road that ends in dirt, and it does not matter what the district is called.

   It separates the honest endings from the broken ones. A street meeting DESERT,
   MOUNTAIN or WATER really does end -- that is the valley rim, and it is counted
   apart so the headline number cannot be inflated by it.

     node tools/bohemia_street_reach_probe.js [--worst 20]
   ========================================================================== */
'use strict';
const path = require('path');
const { settle: SETTLE } = require(__dirname + '/../gates/bohemia_settle.js');
const ROOT = path.dirname(__dirname);
const PAGE = 'slices/BOHEMIA_CITY_WORLD.html';

function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

(async () => {
  const WORST = (() => { const i = process.argv.indexOf('--worst');
    return i > 0 ? parseInt(process.argv[i + 1], 10) || 20 : 20; })();
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

    const PAIR = (() => { const i = process.argv.indexOf('--pair');
      return i > 0 ? process.argv[i + 1] : null; })();
    const R = await p.evaluate((PAIR) => {
      window.__PAIR = PAIR;
      const N = om.n;
      /* IDENTICAL connector to the gate's, deliberately -- if this probe and the gate
         disagree about where a road is, one of them is lying and it must not be a
         second definition that causes it. */
      function connector(tx, ty, edge) {
        let m; try { m = tileMeta(tx, ty); } catch (e) { return null; }
        const g = m.kit; if (!g) return null;
        const L = deadLegendFor(m); if (!L) return null;
        let lo = -1, hi = -1, walk = false;
        for (let i = 0; i < FN; i++) {
          const lx = edge === 'W' ? 0 : edge === 'E' ? FN - 1 : i;
          const ly = edge === 'N' ? 0 : edge === 'S' ? FN - 1 : i;
          const e = L[g[ly * FN + lx]]; if (!e) continue;
          const k = e.kind;
          const over = BohemiaDistrictKit.tileLayer(e).layer === 'overhead';
          if (k === 'drive' || k === 'marking' || k === 'gate' || over) { if (lo < 0) lo = i; hi = i; }
          else if (k === 'walk') walk = true;
        }
        return { lo: lo, hi: hi, walk: walk, d: m.d };
      }
      /* THE VALLEY RIM. A street really does end at these, and saying so is not an
         excuse -- it is the difference between a road that stops at a mountain and a
         road that stops at somebody's front lawn. */
      /* SAME ROAD OR A DIFFERENT ONE, WHICH IS NOT THE SAME QUESTION AS "BOTH ARE ROADS".
         An arterial running into another arterial is a CONTINUATION and must match tile for
         tile. An arterial arriving at a FREEWAY is a JUNCTION -- it bridges over on a deck
         or it ramps on, and either way `arterial 47..81 vs freeway 18..110` is the smaller
         road landing inside the bigger one's corridor, which is correct and was being
         counted as 99 breaks. Same reasoning as a shop's driveway feeding onto a road, one
         class up. The gate's own header has said this since the day it was written: "a
         freeway is not an arterial and the place they meet is an interchange." */
      const fam = d => d === 'arterial_x' ? 'arterial' : d === 'beltway' ? 'freeway' : d;
      const WILD = { desert: 1, mountain: 1, water: 1, wash: 1 };

      const out = { edges: 0, looked: 0, ok: 0, oneSide: 0, offset: 0,
                    atWild: 0, roadToRoad: 0, roadToCity: 0, cityToCity: 0,
                    byPair: {}, perShape: {}, worst: [], noGrid: 0 };

      for (let ty = 0; ty < N; ty++) for (let tx = 0; tx < N; tx++) {
        const t = om.at(tx, ty); if (!t) continue;
        for (const step of [['S', 0, 1, 'N'], ['E', 1, 0, 'W']]) {
          const edge = step[0], dx = step[1], dy = step[2], opp = step[3];
          const u = om.at(tx + dx, ty + dy); if (!u) continue;
          out.edges++;
          const A = connector(tx, ty, edge), B = connector(tx + dx, ty + dy, opp);
          if (!A || !B) { out.noGrid++; continue; }
          const aHas = A.lo >= 0, bHas = B.lo >= 0;
          if (!aHas && !bHas) continue;              // no street here at all: nothing owed
          out.looked++;
          const aRoad = !!RD[t.district], bRoad = !!RD[u.district];
          if (aRoad && bRoad) out.roadToRoad++;
          else if (aRoad || bRoad) out.roadToCity++;
          else out.cityToCity++;

          /* *** A DRIVEWAY IS NOT REQUIRED TO BE AS WIDE AS THE ROAD IT JOINS. ***
             The first cut of this demanded the two corridors be the SAME TILES, which is
             exactly right where two arterials meet and plainly wrong where a shop's drive
             approach feeds onto one: commercial 47..57 against arterial 47..81 is a
             correct junction and it was being filed as a break. A road-to-road seam is a
             CONTINUATION and must match tile for tile; a road-to-city seam is a JUNCTION
             and only has to be CONTAINED -- the smaller mouth entirely inside the larger
             one, with nothing hanging off the side.
             Partial overlap is still broken, and so is disjoint: those are a driveway that
             half-misses the road, which is the thing that actually looks wrong. */
          const bothRoad = !!RD[t.district] && !!RD[u.district] && fam(t.district) === fam(u.district);
          let verdict = 'OK';
          if (!aHas || !bHas) verdict = 'ONE_SIDE';
          else if (bothRoad) { if (A.lo !== B.lo || A.hi !== B.hi) verdict = 'OFFSET'; }
          else {
            const inside = (A.lo >= B.lo && A.hi <= B.hi) || (B.lo >= A.lo && B.hi <= A.hi);
            if (!inside) verdict = 'OFFSET';
          }
          if (verdict === 'OK') { out.ok++; continue; }

          /* a road dying against the valley rim is honest and is counted apart */
          const wild = (!aHas && WILD[t.district]) || (!bHas && WILD[u.district]);
          if (wild) { out.atWild++; continue; }

          if (verdict === 'ONE_SIDE') out.oneSide++; else out.offset++;
          const key = verdict + '  ' + t.district + ' -' + edge + '-> ' + u.district;
          out.byPair[key] = (out.byPair[key] || 0) + 1;
          if (window.__PAIR && key.indexOf(window.__PAIR) < 0) continue;
          /* THREE SAMPLES PER SHAPE, NOT FORTY OF WHICHEVER SHAPE THE SCAN HIT FIRST.
             The first version filled its whole list with row-0 solar cells, so seeing any
             other shape cost a second eight-minute run with a filter. A sample list sorted
             by scan order is a list about the scan, not about the valley. */
          out.perShape[key] = (out.perShape[key] || 0) + 1;
          if (out.perShape[key] <= 3)
            out.worst.push(verdict + '  ' + t.district + '(' + tx + ',' + ty + ') -' + edge +
                           '-> ' + u.district + '(' + (tx + dx) + ',' + (ty + dy) + ')   ' +
                           A.lo + '..' + A.hi + '  vs  ' + B.lo + '..' + B.hi);
        }
      }
      /* ── AND THE QUESTION UNDERNEATH ALL OF IT: CAN A CAR GET ANYWHERE? ──────────────
         Every seam count above is local -- does THIS edge line up. None of them asks the
         thing a player asks, which is whether the road outside your door reaches the road
         you want. So the same connector data is turned into a GRAPH: one node per cell that
         has any corridor at all, an edge between two cells whose corridors OVERLAP at the
         seam they share, then connected components.
         It is deliberately at CELL resolution and not tile resolution: 96x96 cells of
         128x128 tiles is 150 million tiles and a flood over that in a browser is not a
         measurement, it is a hang. Overlap at the seam is exactly the condition a car needs
         to cross a cell boundary, which is the only thing cell resolution has to get right. */
      out.net = (function () {
        const idx = (x, y) => y * N + x;
        const has = new Map(), prof = new Map();
        for (let ty = 0; ty < N; ty++) for (let tx = 0; tx < N; tx++) {
          const t = om.at(tx, ty); if (!t) continue;
          const e = {};
          let any = false;
          for (const ed of ['N', 'S', 'E', 'W']) {
            const c = connector(tx, ty, ed);
            if (c && c.lo >= 0) { e[ed] = c; any = true; }
          }
          if (any) { has.set(idx(tx, ty), t.district); prof.set(idx(tx, ty), e); }
        }
        const parent = new Map();
        const find = a => { while (parent.get(a) !== a) { parent.set(a, parent.get(parent.get(a))); a = parent.get(a); } return a; };
        const uni = (a, b) => { a = find(a); b = find(b); if (a !== b) parent.set(a, b); };
        for (const k of has.keys()) parent.set(k, k);
        for (let ty = 0; ty < N; ty++) for (let tx = 0; tx < N; tx++) {
          const k = idx(tx, ty); if (!has.has(k)) continue;
          for (const [ed, dx, dy, opp] of [['S', 0, 1, 'N'], ['E', 1, 0, 'W']]) {
            const k2 = idx(tx + dx, ty + dy); if (!has.has(k2)) continue;
            const A = prof.get(k)[ed], B = prof.get(k2)[opp];
            if (!A || !B) continue;
            if (A.lo <= B.hi && B.lo <= A.hi) uni(k, k2);       // corridors overlap: a car crosses
          }
        }
        const comp = new Map();
        for (const [k, d] of has) {
          const r = find(k);
          if (!comp.has(r)) comp.set(r, { n: 0, kinds: {} });
          const c = comp.get(r); c.n++; c.kinds[d] = (c.kinds[d] || 0) + 1;
        }
        /* AND WHERE THE CUT-OFF ONES ACTUALLY ARE. The component sizes say how bad it is
           and nothing about where to go and look, which is the mistake that cost four
           attempts on the freeway decks: a count is not a location. */
        for (const [k, d] of has) comp.get(find(k)) || 0;
        const list = [...comp.values()].sort((a, b) => b.n - a.n);
        const big = list[0] || { n: 0, kinds: {} };
        const fwyTotal = [...has.values()].filter(d => d === 'freeway' || d === 'beltway').length;
        /* the biggest network's root, so everything not in it can be named */
        let bigRoot = null, bigN = -1;
        const rootCount = new Map();
        for (const k of has.keys()) { const r = find(k); rootCount.set(r, (rootCount.get(r) || 0) + 1); }
        for (const [r, n] of rootCount) if (n > bigN) { bigN = n; bigRoot = r; }
        const orphanFwy = [];
        for (const [k, d] of has) {
          if (d !== 'freeway' && d !== 'beltway') continue;
          if (find(k) === bigRoot) continue;
          if (orphanFwy.length < 14) orphanFwy.push('(' + (k % N) + ',' + Math.floor(k / N) + ') in a ' + rootCount.get(find(k)) + '-cell island');
        }
        return { orphanFwy: orphanFwy, cells: has.size, components: list.length,
                 biggest: big.n, biggestPct: has.size ? big.n / has.size : 0,
                 freewayCells: fwyTotal, freewayInBiggest: (big.kinds.freeway || 0) + (big.kinds.beltway || 0),
                 top: list.slice(0, 5).map(c => c.n + ' cells: ' +
                      Object.entries(c.kinds).sort((a, b) => b[1] - a[1]).slice(0, 4)
                        .map(x => x[0] + ' ' + x[1]).join(', ')) };
      })();

      return out;
    }, PAIR);

    console.log('\nWHERE DOES THE STREET ACTUALLY STOP?\n');
    console.log('  cell edges in the valley          ' + R.edges);
    console.log('  edges where a street reaches one  ' + R.looked +
                '   (road-road ' + R.roadToRoad + ', road-city ' + R.roadToCity +
                ', city-city ' + R.cityToCity + ')');
    console.log('  agree tile for tile               ' + R.ok);
    console.log('  ends honestly at desert/mountain  ' + R.atWild);
    console.log('  ONE SIDE ONLY (road ends in dirt) ' + R.oneSide);
    console.log('  OFFSET (both sides, misaligned)   ' + R.offset);
    const bad = R.oneSide + R.offset;
    console.log('\n  BROKEN: ' + bad + ' of ' + (R.looked - R.atWild) +
                '  (' + (100 * bad / Math.max(1, R.looked - R.atWild)).toFixed(1) + '%)\n');

    const pairs = Object.entries(R.byPair).sort((a, b) => b[1] - a[1]);
    console.log('  BY WHAT MEETS WHAT, worst first:');
    for (const [k, v] of pairs.slice(0, WORST)) console.log('    ' + String(v).padStart(5) + '  ' + k);
    if (pairs.length > WORST) console.log('    ... and ' + (pairs.length - WORST) + ' more shapes');
    if (R.net) {
      const n = R.net;
      console.log('\n  CAN A CAR ACTUALLY GET ANYWHERE?');
      console.log('    cells with any road on them     ' + n.cells);
      console.log('    separate road networks          ' + n.components);
      console.log('    biggest one                     ' + n.biggest +
                  ' cells (' + (100 * n.biggestPct).toFixed(1) + '% of them)');
      console.log('    freeway/beltway cells           ' + n.freewayCells +
                  ', of which ' + n.freewayInBiggest + ' are on the biggest network');
      console.log('    the five biggest networks:');
      n.top.forEach(t => console.log('      ' + t));
      if (n.orphanFwy && n.orphanFwy.length) {
        console.log('    freeway cells NOT on the biggest network, go and look at these:');
        n.orphanFwy.forEach(t => console.log('      ' + t));
      }
    }

    console.log('\n  SAMPLES TO GO AND LOOK AT, up to three per shape:');
    for (const w of R.worst) console.log('    ' + w);
    console.log('');
    if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  } finally {
    if (browser) await browser.close();
  }
})();
