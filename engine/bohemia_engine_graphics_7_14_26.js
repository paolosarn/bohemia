// BOHEMIA GRAPHICS ENGINE BUNDLE (7/14/26) — one import for the absorption session.
// Contains: BOH_LIGHT (light philosophy law), BOH_DAYCYCLE, BOH_SLICE (3 clocks,
// movers, doors, wanderers), BOH_BLOCKGEN (streets/freeway/residential/desert/
// mountain), BOH_OMBRIDGE (canonical overmap -> blocks, researched lanes).
// Each module unchanged from its tested standalone; module.exports consolidated.

// ===== bohemia_light_pass.js =====
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



// ===== bohemia_daycycle.js =====
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



// ===== bohemia_slice_core.js =====
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



// ===== bohemia_blockgen.js =====
// BOHEMIA BLOCK GENERATOR — worldgen Phase B harness (7/14/26)
// Block = one city-view grid cell (BLOCK CANON). This module turns a block
// spec into a CELL GRID (semantic layers), never images: renderers consume it.
// Laws encoded: LANE WIDTH=2 (LOCKED), lanes 1-4/dir (5 freeway), median 1-2
// (fat=u-turns), sidewalk 1-3, crosswalks ONLY at intersections, STAGGERED
// LAMP LAW, NO SINGLE STREET LAW (variance is asserted by test), CAR OVERLAP
// LAW (occupancy), LINE COLOR LAW (semantic rows carry color class).
const BOH_BLOCKGEN=(function(){
  function rng(seed){let s=seed>>>0;return function(){s=(s*1103515245+12345)>>>0;return s/4294967296;}}
  const LANE_W=2; // LAW

  // SIDEWALK SANCTITY LAW (Paolo 7/14, RF0 DOWN — RUIN FLANKS died for this):
  // "nothing on sidewalks except lamp posts and street furniture; buildings/
  //  ruins live PAST the sidewalk; buildings do not go on streets."
  // The law lived in a comment, which is not enforcement. It is a whitelist now.
  //
  // CORRECTION 7/16: "Sidewalk furniture whitelist — beyond lamps" sits on
  // Paolo's shelf as HIS call. I built the mechanism and then quietly filled it
  // with 13 furniture names, which is authoring canon he had reserved. Split.
  //
  // LAW-BACKED — these two have rulings behind them. Nothing else does.
  //   street_lamp   STAGGERED LAMP LAW + LAMP HEIGHT LAW (7/14)
  //   fire_barrel   "FIRE BARRELS ARE RARE... standalone props" (7/14)
  const SIDEWALK_LEGAL=new Set(['street_lamp','fire_barrel']);
  // PROPOSED — plausible Vegas street furniture, NOT ruled on, OFF by default.
  // Paolo promotes a name or deletes it. Claude never promotes these.
  const SIDEWALK_PROPOSED=['traffic_light','ped_signal','bench','trash_can',
    'hydrant','mailbox','street_sign','bus_stop','newspaper_box','planter','bollard'];
  // opts.sidewalkFurniture admits proposed names for ONE run, so the question
  // can be answered with a picture instead of argued in the abstract.
  function sidewalkLegal(opts){
    if(!opts||!opts.sidewalkFurniture)return SIDEWALK_LEGAL;
    return new Set([...SIDEWALK_LEGAL,
      ...opts.sidewalkFurniture.filter(p=>SIDEWALK_PROPOSED.indexOf(p)>=0)]);
  }
  // Every prop placement goes through here. A prop that is not street furniture
  // cannot reach a sidewalk cell by accident, ever, in any recipe.
  function placeProp(cell,prop,legal){
    if(cell.g==='side'&&!(legal||SIDEWALK_LEGAL).has(prop.p))return false;
    cell.props.push(prop);return true;
  }
  // LINE COLOR LAW audit. Walks the real grid and checks every marking against
  // the lanes actually beside it. Catches a generator that writes the right
  // colour for the wrong reason.
  function auditLines(b){
    const bad=[];
    if(b.type!=='street'&&b.meta&&b.meta.type!=='street')return bad;
    const H=b.H,W=b.W;
    const dirOf=(y)=>{const c=b.grid[y]&&b.grid[y][0];return c?c.dir:null;};
    for(let y=0;y<H;y++){
      const c=b.grid[y][0];
      if(!c)continue;
      if(c.g!=='lane_div'&&c.g!=='median')continue;
      // find the nearest lane above and below this marking
      let up=null,dn=null;
      for(let i=y-1;i>=0;i--){if(b.grid[i][0].g==='lane'){up=dirOf(i);break;}}
      for(let i=y+1;i<H;i++){if(b.grid[i][0].g==='lane'){dn=dirOf(i);break;}}
      if(!c.axis)bad.push({y,why:'line cell carries no road axis'});
      if(up&&dn){
        const opposing=(up!==dn);
        if(opposing&&c.color!=='yellow_direction')
          bad.push({y,why:'opposing traffic separated by '+c.color+', law says yellow'});
        if(!opposing&&c.color!=='white_lane')
          bad.push({y,why:'same-direction lanes separated by '+c.color+', law says white'});
      }
    }
    // rule 3: nothing may carry a with-axis line colour on a crosswalk cell
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const c=b.grid[y][x];
      if(c.g==='crosswalk'&&c.color)bad.push({x,y,why:'crosswalk carries a with-axis line colour'});
    }
    return bad;
  }

  // Post-gen audit for the gate: returns every violation found in a block.
  function auditSidewalks(b){
    const bad=[];
    for(let y=0;y<b.H;y++)for(let x=0;x<b.W;x++){
      const c=b.grid[y][x];
      if(c.g!=='side')continue;
      for(const p of c.props)
        if(!SIDEWALK_LEGAL.has(p.p)&&SIDEWALK_PROPOSED.indexOf(p.p)<0) bad.push({x,y,prop:p.p});
    }
    return bad;
  }
  function streetLayout(r,opts){
    const o=opts||{};
    const lanes=o.lanes!=null?o.lanes:(1+Math.floor(r()*3)); // 1-3 typical, 4 busy
    const mw=o.median!=null?o.median:(r()<0.75?1:2);
    const sw=o.sidewalk!=null?o.sidewalk:(r()<0.7?1:2);
    const rows=[];
    // LINE COLOR LAW (Paolo 7/13): yellow/orange ALWAYS separates DIRECTION;
    // white separates same-direction lanes; lines run WITH the road axis and a
    // marking across travel direction is legal ONLY as a crosswalk.
    // Rows now carry `dir` (A / B / null) so the law is PROVABLE and not just
    // asserted by the code that wrote it: a divider is legal iff the lanes on
    // either side of it agree (white) or disagree (yellow) about direction.
    for(let i=0;i<sw;i++)rows.push({t:'side'});
    for(let d=0;d<lanes;d++){for(let i=0;i<LANE_W;i++)rows.push({t:'lane',dir:'A'});
      if(d<lanes-1)rows.push({t:'lane_div',color:'white_lane',axis:'road'});}
    for(let i=0;i<mw;i++)rows.push({t:'median',color:'yellow_direction',axis:'road'});
    for(let d=0;d<lanes;d++){if(d>0)rows.push({t:'lane_div',color:'white_lane',axis:'road'});
      for(let i=0;i<LANE_W;i++)rows.push({t:'lane',dir:'B'});}
    for(let i=0;i<sw;i++)rows.push({t:'side'});
    return {rows,lanes,median:mw,sidewalk:sw};
  }
  function genStreet(seed,W,opts){
    const r=rng(seed);
    const L=streetLayout(r,opts);
    const H=L.rows.length;
    const grid=[];
    for(let y=0;y<H;y++){grid.push([]);
      for(let x=0;x<W;x++)grid[y].push({g:L.rows[y].t,color:L.rows[y].color||null,
        dir:L.rows[y].dir||null,axis:L.rows[y].axis?'EW':null,props:[]});}
    // crosswalk only if this block hosts an intersection
    const hasIntersection=(opts&&opts.intersection!=null)?opts.intersection:(r()<0.35);
    if(hasIntersection){
      const cw=r()<0.8?1:2, cx=2+Math.floor(r()*(W-6));
      for(let y=L.sidewalk;y<H-L.sidewalk;y++)for(let i=0;i<cw;i++){
        const c=grid[y][cx+i];
        // A crosswalk is perpendicular BY DEFINITION (law rule 3). It must not
        // keep the with-axis line colour it inherited from the row underneath,
        // or the renderer draws a lane stripe running through the crossing.
        c.g='crosswalk'; c.color=null; c.axis='NS';
      }
    }
    // lamps: STAGGERED LAW
    const ls=(opts&&opts.lampSpacing)||8; let side=0;
    const lampH=(opts&&opts.lampTall)||(L.lanes>=3?4:3); // LAMP HEIGHT LAW: arterial 4, smaller 3
    for(let x=2;x<W-1;x+=ls){placeProp(grid[side?H-1:0][x],{p:'street_lamp',hTiles:lampH,state:'dead'});side=1-side;}
    // FIRE BARRELS RARE (7/14): standalone props, never lamp stand-ins
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const c=grid[y][x];
      if(c.g==='side'&&!c.props.length&&r()<0.03)placeProp(c,{p:'fire_barrel',hTiles:1});
    }
    // wrecks: CAR OVERLAP LAW via occupancy, 4-way facings
    const occ=new Set(); const laneRows=[]; L.rows.forEach((rw,i)=>{if(rw.t==='lane')laneRows.push(i);});
    const wrecks=(opts&&opts.wrecks!=null)?opts.wrecks:Math.floor(r()*4);
    let placed=0,tries=0;
    while(placed<wrecks&&tries<100){tries++;
      const ns=r()<0.4, w=ns?2:3,h=ns?3:2;
      const gx=4+Math.floor(r()*(W-8)), gy=laneRows[Math.floor(r()*laneRows.length)];
      if(gy+h>H-L.sidewalk)continue;
      let free=true;
      for(let x=gx;x<gx+w;x++)for(let y=gy;y<gy+h;y++)if(occ.has(x+','+y))free=false;
      if(!free)continue;
      for(let x=gx;x<gx+w;x++)for(let y=gy;y<gy+h;y++)occ.add(x+','+y);
      // a wreck is not street furniture: the choke refuses it if a lane row ever
      // resolves onto a sidewalk cell. It counts only if it actually landed.
      if(placeProp(grid[gy][gx],{p:'car_wreck',w,h,facing:ns?'NS':'EW'}))placed++;
    }
    return {type:'street',W,H,grid,meta:{lanes:L.lanes,median:L.median,sidewalk:L.sidewalk,intersection:hasIntersection,wrecks:placed}};
  }
  // recipe registry per BLOCK CANON (street-scene-first; others are presets/stubs)
  // TERRAIN TYPES (7/14): the valley's edges.
    // RUIN FLANKS — DEAD (Paolo 7/14, SIDEWALK SANCTITY LAW): sidewalks carry NOTHING
  // but lamp posts / street furniture; buildings+ruins live PAST the sidewalk in a
  // zone not yet designed. Function retained unused as the graveyard record.
  // (original intent below)
  // along their building edges (top row 0 and bottom row H-1 sidewalk backs).
  // Placement is lawful spacing, not map design: fragments every 3-6 cells,
  // density scales with decay (wrecks opt); never on crosswalk columns.
  // GRAVEYARD (RF0 DOWN, 7/14/26, SIDEWALK SANCTITY LAW): addRuinFlanks and
  // ruin_frag are DEAD. The record lives in bohemia_graveyard.txt. A dead
  // function kept inside a live module is a loaded gun — one call site away
  // from resurrecting a verdict Paolo already made. Ruins live PAST the
  // sidewalk in a zone he has not designed yet.
  function genDesert(seed,W,opts){
    const r=rng(seed);const H=Math.max(10,Math.floor(W*0.6));
    const grid=[];
    for(let y=0;y<H;y++){const row=[];
      for(let x=0;x<W;x++){
        const c={g:'desert',props:[]};
        const v=r();
        if(v<0.03)c.props.push({p:'rock',w:1,h:1});
        else if(v<0.045)c.props.push({p:'rubble',w:1,h:1});
        else if(v<0.053)c.props.push({p:'scorch_patch',w:1,h:1});
        row.push(c);
      } grid.push(row);}
    return {W,H,grid,meta:{type:'desert',lanes:0,sidewalk:0,median:0,wrecks:0,crosswalk:0}};
  }
  function genMountain(seed,W,opts){
    const r=rng(seed);const H=Math.max(10,Math.floor(W*0.6));
    const grid=[];
    for(let y=0;y<H;y++){const row=[];
      for(let x=0;x<W;x++){
        const c={g:'rock',props:[]};
        if(r()<0.35)c.props.push({p:'boulder',w:1,h:1,impassable:true});
        row.push(c);
      } grid.push(row);}
    return {W,H,grid,meta:{type:'mountain',lanes:0,sidewalk:0,median:0,wrecks:0,crosswalk:0}};
  }
  // BIG-ACREAGE GRAMMAR (7/14) — semantic roles only, art pools PENDING.
  // WASH: Vegas flood channels — concrete floor, sloped banks, service road one side.
  function genWash(seed,W,opts){
    const H=Math.max(12,Math.floor(W*0.6));
    const grid=[];
    const floorW=Math.max(4,Math.floor(W*0.3));
    const x0=Math.floor((W-floorW)/2);
    for(let y=0;y<H;y++){const row=[];
      for(let x=0;x<W;x++){
        let g='desert';
        if(x>=x0&&x<x0+floorW)g='wash_floor';
        else if(x===x0-1||x===x0+floorW)g='wash_slope';
        else if(x===x0-2)g='wash_service_road';
        row.push({g,props:[]});
      } grid.push(row);}
    return {W,H,grid,meta:{type:'wash',lanes:0,sidewalk:0,median:0,wrecks:0,crosswalk:0,pending:['channel concrete art','culvert crossings']}};
  }
  // SOLAR: panel rows on N-S racks, service aisles between, perimeter fence.
  function genSolar(seed,W,opts){
    const H=Math.max(12,Math.floor(W*0.6));
    const grid=[];
    for(let y=0;y<H;y++){const row=[];
      for(let x=0;x<W;x++){
        const g=(x%4<2)?'panel_row':'service_aisle';
        row.push({g,props:[]});
      } grid.push(row);}
    for(let x=0;x<W;x++){grid[0][x].props.push({p:'fence',impassable:true});grid[H-1][x].props.push({p:'fence',impassable:true});}
    for(let y=0;y<H;y++){grid[y][0].props.push({p:'fence',impassable:true});grid[y][W-1].props.push({p:'fence',impassable:true});}
    return {W,H,grid,meta:{type:'solar',lanes:0,sidewalk:0,median:0,wrecks:0,crosswalk:0,pending:['panel art','inverter pads','fence art']}};
  }
  // FARM: field strips with dirt access lanes every 8 rows.
  function genFarm(seed,W,opts){
    const H=Math.max(12,Math.floor(W*0.6));
    const grid=[];
    for(let y=0;y<H;y++){const row=[];
      for(let x=0;x<W;x++){
        const g=(y%8===0)?'farm_lane':'field_row';
        row.push({g,props:[]});
      } grid.push(row);}
    return {W,H,grid,meta:{type:'farm',lanes:0,sidewalk:0,median:0,wrecks:0,crosswalk:0,pending:['crop art (citybuilder output ties in)','farm buildings']}};
  }
  // AIRPORT/AIRBASE (7/14): factual anatomy — runway strip with centerline,
  // parallel taxiway, apron band. Art pools PENDING (concrete family).
  function genAirfield(seed,W,opts){
    const H=Math.max(14,Math.floor(W*0.6));
    const grid=[];
    const rwY=Math.floor(H*0.35);
    for(let y=0;y<H;y++){const row=[];
      for(let x=0;x<W;x++){
        let g='desert';
        if(y===rwY||y===rwY+1||y===rwY+2)g=(y===rwY+1)?'runway_centerline':'runway';
        else if(y===rwY+5)g='taxiway';
        else if(y>=H-5)g='apron_concrete';
        row.push({g,props:[]});
      } grid.push(row);}
    return {W,H,grid,meta:{type:'airfield',lanes:0,sidewalk:0,median:0,wrecks:0,crosswalk:0,
      pending:['runway/taxiway concrete art','marking art','derelict aircraft props']}};
  }
  const RECIPES={
    street:(seed,W,o)=>{
      const b=genStreet(seed,W,o);
      // CENTER TURN LANE (7/14, pools blessed): opts.centerTurn converts the
      // median band into a two-way-left-turn lane, 2 cells wide (twlt_T/B rows).
      if(o&&o.centerTurn){
        const rows=[];
        for(let y=0;y<b.H;y++)if(b.grid[y].some(c=>c.g==='median'))rows.push(y);
        if(rows.length){
          const mid=rows[Math.floor(rows.length/2)];
          for(const y of rows)for(let x=0;x<b.W;x++)if(b.grid[y][x].g==='median')b.grid[y][x].g=(y<=mid)?'twlt_T':'twlt_B';
          // ensure exactly 2 rows read as the lane: widen single-row medians
          if(rows.length===1){
            const y2=Math.min(b.H-1,rows[0]+1);
            for(let x=0;x<b.W;x++){const g=b.grid[y2][x].g;if(g!=='side'&&g!=='crosswalk')b.grid[y2][x].g='twlt_B';}
          }
          b.meta.centerTurn=true;
        }
      }
      return b;
    },
    freeway:(seed,W,o)=>genStreet(seed,W,Object.assign({lanes:5,median:2,sidewalk:1,intersection:false},o)),
    underpass:(seed,W,o)=>genStreet(seed,W,Object.assign({lanes:2,lampSpacing:14,intersection:false},o)),
    residential:(seed,W,o)=>genStreet(seed,W,Object.assign({lanes:1,median:1,sidewalk:1,wrecks:1},o)),
    desert:(seed,W,o)=>genDesert(seed,W,o||{}),
    mountain:(seed,W,o)=>genMountain(seed,W,o||{}),
    wash:(seed,W,o)=>genWash(seed,W,o||{}),
    solar:(seed,W,o)=>genSolar(seed,W,o||{}),
    farm:(seed,W,o)=>genFarm(seed,W,o||{}),
    airfield:(seed,W,o)=>genAirfield(seed,W,o||{}),
    sewer_entrance:(seed,W,o)=>({type:'sewer_entrance',W,H:0,grid:null,meta:{stub:'street recipe + manhole entrance cell; pending'}}),
  };
  function generate(type,seed,W,opts){
    if(!RECIPES[type])throw new Error('unknown block type '+type);
    return RECIPES[type](seed,W||28,opts||{});
  }
  return {generate,LANE_W,placeProp,sidewalkLegal,auditSidewalks,auditLines,
    SIDEWALK_LEGAL,SIDEWALK_PROPOSED,types:Object.keys(RECIPES)};
})();



// ===== bohemia_overmap_bridge.js =====
// BOHEMIA OVERMAP->BLOCK BRIDGE (7/14/26)
// LANES SOURCED (7/14 research): Strip 3/dir, arterials 3/dir, I-15 5/dir (= Paolo's law exactly).
// The canonical valley meets the block pipeline: an overmap cell's district
// class picks a blockgen recipe; the CELL'S OWN seed drives generation
// (deterministic per (seed, cell) — Continuous Walk Law). Quality maps to
// wreckage/litter density (low quality = more collapse) [tunable, flagged].
const BOH_OMBRIDGE=(function(){
  function recipeFor(cell){
    const d=cell.district, q=cell.quality!=null?cell.quality:0.5;
    const decay=Math.round((1-q)*6); // 0..6 wrecks from quality
    switch(d){
      case 'arterial': return {type:'street',opts:{lanes:q<0.35?2:3,wrecks:decay,intersection:(cell.seed%3)===0}}; // RESEARCHED: mile-grid arterials run 3/dir (FHWA); only decayed minors drop to 2
      case 'freeway': case 'beltway': return {type:'freeway',opts:{wrecks:decay}};
      case 'suburb': case 'gated': case 'trailer': return {type:'residential',opts:{wrecks:Math.min(decay,2)}};
      case 'strip': return {type:'street',opts:{lanes:3,sidewalk:3,median:2,wrecks:decay,intersection:false}}; // SIDEWALK LAW: Strip max 3
      case 'downtown': case 'commercial': case 'casino':
        return {type:'street',opts:{lanes:q>0.5?3:2,sidewalk:2,wrecks:decay,intersection:(cell.seed%2)===0}}; // researched: urban corridors 2-3/dir
      case 'desert': return {type:'desert',opts:{}};
      case 'wash': return {type:'wash',opts:{}};
      case 'solar': return {type:'solar',opts:{}};
      case 'farm': return {type:'farm',opts:{}};
      case 'airport': case 'airbase': return {type:'airfield',opts:{}};
      case 'mountain': return {type:'mountain',opts:{}};
      default: return null; // district fine-layer template PENDING Paolo (Abstraction Law)
    }
  }
  function blockFor(cell,G,W){
    const r=recipeFor(cell);
    if(!r) return {pending:true,district:cell.district,cell:{x:cell.x,y:cell.y}};
    const b=G.generate(r.type,cell.seed>>>0,W||24,r.opts);
    b.meta.district=cell.district; b.meta.quality=cell.quality;
    b.meta.cell=[cell.x,cell.y];
    return b;
  }
  return {recipeFor,blockFor};
})();

// DISTRICT MERGE LAW (7/14): detect same-district rect clusters (cap 2x2),
// seeded merge coin per cluster (default p=0.6, PENDING Paolo).
BOH_OMBRIDGE.clusterFor=function(m,x,y,mergeP){
  mergeP=mergeP==null?0.6:mergeP;
  const d=m.at(x,y).district;
  const same=(xx,yy)=>{try{return m.at(xx,yy).district===d;}catch(e){return false;}};
  // anchor cluster at even coordinates so every member agrees on the cluster
  const ax=x-(x%2), ay=y-(y%2);
  const can2x2=same(ax,ay)&&same(ax+1,ay)&&same(ax,ay+1)&&same(ax+1,ay+1);
  const canH=same(ax,y)&&same(ax+1,y);
  const canV=same(x,ay)&&same(x,ay+1);
  const coin=(sx,sy,salt)=>{let s=(m.at(sx,sy).seed^salt)>>>0;s=(s*1103515245+12345)>>>0;return (s/4294967296)<mergeP;};
  if(can2x2&&coin(ax,ay,0xAA)){return {cx:ax,cy:ay,cw:2,ch:2,seed:m.at(ax,ay).seed,member:[x-ax,y-ay]};}
  if(canH&&coin(ax,y,0xBB)){return {cx:ax,cy:y,cw:2,ch:1,seed:m.at(ax,y).seed,member:[x-ax,0]};}
  if(canV&&coin(x,ay,0xCC)){return {cx:x,cy:ay,cw:1,ch:2,seed:m.at(x,ay).seed,member:[0,y-ay]};}
  return {cx:x,cy:y,cw:1,ch:1,seed:m.at(x,y).seed,member:[0,0]};
};


// GATES TOUCH STREETS (7/14): plotFor detects which plot edges face street
// districts on the real overmap and hands them to plotgen as streetEdges.
BOH_OMBRIDGE.STREET_DISTRICTS=['arterial','street','strip','downtown','freeway','residential_street'];
BOH_OMBRIDGE.plotFor=function(m,x,y,P,opts){
  opts=opts||{};
  const cl=BOH_OMBRIDGE.clusterFor(m,x,y,opts.mergeP);
  const cell=m.at(x,y);
  const isStreet=(xx,yy)=>{try{return BOH_OMBRIDGE.STREET_DISTRICTS.indexOf(m.at(xx,yy).district)>=0;}catch(e){return false;}};
  const edges=[];
  // check the CLUSTER's outer edges
  for(let i=0;i<cl.cw;i++){if(isStreet(cl.cx+i,cl.cy-1))
    {edges.push('N');break;}}
  for(let i=0;i<cl.cw;i++){if(isStreet(cl.cx+i,cl.cy+cl.ch)){edges.push('S');break;}}
  for(let i=0;i<cl.ch;i++){if(isStreet(cl.cx-1,cl.cy+i)){edges.push('W');break;}}
  for(let i=0;i<cl.ch;i++){if(isStreet(cl.cx+cl.cw,cl.cy+i)){edges.push('E');break;}}
  const d=cell.district;
  const kind=d==='commercial'?'commercial':(d==='industrial'||d==='warehouse'||d==='railyard'||d==='storage')?'industrial':'suburb';
  const character=
    d==='gated'  ?{forceWalled:true, forceGated:true }:
    d==='estate' ?{forceWalled:true, forceGated:true, setback:'estate_12cell'}:
    d==='trailer'?{forceWalled:false,forceGated:false,setback:'trailer_4cell'}:
    {};
  return {cluster:cl,plot:P.generate(kind,cl.seed,cell.quality,
    Object.assign({shape:{cw:cl.cw,ch:cl.ch},streetEdges:edges},character,opts.gen||{}))};
};




// ===== bohemia_plotgen.js =====
// BOHEMIA PLOT GENERATOR (7/14/26) — CELL-IS-PLOT LAW as engine code.
// Each overmap cell IS its assignment (Paolo 7/14). This module generates
// the PLOT-level grid (128x128 fine cells) for non-street cells.
// LOCKED: WALLED SUBURBS LAW — decent+ suburbs get a perimeter wall with
//   gated entries; rough suburbs get open frontage to the arterial.
// LOCKED: legacy commercial = PARKING FRONTS STORES.
// LOCKED (7/14): WALL HEIGHT LAW — perimeter walls render MINIMUM 2 tiles
//   tall (wall prop carries hTiles:2; renderer draws the stacked face).
// PENDING Paolo (tunable params, researched defaults):
//   - quality threshold for walls (default: quality >= 2 of 0..4)
//   - gates per tract (default 2 — real Vegas tracts run 1-2 arterial entries)
//   - stall striping art (gap), block-wall tile choice (gap)
// Interiors are EMPTY by design: houses await part-role labels; storefront
// buildings await building generation. This module owns rings, aprons, bands.
const BOH_PLOTGEN=(()=>{ 
  function rng(seed){let s=seed>>>0;return function(){s=(s*1103515245+12345)>>>0;return s/4294967296;}}
  const N=128;
  // DISTRICT MERGE LAW (7/14): plots can span same-type cell clusters.
  // shape={cw,ch} in overmap cells (1x1 default, up to 2x2). Wall ring
  // wraps the UNION; no interior walls between merged cells.
  function empty(g){const grid=[];for(let y=0;y<N;y++){const r=[];for(let x=0;x<N;x++)r.push({g,props:[]});grid.push(r);}return grid;}
  // SUBURB: perimeter wall ring (1 cell thick) + gates on the street-facing edge.
  function suburbPlot(seed,quality,opts){
    opts=opts||{};
    const cw=(opts.shape&&opts.shape.cw)||1, ch=(opts.shape&&opts.shape.ch)||1;
    const W=N*cw, H=N*ch;
    const wallThreshold=opts.wallThreshold==null?1:opts.wallThreshold;   // most communities are walled
    const gatedThreshold=opts.gatedThreshold==null?4:opts.gatedThreshold; // gates = rich (PENDING exact)
    // streetEdges: which plot edges face streets, e.g. ['S'] or ['S','E'] — entries ONLY there
    const streetEdges=opts.streetEdges&&opts.streetEdges.length?opts.streetEdges:['S'];
    const entriesPerEdge=opts.entriesPerEdge==null?Math.max(1,cw):opts.entriesPerEdge;
    const r=rng(seed);
    // RESIDENTIAL FAMILY (7/14): districts can force character regardless of quality —
    // GATED district = gated by definition; ESTATE = walled+gated deep-setback money;
    // TRAILER = open, unwalled (rough frontage). All obey the same three laws.
    const walled=opts.forceWalled!=null?opts.forceWalled:quality>=wallThreshold;
    const gated=opts.forceGated!=null?opts.forceGated:quality>=gatedThreshold;
    const grid=[];for(let y=0;y<H;y++){const rr=[];for(let x=0;x<W;x++)rr.push({g:'yard_dirt',props:[]});grid.push(rr);}
    // ONE WALL PER COMMUNITY LAW: single seeded wall style index for the whole ring
    const wallStyle=Math.floor(r()*1e6);
    const meta={type:'suburb_plot',quality,walled,gated,wallStyle,shape:{cw,ch},streetEdges,entries:[],
      pending:['yard fill law','interior loops/culs layout (see VEGAS_NEIGHBORHOOD_ANATOMY)','wall/gate quality thresholds','interior houses']};
    if(walled){
      for(let x=0;x<W;x++){grid[0][x].props.push({p:'perimeter_wall',impassable:true,hTiles:2,style:wallStyle});grid[H-1][x].props.push({p:'perimeter_wall',impassable:true,hTiles:2,style:wallStyle});}
      for(let y=0;y<H;y++){grid[y][0].props.push({p:'perimeter_wall',impassable:true,hTiles:2,style:wallStyle});grid[y][W-1].props.push({p:'perimeter_wall',impassable:true,hTiles:2,style:wallStyle});}
      // GATES TOUCH STREETS LAW: entries only on street-facing edges
      for(const edge of streetEdges){
        for(let gi=0;gi<entriesPerEdge;gi++){
          const span=(edge==='N'||edge==='S')?W:H;
          const gp=Math.floor(span*(gi+1)/(entriesPerEdge+1))+Math.floor((r()-0.5)*10);
          const cells=[];
          for(const d of [0,1,2]){
            const p=Math.min(span-2,Math.max(1,gp+d));
            let x,y;
            if(edge==='S'){x=p;y=H-1;} else if(edge==='N'){x=p;y=0;}
            else if(edge==='E'){x=W-1;y=p;} else {x=0;y=p;}
            const c=grid[y][x];
            c.props=c.props.filter(q=>q.p!=='perimeter_wall');
            // entrance IS suburb road (Paolo law) + gate hardware only if rich
            c.g='suburb_road';
            if(gated)c.props.push({p:'gate_hardware',impassable:false,style:wallStyle});
            cells.push([x,y]);
            // road stub runs inward 4 cells from the entrance
            for(let s=1;s<=4;s++){
              const yy=edge==='S'?y-s:edge==='N'?y+s:y;
              const xx=edge==='E'?x-s:edge==='W'?x+s:x;
              if(yy>0&&yy<H-1&&xx>0&&xx<W-1)grid[yy][xx].g='suburb_road';
            }
          }
          meta.entries.push({edge,cells});
        }
      }
    }
    return {W,H,grid,meta};
  }
  // COMMERCIAL: parking apron fronts the storefront band (legacy Vegas law).
  function commercialPlot(seed,quality,opts){
    opts=opts||{};
    const cw=(opts.shape&&opts.shape.cw)||1, ch=(opts.shape&&opts.shape.ch)||1;
    const W=N*cw, H=N*ch;
    const streetEdges=opts.streetEdges&&opts.streetEdges.length?opts.streetEdges:['S'];
    const primary=streetEdges[0]; // apron faces the primary street (PARKING FRONTS STORES toward the street)
    const apron=opts.apronDepth==null?24:opts.apronDepth;
    const bandDepth=opts.bandDepth==null?20:opts.bandDepth;
    const drivesPerEdge=opts.drivesPerEdge==null?Math.max(1,cw):opts.drivesPerEdge;
    const r=rng(seed);
    const grid=[];for(let y=0;y<H;y++){const rr=[];for(let x=0;x<W;x++)rr.push({g:'backlot',props:[]});grid.push(rr);}
    // orient: depth axis runs from the primary street edge inward
    const paint=(d0,d1,g)=>{ // depth range [d0,d1) from primary edge, full breadth
      for(let d=d0;d<d1;d++)for(let b=0;b<((primary==='N'||primary==='S')?W:H);b++){
        let x,y;
        if(primary==='S'){x=b;y=H-1-d;} else if(primary==='N'){x=b;y=d;}
        else if(primary==='E'){x=W-1-d;y=b;} else {x=d;y=b;}
        grid[y][x]={g,props:[]};
      }};
    // PARKING GEOMETRY LAW (Paolo 7/14, blessed): aisle nearest street
    // (band 0, 4 deep), then stall bands 4 deep with vertical lines every
    // 3rd breadth-tile (shared dividers, 2-tile interiors — cars 2 wide).
    const span=(primary==='N'||primary==='S')?W:H;
    for(let d=0;d<apron;d++)for(let b=0;b<span;b++){
      const isStall=(Math.floor(d/4)%2===1);
      const g=(isStall&&b%3===0)?'stall_line':'parking_concrete';
      let x,y;
      if(primary==='S'){x=b;y=H-1-d;} else if(primary==='N'){x=b;y=d;}
      else if(primary==='E'){x=W-1-d;y=b;} else {x=d;y=b;}
      grid[y][x]={g,props:[]};
    }
    const inset=8;
    // storefront band behind the apron (inset from breadth ends)
    for(let d=apron;d<apron+bandDepth;d++)for(let b=inset;b<((primary==='N'||primary==='S')?W:H)-inset;b++){
      let x,y;
      if(primary==='S'){x=b;y=H-1-d;} else if(primary==='N'){x=b;y=d;}
      else if(primary==='E'){x=W-1-d;y=b;} else {x=d;y=b;}
      grid[y][x]={g:'storefront_pad',props:[]};
    }
    // DRIVEWAY CURB CUTS: entries touch streets — 3-cell cuts on every street edge
    const meta={type:'commercial_plot',quality,apron,bandDepth,shape:{cw,ch},streetEdges,primary,entries:[],
      pending:['stall striping art (gap)','storefront buildings','back-lot law']};
    for(const edge of streetEdges){
      for(let gi=0;gi<drivesPerEdge;gi++){
        
        const gp=Math.floor(span*(gi+1)/(drivesPerEdge+1))+Math.floor((r()-0.5)*8);
        const cells=[];
        for(const d of [0,1,2]){
          const p=Math.min(span-2,Math.max(1,gp+d));
          let x,y;
          if(edge==='S'){x=p;y=H-1;} else if(edge==='N'){x=p;y=0;}
          else if(edge==='E'){x=W-1;y=p;} else {x=0;y=p;}
          grid[y][x]={g:'parking_concrete',props:[]};
          cells.push([x,y]);
        }
        meta.entries.push({edge,cells});
      }
    }
    return {W,H,grid,meta};
  }
  // INDUSTRIAL (7/14): Vegas industrial parks = drive apron + loading
  // frontage facing the street, chain-link fenced yard behind (FENCE, not
  // community wall — different family, art PENDING), deep storage backlot.
  function industrialPlot(seed,quality,opts){
    opts=opts||{};
    const cw=(opts.shape&&opts.shape.cw)||1, ch=(opts.shape&&opts.shape.ch)||1;
    const W=N*cw, H=N*ch;
    const streetEdges=opts.streetEdges&&opts.streetEdges.length?opts.streetEdges:['S'];
    const primary=streetEdges[0];
    const apron=opts.apronDepth==null?16:opts.apronDepth;
    const bandDepth=opts.bandDepth==null?28:opts.bandDepth; // big sheds
    const r=rng(seed);
    const grid=[];for(let y=0;y<H;y++){const rr=[];for(let x=0;x<W;x++)rr.push({g:'yard_gravel',props:[]});grid.push(rr);}
    const span=(primary==='N'||primary==='S')?W:H;
    const put=(d,b,cell)=>{
      let x,y;
      if(primary==='S'){x=b;y=H-1-d;} else if(primary==='N'){x=b;y=d;}
      else if(primary==='E'){x=W-1-d;y=b;} else {x=d;y=b;}
      grid[y][x]=cell;};
    for(let d=0;d<apron;d++)for(let b=0;b<span;b++)put(d,b,{g:'drive_concrete',props:[]});
    for(let d=apron;d<apron+bandDepth;d++)for(let b=6;b<span-6;b++)put(d,b,{g:'shed_pad',props:[]});
    // fence ring around the whole plot with 3-cell drive cuts on street edges
    const meta={type:'industrial_plot',quality,shape:{cw,ch},streetEdges,primary,entries:[],
      pending:['chain-link fence art','shed buildings','yard clutter law']};
    for(let x=0;x<W;x++){grid[0][x].props.push({p:'fence',impassable:true});grid[H-1][x].props.push({p:'fence',impassable:true});}
    for(let y=0;y<H;y++){grid[y][0].props.push({p:'fence',impassable:true});grid[y][W-1].props.push({p:'fence',impassable:true});}
    for(const edge of streetEdges){
      const gp=Math.floor(span/2)+Math.floor((r()-0.5)*10);
      const cells=[];
      for(const d of [0,1,2]){
        const p=Math.min(span-2,Math.max(1,gp+d));
        let x,y;
        if(edge==='S'){x=p;y=H-1;} else if(edge==='N'){x=p;y=0;}
        else if(edge==='E'){x=W-1;y=p;} else {x=0;y=p;}
        const c=grid[y][x];
        c.props=c.props.filter(q=>q.p!=='fence');
        c.g='drive_concrete';
        cells.push([x,y]);
      }
      meta.entries.push({edge,cells});
    }
    return {W,H,grid,meta};
  }
  function generate(kind,seed,quality,opts){
    if(kind==='suburb')return suburbPlot(seed,quality,opts);
    if(kind==='commercial')return commercialPlot(seed,quality,opts);
    if(kind==='industrial')return industrialPlot(seed,quality,opts);
    return null;
  }
  return {generate,N};
})();




// ===== bohemia_powergrid.js =====
// BOHEMIA POWER GRID (7/14/26) — CLUSTERED POWER LAW as engine code.
// Streetlights fail by CIRCUIT (feeder death + copper theft), never
// alternating. 12% of circuits live (tunable). Every live circuit is
// OWNED: settlement / faction / network / solar_lone. Light = territory.
// WHERE network zones sit = Paolo's map call; this module is mechanics.
const BOH_POWERGRID=(()=>{ 
  function rng(seed){let s=seed>>>0;return function(){s=(s*1103515245+12345)>>>0;return s/4294967296;}}
  const STREETS=['arterial','street','strip','downtown','freeway','residential','beltway'];
  // circuits = contiguous same-axis street RUNS on the overmap (a feeder run).
  function buildCircuits(m,N){
    N=N||96;
    const seen=new Set(); const circuits=[];
    const isStreet=(x,y)=>{try{return STREETS.indexOf(m.at(x,y).district)>=0;}catch(e){return false;}};
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){
      if(!isStreet(x,y)||seen.has(x+','+y))continue;
      // horizontal run
      let run=[];let cx=x;
      while(cx<N&&isStreet(cx,y)&&!seen.has(cx+','+y)){run.push([cx,y]);seen.add(cx+','+y);cx++;}
      // split long runs into feeder-sized circuits (~6 cells = ~576m, real feeder scale)
      for(let i=0;i<run.length;i+=6)circuits.push(run.slice(i,i+6));
    }
    return circuits;
  }
  function powerMap(m,seed,opts){
    opts=opts||{};
    const litFraction=opts.litFraction==null?0.12:opts.litFraction;
    const weights=opts.ownerWeights||{settlement:0.55,faction:0.2,network:0.15,solar_lone:0.1};
    const r=rng((seed^0x11FE)>>>0);
    const circuits=buildCircuits(m,opts.N||96);
    const status={}; // "x,y" -> {live,owner}
    for(const c of circuits){
      const live=r()<litFraction;
      let owner=null;
      if(live){
        const roll=r(); let acc=0;
        for(const k in weights){acc+=weights[k];if(roll<acc){owner=k;break;}}
        owner=owner||'settlement';
      }
      for(const [x,y] of c)status[x+','+y]={live,owner};
    }
    return {circuits:circuits.length,
      liveCircuits:Object.values(status).filter(s=>s.live).length,
      at:(x,y)=>status[x+','+y]||{live:false,owner:null}};
  }
  return {buildCircuits,powerMap};
})();


if(typeof module!=='undefined')module.exports={BOH_LIGHT,BOH_DAYCYCLE,BOH_SLICE,BOH_BLOCKGEN,BOH_OMBRIDGE,BOH_PLOTGEN,BOH_POWERGRID};
