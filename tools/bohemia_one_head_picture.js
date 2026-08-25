/* ONE HEAD, ALL EIGHT WAYS (8/25/26, CHARACTER lane).
 *
 * Paolo, round 4, 8/20: "east and west hairstyles look like absolute dog shit across
 * the board." He killed 13 of 15.
 *
 * The backlog row's own judge column asks for exactly one thing and nothing else:
 *   "yes, but ONE HEAD FIRST: show him a single style in profile and let him say the
 *    view is fixed before anything else is queued."
 * So this is one head, not a ballot. THE 21 UNJUDGED STYLES STAY HELD.
 *
 * WHY TEMPLE TAPER: it is one of the TWO he KEPT. If he kept the haircut front-on, then
 * anything he says about its profile is a verdict on THE VIEW rather than on the style,
 * which is the only question this picture is asking.
 *
 * WHAT CHANGED SINCE HE LOOKED, both found by measuring and both profile-only:
 *   1. HIS OWN PAINTED BOB was still drawing under every hairstyle. Front-on the
 *      hairstyle covered it; in profile his paint reaches two cells past the part grid
 *      at the crown, so the near-white in his bob's palette stuck out over the forehead.
 *      1,349 stray pixels across the styles. Now zero.
 *   2. THE FADE STOPPED HALFWAY down the skull in profile instead of tapering at the
 *      bottom of the hair, because one of two copies of the same line never got the
 *      8/2 profile fix.
 *
 * AND WHAT I LOOKED FOR AND DID NOT FIND, so he is not told a story:
 *   - that the styles collapse into one shape in profile. MEASURED: east and west are
 *     127% and 128% as distinct as south, closest pair six times further apart.
 *   - that the three back facings had collapsed into one. MEASURED: all eight facings
 *     produce different bodies and different hair.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every pixel is the alpha's own render.
 *
 *   node tools/bohemia_one_head_picture.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'slices/look/one-head.png');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 1100 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS, { timeout: 30000 });

  const png = await p.evaluate(() => {
    const STYLE = 'TEMPLE TAPER';
    const DIRS = ['S', 'E', 'W'];
    const keep = window.G_WORN, keepH = G.equipped.hair;
    /* BARE MEANS BARE: nothing worn AND his painted hair layer pulled, so the top row
       is the head he painted and nothing else. That comparison is the useful one --
       if the head underneath reads as a person and the haired one does not, the gap is
       the hair's shape, which is my code and fixable. */
    const frame = (d, bare) => {
      window.G_WORN = bare ? null : { hair: STYLE, base: 'WHITE TEE', legs: 'BLUE JEANS' };
      G.equipped.hair = bare ? '' : keepH;
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const f = buildFrame(d, 'idle', 0);
      return { px: f.px.slice(), W: f.CW };
    };

    const Z = 15, PAD = 20, HDR = 156;
    const CROP = { x0: 0.27, x1: 0.73, y0: 0.04, y1: 0.32 };
    const cw = Math.round(112 * (CROP.x1 - CROP.x0)) * Z / 2;
    const ch = Math.round(112 * (CROP.y1 - CROP.y0)) * Z / 2;
    const cv = document.createElement('canvas');
    cv.width = 150 + PAD + 3 * (cw + PAD);
    cv.height = HDR + 2 * (ch + 30 + PAD) + 108;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);

    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 30px monospace';
    cx.fillText('IS THE SIDE VIEW FIXED?', PAD, 44);
    cx.font = '17px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('you said east and west looked like dog shit across the board.', PAD, 78);
    cx.fillText('top row is his bare head. bottom row is the same head with hair on.', PAD, 102);
    cx.fillText('one haircut only, the temple taper, which is one you kept.', PAD, 126);

    const blit = (fr, dx, dy) => {
      const N = fr.W, im = cx.createImageData(N, N), D = im.data;
      for (let i = 0; i < N * N; i++) { const c = fr.px[i], o = i * 4;
        if (c) { D[o] = c[0]; D[o+1] = c[1]; D[o+2] = c[2]; D[o+3] = 255; } }
      const t = document.createElement('canvas'); t.width = t.height = N;
      t.getContext('2d').putImageData(im, 0, 0);
      const sx = Math.round(N * CROP.x0), sw = Math.round(N * (CROP.x1 - CROP.x0));
      const sy = Math.round(N * CROP.y0), sh = Math.round(N * (CROP.y1 - CROP.y0));
      cx.drawImage(t, sx, sy, sw, sh, dx, dy, sw * Z / 2, sh * Z / 2);
    };

    const NAMES = { S: 'FRONT', E: 'RIGHT SIDE', W: 'LEFT SIDE' };
    let y = HDR;
    for (const bare of [true, false]) {
      cx.fillStyle = bare ? '#8a7d68' : '#8fc07a';
      cx.font = 'bold 16px monospace';
      cx.fillText(bare ? 'NO HAIR' : 'WITH HAIR', PAD, y + ch / 2);
      DIRS.forEach((d, i) => {
        const x = 150 + PAD + i * (cw + PAD);
        if (bare) { cx.fillStyle = (d !== 'S') ? '#8fc07a' : '#8a7d68';
          cx.font = 'bold 14px monospace'; cx.fillText(NAMES[d], x, y + 18); }
        blit(frame(d, bare), x, y + 26);
      });
      y += ch + 30 + PAD;
    }
    G.equipped.hair = keepH;
    window.G_WORN = keep;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    cx.fillStyle = '#6f6455'; cx.font = '14px monospace';
    cx.fillText('i found and fixed two real things: your own painted hair was showing through', PAD, cv.height - 84);
    cx.fillText('underneath, and the fade stopped halfway down his head.', PAD, cv.height - 64);
    cx.fillText('i then tested three more theories about the side view and all three were wrong.', PAD, cv.height - 44);
    cx.fillStyle = '#c98a6a';
    cx.fillText('SO I NEED YOUR EYE. is the side view good now, or still bad?', PAD, cv.height - 20);
    cx.fillText('the other 21 haircuts stay held until you say.', PAD, cv.height - 2);
    return cv.toDataURL('image/png').split(',')[1];
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
