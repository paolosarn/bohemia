// BOHEMIA COURTHOUSE (7/21/26; REBUILT 8/2/26). CIVIC, on the DISTRICT KIT.
//
// THE REBUILD. The old district spoke classical: a PORTICO COLONNADE across the front,
// monumental steps, a justice statue, a dome, and a dead green lawn. That is a 19th-century
// county courthouse in Ohio. It was also 35.6% one building code, which is a MONOBLOCK by
// the 7/31 every-pixel-answered finding.
//
// BUILT INSTEAD ON THE ONE THIS VALLEY HAS: the LLOYD D. GEORGE U.S. COURTHOUSE (CannonDesign,
// 2000, 333 Las Vegas Blvd S). Four things make it that building and nothing else:
//   AN L-SHAPED PLAN, 450,000 sq ft, wrapping a public plaza in its elbow.
//   A THREE-STOREY ROTUNDA at the elbow, the public lobby, capped by a 60-FOOT GLASS DOME
//     on a cable truss.
//   A DRAMATIC STEEL AND ALUMINIUM CANOPY PROJECTING FROM THE TOP OF THE BUILDING, which
//     shadows the plaza below. NOT DRAWN (Paolo 8/2, no more canopies): the entrance is a
//     broad flight of STEPS and a row of PIERS instead. The reference keeps the record of
//     the real building; the plot draws what the ruling allows.
//   BLAST RESISTANCE. It was the FIRST federal building built to the post-Oklahoma-City
//     requirements, and that is not trivia -- it is why there is a wide empty setback
//     between the kerb and the wall, and a bollard line holding it.
// Clad in 22ft x 10ft precast panels and beige limestone, which is the panel grid you can
// read across its roof plates from above.
//
// ONE BUILDING (8/2 law): both legs and the rotunda share walls. The secure yard's wall is
// a fence, not a second courthouse.
//
// Act-1 DEAD: the dome is mostly sky, the plaza pavers are heaved, the bollards are still
// standing because nothing short of a truck moves them. Street-aware + drivable: one kerb
// cut to the public lot, and the SALLY PORT into the secure yard is a portal, not a second
// car entrance.
// LEGEND:
//  0 desert dead-ground   1 drive / lot (DRIVABLE)      2 courthouse (the ONE building)
//  3 dead tree            4 blast setback (hardpan)      5 gate / kerb cut
//  6 precast panel joint  7 public plaza                 8 dry basin
//  9 plaza light         10 rooftop plant               11 dome glazing
//  12 flagpole           13 walk
//  15 security bollard   16 roof edge                   17 rotunda dome
//  18 doorway (PORTAL)   19 dead car                    20 secure yard wall (FENCE)
//  21 stall marking (PAINT)  22 sally port (PORTAL)   23 plaza planter
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }

    G.rect(0,0,W-1,H-1,0);
    G.rect(3,3,W-4,H-4,4);                                   // the BLAST SETBACK, hardpan not lawn
    G.rect(8,8,120,104,13);                                  // the walks over it

    /* ---- ONE BUILDING: the L. The west leg runs north-south, the north leg east-west,
       and the ROTUNDA sits in the elbow bulging into the plaza. ---- */
    G.rect(14,14,50,82,2);                                   // the west leg
    G.rect(14,14,110,44,2);                                  // the north leg
    G.disc(52,48,19,2);                                      // THE ROTUNDA, on both legs
    G.rect(38,34,66,52,2);                                   // merged into the elbow

    /* THE DOME: read from above it is a bright RING, not a solid cap -- sixty feet of it
       was glass and most of that is gone. */
    G.disc(52,48,15,17); G.disc(52,48,10,11); G.disc(52,48,4,17);

    /* THE PRECAST PANEL GRID, 22ft x 10ft, which is what clads it and what you read on the
       roof plates from the air. */
    for(x=18;x<=106;x+=8) G.rect(x,16,x,42,6);
    for(y=20;y<=40;y+=7) G.rect(16,y,108,y,6);
    for(y=54;y<=78;y+=7) G.rect(16,y,48,y,6);
    for(x=20;x<=46;x+=8) G.rect(x,52,x,80,6);
    for(x=24;x<=100;x+=12) G.rect(x,24,x+4,28,10);           // rooftop plant along the north leg

    /* ---- THE PUBLIC PLAZA in the elbow ---- */
    G.rect(50,46,116,100,7);
    G.disc(96,80,7,8); G.disc(96,80,3,7);                    // the dry basin
    for(x=60;x<=112;x+=13) set(x,98,9);
    set(70,64,12); set(78,64,12); set(86,64,12);             // the flag row
    /* THE PLAZA IS DRESSED. A screening queue does not stand in a bare field: planters run
       the length of it, the security bollards continue INTO it as a vehicle screen, and the
       paving is scored into bands. An empty plaza is a void with a nice name. */
    for(x=66;x<=110;x+=11){ G.rect(x,68,x+5,72,23); set(x+2,70,3);
                            G.rect(x,88,x+5,92,23); set(x+2,90,3); }
    for(x=62;x<=114;x+=6) set(x,84,15);
    for(y=66;y<=96;y+=8) G.rect(54,y,114,y,13);

    /* ---- NO CANOPY (Paolo 8/2: "new rule no more canopies I only see canopies at parks
       and shit"). The cantilever is gone. A federal entrance without one is STEPS and a
       SCREENING PORCH: a broad flight up out of the plaza, the piers that carry the wall
       above them, and the doors at the head of it. Nothing overhead on this plot. ---- */
    G.rect(54,50,96,58,13);                                  // the broad entrance steps
    G.rect(58,44,74,50,18);                                  // the public doors at the head of them
    /* THE PIERS STAND AT THE FOOT OF THE STEPS, ON THE PLAZA -- not up on the flight. That
       is where a screening porch's colonnade actually is, and it keeps mass off the walk
       surface (SIDEWALK SANCTITY / the d1_kerb ratchet counts every structure written over
       a walk cell, and there is no reason to spend any). */
    for(x=56;x<=94;x+=6) G.rect(x,59,x+2,63,15);             // the entrance piers, clear of the flag row at y=64

    /* ---- THE BOLLARD LINE. The whole reason for the setback: standoff distance, held. ---- */
    for(x=14;x<=118;x+=4) set(x,106,15);
    for(y=14;y<=100;y+=4) set(122,y,15);

    /* ---- THE SECURE YARD on the west: walled, with the SALLY PORT into the west leg.
       This is the half of a courthouse a city hall does not have. ---- */
    G.rect(6,86,46,116,1);
    for(x=6;x<=46;x++){ set(x,86,20); set(x,116,20); }
    for(y=86;y<=116;y++){ set(6,y,20); set(46,y,20); }
    G.rect(24,82,32,88,22);                                  // the sally port into the building
    G.rect(30,114,40,118,22);                                // its gate onto the drive
    for(x=12;x<=42;x+=4) for(y=90;y<=96;y++) set(x,y,21);
    for(x=12;x<=42;x+=4) for(y=104;y<=110;y++) set(x,y,21);
    for(i=0;i<6;i++){ var sx=12+Math.floor(r()*7)*4, sy=92+Math.floor(r()*16);
      if(get(sx+1,sy)===1||get(sx+1,sy)===21) G.rect(sx+1,sy,sx+2,sy+3,19); }

    /* ---- THE PUBLIC LOT ---- */
    G.rect(50,110,122,122,1);
    for(x=54;x<=118;x+=4) for(y=112;y<=116;y++) set(x,y,21);
    for(x=54;x<=118;x+=4) for(y=119;y<=121;y++) set(x,y,21);
    G.rect(30,116,58,122,1);                                 // the drive linking yard gate to lot
    for(i=0;i<10;i++){ var cx=54+Math.floor(r()*16)*4, cy=112+Math.floor(r()*2);
      if(get(cx+1,cy)===1||get(cx+1,cy)===21) G.rect(cx+1,cy,cx+2,cy+3,19); }

    for(i=0;i<24;i++){ var tx=4+Math.floor(r()*120), ty=4+Math.floor(r()*120);
      if(get(tx,ty)===4) set(tx,ty,3); }

    K.roofsAndDoors(g,{ building:function(c){return c===2;}, roof:16, door:18, min:150,
      outside:function(c){ return c===13||c===7||c===4||c===1||c===21; } });

    var gx=88;
    for(i=-5;i<=5;i++) set(gx+i,H-1,5);
    for(y=H-1;y>=122;y--) for(x=-5;x<=5;x++){ var c=get(gx+x,y); if(c===0||c===4||c===13) set(gx+x,y,1); }
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4||c===13; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:13, pedOver:soft, pedInset:12});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      /* the panel joints, the dome, its glazing, the roof edge and the doorways ARE the
         building. They are holes in it, never gaps between two of them (ONE BUILDING). */
      footprints:K.footprints(g,function(v){return v===2||v===6||v===11||v===16||v===17||v===18;})};
  }
  function driveConnected(res){ return K.driveNetworkReach(res.g, LEGEND) > 0.999; }
  function hasSallyPort(res){ for(var y=0;y<res.g.length;y++) for(var x=0;x<res.g[0].length;x++) if(res.g[y][x]===22) return true; return false; }

  /* BEIGE LIMESTONE AND PRECAST. No green: the setback is decomposed granite, and nothing
     in this valley has been watered in a very long time. */
  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#9c9179',3:'#514f40',4:'#6b6250',5:'#c79a3f',
    6:'#8a8069',7:'#8b8478',8:'#5a6660',9:'#b0863a',10:'#6e6a60',11:'#93a2a8',12:'#8a7f5e',
    13:'#7d7a71',15:'#5f5c54',16:'#c0b498',17:'#b6a888',18:'#241f1a',
    19:'#6a6e72',20:'#585349',21:'#4a4a52',22:'#3a3630',23:'#7a7263'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',   act1:'bare Mojave dirt at the property line, sun-cracked, drift sand banked against the kerb'},
    1:{name:'drive / lot',        kind:'drive',    act1:'the public lot and the secure yard floor — asphalt gone to plates, weeds up every joint (car-drivable)'},
    2:{name:'courthouse',         kind:'building', act1:'beige limestone and precast panel, an L wrapped round its own plaza, blast-rated walls that outlived the government that ordered them', enter:'courthouse interior: the rotunda lobby under the dead dome, the screening hall, courtrooms and jury suites stacked up both legs, holding cells behind the sally port'},
    3:{name:'dead tree',          kind:'tree-dead',act1:'a dead setback tree gone to stick, its grate prised up for the metal', solid:false},
    4:{name:'blast setback',      kind:'ground',   act1:'the standoff strip between the kerb and the wall — decomposed granite gone to hardpan. It is empty ON PURPOSE: this was the first federal building in the country built to the post-Oklahoma-City blast rules, and the emptiness IS the security'},
    5:{name:'gate / kerb cut',    kind:'gate',     act1:'the kerb cut off the street into the public lot, amber paint gone chalky'},
    6:{name:'precast panel joint',kind:'structure',act1:'the joint line between two precast panels, twenty-two feet by ten, the sealant gone chalky and dropped out in runs'},
    7:{name:'public plaza',       kind:'ground',   act1:'the plaza in the elbow of the building, big pavers heaved by roots, open to the sun corner to corner now that the cantilever is gone'},
    8:{name:'dry basin',          kind:'water-dead',act1:'a reflecting basin bone dry, the old waterline stained around it like a tidemark'},
    9:{name:'plaza light',        kind:'structure',act1:'a plaza light on its concrete stem, head dark, the glass long gone'},
    10:{name:'rooftop plant',     kind:'structure',act1:'a mechanical unit on the roof of the north leg, ducting collapsed, one of them stripped for its copper'},
    11:{name:'dome glazing',      kind:'structure',act1:'what is left of the sixty-foot glass dome over the rotunda — a cable truss and mostly sky'},
    12:{name:'flagpole',          kind:'prop',     act1:'a flagpole in the row facing the plaza, halyard slapping, nothing left on it'},
    13:{name:'walk',              kind:'walk',     act1:'the concrete walks across the setback, cracked corner to corner'},
    15:{name:'security bollard / entrance pier', kind:'structure',act1:'in the standoff line, a steel bollard still dead upright — nothing short of a truck moves one, and nothing has; at the entrance, one of the squat concrete piers carrying the wall above the doors'},
    16:{name:'roof edge',         kind:'structure',act1:'the parapet line where a roof meets its wall, coping missing in runs'},
    17:{name:'rotunda dome',      kind:'structure',act1:'the ring of the rotunda dome, the crown of the public lobby, its glazing gone'},
    18:{name:'doorway',           kind:'portal',   act1:'a way in — the public doors at the head of the entrance steps, the staff entrance on the north leg'},
    19:{name:'dead car',          kind:'vehicle',  act1:'a car left where it was parked, flat and sun-bleached, nobody came back for it'},
    20:{name:'secure yard wall',  kind:'fence',    act1:'the wall round the secure yard, razor wire long since rusted off the top of it', solid:true},
    21:{name:'stall marking',     kind:'marking',  act1:'the painted stall ticks, chalked out to ghosts by twenty summers — PAINT IS NOT A WALL, a car drives straight over it'},
    23:{name:'plaza planter',     kind:'structure',act1:'a low limestone planter across the plaza, bed gone to hardpan with a dead tree still in it, coping cracked where people sat on it waiting to be called', solid:true},
    22:{name:'sally port',        kind:'portal',   act1:'the sally port — the sealed vehicle door prisoners came in through, one leaf standing open'}
  };
  var NOTES={
    summary:'A dead federal courthouse — ONE L-shaped building wrapping a public plaza in its elbow, with a three-storey ROTUNDA at the corner under a dead sixty-foot glass dome, a broad flight of ENTRANCE STEPS up out of the plaza between the piers that carry the wall above them, a blast standoff setback held by a bollard line, and a walled SECURE YARD with its sally port. The judicial seat, distinct from the executive city hall.',
    reference:['LLOYD D. GEORGE U.S. COURTHOUSE (CannonDesign, 2000, 333 Las Vegas Blvd S): a 450,000 sq ft L-SHAPED building of beige limestone, glass and 22ft x 10ft precast wall panels; a three-storey ROTUNDA public lobby capped by a 60-foot cable-truss glass dome; and a dramatic steel and aluminium canopy PROJECTING FROM THE TOP OF THE BUILDING that shadows the plaza. One of only three buildings in the country to take the GSA Honor Award for Architecture.',
      'It was the FIRST federal building constructed to the post-Oklahoma-City blast-resistance requirements. That is why the setback is wide and empty and why the bollard line exists: standoff distance IS the security, so the emptiness is a feature and not a void.'],
    layout:['ONE BUILDING, an L. The west leg runs north-south, the north leg east-west, and the ROTUNDA bulges out of the elbow into the plaza. Every mass shares a wall.',
      'THE DOME reads from above as a bright RING, because sixty feet of it was glass and most of that is gone.',
      'THE PRECAST PANEL GRID (22ft x 10ft) runs across both roof plates — the cladding module, legible from the air — and the rooftop plant sits in a line along the north leg.',
      'THE ENTRANCE IS STEPS AND A SCREENING PORCH (8/2), not a cantilever: a broad flight up out of the plaza, the row of PIERS carrying the wall above them, and the public doors at the head of it. Nothing overhead on this plot.',
      'THE PUBLIC PLAZA fills the elbow with a dry basin, a flag row along the building face and a light line at its edge.',
      'THE BLAST SETBACK rings the whole plot, held by a BOLLARD LINE on the street side and the east flank.',
      'THE SECURE YARD is walled on the west with staff parking inside it, a SALLY PORT into the west leg, and a gated drive out to the public lot.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: ONE kerb cut on the primary street feeds the public lot, and the drive along the south links it to the secure yard gate, so the whole drive network is reachable from the kerb (K.driveNetworkReach = 1.0). The sally port and yard gate are PORTALS, never a second car entrance. Stall ticks are MARKING, so a car drives over them, and NOTHING on this plot is overhead. Foot circulation is plaza -> up the entrance steps between the piers -> the public doors. A corner adds a pedestrian gate.',
    layering:'GROUND (flat): the public plaza (7), the blast setback (4), the walks (13), the dry basin (8), the lot and yard floor (1, DRIVE) with their stall ticks (21, MARKING), bare desert (0). OVERHEAD (pass UNDER): NOTHING — this plot carries no overhead tile at all (Paolo 8/2, no more canopies). STRUCTURE (¾ front face, solid, ENTERABLE): the COURTHOUSE mass (2 — rotunda lobby, screening hall, courtrooms and jury suites up both legs, holding behind the sally port), the precast panel joints (6), the dome (17) and its glazing (11), the roof edge (16), the rooftop plant (10), the plaza lights (9), the security bollards and entrance piers (15), the secure yard wall (20, FENCE). PROP: dead trees (3), flagpoles (12), dead cars (19). PORTAL: the doorways (18), the sally port and yard gate (22), the kerb cut (5).',
    decisions:['THE COLONNADE IS DEAD, and the lawn with it. A portico and monumental steps is a county courthouse in Ohio; this valley has a blast-rated federal L with a glass dome, and that is what actually got built here.',
      'THE SETBACK IS NOT A VOID, and this is the one district where empty ground is CORRECT. Standoff distance is the security measure the building was the first in the country to be designed around. It is named, written and bollarded, so it is answered for.',
      'Deliberately differentiated from city hall (a seven-storey block merged with a round chamber over a bed of solar masts) and the library (drum + tower + reading wing): here it is an L round a plaza with a ringed dome at the elbow, standing back behind a bollarded setback. Every district is its own landmark (7/28).',
      'NO CANOPY (8/2, Paolo: "no more canopies I only see canopies at parks and shit"). The cantilever the real building is known for is gone. The reference line above KEEPS it, because the reference is a record of the real building and not a description of this plot — the LAYOUT note is what describes what got drawn.',
      'ONE BUILDING (8/2): both legs and the rotunda share walls; the yard wall is a fence, not a second courthouse.',
      'THE SECURE HALF is what a courthouse has and a city hall does not: a walled yard, staff parking inside it, and a sally port. It stays a PORTAL, never a second car entrance (street-aware law).',
      'Act-1 DEAD: the dome mostly sky, sealant dropped out of the panel joints, plant stripped for copper, pavers heaved, one sally port leaf standing open. Who holds the building now is faction canon and stays Paolo\'s.',
      'Zero purple. No inscriptions, seals or signage text anywhere (Paolo\'s to author).']
  };
  K.register('courthouse', { generate:generate, body:function(c){return c===2||c===6||c===11||c===16||c===17||c===18;},
    category:'civic', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,hasSallyPort:hasSallyPort,
    footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaCourthouse=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
