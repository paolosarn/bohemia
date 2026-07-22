// BOHEMIA WATERPARK (7/22/26). LEISURE, on the DISTRICT KIT. Research-first (real water park
// site plans — Wet'n'Wild Las Vegas before its 2004 closure, typical American water-park
// layout): entrance plaza with lockers/snack bar, a big WAVE POOL as the centerpiece, a LAZY
// RIVER loop channel, a row of SLIDE TOWERS along the back edge each dropping into its own
// splash pool, sun decks with lounge chairs between the water features, a modest entrance
// parking lot. Act-1 DEAD: every pool drained + cracked, slide flumes rust-streaked, lounge
// chairs toppled, weeds through the deck. Street-aware + drivable; the pools/slides/buildings
// dominate the plot (WALKABLE-LAND) — real water parks are mostly water/deck, not parking.
// LEGEND:
//  0 desert  1 street/drive (DRIVABLE)  2 locker building  3 weed/brush  4 parking asphalt
//  5 gate  6 drained wave pool  7 lazy river channel (drained)  8 slide tower  9 splash pool
//  10 pole light  11 lounge chair  12 fence  13 snack bar  14 sun deck  15 ticket booth
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;
  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    // a hollow rectangular ring (the lazy river loop), thickness ~4 tiles
    function ring(x0,y0,x1,y1,th,c){
      G.rect(x0,y0,x1,y0+th,c); G.rect(x0,y1-th,x1,y1,c);
      G.rect(x0,y0,x0+th,y1,c); G.rect(x1-th,y0,x1,y1,c);
    }
    // a slide tower + its flume streak + a splash pool at the base
    function slide(tx,ty){
      G.rect(tx,ty,tx+4,ty+4,8);                                          // the tower
      for(i=0;i<14;i++) set(tx+2+Math.floor(Math.sin(i*0.5)*2),ty+5+i,8); // the flume streak, wiggling down
      G.disc(tx+2,ty+21,4,9);                                             // the splash pool at the base
    }
    // ---- BASE: sun deck (dead ground the deck sits on), fenced; desert at the margins ----
    G.rect(0,0,W-1,H-1,0); G.rect(6,8,W-7,H-7,14); G.frame(12);
    // ---- entrance: parking lot, ticket booths, lockers + snack bar ----
    G.rect(46,102,82,116,4);                                              // entrance parking (modest, per WALKABLE-LAND)
    G.rect(50,90,64,100,2);                                               // locker / changing building
    G.rect(68,90,80,98,13);                                               // snack bar
    set(64,101,15); set(66,101,15);                                       // ticket booths flanking the walk-in
    // ---- THE WAVE POOL: the centerpiece, big and irregular (beach-entry zigzag south edge) ----
    G.rect(30,40,98,70,6);
    for(x=30;x<=98;x+=6){ if(r()<0.5) G.rect(x,70,x+3,72,6); }            // beach-entry zigzag
    // ---- THE LAZY RIVER: a loop channel around the wave pool's east/south side ----
    ring(14,34,112,86,4,7);
    // punch the wave pool + buildings back through where the ring crosses them (the ring is
    // BEHIND the pool/buildings, not on top)
    G.rect(30,40,98,70,6); G.rect(50,90,64,100,2); G.rect(68,90,80,98,13);
    // ---- SLIDE TOWERS along the back (north) edge, dropping into their splash pools ----
    slide(20,10); slide(40,10); slide(60,10); slide(80,10);
    // ---- sun deck lounge chairs scattered around the water features ----
    for(i=0;i<50;i++){ var lx=10+Math.floor(r()*108), ly=10+Math.floor(r()*108);
      if(get(lx,ly)===14 && r()<0.4) set(lx,ly,11); }
    for(i=0;i<30;i++){ var wx=10+Math.floor(r()*108), wy=10+Math.floor(r()*108);
      if(get(wx,wy)===14 && r()<0.25) set(wx,wy,3); }
    [[12,12],[116,12],[12,116],[116,90]].forEach(function(p){ set(p[0],p[1],10); });
    // ---- ENTRANCE off the SOUTH street (rotated to the real street by the kit) ----
    var gx=64;
    G.rect(gx-3,116,gx+3,H-1,1);
    for(i=-3;i<=3;i++)set(gx+i,H-1,5);
    return g;
  }
  function generate(seed,opts){ opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===14; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:14});
    var g=res.g; return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2||v===13;})}; }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }
  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#726a5c',3:'#3a4520',4:'#524c3e',5:'#c79a3f',6:'#2e3a3c',
    7:'#27363c',8:'#6a6258',9:'#324248',10:'#8f8676',11:'#8a7a4a',12:'#6a6a72',13:'#5c5648',14:'#4a463c',15:'#726a5c'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt outside the fence (setback)'},
    1:{name:'street / drive',     kind:'drive',      act1:'the cracked entrance drive (car-drivable)'},
    2:{name:'locker building',    kind:'building',   act1:'the changing rooms / locker building, doors hanging', solid:true, enter:'locker interior: rows of rusted lockers, a dead shower block'},
    3:{name:'weed / brush',       kind:'tree-dead',  act1:'weeds pushing through the cracked deck', solid:false},
    4:{name:'parking asphalt',    kind:'ground',     act1:'the entrance parking lot, faded striping'},
    5:{name:'gate',               kind:'gate',       act1:'the park entrance turnstile, amber curb'},
    6:{name:'drained wave pool',  kind:'water-dead', act1:'the wave pool, drained, cracked plaster, a beach-entry zigzag edge', solid:false},
    7:{name:'lazy river channel', kind:'water-dead', act1:'the lazy river loop, drained, dry leaves in the bottom', solid:false},
    8:{name:'slide tower',        kind:'structure',  act1:'a water-slide tower + its flume, rust-streaked fiberglass', solid:true},
    9:{name:'splash pool',        kind:'water-dead', act1:'the drained splash pool at a slide\'s base, cracked', solid:false},
    10:{name:'pole light',        kind:'prop',       act1:'a park pole light, head dark'},
    11:{name:'lounge chair',      kind:'prop',       act1:'a toppled sun-deck lounge chair, faded plastic', solid:false},
    12:{name:'fence',             kind:'structure',  act1:'the park perimeter fence, chain-link sagging', solid:true},
    13:{name:'snack bar',         kind:'building',   act1:'the snack bar kiosk, shutter down, sign faded', solid:true, enter:'snack bar interior: a cramped service counter + a dead walk-in cooler'},
    14:{name:'sun deck',          kind:'ground',      act1:'the concrete sun deck between the pools, cracked, weeds through the joints'},
    15:{name:'ticket booth',      kind:'structure',  act1:'a ticket booth / turnstile post, glass broken', solid:true}
  };
  var NOTES={
    summary:'A dead water park — a big drained wave pool at the centerpiece, a lazy-river loop channel around it, four slide towers along the back edge each dropping into its own splash pool, a locker building + snack bar near the entrance, sun deck between the features, modest entrance parking.',
    reference:['Real American water-park site plans (the Wet\'n\'Wild Las Vegas layout before its 2004 closure is the direct regional precedent): a big WAVE POOL as the centerpiece; a LAZY RIVER loop channel; a row of SLIDE TOWERS along one edge each with its own splash-down pool; lockers/changing rooms + a snack bar near the entrance; sun deck paving between the water features; parking kept modest since the water/deck IS the venue.'],
    layout:['Entrance: modest parking lot, ticket booths, a locker/changing building, a snack bar.',
      'Centerpiece: a big irregular wave pool with a beach-entry zigzag edge; a lazy-river loop channel runs around its east/south side.',
      'Four slide towers line the back (north) edge, each with a wiggling flume streak down into its own splash pool.',
      'Cracked sun-deck paving fills the gaps between features, scattered with toppled lounge chairs and weeds.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the entrance turnstile is on the primary street; the entrance drive is the only real drivable surface (K.driveReachFromStreet). WALKABLE-LAND: the pools + slide towers + buildings + sun deck dominate the plot — real water parks are mostly water/deck, not parking, matching the real-world venue.',
    layering:'GROUND plane (walk/drive, flat): sun deck (14), parking asphalt (4), the entrance drive (1), desert (0), the drained pools/river/splash pools (6/7/9, not solid — you can walk into the empty basins). STRUCTURES (¾ front face, solid): the locker building (2, ENTERABLE), the snack bar (13, ENTERABLE), the slide towers (8), ticket booths (15), the fence (12). PROPS: lounge chairs (11), pole lights (10), weeds (3). PORTALS: the gate (5). The wave pool + lazy river + slide towers are the mass; the sun deck is the connective tissue between them, not pavement for cars.',
    decisions:['Act-1 DEAD: every pool drained + cracked, flumes rust-streaked, lounge chairs toppled, weeds through the deck joints. Who squats/holds the site is faction/LIFE canon (Paolo\'s).',
      'LEISURE category. Zero purple.',
      'WALKABLE-LAND honored via real-world precedent: a water park\'s pools/slides/deck genuinely dominate a real site plan, not an exemption — parking stays modest and the gate proves content dominates without needing vehicular:true.',
      'Research-first (per the playbook): built from the real regional water-park precedent (Wet\'n\'Wild Las Vegas layout), not memory.']
  };
  K.register('waterpark', { generate:generate, body:function(c){return c===2||c===13;}, category:'leisure', palette:PALETTE, legend:LEGEND, notes:NOTES });
  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API; root.BohemiaWaterpark=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
