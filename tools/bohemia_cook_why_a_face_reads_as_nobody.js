#!/usr/bin/env node
/* BOHEMIA -- COOK: WHY A FACE READS AS NOBODY.  PORTRAIT [blank faces] school round, 9/28.
 *
 * Coordinator 9/14: what makes a small painted face read as a person, measured
 * against twenty shipped faces at his phone size, deliver the three defects by
 * frequency. No face is redrawn this round (school, not build).
 *
 * THREE FINDINGS, EACH SHOWN WITH REAL RENDERER PIXELS, NOT A DRAWING:
 *   1. THE LIGHT (still open, re-measured, and worse than last read): 0 of 20
 *      crowd faces meet the world's own right-lit threshold; 18 of 20 actually
 *      lean the WRONG way (left brighter than right).
 *   2. THE HAIR HAS NO VOLUME: 65-99% of every hairstyle's own pixels are one
 *      single flat tone, on a mass that runs 300-1,000+ px of a 4,096 px face.
 *   3. THE BROW SHADOW IS AN ACCIDENT: only half of bare-eyed faces show any
 *      darkening above the eye at all, and where it exists nothing in the
 *      renderer put it there on purpose -- it is overlap with the general
 *      soft-shadow polygon, not a socket cue.
 *
 * Rule 25: it plays, on the real clock, two real faces per finding, no vote of
 * its own (this rides the school row, not a build he can approve or reject).
 * Rule 32(f): faces at 132 px, the measured VOTE-tab size.
 *
 * REFERENCE CHECK (the 9/4 standing duty): this is a measurement of OUR OWN
 * renderer against principles from general portrait-painting and pixel-art
 * practice (form shadow, hair as a lit mass, not a flat colour swatch); no
 * reference game is cited or needed here.
 *
 * Out: slices/vote/PORTRAIT_WHY_A_FACE_READS_AS_NOBODY.png / .html
 */
'use strict';
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..');

(async()=>{
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:900,height:700}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,200)));
  await p.goto('file://'+path.join(ROOT,'slices/BOHEMIA_ALPHA_0_9.html'),{waitUntil:'load'});
  await p.waitForFunction(()=>typeof facePerform==='function',{timeout:60000});

  const bake=await p.evaluate(()=>{
    const STEP=1000/30, PERIOD=5500, N=64;
    const lumOf=c=>0.299*c[0]+0.587*c[1]+0.114*c[2];
    const uniq=[],byKey=new Map();
    const push=buf=>{let k='';for(let i=0;i<buf.length;i+=4)k+=String.fromCharCode(buf[i],buf[i+1],buf[i+2]);
      if(byKey.has(k))return byKey.get(k);
      const i=uniq.length; uniq.push(Array.from(buf)); byKey.set(k,i); return i;};
    const strip=id=>{const sp=faceFor(id), ramp=faceRampFor(sp), out=[];
      for(let t=0;t<PERIOD;t+=STEP){const pf=facePerform(id,t,null,{});
        out.push(push(renderFace(sp,{ramp,blink:pf.blink,brow:pf.brow,mouth:pf.mouth})));}
      return out;};

    const ids=[]; for(let i=0;i<20;i++) ids.push('gate:crowd:'+(i*10));
    const closeTo=(px,tones,tol)=>tones.some(t=>Math.abs(px[0]-t[0])<=tol&&Math.abs(px[1]-t[1])<=tol&&Math.abs(px[2]-t[2])<=tol);

    function measure(id){
      const sp=faceFor(id), ramp=faceRampFor(sp), buf=renderFace(sp,{ramp});
      const f=sp.face, e=sp.eyes;
      const L=ramp[0],Mn=ramp[1],Sh=ramp[2],Ln=ramp[3];
      const ShSoft=[(Mn[0]*2+Sh[0])/3|0,(Mn[1]*2+Sh[1])/3|0,(Mn[2]*2+Sh[2])/3|0];
      const skinTones=[L,Mn,Sh,Ln,ShSoft];
      const Y0=f.top, chin=Y0+f.len;
      const diffs=[];
      for(let y=Y0;y<chin;y++){
        const xs=[];
        for(let x=0;x<N;x++){const i=(y*N+x)*4;const px=[buf[i],buf[i+1],buf[i+2]];
          if(buf[i+3]>0&&closeTo(px,skinTones,3))xs.push(x);}
        if(xs.length<6)continue;
        const x0=xs[0],x1=xs[xs.length-1],w3=Math.max(2,((x1-x0)/3)|0);
        let ls=0,lc=0,rs=0,rc=0;
        for(let x=x0;x<x0+w3;x++){const i=(y*N+x)*4;if(buf[i+3]>0){ls+=lumOf([buf[i],buf[i+1],buf[i+2]]);lc++;}}
        for(let x=x1-w3;x<=x1;x++){const i=(y*N+x)*4;if(buf[i+3]>0){rs+=lumOf([buf[i],buf[i+1],buf[i+2]]);rc++;}}
        if(lc&&rc)diffs.push(rs/rc-ls/lc);
      }
      const avgDiff=diffs.length?diffs.reduce((a,c)=>a+c,0)/diffs.length:0;
      let baseSum=0,baseCnt=0;
      for(let y=Y0;y<chin;y++)for(let x=0;x<N;x++){const i=(y*N+x)*4;const px=[buf[i],buf[i+1],buf[i+2]];
        if(buf[i+3]>0&&closeTo(px,skinTones,3)){baseSum+=lumOf(px);baseCnt++;}}
      const base=baseCnt?baseSum/baseCnt:1;
      const h=sp.hair,hc=h.color,hi=hc.map(c=>Math.min(255,c+22)),hs=hc.map(c=>c*0.8|0);
      let hairPx=0,hairBaseOnly=0;
      for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=(y*N+x)*4;if(buf[i+3]===0)continue;
        const px=[buf[i],buf[i+1],buf[i+2]];
        if(closeTo(px,[hc,hi,hs],2)){hairPx++;if(closeTo(px,[hc],1))hairBaseOnly++;}}
      const hairFlatPct=hairPx?hairBaseOnly/hairPx*100:100;
      let dip=null;
      if(!sp.glasses){
        const y0=Math.min(f.browY,f.eyeY-2),y1=Math.max(y0,f.eyeY-1);
        let ss=0,sc=0;
        for(let y=y0;y<=y1;y++)for(let x=0;x<N;x++){const i=(y*N+x)*4;const px=[buf[i],buf[i+1],buf[i+2]];
          if(buf[i+3]>0&&closeTo(px,skinTones,3)){ss+=lumOf(px);sc++;}}
        if(sc)dip=(base-(ss/sc))/base*100;
      }
      return {lightPct:avgDiff/base*100, hairFlatPct, dip, hairPx};
    }

    const all=ids.map(id=>({id,...measure(id)}));
    const nLight8=all.filter(a=>a.lightPct>=8).length;
    const nWrongWay=all.filter(a=>a.lightPct<0).length;
    const avgHairFlat=all.reduce((s,a)=>s+a.hairFlatPct,0)/all.length;
    const withDip=all.filter(a=>a.dip!==null);
    const nRealDip=withDip.filter(a=>a.dip>=7).length;

    // pick two faces for each finding: extremes, so the numbers are visible in the picture
    const byLight=[...all].sort((a,b)=>a.lightPct-b.lightPct);
    const lightWorst=byLight[0], lightBest=byLight[byLight.length-1];
    const byHair=[...all].sort((a,b)=>b.hairPx-a.hairPx);
    const hairBig=byHair[0], hairBig2=byHair[1];
    const bySocket=[...withDip].sort((a,b)=>b.dip-a.dip);
    const socketHas=bySocket[0], socketNone=bySocket[bySocket.length-1];

    const pick=(a,label)=>({id:a.id,label,strip:strip(a.id),m:a});
    const cards=[
      pick(lightWorst,'LIGHT: worst (left-lit, wrong way)'), pick(lightBest,'LIGHT: best of the twenty'),
      pick(hairBig,'HAIR: biggest flat mass'), pick(hairBig2,'HAIR: biggest flat mass'),
      pick(socketHas,'SOCKET: has a real dip'), pick(socketNone,'SOCKET: no dip at all'),
    ];

    const cv=document.createElement('canvas');
    cv.width=N*uniq.length; cv.height=N;
    const cx=cv.getContext('2d');
    uniq.forEach((u,i)=>{const t=document.createElement('canvas');t.width=t.height=N;
      const tc=t.getContext('2d'),im=tc.createImageData(N,N);
      im.data.set(new Uint8ClampedArray(u));tc.putImageData(im,0,0);cx.drawImage(t,i*N,0);});

    return {cards, frames:uniq.length, stepMs:STEP, png:cv.toDataURL('image/png'),
      nums:{n:all.length, nLight8, nWrongWay, avgHairFlat:+avgHairFlat.toFixed(1),
             withDipN:withDip.length, nRealDip}};
  });

  fs.writeFileSync(path.join(ROOT,'slices/vote/PORTRAIT_WHY_A_FACE_READS_AS_NOBODY.png'),
                   Buffer.from(bake.png.split(',')[1],'base64'));

  const n=bake.nums;

  const html=`<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA — Why A Face Reads As Nobody</title>
<!-- PORTRAIT [blank faces] school round, 9/28. Real renderer pixels on the real
     120 BPM clock (rule 25). No fix in this card -- rule 6, school first,
     no face is redrawn this round. Faces at 132 px (rule 32f). -->
<style>
  :root{--ink:#e8e0cc;--bg:#0d0d12;--card:#16161d;--line:#33313d;--gold:#c79a3f;--red:#c56b6b}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
       font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;padding:14px}
  h1{font-size:13px;letter-spacing:2px;margin:0 0 4px;color:var(--gold)}
  p{margin:0 0 12px;color:#a49a86;max-width:60ch}
  .said{border-left:2px solid #7a4a4a;padding:6px 0 6px 10px;margin:0 0 14px;color:#b09a90}
  b{color:#c8bfa8;font-weight:normal}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
  .box{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:8px;text-align:center}
  .nm{font-size:9px;letter-spacing:.5px;color:var(--red);margin-bottom:6px}
  canvas.big{width:100%;max-width:132px;aspect-ratio:1/1;height:auto;image-rendering:pixelated;
         background:#101319;border-radius:3px;display:block;margin:0 auto}
  .note{margin-top:6px;color:#6f6862;font-size:10px}
  .num{margin:2px 0 12px;color:#a49a86;max-width:62ch}
</style>
<h1>WHY A FACE READS AS NOBODY</h1>
<div class="said">School round, [blank faces]. No face is redrawn this round -- this is what
twenty of your own crowd look like, measured, not guessed.</div>
<p>The old answer to this question was bead eyes and a flat mouth. Both are fixed now, from
other rounds -- checked before writing this, not assumed. Re-measured against twenty faces at
your real phone size, three things are still true.</p>

<p class="num"><b>1. THE LIGHT.</b> ${n.n} faces measured against your own world's rule (the
right side of a lit thing out-shines the left by at least 8%). <b>${n.nLight8} of ${n.n}</b>
meet it. Worse: <b>${n.nWrongWay} of ${n.n}</b> actually lean the OTHER way, left brighter
than right, which is backwards, not just flat.</p>
<div class="grid">${bake.cards.slice(0,2).map((c,i)=>`
  <div class="box"><div class="nm">${c.label}</div>
  <canvas class="big" data-k="c${i}" width="64" height="64"></canvas>
  <div class="note">light ${c.m.lightPct.toFixed(1)}%</div></div>`).join('')}
</div>

<p class="num"><b>2. THE HAIR HAS NO VOLUME.</b> Average <b>${n.avgHairFlat}%</b> of every
hairstyle's own pixels are one single flat colour. A hairstyle can be a quarter of the whole
picture and it reads as a coloured cap, not something with any shape to it.</p>
<div class="grid">${bake.cards.slice(2,4).map((c,i)=>`
  <div class="box"><div class="nm">${c.label}</div>
  <canvas class="big" data-k="c${i+2}" width="64" height="64"></canvas>
  <div class="note">hair flat ${c.m.hairFlatPct.toFixed(0)}%</div></div>`).join('')}
</div>

<p class="num"><b>3. THE BROW SHADOW IS AN ACCIDENT.</b> Of ${n.withDipN} faces with bare eyes,
only <b>${n.nRealDip}</b> show real darkening above the eye, and nothing in the renderer puts
it there on purpose -- it only happens where another shadow already overlaps that spot.</p>
<div class="grid">${bake.cards.slice(4,6).map((c,i)=>`
  <div class="box"><div class="nm">${c.label}</div>
  <canvas class="big" data-k="c${i+4}" width="64" height="64"></canvas>
  <div class="note">socket ${c.m.dip===null?'n/a':c.m.dip.toFixed(1)+'%'}</div></div>`).join('')}
</div>

<p class="num">No fix in this card. This is the school round; the rule for each is named in
the record. Thumbs up if this matches what you see, thumbs down if it does not.</p>
<script>
(function(){
  var C=${JSON.stringify(bake.cards.map(c=>c.strip))}, STEP=${bake.stepMs}, N=64;
  var img=new Image(); img.src='PORTRAIT_WHY_A_FACE_READS_AS_NOBODY.png';
  var cs={};
  document.querySelectorAll('canvas[data-k]').forEach(function(c){
    var x=c.getContext('2d'); x.imageSmoothingEnabled=false; cs[c.dataset.k]=x; });
  function put(k,f){var x=cs[k]; if(!x)return; x.clearRect(0,0,N,N); x.drawImage(img,f*N,0,N,N,0,0,N,N);}
  img.onload=function(){
    var t0=performance.now();
    (function loop(now){
      var k=Math.floor((now-t0)/STEP);
      C.forEach(function(s,i){ put('c'+i, s[k%s.length]); });
      requestAnimationFrame(loop);
    })(t0);
  };
})();
</script>
`;
  fs.writeFileSync(path.join(ROOT,'slices/vote/PORTRAIT_WHY_A_FACE_READS_AS_NOBODY.html'),html);
  console.log('light: 0-of-8pct =', n.n-n.nLight8, 'of', n.n, ', wrong-way =', n.nWrongWay);
  console.log('hair flat avg', n.avgHairFlat, '%');
  console.log('socket: real dip', n.nRealDip, 'of', n.withDipN, 'bare-eyed faces');
  console.log('unique frames', bake.frames);
  console.log('page errors', errs.length, errs.slice(0,2));
  await b.close();
})();
