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

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var soft=function(c){ return c===0||c===3; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:14});
    var g=res.g;
    // no enterable SURFACE buildings — the tunnel MOUTH (code 8) is the future interior hook
    // (into the LIFE tunnel network), not a surface floorplan.
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates, footprints:[]};
  }
  // a maintenance vehicle reaches the O&M roads from the street, any placement
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  var PALETTE={1:'#4a4640',2:'#6b6660',3:'#6a5f42',4:'#7a756c',5:'#c79a3f',6:'#6e6a61',7:'#4a5048',
    8:'#141410',9:'#6b6355',10:'#8a8f94',11:'#8a7a5a'};
  var LEGEND={
    0:{name:'desert dead-ground', kind:'ground',    act1:'bare Mojave dirt / channel embankment, cracked'},
    1:{name:'maintenance (O&M) road',kind:'drive',   act1:'gravel/old-asphalt top-of-bank service road (truck-drivable)'},
    2:{name:'concrete flood structure',kind:'structure',act1:'poured headwall / outfall structure, stained concrete'},
    3:{name:'dead brush / tumbleweed',kind:'tree-dead',act1:'dry tumbleweed + dead brush caught against the concrete'},
    4:{name:'channel bank',       kind:'structure',  act1:'sloped concrete channel lining, cracked, faded graffiti'},
    5:{name:'gate',               kind:'gate',       act1:'flood-district maintenance gate off the street, amber curb'},
    6:{name:'channel invert',     kind:'structure',  act1:'flat concrete channel floor, silt-stained, tagged'},
    7:{name:'dead low-flow trickle',kind:'water-dead',act1:'scummy dead-green standing trickle / dried mud line'},
    8:{name:'SEWER TUNNEL MOUTH', kind:'structure',  act1:'dark box-culvert opening under the street — the way underground'},
    9:{name:'riprap',             kind:'prop',       act1:'grouted rock rubble at the culvert transition'},
    10:{name:'chain-link fence',  kind:'fence',      act1:'flood-channel security fence, sagging, a hole cut by the mouth'},
    11:{name:'homeless camp debris',kind:'prop',     act1:'shopping cart, tarps, milk crates, mattress — a tunnel camp at the mouth'}
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
    decisions:['Paolo 7/19: a wash with a sewer entrance by the street where homeless people get into the sewers — the tunnel mouth is the headline feature.',
      'Filed TERRAIN in the taxonomy (the wash is the raw drainage land); it carries built flood infrastructure, so [PENDING Paolo] if he wants it moved to infrastructure.',
      'Act-1 DEAD: dry channel, scummy dead trickle, dead brush, no living vegetation. The "tunnel people" themselves are LIFE (agents), not tiles — this district gives them the DOOR.']
  };
  K.register('wash', { generate:generate, body:function(c){return c===2;}, category:K.category('wash')||'terrain', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaWash=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
