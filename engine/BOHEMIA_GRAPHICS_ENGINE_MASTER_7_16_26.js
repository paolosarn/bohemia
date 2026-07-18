/* BUNDLE FOR PROJECT STORAGE — reference copy. Modules are IIFE-scoped and
   were verified individually. To run, split on the FILE: markers.
   NOT node --check clean BY DESIGN: it is a concatenation, not a module. */
==============================================================================
BOHEMIA GRAPHICS ENGINE — ALL MODULES
Rebuilt 7/16/26 from canonical standalone modules (ENGINE SYNC LAW).
14 modules. Every md5 regenerated from disk at build time; zero drift.
14 files bundled.
==============================================================================



==============================================================================
### FILE: BOHEMIA_AGENT_LOOK_7_10_26.js
### MD5: 2a107f362e77ccadc75b192f2bf23b8e  | 0.8 KB
==============================================================================

// BOHEMIA — CYBERNETIC HOMELESS AGENT LOOK (7/10/26)
// extends BOHEMIA_SKIN_PALETTES_WORLD_7_10_26.js (SKIN_TONES_WORLD).
// SKIN_TONES_HOMELESS is DEAD (7/10 verdict) — it does not live there or anywhere.

// purple iris — same [r,g,b] format as the alpha's IRIS array.
// APPEND to IRIS (do not replace); agents index it, civilians never do.
const AGENT_IRIS=[168,96,200];

// REVEAL VISUAL: v1+v2 renders KILLED (Paolo 7/10/26). Colors kept as palette refs ONLY;
// the reveal look redesigns inside the Universal Reveal System w/ fiber-optic glow direction.
const NEUROLINK_GLOW={core:[196,84,160],halo:[122,42,96]};

// agent visual state machine
const AGENT_STATE={INTACT:0,REVEALED:1,DEAD:2};
// transition: INTACT -> REVEALED on first surviving hit; any -> DEAD on death.
// REVEALED persists for the rest of the fight. glow dies with the agent.


==============================================================================
### FILE: BOHEMIA_AGENT_RAGS_7_10_26.js
### MD5: 07b1bf471506855d187454a53df540e9  | 1.1 KB
==============================================================================

// BOHEMIA — AGENT RAG OUTFITS (7/10/26)
// tints sampled from the categorized world tiles (BROWN+NEUTRAL families, dark band)
// format matches G.tints exactly: {jacket,shirt,pants,shoes:[r,g,b]}
// apply via existing tintRamp() — luminance preserved, outlines untouched
const AGENT_RAG_OUTFITS=[{"jacket": [72, 57, 28], "shirt": [51, 47, 44], "pants": [52, 35, 20], "shoes": [42, 36, 27]}, {"jacket": [36, 32, 31], "shirt": [51, 47, 44], "pants": [76, 76, 75], "shoes": [57, 53, 49]}, {"jacket": [53, 51, 48], "shirt": [56, 42, 20], "pants": [37, 35, 33], "shoes": [49, 47, 45]}, {"jacket": [60, 39, 28], "shirt": [60, 58, 56], "pants": [94, 87, 85], "shoes": [53, 51, 48]}, {"jacket": [41, 40, 39], "shirt": [83, 30, 17], "pants": [40, 38, 37], "shoes": [49, 43, 51]}, {"jacket": [72, 57, 28], "shirt": [70, 56, 38], "pants": [55, 55, 54], "shoes": [49, 47, 45]}, {"jacket": [69, 61, 48], "shirt": [92, 64, 28], "pants": [69, 61, 48], "shoes": [37, 35, 33]}, {"jacket": [59, 55, 61], "shirt": [53, 51, 49], "pants": [42, 40, 37], "shoes": [48, 52, 55]}];
// agents roll one at spawn: G.tints=AGENT_RAG_OUTFITS[rng*8|0]


==============================================================================
### FILE: BOHEMIA_SKIN_PALETTES_WORLD_7_10_26.js
### MD5: bb9305a02134ff2de975ede6e85b782c  | 0.9 KB
==============================================================================

// BOHEMIA WORLD-GRADED SKIN PALETTES (7/10/26)
// graded against measured world ambient RGB(67,61,56), world sat 0.23
// same structure as SKIN_TONES: [name,[light,mid,dark]] — drop-in replacement

const SKIN_TONES_WORLD=[["pale",[[188,160,138],[153,127,108],[112,94,84]]],["fair",[[203,169,140],[167,137,113],[124,102,87]]],["olive",[[186,151,116],[154,123,94],[114,94,78]]],["tan",[[179,140,103],[147,115,87],[109,88,71]]],["bronze",[[156,118,87],[118,96,78],[90,70,56]]],["brown",[[118,94,78],[94,74,59],[71,54,44]]],["deep",[[83,66,54],[65,51,42],[48,38,31]]],["ebony",[[66,51,43],[49,38,31],[35,26,22]]],["onyx",[[51,40,34],[37,28,24],[26,19,16]]]];

// SKIN_TONES_HOMELESS: KILLED by Paolo verdict 7/10/26 (graveyard). Agents use SKIN_TONES_WORLD + rags.

// PROPOSAL (Paolo's call): cybernetic subdermal tell — faint amalgam-magenta accents
// subdermal RGB(122,42,96) / glint RGB(196,84,160)
const CYBER_TELL={subdermal:[122,42,96],glint:[196,84,160]};


==============================================================================
### FILE: bohemia_blockgen.js
### MD5: fb29897e26361a70ffad487d5d137c50  | 21.2 KB
==============================================================================

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
  // INTERSECTION (7/17, Paolo: "is it time I can see a proper intersection").
  // Two streets CROSSING, per the researched Vegas anatomy: the BOX stays
  // clean (no lane paint, no median inside), crosswalks guard all four
  // approaches at the box edges, medians stop at the crosswalks, and each
  // approach's innermost lane carries a left-turn pocket ending one cell
  // before its crosswalk (arrows face travel; the baker resolves rotation).
  // Corners are sidewalk with lamps. Cell fields: g (role), o ('ew'|'ns'),
  // dir, mk. LINE COLOR LAW: yellow only on median cells; pockets are white.
  function genIntersection(seed,W,opts){
    const o=opts||{};const r=rng(seed);
    const lanesEW=o.lanesEW!=null?o.lanesEW:2, lanesNS=o.lanesNS!=null?o.lanesNS:2;
    const bandEW=2*(lanesEW*LANE_W+(lanesEW-1))+1;  // lanes+divs both dirs + median
    const bandNS=2*(lanesNS*LANE_W+(lanesNS-1))+1;
    const cw=1;
    const H=o.H||(bandEW+2*(cw+8));   // auto-size: room for crosswalks + pockets
    const PLx=Math.max(0,Math.min(6,(((W-bandNS)/2)|0)-cw-2));   // EW approaches
    const PLy=Math.max(0,Math.min(6,(((H-bandEW)/2)|0)-cw-2));   // NS approaches
    const r0=(H-bandEW)>>1, r1=r0+bandEW-1;
    const c0=(W-bandNS)>>1, c1=c0+bandNS-1;
    const medRow=r0+(bandEW>>1), medCol=c0+(bandNS>>1);
    const grid=[];
    for(let y=0;y<H;y++){const row=[];
      for(let x=0;x<W;x++)row.push({g:'side',o:null,dir:null,color:null,axis:null,mk:null,props:[]});
      grid.push(row);}
    const laneRowsEW=[],laneColsNS=[];
    const halfEW=bandEW>>1, halfNS=bandNS>>1;
    // side A counts up to the median; side B restarts AFTER it, so both sides
    // put LANES against the median (the real anatomy; a div there was the bug)
    const divAt=(i,half)=>{const l=i<half?i:i-half-1;return (l%(LANE_W+1))===LANE_W;};
    for(let i=0;i<bandEW;i++){const y=r0+i;
      if(y===medRow)continue;
      const isDiv=divAt(i,halfEW);
      for(let x=0;x<W;x++){const c=grid[y][x];c.o='ew';
        c.g=isDiv?'lane_div':'lane';
        c.dir=isDiv?null:(y<medRow?'A':'B');
        if(isDiv){c.color='white_lane';c.axis='road';}}
      if(!isDiv)laneRowsEW.push(y);}
    for(let x=0;x<W;x++){const c=grid[medRow][x];c.o='ew';c.g='median';c.color='yellow_direction';c.axis='road';c.dir=null;}
    for(let j=0;j<bandNS;j++){const x=c0+j;
      if(x===medCol){for(let y=0;y<H;y++){const c=grid[y][x];if(c.g==='side'){c.o='ns';c.g='median';c.color='yellow_direction';c.axis='road';}}continue;}
      const isDiv=divAt(j,halfNS);
      for(let y=0;y<H;y++){const c=grid[y][x];
        if(c.g!=='side')continue;         // EW band + box already claimed
        c.o='ns';c.g=isDiv?'lane_div':'lane';
        c.dir=isDiv?null:(x<medCol?'A':'B');
        if(isDiv){c.color='white_lane';c.axis='road';}}
      if(!isDiv)laneColsNS.push(x);}
    // THE BOX: rows r0..r1 x cols c0..c1 -> clean asphalt, nothing painted
    for(let y=r0;y<=r1;y++)for(let x=c0;x<=c1;x++){const c=grid[y][x];
      c.g='box';c.o=null;c.dir=null;c.color=null;c.axis=null;c.mk=null;}
    // CROSSWALKS at the four box edges (never inside the box)
    for(let y=r0;y<=r1;y++){grid[y][c0-cw].g='crosswalk';grid[y][c0-cw].o='ew';grid[y][c0-cw].color=null;
      grid[y][c1+cw].g='crosswalk';grid[y][c1+cw].o='ew';grid[y][c1+cw].color=null;}
    for(let x=c0;x<=c1;x++){grid[r0-cw][x].g='crosswalk';grid[r0-cw][x].o='ns';grid[r0-cw][x].color=null;
      grid[r1+cw][x].g='crosswalk';grid[r1+cw][x].o='ns';grid[r1+cw][x].color=null;}
    // POCKETS: innermost lane per approach, ending one cell before its crosswalk
    const innerA=medRow-1, innerB=medRow+1;   // EW inner lane rows
    const innerL=medCol-1, innerR=medCol+1;   // NS inner lane cols
    const mark=(cells,arrow)=>{cells.forEach(([x,y],i)=>{const c=grid[y][x];
      if(c.g!=='lane')return;c.mk=(i%3===1)?arrow:'pocket_edge';});};
    const west=[],east=[],north=[],south=[];
    for(let k=0;k<PLx;k++){west.push([c0-cw-1-k,innerB]);east.push([c1+cw+1+k,innerA]);}
    for(let k=0;k<PLy;k++){north.push([innerL,r0-cw-1-k]);south.push([innerR,r1+cw+1+k]);}
    mark(west,'turn_arrow_left_e');mark(east,'turn_arrow_left_w');
    mark(north,'turn_arrow_left_s');mark(south,'turn_arrow_left_n');
    // corner lamps (LAMP HEIGHT LAW: majors get 4)
    const lampH=(Math.max(lanesEW,lanesNS)>=3)?4:3;
    for(const [ly,lx] of [[r0-cw-1,c0-cw-1],[r0-cw-1,c1+cw+1],[r1+cw+1,c0-cw-1],[r1+cw+1,c1+cw+1]]){
      if(grid[ly]&&grid[ly][lx]&&grid[ly][lx].g==='side')placeProp(grid[ly][lx],{p:'street_lamp',hTiles:lampH,state:'dead'});}
    return {type:'intersection',W,H,grid,meta:{lanesEW,lanesNS,box:[c0,r0,c1,r1],
      crosswalks:4,pocketLenX:PLx,pocketLenY:PLy,medRow,medCol}};
  }
  const RECIPES={
    intersection:(seed,W,o)=>genIntersection(seed,W,o),
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


==============================================================================
### FILE: bohemia_daycycle.js
### MD5: d3ca07d6a97cfa2cb156a8eb4dad2f08  | 1.2 KB
==============================================================================

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
if(typeof module!=='undefined')module.exports=BOH_DAYCYCLE;


==============================================================================
### FILE: bohemia_engine_graphics_7_14_26.js
### MD5: 7a387d58979e9fbc355fc9b2a0662e47  | 47.0 KB
==============================================================================

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
  // INTERSECTION (7/17, Paolo: "is it time I can see a proper intersection").
  // Two streets CROSSING, per the researched Vegas anatomy: the BOX stays
  // clean (no lane paint, no median inside), crosswalks guard all four
  // approaches at the box edges, medians stop at the crosswalks, and each
  // approach's innermost lane carries a left-turn pocket ending one cell
  // before its crosswalk (arrows face travel; the baker resolves rotation).
  // Corners are sidewalk with lamps. Cell fields: g (role), o ('ew'|'ns'),
  // dir, mk. LINE COLOR LAW: yellow only on median cells; pockets are white.
  function genIntersection(seed,W,opts){
    const o=opts||{};const r=rng(seed);
    const lanesEW=o.lanesEW!=null?o.lanesEW:2, lanesNS=o.lanesNS!=null?o.lanesNS:2;
    const bandEW=2*(lanesEW*LANE_W+(lanesEW-1))+1;  // lanes+divs both dirs + median
    const bandNS=2*(lanesNS*LANE_W+(lanesNS-1))+1;
    const cw=1;
    const H=o.H||(bandEW+2*(cw+8));   // auto-size: room for crosswalks + pockets
    const PLx=Math.max(0,Math.min(6,(((W-bandNS)/2)|0)-cw-2));   // EW approaches
    const PLy=Math.max(0,Math.min(6,(((H-bandEW)/2)|0)-cw-2));   // NS approaches
    const r0=(H-bandEW)>>1, r1=r0+bandEW-1;
    const c0=(W-bandNS)>>1, c1=c0+bandNS-1;
    const medRow=r0+(bandEW>>1), medCol=c0+(bandNS>>1);
    const grid=[];
    for(let y=0;y<H;y++){const row=[];
      for(let x=0;x<W;x++)row.push({g:'side',o:null,dir:null,color:null,axis:null,mk:null,props:[]});
      grid.push(row);}
    const laneRowsEW=[],laneColsNS=[];
    const halfEW=bandEW>>1, halfNS=bandNS>>1;
    // side A counts up to the median; side B restarts AFTER it, so both sides
    // put LANES against the median (the real anatomy; a div there was the bug)
    const divAt=(i,half)=>{const l=i<half?i:i-half-1;return (l%(LANE_W+1))===LANE_W;};
    for(let i=0;i<bandEW;i++){const y=r0+i;
      if(y===medRow)continue;
      const isDiv=divAt(i,halfEW);
      for(let x=0;x<W;x++){const c=grid[y][x];c.o='ew';
        c.g=isDiv?'lane_div':'lane';
        c.dir=isDiv?null:(y<medRow?'A':'B');
        if(isDiv){c.color='white_lane';c.axis='road';}}
      if(!isDiv)laneRowsEW.push(y);}
    for(let x=0;x<W;x++){const c=grid[medRow][x];c.o='ew';c.g='median';c.color='yellow_direction';c.axis='road';c.dir=null;}
    for(let j=0;j<bandNS;j++){const x=c0+j;
      if(x===medCol){for(let y=0;y<H;y++){const c=grid[y][x];if(c.g==='side'){c.o='ns';c.g='median';c.color='yellow_direction';c.axis='road';}}continue;}
      const isDiv=divAt(j,halfNS);
      for(let y=0;y<H;y++){const c=grid[y][x];
        if(c.g!=='side')continue;         // EW band + box already claimed
        c.o='ns';c.g=isDiv?'lane_div':'lane';
        c.dir=isDiv?null:(x<medCol?'A':'B');
        if(isDiv){c.color='white_lane';c.axis='road';}}
      if(!isDiv)laneColsNS.push(x);}
    // THE BOX: rows r0..r1 x cols c0..c1 -> clean asphalt, nothing painted
    for(let y=r0;y<=r1;y++)for(let x=c0;x<=c1;x++){const c=grid[y][x];
      c.g='box';c.o=null;c.dir=null;c.color=null;c.axis=null;c.mk=null;}
    // CROSSWALKS at the four box edges (never inside the box)
    for(let y=r0;y<=r1;y++){grid[y][c0-cw].g='crosswalk';grid[y][c0-cw].o='ew';grid[y][c0-cw].color=null;
      grid[y][c1+cw].g='crosswalk';grid[y][c1+cw].o='ew';grid[y][c1+cw].color=null;}
    for(let x=c0;x<=c1;x++){grid[r0-cw][x].g='crosswalk';grid[r0-cw][x].o='ns';grid[r0-cw][x].color=null;
      grid[r1+cw][x].g='crosswalk';grid[r1+cw][x].o='ns';grid[r1+cw][x].color=null;}
    // POCKETS: innermost lane per approach, ending one cell before its crosswalk
    const innerA=medRow-1, innerB=medRow+1;   // EW inner lane rows
    const innerL=medCol-1, innerR=medCol+1;   // NS inner lane cols
    const mark=(cells,arrow)=>{cells.forEach(([x,y],i)=>{const c=grid[y][x];
      if(c.g!=='lane')return;c.mk=(i%3===1)?arrow:'pocket_edge';});};
    const west=[],east=[],north=[],south=[];
    for(let k=0;k<PLx;k++){west.push([c0-cw-1-k,innerB]);east.push([c1+cw+1+k,innerA]);}
    for(let k=0;k<PLy;k++){north.push([innerL,r0-cw-1-k]);south.push([innerR,r1+cw+1+k]);}
    mark(west,'turn_arrow_left_e');mark(east,'turn_arrow_left_w');
    mark(north,'turn_arrow_left_s');mark(south,'turn_arrow_left_n');
    // corner lamps (LAMP HEIGHT LAW: majors get 4)
    const lampH=(Math.max(lanesEW,lanesNS)>=3)?4:3;
    for(const [ly,lx] of [[r0-cw-1,c0-cw-1],[r0-cw-1,c1+cw+1],[r1+cw+1,c0-cw-1],[r1+cw+1,c1+cw+1]]){
      if(grid[ly]&&grid[ly][lx]&&grid[ly][lx].g==='side')placeProp(grid[ly][lx],{p:'street_lamp',hTiles:lampH,state:'dead'});}
    return {type:'intersection',W,H,grid,meta:{lanesEW,lanesNS,box:[c0,r0,c1,r1],
      crosswalks:4,pocketLenX:PLx,pocketLenY:PLy,medRow,medCol}};
  }
  const RECIPES={
    intersection:(seed,W,o)=>genIntersection(seed,W,o),
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


==============================================================================
### FILE: bohemia_graphics_tests.js
### MD5: 992872fa8e8afe2e980b6071aed5a835  | 13.8 KB
==============================================================================

// BOHEMIA GRAPHICS TESTS — one command, every module (7/14/26)
const E=require('./bohemia_engine_graphics_7_14_26.js');
const {BOH_LIGHT,BOH_DAYCYCLE,BOH_SLICE,BOH_BLOCKGEN,BOH_OMBRIDGE}=E;
let pass=0,fail=0;const T=(n,c)=>{c?pass++:(fail++,console.error('FAIL',n));};
// LIGHT (5)
{const p=BOH_LIGHT.makePass(100,100);
p.setEmitters([{x:5,y:5,color:[255,180,100],r_cells:4,wobAmp:0.22}]);
T('light: level at emitter',p.levelAt(5,5,0)>0.9);
T('light: ambient far',Math.abs(p.levelAt(50,50,0)-3.52/16)<0.01);
T('light: falloff',p.levelAt(6,5,0)>p.levelAt(8,5,0));
T('light: wobble',p.levelAt(8,5,0.25)!==p.levelAt(8,5,0.75));
p.setAmbient([4,4,4]);T('light: ambient settable',Math.abs(p.levelAt(50,50,0)-0.25)<0.01);}
// DAYCYCLE (7)
{const D=BOH_DAYCYCLE;
T('day: midnight = night',JSON.stringify(D.ambientAt(0))===JSON.stringify(D.NIGHT));
T('day: noon = day',JSON.stringify(D.ambientAt(0.5))===JSON.stringify(D.DAY));
T('day: golden warm',D.ambientAt(0.75)[0]>D.ambientAt(0.75)[2]);
T('day: night floor',D.ambientAt(0.95)[2]>=D.NIGHT[2]-1e-9);
T('day: continuous',Math.abs(D.ambientAt(0.1999)[0]-D.ambientAt(0.2001)[0])<0.2);
T('day: wraps',JSON.stringify(D.ambientAt(1.25))===JSON.stringify(D.ambientAt(0.25)));
T('day: nightish',D.isNightish(0.05)&&!D.isNightish(0.5));}
// SLICE CORE (8) + WORLD CLOCK (4)
{const S=BOH_SLICE;const clock=S.makeClock(0);
T('slice: beat math',clock.beatOf(1499)===2&&clock.beatOf(1500)===3);
const world={passable:(x,y)=>!(x===2&&y===0)};
const m=S.makeMover({x:0,y:0});m.hold([1,0],0);
m.tick(500,clock,world);T('slice: step on beat',m.st.x===1);
m.tick(600,clock,world);T('slice: no mid-beat step',m.st.x===1);
m.tick(1000,clock,world);T('slice: blocked refused',m.st.x===1);
m.release();m.hold([0,1],1000);m.tick(3600,clock,world);
T('slice: run law 2 cells',m.st.y===2);
const d=S.makeDoor(5,5);T('slice: closed blocks',d.blocks(5,5));
d.toggle(0);for(let t=0;t<3000;t+=125)d.tick(t);
T('slice: opens f>=5 passable',d.f===8&&d.passable());
const tc=S.makeTurnClock();
const wm=S.makeMover({x:10,y:10});const w=S.makeWanderer(wm,42);
for(let i=0;i<50;i++)w.tick(0,tc,{passable:()=>true});
T('slice: I-move-you-move (frozen)',wm.st.x===10&&wm.st.y===10);
const wc=S.makeWorldClock(0.917);
T('clock: 22:00 start',wc.clockText()==='22:00');
for(let i=0;i<128;i++)wc.stepWalk();
T('clock: 128 steps = 4 min',Math.abs(wc.seconds()-0.917*86400-243.2)<0.01);
const wc2=S.makeWorldClock(0);for(let i=0;i<32;i++)wc2.stepWalk();
T('clock: 32 steps ~ 1 min',Math.abs(wc2.seconds()-60.8)<0.01);
const wc3=S.makeWorldClock(0);wc3.stepRun(2);
T('clock: run cost',Math.abs(wc3.seconds()-1.8)<1e-9);}
// BLOCKGEN (6 core + terrain)
{const G=BOH_BLOCKGEN;
const b=G.generate('street',201,24,{lanes:2,intersection:true});
T('gen: street builds',b.grid.length>0&&b.meta.lanes===2);
T('gen: freeway 5',G.generate('freeway',1,24,{}).meta.lanes===5);
T('gen: residential 1+1',G.generate('residential',1,24,{}).meta.lanes===1);
T('gen: deterministic',JSON.stringify(G.generate('street',7,24,{}))===JSON.stringify(G.generate('street',7,24,{})));
const de=G.generate('desert',42,24,{});
T('gen: desert passable',de.grid.every(r=>r.every(c=>c.props.every(p=>!p.impassable))));
T('gen: mountain dense',G.generate('mountain',42,24,{}).grid.flat().filter(c=>c.props.length).length>0);}
// BRIDGE (5, needs canonical overmap)
{const O=require('./bohemia_overmap.js');
const G=BOH_BLOCKGEN,B=BOH_OMBRIDGE;
const m=O.buildOvermap(12345);
const strip=B.blockFor(m.at(51,29),G);
T('bridge: strip 3/dir sidewalk3',strip.meta.lanes===3&&strip.meta.sidewalk===3);
T('bridge: freeway 5/dir',B.blockFor(m.at(21,0),G).meta.lanes===5);
T('bridge: arterial researched 3',B.blockFor(m.at(23,18),G).meta.lanes>=2);
T('bridge: deterministic',JSON.stringify(B.blockFor(m.at(23,18),G))===JSON.stringify(B.blockFor(m.at(23,18),G)));
T('bridge: desert covered',!B.blockFor(m.at(19,3),G).pending);}
// PLOTGEN (5 in bundle)
{const P=E.BOH_PLOTGEN;
T('plot: nice suburb walled',P.generate('suburb',777,3).meta.walled===true);
T('plot: rough suburb open',P.generate('suburb',777,0).meta.walled===false);
T('plot: gates passable',P.generate('suburb',777,3).grid[127].filter(c=>c.props.some(p=>p.p==='gate_open')).every(c=>c.props.every(p=>!p.impassable)));
T('plot: parking fronts stores toward street',(()=>{const c=P.generate('commercial',555,2,{streetEdges:['S']});return c.grid[c.H-3][60].g==='parking_concrete'&&c.grid[c.H-30][60].g==='storefront_pad';})());
T('plot: deterministic',JSON.stringify(P.generate('commercial',9,2))===JSON.stringify(P.generate('commercial',9,2)));}
// MERGE LAW (4 in bundle)
{const P=E.BOH_PLOTGEN,B=E.BOH_OMBRIDGE;
const m2=P.generate('suburb',777,3,{shape:{cw:2,ch:1}});
T('merge: 2x1 union ring',m2.W===256&&!m2.grid[64][128].props.some(p=>p.p==='perimeter_wall'));
T('merge: entries scale with frontage',m2.meta.entries.length>=2&&m2.meta.entries.every(e=>e.edge==='S'));
T('merge: commercial apron faces street',(()=>{const c=P.generate('commercial',555,2,{shape:{cw:2,ch:1},streetEdges:['S']});return c.grid[c.H-3][250].g==='parking_concrete'&&c.grid[c.H-30][200].g==='storefront_pad';})());
const O=require('./bohemia_overmap.js');const om=O.buildOvermap(12345);
T('merge: cluster deterministic',JSON.stringify(B.clusterFor(om,33,6))===JSON.stringify(B.clusterFor(om,33,6)));}
// PLOTGEN v2 FULL (folded 7/14)
{const P=E.BOH_PLOTGEN;
const p=P.generate('suburb',900,2,{streetEdges:['S']});
T('v2: one wall style per community',(()=>{const s=new Set();p.grid.flat().forEach(c=>c.props.forEach(q=>{if(q.p==='perimeter_wall')s.add(q.style);}));return s.size===1;})());
T('v2: entries only street edges',p.meta.entries.every(e=>e.edge==='S'));
T('v2: entrance is suburb_road',p.meta.entries[0].cells.every(([x,y])=>p.grid[y][x].g==='suburb_road'));
T('v2: road stub inward',p.grid[p.H-3][p.meta.entries[0].cells[0][0]].g==='suburb_road');
T('v2: q2 not gated',!p.grid.flat().some(c=>c.props.some(q=>q.p==='gate_hardware')));
T('v2: rich gated',P.generate('suburb',901,4,{streetEdges:['S']}).meta.gated===true);
T('v2: wall style varies between plots',P.generate('suburb',902,2,{}).meta.wallStyle!==P.generate('suburb',903,2,{}).meta.wallStyle);
T('v2: walls 2-tall',p.grid.flat().every(c=>c.props.every(q=>q.p!=='perimeter_wall'||q.hTiles===2)));
const cN=P.generate('commercial',700,2,{streetEdges:['N']});
T('v2: commercial apron flips N',cN.grid[2][60].g==='parking_concrete'&&cN.grid[30][60].g==='storefront_pad');
const cE=P.generate('commercial',700,2,{streetEdges:['E']});
T('v2: commercial apron flips E',cE.grid[60][cE.W-3].g==='parking_concrete');
const i=P.generate('industrial',808,2,{streetEdges:['S']});
T('v2: industrial drive faces street',i.grid[i.H-5][60].g==='drive_concrete'&&i.grid[i.H-30][60].g==='shed_pad');
T('v2: industrial fence cut passable',i.meta.entries[0].cells.every(([x,y])=>i.grid[y][x].props.every(p=>!p.impassable)));
T('v2: forceGated override',P.generate('suburb',1,0,{forceGated:true,forceWalled:true}).meta.gated===true);
T('v2: forceWalled false override',P.generate('suburb',1,4,{forceWalled:false,forceGated:false}).meta.walled===false);}
// BIG ACREAGE + AIRFIELD (folded)
{const G=E.BOH_BLOCKGEN;
const w=G.generate('wash',5,24,{});
T('wash: floor+slope+service',w.grid[5].some(c=>c.g==='wash_floor')&&w.grid[5].some(c=>c.g==='wash_slope')&&w.grid[5].filter(c=>c.g==='wash_service_road').length===1);
const s=G.generate('solar',5,24,{});
T('solar: rows+aisles+fence',s.grid[5].some(c=>c.g==='panel_row')&&s.grid[0].every(c=>c.props.some(p=>p.p==='fence')));
const f=G.generate('farm',5,24,{});
T('farm: lanes every 8',f.grid[0].every(c=>c.g==='farm_lane')&&f.grid[3].every(c=>c.g==='field_row'));
const a=G.generate('airfield',5,24,{});
T('airfield: runway+centerline+apron',a.grid.some((r,y)=>r[0].g==='runway'&&a.grid[y+1][0].g==='runway_centerline')&&a.grid[a.H-2].every(c=>c.g==='apron_concrete'));
T('terrain regressions',G.generate('desert',42,24,{}).meta.type==='desert'&&G.generate('mountain',42,24,{}).meta.type==='mountain');}
// BRIDGE FULL COVERAGE (folded)
{const O=require('./bohemia_overmap.js');
const G=E.BOH_BLOCKGEN,B=E.BOH_OMBRIDGE,P=E.BOH_PLOTGEN;
const m=O.buildOvermap(12345);
const finds={};
for(let y=0;y<96;y++)for(let x=0;x<96;x++){const d=m.at(x,y).district;if(!finds[d])finds[d]=[x,y];}
for(const d of ['wash','solar','farm','airport','airbase'])
  T('bridge covers '+d,!B.blockFor(m.at(finds[d][0],finds[d][1]),G).pending);
for(const d of ['gated','estate','trailer','industrial','warehouse'])
  T('plotFor covers '+d,!!B.plotFor(m,finds[d][0],finds[d][1],P).plot);
T('plotFor entries obey street edges',(()=>{const r=B.plotFor(m,33,6,P);return r.plot.meta.entries.every(e=>r.plot.meta.streetEdges.includes(e.edge));})());}
// PARKING GEOMETRY LAW (blessed 7/14)
{const P=E.BOH_PLOTGEN;
const c=P.generate('commercial',700,2,{streetEdges:['S']});
T('parking: aisle nearest street',[0,1,2,3].every(d=>c.grid[c.H-1-d][30].g==='parking_concrete'));
T('parking: stall lines every 3rd shared',(()=>{const d=5;for(let b=0;b<30;b++){const g=c.grid[c.H-1-d][b].g;if(b%3===0&&g!=='stall_line')return false;if(b%3!==0&&g!=='parking_concrete')return false;}return true;})());}
// CENTER TURN LANE (7/14)
{const G=E.BOH_BLOCKGEN;
const b=G.generate('street',412,24,{lanes:3,median:1,centerTurn:true});
T('twlt: rows painted',b.grid.flat().some(c=>c.g==='twlt_T')&&b.grid.flat().some(c=>c.g==='twlt_B'));
T('twlt: median regression intact',(()=>{const p=G.generate('street',412,24,{lanes:3,median:1});return p.grid.flat().some(c=>c.g==='median');})());}
// LAMP HEIGHT + RARE BARRELS (7/14)
{const G=E.BOH_BLOCKGEN;
const b=G.generate('street',555,26,{lanes:3,median:1,lampSpacing:7});
T('lamp: arterial 4-tall dead',b.grid.flat().flatMap(c=>c.props.filter(p=>p.p==='street_lamp')).every(p=>p.hTiles===4&&p.state==='dead'));
T('lamp: barrels rare sidewalk-only',(()=>{let ok=true,n=0;b.grid.forEach(row=>row.forEach(c=>{c.props.forEach(p=>{if(p.p==='fire_barrel'){n++;if(c.g!=='side')ok=false;}});}));return ok&&n>0;})());}
// POWER GRID (clustered power law, 7/14)
{const O=require('./bohemia_overmap.js');
const P=E.BOH_POWERGRID;
const m=O.buildOvermap(12345);
const pm=P.powerMap(m,777,{});
T('power: circuits exist',pm.circuits>100);
T('power: deterministic',JSON.stringify(P.powerMap(m,777,{}).at(16,3))===JSON.stringify(P.powerMap(m,777,{}).at(16,3)));
T('power: live circuits owned',(()=>{for(let y=0;y<96;y+=3)for(let x=0;x<96;x+=3){const s=pm.at(x,y);if(s.live&&!s.owner)return false;}return true;})());}
// TILEPOOL — weather rarity law + 30-year marking wash (7/16)
{const TP=require('./bohemia_tilepool.js');
const entries=[];
for(let i=0;i<6;i++)entries.push({key:'p'+i,weathered:false});
for(let i=0;i<3;i++)entries.push({key:'w'+i,weathered:true});
const pool=TP.makePool(entries);
T('pool: law share is 12%',Math.abs(pool.share-0.12)<1e-9);
// 88/12 must hold across a real field of cells, not per family
{let w=0,n=0;for(let y=0;y<128;y++)for(let x=0;x<128;x++){n++;if(pool.pick(x,y,99).weathered)w++;}
 const frac=w/n;
 T('pool: weathered lands near 12%',Math.abs(frac-0.12)<0.02);}
T('pool: deterministic per cell',pool.pick(9,9,5).key===pool.pick(9,9,5).key);
T('pool: seed changes the field',(()=>{let d=0;for(let i=0;i<200;i++)if(pool.pick(i,3,1).key!==pool.pick(i,3,2).key)d++;return d>50;})());
// UNIFORM SIBLING DRAW BANNED: one semantic across a surface must not resolve
// to one tile, and weathered must never arrive as a contiguous slab.
T('pool: no uniform surface draw',(()=>{const s=new Set();for(let x=0;x<64;x++)s.add(pool.pick(x,7,42).key);return s.size>=5;})());
T('pool: weathered scattered not slabbed',(()=>{let runs=0,cur=0,max=0;
  for(let x=0;x<512;x++){if(pool.pick(x,11,42).weathered){cur++;max=Math.max(max,cur);}else{if(cur)runs++;cur=0;}}
  return runs>30&&max<=6;})());
T('pool: no 3x3 weathered slab',(()=>{const W=(x,y)=>pool.pick(x,y,42).weathered;
  for(let y=0;y<128-2;y++)for(let x=0;x<128-2;x++){let all=true;
    for(let j=0;j<3&&all;j++)for(let i=0;i<3&&all;i++)if(!W(x+i,y+j))all=false;
    if(all)return false;}
  return true;})());
// seeds must RESAMPLE the field, not permute it (small seeds sharing low bits
// with x is the classic way this breaks silently)
T('pool: small seeds resample not permute',(()=>{const cnt=s=>{let c=0;
  for(let x=0;x<512;x++)if(pool.pick(x,11,s).weathered)c++;return c;};
  const a=cnt(1),b=cnt(7),c=cnt(42);
  return !(a===b&&b===c);})());
T('pool: parent-only pool legal',TP.makePool([{key:'a'},{key:'b'}]).pick(1,1,1).key!=null);
T('pool: empty parents rejected',(()=>{try{TP.makePool([{key:'w',weathered:true}]);return false;}catch(e){return true;}})());
T('pool: weights respected',(()=>{const p=TP.makePool([{key:'heavy',weight:9},{key:'light',weight:1}]);
  let h=0;for(let x=0;x<1000;x++)if(p.pick(x,0,3).key==='heavy')h++;return h>820&&h<980;})());
// 30-YEAR WASH
T('wash: law amount 0.55',Math.abs(TP.MARK_WASH-0.55)<1e-9);
T('wash: white moves 55% to asphalt',(()=>{const w=TP.washRGB([255,255,255]);const a=TP.ASPHALT_BASE;
  return Math.abs(w[0]-(255+(a[0]-255)*0.55))<1&&w[0]<255&&w[0]>a[0];})());
T('wash: yellow classified',TP.isMarkingPx(240,200,40));
T('wash: white classified',TP.isMarkingPx(238,238,235));
T('wash: asphalt not classified',!TP.isMarkingPx(62,60,58));
T('wash: dark red blood not classified',!TP.isMarkingPx(90,20,20));
T('wash: alpha never touched',(()=>{const px=[255,255,255,0, 250,210,50,255];
  const r=TP.washMarkings(px);return r.pixels[3]===0&&r.pixels[7]===255;})());
T('wash: transparent px skipped',(()=>{const px=[255,255,255,0];const r=TP.washMarkings(px);
  return r.touched===0&&r.pixels[0]===255;})());
T('wash: non-marking px untouched',(()=>{const px=[62,60,58,255];const r=TP.washMarkings(px);
  return r.touched===0&&r.pixels[0]===62;})());
T('wash: input not mutated',(()=>{const px=[255,255,255,255];TP.washMarkings(px);return px[0]===255;})());
T('wash: amount knob works',(()=>{const px=[255,255,255,255];
  const a=TP.washMarkings(px,{amount:0}).pixels[0];return a===255;})());}
console.log('GRAPHICS ENGINE TESTS:',pass,'pass /',fail,'fail');
process.exit(fail?1:0);


==============================================================================
### FILE: bohemia_light_pass.js
### MD5: 3a5d9c4c7f3320ee1f9b63b33a6e3eb0  | 2.5 KB
==============================================================================

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


==============================================================================
### FILE: bohemia_overmap_bridge.js
### MD5: fbce34f5306cf45822ea95e89041f686  | 4.7 KB
==============================================================================

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

if(typeof module!=='undefined')module.exports=BOH_OMBRIDGE;


==============================================================================
### FILE: bohemia_plotgen.js
### MD5: cebf0de84138df151fabefe844e889b2  | 10.4 KB
==============================================================================

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
if(typeof module!=='undefined')module.exports=BOH_PLOTGEN;


==============================================================================
### FILE: bohemia_powergrid.js
### MD5: 930679f35f78c1b1d9cc5d9345a477e7  | 2.2 KB
==============================================================================

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
if(typeof module!=='undefined')module.exports=BOH_POWERGRID;


==============================================================================
### FILE: bohemia_prop_scale.js
### MD5: 729979a7885c950c6a8820ad35da0a6d  | 5.3 KB
==============================================================================

// BOHEMIA PROP SCALE — ITEM SCALE LAW resolver (v2, 7/16/26)
// Paolo's 848 scale flags split on one fault line (ITEM SCALE LAW, 7/13):
//   BIG   (542) = hand objects rendered at a full cell -> render sub-cell.
//   SMALL (306) = structures rendered as 1-cell props   -> take real footprints.
//
// v1 could only act when the CALLER already knew the family, and it only knew
// what to do with 'vehicle'. So most of Paolo's 306 SMALL flags resolved to
// nothing. This is the missing middle: pack -> family -> policy. Nothing here
// invents a verdict: the flags are his, the policies are his law text, the
// classifier only reads his own pack names.
const BOH_SCALE=(function(){
  const ITEM_SCALE=0.55;                 // Paolo's law: hand objects ~0.55 cell

  // ---- pack -> family (reads Paolo's own pack names, first match wins) -----
  const FAMILY_RULES=[
    [/abandoned car|abandoned card|vehicle|car wreck/i, 'vehicle'],
    [/roof/i,                                           'roof'],
    [/broken wall|broken building wall|ruined building part|scrap wall|panel/i,'wall'],
    [/chain link|fence|palisade|wire/i,                 'fence'],
    [/dead tree|nature prop|tree/i,                     'tree'],
    [/market stall|port market/i,                       'stall'],
    [/cargo|container/i,                                'container'],
    // Everything below is a hand object / small prop by Paolo's own law text:
    // "jars, bottles, food, drinks, supplies, loot, blood splats, screens,
    //  small props".
    [/survival|jar|bottle|crate|barrel|supplies|food|drink|cafe|loot|weapon|pot|skeleton|bone|computer|screen|zombie|blood|gore|workbench|tool|trash|debris|gauge|meter|pipe|cable|wiring|furniture|fixture|camp|tent|ember|particle|light source|fire barrel|emergency|warning sign|hazard|street prop|miscellaneous|grass|ground|garden|crop|winter/i,'item'],
  ];
  function familyOf(pack){
    for(const r of FAMILY_RULES) if(r[0].test(pack)) return r[1];
    return null;                          // unmapped: reported, never guessed
  }

  // ---- family -> policy (straight out of Paolo's law text) ----------------
  // fp marked RESEARCHED = real-world dimensions at 1 cell ~ 1m, TUNABLE
  // [PENDING Paolo]. The car 2x3 is his, locked, quoted: "2x3 i told you".
  const POLICY={
    vehicle:  {mode:'FOOTPRINT', fp:[3,2], src:'PAOLO LOCKED — cars 2x3 law'},
    wall:     {mode:'SURFACE', layer:'wall', src:'law text: walls render as surface cells'},
    roof:     {mode:'SURFACE', layer:'roof', src:'law text: roofs render as surface cells'},
    fence:    {mode:'RUN',     src:'law text: fences as run pieces'},
    stall:    {mode:'FOOTPRINT', fp:[3,3], src:'RESEARCHED market stall ~3x3m [PENDING Paolo]'},
    tree:     {mode:'FOOTPRINT', fp:[2,2], src:'RESEARCHED mature canopy ~2m [PENDING Paolo]'},
    container:{mode:'FOOTPRINT', fp:[6,2], src:'RESEARCHED ISO container 6.06x2.44m [PENDING Paolo]'},
    item:     {mode:'ITEM', scale:ITEM_SCALE, src:'PAOLO LOCKED — ITEM_SCALE 0.55'},
  };

  let FIXES={},PACKFAM={};
  function load(confirmedSet){
    FIXES={};PACKFAM={};
    for(const v of confirmedSet.verdicts){
      if(v.scale_fix) FIXES[v.pack+'#'+v.idx]=v.scale_fix;
      if(PACKFAM[v.pack]===undefined) PACKFAM[v.pack]=familyOf(v.pack);
    }
    return report(confirmedSet);
  }

  // {cellW,cellH,drawScale,mode,layer} — drawScale<1 = sub-cell sprite centered
  // in the footprint. SURFACE/RUN tell the renderer this is not a prop at all:
  // it belongs to a surface layer or a fence run, per the law.
  function sizeFor(pack,idx,family,declaredFp){
    const fam=family||PACKFAM[pack]||familyOf(pack);
    const fix=FIXES[pack+'#'+idx];
    let w=(declaredFp&&declaredFp[0])||1, h=(declaredFp&&declaredFp[1])||1;
    let drawScale=1,mode='PROP',layer=null;
    const pol=POLICY[fam];

    // LAW ORDER (Paolo's rule 3): his per-tile flag overrides any default.
    if(fix&&fix.mode==='ITEM_SCALE'){                 // his explicit BIG flag
      drawScale=fix.render_scale||ITEM_SCALE; mode='ITEM';
      return {cellW:w,cellH:h,drawScale,mode,layer,family:fam};
    }
    // Otherwise the family policy rules, flagged or not. Law text: "structure
    // families NEVER render as 1-cell props" — that is a property of the
    // family, not of whether Paolo happened to flag that particular tile.
    if(!pol) return {cellW:w,cellH:h,drawScale:1,
      mode:(fix?'UNMAPPED':'PROP'),layer:null,family:fam};
    mode=pol.mode;
    if(pol.mode==='FOOTPRINT'){w=pol.fp[0];h=pol.fp[1];}
    else if(pol.mode==='SURFACE'){layer=pol.layer;w=1;h=1;}
    else if(pol.mode==='RUN'){w=1;h=1;}
    else if(pol.mode==='ITEM'){drawScale=pol.scale;}
    return {cellW:w,cellH:h,drawScale,mode,layer,family:fam};
  }

  // Coverage: does every one of Paolo's 848 flags resolve to something now?
  function report(confirmedSet){
    const r={flags:0,resolved:0,unmapped:0,byMode:{},unmappedPacks:{}};
    for(const v of confirmedSet.verdicts){
      if(!v.scale_fix) continue;
      r.flags++;
      const s=sizeFor(v.pack,v.idx,null,[1,1]);
      if(s.mode==='UNMAPPED'){r.unmapped++;r.unmappedPacks[v.pack]=(r.unmappedPacks[v.pack]||0)+1;}
      else r.resolved++;
      const k=(s.family||'?')+' -> '+s.mode;
      r.byMode[k]=(r.byMode[k]||0)+1;
    }
    return r;
  }

  return {load,sizeFor,report,familyOf,POLICY,ITEM_SCALE};
})();
if(typeof module!=='undefined')module.exports=BOH_SCALE;


==============================================================================
### FILE: bohemia_slice_core.js
### MD5: 7a1bf27029242ffdaa332bbed2ce6a5c  | 4.4 KB
==============================================================================

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


==============================================================================
### FILE: bohemia_transitions.js
### MD5: 8495bdba6ba084a66bc0d5904b9e1cf3  | 1.6 KB
==============================================================================

// BOHEMIA transitions — dual-grid corner sampling (render contract layer 2)
// Consumes BOHEMIA_TRANSITION_SET_7_10_26.txt. Engine-first: any zone, any pairs.
// Logic grid = truth (cell terrain ids). Display transition grid = offset half-cell;
// each display node samples its 4 surrounding cells and, when mixed, emits a piece.
const BOH_TRANSITIONS=(function(){
  let PIECES={}; // key: "a~b|piece" -> Image/b64
  function load(setJson){
    for(const p of setJson.pieces){ if(p.pure) PIECES[p.pair+"|"+p.piece]=p.b64; }
  }
  function pieceFor(a,b,kind){
    return PIECES[a+"~"+b+"|"+kind]||PIECES[b+"~"+a+"|"+kind]||null;
  }
  // grid: 2D array of terrain ids; returns draw list [{x,y,b64,kind,pair}]
  // Coordinates are CELL coords of the tile the piece overpaints.
  function computeDraws(grid){
    const H=grid.length,W=grid[0].length,draws=[];
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const t=grid[y][x];
      const R=x+1<W?grid[y][x+1]:t, D=y+1<H?grid[y+1][x]:t, DR=(x+1<W&&y+1<H)?grid[y+1][x+1]:t;
      if(R!==t){const b=pieceFor(t,R,'edge_v'); if(b)draws.push({x,y,b64:b,kind:'edge_v',pair:t+'~'+R});}
      if(D!==t){const b=pieceFor(t,D,'edge_h'); if(b)draws.push({x,y,b64:b,kind:'edge_h',pair:t+'~'+D});}
      if(R===t&&D===t&&DR!==t){const b=pieceFor(t,DR,'corner_inner'); if(b)draws.push({x,y,b64:b,kind:'corner_inner',pair:t+'~'+DR});}
      if(R!==t&&D!==t&&DR!==t){const b=pieceFor(t,DR,'corner_outer'); if(b)draws.push({x,y,b64:b,kind:'corner_outer',pair:t+'~'+DR});}
    }
    return draws;
  }
  return {load, computeDraws, pieceFor};
})();
if(typeof module!=='undefined')module.exports=BOH_TRANSITIONS;
