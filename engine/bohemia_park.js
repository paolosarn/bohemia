// BOHEMIA PARK (7/19/26, v3 — RESEARCHED custom grid. Paolo killed v2's perfect circle +
// the court punching through it: "not realistic, do online research, find out what a park
// looks like, create a good custom grid").
// RESEARCH (neighborhood-park design guides — Miracle Recreation, Park N Play, TX AgriLife,
// Fresno/Tracy PRMPs): (1) paths are FLOWING CURVILINEAR trails that wind and define use
// areas — never a geometric circle — and they route AROUND amenities, nothing sits on the
// path; (2) ~half the park is PASSIVE open lawn — one big central green, mostly empty with a
// few shade trees; (3) high-use amenities (playground, court) sit NEAR THE STREET for
// natural surveillance, with LIMITED parking at the entrance; (4) picnic pavilion sits in a
// quieter shaded zone; (5) TREES buffer the perimeter (screen neighbors) + shade the seating.
// So: amenities are drawn FIRST, then the winding trail is laid only over open ground, so it
// naturally flows AROUND every feature — a court can never break through it.
// Act-1 DEAD: dead-brown turf, bare trees, empty pond; hardscape intact. Every tile named.
// LEGEND:
//  0 edge dead-ground   1 path/plaza/drive    2 building(picnic shelter/restroom)
//  3 dead-tree          4 court marking        5 gate
//  6 basketball court   7 dead-turf(open lawn) 8 playground safety-surface
//  9 dead-pond         10 parking-stall       11 parked-car   13 site-furniture(bench/table)
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, i, x, y, r=G.rnd;

    // ---- BASE: open dead-turf lawn to a 1-tile edge ----
    G.rect(1,1,W-2,H-2,7);

    function isSoft(c){ return c===7||c===0||c===3; }
    function stampPath(x,y,rr){ for(var dy=-rr;dy<=rr;dy++)for(var dx=-rr;dx<=rr;dx++){ if(dx*dx+dy*dy<=rr*rr){ var xx=x+dx, yy=y+dy; if(isSoft(G.get(xx,yy)))G.set(xx,yy,1); } } }
    function line(x0,y0,x1,y1,rr){ var dx=x1-x0, dy=y1-y0, n=Math.max(Math.abs(dx),Math.abs(dy))||1;
      for(var s=0;s<=n;s++){ stampPath(Math.round(x0+dx*s/n), Math.round(y0+dy*s/n), rr); } }
    function bench(x,y){ if(G.get(x,y)===7||G.get(x,y)===1) G.set(x,y,13); }
    function grove(cx,cy,rad,n){ for(var k=0;k<n;k++){ var a=r()*6.283, d=Math.sqrt(r())*rad, tx=Math.round(cx+Math.cos(a)*d), ty=Math.round(cy+Math.sin(a)*d);
      if(G.get(tx,ty)===7){ G.set(tx,ty,3); if(r()<0.35&&G.get(tx+1,ty)===7)G.set(tx+1,ty,3); } } }
    // Catmull-Rom through waypoints -> a smooth WINDING trail (the anti-circle)
    function trail(pts,closed,rr){ var n=pts.length;
      function P(i){ if(closed)return pts[(i%n+n)%n]; return pts[Math.max(0,Math.min(n-1,i))]; }
      var last=closed?n:n-1;
      for(var i2=0;i2<last;i2++){ var p0=P(i2-1),p1=P(i2),p2=P(i2+1),p3=P(i2+2);
        for(var t=0;t<1;t+=0.02){ var t2=t*t,t3=t2*t;
          var xx=0.5*((2*p1[0])+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3);
          var yy=0.5*((2*p1[1])+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3);
          stampPath(Math.round(xx),Math.round(yy),rr); } } }

    // ================= AMENITIES FIRST (the trail will flow AROUND them) =================

    // 1. PLAYGROUND — near the street (lower-left), visible from the entrance for surveillance
    var px0=16, py0=88, px1=44, py1=107;
    G.rect(px0,py0,px1,py1,8);
    G.rect(px0+3,py0+3,px0+6,py0+6,13); G.rect(px1-7,py1-6,px1-4,py1-3,13); G.rect((px0+px1>>1)-1,(py0+py1>>1)-1,(px0+px1>>1)+1,(py0+py1>>1)+1,13);

    // 2. BASKETBALL COURT — also near the street (lower-center), its own footprint
    var bx0=52, by0=90, bx1=75, by1=110;
    G.rect(bx0,by0,bx1,by1,6);
    for(x=bx0;x<=bx1;x++){G.set(x,by0,4);G.set(x,by1,4);} for(y=by0;y<=by1;y++){G.set(bx0,y,4);G.set(bx1,y,4);}
    for(x=bx0;x<=bx1;x++)G.set(x,(by0+by1)>>1,4); G.disc((bx0+bx1)>>1,(by0+by1)>>1,M(2),4);

    // 3. PARKING PULLOUT — small, at the entrance (lower-right)
    var lx0=84, ly0=98, lx1=115, ly1=119;
    G.rect(lx0,ly0,lx1,ly1,1);
    for(var ry=ly0+2; ry+M(5)<=ly1-1; ry+=M(5)+M(3)) for(x=lx0+2;x+2<lx1;x+=3){
      G.vbar(ry,ry+M(5),x,10,1); if(r()<0.5)G.rect(x+1,ry+1,x+1,ry+M(5)-1,11); }

    // 4. PICNIC PAVILION + RESTROOM + tables — quieter shaded zone (upper-left)
    var sx=18, sy=18;
    G.rect(sx,sy,sx+11,sy+8,2);                                    // group picnic shelter
    G.rect(sx+15,sy+2,sx+22,sy+8,2);                               // restroom
    for(i=0;i<4;i++){ bench(sx+2+i*2,sy+11); bench(sx+2+i*2,sy+13); } // picnic tables under shade

    // 5. SMALL NATURALISTIC POND — passive water feature, organic (overlapping discs, not a disc)
    G.disc(96,30,9,9); G.disc(104,26,7,9); G.disc(90,38,6,9);
    // stone rim where pond meets lawn
    for(y=0;y<H;y++)for(x=0;x<W;x++){ if(G.get(x,y)===9){ var edge=false;
      if(G.get(x+1,y)===7||G.get(x-1,y)===7||G.get(x,y+1)===7||G.get(x,y-1)===7)edge=true; if(edge)G.set(x,y,13); } }

    // ================= THE WINDING TRAIL (flows through the open lawn, around amenities) =====
    // one organic loop; Catmull-Rom keeps it curvilinear. Waypoints sit in open lawn, in the
    // corridors BETWEEN amenities, so the trail never crosses a court/building/playground.
    var loop=[[63,114],[46,102],[30,80],[23,54],[36,40],[52,28],[70,22],[85,40],[98,58],[95,82],[80,98],[66,108]];
    trail(loop,true,1);
    // spurs: trail -> each amenity edge (stop at the feature since path only writes open ground)
    line(46,102,42,98,1);            // -> playground
    line(66,108,68,110,1);           // -> court (south edge)
    line(52,28,34,30,1);             // -> pavilion/restroom
    line(95,82,100,98,2);            // -> parking (a drive, wider)
    // ENTRANCE WALK from the street up into the loop
    // (drawn per-street below with the gate)

    // ================= TREES: perimeter buffer + shade groves + a few lawn specimens =========
    // perimeter buffer rows (screen the neighbors) — skip the street edge so amenities stay visible
    function buffer(){ for(var q=0;q<520;q++){ var side=Math.floor(r()*4); var bx,by;
      if(side===0){ bx=2+Math.floor(r()*(W-4)); by=2+Math.floor(r()*6); }          // top
      else if(side===1){ bx=2+Math.floor(r()*6); by=2+Math.floor(r()*(H-4)); }      // left
      else if(side===2){ bx=W-8+Math.floor(r()*6); by=2+Math.floor(r()*(H-4)); }    // right
      else { bx=2+Math.floor(r()*(W-4)); by=H-9+Math.floor(r()*6); if(bx>50&&bx<86)continue; } // bottom, keep entrance clear
      if(G.get(bx,by)===7)G.set(bx,by,3); } }
    buffer();
    grove(sx+30,sy+6,9,26);                         // shade grove by the picnic area
    grove(108,52,8,20); grove(30,66,7,14);          // a couple of groves in the lawn edges
    // sparse specimen shade trees in the open lawn (keep it OPEN — just a few)
    for(i=0;i<16;i++){ var tx=40+Math.floor(r()*48), ty=40+Math.floor(r()*40); if(G.get(tx,ty)===7&&r()<0.6)G.set(tx,ty,3); }
    // benches at the trail's bends and by the amenities
    for(i=0;i<loop.length;i++) bench(loop[i][0],loop[i][1]+2);
    bench(px1+2,(py0+py1)>>1); bench(bx0-2,(by0+by1)>>1);

    // ================= GATE + ENTRANCE WALK/DRIVE from the street =================
    var gates=[];
    streets.forEach(function(edge){
      if(edge==='S'||edge==='N'){ var gx=Math.round(W*0.5), gy=(edge==='S')?H-1:0, dir=(edge==='S')?-1:1;
        for(i=-3;i<=3;i++)G.set(gx+i,gy,5);
        // walk from the gate curving up to the loop, plus a branch into the parking lot
        line(gx,gy+dir*1,63,114,2); line(gx,gy+dir*1,100,108,2);
        gates.push({edge:edge,x:gx,y:gy}); }
      else { var gy2=Math.round(H*0.5), gx2=(edge==='E')?W-1:0, dir2=(edge==='E')?-1:1;
        for(i=-3;i<=3;i++)G.set(gx2,gy2+i,5);
        line(gx2+dir2*1,gy2,(edge==='E')?98:23,gy2,2);
        gates.push({edge:edge,x:gx2,y:gy2}); }
    });

    return {g:g, W:W, H:H, streets:streets, gates:gates, footprints:K.footprints(g,function(v){return v===2;})};
  }

  var PALETTE={1:'#6a6a70',2:'#7a7266',3:'#4a4030',4:'#c9c1aa',5:'#c79a3f',6:'#566058',7:'#5a4f38',
    8:'#8a6a5a',9:'#3a4a52',10:'#c9c1aa',11:'#55555f',13:'#8f8676'};
  K.register('park', { generate:generate, body:function(c){return c===2;}, category:'leisure', palette:PALETTE });

  var API={generate:generate,footprints:function(r){return r.footprints;},palette:PALETTE};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaPark=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
