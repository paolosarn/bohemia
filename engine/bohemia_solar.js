// BOHEMIA SOLAR FARM (7/18/26). INFRASTRUCTURE, on the DISTRICT KIT, built to research +
// EXPLAIN-EVERY-TILE. Fits the CLUSTERED-POWER lore: the grid is eerily perfect — this
// plant is intact and generating while the world is dead. Real utility-solar site
// (pvfarm.io / pvcase.com): panel arrays in long rows, ~20-30ft O&M gravel access roads
// splitting the field into blocks, an INVERTER/transformer pad anchoring each block, a
// project SUBSTATION switchyard linking to the grid, a control building, perimeter fence +
// setback + a driveway gate. Every tile is one of those things.
// LEGEND: 0 dead-ground(setback) 1 gravel-access-road 2 control-building 3 fence
//  4 inverter/transformer-pad 5 gate 6 substation-switchgear 7 solar-panel
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  /* A SOLAR FARM IS ONE PLANT, NOT ONE PLANT PER CELL (8/24/26, WORLD lane).
     MEASURED on the canon valley: solar is TWO blobs totalling 303 cells, and the larger
     is 265 CELLS -- 2.4 km2, which is a correct size for real Mojave utility solar
     (Copper Mountain is about that). What was wrong is not the size, it is that this
     function only ever received a seed and a street list, so EVERY ONE of those 265 cells
     built a COMPLETE, SEPARATELY FENCED PLANT: 265 perimeter fences, 265 substation
     switchyards, 265 control buildings, 265 gates, and panel rows that restart at every
     cell boundary instead of running the field. 3.3% of the valley, repeating.

     It is also why solar reads as a WALL. `G.frame(3)` fenced all four sides of every
     cell, so the sealed-cell sweep measured `theirs=0` on every solar edge -- the desert
     pocket at 6,0/6,1/6,2 is walled in by a fence that should only exist on the outside
     of the plant.

     THE FIX IS THE 8/19 CLUSTER PATTERN, already proven on airport/airbase/convention/
     prison/dam/minigp/fort: the caller hands every cell THE BOUNDS OF ITS BLOB, the plant
     is laid out in VALLEY coordinates against those bounds, and each cell keeps its own
     128x128 window. Seams line up by construction because there is only one layout.

     TWO THINGS THIS HAD TO GET RIGHT THAT THE AIRFIELD DID NOT HAVE TO:
     1. SPEED. An airfield is 3-9 cells; iterating the whole field per cell is free. At 265
        cells the field is ~2,560 tiles across, so a naive "loop the plant, clip to the
        window" is 6.5M iterations per cell x 265 cells. Every loop below therefore starts
        at the first index that can touch THIS cell and stops when it leaves -- the work
        stays proportional to one cell, not to the plant.
     2. NO BOUNDS MUST STILL MEAN THE OLD PLOT. With bounds absent the blob is this one
        cell, every valley coordinate collapses to the cell-local one it used to be, and
        the output is BYTE-IDENTICAL to the previous generator. That is asserted in
        solar_gate.js rather than believed. */
  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, i, x, y;
    var MARGIN=3, ROWH=M(3), GAP=M(4), ROAD=M(3), SUBW=M(22), SUBH=M(16);

    var cellX=opts.cellX||0, cellY=opts.cellY||0;
    var b=opts.bounds||{x0:cellX,x1:cellX,y0:cellY,y1:cellY};
    var cx=cellX*W, cy=cellY*H;                       // this cell's origin, in valley tiles
    var fx0=b.x0*W, fx1=(b.x1+1)*W-1;                 // the whole plant, in valley tiles
    var fy0=b.y0*H, fy1=(b.y1+1)*H-1;
    var wx1=cx+W-1, wy1=cy+H-1;                       // this cell's window, valley tiles
    // VALLEY-COORDINATE WRITERS. Everything below draws THE PLANT; only what falls in this
    // cell's window is kept. vrect clips first so it never walks tiles it will discard.
    function vset(vx,vy,c){ var lx=vx-cx, ly=vy-cy; if(lx>=0&&ly>=0&&lx<W&&ly<H) g[ly][lx]=c; }
    function vrect(x0,y0,x1,y1,c){ if(x1<cx||x0>wx1||y1<cy||y0>wy1) return;
      var xa=Math.max(x0,cx), xb=Math.min(x1,wx1), ya=Math.max(y0,cy), yb=Math.min(y1,wy1), xx, yy;
      for(yy=ya;yy<=yb;yy++) for(xx=xa;xx<=xb;xx++) g[yy-cy][xx-cx]=c; }
    // first index >= a lower bound, for a loop that starts at `from` and steps by `step`
    function firstAt(from,step,atLeast){ return (atLeast<=from)?from:(from+Math.ceil((atLeast-from)/step)*step); }

    // PERIMETER FENCE: the PLANT's boundary. An interior cell of a big plant gets none,
    // which is the whole point -- a fence between two halves of one solar farm is a wall
    // that should not exist.
    vrect(fx0,fy0,fx1,fy0,3); vrect(fx0,fy1,fx1,fy1,3);
    vrect(fx0,fy0,fx0,fy1,3); vrect(fx1,fy0,fx1,fy1,3);
    // fx1/fy1 are the LAST TILE INDEX of the plant; the old code measured the far setback
    // off the WIDTH (W-2-MARGIN), so the +1 is what keeps a one-cell plant identical.
    var ax0=fx0+MARGIN+2, ax1=fx1+1-2-MARGIN, ay0=fy0+MARGIN+2, ay1=fy1+1-2-MARGIN;
    vrect(ax0,ay0,ax1,ay1,1);                                         // gravel base (O&M ground)

    // SUBSTATION switchyard + CONTROL building, ONCE, in the plant's bottom-left corner
    var sx0=ax0, sy1=ay1, sx1=ax0+SUBW, sy0=ay1-SUBH;
    for(y=sy0+1;y<sy1-1;y+=M(4)) for(x=sx0+1;x<sx1-1;x+=M(5)) vrect(x,y,x+M(3),y+M(2),6);  // transformer/switchgear rows
    vrect(sx0,sy0-M(7),sx0+M(10),sy0-1,2);                            // control / O&M building
    vrect(sx0-1,sy0-M(8),sx1+1,sy1,3);                                // hmm inner fence would overwrite; instead outline below
    // re-lay the switchyard cleanly (the outline above set fence 3 over it) -> restore yard + fence ring only
    vrect(sx0,sy0,sx1,sy1,1); for(y=sy0+1;y<sy1-1;y+=M(4)) for(x=sx0+1;x<sx1-1;x+=M(5)) vrect(x,y,x+M(3),y+M(2),6);
    for(x=sx0;x<=sx1;x++){vset(x,sy0,3);vset(x,sy1,3);} for(y=sy0;y<=sy1;y++){vset(sx0,y,3);vset(sx1,y,3);}  // yard fence
    vrect(sx0+2,sy0-M(7),sx0+2+M(10),sy0-1,2);                        // control / O&M building (above the yard)

    // PANEL ARRAY FIELD: long rows of panels, vertical O&M access roads split it into blocks,
    // an inverter/transformer pad anchors each block edge. Rows and roads are indexed off the
    // PLANT's origin, so they run unbroken across every cell of it.
    var roadXs=[], roadStep=M(30);
    for(x=ax0+roadStep; x<ax1-M(6); x+=roadStep){ if(x+ROAD-1>=cx&&x<=wx1) vrect(x,ay0,x+ROAD-1,ay1,1); roadXs.push(x); }
    var rowStep=ROWH+GAP, colStep=M(7);
    // ONLY THE ROWS AND COLUMNS THIS CELL CAN SEE (see note 1 above). invAt still counts
    // from the plant's first row so the inverter cadence is the plant's, not the window's.
    var yStart=firstAt(ay0,rowStep,cy-rowStep);
    for(y=yStart; y+ROWH<=ay1 && y<=wy1; y+=rowStep){
      var invAt=Math.round((y-ay0)/rowStep);
      var xStart=firstAt(ax0,colStep,cx-colStep);
      for(x=xStart; x+M(6)<ax1 && x<=wx1; x+=colStep){
        // skip access-road columns and the substation footprint
        var onRoad=false; for(i=0;i<roadXs.length;i++) if(x+M(6)>=roadXs[i]-1 && x<=roadXs[i]+ROAD) onRoad=true;
        var inSub=(x<sx1+2 && y>sy0-M(8));
        if(onRoad||inSub) continue;
        vrect(x,y,x+M(6),y+ROWH-1,7);                                 // a panel table (row segment)
      }
      // an inverter/transformer pad tucked beside a road on alternating rows
      if(roadXs.length){ var rX=roadXs[invAt%roadXs.length]; vrect(rX-M(2),y,rX-1,y+ROWH-1,4); }
    }

    // GATE + access driveway from the street(s) to the gravel spine. A gate belongs on the
    // PLANT's edge, so an interior cell never punches one -- it would be a gate in the
    // middle of a solar farm. A perimeter cell that fronts a street still gets one, which
    // is how a real facility of this size works: a main gate plus service gates.
    var gates=[];
    streets.forEach(function(edge){
      if(edge==='S'&&cy+H-1!==fy1) return; if(edge==='N'&&cy!==fy0) return;
      if(edge==='E'&&cx+W-1!==fx1) return; if(edge==='W'&&cx!==fx0) return;
      if(edge==='S'||edge==='N'){ var gx=Math.floor(W*0.5), gy=(edge==='S')?H-1:0, dir=(edge==='S')?-1:1;
        for(i=-3;i<=3;i++)G.set(gx+i,gy,5); for(var s=1;s<=M(6);s++){var yy=gy+dir*s; if(!(yy>0&&yy<H-1))break; for(var w=-2;w<=2;w++)if(G.get(gx+w,yy)===7||G.get(gx+w,yy)===0)G.set(gx+w,yy,1);} gates.push({edge:edge,x:gx,y:gy}); }
      else { var gy2=Math.floor(H*0.5), gx2=(edge==='E')?W-1:0, dir2=(edge==='E')?-1:1;
        for(i=-3;i<=3;i++)G.set(gx2,gy2+i,5); for(var s2=1;s2<=M(6);s2++){var xx=gx2+dir2*s2; if(!(xx>0&&xx<W-1))break; for(var w2=-2;w2<=2;w2++)if(G.get(xx,gy2+w2)===7||G.get(xx,gy2+w2)===0)G.set(xx,gy2+w2,1);} gates.push({edge:edge,x:gx2,y:gy2}); }
    });

    return {g:g, W:W, H:H, streets:streets, gates:gates, bounds:b,
      footprints:K.footprints(g,function(v){return v===2;})};
  }

  // a maintenance vehicle reaches the gravel access roads (code 1) from the street gate, in ANY
  // placement (STREET-AWARE/DRIVABLE LAW 7/19). Solar's roads run edge-to-edge so this is high.
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.9; }

  var PALETTE={
    /* CODE 0 IS A REAL TILE, NOT A VOID (8/4). Its legend names it and the plot draws
       it, but it had no colour here -- so every judging surface painted it MAGENTA,
       which is both a lie about the game and a PURPLE RESERVATION breach. */
    0: '#463f30',1:'#5a5346',2:'#7a7266',3:'#4a4438',4:'#6b6b74',5:'#c79a3f',6:'#8a8a92',7:'#2e3440'};
  // TILE SPEC (the "note section" for tiling): code -> name, kind, ACT-1 material. NOTE the
  // CLUSTERED-POWER lore: this plant is INTACT + generating while the world is dead — so its
  // panels/switchgear read maintained (eerily perfect), not decayed, unlike other districts.
  var LEGEND={
    0:{name:'dead-ground',        kind:'ground',    act1:'bare desert dirt (setback between fence and field)'},
    1:{name:'gravel access road', kind:'drive',      act1:'compacted gravel O&M road (maintenance-vehicle drivable)'},
    2:{name:'control building',   kind:'building',   act1:'small intact concrete control/switch house (powered)', enter:'control-room interior: switchgear panels, a monitoring desk (lit, powered)'},
    3:{name:'fence',              kind:'fence',      act1:'intact chain-link security fence + posts (maintained)'},
    4:{name:'inverter / transformer pad',kind:'structure',act1:'concrete pad + intact inverter/transformer box, humming'},
    5:{name:'gate',               kind:'gate',       act1:'security drive gate off the access road, amber curb'},
    6:{name:'substation switchgear',kind:'structure',act1:'switchyard racks, breakers, bus — intact, live'},
    7:{name:'solar panel',        kind:'panel',      act1:'PV panel row, dark blue-black glass, clean (still generating)'}
  };
  var NOTES={
    summary:'Utility solar farm — panel arrays, gravel access roads, inverter/transformer pads, a substation switchyard + control building, fenced. INTACT + generating (clustered-power lore).',
    reference:['Real utility-solar sites (pvfarm.io, pvcase.com): long panel rows, 20-30ft gravel O&M roads splitting the field into blocks, an inverter/transformer pad per block, a project substation switchyard, a control building, a perimeter fence + driveway gate'],
    layout:['Panel array rows fill the field; gravel access roads split it into blocks.',
      'An inverter/transformer pad anchors each block; a substation switchyard + control building in a corner link to the grid; a perimeter fence + a driveway gate.'],
    circulation:'Street-aware: a security drive gate off the access road on the street(s) it touches; the gravel roads run edge-to-edge and are reachable from the gate in any placement (driveConnected).',
    layering:'GROUND plane: the gravel O&M roads (walk/drive). STRUCTURES (¾ front face, solid): the panel arrays (7) sit on waist-to-head-high racks and block movement — you route BETWEEN them on the gravel roads (the field is not a walkable floor); the control building (2, ENTERABLE -> switch room), the substation switchgear (6, a fenced equipment yard, solid, not enterable), the fence (3). PROP solid: the inverter/transformer pads (4). PORTAL: the gate (5). Panels could later be a walk-under overhead in spots, but for now treat the array as solid — the roads are the movement network.',
    decisions:['CLUSTERED-POWER lore: this plant is INTACT + generating while the world is dead — panels/switchgear read maintained, NOT decayed (unlike other districts).',
      'driveConnected + full 6-placement gate coverage added 7/19.']
  };
  K.register('solar', { generate:generate, body:function(c){return c===2;}, category:'infrastructure', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaSolar=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
