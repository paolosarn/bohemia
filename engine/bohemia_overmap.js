/* =====================================================================
   BOHEMIA OVERMAP  (bohemia_overmap.js)  7/5/26 pass 4
   Locked adds this pass (Paolo 7/5/26):
   - STRIP BUFFER: 2 cells each side of the strip street = resort zone
   - FASHION SHOW MALL: big footprint on the strip, north of center
   - I-15: true border-to-border, carves through the rim
   - MOUNTAIN PASSES: 2-4 TOTAL across BOTH ranges combined
   - LAKE LAS VEGAS water system: lake carved in the rim, Boulder City
     beside it, Hoover Dam + Lake Mead adjacent (clustered)
   - DENSE SUB-BLOCK STREETS: max building blob ~4x2
   - COMMERCIAL MUST TOUCH A STREET (post-pass, else flips to suburb)
   - MONORAIL: elevated polyline weaving beside the strip
   ===================================================================== */
(function(global){
'use strict';
// SLOT SCALE LAW (LOCKED 7/5/26, supersedes the 240 two-grid model):
// 1 slot = 32x32 fine cells = 2x2 chunks (CHUNK=16) = 24m x 24m at 0.75m/cell
// = ~6,200 sq ft explorable per slot. CDDA precedent: 24x24 per overmap tile,
// big buildings assembled from multiple slots.
const OVER_N=96, TILE_FINE=32, SLOT_FINE=32, CELL_M=0.75, TILE_M=TILE_FINE*CELL_M;
const DISTRICT={MOUNTAIN:'mountain',DESERT:'desert',STRIP:'strip',RESORT:'resort',MALL:'mall',DOWNTOWN:'downtown',SUBURB:'suburb',INDUSTRIAL:'industrial',COMMERCIAL:'commercial',DAM:'dam',SOLAR:'solar',WASH:'wash',WATER:'water',FREEWAY:'freeway',ARTERIAL:'arterial',BELTWAY:'beltway',PARK:'park',AIRPORT:'airport',AIRBASE:'airbase',CAMPUS:'campus',RAIL:'rail',RAILYARD:'railyard',TOWN:'town',MEDICAL:'medical',INTERCHANGE:'interchange',GOLF:'golf',GATED:'gated',SCHOOL:'school',CASINO:'casino',STADIUM:'stadium',SPEEDWAY:'speedway',CONVENTION:'convention',WATERPARK:'waterpark',MINIGP:'minigp',ESTATE:'estate',
RECLAIM:'reclaim',LANDFILL:'landfill',INTAKE:'intake',SUBSTATION:'substation',CEMETERY:'cemetery',PRISON:'prison',TERMINAL:'terminal',
SPHERE:'sphere',BONEYARD:'boneyard',CHAPEL:'chapel',FORT:'fort',BASIN:'basin',BALLPARK:'ballpark',SWAPMEET:'swapmeet',DRIVEIN:'drivein',HIGHROLLER:'highroller',TRAILER:'trailer',STORAGE:'storage',WATERTREAT:'watertreat',RESERVOIR:'reservoir',PUMPSTATION:'pumpstation',FARM:'farm',SIGN:'sign',STRAT:'strat',DATAFORT:'datafort',ARSENAL:'arsenal',FIRESTATION:'firestation',POLICESTATION:'policestation',JAIL:'jail',COURTHOUSE:'courthouse',CITYHALL:'cityhall',WAREHOUSE:'warehouse',TRUCKSTOP:'truckstop',BATTERY:'battery',QUARRY:'quarry',GYPSUM:'gypsum',SPRINGS:'springs',LUXOR:'luxor',FUELDEPOT:'fueldepot',GRANARY:'granary',LIBRARY:'library',RADIO:'radio',ROBOFACTORY:'robofactory',APARTMENT:'apartment'};
const ROAD={freeway:1,arterial:1,strip:1,beltway:1};
// BIG ARCHITECTURE (Paolo 7/18/26): "even monuments... would just be in their big ass plots not
// breaking any city streets" — the ONLY district types allowed to sit without touching the
// surface-street grid: real physical masses + genuinely huge installations + the blessed
// megablocks. Hoisted to module scope (was local to buildOvermap) so the LANDLOCKED DISTRICT LAW
// (Paolo 7/21/26) can reuse this exact whitelist instead of drifting a second copy.
const BIG=new Set([DISTRICT.MOUNTAIN,DISTRICT.WATER,DISTRICT.FREEWAY,DISTRICT.INTERCHANGE,DISTRICT.BELTWAY,
  DISTRICT.DAM,DISTRICT.RAIL,DISTRICT.RAILYARD,DISTRICT.WASH,DISTRICT.BASIN,DISTRICT.GYPSUM,DISTRICT.QUARRY,
  DISTRICT.INTAKE,DISTRICT.SOLAR,DISTRICT.AIRPORT,DISTRICT.AIRBASE,DISTRICT.SPEEDWAY,DISTRICT.PRISON,
  DISTRICT.DATAFORT,DISTRICT.ARSENAL,DISTRICT.LANDFILL,DISTRICT.BONEYARD,DISTRICT.WATERPARK,DISTRICT.MINIGP,
  DISTRICT.STADIUM,DISTRICT.BALLPARK,DISTRICT.CONVENTION,DISTRICT.SPRINGS,DISTRICT.STRIP,DISTRICT.RESORT,
  DISTRICT.CASINO,DISTRICT.LUXOR,DISTRICT.SPHERE,DISTRICT.HIGHROLLER,DISTRICT.STRAT,DISTRICT.SIGN,
  DISTRICT.TOWN,DISTRICT.TRUCKSTOP,DISTRICT.GRANARY,DISTRICT.PUMPSTATION]);
function rng(seed){let a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hash2(seed,x,y){let h=(seed^Math.imul(x,73856093)^Math.imul(y,19349663))>>>0;h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^h>>>16)>>>0;}
function segDist(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay;const t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy)));return Math.hypot(px-(ax+t*dx),py-(ay+t*dy));}
function inRect(x,y,R){return x>=R.x&&x<R.x+R.w&&y>=R.y&&y<R.y+R.h;}

function layoutFromSeed(seed){
  const r=rng((seed^0xA5C3D7)>>>0);
  const N=OVER_N, cx=N/2, cy=N/2;
  const axisFlip=r()<0.5;
  const stripMirror=r()<0.5;              // [PENDING Paolo confirm]
  const stripX=Math.round(cx+(stripMirror?-4:4));
  const fwySide=stripMirror?1:-1;
  const fwyX=stripX+fwySide*7;            // pushed out past the 2-cell resort buffer
  // I-15 = the CENTRAL SPINE (Paolo 7/5/26): originates at the SOUTH border,
  // runs PARALLEL with Las Vegas Blvd the whole map, takes its direction at the
  // NORTH end (past the strip), exits the opposite border. Town sides flip
  // around this spine per seed (the mirror, LOCKED).
  // all freeway geometry snaps MID-BLOCK so mile arterials are never adjacent-parallel
  const bendNorthY=20;   // 9*2+2: mid-block, north, clears the ring top band by 5 rows
  const exitDir=fwySide;
  const i15Exit=[exitDir>0?N-1:0, bendNorthY]; // 90-degree L: side border exit at the bend latitude
  // THE SPAGHETTI BOWL: the interchange knot AT the L's corner, just north of
  // downtown (its real position). The centerpiece where the freeways exchange.
  const bowl={x:fwyX-1, y:bendNorthY-1, w:4, h:4};
  const beltInset=13+Math.round(r()*3);
  const beltVarW=Math.round(r()*3)-1, beltVarH=Math.round(r()*3)-1;
  const hw=(N/2)-beltInset+beltVarW, hh=(N/2)-beltInset+beltVarH;
  const i1side=r()<0.5?-1:1;
  const ind1={x:Math.round(cx+i1side*(N*0.28+r()*6)), y:Math.round(N*(0.28+r()*0.18))};
  const ind2={x:Math.round(cx-i1side*(N*0.26+r()*6)), y:Math.round(N*(0.58+r()*0.16))};
  // EXIT HIGHWAYS: straight VERTICAL 2-wide stubs (90-degree law, no diagonals)
  const snapMid=(v)=>Math.round((v-4)/9)*9+4;       // mid-block lane (%9 === 4)
  const beltRect={lft:snapMid(cx-hw), rgt:snapMid(cx+hw), top:snapMid(cy-hh), bot:snapMid(cy+hh)};
  const ringTop=beltRect.top, ringBot=beltRect.bot;
  const exits=[
    {x:snapMid(N*(0.80+r()*0.08)), y0:0,         y1:ringTop+2},  // NE out the top
    {x:snapMid(N*(0.10+r()*0.08)), y0:ringBot-2, y1:N-1},        // SW out the bottom
    {x:snapMid(cx+4+r()*4),        y0:ringBot-2, y1:N-1},        // S toward the dam side
  ];
  // FREEWAY WIDTH LAW: nothing wider than 2. If an exit lands within 2 columns
  // of the spine or a ring vertical, it COINCIDES exactly (no 3-wide seams).
  for(const e of exits){
    if(Math.abs(e.x-fwyX)<=2)e.x=fwyX;
    else if(Math.abs(e.x-(beltRect.lft))<=2)e.x=beltRect.lft;
    else if(Math.abs(e.x-(beltRect.rgt-1))<=2)e.x=beltRect.rgt-1;
  }
  const stripEndY=Math.floor(N*0.66);
  // HRI: a little EAST of the strip line (still touching alignment), 3-4 cell buffer below strip end
  // HRI east of Las Vegas Blvd, its west edge TOUCHING the 2-wide street
  const hri={x:stripX+1, y:stripEndY+4, w:8, h:4};
  const apSE={x:Math.round(N*(0.68+r()*0.06)), y:Math.round(N*(0.74+r()*0.04)), w:4, h:2};
  const wside=r()<0.5?1:-1;
  // NELLIS CORNER LAW (Paolo 7/5/26): the air base + speedway sit on the SAME
  // side of town as the dam cluster, at the OPPOSITE border end (real: dam SE,
  // Nellis NE). Corner is fixed by wside; the small north airport mirrors away.
  const nellisCnr = !axisFlip ? (wside>0?0:1) : (wside>0?3:1);
  const nellisWest = (nellisCnr===1||nellisCnr===3);
  const apNW={x:Math.round(N*((nellisWest?0.72:0.16)+r()*0.06)), y:15+((r()*3)|0), w:4, h:2}; // clamped between ring band and the leg
  // AIRBASE: seeded corner, NEVER the same quadrant as any airport, and NEVER
  // breaking a freeway (Paolo 7/5/26): rect must clear the spine, the horizontal
  // leg, every exit stub, and sit fully inside the beltway rectangle.
  const q=(px,py)=>(px>=N/2?1:0)+(py>=N/2?2:0);
  const airQ=[q(hri.x+4,hri.y+2), q(apSE.x+2,apSE.y+1), q(apNW.x+2,apNW.y+1)];
  const _lft=Math.round(cx-hw), _rgt=Math.round(cx+hw), _top=Math.round(cy-hh), _bot=Math.round(cy+hh);
  // NELLIS HUGS THE MOUNTAINS (Paolo 7/5/26): the base + speedway sit OUTSIDE
  // the beltway, pressed against the rim (real: Nellis backs Sunrise Mountain,
  // LVMS out by the range). The base claims first, so the rim wraps around it.
  const c=nellisCnr;
  const abx=(c===0||c===2)? Math.min(N-9, beltRect.rgt+2) : 3;
  const aby=(c===0||c===1)? (axisFlip?3:5+((r()*2)|0)) : Math.max(beltRect.bot+2, N-9);
  const airbase={x:abx, y:aby, w:9, h:6, corner:c};
  // exits dodge the base (shift a full block toward center, snap preserved)
  for(const e of exits){
    let guard=0;
    while(e.x+1>=airbase.x-1&&e.x<=airbase.x+airbase.w&&guard++<3){ e.x+= (e.x>N/2? -9 : 9); }
  }
  // UNLV central, on the OPPOSITE side of the strip from the I-15 spine
  // (real Vegas: I-15 west, UNLV east; flips with the town mirror)
  const uoff=5+Math.round(r()*3);
  const unlv={x: fwySide<0? stripX+uoff : stripX-uoff-4, y:Math.round(N*(0.46+r()*0.08)), w:4, h:3}; // big campus: housing, halls, Thomas & Mack
  // CSN anywhere, but retry so it lands clear of the airbase, water cluster, and rim
  let csn={x:0,y:0,w:2,h:2};
  for(let tries=0;tries<10;tries++){
    const cxr=12+Math.round(r()*(N-30)), cyr=12+Math.round(r()*(N-30));
    const clearAB=!(cxr+2>airbase.x&&cxr<airbase.x+airbase.w&&cyr+2>airbase.y&&cyr<airbase.y+airbase.h);
    const clearEdge=cxr>10&&cxr<N-14&&cyr>10&&cyr<N-14;
    if(clearAB&&clearEdge){ csn={x:cxr,y:cyr,w:2,h:2}; break; }
  }
  // MOUNTAIN PASSES: 2-4 TOTAL across both ranges (Paolo)
  const totalPasses=2+((r()*3)|0);
  const passesA=[], passesB=[];
  for(let i=0;i<totalPasses;i++){ const p=Math.round(N*(0.15+r()*0.7)); (r()<0.5?passesA:passesB).push(p); }
  const footA=[Math.round(N*(0.2+r()*0.55))], footB=[Math.round(N*(0.2+r()*0.55))];
  if(r()<0.6)footA.push(Math.round(N*(0.2+r()*0.55)));
  if(r()<0.6)footB.push(Math.round(N*(0.2+r()*0.55)));
  // PASS PARALLEL LAW: a pass never runs alongside another freeway (that
  // union reads 3 wide). Shift any offender clear.
  for(const arr of [passesA,passesB]){
    for(let i2=0;i2<arr.length;i2++){
      let p=arr[i2], guard=0;
      const bad=()=> axisFlip
        ? ((p>=fwyX-2&&p<=fwyX+3)||exits.some(e=>p>=e.x-2&&p<=e.x+3))
        : (p>=bendNorthY-2&&p<=bendNorthY+3);
      while(bad()&&guard++<6)p+=4;
      arr[i2]=p;
    }
  }

  const railX=fwyX+fwySide*3;
  const railyard={x:railX+(fwySide>0?1:-3), y:Math.max(8,Math.min(N-12,ind1.y-1)), w:3, h:2};
  // LAKE LAS VEGAS WATER SYSTEM: on the SOLAR-OPPOSITE border, AT a seeded corner
  // where that border meets the mountain rim (lake -> boulder city -> dam -> mead
  // filling the corner against the mountains). Paolo 7/5/26.
  // (wside hoisted above the airports for the Nellis corner law)
  let lakeLV, boulder, damR, mead;
  if(!axisFlip){ // solar N -> cluster on SOUTH border, corner E or W
    if(wside>0){ lakeLV={x:N-20,y:N-9,w:4,h:4}; boulder={x:N-15,y:N-8,w:3,h:3}; damR={x:N-11,y:N-7,w:2,h:2}; mead={x:N-8,y:N-9,w:7,h:8}; }
    else       { lakeLV={x:16,  y:N-9,w:4,h:4}; boulder={x:12,  y:N-8,w:3,h:3}; damR={x:9,   y:N-7,w:2,h:2}; mead={x:1,  y:N-9,w:7,h:8}; }
  } else {      // solar W -> cluster on EAST border, corner N or S
    if(wside>0){ lakeLV={x:N-9,y:N-20,w:4,h:4}; boulder={x:N-8,y:N-15,w:3,h:3}; damR={x:N-7,y:N-11,w:2,h:2}; mead={x:N-9,y:N-8,w:8,h:7}; }
    else       { lakeLV={x:N-9,y:16,  w:4,h:4}; boulder={x:N-8,y:12,  w:3,h:3}; damR={x:N-7,y:9,   w:2,h:2}; mead={x:N-9,y:1,  w:8,h:7}; }
  }
  // FASHION SHOW MALL: on the strip, north of center of its run, west buffer side, big
  // FASHION SHOW MALL: directly ON the strip (touching the street), flips with town
  const mall={x: fwySide<0? stripX-4 : stripX+1, y:Math.round(N*0.37), w:3, h:2};
  // LAS VEGAS WASH: dry channel from mid-city to Lake Las Vegas (same side of town)
  const lakeC=[lakeLV.x+2, lakeLV.y+2];
  const washStart=[stripX+9+Math.round(r()*4), Math.round(N*(0.42+r()*0.08))];
  // 90-degree channel legs (real Vegas washes are engineered straight runs)
  const wx=(lakeC[0]%9===0)?lakeC[0]+1:lakeC[0];  // keep the channel off the arterial line
  const washMid=[wx, washStart[1]];
  const wash=[washStart, washMid, [wx, lakeC[1]]];
  // TINY MEDICAL CLUSTER near downtown / north strip (historic position)
  // medical flips sides with the town, opposite the spine like UNLV
  const moff=4+Math.round(r()*1); // tight to downtown, clear of the speedway corner
  const medical={x: fwySide<0? stripX+moff : stripX-moff-2, y:Math.round(N*0.235)+Math.round(r()*2), w:2, h:2};
  // TWO BIG REAL PARKS, 2x2 (Paolo): Sunset Park east of the airport, Craig Ranch north
  const sunsetPark={x:Math.round((hri.x+10)/9)*9+1, y:hri.y+Math.round(r()*2), w:2, h:2}; // snapped beside an arterial
  const craigRanch={x:Math.round(N*(0.30+r()*0.12)/9)*9+1, y:16+Math.round(r()*3), w:2, h:2}; // north, clear of the ring band
  // MONORAIL: elevated polyline weaving on the strip's east side
  const mx=stripX+3;
  const monorail=[[mx, Math.round(N*0.31)],[mx, Math.round(N*0.48)],[mx, Math.round(N*0.64)]];
  const damPt=[damR.x, damR.y];
  // storm/sewer tunnels ENTER FROM THE WASH (surface entrance, Homeless below)
  const tunnels=[
    {pts:[washStart, washMid, damPt]},
    {pts:[washMid, [Math.round((washMid[0]+mead.x)/2), Math.round((washMid[1]+mead.y)/2)], [mead.x, mead.y]]},
    {pts:[washStart, [stripX+10, Math.round(N*0.58)], damPt]},
  ];
  // MOUNT CHARLESTON: massif ALWAYS in the corner OPPOSITE the dam cluster.
  // (real geography: Charleston NW, dam SE). Bulges into the valley (bowl feel).
  let mtChar;
  if(!axisFlip){ // dam on south border at side wside -> Charleston north border, opposite side
    mtChar = wside>0? {x:2, y:2, w:12, h:9} : {x:N-14, y:2, w:12, h:9};
  } else {       // dam on east border -> Charleston west border, opposite side
    mtChar = wside>0? {x:2, y:2, w:9, h:12} : {x:2, y:N-14, w:9, h:12};
  }
  const dirE=(fwyX<stripX)?1:-1; // "town east" unit (mirror-aware)
  // GOLF COURSES: ~9, Summerlin-west + Henderson-south weighted, 1 near the strip
  const golf=[];
  for(let i=0;i<4;i++) golf.push({x:Math.round(cx-dirE*(N*0.26+r()*10)), y:Math.round(N*(0.25+r()*0.4)), w:3+((r()*2)|0), h:2+((r()*2)|0)});
  for(let i=0;i<3;i++) golf.push({x:Math.round(cx+(r()*2-1)*N*0.2), y:Math.round(N*(0.72+r()*0.1)), w:3+((r()*2)|0), h:2});
  golf.push({x:stripX+4, y:Math.round(N*0.58), w:3, h:2});           // Bali Hai, on the Blvd
  golf.push({x:Math.round(12+r()*(N-30)), y:Math.round(12+r()*(N-40)), w:3, h:2});
  // GOLF DECAY LAW (Paolo 7/5/26): 15 years post-crash, only ONE course is
  // still operational; every other course has become a BMX / dirt-rider park.
  const golfOp=(r()*golf.length)|0;
  // GATED COMMUNITIES: ~6, foothill-weighted (Ridges/Red Rock CC west; Seven
  // Hills/MacDonald/Anthem SE foothills; Southern Highlands south by the spine)
  const gated=[];
  for(let i=0;i<3;i++) gated.push({x:Math.round(cx-dirE*(N*0.36+r()*4)), y:Math.round(N*(0.25+r()*0.35)), w:3, h:3});
  for(let i=0;i<2;i++) gated.push({x:Math.round(cx+dirE*(N*0.30+r()*5)), y:Math.round(N*(0.68+r()*0.10)), w:3, h:3});
  gated.push({x:fwyX+fwySide*3, y:Math.round(N*0.80), w:3, h:3});     // Southern Highlands by the 15
  // SCHOOLS: 1x1 scattered on a jittered lattice (high schools + magnets)
  const schools=[];
  for(let gy=14;gy<N-14;gy+=17)for(let gx=12;gx<N-12;gx+=19){
    let jx=gx+2+((hash2(seed,gx,gy)>>>4)%5), jy=gy+2+((hash2(seed,gy,gx)>>>6)%5);
    if(jx%9===0)jx++; if(jy%9===0)jy++;   // never on a street line, nudge into the block
    schools.push({x:jx,y:jy,w:1,h:1});
  }
  // CONVENTION CENTER: extends off the strip's east side, just below downtown
  const convention={x:stripX+3, y:Math.round(N*0.315), w:3, h:2};
  // ALLEGIANT: 2x2 across the spine from the strip's south end, by the freeway
  const stadiumA={x:fwyX+(fwySide>0?-3:2), y:stripEndY-3, w:2, h:2}; // spine side opposite the rail
  // SPEEDWAY (EDC / LVMS): beside the air base
  const speedway={x: airbase.x + (airbase.x<N/2? airbase.w+1 : -5), y: airbase.y+1, w:4, h:3};
  // WATER PARKS: one by a freeway, one not; MINI GRAND PRIX by the freeway
  const wp1={x:fwyX+fwySide*3, y:Math.round(N*0.74), w:2, h:1};
  const wp2={x:Math.round(stripX+dirE*16), y:Math.round(N*0.44), w:2, h:1};
  const minigp={x:fwyX+fwySide*2, y:Math.round(N*0.29), w:1, h:1};
  // OFF-STRIP LOCALS CASINOS: Red Rock W, GVR SE, Aliante N, the M far S, Durango SW
  // ===== INFRASTRUCTURE + STRUCTURES BATCH (Paolo approved ALL, 7/5/26) =====
  // WATER RECLAMATION on the wash (the 99%% survival loop, real plants sit on the wash)
  const reclaim={x:washMid[0]+2, y:Math.max(6,washMid[1]-3), w:2, h:2};
  // APEX LANDFILL: north along the spine corridor, outside the ring
  const landfill={x:fwyX+(fwySide>0?5:-7), y:(axisFlip?15:6)+Math.round(r()*2), w:2, h:2}; // flip: below the north rim
  // LAKE MEAD INTAKE: the straw, on the mead shore facing the city
  const intake={x: axisFlip? mead.x-1 : (wside>0? mead.x-1 : mead.x+mead.w), y: mead.y+2, w:1, h:1};
  // SUBSTATIONS: solar -> city distribution nodes
  const substations=[
    {x:Math.round(cx-8+r()*16), y:5, w:1, h:1},
    {x:Math.round(cx+dirE*14), y:Math.round(N*0.40), w:1, h:1},
    {x:Math.round(cx-dirE*10), y:Math.round(N*0.66), w:1, h:1},
  ];
  for(const s of substations){ if(s.x%9===0)s.x++; if(s.y%9===0)s.y++; }
  // CEMETERY
  // CEMETERY LAW (Paolo 7/5/26): the big cemetery CONNECTS to Sunset Park
  // (real: Palm Eastern sits by Sunset Park); one more small one at the
  // north cluster (real: Woodlawn 1914, near Cashman)
  const cemetery={x:sunsetPark.x+sunsetPark.w, y:sunsetPark.y, w:2, h:2};
  const cemetery2={x:Math.round(stripX+dirE*6), y:17, w:1, h:1};
  // PRISON: deep desert near the rim, opposite side from Nellis
  let prison={x: nellisWest? N-10 : 7, y:Math.round(N*0.50), w:2, h:2};
  for(let k=0;k<6;k++){ let hit=false;
    for(const py of passesA.concat(passesB)){ if(Math.abs(prison.y-py)<3)hit=true; }
    if(!hit)break; prison.y+=4; }
  // BRIGHTLINE TERMINAL: beside the rail at the strip's south end (the LA train)
  const terminal={x: railX+(fwySide>0?1:-2), y: stripEndY, w:1, h:1};
  // THE SPHERE: east of the strip mid-run (real position)
  const sphere={x:stripX+dirE*4, y:Math.round(N*0.44), w:2, h:2};
  // LAS VEGAS BLVD NORTH CLUSTER (real): Cashman Field + Neon Boneyard + Mormon Fort
  const cashman={x:stripX+dirE*2, y:16, w:2, h:2};
  const boneyard={x:stripX+dirE*2, y:19, w:1, h:1};
  const fort={x:stripX+dirE*4, y:19, w:1, h:1};
  // BALLPARK: Las Vegas Ballpark, Summerlin (the Aviators)
  const ballparkS={x:Math.round(cx-dirE*(N*0.30)), y:Math.round(N*0.38), w:2, h:2};
  // WEDDING CHAPELS: wedding capital of the world
  const chapels=[
    {x:stripX+dirE*3, y:Math.round(N*0.33), w:1, h:1},
    {x:stripX-dirE*3, y:Math.round(N*0.52), w:1, h:1},
    {x:stripX+dirE*2, y:Math.round(N*0.27), w:1, h:1},
  ];
  // FLOOD DETENTION BASINS: dry 360 days a year, feed the wash
  const basins=[
    {x:washStart[0]+3, y:washStart[1]+2, w:2, h:2},
    {x:washMid[0]-3, y:Math.round((washStart[1]+lakeC[1])/2), w:2, h:2},
  ];
  for(const b of basins){ // never on the spine or an exit column
    const bad=(bx)=>((bx+1>=fwyX-1&&bx<=fwyX+2)||exits.some(e=>bx+1>=e.x-1&&bx<=e.x+2));
    let g2=0; while(bad(b.x)&&g2++<5){ b.x+=3; }
  }
  // SWAP MEET (Broadacres, north) + DRIVE-IN + HIGH ROLLER (the Linq wheel)
  const swapmeet={x:Math.round(cx-6+r()*4), y:9, w:1, h:1};
  // DRIVE-IN LAW (Paolo 7/5/26): always touches an airport that ISN'T Harry
  // Reid (real: West Wind Drive-In sits by North Las Vegas Airport)
  const drivein={x:apNW.x+apNW.w, y:apNW.y+1, w:1, h:1}; // beside the runway
  const highroller={x:stripX+dirE*2, y:Math.round(N*0.47), w:1, h:1};
  // WELCOME TO FABULOUS LAS VEGAS: 1959, south end of the Blvd, survived everything
  const vegassign={x:stripX+dirE*1+1, y:stripEndY+2, w:1, h:1};
  // THE STRAT (Paolo 7/5/26): on the strip's border, first thing in the arts
  // district past the grid street, closest downtown block to the strip
  const strat={x:stripX+dirE*1, y:Math.floor(N*0.30/9)*9+1, w:1, h:1};
  // ===== VERDICT BATCH (Paolo 7/5/26): civic ruins, logistics, materials =====
  // Fire station ruins (A): the trucks left mid-call and never came back
  const firestations=[{x:cx-8,y:cy-8,w:1,h:1},{x:cx+8,y:cy+1,w:1,h:1},{x:cx-4,y:cy+10,w:1,h:1}];
  // Police substation ruins (B): the thing that stopped existing
  const policestations=[{x:cx+5,y:cy-5,w:1,h:1},{x:cx-9,y:cy+4,w:1,h:1}];
  // Jail (C): CCDC downtown
  const jail={x:stripX+dirE*5, y:Math.round(N*0.24), w:1, h:1};
  // Courthouse / civic block (D): the mayor arc's seat
  const courthouse={x:stripX+dirE*3, y:Math.round(N*0.25), w:2, h:1};
  // City Hall (7/23/26): the executive/administrative seat beside the courthouse's
  // judicial block (real LV City Hall is the downtown civic core) — the mayor arc's office
  const cityhall={x:stripX+dirE*3, y:Math.round(N*0.25)+1, w:1, h:1};
  // Warehouse district (F): the salvage economy's shelves, by the rail
  const warehouse={x:railX+(fwySide>0?2:-4), y:railyard.y+4, w:2, h:2};
  // Truck stop (G): spine south approach
  const truckstop={x:fwyX+2, y:N-8, w:1, h:1};
  // Battery farm (H): solar without storage dies every night
  const battery={x:axisFlip?6:cx+7, y:axisFlip?cy+7:8, w:1, h:1}; // beside the solar field, off the rim
  // Quarry (I): aggregate south along the 15 (real: Sloan)
  const quarry={x:fwyX-4, y:N-7, w:1, h:1}; // carves the south approach hills (real: Sloan)
  // Gypsum mine (I): Blue Diamond Hill by Red Rock, 3000 real acres,
  // wallboard + cement + AGRICULTURAL soil amendment (feeds the farms too)
  const gypsum={x:(axisFlip?Math.round(N*0.45):5), y:(axisFlip?5:Math.round(N*0.55)), w:1, h:1}; // carved into the rim itself
  // E. THE FUEL DEPOTS (Paolo 7/5/26, name pending his pick): the city's two
  // straws for gasoline. CalNev terminal (real: 550mi from LA, 2 pipes,
  // 128k bbl/day, 90% of the fuel, ends at Nellis) by the rail north; UNEV
  // terminal (real: 400mi from Salt Lake, 60k bbl/day, ends AT APEX) beside
  // the landfill corridor. Both pipes dead at crash, both terminals were the
  // most fought-over stockpiles of the hell years.
  const fueldepots=[
    {x:railX+(fwySide>0?-3:3), y:Math.round(N*0.10), w:1, h:1},
    {x:landfill.x+(fwySide>0?3:-2), y:landfill.y+1, w:1, h:1}];
  // THE GRANARY (Paolo 7/6/26): the oldest building in the world, a dead
  // grocery distribution center recommissioned. Harvest storage, seed
  // stock, and the cold rooms double as the MEDICINE VAULT.
  const granary={x:railX+(fwySide>0?3:-3), y:Math.round(N*0.155), w:1, h:1};
  // THE LIBRARY (Paolo 7/6/26): the analog memory. Paper needs no power,
  // no network, no permission. The counter-fortress.
  const library={x:stripX+dirE*4, y:Math.round(N*0.27), w:1, h:1};
  // THE RADIO STATION (Paolo 7/6/26): the voice of the valley. No radio,
  // no market. Whoever holds the microphone shapes the truth.
  const radiostation={x:stripX+dirE*6, y:Math.round(N*0.26), w:1, h:1};
  // THE ROBOTICS FACTORY (Paolo 7/6/26, his find): real Vegas has a
  // robotics/machine-tool factory next to the Henderson airport. Machines
  // that make machines, beside our apSE strip. Absorbs the machine-shop
  // role: the last place in the valley that can cut steel at scale.
  const robofactory={x:apSE.x+apSE.w+1, y:apSE.y, w:1, h:1};
  // Springs Preserve (J): the meadows the city is named for
  const springs={x:stripX-dirE*6, y:Math.round(N*0.24), w:1, h:1};
  // Luxor (N): the pyramid on the strip south, part of the strip already
  const luxor={x:stripX+dirE*1, y:stripEndY-2, w:1, h:1};
  // THE ARSENAL (Paolo 7/5/26): the range that houses tanks + helicopters,
  // one block off the strip on the rail side (real: behind Circus Circus).
  // The Remnants saw it as super important; contested with the cartel.
  const arsenal={x:stripX-dirE*3, y:Math.round(N*0.36), w:1, h:1};
  // 1x1 pieces never sit on street lines (nudge into the block)
  for(const p of [sphere,cashman,boneyard,fort,swapmeet,drivein,highroller,cemetery2,reclaim,landfill,terminal].concat(chapels)){
    if(p.x%9===0)p.x++; if(p.y%9===0)p.y++;
  }
  // WATER SYSTEM STAPLES (grounded 7/5/26): treatment at the lake (Alfred
  // Merritt Smith analog), reservoir tanks on the foothills (pumped uphill,
  // gravity down), a pumping station on the aqueduct path
  const cityDirX = axisFlip? 0 : (wside>0? -1 : 1);
  const cityDirY = axisFlip? (wside>0? -1 : 1) : 0;
  const watertreat={x:intake.x+cityDirX*4-1, y:intake.y+cityDirY*4-1, w:2, h:2};
  {
    const clusterRects=[mead,lakeLV,boulder,damR];
    const B2=beltRect;
    const ringHit=()=>{ const x0=watertreat.x,x1=x0+1,y0=watertreat.y,y1=y0+1;
      const colHit=(c2)=>c2>=x0-1&&c2<=x1+1, rowHit=(r2)=>r2>=y0-1&&r2<=y1+1;
      return colHit(B2.lft)||colHit(B2.lft+1)||colHit(B2.rgt-1)||colHit(B2.rgt)||rowHit(B2.top)||rowHit(B2.top+1)||rowHit(B2.bot-1)||rowHit(B2.bot); };
    const hits=(R)=>ringHit()||clusterRects.some(C=>watertreat.x<C.x+C.w+1&&watertreat.x+2>C.x-1&&watertreat.y<C.y+C.h+1&&watertreat.y+2>C.y-1);
    const dxs=Math.sign(cx-watertreat.x)||1, dys=Math.sign(cy-watertreat.y)||-1;
    let g3=0; while(hits()&&g3++<8){ watertreat.x+=dxs*2; watertreat.y+=dys*2; }
  }
  const reservoirs=[
    {x:9, y:Math.round(N*0.30), w:1, h:1},
    {x:N-10, y:Math.round(N*0.62), w:1, h:1},
    {x:Math.round(cx+10), y:8, w:1, h:1},
  ];
  const pumpstation={x:watertreat.x+(Math.sign(cx-watertreat.x)||1)*5, y:watertreat.y+(Math.sign(cy-watertreat.y)||-1)*5, w:1, h:1};
  for(const p of reservoirs.concat([pumpstation])){ if(p.x%9===0)p.x++; if(p.y%9===0)p.y++; }
  if(watertreat.x%9===0)watertreat.x++; if(watertreat.y%9===0)watertreat.y++;
  const casinos=[
    {x:Math.round(cx-dirE*(N*0.34)), y:Math.round(N*0.42), w:1, h:1},
    {x:Math.round(cx+dirE*(N*0.28)), y:Math.round(N*0.72), w:1, h:1},
    {x:Math.round(cx-6+r()*8),       y:11,                 w:1, h:1},
    {x:fwyX+fwySide*4,               y:Math.round(N*0.86), w:1, h:1},
    {x:Math.round(cx-dirE*(N*0.24)), y:Math.round(N*0.70), w:1, h:1},
  ];
  // dodge freeway columns (spine + exits): casinos sit BESIDE the 15, never on it
  for(const c of casinos){
    const bad=(cxx)=>((cxx>=fwyX-1&&cxx<=fwyX+2)||exits.some(e=>cxx>=e.x-1&&cxx<=e.x+2));
    let guard=0; while(bad(c.x)&&guard++<6){ c.x+=dirE*2; }
  }
  // THE DATA FORTRESS (Paolo 7/5/26): the Switch-equivalent, real scale
  // (eleven windowless buildings, ~2M sq ft, self-powered, 100% recycled
  // water, Black Iron Forest thermal steel). 3x2 slots, speedway-class
  // footprint, southwest valley inside the ring at the diagonal corner from
  // Nellis (real geography: Switch SW, Nellis NE). The Network's ground.
  const dfC=3-nellisCnr;
  const datafort={x:(dfC===0||dfC===2)? beltRect.rgt-10 : beltRect.lft+6,
                  y:(dfC===0||dfC===1)? beltRect.top+5 : beltRect.bot-8, w:3, h:2};
  {
    const dxs=Math.sign(cx-datafort.x)||1, dys=Math.sign(cy-datafort.y)||1;
    const bad=()=>{ const x0=datafort.x,x1=x0+2,y0=datafort.y,y1=y0+1;
      if(fwyX+1>=x0-1&&fwyX<=x1+1)return true;
      if(bendNorthY+1>=y0-1&&bendNorthY<=y1+1)return true;
      if(Math.abs(x0-railX)<=1||Math.abs(x1-railX)<=1)return true;
      if(exits.some(e=>e.x+1>=x0-1&&e.x<=x1+1))return true;
      for(const R of [hri,apSE,apNW,airbase,unlv,csn,medical,convention,stadiumA,speedway,wp1,wp2,minigp,craigRanch,sunsetPark,cemetery,reclaim,landfill,watertreat,prison,terminal,sphere,cashman,ballparkS,bowl]){
        if(x0<R.x+(R.w||1)+1&&x1>R.x-2&&y0<R.y+(R.h||1)+1&&y1>R.y-2)return true; }
      return false; };
    let g6=0; while(bad()&&g6++<12){ datafort.x+=dxs*2; datafort.y+=dys*2; }
  }
  // ===== GENERIC CLEAR-SPOT NUDGER (FACTORY LAW, 7/5/26) =====
  // One mechanism for every small piece: forbidden = all freeway geometry +
  // every placed rect. Spiral-search offsets until clear. No more ad-hoc dodges.
  {
    const hardRects=[mead,lakeLV,boulder,damR,mtChar,hri,apSE,apNW,airbase,unlv,csn,
      craigRanch,sunsetPark,medical,convention,stadiumA,speedway,wp1,wp2,minigp,bowl,railyard,
      reclaim,landfill,watertreat,cemetery,prison,terminal,sphere,cashman,ballparkS,datafort,mall]
      .concat(basins,casinos,gated,golf,schools);
    const B5=beltRect;
    function clearOf(px,py){
      if(px<2||px>93||py<2||py>93)return false;
      if(px%9===0||py%9===0)return false;
      if(py<5)return false;
      if(px>=fwyX-1&&px<=fwyX+2)return false;
      if(py>=bendNorthY-1&&py<=bendNorthY+2)return false;
      if((px>=B5.lft-1&&px<=B5.lft+2)||(px>=B5.rgt-2&&px<=B5.rgt+1))return false;
      if((py>=B5.top-1&&py<=B5.top+2)||(py>=B5.bot-2&&py<=B5.bot+1))return false;
      if(Math.abs(px-railX)<=1)return false;
      if(exits.some(e=>px>=e.x-1&&px<=e.x+2))return false;
      if(!axisFlip){ if(passesA.concat(passesB).some(p=>Math.abs(py-p)<=1&&(px<=B5.lft+2||px>=B5.rgt-2)))return false; }
      else { if(passesA.concat(passesB).some(p=>Math.abs(px-p)<=1&&(py<=B5.top+2||py>=B5.bot-2)))return false; }
      for(const R of hardRects){ if(px>=R.x-1&&px<R.x+(R.w||1)+1&&py>=R.y-1&&py<R.y+(R.h||1)+1)return false; }
      return true;
    }
    const OFFS=[[0,0]]; for(let rr=1;rr<=8;rr++){ OFFS.push([rr,0],[-rr,0],[0,rr],[0,-rr],[rr,rr],[-rr,rr],[rr,-rr],[-rr,-rr]); }
    function nudge(p){
      const pw=p.w||1, ph=p.h||1;
      for(const [ox,oy] of OFFS){
        let ok=true;
        for(let dy=0;dy<ph&&ok;dy++)for(let dx=0;dx<pw&&ok;dx++){ if(!clearOf(p.x+ox+dx,p.y+oy+dy))ok=false; }
        if(ok){ p.x+=ox; p.y+=oy; hardRects.push(p); return; }
      }
      hardRects.push(p);
    }
    for(const p of substations)nudge(p);
    nudge(cemetery2); nudge(boneyard); nudge(fort);
    for(const p of chapels)nudge(p);
    nudge(swapmeet); nudge(drivein); nudge(highroller); nudge(pumpstation);
    nudge(vegassign); nudge(strat); nudge(arsenal);
    for(const p of firestations)nudge(p);
    for(const p of policestations)nudge(p);
    nudge(jail); nudge(courthouse); nudge(warehouse); nudge(truckstop);
    nudge(battery); nudge(springs); nudge(luxor);
    for(const p of fueldepots)nudge(p);
    nudge(granary); nudge(library); nudge(radiostation); nudge(robofactory);
    for(const p of reservoirs)nudge(p);
  }
  return {axisFlip, stripX, fwyX, beltInset, beltVarW, beltVarH, beltRect,
          ind1, ind2, exits, hri, apSE, apNW, airbase, unlv, csn,
          passesA, passesB, footA, footB, railX, railyard,
          lakeLV, boulder, damR, mead, mall, monorail, tunnels,
          stripEndY, bendNorthY, i15Exit, bowl, sunsetPark, craigRanch, wash, medical,
          mtChar, golf, golfOp, gated, schools, convention, stadiumA, speedway, wp1, wp2, minigp, casinos, wside,
          reclaim, landfill, intake, substations, cemetery, cemetery2, prison, terminal, sphere,
          cashman, boneyard, fort, ballparkS, chapels, basins, swapmeet, drivein, highroller,
          watertreat, reservoirs, pumpstation, vegassign, strat, datafort, arsenal,
          firestations, policestations, jail, courthouse, cityhall, warehouse, truckstop,
          battery, quarry, gypsum, springs, luxor, fueldepots, granary, library, radiostation, robofactory, seed};
}

function skeleton(x,y,L){
  const N=OVER_N, cx=N/2, cy=N/2;
  if(inRect(x,y,L.intake))return DISTRICT.INTAKE; // the straw claims the shore first
  if(inRect(x,y,L.gypsum))return DISTRICT.GYPSUM;  // the mine carves the rim itself
  if(inRect(x,y,L.quarry))return DISTRICT.QUARRY;  // the quarry carves the approach hills
  if(inRect(x,y,L.truckstop))return DISTRICT.TRUCKSTOP;
  // WATER CLUSTER + AIRBASE claim ground FIRST: highways dead-end INTO them
  // (US-93 really ends at the dam; highways feed Nellis)
  if(inRect(x,y,L.lakeLV))return DISTRICT.WATER;
  if(inRect(x,y,L.boulder))return DISTRICT.TOWN;
  if(inRect(x,y,L.damR))return DISTRICT.DAM;
  if(inRect(x,y,L.mead))return DISTRICT.WATER;
  if(inRect(x,y,L.airbase))return DISTRICT.AIRBASE;
  for(const e of L.exits){ if((x===e.x||x===e.x+1)&&y>=e.y0&&y<=e.y1)return DISTRICT.FREEWAY; }
  // THE SPAGHETTI BOWL claims the corner; the legs feed into it
  if(inRect(x,y,L.bowl))return DISTRICT.INTERCHANGE;
  // I-15 SPINE: dead-straight vertical, south border to the north bend (90-degree law)
  if(y>=L.bendNorthY&&(x===L.fwyX||x===L.fwyX+1))return DISTRICT.FREEWAY;
  // NORTH SPUR: the corridor continues north of the bowl to the ring (US-93/515
  // reality); the bowl touches freeways on ALL FOUR sides (Paolo 7/5/26)
  if(y<L.bendNorthY&&y>=L.beltRect.top&&(x===L.fwyX||x===L.fwyX+1))return DISTRICT.FREEWAY;
  // the cross-town freeway (US-95) runs BOTH directions through the bowl,
  // border to border: the bowl touches THREE freeways minimum (Paolo 7/5/26)
  if(y===L.bendNorthY||y===L.bendNorthY+1)return DISTRICT.FREEWAY;
  // MOUNTAIN PASSES (2-4 total across both rims)
  if(!L.axisFlip){
    // PASSES: 1-wide mountain highways, running from the border INWARD until
    // they CONNECT to the beltway ring (no floating freeway segments, Paolo)
    for(const py of L.passesA){ if(y===py&&x<=L.beltRect.lft+1)return DISTRICT.FREEWAY; }
    for(const py of L.passesB){ if(y===py&&x>=L.beltRect.rgt-1)return DISTRICT.FREEWAY; }
  } else {
    for(const px of L.passesA){ if(x===px&&y<=L.beltRect.top+1)return DISTRICT.FREEWAY; }
    for(const px of L.passesB){ if(x===px&&y>=L.beltRect.bot-1)return DISTRICT.FREEWAY; }
  }
  // BELTWAY: a RECTANGLE ring with square corners, 2 wide, snapped mid-block
  {
    const {lft,rgt,top,bot}=L.beltRect;
    const onV=(x===lft||x===lft+1||x===rgt-1||x===rgt)&&y>=top&&y<=bot;
    const onH=(y===top||y===top+1||y===bot-1||y===bot)&&x>=lft&&x<=rgt;
    if(onV||onH)return DISTRICT.FREEWAY;
  }
  if(x===L.railX)return DISTRICT.RAIL; // border to border (otherwise what's the point)
  // MOUNT CHARLESTON: the massif in the corner opposite the dam (bowl bulge)
  if(inRect(x,y,L.mtChar)){
    // estates ring on the massif's inner face (millionaires on the mountain)
    const inner=(x>=L.mtChar.x+2&&x<L.mtChar.x+L.mtChar.w-2&&y>=L.mtChar.y+2&&y<L.mtChar.y+L.mtChar.h-2);
    return inner? DISTRICT.MOUNTAIN : (hash2(L.seed,x,y)%4===0? DISTRICT.ESTATE: DISTRICT.MOUNTAIN);
  }
  // MOUNTAINS: wider, bulgier rims (bowl-shaped valley), foothill notches
  // become ESTATE ground (housing on the mountain borders, real Vegas pattern)
  if(!L.axisFlip){
    let mtnW=5+Math.round(Math.sin(y*0.25)*2.5), mtnE=5+Math.round(Math.cos(y*0.22)*2.5);
    let foot=false;
    for(const fy of L.footA){ if(Math.abs(y-fy)<4){ mtnW=Math.max(2,mtnW-3); foot=true; } }
    for(const fy of L.footB){ if(Math.abs(y-fy)<4){ mtnE=Math.max(2,mtnE-3); foot=true; } }
    if(x<mtnW||((N-1-x)<mtnE))return DISTRICT.MOUNTAIN;
    if(foot&&(x<mtnW+2||((N-1-x)<mtnE+2)))return DISTRICT.ESTATE;
    if(y<4&&x>6&&x<N-6)return DISTRICT.SOLAR;
  } else {
    let mtnN=5+Math.round(Math.sin(x*0.25)*2.5), mtnS=5+Math.round(Math.cos(x*0.22)*2.5);
    let foot=false;
    for(const fx of L.footA){ if(Math.abs(x-fx)<4){ mtnN=Math.max(2,mtnN-3); foot=true; } }
    for(const fx of L.footB){ if(Math.abs(x-fx)<4){ mtnS=Math.max(2,mtnS-3); foot=true; } }
    if(y<mtnN||((N-1-y)<mtnS))return DISTRICT.MOUNTAIN;
    if(foot&&(y<mtnN+2||((N-1-y)<mtnS+2)))return DISTRICT.ESTATE;
    if(x<4&&y>6&&y<N-6)return DISTRICT.SOLAR;
  }
  if(inRect(x,y,L.hri)||inRect(x,y,L.apSE)||inRect(x,y,L.apNW))return DISTRICT.AIRPORT;
  if(inRect(x,y,L.unlv)||inRect(x,y,L.csn))return DISTRICT.CAMPUS;
  if(inRect(x,y,L.railyard))return DISTRICT.RAILYARD;
  if(inRect(x,y,L.mall))return DISTRICT.MALL;
  if(inRect(x,y,L.sunsetPark)||inRect(x,y,L.craigRanch))return DISTRICT.PARK;
  if(inRect(x,y,L.medical))return DISTRICT.MEDICAL;
  if(inRect(x,y,L.convention))return DISTRICT.CONVENTION;
  if(inRect(x,y,L.stadiumA))return DISTRICT.STADIUM;
  if(inRect(x,y,L.speedway))return DISTRICT.SPEEDWAY;
  if(inRect(x,y,L.wp1)||inRect(x,y,L.wp2))return DISTRICT.WATERPARK;
  if(inRect(x,y,L.minigp))return DISTRICT.MINIGP;
  if(inRect(x,y,L.datafort))return DISTRICT.DATAFORT;
  if(inRect(x,y,L.watertreat))return DISTRICT.WATERTREAT;
  for(const s of L.reservoirs){ if(inRect(x,y,s))return DISTRICT.RESERVOIR; }
  if(inRect(x,y,L.pumpstation))return DISTRICT.PUMPSTATION;
  if(inRect(x,y,L.reclaim))return DISTRICT.RECLAIM;
  if(inRect(x,y,L.landfill))return DISTRICT.LANDFILL;
  for(const s of L.substations){ if(inRect(x,y,s))return DISTRICT.SUBSTATION; }
  if(inRect(x,y,L.cemetery)||inRect(x,y,L.cemetery2))return DISTRICT.CEMETERY;
  if(inRect(x,y,L.prison))return DISTRICT.PRISON;
  if(inRect(x,y,L.terminal))return DISTRICT.TERMINAL;
  if(inRect(x,y,L.sphere))return DISTRICT.SPHERE;
  if(inRect(x,y,L.cashman)||inRect(x,y,L.ballparkS))return DISTRICT.BALLPARK;
  if(inRect(x,y,L.boneyard))return DISTRICT.BONEYARD;
  if(inRect(x,y,L.fort))return DISTRICT.FORT;
  for(const c2 of L.chapels){ if(inRect(x,y,c2))return DISTRICT.CHAPEL; }
  for(const b of L.basins){ if(inRect(x,y,b))return DISTRICT.BASIN; }
  if(inRect(x,y,L.swapmeet))return DISTRICT.SWAPMEET;
  if(inRect(x,y,L.drivein))return DISTRICT.DRIVEIN;
  if(inRect(x,y,L.highroller))return DISTRICT.HIGHROLLER;
  if(inRect(x,y,L.vegassign))return DISTRICT.SIGN;
  if(inRect(x,y,L.strat))return DISTRICT.STRAT;
  if(inRect(x,y,L.arsenal))return DISTRICT.ARSENAL;
  for(const R of L.firestations){ if(inRect(x,y,R))return DISTRICT.FIRESTATION; }
  for(const R of L.policestations){ if(inRect(x,y,R))return DISTRICT.POLICESTATION; }
  if(inRect(x,y,L.jail))return DISTRICT.JAIL;
  if(inRect(x,y,L.courthouse))return DISTRICT.COURTHOUSE;
  if(inRect(x,y,L.cityhall))return DISTRICT.CITYHALL;
  if(inRect(x,y,L.warehouse))return DISTRICT.WAREHOUSE;
  if(inRect(x,y,L.battery))return DISTRICT.BATTERY;
  for(const R of L.fueldepots){ if(inRect(x,y,R))return DISTRICT.FUELDEPOT; }
  if(inRect(x,y,L.granary))return DISTRICT.GRANARY;
  if(inRect(x,y,L.library))return DISTRICT.LIBRARY;
  if(inRect(x,y,L.radiostation))return DISTRICT.RADIO;
  if(inRect(x,y,L.robofactory))return DISTRICT.ROBOFACTORY;
  if(inRect(x,y,L.springs))return DISTRICT.SPRINGS;
  if(inRect(x,y,L.luxor))return DISTRICT.LUXOR;
  for(const c of L.casinos){ if(inRect(x,y,c))return DISTRICT.CASINO; }
  for(const gc of L.gated){ if(inRect(x,y,gc))return DISTRICT.GATED; }
  for(const gf of L.golf){ if(inRect(x,y,gf))return DISTRICT.GOLF; }
  for(const s of L.schools){ if(inRect(x,y,s))return DISTRICT.SCHOOL; }
  // THE STRIP street + 2-cell RESORT buffer each side
  const inStripRun = y>N*0.30&&y<N*0.66;
  // the Blvd STREET continues past the resort run and touches the airport
  if((x===L.stripX||x===L.stripX-1)&&y>N*0.30&&y<L.hri.y+L.hri.h)return DISTRICT.STRIP;
  // resort wall OPENS at every mile crossing: E-W arterials run THROUGH the strip
  if(inStripRun&&(x===L.stripX-3||x===L.stripX-2||x===L.stripX+1||x===L.stripX+2)&&(y%9!==0))return DISTRICT.RESORT;
  // downtown/arts district sits a little EAST of the strip line, still touching it
  if(x>=L.stripX-2&&x<L.stripX+6&&y>N*0.22&&y<=N*0.30)return DISTRICT.DOWNTOWN;
  // ARTERIALS + DENSE SUB-BLOCK STREETS (max blob ~4x2)
  if(x%9===0||y%9===0)return DISTRICT.ARTERIAL;
  // LAS VEGAS WASH: dry channel toward Lake Las Vegas, BROKEN UP by the surface
  // streets crossing it (checked after roads). You can hop down into it; it is the
  // ENTRANCE to the storm/sewer system underneath the city where the Homeless live.
  for(let i=0;i<L.wash.length-1;i++){
    if(segDist(x,y,L.wash[i][0],L.wash[i][1],L.wash[i+1][0],L.wash[i+1][1])<0.8)return DISTRICT.WASH;
  }
  // SURFACE STREETS THROUGH THE BLOCKS (Paolo 7/5/26 + NO-STREET-BREAK LAW
  // 7/18/26): real Vegas is half-mile collectors between the mile arterials,
  // and they RUN CONTINUOUS for miles. The previous gen picked each block's
  // collector offset from hash2(seed,bx,by) — per BLOCK — so adjacent blocks'
  // collectors were offset by a cell and the grid read as a thousand
  // disconnected fragments (Paolo: "all these streets that are not connected
  // to each other").
  // FIX: the collector offset is per STRIP, not per block. A vertical
  // collector's column depends only on the mile-COLUMN (bx), so it lines up
  // straight down through every block in that column; a horizontal collector's
  // row depends only on the mile-ROW (by). Continuous avenues, fully connected.
  // The per-block "extra local street" is GONE — that fragmentation belongs in
  // the suburb plot interior (a finer layer), not the overmap grid.
  const bx=(x/9)|0, by=(y/9)|0;
  const colPick=4+((hash2(L.seed,bx,0)>>>3)&1);       // per mile-column
  const rowPick=4+((hash2(L.seed,0,by)>>>5)&1);       // per mile-row
  if((x%9)===colPick)return DISTRICT.ARTERIAL;        // continuous vertical collector
  if((y%9)===rowPick)return DISTRICT.ARTERIAL;        // continuous horizontal collector
  return null;
}

// NEIGHBORHOOD QUALITY (Paolo 7/5/26, grounded in real Vegas): east side = rough,
// extending north; Summerlin (far west, has LAKES) + Henderson (south) = good;
// SE transition where east meets Henderson; west fringe near residential borders =
// busier. Flips with the town mirror (side is spine-relative).
function qualityAt(x,y,L){
  const N=OVER_N;
  const dir=(L.fwyX<L.stripX)?1:-1;            // which way "town east" points
  const side=(x-L.stripX)*dir;
  let q=0.65;
  if(side>5&&y<N*0.58) q=0.25+Math.max(0,(N*0.58-y))/N*-0.1;   // east side rough
  if(y<N*0.30&&side>-6) q=Math.min(q,0.35);                      // rough reaches north
  if(y>N*0.62) q=0.85;                                           // Henderson south
  if(side>5&&y>N*0.55&&y<=N*0.62) q=0.3+((y-N*0.55)/(N*0.07))*0.55; // SE transition
  if(side<-12&&y>N*0.20&&y<N*0.70) q=0.9;                        // Summerlin
  if(side<0&&(y<N*0.18||y>N*0.80)) q=0.55;                       // west fringe busier
  return Math.max(0.1,Math.min(0.95,q));
}

// LANDLOCKED DISTRICT LAW (Paolo 7/21/26, LOCKED): "if there is an interior district not
// touching a street it has to be a suburb or apt complex." A cell 2+ tiles off every mile
// arterial line has no real street to front — only the suburb family (residential, whose own
// generator can relay a driveway/road out through a neighboring suburb cell, world.js's
// landlockConnect pass) is allowed there. DESERT stays legal (undeveloped land needs no access).
function proceduralDistrict(x,y,r,L){
  const N=OVER_N;
  const dStrip=Math.abs(x-L.stripX);
  const edge=Math.min(x,y,N-1-x,N-1-y);
  if(edge<8&&r()<0.5)return DISTRICT.DESERT;
  const q=qualityAt(x,y,L);
  const nearAx=(x%9===1||x%9===8), nearAy=(y%9===1||y%9===8);
  const streetAdjacent=nearAx||nearAy;                // touches (or is one tile off) a real mile arterial
  // SUMMERLIN LAKES: the west master-planned zone rolls small neighborhood lakes
  const dir=(L.fwyX<L.stripX)?1:-1, side=(x-L.stripX)*dir;
  if(side<-12&&y>N*0.20&&y<N*0.70&&r()<0.009)return DISTRICT.WATER; // rare, a touch of Summerlin lake vibe, not a lake district
  if(streetAdjacent&&r()<0.02+q*0.06)return DISTRICT.PARK;          // parks follow quality (street-fronting only)
  if(q<0.35&&r()<0.12)return DISTRICT.DESERT;       // rough side: vacant lots
  if(streetAdjacent&&q<0.42&&r()<0.03)return DISTRICT.TRAILER;      // trailer/RV parks in the rough fabric
  // HOMESTEADS (Paolo 7/5/26): people who took farming on their own, yard
  // crops + private well/cistern (real: the valley sits on groundwater,
  // thousands of private wells). Flag rides on the suburb cell.
  // (flag applied in post-pass so the suburb render + quality stay intact)
  if(streetAdjacent&&q<0.6&&r()<0.012)return DISTRICT.STORAGE; // self-storage sprawl
  const d1=Math.hypot(x-L.ind1.x,y-L.ind1.y), d2=Math.hypot(x-L.ind2.x,y-L.ind2.y);
  if(streetAdjacent&&(d1<3.2||d2<3.2)&&r()<0.9)return DISTRICT.INDUSTRIAL;
  if(nearAx&&nearAy&&r()<0.7)return DISTRICT.COMMERCIAL;   // the mile-grid CORNER: real Vegas piles retail here
  // CA HIGHWAY APPROACH: the 15 enters through DIRT before the city swallows it
  if(y>N*0.80&&Math.abs(x-L.fwyX)<6&&r()<0.93)return DISTRICT.DESERT;
  // DESERT POCKETS (Paolo 7/5/26): two DISTINCT desert zones, not a band:
  // (1) around the whole water cluster (Mead, Lake LV, Boulder City, the dam),
  // (2) around Nellis + the speedway. Normal city fabric between them.
  {
    const nearR=(R,m)=>x>=R.x-m&&x<R.x+R.w+m&&y>=R.y-m&&y<R.y+R.h+m;
    if((nearR(L.mead,6)||nearR(L.lakeLV,6)||nearR(L.boulder,6)||nearR(L.damR,6))&&r()<0.6)return DISTRICT.DESERT;
    if((nearR(L.airbase,5)||nearR(L.speedway,5))&&r()<0.55)return DISTRICT.DESERT;
  }
  if(!streetAdjacent) return DISTRICT.SUBURB; // LANDLOCKED: suburb/apt only, no exceptions (see law above)
  const v=r();
  const busier=(side<0&&(y<N*0.18||y>N*0.80))?0.10:0;  // west fringe busier
  // APARTMENT (7/21/26): real Vegas garden-apartment geography clusters near the strip/downtown
  // core, tapering fast toward the periphery where single-family sprawl dominates.
  if(dStrip<8){ return v<0.35+busier?DISTRICT.COMMERCIAL: v<0.55+busier?DISTRICT.APARTMENT: DISTRICT.SUBURB; }
  if(dStrip<18){ return v<0.15+busier?DISTRICT.COMMERCIAL: v<0.30+busier?DISTRICT.APARTMENT: DISTRICT.SUBURB; }
  return v<0.06+busier?DISTRICT.COMMERCIAL: v<0.10+busier?DISTRICT.APARTMENT: v<0.95?DISTRICT.SUBURB: DISTRICT.DESERT; // spread shrunk (Paolo)
}

function OM_rr(seed){ return (hash2(seed,911,373)%1000)/1000; }
function buildOvermap(seed){
  seed=seed>>>0||1;
  const L=layoutFromSeed(seed);
  const tiles=new Array(OVER_N*OVER_N);
  for(let y=0;y<OVER_N;y++)for(let x=0;x<OVER_N;x++){
    const fixed=skeleton(x,y,L);
    let d=fixed;
    if(!d){const r=rng((seed^(x*73856093)^(y*19349663))>>>0);d=proceduralDistrict(x,y,r,L);}
    tiles[y*OVER_N+x]={x,y,district:d,fixed:!!fixed,quality:qualityAt(x,y,L),seed:(seed^(x*2654435761)^(y*40503))>>>0};
  }
  const at=(x,y)=>(x<0||y<0||x>=OVER_N||y>=OVER_N)?null:tiles[y*OVER_N+x];
  // BIG ARCHITECTURE (Paolo 7/18/26): the ONLY things allowed to interrupt the
  // surface-street grid. Real physical masses (mountain/water/freeway/rail/wash/
  // the mines) and genuinely huge installations (airport/airbase/speedway/prison/
  // datafort/arsenal/landfill/stadium/ballpark/convention/waterpark) and Paolo's
  // blessed megablocks (the Strip and its casinos/luxor/sphere/highroller/strat).
  // EVERYTHING ELSE — a fire station, a school, a mall, a gated community, a
  // medical campus, downtown — is normal city fabric that sits IN its plot and
  // must NEVER break a street. "even monuments... would just be in their big ass
  // plots not breaking any city streets."
  const BIG=new Set([DISTRICT.MOUNTAIN,DISTRICT.WATER,DISTRICT.FREEWAY,DISTRICT.INTERCHANGE,DISTRICT.BELTWAY,
    DISTRICT.DAM,DISTRICT.RAIL,DISTRICT.RAILYARD,DISTRICT.WASH,DISTRICT.BASIN,DISTRICT.GYPSUM,DISTRICT.QUARRY,
    DISTRICT.INTAKE,DISTRICT.SOLAR,DISTRICT.AIRPORT,DISTRICT.AIRBASE,DISTRICT.SPEEDWAY,DISTRICT.PRISON,
    DISTRICT.DATAFORT,DISTRICT.ARSENAL,DISTRICT.LANDFILL,DISTRICT.BONEYARD,DISTRICT.WATERPARK,DISTRICT.MINIGP,
    DISTRICT.STADIUM,DISTRICT.BALLPARK,DISTRICT.CONVENTION,DISTRICT.SPRINGS,DISTRICT.STRIP,DISTRICT.RESORT,
    DISTRICT.CASINO,DISTRICT.LUXOR,DISTRICT.SPHERE,DISTRICT.HIGHROLLER,DISTRICT.STRAT,DISTRICT.SIGN,
    DISTRICT.TOWN,DISTRICT.TRUCKSTOP]);
  // GRID RE-ASSERT (Paolo 7/18/26, the aerial-map circles): landmark rects are
  // stamped in skeleton() BEFORE the arterial/collector lines, so any soft
  // landmark that overlapped a street cell ERASED it — that is every stub Paolo
  // circled. Punch the whole street grid (mile arterials + per-strip collectors,
  // the exact skeleton predicate) back through every soft landmark. BIG masses
  // keep their cell (they are the only legit street-break). The monument now
  // sits in its plot and the streets run around/through it, unbroken.
  for(const t of tiles){
    const x=t.x, y=t.y;
    let grid=(x%9===0||y%9===0);
    if(!grid){
      const bx=(x/9)|0, by=(y/9)|0;
      const colPick=4+((hash2(seed,bx,0)>>>3)&1);
      const rowPick=4+((hash2(seed,0,by)>>>5)&1);
      grid=((x%9)===colPick)||((y%9)===rowPick);
    }
    if(grid && !BIG.has(t.district) && t.district!==DISTRICT.ARTERIAL){
      t.district=DISTRICT.ARTERIAL; t.fixed=true;
    }
  }
  // FREEWAY CONNECTIVITY SWEEP (Paolo 7/5/26): any freeway cell not reachable
  // from the spine is a severed stub (cluster/rect cuts); it returns to desert.
  {
    const isF=(t)=>t&&(t.district===DISTRICT.FREEWAY||t.district===DISTRICT.INTERCHANGE);
    const seen=new Set(), stack=[[L.fwyX,90]];
    if(isF(at(L.fwyX,90))){ seen.add(L.fwyX+','+90);
      while(stack.length){ const [x,y]=stack.pop();
        for(const [nx,ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]){
          const k=nx+','+ny; if(seen.has(k))continue;
          if(isF(at(nx,ny))){seen.add(k);stack.push([nx,ny]);} } }
      for(const t of tiles){ if(t.district===DISTRICT.FREEWAY&&!seen.has(t.x+','+t.y))t.district=DISTRICT.DESERT; }
    }
  }
  // PARALLEL SIDE-STREET LAW (Paolo 7/5/26): no street parallel right next to
  // a freeway. That cell is frontage real estate; it fills with buildings.
  // Perpendicular crossings (over/underpasses) stay. Decided on a snapshot so
  // removals do not cascade.
  {
    const F=(t)=>t&&(t.district===DISTRICT.FREEWAY||t.district===DISTRICT.INTERCHANGE);
    const A=(t)=>t&&t.district===DISTRICT.ARTERIAL;
    const snap=tiles.map(t=>t.district);
    const sAt=(x,y)=>(x<0||y<0||x>=OVER_N||y>=OVER_N)?null:{district:snap[y*OVER_N+x]};
    const kill=[];
    for(const t of tiles){ if(t.district!==DISTRICT.ARTERIAL)continue;
      const fE=F(sAt(t.x+1,t.y))||F(sAt(t.x-1,t.y));
      const fN=F(sAt(t.x,t.y+1))||F(sAt(t.x,t.y-1));
      const aV=A(sAt(t.x,t.y-1))||A(sAt(t.x,t.y+1));
      const aH=A(sAt(t.x-1,t.y))||A(sAt(t.x+1,t.y));
      if(t.x%9===0||t.y%9===0)continue;     // mile arterials always punch through (grade-separated)
      if((fE&&aV)||(fN&&aH))kill.push(t);   // running parallel beside the freeway
    }
    for(const t of kill){ t.district=DISTRICT.SUBURB; t.hybrid=true; } // frontage lots
  }
  // OVERPASS / UNDERPASS (Paolo 7/5/26): where an arterial line crosses a
  // freeway, the crossing is grade-separated. Streets continue over or under.
  for(const t of tiles){ if(t.district!==DISTRICT.FREEWAY)continue;
    const onAx=(t.x%9===0), onAy=(t.y%9===0);
    if(onAx||onAy){ t.xing=(hash2(seed,t.x,t.y)&1)?'over':'under'; t.xdir=onAx?'v':'h'; }
  }
  // HYBRID NEIGHBORHOODS: building cells pressed against a freeway are hybrid
  // (a surface street's block with the freeway through the middle)
  for(const t of tiles){ if(t.district!==DISTRICT.SUBURB&&t.district!==DISTRICT.COMMERCIAL&&t.district!==DISTRICT.INDUSTRIAL)continue;
    const n=[at(t.x+1,t.y),at(t.x-1,t.y),at(t.x,t.y+1),at(t.x,t.y-1)];
    if(n.some(nn=>nn&&(nn.district===DISTRICT.FREEWAY||nn.district===DISTRICT.INTERCHANGE)))t.hybrid=true;
  }
  // HOMESTEAD TIERS (Paolo 7/5/26): LONE homesteads are single families
  // surviving by themselves, nobody's target. A WHOLE NEIGHBORHOOD doing the
  // self-sufficient thing together is a COMPOUND, and factions are interested.
  for(const t of tiles){ if(t.district!==DISTRICT.SUBURB)continue;
    const hq=hash2(seed,t.x*13,t.y*29)%1000;
    const band=(t.quality>0.35&&t.quality<0.75)?45:25;
    if(hq<band)t.homestead=true;
  }
  // COMPOUND NEIGHBORHOODS: 3 deliberate cul-de-sac collectives, 2x2-3x2
  // suburb blobs where the whole block organized (well shares, crop rotation,
  // a fence line). Every cell flagged homestead + compound.
  {
    const spots=[[Math.round(96*0.28),Math.round(96*0.56)],[Math.round(96*0.66),Math.round(96*0.40)],[Math.round(96*0.36),Math.round(96*0.76)]];
    for(let si=0;si<spots.length;si++){
      const jx=hash2(seed,si*7,101)%5-2, jy=hash2(seed,si*11,203)%5-2;
      let bx=spots[si][0]+jx, by=spots[si][1]+jy;
      const bw=2+(hash2(seed,si,17)%2), bh=2;
      // spiral outward until the whole blob is suburb ground (guaranteed)
      let ok=false;
      const fits=(x0,y0)=>{ if(x0<2||y0<2||x0+bw>94||y0+bh>94)return false;
        for(let dy=0;dy<bh;dy++)for(let dx=0;dx<bw;dx++){
          const c2=tiles[(y0+dy)*96+(x0+dx)];
          if(!c2||c2.district!==DISTRICT.SUBURB)return false; } return true; };
      outer2: for(let rad=0;rad<40;rad+=2){
        for(let oy=-rad;oy<=rad;oy+=2)for(let ox=-rad;ox<=rad;ox+=2){
          if(Math.max(Math.abs(ox),Math.abs(oy))!==rad)continue;
          if(fits(bx+ox,by+oy)){ bx+=ox; by+=oy; ok=true; break outer2; } } }
      if(ok){ for(let dy=0;dy<bh;dy++)for(let dx=0;dx<bw;dx++){
        const c2=tiles[(by+dy)*96+(bx+dx)]; c2.homestead=true; c2.compound=true; } }
    }
  }
  // FLAGS BATCH (Paolo 7/5/26): fremont canopy, chinatown, antenna farm,
  // industrial-road corridor, and SPORT PARK TYPES (soccer/baseball/football)
  {
    const dtC=Math.round(96*0.26);
    for(const t of tiles){
      // (canopy handled below: exactly 2 straight cells, Paolo 7/5/26)
      if(t.district===DISTRICT.COMMERCIAL){
        const dir=(L.fwyX<L.stripX)?1:-1, side=(t.x-L.stripX)*dir;
        const ychn=Math.round(96*0.42/9)*9;
        if(side<-6&&side>-22&&Math.abs(t.y-ychn)<=1)t.chinatown=true;          // Spring Mountain corridor
        if(Math.abs(t.x-L.railX)<=2&&t.y>96*0.35&&t.y<96*0.5)t.adult=true;     // Industrial Rd corridor
      }
      if(t.district===DISTRICT.MOUNTAIN&&((t.x<4&&Math.abs(t.y-48)<2)||(t.x>92&&Math.abs(t.y-58)<2)))t.antenna=true; // rim antenna farm
      if(t.district===DISTRICT.PARK){
        const hsp=hash2(seed,t.x*3,t.y*7)%8;
        t.sport=hsp<4?null:hsp===4?'soccer':hsp===5?'baseball':hsp===6?'football':null; // sport-typed parks
      }
    }
  }
  // FREMONT CANOPY: exactly TWO adjacent downtown cells, straight, no L
  {
    const dtC=Math.round(96*0.26);
    let row=null;
    for(const dy of [0,1,-1,2]){ const cand=tiles.filter(t=>t.district===DISTRICT.DOWNTOWN&&t.y===dtC+dy).sort((a,b)=>a.x-b.x);
      for(let i2=0;i2+1<cand.length;i2++){ if(cand[i2+1].x===cand[i2].x+1){ row=[cand[i2],cand[i2+1]]; break; } }
      if(row)break; }
    if(row){ row[0].canopy=true; row[1].canopy=true; }
  }
  // PARK SPLIT (Paolo verdict R, 7/5/26): only FAKE-GRASS parks stay
  // recreational. Real grass is food now. Sport fields (artificial turf)
  // keep the park; every plain-grass park cell gets plowed into FARM.
  for(const t of tiles){ if(t.district===DISTRICT.PARK&&!t.sport)t.district=DISTRICT.FARM; }
  // APEX SHELLS (Paolo verdict M, 7/5/26): the half-built frontier around
  // the landfill corridor, staged materials and skeleton framing
  {
    const lf=L.landfill;
    for(const t of tiles){
      const okA=t.district===DISTRICT.DESERT||t.district===DISTRICT.INDUSTRIAL||t.district===DISTRICT.SUBURB||t.district===DISTRICT.COMMERCIAL;
      if(!okA)continue;
      if(Math.abs(t.x-(lf.x+1))<=5&&Math.abs(t.y-(lf.y+1))<=5)t.apex=true;
    }
  }
  // RED ROCK (Paolo 7/5/26): PART of the west wall, not the whole range.
  // A sandstone band roughly a third of the rim, west-southwest like the real one.
  {
    const rr=OM_rr(seed);
    const b0=Math.round(96*(0.34+rr*0.08)), b1=b0+Math.round(96*0.22);
    for(const t of tiles){ if(t.district!==DISTRICT.MOUNTAIN)continue;
      if(!L.axisFlip){ if(t.x<10&&t.y>=b0&&t.y<=b1)t.redrock=true; }
      else { if(t.y<10&&t.x>=b0&&t.x<=b1)t.redrock=true; }
    }
  }
  // FOOD OVER BMX (Paolo locked 7/5/26, supersedes the BMX conversion):
  // every dead course is PLOWED. The irrigation is already in the ground, so
  // the fairways become farms. One course stays operational golf
  // [PENDING Paolo: does the last course get plowed too, or does someone
  // powerful keep it]. Crop strips still follow the old dogleg ghosts.
  for(const t of tiles){ if(t.district!==DISTRICT.GOLF)continue;
    let idx=-1; L.golf.forEach((R,i)=>{ if(t.x>=R.x&&t.x<R.x+R.w&&t.y>=R.y&&t.y<R.y+R.h)idx=i; });
    if(idx!==L.golfOp)t.district=DISTRICT.FARM;
  }
  // PARKS MUST TOUCH A STREET (Paolo 7/5/26): a road-less 1x1 park flips to
  // suburb. Big named parks are placed snapped beside arterials and exempt.
  for(const t of tiles){ if(t.district!==DISTRICT.PARK)continue;
    if(inRect(t.x,t.y,L.sunsetPark)||inRect(t.x,t.y,L.craigRanch))continue;
    const n=[at(t.x+1,t.y),at(t.x-1,t.y),at(t.x,t.y+1),at(t.x,t.y-1)];
    if(!n.some(nn=>nn&&ROAD[nn.district])) t.district=DISTRICT.SUBURB;
  }
  // COMPLEX LAW (Paolo 7/5/26): interior suburb cells with no street contact
  // read as APARTMENT/CONDO COMPLEXES (cul-de-sac fabric is drill-in scale).
  for(const t of tiles){ if(t.district!==DISTRICT.SUBURB)continue;
    const n=[at(t.x+1,t.y),at(t.x-1,t.y),at(t.x,t.y+1),at(t.x,t.y-1)];
    if(!n.some(nn=>nn&&ROAD[nn.district])) t.complex=true;
  }
  // COMMERCIAL MUST TOUCH A STREET (Paolo): else it flips to suburb
  for(const t of tiles){ if(t.district!==DISTRICT.COMMERCIAL)continue;
    const n=[at(t.x+1,t.y),at(t.x-1,t.y),at(t.x,t.y+1),at(t.x,t.y-1)];
    if(!n.some(nn=>nn&&ROAD[nn.district])) t.district=DISTRICT.SUBURB;
  }
  // STREET DEAD-END PRUNE (Paolo 7/18/26, NO-STREET-BREAK LAW): runs LAST, so
  // the stubs left dangling by the freeway sweep + parallel-side-street pass
  // get healed. Iteratively return any surface-street cell that dead-ends into
  // buildable lots (<=1 road neighbor, no real terminator, not the map edge)
  // back to desert, until the grid has no mid-block breaks. Mile arterials
  // (x%9==0 || y%9==0) are the grade-separated spine and are never pruned;
  // streets ending at a freeway/water/mountain/wash/strip/edge are real ends.
  // A street may END legitimately ONLY at: another road, a BIG mass (the only
  // thing allowed to break the grid), or the map edge. After the grid re-assert
  // punched collectors through every SOFT landmark, the only stubs left are
  // freeway-sweep leftovers and collectors that couldn't span a block. <=1 road
  // neighbor with NO big mass beside it = a nub poking into fabric (desert /
  // suburb / a soft landmark) -> prune it back. It unravels the dangling tail to
  // the last real junction and leaves the spanning grid whole.
  {
    let changed=true, guard=0;
    while(changed && guard++<60){ changed=false;
      for(const t of tiles){ if(t.district!==DISTRICT.ARTERIAL)continue;
        if(t.x%9===0||t.y%9===0)continue;
        let roadN=0, bigN=0, edge=false;
        for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
          const nn=at(t.x+dx,t.y+dy);
          if(!nn){edge=true;continue;}
          if(ROAD[nn.district])roadN++; else if(BIG.has(nn.district))bigN++;
        }
        if(roadN<=1 && bigN===0 && !edge){ t.district=DISTRICT.DESERT; changed=true; }
      }
    }
  }
  // STREET ISLAND PRUNE (Paolo 7/18/26, "look at all these streets that are not
  // connected to each other"): the dead-end prune heals stubs into OPEN lots,
  // but leaves orphan arterial fragments that are BOXED IN by real terminators
  // (an estate, the dam, a jail, rail, water, the map edge) — those have no OPEN
  // neighbor so the stub prune never touches them, yet they are cut off from the
  // mile grid: a street with no way in. Flood the road network from every mile
  // arterial (the grade-separated spine, always the main component); any ARTERIAL
  // not reached is an island -> return it to desert. Only arterials are pruned;
  // freeway/strip/downtown/beltway are masses of their own and stay put.
  {
    // road set matches the connectivity gate exactly (interchange/downtown/town
    // are traversable road too), so the flood measures the same grid the gate does.
    const ROADSET={freeway:1,arterial:1,strip:1,beltway:1,interchange:1,downtown:1,town:1};
    // Label every road cell with its connected component; keep the LARGEST (the
    // main grid) and demote orphan ARTERIALS in every other component. Even mile
    // arterials get pruned here: the spine itself is chopped by the mountain ring
    // and the dam, leaving 1-2 cell fragments against the map edge with no road
    // way in — a street connected to nothing, exactly what Paolo flagged.
    const comp=new Map();       // "x,y" -> component id
    const size=[];              // component id -> cell count
    let cid=0;
    for(const s of tiles){
      if(!ROADSET[s.district] || comp.has(s.x+','+s.y)) continue;
      const stack=[s]; comp.set(s.x+','+s.y,cid); let n=0;
      while(stack.length){
        const t=stack.pop(); n++;
        for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
          const nn=at(t.x+dx,t.y+dy);
          if(nn && ROADSET[nn.district] && !comp.has(nn.x+','+nn.y)){ comp.set(nn.x+','+nn.y,cid); stack.push(nn); }
        }
      }
      size[cid++]=n;
    }
    let main=0; for(let i=1;i<size.length;i++) if(size[i]>size[main]) main=i;
    for(const t of tiles){
      if(t.district===DISTRICT.ARTERIAL && comp.get(t.x+','+t.y)!==main) t.district=DISTRICT.DESERT;
    }
  }
  // ===== UNDERGROUND THIRD LAYER (Paolo 7/5/26) =====
  // Storm tunnels (the wash system the Homeless live in, 600+ real miles),
  // sewers (every flow ends at the reclamation plant, the 99% loop),
  // and the Boring loop (bored car tunnels under the resort corridor).
  // All 90-degree (street law holds underground).
  const under={storm:new Set(),sewer:new Set(),loop:new Set()};
  const K=(x,y)=>x+','+y;
  function lPath(set,x0,y0,x1,y1){ // vertical first, then horizontal
    const sy=y0<y1?1:-1; for(let y=y0;y!==y1;y+=sy)set.add(K(x0,y)); set.add(K(x0,y1));
    const sx=x0<x1?1:-1; for(let x=x0;x!==x1;x+=sx)set.add(K(x,y1)); set.add(K(x1,y1));
  }
  {
    // STORM: the wash channel itself runs underground beneath the city side,
    // trunks from downtown and the strip feed it, basins tie in
    const wx=L.wash[0][0], wy=L.wash[0][1];
    lPath(under.storm, L.stripX, Math.round(96*0.50), wx, wy);           // under-strip trunk (canon)
    lPath(under.storm, Math.round(L.stripX+((L.fwyX<L.stripX)?1:-1)*3), Math.round(96*0.27), wx, wy); // downtown trunk
    for(const b of L.basins){ lPath(under.storm, b.x+1, b.y+1, wx, wy); }
    // SEWER: subset grid under every other mile arterial, all L-pathed to the plant
    const rc={x:L.reclaim.x+1,y:L.reclaim.y+1};
    for(let gx=18;gx<96;gx+=18){ lPath(under.sewer, gx, 18, gx, 78); lPath(under.sewer, gx, 78, rc.x, rc.y); }
    for(let gy=18;gy<96;gy+=18){ lPath(under.sewer, 18, gy, 78, gy); }
    lPath(under.sewer, 78, 78, rc.x, rc.y);
    // BORING LOOP: convention center down the resort corridor to the airport,
    // one spur to downtown (real: LVCC loop growing across the corridor)
    const lc=L.stripX+((L.fwyX<L.stripX)?1:-1)*2;
    lPath(under.loop, L.convention.x+1, L.convention.y+1, lc, L.convention.y+1);
    lPath(under.loop, lc, L.convention.y+1, lc, L.hri.y+1);
    lPath(under.loop, lc, L.hri.y+1, L.hri.x+2, L.hri.y+1);
    lPath(under.loop, lc, Math.round(96*0.27), L.stripX+((L.fwyX<L.stripX)?1:-1)*4, Math.round(96*0.27));
    // real 2026 buildout: Spring Mountain / Chinatown spur, medical district,
    // Allegiant stadium stop
    const dirE2=(L.fwyX<L.stripX)?1:-1, ychn=Math.round(96*0.42/9)*9+1;
    lPath(under.loop, lc, ychn, L.stripX-dirE2*14, ychn);
    lPath(under.loop, lc, L.medical.y+1, L.medical.x+1, L.medical.y+1);
    lPath(under.loop, lc, L.stadiumA.y+1, L.stadiumA.x, L.stadiumA.y+1);
    // WEST STORM COLLECTOR: runoff comes off the west mountains too (real:
    // storms on the west/north rims race down washes into the valley)
    lPath(under.storm, Math.round(96*0.16), Math.round(96*0.55), wx, wy);
    // AQUEDUCT (4th system): intake -> treatment at the lake -> THROUGH the
    // rim (the real River Mountains Tunnel) -> pumping station -> reservoirs
    // FIBER BACKBONE (Paolo verdict L, 7/5/26): the long-haul trunk along
    // the 15 from the CA border to the data fortress. The Enron fiber the
    // fortress was born from. The wire the portraits traveled in on.
    under.fiber=new Set();
    { const df=L.datafort;
      lPath(under.fiber, L.fwyX-2, 94, L.fwyX-2, df.y+1);
      lPath(under.fiber, L.fwyX-2, df.y+1, df.x+1, df.y+1); }
    // DEEP TUNNEL (Paolo verdict W, 7/5/26, LOCKED): a tunnel system from
    // the data fortress goes DEEPER underground, connecting to the water
    // reclamation plant. Grounded: the fortress runs on 100% recycled
    // water. What else moves down there is the game's business.
    under.deep=new Set();
    { const df=L.datafort, rc2=L.reclaim;
      lPath(under.deep, df.x+1, df.y+1, df.x+1, rc2.y+1);
      lPath(under.deep, df.x+1, rc2.y+1, rc2.x+1, rc2.y+1); }
    // THE DEAD PIPES (Paolo 7/5/26, the educational mission): the two fuel
    // pipelines that fed the city. CalNev from the southwest along the 15,
    // UNEV from the northeast. Both dead, both visible in the UNDER view so
    // the player learns the city drank through straws.
    under.pipes=new Set();
    { const d1=L.fueldepots[0], d2=L.fueldepots[1];
      lPath(under.pipes, L.fwyX+2, 94, L.fwyX+2, d1.y);
      lPath(under.pipes, L.fwyX+2, d1.y, d1.x, d1.y);
      const neX=Math.min(94,L.beltRect.rgt+8);
      lPath(under.pipes, neX, 2, neX, d2.y);
      lPath(under.pipes, neX, d2.y, d2.x, d2.y); }
    under.aqueduct=new Set();
    lPath(under.aqueduct, L.intake.x, L.intake.y, L.watertreat.x+1, L.watertreat.y+1);
    lPath(under.aqueduct, L.watertreat.x+1, L.watertreat.y+1, L.pumpstation.x, L.pumpstation.y);
    for(const rv of L.reservoirs){ lPath(under.aqueduct, L.pumpstation.x, L.pumpstation.y, rv.x, rv.y); }
  }
  // ORPHANED ROAD CLEANUP (7/24/26, world-model research pass): a mile-arterial line can
  // get CHOPPED when a landmark (a desert TOWN, most often) gets placed directly across
  // its path — the line's cells on either side of the landmark survive as placed, but if
  // the far side never reconnects (blocked by water/mountain/another landmark), a bare
  // 1-cell road stub is left with NO road neighbor in any direction: undriveable, useless,
  // invisible to every reconnection mechanism this engine has (landlockConnect and the
  // access spur below both reconnect a DISTRICT to a street — neither touches a broken
  // STREET fragment, because a road isn't a "district" needing access to itself). Found via
  // landlocked_gate.js incidentally flagging an 'arterial' entry in its gap breakdown (it
  // was never designed to catch this — a street fragment isn't a landlocked district — but
  // the audit surfaced it anyway). A 1-cell island of road can never legitimately be
  // reached or driven; demoting it to DESERT (an always-valid tile) is strictly safer than
  // leaving a phantom street that goes nowhere. ROAD = {freeway,arterial,strip,beltway}
  // only — every one of those types is a continuous line/spine/ring by design, never a
  // legitimate lone cell, so this can't misfire on real, intentional road geometry.
  {
    const isRoadCell=(x,y)=>{ const c=at(x,y); return !!c&&!!ROAD[c.district]; };
    for(const t of tiles){
      if(!ROAD[t.district])continue;
      let hasRoadNeighbor=false;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ if(isRoadCell(t.x+dx,t.y+dy)){hasRoadNeighbor=true;break;} }
      if(!hasRoadNeighbor) t.district=DISTRICT.DESERT;
    }
  }
  // LANDMARK ACCESS SPUR (Paolo 7/21/26, LANDLOCKED DISTRICT LAW residual close-out): the
  // same-family relay (bohemia_world.js buildLandlockConnect) can't help an ISOLATED cell with
  // no same-type neighbor to chain through — a single-cell landmark (school/medical/jail/...),
  // or a suburb/apt pocket fully encircled by desert with no residential neighbor at all. Rather
  // than move a landmark's canon position (MAP LAW: Claude never designs map layouts), carve a
  // minimal 1-wide access spur to the nearest real street — but ONLY through bare DESERT cells,
  // never through another built district, so no existing content is ever overwritten. A
  // driveway to a monument, not a redesign of the block. Runs for every landlocked type
  // (including suburb-family): it only ever consumes desert, so it can't conflict with or
  // duplicate the same-family relay — strictly additive.
  // NO-STREET-BREAK LAW (Paolo 7/18/26) compliance: a 1-wide spur's tip cell would touch only
  // the target (non-road, non-BIG) + the previous spur cell, i.e. exactly ONE road neighbor —
  // street_connectivity_gate.js correctly reads that as "dead-ends into fabric." Cap the target
  // end with a self-contained 2x2 block instead: every cell in a solid 2x2 square has TWO
  // orthogonal neighbors inside the square itself, satisfying the rule independent of whatever
  // (school, suburb, ...) sits outside it — a real cul-de-sac bulb, not a bare dead end.
  {
    const touchesRoad=(x,y)=>{ for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const n=at(x+dx,y+dy); if(n&&ROAD[n.district])return true; } return false; };
    const okForBulb=(x,y)=>{ const c=at(x,y); return !!c&&(ROAD[c.district]||c.district===DISTRICT.DESERT); };
    function capWithBulb(px,py){
      const offsets=[[0,0,1,0,0,1,1,1],[-1,0,0,0,-1,1,0,1],[0,-1,1,-1,0,0,1,0],[-1,-1,0,-1,-1,0,0,0]];
      for(const o of offsets){
        const cells=[[px+o[0],py+o[1]],[px+o[2],py+o[3]],[px+o[4],py+o[5]],[px+o[6],py+o[7]]];
        if(cells.every(c=>okForBulb(c[0],c[1]))){
          for(const c of cells){ const cc=at(c[0],c[1]); if(cc&&cc.district===DISTRICT.DESERT){ cc.district=DISTRICT.ARTERIAL; cc.fixed=true; } }
          return true;
        }
      }
      return false;
    }
    for(const t of tiles){
      if(t.district===DISTRICT.DESERT||BIG.has(t.district))continue;
      if(touchesRoad(t.x,t.y))continue;                    // already street-adjacent, nothing to do
      // BFS outward through DESERT-only cells to the nearest street (or a cell that touches one)
      const key=(x,y)=>x+','+y, seen=new Set([key(t.x,t.y)]);
      let q=[{x:t.x,y:t.y,path:[]}], head=0, found=null;
      while(head<q.length&&!found&&head<200){
        const cur=q[head++];
        for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
          const nx=cur.x+dx, ny=cur.y+dy, k=key(nx,ny); if(seen.has(k))continue;
          const nc=at(nx,ny); if(!nc)continue;
          const isDesert=nc.district===DISTRICT.DESERT;
          if(!isDesert&&!ROAD[nc.district])continue;        // only desert or a real street may extend the path
          seen.add(k);
          const np={x:nx,y:ny,path:cur.path.concat([{x:nx,y:ny}])};
          if(ROAD[nc.district]||touchesRoad(nx,ny)){ found=np; break; }
          if(isDesert) q.push(np);
        }
      }
      if(!found||!found.path.length)continue;
      const tip=found.path[0];                              // path[0] is the cell touching the TARGET (not the
                                                              // street end at path[length-1], which already has
                                                              // the chain + the pre-existing street as neighbors)
      if(!capWithBulb(tip.x,tip.y))continue;                // no room for a compliant bulb: skip, stays residual
      for(const p of found.path){
        const pc=at(p.x,p.y);
        if(pc&&pc.district===DISTRICT.DESERT){ pc.district=DISTRICT.ARTERIAL; pc.fixed=true; }
      }
    }
  }
  return{seed,n:OVER_N,tileFine:TILE_FINE,tiles,layout:L,at,under,
    tileToFine(x,y){return{x0:x*TILE_FINE,y0:y*TILE_FINE,size:TILE_FINE};}};
}
function census(overmap){const c={};overmap.tiles.forEach(t=>{c[t.district]=(c[t.district]||0)+1;});return c;}

const API={buildOvermap,census,DISTRICT,OVER_N,TILE_FINE,SLOT_FINE,CELL_M,TILE_M,layoutFromSeed,rng,hash2,BIG};
if(typeof module!=='undefined'&&module.exports){module.exports=API;}
global.BohemiaOvermap=API;
})(typeof window!=='undefined'?window:globalThis);
