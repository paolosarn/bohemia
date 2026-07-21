// BOHEMIA FIRE STATION (7/20/26). CIVIC, on the DISTRICT KIT. Research-first (fire-station design
// standards — RRM industry standards, Sherer Architects apparatus-bay layout, US Army Corps
// standard fire-station design, Fire Apparatus Magazine): a row of APPARATUS BAYS (14-18ft doors)
// opens onto a big concrete APRON with guideline stripes (the drive-through layout is the safety
// gold standard — enter one side, exit the other, no backing); a HOSE / DRYING TOWER; living +
// admin quarters; staff PARKING (~2x the on-shift crew). Act-1 DEAD: rusted engines dead on the
// apron, a bleached hose tower, boarded quarters, cracked apron, a dead flagpole. Street-aware +
// drivable (the apron + parking is the car surface, the rigs pull straight out to the street).
// Full dossier + layering. Bold: the RED ENGINES on the light apron are the hero read.
// LEGEND:
//  0 desert dead-ground          1 concrete apron / drive (DRIVABLE)
//  2 building (station quarters)  3 dead landscaping
//  4 dead lawn (edge strips)      5 gate / entrance
//  6 apparatus bay door           7 hose / drying tower
//  8 fire engine (rig)            9 pole light
//  10 abandoned staff car        11 white marking (apron stripes / stalls)   12 flagpole / plaza
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    // WALKABLE-LAND LAW rebuild (Paolo 7/20 "the firehouse is so tiny... can't mostly be a parking
    // lot"): a BIG station building + a real TRAINING GROUND (drill tower, burn building, training
    // yard) dominate the plot; the apron is just the bay frontage. Content > pavement.
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }

    // ---- BASE: dead lawn; desert only at the margins ----
    G.rect(0,0,W-1,H-1,0);
    G.rect(5,7,W-6,H-6,4);

    // ---- THE STATION: a BIG 2-storey block (dayroom / dorm / kitchen / offices) + the bay wing ----
    G.rect(8,10,64,44,2);                                                 // main station block (the mass)
    for(x=12;x<=60;x+=5) set(x,10,11);                                    // parapet / window line (2-storey read)
    for(y=14;y<=40;y+=6) set(8,y,11);
    G.rect(8,44,64,56,2);                                                 // the apparatus BAY wing across the front
    for(var b=0;b<4;b++){ var bx=12+b*13; G.rect(bx,56,bx+10,57,6); }     // 4 roll-up bay doors on the wing face

    // ---- APRON in front of the bays (SMALL — just the rig frontage) + RED ENGINES staged ----
    G.rect(8,58,64,82,1);
    for(b=0;b<4;b++){ var ex=13+b*13; if(b!==2){ G.rect(ex,60,ex+8,74,8); set(ex,61,11); set(ex+8,61,11); } } // 3 rigs, bay 2 empty
    for(var s2=0;s2<4;s2++){ var sx=17+s2*13; for(y=76;y<=80;y++) set(sx,y,11); } // short guideline stripes

    // ---- THE TRAINING GROUND (east) — this is what fills the land with PURPOSE, not empty apron ----
    G.rect(74,52,120,104,13);                                             // the concrete TRAINING YARD (content, not drive)
    G.rect(80,10,98,50,7);                                                // the DRILL / HOSE TOWER (tall — the hero)
    for(y=14;y<=46;y+=6){ set(81,y,11); set(97,y,11); }                   // tower floor lines
    G.rect(102,10,120,40,2);                                              // the BURN BUILDING (concrete training house)
    for(x=104;x<=118;x+=4) set(x,40,6);                                   // its scorched training doors
    G.rect(78,58,82,102,11); G.rect(112,58,116,102,11);                  // HOSE RACKS lining the yard
    G.rect(90,66,99,78,10); G.rect(96,86,105,98,10);                      // wreck cars for extrication drills
    for(i=0;i<10;i++){ var cx=84+Math.floor(r()*30), cy=58+Math.floor(r()*44); if(get(cx,cy)===13)set(cx,cy,11); } // drill cones/marks

    // ---- STAFF PARKING (SMALL, SW) + an abandoned crew car, tied to the entrance lane ----
    G.rect(8,100,44,116,1);
    for(x=12;x<=40;x+=5){ set(x,104,11); set(x,105,11); set(x,112,11); set(x,113,11); }
    G.rect(14,102,15,107,10);
    G.rect(44,110,68,114,1);                                             // connector lane: parking -> the entrance pull-out

    // ---- POLE LIGHTS, FLAGPOLE, a little dead landscaping ----
    [[10,58],[66,58],[10,116],[72,104],[118,104]].forEach(function(p){ set(p[0],p[1],9); });
    set(69,20,12);
    for(i=0;i<14;i++){ var tx=6+Math.floor(r()*4), ty=8+Math.floor(r()*(H-16)); if(get(tx,ty)===4)set(tx,ty,3); }
    for(i=0;i<14;i++){ var tx2=W-6+Math.floor(r()*4), ty2=8+Math.floor(r()*(H-16)); if(get(tx2,ty2)===4)set(tx2,ty2,3); }

    // ---- ENTRANCE / PULL-OUT off the SOUTH street (rotated to the real street by the kit) ----
    var gx=W>>1;
    for(i=-5;i<=5;i++)set(gx+i,H-1,5);
    G.rect(gx-4,82,gx+4,H-1,1);                                           // the apron pull-out lane to the street
    for(y=H-1;y>=82;y--)for(x=-4;x<=4;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4||c===13)set(gx+x,y,1); }
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

  var PALETTE={0:'#1c1a15',1:'#565248',2:'#7a6f5c',3:'#3a4526',4:'#49512e',5:'#c79a3f',6:'#8a2f22',
    7:'#6a6358',8:'#c0392b',9:'#8f8676',10:'#55555f',11:'#c9c1aa',12:'#b0863a',13:'#625d51'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt at the lot edge (setback)'},
    1:{name:'concrete apron / drive',kind:'drive',   act1:'the cracked concrete apparatus apron + drive — the rigs stage here and pull straight to the street (car-drivable)'},
    2:{name:'building (station quarters)',kind:'building',act1:'the station — living quarters + admin, windows boarded, the bell dead', enter:'station interior: the apparatus floor up front, the day room + dorm + kitchen + offices behind'},
    3:{name:'dead landscaping',   kind:'tree-dead',  act1:'a dead shrub / tree at the lot edge', solid:false},
    4:{name:'dead lawn',          kind:'ground',     act1:'the dead lawn edging the apron'},
    5:{name:'gate / entrance',    kind:'gate',       act1:'the apron pull-out onto the street, amber curb, the rigs launched from here'},
    6:{name:'apparatus bay door', kind:'structure',  act1:'a roll-up apparatus bay door on the station front, paint peeling, glass gone'},
    7:{name:'hose / drying tower',kind:'structure',  act1:'the hose-drying + training tower, tall, concrete bleached, ladder rusted'},
    8:{name:'fire engine (rig)',  kind:'vehicle',    act1:'a fire engine dead on the apron, red faded to rust, tyres flat, pump seized', solid:true},
    9:{name:'pole light',         kind:'prop',       act1:'an apron pole light, head dark'},
    10:{name:'abandoned staff car',kind:'vehicle',   act1:'a crew car left in the staff stalls, dust-caked'},
    11:{name:'white marking',     kind:'ground',     act1:'faded white paint — the apron guideline stripes + the staff parking stalls'},
    12:{name:'flagpole / plaza',  kind:'prop',       act1:'the empty flagpole at the station entry, halyard slapping'},
    13:{name:'training yard',     kind:'ground',     act1:'the concrete drill / training yard — hose racks, wreck cars for extrication, drill marks, all weathered'}
  };
  var NOTES={
    summary:'A dead fire station — a row of apparatus bays opening onto a big concrete apron with red engines dead on it, a hose/drying tower, the boarded quarters, staff parking, guideline stripes leading the rigs to the street pull-out.',
    reference:['Fire-station design standards (RRM industry standards, Sherer Architects apparatus-bay layout, US Army Corps standard fire-station design, Fire Apparatus Magazine): APPARATUS BAYS with 14-18ft doors open onto a concrete APRON; the DRIVE-THROUGH layout (enter one side, exit the other, no backing) is the safety gold standard; guideline STRIPES extend onto the apron to align the rig; a HOSE / DRYING TOWER preserves the hoses; parking is ~2x the on-shift crew; the pedestrian path must not cross the apparatus response path.'],
    layout:['The lot is a big light CONCRETE APRON / drive (dead lawn edging it, desert at the margins) — the rigs\' operational surface.',
      'The STATION quarters + admin block sits at the back with the roll-up APPARATUS BAY doors on its front; a HOSE / DRYING TOWER stands beside it (east).',
      'RED fire ENGINES sit dead nosed out of the bays (one bay empty); faded guideline STRIPES run down the apron to line the rigs up.',
      'Staff PARKING is marked on the SW apron (a couple of abandoned crew cars); pole lights ring the apron; a flagpole stands in the entry lawn median.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the apron pulls straight out onto the primary street (the rigs launch from here — no backing); the whole apron + drive + parking (code 1) is one connected drivable surface reachable from the curb in any placement (K.driveReachFromStreet). Corner side streets get a pedestrian gate. Foot paths (the crew) are kept off the apparatus response path.',
    layering:'GROUND plane (drive/walk, flat): the concrete apron/drive (1, drive) + its white stripes/stalls (11), the dead lawn (4), desert (0). STRUCTURES (¾ front face, solid): the station quarters (2, ENTERABLE -> apparatus floor + day room/dorm/offices), the apparatus BAY doors (6, on the building front), the HOSE TOWER (7, tall). PROPS / VEHICLES (solid): the fire ENGINES (8, the red hero), abandoned staff cars (10), pole lights (9), the flagpole (12). PORTALS: the gate (5). The station + tower are the vertical mass; the red rigs sit on the broad light apron you drive across.',
    decisions:['Act-1 DEAD: rigs faded to rust with flat tyres + seized pumps, a bleached hose tower, boarded quarters, cracked apron, a dead flagpole, the bell silent. No crew (LIFE places agents later).',
      'Civic category (firestation). Zero purple. No department name/number (Paolo\'s to author if ever).',
      'The apron is the light hero surface (drive-code 1) so the RED engines pop — the deliberate inversion of the usual dark-asphalt base, for a clean fire-station read.',
      'Drive-through bay logic honored (pull straight out, no backing) per the safety standard.',
      'Research-first (per the playbook): built from real fire-station design standards, not memory.']
  };
  K.register('firestation', { generate:generate, body:function(c){return c===2;}, category:'civic', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaFirestation=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
