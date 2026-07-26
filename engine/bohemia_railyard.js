// BOHEMIA RAILYARD (7/21/26). INDUSTRIAL, on the DISTRICT KIT. Research-first (rail-yard guides —
// Wikipedia rail yard, railway-technical depot layout, classification yards): a fan of parallel
// CLASSIFICATION TRACKS holds sorted ROLLING STOCK + LOCOMOTIVES; an ENGINE SHED / maintenance depot;
// a CONTAINER stacking area worked by a GANTRY crane; a fueling + sand facility; all on ballast, fenced.
// Act-1 DEAD: rusted boxcars stranded on the tracks, a dead loco, containers rotting, the gantry
// seized. Street-aware + drivable (a service road); the tracks + stock + containers dominate (WALKABLE-
// LAND). Full dossier + layering.
// LEGEND:
//  0 desert  1 service road (DRIVABLE)  2 building (engine shed/depot/office)  3 dead brush
//  4 ballast/gravel  5 gate  6 rail track  7 rolling stock (boxcar)  8 locomotive  9 pole light
//  10 container  11 marking  12 fence  13 gantry crane
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;
  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    // ---- BASE: ballast/gravel, fenced; desert at the margins ----
    G.rect(0,0,W-1,H-1,0); G.rect(6,8,W-7,H-7,4); G.frame(12);
    // ---- ENGINE SHED / maintenance depot + office at the west end ----
    G.rect(8,12,30,72,2); for(y=16;y<=68;y+=6) set(8,y,11);              // long shed with bay lines
    G.rect(8,78,30,96,2);                                                // office / fuel + sand shed
    // ---- the FAN of CLASSIFICATION TRACKS (the hero) with sorted ROLLING STOCK + a LOCO ----
    for(var ty=16; ty<=104; ty+=7){ G.rect(34,ty,116,ty,6);             // a running rail (steel line)
      for(x=34;x<=116;x+=3) set(x,ty,6);                                 // ties/rail texture
      for(var bx=36; bx<=110; bx+=9){                                    // boxcars / loco sorted on the track
        if(r()<0.30) continue;                                          // a gap (track partly empty)
        var loco=r()<0.12;
        G.rect(bx,ty-2,bx+6,ty+1,loco?8:7);                             // a car body straddling the rail
      }
    }
    // ---- CONTAINER stacking yard + a GANTRY crane spanning it (SE) ----
    for(var cy=80; cy<=104; cy+=6)for(var cx=88; cx<=114; cx+=8){ if(r()<0.85)G.rect(cx,cy,cx+6,cy+4,10); }
    G.rect(86,78,116,79,13); G.rect(86,78,86,106,13); G.rect(116,78,116,106,13); // gantry rails + legs
    G.rect(98,76,104,80,13);                                            // the gantry trolley/hoist
    // ---- pole lights, dead brush, a SERVICE ROAD from the gate to the depot ----
    [[9,12],[118,12],[9,104],[70,104]].forEach(function(p){ set(p[0],p[1],9); });
    for(i=0;i<12;i++){ var bx2=7+Math.floor(r()*3), by2=10+Math.floor(r()*(H-20)); if(get(bx2,by2)===12)set(bx2,by2,3); }
    var gx=20;
    G.rect(gx-2,96,gx+2,H-1,1);                                          // service road to the depot
    for(y=H-1;y>=96;y--)for(x=-2;x<=2;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4||c===12)set(gx+x,y,1); }
    G.rect(8,110,120,114,1);                                            // a yard service lane along the front
    for(i=-2;i<=2;i++)set(gx+i,H-1,5);
    return g;
  }
  function generate(seed,opts){ opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:12});
    var g=res.g; return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})}; }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }
  var PALETTE={0:'#1c1a15',1:'#45433c',2:'#6a6358',3:'#3f382c',4:'#4a4640',5:'#c79a3f',6:'#565048',
    7:'#7a5548',8:'#46545e',9:'#8f8676',10:'#a8683e',11:'#c9c1aa',12:'#6a6a72',13:'#9a948a'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt outside the fence (setback)'},
    1:{name:'service road',       kind:'drive',      act1:'the yard service road — a truck reaches the depot from the gate (drivable)'},
    2:{name:'building (engine shed/depot/office)',kind:'building',act1:'the engine shed / maintenance depot + office + fuel/sand shed, dark', enter:'depot interior: the inspection + light-maintenance bays (pits in the floor), the heavy shop + office off the side'},
    3:{name:'dead brush',         kind:'tree-dead',  act1:'dead brush in the ballast + fence', solid:false},
    4:{name:'ballast / gravel',   kind:'ground',     act1:'the crushed-stone ballast + gravel of the yard'},
    5:{name:'gate',               kind:'gate',       act1:'the yard gate off the street, amber curb'},
    6:{name:'rail track',         kind:'ground',     act1:'a steel running rail on ties — the classification tracks fanned across the yard'},
    7:{name:'rolling stock (boxcar)',kind:'vehicle', act1:'a rusted freight car stranded on the track, doors sprung', solid:true},
    8:{name:'locomotive',         kind:'vehicle',    act1:'a dead diesel locomotive on the track, cab dark, hulking', solid:true},
    9:{name:'pole light',         kind:'prop',       act1:'a yard pole light, head dark'},
    10:{name:'container',         kind:'structure',  act1:'a shipping container in the stacking yard, paint faded + streaked, doors ajar', solid:true},
    11:{name:'marking',           kind:'marking',    act1:'faded shed-bay / yard markings'},
    12:{name:'perimeter fence',   kind:'structure',  act1:'the yard perimeter fence, wire sagging', solid:true},
    13:{name:'gantry crane',      kind:'structure',  act1:'the container gantry crane spanning the stack — rails, legs, a seized hoist trolley', solid:true}
  };
  var NOTES={
    summary:'A dead railyard — a fan of classification tracks holding rusted boxcars + a dead locomotive, an engine shed / maintenance depot, a container stacking yard under a seized gantry crane, a fuel + sand shed, all on ballast behind the fence.',
    reference:['Rail-yard guides (Wikipedia rail yard, railway-technical depot layout, classification yards): a fan of parallel CLASSIFICATION TRACKS sorts + stores ROLLING STOCK + LOCOMOTIVES; an ENGINE SHED / maintenance depot (inspection pits, light + heavy shops); a CONTAINER stacking area worked by a GANTRY crane; a fueling + sand facility; all on ballast.'],
    layout:['The yard is ballast/gravel inside the perimeter fence (desert at the margins); an ENGINE SHED / depot + a fuel/sand + office building line the west end.',
      'A FAN of parallel CLASSIFICATION TRACKS (the hero) crosses the yard, sorted rusted BOXCARS + a dead LOCOMOTIVE stranded along them, gaps where cars were pulled.',
      'A CONTAINER stacking yard fills the SE, spanned by a seized GANTRY crane on its rails.',
      'A service road runs from the gate to the depot + a yard service lane along the front.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the yard gate is on the primary street; a service road (code 1) reaches the depot from the curb (K.driveReachFromStreet). WALKABLE-LAND: the tracks + rolling stock + containers + buildings dominate; the road is minimal. Corner side streets get a pedestrian gate.',
    layering:'GROUND plane (walk/drive, flat): the ballast (4), the rail tracks (6, walk across the ties), the service road (1, drive), markings (11), desert (0). STRUCTURES (¾ front face, solid): the depot/shed/office (2, ENTERABLE), the CONTAINERS (10), the GANTRY crane (13), the perimeter FENCE (12). VEHICLES (solid): the BOXCARS (7) + LOCOMOTIVE (8) on the rails. PROPS: pole lights (9). PORTALS: the gate (5). The rolling stock + containers + gantry are the mass; you walk the ballast + tracks between them.',
    decisions:['Act-1 DEAD: rusted boxcars + a dead loco stranded, containers rotting + ajar (picked over), the gantry seized. The rolling stock + containers are salvage/shelter (Paolo + the economy rule the loot).',
      'Industrial category (railyard). Zero purple. No railroad/reporting marks (generic stock).',
      'WALKABLE-LAND honored: tracks + stock + containers + buildings dominate; the road is minimal.',
      'Research-first (per the playbook): built from real rail-yard + depot layouts, not memory.']
  };
  K.register('railyard', { generate:generate, body:function(c){return c===2;}, category:'industrial', palette:PALETTE, legend:LEGEND, notes:NOTES });
  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API; root.BohemiaRailyard=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
