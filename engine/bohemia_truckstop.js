// BOHEMIA TRUCK STOP / GAS STATION (7/20/26). COMMERCIAL, on the DISTRICT KIT. Research-first (gas
// station + fuel-station site-plan guides — plan7architect, Scottsdale gas-station design
// guidelines, architecture4design petrol stations, Venture Fuels c-store layouts): a big overhead
// FUEL CANOPY on columns shelters the PUMP ISLANDS (islands ~12-20ft, ≥24ft between for maneuvering);
// a CONVENIENCE STORE / diner is attached; a CAR/TRUCK WASH bay sits by the exit; separate entry/exit
// lanes feed a drivable forecourt; a tall PYLON PRICE SIGN faces the street; pole + canopy lights.
// A TRUCK STOP adds long pull-through BIG-RIG PARKING. Post-economic-apocalypse, FUEL is scarcity
// currency, so a dead fuel stop is core Bohemia: dry rusted pumps, a sagging torn canopy, a dead
// price sign, cracked forecourt, abandoned cars + rigs, a boarded store, a dead wash. Street-aware +
// drivable (the whole forecourt is the car surface, reachable from the curb). Full dossier + layering.
// LEGEND:
//  0 desert dead-ground          1 forecourt / drive asphalt (DRIVABLE)
//  2 building (store / diner)     3 dead brush / rubble
//  4 fuel canopy (OVERHEAD)       5 gate / entrance
//  6 pump island / dispensers     7 wash bay (car / truck wash)
//  8 pylon / price sign           9 pole light
//  10 abandoned vehicle          11 parking / truck stall marking
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    // entrance + pylon at the SOUTH (on the street); store at the back, fuel + rigs in the forecourt.
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    function scatter(x0,y0,x1,y1,onto,code,dens){ for(var k=0;k<(x1-x0)*(y1-y0)*dens;k++){ var tx=x0+Math.floor(r()*(x1-x0)),ty=y0+Math.floor(r()*(y1-y0)); if(get(tx,ty)===onto)set(tx,ty,code); } }

    // ---- BASE: the whole lot is drivable FORECOURT asphalt, desert only at the very margins ----
    G.rect(0,0,W-1,H-1,0);
    G.rect(6,8,W-7,H-8,1);

    // ---- STORE / DINER at the back (north), enterable ----
    G.rect(44,12,86,27,2);
    for(x=46;x<=84;x+=4) set(x,30,11);                                    // customer parking stalls in front of the store

    // ---- FUEL CANOPY (overhead, on columns) over the CAR PUMP ISLANDS, center-left ----
    var cx0=26,cx1=66,cy0=44,cy1=64;                                      // canopy footprint (open to the south for drive-in)
    G.hbar(cx0,cx1,cy0,4,2);                                              // the front roof lip you see in ¾ view
    G.vbar(cy0,cy1,cx0,4,1); G.vbar(cy0,cy1,cx1,4,1);                     // side roof beams (south stays OPEN — drive under)
    [[cx0,cy0],[cx1,cy0],[cx0,cy1],[cx1,cy1],[46,cy0],[46,cy1]].forEach(function(p){ set(p[0],p[1],4); }); // support columns
    for(var px=34; px<=58; px+=14){ G.rect(px,50,px+1,60,6);             // pump island (raised curb)
      set(px,51,6); set(px+1,53,6); set(px,57,6); set(px+1,59,6); }       // dispensers on the island

    // ---- WASH BAY on the west (drive-through), enterable ----
    G.rect(10,44,22,66,7); for(y=45;y<=65;y++) set(16,y,1);              // wash building with a through-lane

    // ---- BIG-RIG PARKING: long pull-through stalls on the east, wide lanes between (a truck stop) ----
    for(var sx=94; sx<=114; sx+=8){ for(y=40;y<=92;y++) set(sx,y,11); }   // long truck-stall stripes
    // ---- PYLON PRICE SIGN at the south street corner (tall) ----
    G.rect(16,112,19,120,8);

    // ---- dead detail: pole lights, abandoned cars + rigs, brush/rubble, weeds ----
    [[30,38],[80,40],[100,36],[40,90],[88,96]].forEach(function(p){ set(p[0],p[1],9); }); // pole lights
    // abandoned vehicles — cars (2x3) at the pumps/lot, big rigs (3x8) in the pull-through stalls
    [[34,53],[62,72]].forEach(function(p){ G.rect(p[0],p[1],p[0]+1,p[1]+2,10); });        // cars
    [[96,44],[104,66],[112,50]].forEach(function(p){ G.rect(p[0],p[1],p[0]+1,p[1]+7,10); }); // big rigs in the rig stalls
    scatter(8,10,W-8,H-10,1,3,0.02);                                     // rubble/weeds through the cracked forecourt
    scatter(1,1,6,H-2,0,3,0.05); scatter(W-7,1,W-2,H-2,0,3,0.05);        // dead brush at the desert margins

    // ---- ENTRANCE / EXIT off the SOUTH street (rotated to the real street by the kit) ----
    var gx=W>>1;
    for(i=-4;i<=4;i++)set(gx+i,H-1,5);
    for(y=H-1;y>=H-8;y--)for(x=-3;x<=3;x++){ var c=g[y][gx+x]; if(c===0||c===3)set(gx+x,y,1); } // drive from the street onto the forecourt
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

  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#6f665a',3:'#4a4030',4:'#8f8a82',5:'#c79a3f',6:'#9a5a3a',
    7:'#5a5f63',8:'#b0863a',9:'#8f8676',10:'#55555f',11:'#c9c1aa'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt at the parcel edge (setback)'},
    1:{name:'forecourt / drive asphalt',kind:'drive',act1:'cracked forecourt + entry/exit lanes — the drivable apron cars pull across to the pumps'},
    2:{name:'building (store / diner)',kind:'building',act1:'the boarded convenience store + diner, dead coolers, faded signage', enter:'store interior: registers + coolers + aisles up front, a small diner + back stockroom behind'},
    3:{name:'dead brush / rubble', kind:'tree-dead', act1:'tumbleweed + spalled-concrete rubble at the cracked margins', solid:false},
    4:{name:'fuel canopy',        kind:'overhead',   act1:'the fuel canopy roof on its columns — steel sagging, panels torn, the lights dead (you drive/walk UNDER it)'},
    5:{name:'gate / entrance',    kind:'gate',       act1:'the drive entrance/exit off the street, amber curb'},
    6:{name:'pump island / dispensers',kind:'prop',  act1:'a raised pump island, dispensers dry + rusted, hoses cracked, screens dead', solid:true},
    7:{name:'wash bay (car / truck wash)',kind:'building',act1:'the wash bay, doors seized, brushes rotted, the drive-through lane silted', enter:'wash-bay interior: the wash tunnel + the equipment room off the side'},
    8:{name:'pylon / price sign', kind:'structure',  act1:'the tall pylon price sign at the street, panels blank + cracked, brand dead'},
    9:{name:'pole light',         kind:'prop',       act1:'a forecourt pole light, head shattered, dark'},
    10:{name:'abandoned vehicle', kind:'vehicle',    act1:'a car or big rig left at a pump / in a stall, tyres flat, dust-caked'},
    11:{name:'parking / truck stall marking',kind:'marking',act1:'faded stall paint — customer parking + the long pull-through big-rig stalls'}
  };
  var NOTES={
    summary:'A dead highway truck stop / gas station — an overhead fuel canopy on columns over dry rusted pump islands, a boarded store + diner, a dead wash bay, long pull-through big-rig parking, a blank price pylon, all on a cracked drivable forecourt.',
    reference:['Gas station + fuel-station site-plan guides (plan7architect, Scottsdale gas-station design guidelines, architecture4design petrol stations, Venture Fuels c-store layouts): a big overhead CANOPY on columns shelters the PUMP ISLANDS (islands ~12-20ft wide, ≥24ft between for maneuvering); a CONVENIENCE STORE / diner attaches; a WASH bay sits near the exit to avoid backups; separate entry/exit lanes feed a drivable forecourt (≥24ft access); a tall PYLON PRICE SIGN faces the street; canopy + pole lights cover the site. A TRUCK STOP adds long pull-through big-rig parking. FUEL is the post-apocalypse scarcity currency, so a dead fuel stop is core Bohemia.'],
    layout:['The whole lot is a cracked drivable FORECOURT (desert only at the very margins); entry/exit is off the south street.',
      'A CONVENIENCE STORE + diner sits at the back (north) with customer parking stalls in front of it.',
      'The FUEL CANOPY (an overhead roof on columns, open to the south so you drive in) shelters the CAR PUMP ISLANDS center-left; a WASH bay with a drive-through lane sits on the west.',
      'Long pull-through BIG-RIG stalls line the east; a tall PYLON price sign stands at the south street corner; pole lights, abandoned cars + rigs, and rubble litter the dead forecourt.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the entry/exit is on the primary street; the whole forecourt (code 1) is the drivable surface (a car pulls in off the curb, crosses to any pump/stall, and out) reachable in any placement (K.driveReachFromStreet). Corner side streets get a pedestrian gate.',
    layering:'GROUND plane (drive/walk, flat): the forecourt asphalt (1, drive) + the stall markings (11), desert (0). OVERHEAD (drawn ABOVE, you pass UNDER it): the fuel CANOPY (4) — its roof floats over the pumps on columns, the forecourt runs under it. STRUCTURES (¾ front face, solid, ENTERABLE): the store/diner (2 -> store interior), the wash bay (7 -> wash-bay interior); the PYLON sign (8, tall, solid). PROPS (solid, weave between): the pump islands (6, dispensers on a raised curb), pole lights (9), abandoned vehicles (10). PORTALS: the gate (5). The canopy is the one thing you go UNDER; everything else you drive around or enter.',
    decisions:['Act-1 DEAD: dry rusted pumps, a sagging torn canopy with dead lights, a blank cracked price pylon, a boarded store, a seized wash, abandoned cars + rigs, cracked forecourt. No power, no fuel flowing (the fuel itself is a scarcity-economy resource Paolo rules).',
      'Filed COMMERCIAL as a truckstop (retail fuel + convenience + parking) — the taxonomy home for a fuel stop. Zero purple. No brand names/logos on the pylon or store (Paolo\'s to author if ever) — they read dead.',
      'Uses the OVERHEAD layer for the canopy (the layering law\'s pass-under case) — the forecourt stays drivable under the roof.',
      'Research-first (per the playbook): built from real gas-station + truck-stop site plans, not memory.']
  };
  K.register('truckstop', { generate:generate, body:function(c){return c===2||c===7;}, category:'commercial', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaTruckstop=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
