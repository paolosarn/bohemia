// BOHEMIA PARK (7/19/26, v4 — DRIVABLE + street-aware. Paolo: "do you have drivable parts
// where a car normally would go, whether it's a corner or a standalone grid").
// v3 blurred cars and people into one path code and only reached the lot from the south. Now
// the DRIVABLE network is explicit: an asphalt DRIVEWAY (code 12) runs from the street curb
// cut into the PARKING LOT, whose aisles (also 12) let a car reach every stall — separate
// from the pedestrian TRAIL (code 1), which cars never use (you don't drive the walking loop).
// STREET-AWARE: real parks have ONE car entrance + pedestrian gates elsewhere. So the park is
// built in a canonical ENTRANCE-AT-SOUTH frame (car driveway + lot on the south street), then
// ROTATED so that entrance lands on whatever street the cell actually touches. On a CORNER,
// the primary street gets the car entrance; the other street(s) get pedestrian gates. This
// makes the drive correct for a standalone grid (1 street) AND a corner (2 streets), any edge.
// RESEARCH (park design guides): curvilinear trails route AROUND amenities; ~half is passive
// open lawn; playground/court near the street for surveillance; limited parking at entrance;
// pavilion in a quiet shaded zone; trees buffer the perimeter. Act-1 DEAD. Every tile named.
// LEGEND:
//  0 edge dead-ground   1 pedestrian path/trail   2 building(picnic shelter/restroom)
//  3 dead-tree          4 court marking            5 gate
//  6 basketball court   7 dead-turf(open lawn)     8 playground safety-surface
//  9 dead-pond         10 parking-stall           11 parked-car
// 12 DRIVE(driveway/parking aisle — CAR-DRIVABLE)  13 site-furniture(bench/table)
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function buildCanonical(seed){
    // entrance is at the SOUTH edge (bottom); car driveway + lot live on the south street.
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, i, x, y, r=G.rnd;
    G.rect(1,1,W-2,H-2,7);                                            // open dead-turf lawn

    function isSoft(c){ return c===7||c===0||c===3; }
    function stamp(x,y,rr,code){ for(var dy=-rr;dy<=rr;dy++)for(var dx=-rr;dx<=rr;dx++){ if(dx*dx+dy*dy<=rr*rr){ if(isSoft(G.get(x+dx,y+dy)))G.set(x+dx,y+dy,code); } } }
    function walk(x0,y0,x1,y1,rr){ var dx=x1-x0,dy=y1-y0,n=Math.max(Math.abs(dx),Math.abs(dy))||1; for(var s=0;s<=n;s++)stamp(Math.round(x0+dx*s/n),Math.round(y0+dy*s/n),rr,1); }
    function drive(x0,y0,x1,y1,rr){ var dx=x1-x0,dy=y1-y0,n=Math.max(Math.abs(dx),Math.abs(dy))||1; for(var s=0;s<=n;s++)stamp(Math.round(x0+dx*s/n),Math.round(y0+dy*s/n),rr,12); }
    function bench(x,y){ if(G.get(x,y)===7||G.get(x,y)===1) G.set(x,y,13); }
    function grove(cx,cy,rad,n){ for(var k=0;k<n;k++){ var a=r()*6.283,d=Math.sqrt(r())*rad,tx=Math.round(cx+Math.cos(a)*d),ty=Math.round(cy+Math.sin(a)*d); if(G.get(tx,ty)===7){ G.set(tx,ty,3); if(r()<0.35&&G.get(tx+1,ty)===7)G.set(tx+1,ty,3);} } }
    function trail(pts,rr){ var n=pts.length; function P(i){return pts[(i%n+n)%n];}
      for(var i2=0;i2<n;i2++){ var p0=P(i2-1),p1=P(i2),p2=P(i2+1),p3=P(i2+2);
        for(var t=0;t<1;t+=0.02){ var t2=t*t,t3=t2*t;
          var xx=0.5*((2*p1[0])+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3);
          var yy=0.5*((2*p1[1])+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3);
          stamp(Math.round(xx),Math.round(yy),rr,1); } } }

    // ===== SEED VARIETY (several parks must DIFFER; all stay in the realistic envelope) =====
    // jitter helper, a pond that may or may not exist, small nudges on the amenities + trail.
    var jit=function(a){ return Math.round((r()-0.5)*2*a); };
    var hasPond = r() < 0.72;                                        // some parks have water, some don't
    var pondCx=95+jit(6), pondCy=30+jit(6), pondR=8+Math.floor(r()*3);
    var pgJx=jit(3), pgJy=jit(3), ctJx=jit(3), ctJy=jit(2);          // playground + court nudges

    // ===== HARD FEATURES first (trail + drive route around them) =====
    // playground (bottom-left, street-visible)
    var gx0=15+pgJx,gy0=90+pgJy,gx1=39+pgJx,gy1=110+pgJy; G.rect(gx0,gy0,gx1,gy1,8);
    G.rect(gx0+3,gy0+3,gx0+6,gy0+6,13); G.rect(gx1-7,gy1-6,gx1-4,gy1-3,13); G.rect((gx0+gx1>>1)-1,(gy0+gy1>>1)-1,(gx0+gx1>>1)+1,(gy0+gy1>>1)+1,13);
    // basketball court (bottom-center, street-visible)
    var cx0=44+ctJx,cy0=92+ctJy,cx1=64+ctJx,cy1=111+ctJy; G.rect(cx0,cy0,cx1,cy1,6);
    for(x=cx0;x<=cx1;x++){G.set(x,cy0,4);G.set(x,cy1,4);} for(y=cy0;y<=cy1;y++){G.set(cx0,y,4);G.set(cx1,y,4);}
    for(x=cx0;x<=cx1;x++)G.set(x,(cy0+cy1)>>1,4); G.disc((cx0+cx1)>>1,(cy0+cy1)>>1,M(2),4);
    // PARKING LOT (bottom-right) — asphalt (12) with striped stalls (10) + cars (11); aisles are 12
    var lx0=72,ly0=100,lx1=113,ly1=119; G.rect(lx0,ly0,lx1,ly1,12);
    for(var ry=ly0+2; ry+M(5)<=ly1-1; ry+=M(5)+M(3)) for(x=lx0+2;x+2<lx1;x+=3){ G.vbar(ry,ry+M(5),x,10,1); if(r()<0.5)G.rect(x+1,ry+1,x+1,ry+M(5)-1,11); }
    // CAR DRIVEWAY: curb cut on the south street straight up into the lot (2 wide)
    var carx=Math.round((lx0+lx1)/2);
    drive(carx,H-2,carx,ly0+3,2);
    // picnic pavilion + restroom + tables (upper-left, quiet shaded zone)
    var sx=16,sy=16; G.rect(sx,sy,sx+11,sy+8,2); G.rect(sx+15,sy+2,sx+22,sy+8,2);
    for(i=0;i<4;i++){ bench(sx+2+i*2,sy+11); bench(sx+2+i*2,sy+13); }
    // naturalistic dead pond (upper-right, organic blob + stone rim) — OR a tree stand if none
    if(hasPond){ G.disc(pondCx,pondCy,pondR,9); G.disc(pondCx+8,pondCy-4,pondR-2,9); G.disc(pondCx-6,pondCy+8,pondR-3,9);
      for(y=0;y<H;y++)for(x=0;x<W;x++){ if(G.get(x,y)===9 && (G.get(x+1,y)===7||G.get(x-1,y)===7||G.get(x,y+1)===7||G.get(x,y-1)===7)) G.set(x,y,13); } }

    // ===== WINDING PEDESTRIAN TRAIL (flows through the lawn, around every feature) =====
    // base loop with per-seed jitter on the lawn waypoints (the entrance corridor stays fixed)
    var base=[[67,113],[46,98],[28,80],[22,54],[36,40],[54,28],[70,24],[84,42],[96,60],[92,84],[78,98],[68,106]];
    var loop=base.map(function(p,idx){ return (idx===0||idx===base.length-1)?p:[p[0]+jit(3),p[1]+jit(3)]; });
    trail(loop,1);
    if(!hasPond) grove(pondCx,pondCy,pondR+2,26);                    // a stand of trees where the pond would be
    walk(46,98,40,96,1);                 // spur -> playground
    walk(68,106,66,111,1);               // spur -> court
    walk(54,28,36,30,1);                 // spur -> pavilion
    walk(67,113,carx-6,H-2,1);           // pedestrian entrance walk from the south street

    // ===== TREES: perimeter buffer + shade groves + sparse lawn specimens =====
    for(var q=0;q<520;q++){ var side=Math.floor(r()*4),bx,by;
      if(side===0){bx=2+Math.floor(r()*(W-4));by=2+Math.floor(r()*6);}
      else if(side===1){bx=2+Math.floor(r()*6);by=2+Math.floor(r()*(H-4));}
      else if(side===2){bx=W-8+Math.floor(r()*6);by=2+Math.floor(r()*(H-4));}
      else {bx=2+Math.floor(r()*(W-4));by=H-9+Math.floor(r()*6); if(bx>55&&bx<118)continue;}
      if(G.get(bx,by)===7)G.set(bx,by,3); }
    grove(sx+30,sy+6,9,26); grove(107,52,8,18); grove(30,66,7,14);
    for(i=0;i<16;i++){ var tx=40+Math.floor(r()*44),ty=42+Math.floor(r()*38); if(G.get(tx,ty)===7&&r()<0.6)G.set(tx,ty,3); }
    for(i=0;i<loop.length;i++) bench(loop[i][0],loop[i][1]+2);
    bench(gx1+2,(gy0+gy1)>>1); bench(cx0-2,(cy0+cy1)>>1);

    // CAR GATE + a PEDESTRIAN GATE on the south street (both rotate to the real street later)
    G.rect(carx-3,H-1,carx+3,H-1,5);      // car gate (aligned with the driveway)
    G.rect(64,H-1,70,H-1,5);              // pedestrian gate (aligned with the entrance walk)
    return g;
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    // build canonical (car entrance at SOUTH), then let the KIT rotate it to the real street
    // + add pedestrian gates on any corner side streets (the shared street-aware machinery).
    var soft=function(c){ return c===7||c===0||c===3; };
    var res=K.rotateToStreet(buildCanonical(seed>>>0), streets, {gate:5, pedWalk:1, pedOver:soft, pedInset:18});
    var g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})};
  }

  var PALETTE={1:'#6a6a70',2:'#7a7266',3:'#4a4030',4:'#c9c1aa',5:'#c79a3f',6:'#566058',7:'#5a4f38',
    8:'#8a6a5a',9:'#3a4a52',10:'#c9c1aa',11:'#55555f',12:'#41414a',13:'#8f8676'};
  // TILE SPEC (the "note section" for the tiling phase): every code -> name, kind, and its
  // ACT-1 DEAD-WORLD material. act 2/3 evolution is CONTENTS-PAOLO'S ([PENDING] in the sheet).
  var LEGEND={
    0:{name:'edge dead-ground',   kind:'ground',    act1:'bare cracked dirt at the parcel edge (setback)'},
    1:{name:'path / walking trail',kind:'walk',      act1:'worn decomposed-granite / cracked concrete footpath'},
    2:{name:'building (shelter/restroom)',kind:'building',act1:'weathered CMU + faded metal-roof picnic shelter / restroom block'},
    3:{name:'dead tree',          kind:'tree-dead', act1:'bare leafless tree, grey bark, no canopy'},
    4:{name:'court / field marking',kind:'marking',  act1:'faded cream painted line, cracked'},
    5:{name:'gate / entrance',    kind:'gate',       act1:'park entrance gap + low bollards, amber curb paint'},
    6:{name:'basketball court',   kind:'court',      act1:'faded sport-court slab, hairline-cracked, ghost of old color'},
    7:{name:'open lawn (dead turf)',kind:'turf-dead',act1:'dead brown lawn, dry thatch, bald dirt patches'},
    8:{name:'playground surface', kind:'play',       act1:'sun-bleached rubber/woodchip safety surfacing + faded equipment'},
    9:{name:'dead pond',          kind:'water-dead', act1:'empty dry basin, cracked mud floor, stone rim'},
    10:{name:'parking stall',     kind:'marking',    act1:'faded stall stripe on asphalt'},
    11:{name:'parked car',        kind:'vehicle',    act1:'abandoned dust-caked car'},
    12:{name:'driveway / parking aisle',kind:'drive',act1:'cracked asphalt drive surface (car-drivable)'},
    13:{name:'site furniture',    kind:'prop',       act1:'weathered bench / picnic table / trash can'}
  };
  // DISTRICT DOSSIER (Paolo 7/19: "record all the notes of what the hell is happening in our
  // district"). The full build story, generated into the tile-spec sheet alongside the legend.
  var NOTES={
    summary:'Realistic neighborhood park — mostly open lawn with a few well-spaced amenities on a winding trail.',
    reference:['Neighborhood-park design guides (Miracle Recreation, Park N Play, TX AgriLife, Fresno/Tracy PRMPs)',
      '~half a park is passive open lawn; high-use amenities sit near the street for surveillance',
      'paths are curvilinear and route AROUND amenities — never a geometric circle'],
    layout:['Open dead-turf lawn is ~75% of the cell — the passive heart.',
      'A winding Catmull-Rom loop trail threads the lawn and flows AROUND every feature (drawn after the amenities).',
      'Playground + one basketball court along the street edge (visible for surveillance).',
      'Small parking pullout at the entrance; picnic shelter + restroom in the quiet upper-left with a shade grove.',
      'Naturalistic dead pond (present per seed) OR a tree stand in its place; perimeter tree buffer; benches at the trail bends.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet. ONE car entrance on the primary street (order S>E>W>N) with an explicit asphalt drive (code 12) into the lot; corner side streets get a PEDESTRIAN gate. A car reaches every stall from the curb.',
    decisions:['v1 "super park" (every amenity crammed in) REJECTED — rebuilt realistic, lawn-dominant (>55% gate).',
      'v2 perfect-circle path + court punching through it REJECTED — curvilinear trail, amenities drawn first.',
      'SEED VARIETY: pond present/absent + trail/amenity jitter so several parks differ.',
      'STREET-AWARE/DRIVABLE law (7/19): one car entrance + pedestrian side, drive reaches every stall, any placement.']
  };
  K.register('park', { generate:generate, body:function(c){return c===2;}, palette:PALETTE, legend:LEGEND, notes:NOTES, category:'leisure' });

  var API={generate:generate,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaPark=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
