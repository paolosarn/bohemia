// BOHEMIA RAILYARD (7/21/26). INDUSTRIAL, on the DISTRICT KIT. Research-first (rail-yard guides —
// Wikipedia rail yard, railway-technical depot layout, classification yards): a fan of parallel
// CLASSIFICATION TRACKS holds sorted ROLLING STOCK + LOCOMOTIVES; an ENGINE SHED / maintenance depot;
// a CONTAINER stacking area worked by a GANTRY crane; a fueling + sand facility; all on ballast, fenced.
// Act-1 DEAD: rusted boxcars stranded on the tracks, a dead loco, containers rotting, the gantry
// seized. Street-aware + drivable (a service road); the tracks + stock + containers dominate (WALKABLE-
// LAND). Full dossier + layering.
// LEGEND:
//  0 desert  1 service road (DRIVABLE)  2 building (engine shed/depot/office)  3 dead brush
//  4 ballast/gravel  5 gate  6 rail track  7 rolling stock (boxcar)  8 locomotive  9 pole light
//  10 container  11 marking  12 fence  13 gantry crane
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;
  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    // ---- BASE: ballast/gravel, fenced; desert at the margins ----
    G.rect(0,0,W-1,H-1,0); G.rect(6,8,W-7,H-7,4); G.frame(12);
    // ---- ENGINE SHED / maintenance depot + office at the west end ----
    G.rect(8,12,30,72,2); for(y=16;y<=68;y+=6) set(8,y,11);              // long shed with bay lines
    G.rect(8,78,30,96,2);                                                // office / fuel + sand shed
    // ---- the FAN of CLASSIFICATION TRACKS (the hero) with sorted ROLLING STOCK + a LOCO ----
    for(var ty=16; ty<=104; ty+=7){ G.rect(34,ty,116,ty,6);             // a running rail (steel line)
      for(x=34;x<=116;x+=3) set(x,ty,6);                                 // ties/rail texture
      for(var bx=36; bx<=110; bx+=9){                                    // boxcars / loco sorted on the track
        if(r()<0.30) continue;                                          // a gap (track partly empty)
        var loco=r()<0.12;
        G.rect(bx,ty-2,bx+6,ty+1,loco?8:7);                             // a car body straddling the rail
      }
    }
    // ---- CONTAINER stacking yard + a GANTRY crane spanning it (SE) ----
    for(var cy=80; cy<=104; cy+=6)for(var cx=88; cx<=114; cx+=8){ if(r()<0.85)G.rect(cx,cy,cx+6,cy+4,10); }
    G.rect(86,78,116,79,13); G.rect(86,78,86,106,13); G.rect(116,78,116,106,13); // gantry rails + legs
    G.rect(98,76,104,80,13);                                            // the gantry trolley/hoist
    // ---- pole lights, dead brush, a SERVICE ROAD from the gate to the depot ----
    [[9,12],[118,12],[9,104],[70,104]].forEach(function(p){ set(p[0],p[1],9); });
    for(i=0;i<12;i++){ var bx2=7+Math.floor(r()*3), by2=10+Math.floor(r()*(H-20)); if(get(bx2,by2)===12)set(bx2,by2,3); }
    var gx=20;
    G.rect(gx-2,96,gx+2,H-1,1);                                          // service road to the depot
    for(y=H-1;y>=96;y--)for(x=-2;x<=2;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4||c===12)set(gx+x,y,1); }
    G.rect(8,110,120,114,1);                                            // a yard service lane along the front
    for(i=-2;i<=2;i++)set(gx+i,H-1,5);
    return g;
  }

  /* ONE YARD, NOT SIX (8/26). The valley's railyard is a 3x2 blob and every one of its six
     cells was building a COMPLETE yard: its own engine shed, its own office, its own
     container stack, its own gantry crane, its own perimeter fence. Six sheds and six
     gantries in a block 288 m across.

     A YARD TAKES BOUNDS, NOT NEIGHBOURS, and that is the difference from the wash. A channel
     is a LINE -- it needs to know which sides it arrives and leaves on. A classification yard
     is an AREA: one shed at the west end, one container stack at the east, and a fan of
     tracks running the whole length between them. That is the solar farm's shape, so it gets
     the solar farm's treatment: lay the yard out ONCE in valley tiles against the blob's
     bounds, and let each cell keep only its own window.

     AND THE STOCK ON THE TRACKS IS PLACED BY POSITION, NOT BY THE CELL'S RNG. Every cell has
     its own seed, so a boxcar decided with `r()` would exist in one cell and not in the
     neighbour that shares the same rail -- a wagon cut in half at every cell boundary. The
     gaps and the locomotives come from a hash of the VALLEY coordinate and the BLOB, so the
     same rail carries the same train however many cells it crosses. */
  function clusterYard(seed,opts,b){
    var G=K.grid(seed>>>0), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    var streets=opts.streets||['S'];
    var cellX=opts.cellX||0, cellY=opts.cellY||0;
    var cx=cellX*W, cy=cellY*H, wx1=cx+W-1, wy1=cy+H-1;
    var fx0=b.x0*W, fx1=(b.x1+1)*W-1, fy0=b.y0*H, fy1=(b.y1+1)*H-1;
    /* ONE SEED FOR THE WHOLE YARD, off the blob's own corner, so every cell of it agrees
       about where the trains are without any cell being able to see the others. */
    var bseed=((b.x0*73856093) ^ (b.y0*19349663) ^ 0x5f3a) >>> 0;
    function yrnd(a,c){ var n=(bseed ^ Math.imul(a,2654435761) ^ Math.imul(c,40503)) >>> 0;
      n = Math.imul(n ^ (n>>>16), 2246822507); n = Math.imul(n ^ (n>>>13), 3266489909);
      return ((n ^ (n>>>16)) >>> 0) / 4294967296; }
    function vset(vx,vy,c){ var lx=vx-cx, ly=vy-cy; if(lx>=0&&ly>=0&&lx<W&&ly<H) g[ly][lx]=c; }
    function vget(vx,vy){ var lx=vx-cx, ly=vy-cy; return (lx>=0&&ly>=0&&lx<W&&ly<H)?g[ly][lx]:-1; }
    function vrect(x0,y0,x1,y1,c){ if(x1<cx||x0>wx1||y1<cy||y0>wy1) return;
      var xa=Math.max(x0,cx), xb=Math.min(x1,wx1), ya=Math.max(y0,cy), yb=Math.min(y1,wy1), xx, yy;
      for(yy=ya;yy<=yb;yy++) for(xx=xa;xx<=xb;xx++) g[yy-cy][xx-cx]=c; }
    /* the first multiple of `step` at or past `atLeast`, so a loop that starts outside this
       cell still lands on the same rows the neighbour's does */
    function firstAt(from,step,atLeast){ return (atLeast<=from)?from:(from+Math.ceil((atLeast-from)/step)*step); }

    // ---- BASE: ballast inside the YARD's boundary, desert at the yard's margins ----
    vrect(cx,cy,wx1,wy1,0);
    vrect(fx0+6,fy0+8,fx1-6,fy1-6,4);
    // the fence is the YARD's perimeter. An interior cell gets none, which is the point:
    // a chain-link fence through the middle of one yard is a wall that should not be there.
    vrect(fx0,fy0,fx1,fy0,12); vrect(fx0,fy1,fx1,fy1,12);
    vrect(fx0,fy0,fx0,fy1,12); vrect(fx1,fy0,fx1,fy1,12);

    // ---- ENGINE SHED + office, ONCE, at the yard's west end ----
    vrect(fx0+8,fy0+12,fx0+30,fy0+72,2);
    for(y=firstAt(fy0+16,6,cy-6); y<=Math.min(fy0+68,wy1+6); y+=6) vset(fx0+8,y,11);   // bay lines
    vrect(fx0+8,fy0+78,fx0+30,fy0+96,2);                                               // office / fuel + sand

    // ---- the FAN of CLASSIFICATION TRACKS, running the WHOLE yard, with sorted stock ----
    var tx0=fx0+34, tx1=fx1-12;
    for(var ty=firstAt(fy0+16,7,cy-4); ty<=Math.min(fy1-24,wy1+4); ty+=7){
      vrect(tx0,ty,tx1,ty,6);
      for(var bx=firstAt(tx0+2,9,cx-8); bx<=Math.min(tx1-6,wx1+8); bx+=9){
        if(yrnd(bx,ty)<0.30) continue;                                  // a gap: the track is partly empty
        var loco=yrnd(bx+7,ty+3)<0.12;
        vrect(bx,ty-2,bx+6,ty+1,loco?8:7);                              // a car body straddling the rail
      }
    }

    // ---- CONTAINER stacking yard + the GANTRY that works it, ONCE, at the yard's SE ----
    var gx0=fx1-42, gx1=fx1-12, gy0=fy1-30, gy1=fy1-4;
    for(var ccy=firstAt(gy0+2,6,cy-6); ccy<=Math.min(gy1-4,wy1+6); ccy+=6)
      for(var ccx=firstAt(gx0+2,8,cx-8); ccx<=Math.min(gx1-8,wx1+8); ccx+=8){
        if(yrnd(ccx,ccy+11)<0.15) continue;
        vrect(ccx,ccy,ccx+6,ccy+4,10);
      }
    vrect(gx0,gy0,gx1,gy0+1,13); vrect(gx0,gy0,gx0,gy1,13); vrect(gx1,gy0,gx1,gy1,13);  // rails + legs
    vrect(gx0+12,gy0-2,gx0+18,gy0+2,13);                                                 // trolley / hoist

    // ---- pole lights on the YARD's corners, dead brush on its fence line ----
    [[fx0+3,fy0+4],[fx1-3,fy0+4],[fx0+3,fy1-4],[fx1-3,fy1-4]].forEach(function(p){ vset(p[0],p[1],9); });
    /* THE DRESSING KEEPS OFF THE SEAM, one tile in on every side. Scattered brush does not
       line up with the neighbour's, and a single tumbleweed on the boundary row is enough to
       make one cell's ballast meet the next cell's desert -- the same thing that broke seven
       of the wash's forty-four seams before it was inset. */
    for(i=0;i<14;i++){ var bx2=cx+1+Math.floor(r()*(W-2)), by2=cy+1+Math.floor(r()*(H-2));
      if(vget(bx2,by2)===12) vset(bx2,by2,3); }

    /* ---- THE SERVICE ROADS, AND WHY THERE IS A RING ----
       The first cut ran ONE lane along the yard's south front, which is what a single-cell
       yard has. Across a 3x2 blob that leaves the whole top row with no drivable surface at
       all: a maintenance vehicle could not reach four of the six cells from any gate, and
       driveConnected said so for five street placements. A yard this size has a perimeter
       access road inside the fence -- that is how they are actually built, it is what the
       gate is really asking about, and it sits in the desert margin between the fence and
       the ballast where nothing else wants to be. */
    vrect(fx0+2,fy0+2,fx1-2,fy0+5,1); vrect(fx0+2,fy1-5,fx1-2,fy1-2,1);   // north + south runs
    vrect(fx0+2,fy0+2,fx0+5,fy1-2,1); vrect(fx1-5,fy0+2,fx1-2,fy1-2,1);   // west + east runs
    vrect(fx0+8,fy1-18,fx1-8,fy1-14,1);          // the yard lane along the working front
    vrect(fx0+18,fy0+96,fx0+22,fy1-14,1);        // depot road down to the lane

    /* GATE + APRON on every street this cell actually fronts, and only on the yard's own
       EDGE. An interior cell must never punch a gate: that is a gate in the middle of a
       railyard. A perimeter cell that fronts a street still gets one, which is how a yard
       this size really works -- a main gate plus service gates. */
    var gates=[];
    streets.forEach(function(edge){
      if(edge==='S'&&wy1!==fy1) return; if(edge==='N'&&cy!==fy0) return;
      if(edge==='E'&&wx1!==fx1) return; if(edge==='W'&&cx!==fx0) return;
      var s2, w2, c2;
      if(edge==='S'||edge==='N'){ var ggx=Math.floor(W*0.5), ggy=(edge==='S')?H-1:0, dir=(edge==='S')?-1:1;
        for(i=-2;i<=2;i++) g[ggy][ggx+i]=5;
        for(s2=1;s2<=M(14);s2++){ var yy=ggy+dir*s2; if(yy<=0||yy>=H-1)break;
          for(w2=-2;w2<=2;w2++){ c2=g[yy][ggx+w2]; if(c2===0||c2===3||c2===4||c2===12) g[yy][ggx+w2]=1; } }
        gates.push({edge:edge,x:ggx,y:ggy});
      } else { var ggy2=Math.floor(H*0.5), ggx2=(edge==='E')?W-1:0, dir2=(edge==='E')?-1:1;
        for(i=-2;i<=2;i++) g[ggy2+i][ggx2]=5;
        for(s2=1;s2<=M(14);s2++){ var xx=ggx2+dir2*s2; if(xx<=0||xx>=W-1)break;
          for(w2=-2;w2<=2;w2++){ c2=g[ggy2+w2][xx]; if(c2===0||c2===3||c2===4||c2===12) g[ggy2+w2][xx]=1; } }
        gates.push({edge:edge,x:ggx2,y:ggy2});
      }
    });
    return {g:g, W:W, H:H, streets:streets, gates:gates, bounds:b,
      footprints:K.footprints(g,function(v){return v===2;})};
  }

  function generate(seed,opts){ opts=opts||{}; var streets=opts.streets||['S'];
    /* A LONE YARD CELL IS UNCHANGED. Canonical-south plus rotateToStreet is the right answer
       for one cell and it is art that already shipped; only a yard that actually spans more
       than one cell takes the cluster path, because only then is there a neighbour's half of
       the same yard to line up with. */
    var b=opts.bounds;
    if(b && (b.x1>b.x0 || b.y1>b.y0)) return clusterYard(seed,opts,b);
    var soft=function(c){ return c===0||c===3||c===4; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:12});
    var g=res.g;
    /* THE BRUSH IN THE BALLAST AND THE FENCE (code 3), 8/23. Authored and never placed, one
       of four in this family. A live yard sprays its fence line; a dead one does not, and the
       brush is the clock. On the setback (0) against the perimeter fence (12). */
    K.stencil(g, {on:0, near:12, mark:3, count:22, seed:(seed>>>0)||1});
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})}; }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }
  var PALETTE={0:'#1c1a15',1:'#45433c',2:'#6a6358',3:'#3f382c',4:'#4a4640',5:'#c79a3f',6:'#565048',
    7:'#7a5548',8:'#46545e',9:'#8f8676',10:'#a8683e',11:'#c9c1aa',12:'#6a6a72',13:'#9a948a'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt outside the fence (setback)'},
    1:{name:'service road',       kind:'drive',      act1:'the yard service road — a truck reaches the depot from the gate (drivable)'},
    2:{name:'building (engine shed/depot/office)',kind:'building',act1:'the engine shed / maintenance depot + office + fuel/sand shed, dark', enter:'depot interior: the inspection + light-maintenance bays (pits in the floor), the heavy shop + office off the side'},
    3:{name:'dead brush',         kind:'tree-dead',  act1:'dead brush up through the ballast and caught in the fence, on track nothing has run over since', solid:false},
    4:{name:'ballast / gravel',   kind:'ground',     act1:'the crushed-stone ballast + gravel of the yard'},
    5:{name:'gate',               kind:'gate',       act1:'the yard gate off the street, amber curb'},
    6:{name:'rail track',         kind:'ground',     act1:'a steel running rail on ties — the classification tracks fanned across the yard'},
    7:{name:'rolling stock (boxcar)',kind:'vehicle', act1:'a rusted freight car stranded on the track, doors sprung', solid:true},
    8:{name:'locomotive',         kind:'vehicle',    act1:'a dead diesel locomotive on the track, cab dark, hulking', solid:true},
    9:{name:'pole light',         kind:'prop',       act1:'a yard pole light, head dark'},
    10:{name:'container',         kind:'structure',  act1:'a shipping container in the stacking yard, paint faded + streaked, doors ajar', solid:true},
    11:{name:'marking',           kind:'marking',    act1:'faded shed-bay / yard markings'},
    12:{name:'perimeter fence',   kind:'structure',  act1:'the yard perimeter fence, wire sagging', solid:true},
    13:{name:'gantry crane',      kind:'structure',  act1:'the container gantry crane spanning the stack — rails, legs, a seized hoist trolley', solid:true}
  };
  var NOTES={
    summary:'A dead railyard — a fan of classification tracks holding rusted boxcars + a dead locomotive, an engine shed / maintenance depot, a container stacking yard under a seized gantry crane, a fuel + sand shed, all on ballast behind the fence.',
    reference:['Rail-yard guides (Wikipedia rail yard, railway-technical depot layout, classification yards): a fan of parallel CLASSIFICATION TRACKS sorts + stores ROLLING STOCK + LOCOMOTIVES; an ENGINE SHED / maintenance depot (inspection pits, light + heavy shops); a CONTAINER stacking area worked by a GANTRY crane; a fueling + sand facility; all on ballast.'],
    layout:['The yard is ballast/gravel inside the perimeter fence (desert at the margins); an ENGINE SHED / depot + a fuel/sand + office building line the west end.',
      'A FAN of parallel CLASSIFICATION TRACKS (the hero) crosses the yard, sorted rusted BOXCARS + a dead LOCOMOTIVE stranded along them, gaps where cars were pulled.',
      'A CONTAINER stacking yard fills the SE, spanned by a seized GANTRY crane on its rails.',
      'A service road runs from the gate to the depot + a yard service lane along the front.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the yard gate is on the primary street; a service road (code 1) reaches the depot from the curb (K.driveReachFromStreet). WALKABLE-LAND: the tracks + rolling stock + containers + buildings dominate; the road is minimal. Corner side streets get a pedestrian gate.',
    layering:'GROUND plane (walk/drive, flat): the ballast (4), the rail tracks (6, walk across the ties), the service road (1, drive), markings (11), desert (0). STRUCTURES (¾ front face, solid): the depot/shed/office (2, ENTERABLE), the CONTAINERS (10), the GANTRY crane (13), the perimeter FENCE (12). VEHICLES (solid): the BOXCARS (7) + LOCOMOTIVE (8) on the rails. PROPS: pole lights (9). PORTALS: the gate (5). The rolling stock + containers + gantry are the mass; you walk the ballast + tracks between them.',
    decisions:['Act-1 DEAD: rusted boxcars + a dead loco stranded, containers rotting + ajar (picked over), the gantry seized. The rolling stock + containers are salvage/shelter (Paolo + the economy rule the loot).',
      'Industrial category (railyard). Zero purple. No railroad/reporting marks (generic stock).',
      'WALKABLE-LAND honored: tracks + stock + containers + buildings dominate; the road is minimal.',
      'Research-first (per the playbook): built from real rail-yard + depot layouts, not memory.']
  };
  K.register('railyard', { generate:generate, body:function(c){return c===2;}, category:'industrial', palette:PALETTE, legend:LEGEND, notes:NOTES });
  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API; root.BohemiaRailyard=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
