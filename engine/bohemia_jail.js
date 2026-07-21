// BOHEMIA JAIL (7/21/26). CIVIC, on the DISTRICT KIT. Research-first (jail/prison layout — NIC Jail
// Design Guide, prison-zone breakdowns, Fremantle architecture): a secure PERIMETER WALL topped with
// razor wire and GUARD TOWERS at the corners; CELL BLOCKS (housing pods) radiating off a central
// control hub; a walled RECREATION YARD; an ADMIN block + intake with a vehicle SALLY PORT; strict
// public/secure separation. Content-dominant (cell blocks + walls). Act-1 DEAD: cell doors sprung, the
// yard cracked, towers empty, the wire rusted. Street-aware + drivable (intake sally lane). Full dossier.
// LEGEND:
//  0 desert  1 drive/lot (DRIVABLE)  2 building (cell block/admin)  3 dead brush  4 secure yard concrete
//  5 gate  6 guard tower  7 recreation yard  8 razor wire (wall top)  9 pole light  10 sally port
//  11 marking  12 perimeter wall  13 cell detail
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;
  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    // a CELL BLOCK: a housing pod — a solid bar lined on both faces with individual cell divisions
    function block(x0,y0,x1,y1){ G.rect(x0,y0,x1,y1,2);
      for(var xx=x0+2;xx<x1-1;xx+=3){ set(xx,y0,13); set(xx,y1,13); }    // cell-door rhythm on both faces
      for(var yy=y0+3;yy<y1-1;yy+=6){ G.rect(x0,yy,x1,yy,4); }           // dayroom cross-slots
    }
    // ---- BASE: secure-yard concrete inside a DOUBLE WALL; desert at the margins ----
    G.rect(0,0,W-1,H-1,0); G.rect(6,8,W-7,H-7,4);
    G.frame(12); for(x=8;x<W-8;x++){set(x,11,12);set(x,H-12,12);} for(y=11;y<H-11;y++){set(8,y,12);set(W-9,y,12);}
    for(x=6;x<W-6;x+=2){ set(x,6,8); set(x,H-7,8); } for(y=6;y<H-6;y+=2){ set(6,y,8); set(W-7,y,8); } // razor-wire wall top
    // ---- GUARD TOWERS at the four corners (over the wall) ----
    [[10,12],[W-13,12],[10,H-14],[W-13,H-14]].forEach(function(p){ G.rect(p[0],p[1],p[0]+4,p[1]+4,6); });
    // ---- CELL BLOCKS radiating off a central control HUB (the hero) ----
    G.rect(56,54,74,72,2); set(65,63,11);                               // central control hub
    block(20,20,116,30);                                                // north housing block
    block(20,96,116,106);                                              // south housing block
    block(20,40,30,88); block(106,40,116,88);                          // east + west housing wings
    // ---- walled RECREATION YARDS between the blocks ----
    G.rect(34,40,52,88,7); G.rect(84,40,102,88,7);
    for(x=36;x<=100;x+=6){ if(get(x,64)===7)set(x,64,11); }             // yard court lines
    // ---- ADMIN / INTAKE block + a vehicle SALLY PORT at the entrance (south) ----
    G.rect(40,108,88,118,2); G.rect(58,104,72,110,10);                  // admin + the enclosed sally port
    [[12,16],[114,16],[12,110],[114,110]].forEach(function(p){ set(p[0],p[1],9); });
    for(i=0;i<8;i++){ var bx=6+Math.floor(r()*2), by=10+Math.floor(r()*(H-20)); if(get(bx,by)===0)set(bx,by,3); }
    // ---- ENTRANCE / sally lane off the SOUTH street (rotated to the real street by the kit) ----
    var gx=W>>1;
    G.rect(gx-2,100,gx+2,H-1,1);
    for(y=H-1;y>=100;y--)for(x=-2;x<=2;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4||c===12||c===8||c===10)set(gx+x,y,1); }
    for(i=-2;i<=2;i++)set(gx+i,H-1,5);
    return g;
  }
  function generate(seed,opts){ opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:12});
    var g=res.g; return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})}; }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }
  var PALETTE={0:'#1c1a15',1:'#3a3a42',2:'#6f6a62',3:'#3a4526',4:'#4a4842',5:'#c79a3f',6:'#8a8478',
    7:'#55603a',8:'#9a948a',9:'#8f8676',10:'#5a5f66',11:'#c9c1aa',12:'#6a6a72',13:'#2a2824'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt outside the wall (setback)'},
    1:{name:'drive / lot',        kind:'drive',      act1:'the intake sally lane / service drive (car-drivable)'},
    2:{name:'building (cell block/admin)',kind:'building',act1:'a cell block / the admin+intake block, concrete, slit windows', enter:'block interior: the two-tier cell tiers around a dayroom, the control picket at the hub; admin = intake, property, holding'},
    3:{name:'dead brush',         kind:'tree-dead',  act1:'dead brush caught in the wall + wire', solid:false},
    4:{name:'secure yard concrete',kind:'ground',    act1:'the secure-yard concrete between the blocks, cracked'},
    5:{name:'gate',               kind:'gate',       act1:'the intake gate off the street, amber curb, the outer sally door'},
    6:{name:'guard tower',        kind:'structure',  act1:'a corner guard tower over the wall, glass gone, empty', solid:true},
    7:{name:'recreation yard',    kind:'ground',     act1:'a walled recreation yard, dead dirt + a ghosted court line'},
    8:{name:'razor wire (wall top)',kind:'structure',act1:'coiled razor wire crowning the perimeter wall, rusted'},
    9:{name:'pole light',         kind:'prop',       act1:'a yard security light, head dark'},
    10:{name:'sally port',        kind:'structure',  act1:'the enclosed vehicle sally port (secure transfer), doors seized', solid:true},
    11:{name:'marking',           kind:'marking',    act1:'faded yard / control markings'},
    12:{name:'perimeter wall',    kind:'structure',  act1:'the double secure perimeter wall, concrete', solid:true},
    13:{name:'cell detail',       kind:'structure',  act1:'the individual cell-door rhythm on a block face, doors sprung', solid:true}
  };
  var NOTES={
    summary:'A dead jail — cell blocks radiating off a central control hub inside a double razor-wire perimeter wall with corner guard towers, walled recreation yards between the blocks, an admin/intake block with a vehicle sally port at the gate.',
    reference:['Jail/prison layout (NIC Jail Design Guide, prison-zone breakdowns, Fremantle architecture): a secure PERIMETER WALL/fence topped with razor wire + corner GUARD TOWERS; CELL BLOCKS (housing pods) often radiating off a central CONTROL hub; walled RECREATION YARDS; an ADMIN + intake zone with a vehicle SALLY PORT; strict public/secure separation + security rings.'],
    layout:['A DOUBLE perimeter WALL crowned with razor wire rings the site, GUARD TOWERS at the four corners (desert outside).',
      'CELL BLOCKS (the hero — housing pods with a cell-door rhythm on both faces) radiate off a central CONTROL hub: a north + south block and east + west wings.',
      'Walled RECREATION YARDS sit between the blocks with a ghosted court line.',
      'An ADMIN / intake block with an enclosed vehicle SALLY PORT sits at the south gate.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the intake gate is on the primary street; the sally lane / service drive (code 1) reaches the intake from the curb (K.driveReachFromStreet). WALKABLE-LAND: the cell blocks + walls + towers + yards dominate; the drive is minimal. Corner side streets get a pedestrian gate. Public and secure are strictly separated (the design rule).',
    layering:'GROUND plane (walk/drive, flat): the secure-yard concrete (4), recreation yards (7), the drive (1, drive), markings (11), desert (0). STRUCTURES (¾ front face, solid, ENTERABLE): the CELL BLOCKS + admin (2 -> tiers/dayroom/control; intake/holding) with the cell-door detail (13), the GUARD TOWERS (6), the SALLY PORT (10), the perimeter WALL (12), razor WIRE (8). PROPS: pole lights (9), dead brush (3). PORTALS: the gate (5). The radiating cell blocks + walls + towers are the mass; you cross the secure yards between them.',
    decisions:['Act-1 DEAD: cell doors sprung, the yard cracked, towers empty, the wire rusted, the doors hanging. Who is (or was) held here, and who holds it now, is faction canon (Paolo\'s).',
      'Civic category (jail). Zero purple.',
      'WALKABLE-LAND honored: cell blocks + walls + towers + yards dominate; drive minimal.',
      'Research-first (per the playbook): built from real jail/prison layouts, not memory.']
  };
  K.register('jail', { generate:generate, body:function(c){return c===2;}, category:'civic', palette:PALETTE, legend:LEGEND, notes:NOTES });
  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API; root.BohemiaJail=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
