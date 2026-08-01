// BOHEMIA MALL (7/22/26). COMMERCIAL, on the DISTRICT KIT. Research-first (real dead-mall
// anatomy — Rolling Acres/Randall Park/Euclid Square post-mortems, and Vegas's own Boulevard
// Mall/Meadows Mall layout): a DUMBBELL-shaped enclosed building — a long concourse spine with
// TWO big-box ANCHOR STORES at either end, a food-court bump-out on one side, multiple entrance
// doors along the front, loading docks on the back (service) side. A large but NOT dominant
// parking field fronts the street on both long sides — the building itself is the mass, per
// WALKABLE-LAND, matching how real enclosed malls actually read from the air (a huge single
// building, not a a small store lost in a sea of asphalt). Act-1 DEAD: entrance doors boarded
// or smashed, the food-court glass gone, weeds through the lot, a few abandoned cars. No
// perimeter fence — real mall lots are open to the street grid, not walled.
// LEGEND:
//  0 desert  1 street/drive (DRIVABLE)  2 concourse  3 weed/brush  4 parking asphalt
//  5 gate/curb-cut  6 anchor store  7 food court  8 loading dock  9 pole light
//  10 abandoned car  11 stall marking  12 entrance door  13 dumpster
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;
  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    // ---- BASE: parking asphalt lot; desert at the margins (no perimeter fence on a mall lot) ----
    /* THE BASE FILL IS NOT PARKING (fixed 7/31, Paolo: "not a single pixel on screen
       answered for"). This plot was painted "parking asphalt" edge to edge and then built
       on, so every leftover tile in the district was called parking — 39.5% of the plot
       under one flat sentence, which is what he scored a 40. A dead mall's lot does not
       stay asphalt either: the edges go back to the desert first, because nothing is
       resurfacing them. So the ground is RECLAIMED, and asphalt is painted only where the
       parking actually is. */
    G.rect(0,0,W-1,H-1,0); G.rect(4,4,W-5,H-5,3);
    // ---- THE DUMBBELL: concourse spine + two big anchor stores at the ends — sized so the
    // enclosed building genuinely dominates the plot, matching real dead-mall aerials, not a
    // small store lost in a sea of asphalt ----
    G.rect(20,42,108,80,2);                                               // the concourse spine (wider + deeper)
    G.rect(10,32,30,90,6);                                                // west anchor, pulled in for the ring
    G.rect(98,32,118,90,17);                                              // east anchor, pulled in for the ring
    // ---- food court bump-out, north side of the spine ----
    G.rect(52,30,76,42,7);
    // ---- entrance doors along the SOUTH face of the concourse ----
    for(x=28;x<=100;x+=16) set(x,80,12);
    set(12,86,12); set(116,86,12);                                        // anchor entrances too
    // ---- loading docks on the NORTH (back/service) face ----
    for(x=26;x<=102;x+=20) G.rect(x,42,x+4,44,8);
    /* THE ROOF IS THE DISTRICT. From the air an enclosed mall is not a wall, it is an
       enormous ROOF: a run of SKYLIGHTS down the concourse spine and a farm of rooftop
       plant either side of them. That is the single most recognisable thing about a dead
       mall aerial, and without it the biggest building in the valley was a flat grey slab. */
    for(x=26;x<=102;x+=8) G.rect(x,58,x+4,63,14);                         // the skylight run
    for(x=24;x<=100;x+=13){ G.rect(x,48,x+7,53,15); G.rect(x+2,68,x+9,73,15); }
    G.rect(6,38,18,44,15); G.rect(110,38,122,44,15);                       // plant on the anchors too
    G.rect(6,78,18,84,15); G.rect(110,78,122,84,15);
    // ---- parking fields north and south of the building, curb cuts to the street ----
    G.rect(6,10,122,28,4);                                                // north lot (past the food court/docks)
    G.rect(6,92,122,118,4);                                               // south lot (the main entrance side)
    /* THE LOT (rebuilt 7/31). It was five stall dots per row, which reads as nothing from
       above. Real stalls are SHORT TICKS PERPENDICULAR to an aisle, in double-loaded bays --
       stalls, aisle, stalls -- the same fix the school's lot needed after Paolo called it
       "dogshit" (7/29). A mall lot is the biggest paved thing in the valley; if it reads as
       blank asphalt the whole district reads as blank. */
    function bay(top,x0,x1){
      for(x=x0;x<=x1;x+=4){
        for(y=top;y<=top+5;y++) if(get(x,y)===4) set(x,y,11);
        for(y=top+14;y<=top+19;y++) if(get(x,y)===4) set(x,y,11);
      }
      for(x=x0-2;x<=x1+2;x++){ if(get(x,top)===4)set(x,top,11); if(get(x,top+19)===4)set(x,top+19,11); }
    }
    bay(94,12,116); bay(11,12,116);
    /* KERBED MEDIANS AND CART CORRALS. A real mall lot is not one slab -- it is fields
       divided by planted medians, with a corral every few bays so the carts do not walk.
       Both are things I can write a sentence about, which is the whole test now. */
    for(i=0;i<5;i++){ var mx=18+i*22;
      G.rect(mx,94,mx+3,113,18); G.rect(mx,11,mx+3,30,18);
      set(mx+1,100,3); set(mx+2,106,3); set(mx+1,17,3); set(mx+2,23,3);
    }
    for(i=0;i<6;i++){ var kx=28+i*16, ky=(i%2)?101:104;
      G.rect(kx,ky,kx+5,ky+2,19); G.rect(kx,ky-88,kx+5,ky-86,19);
    }
    [[14,100],[118,100],[14,20],[118,20],[64,100],[64,20]].forEach(function(p){ set(p[0],p[1],9); });
    for(i=0;i<34;i++){                                                    // nobody came back for these
      var cx=12+Math.floor(r()*26)*4, cy=(r()<0.5)?(95+Math.floor(r()*4)):(12+Math.floor(r()*4));
      if(get(cx+1,cy)===4||get(cx+1,cy)===11) G.rect(cx+1,cy,cx+2,cy+3,10);
    }
    // ---- weeds + lights through the lot ----
    for(i=0;i<40;i++){ var wx=6+Math.floor(r()*116), wy=6+Math.floor(r()*116); if(get(wx,wy)===4&&r()<0.3)set(wx,wy,3); }
    [[10,18],[118,18],[10,106],[118,106]].forEach(function(p){ set(p[0],p[1],9); });
    set(34,40,13);                                                        // a dumpster at the service corner (moved off the new ring road)
    // ---- ENTRANCE off the SOUTH street (rotated to the real street by the kit): a driveway
    // ring linking both parking fields to the gate — side lanes AND the horizontal connectors
    // that actually tie them to the gate (a ring only works if every leg touches the next) ----
    /* ROOFS AND DOORS from the shared machine: an eave round every mass, a ridge that
       stops short of both ends, and a door onto somewhere you can stand. */
    K.roofsAndDoors(g,{ building:function(c){return c===2||c===6||c===7||c===17;}, roof:16, door:12, min:80,
                        outside:function(c){ return c===4||c===1||c===11||c===3||c===0; } });

    var gx=64;
    G.rect(gx-4,118,gx+4,H-1,1);
    for(i=-4;i<=4;i++)set(gx+i,H-1,5);
    /* THE RING ROAD. PAOLO 7/31 circled the two vertical lines that used to be here and
       asked what they were supposed to be, and the honest answer is NOTHING: they were
       drive lanes ONE TILE WIDE. At 0.75m per tile that is a 30-inch road. No car fits, it
       connected the two lots to each other only on paper, and it read as a mystery stripe
       down each edge of the district -- which is exactly how he read it.

       A mall has a RING ROAD: a real two-way loop right around the building tying the
       north lot to the south lot so you can circle for a space without going back out to
       the street. It is 6 tiles (4.5m) here, which is a lane you can actually drive, and
       the anchors were pulled in off the plot edge to make room for it. */
    G.rect(4,26,9,94,1); G.rect(119,26,124,94,1);                         // the two legs
    G.rect(4,26,124,30,1);                                                // and it closes at both ends
    G.rect(4,90,124,94,1);
    return g;
  }
  function generate(seed,opts){ opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:14});
    var g=res.g; return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2||v===6||v===7||v===12||v===14||v===15||v===16||v===17;})}; }
  /* THE WHOLE DRIVE SURFACE IS ONE NETWORK (Paolo 7/31: "how dare you continue to make
     streets in a district that don't connect with each other, that's rule number one").
     Asking only about code 1 was the bug behind the bug -- the ring road answered while
     the parking fields it is supposed to serve were a different code and never checked. */
  function driveConnected(res){ return K.driveNetworkReach(res.g, res.legend || LEGEND) > 0.999; }
  /* HUE (7/31). Everything here was one grey-brown, which is what the 7/28 measurement
     found across the whole valley. A real mall's two anchors were rival department stores
     in their own brand colours and the food court was the warm room -- so the anchors carry
     a faded slate-blue and a faded oxblood, and the food court a warm ochre. Still inside
     the dead world's value band; just no longer one mud. */
  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#5c5648',3:'#4c4a33',4:'#524c3e',5:'#c79a3f',6:'#4a5766',
    7:'#8a6a3a',8:'#8a7a4a',9:'#8f8676',10:'#55555f',11:'#c9c1aa',12:'#241f1a',13:'#463f36',
    14:'#93a2a8',15:'#7d7668',16:'#9a9384',17:'#7a4038',18:'#565440',19:'#8d949a'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt at the lot edge'},
    1:{name:'street / drive',     kind:'drive',      act1:'the cracked mall ring-road / driveway (car-drivable)'},
    2:{name:'concourse',          kind:'building',   act1:'the enclosed mall concourse, tilt-up + glazing, most glass gone', solid:true, enter:'concourse interior: a long dead promenade, storefronts dark on both sides'},
    3:{name:'reclaimed ground',   kind:'ground',     act1:'the lot edge going back to the desert — asphalt broken into plates by forty summers, creosote and tumbleweed rooted in the joints, sand drifted over the kerb line. Nothing is resurfacing this', solid:false},
    4:{name:'parking asphalt',    kind:'drive',     act1:'the parking field proper — asphalt still holding where the cars packed it down, striping ghosted to grey, oil shadows where the engines dripped'},
    5:{name:'gate',               kind:'gate',       act1:'the main driveway curb cut off the street, amber curb'},
    6:{name:'anchor store',       kind:'building',   act1:'a big-box anchor department store, sign faded, doors boarded', solid:true, enter:'anchor store interior: a cavernous dead sales floor'},
    7:{name:'food court',         kind:'building',   act1:'the food court bump-out, skylight glazing shattered', solid:true, enter:'food court interior: dead counter stalls around a seating pit'},
    8:{name:'loading dock',       kind:'portal',     act1:'a service loading dock on the back face, roll-up torn', enter:'the back-of-house service corridor'},
    9:{name:'pole light',         kind:'prop',       act1:'a tall parking-lot light standard, head dark'},
    10:{name:'abandoned car',     kind:'vehicle',    act1:'a car dead in the lot, tyres flat', solid:true},
    11:{name:'stall marking',     kind:'marking',    act1:'faded parking-stall paint'},
    12:{name:'entrance door',     kind:'portal',     act1:'a mall entrance vestibule, glass smashed or boarded', enter:'into the concourse'},
    18:{name:'landscaped median',kind:'ground',   act1:'a kerbed planting median dividing the parking fields — the shrubs died first, then the kerb cracked, and the sand has half-buried it'},
    19:{name:'cart corral',      kind:'prop',     act1:'a steel cart corral, rails bent outward where something drove through it, two trolleys still nested inside'},
    14:{name:'skylight',          kind:'structure', act1:'the concourse skylight run — most panes gone, the rest crazed white with forty summers'},
    15:{name:'rooftop plant',     kind:'structure', act1:'the rooftop HVAC farm — cased units, one stripped to its coil, ducting collapsed'},
    16:{name:'roof edge',         kind:'structure', act1:'the parapet line where the roof meets the wall'},
    17:{name:'anchor store (east)',kind:'building', act1:'the rival department store at the other end of the dumbbell, its own faded brand colour still on the parapet', enter:'anchor interior: three floors of stripped sales floor around a dead escalator well'},
    13:{name:'dumpster',          kind:'prop',       act1:'a rusted dumpster at the service corner', solid:true}
  };
  var NOTES={
    summary:'A dead enclosed shopping mall — a dumbbell-shaped building (a long concourse spine with a big-box anchor store at each end + a food-court bump-out), multiple boarded entrances, loading docks on the service side, parking fields north and south. The building itself is the mass, not a small store in a sea of asphalt.',
    reference:['Real dead-mall anatomy (Rolling Acres Mall / Randall Park Mall / Euclid Square Mall post-mortems, and Vegas\'s own Boulevard Mall / Meadows Mall layout): a DUMBBELL shape — a long enclosed concourse with a big-box ANCHOR department store at each end, a food-court bump-out, multiple mall-entrance vestibules along the front, service loading docks on the back, and a large parking field — but the ENCLOSED BUILDING is genuinely huge (100k-1M+ sqft), reading as the dominant mass from the air, not a footnote to the parking.'],
    layout:['A long concourse spine runs east-west with a big anchor store box at each end and a food-court bump-out on the north side.',
      'Entrance vestibules line the south (main) face; loading docks sit on the north (service) face.',
      'Parking fields sit north and south of the building, tied together by a perimeter drive ring reaching the south entrance gate.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the main driveway gate is on the primary street; a perimeter drive ring (code 1) links both parking fields all the way around the building to the gate (K.driveReachFromStreet). WALKABLE-LAND: the concourse + two anchors + food court are a genuinely massive single building — real enclosed-mall precedent, not an exemption.',
    layering:'GROUND plane (walk/drive, flat): parking asphalt (4), the drive ring/gate lane (1, drive), desert (0), stall markings (11). STRUCTURES (¾ front face, solid): the concourse (2, ENTERABLE), the anchor stores (6, ENTERABLE), the food court (7, ENTERABLE). PORTALS: entrance doors (12, into the concourse), loading docks (8, into service). PROPS/VEHICLES (solid): dumpster (13), abandoned cars (10). PROPS: pole lights (9), weeds (3). The dumbbell building is the mass; the drive ring is the connective ladder around it, never the main event.',
    decisions:['Act-1 DEAD: entrances boarded/smashed, food-court glazing shattered, weeds through the lot, scattered dead cars. Who squats/scavenges the anchors is faction/LIFE canon (Paolo\'s).',
      'COMMERCIAL category, distinct from downtown/strip-mall commercial — one ENCLOSED building, not an outdoor street grid or open storefronts.',
      'No perimeter fence (real mall lots are open to the street grid, unlike a residential complex) — a deliberate contrast with the fenced districts this session.',
      'WALKABLE-LAND satisfied by real-world precedent: the enclosed building mass genuinely dominates a real mall site plan, no vehicular exemption needed.',
      'Research-first (per the playbook): built from real dead-mall site-plan anatomy, not memory.']
  };
  K.register('mall', { generate:generate, body:function(c){return c===2||c===6||c===7||c===12||c===14||c===15||c===16||c===17;}, category:'commercial', palette:PALETTE, legend:LEGEND, notes:NOTES });
  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API; root.BohemiaMall=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
