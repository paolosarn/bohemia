// BOHEMIA HIGH SCHOOL (rebuilt 7/28/26). CIVIC, on the DISTRICT KIT.
//
// PAOLO RULED IT: "High school." (7/28) — answering his own note on the bulk verdict,
// "u gotta mention whether its a high school or middle school or what". He was right
// that it had to say: a high school is not a bigger middle school, it is a DIFFERENT
// BUILDING PROGRAMME, and the old module was a generic K-12 that had a PLAYGROUND in it,
// which is an elementary-school object and simply wrong here.
//
// THE LANDMARK IS THE STADIUM (law: EVERY DISTRICT IS ITS OWN LANDMARK, Paolo 7/28).
// Nothing else in the valley makes this shape: an oval running track with a rectangular
// field inside it, RAKED BLEACHERS down both sides, and four LIGHT TOWERS standing over
// the whole thing. It reads at one tile and it reads on foot, which is the two-zoom test.
// Friday night lights are the single most recognisable object an American town owns.
//
// WHAT MAKES IT A HIGH SCHOOL AND NOT A MIDDLE SCHOOL, specifically:
//   - THE STUDENT LOT. High schoolers drive. A big student lot separate from staff
//     parking is the clearest programmatic tell there is, and in a dead world it is
//     where the cars never got collected from.
//   - THE STADIUM with real bleachers and lights, not a play field.
//   - THE AUTO SHOP (CTE wing). Paolo killed the tennis courts on 7/30 and handed me
//     the ground with them: "Remove the tennis courts make do what you want." A
//     vocational shop is a real high-school building, it is the ONLY industrial volume
//     on a civic campus, and in a dead world it is the reason to walk over there --
//     that is where the tools and the parts are.
//   - PORTABLE CLASSROOMS — the overcrowding annex, universal to American high schools.
//   - NO PLAYGROUND. Removed. That was the old module's actual error.
//   - THE MARQUEE at the street, still holding whatever it last said.
//
// COLOUR (7/28 measurement): our district icons carried a median of THREE hue families
// and 13% chromatic pixels against Pocket City 2's twelve and 88%. Everything was brown.
// This module deliberately carries a real hue spread — maroon roofs, a teal gym, rust
// track, dead green field, blue-green courts, metal bleachers, a gold marquee — all
// faded to the dead world's value bands but never merged into each other. The SCHOOL
// COLOURS are the last real colour on the site, which is also true of every dead school
// in America: the gym keeps its paint long after the windows go.
//
// LEGEND:
//  0 desert dead-ground     1 pavement / drive      2 academic building   3 dead tree
//  4 dead lawn              5 gate / entrance       6 field (dead turf)   7 running track
//  8 shop yard              9 bleachers            10 white markings     11 sidewalk / plaza
// 12 pole / light tower    13 garden bed           14 gymnasium          15 portable classroom
// 16 marquee sign          17 dead car             18 roof ridge / vent  19 doorway
// 20 auto shop (CTE)
//
// THE ROOF/DOOR VOCABULARY (7/30). Paolo circled the gym, the tennis courts and the
// portables and asked what they were. That is the answer by itself: they were flat
// colour rectangles. A building read from above needs a ROOF that is not one flat fill
// (18: ridges, crowns, rooftop units) and a DOOR you can find (19). Both are body tiles,
// so they never punch holes in a footprint.
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    function ellRing(cx,cy,rx,ry,rx2,ry2,code){ for(var dy=-ry;dy<=ry;dy++)for(var dx=-rx;dx<=rx;dx++){
      var o=(dx*dx)/(rx*rx)+(dy*dy)/(ry*ry), i2=(dx*dx)/(rx2*rx2)+(dy*dy)/(ry2*ry2);
      if(o<=1 && i2>1) set(cx+dx,cy+dy,code); } }

    /* ROOFS, AND WHY THEY ARE NOT STRIPES. First cut of this pass drew every roof as a
       full-width light bar, which is a BARCODE — the exact mistake that made the parking
       lot "dogshit" (Paolo 7/29) and the tennis courts unreadable (7/30). A bar spanning
       a building edge to edge is not a roof, it is a stripe.
       What reads as a roof from above is the EAVE — the bright line where the roof edge
       meets the wall, all the way round — plus a RIDGE that stops SHORT of both ends, the
       way a real hip does. Outline first, detail second. */
    function roof(x0,y0,x1,y1,axis){
      G.rect(x0,y0,x1,y0,18); G.rect(x0,y1,x1,y1,18);        // the eave, north + south
      G.rect(x0,y0,x0,y1,18); G.rect(x1,y0,x1,y1,18);        // the eave, west + east
      if(axis==='x'){ var my=Math.round((y0+y1)/2); G.rect(x0+3,my,x1-3,my,18); }
      else if(axis==='y'){ var mx=Math.round((x0+x1)/2); G.rect(mx,y0+3,mx,y1-3,18); }
    }

    G.rect(0,0,W-1,H-1,0);
    G.rect(3,3,W-4,H-4,4);                                   // the campus, dead lawn to the margins

    /* ---- THE ACADEMIC BUILDING, north, two-storey, wrapped round a courtyard ---- */
    G.rect(8,4,104,18,2);                                    // the long classroom spine
    G.rect(8,18,24,48,2);                                    // west wing
    G.rect(88,18,104,48,2);                                  // east wing
    G.rect(26,20,86,34,11);                                  // the courtyard between them
    G.rect(32,23,44,31,13); G.rect(56,23,68,31,13);          // courtyard planters, gone to weed
    for(x=30;x<=80;x+=9) set(x,32,3);                        // courtyard trees, dead
    for(x=12;x<=100;x+=7){ set(x,4,10); set(x,5,10); }       // the window band on the front face
    /* the spine and both wings get a roof ridge, so the mass reads as roofed volumes
       instead of one maroon fill, and the three entrances get real openings */
    roof(8,4,104,18,'x');                                    // the spine roof
    roof(8,18,24,48,'y'); roof(88,18,104,48,'y');            // the two wing roofs
    G.rect(54,17,60,17,19);                                  // the main doors
    G.rect(21,17,25,17,19); G.rect(87,17,91,17,19);          // the two side entrances

    /* ---- THE GYMNASIUM. Its own volume, its own colour, taller than everything: in a
       real high school the gym is the second landmark after the stadium. ---- */
    /* CLEAR OF THE STADIUM. The gym and the press box were drawn into each other --
       two solid masses sharing tiles, which is exactly the meshing Paolo has called out
       across the whole game. The gym now stops at y=53 and the press box starts at 54. */
    G.rect(28,38,76,53,14);
    for(x=32;x<=72;x+=6){ set(x,38,10); set(x,39,10); }      // clerestory band
    /* PAOLO 7/30 circled this and asked what it was. It was a flat teal rectangle. A gym
       is a single clear-span volume under a BARREL ROOF, and from above that reads as a
       bright crown down the long axis with the rooftop plant sitting either side of it. */
    roof(28,38,76,53,'x');                                   // eave all round + the barrel ridge
    G.rect(38,41,41,42,18); G.rect(52,49,55,50,18); G.rect(66,41,69,42,18);  // rooftop plant, offset
    G.rect(48,53,58,55,11);                                  // the walk out to the field
    G.rect(49,53,51,53,19); G.rect(55,53,57,53,19);          // the field doors, south face
    G.rect(50,38,53,38,19);                                  // and the courtyard door, north

    /* ---- PORTABLE CLASSROOMS, the overcrowding annex. PAOLO 7/30 circled these too.
       They were three identical tan boxes in a column, which is not what a portable
       village looks like: they are dropped on blocks wherever they fit, each one gets a
       low gable, a landing and a steel ramp, and a concrete walk chains them together. */
    G.rect(105,5,107,38,11);                                 // the spine walk serving them
    for(i=0;i<3;i++){ var py=6+i*11, ox=(i===1)?2:0;
      G.rect(108+ox,py,122+ox,py+8,15);                      // the box, staggered off the walk
      roof(108+ox,py,122+ox,py+8,'x');                       // eave all round + a short gable ridge
      set(108+ox,py+4,19);                                   // the door, facing the walk
      G.rect(105,py+3,107+ox,py+5,11);                       // landing + ramp down to the walk
    }

    /* ---- THE STADIUM: THE LANDMARK. Track, field, bleachers both sides, four towers.

       A RUNNING TRACK IS AN OBROUND, NOT AN ELLIPSE — two straights closed by two
       semicircular ends. Drawn as an ellipse the first time, and the rectangular field
       punched straight out through the bends.

       MOVED UP (Paolo 7/29): the lot below it was too shallow to hold real parking, so
       the whole stadium shifts north to give the lot the 23 tiles a double-loaded bay
       actually needs. ---- */
    var fx=64, fy=78, SL=20, RO=16, RI=11;          // straight half-length, outer/inner radius
    function obround(px,py,sl,rad){
      var dx=Math.abs(px-fx), dy=Math.abs(py-fy);
      if(dx<=sl) return dy<=rad;
      var ox=dx-sl; return Math.sqrt(ox*ox+dy*dy)<=rad;
    }
    for(y=fy-RO-1;y<=fy+RO+1;y++) for(x=fx-SL-RO-1;x<=fx+SL+RO+1;x++){
      if(obround(x,y,SL,RO) && !obround(x,y,SL,RI)) set(x,y,7);
    }
    G.rect(fx-SL,fy-RI+1,fx+SL,fy+RI-1,6);
    for(x=fx-SL+1;x<=fx+SL-1;x++) set(x,fy,10);
    for(i=-3;i<=3;i++){ var lx=fx+i*5; if(Math.abs(lx-fx)<SL) for(y=fy-RI+2;y<=fy+RI-2;y++) set(lx,y,10); }
    for(y=fy-RI+1;y<=fy+RI-1;y++){ set(fx-SL,y,10); set(fx+SL,y,10);
      set(fx-SL+4,y,10); set(fx+SL-4,y,10); }
    for(i=0;i<3;i++){
      G.rect(fx-SL-2+i, fy-RO-3-i, fx+SL+2-i, fy-RO-3-i, 9);
      G.rect(fx-SL-2+i, fy+RO+3+i, fx+SL+2-i, fy+RO+3+i, 9);
    }
    G.rect(fx-7,fy-RO-8,fx+7,fy-RO-6,9);
    /* LIGHT TOWERS PULLED IN (Paolo 7/29: "the light towers are far away from the field
       which is weird"). Real stadium lights stand just outside the track at the four
       corners of the bowl, not out in the grass. */
    [[fx-SL-6,fy-RO-4],[fx+SL+6,fy-RO-4],[fx-SL-6,fy+RO+4],[fx+SL+6,fy+RO+4]].forEach(function(p){
      for(i=-1;i<=1;i++)for(var j=-1;j<=1;j++) set(p[0]+i,p[1]+j,12);
    });

    /* ---- THE AUTO SHOP (CTE), east. PAOLO 7/30: "Remove the tennis courts make do what
       you want." The courts are dead and they were also a bug -- drawn after the east
       wing, they overwrote it, which is exactly the meshing he has called out.

       WHY A SHOP. Every American high school of this size runs a Career and Technical
       Education wing, and the auto shop is the one everybody can name. It is the only
       INDUSTRIAL volume on a civic campus, so it reads instantly against the classroom
       spine and the gym, and it earns its ground in act 1: the tools and the parts are
       in there, which is a reason to cross the campus rather than another slab.

       A SHOP IS ITS ROOF AND ITS DOORS. The read is a SAWTOOTH roof (north-light
       monitors, the universal workshop roof) and a row of ROLL-UP BAY DOORS on the yard
       face. Neither of those is a colour, which is the point. ---- */
    G.rect(108,42,124,64,20);                                 // the shop volume
    roof(108,42,124,64,'y');                                  // eave all round + the spine ridge
    /* the sawtooth: SHORT teeth stepping down the roof, alternating side to side. A
       monitor drawn edge to edge is a stripe; a stepped tooth is a sawtooth. */
    for(i=0;i<4;i++){ var ty=47+i*4, half=(i%2)?0:1;
      G.rect(half?110:117, ty, half?115:122, ty, 18); }
    G.rect(112,64,114,64,19); G.rect(116,64,118,64,19); G.rect(120,64,122,64,19);  // roll-up bays
    set(109,43,19);                                           // the personnel door, north end

    /* THE SHOP YARD: where the work happened and where it stopped. Cars up on jacks that
       nobody came back for, and two parts containers along the east fence line. */
    G.rect(106,66,124,92,8);
    for(x=112;x<=122;x+=4) for(y=66;y<=70;y++) set(x,y,10);   // the approach lines off each bay
    G.rect(107,74,123,74,10); G.rect(107,84,123,84,10);       // the yard lanes, still painted
    G.rect(119,77,124,82,20); G.rect(119,87,124,91,20);       // parts containers along the fence
    for(i=0;i<10;i++){ var yx=107+(i%4)*4, yy=71+Math.floor(i/4)*7;
      if(get(yx,yy)===8||get(yx,yy)===10) G.rect(yx,yy,yx+1,yy+3,17); }   // wrecks up on jacks
    G.rect(104,66,106,92,11);                                 // the walk that serves the yard

    /* ---- THE STUDENT LOT, REBUILT (Paolo 7/29: "the bottom half of the screen parking
       lots is dogshit it doesnt look like a parking lot").

       IT DIDN'T, AND HERE IS WHY: I painted stall lines as FULL-WIDTH HORIZONTAL LINES
       every four rows. That is a barcode. Real stalls are SHORT TICKS PERPENDICULAR to a
       drive aisle, in double-loaded bays — stalls, aisle, stalls — and that is the only
       thing that makes a lot read as a lot from above.

       REAL DIMENSIONS at 0.75 m/tile: a stall is 2.6 m x 5.4 m = 3.5 x 7 tiles, and a
       two-way aisle is 6.7 m = 9 tiles. So one double-loaded bay is 7 + 9 + 7 = 23 tiles
       deep, which is why the stadium had to move up to make room. ---- */
    var LOT0=102;
    G.rect(4,LOT0,124,126,1);
    function bay(top){                                   // stalls | aisle | stalls
      for(x=8;x<=120;x+=4){                              // the perpendicular stall ticks
        for(y=top;y<=top+6;y++) set(x,y,10);             // north band, 7 tiles deep
        for(y=top+16;y<=top+22;y++) set(x,y,10);         // south band
      }
      G.rect(6,top,122,top,10); G.rect(6,top+22,122,top+22,10);   // the bay end lines
    }
    bay(LOT0);
    /* the cars never got collected — one stall in three, and they sit IN the stalls */
    for(i=0;i<30;i++){
      var sx=8+Math.floor(r()*28)*4, band=(r()<0.5)?LOT0+1:LOT0+17;
      var sy=band+Math.floor(r()*5);
      if(get(sx+1,sy)===1||get(sx+1,sy)===10){
        G.rect(sx+1,sy,sx+2,sy+3,17);
      }
    }

    /* ---- A SECOND WAY IN (Paolo 7/29: "have another entryway to the school"). One
       door on a building this long is wrong anyway — a real high school has a main
       entrance AND a separate gym/athletics entrance, and in a dead world a second
       opening is a second way the player can get inside. ---- */
    G.rect(20,18,26,20,11);                                   // west wing side entrance
    G.rect(86,18,92,20,11);                                   // east wing side entrance
    G.rect(52,18,62,20,11);                                   // the main doors off the courtyard

    /* ---- THE ENTRY PLAZA, walks and the flagpole ---- */
    G.rect(46,62,72,64,11);                                   // the plaza in front of the gym
    G.rect(52,34,58,38,11);                                   // courtyard to gym walk
    G.rect(24,62,26,102,11);                                  // the walk down the west side
    G.rect(104,62,106,102,11);                                // and the east side
    set(48,63,12); set(49,63,12);                             // the flagpole

    /* ---- THE MARQUEE at the street. Every American high school has one, and in act 1
       it still holds whatever it last said. Paolo authors the words, never me. ---- */
    G.rect(52,125,70,126,16);
    set(60,124,12); set(61,124,12);

    /* ---- act-1 DEAD: dead trees across the lawn ---- */
    for(i=0;i<26;i++){ var tx=6+Math.floor(r()*(W-12)), ty=6+Math.floor(r()*(H-12));
      if(get(tx,ty)===4){ set(tx,ty,3); set(tx+1,ty,3); } }

    /* ---- the one car entrance, canonical south ---- */
    var gx=100;
    for(i=-4;i<=4;i++) set(gx+i,H-1,5);
    for(y=H-1;y>=110;y--) for(x=-4;x<=4;x++){ var c=get(gx+x,y); if(c===0||c===3||c===4) set(gx+x,y,1); }
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:11, pedOver:soft, pedInset:14});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2||v===14||v===15||v===18||v===19||v===20;})};
  }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  /* THE PALETTE CARRIES REAL HUE (7/28). Measured: our icons had a median of 3 hue
     families and 13% chromatic pixels against the reference's 12 and 88%. Faded is not
     the same instruction as brown — a faded maroon is still maroon. School colours are
     the last real colour on a dead campus, which is true of the real ones too. */
  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#7a4038',3:'#514f40',4:'#524b38',5:'#c79a3f',
    6:'#635a42',7:'#9a4a38',8:'#3f5f66',9:'#8a929a',10:'#c9c1aa',11:'#6a675e',12:'#b0863a',
    13:'#4e5138',14:'#2f5a52',15:'#a89878',16:'#b8912f',17:'#6a6e72',
    18:'#a7a08e',19:'#241f1a',20:'#3d5570'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt at the campus edge (setback)'},
    1:{name:'pavement / drive',   kind:'drive',     act1:'cracked pavement — the student lot, bus loop and staff parking (car-drivable)'},
    2:{name:'academic building',  kind:'building',  act1:'the two-storey classroom spine and its wings, maroon roof faded, windows out, doors chained', enter:'high school interior: a double-loaded classroom corridor with lockers down both walls, offices and labs off it'},
    3:{name:'dead tree / landscaping',kind:'tree-dead',act1:'a dead campus tree gone to stick', solid:true},
    4:{name:'dead lawn (campus ground)',kind:'ground',act1:'the dead campus lawn — brown grass and weeds between everything'},
    5:{name:'gate / entrance',    kind:'gate',      act1:'the campus drive entrance off the street, amber curb'},
    6:{name:'field (dead turf)',  kind:'ground',    act1:'the dead football field inside the track — brown, cracked, the yard lines ghosted'},
    7:{name:'running track',      kind:'ground',    act1:'the rubberised running track, faded rust-red, cracked and weed-split'},
    8:{name:'shop yard',          kind:'ground',    act1:'the auto shop yard — a slab gone black with forty years of oil, cars still up on jacks where the work stopped'},
    9:{name:'bleachers',          kind:'structure', act1:'the raked aluminium bleachers down both sidelines, and the press box above the home side'},
    10:{name:'white markings',    kind:'ground',    act1:'faded white paint — yard lines, court lines, parking stalls, kerb stripes'},
    11:{name:'sidewalk / plaza',  kind:'ground',    act1:'the entry plaza and campus walks, concrete cracked, weeds in the joints'},
    12:{name:'pole / light tower',kind:'structure', act1:'a stadium light tower or campus pole, head dark, lamps out'},
    13:{name:'garden bed',        kind:'prop',      act1:'a dead courtyard planter gone to weed', solid:false},
    14:{name:'gymnasium',         kind:'building',  act1:'the gym box, teal school-colour paint still holding long after the windows went', enter:'gymnasium interior: one full-height court with retracted bleachers down both walls, locker rooms off the end'},
    15:{name:'portable classroom',kind:'building',  act1:'a portable classroom on its blocks, skirting split, ramp rusted', enter:'portable interior: one room, desks pushed to the walls'},
    16:{name:'marquee sign',      kind:'structure', act1:'the school marquee at the street, letter board weathered, whatever it last said still up there'},
    17:{name:'dead car',          kind:'vehicle',   act1:'a student\'s car still in its stall, flat, sun-bleached, never collected'},
    18:{name:'roof ridge / vent', kind:'structure', act1:'the ridge line and rooftop plant — the gym\'s barrel crown, the shop\'s sawtooth monitors, the classroom ridges; rusted, some panels gone'},
    19:{name:'doorway',           kind:'portal',    act1:'a way in — the school\'s main and side entrances, the gym\'s field doors, a portable\'s step-up door, the shop\'s roll-up bays standing open'},
    20:{name:'auto shop (CTE)',   kind:'building',  act1:'the vocational shop under its sawtooth roof, roll-up bay doors buckled open, and the parts containers in the yard', enter:'auto shop interior: four bays over drive-on lifts, benches and a tool crib down the back wall, the parts containers still chained'}
  };
  var NOTES={
    summary:'A dead HIGH SCHOOL, and the landmark is the STADIUM: an oval running track with the football field inside it, raked bleachers down both sidelines, a press box and four light towers. Behind it a two-storey classroom spine round a courtyard, a teal gymnasium under a barrel roof, a village of portable classrooms, the AUTO SHOP under its sawtooth roof over an oil-black yard of cars on jacks, the marquee at the street, and the student lot with the cars still in it.',
    reference:[
      'PAOLO RULED IT (7/28): "High school." He was right that the district had to say which — a high school is not a bigger middle school, it is a different building programme. The old module was a generic K-12 with a PLAYGROUND in it, which is an elementary-school object and was simply wrong.',
      'What makes it read as a HIGH SCHOOL: the stadium with real bleachers and lights (not a play field); the STUDENT PARKING LOT, because high schoolers drive and that is the clearest programmatic tell there is; tennis courts and a full athletic strip; portable classrooms for overcrowding; and the marquee at the kerb. No playground.',
      'Friday night lights: the stadium is the most recognisable object an American town owns, and it makes a shape nothing else in this valley makes — an oval track with a rectangle inside it.',
      'PAOLO RULED IT (7/30): "Remove the tennis courts make do what you want." The courts are dead and held at zero by the gate. The ground went to a CTE AUTO SHOP: a real high-school building, the only industrial volume on a civic campus, and in act 1 the reason to walk over there — the tools and the parts are in it. The courts were also a live bug: drawn after the east wing, they overwrote it, which is the meshing he has called out across the whole game.',
      'PAOLO 7/30, THE LEGIBILITY NOTE UNDERNEATH THE RULING: he circled the gym, the courts and the portables and asked what they were. All three were flat colour rectangles. A building read from above is its ROOF and its DOOR, not its fill colour — so the gym got a barrel-roof crown and rooftop plant, the portables got gable ridges, landings and ramps off a spine walk, the classroom spine and wings got ridges and three real entrances, and the shop got sawtooth monitors and roll-up bays. The gate now fails any building mass over 100 tiles that has no roof and no door.'
    ],
    layout:[
      'The two-storey classroom spine runs along the north with west and east wings, wrapped around a courtyard of dead planters.',
      'The GYMNASIUM is its own volume south of the courtyard, in school colours — the second landmark, and the last real colour on a dead campus.',
      'THE STADIUM is the centre and the point: track, field with ghosted yard lines and end zones, raked bleachers down BOTH sidelines, a press box on the home side, four light towers at the corners.',
      'The AUTO SHOP runs down the east under a sawtooth roof, its roll-up bays opening onto an oil-black yard of cars up on jacks and two parts containers; portable classrooms are dropped on the north-east lawn off their own spine walk.',
      'The STUDENT LOT fills the whole south in double-loaded bays — stalls, aisle, stalls — with the cars still in them, and the one car entrance comes off the south street into it.',
      'The marquee stands at the street with the flagpole behind it.'
    ],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: ONE car entrance on the primary street, landing in the STUDENT LOT. The paved network (code 1) is the lot and that entrance drive, and every stall is reachable from the kerb (K.driveReachFromStreet = 1.00 in all six placements). On foot the walks (11) run from the street past the marquee to the entry plaza, into the courtyard, out to the stadium, up the east side to the shop yard and on to the portables\' spine walk. The shop yard (8) is a walking surface, not a second drive — the cars in it are on jacks and are not going anywhere. A corner cell gains a pedestrian gate on the side street.',
    layering:'GROUND (drive): the student lot and its entrance drive (1) with the stall markings (10). GROUND (walk): dead lawn (4), plaza and walks (11), field (6), track (7), the shop yard (8). STRUCTURE (solid, ENTERABLE): the academic building (2), the gymnasium (14), the portables (15), the auto shop (20) — four different interiors. STRUCTURE (solid): the bleachers and press box (9), the light towers and poles (12), the marquee (16), and the roof ridges and rooftop plant (18), which sit ON the building mass and are part of it. PROP: dead trees (3), planters (13). VEHICLE (solid): the dead cars (17), in the lot stalls and up on jacks in the shop yard. PORTAL: the campus gate (5) and every DOORWAY (19) — the school\'s main and side entrances, the gym\'s field and courtyard doors, each portable\'s step-up door, and the shop\'s roll-up bays.',
    decisions:[
      'Paolo 7/28, LOCKED: "High school." Recorded and built the same turn (NOTES ARE RULINGS).',
      'THE PLAYGROUND IS GONE. It was an elementary-school object in a district that is now explicitly a high school.',
      'THE STADIUM IS THE LANDMARK, per EVERY DISTRICT IS ITS OWN LANDMARK (7/28). An oval track around a rectangle is a silhouette nothing else in the valley makes, and it survives shrinking to one tile.',
      'THE STUDENT LOT IS DRESSED, NOT EMPTY. Measured 7/28: pavement is an absence until something happens on it. The cars were never collected, which is also the true story of a school that stopped.',
      'THE PALETTE CARRIES REAL HUE. Measured 7/28: our icons ran a median of 3 hue families and 13% chromatic pixels against the Pocket City 2 reference at 12 and 88%. Faded is not the same instruction as brown.',
      'No school name, no mascot, no marquee text — Paolo\'s to author. The letter board reads weathered.',
      'THE TENNIS COURTS ARE DEAD (Paolo 7/30) and the gate holds them at zero, the same way it holds the playground at zero from his 7/28 ruling. Two rulings, two ratchets, neither can creep back.',
      'NO BUILDING IS A FLAT RECTANGLE (Paolo 7/30, and it is the general lesson, not a school note). He circled three objects and asked what they were, which is the whole Pocket City bar failing out loud: "everything looks unique enough to know what it is at a glance." Roof (18) and door (19) are now a shared vocabulary, machine-checked here, and the other 35 districts are going to need the same treatment.',
      'THE DOSSIER SAID BUS LOOP AND STAFF PARKING AND THE MODULE NEVER BUILT THEM. Corrected 7/30 rather than left standing: a district dossier that describes something the generator does not make is a lie the tiling and interior phases would have built on.',
      'ACT ONE ONLY (Paolo 7/28). Act-2 and act-3 materials are not specified and must not be.'
    ]
  };
  K.register('school', { generate:generate, body:function(c){return c===2||c===14||c===15||c===18||c===19||c===20;}, category:'civic', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaSchool=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
