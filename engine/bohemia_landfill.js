// BOHEMIA LANDFILL (7/21/26). INFRASTRUCTURE, on the DISTRICT KIT. Research-first (landfill design
// guides — BTL cell design, Waste360, EPA landfill guide): the site is WASTE CELLS (basins ringed by
// earthen BERMS, each filled with compacted trash under cover soil), LEACHATE evaporation PONDS, a
// SCALE house + office at the gate, HAUL ROADS, gas-collection WELLS, and heavy EQUIPMENT (dozers/
// compactors) working the active face. Post-collapse, the dump is where everything ends up + gets
// picked — pure Bohemia. Act-1: the trash is the landscape, ponds gone to scum, a dead dozer. Street-
// aware + drivable (haul roads); the cells + berms + waste dominate (WALKABLE-LAND). Full dossier.
// LEGEND:
//  0 desert dead-ground          1 haul road (DRIVABLE)
//  2 building (scale/office/gas)  3 dead brush
//  4 cover soil / dirt            5 gate
//  6 waste fill                   7 cell berm
//  8 leachate pond                9 pole light
//  10 equipment (dozer/compactor) 11 marking (scale)   12 perimeter fence   13 gas well / pipe
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;
  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    // a WASTE CELL: an earthen berm rectangle filled with compacted trash, debris-flecked
    function cell(x0,y0,x1,y1){ G.rect(x0,y0,x1,y1,7); G.rect(x0+2,y0+2,x1-2,y1-2,6);
      for(i=0;i<(x1-x0)*(y1-y0)*0.05;i++){ var tx=x0+2+Math.floor(r()*(x1-x0-4)), ty=y0+2+Math.floor(r()*(y1-y0-4)); if(get(tx,ty)===6)set(tx,ty, r()<0.5?4:3); } // trash flecks + cover-soil patches
    }
    // ---- BASE: cover-soil dirt, fenced; desert at the margins ----
    G.rect(0,0,W-1,H-1,0); G.rect(6,8,W-7,H-7,4); G.frame(12);
    // ---- SCALE house + office at the gate (south) ----
    G.rect(12,104,38,118,2); G.rect(44,110,64,118,11);                   // office + truck scale
    // ---- WASTE CELLS (the hero — the trash is the landscape) ----
    cell(10,12,58,54); cell(64,12,118,50); cell(10,60,70,96);
    // ---- LEACHATE evaporation PONDS (scummed) ----
    G.disc(92,72,12,8); G.disc(108,92,9,8);
    // ---- gas-collection WELLS dotted on the capped cells; a dead DOZER on the active face ----
    for(i=0;i<14;i++){ var wx=12+Math.floor(r()*104), wy=14+Math.floor(r()*84); if(get(wx,wy)===6)set(wx,wy,13); }
    G.rect(30,30,36,38,10); G.rect(80,26,86,32,10);                      // dozer + compactor
    [[9,12],[118,12],[9,96],[76,100]].forEach(function(p){ set(p[0],p[1],9); });
    // ---- HAUL ROADS: a ring + spurs to each cell, from the gate ----
    var gx=W>>1;
    G.rect(gx-3,98,gx+3,H-1,1);
    for(y=H-1;y>=98;y--)for(x=-3;x<=3;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4||c===12||c===11)set(gx+x,y,1); }
    G.rect(8,98,120,102,1);                                             // cross haul road
    G.rect(60,12,63,98,1); G.rect(8,56,120,59,1);                       // spine + mid haul roads between cells
    for(i=-3;i<=3;i++)set(gx+i,H-1,5);
    return g;
  }
  function generate(seed,opts){ opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:12});
    var g=res.g; return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})}; }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }
  var PALETTE={0:'#1c1a15',1:'#4a4438',2:'#6a5f50',3:'#3f382c',4:'#5a5040',5:'#c79a3f',6:'#565238',
    7:'#6e6353',8:'#3a4436',9:'#8f8676',10:'#c8a03a',11:'#c9c1aa',12:'#6a6a72',13:'#8a8478'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt outside the fence (setback)'},
    1:{name:'haul road',          kind:'drive',      act1:'the packed haul road — trucks reach every cell from the gate (drivable)'},
    2:{name:'building (scale/office/gas)',kind:'building',act1:'the scale house + office + gas-plant shed, dark', enter:'scale-house interior: the weigh office + a control room, the gas-plant equipment room behind'},
    3:{name:'dead brush',         kind:'tree-dead',  act1:'dead brush + windblown litter caught in the fence', solid:false},
    4:{name:'cover soil / dirt',  kind:'ground',     act1:'the daily-cover soil capping the cells / the site dirt'},
    5:{name:'gate',               kind:'gate',       act1:'the landfill gate off the street, past the scale, amber curb'},
    6:{name:'waste fill',         kind:'ground',     act1:'compacted trash — the fill itself, the picked-over landscape of the dump', solid:false},
    7:{name:'cell berm',          kind:'structure',  act1:'the earthen berm ringing a waste cell (contains the leachate)', solid:true},
    8:{name:'leachate pond',      kind:'ground',     act1:'a leachate evaporation pond, gone to black scum', solid:false},
    9:{name:'pole light',         kind:'prop',       act1:'a site pole light, head dark'},
    10:{name:'equipment (dozer/compactor)',kind:'vehicle',act1:'a dead landfill dozer / spiked compactor, yellow faded, tracks seized', solid:true},
    11:{name:'marking (scale)',   kind:'marking',    act1:'the truck-scale pad + faded site markings'},
    12:{name:'perimeter fence',   kind:'structure',  act1:'the landfill perimeter fence, litter-choked', solid:true},
    13:{name:'gas well / pipe',   kind:'prop',       act1:'a landfill-gas collection wellhead / pipe riser on a capped cell', solid:true}
  };
  var NOTES={
    summary:'A dead landfill — big waste cells ringed by earthen berms and filled with picked-over trash, leachate evaporation ponds gone to scum, a scale house + office at the gate, haul roads, gas wells, a dead dozer + compactor. Where everything ends up.',
    reference:['Landfill design guides (BTL cell design, Waste360, EPA landfill guide): WASTE CELLS are basins ringed by earthen BERMS, each with a liner + leachate collection, filled + compacted under daily cover soil; LEACHATE evaporation PONDS; a SCALE house + office; HAUL ROADS + progressive infrastructure; landfill-gas collection WELLS; heavy EQUIPMENT (dozers/compactors) work the active face.'],
    layout:['The site is cover-soil dirt inside a litter-choked perimeter fence (desert at the margins); a scale house + office + truck scale sit at the south gate.',
      'Big WASTE CELLS (earthen berms filled with compacted, debris-flecked trash) are the landscape — the hero; a dead DOZER + compactor sit on the faces.',
      'LEACHATE evaporation PONDS (black scum) sit at the east; gas-collection WELLS dot the capped cells.',
      'HAUL ROADS ring + spur to every cell from the gate.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the gate is on the primary street past the scale; HAUL ROADS (code 1) ring + spur so a truck reaches every cell from the curb (K.driveReachFromStreet). WALKABLE-LAND: the cells + berms + waste + ponds dominate; haul roads are minimal. Corner side streets get a pedestrian gate.',
    layering:'GROUND plane (drive/walk, flat): the cover soil (4), waste fill (6), leachate ponds (8), haul roads (1, drive), scale markings (11), desert (0). STRUCTURES (¾ front face, solid): the buildings (2, ENTERABLE), the cell BERMS (7), the perimeter FENCE (12), gas WELLS (13). VEHICLES (solid): the dead EQUIPMENT (10). PROPS: pole lights (9). PORTALS: the gate (5). The bermed trash cells are the mass; you drive the haul roads between them.',
    decisions:['Act-1: the dump is world-native dead — the trash IS the landscape, picked over; ponds gone to scum, a seized dozer. The salvage/scav economy sifts here (Paolo + the economy rule the loot).',
      'Infrastructure category (landfill). Zero purple.',
      'WALKABLE-LAND honored: cells + berms + waste + ponds + equipment dominate; haul roads minimal.',
      'Research-first (per the playbook): built from real landfill site plans, not memory.']
  };
  K.register('landfill', { generate:generate, body:function(c){return c===2;}, category:'infrastructure', palette:PALETTE, legend:LEGEND, notes:NOTES });
  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API; root.BohemiaLandfill=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
