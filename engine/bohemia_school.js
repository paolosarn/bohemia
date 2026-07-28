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
//   - TENNIS COURTS and a full athletic strip.
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
//  8 courts                 9 bleachers            10 white markings     11 sidewalk / plaza
// 12 pole / light tower    13 garden bed           14 gymnasium          15 portable classroom
// 16 marquee sign          17 dead car
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

    G.rect(0,0,W-1,H-1,0);
    G.rect(3,3,W-4,H-4,4);                                   // the campus, dead lawn to the margins

    /* ---- THE ACADEMIC BUILDING, north, two-storey, wrapped round a courtyard ---- */
    G.rect(8,6,104,20,2);                                    // the long classroom spine
    G.rect(8,20,24,52,2);                                    // west wing
    G.rect(88,20,104,52,2);                                  // east wing
    G.rect(26,22,86,44,11);                                  // the courtyard between them
    G.rect(32,26,44,38,13); G.rect(56,26,68,38,13);          // courtyard planters, gone to weed
    for(x=30;x<=80;x+=9) set(x,40,3);                        // courtyard trees, dead
    for(x=12;x<=100;x+=7){ set(x,6,10); set(x,7,10); }       // the window band on the front face

    /* ---- THE GYMNASIUM. Its own volume, its own colour, taller than everything: in a
       real high school the gym is the second landmark after the stadium. ---- */
    G.rect(28,48,76,66,14);
    for(x=32;x<=72;x+=6){ set(x,48,10); set(x,49,10); }      // clerestory band
    G.rect(48,66,58,68,11);                                  // the doors out to the field

    /* ---- PORTABLE CLASSROOMS, the overcrowding annex ---- */
    for(i=0;i<3;i++){ var py=8+i*11; G.rect(108,py,122,py+8,15); set(109,py+4,10); }

    /* ---- THE STADIUM: THE LANDMARK. Track, field, bleachers both sides, four towers.

       A RUNNING TRACK IS AN OBROUND, NOT AN ELLIPSE — two straights closed by two
       semicircular ends. Drawn as an ellipse the first time, and the rectangular field
       inside it punched straight out through the bends, because an ellipse narrows
       everywhere while a real track holds full width along the whole straight. The
       infield fits inside a track for exactly this reason and for no other. ---- */
    var fx=64, fy=88, SL=20, RO=18, RI=12;          // straight half-length, outer/inner radius
    function obround(px,py,sl,rad){                  // distance test for a stadium shape
      var dx=Math.abs(px-fx), dy=Math.abs(py-fy);
      if(dx<=sl) return dy<=rad;
      var ox=dx-sl; return Math.sqrt(ox*ox+dy*dy)<=rad;
    }
    for(y=fy-RO-1;y<=fy+RO+1;y++) for(x=fx-SL-RO-1;x<=fx+SL+RO+1;x++){
      if(obround(x,y,SL,RO) && !obround(x,y,SL,RI)) set(x,y,7);        // the rust track
    }
    G.rect(fx-SL,fy-RI+1,fx+SL,fy+RI-1,6);                              // the field, inside the straights
    for(x=fx-SL+1;x<=fx+SL-1;x++) set(x,fy,10);                         // the 50 yard line
    for(i=-3;i<=3;i++){ var lx=fx+i*5; if(Math.abs(lx-fx)<SL) for(y=fy-RI+2;y<=fy+RI-2;y++) set(lx,y,10); }
    for(y=fy-RI+1;y<=fy+RI-1;y++){ set(fx-SL,y,10); set(fx+SL,y,10);    // sidelines
      set(fx-SL+4,y,10); set(fx+SL-4,y,10); }                           // the end zones
    // RAKED BLEACHERS down both long sides — three rows, rising away from the field
    for(i=0;i<3;i++){
      G.rect(fx-SL-2+i, fy-RO-3-i, fx+SL+2-i, fy-RO-3-i, 9);
      G.rect(fx-SL-2+i, fy+RO+3+i, fx+SL+2-i, fy+RO+3+i, 9);
    }
    G.rect(fx-7,fy-RO-8,fx+7,fy-RO-6,9);                                // the press box, home side
    // FOUR LIGHT TOWERS. Friday night lights: the tallest things on the site.
    [[fx-SL-RO-3,fy-RO-4],[fx+SL+RO+3,fy-RO-4],[fx-SL-RO-3,fy+RO+4],[fx+SL+RO+3,fy+RO+4]].forEach(function(p){
      for(i=-1;i<=1;i++)for(var j=-1;j<=1;j++) set(p[0]+i,p[1]+j,12);
    });

    /* ---- TENNIS COURTS, the athletic strip, north-east beside the gym ---- */
    for(i=0;i<2;i++){ var cy2=48+i*11;
      G.rect(84,cy2,120,cy2+9,8);
      for(x=85;x<=119;x++) set(x,cy2+5,10);                             // the net line
      G.rect(84,cy2,120,cy2,10); G.rect(84,cy2+9,120,cy2+9,10);
    }

    /* ---- THE STUDENT LOT, across the south. The tell: high schoolers drive, and these
       cars were never collected. Pavement is not content until something happens on
       it (measured 7/28). ---- */
    G.rect(4,110,124,124,1);
    for(y=113;y<=122;y+=4) for(x=6;x<=122;x++) if(get(x,y)===1) set(x,y,10);
    for(i=0;i<34;i++){
      var cx2=6+Math.floor(r()*116), cy3=111+Math.floor(r()*12);
      if(get(cx2,cy3)===1||get(cx2,cy3)===10){ set(cx2,cy3,17); set(cx2+1,cy3,17); set(cx2,cy3+1,17); set(cx2+1,cy3+1,17); }
    }

    /* ---- THE BUS LOOP, kept separate from student traffic, west edge ---- */
    G.rect(4,70,18,110,1);   // runs down to MEET the lot -- a one-tile gap severed it
    for(y=74;y<=104;y+=6) set(11,y,10);

    /* ---- THE ENTRY PLAZA, walks and the flagpole ---- */
    G.rect(46,68,72,70,11);                                   // the plaza in front of the gym
    G.rect(52,44,58,46,11);                                   // courtyard to gym walk
    G.rect(24,68,26,110,11);                                  // the walk down the west side
    G.rect(104,68,106,110,11);                                // and the east side
    set(48,69,12); set(49,69,12);                             // the flagpole

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
      footprints:K.footprints(g,function(v){return v===2||v===14||v===15;})};
  }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  /* THE PALETTE CARRIES REAL HUE (7/28). Measured: our icons had a median of 3 hue
     families and 13% chromatic pixels against the reference's 12 and 88%. Faded is not
     the same instruction as brown — a faded maroon is still maroon. School colours are
     the last real colour on a dead campus, which is true of the real ones too. */
  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#7a4038',3:'#3a4526',4:'#49512e',5:'#c79a3f',
    6:'#4f6038',7:'#9a4a38',8:'#3f5f66',9:'#8a929a',10:'#c9c1aa',11:'#6a675e',12:'#b0863a',
    13:'#41501f',14:'#2f5a52',15:'#a89878',16:'#b8912f',17:'#6a6e72'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt at the campus edge (setback)'},
    1:{name:'pavement / drive',   kind:'drive',     act1:'cracked pavement — the student lot, bus loop and staff parking (car-drivable)'},
    2:{name:'academic building',  kind:'building',  act1:'the two-storey classroom spine and its wings, maroon roof faded, windows out, doors chained', enter:'high school interior: a double-loaded classroom corridor with lockers down both walls, offices and labs off it'},
    3:{name:'dead tree / landscaping',kind:'tree-dead',act1:'a dead campus tree gone to stick', solid:false},
    4:{name:'dead lawn (campus ground)',kind:'ground',act1:'the dead campus lawn — brown grass and weeds between everything'},
    5:{name:'gate / entrance',    kind:'gate',      act1:'the campus drive entrance off the street, amber curb'},
    6:{name:'field (dead turf)',  kind:'ground',    act1:'the dead football field inside the track — brown, cracked, the yard lines ghosted'},
    7:{name:'running track',      kind:'ground',    act1:'the rubberised running track, faded rust-red, cracked and weed-split'},
    8:{name:'tennis court',       kind:'ground',    act1:'a dead tennis court — cracked blue-green slab, nets gone, lines ghosted'},
    9:{name:'bleachers',          kind:'structure', act1:'the raked aluminium bleachers down both sidelines, and the press box above the home side'},
    10:{name:'white markings',    kind:'ground',    act1:'faded white paint — yard lines, court lines, parking stalls, kerb stripes'},
    11:{name:'sidewalk / plaza',  kind:'ground',    act1:'the entry plaza and campus walks, concrete cracked, weeds in the joints'},
    12:{name:'pole / light tower',kind:'structure', act1:'a stadium light tower or campus pole, head dark, lamps out'},
    13:{name:'garden bed',        kind:'prop',      act1:'a dead courtyard planter gone to weed', solid:false},
    14:{name:'gymnasium',         kind:'building',  act1:'the gym box, teal school-colour paint still holding long after the windows went', enter:'gymnasium interior: one full-height court with retracted bleachers down both walls, locker rooms off the end'},
    15:{name:'portable classroom',kind:'building',  act1:'a portable classroom on its blocks, skirting split, ramp rusted', enter:'portable interior: one room, desks pushed to the walls'},
    16:{name:'marquee sign',      kind:'structure', act1:'the school marquee at the street, letter board weathered, whatever it last said still up there'},
    17:{name:'dead car',          kind:'vehicle',   act1:'a student\'s car still in its stall, flat, sun-bleached, never collected'}
  };
  var NOTES={
    summary:'A dead HIGH SCHOOL, and the landmark is the STADIUM: an oval running track with the football field inside it, raked bleachers down both sidelines, a press box and four light towers. Behind it a two-storey classroom spine round a courtyard, a teal gymnasium, portable classrooms, tennis courts, the marquee at the street, and the student lot with the cars still in it.',
    reference:[
      'PAOLO RULED IT (7/28): "High school." He was right that the district had to say which — a high school is not a bigger middle school, it is a different building programme. The old module was a generic K-12 with a PLAYGROUND in it, which is an elementary-school object and was simply wrong.',
      'What makes it read as a HIGH SCHOOL: the stadium with real bleachers and lights (not a play field); the STUDENT PARKING LOT, because high schoolers drive and that is the clearest programmatic tell there is; tennis courts and a full athletic strip; portable classrooms for overcrowding; and the marquee at the kerb. No playground.',
      'Friday night lights: the stadium is the most recognisable object an American town owns, and it makes a shape nothing else in this valley makes — an oval track with a rectangle inside it.'
    ],
    layout:[
      'The two-storey classroom spine runs along the north with west and east wings, wrapped around a courtyard of dead planters.',
      'The GYMNASIUM is its own volume south of the courtyard, in school colours — the second landmark, and the last real colour on a dead campus.',
      'THE STADIUM is the centre and the point: track, field with ghosted yard lines and end zones, raked bleachers down BOTH sidelines, a press box on the home side, four light towers at the corners.',
      'Tennis courts run down the east; portable classrooms sit on the north-east lawn.',
      'The STUDENT LOT fills the south-west with the cars still in their stalls. The bus loop and staff parking are separate, on the east, so student and bus traffic never mix.',
      'The marquee stands at the street with the flagpole behind it.'
    ],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: ONE car entrance on the primary street. The paved network — student lot, bus loop, staff parking (code 1) — is the drivable surface and every part of it is reachable from the kerb (K.driveReachFromStreet). On foot the walks (11) run from the street past the marquee to the entry plaza, into the courtyard and out to the stadium. Bus and student traffic are deliberately separated, which is the real site-planning rule. A corner cell gains a pedestrian gate on the side street.',
    layering:'GROUND (drive): the lot, loop and staff parking (1) and their stall markings (10). GROUND (walk): dead lawn (4), plaza and walks (11), field (6), track (7), courts (8). STRUCTURE (solid, ENTERABLE): the academic building (2), the gymnasium (14), the portables (15) — three different interiors. STRUCTURE (solid): the bleachers and press box (9), the light towers and poles (12), the marquee (16). PROP: dead trees (3), planters (13). VEHICLE (solid): the dead cars (17). PORTAL: the gate (5).',
    decisions:[
      'Paolo 7/28, LOCKED: "High school." Recorded and built the same turn (NOTES ARE RULINGS).',
      'THE PLAYGROUND IS GONE. It was an elementary-school object in a district that is now explicitly a high school.',
      'THE STADIUM IS THE LANDMARK, per EVERY DISTRICT IS ITS OWN LANDMARK (7/28). An oval track around a rectangle is a silhouette nothing else in the valley makes, and it survives shrinking to one tile.',
      'THE STUDENT LOT IS DRESSED, NOT EMPTY. Measured 7/28: pavement is an absence until something happens on it. The cars were never collected, which is also the true story of a school that stopped.',
      'THE PALETTE CARRIES REAL HUE. Measured 7/28: our icons ran a median of 3 hue families and 13% chromatic pixels against the Pocket City 2 reference at 12 and 88%. Faded is not the same instruction as brown.',
      'No school name, no mascot, no marquee text — Paolo\'s to author. The letter board reads weathered.',
      'ACT ONE ONLY (Paolo 7/28). Act-2 and act-3 materials are not specified and must not be.'
    ]
  };
  K.register('school', { generate:generate, body:function(c){return c===2||c===14||c===15;}, category:'civic', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaSchool=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
