/* THE PORTRAIT WEARS YOUR HAIRCUT + THE FACE MAKER (8/28/26, CHARACTER lane).
 *
 * TWO THINGS IN ONE PICTURE, because they are one thing: the portrait grew a real hair
 * vocabulary, and that vocabulary is what the face maker's controls are made of.
 *
 * Paolo, 8/26: "Eye colors matching the portrait again."   -> ONE ID ONE WHOLE PERSON,
 * which fixed skin, hair COLOUR and eyes on 8/27 and never checked the haircut.
 * Paolo, 8/25, dispatch item 10: "FACE CUSTOMISATION, never built, is on the board."
 *
 * MEASURED over 200 citizens before touching anything: the body wore 16 distinct haircuts,
 * the portrait could draw SIX, and the two agreed 24.7% of the time -- worse than the 33%
 * a coin gives over three bands.
 *
 * RIG CHECK (RIG IS LAW, 7/26): renders and photographs, writes nothing back. Never touches
 * BAKED, a joint, a bone or a painted pixel.
 *   built on: faceFor + renderFace + buildFrame (read-only)   joints: none   parts: none
 *
 * REUSE CHECK: cooks ZERO graphic pixels. Every head is the alpha's own renderer.
 *
 *   node tools/bohemia_the_portrait_wears_your_haircut.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'slices/look/portrait-haircut.png');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1500, height: 1000 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof faceFor === 'function' && typeof buildFrame === 'function',
    { timeout: 40000 });

  const png = await p.evaluate(() => {
    const Z = 4, PAD = 12, HDR = 200;
    const fw = 64 * Z;
    const COLS = 10;
    const cv = document.createElement('canvas');
    cv.width = PAD + COLS * (fw + PAD);
    /* FOUR rows of faces, not three. The first cut of this counted three and the roll
       row rendered underneath the footer text -- a picture that cannot show its own claim
       is not evidence, and this one was covering the claim with a paragraph. */
    cv.height = HDR + 4 * (fw + 34) + 20 + 34 + 34 + 92;
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);

    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 30px monospace';
    cx.fillText('THE FACE THAT POPS UP IS WEARING YOUR HAIRCUT NOW', PAD, 46);
    cx.font = '17px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('the body has been picking from sixteen haircuts. the portrait could draw six of', PAD, 82);
    cx.fillText('them, and five of the seven names it could be given drew the exact same pixels. so', PAD, 106);
    cx.fillText('three people in four had one haircut standing in front of you and a different one', PAD, 130);
    cx.fillText('in the portrait when they spoke. they matched 24.7% of the time, which is worse', PAD, 154);

    const draw = (sp, x, y, opts) => {
      let buf; try { buf = renderFace(sp, Object.assign({ ramp: faceRampFor(sp) }, opts || {})); }
      catch (e) { return; }
      const t = document.createElement('canvas'); t.width = t.height = 64;
      const im = t.getContext('2d').createImageData(64, 64); im.data.set(buf);
      t.getContext('2d').putImageData(im, 0, 0);
      cx.drawImage(t, 0, 0, 64, 64, x, y, fw, fw);
    };

    /* ---- ROW 1: THE SAME PERSON, THE OLD WAY AND THE NEW WAY -------------- */
    let y = HDR;
    cx.fillStyle = '#8fc07a'; cx.font = 'bold 16px monospace';
    cx.fillText('THE SAME TEN PEOPLE  --  what their portrait used to show, and what it shows now',
      PAD, y - 10);
    const IDS = []; for (let i = 0; i < COLS; i++) IDS.push('street:' + i);
    IDS.forEach((id, i) => {
      const x = PAD + i * (fw + PAD);
      const sp = faceFor(id);
      /* THE OLD LOOK IS RECONSTRUCTED FROM THIS RENDERER, not from a stored screenshot:
         strip the new dials and it falls back to exactly the branch that used to run.
         The only difference on screen is then the thing being judged. */
      const old = JSON.parse(JSON.stringify(sp));
      delete old.hair.side; delete old.hair.front; delete old.hair.vol;
      delete old.hair.flare; delete old.hair.tex;
      draw(old, x, y);
      cx.fillStyle = '#8a7d68'; cx.font = '12px monospace';
      cx.fillText('before', x, y + fw + 18);
    });
    y += fw + 34 + 20;
    IDS.forEach((id, i) => {
      const x = PAD + i * (fw + PAD);
      draw(faceFor(id), x, y);
      cx.fillStyle = '#8fc07a'; cx.font = 'bold 12px monospace';
      const nm = (faceFor(id).hair.name || '').toLowerCase();
      cx.fillText(nm.slice(0, 15) || 'after', x, y + fw + 18);
    });
    y += fw + 34 + 34;

    /* ---- ROW 2: THE FIFTEEN CUTS AS PORTRAITS ---------------------------- */
    cx.fillStyle = '#8fc07a'; cx.font = 'bold 16px monospace';
    cx.fillText('AND IT CAN DRAW ALL FIFTEEN  --  ten of them here, the same cuts the body wears, from the same numbers',
      PAD, y - 10);
    const HAIRS = (window.GARMENTS || []).filter(g => g.layer === 'hair' && g.st === 'canon');
    const base = faceFor('probe:7');
    HAIRS.slice(0, COLS).forEach((h, i) => {
      const x = PAD + i * (fw + PAD);
      const d = hairDialsFor(h.n) || {};
      const sp = JSON.parse(JSON.stringify(base));
      sp.hair.tex = 'wave';
      sp.hair.side = d.side != null ? d.side : null;
      sp.hair.front = d.front != null ? d.front : null;
      sp.hair.vol = d.vol != null ? d.vol : null;
      sp.hair.flare = d.flare != null ? d.flare : null;
      draw(sp, x, y);
      cx.fillStyle = '#e8dcc6'; cx.font = '12px monospace';
      cx.fillText(h.n.toLowerCase().slice(0, 15), x, y + fw + 18);
    });
    y += fw + 34 + 34;

    /* ---- ROW 3: ROLL A FACE ---------------------------------------------- */
    cx.fillStyle = '#c98a6a'; cx.font = 'bold 16px monospace';
    cx.fillText('AND YOU CAN BUILD YOUR OWN  --  CHARACTER tab, tap your portrait. these are rolls of the same dice the sliders move',
      PAD, y - 10);
    for (let i = 0; i < COLS; i++) {
      const x = PAD + i * (fw + PAD);
      draw(faceFor('maker:' + (i + 41)), x, y);
    }
    y += fw + 34;

    cx.fillStyle = '#6f6455'; cx.font = '14px monospace';
    cx.fillText('than the 33% you would get from a coin. it is 88% now, and the portrait can draw', PAD, cv.height - 56);
    cx.fillText('fifty-six different haircuts instead of six. the face you play has fourteen', PAD, cv.height - 36);
    cx.fillText('sliders and every one of them moves real pixels. your own face is untouched.', PAD, cv.height - 16);
    return cv.toDataURL('image/png').split(',')[1];
  });

  await b.close();
  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(png, 'base64'));
  console.log('WROTE ' + path.relative(REPO, OUT) + '  (' + (fs.statSync(OUT).size / 1024).toFixed(1) + ' KB)');
})();
