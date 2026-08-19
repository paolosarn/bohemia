/* BOHEMIA THE FIELD SURGERY CLIPS, AS A PICTURE (Paolo 8/8 LOOK LAW + his 8/13 order)
 *
 * "just give me pictures and put it in a tab."
 *
 * Three clips for the five-step gunshot treatment he wrote himself at a bedside. A
 * strip cannot show timing, and timing is the whole design, so this shows BOTH: the
 * frames across, and under each one a bar chart of HOW FAR THE HAND MOVED between
 * that keyframe and the next. That bar chart is the actual difference between the
 * three, and it is the thing the gate asserts:
 *
 *     pour     a long flat stretch -- the hand has stopped, and nothing else stops
 *     inject   one tall bar -- the jab, the fastest single keyframe of the three
 *     tweeze   up-down-up-down -- the tremor, the only clip that shakes
 *
 * Frames come off drawChar, the same function the ANIMATION tab calls, and the bars
 * come off posedSkel -- the rig's own joints, not a guess about them.
 *
 * RIG CHECK (RIG IS LAW, Paolo 7/26/26): renders and measures, writes nothing. It
 *   sets no globals and authors no pixel. The citation below names what it ACTUALLY
 *   calls -- an earlier version claimed BAKED and RIG, which this file never
 *   references, and rig_check_gate caught the name-drop. A citation is a claim the
 *   machine can check, never a decoration.
 *   built on: drawChar, posedSkel, POSEHOLD
 *   joints: handR
 *   parts: none named
 *
 * REUSE CHECK: cooks no new graphic pixels. Every figure is the alpha's own render;
 * this arranges, labels and charts.
 *
 *   node tools/bohemia_field_surgery_picture.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'slices/look/field-surgery.png');

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  page.on('pageerror', e => console.log('PAGEERR ' + e.message.slice(0, 110)));
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(4000);

  const png = await page.evaluate(() => {
    const K = (typeof POSEHOLD !== 'undefined' && POSEHOLD.keys) || 12;
    const N = 8, S = 104, PAD = 8, HEAD = 132, LBL = 34, BAR = 40, GAP = 16;
    const ROWS = [
      ['pour',   'POUR THE IODINE',      'the hand comes up and STOPS. the long flat stretch is the pour.'],
      ['inject', 'INJECT THE LIDOCAINE', 'one tall bar: the needle goes in inside a single frame, then comes out slow.'],
      ['tweeze', 'PICK THE PELLETS OUT', 'up down up down -- the only clip in the game that trembles.']
    ];
    const cv = document.createElement('canvas');
    cv.width = PAD + N * (S + PAD);
    cv.height = HEAD + ROWS.length * (LBL + S + BAR + GAP) + 20;
    const g = cv.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.fillStyle = '#d9d4c8'; g.fillRect(0, 0, cv.width, cv.height);

    g.textAlign = 'left';
    g.fillStyle = '#1a1712'; g.font = 'bold 24px monospace';
    g.fillText('TREATING A GUNSHOT WOUND', PAD, 38);
    g.fillStyle = '#5a4a2a'; g.font = '14px monospace';
    g.fillText('your five steps, written at a bedside: pour the iodine, inject the lidocaine,', PAD, 62);
    g.fillText('boil the tweezers, pick the pellets out, inject the antibiotics.', PAD, 80);
    g.fillStyle = '#7a6a4a'; g.font = '13px monospace';
    g.fillText('three clips cover all five, because the needle is used twice and boiling the', PAD, 102);
    g.fillText('tweezers is a held prop. THE BARS UNDER EACH ROW ARE HOW FAST THE HAND MOVES.', PAD, 118);

    const tmp = document.createElement('canvas'); tmp.width = tmp.height = 112;
    ROWS.forEach(([clip, title, note], r) => {
      const y0 = HEAD + r * (LBL + S + BAR + GAP);
      g.fillStyle = '#1a1712'; g.font = 'bold 15px monospace';
      g.fillText(title, PAD, y0 + 14);
      g.fillStyle = '#7a6a4a'; g.font = '12px monospace';
      g.fillText(note, PAD, y0 + 30);
      for (let i = 0; i < N; i++) {
        try { drawChar(tmp, 'SE', clip, i / N); } catch (e) {}
        g.drawImage(tmp, PAD + i * (S + PAD), y0 + LBL, S, S);
      }
      /* the bar chart: hand travel between consecutive keyframes */
      const p = [];
      for (let i = 0; i < K; i++) p.push(posedSkel('SE', clip, i / K).sk.handR);
      const sp = [];
      for (let i = 0; i < K; i++) { const a = p[i], b = p[(i + 1) % K];
        sp.push(Math.hypot(b[0] - a[0], b[1] - a[1])); }
      const w = (cv.width - PAD * 2) / K, by = y0 + LBL + S + BAR - 6;
      g.strokeStyle = '#b3ad9e'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(PAD, by + 0.5); g.lineTo(cv.width - PAD, by + 0.5); g.stroke();
      for (let i = 0; i < K; i++) {
        const h = Math.min(BAR - 8, sp[i] * 5.2);
        g.fillStyle = sp[i] < 0.35 ? '#c2bcac' : '#7a5a2a';
        g.fillRect(PAD + i * w + 1, by - h, w - 3, Math.max(1, h));
      }
    });
    return cv.toDataURL('image/png').split(',')[1];
  });

  if (!png) { console.log('nothing rendered'); process.exit(1); }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('FIELD SURGERY: wrote ' + OUT + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
  await browser.close();
})();
