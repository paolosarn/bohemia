// BOHEMIA GOLF COURSE (7/20/26). LEISURE, on the DISTRICT KIT. Research-first (golf course design
// guides — Under Armour "Golf Course Layout 101", Keiser College of Golf, Archweb): every hole is
// a TEE BOX -> winding FAIRWAY (mown play corridor) through ROUGH -> GREEN with a PIN, guarded by
// SAND BUNKERS + WATER HAZARDS; the CLUBHOUSE + pro shop + PARKING + DRIVING RANGE + putting green
// cluster at the entrance, and CART PATHS thread the whole course (front nine heads out, back nine
// comes back). One 96m cell holds a SECTION of the course (a full course is ~50ha): the clubhouse
// complex on the street + a few holes winding away. Act-1 DEAD: brown dead fairways + rough, dry
// cracked pond beds, sand traps still there, weeds, abandoned clubhouse, cracked cart paths, a
// forgotten cart. Street-aware + drivable (the parking + cart-path network is the car surface,
// reachable from the curb). Full dossier + layering below.
// LEGEND:
//  0 desert dead-ground (out of bounds)  1 cart path / parking asphalt (DRIVABLE)
//  2 building (clubhouse / pro shop)      3 dead rough (scrub between holes)
//  4 dead fairway (mown corridor)         5 gate / entrance
//  6 green (putting surface)              7 sand bunker (trap)
//  8 dry water hazard (cracked pond bed)  9 tee box
//  10 flagstick / pin                    11 driving-range mat / target
//  12 dead tree / landscaping            13 abandoned golf cart
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    // entrance + clubhouse at the SOUTH (on the street); the course winds away to the NORTH.
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    // a FAIRWAY WORM: overlapping discs along a polyline of control points -> an organic mown
    // corridor (real fairways bend; they are never straight rectangles).
    function worm(pts,rad,code,minR){
      minR=(minR==null)?2:minR;
      for(i=0;i<pts.length-1;i++){ var a=pts[i], b=pts[i+1], steps=Math.max(1,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])));
        for(var s=0;s<=steps;s++){ var t=s/steps, cx=Math.round(a[0]+(b[0]-a[0])*t), cy=Math.round(a[1]+(b[1]-a[1])*t);
          var rr=rad+ (r()<0.5?0:1) - (r()<0.25?1:0); G.disc(cx,cy,Math.max(minR,rr),code); } }
    }
    function scatter(x0,y0,x1,y1,onto,code,dens){ for(var k=0;k<(x1-x0)*(y1-y0)*dens;k++){ var tx=x0+Math.floor(r()*(x1-x0)),ty=y0+Math.floor(r()*(y1-y0)); if(get(tx,ty)===onto)set(tx,ty,code); } }

    // ---- BASE: the whole parcel is dead ROUGH (dry scrub), desert only at the very margins ----
    G.rect(0,0,W-1,H-1,3);
    G.rect(0,0,W-1,4,0); G.rect(0,H-5,W-1,H-1,0); G.rect(0,0,4,H-1,0); G.rect(W-5,0,W-1,H-1,0);

    // ---- HOLES: tee -> winding fairway -> green (with pin), bunkers + a dry pond guarding ----
    // seeded jitter so no two golf cells are identical (fairway bends, pond present/absent).
    var j=function(a){ return Math.round((r()-0.5)*a); };
    // Hole 1 — heads out to the NE (the front-nine "out")
    var t1=[34,H-24];
    worm([t1,[46+j(6),H-52],[70+j(8),H-74],[92+j(6),34]], 5, 4);
    G.disc(94,30,7,6); set(94,30,10);                                    // green 1 + pin
    G.disc(80,44,4,7); G.disc(101,42,3,7);                               // greenside bunkers
    G.rect(t1[0]-3,t1[1]-2,t1[0]+3,t1[1]+2,9);                           // tee box 1
    // Hole 2 — bends back NW (the "in"), guarded by the water hazard
    var t2=[96,52];
    worm([t2,[74+j(8),58],[48+j(8),52],[26,40]], 5, 4);
    G.disc(24,38,7,6); set(24,38,10);                                    // green 2 + pin
    G.disc(40,52,5,7);                                                   // fairway bunker
    G.rect(t2[0]-3,t2[1]-2,t2[0]+3,t2[1]+2,9);                           // tee box 2
    // Hole 3 — short north hole
    var t3=[30,64];
    worm([t3,[40+j(6),40],[54,24]], 4, 4);
    G.disc(56,22,6,6); set(56,22,10);                                    // green 3 + pin
    G.disc(46,30,3,7);                                                   // bunker
    G.rect(t3[0]-3,t3[1]-2,t3[0]+3,t3[1]+2,9);                           // tee box 3
    // WATER HAZARD (dry cracked pond) — some courses on this section, some not (seed)
    if(r()<0.7){ G.disc(64+j(8),58,8,8); G.disc(58,64,5,8); }

    // dead landscaping trees dotted through the rough (never on fairway/green)
    scatter(8,10,W-8,H-20,3,12,0.010);

    // ---- CLUBHOUSE COMPLEX at the entrance (south): pro shop, parking, range, putting green ----
    var cxm=W>>1;
    G.rect(cxm-16,H-16,cxm+16,H-8,2);                                    // clubhouse + pro shop (enterable)
    G.rect(cxm-30,H-16,cxm-20,H-8,1);                                    // parking lot (west of clubhouse)
    G.rect(cxm+20,H-16,cxm+30,H-8,1);                                    // parking lot (east)
    for(y=H-15;y<=H-9;y+=2){ set(cxm-25,y,13); }                          // a stall marker/cart in the lot
    G.rect(cxm-30,H-24,cxm-8,H-18,4); G.rect(cxm-30,H-24,cxm-30,H-18,9);  // DRIVING RANGE (mown tee line + mats)
    for(x=cxm-28;x<=cxm-10;x+=5)set(x,H-23,11);                           // range mats along the tee line
    for(y=H-40;y<=H-30;y+=4)for(x=cxm-28;x<=cxm-8;x+=6)set(x,y,11);       // range target flags downrange
    G.disc(cxm+16,H-24,5,6); set(cxm+16,H-24,10);                         // practice PUTTING GREEN by the clubhouse

    // ---- CART PATHS: a thin pale-concrete PERIMETER LOOP hugging the fairway edges (real cart
    // paths run alongside the holes — front nine OUT along one side, back nine IN along the other
    // — NOT a trunk up the middle) with short stubs to each green ----
    G.rect(cxm-1,H-16,cxm+1,H-1,1);                                       // narrow entrance drive from the street
    worm([[cxm,H-14],[16,H-44],[15,58],[24,26],[52,15]],0,1,1);           // out: up the WEST edge, across the top
    worm([[52,15],[92,19],[112,52],[108,92],[cxm+2,H-14]],0,1,1);         // in: back down the EAST edge to the clubhouse
    worm([[20,40],[24,38]],0,1,1);                                        // stub -> hole 2 green
    worm([[52,18],[56,22]],0,1,1);                                        // stub -> hole 3 green
    worm([[92,24],[94,30]],0,1,1);                                        // stub -> hole 1 green
    // connect the two lots to the drive (thin)
    G.hbar(cxm-30,cxm-1,H-12,1,1); G.hbar(cxm+1,cxm+30,H-12,1,1);

    // ---- ENTRANCE GATE on the SOUTH street (rotated to the real street by the kit) ----
    for(i=-3;i<=3;i++)set(cxm+i,H-1,5);
    for(y=H-1;y>=H-16;y--)for(x=-2;x<=2;x++){ var c=g[y][cxm+x]; if(c===0||c===3)set(cxm+x,y,1); } // drive punch to the lot
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:14});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})};
  }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  var PALETTE={0:'#1c1a15',1:'#6f6b62',2:'#7a6f5c',3:'#403a20',4:'#776d38',5:'#c79a3f',6:'#7d8a4a',
    7:'#c9be93',8:'#5a5b52',9:'#5c5a30',10:'#b04a3a',11:'#8f8676',12:'#2f2a18',13:'#8a6a5a'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt out of bounds at the parcel edge'},
    1:{name:'cart path / parking asphalt',kind:'drive',act1:'cracked cart-path + clubhouse parking asphalt (car/cart-drivable)'},
    2:{name:'building (clubhouse / pro shop)',kind:'building',act1:'the abandoned clubhouse + pro shop, boarded, faded', enter:'clubhouse interior: pro shop + bag room up front, grill + locker rooms behind'},
    3:{name:'dead rough',         kind:'ground',    act1:'dry knee-high scrub + weeds between the holes (out of the short grass)'},
    4:{name:'dead fairway',       kind:'ground',    act1:'the brown dead mown corridor of a hole — flat, walkable, cart-crossable'},
    5:{name:'gate / entrance',    kind:'gate',       act1:'the drive-in entrance off the street, amber curb'},
    6:{name:'green (putting surface)',kind:'ground', act1:'a dead putting green, the cup still cut, ringed by a collar'},
    7:{name:'sand bunker',        kind:'ground',    act1:'a sand trap, still pale, half-drifted with dust', solid:false},
    8:{name:'dry water hazard',   kind:'ground',    act1:'a cracked dry pond bed, cattails dead at the rim', solid:false},
    9:{name:'tee box',            kind:'ground',    act1:'a level tee pad, markers toppled, turf dead'},
    10:{name:'flagstick / pin',   kind:'prop',       act1:'a leaning flagstick in the cup, the flag a bleached rag'},
    11:{name:'driving-range mat / target',kind:'prop',act1:'a rubber range mat / a downrange yardage target, weathered'},
    12:{name:'dead tree / landscaping',kind:'tree-dead',act1:'a dead ornamental tree dotting the rough', solid:false},
    13:{name:'abandoned golf cart',kind:'vehicle',   act1:'a golf cart left in the lot, tyres flat, dust-caked'}
  };
  var NOTES={
    summary:'A dead golf course section — a winding run of holes (tee -> brown fairway -> green with a pin, sand bunkers + a dry pond) with the abandoned clubhouse, parking, driving range + putting green clustered at the street entrance, cart paths threading it all.',
    reference:['Golf course design guides (Under Armour "Golf Course Layout 101", Keiser College of Golf "How to Design a Golf Course", Archweb): every hole is a TEE BOX -> winding FAIRWAY through ROUGH -> GREEN with a pin, guarded by SAND BUNKERS + WATER HAZARDS; infrastructure = a CLUBHOUSE (pro shop, grill, locker rooms), TRAINING (driving range + putting green), CART PATHS + signage, PARKING at the entrance; modern routing sends the front nine OUT from the clubhouse and the back nine back IN. A full course is ~50ha, so one 96m cell holds a SECTION: the clubhouse complex on the street + a few holes winding away.'],
    layout:['The whole parcel is dead ROUGH (dry scrub) with desert only at the very margins; FAIRWAYS are mown corridors cut through it, winding (never straight) from tee to green.',
      'Three holes: hole 1 heads out NE to a bunkered green, hole 2 bends back NW guarded by the dry water hazard, hole 3 is a short north hole. Each has a tee box, a green with a leaning pin, and sand bunkers.',
      'The CLUBHOUSE + pro shop sits at the south entrance, flanked by two PARKING lots (a forgotten cart in one), with the DRIVING RANGE (tee line + mats + downrange targets) and a practice PUTTING GREEN beside it.',
      'CART PATHS run from the parking up a central spine and branch to each hole — the drivable network.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the clubhouse entrance drive is on the primary street; the parking lots + the whole cart-path network (code 1) are the drivable surface (a cart/maintenance vehicle reaches the course from the curb), reachable in any placement (K.driveReachFromStreet). Corner side streets get a pedestrian gate.',
    layering:'GROUND plane (walk/cross, flat): the fairways (4), rough (3), greens (6), tee boxes (9), sand bunkers (7), dry pond bed (8), desert (0), and the cart-path/parking asphalt (1, drive on it). STRUCTURE (¾ front face, solid, ENTERABLE -> clubhouse interior): the clubhouse/pro shop (2). PROPS (weave between): the flagsticks (10, on the greens), range mats/targets (11), dead trees (12), the abandoned cart (13). The clubhouse is the one vertical mass; the course is a low rolling ground you walk and drive across, greens/bunkers/pond reading as color patches in the dead brown.',
    decisions:['Act-1 DEAD: brown dead fairways + rough, dry cracked pond beds, sand traps drifted with dust, dead ornamental trees, an abandoned cart, a boarded clubhouse, cracked cart paths, bleached flags. No living turf.',
      'Leisure category (golf). Zero purple.',
      'ONE cell = a SECTION of a course, not 18 holes (a full course dwarfs a 96m cell) — the clubhouse anchors the street edge, holes wind away, and adjacent golf cells continue the routing.',
      'Water hazard is seed-optional (some sections have a pond, some do not) but never a sliver — absent or a real pond.',
      'Research-first (per the playbook): built from real golf-course routing + infrastructure, not memory.']
  };
  K.register('golf', { generate:generate, body:function(c){return c===2;}, category:'leisure', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaGolf=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
