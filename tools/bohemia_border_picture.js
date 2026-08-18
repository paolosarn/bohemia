/* BOHEMIA THE BORDER, BEFORE AND AFTER, AS A PICTURE (Paolo 8/14 + 8/8)
 *
 * 8/14: "the black border has to be thinner, like half as thin."
 * 8/8 LOOK LAW: "just give me pictures and put it in a tab."
 *
 * One picture, for the LOOK tab. Same character, same clip, same facing, same size
 * on screen. The ONLY thing that changed is when the border pass runs: it used to be
 * drawn on the 56 composition and then doubled by the Scale2x that takes the frame
 * to 112, so it arrived 2px thick; it now runs after the upscale and arrives at 1px.
 *
 * *** REWRITTEN 8/18: IT SHOOTS THE LIVE ALPHA NOW, AND HERE IS WHY IT HAD TO BE. ***
 * v1 loaded both halves from records/2x/before/*.png and records/2x/border/*.png --
 * captures taken once, by hand, on 8/16. THOSE FILES ARE NOT IN THE REPO. So the
 * moment anybody needed to retake this picture the tool died on a missing input, and
 * because the LOOK gate clocks every picture against the surface it photographs, the
 * shot went stale and NO LANE COULD CLEAR IT -- the PEOPLE lane hit it, correctly
 * refused to weaken the check to make its own push green, and handed it back here.
 * A PICTURE NOBODY CAN RETAKE IS A DEAD PICTURE, and a tool whose inputs live outside
 * the repo is a tool that works exactly once.
 *
 * Both halves now come out of the alpha's OWN composition function, in one page load:
 *   AFTER   buildFrameCached(d,clip,ph,true)  -> Scale2x -> applyCharOutline at 112
 *   BEFORE  buildFrameCached(d,clip,ph,false) -> Scale2x        (outline already at 56,
 *                                                                so Scale2x doubles it)
 * That second line IS the old renderer, reconstructed out of the parts the current one
 * still has -- the `_noOutline` argument exists precisely because the outline pass was
 * lifted out of the composition. No second drawing path, no re-implementation, nothing
 * that could flatter the result. (VERIFY ON THE REAL SURFACE, 7/18.)
 *
 * The zoom panel is there because the whole claim is a PIXEL COUNT, and a claim
 * about single pixels shown at 1x is not a claim anybody can check.
 *
 * RIG CHECK (RIG IS LAW, Paolo 7/26/26): renders and photographs, writes nothing back.
 *   It never touches BAKED, a joint, a bone or a painted pixel, and sets no globals --
 *   it calls buildFrameCached with the flag the renderer itself passes.
 *   built on: BAKED
 *   joints: none named
 *   parts: none named
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every pixel in the output is the alpha's
 * own rendered character; the tool only arranges, labels and zooms.
 *
 *   node tools/bohemia_border_picture.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'slices/look/border-one-pixel.png');

const SHOTS = [['S', 'idle', 0], ['SE', 'walk', 0.25], ['E', 'idle', 0]];

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  page.on('pageerror', e => console.log('PAGEERR: ' + e.message.slice(0, 110)));
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(3000);

  /* CAPTURE BOTH RENDERERS, off the live rig, through the real composition */
  const pairs = await page.evaluate((SHOTS) => {
    const toPNG = (px, W, H) => {
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const x = cv.getContext('2d'); x.imageSmoothingEnabled = false;
      const img = x.createImageData(W, H);
      for (let i = 0; i < px.length; i++) {
        const c = px[i], o = i * 4;
        if (c) { img.data[o] = c[0]; img.data[o + 1] = c[1]; img.data[o + 2] = c[2]; img.data[o + 3] = 255; }
        else img.data[o + 3] = 0;
      }
      x.putImageData(img, 0, 0);
      return cv.toDataURL('image/png');
    };
    const up = (px, W, H) => {
      const idx = px.map(c => c ? ((c[0] << 16) | (c[1] << 8) | c[2]) + 1 : 0);
      const s = Scale2x.scale2x(idx, W, H);
      return { px: s.data.map(v => v ? [(v - 1) >> 16 & 255, (v - 1) >> 8 & 255, (v - 1) & 255] : null), W: s.W, H: s.H };
    };
    const out = [];
    for (const [d, clip, ph] of SHOTS) {
      /* BEFORE: composition WITH the outline baked in at 56, then doubled */
      try { FRAME_CACHE.map.clear(); } catch (e) {}
      const fb = buildFrameCached(d, clip, ph, false);
      const b = up(fb.px, fb.CW, fb.CH);
      /* AFTER: composition WITHOUT it, doubled, outline drawn at 112 */
      try { FRAME_CACHE.map.clear(); } catch (e) {}
      const fa = buildFrameCached(d, clip, ph, true);
      const a = up(fa.px, fa.CW, fa.CH);
      applyCharOutline(a.px, a.W, a.H);
      out.push({ label: d + ' ' + clip, a: toPNG(b.px, b.W, b.H), b: toPNG(a.px, a.W, a.H), S: a.W });
    }
    try { FRAME_CACHE.map.clear(); HD_CACHE.map.clear(); } catch (e) {}
    return out;
  }, SHOTS);

  if (!pairs.length) { console.log('BORDER PICTURE: nothing captured'); process.exit(1); }
  const RS = pairs[0].S;

  const png = await page.evaluate(async ({ pairs, RS }) => {
    const imgs = await Promise.all(pairs.flatMap(p => [p.a, p.b]).map(src =>
      new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = src; })));

    const Z = 3, S = RS * Z, PAD = 26, TOP = 96, ROWLBL = 30, GAP = 26;
    const zoomH = 150;
    const cv = document.createElement('canvas');
    cv.width = PAD * 2 + pairs.length * (S + PAD) - PAD;
    cv.height = TOP + 2 * (ROWLBL + S + GAP) + zoomH + PAD;
    const x = cv.getContext('2d');
    x.imageSmoothingEnabled = false;
    x.fillStyle = '#0d0d12'; x.fillRect(0, 0, cv.width, cv.height);

    x.textAlign = 'left';
    x.fillStyle = '#e8e2d2'; x.font = 'bold 28px monospace';
    x.fillText('THE BLACK BORDER IS ONE PIXEL NOW', PAD, 42);
    x.fillStyle = '#9a94a6'; x.font = '16px monospace';
    x.fillText('"the black border has to be thinner, like half as thin"  —  8/14', PAD, 66);
    x.fillStyle = '#6f6a7c'; x.font = '14px monospace';
    x.fillText('same character, same size on screen. only WHEN the border is drawn changed.', PAD, 86);

    for (let r = 0; r < 2; r++) {
      const y0 = TOP + r * (ROWLBL + S + GAP) + ROWLBL;
      x.fillStyle = r ? '#8fe89a' : '#d8a06a';
      x.font = 'bold 17px monospace';
      x.fillText(r ? 'AFTER — 1 pixel' : 'BEFORE — 2 pixels', PAD, y0 - 10);
      for (let i = 0; i < pairs.length; i++) {
        const ox = PAD + i * (S + PAD);
        x.drawImage(imgs[i * 2 + r], ox, y0, S, S);
        x.strokeStyle = 'rgba(255,255,255,0.10)'; x.lineWidth = 1;
        x.strokeRect(ox + 0.5, y0 + 0.5, S, S);
      }
    }

    /* the count, visible */
    const zy = TOP + 2 * (ROWLBL + S + GAP) + 6;
    x.fillStyle = '#e8e2d2'; x.font = 'bold 17px monospace';
    x.fillText('THE EDGE OF THE FACE, ZOOMED 11x', PAD, zy);
    const ZZ = 11, CROP = 10;
    for (let r = 0; r < 2; r++) {
      const src = imgs[r];
      const tmp = document.createElement('canvas'); tmp.width = tmp.height = RS;
      const tc = tmp.getContext('2d'); tc.imageSmoothingEnabled = false;
      tc.drawImage(src, 0, 0);
      const D = tc.getImageData(0, 0, RS, RS).data;
      const fy = Math.round(RS * 0.25);
      let fx = 0;
      for (let x2 = 0; x2 < RS; x2++) if (D[(fy * RS + x2) * 4 + 3] > 40) { fx = x2; break; }
      const ox = PAD + r * (CROP * ZZ + 70), oy = zy + 14;
      x.drawImage(tmp, fx - 1, fy - 4, CROP, CROP, ox, oy, CROP * ZZ, CROP * ZZ);
      x.strokeStyle = 'rgba(255,255,255,0.16)'; x.lineWidth = 1;
      for (let g = 0; g <= CROP; g++) {
        x.beginPath(); x.moveTo(ox + g * ZZ + 0.5, oy); x.lineTo(ox + g * ZZ + 0.5, oy + CROP * ZZ); x.stroke();
        x.beginPath(); x.moveTo(ox, oy + g * ZZ + 0.5); x.lineTo(ox + CROP * ZZ, oy + g * ZZ + 0.5); x.stroke();
      }
      x.fillStyle = r ? '#8fe89a' : '#d8a06a'; x.font = 'bold 14px monospace';
      x.fillText(r ? 'AFTER' : 'BEFORE', ox, oy + CROP * ZZ + 20);
    }
    return cv.toDataURL('image/png').split(',')[1];
  }, { pairs, RS });

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('BORDER PICTURE: wrote ' + OUT + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) +
              ' KB), shot live at ' + RS + 'px from ' + pairs.length + ' facings');
  await browser.close();
})();
