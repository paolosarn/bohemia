// BOHEMIA BATTERY STORAGE YARD (7/23/26). INFRASTRUCTURE, on the DISTRICT KIT. Paolo: "look at all
// the pocket city 2 buildings, we have to make them as districts" — Pocket City 2's Power category
// covers generation AND storage; Bohemia has solar (generation) and substation (distribution) but
// nothing for grid-scale STORAGE. Research-first (utility BESS site design — NFPA 855 spacing, real
// containerized BESS installations): rows of shipping-container-sized BATTERY ENCLOSURES on gravel,
// each with its own HVAC/thermal-management unit beside it, an inverter/transformer rack tying the
// array into the grid, a control/monitoring building, double security fencing (same safety class as
// a substation), fire-lane spacing between rows (NFPA 855's real container-spacing requirement).
// Act-1 DEAD: containers cold, HVAC units silent, inverters dark, the control room abandoned. This
// feeds the same CLUSTERED POWER network substation distributes (LIGHT=TERRITORY). Street-aware +
// drivable (a gravel access road); containers + inverters + control building dominate (WALKABLE-LAND).
// LEGEND:
//  0 desert  1 access road (DRIVABLE)  2 control building  3 dead brush  4 gravel yard  5 gate
//  6 battery container  7 HVAC / thermal unit  8 inverter / transformer rack  9 pole light
//  10 perimeter fence  11 hazard marking  12 warning placard  13 cable trench
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }

    // ---- BASE: gravel yard, DOUBLE-fenced; desert at the margins ----
    G.rect(0,0,W-1,H-1,0); G.rect(6,6,W-7,H-7,4);
    G.frame(10);
    for(x=8;x<W-8;x++){ set(x,9,10); set(x,H-10,10); }
    for(y=9;y<H-9;y++){ set(8,y,10); set(W-9,y,10); }

    // ---- BATTERY CONTAINER ROWS (the hero) — NFPA-855-style fire-lane spacing between rows ----
    for(var row=0; row<3; row++){
      var ry=18+row*26;
      for(var col=0; col<5; col++){
        var cx=14+col*20;
        G.rect(cx,ry,cx+13,ry+15,6);                                    // the container enclosure
        set(cx+15,ry+3,7); set(cx+15,ry+11,7);                          // HVAC / thermal-management units flanking it
      }
      G.rect(10,ry+16,116,ry+18,13);                                    // cable trench running behind the row
    }

    // ---- INVERTER / TRANSFORMER RACK — ties the array into the grid ----
    G.rect(14,92,110,96,8);
    for(x=18;x<=106;x+=12) set(x,90,12);                                // warning placards along the inverter rack

    // ---- CONTROL / MONITORING BUILDING near the south gate ----
    G.rect(46,100,82,116,2);
    for(x=50;x<=78;x+=6) set(x,100,11);                                 // hazard striping at the apron edge

    // ---- POLE LIGHTS + dead brush caught in the fence ----
    [[10,20],[116,20],[10,100],[116,100]].forEach(function(p){ set(p[0],p[1],9); });
    for(i=0;i<10;i++){ var bx=1+Math.floor(r()*4), by=10+Math.floor(r()*(H-20)); if(get(bx,by)===0)set(bx,by,3); }
    for(i=0;i<10;i++){ var bx2=W-5+Math.floor(r()*4), by2=10+Math.floor(r()*(H-20)); if(get(bx2,by2)===0)set(bx2,by2,3); }

    // ---- ACCESS ROAD from the SOUTH gate to the control building + a perimeter lane ----
    var gx=W>>1;
    G.rect(gx-2,96,gx+2,H-1,1);
    for(y=H-1;y>=96;y--)for(x=-2;x<=2;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4||c===10)set(gx+x,y,1); }
    G.rect(12,98,116,99,1);
    for(i=-2;i<=2;i++)set(gx+i,H-1,5);
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

  var PALETTE={0:'#1c1a15',1:'#45433c',2:'#6a6358',3:'#3f382c',4:'#514d44',5:'#c79a3f',6:'#4a5560',
    7:'#7a7268',8:'#8a8478',9:'#8f8676',10:'#6a6a72',11:'#c9c1aa',12:'#b0863a',13:'#33302a'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt outside the fence (setback)'},
    1:{name:'access road',        kind:'drive',      act1:'the gravel access road — a service truck reaches the yard from the gate (drivable)'},
    2:{name:'control building',   kind:'building',   act1:'the control + monitoring building, screens dark, doors chained', enter:'control-building interior: the monitoring room up front, the switchgear + comms rooms behind'},
    3:{name:'dead brush',         kind:'tree-dead',  act1:'dead brush caught in the double perimeter fence', solid:false},
    4:{name:'gravel yard',        kind:'ground',     act1:'the crushed-stone storage-yard gravel'},
    5:{name:'gate',               kind:'gate',       act1:'the yard gate off the street, amber curb'},
    6:{name:'battery container',  kind:'structure',  act1:'a containerized battery enclosure — the hero, cold, indicator lights dead, rows spaced to the fire-lane standard', solid:true},
    7:{name:'HVAC / thermal unit',kind:'structure',  act1:'the thermal-management / HVAC unit beside its container, fans stopped', solid:true},
    8:{name:'inverter / transformer rack',kind:'structure', act1:'the inverter + transformer rack tying the array into the grid, dark, oil-stained', solid:true},
    9:{name:'pole light',         kind:'prop',       act1:'a yard pole light, head dark'},
    10:{name:'perimeter fence',   kind:'structure',  act1:'the double security fence around the yard, wire sagging', solid:true},
    11:{name:'hazard marking',    kind:'marking',    act1:'faded hazard striping at the control-building apron'},
    12:{name:'warning placard',   kind:'prop',       act1:'a high-voltage / thermal-hazard placard along the inverter rack, paint flaked'},
    13:{name:'cable trench',      kind:'ground',     act1:'a covered cable trench running behind each container row', solid:false}
  };
  var NOTES={
    summary:'A dead grid-scale battery storage yard — three fire-lane-spaced rows of containerized battery enclosures each with its own HVAC unit, an inverter/transformer rack tying the array to the grid, a control building, double-fenced on gravel. Storage, distinct from solar (generation) and substation (distribution) — the same CLUSTERED POWER network they all feed.',
    reference:['Utility-scale BESS (battery energy storage system) site design: NFPA 855 mandates real fire-lane SPACING between container rows (the deliberate gaps here, not decorative); each containerized enclosure pairs with its own HVAC/thermal-management unit; an inverter/transformer rack converts and ties the DC storage array into the AC grid; a control/monitoring building oversees state-of-charge; double security fencing matches substation-class infrastructure.'],
    layout:['The yard is gravel inside a DOUBLE perimeter fence (desert at the margins); the CONTROL building sits at the south gate.',
      'Three ROWS of containerized BATTERY enclosures (the hero) run north-south, each container paired with an HVAC unit, rows separated by real fire-lane spacing.',
      'An INVERTER / TRANSFORMER rack runs along the south edge of the array, tying it into the grid, with warning placards along its length.',
      'Cable TRENCHES run behind each row; pole lights ring the yard.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the yard gate is on the primary street; a gravel access road + perimeter lane (code 1) reach the control building and array from the curb (K.driveReachFromStreet). WALKABLE-LAND: the containers + inverter rack + fence + control building dominate; the road is minimal. Corner side streets get a pedestrian gate.',
    layering:'GROUND plane (walk/drive, flat): the gravel (4), cable trenches (13), the access road (1, drive), hazard marking (11), desert (0). STRUCTURES (¾ front face, solid): the BATTERY containers (6, the hero rows), their HVAC units (7), the inverter/transformer rack (8), the control building (2, ENTERABLE), the double perimeter FENCE (10). PROPS: pole lights (9), warning placards (12). PORTALS: the gate (5). The container rows are the mass; you cross the gravel fire lanes between them.',
    decisions:['Act-1 DEAD: containers cold with dead indicator lights, HVAC fans stopped, inverters dark and oil-stained, the control room abandoned. This feeds the same CLUSTERED POWER network substation distributes — who re-energizes it is faction canon (Paolo\'s).',
      'Infrastructure category (battery) — already reserved in K.TAXONOMY (Paolo 7/18\'s taxonomy pass anticipated this slot alongside solar/substation/watertreat), filled in this turn rather than inventing a new bucket.',
      'WALKABLE-LAND honored: container rows + inverter rack + fence + control building dominate; access road minimal.',
      'Research-first (per the playbook): built from real utility BESS site design (NFPA 855 spacing), not memory.']
  };
  K.register('battery', { generate:generate, body:function(c){return c===2;}, category:'infrastructure', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaBattery=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
