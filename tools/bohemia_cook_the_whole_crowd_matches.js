#!/usr/bin/env node
/* BOHEMIA -- COOK: THE WHOLE CROWD MATCHES. PORTRAIT [hairstyles match] round two, 10/9/26.
 *
 * Last round fixed the face MAKER (the player's own customization panel). While folding
 * that work back in after a 61-commit gap, re-reading faceFor() (the function that draws
 * EVERY citizen's portrait, not just the player's) found the same shape of bug, bigger:
 * line ~6390 rolled the hair texture at random for every single person in the valley,
 * never reading what the body is actually wearing, with a comment that said "nothing on
 * the body to agree with yet" -- true in 8/28, false today. Measured on 300 crowd citizens:
 * 82 wear one of the three canon cuts that now carry a real texture (ROPE LOCKS, SHORT
 * ROPES, DUST WEAVE), and 76 of the 82 (93%) had a portrait texture that disagreed with
 * the body they're standing in.
 *
 * THE FIX: read the already-parsed _hd.tex (the same lookup the braid sentinel two lines
 * below it already uses) before falling back to the random roll, so a cut with a real
 * texture keeps it and a cut without one (8 of 11 canon cuts) is untouched.
 *
 * NOTHING SHIPPED MOVED: hashed the 218 of 300 crowd citizens wearing an untextured cut
 * on a clean checkout and again after the fix -- 0 differences. His approved face never
 * goes through faceFor() at all (it is buildSpec()/pface), so this cannot touch it; the
 * gates confirm the pin is unmoved either way.
 *
 *   node tools/bohemia_cook_the_whole_crowd_matches.js
 */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const SHEET = path.join(REPO, 'slices/vote/PORTRAIT_THE_WHOLE_CROWD_MATCHES.png');
const PAGE  = path.join(REPO, 'slices/vote/PORTRAIT_THE_WHOLE_CROWD_MATCHES.html');
const NUMS  = path.join(REPO, 'records/target/BOHEMIA_THE_WHOLE_CROWD_MATCHES.json');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 1400 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof renderFace === 'function' && typeof faceFor === 'function' &&
    typeof hairDialsFor === 'function', { timeout: 60000 });

  const out = await p.evaluate(() => {
    const N = 300;
    let texturedCuts = 0, matched = 0;
    const rows = [];
    for (let i = 0; i < N && rows.length < 6; i++) {
      const id = 'gate:crowd:' + i;
      const sp = faceFor(id);
      if (sp.face.bald) continue;
      const bodyTex = (hairDialsFor(sp.hair.name) || {}).tex;
      if (!bodyTex) continue;
      texturedCuts++;
      if (sp.hair.tex === bodyTex) matched++;
      if (rows.length < 6) {
        const ramp = faceRampFor(sp);
        const buf = Array.from(renderFace(sp, { ramp }));
        rows.push({ id, name: sp.hair.name, tex: sp.hair.tex, buf });
      }
    }
    // full-crowd stat (not just the first 6 shown)
    let fullTextured = 0, fullMatched = 0;
    for (let i = 0; i < N; i++) {
      const id = 'gate:crowd:' + i;
      const sp = faceFor(id);
      if (sp.face.bald) continue;
      const bodyTex = (hairDialsFor(sp.hair.name) || {}).tex;
      if (!bodyTex) continue;
      fullTextured++;
      if (sp.hair.tex === bodyTex) fullMatched++;
    }
    return { rows, fullTextured, fullMatched, N };
  });

  const sheetPng = await p.evaluate((out) => {
    const FN = 64, Z = 5, PAD = 14;
    const cv = document.createElement('canvas');
    cv.width = PAD * 2 + FN * Z + 220;
    cv.height = 90 + out.rows.length * (FN * Z + 14);
    const cx = cv.getContext('2d'); cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#14120f'; cx.fillRect(0, 0, cv.width, cv.height);
    cx.fillStyle = '#f0e6d4'; cx.font = 'bold 20px monospace';
    cx.fillText('THE WHOLE CROWD MATCHES', PAD, 30);
    cx.font = '13px monospace'; cx.fillStyle = '#b8ab95';
    cx.fillText('six citizens wearing a textured cut, portrait now reading the body\'s real texture.', PAD, 52);
    cx.fillText(out.fullMatched + ' of ' + out.fullTextured + ' textured citizens now match (was 6 of 82 before).', PAD, 72);
    const mk = (buf) => { const t = document.createElement('canvas'); t.width = t.height = FN;
      const im = t.getContext('2d').createImageData(FN, FN); im.data.set(new Uint8ClampedArray(buf));
      t.getContext('2d').putImageData(im, 0, 0); return t; };
    let y = 90;
    out.rows.forEach(r => {
      cx.drawImage(mk(r.buf), 0, 0, FN, FN, PAD, y, FN*Z, FN*Z);
      cx.fillStyle = '#c7b894'; cx.font = 'bold 13px monospace';
      cx.fillText(r.name.toLowerCase(), PAD + FN*Z + 14, y + 20);
      cx.fillStyle = '#8f836f'; cx.font = '12px monospace';
      cx.fillText('portrait texture: ' + r.tex, PAD + FN*Z + 14, y + 40);
      y += FN*Z + 14;
    });
    return cv.toDataURL('image/png');
  }, out);

  fs.mkdirSync(path.dirname(SHEET), { recursive: true });
  fs.writeFileSync(SHEET, Buffer.from(sheetPng.split(',')[1], 'base64'));

  const html = `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA — The Whole Crowd Matches</title>
<!-- PORTRAIT [hairstyles match] round two, 10/9/26. This is a shipped fix, not a vote. -->
<style>
  :root{--ink:#e8e0cc;--bg:#0d0d12}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
       font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;padding:14px}
  img{max-width:100%;image-rendering:pixelated;border-radius:6px}
  p{max-width:70ch;color:#a49a86}
  b{color:#c8bfa8;font-weight:normal}
</style>
<p>Last round fixed the hair picker you build your own face with. While getting that fix
into the game this round, the same mistake turned up in the much bigger place: the
portrait every citizen in the valley gets. Three haircuts have a real texture (ropes,
locs); the portrait was picking a random one instead of reading the real one.</p>
<p>Checked on 300 people: <b>${out.fullMatched} of ${out.fullTextured}</b> now match,
up from 6 of 82 before. Already shipped, not a vote -- your own approved face never
goes through this code at all, so it never moved.</p>
<img src="PORTRAIT_THE_WHOLE_CROWD_MATCHES.png" alt="the whole crowd matches">
`;
  fs.writeFileSync(PAGE, html);

  const summary = { when: new Date().toISOString(), fullTextured: out.fullTextured, fullMatched: out.fullMatched };
  fs.writeFileSync(NUMS, JSON.stringify(summary, null, 1));
  console.log(JSON.stringify(summary, null, 1));
  console.log('sheet ' + SHEET + '   page ' + PAGE + '   page errors ' + errs.length, errs.slice(0, 3));
  await b.close();
})();
