// BOHEMIA LIBRARY (7/21/26). CIVIC, on the DISTRICT KIT. Research-first (library design guides — WBDG
// public-library space types, Boston/Salt Lake/LA central-library plans, Opening the Book space
// planning): the plan centres on circulation, wrapped by multi-tiered STACKS, wrapped by READING
// ROOMS; a grand ENTRANCE with steps + a colonnade opening onto a PIAZZA/plaza; an administration
// wing; an inner reading COURTYARD/garden. A library is BUILDING-dominant (the point is the building),
// so the plot is nearly all structure (WALKABLE-LAND LAW, easily). Act-1 DEAD: broken windows, books
// spilled + rotting, a dead fountain, the colonnade cracked. Street-aware + drivable (a small lot).
// Full dossier + layering. Hero: the big columned building + grand plaza.
// LEGEND:
//  0 desert dead-ground          1 drive / lot (DRIVABLE)
//  2 building (library)           3 landscaping / tree
//  4 reading garden               5 gate
//  6 entrance steps               7 entrance plaza / piazza
//  8 colonnade columns            9 pole light
//  10 dead fountain / sculpture  11 stacks / reading detail   12 reading courtyard   13 sidewalk
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }

    /* REBUILT 8/2 on the research. The old district was ONE building mass -- 37% of the
       plot under a single code, one footprint, a flat rectangle wrapped round a courtyard
       sitting on a lawn. It was the worst remaining district on the contact sheet.

       THE REFERENCE IS REAL AND IT IS IN LAS VEGAS: Antoine Predock's LAS VEGAS LIBRARY
       AND LIED DISCOVERY MUSEUM (1986-90, Las Vegas Boulevard, across from Cashman Field).
       56,800 sq ft of library plus a 32,000 sq ft children's museum, and what everyone
       remembers is the GEOMETRY -- iconic CONES, a conical party room by the museum
       entrance, and a giant concrete TOWER that the local paper still refers to it by.
       Sandstone and concrete, "the color scheme is provided by the desert".
       That is a silhouette nothing else in this valley makes: a DRUM and a TOWER against
       long low wings. A civic building should be the landmark of its block, and this one
       actually was one. */

    G.rect(0,0,W-1,H-1,0);
    G.rect(4,4,W-5,H-5,4);                                   // the desert forecourt ground
    G.rect(6,8,120,96,13);                                   // the terrace the building sits on

    /* ---- THE DRUM. The cone. The thing you see first and remember. ---- */
    G.disc(40,40,22,2);
    G.disc(40,40,15,14);                                     // its lit oculus ring
    G.disc(40,40,7,2);
    G.disc(40,40,3,10);                                      // the rooftop lantern

    /* ---- THE TOWER. Square, concrete, and the tallest thing on the block. ---- */
    G.rect(84,14,104,34,2);
    G.rect(88,18,100,30,10);
    G.rect(92,34,96,36,18);

    /* ---- THE READING WING: a long low bar with a clerestory running its length ---- */
    G.rect(14,68,112,88,2);
    for(x=18;x<=108;x+=5) G.rect(x,74,x+2,82,11);            // the clerestory teeth
    G.rect(56,88,70,90,18);                                  // the doors onto the plaza

    /* ---- THE MUSEUM WING, its own mass, set back and turned off the drum ---- */
    G.rect(62,14,80,60,2);
    G.rect(66,20,70,24,10); G.rect(72,40,76,44,10);
    G.rect(62,60,80,62,18);

    /* ---- THE COURTYARD between the drum, the tower and the wings ---- */
    G.rect(20,46,58,64,12);
    for(x=24;x<=54;x+=8) set(x,55,3);
    G.rect(84,40,112,64,12);
    for(x=88;x<=108;x+=8) set(x,52,3);

    /* ---- THE ENTRY PLAZA and its dry fountain, south front ---- */
    G.rect(20,92,110,112,7);
    G.disc(64,102,6,10); G.disc(64,102,3,7);                 // the fountain, dry since
    for(x=26;x<=104;x+=13) set(x,110,9);                     // the plaza lights

    /* ---- THE LOT, off the south-east, and the service drive round the back ---- */
    G.rect(6,114,120,124,1);
    for(x=10;x<=116;x+=4) for(y=116;y<=122;y++) set(x,y,11);
    G.rect(6,8,10,124,1);                                    // the service drive, west side
    for(i=0;i<12;i++){ var cx=10+Math.floor(r()*26)*4, cy=116+Math.floor(r()*3);
      if(get(cx+1,cy)===1||get(cx+1,cy)===11) G.rect(cx+1,cy,cx+2,cy+3,19); }

    /* ---- dead planting through the forecourt ---- */
    for(i=0;i<22;i++){ var tx=6+Math.floor(r()*116), ty=6+Math.floor(r()*116);
      if(get(tx,ty)===4) set(tx,ty,3); }

    K.roofsAndDoors(g,{ building:function(c){return c===2;}, roof:17, door:18, min:150,
      outside:function(c){ return c===13||c===7||c===12||c===1||c===4||c===11; } });

    var gx=64;
    for(i=-5;i<=5;i++) set(gx+i,H-1,5);
    for(y=H-1;y>=124;y--) for(x=-5;x<=5;x++){ var c=get(gx+x,y); if(c===0||c===4||c===13) set(gx+x,y,1); }
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4||c===13; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:13, pedOver:soft, pedInset:12});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})};
  }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  /* SANDSTONE AND CONCRETE. Predock's own note on the building: "the color scheme is
     provided by the desert." No green anywhere -- nothing is watering this. */
  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#9a7f5c',3:'#514f40',4:'#6b6250',5:'#c79a3f',
    7:'#8a8175',9:'#b0863a',10:'#8e8a7c',11:'#93a2a8',12:'#6f6a5c',13:'#7d7a71',
    14:'#c2b48c',17:'#bfa87f',18:'#241f1a',19:'#6a6e72'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',   act1:'bare Mojave dirt at the property line, sun-cracked, drift sand banked against the kerb'},
    1:{name:'drive / lot',        kind:'drive',    act1:'the library lot and its service drive — asphalt gone to plates, weeds up every joint (car-drivable)'},
    2:{name:'library / museum',   kind:'building', act1:'sandstone and concrete geometry — Predock built this valley a landmark out of a drum, a tower and two long low wings, and the sandstone is still the colour of the desert it was matched to', enter:'library interior: the drum is one round room under a dead oculus, the reading wing is stacks and tables to the clerestory, the museum wing is three floors of stripped gallery'},
    3:{name:'dead tree',          kind:'tree-dead',act1:'a dead courtyard tree gone to stick, its grate prised up for the metal', solid:false},
    4:{name:'forecourt ground',   kind:'ground',   act1:'the unpaved forecourt — decomposed granite that was raked once, now hardpan split by weeds. Not a lawn: nothing is watering this'},
    5:{name:'gate / kerb cut',    kind:'gate',     act1:'the kerb cut off the street into the lot, amber paint gone chalky'},
    7:{name:'entry plaza',        kind:'ground',   act1:'the civic plaza across the front — big sandstone pavers heaved by roots, and the fountain basin dry in the middle of it'},
    9:{name:'plaza light',        kind:'structure',act1:'a plaza light on its concrete stem, head dark, the glass long gone'},
    10:{name:'rooftop lantern / plant',kind:'structure',act1:'the drum\'s rooftop lantern and the mechanical plant on the tower and the wings, ducting collapsed, one unit stripped for its copper'},
    11:{name:'clerestory glazing',kind:'structure',act1:'the clerestory teeth running the length of the reading wing — the glass that lit the stacks, now mostly sky'},
    12:{name:'courtyard',         kind:'ground',   act1:'a walled reading courtyard between the masses, its paving cracked, the planting dead in place'},
    13:{name:'terrace / walk',    kind:'walk',     act1:'the raised concrete terrace the whole building sits on, and the walks across it, cracked corner to corner'},
    14:{name:'oculus ring',       kind:'structure',act1:'the ring of the drum\'s oculus — the round clerestory that dropped daylight into the middle of the reading room, its glazing gone'},
    17:{name:'roof edge',         kind:'structure',act1:'the parapet line where a roof meets its wall, coping missing in runs'},
    18:{name:'doorway',           kind:'portal',   act1:'a way in — the plaza doors under the reading wing, the museum entrance, the tower stair core'},
    19:{name:'dead car',          kind:'vehicle',  act1:'a car left in the lot, flat and sun-bleached, nobody came back for it'}
  };
;
  var NOTES={
    summary:'A dead public library — a big columned stone building wrapped around an inner reading courtyard, a grand colonnade + entrance steps down to a piazza with a dead fountain, admin + community wings, a reading garden, a small side lot.',
    reference:['Library design guides (WBDG public-library space types, Boston/Salt Lake/LA central-library plans, Opening the Book space planning): the plan centres on CIRCULATION, wrapped by multi-tiered book STACKS, wrapped by READING ROOMS; a grand ENTRANCE (steps + colonnade) opening onto a PIAZZA/plaza; an administration wing; an inner reading COURTYARD/garden. A library is BUILDING-dominant.'],
    layout:['The library BUILDING is a big columned mass filling the plot, wrapped around an inner reading COURTYARD (a garden + centre sculpture) with the multi-tiered STACKS + reading detail around it, admin + community wings at the back corners.',
      'A grand COLONNADE of columns spans the south front; broad entrance STEPS drop to the PIAZZA/plaza with a dead central FOUNTAIN + planters.',
      'A dead reading GARDEN + trees ring the building on its terrace/sidewalk.',
      'A small drop-off drive + two side lots (minimal — a library is a building, not a lot) meet the street; book-return kiosks + pole lights dress the plaza.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: a drop-off drive on the primary street feeds two small side lots (code 1 reaches them from the curb, K.driveReachFromStreet). Foot circulation is the piazza -> steps -> colonnade -> the building. WALKABLE-LAND: the plot is nearly ALL building + plaza + garden — content dominates overwhelmingly; the lots are minimal. Corner side streets get a pedestrian gate onto the piazza.',
    layering:'GROUND plane (walk/drive, flat): the piazza (7), reading garden (4), sidewalk/terrace (13), the reading courtyard (12), the drive/lots (1, drive), desert (0). STRUCTURES (¾ front face, solid, ENTERABLE): the LIBRARY (2 -> circulation + stacks + reading rooms interior) with its stack/reading detail (11), the COLONNADE columns (8), the entrance STEPS (6). PROPS: the dead FOUNTAIN/sculpture (10), pole lights (9), book-return kiosks (13), dead trees (3). PORTALS: the gate (5). The columned mass + colonnade are the vertical hero; you cross the piazza and climb the steps into it.',
    decisions:['Act-1 DEAD: broken windows + chained doors, the stacks spilled + rotting, a dry fountain, cracked pavers, a toppled column or two. Books are a knowledge/scarcity resource (Paolo\'s + the economy\'s to rule — what survives on the shelves is his).',
      'Civic category (library). Zero purple. No library name/inscription (Paolo\'s to author).',
      'WALKABLE-LAND LAW honored (easily): a library IS its building — the plot is nearly all structure + plaza + garden, lots minimal.',
      'Research-first (per the playbook): built from real central-library plans (core -> stacks -> reading rooms), not memory.']
  };
  K.register('library', { generate:generate, body:function(c){return c===2;}, category:'civic', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaLibrary=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
