// BOHEMIA CASINO (8/18/26, WORLD lane). GAMING/RESORT, on the DISTRICT KIT. The DOWNTOWN
// casino, and it is deliberately NOT the Strip resort next door in engine/bohemia_resort.js.
//
// RESEARCH-FIRST, and the difference is the whole point (Fremont Street / Glitter Gulch:
// the Golden Nugget, Binion's, the Four Queens, the Fremont Street Experience canopy):
//   * A downtown casino has NO SETBACK AT ALL. The casino floor meets the sidewalk on the
//     building line, doors straight off the pavement, because these blocks were platted
//     before anybody parked a car. A Strip resort has a 100 m arrival drive; this has a
//     doorway.
//   * The mass is LOW AND WIDE — one enormous single-storey casino floor swallowing most
//     of the block — with a SLENDER HOTEL WING standing on the back of it, not the
//     podium-and-tower silhouette of the Strip.
//   * The frontage is SIGN, floor to roof: the marquee IS the facade. Downtown sold itself
//     with light, not with architecture. NOT the Fremont canopy, famous as it is -- Paolo
//     banned canopies on 8/2 and a gate must never outrank a ruling, so the sign does the
//     whole job standing up instead of reaching out.
//   * The car is banished to the back: a SELF-PARK DECK on the alley, and a short VALET
//     LANE off the side street. No porte cochere across the front — there is no room.
//   * The block is cut by a SERVICE ALLEY, which is the other thing the old grid has and
//     the Strip does not.
//
// ACT-1 DEAD: the floor dark and stripped, every tube broken off, the marquee blank,
// the alley full of what got dragged out of the building.
//
// NOTHING ENCLOSES THE PLOT (Paolo 8/16, LOCKED): "no perimeter walls until I tell you,
// bro no fencing no nothing bro." No fence, no yard wall, no bollard line, no kerb ring.
// The building meeting the sidewalk is the edge — which is exactly what a Fremont block
// actually does, so this costs nothing.
//
// LEGEND:
//  0 sidewalk            1 valet / alley surface (DRIVABLE)   2 casino floor (mass)
//  3 debris / dead planting                                   4 floor roof band
//  5 drive entrance (curb cut — NOT a gate in a fence)        6 hotel wing
//  7 entry apron (paved, open sky)                            8 self-park deck
//  9 sign standard       10 abandoned vehicle                 11 lane marking
// 12 marquee sign       13 casino doors (PORTAL)             14 wing roof plant
// 15 floor skylight
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);

  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    var cx=W>>1;

    // ---- BASE: sidewalk. On an old downtown block that is all the open ground there is.
    G.rect(0,0,W-1,H-1,0);

    // ---- THE CASINO FLOOR. One enormous low mass filling the block right up to the
    //      building line on the primary (south) frontage. No setback, no lawn, no apron.
    G.rect(6,14,W-7,96,2);
    G.rect(12,18,W-13,26,4);                                  // roof plant band along the back
    // THE FLOOR ROOF IS THE BUSIEST SURFACE ON THE SITE. A downtown casino floor is one
    // enormous single-storey plate and everything that serves it — chillers, extract,
    // duct runs — stands on top of it, with SKYLIGHTS punched over the pit. Drawn flat it
    // read as a blank slab, which is exactly the "they all look the same" complaint.
    for(y=32;y<=90;y+=9){
      for(x=10;x<=W-11;x+=12){
        if(get(x,y)!==2) continue;
        var pw=3+Math.floor(r()*4), ph=2+Math.floor(r()*4);
        if(r()<0.5) G.rect(x,y,Math.min(x+pw,W-11),Math.min(y+ph,92),4);
        else if(r()<0.6) G.rect(x,y,Math.min(x+pw+3,W-11),Math.min(y+ph,92),15);
      }
    }

    // ---- THE HOTEL WING on the BACK of the floor, slender, standing on the mass.
    //      Downtown builds up at the rear where the block is cheap, never across the front.
    G.rect(26,20,60,46,6);
    G.rect(32,26,54,34,14);                                   // wing roof plant

    // ---- THE FRONTAGE IS SIGN, AND IT IS ALL SIGN. No canopy over the walk (Paolo 8/2,
    //      LOCKED: "no more canopies I only see canopies at parks and shit") -- the Fremont
    //      canopy is the most famous canopy in America and it is still a canopy, and a gate
    //      must never outrank a ruling. So the sign does the whole job on its own terms:
    //      the MARQUEE runs the full building line floor to roof rather than sitting in two
    //      towers with a roof strung between them, and a row of SIGN PYLONS stands out at
    //      the kerb. Nothing overhangs the pavement.
    G.rect(8,90,W-9,96,12);                                   // the marquee, the whole frontage, blank faces
    G.rect(10,97,22,99,12); G.rect(W-23,97,W-11,99,12);       // the two end pylons, out at the kerb
    for(x=26;x<=W-27;x+=13) set(x,100,9);                     // sign standards down the walk, heads dark
    G.rect(cx-10,95,cx+10,96,13);                             // the casino doors, straight off the walk

    // ---- THE SERVICE ALLEY across the back of the block: the other thing the old grid has.
    G.rect(4,4,W-5,12,1);
    G.rect(4,4,10,H-1,1);                                     // and down the west side, out to the street
    for(i=0;i<26;i++){ var ax=6+Math.floor(r()*(W-14)), ay=5+Math.floor(r()*7);
      if(get(ax,ay)===1&&r()<0.5) set(ax,ay,3); }             // what got dragged out of the building

    // ---- THE VALET LANE off the side (east) street: a short in-and-out, no porte cochere.
    G.rect(W-11,60,W-5,H-1,1);
    G.rect(W-24,88,W-5,94,1);
    for(y=64;y<=H-8;y+=9) set(W-8,y,11);                      // lane centre dashes

    // ---- THE SELF-PARK DECK on the alley, where the car belongs downtown ----
    G.rect(W-40,14,W-13,50,8);

    // ---- CURB CUTS: the only "gate" this district has. A gap in the kerb where the lane
    //      meets the street. No fence, no barrier, nothing to open (Paolo 8/16, LOCKED).
    for(y=H-6;y<=H-1;y++) set(W-8,y,5);
    for(x=4;x<=10;x++) set(x,H-1,5);
    for(y=H-6;y<=H-1;y++){ for(x=W-11;x<=W-5;x++) if(get(x,y)===1) set(x,y,1); }

    // ---- dead dressing ----
    G.rect(W-10,70,W-9,74,10); G.rect(6,108,7,112,10);
    for(i=0;i<14;i++){ var dx=4+Math.floor(r()*(W-8)), dy=104+Math.floor(r()*20);
      if(get(dx,dy)===0&&r()<0.4) set(dx,dy,3); }             // drift on the dead sidewalk
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:0, pedOver:soft, pedInset:8});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      /* ONE MASS, ONE FOOTPRINT — see the note in bohemia_resort.js. Asked in one pass,
         footprints() returns a single component swallowing floor + wing + deck, and the
         INTERIOR-MATCHES-EXTERIOR LAW would then build one interior the size of the block
         instead of three real volumes. Each mass carries its own roof code. */
      footprints:K.footprints(g,function(v){return v===2||v===4||v===15;})
        .concat(K.footprints(g,function(v){return v===6||v===14;}))
        .concat(K.footprints(g,function(v){return v===8;}))
        .concat(K.footprints(g,function(v){return v===12;}))};
  }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  /* ORDERED BY HEIGHT, NOT BY TASTE (45 DEGREE ART LAW: the tallest thing catches the most
     sky). The wing stands above the floor and is lighter than it; the park deck tucked on
     the alley is the darkest mass; the marquee towers are the brightest thing on the block
     because on a real Fremont frontage the sign is what you see and the building is not. */
  var PALETTE={0:'#565046',1:'#3f3d38',2:'#6a5f4e',3:'#4a4030',4:'#8a8072',5:'#c2a86a',6:'#948a76',
    7:'#8c7f63',8:'#4e4a44',9:'#8f8676',10:'#55555f',11:'#c9c1aa',12:'#a8944e',13:'#2e2a24',
    14:'#a0967e',15:'#b6b3a4'};
  var LEGEND={
    0:{name:'sidewalk',           kind:'ground',    act1:'the downtown sidewalk running straight into the building line, cracked, grit in the joints'},
    1:{name:'valet lane / alley', kind:'drive',      act1:'the service alley across the back and the short valet lane off the side street (car-drivable)'},
    2:{name:'casino floor',       kind:'building',   act1:'the casino floor: one enormous low mass filling the block, glass out at the walk', enter:'the floor: black carpet under a dead ceiling, machine banks pushed into rows, the cage stripped and standing open'},
    3:{name:'debris / dead planting',kind:'tree-dead',act1:'what got dragged out of the building and left in the alley, and dead planting gone to dust', solid:false},
    4:{name:'floor roof band',    kind:'structure',  act1:'the roof plant band along the back of the casino floor, ducting and dead fans standing on it'},
    5:{name:'drive entrance',     kind:'gate',       act1:'the curb cut where the valet lane and the alley meet the street — a gap in the kerb, nothing to open, no fence either side', solid:false},
    6:{name:'hotel wing',         kind:'building',   act1:'the slender hotel wing standing on the back of the floor, window units hanging out of half the openings', enter:'a corridor of rooms: doors ajar, a smell of dust and old smoke, no light'},
    7:{name:'entry apron',        kind:'ground',     act1:'the paved apron in front of the doors, open to the sky, grit and broken tube glass drifted across it', solid:false},
    8:{name:'self-park deck',     kind:'building',   act1:'the self-park deck on the alley, ramp mouth open', enter:'a parking deck: cars left in the bays, the ramp turning down into black'},
    9:{name:'sign standard',      kind:'prop',       act1:'a sign standard out at the kerb, its tubes broken off at the collar'},
    10:{name:'abandoned vehicle', kind:'vehicle',    act1:'a car left in the valet lane where it was abandoned, doors open'},
    11:{name:'lane marking',      kind:'marking',    act1:'faded valet-lane centre dashes'},
    12:{name:'marquee sign',      kind:'structure',  act1:'a marquee tower on the building line, floor to roof, the sign face dark and blank'},
    13:{name:'casino doors',      kind:'portal',     act1:'the casino doors straight off the sidewalk, one leaf standing open', solid:false},
    14:{name:'wing roof plant',   kind:'structure',  act1:'the plant deck on top of the hotel wing, tanks and fan housings, everything still'},
    15:{name:'floor skylight',    kind:'structure',  act1:'a skylight punched through the roof over the pit, glazing starred and one panel gone through'}
  };
  var NOTES={
    summary:'A dead DOWNTOWN casino block — one enormous low casino floor filling the plot to the building line with no setback at all, a slender hotel wing standing on the back of it, a marquee running the whole building line for a facade, a self-park deck and a service alley behind, and a short valet lane off the side street. Nothing fences it: the building is the edge.',
    reference:['Fremont Street / Glitter Gulch (the Golden Nugget, Binion\'s, the Four Queens, the Fremont Street Experience canopy). A downtown casino is the OPPOSITE of a Strip resort: no setback, no arrival drive, no podium-and-tower. The casino floor meets the sidewalk on a block platted before anybody parked a car; the mass is low and wide with a slender hotel wing at the rear; the FRONTAGE IS SIGN, floor to roof, because downtown sold itself with light rather than architecture; the car is banished to a self-park deck on the alley and a short valet lane off the side street.'],
    layout:['The CASINO FLOOR fills the block to the building line on the primary frontage. There is no setback, no apron and no lawn — which is also why it needs no fence.',
      'The HOTEL WING is slender and stands on the BACK of the floor, never across the front.',
      'The frontage is SIGN and nothing but: the MARQUEE runs the full building line floor to roof, two end PYLONS stand out at the kerb, and a row of sign standards runs down the walk. No canopy over the pavement (Paolo 8/2) -- the sign stands up instead of reaching out.',
      'A SERVICE ALLEY crosses the back of the block and runs out to the street down one side; the SELF-PARK DECK sits on it. A short VALET LANE comes in off the side street.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the doors and the marquee are on the primary street. The DRIVE surface (code 1) is one connected car surface — alley plus valet lane — entering off the street at the curb cuts and reaching the self-park deck (K.driveReachFromStreet). Pedestrians walk the sidewalk straight into the doors; the entry apron (7) is open ground you walk straight across.',
    layering:'GROUND plane (flat): the sidewalk (0), the alley and valet lane (1) + markings (11) + the curb cuts (5). STRUCTURES (¾ front face, solid): the CASINO FLOOR (2, ENTERABLE -> the floor), the HOTEL WING (6, ENTERABLE -> a corridor of rooms), the SELF-PARK DECK (8, ENTERABLE), the MARQUEE towers (12), the roof/plant decks (4, 14) and the SKYLIGHTS (15). PORTALS: the casino doors (13). PROPS: sign standards (9), abandoned vehicles (10), debris and dead planting (3). The floor is a single low plate and the wing is the only vertical mass; you walk straight in off the pavement under the sign.',
    decisions:['NOT THE STRIP RESORT. engine/bohemia_resort.js is podium + tower + porte cochere on a 100 m arrival drive; this is a no-setback low floor with a sign for a face. Two gaming types, two real buildings, two icons.',
      'NOTHING ENCLOSES THE PLOT (Paolo 8/16, LOCKED): no fence, no perimeter wall, no bollard line, no kerb ring. The building meeting the sidewalk is the edge, which is what the real block does.',
      'Act-1 DEAD: floor dark and stripped, doors standing open, every tube broken off, marquee faces blank, cars abandoned in the valet lane, the alley full of what got dragged out.',
      'Gaming/resort category. Zero purple. NO FACTION, NO OWNER, NO NAME anywhere — the marquee faces are deliberately BLANK. Who holds downtown is Paolo\'s to rule (MECHANISM-MINE / CONTENTS-PAOLO\'S).',
      'The floor, the wing and the park deck are all ENTERABLE, so the interior/zoom phase has three real volumes to open rather than a facade.',
      'ACT TRIPTYCH: only the act-1 dead material is specified. Act-2 and act-3 are [PENDING Paolo].']
  };
  K.register('casino', { generate:generate, body:function(c){return c===2||c===4||c===6||c===8||c===12||c===14||c===15;}, category:'commercial', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaCasino=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
