// BOHEMIA WASH (7/19/26). Paolo: "make a wash next to a street corner... I wanna wash where
// homeless people can get into the sewers — a sewer entrance by the street." A Las Vegas
// concrete flood-control channel (a "wash") with the box-culvert TUNNEL MOUTH where the open
// channel dives under the street — the real LV flood-tunnel lore: a ~600-mile channel system,
// box culverts under the Strip, an estimated 1,200-1,500 unhoused "tunnel people" living in
// them, entered at the wash outfalls (sources in the dossier). Built on the DISTRICT KIT,
// street-aware + drivable (maintenance O&M roads), EXPLAIN-EVERY-TILE, act-1 DEAD (dry channel,
// scummy dead trickle, dead brush, no living vegetation).
// LEGEND:
//  0 desert dead-ground   1 maintenance (O&M) road   2 concrete flood structure (headwall)
//  3 dead brush/tumbleweed 4 channel bank (concrete)  5 gate
//  6 channel invert (floor) 7 dead low-flow trickle    8 SEWER TUNNEL MOUTH (box culvert)
//  9 riprap (rock rubble)  10 chain-link fence         11 homeless camp debris
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    // canonical: the channel runs N->S and dives under the SOUTH street at the tunnel mouth.
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    function scatter(x0,y0,x1,y1,code,dens,over){ over=over||function(c){return c===0;};
      for(var k=0;k<(x1-x0)*(y1-y0)*dens;k++){ var tx=x0+Math.floor(r()*(x1-x0)), ty=y0+Math.floor(r()*(y1-y0));
        if(over(G.get(tx,ty))){ G.set(tx,ty,code); if(r()<0.4&&over(G.get(tx+1,ty)))G.set(tx+1,ty,code); } } }
    function clump(cx,cy,rad,n,code,over){ over=over||function(c){return c===0;};
      for(var k=0;k<n;k++){ var a=r()*6.283,d=Math.sqrt(r())*rad,tx=Math.round(cx+Math.cos(a)*d),ty=Math.round(cy+Math.sin(a)*d);
        if(over(G.get(tx,ty))){ G.set(tx,ty,code); if(r()<0.4&&over(G.get(tx+1,ty)))G.set(tx+1,ty,code); } } }

    // ---- WIDE channel right-of-way, outer->inner: desert | fence | O&M road | riprap | bank | invert ----
    var wFence=13,wRoad0=14,wRoad1=18,wRip0=19,wRip1=21, wBank0=22,wBank1=44, inv0=45,inv1=83, eBank0=84,eBank1=106,
        eRip0=107,eRip1=109, eRoad0=110,eRoad1=114, eFence=115;
    var top=6, botOpen=104;
    G.rect(wBank0,top,wBank1,botOpen,4); G.rect(eBank0,top,eBank1,botOpen,4);   // sloped concrete banks (wide)
    G.rect(inv0,top,inv1,botOpen,6);                                            // wide concrete invert floor
    G.rect(63,top,66,botOpen-2,7);                                             // dead low-flow trickle down the middle
    G.rect(wRip0,top,wRip1,120,9); G.rect(eRip0,top,eRip1,120,9);              // riprap shoulders top-of-bank
    G.rect(wRoad0,top,wRoad1,124,1); G.rect(eRoad0,top,eRoad1,124,1);          // maintenance O&M roads (drivable)
    G.rect(wRoad0,121,eRoad1,124,1);                                           // south connector ties both O&M roads + gate

    // ---- the SEWER TUNNEL MOUTH: the wide channel narrows into a box culvert under the street ----
    G.rect(wBank0,botOpen+1,eBank1,botOpen+3,2);                                // concrete headwall across the channel
    var mx0=56,mx1=72;
    G.rect(mx0,botOpen+4,mx1,119,8);                                            // box-culvert MOUTH (dark) under the street
    G.rect(inv0,botOpen+1,mx0-1,botOpen+3,2); G.rect(mx1+1,botOpen+1,inv1,botOpen+3,2); // headwall wings funnel to the mouth
    G.rect(mx0-6,botOpen+4,mx0-1,118,9); G.rect(mx1+1,botOpen+4,mx1+6,118,9);   // riprap flanking the mouth

    // ---- fences along the top of the banks, with a GAP by the mouth (where people slip in) ----
    G.vbar(top,120,wFence,10,1); G.vbar(top,120,eFence,10,1);
    for(y=96;y<=114;y++) G.set(eFence,y,0);                                    // hole in the east fence by the tunnel
    G.rect(eRoad1+1,110,eBank1,118,0);                                         // a scramble path from the street side down to the mouth

    // ---- homeless camp debris on the invert apron just above the mouth (they live at the mouth) ----
    clump((mx0+mx1)>>1,96,10,60,11,function(c){return c===6||c===7;});
    G.rect(mx0-2,98,mx0,101,11); G.rect(mx1,94,mx1+2,97,11);                    // cart / crate clusters
    G.rect(mx0-3,93,mx0+1,96,14); G.rect(mx1-1,102,mx1+3,105,14);               // THE TARPS lashed over them
    G.rect(mx1+4,106,mx1+9,110,14); G.rect(mx1+5,111,mx1+8,113,11);             // and one up on the bank in the bridge shade
    scatter(inv0,top+4,inv1,90,3,0.015,function(c){return c===6;});            // dead brush caught in the channel
    scatter(inv0,top+4,inv1,botOpen,11,0.006,function(c){return c===6;});      // stray trash on the invert

    // ---- desert embankments: CLUMPED dead brush + rock (not confetti) so the margins read designed ----
    for(i=0;i<10;i++){ clump(2+Math.floor(r()*(wFence-3)), 6+i*12, 5, 22, 3); clump(2+Math.floor(r()*(wFence-3)), 6+i*12, 4, 8, 9); }
    for(i=0;i<10;i++){ clump(eFence+2+Math.floor(r()*(W-eFence-4)), 6+i*12, 5, 22, 3); clump(eFence+2+Math.floor(r()*(W-eFence-4)), 6+i*12, 4, 8, 9); }
    scatter(wBank0,1,eBank1,top-1,3,0.05);                                     // brush at the open channel head

    // ---- maintenance GATE on the SOUTH street (rotated onto the real street by the kit) ----
    var gx=Math.round(W*0.5);
    for(i=-3;i<=3;i++)G.set(gx+i,H-1,5);
    for(y=H-1;y>=121;y--) for(x=-2;x<=2;x++){ var c=G.get(gx+x,y); if(c===0)G.set(gx+x,y,1); }
    return g;
  }


  /* ONE WASH, NOT FIFTY-ONE (8/25). A wash is a RIVER. The canon valley's channel runs
     east from cell (56,47) to (89,47) and then turns south down to (89,75) -- 51 cells of
     one continuous flood-control channel. Handed only its own cell, every one of them built
     a COMPLETE channel: full banks, invert, trickle, fence, and its own box-culvert tunnel
     mouth. Along an east-west run of 34 cells that is 34 parallel NORTH-SOUTH channels
     sitting shoulder to shoulder, each diving under a street. A comb, not a river.

     WHY NEIGHBOURS AND NOT BOUNDS. Solar (8/24) got its blob as a bounding BOX and filled
     it, which is right for a field. A channel is a LINE, and this one turns a corner: the
     bounding box of the corner blob is 4x7 cells, and a straight line drawn through that
     box misses most of the actual wash cells. What a linear district needs is not the
     blob's extent but WHICH SIDES THE CHANNEL ARRIVES AND LEAVES ON, which is exactly the
     four neighbours. E and W -> it runs across. N and S -> it runs down. E and S -> it
     turns. One neighbour -> it ends here. That handles straight runs, corners, branches
     and single cells with no special cases and no bounding box at all.

     THE MOUTH IS A BLOB FEATURE, NOT A CELL FEATURE. Only an END of the channel gets the
     headwall and the box culvert, because that is the one place a channel actually goes
     underground. An interior cell gets an open channel that runs straight through -- which
     is what makes the neighbour's channel line up with this one. */
  var AX_NS=1, AX_EW=2;
  function clusterChannel(seed,opts,nb){
    var G=K.grid(seed>>>0), g=G.g, W=G.W, H=G.H, x, y, i, r=G.rnd;
    var streets=opts.streets||[];
    function scatter(x0,y0,x1,y1,code,dens,over){ over=over||function(c){return c===0;};
      for(var k=0;k<(x1-x0)*(y1-y0)*dens;k++){ var tx=x0+Math.floor(r()*(x1-x0)), ty=y0+Math.floor(r()*(y1-y0));
        if(over(G.get(tx,ty))){ G.set(tx,ty,code); if(r()<0.4&&over(G.get(tx+1,ty)))G.set(tx+1,ty,code); } } }
    function clump(cx,cy,rad,n,code,over){ over=over||function(c){return c===0;};
      for(var k=0;k<n;k++){ var a=r()*6.283,d=Math.sqrt(r())*rad,tx=Math.round(cx+Math.cos(a)*d),ty=Math.round(cy+Math.sin(a)*d);
        if(over(G.get(tx,ty))){ G.set(tx,ty,code); if(r()<0.4&&over(G.get(tx+1,ty)))G.set(tx+1,ty,code); } } }

    /* THE SAME CROSS-SECTION THE CANONICAL BUILD USES, kept to the tile so a cluster cell
       and a lone cell read as the same piece of infrastructure: desert | fence | O&M road |
       riprap | bank | invert | trickle | and back out again, mirrored. Written as offsets
       from the channel centre-line so it can be laid along either axis. */
    var CL=64;                                    // centre-line of a 128-tile cell
    /* THE CROSS-SECTION, BY DISTANCE FROM THE CENTRE-LINE, taken tile for tile off the
       canonical build so a cluster cell and a lone cell read as the same infrastructure:
       trickle, invert, sloped bank, riprap shoulder, O&M road, fence, desert. */
    function bandAt(d){ return d<=2?7 : d<=19?6 : d<=42?4 : d<=45?9 : d<=50?1 : d===51?10 : -1; }

    var runNS = nb.n||nb.s, runEW = nb.e||nb.w;
    if(!runNS && !runEW) runNS = true;                       // an orphan cell still gets a channel
    /* HOW FAR EACH ARM REACHES. Toward a wash neighbour it runs to the cell edge, so the
       two channels meet exactly; away from one it stops at its own bank, which is where the
       headwall goes. */
    /* A TURN AND AN END STOP IN DIFFERENT PLACES, and getting that wrong squares off the
       bend. At an END the arm has to reach CL+51 because the headwall sits at CL+40 and the
       culvert beyond it. At a TURN there is no headwall -- the arm just has to reach the
       other arm's BANK (CL+42), and stopping there is what lets the riprap, the O&M road
       and the fence wrap around the OUTSIDE of the bend instead of being paved over by an
       invert that carries on past the corner into open desert. */
    var turn = runNS && runEW, far = turn ? 42 : 51;
    var nsA = runNS ? (nb.n?0:CL-far) : 1, nsB = runNS ? (nb.s?H-1:CL+far) : 0;
    var ewA = runEW ? (nb.w?0:CL-far) : 1, ewB = runEW ? (nb.e?W-1:CL+far) : 0;

    /* AND THE ELBOW IS WHY THIS IS A PER-TILE CLASSIFY AND NOT TWO PAINTS. Painting the
       north-south arm and then the east-west arm over it looked right and was wrong: in the
       overlap the second arm's BANKS cut across the first arm's invert, so a channel that
       turns a corner ran into a wall halfway through the turn. Asking each tile which
       centre-line it is NEAREST to makes the corner a confluence by construction -- invert
       wherever either arm has invert -- and leaves a straight run bit-for-bit what a single
       painted section would have drawn. */
    for(y=0;y<H;y++) for(x=0;x<W;x++){
      var d=999;
      if(runNS && y>=nsA && y<=nsB) d=Math.min(d,Math.abs(x-CL));
      if(runEW && x>=ewA && x<=ewB) d=Math.min(d,Math.abs(y-CL));
      var c=bandAt(d); if(c>=0) g[y][x]=c;
    }

    /* DESERT MARGINS, DRESSED WHEREVER THEY ACTUALLY ARE. The canonical build clumps brush
       and rock down the LEFT and RIGHT strips, because its channel always runs north-south
       so the desert is always east and west of it. A cluster channel runs whichever way its
       neighbours do, and on an east-west run that dressing lands in the middle of the water
       and leaves the real margins -- north and south -- a blank slab. So the dressing walks
       a lattice and clumps into whatever is still bare, which gets the margins right on any
       axis and dresses the ground behind a headwall too. */
    var deadOK=function(c){ return c===0; };
    for(y=4;y<H;y+=12) for(x=4;x<W;x+=12){
      if(g[y][x]!==0) continue;
      clump(x+Math.floor(r()*7)-3, y+Math.floor(r()*7)-3, 5, 20, 3, deadOK);
      if(r()<0.65) clump(x+Math.floor(r()*7)-3, y+Math.floor(r()*7)-3, 4, 7, 9, deadOK);
    }
    /* AND THE DRESSING KEEPS OFF THE SEAM, inset by one tile on every side. A tumbleweed
       is scattered and does not line up with the neighbour's, so a single one landing on
       the boundary row makes one cell's concrete meet the next cell's brush -- seven of the
       forty-four seams, every one of them a tile or two of litter. That is not a broken
       river, but a seam check that has to forgive dressing cannot see a real break either.
       Cheaper to keep the confetti a tile back from the edge and leave the check strict.
       The in-channel scatter also runs over the WHOLE cell rather than a fixed middle
       band: `over` already restricts it to invert, and where the invert is depends on which
       way this cell's channel runs. */
    var inset=function(x0,y0,x1,y1,code,dens,over){ scatter(Math.max(1,x0),Math.max(1,y0),
      Math.min(W-2,x1),Math.min(H-2,y1),code,dens,over); };
    inset(0,0,W-1,H-1,3,0.004,deadOK);
    inset(0,0,W-1,H-1,3,0.006,function(c){return c===6;});   // brush caught in the channel
    inset(0,0,W-1,H-1,11,0.003,function(c){return c===6;});  // stray trash on the invert

    /* THE END OF THE CHANNEL: headwall, box culvert, the hole in the fence and the camp.
       An END is a cell with at most one wash neighbour. The mouth faces the side with NO
       neighbour, because that is the direction the channel has nowhere left to go. */
    var ends=0; if(nb.n)ends++; if(nb.s)ends++; if(nb.e)ends++; if(nb.w)ends++;
    var gates=[];
    if(ends<=1){
      var face = nb.n?'S': nb.s?'N': nb.e?'W': nb.w?'E' : 'S';
      mouth(face);
    }
    function mouth(face){
      /* Built in the canonical SOUTH orientation and then mapped, so the shape below is the
         same headwall-wings-culvert-camp the lone-cell wash has always drawn. */
      var botOpen = CL+40, i2, y2, x2;
      function put(u,v,c){ /* u = across the channel, v = along it, 0 at the far end */
        var tx,ty;
        if(face==='S'){ tx=CL+u; ty=v; } else if(face==='N'){ tx=CL+u; ty=H-1-v; }
        else if(face==='E'){ tx=v; ty=CL+u; } else { tx=W-1-v; ty=CL+u; }
        if(tx>=0&&ty>=0&&tx<W&&ty<H) g[ty][tx]=c;
      }
      function pr(u0,v0,u1,v1,c){ for(var v=v0;v<=v1;v++) for(var u=u0;u<=u1;u++) put(u,v,c); }
      pr(-42,botOpen+1,42,botOpen+3,2);                    // headwall across the channel
      pr(-8,botOpen+4,8,H-9,8);                            // the BOX-CULVERT MOUTH
      pr(-14,botOpen+4,-9,H-10,9); pr(9,botOpen+4,14,H-10,9);   // riprap flanking the mouth
      for(y2=32;y2<=50;y2++) put(51,y2,0);                 // the hole cut in the fence
      pr(46,H-19,42,H-11,0);                               // scramble path down from the street side
      /* THE CAMP AT THE MOUTH -- carts, crates and the blue tarps. It belongs to the mouth,
         so a blob has exactly one of it however many cells long the channel is. */
      var mcx = (face==='S'||face==='N') ? CL : (face==='E'? botOpen-8 : W-1-(botOpen-8));
      var mcy = (face==='S') ? botOpen-8 : (face==='N') ? H-1-(botOpen-8) : CL;
      clump(mcx,mcy,10,60,11,function(c){return c===6||c===7;});
      pr(-10,botOpen-8,-8,botOpen-5,11); pr(8,botOpen-12,10,botOpen-9,11);
      pr(-11,botOpen-13,-7,botOpen-10,14); pr(7,botOpen-4,11,botOpen-1,14);
      pr(12,botOpen,17,botOpen+4,14); pr(13,botOpen+5,16,botOpen+7,11);
    }

    /* THE MAINTENANCE GATE, on every street edge this cell actually fronts. The O&M roads
       run the length of the channel, so a truck that gets in anywhere can reach all of it --
       which is how a flood district actually services a channel, and it is what keeps the
       drivable-access law true on a cell that is nowhere near the mouth. */
    streets.forEach(function(edge){
      var gx, gy, s2, w2, c2;
      if(edge==='S'||edge==='N'){ gx=Math.round(W*0.5); gy=(edge==='S')?H-1:0;
        for(i=-3;i<=3;i++) g[gy][gx+i]=5;
        for(s2=1;s2<=M(8);s2++){ var yy=gy+((edge==='S')?-s2:s2); if(yy<=0||yy>=H-1)break;
          for(w2=-2;w2<=2;w2++){ c2=g[yy][gx+w2]; if(c2===0||c2===3||c2===9) g[yy][gx+w2]=1; } }
        gates.push({edge:edge,x:gx,y:gy});
      } else { gy=Math.round(H*0.5); gx=(edge==='E')?W-1:0;
        for(i=-3;i<=3;i++) g[gy+i][gx]=5;
        for(s2=1;s2<=M(8);s2++){ var xx=gx+((edge==='E')?-s2:s2); if(xx<=0||xx>=W-1)break;
          for(w2=-2;w2<=2;w2++){ c2=g[gy+w2][xx]; if(c2===0||c2===3||c2===9) g[gy+w2][xx]=1; } }
        gates.push({edge:edge,x:gx,y:gy});
      }
    });
    return {g:g, W:W, H:H, streets:streets, gates:gates, footprints:[]};
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    /* A LONE WASH CELL IS UNCHANGED. The canonical-south build plus rotateToStreet is the
       right answer for one cell -- the channel crosses it and dives under its own street --
       and it is art that has already shipped. Only a cell with a wash NEXT to it takes the
       cluster path, because only then is there a neighbouring channel to line up with. */
    var nb=opts.neigh;
    if(nb && (nb.n||nb.s||nb.e||nb.w)) return clusterChannel(seed,opts,nb);
    var soft=function(c){ return c===0||c===3; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:14});
    var g=res.g;
    // no enterable SURFACE buildings — the tunnel MOUTH (code 8) is the future interior hook
    // (into the LIFE tunnel network), not a surface floorplan.
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates, footprints:[]};
  }
  // a maintenance vehicle reaches the O&M roads from the street, any placement
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  var PALETTE={
    /* CODE 0 IS A REAL TILE, NOT A VOID (8/4). Its legend names it and the plot draws
       it, but it had no colour here -- so every judging surface painted it MAGENTA,
       which is both a lie about the game and a PURPLE RESERVATION breach. */
    0: '#4a422f',1:'#4a4640',2:'#6b6660',3:'#6a5f42',4:'#7a756c',5:'#c79a3f',6:'#6e6a61',7:'#4a5048',
    8:'#141410',9:'#6b6355',10:'#8a8f94',11:'#8a7a5a',
    /* THE TARP: blue poly, and the one thing in a concrete channel with a colour in it. */
    14:'#3f6a8c'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt / channel embankment, cracked'},
    1:{name:'maintenance (O&M) road',kind:'drive',   act1:'gravel/old-asphalt top-of-bank service road (truck-drivable)'},
    2:{name:'concrete flood structure',kind:'structure',act1:'poured headwall / outfall structure, stained concrete'},
    3:{name:'dead brush / tumbleweed',kind:'tree-dead',act1:'dry tumbleweed + dead brush caught against the concrete', solid:false},
    4:{name:'channel bank',       kind:'structure',  act1:'sloped concrete channel lining, cracked, faded graffiti', layer:'ground', solid:false},
    5:{name:'gate',               kind:'gate',       act1:'flood-district maintenance gate off the street, amber curb'},
    6:{name:'channel invert',     kind:'structure',  act1:'flat concrete channel floor, silt-stained, tagged', layer:'ground', solid:false},
    7:{name:'dead low-flow trickle',kind:'water-dead',act1:'scummy dead-green standing trickle / dried mud line'},
    8:{name:'SEWER TUNNEL MOUTH', kind:'structure',  act1:'dark box-culvert opening under the street — the way underground', layer:'portal', solid:false, enter:'THE UNDERGROUND: the LIFE flood-tunnel network where the unhoused live (a separate below-grade level; this is the door)'},
    9:{name:'riprap',             kind:'prop',       act1:'grouted rock rubble at the culvert transition'},
    10:{name:'chain-link fence',  kind:'fence',      act1:'flood-channel security fence, sagging, a hole cut by the mouth'},
    11:{name:'homeless camp debris',kind:'prop',     act1:'shopping cart, milk crates, mattress — a tunnel camp at the mouth'},
    14:{name:'camp tarp',           kind:'prop',     act1:'a blue poly tarp lashed over the camp against the wall, sun-bleached along every fold — the one thing down here with a colour in it'}
  };
  var NOTES={
    summary:'Las Vegas concrete flood-control wash — a lined channel that dives under the street at a box-culvert SEWER TUNNEL MOUTH, the way the unhoused get underground.',
    reference:['Real LV flood tunnels (reviewjournal.com, nevadacurrent.com, casino.org, Wikipedia "Mole people"): a ~600-mile flood-channel system, box culverts under the Strip, an estimated 1,200-1,500 unhoused "tunnel people" living in them, entered at the wash outfalls; flash floods rip through at ~30mph toward the wetlands/Lake Mead',
      'Concrete-lined trapezoidal channel: sloped banks + a flat invert + a low-flow trickle, fenced, with top-of-bank maintenance roads'],
    layout:['A concrete channel runs across the cell: sloped banks + a flat invert with a dead low-flow trickle down the middle.',
      'Top-of-bank maintenance (O&M) roads run both sides (drivable), fenced with chain-link.',
      'Where the channel meets the street it dives underground: a headwall + a dark BOX-CULVERT tunnel mouth — the sewer entrance.',
      'A hole cut in the fence + a scramble path from the street lead down to the mouth; a homeless camp (cart, tarps, crates) sits on the invert apron at the mouth.',
      'Desert embankments on either side, textured with dead brush + rock rubble (riprap).'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet — the channel dives under the PRIMARY street at the tunnel mouth; the maintenance O&M roads (code 1) are the drivable surface, reachable from the street gate in any placement (K.driveReachFromStreet). Corner side streets get a pedestrian gate.',
    layering:'THE WASH IS BELOW GRADE — this is its whole layering story. At street/desert level: the O&M roads (1) and fence (10, solid, with a hole by the mouth) run along the TOP OF BANK. The concrete BANKS (4) are a walkable SLOPE descending from that lip down into the channel (not solid — you climb down them). The INVERT (6) + dead trickle (7) are the sunken channel FLOOR, one level down (where the tunnel people walk). STRUCTURE (¾ face, solid): the headwall (2). PORTAL: the SEWER TUNNEL MOUTH (8) — from the sunken invert you step through the box culvert into THE UNDERGROUND, a whole separate below-grade level (the LIFE tunnel network). PROPS: riprap (9, solid rubble), homeless camp debris (11, solid), dead brush (3, low/passable). So a body descends: street-grade road/fence -> slope bank -> sunken invert -> through the mouth -> underground. Three vertical layers in one cell.',
    decisions:['Paolo 7/19: a wash with a sewer entrance by the street where homeless people get into the sewers — the tunnel mouth is the headline feature.',
      'Filed TERRAIN in the taxonomy (the wash is the raw drainage land); it carries built flood infrastructure, so [PENDING Paolo] if he wants it moved to infrastructure.',
      'Act-1 DEAD: dry channel, scummy dead trickle, dead brush, no living vegetation. The "tunnel people" themselves are LIFE (agents), not tiles — this district gives them the DOOR.']
  };
  K.register('wash', { generate:generate, body:function(c){return c===2;}, category:K.category('wash')||'terrain', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaWash=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
