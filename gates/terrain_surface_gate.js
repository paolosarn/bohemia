#!/usr/bin/env node
/* TERRAIN SURFACE GATE (8/18/26, WORLD lane) — THE GENERATOR'S OUTPUT IS WHAT HE WALKS ON.
 *
 * gates/terrain_gate.js has been green since 7/26 on the desert, the mountain and the lake:
 * the seam, the determinism, the self-spaced creosote, the OHV tracks, the ghost plat, the
 * bathtub ring. Every one of those assertions was true. NONE OF IT WAS IN THE GAME.
 *
 * MEASURED on the running page, asking tileMeta what a real terrain cell actually is:
 *     desert / wash / mountain   hasKit:false  open:true  rects:10
 *     water                      hasKit:false  open:true  rects:0
 * TEN 2x2 RECTANGLES OF FLAT COLOUR, per 128x128 cell. That was the whole thing.
 *
 * THIS IS THE SAME SHAPE AS EVERY OTHER MISS THIS LANE FOUND TODAY, and that is why this
 * gate exists rather than a note in a record: terrain_gate tests the GENERATOR, and nothing
 * asked whether the game called it. A gate that checks its own side of a seam nobody is
 * standing on will stay green through anything.
 *
 * SO THIS GATE STANDS ON THE SEAM. It boots the real page and asks the running valley, not
 * the module:
 *   1. does a terrain cell come back with its module's grid, or with rectangles
 *   2. is there real VARIETY in it, or one code repeated
 *   3. DOES THE FIELD STILL SEAM — the one thing that can silently break here
 *   4. do the deliberately-excluded types still take the fallback, so it is not dead code
 *
 * NUMBER 3 IS THE ONE THAT MATTERS AND IT IS THE ONLY REASON THIS IS HARD. Terrain is
 * sampled from ONE valley-wide field in GLOBAL coordinates — the entire reason a ridge
 * crosses a cell boundary instead of stopping dead at it. __kitBlock generates one 128x128
 * block per GRP x GRP cells (FN=32, GRP=4), so the BLOCK coordinate is the 128-tile
 * coordinate. Hand the generator the CELL instead and every seam in the valley breaks WHILE
 * EACH CELL STILL LOOKS PERFECTLY FINE ON ITS OWN. There is no way to see that by looking at
 * a screenshot, which is exactly why it is measured against a control: a real neighbour must
 * match along the shared edge far better than a cell picked from somewhere else entirely.
 * Mutation-confirmed — swap the block coordinate for the cell and the match collapses to
 * control level.
 *
 *   node gates/terrain_surface_gate.js
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

console.log('TERRAIN SURFACE GATE — the generator\'s output is what he walks on\n');

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

    const r = await p.evaluate(() => {
      const out = { types: {}, seam: null, fallback: {}, noise: typeof BohemiaTerrainNoise !== 'undefined' };
      const N = om.n;
      const firstCell = (want) => {
        for (let ty = 0; ty < N; ty++) for (let tx = 0; tx < N; tx++) {
          const t = om.at(tx, ty);
          if (t && t.district === want) return [tx, ty];
        }
        return null;
      };
      for (const want of ['desert', 'wash']) {
        const c = firstCell(want);
        if (!c) { out.types[want] = { missing: true }; continue; }
        const [tx, ty] = c;
        let m; try { m = tileMeta(tx, ty); } catch (e) { out.types[want] = { err: String(e) }; continue; }
        const codes = {};
        let walk = 0, tot = 0;
        for (let j = 0; j < FN; j++) for (let i = 0; i < FN; i++) {
          tot++;
          const cc = cellAt(tx * FN + i, ty * FN + j);
          if (cc && cc.walk) walk++;
          if (m.kit) { const cd = m.kit[j * FN + i]; codes[cd] = (codes[cd] || 0) + 1; }
        }
        const sp = BohemiaDistrictKit.get(want);
        out.types[want] = {
          cell: [tx, ty], hasKit: !!m.kit, open: !!m.open, rects: (m.rects || []).length,
          distinct: Object.keys(codes).length, walk: walk, tot: tot,
          top: Object.keys(codes).sort((a, b) => codes[b] - codes[a]).slice(0, 5)
                 .map(cd => (sp && sp.legend[cd] ? sp.legend[cd].name : '?'))
        };
      }
      /* THE DELIBERATELY EXCLUDED ONES still take the rects path, so the fallback is not
         dead code and the exclusion is a real decision rather than an accident. */
      for (const want of ['mountain', 'water']) {
        const c = firstCell(want);
        if (!c) { out.fallback[want] = { missing: true }; continue; }
        let m; try { m = tileMeta(c[0], c[1]); } catch (e) { out.fallback[want] = { err: String(e) }; continue; }
        out.fallback[want] = { hasKit: !!m.kit, open: !!m.open, rects: (m.rects || []).length };
      }
      /* THE SEAM, AGAINST A CONTROL. Two side-by-side desert cells must agree along their
         shared edge far better than a desert cell from somewhere else entirely. */
      outer:
      for (let ty = 0; ty < N; ty++) for (let tx = 0; tx < N - 1; tx++) {
        const a = om.at(tx, ty), b = om.at(tx + 1, ty);
        if (!a || !b || a.district !== 'desert' || b.district !== 'desert') continue;
        let ma, mb; try { ma = tileMeta(tx, ty); mb = tileMeta(tx + 1, ty); } catch (e) { continue; }
        if (!ma.kit || !mb.kit) continue;
        let same = 0;
        for (let j = 0; j < FN; j++) if (ma.kit[j * FN + (FN - 1)] === mb.kit[j * FN + 0]) same++;
        /* THE CONTROL IS AVERAGED OVER SEVERAL DISTANT CELLS, not taken from one. A
           single control sample swings (two deserts can happen to agree on a run of
           dead-ground), and a gate whose threshold sits near the noise is a gate that
           flakes and then gets switched off by whoever it wakes up. */
        const ctls = [];
        for (let y2 = 0; y2 < N && ctls.length < 6; y2++) for (let x2 = 0; x2 < N; x2++) {
          if (Math.abs(x2 - tx) < 8 && Math.abs(y2 - ty) < 8) continue;
          const q = om.at(x2, y2); if (!q || q.district !== 'desert') continue;
          let mq; try { mq = tileMeta(x2, y2); } catch (e) { continue; }
          if (!mq.kit) continue;
          let s2 = 0;
          for (let j = 0; j < FN; j++) if (ma.kit[j * FN + (FN - 1)] === mq.kit[j * FN + 0]) s2++;
          ctls.push(s2);
          if (ctls.length >= 6) break;
        }
        const ctl = ctls.length ? ctls.reduce((a, b) => a + b, 0) / ctls.length : null;
        out.seam = { at: [tx, ty], neighbour: same, control: ctl, controls: ctls, of: FN };
        break outer;
      }
      return out;
    });

    /* ── the field itself ── */
    ok('the ONE valley-wide terrain field is on the page — the desert samples it, and ' +
       'without it the generator throws on load and falls SILENTLY back to rectangles, ' +
       'which looks exactly like never having been wired', r.noise);

    /* ── the generators reach the surface ── */
    for (const t of ['desert', 'wash']) {
      const v = r.types[t] || {};
      ok(t + ': the cell comes from its own module, not from ten rectangles' +
         (v.hasKit ? '' : ' — hasKit:' + !!v.hasKit + ' rects:' + v.rects), v.hasKit === true);
      ok(t + ': and there is real ground in it (' + (v.distinct || 0) + ' tile types: ' +
         (v.top || []).join(', ') + ')', (v.distinct || 0) >= 6);
      ok(t + ': he can still walk on most of it (' + v.walk + '/' + v.tot + ')',
         v.walk / v.tot > 0.6);
    }
    /* THE WASH MUST NOT BE A CARPET. Its concrete flood structure and riprap are solid, so
       a wash that is 100% walkable means the occupancy half never landed. */
    {
      const w = r.types.wash || {};
      ok('wash: its concrete structures and riprap actually BLOCK (' + w.walk + '/' + w.tot +
         ') — a wash that is 100% walkable is a wash whose tiles are decoration',
         w.tot > 0 && w.walk < w.tot);
    }

    /* ── the exclusions are real ── */
    for (const t of ['mountain', 'water']) {
      const v = r.fallback[t] || {};
      ok(t + ': still on the rectangle fallback, deliberately — so the fallback is live ' +
         'code and the exclusion is a decision, not an accident',
         v.hasKit === false && v.open === true);
    }

    /* ── THE SEAM ── */
    if (!r.seam) {
      ok('two adjacent desert cells exist to compare', false);
    } else {
      const { neighbour, control, of } = r.seam;
      console.log('       seam at ' + r.seam.at.join(',') + ': neighbour ' + neighbour + '/' +
                  of + ', control ' + (control === null ? 'n/a' : control.toFixed(1)) + '/' + of +
                  ' (mean of ' + (r.seam.controls || []).length + ': ' +
                  (r.seam.controls || []).join(', ') + ')');
      ok('THE FIELD STILL SEAMS: a real neighbour agrees along the shared edge (' +
         neighbour + '/' + of + ')', neighbour >= of * 0.7);
      ok('and it is not agreeing by accident — a desert cell from elsewhere matches only ' +
         control + '/' + of + ', so the neighbour result is the global field and not the ' +
         'odds of two deserts looking alike',
         control !== null && neighbour >= control * 1.4);
    }

    ok('no page errors realizing terrain' + (errs.length ? ' — ' + errs[0] : ''),
       errs.length === 0);
    await browser.close();
  } catch (e) {
    if (browser) try { await browser.close(); } catch (_e) {}
    ok('the gate ran at all — ' + String(e).split('\n')[0], false);
  }

  console.log('\nTERRAIN SURFACE GATE: ' + pass + ' passed, ' + fail + ' failed  (the desert ' +
              'and the wash he walks on are the ground their own generators authored, and ' +
              'the valley-wide field still crosses cell boundaries)');
  process.exit(fail ? 1 : 0);
})();
