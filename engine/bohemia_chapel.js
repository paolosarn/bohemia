// BOHEMIA CHURCH (7/21/26). CIVIC, on the DISTRICT KIT. Research-first (church architecture — Keiser
// Design parts of a church, UMC narthex/nave, cruciform cathedral plans): a CRUCIFORM (Latin-cross)
// building — NARTHEX (entry) + long NAVE crossed by the TRANSEPTS, the SANCTUARY/apse at the head — a
// BELL TOWER flanking the entrance, a forecourt PLAZA/atrium with an arcade, a memorial garden. A
// church is BUILDING-dominant. Act-1 DEAD: shattered stained glass, the bell silent, doors chained,
// the garden dead. Street-aware + drivable (a small lot). Full dossier + layering. Hero: the cross-plan
// building + the bell tower.
// LEGEND:
//  0 desert  1 drive/lot (DRIVABLE)  2 building (church)  3 dead tree  4 memorial garden  5 gate
//  6 bell tower  7 forecourt plaza  8 arcade columns  9 pole light  10 cross / statue  11 stained glass
//  12 sidewalk
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;
  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    // ---- BASE: churchyard lawn + sidewalk terrace; desert at the margins ----
    G.rect(0,0,W-1,H-1,0); G.rect(5,7,W-6,H-6,4); G.rect(8,10,120,96,12);
    // ---- the CRUCIFORM CHURCH (Latin cross): nave + transepts + apse + narthex ----
    G.rect(52,22,76,86,2);                                               // the long NAVE
    G.rect(30,44,98,62,2);                                               // the TRANSEPTS (cross arms)
    G.disc(64,22,11,2);                                                  // the SANCTUARY / apse (rounded head, north)
    G.rect(46,84,82,94,2);                                               // the NARTHEX (entry vestibule, south)
    // stained-glass windows down the nave + transept ends + a rose window in the apse
    for(y=28;y<=82;y+=6){ set(52,y,11); set(76,y,11); } for(y=48;y<=58;y+=4){ set(30,y,11); set(98,y,11); }
    set(64,16,11); set(60,18,11); set(68,18,11);
    // ---- BELL TOWER flanking the entrance (tall, SW of the narthex) ----
    G.rect(36,84,46,112,6); G.rect(38,86,44,88,11); set(41,84,10);       // tower + belfry window + a cross finial
    // ---- forecourt PLAZA + arcade + a cross/statue in front ----
    G.rect(30,96,98,114,7); for(x=34;x<=94;x+=6) G.rect(x,94,x+1,96,8);  // plaza + the entrance arcade columns
    set(64,105,10); set(63,104,10); set(65,104,10); set(64,103,10);      // the churchyard cross / statue
    // ---- memorial GARDEN + dead trees at the sides; a small parking + drive ----
    G.rect(10,64,28,92,4); G.rect(100,64,118,92,4); for(x=12;x<=116;x+=8){ if(get(x,68)===4)set(x,68,3); if(get(x,88)===4)set(x,88,3); }
    G.rect(102,98,118,114,1); for(y=102;y<=110;y+=4){ set(106,y,12); set(112,y,12); }
    [[10,96],[120,96],[10,114],[64,114]].forEach(function(p){ set(p[0],p[1],9); });
    // ---- ENTRANCE off the SOUTH street (rotated to the real street by the kit) ----
    var gx=W>>1;
    G.rect(gx-2,114,gx+2,H-1,1);
    for(y=H-1;y>=114;y--)for(x=-2;x<=2;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4||c===12)set(gx+x,y,1); }
    G.rect(gx,114,110,117,1);
    for(i=-2;i<=2;i++)set(gx+i,H-1,5);
    return g;
  }
  function generate(seed,opts){ opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4||c===12; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:12, pedOver:soft, pedInset:12});
    var g=res.g; return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})}; }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }
  var PALETTE={0:'#1c1a15',1:'#3a3a42',2:'#7a7060',3:'#3a4526',4:'#49512e',5:'#c79a3f',6:'#6f665a',
    7:'#8f8676',8:'#a89e8a',9:'#8f8676',10:'#b0863a',11:'#4a6a72',12:'#6a675e'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt at the churchyard edge (setback)'},
    1:{name:'drive / lot',        kind:'drive',      act1:'the small church parking + drop-off drive (car-drivable)'},
    2:{name:'building (church)',  kind:'building',   act1:'the cruciform church — stone walls, roof steep, doors chained', enter:'church interior: the narthex, the long nave of pews to the altar at the apse, the transept chapels off the crossing'},
    3:{name:'dead tree',          kind:'tree-dead',  act1:'a dead churchyard tree / shrub', solid:false},
    4:{name:'memorial garden',    kind:'ground',     act1:'the dead memorial garden / churchyard lawn'},
    5:{name:'gate',               kind:'gate',       act1:'the churchyard entrance off the street, amber curb'},
    6:{name:'bell tower',         kind:'structure',  act1:'the bell tower flanking the entrance, tall, the bell silent, a cross finial atop', solid:true},
    7:{name:'forecourt plaza',    kind:'ground',     act1:'the forecourt piazza before the doors, cracked pavers, weeds'},
    8:{name:'arcade columns',     kind:'structure',  act1:'the entrance arcade / colonnade across the front', solid:true},
    9:{name:'pole light',         kind:'prop',       act1:'a churchyard pole light, head dark'},
    10:{name:'cross / statue',    kind:'prop',       act1:'the churchyard cross / a memorial statue, weathered', solid:true},
    11:{name:'stained glass',     kind:'structure',  act1:'a stained-glass window (nave/transept/rose), shattered, lead buckled'},
    12:{name:'sidewalk',          kind:'ground',     act1:'the churchyard terrace / sidewalk, cracked'}
  };
  var NOTES={
    summary:'A dead church — a cruciform stone building (narthex + long nave crossed by the transepts, the sanctuary apse at the head), a bell tower flanking the entrance, a forecourt plaza with an arcade + a churchyard cross, a memorial garden, a small lot.',
    reference:['Church architecture (Keiser Design parts of a church, UMC narthex/nave, cruciform cathedral plans): a CRUCIFORM (Latin-cross) plan — the NARTHEX (entry) + the long NAVE crossed by the TRANSEPTS (cross arms), the SANCTUARY/apse at the head; a BELL TOWER/spire flanking the entrance; often a forecourt COURTYARD/atrium + arcade; stained-glass windows down the nave.'],
    layout:['A CRUCIFORM CHURCH is the hero: the long NAVE crossed by the TRANSEPTS, the rounded SANCTUARY apse at the north head, the NARTHEX vestibule at the south entrance, stained-glass windows down its length.',
      'A BELL TOWER (with a cross finial) flanks the entrance; a forecourt PLAZA with an entrance arcade + a churchyard cross/statue fronts the doors.',
      'A memorial GARDEN + dead trees flank the church on its terrace; a small parking + drop-off drive meets the street.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: a small drop-off drive on the primary street feeds the lot (code 1 reaches it from the curb, K.driveReachFromStreet). Foot circulation is the forecourt plaza -> arcade -> narthex. WALKABLE-LAND: a church IS its building — the plot is nearly all structure + plaza + garden; the lot is minimal. Corner side streets get a pedestrian gate onto the plaza.',
    layering:'GROUND plane (walk/drive, flat): the forecourt plaza (7), memorial garden (4), sidewalk (12), the drive/lot (1, drive), desert (0). STRUCTURES (¾ front face, solid, ENTERABLE): the cruciform CHURCH (2 -> narthex/nave/altar/transept chapels) with its STAINED GLASS (11), the BELL TOWER (6), the arcade COLUMNS (8). PROPS: the churchyard CROSS/statue (10), pole lights (9), dead trees (3). PORTALS: the gate (5). The cross-plan mass + the bell tower are the vertical hero; you cross the plaza into the narthex.',
    decisions:['Act-1 DEAD: shattered stained glass, the bell silent, doors chained, the garden dead, the cross weathered. Faith + who gathers here is Paolo\'s / faction canon.',
      'Civic category (chapel/church). Zero purple. No denomination/inscription (Paolo\'s to author).',
      'WALKABLE-LAND honored (easily): the cruciform building + plaza + garden dominate; lot minimal.',
      'Research-first (per the playbook): built from real cruciform church plans, not memory.']
  };
  K.register('chapel', { generate:generate, body:function(c){return c===2;}, category:'civic', palette:PALETTE, legend:LEGEND, notes:NOTES });
  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API; root.BohemiaChapel=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
