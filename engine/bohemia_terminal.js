// BOHEMIA TRANSIT TERMINAL (7/23/26). INFRASTRUCTURE, on the DISTRICT KIT. Paolo: "look at all the
// pocket city 2 buildings, we have to make them as districts" — Pocket City 2's Transport category
// (bus/train stations that raise the traffic/transit rating) has no PASSENGER equivalent in Bohemia;
// bohemia_railyard.js is FREIGHT rail (industrial, no passengers). Research-first (real intercity/
// regional bus-terminal design): a TERMINAL BUILDING (waiting hall, ticket counters, restrooms), a
// row of BUS BAYS under a long boarding CANOPY with a raised platform, a bus LAYOVER/staging yard,
// a kiss-and-ride drop-off loop, a small park-and-ride lot, a schedule-board clock landmark. Act-1
// DEAD: buses dead at the bays and in the layover yard, the schedule board blank, the waiting hall
// dark, benches empty. Street-aware + drivable (bays, loop, and lot are all one connected car
// surface, buses AND cars alike reach the curb). Terminal + canopy + platform + bus fleet dominate
// (WALKABLE-LAND) — a real terminal's paved bus surface is itself the venue, but is anchored by a
// real building mass, not a bare apron.
// LEGEND:
//  0 desert  1 drive (bays/loop/lot, DRIVABLE)  2 terminal building  3 dead landscaping
//  4 lawn  5 gate  6 boarding canopy (OVERHEAD)  7 platform  8 bench / shelter
//  9 pole light  10 dead bus  11 bay marking  12 schedule board / clock  13 bike rack
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }

    // ---- BASE: dead lawn; desert only at the margins ----
    G.rect(0,0,W-1,H-1,0);
    G.rect(5,5,W-6,H-6,4);

    // ---- THE TERMINAL BUILDING (back of the lot, the mass) + a schedule-board clock landmark ----
    G.rect(16,10,96,38,2);
    for(x=20;x<=92;x+=6) set(x,10,11);                                   // window-line read along the front face
    set(56,6,12);                                                        // the schedule board / clock tower over the doors

    // ---- BOARDING CANOPY + PLATFORM — the bus bays' overhead + the raised platform under it ----
    G.rect(14,40,98,46,6);
    G.rect(14,46,98,50,7);
    for(x=18;x<=94;x+=10){ set(x,48,8); }                                // benches along the platform
    for(x=20;x<=90;x+=10) set(x,40,9);                                   // canopy-mounted lights

    // ---- BUS BAYS — a row of dead buses staged nose-in at the platform ----
    G.rect(10,50,102,68,1);
    for(x=18;x<=90;x+=12){ G.rect(x,52,x+8,64,10); set(x+4,51,11); }     // a bus at each bay + a bay-line stripe

    // ---- LAYOVER / STAGING YARD (SE) — more of the fleet parked dead, off the passenger bays ----
    G.rect(70,72,116,110,1);
    for(var ly=76; ly<=104; ly+=14) for(var lx=74; lx<=108; lx+=18){ G.rect(lx,ly,lx+10,ly+8,10); }

    // ---- KISS-AND-RIDE DROP-OFF LOOP + a small PARK-AND-RIDE LOT (SW) ----
    G.rect(10,72,58,88,1);
    G.rect(10,92,58,116,1);
    for(x=14;x<=54;x+=6){ set(x,96,11); set(x,112,11); }

    // ---- DRIVE COLLECTOR: one connected car surface (bays -> loop -> layover -> lot ->
    //      the entrance). Everything a bus or car touches reaches the curb (DRIVABLE LAW). ----
    G.rect(10,68,116,72,1);                                              // full-width collector behind the bays
    G.rect(56,68,60,116,1);                                             // central spine down to the entrance lane
    G.rect(10,88,58,92,1);                                              // tie SW loop to the park-and-ride lot

    // ---- BIKE RACK near the entrance + dead landscaping at the margins ----
    set(20,70,13); set(92,70,13);
    for(i=0;i<12;i++){ var tx=6+Math.floor(r()*4), ty=8+Math.floor(r()*(H-16)); if(get(tx,ty)===4)set(tx,ty,3); }
    for(i=0;i<12;i++){ var tx2=W-6+Math.floor(r()*4), ty2=8+Math.floor(r()*(H-16)); if(get(tx2,ty2)===4)set(tx2,ty2,3); }

    // ---- ENTRANCE off the SOUTH street (rotated to the real street by the kit) ----
    var gx=W>>1;
    for(i=-5;i<=5;i++)set(gx+i,H-1,5);
    G.rect(gx-4,110,gx+4,H-1,1);
    for(y=H-1;y>=110;y--)for(x=-4;x<=4;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4)set(gx+x,y,1); }
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:12});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})};
  }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  var PALETTE={0:'#1c1a15',1:'#4a463c',2:'#726a58',3:'#3a4526',4:'#49512e',5:'#c79a3f',6:'#5a564a',
    7:'#8f887a',8:'#7a7268',9:'#8f8676',10:'#556065',11:'#c9c1aa',12:'#8a7f5e',13:'#635c4a'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt at the terminal-lot edge (setback)'},
    1:{name:'drive',              kind:'drive',      act1:'the bus bays, layover yard, kiss-and-ride loop, and park-and-ride lot — one connected car surface (drivable)'},
    2:{name:'building (terminal)',kind:'building',   act1:'the terminal — waiting hall, ticket counters, restrooms, boarded, the departures board dark', enter:'terminal interior: the waiting hall + ticket counters up front, restrooms + a small office behind'},
    3:{name:'dead landscaping',   kind:'tree-dead',  act1:'a dead tree / hedge at the lot edge', solid:false},
    4:{name:'lawn',               kind:'ground',     act1:'the dead lawn edging the terminal lot'},
    5:{name:'gate',               kind:'gate',       act1:'the terminal entrance off the street, amber curb'},
    6:{name:'boarding canopy',    kind:'overhead',   act1:'the boarding canopy over the bus bays (pass under it to reach the platform)'},
    7:{name:'platform',           kind:'ground',     act1:'the raised boarding platform under the canopy, paint worn to bare concrete'},
    8:{name:'bench / shelter',    kind:'prop',       act1:'a platform bench, seat cracked, no one waiting'},
    9:{name:'pole light',         kind:'prop',       act1:'a canopy-mounted light, dead'},
    10:{name:'dead bus',          kind:'vehicle',    act1:'a bus dead at its bay or in the layover yard, tyres flat, destination sign blank', solid:true},
    11:{name:'bay marking',       kind:'marking',    act1:'faded bay-line striping on the bus lane'},
    12:{name:'schedule board / clock',kind:'structure',act1:'the schedule-board clock tower over the terminal doors, hands stopped, board blank', solid:true},
    13:{name:'bike rack',         kind:'prop',       act1:'a bike rack near the entrance, empty, rusted'}
  };
  var NOTES={
    summary:'A dead transit terminal — a waiting-hall building with a stopped schedule-board clock, a row of bus bays under a long boarding canopy with a raised platform, a bus layover yard, a kiss-and-ride loop, a small park-and-ride lot. Passenger transport, distinct from the freight-only railyard.',
    reference:['Intercity/regional bus-terminal design precedent: a TERMINAL BUILDING (waiting hall, ticket counters, restrooms) fronts a row of BUS BAYS under a long boarding CANOPY with a raised PLATFORM; a separate LAYOVER/staging yard holds off-duty buses; a KISS-AND-RIDE drop-off loop and a small PARK-AND-RIDE lot serve car access; a schedule-board clock is the conventional terminal landmark.'],
    layout:['The TERMINAL building sits at the back of the lot with a schedule-board CLOCK tower over its doors.',
      'A boarding CANOPY (overhead — pass under it) shelters the raised PLATFORM in front of the building; benches line the platform.',
      'A row of BUS BAYS runs along the platform, a dead bus staged at each; bay-line striping marks the lane.',
      'A LAYOVER/staging yard (SE) holds more of the fleet parked dead, off the passenger bays; a kiss-and-ride loop + small park-and-ride lot sit SW.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the entrance opens onto the primary street; the bays, layover yard, kiss-and-ride loop, and park-and-ride lot are ALL one connected drivable surface (code 1) reachable from the curb (K.driveReachFromStreet) — buses and cars alike. Corner side streets get a pedestrian gate onto the platform side. Foot circulation is the platform along the canopy.',
    layering:'GROUND plane (walk/drive, flat): the platform (7), lawn (4), the drive/bays/lot (1, drive), bay marking (11), desert (0). OVERHEAD (drawn above, pass under): the boarding CANOPY (6). STRUCTURES (¾ front face, solid, ENTERABLE): the TERMINAL building (2 -> waiting hall/ticket counters/restrooms/office) with the schedule-board CLOCK (12). PROPS / VEHICLES: dead buses (10, solid, at bays and in the layover yard), benches (8), pole lights (9), bike rack (13). PORTALS: the gate (5). The terminal + clock are the vertical mass; the canopy and its dead bus fleet are the wide low read you approach across the platform.',
    decisions:['Act-1 DEAD: buses dead at the bays and in the layover yard (flat tyres, blank destination signs), the schedule board dark and stopped, the waiting hall boarded, benches empty. Who if anyone still runs a route is faction canon (Paolo\'s).',
      'Infrastructure category (terminal) — already reserved in K.TAXONOMY (Paolo 7/18\'s taxonomy pass anticipated this slot alongside airport/rail/freeway), filled in this turn rather than inventing a new bucket.',
      'Deliberately distinct from railyard: PASSENGER transport (terminal building, platform, bus bays, kiss-and-ride) vs railyard\'s FREIGHT classification tracks and rolling stock — no overlap in vocabulary.',
      'WALKABLE-LAND honored: the building + canopy + platform + parked bus fleet are the content that anchors the paved bus surface — never a bare apron with a tiny building stranded in it.',
      'Research-first (per the playbook): built from real intercity/regional bus-terminal design, not memory.']
  };
  K.register('terminal', { generate:generate, body:function(c){return c===2;}, category:'infrastructure', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaTerminal=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
