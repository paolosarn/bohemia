/* ============================================================================
   COLOUR VISION ON REAL CLOTH (9/6/26, UI lane 11) -- the measurer behind
   gates/phone_readable_gate.js, kept separate so the numbers can be re-run on
   their own without the whole phone sweep.

   THE INSTRUMENT. Same cloth the faction colour gate reads -- REAL RENDERED
   PIXELS with skin and the black outline removed, so a suntan cannot pass for a
   flag -- but each faction's mean cloth colour is pushed through the three common
   colour vision deficiencies first (LMS projection, the standard Brettel/Vienot
   matrices) and then compared PAIRWISE in CIE Lab, so "how different" means how
   different they LOOK rather than RGB arithmetic.

   WHY IT MATTERS HERE: roughly 1 in 12 men has some colour vision deficiency, and
   COLOUR IS TERRITORY makes colour a way the game tells you who owns a street.
   This does not decide what to do about it -- that is a ruling. It measures.
   ========================================================================== */
'use strict';
const path = require('path');
const ALPHA = path.join(__dirname, '../slices/BOHEMIA_ALPHA_0_9.html');

async function measure() {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { chromium = require('playwright').chromium; }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await pg.waitForFunction(() => typeof buildFrame === 'function' && window.FACTION_LOOKS,
                           { timeout: 60000 });
  const R = await pg.evaluate(()=>{
  /* linear RGB <-> LMS, and the three dichromat projections. Standard matrices. */
  const lin=c=>{c/=255;return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4);};
  const srgb=c=>{c=Math.max(0,Math.min(1,c));return 255*(c<=0.0031308?12.92*c:1.055*Math.pow(c,1/2.4)-0.055);};
  const M=[[0.31399,0.63951,0.04649],[0.15537,0.75789,0.08670],[0.01775,0.10945,0.87261]];
  const Mi=[[5.47221,-4.6419,0.16963],[-1.1252,2.29317,-0.1678],[0.02980,-0.19318,1.16364]];
  const SIM={
    protan:[[0,1.05118294,-0.05116099],[0,1,0],[0,0,1]],
    deutan:[[1,0,0],[0.9513092,0,0.04866992],[0,0,1]],
    tritan:[[1,0,0],[0,1,0],[-0.86744736,1.86727089,0]]
  };
  const mul=(m,v)=>[m[0][0]*v[0]+m[0][1]*v[1]+m[0][2]*v[2],
                    m[1][0]*v[0]+m[1][1]*v[1]+m[1][2]*v[2],
                    m[2][0]*v[0]+m[2][1]*v[1]+m[2][2]*v[2]];
  const cvd=(rgb,kind)=>{ if(kind==='normal') return rgb;
    const v=[lin(rgb[0]),lin(rgb[1]),lin(rgb[2])];
    const lms=mul(M,v); const sim=mul(SIM[kind],lms); const out=mul(Mi,sim);
    return [srgb(out[0]),srgb(out[1]),srgb(out[2])]; };
  /* CIE Lab, so "how different" means how different they LOOK, not RGB arithmetic */
  const lab=rgb=>{ const v=[lin(rgb[0]),lin(rgb[1]),lin(rgb[2])];
    let X=0.4124*v[0]+0.3576*v[1]+0.1805*v[2];
    let Y=0.2126*v[0]+0.7152*v[1]+0.0722*v[2];
    let Z=0.0193*v[0]+0.1192*v[1]+0.9505*v[2];
    X/=0.95047; Z/=1.08883;
    const f=t=>t>0.008856?Math.cbrt(t):(7.787*t+16/116);
    return [116*f(Y)-16, 500*(f(X)-f(Y)), 200*(f(Y)-f(Z))]; };
  const dE=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);

  const keepW=window.G_WORN, keepE=G.equipped, keepV=G.bodyVar;
  const PD_OFF=['hat','glasses','hair','shirt','jacket','pants','shoes'];
  const out=[];
  for(const f of window.FACTION_LOOKS){
    const eq={}; for(const k in keepE) eq[k]=keepE[k];
    for(const s of PD_OFF) eq[s]='';
    G.equipped=eq; G.bodyVar=f.dials; window.G_WORN=f.worn;
    try{HD_CACHE.map.clear();FRAME_CACHE.map.clear();}catch(e){}
    const fr=buildFrame('S','idle',0);
    let r=0,g=0,bb=0,n=0;
    for(let i=0;i<fr.px.length;i++){ const c=fr.px[i]; if(!c) continue;
      const gv=fr.grid[i]; if(gv===1||gv===2) continue;
      const mx=Math.max(c[0],c[1],c[2])/255; if(mx<0.12) continue;
      r+=c[0]; g+=c[1]; bb+=c[2]; n++; }
    if(!n) continue;
    out.push({n:f.faction, rgb:[r/n,g/n,bb/n], px:n});
  }
  window.G_WORN=keepW; G.equipped=keepE; G.bodyVar=keepV;
  try{HD_CACHE.map.clear();FRAME_CACHE.map.clear();}catch(e){}
  const kinds=['normal','protan','deutan','tritan'];
  const res={factions:out.map(o=>({n:o.n,rgb:o.rgb.map(x=>Math.round(x))})), pairs:{}};
  for(const k of kinds){
    const labs=out.map(o=>lab(cvd(o.rgb,k)));
    const worst=[];
    for(let i=0;i<out.length;i++) for(let j=i+1;j<out.length;j++)
      worst.push({a:out[i].n,b:out[j].n,d:+dE(labs[i],labs[j]).toFixed(1)});
    worst.sort((x,y)=>x.d-y.d);
    res.pairs[k]=worst;
  }
  return res;
});
  await b.close();
  return R;
}
module.exports = { measure };
