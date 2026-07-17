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
if(typeof module!=='undefined')module.exports=BOH_SLICE;
