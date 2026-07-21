// BOHEMIA SUBSTATION (7/21/26). INFRASTRUCTURE, on the DISTRICT KIT. Research-first (substation design
// guides — National Grid configs, TYCORUN layout, Autodesk substation basics): a fenced switchyard of
// TRANSFORMERS (step up/down), rows of SWITCHGEAR (disconnects, breakers, arrestors) on steel lattice
// structures, overhead BUSBARS distributing between circuits, a CONTROL HOUSE, cable trenches, on
// gravel. This is where the eerily-perfect power NETWORK is fed (LIGHT=TERRITORY, clustered power).
// Act-1: dead switchyard, transformers cold + weeping oil, porcelain shot, the control house dark.
// Street-aware + drivable (an access road); the transformers + switchgear dominate (WALKABLE-LAND).
// LEGEND:
//  0 desert  1 access road (DRIVABLE)  2 control house  3 dead brush  4 gravel yard  5 gate
//  6 transformer  7 switchgear structure  8 busbar / conductor  9 pole light  10 insulator/arrestor
//  11 marking  12 perimeter fence  13 cable trench
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;
  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    // a SWITCHGEAR BAY: a steel lattice structure with insulator stacks + a busbar tap
    function bay(x0,y0){ G.rect(x0,y0,x0+8,y0+10,7); G.rect(x0+1,y0+1,x0+7,y0+9,4);
      set(x0+2,y0+2,10); set(x0+6,y0+2,10); set(x0+2,y0+8,10); set(x0+6,y0+8,10);   // insulator/arrestor stacks
      set(x0+4,y0,8); }
    // ---- BASE: gravel switchyard, DOUBLE-fenced; desert at the margins ----
    G.rect(0,0,W-1,H-1,0); G.rect(6,8,W-7,H-7,4); G.frame(12); for(x=8;x<W-8;x++){set(x,10,12);set(x,H-11,12);} for(y=10;y<H-10;y++){set(8,y,12);set(W-9,y,12);}
    // ---- CONTROL HOUSE + relay building at the entrance (south) ----
    G.rect(46,104,82,118,2);
    // ---- TRANSFORMERS (the hero) — a row of big oil-filled blocks with radiators + bushings ----
    for(var tx=16; tx<=104; tx+=28){ G.rect(tx,20,tx+18,40,6); for(y=22;y<=38;y+=3){set(tx-1,y,7);set(tx+19,y,7);} // radiator fins
      set(tx+4,18,10); set(tx+9,18,10); set(tx+14,18,10); }             // HV bushings on top
    // ---- SWITCHGEAR bays in rows + BUSBARS running the yard ----
    for(var by=52; by<=88; by+=14)for(var bxx=16; bxx<=104; bxx+=13){ bay(bxx,by); }
    G.rect(12,48,116,49,8); G.rect(12,50,116,51,8);                     // the main overhead BUSBARS (twin runs)
    for(x=16;x<=104;x+=13) G.rect(x+4,40,x+4,52,8);                     // risers from the transformer row down to the bus
    // ---- CABLE TRENCHES threading the yard + pole lights ----
    G.rect(12,44,116,45,13); G.rect(12,92,116,93,13); G.rect(60,20,61,102,13);
    [[10,20],[116,20],[10,100],[70,100]].forEach(function(p){ set(p[0],p[1],9); });
    for(i=0;i<10;i++){ var bx2=6+Math.floor(r()*2), by2=10+Math.floor(r()*(H-20)); if(get(bx2,by2)===0)set(bx2,by2,3); }
    // ---- ACCESS ROAD from the SOUTH gate to the control house ----
    var gx=W>>1;
    G.rect(gx-2,96,gx+2,H-1,1);
    for(y=H-1;y>=96;y--)for(x=-2;x<=2;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4||c===12)set(gx+x,y,1); }
    G.rect(12,98,116,101,1);                                            // a perimeter access lane inside the fence
    for(i=-2;i<=2;i++)set(gx+i,H-1,5);
    return g;
  }
  function generate(seed,opts){ opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:12});
    var g=res.g; return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})}; }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }
  var PALETTE={0:'#1c1a15',1:'#45433c',2:'#6a6358',3:'#3f382c',4:'#514d44',5:'#c79a3f',6:'#7a7268',
    7:'#8a8478',8:'#9a948a',9:'#8f8676',10:'#b0a894',11:'#c9c1aa',12:'#6a6a72',13:'#33302a'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt outside the fence (setback)'},
    1:{name:'access road',        kind:'drive',      act1:'the gravel access road — a maintenance truck reaches the yard from the gate (drivable)'},
    2:{name:'control house',      kind:'building',   act1:'the control + relay house, panels dark, doors chained', enter:'control-house interior: the relay + control room up front, the battery + auxiliary rooms behind'},
    3:{name:'dead brush',         kind:'tree-dead',  act1:'dead brush caught in the double perimeter fence', solid:false},
    4:{name:'gravel yard',        kind:'ground',     act1:'the crushed-stone switchyard gravel (grounding grid beneath)'},
    5:{name:'gate',               kind:'gate',       act1:'the switchyard gate off the street, amber curb'},
    6:{name:'transformer',        kind:'structure',  act1:'a power transformer — a big oil-filled block, radiators + bushings, cold, weeping oil', solid:true},
    7:{name:'switchgear structure',kind:'structure', act1:'a steel lattice switchgear bay — disconnects + breakers, dead', solid:true},
    8:{name:'busbar / conductor', kind:'overhead',   act1:'the overhead busbars / conductors distributing between circuits (dead, sagging)'},
    9:{name:'pole light',         kind:'prop',       act1:'a yard pole light, head dark'},
    10:{name:'insulator / arrestor',kind:'prop',     act1:'a porcelain insulator stack / lightning arrestor, cracked', solid:true},
    11:{name:'marking',           kind:'marking',    act1:'faded hazard / bay markings on the gravel'},
    12:{name:'perimeter fence',   kind:'structure',  act1:'the double security fence of the switchyard (grounded), wire sagging', solid:true},
    13:{name:'cable trench',      kind:'ground',     act1:'a covered cable trench threading the yard between the structures', solid:false}
  };
  var NOTES={
    summary:'A dead electrical substation — a row of power transformers with their radiators + bushings, rows of steel switchgear bays with porcelain arrestors, overhead busbars distributing the yard, a control house, cable trenches, double-fenced on gravel. Where the eerily-perfect power network is fed.',
    reference:['Substation design guides (National Grid configurations, TYCORUN layout, Autodesk substation basics): TRANSFORMERS step voltage up/down; SWITCHGEAR (disconnects, breakers, arrestors) on steel structures; overhead BUSBARS distribute between circuits; a CONTROL HOUSE monitors; a grounding grid + double fence for safety; cable trenches connect it all.'],
    layout:['The switchyard is gravel inside a DOUBLE perimeter fence (desert at the margins); the CONTROL + relay house sits at the south gate.',
      'A row of big TRANSFORMERS (the hero — oil-filled blocks, radiator fins, HV bushings) crosses the top; risers drop to the main overhead BUSBARS.',
      'Rows of steel SWITCHGEAR bays (with porcelain insulator/arrestor stacks) fill the yard below the bus.',
      'CABLE TRENCHES thread between the structures; pole lights ring the yard.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the switchyard gate is on the primary street; a gravel access road + perimeter lane (code 1) reach the yard from the curb (K.driveReachFromStreet). WALKABLE-LAND: the transformers + switchgear + buildings dominate; the road is minimal. Corner side streets get a pedestrian gate.',
    layering:'GROUND plane (walk/drive, flat): the gravel (4), cable trenches (13), the access road (1, drive), markings (11), desert (0). STRUCTURES (¾ front face, solid): the TRANSFORMERS (6, the hero mass), the SWITCHGEAR bays (7), the control house (2, ENTERABLE), the double FENCE (12), insulator/arrestor stacks (10). OVERHEAD (drawn above, pass under): the BUSBARS / conductors (8). PROPS: pole lights (9). PORTALS: the gate (5). The transformers + steel switchyard are the mass; the busbars run overhead; you cross the gravel between the structures.',
    decisions:['Act-1 DEAD: transformers cold + weeping oil, porcelain shot, switchgear dead, the control house dark, busbars sagging. This feeds the CLUSTERED POWER network (LIGHT=TERRITORY) — who re-energizes it is faction canon (Paolo\'s).',
      'Infrastructure category (substation). Zero purple.',
      'WALKABLE-LAND honored: transformers + switchgear + buildings dominate; access road minimal.',
      'Research-first (per the playbook): built from real substation switchyard layouts, not memory.']
  };
  K.register('substation', { generate:generate, body:function(c){return c===2;}, category:'infrastructure', palette:PALETTE, legend:LEGEND, notes:NOTES });
  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API; root.BohemiaSubstation=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
