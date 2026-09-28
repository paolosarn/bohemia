#!/usr/bin/env node
/* BOHEMIA -- COOK: NOT STRANGERS ANYMORE.  PORTRAIT [three faces], 9/27.
 *
 * DYNASTY's own card said it plainly (dynasty-three-on-the-phone-9-24, still in
 * the queue): "the three faces are placeholders, not your family yet." This
 * round closed that gap: descendantSpec() derives act2 and act3 from the
 * player's own built face by A FAMILY LOOKS LIKE A FAMILY's heredity, and act1
 * (Reyna, +0Y) turned out to be a stranger too -- the flip strip's bridge only
 * ever special-cased the literal id 'you', never 'act1', so ALL THREE were
 * random rolls, not just two.
 *
 * BEFORE / AFTER, same three slots, same faces the flip strip actually asks
 * for (faceFor('act1'/'act2'/'act3', {reads:'either'}) is the exact call the
 * old bridge made). Rule 25: it PLAYS, on the beat, no vote of its own -- this
 * rides inside [three faces]'s own row, not a second item.  Rule 32(f): faces
 * shown at 132 px, the measured VOTE-tab size, with the flip strip's own real
 * 26 px alongside it so the claim is honest about the size he actually meets.
 *
 * REFERENCE CHECK (the 9/4 standing duty): FACE-01/FACE-02 (the same rulers
 * [bb faces] r2 cited two days ago -- a portrait construction that keeps
 * related people reading as related without collapsing into "one person").
 * Battle Brothers stays a mechanism reference (the roster reads at a glance);
 * never a style source.
 *
 * Out: slices/vote/PORTRAIT_NOT_STRANGERS_ANYMORE.png / .html
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
  await p.waitForFunction(()=>typeof facePerform==='function'&&typeof descendantSpec==='function',{timeout:60000});

  const bake=await p.evaluate(()=>{
    const STEP=1000/30, PERIOD=5500, N=64;
    const GL=f=>({hairCut:(f.hair.name||'(none)'),hairCol:f.hair.color.join(','),
      skin:f.skin,iris:f.eyes.iris.join(','),shades:f.glasses?1:0,hat:f.hat?1:0,
      beard:(f.details&&f.details.stubble)?1:0,shirt:(f.top||[]).join(','),braid:f.hair.braid?1:0});
    const traitsDiffer=(a,c)=>{const ga=GL(a),gc=GL(c);let n=0;for(const k in ga) if(ga[k]!==gc[k]) n++; return n;};

    const uniq=[],byKey=new Map();
    const push=buf=>{let k='';for(let i=0;i<buf.length;i+=4)k+=String.fromCharCode(buf[i],buf[i+1],buf[i+2]);
      if(byKey.has(k))return byKey.get(k);
      const i=uniq.length; uniq.push(Array.from(buf)); byKey.set(k,i); return i;};
    const strip=(sp,animId)=>{const ramp=faceRampFor(sp), out=[];
      for(let t=0;t<PERIOD;t+=STEP){const pf=facePerform(animId,t,null,{});
        out.push(push(renderFace(sp,{ramp,blink:pf.blink,brow:pf.brow,mouth:pf.mouth})));}
      return out;};

    /* BEFORE: the exact call the flip strip's bridge made prior to this round --
       faceFor(id,{reads:'either'}) for the literal ids 'act1'/'act2'/'act3'.
       Nobody special-cased 'act1' as the player, so all three were strangers. */
    const beforeSpecs=['act1','act2','act3'].map(id=>faceFor(id,{reads:'either'}));
    const before=beforeSpecs.map((sp,i)=>strip(sp,'act'+(i+1)));

    /* AFTER: the player's own built face, and the two descendants heredity
       derives from it. Same ids drive the blink/brow timing either way. */
    const anc=buildSpec();
    const afterSpecs=[anc, descendantSpec(2,anc), descendantSpec(3,anc)];
    const after=afterSpecs.map((sp,i)=>strip(sp,'act'+(i+1)));

    /* THE NUMBERS, measured on THIS bake, not carried over from a prior round. */
    let strangerDiffs=[];
    for(let i=0;i<50;i++) strangerDiffs.push(traitsDiffer(anc, faceFor('stranger:'+i,{age:'adult'})));
    const avgStranger=strangerDiffs.reduce((a,c)=>a+c,0)/strangerDiffs.length;
    const diffAnc2=traitsDiffer(anc, afterSpecs[1]), diffAnc3=traitsDiffer(anc, afterSpecs[2]);
    const beforeDiffAnc2=traitsDiffer(anc, beforeSpecs[1]), beforeDiffAnc3=traitsDiffer(anc, beforeSpecs[2]);

    const cv=document.createElement('canvas');
    cv.width=N*uniq.length; cv.height=N;
    const cx=cv.getContext('2d');
    uniq.forEach((u,i)=>{const t=document.createElement('canvas');t.width=t.height=N;
      const tc=t.getContext('2d'), im=tc.createImageData(N,N);
      im.data.set(new Uint8ClampedArray(u)); tc.putImageData(im,0,0); cx.drawImage(t,i*N,0);});

    return {before,after,frames:uniq.length,stepMs:STEP,png:cv.toDataURL('image/png'),
      nums:{avgStranger:+avgStranger.toFixed(2),
            afterAnc2:diffAnc2, afterAnc3:diffAnc3,
            beforeAnc2:beforeDiffAnc2, beforeAnc3:beforeDiffAnc3}};
  });

  fs.writeFileSync(path.join(ROOT,'slices/vote/PORTRAIT_NOT_STRANGERS_ANYMORE.png'),
                   Buffer.from(bake.png.split(',')[1],'base64'));

  const n=bake.nums;
  const html=`<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA — Not Strangers Anymore</title>
<!-- PORTRAIT [three faces]. Real renderer pixels on the real 120 BPM clock.
     No vote of its own beyond the row this rides inside (rule 25). Faces at
     132 px, the measured VOTE-tab size (rule 32f). -->
<style>
  :root{--ink:#e8e0cc;--bg:#0d0d12;--card:#16161d;--line:#33313d;--gold:#c79a3f;--red:#c56b6b;--good:#7fae6e}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
       font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;padding:14px}
  h1{font-size:13px;letter-spacing:2px;margin:0 0 4px;color:var(--gold)}
  p{margin:0 0 12px;color:#a49a86;max-width:60ch}
  .said{border-left:2px solid #7a4a4a;padding:6px 0 6px 10px;margin:0 0 14px;color:#b09a90}
  b{color:#c8bfa8;font-weight:normal}
  .good{color:var(--good)}
  .box{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:9px;margin-bottom:12px}
  .nm{font-size:10px;letter-spacing:1px;color:var(--red);margin-bottom:7px}
  .nm.g{color:var(--good)}
  .three{display:flex;gap:10px}
  .three > div{flex:1 1 0;min-width:0;text-align:center}
  .three .lbl{font-size:9px;color:#6f6862;margin-top:4px;letter-spacing:1px}
  canvas.big{width:100%;max-width:132px;aspect-ratio:1/1;height:auto;image-rendering:pixelated;
         background:#101319;border-radius:3px;display:block;margin:0 auto}
  canvas.tiny{width:26px;height:26px;image-rendering:pixelated;background:#101319;
         border-radius:2px;display:block;margin:4px auto 0}
  .note{margin-top:2px;color:#6f6862;max-width:62ch}
</style>
<h1>NOT STRANGERS ANYMORE</h1>
<div class="said">The flip strip has said since 9/24: "the three faces are placeholders, not
your family yet." That is fixed now. Here is the exact same three slots, before and after.</div>
<div class="box">
  <div class="nm">BEFORE -- what the strip actually asked for, played back</div>
  <div class="three">
    <div><canvas class="big" data-k="b0" width="64" height="64"></canvas><div class="lbl">REYNA, +0Y</div></div>
    <div><canvas class="big" data-k="b1" width="64" height="64"></canvas><div class="lbl">EZEKIEL, +35Y</div></div>
    <div><canvas class="big" data-k="b2" width="64" height="64"></canvas><div class="lbl">PERLA, +70Y</div></div>
  </div>
</div>
<p>All three were random rolls, Reyna included -- the bridge only ever special-cased the id
"you", never the literal id "act1", so even the person at +0 years was a stranger.</p>
<div class="box">
  <div class="nm g">AFTER -- derived from the face you built</div>
  <div class="three">
    <div><canvas class="big" data-k="a0" width="64" height="64"></canvas><div class="lbl">REYNA, +0Y (YOU)</div></div>
    <div><canvas class="big" data-k="a1" width="64" height="64"></canvas><div class="lbl">EZEKIEL, +35Y</div></div>
    <div><canvas class="big" data-k="a2" width="64" height="64"></canvas><div class="lbl">PERLA, +70Y</div></div>
  </div>
</div>
<p class="note">Measured on this exact bake, against 50 strangers averaging
<b>${n.avgStranger}</b> nameable things apart: before the fix, Ezekiel and Perla's random rolls
were <b>${n.beforeAnc2}</b> and <b>${n.beforeAnc3}</b> things apart from you -- indistinguishable
from a stranger. After, they are <b class="good">${n.afterAnc2}</b> and
<b class="good">${n.afterAnc3}</b> apart.</p>
<p class="note">And the size you actually meet these three at, on the phone's own strip, is
26 pixels, not 132 -- shown here true to scale, unscaled:</p>
<div class="box"><div class="three">
  <div><canvas class="tiny" data-k="a0t" width="26" height="26"></canvas></div>
  <div><canvas class="tiny" data-k="a1t" width="26" height="26"></canvas></div>
  <div><canvas class="tiny" data-k="a2t" width="26" height="26"></canvas></div>
</div></div>
<p class="note">draft:true, both the skull-blend weight and the hair-and-skin weight are picked
by me, not measured off anything you said. Thumbs up and this stands as the family. Thumbs
down and tell me if it reads as too alike or still too much like strangers.</p>
<script>
(function(){
  var B=${JSON.stringify(bake.before)}, A=${JSON.stringify(bake.after)},
      STEP=${bake.stepMs}, N=64;
  var img=new Image(); img.src='PORTRAIT_NOT_STRANGERS_ANYMORE.png';
  var cs={};
  document.querySelectorAll('canvas[data-k]').forEach(function(c){
    var x=c.getContext('2d'); x.imageSmoothingEnabled=false; cs[c.dataset.k]=x; });
  function put(k,f,size){var x=cs[k]; if(!x)return; x.clearRect(0,0,size,size); x.drawImage(img,f*N,0,N,N,0,0,size,size);}
  img.onload=function(){
    var t0=performance.now();
    (function loop(now){
      var k=Math.floor((now-t0)/STEP);
      B.forEach(function(s,i){ put('b'+i, s[k%s.length], 64); });
      A.forEach(function(s,i){ put('a'+i, s[k%s.length], 64); put('a'+i+'t', s[k%s.length], 26); });
      requestAnimationFrame(loop);
    })(t0);
  };
})();
</script>
`;
  fs.writeFileSync(path.join(ROOT,'slices/vote/PORTRAIT_NOT_STRANGERS_ANYMORE.html'),html);
  console.log('before: Ezekiel', n.beforeAnc2, 'Perla', n.beforeAnc3, 'apart (stranger avg', n.avgStranger, ')');
  console.log('after:  Ezekiel', n.afterAnc2, 'Perla', n.afterAnc3, 'apart');
  console.log('unique frames', bake.frames);
  console.log('page errors', errs.length, errs.slice(0,2));
  await b.close();
})();
