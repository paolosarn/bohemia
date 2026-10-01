#!/usr/bin/env node
/* BOHEMIA -- COOK: THE HAIR HAS VOLUME.  PORTRAIT [blank faces], round two, 10/1/26.
 *
 * [blank faces] school (9/28) found a second defect THE LIGHT fix did not touch:
 * "THE HAIR HAS NO VOLUME -- 84.8% average flat-tone share of every hairstyle's
 * own pixels, on a mass averaging 14.9% of the whole canvas." The renderer
 * already computes a highlight tone (+22 per channel) and a shadow tone
 * (x0.8) for hair and only ever used them for a three-pixel crown triangle.
 *
 * THE FIX, SAME FLAG AS [three d look]: opts.threeD now also sweeps the hair
 * cap -- a highlight across the upper-right dome (the lit side, same light
 * direction the face mass already takes under this flag), a shadow down the
 * whole left side. READ OFF THE BUFFER, never guessed from the polys (the
 * lesson the texture overlays already paid for -- the mass is several
 * overlapping polys and a bounding box leaks at the temples and the crown),
 * and it only ever touches pixels still carrying the flat base tone, so a
 * loc, a coil or a wave mark already drawn is never re-painted.
 *
 * STILL OFF BY DEFAULT (rule 18): his own approved face is untouched --
 * checked, hash unmoved.
 *
 *   node tools/bohemia_cook_the_hair_has_volume.js
 */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const SHEET = path.join(REPO, 'slices/vote/PORTRAIT_THE_HAIR_HAS_VOLUME.png');
const PAGE  = path.join(REPO, 'slices/vote/PORTRAIT_THE_HAIR_HAS_VOLUME.html');
const NUMS  = path.join(REPO, 'records/target/BOHEMIA_THE_HAIR_HAS_VOLUME.json');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof faceFor === 'function' && typeof renderFace === 'function' &&
    typeof descendantSpec === 'function' && typeof buildSpec === 'function', { timeout: 60000 });

  const out = await p.evaluate(() => {
    function flatShare(buf, sp) {
      if (sp.face.bald) return null;
      const h = sp.hair, hc = h.color, hr = h.roots,
            hi = hc.map(c=>Math.min(255,c+22)), hs = hc.map(c=>c*0.8|0);
      const eq = (o,c) => buf[o]===c[0] && buf[o+1]===c[1] && buf[o+2]===c[2];
      let base=0, total=0;
      for (let i=0;i<64*64;i++) {
        const o=i*4;
        if (eq(o,hc)) { base++; total++; }
        else if (eq(o,hi) || eq(o,hs) || eq(o,hr)) { total++; }
      }
      return total ? { base, total, pct: base/total*100 } : null;
    }

    const anc = buildSpec();
    const people = [
      { name: 'REYNA (you, act 1)', sp: anc },
      { name: 'EZEKIEL (act 2)', sp: descendantSpec(2, anc) },
      { name: 'PERLA (act 3)', sp: descendantSpec(3, anc) },
    ];
    const rows = people.map(pp => {
      const ramp = faceRampFor(pp.sp);
      const flatBuf = renderFace(pp.sp, { ramp });
      const tdBuf = renderFace(pp.sp, { ramp, threeD: true });
      return {
        name: pp.name,
        flatBuf: Array.from(flatBuf), tdBuf: Array.from(tdBuf),
        flat: flatShare(flatBuf, pp.sp), td: flatShare(tdBuf, pp.sp),
      };
    });

    /* the crowd-wide claim, the same 20 crowd ids the school round measured. */
    const N = 20; let beforeSum = 0, afterSum = 0, n = 0;
    for (let i = 0; i < N; i++) {
      const id = 'gate:crowd:' + (i * 10), sp = faceFor(id), ramp = faceRampFor(sp);
      const flat = flatShare(renderFace(sp, { ramp }), sp);
      const td = flatShare(renderFace(sp, { ramp, threeD: true }), sp);
      if (flat) { beforeSum += flat.pct; afterSum += td.pct; n++; }
    }
    return { rows, crowd: { n, beforePct: beforeSum / n, afterPct: afterSum / n } };
  });

  const sheetPng = await p.evaluate((out) => {
    const FN=64, PZ=6, pW=FN*PZ, PAD=24;
    const cv=document.createElement('canvas');
    cv.width = PAD*2 + pW*2 + 30; cv.height = 90 + out.rows.length*(pW+60) + 20;
    const cx=cv.getContext('2d'); cx.imageSmoothingEnabled=false;
    cx.fillStyle='#14120f'; cx.fillRect(0,0,cv.width,cv.height);
    cx.fillStyle='#f0e6d4'; cx.font='bold 24px monospace';
    cx.fillText('THE HAIR HAS VOLUME', PAD, 34);
    cx.font='13px monospace'; cx.fillStyle='#b8ab95';
    cx.fillText('left: what ships today (flat). right: the same light your 3-D face already uses.', PAD, 56);
    const mk=(arr,n)=>{const t=document.createElement('canvas');t.width=t.height=n;
      const im=t.getContext('2d').createImageData(n,n); im.data.set(new Uint8ClampedArray(arr));
      t.getContext('2d').putImageData(im,0,0); return t;};
    let y=88;
    out.rows.forEach(r=>{
      cx.fillStyle='#c7b894'; cx.font='bold 14px monospace';
      cx.fillText(r.name, PAD, y-6);
      cx.drawImage(mk(r.flatBuf,FN),0,0,FN,FN, PAD, y, pW, pW);
      cx.drawImage(mk(r.tdBuf,FN),0,0,FN,FN, PAD+pW+30, y, pW, pW);
      cx.fillStyle='#8f836f'; cx.font='12px monospace';
      cx.fillText('flat: '+r.flat.pct.toFixed(1)+'% one tone', PAD, y+pW+16);
      cx.fillText('3D: '+r.td.pct.toFixed(1)+'% one tone', PAD+pW+30, y+pW+16);
      y += pW+60;
    });
    return cv.toDataURL('image/png');
  }, out);

  fs.mkdirSync(path.dirname(SHEET), { recursive: true });
  fs.writeFileSync(SHEET, Buffer.from(sheetPng.split(',')[1], 'base64'));

  const html = `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA — The Hair Has Volume</title>
<!-- PORTRAIT [blank faces] round two, 10/1/26. A genuine candidate, off the
     play surface (rule 18) until he thumbs it. Not a locked ruling. -->
<style>
  :root{--ink:#e8e0cc;--bg:#0d0d12}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
       font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;padding:14px}
  img{max-width:100%;image-rendering:pixelated;border-radius:6px}
  p{max-width:70ch;color:#a49a86}
  b{color:#c8bfa8;font-weight:normal}
</style>
<p>Your own school round found a second thing wrong with faces that THE LIGHT fix
did not touch: the hair is one flat color. On twenty of your crowd, 85% of every
hairstyle's own pixels were the exact same single tone -- a colored cap, not hair
with any shape to it.</p>
<p>Here are the same three people from the 3-D card -- you, Ezekiel, Perla --
shown with today's flat hair next to the same light your 3-D face attempt already
uses: brighter on the lit side, darker on the far side, same direction as the
face. On the same twenty crowd faces, the one-flat-tone share drops from
<b>${out.crowd.beforePct.toFixed(1)}%</b> to <b>${out.crowd.afterPct.toFixed(1)}%</b>.</p>
<p>This rides the same opts.threeD flag [three d look] already built, so it only
ever does anything if that flag is on. Nothing here has shipped; your own face on
the play surface has not moved.</p>
<img src="PORTRAIT_THE_HAIR_HAS_VOLUME.png" alt="the hair has volume">
<p>Thumbs up moves it into the game. Thumbs down and it goes to the graveyard
with what to try differently.</p>
`;
  fs.writeFileSync(PAGE, html);

  const summary = { when: new Date().toISOString(), crowd: out.crowd,
    people: out.rows.map(r=>({name:r.name, flat:r.flat, td:r.td})) };
  fs.writeFileSync(NUMS, JSON.stringify(summary, null, 1));
  console.log(JSON.stringify(summary, null, 1));
  console.log('sheet ' + SHEET + '   page ' + PAGE + '   page errors ' + errs.length, errs.slice(0,3));
  await b.close();
})();
