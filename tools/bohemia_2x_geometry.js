/* BOHEMIA 2X -- DID ANYTHING MOVE? (Paolo 8/14)
 *
 * "everything looks the same but sharper and nothing regresses" is the bar, and
 * eyeballing two sprites side by side cannot enforce it. This measures the frames
 * already captured in records/2x/before and records/2x/after:
 *
 *   BOUNDING BOX   where the character sits in the 112 frame. It must not drift.
 *                  It is expected to be a TOUCH tighter -- the border used to add
 *                  2px per side and now adds 1 -- and that difference is reported
 *                  separately from the body so a real shift cannot hide inside it.
 *   BODY BOX       *** THIS ONE IS WRONG AND IT IS LEFT HERE AS THE WORKED EXAMPLE. ***
 *                  It tried to isolate the body by excluding pure black from the
 *                  rendered PNG. PUNK WEARS A BLACK COAT, so it excluded most of his
 *                  torso and legs and measured skin and highlights instead. It then
 *                  flagged a 2px "the body moved" that was a coat highlight, and a
 *                  left edge shedding -1px, which is not something a thinner border
 *                  can do. SUPERSEDED BY tools/bohemia_2x_gridbox.js, which measures
 *                  the part-id GRID -- the body with no border, no clothing and no
 *                  ambiguity, and the thing CHAR_OUTLINE explicitly never touches.
 *                  Do not trust the BODY BOX column below.
 *   SKIN ROWS      how many rows carry face/skin tone, and where the face sits.
 *                  A head that slid up or down shows here first.
 *
 *   node tools/bohemia_2x_geometry.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const D2X = path.join(REPO, 'records/2x');
const KEYS = ['S_idle_0', 'SE_walk_0.25', 'E_idle_0', 'N_walk_0.5', 'W_idle_0', 'NE_idle_0'];

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 400, height: 400 } });

  const rows = [];
  for (const k of KEYS) {
    const pair = {};
    for (const which of ['before', 'after']) {
      const p = path.join(D2X, which, k + '.png');
      if (!fs.existsSync(p)) { console.log('  missing ' + p); process.exit(1); }
      const src = 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');
      pair[which] = await page.evaluate(async (src) => {
        const img = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
        const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
        const c = cv.getContext('2d'); c.imageSmoothingEnabled = false; c.drawImage(img, 0, 0);
        const W = cv.width, H = cv.height, D = c.getImageData(0, 0, W, H).data;
        const A = i => D[i * 4 + 3] > 40;
        const blk = i => A(i) && D[i*4] < 40 && D[i*4+1] < 40 && D[i*4+2] < 40;
        const box = (test) => { let x0=1e9,y0=1e9,x1=-1,y1=-1;
          for (let y=0;y<H;y++) for (let x=0;x<W;x++){ const i=y*W+x; if(!test(i))continue;
            if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; }
          return [x0,y0,x1,y1]; };
        const full = box(A);
        const body = box(i => A(i) && !blk(i));
        let px = 0; for (let i=0;i<W*H;i++) if (A(i)) px++;
        return { W, H, full, body, px };
      }, src);
    }
    rows.push({ k, ...pair });
  }
  await browser.close();

  console.log('  frame        FULL BOX (with border)        BODY BOX (border excluded)     px');
  for (const r of rows) {
    const f = (b) => '[' + b.join(',') + ']';
    console.log('  ' + r.k.padEnd(13) +
      (f(r.before.full) + ' -> ' + f(r.after.full)).padEnd(30) + '  ' +
      (f(r.before.body) + ' -> ' + f(r.after.body)).padEnd(30) + '  ' +
      r.before.px + '->' + r.after.px);
  }

  ok('the frame is still 112x112 — every downstream consumer (combat sprites, the ' +
     'cast strips, the city bake) sees the size it always saw',
     rows.every(r => r.after.W === 112 && r.after.H === 112));

  /* THE BODY MUST NOT MOVE. This is the assertion that catches the classic broken
     migration -- doubled art bound to joints at half their true position puts the
     body somewhere else entirely, and it would sail past a "does it look sharper"
     eyeball check. 1px of slack, because the border it used to wear was 2px thick
     and shedding it can uncover a body pixel that was previously painted over. */
  const moved = rows.filter(r => r.before.body.some((v, i) => Math.abs(v - r.after.body[i]) > 1));
  ok('THE BODY DID NOT MOVE — same position in the frame, within 1px, on every ' +
     'facing tested' + (moved.length ? ' [' + moved.map(m => m.k).join(',') + ']' : ''),
     moved.length === 0);

  /* the border shed exactly one pixel per side: that IS his ruling, measured on
     the silhouette rather than asserted from the code */
  const shed = rows.map(r => (r.after.full[0] - r.before.full[0]));
  ok('the silhouette shed exactly 1px on the left edge (the border went 2px -> 1px) ' +
     '[' + shed.join(',') + ']', shed.every(v => v === 1));

  console.log('2X GEOMETRY: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
