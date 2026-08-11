/* BOHEMIA THE OVERWORLD FACE STRIP (8/11/26, CHARACTER lane)
 *
 * Paolo 8/11: "BRO I MEANT THE TINY PIXEL OVERWORLD FACES."
 *
 * His face on the 56px body, in the facings it is actually painted on (S, SE, E),
 * at feature scale 1.0 / 1.5 / 2.0, cropped to the HEAD and blown up 10x nearest
 * so six pixels of eyes and a two-pixel mouth are something a human can look at.
 *
 * REUSE CHECK: cooks no new graphic pixels. Every head on this sheet is the live
 * drawChar() output of the booted alpha with window.BOH_SPRITE_FACE set -- his
 * painted facial layer, remapped, never redrawn. Nothing here invents a pixel.
 *
 * VERIFY ON THE REAL SURFACE: the heads come out of the real render path in the
 * real alpha, not a re-implementation.
 *
 *   node tools/bohemia_sprite_face_strip.js [out.png]
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = process.argv[2] || path.join(REPO, 'records/OVERWORLD_FACE_SCALE_8_11.png');
/* 1 / 2 / 3, NOT 1 / 1.5 / 2. Measured: x1.5 changes ZERO rendered pixels. The
 * features are one and two pixels wide, so a 1.5 scale of a 2px box rounds back
 * to the same 2px box -- the middle column was a duplicate of the first and I
 * only found that because the gate counts changed pixels instead of trusting the
 * dial. At this size the scale is effectively integer.
 */
const STEPS = [
  { v: 1,                                  label: 'x1  (now)' },
  { v: { eyes: 1, nose: 2, lips: 2 },       label: 'MOUTH x2' },
  { v: 2,                                   label: 'ALL x2' },
  { v: 3,                                   label: 'ALL x3' },
];
const DIRS = ['S', 'SE', 'E'];

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 900, height: 800 }, deviceScaleFactor: 2 });
  page.on('pageerror', e => console.log('PAGEERROR: ' + e.message));
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1500);
  await page.click('.tab[data-p="char"]');
  await page.waitForTimeout(4000);

  const b64 = await page.evaluate(async ({ steps, dirs }) => {
    if (typeof drawChar !== 'function') return { err: 'drawChar missing' };
    /* A WINDOW THAT CANNOT MISS. The first crop was 20x16 centred on the topmost
       painted row, which on a head of hair is the CORNER of the hair -- three
       columns of scalp and no face at all. The head is never wider than this or
       lower than this, so the face is always in frame. */
    /* MEASURED, TWICE, because both guesses were wrong. drawChar does NOT centre the
       body on the canvas: on a 56x56 plate the sprite lands at x36..55, y8..55.
       The first crop chased the topmost painted row and framed the CORNER OF THE
       HAIR; the second assumed a centred body and framed empty space beside him.
       These numbers came off a getImageData bbox of the real draw. */
    /* MEASURED, and the plate size is part of the answer. drawChar does NOT centre
       the body: on a 56x56 canvas the sprite lands at x36..55 and is CLIPPED at the
       right edge -- the face sits in the last two columns, which is why two earlier
       crops framed hair and empty space. On a 112 plate it draws whole, at x36..77,
       y8..107. These numbers came off a getImageData bbox of the real draw, not a
       guess about how the renderer centres things. */
    const PLATE = 112;
    const Z = 6, HW = 44, HH = 30, CX = 35, CY = 6, pad = 12, lab = 30;
    const tmp = document.createElement('canvas'); tmp.width = tmp.height = PLATE;
    const out = document.createElement('canvas');
    out.width = pad + steps.length * (HW * Z + pad);
    out.height = lab + dirs.length * (HH * Z + pad) + pad;
    const o = out.getContext('2d'); o.imageSmoothingEnabled = false;
    o.fillStyle = '#0d0d12'; o.fillRect(0, 0, out.width, out.height);
    for (let si = 0; si < steps.length; si++) {
      window.BOH_SPRITE_FACE = steps[si].v;
      try { HD_CACHE.map.clear(); } catch (e) {}
      try { FRAME_CACHE.map.clear(); } catch (e) {}
      for (let di = 0; di < dirs.length; di++) {
        const tc = tmp.getContext('2d');
        tc.clearRect(0, 0, PLATE, PLATE);
        drawChar(tmp, dirs[di], 'idle', 0);
        const x = pad + si * (HW * Z + pad), y = lab + di * (HH * Z + pad);
        o.drawImage(tmp, CX, CY, HW, HH, x, y, HW * Z, HH * Z);
        o.fillStyle = '#6a5a3e'; o.font = 'bold 18px monospace'; o.textAlign = 'left';
        if (si === 0) o.fillText(dirs[di], 2, y + 20);
      }
      o.fillStyle = (si === 0) ? '#8a8172' : '#e8e2d2';
      o.font = 'bold 18px monospace'; o.textAlign = 'center';
      o.fillText(steps[si].label,
        pad + si * (HW * Z + pad) + HW * Z / 2, 22);
    }
    window.BOH_SPRITE_FACE = 1;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    return { png: out.toDataURL('image/png').split(',')[1] };
  }, { steps: STEPS, dirs: DIRS });

  if (b64.err) { console.log('SPRITE FACE STRIP: ' + b64.err); await browser.close(); process.exit(1); }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(b64.png, 'base64'));
  console.log('SPRITE FACE STRIP: wrote ' + OUT + '  (' + STEPS.map(s => s.label).join(' / ') + ')');
  await browser.close();
})();
