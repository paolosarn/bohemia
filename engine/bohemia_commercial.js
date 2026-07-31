// BOHEMIA COMMERCIAL — THE DEAD POWER CENTER (rebuilt 7/31/26, WORLD lane)
//
// PAOLO 7/31: "WE GOTTA BUILD THIS FUCKING WORLD!!! AND MAKE IT LOOK GOOD"
// (laws/BOHEMIA_ADDENDUM_BUILD_THE_WORLD_7_31_26.md). I put every district on one contact
// sheet and looked at them together instead of guessing, and this was the worst thing on
// it: ONE FLAT TAN L and a striped parking lot. No second building, no colour, no
// landmark, nothing that ever happened on the pavement. It is also the most common
// district type in a city, so it was doing more damage to how the valley looks than
// anything else in the set.
//
// AND IT WAS NEVER EVEN IN THE GAME. The old module never bound K. Its registration sat
// behind `typeof K!=='undefined'`, which quietly resolved against a global some OTHER
// module happened to leak, so whether this district existed depended on file load order.
// The walked city has been rendering commercial from LEGACY PREFAB STAMPS with not one
// enterable building. Its own header admitted binding K turned walkable_gate red, because
// on a single street the old generator built ONE strip and let parking eat the rest —
// 61% drive against 30% content. That is not a binding problem, it is a design problem,
// and it is fixed here by building a district that has enough in it.
//
// THE REFERENCE IS A REAL VEGAS POWER CENTER, and the shape is why one reads instantly:
//   - A BIG-BOX ANCHOR across the back, the largest single roof on the plot.
//   - An L of INLINE SHOP UNITS down one side, narrow bays under a continuous awning.
//   - THE AWNINGS ARE THE COLOUR. A real strip is a row of different faded brand colours
//     over identical concrete boxes, and that is exactly the hue the 7/28 measurement said
//     the valley was missing. Three awning colours, cycling per unit, is the whole fix.
//   - OUTPARCEL PADS at the kerb — a fuel canopy and a drive-thru restaurant with its own
//     lane wrapping the building. Outparcels are the thing that makes a lot read as a
//     retail centre rather than an empty apron.
//   - A PYLON SIGN at the street. The tall thing you see before you see the shops.
//   - A SERVICE ALLEY behind the anchor with dumpsters and roll-up doors. Every business
//     has a back door (Paolo 7/18, kept).
//   - AND IT IS DRESSED: cars nobody came back for, carts drifted against the islands,
//     pallets stacked at the docks. Pavement with nothing on it is an absence.
//
// THE APPROVED STANDARD IT IS BUILT TO is the high school (89%, 7/31): a landmark
// silhouette, density over pavement, real hue, no flat rectangles, and dressed.
// Roofs and doors come from K.roofsAndDoors, the shared machine — every mass gets an eave,
// a ridge that stops short of both ends, and a door onto somewhere you can actually stand.
//
// ACT ONE ONLY (Paolo 7/28). Dead, looted, sun-bleached. No act-2/3 materials.
// MECHANISM-MINE / CONTENTS-PAOLO'S: no brand names, no signage text, no logos. The pylon
// and the shop fascias are blank because the words on them are his to write.
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);

  var ROOF=13, DOOR=14;

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }

    G.rect(0,0,W-1,H-1,0);
    G.rect(3,3,W-4,H-4,4);                                    // the dead landscape setback

    /* ---- THE SERVICE ALLEY, behind everything (Paolo 7/18: every business has a back
       door for trash and deliveries) ---- */
    G.rect(4,4,W-5,9,15);
    G.rect(120,4,124,86,15);                                  // and down the east side

    /* ---- THE ANCHOR: the big box across the back. The largest roof on the plot, and the
       thing that makes this district's silhouette. ---- */
    G.rect(8,11,70,46,2);
    for(i=0;i<6;i++) G.rect(14+i*10,7,19+i*10,10,16);         // loading docks + pallets on the alley
    for(i=0;i<5;i++) G.rect(16+i*12,18,22+i*12,23,13);        // ROOFTOP PLANT -- the big-box tell
    for(i=0;i<4;i++) G.rect(20+i*12,34,25+i*12,37,13);
    G.rect(8,47,70,50,6);                                     // the storefront walk
    G.rect(12,47,66,48,10);                                   // the anchor's own awning band
    /* THE GARDEN CENTRE on the east end -- a walled outdoor yard is the other thing every
       big box has, and it breaks the roofline instead of extending the same rectangle. */
    G.rect(72,11,88,46,4);
    G.rect(72,11,88,11,21); G.rect(72,46,88,46,21);           // it is a WALL, not a roofed mass
    G.rect(72,11,72,46,21); G.rect(88,11,88,46,21);
    G.rect(78,46,82,46,14);                                   // the gate you walk in through
    for(i=0;i<4;i++) G.rect(76,16+i*8,84,19+i*8,3);           // the dead stock, still in rows

    /* ---- THE INLINE SHOPS: narrow bays down the east, under a continuous awning.
       THE AWNINGS ARE THE COLOUR OF THIS DISTRICT — three faded brand colours cycling per
       unit over identical concrete boxes, which is exactly what a real strip looks like
       from above and exactly the hue the valley was missing. ---- */
    /* EACH UNIT IS ITS OWN MASS, with a party-wall gap between them. Drawn as one long
       rectangle they merge into a single box and the eave draws one outline round the lot
       -- which is exactly how the old module read, and how my first cut of this one read
       too. A strip is a ROW of things or it is nothing. */
    var SX0=96, SX1=118, SY0=14, SY1=88, UNIT=8, PITCH=10;
    G.rect(SX0-7,SY0,SX0-1,SY1,6);                            // the covered walk in front
    for(y=SY0; y+UNIT-1<=SY1; y+=PITCH){
      var u=((y-SY0)/PITCH)|0;
      G.rect(SX0,y,SX1,y+UNIT-1,2);                           // the unit
      G.rect(SX0,y+1,SX0,y+UNIT-2,7);                         // its glass line
      G.rect(SX0-4,y,SX0-2,y+UNIT-1,8+u%3);                   // ITS AWNING -- 3 wide so it reads
      set(SX1,y+3,DOOR);                                      // its back door to the side alley
    }

    /* ---- THE LOT. Double-loaded bays: stalls, aisle, stalls. Short ticks PERPENDICULAR
       to the aisle -- a full-width line is a barcode, which is what made the school's first
       lot "dogshit" (Paolo 7/29). Landscape islands break it up, the way a real one does,
       and they are where the carts end up. ---- */
    G.rect(6,54,88,112,1);
    function bay(top){
      for(x=10;x<=84;x+=4){
        for(y=top;y<=top+6;y++) set(x,y,11);
        for(y=top+16;y<=top+22;y++) set(x,y,11);
      }
      G.rect(8,top,86,top,11); G.rect(8,top+22,86,top+22,11);
    }
    bay(56); bay(84);
    for(i=0;i<4;i++){ var ix=14+i*19;                         // the landscape islands
      G.rect(ix,79,ix+8,81,4); set(ix+4,80,3);
    }
    /* nobody came back for these */
    for(i=0;i<22;i++){
      var cx2=10+Math.floor(r()*19)*4, cy2=(r()<0.5?57:85)+Math.floor(r()*5);
      if(get(cx2+1,cy2)===1||get(cx2+1,cy2)===11) G.rect(cx2+1,cy2,cx2+2,cy2+3,17);
    }
    for(i=0;i<16;i++){                                        // carts, drifted against the islands
      var tx=12+Math.floor(r()*74), ty=76+Math.floor(r()*8);
      if(get(tx,ty)===1) set(tx,ty,18);
    }

    /* ---- OUTPARCEL PADS AT THE KERB. The thing that makes a lot read as a retail centre
       instead of an apron: buildings out in front, each with its own little site. ---- */
    /* the fuel canopy, west pad */
    G.rect(8,116,34,124,1);
    G.rect(10,117,32,122,19);                                 // canopy (you drive UNDER it)
    for(x=14;x<=28;x+=6){ set(x,119,20); set(x,120,20); }     // pumps
    G.rect(8,110,22,115,2);                                   // the kiosk

    /* the drive-thru restaurant, east pad — the LANE WRAPPING THE BUILDING is the read.
       (First cut drew the lane AFTER the building and erased it. Lane first, then the box.) */
    G.rect(58,106,94,124,1);
    G.rect(66,110,86,120,2);
    for(y=111;y<=119;y+=3) set(63,y,11);                      // the order lane markings
    for(x=68;x<=84;x+=4) set(x,123,11);

    /* the bank pad, south-east — the corner was an empty olive void and a real centre
       fills its street frontage with pads, not lawn */
    G.rect(98,96,124,124,1);
    G.rect(104,102,120,114,2);
    G.rect(102,117,122,121,19);                               // its drive-thru canopy
    for(x=106;x<=118;x+=4) set(x,119,11);

    /* ---- THE PYLON SIGN. The tall thing you see from the road before you see the shops.
       Blank board: the words on it are Paolo's, never mine. ---- */
    G.rect(44,120,50,126,12);
    set(46,118,12); set(47,118,12);

    /* ---- dead planting through the setback ---- */
    for(i=0;i<30;i++){ var px2=5+Math.floor(r()*(W-10)), py2=5+Math.floor(r()*(H-10));
      if(get(px2,py2)===4){ set(px2,py2,3); } }

    /* ---- ROOFS AND DOORS, from the shared machine (7/31). Every mass gets an eave, a
       ridge that stops short, and a door onto somewhere you can stand. ---- */
    K.roofsAndDoors(g,{ building:function(c){return c===2;}, roof:ROOF, door:DOOR, min:60,
                        outside:function(c){ return c===1||c===6||c===15||c===4||c===11; } });

    /* ---- the one car entrance, canonical south ---- */
    var gx=52;
    for(i=-5;i<=5;i++) set(gx+i,H-1,5);
    for(y=H-1;y>=112;y--) for(x=-5;x<=5;x++){ var c=get(gx+x,y); if(c===0||c===3||c===4) set(gx+x,y,1); }
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:6, pedOver:soft, pedInset:14});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2||v===ROOF||v===DOOR||v===7;})};
  }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }
  function storeFootprints(res){ return res.footprints; }
  function hasServiceAccess(res){
    var g=res.g,doors=0,alley=0;
    for(var y=0;y<res.H;y++)for(var x=0;x<res.W;x++){ if(g[y][x]===DOOR)doors++; if(g[y][x]===15)alley++; }
    return doors>0 && alley>0;
  }

  /* THE PALETTE CARRIES REAL HUE. The awnings are the whole point: three faded brand
     colours over identical concrete boxes is what a strip mall IS, and it is the cheapest
     honest colour in the game. Everything stays inside the dead world's value band. */
  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#7c7367',3:'#3a4526',4:'#4a4a35',5:'#c79a3f',
    6:'#8a8a92',7:'#3f4e52',8:'#8c3f38',9:'#2f6058',10:'#a8842f',11:'#c9c1aa',12:'#b0863a',
    13:'#a39a88',14:'#241f1a',15:'#2b2b31',16:'#6a6e72',17:'#6a6e72',18:'#9aa0a6',
    19:'#5f6670',20:'#8a5a4a',21:'#6e6a5c'};
  var LEGEND={
    0:{name:'dead-ground',        kind:'ground',   act1:'bare cracked dirt at the property line'},
    1:{name:'lot asphalt',        kind:'drive',    act1:'the cracked parking field and its drive aisles, weeds up every joint (car-drivable)'},
    2:{name:'store',              kind:'building', act1:'concrete shell — the anchor box and the inline shop bays, fascia stripped, glass out', enter:'retail interior: an open sales floor, checkout line stripped for metal, stock room and office behind'},
    3:{name:'dead tree',          kind:'tree-dead',act1:'a dead lot tree in its island, gone to stick', solid:false},
    4:{name:'landscape island',   kind:'ground',   act1:'a kerbed landscape island in the lot, dirt and dead shrub'},
    5:{name:'curb cut / gate',    kind:'gate',     act1:'the driveway curb cut off the street, amber paint gone chalky'},
    6:{name:'storefront walk',    kind:'walk',     act1:'the covered concrete walk along the shopfronts, cracked, glass underfoot'},
    7:{name:'storefront glass',   kind:'building', act1:'the shopfront glazing line, dark and mostly out', layer:'structure'},
    8:{name:'awning (red)',       kind:'structure',act1:'a faded red shop awning, canvas split and hanging', layer:'overhead', solid:false},
    9:{name:'awning (teal)',      kind:'structure',act1:'a faded teal shop awning, sun-bleached to grey-green', layer:'overhead', solid:false},
    10:{name:'awning (gold)',     kind:'structure',act1:'a faded gold shop awning, one end torn away', layer:'overhead', solid:false},
    11:{name:'stall marking',     kind:'marking',  act1:'a faded white stall tick, most of them ghosts now'},
    12:{name:'pylon sign / pole', kind:'structure',act1:'the tall pylon sign at the kerb, board blank and weather-blown, and the lot light poles'},
    13:{name:'roof ridge / plant',kind:'structure',act1:'the roof edge and the rooftop units — the parapet line, HVAC boxes, a stripped condenser'},
    14:{name:'doorway',           kind:'portal',   act1:'a way in — a shop entry with the glass gone, or a steel back door standing open'},
    15:{name:'service alley',     kind:'drive',    act1:'the rear service lane, oil-black, drivable'},
    16:{name:'dock / pallets',    kind:'prop',     act1:'a loading dock with pallets still stacked on it and nobody to load them'},
    17:{name:'dead car',          kind:'vehicle',  act1:'a car left in its stall, flat, sun-bleached, never collected'},
    18:{name:'shopping cart',     kind:'prop',     act1:'a shopping cart drifted up against a kerb', solid:false},
    19:{name:'fuel canopy',       kind:'structure',act1:'the fuel-island canopy, brand panels stripped, you drive under it', layer:'overhead', solid:false},
    20:{name:'fuel pump',         kind:'prop',     act1:'a dead pump, hoses down, screen dark'},
    21:{name:'garden centre wall', kind:'fence',    act1:'the block wall round the garden centre yard — open to the sky, which is why it has no roof, gate hanging off its hinge'}
  };
  var NOTES={
    summary:'A dead power center: a big-box ANCHOR across the back, an L of inline shop bays under coloured awnings down the east, a lot of double-loaded parking bays with landscape islands, outparcel pads at the kerb (a fuel canopy and a drive-thru restaurant with its lane wrapping it), a pylon sign at the street, and a service alley with docks behind the whole thing.',
    reference:[
      'PAOLO 7/31: "WE GOTTA BUILD THIS FUCKING WORLD!!! AND MAKE IT LOOK GOOD." Every district was rendered onto one contact sheet and compared; this was the worst thing on it — one flat tan L and a striped lot — and it is the most common district type in a city, so it was doing the most damage to how the valley reads.',
      'Real Vegas power-center site planning: anchor at the back of the pad, inline shops in an L, outparcels held out at the kerb where the traffic is, service drive behind. The outparcels are what make a lot read as a retail centre rather than an apron.',
      'THE AWNINGS ARE THE COLOUR. A real strip is identical concrete boxes made different by a row of faded brand awnings. The 7/28 hue measurement said our districts ran a median of three colour families against the reference twelve; this is the cheapest honest colour available and it is what the building type actually looks like.',
      'Built to the approved HIGH SCHOOL standard (89%, 7/31): landmark silhouette, density over pavement, no flat rectangles, real hue, and dressed.'
    ],
    layout:[
      'The ANCHOR is the big box across the north, the largest roof on the plot, with loading docks onto the service alley behind it.',
      'The INLINE SHOPS run down the east in narrow bays, each with its own glass line, its own awning colour and its own back door onto the side alley.',
      'The LOT is double-loaded bays — stalls, aisle, stalls — with kerbed landscape islands breaking it up and the cars still in it.',
      'OUTPARCELS sit at the kerb: a fuel canopy with its kiosk on the west pad, a drive-thru restaurant on the east pad with the order lane wrapping the building.',
      'The PYLON SIGN stands at the street beside the entrance, board blank.'
    ],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: ONE car entrance on the primary street. The drive network is the lot, the outparcel pads, the drive-thru lane and the rear service alley (code 1 and 15), all one connected surface reachable from the kerb (K.driveReachFromStreet). On foot the covered walks (6) run the shopfronts and the anchor front. A corner cell gains a pedestrian gate on the side street. Every business keeps a back door onto the alley for trash and deliveries (Paolo 7/18).',
    layering:'GROUND (drive): lot asphalt and the pads (1), the service alley (15), with the stall ticks (11). GROUND (walk): the setback (4), the storefront walks (6). STRUCTURE (solid, ENTERABLE): the anchor and the shop bays (2), their glass line (7), and the roof edge and rooftop plant (13), which sit ON the mass and are part of it. OVERHEAD (you pass UNDER): the shop awnings (8/9/10) and the fuel canopy (19). PROP: docks and pallets (16), fuel pumps (20), carts (18), dead trees (3). VEHICLE: the cars left in the stalls (17). PORTAL: the kerb cut (5) and every DOORWAY (14) — shop entries and steel back doors.',
    decisions:[
      'REBUILT 7/31 on Paolo\'s "make it look good" ruling. The old module was a flat L and a striped lot with no second building and no colour.',
      'IT IS NOW ACTUALLY REGISTERED. The old one never bound K — its registration hid behind `typeof K!==\'undefined\'` resolving against a global another module happened to leak, so the walked city has been drawing commercial from LEGACY PREFAB STAMPS with not one enterable building. Binding K used to turn walkable_gate red because the old single-street form was 61% pavement; this one is dense enough that the law is satisfied by the design rather than by not being registered.',
      'The old module\'s "[PENDING Paolo] its standalone / mid-block form" is CLOSED: this builds canonical-south and rotates, so it works on any single edge and on corners, which is what the district kit is for.',
      'No brand names, no signage text, no logos anywhere. The pylon board and the shop fascias are blank because the words on them are Paolo\'s (MECHANISM-MINE / CONTENTS-PAOLO\'S).',
      'ACT ONE ONLY (Paolo 7/28): looted, stripped, sun-bleached. No act-2/3 materials are specified.'
    ]
  };
  K.register('commercial', { generate:generate, body:function(c){return c===2||c===ROOF||c===DOOR||c===7;},
    category:'commercial', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,storeFootprints:storeFootprints,driveConnected:driveConnected,
    hasServiceAccess:hasServiceAccess,palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaCommercial=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
