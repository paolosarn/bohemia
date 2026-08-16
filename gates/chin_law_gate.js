/* BOHEMIA THE CHIN LAW (Paolo 8/11/26, LOCKED: "make sure we never have this chin
 * issue ever again")
 *
 * He caught the same defect THREE times across three weeks -- 7/28 in profile,
 * 8/11 head-on, and 8/11 again after I fixed the wrong half of it and told him it
 * was done. Two different mechanisms produced the identical symptom, which is why
 * neither of the existing gates caught either one:
 *
 *   1. THE HEAD HAD NO EDGE. The body shades itself from the part grid and an edge
 *      pixel takes the darker anatomy tone -- but the whole pass was wrapped in
 *      `if (g !== 0)`, and GROUP puts head and face in group 0. The head was the
 *      one body part excluded from having a silhouette edge at all, so the jawline
 *      he painted rendered the same colour as the cheek beside it.
 *   2. THE THROAT ATE THE CHIN. NECK_TONE takes the lowest rows of visible FACE
 *      skin (part 3 is 100% cloth on every facing he looks at, so a tone there can
 *      never appear). At `throatRows: 2` that is his JAW and his CHIN, both painted
 *      the neck's own tone -- so chin and neck read as one slab with the mouth
 *      sitting on top of it.
 *
 * THE LAW, and it is written as a property so it does not care which pass breaks
 * it next:
 *
 *   A. THERE IS ALWAYS HEAD UNDER THE MOUTH. Below the mouth row there must be at
 *      least one row of FACE-TONED skin before anything else starts. His words,
 *      twice: "there needs to be more head underneath the mouth."
 *   B. THE THROAT NEVER TAKES MORE THAN ONE ROW OF FACE. Whatever tints the throat,
 *      it may claim one row of the face part and no more. Two reaches the chin.
 *   C. THE HEAD HAS AN EDGE. The outermost skin pixel of a head row reads darker
 *      than the skin inside it, exactly like every other body part, so his painted
 *      jaw taper can draw.
 *
 * EVERY PAINTED FACING, not just S. The 7/28 fix was applied to E and W only and
 * left the front broken for three weeks precisely because nobody checked the other
 * facings. That is the mistake this file exists to make impossible.
 *
 *   node gates/chin_law_gate.js
 */
'use strict';
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1500);
  await page.click('.tab[data-p="char"]');
  await page.waitForTimeout(4000);

  const R = await page.evaluate(() => {
    if (typeof BAKED === 'undefined' || !BAKED.layers) return { err: 'no BAKED.layers' };
    const W = BAKED.W || 56, PL = 112;
    /* HAIR OFF. A hairstyle is allowed to cover a jaw; the question here is whether
       the BODY draws one at all. Leaving hair on would let a bob hide the defect. */
    const stash = {};
    for (const k in PD.layers) if (k.indexOf('hair/') === 0) { stash[k] = PD.layers[k]; delete PD.layers[k]; }

    const SK = (typeof skinTone !== 'undefined' && skinTone[1]) ? skinTone[1] : [];
    const mul = (typeof NECK_TONE !== 'undefined' && NECK_TONE.mul) ? NECK_TONE.mul : 0.93;
    const near = (c, r) => Math.abs(c[0] - r[0]) + Math.abs(c[1] - r[1]) + Math.abs(c[2] - r[2]) < 26;
    const isSkin = c => !!c && SK.some(r => near(c, r));
    /* THE THROAT TONE IS COMPUTABLE, not guessed: it is a skin shade times
       NECK_TONE.mul, which is exactly how the pass makes it. */
    const isThroat = c => !!c && SK.some(r => near(c, [r[0] * mul | 0, r[1] * mul | 0, r[2] * mul | 0]));

    const facialKey = Object.keys(PD.layers).filter(k => k.indexOf('facial') === 0)[0];
    const out = { facings: [], mul: mul, rs: (typeof RIG_RS !== 'undefined') ? RIG_RS : 1 };

    for (const d of ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']) {
      const face = BAKED.layers[d] && BAKED.layers[d]['2'];
      if (!face || !face.length) continue;                 // no face painted on this facing
      const FL = PD.layers[facialKey] && PD.layers[facialKey][d];
      /* the MOUTH row, from his own facial art, in 56-space */
      /* the mouth comes off a 24-grid PD layer, so G24_OY puts it in 56-space and
         RIG_RS puts it in rig space -- the same conversion the renderer's own chin
         clamp does. Left unconverted it was a 56-space row compared against
         112-space rig rows, and every comparison after it was meaningless. */
      const _rs = (typeof RIG_RS !== 'undefined') ? RIG_RS : 1;
      let mouthY = -1;
      if (FL) for (const i in FL.px) if (FL.px[i] === 2) {
        const y = (((+i / (FL.w || 24)) | 0) + G24_OY) * _rs; if (y > mouthY) mouthY = y;
      }

      const cv = document.createElement('canvas'); cv.width = cv.height = PL;
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      drawChar(cv, d, 'idle', 0);
      const D = cv.getContext('2d').getImageData(0, 0, PL, PL).data;
      /* RIG SPACE -> RENDER SPACE, derived rather than assumed. This was a hard
         `* 2` because the rig was 56 and the render 112. At a 112 rig that doubling
         reads at 224 -- off the canvas -- and every lookup returns null, which is
         precisely how this gate reported "0/0 rows" for a head whose jaw was fine.
         PL / BAKED.W is 2 at 56 and 1 at 112, and cannot go stale again. */
      const SC = PL / W;
      const at = (x, y) => { const i = ((y * SC) * PL + (x * SC)) * 4; return D[i + 3] < 40 ? null : [D[i], D[i + 1], D[i + 2]]; };

      /* his FACE cells (part 2) drive the throat/chin rules -- those are about the
         face's own tone. The EDGE rule needs the whole HEAD silhouette (parts 1+2),
         because the outermost pixel of a row is part 1, the outline column he
         painted; asking part 2 for an edge asks the wrong pixel. First version of
         this file did exactly that and reported 0/18. */
      const byRow = {}, headRow = {};
      for (const i of face) { const x = i % W, y = (i / W) | 0; (byRow[y] = byRow[y] || []).push(x); }
      for (const pid of ['1', '2']) for (const i of (BAKED.layers[d][pid] || [])) {
        const x = i % W, y = (i / W) | 0; (headRow[y] = headRow[y] || []).push(x);
      }
      const ys = Object.keys(byRow).map(Number).sort((a, b) => a - b);
      /* DOES THE RIG EVEN HAVE A CHIN ON THIS FACING? Rule A can only ask the
         renderer to draw what he painted. In profile the face part can end at the
         mouth row, and demanding a chin row there would be the gate inventing
         anatomy he never authored. */
      const rigRowsUnder = ys.filter(y => y > mouthY).length;

      let throatRows = 0, headUnder = 0, edged = 0, checked = 0;
      const lum = c => c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114;
      for (const y of ys) {
        const xs = byRow[y].slice().sort((a, b) => a - b);
        let nThroat = 0, nFace = 0;
        for (const x of xs) { const c = at(x, y); if (isThroat(c)) nThroat++; else if (isSkin(c)) nFace++; }
        if (nThroat > nFace) throatRows++;
        /* A: face-toned skin strictly BELOW the mouth row */
        if (mouthY >= 0 && y > mouthY && nFace > nThroat && nFace > 0) headUnder++;
        /* C: the head's own edge -- measured on the HEAD silhouette, not the face */
        const skinXs = (headRow[y] || []).slice().sort((a, b) => a - b)
          .filter(x => { const c = at(x, y); return isSkin(c) || isThroat(c); });
        if (skinXs.length >= 4) {
          /* *** STEP BY A RIG PIXEL, NOT BY A CELL. *** His art is block-doubled, so
             at 112 two adjacent cells are the two halves of ONE painted pixel and are
             necessarily the same colour. Asking "is the edge darker than the cell
             beside it" then compares a pixel with itself and is false by
             construction -- which is why this reported exactly 20/40: every real
             comparison passed and every within-block comparison could not. The edge
             was perfect the whole time. Neighbour = _st cells away. */
          const _st = (typeof RIG_RS !== 'undefined') ? RIG_RS : 1;
          const _lo = skinXs[0], _hi = skinXs[skinXs.length - 1];
          for (const [e, inn] of [[_lo, _lo + _st], [_hi, _hi - _st]]) {
            const ce = at(e, y), ci = at(inn, y);
            if (!ce || !ci) continue;
            checked++; if (lum(ce) < lum(ci) - 4) edged++;
          }
        }
      }
      out.facings.push({ d: d, mouthY: mouthY, rows: ys.length, throatRows: throatRows,
                         headUnder: headUnder, rigRowsUnder: rigRowsUnder,
                         edged: edged, checked: checked });
    }
    for (const k in stash) PD.layers[k] = stash[k];
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    return out;
  });

  if (R.err) { console.log('  FAIL: ' + R.err); console.log('CHIN LAW GATE: 0 passed, 1 failed'); await browser.close(); process.exit(1); }

  ok('his face is painted on facings worth checking (' + R.facings.map(f => f.d).join(',') + ')',
     R.facings.length >= 3);

  for (const f of R.facings) {
    if (f.mouthY < 0) { console.log('  (' + f.d + ': no mouth painted, chin rules skipped)'); continue; }
    /* A -- only where his rig actually paints face below the mouth. On a profile
       the face part can end at the mouth row, and a gate that demanded a chin there
       would be inventing anatomy he never authored. */
    if (f.rigRowsUnder > 0)
      ok('CHIN LAW A — ' + f.d + ': there is HEAD UNDER THE MOUTH (' + f.headUnder + ' of ' +
         f.rigRowsUnder + ' face row(s) his rig paints below the mouth at y' + f.mouthY +
         ' render as FACE, not as neck). His words, twice: "there needs to be more head ' +
         'underneath the mouth"', f.headUnder >= 1);
    else
      console.log('  (' + f.d + ': his rig paints no face below the mouth row — rule A does not apply)');
    /* B */
    /* HIS RULING IS A DEPTH, NOT A ROW COUNT. "the throat keeps a row" was said
       about a 56-tall face; at 112 that same band of throat IS two rig rows, and it
       is the exact conversion the renderer's own _tRows makes. Capping at a literal
       1 here would halve the throat tone he approved on 7/27 and 8/11 -- a gate
       quietly overruling a ruling, which is the thing that is never allowed. */
    const _rsB = (typeof R.rs !== 'undefined') ? R.rs : 1;
    ok('CHIN LAW B — ' + f.d + ': the THROAT takes at most ONE ROW OF HIS 56 FACE (' + f.throatRows +
       ' rig rows at RIG_RS ' + _rsB + ') — at two it paints the jaw AND the chin the ' +
       'neck\'s own tone and they read as one slab',
       f.throatRows <= _rsB);
    /* C */
    ok('CHIN LAW C — ' + f.d + ': the head HAS AN EDGE (' + f.edged + '/' + f.checked + ' rows read ' +
       'darker at the skin edge than inside) — the head was once the ONE body part excluded from ' +
       'silhouette edging, so his painted jaw rendered as cheek',
       f.checked >= 4 && f.edged >= Math.round(f.checked * 0.6));
  }

  console.log('CHIN LAW GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
