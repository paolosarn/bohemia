#!/usr/bin/env node
/* HAZARD LOOK GATE (8/20/26, WORLD lane) — DANGEROUS GROUND HAS TO LOOK DANGEROUS.
 *
 * §2.6 of the RF4 lift: *never explain something the floor could have shown.* For three
 * days the floor could kill you, slow you or make every hit land harder, and the ONLY thing
 * that said so was a line of text in the corner of the screen. Every hazard tile in the
 * valley drew as flat colour: loose ballast you cannot brace on was the same picture as the
 * concrete beside it.
 *
 * THIS GATE READS THE BAKED PIXELS, NOT THE DATA, and that distinction is the whole reason
 * it exists. Every flag in this system was already correct before a mark was drawn —
 * `c.haz` was stamped on all 29 hazard tiles on the surface and the picture was identical.
 * A gate that asserted "the class is on the cell" would have been green through a feature
 * that did not exist. So it opens the real page, bakes a real chunk, and reads the actual
 * RGBA the player is looking at. That is VERIFY ON THE REAL SURFACE (7/18), and it is the
 * same lesson the mountain taught on 8/18 when every number was green and 927 cells
 * rendered as brickwork.
 *
 * WHAT IT REFUSES:
 *   - a hazard tile whose pixels are indistinguishable from ordinary ground
 *   - two different classes that look the same as each other (a mark nobody can tell apart
 *     is one mark wearing three names)
 *   - a void with no rim (a dark tile is not yet a hole)
 *
 *   node gates/hazard_look_gate.js
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

console.log('HAZARD LOOK GATE — the floor says it, instead of a readout saying it\n');

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
    await p.waitForFunction(() => typeof cellAt === 'function' &&
                                  typeof chunkCanvas === 'function' &&
                                  typeof BohemiaHazard !== 'undefined', null, { timeout: 60000 });

    const r = await p.evaluate(() => {
      const K = BohemiaDistrictKit;
      /* WHICH CODES ARE HAZARDS, read off the same derivation the renderer uses. */
      const want = {};
      for (const d of K.types()) {
        const sp = K.get(d); if (!sp || !sp.legend) continue;
        for (const c in sp.legend) {
          const cl = BohemiaHazard.classOf(sp.legend[c], K);
          if (cl) (want[d] = want[d] || {})[+c] = cl;
        }
      }
      /* READ THE BAKED PIXELS for one cell: bake its chunk, then take its TPX x TPX box.
         Returns a signature that is comparable across cells of the same base colour:
         mean luminance, the spread of luminance (a flat tile has none), and how many
         pixels sit far from the tile's own mean (the chips, the rim). */
      function sig(gx, gy) {
        const cx = gx >> 4, cy = gy >> 4;
        const ch = chunkCanvas(cx, cy); if (!ch || !ch.cv) return null;
        const ix = gx - (cx << 4), iy = gy - (cy << 4);
        const g2 = ch.cv.getContext('2d');
        let dat;
        try { dat = g2.getImageData(ix * TPX, iy * TPX, TPX, TPX).data; } catch (e) { return null; }
        let n = 0, sum = 0; const L = [];
        for (let i = 0; i < dat.length; i += 4) {
          const l = dat[i] * 0.299 + dat[i + 1] * 0.587 + dat[i + 2] * 0.114;
          L.push(l); sum += l; n++;
        }
        const mean = sum / n;
        let v = 0, far = 0;
        for (const l of L) { const d = l - mean; v += d * d; if (Math.abs(d) > 18) far++; }
        return { mean: mean, sd: Math.sqrt(v / n), far: far / n, n: n };
      }

      const out = { byClass: {}, plain: [], voids: [], errors: [] };
      const seen = {};
      for (let ty = 6; ty < om.n - 6; ty++) for (let tx = 6; tx < om.n - 6; tx++) {
        const t = om.at(tx, ty); if (!t || !want[t.district]) continue;
        if (seen[t.district]) continue;
        let m; try { m = tileMeta(tx, ty); } catch (e) { continue; }
        if (!m || !m.kit) continue;
        seen[t.district] = 1;
        for (let ly = 1; ly < FN - 1 && Object.keys(out.byClass).length < 60; ly++)
          for (let lx = 1; lx < FN - 1; lx++) {
            const code = m.kit[ly * FN + lx];
            const cl = want[t.district][code];
            const gx = tx * FN + lx, gy = ty * FN + ly;
            const cc = cellAt(gx, gy);
            if (!cc) continue;
            if (cl) {
              const key = cl;
              const s = sig(gx, gy); if (!s) continue;
              (out.byClass[key] = out.byClass[key] || []).push(s);
              if (cc['void']) out.voids.push(s);
            } else if (!cc.haz && !cc['void'] && cc.g && out.plain.length < 400) {
              const s = sig(gx, gy); if (s) out.plain.push(s);
            }
          }
      }
      return out;
    });

    const mean = a => a.reduce((s, x) => s + x, 0) / (a.length || 1);
    const classes = Object.keys(r.byClass);
    console.log('       classes found on the glass: ' +
                classes.map(c => c + ' x' + r.byClass[c].length).join(', '));
    console.log('       plain ground samples: ' + r.plain.length);

    ok('the sample contains ordinary ground to compare against (' + r.plain.length + ')',
       r.plain.length > 40);
    ok('and it contains at least two hazard classes on the real glass (' +
       classes.join(', ') + ')', classes.length >= 2);

    /* THE CENTRAL CLAIM, AND ITS FIRST FORM WAS WRONG IN A WAY WORTH KEEPING.
       It read "every class must be MORE BROKEN UP than ordinary ground", which is right for
       loose rock and WRONG FOR A LIQUID: standing water is a smoother surface than the dirt
       around it, and that is not a defect, it is what water is. Measured, DISABLES came in
       at 2.5% against plain ground's 2.7% while being 35 luminance darker and visibly blue.
       Demanding texture from it would have pushed me to make water look like gravel to
       satisfy a number -- the GOODHART GUARD in its purest form.
       So the claim is the one that was always meant: a marked tile must be VISIBLY
       DIFFERENT from ordinary ground, by TEXTURE or by VALUE. Both are ways of being seen;
       requiring a particular one is requiring a particular material. */
    const plainFar = mean(r.plain.map(s => s.far));
    const plainLum = mean(r.plain.map(s => s.mean));
    console.log('       plain ground: broken ' + (100 * plainFar).toFixed(1) + '%  lum ' +
                plainLum.toFixed(0));
    const weak = [];
    for (const c of classes) {
      const f = mean(r.byClass[c].map(s => s.far));
      const l = mean(r.byClass[c].map(s => s.mean));
      const byTexture = f > plainFar * 1.25;
      const byValue = Math.abs(l - plainLum) > 12;
      console.log('       ' + c.padEnd(10) + ': broken ' + (100 * f).toFixed(1) + '%  lum ' +
                  l.toFixed(0) + '   ' +
                  (byTexture ? 'TEXTURE ' : '') + (byValue ? 'VALUE' : ''));
      if (!byTexture && !byValue) weak.push(c);
    }
    ok('EVERY hazard class is visibly different from ordinary ground, by texture or by ' +
       'value — the mark is in the PIXELS and not just in the data' +
       (weak.length ? ' — ' + weak.join(', ') + ' look like plain dirt' : ''),
       classes.length > 0 && weak.length === 0);

    /* AND THE CLASSES ARE TOLD APART. A mark nobody can distinguish is one mark wearing
       three names, which would pass the check above and teach the player nothing. */
    let distinct = true, pairs = [];
    for (let i = 0; i < classes.length; i++) for (let j = i + 1; j < classes.length; j++) {
      const a = r.byClass[classes[i]], b = r.byClass[classes[j]];
      const dm = Math.abs(mean(a.map(s => s.mean)) - mean(b.map(s => s.mean)));
      const df = Math.abs(mean(a.map(s => s.far)) - mean(b.map(s => s.far)));
      pairs.push(classes[i] + '/' + classes[j] + ' dLum=' + dm.toFixed(1) +
                 ' dBroken=' + (100 * df).toFixed(1) + '%');
      if (dm < 4 && df < 0.03) distinct = false;
    }
    console.log('       ' + pairs.join('  |  '));
    ok('and the classes look DIFFERENT FROM EACH OTHER — three marks, not one mark with ' +
       'three names', distinct);

    /* A DARK TILE IS NOT YET A HOLE. The void draws darker than the rock it is cut from
       (8/20) and that alone reads as "a different material", not as "a drop". The rim is
       what makes it a hole from above. */
    if (r.voids.length) {
      const vf = mean(r.voids.map(s => s.far));
      console.log('       voids: ' + r.voids.length + ' sampled, broken-up ' +
                  (100 * vf).toFixed(1) + '%');
      ok('a VOID carries a rim — a dark tile is a different material, a rim is a hole (' +
         (100 * vf).toFixed(1) + '% of its pixels sit away from its own mean)', vf > 0.02);
    } else {
      console.log('       (no void in this sample window)');
    }

    ok('no page errors baking the marks' + (errs.length ? ' — ' + errs[0] : ''),
       errs.length === 0);
    await browser.close();
  } catch (e) {
    if (browser) try { await browser.close(); } catch (_e) {}
    fail++; console.log('  FAIL harness: ' + e.message);
  }
  console.log('\nHAZARD LOOK GATE: ' + pass + ' passed, ' + fail + ' failed' +
    (fail ? '' : '  (ground that does something to a body says so in the picture, measured ' +
     'on the pixels the player is actually looking at)'));
  process.exit(fail ? 1 : 0);
})();
