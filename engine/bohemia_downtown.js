// BOHEMIA DOWNTOWN — THE DEAD CORE (rebuilt 8/1/26, WORLD lane)
//
// WHY IT WENT BACK. On the whole-valley contact sheet this district read as FOUR GREY
// SQUARES with a roundabout in the middle, and that is exactly what it was: one podium
// function called four times, each with an identical tower centred on it, in one grey.
// Downtown is the signature of a city — if any district has to be a landmark it is this
// one — and it was the most anonymous thing in the set.
//
// THE FIX IS THE ONE THAT GOT THE OTHER THREE APPROVED, and it is not decoration:
// FOUR BLOCKS THAT ARE FOUR DIFFERENT THINGS. A real downtown block is never its neighbour.
//   NW  THE TOWER, slender, set OFF-CENTRE on its podium with a forecourt in front of it,
//       because a tower centred on its own base is a diagram, not a building.
//   NE  THE PARKING STRUCTURE. Open-sided decks with a switchback RAMP climbing the face.
//       A garage is the most instantly readable building in any city core and this
//       district did not have one.
//   SW  THE STEPPED MID-RISE over a retail base, with a mid-block ALLEY and the
//       gap-toothed SURFACE LOT where a building came down and nothing replaced it.
//   SE  TWO SMALLER TOWERS on a shared podium under a run of retail awnings at grade.
//
// HUE. The palette was one grey-brown, which is the 7/28 finding across the whole valley.
// A real core is dated by its curtain wall — 70s bronze, 80s blue, 90s green, over
// concrete. Three faded glass tones is honest to the building type AND it is the thing
// that makes four blocks read as four instead of as one grey field.
//
// THE LAWS THIS IS BUILT TO, all of them his:
//   RULE NUMBER ONE (7/31) — every drivable tile reachable from the street. The grid, the
//     roundabout, the alley and the surface lot are ONE network.
//   EVERY PIXEL ANSWERED FOR (7/31) — no code owns 30% of the plot, every code written.
//   NO BUILDING IS A FLAT RECTANGLE (7/30) — roofs and doors from K.roofsAndDoors.
//   EVERY DISTRICT IS ITS OWN LANDMARK (7/28) — the tower cluster over a street wall.
//   ACT ONE ONLY (7/28). MECHANISM-MINE / CONTENTS-PAOLO'S: no signage text anywhere.
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);

  var ROOF=17, DOOR=18;

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }

    G.rect(0,0,W-1,H-1,0);
    G.rect(4,6,W-5,H-5,8);                                   // the sidewalk street wall

    /* ---- THE GRID: the street cross, its lane dashes, and (below) the roundabout ring
       that keeps all four arms connected to each other — RULE NUMBER ONE. ---- */
    G.rect(58,6,68,H-5,1); G.rect(4,58,W-5,68,1);
    for(y=8;y<H-8;y+=6) set(63,y,11);
    for(x=8;x<W-8;x+=6) set(x,63,11);

    /* ---- NW: THE TOWER, off-centre on its podium, with a forecourt ---- */
    G.rect(8,10,54,54,2);
    G.rect(14,16,38,44,6);
    G.rect(18,22,22,26,10); G.rect(30,34,34,38,10);
    G.rect(42,18,52,50,7);                                   // the forecourt
    for(i=0;i<4;i++) set(47,22+i*9,3);

    /* ---- NE: THE PARKING STRUCTURE, decks and a ramp you can read from the air ---- */
    G.rect(72,10,120,54,13);
    for(y=14;y<=50;y+=6) G.rect(74,y,118,y+1,14);            // the open deck edges
    G.rect(104,12,118,52,14);                                // THE RAMP up the east face
    for(i=0;i<6;i++) G.rect(106,15+i*6,116,17+i*6,13);       // its switchbacks
    for(i=0;i<16;i++){                                       // cars still on the decks
      var px=76+Math.floor(r()*13)*2, py=16+Math.floor(r()*6)*6;
      if(get(px,py)===13) G.rect(px,py,px+1,py+2,19);
    }

    /* ---- SW: THE STEPPED MID-RISE, a mid-block ALLEY, the gap-toothed lot ---- */
    G.rect(8,72,54,116,2);
    G.rect(12,78,40,102,15);
    G.rect(16,84,20,88,10); G.rect(30,92,34,96,10);
    /* THE ALLEY RUNS THROUGH TO THE STREET and the lot opens onto the alley. First cut had
       both of them floating clear of the grid -- 82.9% reachable, RULE NUMBER ONE broken on
       the very next district after he made it a law. An alley that does not reach a street
       is a trench, and a lot you cannot drive into is a picture of a lot. */
    G.rect(8,106,58,110,20);                                 // THE ALLEY, through to the street
    G.rect(42,72,54,106,21);                                 // the lot, opening onto the alley
    for(x=44;x<=52;x+=4) for(y=76;y<=100;y++) set(x,y,11);
    for(i=0;i<5;i++){ var lx=45+Math.floor(r()*3)*4, ly=78+Math.floor(r()*20);
      if(get(lx,ly)===21||get(lx,ly)===11) G.rect(lx,ly,lx+1,ly+3,19); }

    /* ---- SE: TWO SMALLER TOWERS on a shared podium, retail awnings at grade ---- */
    G.rect(72,72,120,116,2);
    G.rect(78,78,96,98,16);                                  // green glass
    G.rect(102,80,116,104,6);                                // blue glass
    G.rect(82,84,86,88,10); G.rect(106,86,110,90,10);
    G.rect(74,110,118,113,22);                               // the awning run

    /* ---- THE PLAZA at the crossing, inside the roundabout ---- */
    G.disc(63,63,9,7);
    for(i=0;i<8;i++){ var a=i/8*Math.PI*2;
      set(Math.round(63+Math.cos(a)*6),Math.round(63+Math.sin(a)*6),3); }
    set(63,63,10); set(62,62,10); set(64,64,10);             // the dry fountain
    for(var a2=0;a2<360;a2+=1){ var rr=a2*Math.PI/180;
      set(Math.round(63+Math.cos(rr)*11),Math.round(63+Math.sin(rr)*11),1);
      set(Math.round(63+Math.cos(rr)*12),Math.round(63+Math.sin(rr)*12),1); }

    /* ---- the street wall: planters, trees, lights, the skybridge ---- */
    for(x=10;x<=118;x+=12){ if(get(x,56)===8)set(x,56,4); if(get(x,70)===8)set(x,70,4); }
    for(y=10;y<=118;y+=12){ if(get(56,y)===8)set(56,y,3); if(get(70,y)===8)set(70,y,3); }
    G.rect(54,30,72,32,12);                                  // the skybridge
    [[6,8],[120,8],[6,120],[120,120],[63,44]].forEach(function(p){ set(p[0],p[1],9); });

    /* ---- ROOFS AND DOORS on every mass, from the shared machine ---- */
    K.roofsAndDoors(g,{ building:function(c){return c===2||c===6||c===13||c===15||c===16;},
      roof:ROOF, door:DOOR, min:120,
      outside:function(c){ return c===8||c===1||c===7||c===20||c===21||c===11||c===4; } });

    /* ---- the entrance off the south street ---- */
    var gx=63;
    for(i=-4;i<=4;i++) set(gx+i,H-1,5);
    for(y=H-1;y>=H-9;y--) for(x=-4;x<=4;x++){ var c=get(gx+x,y); if(c===0||c===8||c===11) set(gx+x,y,1); }
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
    13:'#5c5b57',14:'#7e7d76',15:'#7a5c34',16:'#3f6152',17:'#9a9384',18:'#241f1a',
    19:'#6a6e72',20:'#2b2b31',21:'#3a3a42',22:'#8c3f38'};

  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',   act1:'bare Mojave dirt where the block ends and nobody ever built the next one'},
    1:{name:'street',             kind:'drive',    act1:'the downtown street grid — asphalt plated and lifting, lane paint ghosted, sand banked into the gutters (car-drivable)'},
    2:{name:'podium / retail base',kind:'building',act1:'the low podium that holds the street wall — ground-floor retail with every window out, dark mezzanine above', enter:'podium interior: a stripped retail floor, the escalator well dead, a service corridor running back to the alley'},
    3:{name:'street tree',        kind:'tree-dead',act1:'a dead street tree still standing in its grate, trunk split, the iron grate itself long since prised up', solid:false},
    4:{name:'setback planter',    kind:'prop',     act1:'a concrete street planter, its shrub down to a stick, filled to the rim with blown sand and glass', solid:false},
    5:{name:'gate / kerb cut',    kind:'gate',     act1:'the block entrance off the street, amber kerb paint gone chalky'},
    6:{name:'tower (blue glass)', kind:'building', act1:'an 80s blue curtain-wall tower — the glass gone milky where it survived and open to the sky where it did not', enter:'tower interior: a lobby stripped to its core, lift shafts standing open, the floor plates above reachable only by stair'},
    7:{name:'forecourt plaza',    kind:'ground',   act1:'the tower forecourt — pavers heaved up by roots, the granite benches still exactly where they were bolted'},
    8:{name:'sidewalk',           kind:'walk',     act1:'the downtown sidewalk, wide slabs cracked corner to corner, the awning bolts still in the wall above them'},
    9:{name:'pole light',         kind:'structure',act1:'a street light on its cast pole, head dark, the banner arm bent and empty'},
    10:{name:'rooftop plant',     kind:'structure',act1:'rooftop mechanical — cooling towers and duct runs, one unit stripped back to its coil for the copper'},
    11:{name:'lane / stall marking',kind:'marking',act1:'faded paint — lane dashes down the street, stall ticks in the lot, most of it a ghost you read by the shadow'},
    12:{name:'skybridge',         kind:'structure',act1:'the skybridge spanning the street between two blocks, its glazing gone, and you walk under it', layer:'overhead', solid:false},
    13:{name:'parking deck',      kind:'building', act1:'the open-sided parking structure, deck slabs stacked with the cars still parked on them', enter:'garage interior: split-level decks joined by the ramp, the pay booth prised open'},
    14:{name:'garage ramp',       kind:'structure',act1:'the switchback ramp climbing the face of the structure — the one thing that makes a garage read as a garage from the air'},
    15:{name:'mid-rise (bronze)', kind:'building', act1:'a 70s bronze-glass mid-rise, stepped back at the shoulder, spandrel panels hanging off their clips', enter:'mid-rise interior: office floor plates with the partitions collapsed, the stair core still sound'},
    16:{name:'tower (green glass)',kind:'building',act1:'a 90s green-glass tower, the tint still reading under the dust on the panes that held', enter:'tower interior: open floor plates around a dead lift core'},
    17:{name:'roof edge',         kind:'structure',act1:'the parapet line where a roof meets its wall, coping stones missing in long runs'},
    18:{name:'doorway',           kind:'portal',   act1:'a way in — a lobby entrance with the glass gone, a stair-core door, a shopfront standing open'},
    19:{name:'dead car',          kind:'vehicle',  act1:'a car left exactly where it was parked, flat and sun-bleached, on a deck or out in the lot'},
    20:{name:'service alley',     kind:'drive',    act1:'the mid-block alley — dumpsters, fire escapes overhead, and the back doors every one of these buildings has (car-drivable)'},
    21:{name:'surface lot',       kind:'drive',    act1:'the gap-toothed lot where a building came down and nothing replaced it, its foundation still printed in the asphalt (car-drivable)'},
    22:{name:'retail awning',     kind:'structure',act1:'the run of shopfront awnings at grade, canvas split back to the frame, and you walk under them', layer:'overhead', solid:false}
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
