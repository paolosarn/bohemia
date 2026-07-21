// BOHEMIA TRAILER PARK (7/21/26). RESIDENTIAL, on the DISTRICT KIT. Research-first (mobile-home park
// design guides — MHC Buyers layout, Lexington/Fontana plot plans): rows of MOBILE HOMES on lots along
// internal STREETS (28-30ft), each lot with a CARPORT / parking pad + a small SHED + utilities
// (propane), STAGGERED/offset for privacy, guest parking, cul-de-sacs. Cheap, dense, and very Bohemia
// — where the valley's poor washed up. Act-1 DEAD: trailers rusted + gutted, some burned out, weeds
// through the lots, abandoned cars. Street-aware + drivable (the internal streets); the trailers +
// carports + sheds dominate (WALKABLE-LAND). Full dossier + layering. Hero: the rows of trailers.
// LEGEND:
//  0 desert  1 street/drive (DRIVABLE)  2 mobile home  3 weed/brush  4 lot dirt  5 gate
//  6 carport  7 shed  8 burned trailer  9 pole light  10 abandoned car  11 pad marking  12 fence  13 propane tank
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;
  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    // one LOT: a mobile home (staggered), a carport pad + a car, a shed, a propane tank
    function lot(tx,ty,flip){ var jitter=Math.floor(r()*3);             // stagger/offset for privacy
      ty+=flip?-jitter:jitter;
      if(r()<0.16){ G.rect(tx,ty,tx+7,ty+15,8); for(i=0;i<10;i++)set(tx+Math.floor(r()*8),ty+Math.floor(r()*16),8); return; } // a BURNED-OUT trailer
      G.rect(tx,ty,tx+7,ty+15,2);                                       // the mobile home (long box)
      set(tx,ty+7,11); set(tx+7,ty+7,11);                              // hitch / tie-down detail
      G.rect(tx+8,ty+1,tx+11,ty+9,6);                                  // the CARPORT beside it
      if(r()<0.6) G.rect(tx+9,ty+2,tx+10,ty+7,10);                     // a car under the carport
      G.rect(tx+8,ty+11,tx+10,ty+14,7);                                // the SHED
      set(tx-1,ty+13,13);                                             // a propane tank
    }
    // ---- BASE: lot dirt/gravel, fenced; desert at the margins ----
    G.rect(0,0,W-1,H-1,0); G.rect(6,8,W-7,H-7,4); G.frame(12);
    // ---- internal STREETS (a ladder) with rows of TRAILERS facing them, staggered ----
    G.rect(8,40,118,45,1); G.rect(8,90,118,95,1);                       // two through-streets
    for(var lx=12; lx<=104; lx+=13){ lot(lx,20,true); lot(lx,48,false); lot(lx,70,true); lot(lx,98,false); } // 4 rows of lots
    // ---- pole lights + weeds through the lots + a guest-parking pad ----
    [[10,20],[116,20],[10,116],[64,42],[64,92]].forEach(function(p){ set(p[0],p[1],9); });
    for(i=0;i<40;i++){ var wx=8+Math.floor(r()*104), wy=10+Math.floor(r()*104); if(get(wx,wy)===4&&r()<0.5)set(wx,wy,3); }
    G.rect(96,20,116,38,1); for(x=98;x<=112;x+=4){ set(x,24,11); set(x,32,11); }  // a guest parking pod
    G.rect(96,38,101,45,1);                                            // connect the guest pod to the top street
    // ---- ENTRANCE off the SOUTH street (rotated to the real street by the kit) ----
    var gx=64;
    G.rect(gx-2,95,gx+2,H-1,1);
    for(y=H-1;y>=40;y--)for(x=-2;x<=2;x++){ var c=g[y][gx+x]; if(c===0||c===3||c===4||c===12)set(gx+x,y,1); } // spine linking both streets + the gate
    for(i=-2;i<=2;i++)set(gx+i,H-1,5);
    return g;
  }
  function generate(seed,opts){ opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3||c===4; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:12});
    var g=res.g; return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})}; }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }
  var PALETTE={0:'#1c1a15',1:'#4a4438',2:'#7a7266',3:'#3a4520',4:'#565040',5:'#c79a3f',6:'#6a6a72',
    7:'#6a5f50',8:'#332a26',9:'#8f8676',10:'#55555f',11:'#c9c1aa',12:'#6a6a72',13:'#a86a3a'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt outside the fence (setback)'},
    1:{name:'street / drive',     kind:'drive',      act1:'the cracked internal park street / driveway pad (car-drivable)'},
    2:{name:'mobile home',        kind:'building',   act1:'a mobile home / trailer, aluminium skin dented + sun-bleached, windows dark', enter:'trailer interior: a single-wide railroad plan — living + kitchenette up front, a bath + bedroom down the hall'},
    3:{name:'weed / brush',       kind:'tree-dead',  act1:'weeds + tumbleweed choking a dead lot', solid:false},
    4:{name:'lot dirt',           kind:'ground',     act1:'the packed-dirt / gravel lot the trailers sit on'},
    5:{name:'gate',               kind:'gate',       act1:'the park entrance off the street, amber curb'},
    6:{name:'carport',            kind:'overhead',   act1:'a metal carport awning beside a trailer (you park/walk UNDER it), sagging'},
    7:{name:'shed',               kind:'building',   act1:'a small tin storage shed on the lot, door hanging', solid:true},
    8:{name:'burned trailer',     kind:'building',   act1:'a burned-out trailer — charred shell, roof collapsed', solid:true},
    9:{name:'pole light',         kind:'prop',       act1:'a park pole light, head dark'},
    10:{name:'abandoned car',     kind:'vehicle',    act1:'a car dead on a lot / under a carport, tyres flat', solid:true},
    11:{name:'pad marking',       kind:'marking',    act1:'faded pad / tie-down / guest-stall paint'},
    12:{name:'fence',             kind:'structure',  act1:'the park perimeter fence, chain-link sagging', solid:true},
    13:{name:'propane tank',      kind:'prop',       act1:'a rusted propane tank at a trailer corner', solid:true}
  };
  var NOTES={
    summary:'A dead trailer park — staggered rows of rusted + gutted mobile homes (some burned out) on dirt lots along two internal streets, each lot with a carport + shed + propane, weeds through it, a guest-parking pod. Where the valley\'s poor washed up.',
    reference:['Mobile-home park design guides (MHC Buyers layout, Lexington/Fontana plot plans): rows of MOBILE HOMES on lots along 28-30ft internal STREETS; each lot has a CARPORT / parking pad + a SHED + utilities (propane); a STAGGERED / offset layout for privacy; guest parking; cul-de-sacs for a community feel.'],
    layout:['Two internal through-STREETS ladder the park; STAGGERED rows of MOBILE HOMES face them on dirt lots (desert at the margins, fenced).',
      'Each lot has the trailer (offset for privacy), a metal CARPORT with a car under it, a tin SHED, and a propane tank; some trailers are BURNED-OUT shells.',
      'A guest-parking pod sits by the entrance; pole lights + weeds choke the dead lots.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the park entrance is on the primary street; a spine links both internal streets to the gate (code 1 reaches every lot from the curb, K.driveReachFromStreet). WALKABLE-LAND: the trailers + carports + sheds dominate; the streets are the connective ladder. Corner side streets get a pedestrian gate.',
    layering:'GROUND plane (walk/drive, flat): the lot dirt (4), the streets/pads (1, drive), pad markings (11), desert (0). OVERHEAD (park/walk UNDER): the CARPORT awnings (6). STRUCTURES (¾ front face, solid): the MOBILE HOMES (2, ENTERABLE -> single-wide plan), the SHEDS (7), the BURNED trailers (8), the fence (12). VEHICLES/PROPS (solid): abandoned cars (10), propane tanks (13). PROPS: pole lights (9), weeds (3). PORTALS: the gate (5). The rows of trailers are the mass; you drive the ladder streets between them, park under the carports.',
    decisions:['Act-1 DEAD: trailers rusted + gutted, ~16% burned out, weeds through the lots, abandoned cars, propane long empty. Who squats here now is faction/LIFE canon (Paolo\'s).',
      'Residential category (trailer). Zero purple.',
      'WALKABLE-LAND honored: trailers + carports + sheds dominate; streets are the ladder.',
      'Research-first (per the playbook): built from real mobile-home park plot plans, not memory.']
  };
  K.register('trailer', { generate:generate, body:function(c){return c===2;}, category:'residential', palette:PALETTE, legend:LEGEND, notes:NOTES });
  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API; root.BohemiaTrailer=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
