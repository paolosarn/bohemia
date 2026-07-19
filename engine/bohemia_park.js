// BOHEMIA PARK (7/19/26, v2 — REALISTIC, Paolo: "not a super park... make it realistic").
// A real NEIGHBORHOOD park is MOSTLY OPEN LAWN, generously spaced, with a FEW amenities,
// tree groves, and a curving walking loop — NOT every sport crammed into one block. So this
// is calm: a curved loop trail through open green, one playground, one basketball court, a
// picnic shelter + restroom, a small parking pullout, a modest pond, benches, and tree
// groves that break up the lawn. The open lawn is the point (that's what a park IS); it
// still reads as designed because trees, paths, and benches thread through it — not a blank
// slab. Act-1 DEAD: dead-brown turf, bare trees, empty pond; hardscape intact. Every tile named.
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

    // ---- BASE: open dead-turf lawn right out to a 1-tile edge (no blank frame) ----
    G.rect(1,1,W-2,H-2,7);

    function isSoft(c){ return c===7||c===0||c===3; }
    function path(x,y){ if(isSoft(G.get(x,y))) G.set(x,y,1); }
    function pathH(x0,x1,yy,t){ t=t||2; for(x=Math.min(x0,x1);x<=Math.max(x0,x1);x++)for(var d=0;d<t;d++)path(x,yy+d); }
    function pathV(y0,y1,xx,t){ t=t||2; for(y=Math.min(y0,y1);y<=Math.max(y0,y1);y++)for(var d=0;d<t;d++)path(xx+d,y); }
    function bench(x,y){ if(G.get(x,y)===7||G.get(x,y)===1) G.set(x,y,13); }
    // a tree GROVE: a soft cluster of dead trees (not confetti — trees clump in real parks)
    function grove(cx,cy,rad,n){ for(var k=0;k<n;k++){ var a=r()*6.283, d=r()*rad, tx=Math.round(cx+Math.cos(a)*d), ty=Math.round(cy+Math.sin(a)*d);
      if(G.get(tx,ty)===7){ G.set(tx,ty,3); if(r()<0.4&&G.get(tx+1,ty)===7)G.set(tx+1,ty,3); } } }

    // ---- 1. CURVING LOOP TRAIL (the spine — an oval, the way real park paths wind) ----
    var cx=Math.round(W*0.50), cy=Math.round(H*0.48), ea=M(34), eb=M(33);
    for(var deg=0; deg<360; deg+=0.5){ var rad2=deg*Math.PI/180; var px=Math.round(cx+Math.cos(rad2)*ea), py=Math.round(cy+Math.sin(rad2)*eb);
      G.disc(px,py,1,1); }

    // ---- 2. PLAYGROUND (one, near the entrance so parents reach it easily) ----
    var yx0=cx-M(22), yy0=cy+M(8), yx1=yx0+M(14), yy1=yy0+M(10);
    G.rect(yx0,yy0,yx1,yy1,8);
    G.rect(yx0+2,yy0+2,yx0+4,yy0+4,13); G.rect(yx1-4,yy1-4,yx1-2,yy1-2,13);   // play structures
    bench(yx0-2,(yy0+yy1)>>1); bench(yx1+2,(yy0+yy1)>>1);

    // ---- 3. ONE BASKETBALL COURT (the single hard amenity) ----
    var qx0=cx+M(9), qy0=cy+M(9), qx1=qx0+M(11), qy1=qy0+M(20);
    G.rect(qx0,qy0,qx1,qy1,6);
    for(x=qx0;x<=qx1;x++){G.set(x,qy0,4);G.set(x,qy1,4);} for(y=qy0;y<=qy1;y++){G.set(qx0,y,4);G.set(qx1,y,4);}
    for(x=qx0;x<=qx1;x++)G.set(x,(qy0+qy1)>>1,4); G.disc((qx0+qx1)>>1,(qy0+qy1)>>1,M(2),4);

    // ---- 4. PICNIC SHELTER + RESTROOM + a few tables (a shaded gathering spot) ----
    var sx=cx-M(24), sy=cy-M(20);
    G.rect(sx,sy,sx+M(7),sy+M(5),2);                                          // picnic shelter
    G.rect(sx+M(10),sy+M(1),sx+M(15),sy+M(5),2);                              // restroom
    for(i=0;i<4;i++){ bench(sx+1+i*2,sy+M(7)); bench(sx+1+i*2,sy+M(9)); }     // picnic tables

    // ---- 5. MODEST DEAD POND (a quiet corner focal point, stone rim) ----
    var wx=cx+M(16), wy=cy-M(16);
    G.disc(wx,wy,M(7),13); G.disc(wx,wy,M(6),9);

    // ---- 6. SMALL PARKING PULLOUT by the entrance (a real neighborhood park lot is small) ----
    var lx0=cx-M(14), lx1=cx+M(14), ly1=H-2, ly0=ly1-M(9);
    G.rect(lx0,ly0,lx1,ly1,1);
    for(var ry=ly0+1; ry+M(5)<=ly1; ry+=M(5)+M(3)) for(x=lx0+2;x+2<lx1;x+=3){
      G.vbar(ry,ry+M(5),x,10,1); if(r()<0.5)G.rect(x+1,ry+1,x+1,ry+M(5)-1,11); }

    // ---- 7. PATHS: loop -> each amenity, entrance -> parking -> loop ----
    pathV(cy,ly0,cx);                                                         // entrance spine down to parking
    pathH(cx,yx1,cy+M(8));                                                    // loop -> playground
    pathH(qx0,cx,cy+M(9));                                                    // loop -> court
    pathV(sy+M(5),cy,sx+M(3));                                                // shelter -> loop
    pathH(cx,wx,cy-M(16));                                                    // loop -> pond

    // ---- 8. TREE GROVES + benches: break up the open lawn like a designed park ----
    grove(M(13),M(15),M(11),40); grove(W-M(15),M(17),M(11),40);              // upper corners
    grove(M(15),H-M(19),M(10),34); grove(W-M(14),H-M(26),M(10),34);          // lower corners
    grove(cx+M(6),cy+M(22),M(7),14); grove(cx-M(2),cy-M(7),M(6),10);         // shade clumps in the lawn
    // trees lining the entrance drive
    for(i=0;i<6;i++){ if(G.get(cx-M(6),ly0-2-i*4)===7)G.set(cx-M(6),ly0-2-i*4,3); if(G.get(cx+M(6),ly0-2-i*4)===7)G.set(cx+M(6),ly0-2-i*4,3); }
    // benches spaced along the loop
    for(deg=15; deg<360; deg+=45){ rad2=deg*Math.PI/180; px=Math.round(cx+Math.cos(rad2)*(ea-2)); py=Math.round(cy+Math.sin(rad2)*(eb-2)); bench(px,py); }

    // ---- 9. GATE + short drive from the street into the parking pullout ----
    var gates=[];
    streets.forEach(function(edge){
      if(edge==='S'||edge==='N'){ var gx=Math.round(W*0.5), gy=(edge==='S')?H-1:0, dir=(edge==='S')?-1:1;
        for(i=-3;i<=3;i++)G.set(gx+i,gy,5);
        for(var s=1;s<=M(10);s++){ var yy=gy+dir*s; if(!(yy>0&&yy<H-1))break; for(var w=-2;w<=2;w++){ var c=G.get(gx+w,yy); if(isSoft(c))G.set(gx+w,yy,1); } if(G.get(gx,yy)===1&&s>M(3))break; }
        gates.push({edge:edge,x:gx,y:gy}); }
      else { var gy2=Math.round(H*0.5), gx2=(edge==='E')?W-1:0, dir2=(edge==='E')?-1:1;
        for(i=-3;i<=3;i++)G.set(gx2,gy2+i,5);
        for(var s2=1;s2<=M(10);s2++){ var xx=gx2+dir2*s2; if(!(xx>0&&xx<W-1))break; for(var w2=-2;w2<=2;w2++){ var c2=G.get(xx,gy2+w2); if(isSoft(c2))G.set(xx,gy2+w2,1); } if(G.get(xx,gy2)===1&&s2>M(3))break; }
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
