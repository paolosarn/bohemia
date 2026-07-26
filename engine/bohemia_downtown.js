// BOHEMIA DOWNTOWN (7/21/26). COMMERCIAL, on the DISTRICT KIT. Research-first (downtown / podium-tower
// urbanism — ArchDaily podium-tower, LA Downtown Design Guide street wall, Phoenix City Square): a
// dense urban block — a high-coverage low-rise PODIUM base (retail + parking) filling the block to a
// tight STREET WALL along the sidewalks, slender TOWERS rising from the podiums, a central PLAZA, the
// street grid threading through. This is the core: the densest, most building-dominant district. Act-1
// DEAD: dark towers, boarded retail, the plaza weed-split, glass gone. Street-aware + drivable (the
// street grid). Full dossier + layering. Hero: the towers rising over the podium street wall.
// LEGEND:
//  0 desert  1 street (DRIVABLE)  2 podium / mid-rise  3 street tree  4 setback planter  5 gate
//  6 tower  7 plaza  8 sidewalk  9 pole light  10 tower rooftop mech  11 crosswalk / marking  12 skybridge
//  13 parking podium deck
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;
  function buildCanonical(seed){
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function get(x,y){ return (x>=0&&y>=0&&x<W&&y<H)?g[y][x]:0; }
    // a PODIUM block with a TOWER rising from it + rooftop mech + window/floor detail
    function podium(x0,y0,x1,y1){ G.rect(x0,y0,x1,y1,2);
      for(x=x0+2;x<x1;x+=4){ set(x,y0,11); set(x,y1,11); } for(y=y0+2;y<y1;y+=4){ set(x0,y,11); set(x1,y,11); } // window/floor lines
      var tw=Math.min(14,(x1-x0)>>1), th=Math.min(14,(y1-y0)>>1), tx=Math.round((x0+x1)/2-tw/2), ty=Math.round((y0+y1)/2-th/2);
      G.rect(tx,ty,tx+tw,ty+th,6);                                       // the TOWER core rising from the podium
      set(tx+2,ty+2,10); set(tx+tw-2,ty+2,10); set(Math.round(tx+tw/2),Math.round(ty+th/2),10); // rooftop mech
    }
    // ---- BASE: the block is SIDEWALK street-wall frontage; a street grid threads it ----
    G.rect(0,0,W-1,H-1,0); G.rect(4,6,W-5,H-5,8);
    G.rect(60,6,67,H-5,1); G.rect(4,60,W-5,67,1);                        // the internal street cross (the grid)
    for(y=8;y<H-8;y+=6){ set(63,y,11); } for(x=8;x<W-8;x+=6){ set(x,63,11); } // lane dashes
    // ---- FOUR PODIUM blocks with TOWERS filling the quadrants (the street wall + the core) ----
    podium(8,10,56,56); podium(72,10,120,56); podium(8,72,56,118); podium(72,72,120,118);
    // ---- central PLAZA at the crossing as a ROUNDABOUT (a street ring circles it so the 4 street
    // arms stay connected — the grid can't be severed) with trees + a sculpture ----
    G.disc(63,63,9,7); for(i=0;i<8;i++){ var a=i/8*Math.PI*2; set(Math.round(63+Math.cos(a)*6),Math.round(63+Math.sin(a)*6),3); }
    set(63,63,10); set(62,62,10); set(64,64,10);                        // plaza sculpture / fountain
    for(var a2=0;a2<360;a2+=1){ var rr=a2*Math.PI/180;                  // the roundabout street ring linking all 4 arms
      set(Math.round(63+Math.cos(rr)*11),Math.round(63+Math.sin(rr)*11),1);
      set(Math.round(63+Math.cos(rr)*12),Math.round(63+Math.sin(rr)*12),1); }
    // ---- setback PLANTERS + street trees along the street wall; pole lights; a SKYBRIDGE ----
    for(x=10;x<=118;x+=12){ if(get(x,58)===8)set(x,58,12); if(get(x,68)===8)set(x,68,12); }
    for(y=10;y<=118;y+=12){ if(get(58,y)===8)set(58,y,3); if(get(68,y)===8)set(68,y,3); }
    G.rect(56,30,72,32,12);                                            // a skybridge spanning the street between towers
    [[6,8],[120,8],[6,120],[120,120],[63,40]].forEach(function(p){ set(p[0],p[1],9); });
    // ---- ENTRANCE off the SOUTH street (rotated to the real street by the kit) ----
    var gx=63;
    for(i=-3;i<=3;i++)set(gx+i,H-1,5);
    for(y=H-1;y>=H-8;y--)for(x=-3;x<=3;x++){ var c=g[y][gx+x]; if(c===0||c===8||c===11)set(gx+x,y,1); }
    return g;
  }
  function generate(seed,opts){ opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===8; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:8, pedOver:soft, pedInset:12});
    var g=res.g; return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2||v===6;})}; }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }
  var PALETTE={0:'#1c1a15',1:'#33333c',2:'#6a6a72',3:'#3a4526',4:'#43521f',5:'#c79a3f',6:'#4e4e58',
    7:'#8f8676',8:'#6a675e',9:'#8f8676',10:'#8a8478',11:'#c9c1aa',12:'#43521f',13:'#4a4a52'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare dirt at a broken block edge (rare downtown)'},
    1:{name:'street',             kind:'drive',      act1:'the cracked downtown street threading the block (car-drivable), double-yellow gone'},
    2:{name:'podium / mid-rise',  kind:'building',   act1:'a low-rise podium block — dead ground-floor retail + parking, boarded', enter:'podium interior: the retail concourse + lobby at grade, parking + back-of-house behind, cores up to the tower'},
    3:{name:'street tree',        kind:'tree-dead',  act1:'a dead street tree in its grate', solid:false},
    4:{name:'setback planter',    kind:'prop',       act1:'a dead streetwall planter', solid:false},
    5:{name:'gate',               kind:'gate',       act1:'the street entrance to the block, amber curb'},
    6:{name:'tower',              kind:'structure',  act1:'a slender tower rising from the podium — dark glass shattered, floors dead', solid:true},
    7:{name:'plaza',              kind:'ground',     act1:'the central plaza at the crossing, cracked pavers, weeds'},
    8:{name:'sidewalk',           kind:'ground',     act1:'the wide downtown sidewalk / street-wall frontage, cracked'},
    9:{name:'pole light',         kind:'prop',       act1:'a street pole light, head dark'},
    10:{name:'tower rooftop mech',kind:'structure',  act1:'rooftop mechanical / a water tank atop a tower', solid:true},
    11:{name:'crosswalk / marking',kind:'ground',    act1:'faded crosswalk / lane paint'},
    12:{name:'skybridge',         kind:'overhead',   act1:'a skybridge spanning the street between towers (you pass UNDER it)'},
    13:{name:'parking podium deck',kind:'structure', act1:'exposed structured-parking deck in a podium base', solid:true}
  };
  var NOTES={
    summary:'A dead downtown block — four podium blocks with slender towers rising from them, filling the block to the street wall, a street grid threading through, a central plaza with a sculpture, a skybridge between towers. The densest district — the core.',
    reference:['Downtown / podium-tower urbanism (ArchDaily podium-tower, LA Downtown Design Guide street wall, Phoenix City Square): a high-coverage low-rise PODIUM base (retail + parking + loading) fills the block to a tight STREET WALL along the sidewalks; slender TOWERS rise from the podiums; plazas + a street grid; the model maximizes density while holding a human-scaled street wall.'],
    layout:['Four PODIUM blocks (dead retail + parking base, window/floor detail) fill the quadrants to the STREET WALL along the wide sidewalks, each with a slender TOWER rising from its centre (rooftop mech atop).',
      'An internal STREET grid (a cross with lane dashes) threads the block.',
      'A central PLAZA at the crossing carries dead street trees + a sculpture/fountain; setback planters + street trees line the street wall; a SKYBRIDGE spans between towers.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the block entrance is on the primary street; the internal STREET grid (code 1) is drivable, reached from the curb (K.driveReachFromStreet). Foot circulation is the wide sidewalks + the plaza. WALKABLE-LAND: the podiums + towers dominate overwhelmingly — the densest district, almost all building. Corner side streets get a pedestrian gate onto the sidewalk.',
    layering:'GROUND plane (walk/drive, flat): the street (1, drive) + crosswalks (11), the sidewalks (8), the plaza (7), desert (0). STRUCTURES (¾ front face, solid, ENTERABLE): the PODIUM blocks (2 -> retail concourse + lobby + parking + cores) with the TOWERS (6) rising from them + rooftop mech (10) + parking decks (13). OVERHEAD (pass under): the SKYBRIDGE (12). PROPS: street trees (3), planters (4), pole lights (9). PORTALS: the gate (5). The towers over the podium street wall are the vertical hero; the street grid + plaza are the low plane you move through.',
    decisions:['Act-1 DEAD: towers dark + glass shattered, ground-floor retail boarded, the plaza weed-split, the skybridge dead. Who holds the core (the high ground of the dead city) is faction canon (Paolo\'s).',
      'Commercial category (downtown). Zero purple. No corporate names/signage (Paolo\'s to author).',
      'WALKABLE-LAND honored overwhelmingly: the densest district — podiums + towers dominate, streets are the connective grid.',
      'Research-first (per the playbook): built from real podium-tower downtown design, not memory.']
  };
  K.register('downtown', { generate:generate, body:function(c){return c===2||c===6;}, category:'commercial', palette:PALETTE, legend:LEGEND, notes:NOTES });
  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API; root.BohemiaDowntown=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
