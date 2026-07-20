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

    // ---- SCHOOL BUILDING — an E-shape (spine + three classroom wings) at the back, + the GYM ----
    G.rect(20,12,96,20,2);                                                // main spine (front classrooms/admin)
    G.rect(20,20,28,44,2); G.rect(54,20,62,44,2); G.rect(88,20,96,44,2);  // three classroom wings
    G.rect(100,12,120,34,2);                                              // the GYM (big box, east)
    G.rect(16,22,20,40,11);                                               // entry sidewalk on the spine
    for(x=22;x<=94;x+=6) set(x,11,10);                                    // window/roof detail line

    // ---- SPORTS FIELD + running TRACK (the hero), on the WEST lawn (clear of the drives) ----
    var fx=40, fy=84;
    ellRing(fx,fy,30,22,25,17,7);                                        // the running TRACK (rust ring)
    G.rect(fx-26,fy-13,fx+26,fy+13,6);                                    // the FIELD inside the track (dead turf)
    for(x=fx-24;x<=fx+24;x++){ set(x,fy,10); }                            // midline
    for(var cc=0;cc<360;cc+=4){ var cr=cc*Math.PI/180; var mx=Math.round(fx+Math.cos(cr)*6), my=Math.round(fy+Math.sin(cr)*4); if(get(mx,my)===6)set(mx,my,10); } // center circle
    G.rect(fx-26,fy-13,fx-25,fy+13,10); G.rect(fx+25,fy-13,fx+26,fy+13,10); // sidelines
    // PLAYGROUND on the NW lawn (above the field)
    G.rect(10,48,28,62,9);
    // BASKETBALL COURTS (2) on the east lawn (clear of the drives)
    G.rect(104,50,122,63,8); G.rect(104,68,122,81,8);
    for(y=51;y<=62;y++)set(113,y,10); for(y=69;y<=80;y++)set(113,y,10);
    G.rect(104,50,122,50,10); G.rect(104,63,122,63,10); G.rect(104,68,122,68,10); G.rect(104,81,122,81,10);

    // ---- SEPARATE drives, all EAST of the field + knit to the gate: BUS LOOP, DROP-OFF, PARKING ----
    G.rect(40,113,92,119,1);                                              // bottom drive band (ties everything to the gate)
    G.rect(76,44,80,116,1);                                               // BUS lane (up the east)
    G.rect(84,44,88,116,1); for(y=50;y<=110;y+=6) set(86,y,10);           // DROP-OFF lane + queue stripes (kept separate)
    G.rect(76,44,88,47,1);                                                // top cross — the loop return in front of the building
    G.rect(92,96,122,116,1);                                             // staff PARKING lot (SE)
    for(x=96;x<=120;x+=5){ set(x,100,10); set(x,101,10); set(x,108,10); set(x,109,10); } // parking stalls

    // ---- dead trees line the drives + dot the lawn; FLAGPOLE at the entry plaza ----
    for(y=46;y<=112;y+=8){ set(74,y,3); }                                // trees along the bus lane
    for(i=0;i<24;i++){ var tx=8+Math.floor(r()*(W-16)), ty=46+Math.floor(r()*(H-54)); if(get(tx,ty)===4)set(tx,ty,3); }
    set(58,24,12); set(59,24,12);                                        // flagpole at the plaza

    // ---- ENTRANCE off the SOUTH street (rotated to the real street by the kit) ----
    var gx=W>>1;
    for(i=-4;i<=4;i++)set(gx+i,H-1,5);
    for(y=H-1;y>=H-10;y--)for(x=-3;x<=3;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4)set(gx+x,y,1); } // punch to the bottom band
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
    7:'#8a5040',8:'#4e5a5f',9:'#8a6a3a',10:'#c9c1aa',11:'#6a675e',12:'#b0863a'};
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
    12:{name:'flagpole / light',  kind:'prop',       act1:'the empty flagpole / a campus pole light, halyard slapping, head dark'}
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
