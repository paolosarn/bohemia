// BOHEMIA POLICE STATION (7/21/26). CIVIC, on the DISTRICT KIT. Research-first (police-station design
// guides — Fentress sally-port + secure-parking best practices, BSW/MW Studios station projects): a
// big STATION building with a PUBLIC lobby separated from the SECURE side; a SALLY PORT (enclosed
// prisoner-transport garage) hidden from public view inside a fenced SECURE yard with the MOTOR POOL
// (patrol fleet) + a maintenance bay; a separate small PUBLIC visitor lot; an IMPOUND yard of seized
// wrecks; a flagpole + roof antennas. Public and secure areas are strictly separated (the key design
// rule). Act-1 DEAD: boarded lobby, patrol cars rusting, cells open, dead antennas. Street-aware +
// drivable; the big building + secure complex dominate (WALKABLE-LAND LAW). Full dossier + layering.
// LEGEND:
//  0 desert dead-ground          1 drive / lot (DRIVABLE)
//  2 building (station)           3 landscaping
//  4 secure-yard concrete         5 gate
//  6 sally port                   7 patrol car (fleet)
//  8 impound wreck                9 pole light
//  10 roof antenna / dish        11 marking / plaza   12 fence / wall   13 flagpole
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    function fenceRect(x0,y0,x1,y1){ for(x=x0;x<=x1;x++){set(x,y0,12);set(x,y1,12);} for(y=y0;y<=y1;y++){set(x0,y,12);set(x1,y,12);} }

    // ---- BASE: dead lawn; desert at the margins ----
    G.rect(0,0,W-1,H-1,0);
    G.rect(5,7,W-6,H-6,3);                                                // civic landscaping band
    G.rect(8,10,120,120,4);                                             // the campus ground (concrete/yard)

    // ---- the STATION: a big HQ block (public lobby front, secure areas back) ----
    G.rect(20,10,104,52,2);
    for(x=24;x<=100;x+=6) set(x,10,11);                                  // parapet line
    G.rect(56,52,68,58,11);                                             // the public LOBBY entrance steps (front, centre)
    G.rect(24,20,40,44,11); G.rect(84,20,100,44,11);                    // light wells (reads 2-storey + occupied)

    // ---- PUBLIC front: plaza + FLAGPOLE + a small VISITOR lot (west), separate from the secure side
    G.rect(44,60,80,70,11);                                             // public plaza
    set(62,64,13); set(63,64,13);                                       // flagpole
    G.rect(10,60,38,86,1); for(y=64;y<=82;y+=6){ for(x=13;x<=35;x+=5){ set(x,y,11);} } // visitor lot + stalls

    // ---- SECURE YARD (fenced), east+back: SALLY PORT + MOTOR POOL fleet + maintenance bay ----
    fenceRect(72,60,118,118);
    G.rect(84,52,96,60,6);                                              // the SALLY PORT (enclosed, attached to the station back)
    G.rect(100,64,118,84,2);                                            // vehicle MAINTENANCE bay
    for(var py=90; py<=112; py+=8){ for(var px=78; px<=112; px+=8){ G.rect(px,py,px+4,py+5,7); set(px+2,py+1,10); } } // MOTOR POOL patrol fleet
    G.rect(74,62,116,63,11);                                            // secure-yard hazard stripe

    // ---- IMPOUND yard (fenced), SW back: rows of seized wrecks ----
    fenceRect(10,90,66,118);
    for(py=94; py<=112; py+=8){ for(px=14; px<=58; px+=8){ if(r()<0.85)G.rect(px,py,px+4,py+5,8); } }

    // ---- roof antennas / dishes, pole lights, dead landscaping trees ----
    G.rect(30,14,31,18,10); G.rect(90,14,91,18,10); set(60,14,10);
    [[10,58],[70,58],[118,60],[10,118],[118,118]].forEach(function(p){ set(p[0],p[1],9); });
    for(i=0;i<16;i++){ var tx=6+Math.floor(r()*(W-12)), ty=8+Math.floor(r()*4); if(get(tx,ty)===3)set(tx,ty,3); }

    // ---- ENTRANCE off the SOUTH street (rotated to the real street by the kit) ----
    var gx=W>>1;
    for(i=-4;i<=4;i++)set(gx+i,H-1,5);
    G.rect(gx-3,86,gx+3,H-1,1);                                          // main drive from the street
    for(y=H-1;y>=86;y--)for(x=-3;x<=3;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4||c===12)set(gx+x,y,1); }
    G.rect(38,84,gx,88,1); G.rect(gx,84,80,88,1);                      // branch to the visitor lot + the secure-yard gate
    for(x=72;x<=80;x++) if(get(x,86)===12) set(x,86,1);                 // punch the secure fence for the drive
    set(76,60,1); for(y=60;y<=88;y++) if(get(76,y)===12) set(76,y,1);  // secure-yard entry lane
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

  var PALETTE={0:'#1c1a15',1:'#3a3a42',2:'#6a6f7a',3:'#3a4526',4:'#4a4842',5:'#c79a3f',6:'#5a5f66',
    7:'#cfcfc6',8:'#7a5040',9:'#8f8676',10:'#8a8478',11:'#b0b0a4',12:'#6a6a72',13:'#b0863a'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt at the campus edge (setback)'},
    1:{name:'drive / lot',        kind:'drive',      act1:'the entrance drive + visitor lot + secure-yard lane (car-drivable)'},
    2:{name:'building (station)', kind:'building',   act1:'the police HQ — public lobby front, dark, windows barred; the secure wing behind', enter:'station interior: public lobby + records + duty desk up front; behind the secure line, cells + evidence + squad + the sally-port bay'},
    3:{name:'landscaping',        kind:'tree-dead',  act1:'a dead civic shrub / tree at the campus edge', solid:false},
    4:{name:'secure-yard concrete',kind:'ground',    act1:'the concrete of the fenced secure yard / campus ground, cracked'},
    5:{name:'gate',               kind:'gate',       act1:'the campus drive entrance off the street, amber curb'},
    6:{name:'sally port',         kind:'structure',  act1:'the enclosed sally-port bay (prisoner transport) on the station back, door seized', solid:true},
    7:{name:'patrol car (fleet)', kind:'vehicle',    act1:'a black-and-white patrol car in the secure motor pool, faded, tyres flat', solid:true},
    8:{name:'impound wreck',      kind:'vehicle',    act1:'a seized / wrecked car in the fenced impound yard, rusting', solid:true},
    9:{name:'pole light',         kind:'prop',       act1:'a campus pole light, head dark'},
    10:{name:'roof antenna / dish',kind:'structure', act1:'a dead comms antenna / dish on the station roof'},
    11:{name:'marking / plaza',   kind:'ground',     act1:'the public plaza + entrance steps + faded stall/hazard paint'},
    12:{name:'fence / wall',      kind:'structure',  act1:'the secure-perimeter fence / wall separating public from secure', solid:true},
    13:{name:'flagpole',          kind:'prop',       act1:'the flagpole on the public plaza, halyard slapping'}
  };
  var NOTES={
    summary:'A dead police station — a big HQ building (public lobby front, secure wing back), a fenced secure yard with the sally port + patrol-fleet motor pool + maintenance bay, a fenced impound yard of seized wrecks, a public plaza + visitor lot + flagpole, roof antennas.',
    reference:['Police-station design guides (Fentress sally-port + secure-parking best practices, BSW / MW Studios station projects): a big STATION with a PUBLIC lobby strictly SEPARATED from the SECURE side; a SALLY PORT (enclosed prisoner-transport garage) NOT visible from public roads/parking, inside a fenced SECURE area with the MOTOR POOL fleet + a maintenance bay + fuel; a separate PUBLIC visitor entrance + lot; evidence, cells, squad behind the secure line.'],
    layout:['A big STATION HQ block sits front-centre (public lobby + entrance steps facing the street; the secure wing behind).',
      'The PUBLIC front has a plaza + flagpole + a small VISITOR lot to the west, kept separate from the secure side.',
      'A fenced SECURE YARD wraps the east + back: the SALLY PORT on the station back, the patrol-fleet MOTOR POOL, and a vehicle MAINTENANCE bay.',
      'A fenced IMPOUND yard of seized wrecks sits SW-back; roof antennas + pole lights dress the campus.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the drive enters on the primary street and branches to the PUBLIC visitor lot and, through the secure-yard gate, to the SECURE motor pool + impound (code 1 reaches them from the curb, K.driveReachFromStreet). Public and secure circulation are strictly separated (the design rule). Corner side streets get a pedestrian gate.',
    layering:'GROUND plane (drive/walk, flat): the drive + lots (1, drive), the secure-yard concrete (4), the plaza/steps + markings (11), landscaping (3), desert (0). STRUCTURES (¾ front face, solid): the STATION (2, ENTERABLE -> public lobby + secure cells/evidence/sally bay), the SALLY PORT (6), the maintenance bay (2), roof ANTENNAS (10), the secure FENCE/wall (12). VEHICLES (solid): the patrol FLEET (7), impound WRECKS (8). PROPS: pole lights (9), the FLAGPOLE (13). PORTALS: the gate (5). The HQ + secure complex are the mass; the public plaza fronts the street, the secure yard is walled behind.',
    decisions:['Act-1 DEAD: boarded lobby, barred windows, patrol cars + impound wrecks rusting, cells open, dead antennas. No officers (LIFE + factions place agents later — faction ownership is Paolo\'s).',
      'Civic category (policestation). Zero purple. No department name/badge (Paolo\'s to author).',
      'Public/secure separation honored (the key design rule); WALKABLE-LAND: the building + secure complex dominate, the lots are minimal.',
      'Research-first (per the playbook): built from real police-station site plans, not memory.']
  };
  K.register('policestation', { generate:generate, body:function(c){return c===2;}, category:'civic', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaPolicestation=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
