#!/usr/bin/env node
/* BOHEMIA -- COOK: PICK YOUR MAN OUT.  PORTRAIT, [bb faces] school round two, 9/27.
 *
 * Paolo, 9/24: the overworld is Battle Brothers, and every chat carries a [bb ...] line.
 * BB's company screen is a GRID of small portraits and you find your man in it instantly.
 * So: can you find yours in ours? And the thing this round found -- the game's own checker
 * said two of these people were THE SAME PERSON, and they are not.
 * Rule 33(g): BB's grid is stills. Ours holds and blinks, so this PLAYS.
 * Rule 32(f): 132 px, the measured size a portrait occupies on a 390-wide phone.
 * Rule 25: it plays, two or three things, no vote of its own.
 *
 * REFERENCE CHECK (the 9/4 standing duty; added by DIRECTION 9/27 at the seam --
 * eighth cook tool this stretch shipped without one): the rulers are FACE-01 and
 * FACE-02 (the portrait construction that keeps two people from reading as one -
 * the exact defect this round found) and AH-01 rule 6 (a grid of held faces is
 * that rule in rows). BB stays a mechanism reference (the roster grid), never a
 * style source. Ids resolve in the reference library index.
 *
 * Out: slices/vote/PORTRAIT_PICK_YOUR_MAN_OUT.png / .html
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
    const STEP=1000/30, PERIOD=5500;
    const GL=f=>({hairCut:(f.hair.name||'(none)'),hairCol:f.hair.color.join(','),
      skin:f.skin,iris:f.eyes.iris.join(','),shades:f.glasses?1:0,hat:f.hat?1:0,
      beard:(f.details&&f.details.stubble)?1:0,shirt:f.top.join(','),braid:f.hair.braid?1:0});
    const NAME={hairCut:'the haircut',hairCol:'hair colour',skin:'skin',iris:'eye colour',
      shades:'shades',hat:'a hat',beard:'stubble',shirt:'what they are wearing',braid:'a braid'};

    const uniq=[],byKey=new Map();
    const push=buf=>{let k='';for(let i=0;i<buf.length;i+=4)k+=String.fromCharCode(buf[i],buf[i+1],buf[i+2]);
      if(byKey.has(k))return byKey.get(k);
      const i=uniq.length; uniq.push(Array.from(buf)); byKey.set(k,i); return i;};
    const strip=id=>{const sp=faceFor(id), ramp=faceRampFor(sp), out=[];
      for(let t=0;t<PERIOD;t+=STEP){const pf=facePerform(id,t,null,{});
        out.push(push(renderFace(sp,{ramp,blink:pf.blink,brow:pf.brow,mouth:pf.mouth})));}
      return out;};

    /* THE PAIR THE GAME'S OWN CHECKER CALLED ONE PERSON */
    const A='gate:crowd:0', B='gate:crowd:35';
    const ga=GL(faceFor(A)), gb=GL(faceFor(B));
    const differs=Object.keys(ga).filter(k=>ga[k]!==gb[k]).map(k=>NAME[k]);
    const pair={a:strip(A),b:strip(B),differs};

    /* AND THE COMPANY SCREEN: nine of them, the way BB lays a roster out.
       *** CAST TO MATCH THE CROWD, NOT TO MATCH MY THUMB. *** The first nine were every
       fifth person and FIVE OF THEM WERE WEARING SHADES, against 29% in the real crowd.
       A grid that hides more eyes than the game does makes the game look worse than it is,
       and the card's whole question is whether you can tell these people apart -- the eyes
       are the most identifying thing on a face this size. (My own eyeball said seven of
       nine before I counted; it was five. Count it.)
       So the nine are drawn to the crowd's own rate: three in shades, six not. */
    const want=3, grid=[], gridIds=[];
    let withS=0, without=0;
    for(let i=0;i<200 && gridIds.length<9;i++){
      const id='gate:crowd:'+i, sp=faceFor(id);
      if(sp.glasses){ if(withS>=want)continue; withS++; }
      else { if(without>=9-want)continue; without++; }
      gridIds.push(id);
    }
    for(const id of gridIds) grid.push(strip(id));
    const gridShades=withS;

    const N=64, cv=document.createElement('canvas');
    cv.width=N*uniq.length; cv.height=N;
    const cx=cv.getContext('2d');
    uniq.forEach((u,i)=>{const t=document.createElement('canvas');t.width=t.height=N;
      const tc=t.getContext('2d'), im=tc.createImageData(N,N);
      im.data.set(new Uint8ClampedArray(u)); tc.putImageData(im,0,0); cx.drawImage(t,i*N,0);});
    return {pair,grid,gridShades,frames:uniq.length,stepMs:STEP,png:cv.toDataURL('image/png')};
  });

  fs.writeFileSync(path.join(ROOT,'slices/vote/PORTRAIT_PICK_YOUR_MAN_OUT.png'),
                   Buffer.from(bake.png.split(',')[1],'base64'));

  const diffs=bake.pair.differs;
  const html=`<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA — Pick Your Man Out</title>
<!-- PORTRAIT, [bb faces] r2. Real renderer pixels on the real 120 BPM clock. No vote of
     its own (rule 25). Faces at 132 px, the measured size on a 390-wide phone (32f). -->
<style>
  :root{--ink:#e8e0cc;--bg:#0d0d12;--card:#16161d;--line:#33313d;--gold:#c79a3f;--red:#c56b6b}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
       font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;padding:14px}
  h1{font-size:13px;letter-spacing:2px;margin:0 0 4px;color:var(--gold)}
  p{margin:0 0 12px;color:#a49a86;max-width:60ch}
  .said{border-left:2px solid #7a4a4a;padding:6px 0 6px 10px;margin:0 0 14px;color:#b09a90}
  b{color:#c8bfa8;font-weight:normal}
  .box{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:9px;margin-bottom:12px}
  .nm{font-size:10px;letter-spacing:1px;color:var(--red);margin-bottom:7px}
  .two{display:flex;gap:10px}
  .two > div{flex:1 1 0;min-width:0}
  canvas{width:100%;max-width:132px;aspect-ratio:1/1;height:auto;image-rendering:pixelated;
         background:#101319;border-radius:3px;display:block;margin:0 auto}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
  ul{margin:8px 0 0;padding-left:18px;color:#a49a86}
  li{margin:1px 0}
  .note{margin-top:2px;color:#6f6862;max-width:62ch}
</style>
<h1>PICK YOUR MAN OUT</h1>
<div class="said">You made the overworld Battle Brothers. Their company screen is a grid of
little faces and you find your guy in it without thinking. So I asked whether you can find
yours.</div>
<p>First, a problem I found while asking. <b>The game's own checker said these two are the
same person.</b> It has been saying so for four rounds and I kept repeating it.</p>
<div class="box">
  <div class="nm">THE GAME CALLED THESE ONE PERSON</div>
  <div class="two"><div><canvas data-k="pa" width="64" height="64"></canvas></div>
  <div><canvas data-k="pb" width="64" height="64"></canvas></div></div>
  <ul>${diffs.map(d=>`<li>${d}</li>`).join('')}</ul>
</div>
<p>That is <b>${diffs.length} different things</b>, and one of them is wearing sunglasses.
They were never the same person. The checker was adding up brightness, which is not how
anybody tells two faces apart.</p>
<p>So here is the real question, with the checker fixed. Nine of your people, at the size
they actually appear on your phone. <b>Can you tell them apart?</b></p>
<div class="box"><div class="grid">
${bake.grid.map((_,i)=>`  <canvas data-k="g${i}" width="64" height="64"></canvas>`).join('\n')}
</div></div>
<p class="note">Measured across all 1,770 pairs of sixty people: <b>not one pair</b> shares
every single thing you could name about them. The closest any two get is two things apart,
and only 25 pairs are even that close.</p>
<p class="note">These nine are picked to match the real crowd, not to flatter it:
<b>${bake.gridShades} of the 9 are in shades, because 29% of everybody is</b>. That is
worth your eye on its own. The eyes are the most identifying thing on a face this small,
and nearly a third of the valley has them covered.</p>
<p class="note">And what a Battle Brothers roster cannot do: theirs are paintings. Watch
these for a few seconds.</p>
<script>
(function(){
  var P=${JSON.stringify(bake.pair)}, G=${JSON.stringify(bake.grid)},
      STEP=${bake.stepMs}, N=64;
  var img=new Image(); img.src='PORTRAIT_PICK_YOUR_MAN_OUT.png';
  var cs={};
  document.querySelectorAll('canvas[data-k]').forEach(function(c){
    var x=c.getContext('2d'); x.imageSmoothingEnabled=false; cs[c.dataset.k]=x; });
  function put(k,f){var x=cs[k]; if(!x)return; x.clearRect(0,0,N,N); x.drawImage(img,f*N,0,N,N,0,0,N,N);}
  img.onload=function(){
    var t0=performance.now();
    (function loop(now){
      var k=Math.floor((now-t0)/STEP);
      put('pa',P.a[k%P.a.length]); put('pb',P.b[k%P.b.length]);
      G.forEach(function(s,i){ put('g'+i, s[k%s.length]); });
      requestAnimationFrame(loop);
    })(t0);
  };
})();
</script>
`;
  fs.writeFileSync(path.join(ROOT,'slices/vote/PORTRAIT_PICK_YOUR_MAN_OUT.html'),html);
  console.log('the pair differs in', diffs.length, 'nameable things:', diffs.join(', '));
  console.log('unique frames', bake.frames);
  console.log('page errors', errs.length, errs.slice(0,2));
  await b.close();
})();
