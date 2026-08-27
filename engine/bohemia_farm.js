// BOHEMIA FARM (7/21/26). INFRASTRUCTURE (agriculture), on the DISTRICT KIT. Research-first (farm
// site-plan guides — thehomesteady, agrothoughts, hobbyfarms): the FARMHOUSE sits at the front near
// the road with a yard; the BARN + SILOS + equipment SHEDS sit behind; CROP FIELDS (furrowed rows)
// dominate the land; IRRIGATION ditches/pivots feed them; a windbreak of trees lines the edges. In
// the dead Mojave the farm is a scarcity-economy prize (food) gone fallow. Act-1 DEAD: dry cracked
// fields, dead crop stubble, a derelict barn, empty silos, a rusted tractor. Street-aware + drivable
// (a farm road); the fields + barn + silos dominate (WALKABLE-LAND). Full dossier + layering.
// LEGEND:
//  0 desert  1 farm road (DRIVABLE)  2 building (farmhouse/shed)  3 windbreak tree  4 field soil  5 gate
//  6 silo  7 crop rows  8 irrigation  9 pole light  10 tractor  11 fence  12 farmyard  13 hay bales  14 barn
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;
  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    // a CROP FIELD: furrowed rows of dead stubble on cracked soil, bare patches
    function field(x0,y0,x1,y1){ G.rect(x0,y0,x1,y1,4);
      for(y=y0+1;y<y1;y+=3){ for(x=x0+1;x<x1;x++){ if(r()<0.82)set(x,y,7); } }   // furrow rows
      for(i=0;i<(x1-x0)*(y1-y0)*0.02;i++){ set(x0+Math.floor(r()*(x1-x0)),y0+Math.floor(r()*(y1-y0)),4); } // bare/dead patches
    }
    // ---- BASE: field soil, fenced; desert at the margins ----
    G.rect(0,0,W-1,H-1,0); G.rect(6,8,W-7,H-7,4); G.frame(11);
    // ---- CROP FIELDS (the hero — they dominate the land), split by irrigation ditches ----
    field(10,10,60,74); field(66,10,118,74); field(10,80,58,116);
    G.rect(62,10,64,116,8); G.rect(10,76,118,78,8);                      // irrigation ditches (dry) between fields
    for(i=0;i<10;i++){ var px=12+Math.floor(r()*104), py=12+Math.floor(r()*100); if(get(px,py)===7&&r()<0.3)set(px,py,8); } // pivot sprinkler heads
    // ---- FARMSTEAD at the SE: FARMHOUSE + yard, BARN (red) + SILOS + equipment SHED ----
    G.rect(70,88,90,104,2); G.rect(66,86,94,88,12); G.rect(66,104,94,116,12);  // farmhouse + its yard
    G.rect(98,84,116,104,14); for(x=100;x<=114;x+=4)set(x,84,2);         // the BARN (red) + roof vents
    G.disc(96,110,4,6); G.disc(106,110,4,6); G.disc(114,110,3,6);        // grain SILOS (round)
    G.rect(72,108,88,114,2);                                            // equipment shed
    G.rect(78,100,80,105,10); G.rect(100,106,102,111,10);               // a rusted tractor + combine
    G.rect(70,106,74,110,13); G.rect(92,90,96,94,13);                   // hay bales
    // ---- windbreak TREES lining the road + edges; pole lights ----
    for(y=12;y<=114;y+=7){ set(8,y,3); } for(x=12;x<=116;x+=9){ if(get(x,8)===11)set(x,8,3); }
    [[9,10],[118,10],[9,114],[64,110]].forEach(function(p){ set(p[0],p[1],9); });
    // ---- FARM ROAD from the SOUTH gate to the farmstead ----
    var gx=80;
    G.rect(gx-2,104,gx+2,H-1,1);
    for(y=H-1;y>=104;y--)for(x=-2;x<=2;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4||c===11||c===12)set(gx+x,y,1); }
    G.rect(64,100,116,103,1);                                          // farmyard access lane
    for(i=-2;i<=2;i++)set(gx+i,H-1,5);
    return g;
  }

  /* ONE FARM, NOT ONE PER CELL (8/26). The valley has 93 farm cells in thirteen blobs, and
     every cell was building a COMPLETE farmstead: a farmhouse, a barn, three grain silos, an
     equipment shed, a farmyard and its own fence ring. A nine-cell farm therefore had NINE
     FARMHOUSES AND NINE BARNS inside one boundary.

     THE THIRTEEN BLOBS ARE RIGHT AND STAY THIRTEEN. This is the one district where "one per
     blob" had to be checked rather than assumed: separate parcels really are separate farms.
     What is wrong is INSIDE a parcel. And the arithmetic settles it -- nine cells is 288 m
     square, about 8 hectares, which is ONE SMALL FARM. Nine farmsteads on eight hectares is
     not a hamlet, it is a rendering bug.

     SO: one farmstead per parcel, at the road, and the FIELDS get the rest -- which is what
     makes a farm read as a farm from the air. The furrows now run the full length of the
     parcel instead of stopping at every cell boundary, which is the difference between a
     ploughed field and a patchwork quilt. */
  function clusterFarm(seed,opts,b){
    var A=K.blob(seed,{bounds:b,cellX:opts.cellX,cellY:opts.cellY}), f=A.f;
    var streets=opts.streets||['S'];

    A.vrect(A.c.x0,A.c.y0,A.c.x1,A.c.y1,0);
    A.vrect(f.x0+6,f.y0+8,f.x1-7,f.y1-7,4);              // field soil over the parcel
    A.vframe(11);                                         // the PARCEL's fence, never a cell's

    /* THE FURROWS RUN THE LENGTH OF THE PARCEL. Laid off the DISTRICT with firstAt, so a row
       that starts outside this cell still lands on exactly the rows the neighbour's does --
       and a plough line crosses a cell boundary the way it crosses a field. */
    var fx0=f.x0+10, fx1=f.x1-11;
    for(var ry=A.firstAt(f.y0+11,3,A.c.y0-3); ry<=Math.min(f.y1-11,A.c.y1+3); ry+=3){
      for(var rx=fx0; rx<=fx1; rx++){
        if(A.vget(rx,ry)!==4) continue;
        if(A.rnd(rx,ry)<0.82) A.vset(rx,ry,7);
      }
    }
    /* IRRIGATION DITCHES splitting the parcel into fields, on the district's own grid so a
       ditch is one ditch and not one per cell. */
    var FW=Math.max(60,Math.round(f.w/3)), FH=Math.max(60,Math.round(f.h/3));
    /* AND A TRACK RUNS BESIDE EACH DITCH, which is not decoration either. A headland ring
       round the parcel is what a one-cell farm has, and on a 3x3 it leaves the CENTRE cell
       with no drivable surface at all -- a tractor could not reach the middle of the farm from
       any gate, and driveConnected said so. Real farms have a track between every pair of
       fields; that is what the ditch bank IS. */
    for(var dx2=A.firstAt(f.x0+FW,FW,A.c.x0-FW); dx2<=Math.min(f.x1-20,A.c.x1+FW); dx2+=FW){
      A.vrect(dx2,f.y0+10,dx2+2,f.y1-10,8);
      A.vrect(dx2+3,f.y0+10,dx2+5,f.y1-10,1);
    }
    for(var dy2=A.firstAt(f.y0+FH,FH,A.c.y0-FH); dy2<=Math.min(f.y1-20,A.c.y1+FH); dy2+=FH){
      A.vrect(f.x0+10,dy2,f.x1-11,dy2+2,8);
      A.vrect(f.x0+10,dy2+3,f.x1-11,dy2+5,1);
    }
    A.dress(8,40,7);                                      // pivot sprinkler heads out in the crop

    /* ---- THE FARMSTEAD, ONCE, at the parcel's south-east, where the road reaches it ---- */
    var hx=f.x1-58, hy=f.y1-40;
    A.vrect(hx,hy,hx+20,hy+16,2);                                        // farmhouse
    A.vrect(hx-4,hy-2,hx+24,hy,12); A.vrect(hx-4,hy+16,hx+24,hy+28,12);  // its yard
    A.vrect(hx+28,hy-4,hx+46,hy+16,14);                                  // the BARN
    for(var vx=hx+30; vx<=hx+44; vx+=4) A.vset(vx,hy-4,2);               // roof vents
    A.vell(hx+26,hy+22,4,4,6); A.vell(hx+36,hy+22,4,4,6); A.vell(hx+44,hy+22,3,3,6);   // grain SILOS
    A.vrect(hx+2,hy+20,hx+18,hy+26,2);                                   // equipment shed
    A.vrect(hx+8,hy+12,hx+10,hy+17,10); A.vrect(hx+30,hy+18,hx+32,hy+23,10);  // tractor + combine
    A.vrect(hx,hy+18,hx+4,hy+22,13); A.vrect(hx+22,hy+2,hx+26,hy+6,13);  // hay bales

    /* ---- THE FARM ROAD: from the parcel's road edge to the yard, and a headland track round
       the fields so a tractor reaches every one of them. On nine cells a single spur to the
       farmyard leaves most of the parcel unreachable from any gate. ---- */
    A.vrect(f.x0+7,f.y0+9,f.x1-8,f.y0+11,1); A.vrect(f.x0+7,f.y1-11,f.x1-8,f.y1-9,1);
    A.vrect(f.x0+7,f.y0+9,f.x0+9,f.y1-9,1); A.vrect(f.x1-10,f.y0+9,f.x1-8,f.y1-9,1);
    A.vrect(hx+10,hy+28,hx+14,f.y1-9,1);                                 // yard down to the headland
    A.vrect(f.x1-58,hy+26,f.x1-12,hy+28,1);                              // farmyard access lane

    // ---- WINDBREAK TREES down the west fence and along the north, pole lights on the corners
    for(var ty=A.firstAt(f.y0+12,7,A.c.y0-7); ty<=Math.min(f.y1-12,A.c.y1+7); ty+=7) A.vset(f.x0+8,ty,3);
    for(var tx=A.firstAt(f.x0+12,9,A.c.x0-9); tx<=Math.min(f.x1-12,A.c.x1+9); tx+=9)
      if(A.vget(tx,f.y0+8)===11) A.vset(tx,f.y0+8,3);
    [[f.x0+3,f.y0+4],[f.x1-3,f.y0+4],[f.x0+3,f.y1-4],[f.x1-3,f.y1-4]]
      .forEach(function(p){ A.vset(p[0],p[1],9); });

    var gates=A.gates(streets,5,1,[0,3,4,11,12],14);
    return {g:A.g, W:A.W, H:A.H, streets:streets, gates:gates, bounds:b,
      footprints:K.footprints(A.g,function(v){return v===2||v===14;})};
  }

  function generate(seed,opts){ opts=opts||{}; var streets=opts.streets||['S'];
    /* A LONE FARM CELL IS UNCHANGED: one cell is one small holding, and that art shipped. */
    var __b=opts.bounds;
    if(__b && (__b.x1>__b.x0 || __b.y1>__b.y0)) return clusterFarm(seed,opts,__b);

    var soft=function(c){ return c===0||c===3||c===4; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:12});
    var g=res.g; return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2||v===14;})}; }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }
  var PALETTE={0:'#1c1a15',1:'#4a4438',2:'#6a5f50',3:'#3a4520',4:'#57503a',5:'#c79a3f',6:'#8a8478',
    7:'#6a6238',8:'#46564f',9:'#8f8676',10:'#a86a3a',11:'#6a6a72',12:'#5a5540',13:'#8a7a44',14:'#8a4535'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt outside the fence (setback)'},
    1:{name:'farm road',          kind:'drive',      act1:'the dirt farm road — a truck/tractor reaches the farmstead from the gate (drivable)'},
    2:{name:'building (farmhouse/shed)',kind:'building',act1:'the farmhouse / equipment shed, weathered clapboard, windows dark', enter:'farmhouse interior: kitchen + rooms up front, the mud room + the shed\'s equipment bay off the yard'},
    3:{name:'windbreak tree',     kind:'tree-dead',  act1:'a dead windbreak tree lining the road / field edge', solid:true},
    4:{name:'field soil',         kind:'ground',     act1:'cracked dry field soil / a bare fallow patch'},
    5:{name:'gate',               kind:'gate',       act1:'the farm gate off the street, amber curb, a cattle grid'},
    6:{name:'silo',               kind:'structure',  act1:'a grain silo, corrugated steel, empty + rusting', solid:true},
    7:{name:'crop rows',          kind:'ground',     act1:'furrowed rows of dead crop stubble on the fields'},
    8:{name:'irrigation',         kind:'ground',     act1:'a dry irrigation ditch / a pivot sprinkler head, cracked', solid:false},
    9:{name:'pole light',         kind:'prop',       act1:'a yard pole light, head dark'},
    10:{name:'tractor',           kind:'vehicle',    act1:'a rusted tractor / combine dead in the yard, tyres flat', solid:true},
    11:{name:'fence',             kind:'structure',  act1:'the farm perimeter fence, posts leaning', solid:true},
    12:{name:'farmyard',          kind:'ground',     act1:'the packed-dirt farmyard around the house + barn'},
    13:{name:'hay bales',         kind:'prop',       act1:'weathered hay/straw bales, gone grey + collapsing', solid:true},
    14:{name:'barn',              kind:'building',   act1:'the barn, faded red paint peeling, doors sagging', solid:true, enter:'barn interior: the central threshing floor, stalls + a hay loft above, tack room off the side'}
  };
  var NOTES={
    summary:'A dead farm — furrowed crop fields gone fallow dominating the land, split by dry irrigation ditches, with the farmhouse + yard, a faded-red barn, grain silos, an equipment shed and a rusted tractor at the farmstead. A food prize gone to dust.',
    reference:['Farm site-plan guides (thehomesteady, agrothoughts, hobbyfarms): the FARMHOUSE sits at the FRONT near the road with a yard; the BARN + SILOS + equipment SHEDS sit BEHIND; CROP FIELDS dominate the land, fed by IRRIGATION planned early; a windbreak + logical traffic circulation tie it together.'],
    layout:['CROP FIELDS (furrowed dead stubble on cracked soil) are the hero — they dominate the land, split into blocks by dry IRRIGATION ditches (desert at the margins, fenced).',
      'The FARMSTEAD clusters at the SE: the FARMHOUSE + its packed-dirt yard, a faded-red BARN with roof vents, round grain SILOS, an equipment SHED, a rusted tractor + combine, weathered hay bales.',
      'A windbreak of dead trees lines the road + field edges.',
      'A dirt FARM ROAD runs from the south gate to the farmstead + a farmyard access lane.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the farm gate is on the primary street; a dirt farm road (code 1) reaches the farmstead from the curb (K.driveReachFromStreet). WALKABLE-LAND: the fields + barn + silos + farmhouse dominate; the road is minimal. Corner side streets get a pedestrian gate.',
    layering:'GROUND plane (walk/drive, flat): the field soil (4) + crop rows (7), irrigation (8), the farmyard (12), the farm road (1, drive), desert (0). STRUCTURES (¾ front face, solid): the FARMHOUSE/shed (2, ENTERABLE), the BARN (14, ENTERABLE -> threshing floor + loft), the SILOS (6), the fence (11). VEHICLES/PROPS (solid): the tractor (10), hay bales (13). PROPS: windbreak trees (3), pole lights (9). PORTALS: the gate (5). The fields are the low dominant plane; the red barn + silos + house are the vertical mass at the farmstead.',
    decisions:['Act-1 DEAD: fields fallow + cracked, crops dead stubble, the barn derelict, silos empty + rusting, a dead tractor. Food is the scarcity-economy prize — who farms here now is faction/economy canon (Paolo\'s).',
      'Infrastructure category (farm — agriculture). Zero purple.',
      'WALKABLE-LAND honored: fields + farmstead dominate; road minimal (a farm IS its fields, like a park is its lawn).',
      'Research-first (per the playbook): built from real farm site plans (house front / barn behind / fields dominate), not memory.']
  };
  K.register('farm', { generate:generate, body:function(c){return c===2||c===14;}, category:'infrastructure', palette:PALETTE, legend:LEGEND, notes:NOTES });
  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API; root.BohemiaFarm=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
