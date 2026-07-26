// BOHEMIA SLICE ENGINE (light pass + day cycle + slice core) — v11 7/16/26
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

// BOHEMIA DAY CYCLE — ambient light over the day (7/14/26)
// Grounded: sun color temperature (warm at horizon, neutral at noon);
// night floor = Paolo's approved ambient (+10% ruling, 7/14).
const BOH_DAYCYCLE=(function(){
  const NIGHT=[2.42,2.64,3.52];          // Paolo's night (16-level space)
  const DAY=[16,16,16];                  // full bright
  const DUSK=[11.5,8.5,6.5];             // warm horizon light (tunable, flagged)
  function lerp(a,b,t){return a.map((v,i)=>v+(b[i]-v)*t);}
  // t: 0..1 day fraction (0 = midnight)
  function ambientAt(t){
    t=((t%1)+1)%1;
    if(t<0.20) return NIGHT;                                   // deep night
    if(t<0.30) return lerp(NIGHT,DUSK,(t-0.20)/0.10);          // dawn warm-up
    if(t<0.38) return lerp(DUSK,DAY,(t-0.30)/0.08);            // morning
    if(t<0.70) return DAY;                                     // day
    if(t<0.80) return lerp(DAY,DUSK,(t-0.70)/0.10);            // golden hour
    if(t<0.88) return lerp(DUSK,NIGHT,(t-0.80)/0.08);          // dusk fall
    return NIGHT;
  }
  function isNightish(t){const a=ambientAt(t);return (a[0]+a[1]+a[2])/3<8;}
  return {ambientAt,isNightish,NIGHT,DAY,DUSK};
})();

// BOHEMIA SLICE CORE — beat clock, grid movers, door control (7/14/26)
// 120 BPM LAW: input is a REQUEST; steps execute on the beat tick.
// Hold >= 2 beats = RUN (2 cells/beat). Doors: 2-beat swing, passable f>=5.
const BOH_SLICE=(function(){
  const BEAT=500;
  function makeClock(now){
    const t0=now!==undefined?now:0;
    return {BEAT,t0,
      beatOf(t){return Math.floor((t-t0)/BEAT);},
      subOf(t,div){return Math.floor((t-t0)/(BEAT/(div||8)));},
      phase(t){return (((t-t0)%BEAT)+BEAT)%BEAT/BEAT;}};
  }
  function makeMover(opts){
    const o=opts||{};
    const st={x:o.x||0,y:o.y||0,px:o.x||0,py:o.y||0,fx:0,fy:1,stepAt:-1,
      held:null,heldSince:0,lastBeat:-1,id:(o.id!==undefined?o.id:null)};
    function hold(dir,t){st.held=dir;st.heldSince=t;}
    function release(){st.held=null;}
    function tryStep(dx,dy,world){
      st.fx=dx;st.fy=dy;
      const nx=st.x+dx,ny=st.y+dy;
      // OCCUPANCY LAW: bodies never overlap. passable() is asked WHO is asking
      // so an actor is never blocked by its own cell.
      if(world.passable(nx,ny,st.id)){st.px=st.x;st.py=st.y;st.x=nx;st.y=ny;return true;}
      return false;
    }
    // call every frame; steps only land when the beat advances
    function tick(t,clock,world){
      const b=clock.beatOf(t);
      if(b===st.lastBeat)return;
      st.lastBeat=b;
      if(st.held){
        const beatsHeld=(t-st.heldSince)/clock.BEAT;
        if(tryStep(st.held[0],st.held[1],world))st.stepAt=t;
        if(beatsHeld>=2&&tryStep(st.held[0],st.held[1],world))st.stepAt=t; // RUN LAW
      }
    }
    function lerpPos(t){
      const k=st.stepAt<0?1:Math.min(1,(t-st.stepAt)/(BEAT*0.6));
      return [st.px+(st.x-st.px)*k, st.py+(st.y-st.py)*k];
    }
    return {st,hold,release,tryStep,tick,lerpPos};
  }
  function makeDoor(x,y,frames){
    const d={x,y,f:0,open:false,anim:0,lastAdv:0,frames:frames||9};
    d.toggle=function(t){d.anim=d.open?-1:1;d.open=!d.open;d.lastAdv=t;};
    d.tick=function(t){
      if(d.anim!==0&&t-d.lastAdv>BEAT/4){
        d.f+=d.anim;d.lastAdv=t;
        if(d.f<=0){d.f=0;d.anim=0;} if(d.f>=d.frames-1){d.f=d.frames-1;d.anim=0;}
      }};
    d.passable=function(){return d.f>=5;};
    d.blocks=function(gx,gy){return gx>=d.x&&gx<d.x+2&&gy>=d.y&&gy<d.y+2&&!d.passable();};
    return d;
  }
  // simple wanderer brain: on each beat maybe turn, maybe pause, else walk
  function makeWanderer(mover,seed){
    let s=seed>>>0;
    const rnd=()=>{s=(s*1103515245+12345)>>>0;return s/4294967296;};
    const DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
    let dir=DIRS[Math.floor(rnd()*4)],lastBeat=null;
    return {tick(t,clock,world){
      const b=clock.beatOf(t);
      if(lastBeat===null){lastBeat=b;return;}   // first tick synchronizes, never acts
      if(b===lastBeat)return;lastBeat=b;
      const r=rnd();
      if(r<0.18){dir=DIRS[Math.floor(rnd()*4)];return;}   // turn, no step
      if(r<0.30)return;                                    // idle beat
      if(!mover.tryStep(dir[0],dir[1],world)){dir=DIRS[Math.floor(rnd()*4)];}
      else mover.st.stepAt=t;
    }};
  }

  // I-MOVE-YOU-MOVE (Paolo canon, time model law): world time advances ONLY
  // with player movement. Each player step = 1 world beat (run step = still
  // 1 beat per cell). Wall-clock only animates cosmetics (flames flicker),
  // never world state.
  function makeTurnClock(){
    let worldBeat=0;
    return {BEAT,
      advance(n){worldBeat+=(n||1);},
      beatOf(){return worldBeat;},
      subOf(t,div){return Math.floor((t)/(BEAT/(div||8)));}, // cosmetic only
      worldBeat(){return worldBeat;}};
  }

  // WORLD CLOCK WALK LAW (researched 7/14/26): real valley crossing = 6h23m.
  // Each fine step = 1.9s game time walking, 0.9s running. 1 overmap cell
  // (128 steps) = 4 min. Day = 86400 world seconds. I-MOVE-YOU-MOVE intact.
  const WALK_STEP_S=1.9, RUN_STEP_S=0.9, CELL_MIN=4, DAY_S=86400;
  function makeWorldClock(startDayFrac){
    let sec=(startDayFrac||0)*DAY_S;
    return {WALK_STEP_S,RUN_STEP_S,DAY_S,
      stepWalk(n){sec+=WALK_STEP_S*(n||1);},
      stepRun(n){sec+=RUN_STEP_S*(n||1);},
      seconds(){return sec;},
      dayFrac(){return (sec%DAY_S)/DAY_S;},
      clockText(){const d=(sec%DAY_S)/3600;const h=Math.floor(d),m=Math.floor((d-h)*60);
        return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');}};
  }
  return {BEAT,makeClock,makeTurnClock,makeWorldClock,makeMover,makeDoor,makeWanderer};
})();


if(typeof module!=='undefined')module.exports={BOH_LIGHT,BOH_DAYCYCLE,BOH_SLICE};
