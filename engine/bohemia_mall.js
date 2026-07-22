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
    G.rect(0,0,W-1,H-1,0); G.rect(4,4,W-5,H-5,4);
    // ---- THE DUMBBELL: concourse spine + two big anchor stores at the ends — sized so the
    // enclosed building genuinely dominates the plot, matching real dead-mall aerials, not a
    // small store lost in a sea of asphalt ----
    G.rect(20,42,108,80,2);                                               // the concourse spine (wider + deeper)
    G.rect(2,32,22,90,6);                                                 // west anchor
    G.rect(106,32,126,90,6);                                              // east anchor
    // ---- food court bump-out, north side of the spine ----
    G.rect(52,30,76,42,7);
    // ---- entrance doors along the SOUTH face of the concourse ----
    for(x=28;x<=100;x+=16) set(x,80,12);
    set(12,86,12); set(116,86,12);                                        // anchor entrances too
    // ---- loading docks on the NORTH (back/service) face ----
    for(x=26;x<=102;x+=20) set(x,42,8);
    // ---- parking fields north and south of the building, curb cuts to the street ----
    G.rect(6,10,122,28,4);                                                // north lot (past the food court/docks)
    G.rect(6,92,122,118,4);                                               // south lot (the main entrance side)
    for(x=36;x<=94;x+=10){ set(x,96,11); set(x,114,11); }                 // stall striping, south lot
    for(x=36;x<=94;x+=10){ set(x,14,11); set(x,24,11); }                  // stall striping, north lot
    for(i=0;i<12;i++){ var cx=36+Math.floor(r()*60), cy=(r()<0.5)?(96+Math.floor(r()*4)):(14+Math.floor(r()*4));
      if(r()<0.5) set(cx,cy,10); }                                        // scattered dead cars
    // ---- weeds + lights through the lot ----
    for(i=0;i<40;i++){ var wx=6+Math.floor(r()*116), wy=6+Math.floor(r()*116); if(get(wx,wy)===4&&r()<0.3)set(wx,wy,3); }
    [[10,18],[118,18],[10,106],[118,106]].forEach(function(p){ set(p[0],p[1],9); });
    set(9,92,13);                                                         // a dumpster at the service corner
    // ---- ENTRANCE off the SOUTH street (rotated to the real street by the kit): a driveway
    // ring linking both parking fields to the gate — side lanes AND the horizontal connectors
    // that actually tie them to the gate (a ring only works if every leg touches the next) ----
    var gx=64;
    G.rect(gx-4,118,gx+4,H-1,1);
    for(i=-4;i<=4;i++)set(gx+i,H-1,5);
    G.rect(6,10,6,118,1); G.rect(122,10,122,118,1);                       // full-height side drive lanes
    G.rect(6,116,gx-4,120,1); G.rect(gx+4,116,122,120,1);                 // south connectors: side lanes -> the gate lane
    G.rect(6,26,122,30,1);                                                // north connector: ties both side lanes across the top lot
    return g;
  }
  function generate(seed,opts){ opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:14});
    var g=res.g; return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2||v===6||v===7;})}; }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }
  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#5c5648',3:'#3a4520',4:'#524c3e',5:'#c79a3f',6:'#726a5c',
    7:'#6a6258',8:'#8a7a4a',9:'#8f8676',10:'#55555f',11:'#c9c1aa',12:'#8a7a4a',13:'#463f36'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt at the lot edge'},
    1:{name:'street / drive',     kind:'drive',      act1:'the cracked mall ring-road / driveway (car-drivable)'},
    2:{name:'concourse',          kind:'building',   act1:'the enclosed mall concourse, tilt-up + glazing, most glass gone', solid:true, enter:'concourse interior: a long dead promenade, storefronts dark on both sides'},
    3:{name:'weed / brush',       kind:'tree-dead',  act1:'weeds through the cracked lot', solid:false},
    4:{name:'parking asphalt',    kind:'ground',     act1:'the mall parking field, faded striping, sun-bleached'},
    5:{name:'gate',               kind:'gate',       act1:'the main driveway curb cut off the street, amber curb'},
    6:{name:'anchor store',       kind:'building',   act1:'a big-box anchor department store, sign faded, doors boarded', solid:true, enter:'anchor store interior: a cavernous dead sales floor'},
    7:{name:'food court',         kind:'building',   act1:'the food court bump-out, skylight glazing shattered', solid:true, enter:'food court interior: dead counter stalls around a seating pit'},
    8:{name:'loading dock',       kind:'portal',     act1:'a service loading dock on the back face, roll-up torn', enter:'the back-of-house service corridor'},
    9:{name:'pole light',         kind:'prop',       act1:'a tall parking-lot light standard, head dark'},
    10:{name:'abandoned car',     kind:'vehicle',    act1:'a car dead in the lot, tyres flat', solid:true},
    11:{name:'stall marking',     kind:'marking',    act1:'faded parking-stall paint'},
    12:{name:'entrance door',     kind:'portal',     act1:'a mall entrance vestibule, glass smashed or boarded', enter:'into the concourse'},
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
  K.register('mall', { generate:generate, body:function(c){return c===2||c===6||c===7;}, category:'commercial', palette:PALETTE, legend:LEGEND, notes:NOTES });
  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API; root.BohemiaMall=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
