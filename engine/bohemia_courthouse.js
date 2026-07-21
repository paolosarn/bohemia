// BOHEMIA COURTHOUSE (7/21/26). CIVIC, on the DISTRICT KIT. Research-first (civic/courthouse design +
// classical civic buildings — grand columned mass, portico, dome, monumental steps to a plaza, office
// wings, a secure prisoner sally port): the classic seat-of-law form. Building-dominant. Act-1 DEAD:
// boarded, the dome streaked, columns cracked, the plaza weed-split, justice long fled. Street-aware +
// drivable (a small lot + a secure sally lane). Full dossier + layering. Hero: the columned building
// + dome + grand steps.
// LEGEND:
//  0 desert  1 drive/lot (DRIVABLE)  2 building (courthouse)  3 landscaping  4 lawn  5 gate
//  6 grand steps  7 plaza  8 portico columns  9 pole light  10 dome/cupola  11 statue/monument  12 sidewalk  13 flagpole
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;
  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    // ---- BASE: civic lawn + sidewalk terrace; desert at the margins ----
    G.rect(0,0,W-1,H-1,0); G.rect(5,7,W-6,H-6,4); G.rect(8,10,120,96,12);
    // ---- the COURTHOUSE: a big columned mass with office wings + a central DOME ----
    G.rect(16,12,112,74,2);                                              // the main block
    G.rect(16,12,34,74,2); G.rect(94,12,112,74,2);                       // the office wings (reads as a massed civic building)
    for(x=20;x<=108;x+=6) set(x,12,11); for(y=18;y<=68;y+=6){ set(16,y,11); set(112,y,11); } // window/cornice detail
    G.disc(64,34,12,10); G.disc(64,34,7,2); set(64,22,11);              // the DOME / cupola over the rotunda
    // ---- grand PORTICO of columns + monumental STEPS down to the PLAZA ----
    G.rect(40,74,88,78,8); for(x=42;x<=86;x+=5) G.rect(x,74,x+1,82,8);   // the portico colonnade
    for(y=82;y<=94;y++) G.rect(38,y,90,y,6);                            // the monumental steps (widening down)
    G.rect(24,96,104,116,7);                                            // the civic plaza
    set(64,106,11); set(63,105,11); set(65,105,11); set(64,104,11); set(64,107,11); // the justice statue/monument
    set(44,100,13); set(84,100,13);                                     // flagpoles flanking the plaza
    // ---- landscaping + a small VISITOR lot + a SECURE sally lane at the side ----
    for(x=12;x<=116;x+=10){ if(get(x,14)===12)set(x,14,3); }
    G.rect(10,98,22,114,1); G.rect(106,98,118,114,1); for(y=102;y<=110;y+=4){ set(14,y,12); set(110,y,12); }
    G.rect(106,60,118,74,2); set(112,74,10);                            // the prisoner SALLY PORT bay on the secure wing
    [[10,96],[120,96],[10,114],[64,114]].forEach(function(p){ set(p[0],p[1],9); });
    // ---- ENTRANCE off the SOUTH street (rotated to the real street by the kit) ----
    var gx=W>>1;
    G.rect(gx-2,114,gx+2,H-1,1);
    for(y=H-1;y>=114;y--)for(x=-2;x<=2;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4||c===12)set(gx+x,y,1); }
    G.rect(10,114,gx,117,1); G.rect(gx,114,118,117,1);
    for(i=-2;i<=2;i++)set(gx+i,H-1,5);
    return g;
  }
  function generate(seed,opts){ opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4||c===12; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:12, pedOver:soft, pedInset:12});
    var g=res.g; return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})}; }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }
  var PALETTE={0:'#1c1a15',1:'#3a3a42',2:'#7a7365',3:'#3a4526',4:'#49512e',5:'#c79a3f',6:'#8a8175',
    7:'#8f8676',8:'#a89e8a',9:'#8f8676',10:'#9a9082',11:'#b0863a',12:'#6a675e',13:'#c79a3f'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt at the civic-square edge (setback)'},
    1:{name:'drive / lot',        kind:'drive',      act1:'the small visitor lot + the secure sally lane (car-drivable)'},
    2:{name:'building (courthouse)',kind:'building',  act1:'the courthouse — columned stone mass + office wings, boarded, seals defaced', enter:'courthouse interior: the rotunda + courtrooms off the public hall, clerk + records + judges\' chambers in the wings, holding by the sally port'},
    3:{name:'landscaping',        kind:'tree-dead',  act1:'a dead civic tree / hedge on the square', solid:false},
    4:{name:'lawn',               kind:'ground',     act1:'the dead civic-square lawn'},
    5:{name:'gate',               kind:'gate',       act1:'the civic-square entrance off the street, amber curb'},
    6:{name:'grand steps',        kind:'structure',  act1:'the monumental stone steps rising to the portico'},
    7:{name:'plaza',              kind:'ground',     act1:'the civic plaza before the steps, cracked pavers, weeds'},
    8:{name:'portico columns',    kind:'structure',  act1:'the grand portico colonnade across the front, a column or two cracked', solid:true},
    9:{name:'pole light',         kind:'prop',       act1:'a civic pole light, head dark'},
    10:{name:'dome / cupola',     kind:'structure',  act1:'the central dome / cupola over the rotunda, copper streaked green-black', solid:true},
    11:{name:'statue / monument', kind:'prop',       act1:'the Justice statue / civic monument on the plaza, weathered', solid:true},
    12:{name:'sidewalk',          kind:'ground',     act1:'the civic-square terrace / sidewalk, cracked'},
    13:{name:'flagpole',          kind:'prop',       act1:'a flagpole flanking the plaza, halyard slapping'}
  };
  var NOTES={
    summary:'A dead courthouse — a grand columned stone building with office wings and a central dome, a portico + monumental steps down to a civic plaza with the Justice statue + flagpoles, a small visitor lot + a prisoner sally port on the secure wing.',
    reference:['Civic / courthouse design (classical seat-of-law: a grand columned MASS + PORTICO + central DOME/rotunda, monumental STEPS to a civic PLAZA, office WINGS, a secure prisoner SALLY PORT for transport, a statue of Justice): the monumental civic building form.'],
    layout:['The COURTHOUSE is the hero: a big columned stone mass with office WINGS and a central DOME over the rotunda, window/cornice detail down its face.',
      'A grand PORTICO colonnade + monumental STEPS descend to a civic PLAZA with the Justice STATUE + flanking FLAGPOLES.',
      'A small VISITOR lot flanks the plaza; a prisoner SALLY PORT bay sits on the secure wing; dead landscaping edges the square.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: a small drive on the primary street feeds the visitor lot + the secure sally lane (code 1 reaches them from the curb, K.driveReachFromStreet). Foot circulation is the plaza -> steps -> portico. WALKABLE-LAND: a courthouse IS its building — nearly all structure + plaza; the lots are minimal. Corner side streets get a pedestrian gate onto the plaza.',
    layering:'GROUND plane (walk/drive, flat): the plaza (7), lawn (4), sidewalk (12), the drive/lot (1, drive), desert (0). STRUCTURES (¾ front face, solid, ENTERABLE): the COURTHOUSE (2 -> rotunda + courtrooms + chambers + holding) with the DOME (10) + PORTICO columns (8) + grand STEPS (6). PROPS: the Justice STATUE (11), FLAGPOLES (13), pole lights (9), dead landscaping (3). PORTALS: the gate (5), the sally port. The columned mass + dome are the vertical hero; you climb the steps through the portico.',
    decisions:['Act-1 DEAD: boarded, the dome streaked, columns cracked, seals defaced, the plaza weed-split. Whose law rules now is faction canon (Paolo\'s).',
      'Civic category (courthouse). Zero purple. No jurisdiction/seal (Paolo\'s to author).',
      'WALKABLE-LAND honored (easily): the building + plaza dominate; lots minimal.',
      'Research-first (per the playbook): built from the classical courthouse form, not memory.']
  };
  K.register('courthouse', { generate:generate, body:function(c){return c===2;}, category:'civic', palette:PALETTE, legend:LEGEND, notes:NOTES });
  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API; root.BohemiaCourthouse=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
