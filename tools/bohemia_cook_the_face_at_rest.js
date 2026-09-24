#!/usr/bin/env node
/* BOHEMIA -- COOK: THE FACE AT REST.  PORTRAIT, [horror face], 9/24/26.
 *
 * RULE 25 (Paolo 9/21): "How dare you show me pictures of animations and not the
 * actual animation, never do that again." A still of a motion is BANNED. The claim
 * this round is about a face HOLDING and about where its eyes point, so the card
 * has to hold and the eyes have to be on screen, moving on the real clock.
 *
 * It bakes the REAL renderer's pixels -- renderFace and facePerform out of the
 * alpha, on the real 120 BPM clock -- over one whole blink period, dedupes the
 * frames (a face that holds repeats itself, which is the point), and writes one
 * strip PNG plus the timeline the page plays back. Nothing is redrawn by hand and
 * nothing is a mock-up.
 *
 * Out: slices/vote/PORTRAIT_THE_FACE_AT_REST.png   (the frame strip)
 *      slices/vote/PORTRAIT_THE_FACE_AT_REST.html  (the card, it plays, no vote of its own)
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
    const BEAT=500, STEP=1000/30, PERIOD=5500;   /* the idle blink period, BLINK_MIN+MAX over 2 */
    /* CAST FOR THE CLAIM, NOT FOR THE FIRST ID. On 9/12 this lane put a man in
       opaque shades on a card about his eyes and it proved nothing; it did it AGAIN
       earlier this round. So: no shades, no hat, the pupils on screen, and the gaze
       has to actually move pixels on THIS face. Scored, not picked. */
    let sp=null, ramp=null, id=null;
    for(let i=0;i<600;i++){
      const q=faceFor('rest:'+i);
      if(q.glasses||q.hat)continue;
      const r0=faceRampFor(q);
      const a=JSON.parse(JSON.stringify(q)); a.eyes.gaze=0;
      const c=JSON.parse(JSON.stringify(q)); c.eyes.gaze=1;
      const A=renderFace(a,{ramp:r0}), C=renderFace(c,{ramp:r0});
      let n=0; for(let k=0;k<A.length;k+=4) if(A[k]!==C[k]||A[k+1]!==C[k+1]||A[k+2]!==C[k+2])n++;
      /* and it must BLINK inside the window, or the card is two photographs */
      let blinks=0,was=false;
      for(let t=0;t<PERIOD;t+=STEP){const pf=facePerform('rest:'+i,t,null,{});const on=pf.blink>0;if(on&&!was)blinks++;was=on;}
      if(n>=8 && blinks>=1){ sp=q; ramp=r0; id='rest:'+i; break; }
    }
    if(!sp) return {ok:false};

    const uniq=[], byKey=new Map(), tl={left:[],right:[]};
    const push=(buf)=>{
      let k=''; for(let i=0;i<buf.length;i+=4)k+=String.fromCharCode(buf[i],buf[i+1],buf[i+2]);
      if(byKey.has(k))return byKey.get(k);
      const idx=uniq.length; uniq.push(Array.from(buf)); byKey.set(k,idx); return idx;
    };
    for(let t=0;t<PERIOD;t+=STEP){
      const pf=facePerform(id,t,null,{});
      const L=JSON.parse(JSON.stringify(sp)); L.eyes.gaze=0;
      const R=JSON.parse(JSON.stringify(sp)); R.eyes.gaze=1;
      const o={ramp,blink:pf.blink,brow:pf.brow,mouth:pf.mouth};
      tl.left.push(push(renderFace(L,o)));
      tl.right.push(push(renderFace(R,o)));
    }
    /* the strip */
    const N=64, cv=document.createElement('canvas');
    cv.width=N*uniq.length; cv.height=N;
    const cx=cv.getContext('2d');
    uniq.forEach((u,i)=>{
      const t=document.createElement('canvas'); t.width=t.height=N;
      const tc=t.getContext('2d'), im=tc.createImageData(N,N);
      im.data.set(new Uint8ClampedArray(u)); tc.putImageData(im,0,0);
      cx.drawImage(t,i*N,0);
    });
    return {ok:true, id, frames:uniq.length, steps:tl.left.length,
            stepMs:STEP, periodMs:PERIOD, tl, png:cv.toDataURL('image/png')};
  });

  if(!bake.ok){ console.error('no face passed the casting test'); await b.close(); process.exit(1); }

  fs.writeFileSync(path.join(ROOT,'slices/vote/PORTRAIT_THE_FACE_AT_REST.png'),
                   Buffer.from(bake.png.split(',')[1],'base64'));

  const html=`<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA — The Face At Rest</title>
<!-- PORTRAIT, [horror face]. RULE 25, Paolo 9/21: an animation PLAYS, a still of a
     motion is banned. These are the real renderer's pixels on the real clock, baked
     by tools/bohemia_cook_the_face_at_rest.js. The card carries NO vote of its own
     (rule 25: an item is asked ONCE, on the row). -->
<style>
  :root{--ink:#e8e0cc;--bg:#0d0d12;--card:#16161d;--line:#33313d;--gold:#c79a3f}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
       font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;padding:14px}
  h1{font-size:13px;letter-spacing:2px;margin:0 0 4px;color:var(--gold)}
  p{margin:0 0 12px;color:#a49a86;max-width:60ch}
  .said{border-left:2px solid #7a4a4a;padding:6px 0 6px 10px;margin:0 0 14px;color:#b09a90}
  .pair{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:10px}
  .side{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:8px;text-align:center}
  .lab{font-size:10px;letter-spacing:1px;margin-bottom:5px;color:#6f6862}
  .hot{color:#c79a3f}
  canvas{width:256px;height:256px;image-rendering:pixelated;background:#101319;border-radius:3px;display:block}
  .note{margin-top:4px;color:#6f6862;max-width:62ch}
  b{color:#c8bfa8;font-weight:normal}
</style>
<h1>THE FACE AT REST</h1>
<div class="said">You said "more analog horror" fourteen times. The rule behind that
phrase is one line: an ORDINARY picture with exactly ONE thing wrong, and you have to
be able to say what the wrong thing is in one sentence.</div>
<p>Here is the sentence. <b>HIS EYES ARE POINTED A LITTLE PAST YOUR SHOULDER.</b></p>
<p>Same person on both sides. Same face, same hair, same skin, same light, nothing
else touched. Left looks at you. Right does not. Watch them for a few seconds; they
hold, they blink once, and the one on the right never meets you.</p>
<div class="pair">
  <div class="side"><div class="lab">LOOKING AT YOU</div><canvas id="a" width="64" height="64"></canvas></div>
  <div class="side"><div class="lab hot">NOT LOOKING AT YOU</div><canvas id="b" width="64" height="64"></canvas></div>
</div>
<p class="note">About one person in twelve, so you meet one on a block and cannot say
why it stuck. No filter, no monster, no new colour. It is a die right now, not a
meaning; when the world knows who is lying to you, that is what it should read.</p>
<p class="note">They also hold harder than they used to. The rule is at most one
small move every eight beats. Eleven faces in forty were making two, because the
brow ran on its own clock beside the blink. One face, one clock now: the brow rides
the blink, on one blink in three. Zero in forty make two.</p>
<script>
(function(){
  var TL=${JSON.stringify(bake.tl)}, STEP=${bake.stepMs}, FRAMES=${bake.frames}, N=64;
  var img=new Image(); img.src='PORTRAIT_THE_FACE_AT_REST.png';
  var A=document.getElementById('a').getContext('2d');
  var B=document.getElementById('b').getContext('2d');
  A.imageSmoothingEnabled=B.imageSmoothingEnabled=false;
  function draw(cx,f){cx.clearRect(0,0,N,N);cx.drawImage(img,f*N,0,N,N,0,0,N,N);}
  img.onload=function(){
    var t0=performance.now();
    (function loop(now){
      var k=Math.floor(((now-t0)/STEP))%TL.left.length;
      draw(A,TL.left[k]); draw(B,TL.right[k]);
      requestAnimationFrame(loop);
    })(t0);
  };
})();
</script>
`;
  fs.writeFileSync(path.join(ROOT,'slices/vote/PORTRAIT_THE_FACE_AT_REST.html'),html);
  console.log('cast', bake.id, '| unique frames', bake.frames, '| timeline steps', bake.steps,
              '| period', bake.periodMs+'ms');
  console.log('page errors', errs.length, errs.slice(0,2));
  await b.close();
})();
