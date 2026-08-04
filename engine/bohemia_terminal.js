// BOHEMIA TRANSIT TERMINAL (7/23/26; REBUILT 8/2/26). INFRASTRUCTURE, on the DISTRICT KIT.
//
// THE REBUILD. The old district was a generic intercity bus station: a rectangular terminal
// box, a straight canopy, and 26% of the plot painted LAWN in a Mojave valley where nothing
// has been watered in a decade. That lawn is the same greenwash Paolo caught in downtown
// ("are you putting grass in downtown?"), and the plot ran 30.5% drive against 14% building.
//
// BUILT INSTEAD ON THE ONE THIS VALLEY HAS: the BONNEVILLE TRANSIT CENTER (2010, 101 E
// Bonneville Ave, downtown Las Vegas), and its numbers are the district's numbers:
//   16 ON-SITE VEHICLE BAYS, in a sawtooth so a bus pulls in and out without reversing.
//   SOLAR-PANEL SHADE STRUCTURES over the bays -- the whole reason you can stand there in
//     July, and a LEED Platinum building's actual signature.
//   7 ON-STREET LOADING POINTS at the kerb, beyond the 16 on site.
//   ~100 DOUBLE-STACKED BIKE RACKS and a self-service repair stand.
//   A 2-STOREY, ~20,000 sq ft head house with a fully enclosed waiting room, and the
//     CURVED lines that got it its design award.
// 16, 7 and 100 are counted by the gate. A number taken from the real building is a fact
// the machine can hold; a number invented on the day is decoration.
//
// VEHICULAR VENUE (WALKABLE-LAND LAW exception): at a transit centre the vehicle surface IS
// the venue. Exempt from the pavement cap -- and still DRESSED, never a bare apron.
//
// Act-1 DEAD: buses left in the bays and along the layover row, the panels milky, the
// waiting room dark behind its glass. Street-aware + drivable: one kerb cut, and the apron,
// the bays and the park-and-ride are one connected surface a bus can turn in.
// LEGEND:
//  0 desert dead-ground   1 apron / drive / lot (DRIVABLE)   2 head house
//  3 dead tree            4 hardpan                          5 gate / kerb cut
//  6 rooftop solar array   7 forecourt paving              8 rooftop plant
//  9 light               10 bay post                        11 curtain wall glazing
//  12 bike rack          13 boarding platform               14 roof edge
//  15 dead bus           16 doorway (PORTAL)                17 stall marking (PAINT)
//  18 dead car           19 kerb loading mark (PAINT)       20 bay marking (PAINT)
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  var BAYS = 16, KERB_POINTS = 7, BIKE_RACKS = 100;   // Bonneville's own counts

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }

    G.rect(0,0,W-1,H-1,0);
    G.rect(3,3,W-4,H-4,4);                                   // hardpan, NOT lawn
    G.rect(6,6,122,52,7);                                     // the forecourt paving

    /* ---- THE HEAD HOUSE: two storeys, and CURVED, which is what it won its award for. ---- */
    G.rect(16,8,112,30,2);
    G.disc(64,30,26,2);                                       // the curved concourse bulging south
    G.rect(38,28,90,40,2);                                    // merged into the bar
    for(x=20;x<=108;x+=5) G.rect(x,28,x+2,30,11);             // the glazed south wall
    for(x=24;x<=104;x+=14) G.rect(x,12,x+6,17,8);             // rooftop plant
    /* THE ROOF IS NOT A FLAT PLATE: the joint lines and the concourse skylight run. */
    for(x=20;x<=110;x+=9) G.rect(x,8,x,30,21);
    for(y=13;y<=27;y+=7) G.rect(16,y,112,y,21);
    for(x=22;x<=104;x+=7) G.rect(x,21,x+4,26,11);
    G.rect(58,44,72,48,16);                                   // the doors onto the platform

    /* ---- THE BOARDING PLATFORM, and the 16 SAWTOOTH BAYS off it. ---- */
    G.rect(8,54,120,66,13);
    var bays=0;
    for(i=0;i<BAYS;i++){
      var bx=9+i*7;
      /* SAWTOOTH: each box is STEPPED against its neighbour, which is what lets a coach
         pull straight out instead of reversing across the apron. A row of identical
         rectangles is a car park; the step is the whole geometry. */
      G.rect(bx,68+(i%2)*3,bx+5,80,20);
      G.rect(bx,66,bx+1,68+(i%2)*3,20);
      set(bx+2,60,10);                                        // the bay post on the platform
      bays++;
    }

    /* ---- THE APRON: one surface a bus can turn a full circle in. ---- */
    G.rect(6,66,122,112,1);
    for(i=0;i<BAYS;i++){ var bx2=9+i*7; G.rect(bx2,68+(i%2)*3,bx2+5,80,20); G.rect(bx2,66,bx2+1,68+(i%2)*3,20); }
    /* the apron's own lane lines, so a bus knows where the through route is */
    for(x=10;x<=118;x+=3) { set(x,86,22); set(x,90,22); }
    for(x=10;x<=118;x+=3) set(x,109,22);

    /* NO CANOPY (Paolo 8/2: "new rule no more canopies I only see canopies at parks and
       shit"). The photovoltaic array does not go OVER the platform any more -- it goes ON
       THE HEAD HOUSE ROOF, which is where a roof-mounted array belongs and is a structure
       rather than a shelter. The PV stays because it is the building's real signature and
       it is EQUIPMENT; the thing he ruled out is a shade plane you stand under, and there
       is not one on this plot now. */
    for(y=10;y<=26;y+=5) for(x=20;x<=106;x+=8) if(get(x,y)===2) G.rect(x,y,x+5,y+2,6);
    for(x=18;x<=108;x+=8) for(y=10;y<=28;y++) if(get(x,y)===6) set(x,y,9);   // the array frames

    /* dead buses left in the bays and along the layover row */
    for(i=0;i<BAYS;i+=3){ var vx=9+i*7; G.rect(vx+1,69,vx+4,78,15); }
    for(x=12;x<=108;x+=14) G.rect(x,96,x+4,106,15);           // the layover row

    /* ---- THE BIKE RACKS: 100 of them, double-stacked, beside the doors. ---- */
    var racks=0;
    for(y=34;y<=50&&racks<BIKE_RACKS;y+=3) for(x=94;x<=118&&racks<BIKE_RACKS;x+=2){
      if(get(x,y)!==7) continue; set(x,y,12); racks+=2;       // double-stacked: two per unit
    }
    for(y=34;y<=50&&racks<BIKE_RACKS;y+=3) for(x=10;x<=34&&racks<BIKE_RACKS;x+=2){
      if(get(x,y)!==7) continue; set(x,y,12); racks+=2;
    }

    /* ---- PARK-AND-RIDE, small: a transit centre is not a commuter garage ---- */
    G.rect(6,112,122,122,1);
    for(x=9;x<=119;x+=3) for(y=113;y<=121;y++) set(x,y,17);
    for(i=0;i<12;i++){ var cx=10+Math.floor(r()*27)*4, cy=114+Math.floor(r()*2);
      if(get(cx+1,cy)===1||get(cx+1,cy)===17) G.rect(cx+1,cy,cx+2,cy+3,18); }

    /* ---- THE 7 ON-STREET LOADING POINTS at the kerb, beyond the 16 on site ---- */
    var KX=[8,22,36,50,78,92,106];                            // clear of the kerb cut on purpose
    for(i=0;i<KERB_POINTS;i++){ G.rect(KX[i],124,KX[i]+9,126,19); }

    for(x=14;x<=114;x+=16) set(x,110,9);                      // the apron light line
    for(i=0;i<20;i++){ var tx=4+Math.floor(r()*120), ty=4+Math.floor(r()*120);
      if(get(tx,ty)===4) set(tx,ty,3); }

    K.roofsAndDoors(g,{ building:function(c){return c===2;}, roof:14, door:16, min:150,
      outside:function(c){ return c===7||c===13||c===4||c===1||c===17||c===20; } });

    var gx=64;
    for(i=-6;i<=6;i++) set(gx+i,H-1,5);
    for(y=H-1;y>=122;y--) for(x=-6;x<=6;x++){ var c=get(gx+x,y); if(c===0||c===4||c===7||c===19) set(gx+x,y,1); }
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4||c===7; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:13, pedOver:soft, pedInset:12});
    var g=res.g, n=function(code){ var k=0; for(var yy=0;yy<g.length;yy++) for(var xx=0;xx<g[0].length;xx++) if(g[yy][xx]===code) k++; return k; };
    /* a BAY is a painted box, not a tile, so it is counted as a connected blob of paint --
       the same way a person counts bays by walking the platform. */
    var bayBlobs=K.footprints(g,function(v){return v===20;}).length;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      bays:bayBlobs, kerbPoints:K.footprints(g,function(v){return v===19;}).length,
      bikeRacks:n(12)*2,
      footprints:K.footprints(g,function(v){return v===2||v===11||v===14||v===16||v===21;})};
  }
  function driveConnected(res){ return K.driveNetworkReach(res.g, LEGEND) > 0.999; }

  /* CONCRETE, SAND AND SUN-BLEACHED PAINT. Nothing green. */
  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#8c8577',3:'#514f40',4:'#6b6250',5:'#c79a3f',
    6:'#3f4a55',7:'#7f7a70',8:'#6e6a60',9:'#b0863a',10:'#5f5c54',11:'#8fa2ad',12:'#5d6a6e',
    13:'#96907f',14:'#b3a78d',15:'#5c6468',16:'#241f1a',17:'#4a4a52',18:'#6a6e72',
    19:'#8a7a48',20:'#55555f',21:'#6f6a5e',22:'#57575f'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',   act1:'bare Mojave dirt at the property line, sun-cracked, drift sand banked against the kerb'},
    1:{name:'apron / drive / lot',kind:'drive',    act1:'the bus apron and the park-and-ride — heavy-duty concrete gone to plates, weeds up every joint (bus- and car-drivable)'},
    2:{name:'head house',         kind:'building', act1:'the two-storey terminal, its long curved south wall glazed end to end, the waiting room dark behind it', enter:'terminal interior: the enclosed waiting room along the curve, the ticket and information counter, restrooms, and the operations offices on the upper floor'},
    3:{name:'dead tree',          kind:'tree-dead',act1:'a dead forecourt tree gone to stick, its grate prised up for the metal', solid:false},
    4:{name:'hardpan',            kind:'ground',   act1:'decomposed granite gone to hardpan at the edges of the site, split by weeds. Not a lawn: nothing is watering this'},
    5:{name:'gate / kerb cut',    kind:'gate',     act1:'the kerb cut off the street onto the apron, wide enough for a bus, amber paint gone chalky'},
    6:{name:'rooftop solar array',kind:'structure',act1:'the photovoltaic array bolted across the head house roof — the LEED Platinum signature, the glass milky now and half the strings stripped for the copper in their leads', solid:true},
    7:{name:'forecourt paving',   kind:'ground',   act1:'the paved forecourt between the street and the head house, big scored slabs heaved at the joints'},
    8:{name:'rooftop plant',      kind:'structure',act1:'a mechanical unit on the head house roof, ducting collapsed, one of them stripped out entirely'},
    9:{name:'light',              kind:'structure',act1:'an apron light on its concrete stem, head dark, the glass long gone'},
    10:{name:'bay post',          kind:'structure',act1:'the numbered post at the nose of a bay, the route board on it faded to a blank white rectangle'},
    11:{name:'curtain wall glazing',kind:'structure',act1:'the glazed curve of the waiting room — the panels that are left are sun-hazed, the rest is board and sky'},
    12:{name:'bike rack',         kind:'structure',act1:'a double-stacked bike rack, two bikes high, most of the hoops empty and one wheel still locked to the frame'},
    13:{name:'boarding platform', kind:'walk',     act1:'the raised boarding platform running the length of the bays, tactile edge strip worn smooth'},
    14:{name:'roof edge',         kind:'structure',act1:'the parapet line where the head house roof meets its wall, coping missing in runs'},
    15:{name:'dead bus',          kind:'vehicle',  act1:'a bus left where it stopped, glass gone, tyres flat and perished into the concrete'},
    16:{name:'doorway',           kind:'portal',   act1:'a way in — the platform doors, and the operations door on the north side'},
    17:{name:'stall marking',     kind:'marking',  act1:'the painted stall ticks across the park-and-ride, chalked out to ghosts — PAINT IS NOT A WALL, a car drives straight over it'},
    18:{name:'dead car',          kind:'vehicle',  act1:'a car left in the park-and-ride, flat and sun-bleached, nobody came back for it'},
    19:{name:'kerb loading mark', kind:'marking',  act1:'a painted on-street loading point at the kerb — one of seven, yellow gone to bone. PAINT IS NOT A WALL'},
    22:{name:'lane line',         kind:'marking',  act1:'the dashed lane line down the apron, showing a coach the through route past the bays. PAINT IS NOT A WALL'},
    21:{name:'roof joint',        kind:'structure',act1:'the joint line between two roof plates on the head house, sealant gone chalky and lifted out in runs', solid:true},
    20:{name:'bay marking',       kind:'marking',  act1:'the painted box of a sawtooth bay, angled so a bus pulls straight out without reversing. PAINT IS NOT A WALL'}
  };
  var NOTES={
    summary:'A dead transit centre — a curved two-storey head house behind a glazed south wall, an open boarding platform, a PHOTOVOLTAIC ARRAY on the head-house roof, SIXTEEN sawtooth bus bays with the buses still in some of them, SEVEN on-street loading points at the kerb, a hundred double-stacked bike racks, a layover row and a small park-and-ride. A VEHICULAR VENUE: the vehicle surface is the venue.',
    reference:['BONNEVILLE TRANSIT CENTER (2010, 101 E Bonneville Ave, downtown Las Vegas), LEED Platinum: 16 on-site vehicle bays, 7 on-street loading points, roughly 100 double-stacked bike racks with a self-service repair stand, preferred parking for hybrids, a fully enclosed passenger waiting area in a 2-storey ~20,000 sq ft building, and SOLAR-PANEL SHADE STRUCTURES over the bays. Its curved lines are what the design juries singled out.',
      'Sawtooth bay geometry, standard for bus facilities: angled boxes off a single platform edge so a coach pulls in and pulls straight out again without reversing across the apron.'],
    layout:['THE HEAD HOUSE runs across the north as a bar with a CURVED concourse bulging south out of it — one building, the curve merged into the bar, its whole south wall glazed.',
      'THE BOARDING PLATFORM runs the full width below it, with a numbered POST at the nose of each bay.',
      'SIXTEEN SAWTOOTH BAYS are painted off the platform edge onto the apron, angled, with buses still standing in every third one.',
      'THE PHOTOVOLTAIC ARRAY sits ON THE HEAD-HOUSE ROOF (8/2), not over the platform. Same panels, same count, roof-mounted equipment — nothing left for a person to stand under. The platform is open sky.',
      'A HUNDRED DOUBLE-STACKED BIKE RACKS stand in two banks on the forecourt either side of the doors.',
      'THE LAYOVER ROW is the line of parked buses across the middle of the apron; the PARK-AND-RIDE and its stall ticks fill the south strip; SEVEN painted on-street loading points sit at the kerb outside the property line.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: ONE kerb cut, deliberately wider than a car gate because a bus has to make it, feeds an apron that is a single connected surface a coach can turn in — bays, layover row and park-and-ride all reach the kerb (K.driveNetworkReach = 1.0). Every painted thing here (bay boxes, stall ticks, kerb points) is MARKING, so a bus drives straight over it, and NOTHING on this plot is overhead. Foot circulation is forecourt -> doors -> waiting room -> platform -> bay. A corner adds a pedestrian gate onto the forecourt.',
    layering:'GROUND (flat): the forecourt paving (7), the hardpan (4), the boarding platform (13, WALK), the apron / park-and-ride (1, DRIVE) with bay boxes (20), stall ticks (17) and kerb points (19) all MARKING, bare desert (0). OVERHEAD (pass UNDER): NOTHING — this plot carries no overhead tile at all (Paolo 8/2, no more canopies). STRUCTURE (¾ front face, solid, ENTERABLE): the HEAD HOUSE (2 — enclosed waiting room, ticket counter, restrooms, upstairs operations), its curtain wall glazing (11), roof edge (14), rooftop plant (8), the ROOF-MOUNTED PV array (6), the bay posts (10), the bike racks (12), the apron lights (9). PROP: dead trees (3), dead buses (15) and cars (18). PORTAL: the doorways (16) and the kerb cut (5).',
    decisions:['THE LAWN IS DEAD. 26% of this plot was painted green in a valley that stopped watering things a decade before act one opens — the exact greenwash Paolo caught in downtown. Replaced with hardpan and paved forecourt.',
      'THE NUMBERS ARE THE REAL BUILDING\'S: 16 bays, 7 kerb loading points, 100 double-stacked racks. The gate counts all three. A number taken from the real thing is a fact the machine can hold; a number invented on the day is decoration.',
      'VEHICULAR VENUE (WALKABLE-LAND exception, 7/20): at a transit centre the vehicle surface IS the venue, so the pavement cap does not apply — but the exemption is not a licence for a bare apron, and this one is dressed with platform, shade, posts, racks, buses and a layover row.',
      'Deliberately differentiated from the railyard (FREIGHT rail, no passengers) and from every other district: nothing else in the valley is a sawtooth of sixteen bays under a solar deck. Every district is its own landmark (7/28).',
      'Act-1 DEAD: buses in the bays with the glass gone and the tyres perished into the concrete, route boards faded to blank rectangles, panels milky and half stripped for copper. Who runs anything on these roads now is faction canon and stays Paolo\'s.',
      'Zero purple. No route numbers, agency name or signage text anywhere (Paolo\'s to author).']
  };
  K.register('terminal', { generate:generate, body:function(c){return c===2||c===11||c===14||c===16||c===21;},
    category:'infrastructure', vehicular:true, palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,BAYS:BAYS,KERB_POINTS:KERB_POINTS,BIKE_RACKS:BIKE_RACKS,
    footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaTerminal=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
