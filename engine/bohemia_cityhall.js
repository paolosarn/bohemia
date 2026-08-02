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
// -- and over the main entrance a dynamic CANOPY carried on a single 160-foot column.
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
//  6 solar panel (OVERHEAD)  7 civic plaza                  8 dry fountain basin
//  9 plaza light         10 solar tree mast                11 curtain wall glazing
//  12 flagpole           13 walk / podium                  14 entry canopy (OVERHEAD)
//  15 canopy mast        16 roof edge                      17 council chamber roof
//  18 doorway (PORTAL)   19 dead car                       20 deck column
//  21 stall marking (PAINT)  22 deck edge   23 roof joint   24 deck floor   25 rooftop plant
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
    set(46,74,12); set(82,74,12);                            // flagpoles either side of the doors

    /* ---- THE ENTRY CANOPY on its SINGLE mast. Drawn AFTER the plaza and MASKED to open
       ground: laid straight over the grid an overhead ERASES what is under it, and then the
       plaza laid over the top erases the canopy in turn. A canopy shades a thing; it never
       replaces it, and it is never drawn before the ground it shades. ---- */
    for(y=70;y<=84;y++) for(x=26;x<=104;x++){ var ov=get(x,y); if(ov===7||ov===13||ov===4) set(x,y,14); }
    G.rect(62,78,68,84,15);                                  // the 160-foot column, the only support
    G.rect(56,68,72,72,18);                                  // the main doors under it

    for(x=14;x<=114;x+=14) set(x,111,9);                     // the plaza light line, clear of the trees

    /* ---- THE SOLAR TREE FARM: 33 masts, each under its panel. The thing you recognise. ---- */
    var trees=0;
    for(y=88;y<=106&&trees<SOLAR_TREES;y+=9) for(x=14;x<=102&&trees<SOLAR_TREES;x+=8){
      if(get(x,y)!==7) continue;
      G.rect(x-2,y-2,x+2,y+2,6); set(x,y,10); trees++;
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
    13:'#7d7a71',14:'#9a9184',15:'#a89c86',16:'#b3a78d',17:'#a3947a',18:'#241f1a',
    19:'#6a6e72',20:'#77726a',21:'#4a4a52',22:'#8b8272',23:'#635c4f',24:'#4c4a48',25:'#6e6a60'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',   act1:'bare Mojave dirt at the property line, sun-cracked, drift sand banked against the kerb'},
    1:{name:'drive / lot / deck', kind:'drive',    act1:'the visitor lot, the aisle and the deck floor above it — asphalt gone to plates, weeds up every joint (car-drivable)'},
    2:{name:'city hall',          kind:'building', act1:'sand-coloured precast and glass — the angular office block and the curved council chamber that merge in the lobby, the curtain wall boarded in runs where it came down', enter:'city hall interior: the public counter and permits hall behind the doors, the round council chamber under its own roof, seven floors of department offices in the block'},
    3:{name:'dead tree',          kind:'tree-dead',act1:'a dead civic tree gone to stick, its grate prised up for the metal', solid:false},
    4:{name:'forecourt hardpan',  kind:'ground',   act1:'decomposed granite that was raked once, now hardpan split by weeds. Not a lawn: nothing is watering this'},
    5:{name:'gate / kerb cut',    kind:'gate',     act1:'the kerb cut off the street into the lot, amber paint gone chalky'},
    6:{name:'solar panel',        kind:'overhead', act1:'a photovoltaic panel on its tree — the glass milky, half the array stripped for the copper in the leads. You walk and drive UNDER it'},
    7:{name:'civic plaza',        kind:'ground',   act1:'the public plaza under the solar trees, big pavers heaved by roots, the meeting-day chalk long gone'},
    8:{name:'dry fountain basin', kind:'water-dead',act1:'a reflecting basin bone dry, the old waterline stained around it like a tidemark'},
    9:{name:'plaza light',        kind:'structure',act1:'a plaza light on its concrete stem, head dark, the glass long gone'},
    10:{name:'solar tree mast',   kind:'structure',act1:'the tubular column of a solar tree, thirty feet of steel, powder coat blistered off the sunward side'},
    11:{name:'curtain wall glazing',kind:'structure',act1:'the glass curtain wall — the panels that are left are sun-hazed, the rest is board and sky'},
    12:{name:'flagpole',          kind:'prop',     act1:'a flagpole beside the doors, halyard slapping in the wind, nothing left on it'},
    13:{name:'walk / podium',     kind:'walk',     act1:'the raised concrete podium the building stands on and the walks across it, cracked corner to corner'},
    14:{name:'entry canopy',      kind:'overhead', act1:'the great canopy over the main entrance, one edge folded down where a panel let go. You walk UNDER it'},
    15:{name:'canopy mast',       kind:'structure',act1:'the single column that holds the whole canopy up, a hundred and sixty feet of it, still dead plumb'},
    16:{name:'roof edge',         kind:'structure',act1:'the parapet line where a roof meets its wall, coping missing in runs'},
    17:{name:'council chamber roof',kind:'structure',act1:'the round roof over the council chamber, its ring of clerestory glazing gone'},
    18:{name:'doorway',           kind:'portal',   act1:'a way in — the main doors under the canopy, the deck stair, the loading door on the north wing'},
    19:{name:'dead car',          kind:'vehicle',  act1:'a car left in the lot, flat and sun-bleached, nobody came back for it'},
    20:{name:'deck column',       kind:'structure',act1:'a concrete column holding the parking deck up, corner spalled to the rebar'},
    25:{name:'rooftop plant',     kind:'structure',act1:'a mechanical unit on the office roof, ducting collapsed, one of them stripped for its copper', solid:true},
    23:{name:'roof joint',        kind:'structure',act1:'the joint line between two roof plates, sealant gone chalky and lifted out in runs', solid:true},
    24:{name:'deck floor',        kind:'drive',    act1:'the covered floor of the parking deck — lighter than the open lot because the sun never got at it, oil ghosts still in every stall (car-drivable)'},
    22:{name:'deck edge',         kind:'structure',act1:'the spandrel rail round the parking deck, a bay of it folded outward where something went through', solid:true},
    21:{name:'stall marking',     kind:'marking',  act1:'the painted stall ticks across the lot, chalked out to ghosts by twenty summers — PAINT IS NOT A WALL, a car drives straight over it'}
  };
  var NOTES={
    summary:'A dead city hall — ONE building of two merged shapes, the ANGULAR seven-storey glass office block and the CURVILINEAR council chamber, standing on a podium behind a great entry canopy carried on a single column, with 33 SOLAR TREES in a grid across the public plaza in front of it and an attached parking deck to the east. The executive seat, distinct from the judicial courthouse.',
    reference:['LAS VEGAS CITY HALL (Elkus Manfredi Architects, 2012, 495 S Main St). Two distinctive shapes — the curvilinear Council Chamber and the angular seven-storey glass office structure — that MERGE inside the lobby; a dynamic canopy over the plaza entrance carried on a single 160-foot column; and in the plaza a solar "tree farm" of 33 tubular columns 25 to 35 feet tall mounted with photovoltaic panels, which generated about 7% of the building\'s energy. The tree farm is what the building is recognised by from the air, so it is what this district is recognised by.',
      'US municipal civic-centre programme, kept: mayor\'s office, council chamber, city clerk, permits counter. What changed is the FORM — a clock tower is a New England town hall, and this is a Mojave one.'],
    layout:['ONE BUILDING. The office block runs across the north with a stepped east wing and a stepped-back north wing; the round COUNCIL CHAMBER lands on its south face and merges into it. Every mass shares a wall.',
      'THE ENTRY CANOPY spans the plaza in front of the doors on ONE mast — an overhead, so you walk under it and it never blocks a path.',
      'THE SOLAR TREE FARM: exactly 33 masts on a grid, each under its panel, filling the plaza. Panels are overhead; the masts are what you bump into.',
      'Two dry reflecting BASINS flank the plaza, flagpoles stand either side of the doors, and the plaza light line runs along the kerb.',
      'THE PARKING DECK is attached on the east — columns on a grid under a roof edge, its floor drivable, with a ramp down to the surface lot and an aisle joining the two.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: ONE kerb cut on the primary street feeds the surface lot, the east aisle and the ramp up into the deck, and the whole drive network is reachable from the kerb (K.driveNetworkReach = 1.0). The stall ticks are MARKING, so a car drives over them, and the canopy and panels are OVERHEAD, so they conduct a path instead of severing one. Foot circulation is plaza -> under the canopy -> the doors. A corner adds a pedestrian gate onto the plaza, never a second car entrance.',
    layering:'GROUND (flat, walk on it): the civic plaza (7), the forecourt hardpan (4), the podium and walks (13), the dry basins (8), the lot / aisle / deck floor (1, DRIVE) and its stall ticks (21, MARKING), bare desert (0). OVERHEAD (pass UNDER): the solar panels (6) and the entry canopy (14). STRUCTURE (¾ front face, solid, ENTERABLE): the CITY HALL mass (2 — permits hall, council chamber, seven floors of offices), the curtain wall glazing (11), the chamber roof (17), the roof edge (16), the solar tree masts (10), the canopy mast (15), the deck columns (20), the plaza lights (9). PROP: dead trees (3), flagpoles (12), dead cars (19). PORTAL: the doorways (18) and the kerb cut (5).',
    decisions:['THE CLOCK TOWER IS DEAD and the LAWN with it. A clock tower is a New England town hall; the lawn was 28% of the plot painted green in a valley that stopped watering anything. Replaced with the real local landmark and with decomposed granite.',
      'THE 33 IS NOT DECORATIVE. Elkus Manfredi built 33 solar trees; this district draws 33 and its gate counts them. A number taken from the real building is a fact the machine can hold.',
      'Deliberately differentiated from the courthouse (L-plan + rotunda + blast setback) and from the library (drum + tower + reading wing): here it is a grid of solar trees under a single-masted canopy. Every district is its own landmark (7/28).',
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
