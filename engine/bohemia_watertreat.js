// BOHEMIA WATER TREATMENT (7/21/26). INFRASTRUCTURE, on the DISTRICT KIT. Research-first (wastewater
// plant design guides — GBRA design standards, turn2engineering components, NapaSan process, AUC
// concentric-circle layout): the recognizable-from-above kit is CIRCULAR CLARIFIERS (round tanks
// with a central core + a radial sweep arm), rectangular AERATION BASINS (activated-sludge, with
// baffles), FILTER BEDS (a grid of shallow cells), a CONTROL / blower / chemical BUILDING, pipe
// galleries + catwalks tying it together, all fenced, gravity-flow ordered. Act-1 DEAD: basins dry +
// cracked, scum crusted, steel rusted, the control house dark. Street-aware + drivable (a thin
// service road; the plant is nearly all structure, so content dominates — WALKABLE-LAND LAW). Full
// dossier + layering. Hero: the round clarifiers + rectangular basins.
// LEGEND:
//  0 desert dead-ground          1 service road (DRIVABLE)
//  2 building (control/blower/chem) 3 dead brush
//  4 dry basin floor              5 gate
//  6 clarifier wall / core        7 aeration / filter basin
//  8 pipe gallery / catwalk       9 pole light
//  10 crusted sludge / scum      11 marking   12 perimeter fence
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    function ring(cx,cy,rad,code){ for(var a=0;a<360;a+=1){ var rr=a*Math.PI/180; set(Math.round(cx+Math.cos(rr)*rad),Math.round(cy+Math.sin(rr)*rad),code); } }
    // a CIRCULAR CLARIFIER: an outer concrete wall, the dry floor, a centre core, and a radial
    // scum/sludge SWEEP ARM (the thing that says "clarifier" from above).
    function clarifier(cx,cy,rad,seed2){ G.disc(cx,cy,rad,6); G.disc(cx,cy,rad-2,4);
      ring(cx,cy,rad-1,6); G.disc(cx,cy,3,2);                            // outer wall + dry floor + centre core
      for(i=0;i<rad;i++){ set(cx+i,cy,8); }                             // the radial sweep arm (catwalk)
      for(i=0;i<12;i++){ var a=(i/12+(seed2%7)/50)*Math.PI*2, rr2=3+Math.floor(r()*(rad-4)); if(r()<0.5)set(Math.round(cx+Math.cos(a)*rr2),Math.round(cy+Math.sin(a)*rr2),10); } // scum crust
    }

    // ---- BASE: the plant deck (dry basin-floor concrete), fenced; desert at the margins ----
    G.rect(0,0,W-1,H-1,0);
    G.rect(6,8,W-7,H-7,4);                                                // the concrete plant deck
    G.frame(12);                                                          // perimeter fence

    // ---- CONTROL / BLOWER / CHEMICAL BUILDING cluster at the back ----
    G.rect(10,10,50,26,2); G.rect(54,10,78,24,2); G.rect(84,10,118,26,2);

    // ---- CIRCULAR CLARIFIERS (the hero) — a row of round tanks ----
    clarifier(30,58,18,seed); clarifier(74,58,18,seed+3); clarifier(104,54,13,seed+7);

    // ---- rectangular AERATION BASINS with baffles + FILTER BEDS (a grid of cells) ----
    G.rect(10,86,58,116,7); for(y=90;y<=112;y+=6) G.rect(12,y,56,y+1,8);  // aeration basin + baffle walls
    for(var fx=64; fx<=112; fx+=13)for(var fy=86; fy<=112; fy+=13){ G.rect(fx,fy,fx+10,fy+10,7); ring(fx+5,fy+5,5,8); } // filter beds (grid)

    // ---- PIPE GALLERIES / catwalks tying the stages together (gravity-flow order) ----
    G.rect(48,44,52,86,8); G.rect(92,44,96,86,8); G.rect(10,80,118,82,8); G.rect(30,28,30,40,8); G.rect(74,26,74,40,8);
    for(i=0;i<40;i++){ var sx=8+Math.floor(r()*(W-16)), sy=30+Math.floor(r()*(H-40)); if(get(sx,sy)===4&&r()<0.3)set(sx,sy,10); } // scum drifted on the deck

    // ---- pole lights + a thin SERVICE ROAD (minimal — the plant is nearly all structure) ----
    [[8,32],[120,32],[8,116],[120,116],[64,60]].forEach(function(p){ set(p[0],p[1],9); });
    G.rect(60,44,63,120,1);                                              // the service road spine
    for(i=0;i<12;i++){ var bx=7+Math.floor(r()*3), by=10+Math.floor(r()*(H-20)); if(get(bx,by)===12)set(bx,by,3); }

    // ---- ENTRANCE GATE off the SOUTH street (rotated to the real street by the kit) ----
    var gx=61;
    for(i=-2;i<=2;i++)set(gx+i,H-1,5);
    for(y=H-1;y>=118;y--)for(x=-2;x<=2;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4||c===12)set(gx+x,y,1); }
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

  var PALETTE={0:'#1c1a15',1:'#45433c',2:'#6f665a',3:'#3a4020',4:'#5a584f',5:'#c79a3f',6:'#7a7268',
    7:'#46585a',8:'#8a8478',9:'#8f8676',10:'#5a5240',11:'#c9c1aa',12:'#6a6a72'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt outside the fence (setback)'},
    1:{name:'service road',       kind:'drive',      act1:'the plant service road — a car reaches the structures from the gate (drivable)'},
    2:{name:'building (control / blower / chem)',kind:'building',act1:'the control house / blower room / chemical building, dark, gauges dead', enter:'plant interior: the control room + pump/blower gallery up front, the chemical + lab rooms behind'},
    3:{name:'dead brush',         kind:'tree-dead',  act1:'dead brush caught in the perimeter fence', solid:false},
    4:{name:'dry basin floor',    kind:'ground',     act1:'the cracked dry concrete of a drained basin / the plant deck'},
    5:{name:'gate',               kind:'gate',       act1:'the plant service gate off the street, amber curb'},
    6:{name:'clarifier wall / core',kind:'structure',act1:'the concrete wall + centre core of a circular clarifier tank (the round-tank rim)'},
    7:{name:'aeration / filter basin',kind:'ground', act1:'a drained aeration basin / filter cell — cracked floor, walls water-stained dark'},
    8:{name:'pipe gallery / catwalk',kind:'structure',act1:'a steel pipe gallery / catwalk / clarifier sweep arm, rusted', solid:true},
    9:{name:'pole light',         kind:'prop',       act1:'a plant pole light, head dark'},
    10:{name:'crusted sludge / scum',kind:'ground',  act1:'crusted dried sludge / scum drifted in the basins + on the deck', solid:false},
    11:{name:'marking',           kind:'marking',    act1:'faded hazard / valve paint on the deck'},
    12:{name:'perimeter fence',   kind:'structure',  act1:'the chain-link plant perimeter fence, wire sagging', solid:true}
  };
  var NOTES={
    summary:'A dead wastewater treatment plant — a row of circular clarifier tanks with their sweep arms, rectangular aeration basins + a grid of filter beds, a control/blower/chemical building, pipe galleries, all drained + cracked behind the perimeter fence.',
    reference:['Wastewater-plant design guides (GBRA design standards, turn2engineering components, NapaSan primary/secondary/tertiary process, AUC concentric-circle layout): the recognizable kit is CIRCULAR CLARIFIERS (round tanks, central core + radial sweep arm), rectangular AERATION BASINS (activated sludge, baffled), FILTER BEDS, a CONTROL / blower / chemical BUILDING, pipe galleries + catwalks, all fenced and ordered by gravity flow.'],
    layout:['The plant deck is dry basin-floor concrete inside a perimeter fence (desert at the margins).',
      'The CONTROL / blower / chemical BUILDING cluster sits at the back; a thin service road spine runs the plant.',
      'A row of CIRCULAR CLARIFIERS (the hero — round walls, centre cores, radial sweep arms) crosses the middle.',
      'Rectangular AERATION BASINS (baffled) + a grid of FILTER BEDS fill the front; pipe galleries + catwalks tie the stages in gravity-flow order; scum is crusted in the basins.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the service gate is on the primary street; a thin service road (code 1) reaches the structures from the curb (K.driveReachFromStreet). WALKABLE-LAND: the plant is nearly ALL structure (tanks, basins, buildings, pipes) — content dominates, the road is minimal. Corner side streets get a pedestrian gate.',
    layering:'GROUND plane (walk, flat): the dry basin floors (4, 7), crusted sludge (10), the service road (1, drive), desert (0). STRUCTURES (¾ front face, solid): the buildings (2, ENTERABLE -> control/pump/chem interior), the CLARIFIER walls + cores (6, the round tanks), the pipe galleries + catwalks + sweep arms (8), the perimeter FENCE (12). PROPS: pole lights (9). PORTALS: the gate (5). The tanks + buildings + pipes are the vertical mass; you walk the deck and the drained basin floors between them.',
    decisions:['Act-1 DEAD: basins drained + cracked, scum crusted, steel rusted, the control house dark, no flow. The valley\'s water is a scarcity-economy resource (Paolo\'s to rule) — this plant is where it was cleaned.',
      'Infrastructure category (watertreat). Zero purple.',
      'WALKABLE-LAND LAW honored: nearly all structure/basin, minimal road — content dominates.',
      'Research-first (per the playbook): built from real wastewater-plant site plans, not memory.']
  };
  K.register('watertreat', { generate:generate, body:function(c){return c===2;}, category:'infrastructure', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaWatertreat=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
