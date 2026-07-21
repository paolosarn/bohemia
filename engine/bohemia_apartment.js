// BOHEMIA APARTMENT COMPLEX (7/21/26). RESIDENTIAL, on the DISTRICT KIT. Closes the
// SUBURB_FAMILY [PENDING] gap flagged by the LANDLOCKED DISTRICT LAW (Paolo 7/21:
// "suburb or apt complex"). Research-first (Vegas garden-apartment norm — Sun Belt low-rise
// multifamily, exterior breezeway-stair access, not double-loaded interior corridors): 3 parallel
// 2-3 STORY apartment buildings on internal drive aisles, EXTERIOR STAIRS at each building's
// midpoint (breezeway access, no elevator), a DRAINED POOL + small leasing office/clubhouse near
// the entrance, carports along one side of each row, a mailbox kiosk (CBU) and dumpster
// enclosures. Act-1 DEAD: pool drained + cracked, some units boarded, weeds through the lot,
// abandoned cars. Street-aware + drivable; buildings + amenities dominate (WALKABLE-LAND).
// LEGEND:
//  0 desert  1 street/drive (DRIVABLE)  2 apartment building  3 weed/brush  4 parking asphalt
//  5 gate  6 carport  7 clubhouse/leasing office  8 drained pool  9 pole light  10 abandoned car
//  11 stall marking  12 fence  13 mailbox kiosk  14 dumpster enclosure  15 exterior stair
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;
  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    // one BUILDING ROW: a long apartment block, exterior stairs at 1/3 and 2/3 (breezeway),
    // a carport row along the back, a few boarded units (burned/dark units aren't tracked
    // per-unit at this scale — the whole building reads lived-then-abandoned).
    function row(y0,len,depth){
      G.rect(12,y0,12+len,y0+depth,2);                                  // the building mass
      var s1=12+Math.floor(len*0.33), s2=12+Math.floor(len*0.67);
      G.rect(s1,y0+depth,s1+2,y0+depth+2,15); G.rect(s2,y0+depth,s2+2,y0+depth+2,15); // exterior stairs, front face
      G.rect(12,y0-4,12+len,y0-1,6);                                    // carport row along the front
      for(x=14;x<=10+len;x+=6) if(r()<0.55) set(x,y0-3,10);             // a car under some carport bays
    }
    // ---- BASE: parking asphalt lot, fenced; desert at the margins ----
    G.rect(0,0,W-1,H-1,0); G.rect(6,6,W-7,H-7,4); G.frame(12);
    // ---- three BUILDING ROWS on internal drive aisles ----
    row(16,88,11); G.rect(6,31,W-7,37,1);                                // row 1 + its drive aisle
    row(42,88,11); G.rect(6,57,W-7,63,1);                                // row 2 + its drive aisle
    row(68,88,11); G.rect(6,83,W-7,89,1);                                // row 3 + its drive aisle
    // spine street tying the three aisles together + reaching the gate
    G.rect(6,31,10,89,1);
    // ---- weeds through the lot + pole lights along the aisles ----
    for(i=0;i<70;i++){ var wx=8+Math.floor(r()*112), wy=10+Math.floor(r()*112); if(get(wx,wy)===4&&r()<0.5)set(wx,wy,3); }
    [[16,34],[100,34],[16,60],[100,60],[16,86],[100,86],[16,116],[108,116]].forEach(function(p){ set(p[0],p[1],9); });
    // ---- entrance cluster (south court, densified — the WALKABLE-LAND bar): a FENCED pool
    // deck, a bigger clubhouse, guest carports, striped surface parking, mailbox, dumpsters ----
    G.rect(90,94,120,112,12); G.rect(93,97,117,109,8);                   // pool deck FENCE + the drained pool inside it
    set(90,103,4); set(120,103,4);                                       // a walk-through gap in the deck fence (not a street portal)
    G.rect(26,92,50,108,7);                                              // leasing office / clubhouse, bigger
    G.rect(52,98,64,102,6); for(x=53;x<=63;x+=4) if(r()<0.6) set(x,100,10); // guest carport row beside the clubhouse
    set(56,110,13);                                                      // mailbox kiosk (CBU), off the entrance lane
    G.rect(70,114,73,117,14); G.rect(84,114,87,117,14); G.rect(76,94,79,97,14); // three dumpster enclosures
    for(x=14;x<=24;x+=3) for(y=96;y<=112;y+=6){ set(x,y,11); }            // striped guest-parking stalls, west court
    // ---- ENTRANCE off the SOUTH street (rotated to the real street by the kit): the lane runs
    // ALL the way from row 3's aisle (y=89) down to the gate, so the network actually connects ----
    var gx=64;
    G.rect(gx-3,89,gx+3,H-1,1);
    for(i=-3;i<=3;i++)set(gx+i,H-1,5);
    return g;
  }
  function generate(seed,opts){ opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:14});
    var g=res.g; return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})}; }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }
  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#726a5c',3:'#3a4520',4:'#524c3e',5:'#c79a3f',6:'#6a6a72',
    7:'#5c5648',8:'#2e3a3c',9:'#8f8676',10:'#55555f',11:'#c9c1aa',12:'#6a6a72',13:'#8a7a4a',14:'#463f36',15:'#847c6c'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt outside the fence (setback)'},
    1:{name:'street / drive',     kind:'drive',      act1:'the cracked internal complex drive / driveway aisle (car-drivable)'},
    2:{name:'apartment building', kind:'building',   act1:'a 2-3 story garden apartment block, stucco cracked, most windows dark, some boarded', enter:'garden apartment interior: exterior breezeway stairs up to a shared landing, then a railroad-plan unit off it'},
    3:{name:'weed / brush',       kind:'tree-dead',  act1:'weeds + tumbleweed through the cracked lot', solid:false},
    4:{name:'parking asphalt',    kind:'ground',     act1:'the complex parking lot, faded striping'},
    5:{name:'gate',               kind:'gate',       act1:'the complex entrance off the street, amber curb'},
    6:{name:'carport',            kind:'overhead',   act1:'a metal carport row along the building front (you park/walk UNDER it), sagging'},
    7:{name:'clubhouse',          kind:'building',   act1:'the leasing office / clubhouse, glass fronted, dark inside', solid:true, enter:'small office interior: a front desk + a back room'},
    8:{name:'drained pool',       kind:'water-dead', act1:'a drained pool, cracked plaster shell, dead leaves at the bottom', solid:false},
    9:{name:'pole light',         kind:'prop',       act1:'a complex pole light along the drive aisle, head dark'},
    10:{name:'abandoned car',     kind:'vehicle',    act1:'a car dead under a carport bay, tyres flat', solid:true},
    11:{name:'stall marking',     kind:'marking',    act1:'faded parking-stall paint'},
    12:{name:'fence',             kind:'structure',  act1:'the complex perimeter fence, chain-link sagging', solid:true},
    13:{name:'mailbox kiosk',     kind:'prop',       act1:'a cluster mailbox kiosk (CBU), doors hanging open', solid:true},
    14:{name:'dumpster enclosure',kind:'structure',  act1:'a block-wall trash enclosure, gate off its hinges', solid:true},
    15:{name:'exterior stair',    kind:'structure',  act1:'a breezeway stair to the upper units, rust-streaked', solid:true}
  };
  var NOTES={
    summary:'A dead garden apartment complex — three 2-3 story buildings with exterior breezeway stairs on internal drive aisles, a drained pool + boarded-up clubhouse near the entrance, carports, a mailbox kiosk, dumpster enclosures. Closes the SUBURB_FAMILY gap the LANDLOCKED DISTRICT LAW flagged.',
    reference:['Sun Belt garden-apartment norm (Vegas/Phoenix low-rise multifamily): 2-3 story buildings, EXTERIOR breezeway stair access (no elevator, no interior double-loaded corridor — that\'s a colder-climate/urban typology), buildings arranged in parallel rows on internal drive aisles, a shared pool + leasing office near the entrance, carports, cluster mailboxes, dumpster enclosures.'],
    layout:['Three parallel apartment building rows on internal drive aisles tied by a spine street to the entrance.',
      'Each row has two EXTERIOR STAIR breezeways (no elevator) and a carport row along its front, some carport bays with a dead car.',
      'Near the south entrance: a drained pool, a small clubhouse/leasing office, a mailbox kiosk, and two dumpster enclosures.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the entrance gate is on the primary street; a spine street ties all three internal drive aisles to the gate (code 1 reaches every row, K.driveReachFromStreet). WALKABLE-LAND: the building mass + carports + pool/clubhouse dominate; the drive aisles are the connective ladder.',
    layering:'GROUND plane (walk/drive, flat): parking asphalt (4), the drive aisles/street (1), desert (0), the drained pool (8, not solid — you can walk into the empty basin). OVERHEAD (park/walk UNDER): the carport rows (6). STRUCTURES (¾ front face, solid): the apartment buildings (2, ENTERABLE -> breezeway + unit), the clubhouse (7, ENTERABLE), the exterior stairs (15), dumpster enclosures (14), the fence (12). PROPS/VEHICLES (solid): mailbox kiosk (13), abandoned cars (10). PROPS: pole lights (9), weeds (3). PORTALS: the gate (5). The three building rows are the mass; you drive the aisle-and-spine ladder between them.',
    decisions:['Act-1 DEAD: pool drained + cracked, clubhouse dark, some units boarded, weeds through the lot, dead cars under carports. Who squats/holds units here is faction/LIFE canon (Paolo\'s).',
      'RESIDENTIAL category, joins SUBURB_FAMILY in bohemia_world.js (suburb/gated/estate/apartment) — landlocked interior apartment cells now relay through it exactly like suburb.',
      'EXTERIOR breezeway stairs, not an interior corridor — the correct Sun Belt garden-apartment typology, not a cold-climate mid-rise. Zero purple.',
      'WALKABLE-LAND honored: three building rows + carports + pool/clubhouse dominate; drive aisles are the ladder.',
      'Research-first (per the playbook): built from the real Sun Belt garden-apartment norm, not memory.']
  };
  K.register('apartment', { generate:generate, body:function(c){return c===2;}, category:'residential', palette:PALETTE, legend:LEGEND, notes:NOTES });
  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API; root.BohemiaApartment=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
