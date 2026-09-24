#!/usr/bin/env node
/* BOHEMIA -- COOK: THE BUST.  PORTRAIT, [bb faces], 9/24/26.
 *
 * RULE 33(f), Paolo 9/24: every chat carries a Battle Brothers line, school first.
 * RULE 33(g), same round: "Battle Brothers is just a bunch of pictures... we can do more
 * and put more life into it" -- so every [bb ...] line ends with what MOVES that BB's
 * picture does not. This card plays. BB's portrait is a still; ours holds, blinks, and
 * its mouth is driven by the letters it is saying.
 * RULE 32(f): shown at 132 px, the MEASURED size a portrait occupies on a 390-wide phone.
 * RULE 25: it plays, and it carries no vote of its own.
 *
 * Out: slices/vote/PORTRAIT_THE_BUST.png   (frame strip)
 *      slices/vote/PORTRAIT_THE_BUST.html
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
  await p.waitForFunction(()=>typeof facePerform==='function'&&typeof renderFace==='function',{timeout:60000});

  const bake=await p.evaluate(()=>{
    const STEP=1000/30, PERIOD=5500;          /* one whole idle blink cycle */
    /* CAST BY THE CLAIM: the claim is that the shoulders ignore the chin, and the chin
       runs y=42..54, so the cast IS a short, a median and a long face. One face would
       have proved nothing -- the first version of this change looked good on a short face
       and made a long one WORSE, and only three faces showed it. */
    const all=[];
    for(let i=0;i<400;i++){const sp=faceFor('bb:'+i); all.push({id:'bb:'+i,sp,chin:sp.face.top+sp.face.len});}
    all.sort((a,c)=>a.chin-c.chin);
    const cast=[all[3],all[all.length>>1],all[all.length-4]];
    const bgShare=buf=>{let n=0;for(let y=0;y<64;y++)for(let x=0;x<64;x++){const k=(y*64+x)*4,t=y/64;
      if(buf[k]===(56-18*t|0)&&buf[k+1]===(54-18*t|0)&&buf[k+2]===(70-22*t|0))n++;}
      return +(100*n/4096).toFixed(1);};

    const uniq=[], byKey=new Map();
    const push=buf=>{let k='';for(let i=0;i<buf.length;i+=4)k+=String.fromCharCode(buf[i],buf[i+1],buf[i+2]);
      if(byKey.has(k))return byKey.get(k);
      const idx=uniq.length; uniq.push(Array.from(buf)); byKey.set(k,idx); return idx;};

    const rows=[];
    for(const c of cast){
      const ramp=faceRampFor(c.sp);
      const a=[],bb=[];
      for(let t=0;t<PERIOD;t+=STEP){
        const pf=facePerform(c.id,t,null,{});
        const o={ramp,blink:pf.blink,brow:pf.brow,mouth:pf.mouth};
        a.push(push(renderFace(c.sp,Object.assign({bust:0},o))));
        bb.push(push(renderFace(c.sp,Object.assign({bust:1},o))));
      }
      rows.push({chin:c.chin,
        todayEmpty:bgShare(renderFace(c.sp,{ramp,bust:0})),
        bustEmpty :bgShare(renderFace(c.sp,{ramp,bust:1})),
        a,b:bb});
    }
    const N=64, cv=document.createElement('canvas');
    cv.width=N*uniq.length; cv.height=N;
    const cx=cv.getContext('2d');
    uniq.forEach((u,i)=>{const t=document.createElement('canvas');t.width=t.height=N;
      const tc=t.getContext('2d'), im=tc.createImageData(N,N);
      im.data.set(new Uint8ClampedArray(u)); tc.putImageData(im,0,0); cx.drawImage(t,i*N,0);});
    return {rows,frames:uniq.length,stepMs:STEP,png:cv.toDataURL('image/png')};
  });

  fs.writeFileSync(path.join(ROOT,'slices/vote/PORTRAIT_THE_BUST.png'),
                   Buffer.from(bake.png.split(',')[1],'base64'));

  const labels=['A SHORT FACE','THE MIDDLE OF THE CROWD','A LONG FACE'];
  const cards=bake.rows.map((r,i)=>`  <div class="row">
    <div class="nm">${labels[i]}<span class="sub">chin at row ${r.chin} of 64</span></div>
    <div class="two">
      <div class="side"><div class="lab">TODAY</div><canvas data-k="a${i}" width="64" height="64"></canvas>
        <div class="px">${r.todayEmpty}% of it is nobody</div></div>
      <div class="side"><div class="lab hot">SHOULDERS THAT KNOW</div><canvas data-k="b${i}" width="64" height="64"></canvas>
        <div class="px hot">${r.bustEmpty}%</div></div>
    </div></div>`).join('\n');

  const html=`<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA — The Bust</title>
<!-- PORTRAIT, [bb faces]. Rule 33(g): BB's portrait is a still, ours moves. These are the
     real renderer's pixels on the real 120 BPM clock. No vote of its own (rule 25). -->
<style>
  :root{--ink:#e8e0cc;--bg:#0d0d12;--card:#16161d;--line:#33313d;--gold:#c79a3f}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
       font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;padding:14px}
  h1{font-size:13px;letter-spacing:2px;margin:0 0 4px;color:var(--gold)}
  p{margin:0 0 12px;color:#a49a86;max-width:60ch}
  .said{border-left:2px solid #7a4a4a;padding:6px 0 6px 10px;margin:0 0 14px;color:#b09a90}
  b{color:#c8bfa8;font-weight:normal}
  .row{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:8px;margin-bottom:9px}
  .nm{font-size:10px;letter-spacing:1px;color:var(--gold);margin-bottom:6px;
      display:flex;justify-content:space-between;gap:8px}
  .sub{color:#6f6862;letter-spacing:0}
  .two{display:flex;gap:10px;flex-wrap:nowrap}
  .side{flex:1 1 0;min-width:0;text-align:center}
  .lab{font-size:10px;letter-spacing:1px;color:#6f6862;margin-bottom:4px}
  .hot{color:var(--gold)}
  .px{font-size:10px;color:#6f6862;margin-top:4px}
  canvas{width:100%;max-width:132px;aspect-ratio:1/1;height:auto;image-rendering:pixelated;
         background:#101319;border-radius:3px;display:block;margin:0 auto}
  .note{margin-top:2px;color:#6f6862;max-width:62ch}
</style>
<h1>THE BUST</h1>
<div class="said">You made the overworld Battle Brothers and asked every chat to go and
learn how BB does its part. This is mine.</div>
<p>Their portraits are <b>busts</b>: the person fills the frame. I measured ours.
<b>Only a third of the picture is the person. Over half is empty background.</b></p>
<p>And the cause is not taste, it is a bug. Our shoulders are a fixed shape drawn at the
same height on every single face, while the chin above them moves twelve rows across the
crowd, and now moves whenever you drag your own face sliders. On a short face that leaves
a long bare neck. Here they sit under the chin they actually belong to.</p>
${cards}
<p class="note">Across all 200 people: 145 have less empty space, 27 have a hair more,
28 are the same. The middle face gains 2 points, the best gains 12.</p>
<p class="note"><b>It is OFF until you say.</b> It changes the framing of every face in
the game, so it is not in the game yet.</p>
<p class="note">And the part Battle Brothers cannot do: theirs is a painting that never
moves. Watch these. They hold, they blink, and when somebody talks the mouth is driven by
the letters they are saying.</p>
<script>
(function(){
  var R=${JSON.stringify(bake.rows.map(r=>({a:r.a,b:r.b})))}, STEP=${bake.stepMs}, N=64;
  var img=new Image(); img.src='PORTRAIT_THE_BUST.png';
  var cs={};
  document.querySelectorAll('canvas[data-k]').forEach(function(c){
    var x=c.getContext('2d'); x.imageSmoothingEnabled=false; cs[c.dataset.k]=x; });
  img.onload=function(){
    var t0=performance.now();
    (function loop(now){
      var k=Math.floor((now-t0)/STEP);
      R.forEach(function(r,i){
        var fa=r.a[k%r.a.length], fb=r.b[k%r.b.length];
        var A=cs['a'+i], B=cs['b'+i];
        if(A){A.clearRect(0,0,N,N);A.drawImage(img,fa*N,0,N,N,0,0,N,N);}
        if(B){B.clearRect(0,0,N,N);B.drawImage(img,fb*N,0,N,N,0,0,N,N);}
      });
      requestAnimationFrame(loop);
    })(t0);
  };
})();
</script>
`;
  fs.writeFileSync(path.join(ROOT,'slices/vote/PORTRAIT_THE_BUST.html'),html);
  console.log('cast chins', bake.rows.map(r=>r.chin).join(', '),
              '| empty today', bake.rows.map(r=>r.todayEmpty).join('/'),
              '-> bust', bake.rows.map(r=>r.bustEmpty).join('/'));
  console.log('unique frames', bake.frames);
  console.log('page errors', errs.length, errs.slice(0,2));
  await b.close();
})();
