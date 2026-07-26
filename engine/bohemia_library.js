// BOHEMIA LIBRARY (7/21/26). CIVIC, on the DISTRICT KIT. Research-first (library design guides — WBDG
// public-library space types, Boston/Salt Lake/LA central-library plans, Opening the Book space
// planning): the plan centres on circulation, wrapped by multi-tiered STACKS, wrapped by READING
// ROOMS; a grand ENTRANCE with steps + a colonnade opening onto a PIAZZA/plaza; an administration
// wing; an inner reading COURTYARD/garden. A library is BUILDING-dominant (the point is the building),
// so the plot is nearly all structure (WALKABLE-LAND LAW, easily). Act-1 DEAD: broken windows, books
// spilled + rotting, a dead fountain, the colonnade cracked. Street-aware + drivable (a small lot).
// Full dossier + layering. Hero: the big columned building + grand plaza.
// LEGEND:
//  0 desert dead-ground          1 drive / lot (DRIVABLE)
//  2 building (library)           3 landscaping / tree
//  4 reading garden               5 gate
//  6 entrance steps               7 entrance plaza / piazza
//  8 colonnade columns            9 pole light
//  10 dead fountain / sculpture  11 stacks / reading detail   12 reading courtyard   13 sidewalk
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }

    // ---- BASE: civic landscaping / sidewalk campus; desert at the margins ----
    G.rect(0,0,W-1,H-1,0);
    G.rect(5,7,W-6,H-6,4);                                                // reading-garden lawn band
    G.rect(6,8,120,92,13);                                              // the sidewalk/terrace the building sits on

    // ---- the LIBRARY BUILDING — a big mass wrapped around an inner reading COURTYARD ----
    G.rect(14,8,114,82,2);
    G.rect(46,26,82,58,12); for(x=48;x<=80;x+=6){ set(x,42,3);} set(64,42,10);  // inner reading courtyard + a garden + centre sculpture
    // multi-tiered STACKS + reading detail (concentric-ish rings of shelving read)
    for(y=14;y<=76;y+=6){ for(x=18;x<=110;x+=3){ if((x<44||x>84||y<26||y>58)) set(x,y,11); } } // stack rows, skipping the courtyard
    for(x=18;x<=110;x+=6) set(x,8,11);                                   // parapet / clerestory line
    G.rect(16,60,44,80,2); G.rect(84,60,112,80,2);                       // the administration + community wings (solid)

    // ---- grand ENTRANCE: a COLONNADE + STEPS down to the PIAZZA (south front) ----
    G.rect(34,82,94,84,8); for(x=36;x<=92;x+=5) G.rect(x,82,x+1,86,8);   // the colonnade of columns across the front
    G.rect(40,86,88,94,6);                                              // the broad entrance STEPS
    G.rect(22,94,106,114,7);                                            // the entrance PIAZZA / plaza
    G.disc(64,104,5,10); G.disc(64,104,3,7);                            // the dead central FOUNTAIN on the plaza
    for(x=30;x<=98;x+=12){ set(x,96,3); set(x,112,3);}                   // planters lining the plaza

    // ---- small PARKING + drop-off (minimal — a library is a building, not a lot) ----
    G.rect(8,98,20,116,1); G.rect(108,98,120,116,1);
    for(y=100;y<=112;y+=5){ set(12,y,11); set(16,y,11); set(112,y,11); set(116,y,11); }

    // ---- pole lights, book-return, dead trees ----
    [[8,94],[120,94],[8,116],[120,116],[64,116]].forEach(function(p){ set(p[0],p[1],9); });
    set(30,100,13); set(98,100,13);                                     // book-return kiosks
    for(i=0;i<14;i++){ var tx=6+Math.floor(r()*(W-12)), ty=6+Math.floor(r()*3); if(get(tx,ty)===4)set(tx,ty,3); }

    // ---- ENTRANCE off the SOUTH street (rotated to the real street by the kit) ----
    var gx=W>>1;
    for(i=-3;i<=3;i++)set(gx+i,H-1,5);
    G.rect(gx-2,114,gx+2,H-1,1);                                         // drop-off drive from the street to the plaza
    for(y=H-1;y>=114;y--)for(x=-2;x<=2;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4||c===13)set(gx+x,y,1); }
    G.rect(20,114,gx,117,1); G.rect(gx,114,108,117,1);                  // a curb lane tying the two lots to the drive
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4||c===13; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:13, pedOver:soft, pedInset:12});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})};
  }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  var PALETTE={0:'#1c1a15',1:'#3a3a42',2:'#7a7060',3:'#3a4526',4:'#49512e',5:'#c79a3f',6:'#8a8175',
    7:'#8f8676',8:'#a89e8a',9:'#8f8676',10:'#5a6a5a',11:'#b0a894',12:'#43521f',13:'#6a675e'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt at the campus edge (setback)'},
    1:{name:'drive / lot',        kind:'drive',      act1:'the drop-off drive + a small side lot (car-drivable)'},
    2:{name:'building (library)', kind:'building',   act1:'the library — columned stone mass, windows broken, the doors chained', enter:'library interior: circulation + the reading room at the core, wrapped by multi-tiered stacks, reading rooms + the admin/community wings around'},
    3:{name:'landscaping / tree', kind:'tree-dead',  act1:'a dead campus tree / planter shrub', solid:false},
    4:{name:'reading garden',     kind:'ground',     act1:'the dead reading-garden lawn around the library'},
    5:{name:'gate',               kind:'gate',       act1:'the library drop-off entrance off the street, amber curb'},
    6:{name:'entrance steps',     kind:'structure',  act1:'the broad stone entrance steps up to the colonnade'},
    7:{name:'entrance plaza / piazza',kind:'ground', act1:'the entrance piazza — cracked pavers, weeds in the joints'},
    8:{name:'colonnade columns',  kind:'structure',  act1:'the row of stone columns across the grand front, one or two toppled', solid:true},
    9:{name:'pole light',         kind:'prop',       act1:'a campus pole light, head dark'},
    10:{name:'dead fountain / sculpture',kind:'prop', act1:'the dry central fountain / a civic sculpture on the plaza', solid:true},
    11:{name:'stacks / reading detail',kind:'structure',act1:'the multi-tiered book stacks / reading-room floor read of the interior mass'},
    12:{name:'reading courtyard', kind:'ground',     act1:'the inner reading courtyard / garden at the heart of the building'},
    13:{name:'sidewalk',          kind:'ground',     act1:'the terrace / sidewalk the library sits on, cracked'}
  };
  var NOTES={
    summary:'A dead public library — a big columned stone building wrapped around an inner reading courtyard, a grand colonnade + entrance steps down to a piazza with a dead fountain, admin + community wings, a reading garden, a small side lot.',
    reference:['Library design guides (WBDG public-library space types, Boston/Salt Lake/LA central-library plans, Opening the Book space planning): the plan centres on CIRCULATION, wrapped by multi-tiered book STACKS, wrapped by READING ROOMS; a grand ENTRANCE (steps + colonnade) opening onto a PIAZZA/plaza; an administration wing; an inner reading COURTYARD/garden. A library is BUILDING-dominant.'],
    layout:['The library BUILDING is a big columned mass filling the plot, wrapped around an inner reading COURTYARD (a garden + centre sculpture) with the multi-tiered STACKS + reading detail around it, admin + community wings at the back corners.',
      'A grand COLONNADE of columns spans the south front; broad entrance STEPS drop to the PIAZZA/plaza with a dead central FOUNTAIN + planters.',
      'A dead reading GARDEN + trees ring the building on its terrace/sidewalk.',
      'A small drop-off drive + two side lots (minimal — a library is a building, not a lot) meet the street; book-return kiosks + pole lights dress the plaza.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: a drop-off drive on the primary street feeds two small side lots (code 1 reaches them from the curb, K.driveReachFromStreet). Foot circulation is the piazza -> steps -> colonnade -> the building. WALKABLE-LAND: the plot is nearly ALL building + plaza + garden — content dominates overwhelmingly; the lots are minimal. Corner side streets get a pedestrian gate onto the piazza.',
    layering:'GROUND plane (walk/drive, flat): the piazza (7), reading garden (4), sidewalk/terrace (13), the reading courtyard (12), the drive/lots (1, drive), desert (0). STRUCTURES (¾ front face, solid, ENTERABLE): the LIBRARY (2 -> circulation + stacks + reading rooms interior) with its stack/reading detail (11), the COLONNADE columns (8), the entrance STEPS (6). PROPS: the dead FOUNTAIN/sculpture (10), pole lights (9), book-return kiosks (13), dead trees (3). PORTALS: the gate (5). The columned mass + colonnade are the vertical hero; you cross the piazza and climb the steps into it.',
    decisions:['Act-1 DEAD: broken windows + chained doors, the stacks spilled + rotting, a dry fountain, cracked pavers, a toppled column or two. Books are a knowledge/scarcity resource (Paolo\'s + the economy\'s to rule — what survives on the shelves is his).',
      'Civic category (library). Zero purple. No library name/inscription (Paolo\'s to author).',
      'WALKABLE-LAND LAW honored (easily): a library IS its building — the plot is nearly all structure + plaza + garden, lots minimal.',
      'Research-first (per the playbook): built from real central-library plans (core -> stacks -> reading rooms), not memory.']
  };
  K.register('library', { generate:generate, body:function(c){return c===2;}, category:'civic', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaLibrary=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
