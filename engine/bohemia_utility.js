// BOHEMIA UTILITY LANDMARK FACTORY (8/5/26). ONE MODULE, TWELVE DISTRICTS.
//
// WHY A FACTORY AND NOT TWELVE FILES. The 8/5 valley census measured the whole map and
// found twelve NAMED PLACES the overmap sites on purpose -- a quarry, a granary, an
// arsenal, a tank farm, the Lake Mead intake, a gypsum works, a data fort, the flood
// detention basins, a radio mast, water tanks, a pump station, the reclamation ponds --
// every one of them generating EMPTY GROUND. Twelve hand-written modules is exactly what
// the FACTORY LAW exists to forbid: "every system is a mass-production factory: typed
// spec, generator, batch output, kill/approve pipeline, and its OWN regression gate."
//
// So: NINE LAYOUT PRIMITIVES, TWELVE TYPED SPECS, one generator, one gate. Adding the
// thirteenth utility landmark is a spec, not a file.
//
// THE SHARED CODE VOCABULARY. Every landmark uses the same fourteen codes, and its SPEC
// says what each one MEANS on that site. That is what keeps twelve dossiers honest with
// one legend machine: the code is structural, the name is the place.
//   0  site dead-ground     1  access road (DRIVABLE)  2  building (office/control/plant)
//   3  dead brush           4  the working surface     5  gate
//   6  THE HERO MASS        7  secondary structure     8  the site's fluid / conductor
//   9  pole light           10 prop cluster            11 marking
//   12 perimeter fence      13 pipe / conveyor run     14 THE VERTICAL (mast/tower/stack)
//
// RESEARCH-FIRST, and every reference is a real Las Vegas valley facility -- Sloan
// limestone quarry, the PABCO Blue Diamond gypsum works and its monolithic storage dome,
// the Calnev pipeline terminus, the Switch SUPERNAP data fortress, the Clark County
// Regional Flood Control District's basins, the LVVWD's 84 reservoirs and 55 pump
// stations, the Black Mountain antenna farm. Sources cited per spec in NOTES.reference.
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);

  // ===================================================================================
  // THE SHARED FRAME. Every utility landmark is a fenced site off one street with one
  // gate, an access road in, and a perimeter lane -- because that is what every one of
  // them actually is. Built canonical-south; rotateToStreet spins it to the real street.
  // ===================================================================================
  function frame(G, yard){
    var W=G.W, H=G.H, x, y;
    G.rect(0,0,W-1,H-1,0);                       // site dead-ground to the margins
    G.rect(5,7,W-6,H-8,yard);                    // the working surface inside the fence
    for(x=5;x<=W-6;x++){ G.set(x,7,12); G.set(x,H-8,12); }
    for(y=7;y<=H-8;y++){ G.set(5,y,12); G.set(W-6,y,12); }
    var gx=W>>1;
    G.rect(gx-2,H-8,gx+2,H-1,1);                 // the drive in from the curb
    for(var i=-2;i<=2;i++) G.set(gx+i,H-1,5);    // THE GATE
    G.rect(8,H-14,W-9,H-11,1);                   // one perimeter lane inside the fence
    G.rect(gx-2,H-14,gx+2,H-8,1);
    return gx;
  }
  // scatter dead brush into whatever is still bare, so no margin reads as a void
  // DRESS: the working surface of a real industrial site is never one clean sheet. This lays
  // the things every one of these places genuinely has -- graded material in windrows, the
  // tracked lane where the plant drives, spill and stain, and the junk that accumulates
  // against a fence in ten dead years -- as PATCHES, not speckle, so the plot reads worked.
  // HOW MUCH dressing is DERIVED, not guessed. A fixed count of windrows left the quarry at
  // 49% one flat colour, because "nine windrows" is a number I picked and the thing that
  // matters is what share of the plot still reads as one sheet. So: lay material until the
  // biggest single code is under the bar, and stop. (Same lesson as the connect loop three
  // fixes up -- I keep reaching for a constant where the condition is the answer.)
  function topShare(G){
    var c={}, A=G.W*G.H, best=0, x, y;
    for(y=0;y<G.H;y++)for(x=0;x<G.W;x++){ var v=G.get(x,y); c[v]=(c[v]||0)+1; if(c[v]>best)best=c[v]; }
    return best/A;
  }
  function dress(G, yard){
    /* DENSITY, NOT COUNT (8/27). dressRound lays a fixed number of windrows, tracked lanes
       and blown junk, and that was right while every site was exactly one 128x128 cell. A
       BLOB-SCALE site is up to nine of them, and nine windrows spread over nine cells is a
       site that reads as one flat sheet -- which is the WALKABLE-LAND failure, arrived at
       from the other direction. So the dressing scales with the AREA it has to cover, and
       the loop's exit condition (topShare) is untouched because it was already scale-free.
       Same lesson the file learned about windrow counts in the first place: HOW MUCH IS
       DERIVED, NOT GUESSED. A lone cell computes mul===1 and is byte-identical. */
    var mul = Math.max(1, Math.round((G.W*G.H) / (K.SZ*K.SZ)));
    for(var round=0; round<24 && topShare(G)>0.27; round++) dressRound(G, yard, mul);
  }
  function dressRound(G, yard, mul){
    var W=G.W,H=G.H,r=G.rnd,i,j; mul=mul||1;
    // windrows / stockpiles of the site's own material, laid along the yard
    for(i=0;i<9*mul;i++){
      var wx=8+Math.floor(r()*(W-30)), wy=12+Math.floor(r()*(H-36)), wl=8+Math.floor(r()*22);
      for(j=0;j<wl;j++){ var px=wx+j, py=wy+((j>>3)%2);
        if(G.get(px,py)===yard){ G.set(px,py,10); if(G.get(px,py+1)===yard) G.set(px,py+1,10); } }
    }
    // the tracked lane: where the plant has driven the same line for years, the surface is
    // a different material -- compacted and stained, not the graded yard beside it
    for(i=0;i<5*mul;i++){
      var tx=10+Math.floor(r()*(W-24)), ty=12+Math.floor(r()*(H-30)), tl=14+Math.floor(r()*26);
      for(j=0;j<tl;j++){ var qx=tx+((i%2)?j:0), qy=ty+((i%2)?0:j);
        if(G.get(qx,qy)===yard) G.set(qx,qy,8);
        if(G.get(qx+1,qy)===yard) G.set(qx+1,qy,8); }
    }
    // and what has blown against the fence line and stayed
    for(i=0;i<70*mul;i++){ var bx=6+Math.floor(r()*(W-12)), by=8+Math.floor(r()*(H-16));
      var edge=(bx<12||bx>W-13||by<14||by>H-17);
      if(edge && G.get(bx,by)===yard) G.set(bx,by,3); }
  }
  function brush(G,n){ var r=G.rnd,i;
    for(i=0;i<n;i++){ var x=Math.floor(r()*G.W), y=Math.floor(r()*G.H);
      if(G.get(x,y)===0) G.set(x,y,3); } }
  function lights(G,pts){ pts.forEach(function(p){ G.set(p[0],p[1],9); }); }

  // ===================================================================================
  // THE NINE LAYOUT PRIMITIVES. Each is one real industrial site plan.
  // ===================================================================================
  var LAY = {

    // A QUARRY IS A STAIRCASE CUT DOWNWARDS. Modern quarries work a BENCH system -- rock
    // taken off in layers you return to year after year -- so the shape from above is
    // nested rings stepping down, with a haul ramp spiralling between them and the
    // processing plant on the flat below. (Sloan: quarry on top of the mountain, plant
    // below it.)
    pit: function(G,p){
      var W=G.W,H=G.H,i,x,y;
      var cx=Math.round(W*0.42), cy=Math.round(H*0.40);
      var benches = p.benches||4;
      for(i=benches;i>=1;i--){                                   // stepping DOWN, outer first
        var rr = 10 + i*8;
        G.disc(cx,cy,rr,6);                                      // the rock bench
        G.disc(cx,cy,rr-2,4);                                    // its floor
        for(var a=0;a<360;a+=6){                                 // the bench LIP, the thing you see
          var px=cx+Math.round(rr*Math.cos(a*Math.PI/180)), py=cy+Math.round(rr*Math.sin(a*Math.PI/180)*0.82);
          G.set(px,py,7); }
      }
      G.disc(cx,cy,8,4);
      // THE HAUL RAMP, and it is drawn TWO TILES WIDE because a rock truck is four metres
      // across and because a one-tile spiral of rounded points is only diagonally connected
      // -- which is not connected at all to a car, and drive_network_gate said so.
      for(i=0;i<benches;i++){
        var r0=10+(i+1)*8, ang=(i*88)%360;
        for(var t=0;t<40;t++){ var aa=(ang+t*2)*Math.PI/180, rq=r0-t*0.20;
          var hx=cx+Math.round(rq*Math.cos(aa)), hy=cy+Math.round(rq*Math.sin(aa)*0.82);
          G.rect(hx,hy,hx+1,hy+1,1); }
      }
      // the PROCESSING PLANT on the flat: primary crusher, screen tower, conveyor to stockpiles
      var px0=Math.round(W*0.74);
      G.rect(px0,26,px0+22,44,2);                                // crusher house / plant building
      G.rect(px0+6,18,px0+16,26,14);                             // THE SCREEN TOWER over it
      G.rect(px0-30,52,px0+22,55,13);                            // the conveyor off the pit
      for(i=0;i<4;i++) G.disc(px0+4+i*8, 74+((i%2)*10), 7-(i%2), 10);   // stockpile cones
      G.rect(px0-6,64,px0+22,66,13);
      if(p.dome){                                                // PABCO's monolithic storage dome
        G.disc(Math.round(W*0.20), Math.round(H*0.78), 17, 6);
        /* ONE CODE CANNOT CARRY TWO OCCUPANCIES (8/20). This drew the dome SHELL as code 7,
           and in the pit layout code 7 is the BENCH LIP -- the crest of a cut face. One is a
           hemisphere of shotcrete you bump into; the other is an edge you go over. They are
           opposites, they shared a number, and the tile could therefore be neither: the
           KILLS rule had to veto /dome shell/i by name to stop a roof being lethal, which
           also vetoed the lip. The shell is code 15 now and 7 is the lip alone, so both can
           finally be what they are. */
        G.disc(Math.round(W*0.20), Math.round(H*0.78), 12, 15);
        G.disc(Math.round(W*0.20), Math.round(H*0.78), 5, 14);
        G.rect(Math.round(W*0.20)-18,Math.round(H*0.78)+18,Math.round(W*0.20)+18,Math.round(H*0.78)+20,13);
      }
      for(i=0;i<14;i++){ var bx=Math.floor(G.rnd()*W), by=Math.floor(G.rnd()*H);
        if(G.get(bx,by)===4) G.set(bx,by,10); }                  // shot rock left on the floor
      lights(G,[[px0+2,20],[px0+20,20],[cx,cy-44]]);
      G.rect(px0-2,46,px0+2,H-14,1);                             // plant road down to the perimeter lane
    },

    // A TANK FARM IS CIRCLES INSIDE SQUARES. Every above-ground bulk tank sits in its own
    // diked containment cell sized to hold its contents -- reinforced concrete dikes are
    // the default for a permanent bulk plant -- with a manifold of pipe between them and a
    // truck loading rack at the front. (Calnev terminus; ~4 million gallons of storage.)
    tanks: function(G,p){
      var W=G.W,H=G.H,i,j;
      var cols=p.cols||3, rows=p.rows||2, rad=p.rad||13, dike=p.dikes!==false;
      var x0=Math.round(W*0.16), y0=20, sx=Math.round((W-2*x0)/Math.max(1,cols-1))||1, sy=34;
      for(j=0;j<rows;j++)for(i=0;i<cols;i++){
        var cx=x0+i*sx, cy=y0+j*sy;
        if(dike){ G.rect(cx-rad-4,cy-rad-4,cx+rad+4,cy+rad+4,7);        // the containment dike
                  G.rect(cx-rad-2,cy-rad-2,cx+rad+2,cy+rad+2,4); }      // its floor, sloped to a sump
        G.disc(cx,cy,rad,6);                                            // THE TANK
        G.disc(cx,cy,rad-3,7);                                          // its floating roof, dropped
        G.set(cx,cy-rad-1,10); G.set(cx+rad+1,cy,10);                   // shell manway + gauge hatch
        G.rect(cx-1,cy+rad,cx+1,cy+rad+4,13);                           // the tank's own line to the manifold
      }
      var my=y0+ (rows-1)*sy + rad + 8;
      G.rect(x0-rad,my,W-x0+rad,my+2,13);                               // THE MANIFOLD
      for(i=0;i<cols;i++){ G.set(x0+i*sx-3,my+1,10); G.set(x0+i*sx+3,my+1,10); }   // block valves
      if(p.rack){                                                        // the TRUCK LOADING RACK
        var ry=my+12;
        G.rect(28,ry,W-29,ry+10,4);
        for(i=0;i<5;i++){ G.rect(34+i*16,ry,36+i*16,ry+10,7); G.set(35+i*16,ry+2,10); }
        G.rect(28,ry+4,W-29,ry+5,11);
        G.rect(W-46,ry+14,W-24,ry+26,2);                                 // the terminal office
      } else {
        // A RESERVOIR SITE IS NOT TWO TANKS ON AN EMPTY PAD, and building it that way was
        // the fire-station failure the WALKABLE-LAND law was written for. The LVVWD runs 84
        // reservoir BASINS AND TANKS: half its storage is buried concrete basins with roof
        // slabs and access hatches, which is what actually fills a site like this.
        // DRAW ORDER, and it has bitten this repo before (the solar masts the service aisles
        // erased): the BASINS go down first and the valve house on top of them, because the
        // house is the one code-2 tile on the site and a site with no code 2 has no building,
        // no footprint, no interior and no door.
        for(j=0;j<2;j++)for(i=0;i<2;i++){                                 // THE BURIED BASINS
          var qx=18+i*48, qy=my+6+j*20;
          G.rect(qx,qy,qx+40,qy+16,6);                                    // the roof slab
          G.rect(qx+2,qy+2,qx+38,qy+14,7);                                // its expansion joints
          for(var h=0;h<4;h++) G.set(qx+8+h*8, qy+8, 10);                 // the access hatches
          G.rect(qx,qy+17,qx+40,qy+18,13); }                              // the basin's own main
        G.rect(14,12,W-15,14,7);                                          // the cut slope above the pad
        for(i=0;i<9;i++) G.set(18+i*12,13,10);                            // its slope drains
        G.rect(W-26,20,W-24,my+4,8);                                      // the overflow, running downhill
        G.rect(W-30,my+4,W-22,my+6,7);
        G.rect(Math.round(W*0.62),my+10,Math.round(W*0.62)+20,my+24,2);   // THE VALVE HOUSE, drawn LAST
        G.rect(Math.round(W*0.30),my+8,Math.round(W*0.30)+2,my+26,13);
        /* THE STANDPIPE (code 14), authored in this legend and never once drawn -- "the
           standpipe beside the tanks". It is not decoration: a standpipe is how a gravity
           system takes a surge without splitting a main, a tall open column between the tanks
           whose water level IS the pressure in the pipe. So it stands on the pad between the
           two tanks, above the manifold it protects, with its own line down into it. It starts
           at y=15 because the perimeter ring is cut across y 9-11 after every layout returns,
           which is the exact thing that had been eating this district's pole lights. */
        var spx=(W>>1)-2;
        G.rect(spx,15,spx+3,38,14);
        G.rect(spx+1,38,spx+2,my,13);
        G.set(spx,14,10); G.set(spx+3,14,10);                             // the top hatch + gauge
      }
      brush(G,28);
      /* THE SAME FAILURE THE BONEYARD HAD, IN THE ONLY LAYOUT THAT STILL HAD IT (8/23). These
         four stood at x=10 and x=W-11, and buildCanonical cuts the PERIMETER RING after every
         layout returns -- G.rect(8,9,10,H-11,1) and G.rect(W-11,9,W-9,H-11,1) -- which is
         exactly those two columns. So both districts on this layout lost all four lights to a
         road, every seed, and dead_code_gate reported reservoir:9 absent from 160 built cells.
         The other eight layouts light at x=12 / x=W-13 and were never touched; this one was
         two tiles out. A LIGHT STANDS BESIDE THE PERIMETER LANE, NOT IN IT. */
      lights(G,[[12,16],[W-13,16],[12,H-20],[W-13,H-20]]);
    },

    // A GRAIN ELEVATOR IS A COMB. A battery of touching concrete cylinders with the
    // HEADHOUSE straddling them -- the bucket elevator lifts to the top and gravity does
    // the rest -- a rail shed over the track on one side and a truck dump on the other.
    silos: function(G,p){
      var W=G.W,H=G.H,i;
      var n=p.count||9, rad=7, y=44, x0=Math.round((W-(n-1)*(rad*2-1))/2);
      for(i=0;i<n;i++){ G.disc(x0+i*(rad*2-1), y, rad, 6); G.disc(x0+i*(rad*2-1), y, rad-3, 7); }
      G.rect(x0-rad,y-rad-1,x0+(n-1)*(rad*2-1)+rad,y-rad+1,7);          // the gallery along the top
      var hx=x0+Math.floor(n/2)*(rad*2-1);
      G.rect(hx-9,y-rad-16,hx+9,y-rad,14);                              // THE HEADHOUSE, the vertical
      G.rect(hx-6,y-rad-22,hx+6,y-rad-16,7);                            // its cupola
      G.rect(x0-rad,y+rad+3,x0+(n-1)*(rad*2-1)+rad,y+rad+5,8);          // the RAIL SPUR under the shed
      G.rect(x0-rad,y+rad+1,x0+(n-1)*(rad*2-1)+rad,y+rad+2,7);          // the rail shed roof beam
      for(i=0;i<n;i++) G.set(x0+i*(rad*2-1), y+rad+3, 10);              // the drawoff spouts
      G.rect(x0-rad,y-rad-30,x0+30,y-rad-28,13);                        // the conveyor to the annex
      G.disc(x0+38,y-rad-40,10,6); G.disc(x0+38,y-rad-40,7,7);          // an annex bin
      G.rect(26,y+rad+14,54,y+rad+28,2);                                // the scale house / office
      G.rect(56,y+rad+16,W-30,y+rad+24,4);                              // the truck dump pit apron
      G.rect(60,y+rad+19,W-34,y+rad+21,11);
      for(i=0;i<5;i++) G.set(64+i*12, y+rad+20, 10);                    // dust bins along it
      // AND THE REST OF THE ELEVATOR, because a silo battery alone leaves the plot thin:
      // the flat storage shed and the second annex battery are what an elevator complex
      // actually has round the silos, and the rail track runs a loop, not a stub.
      G.rect(16,y+rad+30,W-17,y+rad+46,6);                              // THE FLAT STORAGE SHED
      G.rect(19,y+rad+33,W-20,y+rad+43,7);                              // its roof trusses
      for(i=0;i<7;i++) G.rect(22+i*14,y+rad+30,26+i*14,y+rad+31,7);     // its eave bays
      G.rect(24,y+rad+46,32,y+rad+48,2);                                // the shed's own door
      for(i=0;i<4;i++){ G.disc(20+i*13, y-rad-40, 9, 6); G.disc(20+i*13, y-rad-40, 6, 7); }  // the ANNEX battery
      G.rect(11,y-rad-30,W-12,y-rad-28,8);                              // the rail loop, back side
      G.rect(11,y-rad-30,13,y+rad+5,8); G.rect(W-13,y-rad-30,W-11,y+rad+5,8);
      for(i=0;i<8;i++) G.set(24+i*11, y-rad-29, 10);                    // ties and a stopped hopper car
      brush(G,26);
      lights(G,[[12,20],[W-13,20],[12,H-22]]);
    },

    // A DATA FORTRESS IS ONE ENORMOUS SEALED BOX. Switch's SUPERNAP: 400,000 sq ft per
    // hall, a double roof nine feet apart rated to 200 mph with no roof penetrations, the
    // data halls in the interior and the cooling units lining the outside face, a row of
    // generators down the flank, and a double perimeter fence. It has no windows at all,
    // which at this scale is the most recognisable thing about it.
    hall: function(G,p){
      var W=G.W,H=G.H,i;
      G.rect(24,20,W-25,74,6);                                          // THE HALL
      G.rect(26,22,W-27,72,7);                                          // the SwitchSHIELD second roof
      G.rect(30,26,W-31,68,6);
      for(i=0;i<7;i++) G.rect(28,28+i*6,W-29,28+i*6,7);                 // its roof ribs
      for(i=0;i<9;i++){ G.rect(20+i*10,76,28+i*10,86,10); }             // THE COOLING UNITS on the face
      G.rect(18,88,W-19,90,13);                                         // the chilled-water headers
      for(i=0;i<8;i++){ G.rect(W-22,22+i*6,W-14,26+i*6,7); }            // the generator row down the flank
      G.rect(W-24,20,W-23,74,13);                                       // its fuel header
      for(i=0;i<8;i++) G.set(W-13,24+i*6,10);                           // day tanks
      G.rect(14,20,20,74,7);                                            // the power spine on the other side
      for(i=0;i<6;i++) G.set(17,24+i*9,10);                             // its switchgear
      G.rect(48,96,80,110,2);                                           // the guard house at the gate
      G.rect(8,10,W-9,12,12);                                           // the DOUBLE fence, outer ring
      for(i=8;i<=W-9;i++) G.set(i,H-16,12);
      G.rect(52,14,54,20,14); G.rect(74,14,76,20,14);                   // two microwave masts on the roofline
      G.rect(30,92,W-31,94,11);                                         // the loading apron marking
      brush(G,18);
      lights(G,[[12,18],[W-13,18],[12,H-24],[W-13,H-24]]);
    },

    // AN ANTENNA FARM IS MOSTLY AIR. Guyed masts, their guy anchors far out from the base
    // (which is why the site is big and empty), a small equipment hut at the foot of each,
    // and a buried ground radial system fanning out under everything. Black Mountain
    // carries ten towers on the ridge above Henderson.
    masts: function(G,p){
      var W=G.W,H=G.H,i,j;
      var sites=[[34,34,20],[86,30,26],[60,64,32],[30,86,16],[92,84,22]];
      for(i=0;i<sites.length;i++){
        var mx=sites[i][0], my=sites[i][1], gr=sites[i][2];
        for(j=0;j<24;j++){ var a=j*15*Math.PI/180;                      // the GROUND RADIALS
          G.set(mx+Math.round(gr*1.2*Math.cos(a)), my+Math.round(gr*1.0*Math.sin(a)), 13); }
        [0,120,240].forEach(function(d){                                // the GUY ANCHORS, far out
          var a=d*Math.PI/180, ax=mx+Math.round(gr*Math.cos(a)), ay=my+Math.round(gr*0.86*Math.sin(a));
          /* THE FAR ANCHOR IS THE ANCHOR BLOCK, CODE 6, NOT THE BASE PLATE (8/25). Both
             rows exist in this legend and mean different objects: 7 is the 'anchor / base
             plate' the mast stands on, 6 is the 'anchor block -- a lump of concrete out in
             the open with nothing near it', which is precisely what a guy deadman IS and
             precisely what these three are, out at the end of every guy. They were drawn
             as 7, so code 6 was never once placed anywhere in the valley and the district
             lost the one object its own notes call the strangest thing on the site. */
          G.set(ax,ay,6); G.set(ax+1,ay,6); G.set(ax,ay+1,6);
          for(var t=1;t<gr;t++){ var qx=mx+Math.round(t*Math.cos(a)), qy=my+Math.round(t*0.86*Math.sin(a));
            if(G.get(qx,qy)===4) G.set(qx,qy,8); }                      // the guy wires themselves
        });
        /* AND THE BASE PLATE (code 7) UNDER IT. Moving the guy deadmen to code 6 above left
           code 7 with nothing drawing it, which would have been trading one dead row for
           another -- so this is the object code 7 was always for: the concrete pier and steel
           base plate a guyed mast is pinned to. A mast this size does not sit on dirt; it
           stands on a block with an insulator under it, because on a real AM tower THE WHOLE
           MAST IS LIVE. Drawn before the mast so the mast stands on top of it. */
        G.rect(mx-2,my-2,mx+2,my+2,7);
        G.rect(mx-1,my-1,mx+1,my+1,14);                                 // THE MAST
        G.rect(mx+4,my+4,mx+12,my+11,2);                                // its equipment hut
        G.set(mx-4,my+5,10); G.set(mx-6,my+5,10);                       // the propane tank + ice bridge
      }
      G.rect(52,100,84,114,2);                                          // the transmitter building
      G.rect(56,96,60,100,13); G.rect(76,96,80,100,13);
      brush(G,44);
      lights(G,[[14,16],[W-15,16]]);
    },

    // AN AMMUNITION STORAGE AREA IS SEPARATION DISTANCE. Earth-covered magazines set well
    // apart with earth traverses between them, headwall and door on one end only, in
    // echelon off a service lane -- the spacing IS the design, because the whole point is
    // that one going up does not take the next one with it.
    bunkers: function(G,p){
      var W=G.W,H=G.H,i,j;
      for(j=0;j<3;j++)for(i=0;i<4;i++){
        var bx=16+i*26+(j%2?6:0), by=18+j*28;
        G.rect(bx,by,bx+18,by+15,6);                                    // THE EARTH-COVERED MAGAZINE
        G.rect(bx+2,by+2,bx+16,by+13,7);                                // its concrete arch under the fill
        G.rect(bx+6,by+15,bx+12,by+17,2);                               // the headwall + door, one end only
        G.set(bx+9,by+17,2);      // the magazine number is ON the headwall, not paint on ground
        G.rect(bx-4,by-2,bx-2,by+17,7);                                 // the earth traverse beside it
      }
      G.rect(10,H-30,W-11,H-27,1);                                      // the service lane
      /* THE CABLE TRENCH (code 13), authored as "the cable trench along the service lane"
         and never drawn. It is the site's nervous system: an ammunition storage area runs
         its lightning protection, its intrusion alarms and its magazine lighting down a
         covered trench beside the lane, because you do not put a cable in the open where a
         truck reverses. It runs the whole length of the lane, which is what "along" means. */
      G.rect(10,H-32,W-11,H-31,13);
      for(i=0;i<4;i++) G.rect(24+i*26,H-27,26+i*26,H-14,1);             // spurs to each rank
      G.rect(W-40,H-26,W-16,H-16,2);                                    // the issue point / guard office
      G.rect(8,10,W-9,11,12);
      for(i=0;i<3;i++) G.rect(12,20+i*28,14,32+i*28,10);                // barricade posts
      /* THE LIGHTNING MASTS (code 14), "a lightning mast over the ranks", authored and
         never drawn. They are not decoration on an ammunition site -- a magazine field is
         the one place in the valley where a strike is a mass casualty event, so it is ringed
         with masts that take the hit and put it in the ground instead. They stand IN THE
         AISLES between the ranks, never over a magazine, because that is the only ground
         here you are allowed to put anything tall on. Guarded on the yard code so a mast can
         never eat an earth cover. */
      for(j=0;j<2;j++)for(i=0;i<2;i++){ var lx=36+i*52, ly=38+j*28;
        if(G.get(lx,ly)===4) G.rect(lx,ly,lx+1,ly+4,14); }
      brush(G,30);
      lights(G,[[12,16],[W-13,16],[12,H-34],[W-13,H-34]]);
    },

    // A RECLAMATION POND FIELD IS A GRID OF RECTANGLES WITH WATER STILL IN THEM. Berms
    // between, an inlet header down one side, an outfall channel leaving toward the wash.
    // Everything in this valley drains to one outlet, the Las Vegas Wash, and ends up in
    // Lake Mead -- so the channel leaving this site is the valley's actual plumbing.
    ponds: function(G,p){
      var W=G.W,H=G.H,i,j;
      /* THE POND GRID IS A PARAMETER NOW (8/27), because a reclamation plant on three
         cells of ground has more ponds, not the same nine with an empty yard round them.
         TILING WAS THE WRONG TOOL HERE and the class gate is what said so: repeating the
         whole unit repeats the CONTROL BUILDING with it, which is the exact defect this
         change exists to remove. The ponds spread; the plant stays one plant. */
      var cols=p.cols||3, rows=p.rows||3, pw=30, ph=24, x0=14, y0=18;
      for(j=0;j<rows;j++)for(i=0;i<cols;i++){
        var px=x0+i*(pw+6), py=y0+j*(ph+6);
        G.rect(px,py,px+pw,py+ph,7);                                    // the BERM
        G.rect(px+3,py+3,px+pw-3,py+ph-3,8);                            // the water, gone green
        G.rect(px+7,py+7,px+pw-7,py+ph-7,6);                            // the crusted middle
        G.set(px+pw-2,py+Math.floor(ph/2),10);                          // the outlet weir box
      }
      G.rect(x0-6,y0-4,x0-4,y0+rows*(ph+6),13);                         // the inlet header
      for(j=0;j<rows;j++) G.rect(x0-4,y0+j*(ph+6)+10,x0,y0+j*(ph+6)+11,13);
      var ox=x0+cols*(pw+6);
      G.rect(ox-4,y0+30,W-8,y0+34,8);                                   // THE OUTFALL CHANNEL, leaving
      G.rect(ox-4,y0+28,W-8,y0+29,7); G.rect(ox-4,y0+35,W-8,y0+36,7);
      G.rect(22,H-30,52,H-16,2);                                        // the blower / control building
      /* THE VENT STACK (code 14), "the vent stack on the blower house", authored and never
         drawn. A pond field's blower house is the one building on the site with something
         to get rid of -- the air it pulls off the ponds -- so the stack is the tallest thing
         here and the only vertical in a plan made entirely of flat rectangles. */
      G.rect(46,H-28,48,H-25,14);
      G.rect(56,H-28,W-24,H-26,13);
      for(i=0;i<6;i++) G.set(60+i*10,H-24,10);                          // the aeration blowers
      brush(G,22);
      lights(G,[[12,14],[W-13,14],[12,H-22]]);
    },

    // A DETENTION BASIN IS A HOLE THAT IS SUPPOSED TO BE EMPTY. Ten to fifty acres, up to
    // fifty feet deep, side slopes down to a flat floor, an outlet works with a small
    // orifice at the low corner (a 24-inch orifice on a concrete box storm drain is a real
    // one), and an emergency spillway cut in the crest above it. Empty is its WORKING
    // state -- so what dresses it is what the last flood left on the floor.
    bowl: function(G,p){
      var W=G.W,H=G.H,i,x,y;
      var cx=W>>1, cy=Math.round(H*0.44);
      G.rect(10,12,W-11,H-24,7);                                        // the embankment crest
      for(i=0;i<4;i++) G.rect(12+i*3,14+i*3,W-13-i*3,H-26-i*3,6);       // the SIDE SLOPES, stepping down
      G.rect(24,26,W-25,H-38,4);                                        // THE FLOOR
      // the last flood is written on the floor: a silt fan off the inlet, debris at the outlet
      for(i=0;i<70;i++){ var sx=30+Math.floor(G.rnd()*40), sy=30+Math.floor(G.rnd()*24);
        if(G.get(sx,sy)===4) G.set(sx,sy,10); }
      for(i=0;i<40;i++){ var dx=cx-14+Math.floor(G.rnd()*28), dy=H-52+Math.floor(G.rnd()*12);
        if(G.get(dx,dy)===4) G.set(dx,dy,3); }
      G.rect(20,24,64,25,8); G.rect(20,25,30,40,8);                     // the low-flow trickle across it
      G.rect(cx-8,H-40,cx+8,H-26,6);                                    // THE OUTLET WORKS, concrete box
      G.rect(cx-5,H-32,cx+5,H-30,6);   // elevation marks are ON the outlet box
      G.rect(cx-2,H-30,cx+2,H-26,8);                                    // the orifice and what leaves it
      for(i=0;i<7;i++) G.set(cx-6+i*2,H-33,10);                         // the debris rack across its mouth
      /* THE STORM DRAIN (code 13), "the concrete box storm drain leaving the outlet", and
         THE STAGE GAUGE (code 14), "the stage gauge on the crest" -- both authored and never
         drawn. The box drain is where the water GOES: a basin is only half a structure
         without the pipe that takes the released flow away, and a 24-inch orifice on a
         concrete box is the real Clark County detail this layout is built on. It leaves
         east and stops short of the perimeter lane, because a buried box does not sever a
         road a truck drives on. The gauge is a staff on the crest with the flood stages
         painted up it -- the same record as the elevation marks on the outlet box, read
         from the top instead of from the water. */
      G.rect(cx+8,H-34,W-12,H-32,13);
      G.rect(cx-16,H-26,cx-15,H-24,14);
      G.rect(cx+18,12,cx+19,14,14);
      G.rect(cx+22,H-26,cx+44,H-24,7);                                  // the emergency SPILLWAY in the crest
      G.rect(cx+24,H-24,cx+42,H-20,4);
      // THE MAINTENANCE RAMP, and it has to actually ARRIVE. Cut down the west slope, along
      // the floor and out to the perimeter lane -- a ramp into a bowl that does not reach
      // the gate is a ramp that no machine ever used, and driveReachFromStreet says so.
      G.rect(16,28,19,H-40,1);                                          // down the west slope
      G.rect(16,H-42,cx-10,H-40,1);                                     // across the floor
      G.rect(cx-12,H-42,cx-10,H-11,1);                                  // and OUT to the perimeter lane
      G.rect(W-40,H-22,W-18,H-12,2);                                    // the district's little O&M shed
      for(x=10;x<W-10;x+=14) for(y=14;y<H-24;y+=40) if(G.get(x,y)===7) G.set(x,y,10);
      brush(G,34);
      lights(G,[[12,14],[W-13,14]]);
    },

    // A PUMPING STATION IS A BUILDING FULL OF PIPE. The pipes are the size of the room --
    // sixty-six-inch steel, concrete-mortar lined -- so what you see outside is a plain
    // mass, a surge tank taller than it, and a pipe run leaving in one direction and
    // arriving from another. The intake variant puts the water itself at one edge with the
    // intake structure standing in it.
    pumps: function(G,p){
      var W=G.W,H=G.H,i;
      if(p.water){
        G.rect(6,8,W-7,34,8);                                           // THE WATER at the north edge
        G.rect(6,34,W-7,38,7);                                          // and the ring it left on the rock
        G.rect(6,38,W-7,42,4);
        G.rect(52,14,76,32,6);                                          // THE INTAKE STRUCTURE, standing in it
        G.rect(56,18,72,28,7);
        for(i=0;i<4;i++) G.rect(56,20+i*3,72,20+i*3,7);                 // its trash racks are ON the tower
        G.rect(62,32,66,54,13);                                         // the shaft down to the tunnel
      }
      var by=p.water?58:34;
      G.rect(34,by,W-35,by+30,2);                                       // THE PUMP HOUSE
      G.rect(38,by+4,W-39,by+8,7);                                      // its roof monitor
      G.disc(24,by+16,10,6); G.disc(24,by+16,6,7);                      // THE SURGE TANK
      G.rect(22,by-8,26,by+6,14);                                       // and its standpipe
      G.rect(W-30,by+6,W-8,by+9,13);                                    // the discharge main leaving
      G.rect(W-12,by+9,W-8,H-20,13);
      G.rect(8,by+20,34,by+23,13);                                      // the suction main arriving
      for(i=0;i<5;i++) G.set(12+i*5,by+21,10);                          // the valve vault covers
      G.rect(W-34,by+34,W-12,by+46,7);                                  // the switchgear yard
      for(i=0;i<4;i++) G.set(W-31+i*6,by+40,10);
      G.rect(36,by+34,60,by+44,4);                                      // the pig launcher pad
      G.rect(40,by+38,56,by+39,11);
      brush(G,26);
      lights(G,[[12,16],[W-13,16],[12,H-24],[W-13,H-24]]);
    }
  };

  // ===================================================================================
  // THE TWELVE SPECS. Each one names what the shared codes MEAN on its own ground.
  // ===================================================================================
  function L(name,kind,act1,extra){ var e={name:name,kind:kind,act1:act1}; if(extra)for(var k in extra)e[k]=extra[k]; return e; }

  var SPECS = {

    quarry: { lay:'pit', par:{benches:4}, grow:{benches:'a'}, cat:'infrastructure', yard:4,
      /* hazard paint on the PLANT FLOOR (4), beside the crusher house (2) */
      mark:{on:4, near:2, count:4},
      pal:{0:'#4a4335',1:'#5c5140',2:'#6e6558',3:'#3f382c',4:'#8a8070',5:'#c79a3f',6:'#a49a86',7:'#b8ae98',
           8:'#5e6a68',9:'#8f8676',10:'#8c8272',11:'#c9c1aa',12:'#6a6a72',13:'#6b6154',14:'#8a8478'},
      leg:{0:['desert dead-ground','ground','the untouched desert outside the quarry line'],
           1:['haul road','drive','the haul ramp spiralling down the benches, graded wide enough for a rock truck (drivable)'],
           2:['building (crusher house / plant)','building','the primary crusher house, its feed hopper empty, the belts hanging'],
           3:['dead brush','tree-dead','creosote holding on at the quarry rim, in the last soil the blasting has not reached yet'],
           4:['quarry floor','ground','the blasted floor of a bench, white rock dust over everything'],
           5:['gate','gate','the quarry gate off the street, amber curb'],
           6:['rock bench','structure','a cut bench of limestone, the drill lines still visible up its face'],
           /* VOID (8/20): the crest of a cut face is the edge you go over, not a wall you
              bounce off. Modelled as solid structure it was the opposite of what it is. */
           7:['bench lip / crest','structure','the crest of the bench, loose rock along the edge where nobody has scaled it',{'void':true}],
           8:['pit water','water-dead','water standing in the bottom of the pit, gone the colour of the rock'],
           9:['pole light','prop','a yard light over the crusher, head dark, on a plant that used to run three shifts'],
           10:['shot rock / stockpile','prop','a cone of graded stone, or shot rock left where the last round dropped it'],
           11:['marking','marking','faded hazard paint on the plant floor, where the crusher feed had to be walked around'],
           12:['perimeter fence','structure','the quarry fence, most of it still standing'],
           13:['conveyor run','structure','the conveyor from the pit to the stockpiles, belt slack and gone brittle'],
           14:['screen tower','structure','the screen tower over the crusher, the tallest thing on the site']},
      sum:'A limestone quarry cut in stepped benches with a haul ramp spiralling down them, a crusher house and screen tower on the flat, a conveyor out to graded stockpiles.',
      ref:['Sloan limestone quarry, Clark County (Aggregate Industries): the quarry sits on top of Sloan Mountain with the processing plant below it.',
           'Modern quarries work a BENCH system, taking rock off in layers that can be returned to year after year, stepped up to the original surface.',
           'Aggregate flow: feed hopper to primary crusher, across a vibrating screen, to secondary crushers, oversize recirculated.'] },

    gypsum: { lay:'pit', par:{benches:3, dome:true}, grow:{benches:'a'}, cat:'infrastructure', yard:4,
      /* hazard paint on the MILL FLOOR (4), beside the mill (2) */
      mark:{on:4, near:2, count:4},
      pal:{0:'#4a4335',1:'#5c5140',2:'#6e6558',3:'#3f382c',4:'#9a9282',5:'#c79a3f',6:'#c2b9a4',7:'#d2cab6',
           8:'#3f8076',9:'#8f8676',10:'#a89f8c',11:'#c9c1aa',12:'#6a6a72',13:'#6b6154',14:'#8a8478',
           /* the shotcrete shell: greyer than the raw gypsum around it, because it is
              concrete on a site where everything else is white rock and white dust */
           15:'#b6b2a8'},
      leg:{0:['desert dead-ground','ground','bare Mojave outside the mine line, and the white dust reaches a long way past it'],
           1:['haul road','drive','the haul road off the quarry face down to the plant (drivable)'],
           2:['building (mill / board plant)','building','the mill building — the Raymond mills inside it silent, the board line cold'],
           3:['dead brush','tree-dead','brush at the edge of the workings, every leaf on it powdered white'],
           4:['quarry floor','ground','the white working floor, gypsum dust over every surface on the site'],
           5:['gate','gate','the plant gate off the street, amber curb'],
           6:['gypsum bench','structure','a cut bench of raw gypsum, so pale it reads white at any hour'],
           /* VOID (8/20), and it could not become one until the dome moved off this code. */
           7:['bench lip / crest','structure','the crest of a bench of raw gypsum, the edge crumbling white where nobody has scaled it',{'void':true}],
           8:['pit water','water-dead','water standing in the low corner of the workings, gone turquoise the way sulfate water does -- the one colour on a site that is otherwise all white dust'],
           9:['pole light','prop','a plant yard light, head dark, on a site that made its own power and still went out'],
           10:['stockpile','prop','a cone of milled rock waiting for a calciner that stopped'],
           11:['marking','marking','faded hazard paint on the mill floor, powdered over white like everything else here'],
           12:['perimeter fence','structure','the plant fence, which stops at the quarry line because nobody fences a cliff'],
           13:['conveyor run','structure','the mobile conveyor that carried ore straight from the quarry into the plant'],
           14:['calciner stack / dome crown','structure','the calciner stack, and the crown vent at the top of the storage dome'],
           /* THE DOME GETS ITS OWN CODE (8/20). It used to share 7 with the bench lip. */
           15:['dome shell','structure','the shell of the monolithic storage dome, a hemisphere of shotcrete over rebar, the one curved roof in the valley']},
      sum:'A gypsum works: a white quarry face cut in benches, a mobile conveyor straight into the mill, and the monolithic storage dome that is the one hemisphere in the valley.',
      ref:['PABCO Gypsum, Las Vegas: a 4,000 acre complex holding the gypsum mine, ore processing and the wallboard plant together.',
           'A mobile conveyor belt moves the ore from the quarry directly into processing; the gypsum passes through Raymond IMP mills before calcination and storage.',
           'The PABCO storage dome is a monolithic dome — the reason this site has a hemisphere on it and nowhere else in the valley does.'] },

    fueldepot: { lay:'tanks', par:{cols:3, rows:2, rad:13, dikes:true, rack:true}, grow:{cols:'x', rows:'y'}, cat:'industrial', yard:4,
      pal:{0:'#463f30',1:'#4c483f',2:'#6a6358',3:'#3f382c',4:'#5b564b',5:'#c79a3f',6:'#8e968f',7:'#6f6a5e',
           8:'#3d4a46',9:'#8f8676',10:'#a39a86',11:'#c9c1aa',12:'#6a6a72',13:'#7a7266',14:'#8a8478'},
      leg:{0:['dead-ground (setback)','ground','the setback outside the terminal fence, kept clear because of what is stored inside it'],
           1:['terminal road','drive','the road in from the gate to the loading rack (drivable)'],
           2:['building (terminal office)','building','the terminal office, the loading authorisations still pinned up inside'],
           3:['dead brush','tree-dead','brush caught along the outside of a containment dike, downhill of everything'],
           4:['containment floor','ground','the floor of a containment cell, graded to its sump, stained where something stood in it'],
           5:['gate','gate','the terminal gate off the street, amber curb'],
           6:['storage tank','structure','an above-ground bulk tank, shell paint chalked to nothing, a rust line where the product level stopped'],
           7:['containment dike / rack','structure','the reinforced concrete dike round the tank — or the frame of the truck loading rack'],
           8:['spill / standing product','water-dead','something dark standing in the low corner of a containment cell'],
           9:['pole light','prop','a terminal yard light, head dark, over a rack that used to load through the night'],
           10:['valve / manway','prop','a block valve on the manifold, a shell manway, a gauge hatch left open'],
           11:['marking','marking','the loading lane markings on the rack apron'],
           12:['perimeter fence','structure','the terminal fence, and the signage that used to say why is long gone off it'],
           13:['pipe manifold','structure','the manifold — the pipe that ties every tank to the rack and the pipeline'],
           14:['vent stack','structure','a vapour recovery stack at the end of the rack']},
      sum:'A products terminal: six bulk tanks each in its own concrete containment dike, a manifold tying them together, and a five-bay truck loading rack at the front.',
      ref:['The Calnev Pipeline terminus, Las Vegas (Kinder Morgan): a 550-mile buried refined-products line from Los Angeles refineries, two parallel lines at 14 and 8 inches, carrying gasoline, jet fuel and diesel as far as Nellis.',
           'The Las Vegas terminal receives, stores, handles and loads petroleum into tank trucks; one local terminal holds 4 million gallons.',
           'Reinforced concrete dikes are the default for a permanent bulk plant — they take heavy equipment traffic, last 40+ years, and accept engineered drain valves and oil/water separators.'] },

    reservoir: { lay:'tanks', par:{cols:2, rows:1, rad:20, dikes:false, rack:false}, grow:{cols:'x', rows:'y'}, cat:'infrastructure', yard:4,
      /* the identification band round the TANK BASE: the tank (6) where it meets its pad (4) */
      mark:{on:6, near:4, count:5},
      pal:{0:'#463f30',1:'#4c483f',2:'#6a6358',3:'#3f382c',4:'#6b6558',5:'#c79a3f',6:'#9aa0a2',7:'#7d8386',
           8:'#3a5560',9:'#8f8676',10:'#a39a86',11:'#c9c1aa',12:'#6a6a72',13:'#7a7266',14:'#8a8478'},
      leg:{0:['dead-ground (setback)','ground','the hillside outside the reservoir fence'],
           1:['access road','drive','the road up to the tank pad, switchbacked because the pad had to be this high (drivable)'],
           2:['building (valve house)','building','the valve house — the altitude valve that used to hold the level is still in there'],
           3:['dead brush','tree-dead','brush on the cut slope of the pad, holding the cut together better than the drains do'],
           4:['tank pad','ground','the graded pad the tanks stand on, cut into the hillside'],
           5:['gate','gate','the reservoir gate off the street, amber curb'],
           6:['water tank','structure','a welded steel reservoir, seams showing through the failed coating, sitting high enough that the whole valley below was fed by gravity'],
           7:['tank roof','structure','the tank roof, its centre vent and the hatch beside it'],
           8:['overflow','water-dead','the overflow weir and the stain running away from it down the pad'],
           9:['pole light','prop','a pad light, head dark, standing over water nobody has drawn in ten years'],
           10:['valve / hatch','prop','a buried valve cover, the shell manway, the level float box'],
           11:['marking','marking','the fading identification band round the tank base'],
           12:['perimeter fence','structure','the reservoir fence, ringing two tanks and a valve house and nothing else at all'],
           13:['transmission main','structure','the transmission main in and out — big enough that its trench reads from the air'],
           14:['standpipe','structure','the standpipe between the tanks, an open column whose water level WAS the pressure in the main']},
      sum:'A water reservoir site: two big welded steel tanks on a graded pad cut high into the foothills, a valve house, and transmission mains leaving downhill.',
      ref:['Las Vegas Valley Water District: 84 reservoir basins and tanks holding nearly a billion gallons, serving more than 400,000 homes and businesses.',
           'LVVWD engineers site reservoirs by elevation and customer count, deliberately UPGRADIENT of customers so gravity pushes water through the lines and builds pressure.',
           'A regional example: a 1.9 million-gallon welded steel tank and pump station on 134 auger-cast piles.'] },

    pumpstation: { lay:'pumps', par:{water:false}, cat:'infrastructure', yard:4,
      pal:{0:'#463f30',1:'#4c483f',2:'#6d6659',3:'#3f382c',4:'#5f5a4e',5:'#c79a3f',6:'#8e9498',7:'#77716a',
           8:'#3a5560',9:'#8f8676',10:'#a39a86',11:'#c9c1aa',12:'#6a6a72',13:'#7f776a',14:'#8a8478'},
      leg:{0:['dead-ground (setback)','ground','the setback outside the station fence, and the pipe runs under it either way'],
           1:['access road','drive','the road in to the pump house door (drivable)'],
           2:['building (pump house)','building','the pump house — inside it the pumps are the size of the room, and the water in them stopped moving a decade ago'],
           3:['dead brush','tree-dead','brush along the line of the buried main, greener than anything either side of it'],
           4:['station yard','ground','the graded station yard, dropped and levelled for cranes that had to lift pumps out'],
           5:['gate','gate','the station gate off the street, amber curb'],
           6:['surge tank','structure','the surge tank — the thing that keeps a stopped column of water from tearing the pipe apart'],
           7:['switchgear / roof monitor','structure','the switchgear yard, and the monitor along the pump house roof'],
           8:['leak / standing water','water-dead','water standing where a gland finally let go'],
           9:['pole light','prop','a station light, head dark, over a building that only ever needed light inside it'],
           10:['valve vault cover','prop','a valve vault cover set flush in the yard'],
           11:['marking','marking','pig launcher and lane markings on the pad'],
           12:['perimeter fence','structure','the station fence, low, because there is nothing here worth climbing for'],
           13:['transmission main','structure','sixty-six-inch steel lined with concrete mortar — the pipe is the station'],
           14:['standpipe','structure','the standpipe beside the surge tank, open at the top the way a standpipe has to be']},
      sum:'A water pumping station: a plain pump house with pipe bigger than a person leaving both ends of it, a surge tank, a switchgear yard and a pig launcher pad.',
      ref:['Las Vegas Valley Water District: 55 pumping stations with the capacity to move more than a million gallons a minute.',
           'A major Las Vegas pumping station project runs two 66-inch steel pipelines lined with concrete mortar — the pipe is the dominant object on such a site, not the building.'] },

    intake: { lay:'pumps', par:{water:true}, cat:'infrastructure', yard:4,
      pal:{0:'#463f30',1:'#4c483f',2:'#6d6659',3:'#3f382c',4:'#7a7466',5:'#c79a3f',6:'#8e9498',7:'#b3ad9b',
           8:'#2c505c',9:'#8f8676',10:'#a39a86',11:'#c9c1aa',12:'#6a6a72',13:'#7f776a',14:'#8a8478'},
      leg:{0:['dead-ground (setback)','ground','the bare shore above the old waterline, and it was underwater when this was built'],
           1:['access road','drive','the road down to the intake works (drivable)'],
           2:['building (intake pump house)','building','the intake pump house at the head of the shaft'],
           3:['dead brush','tree-dead','brush on the exposed lakebed terrace, growing where a boat used to pass over'],
           4:['exposed lakebed','ground','lakebed the water used to cover, cracked and pale'],
           5:['gate','gate','the works gate off the street, amber curb'],
           6:['intake structure','structure','the intake tower standing in the water — and the surge tank behind it'],
           7:['bathtub ring / roof','structure','the white mineral band the lake left on the rock as it dropped, and the roof over the works'],
           8:['lake water','water-dead','what is left of the lake, a long way below where the ring says it used to be'],
           9:['pole light','prop','a works light, head dark, on a gantry that now stands well back from the water'],
           10:['valve vault cover','prop','a valve vault cover, a bollard, a level gauge'],
           11:['marking','marking','elevation marks painted on the intake face — the record of the drop'],
           12:['perimeter fence','structure','the works fence, running down the shore and stopping short of where the water is now'],
           /* VOID (8/20): a shaft down to the tunnel is the single most literal hole in the
              valley. It was a wall. See the void note in engine/bohemia_district_kit.js. */
           13:['intake shaft / main','structure','the shaft down to the tunnel, and the main leaving the pump house',{'void':true}],
           14:['standpipe','structure','the standpipe beside the surge tank, the last vertical before the water']},
      sum:'A lake intake: the intake structure standing in shrunken water below a white bathtub ring, a shaft down to the tunnel, and a pump house pushing it uphill toward the valley.',
      ref:['Lake Mead intake works: the valley draws its water from a lake whose surface has dropped far enough to leave a white mineral bathtub ring on the rock above it.',
           'Since Las Vegas sits in a basin with a single outlet, the Las Vegas Wash, everything that leaves the valley ends up back in this lake.'] },

    granary: { lay:'silos', par:{count:9}, grow:{count:'x'}, cat:'industrial', yard:4,
      pal:{0:'#463f30',1:'#4c483f',2:'#6a6358',3:'#3f382c',4:'#5f5a4e',5:'#c79a3f',6:'#a89f8a',7:'#8d8574',
           8:'#57503f',9:'#8f8676',10:'#9a9080',11:'#c9c1aa',12:'#6a6a72',13:'#7a7266',14:'#b0a894'},
      leg:{0:['dead-ground (setback)','ground','the setback outside the elevator yard, and the grain dust settled over all of it'],
           1:['yard road','drive','the road from the gate round to the truck dump (drivable)'],
           2:['building (scale house / office)','building','the scale house, the last load ticket still on the desk'],
           3:['dead brush','tree-dead','brush against the silo skirt, rooted in spillage nobody ever swept up'],
           4:['dump apron','ground','the apron over the truck dump pit, its grate half buried'],
           5:['gate','gate','the elevator gate off the street, amber curb'],
           6:['concrete silo','structure','a concrete silo, joint lines showing where each slipform lift stopped'],
           7:['gallery / rail shed','structure','the gallery running along the silo tops, and the shed roof over the rail track'],
           8:['rail spur','ground','the spur under the shed, rail still bright where the wheels ran'],
           9:['pole light','prop','a yard light, head dark, on the pole the dump lane was worked under'],
           10:['spout / dust bin','prop','a drawoff spout under a silo, and the dust bins along the dump'],
           11:['marking','marking','the truck lane markings on the dump apron, ground to ghosts by the tyres that used them'],
           12:['perimeter fence','structure','the elevator fence, which ends at the rail spur because the railway fenced its own'],
           13:['conveyor run','structure','the conveyor between the silo battery and the annex bin'],
           14:['headhouse','structure','THE HEADHOUSE — the bucket elevator straddling the silos, and everything below it is gravity']},
      sum:'A grain elevator: a battery of concrete silos with the headhouse straddling them, a rail shed over the spur on one side and a truck dump on the other.',
      ref:['Grain elevator practice: a bucket elevator lifts the grain to the top of the headhouse and it is drawn off under gravity into rail or road trucks below.',
           'A complex is elevator, storage silos, dust bins, headhouse and sheds for rail and truck; a railroad shed over the drive floor protects the rail scale and loading.',
           'Steel I-beams carry the headhouse and the upper conveyor gallery.'] },

    arsenal: { lay:'bunkers', par:{}, tile:true, cat:'industrial', yard:4,
      /* the magazine NUMBER goes on the headwall: the arch face (7) where it meets open ground */
      mark:{on:7, near:4, count:4},
      pal:{0:'#463f30',1:'#4c483f',2:'#6a6358',3:'#3f382c',4:'#54503f',5:'#c79a3f',6:'#5d5a44',7:'#7c7566',
           8:'#3d4a46',9:'#8f8676',10:'#9a9080',11:'#c9c1aa',12:'#6a6a72',13:'#7a7266',14:'#8a8478'},
      leg:{0:['dead-ground (setback)','ground','the quantity-distance setback — legally empty ground, and that is why it is empty'],
           1:['service lane','drive','the lane along the magazine ranks (drivable)'],
           2:['building (issue point / guard)','building','the issue point, its window shutter down'],
           3:['dead brush','tree-dead','brush growing straight out of the earth cover, which is how you tell nobody has mown here'],
           4:['storage ground','ground','the bare ground between the ranks, kept bare on purpose -- the empty distance IS the safety system'],
           5:['gate','gate','the arsenal gate off the street, amber curb'],
           6:['earth-covered magazine','structure','a magazine under its earth cover, grass-grey, the arch showing at the ends'],
           7:['concrete arch / traverse','structure','the concrete arch under the fill, and the earth traverse standing between one magazine and the next'],
           8:['seepage','water-dead','water seeping out at the foot of a traverse'],
           9:['pole light','prop','a perimeter light, head dark, aimed inward at the ranks the way a guard force aims lights'],
           10:['barricade post','prop','a barricade post at the head of a rank, set there to stop a vehicle rather than a person'],
           11:['marking','marking','the magazine number stencilled on the headwall'],
           12:['perimeter fence','structure','the arsenal fence, and it is the outer of two -- the inner one is the fence that mattered'],
           13:['cable trench','structure','the covered cable trench beside the service lane, carrying the lightning protection and every alarm on the site'],
           14:['lightning mast','structure','a lightning mast standing in the aisle between two ranks, there to take the strike so a magazine does not']},
      sum:'An ammunition storage area: twelve earth-covered magazines set well apart in echelon with earth traverses between them, doors on one end only, off a single service lane.',
      ref:['Ammunition storage practice: earth-covered magazines are separated by quantity-distance and screened from each other by earth traverses, so a detonation in one does not propagate.',
           'The headwall and door are on ONE end only; the rest of the structure is arch under fill.'] },

    datafort: { lay:'hall', par:{}, cat:'infrastructure', yard:4,
      pal:{0:'#463f30',1:'#4c483f',2:'#6a6358',3:'#3f382c',4:'#55514a',5:'#c79a3f',6:'#5e6166',7:'#787c82',
           8:'#3f8a4a',9:'#8f8676',10:'#8d939a',11:'#c9c1aa',12:'#6a6a72',13:'#7a7266',14:'#9a948a'},
      leg:{0:['dead-ground (setback)','ground','the strip between the two fences, graded flat so anything crossing it is visible'],
           1:['access road','drive','the road from the gate to the guard house (drivable)'],
           2:['building (guard house)','building','the guard house at the gate, its glass still intact, which on this site is the tell'],
           3:['dead brush','tree-dead','brush caught between the two fences, the only thing that has crossed them in ten years'],
           4:['service yard','ground','the service yard along the building face'],
           5:['gate','gate','the campus gate off the street, amber curb'],
           6:['data hall','structure','THE HALL — four hundred thousand square feet with no window anywhere in it, which is the most recognisable thing about the building'],
           7:['second roof / generator','structure','the outer roof deck standing nine feet clear of the inner one, and the generator enclosures down the flank'],
           8:['coolant leak','water-dead','dyed glycol standing under a cooling unit -- it is dyed so a leak is visible, and it is the only colour on the whole campus'],
           9:['pole light','prop','a campus light, head dark, on a site that used to be lit around the clock'],
           10:['cooling unit','prop','a thousand-ton cooling unit on the building face, its flywheel stopped'],
           11:['marking','marking','the loading apron markings, still crisp, because nothing has driven over them since'],
           12:['perimeter fence','structure','the double perimeter fence, and the gap between the two of them is the point of them'],
           13:['header / fuel line','structure','the chilled-water headers and the generator fuel header'],
           14:['microwave mast','structure','a microwave mast on the roofline, dishes still pointed at something']},
      sum:'A data fortress: one enormous windowless hall under a double roof, cooling units lining the face, a generator row down the flank, double-fenced.',
      ref:['Switch SUPERNAP, Las Vegas: over 1.4 million square feet on campus, 280 MW at full build-out; the initial facility is just over 400,000 square feet.',
           'The cross-section runs generators, power rooms, power spine, data halls, cooling units — the halls in the interior with the cooling units lining the exterior face.',
           'SwitchSHIELD is a double-roof system rated to 200 mph winds: two roof decks nine feet apart attached to the concrete and steel shell with NO roof penetrations.',
           'Cooling is 1000-ton units with on-board flywheels for ride-through, hot-aisle containment, cold air from overhead.'] },

    basin: { lay:'bowl', par:{}, cat:'infrastructure', yard:4,
      /* elevation marks on the OUTLET WORKS (6), read from the basin floor (4) */
      mark:{on:6, near:4, count:3},
      pal:{0:'#463f30',1:'#4c483f',2:'#6a6358',3:'#3f382c',4:'#6e654e',5:'#c79a3f',6:'#5f5844',7:'#7b7259',
           8:'#4c8450',9:'#8f8676',10:'#8a8172',11:'#c9c1aa',12:'#6a6a72',13:'#7a7266',14:'#8a8478'},
      leg:{0:['dead-ground (setback)','ground','the ground outside the embankment, which is the ground this basin exists to keep dry'],
           1:['maintenance ramp','drive','the ramp down into the bowl, the only way a machine gets to the floor (drivable)'],
           2:['building (O&M shed)','building','the district maintenance shed on the crest'],
           3:['flood debris','tree-dead','tumbleweed and branch wrack piled where the water last stopped'],
           4:['basin floor','ground','the flat floor of the basin, silt cracked into plates'],
           5:['gate','gate','the basin gate off the street, amber curb'],
           6:['side slope / outlet works','structure','the side slope stepping down to the floor — and the concrete outlet box at the bottom of it'],
           7:['embankment crest / spillway','structure','the crest of the embankment, and the emergency spillway notched into it'],
           8:['low-flow trickle','water-dead','the trickle that runs even when it has not rained, gone green with algae, crossing the floor to the orifice'],
           9:['pole light','prop','a light on the crest, head dark, put there to work a basin at night in a storm'],
           10:['debris rack / riprap','prop','the trash rack across the orifice, and rock armour where the flow comes in'],
           11:['marking','marking','the elevation marks on the outlet box — the record of every flood that filled this'],
           12:['perimeter fence','structure','the basin fence, pushed over where the last flood shoved a raft of debris into it'],
           13:['storm drain','structure','the concrete box storm drain leaving the outlet'],
           14:['gauge mast','structure','the stage gauge on the crest, the flood heights painted up it, the top mark higher than anyone believed']},
      sum:'A flood detention basin: an earth bowl with stepped side slopes down to a flat silt floor, a concrete outlet works with a small orifice at the low corner, and an emergency spillway notched in the crest.',
      ref:['Clark County Regional Flood Control District: basins range from 10 to 50 acres and up to 50 feet deep, holding water to about 51.5 feet before it goes over the emergency spillway.',
           'Since 1991 the district has built 650 miles of channel and 100 basins for $1.9 billion, with another 25 years of projects planned.',
           'A real outlet: a concrete box storm drain with a 24-inch orifice leaving the basin. Las Vegas sits in a basin with ONE outlet, the Las Vegas Wash, and everything drains east to Lake Mead.'] },

    reclaim: { lay:'ponds', par:{cols:3, rows:3}, grow:{cols:'x', rows:'y'}, cat:'infrastructure', yard:4,
      /* the pond NUMBER on a weir box: the berm (7) where it meets the berm road (4) */
      mark:{on:7, near:4, count:3},
      pal:{0:'#463f30',1:'#4c483f',2:'#6a6358',3:'#3f382c',4:'#5a5546',5:'#c79a3f',6:'#6b6f56',7:'#7d7461',
           8:'#4a5f4e',9:'#8f8676',10:'#9a9080',11:'#c9c1aa',12:'#6a6a72',13:'#7a7266',14:'#8a8478'},
      leg:{0:['dead-ground (setback)','ground','the setback outside the pond field, and downwind of it, which is why nobody built here'],
           1:['service road','drive','the service road along the berm tops, one truck wide with nowhere to turn (drivable)'],
           2:['building (blower / control)','building','the blower house, control room dark and the blowers inside it seized where they stopped'],
           3:['dead brush','tree-dead','reed and brush gone dry on a berm, rooted in what the pond beside it used to carry'],
           4:['berm road surface','ground','the graded top of a berm between two ponds'],
           5:['gate','gate','the plant gate off the street, amber curb'],
           /* VOID (8/20): its own act-1 line says it -- "hard enough to walk on and not
              hard enough to trust". That is a floor that gives way, which is a hole with a
              lid on it, and it was modelled as a solid wall. */
           6:['crusted pond centre','structure','the crust in the middle of a pond, dried hard enough to walk on and not hard enough to trust',{'void':true}],
           7:['pond berm','structure','the earth berm holding one pond off the next'],
           8:['pond water','water-dead','what is in the pond now — still, green, and not moving anywhere'],
           9:['pole light','prop','a plant light, head dark, standing over water that no longer moves anywhere'],
           10:['weir box / blower','prop','an outlet weir box on a pond corner, a blower on its pad'],
           11:['marking','marking','a pond number stencilled on a weir box, so a man on foot knew which cell he was at'],
           12:['perimeter fence','structure','the plant fence, more about keeping people out of the ponds than anything in'],
           13:['inlet header','structure','the header feeding every pond off one line'],
           14:['vent stack','structure','the vent stack on the blower house, the tallest thing on a site that is otherwise all flat rectangles']},
      sum:'A reclamation pond field: nine bermed ponds in a grid, an inlet header down one side, an outfall channel leaving toward the wash.',
      ref:['Clark County water reclamation: treated effluent returns to the Las Vegas Wash and from there to Lake Mead, which is why the outfall channel points that way.',
           'Las Vegas is a basin with a single outlet, the Las Vegas Wash; all runoff and return flow drains east.'] },

    radio: { lay:'masts', par:{}, tile:true, cat:'infrastructure', yard:4,
      /* call letters on the HUT DOOR: the equipment hut (2) where it faces the site ground */
      mark:{on:2, near:4, count:2},
      pal:{0:'#463f30',1:'#4c483f',2:'#6a6358',3:'#3f382c',4:'#544f42',5:'#c79a3f',6:'#8a8478',7:'#7e7768',
           8:'#8e8878',9:'#8f8676',10:'#9a9080',11:'#c9c1aa',12:'#6a6a72',13:'#6b6458',14:'#b0a894'},
      leg:{0:['dead-ground (setback)','ground','ridge ground outside the fence, too steep and too high up for anything but this'],
           1:['access road','drive','the road up to the transmitter building (drivable)'],
           2:['building (equipment hut / transmitter)','building','an equipment hut at the foot of a mast, and the transmitter building below them'],
           3:['dead brush','tree-dead','brush on the ridge between the anchors, in the only part of the site nothing needed'],
           4:['site ground','ground','the ridge ground of the site, mostly empty because the guys need the room'],
           5:['gate','gate','the site gate off the street, amber curb'],
           6:['anchor block','structure','a guy anchor block, a lump of concrete out in the open with nothing near it'],
           7:['anchor / base plate','structure','the anchor plate and the mast base, still holding'],
           8:['guy wire','overhead','a guy wire running out from the mast to its anchor, overhead the whole way'],
           9:['pole light','prop','a site light, head dark, below aircraft-warning lights that are darker still'],
           10:['propane tank / ice bridge','prop','the propane tank beside a hut and the ice bridge from hut to mast'],
           11:['marking','marking','the station call letters stencilled on a hut door, the only name anywhere on this hill'],
           12:['perimeter fence','structure','the site fence, which was never the security here -- the climb was'],
           13:['ground radial','structure','a buried copper radial, its trench line still readable in the dirt'],
           14:['guyed mast','structure','A GUYED MAST — the tallest thing for miles, and the reason nobody built anything else up here']},
      sum:'An antenna farm: five guyed masts with their anchors set far out, equipment huts at their feet, radials fanned under everything, and a transmitter building below.',
      ref:['The Black Mountain antenna farm above Henderson carries ten transmitter towers on the ridge (KNPR, KCNV, KOMP, KPLV, KXPT, KFRH, KXTE and others).',
           'A guyed mast needs its anchors set far from the base, which is why an antenna site is mostly empty ground with a few very tall things on it.'] }
  };

  // ===================================================================================
  // THE ONE GENERATOR. Reads a spec, lays its primitive, rotates it to the real street.
  // ===================================================================================
  // EVERY DRIVE TILE MUST BE REACHABLE FROM THE GATE, and this is DERIVED, not drawn by
  // hand. drive_network_gate caught nine of the twelve laying road a car could not get to:
  // a haul ramp spiralling into a pit, a plant road, a maintenance ramp -- each one correct
  // in itself and each one landing a tile short of the lane that reaches the curb. Hand-
  // placing twelve connections is the bug this repo keeps making, so instead: flood the
  // drive network from the gate, find every stranded component, and cut it a straight spur
  // to the nearest connected drive tile. A road that exists has to go somewhere.
  function connectDrive(G){
    var W=G.W,H=G.H,x,y,i,d4=[[1,0],[-1,0],[0,1],[0,-1]];
    // the SAME definition the kit's driveMask uses: road AND paint. A gate that counts
    // paint as drivable and a generator that does not is two different maps.
    function isDrive(v){ return v===1 || v===11; }
    function flood(){
      var seen={}, st=[], reach=[];
      for(x=0;x<W;x++){ if(isDrive(G.get(x,1))) st.push([x,1]); if(isDrive(G.get(x,H-2))) st.push([x,H-2]);
                        if(isDrive(G.get(x,H-1))) st.push([x,H-1]); }
      for(y=0;y<H;y++){ if(isDrive(G.get(1,y))) st.push([1,y]); if(isDrive(G.get(W-2,y))) st.push([W-2,y]); }
      st.forEach(function(p){ seen[p[0]+','+p[1]]=1; });
      while(st.length){ var p=st.pop(); reach.push(p);
        for(i=0;i<4;i++){ var nx=p[0]+d4[i][0], ny=p[1]+d4[i][1], k=nx+','+ny;
          if(seen[k]||nx<0||ny<0||nx>=W||ny>=H) continue;
          if(isDrive(G.get(nx,ny))){ seen[k]=1; st.push([nx,ny]); } } }
      return {seen:seen, reach:reach};
    }
    // LOOP UNTIL THERE IS NOTHING STRANDED, do not run a fixed number of passes. Six was a
    // number I picked, and picking a number is the bug this whole file keeps catching: on one
    // seed six passes cleared it and on another seven components were left, so the gate saw
    // 87.6% on the data fort. The cap below is a runaway guard, not the answer -- the loop
    // ends when the flood finds no stray, which is the actual condition.
    for(var pass=0; pass<400; pass++){
      var f=flood(), stray=null;
      for(y=0;y<H&&!stray;y++)for(x=0;x<W;x++) if(isDrive(G.get(x,y)) && !f.seen[x+','+y]){ stray=[x,y]; break; }
      if(!stray || !f.reach.length) break;
      // nearest connected drive tile, then a straight L cut through whatever is between
      var best=f.reach[0], bd=1e9;
      for(i=0;i<f.reach.length;i++){ var dx=f.reach[i][0]-stray[0], dy=f.reach[i][1]-stray[1], dd=dx*dx+dy*dy;
        if(dd<bd){ bd=dd; best=f.reach[i]; } }
      var sx=stray[0]<best[0]?1:-1, sy=stray[1]<best[1]?1:-1;
      for(x=stray[0]; x!==best[0]; x+=sx) G.set(x, stray[1], 1);
      for(y=stray[1]; y!==best[1]; y+=sy) G.set(best[0], y, 1);
      G.set(best[0],best[1],1);
    }
  }

  /* ===================================================================================
     ONE FACILITY PER BLOB -- AND TWELVE DISTRICTS GET IT IN ONE CHANGE (8/27)

     THE DEFECT. A district generator is handed ONE cell. When the overmap sites a data
     fort across SIX cells, every cell built a complete data fort: six fences, six gates,
     six halls, six of the one hero mass the whole place is named for. Measured before this
     change -- datafort 6, basin 4, watertreat 4 -- and the same for every other utility
     landmark the overmap happens to draw big. `A FACILITY DOES NOT MULTIPLY` is already
     the recorded law; this is the twelve districts it had not reached yet.

     WHY THIS ONE IS CHEAP AND THE OTHER NINE WERE NOT. The solar farm, the wash, the
     railyard, the stadium, the landfill, the cemetery, the golf course, the farm and the
     speedway each needed their own blob-scale rewrite, because each one draws its own
     thing its own way. THE UTILITY FACTORY DOES NOT: twelve landmarks share ONE frame, ONE
     layout dispatch, ONE dressing pass and ONE drive connector, all of which talk to the
     grid through get/set/rect/W/H and nothing else. So the whole blob can be built as a
     SINGLE OVERSIZED DISTRICT -- K.grid already takes a width and height -- and every one
     of the nine layout primitives runs against it completely unchanged. That is the payoff
     of the FACTORY LAW arriving three weeks early: the thirteenth landmark is a spec, and
     so is the fix for all twelve.

     AND A BIGGER SITE IS A BIGGER FACILITY, NOT A SPARSER ONE. Every layout here positions
     proportionally to the plot (W*0.16, W-29, Math.round(W*0.62)), so a quarry across three
     cells is genuinely a three-cell pit and a data hall across six is genuinely a fortress
     -- which is the right answer, and the reason no layout needed rewriting. The four that
     carry a fixed COUNT (pit benches, tank columns and rows, silos, ponds) would have
     spread the same handful of units over nine times the ground, so those grow with the
     blob via `grow` in the spec. Dressing scales with area for the same reason.

     THE ROTATION IS THE PART THAT IS EASY TO GET WRONG. Each cell rotates its canonical
     build to face the real street. If a blob's cells each rotated on their own the district
     would shear at every seam, so the WHOLE blob is rotated once, as one grid, and only
     then does a cell take its window -- at its own index AFTER the same turns. Cells are
     square, so a quarter turn maps cell (i,j) of a bw x bh blob to (bh-1-j, i). */
  /* THE UNIT BLOCK, MOVED, now lives in the kit as K.shift -- the water treatment plant
     wants exactly the same thing and a second copy is how one mechanism becomes two that
     drift. (FACTORY LAW, and the reason K.blob exists at all.) */
  var shifted = K.shift;

  // the fence line alone, at the same insets frame() uses -- WITHOUT frame's two wiping rects
  function fenceOnly(G){
    var W=G.W,H=G.H,x,y;
    for(x=5;x<=W-6;x++){ G.set(x,7,12); G.set(x,H-8,12); }
    for(y=7;y<=H-8;y++){ G.set(5,y,12); G.set(W-6,y,12); }
  }

  var __BLOB = [];                          // at most four blobs held; a valley is never in RAM
  function blobSite(type, B, streets){
    var b=B.bounds, bw=b.x1-b.x0+1, bh=b.y1-b.y0+1;
    var key=type+'|'+b.x0+','+b.y0+','+b.x1+','+b.y1+'|'+B.bseed+'|'+streets.join('');
    for(var q=0;q<__BLOB.length;q++) if(__BLOB[q].key===key) return __BLOB[q];
    var s=SPECS[type], G=K.grid(B.bseed, B.f.w, B.f.h), i, j, x, y;
    var par={}; for(i in (s.par||{})) par[i]=s.par[i];
    /* the four counts that do not scale themselves. 'x' grows with the blob's width in
       cells, 'y' with its height, 'a' with its area -- a tank farm three cells wide has
       three times the tank columns, and nine silos become a real grain terminal. */
    if(s.grow) for(i in s.grow){
      var by=s.grow[i], f=(by==='x'?bw:by==='y'?bh:bw*bh);
      par[i]=Math.max(1, Math.round((par[i]||1)*f));
    }
    frame(G, s.yard);
    /* PROPORTIONAL SITES GROW; FIELD SITES REPEAT. Seven of the nine layouts position
       against W and H (W*0.16, Math.round(W*0.62), W-29), so handing them a blob-sized grid
       makes a genuinely blob-sized facility -- a three-cell quarry pit, a six-cell data
       fortress -- which is exactly right and needed no rewriting.
       THREE DO NOT. The ammunition depot's magazines sit at [16+i*26, 18+j*28], the antenna
       farm's five masts at literal coordinates, the reclamation ponds on a hardcoded 3x3 of
       fixed-size cells. Run those against a 384-tile grid and they draw one small cluster in
       the corner of an enormous empty yard -- the WALKABLE-LAND failure reached from the
       opposite direction, and worse to look at than the bug this whole change fixes.
       So they TILE: the unit block is drawn once per cell of the blob, offset. That is not
       the multiplication defect coming back, because what must not multiply is the FACILITY
       -- one fence, one gate, one site -- and a depot twice the size honestly has twice the
       magazines. Nobody names an antenna farm after one mast. */
    if(s.tile && (bw>1 || bh>1)){
      for(j=0;j<bh;j++) for(i=0;i<bw;i++) LAY[s.lay](shifted(G, i*K.SZ, j*K.SZ), par);
      fenceOnly(G);                     // a tile at the far edge draws over the fence line
    } else {
      LAY[s.lay](G, par);
    }
    dress(G, s.yard);
    var gx=G.W>>1;
    G.rect(gx-2,G.H-8,gx+2,G.H-1,1);
    for(i=-2;i<=2;i++) G.set(gx+i,G.H-1,5);          // ONE car gate, on the DISTRICT's edge
    G.rect(8,G.H-14,G.W-9,G.H-11,1);                 // and ONE perimeter ring, round it all
    G.rect(8,9,G.W-9,11,1);
    G.rect(8,9,10,G.H-11,1);
    G.rect(G.W-11,9,G.W-9,G.H-11,1);
    G.rect(gx-2,G.H-14,gx+2,G.H-8,1);
    /* INTERNAL HAUL ROADS, ONE PER CELL SEAM. A perimeter lane serves a site 128 tiles
       across; it does not serve one 384 tiles across, and an interior cell with no drive
       surface touching its own border reads to every drive gate as a district a car cannot
       enter. Real sites this size are gridded with haul roads for exactly this reason.
       LAID ON SOFT GROUND ONLY -- dead ground, brush, yard, spill, junk, paint -- so a lane
       never drives through the hero mass it exists to serve. connectDrive rejoins whatever
       a building interrupts. */
    function haul(x0,y0,x1,y1){
      for(y=Math.max(y0,9);y<=Math.min(y1,G.H-11);y++) for(x=Math.max(x0,8);x<=Math.min(x1,G.W-9);x++){
        var v=G.get(x,y);
        if(v===0||v===3||v===s.yard||v===8||v===10||v===11) G.set(x,y,1);
      }
    }
    for(i=1;i<bw;i++){ var rx=i*K.SZ; haul(rx-1,9,rx+1,G.H-11); }
    for(i=1;i<bh;i++){ var ry=i*K.SZ; haul(8,ry-1,G.W-9,ry+1); }
    connectDrive(G);
    if(s.mark) K.stencil(G.g, {on:s.mark.on, near:s.mark.near, mark:11,
                               count:(s.mark.count||3)*bw*bh, seed:B.bseed||1});
    var soft=function(c){ return c===0||c===3||c===4; };
    var res=K.rotateToStreet(G.g, streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:12});
    var kmap={S:0,W:1,N:2,E:3};
    var ent={ key:key, g:res.g, turns:kmap[res.primary]||0, bw:bw, bh:bh };
    __BLOB.unshift(ent); if(__BLOB.length>4) __BLOB.pop();
    return ent;
  }
  function clusterCanonical(type, seed, opts, streets){
    var B=K.blob(seed, opts), b=B.bounds, E=blobSite(type, B, streets);
    var i=(opts.cellX|0)-b.x0, j=(opts.cellY|0)-b.y0, bw=E.bw, bh=E.bh, t, ni, nj, sw;
    for(t=0;t<E.turns;t++){ ni=bh-1-j; nj=i; i=ni; j=nj; sw=bw; bw=bh; bh=sw; }
    var W=B.W, H=B.H, out=K.blank(W,H), x, y, ox=i*W, oy=j*H;
    for(y=0;y<H;y++){ var row=E.g[oy+y]; for(x=0;x<W;x++) out[y][x]=row[ox+x]; }
    return out;
  }

  function buildCanonical(type, seed){
    var s=SPECS[type], G=K.grid(seed);
    frame(G, s.yard);
    LAY[s.lay](G, s.par||{});
    dress(G, s.yard);
    // the frame is drawn FIRST and the layout on top of it, so the way back to the curb is
    // re-cut last -- a landmark whose gate does not reach its own building is not a landmark.
    var gx=G.W>>1, i;
    G.rect(gx-2,G.H-8,gx+2,G.H-1,1);
    for(i=-2;i<=2;i++) G.set(gx+i,G.H-1,5);
    // A FULL PERIMETER RING inside the fence, which is what a real fenced industrial site
    // has: you can drive all the way round the inside of the fence line. It also gives every
    // internal road something to reach without threading it to the gate by hand.
    G.rect(8,G.H-14,G.W-9,G.H-11,1);
    G.rect(8,9,G.W-9,11,1);
    G.rect(8,9,10,G.H-11,1);
    G.rect(G.W-11,9,G.W-9,G.H-11,1);
    G.rect(gx-2,G.H-14,gx+2,G.H-8,1);
    connectDrive(G);
    /* THE MARK SOMEBODY LEFT ON IT (8/23). Every district in this factory authored a
       `marking` row -- "the magazine number stencilled on the headwall", "the elevation marks
       on the outlet box, the record of every flood that filled this basin", "call letters
       stencilled on a hut door" -- and NOT ONE OF THEM WAS EVER PLACED. A whole authoring
       pass of the small human detail that makes infrastructure read as USED, written into
       nine legends and never written into a generator. gates/dead_code_gate.js found it.
       ONE STEP HERE, one declaration per district (`mark` in SPECS), rather than nine
       bespoke patches: the mark is a fact about the district, the placing is a mechanism. */
    if(s.mark) K.stencil(G.g, {on:s.mark.on, near:s.mark.near, mark:11,
                               count:s.mark.count||3, seed:(seed>>>0)||1});
    return G.g;
  }
  function makeGenerate(type){
    return function(seed,opts){ opts=opts||{};
      var streets=opts.streets||['S'];
      var soft=function(c){ return c===0||c===3||c===4; };
      /* ONE CELL IS NOT A BLOB. Bounds that span a single cell take the original build,
         untouched, because that art already shipped and there is no neighbour to line up
         with. Proven byte-identical, every type, both paths. */
      var b=opts.bounds, g, gates;
      if(b && (b.x1>b.x0 || b.y1>b.y0)){
        g = clusterCanonical(type, seed>>>0, opts, streets);
        gates = K.scanGates(g, 5);          // per CELL: an interior cell honestly has none
      } else {
        var res=K.rotateToStreet(buildCanonical(type,seed>>>0), streets,
          {gate:5, pedWalk:1, pedOver:soft, pedInset:12});
        g=res.g; gates=res.gates;
      }
      return { g:g, W:g[0].length, H:g.length, streets:streets, gates:gates,
               footprints:K.footprints(g,function(v){return v===2;}) };
    };
  }

  // BATCH OUTPUT: build the palette, legend and notes for every spec from its own table, so
  // twelve dossiers come out of one machine and none of them can be half-written.
  var API={ SPECS:SPECS, LAY:LAY, types:function(){ return Object.keys(SPECS); } };

  Object.keys(SPECS).forEach(function(type){
    var s=SPECS[type];
    var legend={};
    Object.keys(s.leg).forEach(function(code){
      var e=s.leg[code];
      legend[code]=L(e[0],e[1],e[2],e[3]);
    });
    legend[2].enter = 'the ' + type + ' building interior: the working room at the front, stores and plant behind it';
    var notes={
      summary: s.sum,
      reference: s.ref,
      layout: [ 'Built canonical-south on the DISTRICT KIT and rotated to the real street: a fenced site, ONE car gate, an access road in, one perimeter lane inside the fence.',
                'The site itself is the ' + s.lay.toUpperCase() + ' plan: ' + s.sum.toLowerCase() ],
      circulation: 'Street-aware via K.rotateToStreet (canonical-south, order S>E>W>N): the car gate lands on the primary street and a corner adds a PEDESTRIAN gate on the side street, never a second car entrance. The access road plus the perimeter lane are the explicit car surface (code 1) and a vehicle reaches the site building from the curb (K.driveReachFromStreet). WALKABLE-LAND: the working site dominates; the road is minimal.',
      layering: 'GROUND (walk/drive, flat): the site dead-ground (0), the working surface (4), the access road (1, drive), markings (11), and any standing water (8). STRUCTURE (three-quarter front face, SOLID): the hero mass (6), the secondary structure (7), the site building (2, ENTERABLE), the fence (12), the pipe/conveyor runs (13) and the VERTICAL (14). PROPS (solid): pole lights (9) and the prop cluster (10). PORTAL: the gate (5). What blocks is the mass; what you walk on is the working surface; what you go inside is code 2.',
      decisions: [ 'ACT ONE ONLY: everything on this site is dead. No act-2/3 material is named anywhere in this module.',
                   'Category ' + s.cat + '. Zero purple (PURPLE RESERVATION).',
                   'RESEARCH-FIRST: every reference above is a real Las Vegas valley facility, cited, not remembered.',
                   'Built by the UTILITY LANDMARK FACTORY (engine/bohemia_utility.js) from a typed spec, per the FACTORY LAW: the thirteenth landmark is a spec, not a file.',
                   'MECHANISM-MINE / CONTENTS-PAOLO\'S: no operator name, no signage text, no brand anywhere on the site.' ]
    };
    var gen=makeGenerate(type);
    K.register(type, { generate:gen, body:function(c){return c===2;}, category:s.cat,
                       palette:s.pal, legend:legend, notes:notes });
    API[type]={ generate:gen, palette:s.pal, legend:legend, notes:notes,
                footprints:function(r){return r.footprints;} };
  });

  if(typeof module!=='undefined')module.exports=API; root.BohemiaUtility=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
