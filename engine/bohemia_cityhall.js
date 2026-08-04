// BOHEMIA CITY HALL (7/23/26; REBUILT 8/2/26). CIVIC, on the DISTRICT KIT.
//
// THE REBUILD, and why. The old district was generic US-civic-centre precedent: a wide low
// block with a CLOCK TOWER, a dead green LAWN over 28% of the plot, and a small lot. Two
// things were wrong with it. A clock tower is a New England town hall, not a Mojave one.
// And the lawn was GREEN (#49512e) on a plot in a valley where nothing is watering
// anything -- the exact thing Paolo caught in downtown ("are you putting grass in
// downtown?").
//
// SO IT IS BUILT ON THE ONE THIS VALLEY ACTUALLY HAS: LAS VEGAS CITY HALL (Elkus Manfredi
// Architects, 2012, 495 S Main St), and what makes it recognisable from the air is not a
// tower, it is THE SOLAR TREE FARM: 33 tubular columns, 25 to 35 feet tall, each carrying a
// photovoltaic panel, standing in a grid across the public plaza. Exactly 33, and this
// district draws exactly 33. Behind them the building is TWO SHAPES that merge in the
// lobby -- the CURVILINEAR council chamber and the ANGULAR seven-storey glass office block
// -- and over the main entrance a dynamic CANOPY carried on a single 160-foot column. That
// canopy is NOT DRAWN (Paolo 8/2, no more canopies): the entrance is a broad flight of STEPS
// and a row of entry PIERS, and the solar trees stand in their own bed instead of over the
// plaza. The reference keeps the record of the real building; the plot draws the ruling.
//
// ONE BUILDING (8/2 law): chamber, office block and north wing all share walls. The solar
// trees are plaza furniture, not buildings.
//
// Act-1 DEAD: the panels are milky and half of them are gone for the copper in the leads,
// the fountain basin is dry, the curtain wall is boarded in runs. Street-aware + drivable:
// one kerb cut feeds the surface lot and the ramp up into the attached parking deck.
// LEGEND:
//  0 desert dead-ground   1 drive / lot / deck (DRIVABLE)   2 city hall (the ONE building)
//  3 dead tree            4 forecourt hardpan               5 gate / kerb cut
//  6 solar panel           7 civic plaza                  8 dry fountain basin
//  9 plaza light         10 solar tree mast                11 curtain wall glazing
//  12 flagpole           13 walk / podium / seating step   14 plaza planter
//  15 entry pier         16 roof edge                      17 council chamber roof
//  18 doorway (PORTAL)   19 dead car                       20 deck column
//  21 stall marking (PAINT)  22 deck edge   23 roof joint   24 deck floor   25 rooftop plant
//  26 bike rack          27 inverter cabinet
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  var SOLAR_TREES = 33;   // Elkus Manfredi's count, and the gate checks it

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }

    G.rect(0,0,W-1,H-1,0);
    G.rect(3,3,W-4,H-4,4);                                   // decomposed granite, NOT lawn
    G.rect(6,6,122,74,13);                                   // the podium the building stands on

    /* ---- ONE BUILDING: the ANGULAR office block + the CURVILINEAR council chamber, which
       merge, exactly as they do in the lobby of the real one. ---- */
    G.rect(14,12,100,46,2);                                  // the seven-storey office block
    G.rect(100,20,114,46,2);                                 // its stepped east wing
    G.rect(22,4,90,12,2);                                    // the stepped-back north wing
    G.disc(58,54,15,2);                                      // THE COUNCIL CHAMBER, curved, landing on the block
    G.rect(44,42,72,54,2);                                   // and merged into it

    /* the chamber's own roof, so the curve reads as a separate VOLUME of one building */
    G.disc(58,54,11,17); G.disc(58,54,4,11);

    /* THE ROOF IS NOT A FLAT PLATE. Precast joint lines across it, the plant rows, and the
       skylight run over the office floors -- a mass this size reading as one colour is the
       7/30 flat-rectangle failure at building scale. */
    for(x=20;x<=110;x+=9) G.rect(x,14,x,44,23);
    for(y=20;y<=40;y+=8) G.rect(16,y,112,y,23);
    for(x=24;x<=96;x+=16) G.rect(x,16,x+7,21,25);
    for(x=22;x<=94;x+=6) G.rect(x,34,x+3,40,11);

    /* the curtain wall: the block's south face is glass, boarded in runs */
    for(x=18;x<=96;x+=4) G.rect(x,44,x+2,46,11);
    for(y=24;y<=42;y+=5) G.rect(112,y,114,y+2,11);
    for(x=26;x<=86;x+=6) G.rect(x,4,x+3,6,11);

    /* ---- THE CIVIC PLAZA ---- */
    G.rect(8,76,120,110,7);
    G.disc(20,82,6,8); G.disc(20,82,3,7);                      // the dry reflecting basin
    G.disc(104,94,7,8); G.disc(104,94,3,7);                  // its twin on the east
    set(44,66,12); set(84,66,12); set(64,62,12);             // the flag row above the steps

    /* ---- NO CANOPY (Paolo 8/2: "new rule no more canopies I only see canopies at parks
       and shit"). What stood here was a shade plane on a single mast. It is gone, and what
       replaces it is what a civic entrance actually has when it is not hiding under
       something: a WIDE FLIGHT OF STEPS up onto the podium, a row of ENTRY PIERS marking
       the doors, and the doors themselves. Nothing overhead anywhere on this plot. ---- */
    G.rect(40,68,88,76,13);                                  // the entrance steps off the plaza
    G.rect(56,64,72,70,18);                                  // the main doors, straight onto the steps
    /* THE PIERS STAND AT THE FOOT OF THE STEPS, ON THE PLAZA -- not up on the podium.
       That is where a civic entrance colonnade actually is, and it also keeps mass off
       the walk surface (SIDEWALK SANCTITY / the d1_kerb ratchet: a structure written over
       a walk cell is the thing that law counts, and there is no reason to spend any). */
    for(x=42;x<=86;x+=6) G.rect(x,78,x+2,82,15);             // the entry piers

    for(x=66;x<=118;x+=10) set(x,108,9);                     // the plaza light line, east of the array bed

    /* ---- THE PLAZA IS DRESSED. An empty plaza is a void with a nice name, and this one
       was 11% of the plot in bare pavers with two basins on it. A civic forecourt people
       queued in has PLANTERS with the trees still standing in them and a BIKE RACK row.
       Taking the canopy out is not a licence to leave a hole where it stood.
       NOTE THE BAND IT SITS IN: y 86..104, clear of the entry piers at y 78..82, so
       nothing here overwrites anything there. ---- */
    for(x=68;x<=112;x+=11) for(y=86;y<=100;y+=8){
      G.rect(x,y,x+6,y+4,14);                                // limestone planter
      G.rect(x+1,y+1,x+5,y+3,4);                             // its bed, gone to hardpan
      set(x+2,y+2,3); set(x+4,y+2,3);                        // and the dead trees still in it
    }
    for(x=94;x<=118;x+=4) G.rect(x,78,x+1,83,26);            // the bike racks, east of the piers, ON THE PLAZA

    /* ---- THE SOLAR ARRAY: 33 masts, each carrying its panel. Still the thing this
       building is recognised by, and still exactly 33 -- but it stands in its OWN BED at
       the edge of the plot instead of hanging over the plaza people walk across.
       Paolo 8/2: "new rule no more canopies I only see canopies at parks and shit."
       A solar tree you stand under is a canopy whatever the legend calls it, so the array
       is EQUIPMENT now: panels on masts in a gravel bed, nothing overhead anywhere. ---- */
    G.rect(6,84,62,112,4);                                   // the array bed, decomposed granite
    /* A REAL ARRAY IS NOT PANELS IN A FIELD. It has SERVICE AISLES you walk down to get at
       a row, and an INVERTER CABINET at the head of each one -- the string DC comes down the
       mast and has to turn into AC somewhere. Both are why the bed is a piece of plant and
       not decorative gravel.
       THE AISLES GO DOWN FIRST, then the panels stand between them. Drawn the other way
       round the aisles wiped out every mast and the 33 stopped being 33 -- order is the
       whole thing when one pass paints over another. */
    for(y=86;y<=110;y+=6) G.rect(8,y,60,y,13);               // the service aisles between the rows
    for(y=88;y<=104;y+=6) G.rect(60,y,63,y+3,27);            // the inverter cabinets at the row heads
    var trees=0;
    for(y=88;y<=108&&trees<SOLAR_TREES;y+=6) for(x=10;x<=58&&trees<SOLAR_TREES;x+=6){
      G.rect(x,y,x+3,y+3,6); set(x+1,y+4,10); trees++;
    }

    /* ---- THE PARKING DECK, attached, east. Columns on a grid under a roof edge, and the
       aisle inside it IS drive surface -- a deck you can get a car into. ---- */
    G.rect(100,50,122,74,24);
    G.rect(100,50,122,51,22); G.rect(100,73,122,74,22);
    for(y=55;y<=69;y+=5) for(x=103;x<=119;x+=5) G.rect(x,y,x+1,y+1,20);
    for(y=57;y<=67;y+=5) G.rect(102,y,120,y,21);            // its stall ticks
    G.rect(104,72,118,78,24);                                 // the ramp down THROUGH the deck rail to the lot

    /* ---- THE SURFACE LOT ---- */
    G.rect(6,112,122,122,1);
    for(x=10;x<=118;x+=4) for(y=114;y<=120;y++) set(x,y,21);
    G.rect(104,78,118,112,1);                                // the east aisle joining deck to lot
    for(i=0;i<10;i++){ var cx=10+Math.floor(r()*26)*4, cy=114+Math.floor(r()*2);
      if(get(cx+1,cy)===1||get(cx+1,cy)===21) G.rect(cx+1,cy,cx+2,cy+3,19); }

    /* dead street trees wherever the hardpan is open */
    for(i=0;i<26;i++){ var tx=4+Math.floor(r()*120), ty=4+Math.floor(r()*120);
      if(get(tx,ty)===4) set(tx,ty,3); }

    K.roofsAndDoors(g,{ building:function(c){return c===2;}, roof:16, door:18, min:150,
      outside:function(c){ return c===13||c===7||c===4||c===1||c===21; } });

    var gx=64;
    for(i=-5;i<=5;i++) set(gx+i,H-1,5);
    for(y=H-1;y>=122;y--) for(x=-5;x<=5;x++){ var c=get(gx+x,y); if(c===0||c===4||c===13) set(gx+x,y,1); }
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4||c===13; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:13, pedOver:soft, pedInset:12});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      /* the glazing, the chamber roof, the roof edge and the doorways ARE the building --
         they are holes in it, never gaps between two of them (ONE BUILDING, 8/2). */
      footprints:K.footprints(g,function(v){return v===2||v===11||v===16||v===17||v===18||v===23||v===25;}),
      solarTrees:(function(){ var n=0; for(var yy=0;yy<g.length;yy++) for(var xx=0;xx<g[0].length;xx++) if(g[yy][xx]===10) n++; return n; })()};
  }
  function driveConnected(res){ return K.driveNetworkReach(res.g, LEGEND) > 0.999; }

  /* THE DESERT PALETTE. Glass and sand-coloured precast, and NOTHING GREEN: this valley
     stopped watering things a long time before act one opens. */
  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#7d7566',3:'#514f40',4:'#6b6250',5:'#c79a3f',
    6:'#3f4a55',7:'#8b8478',8:'#5a6660',9:'#b0863a',10:'#6e6a60',11:'#8fa2ad',12:'#8a7f5e',
    13:'#7d7a71',15:'#a89c86',16:'#b3a78d',17:'#a3947a',18:'#241f1a',
    19:'#6a6e72',20:'#77726a',21:'#4a4a52',22:'#8b8272',23:'#635c4f',24:'#4c4a48',25:'#6e6a60',
    14:'#a79a7f',26:'#5c5952',27:'#55524a'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',   act1:'bare Mojave dirt at the property line, sun-cracked, drift sand banked against the kerb'},
    1:{name:'drive / lot / deck', kind:'drive',    act1:'the visitor lot, the aisle and the deck floor above it — asphalt gone to plates, weeds up every joint (car-drivable)'},
    2:{name:'city hall',          kind:'building', act1:'sand-coloured precast and glass — the angular office block and the curved council chamber that merge in the lobby, the curtain wall boarded in runs where it came down', enter:'city hall interior: the public counter and permits hall behind the doors, the round council chamber under its own roof, seven floors of department offices in the block'},
    3:{name:'dead tree',          kind:'tree-dead',act1:'a dead civic tree gone to stick, its grate prised up for the metal', solid:false},
    4:{name:'forecourt hardpan',  kind:'ground',   act1:'decomposed granite that was raked once, now hardpan split by weeds. Not a lawn: nothing is watering this'},
    5:{name:'gate / kerb cut',    kind:'gate',     act1:'the kerb cut off the street into the lot, amber paint gone chalky'},
    6:{name:'solar panel',        kind:'structure',act1:'a photovoltaic panel on its tree, tilted to the south — the glass milky, half the array stripped for the copper in the leads. Equipment in its own bed, not something you shelter under', solid:true},
    7:{name:'civic plaza',        kind:'ground',   act1:'the public plaza in front of the entrance steps, big pavers heaved by roots, the meeting-day chalk long gone, no shade on it anywhere'},
    8:{name:'dry fountain basin', kind:'water-dead',act1:'a reflecting basin bone dry, the old waterline stained around it like a tidemark'},
    9:{name:'plaza light',        kind:'structure',act1:'a plaza light on its concrete stem, head dark, the glass long gone'},
    10:{name:'solar tree mast',   kind:'structure',act1:'the tubular column of a solar tree, thirty feet of steel, powder coat blistered off the sunward side'},
    11:{name:'curtain wall glazing',kind:'structure',act1:'the glass curtain wall — the panels that are left are sun-hazed, the rest is board and sky'},
    12:{name:'flagpole',          kind:'prop',     act1:'a flagpole beside the doors, halyard slapping in the wind, nothing left on it'},
    13:{name:'walk / podium',     kind:'walk',     act1:'the raised concrete podium the building stands on and the walks across it, cracked corner to corner'},
    14:{name:'plaza planter',    kind:'structure',act1:'a low limestone planter across the plaza, bed gone to hardpan with a dead tree still standing in it, coping cracked along the edge people sat on', solid:true},
    26:{name:'bike rack',        kind:'structure',act1:'a staple rack by the doors, two of the hoops cut through with a grinder and whatever was locked to them long gone', solid:true},
    27:{name:'inverter cabinet', kind:'structure',act1:'a string inverter at the head of a panel row, door hanging, the copper busbars inside cut out clean', solid:true},
    15:{name:'entry pier',        kind:'structure',act1:'one of the squat piers marking the main entrance, concrete, a corner knocked off the sunward one'},
    16:{name:'roof edge',         kind:'structure',act1:'the parapet line where a roof meets its wall, coping missing in runs'},
    17:{name:'council chamber roof',kind:'structure',act1:'the round roof over the council chamber, its ring of clerestory glazing gone'},
    18:{name:'doorway',           kind:'portal',   act1:'a way in — the main doors at the top of the entrance steps, the deck stair, the loading door on the north wing'},
    19:{name:'dead car',          kind:'vehicle',  act1:'a car left in the lot, flat and sun-bleached, nobody came back for it'},
    20:{name:'deck column',       kind:'structure',act1:'a concrete column holding the parking deck up, corner spalled to the rebar'},
    25:{name:'rooftop plant',     kind:'structure',act1:'a mechanical unit on the office roof, ducting collapsed, one of them stripped for its copper', solid:true},
    23:{name:'roof joint',        kind:'structure',act1:'the joint line between two roof plates, sealant gone chalky and lifted out in runs', solid:true},
    24:{name:'deck floor',        kind:'drive',    act1:'the covered floor of the parking deck — lighter than the open lot because the sun never got at it, oil ghosts still in every stall (car-drivable)'},
    22:{name:'deck edge',         kind:'structure',act1:'the spandrel rail round the parking deck, a bay of it folded outward where something went through', solid:true},
    21:{name:'stall marking',     kind:'marking',  act1:'the painted stall ticks across the lot, chalked out to ghosts by twenty summers — PAINT IS NOT A WALL, a car drives straight over it'}
  };
  var NOTES={
    summary:'A dead city hall — ONE building of two merged shapes, the ANGULAR seven-storey glass office block and the CURVILINEAR council chamber, standing on a podium above a wide flight of ENTRANCE STEPS and a row of entry piers, with 33 SOLAR PANELS on masts standing in their own gravel bed at the plot edge, a public plaza in front, and an attached parking deck to the east. The executive seat, distinct from the judicial courthouse.',
    reference:['LAS VEGAS CITY HALL (Elkus Manfredi Architects, 2012, 495 S Main St). Two distinctive shapes — the curvilinear Council Chamber and the angular seven-storey glass office structure — that MERGE inside the lobby; a dynamic canopy over the plaza entrance carried on a single 160-foot column; and in the plaza a solar "tree farm" of 33 tubular columns 25 to 35 feet tall mounted with photovoltaic panels, which generated about 7% of the building\'s energy. The tree farm is what the building is recognised by from the air, so it is what this district is recognised by.',
      'US municipal civic-centre programme, kept: mayor\'s office, council chamber, city clerk, permits counter. What changed is the FORM — a clock tower is a New England town hall, and this is a Mojave one.'],
    layout:['ONE BUILDING. The office block runs across the north with a stepped east wing and a stepped-back north wing; the round COUNCIL CHAMBER lands on its south face and merges into it. Every mass shares a wall.',
      'THE ENTRANCE IS STEPS, NOT SHADE (8/2). A wide flight up onto the podium, a row of squat ENTRY PIERS marking the doors, and the doors straight off the top step. Nothing overhead anywhere on this plot.',
      'THE SOLAR ARRAY: exactly 33 masts on a grid, each carrying its panel, standing in a DECOMPOSED-GRANITE BED at the plot edge — equipment you walk past, not a canopy you walk under.',
      'THE PLAZA IS DRESSED (8/4). Two dry reflecting BASINS, a grid of limestone PLANTERS with the dead trees still standing in them, a SEATING STEP where the podium meets the plaza, a BIKE RACK row by the doors, flagpoles either side, and the light line along the kerb. Taking the canopy out was not a licence to leave a hole where it stood.',
      'THE ARRAY BED IS PLANT, NOT GRAVEL: SERVICE AISLES between the panel rows and an INVERTER CABINET at the head of each one, because the string DC has to turn into AC somewhere.',
      'THE PARKING DECK is attached on the east — columns on a grid under a roof edge, its floor drivable, with a ramp down to the surface lot and an aisle joining the two.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: ONE kerb cut on the primary street feeds the surface lot, the east aisle and the ramp up into the deck, and the whole drive network is reachable from the kerb (K.driveNetworkReach = 1.0). The stall ticks are MARKING, so a car drives over them. NOTHING on this plot is overhead. Foot circulation is plaza -> up the entrance steps between the piers -> the doors, and the solar bed is walked past on its granite, not through. A corner adds a pedestrian gate onto the plaza, never a second car entrance.',
    layering:'GROUND (flat, walk on it): the civic plaza (7), the forecourt hardpan (4), the podium, walks, seating step and array service aisles (13), the dry basins (8), the planter beds (4), the lot / aisle / deck floor (1, DRIVE) and its stall ticks (21, MARKING), the solar bed granite (4), bare desert (0). OVERHEAD (pass UNDER): NOTHING — this plot carries no overhead tile at all (Paolo 8/2, no more canopies). STRUCTURE (¾ front face, solid, ENTERABLE): the CITY HALL mass (2 — permits hall, council chamber, seven floors of offices), the curtain wall glazing (11), the chamber roof (17), the roof edge (16), the solar panels (6) and their masts (10), the entry piers (15), the plaza planters (14), the bike racks (26), the inverter cabinets (27), the deck columns (20), the deck edge (22), the plaza lights (9). PROP: dead trees (3), flagpoles (12), dead cars (19). PORTAL: the doorways (18) and the kerb cut (5).',
    decisions:['THE CLOCK TOWER IS DEAD and the LAWN with it. A clock tower is a New England town hall; the lawn was 28% of the plot painted green in a valley that stopped watering anything. Replaced with the real local landmark and with decomposed granite.',
      'THE 33 IS NOT DECORATIVE. Elkus Manfredi built 33 solar trees; this district draws 33 and its gate counts them. A number taken from the real building is a fact the machine can hold.',
      'Deliberately differentiated from the courthouse (L-plan + rotunda + blast setback) and from the library (drum + tower + reading wing): here it is a seven-storey block merged with a round chamber, over a granite bed of 33 solar masts. Every district is its own landmark (7/28).',
      'NO CANOPY (8/2, Paolo: "no more canopies I only see canopies at parks and shit"). The entry canopy on its 160-foot mast is gone and the solar trees came off the plaza people walk across into their own bed. A solar tree you stand under is a canopy whatever the legend calls it.',
      'ONE BUILDING (8/2): the chamber and the block merge, the way they do in the real lobby. Articulation, not fragmentation.',
      'WALKABLE-LAND: building + plaza + tree farm dominate; the lot and deck are the only pavement, and the deck is a real vehicular structure rather than more apron.',
      'Act-1 DEAD: panels milky and half stripped for the copper in the leads, basins dry with tidemarks, curtain wall boarded in runs, deck columns spalled to the rebar. Who administers anything now is faction canon and stays Paolo\'s.',
      'Zero purple. No city name, seal text or signage anywhere (Paolo\'s to author).']
  };
  K.register('cityhall', { generate:generate, body:function(c){return c===2||c===11||c===16||c===17||c===18||c===23||c===25;},
    category:'civic', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},
    SOLAR_TREES:SOLAR_TREES,palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaCityhall=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
