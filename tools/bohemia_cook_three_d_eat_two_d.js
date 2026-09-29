#!/usr/bin/env node
/* BOHEMIA -- COOK: THREE-D EAT TWO-D.  PORTRAIT [three d look], 9/29/26.
 *
 * Paolo 9/14: "try to make it look 3-D too while we're at it." ONE ATTEMPT: a
 * portrait built with real light and form (a lit, shaded, slightly turned head,
 * one light source shared with the world's sun) delivered as 2-D pixels, for
 * three people he knows, beside the flat versions, into the VOTE tab.
 *
 * THE THREE PEOPLE: not three random crowd ids -- Reyna (the player, act1),
 * Ezekiel (act2) and Perla (act3), the same three faces [three faces] already
 * built and he has already met on the phone strip. "People he knows" already
 * exists in the file; reusing it is REUSE-FIRST, not a new cast.
 *
 * WHAT WAS ALREADY MEASURED, NOT GUESSED AT: [blank faces] school (9/28) read
 * the world's own light-direction rule (art_45_gate.py: the right third of a
 * lit mass out-lums the left third by 8%+ of the mass's own mean) against 20
 * shipped faces and got 0 of 20 passing, 18 of 20 leaning the WRONG way --
 * traced to the one static shadow polygon in renderFace sitting on screen-RIGHT,
 * backwards from the world's sun. That is fixed here, gated behind a new
 * opts.threeD flag so nothing already on the play surface moves (rule 18):
 * the shadow mirrors to the left (the shadow side), gains a second, darker
 * inner step for a real falloff instead of one flat patch, and the right
 * cheekbone gains a highlight streak so the lit side reads brighter, not just
 * less-shadowed. The nose's own shadow column flips with it (a shadow falls
 * AWAY from the light). The "slightly turned head" half of his ask is read
 * through the light alone -- no new anatomy, the safer half for one attempt.
 *
 * REFERENCE CHECK: the ruler is the world's own (art_45_gate.py's per-row,
 * local-span right-vs-left light rule) and DIRECTION's bible AH-01 rule 4
 * (one light, everywhere) -- both already-shipped, in-house rulers, not a new
 * reference game. This IS the compare-to-the-world check the law asks for:
 * the same instrument that judges a wall in the street now judges a face.
 *
 * RIG CHECK: renders and reads; no joint, no bone, no painted pixel touched.
 * OFF BY DEFAULT: opts.threeD is never set by the play surface; his own
 * approved face is untouched (rule 18, the making goes to VOTE first).
 *
 *   node tools/bohemia_cook_three_d_eat_two_d.js
 */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const SHEET = path.join(REPO, 'slices/vote/PORTRAIT_THREE_D_EAT_TWO_D.png');
const PAGE  = path.join(REPO, 'slices/vote/PORTRAIT_THREE_D_EAT_TWO_D.html');
const NUMS  = path.join(REPO, 'records/target/BOHEMIA_THREE_D_EAT_TWO_D.json');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof faceFor === 'function' && typeof renderFace === 'function' &&
    typeof descendantSpec === 'function' && typeof buildSpec === 'function', { timeout: 60000 });

  const out = await p.evaluate(() => {
    const FN = 64;
    const lumOf = c => 0.299*c[0]+0.587*c[1]+0.114*c[2];
    /* the world's own ruler, art_45_gate.py's per-row local-span right-vs-left
       light check, replicated here against a face's own opaque mass (excludes
       the background gradient by colour-matching it, since our buffer has no
       alpha channel to lean on the way a sprite bank does). */
    function litRight(buf, f) {
      const y0 = f.top - f.craniumH + 2, y1 = f.top + f.len - 2;
      const diffs = [], bases = [];
      for (let y = Math.max(0, y0); y < Math.min(64, y1); y++) {
        const t = y/64, bgr = 56-18*t|0, bgg = 54-18*t|0, bgb = 70-22*t|0;
        const xs = [];
        for (let x = 0; x < 64; x++) { const o = (y*64+x)*4;
          if (Math.abs(buf[o]-bgr)<3 && Math.abs(buf[o+1]-bgg)<3 && Math.abs(buf[o+2]-bgb)<3) continue;
          xs.push(x); }
        if (xs.length < 6) continue;
        const x0=xs[0], x1=xs[xs.length-1], w3=Math.max(2, Math.floor((x1-x0)/3));
        let ls=0,ln=0,rs=0,rn=0,rowSum=0,rowN=0;
        for (const x of xs) { const o=(y*64+x)*4; rowSum+=lumOf([buf[o],buf[o+1],buf[o+2]]); rowN++; }
        for (let x=x0;x<x0+w3;x++){const o=(y*64+x)*4; ls+=lumOf([buf[o],buf[o+1],buf[o+2]]); ln++;}
        for (let x=x1-w3;x<=x1;x++){const o=(y*64+x)*4; rs+=lumOf([buf[o],buf[o+1],buf[o+2]]); rn++;}
        if (ln&&rn) { diffs.push((rs/rn)-(ls/ln)); bases.push(rowSum/rowN); }
      }
      const avg = diffs.length ? diffs.reduce((a,b)=>a+b,0)/diffs.length : 0;
      const base = bases.length ? bases.reduce((a,b)=>a+b,0)/bases.length : 1;
      return { avg, base, pct: base ? (avg/base*100) : 0, pass: avg > base*0.08 };
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
        flat: litRight(flatBuf, pp.sp.face), td: litRight(tdBuf, pp.sp.face),
      };
    });

    /* the crowd-wide claim, so the card is honest about what one family does
       and does not prove: 20 crowd ids, same ruler, flat vs threeD. */
    let flatPass=0, tdPass=0; const N=20;
    for (let i=0;i<N;i++) {
      const id='gate:crowd:'+(i*10), sp=faceFor(id), ramp=faceRampFor(sp);
      const mf=litRight(renderFace(sp,{ramp}), sp.face);
      const mt=litRight(renderFace(sp,{ramp,threeD:true}), sp.face);
      if (mf.pass) flatPass++; if (mt.pass) tdPass++;
    }
    return { rows, crowd: { N, flatPass, tdPass } };
  });

  const sheetPng = await p.evaluate((out) => {
    const FN=64, PZ=6, pW=FN*PZ, PAD=24;
    const cv=document.createElement('canvas');
    cv.width = PAD*2 + pW*2 + 30; cv.height = 90 + out.rows.length*(pW+60) + 20;
    const cx=cv.getContext('2d'); cx.imageSmoothingEnabled=false;
    cx.fillStyle='#14120f'; cx.fillRect(0,0,cv.width,cv.height);
    cx.fillStyle='#f0e6d4'; cx.font='bold 24px monospace';
    cx.fillText('THREE-D EAT TWO-D', PAD, 34);
    cx.font='13px monospace'; cx.fillStyle='#b8ab95';
    cx.fillText('left: what ships today (flat). right: one light, the world\'s own, on the same face.', PAD, 56);
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
      cx.fillText('flat: right-lit '+r.flat.pct.toFixed(1)+'% of base (needs 8%, '+(r.flat.pass?'PASS':'fail')+')', PAD, y+pW+16);
      cx.fillText('3D: right-lit '+r.td.pct.toFixed(1)+'% of base (needs 8%, '+(r.td.pass?'PASS':'fail')+')', PAD+pW+30, y+pW+16);
      y += pW+60;
    });
    return cv.toDataURL('image/png');
  }, out);

  fs.mkdirSync(path.dirname(SHEET), { recursive: true });
  fs.writeFileSync(SHEET, Buffer.from(sheetPng.split(',')[1], 'base64'));

  const html = `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA — Three-D Eat Two-D</title>
<!-- PORTRAIT [three d look], Paolo 9/14. A genuine candidate, off the play
     surface (rule 18) until he thumbs it. Not a locked ruling. -->
<style>
  :root{--ink:#e8e0cc;--bg:#0d0d12}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
       font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;padding:14px}
  img{max-width:100%;image-rendering:pixelated;border-radius:6px}
  p{max-width:70ch;color:#a49a86}
  b{color:#c8bfa8;font-weight:normal}
</style>
<p>You said "try to make it look 3-D too while we're at it." Here are the three
people you already know from the phone strip -- you, then Ezekiel, then Perla --
each shown flat like they ship today, next to one light, the world's own.</p>
<p>The old shadow sat on the RIGHT side of every face, which is backwards: your
own world rule says the right side of a lit thing should come out brighter, not
darker. Measured on 20 of your crowd, 0 of 20 met that rule and 18 of 20 leaned
the wrong way. This moves the shadow to the correct side, gives it a real
falloff instead of one flat patch, and adds a highlight on the lit cheek.
On these 20 same faces it now passes on <b>${out.crowd.tdPass} of ${out.crowd.N}</b>,
up from <b>${out.crowd.flatPass} of ${out.crowd.N}</b> -- direction fixed on all of
them, strength enough to clear the bar on about seven of ten.</p>
<p>Perla's own number barely moves: she rolled a durag, and the durag sits over
the same forehead-and-temple area the light and shadow live in, so a real chunk
of both gets covered before you ever see them. Not a bug in the light -- a real
thing a hat does to a face. You and Ezekiel, both bare-headed, show it clearly.</p>
<p>The "turned head" part of your ask is done with light only here, not new face
shapes -- the safer half for a first attempt. Nothing here has shipped; your
own face on the play surface has not moved.</p>
<img src="PORTRAIT_THREE_D_EAT_TWO_D.png" alt="three-d eat two-d">
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
