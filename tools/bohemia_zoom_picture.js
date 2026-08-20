/* BOHEMIA THE SAME THIRTEEN PEOPLE, THREE SIZES (Paolo 8/8 LOOK LAW)
 *
 * "just give me pictures and put it in a tab."
 *
 * I proved the thirteen faction outfits tell each other apart -- at 112 pixels, which
 * is the size the city draws a person at the default walk zoom. Zoom out and the same
 * body is 56, then 28. This is that, and it is the honest half of the claim: at the
 * top row they are thirteen people, and by the bottom row they are a crowd.
 *
 * Every rung is made the way the GAME makes it. 56 is the composition the city bakes.
 * 28 is half2 -- the city's own downscaler, which takes every other pixel; a canvas
 * downscale would blur, and blurring would invent a smoothness the game never draws
 * and make the bottom row look better than it is.
 *
 * The rows are drawn at the SAME size on the page, blown up with smoothing off, so
 * what you are comparing is how much SHAPE is left, not how big the picture is.
 *
 * RIG CHECK (RIG IS LAW, Paolo 7/26/26): renders and measures, writes nothing. It
 *   borrows G_WORN / G.bodyVar / G.age and restores them in a finally; no painted
 *   pixel, joint or bone is touched.
 *   built on: buildFrameCached, BOH_BODYVAR
 *   joints: none named
 *   parts: none named
 *
 * REUSE CHECK: cooks no new graphic pixels. Every figure is the alpha's own render of
 * existing st:'canon' garments.
 *
 *   node tools/bohemia_zoom_picture.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'slices/look/zoom-identity.png');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  page.on('pageerror', e => console.log('PAGEERR ' + e.message.slice(0, 110)));
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(5000);

  const png = await page.evaluate(() => {
    const looks = (window.FACTION_LOOKS || []);
    if (!looks.length) return null;
    const half2c = (c) => {
      const w = c.width >> 1, h = c.height >> 1;
      const S = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
      const o = document.createElement('canvas'); o.width = w; o.height = h;
      const ox = o.getContext('2d'), O = ox.createImageData(w, h), D = O.data;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const si = ((y * 2) * c.width + (x * 2)) * 4, di = (y * w + x) * 4;
        D[di] = S[si]; D[di + 1] = S[si + 1]; D[di + 2] = S[si + 2]; D[di + 3] = S[si + 3];
      }
      ox.putImageData(O, 0, 0); return o;
    };
    const toCv = (fr) => {
      const c = document.createElement('canvas'); c.width = fr.CW; c.height = fr.CH;
      const x = c.getContext('2d'); const img = x.createImageData(fr.CW, fr.CH);
      for (let i = 0; i < fr.px.length; i++) { const p = fr.px[i], o = i * 4;
        if (p) { img.data[o] = p[0]; img.data[o + 1] = p[1]; img.data[o + 2] = p[2]; img.data[o + 3] = 255; }
        else img.data[o + 3] = 0; }
      x.putImageData(img, 0, 0); return c;
    };

    const keepW = window.G_WORN, keepD = G.bodyVar, keepA = G.age, keepEq = {};
    const PD = ['shirt', 'jacket', 'pants', 'shoes', 'hat', 'glasses', 'hair'];
    PD.forEach(s => { if (s in G.equipped) { keepEq[s] = G.equipped[s]; G.equipped[s] = ''; } });

    let bodies = [];
    try {
      for (const f of looks) {
        window.G_WORN = f.worn; G.bodyVar = f.dials; G.age = f.age || 'adult';
        rebuildFromRig();
        try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); POSEHOLD_CACHE.clear(); } catch (e) {}
        /* THREE GENUINELY DIFFERENT SOURCES. The first cut drew the 112 row and the
           56 row from the SAME 56 canvas, so the top two rows were byte-identical and
           the picture quietly claimed the upscale costs nothing. drawChar is the real
           112 (composition, then Scale2x, then the one-pixel border at display size);
           the 56 is the composition the city bakes; the 28 is half2 of it. */
        const c112 = document.createElement('canvas'); c112.width = c112.height = 112;
        drawChar(c112, 'S', 'idle', 0);
        const c56 = toCv(buildFrameCached('S', 'idle', 0, false));
        bodies.push({ n: f.faction, c112: c112, c56: c56, c28: half2c(c56) });
      }
    } finally {
      window.G_WORN = keepW; G.bodyVar = keepD; G.age = keepA;
      for (const s in keepEq) G.equipped[s] = keepEq[s];
      try { rebuildFromRig(); } catch (e) {}
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); POSEHOLD_CACHE.clear(); } catch (e) {}
    }

    const N = bodies.length, S = 62, PAD = 5, HEAD = 145, ROWL = 30, LBL = 14;
    const cv = document.createElement('canvas');
    cv.width = PAD + N * (S + PAD);
    cv.height = HEAD + 3 * (ROWL + S + LBL) + 16;
    const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
    g.fillStyle = '#d9d4c8'; g.fillRect(0, 0, cv.width, cv.height);
    g.textAlign = 'left';
    g.fillStyle = '#1a1712'; g.font = 'bold 23px monospace';
    g.fillText('WHEN A PERSON STOPS BEING SOMEBODY', PAD, 36);
    g.fillStyle = '#5a4a2a'; g.font = '14px monospace';
    g.fillText('the same thirteen factions, at the three sizes the game draws a person.', PAD, 60);
    g.fillStyle = '#7a6a4a'; g.font = '13px monospace';
    g.fillText('top row is what you see walking around, and they are thirteen people.', PAD, 82);
    g.fillText('by the bottom row the body is 25 pixels tall and they are a crowd.', PAD, 99);
    g.fillText('all three rows are blown up to the same size here, so what you compare', PAD, 116);
    g.fillText('is how much SHAPE is left, not how big the picture is.', PAD, 133);

    const rows = [
      ['112px — the zoom you play at', '#2a6a35', b => b.c112],
      ['56px — one zoom out',          '#8a6a2a', b => b.c56],
      ['28px — zoomed right out',      '#a03020', b => b.c28]
    ];
    rows.forEach(([label, colour, pick], r) => {
      const y0 = HEAD + r * (ROWL + S + LBL);
      g.fillStyle = colour; g.font = 'bold 14px monospace';
      g.fillText(label, PAD, y0 + 18);
      bodies.forEach((b, i) => {
        const c = pick(b);
        g.drawImage(c, PAD + i * (S + PAD), y0 + ROWL, S, S);
      });
      if (r === 2) {
        g.fillStyle = '#6a5a3a'; g.font = '10px monospace';
        bodies.forEach((b, i) => g.fillText(b.n.slice(0, 9).toUpperCase(), PAD + i * (S + PAD), y0 + ROWL + S + 11));
      }
    });
    return cv.toDataURL('image/png').split(',')[1];
  });

  if (!png) { console.log('no outfits to shoot'); process.exit(1); }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('ZOOM IDENTITY: wrote ' + OUT + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
  await browser.close();
})();
