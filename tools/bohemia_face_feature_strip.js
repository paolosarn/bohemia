/* BOHEMIA FACE FEATURE STRIP (8/11/26, CHARACTER lane)
 *
 * Paolo 8/11: "maybe all eyes eyebrows and mouths should be twice the size idk"
 *
 * "idk" is not a number, so this renders every number and lets him point at one.
 * Five faces, the SAME face, at feature scale 1.0 / 1.25 / 1.5 / 1.75 / 2.0, side
 * by side at 6x nearest-neighbour, on the surface he actually looks at.
 *
 * REUSE CHECK: no new graphic pixels are cooked here. Every face on the strip is
 * the live renderFace() output from the alpha itself, driven through the
 * BOH_FACE_FEAT knob -- nothing is drawn, painted, or invented by this tool. It
 * is a contact sheet of the game's own render.
 *
 * VERIFY ON THE REAL SURFACE: the faces come out of the booted alpha, not a
 * side-door reimplementation, which is the only version that can be trusted.
 *
 *   node tools/bohemia_face_feature_strip.js [out.png]
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = process.argv[2] || path.join(REPO, 'records/FACE_FEATURE_SCALE_8_11.png');
const STEPS = [1, 1.25, 1.5, 1.75, 2];

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 900, height: 700 }, deviceScaleFactor: 2 });
  page.on('pageerror', e => console.log('PAGEERROR: ' + e.message));
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1500);

  const b64 = await page.evaluate((steps) => {
    if (typeof renderFace !== 'function') return { err: 'no renderFace' };
    const Z = 6, N = 64, pad = 10, lab = 34;
    const out = document.createElement('canvas');
    out.width = steps.length * (N * Z + pad) + pad;
    out.height = N * Z + lab + pad * 2;
    const o = out.getContext('2d');
    o.imageSmoothingEnabled = false;
    o.fillStyle = '#0d0d12'; o.fillRect(0, 0, out.width, out.height);
    const tmp = document.createElement('canvas'); tmp.width = tmp.height = N;
    const t = tmp.getContext('2d');
    steps.forEach((s, i) => {
      /* renderFace returns a raw Uint8ClampedArray, not ImageData -- paintPortrait
         does the same wrap. Same ramp the portrait uses so this IS his face. */
      const buf = renderFace(buildSpec ? buildSpec() : PUNK,
        { feat: s, ramp: (typeof portraitRamp === 'function') ? portraitRamp() : undefined });
      const idd = t.createImageData(N, N); idd.data.set(buf); t.putImageData(idd, 0, 0);
      const x = pad + i * (N * Z + pad);
      o.drawImage(tmp, 0, 0, N, N, x, pad, N * Z, N * Z);
      o.fillStyle = (s === 1) ? '#8a8172' : '#e8e2d2';
      o.font = 'bold 22px monospace';
      o.textAlign = 'center';
      o.fillText((s === 1 ? 'x1.0  (now)' : 'x' + s.toFixed(2)), x + N * Z / 2, pad + N * Z + 26);
    });
    return { png: out.toDataURL('image/png').split(',')[1] };
  }, STEPS);

  if (b64.err) { console.log('FACE STRIP: ' + b64.err); await browser.close(); process.exit(1); }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(b64.png, 'base64'));
  console.log('FACE STRIP: wrote ' + OUT + '  (' + STEPS.join(' / ') + ')');
  await browser.close();
})();
