// BOHEMIA INDUSTRIAL — DISTRIBUTION CENTER (7/18/26). REBUILT from real site-plan research
// (Paolo 7/18: research the real thing before building). A real DC, aerial-accurate:
//  - ONE big warehouse backing the far edge (DCs are one big box, not equal small sheds)
//  - a row of DOCK DOORS along the front, spaced ~14ft (kit 1 per ~5-10k sqft)
//  - a TRUCK COURT apron (~130ft deep) for backing trailers to the docks
//  - TRAILER STAGING: rows of striped trailer stalls, many parked trailers
//  - an OFFICE at the front corner + an EMPLOYEE CAR LOT beside it + a GUARD SHACK at the gate
//  - fenced, drive-in gates. Built on the DISTRICT KIT. Sources: renoindustrial.com,
//    steelcobuildings.com, alliedbuildings.com (truck court 130ft, docks 14ft o.c.,
//    1 trailer stall per dock, office+car park at the front).
// codes: 0 ground 1 asphalt 2 warehouse 3 fence 4 dock-door 5 gate 6 office 7 truck-court
//        8 stall-stripe 9 parked-trailer 10 container 11 guard-shack
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, i, r=G.rnd;
    var isS=function(e){return streets.indexOf(e)>=0;};
    var MARGIN=3, WHDEEP=M(24), COURT=M(20), TLEN=M(13), OFFW=M(14);
    G.frame(3);                                                       // perimeter chain-link fence

    // ONE big warehouse backing the far edge (N unless N is the street)
    var flip = isS('N');                                             // building at bottom if the street is north
    var wx0=MARGIN+2, wx1=W-1-MARGIN-2;
    var wy0 = flip ? H-1-MARGIN-2-WHDEEP : MARGIN+2, wy1 = wy0+WHDEEP;
    G.rect(wx0,wy0,wx1,wy1,2);
    var frontY = flip ? wy0 : wy1, fdir = flip ? -1 : 1;            // the dock face + which way the yard extends

    // OFFICE at the front-left corner (grade-level, sticks out into the yard) + dock doors
    var offY0 = flip ? frontY-M(7) : frontY+1;
    G.rect(wx0, Math.min(offY0,offY0+M(7)), wx0+OFFW, Math.max(offY0,offY0+M(7)), 6);
    for(var dx=wx0+OFFW+M(3); dx<wx1-1; dx+=M(4)) G.set(dx,frontY,4);   // dock doors, ~14ft on center

    // TRUCK COURT apron in front of the docks (deep, for backing trailers)
    var tc0 = frontY + fdir, tc1 = frontY + fdir*COURT;
    G.rect(wx0+OFFW+2, Math.min(tc0,tc1), wx1, Math.max(tc0,tc1), 7);
    // TRAILER STAGING: striped stalls at the far edge of the court + parked trailers
    var stallEnd = tc1, stallStart = tc1 - fdir*TLEN;
    for(var sx=wx0+OFFW+M(3); sx<wx1-2; sx+=M(4)){
      G.vbar(Math.min(stallStart,stallEnd),Math.max(stallStart,stallEnd),sx,8,1);
      if(r()<0.55) G.rect(sx+1,Math.min(stallStart,stallEnd)+1,sx+M(3),Math.max(stallStart,stallEnd)-1,9); // a parked trailer
    }

    // EMPLOYEE CAR LOT beside the office (small stalls), + GUARD SHACK
    var cly0 = Math.min(tc0,tc1), cly1 = Math.max(tc0,tc1);
    G.rect(wx0+2, cly0, wx0+OFFW-1, cly1, 1);                        // car-lot asphalt
    for(var cy=cly0+2; cy<cly1-M(5); cy+=M(5)+2){                    // rows of car stalls
      G.rect(wx0+2,cy,wx0+OFFW-1,cy+M(5),1);
      for(var cx=wx0+2; cx<wx0+OFFW-1; cx+=3) G.vbar(cy,cy+M(5),cx,8,1);
    }

    // TRAILER PARKING YARD: rows of stored trailers filling the rest of the lot (real DCs
    // stage stored trailers in the yard), drive lanes between rows.
    var courtFar=tc1, yardEnd = flip ? MARGIN+M(4) : H-1-MARGIN-M(4), yv=courtFar+fdir*M(6);
    while(fdir>0 ? (yv+TLEN < yardEnd) : (yv-TLEN > yardEnd)){
      var r0=Math.min(yv,yv+fdir*TLEN), r1=Math.max(yv,yv+fdir*TLEN);
      for(var tx=wx0+M(3); tx<wx1-M(3); tx+=M(4)){
        G.vbar(r0,r1,tx,8,1);
        if(r()<0.5) G.rect(tx+1,r0+1,tx+M(3),r1-1,9);
      }
      yv += fdir*(TLEN+M(5));
    }

    // fill the rest of the fenced lot with yard asphalt (the drive surface) — no void
    for(var yy=1;yy<H-1;yy++)for(var xx=1;xx<W-1;xx++) if(g[yy][xx]===0) g[yy][xx]=1;

    // GATES on the streets this cell touches (a wide truck gate) + guard shack beside it
    var gates=[];
    streets.forEach(function(edge){
      if(edge==='S'||edge==='N'){ var gx=Math.round(W*0.5), gy=(edge==='S')?H-1:0;
        for(i=-5;i<=5;i++)G.set(gx+i,gy,5);
        G.rect(gx+7,(edge==='S')?gy-M(4):gy+1,gx+7+M(3),(edge==='S')?gy-1:gy+M(4),11); // guard shack
        gates.push({edge:edge,x:gx,y:gy}); }
      else { var gy2=Math.round(H*0.5), gx2=(edge==='E')?W-1:0;
        for(i=-5;i<=5;i++)G.set(gx2,gy2+i,5);
        G.rect((edge==='E')?gx2-M(4):gx2+1,gy2+7,(edge==='E')?gx2-1:gx2+M(4),gy2+7+M(3),11);
        gates.push({edge:edge,x:gx2,y:gy2}); }
    });

    // SALVAGE CONTAINER laydown in a back corner (only on open asphalt)
    for(i=0;i<8;i++){ var lx=W-M(20)+Math.floor(r()*M(14)), ly=(flip?MARGIN+4:H-M(20))+Math.floor(r()*M(12));
      if(G.get(lx,ly)===1 && G.get(lx+M(6),ly+M(2))===1) G.rect(lx,ly,lx+M(6),ly+M(2),10); }

    return {g:g, W:W, H:H, streets:streets, gates:gates, footprints:K.footprints(g,function(v){return v===2||v===6;})};
  }
  function driveConnected(res){ return K.connectedFrom(res.g,function(c){return c===5;},function(c){return c===1||c===5||c===7;})>0.85; }

  var PALETTE={1:'#33333c',2:'#7a7a82',3:'#4a4438',4:'#c7a24a',5:'#c79a3f',6:'#8c8477',7:'#3f3f47',8:'#c9c1aa',9:'#5a5a64',10:'#6b5a3a',11:'#9a8a6a'};
  // TILE SPEC (the "note section" for tiling): code -> name, kind, ACT-1 dead-world material.
  var LEGEND={
    0:{name:'dead-ground',        kind:'ground',    act1:'bare cracked dirt / gravel (setback, yard gaps)'},
    1:{name:'asphalt drive',      kind:'drive',      act1:'cracked asphalt drive lane / employee lot (car-drivable)'},
    2:{name:'warehouse',          kind:'building',   act1:'big tilt-up concrete box, rusted metal siding, dark', enter:'WAREHOUSE INTERIOR: one big open floor, tall racking aisles, the dock doors seen from inside, a small office corner'},
    3:{name:'fence',              kind:'fence',      act1:'chain-link perimeter fence, sagging, some down'},
    4:{name:'dock door',          kind:'building',   act1:'roll-up loading dock door, dented, some open black', layer:'portal', solid:false, enter:'through the dock into the warehouse floor'},
    5:{name:'gate / truck gate',  kind:'gate',       act1:'wide drive-in yard gate, amber curb paint'},
    6:{name:'office',             kind:'building',   act1:'small front office block, broken glass', enter:'office interior: reception + a few rooms'},
    7:{name:'truck court',        kind:'drive',      act1:'cracked concrete truck apron (backing area, drivable)'},
    8:{name:'trailer stall stripe',kind:'marking',   act1:'faded trailer-stall stripe on asphalt'},
    9:{name:'parked trailer',     kind:'vehicle',    act1:'abandoned box trailer, faded, some tagged'},
    10:{name:'container',         kind:'prop',       act1:'rusted shipping container, dented, stacked'},
    11:{name:'guard shack',       kind:'building',   act1:'small guard booth at the gate, dark', enter:'tiny guard-booth interior (one room)'}
  };
  var NOTES={
    summary:'Distribution center — one big warehouse, a dock-door row, a truck court, a trailer yard, a front office + employee lot, a guard shack, fenced.',
    reference:['Real DC site plans (renoindustrial.com, steelcobuildings.com, alliedbuildings.com): one big box (not equal sheds), dock doors ~14ft o.c., a ~130ft truck court, ~1 trailer stall per dock, a front office + car park, fenced drive-in gates'],
    layout:['ONE big warehouse backs the far edge (a DC is one box).',
      'A row of dock doors along the front feeds a deep truck-court apron for backing trailers.',
      'Trailer staging + a parking yard (striped stalls, many parked trailers); an employee car lot + office + guard shack at the front; shipping containers; a perimeter fence.'],
    circulation:'Street-aware: exits the streets it touches with wide drive-in TRUCK gates; the asphalt + truck court form one connected yard reachable from the gate (driveConnected). Verified connected in all 6 placements.',
    layering:'GROUND plane: asphalt, truck court, trailer stall stripes (flat, drive on them). STRUCTURES (¾ front face, solid): the warehouse (2, ENTERABLE -> open floor + racking), the office (6) + guard shack (11, both enterable), the fence (3). PORTAL: the dock doors (4) — solid wall when closed, an opening into the warehouse floor when up; the truck gate (5). PROPS solid: parked trailers (9, big boxes you route around), containers (10). The warehouse occupies its whole footprint (block) and draws up as a tall face along the dock row.',
    decisions:['REBUILT from real DC research (Paolo: research the real thing first).',
      'Gate hardened to all 6 placements + a drive-reach assertion (7/19).']
  };
  K.register('industrial', { generate:generate, body:function(c){return c===2||c===6;}, palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaIndustrial=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
