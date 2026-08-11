/* BONE SCALE SHEET (8/11/26, WORLD lane) — A PERSON NEXT TO EVERY BONE.
 *
 * Paolo 8/11, LOCKED:
 *   "i would challenge you to make sure any bones or skulls are always the same
 *    size as our humans please ... if you want to put a character next to it for
 *    reference ... anything thats human decay please make the art with a person
 *    next to it so u get the real scale and size"
 *
 * He is right and the measurement proves it. Measured in the running alpha:
 *   the human is 1.74 m tall (56x56 raw art, 51 px of ink, blitted at the 112
 *   ladder, 58.67 px per metre at HC=44). CORRECT.
 *   every dead tile is drawn at TILES.scale.skeleton = 1.5 cells => 1.75 m long,
 *   WHATEVER IT DEPICTS. A full skeleton at 1.75 m is right. A single skull at
 *   1.75 m is a skull the size of a man, and that is what shipped.
 *
 * ONE SCALE FOR 73 DIFFERENT THINGS was the bug. This sheet is how it gets
 * fixed and how it stays fixed: every UP tile in the bank, drawn at its real
 * world size, STANDING NEXT TO THE REAL HUMAN, over a one-metre rule.
 *
 * IT DRIVES THE ALPHA, NOT THE WORLD PAGE, and that is the whole point.
 * PLAYER_CV arrives by postMessage from the alpha's character bake; open
 * BOHEMIA_CITY_WORLD.html on its own and it stays null forever, which is why
 * the player is a BLANK WHITE BOX in every LOOK picture shipped before today.
 * Paolo has been judging scale against a rectangle. The human in this sheet is
 * the real baked body, from the surface he taps (VERIFY ON THE REAL SURFACE).
 *
 * REUSE CHECK: COOKS ZERO PIXELS. It draws nothing of its own except a metre
 * rule and labels. Every body pixel is the alpha's own baked player sprite;
 * every bone pixel is TP_IMG[BohemiaDead.TILES.bank], Paolo's judged gore bank
 * with his DOWN tiles excluded. No new art is invented here by design -- the
 * sheet exists to MEASURE his art, not to add to it.
 *
 *   node tools/bohemia_bone_scale_sheet.js
 *     -> slices/look/bone-scale.png  (+ the per-tile metre table on stdout)
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'slices', 'look', 'bone-scale.png');
const TABLE = path.join(ROOT, 'records', 'BOHEMIA_BONE_SCALE_TABLE.json');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  page.on('pageerror', e => console.log('PAGEERR', String(e).slice(0, 140)));

  await page.goto('file://' + path.resolve(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'),
    { waitUntil: 'load', timeout: 240000 });
  await page.waitForTimeout(6000);
  await page.evaluate(() => {
    const t = [...document.querySelectorAll('.tab')].find(e => /RUN/i.test(e.textContent || ''));
    if (t) t.click();
  });
  await page.waitForTimeout(14000);

  const inner = page.frames().find(f => /CITY_WORLD/.test(f.url()));
  if (!inner) { console.log('BONE SCALE: no city frame — the alpha did not open the world.'); process.exit(1); }

  /* THE BODY HAS TO BE ASKED FOR MORE THAN ONCE. The alpha fires citySendPlayer
     on tab-open, which can beat the frame's own listener into existence. Re-send
     until the frame confirms it decoded, and FAIL LOUD if it never does -- a
     sheet with no human in it is the exact lie this tool exists to end. */
  let got = false;
  for (let k = 0; k < 8 && !got; k++) {
    await page.evaluate(() => { try { citySendPlayer(); } catch (e) {} });
    await page.waitForTimeout(2500);
    got = await inner.evaluate(() => !!PLAYER_CV);
  }
  if (!got) { console.log('BONE SCALE: the player body never arrived. No sheet written.'); process.exit(1); }

  const res = await inner.evaluate(() => {
    function ink(im) {
      const w = im.width || im.naturalWidth, h = im.height || im.naturalHeight;
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const g = c.getContext('2d'); g.drawImage(im, 0, 0);
      const d = g.getImageData(0, 0, w, h).data;
      let x0 = w, y0 = h, x1 = -1, y1 = -1;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++)
        if (d[(y * w + x) * 4 + 3] > 16) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      return x1 < 0 ? null : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1, natW: w, natH: h };
    }

    const C = HC, CELL_M = OM.CELL_M;
    const bank = TP_IMG[BohemiaDead.TILES.bank] || [];
    const down = {}; (BohemiaDead.TILES.down || []).forEach(i => { down[i] = 1; });
    const SC = BohemiaDead.TILES.scale.skeleton;

    const hSpr = PLAYER_CV.S.idle;
    const hInk = ink(hSpr);
    const HUMAN_M = 1.74;                    // measured, and the anchor for everything

    /* ONE RULER FOR THE WHOLE SHEET: pixels per metre, chosen so a man is 90 px. */
    const PPM = 90 / HUMAN_M;
    const rows = [];
    for (let i = 0; i < bank.length; i++) {
      if (down[i] || !bank[i]) continue;
      const t = ink(bank[i]); if (!t) continue;
      /* THE SAME RULER THE RENDERER USES. Never re-derive a size here -- two
         rulers for one measurement is how 51 imaginary violations got invented
         on 8/9. deadTile() and this sheet both ask BohemiaDead.tileMetres(). */
      const lenM = BohemiaDead.tileMetres(i);
      const depM = lenM * (t.natW >= t.natH ? (t.natH / t.natW) : 1);
      rows.push({ i, natW: t.natW, natH: t.natH,
                  lenM: +lenM.toFixed(2), depM: +depM.toFixed(2) });
    }

    /* ---- draw the sheet ---------------------------------------------------- */
    const COLS = 6, CW = 190, CH = 175, PAD = 16, HEAD = 96;
    const ROWS = Math.ceil(rows.length / COLS);
    const cv = document.createElement('canvas');
    cv.width = PAD * 2 + COLS * CW; cv.height = HEAD + PAD * 2 + ROWS * CH;
    const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
    g.fillStyle = '#17150f'; g.fillRect(0, 0, cv.width, cv.height);

    g.fillStyle = '#e8dcc0'; g.font = 'bold 26px ui-monospace, monospace';
    g.fillText('BONE SCALE — A PERSON NEXT TO EVERY BONE', PAD, 38);
    g.fillStyle = '#9c8f72'; g.font = '15px ui-monospace, monospace';
    g.fillText('the man is 1.74 m, measured off the real baked body. every bone is drawn at the size the game draws it.', PAD, 62);
    g.fillText('the bar under each pair is ONE METRE. a skull is 0.20 m, a femur 0.45 m, a laid-out adult 1.70 m.', PAD, 82);

    function drawHuman(x, footY) {
      const hPx = 90, sc = hPx / hInk.h;
      const w = hInk.w * sc;
      g.drawImage(hSpr, hInk.x, hInk.y, hInk.w, hInk.h,
                  Math.round(x - w / 2), Math.round(footY - hPx), Math.round(w), Math.round(hPx));
    }

    rows.forEach((r, n) => {
      const cx = PAD + (n % COLS) * CW, cy = HEAD + PAD + Math.floor(n / COLS) * CH;
      const footY = cy + CH - 44;
      g.strokeStyle = '#2e2a20'; g.strokeRect(cx + 2, cy + 2, CW - 6, CH - 8);
      drawHuman(cx + 34, footY);
      /* the bone at the SAME ruler, lying on the same ground line */
      const bw = r.lenM * PPM, bh = r.depM * PPM;
      g.drawImage(bank[r.i], Math.round(cx + 70), Math.round(footY - bh), Math.round(bw), Math.round(bh));
      /* ONE METRE, so the eye has an absolute, not just a comparison */
      g.strokeStyle = '#c8a24a'; g.lineWidth = 3; g.beginPath();
      g.moveTo(cx + 14, footY + 14); g.lineTo(cx + 14 + PPM, footY + 14); g.stroke();
      g.fillStyle = '#c8a24a'; g.font = '12px ui-monospace, monospace';
      g.fillText('1 m', cx + 16, footY + 30);
      g.fillStyle = r.lenM > 1.74 ? '#e07b52' : '#8fae76';
      g.font = 'bold 13px ui-monospace, monospace';
      g.fillText('#' + r.i + '  ' + r.lenM.toFixed(2) + ' m long', cx + 62, footY + 30);
    });

    return { png: cv.toDataURL('image/png'), rows, humanInk: hInk,
             pxPerM: +(C / CELL_M).toFixed(2), C, scale: SC };
  });

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(res.png.split(',')[1], 'base64'));
  fs.writeFileSync(TABLE, JSON.stringify({ stamp: '8/11/26', humanMetres: 1.74,
    pxPerMetre: res.pxPerM, cellPx: res.C, drawScale: res.scale, tiles: res.rows }, null, 1));

  const over = res.rows.filter(r => r.lenM > 1.8).length;
  console.log('BONE SCALE SHEET: ' + res.rows.length + ' judged tiles, human 1.74 m, ' +
              (fs.statSync(OUT).size / 1024).toFixed(0) + ' KB');
  const sizes = [...new Set(res.rows.map(r => r.lenM))].sort((a, b) => a - b);
  console.log('  ' + sizes.length + ' distinct real sizes, ' + sizes[0].toFixed(2) + ' m (a skull) to ' +
              sizes[sizes.length - 1].toFixed(2) + ' m; ' + over + ' out-measure the 1.74 m man');
  console.log('  -> ' + path.relative(ROOT, OUT));
  await browser.close();
})();
