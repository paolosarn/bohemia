/* BOHEMIA -- CLIP CONTACT STRIPS (ANIMATION lane, 9/5/26)
 *
 * The LOOKING half of THE-63-CLIP-AUDIT. The measuring half is
 * tools/bohemia_clip_audit.js; this renders the same clips as pictures so a
 * finding can be checked against what the thing actually looks like.
 *
 * WHY IT IS NOT OPTIONAL, and this repo has paid for it four times: 8/25's
 * edge-parity audit read 50.9% "already native" over nine solid blocks; 8/27's
 * hairline sweep reported zero bare forehead, an 11px median row and one break in
 * forty-five, and every one of those numbers said he was wrong about his own art.
 * WHEN A NUMBER DISAGREES ABOUT A PICTURE, GO AND LOOK AT THE PICTURE, AND THEN
 * FIX THE RULER. So no clip in the audit gets written down as broken until its
 * strip has been looked at.
 *
 * REUSE CHECK (7/22 law): reuses drawChar -- the exact function the CHARACTER tab
 *   calls -- through the same page-evaluate capture shape as tools/bohemia_2x_shots.js,
 *   rather than a second renderer. Nothing here paints a pixel of its own; it
 *   composites drawChar's own canvases onto a strip. banks/ holds no clip imagery,
 *   so there was nothing to source from there.
 *
 * RIG CHECK (RIG IS LAW, 7/26): reads only. Every pixel comes out of drawChar.
 *   built on: BAKED (read, never written)
 *   joints: none named    parts: none named
 *
 * Frames are drawn at the engine's own bucket count and composited at 3x, ABOVE
 * the size the game draws them (8/28: judging art below its shipping size is
 * judging a thumbnail).
 *
 *   node tools/bohemia_clip_strips.js kick stomp dig          # named clips, S + E
 *   node tools/bohemia_clip_strips.js --dir SE kick           # one facing
 */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'records/clipstrips');

const args = process.argv.slice(2);
let dirs = ['S', 'E'];
const clips = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--dir') { dirs = [args[++i]]; }
  else clips.push(args[i]);
}
if (!clips.length) { console.log('usage: node tools/bohemia_clip_strips.js <clip> [clip...] [--dir SE]'); process.exit(1); }

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  if (errs.length) { console.log('ALPHA THREW: ' + errs[0]); await browser.close(); process.exit(1); }

  for (const clip of clips) {
    for (const d of dirs) {
      const R = await page.evaluate(({ clip, d }) => {
        const N = (typeof FRAME_CACHE !== 'undefined' && FRAME_CACHE.buckets) || 24;
        const SC = 3;
        const probe = document.createElement('canvas');
        drawChar(probe, d, clip, 0);
        const W = probe.width, H = probe.height;
        const strip = document.createElement('canvas');
        strip.width = W * SC * N; strip.height = H * SC + 14;
        const g = strip.getContext('2d');
        g.imageSmoothingEnabled = false;
        g.fillStyle = '#20242a'; g.fillRect(0, 0, strip.width, strip.height);
        for (let k = 0; k < N; k++) {
          const cv = document.createElement('canvas');
          drawChar(cv, d, clip, k / N);
          g.drawImage(cv, 0, 0, W, H, k * W * SC, 0, W * SC, H * SC);
          g.fillStyle = (k % 6 === 0) ? '#e0c070' : '#606870';
          g.font = '10px monospace';
          g.fillText(String(k), k * W * SC + 3, H * SC + 11);
          g.strokeStyle = '#3a4048'; g.beginPath();
          g.moveTo(k * W * SC + 0.5, 0); g.lineTo(k * W * SC + 0.5, H * SC); g.stroke();
        }
        return { png: strip.toDataURL('image/png').split(',')[1], W, H, N };
      }, { clip, d });
      const f = path.join(OUT, clip.replace(/[^a-z0-9-]/gi, '_') + '_' + d + '.png');
      fs.writeFileSync(f, Buffer.from(R.png, 'base64'));
      console.log('  ' + clip + ' ' + d + '  ' + R.N + ' frames @ ' + R.W + 'x' + R.H + '  -> ' + path.relative(REPO, f));
    }
  }
  await browser.close();
})();
