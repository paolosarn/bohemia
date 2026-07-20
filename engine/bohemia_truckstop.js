// BOHEMIA TRUCK STOP / GAS STATION (7/20/26). COMMERCIAL, on the DISTRICT KIT. Research-first (gas
// station + fuel-station site-plan guides — plan7architect, Scottsdale gas-station design
// guidelines, architecture4design petrol stations, Venture Fuels c-store layouts): a big overhead
// FUEL CANOPY on columns shelters the PUMP ISLANDS, poured over a light CONCRETE FUEL-COURT PAD
// (stations pour concrete under the canopy for fuel-spill resistance, not asphalt); a CONVENIENCE
// STORE / diner attaches with a sidewalk + neat parking rows; a CAR/TRUCK WASH sits near the exit;
// LANDSCAPING planter islands break the asphalt; a tall PYLON PRICE SIGN faces the street; canopy +
// pole lights cover the site. A TRUCK STOP adds long pull-through BIG-RIG parking. FUEL is the
// post-apocalypse scarcity currency, so a dead fuel stop is core Bohemia: dry rusted pumps, a
// bleached torn canopy, a dead price sign, cracked pad, abandoned cars + rigs, a boarded store, a
// dead wash. Street-aware + drivable (the whole forecourt is the car surface, reachable from the
// curb). Full dossier + layering (the canopy is the OVERHEAD pass-under layer). REBUILT 7/20 after
// Paolo "it kinda looks like shit": bold filled canopy roof + concrete pad + zoned rows + planters.
// LEGEND:
//  0 desert dead-ground          1 forecourt / drive asphalt (DRIVABLE)
//  2 building (store / diner)     3 dead brush / rubble
//  4 fuel canopy roof (OVERHEAD)  5 gate / entrance
//  6 pump island / dispensers     7 wash bay (car / truck wash)
//  8 pylon / price sign           9 pole light
//  10 abandoned vehicle          11 parking / truck stall marking
//  12 concrete pad / sidewalk    13 dead landscaping planter
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    // entrance + pylon at the SOUTH (on the street); store + truck lot at the back, fuel court front.
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }

    // ---- BASE: the whole lot is drivable FORECOURT asphalt, desert only at the very margins ----
    G.rect(0,0,W-1,H-1,0);
    G.rect(6,8,W-7,H-8,1);

    // ---- STORE / DINER at the back-left, on a sidewalk, with a double parking row in front ----
    G.rect(28,12,70,30,2);
    G.rect(26,31,72,33,12);                                               // sidewalk apron in front of the store
    for(x=30;x<=68;x+=5){ set(x,38,11); set(x,39,11); set(x,45,11); set(x,46,11); }  // two stall rows (drive lane between)

    // ---- FUEL COURT: a light CONCRETE PAD, a bold filled CANOPY roof, PUMP ISLANDS under it ----
    G.rect(28,52,86,94,12);                                               // the concrete fuel-court pad (cars pull onto it)
    G.rect(30,54,84,78,4);                                                // the CANOPY ROOF (bold, filled — the signature read)
    [[30,54],[84,54],[30,78],[84,78],[57,54],[57,78]].forEach(function(p){ set(p[0],p[1],9); }); // canopy support columns (as light posts)
    for(var px=40; px<=72; px+=16){ G.rect(px,58,px+2,74,6);             // a pump island under the canopy
      set(px,59,6); set(px+2,61,6); set(px,71,6); set(px+2,73,6); }       // dispensers on the island
    // (the pad south of the roof, y 79..94, stays open as the pull-in apron)

    // ---- WASH BAY at the top-right (drive-through), enterable ----
    G.rect(92,12,116,30,7); for(y=13;y<=29;y++){ set(98,y,1); set(110,y,1); }  // two wash lanes through the bay

    // ---- BIG-RIG PARKING: long pull-through stalls down the right, wide lanes between ----
    for(var sx=92; sx<=116; sx+=8){ for(y=40;y<=104;y++) set(sx,y,11); }
    // ---- LANDSCAPING planter islands break up the asphalt (dead, gone to weed) ----
    G.rect(30,98,42,102,13); G.rect(74,86,84,92,13); G.rect(16,100,24,110,13); G.rect(74,110,86,116,13);
    // ---- PYLON PRICE SIGN at the south-west street corner (tall) ----
    G.rect(12,108,16,120,8);

    // ---- dead detail: pole lights, abandoned cars + rigs ----
    [[26,50],[88,50],[26,96],[88,96]].forEach(function(p){ set(p[0],p[1],9); }); // fuel-court + lot pole lights
    [[45,80],[62,88]].forEach(function(p){ G.rect(p[0],p[1],p[0]+1,p[1]+2,10); });        // abandoned cars on the apron
    [[93,44],[101,70],[109,54]].forEach(function(p){ G.rect(p[0],p[1],p[0]+1,p[1]+7,10); }); // big rigs in the pull-through stalls

    // ---- dead brush ONLY at the desert margins (no dirt-noise across the lot) ----
    for(i=0;i<70;i++){ var bx=1+Math.floor(r()*5), by=1+Math.floor(r()*(H-2)); if(get(bx,by)===0)set(bx,by,3); }
    for(i=0;i<70;i++){ var bx2=W-6+Math.floor(r()*5), by2=1+Math.floor(r()*(H-2)); if(get(bx2,by2)===0)set(bx2,by2,3); }
    for(i=0;i<40;i++){ var bx3=6+Math.floor(r()*(W-12)), by3=H-8+Math.floor(r()*6); if(get(bx3,by3)===1)set(bx3,by3,3); }

    // ---- ENTRANCE / EXIT off the SOUTH street (rotated to the real street by the kit) ----
    var gx=W>>1;
    for(i=-4;i<=4;i++)set(gx+i,H-1,5);
    for(y=H-1;y>=H-8;y--)for(x=-3;x<=3;x++){ var c=g[y][gx+x]; if(c===0||c===3)set(gx+x,y,1); }
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:12});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2||v===7;})};
  }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#6f665a',3:'#4a4030',4:'#b8b4a8',5:'#c79a3f',6:'#9a5a3a',
    7:'#5a5f63',8:'#b0863a',9:'#8f8676',10:'#55555f',11:'#c9c1aa',12:'#6a675e',13:'#55603a'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt at the parcel edge (setback)'},
    1:{name:'forecourt / drive asphalt',kind:'drive',act1:'cracked forecourt + entry/exit lanes — the drivable apron cars pull across to the pumps'},
    2:{name:'building (store / diner)',kind:'building',act1:'the boarded convenience store + diner, dead coolers, faded signage', enter:'store interior: registers + coolers + aisles up front, a small diner + back stockroom behind'},
    3:{name:'dead brush / rubble', kind:'tree-dead', act1:'tumbleweed + spalled-concrete rubble at the cracked margins', solid:false},
    4:{name:'fuel canopy roof',   kind:'overhead',   act1:'the fuel canopy roof on its columns — bleached steel, panels torn, lights dead (you drive/walk UNDER it)'},
    5:{name:'gate / entrance',    kind:'gate',       act1:'the drive entrance/exit off the street, amber curb'},
    6:{name:'pump island / dispensers',kind:'prop',  act1:'a raised pump island, dispensers dry + rusted, hoses cracked, screens dead', solid:true},
    7:{name:'wash bay (car / truck wash)',kind:'building',act1:'the wash bay, doors seized, brushes rotted, the drive-through lanes silted', enter:'wash-bay interior: the wash tunnels + the equipment room off the side'},
    8:{name:'pylon / price sign', kind:'structure',  act1:'the tall pylon price sign at the street, panels blank + cracked, brand dead'},
    9:{name:'pole light',         kind:'prop',       act1:'a forecourt / canopy pole light, head shattered, dark'},
    10:{name:'abandoned vehicle', kind:'vehicle',    act1:'a car or big rig left at a pump / in a stall, tyres flat, dust-caked'},
    11:{name:'parking / truck stall marking',kind:'marking',act1:'faded stall paint — customer parking + the long pull-through big-rig stalls'},
    12:{name:'concrete pad / sidewalk',kind:'ground',act1:'the light concrete fuel-court pad (poured under the canopy for spill resistance) + the store sidewalk, cracked'},
    13:{name:'dead landscaping planter',kind:'prop', act1:'a curb planter island gone to dead weed — the landscaping that once broke up the lot', solid:false}
  };
  var NOTES={
    summary:'A dead highway truck stop / gas station — an overhead fuel canopy on columns over dry rusted pump islands on a light concrete pad, a boarded store + diner with a sidewalk + parking rows, a dead wash bay, long pull-through big-rig parking, dead landscaping planters, a blank price pylon, all on a cracked drivable forecourt.',
    reference:['Gas station + fuel-station site-plan guides (plan7architect, Scottsdale gas-station design guidelines, architecture4design petrol stations, Venture Fuels c-store layouts): a big overhead CANOPY on columns shelters the PUMP ISLANDS over a poured CONCRETE PAD (spill resistance); a CONVENIENCE STORE / diner attaches with a sidewalk + parking; a WASH bay sits near the exit; separate entry/exit lanes feed a drivable forecourt; LANDSCAPING planters break up the paving; a tall PYLON PRICE SIGN faces the street; canopy + pole lights cover the site. A TRUCK STOP adds long pull-through big-rig parking. FUEL is the post-apocalypse scarcity currency, so a dead fuel stop is core Bohemia.'],
    layout:['The whole lot is a cracked drivable FORECOURT (desert only at the very margins); entry/exit is off the south street.',
      'A CONVENIENCE STORE + diner sits back-left on a sidewalk with two customer parking rows in front.',
      'The FUEL COURT is front-center: a light CONCRETE PAD, a bold filled CANOPY roof on columns (open to the south so you drive in) sheltering the CAR PUMP ISLANDS; the pad south of the roof is the pull-in apron.',
      'A WASH bay with two drive-through lanes sits top-right; long pull-through BIG-RIG stalls line the right with abandoned rigs; dead landscaping planters break the asphalt; a tall PYLON price sign stands at the south-west street corner.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the entry/exit is on the primary street; the whole forecourt (code 1) is the drivable surface (a car pulls in off the curb, crosses to any pump/stall via the concrete pad, and out) reachable in any placement (K.driveReachFromStreet). Corner side streets get a pedestrian gate.',
    layering:'GROUND plane (drive/walk, flat): the forecourt asphalt (1, drive), the concrete fuel-court pad + sidewalk (12), the stall markings (11), desert (0). OVERHEAD (drawn ABOVE, you pass UNDER it): the fuel CANOPY roof (4) — it floats over the pumps on columns, the pad runs under it. STRUCTURES (¾ front face, solid, ENTERABLE): the store/diner (2 -> store interior), the wash bay (7 -> wash-bay interior); the PYLON sign (8, tall, solid). PROPS: the pump islands (6, dispensers on a raised curb, solid), pole lights (9), abandoned vehicles (10), dead planters (13, low). PORTALS: the gate (5). The canopy is the one thing you go UNDER; everything else you drive around or enter.',
    decisions:['Act-1 DEAD: dry rusted pumps, a bleached torn canopy with dead lights, a blank cracked price pylon, a boarded store, a seized wash, abandoned cars + rigs, dead planters, cracked pad. No power, no fuel flowing (the fuel itself is a scarcity-economy resource Paolo rules).',
      'Filed COMMERCIAL as a truckstop (retail fuel + convenience + parking) — the taxonomy home for a fuel stop. Zero purple. No brand names/logos (Paolo\'s to author if ever) — they read dead.',
      'Uses the OVERHEAD layer for the canopy (the layering law\'s pass-under case) — the forecourt/pad stay drivable under the roof.',
      'REBUILT after Paolo "it kinda looks like shit": the first pass was a sparse dark lot with a thin canopy outline + dirt-noise scatter. Now a bold filled canopy roof, a light concrete pad focal plaza, zoned parking + truck rows, and landscaping planters — a proper tonal ladder (asphalt < pad < store < canopy) instead of muddy dark.',
      'Research-first (per the playbook): built from real gas-station + truck-stop site plans, not memory.']
  };
  K.register('truckstop', { generate:generate, body:function(c){return c===2||c===7;}, category:'commercial', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaTruckstop=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
