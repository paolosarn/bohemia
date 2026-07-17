// BOHEMIA LIGHT PASS — engine module (7/14/26)
// LIGHT PHILOSOPHY LAW: "Everything can be touched by light. Nothing is above light."
// Whole-frame pass: (1) scene draws FULL-BRIGHT, (2) lightmap multiplies the
// ENTIRE frame, (3) only emissives draw after darkness. Per-sprite tint BANNED.
const BOH_LIGHT=(function(){
  function makePass(w,h){
    const light=(typeof document!=='undefined')?document.createElement('canvas'):null;
    if(light){light.width=w;light.height=h;}
    const state={w,h,ambient:[2.42,2.64,3.52],emitters:[]}; // ambient in 16-levels
    function setAmbient(rgb){state.ambient=rgb;}
    function setEmitters(list){state.emitters=list;} // {x,y,color:[r,g,b],r_cells,wobAmp}
    function drawLightmap(lctx,CELL,phase){
      lctx.globalCompositeOperation='source-over';
      const A=state.ambient;
      lctx.fillStyle=`rgb(${Math.round(A[0]/16*255)},${Math.round(A[1]/16*255)},${Math.round(A[2]/16*255)})`;
      lctx.fillRect(0,0,state.w,state.h);
      lctx.globalCompositeOperation='lighter';
      for(const e of state.emitters){
        const wob=1+(e.wobAmp||0)*Math.sin(2*Math.PI*phase);
        const r=e.r_cells*CELL*wob, cx=(e.x+0.5)*CELL, cy=(e.y+0.5)*CELL;
        const g=lctx.createRadialGradient(cx,cy,2,cx,cy,r);
        const [R,G,B]=e.color;
        g.addColorStop(0,`rgba(${R},${G},${B},0.95)`);
        g.addColorStop(0.6,`rgba(${R},${G},${B},0.35)`);
        g.addColorStop(1,'rgba(0,0,0,0)');
        lctx.fillStyle=g;lctx.beginPath();lctx.arc(cx,cy,r,0,7);lctx.fill();
      }
    }
    // apply(ctx, sceneCanvas, CELL, phase): the law in one call
    function apply(ctx,scene,CELL,phase){
      if(!light)throw new Error('light pass needs DOM canvas');
      drawLightmap(light.getContext('2d'),CELL,phase);
      ctx.globalCompositeOperation='source-over';
      ctx.drawImage(scene,0,0);
      ctx.globalCompositeOperation='multiply';
      ctx.drawImage(light,0,0);
      ctx.globalCompositeOperation='source-over';
    }
    // pure lightLevel for logic (AI vision, stealth later): 0..1 at a cell
    function levelAt(gx,gy,phase){
      const A=state.ambient; let l=Math.max(A[0],A[1],A[2]);
      for(const e of state.emitters){
        const wob=1+(e.wobAmp||0)*Math.sin(2*Math.PI*phase);
        const d=Math.max(Math.abs(gx-e.x),Math.abs(gy-e.y));
        const rr=e.r_cells*wob;
        if(d<=rr) l=Math.max(l,A[0]+16*(1-d/(rr+0.5)));
      }
      return Math.min(l,16)/16;
    }
    return {setAmbient,setEmitters,apply,levelAt,state};
  }
  return {makePass};
})();
if(typeof module!=='undefined')module.exports=BOH_LIGHT;
