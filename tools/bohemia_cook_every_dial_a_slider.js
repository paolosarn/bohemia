#!/usr/bin/env node
/* BOHEMIA -- COOK: EVERY DIAL A SLIDER.  PORTRAIT, [customizations first], 9/24/26.
 *
 * PAOLO 9/23 IN THE TAB, voting the eight new dials UP: "Fantastic progress it should
 * all come with a slider." Rule 32(g) writes that as EVERY FACE DIAL A SLIDER.
 *
 * RULE 32(f), SHOW IT FROM THE GAME'S CAMERA (his words: "this game isn't in first
 * person, when would I see this?", "the picture we won't use that"): a VOTE item is a
 * frame off a play surface or a tile at game scale. So this does not draw a diagram of
 * the panel. It BOOTS THE REAL ALPHA on a phone profile, walks through the splash into
 * the CHARACTER tab, taps the portrait exactly as he does, and photographs the panel
 * that opens. The faces beside it are drawn at 132 px, which is MEASURED, not chosen:
 * that is the size the portrait canvas actually occupies on a 390-wide phone.
 *
 * Out: slices/vote/PORTRAIT_EVERY_DIAL_A_SLIDER.png
 *      slices/vote/PORTRAIT_EVERY_DIAL_A_SLIDER.html
 */
'use strict';
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const fs=require('fs'), path=require('path'), http=require('http');
const ROOT=path.resolve(__dirname,'..');
const PORT=8791;

/* served over http, because that is how the site serves it and file:// lies (CHARACTER
   learned that on 9/24: a gate read a loading screen on file:// and called 13 legs dead) */
function serve(){
  const types={'.html':'text/html','.js':'text/javascript','.json':'application/json',
               '.png':'image/png','.css':'text/css','.txt':'text/plain'};
  return new Promise(res=>{
    const s=http.createServer((rq,rs)=>{
      const f=path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]));
      fs.readFile(f,(e,d)=>{ if(e){rs.writeHead(404);rs.end();return;}
        rs.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});rs.end(d);});
    });
    s.listen(PORT,'127.0.0.1',()=>res(s));
  });
}

(async()=>{
  const srv=await serve();
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,200)));
  await p.goto(`http://127.0.0.1:${PORT}/slices/BOHEMIA_ALPHA_0_9.html`,{waitUntil:'load'});
  await p.waitForFunction(()=>typeof buildFaceEditor==='function',{timeout:60000});

  /* *** WAIT FOR READY, THEN TAP, AND DO NOT INVENT A THIRD WAY OF DOING IT. *** The
     first cut clicked the splash and waited 900 ms, and photographed RUN'S LOADING
     SCREEN sitting at "5 OF 5 / BEGIN" -- a card whose whole claim is "this is a photo
     of the real panel", showing a loading screen. The DOM checks all said open:true and
     32 sliders, because the panel really is built behind the splash; only the PICTURE
     was wrong, and only looking at it found that.
     Paolo's own ruling is that the loading screen ends in ONE TAP, not on a timer, so
     the door opens when a finger arrives. This is CHARACTER's sequence from become_gate
     (9/24), not a fourth invention: wait for #front to go `ready`, then tap it. */
  const ready=await p.waitForFunction(()=>{
    const f=document.getElementById('front');
    return !f||f.classList.contains('ready')||!f.classList.contains('load');
  },{timeout:120000}).then(()=>true).catch(()=>false);
  if(!ready){
    const st=await p.evaluate(()=>{const e=document.getElementById('loadpct');return e?e.textContent:'?';});
    console.error('the loading screen never lifted ('+st+'); nothing written, and this is NOT');
    console.error('a verdict on the face maker -- it is this tool failing to reach the screen.');
    await b.close(); srv.close(); process.exit(1);
  }
  await p.evaluate(()=>{const f=document.getElementById('front');if(f)f.click();});
  await p.waitForTimeout(900);

  const state=await p.evaluate(()=>{
    const t=document.querySelector('[data-p="char"]'); if(t)t.click();
    const cv=document.getElementById('portraitCv'); if(cv)cv.click();
    const fe=document.getElementById('faceEd');
    const r=cv?cv.getBoundingClientRect():null;
    return {open:fe?fe.classList.contains('on'):false,
            sliders:fe?fe.querySelectorAll('input[type=range]').length:0,
            labels:fe?[...fe.querySelectorAll('input[type=range]')]
              .map(s=>(s.parentElement.querySelector('b')||{}).textContent||'?'):[],
            tab:(document.querySelector('.tab.on')||{}).textContent||'',
            gameScale:r?Math.round(r.width):null};
  });
  if(!state.open){ console.error('the face maker did not open; nothing written'); await b.close(); srv.close(); process.exit(1); }

  /* THE FRAME OFF THE PLAY SURFACE: the panel he actually taps, on the phone he taps it on */
  /* SCROLL TO THE PANEL. The first photo that got past the loading screen showed the
     CHARACTER tab's body and portrait with the sliders below the fold, under a caption
     that said "this is a photo of the real panel". Right screen, wrong part of it. */
  await p.evaluate(()=>{const fe=document.getElementById('faceEd');
    if(fe){fe.scrollTop=0;fe.scrollIntoView({block:'start'});}});
  await p.waitForTimeout(400);
  /* THE TOOL REFUSES RATHER THAN SHIPS A PICTURE THAT DOES NOT SHOW WHAT IT SAYS. The
     panel has to be ON SCREEN, not merely in the DOM: the splash gone, the editor
     visible, and its sliders occupying real width. */
  const onGlass=await p.evaluate(()=>{
    const f=document.getElementById('front');
    if(f&&f.classList.contains('load')&&getComputedStyle(f).display!=='none')return 'the splash is still up';
    const fe=document.getElementById('faceEd');
    if(!fe)return 'no face editor';
    const r=fe.getBoundingClientRect();
    if(r.width<100||r.height<100)return 'the panel is '+Math.round(r.width)+'x'+Math.round(r.height);
    const s=[...fe.querySelectorAll('input[type=range]')];
    if(!s.length)return 'no sliders';
    /* and they are IN THE FRAME, not merely on the page: count the ones whose box lands
       inside the viewport the screenshot covers. A caption that says "the panel" over a
       picture of something else is the card promising what it does not show. */
    const vis=s.filter(x=>{const r=x.getBoundingClientRect();
      return r.width>20&&r.bottom>0&&r.top<innerHeight;}).length;
    if(vis<6)return 'only '+vis+' sliders are inside the frame';
    return null;
  });
  if(onGlass){ console.error('NOT WRITING THE CARD: '+onGlass); await b.close(); srv.close(); process.exit(1); }
  const shotPath=path.join(ROOT,'slices/vote/PORTRAIT_EVERY_DIAL_A_SLIDER.png');
  await p.screenshot({path:shotPath});

  /* and what the nine new dials do, AT GAME SCALE, off the real renderer */
  const strip=await p.evaluate((SCALE)=>{
    const NEW=[['hair.front','HAIR FRINGE',0.06,0.62],['hair.side','HAIR LENGTH',0.42,1.30],
               ['hair.vol','HAIR VOLUME',0,3],['hair.flare','HAIR FLARE',0,0.9],
               ['face.cheekY','CHEEKBONES',null,null],['face.jawCornerY','JAW CORNER',null,null],
               ['details.stubble','STUBBLE',0,3],['eyes.gaze','GAZE',0,1],['hair.braid','BRAID',0,1]];
    const set=(o,k,v)=>{const q=k.split('.');let a=o;for(let i=0;i<q.length-1;i++)a=a[q[i]];a[q[q.length-1]]=v;};
    const get=(o,k)=>k.split('.').reduce((a,c)=>a&&a[c],o);
    const sp0=buildSpec(), ramp=faceRampFor?faceRampFor(sp0):undefined;
    const out=[];
    for(const [key,label,lo,hi] of NEW){
      const a=JSON.parse(JSON.stringify(sp0)), c=JSON.parse(JSON.stringify(sp0));
      let LO=lo,HI=hi;
      if(LO==null){ const f=a.face; const cur=get(a,key);
        LO=Math.max(f.top+2,cur-4); HI=Math.min(f.top+f.len-2,cur+4); }
      set(a,key,LO); set(c,key,HI);
      const A=renderFace(a,ramp?{ramp}:{}), C=renderFace(c,ramp?{ramp}:{});
      let n=0;for(let i=0;i<A.length;i+=4)if(A[i]!==C[i]||A[i+1]!==C[i+1]||A[i+2]!==C[i+2])n++;
      const png=bufs=>{const t=document.createElement('canvas');t.width=t.height=64;
        const im=t.getContext('2d').createImageData(64,64);im.data.set(bufs);
        t.getContext('2d').putImageData(im,0,0);return t.toDataURL('image/png');};
      out.push({label,moved:n,a:png(A),c:png(C)});
    }
    return out;
  }, state.gameScale);

  const rows=strip.map(s=>`  <div class="dial">
    <div class="nm">${s.label}<span class="px">${s.moved} px</span></div>
    <div class="two"><img src="${s.a}" alt=""><img src="${s.c}" alt=""></div>
  </div>`).join('\n');

  const html=`<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA — Every Dial A Slider</title>
<!-- PORTRAIT, [customizations first]. RULE 32(f), Paolo 9/23: show it from the game's
     camera. The photograph below is the REAL panel in the REAL alpha on a 390-wide
     phone, reached the way he reaches it: splash, CHARACTER, tap the portrait. The
     faces are ${state.gameScale} px, which is the size the portrait canvas measures on
     that phone, not a size I liked. Built by tools/bohemia_cook_every_dial_a_slider.js.
     No vote of its own (rule 25: an item is asked ONCE, on the row). -->
<style>
  :root{--ink:#e8e0cc;--bg:#0d0d12;--card:#16161d;--line:#33313d;--gold:#c79a3f}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
       font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace;padding:14px}
  h1{font-size:13px;letter-spacing:2px;margin:0 0 4px;color:var(--gold)}
  p{margin:0 0 12px;color:#a49a86;max-width:60ch}
  .said{border-left:2px solid #7a4a4a;padding:6px 0 6px 10px;margin:0 0 14px;color:#b09a90}
  b{color:#c8bfa8;font-weight:normal}
  .shot{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:7px;margin-bottom:14px}
  .shot img{width:100%;display:block;border-radius:3px}
  .cap{font-size:10px;letter-spacing:1px;color:#6f6862;margin-top:6px}
  .dial{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:7px;margin-bottom:8px}
  .nm{font-size:10px;letter-spacing:1px;color:var(--gold);margin-bottom:5px;
      display:flex;justify-content:space-between}
  .px{color:#6f6862;letter-spacing:0}
  .two{display:flex;gap:8px}
  .two img{width:calc(50% - 4px);max-width:${state.gameScale}px;image-rendering:pixelated;
           background:#101319;border-radius:3px;display:block}
</style>
<h1>EVERY DIAL A SLIDER</h1>
<div class="said">You said, voting the last eight up: "Fantastic progress it should all
come with a slider."</div>
<p>All of them now. <b>${state.sliders} sliders</b>, up from 22. This is a photo of the real
panel on a real phone, not a drawing of one: ${state.tab} tab, tap your own face.</p>
<div class="shot"><img src="PORTRAIT_EVERY_DIAL_A_SLIDER.png" alt="">
<div class="cap">THE ${state.tab} TAB, TAP THE PORTRAIT</div></div>
<p>Nine dials were doing real work and had no slider on them. Here is each one, low and
high, on your own face, at the size the game draws a face on a phone.</p>
${rows}
<p>Three more were the opposite: names in the face that drew nothing at all. Stubble is
wired now, so it is the one in that list you can see. The other two are gone, because a
control that promises something and does nothing is worse than no control.</p>
`;
  fs.writeFileSync(path.join(ROOT,'slices/vote/PORTRAIT_EVERY_DIAL_A_SLIDER.html'),html);
  console.log('tab',state.tab,'| sliders',state.sliders,'| game scale',state.gameScale+'px');
  console.log('dials shown:',strip.map(s=>s.label+' '+s.moved).join(', '));
  console.log('page errors',errs.length,errs.slice(0,2));
  await b.close(); srv.close();
})();
