/* THE RUNWAY, BEFORE AND AFTER -- a picture, on the real rig (9/5/26, COOK lane).
 *
 * SHOW ME PICTURES IN A TAB (8/8) and VERIFY ON THE REAL SURFACE (7/18): a shape
 * that has only ever been measured has not been looked at, and every real defect
 * this lane has found this month was found by LOOKING (the strand bar down the
 * crown, the three pink heads, the fall that let go at the jaw). The ASCII harness
 * that drove the cook is a mannequin; this is the alpha's own buildFrame.
 *
 * WHAT IT DRAWS. One row per new shape. LEFT is the wardrobe as it stood this
 * morning -- the nearest thing already in it -- and RIGHT is the new cut, on the
 * same body, in the same colour, at the same size. THE COMPARISON IS THE POINT
 * (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md): the third
 * column names, in plain words, the structural rule that was taken off the real
 * garment this is modelled on, so DIRECTION can judge the comparison and not just
 * the candidate. Three facings each, because a garment that reads from one angle
 * and not another is the failure four haircuts were cut for on 8/28.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back.
 * Never touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)   joints: none   parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every pixel on this sheet is the
 * alpha's own generator output over the alpha's own rig; this tool arranges,
 * labels and scales. It opens no bank because it draws nothing of its own.
 *
 *   node tools/bohemia_runway_picture_9_5_26.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'slices/look/runway-before-after.png');

const src = fs.readFileSync(ALPHA, 'utf8');
const GENS = ['genTop', 'genPants', 'genShoes', 'genCoat', 'genAcc', 'genHat', 'genCape'];
function grab(n) {
  const i = src.indexOf('function ' + n + '('); if (i < 0) throw new Error('missing ' + n);
  const st = src.indexOf('{', i); let d = 0;
  for (let k = st; k < src.length; k++) { if (src[k] === '{') d++; else if (src[k] === '}') { d--; if (!d) return src.slice(i, k + 1); } }
  throw new Error('unterminated ' + n);
}
const GENSRC = ['rsc', 'fr', 'mix', 'bshade', 'ext', 'pExt'].concat(GENS).map(grab).join('\n');

/* label, BEFORE fit, AFTER fit, the rule taken, and the crop worth looking at */
const F = (top, legs, feet, outer, acc, hat, back) => ({ top: top, legs: legs, feet: feet, outer: outer, acc: acc, hat: hat, back: back });
const ROWS = [
  ['DROP RISE TROUSER',
   F({ sleeves: 'long' }, {}, {}), F({ sleeves: 'long' }, { cut: 'drop' }, {}),
   'the crotch seam sits low; widest at the hip, narrowest at the floor', 0.26, 1.0],
  ['WIDE PLEAT TROUSER',
   F({ sleeves: 'long' }, {}, {}), F({ sleeves: 'long' }, { cut: 'wide' }, {}),
   'high waist, the leg opens all the way down, pleated', 0.26, 1.0],
  ['STACKED JERSEY PANT',
   F({ sleeves: 'long' }, {}, {}), F({ sleeves: 'long' }, { cut: 'stack' }, {}),
   'a leg cut longer than the leg, so it pools in folds over the boot', 0.40, 1.0],
  ['CROPPED WORK TROUSER',
   F({ sleeves: 'long' }, { cut: 'short' }, {}), F({ sleeves: 'long' }, { cut: 'crop' }, {}),
   'cut above the ankle over a big shoe -- proportional contrast', 0.40, 1.0],
  ['MID SHAFT BOOT',
   F({ sleeves: 'long' }, {}, { shaft: 'tall' }), F({ sleeves: 'long' }, {}, { shaft: 'mid' }),
   'the middle of the rail: between the ankle shoe and the knee boot', 0.62, 1.0],
  ['SLOUCH BOOT',
   F({ sleeves: 'long' }, {}, { shaft: 'tall' }), F({ sleeves: 'long' }, {}, { shaft: 'slouch' }),
   'a tall shaft that collapses instead of standing rigid', 0.55, 1.0],
  ['STACKED SOLE BOOT',
   F({ sleeves: 'long' }, {}, {}), F({ sleeves: 'long' }, {}, { sole: 'stack' }),
   'a thick stacked sole that lifts the shoe and overhangs the foot', 0.62, 1.0],
  ['WIDE SHOULDER TEE',
   F({ sleeves: 'short' }, {}, {}), F({ sleeves: 'short', shoulder: 'wide' }, {}, {}),
   'boxy oversized shoulder against a narrow lower half', 0.20, 0.72],
  ['LONGLINE JERSEY',
   F({ sleeves: 'long' }, {}, {}), F({ sleeves: 'long', cut: 'long' }, {}, {}),
   'a longline top that carries past the hip', 0.20, 0.80],
  /* --- BATCH 2: the outer rail, and the two flattest rails in the game --- */
  ['WRAP COAT',
   F({ sleeves: 'long' }, {}, {}, { len: 0.56 }), F({ sleeves: 'long' }, {}, {}, { wrap: true, len: 0.56 }),
   'no front opening at all: one panel crosses and a belt holds it', 0.20, 0.92],
  ['ASYMMETRIC COAT',
   F({ sleeves: 'long' }, {}, {}, { len: 0.56 }), F({ sleeves: 'long' }, {}, {}, { asym: true, len: 0.56 }),
   'the hem cut on a slant -- one side long, one side short', 0.20, 0.92],
  ['COCOON COAT',
   F({ sleeves: 'long' }, {}, {}, { len: 0.56 }), F({ sleeves: 'long' }, {}, {}, { cocoon: true, len: 0.56 }),
   'widest at the body, narrowing to the hem: the inverse of an A-line', 0.20, 0.92],
  ['DRAPED COWL',
   F({ sleeves: 'long' }, {}, {}, null, { kind: 'scarf' }), F({ sleeves: 'long' }, {}, {}, null, { kind: 'cowl' }),
   'a mass on the shoulders, not a ring on the neck', 0.14, 0.62],
  ['HAND WRAPS',
   F({ sleeves: 'short' }, {}, {}, null, { kind: 'gloves' }), F({ sleeves: 'short' }, {}, {}, null, { kind: 'handwrap' }),
   'strapping that runs past the wrist; every glove stopped at the hand', 0.34, 0.78],
  /* --- BATCH 3: the waist, the back, and the hat nobody wore --- */
  ['WIDE WAIST WRAP',
   F({ sleeves: 'long' }, {}, {}, null, { kind: 'belt' }), F({ sleeves: 'long' }, {}, {}, null, { kind: 'wrapbelt' }),
   'a deep wrapped band up the ribs; the belt beside it is two rows', 0.26, 0.80],
  ['ONE-SHOULDER DRAPE',
   F({ sleeves: 'long' }, {}, {}, null, null, null, {}), F({ sleeves: 'long' }, {}, {}, null, null, null, { oneShoulder: true }),
   'cape and mantle are both mirror-symmetric; this one is not', 0.20, 0.92],
  ['HEAD WRAP',
   F({ sleeves: 'long' }, {}, {}, null, null, { kind: 'beanie' }), F({ sleeves: 'long' }, {}, {}, null, null, { kind: 'wrap' }),
   'BUILT ALL ALONG AND NOBODY WORE IT -- found by diffing what the engine can draw against what the wardrobe asks for', 0.06, 0.46],
  ['THE WHOLE FIT',
   F({ sleeves: 'long' }, {}, {}),
   F({ sleeves: 'long', shoulder: 'wide', cut: 'long' }, { cut: 'drop' }, { shaft: 'mid', sole: 'stack' }),
   'everything at once: big up top, low rise, heavy boot', 0.14, 1.0],
];
const CLOTH = { dk: [32, 30, 32], mid: [54, 52, 54], lt: [80, 78, 80], mid2: [46, 44, 46], sole: [20, 18, 20] };
const LEG   = { dk: [42, 42, 44], mid: [70, 70, 74], lt: [100, 100, 104], mid2: [58, 58, 62], sole: [26, 26, 28] };
const SHOE  = { dk: [60, 42, 28], mid: [92, 66, 44], lt: [124, 92, 64], mid2: [76, 54, 36], sole: [34, 24, 16] };
const OUTR  = { dk: [70, 64, 56], mid: [104, 96, 84], lt: [142, 132, 116], mid2: [88, 80, 70], sole: [44, 40, 34] };

(async () => {
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1500, height: 2000 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await pg.waitForFunction(() => typeof window.buildFrame === 'function' || typeof buildFrame === 'function', { timeout: 45000 });

  const png = await pg.evaluate(({ gensrc, rows, cloth, leg, shoe, outr }) => {
    const make = (CW, dir) => new Function('CW', 'CH', 'curDir', 'CLO_NOSTITCH',
      'var AMB=[67,61,56];\n' + gensrc + '\nreturn {genTop:genTop,genPants:genPants,genShoes:genShoes,genCoat:genCoat,genAcc:genAcc,genHat:genHat,genCape:genCape};')(CW, CW, dir, false);
    const DIRS = ['S', 'E', 'N'];
    const frames = {};
    for (const d of DIRS) { const f = buildFrame(d, 'idle', 0); frames[d] = { px: f.px, grid: f.grid, CW: f.CW }; }

    const Z = 4, PAD = 16, LBL = 250, HDR = 128, GAP = 26;
    const W = frames.S.CW, CELL = W * Z;
    const rowH = r => Math.round(W * (r[5] - r[4])) * Z;
    const cv = document.createElement('canvas');
    cv.width = LBL + PAD + (CELL * 3 + GAP) * 2 + PAD * 2 + 40;
    cv.height = HDR + rows.reduce((a, r) => a + rowH(r) + PAD + 26, 0) + 50;
    const c2 = cv.getContext('2d'); c2.imageSmoothingEnabled = false;
    c2.fillStyle = '#14120f'; c2.fillRect(0, 0, cv.width, cv.height);

    c2.fillStyle = '#f0e6d4'; c2.font = 'bold 30px monospace';
    c2.fillText('THE RUNWAY -- SIXTEEN NEW SHAPES, AND ONE THAT WAS ALWAYS THERE', PAD, 40);
    c2.font = '16px monospace'; c2.fillStyle = '#b8ab95';
    c2.fillText('left: the nearest thing the wardrobe already had. right: the new cut. same body, same colour, same size.', PAD, 66);
    c2.fillText('facing you / side on / from behind, because a garment that reads from one angle only is not a garment.', PAD, 88);
    c2.font = 'bold 16px monospace';
    c2.fillStyle = '#c98a6a'; c2.fillText('BEFORE', LBL + PAD, HDR - 12);
    c2.fillStyle = '#8fc07a'; c2.fillText('AFTER', LBL + PAD + CELL * 3 + GAP, HDR - 12);

    const paint = (fitOpts, dir, dx, dy, y0, y1) => {
      const f = frames[dir], g = f.grid, GG = make(W, dir);
      const im = c2.createImageData(W, W), D = im.data;
      for (let i = 0; i < W * W; i++) { const c = f.px[i], o = i * 4;
        if (c) { D[o] = c[0]; D[o + 1] = c[1]; D[o + 2] = c[2]; D[o + 3] = 255; } }
      /* the game's own layer order for these three: base, legs, feet */
      const layers = [];
      try { layers.push(GG.genTop(g, Object.assign({ ramp: cloth }, fitOpts.top))); } catch (e) {}
      try { layers.push(GG.genPants(g, Object.assign({ ramp: leg }, fitOpts.legs))); } catch (e) {}
      try { layers.push(GG.genShoes(g, Object.assign({ ramp: shoe }, fitOpts.feet))); } catch (e) {}
      if (fitOpts.outer) { try { layers.push(GG.genCoat(g, Object.assign({ ramp: outr }, fitOpts.outer))); } catch (e) {} }
      if (fitOpts.acc)   { try { layers.push(GG.genAcc(g,  Object.assign({ ramp: outr }, fitOpts.acc)));   } catch (e) {} }
      if (fitOpts.hat)   { try { layers.push(GG.genHat(g,  Object.assign({ ramp: outr }, fitOpts.hat)));   } catch (e) {} }
      if (fitOpts.back)  { try { layers.push(GG.genCape(g, Object.assign({ ramp: outr }, fitOpts.back)));  } catch (e) {} }
      for (const out of layers) for (const k in out) { const i = +k, c = out[k]; if (!c) continue; const o = i * 4;
        D[o] = c[0]; D[o + 1] = c[1]; D[o + 2] = c[2]; D[o + 3] = 255; }
      const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = W;
      tmp.getContext('2d').putImageData(im, 0, 0);
      const sy = Math.round(W * y0), sh = Math.round(W * (y1 - y0));
      c2.drawImage(tmp, 0, sy, W, sh, dx, dy, W * Z, sh * Z);
    };

    let y = HDR;
    for (const row of rows) {
      const [label, before, after, rule, y0, y1] = row;
      c2.fillStyle = '#e8dcc6'; c2.font = 'bold 16px monospace';
      c2.fillText(label, PAD, y + 22);
      c2.fillStyle = '#7d7near'; c2.fillStyle = '#8a7f6d'; c2.font = '12px monospace';
      /* wrap the taken rule to the label gutter */
      const words = rule.split(' '); let line = '', ly = y + 44;
      for (const wd of words) { if ((line + ' ' + wd).length > 28) { c2.fillText(line, PAD, ly); ly += 15; line = wd; } else line = line ? line + ' ' + wd : wd; }
      c2.fillText(line, PAD, ly);
      DIRS.forEach((d, k) => {
        paint(before, d, LBL + PAD + k * CELL, y, y0, y1);
        paint(after, d, LBL + PAD + CELL * 3 + GAP + k * CELL, y, y0, y1);
      });
      y += rowH(row) + PAD + 26;
    }
    c2.fillStyle = '#6f6455'; c2.font = '13px monospace';
    c2.fillText('every pixel here is the alpha\'s own generator over the alpha\'s own rig. nothing was drawn by hand for this sheet.', PAD, cv.height - 18);
    return cv.toDataURL('image/png').split(',')[1];
  }, { gensrc: GENSRC, rows: ROWS, cloth: CLOTH, leg: LEG, shoe: SHOE, outr: OUTR });

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  if (errs.length) console.log('page errors: ' + errs.slice(0, 3).join(' | '));
  console.log('wrote ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024 | 0) + ' KB)');
  await browser.close();
})();
