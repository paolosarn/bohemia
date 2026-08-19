// BOHEMIA CHURCH / CHAPEL (7/21/26; REBUILT 8/2/26). CIVIC, on the DISTRICT KIT.
//
// The CRUCIFORM plan stays: it is right, it is one building, and it is the one civic form in
// the valley nothing else shares. What was wrong was everything around it.
//
// TWO THINGS THE REBUILD FIXES, both of them findings Paolo made on other districts:
//   THE GREEN. "memorial garden" and "dead landscaping" were #49512e and #3a4526 -- lawn
//     green -- across a fifth of the plot, in a valley that stopped watering things a decade
//     before act one opens. Same greenwash he caught in downtown. A Mojave churchyard is not
//     a lawn; it is a walled MEMORIAL COURT of decomposed granite with a COLUMBARIUM wall of
//     niches, because in this ground you do not dig graves, you build a wall and fill it.
//   THE MONOBLOCK. 33.9% of the plot was one code called "sidewalk". Split into the things
//     it actually is: the churchyard walk, the memorial court paving, and the gravel margin.
// And it gains what every approved district has: roofs and doors from the shared machine, a
// covered walk you pass UNDER, stall ticks that are PAINT, and a dressed lot.
//
// Act-1 DEAD: the stained glass is out and the lead buckled, the bell is on the ground where
// it came through the belfry floor, the niches are prised open, the font is dry.
// Street-aware + drivable (a small lot + drop-off). Full dossier + layering.
// LEGEND:
//  0 desert dead-ground   1 drive / lot (DRIVABLE)   2 church (the ONE building)
//  3 dead tree            4 memorial court           5 gate / kerb cut
//  6 bell tower           7 forecourt plaza          8 arcade columns
//  9 pole light          10 cross / fallen bell     11 stained glass
//  12 churchyard walk    13 columbarium wall        14 gravel margin
//  15 path wall            16 roof edge         17 niche plaque
//  18 doorway (PORTAL)   19 dead car                20 stall marking (PAINT)
//  21 dry font           22 roof ridge              23 orchard bed
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;
  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    /* ---- BASE. Decomposed granite and gravel, never lawn. ---- */
    G.rect(0,0,W-1,H-1,0);
    G.rect(3,3,W-4,H-4,14);                                              // the gravel margin

    /* ---- THE CRUCIFORM CHURCH (Latin cross): nave + transepts + apse + narthex.
       ONE building: every arm shares a wall with the crossing. ---- */
    G.rect(52,22,76,86,2);                                               // the long NAVE
    G.rect(30,44,98,62,2);                                               // the TRANSEPTS (cross arms)
    G.disc(64,22,11,2);                                                  // the SANCTUARY / apse, north
    G.rect(46,84,82,94,2);                                               // the NARTHEX, south
    G.rect(36,84,46,112,6); G.rect(38,86,44,88,11); set(41,84,10);       // the BELL TOWER + belfry + finial
    G.rect(44,90,48,96,2);                                               // the tower joined to the narthex
    G.rect(96,38,118,70,2);                                              // THE PARISH HALL, off the east transept
    for(y=42;y<=66;y+=6) G.rect(118,y,118,y+2,11);                       // its hall windows

    /* ---- THE DEAD ORCHARD across the north. A mission planting is what a parish did with
       ground it could not build on, and rows of dead citrus is what is left of one. It also
       answers the thing that made this plot fail twice: the north half was 30%+ of a single
       empty code, first called sidewalk and then called gravel. Renaming emptiness does not
       fix it; PUTTING SOMETHING THERE does. ---- */
    for(y=8;y<=36;y++) for(x=10;x<=118;x++) if(get(x,y)===14) set(x,y,4);
    for(y=11;y<=33;y+=5) for(x=14;x<=114;x+=5) if(get(x,y)===4){
      G.rect(x-1,y-1,x+1,y+1,23); set(x,y,3); }               // the tree in its granite bed
    for(x=10;x<=118;x++){ if(get(x,8)===4)set(x,8,13); if(get(x,36)===4)set(x,36,13); }
    for(y=8;y<=36;y++){ if(get(10,y)===4)set(10,y,13); if(get(118,y)===4)set(118,y,13); }
    for(x=60;x<=68;x++) if(get(x,36)===13) set(x,36,4);                  // the gap you walk in through

    /* THE WALK IS AN APRON, NOT A FIELD. Painting the whole churchyard "sidewalk" made one
       code 35.5% of the plot, which is the MONOBLOCK failure. A walk is the band that hugs
       the building, so it is computed from the building instead of guessed at. */
    for(y=4;y<128-4;y++) for(x=4;x<128-4;x++){
      if(get(x,y)!==14) continue;
      var near=false;
      for(var dy=-5;dy<=5&&!near;dy++) for(var dx=-5;dx<=5;dx++)
        if(get(x+dx,y+dy)===2||get(x+dx,y+dy)===6){ near=true; break; }
      if(near) set(x,y,12);
    }

    /* THE ROOF IS NOT A FLAT PLATE. A pitched church roof reads as a RIDGE down the nave
       and each transept arm with the tile courses stepping off it -- a mass this size in one
       colour is the 7/30 flat-rectangle failure at building scale. */
    G.rect(63,20,65,86,22); G.rect(30,52,98,54,22);
    for(y=24;y<=84;y+=6){ G.rect(54,y,62,y,16); G.rect(66,y,74,y,16); }
    for(x=32;x<=96;x+=6){ G.rect(x,46,x,51,16); G.rect(x,55,x,60,16); }
    G.rect(100,42,116,44,22);
    for(y=48;y<=66;y+=5) G.rect(98,y,116,y,16);

    /* stained glass down the nave, across the transept ends, and the rose in the apse */
    for(y=28;y<=82;y+=6){ set(52,y,11); set(76,y,11); }
    for(y=48;y<=58;y+=4){ set(30,y,11); set(98,y,11); }
    set(64,16,11); set(60,18,11); set(68,18,11);

    /* ---- THE MEMORIAL COURT, both flanks: a walled court of decomposed granite with a
       COLUMBARIUM wall of niches round it. In this ground you do not dig, you build a wall
       and you fill it, and the plaques are what people came to read. ---- */
    [[10,64],[100,64]].forEach(function(c0){
      var mx=c0[0], my=c0[1];
      G.rect(mx,my,mx+18,my+30,4);
      for(x=mx;x<=mx+18;x++){ set(x,my,13); set(x,my+30,13); }
      for(y=my;y<=my+30;y++){ set(mx,y,13); set(mx+18,y,13); }
      for(y=my+2;y<=my+28;y+=3){ set(mx,y,17); set(mx+18,y,17); }        // the niche plaques
      for(x=mx+3;x<=mx+15;x+=4) set(x,my+15,3);                          // the dead planting down the middle
      G.rect(mx+7,my+30,mx+11,my+30,4);                                  // the gap you walk in through
    });

    /* ---- THE FORECOURT: arcade, churchyard cross, the fallen bell, the dry font ---- */
    G.rect(28,96,100,116,7);
    for(x=32;x<=96;x+=6) G.rect(x,94,x+1,96,8);                          // the entrance arcade
    set(64,106,10); set(63,105,10); set(65,105,10); set(64,104,10);      // the churchyard cross
    G.disc(48,110,4,10); G.disc(48,110,2,7);                             // the BELL, down where it fell
    G.disc(84,108,4,21); G.disc(84,108,2,7);                             // the dry font
    for(x=34;x<=94;x+=15) set(x,114,9);

    /* NO CANOPY (Paolo 8/2). The covered walk from the lot to the doors is gone; what a
       churchyard actually has instead is a low WALL along the path and the trees that were
       meant to shade it, dead in their grates. Nothing overhead on this plot. */
    for(y=98;y<=114;y++){ set(100,y,15); set(106,y,15); }
    for(y=100;y<=112;y+=4) set(103,y,3);

    /* ---- THE LOT ---- */
    G.rect(6,118,122,124,1);
    G.rect(102,112,122,120,1);
    for(x=10;x<=118;x+=4) for(y=119;y<=123;y++) set(x,y,20);
    for(i=0;i<8;i++){ var cx=10+Math.floor(r()*27)*4, cy=119+Math.floor(r()*2);
      if(get(cx+1,cy)===1||get(cx+1,cy)===20) G.rect(cx+1,cy,cx+2,cy+2,19); }

    for(i=0;i<24;i++){ var tx=4+Math.floor(r()*120), ty=4+Math.floor(r()*120);
      if(get(tx,ty)===14) set(tx,ty,3); }

    K.roofsAndDoors(g,{ building:function(c){return c===2;}, roof:16, door:18, min:150,
      outside:function(c){ return c===12||c===7||c===4||c===14||c===1||c===20; } });

    var gx=64;
    for(i=-5;i<=5;i++) set(gx+i,H-1,5);
    for(y=H-1;y>=124;y--) for(x=-5;x<=5;x++){ var c=get(gx+x,y); if(c===0||c===14||c===12) set(gx+x,y,1); }
    return g;
  }
  function generate(seed,opts){ opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4||c===12; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:12, pedOver:soft, pedInset:12});
    var g=res.g; return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      /* THE BELL TOWER IS THE CHURCH. It shares a wall with the narthex, so counting only
         the nave stone left its belfry window stranded as a second building (ONE BUILDING, 8/2). */
      footprints:K.footprints(g,function(v){return v===2||v===6||v===11||v===16||v===18||v===22;})}; }
  function driveConnected(res){ return K.driveNetworkReach(res.g, LEGEND) > 0.999; }
  /* SUN-BLEACHED STONE, GRANITE AND GRAVEL. Nothing green: a Mojave churchyard is not a lawn. */
  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#7a7060',3:'#514f40',4:'#6b6250',5:'#c79a3f',6:'#6f665a',
    7:'#8f8676',8:'#a89e8a',9:'#b0863a',10:'#8e8a7c',11:'#4a6a72',12:'#7d7a71',13:'#8a8272',
    14:'#5f5a4c',15:'#9a9184',16:'#b3a78d',17:'#a08f6e',18:'#241f1a',19:'#6a6e72',20:'#4a4a52',
    21:'#5a6660',22:'#8e8474',23:'#7b7361'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt at the churchyard edge (setback)'},
    1:{name:'drive / lot',        kind:'drive',      act1:'the small church parking + drop-off drive (car-drivable)'},
    2:{name:'building (church)',  kind:'building',   act1:'the cruciform church — stone walls, roof steep, doors chained', enter:'church interior: the narthex, the long nave of pews to the altar at the apse, the transept chapels off the crossing'},
    3:{name:'dead tree',          kind:'tree-dead',  act1:'a dead churchyard tree gone to stick, its grate prised up for the metal', solid:true},
    4:{name:'memorial court',     kind:'ground',     act1:'the walled memorial court — decomposed granite raked once, now hardpan split by weeds. Not a lawn: in this ground you do not dig graves, you build a wall and fill it'},
    5:{name:'gate',               kind:'gate',       act1:'the churchyard entrance off the street, amber curb'},
    6:{name:'bell tower',         kind:'structure',  act1:'the bell tower flanking the entrance, tall, the bell silent, a cross finial atop', solid:true},
    7:{name:'forecourt plaza',    kind:'ground',     act1:'the forecourt piazza before the doors, cracked pavers, weeds'},
    8:{name:'arcade columns',     kind:'structure',  act1:'the entrance arcade / colonnade across the front', solid:true},
    9:{name:'pole light',         kind:'prop',       act1:'a churchyard pole light, head dark'},
    10:{name:'cross / fallen bell',kind:'prop',      act1:'the churchyard cross, and the BELL itself lying in the forecourt where it came through the belfry floor', solid:true},
    11:{name:'stained glass',     kind:'structure',  act1:'a stained-glass window (nave/transept/rose), shattered, lead buckled'},
    12:{name:'churchyard walk',   kind:'walk',       act1:'the concrete walk that rings the church, cracked corner to corner and lifted where the roots got under it'},
    13:{name:'columbarium wall',  kind:'fence',      act1:'the niche wall round the memorial court — rows of small sealed compartments, a third of them prised open', solid:true},
    14:{name:'gravel margin',     kind:'ground',     act1:'the gravel margin at the property line, sun-bleached rock over failed weed cloth'},
    15:{name:'path wall',         kind:'fence',      act1:'the low wall running either side of the path from the lot to the doors, coping cracked and one run shoved out of line', solid:true},
    16:{name:'roof edge',         kind:'structure',  act1:'the parapet and eave line where a roof meets its wall, tiles gone in runs'},
    17:{name:'niche plaque',      kind:'structure',  act1:'a name plaque on a columbarium niche, the letters still cut deep enough to read'},
    18:{name:'doorway',           kind:'portal',     act1:'a way in — the narthex doors, the transept door, the gate into a memorial court'},
    19:{name:'dead car',          kind:'vehicle',    act1:'a car left in the lot, flat and sun-bleached, nobody came back for it'},
    20:{name:'stall marking',     kind:'marking',    act1:'the painted stall ticks, chalked out to ghosts by twenty summers — PAINT IS NOT A WALL, a car drives straight over it'},
    22:{name:'roof ridge',        kind:'structure',  act1:'the ridge line down the nave and the transept arms, tiles gone off it in runs and the battens showing', solid:true},
    23:{name:'orchard bed',       kind:'ground',     act1:'the granite bed round an orchard tree, its drip line long since cut off at the main'},
    21:{name:'dry font',          kind:'water-dead', act1:'the font in the forecourt, bone dry, a tidemark ringed inside the bowl'}
  };
  var NOTES={
    summary:'A dead church — a cruciform stone building (narthex + long nave crossed by the transepts, the sanctuary apse at the head), a bell tower flanking the entrance with the BELL itself lying in the forecourt, a plaza with an arcade and a dry font, a walled MEMORIAL COURT ringed by a COLUMBARIUM of niches, a dead ORCHARD in its granite beds, and a small lot behind a low path wall.',
    reference:['Church architecture (Keiser Design parts of a church, UMC narthex/nave, cruciform cathedral plans): a CRUCIFORM (Latin-cross) plan — the NARTHEX (entry) + the long NAVE crossed by the TRANSEPTS (cross arms), the SANCTUARY/apse at the head; a BELL TOWER/spire flanking the entrance; often a forecourt COURTYARD/atrium + arcade; stained-glass windows down the nave.'],
    layout:['A CRUCIFORM CHURCH is the hero: the long NAVE crossed by the TRANSEPTS, the rounded SANCTUARY apse at the north head, the NARTHEX vestibule at the south entrance, stained-glass windows down its length.',
      'A BELL TOWER (with a cross finial) flanks the entrance; a forecourt PLAZA with an entrance arcade + a churchyard cross/statue fronts the doors.',
      'THE MEMORIAL COURT is walled, and the wall IS a COLUMBARIUM: rows of small sealed niches with name plaques, a third of them prised open. This ground does not take graves, so the dead go in the wall — the same reason real Mojave churchyards are built this way.',
      'A dead ORCHARD stands in granite beds along the flank, the drip line cut off at the main years ago.',
      'THE PATH FROM THE LOT TO THE DOORS runs between two LOW WALLS (8/2) — not under a covered walk. One run of coping is shoved out of line.',
      'A small parking + drop-off drive meets the street, and a churchyard walk rings the whole building.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: a small drop-off drive on the primary street feeds the lot (code 1 reaches it from the curb, K.driveReachFromStreet). Foot circulation is the lot -> the path between the low walls -> the forecourt plaza -> arcade -> narthex, and the churchyard walk rings the building to the transept door and the memorial court gate. NOTHING on this plot is overhead (Paolo 8/2, no more canopies): the covered walk that used to run from the lot to the doors is gone. WALKABLE-LAND: a church IS its building — the plot is nearly all structure + plaza + garden; the lot is minimal. Corner side streets get a pedestrian gate onto the plaza.',
    layering:'GROUND (flat, walk on it): the forecourt plaza (7), the memorial court floor (4), the churchyard walk (12, WALK), the gravel margin (14), the orchard beds (23), the dry font (21), the drive/lot (1, DRIVE) with its stall ticks (20, MARKING), bare desert (0). OVERHEAD (pass UNDER): NOTHING — this plot carries no overhead tile at all (Paolo 8/2). STRUCTURE (¾ front face, solid, ENTERABLE): the cruciform CHURCH (2 — narthex, nave, altar, transept chapels) with its STAINED GLASS (11), roof edge (16) and roof ridge (22), the BELL TOWER (6), the arcade COLUMNS (8), the COLUMBARIUM wall (13, FENCE) and its niche plaques (17), the path walls (15, FENCE). PROP: the churchyard cross and the fallen BELL (10), pole lights (9), dead trees (3), dead cars (19). PORTAL: the doorways (18) and the street gate (5). The cross-plan mass + the bell tower are the vertical hero; you cross the plaza into the narthex.',
    decisions:['Act-1 DEAD: shattered stained glass, the bell silent, doors chained, the garden dead, the cross weathered. Faith + who gathers here is Paolo\'s / faction canon.',
      'Civic category (chapel/church). Zero purple. No denomination/inscription (Paolo\'s to author).',
      'WALKABLE-LAND honored (easily): the cruciform building + plaza + garden dominate; lot minimal.',
      'THE LAWN IS DEAD and the covered walk with it (8/2). 33.9% of this plot was one flat sidewalk code — a monoblock. It is a walk apron computed from the building outline now, with the orchard beds and the memorial court taking the rest, so every pixel is answered for.',
      'THE DEAD GO IN THE WALL. A columbarium instead of graves is not decoration: caliche hardpan is why Southwest churchyards build niche walls, and it gives the district a piece of purposeful content that is not pavement.',
      'Research-first (per the playbook): built from real cruciform church plans, not memory.']
  };
  K.register('chapel', { generate:generate, body:function(c){return c===2||c===6||c===11||c===16||c===18||c===22;}, category:'civic', palette:PALETTE, legend:LEGEND, notes:NOTES });
  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API; root.BohemiaChapel=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
