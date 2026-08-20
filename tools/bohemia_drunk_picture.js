/* BOHEMIA THE ONE ANIMATION THAT JERKED, BEFORE AND AFTER (Paolo 8/8 LOOK LAW)
 *
 * "just give me pictures and put it in a tab."
 *
 * The drunk walk teleported sideways once every two seconds, and had done since it
 * was written. One term in its pose ran at HALF the frequency of every other term in
 * the same line, so it started the bar at +0.96 and ended at -0.96 -- it flipped sign
 * across the wrap, and it drives the hip position.
 *
 * The picture is the wrap itself: the last four frames of the bar and the first four
 * of the next, with the seam marked. Top row is the old maths, bottom is the shipped
 * one. Both are rendered HERE, in one page load, by borrowing POSE.drunk and putting
 * it straight back -- so the "before" is the real old renderer rather than a
 * screenshot from memory, and neither row can flatter the other.
 *
 * RIG CHECK (RIG IS LAW, Paolo 7/26/26): borrows POSE.drunk around two renders and
 *   restores it in a finally, the same borrow-and-restore famPaintBody proved. It
 *   authors no pixel, touches no painted region and leaves no global changed.
 *   built on: POSE, drawChar, FRAME_CACHE
 *   joints: none named
 *   parts: none named
 *
 * REUSE CHECK: cooks no new graphic pixels. Every figure is the alpha's own render.
 *
 *   node tools/bohemia_drunk_picture.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'slices/look/the-drunk-seam.png');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  page.on('pageerror', e => console.log('PAGEERR ' + e.message.slice(0, 110)));
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(4000);

  const png = await page.evaluate(() => {
    const K = (typeof FRAME_CACHE !== 'undefined' && FRAME_CACHE.buckets) || 24;
    const SHOW = [K - 4, K - 3, K - 2, K - 1, 0, 1, 2, 3];
    const S = 104, PAD = 7, HEAD = 118, ROWL = 26, GAP = 14;
    const cv = document.createElement('canvas');
    cv.width = PAD + SHOW.length * (S + PAD);
    cv.height = HEAD + 2 * (ROWL + S + GAP + 56) + 10;
    const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
    g.fillStyle = '#d9d4c8'; g.fillRect(0, 0, cv.width, cv.height);

    g.textAlign = 'left';
    g.fillStyle = '#1a1712'; g.font = 'bold 24px monospace';
    g.fillText('THE DRUNK WALK JUMPED EVERY TWO SECONDS', PAD, 38);
    g.fillStyle = '#5a4a2a'; g.font = '14px monospace';
    g.fillText('one number in it ran at half the speed of everything beside it, so it', PAD, 62);
    g.fillText('ended the loop on the opposite side from where it started.', PAD, 80);
    g.fillStyle = '#7a6a4a'; g.font = '13px monospace';
    g.fillText('the red line is where the animation restarts. watch the hips cross it.', PAD, 102);

    const tmp = document.createElement('canvas'); tmp.width = tmp.height = 112;
    const keep = POSE.drunk;
    /* PLOT WHERE THE BODY ACTUALLY IS, because the jump is 3.5px on a 112px figure
       and a row of stills does not show it. The dot is the MEASURED horizontal centre
       of the drawn pixels -- not the rig's own number -- so the chart cannot agree
       with the pose maths out of politeness. */
    const centreOf = (c) => {
      const d = c.getContext('2d').getImageData(0, 0, 112, 112).data;
      let sum = 0, n = 0;
      for (let y = 0; y < 112; y++) for (let x = 0; x < 112; x++)
        if (d[(y * 112 + x) * 4 + 3] > 8) { sum += x; n++; }
      return n ? sum / n : 56;
    };
    const row = (y0, label, colour) => {
      g.fillStyle = colour; g.font = 'bold 15px monospace';
      g.fillText(label, PAD, y0 + 16);
      /* POSEHOLD_CACHE TOO, and forgetting it made the first two shots of this picture
         a LIE: the before row rendered with the override, cached the posed skeletons,
         and the after row was then served those same cached poses. Both rows came out
         byte-identical and the trace under each read 12.5px, which looked like a
         result. A cache you forget to clear does not error, it agrees with you. */
      try { FRAME_CACHE.map.clear(); HD_CACHE.map.clear(); POSEHOLD_CACHE.clear(); } catch (e) {}
      const cx = [];
      SHOW.forEach((f, i) => {
        try { drawChar(tmp, 'SE', 'drunk', f / K); } catch (e) {}
        cx.push(centreOf(tmp));
        g.drawImage(tmp, PAD + i * (S + PAD), y0 + ROWL, S, S);
      });
      const x = PAD + 4 * (S + PAD) - 4;
      g.strokeStyle = '#a03020'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(x, y0 + ROWL - 4); g.lineTo(x, y0 + ROWL + S + 4); g.stroke();
      /* the trace, under the frames */
      const ty = y0 + ROWL + S + 16, span = 22;
      const mn = Math.min.apply(null, cx), mx = Math.max.apply(null, cx);
      const rng = Math.max(1.2, mx - mn);
      g.strokeStyle = colour; g.lineWidth = 2; g.beginPath();
      cx.forEach((v, i) => {
        const px = PAD + i * (S + PAD) + S / 2;
        const py = ty + span - (v - mn) / rng * span;
        i ? g.lineTo(px, py) : g.moveTo(px, py);
      });
      g.stroke();
      g.fillStyle = '#6a5a3a'; g.font = '11px monospace';
      g.fillText('body centre moves ' + (mx - mn).toFixed(1) + 'px across these frames; ' +
                 'the step across the restart is ' +
                 Math.abs(cx[4] - cx[3]).toFixed(1) + 'px', PAD, ty + span + 15);
    };
    try {
      /* THE OLD POSE, COPIED VERBATIM off the commit that shipped it, with the single
         character this picture is about left as it was: ph*Math.PI where every sibling
         uses ph*2*Math.PI. Reconstructing the before by patching the AFTER's output
         was the first attempt and it was wrong -- w feeds four different terms and two
         different branches, so anything short of the real old function is a drawing of
         my assumption rather than of the bug. */
      POSE.drunk = (d, ph) => {
        const s = Math.sin(ph * 2 * Math.PI), w = Math.sin(ph * Math.PI + 1.3),
              m = (RUNMIR[d] ? -1 : 1) * depthFlip(d);
        if (headOn(d)) { const g2 = nsGait(d, ph, 0.7 * SWF()); g2.spine = 0.12 * w; return g2; }
        const as = (ARMSIDE[d] || 1);
        return { spine: 0.14 * w * m, head: -0.1 * w, hipOff: [w * 1.8, -0.8 * Math.abs(s)],
                 thighR: 0.36 * s * m, thighL: -0.36 * s * m,
                 shinR: m * 0.3 * Math.max(0, -s), shinL: m * 0.3 * Math.max(0, s),
                 upL: (-0.3 * s * m + 0.2 * w) * as, upR: (0.3 * s * m + 0.2 * w) * as,
                 foreL: -0.2 * m, foreR: -0.2 * m };
      };
      row(HEAD, 'BEFORE — the hips teleport across the restart', '#a03020');
    } finally { POSE.drunk = keep; }
    /* POSEHOLD_CACHE TOO, and forgetting it made the first two shots of this picture
         a LIE: the before row rendered with the override, cached the posed skeletons,
         and the after row was then served those same cached poses. Both rows came out
         byte-identical and the trace under each read 12.5px, which looked like a
         result. A cache you forget to clear does not error, it agrees with you. */
      try { FRAME_CACHE.map.clear(); HD_CACHE.map.clear(); POSEHOLD_CACHE.clear(); } catch (e) {}
    row(HEAD + ROWL + S + GAP + 56, 'AFTER — it walks through the restart', '#2a6a35');
    /* POSEHOLD_CACHE TOO, and forgetting it made the first two shots of this picture
         a LIE: the before row rendered with the override, cached the posed skeletons,
         and the after row was then served those same cached poses. Both rows came out
         byte-identical and the trace under each read 12.5px, which looked like a
         result. A cache you forget to clear does not error, it agrees with you. */
      try { FRAME_CACHE.map.clear(); HD_CACHE.map.clear(); POSEHOLD_CACHE.clear(); } catch (e) {}
    return cv.toDataURL('image/png').split(',')[1];
  });

  if (!png) { console.log('nothing rendered'); process.exit(1); }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('DRUNK SEAM: wrote ' + OUT + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
  await browser.close();
})();
