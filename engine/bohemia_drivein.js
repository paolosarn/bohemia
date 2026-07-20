// BOHEMIA DRIVE-IN THEATER (7/19/26). LEISURE, on the DISTRICT KIT. Research-first (drive-in
// design guides: conceptdraw drive-in site plan, drive-insdownunder): a tall SCREEN TOWER
// visible from every spot; a fan of ARCED PARKING ROWS (ramped berms) facing the screen with
// SPEAKER POLES; a central SNACK BAR + PROJECTION booth; a drive-up TICKET BOOTH + MARQUEE at
// the entrance; a small playground + picnic by the concession. Act-1 DEAD: torn faded screen,
// abandoned cars rusting in the rows, dead poles, cracked asphalt, dead marquee. Street-aware +
// drivable (you drive in). Full dossier + layering below.
// LEGEND:
//  0 desert dead-ground  1 parking/drive asphalt  2 building(snack bar/projection/booth)
//  3 dead brush          4 parking-row arc marking 5 gate / ticket booth
//  6 screen tower        7 speaker pole            8 abandoned car
//  9 marquee sign       10 picnic furniture       11 playground
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    // entrance at the SOUTH (ticket booth on the street); the SCREEN faces the cars from the NORTH.
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function set(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H)g[y][x]=c; }
    function scatter(x0,y0,x1,y1,code,dens){ for(var k=0;k<(x1-x0)*(y1-y0)*dens;k++){ var tx=x0+Math.floor(r()*(x1-x0)),ty=y0+Math.floor(r()*(y1-y0)); if(g[ty]&&g[ty][tx]===0)set(tx,ty,code); } }

    // ---- the PARKING FIELD (cracked asphalt) — the big drivable area facing the screen ----
    G.rect(6,15,W-7,H-10,1);

    // ---- SCREEN TOWER at the back (north): a tall wide screen on support legs ----
    G.rect(18,4,W-19,13,6);
    set((W>>1)-20,14,2); set((W>>1)+20,14,2); set((W>>1),14,2);                 // support legs / base

    // ---- ARCED PARKING ROWS facing the screen (centered on the screen), poles + cars along them ----
    var scx=W>>1, scy=8;                                                        // the screen's focal point
    for(var R=26; R<=96; R+=9){
      for(x=7;x<W-7;x++){ var dx=x-scx, under=R*R-dx*dx; if(under<0)continue; var yy=scy+Math.round(Math.sqrt(under));
        if(yy>16 && yy<H-11 && g[yy][x]===1){ set(x,yy,4);
          if(x%12===0) set(x,yy-1,7);                                          // a speaker pole on the row
          if(x%7===0 && r()<0.5){ set(x,yy-2,8); set(x+1,yy-2,8); }            // an abandoned car nosed to the screen
        }
      }
    }

    // ---- SNACK BAR + PROJECTION booth, central, facing the screen (enterable) ----
    var bx=scx-12, by=Math.round(H*0.52);
    G.rect(bx,by,bx+24,by+12,2);
    G.rect(bx-8,by+2,bx-2,by+9,11);                                            // small playground beside it
    for(i=0;i<4;i++){ set(bx+26+i*2,by+3,10); set(bx+26+i*2,by+6,10); }        // picnic tables

    // ---- TICKET BOOTH + MARQUEE at the entrance (south) ----
    var gx=W>>1;
    G.rect(gx-8,H-9,gx-4,H-5,2); G.rect(gx+4,H-9,gx+8,H-5,2);                  // ticket booths flanking the lane
    G.rect(gx-13,H-8,gx-10,H-4,9);                                            // roadside MARQUEE sign BESIDE the lane (never on it — a car drives past it)

    // ---- desert margins + dead brush ----
    scatter(1,1,6,H-2,3,0.06); scatter(W-7,1,W-2,H-2,3,0.06); scatter(7,H-9,W-8,H-2,3,0.02);

    // ---- ENTRANCE GATE on the SOUTH street (rotated to the real street by the kit) ----
    for(i=-3;i<=3;i++)set(gx+i,H-1,5);
    for(y=H-1;y>=H-10;y--)for(x=-2;x<=2;x++){ var c=g[y][gx+x]; if(c===0||c===3)set(gx+x,y,1); } // drive from the street into the field
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:12});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})};
  }
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  var PALETTE={1:'#33333c',2:'#7a7266',3:'#4a4030',4:'#c9c1aa',5:'#c79a3f',6:'#8a8890',7:'#6b6355',
    8:'#55555f',9:'#b0863a',10:'#8f8676',11:'#8a6a5a'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt at the parcel edge (setback/berms)'},
    1:{name:'parking / drive asphalt',kind:'drive',  act1:'cracked asphalt parking field + drive lanes (car-drivable)'},
    2:{name:'building (snack bar/projection/booth)',kind:'building',act1:'concrete-block snack bar + projection booth / ticket booths, faded', enter:'concession interior: counter + kitchen up front, the projection room behind'},
    3:{name:'dead brush',         kind:'tree-dead', act1:'dry tumbleweed + dead brush at the desert margins', solid:false},
    4:{name:'parking-row arc marking',kind:'marking', act1:'faded painted arc + wheel-stop line of a ramped parking row'},
    5:{name:'gate / ticket booth',kind:'gate',       act1:'drive-up entrance lane past the ticket booths, amber curb'},
    6:{name:'screen tower',       kind:'structure',  act1:'the giant movie screen on its tower — torn, sun-faded, streaked (the ¾ face is the screen)'},
    7:{name:'speaker pole',       kind:'prop',       act1:'a leaning speaker pole, wire dangling, box rusted'},
    8:{name:'abandoned car',      kind:'vehicle',    act1:'a car rusting in its row, nosed to the screen, dust-caked'},
    9:{name:'marquee sign',       kind:'structure',  act1:'the entrance marquee, dead neon, half the letters gone'},
    10:{name:'picnic furniture',  kind:'prop',       act1:'weathered picnic table / bench by the concession'},
    11:{name:'playground',        kind:'play',       act1:'sun-bleached little playground beside the snack bar'}
  };
  var NOTES={
    summary:'A dead drive-in movie theater — a torn screen tower over a fan of arced parking rows, a central snack bar + projection booth, a ticket booth + marquee at the entrance.',
    reference:['Drive-in theater design guides (conceptdraw drive-in site plan, drive-insdownunder "how to build a drive-in", Film-Tech): a screen tower built high enough to be seen from every spot; the land sculpted into ARCED ramped parking rows facing the screen; a central projection booth + concession/snack bar; a drive-up ticket booth; speaker poles + wires along the rows; often a small playground + picnic tables by the snack bar'],
    layout:['A tall SCREEN TOWER spans the back (facing the cars); the whole cell is the cracked asphalt PARKING FIELD.',
      'ARCED parking rows curve across the field centered on the screen, each with a wheel-stop line, speaker poles, and abandoned cars nosed to the screen.',
      'A central SNACK BAR + PROJECTION booth faces the screen; a small playground + picnic tables sit beside it.',
      'A drive-up TICKET BOOTH (two booths flanking the entrance lane) + a dead MARQUEE mark the street entrance.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet: the ticket-booth entrance is on the primary street; the whole parking field (code 1) is the drivable surface (you drive in and park), reachable from the entrance in any placement (K.driveReachFromStreet). Corner side streets get a pedestrian gate.',
    layering:'GROUND plane: the parking/drive asphalt + arc markings (flat, drive on them). STRUCTURES (¾ front face, solid): the SCREEN TOWER (6 — its face IS the giant screen), the snack bar/projection/booths (2, ENTERABLE -> concession + projection rooms), the marquee (9). PROPS (solid, weave between): speaker poles (7), abandoned cars (8, rusting in the rows), picnic furniture (10). GROUND leisure: the playground (11). The screen is the one big vertical mass; everything else is a low field you drive across.',
    decisions:['Act-1 DEAD: torn/faded screen, rusting abandoned cars in the rows, dead speaker poles, cracked asphalt, dead marquee neon. No living vegetation.',
      'Leisure category (drivein). Zero purple. The screen/marquee show no readable film titles (Paolo\'s to author if ever).',
      'Research-first (per the reminder): built from real drive-in site plans, not memory.']
  };
  K.register('drivein', { generate:generate, body:function(c){return c===2;}, category:'leisure', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaDrivein=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
