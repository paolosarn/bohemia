#!/usr/bin/env node
/* APPROVED ART ARRIVES GATE (8/20/26, WORLD lane)
 * EVERY POOL OF ART HE APPROVED IS LOADED IN THE BROWSER. THAT IS NOT THE SAME AS BEING
 * ON THE SCREEN, AND NOTHING HAS EVER ASKED THE SECOND QUESTION.
 *
 * WHY THIS EXISTS, and it is one finding from this morning generalised.
 * gates/traffic_signal_gate.js was red for weeks on "0 draws". His 348 signal sprites were
 * LOADED, CORRECT, and drawing nowhere, because `m.road` had quietly stopped meaning "this
 * cell is a road". The gate that said "his sprites are LOADED in the browser" was GREEN the
 * entire time. LOADED IS NOT ARRIVED, and every art pool on this page has the same exposure:
 * a lookup keyed on something that changes underneath it, and the art simply stops appearing
 * with nothing anywhere going red.
 *
 * THE LAW THIS ENFORCES HAD NO MACHINE. Paolo 7/31, LOCKED: "ANY street graphics work by ANY
 * session ... sources from banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt, EVERY TIME."
 * A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED (proven 7/16, six of nine gated laws were
 * already broken). This is that machine: it does not care HOW a pool is reached, only that
 * the pixels he approved end up on a canvas somewhere.
 *
 * HOW IT MEASURES, and the method matters because my first attempt got it wrong twice:
 *   - it hooks CanvasRenderingContext2D.prototype.drawImage, NOT the visible canvas. Street
 *     art bakes into per-chunk canvases, a different context entirely; hooking only `cv`
 *     reported zero draws for pools that were working fine.
 *   - it renders BOTH surfaces. The district heroes are drawn by renderCity() (the CITY
 *     tab), not by render() (the walked surface), so sweeping only the walked surface
 *     reported 60 heroes silent when they were simply somewhere else. A probe that looks in
 *     one room and reports the house empty is the same disease as the bug it hunts.
 *
 * RATCHET, NOT A CLIFF. Some pools genuinely do not draw today and one of them is a real
 * finding that belongs to another lane (below). A gate that is red on day one is a comment
 * nobody can act on, so the silent pools are NAMED, may only SHRINK, and no pool outside the
 * list may go quiet.
 *
 *   node gates/approved_art_arrives_gate.js
 */
const path = require('path');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
const ok = (what, cond) => { cond ? (pass++, console.log('  ok   ' + what))
                                  : (fail++, console.log('  FAIL ' + what)); };
function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

/* ── THE NAMED SILENCE, measured 8/20 ────────────────────────────────────────────────────
   Every one of these is APPROVED ART, LOADED IN THE BROWSER, DRAWING NOWHERE. The list may
   only shrink. Each entry is a real question somebody has to answer, not a blanket excuse.

   THE BIG ONE, AND IT IS NOT MINE TO FIX: the roadway pools. Street art is chosen by GROUND
   COLOUR through SA_MAP, whose keys are the old parametric street colours (#8a8a86,
   #7a7a76, #5e5e5a, #4a4a48, #c8c4b8 ...). Since A ROAD WITH ITS OWN MODULE DRAWS ITSELF
   (8/18-8/19) the roads emit their generator's own palette instead (#33333c, #6a5f47,
   #8a8a92, #a09a8a ...). MEASURED: 44,376 road ground cells sampled across 24 road cells,
   and ZERO of them map to an approved street tile. His harmonized 7/14 bank reaches no road
   in the valley. That is the STREETS ARE THE HARMONIZED POOL law failing valley-wide and in
   silence, and the fix is a mapping from each new road tile to the bank pool it should
   wear -- which is a decision for whoever authored those road tiles, not for me to guess.
   Handed over with these numbers rather than reached into: ONE SYSTEM, ONE SESSION. */
const SILENT_DEBT = new Set([
  /* roadway + kerb, unreachable since the roads started drawing themselves (NOT MINE) */
  'street', 'side', 'shoulder', 'cross_ns', 'cross_ew', 'pocket_v', 'pocket_h',
  'median_h', 'median_v', 'lane_h', 'lane_v',
  /* building skins: reached through other lookups, not seen in this sweep's viewports */
  'roof', 'wallface', 'wallwin', 'perimeter', 'hroof', 'hwall', 'hwindow',
]);

console.log('APPROVED ART ARRIVES GATE — loaded is not the same as on the screen\n');

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
    await p.goto('file://' + path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'));
    await p.waitForFunction(() => typeof render === 'function' &&
                                  typeof SA_TILES !== 'undefined' &&
                                  typeof HERO_IMG !== 'undefined', null, { timeout: 60000 });

    const r = await p.evaluate(() => {
      const out = { drew: {}, declared: [], heroTotal: 0, heroLoaded: 0, heroDrew: 0,
                    sigTotal: 0, sigDrew: 0, samples: 0, city: 0, districts: 0 };
      const label = new Map();
      for (const k in SA_TILES) { out.declared.push(k); (SA_IMG[k] || []).forEach(im => label.set(im, k)); }
      for (const k in HERO_IMG) { out.heroTotal++;
        if (HERO_IMG[k].complete && HERO_IMG[k].naturalWidth) out.heroLoaded++;
        label.set(HERO_IMG[k], '@hero'); }
      for (const k in SIG_IMG) { out.sigTotal++; label.set(SIG_IMG[k], '@signal'); }
      if (typeof LAMP_IMG !== 'undefined') LAMP_IMG.forEach(im => label.set(im, '@lamp'));

      /* EVERY CONTEXT, not just the visible canvas — street art bakes into chunk canvases. */
      const proto = CanvasRenderingContext2D.prototype, od = proto.drawImage;
      proto.drawImage = function (img, ...a) {
        const L = label.get(img); if (L) out.drew[L] = (out.drew[L] || 0) + 1;
        return od.call(this, img, ...a);
      };
      const seen = {};
      for (let ty = 2; ty < om.n - 2 && out.samples < 160; ty += 3)
        for (let tx = 2; tx < om.n - 2 && out.samples < 160; tx += 3) {
          const t = om.at(tx, ty); if (!t) continue;
          if ((seen[t.district] || 0) >= 2) continue;
          if (!seen[t.district]) out.districts++;
          seen[t.district] = (seen[t.district] || 0) + 1;
          hx = tx * FN + (FN >> 1); hy = ty * FN + (FN >> 1);
          try { render(); } catch (e) {}
          out.samples++;
        }
      /* BOTH SURFACES: the heroes live on the CITY tab, not the walked one. */
      try { if (typeof renderCity === 'function') { renderCity(); out.city = 1; } } catch (e) {}
      proto.drawImage = od;
      out.heroDrew = out.drew['@hero'] || 0;
      out.sigDrew = out.drew['@signal'] || 0;
      return out;
    });

    console.log('       ' + r.samples + ' walked-surface renders across ' + r.districts +
                ' district types, plus the city view (' + (r.city ? 'ok' : 'MISSING') + ')');

    ok('the sweep actually rendered a lot of the valley (' + r.samples + ' renders, ' +
       r.districts + ' district types) — a silence check that visits three places proves ' +
       'nothing', r.samples >= 40 && r.districts >= 20);
    ok('and it rendered the CITY view too, where the district heroes live — looking in one ' +
       'room and reporting the house empty is the disease this gate hunts', r.city === 1);

    /* HIS TWO BIG APPROVED SETS, BY NAME, because these are the ones that went silent. */
    ok('his district hero art ARRIVES (' + r.heroDrew + ' draws, ' + r.heroLoaded + '/' +
       r.heroTotal + ' loaded)', r.heroLoaded === r.heroTotal && r.heroDrew > 0);
    ok('his 7/17 TRAFFIC SIGNALS arrive (' + r.sigDrew + ' draws from ' + r.sigTotal +
       ' sprites) — this is the one that was loaded, correct and drawing nowhere for weeks',
       r.sigDrew > 0);

    const silent = r.declared.filter(k => !r.drew[k]);
    const drewNow = r.declared.filter(k => r.drew[k]);
    console.log('       street/building pools declared: ' + r.declared.length +
                '  drew: ' + drewNow.length + '  silent: ' + silent.length);
    console.log('       drew: ' + drewNow.join(' '));

    /* THE RATCHET. A pool that draws today may never go quiet again. */
    const regressed = silent.filter(k => !SILENT_DEBT.has(k));
    const fixed = [...SILENT_DEBT].filter(k => r.drew[k]);
    ok('NO APPROVED POOL GOES SILENT that was not already named — art that stops arriving ' +
       'is invisible unless something counts the draws' +
       (regressed.length ? ' — ' + regressed.join(', ') : ''), regressed.length === 0);
    ok('the named silence only ever SHRINKS (' + silent.length + ', was ' + SILENT_DEBT.size +
       ')' + (fixed.length ? '; FIXED since: ' + fixed.join(', ') : ''),
       silent.length <= SILENT_DEBT.size);

    ok('no page errors during the sweep' + (errs.length ? ' — ' + errs[0] : ''),
       errs.length === 0);
    await browser.close();
  } catch (e) {
    if (browser) try { await browser.close(); } catch (_e) {}
    fail++; console.log('  FAIL harness: ' + e.message);
  }
  console.log('\nAPPROVED ART ARRIVES GATE: ' + pass + ' passed, ' + fail + ' failed' +
    (fail ? '' : '  (the art he approved is counted onto the screen, not just into memory)'));
  process.exit(fail ? 1 : 0);
})();
