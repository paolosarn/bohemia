// BOHEMIA CITY HALL (7/23/26). CIVIC, on the DISTRICT KIT. Paolo: "look at all the pocket city 2
// buildings, we have to make them as districts" — the municipal seat (Town Hall / City Hall) is a
// Pocket City 2 Service-building staple Bohemia never had: the EXECUTIVE/ADMINISTRATIVE government
// building (mayor's office, council chamber, city clerk, permits counter), distinct from
// bohemia_courthouse.js (JUDICIAL — courtrooms, chambers, a prisoner sally port). Research-first
// (US municipal civic-center precedent — a modern low-rise administrative block, NOT the classical
// colonnaded language courthouse already owns): a wide low block with a CLOCK TOWER landmark, a
// public forecourt PLAZA with a DRY reflecting fountain and flagpoles (the "come to a public
// meeting" civic read), a notice/bulletin kiosk, modest visitor parking (city hall draws walk-ins +
// bus riders, not commuter volume). Act-1 DEAD: fountain dry and cracked, clock stopped, doors
// chained, the civic seal toppled, notices long since rotted off the kiosk. Street-aware + drivable.
// LEGEND:
//  0 desert dead-ground   1 drive / lot        2 building (city hall)   3 dead landscaping
//  4 lawn                 5 gate                6 clock tower            7 plaza
//  8 dry fountain          9 pole light          10 civic seal / monument 11 sidewalk
//  12 flagpole             13 bulletin / notice kiosk
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }

    // ---- BASE: dead lawn; desert only at the margins ----
    G.rect(0,0,W-1,H-1,0);
    G.rect(6,4,W-7,H-6,4);

    // ---- THE CIVIC BLOCK: a wide low modern municipal building + a CLOCK TOWER landmark ----
    G.rect(16,14,112,50,2);                                              // the administrative block (the mass)
    G.rect(56,0,72,14,6);                                                 // the clock tower rising off its north face
    for(x=20;x<=108;x+=6) set(x,14,11);                                  // window-line / parapet read along the front face
    for(y=2;y<=12;y+=4) set(56,y,11); for(y=2;y<=12;y+=4) set(72,y,11);  // tower window bands

    // ---- THE PUBLIC PLAZA: dry reflecting fountain, flagpoles, civic seal, notice kiosk ----
    G.rect(16,54,112,88,7);
    G.disc(64,71,9,8);                                                   // the dry reflecting fountain (the plaza hero)
    set(64,71,8);
    set(40,72,12); set(88,72,12);                                        // flagpoles flanking the fountain
    set(64,86,10);                                                       // civic seal / monument at the plaza's entry edge
    set(28,86,13); set(100,86,13);                                       // bulletin / notice kiosks
    for(i=0;i<8;i++){ var px=20+Math.floor(r()*88), py=58+Math.floor(r()*10); if(get(px,py)===7 && (i%3===0)) set(px,py,7); }

    // ---- SIDEWALK band linking plaza to the visitor lot ----
    G.rect(16,88,112,92,11);

    // ---- VISITOR LOT (SMALL — city hall draws walk-ins + bus riders, not commuter volume) ----
    G.rect(30,98,98,120,1);

    // ---- POLE LIGHTS + dead landscaping at the margins ----
    [[12,20],[116,20],[12,110],[116,110]].forEach(function(p){ set(p[0],p[1],9); });
    for(i=0;i<12;i++){ var tx=8+Math.floor(r()*4), ty=6+Math.floor(r()*(H-14)); if(get(tx,ty)===4)set(tx,ty,3); }
    for(i=0;i<12;i++){ var tx2=W-8+Math.floor(r()*4), ty2=6+Math.floor(r()*(H-14)); if(get(tx2,ty2)===4)set(tx2,ty2,3); }

    // ---- ENTRANCE / LOT CONNECTOR off the SOUTH street (rotated to the real street by the kit) ----
    var gx=W>>1;
    for(i=-4;i<=4;i++)set(gx+i,H-1,5);
    G.rect(gx-3,92,gx+3,H-1,1);
    for(y=H-1;y>=92;y--)for(x=-3;x<=3;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4)set(gx+x,y,1); }
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:11, pedOver:soft, pedInset:14});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})};
  }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  var PALETTE={0:'#1c1a15',1:'#4a463c',2:'#726a58',3:'#3a4526',4:'#49512e',5:'#c79a3f',6:'#847a64',
    7:'#8f887a',8:'#5a6660',9:'#8f8676',10:'#9c8e76',11:'#b7ae98',12:'#8a7f5e',13:'#635c4a'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt at the civic-block edge (setback)'},
    1:{name:'drive / lot',        kind:'drive',      act1:'the small visitor lot + entrance drive (car-drivable)'},
    2:{name:'building (city hall)',kind:'building',  act1:'the administrative block — mayor\'s office, council chamber, clerk + permits counter — windows boarded, doors chained', enter:'city hall interior: the public counter + records hall up front, the council chamber behind it, the mayor\'s + department offices in the wings'},
    3:{name:'dead landscaping',   kind:'tree-dead',  act1:'a dead civic tree / hedge at the lawn edge', solid:false},
    4:{name:'lawn',               kind:'ground',     act1:'the dead civic lawn ringing the block'},
    5:{name:'gate',               kind:'gate',       act1:'the lot entrance off the street, amber curb'},
    6:{name:'clock tower',        kind:'structure',  act1:'the clock tower over the entrance, hands stopped, face cracked', solid:true},
    7:{name:'plaza',              kind:'ground',     act1:'the public forecourt plaza before city hall, pavers cracked, weeds through the joints'},
    8:{name:'dry fountain',       kind:'water-dead', act1:'the reflecting fountain at the plaza\'s center, bone dry, basin stained with old waterlines'},
    9:{name:'pole light',         kind:'prop',       act1:'a plaza pole light, head dark'},
    10:{name:'civic seal / monument',kind:'prop',    act1:'the city seal monument at the plaza entry, toppled, bronze gone green', solid:true},
    11:{name:'sidewalk',          kind:'ground',     act1:'the sidewalk band linking the plaza to the visitor lot, cracked'},
    12:{name:'flagpole',          kind:'prop',       act1:'a flagpole flanking the fountain, halyard slapping, no flag left'},
    13:{name:'bulletin / notice kiosk',kind:'prop',  act1:'a public-notice kiosk at the plaza edge, the meeting agendas long since rotted off', solid:true}
  };
  var NOTES={
    summary:'A dead city hall — a wide low modern administrative block with a stopped clock tower, a public forecourt plaza with a bone-dry reflecting fountain and flagpoles, a civic-seal monument, notice kiosks, a sidewalk to a small visitor lot. The executive/administrative seat, distinct from the judicial courthouse.',
    reference:['US municipal civic-center precedent: a modern low-rise administrative block (mayor\'s office, council chamber, city clerk, permits counter) rather than the classical colonnaded language a courthouse uses; a CLOCK TOWER is the conventional City Hall landmark feature; a public forecourt PLAZA with a reflecting fountain and flagpoles reads as "come to a public meeting" civic space; visitor parking stays modest — city hall draws walk-ins and bus/transit riders, not commuter volume, unlike a big-box civic campus.'],
    layout:['The ADMINISTRATIVE BLOCK sits at the back (north) of the lot with the CLOCK TOWER rising off its front face — the vertical landmark, distinct from courthouse\'s dome.',
      'A public PLAZA fills the forecourt: a dry reflecting FOUNTAIN at its center, flagpoles flanking it, the civic SEAL monument near the entry edge, notice KIOSKS at the plaza corners.',
      'A SIDEWALK band links the plaza to a small VISITOR lot (SW) — modest, not commuter-scaled.',
      'Dead landscaping edges the lawn; pole lights mark the lot corners.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the visitor lot + entrance drive (code 1) reach the curb from any placement (K.driveReachFromStreet). Corner side streets get a pedestrian gate onto the sidewalk/plaza rather than a second car entrance. Foot circulation is plaza -> sidewalk -> tower entrance.',
    layering:'GROUND plane (walk/drive, flat): the plaza (7), lawn (4), sidewalk (11), the dry fountain basin (8, water-dead), the drive/lot (1, drive), desert (0). STRUCTURES (¾ front face, solid, ENTERABLE): the CITY HALL block (2 -> public counter/records, council chamber, mayor\'s + department offices) with the CLOCK TOWER (6). PROPS: the civic seal monument (10), flagpoles (12), notice kiosks (13), pole lights (9). PORTALS: the gate (5). The block + tower are the vertical mass; the plaza and its dry fountain are the public forecourt you cross to reach the doors.',
    decisions:['Act-1 DEAD: the clock stopped, doors chained, fountain bone dry with old waterline stains, the civic seal toppled and oxidized, notices rotted off the kiosk. Whose administration (if any) runs it now is faction canon (Paolo\'s).',
      'Civic category (cityhall), filed alongside courthouse/library/firestation. Zero purple.',
      'Deliberately differentiated from courthouse: a modern administrative block + clock tower (not classical columns + dome), a fountain-centered public plaza (not just cracked pavers), no sally port (city hall has no jail function).',
      'WALKABLE-LAND honored: the block + tower + plaza dominate; the visitor lot is minimal by design (walk-in/transit civic use, not commuter parking).',
      'Research-first (per the playbook): built from real municipal civic-center precedent, not memory.']
  };
  K.register('cityhall', { generate:generate, body:function(c){return c===2;}, category:'civic', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaCityhall=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
