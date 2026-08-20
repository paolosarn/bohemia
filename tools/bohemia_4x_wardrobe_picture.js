/* WHAT THE 4X WARDROBE ACTUALLY BUYS HIM -- a picture, in a tab (8/20/26).
 *
 * Paolo 8/20: "i need you to remake all the clothes and hairs with the 4x pixels
 * we now have in mind is that okay?"
 *
 * The conversion is invisible today ON PURPOSE -- the rig is still 56, and the
 * gate proves 1,744 hashes of the wardrobe he plays did not move by a pixel. So
 * there is nothing new for him to find in the game, and SHOW ME PICTURES IN A TAB
 * (8/8) says a thing he cannot lay eyes on does not exist. This draws the answer:
 *
 *   LEFT   the wardrobe as the 2X plan would have shipped it -- generated at 56
 *          and block-doubled, which is what tools/bohemia_2x_flip.py describes
 *          ("CLO GENERATORS (56) LEFT AT 56 and block-doubled AT THE gen() SEAM")
 *   RIGHT  the same garment composed NATIVELY at 112 by the same generator
 *
 * Same physical size, same colours, same options. The only difference on screen is
 * how much detail the cloth is allowed to carry.
 *
 * VERIFY ON THE REAL SURFACE (7/18): the body underneath is the alpha's OWN
 * deformed part-id grid, pulled out of buildFrame, not a mannequin -- and the
 * garments are the alpha's own generator source, evaluated, not re-implemented.
 * The 112 body is that same grid block-doubled, and the caption says so, because
 * the rig itself has NOT been repainted at 112 and pretending otherwise would be
 * the lie this picture exists to prevent.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. It
 * never touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)
 *   joints: none named       parts: none named
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every pixel is the alpha's own generator
 * output over the alpha's own rig; this tool arranges, labels and scales only. It
 * opens no bank because it draws nothing of its own to source.
 *
 *   node tools/bohemia_4x_wardrobe_picture.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'slices/look/wardrobe-4x.png');

/* THE GENERATORS, OUT OF THE ALPHA ITSELF. Same extraction the gate uses, so the
   picture and the gate can never disagree about what the code is. */
const src = fs.readFileSync(ALPHA, 'utf8');
const GENS = ['genTop', 'genPants', 'genCoat', 'genShoes', 'genHat', 'genHair', 'genBag',
              'genCape', 'genPoncho', 'genGear', 'genAcc', 'genApron', 'genCoverall'];
function grab(n) {
  const i = src.indexOf('function ' + n + '('); if (i < 0) throw new Error('missing ' + n);
  const st = src.indexOf('{', i); let d = 0;
  for (let k = st; k < src.length; k++) { if (src[k] === '{') d++; else if (src[k] === '}') { d--; if (!d) return src.slice(i, k + 1); } }
  throw new Error('unterminated ' + n);
}
const GENSRC = ['rsc', 'fr', 'mix', 'grade', 'bshade', 'ext', 'pExt'].concat(GENS).map(grab).join('\n');

/* ONE ROW PER THING THAT BROKE. These are the families the measurement caught
   coming out at the wrong SIZE when the body doubled, plus the hair, because hair
   is half of what he asked for. Each row names the SLICE of the sprite worth
   looking at: a belt at the hip and a fade at the temple do not fit one crop, and
   a picture too small to read is the same as no picture. */
const ROWS = [
  ['BACKPACK',  'genBag',   { kind: 'backpack' }, 'N', 0.08, 0.62],
  ['SATCHEL',   'genBag',   { kind: 'satchel' },  'S', 0.20, 0.74],
  ['CAPE',      'genCape',  {},                   'N', 0.08, 0.62],
  ['CHEST RIG', 'genGear',  { kind: 'chestrig' }, 'S', 0.20, 0.74],
  ['TOOLBELT',  'genGear',  { kind: 'toolbelt' }, 'S', 0.36, 0.90],
  ['HIP SASH',  'genAcc',   { kind: 'sash' },     'S', 0.36, 0.90],
  ['SHEMAGH',   'genAcc',   { kind: 'shemagh' },  'S', 0.02, 0.56],
  ['APRON',     'genApron', {},                   'S', 0.20, 0.74],
  ['FLANNEL',   'genTop',   { sleeves: 'long', pattern: 'plaid' }, 'S', 0.20, 0.74],
  ['TRENCH',    'genCoat',  { len: 0.86, dir: 'S' }, 'S', 0.20, 0.74],
  ['CORNROWS',  'genHair',  { name: 'CORNROWS', vol: 1, side: 0.62, front: 0.22, tex: 'locs' }, 'S', 0.02, 0.34],
  ['LOW FADE',  'genHair',  { name: 'LOW FADE', vol: 0, side: 0.58, front: 0.20, fade: 4 }, 'S', 0.02, 0.34],
];
const RAMP = { dk: [72, 54, 38], mid: [124, 96, 66], lt: [168, 136, 96], mid2: [98, 76, 54], sole: [44, 34, 24] };

(async () => {
  const browser = await chromium.launch();
  const pg = await browser.newPage({ viewport: { width: 1200, height: 1700 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await pg.waitForFunction(() => typeof window.buildFrame === 'function' || typeof buildFrame === 'function', { timeout: 30000 });

  const png = await pg.evaluate(({ gensrc, rows, ramp }) => {
    const make = (CW, dir) => new Function('CW', 'CH', 'curDir',
      'var AMB=[67,61,56];\n' + gensrc + '\nreturn {' + Object.keys({}).join('') +
      'genTop:genTop,genPants:genPants,genCoat:genCoat,genShoes:genShoes,genHat:genHat,' +
      'genHair:genHair,genBag:genBag,genCape:genCape,genPoncho:genPoncho,genGear:genGear,' +
      'genAcc:genAcc,genApron:genApron,genCoverall:genCoverall};')(CW, CW, dir);

    /* THE REAL BODY, out of the alpha's own composition. */
    const frames = {};
    for (const d of ['S', 'N']) { const f = buildFrame(d, 'idle', 0); frames[d] = { px: f.px, grid: f.grid, CW: f.CW, CH: f.CH }; }

    const dbl = (g, W) => { const N = W * 2, o = new Array(N * N).fill(0);
      for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) { const v = g[y * W + x];
        o[(y*2)*N + x*2] = v; o[(y*2)*N + x*2+1] = v; o[(y*2+1)*N + x*2] = v; o[(y*2+1)*N + x*2+1] = v; }
      return o; };

    const Z = 5;                                    /* both halves land at 280 px on screen */
    const PAD = 20, LBL = 150, HDR = 118;
    const rowH = r => Math.round(56 * (r[5] - r[4])) * Z;
    const CELL = 56 * Z;
    const cv = document.createElement('canvas');
    cv.width = LBL + PAD + CELL + PAD + CELL + PAD;
    cv.height = HDR + rows.reduce((a, r) => a + rowH(r) + PAD, 0) + 44;
    const cx2 = cv.getContext('2d');
    cx2.imageSmoothingEnabled = false;
    cx2.fillStyle = '#14120f'; cx2.fillRect(0, 0, cv.width, cv.height);

    cx2.fillStyle = '#f0e6d4'; cx2.font = 'bold 30px monospace';
    cx2.fillText('THE WARDROBE AT 4X', PAD, 40);
    cx2.font = '17px monospace'; cx2.fillStyle = '#b8ab95';
    cx2.fillText('same garment, same size on screen. left is what the 2x plan would ship.', PAD, 68);
    cx2.fillText('the body under both is YOUR 56 rig. only the clothes and hair changed.', PAD, 90);
    cx2.font = 'bold 17px monospace';
    cx2.fillStyle = '#c98a6a'; cx2.fillText('BLOCK-DOUBLED (before)', LBL + PAD, HDR - 10);
    cx2.fillStyle = '#8fc07a'; cx2.fillText('NATIVE 4X (now)', LBL + PAD + CELL + PAD, HDR - 10);

    const paint = (out, W, body, dx, dy, y0, y1) => {
      const im = cx2.createImageData(W, W), D = im.data;
      for (let i = 0; i < W * W; i++) { const c = body[i]; const o = i * 4;
        if (c) { D[o] = c[0]; D[o+1] = c[1]; D[o+2] = c[2]; D[o+3] = 255; } }
      for (const k in out) { const i = +k, c = out[k]; if (!c) continue; const o = i * 4;
        D[o] = c[0]; D[o+1] = c[1]; D[o+2] = c[2]; D[o+3] = 255; }
      const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = W;
      tmp.getContext('2d').putImageData(im, 0, 0);
      const sy = Math.round(W * y0), sh = Math.round(W * (y1 - y0));
      cx2.drawImage(tmp, 0, sy, W, sh, dx, dy, W * (Z / 2), sh * (Z / 2));
    };

    let y = HDR;
    for (const row of rows) {
      const [label, fn, opt, dir, y0, y1] = row;
      const f = frames[dir] || frames.S;
      const W = f.CW, g56 = f.grid;
      const G56 = make(W, dir), G112 = make(W * 2, dir);
      const o = Object.assign({ ramp: ramp }, opt);
      let a = {}, b = {};
      try { a = G56[fn](g56, o) || {}; } catch (e) {}
      try { b = G112[fn](dbl(g56, W), o) || {}; } catch (e) {}

      /* the 56 body, doubled the same way on BOTH sides, so only the garment differs */
      const body56 = f.px;
      const N = W * 2;
      const body112 = new Array(N * N).fill(null);
      for (let yy = 0; yy < W; yy++) for (let xx = 0; xx < W; xx++) { const c = body56[yy * W + xx]; if (!c) continue;
        body112[(yy*2)*N + xx*2] = c; body112[(yy*2)*N + xx*2+1] = c;
        body112[(yy*2+1)*N + xx*2] = c; body112[(yy*2+1)*N + xx*2+1] = c; }
      /* LEFT: the garment drawn at 56 then block-doubled -- the 2X seam, exactly */
      const a112 = {};
      for (const k in a) { const i = +k, gx = (i % W) * 2, gy = ((i / W) | 0) * 2, c = a[k];
        a112[gy*N + gx] = c; a112[gy*N + gx+1] = c; a112[(gy+1)*N + gx] = c; a112[(gy+1)*N + gx+1] = c; }

      cx2.fillStyle = '#e8dcc6'; cx2.font = 'bold 17px monospace';
      cx2.fillText(label, PAD, y + 24);
      cx2.fillStyle = '#6f6455'; cx2.font = '13px monospace';
      cx2.fillText(dir === 'N' ? 'from behind' : 'facing you', PAD, y + 44);

      paint(a112, N, body112, LBL + PAD, y, y0, y1);
      paint(b,    N, body112, LBL + PAD + CELL + PAD, y, y0, y1);
      y += rowH(row) + PAD;
    }
    cx2.fillStyle = '#6f6455'; cx2.font = '13px monospace';
    cx2.fillText('the 112 body is your 56 rig doubled. repainting the rig itself at 112 is your call, not mine.', PAD, cv.height - 18);
    return cv.toDataURL('image/png').split(',')[1];
  }, { gensrc: GENSRC, rows: ROWS, ramp: RAMP });

  await browser.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
