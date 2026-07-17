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
    let cwX=-1, cwW=0;
    if(hasIntersection){
      const cw=r()<0.8?1:2, cx=2+Math.floor(r()*(W-6));
      cwX=cx; cwW=cw;
      for(let y=L.sidewalk;y<H-L.sidewalk;y++)for(let i=0;i<cw;i++){
        const c=grid[y][cx+i];
        // A crosswalk is perpendicular BY DEFINITION (law rule 3). It must not
        // keep the with-axis line colour it inherited from the row underneath,
        // or the renderer draws a lane stripe running through the crossing.
        c.g='crosswalk'; c.color=null; c.axis='NS';
      }
    }
    // TURN POCKETS (7/17, markings bank APPROVED): at intersections, the
    // innermost lane(s) of each approach carry a left-turn pocket ending one
    // cell before the crosswalk; arterials (lanes>=3) run DUAL left pockets
    // plus a right pocket on the outer lane; 4-lane runs go TRIPLE (researched
    // Vegas anatomy, act-1 gap queue closed 7/17). Markings are cell.mk; the
    // renderer maps mk -> BOHEMIA_MARKING_BANK classes (arrows WHITE, per the
    // LINE COLOR LAW; the yellow lives only in twlt border tiles).
    let pocketsLeft=0,pocketsRight=0;const PL=6;
    if(hasIntersection){
      const laneRowsOf=d=>{const out=[];L.rows.forEach((rw,i)=>{if(rw.t==='lane'&&rw.dir===d)out.push(i);});return out;};
      const nLeft=L.lanes>=4?3:(L.lanes>=3?2:1);
      const nRight=L.lanes>=3?1:0;
      const mark=(y,x0,x1,arrow)=>{
        for(let x=Math.max(1,x0);x<=Math.min(W-2,x1);x++){
          const c=grid[y][x];
          if(c.g!=='lane')continue;
          c.mk=((x-x0)%3===1)?arrow:'pocket_line';
        }
      };
      const A=laneRowsOf('A'),B=laneRowsOf('B');
      // A approaches from the west of the crossing; B from the east.
      for(let p=0;p<nLeft;p++){
        const ya=A[A.length-1-p*LANE_W], yb=B[p*LANE_W];
        if(ya!=null&&cwX-1-PL>=1){mark(ya,cwX-PL,cwX-1,'turn_arrow_left');pocketsLeft++;}
        if(yb!=null&&cwX+cwW+PL<=W-2){mark(yb,cwX+cwW,cwX+cwW+PL-1,'turn_arrow_left');pocketsLeft++;}
      }
      for(let p=0;p<nRight;p++){
        const ya=A[p*LANE_W], yb=B[B.length-1-p*LANE_W];
        if(ya!=null&&cwX-1-PL>=1){mark(ya,cwX-PL,cwX-1,'turn_arrow_right');pocketsRight++;}
        if(yb!=null&&cwX+cwW+PL<=W-2){mark(yb,cwX+cwW,cwX+cwW+PL-1,'turn_arrow_right');pocketsRight++;}
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
    return {type:'street',W,H,grid,meta:{lanes:L.lanes,median:L.median,sidewalk:L.sidewalk,intersection:hasIntersection,wrecks:placed,pocketsLeft,pocketsRight,pocketLen:PL,crosswalkX:cwX,crosswalkW:cwW}};
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
if(typeof module!=='undefined')module.exports=BOH_BLOCKGEN;
