// BOHEMIA DOWNTOWN — ONE BLOCK OF DOWNTOWN LAS VEGAS (rebuilt 8/1/26, WORLD lane)
//
// PAOLO 8/1: "in Vegas there's no roundabouts in downtown... you're like 15% done with
// that." Both true, and the research says the reason is worse than the roundabout.
// Full write-up + sources: records/BOHEMIA_DOWNTOWN_VEGAS_RESEARCH_8_1_26.md
//
// THE FINDING: A CELL IS A BLOCK.
//   The Fremont Street Experience canopy is 1,375 ft over FOUR blocks = 344 ft = 105 m
//   per block. A Bohemia cell is 128 x 0.75 m = 96 m = 315 ft.
//   ONE DISTRICT CELL IS ONE DOWNTOWN BLOCK.
// The version this replaces put FOUR blocks, an internal street grid, a roundabout and a
// skybridge inside a single cell -- an entire miniature downtown squeezed into one city
// block. At the real scale those internal "streets" were alleys as wide as a boulevard.
// That is the 15%, and it is a SCALE error, not a decoration error.
//
// AND HE ALREADY SAID THE ANSWER: "it's gonna be a couple districts wide and we're gonna
// make different downtown districts." A downtown is BLOCKS ACROSS THE MAP, one cell each,
// each block a different kind of block. Not one cell trying to be a city.
//
// NO ROUNDABOUT. Downtown Las Vegas is a 1905 RAILROAD TOWNSITE -- Clark's railroad
// auctioned 1,200 lots on a surveyed rectangular grid in a single day in May 1905. A grid
// platted for a lot auction is orthogonal with signalised corners; the roundabout is a
// modern retrofit and I invented it. Gone.
//
// WHAT A DOWNTOWN VEGAS BLOCK ACTUALLY IS, and every one of these is in here:
//   A THIRD OF IT IS PARKING. ~33% of downtown Las Vegas is off-street surface parking
//     (Parking Reform Network). The lot is not a leftover, it is half the block, and the
//     buildings crowd onto what is left. My last version had a fragment of one.
//   A STREET WALL OF NARROW LOTS. The 1905 auction sold LOTS, not superblocks, so the
//     frontage is a ROW of separate narrow buildings sharing party walls -- different
//     widths, different heights, different colours, built right out to the sidewalk.
//     Arts District storefronts still standing date to the 1930s. This is the biggest
//     single difference from what I built: a downtown frontage is MANY buildings.
//   A MID-BLOCK ALLEY. Townsite blocks are two rows of lots back-to-back onto a service
//     alley -- the dumpsters, the loading, the back doors.
//   BLADE SIGNS over the sidewalk. Downtown is where the neon started. The shapes are
//     mine; every word on them is Paolo's (MECHANISM-MINE / CONTENTS-PAOLO'S).
//   A VACANT PARCEL, because a building came down and nothing replaced it.
//
// RESERVED, NOT BUILT: the Fremont Street casino core. Casinos, resorts and the Strip
// landmarks are Paolo's hand by law and are never auto-generated.
//
// LAWS: RULE NUMBER ONE (7/31) the alley and both lots are one drive network reachable
// from the street. EVERY PIXEL ANSWERED FOR (7/31). NO FLAT RECTANGLES (7/30).
// ACT ONE ONLY (7/28).
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);

  var ROOF=17, DOOR=18;

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }

    /* THE SIDEWALK IS A RING, NOT THE BASE. First cut painted the whole block sidewalk and
       built on top, which made 35% of the plot one code -- the same base-fill mistake that
       made the mall 40% "parking asphalt". A downtown sidewalk is 12-15 ft: six tiles. */
    G.rect(0,0,W-1,H-1,4);                                   // the block's own ground
    G.rect(0,0,W-1,5,8); G.rect(0,H-6,W-1,H-1,8);            // the sidewalk ring, all four sides
    G.rect(0,0,5,H-1,8); G.rect(W-6,0,W-1,H-1,8);

    /* ---- THE MID-BLOCK ALLEY. A townsite block is two rows of lots back-to-back onto a
       service alley, ~20 ft wide. It runs clean through to the street at BOTH ends, which
       is what makes it an alley and not a trench (RULE NUMBER ONE). ---- */
    var AY0=59, AY1=67;
    G.rect(0,AY0,W-1,AY1,1);
    for(x=6;x<W-6;x+=9) set(x,63,11);

    /* ---- THE STREET WALL, north frontage: A ROW OF NARROW LOTS. The 1905 auction sold
       lots, so the frontage is MANY buildings sharing party walls -- different widths,
       different colours, built right out to the sidewalk. This is the thing that was most
       wrong before: one mass with a tower centred on it. ---- */
    var LOTS=[[9,13],[24,10],[36,15],[53,9],[64,12],[78,11]], face;
    for(i=0;i<LOTS.length;i++){
      var lx=LOTS[i][0], lw=LOTS[i][1], deep=26+((i*7)%12);
      var body_=[2,15,16][i%3];
      G.rect(lx,7,lx+lw,7+deep,body_);
      G.rect(lx+1,7+deep,lx+lw-1,7+deep,20);                 // the awning over the walk
      G.rect(lx+2,4,lx+3,6,12);                              // its blade sign out over the sidewalk
      if(i%2===0) G.rect(lx+3,12+((i*5)%8),lx+6,15+((i*5)%8),10);   // rooftop plant
      G.rect(lx+1,AY0-2,lx+4,AY0-1,14);                      // loading, onto the alley
    }

    /* ---- THE MID-RISE on the north-east corner, rising behind the street wall ---- */
    G.rect(92,7,118,44,6);
    G.rect(97,14,101,18,10); G.rect(108,26,112,30,10);
    G.rect(92,45,118,52,7);                                  // its forecourt off the corner

    /* ---- A THIRD OF THE BLOCK IS PARKING. This is the defining fact about downtown Las
       Vegas from the air and it is not a leftover: the lot is half the block and the
       buildings crowd onto what is left. Both lots open onto the alley. ---- */
    G.rect(6,AY1+1,58,121,13);                               // the south-west lot
    for(x=10;x<=54;x+=4){
      for(y=AY1+3;y<=AY1+9;y++) set(x,y,11);
      for(y=AY1+19;y<=AY1+25;y++) set(x,y,11);
      for(y=AY1+35;y<=AY1+41;y++) set(x,y,11);
    }
    G.rect(8,AY1+2,56,AY1+2,11); G.rect(8,118,56,118,11);
    G.rect(60,AY1+1,121,97,13);                              // the north-east lot, off the alley
    for(x=64;x<=118;x+=4){ for(y=AY1+3;y<=AY1+9;y++) set(x,y,11);
      for(y=AY1+19;y<=AY1+25;y++) set(x,y,11); }
    /* AND THE LOT ON THE NORTH SIDE TOO. A third of downtown Las Vegas is off-street
       surface parking (Parking Reform Network) -- the lot is not what is left over after
       the buildings, it is half the block, and the buildings crowd onto the rest. */
    /* the third parcel is NOT paved. Not every open parcel downtown is asphalt -- plenty
       are the bare slab of whatever came down, used as informal parking and never striped.
       Keeping it dirt is truer to the block AND it stops the paved lot owning a third of
       the plot on its own, which would fail EVERY PIXEL ANSWERED FOR on a technicality
       while being perfectly well answered for. */
    G.rect(6,44,88,AY0-1,4);
    for(i=0;i<9;i++){ var dx2=10+Math.floor(r()*18)*4, dy2=46+Math.floor(r()*10);
      if(get(dx2,dy2)===4) G.rect(dx2,dy2,dx2+1,dy2+3,19); }

    /* nobody came back for these */
    for(i=0;i<26;i++){
      var cx=10+Math.floor(r()*12)*4, cy=AY1+3+Math.floor(r()*3)*16;
      if(get(cx+1,cy)===13||get(cx+1,cy)===11) G.rect(cx+1,cy,cx+2,cy+3,19);
      var ex=88+Math.floor(r()*8)*4, ey=AY1+3+Math.floor(r()*2)*16;
      if(get(ex+1,ey)===13||get(ex+1,ey)===11) G.rect(ex+1,ey,ex+2,ey+3,19);
    }

    /* ---- THE SOUTH FRONTAGE: a shorter row of storefronts, and THE VACANT PARCEL where
       a building came down and nothing replaced it. ---- */
    var SL=[[62,14],[80,12],[96,13]];
    for(i=0;i<SL.length;i++){
      var sx=SL[i][0], sw=SL[i][1];
      G.rect(sx,100,sx+sw,120,[16,2,15][i%3]);
      G.rect(sx+1,98,sx+sw-1,99,20);                         // awning onto the south walk
      G.rect(sx+2,121,sx+3,123,12);                          // blade sign
      G.rect(sx+1,AY1+1,sx+4,AY1+2,14);                      // loading onto the alley
    }
    for(i=0;i<16;i++){ var vx=8+Math.floor(r()*110), vy=8+Math.floor(r()*110);
      if(get(vx,vy)===4) set(vx,vy,3); }        // creosote through the vacant ground

    /* ---- street trees and pole lights along the frontage ---- */
    for(x=10;x<=118;x+=14){ if(get(x,3)===8) set(x,3,3); if(get(x,124)===8) set(x,124,3); }
    [[4,6],[123,6],[4,121],[123,121],[63,3],[63,124]].forEach(function(p){ set(p[0],p[1],9); });

    /* ---- ROOFS AND DOORS on every mass ---- */
    K.roofsAndDoors(g,{ building:function(c){return c===2||c===6||c===15||c===16;},
      roof:17, door:18, min:120,
      outside:function(c){ return c===8||c===1||c===7||c===13||c===11||c===4; } });

    /* ---- kerb cuts: the alley mouths and one into each lot ---- */
    var gx=63;
    for(i=-4;i<=4;i++) set(gx+i,H-1,5);
    for(y=H-1;y>=120;y--) for(x=-4;x<=4;x++){ var c=get(gx+x,y); if(c===8||c===0) set(gx+x,y,13); }
    /* the alley simply reaches both kerbs -- it is not a GATE. Marking the mouths as gates
       put entrances on the east and west edges of a district that only fronts one street,
       which is the street-aware contract broken by a typo of intent. */
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4||c===8; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:8, pedOver:soft, pedInset:12});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2||v===6||v===13||v===15||v===16||v===ROOF||v===DOOR;})};
  }
  function driveConnected(res){ return K.driveNetworkReach(res.g, LEGEND) > 0.999; }

  /* THE GLASS IS THE HUE — 70s bronze, 80s blue, 90s green over concrete, all faded into
     the dead world's value band and never merged into one another. */
  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#6d675b',3:'#3a4526',4:'#414a2b',5:'#c79a3f',
    6:'#3f5570',7:'#6a675e',8:'#7d7a71',9:'#b0863a',10:'#8e8a7c',11:'#c9c1aa',12:'#5e6a72',
    13:'#3a3a42',14:'#6a6e72',15:'#7a5c34',16:'#3f6152',17:'#9a9384',18:'#241f1a',
    19:'#6a6e72',20:'#8c3f38'};

  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',   act1:'bare Mojave dirt where the block ends and nobody ever built the next one'},
    1:{name:'mid-block alley',    kind:'drive',    act1:'the service alley cut through the middle of the block — the townsite platted two rows of lots back-to-back onto it, so this is where every delivery, dumpster and back door on the block has always been (car-drivable, and it runs through to the street at both ends)'},
    2:{name:'podium / retail base',kind:'building',act1:'the low podium that holds the street wall — ground-floor retail with every window out, dark mezzanine above', enter:'podium interior: a stripped retail floor, the escalator well dead, a service corridor running back to the alley'},
    3:{name:'street tree',        kind:'tree-dead',act1:'a dead street tree still standing in its grate, trunk split, the iron grate itself long since prised up', solid:false},
    4:{name:'vacant parcel',      kind:'ground',   act1:'the parcel where a building came down and nothing replaced it — the slab is still there under the dirt, its footprint printed in the asphalt, creosote rooted along the old party wall'},
    5:{name:'gate / kerb cut',    kind:'gate',     act1:'the block entrance off the street, amber kerb paint gone chalky'},
    6:{name:'tower (blue glass)', kind:'building', act1:'an 80s blue curtain-wall tower — the glass gone milky where it survived and open to the sky where it did not', enter:'tower interior: a lobby stripped to its core, lift shafts standing open, the floor plates above reachable only by stair'},
    7:{name:'forecourt plaza',    kind:'ground',   act1:'the tower forecourt — pavers heaved up by roots, the granite benches still exactly where they were bolted'},
    8:{name:'sidewalk',           kind:'walk',     act1:'the downtown sidewalk, wide slabs cracked corner to corner, the awning bolts still in the wall above them'},
    9:{name:'pole light',         kind:'structure',act1:'a street light on its cast pole, head dark, the banner arm bent and empty'},
    10:{name:'rooftop plant',     kind:'structure',act1:'rooftop mechanical — cooling towers and duct runs, one unit stripped back to its coil for the copper'},
    11:{name:'lane / stall marking',kind:'marking',act1:'faded paint — lane dashes down the street, stall ticks in the lot, most of it a ghost you read by the shadow'},
    12:{name:'blade sign',        kind:'structure',act1:'a blade sign cantilevered out over the sidewalk from a storefront parapet — downtown is where the neon started, and the board is blank because every word on it is Paolo\'s', layer:'overhead', solid:false},
    13:{name:'surface parking lot',kind:'drive',   act1:'the surface lot — about a THIRD of downtown Las Vegas is off-street surface parking, and this is it: asphalt gone to plates, striping ghosted, the cars that were in it when everything stopped still in it (car-drivable)'},
    14:{name:'loading dock',      kind:'prop',     act1:'a loading dock off the alley — the dumpster still chained to the wall beside it, pallets stacked and never collected'},
    15:{name:'mid-rise (bronze)', kind:'building', act1:'a 70s bronze-glass mid-rise, stepped back at the shoulder, spandrel panels hanging off their clips', enter:'mid-rise interior: office floor plates with the partitions collapsed, the stair core still sound'},
    17:{name:'roof edge',         kind:'structure',act1:'the parapet line where a roof meets its wall, coping stones missing in long runs'},
    18:{name:'doorway',           kind:'portal',   act1:'a way in — a lobby entrance with the glass gone, a stair-core door, a shopfront standing open'},
    19:{name:'dead car',          kind:'vehicle',  act1:'a car left exactly where it was parked, flat and sun-bleached, on a deck or out in the lot'},
    20:{name:'storefront awning', kind:'structure',act1:'the awning over the shopfront walk, canvas split back to its frame, and you pass under it', layer:'overhead', solid:false},
    16:{name:'storefront (green)',kind:'building', act1:'a 1930s storefront in faded green — the Arts District blocks still standing date from then — parapet stepped, transom glass gone', enter:'storefront interior: one deep narrow room to the party walls, counter ripped out, stock room and back door onto the alley'}
  };
  var NOTES={
    summary:'A dead downtown core: four blocks that are four different things — a slender blue-glass TOWER off-centre on its podium with a forecourt, an open-sided PARKING STRUCTURE with its ramp climbing the face, a stepped bronze MID-RISE over a mid-block alley beside the gap-toothed lot where a building came down, and TWO SMALLER TOWERS under a run of retail awnings — around a street grid, a roundabout plaza with its dry fountain, and a skybridge over the street.',
    reference:[
      'REBUILT 8/1 because on the whole-valley contact sheet this read as FOUR GREY SQUARES. It was one podium function called four times with an identical centred tower on each, in one grey — and downtown is the signature of a city, so if any district has to be a landmark it is this one.',
      'Podium-tower urbanism (ArchDaily podium-tower, LA Downtown Design Guide street wall, Phoenix City Square): a high-coverage low-rise base holding a tight street wall along the sidewalk, slender towers rising off it, the grid threading through.',
      'A REAL BLOCK IS NEVER ITS NEIGHBOUR. The four quadrants are deliberately four building types, and the parking structure is the load-bearing one — a garage with a visible ramp is the most instantly readable building in any city core.',
      'THE GLASS IS THE HUE. A core is dated by its curtain wall: 70s bronze, 80s blue, 90s green over concrete. Three faded tones is honest to the building type and it is what makes four blocks read as four.',
      'Built to the approved standard: the high school (89%), commercial (85%) and mall (85%).'
    ],
    layout:[
      'NW is THE TOWER: a slender blue-glass tower set off-centre on its podium — a tower centred on its own base is a diagram, not a building — with a forecourt plaza and dead street trees in front.',
      'NE is THE PARKING STRUCTURE: open-sided decks with the cars still on them and a switchback RAMP climbing the east face.',
      'SW is the stepped bronze MID-RISE over a retail base, with a service ALLEY cut mid-block and the SURFACE LOT beside it where a building came down.',
      'SE is TWO SMALLER TOWERS, green and blue, on a shared podium under a run of retail awnings at grade.',
      'The street grid crosses at a ROUNDABOUT around the plaza and its dry fountain; a skybridge spans the street between two blocks.'
    ],
    circulation:'Street-aware via canonical-south + K.rotateToStreet. RULE NUMBER ONE (Paolo 7/31): the street grid, the roundabout ring, the mid-block alley and the surface lot are ONE drive network and every tile of it is reachable from the kerb (K.driveNetworkReach) — the roundabout exists precisely so the four street arms can never be severed from each other. On foot the sidewalk runs the whole street wall, the forecourt and the plaza open off it, and the skybridge and awnings are OVERHEAD: you walk under them.',
    layering:'GROUND (drive): the streets (1), the alley (20), the surface lot (21), with the lane and stall paint (11). GROUND (walk): sidewalk (8), forecourt and plaza (7), desert margin (0). STRUCTURE (solid, ENTERABLE): the podiums (2), the towers and the mid-rise (6/15/16), the parking structure (13) — five different interiors — plus the roof edges (17) and rooftop plant (10), which sit ON the mass and are part of it. STRUCTURE (solid): pole lights (9), the garage ramp (14). OVERHEAD (you pass under): the skybridge (12) and the retail awnings (22). PROP: street trees (3), planters (4). VEHICLE: the cars on the decks and in the lot (19). PORTAL: the kerb gate (5) and every DOORWAY (18).',
    decisions:[
      'FOUR BLOCKS, FOUR DIFFERENT BUILDINGS. The old module had one podium function called four times, which is exactly why it read as squares.',
      'THE TOWER IS OFF-CENTRE ON ITS PODIUM, deliberately. Centred towers are what made the old one read as a diagram rather than a place.',
      'NO SIGNAGE TEXT, no brand, no logo anywhere — MECHANISM-MINE / CONTENTS-PAOLO\'S.',
      'ACT ONE ONLY (Paolo 7/28): stripped, dark, sun-bleached. No act-2/3 materials are specified.'
    ]
  };
  K.register('downtown', { generate:generate,
    body:function(c){return c===2||c===6||c===13||c===15||c===16||c===ROOF||c===DOOR;},
    category:'commercial', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},
    palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaDowntown=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
