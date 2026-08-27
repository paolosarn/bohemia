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


  /* NINE COURSES IN A 3x3, AND IT SHOULD HAVE BEEN ONE (8/26). Every cell of the valley's golf
     blob built a COMPLETE course: three holes, a clubhouse, a pro shop, a driving range, two
     car parks. Nine clubhouses inside one boundary.

     AND THE ARITHMETIC IS THE NICE PART. A 3x3 blob is 288 m square -- about 83 hectares. A
     real eighteen-hole course is 50 to 75. So the ground was always there for the actual
     thing; it was being cut into nine pieces and a three-hole pitch-and-putt built on each.
     One course, EIGHTEEN HOLES, one clubhouse.

     ROUTED THE WAY COURSES ARE ROUTED: two loops of nine, each leaving the clubhouse and
     coming back to it, so 9 and 18 both finish where 1 and 10 started. That is not decoration
     -- it is why a clubhouse sits where it sits, and it falls out of the geometry for free
     once the course is allowed to be one course. The front nine takes the outer ring, the back
     nine the inner one.

     AND THE ROUTING IS DECIDED BY THE BLOB, NOT THE CELL. Every cell carries its own seed, so
     a fairway bend chosen with the cell's rng would bend one way on one side of a boundary and
     the other way just across it. Every hole here is placed from a hash of the blob. */
  function clusterCourse(seed,opts,b){
    var A=K.blob(seed,{bounds:b,cellX:opts.cellX,cellY:opts.cellY}), f=A.f;
    var streets=opts.streets||['S'];

    // ---- BASE: dead rough over the whole property, desert at the property's own margins ----
    A.vrect(A.c.x0,A.c.y0,A.c.x1,A.c.y1,0);
    A.vrect(f.x0+5,f.y0+5,f.x1-5,f.y1-5,3);

    /* A FAIRWAY WORM in valley tiles: overlapping discs along a polyline, because real
       fairways bend and are never rectangles. The wobble comes from the blob hash so the same
       corridor bends the same way seen from either side of a cell boundary. */
    function worm(pts,rad,code){
      for(var i=0;i<pts.length-1;i++){
        var a=pts[i], c=pts[i+1];
        var steps=Math.max(1,Math.round(Math.hypot(c[0]-a[0],c[1]-a[1])/2));
        for(var s=0;s<=steps;s++){
          var t=s/steps, px=Math.round(a[0]+(c[0]-a[0])*t), py=Math.round(a[1]+(c[1]-a[1])*t);
          var rr=rad + (A.rnd(px,py)<0.5?0:1) - (A.rnd(py,px)<0.25?1:0);
          A.vell(px,py,Math.max(3,rr),Math.max(3,rr),code);
        }
      }
    }

    /* THE CLUBHOUSE SITS AT THE SOUTH, ON THE STREET, and both nines are hung off it. */
    var hx=f.mx, hy=f.y1-Math.round(f.h*0.08);

    /* EIGHTEEN HOLES ON TWO RINGS. A hole's tee sits beside the previous hole's green, which
       is how a person actually walks a course, so the chain is: clubhouse -> 1 -> ... -> 9 ->
       clubhouse -> 10 -> ... -> 18 -> clubhouse. */
    function ring(i,n,rx,ry,phase){
      var a=phase + (i/n)*Math.PI*2;
      return [Math.round(f.mx+Math.cos(a)*rx), Math.round(f.my+Math.sin(a)*ry)];
    }
    var ORX=Math.round(f.w*0.38), ORY=Math.round(f.h*0.38);
    var IRX=Math.round(f.w*0.20), IRY=Math.round(f.h*0.20);
    var greens=[], tee=[hx,hy-10];
    for(var loop=0; loop<2; loop++){
      var rx=loop?IRX:ORX, ry=loop?IRY:ORY;
      for(var h=0; h<9; h++){
        /* going the other way round on the back nine, which is what keeps the two loops from
           lying on top of each other and is what a real routing does */
        var idx = loop ? (8-h) : h;
        var g2 = ring(idx, 9, rx, ry, Math.PI*0.5 + (loop?Math.PI/9:0));
        var midx = Math.round((tee[0]+g2[0])/2 + (A.rnd(g2[0],g2[1])-0.5)*Math.min(f.w,f.h)*0.10);
        var midy = Math.round((tee[1]+g2[1])/2 + (A.rnd(g2[1],g2[0])-0.5)*Math.min(f.w,f.h)*0.10);
        worm([tee,[midx,midy],g2], 5, 4);                                  // the mown corridor
        A.vell(g2[0],g2[1],8,7,6);                                          // the GREEN
        A.vrect(tee[0]-3,tee[1]-2,tee[0]+3,tee[1]+2,9);                    // the TEE BOX
        // greenside bunkers, on the side the fairway does not come in from
        var bx=g2[0]+Math.round((g2[0]-midx)*0.18), by=g2[1]+Math.round((g2[1]-midy)*0.18);
        A.vell(bx,by,4,3,7);
        if(A.rnd(g2[0]+7,g2[1])<0.55) A.vell(midx,midy,5,4,7);             // a fairway bunker
        greens.push(g2);
        /* the next tee is beside this green -- walk off, walk on */
        tee=[g2[0]+Math.round((A.rnd(g2[1],g2[0])-0.5)*22), g2[1]+Math.round((A.rnd(g2[0],g2[1])-0.5)*22)];
      }
      tee=[hx,hy-10];                       // each nine goes back out from the clubhouse
    }

    /* WATER: two dry, cracked ponds guarding holes on the outer loop. Dry because act one is
       dead -- a lake on a dead course is the one thing nobody would still be paying for. */
    for(var w=0; w<2; w++){
      var gp=greens[(w*5+3)%greens.length];
      A.vell(gp[0]+18,gp[1]+14,11,8,8);
    }

    // ---- THE CLUBHOUSE COMPLEX, ONCE: pro shop, two car parks, the range, a putting green ----
    A.vrect(hx-20,hy-6,hx+20,hy+8,2);                                     // clubhouse + pro shop
    A.vrect(hx-40,hy-6,hx-24,hy+8,1); A.vrect(hx+24,hy-6,hx+40,hy+8,1);   // the car parks
    for(var py=hy-5; py<=hy+7; py+=3) A.vset(hx-33,py,13);                // a cart left in the lot
    A.vrect(hx-42,hy-26,hx-14,hy-10,4); A.vrect(hx-42,hy-26,hx-42,hy-10,9);   // DRIVING RANGE
    for(var mx2=hx-40; mx2<=hx-16; mx2+=5) A.vset(mx2,hy-25,11);              // mats on the tee line
    for(var ty2=hy-46; ty2<=hy-30; ty2+=5) for(var tx2=hx-40; tx2<=hx-16; tx2+=7) A.vset(tx2,ty2,11);
    A.vell(hx+30,hy-20,10,8,6);                                            // the practice putting green

    /* THE CART PATH: a loop round the property tying the clubhouse to both nines. It is the
       drivable surface, and across nine cells a single path by the clubhouse would have left
       most of the course unreachable from any gate. */
    A.vrect(f.x0+9,f.y0+9,f.x1-9,f.y0+12,1); A.vrect(f.x0+9,f.y1-12,f.x1-9,f.y1-9,1);
    A.vrect(f.x0+9,f.y0+9,f.x0+12,f.y1-9,1); A.vrect(f.x1-12,f.y0+9,f.x1-9,f.y1-9,1);
    /* AND IT HAS TO ACTUALLY JOIN UP. The first cut ran the spine from the north ring down to
       the clubhouse -- and the CLUBHOUSE IS SOLID, so it stood between the spine and the south
       ring and stranded every path tile north of it. One cell of nine came back unreachable
       from any gate. The spine stops above the building now, a cross-link ties it to both car
       parks, and the parks run down to the south ring: clubhouse, course and street on one
       connected surface, which is what a cart path is for. */
    A.vrect(hx-2,f.y0+12,hx+2,hy-11,1);
    A.vrect(hx-40,hy-10,hx+40,hy-7,1);
    A.vrect(hx-40,hy+8,hx-24,f.y1-9,1); A.vrect(hx+24,hy+8,hx+40,f.y1-9,1);

    A.dress(12,120,3);                                                     // dead landscaping trees
    A.dress(13,20,1);                                                      // abandoned carts

    /* THE PINS GO IN ABSOLUTELY LAST, AND THAT IS NOT TIDINESS. A pin is ONE TILE. Set it
       beside its own green and the next hole's fairway paints over it -- the back nine
       crosses the front nine, which is exactly what a real routing does -- and then the ponds,
       the clubhouse and the cart path take a couple more. Eighteen holes measured EIGHT, then
       SIXTEEN, and nothing anywhere complained either time. Drawn after everything, they are
       eighteen. */
    for(var pi=0; pi<greens.length; pi++) A.vset(greens[pi][0],greens[pi][1],10);

    var gates=A.gates(streets,5,1,[0,3,4],14);
    return {g:A.g, W:A.W, H:A.H, streets:streets, gates:gates, bounds:b,
      footprints:K.footprints(A.g,function(v){return v===2;})};
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    /* A LONE CELL IS UNCHANGED: three holes and a clubhouse is the right answer for 96 m of
       ground, and it is art that already shipped. */
    var __b=opts.bounds;
    if(__b && (__b.x1>__b.x0 || __b.y1>__b.y0)) return clusterCourse(seed,opts,__b);

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
    12:{name:'dead tree / landscaping',kind:'tree-dead',act1:'a dead ornamental tree dotting the rough', solid:true},
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
