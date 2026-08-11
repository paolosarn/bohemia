/* BOHEMIA THE RIG'S HEAD vs THE HEAD THE GAME DRAWS (8/11/26, CHARACTER lane)
 *
 * Paolo 8/11: "this is not how the rig has my head and my neck line. Why does it
 * look so fucked up... there needs to be more head underneath the mouth following
 * how the rig has it."
 *
 * He is describing a PIPELINE bug and this is the picture that proves it either
 * way. Three panels of the same head, same rows, same zoom:
 *
 *   THE RIG        BAKED.layers.S parts 1 (head outline) / 2 (face) / 3 (neck),
 *                  painted flat exactly as they sit in his rig. No skinner, no
 *                  garments, no pose -- the shape he authored.
 *   THE GAME bare  drawChar() with every hair layer removed, so the body's own
 *                  silhouette is visible.
 *   THE GAME       drawChar() as he sees it, hair and all.
 *
 * Under each row, the WIDTH the rig says and the width the game drew. A row where
 * they disagree is marked. Widths, not adjectives -- "the jaw looks wrong" is not
 * something anyone can act on; "the rig tapers 10-8-8-6-4 and the game drew
 * 10-10-10-9-5" is.
 *
 * REUSE CHECK: cooks no new graphic pixels. The RIG panel is BAKED's own pixel
 * lists drawn with the live skin ramp; the GAME panels are drawChar output from
 * the booted alpha. Nothing here invents or redraws a pixel of anybody's art.
 *
 *   node tools/bohemia_head_vs_rig.js [out.png]
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = process.argv[2] || path.join(REPO, 'records/HEAD_VS_RIG_8_11.png');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 }, deviceScaleFactor: 2 });
  page.on('pageerror', e => console.log('PAGEERROR: ' + e.message));
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1500);
  await page.click('.tab[data-p="char"]');
  await page.waitForTimeout(4000);

  const res = await page.evaluate(() => {
    const X0 = 20, X1 = 36, Y0 = 4, Y1 = 18;          // the head, generously
    const CWD = X1 - X0 + 1, CHT = Y1 - Y0 + 1, Z = 18, pad = 16, lab = 34, foot = 26;

    /* ---- panel A: the rig, as painted ---- */
    const rigCell = {};                                 // 'x,y' -> colour
    const RAMP = { 1: '#2a2226', 2: '#c9a892', 3: '#a98d7a' };
    const rigW = {};
    for (const pid of ['1', '2', '3']) {
      for (const i of (BAKED.layers.S[pid] || [])) {
        const x = i % BAKED.W, y = (i / BAKED.W) | 0;
        rigCell[x + ',' + y] = RAMP[pid];
      }
    }
    /* COMPARE LIKE WITH LIKE, and the first version of this did not. Counting the
       rig's outline (part 1) against the game's full silhouette measured the
       sprite's OUTLINE PASS -- a uniform +1 ring on every side -- and reported
       every row as disagreeing by 2, which is just the outline being an outline.
       The signal is the SKIN: the rig's painted FACE (part 2) against the skin
       the game actually paints. That is the jaw line he is pointing at. */
    for (const i of (BAKED.layers.S['2'] || [])) {
      const x = i % BAKED.W, y = (i / BAKED.W) | 0;
      const a = rigW[y] || (rigW[y] = { a: 99, b: -1 });
      if (x < a.a) a.a = x; if (x > a.b) a.b = x;
    }

    /* ---- panels B and C: the game ---- */
    const PL = 112;
    const shoot = () => {
      const cv = document.createElement('canvas'); cv.width = cv.height = PL;
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      drawChar(cv, 'S', 'idle', 0);
      return cv.getContext('2d').getImageData(0, 0, PL, PL).data;
    };
    const withHair = shoot();
    const stash = {};
    for (const k in PD.layers) if (k.indexOf('hair/') === 0) { stash[k] = PD.layers[k]; delete PD.layers[k]; }
    const bare = shoot();
    for (const k in stash) PD.layers[k] = stash[k];
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}

    const px = (D, x, y) => { const i = ((y * 2) * PL + (x * 2)) * 4; return D[i + 3] < 40 ? null : [D[i], D[i + 1], D[i + 2]]; };
    /* SKIN width, not silhouette width -- see the note above. */
    const SK = (typeof skinTone !== 'undefined' && skinTone[1]) ? skinTone[1] : [];
    const isSkin = c => c && SK.some(r => Math.abs(c[0]-r[0])+Math.abs(c[1]-r[1])+Math.abs(c[2]-r[2]) < 40);
    const widthOf = (D, y) => { let a = 99, b = -1; for (let x = 0; x < 56; x++) if (isSkin(px(D, x, y))) { if (x < a) a = x; if (x > b) b = x; } return b < 0 ? null : { a: a, b: b }; };

    /* ---- draw ---- */
    const out = document.createElement('canvas');
    out.width = pad + 3 * (CWD * Z + pad);
    out.height = lab + CHT * Z + foot + pad;
    const o = out.getContext('2d'); o.imageSmoothingEnabled = false;
    o.fillStyle = '#0d0d12'; o.fillRect(0, 0, out.width, out.height);
    const titles = ['THE RIG (as painted)', 'THE GAME (hair off)', 'THE GAME (what he sees)'];
    const rowsRep = [];

    for (let pi = 0; pi < 3; pi++) {
      const ox = pad + pi * (CWD * Z + pad);
      o.fillStyle = pi === 0 ? '#d8cfae' : '#cfcfd8';
      o.font = 'bold 16px monospace'; o.textAlign = 'left';
      o.fillText(titles[pi], ox, 22);
      for (let y = Y0; y <= Y1; y++) for (let x = X0; x <= X1; x++) {
        let col = null;
        if (pi === 0) col = rigCell[x + ',' + y] || null;
        else { const c = px(pi === 1 ? bare : withHair, x, y); if (c) col = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'; }
        if (!col) continue;
        o.fillStyle = col;
        o.fillRect(ox + (x - X0) * Z, lab + (y - Y0) * Z, Z, Z);
      }
      /* faint grid so rows are countable */
      o.strokeStyle = 'rgba(255,255,255,0.07)'; o.lineWidth = 1;
      for (let y = 0; y <= CHT; y++) { o.beginPath(); o.moveTo(ox, lab + y * Z); o.lineTo(ox + CWD * Z, lab + y * Z); o.stroke(); }
    }

    /* ---- the numbers under it ---- */
    for (let y = Y0; y <= Y1; y++) {
      const r = rigW[y], g = widthOf(bare, y);
      if (!r && !g) continue;
      const rw = r ? (r.b - r.a + 1) : 0, gw = g ? (g.b - g.a + 1) : 0;
      rowsRep.push({ y: y, rig: rw, game: gw });
    }
    o.textAlign = 'left'; o.font = 'bold 14px monospace';
    let line = 'SKIN WIDTH PER ROW (rig FACE part 2 vs the skin the game paints, hair off) —  rig: ' + rowsRep.map(r => r.rig).join('-') +
               '   game: ' + rowsRep.map(r => r.game).join('-');
    o.fillStyle = '#e8e2d2'; o.fillText(line, pad, lab + CHT * Z + 20);

    return { png: out.toDataURL('image/png').split(',')[1], rows: rowsRep };
  });

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(res.png, 'base64'));
  console.log('HEAD VS RIG: wrote ' + OUT);
  console.log('  row   rig   game');
  for (const r of res.rows) console.log('  y' + String(r.y).padStart(2) + '   ' + String(r.rig).padStart(3) + '   ' +
    String(r.game).padStart(4) + (r.rig && r.game && r.rig !== r.game ? '   <-- DISAGREE' : ''));
  await browser.close();
})();
