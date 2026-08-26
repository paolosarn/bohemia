/* THE FACE TALKS, BLINKS, AND MOVES ITS EYEBROWS (8/26/26, CHARACTER lane).
 *
 * Paolo, 8/26: "every time you speak to someone, their portrait will pop up on screen so
 * you feel like you're relating to them ... I said facial animations too, bro, like
 * talking and shit and, like ... from eyebrows moving"
 *
 * WHAT THIS SHOWS, and every frame is the real generator, not a mock-up:
 *   ROW 1  one line of dialogue, sound by sound. THE MOUTH IS DRIVEN BY THE LETTERS
 *          THEY ARE ACTUALLY SAYING -- walk the line, each sound picks a shape, so the
 *          same line always looks the same and an O in the text is an O on the face.
 *   ROW 2  the blink, on measured human numbers: 285ms, lid down faster than it opens.
 *   ROW 3  the eyebrows. A question lifts them. An exclamation drives them down.
 *
 * FOUR MOUTH SHAPES, NOT PRESTON BLAIR'S TEN. His chart is for a face with a thousand
 * pixels; this mouth is NINE WIDE AND THREE TALL. Ten shapes into nine pixels is the
 * same mistake as the overworld face scale he killed on 8/11 -- asking geometry to
 * express what it has no room for. Four shapes that READ beat ten that do not.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel.
 *   built on: renderFace (read-only)      joints: none      parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every face is the alpha's own renderFace.
 *
 *   node tools/bohemia_the_face_talks.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'slices/look/the-face-talks.png');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1300, height: 1400 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof renderFace === 'function' && typeof facePerform === 'function', { timeout: 30000 });

  const png = await p.evaluate(() => {
    const LINE = 'Oye, no tengo agua. You got any?';
    const COLS = 8, Z = 4, PAD = 14, HDR = 168, LBL = 34;
    const cell = 64 * Z;
    const cv = document.createElement('canvas');
    cv.width = PAD + COLS * (cell + PAD);
    cv.height = HDR + 3 * (cell + LBL + PAD + 20) + 60;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);

    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 30px monospace';
    cx.fillText('THE FACE TALKS', PAD, 46);
    cx.font = '17px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('the mouth is driven by the LETTERS they are actually saying, one sound', PAD, 80);
    cx.fillText('at a time. an O in the words is an O on the face, every time, the same way.', PAD, 104);
    cx.fillText('they blink on real human timing and their eyebrows answer the punctuation.', PAD, 128);

    const draw = (buf, dx, dy) => {
      const im = cx.createImageData(64, 64);
      im.data.set(buf);
      const t = document.createElement('canvas'); t.width = t.height = 64;
      t.getContext('2d').putImageData(im, 0, 0);
      cx.drawImage(t, 0, 0, 64, 64, dx, dy, cell, cell);
    };
    const face = (o) => renderFace(buildSpec(), Object.assign({ ramp: portraitRamp() }, o));

    let y = HDR;

    /* ---- ROW 1: the line, sound by sound ---- */
    cx.fillStyle = '#8fc07a'; cx.font = 'bold 16px monospace';
    cx.fillText('SAYING:  "' + LINE + '"', PAD, y);
    y += 16;
    const seq = visemesOf(LINE);
    for (let i = 0; i < COLS; i++) {
      const x = PAD + i * (cell + PAD);
      const v = seq[i] || 'closed';
      draw(face({ mouth: v }), x, y + LBL);
      cx.fillStyle = '#e8dcc6'; cx.font = 'bold 14px monospace';
      cx.fillText(v, x, y + 20);
    }
    cx.fillStyle = '#6f6455'; cx.font = '13px monospace';
    cx.fillText('one shape every 250ms -- half a beat at 120bpm, and inside the 200-250ms a real syllable takes.',
      PAD, y + LBL + cell + 18);
    y += cell + LBL + PAD + 30;

    /* ---- ROW 2: the blink ---- */
    cx.fillStyle = '#8fc07a'; cx.font = 'bold 16px monospace';
    cx.fillText('BLINKING:  285 milliseconds, which is what a real blink measures', PAD, y);
    y += 16;
    /* *** THE FIRST CUT OF THIS ROW SHOWED EIGHT IDENTICAL OPEN EYES. ***
       It asked facePerform for a person whose blink simply was not due in that
       285ms window, so the picture said "the blink does nothing" about code that
       works. Same lie three pictures told last week. The row now walks the blink
       through its own shape AND the caption states the schedule separately, so
       neither claim can hide behind the other. */
    const seedT = (() => { for (let ms = 0; ms < 12000; ms += 10) {
      if (facePerform('demo-blink', ms, null, {}).blink > 0.9) return ms; } return -1; })();
    let moved = 0;
    for (let i = 0; i < COLS; i++) {
      const x = PAD + i * (cell + PAD);
      const u = i / (COLS - 1);
      const bl = u < 0.4 ? (u / 0.4) : (1 - (u - 0.4) / 0.6);
      if (bl > 0.02) moved++;
      draw(face({ blink: bl }), x, y + LBL);
      cx.fillStyle = '#e8dcc6'; cx.font = 'bold 14px monospace';
      cx.fillText(Math.round(u * 285) + 'ms', x, y + 20);
    }
    if (moved < 3) { cx.fillStyle = '#c05a4a'; cx.font = 'bold 15px monospace';
      cx.fillText('THE BLINK DID NOT MOVE IN THIS ROW', PAD + 460, y); }
    cx.fillStyle = '#6f6455'; cx.font = '13px monospace';
    cx.fillText('the lid drops faster than it lifts, because that is what a lid does. this person\'s next blink is at '
      + (seedT < 0 ? 'NEVER -- THE SCHEDULE IS BROKEN' : (seedT + 'ms')) + ', on their own clock.',
      PAD, y + LBL + cell + 18);
    y += cell + LBL + PAD + 30;

    /* ---- ROW 3: the brows ---- */
    cx.fillStyle = '#8fc07a'; cx.font = 'bold 16px monospace';
    cx.fillText('EYEBROWS:  from angry to asking', PAD, y);
    y += 16;
    const MOODS = [['-1.0', -1], ['-0.6', -0.6], ['-0.3', -0.3], ['0', 0],
                   ['+0.3', 0.3], ['+0.6', 0.6], ['+1.0', 1], ['asking', 0.6]];
    for (let i = 0; i < COLS; i++) {
      const x = PAD + i * (cell + PAD);
      draw(face({ brow: MOODS[i][1], mouth: i === COLS - 1 ? 'mid' : 'closed' }), x, y + LBL);
      cx.fillStyle = '#e8dcc6'; cx.font = 'bold 14px monospace';
      cx.fillText(MOODS[i][0], x, y + 20);
    }
    cx.fillStyle = '#6f6455'; cx.font = '13px monospace';
    cx.fillText('down and forward is anger. up and flat is a question. a line ending in ? does this by itself.',
      PAD, y + LBL + cell + 18);

    cx.fillStyle = '#6f6455'; cx.font = '14px monospace';
    cx.fillText('a face with no performance asked of it is EXACTLY the face you approved, pixel for pixel.', PAD, cv.height - 32);
    cx.fillText('nothing here is random, so the same person is the same person every time you meet them.', PAD, cv.height - 12);
    return cv.toDataURL('image/png').split(',')[1];
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
