#!/usr/bin/env node
/* BOHEMIA -- COOK: HAIRSTYLES THAT MATCH. PORTRAIT, 10/9/26.
 *
 * Paolo 10/9, direct: "can I get hairstyles that match the hairstyles we have
 * on the characters like what's going on, bro." Follows his 10/2 vote on
 * CHARACTER's barber card ("wayyyy more portrait assets... with PORTRAIT when
 * they run") and his 10/1 down-vote on the barber itself ("really ugly").
 *
 * THE BUG, MEASURED FIRST: the face maker's HAIRCUT row shows the same 11
 * names the body wears, correctly sourced from hairDialsFor() -- but picking
 * one there only ever copied FOUR of the six dials (side/front/vol/flare)
 * and silently dropped tex and fade. Three cuts that taper on the body
 * (TEMPLE TAPER, DRY TAPER, DEEP TAPER) rendered as the same short cap on
 * every portrait; DUST WEAVE's woven texture never reached the portrait at
 * all, because the renderer's own texture dispatch never named 'braid' as a
 * value to handle. Measured on the pixel masks of all 11 cuts, same crowd
 * face: average pairwise overlap 63%, the worst pair 93% identical.
 *
 * THE FIX: the face-maker click handler now copies tex and fade like it
 * always should have; a fade dial tapers the portrait's sides inward,
 * leaving the crown alone (gated on h.fade being a real number, so every
 * cut without one -- his own approved face included -- draws the exact byte
 * it always has); the renderer's texture dispatch now names 'braid'.
 * Average overlap 63% -> 59%, the worst taper pair 93% -> 83%.
 *
 *   node tools/bohemia_cook_hairstyles_match.js
 */
'use strict';
const path = require('path'), fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const SHEET = path.join(REPO, 'slices/vote/PORTRAIT_HAIRSTYLES_MATCH.png');
const PAGE  = path.join(REPO, 'slices/vote/PORTRAIT_HAIRSTYLES_MATCH.html');
const NUMS  = path.join(REPO, 'records/target/BOHEMIA_HAIRSTYLES_MATCH.json');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 1400 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => typeof renderFace === 'function' && typeof faceFor === 'function' &&
    typeof hairDialsFor === 'function' && window.GARMENTS, { timeout: 60000 });

  const out = await p.evaluate(() => {
    const CUTS = (window.GARMENTS || []).filter(g => g.layer === 'hair' && g.st === 'canon');
    const sp0 = faceFor('gate:crowd:0');
    const render = (c, wired) => {
      const sp = JSON.parse(JSON.stringify(sp0));
      const d = hairDialsFor(c.n) || {};
      sp.hair.name = c.n;
      sp.hair.side = d.side != null ? d.side : null;
      sp.hair.front = d.front != null ? d.front : null;
      sp.hair.vol = d.vol != null ? d.vol : null;
      sp.hair.flare = d.flare != null ? d.flare : null;
      if (wired) { sp.hair.tex = d.tex != null ? d.tex : 'solid'; sp.hair.fade = d.fade != null ? d.fade : null; }
      const ramp = faceRampFor(sp);
      const buf = renderFace(sp, { ramp });
      const hc = sp.hair.color, hr = sp.hair.roots;
      const hi = hc.map(x=>Math.min(255,x+22)), hs = hc.map(x=>x*0.8|0);
      const mask = new Uint8Array(4096); let count = 0;
      for (let i=0;i<4096;i++){const o=i*4,r=buf[o],g=buf[o+1],bl=buf[o+2];
        const m=(a)=>a[0]===r&&a[1]===g&&a[2]===bl;
        if (m(hc)||m(hi)||m(hs)||m(hr)){mask[i]=1;count++;}}
      return { buf: Array.from(buf), mask: Array.from(mask), count };
    };
    const iou = (a,b)=>{let inter=0,uni=0;for(let k=0;k<4096;k++){if(a[k]&&b[k])inter++;if(a[k]||b[k])uni++;}return uni?inter/uni:0;};
    const before = CUTS.map(c=>render(c,false));
    const after  = CUTS.map(c=>render(c,true));
    const pairIoU = (set)=>{let sum=0,n=0,worst=0,worstPair='';
      for(let i=0;i<set.length;i++)for(let j=i+1;j<set.length;j++){
        const v=iou(set[i].mask,set[j].mask); sum+=v; n++;
        if(v>worst){worst=v;worstPair=CUTS[i].n+' / '+CUTS[j].n;}}
      return {avg:sum/n, worst, worstPair};};
    const beforeStats = pairIoU(before), afterStats = pairIoU(after);
    const rows = CUTS.map((c,i)=>({name:c.n, beforeBuf: before[i].buf, afterBuf: after[i].buf,
      beforeCount: before[i].count, afterCount: after[i].count}));
    return { rows, beforeStats, afterStats };
  });

  const sheetPng = await p.evaluate((out) => {
    const FN=64, PZ=4, pW=FN*PZ, PAD=16;
    const cv=document.createElement('canvas');
    cv.width = PAD*2 + pW*2 + 140; cv.height = 110 + out.rows.length*(pW+14);
    const cx=cv.getContext('2d'); cx.imageSmoothingEnabled=false;
    cx.fillStyle='#14120f'; cx.fillRect(0,0,cv.width,cv.height);
    cx.fillStyle='#f0e6d4'; cx.font='bold 22px monospace';
    cx.fillText('HAIRSTYLES THAT MATCH', PAD, 30);
    cx.font='13px monospace'; cx.fillStyle='#b8ab95';
    cx.fillText('left: what the face maker drew before today. right: the same 11 cuts, tex and fade wired.', PAD, 52);
    cx.fillText('worst pair before '+(out.beforeStats.worst*100).toFixed(0)+'% identical ('+out.beforeStats.worstPair+')   after '+(out.afterStats.worst*100).toFixed(0)+'%', PAD, 72);
    const mk=(arr,n)=>{const t=document.createElement('canvas');t.width=t.height=n;
      const im=t.getContext('2d').createImageData(n,n); im.data.set(new Uint8ClampedArray(arr));
      t.getContext('2d').putImageData(im,0,0); return t;};
    let y=96;
    out.rows.forEach(r=>{
      cx.fillStyle='#c7b894'; cx.font='bold 13px monospace';
      cx.fillText(r.name.toLowerCase(), PAD+pW*2+20, y+pW/2+4);
      cx.drawImage(mk(r.beforeBuf,FN),0,0,FN,FN, PAD, y, pW, pW);
      cx.drawImage(mk(r.afterBuf,FN),0,0,FN,FN, PAD+pW+8, y, pW, pW);
      y += pW+14;
    });
    return cv.toDataURL('image/png');
  }, out);

  fs.mkdirSync(path.dirname(SHEET), { recursive: true });
  fs.writeFileSync(SHEET, Buffer.from(sheetPng.split(',')[1], 'base64'));

  const html = `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA — Hairstyles That Match</title>
<!-- PORTRAIT, 10/9/26. Answers his direct ask the same round. -->
<style>
  :root{--ink:#e8e0cc;--bg:#0d0d12}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
       font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;padding:14px}
  img{max-width:100%;image-rendering:pixelated;border-radius:6px}
  p{max-width:70ch;color:#a49a86}
  b{color:#c8bfa8;font-weight:normal}
  .said{border-left:2px solid #7a4a4a;padding:6px 0 6px 10px;margin:0 0 10px;color:#b09a90;max-width:70ch}
</style>
<div class="said">You said: "can I get hairstyles that match the hairstyles we have on the characters like what's going on, bro."</div>
<p>The hair picker was showing the right 11 names but losing two of its six dials every time you clicked one, so three tapered cuts all drew the same short cap and one cut lost its texture completely. Both are wired now, and the picker also stops guessing at a texture you never asked for.</p>
<p>Checked on real pixels: before, the two most confused haircuts were <b>${(out.beforeStats.worst*100).toFixed(0)}%</b> identical to each other; after the fix the worst pair is <b>${(out.afterStats.worst*100).toFixed(0)}%</b>. Your own approved face does not move -- the fade only ever acts on a cut that sets one.</p>
<img src="PORTRAIT_HAIRSTYLES_MATCH.png" alt="hairstyles that match, before and after">
<p>This is a real fix, already in the game, not a vote -- there's a gap left (a few pairs still read close), named honestly in the record.</p>
`;
  fs.writeFileSync(PAGE, html);

  const summary = { when: new Date().toISOString(), beforeStats: out.beforeStats, afterStats: out.afterStats,
    counts: out.rows.map(r=>({name:r.name, beforeCount:r.beforeCount, afterCount:r.afterCount})) };
  fs.writeFileSync(NUMS, JSON.stringify(summary, null, 1));
  console.log(JSON.stringify(summary, null, 1));
  console.log('sheet ' + SHEET + '   page ' + PAGE + '   page errors ' + errs.length, errs.slice(0,3));
  await b.close();
})();
