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

  // rotate a square grid 90° clockwise: out[x][n-1-y] = g[y][x]
  function rotCW(g){ var n=g.length, out=[]; for(var y=0;y<n;y++){ out.push(new Array(n)); }
    for(var y2=0;y2<n;y2++)for(var x=0;x<n;x++){ out[x][n-1-y2]=g[y2][x]; } return out; }

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

    // ===== HARD FEATURES first (trail + drive route around them) =====
    // playground (bottom-left, street-visible)
    var gx0=15,gy0=90,gx1=39,gy1=110; G.rect(gx0,gy0,gx1,gy1,8);
    G.rect(gx0+3,gy0+3,gx0+6,gy0+6,13); G.rect(gx1-7,gy1-6,gx1-4,gy1-3,13); G.rect((gx0+gx1>>1)-1,(gy0+gy1>>1)-1,(gx0+gx1>>1)+1,(gy0+gy1>>1)+1,13);
    // basketball court (bottom-center, street-visible)
    var cx0=44,cy0=92,cx1=64,cy1=111; G.rect(cx0,cy0,cx1,cy1,6);
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
    // naturalistic dead pond (upper-right, organic blob + stone rim)
    G.disc(95,30,9,9); G.disc(103,26,7,9); G.disc(89,38,6,9);
    for(y=0;y<H;y++)for(x=0;x<W;x++){ if(G.get(x,y)===9 && (G.get(x+1,y)===7||G.get(x-1,y)===7||G.get(x,y+1)===7||G.get(x,y-1)===7)) G.set(x,y,13); }

    // ===== WINDING PEDESTRIAN TRAIL (flows through the lawn, around every feature) =====
    var loop=[[67,113],[46,98],[28,80],[22,54],[36,40],[54,28],[70,24],[84,42],[96,60],[92,84],[78,98],[68,106]];
    trail(loop,1);
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

  // scan the four borders; each contiguous run of gate(5) becomes one gate {edge,x,y}
  function scanGates(g){ var n=g.length,out=[],run=null;
    function edgeCells(){ var cells=[],x,y;
      for(x=0;x<n;x++)cells.push([x,0,'N']); for(y=0;y<n;y++)cells.push([n-1,y,'E']);
      for(x=n-1;x>=0;x--)cells.push([x,n-1,'S']); for(y=n-1;y>=0;y--)cells.push([0,y,'W']); return cells; }
    var cells=edgeCells();
    for(var i=0;i<cells.length;i++){ var c=cells[i],is=(g[c[1]][c[0]]===5);
      if(is){ if(!run)run={edge:c[2],xs:[c[0]],ys:[c[1]]}; else {run.xs.push(c[0]);run.ys.push(c[1]);} }
      else if(run){ out.push({edge:run.edge,x:Math.round(run.xs.reduce(function(a,b){return a+b;})/run.xs.length),y:Math.round(run.ys.reduce(function(a,b){return a+b;})/run.ys.length)}); run=null; } }
    if(run)out.push({edge:run.edge,x:run.xs[0],y:run.ys[0]});
    return out; }

  // draw a pedestrian gate + short walk-in on an edge (post-rotation, for corner side streets)
  function pedGate(g,edge){ var n=g.length,i,s;
    function soft(c){return c===7||c===0||c===3;}
    if(edge==='N'||edge==='S'){ var gx=Math.round(n*0.5),gy=(edge==='S')?n-1:0,dir=(edge==='S')?-1:1;
      for(i=-3;i<=3;i++)g[gy][gx+i]=5;
      for(s=1;s<=18;s++){var yy=gy+dir*s; if(yy<=0||yy>=n-1)break; if(soft(g[yy][gx]))g[yy][gx]=1; else break; } }
    else { var gy2=Math.round(n*0.5),gx2=(edge==='E')?n-1:0,dir2=(edge==='E')?-1:1;
      for(i=-3;i<=3;i++)g[gy2+i][gx2]=5;
      for(s=1;s<=18;s++){var xx=gx2+dir2*s; if(xx<=0||xx>=n-1)break; if(soft(g[gy2][xx]))g[gy2][xx]=1; else break; } } }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var g=buildCanonical(seed>>>0);
    // pick the CAR-entrance street (primary), rotate canonical-south to it
    var order=['S','E','W','N']; var primary='S';
    for(var o=0;o<order.length;o++){ if(streets.indexOf(order[o])>=0){ primary=order[o]; break; } }
    var kmap={S:0,W:1,N:2,E:3}, k=kmap[primary];
    for(var t=0;t<k;t++) g=rotCW(g);
    // corner: side streets get a pedestrian gate too
    streets.forEach(function(e){ if(e!==primary) pedGate(g,e); });
    var gates=scanGates(g);
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:gates,
      footprints:K.footprints(g,function(v){return v===2;})};
  }

  var PALETTE={1:'#6a6a70',2:'#7a7266',3:'#4a4030',4:'#c9c1aa',5:'#c79a3f',6:'#566058',7:'#5a4f38',
    8:'#8a6a5a',9:'#3a4a52',10:'#c9c1aa',11:'#55555f',12:'#41414a',13:'#8f8676'};
  K.register('park', { generate:generate, body:function(c){return c===2;}, palette:PALETTE, category:'leisure' });

  var API={generate:generate,footprints:function(r){return r.footprints;},palette:PALETTE};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaPark=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
