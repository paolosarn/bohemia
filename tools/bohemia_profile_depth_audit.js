/* ===========================================================================
   BOHEMIA — PROFILE DEPTH AUDIT (7/26/26)
   ---------------------------------------------------------------------------
   Paolo 7/26: "I'm so fucking confused when I faced the east and try to do all
   the animations. It's all really bad bro."

   He is right, and it is not the renderer. This measures the profile body
   against the head-on body on the shipped alpha, in a real browser, over the
   full clip set. The finding it produced:

       painted TORSO width   E = 8px      S = 13px
       average body width    E = 17.2px   S = 21.2px
       average arm pixels    E = 91       S = 142

   The east-facing body is a NARROW SLAB. There are only eight painted pixels
   of torso to work with, both arms live inside that footprint, and you see 35%
   less arm than head-on. No renderer change can make eight pixels of profile
   read as a person with depth -- the animation looks stiff because there is
   almost nothing there to move. This is art, not code, and the painted regions
   are Paolo's (RIG LAW). His call.

     node tools/bohemia_profile_depth_audit.js

   REUSE CHECK: cooks zero pixels. It only counts what the renderer already draws.
   =========================================================================== 
  RIG CHECK (RIG IS LAW, Paolo 7/26/26): Measures whether the far arm/hand read as further away on E and W. Reads the
  rig through the real render path; changes nothing.
    built on: posedSkel, SKINNERS
    joints: none named
    parts: 5=arm-L, 6=arm-R
*/
const path=require('path');
const pw=require('/opt/node22/lib/node_modules/playwright');
const ALPHA=path.resolve('slices/BOHEMIA_ALPHA_0_9.html');
(async()=>{
 const b=await pw.chromium.launch();const p=await b.newPage();
 await p.goto('file://'+ALPHA,{waitUntil:'load',timeout:120000});
 await p.waitForFunction(()=>typeof drawChar==='function',null,{timeout:120000});
 const r=await p.evaluate(()=>{
  const CW=56,PH=[0,0.2,0.4,0.6,0.8];
  const out={};
  for(const d of ['E','W','S','SE']){
   let frames=0,noFar=0,noAnyArm=0,widthSum=0,armPxSum=0;
   const FAR = (d==='E')?[6,8]:(d==='W')?[5,7]:null;
   for(const clip of CLIPS)for(const ph of PH){
    let P,g;try{P=posedSkel(d,clip,ph).sk;g=SKINNERS[d].skin(P);}catch(e){continue;}
    const cnt={};let mn=99,mx=-1;
    for(let i=0;i<g.length;i++){if(!g[i])continue;cnt[g[i]]=(cnt[g[i]]||0)+1;const x=i%CW;if(x<mn)mn=x;if(x>mx)mx=x;}
    frames++;widthSum+=(mx-mn+1);
    const armPx=(cnt[5]||0)+(cnt[6]||0);armPxSum+=armPx;
    if(FAR&&!((cnt[FAR[0]]||0)+(cnt[FAR[1]]||0)))noFar++;
    if(!armPx)noAnyArm++;
   }
   out[d]={frames,noFar,noAnyArm,avgWidth:(widthSum/frames).toFixed(1),avgArmPx:(armPxSum/frames).toFixed(1)};
  }
  // how wide is the painted profile body at all?
  const wid={};
  for(const d of ['E','S']){let mn=99,mx=-1;
   for(const q of [4]){for(const i of SKINNERS[d].pixList[q]){const x=i%CW;if(x<mn)mn=x;if(x>mx)mx=x;}}
   wid[d]=mx-mn+1;}
  return {out,wid};
 });
 console.log('painted TORSO width:  E =',r.wid.E+'px','   S =',r.wid.S+'px');
 for(const d in r.out){const o=r.out[d];
  console.log(d.padEnd(3),'frames',o.frames,' far-arm MISSING in',o.noFar,' no arm at all in',o.noAnyArm,
   ' avg body width',o.avgWidth+'px',' avg arm pixels',o.avgArmPx);}
 await b.close();
})();
