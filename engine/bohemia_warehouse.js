// BOHEMIA WAREHOUSE — MULTI-TENANT FLEX/LIGHT-INDUSTRIAL PARK (7/22/26). INDUSTRIAL, on the
// DISTRICT KIT. Research-first: real Vegas flex/business parks (Sunrise Manor, the airport
// industrial corridor) — NOT one single big-box DC (that's already bohemia_industrial.js's
// typology). Instead: a ROW of mid-size tenant units (5,000-15,000 sqft each) sharing a party
// wall, each with its OWN roll-up dock door + small office bay + a couple reserved parking
// stalls out front, along an internal drive aisle, plus a shared truck court along the back for
// the units that need dock access. Cheap, gritty, many-small-businesses texture — distinct from
// the single-tenant DC. Act-1 DEAD: half the units' roll-up doors are open/looted, a few units
// burned, weeds through the truck court, abandoned cars/pallets. Street-aware + drivable;
// buildings + docks dominate (WALKABLE-LAND). Full dossier + layering.
// LEGEND:
//  0 desert  1 street/drive (DRIVABLE)  2 tenant unit  3 weed/brush  4 lot asphalt  5 gate
//  6 dock door (portal)  7 office bay  8 burned unit  9 pole light  10 abandoned car
//  11 stall marking  12 fence  13 loose pallets  14 dumpster
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;
  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    // one TENANT UNIT: a party-wall bay, front office window strip, a roll-up dock at the back,
    // a couple reserved stalls out front.
    function unit(ux,uy,uw,depth,idx){
      if(r()<0.12){ G.rect(ux,uy,ux+uw,uy+depth,8); return; }             // a burned-out bay
      G.rect(ux,uy,ux+uw,uy+depth,2);                                     // the unit box
      G.rect(ux+1,uy,ux+Math.max(1,Math.floor(uw*0.4)),uy+2,7);          // office bay, front corner
      set(ux+Math.floor(uw/2),uy+depth,6);                                // roll-up dock, back face
      for(var ci=0;ci<2;ci++) set(ux+2+ci*2,uy-2,11);                     // reserved stalls out front
      if(r()<0.4) set(ux+3,uy+depth+1,13);                                // loose pallets behind the dock
    }
    // ---- BASE: lot asphalt, fenced; desert at the margins ----
    G.rect(0,0,W-1,H-1,0); G.rect(6,8,W-7,H-7,4); G.frame(12);
    // ---- two ROWS of tenant units facing an internal drive aisle, dock-backed to a shared
    // truck court behind each row ----
    var UW=13, DEPTH=16, count=7;
    for(i=0;i<count;i++) unit(10+i*UW, 20, UW-2, DEPTH, i);
    G.rect(6,38,W-7,44,1);                                                // drive aisle, row 1 front
    for(i=0;i<count;i++) unit(10+i*UW, 68, UW-2, DEPTH, i+count);
    G.rect(6,86,W-7,92,1);                                                // drive aisle, row 2 front
    G.rect(6,52,W-7,58,4);                                                // shared truck court between the rows' docks
    // ---- spine street linking both aisles to the gate — routed through the CLEAR east margin
    // (x=100-121, past the last unit at x=99) so it never has to cross a building, not through
    // the row's own footprint ----
    var gx=108;
    G.rect(gx-3,92,gx+3,H-1,1);
    for(y=H-1;y>=38;y--)for(x=-3;x<=3;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4||c===11||c===12)set(gx+x,y,1); }
    for(i=-3;i<=3;i++)set(gx+i,H-1,5);
    for(i=0;i<40;i++){ var wx=8+Math.floor(r()*112), wy=10+Math.floor(r()*112); if(get(wx,wy)===4&&r()<0.4)set(wx,wy,3); }
    [[10,38],[100,38],[10,86],[100,86]].forEach(function(p){ set(p[0],p[1],9); });
    set(101,90,14);                                                       // a dumpster near the entrance
    return g;
  }
  function generate(seed,opts){ opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:14});
    var g=res.g; return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2||v===7;})}; }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }
  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#726a5c',3:'#3a4520',4:'#524c3e',5:'#c79a3f',6:'#8a7a4a',
    7:'#5c6068',8:'#332a26',9:'#8f8676',10:'#55555f',11:'#c9c1aa',12:'#6a6a72',13:'#8a7050',14:'#463f36'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt outside the fence (setback)'},
    1:{name:'street / drive',     kind:'drive',      act1:'the cracked internal park drive / driveway aisle (car-drivable)'},
    2:{name:'tenant unit',        kind:'building',   act1:'a flex/light-industrial bay, tilt-up concrete, sun-bleached, half the units looted', enter:'flex unit interior: a small front office, a bare warehouse bay behind it'},
    3:{name:'weed / brush',       kind:'tree-dead',  act1:'weeds + tumbleweed through the cracked lot', solid:false},
    4:{name:'lot asphalt',        kind:'ground',     act1:'the park lot / truck court asphalt, faded striping'},
    5:{name:'gate',               kind:'gate',       act1:'the park entrance off the street, amber curb'},
    6:{name:'dock door',          kind:'portal',     act1:'a roll-up dock door, half open or torn off', enter:'the bay behind the dock'},
    7:{name:'office bay',         kind:'building',   act1:'the tenant\'s front office window strip, glass smashed', solid:true},
    8:{name:'burned unit',        kind:'building',   act1:'a burned-out tenant bay — charred shell, roof collapsed', solid:true},
    9:{name:'pole light',         kind:'prop',       act1:'a park pole light, head dark'},
    10:{name:'abandoned car',     kind:'vehicle',    act1:'a car dead in a reserved stall, tyres flat', solid:true},
    11:{name:'stall marking',     kind:'marking',    act1:'faded reserved-parking stall paint'},
    12:{name:'fence',             kind:'structure',  act1:'the park perimeter fence, chain-link sagging', solid:true},
    13:{name:'loose pallets',     kind:'prop',       act1:'a stack of broken pallets behind a dock', solid:true},
    14:{name:'dumpster',          kind:'prop',       act1:'a rusted dumpster near the entrance', solid:true}
  };
  var NOTES={
    summary:'A dead multi-tenant flex/light-industrial park — two rows of party-wall tenant bays (roll-up dock at back, small office at front) on an internal drive aisle, a shared truck court, some units burned. Distinct from the single-big-box DC (bohemia_industrial.js): many small businesses, not one tenant.',
    reference:['Real Vegas flex/business parks (Sunrise Manor, the airport industrial corridor): rows of mid-size tenant units (5,000-15,000 sqft) sharing party walls, each with its own roll-up dock + small front office + a couple reserved stalls, on an internal drive aisle; a shared truck court serves the dock side.'],
    layout:['Two rows of 7 tenant units each face an internal drive aisle, dock doors backed to a shared truck court between the rows.',
      'Each unit has a front office bay window strip, a rear roll-up dock, and 2 reserved stalls; ~12% are burned-out shells.',
      'A spine street ties both aisles to the south gate; weeds and dead pole lights through the lot.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the entrance gate is on the primary street; a spine street reaches both drive aisles from the gate (code 1, K.driveReachFromStreet). WALKABLE-LAND: the two building rows + docks + office bays dominate; the drive aisles/truck court are the connective ladder.',
    layering:'GROUND plane (walk/drive, flat): lot asphalt (4), the aisles/street (1, drive), desert (0). STRUCTURES (¾ front face, solid): the tenant units (2, ENTERABLE -> office + bay), the office bays (7), burned units (8), the fence (12). PORTALS: dock doors (6, enterable into the bay), the gate (5). PROPS/VEHICLES (solid): loose pallets (13), dumpster (14), abandoned cars (10). PROPS: pole lights (9), weeds (3). The two unit rows are the mass; you drive the aisle-and-spine ladder between them.',
    decisions:['Act-1 DEAD: roll-up doors torn/open, ~12% units burned, weeds through the truck court, dead cars in reserved stalls. Who squats/salvages here is faction/LIFE canon (Paolo\'s).',
      'INDUSTRIAL category, distinct typology from bohemia_industrial.js (one big DC) — many small tenant bays, not one tenant.',
      'WALKABLE-LAND honored: two building rows + docks + offices dominate; aisles/truck court are the ladder.',
      'Research-first (per the playbook): built from real flex/business-park site plans, not memory.']
  };
  K.register('warehouse', { generate:generate, body:function(c){return c===2;}, category:'industrial', palette:PALETTE, legend:LEGEND, notes:NOTES });
  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API; root.BohemiaWarehouse=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
