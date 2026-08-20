/* BOHEMIA THE BORDER IS ONE PIXEL (Paolo 8/14/26, LOCKED)
 *
 * "the black border has to be thinner, like half as thin"
 * and, looking at the build a day later:
 * "I want that black outline to be. It's thin in some parts and I like that."
 *
 * CHAR_OUTLINE always drew exactly ONE pixel. It drew it on the 56 composition, and
 * drawChar then ran Scale2x over the finished image to reach 112 -- so the one pixel
 * became two on the way to his screen. The pass now runs AFTER the upscale. This
 * gate is the thing that stops it ever sliding back, because the failure is
 * invisible in a diff: the outline code looks correct either way, and it IS correct
 * either way. Only WHERE IT RUNS decides what he sees.
 *
 * FOUR THINGS, all measured on the real render path (VERIFY ON THE REAL SURFACE):
 *
 *   1. ONE PIXEL, EVERY FACING. Measured where SKIN meets the border, because his
 *      coat is near-black and a ruler that cannot tell a garment from the outline
 *      would report success through a total regression. (It did, once: it read
 *      "10px" off his trousers.)
 *   2. THE BODY DID NOT CHANGE. The whole point is that ONLY the border moved. The
 *      gate composes the frame borderless, upscales it exactly as drawChar does,
 *      and requires every non-border pixel of the shipped render to match it. So
 *      "we thinned the border" can never quietly mean "we also resampled him".
 *   3. THE BORDER STILL CLOSES. Thinner must not mean gappy: no character pixel may
 *      sit against transparency with no border pixel between it and the outside.
 *   4. COMBAT AGREES WITH CHARACTER. bake112 feeds the combat module its sprites on
 *      a different path. If only drawChar were fixed he would be outlined 1px in one
 *      tab and 2px in the next, which is exactly the kind of split nobody notices
 *      until he does.
 *
 *   node gates/border_gate.js
 */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await SETTLE(page, 2500);
  await page.click('#front').catch(() => {});
  await SETTLE(page, 1500);

  const R = await page.evaluate(() => {
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const out = { facings: [], err: null, gapTotal: 0, bodyMismatch: 0, bodyChecked: 0 };
    try {
      const SK = (typeof skinTone !== 'undefined' && skinTone[1]) ? skinTone[1] : [];
      const C = CHAR_OUTLINE.color;

      for (const d of DIRS) {
        const cv = document.createElement('canvas');
        try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
        drawChar(cv, d, 'idle', 0);
        const W = cv.width, H = cv.height;
        const D = cv.getContext('2d').getImageData(0, 0, W, H).data;
        const A = i => D[i * 4 + 3] > 40;
        const isBorder = i => A(i) && D[i*4] === C[0] && D[i*4+1] === C[1] && D[i*4+2] === C[2];
        const col = i => [D[i*4], D[i*4+1], D[i*4+2]];
        const isSkin = i => A(i) && SK.some(r => { const c = col(i);
          return Math.abs(c[0]-r[0]) + Math.abs(c[1]-r[1]) + Math.abs(c[2]-r[2]) < 60; });

        /* 1 -- the border where it meets SKIN, never where it meets his black coat */
        const runs = [];
        for (let y = 0; y < H; y++) {
          let skin = 0; for (let x = 0; x < W; x++) if (isSkin(y*W+x)) skin++;
          if (skin < 3) continue;
          let x = 0; while (x < W && !A(y*W+x)) x++;
          if (x >= W) continue;
          let r = 0; while (x + r < W && isBorder(y*W+x+r)) r++;
          if (!r || !isSkin(y*W+x+r)) continue;
          runs.push(r);
        }
        runs.sort((a, b) => a - b);
        const med = runs.length ? runs[runs.length >> 1] : 0;
        const worst = runs.length ? runs[runs.length - 1] : 0;

        /* 3 -- no character pixel may face the outside with no border between */
        let gaps = 0;
        for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
          const i = y*W+x; if (!A(i) || isBorder(i)) continue;
          if (!A(i-1) || !A(i+1) || !A(i-W) || !A(i+W)) gaps++;
        }
        out.gapTotal += gaps;

        /* 2 -- ONLY the border moved. Rebuild what the body should be: compose
           borderless and upscale exactly the way drawChar does, then demand every
           non-border pixel of the shipped frame match it. */
        const f = buildFrame(d, 'idle', 0, true);
        let px = f.px, BW = f.CW, BH = f.CH;
        if (BW !== W) {
          const idx = px.map(c => c ? ((c[0]<<16)|(c[1]<<8)|c[2]) + 1 : 0);
          const s = Scale2x.scale2x(idx, BW, BH);
          px = s.data.map(v => v ? [(v-1)>>16&255, (v-1)>>8&255, (v-1)&255] : null);
          BW = s.W; BH = s.H;
        }
        let mism = 0, chk = 0;
        if (BW === W && BH === H) {
          for (let i = 0; i < W * H; i++) {
            if (isBorder(i)) continue;                 /* the border is allowed to be new */
            const e = px[i], got = A(i) ? col(i) : null;
            if (!e && !got) continue;
            chk++;
            if (!e || !got || e[0] !== got[0] || e[1] !== got[1] || e[2] !== got[2]) mism++;
          }
        }
        out.bodyMismatch += mism; out.bodyChecked += chk;

        out.facings.push({ d: d, W: W, border: med, worst: worst, samples: runs.length,
                           gaps: gaps, mism: mism, chk: chk });
      }

      /* 4 -- the combat sprite path */
      const b = bake112('S', 'idle', 0);
      out.bake = { w: b.w, h: b.h };
      /* Rebuild its pixels from the packed export. TWO FORMATS: packIdx returns a
         flat index array OR an RLE (runLength, paletteIndex) byte-pair stream, and
         it picks whichever is smaller -- so a gate that only understands `idx`
         silently measures nothing on a well-compressed sprite. It did: it reported
         -1 and read as a real failure. The palette is RGBA, stride 4, index 0
         transparent. */
      const pal = b.pal;
      let idx = b.idx;
      if (!idx && b.rle) {
        idx = new Uint8Array(b.w * b.h);
        for (let i = 0, p = 0; p < b.rle.length; p += 2) {
          const run = b.rle[p], v = b.rle[p + 1];
          for (let r = 0; r < run && i < idx.length; r++) idx[i++] = v;
        }
      }
      if (idx) {
        let runsB = [];
        const px2 = (i) => [pal[idx[i]*4], pal[idx[i]*4+1], pal[idx[i]*4+2]];
        const alive = (i) => idx[i] !== 0;
        for (let y = 0; y < b.h; y++) {
          let x = 0; while (x < b.w && !alive(y*b.w+x)) x++;
          if (x >= b.w) continue;
          let r = 0;
          while (x + r < b.w && alive(y*b.w+x+r)) {
            const c = px2(y*b.w+x+r);
            if (c[0] === C[0] && c[1] === C[1] && c[2] === C[2]) r++; else break;
          }
          if (r) runsB.push(r);
        }
        runsB.sort((a, c) => a - c);
        out.bakeBorder = runsB.length ? runsB[runsB.length >> 1] : -1;
      } else out.bakeBorder = -1;
    } catch (e) { out.err = e.message + ' @ ' + (e.stack || '').split('\n')[1]; }
    return out;
  });

  if (R.err) { console.log('  THREW: ' + R.err); await browser.close(); process.exit(1); }
  if (errs.length) console.log('  PAGE ERRORS: ' + errs.slice(0, 3).join(' | '));

  console.log('  facing  border(median)  worst  skin-rows  gaps  body-mismatch');
  for (const f of R.facings)
    console.log('  ' + f.d.padEnd(7) + String(f.border).padStart(8) + String(f.worst).padStart(8) +
                String(f.samples).padStart(10) + String(f.gaps).padStart(7) +
                ('  ' + f.mism + '/' + f.chk).padStart(16));

  /* 1 */
  const bad = R.facings.filter(f => f.border !== 1);
  ok('*** THE BORDER IS ONE PIXEL ON EVERY FACING *** (his ruling: "half as thin" — ' +
     'it was 2, because a 1px border drawn at 56 arrives 2px thick after the Scale2x ' +
     'that takes the frame to 112)' + (bad.length ? ' [' + bad.map(f => f.d + '=' + f.border).join(',') + ']' : ''),
     bad.length === 0);
  const thick = R.facings.filter(f => f.worst > 2);
  ok('and no facing has a fat run hiding behind the median (worst ' +
     Math.max(...R.facings.map(f => f.worst)) + 'px)', thick.length === 0);
  ok('every facing was actually measured against skin, so this is not a ruler that ' +
     'quietly found nothing', R.facings.every(f => f.samples >= 8));

  /* 2 */
  ok('*** ONLY THE BORDER MOVED: ' + R.bodyMismatch + ' of ' + R.bodyChecked + ' non-border ' +
     'pixels differ from the borderless frame upscaled the same way. "We thinned the ' +
     'border" must never quietly also mean "we resampled him"',
     R.bodyChecked > 5000 && R.bodyMismatch === 0);

  /* 3 */
  ok('THE BORDER STILL CLOSES — thinner is not gappy: no character pixel faces the ' +
     'outside without a border pixel between it and empty space (' + R.gapTotal + ' gaps)',
     R.gapTotal === 0);

  /* 4 */
  ok('COMBAT AGREES WITH CHARACTER: the sprites baked for the combat module carry the ' +
     'same one-pixel border (' + R.bakeBorder + 'px at ' + (R.bake ? R.bake.w : '?') + 'px) — ' +
     'fixing only drawChar would outline him 1px in one tab and 2px in the next',
     R.bakeBorder === 1);

  console.log('BORDER GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
