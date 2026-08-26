/* COLOUR IS TERRITORY (8/26/26, CHARACTER lane).
 *
 * Paolo, 8/26: "I would like to see more color coordination, to be honest ... the
 * colorful, like, that guy was not colorful, bro. Like, that shit was crazy ... people
 * get shot in Los Angeles for wearing the wrong color or whatever ... when it comes down
 * to how we wanna communicate, like, who would defend us, I think it'd be kinda like
 * that."
 *
 * HE IS RIGHT, AND HE ASKED FOR IT ONCE ALREADY. On 7/21 he said "not even a single
 * color, like rainbow literally" and four saturated garments were cooked FOR COLORFUL.
 * MEASURED five weeks later: three of the four were worn by NOBODY and the fourth went
 * to the wrong faction, and COLORFUL was dressed head to foot in BONE.
 *
 *     COLORFUL   saturation 0.22, 54% of its cloth in the grey/brown bucket.
 *                THE SECOND LEAST COLOURFUL OF THE THIRTEEN.
 *     BLUES      67% of its cloth in the RED bucket, because DRIFTER'S COAT is
 *                oxblood and a coat is most of a person. A faction named for a
 *                colour, wearing its rival's.
 *
 * THE SHAPES ARE UNTOUCHED. Every swap is the same generator with the same options and
 * a different ramp -- a duster stays a duster at len 0.88 -- so the silhouette set from
 * the 880-fit search is exactly what it was, and STRUCTURE-NOT-COLOR still carries
 * identity in the dark. Colour is the SECOND channel his 8/26 ruling adds, not a
 * replacement for the first.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel.
 *   built on: BAKED (read-only, via buildFrame)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every body is the alpha's own render and
 * every garment is an existing generator shape.
 *
 *   node tools/bohemia_colour_is_territory.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'slices/look/colour-is-territory.png');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 1500 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.FACTION_LOOKS, { timeout: 30000 });

  const png = await p.evaluate(() => {
    /* WHAT THEY USED TO WEAR, verbatim from the table before 8/26. Both halves come
       out of the SAME build and the SAME generators; the only difference on screen is
       the ramps, which is the thing being judged. */
    const BEFORE = {
      Colorful: { hair:'SHAG', base:'STRIPED TEE', outer:'BONE DUSTER', head:'BONE KNIT CAP',
                  legs:'ANKLE WRAP SKIRT', feet:'BONE SNEAKERS' },
      Blues:    { hair:'CROP', base:'MOSS GREEN SHIRT', outer:"DRIFTER'S COAT",
                  legs:'DUST TROUSERS', feet:'FIELD BOOTS' }
    };
    const LOOKS = window.FACTION_LOOKS;
    const keepW = window.G_WORN, keepE = G.equipped, keepV = G.bodyVar;
    const PD_OFF = ['hat','glasses','hair','shirt','jacket','pants','shoes'];
    const shot = (dials, worn) => {
      const eq = {}; for (const k in keepE) eq[k] = keepE[k];
      for (const s of PD_OFF) eq[s] = '';
      G.equipped = eq; G.bodyVar = dials; window.G_WORN = worn;
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const f = buildFrame('S', 'idle', 0);
      return { px: f.px.slice(), W: f.CW, grid: f.grid };
    };
    /* the saturation number in the caption is measured off the SAME frame that is
       drawn, so the picture and the number can never disagree */
    const satOf = (fr) => { let n = 0, sum = 0;
      for (let i = 0; i < fr.px.length; i++) { const c = fr.px[i]; if (!c) continue;
        const gv = fr.grid[i]; if (gv === 1 || gv === 2) continue;
        const mx = Math.max(c[0],c[1],c[2]) / 255, mn = Math.min(c[0],c[1],c[2]) / 255;
        if (mx < 0.12) continue; n++; sum += mx ? (mx - mn) / mx : 0; }
      return n ? sum / n : 0; };

    const Z = 7, PAD = 18, HDR = 176;
    const X0 = 0.24, X1 = 0.76, Y0 = 0.05, Y1 = 0.95;
    const cw = Math.round(112 * (X1 - X0)) * Z / 2;
    const ch = Math.round(112 * (Y1 - Y0)) * Z / 2;
    const cv = document.createElement('canvas');
    cv.width = PAD + 7 * (cw + PAD);
    /* THIRTEEN INTO SEVEN IS TWO ROWS. The first cut sized the canvas for one and
       the bottom six were sliced off under the footer -- a picture that quietly
       shows less than it says it does, which is the exact lie I keep catching. */
    const gridRows = Math.ceil(LOOKS.length / 7);
    cv.height = HDR + (ch + 60) + 40 + gridRows * (ch + 60) + 70;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);

    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 30px monospace';
    cx.fillText('THE COLOURS WERE BUILT AND NEVER PUT ON ANYBODY', PAD, 46);
    cx.font = '17px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('in july you said "not even a single color, like rainbow literally". four bright', PAD, 82);
    cx.fillText('clothes got made for COLORFUL that week. three of them were worn by NOBODY, and', PAD, 106);
    cx.fillText('COLORFUL was dressed in bone, bone and bone. the BLUES were wearing red.', PAD, 130);

    const blit = (fr, dx, dy) => {
      const N = fr.W, im = cx.createImageData(N, N), D = im.data;
      for (let i = 0; i < N * N; i++) { const c = fr.px[i], o = i * 4;
        if (c) { D[o] = c[0]; D[o+1] = c[1]; D[o+2] = c[2]; D[o+3] = 255; } }
      const t = document.createElement('canvas'); t.width = t.height = N;
      t.getContext('2d').putImageData(im, 0, 0);
      const sx = Math.round(N * X0), sw = Math.round(N * (X1 - X0));
      const sy = Math.round(N * Y0), sh = Math.round(N * (Y1 - Y0));
      cx.drawImage(t, sx, sy, sw, sh, dx, dy, sw * Z / 2, sh * Z / 2);
    };

    /* ---- the two that were wrong, before and after ---- */
    let y = HDR;
    cx.fillStyle = '#c98a6a'; cx.font = 'bold 16px monospace';
    cx.fillText('BEFORE', PAD, y - 8);
    ['Colorful', 'Blues'].forEach((n, i) => {
      const look = LOOKS.filter(f => f.faction === n)[0];
      const fr = shot(look.dials, BEFORE[n]);
      const x = PAD + i * (cw + PAD);
      blit(fr, x, y);
      cx.fillStyle = '#e8dcc6'; cx.font = 'bold 15px monospace';
      cx.fillText(n.toUpperCase(), x, y + ch + 20);
      cx.fillStyle = '#c98a6a'; cx.font = '13px monospace';
      cx.fillText('colour strength ' + satOf(fr).toFixed(2), x, y + ch + 38);
    });
    cx.fillStyle = '#8fc07a'; cx.font = 'bold 16px monospace';
    cx.fillText('NOW', PAD + 2 * (cw + PAD) + 10, y - 8);
    ['Colorful', 'Blues'].forEach((n, i) => {
      const look = LOOKS.filter(f => f.faction === n)[0];
      const fr = shot(look.dials, look.worn);
      const x = PAD + (2 + i) * (cw + PAD) + 10;
      blit(fr, x, y);
      cx.fillStyle = '#e8dcc6'; cx.font = 'bold 15px monospace';
      cx.fillText(n.toUpperCase(), x, y + ch + 20);
      cx.fillStyle = '#8fc07a'; cx.font = '13px monospace';
      cx.fillText('colour strength ' + satOf(fr).toFixed(2), x, y + ch + 38);
    });
    y += ch + 60 + 40;

    /* ---- and the whole valley, so you can see who owns what ---- */
    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 20px monospace';
    cx.fillText('ALL THIRTEEN, SO YOU CAN SEE WHO OWNS WHAT', PAD, y - 12);
    const perRow = 7;
    LOOKS.forEach((f, i) => {
      const col = i % perRow, row = (i / perRow) | 0;
      const x = PAD + col * (cw + PAD);
      const yy = y + row * (ch + 60);
      blit(shot(f.dials, f.worn), x, yy);
      cx.fillStyle = '#e8dcc6'; cx.font = 'bold 13px monospace';
      cx.fillText(f.faction.toUpperCase().slice(0, 11), x, yy + ch + 18);
    });

    G.bodyVar = keepV; window.G_WORN = keepW; G.equipped = keepE;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    cx.fillStyle = '#6f6455'; cx.font = '14px monospace';
    cx.fillText('nobody changed shape. same coat, same cap, same boots -- only the colour moved,', PAD, cv.height - 34);
    cx.fillText('so you can still tell them apart in the dark, which is what the outlines are for.', PAD, cv.height - 14);
    return cv.toDataURL('image/png').split(',')[1];
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
