// BOHEMIA SCHOOL (7/20/26). CIVIC, on the DISTRICT KIT. Research-first (school campus site-plan
// guides — edrawmax school layouts, SC Dept of Ed bus-lot planning, Whisker Architecture campus
// planning, CA Dept of Ed site guide): academic BUILDINGS (classrooms/gym/library) on a campus of
// dead LAWN, a SPORTS FIELD ringed by a running TRACK, BASKETBALL COURTS, a PLAYGROUND, and — kept
// SEPARATE for safety — a BUS LOOP and a passenger DROP-OFF loop plus staff PARKING, laced by
// walkways, a flagpole at the entry plaza. Act-1 DEAD: broken windows, weeds through the field + lawn,
// faded court/field lines, dead trees, an empty flagpole. Street-aware + drivable (the bus loop +
// drop-off + parking are the car surface, reachable from the curb). Full dossier + layering.
// LEGEND:
//  0 desert dead-ground          1 pavement / drive (DRIVABLE: bus loop, drop-off, parking)
//  2 building (school / gym)      3 dead tree / landscaping
//  4 dead lawn (campus ground)    5 gate / entrance
//  6 sports field (dead turf)     7 running track
//  8 basketball court             9 playground
//  10 white markings (field/court/stall lines)   11 sidewalk / plaza   12 flagpole / light
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    function ellRing(cx,cy,rx,ry,rx2,ry2,code){ for(var dy=-ry;dy<=ry;dy++)for(var dx=-rx;dx<=rx;dx++){
      var o=(dx*dx)/(rx*rx)+(dy*dy)/(ry*ry), i2=(dx*dx)/(rx2*rx2)+(dy*dy)/(ry2*ry2);
      if(o<=1 && i2>1 && get(cx+dx,cy+dy)!=null) set(cx+dx,cy+dy,code); } }

    // ---- BASE: campus DEAD LAWN, desert only at the very margins ----
    G.rect(0,0,W-1,H-1,0);
    G.rect(5,7,W-6,H-6,4);

    // WALKABLE-LAND rebuild (Paolo 7/20 "the school is kind of dog shit... incomplete"): a full,
    // FINISHED campus — a building complex wrapped around a QUAD, gym + cafeteria, an entry plaza,
    // portables, courts, gardens — with the field/track he liked kept. Content fills the land.

    // ---- BUILDING COMPLEX at the back, wrapped around a QUAD courtyard (2-storey read) ----
    G.rect(10,8,118,22,2);                                                // long north classroom/admin bar
    G.rect(10,22,26,56,2);                                                // west wing
    G.rect(102,22,118,56,2);                                              // east wing
    G.rect(28,24,100,42,11);                                              // the QUAD (courtyard plaza) between the wings
    G.rect(34,28,46,38,13); G.rect(60,28,72,38,13); G.rect(86,28,98,38,13); // garden beds in the quad
    for(x=32;x<=96;x+=8) set(x,33,3);                                     // quad trees
    G.rect(30,44,58,60,2);                                                // the GYM
    G.rect(66,44,98,60,2);                                                // the CAFETERIA / LIBRARY
    for(x=14;x<=114;x+=6) set(x,8,10);                                    // roof/window detail line
    for(y=26;y<=52;y+=6){ set(10,y,10); set(118,y,10); }

    // ---- ENTRY PLAZA + covered walk + FLAGPOLE, front-center ----
    G.rect(44,62,84,72,11);                                               // entry plaza
    G.rect(62,60,66,62,11);                                               // covered walk up to the cafeteria
    set(64,66,12); set(65,66,12);                                        // flagpole
    G.rect(10,60,24,74,2); set(11,61,10); set(23,61,10);                 // PORTABLES annex (temp classrooms), NW

    // ---- SPORTS FIELD + running TRACK (the hero Paolo liked), center-left-lower, with bleachers ----
    var fx=40, fy=94;
    ellRing(fx,fy,30,20,25,15,7);                                        // the running TRACK (rust ring)
    G.rect(fx-25,fy-12,fx+25,fy+12,6);                                    // the FIELD (dead turf)
    for(x=fx-23;x<=fx+23;x++){ set(x,fy,10); }                            // midline
    for(var cc=0;cc<360;cc+=4){ var cr=cc*Math.PI/180; var mx=Math.round(fx+Math.cos(cr)*6), my=Math.round(fy+Math.sin(cr)*4); if(get(mx,my)===6)set(mx,my,10); } // center circle
    G.rect(fx-25,fy-12,fx-24,fy+12,10); G.rect(fx+24,fy-12,fx+25,fy+12,10); // sidelines
    G.rect(fx-11,fy-12,fx-10,fy+12,10); G.rect(fx+10,fy-12,fx+11,fy+12,10); // the yard/goal lines (reads finished)
    G.rect(10,116,70,118,2); G.rect(10,70,12,118,2);                     // BLEACHERS along the field

    // ---- BASKETBALL COURTS (2) + PLAYGROUND, in the band between the field and the drives ----
    G.rect(74,76,92,90,8); G.rect(74,94,92,108,8);
    for(y=77;y<=89;y++)set(83,y,10); for(y=95;y<=107;y++)set(83,y,10);
    G.rect(74,76,92,76,10); G.rect(74,90,92,90,10); G.rect(74,94,92,94,10); G.rect(74,108,92,108,10);
    G.rect(74,62,92,74,9);                                                // playground beside the courts

    // ---- DRIVES: a bus/drop-off LOOP + staff parking on the right, separate from the walk campus ----
    G.rect(98,58,118,62,1); G.rect(98,58,102,118,1); G.rect(114,58,118,118,1); G.rect(98,114,118,118,1); // the loop
    for(y=64;y<=110;y+=6) set(100,y,10);                                  // drop-off queue stripes (west leg)
    G.rect(104,96,112,116,1);                                            // staff parking pocket inside the loop
    for(x=104;x<=110;x+=3){ set(x,100,10); set(x,108,10); }
    G.rect(94,66,97,68,10);                                               // a wreck/abandoned car marker in the lot

    // ---- dead trees dot the lawn ----
    for(i=0;i<20;i++){ var tx=8+Math.floor(r()*(W-16)), ty=44+Math.floor(r()*(H-56)); if(get(tx,ty)===4)set(tx,ty,3); }

    // ---- ENTRANCE off the SOUTH street (gate under the drive loop, rotated by the kit) ----
    var gx=108;
    for(i=-3;i<=3;i++)set(gx+i,H-1,5);
    for(y=H-1;y>=114;y--)for(x=-2;x<=2;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4)set(gx+x,y,1); } // punch to the loop
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:14});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})};
  }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#7a6f5c',3:'#3a4526',4:'#49512e',5:'#c79a3f',6:'#5b6a44',
    7:'#8a5040',8:'#4e5a5f',9:'#8a6a3a',10:'#c9c1aa',11:'#6a675e',12:'#b0863a',13:'#41501f'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt at the campus edge (setback)'},
    1:{name:'pavement / drive',   kind:'drive',      act1:'cracked pavement — the bus loop, drop-off lane + staff parking (car-drivable)'},
    2:{name:'building (school / gym)',kind:'building',act1:'the school wings + gym, windows broken, doors chained, faded lettering', enter:'school interior: a double-loaded classroom corridor (classrooms both sides), the gym + library + offices off it'},
    3:{name:'dead tree / landscaping',kind:'tree-dead',act1:'a dead campus tree / shrub gone to stick', solid:false},
    4:{name:'dead lawn (campus ground)',kind:'ground',act1:'the dead campus lawn — brown grass + weeds, the ground between everything'},
    5:{name:'gate / entrance',    kind:'gate',       act1:'the campus drive entrance off the street, amber curb'},
    6:{name:'sports field (dead turf)',kind:'ground',act1:'the dead football/soccer field inside the track — brown, cracked, the crown faint'},
    7:{name:'running track',      kind:'ground',     act1:'the rubberized running track ring, faded rust-red, cracked + weed-split'},
    8:{name:'basketball court',   kind:'ground',     act1:'a dead outdoor court — cracked slab, hoops bent, lines ghosted'},
    9:{name:'playground',        kind:'play',        act1:'the sun-bleached playground — structures rusted, safety surface split'},
    10:{name:'white markings',    kind:'ground',     act1:'faded white paint — field/court lines, drop-off queue + parking stalls'},
    11:{name:'sidewalk / plaza',  kind:'ground',     act1:'the entry plaza + walkways, concrete cracked, weeds in the joints'},
    12:{name:'flagpole / light',  kind:'prop',       act1:'the empty flagpole / a campus pole light, halyard slapping, head dark'},
    13:{name:'garden bed',        kind:'prop',       act1:'a dead courtyard garden bed / planter in the quad, gone to weed', solid:false}
  };
  var NOTES={
    summary:'A dead K-12 school — an E-shaped classroom building + gym on a campus of dead lawn, a sports field ringed by a running track, basketball courts, a playground, and separate bus-loop / drop-off / staff-parking drives with a flagpole at the entry plaza.',
    reference:['School campus site-plan guides (edrawmax school layouts, SC Dept of Ed bus-lot planning, Whisker Architecture campus planning, CA Dept of Ed site guide): academic BUILDINGS (classrooms/gym/library/admin) plus SPORTS areas (field, track, courts); the BUS loop is kept SEPARATE from the passenger DROP-OFF loop for student safety, each with sidewalk access to the entry; short-term parking near the main entrance; fire/service roads; playgrounds, pathways + gardens across the campus.'],
    layout:['The campus is dead LAWN (desert only at the margins); an E-shaped SCHOOL building (front spine + three classroom wings) sits at the back with the GYM box on the east.',
      'The hero is the SPORTS FIELD ringed by a rust-red running TRACK, lower-center, with faded field lines; two BASKETBALL COURTS sit on the east lawn and a PLAYGROUND on the west.',
      'Three SEPARATE drives run up the campus (SC-Ed safety rule): a BUS LOOP on the west edge, a passenger DROP-OFF lane center (queue stripes), and a staff PARKING lot at the SE.',
      'Dead trees line the drives + dot the lawn; a flagpole stands at the entry plaza; walkways knit the buildings to the entrances.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the campus drive is on the primary street; the paved network (bus loop + drop-off + staff parking, code 1) is the drivable surface, all knit to the street entrance so a car/bus reaches every part from the curb (K.driveReachFromStreet). Foot circulation is the sidewalks/plaza (11) + lawn; buses and passenger cars are separated. Corner side streets get a pedestrian gate.',
    layering:'GROUND plane (walk/drive, flat): the dead lawn (4), pavement/drives (1, drive), sidewalk/plaza (11), sports field (6), running track (7), courts (8), and white markings (10) — all flat, you cross them. STRUCTURES (¾ front face, solid, ENTERABLE): the school + gym (2 -> classroom-corridor interior). PLAY: the playground (9). PROPS: dead trees (3), the flagpole/pole lights (12). PORTALS: the gate (5). The buildings are the vertical mass; the rest is a broad low campus of lawn, field, track and pavement you move across.',
    decisions:['Act-1 DEAD: broken windows + chained doors, weeds through the field/track/lawn, ghosted court + field lines, dead trees, an empty flagpole, cracked courts. No living turf, no children (LIFE places agents later).',
      'Civic category (school). Zero purple. No school name/mascot (Paolo\'s to author if ever) — signage reads dead.',
      'Bus loop and passenger drop-off are DELIBERATELY separate drives (the site-plan safety rule), not one shared lane.',
      'Research-first (per the playbook): built from real school campus site plans, not memory.']
  };
  K.register('school', { generate:generate, body:function(c){return c===2;}, category:'civic', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaSchool=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
