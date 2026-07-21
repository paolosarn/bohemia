// BOHEMIA SALVAGE YARD / BONEYARD (7/21/26). INDUSTRIAL, on the DISTRICT KIT. Research-first (auto-
// salvage / wrecking-yard guides — Wikipedia wrecking yard, TRUiC junkyard, salvage-yard requirements):
// vehicles are towed in and arranged in ROWS + STACKED, organized by make, on a dirt yard; a mobile
// CRUSHER / baler + a claw CRANE process bodies; a small OFFICE + parts building + a SCALE at the gate;
// the whole site FENCED. Piles of tires + scrap. This is already a dead-world place, pure Bohemia — the
// salvage economy's larder. Act-1: rusted rows, a dead crane, oil-stained dirt. Street-aware + drivable
// (dirt lanes reach every row; content — the cars/piles/machines — dominates). Full dossier + layering.
// LEGEND:
//  0 desert dead-ground          1 dirt drive lane (DRIVABLE)
//  2 building (office/parts)      3 scrap / tire pile
//  4 dirt yard ground             5 gate
//  6 wrecked car (rust)           7 crushed-car stack
//  8 crane / crusher              9 pole light
//  10 oil / fluid stain          11 marking (scale/aisle)   12 perimeter fence
//  13 wrecked car (faded blue)   14 wrecked car (faded white)
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    var CAR=[6,13,14];

    // ---- BASE: the dirt YARD, fenced; desert at the margins ----
    G.rect(0,0,W-1,H-1,0);
    G.rect(6,8,W-7,H-7,4);
    G.frame(12);

    // ---- OFFICE + PARTS building + the SCALE at the entrance (south) ----
    G.rect(10,104,40,118,2);                                             // office / parts counter
    G.rect(46,110,66,118,11);                                            // the truck SCALE pad at the gate

    // ---- ROWS of WRECKED CARS across the yard (organized by make), dirt lanes between ----
    for(var ry=14; ry<=92; ry+=13){
      for(var cx=10; cx<=104; cx+=8){
        if(r()<0.12) continue;                                          // a gap (car already pulled)
        var cc=CAR[Math.floor(r()*3)];
        G.rect(cx,ry,cx+5,ry+8,cc);                                     // a wrecked car (roof/body from above)
        set(cx+1,ry+1,10); set(cx+4,ry+7,10);                          // rust/oil detail
      }
    }
    // ---- a WALL of STACKED CRUSHED cars along the east edge (flattened, layered) ----
    G.rect(110,14,118,100,7); for(y=14;y<=100;y+=3) G.rect(110,y,118,y,11); // stack layers (each a flattened car)

    // ---- the CLAW CRANE / CRUSHER (the hero machine), mid-yard ----
    G.rect(92,52,106,66,8);                                             // the crusher/baler body
    G.rect(98,40,101,52,8);                                             // the crane mast
    for(i=0;i<8;i++) set(98-i,40+i,8);                                  // the boom reaching over the pile
    G.rect(90,66,94,72,8);                                              // the claw grapple

    // ---- TIRE + SCRAP piles, oil stains, pole lights ----
    for(i=0;i<9;i++){ var px=12+Math.floor(r()*100), py=14+Math.floor(r()*100); if(get(px,py)===4){ G.disc(px,py,2,3); } } // scrap/tire piles
    for(i=0;i<26;i++){ var ox=8+Math.floor(r()*104), oy=12+Math.floor(r()*104); if(get(ox,oy)===4&&r()<0.5)set(ox,oy,10); } // oil-stained dirt
    [[9,14],[106,14],[9,100],[70,100]].forEach(function(p){ set(p[0],p[1],9); });

    // ---- ENTRANCE off the SOUTH street (rotated to the real street by the kit) ----
    var gx=W>>1;
    G.rect(gx-3,96,gx+3,H-1,1);                                          // the entrance dirt lane past the scale
    for(y=H-1;y>=96;y--)for(x=-3;x<=3;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4||c===12||c===11)set(gx+x,y,1); }
    // dirt lanes down each row-gap so a car/loader reaches every row from the entrance lane
    for(var ay=22; ay<=100; ay+=13){ for(x=8;x<=108;x++){ if(get(x,ay)===4||get(x,ay)===10)set(x,ay,1); } }
    G.rect(8,100,120,103,1);                                            // a cross lane tying the rows to the gate
    G.rect(7,14,9,103,1); G.rect(106,14,108,103,1);                     // west + east spines tying every row-lane to the cross lane
    for(i=-3;i<=3;i++)set(gx+i,H-1,5);                                  // the street gate LAST, so the lane can't erase it
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

  var PALETTE={0:'#1c1a15',1:'#4a4438',2:'#6a5f50',3:'#3f382c',4:'#565040',5:'#c79a3f',6:'#8a5040',
    7:'#453d34',8:'#c8a03a',9:'#8f8676',10:'#2a2620',11:'#c9c1aa',12:'#6a6a72',13:'#4a5560',14:'#8a857a'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt outside the fence (setback)'},
    1:{name:'dirt drive lane',    kind:'drive',      act1:'the rutted dirt lane between the car rows — a loader/car reaches every row (drivable)'},
    2:{name:'building (office / parts)',kind:'building',act1:'the salvage office + parts counter, window smashed, ledger gone', enter:'office interior: the parts counter + a wall of pull tickets up front, a parts shelving room behind'},
    3:{name:'scrap / tire pile',  kind:'tree-dead',  act1:'a heap of bald tires / twisted scrap metal', solid:true},
    4:{name:'dirt yard ground',   kind:'ground',     act1:'the oil-dark packed-dirt yard the wrecks sit on'},
    5:{name:'gate',               kind:'gate',       act1:'the salvage gate off the street, amber curb, chain hanging'},
    6:{name:'wrecked car (rust)', kind:'vehicle',    act1:'a wrecked car in the row, rusted to oxide-red, stripped for parts', solid:true},
    7:{name:'crushed-car stack',  kind:'structure',  act1:'a wall of flattened, crushed cars stacked for the baler', solid:true},
    8:{name:'crane / crusher',    kind:'structure',  act1:'the claw crane + mobile crusher, boom seized, yellow paint faded', solid:true},
    9:{name:'pole light',         kind:'prop',       act1:'a yard pole light, head dark'},
    10:{name:'oil / fluid stain', kind:'ground',     act1:'oil + fluid stained into the dirt under the wrecks', solid:false},
    11:{name:'marking (scale/aisle)',kind:'marking', act1:'the truck-scale pad + faded aisle/row markers'},
    12:{name:'perimeter fence',   kind:'structure',  act1:'the salvage-yard security fence, wire + barbed top sagging', solid:true},
    13:{name:'wrecked car (faded blue)',kind:'vehicle',act1:'a wrecked car in the row, paint faded to chalky blue, stripped', solid:true},
    14:{name:'wrecked car (faded white)',kind:'vehicle',act1:'a wrecked car in the row, paint sun-bleached to grey-white, stripped', solid:true}
  };
  var NOTES={
    summary:'A dead auto-salvage yard / boneyard — rows of stripped wrecked cars on an oil-dark dirt yard, a wall of crushed cars, a claw crane + crusher, a small office + truck scale at the gate, tire + scrap piles, all fenced. The salvage economy\'s larder.',
    reference:['Auto-salvage / wrecking-yard guides (Wikipedia wrecking yard, TRUiC junkyard, salvage-yard requirements): vehicles towed in + arranged in ROWS and STACKED (organized by make) on a dirt yard; a mobile CRUSHER / baler + a CRANE / loader process + move bodies; a small OFFICE + parts counter + a truck SCALE at the entrance; the whole site FENCED + lit; tire + scrap piles.'],
    layout:['The yard is oil-dark packed dirt inside a security fence (desert at the margins).',
      'ROWS of stripped WRECKED CARS (rust / faded blue / faded white, organized by make) fill the yard with dirt lanes between them.',
      'A WALL of crushed, flattened cars stacks along the east edge; the CLAW CRANE + CRUSHER (the hero machine) works mid-yard, its boom reaching over the pile.',
      'A small OFFICE + parts counter + the truck SCALE sit at the south gate; tire + scrap piles, oil stains, and pole lights dot the yard.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the gate is on the primary street, past the scale; DIRT LANES (code 1) run down every row-gap + a cross lane, so a loader/car reaches every row from the entrance (K.driveReachFromStreet). WALKABLE-LAND: the cars + piles + machines + buildings dominate; the lanes are just the row-gaps. Corner side streets get a pedestrian gate.',
    layering:'GROUND plane (drive/walk, flat): the dirt yard (4) + oil stains (10), the dirt lanes (1, drive), the scale/aisle markings (11), desert (0). STRUCTURES (¾ front face, solid): the office/parts building (2, ENTERABLE), the crushed-car STACK (7), the CRANE / crusher (8, the hero machine), the perimeter FENCE (12), tire/scrap piles (3). VEHICLES (solid, weave between): the rows of WRECKED CARS (6 / 13 / 14). PROPS: pole lights (9). PORTALS: the gate (5). The wrecks + stacks + crane are the mass; you drive the dirt row-lanes between them.',
    decisions:['Act-1 world-native: the boneyard is ALREADY dead + rusted — rows of stripped wrecks, a seized crane, crushed stacks, oil-black dirt. This is the salvage economy\'s larder (LIFE / ECONOMY pull parts + scrap here — Paolo + the economy rule the loot).',
      'Industrial category (boneyard). Zero purple. Cars carry no plates/make canon (generic wrecks).',
      'WALKABLE-LAND LAW honored: cars/piles/machines/buildings dominate; dirt lanes are just row-gaps.',
      'Research-first (per the playbook): built from real wrecking-yard site layouts, not memory.']
  };
  K.register('boneyard', { generate:generate, body:function(c){return c===2;}, category:'industrial', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaBoneyard=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
