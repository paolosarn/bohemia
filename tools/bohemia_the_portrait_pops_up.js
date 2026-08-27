/* THE PORTRAIT POPS UP WHEN SOMEBODY TALKS (8/27/26, CHARACTER lane).
 *
 * Paolo, 8/26: "every time you speak to someone, their portrait will pop up on screen
 * so you feel like you're relating to them... facial animations too, bro, like talking
 * and shit... from eyebrows moving."
 *
 * THE 8/26 TURN BUILT THE PERFORMANCE AND COULD NOT USE IT, and this is why: renderFace
 * has always been called exactly one way in this entire codebase -- renderFace(buildSpec())
 * -- and buildSpec() is a clone of `pface`, the PLAYER's face. The cast had none. The
 * valley had none. "Their portrait pops up" had nothing to pop.
 *
 * So the missing piece was never the animation. It was A FACE FOR SOMEBODY WHO IS NOT YOU.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. Never
 * touches BAKED, a joint, a bone or a painted pixel. The face is its own 64x64 buffer.
 *   built on: renderFace / faceFor (read-only)     joints: none     parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every face is renderFace, which is the
 * approved PUNK portrait renderer, driven by different numbers. The cold-open row is a
 * screenshot of the real surface, not a mock.
 *
 *   node tools/bohemia_the_portrait_pops_up.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'slices/look/the-portrait-pops-up.png');
const LINE = 'Ray. RAY. Somebody is at the door.';

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1500, height: 1200 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof faceFor === 'function' && typeof openCaption === 'function',
    { timeout: 30000 });

  /* ---- the real surface, photographed, not drawn ------------------------- */
  await p.evaluate((line) => {
    document.getElementById('front').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    document.querySelectorAll('.panel').forEach(el => el.classList.remove('on'));
    const run = document.getElementById('p-run');
    run.classList.add('on'); run.style.height = '360px';
    const w = document.getElementById('openWrap');
    w.style.display = 'flex'; w.style.background = '#0b0d0a';
    const cv = document.getElementById('openCv'); if (cv) cv.style.display = 'none';
    openCaption({ line: { speaker: 'mother', text: line } });
  }, LINE);
  await p.waitForTimeout(500);
  const shot = await p.locator('#openWrap').screenshot();
  const shotB64 = shot.toString('base64');

  const png = await p.evaluate(async (args) => {
    const { shotB64, LINE } = args;
    const img = new Image();
    await new Promise(r => { img.onload = r; img.src = 'data:image/png;base64,' + shotB64; });

    const Z = 4, PAD = 14;
    const cv = document.createElement('canvas');
    const CAST_N = 8, ROWZ = 4;
    cv.width = PAD + CAST_N * (64 * ROWZ + PAD) + PAD;
    cv.height = 176 + 132 + (64 * Z + 52) + 54 + (64 * Z + 46) + 82;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);

    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 30px monospace';
    cx.fillText('THE PORTRAIT POPS UP WHEN SOMEBODY TALKS', PAD, 46);
    cx.font = '17px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('you asked for this. the face was built last time and could not be used, because', PAD, 84);
    cx.fillText('only YOU had a face in this whole game. everybody else was a body with nothing on', PAD, 110);
    cx.fillText('the front of their head. now every person in the valley has one, and it moves.', PAD, 136);

    /* ---- ROW 1: the real thing --------------------------------------------- */
    let y = 176;
    cx.fillStyle = '#8fc07a'; cx.font = 'bold 16px monospace';
    cx.fillText('THIS IS THE REAL SCREEN, PHOTOGRAPHED  --  the opening scene of the game', PAD, y - 8);
    /* CROP TO THE BAND THAT HAS THE THING IN IT. The overlay is a tall black
       rectangle with one caption row in the middle; pasting it whole showed him
       300px of empty background and a postage stamp. */
    const bandY = Math.round(img.height * 0.34), bandH = Math.round(img.height * 0.26);
    const sw = 900, sh = bandH * (sw / img.width);
    cx.drawImage(img, 0, bandY, img.width, bandH, PAD, y, sw, sh);
    cx.fillStyle = '#8a7d68'; cx.font = '14px monospace';
    cx.fillText('her name comes from the family cast. so does her age.', PAD + sw + 30, y + 40);
    cx.fillText('the face is rolled from her name and never changes.', PAD + sw + 30, y + 64);
    y += 132;

    const blit = (buf, dx, dy, z) => {
      const t = document.createElement('canvas'); t.width = t.height = 64;
      const im = t.getContext('2d').createImageData(64, 64); im.data.set(buf);
      t.getContext('2d').putImageData(im, 0, 0);
      cx.drawImage(t, 0, 0, 64, 64, dx, dy, 64 * z, 64 * z);
    };

    /* ---- ROW 2: the mouth reads the letters -------------------------------- */
    cx.fillStyle = '#8fc07a'; cx.font = 'bold 16px monospace';
    cx.fillText('THE MOUTH IS MAKING THE SOUND SHE IS ACTUALLY SAYING', PAD, y - 8);
    const sp = faceFor('MOTHER:DENISE', { age: 'adult' }), rp = faceRampFor(sp);
    /* walk the line and take the frames where the shape CHANGES, so the row shows
       the performance rather than eight copies of the same held vowel */
    /* visemesOf() returns the SHAPES ONLY -- a flat array of strings, already
       collapsed so a consonant run is one shape. To label each face with the
       letter that caused it, the line has to be walked with visemeFor directly.
       The first cut of this tool assumed visemesOf handed back {ch,v} objects and
       drew ONE face captioned "undefined": a picture is a claim, and a tool that
       guesses at an API it never read makes a false one. */
    const picks = []; let last = null;
    for (let i = 0; i < LINE.length && picks.length < 7; i++) {
      const v = visemeFor(LINE[i]);
      if (v !== last) { picks.push({ ch: LINE[i], v: v }); last = v; }
    }
    /* *** MAGNIFY THE MOUTH, BECAUSE THE MOUTH IS NINE PIXELS WIDE. ***
       The first cut of this row drew seven whole faces and the shapes were real but
       INVISIBLE -- 16 to 22 pixels change out of 4096, which is a genuine mouth
       movement and a useless picture. A picture has to show the thing it claims. So:
       one whole face for context, then the SAME PIXELS around her mouth blown up.
       Nothing is redrawn or exaggerated -- it is a crop at a bigger zoom. */
    const MZ = 11, MW = 18, MH = 12;
    const mx0 = 32 - (MW >> 1), my0 = sp.face.mouthY - 5;
    blit(renderFace(sp, { ramp: rp, mouth: picks[0] ? picks[0].v : 'closed' }), PAD, y, Z);
    cx.fillStyle = '#8a7d68'; cx.font = '13px monospace';
    cx.fillText('her, actual size', PAD, y + 64 * Z + 20);
    const crop = (buf, dx, dy) => {
      const t = document.createElement('canvas'); t.width = t.height = 64;
      const im = t.getContext('2d').createImageData(64, 64); im.data.set(buf);
      t.getContext('2d').putImageData(im, 0, 0);
      cx.drawImage(t, mx0, my0, MW, MH, dx, dy, MW * MZ, MH * MZ);
    };
    const x0 = PAD + 64 * Z + PAD + 18;
    picks.slice(0, 6).forEach((s, i) => {
      const x = x0 + i * (MW * MZ + 12);
      crop(renderFace(sp, { ramp: rp, mouth: s.v }), x, y + 30);
      cx.fillStyle = '#e8dcc6'; cx.font = 'bold 24px monospace';
      cx.fillText('"' + (s.ch === ' ' ? '_' : s.ch) + '"', x + 4, y + 24);
      cx.fillStyle = '#8a7d68'; cx.font = '12px monospace';
      cx.fillText(s.v, x + 4, y + 30 + MH * MZ + 18);
    });
    y += 64 * Z + 52 + 54;

    /* ---- ROW 3: the valley has faces --------------------------------------- */
    cx.fillStyle = '#c98a6a'; cx.font = 'bold 16px monospace';
    cx.fillText('AND EVERYBODY HAS ONE NOW  --  your family, then four strangers off the street', PAD, y - 8);
    const cast = [['FATHER:RAY','adult','RAY'],['MOTHER:DENISE','adult','DENISE'],
                  ['BROTHER:MARCO','teen','MARCO'],['SISTER:NINA','child','NINA'],
                  ['crowd:4',null,''],['crowd:5',null,''],['crowd:0',null,''],['crowd:11',null,'']];
    cast.forEach(([id, age, label], i) => {
      const s2 = faceFor(id, age ? { age } : null);
      const x = PAD + i * (64 * Z + PAD);
      blit(renderFace(s2, { ramp: faceRampFor(s2) }), x, y, Z);
      cx.fillStyle = label ? '#e8dcc6' : '#8a7d68';
      cx.font = (label ? 'bold ' : '') + '13px monospace';
      cx.fillText(label || 'a stranger', x, y + 64 * Z + 20);
    });

    cx.fillStyle = '#6f6455'; cx.font = '14px monospace';
    cx.fillText('nobody is random: the same person has the same face every time you meet them,', PAD, cv.height - 54);
    cx.fillText('on any phone, with nothing saved. they blink on real human timing and their', PAD, cv.height - 34);
    cx.fillText('eyebrows go up when they ask you something. who anybody IS is still yours.', PAD, cv.height - 14);
    return cv.toDataURL('image/png').split(',')[1];
  }, { shotB64, LINE });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
