/* BOHEMIA THE BORDER IN THE GAME, BEFORE AND AFTER, AS A PICTURE (Paolo 8/14 + 8/8)
 *
 * 8/14: "the black border has to be thinner, like half as thin."
 * 8/8 LOOK LAW: "just give me pictures and put it in a tab."
 *
 * The border fix on the CHARACTER tab already has a picture. This is the half he
 * could not see: THE GAME was still doubling it. The city scales bodies on an
 * integer ladder -- EPX x2 at the default walk zoom, x4 zoomed in -- so the one
 * pixel baked in at 56 arrived 2px and 4px on screen.
 *
 * Both columns are rendered THROUGH THE CITY'S OWN CODE, in the city frame, on the
 * real sprite it is drawing right now:
 *   AFTER  = spriteAt(spr, C), the shipped path
 *   BEFORE = outline1 at 56 then the same EPX ladder, which is exactly what it did
 *            before this change
 * so the comparison is the city's arithmetic, not a mock-up of it.
 *
 * ON A LIGHT CARD ON PURPOSE. A black outline on the game's near-black night
 * ground is invisible in a screenshot, which is precisely why this was missed for
 * two days. SUN MODE is also how he judges.
 *
 * RIG CHECK (RIG IS LAW, Paolo 7/26/26): reads the already-baked city sprite and
 *   writes a picture. It never touches BAKED, a joint, a bone or a painted pixel --
 *   the bodies here are the ones the city is drawing, asked for at each zoom tier.
 *   built on: BAKED
 *   joints: none named
 *   parts: none named
 *
 * REUSE CHECK: cooks no new graphic pixels. Every body in the image comes out of
 * the city's own spriteAt()/outline1() on a sprite the alpha already baked; nothing
 * is drawn, generated or invented here.
 *
 *   node tools/bohemia_city_border_picture.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'slices/look/border-in-the-game.png');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(11000);

  const fr = page.frames().find(f => f.url().includes('CITY_WORLD'));
  if (!fr) { console.log('no city frame'); process.exit(1); }

  const png = await fr.evaluate(() => {
    if (typeof PLAYER_CV === 'undefined' || !PLAYER_CV) return null;
    const set = PLAYER_CV.S || PLAYER_CV[Object.keys(PLAYER_CV)[0]];
    const spr = set && set.idle;
    if (!spr) return null;

    /* the two closest tiers -- the ones the doubling was visible at */
    const TIERS = [
      { label: 'walking around  (the zoom the game opens at)', C: 44, was: '2 pixels', now: '1 pixel' },
      { label: 'zoomed in',                                    C: 88, was: '4 pixels', now: '1 pixel' }
    ];
    const old = (spr, C) => (C >= 64 ? epx2(epx2(outline1(spr))) : epx2(outline1(spr)));

    const SHOW = 210;                       /* each body drawn this tall */
    const PAD = 30, COLW = SHOW + PAD, HEAD = 132, ROWH = SHOW + 66;
    const cv = document.createElement('canvas');
    cv.width = PAD + 2 * COLW + PAD;
    cv.height = HEAD + TIERS.length * ROWH + 24;
    const g = cv.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.fillStyle = '#d9d4c8'; g.fillRect(0, 0, cv.width, cv.height);   /* SUN MODE */

    g.textAlign = 'left';
    g.fillStyle = '#1a1712'; g.font = 'bold 26px monospace';
    g.fillText('THE BLACK BORDER, IN THE GAME', PAD, 40);
    g.fillStyle = '#5a4a2a'; g.font = '14px monospace';
    g.fillText('"the black border has to be thinner,', PAD, 62);
    g.fillText('like half as thin"  —  8/14', PAD, 78);
    /* keep every line inside the card: the first cut of this clipped both
       subtitles at the right edge, which is a picture that cannot be read */
    g.fillStyle = '#7a6a4a'; g.font = '13px monospace';
    g.fillText('the character tab was fixed first. the GAME kept', PAD, 100);
    g.fillText('doubling it, because enlarging the body enlarged', PAD, 116);
    g.fillText('the outline with it.', PAD, 132);

    for (let t = 0; t < TIERS.length; t++) {
      const T = TIERS[t], y0 = HEAD + t * ROWH;
      g.fillStyle = '#1a1712'; g.font = 'bold 15px monospace';
      g.fillText(T.label, PAD, y0 + 16);

      const pair = [
        { img: old(spr, T.C), tag: 'BEFORE — ' + T.was, col: '#8a3a2a' },
        { img: spriteAt(spr, T.C), tag: 'AFTER — ' + T.now, col: '#2a6a3a' }
      ];
      for (let i = 0; i < 2; i++) {
        const ox = PAD + i * COLW, oy = y0 + 28;
        g.drawImage(pair[i].img, ox, oy, SHOW, SHOW);
        g.strokeStyle = 'rgba(0,0,0,0.13)'; g.lineWidth = 1;
        g.strokeRect(ox + 0.5, oy + 0.5, SHOW, SHOW);
        g.fillStyle = pair[i].col; g.font = 'bold 14px monospace';
        g.fillText(pair[i].tag, ox, oy + SHOW + 20);
      }
    }
    return cv.toDataURL('image/png').split(',')[1];
  });

  if (!png) { console.log('no player sprite in the city yet'); process.exit(1); }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('CITY BORDER PICTURE: wrote ' + OUT + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
  await browser.close();
})();
